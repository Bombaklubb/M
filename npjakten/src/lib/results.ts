import type { ReadingAspect } from "../types";

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

function readAll(): Record<string, TestResult> {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveTestResult(result: TestResult): void {
  try {
    const all = readAll();
    all[result.testId] = result;
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    // localStorage kan vara avstängt (privat läge) – statistiken är
    // en bonusfunktion, så vi låter provet fungera ändå.
  }
}

export function loadResults(gradeId?: string): TestResult[] {
  const all = Object.values(readAll());
  return gradeId ? all.filter((r) => r.gradeId === gradeId) : all;
}

export function clearResults(gradeId: string): void {
  try {
    const all = readAll();
    for (const id of Object.keys(all)) {
      if (all[id].gradeId === gradeId) delete all[id];
    }
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    // se ovan
  }
}
