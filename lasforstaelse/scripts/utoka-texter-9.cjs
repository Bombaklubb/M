#!/usr/bin/env node
//
// Sats 9: fem texter i intervallet 169–170 ord, med omskrivna frågor.

const fs = require('fs');
const path = require('path');

const NYA = {

// ── åk 8, 169 → ~550 ord ────────────────────────────────────────────────
'ak8-tema-004-b': {
  text: `Mänskliga rättigheter är grundläggande rättigheter som alla människor har, oavsett kön, ålder, bakgrund eller religion. De inkluderar rätten till liv, frihet, utbildning och yttrandefrihet. Dessa rättigheter är fastställda i internationella dokument, som FN:s deklaration om de mänskliga rättigheterna.

Det svåra är inte att formulera rättigheterna utan att se till att de följs. Till skillnad från vanliga lagar finns ingen världspolis som kan gripa den som bryter mot dem. Ett land som kränker sina invånares rättigheter kan kritiseras, uteslutas ur samarbeten eller drabbas av sanktioner, men det finns sällan något sätt att tvinga fram en förändring.

FN har ett råd för mänskliga rättigheter där länder granskar varandra. Systemet har kritiserats, eftersom stater som själva anklagas för övergrepp kan sitta i rådet och rösta. Försvaret brukar vara att ett samtal där alla deltar ändå är bättre än inget samtal alls.

Det finns också en internationell brottmålsdomstol i Haag, som kan döma enskilda personer för folkmord, brott mot mänskligheten och krigsförbrytelser. Domstolen är dock beroende av att länder överlämnar de misstänkta, och flera stora länder har inte anslutit sig. Det innebär att den som har makten kvar sällan hamnar inför rätta.

Vissa grupper har fått egna konventioner, eftersom de allmänna reglerna visat sig otillräckliga. Det finns särskilda avtal om kvinnors rättigheter, barns rättigheter och rättigheter för personer med funktionsnedsättning. Tanken är inte att dessa grupper ska ha fler rättigheter än andra, utan att beskriva vad de allmänna rättigheterna innebär i praktiken för just dem.

Trots detta respekteras inte rättigheterna överallt. I vissa länder begränsas människors frihet att uttrycka sina åsikter eller leva som de vill. Diskriminering och orättvisor är fortfarande vanliga problem.

En särskild grupp är de som tvingats fly. Rätten att söka asyl finns i flyktingkonventionen, och den innebär bland annat att ett land inte får skicka tillbaka någon till en plats där personen riskerar förföljelse. I praktiken uppstår ständigt tvister om vem som räknas som flykting och vilket land som har ansvaret.

Organisationer arbetar för att skydda och främja mänskliga rättigheter. De dokumenterar övergrepp, informerar allmänheten och påverkar politiska beslut. Aktivister spelar också en viktig roll genom att protestera och sprida kunskap. Arbetet är inte ofarligt: människorättsförsvarare fängslas, hotas och dödas varje år, och det sker oftast i just de länder där deras arbete behövs mest.

Samtidigt är kritiken ofta ojämnt fördelad. Ett land som är en viktig handelspartner eller allierad möter i regel mildare invändningar än ett land utan sådan betydelse. Den dubbelheten används i sin tur som argument av dem som vill avfärda hela systemet, vilket gör att trovärdigheten hänger ihop med att kritiken riktas lika åt alla håll.

Bilden är ändå inte enbart mörk. Antalet barn som får gå i skolan har ökat kraftigt sedan 1990-talet, dödsstraffet har avskaffats i de flesta länder och rättigheter som för femtio år sedan var otänkbara är i dag självklara i stora delar av världen. Framstegen kommer sällan av sig själva, utan efter långa kampanjer och politiska strider.

Utbildning är en viktig del i arbetet för mänskliga rättigheter. Genom att lära sig om sina rättigheter kan människor bättre försvara dem. Skolor och samhällen har därför en viktig uppgift att sprida kunskap.

Mänskliga rättigheter handlar inte bara om lagar, utan också om värderingar och respekt. Varje individ kan bidra genom att behandla andra rättvist och stå upp mot orättvisor.

Arbetet för mänskliga rättigheter är ständigt pågående och kräver engagemang från hela världen.`,
  questions: [
    { type: 'inferens', q: 'Varför är mänskliga rättigheter svårare att genomdriva än vanliga lagar?',
      options: ['För att texterna är skrivna på ett alltför otydligt sätt', 'För att de flesta länder aldrig skrivit under dem', 'För att det inte finns någon världspolis som kan ingripa', 'För att rättigheterna omformuleras alltför ofta'], correct: 2 },
    { type: 'literal', q: 'Vilken kritik riktas mot FN:s råd för mänskliga rättigheter?',
      options: ['Att stater som själva anklagas för övergrepp kan sitta i det', 'Att rådet sammanträder alldeles för sällan för att hinna med', 'Att bara de rikaste länderna har rätt att delta i arbetet', 'Att alla beslut kräver full enighet bland medlemmarna'], correct: 0 },
    { type: 'literal', q: 'Vad kan brottmålsdomstolen i Haag döma enskilda personer för?',
      options: ['Skattebrott och korruption i offentlig förvaltning', 'Folkmord, brott mot mänskligheten och krigsförbrytelser', 'Brott mot internationella handels- och miljöavtal', 'Alla brott som begåtts under en väpnad konflikt'], correct: 1 },
    { type: 'inferens', q: 'Varför hamnar den som har makten kvar sällan inför rätta?',
      options: ['För att domstolen saknar juridisk behörighet i landet', 'För att brotten preskriberas efter ett visst antal år', 'För att bevisningen förstörs i samband med konflikter', 'För att domstolen behöver att någon överlämnar den misstänkte'], correct: 3 },
    { type: 'literal', q: 'Vad innebär rätten att söka asyl enligt texten?',
      options: ['Att alla som ansöker har rätt att stanna kvar i landet', 'Att ett land inte får skicka tillbaka någon till förföljelse', 'Att ansökan måste göras i det första landet man når', 'Att FN avgör vilka som ska räknas som flyktingar'], correct: 1 },
    { type: 'sammanfatta', q: 'Vad säger texten om människorättsförsvarare?',
      options: ['Att deras arbete numera är förhållandevis riskfritt', 'Att de framför allt är verksamma i västvärlden', 'Att de fängslas och hotas, oftast där de behövs mest', 'Att deras roll tagits över av internationella domstolar'], correct: 2 },
  ],
},

// ── åk 7, 169 → ~515 ord ────────────────────────────────────────────────
'ak7-tema-043': {
  text: `Universum är allt som finns – planeter, stjärnor, galaxer och tomrum. Vår egen planet, jorden, är en del av solsystemet som kretsar kring solen. Solen är en stjärna, och det finns miljarder andra stjärnor i vår galax, Vintergatan.

Rymden är enorm och svår att förstå. Avstånd mäts ofta i ljusår, vilket är den sträcka ljuset färdas på ett år. Eftersom ljuset färdas mycket snabbt blir ett ljusår en oerhört lång sträcka: nästan tiotusen miljarder kilometer. Närmaste stjärna utanför vårt eget solsystem ligger drygt fyra ljusår bort.

I vårt solsystem finns åtta planeter. De fyra närmast solen är små och byggda av sten, medan de fyra yttre är enorma och består mest av gas och is. Jorden ligger på ett avstånd där vatten kan finnas i flytande form, vilket är en av förutsättningarna för liv som vi känner det.

Att avstånden är så stora får en märklig följd. När vi tittar på en stjärna ser vi inte hur den ser ut nu, utan hur den såg ut när ljuset lämnade den. Att titta ut i rymden är därför samma sak som att titta bakåt i tiden. En del av de stjärnor vi ser kan redan ha slocknat.

Forskare använder teleskop och rymdsonder för att studera universum. Genom dessa verktyg har man upptäckt nya planeter och lärt sig mer om hur stjärnor bildas och dör. Svarta hål är ett exempel på ett fenomen som fortfarande forskas mycket om. Ett svart hål har så stark dragningskraft att inte ens ljus kan ta sig ut, vilket gör att det inte går att se direkt utan bara genom hur det påverkar sin omgivning.

Stjärnor bildas ur moln av gas och stoft som dras samman av tyngdkraften. När en stor stjärna till slut får slut på bränsle kan den explodera och sprida ut de ämnen som bildats inuti den. Det är därifrån de flesta grundämnen på jorden kommer, även de som finns i våra egna kroppar.

Nya instrument gör ständigt att bilden förändras. Rymdteleskop placeras utanför atmosfären, eftersom luften annars gör bilderna suddiga. Teleskopet James Webb, som sändes upp 2021, ser i infrarött ljus och kan därför titta genom stoftmoln och längre bakåt i universums historia än något tidigare instrument.

Frågan om det finns liv någon annanstans är en av de största. Forskare har hittat tusentals planeter kring andra stjärnor, och några av dem ligger på rätt avstånd från sin sol. Att hitta en planet är dock inte samma sak som att veta något om den. Det som går att mäta är främst storlek, bana och ibland vilka gaser som finns i atmosfären.

Rymdforskning har också lett till teknik som används på jorden, till exempel satelliter som används för kommunikation och väderprognoser. Positionering i mobiltelefoner bygger på samma sak, och den som tittar på en väderkarta ser resultatet av mätningar gjorda från omloppsbana.

Trots alla upptäckter finns det fortfarande mycket vi inte vet om universum. Forskare räknar med att den synliga materien bara utgör en liten del av innehållet, medan resten består av något som kallas mörk materia och mörk energi och som ingen ännu har lyckats observera direkt.

Genom att studera rymden kan människor förstå mer om sin egen plats i universum.`,
  questions: [
    { type: 'literal', q: 'Hur långt bort ligger närmaste stjärna utanför solsystemet?',
      options: ['Drygt fyra ljusår', 'Ungefär ett ljusår', 'Omkring hundra ljusår', 'Runt tiotusen ljusår'], correct: 0 },
    { type: 'inferens', q: 'Varför säger texten att titta ut i rymden är att titta bakåt i tiden?',
      options: ['För att teleskopen visar gamla inspelade bilder', 'För att stjärnorna rör sig långsammare än jorden gör', 'För att ljuset har tagit lång tid på sig att nå oss', 'För att universum krymper med tiden som går'], correct: 2 },
    { type: 'inferens', q: 'Varför går ett svart hål inte att se direkt?',
      options: ['För att det ligger för långt bort för dagens teleskop', 'För att inte ens ljus kan ta sig ut ur det', 'För att det bara existerar under mycket korta perioder', 'För att det alltid är omgivet av tjocka gasmoln'], correct: 1 },
    { type: 'literal', q: 'Varifrån kommer de flesta grundämnen på jorden?',
      options: ['Från kometer som träffat jorden tidigt i dess historia', 'Från solens yttersta lager av het gas', 'Från gasmoln som aldrig kommit att bilda stjärnor', 'Från stjärnor som exploderat och spridit sitt innehåll'], correct: 3 },
    { type: 'literal', q: 'Vilken vardaglig teknik bygger på satelliter enligt texten?',
      options: ['Positionering i mobiltelefoner', 'Uppvärmning av bostadshus', 'Tillverkning av batterier', 'Rening av dricksvatten'], correct: 0 },
    { type: 'sammanfatta', q: 'Vad säger texten om hur mycket vi känner till om universum?',
      options: ['Att nästan allt i universum numera är kartlagt', 'Att den synliga materien bara är en liten del av innehållet', 'Att forskningen avstannat i brist på nya instrument', 'Att mörk materia har observerats direkt flera gånger'], correct: 1 },
  ],
},

// ── åk 9, 169 → ~580 ord ────────────────────────────────────────────────
'akgy-abba-005': {
  text: `ABBA:s musik handlar inte bara om underhållning utan också om identitet och känslor. Genom sina texter utforskar de teman som kärlek, osäkerhet, självständighet och förändring. Detta gör att lyssnare från olika bakgrunder kan känna igen sig i deras musik.

Genombrottet kom med Eurovision 1974 och låten Waterloo. Att vinna en tävling som då hade lågt anseende bland kritiker präglade länge hur gruppen bedömdes. Det som från början var en nackdel blev senare en del av berättelsen om dem: att musiken hade kvalitet oavsett i vilket sammanhang den först presenterades.

Ett återkommande drag är kontrasten mellan musik och text. Melodin kan vara ljus och dansant medan orden handlar om ett förhållande som tagit slut. The Winner Takes It All är ett tydligt exempel: låten låter storslagen, men texten beskriver en person som förlorat allt och försöker låta behärskad. Den motsättningen är en av anledningarna till att låtarna tolkas så olika.

Sångerna framförs ofta ur olika perspektiv, ibland från kvinnliga röster och ibland från manliga. Detta ger variation och bredd i hur berättelserna presenteras. Det bidrar också till att fler lyssnare kan identifiera sig med innehållet. Att texterna dessutom skrevs av männen i gruppen men sjöngs av kvinnorna har diskuterats: vems erfarenhet är det egentligen som uttrycks när orden och rösten kommer från olika håll?

ABBA:s musik har tolkats på många olika sätt beroende på lyssnarens erfarenheter. En låt kan uppfattas som glad av en person och sorglig av en annan. Detta visar på musikens subjektiva natur.

Att de två paren i gruppen separerade under ungefär samma år som några av de mest kända låtarna spelades in har påverkat hur texterna läses. Många hör dem som självbiografiska, medan medlemmarna själva varit försiktiga med att bekräfta det. Vad som är erfarenhet och vad som är hantverk går sällan att skilja åt i en låttext.

Också ljudet bidrar till känslan av igenkänning. Rösterna lades ofta i lager på lager, så att två sångare lät som en betydligt större kör. Tillsammans med ett tydligt pianokomp och melodier som rör sig i stora steg gav det ett uttryck som är lätt att känna igen efter några sekunder.

En särskild betydelse har gruppens musik fått i hbtq-sammanhang. Låtar om att stå utanför, att längta och att till slut stå upp för sig själv har lästs som något annat än vad de från början handlade om, och gruppen har blivit en självklar del av festivaler och klubbar världen över. Det är ett exempel på hur en publik kan ta över ett verk och ge det en ny innebörd.

Att sjunga på engelska var samtidigt ett medvetet val. Det gjorde musiken tillgänglig långt utanför Norden, men innebar också att texterna skrevs på ett språk som ingen i gruppen hade som modersmål. Vissa har hört det som en svaghet, andra menar att det bidrog till den enkelhet som gör raderna så lätta att minnas.

Gruppen har också bidragit till att förändra synen på popmusik som konstform. Deras noggrant producerade låtar visar att pop kan vara både kommersiell och konstnärligt genomtänkt. När skivorna kom fick de ändå ofta nedlåtande recensioner i Sverige, och omvärderingen kom först årtionden senare.

Idag används deras musik i många sammanhang där identitet och känslor står i fokus, exempelvis i film och teater. Musikalen Mamma Mia! har gjort låtarna kända för en publik som inte var född när de skrevs, samtidigt som den sätter in dem i en berättelse de från början inte hörde till.

ABBA:s arbete visar hur musik kan fungera som ett sätt att uttrycka och förstå sig själv och andra.`,
  questions: [
    { type: 'inferens', q: 'Varför tolkas ABBA:s låtar så olika av olika lyssnare?',
      options: ['För att texterna ofta är svåra att uppfatta i inspelningen', 'För att musiken kan vara ljus medan texten är mörk', 'För att låtarna spelats in i flera olika versioner', 'För att lyssnarna sällan hör en hel låt i taget'], correct: 1 },
    { type: 'literal', q: 'Vilken fråga har diskuterats om gruppens texter?',
      options: ['Om låtarna egentligen skrevs av utomstående textförfattare', 'Om texterna översattes korrekt när de gavs ut på svenska', 'Vems erfarenhet som uttrycks när ord och röst kommer från olika håll', 'Om texterna byggde på verkliga händelser i gruppen'], correct: 2 },
    { type: 'inferens', q: 'Vad visar musikens betydelse i hbtq-sammanhang?',
      options: ['Att gruppen skrev sina låtar just för den publiken', 'Att texterna innehåller dolda budskap som få uppfattat', 'Att musik sällan når helt nya lyssnargrupper', 'Att en publik kan ta över ett verk och ge det ny innebörd'], correct: 3 },
    { type: 'inferens', q: 'Vilken effekt hade valet att sjunga på engelska?',
      options: ['Musiken nådde utanför Norden men skrevs på ett främmande språk', 'Låtarna blev betydligt svårare att framföra live', 'Texterna blev längre än de annars hade blivit', 'Gruppen förlorade en stor del av sin publik i Sverige'], correct: 0 },
    { type: 'literal', q: 'Hur togs skivorna emot i Sverige när de kom ut?',
      options: ['De hyllades genast av de svenska kritikerna', 'De fick ofta nedlåtande recensioner', 'De uppmärksammades knappt alls av pressen', 'De förbjöds i radion under en kortare period'], correct: 1 },
    { type: 'sammanfatta', q: 'Vad har musikalen Mamma Mia! inneburit för låtarna?',
      options: ['Att de skrevs om till helt nya versioner', 'Att gruppen återförenades och turnerade igen', 'Att de nått en publik som inte var född när de skrevs', 'Att de började analyseras av musikforskare'], correct: 2 },
  ],
},

// ── åk 7, 170 → ~515 ord ────────────────────────────────────────────────
'ak7-tema-044': {
  text: `Musik har alltid varit en viktig del av människors liv. Den används för att uttrycka känslor, berätta historier och skapa gemenskap. Musik finns i många olika genrer, som pop, rock, hiphop och klassisk musik, och människor kan ha väldigt olika musiksmak.

Musik är dessutom äldre än skriftspråket. De äldsta instrument som hittats är flöjter av ben, uppemot fyrtiotusen år gamla. Innan man kunde skriva ned något användes sång för att komma ihåg: det är lättare att minnas en lång berättelse om den har en melodi och en rytm.

Musik påverkar hur vi känner oss. En lugn låt kan göra oss avslappnade, medan en snabb låt kan ge energi. Många använder musik för att koncentrera sig eller för att koppla av efter en lång dag. Effekten går också att mäta i kroppen: puls och andning kan följa musikens tempo, och musik används därför inom vården, till exempel för att minska oro före en operation.

Att musik påverkar oss så starkt har en förklaring i hjärnan. När vi hör en melodi vi tycker om frigörs samma ämnen som vid annat som känns bra, till exempel god mat. Hjärnan gissar dessutom hela tiden vad som kommer härnäst i en låt, och känslan av att gissa rätt är en del av njutningen.

Musik spelar också en viktig roll i kulturer runt om i världen. Traditionell musik kan berätta om ett lands historia och identitet. Samtidigt sprids musik snabbt globalt genom internet, vilket gör att olika stilar blandas. En låt som spelas in i Lagos kan bli populär i Stockholm inom en vecka, något som var otänkbart för bara ett par årtionden sedan.

Musiksmaken hänger dessutom ihop med vilka vi vill vara. Vad man lyssnar på har länge fungerat som ett sätt att visa vilken grupp man hör till, och tonåren är ofta den period då musiken sätter sig hårdast. Många fortsätter att tycka allra bäst om det de lyssnade på när de var femton.

Sättet vi lyssnar på har förändrats snabbt. Tidigare köpte man en skiva och hörde låtarna i den ordning artisten valt. I dag väljer en tjänst åt oss, och en spellista blandar artister som aldrig hört talas om varandra. Det ger enorm tillgång, men gör också att färre lyssnar igenom ett helt album.

Musik har också använts för att protestera. Sånger har spridit budskap i tider då tidningar varit förbjudna, och en text kan bäras vidare av människor som aldrig träffat varandra. Just därför har musik ibland varit förbjuden: en melodi som alla kan sjunga är svår för en makthavare att kontrollera.

Att spela ett instrument eller sjunga kan utveckla både kreativitet och disciplin. Många arbetar professionellt med musik, men det är också en vanlig hobby. Att öva på ett instrument tränar dessutom uppmärksamhet och tålamod, eftersom framstegen kommer långsamt och kräver upprepning.

Musik kan dessutom föra människor samman. Konserter och festivaler ger människor möjlighet att dela upplevelser. Att sjunga tillsammans i en kör eller på en läktare skapar en känsla av samhörighet som är svår att åstadkomma på andra sätt.

Sammanfattningsvis är musik mer än bara underhållning – den är en viktig del av både individens liv och samhället.`,
  questions: [
    { type: 'literal', q: 'Vilka är de äldsta instrument som hittats?',
      options: ['Flöjter av ben', 'Trummor av skinn', 'Strängar av senor', 'Skallror av lera'], correct: 0 },
    { type: 'inferens', q: 'Varför användes sång innan man kunde skriva ned saker?',
      options: ['För att sång hördes betydligt längre än vanligt tal', 'För att melodi och rytm gör en berättelse lättare att minnas', 'För att bara vissa personer fick tala offentligt', 'För att språket saknade ord för det som hänt'], correct: 1 },
    { type: 'literal', q: 'Hur används musik inom vården enligt texten?',
      options: ['För att helt ersätta smärtstillande läkemedel', 'För att hjälpa personalen att arbeta snabbare', 'För att minska oro före en operation', 'För att mäta patienternas hörsel'], correct: 2 },
    { type: 'inferens', q: 'Varför nämns att en låt från Lagos kan bli populär i Stockholm?',
      options: ['För att visa att afrikansk musik dominerar listorna', 'För att förklara varför skivbolag flyttat utomlands', 'För att jämföra musiksmaken i olika länder', 'För att visa hur snabbt musik sprids i dag'], correct: 3 },
    { type: 'inferens', q: 'Vad säger texten om musiksmak och tonåren?',
      options: ['Att musiken från de åren ofta sitter kvar hela livet', 'Att smaken förändras mest efter tjugofem års ålder', 'Att unga sällan väljer sin musik helt själva', 'Att tonåringar lyssnar på fler genrer än vuxna gör'], correct: 0 },
    { type: 'sammanfatta', q: 'Vilken bild av musik ger texten som helhet?',
      options: ['Att musik främst är en form av underhållning', 'Att musikens betydelse minskat i och med internet', 'Att musik påverkar både enskilda människor och samhället', 'Att musik i första hand bör ses som ett yrke'], correct: 2 },
  ],
},

// ── åk 9, 170 → ~580 ord ────────────────────────────────────────────────
'ak10-arsenal-005': {
  text: `Arsenal står inför en framtid där både möjligheter och utmaningar är tydliga. Klubben har under de senaste åren satsat på en yngre spelartrupp, vilket tyder på ett långsiktigt tänkande.

Att bygga runt unga spelare är samtidigt en avvägning. En ung trupp kostar mindre och kan hålla ihop under många år, men den saknar ofta erfarenheten av att avgöra jämna matcher i april och maj. Flera klubbar har prövat samma väg och tvingats vänta längre än de tänkt sig innan resultaten kom.

En viktig del av framtiden handlar om att utveckla spelare och skapa stabilitet. Genom att ge unga talanger tid att växa kan klubben bygga ett lag som håller över flera säsonger. Akademin i Hale End har fostrat flera spelare som tagit sig hela vägen till A-laget, vilket är ovanligt bland de största engelska klubbarna och något klubben framhåller som en del av sin identitet.

Samtidigt måste Arsenal fortsätta konkurrera med ekonomiskt starka klubbar. Detta kräver smarta värvningar och effektiv användning av resurser. Att hitta rätt balans mellan investering och utveckling är avgörande. En risk är att en klubb som lyckas utveckla spelare i stället blir en leverantör åt rikare klubbar, om den inte kan matcha de löner som erbjuds någon annanstans.

Tränarens roll har också förändrats. Där en manager förr bestämde det mesta själv, från värvningar till träningens innehåll, arbetar dagens tränare i en organisation med sportchef, analytiker och fysansvariga. Det gör verksamheten mindre sårbar när en tränare byts ut, eftersom en spelidé och en rekryteringsplan kan leva vidare oberoende av vem som står vid sidlinjen.

Teknologin spelar också en allt större roll inom fotboll. Analysverktyg används för att förbättra prestationer och minska skaderisker. Arsenal har investerat i sådana system för att ligga i framkant. Data från träningar och matcher används för att avgöra hur mycket en spelare tål, och för att hitta värvningar som passar ett visst spelsätt snarare än bara den som gjort flest mål.

Samtidigt finns gränser för vad siffror kan säga. Hur en spelare fungerar i ett omklädningsrum, hur den hanterar press eller anpassar sig till ett nytt land går inte att räkna fram. De dyraste misstagen i fotbollen handlar sällan om felaktig statistik.

En utmaning som gäller hela sporten är den växande matchkalendern. Fler turneringar och utökade format innebär fler matcher på samma antal veckor, och spelarnas fackliga organisationer har varnat för att belastningen blir ohållbar. För en klubb som satsar på en smal trupp av unga spelare är detta särskilt kännbart, eftersom en skada i en nyckelposition får större följder.

Frågan om vem som ska bestämma över sporten återkommer också. När ett antal storklubbar, Arsenal bland dem, 2021 försökte starta en europeisk superliga stoppades planerna av protester från supportrar inom några dygn. Händelsen visade att en klubb inte är helt fri att göra vad ägarna vill.

Supporterbasen kommer fortsatt vara viktig. Engagemang från fansen kan påverka både spelare och klubbens riktning. En stark relation mellan klubb och supportrar kan bidra till framgång. Den relationen sätts på prov när biljettpriser höjs eller när matcher flyttas till tider som passar tv-publik i andra tidszoner bättre än dem som faktiskt bor i London.

Damlaget har dessutom blivit en allt större del av verksamheten. Publiksiffrorna har stigit kraftigt de senaste åren, och flera matcher har spelats på Emirates inför en publik som få räknade med för ett decennium sedan.

Framtiden för Arsenal beror alltså på flera faktorer: ekonomi, strategi, spelutveckling och relationen till fansen. Hur klubben hanterar dessa delar kommer avgöra dess position i framtidens fotboll.`,
  questions: [
    { type: 'inferens', q: 'Vilken nackdel med en ung trupp tar texten upp?',
      options: ['Att lönerna blir högre än för mer erfarna spelare', 'Att den saknar erfarenhet av att avgöra jämna matcher', 'Att unga spelare byter klubb inför varje ny säsong', 'Att tränaren får mindre inflytande över laguttagningen'], correct: 1 },
    { type: 'literal', q: 'Vad framhåller klubben som en del av sin identitet?',
      options: ['Att akademin fostrat spelare hela vägen till A-laget', 'Att laget spelat på samma arena i över hundra år', 'Att klubben aldrig sålt en spelare till en rival', 'Att truppen enbart består av spelare från London'], correct: 0 },
    { type: 'inferens', q: 'Vilken risk finns för en klubb som lyckas utveckla spelare?',
      options: ['Att spelarna slutar tidigt på grund av skador', 'Att akademin blir för dyr att driva vidare', 'Att klubben blir en leverantör åt rikare klubbar', 'Att spelsättet blir förutsägbart för motståndarna'], correct: 2 },
    { type: 'literal', q: 'Vad används data från träningar och matcher till?',
      options: ['Att räkna ut biljettpriserna inför kommande säsong', 'Att bestämma hur många supportrar som får resa bort', 'Att välja ut vilka matcher som ska sändas i tv', 'Att avgöra hur mycket en spelare tål och hitta rätt värvningar'], correct: 3 },
    { type: 'inferens', q: 'Varför handlar de dyraste misstagen sällan om felaktig statistik?',
      options: ['För att statistiken numera är i det närmaste felfri', 'För att press och anpassning inte går att räkna fram', 'För att klubbarna sällan använder data i praktiken', 'För att misstagen nästan alltid beror på skador'], correct: 1 },
    { type: 'sammanfatta', q: 'Vad säger texten om relationen till supportrarna?',
      options: ['Att den saknar betydelse för resultaten på planen', 'Att den är starkast bland supportrar utanför England', 'Att den prövas av höjda priser och flyttade matchtider', 'Att den förbättrats sedan flytten till Emirates'], correct: 2 },
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
