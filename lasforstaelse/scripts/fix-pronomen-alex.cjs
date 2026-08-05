#!/usr/bin/env node
//
// Pronomenkrock i ak7-tema-010.
//
// Fråga 4 lyder "Vad berättar Alex att sömnbrist kan göra för hen?", men i
// texten omtalas Alex som "hon". Dessutom är den meningen otydlig: "Samtidigt
// vill hon inte göra sömn till en tävling" kan lika gärna syfta på Mira, som
// nämns tidigare i stycket. En läsförståelsetext bör inte lämna öppet vem som
// tycker vad.
//
// Texten får Alex namn i stället för pronomenet, och frågan skrivs om utan
// pronomen. Ordantalet är oförändrat.
//
// Kör med --dry för att se ändringarna utan att skriva.

const fs = require('fs');
const path = require('path');

const ID = 'ak7-tema-010';
const TEXT_FRAN = 'Samtidigt vill hon inte göra sömn till en tävling.';
const TEXT_TILL = 'Samtidigt vill Alex inte göra sömn till en tävling.';
const INDEX = 3;
const FRAGA_FRAN = 'Vad berättar Alex att sömnbrist kan göra för hen?';
const FRAGA_TILL = 'Vad berättar Alex att sömnbrist kan göra?';

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

const t = lib.find(x => x.id === ID);
if (!t) { console.error(`Hittar inte ${ID}`); process.exit(1); }

if (!t.text.includes(TEXT_FRAN)) {
  console.error(`${ID}: hittar inte "${TEXT_FRAN}"`); process.exit(1);
}
const foreOrd = t.text.trim().split(/\s+/).length;
t.text = t.text.replace(TEXT_FRAN, TEXT_TILL);
const efterOrd = t.text.trim().split(/\s+/).length;
if (foreOrd !== efterOrd) {
  console.error(`${ID}: ordantalet ändrades ${foreOrd} → ${efterOrd}`); process.exit(1);
}

const q = (t.questions || [])[INDEX];
if (!q || q.q !== FRAGA_FRAN) {
  console.error(`${ID}: förväntade "${FRAGA_FRAN}" på plats ${INDEX}, fann "${q && q.q}"`);
  process.exit(1);
}
q.q = FRAGA_TILL;

console.log(`${ID}  (${foreOrd} ord, oförändrat)`);
console.log(`   text:   "${TEXT_FRAN}"\n        →  "${TEXT_TILL}"`);
console.log(`   f${INDEX + 1}:     "${FRAGA_FRAN}"\n        →  "${FRAGA_TILL}"`);

if (!dry) fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
else console.log('\n(dry run – inget skrivet)');
