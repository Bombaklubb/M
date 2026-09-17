/**
 * Delar upp ett svenskt ord i grafem.
 *
 * Poängen: en elev som ljudar ska möta ETT ljud per bricka. Får hon "s" och
 * "j" var för sig i ordet "sjö" ljudar hon fram något som inte finns.
 * Digrafer hålls därför ihop.
 *
 * Segmenteringen blir ibland fel – sj-ljudet har omkring sju stavningar och
 * "sk" är ett ljud i "sked" men två i "skog". Därför är den redigerbar i
 * lärarläget för egna teman: den gissar, du rättar.
 */

/** Längsta först – matchningen är girig. */
const DIGRAPHS = ['stj', 'skj', 'sch', 'sj', 'tj', 'ng', 'ch', 'ck', 'sk'];

/** Mjuka vokaler. Framför dessa blir sk och sch ETT ljud ("sked", "skön"). */
const SOFT_VOWELS = new Set(['e', 'i', 'y', 'ä', 'ö']);

export function segment(word: string): string[] {
  const w = word.toLowerCase();
  const out: string[] = [];
  let i = 0;

  while (i < w.length) {
    let matched: string | null = null;

    for (const digraph of DIGRAPHS) {
      if (w.startsWith(digraph, i)) {
        // "sk" är bara ett ljud framför mjuk vokal. I "skog" är det s + k.
        if (digraph === 'sk' || digraph === 'sch') {
          const next = w[i + digraph.length];
          if (!next || !SOFT_VOWELS.has(next)) continue;
        }
        matched = digraph;
        break;
      }
    }

    if (matched) {
      out.push(matched);
      i += matched.length;
    } else {
      out.push(w[i]);
      i += 1;
    }
  }

  return out;
}
