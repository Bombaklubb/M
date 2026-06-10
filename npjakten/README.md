# NP-jakten

Träna inför nationella proven i svenska för årskurs 3, 6 och 9.

- **Läsa:** läsförståelse med berättande texter och sakprosa i provens format
- **Skriva:** berättelse och argumenterande text med skrivyta och självbedömning

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

Varje fil har formen `{ "reading": [...], "writing": [...] }`. Lägg till en ny text
eller skrivuppgift genom att kopiera ett befintligt objekt i listan och byta ut
innehållet – ingen kod behöver ändras. Fältens betydelse beskrivs i `src/types.ts`.

Allt textinnehåll är nyskrivet övningsmaterial – endast struktur och utseende följer de nationella provens format.
