# Grundjakten

För elever på mellanstadiet som ligger på ungefär årskurs 1-nivå: elever som
inte kan bokstävernas ljud eller namn, inte kan läsa och inte kan skriva.

Appen finns för att svara på frågan **"vad gör de här eleverna när resten av
klassen läser och skriver texter?"**

## Tre principer som styr all design

1. **Ingenting kräver läsning.** Navigation, instruktioner och feedback bärs
   av ikoner, bilder, färg och tal. Testet är: en vuxen som inte kan svenska
   ska kunna ta sig igenom appen.

   Konkret: varje övningsskärm har en stor öronknapp längst ned, och **varje
   sak eleven kan välja mellan har ett eget litet öra** – svarsalternativ,
   bokstavsbrickor, ordkort, veckodagar, bilder. Ett alternativ utan öra är
   en gissning för någon som inte kan läsa, inte ett val.
2. **Åldersadekvat, inte barnsligt.** Tioåringar sitter bredvid klasskamrater
   som ser deras skärm. Inga pastellfärger, inga rundade "småbarnstypsnitt",
   ingen maskot. Nivåer heter **Steg 1–8**, aldrig "årskurs 1".
3. **Ett pass slutar alltid i framgång.** Ett missat svar ger inget avdrag –
   uppgiften kommer tillbaka senare i passet, och efter andra missen lotsas
   eleven till rätt svar. Belöningsskärmen visar aldrig hur många fel hon
   hade. Resultatet per övning syns däremot i övningsbanken efteråt, som ett
   bästa-resultat hon kan slå.

## Inloggning

Samma modell som Svenskajakten: eleven skriver sitt namn för att **börja
eller fortsätta**. Samma namn ger samma profil, med nivå och framsteg kvar.

En skillnad som målgruppen kräver: en elev som inte kan läsa kan inte heller
skriva sitt namn själv. Därför ligger de elever som redan finns på enheten
överst som stora ansikten – ett tryck och hon är inne. Namnfältet under är
för första gången, och då är det oftast läraren som fyller i det.

Appen återupptar senast inloggad elev vid start. **Byt elev** ligger längst
ned på framstegssidan och är vägen tillbaka till inloggningen – utan den gick
den aldrig att nå igen efter första gången. Knappen frågar en gång till innan
den släpper eleven, eftersom ett feltryck avbryter mitt i en lektion.

## Mina framsteg

Elevens namn står uppe till höger på startskärmen, och ett tryck där öppnar
hennes egen översikt: nivå, bokstäver hon kan, klarade övningar med bästa
resultat, kistor och dagar i rad.

Det här är **elevens** sida, inte lärarens. Skillnaden är medveten: lärarvyn
visar hur många fel eleven haft, den här visar bara vad hon klarat. Varje
avsnitt har ett öra som säger vad det visar, och varje siffra läses upp.

## Övningsbanken

97 **namngivna** uppgifter, grupperade i Svenska 1–4 precis som i lärarens
egen lista. Skillnaden mot passen i Bokstäver och Skriva: de genereras
utifrån elevens steg, medan de här går att peka ut. Du kan säga "gör
Alfabetet – Första bokstaven 2" och eleven hittar exakt den.

Innehållet varierar ändå mellan gångerna — varje uppgift byggs om ur sin
ordbank vid start, så samma namn ger inte samma ord två dagar i rad.

Varje klarad uppgift får en bock och sitt bästa resultat (`7/8`) direkt på
kortet, och rubriken visar hur många av nivåns uppgifter som är klara.
Bästa resultat räknas på första försöket och sänks aldrig – en elev som haft
en dålig dag ska inte se sitt bästa försvinna.

| Nivå | Uppgifter | Innehåll |
|---|---|---|
| Svenska 1 | 25 | Alfabetet, första bokstaven, ord↔bild, ljudenlig stavning, rim, räkneord, motsatsord, lägesord |
| Svenska 2 | 29 | Alfabetisk ordning, vokal/konsonant, nästa bokstav, en/ett, en/flera, adjektivformer, dubbelteckning, veckodagar, månader, gåtor |
| Svenska 3 | 31 | J-, M-, SJ-, TJ- och NG-ljudet (välj rätt stavning + skriv ordet), ordklasser, sammansatta ord, synonymer, liknelser |
| Svenska 4 | 8 | Alfabetisk ordning med lika begynnelsebokstäver, lång/kort vokal, saknat ord, skiljetecken |

### Hur det hänger ihop

Nästan hela listan är samma handfull mekaniker med olika ord. Därför ligger
orden i `data/banks.ts`, skilda från uppgifterna i `data/tasks.ts`. Att lägga
till "Skriv ordet – Frukter" är en rad i katalogen och en lista i banken, inte
en ny övningstyp.

Tre motorer bär i princip allt:

- **`quiz`** – välj bland alternativ. Bär välj rätt stavning, en/ett, den/det,
  motsatsord, synonymer, ordklasser, skiljetecken, vokal/konsonant, nästa
  bokstav, vilket ord rimmar inte, och mer.
- **`type-the-word`** – hör ordet, skriv det. Bär alla "Skriv ordet", inklusive
  siffrorna. Skärmtangentbordet finns alltid, eftersom en Chromebook kan stå
  på amerikansk layout och då saknar å, ä och ö.
- **`order-items`** – lägg i rätt ordning. Bär alfabetisk ordning, veckodagar
  och månader.

