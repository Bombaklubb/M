// ─── Slumpmässig poängbonus ──────────────────────────────────────────────────────
// Efter en avslutad övning/uppgift kan eleven slumpmässigt få x2 eller x3 poäng.
// Avsiktligt oregelbundet och sällsynt: ren slump vid varje avslut, utan mönster,
// villkor eller räknare – så det går inte att lista ut hur man framkallar den.

export const BONUS_X3_CHANCE = 0.03; // 3 % chans för trippla poäng
export const BONUS_X2_CHANCE = 0.08; // 8 % chans för dubbla poäng

export type BonusMultiplier = 1 | 2 | 3;

export function rollPointsBonus(): BonusMultiplier {
  const r = Math.random();
  if (r < BONUS_X3_CHANCE) return 3;
  if (r < BONUS_X3_CHANCE + BONUS_X2_CHANCE) return 2;
  return 1;
}
