#!/usr/bin/env node
//
// Sats 4 av språkomskrivningarna: tolv faktatexter i åk 5.
//
// Samma princip som satserna före. Ämne, årskurs, ordantal och frågor lämnas
// orörda – bara meningsbyggnaden ändras. Måttet som styr är medellängden per
// mening; LIX redovisas men får bara inte stiga.
//
// Varje omskrivning kontrolleras mot frågorna. Se scripts/lib/fragestod.cjs.
//
// Kör med --dry för att se ändringarna utan att skriva.

const fs = require('fs');
const path = require('path');
const { saknade, lix, raknaOrd } = require('./lib/fragestod.cjs');

const BAND = { 5: [300, 320] };
const MAX_MENINGSLANGD = { 5: 16 };

const raknaMeningar = (s) => s.split(/[.!?]+/).filter((m) => m.trim().length > 0).length || 1;
const meningslangd = (s) => raknaOrd(s) / raknaMeningar(s);

const NYA = {
  'ak7-tema-001': `Melodifestivalen är en av Sveriges mest populära tv-tävlingar. Den har sänts nästan varje år sedan 1959. Programmet skapades för att välja Sveriges bidrag till Eurovision Song Contest. Under årtiondena har tävlingen utvecklats mycket. Från en enkel musiktävling i en tv-studio har den blivit en stor turné med deltävlingar runt om i landet. I dag besöker Melodifestivalen flera svenska städer innan finalen avgörs i en större arena.

Från början var det en jury som bestämde vinnaren. Med tiden fick tittarna allt större inflytande. Först kom telefonröstning och senare en särskild app. Det har gjort tävlingen mer interaktiv och engagerande. Samtidigt har diskussioner uppstått om hur rättvis röstningen är. Vissa artister kan gynnas av redan etablerade fanbaser.

Melodifestivalen har också påverkat svensk musikindustri. Många artister har fått sina genombrott genom tävlingen. Både etablerade artister och helt nya namn har kunnat nå en bred publik. Låtarna spelas flitigt på radio och strömningstjänster. Vinnaren får representera Sverige internationellt.

Programmet är mer än bara musik. Det är en stor produktion med avancerad scenteknik, koreografi och visuella effekter. Varje bidrag har tre minuter på sig att övertyga publiken. Det ställer höga krav på både låtskrivare och artister. Numera skrivs många bidrag av professionella låtskrivarlag, ibland med internationella samarbeten.

Samtidigt har Melodifestivalen fått kritik. Vissa menar att låtarna låter för lika varandra och att kommersiella intressen styr för mycket. Andra anser att tävlingen är en viktig tradition som samlar människor i olika åldrar. För många familjer har det blivit en återkommande lördagsaktivitet under vintern.

Tävlingen har också blivit en exportvara. Formatet med deltävlingar och andra chansen har kopierats av flera länder. Svenska låtskrivare anlitas i dag av artister i hela Europa.

Sammanfattningsvis är Melodifestivalen både en musiktävling och ett kulturellt fenomen. Den speglar förändringar i samhället, teknikens utveckling och publikens smak. Oavsett om man älskar eller kritiserar tävlingen fortsätter den att engagera miljoner tittare varje år.`,

  'ak9-tema-006': `När eleverna i nian diskuterade framtida yrken blev bilden av arbetslivet splittrad. Några ville bli läkare eller ingenjörer, yrken som funnits länge. Andra nämnde influencer, e-sportspelare eller dataanalytiker. De yrkena existerade knappt för tjugo år sedan. Läraren i samhällskunskap föreslog att de skulle undersöka hur arbetsmarknaden faktiskt förändras.

En utgångspunkt var automatisering. Maskiner och algoritmer har tagit över uppgifter som tidigare krävde mänskligt arbete, från kassörer till enklare datahantering. Det betyder inte att arbete försvinner helt. Det betyder att innehållet i många yrken förändras. En banktjänsteman idag gör andra saker än för trettio år sedan, även om yrkestiteln är densamma.

Samtidigt växer sektorer som vård, utbildning och tjänster där mänsklig kontakt är central. Många arbetsuppgifter kräver omdöme, kreativitet eller förmåga att hantera oväntade situationer. Sådant är svårare att automatisera. Frågan är därför inte bara vilka jobb som försvinner, utan vilka kompetenser som blir viktigare.

Flexibilitet och förmåga att lära nytt nämns ofta som framtidskompetenser. Om arbetslivet förändras snabbare än förut räcker inte samma kunskaper hela karriären. Det ställer krav både på individer och på utbildningssystem.

Klassen diskuterade också ojämlikhet. Vissa jobb försvinner medan andra kräver lång utbildning, och då kan klyftor uppstå mellan grupper. De som har tillgång till utbildning och nätverk har bättre förutsättningar än de som saknar det. Samhället behöver därför fundera på hur omställningar ska hanteras, med vidareutbildning, trygghetssystem eller andra åtgärder.

En elev påpekade att förändringen inte bara är teknisk. När fler arbetar hemifrån eller på korta uppdrag påverkas också gemenskapen på jobbet. Även fackligt medlemskap och möjligheten att lära sig av äldre kollegor påverkas.

Slutligen lyfte läraren en viktig poäng. Ingen kan förutsäga exakt hur framtiden ser ut. Men att förstå trender och ställa kritiska frågor ger bättre förutsättningar att orientera sig i en föränderlig värld. Det handlar inte om att ha alla svar, utan om att vara beredd att anpassa sig.`,

  'ak9-tema-010': `I sociala medier sprids ofta påståenden om hälsa, miljö eller samhälle. En del är väl underbyggda. Andra bygger på missförstånd eller avsiktlig vilseledning. Att kunna skilja mellan vetenskaplig kunskap och pseudovetenskap har därför blivit en viktig färdighet, inte bara för forskare utan för alla medborgare.

Vetenskap bygger på en metod där påståenden prövas systematiskt. Man samlar in data, testar hypoteser och låter andra granska resultaten. Peer review är ett sätt att kvalitetssäkra forskning. Då granskar oberoende experter en studie innan den publiceras. Det betyder inte att vetenskap är felfri, men att det finns mekanismer för att upptäcka och korrigera fel.

Pseudovetenskap ser däremot ut som vetenskap men saknar dess grundläggande egenskaper. Den kan använda vetenskapliga termer utan att faktiskt följa vetenskaplig metod. Påståenden presenteras som bevisade trots att de inte har testats. Kritik avfärdas som konspiration, och undantag förklaras med påhittade omständigheter.

Ett vanligt exempel är hälsoprodukter som marknadsförs med ord som "kliniskt testad" eller "naturlig". Men kliniskt testad säger ingenting om resultatet av testet. Och naturlig betyder inte automatiskt säkert eller effektivt. Gifter och sjukdomar är också naturliga.

Att tänka kritiskt innebär inte att misstro allt, utan att ställa rätt frågor. Vilken källa ligger bakom påståendet? Har det publicerats i en granskad tidskrift? Finns det oberoende bekräftelser? Kan förklaringen testas, eller är den utformad för att aldrig kunna motbevisas?

En tumregel är att fråga vad som skulle behöva vara sant för att påståendet ska falla. En vetenskaplig hypotes går att formulera så: om experimentet ger ett annat resultat är hypotesen fel. Ett pseudovetenskapligt påstående saknar ofta ett sådant svar.

Källkritiskt tänkande handlar också om att hantera osäkerhet. Vetenskapen ändrar ibland sina slutsatser när ny data tillkommer, vilket kan upplevas som förvirring. Men det är ett tecken på att metoden fungerar: kunskap revideras när verkligheten visar något nytt. Att förstå detta gör det lättare att navigera i ett informationslandskap där inte allt som påstås är sant.`,

  'ak6-tema-024': `I USA på 1950-talet levde svarta och vita människor åtskilda i många delstater. Lagar om segregation styrde vardagen. Svarta och vita hade olika skolor, satt på olika platser i bussar och besökte olika restauranger. Även musiken var uppdelad. Radiostationer spelade antingen musik för svarta eller för vita lyssnare.

Elvis Presley växte upp i denna uppdelade värld, men hans musiksmak följde inte gränserna. I Memphis lyssnade han på svarta bluesmusiker. Han gick på konserter där musiken var rå och känslosam. Samtidigt bar han med sig country och gospel från sin egen uppväxt. När han blandade dessa stilar på inspelningsstudion skapade han något nytt. Det lockade lyssnare oavsett hudfärg.

Detta var kontroversiellt. En del vita föräldrar oroade sig för att deras barn lyssnade på musik med rötter i svart kultur. Samtidigt var vissa svarta musiker frustrerade. En vit sångare fick mycket uppmärksamhet för musik som de själva hade utvecklat under lång tid. Artister som Big Mama Thornton hade spelat in låtar som Elvis senare gjorde till stora hits, men de fick inte samma erkännande.

Ändå hade Elvis framgång en oväntat positiv effekt. Hans musik spelades på radiostationer som annars bara spelade för vita lyssnare, och då öppnades en dörr. Fler människor började lyssna på rhythm and blues och upptäckte svarta artister. Musiken blev en av de första kulturella krafterna som började sudda ut rasliga gränser i USA. Det tog dock lång tid innan lagarna ändrades.

Elvis själv uttryckte respekt för de svarta musiker som inspirerat honom. Men frågan om vem som får kredit för kulturella uttryck är komplex. Historien om Elvis och segregation påminner oss om att musik kan förena människor. Den påminner också om att det spelar roll vem som får synas och höras.

Texten visar att Elvis musik hade en samhällspåverkan bortom underhållning, genom att utmana de gränser som segregationen hade skapat.`,

  'ak9-tema-007': `På ett sjukhus i en annan stad testas ett system som hjälper läkare att prioritera patienter. Systemet analyserar symtom, provresultat och sjukhistorik. Sedan ger det förslag på vilka patienter som bör behandlas först. Det sparar tid, men det väcker också frågor. Vem bär ansvaret om systemet gör fel? Och kan en algoritm göra rättvisa bedömningar?

Artificiell intelligens, ofta förkortat AI, används allt mer för att fatta eller stödja beslut inom vård, rättsväsende, anställningar och kreditgivning. Fördelarna är tydliga. AI kan bearbeta stora mängder data snabbare än en människa och hitta mönster som annars skulle missas. Men systemen bygger på data som samlats in tidigare. Om den datan innehåller snedvridningar kan systemet förstärka dem.

Ett känt exempel handlar om ett rekryteringsverktyg som visade sig missgynna kvinnor. Verktyget hade tränats på historiska data där män var överrepresenterade i vissa roller. Det "lärde sig" därför att associera manliga sökande med framgång. Ingen hade programmerat diskriminering, men resultatet blev ändå problematiskt.

Frågan om ansvar är också komplex. Om en läkare fattar ett felaktigt beslut finns ett tydligt ansvar. Men om läkaren följer ett AI-systems rekommendation och något går fel, vem ska då ställas till svars? Utvecklaren? Sjukhuset? Läkaren själv? Lagstiftningen har inte alltid hängt med den tekniska utvecklingen.

En del menar att lösningen är transparens, alltså att vi ska kunna se hur ett system fattar beslut. Andra hävdar att vissa AI-modeller är så komplexa att de i praktiken är omöjliga att förklara. Denna så kallade "svarta låda"-problematik gör det svårt att granska systemen.

Ett mellansteg som prövas är att kräva att en människa fattar det slutliga beslutet. Kritiken är att människor tenderar att lita på förslaget ändå.

Texten ger inga enkla svar. Men den visar att teknikutveckling inte bara handlar om vad som är möjligt, utan också om vad som är önskvärt. Samhället behöver diskutera vilka gränser som ska finnas för AI och vem som ska besluta om dem.`,

  'ak6-tema-023': `När Elvis Presley slog igenom på 1950-talet förändrades inte bara musiken. Hela populärkulturen påverkades. Plötsligt spelade det roll hur en artist såg ut, rörde sig och klädde sig. Elvis blev en av de första moderna popstjärnorna, där image var nästan lika viktigt som musiken.

Elvis stil var iögonfallande. Han hade sitt mörka hår bakåtslickat med pomada. Han bar kläder som var smalare och mer utmanande än vad de flesta män använde. Hans sätt att röra höfterna på scenen chockade många. Unga människor älskade det. De började klä sig som Elvis, frisera sig som honom och dansa till hans musik. Vuxna och tidningar var mer skeptiska och kallade honom ibland vulgär.

Filmindustrin upptäckte snabbt att Elvis dragningskraft kunde fylla biografer. Mellan 1956 och 1969 medverkade han i över trettio filmer. De flesta var lättsamma musikfilmer med enkla handlingar, men de var populära och sprängde kassorna. Genom filmerna nådde Elvis även människor som inte köpte skivor. Hans ansikte syntes på affischer och tidningsomslag överallt.

Elvis påverkan märktes också i hur företag började använda kändisar för att sälja produkter. Allt från Elvis-dockor till lunchboxar och affischer såldes i miljontals exemplar. Det var ett tidigt exempel på det vi i dag kallar merchandising, alltså att tjäna pengar på en kändis varumärke.

Samtidigt fanns det en baksida. Elvis lånade mycket från svarta musikers uttryck och stil, men det var han som fick berömmelsen och pengarna. Många svarta artister som bidragit till musiken fick inte samma erkännande. Det är en diskussion som fortfarande pågår när man pratar om vem som förtjänar kredit för kulturella uttryck.

Efter hans död 1977 fortsatte försäljningen. Elvis hem Graceland öppnades för besökare och blev en av USA:s mest besökta privatbostäder.

Texten visar att Elvis inte bara var en sångare utan en kulturell kraft. Han förändrade hur vi ser på kändisar, mode och underhållning, men förändringen väcker också viktiga frågor om rättvisa.`,

  'ak6-tema-019': `På Åland är svenska det språk som används i skolan, i butiker och i myndigheter. Det gör att många ålänningar känner en stark koppling till den svenska kulturen. Samtidigt är de en del av Finland. För en utomstående kan det låta motsägelsefullt. För den som bor där är det en vardag: man har svenska som språk, men finska flaggan finns i sammanhang där Åland ingår i Finland.

Att ha svenska som huvudspråk betyder inte att alla pratar exakt likadant. Dialekter kan skilja sig mellan olika öar och byar. En del ord låter lite äldre, och vissa uttryck kan vara typiska för skärgårdsliv. Samtidigt möter unga människor språk från många håll, genom tv, spel och sociala medier. Därför kan man höra en blandning av dialekt, standardsvenska och ord som lånats från finska eller engelska.

Kulturen på Åland syns också i traditioner och platser. Många firar midsommar och ordnar majstänger. Man kan också se spår av sjöfart i museer och gamla hamnområden. För vissa familjer är sommaren den tid då släkt från olika länder kommer på besök. Då blir språket extra viktigt, för man vill kunna hälsa välkommen och berätta om sin plats.

I en klass i Mariehamn jobbade läraren med ett projekt om identitet. Eleverna fick intervjua någon äldre om hur språket på Åland förändrats. Amina intervjuade sin mormor som flyttat hit som vuxen och lärt sig svenska. Oskar intervjuade sin farbror som jobbat på färja och hört många språk. Nelly bor växelvis hos två föräldrar. Hon intervjuade en granne som vuxit upp på en mindre ö och saknade sin dialekt när hen flyttade till stan.

När klassen sammanställde svaren märkte de att språk inte bara är ord. Det handlar om att känna sig hemma, kunna delta i samhället och förstå sin historia. Texten visar att Ålands svenska språk är både en rättighet och en levande del av vardagen, som förändras men fortfarande binder människor samman.`,

  'ak8-tema-007': `Språk är inte statiskt. De ord vi använder idag fanns kanske inte för femtio år sedan. En del ord som var vanliga då har nästan försvunnit. Det handlar inte om att språket blir bättre eller sämre, utan om att det hela tiden anpassas efter hur människor lever och kommunicerar.

En drivkraft bakom språkförändring är nya företeelser. När internet blev vanligt behövde vi ord för saker som inte hade funnits tidigare. Mejl, surfa, blogg och podcast är alla exempel på ord som har kommit in i svenskan för att beskriva ny teknik. Ibland lånas ord från andra språk, ofta engelska, och ibland skapas nya svenska ord. Språkrådet föreslår till exempel "podd" som kortform istället för "podcast".

Men förändring sker också i vardagsspråket utan tekniska orsaker. Slang uppstår i grupper som vill skapa tillhörighet eller markera identitet. Ord som "gansen" kan betyda "allt" i vissa ungdomsgrupper, men vara helt obegripligt för andra.

En annan faktor är hur vi uttrycker oss. Meningar blir ofta kortare, och vissa formella uttryck ersätts av mer direkta. Ett brev som för hundra år sedan började med "Undertecknad får härmed vördsamt meddela..." kan idag inledas med "Hej! Jag vill berätta att...". Det betyder inte att respekten har minskat, utan att normerna för artighet har förändrats.

Samtidigt finns det ord som försvinner för att det de beskriver inte längre är vanligt. Få använder ordet "telefonkatalog" eftersom de flesta slår upp nummer digitalt. Vissa ord lever kvar i uttryck även när deras ursprungliga betydelse glömts bort. Att "slå någon på tråden" kommer från telefonväxlar. Där kopplade man bokstavligen samman linjer med sladdar.

Språkforskare studerar dessa förändringar utan att värdera dem som rätt eller fel. De undersöker mönster: vilka ord sprids, vilka grupper använder dem och hur länge de överlever. För den som är nyfiken på språk blir vardagen full av små ledtrådar om hur kommunikation fungerar och förändras.`,

  'ak9-tema-008': `I ett samhälle några mil från Stockholm stängdes den sista matbutiken förra året. Invånarna fick istället beställa mat online eller åka till en större ort. En del såg det som framsteg, andra som en förlust av något viktigt. Händelsen speglar en större förändring: hur global ekonomi och lokal vardag hänger ihop.

Globalisering innebär att varor, tjänster, kapital och idéer rör sig över gränser i allt högre grad. En mobiltelefon kan innehålla komponenter från tio olika länder. En lokal butik konkurrerar med nätjättar som kan erbjuda lägre priser genom stordrift. Detta har gjort vissa varor billigare och tillgängligare. Men det har också skapat utmaningar för lokala näringar.

När en butik stänger försvinner inte bara möjligheten att handla. Det försvinner också en mötesplats, arbetstillfällen och en del av den sociala väven som håller ihop ett samhälle. Äldre utan bil eller digitala färdigheter kan bli isolerade. Kommunen tappar skatteintäkter, vilket påverkar skolor och äldreomsorg.

Samtidigt finns det motröster. Vissa orter har startat kooperativa butiker där invånarna går samman för att driva verksamheten. Andra satsar på lokal matproduktion eller turism för att skapa nya inkomster. Det visar att utvecklingen inte är ensidig, utan att det finns utrymme för lokala initiativ.

Frågan om globalisering är också politisk. Somliga menar att friare handel skapar välstånd för alla, även om vinsterna är ojämnt fördelade. Andra hävdar att samhällen måste skydda lokala verksamheter för att bevara arbetstillfällen och livskraftiga bygder. Det finns argument på båda sidor. Hur man väger dem beror ofta på vilka värden man prioriterar.

Avstånd spelar också in. Ett paket som körs till en adress på landsbygden kostar mer att leverera än ett i staden. När frakten inte täcker kostnaden får orten sämre villkor.

Texten handlar i grunden om hur vi balanserar effektivitet mot andra mål, som gemenskap, närhet och delaktighet. Den visar att ekonomiska förändringar alltid har sociala konsekvenser, och att medborgare och beslutsfattare har val att göra.`,

  'ak9-tema-016': `När man hör namnet Giorgio Armani tänker många på lyx, kavajer och röda mattan. Men Armanis genomslag handlar också om hur en designer kan påverka både arbetsliv och populärkultur. Giorgio Armani föddes 1934 i Piacenza i norra Italien. Efter en tid med medicinstudier och militärtjänst började han arbeta i modebranschen. Först kom skyltning och försäljning, senare design.

På 1970-talet startade han sitt eget märke. Hans stil beskrevs ofta som avskalad och kontrollerad, med dämpade färger och rena linjer. I stället för att bygga allt på dekor ville han skapa ett uttryck som kändes modernt och lätt att bära. Ett ord som ofta kopplas till Armani är elegans. Men hans elegans var inte högljudd. Den byggde på material, passform och proportioner. Kavajerna blev mindre stela än tidigare. Axlarna blev mjukare, och plagget följde kroppen utan att se slarvigt ut.

Under 1980-talet blev hans kostymer särskilt betydelsefulla. I många länder ökade antalet kontorsjobb, och det fanns en stark idé om hur en professionell person skulle se ut. Armani bidrog till en stil där både män och kvinnor kunde signalera auktoritet utan extrema detaljer. Samtidigt kritiserades perioden för att förstärka pressen att passa in i en viss företagskultur. Det visar att mode inte bara är smak, utan också normer.

Armanis företag växte till en koncern med flera linjer. Skillnaden mellan olika linjer kan handla om pris, kvalitet, målgrupp och var plaggen säljs. Armani satsade på en helhet där allt från parfymflaskor till inredning skulle spegla samma lugna identitet.

Samtidigt är lyxindustrin inte fri från problem. Produktionen kan vara komplex med många underleverantörer, och branschen får kritik för resursförbrukning och avfall. Armanis namn kan därför användas som exempel i en större fråga: Hur kan ett företag kombinera design, status och ansvar? För att förstå det räcker det inte att titta på en snygg kostym. Man behöver också se historien, affärsstrategin och de samhällen som påverkas.`,

  'ak6-tema-025': `I dag kan vem som helst spela in musik hemma med en dator och ett par hörlurar. Men på 1950-talet, när Elvis Presley började sin karriär, såg inspelningstekniken helt annorlunda ut. Att förstå hur musiken spelades in hjälper oss att förstå varför Elvis skivor lät som de gjorde.

Sun Records i Memphis var en liten studio med enkel utrustning. Producenten Sam Phillips använde en bandspelare som fångade ljudet direkt. Det betydde att musikerna behövde spela bra på en gång. Det gick inte att klippa och klistra i ljudet som man kan i dag. Om någon spelade fel fick hela bandet börja om från början.

En av de saker som gjorde Sun Records speciellt var ett eko. Phillips skapade det genom att spela tillbaka ljudet med en kort fördröjning. Det gav inspelningarna en varm, rymdig känsla som blev ett kännetecken för det tidiga rock'n'roll-ljudet. Tekniken kallas slapback echo och användes på många av Elvis första skivor.

När Elvis blev mer berömd flyttade inspelningarna till större studior, bland annat RCA:s studio i Nashville. Där fanns fler mikrofoner, fler spår att spela in på och möjligheten att lägga till instrument efteråt. Det gav en fylligare och mer polerad klang. Vissa fans tyckte dock att den råa energin från Sun Records-tiden gick förlorad.

På 1960-talet började Elvis också spela in musik för sina filmer. Då handlade det mindre om att fånga en speciell känsla i studion. Det handlade mer om att producera låtar snabbt för filmens soundtrack. Kvaliteten varierade, och Elvis själv var ibland frustrerad över att inte få välja sina egna låtar.

Den som lyssnar i dag kan höra skillnaden. Sun-inspelningarna låter smalare men närmare, medan de senare skivorna låter bredare och mer polerade.

Texten visar att tekniken bakom musiken spelar en stor roll för hur den låter. Elvis karriär följde inspelningsteknikens utveckling, från en enkel bandspelare i Memphis till moderna studior med avancerad utrustning.`,

  'ak8-tema-004': `I norra Irak finns ett område som ofta kallas irakiska Kurdistan. Där har den kurdiska befolkningen under lång tid strävat efter större självbestämmande. Efter konflikter och politiska förändringar under 1900-talet växte ett regionalt självstyre fram. I dag finns en regional regering med parlament och egna myndigheter inom flera områden. Samtidigt är regionen formellt en del av Irak. Det betyder att vissa beslut måste förhandlas med den federala staten i Bagdad.

I praktiken kan självstyre handla om allt från skolans språkval till hur polis och sjukvård organiseras. Men det kan också handla om ekonomi. Regionen har naturresurser, och inkomsterna från till exempel olja kan skapa både möjligheter och konflikter. Om den regionala nivån och centralstaten inte är överens om hur pengar ska fördelas kan löner, investeringar och samhällsservice påverkas. För invånare kan detta kännas konkret: blir det elavbrott? Finns det jobb? Kan unga starta företag?

Relationerna med grannländer spelar också roll. Kurdiska områden ligger nära flera gränser. Politiska förändringar kan därför göra grannar oroliga för att egna minoriteter ska kräva samma sak. Regionen påverkas alltså av diplomati, handel och ibland spänningar. Många kurder i Irak har dessutom band till släktingar i andra länder. Händelser på andra sidan en gräns kan därför kännas personliga.

Ett återkommande exempel är folkomröstningen 2017. Där röstade en stor majoritet i regionen för självständighet. Resultatet erkändes inte av Bagdad och möttes av motstånd från flera grannländer. Området förlorade kort därefter kontrollen över omtvistade områden. Händelsen används i dag som argument av båda sidor.

En del politiska rörelser har drivit frågan om självständighet. Även bland dem som vill ha ett eget land finns olika uppfattningar om tidpunkt och väg dit. Andra betonar att starka institutioner, rättssäkerhet och fungerande demokratiska processer måste komma först. Texten visar att politik sällan är en enkel knapp. Mer självstyre kan ge inflytande, men kräver också kompromisser, stabilitet och ansvar.`,
};

