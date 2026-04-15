/**
 * GDPR-SÄKRAD STATISTIK-HÄMTNING – Engelskajakten
 *
 * Returnerar aggregerad, anonym statistik.
 * Kräver lösenord för åtkomst.
 */

import { NextRequest, NextResponse } from 'next/server';
import { redis, KEY_PREFIX, getTodayKey, getDateKey } from '@/lib/redis';

const TEACHER_PASSWORD = process.env.TEACHER_PASSWORD || 'Engelskajakten';

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes} min`;
}

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (password !== TEACHER_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = getTodayKey();

    // Aktiva nu (keys med TTL)
    const activeKeys = await redis.keys(`${KEY_PREFIX}active:*`);
    const activeNow = activeKeys.length;

    // Idag
    const visitorsToday = await redis.scard(`${KEY_PREFIX}visitors:${today}`);
    const tasksToday = (await redis.get<number>(`${KEY_PREFIX}tasks:${today}`)) || 0;
    const totalTimeToday = (await redis.get<number>(`${KEY_PREFIX}time:${today}`)) || 0;
    const totalErrorsToday = (await redis.get<number>(`${KEY_PREFIX}total_errors:${today}`)) || 0;

    // Senaste 14 dagarna
    const dailyStats: { date: string; visitors: number; tasks: number }[] = [];
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

      dailyStats.push({ date: dateKey, visitors, tasks });
      totalVisitors += visitors;
      totalTasks += tasks;
      totalTime += time;
      totalErrors += errors;
    }

    // Vanligaste fel (aggregerat 14 dagar)
    const allErrors: Record<string, number> = {};
    for (let i = 0; i < 14; i++) {
      const dateKey = getDateKey(i);
      const dayErrors = await redis.hgetall<Record<string, number>>(`${KEY_PREFIX}errors:${dateKey}`) || {};
      for (const [type, count] of Object.entries(dayErrors)) {
        allErrors[type] = (allErrors[type] || 0) + (count as number);
      }
    }

    const topErrors = Object.entries(allErrors)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([type, count]) => ({ type, count: count as number }));

    return NextResponse.json({
      activeNow,
      visitorsToday,
      tasksToday,
      totalTimeToday: formatTime(totalTimeToday),
      totalTimeTodaySeconds: totalTimeToday,
      totalErrorsToday,
      totalVisitors,
      totalTasks,
      totalTime: formatTime(totalTime),
      totalTimeSeconds: totalTime,
      totalErrors,
      topErrors,
      dailyStats: dailyStats.reverse(),
      gdprNote: 'Anonymiserad aggregerad statistik – ingen personlig data lagras',
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
