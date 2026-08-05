#!/usr/bin/env node
//
// ak4-teknik-04 går från "Därför använder man olika former och material"
// direkt till "En annan typ är bågbro" – men ingen första typ har
// introducerats. Ett stycke om den enklaste brotypen har fallit bort, och
// "En annan typ" hänger därför i luften.
//
// Texten ligger på 212 ord av högst 220, så utrymmet räcker till en kort
// mening som återställer sammanhanget.

const fs = require('fs');
const path = require('path');

const [ID, FRAN, TILL] = ['ak4-teknik-04',
  'Därför använder man olika former och material.',
  'Därför använder man olika former och material. Den enklaste sorten är en rak balkbro.'];

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

const t = lib.find(x => x.id === ID);
if (!t || !t.text.includes(FRAN)) { console.error(`${ID}: hittar inte ankaret`); process.exit(1); }

const fore = t.text.trim().split(/\s+/).length;
t.text = t.text.replace(FRAN, TILL);
const efter = t.text.trim().split(/\s+/).length;
t.meta = { ...(t.meta || {}), wordCount: efter };

console.log(`${ID}  ${fore} → ${efter} ord (krav 200–220)`);
const i = t.text.indexOf('Den enklaste');
console.log('   ...' + t.text.slice(Math.max(0, i - 60), i + 150).replace(/\n+/g, ' ') + '...');

if (efter < 200 || efter > 220) { console.error('utanför intervallet'); process.exit(1); }
if (!dry) fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
else console.log('(dry run – inget skrivet)');
