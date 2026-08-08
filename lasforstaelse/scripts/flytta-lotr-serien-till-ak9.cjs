#!/usr/bin/env node
//
// Sagan om ringen-serien (ak9-lotr-001…005) flyttas från åk 4 till åk 9.
//
// Texterna är litteraturanalys: karaktärsutveckling, symbolik, världsbygge och
// moraliska dilemman i en romantrilogi. De låg på åk 4 med runt 210 ord, och
// årskursen hade uppenbart satts efter längden – ordantalet stämmer exakt med
// åk 4:s intervall medan innehållet ligger på LIX 40–50 mot årskursens median 39.
//
// Serien flyttas som helhet och skrivs ut till åk 9:s intervall 570–590 ord.
// Det tillagda är sådant som faktiskt hör till analysen och saknades: flätningen
// som berättarteknik och ramberättelsen i del 1, platta och runda gestalter samt
// Éowyn i del 2, Tolkiens eget avståndstagande från allegori och temat död och
// odödlighet i del 3, att språken kom före berättelsen i del 4, och i del 5 det
// som är svårast att förbigå – att Frodo faktiskt misslyckas vid Domedagsberget.
//
// Kör med --dry för att se ändringarna utan att skriva.

const fs = require('fs');
const path = require('path');

const MAL_ARSKURS = 9;
const MIN_ORD = 570;
const MAX_ORD = 590;

const FORVANTAT = {
  'ak9-lotr-001': { grade: 4, borjarMed: 'Sagan om ringen är en trilogi skriven av' },
  'ak9-lotr-002': { grade: 4, borjarMed: 'En av de mest framträdande aspekterna i Sagan' },
  'ak9-lotr-003': { grade: 4, borjarMed: 'Sagan om ringen innehåller en rik symbolik' },
  'ak9-lotr-004': { grade: 4, borjarMed: 'En avgörande faktor bakom Sagan om ringens genomslag' },
  'ak9-lotr-005': { grade: 4, borjarMed: 'I Sagan om ringen är frågan om makt och ansvar' },
};

const NYA = {};

