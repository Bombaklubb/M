// Enkel namnbaserad inloggning – varje namn får egen sparad progress i localStorage.

const CURRENT_USER_KEY = 'kallkritik_current_user';
const USERS_KEY = 'kallkritik_users';
const LEGACY_STATE_KEY = 'kallkritik_game_state';

export function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

export function storageKeyFor(name: string): string {
  return `kallkritik_game_state_u_${normalizeName(name)}`;
}

export function loadCurrentUser(): string | null {
  try {
    return localStorage.getItem(CURRENT_USER_KEY);
  } catch {
    return null;
  }
}

export function listUsers(): string[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(u => typeof u === 'string') : [];
  } catch {
    return [];
  }
}

export function login(rawName: string): string {
  const name = rawName.trim();
  try {
    const users = listUsers();

    // Migrering: progress från tiden före inloggning följer med
    // det FÖRSTA namnet som loggar in på enheten.
    if (users.length === 0) {
      const legacy = localStorage.getItem(LEGACY_STATE_KEY);
      if (legacy) {
        localStorage.setItem(storageKeyFor(name), legacy);
        localStorage.removeItem(LEGACY_STATE_KEY);
      }
    }

    if (!users.some(u => normalizeName(u) === normalizeName(name))) {
      localStorage.setItem(USERS_KEY, JSON.stringify([...users, name]));
    }
    localStorage.setItem(CURRENT_USER_KEY, name);
  } catch {
    // localStorage blockerad – inloggningen gäller ändå för sessionen
  }
  return name;
}

export function logout(): void {
  try {
    localStorage.removeItem(CURRENT_USER_KEY);
  } catch {
    // ignorera
  }
}
