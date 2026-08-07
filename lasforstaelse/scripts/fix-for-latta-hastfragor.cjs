#!/usr/bin/env node
//
// De fem hästtexterna i åk 6 har frågor på åk 1-nivå.
//
// Texterna själva håller rätt nivå: 402–409 ord, mitt i åk 6-intervallet, med
// innehåll om magsäckens storlek, kolik, blinda punkter, avelskritik och
// domesticering. Men frågorna prövar inget av det. Svarsalternativen är i snitt
// 2,5–3,3 ord långa ("Hö", "Brun", "I flock", "Galopp") mot 7,6 ord för övriga
// åk 6-texter. En elev kan svara rätt på hela ak6-tema-028 utan att läsa mer än
// rubrikerna.
//
// Alla trettio frågorna skrivs om mot innehåll som faktiskt står i texten.
// Rätt svar behåller sin plats i varje fråga, så svarsfördelningen i biblioteket
// är oförändrad. Typmixen kompletteras med ord- och sammanfatta-frågor, som
// saknades helt i de fem texterna.
//
// Varje fråga har en kontrollsträng som måste finnas i texten. Skriptet skriver
// ingenting om någon av dem saknas.
//
// Kör med --dry för att se ändringarna utan att skriva.

const fs = require('fs');
const path = require('path');

