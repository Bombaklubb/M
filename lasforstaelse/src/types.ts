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
  FIFTEEN_TEXTS = 'fifteen_texts',
  TWENTY_FIVE_TEXTS = 'twenty_five_texts',
  THIRTY_TEXTS = 'thirty_texts',
  FIFTY_TEXTS = 'fifty_texts',
  SEVENTY_FIVE_TEXTS = 'seventy_five_texts',
  HUNDRED_TEXTS = 'hundred_texts',
  PERFECT_SCORE = 'perfect_score',
  THREE_PERFECT = 'three_perfect',
  FIVE_PERFECT = 'five_perfect',
  TEN_PERFECT = 'ten_perfect',
  ALL_GRADES = 'all_grades',
  BEGINNER_GRADES = 'beginner_grades',
  MIDDLE_GRADES = 'middle_grades',
  ADVANCED_GRADES = 'advanced_grades',
  EXPLORER = 'explorer',
  STREAK_3 = 'streak_3',
  STREAK_7 = 'streak_7',
  HUNDRED_POINTS = 'hundred_points',
  FIVE_HUNDRED_POINTS = 'five_hundred_points',
  THOUSAND_POINTS = 'thousand_points',
  STORY_LOVER = 'story_lover',
  FACT_LOVER = 'fact_lover',
}

// En badge
export interface Badge {
  type: BadgeType;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

// Resultat för en enskild fråga
export interface QuestionResult {
  questionType: QuestionType;  // 'literal', 'inferens', etc.
  correct: boolean;
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
  genre?: string;
  theme?: string;
  questionResults?: QuestionResult[];  // Detaljerad info om varje fråga
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
  [BadgeType.FIFTEEN_TEXTS]: {
    type: BadgeType.FIFTEEN_TEXTS,
    name: 'Läsälskare',
    description: 'Läst 15 texter',
    icon: '📕',
  },
  [BadgeType.TWENTY_FIVE_TEXTS]: {
    type: BadgeType.TWENTY_FIVE_TEXTS,
    name: 'Läsmästare',
    description: 'Läst 25 texter',
    icon: '🏆',
  },
  [BadgeType.THIRTY_TEXTS]: {
    type: BadgeType.THIRTY_TEXTS,
    name: 'Bokslukare',
    description: 'Läst 30 texter',
    icon: '📗',
  },
  [BadgeType.FIFTY_TEXTS]: {
    type: BadgeType.FIFTY_TEXTS,
    name: 'Läslegend',
    description: 'Läst 50 texter',
    icon: '👑',
  },
  [BadgeType.SEVENTY_FIVE_TEXTS]: {
    type: BadgeType.SEVENTY_FIVE_TEXTS,
    name: 'Bokhjälte',
    description: 'Läst 75 texter',
    icon: '🦸',
  },
  [BadgeType.HUNDRED_TEXTS]: {
    type: BadgeType.HUNDRED_TEXTS,
    name: 'Superläsare',
    description: 'Läst 100 texter',
    icon: '📚',
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
  [BadgeType.TEN_PERFECT]: {
    type: BadgeType.TEN_PERFECT,
    name: 'Perfektionist',
    description: '10 texter i rad med alla rätt',
    icon: '⭐',
  },
  [BadgeType.ALL_GRADES]: {
    type: BadgeType.ALL_GRADES,
    name: 'Allroundläsare',
    description: 'Klarat texter i alla årskurser',
    icon: '🌈',
  },
  [BadgeType.BEGINNER_GRADES]: {
    type: BadgeType.BEGINNER_GRADES,
    name: 'Nybörjarläsare',
    description: 'Klarat åk 1, 2 och 3',
    icon: '🌱',
  },
  [BadgeType.MIDDLE_GRADES]: {
    type: BadgeType.MIDDLE_GRADES,
    name: 'Mellanläsare',
    description: 'Klarat åk 4, 5 och 6',
    icon: '🌿',
  },
  [BadgeType.ADVANCED_GRADES]: {
    type: BadgeType.ADVANCED_GRADES,
    name: 'Avancerad läsare',
    description: 'Klarat åk 7, 8 och 9',
    icon: '🌳',
  },
  [BadgeType.EXPLORER]: {
    type: BadgeType.EXPLORER,
    name: 'Utforskare',
    description: 'Provat minst 5 olika årskurser',
    icon: '🧭',
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
  [BadgeType.HUNDRED_POINTS]: {
    type: BadgeType.HUNDRED_POINTS,
    name: 'Poängsamlare',
    description: 'Tjänat 100 poäng totalt',
    icon: '💰',
  },
  [BadgeType.FIVE_HUNDRED_POINTS]: {
    type: BadgeType.FIVE_HUNDRED_POINTS,
    name: 'Poängmästare',
    description: 'Tjänat 500 poäng totalt',
    icon: '💵',
  },
  [BadgeType.THOUSAND_POINTS]: {
    type: BadgeType.THOUSAND_POINTS,
    name: 'Poänglegend',
    description: 'Tjänat 1000 poäng totalt',
    icon: '💎',
  },
  [BadgeType.STORY_LOVER]: {
    type: BadgeType.STORY_LOVER,
    name: 'Berättelseälskare',
    description: 'Läst 10 berättelser',
    icon: '📖',
  },
  [BadgeType.FACT_LOVER]: {
    type: BadgeType.FACT_LOVER,
    name: 'Faktanörd',
    description: 'Läst 10 faktatexter',
    icon: '🔬',
  },
};
