// Vercel serverless function – takes anonymous usage events and writes to Upstash Redis
// No personal data is stored: no names, no IPs, no cookies.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const today = new Date().toISOString().split('T')[0];

    if (body.type === 'heartbeat' && body.deviceId) {
      // TTL 5 min — used to count "inloggade nu"
      await redis.set(`heartbeat:${body.deviceId}`, '1', { ex: 300 });
    } else if (body.type === 'visit' && body.deviceId) {
      // HyperLogLog — cannot reverse-engineer individual IDs
      await redis.pfadd(`visits:daily:${today}`, body.deviceId);
    } else if (body.type === 'answer') {
      await redis.incr(`exercises:daily:${today}`);
      if (body.correct === false || body.correct === 'false') {
        const key = `errors:topic:${String(body.topic ?? 'okänt').slice(0, 80)}`;
        await redis.incr(key);
      }
    } else if (body.type === 'session' && body.durationSeconds > 0) {
      await redis.incrby('time:total', Math.round(Number(body.durationSeconds)));
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('event handler error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
}
