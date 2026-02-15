import { User, Badge, BadgeType, BADGE_DEFINITIONS, CompletedText, AVATAR_OPTIONS, QuestionResult } from '../types';

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
export function createUser(name: string, avatar?: string): User {
  const now = new Date().toISOString();
  return {
    name: name.trim(),
    avatar: avatar || AVATAR_OPTIONS[0], // Standardavatar om ingen väljs
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
 * Uppdatera användarens avatar
 */
export function updateAvatar(user: User, avatar: string): User {
  const updatedUser = {
    ...user,
    avatar,
    lastActivity: new Date().toISOString(),
  };
  saveUser(updatedUser);
  return updatedUser;
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
 * Hitta en befintlig användare baserat på namn
 */
export function findUserByName(name: string): User | null {
  try {
    const allUsers = getAllUsers();
    const normalizedName = name.trim().toLowerCase();
    return allUsers.find(u => u.name.toLowerCase() === normalizedName) || null;
  } catch (error) {
    console.error('Kunde inte söka efter användare:', error);
  }
  return null;
}

/**
 * Logga in - returnerar befintlig användare eller skapar ny
 */
export function loginUser(name: string, avatar?: string): User {
  // Kolla om användaren redan finns lokalt
  const existingUser = findUserByName(name);

  if (existingUser) {
    // Uppdatera senaste aktivitet och eventuellt avatar om den inte finns
    const updatedUser = {
      ...existingUser,
      avatar: existingUser.avatar || avatar || AVATAR_OPTIONS[0],
      lastActivity: new Date().toISOString(),
    };
    saveUser(updatedUser);
    return updatedUser;
  }

  // Skapa ny användare
  const newUser = createUser(name, avatar);
  saveUser(newUser);
  return newUser;
}

/**
 * Spara användare till localStorage
 */
export function saveUser(user: User): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    saveToAllUsers(user);
  } catch (error) {
    console.error('Kunde inte spara användare:', error);
  }
}

/**
 * Logga ut (radera lokal användare)
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
  if (totalTexts >= 15) addBadge(BadgeType.FIFTEEN_TEXTS);
  if (totalTexts >= 25) addBadge(BadgeType.TWENTY_FIVE_TEXTS);
  if (totalTexts >= 30) addBadge(BadgeType.THIRTY_TEXTS);
  if (totalTexts >= 50) addBadge(BadgeType.FIFTY_TEXTS);
  if (totalTexts >= 75) addBadge(BadgeType.SEVENTY_FIVE_TEXTS);
  if (totalTexts >= 100) addBadge(BadgeType.HUNDRED_TEXTS);

  // Perfect score badges
  const lastText = user.completedTexts[user.completedTexts.length - 1];
  if (lastText && lastText.score === lastText.totalQuestions) {
    addBadge(BadgeType.PERFECT_SCORE);
  }

  if (user.perfectScoreStreak >= 3) addBadge(BadgeType.THREE_PERFECT);
  if (user.perfectScoreStreak >= 5) addBadge(BadgeType.FIVE_PERFECT);
  if (user.perfectScoreStreak >= 10) addBadge(BadgeType.TEN_PERFECT);

  // Poäng-badges
  if (user.totalPoints >= 100) addBadge(BadgeType.HUNDRED_POINTS);
  if (user.totalPoints >= 500) addBadge(BadgeType.FIVE_HUNDRED_POINTS);
  if (user.totalPoints >= 1000) addBadge(BadgeType.THOUSAND_POINTS);

  // Årskurs-badges
  const grades = user.gradesCompleted;

  // Utforskare - minst 5 olika årskurser
  if (grades.length >= 5) addBadge(BadgeType.EXPLORER);

  // Alla årskurser (1-9 + gymnasiet = 10 st)
  if (grades.length >= 10) {
    addBadge(BadgeType.ALL_GRADES);
  }

  // Nybörjarläsare - klarat åk 1, 2 och 3
  if (grades.includes(1) && grades.includes(2) && grades.includes(3)) {
    addBadge(BadgeType.BEGINNER_GRADES);
  }

  // Mellanläsare - klarat åk 4, 5 och 6
  if (grades.includes(4) && grades.includes(5) && grades.includes(6)) {
    addBadge(BadgeType.MIDDLE_GRADES);
  }

  // Avancerad läsare - klarat åk 7, 8 och 9
  if (grades.includes(7) && grades.includes(8) && grades.includes(9)) {
    addBadge(BadgeType.ADVANCED_GRADES);
  }

  // Streak-badges (läst X dagar i rad)
  const readingStreak = calculateReadingStreak(user.completedTexts);
  if (readingStreak >= 3) addBadge(BadgeType.STREAK_3);
  if (readingStreak >= 7) addBadge(BadgeType.STREAK_7);

  // Genre-badges
  const storyCount = user.completedTexts.filter(t => t.genre === 'berättelse').length;
  const factCount = user.completedTexts.filter(t => t.genre === 'faktatext').length;

  if (storyCount >= 10) addBadge(BadgeType.STORY_LOVER);
  if (factCount >= 10) addBadge(BadgeType.FACT_LOVER);

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
  theme?: string,
  questionResults?: QuestionResult[],
  readingTimeSeconds?: number
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
    genre,
    questionResults,
    readingTimeSeconds,
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
 * Hämta alla användare från localStorage
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
 * Beräkna lässtreak (antal dagar i rad som användaren har läst)
 */
export function calculateReadingStreak(completedTexts: CompletedText[]): number {
  if (completedTexts.length === 0) return 0;

  // Extrahera unika datum (YYYY-MM-DD) från completedTexts
  const uniqueDates = new Set<string>();
  completedTexts.forEach(text => {
    const date = text.completedAt.split('T')[0];
    uniqueDates.add(date);
  });

  // Konvertera till sorterad array (nyaste först)
  const sortedDates = Array.from(uniqueDates).sort((a, b) => b.localeCompare(a));

  if (sortedDates.length === 0) return 0;

  const today = getTodayKey();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().split('T')[0];

  // Streaken måste inkludera idag eller igår för att vara aktiv
  const mostRecentDate = sortedDates[0];
  if (mostRecentDate !== today && mostRecentDate !== yesterdayKey) {
    return 0;
  }

  // Räkna konsekutiva dagar bakåt från mest aktuella datum
  let streak = 1;
  let currentDate = new Date(mostRecentDate);

  for (let i = 1; i < sortedDates.length; i++) {
    currentDate.setDate(currentDate.getDate() - 1);
    const expectedDate = currentDate.toISOString().split('T')[0];

    if (sortedDates.includes(expectedDate)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Spara daglig statistik lokalt
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
