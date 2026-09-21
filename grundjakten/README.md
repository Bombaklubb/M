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

   Samma tanke styr **berömmet**. Vid rätt svar dyker en positiv emoji upp,
   och den står kvar på full styrka i drygt en sekund innan den tonar bort –
   totalt 1800 ms (`BEROM_MS` i `components/FeedbackOverlay.tsx`). Tidigare
   låg emojin i samma element som den gröna blixten och tvingades tona bort i
   dess takt; den nådde aldrig ens full styrka, och var tydlig i 116 ms.
   Läraren rapporterade att eleverna inte hann uppfatta den, och mätningen
   gav henne rätt.

   Blixten och emojin är därför **skilda element** med var sin animation.
   Blixten är kvar på 700 ms – den är signal, inte innehåll – och den gröna
   pilen tänds när den slocknar, precis som förut. Emojin ligger sedan kvar
   ovanpå den tända pilen. Överlägget är `pointer-events-none`, så en elev
   som redan är klar kan trycka vidare medan bilden fortfarande syns.

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

Knappen döljs på **telefonbredd** (under 640 px). Skolans enhet är
Chromebooken, och där syns den alltid; det är på telefonen sidhuvudet blir
trångt, och utloggning är det enda i raden som bara läraren behöver. Den är
dold med CSS och inte borttagen – samma bygge, samma knapp, bara inte på den
skärm där den kostar mest plats.

Eleven kan **byta figur** när som helst, genom att trycka på sitt eget
ansikte uppe till höger och sedan på det stora ansiktet på framstegssidan.
Samma tolv figurer som vid inloggningen, och valet sparas direkt – ingen
bekräftelse på något hon redan ser resultatet av.

## Startskärmen

Tre kort i den ordning läraren vill ha dem: **Övningar**, **Bokstäver**,
**Skriva**. Headern följer Svenskajakten – märket och appens namn till
vänster, och till höger *Om Grundjakten*, kistorna, elevens ansikte och namn
i en knapp, och *Logga ut*.

### Sidhuvudet på telefon

Sju saker i en rad blir rörigt på 360 px. Ikonerna krymper därför från 56 px
till 44 px under `sm` (640 px), texten *Grundjakten* och etiketterna döljs,
och *Logga ut* försvinner helt. Kvar blir en enda jämn rad på 44 px i stället
för tre staplade rader på 118 px.

44 px är ett medvetet undantag från husregeln om 56 px tryckytor. Det är
fortfarande WCAG:s miniminivå, och det gäller **bara** sidhuvudets ikoner –
det eleven trycker på i en uppgift (svarsknappar, bokstavsbrickor, öron) är
oförändrat 56 px eller större. Att låta alla sju behålla 56 px var det som
tvingade fram tre rader, och tre rader var det läraren rapporterade som
rörigt.

På Chromebooken (1366 px) gäller inget av detta: full storlek, alla
etiketter, en rad. Den skrivna etiketten är dock *Om* och inte *Om
Grundjakten* – märket står redan till vänster i samma rad, och det längre
ordet sköt ut hela huvudet på tre rader även där. Uppläsningen säger
fortfarande hela namnet.

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

### Flikikon och länkbild

Samma märke sitter i webbläsarfliken (`public/favicon.svg`). A:et är ritat
som en **path**, inte som `<text>`: en favicon renderas isolerat från sidan,
så Google-fonten finns inte att tillgå där. Den gamla ikonen bad om *Outfit*
och fick ett systemtypsnitt i stället – och var dessutom ett **G**, bokstaven
som togs bort ur appen i övrigt.

Vid sidan av SVG:n ligger `ikon-16`, `ikon-32` och `ikon-180` som PNG. Alla
lägen läser inte SVG-favicons: Teams, Outlook och en del äldre webbläsare
visar en grå platshållare i stället. PNG-raderna är för dem.

`lankbild.png` (1200×630) är det som syns när adressen klistras in i en chatt,
tillsammans med `og:`-taggarna i `index.html`. Appen delas mellan kollegor
via länk, och en länk utan bild ser ut som skräppost.

Ikonerna genereras ur SVG:n och är incheckade som filer – appen har inget
byggsteg för bilder, och ett sådant vore mer att underhålla än det är värt
för fyra ikoner som ändras sällan.

## Ljud på och av

En knapp på **varje** skärm, även mitt i ett pass och på inloggningssidan.
Ljud är appens huvudkanal, så den som vill ha tyst måste kunna få det direkt
där hon är – inte leta sig till en inställningssida hon ändå inte kan läsa.

Avstängt betyder **helt** tyst: både talet och ljudeffekterna. En bock som
fortfarande piper är inte avstängt ljud. Kontrollen ligger i de två ingångar
allt passerar – `play()` i `lib/audio.ts` och `tone()` i `lib/sfx.ts` – så
ingen anropare kan glömma den.

