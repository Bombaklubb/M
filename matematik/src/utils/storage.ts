import {
  Student, TopicProgress, PointsRecord, EarnedAchievement,
  LEVEL_THRESHOLDS, Grade,
} from '../types';

const KEYS = {
  students: 'math_students',
  currentStudent: 'math_current_student',
  progress: (studentId: string) => `math_progress_${studentId}`,
  points: (studentId: string) => `math_points_${studentId}`,
  achievements: (studentId: string) => `math_achievements_${studentId}`,
  sessions: 'math_sessions',
  teacherPin: 'math_teacher_pin',
};

// ======================== STUDENTS ========================

export function getAllStudents(): Student[] {
  try {
    return JSON.parse(localStorage.getItem(KEYS.students) || '[]');
  } catch {
    return [];
  }
}

export function saveStudent(student: Student): void {
  const students = getAllStudents();
  const idx = students.findIndex(s => s.id === student.id);
  if (idx >= 0) {
    students[idx] = student;
  } else {
    students.push(student);
  }
  localStorage.setItem(KEYS.students, JSON.stringify(students));
}

export function findOrCreateStudent(name: string, grade: Grade, avatar: number): Student {
  const students = getAllStudents();
  // Find by name only (case insensitive).
  // Do NOT filter on grade — grade can be changed via teacher view and must not
  // cause a new account to be created on the next login.
  const existing = students.find(
    s => s.name.toLowerCase() === name.toLowerCase()
  );
  if (existing) {
    // Always apply the avatar selected at login
    if (existing.avatar !== avatar) {
      existing.avatar = avatar;
      saveStudent(existing);
    }
    return existing;
  }

  const newStudent: Student = {
    id: `student_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: name.trim(),
    grade,
    createdAt: new Date().toISOString(),
    avatar,
  };
  saveStudent(newStudent);
  initPoints(newStudent.id);
  return newStudent;
}

export function getCurrentStudent(): Student | null {
  try {
    const data = localStorage.getItem(KEYS.currentStudent);
    if (!data) return null;
    const parsed = JSON.parse(data);
    // Validate required fields – stale/corrupt data should not crash the app
    if (parsed && typeof parsed.id === 'string' && typeof parsed.name === 'string' && parsed.grade) {
      return parsed as Student;
    }
    // Invalid shape → remove corrupt entry
    localStorage.removeItem(KEYS.currentStudent);
    return null;
  } catch {
    localStorage.removeItem(KEYS.currentStudent);
    return null;
  }
}

export function setCurrentStudent(student: Student | null): void {
  if (student) {
    localStorage.setItem(KEYS.currentStudent, JSON.stringify(student));
    trackSession(student.id);
  } else {
    localStorage.removeItem(KEYS.currentStudent);
  }
}

// ======================== PROGRESS ========================

export function getProgress(studentId: string): TopicProgress[] {
  try {
    return JSON.parse(localStorage.getItem(KEYS.progress(studentId)) || '[]');
  } catch {
    return [];
  }
}

export function getTopicProgress(studentId: string, topicId: string): TopicProgress | null {
  return getProgress(studentId).find(p => p.topicId === topicId) ?? null;
}

export function saveTopicProgress(studentId: string, progress: TopicProgress): void {
  const all = getProgress(studentId);
  const idx = all.findIndex(p => p.topicId === progress.topicId);
  if (idx >= 0) {
    // Only keep best score
    all[idx] = {
      ...progress,
      bestScore: Math.max(all[idx].bestScore, progress.bestScore),
      stars: Math.max(all[idx].stars, progress.stars),
      totalAttempts: all[idx].totalAttempts + 1,
    };
  } else {
    all.push({ ...progress, totalAttempts: 1 });
  }
  localStorage.setItem(KEYS.progress(studentId), JSON.stringify(all));
}

export function calcStars(score: number): number {
  if (score >= 90) return 3;
  if (score >= 70) return 2;
  if (score >= 50) return 1;
  return 0;
}

// ======================== POINTS ========================

export function initPoints(studentId: string): PointsRecord {
  const existing = getPoints(studentId);
  if (existing) return existing;
  const record: PointsRecord = {
    studentId,
    total: 0,
    level: 0,
    streak: 0,
    lastActiveDate: '',
    weeklyPoints: 0,
    weekStart: getWeekStart(),
  };
  savePoints(record);
  return record;
}

export function getPoints(studentId: string): PointsRecord | null {
  try {
    const data = localStorage.getItem(KEYS.points(studentId));
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function addPoints(studentId: string, amount: number): PointsRecord {
  const record = getPoints(studentId) ?? initPoints(studentId);
  const today = new Date().toISOString().split('T')[0];
  const weekStart = getWeekStart();

  // Streak logic
  let streak = record.streak;
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (record.lastActiveDate === today) {
    // same day, no change to streak
  } else if (record.lastActiveDate === yesterday) {
    streak += 1;
  } else if (record.lastActiveDate === '') {
    streak = 1;
  } else {
    streak = 1; // reset
  }

  // Weekly reset
  let weeklyPoints = record.weeklyPoints;
  if (record.weekStart !== weekStart) {
    weeklyPoints = 0;
  }
  weeklyPoints += amount;

  // Streak bonus
  const bonusMultiplier = streak >= 7 ? 1.5 : streak >= 3 ? 1.2 : 1;
  const actualAmount = Math.round(amount * bonusMultiplier);

  const newTotal = record.total + actualAmount;
  const newLevel = calcLevel(newTotal);

  const updated: PointsRecord = {
    ...record,
    total: newTotal,
    level: newLevel,
    streak,
    lastActiveDate: today,
    weeklyPoints,
    weekStart,
  };
  savePoints(updated);
  return updated;
}

function savePoints(record: PointsRecord): void {
  localStorage.setItem(KEYS.points(record.studentId), JSON.stringify(record));
}

function calcLevel(totalPoints: number): number {
  let level = 0;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalPoints >= LEVEL_THRESHOLDS[i]) level = i;
    else break;
  }
  return level;
}

export function getNextLevelPoints(level: number): number {
  return LEVEL_THRESHOLDS[level + 1] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
}

// ======================== ACHIEVEMENTS ========================

export function getAchievements(studentId: string): EarnedAchievement[] {
  try {
    return JSON.parse(localStorage.getItem(KEYS.achievements(studentId)) || '[]');
  } catch {
    return [];
  }
}

export function grantAchievement(studentId: string, achievementId: string): void {
  const all = getAchievements(studentId);
  if (all.some(a => a.achievementId === achievementId)) return;
  all.push({ achievementId, earnedAt: new Date().toISOString() });
  localStorage.setItem(KEYS.achievements(studentId), JSON.stringify(all));
}

// ======================== SESSIONS (for teacher stats) ========================

interface SessionEntry {
  studentId: string;
  date: string;
  topicId: string;
  correctAnswers: number;
  totalAnswers: number;
}

export function trackSession(studentId: string): void {
  // Just update last active
}

export function recordTopicSession(
  studentId: string,
  topicId: string,
  correct: number,
  total: number
): void {
  try {
    const sessions: SessionEntry[] = JSON.parse(
      localStorage.getItem(KEYS.sessions) || '[]'
    );
    sessions.push({
      studentId,
      date: new Date().toISOString().split('T')[0],
      topicId,
      correctAnswers: correct,
      totalAnswers: total,
    });
    // Keep only last 1000 sessions to avoid localStorage overflow
    if (sessions.length > 1000) sessions.splice(0, sessions.length - 1000);
    localStorage.setItem(KEYS.sessions, JSON.stringify(sessions));
  } catch {
    // Ignore storage errors
  }
}

export function getSessions(): SessionEntry[] {
  try {
    return JSON.parse(localStorage.getItem(KEYS.sessions) || '[]');
  } catch {
    return [];
  }
}

// ======================== TEACHER ========================

const TEACHER_PASSWORD = 'Korsängen';

export function verifyTeacherPin(pin: string): boolean {
  return pin === TEACHER_PASSWORD;
}

// ======================== DATA EXPORT / IMPORT ========================

/** Collects every localStorage key belonging to this app and returns it as a plain object. */
export function exportAllData(): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    if (key.startsWith('math_') || key.startsWith('mattejakten_')) {
      try {
        data[key] = JSON.parse(localStorage.getItem(key) ?? 'null');
      } catch {
        data[key] = localStorage.getItem(key);
      }
    }
  }
  return data;
}

/** Writes a previously exported data object back into localStorage, then reloads. */
export function importAllData(data: Record<string, unknown>): void {
  for (const [key, value] of Object.entries(data)) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  window.location.reload();
}

// ======================== APP TIME ========================

export function getAppMinutes(studentId: string): number {
  try {
    const data = localStorage.getItem(`math_time_${studentId}`);
    return data ? (JSON.parse(data).totalMinutes ?? 0) : 0;
  } catch { return 0; }
}

export function addAppMinutes(studentId: string, minutes: number): void {
  if (minutes <= 0) return;
  const current = getAppMinutes(studentId);
  localStorage.setItem(`math_time_${studentId}`, JSON.stringify({ totalMinutes: current + minutes }));
}

// ======================== HELPERS ========================

function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay(); // 0 = Sunday
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split('T')[0];
}
