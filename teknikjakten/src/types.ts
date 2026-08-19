// === OMRÅDEN ===
/**
 * Teknik är ett enda ämne i Lgr22, så innehållet delas i stället in i områden.
 * Id:t är fritt tills områdesindelningen är bestämd – när AREAS i data/areaMeta.ts
 * fyllts i kan denna typ snävas till en union ('material' | 'system' | ...) så att
 * felstavade områdes-id fångas av typkontrollen.
 */
export type AreaId = string;

export interface Area {
  id: AreaId;
  name: string;
  /** Kort kod som visas som vattenstämpel på områdeskortet, t.ex. 'MK'. */
  shortName: string;
  emoji: string;
  /** Områdets basfärg. Kort, sidbakgrund och rubrikfält härleds ur den (utils/theme.ts). */
  accentHex: string;
  /** Textfärg för rubriker på områdets sidor – ska vara mörk nog mot ljus bakgrund. */
  inkHex: string;
  /** Färg för progressbarer och markerade flikar. Oftast samma som accentHex. */
  progressHex: string;
}

// === ÖVNINGAR ===
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

// === KAPITELSAMMANFATTNING ===
export interface Concept {
  term: string;
  definition: string;
  /**
   * Styr Wikipedia-bilden för begreppet.
   * - utelämnad: bilden hämtas via term
   * - satt till en artikeltitel: bilden hämtas via den titeln
   * - satt till '' (tom sträng): ingen bild visas
   *
   * Tekniska ord som "Hävstång" eller "Ledning" kan matcha en helt orelaterad
   * artikel – sätt titeln explicit, eller '' när ingen bra bild finns.
   */
  wikiTitle?: string;
}

export interface CauseEffect {
  cause: string;
  effect: string;
}

export interface TimelineEvent {
  /** '1879', 'ca 1450', '1900-talet' */
  year: string;
  /** 2–5 ord */
  title: string;
  /** 1–2 meningar */
  description: string;
  wikiTitle?: string;
}

export interface ChapterSummary {
  /** Sikta på 12–15 begrepp. */
  concepts: Concept[];
  /** 6–8 punkter. */
  keyPoints: string[];
  /** 5 par. */
  causeEffect: CauseEffect[];
  /** En mening som kopplar kapitlet till elevens vardag. */
  studentConnection: string;
  /** 8–10 påståenden. */
  trueFalse?: { statement: string; isTrue: boolean; explanation: string }[];
  /** 5–8 händelser där det passar. */
  timeline?: TimelineEvent[];
}

// === KAPITEL ===
export interface Chapter {
  /**
   * Namnregel: `ak<årskurs>-<område>-<kapitel>`, t.ex. 'ak4-material-hallfasthet'.
   * `grade` måste matcha siffran i id:t och `areaId` områdesdelen –
   * scripts/check.mjs kontrollerar det.
   */
  id: string;
  title: string;
  emoji: string;
  description: string;
  areaId: AreaId;
  grade?: string;
  summary?: ChapterSummary;
  /** 10 övningar per kapitel. */
  exercises: Exercise[];
}

// === PROGRESS (sparas per enhet, inga konton) ===
export interface ChapterProgress {
  chapterId: string;
  completed: boolean;
  bestScore: number;
  stars: number;
  totalAttempts: number;
}

// === PRESTATIONER ===
export interface AchievementStats {
  completedChapters: number;
  totalCorrect: number;
  totalAnswered: number;
  progress: ChapterProgress[];
  /** Antal klarade kapitel per område, nyckel = areaId. */
  areaCounts: Record<AreaId, number>;
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

// === APPENS VYER ===
export type AppView =
  | 'grade-select'
  | 'area-select'
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
