// Säker localStorage. På skoldatorer där webbläsardata är blockerat kastar
// varje åtkomst SecurityError – utan skydd kraschar hela appen till vit sida.
// Övningarna ska fungera ändå, bara utan att spara.

export function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // lagring avstängd eller full – hoppa över
  }
}

export function safeRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // se ovan
  }
}

// Läser och tolkar JSON. Returnerar fallback vid saknad eller trasig data.
export function safeGetJson<T>(key: string, fallback: T): T {
  try {
    const raw = safeGet(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as T) : fallback;
  } catch {
    return fallback;
  }
}
