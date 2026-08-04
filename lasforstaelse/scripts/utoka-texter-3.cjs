#!/usr/bin/env node
//
// Sats 3: fem tunna texter i åk 7–8, med omskrivna frågor.

const fs = require('fs');
const path = require('path');

const NYA = {

// ── åk 8, 135 → ~550 ord ────────────────────────────────────────────────
'ak8-tema-003-c': {
  text: `Bilen har förändrat hur människor lever och rör sig. När bilen blev vanlig under 1900-talet ökade möjligheten att resa längre sträckor snabbt. Det påverkade var människor kunde bo och arbeta. Städer växte och vägnät byggdes ut.

Att bilen blev var mans egendom hängde ihop med hur den tillverkades. Genom löpande band kunde en bil byggas på en bråkdel av tiden, och priset sjönk så mycket att en vanlig arbetare kunde köpa en. Det som tidigare varit en lyxvara för ett fåtal blev på några decennier en förutsättning för vardagen.

Städerna byggdes om efter bilen. Bostadsområden anlades utanför centrum, affärer flyttade till stormarknader vid infarterna och stora ytor avsattes till parkering. En förändring som sällan märks är hur mycket plats en bil tar: den står stilla omkring nittio procent av dygnet, men behöver ändå en uppställningsplats både hemma och vid resmålet.

Ett välkänt problem är att nya vägar ofta fylls igen. När en väg breddas blir det till en början snabbare att köra, vilket får fler att välja bilen och andra att flytta längre bort. Efter några år är köerna tillbaka. Fenomenet kallas inducerad efterfrågan och är en av anledningarna till att trafikproblem sällan löses genom att bara bygga mer väg.

Samtidigt har bilen också haft negativa effekter. Utsläpp från bensin- och dieseldrivna bilar bidrar till luftföroreningar och klimatförändringar. Föroreningarna handlar inte bara om koldioxid: avgaser och slitagepartiklar från däck och bromsar påverkar luftvägarna hos dem som bor nära trafikerade gator.

Trafikolyckor är ett annat problem som påverkar många människor varje år. Globalt dör över en miljon människor i trafiken årligen, och det är en av de vanligaste dödsorsakerna bland unga. Bältet, krockkudden och lägre hastigheter i tätort hör till de åtgärder som visat sig rädda flest liv.

Idag pågår en omställning mot mer hållbara alternativ. Elbilar blir allt vanligare och utvecklingen går snabbt framåt. Elbilen löser dock inte allt. Den släpper inte ut avgaser, men kräver batterier vars mineraler måste brytas någonstans, och den tar exakt lika stor plats i gatubilden som en bensinbil.

Många länder satsar på kollektivtrafik och cykelvägar för att minska bilberoendet. Vissa städer bygger om gator så att avstånden till skola, arbete och affär blir korta nog att gå eller cykla. Sådana förändringar möter ofta motstånd i början, eftersom de kräver att något annat får mindre utrymme.

Möjligheten att välja bort bilen ser olika ut beroende på var man bor. I en tätort med täta bussturer är det ett verkligt val. På en landsbygd där skolan, vårdcentralen och affären ligger flera mil bort är bilen ofta en förutsättning för att vardagen ska gå ihop. Diskussionen om bilberoende blir därför lätt missvisande om den förs som om alla hade samma alternativ.

För unga människor kan bilen symbolisera frihet, men också ansvar. Att köra bil kräver kunskap om regler och hänsyn till andra trafikanter. I flera länder har andelen unga som tar körkort minskat, delvis för att kostnaderna stigit och delvis för att kontakt med vänner inte längre kräver att man förflyttar sig.

En återkommande iakttagelse är att beslut om vägar och bebyggelse binder upp framtiden. En stadsdel som byggts med långa avstånd och breda leder går inte att göra om i efterhand utan mycket stora ingrepp. Valen som gjordes för femtio år sedan styr därför fortfarande hur människor kan ta sig fram i dag.

Bilens roll i framtiden är fortfarande osäker, men det är tydligt att förändringar behövs för att minska dess negativa påverkan.`,
  questions: [
    { type: 'literal', q: 'Vad gjorde att bilen blev tillgänglig för vanliga löntagare?',
      options: ['Att staten införde bidrag till alla bilköpare', 'Att löpande band sänkte tillverkningstiden och priset', 'Att bränslet blev betydligt billigare under perioden', 'Att bilarna byggdes mindre och därmed enklare'], correct: 1 },
    { type: 'ord', q: 'Vad betyder "inducerad efterfrågan" i texten?',
      options: ['Att en bredare väg lockar fler att köra tills köerna återvänder', 'Att efterfrågan på bilar styrs av hur mycket reklam som visas', 'Att bilköpare påverkas av vad deras grannar väljer att köpa', 'Att staten styr efterfrågan genom skatter på drivmedel'], correct: 0 },
    { type: 'inferens', q: 'Varför nämner texten att en bil står stilla omkring nittio procent av dygnet?',
      options: ['För att visa att bilar håller längre än man tror', 'För att förklara varför elbilar laddas på natten', 'För att peka på hur mycket yta parkering kräver', 'För att motivera varför bilar bör delas mellan hushåll'], correct: 2 },
    { type: 'inferens', q: 'Vilken invändning mot elbilen lyfter texten?',
      options: ['Att den är dyrare att köra än en bensinbil', 'Att den inte klarar långa sträckor i kyla', 'Att den ger ifrån sig mer slitagepartiklar', 'Att den kräver mineraler och tar lika stor plats'], correct: 3 },
    { type: 'literal', q: 'Vad anges som skäl till att färre unga tar körkort?',
      options: ['Att teoriprovet har blivit betydligt svårare', 'Att kostnaderna stigit och kontakt inte kräver förflyttning', 'Att kollektivtrafiken blivit gratis för unga i flera länder', 'Att arbetsgivare sällan efterfrågar körkort längre'], correct: 1 },
    { type: 'sammanfatta', q: 'Vilken helhetssyn på bilen ger texten?',
      options: ['Att bilen bör avvecklas helt så snart det är möjligt', 'Att bilens problem löses av tekniken av sig själv', 'Att bilen gett frihet men format samhället på sätt som är svåra att ändra', 'Att bilen framför allt är ett problem för luftkvaliteten i städer'], correct: 2 },
  ],
},

// ── åk 7, 138 → ~515 ord ────────────────────────────────────────────────
'ak7-tema-034': {
  text: `Stress är en naturlig reaktion i kroppen som uppstår när vi känner oss hotade eller pressade. När vi upplever stress aktiveras kroppens alarmsystem, vilket gör att pulsen ökar och vi blir mer alerta.

Reaktionen styrs av hormoner. Först frisätts adrenalin, som verkar på några sekunder: pulsen stiger, andningen blir snabbare och pupillerna vidgas. Något senare kommer kortisol, som håller kroppen i beredskap under längre tid genom att frigöra socker till blodet.

Samtidigt nedprioriteras det som inte behövs just då. Blodet omfördelas till de stora musklerna, matsmältningen saktar ner och immunförsvaret dämpas. Det är därför magen kan kännas konstig inför något obehagligt, och en av förklaringarna till att den som är långvarigt stressad blir förkyld oftare.

Systemet utvecklades för att hantera akuta faror. Om hotet var ett rovdjur var kroppens svar precis rätt: energin behövdes för att springa eller slåss, och efteråt sjönk nivåerna tillbaka. Problemet är att kroppen svarar likadant på ett prov, ett gruppchattmeddelande eller en oro inför framtiden, alltså situationer där ingen fysisk handling avslutar hotet.

Kortvarig stress kan vara hjälpsam, till exempel inför ett prov eller en tävling. Den kan ge extra energi och fokus. Forskning visar att prestationen förbättras med stigande anspänning upp till en viss punkt, men försämras igen om anspänningen blir för hög. Den som är helt oberörd presterar alltså ofta sämre än den som är lagom nervös.

Men långvarig stress kan påverka hälsan negativt och leda till problem som sömnsvårigheter och koncentrationssvårigheter. När vilan uteblir hinner kroppen aldrig återgå till utgångsläget. Det kan visa sig som huvudvärk, magbesvär, irritation eller en känsla av att inte orka bry sig om sådant man tidigare tyckte om.

Sömnen är särskilt utsatt. Stress gör det svårare att somna, och för lite sömn gör i sin tur att man tål stress sämre dagen efter. Det blir en cirkel som kan vara svår att bryta på egen hand.

Det finns olika sätt att hantera stress. Att planera sin tid, ta pauser och prata med någon kan minska stressnivån. Fysisk aktivitet och avslappningstekniker som djupandning kan också hjälpa. Rörelse fungerar delvis för att den ger kroppen den fysiska urladdning som den var förberedd för.

Det är viktigt att känna igen signaler på stress i tid. Genom att lyssna på kroppen kan man undvika att stressen blir överväldigande. Signalerna ser olika ut för olika personer: en del blir rastlösa och snabba, andra tysta och trötta.

Det är värt att skilja mellan att ha mycket att göra och att vara stressad. Uppgifter behöver inte kännas betungande om man känner att man har kontroll över när de ska göras. Att inte kunna påverka sin situation väger ofta tyngre än själva mängden.

Ibland räcker inte egna strategier. Om besvären håller i sig i veckor, påverkar skolan eller gör att man drar sig undan andra, är det ett skäl att prata med en vuxen, skolsköterskan eller elevhälsan.

Hur mycket press någon tål varierar mellan personer och mellan perioder i livet. Samma schema kan kännas hanterbart en termin och tungt en annan. Det är alltså inget tecken på svaghet att reagera starkare än någon annan.

Att förstå hur kroppen reagerar på stress kan hjälpa oss att må bättre och hantera utmaningar i vardagen.`,
  questions: [
    { type: 'literal', q: 'Vilken skillnad finns mellan adrenalin och kortisol enligt texten?',
      options: ['Adrenalin dämpar kroppen medan kortisol höjer pulsen', 'Adrenalin verkar på sekunder, kortisol håller beredskapen längre', 'Adrenalin frisätts först vid långvarig stress', 'Adrenalin påverkar sömnen medan kortisol påverkar magen'], correct: 1 },
    { type: 'inferens', q: 'Varför blir den som är långvarigt stressad förkyld oftare?',
      options: ['För att stress gör att man rör sig mindre utomhus', 'För att kortisol drar till sig bakterier i blodet', 'För att immunförsvaret dämpas när kroppen är i beredskap', 'För att sömnbrist gör att kroppstemperaturen sjunker'], correct: 2 },
    { type: 'inferens', q: 'Vad är det centrala problemet med stressreaktionen i dag enligt texten?',
      options: ['Att kroppen slutat producera de hormoner som behövs', 'Att reaktionen numera utlöses långsammare än förr', 'Att människor har blivit känsligare än tidigare generationer', 'Att dagens hot sällan avslutas av någon fysisk handling'], correct: 3 },
    { type: 'literal', q: 'Vad visar forskningen om sambandet mellan anspänning och prestation?',
      options: ['Prestationen förbättras upp till en punkt och försämras sedan', 'Prestationen blir bäst när man är helt oberörd', 'Prestationen sjunker så fort anspänningen börjar stiga', 'Prestationen påverkas inte alls av hur nervös man är'], correct: 0 },
    { type: 'inferens', q: 'Varför beskrivs sömn och stress som en cirkel?',
      options: ['För att båda styrs av samma hormon i kroppen', 'För att stress stör sömnen, och sömnbrist sänker stresståligheten', 'För att den som sover mycket blir mer stressad av vila', 'För att sömnbehovet varierar över dygnet i en fast rytm'], correct: 1 },
    { type: 'sammanfatta', q: 'Vad är textens huvudbudskap?',
      options: ['Att all stress bör undvikas så långt det går', 'Att stress är ofarlig så länge man sover tillräckligt', 'Att stress är en normal reaktion som går att förstå och hantera', 'Att stress bara drabbar personer som planerar sin tid dåligt'], correct: 2 },
  ],
},

// ── åk 7, 139 → ~515 ord ────────────────────────────────────────────────
'ak7-tema-029': {
  text: `Under 1800-talet gjordes många viktiga upptäckter inom vetenskapen. En av dessa var utvecklingen av elektricitet som energikälla. Forskare experimenterade med olika sätt att producera och använda elektricitet, vilket ledde till stora förändringar i samhället.

Utvecklingen skedde i steg. Kring år 1800 byggde Alessandro Volta det första batteriet, vilket för första gången gav en jämn ström att experimentera med. Några decennier senare visade Michael Faraday att en magnet som rör sig nära en spole skapar ström. Den upptäckten är grunden för generatorn, och därmed för nästan all elproduktion som används i dag.

Det dröjde dock innan upptäckterna blev till något användbart. Att förstå en princip i ett laboratorium är en sak; att bygga kraftverk, dra ledningar och tillverka lampor billigt nog att sälja är en annan. Mellan Faradays experiment och de första elektriska gatlyktorna gick ungefär femtio år.

Tidigare var människor beroende av ljus från eld och stearinljus. Med elektricitet kunde man skapa lampor som lyste upp hela rum. Detta gjorde det möjligt att arbeta och studera även efter solens nedgång. Gatubelysningen förändrade också städerna: gator som tidigare varit folktomma efter mörkrets inbrott kunde användas på kvällarna, och känslan av otrygghet minskade.

Elektriciteten användes också i fabriker, vilket ökade produktionen och effektiviteten. Maskiner kunde drivas snabbare och mer exakt än tidigare. En avgörande skillnad var att varje maskin kunde få en egen motor. Tidigare hade alla maskiner i en fabrik drivits av remmar från en enda kraftkälla, vilket band fabriken till ett vattendrag och tvingade fram en viss planlösning.

Detta bidrog till ekonomisk tillväxt men också till nya sociala utmaningar. Eftersom belysningen gjorde det möjligt att arbeta dygnet runt infördes skiftarbete i många fabriker. Det gav fler arbetstillfällen, men innebar också att människors dygnsrytm styrdes av produktionen snarare än av dagsljuset.

Många människor flyttade till städer för att arbeta i fabriker. Detta ledde till trångboddhet och ibland svåra levnadsförhållanden. Samtidigt skapades nya möjligheter och innovationer.

Elektriciteten spreds ojämnt. Städerna fick el först, medan landsbygden i Sverige i vissa fall fick vänta ända in på 1900-talets mitt. Under lång tid levde alltså människor i samma land med helt olika vardag: i staden fanns ljus, spårvagn och elektriska maskiner, medan gården några mil bort fortfarande lyste med fotogenlampa.

Under slutet av 1800-talet pågick dessutom en strid om vilken sorts ström som skulle användas. Likström fungerade bra på korta avstånd men förlorade kraft snabbt, medan växelström kunde transporteras långt genom att spänningen först höjdes och sedan sänktes igen. Växelströmmen vann, och det är därför el i dag kan produceras i ett kraftverk långt från de hushåll som använder den.

I hemmen märktes förändringen först i taket och sedan överallt. Efter lampan kom strykjärnet, dammsugaren och så småningom kylskåpet. Apparater som i dag framstår som självklara innebar då att arbetsuppgifter som tagit timmar kunde göras på en bråkdel av tiden, vilket förändrade vardagen särskilt för dem som skötte hushållet.

Den historiska utvecklingen av elektricitet visar hur en upptäckt kan förändra världen på både positiva och negativa sätt. Den visar också att tekniska genombrott sällan får verkan direkt, och att de sällan når alla samtidigt.`,
  questions: [
    { type: 'literal', q: 'Vad visade Michael Faraday?',
      options: ['Att ström kan lagras i ett batteri under lång tid', 'Att glödlampan behöver en tunn tråd av kol', 'Att en magnet i rörelse nära en spole skapar ström', 'Att elektricitet kan ledas genom luft under vissa villkor'], correct: 2 },
    { type: 'inferens', q: 'Varför dröjde det ungefär femtio år mellan upptäckten och gatlyktorna?',
      options: ['För att uppfinnarna höll sina resultat hemliga', 'För att en princip i labbet måste bli billig teknik i verkligheten', 'För att myndigheterna förbjöd elektricitet i städerna', 'För att det saknades metaller att tillverka ledningar av'], correct: 1 },
    { type: 'literal', q: 'Vilken avgörande skillnad innebar elektriciteten för fabrikerna?',
      options: ['Varje maskin kunde få en egen motor', 'Fabrikerna kunde byggas i flera våningar', 'Arbetarna behövde inte längre stå vid maskinerna', 'Maskinerna kunde tillverkas av lättare material'], correct: 0 },
    { type: 'inferens', q: 'Varför nämner texten skiftarbetet som en följd av belysningen?',
      options: ['För att visa att arbetet blev mindre farligt i mörker', 'För att förklara varför fabrikerna flyttade till städerna', 'För att motivera varför lönerna steg under perioden', 'För att visa att produktionen började styra människors dygnsrytm'], correct: 3 },
    { type: 'literal', q: 'Hur spreds elektriciteten i Sverige?',
      options: ['Jämnt över hela landet under samma decennium', 'Först på landsbygden och därefter in mot städerna', 'Städerna först, medan landsbygden fick vänta långt in på 1900-talet', 'Endast i de områden som låg nära vattenkraft'], correct: 2 },
    { type: 'sammanfatta', q: 'Vilken slutsats om tekniska genombrott drar texten?',
      options: ['Att de sällan verkar direkt och sällan når alla samtidigt', 'Att de nästan alltid skapar fler problem än de löser', 'Att de bara är möjliga när flera forskare samarbetar', 'Att de får störst effekt i länder med stora städer'], correct: 0 },
  ],
},

// ── åk 8, 139 → ~550 ord ────────────────────────────────────────────────
'ak8-tema-018': {
  text: `Människans intresse för rymden har funnits i tusentals år, men det var först under 1900-talet som tekniken gjorde det möjligt att resa dit. Under rymdkapplöpningen tävlade stormakter om att nå viktiga milstolpar, som att skicka upp satelliter och landa på månen.

Startskottet kom 1957, när Sovjetunionen sköt upp Sputnik 1. Satelliten var liten och gjorde inte mycket mer än att sända en signal, men den visade att en raket kunde nå omloppsbana. I USA väcktes oro, eftersom samma teknik som lyfte en satellit också kunde bära en robot med kärnvapen. Rymdkapplöpningen var därför lika mycket en militär och politisk tävling som en vetenskaplig.

Utvecklingen gick sedan snabbt. År 1961 blev Jurij Gagarin den första människan i rymden, och 1969 landade Apollo 11 på månen. Att det tog bara tolv år från den första satelliten till den första månlandningen förklaras till stor del av de enorma resurser som lades på projekten.

Rymdforskning har lett till många tekniska framsteg. Satelliter används idag för kommunikation, väderprognoser och navigation. Genom teleskop kan forskare studera avlägsna galaxer och få kunskap om universums utveckling. Mycket av detta märks i vardagen utan att man tänker på det: kartan i telefonen fungerar för att flera satelliter samtidigt skickar signaler som mottagaren jämför för att räkna ut sin position.

Satelliterna används också för att övervaka jorden själv. De mäter havsnivåer, isarnas utbredning, skogsavverkning och temperaturer. En stor del av kunskapen om klimatförändringarna bygger på mätningar som bara går att göra från rymden.

Samtidigt är rymdfärder kostsamma och innebär risker. Astronauter utsätts för faror som strålning och extrema temperaturer. Utanför jordens magnetfält saknas det skydd som finns på marken, och vid längre vistelser förlorar kroppen dessutom muskelmassa och benmassa eftersom tyngdkraften inte längre belastar den.

Trots detta fortsätter forskningen, eftersom den kan ge svar på stora frågor om universum och livets ursprung.

Ett växande problem är skräpet. Efter decennier av uppskjutningar kretsar hundratusentals fragment runt jorden. Eftersom de rör sig i mycket hög hastighet kan även en liten skruv skada en satellit allvarligt, och varje kollision skapar nya fragment.

På senare tid har även privata företag börjat engagera sig i rymdresor. Detta har lett till nya möjligheter men också nya diskussioner om regler och ansvar. Konkurrensen har pressat ned kostnaden för att skjuta upp last, bland annat genom raketsteg som kan landa och användas igen. Samtidigt väcker det frågor om vem som ska bestämma över omloppsbanorna, som ingen enskild stat äger.

Sedan år 2000 har den internationella rymdstationen varit bemannad utan avbrott. Stationen drivs gemensamt av flera länder, däribland sådana som samtidigt har spända politiska relationer på jorden. Den har därför blivit ett exempel på att samarbete kan fortsätta inom ett område även när det är svårt inom andra.

Forskningen ombord handlar bara delvis om rymden i sig. Eftersom kroppen bryts ned snabbare i tyngdlöshet fungerar stationen som ett laboratorium för att förstå benskörhet och muskelförlust, tillstånd som drabbar många äldre på jorden. Också material och läkemedel testas där, eftersom vissa processer beter sig annorlunda utan tyngdkraft.

Kostnadsfrågan har följt rymdfarten hela vägen. Kritiker har återkommande invänt att pengarna skulle göra mer nytta på jorden, medan förespråkare pekar på att satelliterna i dag är en förutsättning för allt från flygtrafik till katastrofvarningar.

Rymdens utforskning visar människans nyfikenhet och vilja att förstå det okända.`,
  questions: [
    { type: 'inferens', q: 'Varför väckte Sputnik oro i USA enligt texten?',
      options: ['För att satelliten kunde fotografera hemliga anläggningar', 'För att signalen störde amerikanska radiosändningar', 'För att samma raketteknik kunde bära kärnvapen', 'För att Sovjetunionen vägrade dela sina forskningsresultat'], correct: 2 },
    { type: 'literal', q: 'Hur fungerar kartan i telefonen enligt texten?',
      options: ['Mottagaren jämför signaler från flera satelliter samtidigt', 'En satellit fotograferar telefonen uppifrån med jämna mellanrum', 'Telefonen skickar upp en signal som studsar tillbaka från rymden', 'Positionen räknas ut av master på marken och skickas till satelliten'], correct: 0 },
    { type: 'inferens', q: 'Varför förlorar astronauter benmassa vid längre vistelser?',
      options: ['För att strålningen bryter ner benvävnaden direkt', 'För att kosten ombord saknar tillräckligt med kalcium', 'För att luften i rymdfarkosten är alltför torr', 'För att tyngdkraften inte längre belastar skelettet'], correct: 3 },
    { type: 'literal', q: 'Varför är även små fragment av rymdskrot farliga?',
      options: ['För att de innehåller radioaktiva ämnen', 'För att de rör sig i mycket hög hastighet', 'För att de kan störa satelliternas radiosignaler', 'För att de faller ner och skadar byggnader på marken'], correct: 1 },
    { type: 'inferens', q: 'Vilken ny fråga har de privata företagen väckt?',
      options: ['Om astronauter bör få betalt för sina uppdrag', 'Om raketer bör byggas av lättare material än förut', 'Om vem som ska bestämma över omloppsbanorna', 'Om forskning bör prioriteras framför turism i rymden'], correct: 2 },
    { type: 'sammanfatta', q: 'Vilken bild av rymdforskningen ger texten som helhet?',
      options: ['Att den främst drivits av ren vetenskaplig nyfikenhet', 'Att den blivit onödig sedan satelliterna kom på plats', 'Att den bör överlåtas helt till privata företag', 'Att den ger kunskap och nytta men också nya problem'], correct: 3 },
  ],
},

// ── åk 8, 139 → ~550 ord ────────────────────────────────────────────────
'ak8-tema-019': {
  text: `Kultur handlar om de värderingar, traditioner och uttryck som människor delar. Det kan handla om språk, musik, mat och sätt att leva. Kultur formas både av historiska händelser och av nutida influenser.

En viktig sak att förstå är att kultur inte ärvs biologiskt utan lärs in. Ett barn som växer upp i en annan miljö än sina föräldrar tar till sig den miljöns språk och vanor. Det är därför kultur kan förändras mellan generationer, och varför den aldrig är knuten till hur någon ser ut.

Forskare brukar likna kulturen vid ett isberg. Ovanför ytan finns det som syns direkt: kläder, mat, högtider och musik. Under ytan ligger det som sällan sägs rakt ut men som styr mycket: uppfattningar om hur nära man står när man pratar, hur man visar respekt, vad som räknas som artigt att fråga om. Det är oftast under ytan som missförstånd uppstår.

Identitet är hur en person ser på sig själv och sin plats i världen. Den påverkas av faktorer som familj, vänner, samhälle och erfarenheter. Många människor har flera kulturella tillhörigheter samtidigt.

Identiteten är dessutom sällan densamma i alla sammanhang. De flesta växlar mellan olika sätt att prata och uppträda beroende på om de är hemma, i skolan eller med kompisar. Att växla mellan språk eller uttryckssätt på det viset kallas kodväxling, och är något de flesta gör utan att tänka på det.

I dagens globaliserade värld möts olika kulturer oftare än tidigare. Detta kan leda till ökad förståelse, men också till konflikter om värderingar och normer. Därför är det viktigt med respekt och dialog.

Globaliseringen drar åt två håll samtidigt. Å ena sidan blir vissa saker mer lika överallt: samma kedjor, samma appar, samma serier. Å andra sidan uppstår hela tiden nya blandformer, där något lokalt möter något utifrån och blir till en tredje sak som inte fanns förut.

Kultur förändras ständigt. Nya idéer och influenser blandas med gamla traditioner. Till exempel kan musik från olika delar av världen kombineras och skapa nya genrer.

Även traditioner som känns urgamla har ofta en historia som är kortare än man tror. Många av de högtidsseder som i dag beskrivs som uråldriga fick sin nuvarande form under 1800- eller 1900-talet, ibland i samband med att nationer ville stärka en gemensam identitet.

När kulturuttryck rör sig mellan grupper uppstår ibland diskussion om vem som får använda vad. Frågan handlar sällan om själva utbytet, som alltid har förekommit, utan om maktförhållandet: om den grupp som uttrycket kommer ifrån får erkännande, eller om andra tjänar på det medan ursprunget glöms bort.

Språket har en särskild plats i sammanhanget. När ett språk slutar föras vidare till barnen försvinner inte bara orden, utan också berättelser, uttryck och sätt att beskriva världen som inte har någon exakt motsvarighet i ett annat språk. I Sverige har flera minoritetsspråk, bland dem samiska, meänkieli och romani, ett särskilt skydd i lag just av det skälet.

Att kulturer möts är i sig inget nytt. Handelsvägar, migration och erövringar har i alla tider fört samman människor och blandat deras seder. Det som skiljer vår tid är hastigheten: en idé, en låt eller ett uttryckssätt kan i dag spridas över världen på några dagar i stället för under generationer.

Genom att förstå både sin egen och andras kultur kan människor bygga broar och skapa ett mer inkluderande samhälle.`,
  questions: [
    { type: 'inferens', q: 'Varför betonar texten att kultur lärs in i stället för att ärvas?',
      options: ['För att visa att skolan har ansvar för all kulturöverföring', 'För att förklara varför språk är svåra att lära sig som vuxen', 'För att visa att kultur kan förändras och inte hör ihop med utseende', 'För att motivera varför traditioner bör dokumenteras noga'], correct: 2 },
    { type: 'ord', q: 'Vad menas med kodväxling enligt texten?',
      options: ['Att växla sätt att prata och uppträda beroende på sammanhang', 'Att översätta ord mellan två språk i huvudet innan man talar', 'Att byta namn när man flyttar till ett annat land', 'Att lära sig ett hemligt språk tillsammans med vänner'], correct: 0 },
    { type: 'inferens', q: 'Varför uppstår missförstånd oftast under isbergets yta?',
      options: ['För att det som finns där är svårare att lära sig utantill', 'För att outtalade förväntningar sällan sägs rakt ut', 'För att språket alltid är svårast att uppfatta korrekt', 'För att människor medvetet döljer sina värderingar'], correct: 1 },
    { type: 'literal', q: 'Vilka två motsatta effekter har globaliseringen enligt texten?',
      options: ['Kulturer försvinner helt eller bevaras utan förändring', 'Vissa saker blir mer lika samtidigt som nya blandformer uppstår', 'Handeln ökar medan människors rörlighet minskar', 'Språken blir färre medan traditionerna blir fler'], correct: 1 },
    { type: 'inferens', q: 'Vad vill texten visa med att många traditioner är yngre än de verkar?',
      options: ['Att gamla seder bör återinföras i sin ursprungliga form', 'Att högtider tappat sin betydelse under 1900-talet', 'Att forskare sällan är överens om traditioners ursprung', 'Att även det som känns självklart och tidlöst har formats av sin tid'], correct: 3 },
    { type: 'forfattarens-syfte', q: 'Hur beskriver texten kärnan i diskussionen om vem som får använda vad?',
      options: ['Att allt kulturutbyte bör undvikas för säkerhets skull', 'Att frågan i grunden handlar om erkännande och maktförhållanden', 'Att bara den som fötts in i en kultur får använda dess uttryck', 'Att diskussionen är ny och saknar historisk motsvarighet'], correct: 1 },
  ],
},
};

const BAND = { 7: [500, 530], 8: [530, 570], 9: [570, 590], 10: [590, 625] };
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;
Object.entries(NYA).forEach(([id, data]) => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error('Hittar inte ' + id); ok = false; return; }
  t.text = data.text;
  t.questions = data.questions;
  const n = data.text.trim().split(/\s+/).length;
  t.meta = { ...(t.meta || {}), wordCount: n };
  const b = BAND[t.grade];
  const inom = n >= b[0] && n <= b[1];
  if (!inom) ok = false;

  data.questions.forEach((q, i) => {
    const m = q.q.match(/"([^"]+)"/);
    if (q.type === 'ord' && m && !data.text.toLowerCase().includes(m[1].toLowerCase())) {
      console.error(`  VARNING: ${id} f${i + 1} – "${m[1]}" saknas i texten`); ok = false;
    }
  });

  console.log(`${id.padEnd(17)} åk${String(t.grade).padEnd(3)} ${String(n).padStart(4)} ord ${inom ? '✅' : '❌ krav ' + b[0] + '–' + b[1]}  facit:${data.questions.map(q => q.correct).join('')}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
if (!ok) process.exit(1);
