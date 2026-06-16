# Fritidsjakten

App för fritidshemmet – samlar pedagogens planering och elevernas egna uppdrag
på ett ställe. Byggd med Vite + React + TypeScript + Tailwind. Inget konto, ingen
inloggning och ingen databas behövs – allt innehåll ligger i appen och egna teman
sparas lokalt i webbläsaren.

## Moduler

1. **Temabanken** – välj tema och åldersgrupp, få färdiga aktiviteter. Skolans egna teman kan läggas till (sparas i `localStorage`).
2. **Aktivitetsgeneratorn** – filtrera på inne/ute, antal elever, tidsåtgång och material.
3. **Dagens kompisuppdrag** – ett nytt snällt uppdrag varje dag (samma för alla, väljs utifrån datum).
4. **Uppdragskort** – eleverna öppnar själva, väljer kategori och drar ett uppdrag.
5. **Veckoplaneraren** – fyll i årskurs, tema och antal elever och få ett färdigt mån–fre-schema.
6. **Rörelsebanken** – lekar sorterade efter yta och årstid.

## Utveckling

```bash
cd fritidsjakten
npm install
npm run dev      # startar Vite-dev-servern
npm run build    # produktionsbygge till dist/
```

Från repo-roten finns även `npm run fritids:dev` och `npm run fritids:build`.

## Deploy

Egen Vercel-config i `vercel.json` med `ignoreCommand` som bara triggar deploy när
filer i `fritidsjakten/` ändras.
