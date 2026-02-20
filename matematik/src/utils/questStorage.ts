const QUEST_KEY = (sid: string) => `math_quests_${sid}`;
const COLLECTION_KEY = (sid: string) => `math_collection_${sid}`;

export interface QuestProgress {
  questId: string;
  completed: boolean;
  stepsCompleted: number;
  bestCorrect: number;
  completedAt?: string;
}

export function getQuestProgress(studentId: string): QuestProgress[] {
  try { return JSON.parse(localStorage.getItem(QUEST_KEY(studentId)) || '[]'); } catch { return []; }
}

export function saveQuestProgress(studentId: string, questId: string, stepsCompleted: number, completed: boolean, correct: number) {
  const all = getQuestProgress(studentId);
  const idx = all.findIndex(q => q.questId === questId);
  const entry: QuestProgress = {
    questId, completed, stepsCompleted,
    bestCorrect: Math.max(correct, all[idx]?.bestCorrect ?? 0),
    completedAt: completed ? new Date().toISOString() : all[idx]?.completedAt,
  };
  if (idx >= 0) all[idx] = entry; else all.push(entry);
  localStorage.setItem(QUEST_KEY(studentId), JSON.stringify(all));
}

export function getCollection(studentId: string): string[] {
  try { return JSON.parse(localStorage.getItem(COLLECTION_KEY(studentId)) || '[]'); } catch { return []; }
}

export function unlockCollectible(studentId: string, itemId: string) {
  const col = getCollection(studentId);
  if (!col.includes(itemId)) {
    col.push(itemId);
    localStorage.setItem(COLLECTION_KEY(studentId), JSON.stringify(col));
  }
}
