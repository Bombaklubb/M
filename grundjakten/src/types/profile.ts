import type { ModuleId } from './exercises';

/** Vad läraren faktiskt ställer in. Styr vilka övningstyper som dyker upp. */
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
  /** 1–8. Höjs automatiskt vid bemästring; läraren kan låsa. */
  progressionStep: number;
  stepLockedByTeacher: boolean;
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

export interface Progress {
  xp: number;
  /** Kosmetisk nivå 1–10, styr rangmärket. */
  level: number;
  chests: number;
  badges: string[];
  streak: number;
  lastPlayedDate: string;
  letters: Record<string, ItemMastery>;
  words: Record<string, ItemMastery>;
  themeWords: Record<string, ItemMastery>;
  /** Kapas till 200 poster, äldst först. */
  sessions: SessionLog[];

  /**
   * Hur långt eleven kommit i berättelsen om Leo och nyckeln.
   * Index i STORY_BEATS. Höjs med ett per dag som ett uppdrag klaras.
   */
  missionBeat: number;
  /** Datumet då dagens uppdrag senast klarades, svensk lokaltid. */
  lastMissionDate: string;
  missionsDone: number;
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
    chests: 0,
    badges: [],
    streak: 0,
    lastPlayedDate: '',
    letters: {},
    words: {},
    themeWords: {},
    sessions: [],
    missionBeat: 0,
    lastMissionDate: '',
    missionsDone: 0,
  };
}
