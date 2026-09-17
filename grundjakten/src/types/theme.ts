import type { SpeechToken, Lang } from './speech';
import type { Choice } from './exercises';

export interface ThemeWord {
  id: string;
  text: string;
  /** null tillåts BARA i egna teman; färdiga teman har alltid emoji. */
  emoji: string | null;
  graphemes: string[];
  lang: Lang;
  say: SpeechToken;
}

export interface MicroTextQuestion {
  id: string;
  ask: SpeechToken;
  /** 2–3 alternativ, bildbaserade där det går. */
  choices: Choice[];
}

export interface MicroText {
  id: string;
  /** 3–5 mycket korta meningar. Visas stort, men läsning krävs aldrig. */
  sentences: string[];
  say: SpeechToken;
  questions: MicroTextQuestion[];
}

export interface Theme {
  id: string;
  title: string;
  subject: 'NO' | 'SO' | 'engelska';
  icon: string;
  lang: Lang;
  origin: 'curated' | 'custom';
  /** 6–10 ord. */
  words: ThemeWord[];
  /** Färdiga teman: 2–3. Egna teman: 0 eller 1 (lärarskriven). */
  microTexts: MicroText[];
  createdAt?: string;
}
