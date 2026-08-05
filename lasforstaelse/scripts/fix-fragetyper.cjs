#!/usr/bin/env node
//
// Rättar frågetypen på femtio frågor som var felklassade.
//
// Typen styr vad profilen visar: eleven ser sin träffsäkerhet per lässtrategi
// för att veta vad som behöver övas. "Vad betyder skolplikt?" räknades som
// "På raderna" i stället för "Ord & begrepp", vilket ger fel vägledning.
//
// Gränsdragningen som använts:
//   ord        frågan gäller ett ord eller en fast term  ("Vad betyder densitet?")
//   inferens   frågan gäller innebörden i ett påstående  ("Vad menas med att X liknas vid Y?")
//   sammanfatta  frågan gäller textens huvudbudskap som helhet
//
// Tolv frågor som ett rent sökmönster också flaggade lämnas orörda, eftersom
// de vid genomläsning visade sig ha rätt typ redan.
//
// Kör med --dry för att se ändringarna utan att skriva.

const fs = require('fs');
const path = require('path');

// [textId, frågeindex, nuvarande typ, ny typ, kontrollsträng ur frågan]
const ANDRINGAR = [
  // Enskilda ord och fasta termer -> ord
  ['ak2-historia-07',   0, 'literal', 'ord', 'skolplikt'],
  ['ak2-miljo-04',      0, 'literal', 'ord', 'sortera sopor'],
  ['ak3-etik-018',      0, 'literal', 'ord', 'säga förlåt'],
  ['ak3-existens-020',  0, 'literal', 'ord', 'mod enligt texten'],
  ['ak4-miljo-04',      0, 'literal', 'ord', 'återvinning'],
  ['ak4-tema-008',      4, 'literal', 'ord', 'reparera'],
  ['ak4-tema-009',      4, 'literal', 'ord', 'avdunstar'],
  ['ak4-tema-010',      4, 'literal', 'ord', 'enhälligt'],
  ['ak4-vetenskap-03',  1, 'literal', 'ord', 'densitet'],
  ['ak5-etik-05',       0, 'literal', 'ord', 'något är lika'],
  ['ak5-tema-006',      4, 'literal', 'ord', 'uthållig'],
  ['ak5-tema-007',      4, 'literal', 'ord', 'varsamt'],
  ['ak5-tema-008',      4, 'literal', 'ord', 'atmosfär'],
  ['ak5-tema-009',      4, 'literal', 'ord', 'majoritet'],
  ['ak5-tema-010',      4, 'literal', 'ord', 'varierat'],
  ['ak6-tema-003',      2, 'literal', 'ord', 'indelt soldat'],
  ['ak6-tema-005',      2, 'literal', 'ord', 'avsaltning'],
  ['ak6-tema-006',      4, 'literal', 'ord', 'spegla olika intressen'],
  ['ak6-tema-008',      4, 'literal', 'ord', 'begränsad utsträckning'],
  ['ak6-tema-009',      4, 'literal', 'ord', 'näringskedja'],
  ['ak6-tema-010',      4, 'literal', 'ord', 'retuscherade'],
  ['ak6-tema-011',      1, 'literal', 'ord', 'hemmamatch'],
  ['ak6-tema-012',      2, 'literal', 'ord', 'press'],
  ['ak6-tema-015',      0, 'literal', 'ord', 'bygga upp'],
  ['ak6-tema-015',      4, 'literal', 'ord', 'balans'],
  ['ak6-tema-017',      0, 'literal', 'ord', 'självstyre'],
  ['ak7-miljo-02',      0, 'literal', 'ord', 'matsvinn'],
  ['ak7-tema-006',      1, 'literal', 'ord', 'pollinering'],
  ['ak7-tema-007',      3, 'literal', 'ord', 'rådgivande'],
  ['ak7-tema-019',      1, 'literal', 'ord', 'fiatpengar'],
  ['ak8-tema-005',      1, 'literal', 'ord', 'diasporan'],
  ['ak8-tema-014',      2, 'literal', 'ord', 'FOMO'],
  ['ak8-vetenskap-01',  0, 'literal', 'ord', 'antibiotikaresistens'],
  ['gy-samhalle-03',    0, 'literal', 'ord', 'uppmärksamhetsekonomi'],
  ['gy-teknik-02',      0, 'literal', 'ord', 'bias'],
  ['gy-vetenskap-01',   0, 'literal', 'ord', 'korrelation'],
  ['ak6-tema-030',      3, 'inferens', 'ord', 'djurens välfärd'],

  // Innebörden i ett påstående, inte ett ords betydelse -> inferens
  ['ak6-tema-007',      4, 'literal', 'inferens', 'smak formas av kulturen'],
  ['ak9-tema-012',      3, 'literal', 'inferens', 'kartlägger sin dröm'],
  ['ak10-tema-001-b',   5, 'sammanfatta', 'inferens', 'odelbara'],

  // Textens huvudbudskap som helhet -> sammanfatta
  ['ak10-tema-001',     0, 'literal', 'sammanfatta', 'huvudsakliga fokus'],
  ['gy-uni-001',        5, 'literal', 'sammanfatta', 'sammanfattar bäst'],
  ['ak7-tema-011',      0, 'inferens', 'sammanfatta', 'huvudidé'],
  ['ak7-tema-015',      0, 'inferens', 'sammanfatta', 'huvudbudskap'],
  ['ak7-tema-020',      5, 'inferens', 'sammanfatta', 'huvudbudskap'],
  ['akgy-sol-001',      5, 'inferens', 'sammanfatta', 'huvudbudskapet'],
  ['akgy-borg-001',     5, 'inferens', 'sammanfatta', 'huvudbudskap'],
  ['akgy-borg-003',     5, 'inferens', 'sammanfatta', 'huvudsakliga budskap'],
  ['akgy-demo-001',     4, 'inferens', 'sammanfatta', 'huvudbudskap'],
  ['akgy-abba-001',     5, 'textbevis', 'sammanfatta', 'huvudbudskap'],
];

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;
let andrade = 0;

ANDRINGAR.forEach(([id, index, fran, till, kontroll]) => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error(`Hittar inte ${id}`); ok = false; return; }

  const q = (t.questions || [])[index];
  if (!q) { console.error(`${id}: ingen fråga på plats ${index}`); ok = false; return; }

  // Två spärrar så att fel fråga aldrig kan träffas: typen måste stämma, och
  // frågetexten måste innehålla den sträng ändringen bygger på.
  if (q.type !== fran) {
    console.error(`${id} f${index + 1}: typen är "${q.type}", förväntade "${fran}"`); ok = false; return;
  }
  if (!q.q.toLowerCase().includes(kontroll.toLowerCase())) {
    console.error(`${id} f${index + 1}: frågan innehåller inte "${kontroll}"`); ok = false; return;
  }

  q.type = till;
  andrade++;
  console.log(`${id.padEnd(20)} f${index + 1}  ${fran.padEnd(12)} → ${till.padEnd(12)} ${q.q.slice(0, 52)}`);
});

console.log(`\n${andrade} frågor ändrade`);

if (!dry) fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
else console.log('(dry run – inget skrivet)');
if (!ok) process.exit(1);
