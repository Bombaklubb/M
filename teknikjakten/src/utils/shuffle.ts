/** Fisher-Yates shuffle – returnerar en ny, oberoende blandad kopia. */
export function shuffle<T>(arr: readonly T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Blandar svarsalternativen och räknar om vilket index som är rätt.
 *
 * Utan detta avgörs svaret av i vilken ordning alternativen råkar stå i datan –
 * skrivs rätt svar konsekvent först kan eleven få allt rätt genom att alltid
 * trycka på det översta alternativet.
 */
export function shuffleOptions(
  options: readonly string[],
  correctIndex: number,
): { options: string[]; correctIndex: number } {
  const order = shuffle(options.map((_, i) => i));
  return {
    options: order.map(i => options[i]),
    correctIndex: order.indexOf(correctIndex),
  };
}
