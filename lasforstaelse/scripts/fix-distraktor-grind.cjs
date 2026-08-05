#!/usr/bin/env node
//
// Rättar en distraktor jag själv skrev fel i sats A.
//
// I ak3-tema-012, som handlar om en buss som blir stående efter att en
// lastbil fått motorstopp, skrev jag "Att de borde ha skällt på den som
// lämnade grinden öppen". Det finns ingen grind i texten. En distraktor ska
// vara rimlig men fel – inte hänvisa till något som inte existerar i
// berättelsen, för då blir den lika lätt att välja bort som en mallfras.

const fs = require('fs');
const path = require('path');

const [ID, QI, OI, FRAN, TILL] = ['ak3-tema-012', 5, 1,
  'Att de borde ha skällt på den som lämnade grinden öppen',
  'Att de borde ha skällt på den som orsakade stoppet'];

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

const t = lib.find(x => x.id === ID);
const q = t && t.questions[QI];
if (!q || q.options[OI] !== FRAN) {
  console.error(`${ID} f${QI + 1}: hittar inte "${FRAN}"`);
  process.exit(1);
}
if (OI === q.correct) { console.error('är rätt svar, rörs inte'); process.exit(1); }

q.options[OI] = TILL;
console.log(`${ID} f${QI + 1} ${'ABCD'[OI]}  (${FRAN.length} → ${TILL.length} tecken)`);
console.log(`   − ${FRAN}`);
console.log(`   + ${TILL}`);

const l = q.options.map(o => o.length);
const ratt = l[q.correct];
const ovriga = l.filter((_, i) => i !== q.correct);
const kvot = ratt / Math.max(...ovriga);
console.log(`   rätt svar är ${kvot.toFixed(2)}× längsta distraktorn`);
if (kvot >= 1.6) process.exit(1);

if (!dry) fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
else console.log('(dry run – inget skrivet)');
