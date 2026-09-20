import type { KistTyp, Progress } from '@/types';

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
};

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
];

export const XP_MILSTOLPAR: { xp: number; typ: KistTyp }[] = [
  { xp: 250, typ: 'silver' },
  { xp: 700, typ: 'guld' },
  { xp: 1350, typ: 'guld' },
  { xp: 2700, typ: 'guld' },
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

export const UTMARKELSER: Utmarkelse[] = [
  {
    id: 'forsta-passet',
    emoji: '🌱',
    namn: 'Första passet',
    krav: 'Gör ditt första pass.',
    uppfyllt: (p) => p.sessions.length >= 1,
  },
  {
    id: 'tio-pass',
    emoji: '🔥',
    namn: 'Tio pass',
    krav: 'Gör tio pass.',
    uppfyllt: (p) => p.sessions.length >= 10,
  },
  {
    id: 'femtio-pass',
    emoji: '🏅',
    namn: 'Femtio pass',
    krav: 'Gör femtio pass.',
    uppfyllt: (p) => p.sessions.length >= 50,
  },
  {
    id: 'forsta-bokstaven',
    emoji: '🔤',
    namn: 'Första bokstaven',
    krav: 'Lär dig din första bokstav.',
    uppfyllt: (p) => bemastrade(p) >= 1,
  },
  {
    id: 'forsta-stationen',
    emoji: '☀️',
    namn: 'Första stationen',
    krav: 'Lär dig alla sex bokstäverna på station ett.',
    uppfyllt: (p) => bemastrade(p) >= 6,
  },
  {
    id: 'halva-alfabetet',
    emoji: '📖',
    namn: 'Halva alfabetet',
    krav: 'Lär dig femton bokstäver.',
    uppfyllt: (p) => bemastrade(p) >= 15,
  },
  {
    id: 'hela-alfabetet',
    emoji: '👑',
    namn: 'Hela alfabetet',
    krav: 'Lär dig alla tjugonio bokstäverna.',
    uppfyllt: (p) => bemastrade(p) >= 29,
  },
  {
    id: 'tio-ovningar',
    emoji: '📚',
    namn: 'Tio övningar',
    krav: 'Klara tio olika övningar.',
    uppfyllt: (p) => Object.keys(p.tasks).length >= 10,
  },
  {
    id: 'allt-ratt',
    emoji: '🎯',
    namn: 'Allt rätt',
    krav: 'Klara en övning helt utan fel.',
    uppfyllt: (p) =>
      Object.values(p.tasks).some((t) => t.antal > 0 && t.basta === t.antal),
  },
  {
    id: 'skrivaren',
    emoji: '✍️',
    namn: 'Skrivaren',
    krav: 'Gör fem pass i Skriva.',
    uppfyllt: (p) => passMed(p, 'skriva') >= 5,
  },
  {
    id: 'tre-dagar',
    emoji: '📅',
    namn: 'Tre dagar i rad',
    krav: 'Spela tre dagar i rad.',
    uppfyllt: (p) => p.streak >= 3,
  },
  {
    id: 'en-vecka',
    emoji: '🗓️',
    namn: 'En vecka i rad',
    krav: 'Spela sju dagar i rad.',
    uppfyllt: (p) => p.streak >= 7,
  },
];

export function utmarkelseById(id: string): Utmarkelse | undefined {
  return UTMARKELSER.find((u) => u.id === id);
}
