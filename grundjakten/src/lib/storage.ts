import type { Progress, StudentProfile, Theme } from '@/types';
import { DEFAULT_SETTINGS, emptyProgress } from '@/types';

/**
 * All localStorage-åtkomst går genom den här filen.
 *
 * Mönstret är hämtat från matematik/src/utils/storage.ts: en central KEYS-map,
 * och varje läsning i try/catch med formvalidering som tar bort trasiga poster
 * i stället för att låta appen krascha. Det är extra viktigt här – eleverna
 * kan inte läsa ett felmeddelande, så en vit skärm är en återvändsgränd.
 */

const SCHEMA_VERSION = 1;

function norm(name: string): string {
  return name.trim().toLowerCase();
}

export const KEYS = {
  schemaVersion: 'grundjakten_schema_version',
  users: 'grundjakten_users',
  currentUser: 'grundjakten_current_user',
  profile: (n: string) => `grundjakten_profile_u_${norm(n)}`,
  progress: (n: string) => `grundjakten_progress_u_${norm(n)}`,
  // Medvetet enhetsglobalt, inte per elev: det är KLASSENS aktuella tema.
  activeTheme: 'grundjakten_active_theme',
  customThemes: 'grundjakten_custom_themes',
  teacherPin: 'grundjakten_teacher_pin',
  lastReward: 'grundjakten_last_reward',
} as const;

export const DEFAULT_PIN = '1234';

function readJson<T>(key: string, validate: (v: unknown) => v is T): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (validate(parsed)) return parsed;
    localStorage.removeItem(key);
    return null;
  } catch {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignoreras */
    }
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Kvoten full eller privat läge – appen ska fungera ändå, bara utan sparning. */
  }
}

/**
 * Körs vid uppstart.
 *
 * Är versionen HÖGRE än vi känner till har eleven varit inne på en nyare
 * deploy och sedan hamnat på en äldre. Då rensar vi hellre än kraschar på
 * okända former.
 */
export function initSchema(): void {
  try {
    const raw = localStorage.getItem(KEYS.schemaVersion);
    const stored = raw ? Number(raw) : 0;
    if (stored > SCHEMA_VERSION) {
      clearAllGrundjaktenData();
    }
    localStorage.setItem(KEYS.schemaVersion, String(SCHEMA_VERSION));
  } catch {
    /* ignoreras */
  }
}

export function clearAllGrundjaktenData(): void {
  try {
    const doomed: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('grundjakten_')) doomed.push(k);
    }
    doomed.forEach((k) => localStorage.removeItem(k));
  } catch {
    /* ignoreras */
  }
}

// ---------- Elever ----------

const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((x) => typeof x === 'string');

export function getUsers(): string[] {
  return readJson(KEYS.users, isStringArray) ?? [];
}

export function addUser(name: string): void {
  const users = getUsers();
  if (!users.some((u) => norm(u) === norm(name))) {
    writeJson(KEYS.users, [...users, name.trim()]);
  }
}

export function removeUser(name: string): void {
  writeJson(KEYS.users, getUsers().filter((u) => norm(u) !== norm(name)));
  try {
    localStorage.removeItem(KEYS.profile(name));
    localStorage.removeItem(KEYS.progress(name));
  } catch {
    /* ignoreras */
  }
}

