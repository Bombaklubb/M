import type { ReadingAspect } from "../types";
import { safeGetJson, safeSet } from "./storage";

// Sparade provresultat i localStorage. Endast senaste försöket per prov
// behålls – panelen ska visa "hur ligger jag till nu", inte historik.

export interface QuestionResult {
  qid: number;
  points: number;
  maxPoints: number;
  aspect?: ReadingAspect;
  category?: "L" | "TI";
  // Flerval/ordning rättas automatiskt (alltid true). Öppna frågor räknas
  // först när eleven satt poäng på dem, annars snedvrider de statistiken.
  scored: boolean;
}

export interface TestResult {
  testId: string;
  gradeId: string;
  when: number;
  perQuestion: QuestionResult[];
}

const KEY = "npjakten-resultat-v1";

// Nyckeln innehåller årskursen så att prov-id som råkar sammanfalla
// mellan årskurser inte skriver över varandra.
const entryKey = (gradeId: string, testId: string) => `${gradeId}:${testId}`;

function readAll(): Record<string, TestResult> {
  return safeGetJson<Record<string, TestResult>>(KEY, {});
}

export function saveTestResult(result: TestResult): void {
  const all = readAll();
  all[entryKey(result.gradeId, result.testId)] = result;
  safeSet(KEY, JSON.stringify(all));
}

// Tar bort ett enskilt provresultat, t.ex. när eleven gör om provet.
export function clearTestResult(gradeId: string, testId: string): void {
  const all = readAll();
  delete all[entryKey(gradeId, testId)];
  // Äldre poster sparades utan årskursprefix – städa bort dem också
  delete all[testId];
  safeSet(KEY, JSON.stringify(all));
}

export function loadResults(gradeId?: string): TestResult[] {
  const all = Object.values(readAll());
  return gradeId ? all.filter((r) => r.gradeId === gradeId) : all;
}

export function clearResults(gradeId: string): void {
  const all = readAll();
  for (const id of Object.keys(all)) {
    if (all[id]?.gradeId === gradeId) delete all[id];
  }
  safeSet(KEY, JSON.stringify(all));
}
