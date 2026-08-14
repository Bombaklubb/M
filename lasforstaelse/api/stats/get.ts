import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash, timingSafeEqual } from 'node:crypto';
import {
  redis, KEY_PREFIX, getTodayKey, getDateKey, ALLA_ENHETER, AKTIVA, AKTIV_FONSTER_MS,
} from '../lib/redis';

/**
 * GDPR-SÄKRAD STATISTIK-HÄMTNING
 *
 * Returnerar endast aggregerad, anonym statistik.
 * Kräver lösenord för åtkomst.
 */

// Lösenord för lärarvy (samma som befintligt)
const TEACHER_PASSWORD = process.env.TEACHER_PASSWORD || 'Korsängen';

// Ingen Access-Control-Allow-Origin här. Appen och endpointen ligger på samma
// domän, så webbläsaren behöver ingen CORS-header för att anropet ska gå fram.
// Tidigare stod det '*', vilket lät vilken webbplats som helst skicka
// lösenordsgissningar via besökarnas webbläsare.
function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');
}

/** Jämförelse som tar lika lång tid oavsett var strängarna börjar skilja sig. */
function likaHemlighet(a: string, b: string): boolean {
  const ha = new Uint8Array(createHash('sha256').update(a).digest());
  const hb = new Uint8Array(createHash('sha256').update(b).digest());
  return timingSafeEqual(ha, hb);
}

// Enkel spärr mot lösenordsgissning: fem misslyckade försök per IP och kvart.
const MAX_FORSOK = 5;
const SPARR_SEKUNDER = 900;

async function forsokKvar(ip: string): Promise<number> {
  const nyckel = `${KEY_PREFIX}login_fail:${ip}`;
  const antal = (await redis.get<number>(nyckel)) || 0;
  return MAX_FORSOK - antal;
}

async function raknaMisslyckande(ip: string): Promise<void> {
  const nyckel = `${KEY_PREFIX}login_fail:${ip}`;
  const antal = await redis.incr(nyckel);
  if (antal === 1) await redis.expire(nyckel, SPARR_SEKUNDER);
}

