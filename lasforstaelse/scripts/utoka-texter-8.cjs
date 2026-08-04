#!/usr/bin/env node
//
// Sats 8: fem texter i intervallet 162–167 ord, med omskrivna frågor.

const fs = require('fs');
const path = require('path');

const NYA = {

// ── åk 8, berättelse, 162 → ~550 ord ────────────────────────────────────
'ak8-tema-028': {
  text: `Mira hade alltid gillat bibliotek, men den här dagen var speciell. Hon skulle träffa sin nya studiegrupp för första gången. Gruppen bestod av Amir, som älskade historia, Elin som var intresserad av teknik och Noor som nyligen flyttat till staden.

Hon kom tjugo minuter för tidigt och satte sig vid det långa bordet längst in, där ljuset från fönstret föll snett över träskivan. Hon hade skrivit en lista över vad de skulle hinna med. Sedan strök hon över den, för det såg ut som om hon bestämde allt, och skrev en ny som var kortare.

Till en början var stämningen lite spänd. Ingen visste riktigt hur de skulle börja. Amir bläddrade i sin bok utan att läsa. Elin vred på pennan. Noor satt rak i ryggen med händerna i knäet, som om hon väntade på att någon skulle säga till henne var hon skulle sitta.

Det var Elin som bröt tystnaden, och hon gjorde det genom att säga fel namn.

"Så, Nora –" Hon avbröt sig. "Förlåt. Noor."

"Det är okej", sa Noor. "Alla säger fel först."

"Jag ska inte göra det igen", sa Elin. Och sedan gjorde hon inte det.

Efter en stund började de prata om uppgiften de fått i skolan. De skulle undersöka hur en uppfinning hade förändrat människors vardag, och de fick välja vilken själva.

De insåg snabbt att de hade olika styrkor. Amir bidrog med fakta och kunde årtal utantill. Elin förklarade tekniska begrepp så att de blev begripliga. Noor ställde frågor som fick dem att tänka djupare. Mira höll ihop arbetet och såg till att alla kom till tals.

Under arbetets gång uppstod diskussioner. Amir ville skriva om ångmaskinen. Elin tyckte att det var förutsägbart och föreslog kylskåpet i stället.

"Kylskåpet?" sa Amir. "Det är ju bara en låda som är kall."

"Det är en låda som gjorde att mat inte behövde ätas upp samma dag", sa Elin. "Tänk efter vad det betyder för någon som lagar mat till fem personer."

Det blev tyst en stund. Mira märkte att hon ville hålla med Elin, men att hon var rädd att Amir skulle bli sur. Hon sa ingenting.

Det var Noor som frågade: "Vem lagade maten då?"

Amir öppnade munnen och stängde den igen. "Kvinnorna", sa han till slut. "Nästan alltid."

"Då handlar det inte bara om mat", sa Noor.

De valde kylskåpet. Amir var den som hittade flest källor till det, och Mira lade märke till att han inte verkade sur alls, bara ivrig. Hon förstod att hon varit rädd i onödan, och att hennes tystnad inte hade hjälpt någon.

Bibliotekarien kom förbi och frågade om de hittade det de sökte. Amir bad om hjälp att hitta något om hur folk förvarade mat före kylskåpet, och fick tre böcker och en tidskrift inom fem minuter. Elin såg imponerad ut.

Ibland tyckte de fortfarande olika, men de lärde sig att lyssna och argumentera sakligt. De lärde sig också att en invändning inte var samma sak som ett angrepp.

När de var klara med uppgiften kände de stolthet. De hade inte bara lärt sig mer om ämnet, utan också om samarbete.

På vägen ut stannade Noor vid dörren. "Tack för att ni frågade vad jag tyckte", sa hon. "På förra skolan slutade jag räcka upp handen."

Mira gick hem med en ny känsla av tillhörighet och insåg att olikheter kan vara en styrka.`,
  questions: [
    { type: 'literal', q: 'Varför skrev Mira om sin lista?',
      options: ['För att hon glömt ta med en av uppgifterna', 'För att den såg ut som om hon bestämde allt', 'För att läraren hade ändrat instruktionerna', 'För att de andra redan hade gjort en lista'], correct: 1 },
    { type: 'inferens', q: 'Vad visar Elins reaktion när hon sagt fel namn?',
      options: ['Att hon tyckte att Noor var överkänslig', 'Att hon helst hade velat byta grupp', 'Att hon tog rättelsen på allvar och ändrade sig', 'Att hon alltid haft svårt för nya namn'], correct: 2 },
    { type: 'inferens', q: 'Varför sa Mira ingenting under diskussionen om kylskåpet?',
      options: ['För att hon inte hade någon åsikt i frågan', 'För att hon inte förstod vad Elin menade', 'För att hon tyckte att Amir hade rätt', 'För att hon var rädd att Amir skulle bli sur'], correct: 3 },
    { type: 'literal', q: 'Vilken fråga fick diskussionen att ändra riktning?',
      options: ['Noors fråga om vem som lagade maten', 'Amirs fråga om hur ett kylskåp fungerar', 'Elins fråga om vilka källor som fanns', 'Miras fråga om hur lång tid de hade kvar'], correct: 0 },
    { type: 'inferens', q: 'Vad insåg Mira om sin egen tystnad?',
      options: ['Att den räddade stämningen i gruppen', 'Att den inte hade hjälpt någon alls', 'Att den berodde på att hon var trött', 'Att den var det enda rätta i situationen'], correct: 1 },
    { type: 'sammanfatta', q: 'Vad säger Noors ord vid dörren om gruppen?',
      options: ['Att hon tyckte att arbetet gick för långsamt', 'Att hon helst hade velat arbeta ensam', 'Att hon vågade delta igen när hon blev tillfrågad', 'Att hon tänkte byta tillbaka till sin gamla skola'], correct: 2 },
  ],
},

// ── åk 9, 162 → ~580 ord ────────────────────────────────────────────────
'ak10-tema-005-b': {
  text: `Mänskliga rättigheter handlar inte bara om stora internationella frågor, utan också om hur människor behandlar varandra i vardagen. Det kan handla om respekt, rättvisa och möjligheten att känna sig trygg.

Samtidigt är det värt att hålla isär två saker. En rättighet i juridisk mening är något som staten är skyldig att skydda och som går att kräva, om det behövs i domstol. Att vara vänlig mot varandra är något annat: viktigt, men inte en rättighet. Om allt kallas för rättigheter blir ordet till slut för svagt för att användas när det verkligen behövs.

Rättigheter riktar sig dessutom i första hand mot staten. Det är därför de ofta formulerats som skyldigheter: staten ska inte tortera, ska inte censurera och ska se till att alla barn får gå i skolan. En privatperson kan visserligen bete sig illa mot en annan, men då är det oftast andra lagar som gäller. Skillnaden är viktig, eftersom den avgör vem man kan ställa krav på.

I skolan är mänskliga rättigheter tydligt närvarande. Elever har rätt att uttrycka sina åsikter, känna sig trygga och få en likvärdig utbildning. Lärare har ansvar att skapa en miljö där alla behandlas med respekt. I Sverige är en del av detta reglerat i skollagen: skolan är skyldig att utreda och åtgärda kränkande behandling så snart den fått veta att något hänt, och det ansvaret gäller oavsett vad den som kränkt hade för avsikt.

I arbetslivet handlar rättigheter om rättvisa villkor, säker arbetsmiljö och att inte bli diskriminerad. Det gäller både unga och vuxna. Diskrimineringslagen räknar upp sju grunder, bland dem kön, etnisk tillhörighet, funktionsnedsättning och ålder, och den som anser sig ha blivit diskriminerad kan vända sig till Diskrimineringsombudsmannen eller till sitt fackförbund.

Ett vardagsexempel är tillgänglighet. En trappa utan ramp stänger ute den som använder rullstol, oavsett om någon menat något illa med den. Sedan 2015 räknas bristande tillgänglighet som en form av diskriminering i svensk lag, vilket innebär att en verksamhet kan behöva göra skäliga åtgärder. Vad som är skäligt beror på vad det kostar och hur stor verksamheten är, och just den bedömningen är ofta det som tvistas om.

Rättigheter krockar dessutom med varandra ibland. Yttrandefriheten ger rätt att säga obekväma saker, men den skyddar inte hot eller hets mot folkgrupp. Rätten till privatliv kan stå emot pressens rätt att granska. Sådana konflikter avgörs inte genom att en rättighet alltid vinner, utan genom en avvägning i det enskilda fallet, och det är en av anledningarna till att domstolar behövs.

Mänskliga rättigheter kan också kopplas till hur vi bemöter människor i sociala situationer. Att visa respekt, lyssna och inkludera andra är viktiga delar.

I ett mångfaldigt samhälle möts människor med olika bakgrunder. Det kan skapa både möjligheter och utmaningar. Genom dialog och förståelse kan konflikter minska.

Det finns samtidigt en gräns för vad enskilda kan lösa. Den som inte får en bostad på grund av sitt efternamn, eller nekas ett arbete på grund av en funktionsnedsättning, behöver mer än välvilja från omgivningen. Rättigheter blir verkliga först när det finns regler, tillsyn och någon som kan ställas till svars.

Att känna till sina rättigheter är i sig en förutsättning för att kunna använda dem. Den som inte vet att skolan är skyldig att agera vid kränkningar kommer inte att kräva det, och den som inte vet vad ett anställningsavtal ska innehålla har svårt att märka när något saknas.

Att tänka på mänskliga rättigheter i vardagen innebär att reflektera över sina handlingar. Små val, som att säga ifrån vid orättvisor eller att inkludera någon som står utanför, kan göra stor skillnad.`,
  questions: [
    { type: 'inferens', q: 'Varför varnar texten för att kalla allting för rättigheter?',
      options: ['För att ordet då blir för svagt när det verkligen behövs', 'För att domstolarna då får för många mål att hantera', 'För att skolan annars får ett alltför stort ansvar', 'För att lagarna då skulle behöva skrivas om helt'], correct: 0 },
    { type: 'literal', q: 'När är skolan skyldig att utreda kränkande behandling?',
      options: ['När eleven själv begär det skriftligt', 'Så snart skolan fått veta att något hänt', 'När den som kränkt haft en avsikt att skada', 'När händelsen upprepats vid flera tillfällen'], correct: 1 },
    { type: 'literal', q: 'Vart kan den som anser sig ha blivit diskriminerad vända sig?',
      options: ['Till kommunens socialtjänst i första hand', 'Till polisen, som utreder alla sådana fall', 'Till Diskrimineringsombudsmannen eller sitt fackförbund', 'Till arbetsgivarens egen personalavdelning'], correct: 2 },
    { type: 'inferens', q: 'Hur avgörs konflikter mellan två rättigheter?',
      options: ['Genom att yttrandefriheten alltid ges företräde', 'Genom att den som klagar först får rätt', 'Genom att riksdagen fattar beslut i varje enskilt fall', 'Genom en avvägning i det enskilda fallet'], correct: 3 },
    { type: 'inferens', q: 'Varför räcker inte välvilja från omgivningen?',
      options: ['För att människor sällan menar väl på riktigt', 'För att det krävs regler, tillsyn och ansvar', 'För att diskriminering är svår att upptäcka', 'För att välvilja bara har effekt inom skolan'], correct: 1 },
    { type: 'sammanfatta', q: 'Vilken bild av mänskliga rättigheter ger texten?',
      options: ['Att de främst är en fråga för internationella organ', 'Att de i praktiken bara har betydelse i arbetslivet', 'Att de är både vardagliga val och juridiska skyldigheter', 'Att de har blivit mindre viktiga med tiden'], correct: 2 },
  ],
},

// ── åk 7, 164 → ~515 ord ────────────────────────────────────────────────
'ak7-tema-028': {
  text: `Mänskliga rättigheter är grundläggande rättigheter som gäller alla människor, oavsett var de bor eller vem de är. Dessa rättigheter inkluderar rätten till liv, utbildning, yttrandefrihet och skydd mot diskriminering. De formulerades efter andra världskriget för att förhindra att liknande övergrepp skulle ske igen.

Bakgrunden var konkret. Under andra världskriget mördades miljontals människor systematiskt, ofta med stöd av landets egna lagar. Det gjorde det tydligt att det inte räckte att varje stat bestämde själv vad som var tillåtet inom sina gränser. Något måste gälla över statens vilja, och det var den tanken förklaringen skulle uttrycka.

Dokumentet som brukar räknas som utgångspunkt heter FN:s allmänna förklaring om de mänskliga rättigheterna och antogs 1948. Det består av trettio artiklar och skrevs av en grupp med människor från flera olika delar av världen. Förklaringen är i sig inte en lag, utan snarare en gemensam beskrivning av vad som ska gälla. Delarna har senare skrivits in i avtal som länder kan förbinda sig att följa, och i många länders egna lagar.

Rättigheterna brukar delas in i två grupper. Den ena handlar om frihet från något: att inte fängslas utan rättegång, att inte hindras från att tro vad man vill. Den andra handlar om rätt till något: mat, bostad, vård och skola. Den första gruppen kostar mindre för en stat att uppfylla, vilket är en av anledningarna till att den ofta tas mer på allvar.

Trots att rättigheterna är universella följs de inte alltid. I vissa länder begränsas människors frihet, och vissa grupper utsätts för diskriminering. Ett vanligt sätt att försvara sig mot kritik är att säga att rättigheterna passar dåligt i just det landets kultur. Motargumentet brukar vara enkelt: det är sällan de som utsätts som tycker att skyddet är onödigt.

Organisationer runt om i världen arbetar för att skydda och främja dessa rättigheter. Några av dem, som Amnesty International och Human Rights Watch, samlar in uppgifter om vad som händer och publicerar dem, eftersom uppmärksamhet ofta är det enda påtryckningsmedel som finns. Andra arbetar med juridisk hjälp åt enskilda personer.

Utbildning spelar en viktig roll i att stärka mänskliga rättigheter. Genom att lära sig om sina rättigheter kan människor stå upp för sig själva och andra. Skolor och samhällen har ett ansvar att sprida kunskap om dessa frågor. Rätten till utbildning är dessutom särskild på så sätt att den gör det lättare att kräva alla de andra.

Barn har också egna rättigheter. Barnkonventionen antogs 1989 och blev svensk lag 2020. Den slår bland annat fast att barnets bästa ska beaktas vid beslut som rör barn, och att barn har rätt att komma till tals i frågor som gäller dem.

Också i Sverige har rättigheter behövt kämpas fram. Rösträtt för alla vuxna kom först på 1920-talet, och långt in på 1900-talet tvångssteriliserades människor med stöd av lag. Att något är bestämt i lag betyder alltså inte automatiskt att det är rätt.

Det är också viktigt att tänka på hur vi behandlar varandra i vardagen. Respekt, empati och förståelse bidrar till ett mer rättvist samhälle. Varje individ kan göra skillnad genom små handlingar.

Mänskliga rättigheter handlar inte bara om lagar, utan också om värderingar och hur vi väljer att leva tillsammans.`,
  questions: [
    { type: 'literal', q: 'Vad heter dokumentet som antogs 1948?',
      options: ['FN:s allmänna förklaring om de mänskliga rättigheterna', 'Barnkonventionen om barnets rättigheter i världen', 'Europeiska konventionen om medborgerliga rättigheter', 'FN:s stadga om fred och internationell säkerhet'], correct: 0 },
    { type: 'literal', q: 'Vad sägs om förklaringens juridiska ställning?',
      options: ['Den gäller som lag i samtliga av FN:s medlemsländer', 'Den är inte en lag utan en gemensam beskrivning', 'Den ersätter de enskilda ländernas egna grundlagar', 'Den kan bara åberopas av stater, inte av enskilda'], correct: 1 },
    { type: 'inferens', q: 'Vilket motargument nämns mot invändningen om kultur?',
      options: ['Att kulturer förändras snabbt över tid', 'Att alla länder en gång skrev under samma text', 'Att det sällan är de utsatta som tycker skyddet är onödigt', 'Att kritiken oftast kommer från närliggande länder'], correct: 2 },
    { type: 'inferens', q: 'Varför publicerar organisationerna uppgifter om övergrepp?',
      options: ['För att kunna driva rättegångar i egen regi', 'För att samla in pengar till sin egen verksamhet', 'För att uppfylla krav från FN:s medlemsländer', 'För att uppmärksamhet ofta är det enda påtryckningsmedlet'], correct: 3 },
    { type: 'inferens', q: 'Varför beskrivs rätten till utbildning som särskild?',
      options: ['För att den kostar mest av alla att genomföra', 'För att den gör det lättare att kräva alla de andra', 'För att den infördes senare än de övriga rättigheterna', 'För att den bara gäller barn och unga i skolåldern'], correct: 1 },
    { type: 'sammanfatta', q: 'Vad slår barnkonventionen bland annat fast?',
      options: ['Att barn har rätt att komma till tals i frågor som rör dem', 'Att barn ska behandlas precis som vuxna i alla sammanhang', 'Att skolan ensam ansvarar för allt som gäller barns rättigheter', 'Att barn själva får överklaga myndigheters beslut i domstol'], correct: 0 },
  ],
},

// ── åk 8, 166 → ~550 ord ────────────────────────────────────────────────
'ak8-tema-016': {
  text: `Klimatförändringar är en av de största utmaningarna i vår tid. Forskare har visat att jordens temperatur ökar, vilket till stor del beror på utsläpp av växthusgaser från mänskliga aktiviteter. Förbränning av fossila bränslen, som kol och olja, bidrar till ökade nivåer av koldioxid i atmosfären.

Mekanismen bakom är i sig enkel. Solens strålar värmer jordytan, som strålar tillbaka värme. En del av den värmen fångas upp av gaser i atmosfären i stället för att försvinna ut i rymden. Utan den effekten hade jorden varit obeboeligt kall. Problemet är alltså inte att effekten finns, utan att den förstärkts snabbt sedan industrialiseringen.

Att sambandet är känt är inget nytt. Redan på 1800-talet räknade forskare ut att koldioxid håller kvar värme, och mätningar av halten i atmosfären har gjorts oavbrutet sedan 1958. Kurvan stiger år för år. Att förändringen beror på människan går dessutom att se i själva kolet: det som kommer från fossila bränslen har en annan sammansättning än det som funnits i omlopp länge.

Konsekvenserna av klimatförändringar märks redan idag. Glaciärer smälter, havsnivåer stiger och extremväder som värmeböljor och kraftiga stormar blir vanligare. Dessa förändringar påverkar både människor och djur. Vissa arter riskerar att dö ut när deras livsmiljöer förändras.

Effekterna är dessutom ojämnt fördelade. En värmebölja är farligast för äldre och sjuka, och en översvämning drabbar hårdast den som bor i ett hus som inte tål vatten och som saknar försäkring. Klimatfrågan är därför också en fråga om vem som har råd att skydda sig.

Samtidigt diskuteras vem som har ansvar för att minska utsläppen. Industriländer har historiskt stått för stora utsläpp, medan utvecklingsländer ofta drabbas hårdast av konsekvenserna. Detta skapar en komplex fråga om rättvisa och ansvar. Ett land som just börjat bygga upp sin industri kan med visst fog fråga varför det ska avstå från något som andra redan haft nytta av i över hundra år.

Länderna har försökt komma överens flera gånger. I Parisavtalet 2015 enades nästan alla världens stater om att hålla uppvärmningen väl under två grader och helst nära en och en halv. Varje land bestämmer dock själv hur mycket det ska minska sina utsläpp, och det finns inga straff för den som inte når sitt mål. Avtalet bygger alltså på öppenhet och påtryckningar snarare än tvång.

Utöver att minska utsläppen krävs anpassning. Städer planterar träd för att sänka temperaturen, kustsamhällen bygger skydd mot högre vatten och jordbruk provar grödor som tål torka bättre. Anpassning löser inte grundproblemet, men den avgör hur hårt förändringarna slår under tiden.

Individer kan också bidra genom att göra mer hållbara val i vardagen, till exempel genom att minska sin energiförbrukning och välja miljövänliga transportmedel. Även små förändringar kan tillsammans göra stor skillnad.

Samtidigt är det värt att veta varifrån utsläppen faktiskt kommer. De största posterna är energiproduktion, industri, transporter och jordbruk, alltså system som enskilda personer bara delvis råder över. Det betyder inte att egna val är meningslösa, men att de fungerar bäst tillsammans med beslut om hur el produceras och hur samhällen byggs.

Frågan väcker också oro, särskilt hos unga. Att känna maktlöshet inför något så stort är begripligt, men forskning om engagemang pekar åt ett tydligt håll: den som gör något tillsammans med andra mår oftast bättre än den som bara läser om problemet.

För att hantera klimatförändringarna krävs samarbete på global nivå, där länder, företag och individer arbetar tillsammans för en mer hållbar framtid.`,
  questions: [
    { type: 'inferens', q: 'Varför skriver texten att växthuseffekten i sig inte är problemet?',
      options: ['För att den bara påverkar vissa delar av jorden', 'För att jorden utan den hade varit obeboeligt kall', 'För att den upptäcktes redan under 1800-talet', 'För att effekten avtar av sig själv med tiden'], correct: 1 },
    { type: 'literal', q: 'Vilken konsekvens av klimatförändringarna nämns i texten?',
      options: ['Att jordbävningarna blir betydligt fler än förut', 'Att vindarna vänder riktning över Atlanten', 'Att glaciärer smälter och havsnivåer stiger', 'Att skogarna växer snabbare i norra Europa'], correct: 2 },
    { type: 'inferens', q: 'Varför beskrivs effekterna som ojämnt fördelade?',
      options: ['För att vädret varierar mycket mellan olika år', 'För att mätningarna görs på olika sätt i olika länder', 'För att vissa djurarter påverkas mer än andra', 'För att den som har råd kan skydda sig bättre'], correct: 3 },
    { type: 'inferens', q: 'Vilket argument kan ett land som nyss industrialiserats föra fram?',
      options: ['Att det saknar teknik för att mäta sina egna utsläpp', 'Att andra haft nytta av samma utsläpp i över hundra år', 'Att dess utsläpp är för små för att spela någon roll', 'Att klimatförändringarna har helt naturliga orsaker'], correct: 1 },
    { type: 'literal', q: 'Varifrån kommer de största utsläppen enligt texten?',
      options: ['Från energiproduktion, industri, transporter och jordbruk', 'Från hushållens uppvärmning och matlagning', 'Från flygresor och internationell turism', 'Från avfallshantering och förbränning av sopor'], correct: 0 },
    { type: 'sammanfatta', q: 'Vad säger texten om egna klimatval?',
      options: ['Att de saknar betydelse jämfört med industrins utsläpp', 'Att de är det enda som verkligen fungerar i längden', 'Att de fungerar bäst tillsammans med större beslut', 'Att de bör ersättas helt av skatter och förbud'], correct: 2 },
  ],
},

// ── åk 10, 167 → ~605 ord ───────────────────────────────────────────────
'akgy-mj-003': {
  text: `Michael Jackson var inte bara en framgångsrik artist utan också en innovatör inom musikproduktion. Han arbetade nära producenter som Quincy Jones för att skapa ett nytt sound som kombinerade olika genrer. Genom att blanda pop, funk, rock och R&B skapade han musik som nådde en bred publik.

Samarbetet med Jones började med skivan Off the Wall 1979 och fortsatte med Thriller och Bad. Arbetsfördelningen var inte alltid den man föreställer sig. Jones hade bakgrund som jazzarrangör och tog med sig studiomusiker på hög nivå, medan Jackson kom med melodier och rytmer han sjungit in på band, ofta utan att kunna skriva noter. Att han inte behärskade notskrift hindrade honom inte, eftersom han i stället sjöng varje stämma, även basgångar och trumfigurer, tills andra kunde spela dem.

En viktig aspekt av hans arbete var användningen av studioteknik. Jackson experimenterade med inspelningstekniker, ljudlager och rytmiska strukturer för att skapa ett dynamiskt och detaljerat ljud. Detta bidrog till att höja standarden för musikproduktion under 1980-talet.

Ett exempel på hur detaljerna arbetades fram är basgången i Billie Jean. Quincy Jones ville korta ned den långa introduktionen, men Jackson insisterade på att behålla den, eftersom det var där han själv ville börja dansa. Bruce Swedien byggde dessutom särskilda plattformar under trumstativen för att få ett ljud som inte lät som någon annans.

Tidpunkten hade också betydelse. Skivorna spelades in när analog bandteknik fortfarande dominerade men trummaskiner och synthesizrar just blivit tillgängliga. Att blanda de två gav ett ljud som varken var helt maskinellt eller helt spelat.

Genrekombinationen var också ett affärsmässigt beslut. Att lägga ett rockgitarrsolo i låten Beat It, spelat av Eddie Van Halen, gjorde den spelbar på radiokanaler som annars inte spelade svarta artister. Musikaliskt var det en gest över en gräns som vid den tiden var betydligt tydligare än i dag.

Han var också noggrann med varje detalj i sina låtar. Från rytmsektioner till vokala arrangemang arbetade han intensivt för att uppnå perfektion. Denna arbetsmetod inspirerade många andra artister och producenter. Det finns berättelser om låtar som mixades om dussintals gånger, och om sångstämmor som spelades in i lager på lager för att skapa en kör av en enda röst.

Rösten var i sig ett instrument som användes på ovanliga sätt. Andetag, korta rop och hackande ljud lades in medvetet i takt med trummorna, så att sången blev en del av rytmen i stället för att bara ligga ovanpå den.

Jacksons musik nådde också över kulturella gränser. Hans låtar spelades över hela världen och bidrog till att globalisera popmusiken. Detta gjorde honom till en av de första verkligt globala superstjärnorna.

Jackson skrev själv flera av sina största låtar, bland dem Billie Jean och Beat It. Det är värt att nämna, eftersom artister som främst är kända för sång och dans ofta antas ha fått materialet skrivet åt sig. På Thriller står han som upphovsperson till fyra av nio spår.

Spåren av arbetssättet finns kvar i studior i dag. Att bygga upp en sång i många lager, att låta en trumma klinga exakt så länge som låten kräver och att lyssna igenom en mix på små högtalare för att höra hur den låter i verkligheten är rutiner som blev vanliga under de här åren.

Att arbetet var kollektivt är samtidigt värt att hålla fast vid. Ljudet på skivorna kom lika mycket från Jones, från ljudteknikern Bruce Swedien och från de musiker som spelade in, som från Jackson själv. Bilden av den ensamma geniala artisten döljer ofta hur många människor som krävs för att en inspelning ska låta som den gör.

Sammanfattningsvis visar hans arbete hur teknisk innovation och konstnärlig vision kan kombineras för att skapa musik som både är kommersiellt framgångsrik och konstnärligt betydelsefull.`,
  questions: [
    { type: 'literal', q: 'Hur arbetade Jackson trots att han inte behärskade notskrift?',
      options: ['Han lät andra skriva ned låtarna åt honom i förväg', 'Han spelade själv in alla instrument på skivorna', 'Han sjöng varje stämma tills andra kunde spela dem', 'Han beskrev musiken i ord för sina arrangörer'], correct: 2 },
    { type: 'inferens', q: 'Varför var gitarrsolot i Beat It också ett affärsmässigt beslut?',
      options: ['Det gjorde inspelningen betydligt billigare att göra', 'Det gjorde låten spelbar på kanaler som annars valde bort honom', 'Det förkortade låten så att den passade radioformatet', 'Det gav skivbolaget rätt att sälja låten separat'], correct: 1 },
    { type: 'literal', q: 'Hur skapades kören av en enda röst?',
      options: ['Genom att sångstämmor spelades in i lager på lager', 'Genom att flera körsångare anlitades till inspelningen', 'Genom att rösten spelades upp i olika hastigheter', 'Genom att inspelningen gjordes i en mycket stor lokal'], correct: 0 },
    { type: 'inferens', q: 'Vad var särskilt med hur rösten användes rytmiskt?',
      options: ['Sången spelades alltid in före trummorna', 'Rösten ersatte helt de vanliga slaginstrumenten', 'Texterna skrevs om för att passa taktarten', 'Andetag och korta ljud lades in i takt med trummorna'], correct: 3 },
    { type: 'forfattarens-syfte', q: 'Varför betonar texten att arbetet var kollektivt?',
      options: ['För att tona ned betydelsen av Jacksons egen insats', 'För att förklara varför skivorna blev dyra att spela in', 'För att visa hur många som krävs bakom en inspelning', 'För att jämföra hans arbetssätt med dagens artisters'], correct: 2 },
    { type: 'sammanfatta', q: 'Vad är textens huvudlinje?',
      options: ['Att tekniken betydde mer än de musikaliska idéerna', 'Att hans framgång helt och hållet berodde på Quincy Jones', 'Att genreblandning blev vanlig först under 1990-talet', 'Att teknisk nyfikenhet och konstnärlig vision samverkade'], correct: 3 },
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
  console.log(`${id.padEnd(16)} åk${String(t.grade).padEnd(3)} ${String(n).padStart(4)} ord ${inom ? '✅' : '❌ krav ' + b[0] + '–' + b[1]}  facit:${data.questions.map(q => q.correct).join('')}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
if (!ok) process.exit(1);
