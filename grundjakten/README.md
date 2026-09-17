# Grundjakten

För elever på mellanstadiet som ligger på ungefär årskurs 1-nivå: elever som
inte kan bokstävernas ljud eller namn, inte kan läsa och inte kan skriva.

Appen finns för att svara på frågan **"vad gör de här eleverna när resten av
klassen läser och skriver texter?"**

## Tre principer som styr all design

1. **Ingenting kräver läsning.** Navigation, instruktioner och feedback bärs
   av ikoner, bilder, färg och tal. Varje övningsskärm har en stor
   öronknapp. Testet är: en vuxen som inte kan svenska ska kunna ta sig
   igenom appen.
2. **Åldersadekvat, inte barnsligt.** Tioåringar sitter bredvid klasskamrater
   som ser deras skärm. Inga pastellfärger, inga rundade "småbarnstypsnitt",
   ingen maskot. Nivåer heter **Steg 1–8**, aldrig "årskurs 1".
3. **Ett pass slutar alltid i framgång.** Ett missat svar ger inget avdrag –
   uppgiften kommer tillbaka senare i passet. Efter andra missen lotsas
   eleven till rätt svar. Det finns inga procent och inga poängsatser i
   elevgränssnittet.

## Köra lokalt

```bash
npm install
npm run dev        # http://localhost:5176
npm run typecheck
npm run build
```

## Lärarläge

Håll inne **G-loggan** uppe till vänster i två sekunder, ange PIN (standard
`1234`). Där kan du:

- sätta elevens **nivå** (1–4), som styr vilka övningstyper som dyker upp
- sätta och låsa **bokstavssteget** (1–8)
- se vilka bokstäver som sitter, och de tio senaste passen
- testa att den svenska rösten fungerar på datorn
- spara och läsa in backup

## Ljudet, och dess begränsning

Allt tal går via Chromes inbyggda talsyntes. Det fungerar bra för
bokstavsNAMN och för ord, men **Chrome kan inte uttala klusiler isolerat** –
den lägger på ett schwa och säger "bö" i stället för /b/.

Därför är `sound: null` för b, d, g, k, p, t i `src/data/letters.ts`, och de
lärs ut via nyckelordet ("B som i boll") i övningstypen *välj bilden som
börjar på B*, som fungerar perfekt utan isolerat fonem. Ljudprogressionen är
byggd så att steg 1–6 nästan bara innehåller vokaler och uthållbara
konsonanter, där talsyntesen duger.

### Lägga till riktiga inspelningar

1. Lägg filen i `public/audio/letters/snd-b.mp3`
2. Lägg till `'snd-b': true` i `src/data/audioManifest.ts`

Klart. `soundTokenFor()` börjar använda inspelningen och `hasIsolatedSound()`
börjar returnera true för B, vilket automatiskt låser upp de svårare
övningstyperna för den bokstaven. **Ingen komponent behöver ändras.**

## Var data ligger

Allt sparas i webbläsarens localStorage under prefixet `grundjakten_`. Det
betyder att **framstegen försvinner om eleven byter Chromebook eller om
skolan rensar webbläsardata.** Spara en backup från lärarläget då och då.

## Status

Byggt: bokstavsmodulen, skrivmodulen, elevprofiler, lärarläge.
Inte byggt än: parallellspåret "Klassens tema" (kortet finns men leder
tillbaka hem), samt siffror och räkning.
