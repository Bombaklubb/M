// ── Exercise Pool for Games ─────────────────────────────────────────────
// Pulls exercises from topics appropriate for the student's grade and game level

import { Exercise, Topic, Grade } from '../types';
import { TOPICS, gradeToNum } from '../data/topics';
import { getGameDifficulty } from './gameStorage';

export interface GameExercise extends Exercise {
  topicId: string;
  topicTitle: string;
}

// Get a shuffled pool of exercises suitable for a game
export function getGameExercisePool(
  grade: Grade,
  gameLevel: number,
  count: number,
  filterTypes?: string[], // optionally limit to certain exercise types
  worldGradeRange?: { minGrade: number; maxGrade: number }, // constrain to a world's grade band
): GameExercise[] {
  let topics: typeof TOPICS;

  if (worldGradeRange) {
    // World-scoped mode: only topics that belong to this world's grade band
    topics = TOPICS.filter(
      t => t.minGrade >= worldGradeRange.minGrade && t.minGrade <= worldGradeRange.maxGrade,
    );
  } else {
    const { maxGrade } = getGameDifficulty(gameLevel);
    const studentGrade = gradeToNum(grade);
    const effectiveMaxGrade = Math.min(studentGrade + 1, maxGrade);
    // Get all topics up to the effective grade
    topics = TOPICS.filter(t => t.minGrade <= effectiveMaxGrade);
  }

  // Build exercise pool
  let pool: GameExercise[] = [];
  for (const topic of topics) {
    for (const ex of topic.exercises) {
      if (filterTypes && !filterTypes.includes(ex.type)) continue;
      pool.push({
        ...ex,
        topicId: topic.id,
        topicTitle: topic.title,
      });
    }
  }

  // Shuffle (Fisher-Yates)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, count);
}

// Generate wrong options for fill-in exercises to use in quick-answer
export function generateWrongOptions(correctAnswer: string, count: number = 3): string[] {
  const num = parseFloat(correctAnswer.replace(',', '.'));
  if (isNaN(num)) {
    // Non-numeric: generate plausible alternatives
    return ['?', '??', '???'].slice(0, count);
  }

  const options = new Set<string>();
  const isInteger = Number.isInteger(num);

  // Generate nearby wrong answers
  const offsets = isInteger
    ? [1, -1, 2, -2, 3, -3, 5, -5, 10, -10]
    : [0.25, -0.25, 0.5, -0.5, 1, -1];

  for (const offset of offsets) {
    if (options.size >= count) break;
    const wrong = num + offset;
    if (wrong >= 0 && wrong !== num) {
      options.add(isInteger ? String(Math.round(wrong)) : String(wrong).replace('.', ','));
    }
  }

  // Fallback
  while (options.size < count) {
    const random = isInteger
      ? Math.floor(Math.random() * (num * 2 + 10))
      : Math.round((Math.random() * num * 2 + 1) * 100) / 100;
    if (random !== num) {
      options.add(isInteger ? String(random) : String(random).replace('.', ','));
    }
  }

  return Array.from(options).slice(0, count);
}

// Analyze which topics had most mistakes
export function analyzeWeakTopics(
  exercises: GameExercise[],
  results: boolean[], // true = correct
): string[] {
  const topicMistakes: Record<string, { id: string; title: string; mistakes: number }> = {};

  exercises.forEach((ex, i) => {
    if (!results[i]) {
      if (!topicMistakes[ex.topicId]) {
        topicMistakes[ex.topicId] = { id: ex.topicId, title: ex.topicTitle, mistakes: 0 };
      }
      topicMistakes[ex.topicId].mistakes += 1;
    }
  });

  return Object.values(topicMistakes)
    .sort((a, b) => b.mistakes - a.mistakes)
    .slice(0, 3)
    .map(t => t.title);
}
