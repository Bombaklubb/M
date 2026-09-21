import { getLjudAv, setLjudAv } from './storage';

/**
 * Ljud på eller av.
 *
 * En enda strömbrytare för HELA appen: både talet och ljudeffekterna. En elev
 * som stänger av ljudet ska få tyst, inte halvtyst – en bock som fortfarande
 * piper är inte avstängt ljud.
 *
 * Läget ligger utanför React, eftersom både lib/audio.ts och lib/sfx.ts måste
 * kunna fråga om det utan att vara komponenter. Komponenter prenumererar via
 * useLjud() och ritas om när det ändras.
 */

let av = false;
let laddat = false;
const lyssnare = new Set<() => void>();

function sakerstallLaddat(): void {
  if (laddat) return;
  av = getLjudAv();
  laddat = true;
}

/** Frågas av varje uppspelning. Måste vara billig – den anropas ofta. */
export function ljudetArAv(): boolean {
  sakerstallLaddat();
  return av;
}

export function vaxlaLjud(): void {
  sakerstallLaddat();
  av = !av;
  setLjudAv(av);
  lyssnare.forEach((cb) => cb());
}

export function prenumereraLjud(cb: () => void): () => void {
  lyssnare.add(cb);
  return () => lyssnare.delete(cb);
}

export function ljudSnapshot(): boolean {
  return ljudetArAv();
}
