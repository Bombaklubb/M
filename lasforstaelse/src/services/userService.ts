import { User, Badge, BadgeType, BADGE_DEFINITIONS, CompletedText } from '../types';

const STORAGE_KEY = 'lasforstaelse_user';

/**
 * Skapa en ny användare
 */
export function createUser(name: string): User {
  const now = new Date().toISOString();
  return {
    name: name.trim(),
    totalPoints: 0,
    badges: [],
    completedTexts: [],
    perfectScoreStreak: 0,
    gradesCompleted: [],
    createdAt: now,
    lastActivity: now,
  };
}

/**
 * Ladda användare från localStorage
 */
export function loadUser(): User | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as User;
    }
  } catch (error) {
    console.error('Kunde inte ladda användare:', error);
  }
  return null;
}

/**
 * Spara användare till localStorage
 */
export function saveUser(user: User): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Kunde inte spara användare:', error);
  }
}

/**
 * Logga ut (radera användare)
 */
export function logoutUser(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Beräkna poäng för ett resultat
 */
export function calculatePoints(
  score: number,
  totalQuestions: number,
  grade: number
): number {
  const percentage = score / totalQuestions;
  const basePoints = Math.round(percentage * 100);

  // Bonus för högre årskurser
  const gradeBonus = Math.floor(grade * 5 * percentage);

  // Extra bonus för alla rätt
  const perfectBonus = percentage === 1 ? 50 : 0;

  return basePoints + gradeBonus + perfectBonus;
}

/**
 * Kontrollera och dela ut nya badges
 */
export function checkForNewBadges(user: User): Badge[] {
  const newBadges: Badge[] = [];
  const now = new Date().toISOString();

  const hasBadge = (type: BadgeType) => user.badges.some(b => b.type === type);
  const addBadge = (type: BadgeType) => {
    if (!hasBadge(type)) {
      newBadges.push({ ...BADGE_DEFINITIONS[type], earnedAt: now });
    }
  };

  const totalTexts = user.completedTexts.length;

  // Antal texter-badges
  if (totalTexts >= 1) addBadge(BadgeType.FIRST_TEXT);
  if (totalTexts >= 5) addBadge(BadgeType.FIVE_TEXTS);
  if (totalTexts >= 10) addBadge(BadgeType.TEN_TEXTS);
  if (totalTexts >= 25) addBadge(BadgeType.TWENTY_FIVE_TEXTS);
  if (totalTexts >= 50) addBadge(BadgeType.FIFTY_TEXTS);

  // Perfect score badges
  const lastText = user.completedTexts[user.completedTexts.length - 1];
  if (lastText && lastText.score === lastText.totalQuestions) {
    addBadge(BadgeType.PERFECT_SCORE);
  }

  if (user.perfectScoreStreak >= 3) addBadge(BadgeType.THREE_PERFECT);
  if (user.perfectScoreStreak >= 5) addBadge(BadgeType.FIVE_PERFECT);

  // Alla årskurser
  if (user.gradesCompleted.length >= 9) {
    addBadge(BadgeType.ALL_GRADES);
  }

  return newBadges;
}

/**
 * Registrera ett avslutat resultat
 */
export function recordResult(
  user: User,
  textId: string,
  title: string,
  grade: number,
  score: number,
  totalQuestions: number
): { updatedUser: User; pointsEarned: number; newBadges: Badge[] } {
  const pointsEarned = calculatePoints(score, totalQuestions, grade);
  const isPerfect = score === totalQuestions;

  const completedText: CompletedText = {
    textId,
    grade,
    title,
    score,
    totalQuestions,
    pointsEarned,
    completedAt: new Date().toISOString(),
  };

  // Uppdatera användaren
  const updatedUser: User = {
    ...user,
    totalPoints: user.totalPoints + pointsEarned,
    completedTexts: [...user.completedTexts, completedText],
    perfectScoreStreak: isPerfect ? user.perfectScoreStreak + 1 : 0,
    gradesCompleted: user.gradesCompleted.includes(grade)
      ? user.gradesCompleted
      : [...user.gradesCompleted, grade].sort((a, b) => a - b),
    lastActivity: new Date().toISOString(),
  };

  // Kolla efter nya badges
  const newBadges = checkForNewBadges(updatedUser);
  updatedUser.badges = [...updatedUser.badges, ...newBadges];

  // Spara
  saveUser(updatedUser);

  return { updatedUser, pointsEarned, newBadges };
}

/**
 * Hämta lista på lästa text-IDs
 */
export function getCompletedTextIds(user: User): string[] {
  return user.completedTexts.map(t => t.textId);
}
