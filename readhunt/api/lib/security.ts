import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash, timingSafeEqual } from 'crypto';
import { redis, KEY_PREFIX } from './redis';

/**
 * Delat säkerhetslager för API-endpoints.
 *
 * - CORS mot en allowlist i stället för '*'
 * - Rate limiting i Redis (fast fönster)
 * - Konstant-tidsjämförelse av lösenord
 */

const DEFAULT_ORIGINS = [
  'https://readhunt.vercel.app',
  'http://localhost:5173',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:4173',
];

/** Tillåtna origins. Sätt ALLOWED_ORIGINS (kommaseparerad) i Vercel för egen domän. */
export function allowedOrigins(): string[] {
  const fromEnv = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return fromEnv.length ? fromEnv : DEFAULT_ORIGINS;
}

/** Vercel preview-deployer: https://readhunt-<hash>-<scope>.vercel.app */
function isPreviewDeployment(origin: string): boolean {
  return /^https:\/\/readhunt[a-z0-9-]*\.vercel\.app$/.test(origin);
}

/**
 * Sätter CORS-headers. Returnerar false om anropets origin inte är tillåten.
 *
 * OBS: CORS skyddar bara webbläsare. Anrop utan Origin (curl, script) släpps
 * igenom här och stoppas i stället av rate limiting nedan.
 */
export function applyCors(req: VercelRequest, res: VercelResponse): boolean {
  const origin = req.headers.origin;
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (!origin) return true;

  if (allowedOrigins().includes(origin) || isPreviewDeployment(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    return true;
  }
  return false;
}

/** Klientens IP via Vercels x-forwarded-for. */
export function getClientIp(req: VercelRequest): string {
  const fwd = req.headers['x-forwarded-for'];
  const raw = Array.isArray(fwd) ? fwd[0] : fwd || '';
  return raw.split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

/**
 * Rate limit med fast fönster.
 *
 * Fail-open: om Redis inte svarar släpps anropet igenom, så att ett
 * Redis-avbrott aldrig gör appen oanvändbar för eleverna.
 */
export async function rateLimit(
  bucket: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  try {
    const window = Math.floor(Date.now() / 1000 / windowSeconds);
    const key = `${KEY_PREFIX}rl:${bucket}:${window}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, windowSeconds * 2);
    return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
  } catch {
    return { allowed: true, remaining: limit };
  }
}

/** Räknar misslyckade inloggningar per IP (för utelåsning vid brute force). */
export async function failedLoginCount(ip: string): Promise<number> {
  try {
    return (await redis.get<number>(`${KEY_PREFIX}authfail:${ip}`)) || 0;
  } catch {
    return 0;
  }
}

export async function recordFailedLogin(ip: string, windowSeconds = 900): Promise<void> {
  try {
    const key = `${KEY_PREFIX}authfail:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, windowSeconds);
  } catch {
    /* ignorera – misslyckad loggning får inte blockera svaret */
  }
}

export async function clearFailedLogins(ip: string): Promise<void> {
  try {
    await redis.del(`${KEY_PREFIX}authfail:${ip}`);
  } catch {
    /* ignorera */
  }
}

/** Jämför två strängar i konstant tid (skyddar mot timing-attacker). */
export function safeEqual(a: string, b: string): boolean {
  const ha = new Uint8Array(createHash('sha256').update(String(a)).digest());
  const hb = new Uint8Array(createHash('sha256').update(String(b)).digest());
  return timingSafeEqual(ha, hb);
}

/** Skickar 429 med Retry-After. */
export function tooManyRequests(res: VercelResponse, retryAfterSeconds: number) {
  res.setHeader('Retry-After', String(retryAfterSeconds));
  return res.status(429).json({ error: 'Too many requests' });
}