// id -> lista med sex frågor. kontroll = sträng som måste finnas i texten.
const NYA = {
  'ak6-tema-026': [
    { type: 'ord', kontroll: 'Hö är torkat gräs',
      q: 'Vad är hö enligt texten?',
      options: [
        'Ströet som läggs på golvet i boxen',
        'En blandning av spannmål och mineraler',
        'Färskt gräs som klipps varje morgon',
        'Torkat gräs som innehåller viktiga näringsämnen'],
      correct: 3 },
    { type: 'inferens', kontroll: 'fördelas fodret på flera tillfällen',
      q: 'Varför delas hästens foder upp på flera tillfällen per dag?',
      options: [
        'För att stallpersonalen ska hinna mocka mellan gångerna',
        'För att fodret annars blir dåligt i värmen',
        'För att magsäcken är liten och hästen är byggd för att äta lite hela tiden',
        'För att hästen ska hinna vila ordentligt mellan måltiderna'],
      correct: 2 },
    { type: 'literal', kontroll: 'ta bort spillning och blöt strö',
      q: 'Vad innebär det att mocka boxen?',
      options: [
        'Att byta ut hela golvet i boxen mot nytt material',
        'Att borsta hästen innan den släpps ut i hagen',
        'Att ta bort spillning och blöt strö ur boxen',
        'Att fylla på med hö och friskt vatten till hästen'],
      correct: 2 },
    { type: 'inferens', kontroll: 'sparka om de känner sig hotade',
      q: 'Varför varnar texten för att gå bakom en häst utan att den vet om det?',
      options: [
        'För att hästen då kan sluta äta resten av dagen',
        'För att man lätt trampar på hästens svans i mörkret',
        'För att hästen inte kan vända sig om inne i boxen',
        'För att en häst som känner sig hotad kan bli rädd och sparka'],
      correct: 3 },
    { type: 'inferens', kontroll: 'lösdrift går hästarna ute',
      q: 'Vilken fördel med lösdrift lyfter texten fram?',
      options: [
        'Att hästarna är ute större delen av dygnet, nära sitt naturliga liv',
        'Att varje enskild häst blir lättare att hålla noggrann koll på',
        'Att hästarna behöver betydligt mindre foder under vintern',
        'Att stallet slipper ha regler om säkerhet och skötsel'],
      correct: 0 },
    { type: 'sammanfatta', kontroll: 'kräver ansvar och kunskap',
      q: 'Vad är textens huvudbudskap om att sköta en häst?',
      options: [
        'Att det kräver kunskap, dagligt arbete och förståelse för hästens behov',
        'Att det främst handlar om att lära sig rida tillräckligt bra',
        'Att det är enkelt så länge hästen får mat och vatten varje dag',
        'Att det bara passar den som äger en egen gård på landet'],
      correct: 0 },
  ],

  'ak6-tema-027': [
    { type: 'inferens', kontroll: 'En häst kan inte kräkas',
      q: 'Varför hanteras hästens foder så noggrant enligt texten?',
      options: [
        'För att hästen tuggar långsamt och behöver äta i lugn och ro',
        'För att hästen inte kan kräkas upp något olämpligt den råkat äta',
        'För att foder annars kan fastna i hovarna och börja skava',
        'För att hästen bara kan äta medan den står stilla i boxen'],
      correct: 1 },
    { type: 'ord', kontroll: 'kolik, alltså ont i magen',
      q: 'Vad betyder kolik i texten?',
      options: [
        'En sorts sko som hovslagaren sätter på hoven',
        'En gångart som bara islandshästar behärskar',
        'Ont i magen, en av de vanligaste allvarliga åkommorna',
        'En muskel i hästens bakben som lätt blir stel'],
      correct: 2 },
    { type: 'inferens', kontroll: 'låsa lederna i benen och sova stående',
      q: 'Varför kan en häst sova stående?',
      options: [
        'För att den saknar plats att lägga sig ner i boxen',
        'För att den kan låsa lederna i benen och snabbt fly om något händer',
        'För att den bara sover några minuter åt gången varje natt',
        'För att ryggen tar skada om den ligger ner för länge'],
      correct: 1 },
    { type: 'inferens', kontroll: 'rakt bakom sig',
      q: 'Varför bör man säga till innan man närmar sig en häst bakifrån?',
      options: [
        'För att hästen annars hinner gå iväg mot hagen på egen hand',
        'För att ljudet av steg får hästen att sluta äta sitt foder',
        'För att hästens hörsel är betydligt sämre än dess syn',
        'För att hästen inte ser något alls rakt bakom sig och kan bli skrämd'],
      correct: 3 },
    { type: 'literal', kontroll: 'tölta',
      q: 'Vilken gångart beskrivs som ovanligt mjuk att rida?',
      options: [
        'Skritt, eftersom hästen går långsamt och lugnt',
        'Galopp, eftersom hästen då rör sig som snabbast',
        'Tölt, där hästen alltid har minst en fot i marken',
        'Trav, eftersom benen rör sig parvis i takt'],
      correct: 2 },
    { type: 'literal', kontroll: 'bakåtriktade öron',
      q: 'Vad kan hästen visa med bakåtriktade öron enligt texten?',
      options: [
        'Att den är hungrig och vill ha mer hö',
        'Att den håller på att somna stående',
        'Att den är irriterad eller rädd',
        'Att den vill byta till en snabbare gångart'],
      correct: 2 },
  ],

  'ak6-tema-028': [
    { type: 'ord', kontroll: 'genom att människor valt vilka hästar som ska få föl',
      q: 'Vad betyder avel enligt texten?',
      options: [
        'Att hästar tränas inför en tävling i hoppning',
        'Att människor väljer vilka hästar som ska få föl',
        'Att en häst byter päls när årstiden ändras',
        'Att flera raser blandas ihop i samma hage'],
      correct: 1 },
    { type: 'literal', kontroll: 'gammalt uttryck för temperament',
      q: 'Vad skiljer kallblod från varmblod enligt texten?',
      options: [
        'Kallblod har lägre kroppstemperatur än varmblod',
        'Kallblod finns bara i Sverige, varmblod i övriga Europa',
        'Kallblod är tyngre och lugnare, varmblod lättare och snabbare',
        'Kallblod kan bara ridas på vintern, varmblod på sommaren'],
      correct: 2 },
    { type: 'inferens', kontroll: 'började man i stället avla för sport och fritid',
      q: 'Varför ändrades aveln när maskinerna tog över arbetet?',
      options: [
        'För att hästar då behövdes för sport och fritid i stället för arbete',
        'För att alla gamla raser försvann helt under samma period',
        'För att hästar slutade kunna dra plogar och tunga vagnar',
        'För att maskiner krävde att hästarna blev betydligt större'],
      correct: 0 },
    { type: 'literal', kontroll: 'gotlandsrusset är en liten, härdig ponny',
      q: 'Vilken svensk ras beskrivs som en liten och härdig ponny?',
      options: [
        'Nordsvensk brukshäst, som används i skogen',
        'Ardenner, som också räknas som ett kallblod',
        'Varmblod, som mest används inom ridsport',
        'Gotlandsruss, som funnits på Gotland i århundraden'],
      correct: 3 },
    { type: 'literal', kontroll: 'problem med leder, andning eller fruktsamhet',
      q: 'Vilken kritik mot avel tar texten upp?',
      options: [
        'Att avel gör att alla hästar blir exakt likadana',
        'Att avel kräver att hästarna hålls inomhus året om',
        'Att avel gör hästar dyrare än de flesta andra husdjur',
        'Att utseende kan gå före hälsa och ge problem med leder och andning'],
      correct: 3 },
    { type: 'sammanfatta', kontroll: 'behöver alla hästar omsorg, mat och motion',
      q: 'Vad är textens huvudbudskap om olika hästtyper?',
      options: [
        'Att raserna skiljer sig åt, men att alla hästar behöver omsorg och respekt',
        'Att bara de största raserna klarar av att arbeta på en gård',
        'Att färgen på hästen avgör vad den kan användas till',
        'Att svenska raser alltid är bättre lämpade än utländska'],
      correct: 0 },
  ],

  'ak6-tema-029': [
    { type: 'inferens', kontroll: 'Timing är därför viktigare än styrka',
      q: 'Varför säger texten att timing är viktigare än styrka i ridning?',
      options: [
        'För att en stark ryttare gör hästen rädd på lång sikt',
        'För att en signal som ges för sent inte säger hästen någonting',
        'För att hästen bara reagerar på ljud, aldrig på händer och ben',
        'För att ryttaren måste hinna byta gångart innan hindret kommer'],
      correct: 1 },
    { type: 'inferens', kontroll: 'kopplar sällan ihop en tillsägelse',
      q: 'Varför fungerar straff dåligt när man tränar en häst?',
      options: [
        'För att hästen då börjar lyda alla ryttare utan skillnad',
        'För att hästen sällan kopplar tillsägelsen till det som hände tidigare',
        'För att straff är förbjudet enligt reglerna i alla stall',
        'För att hästen glömmer bort hela träningspasset efteråt'],
      correct: 1 },
    { type: 'literal', kontroll: 'utföra rörelser med precision',
      q: 'Vad är skillnaden mellan hoppning och dressyr enligt texten?',
      options: [
        'I hoppning rider man ensam, medan man i dressyr alltid rider i par',
        'I hoppning används träns, medan man i dressyr bara använder sadel',
        'I hoppning tar sig hästen över hinder, i dressyr utförs rörelser med precision',
        'I hoppning tävlar bara vuxna, medan dressyr är till för ungdomar'],
      correct: 2 },
    { type: 'inferens', kontroll: 'beror på hästens byggnad och kondition',
      q: 'Varför nämner texten en tumregel om ryttarens vikt?',
      options: [
        'För att lätta ryttare alltid vinner fler tävlingar',
        'För att vikten avgör vilken hjälm man måste välja',
        'För att hästens förmåga att bära beror på dess byggnad och kondition',
        'För att tunga ryttare måste byta till en annan gångart'],
      correct: 2 },
    { type: 'literal', kontroll: 'kvinnor och män tävlar mot varandra på samma villkor',
      q: 'Vad säger texten om ridning som tävlingssport?',
      options: [
        'Att bara de högsta nivåerna räknas som riktig tävling',
        'Att kvinnor och män tävlar mot varandra på samma villkor',
        'Att lokala klubbtävlingar kräver flera års förberedelse',
        'Att alla tävlingar använder hinder av samma höjd'],
      correct: 1 },
    { type: 'sammanfatta', kontroll: 'samarbete, tålamod och respekt för hästen',
      q: 'Vad är textens huvudbudskap om att träna en häst?',
      options: [
        'Att styrka och beslutsamhet är det som avgör resultatet',
        'Att den som rider mest också blir bäst automatiskt',
        'Att hästen lär sig snabbast när ryttaren höjer rösten',
        'Att träning bygger på timing, belöning, tålamod och respekt för hästen'],
      correct: 3 },
  ],

  'ak6-tema-030': [
    { type: 'literal', kontroll: 'stäpperna i nuvarande Ukraina och Kazakstan',
      q: 'Var och när skedde domesticeringen av hästen enligt texten?',
      options: [
        'På stäpperna i nuvarande Ukraina och Kazakstan för femtusen år sedan',
        'I norra Europa strax innan järnvägen byggdes ut på 1800-talet',
        'På Gotland under samma tid som de första städerna växte fram',
        'I Mellanöstern ungefär samtidigt som de första vagnarna byggdes'],
      correct: 0 },
    { type: 'inferens', kontroll: 'förändrade nästan allt',
      q: 'Varför säger texten att hästen förändrade nästan allt?',
      options: [
        'För att hästen gav både kött och mjölk till många familjer',
        'För att människor kunde färdas snabbare, vilket påverkade handel och krig',
        'För att hästen kunde bära tyngre laster än någon vagn',
        'För att hästen gjorde att människor kunde sluta att gå helt'],
      correct: 1 },
    { type: 'ord', kontroll: 'avstånd mättes i dagsritter',
      q: 'Vad betyder det att avstånd mättes i dagsritter?',
      options: [
        'Att man räknade hur många hästar en resa krävde',
        'Att man bara fick rida under dagtid, aldrig på natten',
        'Att en sträcka beskrevs utifrån hur många dagar den tog till häst',
        'Att alla vägar delades upp i lika långa etapper'],
      correct: 2 },
    { type: 'literal', kontroll: 'med järnvägen, och sedan med bilen',
      q: 'Varför minskade antalet hästar i Sverige under 1900-talets mitt?',
      options: [
        'För att nya lagar om djurskydd gjorde det svårare att hålla häst',
        'För att sjukdomar spred sig snabbt bland hästarna i landet',
        'För att betesmarkerna planterades igen med skog i hela landet',
        'För att järnvägen och senare bilen tog över hästens roll som transport'],
      correct: 3 },
    { type: 'inferens', kontroll: 'utan att se eller höra andra hästar blir stressad',
      q: 'Varför kan en häst som står ensam bli stressad enligt texten?',
      options: [
        'För att den då får för lite motion under dagen',
        'För att hästar lever i flock och behöver se och höra andra hästar',
        'För att den inte kan låsa lederna och sova stående',
        'För att den behöver en människa i närheten hela tiden'],
      correct: 1 },
    { type: 'sammanfatta', kontroll: 'är en ganska ny sak',
      q: 'Vilken helhetsbild ger texten av relationen mellan häst och människa?',
      options: [
        'Att den alltid har byggt på ömsesidig omtanke och respekt',
        'Att den saknar betydelse sedan bilen tog över transporterna',
        'Att den handlar om sport och inget annat i dagens Sverige',
        'Att den är mycket gammal och nyttig, men att omsorgen om djuren är ny'],
      correct: 3 },
  ],
};

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;

