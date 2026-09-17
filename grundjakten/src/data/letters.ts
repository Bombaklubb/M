import type { Letter } from '@/types';

/**
 * Alla 29 bokstäver, i INLÄRNINGSORDNING (progression 1–29), inte alfabetisk.
 *
 * Ordningen är vald så att steg 1–3 bara innehåller vokaler och uthållbara
 * konsonanter – s o l a r m i v e n. Varenda en av dem kan Chromes talsyntes
 * sträcka ut till ett användbart fonem, och tillsammans ger de redan dussintals
 * riktiga ord (sol, ros, mos, mor, ris, sal, arm, orm, nos, ren ...).
 *
 * Klusilerna (b d g k p t) ligger medvetet sent. De är både fonetiskt svårast
 * att uppfatta isolerat OCH de enda som talsyntesen inte klarar – den lägger
 * på ett schwa och säger "bö" i stället för /b/. Därför är `sound: null` för
 * dem, och de lärs ut via nyckelordet ("B som i boll"). Se lib/audio.ts.
 */
export const LETTERS: Letter[] = [
  {
    id: 's', upper: 'S', lower: 's',
    progression: 1, step: 1, soundClass: 'continuant',
    name: { id: 'name-s', text: 'ess', lang: 'sv-SE' },
    sound: { id: 'snd-s', text: 'sssss', lang: 'sv-SE', rate: 0.55 },
    keyword: {
      word: 'sol', emoji: '☀️',
      phrase: { id: 'kw-s', text: 'S som i sol', lang: 'sv-SE' },
      wordOnly: { id: 'word-sol', text: 'sol', lang: 'sv-SE' },
    },
    formation: {
      strokes: ['M 78 25 C 55 8 22 12 22 32 C 22 52 78 48 78 68 C 78 88 45 92 22 75'],
      cues: [{ id: 'cue-s-0', text: 'börja uppifrån', lang: 'sv-SE' }],
    },
  },
  {
    id: 'o', upper: 'O', lower: 'o',
    progression: 2, step: 1, soundClass: 'vowel',
    name: { id: 'name-o', text: 'o', lang: 'sv-SE' },
    sound: { id: 'snd-o', text: 'ooooo', lang: 'sv-SE', rate: 0.55 },
    keyword: {
      word: 'ost', emoji: '🧀',
      phrase: { id: 'kw-o', text: 'O som i ost', lang: 'sv-SE' },
      wordOnly: { id: 'word-ost', text: 'ost', lang: 'sv-SE' },
    },
    formation: {
      strokes: ['M 50 15 C 20 15 15 35 15 50 C 15 65 20 85 50 85 C 80 85 85 65 85 50 C 85 35 80 15 50 15'],
      cues: [{ id: 'cue-o-0', text: 'börja uppifrån', lang: 'sv-SE' }],
    },
  },
  {
    id: 'l', upper: 'L', lower: 'l',
    progression: 3, step: 1, soundClass: 'continuant',
    name: { id: 'name-l', text: 'ell', lang: 'sv-SE' },
    sound: { id: 'snd-l', text: 'llllll', lang: 'sv-SE', rate: 0.55 },
    keyword: {
      word: 'lok', emoji: '🚂',
      phrase: { id: 'kw-l', text: 'L som i lok', lang: 'sv-SE' },
      wordOnly: { id: 'word-lok', text: 'lok', lang: 'sv-SE' },
    },
    formation: {
      strokes: ['M 28 15 L 28 85 L 78 85'],
      cues: [{ id: 'cue-l-0', text: 'börja uppifrån', lang: 'sv-SE' }],
    },
  },
  {
    id: 'a', upper: 'A', lower: 'a',
    progression: 4, step: 1, soundClass: 'vowel',
    name: { id: 'name-a', text: 'a', lang: 'sv-SE' },
    sound: { id: 'snd-a', text: 'aaaaa', lang: 'sv-SE', rate: 0.55 },
    keyword: {
      word: 'apa', emoji: '🐒',
      phrase: { id: 'kw-a', text: 'A som i apa', lang: 'sv-SE' },
      wordOnly: { id: 'word-apa', text: 'apa', lang: 'sv-SE' },
    },
    formation: {
      strokes: ['M 20 85 L 50 15 L 80 85', 'M 32 58 L 68 58'],
      cues: [{ id: 'cue-a-0', text: 'först det långa strecket', lang: 'sv-SE' }, { id: 'cue-a-1', text: 'sedan nästa streck', lang: 'sv-SE' }],
    },
  },
  {
    id: 'r', upper: 'R', lower: 'r',
    progression: 5, step: 2, soundClass: 'continuant',
    name: { id: 'name-r', text: 'err', lang: 'sv-SE' },
    sound: { id: 'snd-r', text: 'rrrrr', lang: 'sv-SE', rate: 0.55 },
    keyword: {
      word: 'ros', emoji: '🌹',
      phrase: { id: 'kw-r', text: 'R som i ros', lang: 'sv-SE' },
      wordOnly: { id: 'word-ros', text: 'ros', lang: 'sv-SE' },
    },
    formation: {
      strokes: ['M 28 85 L 28 15', 'M 28 15 C 80 15 80 52 28 52', 'M 45 52 L 78 85'],
      cues: [{ id: 'cue-r-0', text: 'först det långa strecket', lang: 'sv-SE' }, { id: 'cue-r-1', text: 'sedan nästa streck', lang: 'sv-SE' }, { id: 'cue-r-2', text: 'och sista strecket', lang: 'sv-SE' }],
    },
  },
  {
    id: 'm', upper: 'M', lower: 'm',
    progression: 6, step: 2, soundClass: 'continuant',
    name: { id: 'name-m', text: 'em', lang: 'sv-SE' },
    sound: { id: 'snd-m', text: 'mmmmm', lang: 'sv-SE', rate: 0.55 },
    keyword: {
      word: 'mus', emoji: '🐭',
      phrase: { id: 'kw-m', text: 'M som i mus', lang: 'sv-SE' },
      wordOnly: { id: 'word-mus', text: 'mus', lang: 'sv-SE' },
    },
    formation: {
      strokes: ['M 22 85 L 22 15 L 50 55 L 78 15 L 78 85'],
      cues: [{ id: 'cue-m-0', text: 'börja uppifrån', lang: 'sv-SE' }],
    },
  },
  {
    id: 'i', upper: 'I', lower: 'i',
    progression: 7, step: 2, soundClass: 'vowel',
    name: { id: 'name-i', text: 'i', lang: 'sv-SE' },
    sound: { id: 'snd-i', text: 'iiiii', lang: 'sv-SE', rate: 0.55 },
    keyword: {
      word: 'is', emoji: '🧊',
      phrase: { id: 'kw-i', text: 'I som i is', lang: 'sv-SE' },
      wordOnly: { id: 'word-is', text: 'is', lang: 'sv-SE' },
    },
    formation: {
      strokes: ['M 50 15 L 50 85', 'M 30 15 L 70 15', 'M 30 85 L 70 85'],
      cues: [{ id: 'cue-i-0', text: 'först det långa strecket', lang: 'sv-SE' }, { id: 'cue-i-1', text: 'sedan nästa streck', lang: 'sv-SE' }, { id: 'cue-i-2', text: 'och sista strecket', lang: 'sv-SE' }],
    },
  },
  {
    id: 'v', upper: 'V', lower: 'v',
    progression: 8, step: 3, soundClass: 'continuant',
    name: { id: 'name-v', text: 've', lang: 'sv-SE' },
    sound: { id: 'snd-v', text: 'vvvvv', lang: 'sv-SE', rate: 0.55 },
    keyword: {
      word: 'val', emoji: '🐋',
      phrase: { id: 'kw-v', text: 'V som i val', lang: 'sv-SE' },
      wordOnly: { id: 'word-val', text: 'val', lang: 'sv-SE' },
    },
    formation: {
      strokes: ['M 20 15 L 50 85 L 80 15'],
      cues: [{ id: 'cue-v-0', text: 'börja uppifrån', lang: 'sv-SE' }],
    },
  },
  {
    id: 'e', upper: 'E', lower: 'e',
    progression: 9, step: 3, soundClass: 'vowel',
    name: { id: 'name-e', text: 'e', lang: 'sv-SE' },
    sound: { id: 'snd-e', text: 'eeeee', lang: 'sv-SE', rate: 0.55 },
    keyword: {
      word: 'elg', emoji: '🫎',
      phrase: { id: 'kw-e', text: 'E som i elg', lang: 'sv-SE' },
      wordOnly: { id: 'word-elg', text: 'elg', lang: 'sv-SE' },
    },
    formation: {
      strokes: ['M 78 15 L 25 15 L 25 85 L 78 85', 'M 25 50 L 66 50'],
      cues: [{ id: 'cue-e-0', text: 'först det långa strecket', lang: 'sv-SE' }, { id: 'cue-e-1', text: 'sedan nästa streck', lang: 'sv-SE' }],
    },
  },
  {
    id: 'n', upper: 'N', lower: 'n',
    progression: 10, step: 3, soundClass: 'continuant',
    name: { id: 'name-n', text: 'enn', lang: 'sv-SE' },
    sound: { id: 'snd-n', text: 'nnnnn', lang: 'sv-SE', rate: 0.55 },
    keyword: {
      word: 'nos', emoji: '👃',
      phrase: { id: 'kw-n', text: 'N som i nos', lang: 'sv-SE' },
      wordOnly: { id: 'word-nos', text: 'nos', lang: 'sv-SE' },
    },
    formation: {
      strokes: ['M 25 85 L 25 15 L 75 85 L 75 15'],
      cues: [{ id: 'cue-n-0', text: 'börja uppifrån', lang: 'sv-SE' }],
    },
  },
  {
    id: 't', upper: 'T', lower: 't',
    progression: 11, step: 4, soundClass: 'plosive',
    name: { id: 'name-t', text: 'te', lang: 'sv-SE' },
    sound: null,
    keyword: {
      word: 'tåg', emoji: '🚆',
      phrase: { id: 'kw-t', text: 'T som i tåg', lang: 'sv-SE' },
      wordOnly: { id: 'word-tåg', text: 'tåg', lang: 'sv-SE' },
    },
    formation: {
      strokes: ['M 50 15 L 50 85', 'M 18 15 L 82 15'],
      cues: [{ id: 'cue-t-0', text: 'först det långa strecket', lang: 'sv-SE' }, { id: 'cue-t-1', text: 'sedan nästa streck', lang: 'sv-SE' }],
    },
  },
  {
    id: 'f', upper: 'F', lower: 'f',
    progression: 12, step: 4, soundClass: 'continuant',
    name: { id: 'name-f', text: 'eff', lang: 'sv-SE' },
    sound: { id: 'snd-f', text: 'fffff', lang: 'sv-SE', rate: 0.55 },
    keyword: {
      word: 'fisk', emoji: '🐟',
      phrase: { id: 'kw-f', text: 'F som i fisk', lang: 'sv-SE' },
      wordOnly: { id: 'word-fisk', text: 'fisk', lang: 'sv-SE' },
    },
    formation: {
      strokes: ['M 78 15 L 25 15 L 25 85', 'M 25 50 L 66 50'],
      cues: [{ id: 'cue-f-0', text: 'först det långa strecket', lang: 'sv-SE' }, { id: 'cue-f-1', text: 'sedan nästa streck', lang: 'sv-SE' }],
    },
  },
  {
    id: 'ä', upper: 'Ä', lower: 'ä',
    progression: 13, step: 4, soundClass: 'vowel',
    name: { id: 'name-ä', text: 'ä', lang: 'sv-SE' },
    sound: { id: 'snd-ä', text: 'ääää', lang: 'sv-SE', rate: 0.55 },
    keyword: {
      word: 'äpple', emoji: '🍎',
      phrase: { id: 'kw-ä', text: 'Ä som i äpple', lang: 'sv-SE' },
      wordOnly: { id: 'word-äpple', text: 'äpple', lang: 'sv-SE' },
    },
    formation: {
      strokes: ['M 20 88 L 50 28 L 80 88', 'M 32 66 L 68 66', 'M 36 14 m -6 0 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0', 'M 64 14 m -6 0 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0'],
      cues: [{ id: 'cue-ä-0', text: 'först det långa strecket', lang: 'sv-SE' }, { id: 'cue-ä-1', text: 'sedan nästa streck', lang: 'sv-SE' }, { id: 'cue-ä-2', text: 'sedan pricken', lang: 'sv-SE' }, { id: 'cue-ä-3', text: 'och sista pricken', lang: 'sv-SE' }],
    },
  },
  {
    id: 'k', upper: 'K', lower: 'k',
    progression: 14, step: 5, soundClass: 'plosive',
    name: { id: 'name-k', text: 'kå', lang: 'sv-SE' },
    sound: null,
    keyword: {
      word: 'ko', emoji: '🐄',
      phrase: { id: 'kw-k', text: 'K som i ko', lang: 'sv-SE' },
      wordOnly: { id: 'word-ko', text: 'ko', lang: 'sv-SE' },
    },
    formation: {
      strokes: ['M 28 15 L 28 85', 'M 75 15 L 28 52', 'M 42 43 L 78 85'],
      cues: [{ id: 'cue-k-0', text: 'först det långa strecket', lang: 'sv-SE' }, { id: 'cue-k-1', text: 'sedan nästa streck', lang: 'sv-SE' }, { id: 'cue-k-2', text: 'och sista strecket', lang: 'sv-SE' }],
    },
  },
  {
    id: 'ö', upper: 'Ö', lower: 'ö',
    progression: 15, step: 5, soundClass: 'vowel',
    name: { id: 'name-ö', text: 'ö', lang: 'sv-SE' },
    sound: { id: 'snd-ö', text: 'öööö', lang: 'sv-SE', rate: 0.55 },
    keyword: {
      word: 'öra', emoji: '👂',
      phrase: { id: 'kw-ö', text: 'Ö som i öra', lang: 'sv-SE' },
      wordOnly: { id: 'word-öra', text: 'öra', lang: 'sv-SE' },
    },
    formation: {
      strokes: ['M 50 28 C 22 28 18 44 18 58 C 18 72 22 88 50 88 C 78 88 82 72 82 58 C 82 44 78 28 50 28', 'M 36 14 m -6 0 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0', 'M 64 14 m -6 0 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0'],
      cues: [{ id: 'cue-ö-0', text: 'först det långa strecket', lang: 'sv-SE' }, { id: 'cue-ö-1', text: 'sedan nästa streck', lang: 'sv-SE' }, { id: 'cue-ö-2', text: 'och sista strecket', lang: 'sv-SE' }],
    },
  },
  {
    id: 'u', upper: 'U', lower: 'u',
    progression: 16, step: 5, soundClass: 'vowel',
    name: { id: 'name-u', text: 'u', lang: 'sv-SE' },
    sound: { id: 'snd-u', text: 'uuuuu', lang: 'sv-SE', rate: 0.55 },
    keyword: {
      word: 'uggla', emoji: '🦉',
      phrase: { id: 'kw-u', text: 'U som i uggla', lang: 'sv-SE' },
      wordOnly: { id: 'word-uggla', text: 'uggla', lang: 'sv-SE' },
    },
    formation: {
      strokes: ['M 25 15 L 25 60 C 25 88 75 88 75 60 L 75 15'],
      cues: [{ id: 'cue-u-0', text: 'börja uppifrån', lang: 'sv-SE' }],
    },
  },
  {
    id: 'p', upper: 'P', lower: 'p',
    progression: 17, step: 6, soundClass: 'plosive',
    name: { id: 'name-p', text: 'pe', lang: 'sv-SE' },
    sound: null,
    keyword: {
      word: 'penna', emoji: '✏️',
      phrase: { id: 'kw-p', text: 'P som i penna', lang: 'sv-SE' },
      wordOnly: { id: 'word-penna', text: 'penna', lang: 'sv-SE' },
    },
    formation: {
      strokes: ['M 28 85 L 28 15', 'M 28 15 C 80 15 80 55 28 55'],
      cues: [{ id: 'cue-p-0', text: 'först det långa strecket', lang: 'sv-SE' }, { id: 'cue-p-1', text: 'sedan nästa streck', lang: 'sv-SE' }],
    },
  },
  {
    id: 'å', upper: 'Å', lower: 'å',
    progression: 18, step: 6, soundClass: 'vowel',
    name: { id: 'name-å', text: 'å', lang: 'sv-SE' },
    sound: { id: 'snd-å', text: 'åååå', lang: 'sv-SE', rate: 0.55 },
    keyword: {
      word: 'ål', emoji: '🐍',
      phrase: { id: 'kw-å', text: 'Å som i ål', lang: 'sv-SE' },
      wordOnly: { id: 'word-ål', text: 'ål', lang: 'sv-SE' },
    },
    formation: {
      strokes: ['M 20 88 L 50 28 L 80 88', 'M 32 66 L 68 66', 'M 50 18 m -9 0 a 9 9 0 1 0 18 0 a 9 9 0 1 0 -18 0'],
      cues: [{ id: 'cue-å-0', text: 'först det långa strecket', lang: 'sv-SE' }, { id: 'cue-å-1', text: 'sedan nästa streck', lang: 'sv-SE' }, { id: 'cue-å-2', text: 'och sista strecket', lang: 'sv-SE' }],
    },
  },
  {
    id: 'g', upper: 'G', lower: 'g',
    progression: 19, step: 6, soundClass: 'plosive',
    name: { id: 'name-g', text: 'ge', lang: 'sv-SE' },
    sound: null,
    keyword: {
      word: 'gris', emoji: '🐷',
      phrase: { id: 'kw-g', text: 'G som i gris', lang: 'sv-SE' },
      wordOnly: { id: 'word-gris', text: 'gris', lang: 'sv-SE' },
    },
    formation: {
      strokes: ['M 78 28 C 40 5 15 30 15 50 C 15 70 40 95 78 72 L 78 52 L 55 52'],
      cues: [{ id: 'cue-g-0', text: 'börja uppifrån', lang: 'sv-SE' }],
    },
  },
  {
    id: 'b', upper: 'B', lower: 'b',
    progression: 20, step: 7, soundClass: 'plosive',
    name: { id: 'name-b', text: 'be', lang: 'sv-SE' },
    sound: null,
    keyword: {
      word: 'boll', emoji: '🏀',
      phrase: { id: 'kw-b', text: 'B som i boll', lang: 'sv-SE' },
      wordOnly: { id: 'word-boll', text: 'boll', lang: 'sv-SE' },
    },
    formation: {
      strokes: ['M 28 15 L 28 85', 'M 28 15 C 70 15 70 50 28 50', 'M 28 50 C 75 50 75 85 28 85'],
      cues: [{ id: 'cue-b-0', text: 'först det långa strecket', lang: 'sv-SE' }, { id: 'cue-b-1', text: 'sedan nästa streck', lang: 'sv-SE' }, { id: 'cue-b-2', text: 'och sista strecket', lang: 'sv-SE' }],
    },
  },
  {
    id: 'd', upper: 'D', lower: 'd',
    progression: 21, step: 7, soundClass: 'plosive',
    name: { id: 'name-d', text: 'de', lang: 'sv-SE' },
    sound: null,
    keyword: {
      word: 'dörr', emoji: '🚪',
      phrase: { id: 'kw-d', text: 'D som i dörr', lang: 'sv-SE' },
      wordOnly: { id: 'word-dörr', text: 'dörr', lang: 'sv-SE' },
    },
    formation: {
      strokes: ['M 28 15 L 28 85', 'M 28 15 C 85 15 85 85 28 85'],
      cues: [{ id: 'cue-d-0', text: 'först det långa strecket', lang: 'sv-SE' }, { id: 'cue-d-1', text: 'sedan nästa streck', lang: 'sv-SE' }],
    },
  },
  {
    id: 'h', upper: 'H', lower: 'h',
    progression: 22, step: 7, soundClass: 'continuant',
    name: { id: 'name-h', text: 'hå', lang: 'sv-SE' },
    sound: { id: 'snd-h', text: 'hhhhh', lang: 'sv-SE', rate: 0.55 },
    keyword: {
      word: 'hus', emoji: '🏠',
      phrase: { id: 'kw-h', text: 'H som i hus', lang: 'sv-SE' },
      wordOnly: { id: 'word-hus', text: 'hus', lang: 'sv-SE' },
    },
    formation: {
      strokes: ['M 25 15 L 25 85', 'M 75 15 L 75 85', 'M 25 50 L 75 50'],
      cues: [{ id: 'cue-h-0', text: 'först det långa strecket', lang: 'sv-SE' }, { id: 'cue-h-1', text: 'sedan nästa streck', lang: 'sv-SE' }, { id: 'cue-h-2', text: 'och sista strecket', lang: 'sv-SE' }],
    },
  },
  {
    id: 'j', upper: 'J', lower: 'j',
    progression: 23, step: 7, soundClass: 'continuant',
    name: { id: 'name-j', text: 'ji', lang: 'sv-SE' },
    sound: { id: 'snd-j', text: 'jjjjj', lang: 'sv-SE', rate: 0.55 },
    keyword: {
      word: 'jul', emoji: '🎄',
      phrase: { id: 'kw-j', text: 'J som i jul', lang: 'sv-SE' },
      wordOnly: { id: 'word-jul', text: 'jul', lang: 'sv-SE' },
    },
    formation: {
      strokes: ['M 70 15 L 70 68 C 70 90 35 90 30 70'],
      cues: [{ id: 'cue-j-0', text: 'börja uppifrån', lang: 'sv-SE' }],
    },
  },
  {
    id: 'y', upper: 'Y', lower: 'y',
    progression: 24, step: 8, soundClass: 'vowel',
    name: { id: 'name-y', text: 'y', lang: 'sv-SE' },
    sound: { id: 'snd-y', text: 'yyyyy', lang: 'sv-SE', rate: 0.55 },
    keyword: {
      word: 'yxa', emoji: '🪓',
      phrase: { id: 'kw-y', text: 'Y som i yxa', lang: 'sv-SE' },
      wordOnly: { id: 'word-yxa', text: 'yxa', lang: 'sv-SE' },
    },
    formation: {
      strokes: ['M 22 15 L 50 50 L 78 15', 'M 50 50 L 50 85'],
      cues: [{ id: 'cue-y-0', text: 'först det långa strecket', lang: 'sv-SE' }, { id: 'cue-y-1', text: 'sedan nästa streck', lang: 'sv-SE' }],
    },
  },
  {
    id: 'c', upper: 'C', lower: 'c',
    progression: 25, step: 8, soundClass: 'plosive',
    name: { id: 'name-c', text: 'se', lang: 'sv-SE' },
    sound: null,
    keyword: {
      word: 'cykel', emoji: '🚲',
      phrase: { id: 'kw-c', text: 'C som i cykel', lang: 'sv-SE' },
      wordOnly: { id: 'word-cykel', text: 'cykel', lang: 'sv-SE' },
    },
    formation: {
      strokes: ['M 78 28 C 40 5 15 30 15 50 C 15 70 40 95 78 72'],
      cues: [{ id: 'cue-c-0', text: 'börja uppifrån', lang: 'sv-SE' }],
    },
  },
  {
    id: 'x', upper: 'X', lower: 'x',
    progression: 26, step: 8, soundClass: 'continuant',
    name: { id: 'name-x', text: 'eks', lang: 'sv-SE' },
    sound: { id: 'snd-x', text: 'kssss', lang: 'sv-SE', rate: 0.55 },
    keyword: {
      word: 'xylofon', emoji: '🎹',
      phrase: { id: 'kw-x', text: 'X som i xylofon', lang: 'sv-SE' },
      wordOnly: { id: 'word-xylofon', text: 'xylofon', lang: 'sv-SE' },
    },
    formation: {
      strokes: ['M 22 15 L 78 85', 'M 78 15 L 22 85'],
      cues: [{ id: 'cue-x-0', text: 'först det långa strecket', lang: 'sv-SE' }, { id: 'cue-x-1', text: 'sedan nästa streck', lang: 'sv-SE' }],
    },
  },
  {
    id: 'z', upper: 'Z', lower: 'z',
    progression: 27, step: 8, soundClass: 'continuant',
    name: { id: 'name-z', text: 'säta', lang: 'sv-SE' },
    sound: { id: 'snd-z', text: 'sssss', lang: 'sv-SE', rate: 0.55 },
    keyword: {
      word: 'zebra', emoji: '🦓',
      phrase: { id: 'kw-z', text: 'Z som i zebra', lang: 'sv-SE' },
      wordOnly: { id: 'word-zebra', text: 'zebra', lang: 'sv-SE' },
    },
    formation: {
      strokes: ['M 22 15 L 78 15 L 22 85 L 78 85'],
      cues: [{ id: 'cue-z-0', text: 'börja uppifrån', lang: 'sv-SE' }],
    },
  },
  {
    id: 'w', upper: 'W', lower: 'w',
    progression: 28, step: 8, soundClass: 'continuant',
    name: { id: 'name-w', text: 'dubbel-ve', lang: 'sv-SE' },
    sound: { id: 'snd-w', text: 'vvvvv', lang: 'sv-SE', rate: 0.55 },
    keyword: {
      word: 'webb', emoji: '🌐',
      phrase: { id: 'kw-w', text: 'W som i webb', lang: 'sv-SE' },
      wordOnly: { id: 'word-webb', text: 'webb', lang: 'sv-SE' },
    },
    formation: {
      strokes: ['M 12 15 L 30 85 L 50 35 L 70 85 L 88 15'],
      cues: [{ id: 'cue-w-0', text: 'börja uppifrån', lang: 'sv-SE' }],
    },
  },
  {
    id: 'q', upper: 'Q', lower: 'q',
    progression: 29, step: 8, soundClass: 'plosive',
    name: { id: 'name-q', text: 'ku', lang: 'sv-SE' },
    sound: null,
    keyword: {
      word: 'queen', emoji: '👑',
      phrase: { id: 'kw-q', text: 'Q som i queen', lang: 'sv-SE' },
      wordOnly: { id: 'word-queen', text: 'queen', lang: 'sv-SE' },
    },
    formation: {
      strokes: ['M 50 15 C 20 15 15 35 15 50 C 15 65 20 85 50 85 C 80 85 85 65 85 50 C 85 35 80 15 50 15', 'M 60 68 L 85 92'],
      cues: [{ id: 'cue-q-0', text: 'först det långa strecket', lang: 'sv-SE' }, { id: 'cue-q-1', text: 'sedan nästa streck', lang: 'sv-SE' }],
    },
  },
];

/** Uppslag per bokstavs-id. */
export const LETTER_BY_ID: Record<string, Letter> = Object.fromEntries(
  LETTERS.map((l) => [l.id, l])
);

/** Bokstäverna som är upplåsta till och med ett visst steg. */
export function lettersUpToStep(step: number): Letter[] {
  return LETTERS.filter((l) => l.step <= step);
}