NYA['ak9-lotr-001'] = {
  title: 'Trilogins uppbyggnad och handling',
  text: `Sagan om ringen är skriven av den brittiske författaren och språkforskaren J.R.R. Tolkien och gavs ut i tre delar under 1954 och 1955. Att verket ofta kallas en trilogi är egentligen missvisande. Tolkien skrev det som en enda sammanhängande berättelse, men förlaget delade upp den av praktiska och ekonomiska skäl. Papper var dyrt efter kriget, och risken med en mycket tjock bok av en oprövad romanförfattare bedömdes som för stor.

Berättelsen utspelar sig i den påhittade världen Midgård och kretsar kring en ring som smiddes i hemlighet av den mörke härskaren Sauron. Ringen ger sin bärare stor makt, men den påverkar samtidigt bäraren och bryter gradvis ned hans omdöme. När hobbiten Frodo får ansvaret att förstöra den inleds en lång och farlig resa mot Domedagsberget i Mordor, det enda ställe där ringen kan förgöras.

Under resans gång bildas Ringens brödraskap med representanter för olika folk: fyra hobbitar, två människor, en alv, en dvärg och en trollkarl. Sammansättningen är ingen tillfällighet. Att uppdraget kräver samarbete mellan folk som annars håller avstånd till varandra är en av bokens bärande tankar.

Strukturen är ovanlig. Efter brödraskapets upplösning delas berättelsen i två trådar som följs var för sig under långa avsnitt: Frodo och Sam på väg mot Mordor, och de övriga i kriget om Gondor och Rohan. Tekniken kallas ibland flätning och innebär att läsaren får veta vad som hänt på ett ställe först långt efter att det inträffat. Det skapar spänning, men också en särskild sorts oro, eftersom läsaren vet mer än karaktärerna gör.

Tolkien ramar dessutom in berättelsen. Enligt bokens förord ska texten vara en översättning av Västmarks röda bok, en krönika nedtecknad av Bilbo, Frodo och Sam. Greppet är gammalt i litteraturen och används här för att ge berättelsen sken av att vara ett historiskt dokument snarare än en påhittad historia.

Verket avslutas inte där man kunde vänta sig. Efter att ringen förstörts återvänder hobbitarna hem och finner Fylke skövlat och styrt av inkräktare. Kapitlet om hur de återtar sitt hemland saknas helt i filmatiseringen, men för Tolkien var det viktigt. Det visar att kriget når även den plats som skildrats som skyddad, och att de fyra som kommer tillbaka inte längre är desamma som gav sig av.

Till boken hör också omfattande bilagor med tidsräkning, släkttavlor, skriftsystem och en översikt över Midgårds tidigare historia. De behövs inte för att förstå handlingen, men de visar hur mycket material som fanns bakom det som faktiskt berättas.

Verket har översatts till svenska två gånger. Åke Ohlmarks översättning från 1959 var länge den enda och gav många av de namn svenska läsare känner igen, men den kritiserades för att lägga till ord och bilder som saknades i originalet. Erik Anderssons nyöversättning från 2004 låg närmare Tolkiens text och ändrade flera inarbetade namn, vilket väckte hätsk debatt bland läsare som vuxit upp med den äldre versionen. Diskussionen visar hur mycket en översättning formar bilden av ett verk.

Mottagandet var till en början delat. Flera kritiker avfärdade boken som barnslig, medan andra såg den som något alldeles nytt. Den stora spridningen kom under 1960-talet, särskilt bland studenter i USA, och sedan dess har verket sällan varit ur tryck.

Sagan om ringen växlar mellan storslagna krigsskildringar och nära beskrivningar av rädsla, tvivel och trötthet. Genom de parallella handlingarna byggs en struktur där små handlingar får stora följder, och där det avgörande sällan utförs av den mäktigaste. Boken handlar därför inte enbart om kampen mellan gott och ont, utan lika mycket om ansvar, vänskap och uppoffring.`,
  questions: [
    {
      type: 'literal',
      q: 'Varför gavs verket ut i tre delar i stället för som en bok?',
      options: [
        'Tolkien skrev delarna med flera års mellanrum och lämnade in dem var för sig',
        'Förlaget delade upp verket av praktiska och ekonomiska skäl efter kriget',
        'Varje del skildrar en egen huvudperson och kunde därför läsas fristående',
        'Läsarna hade i förväg fått rösta om hur verket skulle ges ut på marknaden',
      ],
      correct: 1,
    },
    {
      type: 'ord',
      q: 'Vad innebär flätning som berättarteknik enligt texten?',
      options: [
        'Att berättelsen hoppar mellan olika tidsplan inom ett och samma kapitel',
        'Att flera författare turas om att skriva var sin del av berättelsen',
        'Att två handlingstrådar följs var för sig under långa avsnitt åt gången',
        'Att samma händelse skildras flera gånger ur olika personers perspektiv',
      ],
      correct: 2,
    },
    {
      type: 'inferens',
      q: 'Varför skapar den delade handlingen en särskild oro hos läsaren?',
      options: [
        'Därför att läsaren vet mer om läget än vad karaktärerna själva gör',
        'Därför att läsaren tvingas hålla reda på ovanligt många namn samtidigt',
        'Därför att slutet avslöjas redan i bokens inledande kapitel',
        'Därför att de två trådarna motsäger varandra på flera punkter',
      ],
      correct: 0,
    },
    {
      type: 'literal',
      q: 'Vad ska Västmarks röda bok föreställa enligt bokens förord?',
      options: [
        'En samling kartor som Tolkien ritade innan han började skriva',
        'Ett register över alla folk och släkter som förekommer i Midgård',
        'Den bilaga där tidsräkningen och skriftsystemen presenteras',
        'En krönika nedtecknad av Bilbo, Frodo och Sam som texten översatts från',
      ],
      correct: 3,
    },
    {
      type: 'inferens',
      q: 'Varför var kapitlet om Fylkes återtagande viktigt för Tolkien?',
      options: [
        'Det knyter ihop de två handlingstrådar som skilts åt tidigare i verket',
        'Det visar att kriget når även den plats som skildrats som skyddad',
        'Det ger läsaren en förklaring till hur ringen en gång kom till Fylke',
        'Det förbereder de bilagor som avslutar den sista av de tre delarna',
      ],
      correct: 1,
    },
    {
      type: 'sammanfatta',
      q: 'Vilket drag i strukturen framhåller texten som mest utmärkande för verket?',
      options: [
        'Att små handlingar får stora följder och sällan utförs av den mäktigaste',
        'Att krigsskildringarna tar allt större plats ju längre berättelsen fortskrider',
        'Att varje folk i Midgård får ett eget avsnitt tillägnat sin historia',
        'Att berättelsen följer en enda huvudperson från början till slut',
      ],
      correct: 0,
    },
  ],
};

