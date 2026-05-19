// Question types: 3 "on the lines" (literal) + 3 "between the lines" (inference) = 6 per text
export type QuestionType = 'literal' | 'inference';

// Genre
export type Genre = 'fiction' | 'non-fiction';

// A question in the library
export interface LibraryQuestion {
  type: QuestionType;
  q: string;
  options: string[]; // 4 answer choices
  correct: number;   // Index of correct answer (0-3)
}

// A text from library.json
export interface LibraryText {
  id: string;
  grade: number; // 1-9 (level)
  genre: string;
  theme: string;
  title: string;
  text: string;
  questions: LibraryQuestion[];
  imageUrl?: string; // Image support for lower levels (grade 1-2)
  glossary?: Record<string, string>; // Word definitions specific to this text
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

// User answers
export interface UserAnswers {
  [questionIndex: number]: string;
}

// Badge types
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
  ADVANCED_LEVEL = 'advanced_level',
  TWO_THOUSAND_POINTS = 'two_thousand_points',
  FIVE_THOUSAND_POINTS = 'five_thousand_points',
  FAST_READER = 'fast_reader',
  ENDURANCE = 'endurance',
  STREAK_14 = 'streak_14',
  BIG_SCORER = 'big_scorer',
  GENRE_MIX = 'genre_mix',
  PERFECT_FIVE_TOTAL = 'perfect_five_total',
  ADVANCED_EXPERT = 'advanced_expert',
  MORNING_READER = 'morning_reader',
  NIGHT_OWL = 'night_owl',
}

// A badge
export interface Badge {
  type: BadgeType;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

// Result for a single question
export interface QuestionResult {
  questionType: QuestionType;
  correct: boolean;
}

// Info about a completed text
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
  questionResults?: QuestionResult[];
  readingTimeSeconds?: number;
}

// Available avatars
export const AVATAR_OPTIONS = [
  '🦊', '🐼', '🦁', '🐯', '🐻', '🐨', '🐸', '🦉',
  '🦋', '🐙', '🦈', '🐬', '🦄', '🐲', '🤖', '👾',
  '🧙', '🧚', '🦸', '🥷', '🎨', '🚀', '⭐', '🌈',
  '🐶', '🐱', '🐰', '🦝', '🦜', '🐧', '🦩', '🐢', '🦀', '🎪'
];

// User profile (stored in localStorage)
export interface User {
  name: string;
  avatar: string;
  totalPoints: number;
  badges: Badge[];
  completedTexts: CompletedText[];
  perfectScoreStreak: number;
  gradesCompleted: number[];
  createdAt: string;
  lastActivity: string;
}

// Message from student to teacher
export interface StudentMessage {
  id: string;
  studentName: string;
  studentAvatar: string;
  message: string;
  sentAt: string;
  read: boolean;
}

