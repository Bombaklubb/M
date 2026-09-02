import type { StudentData, StageId, ModuleProgress, StageProgress, GamificationData } from "./types";
import { defaultGamificationData } from "./gamification";
import { rollLuckyBonus, type LuckyBonus } from "./luckyBonus";

// ─── Storage keys ─────────────────────────────────────────────────────────────

/** Tracks which student is currently logged in (just the name, lowercased). */
const ACTIVE_KEY = "engelskajakten_active";

/** Tracks when the current session started (ISO string). */
const SESSION_START_KEY = "engelskajakten_session_start";

/** Per-name key for student progress. */
function studentKey(name: string) {
  return `engelskajakten_student_${name.toLowerCase().trim()}`;
}

/** Per-name key for gamification data. */
function gamKey(name: string) {
  return `engelskajakten_gamification_${name.toLowerCase().trim()}`;
}

// ─── Default structures ───────────────────────────────────────────────────────

function emptyStageProgress(stageId: StageId): StageProgress {
  return {
    stageId,
    grammarModules: {},
    readingModules: {},
    spellingModules: {},
    wordsearchModules: {},
    spelModules: {},
  };
}

function defaultStudentData(name: string): StudentData {
  const now = new Date().toISOString();
  return {
    name,
    createdAt: now,
    lastActive: now,
    totalPoints: 0,
    stages: {
      lagstadiet: emptyStageProgress("lagstadiet"),
      mellanstadiet: emptyStageProgress("mellanstadiet"),
      hogstadiet: emptyStageProgress("hogstadiet"),
      gymnasiet: emptyStageProgress("gymnasiet"),
    },
  };
}

// ─── Core persistence ─────────────────────────────────────────────────────────

export function loadStudent(): StudentData | null {
  if (typeof window === "undefined") return null;
  try {
    // Read the active session name
    const activeName = localStorage.getItem(ACTIVE_KEY);
    if (activeName) {
      const raw = localStorage.getItem(studentKey(activeName));
      if (raw) return JSON.parse(raw) as StudentData;
    }

    // ── Migration from old single-key system ──────────────────────────────────
    const oldStudentRaw = localStorage.getItem("engelskajakten_student");
    if (oldStudentRaw) {
      const data = JSON.parse(oldStudentRaw) as StudentData;
      // Save under new name-based key
      localStorage.setItem(studentKey(data.name), oldStudentRaw);
      localStorage.setItem(ACTIVE_KEY, data.name.toLowerCase().trim());
      localStorage.removeItem("engelskajakten_student");
      // Also migrate gamification
      const oldGam = localStorage.getItem("engelskajakten_gamification");
      if (oldGam) {
        localStorage.setItem(gamKey(data.name), oldGam);
        localStorage.removeItem("engelskajakten_gamification");
      }
      return data;
    }

    return null;
  } catch {
    return null;
  }
}

export function saveStudent(data: StudentData): void {
  if (typeof window === "undefined") return;
  data.lastActive = new Date().toISOString();
  localStorage.setItem(studentKey(data.name), JSON.stringify(data));
  localStorage.setItem(ACTIVE_KEY, data.name.toLowerCase().trim());
}

/**
 * Logs in a student by name.
 * - If a student with this name already exists on this device → restores their data.
 * - Otherwise → creates a fresh student.
 */
export function createStudent(name: string, avatar?: string): StudentData {
  if (typeof window === "undefined") return defaultStudentData(name);

  const trimmed = name.trim();

  // Mark session start time
  localStorage.setItem(SESSION_START_KEY, new Date().toISOString());

  const existingRaw = localStorage.getItem(studentKey(trimmed));
  if (existingRaw) {
    try {
      const existing = JSON.parse(existingRaw) as StudentData;
      // Update avatar only if the student explicitly chose a new one
      if (avatar) existing.avatar = avatar;
      saveStudent(existing);
      return existing;
    } catch {
      // Corrupt data – fall through to create fresh
    }
  }

  // New student
  const data = defaultStudentData(trimmed);
  if (avatar) data.avatar = avatar;
  saveStudent(data);
  return data;
}

/** Sets the active avatar (e.g. after an equip in Affären) and persists it. */
export function setAvatar(data: StudentData, avatarId: string): StudentData {
  const updated = { ...data, avatar: avatarId };
  saveStudent(updated);
  return updated;
}

/**
 * Lägger till extrapoäng (t.ex. från en mystery box) OCH sparar dem.
 * Använd denna i stället för att bara uppdatera React-state – annars
 * försvinner poängen vid nästa sidladdning.
 */
