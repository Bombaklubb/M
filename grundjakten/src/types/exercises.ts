import type { SpeechToken } from './speech';
import type { MicroText } from './theme';

export type ModuleId = 'bokstaver' | 'skriva' | 'tema' | 'uppdrag';

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
  /**
   * Namnet på uppdragssteget, t.ex. "Läs ordet".
   *
   * Medvetet ett NAMN och inte "steg 3 av 5": en missad uppgift läggs tillbaka
   * i kön, så positionen stämmer inte längre – men vad uppgiften går ut på
   * stämmer alltid.
   */
  label?: string;
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

export interface ListenPickPictureEx extends Base {
  kind: 'listen-pick-picture';
  choices: Choice[];
}

export interface WordPicturePairEx extends Base {
  kind: 'word-picture-pair';
  pairs: { id: string; word: string; emoji: string; say: SpeechToken }[];
}

export interface MicroTextEx extends Base {
  kind: 'micro-text';
  text: MicroText;
  themeId: string;
}

/**
 * Läs meningen.
 *
 * Bedöms inte – precis som letter-formation. Eleven trycker på varje ord för
 * att höra det, och går vidare när hon är klar. Att sätta ett rätt/fel på
 * "har du läst?" vore meningslöst, och att kräva ett korrekt svar här skulle
 * blockera nästa uppdrag som faktiskt bygger på meningen.
 */
export interface ReadSentenceEx extends Base {
  kind: 'read-sentence';
  /** Orden var för sig, så eleven kan trycka på ett i taget. */
  words: string[];
  /** Hela meningen som en talad enhet. */
  whole: SpeechToken;
  /** Per ord, för tryck-och-lyssna. */
  wordTokens: SpeechToken[];
  /** Läses upp automatiskt direkt (för elever som ännu inte avkodar). */
  autoRead: boolean;
}

/** Svara på en fråga om meningen eleven just läste. Meningen står kvar. */
export interface SentenceQuestionEx extends Base {
  kind: 'sentence-question';
  sentence: string;
  choices: Choice[];
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
  | ListenPickPictureEx
  | WordPicturePairEx
  | MicroTextEx
  | ReadSentenceEx
  | SentenceQuestionEx
  | BuildSentenceCardsEx;

export type ExerciseKind = Exercise['kind'];