NYA['ak9-lotr-002'] = {
  title: 'Karaktärsutveckling i trilogin',
  text: `En av de mest omtalade sidorna av Sagan om ringen är hur karaktärerna förändras. Litteraturvetare brukar skilja mellan platta och runda gestalter: de platta förblir sig lika och fyller en funktion, medan de runda rör sig och kan överraska. Tolkien använder båda sorterna, och det är rörelsen hos de runda som bär bokens allvar.

Frodo börjar som en någorlunda bekymmersfri hobbit i Fylke. Under resan tär ringen på honom, och förändringen går åt ett annat håll än i de flesta äventyrsberättelser. Han blir inte starkare av sina prövningar utan tystare, tunnare och alltmer upptagen av bördan. Det ovanliga är slutet. När uppdraget är utfört återhämtar han sig aldrig helt, utan lämnar till sist Midgård. Boken vägrar därmed den lösning som annars är vanlig, att den som lidit får sin belöning i form av ett gott liv därhemma.

Samwise Gamgi framstår först som en trogen följeslagare i bakgrunden. Hans roll växer efter hand, och i de mest kritiska stunderna är det han som handlar. Genom Sam lyfts en särskild sorts hjältemod fram, det som består i uthållighet och lojalitet snarare än i strid och glans. Att han är trädgårdsmästare och den ende av de fyra som återvänder till ett vanligt liv är knappast en tillfällighet.

Aragorn utvecklas i motsatt riktning mot Frodo. Han presenteras som en kringvandrande främling med ett smeknamn som antyder misstänksamhet, och det framgår gradvis att han är arvtagare till Gondors tron. Hans väg handlar om att acceptera ett ansvar han länge undvikit. Där Frodos utveckling går mot förlust går Aragorns mot att träda in i en roll som väntat på honom.

Merry och Pippin är till en början nästan komiska inslag. Sedan de skilts från de övriga hamnar de var för sig i sammanhang som tvingar fram allvar, och båda återvänder som personer med egen auktoritet. Just därför blir det avslutande kapitlet om Fylke möjligt: de har hunnit bli sådana som andra följer.

Bland bifigurerna är Boromir och Gollum de mest sammansatta. Boromir vill försvara sitt folk, och det är den goda avsikten som gör honom mottaglig för ringens lockelse. Hans fall och senare ånger ger honom en tragisk värdighet i stället för rollen som förrädare. Gollum väcker på en gång avsky och medlidande. Hans växlingar mellan namnen Sméagol och Gollum är inte bara ett uttryck för galenskap, utan visar en splittring där en rest av det ursprungliga jaget fortfarande gör motstånd.

Éowyn utgör ett eget spår. Hon skildras som instängd i en roll hon inte valt och söker hellre en död i strid än ett liv i väntan. Hennes vändning kommer inte genom segern på slagfältet utan efteråt, när hon väljer att leva.

Ett återkommande drag är att Tolkien visar förändring genom handling snarare än genom att beskriva känslor inifrån. Läsaren får sällan veta vad en gestalt tänker. I stället visas vad hon gör när hon är trött, rädd eller frestad, och bedömningen läggs därmed hos läsaren.

Ett av bokens mest omtalade avsnitt är när Gollum kommer nära att vända om. Han finner Frodo och Sam sovande och rör vid sin herres knä i något som liknar ömhet. Sam vaknar och tilltalar honom hårt, och ögonblicket går förlorat. Scenen visar att även de mest förhärdade gestalterna hålls öppna, och att en möjlighet kan stängas av en tillfällighet.

Genom dessa gestalter undersöker Tolkien hur olika personer reagerar under press. Vissa bryts ned, andra växer, och några gör bådadera. Det som står på spel är inte enbart världens öde, utan enskilda personers val i ögonblick av trötthet och rädsla.`,
  questions: [
    {
      type: 'ord',
      q: 'Vad skiljer en platt gestalt från en rund enligt textens beskrivning?',
      options: [
        'Den platta förblir sig lik och fyller en funktion, den runda kan överraska',
        'Den platta beskrivs kortfattat, den runda får många sidor text ägnade åt sig',
        'Den platta finns med i hela verket, den runda försvinner efter första delen',
        'Den platta är påhittad av författaren, den runda bygger på en verklig person',
      ],
      correct: 0,
    },
    {
      type: 'inferens',
      q: 'Varför beskrivs Frodos utveckling som ovanlig för en äventyrsberättelse?',
      options: [
        'Han byter roll med sin följeslagare halvvägs genom berättelsen',
        'Han vägrar från början att ta emot det uppdrag som erbjuds honom',
        'Han blir inte starkare av sina prövningar och återhämtar sig aldrig helt',
        'Han förändras inte alls trots allt han utsätts för under resan',
      ],
      correct: 2,
    },
    {
      type: 'literal',
      q: 'Vilken sorts hjältemod lyfts fram genom Samwise Gamgi?',
      options: [
        'Det som bygger på skicklighet i strid och kunskap om vapen',
        'Det som består i uthållighet och lojalitet snarare än i glans',
        'Det som växer fram ur en längtan efter ära och erkännande',
        'Det som förutsätter en hög ställning och rätten att befalla',
      ],
      correct: 1,
    },
    {
      type: 'inferens',
      q: 'Varför framhåller texten att Merry och Pippin förändras under sin tid åtskilda från de övriga?',
      options: [
        'Därför att de annars hade fallit för samma frestelse som Boromir gjorde',
        'Därför att de behövde lära sig hitta i Midgård utan hjälp av kartor',
        'Därför att förändringen förklarar varför de kan leda återtagandet av Fylke',
        'Därför att de därigenom blir mer lika varandra än de var i början',
      ],
      correct: 2,
    },
    {
      type: 'inferens',
      q: 'Vad visar Boromirs fall om hur ringen verkar på människor?',
      options: [
        'Att den bara påverkar dem som redan söker makt för egen räkning',
        'Att den saknar verkan på den som är beredd att dö för sitt folk',
        'Att den verkar starkast på den som burit den under lång tid',
        'Att en god avsikt kan vara just det som öppnar för maktbegäret',
      ],
      correct: 3,
    },
    {
      type: 'sammanfatta',
      q: 'Vad undersöker Tolkien genom gestalternas förändringar enligt texten?',
      options: [
        'Hur olika personer reagerar under press, där vissa bryts ned och andra växer',
        'Hur folken i Midgård skiljer sig åt i fråga om seder och traditioner',
        'Hur en berättelse kan hålla ihop trots att den följer många personer',
        'Hur ledarskap bör utövas när ett samhälle befinner sig i krig',
      ],
      correct: 0,
    },
  ],
};