De sex ljudreglerna (J, M, SJ, TJ, NG, CK) är **samma två övningstyper med
olika ordbanker**. Alternativen i "välj rätt stavning" måste låta identiskt –
annars är det ingen stavningsövning, och det är därför banken lagrar
felstavningen tillsammans med den rätta.

### Innehållskontroll

```bash
npm run check
```

Bygger varje uppgift med tre olika frön (291 pass) och letar efter de fel som
faktiskt drabbar en elev: tomma pass, frågor utan rätt svar, två alternativ
som ser likadana ut, svar som inte går att skriva, brickor som saknas.
Kontrollen hittade till exempel att "fri som en fågel" och "glad som en
lärka" delade emoji och gjorde uppgiften omöjlig att svara rätt på.

Den kontrollerar också Bokstavsresan: att varje bokstav har exakt en station,
att inget ord blir omöjligt att nå, att varje station går att öva på i alla
tre nivåbanden (72 pass), och att **varje station låser upp minst tre ord med
bild**. Den sista regeln finns därför att station 1 en gång bara låste upp
ett – fyra bokstäver och nästan inget att göra med dem. Det syntes inte i
någon kontroll, bara som en skärm som kändes tom.

### Inte byggt

**Korsorden** (10 uppgifter i listan) saknas. De kräver ett rutnät med
korsande ord och är en egen sak att bygga — resten av banken är samma
mekanik med olika ord, korsordet är det inte.

## Bokstavsresan

Åtta stationer. Varje station låser upp några bokstäver, och kortet visar
**orden stationen ger** – med bild och med ett öra per ord. Den raden är hela
poängen med kortet: utan den ser indelningen godtycklig ut, och med den är den
självklar. S, O, L, A, R och M hör ihop därför att det är precis de bokstäver
som behövs för sol, arm, mor, orm, ram och ros.

| Station | Bokstäver | Nya ord | Ord totalt |
|---|---|---|---|
| 1 ☀️ | S O L A R M | 8 | 8 |
| 2 🦌 | I V E N | 11 | 19 |
| 3 5️⃣ | T F Ä | 5 | 24 |
| 4 🐄 | K Ö U | 14 | 38 |
| 5 🐷 | P Å G | 14 | 52 |
| 6 📖 | B D H | 15 | 67 |
| 7 🚲 | J Y C | 5 | 72 |
| 8 🏁 | X Z W Q | 4 | 76 |

### Varför ordningen inte är alfabetisk

Det här är den fråga alla ställer, så den står nedskriven. Ordningen är
**ljudordning**. Räknat ur appens egen ordbank:

| Bokstäver eleven mött | Ord hon kan läsa |
|---|---|
| Alfabetiskt A–F (två stationer) | **1** – "bad" |
| Alfabetiskt A–I (tre stationer) | **2** – bad, dag |
| S O L A R M (en station) | **8** – sal sol arm mor mos orm ram ros |

Alfabetisk ordning lägger dessutom B, C och D först. B och D är två av de sex
klusiler där talsyntesen inte klarar ljudet isolerat och säger "bö" i stället
för /b/ (se *Ljudet, och dess begränsning*). C har inget eget ljud i svenskan
och ligger därför sent.

Station 1 är den klassiska SALORM-gruppen och är större än de andra, eftersom
den måste bära de första riktiga orden.

**Alfabetet tränas ändå** – i Övningsbanken, i gruppen *Alfabetet*: alfabetisk
ordning, nästa bokstav, stor/liten bokstav. De två spåren delar upp arbetet:
Bokstavsresan lär ut ljudning, Övningar lär ut alfabetet som ordningsföljd.

### En sanning om vilken bokstav som hör till vilket steg

`PROGRESSION_STEPS` i `data/progression.ts` är enda stället indelningen
skrivs. En bokstavs `step` och ett ords `step` **härleds** därifrån
(`stepForLetter`, `stepForGraphemes`) i stället för att skrivas av för hand.

Det är inte städning: ett ords steg är per definition lägsta steg där alla
dess grafem är kända, och skrevs de 98 siffrorna av för hand skulle varje
ändring av stationerna kräva att de uppdaterades rätt – och en missad siffra
syns inte, den yttrar sig bara som att ett ord dyker upp för tidigt eller
aldrig. `stepForGraphemes` delar upp flerteckensgrafem (`ng`, `sk`, `skj`,
`rd`, `rt`, `ck`) i sina bokstäver, för ett ord går inte att läsa förrän
varenda bokstav i det är introducerad.

## Forma bokstäver

Två steg: först **visar** appen hur bokstaven skrivs, drag för drag. Sedan
ritar eleven den själv med muspekaren eller fingret, ovanpå en blek förlaga.

Bedömningen är avsiktligt generös. Målet är att följa formen och
skrivriktningen, inte att träffa en linje på pixeln – en Chromebook-
styrplatta duger inte till det, och en elev med motoriska svårigheter ska
inte fastna. Därför mäts täckningen mot punkter längs förlagan (ett kladd
utanför bokstaven sänker alltså inte resultatet), tröskeln är 60 % med bred
tolerans, och efter två försök godkänns det oavsett.

Knappar: sudda, visa hur man gör igen, och klar.

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

Byggt: bokstavsmodulen, skrivmodulen, Klassens tema med färdiga och egna
teman, övningsbanken med 97 namngivna uppgifter i Svenska 1–4,
elevprofiler med inloggning och framstegssida, lärarläge.

Inte byggt än: korsorden, och matematikspåret (siffror och räkning).
