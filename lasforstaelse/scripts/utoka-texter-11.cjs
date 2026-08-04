#!/usr/bin/env node
//
// Sats 11: fem texter i intervallet 177–180 ord, med omskrivna frågor.

const fs = require('fs');
const path = require('path');

const NYA = {

// ── åk 9, 177 → ~580 ord ────────────────────────────────────────────────
'ak10-obama-001': {
  text: `Barack Obama föddes 1961 i Hawaii i USA. Hans mamma var från USA och hans pappa från Kenya. Under sin uppväxt bodde han både i USA och i Indonesien, vilket gav honom erfarenheter från olika kulturer. Denna bakgrund kom senare att påverka hans syn på världen och politik.

Föräldrarna separerade när han var mycket liten. Fadern reste tillbaka till Kenya för att arbeta, och far och son träffades bara en gång till, under några veckor när Barack var tio år. Att växa upp med en frånvarande förälder som samtidigt fanns som en berättelse i familjen har han själv beskrivit som avgörande: han fick förhålla sig till en bild snarare än till en person.

Modern gifte om sig och familjen flyttade till Indonesien, där han gick i skola mellan sex och tio års ålder. Åren där innebar ett annat språk, en annan religion i omgivningen och en fattigdom han inte sett tidigare. Han har senare sagt att erfarenheten gjorde det svårt för honom att se USA som världens självklara mittpunkt.

När han var tio skickades han tillbaka till Hawaii för att gå i skola, och bodde där hos sina morföräldrar. De var vita och kom från Kansas, och han var en av mycket få svarta elever på sin skola. Under tonåren läste han sig igenom det som fanns skrivet av svarta amerikanska författare, delvis för att förstå en erfarenhet han inte kunde dela med någon i sitt eget hem.

Frågan om vem han var återkom under hela ungdomen. Han var svart men uppvuxen av vita släktingar, amerikan men med en far från Kenya, och han passade inte helt in i någon av de grupper omgivningen erbjöd. I stället för att välja en tillhörighet kom han att beskriva sig som någon som kunde röra sig mellan flera.

Obama studerade vid flera universitet, bland annat Columbia University och Harvard Law School. På Harvard blev han den första svarta redaktören för en prestigefylld juridisk tidskrift, vilket väckte stor uppmärksamhet. Tidskriften hade då funnits i över hundra år, och valet uppmärksammades i nyheter över hela landet. Det ledde också till ett bokkontrakt, långt innan han var känd för något annat.

Innan han blev politiker arbetade Obama som samhällsorganisatör i Chicago. Där hjälpte han människor i utsatta områden att förbättra sina livsvillkor. Arbetet var mindre glamoröst än det låter: det handlade om att kalla till möten dit få kom, att förhandla med kommunen om asbest i hyreshus och att övertala människor som slutat tro att något kunde ändras. Han arbetade också som jurist och undervisade i juridik.

Michelle Robinson, som han senare gifte sig med, var först hans handledare på en advokatbyrå i Chicago. Hon hade vuxit upp i samma stad, i en familj där ingen tidigare studerat vid ett elitlärosäte.

Hans politiska karriär började i delstaten Illinois, där han valdes till delstatssenaten. Senare blev han senator på nationell nivå.

Erfarenheterna sammanfattade han i boken Dreams from My Father, som kom ut 1995. Den skrevs innan han var en känd politiker och handlar mer om sökandet efter fadern och efter en egen identitet än om politik. Att boken fanns gjorde att många senare kunde läsa hans livshistoria med hans egna ord, i stället för i andras beskrivningar.

Obamas bakgrund anses av många ha bidragit till hans förmåga att förstå olika perspektiv. Hans erfarenheter från olika miljöer gjorde honom till en politiker som ofta betonade samarbete och dialog.

Hans livshistoria har inspirerat många människor, särskilt unga, att engagera sig i samhället och tro på möjligheten att skapa förändring.`,
  questions: [
    { type: 'literal', q: 'Hur många gånger träffade Obama sin far efter separationen?',
      options: ['En gång, under några veckor', 'Varje sommar under hela uppväxten', 'Aldrig efter det allra första året', 'Först när han själv var vuxen'], correct: 0 },
    { type: 'inferens', q: 'Varför beskriver Obama faderns frånvaro som avgörande?',
      options: ['För att familjen fick det svårt ekonomiskt utan honom', 'För att han fick förhålla sig till en bild snarare än en person', 'För att han tvingades flytta flera gånger som barn', 'För att han aldrig fick veta vad fadern hette'], correct: 1 },
    { type: 'inferens', q: 'Vad gjorde åren i Indonesien enligt texten?',
      options: ['De gav honom ett yrke att falla tillbaka på', 'De fick honom att bestämma sig för att bli politiker', 'De gjorde det svårt att se USA som världens mittpunkt', 'De förklarar varför han senare studerade juridik'], correct: 2 },
    { type: 'literal', q: 'Varför läste han svarta amerikanska författare under tonåren?',
      options: ['För att en lärare hade gett honom den uppgiften', 'För att han redan då planerade att skriva en egen bok', 'För att skolbiblioteket saknade böcker i andra ämnen', 'För att förstå en erfarenhet han inte kunde dela hemma'], correct: 3 },
    { type: 'literal', q: 'Hur beskrivs arbetet som samhällsorganisatör?',
      options: ['Möten dit få kom och förhandlingar om asbest i hyreshus', 'Föreläsningar för stora grupper i Chicagos skolor', 'Insamlingar till kampanjer inför de kommande valen', 'Rådgivning till företag som ville etablera sig i staden'], correct: 0 },
    { type: 'sammanfatta', q: 'Vad gjorde boken Dreams from My Father betydelsefull?',
      options: ['Den blev grunden för hans allra första valkampanj', 'Den lät många läsa hans historia med hans egna ord', 'Den innehöll hans förslag på politiska reformer', 'Den skrevs tillsammans med hans far i Kenya'], correct: 1 },
  ],
},

// ── åk 9, 177 → ~580 ord ────────────────────────────────────────────────
'ak10-arsenal-003': {
  text: `Arsenal har en stor och engagerad supporterbas som sträcker sig långt utanför England. Supportrar följer laget genom både framgångar och svårare perioder, vilket skapar en stark gemenskap.

Klubbens historia förklarar en del av identiteten. Arsenal grundades 1886 av arbetare vid en vapenfabrik i Woolwich i sydöstra London, vilket är förklaringen till både namnet och kanonen i emblemet. År 1913 flyttade klubben norrut till Highbury, till ett område där ett annat lag redan fanns. Den flytten är en av rötterna till rivaliteten med Tottenham, som fortfarande är den match många supportrar bryr sig allra mest om.

På matchdagar samlas fans från olika bakgrunder för att stötta laget. Emirates Stadium fylls av sånger, flaggor och förväntan. Denna atmosfär bidrar till upplevelsen av fotboll som mer än bara en sport. Mycket av det som händer runt en match är dessutom rutiner: samma väg till arenan, samma pub, samma plats på läktaren och samma personer bredvid sig i tjugo år.

Sångerna har egna historier. De flesta är lånade melodier med nya texter, ofta skrivna på några minuter och spridda utan att någon vet vem som hittade på dem. En sång om en spelare kan leva kvar långt efter att spelaren lämnat klubben, vilket gör läktaren till ett slags minne som förs vidare muntligt.

Vissa säsonger fungerar som gemensamma referenspunkter. Laget som gick genom hela ligasäsongen 2003–2004 utan en enda förlust kallas fortfarande the Invincibles, och det är en berättelse som förs vidare till supportrar som inte var födda då.

Vilket lag man håller på bestäms sällan av ett eget val. De flesta ärver det av en förälder eller får det av vännerna i kvarteret, ofta innan de är gamla nog att förstå vad det innebär. Det förklarar en del av lojaliteten: att byta lag betraktas inte som ett byte av smak utan närmast som ett svek.

Supporterkulturen kring Arsenal präglas av både lojalitet och kritiskt tänkande. Fansen är inte rädda för att uttrycka sina åsikter om klubbens ledning eller prestationer. Detta kan ibland skapa debatt, men det visar också hur engagerade supportrarna är. Klubben har flera organiserade supporterföreningar som möter ledningen regelbundet, och vid ett par tillfällen har protester lett till att beslut har ändrats.

Att vara kritisk och att vara lojal går alltså ihop. En supporter som klagar högljutt på ledningen är ofta samma person som köper säsongskort år efter år. Utomstående tolkar ibland kritiken som bristande stöd, men inifrån är den snarare ett uttryck för att det spelar roll.

Sociala medier har förändrat hur supportrar kommunicerar. Diskussioner sker inte längre bara på arenan eller puben, utan också online. Detta gör att fler kan delta i samtalet, men det kan också leda till konflikter. En särskild form är kanaler där supportrar filmar sina reaktioner direkt efter matcherna. De når enorm publik, men de belönar också de starkaste åsikterna, eftersom lugna analyser sällan får lika många visningar.

Arsenals supporterbas är dessutom mångsidig. Den inkluderar människor i olika åldrar, kön och livssituationer. Denna variation gör att klubben speglar en bredare samhällsbild. En stor del av supportrarna har aldrig varit på Emirates, utan följer laget från andra länder och tidszoner, ibland mitt i natten.

Damlagets publik har vuxit snabbt de senaste åren och fört med sig en delvis annan stämning, med fler barn och familjer på läktarna. Om det förblir så när intresset växer ytterligare är en fråga som diskuteras bland supportrarna själva.

Sammanfattningsvis är supporterkulturen en viktig del av Arsenals identitet. Den visar hur sport kan förena människor samtidigt som den ger utrymme för olika perspektiv.`,
  questions: [
    { type: 'literal', q: 'Varifrån kommer klubbens namn och emblem?',
      options: ['Från en vapenfabrik i Woolwich där grundarna arbetade', 'Från en gata i norra London alldeles nära Highbury', 'Från en militär förläggning i stadens norra utkant', 'Från en av klubbens allra tidigaste ordförande'], correct: 0 },
    { type: 'inferens', q: 'Vad är en av rötterna till rivaliteten med Tottenham?',
      options: ['Att lagen möttes i en avgörande cupfinal tidigt', 'Att Arsenal flyttade till ett område där Tottenham redan fanns', 'Att klubbarna under några år delade samma arena', 'Att supportrarna kommer från exakt samma stadsdel'], correct: 1 },
    { type: 'inferens', q: 'Varför beskrivs läktaren som ett slags minne?',
      options: ['För att de äldre supportrarna sitter på samma platser', 'För att klubben spelat in sina matcher sedan lång tid', 'För att sånger om spelare lever kvar efter att de lämnat', 'För att supportrarna för anteckningar om alla resultat'], correct: 2 },
    { type: 'literal', q: 'Vad har supporterföreningarnas arbete lett till?',
      options: ['Att biljetterna numera delas ut genom lottning', 'Att klubben bytt emblem vid flera olika tillfällen', 'Att matcherna har flyttats till helgerna igen', 'Att beslut har ändrats efter protester vid ett par tillfällen'], correct: 3 },
    { type: 'inferens', q: 'Varför belönar reaktionskanalerna de starkaste åsikterna?',
      options: ['För att lugna analyser sällan får lika många visningar', 'För att klubben styr vad som får publiceras där', 'För att sändningarna sker direkt efter matchens slut', 'För att de flesta tittarna är supportrar utomlands'], correct: 0 },
    { type: 'sammanfatta', q: 'Vad säger texten om damlagets publik?',
      options: ['Att den till största delen består av samma personer som förut', 'Att den vuxit snabbt och fört med sig fler barn och familjer', 'Att den minskat sedan matcherna flyttades till Emirates', 'Att den följer laget främst genom sändningar utomlands'], correct: 1 },
  ],
},

// ── åk 7, 178 → ~515 ord ────────────────────────────────────────────────
'ak7-tema-045': {
  text: `Vänskap är en viktig del av livet för många människor. En bra vän kan ge stöd, glädje och trygghet. Vänskap bygger på tillit, respekt och att man bryr sig om varandra.

Respekt innebär att acceptera andra människor som de är, även om man tycker olika. I en vänskap är det viktigt att lyssna, vara ärlig och visa hänsyn. Konflikter kan uppstå, men de kan lösas genom samtal och förståelse.

Att lyssna är svårare än det låter. Många lyssnar egentligen bara tills de själva får ordet, och tänker under tiden ut vad de ska svara. Att i stället ställa en följdfråga, eller upprepa vad den andra sagt för att kontrollera att man förstått rätt, gör ofta större skillnad än ett bra råd.

Att be om ursäkt är svårare än det verkar. En ursäkt som fortsätter med ett men blir sällan mottagen som en ursäkt. Det som brukar fungera är enkelt men obekvämt: säga vad man gjorde, säga att det var fel och sedan låta den andra reagera.

Alla människor är olika, och det kan vara en styrka i en vänskap. Personer med olika bakgrund, intressen eller förmågor kan lära av varandra. Till exempel kan Alex, som använder rullstol, och Sam, som älskar sport, hitta sätt att umgås och ha roligt tillsammans.

Vänskaper förändras dessutom över tid, och det behöver inte betyda att något har gått fel. Människor byter skola, får nya intressen och utvecklas i olika takt. Att en vänskap blir mindre nära är inte alltid ett svek, även om det kan kännas så för den som märker förändringen först.

Ibland kan grupptryck påverka vänskap. Det kan vara svårt att stå upp för sig själv eller andra. Därför är det viktigt att våga säga ifrån om något känns fel. Grupptryck är sällan uttalat: ingen säger åt någon att skratta åt ett elakt skämt, men den som inte skrattar märks. Just därför räcker det ofta att en enda person låter bli, eftersom det gör det möjligt för fler att göra likadant.

En vänskap kan också vara ojämn. Om en person alltid bestämmer, alltid blir uppringd först eller alltid får sätta villkoren, är det värt att lägga märke till. Att vara omtyckt är inte samma sak som att bli respekterad, och den som ständigt anpassar sig för att få vara kvar betalar ett pris som sällan syns utifrån.

Många vänskaper finns i dag delvis på nätet. Att skriva med någon varje dag kan kännas nära, men skrift saknar tonfall, och ett kort svar kan läsas som ilska när det bara var brådska. Det är en av anledningarna till att missförstånd uppstår snabbare i en chatt än i ett samtal.

Alla har inte en kompis att gå till. Den som känner sig utanför under lång tid mår ofta dåligt av det, och det är ett skäl att berätta för en vuxen.

Skolan är en plats där många vänskaper bildas. Genom att visa respekt och inkludera andra kan man bidra till en trygg miljö. Att fråga någon som står ensam om den vill vara med kostar lite och betyder ofta mer än den som frågar tror.

Vänskap handlar inte om att vara lika, utan om att acceptera och uppskatta varandra.`,
  questions: [
    { type: 'inferens', q: 'Varför beskrivs det som svårt att lyssna?',
      options: ['För att det tar lång tid att höra hela berättelsen', 'För att många lyssnar bara tills de själva får ordet', 'För att man ofta hör fel när det är många i rummet', 'För att det är svårt att komma ihåg allt som sagts'], correct: 1 },
    { type: 'literal', q: 'Vad föreslår texten i stället för att ge ett råd?',
      options: ['Att byta ämne om samtalet känns jobbigt', 'Att berätta om en liknande egen erfarenhet', 'Att ställa en följdfråga eller upprepa det som sagts', 'Att vänta med att svara till nästa dag'], correct: 2 },
    { type: 'inferens', q: 'Varför behöver en vänskap som förändras inte betyda att något gått fel?',
      options: ['För att alla vänskaper är tänkta att ta slut', 'För att man ändå träffas igen senare i livet', 'För att förändringen sällan märks av någon av dem', 'För att människor byter skola och utvecklas i olika takt'], correct: 3 },
    { type: 'inferens', q: 'Varför räcker det ofta att en enda person låter bli att skratta?',
      options: ['För att det gör det möjligt för fler att göra likadant', 'För att skämtet då inte hörs av hela gruppen', 'För att den som skämtade genast slutar med det', 'För att läraren då märker vad som håller på att hända'], correct: 0 },
    { type: 'literal', q: 'Vad kan tyda på att en vänskap är ojämn?',
      options: ['Att man inte har riktigt samma intressen', 'Att en person alltid får sätta villkoren', 'Att man ses lite mer sällan än förut', 'Att man tillhör olika grupper i skolan'], correct: 1 },
    { type: 'sammanfatta', q: 'Vilken skillnad gör texten mellan att vara omtyckt och att bli respekterad?',
      options: ['Att bara den som är omtyckt får vara med i gruppen', 'Att respekt gäller vuxna medan omtyckthet gäller unga', 'Att den som ständigt anpassar sig betalar ett pris', 'Att omtyckthet är svårare att uppnå än respekt'], correct: 2 },
  ],
},

// ── åk 9, 178 → ~580 ord ────────────────────────────────────────────────
'akgy-abba-004': {
  text: `ABBA har haft ett stort inflytande på populärkulturen långt efter att gruppen slutade vara aktiv. Deras musik har använts i filmer, tv-serier, reklam och scenproduktioner världen över. Ett tydligt exempel är musikalen Mamma Mia!, som bygger på deras låtar och berättar en ny historia.

Musikalen hade premiär i London 1999 och blev snabbt en internationell succé. Den har spelats i många länder och översatts till flera språk. Filmversionen från 2008 bidrog ytterligare till att sprida ABBA:s musik till en yngre publik.

En musikal som bygger på befintliga låtar kallas jukeboxmusikal. Formen kräver att en berättelse skrivs runt låtar som från början inte hade något med varandra att göra, vilket ofta ger en handling som är lite lös i kanterna. Att Mamma Mia! ändå fungerar brukar förklaras med att ABBA:s texter är allmänt hållna: de handlar om längtan, uppbrott och återseenden utan att vara bundna till en bestämd person eller plats.

Genombrottet i vidare kulturella sammanhang kom dock tidigare än musikalen. Under 1990-talet användes gruppens låtar i australiska filmer som Muriels bröllop och Priscilla, öknens drottning, där musiken fick stå för både glädje och utanförskap på samma gång. Efter det blev det svårare att avfärda ABBA som enbart lättsam underhållning.

En del av förklaringen till att ABBA fått ett nytt liv ligger i hur smaken förändrats. Det som en gång avfärdades som överdrivet och sentimentalt uppskattas i dag ofta just för överdriften. Inom kulturkritiken används ordet camp om ett sådant förhållningssätt: att tycka om något delvis för att det är för mycket.

ABBA:s stil och estetik, inklusive kläder och scenframträdanden, har också påverkat hur popartister uttrycker sig visuellt. Deras färgstarka kostymer och tydliga visuella identitet gjorde dem lätta att känna igen. En seglivad historia säger att kostymerna var så uppseendeväckande just för att svenska skatteregler tillät avdrag för scenkläder som inte gick att bära privat. Historien har berättats av gruppen själv, men den har också ifrågasatts, och den fungerar nog bäst som ett skämt om en tid då just kläderna var det många minns bäst.

Gruppens musik används ofta i sammanhang där man vill skapa glädje, nostalgi eller gemenskap. Deras låtar är enkla att sjunga med i och passar därför bra i sociala sammanhang. Det gör dem också till ett tacksamt val i reklam, där en igenkänd melodi gör att ett budskap fastnar snabbare än en okänd melodi hinner göra.

Ett nyare exempel är konsertformen ABBA Voyage, som öppnade i London 2022. Där uppträder digitala versioner av gruppmedlemmarna som de såg ut på 1970-talet, tillsammans med ett liveband. Föreställningen väcker frågan om vad ett framträdande egentligen är: publiken vet att artisterna inte finns i rummet, men upplevelsen beskrivs ändå av många som en konsert.

Gruppen har också blivit en del av bilden av Sverige utomlands. Ett museum i Stockholm ägnas åt dem, och för många besökare är ABBA en av få svenska referenser som finns med redan före resan. Att en popgrupp fungerar som ett lands visitkort säger något om hur kultur sprids: det som når längst är sällan det som ett land självt valt att marknadsföra.

Framgången banade dessutom väg för andra. Sverige har sedan dess haft en ovanligt stor musikexport i förhållande till sin storlek, och flera av de låtskrivare som skrivit hits åt internationella artister har pekat på ABBA som ett bevis på att det gick att lyckas härifrån.

Även idag refereras ABBA i olika kulturella uttryck, vilket visar deras fortsatta relevans. De fungerar som en symbol för en viss typ av popmusik och tidsperiod.

Deras inflytande visar hur musik kan leva vidare genom olika medier och generationer.`,
  questions: [
    { type: 'ord', q: 'Vad är en "jukeboxmusikal"?',
      options: ['En musikal som framförs helt utan levande musiker', 'En musikal där publiken själv får välja låtarna', 'En musikal som byggs runt redan befintliga låtar', 'En musikal som spelas på flera språk samtidigt'], correct: 2 },
    { type: 'inferens', q: 'Varför fungerar Mamma Mia! trots formens svaghet?',
      options: ['För att handlingen bygger på gruppens egen historia', 'För att låtarna skrevs om särskilt inför musikalen', 'För att publiken redan känner till hela berättelsen', 'För att texterna är allmänt hållna och inte bundna till en plats'], correct: 3 },
    { type: 'literal', q: 'Vilka filmer nämns som ett tidigare genombrott?',
      options: ['Muriels bröllop och Priscilla, öknens drottning', 'Två svenska filmer från ungefär samma årtionde', 'Filmversionen av Mamma Mia! och dess uppföljare', 'Ett par dokumentärer om gruppens turnéer'], correct: 0 },
    { type: 'inferens', q: 'Hur förhåller sig texten till historien om kostymerna och skatten?',
      options: ['Den slår fast att historien är helt påhittad', 'Den återger den men påpekar att den ifrågasatts', 'Den använder den som bevis för gruppens ekonomi', 'Den nämner den utan att kommentera den alls'], correct: 1 },
    { type: 'literal', q: 'Varför är låtarna tacksamma att använda i reklam?',
      options: ['För att de är billiga att få rätt att använda', 'För att de är korta och lätta att klippa ned', 'För att en igenkänd melodi gör att budskapet fastnar', 'För att de sällan används i några andra sammanhang'], correct: 2 },
    { type: 'sammanfatta', q: 'Vilken fråga väcker ABBA Voyage enligt texten?',
      options: ['Om digitala versioner får användas utan tillstånd', 'Om konserter kommer att bli dyrare i framtiden', 'Om gruppen någonsin kommer att turnera på riktigt igen', 'Om vad ett framträdande egentligen är'], correct: 3 },
  ],
},

// ── åk 7, 180 → ~515 ord ────────────────────────────────────────────────
'ak7-tema-021': {
  text: `Klimatförändringar är en av de största utmaningarna som världen står inför idag. Forskare har länge varnat för att ökade utsläpp av växthusgaser, som koldioxid och metan, påverkar jordens temperatur. När temperaturen stiger förändras vädermönster, vilket kan leda till extremväder som torka, översvämningar och kraftiga stormar. Dessa förändringar påverkar både naturen och människors livsvillkor.

Det är värt att skilja på väder och klimat. Vädret är hur det är en viss dag, medan klimatet är hur vädret brukar vara under lång tid på en plats. En kall vinter säger därför ingenting om klimatet, ungefär som att en enda dålig match inte säger något om hur bra ett lag är över en hel säsong.

En viktig orsak till klimatförändringarna är människans användning av fossila bränslen, såsom kol, olja och naturgas. När dessa bränslen förbränns frigörs stora mängder koldioxid som samlas i atmosfären. Detta förstärker växthuseffekten, vilket innebär att mer värme stannar kvar på jorden.

Kolet i de fossila bränslena har legat bundet i marken i miljontals år. När det förbränns hamnar det i atmosfären på några sekunder. Det är själva hastigheten som är problemet: naturen klarar att hantera stora mängder kol, men inte att göra det så snabbt.

Hur vet forskarna hur klimatet var förr? Ett sätt är att borra i inlandsisen. I isen finns luftbubblor som frusit in för länge sedan, och genom att mäta dem går det att se hur mycket koldioxid luften innehöll för hundratusentals år sedan.

Konsekvenserna märks redan idag. Isar i Arktis smälter snabbare än tidigare, havsnivåerna stiger och vissa djurarter riskerar att försvinna. Samtidigt påverkas människor genom att jordbruket får svårare att producera mat i vissa områden.

Att isen smälter förstärker dessutom förloppet. Vit is kastar tillbaka solljuset, medan mörkt hav tar upp värmen. Ju mer is som försvinner, desto snabbare värms området upp, och desto mer is smälter. Sådana förlopp, där en förändring driver på sig själv, gör det svårare att förutsäga hur snabbt det går.

Sverige påverkas också, om än på andra sätt än länder närmare ekvatorn. Vintrarna blir kortare och mildare, snötäcket ligger färre dagar och skogsbränder har blivit vanligare under torra somrar. Samtidigt kan ett varmare klimat göra vissa grödor lättare att odla längre norrut. Att effekterna går åt olika håll gör frågan svårare att prata om.

De som drabbas hårdast är sällan de som orsakat mest. Länder med små utsläpp per person ligger ofta i områden där torka och översvämningar slår hårdast, och där det finns minst pengar att bygga skydd. Det är därför klimatfrågan också handlar om rättvisa och inte bara om teknik.

Det finns dock lösningar. Många länder satsar på förnybar energi, som sol- och vindkraft. Genom att minska användningen av fossila bränslen kan utsläppen minska. Även individer kan bidra genom att resa mer hållbart och minska sin energiförbrukning.

Kostnaden för sol- och vindkraft har dessutom fallit kraftigt de senaste femton åren, så mycket att det på många platser nu är billigare att bygga ny förnybar el än ny el från kol. Det gör omställningen till en fråga om beslut och tid snarare än om tekniken finns.

Att förstå klimatförändringarna är viktigt för att kunna fatta beslut som skyddar både miljön och framtida generationer.`,
  questions: [
    { type: 'ord', q: 'Vad är skillnaden mellan väder och klimat?',
      options: ['Väder mäts i luften medan klimat mäts i marken', 'Väder är hur det är en dag, klimat hur det brukar vara', 'Väder gäller ett land medan klimat gäller hela världen', 'Väder förändras långsamt medan klimatet ändras snabbt'], correct: 1 },
    { type: 'inferens', q: 'Varför säger en kall vinter ingenting om klimatet?',
      options: ['För att vintrar mäts på ett annat sätt än somrar', 'För att kylan bara drabbar vissa delar av världen', 'För att en enskild period inte visar det långsiktiga mönstret', 'För att temperaturen alltid varierar mest under vintern'], correct: 2 },
    { type: 'inferens', q: 'Varför är hastigheten själva problemet?',
      options: ['För att kolet blir farligare ju snabbare det frigörs', 'För att mätningarna inte hinner göras i rätt tid', 'För att bränslet tar slut fortare än man räknat med', 'För att naturen klarar mängden men inte tempot'], correct: 3 },
    { type: 'literal', q: 'Varför smälter isen allt snabbare?',
      options: ['För att mörkt hav tar upp värme medan vit is kastar tillbaka den', 'För att havsströmmarna i Arktis har bytt riktning', 'För att nederbörden i området har minskat kraftigt', 'För att isen blivit tunnare på grund av föroreningar'], correct: 0 },
    { type: 'literal', q: 'Vad har hänt med kostnaden för sol- och vindkraft?',
      options: ['Den har stigit kraftigt på grund av ökad efterfrågan', 'Den har fallit kraftigt de senaste femton åren', 'Den har varit i stort sett oförändrad sedan 1990-talet', 'Den varierar helt och hållet beroende på årstid'], correct: 1 },
    { type: 'sammanfatta', q: 'Vad innebär prisutvecklingen enligt texten?',
      options: ['Att tekniken fortfarande behöver utvecklas mycket mer', 'Att kol kommer att användas under lång tid framöver', 'Att omställningen blivit en fråga om beslut och tid', 'Att den enskildes val numera saknar betydelse'], correct: 2 },
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
