#!/usr/bin/env node
//
// Sats 14: fem texter i intervallet 192–204 ord, med omskrivna frågor.
// ak8-tema-023 får dessutom rätt genre: den är en berättelse, inte en faktatext.

const fs = require('fs');
const path = require('path');

const NYA = {

// ── åk 8, berättelse, 192 → ~550 ord ────────────────────────────────────
'ak8-tema-023': {
  genre: 'berättelse',
  text: `I en mellanstor stad startades ett basketlag där spelarna hade olika bakgrunder och förutsättningar. Alex var lagkapten och använde rullstol efter en olycka. Kim identifierade sig som icke-binär och var lagets bästa skytt. Samira hade nyligen flyttat till landet och kämpade med språket, medan Leo var äldre än de andra och hade spelat basket i många år.

Det första passet var mest tyst. Alla stod i en halvcirkel och tittade på tränaren, och ingen ville vara den som frågade det uppenbara: hur ett lag där en spelare sitter och de andra står egentligen skulle träna tillsammans.

Det var Leo som frågade till slut, rakt ut. Alex svarade att hen inte visste heller, men att de kunde prova och se hur det gick.

Träningarna var inte alltid enkla. De behövde anpassa övningarna så att alla kunde delta. I början uppstod missförstånd, särskilt när kommunikationen brast. Men med tiden lärde de sig att samarbeta och lyssna på varandra.

Lösningarna blev sällan de som stod i böckerna. De sänkte tempot i vissa övningar och höjde det i andra. De slutade ropa instruktioner tvärs över planen, eftersom Samira inte hann höra vad som sagts innan bollen redan var någon annanstans, och började i stället använda handtecken som alla kunde. Det visade sig fungera bättre för hela laget, inte bara för henne.

Leo hade svårast att vänja sig. Han hade spelat i tjugo år och visste hur det skulle gå till. En kväll sa han att det var långsamt, och att han inte kommit dit för att gå kurs i hänsyn.

Alex svarade inte direkt. Nästa träning bad hen Leo att prova en övning från stolen. Leo tog två minuter på sig att inse hur mycket av spelet han aldrig hade behövt tänka på.

Hallen de tränade i hade en tröskel vid ingången och en dörr som var för smal. Det tog fyra månader och elva mejl innan kommunen byggde om den. Ingen i laget mindes en enda övning från den perioden, men alla mindes tröskeln.

Tränaren fokuserade inte bara på teknik, utan också på respekt och gemenskap. Hen betonade att varje spelare bidrog med något unikt. När laget började förstå detta förändrades dynamiken.

Samira lärde sig svenska snabbare på träningarna än i klassrummet. Orden hon behövde var få och kom tillbaka varje gång, och ingen rättade henne mitt i en mening. Efter ett par månader var det hon som förklarade övningarna för en ny spelare.

Alla motståndare var inte lika lätta att möta. Ett lag skrattade högt när de kom in på planen, och en tränare frågade om det verkligen var en riktig turnering de var anmälda till. Kim ville gå därifrån. Alex sa att de skulle spela klart, och att det bästa svaret var fyrtio minuter långt.

Under en viktig turnering mötte de ett lag som verkade starkare. Trots det spelade de med stort engagemang och stödde varandra hela tiden. Matchen blev jämn, och i slutet avgjorde Kim med ett avgörande skott.

Det som Leo mindes efteråt var inte skottet, utan passningen före. Samira hade sett Kim en halv sekund innan någon annan gjorde det, och hade gjort tecknet i stället för att ropa.

Efter matchen insåg de att deras styrka låg i mångfalden. De hade olika erfarenheter, men just det gjorde dem starkare tillsammans.

Historien om laget visar att samarbete och respekt kan övervinna många hinder, både på och utanför planen.`,
  questions: [
    { type: 'inferens', q: 'Varför var det första passet mest tyst?',
      options: ['För att tränaren hade blivit försenad', 'För att ingen ville vara den som frågade det uppenbara', 'För att de flesta ännu inte kunde språket', 'För att hallen var för stor för en så liten grupp'], correct: 1 },
    { type: 'literal', q: 'Varför slutade laget ropa instruktioner tvärs över planen?',
      options: ['För att Samira inte hann höra dem i tid', 'För att hallen hade mycket dålig akustik', 'För att tränaren hade förbjudit dem att göra det', 'För att motståndarlaget kunde höra vad de sa'], correct: 0 },
    { type: 'inferens', q: 'Vad visade sig gälla för handtecknen?',
      options: ['Att de var svårare att lära sig än laget trott', 'Att de bara var till hjälp för Samira', 'Att de fungerade bättre för hela laget', 'Att de gjorde spelet betydligt långsammare'], correct: 2 },
    { type: 'inferens', q: 'Varför bad Alex Leo att prova en övning från stolen?',
      options: ['För att Leo skulle be de andra om ursäkt', 'För att visa att stolen inte var något hinder alls', 'För att Leo behövde vila ryggen under ett pass', 'För att Leo skulle märka vad han aldrig behövt tänka på'], correct: 3 },
    { type: 'literal', q: 'Vad gjorde att Samira lärde sig språket snabbare på träningarna?',
      options: ['Orden var få, återkom ofta och ingen rättade henne mitt i en mening', 'Hon fick en egen lärare som följde med henne till hallen', 'Hon skrev upp alla nya ord direkt efter varje pass', 'Hon spelade bara tillsammans med dem som talade långsamt'], correct: 0 },
    { type: 'sammanfatta', q: 'Vad mindes Leo bäst efter matchen?',
      options: ['Att laget vunnit mot ett starkare motstånd', 'Passningen före skottet, och tecknet Samira gjorde', 'Att han själv hade spelat sin bästa match på år', 'Att tränaren hade hållit ett tal i omklädningsrummet'], correct: 1 },
  ],
},

// ── åk 7, 193 → ~515 ord ────────────────────────────────────────────────
'ak7-tema-041': {
  text: `Vatten är en av de viktigaste resurserna på jorden. Alla levande organismer behöver vatten för att överleva, och människor använder det varje dag till att dricka, laga mat, tvätta och producera varor. Trots att ungefär 70 procent av jordens yta är täckt av vatten är det bara en liten del som är sötvatten och kan användas direkt av människor.

Siffrorna är slående. Ungefär 97 procent av allt vatten på jorden är salt. Av de tre procent som är sötvatten är dessutom det mesta bundet i glaciärer och inlandsisar. Det vatten som människor faktiskt kan använda är alltså en liten del av en liten del.

Vatten försvinner egentligen aldrig. Det avdunstar från hav och sjöar, bildar moln, faller som regn och rinner tillbaka. Samma vattenmolekyler har funnits på jorden i miljarder år. Problemet är alltså inte att vattnet tar slut, utan att det inte alltid finns på rätt plats, vid rätt tid och i tillräckligt rent skick.

Sötvatten finns i sjöar, floder och grundvatten. I många delar av världen är tillgången på rent vatten begränsad. Detta kan bero på klimatförändringar, föroreningar eller att vatten används snabbare än det hinner återbildas. Brist på vatten kan leda till problem med hälsa, jordbruk och ekonomisk utveckling.

Mest vatten går inte åt i kranarna utan i jordbruket. Omkring sju tiondelar av allt sötvatten som människor använder går till att odla mat och till djurhållning. Det betyder att den största vattenanvändningen sker långt från den som äter maten, och att en vara kan bära med sig vatten från ett helt annat land.

Ett känt exempel är Aralsjön i Centralasien, som en gång var en av världens största sjöar. När floderna som fyllde den leddes om till bomullsodlingar krympte sjön till en bråkdel av sin storlek. Fiskebåtar står i dag på torr sand flera mil från vattnet.

Även i Sverige, som har gott om vatten, kan brist uppstå. På öar och i delar av landet med tunna jordlager kan grundvattnet ta slut under torra somrar, och kommuner har infört bevattningsförbud flera år i rad.

Rent vatten är också en hälsofråga. Sjukdomar som sprids via förorenat vatten, till exempel kolera och diarrésjukdomar, är en av de vanligaste dödsorsakerna bland små barn i världen. Det är dessutom ofta flickor som får gå långa sträckor för att hämta vatten, vilket gör att de missar skolan. En brunn i byn handlar därför inte bara om vatten.

För att skydda vattenresurser är det viktigt att använda vatten på ett hållbart sätt. Det innebär att minska slöseri, rena förorenat vatten och skydda naturen. Teknik spelar också en viktig roll, till exempel genom vattenrening och avsaltning av havsvatten. Avsaltning fungerar men kräver mycket energi, vilket gör den dyr och beroende av var elen kommer ifrån.

Internationellt samarbete är ofta nödvändigt eftersom många floder och sjöar delas av flera länder. Konflikter kan uppstå om vattenresurser, men samarbete kan också leda till bättre lösningar. Den som bygger en damm uppströms påverkar alla som bor nedströms, och det finns floder där ett tiotal länder måste komma överens.

Genom att förstå hur viktigt vatten är kan människor bidra till att använda det mer ansvarsfullt och säkra tillgången för framtida generationer.`,
  questions: [
    { type: 'literal', q: 'Hur stor del av jordens vatten är salt?',
      options: ['Ungefär 97 procent', 'Ungefär 70 procent', 'Ungefär hälften', 'Ungefär 30 procent'], correct: 0 },
    { type: 'inferens', q: 'Varför beskrivs det användbara vattnet som en liten del av en liten del?',
      options: ['För att sjöar och floder ligger utspridda över jorden', 'För att det mesta sötvattnet är bundet i is', 'För att grundvattnet ligger alldeles för djupt ner', 'För att vattnet blir förorenat med tiden'], correct: 1 },
    { type: 'literal', q: 'Vart går den största delen av sötvattnet?',
      options: ['Till industrin och tillverkningen av varor', 'Till hushållens kranar, duschar och toaletter', 'Till jordbruk och djurhållning', 'Till kylning av kraftverk och fabriker'], correct: 2 },
    { type: 'inferens', q: 'Vad visar exemplet med Aralsjön?',
      options: ['Att stora sjöar krymper naturligt över tid', 'Att fiske är en känslig näring att leva av', 'Att bomull kräver mindre vatten än andra grödor', 'Att omledning av floder kan torrlägga en hel sjö'], correct: 3 },
    { type: 'literal', q: 'Vilken nackdel har avsaltning av havsvatten?',
      options: ['Den kräver mycket energi och blir därför dyr', 'Den ger vatten som inte går att dricka', 'Den fungerar bara i kalla klimat', 'Den förstör grundvattnet i närheten'], correct: 0 },
    { type: 'sammanfatta', q: 'Varför krävs internationellt samarbete om vatten?',
      options: ['För att tekniken är för dyr för enskilda länder', 'För att den som bygger uppströms påverkar alla nedströms', 'För att FN kräver det av samtliga medlemsländer', 'För att vattnet annars blir olika rent i olika länder'], correct: 1 },
  ],
},

// ── åk 10, 201 → ~605 ord ───────────────────────────────────────────────
'akgy-mj-002': {
  text: `Michael Jacksons liv var inte bara fyllt av framgång utan också av kontroverser som påverkade hur han uppfattades av allmänheten. Under 1990-talet började medier rapportera om anklagelser mot honom, vilket ledde till omfattande rättsprocesser och debatter i samhället. Även om han aldrig dömdes i flera av fallen, påverkade dessa händelser hans rykte kraftigt.

Det som faktiskt hände går att sammanfatta kort, även om tolkningarna går isär. En anklagelse 1993 ledde aldrig till åtal utan gjordes upp utanför domstol, mot en betydande summa. Ett åtal 2005 prövades i rättegång, och Jackson friades på samtliga punkter. Efter hans död har nya vittnesmål framförts i dokumentärer, utan att prövas rättsligt. Att en person frikänts betyder inte att alla anser frågan avgjord, och det är i det utrymmet diskussionen fortsätter.

Samtidigt var Jackson känd för sitt ovanliga privatliv. Han levde under lång tid på sin ranch Neverland, som var utformad som en nöjespark. Detta bidrog till bilden av honom som en excentrisk person. Mediernas intensiva bevakning gjorde att varje aspekt av hans liv granskades, från hans relationer till förändringar i hans utseende.

Bevakningen var inte neutral. Under 1980- och 1990-talen växte en kvällspress som tjänade pengar på just den sortens berättelser, och ett öknamn upprepades så många gånger att det till slut fungerade som en beskrivning snarare än som ett hån. Historier som var uppenbart påhittade, som att han skulle sova i en syrekammare, trycktes ändå och lever kvar. Delar av dem lär ha spridits av hans egen sida för att hålla intresset uppe, vilket komplicerar frågan om vem som byggde bilden.

Bevakningen fortsatte in i familjen. Jackson täckte länge sina barns ansikten när de visade sig offentligt, ett beteende som beskrevs som ännu ett bevis på hans excentricitet. Läst i dag framstår det snarare som en rimlig reaktion från någon vars varje steg fotograferades och såldes vidare.

Förändringarna i hans utseende väckte särskilt stor uppmärksamhet. Jackson själv förklarade att han led av hudsjukdomen vitiligo, vilket påverkar hudens pigment. Diagnosen bekräftades senare vid obduktionen. Trots detta fortsatte spekulationerna kring hans utseende, vilket visar hur kändisskap kan leda till att privatlivet suddas ut.

Diskussionen om hans utseende bar dessutom på något mer. Att en svart artist blev ljusare tolkades av många som ett ställningstagande, och frågan blev laddad på ett sätt den inte hade blivit för en vit artist. Att en sjukdom fick förklara förändringen gjorde inte att tolkningarna upphörde.

Också hans förhållande till barn beskrevs i termer som har ändrats sedan dess. Att en vuxen man byggde en nöjespark och bjöd in barn framställdes länge som excentriskt snarare än som något att granska. Efter anklagelserna lästes samma handlingar av många på ett helt annat sätt. Vad man såg berodde alltså delvis på när man tittade.

En del av förklaringen finns i hur tidigt det började. Jackson uppträdde inför publik från fem års ålder och arbetade under förhållanden som i dag skulle betraktas som barnarbete. Han har själv beskrivit en barndom utan barndom. Det ursäktar ingenting, men det förklarar varför så mycket i hans vuxna liv kretsade kring det han aldrig fick.

Det är viktigt att förstå att Jacksons offentliga bild formades både av hans egna val och av mediernas framställning. Denna dubbla påverkan gör det svårt att avgöra vad som är fakta och vad som är tolkning.

Fallet säger också något om hur en publik hanterar obehag. Det är enklare att antingen försvara allt eller fördöma allt än att hålla kvar två saker samtidigt: att en person kan ha skapat något betydelsefullt och samtidigt vara föremål för allvarliga anklagelser som aldrig fått ett slutgiltigt svar.

Texten belyser hur kändisskap kan innebära både framgång och stora personliga utmaningar, särskilt när gränsen mellan privat och offentligt liv försvinner.`,
  questions: [
    { type: 'literal', q: 'Hur slutade anklagelsen från 1993?',
      options: ['Den gjordes upp utanför domstol', 'Den ledde till en fällande dom', 'Den avskrevs efter en polisutredning', 'Den prövades i två olika instanser'], correct: 0 },
    { type: 'inferens', q: 'Varför fortsätter diskussionen trots frikännandet 2005?',
      options: ['För att domen överklagades av åklagaren', 'För att ett frikännande inte får alla att anse frågan avgjord', 'För att rättegången aldrig blev offentlig', 'För att bevisningen förstördes under processen'], correct: 1 },
    { type: 'literal', q: 'Vad sägs om historien om syrekammaren?',
      options: ['Att den bekräftades av hans egen läkare', 'Att den framkom under rättegången 2005', 'Att den var påhittad men trycktes ändå', 'Att den kom från en tidigare anställd'], correct: 2 },
    { type: 'inferens', q: 'Varför komplicerar hans egen sidas roll frågan om vem som byggde bilden?',
      options: ['För att han stämde tidningarna långt i efterhand', 'För att skivbolaget ägde flera av tidningarna', 'För att han vägrade kommentera några rykten alls', 'För att delar av ryktena kan ha spridits av honom själv'], correct: 3 },
    { type: 'inferens', q: 'Varför blev frågan om hans hudfärg särskilt laddad?',
      options: ['För att en svart artist som blev ljusare lästes som ett ställningstagande', 'För att diagnosen aldrig kunde bekräftas medicinskt', 'För att han själv vägrade kommentera saken offentligt', 'För att ljusare hy var ovanligt i musikbranschen då'], correct: 0 },
    { type: 'forfattarens-syfte', q: 'Vad menar texten att en publik har svårt med?',
      options: ['Att skilja mellan olika perioder i en lång karriär', 'Att hålla kvar två motstridiga saker samtidigt', 'Att förstå hur rättsprocesser går till i praktiken', 'Att avgöra vilka medier som är trovärdiga'], correct: 1 },
  ],
},

// ── åk 7, berättelse, 202 → ~515 ord ────────────────────────────────────
'ak7-tema-026': {
  text: `Ali och hans vän Nora bestämde sig för att tillbringa en dag i stadens stora park. Parken låg mitt i centrum och var en plats där många människor samlades. Det fanns gamla träd, öppna gräsytor och en liten sjö där änder simmade. När de kom fram såg de barn som lekte, äldre personer som promenerade och några som satt och läste på bänkar.

Ali och Nora började med att gå runt sjön. De pratade om skolan och sina framtidsdrömmar. Nora ville bli läkare, medan Ali funderade på att arbeta med teknik.

"Du säger teknik varje gång någon frågar", sa Nora. "Men du menar inte teknik. Du menar att du inte vet."

Ali skulle ha blivit sur om någon annan sagt det. Nu skrattade han bara, för det var sant.

Vid sjön stod en pojke i femårsåldern och grät för att hans ballong fastnat i ett träd. Ali försökte kasta upp sin jacka mot snöret och missade tre gånger. En äldre man som suttit på en bänk reste sig, sträckte upp sin käpp och fick ner den på första försöket. Han sa ingenting, bara nickade och satte sig igen.

Efter promenaden satte de sig på en filt och åt lunch. De hade med sig smörgåsar, frukt och juice.

Medan de åt kom en and och ställde sig alldeles för nära. Nora bröt en bit bröd och sträckte fram handen.

"Det får man inte", sa en röst bakom dem.

Det var en kvinna i gul väst, ungefär i deras föräldrars ålder. Nora drog tillbaka handen och blev röd i ansiktet.

Kvinnan satte sig på huk. Hon sa att bröd är som godis för änder: det ser ut som mat men innehåller inte det de behöver, och en and som blir van vid bröd slutar leta efter riktig föda. Sedan tog hon upp en liten påse ur fickan och gav dem varsin näve frön.

Nora sa efteråt att hon nästan hade gått hem av bara skam.

"Hon var ju inte arg", sa Ali.

"Nej", sa Nora. "Det var det som var det jobbiga."

Senare på dagen deltog de i en aktivitet som arrangerades i parken. Det var en grupp som lärde ut hur man planterar blommor och tar hand om naturen. De fick prova att plantera små växter i krukor. Ledaren berättade varför det är viktigt att ta hand om miljön och hur växter hjälper till att rena luften.

Det var kvinnan i den gula västen som höll i det.

Hon kände igen dem och nickade, men sa ingenting om änderna. I stället lät hon Nora visa de andra hur man lossar rötterna innan man sätter ner en planta, något Nora själv hade lärt sig fem minuter tidigare.

Innan de gick hem köpte de glass från en kiosk. De satte sig på en bänk och tittade på solnedgången.

Ali sa att han hade tänkt på mannen med käppen hela dagen. Nora frågade varför. Ali sa att han inte visste, men att det var något med att någon hjälpte till utan att först se sig omkring. Dagen hade varit både rolig och lärorik. De bestämde sig för att komma tillbaka nästa vecka.`,
  questions: [
    { type: 'inferens', q: 'Varför blev Ali inte sur på Noras kommentar om teknik?',
      options: ['För att han inte riktigt hörde vad hon sa', 'För att hon sa det på skämt och log', 'För att hon hade rätt', 'För att han redan hade bestämt sig för annat'], correct: 2 },
    { type: 'literal', q: 'Varför får man inte mata änder med bröd?',
      options: ['Bröd ser ut som mat men saknar det änderna behöver', 'Bröd får änderna att stanna kvar över hela vintern', 'Bröd förorenar vattnet i den lilla sjön', 'Bröd lockar dit andra fåglar som jagar bort änderna'], correct: 0 },
    { type: 'inferens', q: 'Varför var det jobbiga att kvinnan inte var arg?',
      options: ['För att Nora inte förstod vad hon egentligen menade', 'För att Nora inte kunde försvara sig med att bli sur tillbaka', 'För att alla andra i parken tittade på dem', 'För att kvinnan aldrig förklarade varför det var fel'], correct: 1 },
    { type: 'literal', q: 'Vad gav kvinnan dem i stället för bröd?',
      options: ['En broschyr om parkens djur och växter', 'Varsin näve frön', 'En påse med bröd som var godkänt att ge', 'En karta över var i parken man får mata'], correct: 1 },
    { type: 'inferens', q: 'Varför lät kvinnan Nora visa de andra hur man planterar?',
      options: ['För att Nora var bäst i gruppen på att plantera', 'För att kvinnan själv inte hann hjälpa alla', 'För att de andra deltagarna hade bett om det', 'För att ge Nora något annat att bli ihågkommen för'], correct: 3 },
    { type: 'sammanfatta', q: 'Vad gör mötet med kvinnan betydelsefullt i berättelsen?',
      options: ['Det avgör vad Nora vill arbeta med i framtiden', 'Det gör att de bestämmer sig för att aldrig komma tillbaka', 'Det visar att en tillrättavisning kan ges utan att såra', 'Det förklarar varför parken behöver fler regler och skyltar'], correct: 2 },
  ],
},

// ── åk 8, 204 → ~550 ord ────────────────────────────────────────────────
'ak8-tema-001-b': {
  text: `Klimatförändringar är ett av de största globala problemen i vår tid. De orsakas främst av människans utsläpp av växthusgaser som koldioxid och metan. Dessa gaser bildar ett lager i atmosfären som gör att värmen från solen stannar kvar på jorden. Detta leder till en ökad medeltemperatur, vilket i sin tur påverkar väder, hav och ekosystem.

En av de mest synliga konsekvenserna är smältande glaciärer och isar i polarområdena. När isen smälter stiger havsnivån, vilket hotar kuststäder och lågt liggande områden. Samtidigt blir extrema väderhändelser, som värmeböljor, stormar och kraftiga regn, allt vanligare.

Förändringarna sker inte lika fort överallt. Arktis värms upp ungefär tre till fyra gånger snabbare än jorden i genomsnitt, vilket får följder långt utanför området eftersom is och havsströmmar hänger ihop med vädret på norra halvklotet. Det som händer långt bort stannar därför sällan där.

Havet förändras dessutom på ett sätt som inte syns. En stor del av den koldioxid vi släpper ut tas upp av vattnet, där den bildar en svag syra. Havet blir därmed surare, vilket gör det svårare för musslor, snäckor och koraller att bygga sina skal och skelett. Eftersom många arter äter just sådana djur kan förändringen fortplanta sig genom hela näringskedjan.

Korallreven är särskilt utsatta. När vattnet blir för varmt stöter korallen bort de alger som ger den både färg och näring, och revet bleknar. Ett rev kan återhämta sig om värmen släpper, men när värmeböljorna kommer allt tätare hinner det inte. Reven täcker en bråkdel av havsbottnen men är hem åt ungefär en fjärdedel av alla arter i havet.

Klimatförändringar påverkar även djur och växter. Många arter får svårt att anpassa sig till de snabba förändringarna och riskerar att dö ut. Jordbruket påverkas också, eftersom förändrade temperaturer och nederbördsmönster kan göra det svårare att odla mat.

Många arter flyttar sig i stället. Fiskar söker sig norrut mot kallare vatten och växtzoner förskjuts uppåt i bergen. För arter som redan lever högst upp, eller längst norrut, finns dock ingenstans att ta vägen.

Också människor flyttar. När skördar slår fel flera år i rad, eller när ett område drabbas av upprepade översvämningar, blir flytt ett av få kvarvarande alternativ. De flesta som tvingas lämna sina hem av klimatskäl flyttar inom sitt eget land, oftast från landsbygd till stad.

En del förändringar går inte att ta tillbaka. Om en inlandsis börjar smälta förbi en viss punkt fortsätter smältningen även om temperaturen sjunker igen, och en art som dött ut kommer inte tillbaka. Forskare talar om tröskelvärden: gränser där ett system tippar över i ett nytt tillstånd. Var de gränserna går vet ingen exakt, vilket är ett skäl att inte pröva sig fram.

För att minska klimatförändringarna behöver människor förändra sina vanor. Det handlar bland annat om att minska användningen av fossila bränslen, satsa på förnybar energi och konsumera mer hållbart. Internationella samarbeten, som klimatavtal, är också viktiga för att länder ska arbeta tillsammans.

Arbetet brukar delas i två delar. Att minska utsläppen kallas begränsning, medan anpassning handlar om att klara de förändringar som redan är på väg: skyddsvallar, varningssystem och grödor som tål torka. Båda behövs, eftersom en del av uppvärmningen är inbyggd redan av det som hittills släppts ut.

Trots att situationen är allvarlig finns det hopp. Forskning och teknikutveckling ger nya lösningar, och allt fler människor engagerar sig i miljöfrågor. Genom gemensamma insatser kan vi påverka framtiden och minska de negativa effekterna.`,
  questions: [
    { type: 'inferens', q: 'Varför blir havet surare?',
      options: ['För att varmare vatten löser upp fler mineraler ur botten', 'För att koldioxid som tas upp av vattnet bildar en svag syra', 'För att föroreningar från industrin rinner ut i havet', 'För att smältvattnet från isarna i sig är surt'], correct: 1 },
    { type: 'literal', q: 'Vad händer när vattnet blir för varmt för korallen?',
      options: ['Den växer snabbare men blir betydligt skörare', 'Den sjunker ner mot djupare och kallare vatten', 'Den stöter bort algerna och bleknar', 'Den ersätts av andra och tåligare korallarter'], correct: 2 },
    { type: 'inferens', q: 'Varför hinner reven inte återhämta sig i dag?',
      options: ['För att fisket har ökat kraftigt i samma områden', 'För att algerna inte längre finns kvar i havet', 'För att havsnivån stiger alldeles för snabbt', 'För att värmeböljorna kommer allt tätare'], correct: 3 },
    { type: 'literal', q: 'Vilka arter har svårast att flytta undan?',
      options: ['De som redan lever högst upp eller längst norrut', 'De som lever i grunda vatten nära kusterna', 'De som föder mycket få ungar per år', 'De som är beroende av en enda växtart'], correct: 0 },
    { type: 'literal', q: 'Vart flyttar de flesta som tvingas lämna sina hem av klimatskäl?',
      options: ['Till grannländer med starkare ekonomi', 'Inom sitt eget land, oftast till städer', 'Till länder längre norrut i Europa', 'Till nybyggda områden nära kusten'], correct: 1 },
    { type: 'ord', q: 'Vad är skillnaden mellan begränsning och anpassning?',
      options: ['Begränsning gäller länder medan anpassning gäller enskilda', 'Begränsning är frivillig medan anpassning är lagstadgad', 'Begränsning minskar utsläppen, anpassning klarar följderna', 'Begränsning är kortsiktig medan anpassning är långsiktig'], correct: 2 },
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
