/**
 * Affärens varor.
 *
 * Byggd efter Engelskajaktens och Mattejaktens affärer
 * (`engelska/src/lib/shop.ts`, `matematik/src/data/shop.ts`, lästa med
 * lärarens uttryckliga tillåtelse), men anpassad till en elev som inte kan
 * läsa: varje vara ÄR en bild, namnet är till för läraren, och priset står
 * som en siffra bredvid stjärnan. Ingen vara döljer sig bakom text.
 *
 * Fyra kategorier, samma som i systerapparna:
 *
 *  - FIGURER   extra figurer utöver de tolv gratis. Syns i sidhuvudet, på
 *              framstegssidan och på inloggningens ansikte.
 *  - RAMAR     en ring runt figuren. Syns på samma tre ställen.
 *  - TEMAN     hela appens bakgrund.
 *  - EFFEKTER  partiklar (snö, hjärtan, glitter …) som rör sig över bakgrunden.
 *
 * Teman och effekter visas på alla sidor UTOM i själva övningspasset – samma
 * regel som i Engelskajakten, där övningssidorna har egen bakgrund som täcker
 * dem. Under en uppgift ska ingenting röra sig och ingenting konkurrera med
 * bokstäverna. Se components/Bakgrund.tsx.
 *
 * Engelskajakten har fem sällsynthetsgrader (vanlig/sällsynt/episk/
 * legendarisk/mytisk). Här är de tre. Graderna finns för att göra ett köp
 * märkvärdigt, och fem steg som eleven inte kan läsa skillnad på gör inte
 * det – de blir bara fem färger.
 *
 * Priserna är satta mot vad eleven faktiskt tjänar, inte mot systerappernas
 * (100–5000, mot en helt annan poängtakt). Ett pass här ger ungefär 30–40
 * poäng, så en VANLIG vara är ungefär två pass, en SÄLLSYNT fem och en
 * LEGENDARISK ett femtontal. Det ska gå att köpa något redan första veckan,
 * och ändå finnas kvar att längta efter.
 */

export type VaruTyp = 'figur' | 'ram' | 'tema' | 'effekt';
export type Sallsynthet = 'vanlig' | 'sallsynt' | 'legendarisk';

/** Hur en effekts partiklar rör sig. Samma tre som i systerapparna. */
export type EffektRorelse = 'fall' | 'stig' | 'glittra';

