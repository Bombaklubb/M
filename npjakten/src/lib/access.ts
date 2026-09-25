import { safeGet, safeSet } from "./storage";

// Lösenord för att komma in i NP-jakten. Precis som facitlåset sker
// kontrollen i webbläsaren: det håller obehöriga borta från appen, men den som
// verkligen vill kan läsa innehållet i källkoden.

const PASSWORD = "jakten";
const KEY = "npjakten-inloggad";

// Inloggningen sparas på enheten, så att klassens datorer inte behöver
// låsas upp igen varje lektion.
export function isAppUnlocked(): boolean {
  return safeGet(KEY) === "1";
}

// Returnerar true om lösenordet stämde, och kommer då ihåg det.
export function unlockApp(input: string): boolean {
  if (input.trim().toLowerCase() !== PASSWORD) return false;
  safeSet(KEY, "1");
  return true;
}
