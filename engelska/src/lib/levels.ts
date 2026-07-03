// ─── Nivåsystem ───────────────────────────────────────────────────────────────
// Nivå räknas från livstidspoäng (student.totalPoints) och påverkas alltså
// aldrig av köp i Affären. Rent kosmetiskt/motiverande.

export interface LevelInfo {
  level: number;
  title: string;
  /** Poängtröskeln där nuvarande nivå började. */
  floor: number;
  /** Poängtröskeln för nästa nivå, eller null på maxnivå. */
  next: number | null;
  /** Hur långt in i nivån man kommit, 0–100. */
  pct: number;
}

// [tröskel, titel] – trösklarna ökar mjukt så tidiga nivåer går snabbt.
const LEVELS: [number, string][] = [
  [0,     "Nybörjare"],
  [150,   "Ordsamlare"],
  [400,   "Glosjägare"],
  [800,   "Meningsbyggare"],
  [1400,  "Ordjägare"],
  [2200,  "Grammatikspanare"],
  [3200,  "Stavningsstjärna"],
  [4500,  "Språkutforskare"],
  [6000,  "Frasmästare"],
  [8000,  "Engelskahjälte"],
  [10500, "Ordvirtuos"],
  [13500, "Språkmästare"],
  [17000, "Grammatikguru"],
  [21000, "Jaktledare"],
  [26000, "Engelskalegend"],
  [32000, "Ordmagiker"],
  [39000, "Språktrollkarl"],
  [47000, "Mästerjägare"],
  [56000, "Superlegend"],
  [66000, "Universums Ordmästare"],
];

export const MAX_LEVEL = LEVELS.length;

export function getLevel(points: number): LevelInfo {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (points >= LEVELS[i][0]) idx = i;
    else break;
  }
  const floor = LEVELS[idx][0];
  const next = idx + 1 < LEVELS.length ? LEVELS[idx + 1][0] : null;
  const pct = next === null ? 100 : Math.min(100, ((points - floor) / (next - floor)) * 100);
  return { level: idx + 1, title: LEVELS[idx][1], floor, next, pct };
}
