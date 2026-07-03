// Daglig utmaning & läs-streak för Readhunt.
// "Dagens text" väljs deterministiskt utifrån dagens datum så att alla
// elever ser samma text under en och samma dag. Streaken räknas som
// antal kalenderdagar i rad (t.o.m. idag eller igår) med minst en läst text.

import { CompletedText, LibraryText } from '../types';

export const DAILY_BONUS_POINTS = 15;

const DAILY_BONUS_KEY = 'readhunt_daily_bonus_claimed';

function localDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** Dagens text – samma för alla under en given dag. */
export function getDailyText(library: LibraryText[]): LibraryText | null {
  if (library.length === 0) return null;
  // loadLibrary blandar ordningen per session – sortera på id för stabilt val
  const sorted = [...library].sort((a, b) => a.id.localeCompare(b.id));
  const seed = hashString(localDateString(new Date()));
  return sorted[seed % sorted.length];
}

/** Antal dagar i rad (t.o.m. idag, eller igår om inget lästs ännu idag). */
export function getStreak(completedTexts: CompletedText[]): number {
  if (completedTexts.length === 0) return 0;

  const days = new Set(
    completedTexts.map((t) => localDateString(new Date(t.completedAt)))
  );

  const cursor = new Date();
  // Om inget lästs idag börjar räkningen från igår (streaken är inte bruten än)
  if (!days.has(localDateString(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (days.has(localDateString(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/** Har dagens bonus redan hämtats? (skydd mot att spela om samma text) */
export function isDailyBonusClaimedToday(): boolean {
  try {
    return localStorage.getItem(DAILY_BONUS_KEY) === localDateString(new Date());
  } catch {
    return false;
  }
}

export function claimDailyBonus(): void {
  try {
    localStorage.setItem(DAILY_BONUS_KEY, localDateString(new Date()));
  } catch { /* ignore */ }
}
