import { User, Badge, BadgeType, BADGE_DEFINITIONS, CompletedText } from '../types';
import { getSupabase, isSupabaseConfigured, generateSyncCode } from './supabase';

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
 * Generera ett unikt ID baserat på namn
 */
function getUserId(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, '_');
}

/**
 * Ladda användare från Supabase med synkkod
 */
export async function loadUserBySyncCode(syncCode: string): Promise<User | null> {
  const supabase = getSupabase();
  if (!supabase) {
    console.log('Supabase är inte konfigurerat');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('user_data')
      .eq('sync_code', syncCode.toUpperCase())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Ingen användare hittades
        return null;
      }
      throw error;
    }

    if (data?.user_data) {
      const user = data.user_data as User;
      // Spara lokalt som cache
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return user;
    }
  } catch (error) {
    console.error('Kunde inte ladda användare från Supabase:', error);
  }

  return null;
}

/**
 * Ladda användare från localStorage (synkron)
 */
export async function loadUserAsync(name?: string): Promise<User | null> {
  // Försök ladda från localStorage först
  return loadUser();
}

/**
 * Ladda användare från localStorage (synkron, för bakåtkompatibilitet)
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
 * Spara användare till Supabase och localStorage
 */
export async function saveUserAsync(user: User): Promise<void> {
  // Spara alltid lokalt först
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    saveToAllUsers(user);
  } catch (error) {
    console.error('Kunde inte spara användare lokalt:', error);
  }

  // Spara till Supabase om konfigurerat och användaren har en synkkod
  if (isSupabaseConfigured() && user.syncCode) {
    await syncUserToSupabase(user);
  }
}

/**
 * Synka användare till Supabase
 */
async function syncUserToSupabase(user: User): Promise<void> {
  const supabase = getSupabase();
  if (!supabase || !user.syncCode) return;

  try {
    const { error } = await supabase
      .from('users')
      .upsert({
        sync_code: user.syncCode,
        name: user.name,
        user_data: user,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'sync_code'
      });

    if (error) throw error;
  } catch (error) {
    console.error('Kunde inte synka användare till Supabase:', error);
  }
}

/**
 * Aktivera synkning för en användare (generera synkkod)
 */
