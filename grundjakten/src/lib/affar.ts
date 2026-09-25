import type { Progress } from '@/types';
import { varaById, type Vara } from '@/data/affar';

/**
 * Affärens regler.
 *
 * Den viktigaste står i types/profile.ts: `xp` rörs ALDRIG av ett köp. Den är
 * elevens livstidssumma och styr nivåbandet och kistmilstolparna, och
 * husregeln är att nivån aldrig sänks. Ett köp ökar i stället `spenderat`.
 */

/** Poäng eleven har kvar att handla för. */
export function attSpendera(p: Progress): number {
  return Math.max(0, p.xp - p.spenderat);
}

export function arKopt(p: Progress, id: string): boolean {
  return p.kopta.includes(id);
}

export function harRad(p: Progress, vara: Vara): boolean {
  return attSpendera(p) >= vara.pris;
}

/**
 * Köper en vara.
 *
 * Returnerar progress oförändrad om varan inte finns, redan är köpt eller
 * inte går att ha råd med. Kontrollen ligger HÄR och inte bara i knappen –
 * en knapp går att trycka på två gånger innan skärmen hunnit rita om, och då
 * skulle eleven betala dubbelt för samma sak.
 *
 * Det som köps väljs också direkt. Att behöva köpa och SEDAN leta upp en
 * "använd"-knapp är ett steg för mycket för någon som inte kan läsa – hon
 * ska se resultatet av sitt köp med en gång.
 */
export function kop(p: Progress, id: string): Progress {
  const vara = varaById(id);
  if (!vara || arKopt(p, id) || !harRad(p, vara)) return p;

  const efter: Progress = {
    ...p,
    spenderat: p.spenderat + vara.pris,
    kopta: [...p.kopta, id],
  };
  return valj(efter, id);
}

/**
 * Väljer en redan köpt vara.
 *
 * Figurer ligger på profilen och inte i progress, så den väljs av anroparen
 * (App.tsx) som äger profilen. Här hanteras ram, tema och effekt.
 */
export function valj(p: Progress, id: string): Progress {
  const vara = varaById(id);
  if (!vara || !arKopt(p, id)) return p;
  if (vara.typ === 'ram') return { ...p, valdRam: id };
  if (vara.typ === 'tema') return { ...p, valdTema: id };
  if (vara.typ === 'effekt') return { ...p, valdEffekt: id };
  return p;
}

/** Det som går att stänga av. Figuren går inte – eleven har alltid en. */
export type Avstangbar = 'ram' | 'tema' | 'effekt';

/** Tar bort ram, tema eller effekt och går tillbaka till appens standardutseende. */
export function valjBort(p: Progress, typ: Avstangbar): Progress {
  if (typ === 'ram') return { ...p, valdRam: null };
  if (typ === 'tema') return { ...p, valdTema: null };
  return { ...p, valdEffekt: null };
}

/** Ringklasserna för elevens valda ram, eller tom sträng. */
export function ramStil(p: Progress): string {
  return (p.valdRam && varaById(p.valdRam)?.stil) || '';
}

/** Elevens valda tema, eller null. */
export function valtTema(p: Progress): Vara | null {
  const v = p.valdTema ? varaById(p.valdTema) : undefined;
  return v?.typ === 'tema' && v.css ? v : null;
}

/** Elevens valda effekt, eller null. */
export function valdEffekt(p: Progress): Vara | null {
  const v = p.valdEffekt ? varaById(p.valdEffekt) : undefined;
  return v?.typ === 'effekt' ? v : null;
}
