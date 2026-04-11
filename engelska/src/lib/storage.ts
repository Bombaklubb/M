import type { StudentData, StageId, ModuleProgress, StageProgress, GamificationData } from "./types";
import { defaultGamificationData } from "./gamification";

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
  const addedPoints = Math.max(0, points - prevPoints);

  map[moduleId] = {
    moduleId,
    completed: existing?.completed || completed,
    points: Math.max(prevPoints, points),
    attempts: (existing?.attempts ?? 0) + 1,
    lastAttempt: new Date().toISOString(),
  };

  data.totalPoints += addedPoints;
  saveStudent(data);
  return { ...data };
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
