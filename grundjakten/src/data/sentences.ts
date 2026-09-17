/**
 * Meningsmallar för Dagens uppdrag.
 *
 * Meningarna GENERERAS i stället för att skrivas för hand. Sex mallar och tre
 * ordbanker ger hundratals varianter, så uppdragen kan köras varje dag i en
 * hel termin utan att upprepa sig – och utan att någon behöver författa dem.
 *
 * Två regler som måste hålla, annars lär appen ut fel svenska:
 *  - Varje sak och djur bär sitt genus (`en`/`ett`). Att gissa blir "en äpple".
 *  - Platserna lagras i bestämd form ("skolan"), eftersom mallarna alltid
 *    säger "till skolan" / "i skogen". Då behöver ingen böjning ske i koden.
 */

export interface BankWord {
  text: string;
  emoji: string;
}

export interface NounWord extends BankWord {
  article: 'en' | 'ett';
}

/** Bestämd form – mallarna sätter alltid "till" eller "i" framför. */
export const PLACES: BankWord[] = [
  { text: 'skolan', emoji: '🏫' },
  { text: 'skogen', emoji: '🌲' },
  { text: 'affären', emoji: '🏪' },
  { text: 'stranden', emoji: '🏖️' },
  { text: 'parken', emoji: '🌳' },
  { text: 'huset', emoji: '🏠' },
  { text: 'köket', emoji: '🍳' },
  { text: 'sjön', emoji: '🏞️' },
];

export const THINGS: NounWord[] = [
  { text: 'boll', article: 'en', emoji: '⚽' },
  { text: 'bok', article: 'en', emoji: '📕' },
  { text: 'nyckel', article: 'en', emoji: '🔑' },
  { text: 'väska', article: 'en', emoji: '🎒' },
  { text: 'cykel', article: 'en', emoji: '🚲' },
  { text: 'penna', article: 'en', emoji: '✏️' },
  { text: 'äpple', article: 'ett', emoji: '🍎' },
  { text: 'brev', article: 'ett', emoji: '✉️' },
  { text: 'glas', article: 'ett', emoji: '🥛' },
];

export const ANIMALS: NounWord[] = [
  { text: 'hund', article: 'en', emoji: '🐕' },
  { text: 'katt', article: 'en', emoji: '🐈' },
  { text: 'fågel', article: 'en', emoji: '🐦' },
  { text: 'häst', article: 'en', emoji: '🐎' },
  { text: 'räv', article: 'en', emoji: '🦊' },
  { text: 'mus', article: 'en', emoji: '🐭' },
  { text: 'får', article: 'ett', emoji: '🐑' },
  { text: 'lejon', article: 'ett', emoji: '🦁' },
];

export type BankId = 'place' | 'thing' | 'animal';

export interface SentenceTemplate {
  id: string;
  /**
   * Meningen som delar. `{place}`, `{thing}` och `{animal}` fylls i.
   * En sak eller ett djur drar med sig sin artikel automatiskt.
   */
  parts: string[];
  question: string;
  /** Vilken bank det rätta svaret hämtas ur. */
  askBank: BankId;
}

/**
 * Frågorna är skrivna så att svaret ALDRIG behöver böjas om.
 * "Vad ser Leo?" fungerar oavsett vilket djur som fylldes i; en fråga som
 * "Var hittar Leo bollen?" hade krävt bestämd form och blivit fel för hälften
 * av orden.
 */
export const SENTENCE_TEMPLATES: SentenceTemplate[] = [
  { id: 's1', parts: ['Leo', 'går', 'till', '{place}'], question: 'Vart går Leo?', askBank: 'place' },
  { id: 's2', parts: ['Leo', 'har', '{thing}'], question: 'Vad har Leo?', askBank: 'thing' },
  { id: 's3', parts: ['Leo', 'ser', '{animal}'], question: 'Vad ser Leo?', askBank: 'animal' },
  { id: 's4', parts: ['Leo', 'springer', 'till', '{place}'], question: 'Vart springer Leo?', askBank: 'place' },
  { id: 's5', parts: ['Leo', 'leker', 'med', '{thing}'], question: 'Vad leker Leo med?', askBank: 'thing' },
  { id: 's6', parts: ['{animal}', 'sover', 'i', '{place}'], question: 'Var sover djuret?', askBank: 'place' },
];
