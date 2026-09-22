import type { KistTyp, Progress } from '@/types';
import { tasksForNiva } from './tasks';
import { LETTERS } from './letters';

/**
 * Kistor och utmärkelser.
 *
 * Modellen är Svenskajaktens, men kraven är Grundjaktens egna: de räknas på
 * sådant appen faktiskt mäter – avklarade pass, bemästrade bokstäver, klarade
 * uppgifter i banken och dagar i rad.
 *
 * Regeln ligger som en funktion bredvid sin egen beskrivning. Skrevs de på två
 * ställen skulle texten och villkoret kunna glida isär, och då skulle eleven
 * se ett krav hon redan uppfyllt stå kvarlåst.
 */

export const KIST_META: Record<
  KistTyp,
  { namn: string; emoji: string; tint: string; xpMin: number; xpMax: number }
> = {
  tra: {
    namn: 'Träkista',
    emoji: '📦',
    tint: 'bg-amberx-600 border-amberx-700',
    xpMin: 10,
    xpMax: 25,
  },
  silver: {
    namn: 'Silverkista',
    emoji: '🪙',
    tint: 'bg-ink-400 border-ink-600',
    xpMin: 30,
    xpMax: 60,
  },
  guld: {
    namn: 'Guldkista',
    emoji: '🏆',
    tint: 'bg-amberx-400 border-amberx-600',
    xpMin: 80,
    xpMax: 150,
  },
  // De fyra sällsynta. En elev som gör ett pass om dagen ser smaragden
  // efter ett halvår och den hemliga kistan knappast alls – och det är
  // meningen. En belöning som kommer ofta slutar vara en belöning.
  smaragd: {
    namn: 'Smaragdkista',
    emoji: '💚',
    tint: 'bg-lime-600 border-lime-700',
    xpMin: 200,
    xpMax: 350,
  },
  rubin: {
    namn: 'Rubinkista',
    emoji: '❤️',
    tint: 'bg-red-500 border-red-700',
    xpMin: 350,
    xpMax: 550,
  },
  diamant: {
    namn: 'Diamantkista',
    emoji: '💎',
    tint: 'bg-aqua-500 border-aqua-700',
    xpMin: 550,
    xpMax: 800,
  },
  hemlig: {
    namn: 'Hemliga kistan',
    emoji: '✨',
    tint: 'bg-brand-600 border-brand-800',
    xpMin: 900,
    xpMax: 1400,
  },
};

/**
 * Hur ofta en träkista dyker upp.
 *
 * Varje pass gav förut en kista. Läraren rapporterade att det blev för många
 * och för enkelt – en belöning som kommer varje gång slutar vara en
 * belöning, den blir en kvittens.
 *
 * Mellanrummen är ojämna med flit: 3, 6, 4, 7, 5 pass och sedan om igen.
 * Jämna mellanrum går att räkna ut, och då är överraskningen borta. Aldrig
 * tätare än vart tredje pass, aldrig glesare än vart sjunde.
 *
 * Följden är deterministisk, inte slumpad. En elev som laddar om sidan ska
 * inte kunna få en kista till på samma pass.
 */
const TRA_MELLANRUM = [3, 6, 4, 7, 5];
const TRA_CYKEL = TRA_MELLANRUM.reduce((a, b) => a + b, 0);
const TRA_TRAFFAR = TRA_MELLANRUM.reduce<number[]>(
  (acc, gap) => [...acc, (acc[acc.length - 1] ?? 0) + gap],
  []
);

/** Ger pass nummer `n` (1-baserat) en träkista? */
export function traKistaEfterPass(n: number): boolean {
  if (n <= 0) return false;
  const iCykeln = ((n - 1) % TRA_CYKEL) + 1;
  return TRA_TRAFFAR.includes(iCykeln);
}

/**
 * Milstolpar utöver kistan varje pass ger.
 *
 * Varje pass ger en träkista – täta små framgångar för en elev som behöver
 * dem. Silver och guld är det hon jobbar mot, och de kommer sällan nog att
 * vara en händelse.
 */
export const PASS_MILSTOLPAR: { pass: number; typ: KistTyp }[] = [
  { pass: 5, typ: 'silver' },
  { pass: 10, typ: 'silver' },
  { pass: 15, typ: 'guld' },
  { pass: 25, typ: 'silver' },
  { pass: 40, typ: 'guld' },
  { pass: 60, typ: 'guld' },
  { pass: 100, typ: 'guld' },
  { pass: 150, typ: 'smaragd' },
  { pass: 200, typ: 'rubin' },
  { pass: 300, typ: 'diamant' },
  { pass: 500, typ: 'hemlig' },
];

