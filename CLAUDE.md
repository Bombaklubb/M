# CLAUDE.md – Bombaklubb Monorepo

## Repo
- GitHub: Bombaklubb/M (monorepo – alla appar i samma repo)
- En GitHub-repo, separata Vercel-projekt per app

---

## Appar i detta repo

| App | Mapp | Vercel-projekt | Teknik |
|---|---|---|---|
| Mattejakten | `/matematik` | mattejakten | Vite + React |
| Engelskajakten | `/engelska` | engelskajakten | Next.js |
| Läsjakten | `/lasforstaelse` | lasjakten | (se sin vercel.json) |
| Källkritik | `/kallkritik` | källkritik | (se sin vercel.json) |

---

## GRUNDREGEL – En aktiv app åt gången

Du arbetar alltid i **exakt en** apps mapp åt gången.

Innan du gör något, identifiera vilken app som är aktiv utifrån vad användaren frågar om.

**Du får aldrig:**
- redigera filer i en annan apps mapp
- läsa filer från en annan app utan explicit begäran
- committa kod som tillhör fel app
- deploya till fel Vercel-projekt
- blanda kod mellan appar

---

## Säkerhetskontroll innan varje åtgärd

Innan du redigerar, skapar, tar bort filer, committar eller deployar – verifiera:

1. Vilken app är aktiv just nu?
2. Tillhör filerna den aktiva appen?
3. Kan ändringen påverka en annan app?

Vid osäkerhet: **fråga användaren innan du agerar**.

---

## Git-regler

- Alla appar delar samma git-repo och remote (`origin`)
- `git add` och `git commit` får bara inkludera filer från den aktiva appen
- Kontrollera alltid `git diff --staged` innan commit för att säkerställa att inga filer från andra appar råkat inkluderas
- Branch-namngivning för features: `app/beskrivning`, t.ex. `matematik/ny-nivå`

---

## Vercel deployment

Varje app har egen `vercel.json` med `ignoreCommand` som kontrollerar att bara relevanta ändringar triggar deployment.

**Deployment sker BARA när användaren uttryckligen ber om det.**

Giltiga kommandon från användaren:
- "Deploya Mattejakten"
- "Deploya Engelskajakten"
- "Deploy the project"

Deploy aldrig utan explicit begäran.

---

## Mappstruktur

```
/M (repo-root)
  /matematik         ← Mattejakten (Vite + React)
  /engelska          ← Engelskajakten (Next.js)
  /lasforstaelse     ← Läsjakten
  /kallkritik        ← Källkritik
  /scripts           ← Delade build-scripts (ej appkod)
  package.json       ← Root-scripts, berör ej applogik
  vercel.json        ← Root Vercel-config
  CLAUDE.md          ← Denna fil
```

Arbeta **aldrig** i en annan apps mapp än den aktiva.

---

## Miljövariabler

- `.env`-filer tillhör respektive app och delas aldrig mellan appar
- Kopiera aldrig `.env` från en app till en annan

---

## Kodprinciper

- Håll ändringar små och kontrollerade
- Undvik onödig refaktorering
- Prioritera stabilitet och läsbarhet
- Kommentera viktig logik
- Fråga användaren om en ändring är stor eller riskfylld

---

## Sammanfattning

Du arbetar alltid i **en app åt gången**.

Du får **aldrig** modifiera en annan app, deploya till fel Vercel-projekt, eller committa kod från fel app.

Allt arbete stannar strikt inom den aktiva appens mapp.
