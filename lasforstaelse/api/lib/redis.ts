import { Redis } from '@upstash/redis';

// Redis-klient för Upstash (via Vercel KV)
// Stödjer flera variabelnamn för flexibilitet:
// - KV_REST_API_URL / KV_REST_API_TOKEN (standard)
// - svenskajakten_KV_REST_API_URL / svenskajakten_KV_REST_API_TOKEN (prefix)
// - UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN (Upstash standard)

const url =
  process.env.KV_REST_API_URL ||
  process.env.svenskajakten_KV_REST_API_URL ||
  process.env.UPSTASH_REDIS_REST_URL;

const token =
  process.env.KV_REST_API_TOKEN ||
  process.env.svenskajakten_KV_REST_API_TOKEN ||
  process.env.UPSTASH_REDIS_REST_TOKEN;

if (!url || !token) {
  throw new Error('Redis environment variables not configured');
}

export const redis = new Redis({ url, token });

// Prefix för alla nycklar (för att separera från andra appar)
export const KEY_PREFIX = 'lasjakten:';

// Hjälpfunktion för att få dagens datum i YYYY-MM-DD format
export function getTodayKey(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

// Hjälpfunktion för att få datum för N dagar sedan
export function getDateKey(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}