export const XP_MILSTOLPAR: { xp: number; typ: KistTyp }[] = [
  { xp: 250, typ: 'silver' },
  { xp: 700, typ: 'guld' },
  { xp: 1350, typ: 'guld' },
  { xp: 2700, typ: 'guld' },
  { xp: 4500, typ: 'smaragd' },
  { xp: 7000, typ: 'rubin' },
  { xp: 10000, typ: 'diamant' },
  { xp: 15000, typ: 'hemlig' },
];

export interface Utmarkelse {
  id: string;
  emoji: string;
  namn: string;
  /** Vad som krävs. Läses upp av örat, så det är skrivet för att sägas. */
  krav: string;
  uppfyllt: (p: Progress) => boolean;
}

const bemastrade = (p: Progress) =>
  Object.values(p.letters).filter((m) => m.mastered).length;

const passMed = (p: Progress, modul: string) =>
  p.sessions.filter((s) => s.module === modul).length;

const klarade = (p: Progress) => Object.keys(p.tasks).length;

const perfekta = (p: Progress) =>
  Object.values(p.tasks).filter((t) => t.antal > 0 && t.basta === t.antal).length;

const oppnadeKistor = (p: Progress) => p.kistor.filter((k) => k.oppnad).length;

/** Alla nio vokaler bemästrade. Vokalerna bär varje ord – de är nyckeln. */
const allaVokaler = (p: Progress) =>
  LETTERS.filter((l) => l.soundClass === 'vowel').every((l) => p.letters[l.id]?.mastered);

const nivaKlar = (p: Progress, niva: 1 | 2 | 3 | 4) =>
  tasksForNiva(niva).every((t) => p.tasks[t.id]);

/**
 * Trettio utmärkelser.
 *
 * Bredden är avsiktlig: det ska alltid finnas något inom räckhåll. En elev
 * som ligger på åk 1-nivå i åk 4 får sällan höra att hon klarat något, och
 * en låst lista där allt är långt borta är ingen morot alls. Därför ligger
 * flera av trösklarna tätt i början.
 */
