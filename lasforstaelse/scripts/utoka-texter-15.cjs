#!/usr/bin/env node
//
// Sats 15: fem texter i intervallet 204–216 ord, med omskrivna frågor.
// ak8-tema-022 får dessutom en egen titel — den delade titel med ak8-tema-016
// i samma årskurs, vilket gjorde dem omöjliga att skilja åt i biblioteket.

const fs = require('fs');
const path = require('path');

const NYA = {

// ── åk 8, 204 → ~550 ord ────────────────────────────────────────────────
'ak8-tema-022': {
  title: 'Klimaträttvisa och ungas engagemang',
  text: `Klimatförändringar är en av de största utmaningarna världen står inför idag. De orsakas främst av ökade utsläpp av växthusgaser, som koldioxid, från mänskliga aktiviteter. Dessa utsläpp kommer bland annat från transporter, industri och energiproduktion. När mängden växthusgaser ökar, stiger jordens temperatur.

Konsekvenserna av klimatförändringarna märks redan. Glaciärer smälter, havsnivåer stiger och extremväder som värmeböljor och kraftiga stormar blir vanligare. Detta påverkar både naturen och människor. I vissa områden blir det svårare att odla mat, vilket kan leda till brist och konflikter.

Samtidigt finns det möjligheter att minska problemen. Genom att använda förnybar energi, som sol och vind, kan utsläppen minska. Även små förändringar i vardagen kan göra skillnad, till exempel att cykla istället för att åka bil eller att minska matsvinn.

Ansvar är en viktig del av lösningen. Det handlar både om individuella val och politiska beslut. Länder samarbetar genom internationella avtal för att begränsa utsläppen, men det krävs att dessa följs.

Frågan om vem som bär ansvaret är dock inte enkel. Ett sätt att räkna är att titta på utsläppen i dag, ett annat att titta på hur mycket ett land släppt ut sedan industrialiseringen började. De två sätten ger helt olika svar. Ett tredje sätt är att räkna per invånare i stället för per land, vilket ändrar bilden igen. Vilket mått man väljer avgör i praktiken vem som framstår som skyldig.

Ett fjärde sätt är att räkna det som konsumeras i stället för det som produceras. En tröja som sytts i ett land och bärs i ett annat ger utsläpp i tillverkningslandets statistik, trots att det är någon annan som köpt den. Rika länder som flyttat ut sin industri ser därför bättre ut i statistiken än de kanske borde.

Ett återkommande argument är att det inte spelar någon roll vad Sverige gör, eftersom landet står för en mycket liten del av världens utsläpp. Motargumentet är att samma resonemang går att föra i nästan alla länder, eftersom väldigt få står för en stor andel var för sig. Om alla små bidrag räknas bort blir det ingenting kvar att minska. Att ett litet land ändå kan visa att omställningen är möjlig brukar också nämnas.

Många unga engagerar sig idag i klimatfrågan. De deltar i demonstrationer och sprider kunskap. Detta visar att förändring är möjlig, men att det kräver engagemang från alla nivåer i samhället.

Den globala skolstrejksrörelsen som växte fram från 2018 samlade miljontals deltagare i över hundra länder. Kritiken mot den handlade ofta om att elever inte borde skolka, medan deltagarna svarade att en utbildning inför en framtid som ingen planerar för är ett märkligt argument. Rörelsen ändrade inte lagarna direkt, men den flyttade frågan högt upp på dagordningen under några år.

Klimatfrågan har också hamnat i domstol. I flera länder har enskilda och organisationer stämt sin egen stat för att den inte gjort tillräckligt, och i vissa fall har de vunnit. Domstolarna har då slagit fast att staten har en skyldighet att skydda invånarnas liv och hälsa, och att den skyldigheten också gäller klimatet.

Många unga beskriver dessutom oro inför framtiden. Att känna så är rimligt, men forskning tyder på att den som gör något tillsammans med andra mår bättre än den som bara följer nyheterna.

Klimatfrågan handlar inte bara om miljö, utan också om rättvisa. De som påverkas mest är ofta de som bidragit minst till problemet.`,
  questions: [
    { type: 'inferens', q: 'Varför ger olika sätt att räkna utsläpp olika svar på ansvarsfrågan?',
      options: ['För att mätningarna görs med olika sorters utrustning', 'För att vissa länder inte redovisar sina siffror alls', 'För att man kan räkna per år, historiskt eller per invånare', 'För att utsläppen varierar mellan olika årstider'], correct: 2 },
    { type: 'literal', q: 'Vad innebär det att räkna konsumtion i stället för produktion?',
      options: ['Att utsläppen räknas där varan används', 'Att bara inhemskt tillverkade varor räknas med', 'Att transporterna räknas för sig i statistiken', 'Att endast företag behöver redovisa sina utsläpp'], correct: 0 },
    { type: 'inferens', q: 'Varför ser rika länder bättre ut i statistiken än de kanske borde?',
      options: ['För att de har infört betydligt fler miljölagar', 'För att de flyttat ut sin industri till andra länder', 'För att de mäter under en kortare tidsperiod', 'För att de köper utsläppsrätter av andra länder'], correct: 1 },
    { type: 'literal', q: 'Vad svarade deltagarna i skolstrejkerna på kritiken?',
      options: ['Att de tog igen skolarbetet på kvällarna i stället', 'Att strejkerna bara ägde rum på fredagar', 'Att lärarna hade godkänt deras frånvaro i förväg', 'Att utbildning inför en framtid ingen planerar för är märkligt'], correct: 3 },
    { type: 'literal', q: 'Vad har domstolar slagit fast i klimatmål mot stater?',
      options: ['Att staten måste skydda invånarnas liv och hälsa', 'Att företagen bär hela ansvaret för utsläppen', 'Att internationella avtal går före nationell lag', 'Att enskilda inte har rätt att stämma sin egen stat'], correct: 0 },
    { type: 'sammanfatta', q: 'Vad säger forskningen om klimatoro?',
      options: ['Att den drabbar främst dem som läser mest nyheter', 'Att den som gör något tillsammans med andra mår bättre', 'Att oron minskar när man lär sig mer om ämnet', 'Att den bör behandlas på samma sätt som annan ångest'], correct: 1 },
  ],
},

// ── åk 9, 206 → ~580 ord ────────────────────────────────────────────────
'ak10-arsenal-002': {
  text: `Arsenal har länge varit kända för sin tekniska och offensiva spelstil. Denna filosofi blev särskilt tydlig under Arsène Wengers tid som tränare. Istället för att fokusera på fysisk styrka och långa bollar betonade Wenger kortpassningsspel, rörelse utan boll och kreativitet.

När Wenger kom till England 1996 var han i det närmaste okänd, och tidningarna undrade högt vem han var. Det han förde med sig var inte bara en spelidé. Han ändrade vad spelarna åt, hur de stretchade, hur länge de tränade och hur mycket de fick dricka efter matcherna. Flera av de spelare som var med har senare berättat att förändringen kändes chockerande i början och självklar efter ett år.

Han hämtade också spelare från länder som engelska klubbar dittills sällan tittat på. Att köpa en okänd fransk mittfältare för en liten summa och se honom bli en av ligans bästa blev något av ett kännetecken, och andra klubbar följde efter. Det som var ovanligt på 1990-talet är i dag hur alla arbetar.

En central del av Arsenals spelidé är att kontrollera matchen genom bollinnehav. Genom att hålla bollen inom laget kan spelarna styra tempot och skapa luckor i motståndarnas försvar. Detta kräver hög teknisk skicklighet och god spelförståelse hos varje spelare.

Bollinnehav är dock inget mål i sig. Ett lag kan ha bollen i sjuttio procent av matchen och ändå knappt komma till avslut, vilket kritiker återkommande påpekat. Poängen med att hålla bollen är att flytta motståndaren: varje passning tvingar någon att förflytta sig, och till slut uppstår ett mellanrum som inte fanns förut. Ett lag som passar utan att flytta någon har bara bollen, inte kontrollen.

Arsenal har också varit kända för att utveckla unga talanger. Klubben har ofta gett unga spelare chansen att spela i A-laget, vilket både kan innebära risker och möjligheter. Denna strategi har ibland kritiserats, särskilt när laget inte nått de högsta resultaten, men den har också lett till att många spelare utvecklats till stjärnor.

En återkommande invändning mot den offensiva idén var att laget blev sårbart. Ett lag som skickar många spelare framåt har färre kvar bakom, och mot motståndare som väntade och kontrade blev det dyrt. Att hitta balansen mellan att våga och att stå emot är en av fotbollens äldsta frågor, och den har inget slutgiltigt svar.

Under senare år har klubben försökt balansera sin traditionella spelstil med en mer pragmatisk approach. Detta innebär att laget ibland anpassar sitt spel beroende på motstånd och situation. Kombinationen av kreativitet och struktur har blivit allt viktigare i modern fotboll.

Modern fotboll har dessutom flyttat en del av arbetet till det som sker när ett lag förlorar bollen. Att pressa högt direkt efter en förlorad boll, i stället för att falla tillbaka, är i dag en central del av de flesta lags spelidé. Det kräver kondition och samordning snarare än teknik, vilket har förändrat vilka egenskaper klubbar letar efter hos spelare.

Spelstilen har dessutom fått ett namn utanför klubben. Uttrycket att spela på Arsenals sätt användes länge som beröm av vissa och som gliring av andra, ungefär i betydelsen vackert men utan titlar. Att laget under säsongen 2003/2004 gick genom hela ligan obesegrat gjorde det svårare att använda gliringen, men den överlevde ändå. Ryktet om en klubb sitter alltså i längre än de resultat som skapade det.

Arsenals filosofi handlar alltså inte bara om hur laget spelar, utan också om hur klubben ser på utveckling, lagarbete och långsiktighet. Det är denna helhetssyn som gör Arsenal till en unik klubb inom fotbollsvärlden.`,
  questions: [
    { type: 'literal', q: 'Vad förändrade Wenger utöver själva spelidén?',
      options: ['Vad spelarna åt och hur de tränade', 'Klubbens ekonomiska planering på lång sikt', 'Arenans utformning och placering i staden', 'Hur biljetterna såldes till supportrarna'], correct: 0 },
    { type: 'inferens', q: 'Varför var Wengers sätt att värva ovanligt bara under en period?',
      options: ['För att spelarna blev alltför dyra med åren', 'För att andra klubbar snart började arbeta likadant', 'För att reglerna för värvningar ändrades i grunden', 'För att franska spelare slutade söka sig till England'], correct: 1 },
    { type: 'inferens', q: 'Vad menas med att ett lag kan ha bollen utan att ha kontrollen?',
      options: ['Att bollinnehavet mäts på ett missvisande sätt', 'Att laget spelar för långsamt för att hinna avsluta', 'Att passningarna inte tvingar motståndaren att flytta sig', 'Att motståndaren väljer att stå kvar i sitt straffområde'], correct: 2 },
    { type: 'literal', q: 'Vilken invändning fanns mot den offensiva spelidén?',
      options: ['Att den gjorde matcherna tråkiga att se på', 'Att den krävde för många unga spelare i laget', 'Att den passade dåligt på tunga underlag', 'Att laget blev sårbart för kontringar'], correct: 3 },
    { type: 'literal', q: 'Vad har blivit en central del av de flesta lags spelidé i dag?',
      options: ['Att pressa högt direkt efter en förlorad boll', 'Att slå långa bollar mot en fysiskt stark anfallare', 'Att byta spelare betydligt oftare under matcherna', 'Att låta målvakten delta aktivt i uppspelet'], correct: 0 },
    { type: 'sammanfatta', q: 'Vad säger texten om balansen mellan att våga och att stå emot?',
      options: ['Att den avgörs av vilka spelare klubben har råd med', 'Att frågan är gammal och saknar slutgiltigt svar', 'Att den löstes när den höga pressen blev vanlig', 'Att den bara gäller lag som satsar på unga spelare'], correct: 1 },
  ],
},

// ── åk 9, 213 → ~580 ord ────────────────────────────────────────────────
'ak10-tema-002-b': {
  text: `Yttrandefrihet är en central del av de mänskliga rättigheterna och innebär att människor har rätt att uttrycka sina tankar, åsikter och idéer. Denna rättighet är viktig i demokratiska samhällen eftersom den gör det möjligt att kritisera makthavare och delta i samhällsdebatten.

En sak som ofta missförstås är vem yttrandefriheten riktar sig mot. Den binder staten. Den innebär att myndigheter inte får straffa någon för vad hen sagt, men den ger ingen rätt att bli publicerad i en tidning, att få stå kvar på en plattform eller att slippa motargument. Att bli emotsagd är alltså inte en inskränkning av yttrandefriheten utan ett exempel på att den fungerar åt båda hållen.

Sverige har en av världens äldsta lagar på området. Tryckfrihetsförordningen från 1766 gjorde myndigheternas handlingar offentliga och gav rätt att trycka kritik utan förhandsgranskning. Offentlighetsprincipen, som betyder att vem som helst kan begära ut handlingar från en myndighet, har sitt ursprung där och är fortfarande ett av de viktigaste verktygen för journalister.

Samtidigt är yttrandefriheten inte helt obegränsad. I många länder finns lagar som förbjuder hatpropaganda, hot eller uppmaningar till våld. Syftet är att skydda andra människors rättigheter och säkerhet.

I svensk lag finns flera sådana gränser. Hets mot folkgrupp gäller uttalanden som hotar eller uttrycker missaktning mot en grupp utifrån till exempel etnicitet, religion eller sexuell läggning. Förtal handlar om att sprida uppgifter som utpekar någon som brottslig eller klandervärd. Olaga hot gäller hot som är ägnade att framkalla allvarlig rädsla. Gemensamt för dem är att de riktar in sig på skada mot människor, inte på att åsikter är obekväma.

Ett återkommande missförstånd gäller ordet censur. Censur i egentlig mening betyder att en myndighet granskar och stoppar något innan det publiceras. Att en text refuseras av en tidning, tas bort av en plattform eller möts av hård kritik är något annat, även om det kan kännas lika obehagligt för den som drabbas.

En svår fråga är var gränsen ska dras. Vissa menar att yttrandefriheten bör vara nästan absolut, medan andra anser att den måste begränsas mer för att skydda utsatta grupper. Denna diskussion är ständigt aktuell, särskilt i takt med att sociala medier blivit en viktig arena för åsiktsutbyte.

Digitala plattformar har förändrat hur information sprids. Det går snabbt att nå många människor, men det innebär också att falsk information kan spridas lätt. Detta kan påverka demokratiska processer och människors uppfattningar.

Plattformarna har dessutom fått en makt som ingen valt dem till. När ett företag bestämmer vilka inlägg som får finnas kvar fattar det beslut som liknar dem en domstol fattar, men utan samma krav på insyn eller möjlighet att överklaga. Att låta bli att moderera är samtidigt inget neutralt val, eftersom det låter den som skriker högst höras mest.

I olika delar av världen ser situationen olika ut. I vissa länder riskerar människor fängelse eller andra straff för att uttrycka kritik mot regeringen. I andra länder är yttrandefriheten starkare skyddad, men debatten om dess gränser fortsätter. Varje år dödas dessutom journalister på grund av sitt arbete, och i de flesta av de fallen döms ingen någonsin för brottet.

I skolan gäller yttrandefriheten också, men med vissa förutsättningar. En elev får uttrycka åsikter, samtidigt som skolan har ett ansvar att ingripa mot kränkningar och att undervisningen ska bygga på vetenskap. Att alla åsikter får framföras betyder alltså inte att alla påståenden väger lika tungt i ett klassrum.

Att förstå yttrandefrihet handlar därför om att balansera olika rättigheter. Det handlar både om individens frihet att uttrycka sig och om samhällets ansvar att skydda människor från skada.`,
  questions: [
    { type: 'inferens', q: 'Varför är det inte en inskränkning av yttrandefriheten att bli emotsagd?',
      options: ['För att motargument sällan når lika många människor', 'För att friheten binder staten och gäller åt båda hållen', 'För att kritik inte räknas som ett yttrande i lagens mening', 'För att den som blir emotsagd alltid kan svara igen'], correct: 1 },
    { type: 'literal', q: 'Vad innebär offentlighetsprincipen?',
      options: ['Att myndigheters möten alltid är öppna för allmänheten', 'Att tidningar får trycka utan att först granskas', 'Att vem som helst kan begära ut handlingar från en myndighet', 'Att alla domar publiceras i sin helhet på nätet'], correct: 2 },
    { type: 'literal', q: 'Vad gäller brottet hets mot folkgrupp?',
      options: ['Uttalanden som hotar eller uttrycker missaktning mot en grupp', 'Uppgifter som utpekar en enskild person som brottslig', 'Hot som är ägnade att framkalla allvarlig rädsla', 'Uppmaningar att delta i olagliga demonstrationer'], correct: 0 },
    { type: 'inferens', q: 'Vad är gemensamt för de svenska gränserna i lagen?',
      options: ['Att de bara gäller det som publiceras i tryckt form', 'Att de infördes ungefär samtidigt under 1900-talet', 'Att de kräver att någon först anmäler saken', 'Att de riktar in sig på skada, inte på obekväma åsikter'], correct: 3 },
    { type: 'inferens', q: 'Varför liknar plattformarnas beslut domstolsbeslut?',
      options: ['För att de avgör vad som får finnas kvar, men utan insyn', 'För att de fattas av jurister anställda av företagen', 'För att de kan överklagas till en nationell myndighet', 'För att de följer samma lagar som domstolarna gör'], correct: 0 },
    { type: 'sammanfatta', q: 'Varför är det inget neutralt val att låta bli att moderera?',
      options: ['För att lagen kräver att plattformar ingriper mot inlägg', 'För att den som skriker högst då hörs mest', 'För att annonsörerna i så fall drar sig ur', 'För att antalet inlägg skulle bli helt ohanterligt'], correct: 1 },
  ],
},

// ── åk 9, 213 → ~580 ord ────────────────────────────────────────────────
'akgy-abba-002': {
  text: `ABBA var inte bara en musikgrupp utan också ett komplext nätverk av personliga relationer. Två av medlemmarna, Agnetha Fältskog och Björn Ulvaeus, var gifta, liksom Benny Andersson och Anni-Frid Lyngstad. Dessa relationer påverkade både gruppens dynamik och deras musikskapande.

Namnet i sig kom från deras förnamn, och gruppen fungerade länge som ett litet familjeföretag. Medlemmarna ägde bolaget tillsammans, turnerade tillsammans och bodde nära varandra. Att arbete och privatliv gick ihop var en styrka så länge det fungerade och ett problem när det slutade göra det.

I början bidrog de nära relationerna till en stark kreativ energi. Medlemmarna kunde arbeta intensivt tillsammans och utveckla idéer snabbt. Björn och Benny skrev majoriteten av låtarna, medan Agnetha och Anni-Frid bidrog med sång och tolkning. Kombinationen av deras olika styrkor skapade ett unikt sound.

Arbetssättet var mer metodiskt än man kan tro. Björn och Benny satte sig i ett litet hus på en ö utanför Stockholm med varsitt instrument och arbetade i veckor, ofta helt utan text. Först när en melodi var färdig skrevs orden, vilket är en av förklaringarna till att texterna följer melodins rörelser så nära. Ibland kastades hela låtar som redan var inspelade.

När relationerna började förändras, särskilt genom skilsmässor, påverkades också gruppens arbete. Trots detta lyckades de fortsätta producera musik av hög kvalitet. Album som The Visitors visar en mer komplex och ibland mörkare ton jämfört med tidigare verk.

Att fortsätta arbeta med sin före detta partner varje dag var samtidigt en ovanlig situation. Medlemmarna har i efterhand beskrivit att de höll isär rollerna genom att vara mycket professionella i studion, och att musiken blev en plats där det gick att uttrycka sådant som inte sades vid köksbordet.

Turnerandet slet också. Gruppen turnerade förhållandevis lite jämfört med andra artister av samma storlek, och en förklaring var att medlemmarna hade små barn hemma. Agnetha var dessutom rädd för att flyga, vilket gjorde långa turnéer plågsamma. Att de valde bort mycket av det som andra tackade ja till bidrog till att de aldrig blev lika närvarande i vissa länder.

Rollerna i gruppen var inte heller jämlika. Björn och Benny skrev, producerade och ägde rättigheterna till låtarna, medan Agnetha och Anni-Frid sjöng dem. Den fördelningen var vanlig i musikbranschen på den tiden, men den innebar att två av fyra hade betydligt mer att säga till om, och den har diskuterats mer i efterhand än den gjorde då.

Många av ABBAs låtar speglar känslor kopplade till relationer, som kärlek, separation och längtan. Detta gör att deras musik ofta upplevs som personlig och genuin. Lyssnare kan känna igen sig i texterna, vilket bidrar till deras långvariga popularitet.

Hur självbiografiska texterna egentligen är har diskuterats i decennier. Medlemmarna har genomgående varit försiktiga med att bekräfta kopplingar, och påpekat att en låt om ett uppbrott inte behöver handla om just deras. Att den som skriver hämtar ur sitt eget liv är samtidigt knappast överraskande, och gränsen mellan erfarenhet och hantverk går sällan att dra skarpt.

Trots interna svårigheter valde gruppen att fortsätta arbeta professionellt tillsammans under flera år. Detta visar på en stark arbetsmoral och respekt för musiken.

Gruppen upplöstes aldrig formellt. De tog en paus 1982 utan att meddela något slut, och pausen blev fyrtio år lång. När de återkom med ny musik 2021 hade de flesta för länge sedan slutat räkna med det.

ABBA är ett exempel på hur personliga relationer både kan stärka och utmana kreativt samarbete. Deras historia visar att konflikter inte nödvändigtvis hindrar konstnärlig utveckling, utan ibland kan bidra till den.`,
  questions: [
    { type: 'literal', q: 'Hur arbetade Björn och Benny med låtarna?',
      options: ['I ett litet hus på en ö, i veckor och ofta utan text', 'Var för sig och skickade idéerna fram och tillbaka', 'Tillsammans med de andra två inne i studion', 'Under turnéerna, i pauserna mellan konserterna'], correct: 0 },
    { type: 'inferens', q: 'Varför följer texterna melodins rörelser så nära?',
      options: ['För att texterna skrevs direkt på engelska', 'För att melodin skrevs färdig innan orden', 'För att låtarna var korta och enkelt byggda', 'För att de sjöngs av två personer samtidigt'], correct: 1 },
    { type: 'inferens', q: 'Hur höll medlemmarna isär rollerna efter skilsmässorna?',
      options: ['De arbetade i skilda studior under en period', 'De lät en producent sköta all kontakt mellan dem', 'De var mycket professionella i studion', 'De slutade turnera tillsammans efter det'], correct: 2 },
    { type: 'inferens', q: 'Varför är frågan om självbiografiska texter svår att avgöra?',
      options: ['För att medlemmarna glömt hur låtarna kom till', 'För att texterna skrevs av flera olika personer', 'För att flera versioner av texterna finns bevarade', 'För att gränsen mellan erfarenhet och hantverk sällan är skarp'], correct: 3 },
    { type: 'literal', q: 'Hur slutade gruppen?',
      options: ['Med en paus 1982 som aldrig meddelades som ett slut', 'Med ett gemensamt uttalande efter The Visitors', 'Med en avskedsturné genom hela Europa', 'Med att två av medlemmarna lämnade först'], correct: 0 },
    { type: 'sammanfatta', q: 'Vad säger texten om relationernas betydelse för arbetet?',
      options: ['Att de gjorde samarbetet omöjligt till slut', 'Att de både stärkte och utmanade det kreativa arbetet', 'Att de saknade egentlig betydelse för musiken', 'Att de förklarar varför gruppen aldrig återförenades'], correct: 1 },
  ],
},

// ── åk 9, 216 → ~580 ord ────────────────────────────────────────────────
'akgy-abba-003': {
  text: `ABBA var kända för sitt innovativa sätt att producera musik, vilket spelade en stor roll i deras framgång. Under 1970-talet utvecklades inspelningsteknik snabbt, och gruppen använde studion som ett kreativt verktyg snarare än bara en plats för inspelning. Producenten och medlemmen Benny Andersson arbetade nära ljudteknikern för att skapa ett fylligt och detaljerat ljud.

Ljudteknikern hette Michael B. Tretow och brukar räknas som en femte medlem när det gäller ljudet. Det var han som prövade ett knep han läst om: att spela in samma instrument två gånger och köra bandet med en aning olika hastighet vid det andra tillfället. Resultatet blev att de två inspelningarna aldrig låg exakt på varandra, och ljudet växte till något betydligt större än vad musikerna faktiskt hade spelat.

En viktig del av ABBA:s sound var användningen av flerspårsinspelning. Det innebar att olika instrument och röster spelades in separat och sedan kombinerades. Detta gjorde det möjligt att skapa komplexa arrangemang med många lager av ljud. Sången spelades ofta in flera gånger för att skapa en rik och harmonisk effekt.

Rösterna var i sig en del av lösningen. Agnetha sjöng ljusare och Anni-Frid mörkare, och när de sjöng samma stämma blev resultatet varken den enas eller den andras röst utan en tredje. Att de dessutom sjöng nästan exakt lika i tajming gjorde att lagren gick ihop utan att låta grumliga, vilket är betydligt svårare än det låter.

Ljudbilden byggdes också av instrument som var ovanliga i popmusik. Benny använde ofta piano tillsammans med marimba, cembalo och tidiga synthesizrar, vilket gav ett klingande och lätt gnistrande ljud i höjdregistret. I flera låtar ligger dessutom en akustisk gitarr med som knappt går att höra ensam men som märks direkt om den tas bort. Sådana lager är vanliga i deras inspelningar: mycket ligger där utan att höras, och gör ändå jobbet.

Gruppen var också noggrann med detaljer. De experimenterade med olika mikrofonplaceringar, ekon och effekter för att få fram rätt känsla i varje låt. Detta bidrog till att deras musik lät modern och professionell, även jämfört med dagens produktioner.

Från 1978 hade de en egen studio, Polar Studios i Stockholm, byggd efter deras egna önskemål. Att äga sin studio innebar att de kunde arbeta utan att räkna timmar, vilket i praktiken betydde att en låt fick ta den tid den behövde. Andra artister hyrde in sig där av samma skäl, och studion blev under några år en av Europas mest anlitade.

Arbetet var också tidskrävande på ett sätt som är svårt att föreställa sig i dag. En enda låt kunde ta veckor, och delar spelades in om gång på gång tills detaljerna satt. Att bandet inte gick att redigera fritt betydde att en misslyckad tagning måste göras helt på nytt, vilket satte press på musikerna men också höjde nivån.

ABBA:s arbete i studion påverkade hur popmusik produceras idag. Många moderna producenter använder liknande tekniker, även om tekniken har utvecklats digitalt.

Skillnaden mot i dag är främst hur enkelt det har blivit. Det som krävde ett bandbord, stort tålamod och en teknikers hela kunnande går nu att göra i ett program på en bärbar dator. Att verktygen blivit tillgängliga betyder dock inte att resultatet blir detsamma. Det som gör inspelningarna hållbara är besluten, inte utrustningen.

Deras fokus på kvalitet och innovation gjorde att deras musik stack ut i en tid då många artister spelade in mer direkt och enklare. ABBA visade att studion kunde vara ett instrument i sig.

Detta tekniska nytänkande är en viktig del av deras arv och förklarar varför deras musik fortfarande upplevs som relevant.`,
  questions: [
    { type: 'literal', q: 'Vad gjorde Michael B. Tretow för att ljudet skulle växa?',
      options: ['Spelade in samma instrument två gånger i olika hastighet', 'Placerade mikrofonerna längre bort från instrumenten', 'Lade till kraftigt eko på samtliga inspelade spår', 'Lät inspelningarna göras i en betydligt större lokal'], correct: 0 },
    { type: 'inferens', q: 'Varför lät de två inspelningarna större än vad musikerna spelat?',
      options: ['För att volymen dubblerades vid mixningen', 'För att inspelningarna aldrig låg exakt på varandra', 'För att fler musiker deltog vid det andra tillfället', 'För att bandet gick långsammare vid uppspelningen'], correct: 1 },
    { type: 'inferens', q: 'Vad blev resultatet när Agnetha och Anni-Frid sjöng samma stämma?',
      options: ['Den ena rösten kom att dominera över den andra', 'Stämman måste spelas in flera gånger om', 'En tredje röst som inte var någon av deras', 'Ett ljud som lät grumligt och behövde bearbetas'], correct: 2 },
    { type: 'literal', q: 'Vad innebar det att äga en egen studio?',
      options: ['Att de kunde spela in betydligt fler låtar per år', 'Att de slapp anlita utomstående studiomusiker', 'Att inspelningarna kunde göras även under turnéerna', 'Att en låt fick ta den tid den behövde'], correct: 3 },
    { type: 'inferens', q: 'Vad är den största skillnaden mot att producera musik i dag?',
      options: ['Att verktygen blivit enkla och tillgängliga för alla', 'Att ljudet numera blir tydligare än det blev förr', 'Att artister spelar in färre lager än de gjorde då', 'Att studior sällan används av popartister längre'], correct: 0 },
    { type: 'sammanfatta', q: 'Vad avgör om en inspelning håller över tid enligt texten?',
      options: ['Hur mycket pengar som lagts på inspelningen', 'Besluten som fattas, inte utrustningen', 'Hur många lager sången har spelats in i', 'Om studion ägs av artisten själv eller hyrs'], correct: 1 },
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
  if (data.genre) t.genre = data.genre;
  if (data.title) t.title = data.title;
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
  console.log(`${id.padEnd(18)} åk${String(t.grade).padEnd(3)} ${String(n).padStart(4)} ord ${inom ? '✅' : '❌ krav ' + b[0] + '–' + b[1]}  facit:${data.questions.map(q => q.correct).join('')}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
if (!ok) process.exit(1);
