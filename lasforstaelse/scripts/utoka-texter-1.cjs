#!/usr/bin/env node
//
// Utökar de tunnaste texterna i åk 7–10 till specens ordintervall.
//
// Bakgrund: 141 texter i åk 7–10 ligger under målintervallet, de flesta
// kraftigt. Flera är på 115–150 ord där specen kräver 500–625. Så korta
// texter ger inte eleven något att öva uthållig läsning på, och de sex
// frågorna får för lite underlag att bygga på.
//
// Utökningen lägger till innehåll – exempel, orsakssamband, motbilder –
// inte utfyllnad. Befintliga frågor fortsätter fungera eftersom det gamla
// stoffet finns kvar; det nya bygger vidare på det.
//
// Sats 1: de fem tunnaste texterna.

const fs = require('fs');
const path = require('path');

const NYA = {

// ── åk 8, 115 → ~550 ord ────────────────────────────────────────────────
'ak8-tema-029': `Industrialiseringen var en period av stora förändringar som började i slutet av 1700-talet. Under denna tid gick samhället från jordbruk till industriell produktion. Förändringen började i Storbritannien och spred sig därifrån till övriga Europa och Nordamerika.

Att just Storbritannien blev först berodde på flera saker som sammanföll. Landet hade gott om stenkol, ett bankväsen som kunde låna ut pengar till nya företag, och kolonier som både levererade råvaror och köpte färdiga varor. Textilindustrin blev den första stora industrigrenen. Där ersattes handvävstolar av maskiner som en enda arbetare kunde sköta flera av samtidigt.

Nya maskiner, som ångmaskinen, gjorde det möjligt att producera varor snabbare och billigare. Ångmaskinen var avgörande eftersom den inte var beroende av rinnande vatten. En fabrik behövde inte längre ligga vid ett vattendrag, utan kunde placeras där arbetskraften och transporterna fanns. Fabriker växte fram i städerna och många människor flyttade dit för att arbeta.

Städerna växte snabbare än de hann byggas ut. Bostäderna blev trånga, avloppen bristfälliga och sjukdomar spreds lätt. För många familjer innebar flytten från landsbygden både högre lön och sämre livsmiljö på samma gång.

Arbetsvillkoren var ofta svåra. Många arbetade långa dagar under farliga förhållanden. Maskinerna saknade skydd, och olyckor var vanliga. Barnarbete var också vanligt. Barn var billiga att anställa och små nog att krypa in under maskinerna och rensa bort trådrester medan de fortfarande gick.

Samtidigt ledde industrialiseringen till ekonomisk tillväxt och teknisk utveckling. Nya transportmedel som järnvägar gjorde det lättare att resa och transportera varor. Järnvägen förändrade också tidsuppfattningen: när tåg skulle mötas på samma spår behövde klockorna visa samma tid i hela landet, och den lokala soltiden ersattes av gemensam tidsräkning.

I Sverige kom industrialiseringen senare, ungefär från mitten av 1800-talet. Här byggde den till en början på skogen och järnmalmen snarare än på textilier. Sågverk längs Norrlandskusten och gruvor i Bergslagen drog till sig arbetare, och stora grupper flyttade från landsbygden. Samtidigt utvandrade omkring en miljon svenskar till Nordamerika, många av dem för att jordbruket inte kunde försörja alla.

Industrialiseringen förändrade också familjelivet i grunden. Tidigare hade arbete och hem hört ihop: gården eller verkstaden låg där familjen bodde, och alla bidrog med det de kunde efter ålder och förmåga. Med fabriken skildes arbetsplatsen från hemmet för första gången. Arbetsdagen fick fasta tider som klockan bestämde i stället för dagsljuset och årstiderna, och därmed uppstod också något nytt: fritid, alltså en tid som var tydligt skild från arbetet.

Med tiden infördes lagar för att förbättra arbetsvillkoren. Barnarbete begränsades, arbetsdagen kortades och skyddsregler för maskiner infördes. Fackföreningar bildades för att kämpa för arbetarnas rättigheter. Genom att många gick samman fick de en förhandlingsstyrka som ingen enskild arbetare hade, och strejken blev ett verktyg för att driva igenom krav.

Industrialiseringen har haft stor betydelse för det moderna samhället och påverkar oss fortfarande idag. Massproduktionen som började då är grunden för hur varor tillverkas nu. Men den lade också grunden för användningen av fossila bränslen i stor skala, vilket är en huvudorsak till dagens klimatförändringar. Perioden visar därför något som ofta återkommer i historien: samma utveckling kan innebära både framsteg och problem, och vilken sida som väger tyngst beror på vem man frågar, var i världen man befinner sig och hur långt fram i tiden man väljer att se.`,

// ── åk 7, 120 → ~510 ord ────────────────────────────────────────────────
'ak7-tema-025': `I ett samhälle lever människor tillsammans trots att de kan ha olika bakgrund, åsikter och livssituationer. För att det ska fungera behövs regler, respekt och förståelse.

Regler fyller flera funktioner. De gör vardagen förutsägbar, så att man vet vad som gäller i trafiken, i skolan och på en arbetsplats. De skyddar också den som är i underläge. Utan gemensamma regler skulle den starkaste eller den mest högljudda ofta få bestämma, oavsett vad som är rimligt.

Demokrati innebär att människor får vara med och bestämma genom val. Alla röster ska ha lika värde. Samtidigt innebär det ansvar att lyssna på andra och respektera beslut. Demokrati handlar inte bara om att räkna röster. Om majoriteten alltid fick bestämma allt skulle mindre grupper riskera att aldrig få igenom något. Därför finns rättigheter som gäller även när de flesta tycker något annat, till exempel rätten att uttrycka en avvikande åsikt.

Mångfald är en styrka i samhället. När människor med olika erfarenheter möts kan nya idéer uppstå. Det kan handla om språk, kultur eller olika sätt att leva. I en grupp där alla har samma bakgrund är det lätt att missa problem som ingen råkat stöta på. En grupp med skilda erfarenheter upptäcker oftare vad som inte fungerar för andra än en själv.

Samtidigt är mångfald inte automatiskt enkelt. Att förstå varandra kräver ansträngning, och missförstånd uppstår oftare när människor har olika referenser. Skillnaden mellan grupper som fungerar och grupper som fastnar handlar sällan om hur lika medlemmarna är, utan om hur de hanterar det som skiljer.

Konflikter kan uppstå, men de kan lösas genom dialog. Att prata med varandra och försöka förstå olika perspektiv är viktigt. En konflikt behöver inte betyda att någon har fel. Ofta har båda sidor rimliga skäl, men utgår från olika saker: den ena tänker på rättvisa, den andra på trygghet. När det blir tydligt vad oenigheten egentligen gäller blir den också lättare att lösa.

Ett begrepp som ofta nämns i sammanhanget är inkludering. Att vara inkluderad betyder mer än att få vara med. Det innebär att ens perspektiv faktiskt räknas när något ska bestämmas. En elev kan sitta med i en grupp utan att någon frågar vad hen tycker, och då är personen närvarande men inte delaktig.

Mycket av det som håller ihop ett samhälle sker utanför politiken. Föreningar, idrottsklubbar och grannar som hjälps åt bygger tillit mellan människor som annars kanske aldrig hade mötts. Forskare brukar kalla detta för socialt kapital. Det visar sig ofta vara avgörande just när något går fel: i områden där människor känner varandra löses problem snabbare, eftersom någon vet vem man ska fråga och vem som kan hjälpa till.

Genom att visa hänsyn och samarbeta kan människor skapa ett tryggt och fungerande samhälle där fler känner sig inkluderade. Det arbetet blir aldrig helt färdigt. Samhällen förändras när nya människor kommer, när tekniken ändrar hur vi möts och när det som togs för självklart börjar ifrågasättas. Just därför är förmågan att lyssna på varandra och ompröva sina egna slutsatser minst lika viktig som själva reglerna.`,

// ── åk 8, 123 → ~550 ord ────────────────────────────────────────────────
'ak8-tema-030': `Människokroppen behöver energi för att fungera. Denna energi kommer från maten vi äter. När vi bryter ner maten omvandlas den till energi som kroppen kan använda.

All energi i cellerna passerar genom en och samma molekyl, som brukar förkortas ATP. Man kan se ATP som kroppens gemensamma valuta: oavsett om energin ursprungligen kom från en smörgås eller från kroppens fettlager måste den växlas till ATP innan en muskel kan använda den. Musklerna har bara ett litet lager ATP sparat, tillräckligt för ett par sekunders hårt arbete. Därför måste det hela tiden fyllas på.

Det finns olika energisystem i kroppen. Vid korta och intensiva aktiviteter används främst snabba energisystem som inte kräver syre. Vid längre aktiviteter används system som behöver syre, vilket kallas aerob energi.

Systemen är inte tre separata motorer som slås av och på, utan de arbetar hela tiden samtidigt i olika proportioner. Vid en maximal spurt på tio sekunder står de snabba systemen för nästan allt. Vid ett lopp på några minuter tar det system över som bryter ner kolhydrater utan syre, och som biprodukt bildas laktat. Vid längre arbete, som en löprunda på en timme, dominerar det aeroba systemet.

Laktat har länge haft dåligt rykte och beskrevs förr som orsaken till träningsvärk. Den förklaringen har forskningen övergett. Laktat försvinner ur blodet inom en timme efter träningen, medan träningsvärken kommer först ett dygn senare och beror på små skador i muskelfibrerna.

Kolhydrater, fett och proteiner är viktiga näringsämnen. Kolhydrater ger snabb energi, medan fett används vid längre aktiviteter. Proteiner används främst för att bygga upp kroppen. Kroppens kolhydratlager räcker ungefär en till två timmars hårt arbete, medan fettlagren räcker betydligt längre även hos en vältränad person. Det förklarar varför uthållighetsidrottare ofta äter under själva tävlingen.

Träning påverkar hur effektivt kroppen använder energi. Regelbunden träning kan förbättra både styrka och uthållighet. Vid uthållighetsträning ökar antalet mitokondrier i muskelcellerna, alltså de delar där den syrekrävande energiproduktionen sker. Hjärtat blir också starkare och pumpar ut mer blod per slag. Det är därför en vältränad person ofta har lägre vilopuls.

Vila och återhämtning är också viktiga. Utan tillräcklig vila kan kroppen inte reparera sig. Själva förbättringen sker inte under passet utan i timmarna och dygnen efteråt, när kroppen bygger upp sig något starkare än innan. Sömnen har en särskild roll här, eftersom mycket av reparationsarbetet pågår då. Den som tränar hårt varje dag utan återhämtning kan därför bli sämre i stället för bättre.

Vilket bränsle kroppen väljer beror på hur hårt arbetet är. Vid låg intensitet, som under en lugn promenad, kommer en stor del av energin från kroppens fett. Ju hårdare arbetet blir, desto större andel tas från kolhydraterna, eftersom de går snabbare att omsätta till användbar energi. Vätska spelar också roll för hur systemen fungerar. Redan en liten vätskeförlust försämrar prestationen märkbart, eftersom blodet blir trögare att pumpa runt och kroppen får svårare att göra sig av med överskottsvärmen.

Genom att förstå kroppens energisystem kan vi träna smartare och må bättre. Kunskapen gör det lättare att förstå varför olika typer av träning ger olika resultat, varför måltider före och efter ett pass spelar roll, och varför en vilodag inte alls är bortkastad tid utan tvärtom en nödvändig del av själva träningen.`,

// ── åk 7, 124 → ~510 ord ────────────────────────────────────────────────
'ak7-tema-024': `Människokroppen behöver energi för att fungera. Denna energi kommer från maten vi äter. När vi bryter ner maten i kroppen omvandlas den till näringsämnen som kan användas av cellerna.

Nedbrytningen börjar redan i munnen. Saliven innehåller ämnen som börjar bryta ner stärkelse, och därför kan en bit bröd smaka lite sött om man tuggar länge. I magsäcken fortsätter arbetet med hjälp av magsyra, och i tunntarmen tas näringen upp genom tarmväggen och förs vidare ut i blodet.

Kolhydrater, fetter och proteiner är de viktigaste energikällorna. Kolhydrater ger snabb energi, medan fetter lagras och används senare. Proteiner används främst för att bygga upp kroppen, men kan också ge energi. Kroppen behöver dessutom vitaminer och mineraler. De ger ingen energi i sig, men utan dem fungerar inte processerna som frigör energin ur maten.

När kroppen behöver energi sker kemiska processer i cellerna. Syre spelar en viktig roll i dessa processer. Utan syre kan kroppen inte producera energi lika effektivt. Det är därför andningen och pulsen ökar när du anstränger dig: kroppen behöver få in mer syre och transportera ut det till musklerna snabbare.

Blodet sköter transporten. De röda blodkropparna binder syret i lungorna och släpper det där det behövs. Samtidigt tar de med sig koldioxid tillbaka, som är en restprodukt från energiproduktionen och som andas ut igen. På så sätt hänger andning, blodomlopp och energi ihop i ett enda kretslopp.

Hjärnan är särskilt beroende av en jämn tillförsel. Den utgör bara ett par procent av kroppsvikten men använder omkring en femtedel av all energi. Till skillnad från musklerna kan hjärnan knappt lagra något, vilket är en av förklaringarna till att det blir svårare att koncentrera sig när man är hungrig.

Fysisk aktivitet ökar energibehovet. Därför behöver personer som tränar mer också äta mer. Samtidigt är det viktigt att äta varierat för att få i sig alla näringsämnen. Behovet skiljer sig dessutom en hel del mellan olika människor. Ålder, kroppsstorlek och hur mycket man rör sig under dagen påverkar hur mycket energi som går åt under en dag, och därför finns det inget enda svar som passar alla.

Hur snabbt energin blir tillgänglig skiljer sig mellan olika sorters mat. Socker och vitt bröd tas upp snabbt och höjer blodsockret på kort tid, men effekten klingar också av fort. Grovt bröd, gryn och baljväxter bryts ner långsammare, vilket ger en jämnare tillförsel under längre tid. Det är en av anledningarna till att en frukost med gröt håller längre än en med enbart söta flingor.

Kroppen har dessutom ett eget lager att ta av. Överskott av kolhydrater sparas i levern och i musklerna, och det lagret räcker ungefär ett dygn. När det börjar ta slut går kroppen i högre grad över till att använda fett i stället.

En balanserad kost och regelbunden rörelse hjälper kroppen att fungera optimalt. Balanserad betyder inte att varje måltid måste vara perfekt, utan att helheten över tid innehåller det kroppen behöver. Sömnen hör också hit: när vi sover fylls energilagren långsamt på igen, och kroppen hinner reparera det som har slitits under dagen.`,

// ── åk 7, 125 → ~510 ord ────────────────────────────────────────────────
'ak7-tema-035': `Fotboll är en av världens mest populära sporter och spelas i nästan alla länder. Sporten kräver både fysisk uthållighet och samarbete mellan spelare. Målet är att göra fler mål än motståndaren.

En del av förklaringen till spridningen är att fotboll ställer små krav på utrustning. Det behövs i praktiken bara en boll och en yta att spela på. Två tröjor kan bli ett mål. Det gör att sporten går att spela nästan var som helst, oavsett hur mycket pengar som finns.

Reglerna är också förhållandevis få. En match är nittio minuter lång, spelarna får inte använda händerna om de inte är målvakt, och offsideregeln hindrar anfallare från att ställa sig och vänta framför motståndarens mål. Att grunderna går att lära sig på några minuter bidrar till att nya spelare snabbt kan vara med.

Fotboll har också en viktig social roll. Den kan förena människor från olika bakgrunder och skapa gemenskap. Många ungdomar deltar i lag och lär sig viktiga värderingar som respekt och lagarbete. I ett lag måste man samarbeta med personer man inte själv har valt, och det i sig är en övning som få andra sammanhang ger.

För många föreningar sträcker sig verksamheten längre än till träningarna. Ledare håller kontakt med skolor, ordnar läxhjälp eller ser till att den som inte har råd med utrustning ändå kan delta. Föreningen blir då en mötesplats i området snarare än enbart ett idrottslag.

Damfotbollen har vuxit kraftigt under senare decennier. Under en period var den till och med förbjuden i flera länder, med motiveringen att sporten inte skulle passa kvinnor. När förbuden hävdes tog utvecklingen fart, och publiksiffrorna för landskamper och mästerskap har ökat snabbt under 2000-talet.

Professionell fotboll är en stor industri med klubbar, ligor och internationella turneringar. Spelare kan bli kända och inspirera andra. Pengarna kommer framför allt från tv-avtal, sponsorer och biljetter. Det har gjort de största klubbarna ekonomiskt starka, men också ökat avståndet till mindre klubbar som inte kan konkurrera om samma spelare.

Samtidigt finns utmaningar, som press på spelare och risk för skador. Det är viktigt att träna på ett säkert sätt och att ha balans mellan sport och andra delar av livet. Knäskador är vanliga i fotboll, och forskningen visar att särskilda uppvärmningsprogram kan minska risken märkbart. För unga spelare finns dessutom en risk att specialisera sig för tidigt, vilket både ökar skaderisken och gör att många slutar innan de blivit vuxna.

Supporterkulturen är en egen del av sporten. På läktaren skapas sånger, ramsor och traditioner som förs vidare mellan generationer, och för många handlar tillhörigheten lika mycket om laget som om orten eller familjen. Samtidigt finns en baksida, där rivalitet kan slå över i hot och våld, och både klubbar och förbund lägger i dag stora resurser på att motverka det.

Fotbollens betydelse sträcker sig därför bortom planen och påverkar både individer och samhällen. Sporten kan skapa gemenskap och glädje, men den speglar samtidigt de problem som finns i samhället runt omkring: frågor om pengar, om rättvisa och om vem som egentligen får ta plats.`,
};