export const UTMARKELSER: Utmarkelse[] = [
  // ── Pass ──
  { id: 'forsta-passet', emoji: '🌱', namn: 'Första passet',
    krav: 'Gör ditt första pass.', uppfyllt: (p) => p.sessions.length >= 1 },
  { id: 'fem-pass', emoji: '🌿', namn: 'Fem pass',
    krav: 'Gör fem pass.', uppfyllt: (p) => p.sessions.length >= 5 },
  { id: 'tio-pass', emoji: '🔥', namn: 'Tio pass',
    krav: 'Gör tio pass.', uppfyllt: (p) => p.sessions.length >= 10 },
  { id: 'tjugofem-pass', emoji: '⚡', namn: 'Tjugofem pass',
    krav: 'Gör tjugofem pass.', uppfyllt: (p) => p.sessions.length >= 25 },
  { id: 'femtio-pass', emoji: '🏅', namn: 'Femtio pass',
    krav: 'Gör femtio pass.', uppfyllt: (p) => p.sessions.length >= 50 },
  { id: 'hundra-pass', emoji: '💯', namn: 'Hundra pass',
    krav: 'Gör hundra pass.', uppfyllt: (p) => p.sessions.length >= 100 },

  // ── Bokstäver ──
  { id: 'forsta-bokstaven', emoji: '🔤', namn: 'Första bokstaven',
    krav: 'Lär dig din första bokstav.', uppfyllt: (p) => bemastrade(p) >= 1 },
  { id: 'tre-bokstaver', emoji: '🧩', namn: 'Tre bokstäver',
    krav: 'Lär dig tre bokstäver.', uppfyllt: (p) => bemastrade(p) >= 3 },
  { id: 'forsta-stationen', emoji: '☀️', namn: 'Första stationen',
    krav: 'Lär dig alla sex bokstäverna på station ett.',
    uppfyllt: (p) => bemastrade(p) >= 6 },
  { id: 'tio-bokstaver', emoji: '🔟', namn: 'Tio bokstäver',
    krav: 'Lär dig tio bokstäver.', uppfyllt: (p) => bemastrade(p) >= 10 },
  { id: 'halva-alfabetet', emoji: '📖', namn: 'Halva alfabetet',
    krav: 'Lär dig femton bokstäver.', uppfyllt: (p) => bemastrade(p) >= 15 },
  { id: 'tjugotva-bokstaver', emoji: '🗝️', namn: 'Tjugotvå bokstäver',
    krav: 'Lär dig tjugotvå bokstäver.', uppfyllt: (p) => bemastrade(p) >= 22 },
  { id: 'hela-alfabetet', emoji: '👑', namn: 'Hela alfabetet',
    krav: 'Lär dig alla tjugonio bokstäverna.', uppfyllt: (p) => bemastrade(p) >= 29 },
  { id: 'alla-vokaler', emoji: '🎵', namn: 'Alla vokaler',
    krav: 'Lär dig alla nio vokaler.', uppfyllt: allaVokaler },

  // ── Övningar ──
  { id: 'forsta-ovningen', emoji: '📗', namn: 'Första övningen',
    krav: 'Klara din första övning.', uppfyllt: (p) => klarade(p) >= 1 },
  { id: 'fem-ovningar', emoji: '📘', namn: 'Fem övningar',
    krav: 'Klara fem olika övningar.', uppfyllt: (p) => klarade(p) >= 5 },
  { id: 'tio-ovningar', emoji: '📚', namn: 'Tio övningar',
    krav: 'Klara tio olika övningar.', uppfyllt: (p) => klarade(p) >= 10 },
  { id: 'tjugofem-ovningar', emoji: '🗂️', namn: 'Tjugofem övningar',
    krav: 'Klara tjugofem olika övningar.', uppfyllt: (p) => klarade(p) >= 25 },
  { id: 'femtio-ovningar', emoji: '🎓', namn: 'Femtio övningar',
    krav: 'Klara femtio olika övningar.', uppfyllt: (p) => klarade(p) >= 50 },
  { id: 'svenska-1-klar', emoji: '🥇', namn: 'Svenska 1 klar',
    krav: 'Klara alla övningar i Svenska 1.', uppfyllt: (p) => nivaKlar(p, 1) },

  // ── Träffsäkerhet ──
  { id: 'allt-ratt', emoji: '🎯', namn: 'Allt rätt',
    krav: 'Klara en övning helt utan fel.', uppfyllt: (p) => perfekta(p) >= 1 },
  { id: 'fem-perfekta', emoji: '💎', namn: 'Fem gånger allt rätt',
    krav: 'Klara fem övningar helt utan fel.', uppfyllt: (p) => perfekta(p) >= 5 },

  // ── Moduler ──
  { id: 'skrivaren', emoji: '✍️', namn: 'Skrivaren',
    krav: 'Gör fem pass i Skriva.', uppfyllt: (p) => passMed(p, 'skriva') >= 5 },
  { id: 'bokstavsjagaren', emoji: '🔎', namn: 'Bokstavsjägaren',
    krav: 'Gör tio pass i Bokstäver.', uppfyllt: (p) => passMed(p, 'bokstaver') >= 10 },
  { id: 'banksamlaren', emoji: '🦊', namn: 'Banksamlaren',
    krav: 'Gör tjugo pass i Övningar.', uppfyllt: (p) => passMed(p, 'ovningsbank') >= 20 },

  // ── Uthållighet och samlande ──
  { id: 'tre-dagar', emoji: '📅', namn: 'Tre dagar i rad',
    krav: 'Spela tre dagar i rad.', uppfyllt: (p) => p.streak >= 3 },
  { id: 'en-vecka', emoji: '🗓️', namn: 'En vecka i rad',
    krav: 'Spela sju dagar i rad.', uppfyllt: (p) => p.streak >= 7 },
  { id: 'tva-veckor', emoji: '🌠', namn: 'Två veckor i rad',
    krav: 'Spela fjorton dagar i rad.', uppfyllt: (p) => p.streak >= 14 },
  { id: 'kistoppnaren', emoji: '🎁', namn: 'Kistöppnaren',
    krav: 'Öppna tio kistor.', uppfyllt: (p) => oppnadeKistor(p) >= 10 },
  { id: 'niva-fem', emoji: '🚀', namn: 'Nivå fem',
    krav: 'Nå nivå fem.', uppfyllt: (p) => p.level >= 5 },
];

export function utmarkelseById(id: string): Utmarkelse | undefined {
  return UTMARKELSER.find((u) => u.id === id);
}