export async function enableSync(user: User): Promise<{ user: User; syncCode: string } | null> {
  const supabase = getSupabase();
  if (!supabase) {
    console.log('Supabase är inte konfigurerat');
    return null;
  }

  // Generera en unik synkkod
  let syncCode = generateSyncCode();
  let attempts = 0;
  const maxAttempts = 10;

  // Försök hitta en unik kod
  while (attempts < maxAttempts) {
    const { data } = await supabase
      .from('users')
      .select('sync_code')
      .eq('sync_code', syncCode)
      .single();

    if (!data) break; // Koden är unik
    syncCode = generateSyncCode();
    attempts++;
  }

  // Uppdatera användaren med synkkoden
  const updatedUser: User = {
    ...user,
    syncCode
  };

  // Spara till Supabase
  try {
    const { error } = await supabase
      .from('users')
      .insert({
        sync_code: syncCode,
        name: user.name,
        user_data: updatedUser,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) throw error;

    // Spara lokalt
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    saveToAllUsers(updatedUser);

    return { user: updatedUser, syncCode };
  } catch (error) {
    console.error('Kunde inte aktivera synkning:', error);
    return null;
  }
}

/**
 * Hämta och slå samman data från Supabase
 */
export async function syncFromCloud(localUser: User): Promise<User | null> {
  if (!localUser.syncCode) return null;

  const cloudUser = await loadUserBySyncCode(localUser.syncCode);
  if (!cloudUser) return null;

  // Slå samman data - behåll den mest kompletta
  const mergedUser = mergeUserData(localUser, cloudUser);

  // Spara den sammanslagna datan
  saveUser(mergedUser);
  await syncUserToSupabase(mergedUser);

  return mergedUser;
}

/**
 * Slå samman två användarprofiler
 */
function mergeUserData(local: User, cloud: User): User {
  // Slå samman completedTexts (behåll alla unika)
  const allTexts = [...local.completedTexts];
  for (const cloudText of cloud.completedTexts) {
    const exists = allTexts.some(t =>
      t.textId === cloudText.textId && t.completedAt === cloudText.completedAt
    );
    if (!exists) {
      allTexts.push(cloudText);
    }
  }

  // Sortera efter datum
  allTexts.sort((a, b) =>
    new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
  );

  // Slå samman badges (behåll alla unika)
  const allBadges = [...local.badges];
  for (const cloudBadge of cloud.badges) {
    const exists = allBadges.some(b => b.type === cloudBadge.type);
    if (!exists) {
      allBadges.push(cloudBadge);
    }
  }

  // Slå samman gradesCompleted
  const allGrades = [...new Set([...local.gradesCompleted, ...cloud.gradesCompleted])].sort((a, b) => a - b);

  // Beräkna total poäng från alla texter
  const totalPoints = allTexts.reduce((sum, t) => sum + t.pointsEarned, 0);

  return {
    ...local,
    syncCode: local.syncCode || cloud.syncCode,
    totalPoints,
    badges: allBadges,
    completedTexts: allTexts,
    gradesCompleted: allGrades,
    lastActivity: new Date(Math.max(
      new Date(local.lastActivity).getTime(),
      new Date(cloud.lastActivity).getTime()
    )).toISOString()
  };
}

/**
 * Spara användare (synkron wrapper för bakåtkompatibilitet)
 */
export function saveUser(user: User): void {
  // Spara lokalt synkront
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    saveToAllUsers(user);
  } catch (error) {
    console.error('Kunde inte spara användare:', error);
  }

  // Spara till Supabase asynkront om användaren har synkkod
  if (isSupabaseConfigured() && user.syncCode) {
    saveUserAsync(user).catch(err => {
      console.error('Async save to Supabase failed:', err);
    });
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
 * Spara användare till "alla användare" listan (för lärarstatistik - endast localStorage)
 */
export function saveToAllUsers(user: User): void {
  try {
    const allUsers = getAllUsersLocal();
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
 * Hämta alla användare från localStorage (för bakåtkompatibilitet)
 */
function getAllUsersLocal(): User[] {
  try {
    const stored = localStorage.getItem(ALL_USERS_KEY);
    if (stored) {
      return JSON.parse(stored) as User[];
    }
  } catch (error) {
    console.error('Kunde inte ladda alla användare lokalt:', error);
  }
  return [];
}

/**
 * Hämta alla användare (asynkron)
 */
export async function getAllUsersAsync(): Promise<User[]> {
  return getAllUsersLocal();
}

/**
 * Hämta alla användare (synkron, för bakåtkompatibilitet)
 */
export function getAllUsers(): User[] {
  return getAllUsersLocal();
}

/**
 * Hämta dagens datum som YYYY-MM-DD
 */
function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Spara daglig statistik till localStorage (asynkron wrapper)
 */
export async function recordDailyStatsAsync(genre: string, theme: string, grade: number): Promise<void> {
  recordDailyStats(genre, theme, grade);
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
 * Hämta daglig statistik för en specifik dag (asynkron wrapper)
 */
export async function getDailyStatsAsync(date: string): Promise<DailyStats | null> {
  return getDailyStats(date);
}

/**
 * Hämta daglig statistik för en specifik dag (synkron)
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
 * Hämta aggregerad statistik för lärarvyn (asynkron version)
 */
export async function getTeacherStatsAsync(): Promise<{
  todayTexts: number;
  totalTexts: number;
  topGenres: Array<{ name: string; count: number }>;
  topThemes: Array<{ name: string; count: number }>;
  topGrades: Array<{ grade: number; count: number }>;
  leaderboard: Array<{ name: string; points: number; textsRead: number }>;
  last7Days: Array<{ date: string; count: number }>;
}> {
  const allUsers = await getAllUsersAsync();

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
  const todayStats = await getDailyStatsAsync(today);
  const todayTexts = todayStats?.textsRead || 0;

  // Aggregera senaste 7 dagarna
  const last7Days: Array<{ date: string; count: number }> = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    const stats = await getDailyStatsAsync(dateKey);
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

/**
 * Hämta aggregerad statistik för lärarvyn (synkron version för bakåtkompatibilitet)
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
