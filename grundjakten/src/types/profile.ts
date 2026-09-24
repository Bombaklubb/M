import type { ModuleId } from './exercises';

/**
 * Styr vilka övningstyper som dyker upp.
 *
 * Höjs automatiskt när eleven bemästrar bokstäver (se shouldAdvanceLevel i
 * lib/progress.ts) och sänks aldrig. Tidigare satte läraren bandet för hand i
 * lärarläget; med det borta måste appen sköta det själv, annars skulle varje
 * elev stå kvar på band 1 för alltid och aldrig nå ljudning eller ordläsning.
 */
export type LevelBand = 1 | 2 | 3 | 4;

export const LEVEL_BANDS: { band: LevelBand; title: string; desc: string }[] = [
  { band: 1, title: 'Bokstavsljud', desc: 'Känna igen bokstäver och deras ljud. Lyssna och peka.' },
  { band: 2, title: 'Ljuda ihop', desc: 'Höra första ljudet och ljuda ihop korta ord.' },
  { band: 3, title: 'Korta ord', desc: 'Läsa korta ord själv och känna igen vanliga ordbilder.' },
  { band: 4, title: 'Ord och mening', desc: 'Lyssna på korta texter och svara på frågor.' },
];

export interface ProfileSettings {
  speechRate: 0.6 | 0.8 | 1.0;
  dyslexicFont: boolean;
  autoSpeakPrompts: boolean;
  /** Visa VERSALER före gemener. */
  uppercaseFirst: boolean;
}

export interface StudentProfile {
  name: string;
  /** Emoji, vald vid inloggning. */
  avatar: string;
  createdAt: string;
  level: LevelBand;
  /** 1–8. Höjs automatiskt vid bemästring. */
  progressionStep: number;
  settings: ProfileSettings;
}

export interface ItemMastery {
  seen: number;
  correct: number;
  /** Rätt på första försöket i rad. >= 3 => bemästrad. */
  streak: number;
  mastered: boolean;
  lastSeen: string;
}

export interface SessionLog {
  /** YYYY-MM-DD, svensk lokaltid. */
  date: string;
  module: ModuleId;
  items: number;
  /** Bara för lärarvyn. Visas ALDRIG för eleven. */
  firstTryCorrect: number;
  seconds: number;
}

/**
 * Elevens resultat på en namngiven uppgift i övningsbanken.
 *
 * `basta` är bästa antal rätt på FÖRSTA försöket, inte senaste. En elev som
 * haft en dålig dag ska inte se sitt bästa resultat försvinna.
 */
export interface TaskResult {
  gjord: number;
  basta: number;
  antal: number;
  senast: string;
}

export type KistTyp =
  | 'tra'
  | 'silver'
  | 'guld'
  | 'smaragd'
  | 'rubin'
  | 'diamant'
  | 'hemlig';

/**
 * En kista eleven tjänat men kanske inte öppnat än.
 *
 * Ersätter den gamla räknaren `chests: number`, som bara räknade uppåt och
 * aldrig gick att göra något med. Poängen med en kista är att öppna den.
 */
export interface Kista {
  id: string;
  typ: KistTyp;
  oppnad: boolean;
  /** Vad den gav, satt när den öppnas. */
  xp?: number;
  utmarkelse?: string;
}

export interface Progress {
  xp: number;
  /** Kosmetisk nivå 1–10, styr rangmärket. */
  level: number;
  kistor: Kista[];
  /** Milstolpar som redan gett kista, så inget delas ut två gånger. */
  utdelade: string[];
  badges: string[];
  streak: number;
  lastPlayedDate: string;
  letters: Record<string, ItemMastery>;
  words: Record<string, ItemMastery>;
  /** Kapas till 200 poster, äldst först. */
  sessions: SessionLog[];
  /** Resultat per uppgift i övningsbanken, nyckel = uppgiftens id. */
  tasks: Record<string, TaskResult>;

  /**
   * Affären.
   *
   * `xp` rörs ALDRIG av ett köp. Den är elevens livstidssumma och styr både
   * nivåbandet och kistmilstolparna, och husregeln är att nivån aldrig sänks.
   * Drog ett köp från xp skulle eleven kunna tappa en nivå genom att handla,
   * och en redan utdelad kista skulle kunna delas ut igen.
   *
   * Det som går att spendera är därför xp MINUS `spenderat`. Se
   * `attSpendera()` i lib/affar.ts.
   */
  spenderat: number;
  /** Id:n ur data/affar.ts som eleven köpt. */
  kopta: string[];
  /** Vald ram respektive tema, eller null för appens standardutseende. */
  valdRam: string | null;
  valdTema: string | null;
}

export const DEFAULT_SETTINGS: ProfileSettings = {
  speechRate: 0.8,
  dyslexicFont: false,
  autoSpeakPrompts: true,
  uppercaseFirst: true,
};

export function emptyProgress(): Progress {
  return {
    xp: 0,
    level: 1,
    spenderat: 0,
    kopta: [],
    valdRam: null,
    valdTema: null,
    kistor: [],
    utdelade: [],
    badges: [],
    streak: 0,
    lastPlayedDate: '',
    letters: {},
    words: {},
    sessions: [],
    tasks: {},
  };
}
