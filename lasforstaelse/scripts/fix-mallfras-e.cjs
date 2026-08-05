#!/usr/bin/env node
//
// En sextonde mallfras som gled förbi de fyra tidigare satserna:
// "men bara när tillfället passade", på tre distraktorer i tre texter.
//
// Den upptäcktes genom att läsa åk 4, inte genom mätning – mitt första svep
// hade tröskeln fyra texter, och den här fanns bara i tre. Efter omskrivningen
// finns ingen slutfras kvar som återkommer i tre eller fler texter utan att
// någon gång också sitta på ett rätt svar.

const fs = require('fs');
const path = require('path');

const OMSKRIVNINGAR = [
  ['ak1-etik-06', 5, 0,
   'Att alltid ta nya pennor men bara när tillfället passade',
   'Att man får behålla saker man hittar på golvet'],

  ['ak6-musik-15', 5, 1,
   'Att du blir hungrig av musik men bara när tillfället passade',
   'Att du känner musiken vibrera svagt i bröstet'],

  ['ak8-tema-011', 3, 1,
   'AI-system är alltid hemliga och säljs dyrt men bara när tillfället passade',
   'AI-system hålls hemliga av företagen som byggt dem'],
];

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;
OMSKRIVNINGAR.forEach(([id, qi, oi, fran, till]) => {
  const t = lib.find(x => x.id === id);
  const q = t && t.questions[qi];
  if (!q || q.options[oi] !== fran) { console.error(`${id} f${qi + 1}: hittar inte "${fran}"`); ok = false; return; }
  if (oi === q.correct) { console.error(`${id}: är rätt svar`); ok = false; return; }
  q.options[oi] = till;

  const l = q.options.map(o => o.length);
  const ratt = l[q.correct];
  const ovriga = l.filter((_, i) => i !== q.correct);
  const motLangsta = ratt / Math.max(...ovriga);
  const motKortaste = Math.min(...ovriga) / ratt;
  console.log(`${id} f${qi + 1} ${'ABCD'[oi]}  (${fran.length} → ${till.length} tecken, rätt svar ${motLangsta.toFixed(2)}× längsta)`);
  console.log(`   − ${fran}`);
  console.log(`   + ${till}`);
  if (motLangsta >= 1.6 || motKortaste >= 1.6) { console.error('   gissningsbar på längden'); ok = false; }
});

if (!dry) fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
else console.log('\n(dry run – inget skrivet)');
if (!ok) process.exit(1);
