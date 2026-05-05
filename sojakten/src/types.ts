// === SUBJECTS ===
export type SubjectId = 'historia' | 'geografi' | 'religion' | 'samhalle';

export interface Subject {
  id: SubjectId;
  name: string;
  shortName: string;
  emoji: string;
  cardClass: string;
  accentHex: string;
  textClass: string;
}

// === EXERCISES ===
export type ExerciseType = 'multiple-choice' | 'true-false' | 'fill-in' | 'matching';

export interface BaseExercise {
  id: string;
  type: ExerciseType;
  question: string;
  explanation?: string;
  points?: number;
}

export interface MultipleChoiceExercise extends BaseExercise {
  type: 'multiple-choice';
  options: string[];
  correctIndex: number;
}

export interface TrueFalseExercise extends BaseExercise {
  type: 'true-false';
  isTrue: boolean;
}

export interface FillInExercise extends BaseExercise {
  type: 'fill-in';
  answer: string;
  acceptableAnswers?: string[];
  wordBank?: string[];
}

export interface MatchingExercise extends BaseExercise {
  type: 'matching';
  pairs: { left: string; right: string }[];
}

export type Exercise =
  | MultipleChoiceExercise
  | TrueFalseExercise
  | FillInExercise
  | MatchingExercise;

// === CHAPTERS ===
export interface Chapter {
  id: string;
  title: string;
  emoji: string;
  description: string;
  subjectId: SubjectId;
  grade?: string;
  exercises: Exercise[];
}

// === PROGRESS (stored per device, no accounts) ===
export interface ChapterProgress {
  chapterId: string;
  completed: boolean;
  bestScore: number;
  stars: number;
  totalAttempts: number;
}

// === ACHIEVEMENTS ===
export interface AchievementStats {
  completedChapters: number;
  totalCorrect: number;
  totalAnswered: number;
  progress: ChapterProgress[];
  subjectCounts: Record<SubjectId, number>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  condition: (s: AchievementStats) => boolean;
}

// === APP STATE ===
export type AppView =
  | 'subject-select'
  | 'chapter-map'
  | 'chapter-exercise'
  | 'chapter-result'
  | 'achievements';

export interface ExerciseSessionResult {
  chapterId: string;
  correctAnswers: number;
  totalQuestions: number;
  score: number;
  stars: number;
  isNewBest: boolean;
}