export function addBonusPoints(data: StudentData, points: number): StudentData {
  if (points <= 0) return data;
  const updated = { ...data, totalPoints: data.totalPoints + points };
  saveStudent(updated);
  return updated;
}

/**
 * Returns the ISO string for when the current session started,
 * or null if no session is active.
 */
export function getSessionStart(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_START_KEY);
}

/**
 * Logs out the current student.
 * Clears the active session but KEEPS the student's progress data on this device.
 */
export function clearStudent(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACTIVE_KEY);
  localStorage.removeItem(SESSION_START_KEY);
}

// ─── Module progress helpers ──────────────────────────────────────────────────

export function getRepeatMultiplier(priorAttempts: number): number {
  // Mildare omspelsrabatt: det lönar sig alltid att öva om (golv 20 %).
  if (priorAttempts === 0) return 1.0;
  if (priorAttempts === 1) return 0.7;
  if (priorAttempts === 2) return 0.5;
  if (priorAttempts === 3) return 0.3;
  return 0.2;
}

export function getModuleProgress(
  data: StudentData,
  stageId: StageId,
  kind: "grammar" | "reading" | "spelling" | "wordsearch" | "spel",
  moduleId: string
): ModuleProgress | null {
  const stage = data.stages[stageId];
  const map =
    kind === "grammar" ? stage.grammarModules
    : kind === "reading" ? stage.readingModules
    : kind === "spelling" ? (stage.spellingModules ?? {})
    : kind === "spel" ? (stage.spelModules ?? {})
    : (stage.wordsearchModules ?? {});
  return map[moduleId] ?? null;
}

export function saveModuleProgress(
  data: StudentData,
  stageId: StageId,
  kind: "grammar" | "reading" | "spelling" | "wordsearch" | "spel",
  moduleId: string,
  points: number,
  completed: boolean
): StudentData {
  const stage = data.stages[stageId];
  if (!stage.spellingModules) stage.spellingModules = {};
  if (!stage.wordsearchModules) stage.wordsearchModules = {};
  if (!stage.spelModules) stage.spelModules = {};
  const map =
    kind === "grammar" ? stage.grammarModules
    : kind === "reading" ? stage.readingModules
    : kind === "spelling" ? stage.spellingModules
    : kind === "spel" ? stage.spelModules
    : stage.wordsearchModules;
  const existing = map[moduleId];
  const prevPoints = existing?.points ?? 0;

  map[moduleId] = {
    moduleId,
    completed: existing?.completed || completed,
    points: Math.max(prevPoints, points),
    attempts: (existing?.attempts ?? 0) + 1,
    lastAttempt: new Date().toISOString(),
  };

  // Caller applies diminishing returns via getRepeatMultiplier before passing points
  data.totalPoints += points;
  saveStudent(data);

  // Anonym statistik-tracking (GDPR-säkrad, inget personligt)
  if (typeof window !== "undefined") {
    import("@/services/analyticsService").then(({ trackTaskComplete }) => {
      trackTaskComplete(completed, kind);
    });
  }

  return { ...data };
}

// ─── Spelpoäng (snabbspelen) ──────────────────────────────────────────────────
// Snabbspelen (Tidsattack, Samla mynt, Memory, Hänga gubben) ger riktiga poäng.
// Avtagande utdelning per spel och dag så att det inte går att "farma":
// runda 1–3 = 100 %, runda 4–5 = 50 %, därefter 20 %.

/** Högsta antal poäng en enskild spelomgång kan ge, före dagens avtrappning. */
export const MAX_POINTS_PER_GAME_ROUND = 150;

interface GamePlayData { date: string; counts: Record<string, number>; }

function gamePlayKey(name: string) {
  return `engelskajakten_gameplays_${name.toLowerCase().trim()}`;
}

export function addGamePoints(
  gameId: string,
  rawPoints: number
): { awarded: number; multiplier: number; lucky: LuckyBonus | null } {
  if (typeof window === "undefined") return { awarded: 0, multiplier: 0, lucky: null };
  const student = loadStudent();
  if (!student) return { awarded: 0, multiplier: 0, lucky: null };

  const key = gamePlayKey(student.name);
  const today = todayStr();
  let data: GamePlayData;
  try {
    const raw = localStorage.getItem(key);
    data = raw ? (JSON.parse(raw) as GamePlayData) : { date: today, counts: {} };
    if (data.date !== today) data = { date: today, counts: {} };
  } catch {
    data = { date: today, counts: {} };
  }

  const plays = data.counts[gameId] ?? 0;
  const multiplier = plays < 3 ? 1 : plays < 5 ? 0.5 : 0.2;
  // Tak per omgång. Ett spel ska aldrig kunna ge mer än en ordentlig
  // övningsmodul (~150–200 p). Utan taket kunde Tidsattack ge tiotusentals
  // poäng på en minut, eftersom spelets streak-bonus växer med streaken.
  const capped = Math.min(Math.max(0, rawPoints), MAX_POINTS_PER_GAME_ROUND);
  let awarded = Math.round(capped * multiplier);

  data.counts[gameId] = plays + 1;
  localStorage.setItem(key, JSON.stringify(data));

  // Turbonus: sällsynt slumpbonus (×2/×3)
  const lucky = rollLuckyBonus(student.name, awarded);
  if (lucky) awarded += lucky.extra;

  if (awarded > 0) {
    student.totalPoints += awarded;
    saveStudent(student);
  }

  return { awarded, multiplier, lucky };
}

