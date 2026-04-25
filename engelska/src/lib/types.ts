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
  hint?: string;
  explanation?: string;
}

export interface FillInBlankExercise {
  id: string;
  type: "fill-in-blank";
  sentence: string; // Use ___ for blank
  answer: string;
  alternativeAnswers?: string[]; // other accepted answers
  hint?: string;
  explanation?: string;
}

export interface BuildSentenceExercise {
  id: string;
  type: "build-sentence";
  instruction: string;
  words: string[];       // words in scrambled order
  correctOrder: number[]; // indices into words[] forming correct sentence
  hint?: string;
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
  hint?: string;
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
  helpText?: string[];    // tips/rules shown before exercises start
  exercises: GrammarExercise[];
}

export interface ReadingModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  pointsRequired: number;
  bonusPoints: number;
  helpText?: string[];    // tips/rules shown before reading starts
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
  helpText?: string[];    // tips/rules shown before exercises start
  exercises: GrammarExercise[];
}

// ─── Word Search ──────────────────────────────────────────────────────────────

export interface WordSearchWord {
  word: string;
  clue: string;
}

export interface WordSearchModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  pointsRequired: number;
  bonusPoints: number;
  words: WordSearchWord[];
}

// ─── Coin Game (Samla mynt) ───────────────────────────────────────────────────

export interface CoinGameQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface CoinGameModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  pointsRequired: number;
  bonusPoints: number;
  questions: CoinGameQuestion[];
}

export interface StageContent {
  grammar: GrammarModule[];
  reading: ReadingModule[];
  spelling?: SpellingModule[];
  wordsearch?: WordSearchModule[];
  spel?: CoinGameModule[];
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
  wordsearchModules: Record<string, ModuleProgress>;
  spelModules?: Record<string, ModuleProgress>;
}

export interface StudentData {
  avatar?: string;
  name: string;
  createdAt: string;
  lastActive: string;
  totalPoints: number;
  stages: Record<StageId, StageProgress>;
}

// ─── Gamification ─────────────────────────────────────────────────────────────

export type ChestType = "wood" | "silver" | "gold" | "ruby" | "diamond" | "emerald";

export interface Chest {
  id: string;
  type: ChestType;
  earnedAt: string;
  opened: boolean;
  openedReward?: string; // description shown after opening
}

export type MysteryRewardType = "points" | "chest" | "badge";

export interface MysteryBoxReward {
  type: MysteryRewardType;
  points?: number;
  chestType?: ChestType;
  badgeId?: string;
  description: string;
}

export interface GamificationData {
  chests: Chest[];
  badges: string[];
  exercisesCompleted: number;
  bossUnlocked: boolean;
  bossLastAttempt?: string;
  bossWins: number;
  bossesBeaten?: string[]; // boss ids that have been beaten at least once
  pointsMilestonesRewarded: number[]; // total-point thresholds already rewarded
  exerciseMilestonesRewarded: number[]; // exercise-count thresholds already rewarded
}

// ─── Exercise session (in-memory, not persisted) ──────────────────────────────

export interface ExerciseResult {
  exerciseId: string;
  correct: boolean;
  pointsEarned: number;
}
