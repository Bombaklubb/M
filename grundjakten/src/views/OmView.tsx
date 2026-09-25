/**
 * Om Grundjakten.
 *
 * Byggd som Svenskajaktens motsvarighet: färgad hero överst, därefter vita
 * kort med emoji, rubrik och brödtext.
 *
 * Den här sidan är för LÄRAREN. Eleven kan inte läsa den, och det är i sin
 * ordning – hon behöver inte veta något som inte redan går att höra eller se
 * som bild inne i appen. Därför är det också den enda skärmen i appen med
 * löpande text, och den enda utan öronknappar.
 */

import { AppMarke } from '@/components/AppMarke';
import { LjudKnapp } from '@/components/LjudKnapp';
import { JAKT_APPAR, KONTAKT_EPOST } from '@/components/Sidfot';

interface Kort {
  ikon: string;
  rubrik: string;
  stycken: string[];
  steg?: string[];
}

const KORT: Kort[] = [
  {
    ikon: '🎯',
    rubrik: 'Vad är Grundjakten?',
    stycken: [
      'Grundjakten är för elever på mellanstadiet som ligger på ungefär ' +
        'årskurs 1-nivå: elever som inte kan bokstävernas ljud eller namn, ' +
        'inte kan läsa och inte kan skriva. Appen finns för att svara på ' +
        'frågan vad de eleverna gör när resten av klassen läser och skriver ' +
        'texter.',
      'Appen är gratis, kräver inget konto och fungerar i webbläsaren på ' +
        'Chromebook, dator, surfplatta och mobil.',
      'Det finns systerappar för andra ämnen: ' +
        JAKT_APPAR.map((a) => a.namn).join(', ').replace(/, ([^,]*)$/, ' och $1') +
        '. De nås från Jaktlänkar nere till höger.',
    ],
  },
  {
    ikon: '🚀',
    rubrik: 'Kom igång',
    stycken: [],
    steg: [
      'Skriv elevens namn och välj en figur. Nästa gång räcker det att hon ' +
        'trycker på sitt eget ansikte – en elev som inte kan läsa kan inte ' +
        'heller skriva sitt namn själv.',
      'Välj ett av de tre korten. Övningar är namngivna uppgifter du kan ' +
        'peka ut, Bokstäver är ljudträningen och Skriva är forma bokstäver, ' +
        'bygga ord och trycka rätt tangent.',
      'Låt eleven trycka på öronen. Allt som står på skärmen går att höra.',
    ],
  },
  {
    ikon: '📚',
    rubrik: 'Vad eleven övar',
    stycken: [
      'Bokstäver är Bokstavsresan: åtta stationer genom alfabetets 29 ' +
        'bokstäver, i ljudordning och inte i bokstavsordning. Första ' +
        'stationen är S O L A R M, så att eleven kan läsa riktiga ord redan ' +
        'efter den.',
      'Övningar är 93 namngivna uppgifter i fyra nivåer, Svenska 1–4: ' +
        'alfabetet, svåra ljud (sj, tj, ng, j, ck), kort vokal, rimord, ' +
        'ljudenlig stavning, ordförståelse, grammatik, räkneord, dagar och ' +
        'månader. Du kan peka ut en viss uppgift för en viss elev.',
      'Ordbilderna är de 100 vanligaste orden i svenska texter – och, att, ' +
        'det, som, på … Eleven hör ordet och väljer rätt skriven form. ' +
        'Orden ska kännas igen direkt, inte ljudas.',
      'Ord som står först i en mening eller ensamma visas med stor bokstav. ' +
        'Bilderna är stora, och ingen bild används för två olika ord – det ' +
        'kontrolleras automatiskt innan en ändring läggs ut.',
    ],
  },
  {
    ikon: '👂',
    rubrik: 'Ingenting kräver läsning',
    stycken: [
      'Varje sak eleven kan välja mellan har ett eget litet öra – ' +
        'svarsalternativ, bokstavsbrickor, ordkort, bilder, varor i affären. ' +
        'Ett alternativ utan öra är en gissning för någon som inte kan läsa, ' +
        'inte ett val.',
      'Längst ned på varje övningsskärm finns dessutom en stor öronknapp som ' +
        'spelar upp instruktionen igen. Den är skärmens största tryckyta med ' +
        'flit: det är elevens väg tillbaka in i uppgiften om hon tappat tråden.',
      'Ljudknappen uppe i hörnet stänger av allt ljud. Knapparna som säger ' +
        'ett ljud och knapparna som säger ett ord ser olika ut, så att eleven ' +
        'inte blandar ihop dem.',
    ],
  },
  {
    ikon: '➡️',
    rubrik: 'Eleven bestämmer takten',
    stycken: [
      'Passet byter aldrig uppgift av sig självt. När en fråga är besvarad ' +
        'tänds en grön pil längst ned, och den ska tryckas. En elev som ' +
        'behöver tio sekunder på sig att se att hon svarade rätt ska hinna med.',
      'Ett fel ger inget avdrag, och eleven kommer alltid framåt. Första ' +
        'missen får hon försöka igen själv. Andra missen lyser det rätta ' +
        'svaret upp. Tredje missen visas och läses rätt svar, och sedan kommer ' +
        'nästa fråga. Ett pass går aldrig att köra fast i.',
      'Prickarna uppe till vänster blir orange för varje besvarad fråga – ' +
        'direkt när svaret ges, inte först när pilen trycks. Samma fråga kommer ' +
        'aldrig två gånger i samma pass.',
    ],
  },
  {
    ikon: '⭐',
    rubrik: 'Poäng, kistor och utmärkelser',
    stycken: [
      'Rätt svar på första försöket ger 5 poäng, rätt med hjälp ger 3. ' +
        'Poängen står under elevens namn på startsidan och i poängrutan på ' +
        'framstegs- och kistsidan.',
      'Träkistor delas ut oregelbundet, efter vart tredje till sjunde pass, ' +
        'så att de förblir en överraskning. Silver, guld, smaragd, rubin, ' +
        'diamant och den hemliga kistan kommer vid milstolpar i antal pass och ' +
        'poäng. Kistorna öppnas under kistknappen i sidhuvudet.',
      'Eleven kan samla 30 utmärkelser. Hennes egen sida, som öppnas med ' +
        'ett tryck på namnet, visar bara vad hon klarat – aldrig hur många fel ' +
        'hon haft.',
    ],
  },
  {
    ikon: '🛒',
    rubrik: 'Affären',
    stycken: [
      'I affären, under kundvagnen, handlar eleven för sina poäng: figurer, ' +
        'ramar runt figuren, teman som byter hela bakgrunden och effekter som ' +
        'snö, hjärtan och glitter.',
      'Ett köp sänker aldrig nivån och tar aldrig tillbaka en kista. ' +
        'Poängen hon samlat står kvar; affären räknar bara hur mycket av dem ' +
        'hon redan gjort av med. Innan ett köp frågar appen, med ✅ och ❌, så ' +
        'att ett feltryck inte kostar något.',
      'Tema och effekt syns överallt utom under själva övningen. Bakom en ' +
        'uppgift ska ingenting röra sig. Har datorn "minska rörelse" påslaget ' +
        'står effekterna stilla.',
    ],
  },
  {
    ikon: '📈',
    rubrik: 'Nivå och steg sköter sig själva',
    stycken: [
      'Det finns inga inställningar. Bokstavssteget höjs när minst 80 % av ' +
        'stationens bokstäver sitter, och nivåbandet höjs efter antal ' +
        'bemästrade bokstäver: 6, 13 och 25 av 29.',
      'Nivån sänks aldrig. Det en elev en gång har visat att hon klarar ska ' +
        'inte kunna tas ifrån henne av en dålig dag.',
    ],
  },
  {
    ikon: '💾',
    rubrik: 'Var elevens framsteg ligger',
    stycken: [
      'Allt sparas i webbläsaren på just den datorn. Byter eleven Chromebook, ' +
        'eller rensar skolan webbläsardata, försvinner framstegen – och det ' +
        'finns ingen backupfunktion. Det är den kända risken med appen.',
      'Flera elever kan dela samma Chromebook. Tryck Logga ut uppe till höger ' +
        'så kommer nästa elev åt sitt eget ansikte på inloggningssidan. På en ' +
        'mobil göms Logga ut för att sidhuvudet ska få plats.',
    ],
  },
  {
    ikon: '✉️',
    rubrik: 'Frågor och förslag',
    stycken: [
      `Kontakta Martin nere till vänster öppnar ett mejl till ${KONTAKT_EPOST}. ` +
        'Jaktlänkar nere till höger öppnar systerapparna i en ny flik. ' +
        'Ingen av dem syns under en övning – där ska det inte finnas någon ' +
        'väg ut ur uppgiften.',
    ],
  },
];

