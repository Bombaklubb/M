#!/usr/bin/env node
//
// Sats 16: sex texter i intervallet 217–225 ord, med omskrivna frågor.

const fs = require('fs');
const path = require('path');

const NYA = {

// ── åk 7, 217 → ~515 ord ────────────────────────────────────────────────
'ak7-tema-037': {
  text: `I Sverige styrs landet genom demokrati, vilket innebär att folket har makt att påverka besluten. Ett viktigt område är hur lagar skapas. Processen börjar ofta med att regeringen eller riksdagen föreslår en ny lag, vilket kallas för en proposition eller motion.

Skillnaden mellan de två är värd att känna till. En proposition kommer från regeringen och har oftast föregåtts av ett långt utredningsarbete. En motion skrivs av en eller flera riksdagsledamöter och kan lämnas in av vem som helst i riksdagen. Motioner blir sällan lag, men de tvingar fram ett svar och sätter frågor på dagordningen.

När ett förslag har lagts fram granskas det av ett utskott i riksdagen. Utskottet består av politiker från olika partier som diskuterar och analyserar förslaget. De kan föreslå ändringar innan det går vidare till omröstning.

Utskotten är sexton till antalet och delar upp arbetet efter ämne. Det finns bland annat ett utbildningsutskott, ett justitieutskott och ett finansutskott. Att arbetet delas upp gör att ledamöterna hinner sätta sig in i frågorna på ett sätt som vore omöjligt om alla skulle granska allt.

Efter granskningen röstar riksdagen om förslaget. Om en majoritet röstar ja blir det en ny lag. Om inte, avslås förslaget. Denna process är viktig för att säkerställa att olika perspektiv tas i beaktande innan ett beslut fattas.

Själva omröstningen kallas votering. Ledamöterna trycker på en knapp vid sin plats, och resultatet visas direkt på en skärm i kammaren. Hur varje ledamot har röstat är offentligt, vilket gör att väljarna i efterhand kan se vad deras representanter faktiskt stod för.

En ny lag börjar sällan gälla samma dag som den beslutas. Riksdagen bestämmer ett datum för när lagen ska träda i kraft, ofta flera månader senare, så att myndigheter, företag och skolor hinner förbereda sig.

Sverige har fyra grundlagar. Regeringsformen beskriver hur landet styrs, tryckfrihetsförordningen och yttrandefrihetsgrundlagen skyddar rätten att uttrycka sig, och successionsordningen reglerar tronföljden. Tillsammans sätter de gränser för vad riksdagen får bestämma med vanlig lag.

Grundlagarna är svårare att ändra än vanliga lagar. En grundlagsändring måste beslutas två gånger av riksdagen, och mellan de två besluten måste det hållas ett val. På så sätt får väljarna möjlighet att säga sitt innan förändringen genomförs.

Men lagar kan också påverkas av EU. Sverige är medlem i Europeiska unionen, och vissa lagar måste följa gemensamma regler. Det innebär att svenska politiker ibland måste anpassa nationella lagar efter beslut som fattas på EU-nivå.

En lag kan också tas bort. Om en regel visar sig fungera dåligt kan riksdagen upphäva den, och det sker på samma sätt som när en lag införs. Att lagar ändras och försvinner är alltså normalt, inte ett tecken på att något gått fel.

En lag är dessutom aldrig helt färdig när den är beslutad. Orden i lagtexten måste tolkas i verkliga fall, och det är domstolarnas uppgift. När ett svårt fall avgörs i högsta instans blir domen vägledande för hur lagen ska förstås framöver.

Att förstå hur lagar skapas är viktigt för att kunna vara en aktiv medborgare. Genom kunskap om processen blir det lättare att se hur beslut fattas och hur man själv kan påverka samhället.`,
  questions: [
    { type: 'literal', q: 'Vad är skillnaden mellan en proposition och en motion?',
      options: ['Propositionen kommer från regeringen, motionen från ledamöter', 'Propositionen gäller nya lagar, motionen gäller ändringar', 'Propositionen behandlas snabbare i riksdagen', 'Propositionen skrivs av utskotten själva'], correct: 0 },
    { type: 'inferens', q: 'Varför är motioner ändå betydelsefulla?',
      options: ['De blir oftast lag till slut', 'De tvingar fram ett svar och sätter frågor på dagordningen', 'De behöver inte granskas av något utskott', 'De kan skrivas av vem som helst i landet'], correct: 1 },
    { type: 'inferens', q: 'Varför är riksdagsarbetet uppdelat i utskott?',
      options: ['För att partierna ska hållas åtskilda', 'För att voteringen ska gå snabbare', 'För att ledamöterna ska hinna sätta sig in i frågorna', 'För att regeringen kräver den ordningen'], correct: 2 },
    { type: 'literal', q: 'Vad är särskilt med voteringen?',
      options: ['Den sker med slutna sedlar', 'Den hålls bara vid de viktigaste besluten', 'Den kan tas om dagen efter', 'Hur varje ledamot röstat är offentligt'], correct: 3 },
    { type: 'literal', q: 'Varför börjar en lag sällan gälla samma dag som den beslutas?',
      options: ['Berörda ska hinna förbereda sig', 'Kungen måste först skriva under den', 'EU måste först godkänna beslutet', 'Domstolarna ska hinna tolka texten'], correct: 0 },
    { type: 'sammanfatta', q: 'Varför måste en grundlagsändring beslutas två gånger?',
      options: ['För att riksdagen ska hinna ändra sig', 'För att väljarna ska få säga sitt i ett val emellan', 'För att texten ska hinna granskas av jurister', 'För att EU kräver en andra prövning'], correct: 1 },
  ],
},

// ── åk 10, 217 → ~605 ord ───────────────────────────────────────────────
'akgy-sol-003': {
  text: `Solsystemet är en del av Vintergatan, en galax som innehåller hundratals miljarder stjärnor. Under lång tid trodde forskare att vårt solsystem var unikt, men upptäckten av exoplaneter har visat att planetsystem är vanliga i universum. Detta har förändrat vår förståelse av hur solsystem uppstår och utvecklas.

Den första bekräftade planeten kring en solliknande stjärna hittades 1995. Sedan dess har antalet vuxit till flera tusen. Det vanligaste sättet att hitta dem är inte att se dem, utan att mäta hur ljuset från stjärnan försvagas en aning när planeten passerar framför den. Metoden kräver att banan råkar ligga så att passagen syns just från jorden, vilket betyder att de allra flesta planetsystem förblir osynliga för oss.

Vårt eget solsystem bildades för ungefär 4,6 miljarder år sedan ur ett moln av gas och stoft. Molnet drogs samman av sin egen tyngdkraft, började rotera och plattades ut till en skiva. I mitten blev trycket så högt att solen tändes, och av det som blev kvar i skivan klumpade planeterna ihop sig.

Att skivan roterade förklarar varför planeterna än i dag går åt samma håll och nästan i samma plan. En modell duger inte bara om den stämmer med det man ser, utan ska också kunna förklara varför saker ser ut som de gör.

Genom att studera andra stjärnsystem kan forskare jämföra olika typer av planeter och banor. Vissa system har så kallade heta jupitrar, stora gasplaneter som kretsar mycket nära sina stjärnor. Detta skiljer sig från vårt solsystem och visar att planetsystem kan se mycket olika ut.

Just de heta jupitrarna skapade ett problem för forskningen. Enligt de modeller som fanns kunde en gasjätte omöjligt bildas så nära en stjärna, eftersom det är för varmt där för att is och gas ska kunna samlas. Förklaringen blev att planeterna bildats längre ut och sedan vandrat inåt. Att planeter kan flytta sig i sina system var en tanke som knappast fanns innan de upptäcktes.

Att de första planeter som hittades var stora och låg nära sina stjärnor säger dessutom mer om våra instrument än om universum. Sådana planeter ger de tydligaste signalerna och var därför lättast att upptäcka först. Att dra slutsatser om hur vanligt något är utifrån det som är lättast att hitta är ett känt misstag inom vetenskapen.

Solsystemet har dock vissa egenskaper som anses gynnsamma för liv. Jorden befinner sig i den beboeliga zonen, där temperaturen tillåter flytande vatten. Dessutom skyddar jordens magnetfält mot skadlig strålning, och atmosfären bidrar till stabila förhållanden.

Begreppet beboelig zon är samtidigt trubbigare än det låter. Det säger bara något om avståndet till stjärnan, inte om atmosfär, tyngdkraft eller om planeten över huvud taget har vatten. Venus ligger nära zonens inre kant och är ändå fullständigt ogästvänlig på grund av sin atmosfär. Zonen är alltså en första sållning, inte ett besked.

Forskning om solsystemet hjälper oss också att förstå jordens framtid. Solen kommer så småningom att förändras och bli en röd jätte, vilket kommer att påverka de inre planeterna. Detta visar att solsystem inte är statiska utan utvecklas över tid. Förloppet ligger dock miljarder år bort, och långt innan dess kommer solens gradvis ökande utstrålning att ha gjort jorden obeboelig.

Teknologiska framsteg har gjort det möjligt att observera solsystemet och universum med allt större precision. Rymdteleskop och sonder samlar data som används för att testa teorier och utveckla nya modeller. Sonder som skickats till de yttre planeterna har dessutom lämnat solsystemet och fortsätter att sända signaler, allt svagare, från ett avstånd där solen bara är ännu en stjärna bland andra.

Sammanfattningsvis placerar studiet av solsystemet oss i ett större kosmiskt sammanhang och hjälper oss att förstå både vår egen existens och universums struktur.`,
  questions: [
    { type: 'literal', q: 'Hur hittas de flesta exoplaneter?',
      options: ['Genom att mäta hur stjärnans ljus försvagas vid en passage', 'Genom att fotografera dem direkt med rymdteleskop', 'Genom att lyssna efter radiosignaler från dem', 'Genom att mäta deras tyngdkraft från jorden'], correct: 0 },
    { type: 'inferens', q: 'Varför förblir de flesta planetsystem osynliga för oss?',
      options: ['De ligger utanför vår egen galax', 'Deras banor ligger sällan så att en passage syns härifrån', 'Deras stjärnor lyser alltför svagt', 'De saknar planeter av tillräcklig storlek'], correct: 1 },
    { type: 'inferens', q: 'Varför var de heta jupitrarna ett problem för forskningen?',
      options: ['De var för små för att kunna mätas alls', 'De rörde sig långsammare än väntat', 'Modellerna sa att de inte kunde bildas där', 'De liknade planeterna i vårt eget solsystem'], correct: 2 },
    { type: 'inferens', q: 'Vilket misstag varnar texten för?',
      options: ['Att lita på observationer från ett enda teleskop', 'Att jämföra solsystem av mycket olika ålder', 'Att räkna planeter innan de har bekräftats', 'Att dra slutsatser utifrån det som är lättast att hitta'], correct: 3 },
    { type: 'literal', q: 'Varför är begreppet beboelig zon trubbigt?',
      options: ['Det säger bara något om avståndet till stjärnan', 'Det gäller bara stjärnor av exakt solens typ', 'Det ändras varje gång en ny planet hittas', 'Det bygger på mätningar som ofta blir felaktiga'], correct: 0 },
    { type: 'sammanfatta', q: 'Vad säger texten om jordens framtid?',
      options: ['Att jorden blir obeboelig först när solen blir en röd jätte', 'Att solens ökande utstrålning gör jorden obeboelig långt dessförinnan', 'Att jordens magnetfält kommer att försvinna först av allt', 'Att forskarna saknar underlag för att säga något alls'], correct: 1 },
  ],
},

// ── åk 7, 220 → ~515 ord ────────────────────────────────────────────────
'ak7-tema-038': {
  text: `I en skola möts människor med olika bakgrunder, erfarenheter och förutsättningar. En inkluderande skola handlar om att alla elever ska känna sig välkomna och ha möjlighet att lyckas, oavsett vem de är. Det kan handla om kön, språk, funktionsvariation eller familjesituation.

Till exempel kan Amir, som nyligen flyttat till Sverige, behöva extra stöd i språket. Samtidigt kan Alex, som är icke-binär, behöva en miljö där hen känner sig respekterad. Lina kanske använder rullstol och behöver en skola som är tillgänglig rent fysiskt.

Inkludering betyder inte att alla ska behandlas exakt likadant. Att ge alla samma sak är inte samma sak som att ge alla samma möjligheter. Om en elev behöver längre tid på ett prov och en annan inte gör det, är det rimligt att tiden skiljer sig. Det som ska vara lika är chansen att visa vad man kan.

Ordet inkludering betyder inte samma sak som integrering. Integrering handlar om att en elev ska passa in i en verksamhet som redan finns. Inkludering vänder på det: verksamheten ska vara byggd så att fler ryms från början. Skillnaden syns i vem som förväntas anpassa sig.

Lärare spelar en viktig roll i att skapa en inkluderande miljö. De kan anpassa undervisningen så att alla elever får möjlighet att förstå och delta. Det kan innebära olika sätt att förklara, använda bilder eller ge extra tid.

Mycket av det som hjälper en enskild elev hjälper dessutom fler. Tydliga instruktioner på tavlan, en genomgång som också finns nedskriven och en lektion som börjar med vad man ska göra är sådant som togs fram för elever med särskilda behov, men som gör klassrummet lugnare för hela klassen.

Att ta emot stöd kan också kännas svårt. Många elever vill inte skilja ut sig och tackar därför nej till hjälp de skulle ha nytta av. Därför spelar det roll hur stödet ges: något som erbjuds hela klassen känns annorlunda än något som pekas ut inför alla.

Elever har också ett ansvar. Genom att visa respekt och vara öppna för olikheter kan de bidra till en bättre skolmiljö. Att stå upp för någon som blir behandlad illa är ett viktigt steg.

Utanförskap syns sällan under lektionerna. Det uppstår i korridoren, i matsalen och när grupper ska bildas. Att alltid bli vald sist, eller att ingen frågar vad man vill göra på rasten, lämnar inga spår i schemat men märks varje dag för den det gäller.

Det finns också gränser för vad välvilja kan lösa. En skola som ligger i ett hus utan hiss blir inte tillgänglig av att alla är trevliga mot varandra. Skollagen ställer krav på att skolan ska ge det stöd en elev behöver, och det kravet gäller oavsett hur ansträngd budgeten är.

En inkluderande skola handlar inte bara om regler, utan också om värderingar. Det handlar om att se varje individ som unik och värdefull. När elever känner sig trygga och accepterade ökar också deras möjligheter att lära sig.

I längden bidrar detta till ett mer rättvist samhälle. Genom att tidigt lära sig om respekt och inkludering kan unga människor ta med sig dessa värderingar in i vuxenlivet.`,
  questions: [
    { type: 'inferens', q: 'Varför är det inte orättvist att en elev får längre tid på ett prov?',
      options: ['För att provet då blir svårare för den eleven', 'För att läraren är den som bestämmer reglerna', 'För att det som ska vara lika är chansen att visa vad man kan', 'För att alla prov ändå tar olika lång tid'], correct: 2 },
    { type: 'literal', q: 'Vilken effekt har anpassningar för elever med särskilda behov ofta?',
      options: ['De tar tid från den vanliga undervisningen', 'De hjälper hela klassen', 'De gör lektionerna svårare att planera', 'De behöver bara användas vid enstaka tillfällen'], correct: 1 },
    { type: 'literal', q: 'Var uppstår utanförskap enligt texten?',
      options: ['I korridoren, matsalen och när grupper bildas', 'Framför allt under själva lektionerna', 'Mest på nätet efter att skoldagen är slut', 'Under prov och muntliga redovisningar'], correct: 0 },
    { type: 'inferens', q: 'Varför räcker det inte att lektionerna fungerar?',
      options: ['För att lärarna inte hinner se allt som händer', 'För att raster saknar ett fastställt schema', 'För att eleverna hellre pratar med varandra', 'För att utanförskapet uppstår utanför lektionerna'], correct: 3 },
    { type: 'literal', q: 'Vad säger texten om en skola i ett hus utan hiss?',
      options: ['Att kommunen måste bygga en helt ny skola', 'Att den inte blir tillgänglig av att alla är trevliga', 'Att eleven får byta till en annan skola', 'Att problemet löses genom mer personal'], correct: 1 },
    { type: 'sammanfatta', q: 'Vilken hållning till inkludering har texten?',
      options: ['Att den främst handlar om att följa regler', 'Att den bara berör vissa grupper av elever', 'Att den kräver både värderingar och konkreta krav', 'Att den är viktigast för de allra yngsta eleverna'], correct: 2 },
  ],
},

// ── åk 10, 221 → ~605 ord ───────────────────────────────────────────────
'akgy-demo-002': {
  text: `Demokrati i praktiken handlar inte enbart om val utan om ett komplext samspel mellan institutioner, lagar och medborgarnas deltagande. För att ett demokratiskt system ska fungera krävs stabila institutioner som säkerställer maktbalans och ansvarstagande. Dessa inkluderar parlament, oberoende domstolar och fria medier.

Parlamentet fungerar som den lagstiftande makten och representerar folkets vilja genom valda ledamöter. Regeringen ansvarar för att genomföra politiska beslut, medan domstolarna tolkar lagar och säkerställer att dessa följs. Denna maktdelning är central för att förhindra maktmissbruk.

Utöver dessa tre finns en rad organ vars uppgift är att granska makten inifrån. Justitieombudsmannen tar emot klagomål från enskilda som anser sig ha behandlats fel av en myndighet. Riksrevisionen granskar hur statens pengar används. Lagrådet yttrar sig över lagförslag innan de går till riksdagen och påpekar när ett förslag krockar med grundlagen. Ingen av dem kan stoppa ett beslut, men deras yttranden blir offentliga, och det räcker ofta långt.

Att sådana organ är oberoende är ingen detalj utan hela poängen. Om den som granskar kan avsättas av den som granskas blir granskningen värdelös. Därför regleras deras tillsättning och skydd särskilt, och just de reglerna brukar vara bland det första som ändras i länder där demokratin försvagas.

Maktdelningen ser dessutom olika ut i olika länder. Sverige saknar en författningsdomstol av det slag som finns i Tyskland, där en särskild domstol kan ogiltigförklara lagar som strider mot grundlagen. I stället granskar Lagrådet i förväg, och vanliga domstolar kan i efterhand låta bli att tillämpa en regel som uppenbart strider mot grundlag.

Vem som utser domarna är därför en känslig fråga. I ett system där en regering fritt kan tillsätta och avsätta domare blir domstolarnas kontroll av makten svag. Att tillsättningen sker på ett sätt som är svårt att styra politiskt är alltså inte byråkrati utan ett skydd.

Fria medier spelar en avgörande roll genom att granska makthavare och informera allmänheten. Utan tillgång till korrekt information riskerar medborgarna att fatta beslut på bristfälliga grunder, vilket kan underminera demokratin.

Mediernas ekonomi är samtidigt en demokratisk fråga i sig. Granskande journalistik är dyr och tar lång tid, medan intäkterna sjunkit i takt med att annonserna flyttat till några få digitala plattformar. Många lokaltidningar har lagts ned, och i kommuner utan en enda bevakande journalist minskar både valdeltagandet och antalet kandidater till lokala uppdrag. Att ingen granskar syns alltså i statistiken.

Trots dessa strukturer står moderna demokratier inför flera utmaningar. En av dessa är minskat valdeltagande, särskilt bland unga. Detta kan leda till att vissa grupper blir underrepresenterade, vilket i sin tur påverkar legitimiteten i politiska beslut.

Valdeltagandet varierar dessutom kraftigt mellan olika grupper. I Sverige röstar omkring nio av tio i områden med höga inkomster, men betydligt färre i andra. Eftersom politiker arbetar för att bli valda får de områden där många röstar större uppmärksamhet, vilket kan förstärka skillnaden över tid.

En annan utmaning är spridningen av desinformation, särskilt via digitala plattformar. När falsk eller vilseledande information sprids kan det påverka opinionen och försvåra en rationell samhällsdebatt.

Samtidigt finns det möjligheter att stärka demokratin genom ökat medborgarengagemang och nya former av deltagande, såsom digitala forum och medborgardialoger.

En form som prövats i flera länder är medborgarråd. Ett slumpmässigt urval invånare kallas in, får ta del av underlag och experthjälp och lämnar sedan rekommendationer i en avgränsad fråga. Tanken är att människor som inte behöver bli omvalda kan resonera friare. Irland använde metoden inför flera stora folkomröstningar, och deltagarna ändrade ofta åsikt under processens gång, något som sällan sker i en vanlig debatt.

Sammanfattningsvis är demokrati ett dynamiskt system som kräver både institutionell stabilitet och aktivt deltagande. Dess framtid beror på hur väl samhällen hanterar de utmaningar som uppstår i en föränderlig värld.`,
  questions: [
    { type: 'literal', q: 'Vad är Riksrevisionens uppgift?',
      options: ['Att granska hur statens pengar används', 'Att ta emot klagomål från enskilda personer', 'Att yttra sig över nya lagförslag', 'Att utse ledamöter till domstolarna'], correct: 0 },
    { type: 'inferens', q: 'Varför räcker det ofta att yttrandena blir offentliga?',
      options: ['För att organen samtidigt kan stoppa beslutet', 'För att offentlig kritik i sig får verkan', 'För att riksdagen är skyldig att följa dem', 'För att medierna annars inte får rapportera'], correct: 1 },
    { type: 'inferens', q: 'Varför är granskarnas oberoende hela poängen?',
      options: ['För att arbetet annars tar alltför lång tid', 'För att verksamheten annars kostar för mycket', 'För att granskningen blir värdelös om den granskade kan avsätta dem', 'För att grundlagen kräver det uttryckligen'], correct: 2 },
    { type: 'literal', q: 'Vad händer i kommuner utan någon bevakande journalist?',
      options: ['Antalet myndighetsbeslut minskar kraftigt', 'Lokaltidningarna slås ihop med varandra', 'Kommunen tvingas anställa en pressekreterare', 'Valdeltagandet och antalet kandidater minskar'], correct: 3 },
    { type: 'literal', q: 'Hur fungerar ett medborgarråd?',
      options: ['Ett slumpmässigt urval invånare får underlag och lämnar rekommendationer', 'Alla invånare röstar digitalt i en avgränsad fråga', 'Partierna utser var sin representant till rådet', 'Experter beslutar och invånarna godkänner i efterhand'], correct: 0 },
    { type: 'sammanfatta', q: 'Vad var särskilt med deltagarna i de irländska råden?',
      options: ['De var eniga redan från allra första början', 'De ändrade ofta åsikt under processens gång', 'De vägrade lämna några rekommendationer alls', 'De valdes bland partiernas egna medlemmar'], correct: 1 },
  ],
},

// ── åk 10, 222 → ~605 ord ───────────────────────────────────────────────
'akgy-mj-001': {
  text: `Michael Jackson var en av de mest inflytelserika artisterna i modern musikhistoria. Han föddes 1958 i Gary, Indiana, och började sin karriär som barn i gruppen The Jackson 5 tillsammans med sina syskon. Gruppen blev snabbt framgångsrik, men det var som soloartist som Jackson verkligen förändrade musikindustrin. Hans album Thriller, som släpptes 1982, är fortfarande ett av de mest sålda albumen genom tiderna. Det innehöll låtar som kombinerade pop, rock och funk, vilket bidrog till att bredda popmusikens uttryck.

Vägen dit började tidigt och hårt. Jackson uppträdde inför publik från fem års ålder och turnerade som barn under förhållanden som i dag skulle beskrivas som barnarbete. Han gick i skola mellan inspelningarna, med lärare anställda av skivbolaget. Att han senare kunde skivbranschens alla led utantill hade sin förklaring i att han vuxit upp i dem.

Att bli känd som barn har ett pris som sällan syns i statistiken. Jackson har beskrivit att han fick öva när andra barn lekte och att han saknade vanliga kamrater. Barnstjärnor i underhållningsbranschen har sedan dess fått ett visst rättsligt skydd i USA, delvis efter erfarenheter som hans.

The Jackson 5 var kontrakterade av Motown, ett skivbolag som byggt en modell där bolaget ägde inspelningarna, valde låtarna och bestämde hur artisterna skulle uppträda. Modellen var effektiv och lyfte fram ett stort antal svarta artister i en tid då många radiokanaler var uppdelade. Den innebar också att artisterna själva hade lite att säga till om. När familjen bytte bolag var friheten att skriva och producera själv ett av skälen.

Off the Wall från 1979 sålde utmärkt men fick lite uppmärksamhet i de stora prisutdelningarna, vilket enligt Jackson själv blev drivkraften bakom nästa skiva. Målet med Thriller var uttalat: den skulle bli den mest sålda skivan någonsin.

En viktig del av Michael Jacksons framgång var hans förmåga att använda musikvideor som ett konstnärligt verktyg. Videon till Thriller var mer som en kortfilm än en traditionell musikvideo och satte en ny standard för hur musik kunde presenteras visuellt. Detta bidrog till att musikkanalen MTV började visa fler videor med svarta artister, vilket hade stor betydelse för representation inom populärkulturen.

Framgången förändrade också hur skivor gavs ut. Tidigare släpptes ett par singlar från ett album; från Thriller släpptes sju, med en video till nästan varje. Skivan låg kvar på listorna i åratal i stället för månader, och branschen lärde sig att ett album kunde säljas om och om igen i stället för att genast ersättas av nästa. Den logiken styrde utgivningen i decennier framåt.

Framgången var dessutom global på ett sätt som var nytt. Skivan sålde i länder som skivbolagen dittills knappt räknat med, och satellitsända konserter nådde publik som aldrig skulle kunna köpa en biljett. Popmusiken blev därmed en världsmarknad snarare än flera nationella.

Jackson var också känd för sin unika dansstil, särskilt rörelsen moonwalk, som blev ikonisk. Hans scenframträdanden kombinerade avancerad koreografi med starka visuella effekter, vilket inspirerade generationer av artister.

Han lärde sig dessutom affärssidan. I mitten av 1980-talet köpte han rättigheterna till en stor katalog med låtar, bland dem många av Beatles inspelningar. Affären gav honom stora inkomster oberoende av hans egen musik, men den kostade också vänskaper. Att en artist köpte andra artisters verk var ovanligt vid den tiden, och det är ett exempel på hur han tänkte på musik också som egendom.

Trots sina framgångar var Michael Jacksons liv också präglat av kontroverser och intensiv mediebevakning. Diskussioner om hans privatliv och förändringar i hans utseende bidrog till en komplex bild av honom som person.

Sammanfattningsvis var Michael Jackson inte bara en artist utan också en kulturell kraft som förändrade hur musik skapades, framfördes och upplevdes globalt.`,
  questions: [
    { type: 'literal', q: 'Hur såg Motowns modell ut?',
      options: ['Bolaget ägde inspelningarna och valde låtarna', 'Artisterna ägde sina egna inspelningar', 'Bolaget betalade bara ut pengar vid turnéer', 'Artisterna fick välja producent helt fritt'], correct: 0 },
    { type: 'inferens', q: 'Varför bytte familjen skivbolag?',
      options: ['Motown lade ned hela sin verksamhet', 'De ville skriva och producera själva', 'Kontraktet gick ut just det året', 'Ett annat bolag erbjöd betydligt högre lön'], correct: 1 },
    { type: 'inferens', q: 'Vad blev drivkraften bakom Thriller enligt Jackson själv?',
      options: ['Att skivbolaget krävde en ny skiva snabbt', 'Att han ville arbeta med Quincy Jones igen', 'Att Off the Wall fick lite uppmärksamhet vid prisutdelningarna', 'Att han ville ge sig ut på turné på nytt'], correct: 2 },
    { type: 'literal', q: 'Hur många singlar släpptes från Thriller?',
      options: ['Två', 'Tre', 'Fem', 'Sju'], correct: 3 },
    { type: 'inferens', q: 'Vad lärde sig branschen av Thrillers framgång?',
      options: ['Att ett album kan säljas om och om igen', 'Att videor är dyrare än de är värda', 'Att skivor bör släppas betydligt oftare', 'Att listorna inte säger något om försäljningen'], correct: 0 },
    { type: 'sammanfatta', q: 'Vad visar köpet av låtkatalogen?',
      options: ['Att han tappat intresset för sin egen musik', 'Att han tänkte på musik också som egendom', 'Att skivbolaget tvingade honom till affären', 'Att katalogen var mycket billig vid den tiden'], correct: 1 },
  ],
},

// ── åk 10, 225 → ~605 ord ───────────────────────────────────────────────
'akgy-demo-003': {
  text: `Demokrati i ett globalt perspektiv innebär att förstå hur olika samhällen tolkar och implementerar demokratiska principer utifrån sina historiska, kulturella och sociala förutsättningar. Det finns ingen enhetlig modell för demokrati; istället varierar dess uttryck beroende på kontext.

I vissa länder betonas representativa institutioner och rättsstatens principer, medan andra experimenterar med mer deltagarbaserade modeller där medborgare direkt involveras i beslutsprocesser. Dessa variationer visar att demokrati är ett flexibelt begrepp som kan anpassas till olika behov.

Skillnaderna gäller också hur röster räknas. I ett majoritetsvalsystem, som det brittiska, vinner den kandidat som får flest röster i sin valkrets, medan alla andra röster där i praktiken faller bort. I ett proportionellt system, som det svenska, fördelas mandaten efter partiernas andel av rösterna. Det första ger oftare tydliga majoriteter och stabila regeringar, det andra ett parlament som bättre speglar hur folk faktiskt röstade. Vilket som är mest demokratiskt går inte att avgöra utan att först säga vad man värderar högst.

Hur demokratiskt ett land är brukar dessutom mätas, och måtten skiljer sig åt. Vissa index väger tungt på om det hålls fria val, andra på om domstolarna är oberoende, om medierna kan arbeta fritt och om minoriteter skyddas. Ett land kan därför ligga högt i ett index och lägre i ett annat utan att något förändrats, bara för att måtten frågar olika saker.

Övergångar till demokrati sker sällan i ett enda steg. Ett land kan hålla val utan att makten verkligen kan bytas, eller ha fria medier men domstolar som lyder regeringen. Forskare talar därför om gråzoner snarare än om två lägen, och de flesta länder i världen befinner sig någonstans däremellan.

Mångfald spelar en central roll i demokratiska samhällen. Detta inkluderar inte bara etnisk och kulturell variation utan även skillnader i kön, ålder, socioekonomisk bakgrund och identitet. Ett demokratiskt system måste kunna hantera dessa skillnader och skapa utrymme för olika perspektiv.

Vissa länder har byggt in skyddet i själva systemet. I Libanon och Belgien fördelas poster efter grupptillhörighet för att ingen grupp ska kunna köra över en annan. Nya Zeeland har särskilda platser i parlamentet för maorier. Sådana lösningar kan dämpa konflikter, men de kritiseras också för att låsa fast just de indelningar de var tänkta att hantera.

Samtidigt kan mångfald innebära utmaningar. Konflikter mellan olika grupper kan uppstå, särskilt om resurser eller politiskt inflytande upplevs som ojämnt fördelade. Här blir institutioner och dialog avgörande för att hantera motsättningar på ett konstruktivt sätt.

Ett exempel är hur unga aktivister, äldre beslutsfattare och personer med olika könsidentiteter kan ha skilda prioriteringar. Att integrera dessa perspektiv kräver både kompromisser och förståelse.

Ett återkommande argument mot att kräva demokrati överallt är att begreppet skulle vara västerländskt. Historien ger inte riktigt stöd för det. Former av gemensamt beslutsfattande har funnits i många samhällen långt utanför Europa, och de som i dag lever under förtryck brukar inte beskriva rätten att välja sina ledare som en främmande idé. Kritik mot hur enskilda länder lägger sig i andras politik kan däremot vara befogad utan att själva principen ifrågasätts.

Globaliseringen har dessutom förändrat förutsättningarna för demokrati. Internationella organisationer, ekonomiska beroenden och digital kommunikation påverkar nationella beslut och skapar nya former av politiskt deltagande.

En följd som diskuteras är att allt fler frågor avgörs på nivåer där ingen är vald. Handelsavtal, klimatmål och regler för digitala tjänster förhandlas mellan stater eller inom internationella organ, långt från väljarna. Att beslut flyttar uppåt kan vara nödvändigt när problemen är gränsöverskridande, men det gör samtidigt avståndet mellan väljare och beslut längre.

Sammanfattningsvis är demokrati i dagens värld en komplex och mångfacetterad företeelse. För att fungera effektivt måste den både respektera mångfald och skapa gemensamma ramar för beslutsfattande.`,
  questions: [
    { type: 'literal', q: 'Vad kännetecknar ett majoritetsvalsystem?',
      options: ['Den som får flest röster i valkretsen vinner', 'Mandaten fördelas efter partiernas andel av rösterna', 'Alla partier får minst en plats i parlamentet', 'Väljarna rangordnar samtliga kandidater'], correct: 0 },
    { type: 'inferens', q: 'Varför går det inte att avgöra vilket valsystem som är mest demokratiskt?',
      options: ['För att båda används i ungefär lika många länder', 'För att svaret beror på vad man värderar högst', 'För att systemen ger samma resultat i praktiken', 'För att forskningen ännu inte undersökt frågan'], correct: 1 },
    { type: 'inferens', q: 'Vilken kritik riktas mot att fördela poster efter grupptillhörighet?',
      options: ['Att systemet blir för dyrt att administrera', 'Att väljarna inte förstår hur det fungerar', 'Att det låser fast de indelningar det skulle hantera', 'Att det kräver en folkomröstning vid varje val'], correct: 2 },
    { type: 'inferens', q: 'Varför ger historien inte stöd åt att demokrati är västerländskt?',
      options: ['För att begreppet myntades i flera länder samtidigt', 'För att FN uttryckligen har slagit fast motsatsen', 'För att alla länder har skrivit under samma avtal', 'För att gemensamt beslutsfattande funnits långt utanför Europa'], correct: 3 },
    { type: 'literal', q: 'Vilka frågor avgörs allt oftare långt från väljarna?',
      options: ['Handelsavtal, klimatmål och regler för digitala tjänster', 'Skolans läroplaner och sjukvårdens organisation', 'Kommunala budgetar och lokala byggplaner', 'Domstolarnas sammansättning och arbetssätt'], correct: 0 },
    { type: 'sammanfatta', q: 'Vad är följden av att beslut flyttar uppåt?',
      options: ['Besluten blir alltid bättre underbyggda', 'Avståndet mellan väljare och beslut blir längre', 'Nationella parlament förlorar all sin makt', 'Väljarna får gå till val betydligt oftare'], correct: 1 },
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
  if (data.title) t.title = data.title;
  const n = data.text.trim().split(/\s+/).length;
  t.meta = { ...(t.meta || {}), wordCount: n };
  const b = BAND[t.grade];
  const inom = n >= b[0] && n <= b[1];
  if (!inom) ok = false;
  console.log(`${id.padEnd(18)} åk${String(t.grade).padEnd(3)} ${String(n).padStart(4)} ord ${inom ? '✅' : '❌ krav ' + b[0] + '–' + b[1]}  facit:${data.questions.map(q => q.correct).join('')}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
if (!ok) process.exit(1);