Object.entries(NYA).forEach(([id, fragor]) => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error(`Hittar inte ${id}`); ok = false; return; }
  if (fragor.length !== 6) { console.error(`${id}: ${fragor.length} frågor, förväntade 6`); ok = false; return; }

  const gammalFordelning = t.questions.map(q => q.correct).join(',');
  const nyFordelning = fragor.map(q => q.correct).join(',');
  if (gammalFordelning !== nyFordelning) {
    console.error(`${id}: svarsfördelningen ändras ${gammalFordelning} → ${nyFordelning}`);
    ok = false; return;
  }

  const foreSnitt = t.questions.flatMap(q => q.options).reduce((s, o) => s + o.split(/\s+/).length, 0) / 24;

  // Varje rätt svar måste ha belägg i texten.
  const utanBelagg = fragor.filter(f => !t.text.includes(f.kontroll));
  if (utanBelagg.length) {
    utanBelagg.forEach(f => console.error(`${id}: texten saknar belägget "${f.kontroll}"`));
    ok = false; return;
  }

  // Inget rätt svar får gå att peka ut på längden.
  fragor.forEach((f, i) => {
    const l = f.options.map(o => o.length);
    const ratt = l[f.correct];
    const ovriga = l.filter((_, j) => j !== f.correct);
    const motLangsta = ratt / Math.max(...ovriga);
    const motKortaste = Math.min(...ovriga) / ratt;
    if (motLangsta >= 1.6 || motKortaste >= 1.6) {
      console.error(`${id} f${i + 1}: längdkvot ${motLangsta.toFixed(2)}× / ${motKortaste.toFixed(2)}×`);
      ok = false;
    }
    if (new Set(f.options).size !== 4) { console.error(`${id} f${i + 1}: dubblerade alternativ`); ok = false; }
  });

  t.questions = fragor.map(({ type, q, options, correct }) => ({ type, q, options, correct }));

  const efterSnitt = fragor.flatMap(f => f.options).reduce((s, o) => s + o.split(/\s+/).length, 0) / 24;
  const typer = [...new Set(fragor.map(f => f.type))].join(', ');
  console.log(`${id}  alternativlängd ${foreSnitt.toFixed(1)} → ${efterSnitt.toFixed(1)} ord   typer: ${typer}`);
});

if (!dry) fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
else console.log('\n(dry run – inget skrivet)');
if (!ok) process.exit(1);
