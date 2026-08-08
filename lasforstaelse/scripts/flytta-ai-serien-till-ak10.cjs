#!/usr/bin/env node
//
// AI-serien (ak10-ai-001…005) flyttas från åk 4 till åk 10.
//
// Texterna låg på åk 4 med runt 210 ord, vilket stämmer med ordintervallet för
// årskursen. Innehållet gör det inte: LIX 48–59 mot åk 4:s median 39, och ämnen
// som maktkoncentration i demokratiska processer, algoritmisk snedvridning och
// artificiell generell intelligens. En tioåring kan inte läsa sig till det
// oavsett hur korta meningarna görs. Årskursen hade satts efter längden.
//
// Serien flyttas som helhet – delarna hänger ihop och kan inte ligga i olika
// årskurser – och skrivs ut till åk 10:s intervall 590–625 ord. Innehållet är
// utökat med resonemang och konkreta exempel, inte utfyllnad: AI-effekten och
// den symboliska ansatsen i del 1, Moravecs paradox i del 2, rättvisemåttens
// oförenlighet i del 3, lögnarens utdelning i del 4, prognosernas dåliga
// träffsäkerhet i del 5. Frågorna är omskrivna för samma nivå.
//
// Kör med --dry för att se ändringarna utan att skriva.

const fs = require('fs');
const path = require('path');

const MAL_ARSKURS = 10;
const MIN_ORD = 590;
const MAX_ORD = 625;

// Kontroll före ändring: skriptet är inte idempotent, och ska bara köras på
// texterna i sitt ursprungliga skick.
const FORVANTAT = {
  'ak10-ai-001': { grade: 4, borjarMed: 'Artificiell intelligens, ofta förkortat AI, syftar på' },
  'ak10-ai-002': { grade: 4, borjarMed: 'Artificiell intelligens förändrar arbetsmarknaden på flera sätt.' },
  'ak10-ai-003': { grade: 4, borjarMed: 'I takt med att AI-system får större inflytande' },
  'ak10-ai-004': { grade: 4, borjarMed: 'Artificiell intelligens har potential att både stärka' },
  'ak10-ai-005': { grade: 4, borjarMed: 'Framtiden för artificiell intelligens är föremål för' },
};

const NYA = {};

