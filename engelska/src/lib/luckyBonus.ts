// ─── Turbonus ─────────────────────────────────────────────────────────────────
// Slumpmässig, sällsynt poängbonus (×2 eller ×3) som ibland dyker upp när en
// övning/uppgift avslutas. Helt slumpstyrd (ingen mönsterkoppling till tid,
// övningstyp eller resultat) så att elever inte kan lista ut hur den triggas.
// Max ett par gånger per dag så att den förblir speciell.

export interface LuckyBonus {
  multiplier: 2 | 3;
  /** Extrapoängen utöver de ordinarie (basePoints × (multiplier − 1)). */
  extra: number;
}

const MAX_PER_DAY = 2;
const P_X3 = 0.03; // ~3 %
const P_X2 = 0.08; // ~8 %

interface LuckyData { date: string; count: number; }

function key(studentName: string) {
  return `engelskajakten_lucky_${studentName.toLowerCase().trim()}`;
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Slå tärningen för en turbonus på nyss intjänade poäng.
 * Returnerar bonusen (och räknar upp dagens räknare), eller null –
 * vilket är det vanliga utfallet.
 */
export function rollLuckyBonus(studentName: string, basePoints: number): LuckyBonus | null {
  if (typeof window === "undefined" || basePoints <= 0 || !studentName) return null;

  const k = key(studentName);
  const today = todayStr();
  let data: LuckyData;
  try {
    const raw = localStorage.getItem(k);
    data = raw ? (JSON.parse(raw) as LuckyData) : { date: today, count: 0 };
    if (data.date !== today) data = { date: today, count: 0 };
  } catch {
    data = { date: today, count: 0 };
  }

  if (data.count >= MAX_PER_DAY) return null;

  const r = Math.random();
  const multiplier: 2 | 3 | null = r < P_X3 ? 3 : r < P_X3 + P_X2 ? 2 : null;
  if (!multiplier) return null;

  localStorage.setItem(k, JSON.stringify({ date: today, count: data.count + 1 }));
  return { multiplier, extra: basePoints * (multiplier - 1) };
}
