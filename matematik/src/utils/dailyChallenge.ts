import { TOPICS } from '../data/topics';
import { addPoints } from './storage';
import { loadGamification, saveGamification, MAX_CHESTS_PER_TYPE } from './chestStorage';
import type { Grade, MultipleChoiceExercise, TrueFalseExercise } from '../types';

// ─── Dagens utmaning ─────────────────────────────────────────────────────────────
// 5 blandade frågor per dag (deterministiskt utvalda per datum + nivå så att alla
// med samma nivå får samma utmaning hela dagen). Kan bara göras en gång per dag.

export type DailyExercise = MultipleChoiceExercise | TrueFalseExercise;

export const DAILY_CHALLENGE_SIZE = 5;
export const DAILY_POINTS_PER_CORRECT = 20;
export const DAILY_PERFECT_BONUS = 100;

export interface DailyChallengeRecord {
  date: string;          // YYYY-MM-DD
  correct: number;
  total: number;
  pointsEarned: number;
  perfectChest: boolean; // fick en bronskista för alla rätt
}

const KEY = (studentId: string) => `math_daily_challenge_${studentId}`;

export function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

/** Dagens resultat, eller null om utmaningen inte är gjord idag. */
export function getDailyChallengeRecord(studentId: string): DailyChallengeRecord | null {
  try {
    const raw = localStorage.getItem(KEY(studentId));
    if (!raw) return null;
    const rec = JSON.parse(raw) as DailyChallengeRecord;
    return rec.date === todayStr() ? rec : null;
  } catch {
    return null;
  }
}

// Enkel seedad PRNG (mulberry32) så att dagens frågor blir samma hela dagen.
function seededRandom(seed: number): () => number {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

/** Dagens 5 frågor för en viss nivå (multiple-choice + sant/falskt). */
export function getDailyExercises(grade: Grade): DailyExercise[] {
  let pool = TOPICS.filter(t => t.grades.includes(grade));
  if (pool.length < 3) pool = TOPICS;

  const candidates: { ex: DailyExercise; topicId: string }[] = [];
  for (const t of pool) {
    for (const ex of t.exercises) {
      if (ex.type === 'multiple-choice' || ex.type === 'true-false') {
        candidates.push({ ex, topicId: t.id });
      }
    }
  }

  // Seedad Fisher-Yates-blandning → plocka 5 med max 2 frågor per ämne.
  const rnd = seededRandom(hashStr(`${todayStr()}_${grade}`));
  const shuffled = [...candidates];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const picked: DailyExercise[] = [];
  const perTopic: Record<string, number> = {};
  for (const c of shuffled) {
    if (picked.length >= DAILY_CHALLENGE_SIZE) break;
    if ((perTopic[c.topicId] ?? 0) >= 2) continue;
    perTopic[c.topicId] = (perTopic[c.topicId] ?? 0) + 1;
    picked.push(c.ex);
  }
  return picked;
}

/**
 * Registrerar dagens resultat: ger poäng (rätt × 20 + 100 vid alla rätt) och en
 * bronskista vid alla rätt. Idempotent – körs den två gånger samma dag returneras
 * det redan sparade resultatet utan nya belöningar.
 */
export function completeDailyChallenge(
  studentId: string,
  correct: number,
  total: number
): DailyChallengeRecord {
  const existing = getDailyChallengeRecord(studentId);
  if (existing) return existing;

  const perfect = total > 0 && correct === total;
  const pointsEarned = correct * DAILY_POINTS_PER_CORRECT + (perfect ? DAILY_PERFECT_BONUS : 0);
  if (pointsEarned > 0) addPoints(studentId, pointsEarned);

  let perfectChest = false;
  if (perfect) {
    const gam = loadGamification(studentId);
    const woodCount = gam.chests.filter(c => c.type === 'wood').length;
    if (woodCount < MAX_CHESTS_PER_TYPE) {
      saveGamification(studentId, {
        ...gam,
        chests: [
          ...gam.chests,
          { id: `chest_${Date.now()}_daily`, type: 'wood', earnedAt: new Date().toISOString(), opened: false },
        ],
      });
      perfectChest = true;
    }
  }

  const rec: DailyChallengeRecord = { date: todayStr(), correct, total, pointsEarned, perfectChest };
  localStorage.setItem(KEY(studentId), JSON.stringify(rec));
  return rec;
}
