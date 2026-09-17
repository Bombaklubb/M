/**
 * Liten deterministisk slumpgenerator.
 *
 * Deterministisk med flit: ett pass byggs från ett frö, så samma pass kan
 * återskapas identiskt om något går fel – och två elever på samma steg får
 * inte exakt samma pass, eftersom fröet innehåller tidsstämpeln.
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Rng = () => number;

export function shuffle<T>(items: T[], rng: Rng): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function pick<T>(items: T[], rng: Rng): T {
  return items[Math.floor(rng() * items.length)];
}

/** Plockar upp till n slumpmässiga poster utan upprepning. */
export function pickN<T>(items: T[], n: number, rng: Rng): T[] {
  return shuffle(items, rng).slice(0, n);
}

/**
 * Plockar distraktorer som INTE är svaret.
 * Returnerar färre än `n` om det inte finns tillräckligt många kandidater –
 * anroparen ska då hoppa över övningen hellre än att rendera tomma rutor.
 */
export function distractors<T>(pool: T[], exclude: (item: T) => boolean, n: number, rng: Rng): T[] {
  return pickN(pool.filter((p) => !exclude(p)), n, rng);
}
