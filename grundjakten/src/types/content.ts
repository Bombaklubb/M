import type { SpeechToken, Lang } from './speech';

export type SoundClass = 'vowel' | 'continuant' | 'plosive';

export interface LetterKeyword {
  word: string;
  emoji: string;
  /** "B som i boll" – det appen lutar sig mot för klusiler. */
  phrase: SpeechToken;
  /** Bara ordet: "boll". */
  wordOnly: SpeechToken;
}

export interface LetterFormation {
  /** SVG-path-strängar, en per drag, ritade i viewBox "0 0 100 100". */
  strokes: string[];
  /** Talad ledtråd per drag, t.ex. "uppifrån och ner". */
  cues: SpeechToken[];
}

export interface Letter {
  /** Gemenen. Stabilt id som används i lagringsnycklar. */
  id: string;
  upper: string;
  lower: string;
  /** 1–29. Inlärningsordning, INTE alfabetisk. */
  progression: number;
  /** 1–8. Vilket steg som introducerar bokstaven. */
  step: number;
  soundClass: SoundClass;

  /** Bokstavens NAMN. Chromes svenska röst klarar detta. Alltid satt. */
  name: SpeechToken;

  /**
   * Isolerat LJUD via TTS – så bra det går.
   *
   * - vokal/uthållbar konsonant: utsträckt sträng ('mmmmm', 'aaaa') i rate 0.55.
   *   Duger, och det är den ärliga majoriteten av alfabetet.
   * - klusil (b d g k p t): ALLTID null. Chrome kan inte producera ett isolerat
   *   /b/ – den lägger på ett schwa och säger "bö". Att skicka ut det vore att
   *   aktivt lära eleven fel, så vi vägrar. Klusiler lärs via nyckelordet.
   */
  sound: SpeechToken | null;

  /** Aldrig valfritt. Så lärs klusiler ut, och det förstärker resten. */
  keyword: LetterKeyword;

  formation: LetterFormation;
}

export interface WordEntry {
  id: string;
  /** Alltid gemener i datan. Renderas versalt/gement efter elevens inställning. */
  text: string;
  /** null = ingen bild. Generatorn hoppar då över bildberoende övningar. */
  emoji: string | null;
  /** Segmentering för brickor och ljudning. Digrafer hålls ihop: ['sk','o','g']. */
  graphemes: string[];
  /** Lägsta steg där alla grafem är kända. Härlett ur PROGRESSION_STEPS. */
  step: number;
  kind: 'decodable' | 'sight';
  lang: Lang;
  say: SpeechToken;
}
