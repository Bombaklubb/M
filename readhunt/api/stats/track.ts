import type { VercelRequest, VercelResponse } from '@vercel/node';
import { redis, KEY_PREFIX, getTodayKey } from '../lib/redis';

/**
 * GDPR-SÄKRAD STATISTIK-TRACKING
 *
 * Denna endpoint samlar IN anonym, aggregerad statistik.
 * INGEN personlig information lagras - endast:
 * - Anonymt slumpmässigt device-ID (genereras på klienten, kan inte kopplas till person)
 * - Aggregerade räknare (antal besökare, uppgifter, fel, tid)
 *
 * Data som INTE lagras:
 * - IP-adresser
 * - Namn eller användarnamn
 * - Specifika svar eller resultat kopplade till individer
 * - Webbläsarfingerprints
 */

interface TrackEvent {
  type: 'pageview' | 'task_complete' | 'error' | 'session_time';
  deviceId: string; // Anonymt slumpmässigt ID
  data?: {
    questionType?: string; // För vanligaste fel
    timeSeconds?: number; // För total tid
    correct?: boolean; // För att räkna fel
    grade?: number; // Årskurs/stadie (1-9)
  };
}

// CORS headers
function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Endast POST tillåtet
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const event: TrackEvent = req.body;
    const today = getTodayKey();

    if (!event.type || !event.deviceId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validera deviceId format (ska vara ett UUID utan personlig info)
    if (!/^[a-f0-9-]{36}$/.test(event.deviceId)) {
      return res.status(400).json({ error: 'Invalid deviceId format' });
    }

    switch (event.type) {
      case 'pageview':
        // Lägg till deviceId i dagens unika besökare (Set = unika värden)
        await redis.sadd(`${KEY_PREFIX}visitors:${today}`, event.deviceId);
        // Räkna totalt antal sidvisningar
        await redis.incr(`${KEY_PREFIX}pageviews:${today}`);
        // Uppdatera senast aktiv (för "inloggade nu")
        await redis.set(`${KEY_PREFIX}active:${event.deviceId}`, '1', { ex: 300 }); // 5 min TTL
        // Spara startdatum för statistik (endast första gången)
        await redis.setnx(`${KEY_PREFIX}stats_started`, today);
        break;

      case 'task_complete':
        // Öka räknaren för uppgifter gjorda
        await redis.incr(`${KEY_PREFIX}tasks:${today}`);
        // Spåra användning per årskurs/stadie
        if (event.data?.grade && event.data.grade >= 1 && event.data.grade <= 10) {
          await redis.hincrby(`${KEY_PREFIX}grades`, `grade_${event.data.grade}`, 1);
        }
        // Om det var fel, öka felräknaren
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
        // Lägg till tid till total tid
        if (event.data?.timeSeconds && event.data.timeSeconds > 0) {
          await redis.incrby(
            `${KEY_PREFIX}time:${today}`,
            Math.min(event.data.timeSeconds, 3600) // Max 1 timme per session
          );
        }
        break;

      case 'error':
        // Spåra feltyper för "vanligaste fel"
        if (event.data?.questionType) {
          await redis.hincrby(
            `${KEY_PREFIX}errors:${today}`,
            event.data.questionType,
            1
          );
        }
        break;
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Track error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
