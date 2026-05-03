/**
 * GDPR-SÄKRAD STATISTIK-TRACKING – Engelskajakten
 *
 * Samlar IN anonym, aggregerad statistik.
 * INGEN personlig information lagras.
 */

import { NextRequest, NextResponse } from 'next/server';
import { redis, KEY_PREFIX, getTodayKey } from '@/lib/redis';

interface TrackEvent {
  type: 'pageview' | 'task_complete' | 'error' | 'session_time';
  deviceId: string;
  data?: {
    questionType?: string;
    timeSeconds?: number;
    correct?: boolean;
  };
}

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
        await redis.incr(`${KEY_PREFIX}pageviews:${today}`);
        // TTL 5 minuter för "aktiva nu"
        await redis.set(`${KEY_PREFIX}active:${event.deviceId}`, '1', { ex: 300 });
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