NYA['ak10-ai-001'] = {
  title: 'Vad är artificiell intelligens?',
  text: `Artificiell intelligens, ofta förkortat AI, är ett samlingsnamn för datorprogram som utför uppgifter vi normalt förknippar med mänskligt tänkande: att lära av erfarenhet, känna igen mönster, lösa problem och fatta beslut. Gränsen är rörlig. Det som en gång räknades som avancerad AI, som att spela schack eller tyda handskriven text, uppfattas i dag ofta som vanlig programmering. Fenomenet har ett eget namn: AI-effekten, att tekniken slutar kallas intelligent så snart den fungerar.

Skillnaden mot traditionella program ligger i hur reglerna kommer till. Ett vanligt program följer instruktioner som en människa skrivit i förväg. Ett AI-system tränas i stället på data, och reglerna växer fram ur materialet. Den som bygger ett system för att skilja katter från hundar skriver aldrig ned vad som utmärker en katt. I stället visas systemet hundratusentals bilder med facit, och det justerar successivt sina egna inställningar tills felen blir tillräckligt få.

Under 1900-talets senare hälft dominerade en annan ansats. Symbolisk AI byggde på logiska regler och kunskap som experter matade in för hand. Metoden fungerade i avgränsade sammanhang men blev ohanterlig så snart världen blev rörig. Genombrottet kom när billig beräkningskraft och stora datamängder gjorde det möjligt att låta statistiska metoder ta över.

Maskininlärning är den centrala tekniken, och djupinlärning en gren av den. Där sker beräkningarna i många lager, efter en struktur löst inspirerad av nervceller. Varje lager fångar något mer sammansatt än det föregående: först kanter och färgskiftningar, sedan former, till sist objekt. Just den skiktningen förklarar framstegen inom bild- och språkbehandling.

Det är brukligt att skilja mellan smal och generell AI. Smal AI löser en avgränsad uppgift åt gången: rekommenderar en film, skriver ut vad någon säger, upptäcker avvikelser i en röntgenbild. All AI som används i dag är smal, hur imponerande den än verkar. Generell AI, ett system med mänsklig bredd i sitt tänkande, existerar inte, och forskarna är oense om hur nära den ligger. Däremellan står de generativa modellerna, som producerar text, bild och ljud utifrån mönster i sitt träningsmaterial.

Här finns en viktig begränsning. En språkmodell förutsäger vilket ord som sannolikt följer på det föregående. Det ger ofta korrekta svar, eftersom korrekta formuleringar är vanliga i träningsdata, men systemet har ingen kontroll mot verkligheten inbyggd. När underlaget saknas fyller det ändå i något rimligt klingande. Fenomenet kallas hallucination och är inte ett fel som kan programmeras bort, utan en följd av hur metoden fungerar.

Träningsdata är därför inte en neutral resurs. Vad en modell kan svara på avgörs av vad som fanns i materialet, och materialet speglar vilka språk som skrivits mycket på nätet och vems perspektiv som fått plats. En modell som mött få texter på ett minoritetsspråk presterar sämre på just det språket.

AI påverkar redan vardagen. Sökmotorernas rangordning, flödena i sociala medier, översättningsverktyg, röststyrning och stavningskontroll drivs av modeller av det här slaget. Inom sjukvården används de för att markera misstänkta förändringar i medicinska bilder, inom transport för att tolka omgivningen i fordon som kör själva.

Ju fler beslut som förbereds av sådana system, desto viktigare blir två frågor. Den första gäller insyn: går det att rekonstruera varför systemet kom fram till just det svaret? I en djupinlärningsmodell är beslutet utspritt över miljoner justerade värden, och någon läsbar motivering finns inte. Den andra gäller ansvar. När ett system gör fel är det sällan uppenbart vem som ska svara: den som byggde modellen, den som valde träningsdata, den som köpte in systemet eller den som följde dess rekommendation.

Att förstå AI handlar därför mindre om att veta hur beräkningarna går till, och mer om att kunna bedöma vad ett system faktiskt kan svara på, vad det bara verkar kunna svara på, och vem som bär följderna när det tar fel.`,
  questions: [
    {
      type: 'ord',
      q: 'Vad betyder uttrycket AI-effekten som texten beskriver?',
      options: [
        'Att tekniken kräver allt större beräkningskraft för varje steg',
        'Att tekniken blir mer träffsäker ju fler människor som använder den',
        'Att tekniken slutar kallas intelligent så snart den fungerar',
        'Att tekniken sprids fortare än vad lagstiftningen hinner med',
      ],
      correct: 2,
    },
    {
      type: 'literal',
      q: 'Vad utmärkte den symboliska ansatsen inom AI?',
      options: [
        'Logiska regler och kunskap som experter matade in för hand',
        'Statistiska metoder tränade på mycket stora datamängder',
        'Beräkningar i många lager efter nervcellernas förebild',
        'Program som skapade text och bild utifrån mönster i material',
      ],
      correct: 0,
    },
    {
      type: 'inferens',
      q: 'Texten kallar hallucinationer en följd av metoden snarare än ett fel som går att rätta. Vad talar starkast för den beskrivningen?',
      options: [
        'Att systemen sällan får tillräckligt med träningsdata att arbeta med',
        'Att användarna oftast ställer frågor som saknar ett bestämt svar',
        'Att beräkningarna sker i lager som ingen utvecklare kan granska',
        'Att systemet väljer sannolika ord utan att pröva dem mot verkligheten',
      ],
      correct: 3,
    },
    {
      type: 'literal',
      q: 'Varför beskrivs all AI som används i dag som smal?',
      options: [
        'Därför att den bara kan köras på särskilt kraftfull utrustning',
        'Därför att varje system löser en avgränsad uppgift åt gången',
        'Därför att den ännu inte fått fäste utanför forskningen',
        'Därför att den saknar förmåga att förändras över tid',
      ],
      correct: 1,
    },
    {
      type: 'inferens',
      q: 'Varför blir frågan om insyn särskilt svår i en djupinlärningsmodell?',
      options: [
        'Därför att modellens kod hålls hemlig av företaget bakom den',
        'Därför att modellen ändrar sina svar varje gång den används',
        'Därför att beslutet är utspritt över miljoner justerade värden',
        'Därför att modellen aldrig sparar underlaget för sina beslut',
      ],
      correct: 2,
    },
    {
      type: 'sammanfatta',
      q: 'Vilket påstående ligger närmast textens slutsats om vad det innebär att förstå AI?',
      options: [
        'Att kunna bedöma vad ett system kan svara på och vem som bär följderna',
        'Att kunna följa hur beräkningarna i systemets olika lager går till',
        'Att kunna skilja mellan de företag som utvecklar de största modellerna',
        'Att kunna avgöra när generell AI kommer att bli tekniskt möjlig',
      ],
      correct: 0,
    },
  ],
};

