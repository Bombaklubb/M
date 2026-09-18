import type { Exercise } from './exercises';

/** Svenska 1–4. Motsvarar nivåerna i övningslistan, inte årskurser. */
export type Niva = 1 | 2 | 3 | 4;

/**
 * En namngiven uppgift i övningsbanken.
 *
 * Skillnaden mot passen i Bokstäver och Skriva: de genereras utifrån elevens
 * steg, medan de här är NAMNGIVNA och går att peka ut. Läraren kan säga "gör
 * Alfabetet – Första bokstaven 2", och eleven hittar exakt den.
 *
 * `build` körs först när uppgiften startas, så innehållet varierar mellan
 * gångerna även om namnet är detsamma.
 */
export interface TaskDef {
  id: string;
  /** Gruppen i listan, t.ex. "Alfabetet" eller "SJ-ljudet". */
  grupp: string;
  /** Uppgiftens namn inom gruppen, t.ex. "Första bokstaven 2". */
  namn: string;
  niva: Niva;
  build: (seed: number) => Exercise[];
}

/** Ikon och färg per grupp, så att banken går att skanna visuellt. */
export interface GruppMeta {
  icon: string;
  tint: string;
}
