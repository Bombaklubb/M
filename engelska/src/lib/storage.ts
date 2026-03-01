import type { StudentData, StageId, ModuleProgress, StageProgress } from "./types";

const STORAGE_KEY = "engelskajakten_student";

// ─── Default structures ───────────────────────────────────────────────────────

function emptyStageProgress(stageId: StageId): StageProgress {
  return {
    stageId,
    grammarModules: {},
    readingModules: {},
    spellingModules: {},
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
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StudentData;
  } catch {
    return null;
  }
}

export function saveStudent(data: StudentData): void {
  if (typeof window === "undefined") return;
  data.lastActive = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function createStudent(name: string): StudentData {
  const data = defaultStudentData(name.trim());
  saveStudent(data);
  return data;
}

export function clearStudent(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

// ─── Module progress helpers ──────────────────────────────────────────────────

export function getModuleProgress(
  data: StudentData,
  stageId: StageId,
  kind: "grammar" | "reading" | "spelling",
  moduleId: string
): ModuleProgress | null {
  const stage = data.stages[stageId];
  const map =
    kind === "grammar"
      ? stage.grammarModules
      : kind === "reading"
      ? stage.readingModules
      : (stage.spellingModules ?? {});
  return map[moduleId] ?? null;
}

export function saveModuleProgress(
  data: StudentData,
  stageId: StageId,
  kind: "grammar" | "reading" | "spelling",
  moduleId: string,
  points: number,
  completed: boolean
): StudentData {
  const stage = data.stages[stageId];
  if (!stage.spellingModules) stage.spellingModules = {};
  const map =
    kind === "grammar"
      ? stage.grammarModules
      : kind === "reading"
      ? stage.readingModules
      : stage.spellingModules;
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
