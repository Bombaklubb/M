#!/usr/bin/env node
//
// Tre åk 7-texter har frågor på åk 1-nivå.
//
// Samma mönster som hästtexterna i åk 6: texterna håller nivån, frågorna gör
// det inte. ak7-tema-024, ak7-tema-025 och ak7-tema-035 är 501–503 ord långa
// och innehåller resonemang om salivens nedbrytning av stärkelse, hjärnans
// oförmåga att lagra energi, varför majoritetsstyre inte räcker i en demokrati
// och varför damfotbollen var förbjuden. Frågorna prövar inget av det:
//
//   "Var kommer energi ifrån?"  Luft / Vatten / Mat / Sömn
//   "Vad kan mångfald leda till?"  Färre idéer / Konflikter alltid / Nya idéer
//   "Vad är målet i fotboll?"  Att springa mest / Att göra mål
//
// Svarsalternativen är i snitt 1,5–3,6 ord långa mot 7,6 för övriga åk 7-texter.
// En elev kan svara rätt på hela ak7-tema-035 utan att öppna texten.
//
// Alla arton frågorna skrivs om mot innehåll som står i texten. Rätt svar
// behåller sin plats i varje fråga, så svarsfördelningen i biblioteket är
// oförändrad, och varje fråga har en kontrollsträng som måste finnas i texten.
//
// Kör med --dry för att se ändringarna utan att skriva.

const fs = require('fs');
const path = require('path');

