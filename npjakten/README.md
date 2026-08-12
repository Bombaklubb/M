# NP-jakten

Träna inför nationella proven i svenska för årskurs 3, 6 och 9.

- **Läsa:** läsförståelse i provens format, med bedömningsanvisning och exempelsvar per poängnivå
- **Skriva:** olika texttyper med skrivyta, autosparat utkast och självbedömning
- **Muntligt:** gruppsamtal med samtalskort samt individuell presentation med stödkort

Övrigt: provläge med tidtagning, uppläsning av texter, frågor och instruktioner
(talsyntes), läsinställningar för större text/mer luft/lättläst typsnitt, utskrift av
prov, facit, samtalskort och stödkort, samt "Min statistik" per uppgiftstyp (sparas
lokalt i webbläsaren).

Lärarläge: lägg till `?larare` i adressen för att visa facit, bedömningsstöd för
skrivuppgifter och observationsschema för de muntliga delarna.

## Utveckling

```bash
npm install
npm run dev
```

Bygg för produktion med `npm run build` (output i `dist/`).

## Lägga till övningsmaterial

Allt innehåll ligger i JSON-filer i `src/data/`:

- `ak3.json` – årskurs 3
- `ak6.json` – årskurs 6
- `ak9.json` – årskurs 9

Varje fil har formen `{ "reading": [...], "writing": [...], "oral": [...] }`. Lägg till en ny text
eller skrivuppgift genom att kopiera ett befintligt objekt i listan och byta ut
innehållet – ingen kod behöver ändras. Fältens betydelse beskrivs i `src/types.ts`.

Allt textinnehåll är nyskrivet övningsmaterial – endast struktur och utseende följer de nationella provens format.