NYA['ak10-ai-002'] = {
  title: 'AI i arbetslivet',
  text: `Artificiell intelligens förändrar arbetsmarknaden, men inte riktigt på det sätt som rubrikerna antyder. Den vanliga bilden är att hela yrken försvinner. Arbetsmarknadsforskare beskriver hellre förändringen på uppgiftsnivå: varje yrke består av en uppsättning arbetsmoment, och tekniken tar över några av dem medan andra blir kvar. En radiolog som slutar mäta tumörstorlek för hand ägnar inte mindre tid åt patienter, utan mer.

Historiskt har varje teknikskifte följt ett liknande mönster. Vävstolen ersatte handvävaren men skapade fabriken. Persondatorn gjorde skrivbiträdet överflödigt och gav upphov till branscher som inte hade något namn tjugo år tidigare. Nettoresultatet har hittills varit fler arbetstillfällen, inte färre.

Det som skiljer det pågående skiftet är hastigheten. Industrialiseringen sträckte sig över generationer. De senaste årens språkmodeller nådde hundratals miljoner användare på månader. En omställning som får ta trettio år kan tas upp av att unga utbildas annorlunda. En som tar fem år måste hanteras av dem som redan är mitt i yrkeslivet.

Vilka uppgifter som är utsatta följer inte den intuitiva skalan från enkelt till svårt. Rutinmässiga och regelstyrda moment automatiserades redan under digitaliseringens första våg: fakturahantering, dataregistrering, enklare kundtjänst. Det nya är att även kvalificerade skrivbordsuppgifter berörs, som att sammanfatta ett underlag, formulera ett första utkast eller översätta en text. Samtidigt står yrken som kräver fysisk närvaro i oförutsägbara miljöer emot förvånansvärt väl. Att montera en ställning på ett tak eller trösta ett barn i förskolan är svårare att automatisera än att skriva en rapportsammanfattning. Fenomenet är känt som Moravecs paradox: det som är lätt för människor är ofta svårt för maskiner, och tvärtom.

Empati och sammansatt socialt samspel hör till det svåraste. Ett system kan producera formuleringar som låter empatiska, men i yrken där en bedömning ska bäras av någon, som ett besked till en anhörig eller ett beslut om en elevs stöd, är det inte formuleringen som är kärnan. Kärnan är att en ansvarig människa står bakom den.

Övergångsperioden är den svåra delen. Utbildningssystem är byggda för att förbereda unga för ett yrkesliv, inte för att skola om fyrtioåringar. Livslångt lärande blir därför mer än en fras: det förutsätter finansiering, tid och att arbetsgivare räknar omskolning som en investering snarare än en kostnad. Länder som byggt ut omställningsstöd har historiskt klarat strukturomvandlingar med mindre social skada än länder som låtit marknaden ensam sköta anpassningen.

Det är dessutom svårt att mäta effekten medan den pågår. Produktivitetsstatistik fångar förändringar med flera års fördröjning, och de företag som infört verktygen tidigt är sällan representativa för resten. Mycket av det som sägs om AI:s inverkan på arbetsmarknaden bygger därför på enkäter om förväntningar snarare än på utfall som gått att räkna.

Perspektiven på effekterna går isär. Optimisterna pekar på produktivitet: om samma arbete kan utföras på kortare tid frigörs resurser till annat, och slitsamma moment försvinner. Kritikerna invänder att produktivitetsvinsten inte fördelar sig av sig själv. Om vinsterna tillfaller ägare av kapital och plattformar medan lönerna står stilla ökar ojämlikheten även när ekonomin växer. Vem som tar hem vinsten är en politisk fråga, inte en teknisk.

En tredje position undviker båda ytterligheterna. Den framhåller att effekten beror på hur systemen införs. Ett verktyg som ges till medarbetare för att slippa det mest slitsamma ger ett annat resultat än samma verktyg infört för att minska bemanningen, trots att tekniken är identisk.

Det som ändå framstår som säkert är att kraven på kompetens förskjuts. Att arbeta bra tillsammans med ett AI-system förutsätter att man vet vad det är dåligt på: när det låter säkert utan att ha täckning, när dess förslag bygger på ett material som inte liknar den egna verksamheten, och när ett svar måste kontrolleras innan det används. Den förmågan är inte teknisk i första hand, utan en form av källkritik.`,
  questions: [
    {
      type: 'literal',
      q: 'Varför beskriver arbetsmarknadsforskare förändringen på uppgiftsnivå i stället för yrkesnivå?',
      options: [
        'Därför att antalet yrken i statistiken har minskat kraftigt på senare år',
        'Därför att tekniken tar över vissa arbetsmoment medan andra blir kvar',
        'Därför att arbetsgivare sällan vill uppge vilka yrken de har anställda i',
        'Därför att de flesta yrken består av ungefär lika många arbetsmoment',
      ],
      correct: 1,
    },
    {
      type: 'ord',
      q: 'Vad innebär Moravecs paradox som texten beskriver?',
      options: [
        'Att en teknik blir billigare ju fler uppgifter den klarar av att lösa',
        'Att produktivitetsvinster sällan syns i statistiken förrän långt efteråt',
        'Att det som är lätt för människor ofta är svårt för maskiner, och tvärtom',
        'Att arbetslösheten stiger på kort sikt men faller tillbaka på lång sikt',
      ],
      correct: 2,
    },
    {
      type: 'inferens',
      q: 'Varför menar texten att omställningens hastighet spelar större roll än dess omfattning?',
      options: [
        'Därför att en snabb omställning drabbar dem som redan är mitt i yrkeslivet',
        'Därför att en snabb omställning skapar färre nya yrken än en långsam',
        'Därför att snabba skiften alltid leder till lägre löner inom hela ekonomin',
        'Därför att snabba skiften gör att tekniken hinner bli föråldrad i förtid',
      ],
      correct: 0,
    },
    {
      type: 'inferens',
      q: 'Vad är kärnan i invändningen mot att se produktivitetsvinster som självklart goda?',
      options: [
        'Att vinsterna sällan blir så stora som förespråkarna räknat med i förväg',
        'Att arbete som utförs snabbare nästan alltid håller sämre kvalitet',
        'Att vinsterna kan tillfalla några få medan lönerna står stilla',
        'Att produktivitet är ett mått som saknar betydelse i tjänsteyrken',
      ],
      correct: 2,
    },
    {
      type: 'forfattarens-syfte',
      q: 'Varför tar texten upp att samma verktyg kan införas på två olika sätt?',
      options: [
        'För att visa att tekniken ensam inte avgör vad följden för de anställda blir',
        'För att visa att arbetsgivare i regel väljer det billigaste alternativet',
        'För att visa att verktygen fungerar sämre än vad tillverkarna påstår',
        'För att visa att det behövs fler tekniska standarder på arbetsplatser',
      ],
      correct: 0,
    },
    {
      type: 'sammanfatta',
      q: 'Vilken kompetens framhåller texten som avgörande i ett arbetsliv med AI?',
      options: [
        'Att kunna bygga egna modeller anpassade efter arbetsplatsens behov',
        'Att kunna bedöma när ett system låter säkert utan att ha täckning',
        'Att kunna arbeta snabbare än de system som införs på arbetsplatsen',
        'Att kunna välja mellan de leverantörer som erbjuder liknande verktyg',
      ],
      correct: 1,
    },
  ],
};

