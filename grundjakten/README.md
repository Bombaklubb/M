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

## Dagens uppdrag

Appens framsida. En knapp, fem steg, fem minuter:

1. **Läs ordet** – avkodning (ljudning på nivå 1–2)
2. **Välj rätt bild** – ord ↔ bild
3. **Läs meningen** – meningsläsning, bedöms inte
4. **Svara** – läsförståelse, meningen står kvar
5. **Skriv** – bygg meningen av ordkort

Uppdrag 2–5 delar **samma mening**, så eleven möter samma ord i bild, i
mening, i fråga och i bygge. Fyra möten med ett ord på fem minuter gör mer
för ordförrådet än fem lösryckta övningar.

Allt genereras ur `data/sentences.ts` (sex mallar × tre ordbanker) och
elevens egen ordbank. Inga uppdrag är handskrivna, så de tar aldrig slut.
Ramberättelsen om Leo och nyckeln ligger i `data/story.ts` och går fram ett
avsnitt per dag – att göra uppdraget flera gånger samma dag ger XP men
spolar inte fram berättelsen.

Två regler i meningsdatan måste hålla, annars lär appen ut fel svenska:
varje sak och djur bär sitt genus (`en`/`ett`), och platser lagras i bestämd
form eftersom mallarna alltid säger "till skolan" / "i skogen".

### Varför ordkort och inte fritt skrivfält

Fri text går inte att rätta automatiskt. En mening byggd av kort går: appen
kan kontrollera ordföljd, stor bokstav och att punkten hamnar sist – de tre
sakerna eleven faktiskt ska lära sig här. Fritt skrivande hör hemma i ett
läge där du som lärare läser texten, och det är inte byggt.

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

Byggt: Dagens uppdrag, bokstavsmodulen, skrivmodulen, elevprofiler, lärarläge.
Inte byggt än: parallellspåret "Klassens tema" (kortet finns men leder
tillbaka hem), ordförrådsspåret, stavningsreglerna, samt siffror och räkning.