// ─── Gamification persistence ─────────────────────────────────────────────────

export function loadGamification(): GamificationData {
  if (typeof window === "undefined") return defaultGamificationData();
  try {
    const activeName = localStorage.getItem(ACTIVE_KEY);
    if (!activeName) return defaultGamificationData();
    const raw = localStorage.getItem(gamKey(activeName));
    if (!raw) return defaultGamificationData();
    return JSON.parse(raw) as GamificationData;
  } catch {
    return defaultGamificationData();
  }
}

export function saveGamification(data: GamificationData): void {
  if (typeof window === "undefined") return;
  const activeName = localStorage.getItem(ACTIVE_KEY);
  if (!activeName) return;
  localStorage.setItem(gamKey(activeName), JSON.stringify(data));
}

export function clearGamification(): void {
  if (typeof window === "undefined") return;
  const activeName = localStorage.getItem(ACTIVE_KEY);
  if (!activeName) return;
  localStorage.removeItem(gamKey(activeName));
}

// ─── Export / Import progress ─────────────────────────────────────────────────

export function exportProgress(data: StudentData): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `engelskajakten_${data.name.replace(/\s+/g, "_")}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importProgress(file: File): Promise<StudentData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as StudentData;
        if (!data.name || !data.stages) throw new Error("Ogiltig fil");
        saveStudent(data);
        resolve(data);
      } catch {
        reject(new Error("Kunde inte läsa filen. Kontrollera att det är rätt fil."));
      }
    };
    reader.onerror = () => reject(new Error("Filläsning misslyckades."));
    reader.readAsText(file);
  });
}

// ─── Share code (base64 of JSON) ─────────────────────────────────────────────

export function generateShareCode(data: StudentData): string {
  return btoa(encodeURIComponent(JSON.stringify(data)));
}

export function importShareCode(code: string): StudentData | null {
  try {
    const data = JSON.parse(decodeURIComponent(atob(code))) as StudentData;
    if (!data.name || !data.stages) return null;
    return data;
  } catch {
    return null;
  }
}

// ─── Daily streak ─────────────────────────────────────────────────────────────

interface StreakData { days: number; lastDate: string; }

function streakKey(name: string) {
  return `engelskajakten_streak_${name.toLowerCase().trim()}`;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export function getStreak(studentName: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(streakKey(studentName));
    if (!raw) return 0;
    return (JSON.parse(raw) as StreakData).days;
  } catch { return 0; }
}

export function updateStreak(studentName: string): number {
  if (typeof window === "undefined") return 0;
  const key = streakKey(studentName);
  const today = todayStr();
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  try {
    const raw = localStorage.getItem(key);
    const prev: StreakData = raw ? JSON.parse(raw) : { days: 0, lastDate: "" };
    if (prev.lastDate === today) return prev.days; // already counted today
    const newDays = prev.lastDate === yesterday ? prev.days + 1 : 1;
    localStorage.setItem(key, JSON.stringify({ days: newDays, lastDate: today }));
    return newDays;
  } catch { return 0; }
}

// ─── Daglig bonus ──────────────────────────────────────────────────────────────

/** Poäng som delas ut första gången man är aktiv en ny dag. */
export const DAILY_BONUS = 50;

function dailyBonusKey(name: string) {
  return `engelskajakten_dailybonus_${name.toLowerCase().trim()}`;
}

/**
 * Delar ut daglig bonus (DAILY_BONUS ⭐) första gången på dagen.
 * Lägger till poängen i den aktiva studentens totalPoints (= både livstidspoäng
 * och plånbok) och returnerar bonusbeloppet. Returnerar 0 om den redan hämtats idag.
 */
export function claimDailyBonus(): number {
  if (typeof window === "undefined") return 0;
  const student = loadStudent();
  if (!student) return 0;
  const key = dailyBonusKey(student.name);
  const today = todayStr();
  try {
    if (localStorage.getItem(key) === today) return 0; // redan hämtad idag
    localStorage.setItem(key, today);
    student.totalPoints += DAILY_BONUS;
    saveStudent(student);
    return DAILY_BONUS;
  } catch {
    return 0;
  }
}

// ─── Försök igen – daglig poängbudget ─────────────────────────────────────────
// Att rätta ett tidigare fel ger 5–15 p. Utan tak går det att farma poäng:
// svara fel med flit på första frågan i ett kapitel, lämna kapitlet (poäng
// delas bara ut vid målgång, så det kostar ingenting) och rätta felet direkt
// under Försök igen. Loopen tar ~15 sekunder och gav tidigare obegränsat med
// poäng. Budgeten räcker till en rejäl repetitionsrunda (~20 rättade fel) men
// stänger farmningen.

/** Högsta antal poäng Försök igen kan ge under ett dygn. */
export const MAX_REPAIR_POINTS_PER_DAY = 200;

interface RepairBudget { date: string; used: number; }

function repairKey(name: string) {
  return `engelskajakten_repair_${name.toLowerCase().trim()}`;
}

function readRepairBudget(name: string): RepairBudget {
  const today = todayStr();
  try {
    const raw = localStorage.getItem(repairKey(name));
    const data: RepairBudget = raw ? JSON.parse(raw) : { date: today, used: 0 };
    return data.date === today ? data : { date: today, used: 0 };
  } catch {
    return { date: today, used: 0 };
  }
}

/** Hur många poäng Försök igen kan ge resten av dagen. */
export function repairPointsLeftToday(studentName: string): number {
  if (typeof window === "undefined") return 0;
  return Math.max(0, MAX_REPAIR_POINTS_PER_DAY - readRepairBudget(studentName).used);
}

/**
 * Delar ut poäng för ett rättat fel, begränsat av dagens budget.
 * Returnerar antalet poäng som faktiskt delades ut (0 när budgeten är slut).
 */
export function addRepairPoints(rawPoints: number): number {
  if (typeof window === "undefined") return 0;
  const student = loadStudent();
  if (!student) return 0;
  const budget = readRepairBudget(student.name);
  const left = Math.max(0, MAX_REPAIR_POINTS_PER_DAY - budget.used);
  const awarded = Math.min(Math.max(0, Math.round(rawPoints)), left);
  try {
    localStorage.setItem(
      repairKey(student.name),
      JSON.stringify({ date: budget.date, used: budget.used + awarded })
    );
  } catch {
    /* full lagring – poängen delas ändå ut nedan */
  }
  if (awarded > 0) {
    student.totalPoints += awarded;
    saveStudent(student);
  }
  return awarded;
}

// ─── Exercise position (resume where you left off) ────────────────────────────

function posKey(stageId: string, moduleId: string) {
  return `engelskajakten_pos_${stageId}_${moduleId}`;
}

/** Var eleven var i kapitlet, och vilka svar som redan är avklarade. */
export interface ExercisePosition {
  index: number;
  results: boolean[];
}

/**
 * Sparar både positionen och svaren så här långt. Tidigare sparades bara
 * positionen, vilket gjorde att en elev som lämnade kapitlet och kom tillbaka
 * blev av med alla rätt den redan hade – slutpoängen räknades bara på frågorna
 * efter återkomsten, och kapitlet kunde underkännas trots att allt var rätt.
 */
export function saveExercisePosition(
  stageId: string,
  moduleId: string,
  index: number,
  results: boolean[] = []
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(posKey(stageId, moduleId), JSON.stringify({ index, results }));
}

export function loadExercisePosition(stageId: string, moduleId: string): ExercisePosition | null {
  if (typeof window === "undefined") return null;
  const val = localStorage.getItem(posKey(stageId, moduleId));
  if (val === null) return null;
  try {
    const parsed: unknown = JSON.parse(val);
    // Äldre versioner sparade bara ett tal – de ska fortsätta fungera.
    if (typeof parsed === "number") {
      return Number.isFinite(parsed) ? { index: parsed, results: [] } : null;
    }
    if (parsed && typeof parsed === "object" && typeof (parsed as ExercisePosition).index === "number") {
      const p = parsed as ExercisePosition;
      return { index: p.index, results: Array.isArray(p.results) ? p.results : [] };
    }
    return null;
  } catch {
    const n = parseInt(val, 10);
    return isNaN(n) ? null : { index: n, results: [] };
  }
}

export function clearExercisePosition(stageId: string, moduleId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(posKey(stageId, moduleId));
}
