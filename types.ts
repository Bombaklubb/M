export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  SHORT_ANSWER = 'short_answer',
  REASONING = 'reasoning'
}

export enum TextType {
  NARRATIVE = 'narrative',
  DESCRIPTIVE = 'descriptive',
  ARGUMENTATIVE = 'argumentative'
}

export const TEXT_TYPES = [
  { value: TextType.NARRATIVE, label: 'Berättande', icon: '📖', description: 'Berättelser och händelser' },
  { value: TextType.DESCRIPTIVE, label: 'Beskrivande', icon: '🎨', description: 'Beskrivningar och fakta' },
  { value: TextType.ARGUMENTATIVE, label: 'Argumenterande', icon: '💬', description: 'Åsikter och argument' },
];

export interface Question {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[]; // Only for MULTIPLE_CHOICE
  correctAnswer: string;
  explanation: string;
}

export interface ReadingExercise {
  level: number;
  title: string;
  content: string;
  textType: TextType;
  questions: Question[];
}

export enum AppState {
  SETUP = 'setup',
  LOADING = 'loading',
  READING = 'reading',
  QUIZ = 'quiz',
  RESULT = 'result',
  ERROR = 'error'
}

export interface UserAnswers {
  [questionId: number]: string;
}

export const TOPICS = [
  "Djur & Natur",
  "Rymden",
  "Sport & Fritid",
  "Historia & Forntiden",
  "Vetenskap",
  "Äventyr & Spänning",
  "Vardagsliv & Vänskap",
  "Sverige & Världen",
  "Teknik & Uppfinningar"
];

// Autentisering och användare
export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher'
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  currentLevel: number;
  totalPoints: number;
  streak: number;
  lastActivity: string; // ISO date string
  badges: Badge[];
  completedTexts: number;
  avatarId?: number;
}

// Gamification
export enum BadgeType {
  FIRST_TEXT = 'first_text',
  TEN_TEXTS = 'ten_texts',
  FIFTY_TEXTS = 'fifty_texts',
  HUNDRED_TEXTS = 'hundred_texts',
  FIVE_DAY_STREAK = 'five_day_streak',
  TEN_DAY_STREAK = 'ten_day_streak',
  THIRTY_DAY_STREAK = 'thirty_day_streak',
  PERFECT_SCORE = 'perfect_score',
  FIVE_PERFECT = 'five_perfect',
  LEVEL_UP = 'level_up',
  REACH_LEVEL_20 = 'reach_level_20'
}

export interface Badge {
  type: BadgeType;
  name: string;
  description: string;
  icon: string;
  earnedAt: string; // ISO date string
}

export interface TextResult {
  id: string;
  userId: string;
  textTitle: string;
  level: number;
  topic: string;
  score: number; // antal rätt
  totalQuestions: number;
  pointsEarned: number;
  completedAt: string; // ISO date string
}

// Lärarvy
export interface Classroom {
  id: string;
  teacherId: string;
  name: string;
  students: string[]; // user IDs
}

export interface StudentProgress {
  user: User;
  recentResults: TextResult[];
  averageScore: number;
  totalTextsRead: number;
}

// ===========================================
// TEXTKORTLEK - Typdefinitioner
// ===========================================

export enum CardGameTextType {
  NARRATIVE = 'narrative',           // Berättande text
  FACTUAL = 'factual',              // Faktatext
  INSTRUCTION = 'instruction',       // Instruktion
  ARGUMENTATIVE = 'argumentative'    // Argumenterande text (insändare/debattinlägg)
}

export const CARD_GAME_TEXT_TYPES = [
  { value: CardGameTextType.NARRATIVE, label: 'Berättande text', icon: '📖', description: 'Berättelser med karaktärer och händelser' },
  { value: CardGameTextType.FACTUAL, label: 'Faktatext', icon: '📚', description: 'Faktatexter om olika ämnen' },
  { value: CardGameTextType.INSTRUCTION, label: 'Instruktion', icon: '📝', description: 'Steg-för-steg-instruktioner' },
  { value: CardGameTextType.ARGUMENTATIVE, label: 'Argumenterande text', icon: '💬', description: 'Insändare och debattinlägg' },
];

export enum CardGameLevel {
  A = 'A',  // åk 1-3
  B = 'B',  // åk 4-6
  C = 'C'   // åk 7-9
}

export const CARD_GAME_LEVELS = [
  { value: CardGameLevel.A, label: 'Nivå A', grades: 'åk 1-3', description: 'Enklare texter, 4-8 meningar' },
  { value: CardGameLevel.B, label: 'Nivå B', grades: 'åk 4-6', description: 'Medel, 8-15 meningar' },
  { value: CardGameLevel.C, label: 'Nivå C', grades: 'åk 7-9', description: 'Avancerat, 12-25 meningar' },
];

export enum CardType {
  STRUCTURE = 'structure',   // Strukturkort (Rubrik, Inledning, Stycke, Avslut)
  LANGUAGE = 'language',     // Språkkort (sambandsord, ordningsord, beskrivande ord)
  CONTENT = 'content',       // Innehållskort (tema, karaktär, plats, problem, etc.)
  CHALLENGE = 'challenge'    // Utmaningskort (extra krav)
}

export interface GameCard {
  id: string;
  type: CardType;
  category: string;      // T.ex. "Karaktär", "Sambandsord", "Rubrik"
  content: string;       // Kortets innehåll
  description?: string;  // Extra förklaring om behov finns
}

export interface CardHand {
  cards: GameCard[];
  swapsRemaining: number;
  maxSwaps: number;
}

export interface Disposition {
  rubrik: string;
  inledning: string;
  stycken: string[];
  avslut: string;
}

export enum CheckStatus {
  FULFILLED = 'fulfilled',
  ALMOST = 'almost',
  MISSING = 'missing'
}

export interface CheckResult {
  label: string;
  status: CheckStatus;
  comment: string;
}

export interface QuickCheck {
  rubrik: CheckResult;
  stycken: CheckResult;
  meningar: CheckResult;
  sambandsord: CheckResult;
  amnesord?: CheckResult;        // Endast för faktatext
  argumentDrag?: {               // Endast för argumenterande text
    tes: CheckResult;
    argument: CheckResult;
    motargument?: CheckResult;   // Endast nivå C
    uppmaning: CheckResult;
  };
}

export interface Feedback {
  styrka1: string;
  styrka2: string;
  nastaSteg1: string;
  nastaSteg2: string;
  mikroOvning: string;
}

export interface CardGameSession {
  id: string;
  userId: string;
  textType: CardGameTextType;
  level: CardGameLevel;
  cardHand: CardHand;
  disposition: Disposition;
  studentText: string;
  quickCheck?: QuickCheck;
  feedback?: Feedback;
  createdAt: string;
  completedAt?: string;
}

export enum CardGameState {
  SETUP = 'setup',
  CARDS_DRAWN = 'cards_drawn',
  WRITING = 'writing',
  CHECKING = 'checking',
  FEEDBACK = 'feedback'
}