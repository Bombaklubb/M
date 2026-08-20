# Teknikjakten

Elevapp för teknik i årskurs 4–6. Samma arkitektur och känsla som SO-jakten,
men med teknikinnehåll. Ingen inloggning – all progress sparas i `localStorage`
per enhet (nycklar med prefixet `tj_`).

Innehållet följer bokens sju delar. Boken är sammanhållen för åk 4–6 och delar
inte in stoffet per årskurs, så appen har inget årskursval – eleven börjar
direkt på områdesvalet.

**Status:** appen är färdig och de sju områdena är upplagda, men kapitlen är
inte skrivna än. Ett område utan kapitel döljs för eleven.

| Område | id | Kapitel |
|---|---|---|
| Vad är teknik? | `grunder` | – |
| Bostadens teknik | `bostad` | – |
| Teknik i vardagen | `vardag` | – |
| Teknikutveckling | `utveckling` | – |
| Teknik i rörelse | `rorelse` | – |
| Tekniska system | `system` | – |
| Digital teknik | `digital` | – |

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

## Lägga till ett kapitel

1. Skapa filen `src/data/chapters/<område>.ts` och exportera en `Chapter[]`.
2. Importera listan i `src/data/areas.ts` och lägg den i `ALL_CHAPTERS`.
3. Höj `chapterCount` för området i `src/data/areaMeta.ts`.
4. Kör `npm run check`.

**Namnregeln för id är strikt:** `<område>-<kapitel>`, till exempel
`rorelse-enkla-maskiner`. `areaId` måste matcha områdesdelen – `npm run check`
stoppar annars bygget, och samma kontroll fångar om `chapterCount` glidit isär
från antalet kapitel.

Ett kapitel räknas som klart när det har en `summary` med alla fält plus 10
övningar. Bygg hellre färre kompletta kapitel än många halvfärdiga: ett område
utan kapitel döljs helt, så eleven möter aldrig en återvändsgränd.

## Struktur

```
src/
  components/           vyer, flikar (tabs/) och övningstyper (exercises/)
  contexts/AppContext   all appstate och navigering
  data/areaMeta.ts      områdenas namn, färger och kapitelantal
  data/chapters/        ett kapitelfil per område
  data/areas.ts         alla kapitel + urvalsfunktioner
  utils/storage.ts      progress i localStorage, versionshanterad
  utils/theme.ts        områdesfärger härledda ur accentHex
scripts/check.mjs       innehållskontroll
```

`areaMeta.ts` hålls skild från `areas.ts` med flit. Startsidan (`AreaSelect`)
behöver bara metadatan och räknar elevens progress ur kapitel-id:ts prefix, så
kapiteldatan hamnar i de vyer som laddas med `React.lazy` och hämtas först när
eleven valt ett område. Sökrutan läser alla kapitel och laddas därför också
lazy, först när eleven öppnar den.

Ett nytt område kräver **ingen CSS** – färgerna räknas fram ur `accentHex` i
`utils/theme.ts`.

## Deploy

Egen Vercel-config i `vercel.json` med `ignoreCommand` så att bara ändringar i
`teknikjakten/` triggar deploy. **Deploya aldrig utan att användaren ber om det.**
