# NP-jakten

Träna inför nationella proven för årskurs 3, 6 och 9.

- **Svenska:** årskurs 3, 6 och 9
- **Engelska:** årskurs 6 och 9 (innehåll under uppbyggnad)

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

- `ak3.json`, `ak6.json`, `ak9.json` – svenska
- `en-ak6.json`, `en-ak9.json` – engelska

Varje fil har formen `{ "reading": [...], "listening": [...], "writing": [...], "oral": [...] }`
(`listening` används bara i engelskan). Lägg till en ny text
eller skrivuppgift genom att kopiera ett befintligt objekt i listan och byta ut
innehållet – ingen kod behöver ändras. Fältens betydelse beskrivs i `src/types.ts`.

Allt textinnehåll är nyskrivet övningsmaterial – endast struktur och utseende följer de nationella provens format.

## Hörförståelse (engelska)

Lyssnauppgifter läggs i `listening`-listan och läses upp av webbläsarens talsyntes
med engelsk röst. Manuset visas aldrig för eleven på skärmen – det följer bara med
i lärarens facitutskrift (`?larare`).

```json
{
  "id": "en6-b1-at-the-shop",
  "delprov": "Delprov B1: listening",
  "title": "At the shop",
  "intro": "Du kommer att höra ett samtal i en affär. Läs frågorna först.",
  "maxPlays": 2,
  "script": [
    { "speaker": "Shop assistant", "text": "Good morning! Can I help you?" },
    { "speaker": "Customer", "text": "Yes, please. I'm looking for a jacket." }
  ],
  "questions": [ /* samma frågetyper som i läsproven */ ]
}
```

Engelska lästexter sätter `"lang": "en"` så att uppläsningsknappen använder
engelsk röst. Uppgiftstyper (`aspect`) för engelskan:
"Förstå huvudinnehåll och sammanhang", "Förstå detaljer och underförstådd betydelse",
"Hitta specifik information" och "Granska språk och struktur".
