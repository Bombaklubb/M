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
  "🎲 Slumpa fram en text",
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