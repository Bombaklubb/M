#!/usr/bin/env node
//
// Sats 12: fem texter i intervallet 180–182 ord, med omskrivna frågor.

const fs = require('fs');
const path = require('path');

const NYA = {

// ── åk 8, 180 → ~550 ord ────────────────────────────────────────────────
'ak8-tema-001-c': {
  text: `Smink har använts i tusentals år i olika kulturer, både för estetiska och praktiska syften. I det gamla Egypten användes kajal inte bara för att framhäva ögonen utan också för att skydda mot solen och infektioner. Idag används smink främst för att uttrycka identitet, stil och kreativitet, men också i professionella sammanhang som film och teater.

Historien visar att vad som räknats som normalt har växlat kraftigt. Under 1700-talet var puder, rouge och skönhetsfläckar självklara för både män och kvinnor vid de europeiska hoven. Under 1800-talet svängde det åt motsatt håll: synligt smink kopplades till oärlighet och till kvinnor som ansågs olämpliga. Att smink i dag främst förknippas med kvinnor är alltså ingen naturlag utan resultatet av en ganska sen förändring.

Vad smink faktiskt består av är värt att veta. Produkterna innehåller färgämnen, fetter, vatten och konserveringsmedel, och i EU regleras vilka ämnen som får ingå. Ett företag måste kunna visa att en produkt är säker innan den säljs, och vissa ämnen som tidigare var vanliga är i dag helt förbjudna.

Sedan 2013 är det dessutom förbjudet att sälja kosmetika i EU som testats på djur. Förbudet gäller även produkter tillverkade i andra länder, vilket har fått stor betydelse eftersom många företag vill sälja på den europeiska marknaden. Samtidigt kräver vissa länder utanför EU fortfarande djurtester, vilket gör frågan mer komplicerad än märkningen på en förpackning antyder.

För många ungdomar är smink en del av vardagen. Det kan handla om att känna sig mer självsäker eller att experimentera med olika uttryck. Samtidigt finns det en debatt om skönhetsideal och hur sociala medier påverkar ungas självbild. Bilder som redigeras och filtreras kan skapa orealistiska förväntningar.

Smink är ibland också ett krav. Inom vissa yrken, som flyg och delar av hotellbranschen, har arbetsgivare haft klädkoder som förutsatt att kvinnliga anställda sminkar sig. Sådana regler har prövats som diskriminering i flera länder, eftersom motsvarande krav sällan ställts på män.

Inom film och teater är sminket ett eget hantverk med lång utbildning. En maskör kan få en skådespelare att åldras trettio år, skapa sår som ser äkta ut eller bygga om ett ansikte helt. Där handlar arbetet inte om skönhet alls, utan om att en berättelse ska bli trovärdig.

Priserna varierar dessutom kraftigt utan att innehållet alltid gör det. Två läppstift kan innehålla nästan samma ämnen men kosta tio gånger olika mycket, eftersom en stor del av priset går till förpackning, varumärke och marknadsföring. Att en dyr produkt känns bättre är därför inte alltid en fråga om vad som finns i burken.

Det finns också en växande rörelse som förespråkar naturlighet och att man inte ska känna sig tvungen att använda smink. Vissa väljer att helt avstå, medan andra ser det som en konstform. Diskussionen kompliceras av att båda sidor kan ha rätt samtidigt: att sminka sig kan vara ett fritt val och samtidigt ske under ett tryck som inte drabbar alla lika.

Sminkindustrin har dessutom börjat fokusera mer på hållbarhet. Produkter utvecklas för att vara miljövänliga och inte testas på djur. Konsumenter blir allt mer medvetna om vad de köper. Frågorna handlar bland annat om mikroplaster i skrubbprodukter, om förpackningar som blandar plast och metall och därför är svåra att återvinna, och om hur råvaror som glimmer utvinns.

Sammanfattningsvis är smink mer än bara utseende. Det handlar om identitet, påverkan från samhället och individuella val.`,
  questions: [
    { type: 'inferens', q: 'Varför skriver texten att kopplingen mellan smink och kvinnor inte är någon naturlag?',
      options: ['För att smink uppfanns långt innan könsroller fanns', 'För att män vid de europeiska hoven använde puder och rouge', 'För att smink i dag säljs till alla oavsett kön', 'För att reglerna om innehåll gäller lika för alla'], correct: 1 },
    { type: 'literal', q: 'Vad måste ett företag kunna visa innan en produkt säljs i EU?',
      options: ['Att den tillverkats inom unionens gränser', 'Att den kostar mindre än ett fastställt takpris', 'Att den är säker att använda', 'Att den går att återvinna i sin helhet'], correct: 2 },
    { type: 'inferens', q: 'Varför är frågan om djurtester mer komplicerad än märkningen antyder?',
      options: ['För att märkningen inte kontrolleras av någon myndighet', 'För att förbudet bara gäller nya produkter på marknaden', 'För att djurtester är svåra att upptäcka i efterhand', 'För att vissa länder utanför EU fortfarande kräver dem'], correct: 3 },
    { type: 'literal', q: 'Vad går en stor del av priset på ett dyrt läppstift till?',
      options: ['Förpackning, varumärke och marknadsföring', 'Forskning på nya och säkrare ämnen', 'Transporter mellan olika tillverkningsländer', 'Kontroller av att innehållet är godkänt'], correct: 0 },
    { type: 'inferens', q: 'Varför kan båda sidor i debatten om naturlighet ha rätt samtidigt?',
      options: ['För att ingen av dem bygger sina argument på fakta', 'För att ett val kan vara fritt och ändå ske under ett tryck', 'För att smink används av allt färre unga i dag', 'För att frågan egentligen handlar om priset'], correct: 1 },
    { type: 'sammanfatta', q: 'Vilka hållbarhetsfrågor tar texten upp?',
      options: ['Transporter, arbetsvillkor och skatter på kosmetika', 'Vattenförbrukning och användning av konstgjorda färger', 'Mikroplaster, svårvunna förpackningar och utvinning av råvaror', 'Reklam riktad till barn och krav på åldersgränser'], correct: 2 },
  ],
},

// ── åk 8, 181 → ~550 ord ────────────────────────────────────────────────
'ak8-tema-002-b': {
  text: `Industrialiseringen var en period av stora förändringar som började i slutet av 1700-talet i Storbritannien och spreds till andra delar av världen. Den innebar att produktionen gick från att vara hantverksbaserad till att ske i fabriker med hjälp av maskiner. En viktig uppfinning var ångmaskinen, som gjorde det möjligt att producera varor snabbare och i större mängder.

Att det började just i Storbritannien har flera förklaringar. Landet hade gott om kol och järnmalm, en flotta som nådde marknader över hela världen och banker som kunde låna ut pengar till den som ville bygga något nytt. Dessutom hade förändringar i jordbruket gjort att färre behövdes på åkrarna, vilket frigjorde arbetskraft.

Textilindustrin gick först. Att spinna garn och väva tyg hade i århundraden gjorts för hand i hemmen, ofta av kvinnor. Med spinnmaskiner och mekaniska vävstolar kunde samma arbete göras många gånger snabbare, men bara på en plats där det fanns kraft att driva maskinerna. Därför flyttade arbetet från hemmet till fabriken, och därmed också dygnsrytmen: arbetsdagen bestämdes nu av en klocka i stället för av dagsljuset.

När fabriker byggdes flyttade många människor från landsbygden till städerna för att arbeta. Detta ledde till snabb urbanisering och att städer växte kraftigt. Arbetsvillkoren var ofta hårda, med långa arbetsdagar och låg lön, även för barn.

Barnarbetet var utbrett. Barn var billiga, gjorde som de blev tillsagda och kunde krypa in under maskinerna för att rensa bort dammet medan de gick. Skador var vanliga. De första lagarna som begränsade barnarbete kom i Storbritannien under 1830-talet, men de var länge svåra att kontrollera eftersom det saknades tillräckligt med inspektörer.

Städerna växte fortare än de klarade av. Bostäderna var trånga, avloppen otillräckliga och dricksvattnet ofta förorenat, vilket ledde till återkommande utbrott av kolera och tyfus. Det var delvis dessa epidemier som drev fram de första stora satsningarna på vattenledningar och avlopp, eftersom sjukdomarna inte stannade i arbetarkvarteren utan spred sig till alla. Renare städer blev alltså inte bara en fråga om medkänsla utan också om egenintresse hos dem som hade makten.

Industrialiseringen förändrade också ekonomin. Företag växte fram och handel ökade. Samtidigt uppstod nya samhällsklasser, som arbetarklassen och borgarklassen. Skillnaderna mellan rika och fattiga blev tydligare.

Med tiden började människor protestera mot dåliga arbetsvillkor. Fackföreningar bildades för att kämpa för bättre löner och kortare arbetsdagar. Att gå med i en förening var länge förenat med risk: den som organiserade sig kunde bli av med både arbetet och bostaden, eftersom bostaden ofta ägdes av fabriken. Reformer infördes så småningom, vilket förbättrade levnadsförhållandena.

I Sverige kom industrialiseringen senare, med tyngdpunkt under andra halvan av 1800-talet. Sågverken längs Norrlandskusten och järnbruken i Bergslagen var tidiga exempel. Samtidigt utvandrade omkring en miljon svenskar till Nordamerika, vilket säger något om hur svår försörjningen var för många under just de åren.

Råvarorna till fabrikerna kom ofta långt bortifrån. Bomullen som spanns i brittiska fabriker odlades i hög grad av slavar i södra USA, och den europeiska industrins tillväxt hängde därmed ihop med förhållanden i andra världsdelar.

Industrialiseringen bidrog också till teknisk utveckling och förbättrad levnadsstandard för många. Samtidigt skapade den miljöproblem och sociala utmaningar som fortfarande påverkar samhället idag. Det var under de här åren som storskalig förbränning av kol började, vilket är utgångspunkten för de utsläpp som i dag påverkar klimatet.

Denna period visar hur tekniska framsteg kan förändra hela samhällen, både positivt och negativt.`,
  questions: [
    { type: 'literal', q: 'Varför började industrialiseringen just i Storbritannien?',
      options: ['Landet hade kol, järnmalm, handelsvägar och tillgång till kapital', 'Landet hade den överlägset största befolkningen i Europa', 'Landet hade förbjudit allt hantverksarbete i städerna', 'Landet hade som enda land tillgång till ångmaskiner'], correct: 0 },
    { type: 'inferens', q: 'Varför flyttade textilarbetet från hemmet till fabriken?',
      options: ['För att hemmen blev för trånga för de växande familjerna', 'För att maskinerna krävde kraft som bara fanns på en plats', 'För att kvinnor med tiden förbjöds att arbeta hemma', 'För att tygerna behövde tillverkas närmare hamnarna'], correct: 1 },
    { type: 'inferens', q: 'Vad menas med att dygnsrytmen förändrades?',
      options: ['Att arbetarna i stället började arbeta under nätterna', 'Att fabrikerna höll öppet olika länge under olika årstider', 'Att arbetsdagen bestämdes av en klocka i stället för av dagsljuset', 'Att helgerna infördes som lediga dagar i fabrikerna'], correct: 2 },
    { type: 'literal', q: 'Varför var det riskabelt att gå med i en fackförening?',
      options: ['För att medlemsavgifterna var mycket höga för en arbetare', 'För att myndigheterna registrerade samtliga medlemmar', 'För att medlemskapet krävde att man kunde läsa och skriva', 'För att man kunde förlora både arbetet och bostaden'], correct: 3 },
    { type: 'literal', q: 'Vad hände i Sverige under industrialiseringens år?',
      options: ['Omkring en miljon svenskar utvandrade till Nordamerika', 'Jordbruket växte snabbare än industrin i hela landet', 'Fackföreningar var förbjudna ända fram till sekelskiftet', 'Sågverken flyttades från kusten in mot Bergslagen'], correct: 0 },
    { type: 'sammanfatta', q: 'Varför nämner texten bomullen från södra USA?',
      options: ['För att förklara varför tyger länge var dyra i Europa', 'För att visa att industrins tillväxt hängde ihop med slaveri', 'För att jämföra brittiskt och amerikanskt jordbruk', 'För att peka på varför bomull senare ersattes av ull'], correct: 1 },
  ],
},

// ── åk 7, 182 → ~515 ord ────────────────────────────────────────────────
'ak7-tema-039': {
  text: `Artificiell intelligens, ofta förkortat AI, är teknik som gör att datorer kan utföra uppgifter som vanligtvis kräver mänsklig intelligens. Det kan handla om att känna igen bilder, förstå språk eller fatta beslut.

AI används redan i många delar av samhället. Till exempel kan mobiltelefoner använda AI för att känna igen ansikten i bilder. Streamingtjänster använder AI för att rekommendera filmer baserat på vad du tidigare har sett.

Tekniken bygger ofta på stora mängder data. Genom att analysera data kan AI-system hitta mönster och lära sig över tid. Detta kallas maskininlärning.

Skillnaden mot vanliga program är värd att förstå. I ett vanligt program skriver en människa reglerna: om detta händer, gör det. Ett system som lär sig får i stället se tusentals exempel och räknar själv ut vilka drag som hänger ihop med vilket svar. Ingen har alltså skrivit ned regeln för hur en katt ser ut, utan systemet har hittat den i bilderna.

Det gör att materialet som systemet tränats på blir avgörande. Har ett ansiktsigenkänningssystem framför allt sett ljushyade ansikten fungerar det sämre på andra, inte för att någon velat det utan för att exemplen var skeva. Sådana fel upptäcks ofta först när tekniken redan används.

Ett annat problem är att system som skriver text kan låta säkra även när de har fel. De väljer ord som brukar passa ihop, vilket ger meningar som ser rätt ut också när innehållet är påhittat. Att kontrollera en uppgift i en annan källa är därför nödvändigt, hur välformulerat svaret än verkar.

De senaste årens stora förändring är att AI kan skapa nytt material: text, bilder, röster och musik. Det ger nya möjligheter men också nya frågor, som vem som äger en bild byggd på tusentals andras verk, och hur man vet om en inspelad röst verkligen tillhör den den låter som.

Men AI väcker också frågor. Vem ansvarar om ett AI-system gör fel? Hur skyddas människors integritet när stora mängder data samlas in? Dessa frågor diskuteras av forskare, politiker och företag. Inom EU har en särskild lag om AI arbetats fram, där användningen delas in efter hur riskabel den är: ju större risk för människor, desto hårdare krav.

Det finns också en oro för att AI kan ersätta vissa jobb. Samtidigt kan tekniken skapa nya möjligheter och yrken. Historiskt har ny teknik ofta förändrat arbetsmarknaden snarare än att helt ta bort jobb. Det är dock en klen tröst för den enskilda som förlorar sitt arbete, eftersom de nya jobben sällan uppstår på samma plats eller kräver samma kunskaper.

Ordet intelligens i namnet är delvis missvisande. Det valdes redan på 1950-talet, långt innan tekniken kunde göra något av det den gör i dag.

Det är också värt att komma ihåg vad AI inte är. Ett system som beskriver en känsla har inte känt något, och ett som svarar snabbt förstår inte frågan på det sätt en människa gör. Att tekniken är imponerande betyder inte att den fungerar som ett medvetande.

För att använda AI på ett bra sätt krävs kunskap och regler. Genom att förstå tekniken kan människor fatta informerade beslut och använda AI på ett ansvarsfullt sätt.`,
  questions: [
    { type: 'inferens', q: 'Vad är den viktigaste skillnaden mot ett vanligt datorprogram?',
      options: ['Att systemet arbetar betydligt snabbare än vanliga program', 'Att systemet själv räknar ut mönstren i stället för att få regler', 'Att systemet kan köras på vilken dator som helst', 'Att systemet aldrig behöver uppdateras i efterhand'], correct: 1 },
    { type: 'literal', q: 'Varför fungerar vissa ansiktsigenkänningssystem sämre på vissa ansikten?',
      options: ['För att kamerorna har för låg upplösning', 'För att programmen medvetet ställts in så', 'För att exemplen de tränats på varit skeva', 'För att belysningen varierar mellan platser'], correct: 2 },
    { type: 'inferens', q: 'Varför kan ett system som skriver text låta säkert trots att det har fel?',
      options: ['För att det hämtar sina svar från en enda källa', 'För att det svarar snabbare än det hinner kontrollera', 'För att det är byggt för att aldrig erkänna misstag', 'För att det väljer ord som brukar passa ihop'], correct: 3 },
    { type: 'literal', q: 'Hur är EU:s lag om AI uppbyggd?',
      options: ['Användningen delas in efter hur riskabel den är', 'All användning kräver tillstånd från en myndighet', 'Reglerna gäller bara företag med många anställda', 'Systemen måste utvecklas inom unionens gränser'], correct: 0 },
    { type: 'inferens', q: 'Varför är det en klen tröst att nya jobb brukar uppstå?',
      options: ['För att de nya jobben ofta betalar sämre än de gamla', 'För att de sällan finns på samma plats eller kräver samma kunskaper', 'För att det tar decennier innan de nya jobben uppstår', 'För att antalet nya jobb alltid är färre än de som försvinner'], correct: 1 },
    { type: 'sammanfatta', q: 'Vad påminner texten om att AI inte är?',
      options: ['Ett verktyg som kan användas i skolan', 'En teknik som kräver stora mängder data', 'Ett medvetande som förstår och känner', 'En uppfinning från de senaste åren'], correct: 2 },
  ],
},

// ── åk 8, 182 → ~550 ord ────────────────────────────────────────────────
'ak8-tema-003-b': {
  text: `Digital teknik har blivit en central del av människors vardag. Mobiltelefoner, datorer och internet används för kommunikation, arbete, studier och underhållning. Den snabba tekniska utvecklingen har förändrat hur vi lever och interagerar med varandra.

En viktig del av digital teknik är internet, som gör det möjligt att dela information globalt på några sekunder. Sociala medier gör det lätt att hålla kontakt med vänner, men kan också påverka hur människor ser på sig själva och andra.

I Sverige har digitaliseringen gått ovanligt långt i myndigheters och bankers tjänster. Att legitimera sig med BankID, deklarera med några knapptryck eller boka en tid hos vården i en app är i dag självklart för många. Det sparar tid, men det innebär också att den som saknar en modern telefon eller ett svenskt personnummer får svårare att sköta helt vanliga ärenden.

Det digitala utanförskapet drabbar framför allt äldre, men inte bara dem. Enligt återkommande undersökningar står flera hundra tusen personer i Sverige helt eller delvis utanför det digitala samhället. När kontanter försvinner och pappersblanketter tas bort blir det en fråga om vem som får vara med, inte bara om vem som tycker att tekniken är bekväm.

Digitalisering har också förändrat arbetslivet. Många yrken kräver idag teknisk kompetens, och nya jobb har skapats inom IT och digitala tjänster. Samtidigt har vissa traditionella yrken minskat i betydelse. Att arbete och studier kan skötas hemifrån har gett frihet för en del, men också gjort gränsen mellan arbetstid och fritid otydligare.

Det finns även risker med digital teknik. Integritet och säkerhet är viktiga frågor, eftersom personlig information kan spridas eller missbrukas. Dessutom kan överdriven skärmtid påverka hälsa och koncentration.

Bedrägerier har blivit en av de vanligaste brottstyperna. Ett vanligt upplägg är nätfiske: ett meddelande som ser ut att komma från banken, posten eller en myndighet ber mottagaren att legitimera sig eller klicka på en länk. Det som gör dem effektiva är sällan tekniken utan tidspressen. Ett äkta meddelande från en bank ber aldrig någon att skynda sig att logga in.

Ett annat mindre synligt problem är beroendet av att allt fungerar. När ett betalsystem, ett journalsystem eller ett mobilnät ligger nere stannar verksamheter som tidigare klarade sig utan dem. Därför övar sjukhus, kommuner och butiker numera på att arbeta utan de digitala systemen, ungefär som man övar på brand.

Tekniken syns inte heller i elräkningen på det sätt man kan tro. Datorhallar som lagrar och beräknar allt vi lägger upp använder betydande mängder el och vatten för kylning, och de senaste årens AI-tjänster har ökat behovet ytterligare.

Digitalt material är dessutom förvånansvärt kortlivat. Ett dokument sparat i ett format som inte längre stöds kan bli oläsligt, och en tjänst som läggs ned tar ofta med sig det användarna lagt upp. Papper som legat i en låda i hundra år går fortfarande att läsa.

Mycket av tekniken ägs dessutom av ett fåtal företag i ett fåtal länder. När en skola väljer plattform, eller en myndighet väljer var uppgifterna ska lagras, är det därför också ett beslut om vem som får tillgång till dem och under vilket lands lagar.

Trots dessa utmaningar erbjuder digital teknik stora möjligheter. Den kan användas för utbildning, innovation och problemlösning. Genom att använda tekniken ansvarsfullt kan människor dra nytta av dess fördelar samtidigt som riskerna minimeras.

Framtiden kommer sannolikt att präglas ännu mer av digital teknik, vilket gör det viktigt att förstå dess påverkan.`,
  questions: [
    { type: 'inferens', q: 'Vilken baksida har den långt drivna digitaliseringen i Sverige?',
      options: ['Att myndigheternas handläggning har blivit långsammare', 'Att tjänsterna kostar mer än de gjorde tidigare', 'Att den som saknar telefon eller personnummer får svårt med vanliga ärenden', 'Att uppgifterna sparas under kortare tid än förut'], correct: 2 },
    { type: 'literal', q: 'Hur många i Sverige står utanför det digitala samhället?',
      options: ['Flera hundra tusen personer, helt eller delvis', 'Ungefär tio tusen personer, framför allt äldre', 'Omkring en miljon personer i arbetsför ålder', 'Ett par tusen personer på landsbygden'], correct: 0 },
    { type: 'inferens', q: 'Vad gör nätfiske effektivt enligt texten?',
      options: ['Att meddelandena skickas till mycket många samtidigt', 'Att tidspressen får mottagaren att agera utan att tänka efter', 'Att avsändaradressen är omöjlig att kontrollera', 'Att bankerna sällan varnar sina kunder i förväg'], correct: 1 },
    { type: 'literal', q: 'Varför övar sjukhus och kommuner på att arbeta utan digitala system?',
      options: ['För att personalen ska lära sig de gamla rutinerna', 'För att systemen byts ut med jämna mellanrum', 'För att kraven kommer från EU:s regelverk', 'För att verksamheten annars stannar när något ligger nere'], correct: 3 },
    { type: 'inferens', q: 'Varför nämns datorhallarnas el- och vattenanvändning?',
      options: ['För att visa att teknikens miljöpåverkan är osynlig för användaren', 'För att förklara varför abonnemangen har blivit dyrare', 'För att peka på att hallarna byggs i fel länder', 'För att jämföra AI med äldre former av databehandling'], correct: 0 },
    { type: 'sammanfatta', q: 'Vilken hållning till digital teknik har texten?',
      options: ['Att utvecklingen bör bromsas tills riskerna är lösta', 'Att fördelarna är så stora att riskerna kan förbises', 'Att tekniken ger stora möjligheter men kräver medvetenhet', 'Att ansvaret helt ligger hos de företag som bygger tjänsterna'], correct: 2 },
  ],
},

// ── åk 8, 182 → ~550 ord ────────────────────────────────────────────────
'ak8-tema-005-b': {
  text: `Idrott spelar en viktig roll både för individens hälsa och för samhället. Genom fysisk aktivitet stärks kroppen, konditionen förbättras och risken för vissa sjukdomar minskar. Regelbunden träning kan också bidra till bättre mental hälsa genom att minska stress och öka välbefinnandet.

Hur mycket rörelse som behövs är väl undersökt. Rekommendationen för barn och unga är minst en timmes rörelse om dagen, och den behöver inte ske i en idrottshall. Att cykla till skolan, gå i trappor eller spela något på rasten räknas. Effekten är dessutom störst för den som rör sig minst: steget från nästan ingenting till lite betyder mer för hälsan än steget från mycket till ännu mer.

Idrott handlar inte bara om fysisk prestation, utan också om gemenskap. Många människor deltar i lagidrotter där samarbete och kommunikation är viktiga. Detta kan stärka sociala relationer och skapa en känsla av tillhörighet.

Samtidigt slutar många unga att idrotta i föreningsform under tonåren. En vanlig förklaring är att verksamheten tidigt delas upp efter hur bra man är, så att den som inte hör till de bästa slutar få speltid. Den som lämnar gör det alltså ofta inte för att intresset försvunnit, utan för att det inte längre finns en plats att fortsätta på.

Kostnaden spelar också in. Avgifter, utrustning, läger och resor gör att vissa idrotter blir svåra att välja för familjer med små marginaler. Skillnaden syns i statistiken: barn i hushåll med låga inkomster deltar i föreningsidrott i betydligt lägre grad än andra.

I Sverige sker mycket av idrotten i ideella föreningar. Föräldrar och andra vuxna leder träningar, kör bilar till matcher och sköter kiosker utan lön. Det systemet gör idrotten billigare än den annars skulle vara, men det gör den också beroende av att tillräckligt många har tid och möjlighet att ställa upp.

På samhällsnivå kan idrott bidra till integration. Människor från olika bakgrunder möts och samarbetar, vilket kan minska fördomar och öka förståelsen. Idrottsevenemang kan också skapa stolthet och gemenskap i ett samhälle. Effekten kommer dock inte av sig själv: en förening där alla redan känner varandra kan lika gärna förstärka gränser som riva dem.

Samtidigt finns det utmaningar. Pressen att prestera kan leda till stress, och i vissa fall förekommer doping eller osunda träningsvanor. Det är därför viktigt att idrott utövas på ett hälsosamt och ansvarsfullt sätt. Inom idrotter där utseende eller vikt bedöms är risken för ätstörningar särskilt undersökt, och flera förbund har infört regler som gör att en aktiv inte får tävla utan medicinsk kontroll.

Idrott och politik går dessutom sällan att hålla isär. Stora mästerskap tilldelas länder som vill förbättra sitt anseende, och idrottare har genom historien använt uppmärksamheten till att ta ställning i samhällsfrågor. Att kräva att idrotten ska vara neutral är i sig ett ställningstagande.

Idrott är dessutom inte lika tillgänglig för alla. Flickor lägger av i högre grad än pojkar, personer med funktionsnedsättning möter anläggningar som inte är anpassade, och den som bär slöja eller inte vill duscha med andra kan hindras av regler som ingen tänkt igenom. Att öppna en verksamhet handlar ofta om praktiska detaljer snarare än om stora principer.

Skolan har en viktig roll i att uppmuntra fysisk aktivitet och ge elever möjlighet att prova olika idrotter. Detta kan bidra till att skapa goda vanor som varar livet ut.

Sammanfattningsvis är idrott en viktig del av både individens liv och samhället i stort.`,
  questions: [
    { type: 'literal', q: 'Hur mycket rörelse rekommenderas för barn och unga?',
      options: ['Minst tre timmar i veckan i en idrottshall', 'Minst en timmes rörelse om dagen', 'Minst två träningspass i en förening', 'Minst trettio minuter varannan dag'], correct: 1 },
    { type: 'inferens', q: 'Varför betyder rörelse mest för den som rör sig minst?',
      options: ['För att den personen ofta är yngre än de andra', 'För att träning känns roligare i början', 'För att steget från nästan ingenting ger störst effekt', 'För att kroppen vänjer sig vid all träning med tiden'], correct: 2 },
    { type: 'inferens', q: 'Varför slutar många unga med föreningsidrott under tonåren?',
      options: ['För att träningstiderna krockar med skolarbetet', 'För att intresset för idrott naturligt avtar med åldern', 'För att föreningarna blir färre i takt med att de växer', 'För att uppdelningen efter nivå gör att många inte får spela'], correct: 3 },
    { type: 'literal', q: 'Vad gör den svenska föreningsmodellen beroende av?',
      options: ['Att tillräckligt många vuxna har tid att ställa upp gratis', 'Att kommunerna bygger nya anläggningar varje år', 'Att förbunden fördelar pengarna jämnt mellan idrotterna', 'Att skolorna samarbetar med de lokala klubbarna'], correct: 0 },
    { type: 'inferens', q: 'Varför kommer integrationseffekten inte av sig själv?',
      options: ['För att språket ofta blir ett hinder på träningarna', 'För att en förening där alla redan känns kan förstärka gränser', 'För att lagidrotter kräver fler deltagare än som finns', 'För att effekten bara uppstår vid stora evenemang'], correct: 1 },
    { type: 'sammanfatta', q: 'Vad menar texten om kravet att idrotten ska vara neutral?',
      options: ['Att det är rimligt eftersom sport och politik är olika saker', 'Att det bara gäller vid internationella mästerskap', 'Att det i sig är ett ställningstagande', 'Att det har införts av flera förbund på senare år'], correct: 2 },
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
