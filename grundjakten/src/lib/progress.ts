import type { ItemMastery, Progress, StudentProfile } from '@/types';
import { PROGRESSION_STEPS, MAX_STEP } from '@/data/progression';
import { todayStamp, xpToLevel } from './utils';

/** Rätt på första försöket i rad som krävs för att räknas som bemästrad. */
const MASTERY_STREAK = 3;

function emptyMastery(): ItemMastery {
  return { seen: 0, correct: 0, streak: 0, mastered: false, lastSeen: '' };
}

export type MasteryBucket = 'letters' | 'words' | 'themeWords';

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
 * bemästrade. Läraren kan låsa steget, och då rör vi det aldrig.
 */
export function shouldAdvanceStep(profile: StudentProfile, progress: Progress): boolean {
  if (profile.stepLockedByTeacher) return false;
  if (profile.progressionStep >= MAX_STEP) return false;
  const letters = PROGRESSION_STEPS.find((s) => s.step === profile.progressionStep)?.letters ?? [];
  if (letters.length === 0) return false;
  const mastered = letters.filter((id) => progress.letters[id]?.mastered).length;
  return mastered / letters.length >= 0.8;
}

export function masteredCount(progress: Progress): number {
  return Object.values(progress.letters).filter((m) => m.mastered).length;
}
