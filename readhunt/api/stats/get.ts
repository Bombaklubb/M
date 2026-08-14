import type { VercelRequest, VercelResponse } from '@vercel/node';
import { redis, KEY_PREFIX, getTodayKey, getDateKey } from '../lib/redis';
import {
  applyCors,
  getClientIp,
  rateLimit,
  tooManyRequests,
  failedLoginCount,
  recordFailedLogin,
  clearFailedLogins,
  safeEqual,
} from '../lib/security';

/**
 * GDPR-SÄKRAD STATISTIK-HÄMTNING
 *
 * Returnerar endast aggregerad, anonym statistik.
 * Kräver lösenord för åtkomst.
 */

// Lösenord för lärarvy (sätt TEACHER_PASSWORD i Vercel)
const TEACHER_PASSWORD = process.env.TEACHER_PASSWORD || 'Korsängen';

// Skydd mot brute force
const MAX_FAILED_LOGINS = 10; // per IP
const LOCKOUT_SECONDS = 900; // 15 minuter
const REQUESTS_PER_MIN = 60; // översvämningsskydd

// Hur länge en enhet räknas som "aktiv nu"
const ACTIVE_WINDOW_MS = 5 * 60 * 1000;

const DAYS = 14;

interface DailyStats {
  date: string;
  visitors: number;
  tasks: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!applyCors(req, res)) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = getClientIp(req);

  // Översvämningsskydd
  const flood = await rateLimit(`get:ip:${ip}`, REQUESTS_PER_MIN, 60);
  if (!flood.allowed) {
    return tooManyRequests(res, 60);
  }

  // Utelåsning efter för många felaktiga lösenord
  if ((await failedLoginCount(ip)) >= MAX_FAILED_LOGINS) {
    return tooManyRequests(res, LOCKOUT_SECONDS);
  }

  const { password } = req.body || {};

  // Verifiera lösenord i konstant tid
  if (typeof password !== 'string' || !safeEqual(password, TEACHER_PASSWORD)) {
    await recordFailedLogin(ip, LOCKOUT_SECONDS);
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await clearFailedLogins(ip);

  try {
    const today = getTodayKey();
    const now = Date.now();

    // Aktiva just nu via sorterad mängd (O(log N)) i stället för blockerande KEYS
    await redis.zremrangebyscore(`${KEY_PREFIX}active`, 0, now - ACTIVE_WINDOW_MS);
    const activeNow = await redis.zcount(`${KEY_PREFIX}active`, now - ACTIVE_WINDOW_MS, '+inf');

    // Hämta alla dagars data parallellt i stället för 56 sekventiella anrop
    const dateKeys = Array.from({ length: DAYS }, (_, i) => getDateKey(i));
    const perDay = await Promise.all(
      dateKeys.map(async (dateKey) => {
        const [visitors, tasks, time, errors, errorMap] = await Promise.all([
          redis.scard(`${KEY_PREFIX}visitors:${dateKey}`),
          redis.get<number>(`${KEY_PREFIX}tasks:${dateKey}`),
          redis.get<number>(`${KEY_PREFIX}time:${dateKey}`),
          redis.get<number>(`${KEY_PREFIX}total_errors:${dateKey}`),
          redis.hgetall<Record<string, number>>(`${KEY_PREFIX}errors:${dateKey}`),
        ]);
        return {
          date: dateKey,
          visitors: visitors || 0,
          tasks: tasks || 0,
          time: time || 0,
          errors: errors || 0,
          errorMap: errorMap || {},
        };
      })
    );

    const dailyStats: DailyStats[] = perDay.map((d) => ({
      date: d.date,
      visitors: d.visitors,
      tasks: d.tasks,
    }));

    const totalVisitors = perDay.reduce((s, d) => s + d.visitors, 0);
    const totalTasks = perDay.reduce((s, d) => s + d.tasks, 0);
    const totalTime = perDay.reduce((s, d) => s + d.time, 0);
    const totalErrors = perDay.reduce((s, d) => s + d.errors, 0);

    // Dagens siffror (index 0 = idag)
    const todayStats = perDay[0];

    // Aggregera alla feltyper från perioden
    const allErrors: Record<string, number> = {};
    for (const d of perDay) {
      for (const [type, count] of Object.entries(d.errorMap)) {
        allErrors[type] = (allErrors[type] || 0) + Number(count);
      }
    }
    const sortedErrors = Object.entries(allErrors)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([type, count]) => ({ type, count }));

    // Hämta statistik per årskurs/stadie
    const gradeStatsMap = (await redis.hgetall<Record<string, number>>(`${KEY_PREFIX}grades`)) || {};
    const gradeStats = [];
    for (let grade = 1; grade <= 10; grade++) {
      const count = Number(gradeStatsMap[`grade_${grade}`] || 0);
      if (count > 0) gradeStats.push({ grade, count });
    }
    gradeStats.sort((a, b) => b.count - a.count);

    // Hämta startdatum för statistik
    const statsStarted = (await redis.get<string>(`${KEY_PREFIX}stats_started`)) || today;

    // Formatera total tid
    const formatTime = (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      if (hours > 0) return `${hours} tim ${minutes} min`;
      return `${minutes} min`;
    };

    return res.status(200).json({
      // Realtidsdata
      activeNow,

      // Idag
      visitorsToday: todayStats.visitors,
      tasksToday: todayStats.tasks,
      totalTimeToday: formatTime(todayStats.time),
      totalTimeTodaySeconds: todayStats.time,
      totalErrorsToday: todayStats.errors,

      // Totalt (14 dagar)
      totalVisitors,
      totalTasks,
      totalTime: formatTime(totalTime),
      totalTimeSeconds: totalTime,
      totalErrors,
      dailyStats,

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
