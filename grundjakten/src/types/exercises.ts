import type { SpeechToken } from './speech';
import type { MicroText } from './theme';

export type ModuleId = 'bokstaver' | 'skriva' | 'tema';

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
  | MicroTextEx;

export type ExerciseKind = Exercise['kind'];
