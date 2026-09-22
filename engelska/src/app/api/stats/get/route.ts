/**
 * GDPR-SÄKRAD STATISTIK-HÄMTNING – Engelskajakten
 *
 * Returnerar aggregerad, anonym statistik.
 * Kräver lösenord för åtkomst.
 *
 * Kostnaden är räknad i Redis-kommandon, för databasen ligger på en fri nivå
 * med 500 000 kommandon i månaden. Den här rutten kostade 78 kommandon per
 * hämtning — två KEYS-svep över hela nyckelrymden, ett sunionstore och två
 * slingor över fjorton dagar — och lärarvyn hämtade var trettionde sekund.
 * Det blev 9 360 kommandon i timmen från en flik som stod öppen.
 */

import { NextRequest, NextResponse } from 'next/server';
import { redis, KEY_PREFIX, getTodayKey, getDateKey } from '@/lib/redis';

const TEACHER_PASSWORD = process.env.TEACHER_PASSWORD || 'Engelskajakten';

const HISTORY_DAYS = 14;
/** Hur länge en enhet räknas som "aktiv nu" efter sitt senaste besök. */
const ACTIVE_WINDOW_MS = 5 * 60 * 1000;

interface DayStats {
  visitors: number;
  tasks: number;
  time: number;
  errors: number;
  errorsByType: Record<string, number>;
}

/**
 * Färdiga dygn ändras aldrig, så de hämtas en gång per instans och sedan inte
 * mer. Bara dagens siffror läses om vid varje hämtning. Dagens nyckel sparas
 * aldrig här, så en instans som lever över midnatt hämtar gårdagen på nytt
 * när den väl blivit gårdag.
 */
const finishedDays = new Map<string, DayStats>();

async function readDay(dateKey: string): Promise<DayStats> {
  const [visitors, tasks, time, errors, errorsByType] = await Promise.all([
    redis.scard(`${KEY_PREFIX}visitors:${dateKey}`),
    redis.get<number>(`${KEY_PREFIX}tasks:${dateKey}`),
    redis.get<number>(`${KEY_PREFIX}time:${dateKey}`),
    redis.get<number>(`${KEY_PREFIX}total_errors:${dateKey}`),
    redis.hgetall<Record<string, number>>(`${KEY_PREFIX}errors:${dateKey}`),
  ]);
  return {
    visitors: visitors || 0,
    tasks: tasks || 0,
    time: time || 0,
    errors: errors || 0,
    errorsByType: errorsByType || {},
  };
}

async function getDay(dateKey: string, today: string): Promise<DayStats> {
  if (dateKey !== today) {
    const cached = finishedDays.get(dateKey);
    if (cached) return cached;
  }
  const stats = await readDay(dateKey);
  if (dateKey !== today) finishedDays.set(dateKey, stats);
  return stats;
}

/**
 * Verkligt unika enheter. Mängden visitors:all fylls på vid varje besök, men
 * data som samlades in innan den fanns ligger bara i dagsmängderna. Den
 * hopslagningen behöver göras en enda gång — förut gjordes den om vid varje
 * hämtning, med ett KEYS-svep och ett sunionstore som växer med historiken.
 * Är mängden tom är den antingen ny eller aldrig ifylld; då, och bara då,
 * byggs den upp från dagsmängderna.
 */
async function countUniqueDevices(): Promise<number> {
  const allKey = `${KEY_PREFIX}visitors:all`;
  try {
    const known = await redis.scard(allKey);
    if (known > 0) return known;

    const dayKeys = (await redis.keys(`${KEY_PREFIX}visitors:*`)).filter((k) => k !== allKey);
    if (dayKeys.length === 0) return 0;
    await redis.sunionstore(allKey, allKey, ...dayKeys);
    return await redis.scard(allKey);
  } catch {
    return 0;
  }
}

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

    // Aktiva nu. Låg förut som en nyckel per enhet med TTL, vilket bara gick
    // att räkna med KEYS — ett svep över hela nyckelrymden. Nu är det en
    // sorterad mängd med tidsstämplar: en städning och en räkning.
    const activeKey = `${KEY_PREFIX}active`;
    await redis.zremrangebyscore(activeKey, 0, Date.now() - ACTIVE_WINDOW_MS);
    const activeNow = await redis.zcard(activeKey);

    const uniqueDevices = await countUniqueDevices();

    // Dygnen, nyaste först. Bara dagens läses om; de färdiga ligger kvar.
    const days: { date: string; stats: DayStats }[] = [];
    for (let i = 0; i < HISTORY_DAYS; i++) {
      const dateKey = getDateKey(i);
      days.push({ date: dateKey, stats: await getDay(dateKey, today) });
    }

    const todayStats = days[0].stats;

    let totalVisitors = 0;
    let totalTasks = 0;
    let totalTime = 0;
    let totalErrors = 0;
    const allErrors: Record<string, number> = {};
    for (const { stats } of days) {
      totalVisitors += stats.visitors;
      totalTasks += stats.tasks;
      totalTime += stats.time;
      totalErrors += stats.errors;
      for (const [type, count] of Object.entries(stats.errorsByType)) {
        allErrors[type] = (allErrors[type] || 0) + Number(count);
      }
    }

    const topErrors = Object.entries(allErrors)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([type, count]) => ({ type, count }));

    return NextResponse.json({
      activeNow,
      visitorsToday: todayStats.visitors,
      tasksToday: todayStats.tasks,
      totalTimeToday: formatTime(todayStats.time),
      totalTimeTodaySeconds: todayStats.time,
      totalErrorsToday: todayStats.errors,
      uniqueDevices,          // verkligt unika enheter, hela historiken
      totalVisitors,          // summa av dagliga besök senaste 14 dagarna (dubbelräknar återbesök)
      totalTasks,
      totalTime: formatTime(totalTime),
      totalTimeSeconds: totalTime,
      totalErrors,
      topErrors,
      dailyStats: days.map(({ date, stats }) => ({
        date,
        visitors: stats.visitors,
        tasks: stats.tasks,
      })).reverse(),
      gdprNote: 'Anonymiserad aggregerad statistik – ingen personlig data lagras',
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
