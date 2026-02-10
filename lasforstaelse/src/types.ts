// Frågetyper från biblioteket
export type QuestionType = 'literal' | 'inferens' | 'ord' | 'sammanfatta';

// Genre
export type Genre = 'berättelse' | 'faktatext';

// En fråga i biblioteket (flervalsfråga)
export interface LibraryQuestion {
  type: QuestionType;
  q: string;
  options: string[]; // 4 svarsalternativ
  correct: number;   // Index för rätt svar (0-3)
}

// En text från library.json
export interface LibraryText {
  id: string;
  grade: number; // 1-9
  genre: string;
  theme: string;
  title: string;
  text: string;
  questions: LibraryQuestion[];
  meta?: {
    wordCount: number;
    fingerprint: string;
    generatedAt: string;
    model: string;
  };
}

// App states
export enum AppState {
  LOGIN = 'login',
  SETUP = 'setup',
  READING = 'reading',
  QUIZ = 'quiz',
  RESULT = 'result',
}

// Användarens svar
export interface UserAnswers {
  [questionIndex: number]: string;
}

// Badge-typer
export enum BadgeType {
  FIRST_TEXT = 'first_text',
  FIVE_TEXTS = 'five_texts',
  TEN_TEXTS = 'ten_texts',
  TWENTY_FIVE_TEXTS = 'twenty_five_texts',
  FIFTY_TEXTS = 'fifty_texts',
  PERFECT_SCORE = 'perfect_score',
  THREE_PERFECT = 'three_perfect',
  FIVE_PERFECT = 'five_perfect',
  ALL_GRADES = 'all_grades',
  STREAK_3 = 'streak_3',
  STREAK_7 = 'streak_7',
}

// En badge
export interface Badge {
  type: BadgeType;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

// Sparad info om en läst text
export interface CompletedText {
  textId: string;
  grade: number;
  title: string;
  score: number;
  totalQuestions: number;
  pointsEarned: number;
  completedAt: string;
}

// Tillgängliga avatarer
export const AVATAR_OPTIONS = [
  '🦊', '🐼', '🦁', '🐯', '🐻', '🐨', '🐸', '🦉',
  '🦋', '🐙', '🦈', '🐬', '🦄', '🐲', '🤖', '👾',
  '🧙', '🧚', '🦸', '🥷', '🎨', '🚀', '⭐', '🌈'
];

// Användarprofil (sparas i localStorage)
export interface User {
  name: string;
  avatar: string; // Emoji avatar
  totalPoints: number;
  badges: Badge[];
  completedTexts: CompletedText[];
  perfectScoreStreak: number;
  gradesCompleted: number[]; // vilka årskurser man klarat minst en text i
  createdAt: string;
  lastActivity: string;
}

// Badge-definitioner
export const BADGE_DEFINITIONS: Record<BadgeType, Omit<Badge, 'earnedAt'>> = {
  [BadgeType.FIRST_TEXT]: {
    type: BadgeType.FIRST_TEXT,
    name: 'Första steget',
    description: 'Läste din första text',
    icon: '🌟',
  },
  [BadgeType.FIVE_TEXTS]: {
    type: BadgeType.FIVE_TEXTS,
    name: 'Läshaj',
    description: 'Läst 5 texter',
    icon: '🦈',
  },
  [BadgeType.TEN_TEXTS]: {
    type: BadgeType.TEN_TEXTS,
    name: 'Bokmal',
    description: 'Läst 10 texter',
    icon: '🐛',
  },
  [BadgeType.TWENTY_FIVE_TEXTS]: {
    type: BadgeType.TWENTY_FIVE_TEXTS,
    name: 'Läsmästare',
    description: 'Läst 25 texter',
    icon: '🏆',
  },
  [BadgeType.FIFTY_TEXTS]: {
    type: BadgeType.FIFTY_TEXTS,
    name: 'Läslegend',
    description: 'Läst 50 texter',
    icon: '👑',
  },
  [BadgeType.PERFECT_SCORE]: {
    type: BadgeType.PERFECT_SCORE,
    name: 'Prickskytt',
    description: 'Alla rätt på en text',
    icon: '🎯',
  },
  [BadgeType.THREE_PERFECT]: {
    type: BadgeType.THREE_PERFECT,
    name: 'Tredubbel',
    description: '3 texter i rad med alla rätt',
    icon: '🔥',
  },
  [BadgeType.FIVE_PERFECT]: {
    type: BadgeType.FIVE_PERFECT,
    name: 'Ostoppbar',
    description: '5 texter i rad med alla rätt',
    icon: '💎',
  },
  [BadgeType.ALL_GRADES]: {
    type: BadgeType.ALL_GRADES,
    name: 'Allroundläsare',
    description: 'Klarat texter i alla årskurser',
    icon: '🌈',
  },
  [BadgeType.STREAK_3]: {
    type: BadgeType.STREAK_3,
    name: 'Regelbunden',
    description: 'Läst 3 dagar i rad',
    icon: '📅',
  },
  [BadgeType.STREAK_7]: {
    type: BadgeType.STREAK_7,
    name: 'Veckoläsare',
    description: 'Läst 7 dagar i rad',
    icon: '🗓️',
  },
};
