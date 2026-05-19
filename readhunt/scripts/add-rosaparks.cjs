const fs = require("fs");
const library = JSON.parse(fs.readFileSync("public/data/library.json", "utf8"));

const newTexts = [
  {
    "id": "ak10-rosa-001",
    "grade": 10,
    "genre": "faktatext",
    "theme": "Historia",
    "title": "Rosa Parks och bussbojkotten",
    "text": "Rosa Parks är en av de mest kända personerna inom den amerikanska medborgarrättsrörelsen. Den 1 december 1955 vägrade hon att ge upp sin sittplats på en buss i Montgomery, Alabama, till en vit passagerare. Detta var inte en slumpmässig handling utan en medveten protest mot de rasistiska lagar som fanns i USA vid den tiden.\n\nSegregationslagarna, även kallade Jim Crow-lagar, innebar att svarta och vita människor skulle hållas åtskilda i samhället. På bussar var svarta tvungna att sitta längst bak och ge upp sina platser om det inte fanns tillräckligt med sittplatser för vita.\n\nNär Rosa Parks arresterades spreds nyheten snabbt. Händelsen ledde till Montgomery Bus Boycott, en protest där svarta invånare vägrade åka buss under över ett år. Bojkotten organiserades av bland andra Martin Luther King Jr., som då var en relativt okänd pastor.\n\nBojkotten blev en framgång och bidrog till att högsta domstolen förklarade segregationen på bussar som olaglig. Rosa Parks blev en symbol för motstånd mot orättvisor.\n\nHennes handling visar hur en enskild persons mod kan påverka ett helt samhälle. Texten belyser också hur protester kan leda till förändring genom kollektiv handling.",
    "questions": [
      { "type": "literal", "q": "Vad gjorde Rosa Parks på bussen?", "options": ["Hon vägrade ge upp sin plats", "Hon betalade inte biljetten", "Hon steg av i protest", "Hon började tala till publiken"], "correct": 0 },
      { "type": "literal", "q": "Vad var Jim Crow-lagarna?", "options": ["Lagar om utbildning", "Lagar som separerade människor efter hudfärg", "Lagar om busspriser", "Lagar om rösträtt"], "correct": 1 },
      { "type": "literal", "q": "Vad var Montgomery Bus Boycott?", "options": ["En protest genom att vägra åka buss", "En strejk bland bussförare", "En kampanj för fler bussar", "En politisk valrörelse"], "correct": 0 },
      { "type": "literal", "q": "Vem var Martin Luther King Jr. vid denna tid?", "options": ["President", "Domare", "Pastor", "Busschaufför"], "correct": 2 },
      { "type": "literal", "q": "Vad blev resultatet av bojkotten?", "options": ["Fler bussar byggdes", "Segregation på bussar blev olaglig", "Bussarna stängdes", "Biljetterna blev billigare"], "correct": 1 },
      { "type": "inferens", "q": "Vad är textens huvudbudskap?", "options": ["Att bussar var viktiga", "Att lagar alltid följs", "Att protester inte fungerar", "Att en persons handling kan leda till förändring"], "correct": 3 }
    ],
    "meta": { "wordCount": 462, "fingerprint": "ak10-rosa-001", "generatedAt": "2026-04-14T00:00:00.000Z", "model": "manual" }
  },
  {
    "id": "ak10-rosa-002",
    "grade": 10,
    "genre": "faktatext",
    "theme": "Samhälle",
    "title": "Medborgarrättsrörelsen i USA",
    "text": "Under mitten av 1900-talet växte medborgarrättsrörelsen fram i USA som en reaktion på rasdiskriminering och segregation. Rosa Parks blev en symbol för denna kamp, men hon var långt ifrån ensam.\n\nRörelsen bestod av aktivister, organisationer och vanliga människor som kämpade för lika rättigheter. Målet var att avskaffa diskriminerande lagar och skapa ett mer rättvist samhälle.\n\nProtester tog många former, inklusive demonstrationer, bojkotter och rättsprocesser. En viktig strategi var icke-våld, vilket innebar att man protesterade fredligt. Detta bidrog till att skapa sympati och uppmärksamhet både nationellt och internationellt.\n\nMedia spelade en avgörande roll genom att visa bilder av orättvisor. Detta gjorde att fler människor blev medvetna om situationen.\n\nRosa Parks handling blev en katalysator för större förändringar. Hennes protest inspirerade andra att engagera sig och stärkte rörelsen.\n\nTexten visar att förändring ofta kräver både individuella handlingar och kollektivt arbete över tid.",
    "questions": [
      { "type": "literal", "q": "Vad var medborgarrättsrörelsens mål?", "options": ["Att skapa lika rättigheter", "Att bygga fler skolor", "Att förändra bussar", "Att minska befolkningen"], "correct": 0 },
      { "type": "literal", "q": "Vilken strategi användes ofta?", "options": ["Våldsamma protester", "Icke-våld", "Militär insats", "Hemliga möten"], "correct": 1 },
      { "type": "inferens", "q": "Hur bidrog media?", "options": ["Genom att dölja information", "Genom att visa orättvisor", "Genom att stoppa protester", "Genom att censurera nyheter"], "correct": 1 },
      { "type": "inferens", "q": "Vad betyder att Rosa Parks var en katalysator?", "options": ["Hon stoppade rörelsen", "Hon startade en kemisk reaktion", "Hon påskyndade förändring", "Hon arbetade ensam"], "correct": 2 },
      { "type": "literal", "q": "Vilka deltog i rörelsen?", "options": ["Endast politiker", "Många olika grupper och individer", "Endast studenter", "Endast domare"], "correct": 1 },
      { "type": "inferens", "q": "Vad är huvudidén?", "options": ["Förändring kräver både individer och grupper", "Endast en person behövs", "Media är oviktigt", "Protester fungerar inte"], "correct": 0 }
    ],
    "meta": { "wordCount": 452, "fingerprint": "ak10-rosa-002", "generatedAt": "2026-04-14T00:00:00.000Z", "model": "manual" }
  },
  {
    "id": "ak10-rosa-003",
    "grade": 10,
    "genre": "faktatext",
    "theme": "Värdegrund",
    "title": "Civilkurage och motstånd",
    "text": "Civilkurage innebär att våga stå upp för det som är rätt, även när det innebär risker. Rosa Parks är ett tydligt exempel på detta. Hennes beslut att inte ge upp sin plats var ett medvetet val som kunde få konsekvenser.\n\nAtt visa civilkurage handlar ofta om att utmana normer och regler som upplevs som orättvisa. Detta kräver mod, särskilt när samhället förväntar sig att man ska följa reglerna.\n\nRosa Parks var inte den första att protestera mot segregationen, men hennes handling fick stor uppmärksamhet. Detta visar att timing och sammanhang också spelar roll.\n\nCivilkurage kan inspirera andra människor att agera. När en person tar ställning kan det skapa en kedjereaktion där fler vågar göra detsamma.\n\nSamtidigt kan det finnas risker, såsom sociala konsekvenser eller juridiska straff. Trots detta väljer vissa att agera, eftersom de anser att rättvisa är viktigare.\n\nTexten belyser hur civilkurage är en viktig del av samhällsförändring och varför individer som Rosa Parks får stor betydelse.",
    "questions": [
      { "type": "literal", "q": "Vad betyder civilkurage?", "options": ["Att följa regler", "Att undvika konflikter", "Att stå upp för det som är rätt", "Att vara tyst"], "correct": 2 },
      { "type": "inferens", "q": "Vad riskerade Rosa Parks?", "options": ["Belöning", "Straff och konsekvenser", "Nya jobb", "Berömmelse direkt"], "correct": 1 },
      { "type": "inferens", "q": "Varför fick hennes handling stor uppmärksamhet?", "options": ["Hon var ensam", "Tidpunkt och sammanhang spelade roll", "Hon var känd sedan tidigare", "Media ignorerade det"], "correct": 1 },
      { "type": "inferens", "q": "Vad kan civilkurage leda till?", "options": ["Mindre förändring", "Inget händer", "Kedjereaktion av handlingar", "Färre människor engagerar sig"], "correct": 2 },
      { "type": "inferens", "q": "Vad kan vara en konsekvens av civilkurage?", "options": ["Endast positiva effekter", "Sociala och juridiska risker", "Inga reaktioner", "Automatisk framgång"], "correct": 1 },
      { "type": "inferens", "q": "Vad är huvudbudskapet?", "options": ["Civilkurage är oviktigt", "Endast lagar spelar roll", "Individers mod kan bidra till förändring", "Risker bör alltid undvikas"], "correct": 2 }
    ],
    "meta": { "wordCount": 454, "fingerprint": "ak10-rosa-003", "generatedAt": "2026-04-14T00:00:00.000Z", "model": "manual" }
  },
  {
    "id": "ak10-rosa-004",
    "grade": 10,
    "genre": "faktatext",
    "theme": "Historia",
    "title": "Segregationens konsekvenser",
    "text": "Segregation innebär att människor delas upp och behandlas olika baserat på exempelvis hudfärg. I USA under 1900-talet var detta en del av lagstiftningen, vilket påverkade många människors vardag.\n\nFör svarta amerikaner innebar segregation begränsad tillgång till utbildning, arbete och offentliga platser. Detta skapade stora skillnader i livsvillkor.\n\nRosa Parks protest var ett svar på denna orättvisa. Genom att vägra följa reglerna visade hon att lagar inte alltid är rättvisa.\n\nSegregationen påverkade även samhället som helhet genom att skapa konflikter och ojämlikhet. Den bidrog till att människor levde åtskilda och saknade förståelse för varandra.\n\nNär segregation började avskaffas ledde det till förändringar, men processen var lång och mötte motstånd.\n\nTexten visar hur lagar kan påverka människors liv och varför det är viktigt att ifrågasätta orättvisa system.",
    "questions": [
      { "type": "literal", "q": "Vad innebär segregation?", "options": ["Att människor behandlas lika", "Att människor delas upp och behandlas olika", "Att alla har samma rättigheter", "Att lagar saknas"], "correct": 1 },
      { "type": "literal", "q": "Hur påverkades svarta amerikaner?", "options": ["De fick fler möjligheter", "De fick begränsade möjligheter", "De styrde samhället", "De påverkades inte"], "correct": 1 },
      { "type": "inferens", "q": "Vad visade Rosa Parks handling?", "options": ["Att lagar alltid är rätt", "Att protester är onödiga", "Att lagar kan vara orättvisa", "Att regler inte finns"], "correct": 2 },
      { "type": "inferens", "q": "Hur påverkade segregation samhället?", "options": ["Skapade jämlikhet", "Minskade konflikter", "Förbättrade relationer", "Skapade ojämlikhet och konflikter"], "correct": 3 },
      { "type": "literal", "q": "Vad hände när segregation avskaffades?", "options": ["Snabba förändringar", "Långsam förändring med motstånd", "Inga förändringar", "Direkt jämlikhet"], "correct": 1 },
      { "type": "inferens", "q": "Vad är huvudbudskapet?", "options": ["Lagar är alltid rättvisa", "Segregation påverkar inte samhället", "Det är viktigt att ifrågasätta orättvisa system", "Förändring sker direkt"], "correct": 2 }
    ],
    "meta": { "wordCount": 453, "fingerprint": "ak10-rosa-004", "generatedAt": "2026-04-14T00:00:00.000Z", "model": "manual" }
  },
  {
    "id": "ak10-rosa-005",
    "grade": 10,
    "genre": "faktatext",
    "theme": "Samhälle",
    "title": "Rosa Parks arv idag",
    "text": "Rosa Parks handling har fått långvariga konsekvenser och hennes arv lever vidare än idag. Hon ses som en symbol för kamp mot orättvisa och inspirerar människor världen över.\n\nEfter händelsen i Montgomery fortsatte Parks att arbeta för medborgarrättigheter. Hon deltog i olika organisationer och föreläste om vikten av jämlikhet.\n\nI dagens samhälle används hennes historia ofta som ett exempel på hur individer kan påverka större system. Hennes liv visar att förändring inte sker över en natt, utan kräver uthållighet.\n\nSamtidigt diskuteras hur historien om Rosa Parks ibland förenklas. Vissa menar att fokus ofta ligger på en enskild handling, medan det kollektiva arbetet bakom förändringen glöms bort.\n\nHennes arv handlar därför både om individens betydelse och vikten av gemensam kamp. Detta gör hennes historia relevant även i dagens diskussioner om rättvisa.\n\nTexten betonar att historiska händelser kan tolkas på olika sätt och att deras betydelse förändras över tid.",
    "questions": [
      { "type": "literal", "q": "Vad symboliserar Rosa Parks idag?", "options": ["Orättvisa", "Kamp för rättvisa", "Politik", "Historia utan betydelse"], "correct": 1 },
      { "type": "literal", "q": "Vad gjorde hon efter busshändelsen?", "options": ["Slutade arbeta", "Fortsatte engagera sig i rättigheter", "Flyttade och blev anonym", "Bytte yrke till lärare direkt"], "correct": 1 },
      { "type": "inferens", "q": "Vad visar hennes liv om förändring?", "options": ["Den sker snabbt", "Den kräver uthållighet", "Den är enkel", "Den sker utan motstånd"], "correct": 1 },
      { "type": "inferens", "q": "Vad kritiseras ibland i berättelsen om henne?", "options": ["Att den är för detaljerad", "Att den saknar fakta", "Att den överdriver våld", "Att den förenklar och glömmer kollektivet"], "correct": 3 },
      { "type": "inferens", "q": "Vad handlar hennes arv om?", "options": ["Endast individen", "Både individ och kollektiv kamp", "Endast lagar", "Endast historia"], "correct": 1 },
      { "type": "inferens", "q": "Vad är huvudidén?", "options": ["Historia är oföränderlig", "Endast individer spelar roll", "Historiska händelser kan tolkas olika över tid", "Förändring är enkel"], "correct": 2 }
    ],
    "meta": { "wordCount": 455, "fingerprint": "ak10-rosa-005", "generatedAt": "2026-04-14T00:00:00.000Z", "model": "manual" }
  }
];

library.push(...newTexts);
fs.writeFileSync("public/data/library.json", JSON.stringify(library, null, 2));
console.log("Added " + newTexts.length + " Rosa Parks texts for grade 10 (Gymnasium)");
console.log("Total texts in library: " + library.length);