NYA['ak9-lotr-003'] = {
  title: 'Teman och symbolik',
  text: `Sagan om ringen har analyserats av litteraturforskare i decennier, och tolkningarna har ofta gått i riktningar som Tolkien själv motsatte sig. I förordet till andra upplagan skriver han rakt ut att han inte tycker om allegori. Verket ska alltså inte läsas som en förklädd skildring av något annat. I stället använde han begreppet tillämplighet: läsaren är fri att känna igen sitt eget sammanhang i berättelsen, men igenkänningen finns hos läsaren och inte som en dold nyckel lagd av författaren.

Den vanligaste feltolkningen gäller andra världskriget. Ringen skulle vara atombomben och Mordor ett bestämt land. Tolkien avvisade läsningen och påpekade att stora delar av verket skrevs innan kriget bröt ut. Däremot bar han med sig ett annat krig. Han stred vid Somme 1916 och förlorade de flesta av sina närmaste vänner. Skildringarna av utmattning, lera och långa väntetider mellan skräckfyllda ögonblick har ofta lästs mot den bakgrunden.

Kampen mellan gott och ont är ett bärande tema, men uppdelningen är mindre enkel än ryktet gör gällande. Ondskan finns inte bara hos yttre fiender utan lika mycket i frestelsen att använda ringen för egna syften, och den frestelsen drabbar just dem som vill väl. Ringen fungerar som en symbol för makt som inte går att använda utan att den använder tillbaka.

Barmhärtighet är kanske det tema som betyder mest för handlingen. Bilbo skonar Gollum trots att han kunde ha dödat honom, och Frodo gör senare samma val. Besluten framstår som oförsiktiga, men det är just Gollums närvaro i slutet som gör att ringen till sist förstörs. Nåden får därmed en följd som ingen kunde räkna ut i förväg, och den blir avgörande på ett sätt som styrkan aldrig är.

Hoppets betydelse i mörka tider löper genom hela verket. Karaktärerna kämpar vidare utan rimliga utsikter att lyckas, och små handlingar av mod från till synes obetydliga gestalter får avgörande följder. Tolkien använde själv ordet eukatastrof om den oväntade vändning till det bättre som kommer när allt tycks förlorat, och menade att just den vändningen är sagans egentliga uppgift.

Naturen har en framträdande plats. Skogar, berg och floder skildras som miljöer med egen vilja snarare än som kulisser. Kontrasten mellan det sotiga Isengård, där träd huggs ned för att driva maskiner, och de gröna landskapen i Fylke har ofta lästs som kritik av en industrialisering som ingen tänkt efter kring.

Vänskap och gemenskap utgör ett fjärde genomgående tema. Brödraskapet visar att hotet bara kan mötas om folk som annars håller avstånd väljer att samarbeta, och skillnaderna mellan dem övervinns inte genom att suddas ut utan genom ett gemensamt mål.

Ett besläktat drag har kallats den långa reträtten. Alverna och deras bundsförvanter vet att världen sakta förlorar sin skönhet och att varje seger bara skjuter upp nederlaget. Att ändå kämpa vidare framställs inte som naivt utan som det enda hedervärda.

Tanken har rötter i den nordiska litteratur Tolkien undervisade om. I de fornnordiska kvädena vinner inte det goda till slut, men hjälten står ändå kvar på förlorande sida. Tolkien beundrade den hållningen och kallade den ett mod som inte behöver hopp om seger för att vara mod. Skillnaden är att han lät sina egna berättelser lämna utrymme för en oväntad räddning.

I sina brev pekade Tolkien själv ut ett tema han menade var det verkliga: döden och odödligheten. Människorna i Midgård är dödliga och avundas alverna, medan alverna är bundna till världen och till sist tröttnar på den. Läst så handlar boken mindre om krig och mer om hur man förhåller sig till att tiden tar slut.`,
  questions: [
    {
      type: 'ord',
      q: 'Vad menar Tolkien med tillämplighet, till skillnad från allegori?',
      options: [
        'Att berättelsen kan användas i undervisning om litteraturhistoria',
        'Att varje läsare bör tolka symbolerna på exakt samma sätt som forskarna',
        'Att igenkänningen finns hos läsaren och inte som en dold nyckel från författaren',
        'Att verket går att läsa i valfri ordning utan att sammanhanget går förlorat',
      ],
      correct: 2,
    },
    {
      type: 'literal',
      q: 'Vilket argument använde Tolkien mot tolkningen att ringen står för atombomben?',
      options: [
        'Att stora delar av verket skrevs innan andra världskriget bröt ut',
        'Att han aldrig hade läst något om vapnet när han skrev boken',
        'Att ringen beskrivs som gammal och därmed inte kan syfta på ny teknik',
        'Att han själv aldrig deltagit i något krig och saknade sådan erfarenhet',
      ],
      correct: 0,
    },
    {
      type: 'inferens',
      q: 'Varför beskriver texten barmhärtigheten som avgörande på ett sätt som styrkan aldrig är?',
      options: [
        'Därför att de skonade fienderna senare byter sida och strider för det goda',
        'Därför att de oförsiktiga besluten att skona Gollum är det som räddar uppdraget',
        'Därför att styrka aldrig används av någon av huvudpersonerna i verket',
        'Därför att barmhärtighet är det enda vapen som biter på ringens bärare',
      ],
      correct: 1,
    },
    {
      type: 'ord',
      q: 'Vad betecknar ordet eukatastrof i Tolkiens användning?',
      options: [
        'En katastrof som drabbar hela världen samtidigt och utan förvarning',
        'Ett slut där både det goda och det onda går under tillsammans',
        'En berättelse som saknar tydlig upplösning och lämnas öppen',
        'Den oväntade vändningen till det bättre när allt tycks förlorat',
      ],
      correct: 3,
    },
    {
      type: 'inferens',
      q: 'Hur kan kontrasten mellan Isengård och Fylke förstås enligt texten?',
      options: [
        'Som en beskrivning av hur olika folk väljer att bygga sina samhällen',
        'Som ett sätt att visa hur långt sällskapet färdas under berättelsen',
        'Som kritik av en industrialisering som ingen har tänkt efter kring',
        'Som en påminnelse om att naturen alltid segrar över tekniken till slut',
      ],
      correct: 2,
    },
    {
      type: 'forfattarens-syfte',
      q: 'Varför avslutar texten med det tema Tolkien själv pekade ut i sina brev?',
      options: [
        'För att visa att verket rör något annat än krig, nämligen döden och tiden',
        'För att visa att brev är en mer pålitlig källa än publicerade förord',
        'För att visa att forskarna missat alla de teman som finns i verket',
        'För att visa att Tolkien ändrade uppfattning om sin bok med åren',
      ],
      correct: 0,
    },
  ],
};

