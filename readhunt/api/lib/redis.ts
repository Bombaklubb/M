import { kv } from '@vercel/kv';

// Använder Vercel KV - läser automatiskt KV_REST_API_URL och KV_REST_API_TOKEN
export const redis = kv;

// Prefix för alla nycklar (för att separera från andra appar)
export const KEY_PREFIX = 'readhunt:';

// Dagarna räknas i svensk tid. Med UTC hamnade allt mellan 00 och 02
// svensk tid på föregående dag.
const swedishDate = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Europe/Stockholm',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

// Dagens datum i YYYY-MM-DD format (svensk tid)
export function getTodayKey(): string {
  return swedishDate.format(new Date());
}

// Datum för N dagar sedan i YYYY-MM-DD format (svensk tid)
export function getDateKey(daysAgo: number): string {
  return swedishDate.format(new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000));
}

// Dagsnycklar (besökare, texter, tid, fel) raderas automatiskt efter så här
// lång tid. Lärarvyn visar bara de senaste 14 dagarna, och utan utgångstid
// växte databasen för evigt.
export const DAILY_KEY_TTL_SECONDS = 40 * 24 * 60 * 60;
