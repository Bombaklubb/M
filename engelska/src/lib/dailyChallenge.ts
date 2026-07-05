import { WORD_PAIRS, makeOptions } from "./gameVocab";
import { loadStudent, saveStudent, loadGamification, saveGamification } from "./storage";
import { MAX_CHESTS_PER_TYPE } from "./gamification";
import type { StudentData, StageId } from "./types";

// ─── Dagens utmaning ──────────────────────────────────────────────────────────
// 5 blandade ordfrågor per dag (deterministiskt utvalda per datum + nivå så att
// alla på samma nivå får samma utmaning hela dagen). Kan bara göras en gång per
// dag. Samma upplägg som i Mattejakten: 20 ⭐ per rätt, +100 ⭐ och en bronskista
// vid alla rätt.

export const DAILY_CHALLENGE_SIZE = 5;
export const DAILY_POINTS_PER_CORRECT = 20;
export const DAILY_PERFECT_BONUS = 100;

export interface DailyQuestion {
  sv: string;
  en: string;
  options: string[];
}

export interface DailyChallengeRecord {
  date: string;          // YYYY-MM-DD
  correct: number;
  total: number;
  pointsEarned: number;
  perfectChest: boolean; // fick en bronskista för alla rätt
}

const KEY = (name: string) => `engelskajakten_daily_challenge_${name.toLowerCase().trim()}`;

export function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

/** Dagens resultat, eller null om utmaningen inte är gjord idag. */
export function getDailyChallengeRecord(studentName: string): DailyChallengeRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY(studentName));
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

/**
 * Elevens "nivå" = stadiet där hen gjort flest övningsförsök (annars lågstadiet).
 * Engelskajakten har ingen sparad årskurs, så aktiviteten får styra.
 */
export function getStudentStage(student: StudentData): StageId {
  let best: StageId = "lagstadiet";
  let bestCount = -1;
  for (const stage of Object.values(student.stages)) {
    const maps = [
      stage.grammarModules, stage.readingModules,
      stage.spellingModules ?? {}, stage.wordsearchModules ?? {}, stage.spelModules ?? {},
    ];
    const count = maps.reduce(
      (sum, map) => sum + Object.values(map).reduce((s, m) => s + m.attempts, 0), 0
    );
    if (count > bestCount) { bestCount = count; best = stage.stageId; }
  }
  return best;
}

/** Dagens 5 frågor för en viss nivå (svenska ord → välj rätt engelsk översättning). */
export function getDailyQuestions(stageId: StageId): DailyQuestion[] {
  const pairs = WORD_PAIRS[stageId] ?? WORD_PAIRS.lagstadiet;
  const enPool = pairs.map((p) => p.en);

  // Seedad Fisher-Yates-blandning → plocka 5.
  const rnd = seededRandom(hashStr(`${todayStr()}_${stageId}`));
  const shuffled = [...pairs];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, DAILY_CHALLENGE_SIZE).map((p) => ({
    sv: p.sv,
    en: p.en,
    options: makeOptions(p.en, enPool),
  }));
}

/**
 * Registrerar dagens resultat: ger poäng (rätt × 20 + 100 vid alla rätt) och en
 * bronskista vid alla rätt. Idempotent – körs den två gånger samma dag returneras
 * det redan sparade resultatet utan nya belöningar.
 */
export function completeDailyChallenge(correct: number, total: number): DailyChallengeRecord | null {
  if (typeof window === "undefined") return null;
  const student = loadStudent();
  if (!student) return null;

  const existing = getDailyChallengeRecord(student.name);
  if (existing) return existing;

  const perfect = total > 0 && correct === total;
  const pointsEarned = correct * DAILY_POINTS_PER_CORRECT + (perfect ? DAILY_PERFECT_BONUS : 0);
  if (pointsEarned > 0) {
    student.totalPoints += pointsEarned;
    saveStudent(student);
  }

  let perfectChest = false;
  if (perfect) {
    const gam = loadGamification();
    const woodCount = gam.chests.filter((c) => c.type === "wood").length;
    if (woodCount < MAX_CHESTS_PER_TYPE) {
      saveGamification({
        ...gam,
        chests: [
          ...gam.chests,
          { id: `chest_${Date.now()}_daily`, type: "wood", earnedAt: new Date().toISOString(), opened: false },
        ],
      });
      perfectChest = true;
    }
  }

  const rec: DailyChallengeRecord = { date: todayStr(), correct, total, pointsEarned, perfectChest };
  localStorage.setItem(KEY(student.name), JSON.stringify(rec));
  return rec;
}
