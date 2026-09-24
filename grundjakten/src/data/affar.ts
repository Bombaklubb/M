/**
 * Affärens varor.
 *
 * Byggd efter Svenskajaktens affär, men anpassad till en elev som inte kan
 * läsa: varje vara ÄR en bild, namnet är till för läraren, och priset står
 * som en siffra bredvid stjärnan. Ingen vara döljer sig bakom text.
 *
 * Tre kategorier, alla med synlig verkan i appen:
 *
 *  - FIGURER  extra figurer utöver de tolv gratis. Syns i sidhuvudet, på
 *             framstegssidan och på inloggningens ansikte.
 *  - RAMAR    en ring runt figuren. Syns på samma tre ställen.
 *  - TEMAN    appens bakgrundstoning.
 *
 * Svenskajakten har en fjärde flik, Effekter. Den är medvetet utelämnad här:
 * en effekt som rör sig drar blicken från uppgiften, och den här appens
 * målgrupp har svårt nog att hålla kvar den.
 *
 * Priserna är satta mot vad eleven faktiskt tjänar. Ett pass ger ungefär
 * 30–40 poäng, så en VANLIG vara är ungefär två pass, en SÄLLSYNT fem och en
 * LEGENDARISK ett femtontal. Det ska gå att köpa något redan första veckan,
 * och ändå finnas kvar att längta efter.
 */

export type VaruTyp = 'figur' | 'ram' | 'tema';
export type Sallsynthet = 'vanlig' | 'sallsynt' | 'legendarisk';

export interface Vara {
  id: string;
  typ: VaruTyp;
  /** För läraren. Eleven går på bilden. */
  namn: string;
  pris: number;
  sallsynthet: Sallsynthet;
  /** Figurer: själva emojin. Ramar och teman: en bild som visar vad det är. */
  ikon: string;
  /**
   * Ramens ringklasser respektive temats bakgrund. Null för figurer, som
   * bärs av `ikon` i stället.
   */
  stil?: string;
}

export const SALLSYNTHET: Record<Sallsynthet, { namn: string; klass: string }> = {
  vanlig: { namn: 'Vanlig', klass: 'bg-ink-200 text-ink-700 dark:bg-ink-700 dark:text-ink-200' },
  sallsynt: { namn: 'Sällsynt', klass: 'bg-aqua-500 text-white' },
  legendarisk: { namn: 'Legendarisk', klass: 'bg-amberx-500 text-white' },
};

export const KATEGORIER: { typ: VaruTyp; namn: string; ikon: string }[] = [
  { typ: 'figur', namn: 'Figurer', ikon: '🦊' },
  { typ: 'ram', namn: 'Ramar', ikon: '🖼️' },
  { typ: 'tema', namn: 'Teman', ikon: '🎨' },
];

export const VAROR: Vara[] = [
  // ── Figurer ───────────────────────────────────────────────────────────
  // Samma linje som gratisfigurerna: djur med attityd, inget gulligt.
  { id: 'fig-enhorning', typ: 'figur', namn: 'Enhörningen', pris: 60, sallsynthet: 'vanlig', ikon: '🦄' },
  { id: 'fig-pingvin', typ: 'figur', namn: 'Pingvinen', pris: 60, sallsynthet: 'vanlig', ikon: '🐧' },
  { id: 'fig-groda', typ: 'figur', namn: 'Grodan', pris: 60, sallsynthet: 'vanlig', ikon: '🐸' },
  { id: 'fig-koala', typ: 'figur', namn: 'Koalan', pris: 60, sallsynthet: 'vanlig', ikon: '🐨' },
  { id: 'fig-panda', typ: 'figur', namn: 'Pandan', pris: 90, sallsynthet: 'vanlig', ikon: '🐼' },
  { id: 'fig-tiger', typ: 'figur', namn: 'Vita tigern', pris: 150, sallsynthet: 'sallsynt', ikon: '🐅' },
  { id: 'fig-krokodil', typ: 'figur', namn: 'Krokodilen', pris: 150, sallsynthet: 'sallsynt', ikon: '🐊' },
  { id: 'fig-blackfisk', typ: 'figur', namn: 'Bläckfisken', pris: 150, sallsynthet: 'sallsynt', ikon: '🦑' },
  { id: 'fig-skorpion', typ: 'figur', namn: 'Skorpionen', pris: 200, sallsynthet: 'sallsynt', ikon: '🦂' },
  { id: 'fig-drake', typ: 'figur', namn: 'Elddraken', pris: 500, sallsynthet: 'legendarisk', ikon: '🐉' },
  { id: 'fig-robot', typ: 'figur', namn: 'Roboten', pris: 500, sallsynthet: 'legendarisk', ikon: '🤖' },
  { id: 'fig-alien', typ: 'figur', namn: 'Rymdvarelsen', pris: 600, sallsynthet: 'legendarisk', ikon: '👾' },

  // ── Ramar ─────────────────────────────────────────────────────────────
  // Ringen ritas runt figuren. Tjock med flit: en tunn ram syns inte på en
  // Chromebook på armlängds avstånd.
  { id: 'ram-lime', typ: 'ram', namn: 'Gröna ringen', pris: 50, sallsynthet: 'vanlig', ikon: '🟢',
    stil: 'ring-4 ring-lime-400' },
  { id: 'ram-aqua', typ: 'ram', namn: 'Blå ringen', pris: 50, sallsynthet: 'vanlig', ikon: '🔵',
    stil: 'ring-4 ring-aqua-400' },
  { id: 'ram-lila', typ: 'ram', namn: 'Lila ringen', pris: 50, sallsynthet: 'vanlig', ikon: '🟣',
    stil: 'ring-4 ring-brand-400' },
  { id: 'ram-guld', typ: 'ram', namn: 'Guldramen', pris: 180, sallsynthet: 'sallsynt', ikon: '🟡',
    stil: 'ring-4 ring-amberx-400' },
  { id: 'ram-regnbage', typ: 'ram', namn: 'Regnbågsramen', pris: 450, sallsynthet: 'legendarisk', ikon: '🌈',
    stil: 'ring-4 ring-offset-2 ring-brand-500 ring-offset-amberx-300' },

  // ── Teman ─────────────────────────────────────────────────────────────
  // Byter appens bakgrundstoning. Alltid ljus nog att svart text håller
  // kontrasten – bakgrunden ska aldrig göra uppgiften svårare att läsa.
  { id: 'tema-skog', typ: 'tema', namn: 'Skogen', pris: 120, sallsynthet: 'vanlig', ikon: '🌲',
    stil: 'tema-skog' },
  { id: 'tema-hav', typ: 'tema', namn: 'Havet', pris: 120, sallsynthet: 'vanlig', ikon: '🌊',
    stil: 'tema-hav' },
  { id: 'tema-solnedgang', typ: 'tema', namn: 'Solnedgången', pris: 250, sallsynthet: 'sallsynt', ikon: '🌇',
    stil: 'tema-solnedgang' },
  { id: 'tema-rymden', typ: 'tema', namn: 'Rymden', pris: 550, sallsynthet: 'legendarisk', ikon: '🌌',
    stil: 'tema-rymden' },
];

export function varaById(id: string): Vara | undefined {
  return VAROR.find((v) => v.id === id);
}
