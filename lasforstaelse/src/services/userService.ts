import { User, Badge, BadgeType, BADGE_DEFINITIONS, CompletedText } from '../types';

const STORAGE_KEY = 'lasforstaelse_user';
const ALL_USERS_KEY = 'lasforstaelse_all_users';
const DAILY_STATS_KEY = 'lasforstaelse_daily_stats';

interface DailyStats {
  date: string;
  textsRead: number;
  genres: Record<string, number>;
  themes: Record<string, number>;
  grades: Record<number, number>;
}

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
    // Spara även till alla användare för lärarstatistik
    saveToAllUsers(user);
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
  totalQuestions: number,
  genre?: string,
  theme?: string
): { updatedUser: User; pointsEarned: number; newBadges: Badge[] } {
  // Spara daglig statistik
  if (genre && theme) {
    recordDailyStats(genre, theme, grade);
  }
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

/**
 * Spara användare till "alla användare" listan (för lärarstatistik)
 */
export function saveToAllUsers(user: User): void {
  try {
    const allUsers = getAllUsers();
    const existingIndex = allUsers.findIndex(u => u.name.toLowerCase() === user.name.toLowerCase());

    if (existingIndex >= 0) {
      allUsers[existingIndex] = user;
    } else {
      allUsers.push(user);
    }

    localStorage.setItem(ALL_USERS_KEY, JSON.stringify(allUsers));
  } catch (error) {
    console.error('Kunde inte spara till alla användare:', error);
  }
}

/**
 * Hämta alla användare (för lärarstatistik)
 */
export function getAllUsers(): User[] {
  try {
    const stored = localStorage.getItem(ALL_USERS_KEY);
    if (stored) {
      return JSON.parse(stored) as User[];
    }
  } catch (error) {
    console.error('Kunde inte ladda alla användare:', error);
  }
  return [];
}

/**
 * Hämta dagens datum som YYYY-MM-DD
 */
function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Spara daglig statistik
 */
export function recordDailyStats(genre: string, theme: string, grade: number): void {
  try {
    const today = getTodayKey();
    const statsKey = `${DAILY_STATS_KEY}_${today}`;

    let stats: DailyStats = {
      date: today,
      textsRead: 0,
      genres: {},
      themes: {},
      grades: {},
    };

    const stored = localStorage.getItem(statsKey);
    if (stored) {
      stats = JSON.parse(stored);
    }

    stats.textsRead++;
    stats.genres[genre] = (stats.genres[genre] || 0) + 1;
    stats.themes[theme] = (stats.themes[theme] || 0) + 1;
    stats.grades[grade] = (stats.grades[grade] || 0) + 1;

    localStorage.setItem(statsKey, JSON.stringify(stats));
  } catch (error) {
    console.error('Kunde inte spara daglig statistik:', error);
  }
}

/**
 * Hämta daglig statistik för en specifik dag
 */
export function getDailyStats(date: string): DailyStats | null {
  try {
    const statsKey = `${DAILY_STATS_KEY}_${date}`;
    const stored = localStorage.getItem(statsKey);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Kunde inte ladda daglig statistik:', error);
  }
  return null;
}

/**
 * Hämta aggregerad statistik för lärarvyn
 */
export function getTeacherStats(): {
  todayTexts: number;
  totalTexts: number;
  topGenres: Array<{ name: string; count: number }>;
  topThemes: Array<{ name: string; count: number }>;
  topGrades: Array<{ grade: number; count: number }>;
  leaderboard: Array<{ name: string; points: number; textsRead: number }>;
  last7Days: Array<{ date: string; count: number }>;
} {
  const allUsers = getAllUsers();

  // Beräkna totalt antal texter och aggregerad statistik
  let totalTexts = 0;
  const genresMap = new Map<string, number>();
  const themesMap = new Map<string, number>();
  const gradesMap = new Map<number, number>();

  // Gå igenom alla användare och deras completed texts
  allUsers.forEach(user => {
    user.completedTexts.forEach(text => {
      totalTexts++;

      // Extrahera genre/theme från textId om möjligt (format: "ak1-001")
      const grade = text.grade;
      gradesMap.set(grade, (gradesMap.get(grade) || 0) + 1);
    });
  });

  // Hämta dagens statistik
  const today = getTodayKey();
  const todayStats = getDailyStats(today);
  const todayTexts = todayStats?.textsRead || 0;

  // Aggregera senaste 7 dagarna
  const last7Days: Array<{ date: string; count: number }> = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    const stats = getDailyStats(dateKey);
    last7Days.push({
      date: dateKey,
      count: stats?.textsRead || 0,
    });

    // Aggregera genres och themes från daglig statistik
    if (stats) {
      Object.entries(stats.genres).forEach(([genre, count]) => {
        genresMap.set(genre, (genresMap.get(genre) || 0) + count);
      });
      Object.entries(stats.themes).forEach(([theme, count]) => {
        themesMap.set(theme, (themesMap.get(theme) || 0) + count);
      });
    }
  }

  // Sortera och begränsa topp-listor
  const topGenres = Array.from(genresMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  const topThemes = Array.from(themesMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  const topGrades = Array.from(gradesMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 9)
    .map(([grade, count]) => ({ grade, count }));

  // Skapa leaderboard
  const leaderboard = allUsers
    .map(user => ({
      name: user.name,
      points: user.totalPoints,
      textsRead: user.completedTexts.length,
    }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);

  return {
    todayTexts,
    totalTexts,
    topGenres,
    topThemes,
    topGrades,
    leaderboard,
    last7Days,
  };
}
