#!/usr/bin/env node
//
// Grammatikfel i ett svarsalternativ i ak9-tema-002.
//
// Alternativet lyder "Att kommunen ska stänga alla skolköket under vintern".
// "alla" kräver plural: skolkök, inte skolköket.
//
// Kör med --dry för att se ändringen utan att skriva.

const fs = require('fs');
const path = require('path');

const ID = 'ak9-tema-002';
const QI = 3;
const FRAN = 'Att kommunen ska stänga alla skolköket under vintern';
const TILL = 'Att kommunen ska stänga alla skolkök under vintern';

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

const t = lib.find(x => x.id === ID);
if (!t) { console.error(`Hittar inte ${ID}`); process.exit(1); }
const q = (t.questions || [])[QI];
if (!q) { console.error(`${ID}: ingen fråga på plats ${QI}`); process.exit(1); }

const oi = q.options.indexOf(FRAN);
if (oi === -1) { console.error(`${ID} f${QI + 1}: hittar inte "${FRAN}"`); process.exit(1); }
if (oi === q.correct) { console.error(`${ID} f${QI + 1}: alternativet är rätt svar, rörs inte`); process.exit(1); }

q.options[oi] = TILL;
console.log(`${ID} f${QI + 1} ${'ABCD'[oi]}: "${FRAN}"\n${' '.repeat(19)}→ "${TILL}"`);

if (!dry) fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
else console.log('\n(dry run – inget skrivet)');
