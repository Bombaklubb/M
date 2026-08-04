#!/usr/bin/env node
//
// Sats 13: fem texter i intervallet 185–188 ord, med omskrivna frågor.

const fs = require('fs');
const path = require('path');

const NYA = {

// ── åk 9, 185 → ~580 ord ────────────────────────────────────────────────
'ak10-rosa-001': {
  text: `Rosa Parks är en av de mest kända personerna inom den amerikanska medborgarrättsrörelsen. Den 1 december 1955 vägrade hon att ge upp sin sittplats på en buss i Montgomery, Alabama, till en vit passagerare. Detta var inte en slumpmässig handling utan en medveten protest mot de rasistiska lagar som fanns i USA vid den tiden.

Segregationslagarna, även kallade Jim Crow-lagar, innebar att svarta och vita människor skulle hållas åtskilda i samhället. På bussar var svarta tvungna att sitta längst bak och ge upp sina platser om det inte fanns tillräckligt med sittplatser för vita.

Lagarna gällde långt utanför bussarna. Skolor, sjukhus, väntsalar, badstränder och till och med dricksvattenfontäner var uppdelade. I flera delstater var äktenskap mellan svarta och vita förbjudna. Systemet upprätthölls dessutom inte bara av lagar utan av hot: den som bröt mot ordningen kunde förlora sitt arbete, utsättas för våld eller i värsta fall dödas utan att någon dömdes för det.

Rosa Parks var 42 år och arbetade som sömmerska på ett varuhus. Hon hade varit gift sedan 1932 med Raymond Parks, som själv varit aktiv i medborgarrättsarbete långt innan hon blev det. Att hon framställdes som en vanlig trött kvinna var delvis ett medvetet val av rörelsen: en person som var lätt att sympatisera med var svårare att angripa.

Kvällen den 1 december satt Parks på en plats i den del av bussen där svarta fick sitta. När de främre raderna fylldes beordrade föraren att en hel rad skulle tömmas, eftersom en vit man annars hade fått sitta i jämnhöjd med svarta passagerare. Tre personer reste sig. Parks flyttade sig inåt mot fönstret men vägrade lämna platsen, och polisen tillkallades.

När Rosa Parks arresterades spreds nyheten snabbt. Händelsen ledde till Montgomery Bus Boycott, en protest där svarta invånare vägrade åka buss under över ett år. Bojkotten organiserades av bland andra Martin Luther King Jr., som då var en relativt okänd pastor.

Att bojkotten gick att genomföra berodde på organisation snarare än på entusiasm. Ungefär fyrtiotusen människor behövde ta sig till arbetet varje dag utan buss. Kyrkorna blev knutpunkter, och ett system med samåkning byggdes upp med hundratals bilar, fasta hållplatser och tidtabeller. Svarta taxichaufförer sänkte sina priser till bussbiljettens nivå tills staden förbjöd det.

Motståndet var hårt. Ledare greps med hänvisning till en gammal lag mot bojkotter, försäkringsbolag sade upp bilförsäkringarna för samåkningen och både Kings och andras hem utsattes för bombattentat. Många deltagare förlorade sina arbeten. Att bojkotten ändå höll i över ett år är det som brukar imponera mest på historiker.

Bojkotten blev en framgång och bidrog till att högsta domstolen förklarade segregationen på bussar som olaglig. Domen kom i november 1956, i ett mål som inte drevs i Parks namn utan i fyra andra kvinnors, och bojkotten avslutades i december samma år.

Segregationen försvann däremot inte i och med domen. Bussarna blev integrerade, men skolor, bostäder och arbetsliv förblev uppdelade i många år till, och kampen fortsatte under hela 1960-talet. Rosa Parks själv fick svårt att hitta arbete i Montgomery och flyttade så småningom till Detroit.

Metoden fick också betydelse långt utanför Montgomery. Att vägra samarbeta med ett system i stället för att slåss mot det blev en modell för sittstrejker vid lunchdiskar och senare för protester i andra länder. Att motståndet var ickevåldsamt gjorde dessutom att våldet från andra hållet syntes tydligare i tidningar och i tv.

Rosa Parks blev en symbol för motstånd mot orättvisor.

Hennes handling visar hur en enskild persons mod kan påverka ett helt samhälle. Texten belyser också hur protester kan leda till förändring genom kollektiv handling.`,
  questions: [
    { type: 'literal', q: 'Hur långt utanför bussarna gällde Jim Crow-lagarna?',
      options: ['De omfattade skolor, sjukhus, stränder och dricksfontäner', 'De gällde enbart transporter i de södra delstaterna', 'De omfattade bara offentliga byggnader i de större städerna', 'De reglerade främst arbetsplatser och lönenivåer'], correct: 0 },
    { type: 'inferens', q: 'Varför beordrade föraren att en hel rad skulle tömmas?',
      options: ['För att bussen var överfull och behövde lastas om', 'För att ingen vit skulle sitta i jämnhöjd med svarta passagerare', 'För att raden var reserverad för äldre resenärer', 'För att föraren hade fått en anmälan mot sig'], correct: 1 },
    { type: 'literal', q: 'Vad byggdes upp för att bojkotten skulle fungera?',
      options: ['En insamling som betalade böterna åt de gripna', 'Ett nät av gångstråk tvärs igenom staden', 'Ett system med samåkning, hållplatser och tidtabeller', 'En egen busslinje som drevs av kyrkorna'], correct: 2 },
    { type: 'inferens', q: 'Varför imponerar bojkottens längd på historiker?',
      options: ['För att ingen tidigare bojkott hade varat lika länge', 'För att staden aldrig gjorde något för att stoppa den', 'För att deltagarna fick omfattande ekonomiskt stöd utifrån', 'För att den höll samman trots gripanden, hot och attentat'], correct: 3 },
    { type: 'literal', q: 'Hur avslutades bojkotten?',
      options: ['Genom en dom i högsta domstolen i november 1956', 'Genom en överenskommelse med bussbolaget', 'Genom att staden själv avskaffade sina regler', 'Genom att delstaten ändrade sin lagstiftning'], correct: 0 },
    { type: 'sammanfatta', q: 'Vad hände med segregationen efter domen?',
      options: ['Den avskaffades i hela södern inom kort tid', 'Den fortsatte inom skolor, bostäder och arbetsliv', 'Den infördes i stället i de norra delstaterna', 'Den kom aldrig att prövas i domstol igen'], correct: 1 },
  ],
},

// ── åk 7, berättelse, 187 → ~515 ord ────────────────────────────────────
'ak7-tema-031': {
  text: `Sofia hade nyligen flyttat till en ny stad och kände sig osäker i sin nya skola. Hon saknade sina gamla vänner och tyckte att allt kändes främmande. På rasterna satt hon ofta ensam och tittade på de andra eleverna som redan verkade känna varandra.

Det värsta var inte att vara ensam. Det var att låtsas att hon inte var det. Hon lärde sig att ha telefonen i handen hela rasten, att gå med bestämda steg mot ingenstans och att svara "jo, bra" på ett sätt som gjorde att ingen frågade vidare.

En dag satte sig Alex bredvid henne i matsalen. Alex identifierade sig som icke-binär och var känd i klassen för att vara öppen och vänlig.

"Du gillar Sirena", sa Alex och nickade mot Sofias väska, där en knapp satt fastnålad. "Vilken låt är bäst?"

Sofia tvekade. Hon hade lärt sig att svara på ett sätt som gick att ta tillbaka, ifall det visade sig vara fel svar. Men Alex verkade inte fråga för att testa henne.

"Den som ingen gillar", sa hon till slut. "Den långsamma i mitten."

Alex log. "Precis den. Alla skippar den."

De började prata om musik och upptäckte att de hade liknande smak. Samtalet gjorde Sofia mer avslappnad.

Under de följande veckorna började de umgås mer. Alex introducerade Sofia för fler klasskamrater, och snart kände hon sig mer inkluderad. Det gick inte helt smärtfritt. Sofia sa fel pronomen om Alex första gången hon presenterade hen för någon annan, och kände sig varm i ansiktet i flera minuter efteråt.

"Förlåt", sa hon när de gick ut. "Jag ska tänka på det."

"Jag hörde att du rättade dig", sa Alex. "Det räcker."

Sofia märkte också att Alex ibland blev ifrågasatt av andra. En kille i parallellklassen brukade fråga saker med ett leende som inte var vänligt, sådant som lät som frågor men inte var det.

Alex svarade lugnt varje gång, med nästan samma ord. Efteråt frågade Sofia om det inte var jobbigt att behöva förklara sig hela tiden.

Alex ryckte på axlarna. "Jo. Men om jag slutar svara får han bestämma vad andra tror."

Sofia tänkte på det länge. Hon hade själv alltid valt att låta bli att säga något, och hade trott att det var samma sak som att vara lugn.

Nästa gång killen sa något stod hon kvar. Hon sa inget märkvärdigt, bara att det där räckte nu. Hon hörde själv att rösten inte var stadig. Men han slutade, och gick.

Hemma frågade hennes mamma varje dag hur det gått. Sofia sa "bra" i flera veckor innan hon en kväll sa något annat, och blev förvånad över hur lite som behövdes för att det skulle bli sagt. Mamman sa inte särskilt mycket. Hon bara satt kvar vid bordet lite längre än vanligt.

Sofia lärde sig mycket om respekt och vikten av att acceptera människor som de är. Hon insåg att vänskap kan uppstå på oväntade sätt och att det krävs mod att vara sig själv.

Efter några månader kände Sofia att hon hade hittat sin plats. Hon var inte längre ensam och hade fått både nya vänner och nya perspektiv.`,
  questions: [
    { type: 'inferens', q: 'Vad menar texten med att det värsta var att låtsas?',
      options: ['Att hon ljög om varför familjen hade flyttat', 'Att hon dolde för omgivningen att hon var ensam', 'Att hon spelade att hon inte tyckte om den nya skolan', 'Att hon påstod att hon hade vänner på annat håll'], correct: 1 },
    { type: 'literal', q: 'Vad fick Alex att inleda samtalet?',
      options: ['En knapp som satt på Sofias väska', 'Att de råkade stå i samma matsalskö', 'Att en lärare hade bett Alex göra det', 'Att Sofia frågade om vägen till salen'], correct: 0 },
    { type: 'inferens', q: 'Varför tvekade Sofia innan hon svarade om låten?',
      options: ['För att hon inte kom ihåg vad låten hette', 'För att hon inte alls ville prata om musik', 'För att hon var van att svara så att hon kunde ta tillbaka det', 'För att hon inte visste vem Alex var sedan tidigare'], correct: 2 },
    { type: 'literal', q: 'Hur reagerade Alex när Sofia hade sagt fel pronomen?',
      options: ['Alex låtsades inte höra det över huvud taget', 'Alex bad henne att inte göra om det igen', 'Alex förklarade utförligt hur det egentligen fungerar', 'Alex sa att det räckte att hon rättade sig'], correct: 3 },
    { type: 'inferens', q: 'Varför fortsätter Alex att svara på killens frågor?',
      options: ['För att hen hoppas att han ska ändra sig till slut', 'För att tystnad skulle låta någon annan bestämma bilden', 'För att lärarna kräver att konflikter reds ut direkt', 'För att hen faktiskt tycker om att förklara saker'], correct: 1 },
    { type: 'sammanfatta', q: 'Vad förändras hos Sofia i slutet?',
      options: ['Hon byter umgänge till parallellklassen', 'Hon slutar helt att bry sig om vad andra tycker', 'Hon säger ifrån trots att rösten inte är stadig', 'Hon ber en lärare att ingripa i stället'], correct: 2 },
  ],
},

// ── åk 7, 187 → ~515 ord ────────────────────────────────────────────────
'ak7-tema-040': {
  text: `Musik har alltid varit en viktig del av människors liv. Den används för att uttrycka känslor, berätta historier och skapa gemenskap. Olika kulturer har sina egna musiktraditioner, men samtidigt kan musik förena människor över hela världen.

Forskning visar att musik kan påverka hur vi mår. Lugn musik kan hjälpa oss att slappna av, medan snabb musik kan ge energi. Därför används musik ofta inom träning, terapi och undervisning.

Inom vården har musik fått en allt tydligare roll. Musikterapeuter arbetar bland annat med patienter som drabbats av stroke och förlorat talet, eftersom sång ofta fungerar när tal inte gör det: hjärnan använder delvis andra banor för att sjunga än för att prata. En del patienter kan alltså sjunga en mening som de inte kan säga.

Musik kan också påverka minnet. Många upplever att de lättare minns information om den kopplas till en melodi. Det är en anledning till att sånger används i undervisning, särskilt för yngre elever.

Kopplingen till minnet är särskilt tydlig hos personer med demens. Musik som en människa lyssnade mycket på i ungdomen kan väcka minnen och ord som annars verkar borta, ibland flera år efter att personen slutat känna igen sin omgivning. Varför det fungerar är inte helt klarlagt, men effekten är väl dokumenterad och används i dag på många äldreboenden.

Att musik hjälper vid träning är också undersökt. Ett fast tempo gör det lättare att hålla jämna steg, och uppmärksamheten dras delvis bort från att det är jobbigt. Effekten är störst vid medelhård ansträngning; när det verkligen tar emot märks den knappt alls.

Musik används dessutom för att påverka oss utan att vi tänker på det. Butiker spelar långsam musik för att kunder ska gå långsammare och se mer, och snabb musik när det behöver gå undan. Att en känsla kommer från högtalarna och inte från en själv är lätt att missa.

Samtidigt förändras musikens roll med tekniken. Idag lyssnar många via streamingtjänster istället för att köpa skivor. Det har gjort musik mer tillgänglig, men också förändrat hur artister tjänar pengar.

Skillnaden är stor. När en skiva såldes fick artisten en summa per exemplar. I dag betalas ersättning per lyssning, och beloppet är en bråkdel av ett öre. Det innebär att ett par tusen lyssningar ger mycket lite, och att de allra flesta artister inte kan leva på inspelad musik utan tjänar sina pengar på konserter.

Tekniken har till och med förändrat hur låtar låter. Eftersom en lyssning oftast räknas först efter ungefär trettio sekunder har introna blivit kortare, och många låtar börjar direkt i refrängen. En låt som tar ett halvt minut på sig att komma igång riskerar att skrollas förbi.

Musik kan också vara ett sätt att påverka samhället. Genom texter kan artister ta upp viktiga frågor och inspirera till förändring. Historiskt har musik spelat en roll i olika rörelser för rättvisa. Sånger fungerar bra i protester eftersom de går att sjunga tillsammans utan att man behöver kunna texten i förväg, och eftersom en melodi är svår för en makthavare att förbjuda.

Oavsett genre eller stil fortsätter musik att vara en kraftfull del av människors liv. Den påverkar våra känslor, vårt minne och vår kultur på många sätt.`,
  questions: [
    { type: 'inferens', q: 'Varför kan en patient sjunga en mening som hen inte kan säga?',
      options: ['För att sång kräver mindre luft än vanligt tal', 'För att melodin gör orden kortare och enklare', 'För att hjärnan delvis använder andra banor för sång', 'För att patienten har övat särskilt på just den meningen'], correct: 2 },
    { type: 'literal', q: 'Vad kan musik från ungdomen göra för personer med demens?',
      options: ['Väcka minnen och ord som annars verkar borta', 'Göra att sjukdomen utvecklas betydligt långsammare', 'Ersätta behovet av annan behandling helt', 'Hjälpa dem att känna igen sin omgivning igen'], correct: 0 },
    { type: 'literal', q: 'Hur får artister betalt av streamingtjänsterna?',
      options: ['En fast summa varje månad från tjänsten', 'En bråkdel av ett öre per lyssning', 'En andel av tjänstens sammanlagda vinst', 'Ett belopp per land där låten spelas'], correct: 1 },
    { type: 'inferens', q: 'Varför har introna i låtar blivit kortare?',
      options: ['För att lyssnarna har fått sämre tålamod med åren', 'För att kortare låtar är billigare att spela in', 'För att artisterna vill hinna med fler låtar per skiva', 'För att en lyssning räknas först efter ungefär trettio sekunder'], correct: 3 },
    { type: 'inferens', q: 'Varför fungerar sånger bra i protester?',
      options: ['För att de går att sjunga tillsammans utan att kunna texten först', 'För att de sprids betydligt snabbare än flygblad gör', 'För att de är billigare att framställa än plakat', 'För att de sällan väcker uppmärksamhet i förväg'], correct: 0 },
    { type: 'sammanfatta', q: 'Vilken bild av musikens påverkan ger texten?',
      options: ['Att musikens främsta värde ligger i underhållningen', 'Att tekniken har försvagat musikens betydelse', 'Att musik påverkar hälsa, minne, ekonomi och samhälle', 'Att musik i huvudsak hör hemma inom vård och skola'], correct: 2 },
  ],
},

// ── åk 7, 187 → ~515 ord ────────────────────────────────────────────────
'ak7-tema-042': {
  text: `Demokrati är ett sätt att styra ett land där folket har makten. I en demokrati får medborgarna vara med och påverka beslut, ofta genom att rösta i val. Sverige är ett exempel på ett demokratiskt land där invånarna väljer politiker som fattar beslut i riksdagen.

Det finns olika nivåer av demokratiska beslut. På lokal nivå fattar kommuner beslut om till exempel skolor och kollektivtrafik. På nationell nivå beslutar riksdagen om lagar och budget. Det finns också internationella samarbeten där länder fattar gemensamma beslut.

Hur en lag blir till är värt att känna till. Ofta börjar det med att regeringen tillsätter en utredning som tar reda på hur en fråga ser ut. Förslaget skickas sedan ut på remiss, vilket betyder att myndigheter, organisationer och andra får svara på vad de tycker. Därefter lämnar regeringen ett förslag till riksdagen, som röstar. Processen är långsam med flit: tanken är att fel ska hinna upptäckas innan en lag börjar gälla.

I riksdagen finns 349 platser. För att ett parti ska få vara med och dela på dem måste det få minst fyra procent av rösterna i hela landet. Spärren finns för att riksdagen inte ska bli så uppdelad att det blir omöjligt att fatta beslut, men den kritiseras också, eftersom röster på partier under gränsen inte ger något resultat alls.

Sverige är dessutom med i EU, och en stor del av de regler som gäller här beslutas gemensamt av medlemsländerna. Vart femte år väljer svenska väljare ledamöter till Europaparlamentet, men valdeltagandet i det valet är betydligt lägre än i riksdagsvalet.

Sverige har haft allmän och lika rösträtt sedan 1921, vilket är kortare tid än många tror. Innan dess räknades rösterna olika beroende på hur mycket man tjänade, och kvinnor fick inte rösta alls i riksdagsval. Att demokratin ser självklar ut i dag betyder alltså inte att den alltid funnits. Den drevs fram av människor som krävde den.

En viktig del av demokratin är yttrandefrihet. Det innebär att människor får uttrycka sina åsikter utan att bli straffade. Pressfrihet och mötesfrihet är också centrala delar.

Att påverka handlar inte bara om att rösta. Man kan skriva till en politiker, lämna in ett medborgarförslag i sin kommun, engagera sig i en förening eller delta i en demonstration. I skolan finns elevråd, och skolan är skyldig att ge eleverna inflytande över sin utbildning.

Trots detta finns det utmaningar. Alla deltar inte i val, och vissa grupper kan ha svårare att göra sina röster hörda. Desinformation, alltså falsk information, kan också påverka hur människor tänker och röstar.

Desinformation sprids ibland med avsikt, av personer eller stater som vill att ett samhälle ska bli osäkert på vad som är sant. Målet behöver inte vara att någon ska tro på just en lögn, utan att man till slut inte litar på någonting alls. Det är därför källkritik hör så nära ihop med demokrati.

För att demokratin ska fungera bra krävs att människor är informerade och engagerade. Skolan spelar en viktig roll genom att lära elever om hur samhället fungerar.

Genom att delta i val och samhällsdebatt kan medborgare påverka sin framtid och bidra till ett mer rättvist samhälle.`,
  questions: [
    { type: 'literal', q: 'Vad innebär det att ett förslag skickas ut på remiss?',
      options: ['Att riksdagen röstar om det en första gång', 'Att myndigheter och organisationer får svara på vad de tycker', 'Att förslaget publiceras i dagstidningarna', 'Att en domstol prövar om det är tillåtet'], correct: 1 },
    { type: 'inferens', q: 'Varför är processen med att stifta lagar långsam?',
      options: ['För att riksdagen sammanträder få gånger per år', 'För att utredningarna är svåra att bemanna med folk', 'För att fel ska hinna upptäckas innan lagen gäller', 'För att samtliga partier måste vara överens först'], correct: 2 },
    { type: 'literal', q: 'Varför finns fyraprocentsspärren?',
      options: ['För att partierna ska ha råd att driva sina kampanjer', 'För att antalet platser i riksdagen ska räcka till alla', 'För att valen ska kunna genomföras snabbare än förr', 'För att riksdagen inte ska bli så uppdelad att beslut blir omöjliga'], correct: 3 },
    { type: 'inferens', q: 'Vilken kritik riktas mot spärren?',
      options: ['Att röster på små partier inte ger något resultat', 'Att den gynnar partier med stöd i storstäderna', 'Att gränsen ändras inför varje nytt val', 'Att den gör valresultatet svårare att räkna'], correct: 0 },
    { type: 'literal', q: 'Hur kan man påverka mellan valen enligt texten?',
      options: ['Genom att kräva att en ny folkomröstning hålls', 'Genom medborgarförslag, föreningar och demonstrationer', 'Genom att byta parti flera gånger under mandatperioden', 'Genom att överklaga politiska beslut i domstol'], correct: 1 },
    { type: 'sammanfatta', q: 'Vad kan målet med desinformation vara enligt texten?',
      options: ['Att sälja produkter till en bestämd grupp', 'Att få fler människor att engagera sig politiskt', 'Att man till slut inte litar på någonting alls', 'Att dölja vem som egentligen skrivit ett förslag'], correct: 2 },
  ],
},

// ── åk 7, berättelse, 188 → ~515 ord ────────────────────────────────────
'ak7-tema-046': {
  text: `När Amir började spela ett nytt onlinespel märkte han snabbt att det inte var som andra spel. Det handlade inte bara om att vinna strider, utan om att samarbeta med andra spelare från olika delar av världen. Spelet krävde strategi, kommunikation och tålamod. Amir spelade tillsammans med en grupp där alla hade olika roller.

Han var den som höll ställningen medan de andra flyttade sig. Det var inte den roll han hade valt om han fått bestämma. Ingen jublade när han gjorde sitt jobb bra, men alla märkte det när han gjorde fel.

En av spelarna, Lin, var särskilt bra på att planera. Hon såg mönster i spelet och kunde förutse vad motståndarna skulle göra. Amir lärde sig mycket av henne. Han insåg att spelet inte bara handlade om snabba reflexer, utan också om att tänka flera steg framåt.

"Du tittar på var de är", sa Lin en kväll. "Titta på var de var för trettio sekunder sedan."

Amir förstod inte först. Sedan gjorde han det, och det var som om någon tänt en lampa. Motståndarna rörde sig i mönster, precis som de själva gjorde.

Gruppen bråkade också ibland. En spelare som hette Theo blev arg när något gick fel och skrev saker han inte menade. En kväll lämnade en av de andra gruppen mitt i en match och kom aldrig tillbaka. Efter det bestämde de en regel: den som blev arg skulle stänga av mikrofonen i två minuter i stället för att skriva.

Gruppen fanns i fyra länder. Lin bodde sex timmar bort i tid, vilket betydde att hennes eftermiddag var Amirs kväll. En gång försov hon sig till en match de planerat i två veckor. Ingen blev arg. Theo skrev bara att de kunde ta den en annan dag, och Amir märkte att han själv hade blivit lugnare av att spela med dem.

Samtidigt märkte Amir att spelet tog mycket tid. Han började prioritera bort läxor och träning. Först märkte han det inte själv. Det var alltid en match till, och en match tog tjugo minuter, och tjugo minuter var ju ingenting.

Det var ett prov i matte som gjorde det tydligt. Han hade läst i tio minuter kvällen innan och trott att det räckte, för det hade det gjort förut. Det gjorde det inte längre.

Hans föräldrar blev oroliga och pratade med honom om balans. Samtalet blev inte som han hade väntat sig. De frågade inte hur mycket han spelade, utan vad han faktiskt gjorde där. Han märkte att han berättade i tjugo minuter utan att sluta, och att de lyssnade hela tiden.

Amir insåg att även om spelet var roligt, var det viktigt att inte låta det ta över.

Efter ett tag bestämde han sig för att sätta gränser. Han spelade fortfarande, men bara efter att ha gjort sina uppgifter.

Gränsen var inte lätt att hålla i början. Han satt med telefonen bredvid böckerna de första kvällarna och märkte att han läste samma stycke tre gånger. Sedan la han den i hallen.

Det gjorde att han kunde njuta mer av spelet utan att känna stress. Erfarenheten lärde honom att ansvar och nöje måste gå hand i hand.`,
  questions: [
    { type: 'inferens', q: 'Varför var Amirs roll i gruppen otacksam?',
      options: ['För att den krävde snabbast reflexer av alla i laget', 'För att ingen märkte när han lyckades men alla när han misslyckades', 'För att han var yngst av alla i gruppen', 'För att rollen byttes ut inför varje ny match'], correct: 1 },
    { type: 'literal', q: 'Vilket råd gav Lin till Amir?',
      options: ['Att öva betydligt mer på att sikta', 'Att byta till en annan roll i gruppen', 'Att titta på var motståndarna befann sig tidigare', 'Att spela färre matcher i rad varje kväll'], correct: 2 },
    { type: 'inferens', q: 'Varför införde gruppen regeln om mikrofonen?',
      options: ['För att ljudet störde de andra spelarna i rummet', 'För att Theo själv hade bett dem om det', 'För att matcherna skulle gå snabbare att spela', 'För att en spelare lämnat gruppen efter ett bråk'], correct: 3 },
    { type: 'inferens', q: 'Varför märkte Amir inte själv att spelandet tog över?',
      options: ['För att varje enskild match kändes kort', 'För att han redan slutat gå på träningarna', 'För att föräldrarna inte sa något på länge', 'För att skolarbetet var lättare just det året'], correct: 0 },
    { type: 'literal', q: 'Vad gjorde att problemet blev tydligt för honom?',
      options: ['Ett samtal med Lin efter en förlorad match', 'Ett prov i matte som han inte klarade', 'Att gruppen förlorade flera matcher i rad', 'Att träningarna krockade med speltiderna'], correct: 1 },
    { type: 'sammanfatta', q: 'Vad var oväntat med samtalet med föräldrarna?',
      options: ['Att de förbjöd honom att spela över huvud taget', 'Att de själva ville prova spelet tillsammans med honom', 'Att de frågade vad han gjorde i spelet i stället för hur mycket', 'Att de redan hade pratat med hans lärare om saken'], correct: 2 },
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