export function getCurrentUser(): string | null {
  try {
    const name = localStorage.getItem(KEYS.currentUser);
    if (!name) return null;
    // En elev som tagits bort i lärarläget ska inte kunna vara inloggad.
    return getUsers().some((u) => norm(u) === norm(name)) ? name : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(name: string | null): void {
  try {
    if (name === null) localStorage.removeItem(KEYS.currentUser);
    else localStorage.setItem(KEYS.currentUser, name);
  } catch {
    /* ignoreras */
  }
}

// ---------- Profil ----------

function isProfile(v: unknown): v is StudentProfile {
  if (typeof v !== 'object' || v === null) return false;
  const p = v as Record<string, unknown>;
  return typeof p.name === 'string' && typeof p.avatar === 'string' && typeof p.level === 'number';
}

export function getProfile(name: string): StudentProfile | null {
  const p = readJson(KEYS.profile(name), isProfile);
  if (!p) return null;
  // Fyll på fält som saknas i äldre sparningar.
  return { ...p, settings: { ...DEFAULT_SETTINGS, ...(p.settings ?? {}) } };
}

export function saveProfile(profile: StudentProfile): void {
  writeJson(KEYS.profile(profile.name), profile);
  addUser(profile.name);
}

export function createProfile(name: string, avatar: string): StudentProfile {
  const profile: StudentProfile = {
    name: name.trim(),
    avatar,
    createdAt: new Date().toISOString(),
    level: 1,
    progressionStep: 1,
    stepLockedByTeacher: false,
    settings: { ...DEFAULT_SETTINGS },
  };
  saveProfile(profile);
  saveProgress(profile.name, emptyProgress());
  return profile;
}

// ---------- Progress ----------

function isProgress(v: unknown): v is Progress {
  if (typeof v !== 'object' || v === null) return false;
  const p = v as Record<string, unknown>;
  return typeof p.xp === 'number' && typeof p.letters === 'object' && p.letters !== null;
}

export function getProgress(name: string): Progress {
  const p = readJson(KEYS.progress(name), isProgress);
  if (!p) return emptyProgress();
  return { ...emptyProgress(), ...p };
}

export function saveProgress(name: string, progress: Progress): void {
  // Passloggen kapas så att localStorage inte växer obegränsat.
  const trimmed: Progress = { ...progress, sessions: progress.sessions.slice(-200) };
  writeJson(KEYS.progress(name), trimmed);
}

// ---------- Teman ----------

function isThemeArray(v: unknown): v is Theme[] {
  return Array.isArray(v) && v.every((t) => typeof t === 'object' && t !== null && 'id' in t && 'words' in t);
}

export function getCustomThemes(): Theme[] {
  return readJson(KEYS.customThemes, isThemeArray) ?? [];
}

export function saveCustomTheme(theme: Theme): void {
  const themes = getCustomThemes();
  const idx = themes.findIndex((t) => t.id === theme.id);
  if (idx >= 0) themes[idx] = theme;
  else themes.push(theme);
  writeJson(KEYS.customThemes, themes);
}

export function deleteCustomTheme(id: string): void {
  writeJson(KEYS.customThemes, getCustomThemes().filter((t) => t.id !== id));
  if (getActiveThemeId() === id) setActiveThemeId(null);
}

export function getActiveThemeId(): string | null {
  try {
    return localStorage.getItem(KEYS.activeTheme);
  } catch {
    return null;
  }
}

export function setActiveThemeId(id: string | null): void {
  try {
    if (id === null) localStorage.removeItem(KEYS.activeTheme);
    else localStorage.setItem(KEYS.activeTheme, id);
  } catch {
    /* ignoreras */
  }
}

// ---------- Lärarens PIN ----------

export function getTeacherPin(): string {
  try {
    return localStorage.getItem(KEYS.teacherPin) || DEFAULT_PIN;
  } catch {
    return DEFAULT_PIN;
  }
}

export function setTeacherPin(pin: string): void {
  try {
    localStorage.setItem(KEYS.teacherPin, pin);
  } catch {
    /* ignoreras */
  }
}

// ---------- Backup ----------

/**
 * Enda sättet att flytta en elevs framsteg mellan enheter utan backend.
 * Läraren behöver veta att den finns – den står i README.
 */
export function exportAllData(): string {
  const dump: Record<string, string> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('grundjakten_')) dump[k] = localStorage.getItem(k) ?? '';
    }
  } catch {
    /* ignoreras */
  }
  return JSON.stringify(dump, null, 2);
}

export function importAllData(json: string): boolean {
  try {
    const parsed: unknown = JSON.parse(json);
    if (typeof parsed !== 'object' || parsed === null) return false;
    Object.entries(parsed as Record<string, unknown>).forEach(([k, v]) => {
      if (k.startsWith('grundjakten_') && typeof v === 'string') localStorage.setItem(k, v);
    });
    return true;
  } catch {
    return false;
  }
}
