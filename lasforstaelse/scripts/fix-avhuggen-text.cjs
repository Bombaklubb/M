#!/usr/bin/env node
//
// ak3-tema-001 slutar mitt i en mening: "Barnen lär sig också hur träd"
//
// Texten ligger på exakt 150 ord, vilket är minimigränsen för åk 3. Den har
// alltså kapats vid ordgränsen i stället för att skrivas färdig – samma sorts
// skada som utfyllnadsorden i åk 1, fast åt andra hållet.
//
// Meningen skrivs färdig så att den knyter an till det texten redan handlar
// om: att familjen sköter trädet år efter år.

const fs = require('fs');
const path = require('path');

const [ID, FRAN, TILL] = ['ak3-tema-001',
  'Barnen lär sig också hur träd',
  'Barnen lär sig också hur träd sköts och varför skörden skiljer sig mellan olika år.'];

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

const t = lib.find(x => x.id === ID);
if (!t || !t.text.trim().endsWith(FRAN)) {
  console.error(`${ID}: texten slutar inte på "${FRAN}"`);
  process.exit(1);
}

const fore = t.text.trim().split(/\s+/).length;
t.text = t.text.trimEnd().slice(0, -FRAN.length) + TILL;
const efter = t.text.trim().split(/\s+/).length;
t.meta = { ...(t.meta || {}), wordCount: efter };

console.log(`${ID}  ${fore} → ${efter} ord (krav 150–165)`);
console.log(`   ...${t.text.trim().slice(-110)}`);

if (efter < 150 || efter > 165) { console.error('utanför intervallet'); process.exit(1); }
if (!dry) fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
else console.log('(dry run – inget skrivet)');
