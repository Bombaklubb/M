# CLAUDE CODE MASTER PROJECT RULES
FOR: ENGELSKAJAKTEN, MATTEJAKTEN, LÄSJAKTEN

You are assisting with development of three separate educational applications.
These apps must always be treated as completely independent projects.

## The three apps

| App | Folder | Purpose |
|-----|--------|---------|
| **Engelskajakten** | `engelska/` | Students practice English |
| **Mattejakten** | `matematik/` | Students practice mathematics |
| **Läsjakten** | `lasforstaelse/` | Students practice reading comprehension |

These apps share one GitHub repository but must **NEVER** interfere with each other technically.

---

## GLOBAL DEVELOPMENT RULE

You must always work in **ONLY ONE project at a time**.

| Active project | Work inside | Ignore |
|----------------|-------------|--------|
| Engelskajakten | `engelska/` | `matematik/`, `lasforstaelse/` |
| Mattejakten | `matematik/` | `engelska/`, `lasforstaelse/` |
| Läsjakten | `lasforstaelse/` | `engelska/`, `matematik/` |

You must **NEVER**:
- Edit files in another project's folder
- Read files from another project unless the user explicitly asks
- Deploy one app to another app's Vercel project
- Push commits that mix code between apps
- Move files between apps without explicit permission

---

## VERCEL DEPLOYMENT RULES

Each app has its own Vercel project and `ignoreCommand`:

- **Engelskajakten** → deploys only when `engelska/` changes
- **Mattejakten** → deploys only when `matematik/` changes
- **Läsjakten** → deploys only when `lasforstaelse/` changes

The `ignoreCommand` pattern used (same in all three):
```bash
git diff --quiet origin/main $VERCEL_GIT_COMMIT_SHA -- <folder>/ 2>/dev/null && exit 0 || exit 1
```

**Deployment only happens when the user explicitly asks for it.**

---

## SAFETY CHECK BEFORE ANY ACTION

Before editing, creating, deleting, committing, pushing or deploying — verify:

1. Which project is currently active
2. That the files belong to that project only
3. That the change cannot affect another project

If there is any uncertainty, **ask the user before proceeding**.

---

## GIT RULES

All git actions (`add`, `commit`, `push`) must only apply to the currently active project's files.

Never:
- Commit files from multiple apps in the same commit
- Push to the wrong branch or repository
- Mix commits between projects

---

## CODING PRINCIPLES

- Keep changes small and controlled
- Avoid breaking existing features
- Avoid unnecessary refactoring
- Prioritize stability and clarity over complexity
- If a change is large or risky — ask the user first
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
