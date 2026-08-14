import { kv } from '@vercel/kv';

// Använder Vercel KV - läser automatiskt KV_REST_API_URL och KV_REST_API_TOKEN
export const redis = kv;

// Prefix för alla nycklar (för att separera från andra appar)
export const KEY_PREFIX = 'lasjakten:';

/** Mängden med alla enhets-id som någonsin besökt appen. */
export const ALLA_ENHETER = `${KEY_PREFIX}visitors:all`;

/** Sorterad mängd över senast sedda enheter, med tidsstämpel som poäng. */
export const AKTIVA = `${KEY_PREFIX}active_z`;

/**
 * Hur länge en enhet räknas som aktiv efter sin senaste händelse.
 *
 * Appen hör av sig vid start, vid varje besvarad fråga och var femte minut
 * under en pågående session. Tio minuter är därför gott och väl längre än
 * det längsta normala uppehållet, men kort nog att en elev som stänger
 * datorn försvinner ur siffran inom en lektionspaus.
 */
export const AKTIV_FONSTER_MS = 10 * 60 * 1000;

/**
 * Dagens datum i svensk tid, som YYYY-MM-DD.
 *
 * Tidigare användes toISOString(), alltså UTC. Under sommartid innebar det att
 * statistikdygnet rullade vid 02:00 svensk tid medan lärarvyns rubrik visade
 * svenskt datum – läsning strax efter midnatt hamnade på gårdagen. Skolan
 * arbetar i svensk tid, så det är den som gäller.
 *
 * sv-SE ger just formatet YYYY-MM-DD, vilket är detsamma som nycklarna redan
 * använder. Befintliga nycklar behöver därför inte döpas om.
 */
export function getTodayKey(): string {
  return datumIStockholm(new Date());
}

/** Datum för N dagar sedan, i svensk tid. */
export function getDateKey(daysAgo: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return datumIStockholm(d);
}

function datumIStockholm(d: Date): string {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Stockholm',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}
