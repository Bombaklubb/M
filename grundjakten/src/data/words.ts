import type { WordEntry } from '@/types';

/**
 * Ljudenligt stavade ord, taggade med det lägsta steg där alla grafem är kända.
 *
 * `graphemes` håller ihop digrafer (sk, sj, ng, ck ...) eftersom en elev som
 * ljudar ska möta ETT ljud per bricka, inte två bokstäver hon sedan ska
 * gissa hör ihop. Segmenteringen är genererad och sedan handgranskad.
 *
 * `emoji: null` betyder att ordet saknar bild. Generatorn hoppar då över de
 * bildberoende övningstyperna för just det ordet i stället för att rendera en
 * tom ruta.
 */
export const WORDS: WordEntry[] = [
  { id: 'w-sal', text: 'sal', emoji: null, graphemes: ['s', 'a', 'l'], step: 1, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-sal', text: 'sal', lang: 'sv-SE' } },
  { id: 'w-sol', text: 'sol', emoji: '☀️', graphemes: ['s', 'o', 'l'], step: 1, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-sol', text: 'sol', lang: 'sv-SE' } },
  { id: 'w-arm', text: 'arm', emoji: '💪', graphemes: ['a', 'r', 'm'], step: 2, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-arm', text: 'arm', lang: 'sv-SE' } },
  { id: 'w-mil', text: 'mil', emoji: null, graphemes: ['m', 'i', 'l'], step: 2, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-mil', text: 'mil', lang: 'sv-SE' } },
  { id: 'w-mor', text: 'mor', emoji: '👩', graphemes: ['m', 'o', 'r'], step: 2, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-mor', text: 'mor', lang: 'sv-SE' } },
  { id: 'w-mos', text: 'mos', emoji: null, graphemes: ['m', 'o', 's'], step: 2, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-mos', text: 'mos', lang: 'sv-SE' } },
  { id: 'w-orm', text: 'orm', emoji: '🐍', graphemes: ['o', 'r', 'm'], step: 2, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-orm', text: 'orm', lang: 'sv-SE' } },
  { id: 'w-ram', text: 'ram', emoji: '🖼️', graphemes: ['r', 'a', 'm'], step: 2, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-ram', text: 'ram', lang: 'sv-SE' } },
  { id: 'w-ris', text: 'ris', emoji: '🍚', graphemes: ['r', 'i', 's'], step: 2, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-ris', text: 'ris', lang: 'sv-SE' } },
  { id: 'w-ros', text: 'ros', emoji: '🌹', graphemes: ['r', 'o', 's'], step: 2, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-ros', text: 'ros', lang: 'sv-SE' } },
  { id: 'w-sil', text: 'sil', emoji: null, graphemes: ['s', 'i', 'l'], step: 2, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-sil', text: 'sil', lang: 'sv-SE' } },
  { id: 'w-man', text: 'man', emoji: '👨', graphemes: ['m', 'a', 'n'], step: 3, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-man', text: 'man', lang: 'sv-SE' } },
  { id: 'w-ner', text: 'ner', emoji: null, graphemes: ['n', 'e', 'r'], step: 3, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-ner', text: 'ner', lang: 'sv-SE' } },
  { id: 'w-nos', text: 'nos', emoji: '👃', graphemes: ['n', 'o', 's'], step: 3, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-nos', text: 'nos', lang: 'sv-SE' } },
  { id: 'w-ren', text: 'ren', emoji: '🦌', graphemes: ['r', 'e', 'n'], step: 3, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-ren', text: 'ren', lang: 'sv-SE' } },
  { id: 'w-sen', text: 'sen', emoji: null, graphemes: ['s', 'e', 'n'], step: 3, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-sen', text: 'sen', lang: 'sv-SE' } },
  { id: 'w-van', text: 'van', emoji: null, graphemes: ['v', 'a', 'n'], step: 3, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-van', text: 'van', lang: 'sv-SE' } },
  { id: 'w-vas', text: 'vas', emoji: '🏺', graphemes: ['v', 'a', 's'], step: 3, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-vas', text: 'vas', lang: 'sv-SE' } },
  { id: 'w-vin', text: 'vin', emoji: null, graphemes: ['v', 'i', 'n'], step: 3, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-vin', text: 'vin', lang: 'sv-SE' } },
  { id: 'w-far', text: 'far', emoji: '👨', graphemes: ['f', 'a', 'r'], step: 4, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-far', text: 'far', lang: 'sv-SE' } },
  { id: 'w-fem', text: 'fem', emoji: '5️⃣', graphemes: ['f', 'e', 'm'], step: 4, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-fem', text: 'fem', lang: 'sv-SE' } },
  { id: 'w-fil', text: 'fil', emoji: null, graphemes: ['f', 'i', 'l'], step: 4, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-fil', text: 'fil', lang: 'sv-SE' } },
  { id: 'w-fin', text: 'fin', emoji: null, graphemes: ['f', 'i', 'n'], step: 4, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-fin', text: 'fin', lang: 'sv-SE' } },
  { id: 'w-tre', text: 'tre', emoji: '3️⃣', graphemes: ['t', 'r', 'e'], step: 4, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-tre', text: 'tre', lang: 'sv-SE' } },
  { id: 'w-fisk', text: 'fisk', emoji: '🐟', graphemes: ['f', 'i', 's', 'k'], step: 5, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-fisk', text: 'fisk', lang: 'sv-SE' } },
  { id: 'w-ful', text: 'ful', emoji: null, graphemes: ['f', 'u', 'l'], step: 5, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-ful', text: 'ful', lang: 'sv-SE' } },
  { id: 'w-kam', text: 'kam', emoji: '🪮', graphemes: ['k', 'a', 'm'], step: 5, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-kam', text: 'kam', lang: 'sv-SE' } },
  { id: 'w-katt', text: 'katt', emoji: '🐈', graphemes: ['k', 'a', 't', 't'], step: 5, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-katt', text: 'katt', lang: 'sv-SE' } },
  { id: 'w-kil', text: 'kil', emoji: null, graphemes: ['k', 'i', 'l'], step: 5, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-kil', text: 'kil', lang: 'sv-SE' } },
  { id: 'w-ko', text: 'ko', emoji: '🐄', graphemes: ['k', 'o'], step: 5, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-ko', text: 'ko', lang: 'sv-SE' } },
  { id: 'w-kul', text: 'kul', emoji: null, graphemes: ['k', 'u', 'l'], step: 5, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-kul', text: 'kul', lang: 'sv-SE' } },
  { id: 'w-kö', text: 'kö', emoji: null, graphemes: ['k', 'ö'], step: 5, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-kö', text: 'kö', lang: 'sv-SE' } },
  { id: 'w-lök', text: 'lök', emoji: '🧅', graphemes: ['l', 'ö', 'k'], step: 5, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-lök', text: 'lök', lang: 'sv-SE' } },
  { id: 'w-mus', text: 'mus', emoji: '🐭', graphemes: ['m', 'u', 's'], step: 5, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-mus', text: 'mus', lang: 'sv-SE' } },
  { id: 'w-rök', text: 'rök', emoji: '💨', graphemes: ['r', 'ö', 'k'], step: 5, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-rök', text: 'rök', lang: 'sv-SE' } },
  { id: 'w-sur', text: 'sur', emoji: '🍋', graphemes: ['s', 'u', 'r'], step: 5, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-sur', text: 'sur', lang: 'sv-SE' } },
  { id: 'w-sök', text: 'sök', emoji: null, graphemes: ['s', 'ö', 'k'], step: 5, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-sök', text: 'sök', lang: 'sv-SE' } },
  { id: 'w-tak', text: 'tak', emoji: '🏠', graphemes: ['t', 'a', 'k'], step: 5, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-tak', text: 'tak', lang: 'sv-SE' } },
  { id: 'w-apa', text: 'apa', emoji: '🐒', graphemes: ['a', 'p', 'a'], step: 6, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-apa', text: 'apa', lang: 'sv-SE' } },
  { id: 'w-gris', text: 'gris', emoji: '🐷', graphemes: ['g', 'r', 'i', 's'], step: 6, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-gris', text: 'gris', lang: 'sv-SE' } },
  { id: 'w-gul', text: 'gul', emoji: '💛', graphemes: ['g', 'u', 'l'], step: 6, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-gul', text: 'gul', lang: 'sv-SE' } },
  { id: 'w-gå', text: 'gå', emoji: null, graphemes: ['g', 'å'], step: 6, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-gå', text: 'gå', lang: 'sv-SE' } },
  { id: 'w-gås', text: 'gås', emoji: '🦢', graphemes: ['g', 'å', 's'], step: 6, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-gås', text: 'gås', lang: 'sv-SE' } },
  { id: 'w-kung', text: 'kung', emoji: '👑', graphemes: ['k', 'u', 'ng'], step: 6, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-kung', text: 'kung', lang: 'sv-SE' } },
  { id: 'w-pil', text: 'pil', emoji: '➡️', graphemes: ['p', 'i', 'l'], step: 6, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-pil', text: 'pil', lang: 'sv-SE' } },
  { id: 'w-pris', text: 'pris', emoji: null, graphemes: ['p', 'r', 'i', 's'], step: 6, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-pris', text: 'pris', lang: 'sv-SE' } },
  { id: 'w-på', text: 'på', emoji: null, graphemes: ['p', 'å'], step: 6, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-på', text: 'på', lang: 'sv-SE' } },
  { id: 'w-påse', text: 'påse', emoji: '🛍️', graphemes: ['p', 'å', 's', 'e'], step: 6, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-påse', text: 'påse', lang: 'sv-SE' } },
  { id: 'w-ring', text: 'ring', emoji: '💍', graphemes: ['r', 'i', 'ng'], step: 6, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-ring', text: 'ring', lang: 'sv-SE' } },
  { id: 'w-skog', text: 'skog', emoji: '🌲', graphemes: ['s', 'k', 'o', 'g'], step: 6, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-skog', text: 'skog', lang: 'sv-SE' } },
  { id: 'w-säng', text: 'säng', emoji: '🛏️', graphemes: ['s', 'ä', 'ng'], step: 6, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-säng', text: 'säng', lang: 'sv-SE' } },
  { id: 'w-tår', text: 'tår', emoji: '💧', graphemes: ['t', 'å', 'r'], step: 6, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-tår', text: 'tår', lang: 'sv-SE' } },
  { id: 'w-bad', text: 'bad', emoji: '🛁', graphemes: ['b', 'a', 'd'], step: 7, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-bad', text: 'bad', lang: 'sv-SE' } },
  { id: 'w-ben', text: 'ben', emoji: '🦵', graphemes: ['b', 'e', 'n'], step: 7, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-ben', text: 'ben', lang: 'sv-SE' } },
  { id: 'w-bil', text: 'bil', emoji: '🚗', graphemes: ['b', 'i', 'l'], step: 7, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-bil', text: 'bil', lang: 'sv-SE' } },
  { id: 'w-bok', text: 'bok', emoji: '📕', graphemes: ['b', 'o', 'k'], step: 7, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-bok', text: 'bok', lang: 'sv-SE' } },
  { id: 'w-bord', text: 'bord', emoji: '🪑', graphemes: ['b', 'o', 'rd'], step: 7, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-bord', text: 'bord', lang: 'sv-SE' } },
  { id: 'w-bär', text: 'bär', emoji: '🍓', graphemes: ['b', 'ä', 'r'], step: 7, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-bär', text: 'bär', lang: 'sv-SE' } },
  { id: 'w-dag', text: 'dag', emoji: '☀️', graphemes: ['d', 'a', 'g'], step: 7, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-dag', text: 'dag', lang: 'sv-SE' } },
  { id: 'w-dam', text: 'dam', emoji: '👩', graphemes: ['d', 'a', 'm'], step: 7, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-dam', text: 'dam', lang: 'sv-SE' } },
  { id: 'w-hand', text: 'hand', emoji: '✋', graphemes: ['h', 'a', 'n', 'd'], step: 7, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-hand', text: 'hand', lang: 'sv-SE' } },
  { id: 'w-hatt', text: 'hatt', emoji: '🎩', graphemes: ['h', 'a', 't', 't'], step: 7, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-hatt', text: 'hatt', lang: 'sv-SE' } },
  { id: 'w-hej', text: 'hej', emoji: '👋', graphemes: ['h', 'e', 'j'], step: 7, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-hej', text: 'hej', lang: 'sv-SE' } },
  { id: 'w-hund', text: 'hund', emoji: '🐕', graphemes: ['h', 'u', 'n', 'd'], step: 7, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-hund', text: 'hund', lang: 'sv-SE' } },
  { id: 'w-hus', text: 'hus', emoji: '🏠', graphemes: ['h', 'u', 's'], step: 7, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-hus', text: 'hus', lang: 'sv-SE' } },
  { id: 'w-hår', text: 'hår', emoji: null, graphemes: ['h', 'å', 'r'], step: 7, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-hår', text: 'hår', lang: 'sv-SE' } },
  { id: 'w-jag', text: 'jag', emoji: null, graphemes: ['j', 'a', 'g'], step: 7, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-jag', text: 'jag', lang: 'sv-SE' } },
  { id: 'w-röd', text: 'röd', emoji: null, graphemes: ['r', 'ö', 'd'], step: 7, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-röd', text: 'röd', lang: 'sv-SE' } },
  { id: 'w-sked', text: 'sked', emoji: '🥄', graphemes: ['sk', 'e', 'd'], step: 7, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-sked', text: 'sked', lang: 'sv-SE' } },
  { id: 'w-skjorta', text: 'skjorta', emoji: '👕', graphemes: ['skj', 'o', 'rt', 'a'], step: 7, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-skjorta', text: 'skjorta', lang: 'sv-SE' } },
  { id: 'w-box', text: 'box', emoji: '📦', graphemes: ['b', 'o', 'x'], step: 8, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-box', text: 'box', lang: 'sv-SE' } },
  { id: 'w-bäck', text: 'bäck', emoji: null, graphemes: ['b', 'ä', 'ck'], step: 8, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-bäck', text: 'bäck', lang: 'sv-SE' } },
  { id: 'w-cykel', text: 'cykel', emoji: '🚲', graphemes: ['c', 'y', 'k', 'e', 'l'], step: 8, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-cykel', text: 'cykel', lang: 'sv-SE' } },
  { id: 'w-sax', text: 'sax', emoji: '✂️', graphemes: ['s', 'a', 'x'], step: 8, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-sax', text: 'sax', lang: 'sv-SE' } },
  { id: 'w-yxa', text: 'yxa', emoji: '🪓', graphemes: ['y', 'x', 'a'], step: 8, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-yxa', text: 'yxa', lang: 'sv-SE' } },
  { id: 'w-zebra', text: 'zebra', emoji: '🦓', graphemes: ['z', 'e', 'b', 'r', 'a'], step: 8, kind: 'decodable', lang: 'sv-SE', say: { id: 'word-zebra', text: 'zebra', lang: 'sv-SE' } },
];

/** Ord som är läsbara med de bokstäver eleven har lärt sig. */
export function wordsUpToStep(step: number): WordEntry[] {
  return WORDS.filter((w) => w.step <= step);
}

/** Bara ord som har bild – för övningar som kräver bildalternativ. */
export function picturableWords(step: number): WordEntry[] {
  return wordsUpToStep(step).filter((w) => w.emoji !== null);
}