Öronen dämpas när ljudet är av. En knapp som inte svarar ska synas vara
avstängd, annars tror eleven att appen är trasig.

Läget är **enhetsglobalt**, inte per elev: knappen syns på varje skärm och tar
ett tryck, så den som vill ha ljud slår på det direkt. Per elev hade krävt ett
värde även på inloggningssidan, där ingen är inloggad än.

Ansiktet och namnet är **en knapp**, inte två, och den leder till
framstegen. De var delade så länge de ledde olika vägar – ansiktet fällde ut
figurväljaren, namnet öppnade framstegen – men två närliggande mål som ser ut
som en enhet är svårt för en elev med motoriska svårigheter att träffa rätt i.
Ett mål är enklare än två.

Figurbytet försvann inte, det flyttade: knappen landar eleven på
framstegssidan, och där är hennes eget ansikte det största på skärmen och
byter figur när hon trycker på det. Ett tryck till, på en yta som är lättare
att träffa än den lilla i sidhuvudet.

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

## Poängrutan

Elevens samlade poäng står i en egen ruta på **båda** sidorna hon kan nå på
egen hand: framstegen och kistorna (`components/PoangRuta.tsx`). Samma
komponent på båda – samma siffra på två ställen som ser olika ut läses som
två olika siffror.

Mätaren fanns förut bara som en stapel utan siffra: "hur långt kvar" gick att
se, men inte "hur mycket jag samlat". Det är det senare eleven räknar upp för
sig själv och för sin kompis.

Siffran skrivs med tusentalsavstånd enligt svensk skrivregel (1 240) och med
`tabular-nums`, så den inte hoppar i sidled när poängen växer. På kistsidan
är den extra befogad: kistor delas ut vid poängmilstolpar, så siffran säger
hur nära nästa kista eleven är.

## Mina framsteg

Elevens namn står uppe till höger på startskärmen, och ett tryck där öppnar
hennes egen översikt: poäng, bokstäver hon kan, utmärkelser och klarade
övningar med bästa resultat.

Sidan visar bara vad hon **klarat**, aldrig hur många fel hon haft — samma
regel som belöningsskärmen. Varje avsnitt har ett öra som säger vad det visar,
och varje siffra läses upp.

Sidan hade tidigare fyra färgade statistikrutor överst – bokstäver, övningar,
kistor och dagar i rad. De är **borttagna**; läraren rapporterade att sidan
blev rörig. Tre av dem sa dessutom om det som stod strax nedanför ändå:
bokstavsrutnätet räknar bokstäverna, listan räknar övningarna, och kistorna
har en egen ikon med röd siffra i sidhuvudet.

**Dagar i rad syns därmed inte längre någonstans.** Siffran räknas fortfarande
och driver utmärkelserna, men eleven ser den inte. Det är en medveten följd av
borttagningen, inte ett förbiseende.

## Övningsbanken

97 **namngivna** uppgifter, grupperade i Svenska 1–4 precis som i lärarens
egen lista. Skillnaden mot passen i Bokstäver och Skriva: de genereras
utifrån elevens steg, medan de här går att peka ut. Du kan säga "gör
Alfabetet – Första bokstaven 2" och eleven hittar exakt den.

Innehållet varierar ändå mellan gångerna — varje uppgift byggs om ur sin
ordbank vid start, så samma namn ger inte samma ord två dagar i rad.

Samma fråga ställs **aldrig två gånger i samma pass**. Regeln låter
självklar men satt inte i koden: `buildPass` anropade sin fabrik om och om
igen utan minne, och både den och `buildFromBank` sållade bara på uppgiftens
id – som sätts av en räknare och alltid är unikt. Läraren såg "fotboll" komma
upp igen efter att eleven svarat rätt, och mätningen gav 46 upprepningar
fördelade på elva uppgifter.

Sållningen sker nu på `fraganI()` i `lib/generators/taskBuilders.ts`: det
eleven SER eller ska svara, inte uppgiftens id. Bokstavsresans egen generator
har samma sållning, och där räknas ordet som samma fråga oavsett om det ska
ljudas eller läsas – två olika uppgifter för den som byggt appen, samma ord
för eleven.

Passet blir hellre kortare än upprepande. "Veckodagar före/efter" har sju
dagar att fråga om, och då är sju frågor rätt antal, inte åtta med en
dubblett. `kollaUpprepningar()` bygger varje uppgift med fem frön och varje
bokstavspass med tre, och fäller bygget om något ord kommer igen.

Varje uppgift har ett **öra** bredvid sig som läser upp namnet. Det sitter
utanför kortet, inte i det: en knapp får inte ligga i en annan knapp, och örat
ska gå att trycka utan att uppgiften startar.

