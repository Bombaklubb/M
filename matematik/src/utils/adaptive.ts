// ============================================================
// Adaptive Difficulty Engine
// Tracks per-student per-topic difficulty level (1.0 – 5.0)
// and adjusts based on correctness + response time.
// ============================================================

export interface AdaptiveState {
  studentId: string;
  topicId: string;
  difficulty: number;  // 1.0 – 5.0
  recentResults: boolean[]; // last 10: true=correct
  avgTimeMs: number;
  totalAttempts: number;
  lastUpdated: string;
}

const KEY = (sid: string, tid: string) => `math_adaptive_${sid}_${tid}`;

export function getAdaptiveState(studentId: string, topicId: string): AdaptiveState {
  try {
    const raw = localStorage.getItem(KEY(studentId, topicId));
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    studentId,
    topicId,
    difficulty: 2.0,
    recentResults: [],
    avgTimeMs: 0,
    totalAttempts: 0,
    lastUpdated: new Date().toISOString(),
  };
}

export function updateAdaptive(
  studentId: string,
  topicId: string,
  correct: boolean,
  timeMs: number
): AdaptiveState {
  const state = getAdaptiveState(studentId, topicId);

  // Update running average time
  const n = state.totalAttempts;
  const newAvg = n === 0 ? timeMs : (state.avgTimeMs * n + timeMs) / (n + 1);

  // Adjust difficulty
  let delta = 0;
  if (correct) {
    if (timeMs < 8000)       delta = +0.4;   // fast & correct → harder
    else if (timeMs < 15000) delta = +0.2;   // medium speed & correct
    else                     delta = +0.05;  // slow but correct
  } else {
    if (timeMs < 5000)       delta = -0.8;   // wrong AND rushed → much easier
    else                     delta = -0.5;   // wrong → easier
  }

  const newDifficulty = Math.min(5, Math.max(1, state.difficulty + delta));

  // Keep last 10 results
  const recentResults = [...state.recentResults, correct].slice(-10);

  const updated: AdaptiveState = {
    ...state,
    difficulty: Math.round(newDifficulty * 10) / 10,
    recentResults,
    avgTimeMs: Math.round(newAvg),
    totalAttempts: state.totalAttempts + 1,
    lastUpdated: new Date().toISOString(),
  };

  localStorage.setItem(KEY(studentId, topicId), JSON.stringify(updated));
  return updated;
}

// Returns difficulty as 1–5 integer bucket
export function getDifficultyLevel(studentId: string, topicId: string): 1 | 2 | 3 | 4 | 5 {
  const state = getAdaptiveState(studentId, topicId);
  return Math.round(state.difficulty) as 1 | 2 | 3 | 4 | 5;
}

// Label for difficulty display
export const DIFFICULTY_LABELS: Record<number, string> = {
  1: 'Nybörjare', 2: 'På gång', 3: 'Medel', 4: 'Avancerad', 5: 'Mästare',
};
export const DIFFICULTY_COLORS: Record<number, string> = {
  1: 'text-green-600 bg-green-100',
  2: 'text-blue-600 bg-blue-100',
  3: 'text-yellow-600 bg-yellow-100',
  4: 'text-orange-600 bg-orange-100',
  5: 'text-red-600 bg-red-100',
};

// Get accuracy for last N attempts
export function getRecentAccuracy(studentId: string, topicId: string, n = 5): number {
  const state = getAdaptiveState(studentId, topicId);
  const recent = state.recentResults.slice(-n);
  if (recent.length === 0) return 0;
  return recent.filter(Boolean).length / recent.length;
}
