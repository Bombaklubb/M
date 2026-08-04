#!/usr/bin/env node
//
// Sats 10: fem texter i intervallet 171–176 ord, med omskrivna frågor.

const fs = require('fs');
const path = require('path');

const NYA = {

// ── åk 8, 171 → ~550 ord ────────────────────────────────────────────────
'ak8-tema-026': {
  text: `Sociala medier har blivit en central del av många människors vardag. Plattformar där användare kan dela bilder, filmer och åsikter gör det möjligt att nå ut till många på kort tid. Detta har förändrat hur vi kommunicerar och hur information sprids i samhället.

En grundläggande sak att förstå är hur tjänsterna tjänar pengar. De flesta är gratis att använda, vilket betyder att intäkterna kommer någon annanstans ifrån: från annonsörer som betalar för att nå rätt personer. Ju längre en användare stannar kvar, desto fler annonser hinner visas. Det är därför flödet är byggt för att aldrig ta slut.

Urvalet sköts av algoritmer. En algoritm är en uppsättning regler som avgör vad som visas, och den väljer utifrån vad som fått andra att stanna kvar, inte utifrån vad som är sant eller viktigt. Innehåll som väcker starka känslor, särskilt ilska, sprids därför lättare än innehåll som är balanserat och avvägt.

En viktig aspekt är hur sociala medier påverkar vår självbild. Många användare jämför sig med andra, vilket ibland kan leda till känslor av otillräcklighet. Bilder och inlägg visar ofta en idealiserad version av verkligheten, vilket kan skapa orealistiska förväntningar.

Samtidigt erbjuder sociala medier möjligheter. De kan användas för att sprida kunskap, organisera kampanjer och skapa gemenskap. Många rörelser för mänskliga rättigheter har fått ökad uppmärksamhet genom dessa plattformar. När vittnesmål och filmer sprids direkt från platsen blir det svårare för makthavare att förneka vad som har hänt.

Ett annat mönster är att flödet blir allt likare en själv. Eftersom systemet visar mer av det man redan reagerat på kan man med tiden få intrycket att nästan alla tycker som man själv. Uttrycket filterbubbla används om just det. Effekten är omdiskuterad bland forskare, men den som bara följer konton som håller med sig får onekligen en smal bild.

Problemet uppstår när falsk information sprids. Eftersom innehåll delas snabbt kan det vara svårt att avgöra vad som är sant. Detta ställer krav på användarnas källkritiska förmåga. Studier har visat att falska påståenden ofta sprids snabbare än korrekta, dels för att de är mer överraskande, dels för att de inte behöver kontrolleras innan de publiceras.

Reklam är dessutom inte alltid märkt som reklam. En influerare som visar en produkt måste enligt svensk lag ange att inlägget är ett samarbete, men gränsen mot vanliga rekommendationer är ibland otydlig. Att ett tips känns personligt betyder inte att det är obetalt.

Anonymiteten spelar också in. Att inte behöva stå för sitt namn gör det lättare att skriva sådant man aldrig skulle säga i ett rum med människor. Samtidigt är anonymitet nödvändig för den som lever i ett land där fel åsikt är straffbar. Samma egenskap kan alltså vara både ett skydd och ett problem, beroende på vem som använder den.

Plattformarna tar också bort innehåll, och även det väcker frågor. Vem avgör var gränsen går mellan en obehaglig åsikt och en olaglig text? Besluten fattas i dag till stor del av företag och av automatiska system, och den som får ett inlägg borttaget får sällan veta exakt varför.

Forskare menar att balans är viktigt. Att använda sociala medier medvetet och reflekterat kan minska negativa effekter. Konkret kan det handla om att fråga sig vem som ligger bakom ett inlägg, varför det dykt upp just nu och vad avsändaren tjänar på att man tror på det.

Sammanfattningsvis är sociala medier ett kraftfullt verktyg som både kan påverka individer och samhället i stort.`,
  questions: [
    { type: 'inferens', q: 'Varför är flödet byggt för att aldrig ta slut?',
      options: ['För att användarna själva har efterfrågat det', 'För att fler annonser hinner visas ju längre man stannar', 'För att innehållet annars skulle bli föråldrat', 'För att plattformarna vill spara lagringsutrymme'], correct: 1 },
    { type: 'ord', q: 'Vad menas med en "algoritm" i texten?',
      options: ['En grupp anställda som granskar inlägg innan de visas', 'En avgift som annonsörer betalar för varje visning', 'En uppsättning regler som avgör vad som visas', 'Ett mått på hur många följare ett konto har'], correct: 2 },
    { type: 'inferens', q: 'Varför sprids innehåll som väcker ilska lättare?',
      options: ['För att sådana inlägg oftast är kortare än andra', 'För att de publiceras på kvällar och helger', 'För att de sällan går att anmäla till plattformen', 'För att urvalet styrs av vad som får folk att stanna kvar'], correct: 3 },
    { type: 'literal', q: 'Varför sprids falska påståenden ofta snabbare än korrekta?',
      options: ['För att de är mer överraskande och inte behöver kontrolleras', 'För att de skrivs av personer med mycket många följare', 'För att plattformarna tjänar mer pengar på dem direkt', 'För att de nästan alltid handlar om kända personer'], correct: 0 },
    { type: 'literal', q: 'Vad gäller för en influerare som visar en produkt?',
      options: ['Att produkten måste ha testats under en längre tid', 'Att inlägget måste märkas som ett samarbete', 'Att priset alltid måste anges tydligt i inlägget', 'Att inlägget bara får publiceras vid ett tillfälle'], correct: 1 },
    { type: 'sammanfatta', q: 'Vilka frågor föreslår texten att man ställer sig?',
      options: ['Hur många som gillat inlägget och när det lades upp', 'Om inlägget kommer från en vän eller från en okänd', 'Vem som ligger bakom och vad avsändaren tjänar på det', 'Om innehållet även finns på andra plattformar'], correct: 2 },
  ],
},

// ── åk 9, 173 → ~580 ord ────────────────────────────────────────────────
'ak10-tema-004-b': {
  text: `Diskriminering innebär att människor behandlas sämre än andra på grund av exempelvis kön, etnicitet, religion, funktionsvariation eller sexuell läggning. Detta strider mot principen om alla människors lika värde, som är central inom mänskliga rättigheter.

Diskriminering kan ske på olika sätt. Den kan vara direkt, till exempel om någon nekas ett jobb på grund av sin bakgrund. Den kan också vara indirekt, när regler eller strukturer missgynnar vissa grupper utan att det alltid är uppenbart. Ett krav på att en anställd ska vara minst en viss längd kan låta neutralt, men om längden saknar betydelse för arbetet stänger kravet i praktiken ute fler kvinnor än män.

En viktig sak är att avsikten inte avgör. Den som inte menat något illa kan ändå ha diskriminerat, eftersom lagen ser till effekten av handlingen. Det är en av anledningarna till att samtal om diskriminering ofta blir låsta: den ena parten försvarar sin avsikt medan den andra beskriver en följd.

En del av förklaringen ligger i hur vi tänker. Hjärnan sorterar hela tiden intryck i kategorier, eftersom det är snabbare än att bedöma varje person för sig. Den genvägen är användbar i mycket, men den gör också att vi tillskriver människor egenskaper utifrån grupp. Att erkänna att man har sådana förutfattade meningar är inte samma sak som att vara elak.

Hur vet man då att det förekommer? Ett vanligt sätt att undersöka saken är att skicka in likadana jobbansökningar där bara namnet skiljer. Sådana studier har gjorts i flera länder, även i Sverige, och de visar återkommande att ansökningar med utländskt klingande namn får färre svar än identiska ansökningar med svenskklingande namn. Eftersom allt annat i ansökningarna är lika går resultatet inte att förklara med skillnader i kompetens.

Diskriminering behöver inte heller vara en handling av en enskild person. Om en skola i ett område har färre behöriga lärare, eller om ett bostadsområde har sämre kollektivtrafik, uppstår skillnader utan att någon fattat ett beslut med den avsikten. Sådana mönster brukar kallas strukturella, och de är svårare att komma åt eftersom det saknas en tydlig ansvarig att vända sig till.

Lagstiftning i många länder förbjuder diskriminering, men lagar räcker inte alltid. Normer, attityder och fördomar kan påverka hur människor behandlas i vardagen. Det är dessutom svårt att bevisa ett enskilt fall: den som söker ett jobb får sällan veta varför tjänsten gick till någon annan.

Diskriminering kan också ta formen av trakasserier: kommentarer, skämt eller beteenden som kränker någon utifrån en av grunderna. Den som utsätts beskriver ofta att det svåraste inte är den enskilda kommentaren utan att den återkommer, och att omgivningen låter den passera. Det är en av anledningarna till att den som ser något har betydelse. Ett kort påpekande från en utomstående ändrar vad som räknas som normalt i en grupp.

Ett omdiskuterat verktyg är särskilda åtgärder för att jämna ut skillnader, till exempel att aktivt söka upp sökande från underrepresenterade grupper. Kritiker menar att det innebär att någon väljs bort på fel grund, medan förespråkare menar att ett urval som ser neutralt ut i praktiken redan gynnar vissa. Frågan handlar i grunden om vad rättvisa betyder: lika behandling här och nu, eller lika möjligheter över tid.

Ett viktigt arbete för att motverka diskriminering är utbildning och medvetenhet. Genom att förstå olika perspektiv och erfarenheter kan människor bli mer empatiska och inkluderande.

Att arbeta mot diskriminering är en del av att stärka mänskliga rättigheter. Det handlar om att förändra både strukturer och attityder, så att alla människor får samma möjligheter och bemöts med respekt.`,
  questions: [
    { type: 'inferens', q: 'Varför kan ett krav på en viss längd vara indirekt diskriminerande?',
      options: ['För att det är svårt att kontrollera vid en anställning', 'För att det stänger ute fler kvinnor utan att ha betydelse för arbetet', 'För att längden varierar mellan olika åldersgrupper', 'För att kravet sällan framgår av själva platsannonsen'], correct: 1 },
    { type: 'literal', q: 'Vad avgör om något räknas som diskriminering enligt lagen?',
      options: ['Avsikten hos den som handlat', 'Hur många personer som berörts', 'Effekten av handlingen', 'Om händelsen har upprepats'], correct: 2 },
    { type: 'literal', q: 'Hur undersöks förekomsten av diskriminering vid rekrytering?',
      options: ['Genom att intervjua arbetsgivare om deras attityder', 'Genom att jämföra lönenivåer i olika branscher', 'Genom att räkna hur många som anmäler diskriminering', 'Genom att skicka likadana ansökningar där bara namnet skiljer'], correct: 3 },
    { type: 'inferens', q: 'Varför går resultaten av sådana studier inte att förklara med kompetens?',
      options: ['För att alla sökande i verkligheten hade samma utbildning', 'För att allt utom namnet i ansökningarna var identiskt', 'För att arbetsgivarna kände till att en studie pågick', 'För att ingen av sökandena kallades vidare till intervju'], correct: 1 },
    { type: 'inferens', q: 'Varför är strukturell diskriminering svårare att komma åt?',
      options: ['För att den bara förekommer i vissa delar av landet', 'För att den sällan får några praktiska följder alls', 'För att det saknas någon som fattat ett sådant beslut', 'För att den inte omfattas av någon lagstiftning'], correct: 2 },
    { type: 'sammanfatta', q: 'Vad handlar frågan om särskilda åtgärder i grunden om?',
      options: ['Om lagarna bör skärpas eller i stället mildras', 'Om arbetsgivarna eller staten ska bära ansvaret', 'Om diskriminering över huvud taget förekommer i dag', 'Om rättvisa betyder lika behandling nu eller lika möjligheter över tid'], correct: 3 },
  ],
},

// ── åk 7, 175 → ~515 ord ────────────────────────────────────────────────
'ak7-tema-027': {
  text: `Teknikens utveckling har förändrat människors liv på många sätt genom historien. Från enkla verktyg av sten till dagens avancerade datorer har varje steg gjort vardagen enklare men också mer komplex. Under industrialiseringen började maskiner ersätta manuellt arbete, vilket ledde till stora samhällsförändringar.

Industrialiseringen är ett bra exempel på att teknik sällan påverkar bara en sak. När fabrikerna byggdes flyttade människor från landsbygden till städerna, vilket förändrade var de bodde, vilka de arbetade med och hur familjer såg ut. Många fick det bättre på sikt, men de första årtiondena innebar långa arbetsdagar, farliga maskiner och barnarbete. Förbättringarna kom först när arbetarna organiserade sig och lagar infördes.

Ett annat mönster är att ny teknik nästan alltid möts av oro. När järnvägen kom varnade läkare för att den höga hastigheten skulle skada resenärerna. När telefonen kom trodde många att brevskrivandet skulle försvinna helt. En del av oron visade sig obefogad, men inte all: rädslan för att maskiner skulle ta jobb var befogad för många enskilda människor, även om det totala antalet arbeten växte.

Idag använder vi teknik i nästan alla delar av livet. Mobiltelefoner, internet och artificiell intelligens är exempel på modern teknik som påverkar hur vi kommunicerar och arbetar. Många yrken kräver nu digital kompetens, och skolor lägger större fokus på att lära ut tekniska färdigheter.

Artificiell intelligens är det tydligaste exemplet just nu. Program kan i dag skriva text, känna igen bilder och föreslå svar, och de gör det genom att hitta mönster i enorma mängder material. Det betyder att de blir bra på det som liknar sådant de sett förut, men opålitliga när något är nytt. Ett program som låter säkert kan alltså ha helt fel, och det syns inte på svaret.

Samtidigt finns det utmaningar. Teknik kan skapa beroende och påverka människors hälsa. Sociala medier kan bidra till stress och jämförelse mellan människor. Dessutom finns frågor om integritet och hur data används av företag och organisationer.

Tekniken har också en baksida som sällan syns. Att tillverka en mobiltelefon kräver metaller som bryts under svåra förhållanden, och den el som driver internet måste produceras någonstans. Att något känns tunt och tyst betyder inte att det är resurssnålt.

Teknik är dessutom ojämnt fördelad. Tillgång till snabbt internet, en fungerande dator och kunskap om hur de används skiljer sig både mellan länder och mellan hushåll i samma stad. När allt fler tjänster bara finns digitalt blir den skillnaden till ett hinder i vardagen.

Trots detta fortsätter tekniken att utvecklas snabbt. Forskare arbetar med att skapa hållbara lösningar, som förnybar energi och smarta städer. Målet är att använda teknik på ett sätt som gynnar både människor och miljö.

Vem som får bestämma över tekniken är en fråga som växer. Beslut om hur ett program ska fungera fattas ofta av företag, inte av valda politiker, och de får ändå följder för mycket stora grupper. Att förstå tekniken är därför inte bara nyttigt för den som vill arbeta med den, utan en förutsättning för att kunna vara med och diskutera hur den ska användas.

Framtiden är svår att förutse, men det är tydligt att teknik kommer att spela en central roll i samhällets utveckling.`,
  questions: [
    { type: 'inferens', q: 'Varför nämns barnarbete i samband med industrialiseringen?',
      options: ['För att visa att tekniken först var för dyr för vuxna', 'För att förklara varför fabrikerna byggdes just i städerna', 'För att visa att förbättringarna inte kom automatiskt', 'För att peka på att barn arbetade snabbare än vuxna'], correct: 2 },
    { type: 'literal', q: 'Vad varnade läkare för när järnvägen kom?',
      options: ['Att hastigheten skulle skada resenärerna', 'Att rälsen skulle förstöra värdefull jordbruksmark', 'Att bullret skulle störa dem som bodde i städerna', 'Att biljetterna skulle bli för dyra för vanligt folk'], correct: 0 },
    { type: 'inferens', q: 'Vilken farhåga kring ny teknik beskrivs som delvis befogad?',
      options: ['Att brevskrivandet skulle upphöra helt och hållet', 'Att maskiner skulle ta jobb från enskilda människor', 'Att resandet skulle bli farligare än det varit förut', 'Att människor skulle sluta träffas i verkligheten'], correct: 1 },
    { type: 'literal', q: 'Vilken dold baksida av tekniken tar texten upp?',
      options: ['Att programmen blir alltför svåra att lära sig', 'Att gamla yrkeskunskaper glöms bort med tiden', 'Att metaller bryts under svåra förhållanden och el måste produceras', 'Att teknik snabbt blir omodern och behöver bytas ut'], correct: 2 },
    { type: 'inferens', q: 'Varför beskrivs frågan om vem som bestämmer över tekniken som växande?',
      options: ['För att politikerna sällan använder tekniken själva', 'För att lagarna numera ändras oftare än förut', 'För att tekniken utvecklas i allt fler länder samtidigt', 'För att företag fattar beslut som får följder för mycket stora grupper'], correct: 3 },
    { type: 'sammanfatta', q: 'Vilken hållning till teknik har texten?',
      options: ['Att utvecklingen bör bromsas tills riskerna är lösta', 'Att tekniken löser de flesta problem av sig själv', 'Att teknik i huvudsak har varit farlig för samhället', 'Att teknik ger både möjligheter och problem som måste diskuteras'], correct: 3 },
  ],
},

// ── åk 7, 176 → ~515 ord ────────────────────────────────────────────────
'ak7-tema-022': {
  text: `När människor använder internet lämnar de ofta efter sig digitala spår. Det kan handla om vilka sidor man besöker, vad man söker efter och vilka appar man använder. Dessa spår samlas in av företag och organisationer för olika syften. Ibland används informationen för att förbättra tjänster, men den kan också användas för riktad reklam.

Spåren är fler än de flesta tror. Utöver det man själv skriver in registreras sådant som vilken telefon man har, var man befinner sig, hur länge man tittar på ett inlägg och vid vilka tider på dygnet man är vaken. Var och en av de uppgifterna säger ganska lite, men tillsammans bildar de en förvånansvärt detaljerad bild av en person.

Den bilden kallas en profil. Utifrån den kan ett företag gissa sig till saker man aldrig berättat: ungefär hur gammal man är, vad man är intresserad av och ibland till och med hur humöret varierar över veckan. Profilen används sedan för att välja vilka annonser som visas, men den kan också säljas vidare till andra företag.

Uppgifterna byter också ägare. Det finns företag som köper och säljer data om människor utan att någonsin ha haft kontakt med dem. En annons du ser i en app kan därför bygga på något du sökte efter i en helt annan tjänst för flera månader sedan. Att uppgifterna sprids gör det svårt att veta vem som egentligen har dem.

Många tänker inte på hur mycket information de delar. När man accepterar villkor utan att läsa dem kan man ge bort rättigheter till sina egna uppgifter. Detta kan innebära att företag lagrar och analyserar beteenden över lång tid.

Samtidigt finns det lagar som ska skydda användare. Inom EU finns regler som kräver att företag måste informera om hur data används. Regelverket kallas GDPR och infördes 2018. Användare har också rätt att begära ut vad ett företag sparat om dem, och att få uppgifterna raderade.

Rutorna om kakor, som dyker upp på nästan varje webbplats, kommer från samma regler. Tanken är att man ska få välja, men i praktiken är de ofta utformade så att det tar ett klick att säga ja och flera att säga nej. Att många väljer det enklaste alternativet säger därför inte särskilt mycket om vad de faktiskt vill.

Ett digitalt spår är dessutom svårt att sudda ut. En bild som lagts upp kan ha sparats av andra innan den togs bort, och en kommentar kan finnas kvar i skärmbilder långt efter att kontot raderats.

Allt insamlande är samtidigt inte till skada. Kartappar hittar rätt väg för att många telefoner rapporterar var det står still i trafiken, och en söktjänst blir bättre av att veta vad folk faktiskt letar efter. Frågan är alltså inte om uppgifter ska samlas in, utan hur mycket, till vad och med vems tillåtelse.

Det är viktigt att vara medveten om sin digitala närvaro. Genom att använda starka lösenord, vara försiktig med vad man delar och kontrollera sina inställningar kan man skydda sin integritet. Det finns också sökmotorer och webbläsare som samlar in betydligt mindre än de vanligaste alternativen.

Digitala spår är en naturlig del av det moderna samhället, men det kräver kunskap för att hantera dem på ett säkert sätt.`,
  questions: [
    { type: 'literal', q: 'Vad registreras utöver det man själv skriver in?',
      options: ['Vilken telefon man har och var man befinner sig', 'Vilka personer som finns i ens kontaktlista', 'Vilka lösenord man använder på olika sidor', 'Hur mycket pengar man har på sitt konto'], correct: 0 },
    { type: 'ord', q: 'Vad menas med en "profil" i texten?',
      options: ['En sida där man beskriver sig själv för andra', 'Ett konto som andra användare kan följa', 'En sammanställning som låter företag gissa saker om en', 'En inställning som styr vad andra får se om en'], correct: 2 },
    { type: 'literal', q: 'Vad heter EU:s regelverk och när infördes det?',
      options: ['GDPR, som infördes redan 2010', 'GDPR, som infördes 2018', 'DSA, som infördes 2018', 'DSA, som infördes så sent som 2022'], correct: 1 },
    { type: 'inferens', q: 'Varför säger klicken på kakrutorna lite om vad användarna vill?',
      options: ['För att rutorna ofta visas på fel språk', 'För att de flesta inte vet vad kakor är för något', 'För att valet inte sparas till nästa besök på sidan', 'För att det tar ett klick att säga ja och flera att säga nej'], correct: 3 },
    { type: 'inferens', q: 'Varför blir bilden detaljerad trots att varje uppgift säger lite?',
      options: ['För att uppgifterna tillsammans bildar ett mönster', 'För att företagen kompletterar med egna intervjuer', 'För att användarna själva fyller i uppgifterna', 'För att uppgifterna sparas i original hela tiden'], correct: 0 },
    { type: 'sammanfatta', q: 'Vilket råd ger texten till läsaren?',
      options: ['Att använda internet så sällan som det går', 'Att alltid tacka nej till samtliga kakor', 'Att använda starka lösenord och se över sina inställningar', 'Att bara använda appar som kostar pengar att ladda ner'], correct: 2 },
  ],
},

// ── åk 9, 176 → ~580 ord ────────────────────────────────────────────────
'ak10-tema-003-b': {
  text: `Barn har särskilda rättigheter som erkänns i en internationell överenskommelse kallad barnkonventionen. Den antogs av Förenta nationerna 1989 och syftar till att skydda barns liv, utveckling och välmående. Alla barn, oavsett bakgrund, ska ha samma rättigheter.

Tanken att barn behöver ett eget skydd är yngre än man kan tro. Länge betraktades barn juridiskt som en del av familjen snarare än som egna personer med rättigheter. Den polske läkaren och pedagogen Janusz Korczak hörde till dem som tidigt drev motsatsen, och hans idéer om barnets rätt till respekt påverkade det arbete som senare ledde fram till konventionen. Att det tog nästan hela 1900-talet innan den antogs säger något om hur långsamt sådana förändringar går.

Konventionen brukar sammanfattas i fyra grundprinciper: att inget barn får diskrimineras, att barnets bästa ska komma i främsta rummet vid beslut som rör barn, att varje barn har rätt till liv och utveckling, och att barn har rätt att uttrycka sin åsikt och bli lyssnade på. De fyra principerna ska användas när man tolkar alla de övriga artiklarna.

Att ett barn ska få komma till tals betyder inte att barnet bestämmer. Det innebär att åsikten ska efterfrågas och tillmätas betydelse i förhållande till ålder och mognad. Skillnaden är viktig, eftersom en vanlig invändning mot konventionen bygger på missförståndet att vuxna skulle förlora rätten att fatta beslut.

En viktig del av barnkonventionen är rätten till utbildning. Skolan ska vara tillgänglig och ge barn möjlighet att utveckla sina kunskaper och färdigheter. Utbildning anses vara avgörande för att bryta fattigdom och skapa bättre framtidsmöjligheter.

Barn har också rätt till skydd mot våld, utnyttjande och diskriminering. I vissa delar av världen arbetar barn istället för att gå i skolan, vilket kan påverka deras hälsa och framtid negativt. Frågan är dock mer sammansatt än den ser ut vid första anblicken. Ett förbud som genomförs utan att familjens inkomst ersätts kan leda till att barnet i stället arbetar dolt, under sämre villkor. Organisationer som arbetar med barnarbete brukar därför kombinera skolgång med ekonomiskt stöd till familjen.

Vissa kränkningar drabbar flickor särskilt. Barnäktenskap förekommer fortfarande i många länder, och en flicka som gifts bort som barn avbryter nästan alltid sin skolgång. Konsekvenserna följer med resten av livet: lägre inkomst, sämre hälsa och mindre möjlighet att bestämma över sin egen tillvaro. Insatser som visat sig fungera handlar ofta om att göra det ekonomiskt möjligt för familjen att låta dottern gå kvar i skolan.

Trots att många länder har skrivit under konventionen finns det fortfarande stora utmaningar. Krig, fattigdom och brist på resurser gör att barns rättigheter inte alltid uppfylls. I väpnade konflikter drabbas barn dubbelt: dels av själva våldet, dels av att skolor, sjukvård och vattenförsörjning slås ut under lång tid efteråt.

I Sverige blev barnkonventionen svensk lag 2020. Det innebar inte att allt förändrades över en natt, men att domstolar och myndigheter måste väga in barnets bästa direkt med stöd av lagen, i stället för att bara se det som en målsättning. Vilka praktiska följder förändringen får är fortfarande något som prövas fall för fall.

Utvecklingen går ändå åt rätt håll på flera punkter. Barnadödligheten i världen har mer än halverats sedan 1990, och andelen barn som går i grundskola har stigit kraftigt. Framstegen är dock ojämnt fördelade, och de går snabbast där det redan fanns fungerande skolor och sjukvård. Att veta var framstegen uteblivit är därför lika viktigt som att räkna dem som skett.

Att arbeta för barns rättigheter handlar om både lagstiftning och praktiska åtgärder. Det kräver samarbete mellan regeringar, organisationer och individer.`,
  questions: [
    { type: 'literal', q: 'Vilka är barnkonventionens fyra grundprinciper?',
      options: ['Skolgång, sjukvård, bostad och tillräckligt med mat', 'Icke-diskriminering, barnets bästa, utveckling och delaktighet', 'Skydd mot våld, mot arbete, mot krig och mot fattigdom', 'Yttrandefrihet, religionsfrihet, mötesfrihet och rösträtt'], correct: 1 },
    { type: 'inferens', q: 'Vad innebär barnets rätt att komma till tals?',
      options: ['Att barnet självt fattar beslutet i frågor som rör det', 'Att vuxna måste följa barnets önskemål i skolan', 'Att åsikten ska efterfrågas och väga in efter ålder och mognad', 'Att barn får rösta i frågor som gäller deras egen skola'], correct: 2 },
    { type: 'inferens', q: 'Varför kan ett förbud mot barnarbete få oväntade följder?',
      options: ['För att företagen flyttar produktionen till andra länder', 'För att skolorna saknar plats för alla nya elever', 'För att förbudet är svårt att kontrollera på landsbygden', 'För att barnet kan tvingas arbeta dolt om inkomsten inte ersätts'], correct: 3 },
    { type: 'literal', q: 'Hur drabbas barn dubbelt i väpnade konflikter?',
      options: ['Av själva våldet och av att samhällsfunktioner slås ut', 'Av flykten och av att skolgången blir dyrare att ordna', 'Av hunger och av att föräldrarna tvingas arbeta mer', 'Av sjukdomar och av att gränserna hålls stängda'], correct: 0 },
    { type: 'literal', q: 'Vad innebar det att konventionen blev svensk lag 2020?',
      options: ['Att Sverige skrev under konventionen för första gången', 'Att alla tidigare svenska lagar om barn upphävdes', 'Att domstolar måste väga in barnets bästa med stöd av lagen', 'Att barn fick rätt att överklaga alla beslut som rör dem'], correct: 2 },
    { type: 'sammanfatta', q: 'Vilken bild av arbetet för barns rättigheter ger texten?',
      options: ['Att lagstiftning ensam löser problemen om den bara följs', 'Att konventionen i praktiken saknar egentlig betydelse', 'Att ansvaret helt ligger hos internationella organisationer', 'Att både lagar och praktiska åtgärder behövs'], correct: 3 },
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
