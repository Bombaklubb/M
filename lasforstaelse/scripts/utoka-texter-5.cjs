#!/usr/bin/env node
//
// Sats 5: fem texter i intervallet 148–153 ord, med omskrivna frågor.

const fs = require('fs');
const path = require('path');

const NYA = {

// ── åk 7, 148 → ~515 ord ────────────────────────────────────────────────
'ak7-tema-047': {
  text: `I de svenska fjällen lever vargen i små flockar. Vargen är ett rovdjur som jagar tillsammans med andra i gruppen. Genom samarbete kan de fälla större byten som älgar. Flocken har ofta en tydlig ledare, men alla medlemmar har viktiga roller.

En vargflock är i regel en familj. Den består av ett föräldrapar och deras ungar från ett eller två år. De ledande individerna är alltså inte djur som slagits sig till toppen, utan helt enkelt föräldrarna. Den äldre bilden av en ständig kamp om rangordningen kommer från studier av vargar i hägn, där obesläktade djur tvingats leva tillsammans, och stämmer dåligt med hur flockar fungerar i det fria.

Jakten lyckas långt ifrån alltid. Undersökningar visar att vargar misslyckas med de flesta försök, och att de oftast får tag på djur som är gamla, sjuka eller försvagade. En flock behöver stora områden för att hitta tillräckligt med byte, och ett revir kan omfatta hundratals kvadratkilometer.

Forskare har länge studerat vargar för att förstå deras beteende. De har upptäckt att vargar kommunicerar genom ljud, kroppsspråk och dofter. Ett ylande kan höras över långa avstånd och används för att hålla kontakt med flocken. Doftmarkeringar fungerar i stället som gränsskyltar mot andra flockar.

Ungarna föds i en lya på våren, oftast fyra till sex i en kull. De första veckorna är de helt beroende av de vuxna, som kommer tillbaka med mat till platsen. När ungarna blir ett eller två år lämnar de flesta flocken och vandrar i väg för att söka en egen partner och ett eget revir. De sträckor de tillryggalägger kan vara mycket långa, ibland hundratals mil.

Vargen var nära att försvinna helt från Sverige. Under 1960-talet fanns i praktiken inga vargar kvar i landet. Att stammen finns i dag beror på att ett fåtal djur vandrade in från öster och började föröka sig. Eftersom de var så få är den svenska vargstammen nära släkt, vilket ökar risken för sjukdomar och nedsatt fortplantning. Inavelsproblemet är en av de svåraste frågorna i vargförvaltningen.

Samtidigt finns det konflikter mellan människor och vargar. Vissa bönder oroar sig för sina djur, medan andra vill skydda vargen som en viktig del av naturen. Diskussionen handlar ofta om hur man ska hitta en balans mellan olika intressen. För renskötande samer är frågan särskilt konkret, eftersom renar rör sig fritt över stora områden och är svåra att skydda med stängsel.

Frågan om hur många vargar Sverige ska ha avgörs politiskt, och licensjakt har återkommande prövats i domstol. Att den som drabbas av ett angrepp sällan är samma person som fattar besluten är en del av det som gör konflikten svårlöst.

Vargen spelar en viktig roll i ekosystemet. Genom att jaga vissa djur hjälper den till att hålla naturen i balans. Utan rovdjur kan vissa arter bli för många och påverka miljön negativt. I Yellowstone i USA, dit vargen återinfördes på 1990-talet, förändrades betesmönstren hos hjortdjuren så mycket att växtligheten längs vattendragen växte tillbaka.

Risken för människor är däremot mycket liten. Vargar undviker i regel människor, och angrepp är sällsynta i Sverige. Rädslan är ändå verklig för många, och den behöver tas på allvar även när sannolikheten är låg.`,
  questions: [
    { type: 'inferens', q: 'Varför stämmer bilden av ständig kamp om rangordningen dåligt?',
      options: ['För att vargar sällan möter andra flockar i naturen', 'För att flocken oftast är en familj med föräldrar och ungar', 'För att ledaren byts ut varje år genom naturligt urval', 'För att forskare numera inte kan följa flockar i det fria'], correct: 1 },
    { type: 'literal', q: 'Vad visar undersökningar om vargarnas jakt?',
      options: ['Att de nästan alltid lyckas när de jagar i flock', 'Att de bara jagar under vinterhalvåret', 'Att de misslyckas ofta och tar försvagade djur', 'Att de föredrar mindre byten framför älg'], correct: 2 },
    { type: 'inferens', q: 'Varför är inaveln ett så svårt problem för den svenska vargstammen?',
      options: ['För att vargarna vandrar tillbaka österut varje vinter', 'För att jakten riktas mot de starkaste individerna', 'För att fjällmiljön är för karg för stora flockar', 'För att hela stammen härstammar från ett fåtal djur'], correct: 3 },
    { type: 'literal', q: 'Varför är frågan särskilt konkret för renskötande samer?',
      options: ['För att renar rör sig fritt och är svåra att skydda', 'För att vargen jagar uteslutande i renbetesland', 'För att samerna saknar rätt att söka ersättning', 'För att renarna hålls inomhus under vinterhalvåret'], correct: 0 },
    { type: 'inferens', q: 'Vad visar exemplet från Yellowstone?',
      options: ['Att vargar sprider sig snabbt när de får möjlighet', 'Att ett rovdjur kan påverka även växtligheten i ett område', 'Att återinförda djur sällan överlever någon längre tid', 'Att hjortdjur trivs bättre i områden helt utan rovdjur'], correct: 1 },
    { type: 'sammanfatta', q: 'Vilken hållning till vargfrågan har texten?',
      options: ['Att vargstammen bör växa så mycket som möjligt', 'Att konflikten löses enklast genom mer licensjakt', 'Att både vargens roll och människors oro har giltiga skäl', 'Att frågan är övervärderad eftersom vargarna är så få'], correct: 2 },
  ],
},

// ── åk 8, 152 → ~550 ord ────────────────────────────────────────────────
'ak8-tema-020': {
  text: `I dagens samhälle spelar digitala medier en stor roll i ungas liv. Många använder sociala plattformar dagligen för att kommunicera, dela innehåll och hålla kontakt med vänner. Detta kan ha både positiva och negativa effekter på hälsan.

En fördel är att unga kan hitta gemenskap och stöd online. Personer som känner sig ensamma kan hitta andra med liknande intressen eller erfarenheter. För den som är ensam om något på sin ort kan nätet vara skillnaden mellan att känna sig udda och att förstå att man inte är det.

Samtidigt kan ständig uppkoppling skapa stress och press att vara tillgänglig. När meddelanden visar att de lästs uppstår en förväntan om snabbt svar, och det som borde vara ett val blir en skyldighet.

Forskning visar att jämförelse med andra på sociala medier kan påverka självkänslan negativt. Bilder och inlägg visar ofta en idealiserad bild av verkligheten, vilket kan leda till känslor av otillräcklighet. Det man jämför sig med är dessutom sällan en person, utan en sammanställning av tusentals människors bästa ögonblick.

Forskningsläget är däremot mer omtvistat än rubrikerna antyder. Många studier visar samband mellan skärmtid och nedstämdhet, men ett samband säger inte i vilken riktning det går: den som mår dåligt kanske söker sig till mobilen snarare än tvärtom. Effekternas storlek är också omdiskuterad, och flera forskare menar att sömn och rörelse spelar större roll än själva skärmtiden.

Ett mer användbart sätt att tänka är att skilja på hur plattformarna används. Att aktivt skriva med vänner ger sällan samma negativa effekter som att passivt skrolla genom andras liv utan att interagera. Det är alltså inte bara antalet minuter som avgör.

Flödena är dessutom byggda för att hålla kvar uppmärksamheten. Algoritmerna väljer ut det som fått flest att stanna, inte det som är mest sant eller nyttigt. Ett innehåll som väcker starka känslor sprids därför lättare än ett som är balanserat.

De flesta plattformar har en åldersgräns på tretton år, men den kontrolleras sällan och många börjar långt tidigare. En tolvåring möter då ett flöde som utformats för vuxna, utan att ha vare sig erfarenheten eller stödet att tolka det. Samtidigt är det svårt att stå utanför när alla i klassen finns där, och den som väljer bort plattformarna riskerar att missa både skämt och inbjudningar.

Sömnen är en av de tydligaste kopplingarna. Att sitta uppe sent påverkar både hur länge och hur bra man sover, och sömnbrist försämrar i sin tur humör och koncentration dagen efter. Här är forskningen mer entydig än på många andra punkter.

Nätet kan också vara en plats där kränkningar följer med hem. Till skillnad från en konflikt på skolgården tar den inte slut vid skoldagens slut, och den kan spridas till fler och sparas kvar.

Det är viktigt att utveckla en medveten användning av digitala medier. Att ta pauser, begränsa skärmtid och reflektera över innehållet man tar del av kan bidra till bättre välmående. Konkreta åtgärder som att lämna mobilen utanför sovrummet eller stänga av aviseringar visar sig ofta fungera bättre än en allmän föresats om att använda den mindre.

Skola och vuxna har en viktig roll i att stödja unga i att navigera den digitala världen på ett hälsosamt sätt. Den rollen handlar mindre om förbud än om att prata om vad man möter, och att göra det innan något går snett.`,
  questions: [
    { type: 'inferens', q: 'Varför räcker det inte att konstatera ett samband mellan skärmtid och nedstämdhet?',
      options: ['För att sambandet bara gäller vissa åldersgrupper', 'För att sambandet inte visar i vilken riktning påverkan går', 'För att studierna sällan omfattar tillräckligt många deltagare', 'För att skärmtid är svårt att mäta med någon säkerhet'], correct: 1 },
    { type: 'literal', q: 'Vilken skillnad lyfter texten fram som mer användbar än antalet minuter?',
      options: ['Skillnaden mellan att använda mobil och dator', 'Skillnaden mellan förmiddag och kväll', 'Skillnaden mellan aktivt umgänge och passiv skrollning', 'Skillnaden mellan offentliga och privata konton'], correct: 2 },
    { type: 'inferens', q: 'Varför sprids innehåll som väcker starka känslor lättare?',
      options: ['För att sådant innehåll oftast är lättare att förstå', 'För att plattformarna prioriterar nyproducerat material', 'För att användarna delar mer på kvällar och helger', 'För att algoritmerna väljer ut det som får flest att stanna kvar'], correct: 3 },
    { type: 'literal', q: 'På vilken punkt beskriver texten forskningen som mer entydig?',
      options: ['Kopplingen mellan sena kvällar och försämrad sömn', 'Sambandet mellan antal följare och självkänsla', 'Effekten av att helt avstå från sociala medier', 'Skillnaden mellan olika plattformars påverkan'], correct: 0 },
    { type: 'inferens', q: 'Varför beskrivs kränkningar på nätet som annorlunda än på skolgården?',
      options: ['För att de sällan får några konsekvenser för den som utför dem', 'För att de tar inte slut vid skoldagens slut och sparas kvar', 'För att de nästan alltid begås av personer man inte känner', 'För att de är svårare för skolan att upptäcka i tid'], correct: 1 },
    { type: 'sammanfatta', q: 'Vilken hållning intar texten till frågan?',
      options: ['Att sociala medier bör undvikas helt under skolåren', 'Att oron är överdriven eftersom forskningen är osäker', 'Att bilden är sammansatt och att hur man använder plattformarna spelar roll', 'Att ansvaret helt ligger hos plattformarnas utvecklare'], correct: 2 },
  ],
},

// ── åk 8, 152 → ~550 ord ────────────────────────────────────────────────
'ak8-tema-002-c': {
  text: `Båtar har spelat en avgörande roll i människans historia. Redan under forntiden byggdes enkla farkoster av trä, vass och djurhudar. Dessa användes för fiske, transport och handel. Med tiden utvecklades tekniken och båtar blev större och mer avancerade.

Ett tidigt genombrott var att gå från urholkade stockar till skrov byggda av sammanfogade plankor. Det gjorde det möjligt att bygga båtar större än det största trädet, vilket i sin tur ökade hur mycket last de kunde bära.

Under medeltiden började man bygga segelbåtar som kunde färdas långa sträckor över hav. Detta gjorde det möjligt att utforska nya delar av världen och etablera handelsvägar. Segel innebar också att besättningen kunde vara mindre: en roddbåt kräver många armar, medan ett segelfartyg utnyttjar vinden.

Nordiska skeppsbyggare bidrog med en egen lösning. Genom att låta plankorna överlappa varandra, så kallad klinkbyggnad, blev skroven både lätta och följsamma i sjön. Skeppen kunde segla över öppet hav och samtidigt ta sig långt upp i grunda floder, vilket gav dem en räckvidd som få samtida fartyg hade.

Navigationen utvecklades parallellt. Kompassen, som nådde Europa under medeltiden, gjorde det möjligt att hålla kurs även när solen och stjärnorna var skymda. Tillsammans med bättre kartor och instrument för att mäta latitud gjorde den långa resor över öppet hav mindre riskabla.

De upptäcktsresor som följde brukar skildras som äventyr, men de innebar också att europeiska stater erövrade områden, tvingade befolkningar under sig och byggde upp en omfattande slavhandel över Atlanten. Fartygen var förutsättningen för båda sidorna av den utvecklingen.

Senare kom ångdrivna fartyg, vilket revolutionerade sjöfarten genom att göra resor mer pålitliga. Ett ångfartyg var inte beroende av vinden och kunde därför följa en tidtabell. Ungefär samtidigt ersattes trä av järn och stål, vilket gjorde skroven starkare och fartygen betydligt större.

Livet ombord var länge hårt och farligt. Besättningar kunde vara ute i månader med dålig kost, och skörbjugg tog fler liv än stormarna. Först när sambandet mellan färsk föda och sjukdomen förstods minskade dödligheten. I dag regleras arbetstid, utbildning och säkerhetsutrustning av internationella regler, men många sjömän arbetar fortfarande långa perioder långt hemifrån.

Idag finns många olika typer av båtar, från små fritidsbåtar till stora containerfartyg. Modern teknik har gjort dem säkrare och mer effektiva.

Den kanske största förändringen under 1900-talet var containern. Genom att enas om en standardstorlek kunde last flyttas mellan fartyg, tåg och lastbil utan att packas om. Hamnarbetet som tidigare tagit dagar kunde göras på timmar, och kostnaden för att frakta varor sjönk så kraftigt att det blev möjligt att tillverka i ett land och sälja i ett annat. Omkring nio tiondelar av världshandeln går i dag på köl.

Samtidigt har miljöfrågor blivit allt viktigare. Utsläpp från fartyg påverkar hav och klimat. Fartygsbränsle har historiskt varit av låg kvalitet och innehållit mycket svavel, vilket bidragit till luftföroreningar och försurning. Internationella regler har på senare år skärpt kraven.

Forskare arbetar därför med att utveckla mer miljövänliga lösningar, som eldrivna båtar och alternativa bränslen. Batterier fungerar bra på korta sträckor, till exempel för färjor, men räcker inte för fartyg som ska korsa ett hav. Där prövas i stället bränslen som metanol och ammoniak, och några rederier har börjat sätta upp segel som komplement för att spara bränsle.

Båtar fortsätter att vara en central del av transport och handel, men framtiden kräver nya lösningar.`,
  questions: [
    { type: 'literal', q: 'Vad möjliggjorde övergången från urholkade stockar till plankbyggda skrov?',
      options: ['Att båtarna kunde bli större än det största trädet', 'Att båtarna blev betydligt lättare att ro', 'Att båtarna kunde byggas helt utan verktyg', 'Att båtarna klarade sig utan segel'], correct: 0 },
    { type: 'inferens', q: 'Varför innebar seglet att besättningen kunde vara mindre?',
      options: ['För att fartygen blev kortare och krävde färre händer', 'För att vinden ersatte det arbete rodden krävde', 'För att seglen sköttes automatiskt av linor', 'För att resorna blev kortare med segel'], correct: 1 },
    { type: 'inferens', q: 'Varför nämner texten slavhandeln i samband med upptäcktsresorna?',
      options: ['För att förklara varför fartygen byggdes större', 'För att visa hur navigationen förbättrades', 'För att fartygen var förutsättningen även för den sidan av utvecklingen', 'För att slavhandeln finansierade de första ångfartygen'], correct: 2 },
    { type: 'literal', q: 'Vilken effekt fick containern enligt texten?',
      options: ['Fartygen kunde byggas med mindre besättning', 'Hamnarna kunde flyttas närmare städernas centrum', 'Bränsleförbrukningen per ton sjönk kraftigt', 'Lasten kunde flyttas mellan transportslag utan ompackning'], correct: 3 },
    { type: 'inferens', q: 'Varför räcker inte batterier för fartyg som ska korsa ett hav?',
      options: ['För att saltvatten skadar batterierna på sikt', 'För att de inte rymmer tillräckligt med energi för sträckan', 'För att laddning kräver hamnar som ännu saknas', 'För att batterier väger mer än fartygen tål'], correct: 1 },
    { type: 'sammanfatta', q: 'Vad är textens huvudlinje?',
      options: ['Att sjöfarten borde ersättas av transport på land och i luft', 'Att båtens utveckling i huvudsak drivits av krig', 'Att containern var den enda betydelsefulla förändringen', 'Att båten format handeln men nu står inför en omställning'], correct: 3 },
  ],
},

// ── åk 8, 153 → ~550 ord ────────────────────────────────────────────────
'ak8-tema-005-c': {
  text: `Leila och Robin diskuterade hur olika intressen påverkar människors identitet. Leila var intresserad av smink och följde flera kreatörer på nätet. Hon såg smink som ett sätt att uttrycka känslor och stil. Robin däremot var mer intresserad av bilar och teknik. Hen gillade att förstå hur motorer fungerar och följde utvecklingen av elbilar.

Samtalet började med en irritation. Leila hade hört någon säga att hennes intresse var ytligt, medan Robins ansågs handla om riktig kunskap. Hon påpekade att båda kräver att man lär sig fackord, följer utvecklingen och tränar upp ett öga för detaljer. Robin höll med, och kom på att hen aldrig behövt försvara sitt intresse på samma sätt.

De märkte att förväntningarna ofta hänger ihop med kön. Ett intresse som förknippas med tjejer beskrivs lättare som ett tidsfördriv, medan ett som förknippas med killar beskrivs som en kunskap. Ingen av dem tyckte att uppdelningen stämde med hur det faktiskt kändes.

Samtalet mellan dem visade att intressen kan vara väldigt olika, men ändå lika viktiga. De började jämföra hur deras intressen påverkades av samhället. Leila märkte att skönhetsideal ofta styrs av trender, medan Robin såg hur teknik påverkas av innovation och miljökrav.

Båda upptäckte att de blev sålda till. I Leilas flöde dök produkter upp som lovade att lösa problem hon inte visste att hon hade. I Robins dök nya modeller upp som fick förra årets att verka omoderna trots att den fungerade lika bra. Det var samma mekanism i olika förpackning.

Redigerade bilder kom också upp. Leila berättade att hon länge jämfört sig med ansikten som var utjämnade i efterhand, och att det tog tid att förstå att förlagan inte fanns. Robin kände igen det från bilbilder tagna i perfekt ljus på en tom väg, långt från hur en bil ser ut en regnig tisdag.

De prövade att byta plats i samtalet. Leila fick förklara varför en elmotor ger vridmoment direkt, och Robin fick beskriva skillnaden mellan två foundationer som för hen såg identiska ut. Båda märkte hur snabbt det man inte kan framstår som obegripligt, och hur lätt det är att kalla det oviktigt i stället för att erkänna att man inte förstår.

De insåg också att båda deras intressen kunde kopplas till större frågor. Sminkindustrin diskuterar hållbarhet och djurtester, medan bilindustrin arbetar med klimatpåverkan och framtida lösningar. Båda branscherna svarade dessutom likartat på kritik: med löften om förbättring och nya märkningar som var svåra att kontrollera.

Till slut kom de fram till att identitet inte handlar om ett enda intresse. Det är en kombination av erfarenheter, värderingar och val. Leila sa att hon var mer än sitt smink, och Robin att hen inte ville bli beskriven som enbart teknikintresserad.

De pratade också om pengar. Leila sparade till en palett som kostade mer än hon ville säga högt, och Robin visste exakt vad en begagnad motor gick för. Ingen av dem tyckte att priset avgjorde hur mycket intresset betydde.

De pratade också om att identitet förändras. Det man brann för vid tolv års ålder är sällan detsamma som vid arton, och det betyder inte att man var ytlig då eller är det nu.

Samtalet gjorde att de förstod varandra bättre och uppskattade sina olikheter. Robin sa efteråt att hen lärt sig mest av att inse att frågorna bakom deras intressen var desamma, även om svaren såg olika ut.`,
  questions: [
    { type: 'literal', q: 'Vad startade samtalet mellan Leila och Robin?',
      options: ['En skoluppgift om identitet och intressen', 'En irritation över att hennes intresse kallats ytligt', 'Ett bråk om vilket intresse som kostade mest', 'En film de sett tillsammans i klassen'], correct: 1 },
    { type: 'inferens', q: 'Vad insåg Robin om sitt eget intresse under samtalet?',
      options: ['Att det egentligen var mindre kunskapskrävande än Leilas', 'Att hen tappat intresset för elbilar med tiden', 'Att hen aldrig behövt försvara det på samma sätt', 'Att det borde bytas mot något mer användbart'], correct: 2 },
    { type: 'inferens', q: 'Vad menar texten med att det var "samma mekanism i olika förpackning"?',
      options: ['Att båda branscherna ägs av samma stora företag', 'Att produkterna tillverkas på liknande sätt', 'Att båda intressena kräver lika mycket pengar', 'Att båda sålde genom att skapa ett behov som inte fanns'], correct: 3 },
    { type: 'literal', q: 'Vad kände Robin igen i Leilas erfarenhet av redigerade bilder?',
      options: ['Bilbilder tagna i perfekt ljus, långt från verkligheten', 'Att bilar sällan ser ut som på bilderna i verkligheten', 'Att reklamen ofta riktar sig till fel åldersgrupp', 'Att bilder på nätet sällan visar vem som tagit dem'], correct: 0 },
    { type: 'inferens', q: 'Varför nämner texten att de båda branscherna svarade likartat på kritik?',
      options: ['För att visa att kritiken sällan är befogad', 'För att peka på ett mönster som gäller bortom det enskilda intresset', 'För att förklara varför märkningar är lagstadgade', 'För att jämföra vilken bransch som förbättrats mest'], correct: 1 },
    { type: 'sammanfatta', q: 'Vad är samtalets viktigaste slutsats?',
      options: ['Att vissa intressen faktiskt är djupare än andra', 'Att man bör byta intresse när man blir äldre', 'Att identitet består av flera delar och förändras över tid', 'Att reklam bör förbjudas i flöden riktade till unga'], correct: 2 },
  ],
},

// ── åk 10, 153 → ~605 ord ───────────────────────────────────────────────
'akgy-mj-004': {
  text: `Michael Jacksons scenframträdanden var en central del av hans konstnärskap. Han kombinerade musik, dans och visuella effekter på ett sätt som förändrade publikens förväntningar på liveuppträdanden. Hans konserter var noggrant planerade och innehöll avancerad koreografi.

En av hans mest kända rörelser var "moonwalk", som gav illusionen av att han gled bakåt medan han rörde sig framåt. Denna rörelse blev snabbt en symbol för hans stil och kopierades av dansare världen över. Genombrottet kom under ett tv-sänt jubileumsprogram 1983, där han utförde rörelsen inför en stor publik. Dagen efter försökte ungdomar över hela världen härma den.

Rörelsen var dock inte hans egen uppfinning. Den hade utvecklats av gatudansare och visats i tv av andra artister tidigare. Jackson lärde sig den av dansare han bjöd hem, övade i veckor och gjorde den till sin genom hur han placerade den. Det säger något om hans arbetssätt: han hämtade in, förfinade och satte in i ett sammanhang där rörelsen fick maximal verkan.

Jackson inspirerades av olika dansstilar, inklusive streetdance och klassisk scenkonst. Genom att kombinera dessa skapade han ett unikt uttryck. Från musikalfilmen hämtade han hattar, precisa handrörelser och plötsliga stopp mitt i en rörelse. Från gatans dans hämtade han isolationer, där en kroppsdel rör sig medan resten står stilla.

Hans förmåga att använda kroppen som ett instrument gjorde honom till en av de mest inflytelserika dansarna inom populärkulturen. Ett kännetecken var att rörelserna följde musiken så exakt att de fungerade som ett eget slagverk. En knäpp med fingrarna eller ett stopp kunde markera en betoning lika tydligt som ett trumslag.

Musikvideon blev ett annat verktyg. Med "Thriller" gjordes en video som var närmare en kortfilm än en reklamsnutt, med regissör, manus och en längd som inget musikprogram egentligen hade plats för. Att kanaler ändå sände den bidrog till att flytta gränsen för vad formen kunde vara, och senare artister har byggt vidare på den öppningen.

Teknik spelade också en viktig roll i hans framträdanden. Ljus, scenografi och specialeffekter användes för att förstärka upplevelsen. Detta bidrog till att skapa en helhetsupplevelse för publiken. Han använde också illusioner som byggde på dolda mekanismer, exempelvis en lutning framåt som verkade omöjlig men som möjliggjordes av skor med fäste i scengolvet.

Arbetssättet byggde på hård repetition. Turnéerna sattes upp som teaterproduktioner med veckor av genomgångar, och varje ljusskifte och kameravinkel var bestämd i förväg. Den nivån av planering var ovanlig i populärmusiken och blev en förebild för de stora arenaturnéer som följde.

Samtidigt driver det upp kostnaderna. När publiken vant sig vid scenografi, dansare och effekter blir det svårt för mindre artister att konkurrera på samma villkor, och en turné kan bli en ekonomisk risk snarare än en inkomst.

Kroppen betalade ett pris. Att upprepa samma rörelser genom tusentals repetitioner sliter på knän och rygg, och Jackson dansade i skor och på underlag som inte var byggda för det. Skador och smärta hörde till yrket långt innan det talades öppet om saken.

Arvet syns tydligast hos dem som kom efter. Dagens stora popartister uppträder med koreograferade grupper, berättande sceniska partier och video som en del av helheten, ett format som knappast fanns innan Jackson visade att det gick att bära upp. Även kritiken mot formatet, att showen kan tränga undan musiken, är ett arv från samma utveckling.

Att skriva om Jackson är i dag komplicerat. Anklagelser om övergrepp mot barn har prövats i domstol och diskuterats offentligt i decennier, och för många är det omöjligt att se framträdandena skilt från det. Andra menar att verket kan bedömas för sig. Frågan om hur man förhåller sig till konst av personer vars handlingar är omstridda har inget enkelt svar, men den går inte att kringgå.

Texten visar hur Jacksons arbete inom dans och scenkonst bidrog till att förändra hur artister uppträder live.`,
  questions: [
    { type: 'inferens', q: 'Vad säger texten om att moonwalken inte var Jacksons egen uppfinning?',
      options: ['Att hans rykte som dansare därför är överdrivet', 'Att rörelsen egentligen tillhör en annan artist juridiskt', 'Att hans styrka låg i att hämta in, förfina och placera rätt', 'Att gatudansarna aldrig fick någon uppmärksamhet alls'], correct: 2 },
    { type: 'literal', q: 'Vad hämtade Jackson från gatans dans?',
      options: ['Isolationer, där en kroppsdel rör sig medan resten står stilla', 'Hattar och precisa handrörelser', 'Plötsliga stopp mitt i en rörelse', 'Samspelet mellan flera dansare i formation'], correct: 0 },
    { type: 'inferens', q: 'Vad menas med att rörelserna fungerade som ett eget slagverk?',
      options: ['Att han spelade trummor samtidigt som han dansade', 'Att rörelserna markerade betoningar lika tydligt som trumslag', 'Att musiken spelades in efter att dansen filmats', 'Att han använde stegen för att hålla takten åt bandet'], correct: 1 },
    { type: 'literal', q: 'Varför var "Thriller" betydelsefull som musikvideo?',
      options: ['Den var den första videon som sändes i färg', 'Den spelades in helt utan redigering i efterhand', 'Den var närmare en kortfilm och flyttade gränsen för formen', 'Den innehöll för första gången dansare i bakgrunden'], correct: 2 },
    { type: 'inferens', q: 'Vilken följd av den höjda ambitionsnivån pekar texten på?',
      options: ['Att publiken tröttnade på storslagna föreställningar', 'Att artister slutade turnera och satsade på studioarbete', 'Att koreografi blev viktigare än själva musiken', 'Att kostnaderna gör det svårare för mindre artister att konkurrera'], correct: 3 },
    { type: 'forfattarens-syfte', q: 'Hur hanterar texten frågan om anklagelserna mot Jackson?',
      options: ['Den avfärdar dem som obekräftade rykten', 'Den slår fast att verket bör bedömas helt skilt från personen', 'Den redovisar att frågan är omstridd och saknar enkelt svar', 'Den undviker ämnet för att hålla fokus på dansen'], correct: 2 },
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