// ─── Körning ────────────────────────────────────────────────────────────────

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let fel = 0;
const rader = [];

for (const [id, nyText] of Object.entries(NYA)) {
  const t = lib.find((x) => x.id === id);
  if (!t) {
    console.error(`${id}: finns inte i biblioteket`);
    fel++;
    continue;
  }
  const band = BAND[t.grade];
  if (!band) {
    console.error(`${id}: åk ${t.grade} saknar ordintervall i skriptet`);
    fel++;
    continue;
  }

  const ord = raknaOrd(nyText);
  if (ord < band[0] || ord > band[1]) {
    console.error(`${id}: ${ord} ord, utanför ${band[0]}–${band[1]}`);
    fel++;
  }

  const foreLangd = meningslangd(t.text);
  const efterLangd = meningslangd(nyText);
  if (efterLangd > MAX_MENINGSLANGD[t.grade]) {
    console.error(
      `${id}: ${efterLangd.toFixed(1)} ord/mening, taket för åk ${t.grade} är ${MAX_MENINGSLANGD[t.grade]}`
    );
    fel++;
  }
  if (efterLangd >= foreLangd) {
    console.error(`${id}: meningarna blev inte kortare (${foreLangd.toFixed(1)} → ${efterLangd.toFixed(1)})`);
    fel++;
  }

  const foreLix = lix(t.text);
  const efterLix = lix(nyText);
  if (efterLix > foreLix) {
    console.error(`${id}: LIX steg ${foreLix} → ${efterLix}`);
    fel++;
  }

  const tappade = saknade(t.text, nyText, t.questions);
  if (tappade.length) {
    console.error(`${id}: frågorna tappar underlag – saknade ord: ${tappade.join(', ')}`);
    fel++;
  }

  rader.push({ t, nyText, ord, foreLangd, efterLangd, foreLix, efterLix });
}

if (fel) {
  console.error(`\n${fel} problem – inget skrivet.`);
  process.exit(1);
}

console.log('id                 åk   ord   ord/mening      LIX');
for (const r of rader) {
  r.t.text = r.nyText;
  r.t.meta = { ...(r.t.meta || {}), wordCount: r.ord };
  console.log(
    `${r.t.id.padEnd(18)} ${String(r.t.grade).padStart(2)} ${String(r.ord).padStart(5)}   ` +
      `${r.foreLangd.toFixed(1).padStart(4)} → ${r.efterLangd.toFixed(1).padStart(4)}   ` +
      `${String(r.foreLix).padStart(3)} → ${String(r.efterLix).padStart(3)}`
  );
}

if (!dry) {
  fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
  console.log('\nSkrivet.');
} else {
  console.log('\n(dry run – inget skrivet)');
}
