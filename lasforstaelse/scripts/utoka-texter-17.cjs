#!/usr/bin/env node
//
// Sats 17: de sex sista texterna under 250 ord i åk 7–10.

const fs = require('fs');
const path = require('path');

const NYA = {

// ── åk 10, 229 → ~605 ord ───────────────────────────────────────────────
'akgy-sol-002': {
  text: `Gravitation är den grundläggande kraft som styr rörelserna i solsystemet. Alla objekt med massa påverkar varandra genom gravitation, men eftersom solen innehåller nästan all massa i systemet är dess påverkan dominerande. Planeterna rör sig i banor runt solen på grund av balansen mellan gravitationens dragkraft och deras egen rörelse framåt.

Att en planet inte faller in i solen beror alltså inte på att gravitationen är svag, utan på att planeten hela tiden rör sig i sidled. En vanlig bild är en sten i ett snöre som svängs runt: släpper man snöret flyger stenen rakt ut. En planet befinner sig i ett ständigt fall som aldrig når fram, eftersom målet hela tiden viker undan.

Isaac Newton formulerade lagen om universell gravitation, som beskriver hur kraften mellan två objekt beror på deras massor och avståndet mellan dem. Denna lag förklarar varför planeter kretsar kring solen och varför månar kretsar kring planeter.

Newtons lag var dessutom en av de första att koppla ihop himlen med jorden. Att samma regel styrde ett fallande äpple och månens bana var en ny tanke: dittills hade himlakropparna betraktats som något väsensskilt från vardagliga föremål. Att en enda formel kunde beskriva båda blev en förebild för hur naturvetenskap skulle bedrivas.

Senare utvecklade Albert Einstein teorin om relativitet, som gav en djupare förståelse av gravitation som en krökning av rumtiden. Skillnaden mot Newton märks sällan i vardagen, men den märks. Merkurius bana avviker en aning från vad Newtons lag förutsäger, och avvikelsen stämmer exakt med Einsteins beräkningar. Satellitnavigering måste också ta hänsyn till att tiden går olika fort på olika höjd, annars skulle positionerna bli fel på flera kilometer per dygn.

Gravitationen används dessutom för att hitta det man inte kan se. Neptunus upptäcktes 1846 genom att astronomer först räknade ut var en okänd planet måste finnas för att förklara avvikelser i Uranus bana, och sedan riktade teleskopet dit. Samma metod används i dag för att hitta planeter kring andra stjärnor.

I solsystemet påverkar gravitationen även mindre objekt. Asteroider kan ändra bana genom nära möten med planeter, och kometer kan kastas in i det inre solsystemet. Gravitationella resonanser, där objekt påverkar varandras banor regelbundet, kan skapa stabila eller instabila mönster.

Ett exempel är Jupiters stora påverkan på asteroidbältet. Dess starka gravitation hindrar material från att bilda en planet och påverkar även kometers banor. På samma sätt påverkar månen jorden genom att skapa tidvatten, vilket har betydelse för jordens klimat och ekosystem.

Månens inverkan är dessutom ömsesidig. Tidvattnet bromsar jordens rotation, så att dygnet blir en aning längre för varje århundrade, samtidigt som månen långsamt avlägsnar sig från jorden. Att månen stabiliserar jordaxelns lutning brukar också nämnas som en av förklaringarna till att klimatet varit någorlunda jämnt under lång tid.

Solsystemets stabilitet är inte heller självklar. Beräkningar visar att planeternas banor är känsliga för mycket små störningar, och att det därför är omöjligt att räkna ut exakt var de befinner sig om hundra miljoner år. Systemet håller ihop, men detaljerna går inte att förutsäga hur långt fram som helst. Det är ett exempel på ett kaotiskt system: fullständigt styrt av kända lagar och ändå oförutsägbart på lång sikt.

Studier av gravitation i solsystemet används också inom rymdfart. Genom att utnyttja så kallade gravitationsslungor kan rymdsonder få extra hastighet genom att passera nära planeter.

Metoden är egentligen ett byte. Sonden lånar en försvinnande liten del av planetens rörelseenergi, och planeten bromsas i motsvarande grad. Eftersom planeten väger ofattbart mycket mer märks förlusten inte, medan sonden kan få en hastighetsökning som annars hade krävt mer bränsle än vad som får plats ombord.

Sammanfattningsvis visar solsystemets dynamik hur gravitationen inte bara håller systemet samman utan också skapar förändring och rörelse över tid.`,
  questions: [
    { type: 'inferens', q: 'Varför faller inte en planet in i solen?',
      options: ['För att gravitationen avtar med avståndet', 'För att planeten hela tiden rör sig i sidled', 'För att solvinden håller emot utåt', 'För att planeten roterar kring sin egen axel'], correct: 1 },
    { type: 'inferens', q: 'Varför var Newtons lag ett genombrott i tänkandet?',
      options: ['Den kunde bevisas i ett laboratorium', 'Den ersatte alla tidigare beräkningar', 'Den kopplade ihop himlakroppar med vardagliga föremål', 'Den förutsade upptäckten av nya planeter'], correct: 2 },
    { type: 'literal', q: 'Vilket exempel visar att Einsteins teori behövs?',
      options: ['Månens avstånd från jorden', 'Jupiters påverkan på asteroidbältet', 'Kometernas banor genom solsystemet', 'Merkurius bana och satellitnavigeringen'], correct: 3 },
    { type: 'literal', q: 'Vad gör tidvattnet med jordens rotation?',
      options: ['Bromsar den, så att dygnet blir längre', 'Ökar den, så att dygnet blir kortare', 'Håller den fullständigt konstant', 'Får den att kastas om med jämna mellanrum'], correct: 0 },
    { type: 'inferens', q: 'Varför märks inte planetens förlust vid en gravitationsslunga?',
      options: ['För att sonden lämnar tillbaka energin senare', 'För att planeten väger ofattbart mycket mer', 'För att effekten varar under mycket kort tid', 'För att planeten samtidigt får energi från solen'], correct: 1 },
    { type: 'sammanfatta', q: 'Vad menar texten med att månens inverkan är ömsesidig?',
      options: ['Månen påverkar enbart jordens hav', 'Jorden påverkar hur månen ser ut', 'Både jordens rotation och månens avstånd förändras', 'Månen och jorden roterar med samma hastighet'], correct: 2 },
  ],
},

// ── åk 9, 238 → ~580 ord ────────────────────────────────────────────────
'ak10-tema-001-b': {
  text: `Mänskliga rättigheter är grundläggande rättigheter som gäller för alla människor, oavsett var de bor, vilken bakgrund de har eller vad de tror på. De formulerades tydligt efter andra världskriget, när världen ville förhindra att övergrepp som Förintelsen skulle hända igen. År 1948 antog Förenta nationerna en deklaration om de mänskliga rättigheterna.

Deklarationen var i sig inte bindande. För att göra innehållet till förpliktelser krävdes avtal som stater kunde skriva under, och de kom först 1966 i form av två konventioner: en om medborgerliga och politiska rättigheter, en om ekonomiska, sociala och kulturella. Att det blev två och inte en berodde på kalla kriget, där västländerna och östblocket betonade olika saker.

Rättigheterna handlar till exempel om rätten till liv, frihet och säkerhet. De omfattar också yttrandefrihet, religionsfrihet och rätten att gå i skolan. En viktig princip är att alla människor är lika mycket värda och ska behandlas med respekt.

Trots att rättigheterna är universella, det vill säga gäller överallt, följs de inte alltid i praktiken. I vissa länder begränsas människors möjlighet att uttrycka sina åsikter eller att leva fritt. Det kan bero på politiska system, konflikter eller ekonomiska problem.

Mänskliga rättigheter delas ofta in i olika kategorier. Medborgerliga och politiska rättigheter handlar om frihet och delaktighet i samhället. Ekonomiska, sociala och kulturella rättigheter handlar om till exempel arbete, hälsa och utbildning.

Om den andra gruppen råder mer oenighet. Kritiker menar att en rätt till bostad eller vård inte kan vara en riktig rättighet, eftersom den kräver resurser som ett fattigt land helt enkelt inte har. Försvarare svarar att skyldigheten inte är att uppfylla allt genast, utan att göra så mycket som resurserna tillåter och att röra sig framåt i stället för bakåt. Även de första rättigheterna kostar dessutom pengar: fria val kräver valmyndigheter, och rättssäkerhet kräver domstolar.

Ett vanligt sätt att beskriva helheten är att rättigheterna är odelbara och beroende av varandra. Rätten att rösta betyder lite för den som är för sjuk för att ta sig till vallokalen, och rätten till utbildning betyder lite i ett land där man inte får säga vad man tycker. Att plocka ut några rättigheter och bortse från andra fungerar sällan i praktiken.

I Europa finns dessutom ett system som ger enskilda personer en väg framåt. Europakonventionen gäller som svensk lag sedan 1995, och den som anser att staten kränkt en rättighet kan, efter att alla inhemska instanser prövats, vända sig till Europadomstolen i Strasbourg. Sverige har fällts där ett antal gånger, bland annat i mål om rätten till en rättvis rättegång, och domarna har lett till ändringar i svensk lag.

Ett återkommande missförstånd är att mänskliga rättigheter bara gäller i förhållande till staten och därför saknar betydelse i vardagen. Staten har dock inte bara en skyldighet att låta bli att kränka, utan också att skydda människor från varandra och att skapa förutsättningar för att rättigheterna ska kunna användas. Att en skola är skyldig att ingripa mot kränkningar är ett exempel på det andra ledet, och att den är avgiftsfri på det tredje.

Det finns organisationer som arbetar för att skydda och stärka dessa rättigheter. De kan dokumentera brott, påverka regeringar och informera människor. Även enskilda personer kan bidra genom att engagera sig, sprida kunskap och stå upp för andra.

Att förstå mänskliga rättigheter handlar inte bara om lagar, utan också om värderingar. Det innebär att se andra människors värde och att agera när orättvisor sker. På så sätt blir rättigheterna levande i vardagen och inte bara ord på papper.`,
  questions: [
    { type: 'literal', q: 'Varför räckte inte deklarationen från 1948?',
      options: ['Den var inte bindande för staterna', 'Den skrevs bara på ett enda språk', 'Den saknade regler om rätten till utbildning', 'Den antogs av alldeles för få länder'], correct: 0 },
    { type: 'inferens', q: 'Varför blev det två konventioner i stället för en?',
      options: ['För att texten annars blivit för lång', 'För att väst och öst betonade olika rättigheter', 'För att FN inte hann bli klart i tid', 'För att fattiga länder krävde en egen text'], correct: 1 },
    { type: 'literal', q: 'Vad svarar försvararna på kritiken mot sociala rättigheter?',
      options: ['Att kritiken bygger på ett missförstånd av lagtexten', 'Att sådana rättigheter inte kostar något att uppfylla', 'Att skyldigheten är att göra så mycket resurserna tillåter', 'Att fattiga länder undantas helt från kraven'], correct: 2 },
    { type: 'inferens', q: 'Varför nämner texten att fria val kräver valmyndigheter?',
      options: ['För att visa att val är svåra att genomföra', 'För att förklara varför valdeltagandet varierar', 'För att peka på att myndigheter måste vara oberoende', 'För att visa att även frihetsrättigheter kostar pengar'], correct: 3 },
    { type: 'literal', q: 'Vad krävs innan man kan vända sig till Europadomstolen?',
      options: ['Att alla inhemska instanser har prövats', 'Att en organisation stödjer ansökan', 'Att staten själv godkänner prövningen', 'Att målet gäller rätten till en rättvis rättegång'], correct: 0 },
    { type: 'sammanfatta', q: 'Vad menas med att rättigheterna är odelbara?',
      options: ['Att de infördes vid ett och samma tillfälle', 'Att de förutsätter varandra i praktiken', 'Att inget land får välja bort en konvention', 'Att de gäller på samma sätt för barn och vuxna'], correct: 1 },
  ],
},

// ── åk 9, 242 → ~580 ord ────────────────────────────────────────────────
'ak10-arsenal-001': {
  text: `Arsenal Football Club grundades 1886 i London och är en av de mest välkända fotbollsklubbarna i världen. Klubben startades av arbetare vid en vapentillverkning, vilket förklarar klubbens smeknamn The Gunners. Under åren har Arsenal utvecklats från ett lokalt lag till en global fotbollsgigant med supportrar över hela världen.

De första åren låg klubben i Woolwich i sydöstra London, långt från de områden den förknippas med i dag. År 1913 flyttade den norrut, till en tomt som tillhörde ett prästseminarium i Highbury. Flytten var kontroversiell och möttes av protester från andra London-klubbar, som ansåg att Arsenal trängde sig in på deras område.

Den som mer än någon annan formade klubben tidigt var Herbert Chapman, tränare från 1925. Han var en organisatör snarare än en taktiker i modern mening, men listan över det han införde är lång: nummer på tröjorna, vita ärmar så att spelarna skulle se varandra i ögonvrån, och en ny laguppställning som utnyttjade en ändrad offsideregel. Han fick också tunnelbanestationen intill arenan att byta namn till Arsenal, vilket den heter än i dag. Ingen annan klubb i London har en station uppkallad efter sig.

Chapman drev dessutom frågor som ansågs orimliga vid den tiden, som strålkastare på arenan så att matcher kunde spelas i mörker. Mycket av det avslogs av förbundet men infördes långt senare. Han dog plötsligt 1934, mitt under klubbens dittills mest framgångsrika period.

Klubbens färger har också en historia. De röda tröjorna sägs komma från en gåva: laget Nottingham Forest skickade en uppsättning röda ställ till den nystartade klubben, som saknade pengar till egna. De vita ärmarna kom först på Chapmans tid, femtio år senare, och den kombinationen har klubben behållit sedan dess.

Under andra världskriget stod fotbollen i praktiken stilla. Highbury togs över som skyddsrum och beredskapsstation, arenan skadades av bomber och Arsenal fick spela sina hemmamatcher på rivalen Tottenhams arena. Att två klubbar som annars knappt talades vid delade plan i flera år brukar nämnas som en påminnelse om vad rivaliteter väger när något större händer.

En av de viktigaste perioderna i klubbens historia inträffade under tränaren Arsène Wenger, som tog över laget 1996. Wenger förändrade hur klubben arbetade med kost, träning och taktik. Han införde en mer teknisk och snabb spelstil som kom att prägla Arsenal under många år. Den mest kända säsongen är 2003–2004, då laget gick igenom hela ligan utan att förlora en enda match. Detta lag kallas ofta för The Invincibles.

Arsenal spelar sina hemmamatcher på Emirates Stadium, som invigdes 2006. Innan dess spelade laget på Highbury, en arena som var känd för sin speciella atmosfär. Flytten till Emirates innebar större ekonomiska möjligheter men också nya utmaningar, särskilt när det gällde att konkurrera med andra storklubbar.

Delar av Highbury står kvar. Två av arenans fasader var byggnadsminnesmärkta och fick inte rivas, så de byggdes om till bostäder, och planen där matcherna spelades är i dag en trädgård mellan husen. Att en arena förvandlas till kvarter i stället för att jämnas med marken säger något om hur nära en klubb kan sitta ihop med sin stadsdel.

Klubbens identitet bygger på en kombination av tradition och utveckling. Arsenal är kända för att spela en offensiv och teknisk fotboll, samtidigt som de värnar om sin historia. Klubben har också haft en viktig roll i att utveckla unga spelare och ge dem chansen på hög nivå.

Trots perioder av både framgång och motgång fortsätter Arsenal att vara en central del av engelsk fotboll. Deras historia visar hur en klubb kan förändras över tid utan att förlora sin grundläggande identitet.`,
  questions: [
    { type: 'literal', q: 'Var låg klubben under sina första år?',
      options: ['I Woolwich i sydöstra London', 'I Highbury i norra London', 'Strax utanför stadsgränsen', 'Nära Themsens mynning i öster'], correct: 0 },
    { type: 'inferens', q: 'Varför möttes flytten 1913 av protester?',
      options: ['Tomten tillhörde ett prästseminarium', 'Andra klubbar ansåg att Arsenal trängde sig in på deras område', 'Supportrarna ville inte resa längre än förut', 'Arenan skulle byggas på en gammal begravningsplats'], correct: 1 },
    { type: 'literal', q: 'Vad införde Herbert Chapman?',
      options: ['En helt ny sorts kontrakt för spelarna', 'Regelbundna träningsläger utomlands', 'Nummer på tröjorna och vita ärmar', 'Ett system med två tränare samtidigt'], correct: 2 },
    { type: 'inferens', q: 'Varför nämner texten tunnelbanestationen?',
      options: ['Den låg närmare Highbury än Emirates gör', 'Den byggdes samtidigt som arenan', 'Den användes av spelarna varje matchdag', 'Ingen annan London-klubb har en station uppkallad efter sig'], correct: 3 },
    { type: 'literal', q: 'Vad hände med Highbury efter flytten?',
      options: ['Två fasader byggdes om till bostäder', 'Arenan revs helt och hållet', 'Den togs över av en annan klubb', 'Den används i dag för konserter'], correct: 0 },
    { type: 'sammanfatta', q: 'Vad säger Highburys öde om klubben enligt texten?',
      options: ['Att flytten var ekonomiskt nödvändig', 'Att en klubb kan sitta nära ihop med sin stadsdel', 'Att gamla arenor sällan går att bevara', 'Att supportrarna motsatte sig hela förändringen'], correct: 1 },
  ],
},

// ── åk 7, 243 → ~515 ord ────────────────────────────────────────────────
'ak7-tema-036': {
  text: `Skogen har länge varit en viktig del av Sveriges natur och kultur. Den ger oss syre, material till byggnader och en plats för rekreation. Men idag förändras skogen snabbare än tidigare, delvis på grund av klimatförändringar. När temperaturen stiger påverkas både djur och växter. Vissa arter får svårare att överleva medan andra sprider sig till nya områden.

Skogen är också en av landets viktigaste inkomstkällor. Ungefär sjuttio procent av Sveriges yta är skog, och trä därifrån blir papper, brädor, möbler och bränsle. Skogsindustrin sysselsätter tiotusentals människor, ofta på orter där det inte finns så många andra arbetsgivare. Det gör att frågor om skogen sällan bara handlar om natur.

En tydlig förändring är att granen, som är vanlig i Sverige, har börjat få problem i varmare klimat. Samtidigt klarar sig lövträd som ek och bok bättre. Detta gör att skogens sammansättning sakta förändras. För skogsägare innebär det att de behöver tänka annorlunda kring vilka träd de planterar.

Även skadedjur påverkas av klimatet. Barkborren är ett exempel på en insekt som har blivit vanligare. Den angriper granar och kan snabbt döda stora områden av skog. När vintrarna blir mildare överlever fler barkborrar, vilket leder till större skador.

Hur skogen ska brukas är omdiskuterat. Det vanligaste sättet i Sverige är att avverka alla träd på en yta samtidigt, ett kalhygge, och sedan plantera nytt. Metoden är effektiv och billig. Kritiker menar att den skadar marken och gör skogen till en plantering snarare än en skog. Ett alternativ är att bara ta ut enstaka träd åt gången, så att skogen alltid står kvar. Det ger mindre virke per år men bevarar mer.

Skogen har dessutom en roll i klimatfrågan. Träd tar upp koldioxid när de växer och binder kolet i stammar och rötter. En växande skog är därför en kolsänka. Samtidigt frigörs kolet igen när trä bränns eller förmultnar. Hur mycket skogen egentligen hjälper beror alltså på vad virket används till och hur länge kolet stannar bundet.

För den biologiska mångfalden spelar döda träd en oväntat stor roll. Ungefär en fjärdedel av alla skogslevande arter i Sverige behöver död ved för att överleva: insekter, svampar och lavar. I en skog som sköts för att ge virke städas sådana träd ofta bort, vilket är en av de främsta anledningarna till att arter blir hotade.

Skogen betyder också olika saker för olika grupper. För renskötande samer är den betesmark, och lavar som renarna behöver växer bara i äldre skog. Sådana intressen krockar ibland med avverkning, och frågan har prövats i domstol flera gånger.

Samtidigt finns det åtgärder som kan minska problemen. Forskare och skogsbrukare arbetar tillsammans för att hitta lösningar. Det kan handla om att plantera fler olika sorters träd, så att skogen blir mer motståndskraftig. En varierad skog klarar förändringar bättre än en skog med bara en trädart.

För människor är skogen också viktig för hälsa och välbefinnande. Många går dit för att promenera, plocka svamp eller bara koppla av. Därför är det viktigt att vi tar hand om skogen och anpassar oss till de förändringar som sker. Genom att förstå vad som händer kan vi fatta bättre beslut för framtiden.`,
  questions: [
    { type: 'literal', q: 'Hur stor del av Sveriges yta är skog?',
      options: ['Ungefär sjuttio procent', 'Ungefär hälften', 'Ungefär trettio procent', 'Ungefär nittio procent'], correct: 0 },
    { type: 'inferens', q: 'Varför handlar skogsfrågor sällan bara om natur?',
      options: ['För att skogen till största delen ägs av staten', 'För att industrin ger arbete där få andra arbetsgivare finns', 'För att skogens storlek är svår att mäta exakt', 'För att reglerna ändras med varje ny regering'], correct: 1 },
    { type: 'inferens', q: 'Vad menar kritikerna om kalhyggen?',
      options: ['Att metoden är alldeles för dyr att använda', 'Att den ger för lite virke per år', 'Att den gör skogen till en plantering', 'Att den bara fungerar i norra Sverige'], correct: 2 },
    { type: 'inferens', q: 'Varför är skogens klimatnytta svår att räkna på?',
      options: ['För att olika träd växer olika fort', 'För att mätningarna bara görs vart tionde år', 'För att skogen brinner allt oftare på somrarna', 'För att kolet frigörs igen beroende på vad virket används till'], correct: 3 },
    { type: 'literal', q: 'Varför är döda träd viktiga?',
      options: ['Ungefär en fjärdedel av skogens arter behöver död ved', 'De skyddar marken mot att torka ut', 'De hindrar barkborren från att sprida sig vidare', 'De gör skogen betydligt lättare att gå i'], correct: 0 },
    { type: 'sammanfatta', q: 'Vad talar för en varierad skog?',
      options: ['Den ger mer virke per hektar mark', 'Den klarar förändringar bättre än en skog med en trädart', 'Den är billigare att sköta över tid', 'Den lockar fler besökare till området'], correct: 1 },
  ],
},

// ── åk 10, 245 → ~605 ord ───────────────────────────────────────────────
'akgy-borg-002': {
  text: `Under sin aktiva karriär blev Björn Borg mer än en framstående idrottare; han utvecklades till en kulturell symbol som speglade sin tids ideal och förändringar. I en era präglad av individualism och globalisering kom Borg att representera en ny typ av offentlig personlighet där idrott, mode och media sammanflätades.

Hans visuella uttryck, med karakteristiskt pannband och långt hår, bröt mot tidigare normer inom tennisens konservativa miljö. Detta bidrog till att attrahera en yngre publik och gjorde sporten mer tillgänglig för bredare samhällsgrupper. Borg blev därmed en brygga mellan tradition och modernitet.

Publikens reaktioner var av ett slag som tennisen inte sett tidigare. Under Wimbledon på 1970-talet krävdes poliseskort för att ta honom mellan banorna, och tidningarna beskrev unga åskådare som skrek och grät på läktarna. Det språk som användes var lånat från popmusiken, inte från sporten. Att en tennisspelare beskrevs i samma ordalag som ett band säger något om hur gränserna mellan olika slags kändisskap höll på att lösas upp.

Medialt framställdes Borg ofta som en gåtfull figur. Hans reserverade personlighet skapade ett intresse som förstärktes av hans framgångar. Denna kombination av prestation och mystik gjorde honom till ett attraktivt objekt för reklam och internationell exponering.

Bilden fick sin skärpa genom en motsats. Rivaliteten med amerikanen John McEnroe beskrevs återkommande som is mot eld: den tyste svensken mot den utagerande amerikanen. Berättelsen var förenklad, vilket båda spelarna senare påpekat, men den fungerade eftersom den gav publiken två tydliga roller att välja mellan. Att sport ofta berättas som en konflikt mellan personligheter snarare än mellan spelsätt är något som gäller långt utanför tennisen.

Samtidigt väckte hans framgång frågor om identitet och nationell stolthet. I Sverige blev Borg en symbol för nationell framgång under en period då landet sökte sin plats i en globaliserad värld. Hans prestationer användes ofta i diskussioner om svensk disciplin, arbetsmoral och innovationsförmåga.

Att ett helt lands självbild knyts till en enskild person har dock en baksida. Den som bär en sådan roll får svårt att sluta, och Borg avbröt sin karriär redan vid tjugosex års ålder, något som beskrevs som obegripligt vid tiden. I efterhand har han själv talat om utmattning och om pressen att aldrig få vara annat än vinnare.

Också hans spelsätt fick kulturell betydelse. Borg slog bollen med kraftig överskruv, en teknik som var ovanlig och som passade de nya racketar som kom under samma år. Att en spelstil hänger ihop med materialet är lätt att glömma: det som ser ut som en personlig stil är ofta en följd av vad utrustningen tillåter.

Det är också relevant att analysera Borg ur ett genusperspektiv. Hans framtoning utmanade vissa traditionella maskulinitetsideal genom sin återhållsamhet och emotionella kontroll. Detta gjorde honom till en komplex figur som kunde tolkas på olika sätt beroende på betraktarens perspektiv.

Ett annat spår är hur namnet blev en vara. Borg lånade tidigt ut sitt namn till kläder och utrustning, och ett svenskt klädmärke bär det än i dag utan att han själv driver företaget. Att en idrottares namn kan leva vidare som ett varumärke oberoende av personen är i dag självklart, men var det inte när det började.

Bilden av honom har dessutom skrivits om flera gånger. Under 1990-talet uppmärksammades ekonomiska problem och privatliv i en ton som låg långt från 1970-talets hyllningar, och senare har filmer och dokumentärer i stället lyft fram pressen bakom lugnet. Att en offentlig person tolkas olika i olika årtionden säger ofta mer om samtiden än om personen.

Sammanfattningsvis kan Björn Borg förstås som en kulturell ikon vars betydelse sträcker sig långt bortom tennisbanan. Genom sin image, sitt beteende och sin samtid bidrog han till att forma hur idrottare uppfattas i det moderna samhället.`,
  questions: [
    { type: 'literal', q: 'Hur beskrevs publikens reaktioner under Wimbledon?',
      options: ['Med ett språk lånat från popmusiken', 'Som ovanligt tysta och koncentrerade', 'Som identiska med reaktionerna på andra spelare', 'Med uttryck hämtade från teatervärlden'], correct: 0 },
    { type: 'inferens', q: 'Varför fungerade berättelsen om is mot eld?',
      options: ['Den byggde på spelarnas egna uttalanden', 'Den gav publiken två tydliga roller att välja mellan', 'Den beskrev de båda spelsätten på ett rättvist sätt', 'Den var den enda tolkning som fanns tillgänglig'], correct: 1 },
    { type: 'inferens', q: 'Vad menar texten gäller långt utanför tennisen?',
      options: ['Att rivaliteter ofta konstrueras i efterhand', 'Att publiken alltid väljer den tystare parten', 'Att sport berättas som konflikt mellan personligheter', 'Att medier överdriver spelarnas prestationer'], correct: 2 },
    { type: 'literal', q: 'Hur gammal var Borg när han avbröt sin karriär?',
      options: ['Trettio år', 'Tjugoåtta år', 'Trettiotvå år', 'Tjugosex år'], correct: 3 },
    { type: 'inferens', q: 'Vilken baksida hade rollen som nationell symbol?',
      options: ['Den gjorde det svårt att sluta', 'Den minskade intresset för hans spel', 'Den gav honom sämre sponsoravtal', 'Den ledde till kritik från andra spelare'], correct: 0 },
    { type: 'sammanfatta', q: 'Vad var nytt med att namnet blev ett varumärke?',
      options: ['Att företaget ägdes av en aktiv idrottare', 'Att namnet kunde leva vidare oberoende av personen', 'Att kläderna kom att säljas utanför Sverige', 'Att varumärket kopplades just till tennis'], correct: 1 },
  ],
},

// ── åk 8, 249 → ~550 ord ────────────────────────────────────────────────
'ak8-tema-021': {
  text: `I dagens samhälle spelar den digitala identiteten en allt större roll. När vi använder sociala medier, e-post eller olika appar lämnar vi spår efter oss. Dessa spår består av information som namn, bilder, kommentarer och beteenden. Tillsammans skapar de en bild av vilka vi är på nätet. Många tänker inte på att denna bild kan påverka hur andra ser oss, både nu och i framtiden. Till exempel kan en arbetsgivare söka efter en persons namn och hitta gamla inlägg eller bilder.

En sak som gör nätet särskilt svårt är att olika delar av livet hamnar på samma plats. I verkligheten pratar man inte likadant med sin farmor, sitt lag och sina närmaste kompisar. På en plattform ser alla samma inlägg samtidigt. Att välja tonläge blir därför svårt, eftersom det som är självklart i en krets kan låta konstigt i en annan.

Samtidigt finns det fördelar med en digital identitet. Det blir enklare att hålla kontakt med vänner, dela information och delta i samhällsdebatter. För företag och organisationer är det också ett sätt att nå ut till människor snabbt. Problemet uppstår när personlig information sprids utan kontroll eller används på fel sätt.

Tidsaspekten är särskilt svår för unga. Det som skrivs vid tretton års ålder finns kvar när man är tjugofem, och den som skrev det har under tiden hunnit bli en annan person. Vuxna som växte upp utan nätet fick pröva sig fram utan att allt sparades. Att den möjligheten saknas i dag är en verklig skillnad mellan generationerna, inte bara ett klagomål.

Det är också värt att komma ihåg att det som visas är ett urval. Ett flöde består av valda ögonblick, tagna om tills de blev bra, medan det som inte fungerade aldrig läggs upp. Att jämföra sitt eget liv med andras redigerade version är därför en jämförelse mellan olika saker, inte mellan olika människor. Den insikten hjälper sällan i stunden, men den är ändå värd att ha.

Integritet handlar om rätten att bestämma över sin egen information. Många länder har lagar som ska skydda individens integritet, men ansvaret ligger också på användaren. Det är viktigt att tänka efter innan man publicerar något. Frågor som vem som kan se detta och hur det kan uppfattas är centrala.

Uppgifter om en person kan dessutom användas av andra. Med tillräckligt många detaljer, som skola, bostadsort, födelsedag och namn på syskon, går det att ta sig in på konton eller utge sig för att vara någon annan. Sådana bedrägerier bygger sällan på avancerad teknik utan på information som personen själv lagt ut, ofta i olika inlägg vid olika tillfällen.

En annan aspekt är anonymitet. Vissa väljer att vara anonyma på nätet för att kunna uttrycka sig fritt. Det kan vara positivt, men också leda till problem som hatkommentarer och trakasserier. Därför diskuteras ofta balansen mellan yttrandefrihet och ansvar.

Det är värt att skilja på anonymitet och pseudonymitet. Den som är helt anonym lämnar ingen koppling alls, medan den som använder ett alias bygger upp ett rykte under ett annat namn än sitt eget. Det senare är vanligare och fungerar ofta bättre, eftersom man har något att förlora på att bete sig illa.

Sammanfattningsvis är den digitala identiteten något som alla behöver förstå och hantera med omsorg. Genom att vara medveten om sina val kan man skapa en tryggare och mer positiv närvaro online.`,
  questions: [
    { type: 'inferens', q: 'Varför är det svårt att välja tonläge på en plattform?',
      options: ['För att skriven text saknar tonfall', 'För att inlägg sprids snabbare än man tror', 'För att olika delar av livet ser samma inlägg', 'För att plattformarna ändrar sina regler ofta'], correct: 2 },
    { type: 'literal', q: 'Vilken skillnad mellan generationerna tar texten upp?',
      options: ['Unga använder fler plattformar än vuxna gör', 'Vuxna fick pröva sig fram utan att allt sparades', 'Unga skriver betydligt mer än vuxna gjorde', 'Vuxna hade färre vänner att hålla kontakt med'], correct: 1 },
    { type: 'inferens', q: 'Varför bygger bedrägerier sällan på avancerad teknik?',
      options: ['För att tekniken är för dyr för de flesta', 'För att plattformarna redan är mycket säkra', 'För att bedragare sällan har någon utbildning', 'För att personen själv lagt ut informationen'], correct: 3 },
    { type: 'literal', q: 'Vad är skillnaden mellan anonymitet och pseudonymitet?',
      options: ['Den anonyme lämnar ingen koppling, den med alias bygger ett rykte', 'Den anonyme bryter mot lagen, den med alias gör det inte', 'Den anonyme syns bara i vissa länder på nätet', 'Den anonyme kan inte skriva några kommentarer'], correct: 0 },
    { type: 'inferens', q: 'Varför fungerar ett alias ofta bättre?',
      options: ['Det går inte att spåra på något sätt', 'Man har något att förlora på att bete sig illa', 'Plattformarna kontrollerar sådana konton hårdare', 'Alias används framför allt av vuxna'], correct: 1 },
    { type: 'sammanfatta', q: 'Vad är textens huvudpoäng?',
      options: ['Att man helst bör undvika sociala medier helt', 'Att lagarna räcker för att skydda alla användare', 'Att den digitala identiteten kräver medvetna val', 'Att anonymitet nästan alltid är det säkraste'], correct: 2 },
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