### Bilden är frågan

En elev som inte kan läsa har bara bilden att gå på. Därför gäller två regler
för bildorden i `data/banks.ts`:

1. **Bilden måste ha ett enda självklart namn, och det namnet ska vara
   ordet.** Räcker det inte till byts ordet ut, inte bilden – det finns ingen
   emoji för "ficka" eller "tak", och en närliggande bild är värre än inget.
2. **Samma bild får aldrig betyda två olika ord.** `kollaBildord()` i
   `dev/checkTasks.ts` går igenom **alla** bildkällor samtidigt – de nio
   ordlistorna, Bokstavsresans `WORDS` och gåtorna – och fäller bygget om det
   sker. Felet uppstår mellan källorna lika ofta som inom en; första
   versionen av kontrollen tittade bara i `banks.ts` och missade därför fyra
   dubbletter som satt i `words.ts`.

Saknar ett ord en egen bild sätts `emoji: null`. Ordet blir kvar, och
generatorn hoppar över de övningar som kräver bild. Det är bättre än en
lånad bild: `tak` hade 🏠, som redan var `hus`.

Båda reglerna kommer ur riktiga fel: 👖 användes för både `ficka` och `jeans`,
🪑 för både `bord` och `stol`, 🏠 för både `hus` och `tak`, 🚗 för både `bil`
och `garage`, 🍽️ för `mat`, `äta` och `restaurang`, ☀️ för både `sol` och
`dag`, 👩 för både `mor` och `dam`, och 👨 för både `far` och `man`. Läraren
hittade det första när en elev satt med byxorna på skärmen och ordet `ficka`
i örat.

Gåtan *"Jag har fyra ben men kan inte gå"* hörde till samma familj: bilden var
en stol, svaret var `bord`. Där fick bilden styra och svaret blev `stol` –
gåtan stämmer lika bra.

Samma **ord** i flera listor är däremot i sin ordning – `hus` finns både bland
korta ord och bland långa vokaler, med samma bild. Det är olika ord bakom
samma bild som är felet.

### Bildstorlek

Bilden ska vara skärmens största sak. I *Skriv ordet* låg den på 56 px och
växte först vid 760 px fönsterhöjd – lägre än ett vanligt Chrome-fönster på en
bärbar, så läraren fick den minsta varianten med 284 px oanvänd yta under.

Nu: **96 px** som grundläge, **128 px** från 700 px fönsterhöjd och **160 px**
från 760. Stegen är mätta mot alla tolv skrivuppgifter på 600, 620, 700 och
768 px höjd; även den största lämnar över 100 px luft, och ingenting hamnar
under skärmkanten.

### Stor bokstav på fristående ord

Ordbankerna är skrivna med gemener, men ett ord som står ensamt på ett kort
visas med **versal** – `stortOrd()` i `lib/utils.ts`. Ordkorten sa "bok" och
"boll"; eleven ska inte lära sig fel av det hon ser mest.

Det sker bara på **visningen**. Jämförelserna kör vidare på bankernas egna
värden, så en versal kan inte göra ett rätt svar fel. Enstaka tecken lämnas
orörda: i bokstavsövningarna ÄR gemenen innehållet, och ett skiljetecken har
ingen versal.

*Bygg meningen* var redan rätt – meningarna står med stor bokstav i datan, och
uppgiften säger själv "Stor bokstav först och punkt sist".

Veckodagar och månader får också versal på sina kort. Svensk ortografi skriver
dem med liten bokstav i löpande text, så säg till om du hellre vill undanta
dem – de ligger i samma kod och är enkla att skilja ut.

### De två ljudknapparna

Listen längst ned hade två knappar som såg likadana ut: samma turkosa platta,
samma högtalarikon, bara olika breda. Den ena stänger av allt ljud, den andra
upprepar instruktionen. Läraren rapporterade att de blandas ihop, och värsta
utfallet är tydligt – en elev som vill höra om instruktionen stänger av ljudet
i stället, och sedan svarar ingenting.

De skiljs nu åt på **tre** sätt, inte bara färg:

| | Form | Färg | Tecken |
|---|---|---|---|
| **Lyssna igen** | cirkel | turkos | 👂 |
| **Ljud på/av** | rundad fyrkant | vit (gul när avstängt) | högtalare |

Örat är appens tecken för "lyssna" på varenda annan knapp, så den stora
lyssna-knappen bär det nu också. Turkos är reserverat för att lyssna; ljud
på/av lyssnar inte, den stänger av, och är därför neutral. En lodrät avdelare
skiljer appens knappar (hem, ljud) från uppgiftens (lyssna, vidare).

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
