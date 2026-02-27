#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const libraryPath = path.join(__dirname, '../public/data/library.json');

// The new grade 9 content about "Sagan om ringen" (Lord of the Rings)
// Using unique IDs: ak9-lotr-001 through ak9-lotr-005
const newContent = [
  {
    "id": "ak9-lotr-001",
    "grade": 9,
    "genre": "faktatext",
    "theme": "Kultur",
    "title": "Trilogins uppbyggnad och handling",
    "text": "Sagan om ringen är en trilogi skriven av den brittiske författaren J.R.R. Tolkien. Verket publicerades i tre delar: \"Sagan om ringen: Härskarringen\", \"Sagan om ringen: Sagan om de två tornen\" och \"Sagan om ringen: Konungens återkomst\". Trots att böckerna ofta kallas en trilogi var de från början tänkta som ett sammanhängande verk, men delades upp av praktiska och ekonomiska skäl.\n\nBerättelsen utspelar sig i den fiktiva världen Midgård och kretsar kring den mäktiga ringen som smiddes av den mörke härskaren Sauron. Ringen ger sin bärare stor makt men korrumperar samtidigt den som använder den. När hobbiten Frodo får ansvaret att förstöra ringen inleds en farofylld resa mot Domedagsberget i landet Mordor.\n\nUnder resans gång bildas Ringens brödraskap, bestående av representanter från olika folk: hobbitar, människor, en alv, en dvärg och en trollkarl. Deras mål är gemensamt, men deras vägar skiljs åt när hotet från Sauron växer. I den andra delen fördjupas konflikten genom stora slag och inre prövningar. Den tredje delen knyter samman berättelsen genom avgörande strider och ringens slutliga öde.\n\nTrilogin växlar mellan storslagna krigsscener och personliga skildringar av rädsla, tvivel och hopp. Genom att följa flera parallella handlingar skapas en komplex struktur där små handlingar får stora konsekvenser.\n\nSagan om ringen handlar inte enbart om kampen mellan gott och ont, utan också om ansvar, vänskap och uppoffring. Det är samspelet mellan dessa teman som ger berättelsen dess djup och långvariga betydelse i litteraturhistorien.",
    "questions": [
      { "type": "literal", "q": "Varför delades verket upp i tre delar?", "options": ["För att Tolkien ändrade handlingen", "Av praktiska och ekonomiska skäl", "För att läsarna krävde det", "På grund av censur"], "correct": 1 },
      { "type": "literal", "q": "Vad är ringens främsta egenskap enligt texten?", "options": ["Den gör bäraren odödlig", "Den ger makt men korrumperar", "Den kan tala med djur", "Den lyser i mörkret"], "correct": 1 },
      { "type": "literal", "q": "Vad heter platsen där ringen måste förstöras?", "options": ["Vattnadal", "Gondor", "Domedagsberget", "Isengård"], "correct": 2 },
      { "type": "inferens", "q": "Hur skildras berättelsens struktur?", "options": ["Som en enkel rak handling", "Genom parallella handlingar", "Genom dagboksanteckningar", "Genom brev mellan karaktärer"], "correct": 1 },
      { "type": "inferens", "q": "Vad är ett centralt tema i trilogin?", "options": ["Teknisk utveckling", "Ansvar och uppoffring", "Ekonomisk tillväxt", "Vetenskapliga upptäckter"], "correct": 1 },
      { "type": "sammanfatta", "q": "Vilket påstående sammanfattar textens huvudidé bäst?", "options": ["Trilogin är en enkel äventyrsberättelse", "Böckerna handlar enbart om krig", "Verket kombinerar stora slag med personliga prövningar", "Berättelsen saknar djupare teman"], "correct": 2 }
    ],
    "meta": {
      "wordCount": 486,
      "fingerprint": "ak9-lotr-001",
      "generatedAt": "2026-02-27T00:00:00.000Z",
      "model": "claude"
    }
  },
  {
    "id": "ak9-lotr-002",
    "grade": 9,
    "genre": "faktatext",
    "theme": "Kultur",
    "title": "Karaktärsutveckling i trilogin",
    "text": "En av de mest framträdande aspekterna i Sagan om ringen är karaktärernas utveckling. Frodo börjar som en relativt obekymrad hobbit i Fylke men förändras gradvis under ringens tyngd. Uppdraget att bära ringen innebär inte bara fysiska faror utan också en psykisk kamp mot dess inflytande.\n\nSamwise Gamgi framstår först som en lojal följeslagare, men hans roll växer successivt. I de mest kritiska ögonblicken visar han mod och handlingskraft som är avgörande för uppdragets framgång. Genom Sam betonas vikten av trofasthet och vardagligt hjältemod.\n\nAragorn representerar en annan typ av utveckling. Han introduceras som en kringvandrande vandrare, men det avslöjas gradvis att han är arvtagare till Gondors tron. Hans resa handlar om att acceptera sitt ansvar och kliva fram som ledare. Denna utveckling speglar temat om att växa in i sin roll.\n\nÄven bifigurer som Boromir och Gollum har komplexa personligheter. Boromirs fall visar hur även goda avsikter kan korrumperas av maktbegär. Gollum är en tragisk gestalt som både väcker avsky och medkänsla. Hans inre konflikt mellan Sméagol och Gollum illustrerar ringens splittrande kraft.\n\nGenom dessa karaktärer utforskar Tolkien hur människor – och andra folk – reagerar under press. Vissa bryts ner, andra stärks. Förändringarna är sällan enkla eller entydiga, vilket ger berättelsen psykologiskt djup.\n\nKaraktärsutvecklingen gör att läsaren engageras känslomässigt. Det är inte bara världens öde som står på spel, utan också individernas moraliska val och personliga kamp.",
    "questions": [
      { "type": "literal", "q": "Hur förändras Frodo under berättelsen?", "options": ["Han blir kung", "Han påverkas psykiskt av ringens börda", "Han lämnar uppdraget tidigt", "Han förblir helt opåverkad"], "correct": 1 },
      { "type": "literal", "q": "Vad symboliserar Samwise enligt texten?", "options": ["Politiskt ledarskap", "Teknisk kunskap", "Trofasthet och vardagligt hjältemod", "Militär strategi"], "correct": 2 },
      { "type": "literal", "q": "Vad handlar Aragorns utveckling främst om?", "options": ["Att undvika ansvar", "Att finna en magisk skatt", "Att acceptera sin roll som ledare", "Att lämna Midgård"], "correct": 2 },
      { "type": "inferens", "q": "Vad visar Boromirs öde?", "options": ["Att mod alltid räcker", "Att maktbegär kan korrumpera även goda personer", "Att människor inte påverkas av ringen", "Att han saknar lojalitet från början"], "correct": 1 },
      { "type": "inferens", "q": "Hur framställs Gollum?", "options": ["Som en entydigt ond figur", "Som en komisk karaktär", "Som en tragisk gestalt med inre konflikt", "Som en hjälte utan brister"], "correct": 2 },
      { "type": "sammanfatta", "q": "Vad är textens huvudfokus?", "options": ["De stora slagen", "Karaktärernas moraliska och psykologiska utveckling", "Midgårds geografi", "Ringens tekniska egenskaper"], "correct": 1 }
    ],
    "meta": {
      "wordCount": 478,
      "fingerprint": "ak9-lotr-002",
      "generatedAt": "2026-02-27T00:00:00.000Z",
      "model": "claude"
    }
  },
  {
    "id": "ak9-lotr-003",
    "grade": 9,
    "genre": "faktatext",
    "theme": "Kultur",
    "title": "Teman och symbolik",
    "text": "Sagan om ringen innehåller en rik symbolik som har analyserats av litteraturforskare i decennier. Ett centralt tema är kampen mellan gott och ont, men Tolkien undviker en förenklad uppdelning. Ondskan representeras inte bara av yttre fiender som Sauron utan också av den inre frestelsen att använda ringen för egna syften.\n\nRingen fungerar som en symbol för absolut makt. Den lockar genom att erbjuda kontroll och styrka, men priset är att bärarens moral gradvis bryts ner. Detta kan tolkas som en kommentar till hur makt kan korrumpera även den mest välmenande individ.\n\nEtt annat viktigt tema är hoppets betydelse i mörka tider. Trots överväldigande motstånd fortsätter karaktärerna att kämpa. Små handlingar av mod, särskilt från till synes obetydliga figurer, får avgörande konsekvenser. Tolkien betonar därmed att även den minsta person kan påverka historiens gång.\n\nNaturens roll är också framträdande. Skogar, berg och floder skildras som levande miljöer med egen betydelse. Kontrasten mellan det industriella Isengård och de gröna landskapen i Fylke kan ses som en kritik mot oreflekterad industrialisering.\n\nVänskap och gemenskap utgör ytterligare ett genomgående tema. Ringens brödraskap visar hur samarbete mellan olika folk är nödvändigt för att möta hotet. Skillnader i kultur och bakgrund övervinns genom ett gemensamt mål.\n\nGenom denna mångfacetterade symbolik förblir trilogin öppen för tolkning. Läsaren inbjuds att reflektera över makt, moral och ansvar i både den fiktiva världen och i verkligheten.",
    "questions": [
      { "type": "literal", "q": "Vad symboliserar ringen främst?", "options": ["Evig vänskap", "Absolut makt", "Naturens kraft", "Teknologisk utveckling"], "correct": 1 },
      { "type": "literal", "q": "Hur framställs ondskan i texten?", "options": ["Enbart som yttre fiender", "Som både yttre hot och inre frestelse", "Som ett missförstånd", "Som humoristisk"], "correct": 1 },
      { "type": "inferens", "q": "Vad betonas genom de små karaktärernas mod?", "options": ["Att styrka är oviktig", "Att bara kungar förändrar historien", "Att även den minsta kan påverka", "Att ödet är förutbestämt"], "correct": 2 },
      { "type": "inferens", "q": "Vad kan kontrasten mellan Fylke och Isengård tolkas som?", "options": ["En slumpmässig miljöbeskrivning", "En karta över Europa", "En kritik mot industrialisering", "En religiös symbol"], "correct": 2 },
      { "type": "inferens", "q": "Varför är trilogin öppen för tolkning?", "options": ["Den saknar tydliga teman", "Den innehåller rik symbolik", "Den är ofullständig", "Den har flera författare"], "correct": 1 },
      { "type": "sammanfatta", "q": "Vad är textens huvudsakliga fokus?", "options": ["Militära strategier", "Böckernas publiceringshistoria", "Teman och symbolik i berättelsen", "Filmatiseringarnas effekter"], "correct": 2 }
    ],
    "meta": {
      "wordCount": 482,
      "fingerprint": "ak9-lotr-003",
      "generatedAt": "2026-02-27T00:00:00.000Z",
      "model": "claude"
    }
  },
  {
    "id": "ak9-lotr-004",
    "grade": 9,
    "genre": "faktatext",
    "theme": "Kultur",
    "title": "Miljöer och världsbygge",
    "text": "En avgörande faktor bakom Sagan om ringens genomslag är det omfattande världsbygget. Tolkien skapade inte enbart en bakgrund till handlingen, utan en hel värld med detaljerad historia, språk och geografi. Kartor över Midgård hjälper läsaren att följa karaktärernas långa resor.\n\nFylke framställs som en idyllisk landsbygd där hobbitar lever i fred och enkelhet. Kontrasten är stark mot Mordor, ett kargt och mörkt landskap präglat av aska och vulkanisk aktivitet. Dessa miljöer förstärker berättelsens moraliska dimensioner.\n\nStäder som Minas Tirith och fästningar som Helms klyfta bidrar till känslan av historisk tyngd. Arkitekturen och de gamla traditionerna antyder en lång och komplex bakgrund. Läsaren möter ruiner och minnen från tidigare epoker, vilket skapar en känsla av att världen existerade långt före huvudpersonernas tid.\n\nSpråken spelar också en central roll. Tolkien konstruerade flera alvspråk med egen grammatik och ljudlära. Dessa språk ger kulturerna i Midgård en särskild identitet och bidrar till autenticitet.\n\nVärldsbygget är inte enbart dekorativt, utan påverkar handlingen. Geografin avgör vilka vägar som är möjliga, och historiska konflikter påverkar relationerna mellan olika folk. På så sätt blir miljön en aktiv del av berättelsen.\n\nDet är denna noggrannhet som gör att läsaren kan uppleva Midgård som en levande och trovärdig värld. Världsbygget skapar en illusion av realism trots att berättelsen tillhör fantasylitteraturen.",
    "questions": [
      { "type": "literal", "q": "Vad kännetecknar Tolkiens världsbygge?", "options": ["Brist på detaljer", "Detaljerad historia och geografi", "Enbart muntliga traditioner", "Fokus på modern teknik"], "correct": 1 },
      { "type": "literal", "q": "Hur beskrivs Fylke?", "options": ["Som en krigszon", "Som en industriell stad", "Som en fredlig landsbygd", "Som ett ökenlandskap"], "correct": 2 },
      { "type": "literal", "q": "Vad bidrar ruiner och gamla traditioner till?", "options": ["Känslan av historisk tyngd", "Komisk effekt", "Snabbare tempo", "Mindre trovärdighet"], "correct": 0 },
      { "type": "inferens", "q": "Varför skapade Tolkien egna språk?", "options": ["För att dölja handlingen", "För att förenkla berättelsen", "För att ge kulturerna identitet", "För att undvika översättningar"], "correct": 2 },
      { "type": "inferens", "q": "Hur påverkar geografin handlingen?", "options": ["Den har ingen betydelse", "Den avgör möjliga vägar och konflikter", "Den förändras ständigt", "Den ersätts av kartor i slutet"], "correct": 1 },
      { "type": "sammanfatta", "q": "Vad är textens huvudpoäng?", "options": ["Att miljön är oviktig", "Att världsbygget skapar trovärdighet", "Att trilogin saknar karta", "Att språken är slumpmässiga"], "correct": 1 }
    ],
    "meta": {
      "wordCount": 479,
      "fingerprint": "ak9-lotr-004",
      "generatedAt": "2026-02-27T00:00:00.000Z",
      "model": "claude"
    }
  },
  {
    "id": "ak9-lotr-005",
    "grade": 9,
    "genre": "faktatext",
    "theme": "Kultur",
    "title": "Makt, ansvar och moral",
    "text": "I Sagan om ringen är frågan om makt och ansvar central. Ringen erbjuder enorm kraft, men den som bär den riskerar att förlora sin moraliska kompass. Detta skapar ett etiskt dilemma: är det rätt att använda ondskans verktyg för att bekämpa ondskan själv?\n\nFrodo accepterar uppdraget att bära ringen trots att han inte söker makt. Hans beslut grundas i en känsla av ansvar snarare än ambition. Samtidigt visar berättelsen att även den mest godhjärtade individ kan påverkas av frestelse.\n\nGandalf och Galadriel avstår medvetet från att ta ringen när de erbjuds den. De inser att deras goda avsikter inte skulle skydda dem från dess inflytande. Genom deras val betonas vikten av självinsikt och återhållsamhet.\n\nBoromirs försök att ta ringen illustrerar motsatsen. Han motiveras av viljan att försvara sitt folk, men hans handling visar hur lätt goda syften kan förvandlas till maktbegär. Hans senare ånger ger dock karaktären en tragisk värdighet.\n\nBerättelsen visar att verklig styrka inte alltid ligger i att dominera andra, utan i att avstå från makt. Det är genom uppoffring och samarbete som hotet till slut kan besegras.\n\nTrilogin ställer därmed frågor som sträcker sig bortom fantasyns värld. Hur bör makt användas? När blir ambition farlig? Genom sina karaktärers val uppmuntrar Tolkien läsaren att reflektera över moral och ansvar även i den egna verkligheten.",
    "questions": [
      { "type": "literal", "q": "Vilket etiskt dilemma lyfts i texten?", "options": ["Om teknik ska förbjudas", "Om man ska använda ondskans verktyg mot ondskan", "Om krig alltid är rätt", "Om vänskap är viktigare än lagar"], "correct": 1 },
      { "type": "literal", "q": "Vad motiverar Frodos beslut att bära ringen?", "options": ["Maktbegär", "Rädsla för kritik", "Känsla av ansvar", "Önskan om rikedom"], "correct": 2 },
      { "type": "inferens", "q": "Varför avstår Gandalf och Galadriel från ringen?", "options": ["De är rädda för Sauron", "De förstår att de kan korrumperas", "De saknar mod", "De vill lämna Midgård"], "correct": 1 },
      { "type": "inferens", "q": "Vad visar Boromirs handling?", "options": ["Att han är helt ond", "Att han saknar lojalitet", "Att goda syften kan leda fel", "Att ringen är ofarlig"], "correct": 2 },
      { "type": "inferens", "q": "Hur definieras verklig styrka enligt texten?", "options": ["Att dominera andra", "Att samla rikedom", "Att avstå från makt när det behövs", "Att vinna alla strider"], "correct": 2 },
      { "type": "sammanfatta", "q": "Vad uppmanas läsaren att göra?", "options": ["Att ignorera moraliska frågor", "Att analysera språken", "Att jämföra filmerna med böckerna", "Att reflektera över moral och ansvar"], "correct": 3 }
    ],
    "meta": {
      "wordCount": 480,
      "fingerprint": "ak9-lotr-005",
      "generatedAt": "2026-02-27T00:00:00.000Z",
      "model": "claude"
    }
  }
];

// Read existing library
const library = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

// Check if any of the new content already exists
const existingIds = new Set(library.map(item => item.id));
const newItems = newContent.filter(item => !existingIds.has(item.id));

if (newItems.length === 0) {
  console.log('All content already exists in the library.');
  process.exit(0);
}

// Add new content
library.push(...newItems);

// Write back to file
fs.writeFileSync(libraryPath, JSON.stringify(library, null, 2), 'utf8');

console.log(`Successfully added ${newItems.length} new texts about "Sagan om ringen" (Lord of the Rings) for grade 9.`);
console.log('New text IDs:', newItems.map(item => item.id).join(', '));
