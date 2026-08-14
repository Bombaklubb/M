import type { VercelRequest, VercelResponse } from '@vercel/node';
import { redis, KEY_PREFIX, getTodayKey } from '../lib/redis';
import { applyCors, getClientIp, rateLimit, tooManyRequests } from '../lib/security';

/**
 * GDPR-SÄKRAD STATISTIK-TRACKING
 *
 * Denna endpoint samlar IN anonym, aggregerad statistik.
 * INGEN personlig information lagras - endast:
 * - Anonymt slumpmässigt device-ID (genereras på klienten, kan inte kopplas till person)
 * - Aggregerade räknare (antal besökare, uppgifter, fel, tid)
 *
 * Data som INTE lagras:
 * - IP-adresser (används endast tillfälligt för rate limiting, sparas aldrig i klartext)
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
    grade?: number; // Årskurs/stadie (1-10)
  };
}

// Rate limits. Generösa per IP eftersom en hel klass delar skolans utgående IP:
// en elev som gör klart en text skickar ca 8 anrop, 30 elever samtidigt ≈ 240/min.
const PER_DEVICE_PER_MIN = 60;
const PER_IP_PER_MIN = 900;

// Hur länge en enhet räknas som "aktiv nu"
const ACTIVE_WINDOW_MS = 5 * 60 * 1000;

// Tillåtna värden för questionType (hindrar att godtyckliga strängar skapar Redis-fält)
const ALLOWED_QUESTION_TYPES = new Set(['literal', 'inference']);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!applyCors(req, res)) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }

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

    if (!event || !event.type || !event.deviceId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validera deviceId format (ska vara ett UUID utan personlig info)
    if (!/^[a-f0-9-]{36}$/.test(event.deviceId)) {
      return res.status(400).json({ error: 'Invalid deviceId format' });
    }

    // Rate limiting: per enhet (fångar skenande klienter) och per IP (fångar spam)
    const ip = getClientIp(req);
    const [byDevice, byIp] = await Promise.all([
      rateLimit(`track:dev:${event.deviceId}`, PER_DEVICE_PER_MIN, 60),
      rateLimit(`track:ip:${ip}`, PER_IP_PER_MIN, 60),
    ]);
    if (!byDevice.allowed || !byIp.allowed) {
      return tooManyRequests(res, 60);
    }

    switch (event.type) {
      case 'pageview': {
        const now = Date.now();
        // Lägg till deviceId i dagens unika besökare (Set = unika värden)
        await redis.sadd(`${KEY_PREFIX}visitors:${today}`, event.deviceId);
        // Räkna totalt antal sidvisningar
        await redis.incr(`${KEY_PREFIX}pageviews:${today}`);
        // Aktiva just nu: sorterad mängd med tidsstämpel som score.
        // Ger O(log N)-uppslag i stället för ett blockerande KEYS-anrop.
        await redis.zadd(`${KEY_PREFIX}active`, { score: now, member: event.deviceId });
        // Städa bort inaktuella poster så mängden inte växer obegränsat
        await redis.zremrangebyscore(`${KEY_PREFIX}active`, 0, now - ACTIVE_WINDOW_MS);
        // Spara startdatum för statistik (endast första gången)
        await redis.setnx(`${KEY_PREFIX}stats_started`, today);
        break;
      }

      case 'task_complete': {
        // Öka räknaren för uppgifter gjorda
        await redis.incr(`${KEY_PREFIX}tasks:${today}`);
        // Spåra användning per årskurs/stadie
        const grade = Number(event.data?.grade);
        if (Number.isInteger(grade) && grade >= 1 && grade <= 10) {
          await redis.hincrby(`${KEY_PREFIX}grades`, `grade_${grade}`, 1);
        }
        // Om det var fel, öka felräknaren
        if (event.data?.correct === false && ALLOWED_QUESTION_TYPES.has(event.data?.questionType || '')) {
          await redis.hincrby(`${KEY_PREFIX}errors:${today}`, event.data!.questionType!, 1);
          await redis.incr(`${KEY_PREFIX}total_errors:${today}`);
        }
        break;
      }

      case 'session_time': {
        // Lägg till tid till total tid
        const seconds = Number(event.data?.timeSeconds);
        if (Number.isFinite(seconds) && seconds > 0) {
          await redis.incrby(
            `${KEY_PREFIX}time:${today}`,
            Math.min(Math.floor(seconds), 3600) // Max 1 timme per session
          );
        }
        break;
      }

      case 'error': {
        // Spåra feltyper för "vanligaste fel"
        if (ALLOWED_QUESTION_TYPES.has(event.data?.questionType || '')) {
          await redis.hincrby(`${KEY_PREFIX}errors:${today}`, event.data!.questionType!, 1);
        }
        break;
      }

      default:
        return res.status(400).json({ error: 'Unknown event type' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Track error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
