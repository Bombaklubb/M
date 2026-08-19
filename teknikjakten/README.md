# Teknikjakten

Elevapp för teknik i årskurs 4–6. Samma arkitektur och känsla som SO-jakten,
men med teknikinnehåll. Ingen inloggning – all progress sparas i `localStorage`
per enhet (nycklar med prefixet `tj_`).

**Status:** appen är färdig men innehållet är tomt. Områden och kapitel läggs in
när innehållsförteckningen är klar (se nedan).

## Kom igång

```bash
npm install
npm run dev
```

| Kommando | Gör |
|---|---|
| `npm run dev` | Startar utvecklingsservern |
| `npm run build` | Bygger till `dist/` |
| `npm run lint` | ESLint (fångar bl.a. hooks efter villkorlig return) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run check` | Innehållskontroll – dubbletter, id-regler, tomma kombinationer |

Kör alla fyra kontrollerna innan varje commit.

## Lägga till ett område

Områdenas färger räknas fram ur `accentHex` i `src/utils/theme.ts`, så ett nytt
område kräver **ingen ny CSS**. Lägg till en post i `src/data/areaMeta.ts`:

```ts
{
  id: 'material',
  name: 'Material och konstruktion',
  shortName: 'MK',
  emoji: '🧱',
  accentHex: '#c2410c',   // områdets basfärg
  inkHex: '#431407',      // mörk textfärg mot ljus bakgrund
  progressHex: '#c2410c', // progressbarer och markerade flikar
}
```

## Lägga till ett kapitel

1. Skapa filen `src/data/ak<årskurs>/<område>.ts` och exportera en `Chapter[]`.
2. Importera listan i `src/data/areas.ts` och lägg den i `ALL_CHAPTERS`.
3. Kör `npm run check`.

**Namnregeln för id är strikt:** `ak<årskurs>-<område>-<kapitel>`, till exempel
`ak4-material-hallfasthet`. `grade` måste matcha siffran i id:t och `areaId`
områdesdelen – `npm run check` stoppar annars bygget.

Ett kapitel räknas som klart när det har en `summary` med alla fält plus 10
övningar. Bygg hellre färre kompletta kapitel än många halvfärdiga: ett område
utan kapitel i en årskurs döljs helt, så eleven möter aldrig en återvändsgränd.

## Struktur

```
src/
  components/           vyer, flikar (tabs/) och övningstyper (exercises/)
  contexts/AppContext   all appstate och navigering
  data/areaMeta.ts      områdenas namn och färger (utan kapitelinnehåll)
  data/areas.ts         alla kapitel + urvalsfunktioner
  utils/storage.ts      progress i localStorage, versionshanterad
  utils/theme.ts        områdesfärger härledda ur accentHex
scripts/check.mjs       innehållskontroll
```

`areaMeta.ts` hålls skild från `areas.ts` med flit: `AppContext` behöver bara
metadatan, så kapiteldatan hamnar i ett eget paket som hämtas först när eleven
valt årskurs. Alla vyer utom startsidan laddas med `React.lazy`.

## Deploy

Egen Vercel-config i `vercel.json` med `ignoreCommand` så att bara ändringar i
`teknikjakten/` triggar deploy. **Deploya aldrig utan att användaren ber om det.**
