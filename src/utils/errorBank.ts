// ============================================================
// Error Bank – tracks wrong answers per student
// "Träna på det jag missar" – repair exercises
// ============================================================

export interface ErrorEntry {
  id: string;           // topicId + exerciseId
  topicId: string;
  topicTitle: string;
  exerciseId: string;
  question: string;
  correctAnswer: string;
  wrongAnswers: string[];  // all wrong answers given
  count: number;           // total number of times wrong
  lastWrong: string;       // ISO date
}

const KEY = (studentId: string) => `math_errors_${studentId}`;

export function getErrorBank(studentId: string): ErrorEntry[] {
  try {
    return JSON.parse(localStorage.getItem(KEY(studentId)) || '[]');
  } catch {
    return [];
  }
}

export function recordError(
  studentId: string,
  topicId: string,
  topicTitle: string,
  exerciseId: string,
  question: string,
  correctAnswer: string,
  wrongAnswer: string
): void {
  const bank = getErrorBank(studentId);
  const entryId = `${topicId}__${exerciseId}`;
  const existing = bank.find(e => e.id === entryId);

  if (existing) {
    existing.count += 1;
    existing.lastWrong = new Date().toISOString();
    if (!existing.wrongAnswers.includes(wrongAnswer)) {
      existing.wrongAnswers = [...existing.wrongAnswers.slice(-4), wrongAnswer];
    }
  } else {
    bank.push({
      id: entryId,
      topicId,
      topicTitle,
      exerciseId,
      question,
      correctAnswer,
      wrongAnswers: [wrongAnswer],
      count: 1,
      lastWrong: new Date().toISOString(),
    });
  }

  // Keep max 100 entries
  bank.sort((a, b) => b.count - a.count);
  localStorage.setItem(KEY(studentId), JSON.stringify(bank.slice(0, 100)));
}

export function clearError(studentId: string, entryId: string): void {
  const bank = getErrorBank(studentId).filter(e => e.id !== entryId);
  localStorage.setItem(KEY(studentId), JSON.stringify(bank));
}

// Get top N topics with most errors (for "Träna misstag")
export function getTopErrorTopics(studentId: string, n = 5): string[] {
  const bank = getErrorBank(studentId);
  const topicCounts: Record<string, number> = {};
  for (const e of bank) {
    topicCounts[e.topicId] = (topicCounts[e.topicId] ?? 0) + e.count;
  }
  return Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([id]) => id);
}

// Get repair exercises for a student (exercises they got wrong most)
export function getRepairExercises(studentId: string, limit = 5): ErrorEntry[] {
  return getErrorBank(studentId)
    .sort((a, b) => b.count - a.count || new Date(b.lastWrong).getTime() - new Date(a.lastWrong).getTime())
    .slice(0, limit);
}

export function getErrorCount(studentId: string): number {
  return getErrorBank(studentId).reduce((s, e) => s + e.count, 0);
}

export function getUniqueErrorTopics(studentId: string): number {
  return new Set(getErrorBank(studentId).map(e => e.topicId)).size;
}
