# Matteträning ÅK 1-9

En komplett webbapp för matematikträning anpassad för svenska grundskolan (årskurs 1-9) enligt Lgr22.

## Funktioner

### För elever
- **Öva mer** - Automatgenererade övningar med omedelbar feedback
  - Addition, subtraktion, multiplikation, division
  - Algebra och mönster (anpassat efter årskurs)
  - Sammanfattning efter 10 uppgifter

- **Repetition** - Lektioner och genomgångar
  - De fyra räknesätten med uppställning
  - Enhetsomvandling (längd, massa, volym)
  - Algebra från saknade tal till ekvationer

- **Rika problem** - Öppna problem på tre nivåer
  - E (grundläggande)
  - C (utvecklad)
  - A (avancerad)
  - 8 teman inklusive algebra/samband

- **Utmaning** - Svårare problem
  - Logiska problem
  - Talmönster
  - Algebra-pussel
  - Geometri-utmaningar

- **Min statistik** - Följ din egen utveckling

### För lärare
- Översikt över alla elever
- Filtrera efter årskurs
- Se elevers detaljerade statistik
- Bedöm rika problem (på väg / godtagbart / starkt)
- Ge personlig återkoppling

## Teknisk stack

- **Frontend:** Next.js 14 + TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Next.js API routes
- **Databas:** JSON-fil (utveckling) / Vercel KV (produktion)
- **Autentisering:** Enkel kod-baserad inloggning

## Installation (lokal utveckling)

```bash
# Klona repot
git clone <repo-url>
cd mattetraning

# Installera dependencies
npm install

# Skapa testdata
npm run seed

# Starta utvecklingsservern
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000) i din webbläsare.

## Deploy till Vercel

1. Pusha koden till GitHub
2. Gå till [vercel.com](https://vercel.com) och importera repot
3. Lägg till en **KV Database** under Storage i Vercel-dashboarden
4. Deploya projektet
5. Gå till `https://din-app.vercel.app/api/seed` för att skapa testdata

### Environment Variables (sätts automatiskt av Vercel KV)
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

## Testinloggning

### Lärare
- `LARARE123` - Anna Andersson
- `LARARE456` - Erik Eriksson

### Klasskoder (för elever)
- `3A2024` - Klass 3A (årskurs 3)
- `6B2024` - Klass 6B (årskurs 6)
- `9C2024` - Klass 9C (årskurs 9)

## Projektstruktur

```
src/
├── components/     # Återanvändbara komponenter
├── lib/            # Databaslogik och hjälpfunktioner
│   ├── db.ts           # JSON-databas
│   ├── taskGenerator.ts # Uppgiftsgenerator
│   ├── lessons.ts      # Lektionsinnehåll
│   ├── richProblems.ts # Rika problem
│   └── challenges.ts   # Utmaningar
├── pages/          # Next.js sidor
│   ├── api/        # API endpoints
│   ├── elev/       # Elevsidor
│   └── larare/     # Lärarsidor
└── styles/         # CSS
```

## Matematikområden

Samma områden används ÅK 1-9 med ökande svårighetsgrad:

1. Tal & taluppfattning
2. De fyra räknesätten
3. Problemlösning
4. Geometri
5. Algebra & mönster
6. Mätning & enheter
7. Statistik & sannolikhet
8. Resonemang & kommunikation

## Årskursanpassning

### Lågstadiet (ÅK 1-3)
- Talområde upp till 100-1000
- Konkreta representationer
- Enkla mönster och saknade tal
- Grundläggande enheter

### Mellanstadiet (ÅK 4-6)
- Talområde till tusentals, decimaler
- Multiplikation och division
- Enkla uttryck och ekvationer
- Alla enhetsomvandlingar

### Högstadiet (ÅK 7-9)
- Negativa tal, potenser
- Avancerade ekvationer
- Proportionalitet och linjära samband
- Sannolikhet och statistik

## Scripts

```bash
npm run dev      # Starta utvecklingsserver
npm run build    # Bygg för produktion
npm run start    # Starta produktionsserver
npm run seed     # Skapa testdata
```

## Vidareutveckling

Appen är byggd för att enkelt kunna utökas med:
- Fler uppgifter per kategori
- Fler lektioner
- Fler rika problem-teman
- Fler utmaningar
- Extern databas (PostgreSQL, etc.)
- Användarkonton med säker autentisering

## Licens

MIT
