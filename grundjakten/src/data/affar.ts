/**
 * Affärens varor.
 *
 * Byggd efter Engelskajaktens affär (`engelska/src/lib/shop.ts`, läst med
 * lärarens uttryckliga tillåtelse), men anpassad till en elev som inte kan
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
 * Engelskajakten har en fjärde flik, Effekter (partiklar som faller över
 * profilen). Den är medvetet utelämnad här: en effekt som rör sig drar
 * blicken från uppgiften, och den här appens målgrupp har svårt nog att
 * hålla kvar den.
 *
 * Engelskajakten har fem sällsynthetsgrader (vanlig/sällsynt/episk/
 * legendarisk/mytisk). Här är de tre. Graderna finns för att göra ett köp
 * märkvärdigt, och fem steg som eleven inte kan läsa skillnad på gör inte
 * det – de blir bara fem färger.
 *
 * Priserna är satta mot vad eleven faktiskt tjänar, inte mot Engelskajaktens
 * (100–5000, mot en helt annan poängtakt). Ett pass här ger ungefär 30–40
 * poäng, så en VANLIG vara är ungefär två pass, en SÄLLSYNT fem och en
 * LEGENDARISK ett femtontal. Det ska gå att köpa något redan första veckan,
 * och ändå finnas kvar att längta efter.
 */

export type VaruTyp = 'figur' | 'ram' | 'tema';
export type Sallsynthet = 'vanlig' | 'sallsynt' | 'legendarisk';

/**
 * Figurernas grupper.
 *
 * Tagna från Engelskajakten, som delar sina 76 avatarer i rubricerade
 * avsnitt i stället för ett enda långt rutnät. Med 24 figurer behövs samma
 * sak här: en elev som scrollar förbi tjugofyra ansikten i rad hittar aldrig
 * tillbaka till det hon tyckte om.
 */
export type FigurGrupp = 'Djur' | 'Fantasi' | 'Roligt';

export const FIGURGRUPPER: FigurGrupp[] = ['Djur', 'Fantasi', 'Roligt'];

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
  /** Bara figurer. Styr vilket avsnitt varan hamnar under. */
  grupp?: FigurGrupp;
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

