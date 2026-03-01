// ─── Stage / World definitions ───────────────────────────────────────────────

export type StageId = "lagstadiet" | "mellanstadiet" | "hogstadiet" | "gymnasiet";

export interface Stage {
  id: StageId;
  name: string;
  subtitle: string;
  emoji: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  buttonClass: string;
  grades: string;
  description: string;
  locked: boolean;
}

// ─── Exercise types ───────────────────────────────────────────────────────────

export type GrammarExerciseType = "multiple-choice" | "fill-in-blank" | "build-sentence";
export type ReadingQuestionType = "on-the-line" | "between-the-lines" | "beyond-the-lines";

export interface MultipleChoiceExercise {
  id: string;
  type: "multiple-choice";
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface FillInBlankExercise {
  id: string;
  type: "fill-in-blank";
  sentence: string; // Use ___ for blank
  answer: string;
  hint?: string;
  explanation?: string;
}

export interface BuildSentenceExercise {
  id: string;
  type: "build-sentence";
  instruction: string;
  words: string[];       // words in scrambled order
  correctOrder: number[]; // indices into words[] forming correct sentence
  explanation?: string;
}

export type GrammarExercise =
  | MultipleChoiceExercise
  | FillInBlankExercise
  | BuildSentenceExercise;

export interface ReadingQuestion {
  id: string;
  type: ReadingQuestionType;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

// ─── Module definitions ───────────────────────────────────────────────────────

export interface GrammarModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  pointsRequired: number; // total points needed to unlock (0 = always open)
  bonusPoints: number;    // extra points for completing the module
  exercises: GrammarExercise[];
}

export interface ReadingModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  pointsRequired: number;
  bonusPoints: number;
  text: string;
  author?: string;
  questions: ReadingQuestion[];
}

export interface SpellingModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  pointsRequired: number;
  bonusPoints: number;
  exercises: GrammarExercise[];
}

export interface StageContent {
  grammar: GrammarModule[];
  reading: ReadingModule[];
  spelling?: SpellingModule[];
}

// ─── Student progress (stored in localStorage) ───────────────────────────────

export interface ModuleProgress {
  moduleId: string;
  completed: boolean;
  points: number;
  attempts: number;
  lastAttempt: string; // ISO date string
}

export interface StageProgress {
  stageId: StageId;
  grammarModules: Record<string, ModuleProgress>;
  readingModules: Record<string, ModuleProgress>;
  spellingModules: Record<string, ModuleProgress>;
}

export interface StudentData {
  avatar?: string;
  name: string;
  createdAt: string;
  lastActive: string;
  totalPoints: number;
  stages: Record<StageId, StageProgress>;
}

// ─── Exercise session (in-memory, not persisted) ──────────────────────────────

export interface ExerciseResult {
  exerciseId: string;
  correct: boolean;
  pointsEarned: number;
}
