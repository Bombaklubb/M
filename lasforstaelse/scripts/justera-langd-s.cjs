#!/usr/bin/env node
//
// Nio texter i åk 6 och åk 9 som låg 30–51 ord under sitt intervall.
// Intervallet slås upp per årskurs, så en sats kan blanda årskurser.
// Kör med --dry för att bara se ordräkningen utan att skriva.

const fs = require('fs');
const path = require('path');

const BAND = { 1:[40,60], 2:[65,90], 3:[150,165], 4:[200,220], 5:[300,320],
               6:[400,415], 7:[500,530], 8:[530,570], 9:[570,590], 10:[590,625] };

const TILLAGG = {
  'ak7-tema-013': [{ fore: 'Det var inte det mest dramatiska valet', text:
`På vägen till biblioteket sa eleven sitt namn: Idris. Samir insåg att hen hade sett Idris i matsalen i flera år utan att veta vad hen hette. Det var lättare att misstänka någon som var namnlös. Alva hade sagt något liknande vid middagen, men det hade inte fastnat förrän nu.` }],

  'ak9-tema-014': [{ fore: 'Övningen får flera att inse', text:
`En elev frågade vem som bestämmer vilken tolkning som räknas i dag. Anders svarade att frågan aldrig försvinner, den byter bara adress: förr låg tolkningsrätten hos präster och siare, i dag hos forskare, terapeuter och appar som lovar att analysera din sömn.` }],

  'ak4-vetenskap-03': [{ fore: 'Att förstå flyta och sjunka', text:
`Salt vatten är ett specialfall. När salt löses i vatten blir vattnet tyngre för sin volym, alltså tätare. Därför flyter du lättare i havet än i en insjö, och i mycket salta sjöar kan man nästan ligga på ytan utan att simma.` }],

  'ak5-natur-02': [{ fore: 'Att löv byter färg är alltså', text:
`Alla träd gör inte likadant. Granar och tallar behåller sina barr över vintern. Barren är smala och täckta av ett vaxlager som gör att de förlorar mindre vatten, vilket är viktigt när marken är frusen och trädet inte kan dricka.` }],

  'ak7-etik-04': [{ fore: 'Det betyder inte att etik alltid är svårt', text:
`Ett vanligt hinder är att ansvaret sprids ut. Om tjugo personer ser något orättvist ske kan var och en tänka att någon annan borde säga ifrån. Ju fler som är närvarande, desto lättare är det att låta bli.` }],

  'ak6-samhalle-14': [{ fore: 'När mötet var slut var inget magiskt löst.', text:
`Helena sa också att allt inte gick att lova. Skolans matbudget var bestämd för hela året, och en extra serveringsstation kostade pengar. "Jag kan lova att vi testar det som inte kostar något extra i höst," sa hon. "Resten får jag ta med till förvaltningen, och då kan det dröja."

Reza antecknade även det. Ett "kanske" som stod på papper var svårare att glömma bort.` }],

  'gym-stress-studievanor-005': [{ fore: 'Sammanfattningsvis är studievanor', text:
`Ett vanligt missförstånd är att allt ska pluggas i ett svep. Att sprida ut samma material över flera dagar ger oftast bättre resultat än att lägga lika lång tid i följd, eftersom varje ny gång innebär att man måste hämta upp kunskapen på nytt.` }],

  'ak5-vanskap-01': [{ fore: 'Efteråt sa läraren', text:
`Det var ändå Samira som lade märke till det viktigaste. "Du har inte sagt 'jag vet inte' en enda gång i dag", sa hon till Emil när de plockade ihop sina saker. Emil skrattade till, som om han själv inte hade märkt det.` }],

  'gy-vetenskap-01': [{ fore: 'Det betyder inte att data är värdelöst.', text:
`En besläktad fälla är att bara de studier som visar ett tydligt resultat blir publicerade. De försök som inte gav något syns aldrig, och den samlade bilden blir därför skevare än verkligheten. Fenomenet brukar kallas publiceringsbias.` }],
};

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;
Object.entries(TILLAGG).forEach(([id, delar]) => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error('Hittar inte ' + id); ok = false; return; }
  const fore = t.text.trim().split(/\s+/).length;

  delar.forEach(d => {
    if (!t.text.includes(d.fore)) {
      console.error(`${id}: hittar inte ankaret "${d.fore.slice(0, 40)}…"`); ok = false; return;
    }
    t.text = t.text.replace(d.fore, d.text + '\n\n' + d.fore);
  });

  const [min, max] = BAND[t.grade];
  const n = t.text.trim().split(/\s+/).length;
  t.meta = { ...(t.meta || {}), wordCount: n };
  const inom = n >= min && n <= max;
  if (!inom) ok = false;
  console.log(`${id.padEnd(26)} åk${String(t.grade).padStart(2)}  ${String(fore).padStart(3)} → ${String(n).padStart(3)} ord ${inom ? '✅' : `❌ krav ${min}–${max}`}`);
});

if (!dry) fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
else console.log('\n(dry run – inget skrivet)');
if (!ok) process.exit(1);