// OBS: id:n är permanenta. Det eleven äger sparas på id, inte på plats i
// listan – byt aldrig ett id, då tappar hon det hon betalat för.
export const VAROR: Vara[] = [
  // ── Figurer: Djur ─────────────────────────────────────────────────────
  // Samma linje som gratisfigurerna: djur med attityd, inget gulligt.
  { id: 'fig-pingvin', typ: 'figur', grupp: 'Djur', namn: 'Pingvinen', pris: 60, sallsynthet: 'vanlig', ikon: '🐧' },
  { id: 'fig-groda', typ: 'figur', grupp: 'Djur', namn: 'Grodan', pris: 60, sallsynthet: 'vanlig', ikon: '🐸' },
  { id: 'fig-koala', typ: 'figur', grupp: 'Djur', namn: 'Koalan', pris: 60, sallsynthet: 'vanlig', ikon: '🐨' },
  { id: 'fig-panda', typ: 'figur', grupp: 'Djur', namn: 'Pandan', pris: 60, sallsynthet: 'vanlig', ikon: '🐼' },
  { id: 'fig-zebra', typ: 'figur', grupp: 'Djur', namn: 'Zebran', pris: 60, sallsynthet: 'vanlig', ikon: '🦓' },
  { id: 'fig-giraff', typ: 'figur', grupp: 'Djur', namn: 'Giraffen', pris: 60, sallsynthet: 'vanlig', ikon: '🦒' },
  { id: 'fig-skoldpadda', typ: 'figur', grupp: 'Djur', namn: 'Sköldpaddan', pris: 60, sallsynthet: 'vanlig', ikon: '🐢' },
  { id: 'fig-tiger', typ: 'figur', grupp: 'Djur', namn: 'Vita tigern', pris: 150, sallsynthet: 'sallsynt', ikon: '🐅' },
  { id: 'fig-krokodil', typ: 'figur', grupp: 'Djur', namn: 'Krokodilen', pris: 150, sallsynthet: 'sallsynt', ikon: '🐊' },
  { id: 'fig-blackfisk', typ: 'figur', grupp: 'Djur', namn: 'Bläckfisken', pris: 150, sallsynthet: 'sallsynt', ikon: '🦑' },
  { id: 'fig-skorpion', typ: 'figur', grupp: 'Djur', namn: 'Skorpionen', pris: 150, sallsynthet: 'sallsynt', ikon: '🦂' },
  { id: 'fig-noshorning', typ: 'figur', grupp: 'Djur', namn: 'Noshörningen', pris: 150, sallsynthet: 'sallsynt', ikon: '🦏' },
  { id: 'fig-flamingo', typ: 'figur', grupp: 'Djur', namn: 'Flamingon', pris: 150, sallsynthet: 'sallsynt', ikon: '🦩' },
  { id: 'fig-pafagel', typ: 'figur', grupp: 'Djur', namn: 'Påfågeln', pris: 500, sallsynthet: 'legendarisk', ikon: '🦚' },

  // ── Figurer: Fantasi ──────────────────────────────────────────────────
  { id: 'fig-enhorning', typ: 'figur', grupp: 'Fantasi', namn: 'Enhörningen', pris: 60, sallsynthet: 'vanlig', ikon: '🦄' },
  { id: 'fig-spoke', typ: 'figur', grupp: 'Fantasi', namn: 'Spöket', pris: 60, sallsynthet: 'vanlig', ikon: '👻' },
  { id: 'fig-dino', typ: 'figur', grupp: 'Fantasi', namn: 'Dinosaurien', pris: 150, sallsynthet: 'sallsynt', ikon: '🦕' },
  { id: 'fig-trex', typ: 'figur', grupp: 'Fantasi', namn: 'T-rexen', pris: 150, sallsynthet: 'sallsynt', ikon: '🦖' },
  { id: 'fig-ninja', typ: 'figur', grupp: 'Fantasi', namn: 'Ninjan', pris: 150, sallsynthet: 'sallsynt', ikon: '🥷' },
  { id: 'fig-drake', typ: 'figur', grupp: 'Fantasi', namn: 'Elddraken', pris: 500, sallsynthet: 'legendarisk', ikon: '🐉' },
  { id: 'fig-robot', typ: 'figur', grupp: 'Fantasi', namn: 'Roboten', pris: 500, sallsynthet: 'legendarisk', ikon: '🤖' },
  { id: 'fig-alien', typ: 'figur', grupp: 'Fantasi', namn: 'Rymdvarelsen', pris: 500, sallsynthet: 'legendarisk', ikon: '👾' },
  { id: 'fig-superhjalte', typ: 'figur', grupp: 'Fantasi', namn: 'Superhjälten', pris: 500, sallsynthet: 'legendarisk', ikon: '🦸' },

  // ── Figurer: Roligt ───────────────────────────────────────────────────
  // Engelskajakten har en hel "Roligt"-grupp, och den är populärast där.
  // Samma tanke här: något att skratta åt, inte bara något att vara stolt
  // över.
  { id: 'fig-pizza', typ: 'figur', grupp: 'Roligt', namn: 'Pizzabiten', pris: 60, sallsynthet: 'vanlig', ikon: '🍕' },
  { id: 'fig-munk', typ: 'figur', grupp: 'Roligt', namn: 'Munken', pris: 60, sallsynthet: 'vanlig', ikon: '🍩' },
  { id: 'fig-glass', typ: 'figur', grupp: 'Roligt', namn: 'Glassen', pris: 60, sallsynthet: 'vanlig', ikon: '🍦' },
  { id: 'fig-kaktus', typ: 'figur', grupp: 'Roligt', namn: 'Taggiga kaktusen', pris: 60, sallsynthet: 'vanlig', ikon: '🌵' },
  { id: 'fig-snigel', typ: 'figur', grupp: 'Roligt', namn: 'Snabba snigeln', pris: 150, sallsynthet: 'sallsynt', ikon: '🐌' },
  { id: 'fig-sengangare', typ: 'figur', grupp: 'Roligt', namn: 'Lata sengångaren', pris: 150, sallsynthet: 'sallsynt', ikon: '🦥' },
  { id: 'fig-bajs', typ: 'figur', grupp: 'Roligt', namn: 'Glada bajskorven', pris: 150, sallsynthet: 'sallsynt', ikon: '💩' },
  { id: 'fig-galning', typ: 'figur', grupp: 'Roligt', namn: 'Tokiga galningen', pris: 500, sallsynthet: 'legendarisk', ikon: '🤪' },

  // ── Ramar ─────────────────────────────────────────────────────────────
  // Ringen ritas runt figuren. Tjock med flit: en tunn ram syns inte på en
  // Chromebook på armlängds avstånd.
  { id: 'ram-lime', typ: 'ram', namn: 'Gröna ringen', pris: 50, sallsynthet: 'vanlig', ikon: '🟢',
    stil: 'ring-4 ring-lime-400' },
  { id: 'ram-aqua', typ: 'ram', namn: 'Blå ringen', pris: 50, sallsynthet: 'vanlig', ikon: '🔵',
    stil: 'ring-4 ring-aqua-400' },
  { id: 'ram-lila', typ: 'ram', namn: 'Lila ringen', pris: 50, sallsynthet: 'vanlig', ikon: '🟣',
    stil: 'ring-4 ring-brand-400' },
  { id: 'ram-rosa', typ: 'ram', namn: 'Rosa ringen', pris: 50, sallsynthet: 'vanlig', ikon: '🩷',
    stil: 'ring-4 ring-pink-400' },
  { id: 'ram-guld', typ: 'ram', namn: 'Guldramen', pris: 180, sallsynthet: 'sallsynt', ikon: '🟡',
    stil: 'ring-4 ring-amberx-400' },
  { id: 'ram-svart', typ: 'ram', namn: 'Svarta ramen', pris: 180, sallsynthet: 'sallsynt', ikon: '⚫',
    stil: 'ring-4 ring-ink-800' },
  { id: 'ram-eld', typ: 'ram', namn: 'Eldramen', pris: 450, sallsynthet: 'legendarisk', ikon: '🔥',
    stil: 'ring-4 ring-offset-2 ring-red-500 ring-offset-amberx-400' },
  { id: 'ram-regnbage', typ: 'ram', namn: 'Regnbågsramen', pris: 450, sallsynthet: 'legendarisk', ikon: '🌈',
    stil: 'ring-4 ring-offset-2 ring-brand-500 ring-offset-amberx-300' },

  // ── Teman ─────────────────────────────────────────────────────────────
  // Byter appens bakgrundstoning. Alltid ljus nog att svart text håller
  // kontrasten – bakgrunden ska aldrig göra uppgiften svårare att läsa.
  //
  // Engelskajakten har 21 teman, många med hårda mönster (zebra, schack,
  // disco). De ligger dock bara på ett kort på profilsidan. Här ligger
  // temat bakom SJÄLVA UPPGIFTEN, och ett randigt eller prickigt underlag
  // gör bokstäverna svårare att urskilja. Därför mjuka toningar, och färre.
  { id: 'tema-skog', typ: 'tema', namn: 'Skogen', pris: 120, sallsynthet: 'vanlig', ikon: '🌲',
    stil: 'tema-skog' },
  { id: 'tema-hav', typ: 'tema', namn: 'Havet', pris: 120, sallsynthet: 'vanlig', ikon: '🌊',
    stil: 'tema-hav' },
  { id: 'tema-vinter', typ: 'tema', namn: 'Vintern', pris: 120, sallsynthet: 'vanlig', ikon: '❄️',
    stil: 'tema-vinter' },
  { id: 'tema-solnedgang', typ: 'tema', namn: 'Solnedgången', pris: 250, sallsynthet: 'sallsynt', ikon: '🌇',
    stil: 'tema-solnedgang' },
  { id: 'tema-djungel', typ: 'tema', namn: 'Djungeln', pris: 250, sallsynthet: 'sallsynt', ikon: '🌴',
    stil: 'tema-djungel' },
  { id: 'tema-rymden', typ: 'tema', namn: 'Rymden', pris: 550, sallsynthet: 'legendarisk', ikon: '🌌',
    stil: 'tema-rymden' },
  { id: 'tema-regnbage', typ: 'tema', namn: 'Regnbågen', pris: 550, sallsynthet: 'legendarisk', ikon: '🌈',
    stil: 'tema-regnbage' },
];

export function varaById(id: string): Vara | undefined {
  return VAROR.find((v) => v.id === id);
}