export function OmView({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-[100dvh]">
      <header className="bg-brand-700 px-4 py-5 text-white">
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          <div className="flex items-center gap-2">
            <AppMarke onHome={onBack} paFarg />
            <LjudKnapp paFarg />
            <button
              type="button"
              onClick={onBack}
              aria-label="Tillbaka"
              className="flex h-11 w-fit min-h-0 items-center gap-2 rounded-tile px-3
                         font-bold text-brand-100 hover:bg-white/10"
            >
              <span aria-hidden>←</span> Tillbaka
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-5xl leading-none" aria-hidden>🔤</span>
            <div className="flex flex-col">
              <h1 className="text-3xl font-extrabold">Om Grundjakten</h1>
              <span className="font-bold text-brand-200">Så fungerar appen</span>
            </div>
          </div>
        </div>
      </header>

      {/* pb-20: sidfoten med Kontakta Martin och Jaktlänkar ligger fast
          längst ned och får inte täcka sista kortet. */}
      <main className="mx-auto flex max-w-3xl flex-col gap-4 px-4 pb-20 pt-6">
        {KORT.map((k) => (
          <section
            key={k.rubrik}
            className="rounded-card bg-white/90 p-5 dark:bg-ink-800/90"
          >
            <h2 className="mb-3 flex items-center gap-3 text-xl font-extrabold">
              <span className="text-2xl" aria-hidden>{k.ikon}</span>
              {k.rubrik}
            </h2>

            {k.stycken.map((p, i) => (
              <p key={i} className="mb-2 leading-relaxed text-ink-700 last:mb-0 dark:text-ink-200">
                {p}
              </p>
            ))}

            {k.steg && (
              <ol className="flex flex-col gap-3">
                {k.steg.map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full
                                 bg-amberx-500 font-extrabold text-white"
                      aria-hidden
                    >
                      {i + 1}
                    </span>
                    <span className="leading-relaxed text-ink-700 dark:text-ink-200">{s}</span>
                  </li>
                ))}
              </ol>
            )}
          </section>
        ))}
      </main>
    </div>
  );
}
