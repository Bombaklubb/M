import type { SpeechToken } from './speech';

export type ModuleId = 'bokstaver' | 'skriva' | 'ovningsbank';

/**
 * Varje svarsalternativ går att lyssna på. Det är en hård invariant –
 * en elev som inte kan läsa måste kunna höra vad alternativen är.
 */
export interface Choice {
  id: string;
  letter?: string;
  word?: string;
  emoji?: string;
  say: SpeechToken;
  correct: boolean;
}

interface Base {
  id: string;
  module: ModuleId;
  /** Talad instruktion. Spelas en gång automatiskt, upprepas av öron-knappen. */
  prompt: SpeechToken;
  /** Det stora öronknappen spelar om. Oftast själva uppgiften, inte instruktionen. */
  replay: SpeechToken;
  xp: number;
}

export interface LetterSoundMatchEx extends Base {
  kind: 'letter-sound-match';
  letterId: string;
  choices: Choice[];
}

export interface LetterPictureMatchEx extends Base {
  kind: 'letter-picture-match';
  letterId: string;
  choices: Choice[];
}

export interface FirstSoundSortEx extends Base {
  kind: 'first-sound-sort';
  items: { id: string; emoji: string; word: string; say: SpeechToken; bucketId: string }[];
  buckets: { id: string; letter: string; say: SpeechToken }[];
}

export interface BlendWordEx extends Base {
  kind: 'blend-word';
  wordId: string;
  /** Ett token per grafem, spelas i följd, sedan hela ordet. */
  parts: SpeechToken[];
  choices: Choice[];
}

export interface ReadWordPickPictureEx extends Base {
  kind: 'read-word-pick-picture';
  wordId: string;
  /** Visas – men sägs INTE förrän eleven svarat. Det är hela poängen. */
  shownWord: string;
  choices: Choice[];
}

export interface SightWordPickEx extends Base {
  kind: 'sight-word-pick';
  wordId: string;
  choices: Choice[];
}

export interface TypeTheLetterEx extends Base {
  kind: 'type-the-letter';
  letterId: string;
  /** Godtagna tangenttryck, gemener + versaler. Inkluderar å/ä/ö. */
  accepts: string[];
  /** Bokstäver som visas på skärmtangentbordet. */
  keyboardLetters: string[];
}

export interface BuildWordTilesEx extends Base {
  kind: 'build-word-tiles';
  wordId: string;
  target: string[];
  /** target + 2–3 distraktorer, blandade. */
  tiles: string[];
  emoji: string | null;
}

export interface LetterFormationEx extends Base {
  kind: 'letter-formation';
  letterId: string;
  /** Att spåra själv krävs aldrig för att gå vidare. */
  traceOptional: true;
}

export interface WordPicturePairEx extends Base {
  kind: 'word-picture-pair';
  pairs: { id: string; word: string; emoji: string; say: SpeechToken }[];
}

/**
 * Bygg meningen av ordkort.
 *
 * Det här är hela skrivspåret i v1. Fri text går inte att rätta automatiskt,
 * men en mening byggd av kort går: appen kan kontrollera ordföljd, att första
 * ordet har stor bokstav och att punkten hamnar sist.
 */
export interface BuildSentenceCardsEx extends Base {
  kind: 'build-sentence-cards';
  /** Rätt ordning, inklusive punkten som eget kort sist. */
  target: string[];
  /** target + 1–2 distraktorer, blandade. */
  cards: string[];
  /** Bilden meningen handlar om, som stöd. */
  emoji: string | null;
}

/**
 * Generell flervalsövning.
 *
 * Den här enda typen bär huvuddelen av övningsbanken: välj rätt stavning,
 * en/ett, den/det, motsatsord, synonymer, ordklasser, skiljetecken, vokal
 * eller konsonant, nästa bokstav, vilket ord rimmar inte, och så vidare.
 * Det som skiljer dem åt är vad som visas ovanför alternativen och vilken
 * ordbank frågorna byggs ur – inte mekaniken.
 */
export interface QuizEx extends Base {
  kind: 'quiz';
  /** Visas ovanför alternativen. Allt är valfritt. */
  shown?: {
    letter?: string;
    word?: string;
    sentence?: string;
    emoji?: string;
  };
  choices: Choice[];
  /** Två alternativ läggs bredvid varandra, tre eller fler i rutnät. */
  compact?: boolean;
}

/**
 * Skriv ordet.
 *
 * Eleven hör ordet (och ser ofta en bild) och skriver det på tangentbordet.
 * Täcker alla "Skriv ordet"-uppgifter i banken, inklusive siffrorna.
 *
 * Till skillnad från build-word-tiles finns inga brickor att luta sig mot –
 * det här är riktig stavning, och ligger därför senare i progressionen.
 */
export interface TypeTheWordEx extends Base {
  kind: 'type-the-word';
  answer: string;
  /** Godtagna svar i gemener, t.ex. både "5" och "fem". */
  accept: string[];
  emoji?: string;
  /** Meningen ordet saknas i, för "skriv det saknade ordet". */
  sentence?: string;
  /** Sifferknappar i stället för bokstäver. */
  digits?: boolean;
}

/**
 * Lägg i rätt ordning.
 *
 * Alfabetisk ordning, veckodagar, månader. Eleven klickar objekten i tur och
 * ordning – samma tryck-för-att-placera som ordkorten, av samma skäl: drag
 * på en Chromebook-styrplatta är ett finmotoriktest.
 */
export interface OrderItemsEx extends Base {
  kind: 'order-items';
  /** Rätt ordning. */
  target: string[];
  /** Blandade, som de visas. */
  items: string[];
}

export type Exercise =
  | LetterSoundMatchEx
  | LetterPictureMatchEx
  | FirstSoundSortEx
  | BlendWordEx
  | ReadWordPickPictureEx
  | SightWordPickEx
  | TypeTheLetterEx
  | BuildWordTilesEx
  | LetterFormationEx
  | WordPicturePairEx
  | BuildSentenceCardsEx
  | QuizEx
  | TypeTheWordEx
  | OrderItemsEx;

export type ExerciseKind = Exercise['kind'];
