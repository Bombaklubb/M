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
4. **Eleven bestämmer takten, och allt syns utan att scrolla.** Passet byter
   aldrig uppgift av sig självt: när svaret är rätt tänds en grön pil i
   listen längst ned, och den ska tryckas. En elev som behöver tio sekunder
   på sig att se att hon svarade rätt hann inte med när skärmen bytte efter
   900 ms, och hon kan inte läsa sig till vad som hände.

   Övningsskärmen är exakt en skärmhöjd hög och scrollar aldrig. En elev som
   inte kan läsa vet inte att man kan dra uppåt – en knapp hon inte ser är en
   knapp som inte finns. Därför är storlekarna satta för en Chromebook med
   omkring 560 px synlig yta, och växer först på högre skärmar.

## Inloggning

Samma modell som Svenskajakten: eleven skriver sitt namn för att **börja
eller fortsätta**. Samma namn ger samma profil, med nivå och framsteg kvar.

En skillnad som målgruppen kräver: en elev som inte kan läsa kan inte heller
skriva sitt namn själv. Därför ligger de elever som redan finns på enheten
överst som stora ansikten – ett tryck och hon är inne. Namnfältet under är
för första gången, och då är det oftast läraren som fyller i det.

Appen återupptar senast inloggad elev vid start. **Logga ut** uppe till höger
är vägen tillbaka till inloggningen – utan den gick den aldrig att nå igen
efter första gången, och en Chromebook som delas av två–tre elever kunde inte
byta mellan dem. Placeringen är hämtad från Svenskajakten.

Eleven kan **byta figur** när som helst, genom att trycka på sitt eget
ansikte: antingen det lilla uppe till höger eller det stora på
framstegssidan. Samma tolv figurer som vid inloggningen, och valet sparas
direkt – ingen bekräftelse på något hon redan ser resultatet av.

## Startskärmen

Tre kort i den ordning läraren vill ha dem: **Övningar**, **Bokstäver**,
**Skriva**. Headern följer Svenskajakten – märket och appens namn till
vänster, och till höger *Om Grundjakten*, kistorna, elevens ansikte, elevens
namn och *Logga ut*.

Märket är en egen SVG (`components/GrundjaktenLogo.tsx`): ett A som står på
tre block. Namnet betyder just det – grunderna, det allt annat vilar på. Ritad
som SVG och inte som emoji, eftersom emoji renderas olika på olika system och
det här är appens enda fasta identitet.

Märket sitter längst till vänster i sidhuvudet på **varje** sida
(`components/AppMarke.tsx`) och går alltid hem. Det ger en fast punkt: var
eleven än hamnat finns samma bild på samma plats, och den leder tillbaka till
de tre korten.

Undantaget är **övningsskärmen**. Där finns redan en hus-knapp längst ned, och
en andra väg ut mitt i en uppgift är något en elev kan trycka på av misstag
och tappa passet på.

Ansiktet och namnet är **två knappar**, inte en, eftersom de leder olika
vägar. Båda behåller full tryckyta; två mål i samma knapp vore fel för en elev
med motoriska svårigheter.

## Om Grundjakten

En sida för **läraren**, byggd som Svenskajaktens: färgad hero överst och
därefter kort med emoji, rubrik och text. Eleven kan inte läsa den, och
behöver inte – allt hon behöver går att höra eller se som bild inne i appen.
Det är därför också appens enda skärm med löpande text.

## Kistor och utmärkelser

Motivationsdelen, byggd som Svenskajaktens.

**Kistor** nås via kist-ikonen i headern, som bär en röd siffra när något är
oöppnat – siffran är det enda som lockar en elev som inte kan läsa. En oöppnad
kista är stor, skakar, och det finns inget annat att göra med den än att
trycka. Öppningen ger poäng, och silver och guld kan dessutom ge en utmärkelse.

| Kista | Ges vid |
|---|---|
| 📦 Träkista | varje avklarat pass |
| 🪙 Silverkista | 5, 10 och 25 pass, samt 250 poäng |
| 🏆 Guldkista | 15, 40, 60 och 100 pass, samt 700, 1350 och 2700 poäng |

Varje pass ger en kista *och* milstolparna ger silver och guld ovanpå: täta
små framgångar för en elev som behöver dem, och något att jobba mot.

Varje milstolpe bokförs i `progress.utdelade` och kan bara betalas en gång.
Det är vad som hindrar en kedjereaktion – en öppnad kista ger poäng, som kan
passera nästa poängmilstolpe, som ger en ny kista.

**Utmärkelserna** ligger på framstegssidan, tolv stycken. Kraven räknas på
sådant appen faktiskt mäter: avklarade pass, bemästrade bokstäver, klarade
uppgifter, dagar i rad. Låsta visas som hänglås med sitt krav – att se vad som
finns kvar är halva motivationen – och varje utmärkelse har ett öra som säger
antingen vad som krävs eller att den är klar.