// id -> lista med sex frågor. kontroll = sträng som måste finnas i texten.
const NYA = {
  'ak7-tema-024': [
    { type: 'inferens', kontroll: 'börjar bryta ner stärkelse',
      q: 'Varför kan en bit bröd smaka sött om man tuggar länge?',
      options: [
        'För att tuggandet värmer upp brödet i munnen',
        'För att magsyran hinner tränga upp i munhålan',
        'För att saliven börjar bryta ner stärkelsen redan där',
        'För att smaklökarna blir känsligare med tiden'],
      correct: 2 },
    { type: 'ord', kontroll: 'De ger ingen energi i sig',
      q: 'Vilken roll har vitaminer och mineraler enligt texten?',
      options: [
        'De är kroppens främsta källa till snabb energi',
        'De ersätter behovet av proteiner i kosten',
        'De ger ingen energi själva men behövs för att frigöra den ur maten',
        'De lagras i levern och används först efter ett dygn'],
      correct: 2 },
    { type: 'literal', kontroll: 'binder syret i lungorna',
      q: 'Vad gör de röda blodkropparna enligt texten?',
      options: [
        'De bryter ner stärkelse på väg genom tunntarmen',
        'De lagrar överskott av kolhydrater i musklerna',
        'De producerar den energi som cellerna behöver',
        'De binder syre i lungorna och tar med koldioxid tillbaka'],
      correct: 3 },
    { type: 'inferens', kontroll: 'knappt lagra något',
      q: 'Varför blir det svårare att koncentrera sig när man är hungrig?',
      options: [
        'För att hjärnan knappt kan lagra energi och behöver jämn tillförsel',
        'För att magsyran stör signalerna mellan cellerna i kroppen',
        'För att kroppen då prioriterar musklerna framför hjärnan',
        'För att syreupptaget minskar när magsäcken är tom'],
      correct: 0 },
    { type: 'inferens', kontroll: 'gröt håller längre',
      q: 'Varför håller en frukost med gröt längre än en med söta flingor?',
      options: [
        'För att grova livsmedel bryts ner långsammare och ger jämnare tillförsel',
        'För att gröt innehåller betydligt fler vitaminer och mineraler',
        'För att socker inte alls kan användas som energi av kroppen',
        'För att gröt fyller magsäcken under en längre tid av dagen'],
      correct: 0 },
    { type: 'sammanfatta', kontroll: 'helheten över tid',
      q: 'Vad menar texten med att kosten ska vara balanserad?',
      options: [
        'Att varje enskild måltid behöver innehålla allt kroppen behöver',
        'Att man bör äta exakt lika mycket vid varje måltid under dagen',
        'Att energin helst ska komma från kolhydrater snarare än fett',
        'Att helheten över tid ska innehålla det kroppen behöver'],
      correct: 3 },
  ],

  'ak7-tema-025': [
    { type: 'inferens', kontroll: 'den mest högljudda',
      q: 'Varför skyddar gemensamma regler den som är i underläge?',
      options: [
        'För att annars skulle den starkaste eller mest högljudda få bestämma',
        'För att reglerna alltid skrivs av dem som har minst makt',
        'För att den som är i underläge slipper följa lika många regler',
        'För att regler gör att alla grupper blir precis lika stora'],
      correct: 0 },
    { type: 'inferens', kontroll: 'aldrig få igenom något',
      q: 'Varför räcker det inte att räkna röster i en demokrati?',
      options: [
        'För att det tar för lång tid att räkna alla röster noggrant',
        'För att röster från olika delar av landet väger olika tungt',
        'För att mindre grupper annars aldrig skulle få igenom något',
        'För att valresultatet ändå måste godkännas av en domstol'],
      correct: 2 },
    { type: 'inferens', kontroll: 'missa problem som ingen råkat stöta på',
      q: 'Varför upptäcker en grupp med skilda erfarenheter fler problem?',
      options: [
        'För att den nästan alltid är större än en mer enhetlig grupp',
        'För att medlemmarna oftare är oense och därför granskar mer',
        'För att en grupp med samma bakgrund lätt missar det ingen själv råkat ut för',
        'För att gruppen då har tillgång till fler språk och referenser'],
      correct: 2 },
    { type: 'inferens', kontroll: 'hur de hanterar det som skiljer',
      q: 'Vad avgör enligt texten om en grupp fungerar eller fastnar?',
      options: [
        'Hur många medlemmar gruppen består av från början',
        'Hur lika medlemmarna är varandra i bakgrund och åsikt',
        'Hur tydligt gruppens regler har skrivits ner i förväg',
        'Hur gruppen hanterar det som skiljer medlemmarna åt'],
      correct: 3 },
    { type: 'ord', kontroll: 'perspektiv faktiskt räknas',
      q: 'Vad betyder inkludering enligt texten?',
      options: [
        'Att alla i en grupp behandlas på exakt samma sätt',
        'Att så många som möjligt får plats i varje grupp',
        'Att den som vill vara med aldrig behöver nekas',
        'Att ens perspektiv faktiskt räknas när något ska bestämmas'],
      correct: 3 },
    { type: 'sammanfatta', kontroll: 'blir aldrig helt färdigt',
      q: 'Vilken slutsats drar texten om arbetet med att leva tillsammans?',
      options: [
        'Att det aldrig blir färdigt och kräver förmåga att ompröva',
        'Att det är avslutat när reglerna väl har blivit tydliga',
        'Att det främst är politikernas ansvar att hålla igång',
        'Att det blir enklare ju mer lika invånarna blir varandra'],
      correct: 0 },
  ],

  'ak7-tema-035': [
    { type: 'inferens', kontroll: 'bara en boll och en yta',
      q: 'Varför har fotboll kunnat spridas till nästan alla länder?',
      options: [
        'För att reglerna är fler och tydligare än i andra sporter',
        'För att det i praktiken bara krävs en boll och en yta att spela på',
        'För att sporten kräver mindre uthållighet än många andra',
        'För att matcherna alltid är exakt nittio minuter långa'],
      correct: 1 },
    { type: 'literal', kontroll: 'ställa sig och vänta framför motståndarens mål',
      q: 'Vad hindrar offsideregeln enligt texten?',
      options: [
        'Att målvakten lämnar sitt eget straffområde under spel',
        'Att spelarna använder händerna när de tar emot bollen',
        'Att en match avgörs innan de nittio minuterna har gått',
        'Att anfallare ställer sig och väntar framför motståndarens mål'],
      correct: 3 },
    { type: 'inferens', kontroll: 'personer man inte själv har valt',
      q: 'Varför beskrivs lagsport som en övning få andra sammanhang ger?',
      options: [
        'För att man måste samarbeta med personer man inte själv valt',
        'För att man tränar tillsammans flera gånger varje vecka',
        'För att alla i laget måste behärska exakt samma färdigheter',
        'För att man lär sig att vinna och förlora inför en publik'],
      correct: 0 },
    { type: 'literal', kontroll: 'förbjuden i flera länder',
      q: 'Vad hände med damfotbollen enligt texten?',
      options: [
        'Den har alltid haft samma förutsättningar som herrfotbollen',
        'Den växte först när tv-avtalen började omfatta även den',
        'Den var förbjuden i flera länder och tog fart när förbuden hävdes',
        'Den spelas fortfarande med andra regler än herrfotbollen'],
      correct: 2 },
    { type: 'literal', kontroll: 'specialisera sig för tidigt',
      q: 'Vilken risk med tidig specialisering nämner texten?',
      options: [
        'Att skaderisken ökar och att många slutar innan de blir vuxna',
        'Att spelarna får svårare att lära sig reglerna ordentligt',
        'Att föreningarna tappar kontakten med skolorna i området',
        'Att laget blir beroende av ett fåtal enskilda spelare'],
      correct: 0 },
    { type: 'sammanfatta', kontroll: 'speglar samtidigt de problem',
      q: 'Vilken helhetsbild av fotbollen ger texten?',
      options: [
        'Att sporten främst bör ses som underhållning och inget mer',
        'Att den skapar gemenskap men också speglar samhällets problem',
        'Att de ekonomiska frågorna har gjort sporten mindre viktig',
        'Att sportens värde ligger i att den är enkel att lära sig'],
      correct: 1 },
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
