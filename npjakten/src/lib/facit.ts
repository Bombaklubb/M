// Facit bakom lösenord. Syftet är att en elev inte ska kunna råka öppna
// facit mitt i ett prov – inte att skydda hemligheter. Kontrollen sker i
// webbläsaren, så den som verkligen vill kan komma runt den.

const PASSWORD = "facit";
const KEY = "npjakten-facit-upplast";

// Låset gäller för den här fliken/sessionen, så en delad skoldator inte
// står olåst för nästa elev.
function session(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function isFacitUnlocked(): boolean {
  try {
    if (new URLSearchParams(window.location.search).has("larare")) return true;
  } catch {
    // ignorera – faller tillbaka på sessionen nedan
  }
  try {
    return session()?.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

// Returnerar true om lösenordet stämde, och kommer då ihåg det.
export function unlockFacit(input: string): boolean {
  if (input.trim().toLowerCase() !== PASSWORD) return false;
  try {
    session()?.setItem(KEY, "1");
  } catch {
    // lagring avstängd – facit visas ändå den här gången
  }
  return true;
}