// Frågor som behöver rättas i samma veva
const FRAGERATTNINGAR = {
  // Facit var "Tävling", vilket texten inte stödjer någonstans.
  'ak7-tema-025|6': {
    type: 'sammanfatta',
    q: 'Vad är textens huvudbudskap?',
    options: [
      'Att samlevnad bygger på respekt, dialog och verklig delaktighet',
      'Att regler alltid bör vara så få som möjligt i ett samhälle',
      'Att konflikter bäst undviks genom att låta majoriteten avgöra',
      'Att människor fungerar bäst tillsammans när de liknar varandra',
    ],
    correct: 0,
  },
  // "Vad betyder inkludering?" är en ordfråga, inte författarens syfte.
  'ak7-tema-025|5': { type: 'ord' },
  // "Vad används protein främst till?" står rakt ut i texten.
  'ak7-tema-024|5': { type: 'literal' },
  // "Varför är vila viktig?" står rakt ut i texten.
  'ak8-tema-030|6': { type: 'literal' },
};

const BAND = { 7: [500, 530], 8: [530, 570], 9: [570, 590], 10: [590, 625] };

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;
Object.entries(NYA).forEach(([id, txt]) => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error('Hittar inte ' + id); ok = false; return; }
  t.text = txt;
  const n = txt.trim().split(/\s+/).length;
  t.meta = { ...(t.meta || {}), wordCount: n };
  const b = BAND[t.grade];
  const inom = n >= b[0] && n <= b[1];
  if (!inom) ok = false;
  console.log(`${id.padEnd(16)} åk${String(t.grade).padEnd(3)} ${String(n).padStart(4)} ord  krav ${b[0]}–${b[1]}  ${inom ? '✅' : (n < b[0] ? '⬇ ' + (b[0] - n) : '⬆ ' + (n - b[1]))}`);
});

Object.entries(FRAGERATTNINGAR).forEach(([nyckel, patch]) => {
  const [id, nr] = nyckel.split('|');
  const t = lib.find(x => x.id === id);
  const q = t && t.questions[Number(nr) - 1];
  if (!q) { console.error('Hittar inte fråga ' + nyckel); ok = false; return; }
  Object.assign(q, patch);
  console.log(`Rättade fråga ${nyckel}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
if (!ok) process.exit(1);
