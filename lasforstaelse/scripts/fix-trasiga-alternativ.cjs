#!/usr/bin/env node
//
// Två trasiga svarsalternativ som hittades vid genomläsningen av åk 3.
//
// ak4-tema-004 hade alternativet "utan publik" – ett gement fragment som
// dessutom var slutet av alternativet intill, "Endast utomhus utan publik".
// Eleven fick alltså tre svar att välja mellan i praktiken.
//
// ak4-teknik-03 hade "Batteriet är i texten slut", där orden "i texten"
// hamnat mitt inne i meningen.

const fs = require('fs');
const path = require('path');

const RATTELSER = [
  ['ak4-tema-004',  4, 3, 'utan publik',                'Bara i studion när hon spelar in'],
  ['ak4-teknik-03', 1, 2, 'Batteriet är i texten slut', 'Batteriet i motorn är slut'],
];

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;
RATTELSER.forEach(([id, qi, oi, fran, till]) => {
  const t = lib.find(x => x.id === id);
  const q = t && t.questions[qi];
  if (!q || q.options[oi] !== fran) {
    console.error(`${id} f${qi + 1}: hittar inte "${fran}"`); ok = false; return;
  }
  if (oi === q.correct) { console.error(`${id}: är rätt svar, rörs inte`); ok = false; return; }
  q.options[oi] = till;
  console.log(`${id} f${qi + 1} ${'ABCD'[oi]}`);
  console.log(`   − "${fran}"`);
  console.log(`   + "${till}"`);

  const l = q.options.map(o => o.length);
  const ratt = l[q.correct];
  const ovriga = l.filter((_, i) => i !== q.correct);
  const motLangsta = ratt / Math.max(...ovriga);
  const motKortaste = Math.min(...ovriga) / ratt;
  console.log(`   rätt svar ${motLangsta.toFixed(2)}× längsta, ${motKortaste.toFixed(2)}× mot kortaste`);
  if (motLangsta >= 1.6 || motKortaste >= 1.6) { console.error('   gissningsbar på längden'); ok = false; }
});

if (!dry) fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
else console.log('\n(dry run – inget skrivet)');
if (!ok) process.exit(1);
