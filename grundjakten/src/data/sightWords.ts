import type { WordEntry } from '@/types';

/**
 * Ordbilder – de vanligaste orden i svenskan.
 *
 * De flesta av dem går INTE att ljuda sig till ("och", "jag", "är", "de"), och
 * samtidigt utgör de en stor del av all löpande text. Eleven känner igen dem
 * som helheter i stället, vilket är precis så duktiga läsare läser dem.
 *
 * Inga emoji: de här orden har inga bilder, och övningarna för dem
 * (sight-word-pick) bygger på att höra ordet och välja rätt skriven form.
 */
export const SIGHT_WORDS: WordEntry[] = [
  { id: 'sw-och', text: 'och', emoji: null, graphemes: ['o', 'c', 'h'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-och', text: 'och', lang: 'sv-SE' } },
  { id: 'sw-jag', text: 'jag', emoji: null, graphemes: ['j', 'a', 'g'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-jag', text: 'jag', lang: 'sv-SE' } },
  { id: 'sw-är', text: 'är', emoji: null, graphemes: ['ä', 'r'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-är', text: 'är', lang: 'sv-SE' } },
  { id: 'sw-en', text: 'en', emoji: null, graphemes: ['e', 'n'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-en', text: 'en', lang: 'sv-SE' } },
  { id: 'sw-det', text: 'det', emoji: null, graphemes: ['d', 'e', 't'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-det', text: 'det', lang: 'sv-SE' } },
  { id: 'sw-att', text: 'att', emoji: null, graphemes: ['a', 't', 't'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-att', text: 'att', lang: 'sv-SE' } },
  { id: 'sw-som', text: 'som', emoji: null, graphemes: ['s', 'o', 'm'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-som', text: 'som', lang: 'sv-SE' } },
  { id: 'sw-på', text: 'på', emoji: null, graphemes: ['p', 'å'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-på', text: 'på', lang: 'sv-SE' } },
  { id: 'sw-med', text: 'med', emoji: null, graphemes: ['m', 'e', 'd'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-med', text: 'med', lang: 'sv-SE' } },
  { id: 'sw-han', text: 'han', emoji: null, graphemes: ['h', 'a', 'n'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-han', text: 'han', lang: 'sv-SE' } },
  { id: 'sw-hon', text: 'hon', emoji: null, graphemes: ['h', 'o', 'n'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-hon', text: 'hon', lang: 'sv-SE' } },
  { id: 'sw-den', text: 'den', emoji: null, graphemes: ['d', 'e', 'n'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-den', text: 'den', lang: 'sv-SE' } },
  { id: 'sw-inte', text: 'inte', emoji: null, graphemes: ['i', 'n', 't', 'e'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-inte', text: 'inte', lang: 'sv-SE' } },
  { id: 'sw-har', text: 'har', emoji: null, graphemes: ['h', 'a', 'r'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-har', text: 'har', lang: 'sv-SE' } },
  { id: 'sw-för', text: 'för', emoji: null, graphemes: ['f', 'ö', 'r'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-för', text: 'för', lang: 'sv-SE' } },
  { id: 'sw-de', text: 'de', emoji: null, graphemes: ['d', 'e'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-de', text: 'de', lang: 'sv-SE' } },
  { id: 'sw-vi', text: 'vi', emoji: null, graphemes: ['v', 'i'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-vi', text: 'vi', lang: 'sv-SE' } },
  { id: 'sw-du', text: 'du', emoji: null, graphemes: ['d', 'u'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-du', text: 'du', lang: 'sv-SE' } },
  { id: 'sw-ett', text: 'ett', emoji: null, graphemes: ['e', 't', 't'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-ett', text: 'ett', lang: 'sv-SE' } },
  { id: 'sw-var', text: 'var', emoji: null, graphemes: ['v', 'a', 'r'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-var', text: 'var', lang: 'sv-SE' } },
  { id: 'sw-till', text: 'till', emoji: null, graphemes: ['t', 'i', 'l', 'l'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-till', text: 'till', lang: 'sv-SE' } },
  { id: 'sw-av', text: 'av', emoji: null, graphemes: ['a', 'v'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-av', text: 'av', lang: 'sv-SE' } },
  { id: 'sw-om', text: 'om', emoji: null, graphemes: ['o', 'm'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-om', text: 'om', lang: 'sv-SE' } },
  { id: 'sw-så', text: 'så', emoji: null, graphemes: ['s', 'å'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-så', text: 'så', lang: 'sv-SE' } },
  { id: 'sw-kan', text: 'kan', emoji: null, graphemes: ['k', 'a', 'n'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-kan', text: 'kan', lang: 'sv-SE' } },
  { id: 'sw-men', text: 'men', emoji: null, graphemes: ['m', 'e', 'n'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-men', text: 'men', lang: 'sv-SE' } },
  { id: 'sw-här', text: 'här', emoji: null, graphemes: ['h', 'ä', 'r'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-här', text: 'här', lang: 'sv-SE' } },
  { id: 'sw-där', text: 'där', emoji: null, graphemes: ['d', 'ä', 'r'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-där', text: 'där', lang: 'sv-SE' } },
  { id: 'sw-nu', text: 'nu', emoji: null, graphemes: ['n', 'u'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-nu', text: 'nu', lang: 'sv-SE' } },
  { id: 'sw-när', text: 'när', emoji: null, graphemes: ['n', 'ä', 'r'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-när', text: 'när', lang: 'sv-SE' } },
];