NYA['ak9-lotr-004'] = {
  title: 'Miljöer och världsbygge',
  text: `En avgörande orsak till att Sagan om ringen fått sådant genomslag är världsbygget. Tolkien skapade inte en bakgrund till handlingen utan en värld med egen historia, geografi och språk, och placerade sedan berättelsen i den.

Ordningen är viktig och ovanlig. Tolkien var språkforskare till yrket och konstruerade språk för nöjes skull långt innan han skrev om Midgård. I efterhand beskrev han det som att berättelserna kom till för att ge språken en värld att existera i, inte tvärtom. De två mest utarbetade alvspråken, quenya och sindarin, har egen grammatik, ljudlära och historisk utveckling, och de är släkt med varandra på det sätt som verkliga språk är. Namnen i böckerna är därför sällan påhittade på måfå. De betyder något inom sitt eget system.

Fylke framställs som en fredlig landsbygd där hobbitar lever enkelt och en aning trångsynt. Kontrasten mot Mordor är stark: ett kargt och mörkt landskap av aska och vulkanisk aktivitet. Miljöerna bär berättelsens moraliska laddning utan att någon behöver förklara den.

Städer som Minas Tirith och fästningar som Helms klyfta ger en känsla av historisk tyngd. Arkitekturen och de gamla sedvänjorna antyder en lång bakgrund, och läsaren möter ständigt ruiner och minnen från tidigare skeden. Ett återkommande drag är att storhetstiden ligger bakom. Gondor är svagare än förr, alverna lämnar världen, och mycket av det som beskrivs är rester. Det ger berättelsen en ton av vemod som skiljer den från äventyr där världen väntar på att erövras.

Kartorna är inte utsmyckning. Avstånden i Midgård är beräknade, och Tolkien förde bok över hur långt sällskapet färdades varje dygn och vilken månfas som rådde. Det gör att geografin faktiskt styr handlingen: vissa vägar är stängda, och vissa möten sker för att två grupper råkar röra sig mot samma pass. När läsaren följer med på kartan stämmer tiden.

Också växtligheten är genomarbetad. Tolkien namnger blommor och träd, och skogarna har olika karaktär. Gamla skogen är misstänksam, Lothlórien tidlös, Fangorn urgammal och vaken. Ententerna, trädherdarna som till slut går till angrepp mot Isengård, är kanske det tydligaste uttrycket för hans egen fäst vid träd.

Bakom allt detta ligger ett stort material som aldrig gavs ut under hans livstid: skapelseberättelser, kungalängder, kalendrar och skriftsystem. Läsaren möter bara en bråkdel, men bråkdelen fungerar just därför att resten finns. Effekten liknar den man får av att se en ruin och förstå att den en gång var hel.

Kartorna kom till under arbetets gång och inte i förväg. Tolkiens son Christopher ritade om dem flera gånger när handlingen ändrades, och far och son brevväxlade om avstånd och namn. Efter Tolkiens död 1973 fortsatte Christopher att ge ut det efterlämnade materialet, från Silmarillion 1977 till en lång rad volymer med utkast och varianter. Genom dem går det att följa hur namn, folk och händelser bytt skepnad under årtiondena, och hur mycket av det som verkar självklart i boken är resultatet av att en tidigare version ratats. Att materialet redigerats fram i efterhand betyder också att Midgård aldrig blev riktigt färdigt.

I essän Om sagor beskrev Tolkien vad han var ute efter. En berättelse ska bygga en andra värld som läsaren kan tro på så länge man befinner sig i den. Trovärdigheten kommer inte av att världen är realistisk, utan av att den är följdriktig: reglerna gäller, historien hänger ihop, och ingenting införs bara för att det passar just då.

Det är den noggrannheten som gör att Midgård upplevs som en plats som fanns före berättelsen och skulle finnas kvar efter den, trots att alltsammans är påhittat.`,
  questions: [
    {
      type: 'literal',
      q: 'I vilken ordning kom språken och berättelserna till enligt Tolkiens egen beskrivning?',
      options: [
        'Berättelserna skrevs först, och språken lades till för att fylla ut världen',
        'Språken och berättelserna växte fram parallellt under samma arbetsperiod',
        'Språken fanns först, och berättelserna kom till för att ge dem en värld',
        'Språken skapades av andra forskare och lånades in i berättelserna',
      ],
      correct: 2,
    },
    {
      type: 'inferens',
      q: 'Varför framhåller texten att namnen i böckerna sällan är påhittade på måfå?',
      options: [
        'Därför att de är hämtade från verkliga platser i norra Europa',
        'Därför att de betyder något inom de konstruerade språkens eget system',
        'Därför att läsaren annars skulle få svårt att hålla isär de många folken',
        'Därför att Tolkien lät sina studenter föreslå namnen under arbetets gång',
      ],
      correct: 1,
    },
    {
      type: 'inferens',
      q: 'Vilken verkan får det att storhetstiden i Midgård ligger bakom i tiden?',
      options: [
        'Berättelsen får en ton av vemod som skiljer den från erövringsäventyr',
        'Berättelsen blir svårare att följa eftersom läsaren saknar bakgrunden',
        'Berättelsen framstår som mer verklig än andra fantasyböcker gör',
        'Berättelsen kan läsas i valfri ordning utan att sammanhanget går förlorat',
      ],
      correct: 0,
    },
    {
      type: 'literal',
      q: 'På vilket sätt påverkar kartorna själva handlingen enligt texten?',
      options: [
        'De gör det möjligt för läsaren att hitta tillbaka till tidigare kapitel',
        'De visar vilka folk som en gång levde i de områden som nu ligger öde',
        'De anger hur lång tid varje del av berättelsen tar att läsa igenom',
        'De gör att vissa vägar är stängda och att möten sker vid samma pass',
      ],
      correct: 3,
    },
    {
      type: 'inferens',
      q: 'Varför fungerar den bråkdel av materialet som läsaren faktiskt möter?',
      options: [
        'Därför att den valts ut av förlaget som de mest spännande avsnitten',
        'Därför att resten finns, ungefär som en ruin visar att något varit helt',
        'Därför att den är skriven i en enklare stil än det övriga materialet',
        'Därför att den upprepas flera gånger under berättelsens gång',
      ],
      correct: 1,
    },
    {
      type: 'sammanfatta',
      q: 'Varifrån kommer trovärdigheten i en påhittad värld enligt essän Om sagor?',
      options: [
        'Från att världen är följdriktig, inte från att den är realistisk',
        'Från att världen liknar den läsaren redan känner till från sin vardag',
        'Från att författaren förklarar sina regler tydligt i ett förord',
        'Från att berättelsen håller sig till en enda plats genom hela verket',
      ],
      correct: 0,
    },
  ],
};

