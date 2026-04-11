// ============================================================
// Error Bank – tracks wrong answers per student, per stage
// "Försök igen" – repair exercises
// ============================================================

import type { GrammarExercise, ReadingQuestion } from "./types";

export interface EngelErrorEntry {
  id: string;           // moduleId + "__" + exerciseId
  stageId: string;
  kind: "grammar" | "reading" | "spelling";
  moduleId: string;
  moduleTitle: string;
  exerciseId: string;
  question: string;         // human-readable question text
  correctAnswer: string;    // text of the correct answer
  wrongAnswers: string[];   // all wrong answers given (last 5)
  count: number;            // total times answered wrong
  lastWrong: string;        // ISO date
  exerciseData: GrammarExercise | ReadingQuestion; // full exercise for repair mode
}

const KEY = (studentName: string, stageId: string) =>
  `engelska_errors_${studentName.toLowerCase().trim()}_${stageId}`;

export function getErrorBank(studentName: string, stageId: string): EngelErrorEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY(studentName, stageId)) || "[]");
  } catch {
    return [];
  }
}

export function recordError(
  studentName: string,
  stageId: string,
  kind: "grammar" | "reading" | "spelling",
  moduleId: string,
  moduleTitle: string,
  exerciseId: string,
  question: string,
  correctAnswer: string,
  wrongAnswer: string,
  exerciseData: GrammarExercise | ReadingQuestion
): void {
  if (typeof window === "undefined") return;
  const bank = getErrorBank(studentName, stageId);
  const entryId = `${moduleId}__${exerciseId}`;
  const existing = bank.find((e) => e.id === entryId);

  if (existing) {
    existing.count += 1;
    existing.lastWrong = new Date().toISOString();
    if (!existing.wrongAnswers.includes(wrongAnswer)) {
      existing.wrongAnswers = [...existing.wrongAnswers.slice(-4), wrongAnswer];
    }
  } else {
    bank.push({
      id: entryId,
      stageId,
      kind,
      moduleId,
      moduleTitle,
      exerciseId,
      question,
      correctAnswer,
      wrongAnswers: [wrongAnswer],
      count: 1,
      lastWrong: new Date().toISOString(),
      exerciseData,
    });
  }

  // Keep max 100 entries, most frequent first
  bank.sort((a, b) => b.count - a.count);
  localStorage.setItem(KEY(studentName, stageId), JSON.stringify(bank.slice(0, 100)));
}

export function clearError(studentName: string, stageId: string, entryId: string): void {
  if (typeof window === "undefined") return;
  const bank = getErrorBank(studentName, stageId).filter((e) => e.id !== entryId);
  localStorage.setItem(KEY(studentName, stageId), JSON.stringify(bank));
}

export function getErrorCount(studentName: string, stageId: string): number {
  return getErrorBank(studentName, stageId).length;
}
