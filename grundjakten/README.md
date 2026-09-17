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

## Klassens tema

Parallellspåret. Eleven arbetar med **samma ord som resten av klassen**, men
via lyssna-och-peka, bildstöd och ordbygge i stället för löpande text.

Tre lägen: *Lyssna och välj*, *Para ihop* och *Lyssna på texten* (uppläst
minitext med bildfrågor). Ett läge som temat inte räcker till visas inte
alls — hellre färre kort än ett kort som leder till en tom skärm.

Ett temapass är åtta uppgifter: fem från temat och tre från elevens vanliga
bokstavsspår. Fonikträningen ska inte pausas för att eleven jobbar med SO.

Läraren väljer tema i lärarläget. Valet gäller **hela enheten**, inte en
enskild elev — det är klassens aktuella ämne. Är inget valt visar
temaskärmen en uppmaning i stället för en övning.

### Färdiga teman

Tolv stycken i `data/themes/curated.ts`: Vattnets kretslopp, Kroppen, Djur i
Sverige, Växter, Rymden, Väder och årstider, Vikingatiden, Stenåldern,
Sverige, Animals, Food and drink, My family and home.

Orden är medvetet **konkreta**, eftersom bildlagret är emoji. "Avdunstning"
och "demokrati" har ingen bild och hör inte hemma här — de tas muntligt av
läraren. Det är den uttalade kompromissen: eleven arbetar med klassens tema,
men med temats gripbara ord.

Ett nytt tema skrivs kompakt med `defineTheme` — ett ord är `['skepp', '⛵']`,
resten (grafem, talsyntes-token, svarsalternativ) härleds.

### Eget tema

För när klassen jobbar med något banken inte täcker. Läraren skriver namn
och 6–10 ord; emoji föreslås automatiskt ur `data/emojiIndex.ts` (skriv
"räv" → 🦊, och bestämd form som "skolan" hittar stammen).

**Ord utan bild tas inte bort — de ger bara färre övningstyper.** Ett ord med
bild ger fyra typer, ett utan ger en (Bygg ordet). Redigeraren visar detta
per ord medan du skriver, så att degraderingen syns i stället för att kännas
godtycklig.

Grafemuppdelningen visas också som chips, eftersom den *gissas*: `sj` hålls
ihop, och `sk` är ett ljud i "sked" men två i "skog". Den blir ibland fel, och
då ska du kunna se det.

Egna teman får inga minitexter — de kräver frågor med bildsvar och blir för
mycket att fylla i. De ger ordövningar i stället.

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

Byggt: Dagens uppdrag, bokstavsmodulen, skrivmodulen, Klassens tema med
färdiga och egna teman, elevprofiler, lärarläge.

Inte byggt än: ordförrådsspåret (synonymer, motsatsord, kategorisera),
stavningsreglerna (dubbelteckning, ng/nk, sj/tj, e/ä, o/å, j-ljud — alla sex
är samma övningstyp med olika ordbanker), grammatikspåret, samt siffror och
räkning.