NYA['ak9-lotr-005'] = {
  title: 'Makt, ansvar och moral',
  text: `Frågan om makt och ansvar löper genom hela Sagan om ringen. Ringen erbjuder enorm kraft, men den som bär den riskerar att förlora sitt omdöme. Därav det etiska problem som boken kretsar kring: går det att använda ondskans verktyg mot ondskan själv utan att bli den man bekämpar?

Rådslaget i Vattnadal formulerar frågan öppet. Alternativen prövas ett efter ett. Att gömma ringen fungerar bara tillfälligt, att kasta den i havet skjuter upp problemet, och att använda den mot Sauron är det farligaste av allt. Beslutet att förstöra den är därför ingen självklarhet, utan slutsatsen av ett resonemang där alla vägar är dåliga.

Frodo åtar sig uppdraget utan att söka makt. Hans beslut vilar på ansvarskänsla snarare än ärelystnad, och han påpekar själv att han inte känner vägen. Samtidigt visar berättelsen att godhet inte skyddar mot frestelse. Det är lätt att missa hur boken faktiskt slutar. Vid Domedagsberget klarar Frodo inte av att kasta ringen i elden, utan tar den för egen räkning. Han misslyckas alltså med det han utsetts att göra.

Att uppdraget ändå lyckas beror på Gollum, som i sin girighet biter av fingret med ringen och faller ned i elden. Utgången knyts därmed till de tidigare besluten att skona honom. Bilbo skonade Gollum, Frodo gjorde detsamma, och Gandalf säger tidigt att Gollum kan ha en uppgift kvar att fylla. Barmhärtigheten var oförsiktig när den visades och avgörande i efterhand.

Slutet ger också en tydlig moralisk poäng. Ingen är stark nog att bära den yttersta makten och sedan lägga den ifrån sig frivilligt. Det som räddar Midgård är inte viljestyrka, utan följderna av tidigare nåd.

Gandalf och Galadriel avstår medvetet när ringen erbjuds dem. Deras skäl är inte att de skulle sakna kraft att använda den, utan tvärtom att de har den. En stark bärare med goda avsikter skulle bli en ny mörk härskare, och just det är vad de säger. Faramir hör till samma mönster. Han avstår från att föra ringen till Gondor trots att hans far skulle ha krävt det.

Ringen fungerar dessutom olika beroende på vem som bär den. Den lovar var och en just det som frestar honom mest. Sam, som bär den en kort tid, ser för sitt inre en trädgård som täcker hela Mordor och inser i samma stund att önskan är för stor för honom. Att han lämnar tillbaka ringen utan strid är ett av bokens tystaste men mest betydelsefulla ögonblick.

Genom att låta frestelsen se olika ut för olika gestalter undviker Tolkien den enkla uppdelningen i starka och svaga. Ingen står emot för att han är motståndskraftig, utan för att han hinner se vad erbjudandet skulle kosta.

Boromir utgör motbilden. Han drivs av viljan att försvara sitt folk, och det är den goda avsikten som öppnar för maktbegäret. Hans försök att ta ringen bryter brödraskapet, men hans ånger och död till försvar av Merry och Pippin ger honom en tragisk värdighet.

Ett annat drag i boken är att de mäktiga sällan avgör saken. Kungar och trollkarlar strider och håller ställningar, men det avgörande sker hos två hobbitar som ingen räknar med. Tolkien återkommer till tanken att den till synes obetydlige kan väga tyngst, och att den mäktige därför inte bör lita till sin styrka.

Boken ställer på så vis frågor som räcker långt utanför fantasyns värld. Hur bör makt användas? När blir en god avsikt farlig? Och vad betyder det att en berättelse låter sin hjälte misslyckas i sista stund, men ändå låter saken sluta väl?`,
  questions: [
    {
      type: 'literal',
      q: 'Varför beskrivs beslutet att förstöra ringen som slutsatsen av ett resonemang?',
      options: [
        'Därför att rådslaget prövar övriga alternativ och finner alla vägar dåliga',
        'Därför att Gandalf i förväg bestämt vad rådslaget skulle komma fram till',
        'Därför att alternativet att använda ringen aldrig fördes fram på mötet',
        'Därför att Frodo krävde att få uppdraget innan andra hann säga något',
      ],
      correct: 0,
    },
    {
      type: 'literal',
      q: 'Vad händer med Frodo vid Domedagsberget?',
      options: [
        'Han kastar ringen i elden men skadas svårt av hettan i samma stund',
        'Han överlämnar ringen till Sam, som utför det sista steget åt honom',
        'Han klarar inte av att kasta ringen i elden utan tar den för egen räkning',
        'Han förlorar ringen på vägen upp och hittar den aldrig igen',
      ],
      correct: 2,
    },
    {
      type: 'inferens',
      q: 'Vilken slutsats drar texten av att Gollum är den som till sist förstör ringen?',
      options: [
        'Att uppdraget hade kunnat utföras av vem som helst i sällskapet',
        'Att Gandalf måste ha planerat händelseförloppet från allra första början',
        'Att girighet i vissa lägen är ett mer pålitligt drivmedel än godhet',
        'Att de tidigare besluten att skona honom blev avgörande i efterhand',
      ],
      correct: 3,
    },
    {
      type: 'inferens',
      q: 'Varför avstår Gandalf och Galadriel från ringen när den erbjuds dem?',
      options: [
        'Därför att de saknar den kraft som krävs för att använda den rätt',
        'Därför att de har kraften och därför skulle bli nya mörka härskare',
        'Därför att de redan har lovat Frodo att inte röra den under resan',
        'Därför att ringen bara fungerar för den som burit den från början',
      ],
      correct: 1,
    },
    {
      type: 'forfattarens-syfte',
      q: 'Varför tar texten upp att kungar och trollkarlar sällan avgör saken?',
      options: [
        'För att visa att stridsscenerna spelar en mindre roll i verket än man tror',
        'För att visa att Tolkien saknade intresse för de mäktiga gestalterna',
        'För att visa tanken att den till synes obetydlige kan väga tyngst',
        'För att visa att brödraskapet var för litet för att kunna göra skillnad',
      ],
      correct: 2,
    },
    {
      type: 'sammanfatta',
      q: 'Vilken moralisk poäng ger slutet enligt texten?',
      options: [
        'Att den som visar tålamod till slut alltid får sin belöning',
        'Att ondskan bara kan besegras med hjälp av dess egna verktyg',
        'Att den starkaste viljan är det som avgör en konflikts utgång',
        'Att ingen är stark nog att bära den yttersta makten och lägga den ifrån sig',
      ],
      correct: 3,
    },
  ],
};

