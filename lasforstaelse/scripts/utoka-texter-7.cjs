#!/usr/bin/env node
//
// Sats 7: fem texter i intervallet 158–161 ord, med omskrivna frågor.

const fs = require('fs');
const path = require('path');

const NYA = {

// ── åk 9, 158 → ~580 ord ────────────────────────────────────────────────
'ak10-obama-002': {
  text: `Barack Obama blev känd för en bredare publik när han höll ett uppmärksammat tal vid Demokraternas partikonvent 2004. Talet handlade om enighet och hopp, och många såg honom som en framtida ledare. Vid den tidpunkten var han ännu inte ens senator, utan kandidat till en plats i senaten för delstaten Illinois.

Bakgrunden var ovanlig för en amerikansk politiker. Han växte upp på Hawaii och under en period i Indonesien, utbildade sig till jurist och arbetade därefter som community organizer i Chicago, alltså med att hjälpa boende i utsatta områden att organisera sig och driva sina egna krav. Den erfarenheten återkom senare i hur hans kampanj byggdes upp.

År 2008 ställde Obama upp i presidentvalet i USA. Först måste han dock vinna sitt eget partis primärval, och där var Hillary Clinton den självklara favoriten. Kampen mellan dem pågick i månader och avgjordes inte av en enskild debatt utan av matematiken. Obamas kampanj hade räknat ut att delegaterna fördelades proportionellt i de flesta delstater, och satsade därför även i stater där han inte kunde vinna men väl ta hem en del av delegaterna.

Hans kampanj fokuserade på förändring och framtidstro, med sloganen "Yes we can". Han använde sociala medier på ett nytt sätt för att nå väljare, särskilt unga. Lika viktigt var att kampanjen samlade in pengar i små belopp från ett mycket stort antal givare i stället för att förlita sig på ett fåtal stora bidragsgivare. Det gav både pengar och något svårare att mäta: den som gett tjugo dollar kände sig delaktig och ställde ofta upp som frivillig.

Vändpunkten i primärvalet kom i Iowa i januari 2008. Delstaten är liten och nästan helt vit, och en seger där visade att väljare långt utanför de stora städerna kunde tänka sig honom. Kampanjen hade lagt månader på att bygga upp ett nät av frivilliga just där, och resultatet fick många som tvekat att se honom som en möjlig vinnare.

Kampanjen mötte också motstånd av ett annat slag. Rykten om hans namn, hans religion och var han var född spreds i kedjebrev och på nätet, och de fortsatte i flera år efter valet trots att de var motbevisade. Att bemöta dem var svårt, eftersom varje svar också spred påståendet vidare.

Organisationen på marken byggde på samma tanke. Frivilliga fick ansvar för sina egna kvarter, knackade dörr och förde anteckningar om vem som tänkte rösta. Det var ett arbetssätt hämtat från just den sortens lokala organisering han själv sysslat med i Chicago.

Obama mötte stark konkurrens under valet, men lyckades vinna stöd från många olika grupper i samhället. Hösten 2008 slog dessutom finanskrisen till med full kraft. Hur de två kandidaterna reagerade under de veckorna kom att spela stor roll, och många väljare uppfattade Obama som den lugnare av dem. Han blev därmed den första afroamerikanska presidenten i USA:s historia.

Hans seger sågs som historisk och symbolisk, både i USA och internationellt. Många människor upplevde att valet markerade ett viktigt steg i kampen för jämlikhet. Andra påpekade senare att en enskild valseger inte förändrade de skillnader i inkomst, hälsa och rättsväsende som fanns kvar, och att förväntningarna på vad en president kunde uträtta var orimligt höga redan från början.

Valet visade också hur viktigt kommunikation och strategi är i modern politik. Obamas kampanj ansågs vara effektiv och innovativ, och de metoder den utvecklade kopierades snabbt av andra, även av motståndarna. Det som var nytt 2008 var självklart bara några år senare.

Vägen till presidentposten var inte enkel, men Obamas förmåga att inspirera och engagera människor spelade en avgörande roll i hans framgång.`,
  questions: [
    { type: 'literal', q: 'Vad arbetade Obama med i Chicago innan sin politiska karriär?',
      options: ['Som lärare i juridik vid ett stort universitet', 'Som community organizer i utsatta bostadsområden', 'Som journalist på en av stadens lokaltidningar', 'Som rådgivare åt delstatens dåvarande guvernör'], correct: 1 },
    { type: 'inferens', q: 'Varför satsade kampanjen även i delstater den inte kunde vinna?',
      options: ['För att pröva budskapet inför själva valdagen', 'För att tvinga Clinton att lägga pengar där', 'För att delegaterna fördelades proportionellt', 'För att bygga upp lokala partiorganisationer'], correct: 2 },
    { type: 'literal', q: 'Vad var särskilt med kampanjens insamling av pengar?',
      options: ['Den byggde på små belopp från mycket många givare', 'Den finansierades helt av partiets centrala kassa', 'Den avstod från att ta emot privata bidrag alls', 'Den bekostades till största delen av kandidaten själv'], correct: 0 },
    { type: 'inferens', q: 'Varför nämner texten att givarna ofta ställde upp som frivilliga?',
      options: ['För att förklara varför kampanjen blev billig att driva', 'För att visa att pengarna gav mer än enbart pengar', 'För att peka på att frivilliga sällan bidrog ekonomiskt', 'För att jämföra kampanjens metoder med Clintons'], correct: 1 },
    { type: 'inferens', q: 'Vilken invändning mot bilden av segern som ett genombrott tar texten upp?',
      options: ['Att valdeltagandet var lägre än vid tidigare val', 'Att segern byggde på ett mycket litet röstövertag', 'Att motståndaren egentligen ledde in i slutveckan', 'Att skillnader i inkomst och hälsa fanns kvar efteråt'], correct: 3 },
    { type: 'sammanfatta', q: 'Vad säger texten om kampanjens metoder efteråt?',
      options: ['Att de visade sig svåra för andra att upprepa', 'Att de förbjöds inför de kommande valen', 'Att de snabbt kopierades och blev självklara', 'Att de fungerade enbart på unga väljare'], correct: 2 },
  ],
},

// ── åk 9, 158 → ~580 ord ────────────────────────────────────────────────
'ak10-rosa-003': {
  text: `Civilkurage innebär att våga stå upp för det som är rätt, även när det innebär risker. Rosa Parks är ett tydligt exempel på detta. Hennes beslut att inte ge upp sin plats på bussen i Montgomery i december 1955 var ett medvetet val som kunde få konsekvenser, och det fick det: hon greps och bötfälldes.

Bilden av Parks som en trött sömmerska som spontant vägrade resa sig har spridits i decennier, men den stämmer dåligt. Hon hade varit aktiv i medborgarrättsorganisationen NAACP sedan 1943, arbetat som dess sekreterare i Montgomery och kort dessförinnan deltagit i en utbildning om icke-våldsmotstånd. Hon visste vad ett gripande innebar och vad det kunde användas till.

För att förstå handlingen behöver man veta vad reglerna innebar. I Montgomery fick svarta resenärer betala framme vid föraren, kliva av och gå in igen genom den bakre dörren. De främre raderna var reserverade för vita, och om de fylldes skulle en hel rad längre bak tömmas, eftersom ingen vit förväntades sitta i jämnhöjd med en svart resenär.

Att visa civilkurage handlar ofta om att utmana normer och regler som upplevs som orättvisa. Detta kräver mod, särskilt när samhället förväntar sig att man ska följa reglerna. Det som gjorde Montgomery svårt var att lagen faktiskt stod på segregationens sida. Den som protesterade bröt inte mot en informell vana utan mot en giltig författning, och riskerade därför både straff och att förlora sitt arbete.

Rosa Parks var inte den första att protestera mot segregationen, men hennes handling fick stor uppmärksamhet. Nio månader tidigare hade femtonåriga Claudette Colvin gjort samma sak och gripits. Organisationerna valde ändå att inte bygga en kampanj kring henne, delvis för att hon var ung och gravid och därför lätt kunde angripas personligen. Detta visar att timing och sammanhang också spelar roll, men också att det ofta ligger noggranna överväganden bakom det som i efterhand ser ut som en slump.

Det som följde var inte heller en enskild handling utan en organiserad aktion. Bussbojkotten i Montgomery pågick i drygt ett år. Tiotusentals invånare gick till fots eller ordnade samåkning, trots att många hade lång väg till arbetet. Bojkotten drabbade bussbolagets ekonomi hårt, eftersom en stor del av resenärerna var just de som nu uteblev.

Bojkotten avslutades inte genom en förhandling utan genom ett domstolsbeslut. Högsta domstolen slog i november 1956 fast att segregationen på bussarna stred mot författningen. Målet drevs dock inte i Parks namn utan i fyra andra kvinnors.

Civilkurage kan inspirera andra människor att agera. När en person tar ställning kan det skapa en kedjereaktion där fler vågar göra detsamma. Samtidigt visar Montgomery att en enskild handling sällan räcker. Det krävdes en organisation som kunde sprida budskapet, jurister som drev frågan i domstol och tusentals människor som var beredda att gå.

Samtidigt kan det finnas risker, såsom sociala konsekvenser eller juridiska straff. Parks förlorade sitt arbete och utsattes för hot, och flyttade till slut från Alabama. Trots detta väljer vissa att agera, eftersom de anser att rättvisa är viktigare än den egna tryggheten.

Civilkurage behöver inte handla om historiska händelser. Att säga ifrån när någon utsätts i en klass, att vägra vara med när en grupp går över gränsen eller att berätta för en vuxen är samma sak i mindre skala. Också där finns en kostnad, eftersom den som säger ifrån riskerar att själv hamna utanför.

Texten belyser hur civilkurage är en viktig del av samhällsförändring och varför individer som Rosa Parks får stor betydelse, men också hur mycket arbete som krävs runt omkring för att en enskild handling ska leda någonvart.`,
  questions: [
    { type: 'literal', q: 'Vad hade Rosa Parks gjort innan händelsen på bussen?',
      options: ['Arbetat som sekreterare i NAACP i Montgomery', 'Startat en egen medborgarrättsorganisation i staden', 'Drivit ett mål mot bussbolaget i domstol', 'Undervisat i juridik vid ett universitet i Alabama'], correct: 0 },
    { type: 'inferens', q: 'Varför byggdes ingen kampanj kring Claudette Colvin?',
      options: ['För att hon inte ville medverka offentligt', 'För att hennes fall aldrig blev känt utanför staden', 'För att hon lätt kunde angripas personligen', 'För att hon frikändes redan i första instans'], correct: 2 },
    { type: 'ord', q: 'Vad menas med att lagen "stod på segregationens sida"?',
      options: ['Att domstolarna sällan tog upp den sortens mål', 'Att reglerna följdes helt frivilligt av invånarna', 'Att polisen valde att inte ingripa mot protester', 'Att den som protesterade bröt mot en giltig författning'], correct: 3 },
    { type: 'literal', q: 'Hur länge pågick bussbojkotten i Montgomery?',
      options: ['I några veckor under vintern', 'I drygt ett år efter gripandet', 'I nästan tre hela år', 'I ungefär en månads tid'], correct: 1 },
    { type: 'inferens', q: 'Varför drabbade bojkotten bussbolaget så hårt?',
      options: ['För att biljettpriserna nyligen hade höjts kraftigt', 'För att bolaget saknade andra inkomster än biljetter', 'För att en stor del av resenärerna var just de som uteblev', 'För att staden drog in bolagets tillstånd under tiden'], correct: 2 },
    { type: 'sammanfatta', q: 'Vilken slutsats drar texten om enskilda handlingar?',
      options: ['Att de betyder mer än det organiserade arbetet', 'Att de sällan får någon verklig effekt alls', 'Att de bör undvikas när lagen står emot', 'Att de behöver organisation omkring sig för att leda någonvart'], correct: 3 },
  ],
},

// ── åk 8, 159 → ~550 ord ────────────────────────────────────────────────
'ak8-tema-017': {
  text: `Demokrati är ett styrelseskick där makten utgår från folket. Genom val får medborgare möjlighet att påverka vilka som ska fatta beslut i samhället. I en demokrati finns också grundläggande rättigheter, som yttrandefrihet och mötesfrihet, som gör det möjligt att uttrycka åsikter och delta i samhällsdebatten.

Fria val räcker dock inte i sig. Att rösta i ett val där bara ett parti får ställa upp betyder ingenting. Det som gör ett val meningsfullt är att flera alternativ finns, att medier får rapportera fritt och att makten faktiskt lämnas över om den som styrt förlorar. Just det sista är ofta det svåraste provet på om en demokrati fungerar.

Det finns olika former av demokrati. I representativ demokrati väljer medborgarna representanter som fattar beslut åt dem. I direkt demokrati deltar medborgarna själva i beslutsfattandet, till exempel genom folkomröstningar. I Sverige är folkomröstningar oftast rådgivande, vilket innebär att riksdagen inte är bunden av resultatet.

Demokratin är dessutom yngre än många tror. I Sverige fick kvinnor rösta i riksdagsval första gången 1921, och även då fanns regler som stängde ute den som fått fattigvård. Att alla vuxna verkligen omfattas har alltså varit en långsam process, och den har drivits fram av människor som krävt rösträtt snarare än fått den given.

I Sverige fattas beslut på flera nivåer. Riksdagen bestämmer om lagar och statens budget, regionerna ansvarar bland annat för sjukvården och kommunerna för skola, socialtjänst och lokal planering. Vart fjärde år hålls val till alla tre samtidigt. Att så mycket avgörs nära hemmet är en av anledningarna till att kommunalvalet spelar större roll för vardagen än många tänker på.

En demokrati behöver också skydda dem som är i minoritet. Om beslut alltid fattas av den största gruppen kan mindre grupper förlora sina rättigheter helt, trots att besluten fattats i rätt ordning. Därför finns grundlagar och domstolar som sätter gränser för vad en majoritet får bestämma.

För att en demokrati ska fungera krävs mer än bara val. Det är viktigt att människor är informerade och engagerade. Medier spelar en central roll genom att sprida information och granska makthavare. Att journalister kan ställa obekväma frågor utan att riskera straff är en av de tydligaste skillnaderna mellan en demokrati och en diktatur.

Samtidigt finns utmaningar. Lågt valdeltagande kan minska legitimiteten i besluten, och spridning av falsk information kan påverka hur människor uppfattar verkligheten. Därför är källkritik en viktig del av ett demokratiskt samhälle. Valdeltagandet är dessutom ojämnt fördelat: i vissa områden röstar nästan alla, i andra betydligt färre, och den skillnaden gör att olika gruppers intressen får olika tyngd.

Demokrati är inte heller något som är färdigt när det väl uppnåtts. Under de senaste årtiondena har flera länder gått åt motsatt håll, ofta utan statskupp: i stället begränsas domstolarnas oberoende steg för steg, statliga medier fylls med regeringens företrädare och valreglerna skrivs om till den sittande maktens fördel. Varje enskilt steg kan framstå som litet, men sammantaget förändrar de vad ett val betyder.

Deltagande handlar inte heller bara om valdagen. Att gå med i en förening, skriva till en politiker, delta i en demonstration eller engagera sig i elevrådet är alla sätt att påverka mellan valen. I Sverige har den som fyllt arton år rätt att rösta, medan yngre får söka andra vägar för att göra sig hörda.

Genom att delta aktivt, till exempel genom att rösta, diskutera och engagera sig i frågor, kan medborgare bidra till att stärka demokratin.`,
  questions: [
    { type: 'inferens', q: 'Varför räcker det inte att hålla val?',
      options: ['För att valen hålls för sällan i de flesta länder', 'För att alla medborgare inte har tid att gå och rösta', 'För att valet är tomt om alternativ saknas och makten inte lämnas över', 'För att rösterna kan räknas fel utan noggrann kontroll'], correct: 2 },
    { type: 'literal', q: 'Vad gäller för folkomröstningar i Sverige?',
      options: ['De ersätter riksdagens beslut helt och hållet', 'De är oftast rådgivande och binder inte riksdagen', 'De hålls samtidigt som varje ordinarie riksdagsval', 'De får bara handla om ändringar i grundlagen'], correct: 1 },
    { type: 'inferens', q: 'Varför finns grundlagar och domstolar enligt texten?',
      options: ['För att sätta gränser för vad en majoritet får bestämma', 'För att avgöra vilka partier som får ställa upp i val', 'För att räkna rösterna på ett rättvist och säkert sätt', 'För att bestämma hur ofta allmänna val ska hållas'], correct: 0 },
    { type: 'literal', q: 'Vad beskrivs som en tydlig skillnad mellan demokrati och diktatur?',
      options: ['Att medborgarna får resa fritt mellan olika länder', 'Att skolan är avgiftsfri för alla barn i landet', 'Att partierna har olika många medlemmar', 'Att journalister kan ställa obekväma frågor utan risk'], correct: 3 },
    { type: 'inferens', q: 'Varför spelar det roll att valdeltagandet är ojämnt fördelat?',
      options: ['För att rösterna räknas olika i olika delar av landet', 'För att olika gruppers intressen då får olika tyngd', 'För att partierna tvingas hålla betydligt fler valmöten', 'För att resultatet blir svårare att fastställa säkert'], correct: 1 },
    { type: 'sammanfatta', q: 'Vilken bild av deltagande ger texten?',
      options: ['Att valdagen är det enda som verkligen räknas', 'Att deltagande bör begränsas till dem som är insatta', 'Att påverkan sker på många sätt även mellan valen', 'Att engagemang har liten effekt i ett så stort land'], correct: 2 },
  ],
},

// ── åk 8, 161 → ~550 ord ────────────────────────────────────────────────
'ak8-tema-025': {
  text: `Hjärnan är ett komplext organ som ständigt förändras. När vi lär oss något nytt skapas kopplingar mellan nervceller. Dessa kopplingar stärks när vi repeterar information eller använder kunskapen i praktiken. Förmågan att förändras kallas plasticitet och finns kvar hela livet, även om den är som störst under uppväxten.

Att kunskapen behöver användas är viktigare än det låter. Att läsa samma sida fem gånger känns effektivt, eftersom texten blir allt lättare att känna igen, men igenkänning är inte detsamma som att kunna. Den som i stället stänger boken och försöker återge innehållet ur minnet lär sig mer, trots att det känns svårare och betydligt obekvämare. Forskare brukar kalla det testeffekten.

En viktig begränsning är arbetsminnet. Det är den del av minnet som håller kvar information medan vi arbetar med den, och det rymmer bara några få saker åt gången. Därför blir en instruktion med sju steg svår att följa, medan samma innehåll uppdelat i tre delar fungerar.

Ny kunskap fastnar dessutom lättare om det finns något att haka upp den på. Den som redan vet en del om andra världskriget lär sig ett nytt årtal på några sekunder, medan den som inte vet något måste lära sig sammanhanget först. Det är en av anledningarna till att läsning i sig gör det lättare att lära sig nya ämnen.

Tidpunkten spelar också roll. Att sprida ut studierna över flera dagar ger bättre resultat än att lägga samma antal timmar i ett enda pass kvällen före provet. Att man hinner glömma en del däremellan är inte ett problem utan en del av förklaringen: det kostar något att hämta upp minnet igen, och den ansträngningen är just det som stärker det.

Forskning visar att sömn är viktig för inlärning. Under sömnen bearbetar hjärnan dagens intryck och förstärker minnen. Utan tillräcklig sömn blir det svårare att koncentrera sig och komma ihåg saker. Att sova efter att ha pluggat är därför inte bortkastad tid utan en del av själva arbetet.

Även motivation spelar en stor roll. När vi är intresserade av något aktiveras belöningssystem i hjärnan, vilket gör att vi lär oss snabbare. Känslor kan alltså påverka hur effektivt vi lär oss.

Variation i studier är också viktigt. Att kombinera olika metoder, som att läsa, diskutera och skriva, kan förbättra förståelsen. Att förklara något för någon annan är särskilt avslöjande, eftersom luckorna i den egna förståelsen syns direkt när orden ska formuleras. Pauser är en annan viktig faktor, eftersom hjärnan behöver tid att vila.

Att göra flera saker samtidigt fungerar sämre än det känns. Hjärnan växlar mellan uppgifterna i stället för att utföra dem parallellt, och varje växling kostar tid och uppmärksamhet. Att plugga med telefonen bredvid sig innebär därför inte att man gör två saker, utan att man gör den ena sämre.

En seglivad myt är att var och en har en egen inlärningsstil, att någon är visuell och en annan auditiv. Studier som prövat påståendet har inte kunnat visa att undervisning anpassad efter en sådan stil ger bättre resultat.

Stress kan däremot ha negativ effekt. För mycket stress kan göra det svårare att tänka klart och minnas information. En lagom nivå av spänning kan i stället skärpa uppmärksamheten, vilket är en av anledningarna till att en viss nervositet inför ett prov inte behöver vara något dåligt.

Genom att förstå hur hjärnan fungerar kan vi utveckla bättre strategier för lärande och nå våra mål mer effektivt.`,
  questions: [
    { type: 'ord', q: 'Vad menas med "plasticitet" i texten?',
      options: ['Att hjärnan till stor del består av mjuka vävnader', 'Att minnen kan raderas helt och hållet vid behov', 'Att hjärnan kan förändras genom hela livet', 'Att nervcellerna byts ut med jämna mellanrum'], correct: 2 },
    { type: 'inferens', q: 'Varför är det missvisande att läsa samma sida flera gånger?',
      options: ['För att ögonen tröttnar snabbare än hjärnan gör', 'För att igenkänning inte är detsamma som att kunna', 'För att texten sällan innehåller det allra viktigaste', 'För att läsning tar längre tid än att skriva av'], correct: 1 },
    { type: 'literal', q: 'Vad kallar forskare effekten av att återge innehåll ur minnet?',
      options: ['Testeffekten', 'Plasticiteten', 'Belöningssystemet', 'Variationseffekten'], correct: 0 },
    { type: 'inferens', q: 'Varför är det bra att hinna glömma en del mellan studietillfällena?',
      options: ['För att hjärnan då hinner vila ordentligt emellan', 'För att man annars riskerar att lära sig fel saker', 'För att pauserna gör studierna betydligt roligare', 'För att ansträngningen att minnas igen stärker minnet'], correct: 3 },
    { type: 'literal', q: 'Varför lyfts det fram som särskilt bra att förklara för någon annan?',
      options: ['Luckorna i den egna förståelsen syns direkt', 'Den andra personen kan rätta faktafel på plats', 'Man hinner repetera fler ämnen på kortare tid', 'Det gör att man slipper anteckna under tiden'], correct: 0 },
    { type: 'sammanfatta', q: 'Vad säger texten om nervositet inför ett prov?',
      options: ['Att den alltid försämrar resultatet på provet', 'Att en lagom nivå kan skärpa uppmärksamheten', 'Att den nästan alltid beror på för lite sömn', 'Att den bör dämpas med betydligt längre pauser'], correct: 1 },
  ],
},

// ── åk 9, 161 → ~580 ord ────────────────────────────────────────────────
'ak10-arsenal-004': {
  text: `Modern fotboll präglas i hög grad av ekonomi, och Arsenal är inget undantag. Intäkter från tv-avtal, sponsorer och biljettförsäljning spelar en avgörande roll för klubbens möjligheter att konkurrera. Av dessa är tv-pengarna i dag den största posten för de flesta klubbar i Premier League, vilket innebär att en enskild klubbs ekonomi hänger ihop med hur attraktiv hela ligan är att sända.

Bakgrunden går att spåra till 1990-talet. När Premier League bildades 1992 och började sälja sändningsrättigheterna samlat växte intäkterna snabbt, och med dem spelarnas löner. Klubbar som tidigare drivits ungefär som stora föreningar blev företag med omsättningar i miljardklassen. För Arsenal innebar det både nya möjligheter och ett tryck att hänga med i utgifterna.

När Arsenal flyttade till Emirates Stadium 2006 ökade klubbens intäkter, men samtidigt uppstod stora kostnader. Den nya arenan rymde betydligt fler åskådare än gamla Highbury, som låg inklämt mellan bostadshus och inte gick att bygga ut. Bygget finansierades med lån som skulle betalas av under lång tid, och för att få låna band klubben upp sig i avtal som gav lägre intäkter från sponsorer än vad marknaden annars hade gett. Detta påverkade hur mycket pengar klubben kunde spendera på nya spelare under flera år.

Åren som följde blev en balansgång. Klubben sålde ofta sina bästa spelare i stället för att köpa nya i samma klass, och nådde år efter år en placering som räckte till Champions League men inte till några titlar. Bland supportrarna gick meningarna isär: vissa såg en klok hushållning, andra en brist på ambition.

Den största utgiften är inte övergångssummorna utan lönerna. En spelare som köps för en stor summa kostar dessutom klubben under hela kontraktstiden, eftersom priset i bokföringen fördelas över åren. En värvning som inte fungerar blir därför dyr länge.

Att kvalificera sig till Champions League handlar också om pengar. Deltagandet ger intäkter som en klubb utanför turneringen går miste om, vilket gör att den som halkar efter får svårare att komma tillbaka. Skillnaden mellan fjärde och femte plats i tabellen kan därför få följder som sträcker sig flera år framåt.

Konkurrensen i Premier League har också blivit hårdare. Flera klubbar har fått stora ekonomiska resurser genom externa investeringar, i vissa fall från investerare och statliga fonder med mycket djupa fickor. Detta har gjort det svårare för Arsenal att konsekvent nå toppen av tabellen. Ligan har försökt hantera skillnaderna med regler om att klubbar inte får göra hur stora förluster som helst, men reglerna är svåra att tillämpa och har prövats i flera tvister.

För att hantera detta har klubben behövt utveckla en balans mellan ekonomisk stabilitet och sportslig framgång. Det innebär att fatta strategiska beslut kring spelarvärvningar, löner och långsiktig planering. En viktig del är den egna akademin, eftersom en spelare som fostras i klubben kostar betydligt mindre än en som köps utifrån.

Ekonomin märks också på läktaren. Arsenal har under lång tid haft några av Europas dyraste säsongsbiljetter, vilket väckt kritik från supportrar som menar att de som stått för klubben längst prisas ut. Frågan om vem en klubb egentligen tillhör, ägarna eller den stad den kommer ifrån, återkommer varje gång priserna höjs.

Ekonomi påverkar alltså inte bara vilka spelare som köps, utan också hur klubben organiseras och utvecklas. Analysavdelningar, medicinsk personal och scouter i andra länder är i dag lika självklara delar av verksamheten som tränarstaben. För Arsenal har detta inneburit både utmaningar och möjligheter.

Texten visar hur ekonomiska faktorer blivit en central del av modern fotboll och hur klubbar måste anpassa sig till dessa förändringar.`,
  questions: [
    { type: 'literal', q: 'Vilken intäkt är i dag störst för de flesta klubbar i Premier League?',
      options: ['Biljettförsäljningen på matchdagarna', 'Pengarna från ligans tv-avtal', 'Försäljningen av matchtröjor och souvenirer', 'Bidragen från det engelska fotbollsförbundet'], correct: 1 },
    { type: 'inferens', q: 'Varför byggdes en ny arena i stället för att bygga ut Highbury?',
      options: ['För att Highbury låg inklämt och inte gick att bygga ut', 'För att arenan låg alldeles för långt från centrum', 'För att hyran för den gamla arenan hade höjts kraftigt', 'För att ligan krävde nyare anläggningar av klubbarna'], correct: 0 },
    { type: 'inferens', q: 'Varför gav sponsoravtalen lägre intäkter än marknaden annars hade gett?',
      options: ['För att klubben saknade sportsliga framgångar vid den tiden', 'För att sponsorerna själva hade dålig ekonomi just då', 'För att avtalen var en förutsättning för att få låna pengar', 'För att avtalen tecknades långt innan arenan planerades'], correct: 2 },
    { type: 'literal', q: 'Hur beskrivs supportrarnas syn på åren efter flytten?',
      options: ['Att alla ansåg att klubben satsade alldeles för lite', 'Att kritiken främst riktades mot tränaren och hans val', 'Att frågan sällan diskuterades öppet bland supportrarna', 'Att vissa såg klok hushållning och andra bristande ambition'], correct: 3 },
    { type: 'inferens', q: 'Varför är den egna akademin viktig ekonomiskt?',
      options: ['För att egna spelare kostar betydligt mindre än köpta', 'För att akademin får särskilda bidrag från ligan varje år', 'För att unga spelare aldrig begär några höga löner', 'För att akademin lockar fler sponsorer till klubben'], correct: 0 },
    { type: 'sammanfatta', q: 'Vad är textens huvudlinje?',
      options: ['Att pengar avgör allt och att sporten spelat ut sin roll', 'Att Arsenal hanterat sin ekonomi bättre än de flesta klubbar', 'Att ekonomin styr både truppen och hela klubbens organisation', 'Att reglerna om förluster löst problemet med skillnaderna'], correct: 2 },
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
