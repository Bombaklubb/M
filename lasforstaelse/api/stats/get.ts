import type { VercelRequest, VercelResponse } from '@vercel/node';
import { redis, KEY_PREFIX, getTodayKey, getDateKey } from '../lib/redis.js';

/**
 * GDPR-SÄKRAD STATISTIK-HÄMTNING
 *
 * Returnerar endast aggregerad, anonym statistik.
 * Kräver lösenord för åtkomst.
 */

// Lösenord för lärarvy (samma som befintligt)
const TEACHER_PASSWORD = process.env.TEACHER_PASSWORD || 'Korsängen';

interface DailyStats {
  date: string;
  visitors: number;
  tasks: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;

  // Verifiera lösenord
  if (password !== TEACHER_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const today = getTodayKey();

    // Hämta antal aktiva just nu (keys med TTL)
    const activeKeys = await redis.keys(`${KEY_PREFIX}active:*`);
    const activeNow = activeKeys.length;

    // Hämta unika besökare idag
    const visitorsToday = await redis.scard(`${KEY_PREFIX}visitors:${today}`);

    // Hämta uppgifter gjorda idag
    const tasksToday = (await redis.get<number>(`${KEY_PREFIX}tasks:${today}`)) || 0;

    // Hämta total tid idag (i sekunder)
    const totalTimeToday = (await redis.get<number>(`${KEY_PREFIX}time:${today}`)) || 0;

    // Hämta fel idag
    const totalErrorsToday = (await redis.get<number>(`${KEY_PREFIX}total_errors:${today}`)) || 0;

    // Hämta feltyper (vanligaste fel)
    const errorsMap = await redis.hgetall<Record<string, number>>(`${KEY_PREFIX}errors:${today}`) || {};

    // Hämta statistik för senaste 14 dagarna
    const dailyStats: DailyStats[] = [];
    let totalVisitors = 0;
    let totalTasks = 0;
    let totalTime = 0;
    let totalErrors = 0;

    for (let i = 0; i < 14; i++) {
      const dateKey = getDateKey(i);
      const visitors = await redis.scard(`${KEY_PREFIX}visitors:${dateKey}`);
      const tasks = (await redis.get<number>(`${KEY_PREFIX}tasks:${dateKey}`)) || 0;
      const time = (await redis.get<number>(`${KEY_PREFIX}time:${dateKey}`)) || 0;
      const errors = (await redis.get<number>(`${KEY_PREFIX}total_errors:${dateKey}`)) || 0;

      dailyStats.push({
        date: dateKey,
        visitors,
        tasks,
      });

      totalVisitors += visitors;
      totalTasks += tasks;
      totalTime += time;
      totalErrors += errors;
    }

    // Aggregera alla feltyper från senaste 14 dagarna
    const allErrors: Record<string, number> = {};
    for (let i = 0; i < 14; i++) {
      const dateKey = getDateKey(i);
      const dayErrors = await redis.hgetall<Record<string, number>>(`${KEY_PREFIX}errors:${dateKey}`) || {};
      for (const [type, count] of Object.entries(dayErrors)) {
        allErrors[type] = (allErrors[type] || 0) + (count as number);
      }
    }

    // Sortera feltyper efter antal
    const sortedErrors = Object.entries(allErrors)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([type, count]) => ({ type, count: count as number }));

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

      // Totalt (14 dagar)
      totalVisitors,
      totalTasks,
      totalTime: formatTime(totalTime),
      totalTimeSeconds: totalTime,
      totalErrors,

      // Vanligaste fel
      topErrors: sortedErrors,

      // Daglig statistik (för graf)
      dailyStats: dailyStats.reverse(), // Äldst först

      // GDPR-info
      gdprNote: 'Anonymiserad aggregerad statistik - ingen personlig data lagras',
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
