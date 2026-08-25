// === OMRÅDEN ===
/**
 * Teknik är ett enda ämne i Lgr22, så innehållet delas i stället in i områden.
 * Områdena följer bokens sju delar.
 */
export type AreaId =
  | 'grunder'
  | 'bostad'
  | 'vardag'
  | 'utveckling'
  | 'rorelse'
  | 'system'
  | 'digital';

export interface Area {
  id: AreaId;
  name: string;
  /** Kort kod som visas som vattenstämpel på områdeskortet, t.ex. 'MK'. */
  shortName: string;
  emoji: string;
  /**
   * Antal kapitel i området. Ligger i metadatan så att startsidan kan visa
   * "3/8 klara" utan att ladda kapiteldatan – den hämtas först när eleven
   * valt område. scripts/check.mjs kontrollerar att siffran stämmer.
   */
  chapterCount: number;
  /** Områdets basfärg. Sidbakgrund, rubrikfält och panelkanter härleds ur den (utils/theme.ts). */
  accentHex: string;
  /**
   * Ljus neonvariant. Används för text och ikoner som ligger direkt mot den
   * mörka rymdbakgrunden, där accentHex vore för svag.
   */
  glowHex: string;
  /**
   * Mörk variant. Används för text inuti de ljusa korten, där en ljus färg
   * skulle bli oläslig.
   */
  inkHex: string;
  /** Färg för progressbarer och markerade flikar. Ska fungera mot både ljust kort och mörk panel. */
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
   * Namnregel: `<område>-<kapitel>`, t.ex. 'rorelse-enkla-maskiner'.
   * `areaId` måste matcha områdesdelen – scripts/check.mjs kontrollerar det.
   */
  id: string;
  title: string;
  emoji: string;
  description: string;
  areaId: AreaId;
  /** Sidhänvisning till boken, t.ex. '80–83'. Visas inte för eleven. */
  bookPages?: string;
  summary?: ChapterSummary;
  /** 10 övningar per kapitel. */
  exercises: Exercise[];
}

// === PROJEKT (bokens praktiska bygguppgifter) ===
/**
 * Projekten rättas inte av appen – eleven bygger något i klassrummet. De ligger
 * därför utanför områdena, utan poäng och stjärnor, och eleven bockar själv av
 * dem. Ett projekt som vore ett vanligt kapitel skulle antingen kräva
 * konstlade quizfrågor eller bli en återvändsgränd i en vy som lovar framsteg.
 */
export interface Project {
  id: string;
  title: string;
  emoji: string;
  /** Området projektet hör till i boken. Styr färgsättningen av kortet. */
  areaId: AreaId;
  bookPages: string;
  /** En mening om varför uppgiften finns – bakgrunden ur boken. */
  intro: string;
  /** Själva uppgiften, som den står i boken. */
  assignment: string;
  /** Punkterna som lösningen ska uppfylla. */
  requirements: string[];
  /** Arbetsgången, i ordning: skiss, bygge, programmering … */
  steps: { heading: string; text: string }[];
  /** Materiallistan. Vissa projekt delar upp den i grupper. */
  materials: { heading?: string; items: string[] }[];
  /** Bokens tips och mått, det som inte är krav men hjälper eleven vidare. */
  tips?: string[];
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
  areaCounts: Partial<Record<AreaId, number>>;
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
  | 'area-select'
  | 'chapter-map'
  | 'chapter-study'
  | 'chapter-exercise'
  | 'chapter-result'
  | 'exit-ticket'
  | 'achievements'
  | 'projects';

export interface ExerciseSessionResult {
  chapterId: string;
  correctAnswers: number;
  totalQuestions: number;
  score: number;
  stars: number;
  isNewBest: boolean;
}
