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
  /** Subject-specific heading font CSS class (font-historia etc.) */
  headingFont: string;
  /** Full-page background class (page-bg-historia etc.) */
  pageBgClass: string;
  /** Header bar background class (header-historia etc.) */
  headerClass: string;
  /** Ink/text color hex for themed headings */
  inkHex: string;
  /** Progress bar accent color hex */
  progressHex: string;
}

// === EXERCISES ===
export type ExerciseType = 'multiple-choice' | 'true-false' | 'fill-in' | 'matching' | 'spot-the-error' | 'timeline';

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

export interface SpotTheErrorExercise extends BaseExercise {
  type: 'spot-the-error';
  wrongStatement: string;
  options: string[];
  correctIndex: number;
}

export interface TimelineExercise extends BaseExercise {
  type: 'timeline';
  events: { id: string; label: string; hint?: string }[];
  correctOrder: string[];
}

export type Exercise =
  | MultipleChoiceExercise
  | TrueFalseExercise
  | FillInExercise
  | MatchingExercise
  | SpotTheErrorExercise
  | TimelineExercise;

// === CHAPTER SUMMARY ===
export interface Concept {
  term: string;
  definition: string;
}

export interface CauseEffect {
  cause: string;
  effect: string;
}

export interface ChapterSummary {
  concepts: Concept[];
  keyPoints: string[];
  causeEffect: CauseEffect[];
  studentConnection: string;
}

// === CHAPTERS ===
export interface Chapter {
  id: string;
  title: string;
  emoji: string;
  description: string;
  subjectId: SubjectId;
  grade?: string;
  summary?: ChapterSummary;
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
  | 'chapter-study'
  | 'chapter-exercise'
  | 'chapter-result'
  | 'exit-ticket'
  | 'achievements';

export interface ExerciseSessionResult {
  chapterId: string;
  correctAnswers: number;
  totalQuestions: number;
  score: number;
  stars: number;
  isNewBest: boolean;
}
