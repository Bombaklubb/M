import { ProblemLevel } from '../data/problemSolving';

// ─── Problemlösning – framsteg per elev ─────────────────────────────────────────
// Sparar vilka nivåer (E/C/A) eleven klarat per problem, samt om ledtråden
// använts. Nyckeln är `${problemId}:${level}` så att varje nivå räknas separat.

export interface ProblemProgress {
  /** Klarade uppgifter, nyckel `${problemId}:${level}`. */
  solved: string[];
  /** Uppgifter där ledtråden togs fram (ger halva poängen). */
  hintsUsed: string[];
}

const KEY = (studentId: string) => `math_problems_${studentId}`;

export function defaultProblemProgress(): ProblemProgress {
  return { solved: [], hintsUsed: [] };
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

export function taskKey(problemId: string, level: ProblemLevel): string {
  return `${problemId}:${level}`;
}

export function isSolved(progress: ProblemProgress, problemId: string, level: ProblemLevel): boolean {
  return progress.solved.includes(taskKey(problemId, level));
}

export function isHintUsed(progress: ProblemProgress, problemId: string, level: ProblemLevel): boolean {
  return progress.hintsUsed.includes(taskKey(problemId, level));
}

export function markHintUsed(studentId: string, problemId: string, level: ProblemLevel): ProblemProgress {
  const data = loadProblemProgress(studentId);
  const key = taskKey(problemId, level);
  if (!data.hintsUsed.includes(key)) data.hintsUsed.push(key);
  save(studentId, data);
  return data;
}

/** Markerar en uppgift som klarad. Returnerar false om den redan var klarad. */
export function markSolved(studentId: string, problemId: string, level: ProblemLevel): boolean {
  const data = loadProblemProgress(studentId);
  const key = taskKey(problemId, level);
  if (data.solved.includes(key)) return false;
  data.solved.push(key);
  save(studentId, data);
  return true;
}

/** Antal klarade nivåer för ett problem (0–3). */
export function solvedCount(progress: ProblemProgress, problemId: string): number {
  return (['E', 'C', 'A'] as ProblemLevel[]).filter(l => isSolved(progress, problemId, l)).length;
}