async function nollstallMisslyckanden(ip: string): Promise<void> {
  await redis.del(`${KEY_PREFIX}login_fail:${ip}`);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // req.body är undefined när anropet saknar kropp. Destrukturering av
  // undefined kastar, och det sker före try-blocket nedan – lärarvyn fick då
  // ett oförklarat 500 i stället för 401.
  const { password } = (req.body || {}) as { password?: unknown };

  const vidarebefordrad = req.headers['x-forwarded-for'];
  const ip = (Array.isArray(vidarebefordrad) ? vidarebefordrad[0] : vidarebefordrad || 'okand')
    .split(',')[0]
    .trim();

  // Verifiera lösenord, med spärr mot upprepade gissningar
  try {
    if ((await forsokKvar(ip)) <= 0) {
      return res.status(429).json({ error: 'For many attempts' });
    }
    if (typeof password !== 'string' || !likaHemlighet(password, TEACHER_PASSWORD)) {
      await raknaMisslyckande(ip);
      return res.status(401).json({ error: 'Unauthorized' });
    }
    await nollstallMisslyckanden(ip);
  } catch (error) {
    console.error('Auth check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }

  try {
    const today = getTodayKey();

    // Dagens siffror. Här låg också en hgetall på dagens feltyper vars resultat
    // aldrig användes – feltyperna räknas i fjortondagarsslingan nedan.
    const nu = Date.now();
    const grans = nu - AKTIV_FONSTER_MS;

    // Rensa bort enheter som inte hörts av inom fönstret, så att mängden inte
    // växer i onödan, och räkna dem som är kvar. Tidigare gjordes det med
    // redis.keys(), som läser igenom hela nyckelrymden vid varje sidladdning i
    // lärarvyn. En sorterad mängd med tidsstämpel som poäng ger samma svar utan
    // att röra något annat än de egna posterna.
    await redis.zremrangebyscore(AKTIVA, 0, grans);

    const [activeNow, visitorsToday, enheterTotalt, tasksRa, timeRa, errorsRa] =
      await Promise.all([
        redis.zcount(AKTIVA, grans, '+inf'),
        redis.scard(`${KEY_PREFIX}visitors:${today}`),
        redis.scard(ALLA_ENHETER),
        redis.get<number>(`${KEY_PREFIX}tasks:${today}`),
        redis.get<number>(`${KEY_PREFIX}time:${today}`),
        redis.get<number>(`${KEY_PREFIX}total_errors:${today}`),
      ]);
    // Mängden med alla enheter började föras först nu. Historiken finns dock
    // kvar i dagsmängderna, som aldrig har fått någon utgångstid, så första
    // gången bygger vi totalen ur dem i stället för att börja om från noll.
    // Unionen görs på servern och räknas därefter en gång.
    let alla = enheterTotalt;
    if (alla === 0) {
      const dagsnycklar = (await redis.keys(`${KEY_PREFIX}visitors:*`)).filter(
        (k) => k !== ALLA_ENHETER
      );
      if (dagsnycklar.length) {
        // sunionstore vill ha nycklarna som separata argument. Typningen i
        // klienten kräver minst en, vilket är garanterat av kontrollen ovan.
        await redis.sunionstore(ALLA_ENHETER, dagsnycklar[0], ...dagsnycklar.slice(1));
        alla = await redis.scard(ALLA_ENHETER);
      }
    }

    const tasksToday = tasksRa || 0;
    const totalTimeToday = timeRa || 0;
    const totalErrorsToday = errorsRa || 0;

    // Hämta statistik för senaste 14 dagarna.
    //
    // Dagarna hämtades tidigare en i taget, med fyra väntande anrop per dag och
    // ett femte varv för feltyperna – runt sjuttio round-trips i följd innan
    // svaret gick iväg. Läsningarna är oberoende av varandra, så de görs nu
    // samtidigt. Läraren väntar på den långsammaste, inte på summan.
    const dagar = await Promise.all(
      Array.from({ length: 14 }, (_, i) => getDateKey(i)).map(async (dateKey) => {
        const [visitors, tasks, time, errors, dayErrors] = await Promise.all([
          redis.scard(`${KEY_PREFIX}visitors:${dateKey}`),
          redis.get<number>(`${KEY_PREFIX}tasks:${dateKey}`),
          redis.get<number>(`${KEY_PREFIX}time:${dateKey}`),
          redis.get<number>(`${KEY_PREFIX}total_errors:${dateKey}`),
          redis.hgetall<Record<string, number>>(`${KEY_PREFIX}errors:${dateKey}`),
        ]);
        return {
          visitors,
          tasks: tasks || 0,
          time: time || 0,
          errors: errors || 0,
          dayErrors: dayErrors || {},
        };
      })
    );

    let totalTasks = 0;
    let totalTime = 0;
    let totalErrors = 0;

    // Aggregera alla feltyper från senaste 14 dagarna
    const allErrors: Record<string, number> = {};

    for (const dag of dagar) {
      totalTasks += dag.tasks;
      totalTime += dag.time;
      totalErrors += dag.errors;
      for (const [type, count] of Object.entries(dag.dayErrors)) {
        allErrors[type] = (allErrors[type] || 0) + (count as number);
      }
    }

    // Sortera feltyper efter antal
    const sortedErrors = Object.entries(allErrors)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([type, count]) => ({ type, count: count as number }));

    // Hämta statistik per årskurs/stadie
    const gradeStatsMap = await redis.hgetall<Record<string, number>>(`${KEY_PREFIX}grades`) || {};
    const gradeStats = [];
    for (let grade = 1; grade <= 10; grade++) {
      const count = gradeStatsMap[`grade_${grade}`] || 0;
      if (count > 0) {
        gradeStats.push({ grade, count: count as number });
      }
    }
    // Sortera efter användning (högst först)
    gradeStats.sort((a, b) => b.count - a.count);

    // Hämta startdatum för statistik
    const statsStarted = await redis.get<string>(`${KEY_PREFIX}stats_started`) || today;

    // Formatera total tid
    const formatTime = (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      if (hours > 0) {
        return `${hours} tim ${minutes} min`;
      }
      return `${minutes} min`;
    };

    return res.status(200).json({
      // Realtidsdata
      activeNow,

      // Idag
      visitorsToday,
      tasksToday,
      totalTimeToday: formatTime(totalTimeToday),
      totalTimeTodaySeconds: totalTimeToday,
      totalErrorsToday,

      // Unika enheter sedan appen togs i bruk. Tidigare summerades de dagliga
      // unika besökarna över fjorton dagar, vilket räknade samma Chromebook en
      // gång per dag den användes. En mängd räknar varje id en gång.
      totalVisitors: alla,

      // Övriga totaler nedan gäller fjorton dagar bakåt.
      totalTasks,
      totalTime: formatTime(totalTime),
      totalTimeSeconds: totalTime,
      totalErrors,

      // Vanligaste fel
      topErrors: sortedErrors,

      // Statistik per årskurs/stadie
      gradeStats,

      // Startdatum för statistikinsamling
      statsStarted,

      // GDPR-info
      gdprNote: 'Anonymiserad aggregerad statistik - ingen personlig data lagras',
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
