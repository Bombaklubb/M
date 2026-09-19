import type { ItemMastery, LevelBand, Progress, StudentProfile } from '@/types';
import { PROGRESSION_STEPS, MAX_STEP } from '@/data/progression';
import { todayStamp, xpToLevel } from './utils';

/** Rätt på första försöket i rad som krävs för att räknas som bemästrad. */
const MASTERY_STREAK = 3;

function emptyMastery(): ItemMastery {
  return { seen: 0, correct: 0, streak: 0, mastered: false, lastSeen: '' };
}

export type MasteryBucket = 'letters' | 'words';

export function recordAnswer(
  progress: Progress,
  bucket: MasteryBucket,
  itemId: string,
  firstTryCorrect: boolean
): Progress {
  const map = { ...progress[bucket] };
  const prev = map[itemId] ?? emptyMastery();
  const streak = firstTryCorrect ? prev.streak + 1 : 0;
  map[itemId] = {
    seen: prev.seen + 1,
    correct: prev.correct + (firstTryCorrect ? 1 : 0),
    streak,
    mastered: prev.mastered || streak >= MASTERY_STREAK,
    lastSeen: todayStamp(),
  };
  return { ...progress, [bucket]: map };
}

/** Uppdaterar streak för dagar i rad. */
export function touchDailyStreak(progress: Progress): Progress {
  const today = todayStamp();
  if (progress.lastPlayedDate === today) return progress;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const consecutive = progress.lastPlayedDate === yesterday.toLocaleDateString('sv-SE');

  return {
    ...progress,
    streak: consecutive ? progress.streak + 1 : 1,
    lastPlayedDate: today,
  };
}

export function addXp(progress: Progress, xp: number): Progress {
  const total = progress.xp + xp;
  return { ...progress, xp: total, level: xpToLevel(total) };
}

/**
 * Ska eleven flyttas upp ett steg?
 *
 * Kravet är att minst 80 % av bokstäverna i det aktuella steget är
 * bemästrade.
 */
export function shouldAdvanceStep(profile: StudentProfile, progress: Progress): boolean {
  if (profile.progressionStep >= MAX_STEP) return false;
  const letters = PROGRESSION_STEPS.find((s) => s.step === profile.progressionStep)?.letters ?? [];
  if (letters.length === 0) return false;
  const mastered = letters.filter((id) => progress.letters[id]?.mastered).length;
  return mastered / letters.length >= 0.8;
}

export function masteredCount(progress: Progress): number {
  return Object.values(progress.letters).filter((m) => m.mastered).length;
}

/**
 * Hur många bemästrade bokstäver som krävs för varje nivåband.
 *
 * Talen är satta mot bokstavsresan, där stationerna ger 6, 10, 13, 16, 19,
 * 22, 25 och 29 bokstäver totalt:
 *
 *  - band 2 vid 6  – station 1 klar, eleven kan ljuda sol, arm, mor
 *  - band 3 vid 13 – t.o.m. station 3, 24 ord finns att läsa
 *  - band 4 vid 25 – t.o.m. station 7, nästan hela alfabetet
 */
const BAND_KRAV: { band: LevelBand; bemastrade: number }[] = [
  { band: 4, bemastrade: 25 },
  { band: 3, bemastrade: 13 },
  { band: 2, bemastrade: 6 },
];

/**
 * Nivåbandet eleven har förtjänat, eller null om hon redan ligger där.
 *
 * Bandet SÄNKS ALDRIG. Samma princip som bästa resultat per uppgift: det en
 * elev en gång har visat att hon klarar ska inte kunna tas ifrån henne av en
 * dålig dag. Därför jämförs det förtjänade bandet mot det sparade och det
 * högsta vinner.
 *
 * Det här ersätter reglaget som låg i lärarläget. Utan det skulle bandet
 * aldrig höjas alls och eleven fastna på igenkänningsövningar för alltid.
 */
export function shouldAdvanceLevel(
  profile: StudentProfile,
  progress: Progress
): LevelBand | null {
  const bemastrade = masteredCount(progress);
  const fortjanat = BAND_KRAV.find((b) => bemastrade >= b.bemastrade)?.band ?? 1;
  return fortjanat > profile.level ? fortjanat : null;
}
