import { Redis } from '@upstash/redis';

// Redis-klient för Upstash (via Vercel KV)
// Använder Redis.fromEnv() som automatiskt hittar miljövariablerna:
// - KV_REST_API_URL och KV_REST_API_TOKEN (Vercel standard)
// - eller UPSTASH_REDIS_REST_URL och UPSTASH_REDIS_REST_TOKEN
export const redis = Redis.fromEnv();

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
