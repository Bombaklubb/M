// ── Game Storage ────────────────────────────────────────────────────────
// Persists per-student game progress in localStorage

export type GameId = 'quick-answer' | 'boss-battle' | 'time-attack' | 'collect-coins';

export interface GameProgress {
  gameId: GameId;
  level: number;
  highScore: number;
  totalPlays: number;
  bestStreak: number;
  bestCombo: number;
  totalCorrect: number;
  totalQuestions: number;
  totalXP: number;
  unlockedAt: string;
  lastPlayed: string;
}

export interface GameSessionResult {
  gameId: GameId;
  score: number;
  correct: number;
  total: number;
  streak: number;
  combo: number;
  timeSpent: number;
  xpEarned: number;
  newLevel: boolean;
  weakTopics: string[]; // topic IDs where most mistakes happened
}

export interface AllGameProgress {
  games: Record<GameId, GameProgress>;
  totalGameXP: number;
}

const STORAGE_KEY = (studentId: string) => `math_games_${studentId}`;

const DEFAULT_PROGRESS: Record<GameId, GameProgress> = {
  'quick-answer': {
    gameId: 'quick-answer', level: 1, highScore: 0, totalPlays: 0,
    bestStreak: 0, bestCombo: 0, totalCorrect: 0, totalQuestions: 0,
    totalXP: 0, unlockedAt: '', lastPlayed: '',
  },
  'boss-battle': {
    gameId: 'boss-battle', level: 1, highScore: 0, totalPlays: 0,
    bestStreak: 0, bestCombo: 0, totalCorrect: 0, totalQuestions: 0,
    totalXP: 0, unlockedAt: '', lastPlayed: '',
  },
  'time-attack': {
    gameId: 'time-attack', level: 1, highScore: 0, totalPlays: 0,
    bestStreak: 0, bestCombo: 0, totalCorrect: 0, totalQuestions: 0,
    totalXP: 0, unlockedAt: '', lastPlayed: '',
  },
  'collect-coins': {
    gameId: 'collect-coins', level: 1, highScore: 0, totalPlays: 0,
    bestStreak: 0, bestCombo: 0, totalCorrect: 0, totalQuestions: 0,
    totalXP: 0, unlockedAt: '', lastPlayed: '',
  },
};

export function loadGameProgress(studentId: string): AllGameProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(studentId));
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { games: { ...DEFAULT_PROGRESS }, totalGameXP: 0 };
}

export function saveGameProgress(studentId: string, data: AllGameProgress) {
  localStorage.setItem(STORAGE_KEY(studentId), JSON.stringify(data));
}

export function recordGameSession(
  studentId: string,
  result: GameSessionResult,
): GameProgress {
  const data = loadGameProgress(studentId);
  const game = data.games[result.gameId] || { ...DEFAULT_PROGRESS[result.gameId] };

  game.totalPlays += 1;
  game.totalCorrect += result.correct;
  game.totalQuestions += result.total;
  game.totalXP += result.xpEarned;
  game.lastPlayed = new Date().toISOString();
  if (!game.unlockedAt) game.unlockedAt = game.lastPlayed;
  if (result.score > game.highScore) game.highScore = result.score;
  if (result.streak > game.bestStreak) game.bestStreak = result.streak;
  if (result.combo > game.bestCombo) game.bestCombo = result.combo;

  // Level up: every 500 XP = +1 level, max 20
  const newLevel = Math.min(20, 1 + Math.floor(game.totalXP / 500));
  if (newLevel > game.level) game.level = newLevel;

  data.games[result.gameId] = game;
  data.totalGameXP = Object.values(data.games).reduce((s, g) => s + g.totalXP, 0);
  saveGameProgress(studentId, data);
  return game;
}

// ── XP Calculation ──────────────────────────────────────────────────────
export function calculateGameXP(
  correct: number,
  total: number,
  streak: number,
  combo: number,
  noMistakes: boolean,
  avgTimePerQuestion: number, // seconds
): number {
  let xp = correct * 10;

  // Streak bonus
  if (streak >= 10) xp += 50;
  else if (streak >= 5) xp += 25;
  else if (streak >= 3) xp += 10;

  // Combo bonus
  xp += combo * 2;

  // Perfect bonus
  if (noMistakes && total >= 5) xp += 30;

  // Speed bonus
  if (avgTimePerQuestion < 3) xp += 20;
  else if (avgTimePerQuestion < 5) xp += 10;

  return xp;
}

// ── Game Level Config ───────────────────────────────────────────────────
// Returns exercise difficulty based on game level
export function getGameDifficulty(level: number): {
  maxGrade: number;
  timerSeconds: number;
  exerciseCount: number;
} {
  if (level <= 3) return { maxGrade: 3, timerSeconds: 15, exerciseCount: 10 };
  if (level <= 6) return { maxGrade: 5, timerSeconds: 12, exerciseCount: 12 };
  if (level <= 10) return { maxGrade: 7, timerSeconds: 10, exerciseCount: 15 };
  if (level <= 15) return { maxGrade: 9, timerSeconds: 8, exerciseCount: 18 };
  return { maxGrade: 12, timerSeconds: 6, exerciseCount: 20 };
}
