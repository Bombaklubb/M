#!/usr/bin/env node
//
// Två åk 8-texter har frågor på åk 1-nivå.
//
// Samma mönster som hästtexterna i åk 6 och de tre åk 7-texterna.
// ak8-tema-029 och ak8-tema-030 är 531–536 ord och innehåller resonemang om
// varför ångmaskinen frigjorde fabriken från vattendragen, hur järnvägen
// tvingade fram gemensam tidsräkning, varför laktat inte orsakar träningsvärk
// och varför förbättringen sker under återhämtningen. Frågorna prövar inget
// av det:
//
//   "Varifrån får kroppen energi?"  Sömn / Mat / Vatten / Luft
//   "Vad hände med städerna?"  De minskade / De blev tomma / De växte
//
// Svarsalternativen är i snitt 2,0 och 2,4 ord långa mot 7,6 för övriga
// åk 8-texter. Båda texterna har dessutom bara literal-frågor så när som på
// en, alltså ingen variation i lässtrategi alls.
//
// Alla tolv frågorna skrivs om mot innehåll som står i texten. Rätt svar
// behåller sin plats i varje fråga, så svarsfördelningen i biblioteket är
// oförändrad, och varje fråga har en kontrollsträng som måste finnas i texten.
//
// Kör med --dry för att se ändringarna utan att skriva.

const fs = require('fs');
const path = require('path');

// id -> lista med sex frågor. kontroll = sträng som måste finnas i texten.
const NYA = {
  'ak8-tema-029': [
    { type: 'inferens', kontroll: 'bankväsen som kunde låna ut pengar',
      q: 'Varför blev just Storbritannien först med industrialiseringen?',
      options: [
        'Landet hade stenkol, ett bankväsen och kolonier som gav råvaror och köpte varor',
        'Landet hade som enda land i Europa tillgång till rinnande vatten',
        'Landet hade förbjudit allt hantverksarbete i sina större städer',
        'Landet hade en betydligt större befolkning än sina grannländer'],
      correct: 0 },
    { type: 'inferens', kontroll: 'inte var beroende av rinnande vatten',
      q: 'Varför var ångmaskinen så avgörande enligt texten?',
      options: [
        'Den gjorde att fabrikerna kunde drivas helt utan arbetare',
        'Den frigjorde fabriken från att behöva ligga vid ett vattendrag',
        'Den minskade antalet olyckor vid maskinerna i fabrikerna',
        'Den gjorde det möjligt att bygga järnvägar genom hela landet'],
      correct: 1 },
    { type: 'literal', kontroll: 'små nog att krypa in under maskinerna',
      q: 'Varför anställdes barn i fabrikerna enligt texten?',
      options: [
        'De var de enda som kunde sköta de nya vävmaskinerna',
        'De hade rätt att arbeta färre timmar än de vuxna hade',
        'De var billiga och små nog att krypa in under maskinerna',
        'De behövde inte gå i skolan förrän efter tolv års ålder'],
      correct: 2 },
    { type: 'inferens', kontroll: 'när tåg skulle mötas på samma spår',
      q: 'Varför förändrade järnvägen tidsuppfattningen?',
      options: [
        'För att resorna blev så mycket kortare än de varit förut',
        'För att stationerna behövde öppettider som passade alla',
        'För att arbetarna nu kunde pendla betydligt längre sträckor',
        'För att tåg som möts på samma spår kräver samma tid i hela landet'],
      correct: 3 },
    { type: 'literal', kontroll: 'skogen och järnmalmen',
      q: 'Vad byggde den svenska industrialiseringen på till en början?',
      options: [
        'Textilier, precis som i Storbritannien några decennier tidigare',
        'Skogen och järnmalmen, med sågverk längs kusten och gruvor i Bergslagen',
        'Kolgruvor i södra Sverige och import av råvaror från kolonier',
        'Verkstadsindustri och tillverkning av färdiga maskiner för export'],
      correct: 1 },
    { type: 'sammanfatta', kontroll: 'både framsteg och problem',
      q: 'Vilken slutsats om historisk utveckling drar texten i slutet?',
      options: [
        'Att framstegen med tiden alltid väger tyngre än problemen',
        'Att samma utveckling kan innebära både framsteg och problem',
        'Att industrialiseringens följder är helt avslutade i dag',
        'Att klimatfrågan saknar koppling till 1700-talets fabriker'],
      correct: 1 },
  ],

  'ak8-tema-030': [
    { type: 'ord', kontroll: 'kroppens gemensamma valuta',
      q: 'Vad menas med att ATP är kroppens gemensamma valuta?',
      options: [
        'Att ATP kan lagras i mycket stora mängder i musklerna',
        'Att all energi måste växlas till ATP innan en muskel kan använda den',
        'Att ATP bara bildas när kroppen får tillräckligt med syre',
        'Att ATP finns i maten och tas upp direkt genom tarmen'],
      correct: 1 },
    { type: 'inferens', kontroll: 'inte tre separata motorer',
      q: 'Varför beskrivs energisystemen inte som tre separata motorer?',
      options: [
        'För att bara ett av dem används av en otränad person',
        'För att de byts ut mot varandra efter exakt tio sekunder',
        'För att de arbetar samtidigt men i olika proportioner',
        'För att kroppen själv kan välja vilket den vill använda'],
      correct: 2 },
    { type: 'literal', kontroll: 'inom en timme efter träningen',
      q: 'Vad säger texten om laktat och träningsvärk?',
      options: [
        'Laktat försvinner inom en timme medan värken kommer ett dygn senare',
        'Laktat bildas först när träningsvärken redan har uppstått',
        'Laktat är den enda kända orsaken till träningsvärk i dag',
        'Laktat och träningsvärk uppstår samtidigt under hårt arbete'],
      correct: 0 },
    { type: 'inferens', kontroll: 'räcker ungefär en till två timmars hårt arbete',
      q: 'Varför äter uthållighetsidrottare under själva tävlingen?',
      options: [
        'För att vätskan är viktigare än energin under långa lopp',
        'För att magen fungerar sämre om den är alldeles tom',
        'För att fettlagren tar slut snabbare än kolhydratlagren',
        'För att kolhydratlagret bara räcker ett par timmars hårt arbete'],
      correct: 3 },
    { type: 'inferens', kontroll: 'pumpar ut mer blod per slag',
      q: 'Varför har en vältränad person ofta lägre vilopuls?',
      options: [
        'För att musklerna kräver mindre syre än hos otränade',
        'För att blodet innehåller fler röda blodkroppar än vanligt',
        'För att hjärtat blivit starkare och pumpar mer blod per slag',
        'För att kroppen har lärt sig att spara på sina fettlager'],
      correct: 2 },
    { type: 'inferens', kontroll: 'sker inte under passet',
      q: 'Varför kan den som tränar hårt varje dag bli sämre i stället för bättre?',
      options: [
        'För att musklerna vänjer sig vid samma sorts belastning',
        'För att förbättringen sker under återhämtningen, inte under passet',
        'För att kroppen då börjar använda fett i stället för kolhydrater',
        'För att vätskeförlusten hinner byggas upp från dag till dag'],
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
  const foreTyper = [...new Set(t.questions.map(q => q.type))].length;

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
  const typer = [...new Set(fragor.map(f => f.type))];
  console.log(`${id}  alternativlängd ${foreSnitt.toFixed(1)} → ${efterSnitt.toFixed(1)} ord   typer ${foreTyper} → ${typer.length} (${typer.join(', ')})`);
});

if (!dry) fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
else console.log('\n(dry run – inget skrivet)');
if (!ok) process.exit(1);
