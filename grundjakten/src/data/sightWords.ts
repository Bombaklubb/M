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
 *
 * Banken var förut 30 ord. Mätt mot svenskans vanligaste ord täckte appen då
 * 92 % av de 25 vanligaste men bara 44 % av de 100 – och det som fattades var
 * nästan uteslutande funktionsord, alltså precis vad den här filen finns för.
 *
 * Med 100 ord får övningen dessutom bättre DISTRAKTORER. makeSightWord tar ett
 * målord plus två andra ur samma bank; med 30 ord mötte eleven samma lilla
 * krets om och om igen.
 *
 * Alla ligger på `step: 1`. Ordbilder är inte stegstyrda – de ska finnas från
 * början, eftersom eleven möter dem i varje text hon ser.
 *
 * Grafemen är med för att typen kräver dem, och använder bara de sex digrafer
 * appen känner (ck, ng, rd, rt, sk, skj). De styr ingenting för ordbilder;
 * orden ska ju inte ljudas.
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

  // ── Tillagda: resten av de ~100 vanligaste ─────────────────────────
  { id: 'sw-sig', text: 'sig', emoji: null, graphemes: ['s', 'i', 'g'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-sig', text: 'sig', lang: 'sv-SE' } },
  { id: 'sw-från', text: 'från', emoji: null, graphemes: ['f', 'r', 'å', 'n'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-från', text: 'från', lang: 'sv-SE' } },
  { id: 'sw-också', text: 'också', emoji: null, graphemes: ['o', 'ck', 's', 'å'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-också', text: 'också', lang: 'sv-SE' } },
  { id: 'sw-efter', text: 'efter', emoji: null, graphemes: ['e', 'f', 't', 'e', 'r'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-efter', text: 'efter', lang: 'sv-SE' } },
  { id: 'sw-eller', text: 'eller', emoji: null, graphemes: ['e', 'l', 'l', 'e', 'r'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-eller', text: 'eller', lang: 'sv-SE' } },
  { id: 'sw-alla', text: 'alla', emoji: null, graphemes: ['a', 'l', 'l', 'a'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-alla', text: 'alla', lang: 'sv-SE' } },
  { id: 'sw-andra', text: 'andra', emoji: null, graphemes: ['a', 'n', 'd', 'r', 'a'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-andra', text: 'andra', lang: 'sv-SE' } },
  { id: 'sw-sin', text: 'sin', emoji: null, graphemes: ['s', 'i', 'n'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-sin', text: 'sin', lang: 'sv-SE' } },
  { id: 'sw-sitt', text: 'sitt', emoji: null, graphemes: ['s', 'i', 't', 't'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-sitt', text: 'sitt', lang: 'sv-SE' } },
  { id: 'sw-mot', text: 'mot', emoji: null, graphemes: ['m', 'o', 't'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-mot', text: 'mot', lang: 'sv-SE' } },
  { id: 'sw-in', text: 'in', emoji: null, graphemes: ['i', 'n'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-in', text: 'in', lang: 'sv-SE' } },
  { id: 'sw-ut', text: 'ut', emoji: null, graphemes: ['u', 't'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-ut', text: 'ut', lang: 'sv-SE' } },
  { id: 'sw-upp', text: 'upp', emoji: null, graphemes: ['u', 'p', 'p'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-upp', text: 'upp', lang: 'sv-SE' } },
  { id: 'sw-ner', text: 'ner', emoji: null, graphemes: ['n', 'e', 'r'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-ner', text: 'ner', lang: 'sv-SE' } },
  { id: 'sw-över', text: 'över', emoji: null, graphemes: ['ö', 'v', 'e', 'r'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-över', text: 'över', lang: 'sv-SE' } },
  { id: 'sw-under', text: 'under', emoji: null, graphemes: ['u', 'n', 'd', 'e', 'r'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-under', text: 'under', lang: 'sv-SE' } },
  { id: 'sw-vid', text: 'vid', emoji: null, graphemes: ['v', 'i', 'd'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-vid', text: 'vid', lang: 'sv-SE' } },
  { id: 'sw-genom', text: 'genom', emoji: null, graphemes: ['g', 'e', 'n', 'o', 'm'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-genom', text: 'genom', lang: 'sv-SE' } },
  { id: 'sw-bara', text: 'bara', emoji: null, graphemes: ['b', 'a', 'r', 'a'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-bara', text: 'bara', lang: 'sv-SE' } },
  { id: 'sw-då', text: 'då', emoji: null, graphemes: ['d', 'å'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-då', text: 'då', lang: 'sv-SE' } },
  { id: 'sw-än', text: 'än', emoji: null, graphemes: ['ä', 'n'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-än', text: 'än', lang: 'sv-SE' } },
  { id: 'sw-sedan', text: 'sedan', emoji: null, graphemes: ['s', 'e', 'd', 'a', 'n'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-sedan', text: 'sedan', lang: 'sv-SE' } },
  { id: 'sw-ju', text: 'ju', emoji: null, graphemes: ['j', 'u'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-ju', text: 'ju', lang: 'sv-SE' } },
  { id: 'sw-hela', text: 'hela', emoji: null, graphemes: ['h', 'e', 'l', 'a'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-hela', text: 'hela', lang: 'sv-SE' } },
  { id: 'sw-varje', text: 'varje', emoji: null, graphemes: ['v', 'a', 'r', 'j', 'e'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-varje', text: 'varje', lang: 'sv-SE' } },
  { id: 'sw-många', text: 'många', emoji: null, graphemes: ['m', 'å', 'ng', 'a'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-många', text: 'många', lang: 'sv-SE' } },
  { id: 'sw-mer', text: 'mer', emoji: null, graphemes: ['m', 'e', 'r'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-mer', text: 'mer', lang: 'sv-SE' } },
  { id: 'sw-mycket', text: 'mycket', emoji: null, graphemes: ['m', 'y', 'ck', 'e', 't'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-mycket', text: 'mycket', lang: 'sv-SE' } },
  { id: 'sw-ingen', text: 'ingen', emoji: null, graphemes: ['i', 'ng', 'e', 'n'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-ingen', text: 'ingen', lang: 'sv-SE' } },
  { id: 'sw-oss', text: 'oss', emoji: null, graphemes: ['o', 's', 's'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-oss', text: 'oss', lang: 'sv-SE' } },
  { id: 'sw-dig', text: 'dig', emoji: null, graphemes: ['d', 'i', 'g'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-dig', text: 'dig', lang: 'sv-SE' } },
  { id: 'sw-min', text: 'min', emoji: null, graphemes: ['m', 'i', 'n'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-min', text: 'min', lang: 'sv-SE' } },
  { id: 'sw-dem', text: 'dem', emoji: null, graphemes: ['d', 'e', 'm'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-dem', text: 'dem', lang: 'sv-SE' } },
  { id: 'sw-själv', text: 'själv', emoji: null, graphemes: ['s', 'j', 'ä', 'l', 'v'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-själv', text: 'själv', lang: 'sv-SE' } },
  { id: 'sw-samma', text: 'samma', emoji: null, graphemes: ['s', 'a', 'm', 'm', 'a'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-samma', text: 'samma', lang: 'sv-SE' } },
  { id: 'sw-några', text: 'några', emoji: null, graphemes: ['n', 'å', 'g', 'r', 'a'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-några', text: 'några', lang: 'sv-SE' } },
  { id: 'sw-ska', text: 'ska', emoji: null, graphemes: ['sk', 'a'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-ska', text: 'ska', lang: 'sv-SE' } },
  { id: 'sw-kommer', text: 'kommer', emoji: null, graphemes: ['k', 'o', 'm', 'm', 'e', 'r'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-kommer', text: 'kommer', lang: 'sv-SE' } },
  { id: 'sw-får', text: 'får', emoji: null, graphemes: ['f', 'å', 'r'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-får', text: 'får', lang: 'sv-SE' } },
  { id: 'sw-hade', text: 'hade', emoji: null, graphemes: ['h', 'a', 'd', 'e'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-hade', text: 'hade', lang: 'sv-SE' } },
  { id: 'sw-ha', text: 'ha', emoji: null, graphemes: ['h', 'a'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-ha', text: 'ha', lang: 'sv-SE' } },
  { id: 'sw-vara', text: 'vara', emoji: null, graphemes: ['v', 'a', 'r', 'a'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-vara', text: 'vara', lang: 'sv-SE' } },
  { id: 'sw-blir', text: 'blir', emoji: null, graphemes: ['b', 'l', 'i', 'r'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-blir', text: 'blir', lang: 'sv-SE' } },
  { id: 'sw-ser', text: 'ser', emoji: null, graphemes: ['s', 'e', 'r'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-ser', text: 'ser', lang: 'sv-SE' } },
  { id: 'sw-skulle', text: 'skulle', emoji: null, graphemes: ['sk', 'u', 'l', 'l', 'e'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-skulle', text: 'skulle', lang: 'sv-SE' } },
  { id: 'sw-vill', text: 'vill', emoji: null, graphemes: ['v', 'i', 'l', 'l'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-vill', text: 'vill', lang: 'sv-SE' } },
  { id: 'sw-göra', text: 'göra', emoji: null, graphemes: ['g', 'ö', 'r', 'a'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-göra', text: 'göra', lang: 'sv-SE' } },
  { id: 'sw-gör', text: 'gör', emoji: null, graphemes: ['g', 'ö', 'r'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-gör', text: 'gör', lang: 'sv-SE' } },
  { id: 'sw-fick', text: 'fick', emoji: null, graphemes: ['f', 'i', 'ck'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-fick', text: 'fick', lang: 'sv-SE' } },
  { id: 'sw-finns', text: 'finns', emoji: null, graphemes: ['f', 'i', 'n', 'n', 's'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-finns', text: 'finns', lang: 'sv-SE' } },
  { id: 'sw-vet', text: 'vet', emoji: null, graphemes: ['v', 'e', 't'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-vet', text: 'vet', lang: 'sv-SE' } },
  { id: 'sw-tror', text: 'tror', emoji: null, graphemes: ['t', 'r', 'o', 'r'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-tror', text: 'tror', lang: 'sv-SE' } },
  { id: 'sw-komma', text: 'komma', emoji: null, graphemes: ['k', 'o', 'm', 'm', 'a'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-komma', text: 'komma', lang: 'sv-SE' } },
  { id: 'sw-se', text: 'se', emoji: null, graphemes: ['s', 'e'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-se', text: 'se', lang: 'sv-SE' } },
  { id: 'sw-ta', text: 'ta', emoji: null, graphemes: ['t', 'a'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-ta', text: 'ta', lang: 'sv-SE' } },
  { id: 'sw-gå', text: 'gå', emoji: null, graphemes: ['g', 'å'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-gå', text: 'gå', lang: 'sv-SE' } },
  { id: 'sw-går', text: 'går', emoji: null, graphemes: ['g', 'å', 'r'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-går', text: 'går', lang: 'sv-SE' } },
  { id: 'sw-säger', text: 'säger', emoji: null, graphemes: ['s', 'ä', 'g', 'e', 'r'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-säger', text: 'säger', lang: 'sv-SE' } },
  { id: 'sw-sa', text: 'sa', emoji: null, graphemes: ['s', 'a'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-sa', text: 'sa', lang: 'sv-SE' } },
  { id: 'sw-hur', text: 'hur', emoji: null, graphemes: ['h', 'u', 'r'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-hur', text: 'hur', lang: 'sv-SE' } },
  { id: 'sw-vad', text: 'vad', emoji: null, graphemes: ['v', 'a', 'd'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-vad', text: 'vad', lang: 'sv-SE' } },
  { id: 'sw-vem', text: 'vem', emoji: null, graphemes: ['v', 'e', 'm'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-vem', text: 'vem', lang: 'sv-SE' } },
  { id: 'sw-varför', text: 'varför', emoji: null, graphemes: ['v', 'a', 'r', 'f', 'ö', 'r'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-varför', text: 'varför', lang: 'sv-SE' } },
  { id: 'sw-vilken', text: 'vilken', emoji: null, graphemes: ['v', 'i', 'l', 'k', 'e', 'n'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-vilken', text: 'vilken', lang: 'sv-SE' } },
  { id: 'sw-ja', text: 'ja', emoji: null, graphemes: ['j', 'a'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-ja', text: 'ja', lang: 'sv-SE' } },
  { id: 'sw-nej', text: 'nej', emoji: null, graphemes: ['n', 'e', 'j'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-nej', text: 'nej', lang: 'sv-SE' } },
  { id: 'sw-hej', text: 'hej', emoji: null, graphemes: ['h', 'e', 'j'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-hej', text: 'hej', lang: 'sv-SE' } },
  { id: 'sw-tack', text: 'tack', emoji: null, graphemes: ['t', 'a', 'ck'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-tack', text: 'tack', lang: 'sv-SE' } },
  { id: 'sw-hit', text: 'hit', emoji: null, graphemes: ['h', 'i', 't'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-hit', text: 'hit', lang: 'sv-SE' } },
  { id: 'sw-dit', text: 'dit', emoji: null, graphemes: ['d', 'i', 't'], step: 1, kind: 'sight', lang: 'sv-SE', say: { id: 'word-dit', text: 'dit', lang: 'sv-SE' } },
];
