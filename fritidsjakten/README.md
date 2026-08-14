# Fritidsjakten

App för fritidshemmet – samlar pedagogens planering och elevernas egna uppdrag
på ett ställe. Byggd med Vite + React + TypeScript + Tailwind. Inget konto, ingen
inloggning och ingen databas behövs – allt innehåll ligger i appen och egna teman
sparas lokalt i webbläsaren.

## Moduler

1. **Temabanken** – 26 teman med färdiga aktiviteter, alla med läroplanskoppling. Skolans egna teman kan läggas till (sparas i `localStorage`).
2. **Aktivitetsgeneratorn** – filtrera bland 50 lekar på inne/ute, antal elever, tidsåtgång och material.
3. **Dagens kompisuppdrag** – ett nytt snällt uppdrag varje dag (samma för alla, väljs utifrån datum).
4. **Uppdragskort** – eleverna öppnar själva, väljer kategori och drar ett uppdrag.
5. **Veckoplaneraren** – välj tema och antal elever och få ett färdigt mån–fre-schema.
6. **Rörelsebanken** – lekar sorterade efter yta och årstid.
7. **Temadagar** – 12 färdiga veckoupplägg för högtider och temadagar, alla med läroplanskoppling.
8. **Värdegrundskort** – diskussionsfrågor och dilemman för kompissamtal och samling.

Startsidan har dessutom en **Idag-panel** med "Ge mig en lek NU", dagens
kompisuppdrag och tre dagsförslag baserade på senast sparade filter.

## Personuppgifter

Appen samlar inte in några personuppgifter. Det finns ingen inloggning, ingen
databas, inga kakor och ingen analys-/spårningskod. Pedagogens egna teman och
uppdrag sparas enbart i den egna webbläsaren (`localStorage`, nycklar med
prefixet `fritids_`) och lämnar aldrig datorn.

Typsnittet Nunito är självhostat via `@fontsource-variable/nunito`, så appen
gör inga anrop till externa tjänster – den fungerar även utan internet när den
väl laddats.

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