Regeln ligger som en funktion bredvid sin egen beskrivning i
`data/belohningar.ts`. Skrevs de på två ställen kunde texten och villkoret
glida isär, och eleven skulle se ett krav hon redan uppfyllt stå kvarlåst.

En utmärkelse tas aldrig ifrån eleven, inte ens om villkoret skulle sluta
gälla. Samma princip som bästa resultat per uppgift.

## Mina framsteg

Elevens namn står uppe till höger på startskärmen, och ett tryck där öppnar
hennes egen översikt: nivå, bokstäver hon kan, klarade övningar med bästa
resultat, kistor och dagar i rad.

Sidan visar bara vad hon **klarat**, aldrig hur många fel hon haft — samma
regel som belöningsskärmen. Varje avsnitt har ett öra som säger vad det visar,
och varje siffra läses upp.

## Övningsbanken

97 **namngivna** uppgifter, grupperade i Svenska 1–4 precis som i lärarens
egen lista. Skillnaden mot passen i Bokstäver och Skriva: de genereras
utifrån elevens steg, medan de här går att peka ut. Du kan säga "gör
Alfabetet – Första bokstaven 2" och eleven hittar exakt den.

Innehållet varierar ändå mellan gångerna — varje uppgift byggs om ur sin
ordbank vid start, så samma namn ger inte samma ord två dagar i rad.

Varje uppgift har ett **öra** bredvid sig som läser upp namnet. Det sitter
utanför kortet, inte i det: en knapp får inte ligga i en annan knapp, och örat
ska gå att trycka utan att uppgiften startar.

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

Visningen går **långsamt med flit**: två sekunder per drag och drygt två
sekunders paus mellan dragen. Takten är satt efter en elev som ska hinna följa
pennan med blicken, inte efter vad som ser bra ut. Farten är jämn (`linear`),
inte mjukt bromsande — en `ease-out` rusar igång och saktar in på slutet,
alltså snabbast just i början av draget, som är precis den del eleven ska lära
sig.

Visningen är också undantagen från `prefers-reduced-motion`. Den regeln
stänger av all annan animation i appen, men den här rörelsen **är**
undervisningen: utan den ritas bokstaven färdig direkt och skrivriktningen
syns aldrig. Takten är långsam och förutsägbar, vilket är det inställningen
egentligen skyddar mot.

Knappar: sudda, visa hur man gör igen, och klar.

## Köra lokalt

```bash
npm install
npm run dev        # http://localhost:5176
npm run typecheck
npm run build
```

## Nivå och steg sköter sig själva

Det finns **inget lärarläge**. Appen har inga inställningar alls — den ställer
in sig efter eleven medan hon arbetar.

- **Bokstavssteget** (1–8) höjs när minst 80 % av stationens bokstäver sitter.
- **Nivåbandet** (1–4), som styr vilka övningstyper som dyker upp, höjs efter
  antal bemästrade bokstäver: band 2 vid 6, band 3 vid 13, band 4 vid 25.
  Talen är satta mot bokstavsresan — band 2 infaller när station 1 är klar och
  eleven kan ljuda sol, arm och mor.

Bandet **sänks aldrig**. Samma princip som bästa resultat per uppgift: det en
elev en gång har visat att hon klarar ska inte kunna tas ifrån henne av en
dålig dag.

Det finns ingen varning för saknad svensk röst. Den som fanns läste
`speechSynthesis.getVoices()` en enda gång under render, och eftersom Chrome
fyller röstlistan asynkront tändes den vid varje kall sidladdning – även på
Chromebooks som har rösten. Den visade alltså fel och togs bort.
`hasSwedishVoice()` ligger kvar i `lib/speech.ts`; det var anropsstället som
var felet, inte funktionen.

### Vad som försvann med lärarläget

Lärarläget togs bort på begäran, och med det två saker som inte finns någon
annanstans:

- **Ingen backup.** Se *Var data ligger* nedan — det finns inget sätt att
  spara undan eller flytta en elevs framsteg.
- **Ingen väg att ta bort en elev.** Ansiktena på inloggningssidan ligger kvar
  även när en elev slutar. Enda sättet är att rensa webbläsardata, och det tar
  alla elever på enheten.

Båda går att bygga tillbaka utan ett lärarläge om de blir ett problem.

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
skolan rensar webbläsardata** — och sedan lärarläget togs bort finns ingen
backupfunktion kvar. Det är den kända risken med appen.

## Status

Byggt: bokstavsmodulen, skrivmodulen, övningsbanken med 97 namngivna
uppgifter i Svenska 1–4, elevprofiler med inloggning och framstegssida.

Borttaget på begäran: Klassens tema (parallellspåret med NO/SO/engelska) och
lärarläget. Båda ligger kvar i git-historiken.

Inte byggt än: korsorden, och matematikspåret (siffror och räkning).
