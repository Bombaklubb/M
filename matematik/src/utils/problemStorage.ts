import { ProblemLevel } from '../data/problemSolving';

// ─── Problemlösning – framsteg per elev ─────────────────────────────────────────
// Varje deluppgift har nyckeln `${problemId}:${level}:${subTaskId}`.
// För "hitta alla"-uppgifter sparas dessutom vilka svar eleven redan hittat,
// så att listan finns kvar om eleven lämnar sidan.

export interface ProblemProgress {
  /** Klarade deluppgifter. */
  done: string[];
  /** Hittade svar per collect-deluppgift. */
  found: Record<string, string[]>;
  /** Deluppgifter där ledtråden tagits fram. */
  hintsUsed: string[];
}

const KEY = (studentId: string) => `math_problems_${studentId}`;

export function defaultProblemProgress(): ProblemProgress {
  return { done: [], found: {}, hintsUsed: [] };
}

export function loadProblemProgress(studentId: string): ProblemProgress {
  try {
    const raw = localStorage.getItem(KEY(studentId));
    if (!raw) return defaultProblemProgress();
    return { ...defaultProblemProgress(), ...(JSON.parse(raw) as Partial<ProblemProgress>) };
  } catch {
    return defaultProblemProgress();
  }
}

function save(studentId: string, data: ProblemProgress): void {
  localStorage.setItem(KEY(studentId), JSON.stringify(data));
}

export function subKey(problemId: string, level: ProblemLevel, subTaskId: string): string {
  return `${problemId}:${level}:${subTaskId}`;
}

export function isSubDone(p: ProblemProgress, key: string): boolean {
  return p.done.includes(key);
}

export function getFound(p: ProblemProgress, key: string): string[] {
  return p.found[key] ?? [];
}

export function isHintUsed(p: ProblemProgress, key: string): boolean {
  return p.hintsUsed.includes(key);
}

export function markHintUsed(studentId: string, key: string): ProblemProgress {
  const data = loadProblemProgress(studentId);
  if (!data.hintsUsed.includes(key)) data.hintsUsed.push(key);
  save(studentId, data);
  return data;
}

/** Lägger till ett hittat svar i en collect-uppgift. */
export function addFound(studentId: string, key: string, answer: string): ProblemProgress {
  const data = loadProblemProgress(studentId);
  const list = data.found[key] ?? [];
  if (!list.includes(answer)) list.push(answer);
  data.found[key] = list;
  save(studentId, data);
  return data;
}

/** Markerar en deluppgift som klar. Returnerar true om den var ny. */
export function markSubDone(studentId: string, key: string): boolean {
  const data = loadProblemProgress(studentId);
  if (data.done.includes(key)) return false;
  data.done.push(key);
  save(studentId, data);
  return true;
}

/** Antal klarade deluppgifter för ett problem (alla nivåer). */
export function problemDoneCount(p: ProblemProgress, problemId: string): number {
  return p.done.filter(k => k.startsWith(`${problemId}:`)).length;
}

/** Är en hel nivå klar? */
export function isLevelDone(
  p: ProblemProgress, problemId: string, level: ProblemLevel, subTaskIds: string[]
): boolean {
  return subTaskIds.length > 0 && subTaskIds.every(id => isSubDone(p, subKey(problemId, level, id)));
}
