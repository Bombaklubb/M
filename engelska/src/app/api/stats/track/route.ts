/**
 * GDPR-SÄKRAD STATISTIK-TRACKING – Engelskajakten
 *
 * Samlar IN anonym, aggregerad statistik.
 * INGEN personlig information lagras.
 */

import { NextRequest, NextResponse } from 'next/server';
import { redis, KEY_PREFIX, getTodayKey } from '@/lib/redis';

interface TrackEvent {
  type: 'pageview' | 'task_complete' | 'error' | 'session_time' | 'batch';
  deviceId: string;
  data?: {
    questionType?: string;
    timeSeconds?: number;
    correct?: boolean;
    /** batch: klarade kapitel sedan förra anropet. */
    tasks?: { correct?: boolean; questionType?: string }[];
  };
}

/** Rimlig övre gräns för kapitel i ett anrop (tio minuter). */
const MAX_TASKS_PER_BATCH = 100;

export async function POST(req: NextRequest) {
  try {
    const event: TrackEvent = await req.json();
    const today = getTodayKey();

    if (!event.type || !event.deviceId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!/^[a-f0-9-]{36}$/.test(event.deviceId)) {
      return NextResponse.json({ error: 'Invalid deviceId format' }, { status: 400 });
    }

    switch (event.type) {
      case 'pageview':
        await redis.sadd(`${KEY_PREFIX}visitors:${today}`, event.deviceId);
        // Permanent mängd över ALLA enheter som någonsin besökt appen.
        // Dagsmängderna ovan kan bara summeras (vilket dubbelräknar
        // återkommande elever) – den här ger verkligt unika enheter.
        await redis.sadd(`${KEY_PREFIX}visitors:all`, event.deviceId);
        await redis.incr(`${KEY_PREFIX}pageviews:${today}`);
        // "Aktiva nu" som en sorterad mängd med tidsstämpel i stället för en
        // nyckel per enhet med TTL. Nycklarna gick bara att räkna med KEYS,
        // ett svep över hela nyckelrymden vid varje hämtning i lärarvyn.
        // Samma kostnad här, men räkningen blir ett enda zcard.
        await redis.zadd(`${KEY_PREFIX}active`, { score: Date.now(), member: event.deviceId });
        break;

      case 'task_complete':
        await redis.incr(`${KEY_PREFIX}tasks:${today}`);
        if (event.data?.correct === false && event.data?.questionType) {
          await redis.hincrby(
            `${KEY_PREFIX}errors:${today}`,
            event.data.questionType,
            1
          );
          await redis.incr(`${KEY_PREFIX}total_errors:${today}`);
        }
        break;

      case 'session_time':
        if (event.data?.timeSeconds && event.data.timeSeconds > 0) {
          await redis.incrby(
            `${KEY_PREFIX}time:${today}`,
            Math.min(event.data.timeSeconds, 3600)
          );
        }
        break;

      // Appen samlar ihop klarade kapitel och tid och skickar dem i ett anrop
      // (se analyticsService). task_complete och session_time ovan finns kvar
      // för elever som har en äldre version av sidan öppen.
      case 'batch': {
        const tasks = Array.isArray(event.data?.tasks)
          ? event.data.tasks.slice(0, MAX_TASKS_PER_BATCH)
          : [];
        if (tasks.length > 0) {
          await redis.incrby(`${KEY_PREFIX}tasks:${today}`, tasks.length);
          const errorsByType: Record<string, number> = {};
          for (const t of tasks) {
            if (t?.correct === false && typeof t.questionType === 'string' && t.questionType.length <= 40) {
              errorsByType[t.questionType] = (errorsByType[t.questionType] ?? 0) + 1;
            }
          }
          let totalErrors = 0;
          for (const [questionType, n] of Object.entries(errorsByType)) {
            await redis.hincrby(`${KEY_PREFIX}errors:${today}`, questionType, n);
            totalErrors += n;
          }
          if (totalErrors > 0) await redis.incrby(`${KEY_PREFIX}total_errors:${today}`, totalErrors);
        }
        const seconds = Number(event.data?.timeSeconds);
        if (seconds > 0) {
          await redis.incrby(`${KEY_PREFIX}time:${today}`, Math.min(Math.round(seconds), 3600));
        }
        // Sidvisningen skickas bara en gång per flik, så varje rapport håller
        // också eleven kvar under "Inloggade nu" i lärarvyn.
        await redis.zadd(`${KEY_PREFIX}active`, { score: Date.now(), member: event.deviceId });
        break;
      }

      case 'error':
        if (event.data?.questionType) {
          await redis.hincrby(
            `${KEY_PREFIX}errors:${today}`,
            event.data.questionType,
            1
          );
        }
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