// ─── Körning ────────────────────────────────────────────────────────────────

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

const raknaOrd = (s) => s.trim().split(/\s+/).filter(Boolean).length;

let fel = 0;
for (const [id, vantat] of Object.entries(FORVANTAT)) {
  const t = lib.find((x) => x.id === id);
  if (!t) {
    console.error(`${id}: finns inte i biblioteket`);
    fel++;
    continue;
  }
  if (t.grade !== vantat.grade) {
    console.error(`${id}: förväntade åk ${vantat.grade}, fann åk ${t.grade} – kanske redan körd?`);
    fel++;
  }
  if (!t.text.startsWith(vantat.borjarMed)) {
    console.error(`${id}: texten börjar inte som väntat – avbryter`);
    fel++;
  }
  const ny = NYA[id];
  const ord = raknaOrd(ny.text);
  if (ord < MIN_ORD || ord > MAX_ORD) {
    console.error(`${id}: nya texten är ${ord} ord, utanför ${MIN_ORD}–${MAX_ORD}`);
    fel++;
  }
  if (ny.questions.length !== 6) {
    console.error(`${id}: ${ny.questions.length} frågor, ska vara 6`);
    fel++;
  }
  ny.questions.forEach((q, i) => {
    if (q.options.length !== 4) {
      console.error(`${id} f${i + 1}: ${q.options.length} alternativ, ska vara 4`);
      fel++;
    }
    if (typeof q.correct !== 'number' || q.correct < 0 || q.correct > 3) {
      console.error(`${id} f${i + 1}: ogiltigt facit ${q.correct}`);
      fel++;
    }
  });
}
if (fel) {
  console.error(`\n${fel} problem – inget skrivet.`);
  process.exit(1);
}

for (const [id, ny] of Object.entries(NYA)) {
  const t = lib.find((x) => x.id === id);
  const foreOrd = raknaOrd(t.text);
  const foreAk = t.grade;

  t.grade = MAL_ARSKURS;
  t.title = ny.title;
  t.text = ny.text;
  t.questions = ny.questions;
  t.meta = { ...(t.meta || {}), wordCount: raknaOrd(ny.text) };

  const facit = ny.questions.map((q) => 'ABCD'[q.correct]).join('');
  console.log(
    `${id}  åk${foreAk} → åk${MAL_ARSKURS}   ${foreOrd} → ${raknaOrd(ny.text)} ord   facit ${facit}   ${ny.title}`
  );
}

if (!dry) {
  fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
  console.log('\nSkrivet.');
} else {
  console.log('\n(dry run – inget skrivet)');
}