NYA['ak10-ai-003'] = {
  title: 'Etiska utmaningar med AI',
  text: `När AI-system börjar förbereda beslut som påverkar människors liv, som vem som kallas till anställningsintervju, vem som beviljas lån eller vilken patient som prioriteras, flyttas gamla etiska frågor in i ny form. De handlar om rättvisa, insyn, integritet och ansvar, och de går inte att lösa med bättre teknik ensam.

Det mest omtalade problemet är algoritmisk snedvridning, ofta kallad bias. Ett system tränas på historiska data, och historien är sällan neutral. Om ett rekryteringsverktyg lär sig av tidigare anställningsbeslut i en bransch där män dominerat kommer det att uppfatta manliga meriter som tecken på framgång. Systemet är inte fördomsfullt i någon mänsklig mening. Det återger det mönster det fått se.

Just därför är problemet svårt. Att stryka kön ur datamaterialet hjälper sällan, eftersom andra uppgifter kan fungera som ersättningar för det som togs bort: en idrottsförening, ett uppehåll i meritförteckningen, ett bostadsområde. Liknande mönster har påvisats inom kreditbedömning, brottsförutsägelse och ansiktsigenkänning.

Rättvisa visar sig dessutom vara flera saker samtidigt. Ska ett system ha lika stor andel felaktiga avslag i alla grupper, eller lika stor andel korrekta godkännanden? Matematiskt går det i regel inte att uppfylla båda kraven samtidigt om grupperna skiljer sig åt i utfall. Valet mellan dem är ett värdeval, och det kan inte lämnas över till en modell.

Insyn är en annan utmaning. Många system, särskilt djupinlärningsmodeller, beskrivs som svarta lådor: beslutet är utspritt över miljoner värden och låter sig inte översättas till en läsbar motivering. Det spelar liten roll för en filmrekommendation men mycket stor roll när någon nekas ett lån eller får en föreslagen diagnos. Det finns metoder för att i efterhand peka ut vad som verkar ha påverkat ett enskilt beslut, men sådana förklaringar är rekonstruktioner, inte protokoll över vad som faktiskt hände.

Integritetsfrågorna aktualiseras av att systemen blir bättre ju mer data de får. Ansiktsigenkänning i offentliga miljöer, förutsägande polisverksamhet och reklam byggd på beteendeanalys väcker frågan var övervakningens gräns går. En särskild svårighet är att uppgifter som var för sig verkar harmlösa kan bli känsliga när de förs samman. Köpmönster, rörelsemönster och söktermer kan tillsammans avslöja sådant som ingen av delarna avslöjar ensam.

Ansvarsfrågan har inget självklart svar. När en självkörande bil orsakar en olycka finns flera kandidater: tillverkaren, den som utvecklade programvaran, den som valde träningsdata, den som satt bakom ratten. Rättssystem är byggda kring uppsåt och oaktsamhet hos människor och passar illa när skadan uppstår ur ett samspel mellan många aktörer och ett system som ingen av dem fullt ut överblickar. Risken är ett ansvarsvakuum där var och en pekar på nästa led.

En fjärde fråga gäller varifrån träningsdata kommer. Mycket av materialet har samlats in från öppna delar av nätet utan att de som skrev det tillfrågats. Att en text är åtkomlig är inte detsamma som att den är fri att använda, och frågan prövas nu i domstolar på flera håll.

Ett besläktat problem kallas automationsbias. När ett system oftast har rätt tenderar människor att sluta granska det. Kravet på att en människa ska fatta det slutliga beslutet blir då en formalitet: personen trycker på knappen men gör ingen egen bedömning. Skyddet finns på pappret men inte i praktiken.

För att möta detta har olika ramverk växt fram. Återkommande principer är rättvisa, förklarbarhet, mänsklig kontroll och ansvarsskyldighet. EU:s AI-förordning bygger på en risktrappa: ju större risk för människors rättigheter, desto hårdare krav på dokumentation, datakvalitet och tillsyn, medan vissa användningar förbjuds helt.

Regler är dock trubbiga verktyg mot en teknik som ändras snabbare än lagstiftning hinner skrivas. Därför brukar man framhålla att etiken måste finnas i utvecklingsarbetet självt: i valet av data, i besluten om vad systemet inte ska användas till, och i viljan att avstå från en tillämpning som fungerar tekniskt men inte går att försvara.`,
  questions: [
    {
      type: 'literal',
      q: 'Varför hjälper det sällan att stryka kön ur ett rekryteringsverktygs träningsdata?',
      options: [
        'Därför att systemet ändå får uppgiften från arbetsgivaren i ett senare steg',
        'Därför att modellen behöver uppgiften för att kunna göra en rättvis bedömning',
        'Därför att andra uppgifter kan fungera som ersättningar för den som togs bort',
        'Därför att lagen kräver att uppgiften finns kvar i underlaget till beslutet',
      ],
      correct: 2,
    },
    {
      type: 'inferens',
      q: 'Varför menar texten att valet mellan olika rättvisemått inte kan lämnas till en modell?',
      options: [
        'Därför att måtten i regel inte går att uppfylla samtidigt och valet är ett värdeval',
        'Därför att modellerna ännu saknar tillräcklig beräkningskraft för sådana avvägningar',
        'Därför att måtten alltid ger samma resultat oavsett vilket av dem som väljs',
        'Därför att lagstiftningen redan har bestämt vilket av måtten som ska användas',
      ],
      correct: 0,
    },
    {
      type: 'ord',
      q: 'Vad menas med att ett AI-system beskrivs som en svart låda?',
      options: [
        'Att systemets kod är skyddad av upphovsrätt och inte får granskas utifrån',
        'Att systemet är byggt för att arbeta utan uppkoppling mot omvärlden',
        'Att systemet sparar sina beslut i ett format som bara tillverkaren kan läsa',
        'Att beslutet är utspritt över miljoner värden och inte går att motivera',
      ],
      correct: 3,
    },
    {
      type: 'literal',
      q: 'Vad innebär automationsbias enligt texten?',
      options: [
        'Att ett system som oftast har rätt gör att människor slutar granska det',
        'Att ett system ärver de fördomar som finns i dess träningsmaterial',
        'Att ett system svarar snabbare än en människa hinner läsa underlaget',
        'Att ett system anpassar sina svar efter vad användaren verkar vilja höra',
      ],
      correct: 0,
    },
    {
      type: 'inferens',
      q: 'Varför lyfter texten fram risken för ett ansvarsvakuum?',
      options: [
        'Därför att skadan uppstår ur ett samspel som ingen enskild part överblickar',
        'Därför att självkörande fordon ännu inte omfattas av några trafikregler',
        'Därför att tillverkarna i avtal friskriver sig från allt ansvar för skador',
        'Därför att domstolar saknar teknisk kompetens att pröva den här typen av mål',
      ],
      correct: 0,
    },
    {
      type: 'sammanfatta',
      q: 'Vilket påstående sammanfattar bäst textens syn på förhållandet mellan regler och etik?',
      options: [
        'Regler räcker om de skärps i takt med att tekniken utvecklas vidare',
        'Regler är trubbiga, så etiken måste finnas i utvecklingsarbetet självt',
        'Regler bör undvikas eftersom de hindrar att ny teknik kommer till nytta',
        'Regler bör ersättas av frivilliga åtaganden från de företag som bygger AI',
      ],
      correct: 1,
    },
  ],
};

