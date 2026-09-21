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
      'Det finns systerappar för andra ämnen: Svenskajakten, Läsjakten, ' +
        'Mattejakten, Engelskajakten och Readhunt.',
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
    ikon: '👂',
    rubrik: 'Ingenting kräver läsning',
    stycken: [
      'Varje sak eleven kan välja mellan har ett eget litet öra – ' +
        'svarsalternativ, bokstavsbrickor, ordkort, bilder. Ett alternativ ' +
        'utan öra är en gissning för någon som inte kan läsa, inte ett val.',
      'Längst ned på varje övningsskärm finns dessutom en stor öronknapp som ' +
        'spelar upp instruktionen igen. Den är skärmens största tryckyta med ' +
        'flit: det är elevens väg tillbaka in i uppgiften om hon tappat tråden.',
    ],
  },
  {
    ikon: '➡️',
    rubrik: 'Eleven bestämmer takten',
    stycken: [
      'Passet byter aldrig uppgift av sig självt. När svaret är rätt tänds en ' +
        'grön pil längst ned, och den ska tryckas. En elev som behöver tio ' +
        'sekunder på sig att se att hon svarade rätt ska hinna med.',
      'Ett missat svar ger inget avdrag. Uppgiften kommer tillbaka senare i ' +
        'passet, och efter andra missen lotsas eleven till rätt svar. Ett ' +
        'pass ska aldrig gå att köra fast i, och det slutar alltid i framgång.',
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
        'så kommer nästa elev åt sitt eget ansikte på inloggningssidan.',
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

      <main className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-6">
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
