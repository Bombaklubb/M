// Vercel serverless function – returns aggregated anonymous stats for teacher view
// Password-protected. No personal data returned.
// All keys are prefixed with "matt:" to avoid collisions with other apps in the same database.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const password = req.query.password ?? req.headers['x-teacher-password'];
  if (password !== process.env.TEACHER_PASSWORD) {
    return res.status(401).json({ error: 'Åtkomst nekad' });
  }

  try {
    const today = new Date().toISOString().split('T')[0];

    // Build last-30-days date list
    const days30: string[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86_400_000);
      days30.push(d.toISOString().split('T')[0]);
    }
    const last14 = days30.slice(-14);

    // Fetch all daily keys in parallel
    const [visitCounts, exerciseCounts, totalTimeSec, errorKeys, heartbeatKeys] = await Promise.all([
      // HyperLogLog counts per day (visitors)
      Promise.all(days30.map(d => redis.pfcount(`matt:visits:daily:${d}`))),
      // Exercise counts per day
      Promise.all(days30.map(d => redis.get<number>(`matt:exercises:daily:${d}`))),
      // Total time in seconds
      redis.get<number>('matt:time:total'),
      // All error topic keys
      redis.keys('matt:errors:topic:*'),
      // Active heartbeats (users online now, 5-min window)
      redis.keys('matt:heartbeat:*'),
    ]);

    // Aggregate
    const activeNow = heartbeatKeys.length;
    const visitorsToday = visitCounts[visitCounts.length - 1] ?? 0;
    const visitorsMonth = await redis.pfcount(...days30.map(d => `matt:visits:daily:${d}`));
    const totalExercises = (exerciseCounts as (number | null)[]).reduce((s, v) => s + (v ?? 0), 0);

    // Fetch error counts
    let topErrors: { topic: string; count: number }[] = [];
    if (errorKeys.length > 0) {
      const errorVals = await Promise.all(errorKeys.map(k => redis.get<number>(k)));
      topErrors = errorKeys
        .map((k, i) => ({
          topic: String(k).replace('matt:errors:topic:', ''),
          count: Number(errorVals[i] ?? 0),
        }))
        .filter(e => e.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    }

    // 14-day chart
    const daily14 = last14.map((date, i) => ({
      date,
      exercises: Number((exerciseCounts as (number | null)[])[days30.length - 14 + i] ?? 0),
      visitors: visitCounts[days30.length - 14 + i] ?? 0,
    }));

    const totalErrors = topErrors.reduce((s, e) => s + e.count, 0);
    const totalTimeMinutes = Math.round((totalTimeSec ?? 0) / 60);

    res.status(200).json({
      activeNow,
      visitorsToday,
      visitorsMonth,
      totalExercises,
      totalErrors,
      totalTimeMinutes,
      topErrors,
      daily14,
    });
  } catch (err) {
    console.error('teacher-stats error:', err);
    res.status(500).json({ error: 'Redis-fel' });
  }
}
