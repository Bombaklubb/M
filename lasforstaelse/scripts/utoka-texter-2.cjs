#!/usr/bin/env node
//
// Sats 2: utökar fem tunna texter i åk 7–9 OCH gör om deras frågor.
//
// Varför frågorna också: de sex frågorna skrevs för de gamla 120–135-ords-
// texterna och blev därför nästan uteslutande enkla faktafrågor med ett
// ords svar. När texten tredubblas prövar de fortfarande bara den gamla
// ytan. Frågorna är det eleven faktiskt bedöms på, så de skrivs om för att
// använda hela texten och hela typregistret.

const fs = require('fs');
const path = require('path');

const NYA = {

// ── åk 9, 125 → ~580 ord ────────────────────────────────────────────────
'ak10-rosa-004': {
  text: `Segregation innebär att människor delas upp och behandlas olika baserat på exempelvis hudfärg. I USA under 1900-talet var detta en del av lagstiftningen, vilket påverkade många människors vardag.

Systemet vilade på en juridisk princip som slogs fast av USA:s högsta domstol år 1896: åtskillnad var tillåten så länge det som erbjöds var likvärdigt. Formuleringen kallades "separate but equal". I praktiken blev den första halvan verklighet och den andra inte. Skolor för svarta elever fick regelmässigt en bråkdel av de anslag som gick till skolor för vita elever, och skillnaden syntes i allt från läroböcker till lärarlöner.

För svarta amerikaner innebar segregation begränsad tillgång till utbildning, arbete och offentliga platser. Detta skapade stora skillnader i livsvillkor. Uppdelningen omfattade väntsalar, bibliotek, sjukhus och parker, och den var särskilt hårt reglerad i sydstaterna.

Också bostadsmarknaden var uppdelad, men på ett mindre synligt sätt. Banker och myndigheter markerade vissa bostadsområden som riskfyllda att låna ut pengar till, och de områdena var nästan alltid de där svarta familjer bodde. Praktiken kallas redlining. Följden blev att familjer där inte kunde köpa hus, och därmed inte heller bygga upp den förmögenhet som ett ägt hem innebär. Eftersom förmögenhet går i arv fortsatte den skillnaden att märkas långt efter att lagarna ändrats.

Miljontals människor svarade med att flytta. Under den period som kallas den stora migrationen lämnade omkring sex miljoner svarta amerikaner sydstaterna för städer i norr och väster. De sökte arbete och friare villkor, men mötte ofta segregation även där, i praktiken om inte i lagtexten.

Rosa Parks protest var ett svar på denna orättvisa. Genom att vägra följa reglerna visade hon att lagar inte alltid är rättvisa. Hennes handling var inte spontan på det sätt som ibland påstås. Parks var sedan länge aktiv i medborgarrättsrörelsen, och nio månader tidigare hade den femtonåriga Claudette Colvin gripits för samma sak. Rörelsen valde att bygga kampanjen kring Parks, delvis av taktiska skäl.

Bussbojkotten i Montgomery som följde på gripandet blev en vändpunkt. Under drygt ett år vägrade stadens svarta invånare att åka buss. Många gick flera kilometer till arbetet varje dag, och ett system med samåkning organiserades. Eftersom svarta resenärer utgjorde en stor del av bolagets kunder blev de ekonomiska förlusterna kännbara. Protesten visade att en samordnad vägran kunde utöva verkligt tryck, och metoden kom att användas på fler håll.

Segregationen upprätthölls inte bara av lagar. Den bars också upp av sedvänjor, av vem som förväntades kliva åt sidan på trottoaren och av vad som kunde sägas till vem. Sådana oskrivna regler var svårare att avskaffa än paragrafer, eftersom de inte fanns nedskrivna någonstans att stryka.

Segregationen påverkade även samhället som helhet genom att skapa konflikter och ojämlikhet. Den bidrog till att människor levde åtskilda och saknade förståelse för varandra. När grupper sällan möts blir det lättare att tro på förenklade bilder av varandra, och svårare att upptäcka att de har gemensamma intressen.

När segregation började avskaffas ledde det till förändringar, men processen var lång och mötte motstånd. År 1954 slog högsta domstolen fast att uppdelade skolor stred mot författningen, men i flera delstater dröjde det över ett decennium innan domen fick genomslag. Motståndet tog sig uttryck i allt från politiska manövrer till öppet våld.

Texten visar hur lagar kan påverka människors liv och varför det är viktigt att ifrågasätta orättvisa system. Den visar också att en lagändring är en början snarare än ett slut: när regler tas bort finns mönstren ofta kvar i bostäder, skolor och ekonomi, och de kräver sitt eget arbete för att förändras.`,
  questions: [
    { type: 'literal', q: 'Vilken princip slog högsta domstolen fast år 1896?',
      options: ['Att all åtskillnad var förbjuden i hela landet', 'Att åtskillnad var tillåten om utbudet var likvärdigt', 'Att delstaterna själva fick avgöra frågan helt fritt', 'Att skolor skulle få lika stora anslag oavsett elever'], correct: 1 },
    { type: 'ord', q: 'Vad innebär "redlining" enligt texten?',
      options: ['Att vissa bostadsområden markerades som riskfyllda att låna ut till', 'Att gator målades med röda linjer för att visa var gränsen gick', 'Att hyresvärdar fick höja hyran i vissa delar av staden', 'Att myndigheter förbjöd familjer att flytta mellan delstater'], correct: 0 },
    { type: 'inferens', q: 'Varför märktes redliningens effekter långt efter att lagarna ändrats?',
      options: ['För att bankerna vägrade ändra sina gamla kartor', 'För att husen i de områdena var sämre byggda från början', 'För att förmögenhet från ägda hem går i arv mellan generationer', 'För att flyttlassen tog många decennier att genomföra i praktiken'], correct: 2 },
    { type: 'inferens', q: 'Vad antyder texten om varför rörelsen byggde kampanjen kring Rosa Parks?',
      options: ['Att hon var den allra första som vägrade lyda reglerna', 'Att hon till skillnad från andra hade juridisk utbildning', 'Att ingen annan hade gripits för samma sak tidigare', 'Att valet delvis var taktiskt snarare än en ren tillfällighet'], correct: 3 },
    { type: 'literal', q: 'Vad hände efter högsta domstolens beslut om skolorna år 1954?',
      options: ['Alla delstater följde domen redan inom det första året', 'I flera delstater dröjde genomslaget över ett decennium', 'Domen upphävdes snabbt efter protester från sydstaterna', 'Skolorna slogs samman men anslagen förblev helt oförändrade'], correct: 1 },
    { type: 'sammanfatta', q: 'Vilken slutsats om lagändringar driver texten tydligast?',
      options: ['Att lagändringar sällan har någon verklig betydelse alls', 'Att en lagändring är en början snarare än ett avslut', 'Att domstolar är den enda vägen till samhällsförändring', 'Att motstånd mot förändring alltid upphör med tiden'], correct: 1 },
  ],
},

// ── åk 7, 128 → ~515 ord ────────────────────────────────────────────────
'ak7-tema-033': {
  text: `Under medeltiden växte många städer fram i Europa. Dessa städer var ofta omgivna av murar som skydd mot fiender. Inom murarna fanns smala gator, marknadsplatser och kyrkor som var viktiga samlingsplatser.

Att städerna kunde växa hängde ihop med jordbruket. Nya redskap och bättre sätt att bruka jorden gjorde att bönderna fick ett överskott. När all mat inte behövde ätas upp av dem som odlade den kunde andra ägna sig åt hantverk och handel i stället. Städer uppstod därför ofta där vägar korsades, vid flodövergångar eller vid hamnar.

Muren fyllde mer än en uppgift. Förutom skydd markerade den var staden började, och i portarna togs tull ut på varor som fördes in. Muren var alltså också en gräns för var stadens egna regler gällde.

Handel spelade en central roll i städernas utveckling. Köpmän reste mellan olika platser och bytte varor som tyg, kryddor och metaller. Marknader var livliga och viktiga för ekonomin. Många städer hade bestämda marknadsdagar, och till de större marknaderna kom handlare från andra länder.

Städerna hade en särskild ställning gentemot kungar och adel. Genom stadsprivilegier fick de rätt att hålla marknad, ta ut tull och döma i egna domstolar. Ett känt uttryck från tiden är att stadsluften gör fri: en person som flytt från en gods och bott i staden ett år och en dag kunde inte längre krävas tillbaka.

Livet i städerna var dock inte alltid enkelt. Trångboddhet och dålig hygien kunde leda till sjukdomar. Avfall hamnade ofta på gatan, och rent vatten var svårt att få tag på. När digerdöden nådde Europa på 1300-talet drabbades de tätbefolkade städerna särskilt hårt.

Bränder var också vanliga eftersom många hus var byggda av trä. Eftersom husen stod tätt kunde en enda eld ödelägga hela kvarter. Med tiden infördes regler om att tak skulle täckas med tegel i stället för halm, och om var eld fick göras upp.

Trots svårigheterna lockade städerna människor med möjligheter till arbete och handel. Hantverkare organiserade sig i skrån, där de lärde ut sina yrken till lärlingar. Skråna bestämde också vilka som fick utöva ett yrke, hur många lärlingar en mästare fick ha och vad varorna skulle kosta. Det gav trygghet åt medlemmarna, men gjorde det samtidigt svårt för utomstående att ta sig in.

Vilka som bodde i staden varierade. Överst fanns rika köpmän och rådmän som styrde staden, därunder mästare med egna verkstäder, och längst ned lärlingar, tjänstefolk och fattiga. Kvinnor deltog i arbetet i verkstäderna och kunde i vissa fall driva en rörelse vidare som änkor, men var i regel utestängda från de poster där besluten fattades.

Dagen styrdes av ljuset och av kyrkans klockor, som ringde vid bestämda tider. Arbetet började tidigt och avslutades när det blev för mörkt för att se, och därför var arbetsdagen betydligt kortare på vintern än på sommaren.

Medeltidens städer lade grunden för dagens moderna samhällen och visar hur människor samarbetade för att skapa fungerande samhällen. Många av dagens europeiska städer följer fortfarande gatunätet från medeltiden, och torget ligger i många fall fortfarande kvar just där marknaden en gång hölls.`,
  questions: [
    { type: 'inferens', q: 'Varför var jordbrukets överskott en förutsättning för att städer skulle växa?',
      options: ['För att bönderna då kunde flytta in innanför stadsmuren', 'För att överskottet gjorde att marknaderna blev billigare', 'För att andra då kunde arbeta med annat än att odla mat', 'För att kungen krävde att överskottet såldes inne i staden'], correct: 2 },
    { type: 'literal', q: 'Vilken uppgift hade stadsmuren utöver att ge skydd?',
      options: ['Den markerade gränsen där tull togs ut och stadens regler gällde', 'Den användes som upplag för varor som väntade på marknaden', 'Den delade upp staden mellan hantverkare och köpmän', 'Den fungerade som fundament för de största kyrkorna'], correct: 0 },
    { type: 'ord', q: 'Vad betyder uttrycket att "stadsluften gör fri" enligt texten?',
      options: ['Att luften innanför murarna ansågs nyttigare än på landet', 'Att den som bott i staden en tid inte kunde krävas tillbaka', 'Att stadens invånare slapp betala skatt till kungen', 'Att alla som föddes i staden automatiskt blev köpmän'], correct: 1 },
    { type: 'literal', q: 'Vilken regel infördes med tiden för att minska brandrisken?',
      options: ['Att husen skulle byggas med större avstånd till varandra', 'Att all matlagning skulle ske utanför stadens murar', 'Att trähus helt förbjöds innanför stadsmuren', 'Att taken skulle täckas med tegel i stället för halm'], correct: 3 },
    { type: 'inferens', q: 'Vilken dubbel effekt hade skråna enligt texten?',
      options: ['De höjde kvaliteten men gjorde varorna billigare för alla', 'De gav medlemmarna trygghet men stängde ute utomstående', 'De utbildade lärlingar men saknade inflytande över priserna', 'De styrde handeln men hade inget att göra med hantverk'], correct: 1 },
    { type: 'sammanfatta', q: 'Vad vill texten främst visa om medeltidens städer?',
      options: ['Att de var farliga platser som de flesta helst undvek', 'Att de främst existerade för att skydda kungens intressen', 'Att de formade samhällsmönster som syns än i dag', 'Att de försvann helt när digerdöden nådde Europa'], correct: 2 },
  ],
},

// ── åk 9, 132 → ~580 ord ────────────────────────────────────────────────
'ak10-obama-003': {
  text: `Barack Obama var president i USA mellan 2009 och 2017. Under denna tid stod han inför flera stora utmaningar, bland annat en ekonomisk kris som påverkade både USA och resten av världen.

Krisen hade brutit ut året innan han tillträdde. Banker hade lånat ut pengar till bostadsköpare som inte kunde betala tillbaka, och när bostadspriserna föll drogs hela det finansiella systemet med. Arbetslösheten steg snabbt. Obamas svar var ett stort stimulanspaket där staten sköt till pengar till infrastruktur, utbildning och skattelättnader. Förespråkare menade att åtgärden hindrade en djupare depression, medan kritiker ansåg att den var för dyr och gynnade banker snarare än vanliga hushåll.

En av hans viktigaste reformer var sjukvårdsreformen, ofta kallad "Obamacare". Syftet var att göra det möjligt för fler människor att få tillgång till sjukvård. Runt tjugo miljoner fler amerikaner fick försäkring, och försäkringsbolag förbjöds att neka någon på grund av tidigare sjukdomar. Reformen blev samtidigt en av de mest omstridda på decennier, och motståndare försökte upphäva den vid dussintals tillfällen.

Obama arbetade också med klimatfrågor och internationellt samarbete. Han deltog i globala avtal för att minska utsläpp och bekämpa klimatförändringar. Parisavtalet 2015 var det tydligaste exemplet, där nästan alla världens länder enades om att begränsa uppvärmningen. Eftersom avtalet inte ratificerades av senaten kunde det dock rivas upp av en efterträdare, vilket också skedde.

Under hans presidentskap fattades beslut som både hyllades och kritiserades. Till exempel ökade användningen av drönare i militära operationer, vilket väckte debatt. Förespråkarna framhöll att drönare gjorde det möjligt att slå mot misstänkta utan att riskera egna soldaters liv. Kritikerna invände att civila dödades, att besluten fattades utan domstolsprövning och att tekniken gjorde det politiskt lättare att använda våld.

Obama betonade ofta diplomati i utrikespolitiken. Ett exempel är avtalet med Iran om landets kärnprogram, där sanktioner lättades i utbyte mot begränsningar och inspektioner. Han återupptog också diplomatiska förbindelser med Kuba efter mer än ett halvsekel av avbrott.

Allt han föresatte sig genomfördes inte. Löftet att stänga fånglägret Guantánamo infriades aldrig, eftersom kongressen blockerade finansieringen. Försök att skärpa vapenlagarna efter flera skolskjutningar stannade också i kongressen. Under hans år fördjupades dessutom motsättningarna mellan de två stora partierna, något han själv beskrev som en av sina största besvikelser.

En av de mest uppmärksammade händelserna under hans tid var operationen mot Usama bin Ladin i Pakistan 2011. Beslutet fattades utan att den pakistanska regeringen informerades i förväg, vilket ledde till en diplomatisk konflikt. Också här gick meningarna isär: många såg det som ett nödvändigt avslut på en lång jakt, medan andra invände mot att en annan stats territorium användes utan tillstånd.

Att Obama var USA:s förste svarte president gav hans tid en symbolisk tyngd utöver politiken. För många innebar valet 2008 ett bevis på att något hade förändrats i landet. Samtidigt visade åren som följde att en enskild persons framgång inte automatiskt förändrar strukturer: skillnaderna i inkomst, förmögenhet och hälsa mellan olika grupper bestod, och frågor om polisvåld blev under hans andra mandatperiod en av landets mest laddade konflikter.

Hans tid som president visar hur komplex rollen är, där beslut ofta innebär att väga olika intressen mot varandra. Att bedöma ett presidentskap är därför sällan enkelt. Samma beslut kan framstå som klokt eller misslyckat beroende på vilka värden man utgår från och hur lång tid som hunnit gå. Historiker brukar dessutom påpeka att effekterna av politiska beslut ofta visar sig först långt efter att den som fattade dem har lämnat sitt ämbete, vilket gör att bedömningen kan ändras flera gånger under decennierna som följer.`,
  questions: [
    { type: 'literal', q: 'Vad bestod Obamas svar på den ekonomiska krisen av?',
      options: ['Ett förbud mot att banker lånade ut pengar till bostadsköp', 'Ett stimulanspaket med satsningar och skattelättnader', 'En höjning av räntan för att dämpa bostadspriserna', 'En överenskommelse med andra länder om gemensam valuta'], correct: 1 },
    { type: 'inferens', q: 'Varför kunde Parisavtalet rivas upp av en efterträdare?',
      options: ['För att avtalet bara gällde under en bestämd tidsperiod', 'För att de andra länderna aldrig undertecknade det', 'För att det inte hade ratificerats av senaten', 'För att domstolen förklarade avtalet ogiltigt i efterhand'], correct: 2 },
    { type: 'literal', q: 'Vilken invändning riktades mot användningen av drönare?',
      options: ['Att tekniken var alldeles för dyr för försvarsbudgeten', 'Att drönarna ofta havererade under sina uppdrag', 'Att egna soldater utsattes för större risker än förut', 'Att civila dödades och besluten saknade domstolsprövning'], correct: 3 },
    { type: 'inferens', q: 'Vad var den gemensamma orsaken till att Guantánamo och vapenlagarna inte förändrades?',
      options: ['Förslagen stoppades i kongressen', 'Obama drog tillbaka förslagen självmant', 'Domstolarna förklarade dem grundlagsstridiga', 'Delstaterna vägrade genomföra besluten lokalt'], correct: 0 },
    { type: 'literal', q: 'Vad innebar avtalet med Iran enligt texten?',
      options: ['Att landet fick behålla sitt program helt utan insyn', 'Att sanktioner lättades mot begränsningar och inspektioner', 'Att USA lovade ekonomiskt bistånd under tio år', 'Att grannländerna tog över kontrollen av anläggningarna'], correct: 1 },
    { type: 'forfattarens-syfte', q: 'Varför avslutar texten med att bedömningar av ett presidentskap sällan är enkla?',
      options: ['För att visa att historiker sällan är överens om någonting', 'För att antyda att Obamas tid var mer misslyckad än den framstår', 'För att markera att samma beslut kan värderas olika över tid', 'För att förklara varför presidenter sällan sitter längre än två perioder'], correct: 2 },
  ],
},

// ── åk 7, 133 → ~515 ord ────────────────────────────────────────────────
'ak7-tema-023': {
  text: `Vikingarna var skickliga sjöfarare som levde under tidig medeltid. De reste över stora delar av Europa och nådde till och med Nordamerika. Deras båtar var välbyggda och kunde färdas både på öppet hav och i floder.

Skeppen var nyckeln till det mesta de gjorde. De byggdes med överlappande plankor, en teknik som gav ett skrov som var både starkt och följsamt i vågorna. Skeppen var dessutom grundgående, vilket betyder att de inte behövde djupt vatten. Därför kunde de segla långt uppför floder och dras upp direkt på en strand, utan hamn.

Att navigera utan karta och kompass krävde annan kunskap. Sjöfararna använde solens och stjärnornas läge, färgen på vattnet, molnformationer och fåglarnas rörelser för att avgöra var land fanns. Kunskapen fördes vidare muntligt mellan generationer.

Resorna hade olika syften. Ibland handlade det om handel, där vikingarna bytte varor som pälsar och järn mot silver och andra produkter. I andra fall var det plundringståg, där de anföll kuststäder.

Färdvägarna gick åt flera håll. Västerut nåddes England, Irland, Island och Grönland, och omkring år 1000 även Nordamerika, som de kallade Vinland. Österut färdades de uppför ryska floder ända till Konstantinopel, som på nordiska kallades Miklagård, och vidare mot Bagdad. Silvermynt från dessa områden har hittats i tusental i svensk jord.

En del av handeln bestod av människor. Personer som tillfångatogs under plundringar såldes som trälar, både i Norden och på marknader längre bort. Det är en sida av vikingatiden som länge tonades ned i berättelserna om sjöfarare och upptäckter.

Vikingarna var inte bara krigare. De var också bönder, hantverkare och handelsmän. I deras samhällen fanns lagar och regler som styrde livet. Tvister avgjordes på ting, en sorts sammankomst där fria män fattade beslut gemensamt.

Varför de gav sig av diskuteras fortfarande. Bland förklaringarna finns brist på odlingsbar mark, förbättrad skeppsteknik som gjorde långa resor möjliga, och rika men dåligt försvarade kloster längs kusterna.

Kontakten med andra kulturer ledde till att idéer och varor spreds. Vikingarna tog med sig nya influenser hem, vilket förändrade deras samhälle över tid. Den största förändringen var kristendomen, som gradvis ersatte den gamla tron och förde med sig kyrkor, skrift och nya maktstrukturer.

Många av resorna slutade i bosättningar snarare än i återvändande. I England styrde nordbor under en period ett stort område som kallades Danelagen. I Frankrike fick en vikingahövding land som blev Normandie, och längs floderna österut uppstod furstendömen med nordiskt inslag. På sådana platser blandades språk och sedvänjor snabbt med de som redan fanns där.

Vikingatiden brukar räknas som avslutad kring mitten av 1000-talet. Flera förändringar sammanföll: kungamakten i Norden blev starkare och organiserade våldet på annat sätt, kristendomen förändrade synen på plundring, och de kustområden som tidigare varit lätta mål hade byggt upp försvar.

Deras resor har haft stor betydelse för historien och visar hur människor tidigt kunde knyta kontakter över långa avstånd. Runstenarna som står kvar i landskapet är ofta resta till minne av någon som dog på en sådan resa, och de fungerar därför som spår av kontakter som annars vore svåra att belägga.`,
  questions: [
    { type: 'literal', q: 'Vad innebar det att vikingaskeppen var grundgående?',
      options: ['Att de kunde lastas med betydligt mer än andra skepp', 'Att de var byggda av ett enda urholkat trästycke', 'Att de inte behövde djupt vatten för att kunna segla', 'Att de bara kunde användas under sommarhalvåret'], correct: 2 },
    { type: 'literal', q: 'Hur navigerade sjöfararna utan karta och kompass?',
      options: ['Genom solens läge, vattnets färg och fåglarnas rörelser', 'Genom att alltid hålla kustlinjen inom synhåll', 'Genom nedtecknade sjökort som fördes vidare i familjen', 'Genom att räkna dagar och alltid segla samma sträcka'], correct: 0 },
    { type: 'ord', q: 'Vad var Miklagård enligt texten?',
      options: ['Ett handelscentrum på den svenska östkusten', 'Det nordiska namnet på Konstantinopel', 'En marknadsplats som anlades på Grönland', 'Det område i Nordamerika som nåddes omkring år 1000'], correct: 1 },
    { type: 'inferens', q: 'Varför nämner texten att handeln med trälar länge tonades ned?',
      options: ['För att visa att uppgiften nyligen har visat sig felaktig', 'För att förklara varför färre runstenar restes under perioden', 'För att peka på att slaveri var ovanligt i övriga Europa', 'För att markera att bilden av vikingatiden varit ofullständig'], correct: 3 },
    { type: 'inferens', q: 'Vad gör runstenarna särskilt värdefulla som historiskt material?',
      options: ['De innehåller detaljerade kartor över färdvägarna österut', 'De är de enda föremål som bevarats från vikingatiden', 'De vittnar om kontakter som annars vore svåra att belägga', 'De restes av kungar för att dokumentera sina segrar'], correct: 2 },
    { type: 'sammanfatta', q: 'Vilken helhetsbild av vikingarna ger texten?',
      options: ['Att de framför allt var krigare som levde på plundring', 'Att de var fredliga handelsmän som sällan använde våld', 'Att de saknade fasta samhällen och ständigt var på resa', 'Att de var både bönder, handelsmän och krigare på samma gång'], correct: 3 },
  ],
},

// ── åk 8, 134 → ~550 ord ────────────────────────────────────────────────
'ak8-tema-027': {
  text: `Vattnets kretslopp beskriver hur vatten rör sig mellan hav, land och atmosfär. Processen börjar med avdunstning, där vatten från hav och sjöar omvandlas till vattenånga och stiger upp i luften.

Det som driver hela kretsloppet är solen. Solstrålningen tillför den energi som krävs för att vatten ska övergå från flytande form till ånga. Utan den energin skulle vattnet ligga stilla. Ungefär nittio procent av all avdunstning sker från haven, eftersom de täcker den största delen av jordens yta.

När vattenångan kyls ner bildas moln genom en process som kallas kondensation. Dessa moln kan sedan leda till nederbörd i form av regn, snö eller hagel. För att dropparna ska kunna bildas behövs små partiklar i luften att fästa vid, till exempel damm, pollen eller salt från havet. Utan sådana kondensationskärnor skulle luften kunna vara övermättad utan att det bildades några moln.

När nederbörden når marken kan vattnet rinna ner i sjöar och hav eller tränga ner i marken och bli grundvatten. Vad som händer beror mycket på markens beskaffenhet. Porös jord tar upp vatten, medan hårdgjord mark som asfalt leder det vidare på ytan. Det förklarar varför kraftiga skyfall orsakar översvämningar oftare i städer än på landsbygden.

En del av vattnet tas också upp av växter, som sedan avger det genom transpiration. I ett skogsområde kan växternas bidrag till avdunstningen vara nästan lika stort som markens eget.

Hur länge vattnet stannar på ett ställe varierar kraftigt. En vattenmolekyl finns i atmosfären i genomsnitt drygt en vecka, i en flod några veckor, men i djupa grundvattenmagasin kan den ligga kvar i tusentals år. Det är en av anledningarna till att grundvatten som förorenas eller pumpas ut för snabbt inte återställs inom en människas livstid.

Kretsloppet är viktigt för livet på jorden. Det fördelar vatten och hjälper till att reglera klimatet. Genom att flytta värme mellan hav och atmosfär jämnar det ut temperaturskillnader mellan olika delar av jorden.

Människans aktiviteter kan påverka kretsloppet. Föroreningar och klimatförändringar kan förändra hur vatten rör sig och lagras. När luften blir varmare kan den bära mer vattenånga, vilket gör att kretsloppet intensifieras: avdunstningen ökar och nederbörden faller i kraftigare skurar. Följden blir ofta att torra områden blir torrare medan blöta blir blötare.

Även direkta ingrepp spelar roll. Dränerade våtmarker, uträtade vattendrag och stora uttag för jordbruk förändrar var vattnet hamnar och hur snabbt det rör sig.

Havens roll sträcker sig längre än till avdunstningen. De lagrar enorma mängder värme och tar upp en betydande del av den koldioxid människan släpper ut. Det dämpar uppvärmningen i atmosfären, men får konsekvenser i havet, där vattnet blir surare och varmare.

Trots att jorden till stor del är täckt av vatten är andelen sötvatten liten. Omkring två och en halv procent av allt vatten är sött, och merparten av det är bundet i inlandsisar och djupt grundvatten. Den del som finns lätt tillgänglig i sjöar och vattendrag utgör bara en bråkdel av en procent, vilket förklarar varför konkurrensen om vatten kan bli hård även i regnrika områden.

Genom att förstå vattnets kretslopp kan vi bättre skydda våra vattenresurser. Kunskapen gör det möjligt att bedöma vilka åtgärder som faktiskt hjälper, till exempel att återställa våtmarker som håller kvar vatten i landskapet i stället för att leda bort det.`,
  questions: [
    { type: 'literal', q: 'Vad är det som driver vattnets kretslopp?',
      options: ['Jordens rotation kring sin egen axel', 'Solens strålning som tillför energi', 'Månens dragningskraft på haven', 'Vindarna som rör sig över haven'], correct: 1 },
    { type: 'ord', q: 'Vad är kondensationskärnor enligt texten?',
      options: ['Små partiklar som vattendropparna kan fästa vid', 'Kalla luftlager där molnen alltid bildas', 'Kärnor av is som finns inuti varje hagelkorn', 'Områden i havet där avdunstningen är störst'], correct: 0 },
    { type: 'inferens', q: 'Varför drabbas städer oftare av översvämning vid skyfall?',
      options: ['För att det regnar mer över städer än över landsbygd', 'För att stadsluften innehåller fler kondensationskärnor', 'För att hårdgjord mark leder vattnet vidare på ytan', 'För att grundvattnet redan står högre inne i städerna'], correct: 2 },
    { type: 'inferens', q: 'Varför återställs förorenat grundvatten inte inom en människas livstid?',
      options: ['För att föroreningarna binds permanent i berggrunden', 'För att växterna tar upp vattnet innan det hinner renas', 'För att grundvatten inte ingår i vattnets kretslopp alls', 'För att vattnet kan ligga kvar där i tusentals år'], correct: 3 },
    { type: 'literal', q: 'Vad händer med kretsloppet när luften blir varmare?',
      options: ['Avdunstningen minskar medan nederbörden ökar', 'Det intensifieras med kraftigare skurar av nederbörd', 'Vattnet stannar längre kvar i atmosfären än förut', 'Skillnaden mellan torra och blöta områden jämnas ut'], correct: 1 },
    { type: 'sammanfatta', q: 'Vilket syfte har texten framför allt?',
      options: ['Att beskriva hur nederbörd mäts på olika platser', 'Att varna för att dricksvattnet snart tar slut', 'Att jämföra kretsloppet i olika delar av världen', 'Att förklara kretsloppet och vad som påverkar det'], correct: 3 },
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

  // Kontrollera att ord-frågornas begrepp finns i texten
  data.questions.forEach((q, i) => {
    const m = q.q.match(/"([^"]+)"/);
    if (q.type === 'ord' && m && !data.text.toLowerCase().includes(m[1].toLowerCase())) {
      console.error(`  VARNING: ${id} f${i + 1} – "${m[1]}" saknas i texten`);
      ok = false;
    }
  });

  const pos = data.questions.map(q => q.correct);
  const typer = [...new Set(data.questions.map(q => q.type))];
  console.log(`${id.padEnd(16)} åk${String(t.grade).padEnd(3)} ${String(n).padStart(4)} ord ${inom ? '✅' : '❌ krav ' + b[0] + '–' + b[1]}  facit:${pos.join('')}  typer: ${typer.join(', ')}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
if (!ok) process.exit(1);