NYA['ak10-ai-004'] = {
  title: 'AI och demokratin',
  text: `Artificiell intelligens kan både stärka och försvaga demokratiska processer, och ofta gör den bådadera samtidigt. Samma teknik som gör det möjligt att sortera miljontals inlägg för att hitta hot mot en förtroendevald kan användas för att producera hoten. Det som avgör utfallet är sällan tekniken i sig, utan vem som kontrollerar den och i vilket syfte.

Den mest genomgripande påverkan sker i det tysta, i rangordningen av innehåll. Sociala mediers flöden styrs av modeller som strävar efter engagemang: tid på plattformen, klick, delningar. Ingen har bestämt att upprört innehåll ska spridas mer än nyanserat, men eftersom det upprörda engagerar mer blir det den effekt målsättningen ger.

Filterbubblor uppstår när en användare främst möter det som bekräftar vad hen redan tycker. Forskningen är mer delad om bubblornas styrka än debatten låter påskina. Flera studier tyder på att människor möter mer motstridig information på nätet än utanför det, men att mötet oftare sker i konflikt än i samtal.

Generativ AI har sänkt tröskeln för att tillverka övertygande falskt material. Deepfakes, alltså manipulerade video- eller ljudinspelningar, kan lägga ord i munnen på en politiker dagarna före ett val, när tiden att dementera saknas. Den allvarligaste effekten är kanske inte att människor tror på förfalskningar, utan att äkta upptagningar kan avfärdas som förfalskningar. När allt kan vara tillverkat blir bevis förhandlingsbara. Fenomenet brukar kallas lögnarens utdelning.

AI används också åt andra hållet. Automatiserade system kan flagga misstänkt innehåll för mänsklig granskning och söka upp spridningsmönster som tyder på samordnade kampanjer. Svårigheten är avvägningen. Ett system som är strängt nog att fånga desinformation kommer också att fånga satir, minoritetsspråk och legitima åsikter som råkar likna det förbjudna. Att lägga gränsdragningen hos privata företag utan insyn är i sig ett demokratiskt problem.

Övervakningstekniken utgör en tredje front. Ansiktsigenkänning i realtid och förutsägande analys ger auktoritära regimer verktyg som tidigare krävde stora personalstyrkor. Men frågan är inte bortkopplad från demokratier. En kamera som känner igen efterlysta personer känner också igen alla andra, och vetskapen om att man kan bli igenkänd på en demonstration förändrar viljan att delta. Effekten kallas nedkylning och drabbar rättigheter som formellt är helt intakta.

Riktad politisk reklam är ett fjärde område. Med tillräckligt detaljerad kunskap om enskilda väljare går det att visa olika budskap för olika grupper, formulerade efter vad var och en antas reagera på. Det behöver inte innebära att någon ljuger. Men när ett parti säger en sak till en grupp och något annat till en annan, utan att någon utomstående kan se båda budskapen, försvinner den gemensamma offentlighet där påståenden brukar prövas mot varandra. Flera länder har därför infört krav på öppna register över politisk annonsering.

Maktkoncentrationen är kanske den mest strukturella utmaningen. Att träna de största modellerna kräver beräkningskraft, data och kapital som endast ett fåtal aktörer förfogar över. Därmed hamnar avgörande beslut hos företag som ingen har röstat fram: vad ett system ska vägra svara på, vilka språk det ska behärska, vilka värderingar som byggs in i dess standardsvar. Att makten är privat gör den inte olaglig, men den ligger utanför de kanaler genom vilka medborgare normalt kan utkräva ansvar.

Motmedlen brukar delas i tre. Reglering ställer krav på insyn, märkning av syntetiskt innehåll och tillsyn. Institutionell motståndskraft handlar om oberoende medier, väl fungerande valmyndigheter och domstolar som klarar trycket när resultat ifrågasätts. Medborgerlig beredskap, slutligen, handlar om källkritik: att kunna fråga varifrån en uppgift kommer och vem som tjänar på att den sprids.

Ingen av dessa räcker ensam, och alla tre är långsamma jämfört med tekniken. Just den obalansen, att verktygen utvecklas på månader medan institutioner byggs under decennier, är det som gör frågan brådskande snarare än enbart teknisk.`,
  questions: [
    {
      type: 'inferens',
      q: 'Varför sprids upprört innehåll mer än nyanserat, enligt textens förklaring?',
      options: [
        'Därför att plattformarna medvetet valt att gynna konflikter mellan användare',
        'Därför att modellerna strävar efter engagemang, och det upprörda engagerar mer',
        'Därför att nyanserat innehåll är dyrare att producera för avsändarna',
        'Därför att användare i regel läser det upprörda innehållet betydligt snabbare',
      ],
      correct: 1,
    },
    {
      type: 'ord',
      q: 'Vad betyder uttrycket lögnarens utdelning i texten?',
      options: [
        'Att falskt material sprids fortare än sanningsenligt material på nätet',
        'Att den som ljuger ofta får ekonomisk vinning av desinformationen',
        'Att äkta upptagningar kan avfärdas som förfalskningar när allt kan tillverkas',
        'Att en dementi når betydligt färre människor än det ursprungliga påståendet',
      ],
      correct: 2,
    },
    {
      type: 'literal',
      q: 'Vilken svårighet lyfter texten fram med automatisk granskning av innehåll?',
      options: [
        'Att systemen kräver mer beräkningskraft än plattformarna har tillgång till',
        'Att systemen bara fungerar på de största och mest spridda språken',
        'Att systemen arbetar för långsamt för att hinna före en spridning',
        'Att ett strängt system också fångar satir och legitima åsikter',
      ],
      correct: 3,
    },
    {
      type: 'inferens',
      q: 'Varför framhåller texten att nedkylning drabbar rättigheter som formellt är intakta?',
      options: [
        'Därför att lagen ändras utan att medborgarna hinner uppmärksamma det',
        'Därför att domstolar sällan prövar mål som handlar om övervakning',
        'Därför att rätten finns kvar men vetskapen om igenkänning minskar deltagandet',
        'Därför att rättigheterna gäller alla utom dem som är efterlysta av polisen',
      ],
      correct: 2,
    },
    {
      type: 'forfattarens-syfte',
      q: 'Varför nämner texten att företagen bakom de största modellerna inte är framröstade?',
      options: [
        'För att visa att deras beslut ligger utanför medborgarnas möjlighet att utkräva ansvar',
        'För att visa att företagen bryter mot de regler som gäller inom unionen',
        'För att visa att de anställda på företagen saknar demokratisk skolning',
        'För att visa att företagen borde ersättas av myndigheter i statlig regi',
      ],
      correct: 0,
    },
    {
      type: 'sammanfatta',
      q: 'Vad gör frågan brådskande enligt textens avslutning?',
      options: [
        'Att verktygen utvecklas på månader medan institutioner byggs under decennier',
        'Att antalet användare på de största plattformarna växer för varje år',
        'Att de tre motmedlen motverkar varandra när de införs samtidigt',
        'Att desinformation numera sprids av fler länder än tidigare i historien',
      ],
      correct: 0,
    },
  ],
};