/**
 * Figurernas grupper.
 *
 * Tagna från Engelskajakten, som delar sina 76 avatarer i rubricerade
 * avsnitt i stället för ett enda långt rutnät. En elev som scrollar förbi
 * trettio ansikten i rad hittar aldrig tillbaka till det hon tyckte om.
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
  /**
   * Figurer: själva emojin. Effekter: partikeln. Ramar: en bild som visar
   * färgen. Teman visas med sin riktiga bakgrund, inte med ikonen.
   */
  ikon: string;
  /** Bara ramar: ringklasserna. */
  stil?: string;
  /**
   * Bara teman: ett komplett CSS `background`-värde, samma form som i
   * Engelskajakten. Samma sträng ritar både hela sidan och provbiten i
   * affären – eleven ska få exakt det hon ser innan hon köper.
   */
  css?: string;
  /** Bara teman: bakgrunden glider långsamt, som systerappernas legendariska. */
  animerad?: boolean;
  /** Bara effekter. */
  rorelse?: EffektRorelse;
  /** Bara effekter: hur många partiklar. */
  antal?: number;
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
  { typ: 'effekt', namn: 'Effekter', ikon: '✨' },
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
  // Hela sidans bakgrund. Mättade färger och mönster, som i systerapparna –
  // de första temana var 25 % tvätt på vitt och syntes knappt.
  //
  // Regeln som gör att det går: ingen färg i ett tema är mörkare än att
  // appens mörka text läses på den. Systerapparna har vit text och lägger en
  // svart slöja över temat; här är texten mörk, så i stället får temat aldrig
  // bli mörkt. `kollaAffar()` räknar kontrasten för varje färg i varje tema.
  //
  // Inga svartvita djurmönster (zebra, ko) av samma skäl: svart går inte.
  //
  // Former som sol, planet och fläckar är satta i PROCENT, inte i rem.
  // Samma värde ritar provbiten i affären, och en sol på 9rem var större än
  // hela provbiten – eleven såg en gul fläck och fick en solnedgång.
  { id: 'tema-skog', typ: 'tema', namn: 'Skogen', pris: 120, sallsynthet: 'vanlig', ikon: '🌲',
    css: 'radial-gradient(circle at 18% 30%,#86efac 0 14%,transparent 14.3%),'
      + 'radial-gradient(circle at 78% 22%,#bef264 0 17%,transparent 17.3%),'
      + 'radial-gradient(circle at 60% 88%,#6ee7b7 0 19%,transparent 19.3%),'
      + 'radial-gradient(circle at 8% 92%,#bef264 0 14%,transparent 14.3%),'
      + 'linear-gradient(160deg,#bbf7d0,#86efac)' },
  { id: 'tema-hav', typ: 'tema', namn: 'Havet', pris: 120, sallsynthet: 'vanlig', ikon: '🌊',
    css: 'radial-gradient(circle,rgba(255,255,255,0.7) 0 5px,transparent 6px) 0 0/70px 70px,'
      + 'radial-gradient(circle,rgba(255,255,255,0.5) 0 9px,transparent 10px) 35px 35px/110px 110px,'
      + 'repeating-radial-gradient(circle at 50% 120%,#7dd3fc 0 40px,#a5f3fc 40px 80px)' },
  { id: 'tema-vinter', typ: 'tema', namn: 'Vintern', pris: 120, sallsynthet: 'vanlig', ikon: '❄️',
    css: 'radial-gradient(circle,#ffffff 0 4px,transparent 5px) 0 0/48px 48px,'
      + 'radial-gradient(circle,#ffffff 0 7px,transparent 8px) 24px 24px/96px 96px,'
      + 'linear-gradient(180deg,#bae6fd,#c7d2fe)' },
  { id: 'tema-godis', typ: 'tema', namn: 'Godisrandigt', pris: 120, sallsynthet: 'vanlig', ikon: '🍬',
    css: 'repeating-linear-gradient(45deg,#f9a8d4 0 34px,#ffffff 34px 68px)' },
  { id: 'tema-fotboll', typ: 'tema', namn: 'Fotbollsplanen', pris: 120, sallsynthet: 'vanlig', ikon: '⚽',
    css: 'repeating-linear-gradient(90deg,#86efac 0 80px,#bbf7d0 80px 160px)' },
  { id: 'tema-prickar', typ: 'tema', namn: 'Prickar', pris: 120, sallsynthet: 'vanlig', ikon: '🔴',
    css: 'radial-gradient(circle,#f9a8d4 0 14px,transparent 15px) 0 0/64px 64px,'
      + 'radial-gradient(circle,#7dd3fc 0 14px,transparent 15px) 32px 32px/64px 64px,'
      + '#fef08a' },
  { id: 'tema-schack', typ: 'tema', namn: 'Schackrutor', pris: 120, sallsynthet: 'vanlig', ikon: '🏁',
    css: 'conic-gradient(#93c5fd 90deg,#ffffff 90deg 180deg,#93c5fd 180deg 270deg,#ffffff 270deg) 0 0/96px 96px' },

  { id: 'tema-solnedgang', typ: 'tema', namn: 'Solnedgången', pris: 250, sallsynthet: 'sallsynt', ikon: '🌇',
    // En riktig sol som går ned i horisonten, inte bara en toning.
    css: 'radial-gradient(circle at 50% 100%,#fef08a 0 20%,#fde047 20% 21.5%,transparent 34%),'
      + 'repeating-linear-gradient(180deg,transparent 0 22px,rgba(255,255,255,0.35) 22px 26px),'
      + 'linear-gradient(180deg,#c4b5fd 0%,#f9a8d4 38%,#fdba74 70%,#fde68a 100%)' },
  { id: 'tema-djungel', typ: 'tema', namn: 'Djungeln', pris: 250, sallsynthet: 'sallsynt', ikon: '🌴',
    css: 'radial-gradient(ellipse 16% 14% at 12% 18%,#4ade80 0 98%,transparent 100%),'
      + 'radial-gradient(ellipse 20% 16% at 88% 30%,#a3e635 0 98%,transparent 100%),'
      + 'radial-gradient(ellipse 17% 15% at 30% 80%,#4ade80 0 98%,transparent 100%),'
      + 'radial-gradient(ellipse 12% 12% at 76% 86%,#fde047 0 98%,transparent 100%),'
      + 'repeating-linear-gradient(120deg,#86efac 0 40px,#bef264 40px 80px)' },
  { id: 'tema-lava', typ: 'tema', namn: 'Lavan', pris: 250, sallsynthet: 'sallsynt', ikon: '🌋',
    css: 'radial-gradient(circle at 20% 80%,#fb923c 0 16%,transparent 16.3%),'
      + 'radial-gradient(circle at 80% 70%,#fbbf24 0 20%,transparent 20.3%),'
      + 'radial-gradient(circle at 55% 20%,#fb923c 0 11%,transparent 11.3%),'
      + 'linear-gradient(180deg,#fef08a,#fdba74)' },
  { id: 'tema-glass', typ: 'tema', namn: 'Glassbaren', pris: 250, sallsynthet: 'sallsynt', ikon: '🍦',
    css: 'repeating-linear-gradient(180deg,#f9a8d4 0 12.5%,#fef08a 12.5% 25%,#a7f3d0 25% 37.5%,#c4b5fd 37.5% 50%)' },
  { id: 'tema-undervatten', typ: 'tema', namn: 'Under vattnet', pris: 250, sallsynthet: 'sallsynt', ikon: '🐠',
    css: 'radial-gradient(circle,rgba(255,255,255,0.8) 0 6px,transparent 7px) 10px 0/60px 90px,'
      + 'radial-gradient(circle,rgba(255,255,255,0.6) 0 12px,transparent 13px) 40px 45px/120px 150px,'
      + 'linear-gradient(180deg,#a5f3fc,#67e8f9 55%,#5eead4)' },

  { id: 'tema-rymden', typ: 'tema', namn: 'Rymden', pris: 550, sallsynthet: 'legendarisk', ikon: '🌌',
    // En ljus natthimmel med stjärnor och en planet – mörk skulle göra
    // texten oläslig.
    css: 'radial-gradient(circle at 82% 22%,#fda4af 0 7%,transparent 7.2%),'
      + 'radial-gradient(ellipse 13% 6% at 82% 22%,transparent 0 76%,rgba(255,255,255,0.85) 78% 92%,transparent 94%),'
      + 'radial-gradient(circle,#ffffff 0 2px,transparent 3px) 0 0/42px 42px,'
      + 'radial-gradient(circle,#ffffff 0 3px,transparent 4px) 21px 21px/76px 76px,'
      + 'linear-gradient(160deg,#a5b4fc,#c4b5fd 50%,#93c5fd)' },
  { id: 'tema-regnbage', typ: 'tema', namn: 'Regnbågen', pris: 550, sallsynthet: 'legendarisk', ikon: '🌈',
    animerad: true,
    css: 'linear-gradient(60deg,#fca5a5,#fdba74,#fde047,#86efac,#7dd3fc,#c4b5fd,#f9a8d4,#fca5a5)' },
  { id: 'tema-norrsken', typ: 'tema', namn: 'Norrsken', pris: 550, sallsynthet: 'legendarisk', ikon: '🌠',
    animerad: true,
    css: 'linear-gradient(120deg,#99f6e4,#86efac,#a5b4fc,#d8b4fe,#5eead4,#99f6e4)' },
  { id: 'tema-dansgolv', typ: 'tema', namn: 'Dansgolvet', pris: 550, sallsynthet: 'legendarisk', ikon: '🪩',
    css: 'conic-gradient(#f9a8d4 90deg,#c4b5fd 90deg 180deg,#67e8f9 180deg 270deg,#fde047 270deg) 0 0/88px 88px' },

  // ── Effekter ──────────────────────────────────────────────────────────
  // Samma elva som i Engelskajakten och Mattejakten, med samma id:n, så en
  // elev som använder flera av apparna känner igen dem.
  { id: 'fx-snow', typ: 'effekt', namn: 'Snöfall', pris: 60, sallsynthet: 'vanlig', ikon: '❄️', rorelse: 'fall', antal: 16 },
  { id: 'fx-rain', typ: 'effekt', namn: 'Regn', pris: 60, sallsynthet: 'vanlig', ikon: '💧', rorelse: 'fall', antal: 18 },
  { id: 'fx-bubbles', typ: 'effekt', namn: 'Bubblor', pris: 60, sallsynthet: 'vanlig', ikon: '🫧', rorelse: 'stig', antal: 14 },
  { id: 'fx-confetti', typ: 'effekt', namn: 'Konfetti', pris: 180, sallsynthet: 'sallsynt', ikon: '🎊', rorelse: 'fall', antal: 18 },
  { id: 'fx-hearts', typ: 'effekt', namn: 'Hjärtan', pris: 180, sallsynthet: 'sallsynt', ikon: '💕', rorelse: 'stig', antal: 14 },
  { id: 'fx-sparkle', typ: 'effekt', namn: 'Stjärnglitter', pris: 200, sallsynthet: 'sallsynt', ikon: '✨', rorelse: 'glittra', antal: 16 },
  { id: 'fx-leaves', typ: 'effekt', namn: 'Höstlöv', pris: 200, sallsynthet: 'sallsynt', ikon: '🍂', rorelse: 'fall', antal: 14 },
  { id: 'fx-petals', typ: 'effekt', namn: 'Körsbärsblom', pris: 200, sallsynthet: 'sallsynt', ikon: '🌸', rorelse: 'fall', antal: 14 },
  { id: 'fx-fire', typ: 'effekt', namn: 'Gnistor', pris: 400, sallsynthet: 'legendarisk', ikon: '🔥', rorelse: 'stig', antal: 14 },
  { id: 'fx-stars', typ: 'effekt', namn: 'Stjärnstoft', pris: 400, sallsynthet: 'legendarisk', ikon: '🌟', rorelse: 'glittra', antal: 16 },
  { id: 'fx-shooting', typ: 'effekt', namn: 'Stjärnfall', pris: 500, sallsynthet: 'legendarisk', ikon: '🌠', rorelse: 'fall', antal: 12 },
];

export function varaById(id: string): Vara | undefined {
  return VAROR.find((v) => v.id === id);
}