// Badge definitions (all in English)
export const BADGE_DEFINITIONS: Record<BadgeType, Omit<Badge, 'earnedAt'>> = {
  [BadgeType.FIRST_TEXT]: {
    type: BadgeType.FIRST_TEXT,
    name: 'First Step',
    description: 'Read your first text',
    icon: '🌟',
  },
  [BadgeType.FIVE_TEXTS]: {
    type: BadgeType.FIVE_TEXTS,
    name: 'Reader Shark',
    description: 'Read 5 texts',
    icon: '🦈',
  },
  [BadgeType.TEN_TEXTS]: {
    type: BadgeType.TEN_TEXTS,
    name: 'Bookworm',
    description: 'Read 10 texts',
    icon: '🐛',
  },
  [BadgeType.FIFTEEN_TEXTS]: {
    type: BadgeType.FIFTEEN_TEXTS,
    name: 'Book Lover',
    description: 'Read 15 texts',
    icon: '📕',
  },
  [BadgeType.TWENTY_FIVE_TEXTS]: {
    type: BadgeType.TWENTY_FIVE_TEXTS,
    name: 'Reading Master',
    description: 'Read 25 texts',
    icon: '🏆',
  },
  [BadgeType.THIRTY_TEXTS]: {
    type: BadgeType.THIRTY_TEXTS,
    name: 'Book Devourer',
    description: 'Read 30 texts',
    icon: '📗',
  },
  [BadgeType.FIFTY_TEXTS]: {
    type: BadgeType.FIFTY_TEXTS,
    name: 'Reading Legend',
    description: 'Read 50 texts',
    icon: '👑',
  },
  [BadgeType.SEVENTY_FIVE_TEXTS]: {
    type: BadgeType.SEVENTY_FIVE_TEXTS,
    name: 'Book Hero',
    description: 'Read 75 texts',
    icon: '🦸',
  },
  [BadgeType.HUNDRED_TEXTS]: {
    type: BadgeType.HUNDRED_TEXTS,
    name: 'Super Reader',
    description: 'Read 100 texts',
    icon: '📚',
  },
  [BadgeType.PERFECT_SCORE]: {
    type: BadgeType.PERFECT_SCORE,
    name: 'Sharpshooter',
    description: 'Got all answers correct on one text',
    icon: '🎯',
  },
  [BadgeType.THREE_PERFECT]: {
    type: BadgeType.THREE_PERFECT,
    name: 'Triple Ace',
    description: '3 texts in a row with all correct',
    icon: '🔥',
  },
  [BadgeType.FIVE_PERFECT]: {
    type: BadgeType.FIVE_PERFECT,
    name: 'Unstoppable',
    description: '5 texts in a row with all correct',
    icon: '💎',
  },
  [BadgeType.TEN_PERFECT]: {
    type: BadgeType.TEN_PERFECT,
    name: 'Perfectionist',
    description: '10 texts in a row with all correct',
    icon: '⭐',
  },
  [BadgeType.ALL_GRADES]: {
    type: BadgeType.ALL_GRADES,
    name: 'All-Round Reader',
    description: 'Completed texts at all levels',
    icon: '🌈',
  },
  [BadgeType.BEGINNER_GRADES]: {
    type: BadgeType.BEGINNER_GRADES,
    name: 'Beginner Reader',
    description: 'Completed levels 1, 2 and 3',
    icon: '🌱',
  },
  [BadgeType.MIDDLE_GRADES]: {
    type: BadgeType.MIDDLE_GRADES,
    name: 'Middle Reader',
    description: 'Completed levels 4, 5 and 6',
    icon: '🌿',
  },
  [BadgeType.ADVANCED_GRADES]: {
    type: BadgeType.ADVANCED_GRADES,
    name: 'Advanced Reader',
    description: 'Completed levels 7, 8 and 9',
    icon: '🌳',
  },
  [BadgeType.EXPLORER]: {
    type: BadgeType.EXPLORER,
    name: 'Explorer',
    description: 'Tried at least 5 different levels',
    icon: '🧭',
  },
  [BadgeType.STREAK_3]: {
    type: BadgeType.STREAK_3,
    name: 'Consistent',
    description: 'Read 3 days in a row',
    icon: '📅',
  },
  [BadgeType.STREAK_7]: {
    type: BadgeType.STREAK_7,
    name: 'Weekly Reader',
    description: 'Read 7 days in a row',
    icon: '🗓️',
  },
  [BadgeType.HUNDRED_POINTS]: {
    type: BadgeType.HUNDRED_POINTS,
    name: 'Point Collector',
    description: 'Earned 100 points total',
    icon: '💰',
  },
  [BadgeType.FIVE_HUNDRED_POINTS]: {
    type: BadgeType.FIVE_HUNDRED_POINTS,
    name: 'Point Master',
    description: 'Earned 500 points total',
    icon: '💵',
  },
  [BadgeType.THOUSAND_POINTS]: {
    type: BadgeType.THOUSAND_POINTS,
    name: 'Point Legend',
    description: 'Earned 1,000 points total',
    icon: '💎',
  },
  [BadgeType.STORY_LOVER]: {
    type: BadgeType.STORY_LOVER,
    name: 'Story Lover',
    description: 'Read 10 fiction texts',
    icon: '📖',
  },
  [BadgeType.FACT_LOVER]: {
    type: BadgeType.FACT_LOVER,
    name: 'Fact Nerd',
    description: 'Read 10 non-fiction texts',
    icon: '🔬',
  },
  [BadgeType.ADVANCED_LEVEL]: {
    type: BadgeType.ADVANCED_LEVEL,
    name: 'High Achiever',
    description: 'Completed a level 9 or 10 text',
    icon: '🎓',
  },
  [BadgeType.TWO_THOUSAND_POINTS]: {
    type: BadgeType.TWO_THOUSAND_POINTS,
    name: 'Point Star',
    description: 'Earned 2,000 points total',
    icon: '🌠',
  },
  [BadgeType.FIVE_THOUSAND_POINTS]: {
    type: BadgeType.FIVE_THOUSAND_POINTS,
    name: 'Point Guru',
    description: 'Earned 5,000 points total',
    icon: '🏅',
  },
  [BadgeType.FAST_READER]: {
    type: BadgeType.FAST_READER,
    name: 'Speed Reader',
    description: 'Completed a text in under 4 minutes',
    icon: '⚡',
  },
  [BadgeType.ENDURANCE]: {
    type: BadgeType.ENDURANCE,
    name: 'Endurance',
    description: 'Read for more than 30 minutes in one day',
    icon: '🏃',
  },
  [BadgeType.STREAK_14]: {
    type: BadgeType.STREAK_14,
    name: 'Fortnight Reader',
    description: 'Read 14 days in a row',
    icon: '📆',
  },
  [BadgeType.BIG_SCORER]: {
    type: BadgeType.BIG_SCORER,
    name: 'Big Scorer',
    description: 'Earned 500 points in a single day',
    icon: '💥',
  },
  [BadgeType.GENRE_MIX]: {
    type: BadgeType.GENRE_MIX,
    name: 'Genre Mix',
    description: 'Read both fiction and non-fiction on the same day',
    icon: '🎭',
  },
  [BadgeType.PERFECT_FIVE_TOTAL]: {
    type: BadgeType.PERFECT_FIVE_TOTAL,
    name: 'Perfect Pro',
    description: 'Got all correct on 5 texts total',
    icon: '🌟',
  },
  [BadgeType.ADVANCED_EXPERT]: {
    type: BadgeType.ADVANCED_EXPERT,
    name: 'Advanced Expert',
    description: 'Completed 10 texts at level 9 or above',
    icon: '🎓',
  },
  [BadgeType.MORNING_READER]: {
    type: BadgeType.MORNING_READER,
    name: 'Early Bird',
    description: 'Read a text before 09:00',
    icon: '🌅',
  },
  [BadgeType.NIGHT_OWL]: {
    type: BadgeType.NIGHT_OWL,
    name: 'Night Owl',
    description: 'Read a text after 20:00',
    icon: '🦉',
  },
};

// ─── Gamification / Chests ──────────────────────────────────────────────────

export type ChestType = 'bronze' | 'silver' | 'gold' | 'emerald' | 'ruby' | 'diamond' | 'secret';

export interface Chest {
  id: string;
  type: ChestType;
  earnedAt: string;
  opened: boolean;
  openedReward?: string;
}

export type MysteryRewardType = 'points' | 'chest' | 'badge';

export interface MysteryBoxReward {
  type: MysteryRewardType;
  points?: number;
  chestType?: ChestType;
  badgeId?: string;
  description: string;
}

export interface GamificationData {
  chests: Chest[];
  gamificationBadges: string[];
  textsCompleted: number;
  pointsMilestonesRewarded: number[];
  textMilestonesRewarded: number[];
}