NYA['ak10-ai-005'] = {
  title: 'AI:s framtid – möjligheter och osäkerheter',
  text: `Få frågor delar forskarvärlden så tydligt som vad artificiell intelligens kommer att innebära. Oenigheten gäller inte bara vad som kan hända, utan hur snart, och hur mycket det över huvud taget går att veta i förväg. Det är värt att minnas att prognoser om AI har dålig träffsäkerhet i båda riktningarna. Maskinöversättning mellan språk beskrevs på 1960-talet som något som skulle vara löst inom några år. Textgenerering av dagens kvalitet bedömdes av många ligga decennier bort så sent som för tio år sedan.

Optimisternas argument bygger på att flaskhalsen i vetenskapen ofta är förmågan att söka igenom enorma möjlighetsrum. Att hitta en molekyl som binder till ett visst protein, att pröva materialkombinationer för bättre batterier, att söka mönster i klimatdata: i alla dessa fall är antalet tänkbara alternativ större än vad forskare hinner testa. System som kan rangordna kandidater innan de prövas i laboratorium kortar tiden från idé till resultat. Ett tidigt exempel är förutsägelser av hur proteiner viker sig, ett problem som varit öppet i femtio år och där tillgången till förutsägelser förändrat arbetssättet i hela forskningsfält.

Riskargumenten rör sig på två tidsskalor, och de blandas ofta ihop. Den mer avlägsna gäller artificiell generell intelligens, förkortat AGI: system med mänsklig bredd i sina kognitiva förmågor. Oron handlar inte om att ett sådant system skulle bli illvilligt, utan om målstyrning. Ett system som effektivt strävar mot ett mål som är något annat än vad konstruktören avsåg kan orsaka skada helt utan avsikt, och ju kapablare systemet är desto svårare blir det att korrigera i efterhand. Kritiker invänder att resonemanget vilar på antaganden om en teknik som inte finns, och att uppmärksamheten drar resurser från problem som redan är verkliga.

De kortsiktiga utmaningarna är mer konkreta. Robusthet: system som fungerar utmärkt på data som liknar träningsmaterialet kan bete sig oförutsägbart utanför det. Missbruk: samma verktyg som skriver en artikel skriver ett övertygande bedrägeriförsök, och samma kodgenerator som hjälper en utvecklare hjälper en angripare. Fördelning: nyttan tillfaller inte automatiskt dem som behöver den mest, och de flesta modeller tränas på och för ett fåtal språk och kulturer.

Internationell samordning framhålls ofta som lösningen, men villkoren är svåra. En kapplöpning där hastighet ger fördel skapar ett tryck att prioritera lansering framför granskning, och den som avstår riskerar bara att förlora försprånget till någon annan. Jämförelser görs ibland med kontrollen av kärnvapen, men liknelsen haltar. Klyvbart material är svårt att framställa och går att räkna, medan en färdigtränad modell kan kopieras och spridas utan att någon märker det.

En del av oenigheten handlar om hur förmåga ska mätas. Ett system kan klara ett prov som är svårt för människor och samtidigt misslyckas med en uppgift som ett barn löser, vilket gör att samma resultat kan läsas som bevis både för snabba framsteg och för grundläggande begränsningar. Utan mått som alla accepterar blir debatten om hur långt tekniken nått delvis en debatt om vad man valt att mäta.

Osäkerheten i sig har blivit ett argument i debatten. Den ena sidan menar att man inte bör reglera hårt något man inte förstår, eftersom regler riskerar att träffa fel och cementera dagens aktörer. Den andra menar att just okunskapen motiverar försiktighet, på samma sätt som inom läkemedel, där ett preparat måste visas vara säkert innan det släpps snarare än tvärtom.

Det som förenar de flesta bedömare är att utvecklingen inte är förutbestämd. Vilka tillämpningar som får finansiering, vilka krav som ställs på granskning, vad skolan lär ut och vad allmänheten accepterar formar tillsammans utfallet. Att engagera sig i frågorna är därför inte ett expertansvar utan ett medborgerligt, och det förutsätter förmågan att skilja mellan vad som är känt, vad som är omtvistat och vad som ännu bara är antaganden.`,
  questions: [
    {
      type: 'forfattarens-syfte',
      q: 'Varför inleder texten med två exempel på prognoser som slagit fel?',
      options: [
        'För att visa att forskare inom fältet sällan är överens med varandra',
        'För att visa att bedömningar av tekniken har missat i båda riktningarna',
        'För att visa att maskinöversättning är svårare än textgenerering',
        'För att visa att utvecklingen har gått långsammare än vad många hoppats',
      ],
      correct: 1,
    },
    {
      type: 'literal',
      q: 'Vilken flaskhals i vetenskapen menar optimisterna att AI kan lätta på?',
      options: [
        'Bristen på forskare med tillräcklig utbildning inom flera olika fält',
        'Kostnaden för den utrustning som krävs i moderna laboratorier',
        'Förmågan att söka igenom fler alternativ än vad forskare hinner testa',
        'Svårigheten att få forskningsresultat publicerade i ledande tidskrifter',
      ],
      correct: 2,
    },
    {
      type: 'inferens',
      q: 'Varför handlar oron kring AGI om målstyrning snarare än om illvilja?',
      options: [
        'Därför att ett system kan orsaka skada utan avsikt när målet blir fel satt',
        'Därför att illvilja förutsätter ett medvetande som forskarna kan mäta',
        'Därför att målen bestäms av lagstiftaren och inte av konstruktören',
        'Därför att ett kapabelt system alltid följer sina instruktioner exakt',
      ],
      correct: 0,
    },
    {
      type: 'inferens',
      q: 'Varför haltar jämförelsen med kontrollen av kärnvapen?',
      options: [
        'Därför att kärnvapen aldrig har omfattats av några internationella avtal',
        'Därför att en färdigtränad modell kan kopieras utan att någon märker det',
        'Därför att AI-forskning bedrivs av fler länder än kärnvapenforskning gjorde',
        'Därför att kärnvapen utvecklades under en period utan digital teknik',
      ],
      correct: 1,
    },
    {
      type: 'literal',
      q: 'Hur beskriver texten skillnaden mellan de två sidorna i frågan om reglering?',
      options: [
        'Den ena vill reglera nationellt, den andra vill reglera mellan länder',
        'Den ena litar på forskarna, den andra litar på de folkvalda församlingarna',
        'Den ena vill reglera nu, den andra vill vänta tills tekniken är färdig',
        'Den ena ser okunskap som skäl att avvakta, den andra som skäl till försiktighet',
      ],
      correct: 3,
    },
    {
      type: 'sammanfatta',
      q: 'Vilken slutsats drar texten av att utvecklingen inte är förutbestämd?',
      options: [
        'Att experternas bedömningar bör väga tyngre än allmänhetens uppfattningar',
        'Att det är svårt att säga något meningsfullt om teknikens framtid',
        'Att engagemang i frågorna är ett medborgerligt och inte bara ett expertansvar',
        'Att forskningen bör inriktas på de risker som redan har visat sig verkliga',
      ],
      correct: 2,
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
