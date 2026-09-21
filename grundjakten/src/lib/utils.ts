import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Samma XP-trappa som syskonapparna, så en elev som också spelar
 *  Mattejakten känner igen stegen. */
export const LEVEL_THRESHOLDS = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700];

export function xpToLevel(xp: number): number {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
  }
  return Math.min(level, 10);
}

export function xpForNextLevel(xp: number): { current: number; next: number; pct: number } {
  const level = xpToLevel(xp);
  if (level >= 10) return { current: xp, next: xp, pct: 100 };
  const floor = LEVEL_THRESHOLDS[level - 1];
  const ceil = LEVEL_THRESHOLDS[level];
  return { current: xp - floor, next: ceil - floor, pct: ((xp - floor) / (ceil - floor)) * 100 };
}

export const LEVEL_TITLES = [
  'Spårare', 'Upptäckare', 'Ordjägare', 'Ljudmästare', 'Bokstavsriddare',
  'Lässpanare', 'Ordsmed', 'Teckentydare', 'Skriftmästare', 'Grundmästaren',
];

export function getLevelTitle(level: number): string {
  return LEVEL_TITLES[Math.min(Math.max(level, 1), 10) - 1];
}

/**
 * Dagens datum i svensk lokaltid.
 * toISOString() vore fel här – det är UTC, så ett pass klockan 22 på kvällen
 * skulle räknas som gårdagens och bryta elevens streak.
 */
export function todayStamp(): string {
  return new Date().toLocaleDateString('sv-SE');
}

/**
 * Stor begynnelsebokstav på ett ord som står för sig själv.
 *
 * Ordbankerna är skrivna med gemener, så ordkorten visade "bok" och "boll".
 * Ett ord som står ensamt på ett kort ska börja med versal, precis som ett
 * ord först i en mening – annars lär sig eleven fel av det hon ser mest.
 *
 * Gäller BARA på visningen. Jämförelserna i övningarna kör vidare på
 * ordbankernas egna värden, så en stor bokstav kan inte göra ett rätt svar
 * fel.
 *
 * Enstaka tecken lämnas orörda. I bokstavsövningarna ÄR gemenen innehållet –
 * "a" mot "A" är hela frågan – och ett skiljetecken har ingen versal.
 */
export function stortOrd(text: string): string {
  if (text.length < 2) return text;
  const forsta = text.slice(0, 1);
  const versal = forsta.toLocaleUpperCase('sv-SE');
  // Lika betyder redan versal, eller ett tecken utan versalform (siffra).
  return versal === forsta ? text : versal + text.slice(1);
}
