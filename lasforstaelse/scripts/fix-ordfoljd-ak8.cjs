#!/usr/bin/env node
//
// Ordföljdsfel i det rätta svaret på ak8-tema-020 fråga 5.
//
// Alternativet lyder "För att de tar inte slut vid skoldagens slut och sparas
// kvar". Negationen ska stå före verbet i en bisats som inleds med "för att":
// "för att de inte tar slut". Felet sitter i det svar eleven ska välja.
//
// Kör med --dry för att se ändringen utan att skriva.

const fs = require('fs');
const path = require('path');

const ID = 'ak8-tema-020';
const QI = 4;
const FRAN = 'För att de tar inte slut vid skoldagens slut och sparas kvar';
const TILL = 'För att de inte tar slut vid skoldagens slut och sparas kvar';

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

const t = lib.find(x => x.id === ID);
if (!t) { console.error(`Hittar inte ${ID}`); process.exit(1); }
const q = (t.questions || [])[QI];
if (!q) { console.error(`${ID}: ingen fråga på plats ${QI}`); process.exit(1); }

const oi = q.options.indexOf(FRAN);
if (oi === -1) { console.error(`${ID} f${QI + 1}: hittar inte "${FRAN}"`); process.exit(1); }
if (oi !== q.correct) { console.error(`${ID} f${QI + 1}: alternativet är inte rätt svar – kontrollera`); process.exit(1); }

q.options[oi] = TILL;
console.log(`${ID} f${QI + 1} ${'ABCD'[oi]} (rätt svar)`);
console.log(`   "${FRAN}"\n → "${TILL}"`);

if (!dry) fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
else console.log('\n(dry run – inget skrivet)');
