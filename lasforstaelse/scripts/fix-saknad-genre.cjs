#!/usr/bin/env node
//
// Sätter explicit genre på de texter som har `category` men saknar `genre`.
//
// Varför: src/services/libraryService.ts gör
//     if (!text.genre && text.category) → genre: 'berättelse'
// vilket innebär att faktatexter som "Vattenexperimentet" (Vetenskap) och
// "Hur choklad blir till" (Teknik) visas som "📖 Berättelse" för eleven, och
// aldrig räknas mot Faktaälskar-utmärkelsen.
//
// Klassificeringen nedan är gjord genom att läsa varje text, inte utifrån
// kategorinamnet – "Sport" och "Kultur" förekommer i båda genrerna.
//
// Gränsdragning för texter som blandar:
//   berättelse = karaktären finns med genom texten och har en båge
//   faktatext  = karaktären är bara en inledande krok, resten förklarar

const fs = require('fs');
const path = require('path');

const BERATTELSE = [
  // Sagor om enhörningar med namngivna figurer
  'ak2-tema-007', 'ak2-tema-008', 'ak2-tema-009', 'ak2-tema-010',
  // Skolscener i åk 3 med elever, dialog och händelseförlopp
  'ak3-tema-006', 'ak3-tema-007', 'ak3-tema-008', 'ak3-tema-009', 'ak3-tema-010',
  'ak3-tema-011', 'ak3-tema-012', 'ak3-tema-013', 'ak3-tema-014', 'ak3-tema-015',
  'ak3-tema-016', 'ak3-tema-017', 'ak3-tema-018', 'ak3-tema-019', 'ak3-tema-020',
  // Åk 6: karaktärer genom hela texten
  'ak6-tema-001', 'ak6-tema-002', 'ak6-tema-003', 'ak6-tema-004', 'ak6-tema-005',
  'ak6-tema-006', 'ak6-tema-012',
  'ak8-tema-003', 'ak8-tema-005',
  // Åk 9: huvudperson med båge (Nora, Samira, Linus, Noah, Elin)
  'ak9-tema-005', 'ak9-tema-011', 'ak9-tema-012', 'ak9-tema-013', 'ak9-tema-015',
];

const FAKTATEXT = [
  'ak2-tema-006',                                          // förklarar vad enhörningar är
  'ak3-tema-021', 'ak3-tema-022', 'ak3-tema-023', 'ak3-tema-024', 'ak3-tema-025',
  'ak5-tema-021', 'ak5-tema-022', 'ak5-tema-023', 'ak5-tema-024', 'ak5-tema-025',
  'ak6-tema-007', 'ak6-tema-008', 'ak6-tema-009', 'ak6-tema-010', 'ak6-tema-011',
  'ak6-tema-013', 'ak6-tema-014', 'ak6-tema-015', 'ak6-tema-016', 'ak6-tema-017',
  'ak6-tema-018', 'ak6-tema-019', 'ak6-tema-020', 'ak6-tema-021', 'ak6-tema-022',
  'ak6-tema-023', 'ak6-tema-024', 'ak6-tema-025',
  'ak7-tema-003', 'ak7-tema-004', 'ak7-tema-005',
  'ak8-tema-002', 'ak8-tema-004',
  'ak9-tema-001', 'ak9-tema-002', 'ak9-tema-003', 'ak9-tema-004', 'ak9-tema-006',
  'ak9-tema-007', 'ak9-tema-008', 'ak9-tema-009', 'ak9-tema-010', 'ak9-tema-014',
  'ak9-tema-016', 'ak9-tema-017', 'ak9-tema-018', 'ak9-tema-019', 'ak9-tema-020',
];

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

const behöverGenre = lib.filter(t => t.category && !t.genre).map(t => t.id);
const klassificerade = [...BERATTELSE, ...FAKTATEXT];

// Säkerhetskontroller innan något skrivs
const saknas = behöverGenre.filter(id => !klassificerade.includes(id));
const överflödiga = klassificerade.filter(id => !behöverGenre.includes(id));
const dubbletter = klassificerade.filter((id, i) => klassificerade.indexOf(id) !== i);

if (saknas.length || överflödiga.length || dubbletter.length) {
  if (saknas.length) console.error('Oklassificerade texter:', saknas.join(', '));
  if (överflödiga.length) console.error('Klassificerade men behöver inte genre:', överflödiga.join(', '));
  if (dubbletter.length) console.error('Samma id i båda listorna:', dubbletter.join(', '));
  process.exit(1);
}

let ändrade = 0;
lib.forEach(t => {
  if (!t.category || t.genre) return;
  t.genre = BERATTELSE.includes(t.id) ? 'berättelse' : 'faktatext';
  if (!t.theme) t.theme = t.category;   // theme saknas på samtliga; category är rätt värde
  ändrade++;
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
console.log(`Satte genre på ${ändrade} texter (${BERATTELSE.length} berättelse, ${FAKTATEXT.length} faktatext).`);
