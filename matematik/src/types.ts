// === GRADES ===
export type Grade =
  | '1' | '2' | '3'   // Nivå 1–3
  | '4' | '5' | '6'   // Nivå 4–6
  | '7' | '8' | '9'   // Nivå 7–9
  | 'gym1' | 'gym2' | 'gym3'; // Nivå 10

export const GRADE_LABELS: Record<Grade, string> = {
  '1': 'Nivå 1', '2': 'Nivå 2', '3': 'Nivå 3',
  '4': 'Nivå 4', '5': 'Nivå 5', '6': 'Nivå 6',
  '7': 'Nivå 7', '8': 'Nivå 8', '9': 'Nivå 9',
  'gym1': 'Nivå 10', 'gym2': 'Nivå 10', 'gym3': 'Nivå 10',
};

export const GRADE_STAGE: Record<Grade, string> = {
  '1': 'Nivå 1–3', '2': 'Nivå 1–3', '3': 'Nivå 1–3',
  '4': 'Nivå 4–6', '5': 'Nivå 4–6', '6': 'Nivå 4–6',
  '7': 'Nivå 7–9', '8': 'Nivå 7–9', '9': 'Nivå 7–9',
  'gym1': 'Nivå 10', 'gym2': 'Nivå 10', 'gym3': 'Nivå 10',
};

// === EXERCISES ===
export type ExerciseType =
  | 'multiple-choice'
  | 'fill-in'
  | 'true-false'
  | 'clock-set'
  | 'order'
  | 'match';

export interface BaseExercise {
  id: string;
  type: ExerciseType;
  question: string;
  explanation?: string; // shown after answering
  points: number;
  clockDisplay?: { hour: number; minute: number }; // shows a static clock above the question
}

export interface MultipleChoiceExercise extends BaseExercise {
  type: 'multiple-choice';
  options: string[];
  correctIndex: number;
}

export interface FillInExercise extends BaseExercise {
  type: 'fill-in';
  answer: string | number;
  acceptableAnswers?: (string | number)[];
  hint?: string;
}

export interface TrueFalseExercise extends BaseExercise {
  type: 'true-false';
  isTrue: boolean;
}

export interface ClockSetExercise extends BaseExercise {
  type: 'clock-set';
  targetHour: number;    // 1–12
  targetMinute: number;  // 0, 5, 10, …, 55
}

export type Exercise = MultipleChoiceExercise | FillInExercise | TrueFalseExercise | ClockSetExercise;

// === TOPICS ===
export interface TopicInstruction {
  title: string;
  text: string;
  illustration: string; // SVG component name or inline SVG string
  examples?: string[];
}

export interface Topic {
  id: string;
  title: string;
  icon: string; // emoji
  description: string;
  grades: Grade[];
  minGrade: number; // for unlock logic (1-12)
  color: string; // tailwind color class
  instruction: TopicInstruction;
  exercises: Exercise[];
  tags?: string[];
}

// === STUDENT ===
export interface Student {
  id: string;
  name: string;
  grade: Grade;
  createdAt: string;
  avatar: number; // 0-7 avatar index
}

// === PROGRESS ===
export interface TopicProgress {
  topicId: string;
  completed: boolean;
  bestScore: number;       // 0-100
  totalAttempts: number;
  correctAnswers: number;
  totalQuestions: number;
  lastAttempt: string;
  stars: number;           // 0-3
  timeSpent: number;       // seconds
}

export interface ExerciseResult {
  exerciseId: string;
  correct: boolean;
  answer: string;
  timestamp: string;
}

// === POINTS & LEVELS ===
export interface PointsRecord {
  studentId: string;
  total: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  weeklyPoints: number;
  weekStart: string;
}

export const LEVEL_THRESHOLDS = [0, 50, 150, 300, 500, 800, 1200, 1800, 2500, 3500, 5000];
export const LEVEL_NAMES = [
  'Nybörjare', 'Räknare', 'Mattenisse', 'Talälskare',
  'Formelmästare', 'Algebristen', 'Problemlösaren', 'Statistikern',
  'Mattestjärnan', 'Matematikern', 'Matte-Legenden',
];
export const LEVEL_COLORS = [
  'from-gray-400 to-gray-500',
  'from-green-400 to-green-600',
  'from-blue-400 to-blue-600',
  'from-purple-400 to-purple-600',
  'from-yellow-400 to-orange-500',
  'from-orange-400 to-red-500',
  'from-pink-400 to-rose-600',
  'from-indigo-400 to-purple-700',
  'from-cyan-400 to-blue-600',
  'from-amber-400 to-yellow-600',
  'from-red-400 to-pink-600',
];

// === ACHIEVEMENTS ===
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;        // emoji
  color: string;       // tailwind
  condition: (stats: StudentStats) => boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface EarnedAchievement {
  achievementId: string;
  earnedAt: string;
}

// === STATS ===
export interface StudentStats {
  student: Student;
  points: PointsRecord;
  progress: TopicProgress[];
  achievements: EarnedAchievement[];
  totalCorrect: number;
  totalAnswered: number;
  completedTopics: number;
  totalTopics: number;
  daysActive: number;
}

// === TEACHER ===
export interface ClassStats {
  totalStudents: number;
  activeToday: number;
  topTopics: { topicId: string; title: string; attempts: number }[];
  gradeDistribution: Record<Grade, number>;
  averageScore: number;
  totalExercisesCompleted: number;
}

// === STUDENT MESSAGES ===
export interface StudentMessage {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: number;
  message: string;
  sentAt: string;
  read: boolean;
}

// === CHESTS / GAMIFICATION ===
export type ChestType = 'wood' | 'silver' | 'gold' | 'rubin' | 'smaragd' | 'diamant' | 'hemlig';

export interface MattChest {
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

export interface MattGamificationData {
  chests: MattChest[];
  badges: string[];
  exercisesCompleted: number;
  bossUnlocked: boolean;
  bossWins: number;
  pointsMilestonesRewarded: number[];
  exerciseMilestonesRewarded: number[];
  /** topicIds that already gave a completion chest */
  topicCompletionChestsRewarded: string[];
  /** topicIds that already gave a 3-star chest */
  topic3StarChestsRewarded: string[];
  /** topicIds that already gave a perfect-score chest */
  topicPerfectChestsRewarded: string[];
  /** worldIds that already gave a world-completion gold chest */
  worldCompletionChestsRewarded: string[];
}

// === APP STATE ===
export type AppView =
  | 'login'
  | 'dashboard'
  | 'topic-instruction'
  | 'topic-exercise'
  | 'topic-result'
  | 'my-results'
  | 'achievements'
  | 'teacher'
  | 'teacher-login';

export interface AppState {
  currentStudent: Student | null;
  currentView: AppView;
  selectedTopic: Topic | null;
  isTeacher: boolean;
}
