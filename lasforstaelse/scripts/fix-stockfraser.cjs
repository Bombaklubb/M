#!/usr/bin/env node
//
// En text till med en punkt insprängd före ett namn:
//   "På lördagen går. Sara och pappa till skogen."
//
// Vid samma granskning hittades fyra mallfraser som återkommer ordagrant på
// orelaterade distraktorer i olika årskurser:
//
//   ", för att undvika missförstånd"      12 alternativ i 12 texter
//   ", för att det hade fungerat förut"   11 alternativ i 10 texter
//   ", för att slippa problem senare"      6 alternativ i  6 texter
//   ", för att det skulle gå snabbare"     4 alternativ i  4 texter
//
// De är INTE borttagna här, och det är avsiktligt. De håller distraktorerna
// lika långa som det rätta svaret. Stryks de rakt av blir det rätta svaret
// påfallande längst i trettio frågor, vilket gör dem gissningsbara utan att
// eleven läser texten – ett värre fel än det man rättar.
//
// Rätt åtgärd är att ersätta varje fras med en egen, innehållsbärande
// fortsättning så att längden består men mönstret bryts. Det kräver att
// varje fråga läses mot sin text och ligger kvar som eget arbete.

const fs = require('fs');
const path = require('path');

const [ID, FRAN, TILL] = ['ak2-gpt-002',
  'På lördagen går. Sara och pappa till skogen.',
  'På lördagen går Sara och pappa till skogen.'];

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

const t = lib.find(x => x.id === ID);
if (!t || !t.text.includes(FRAN)) {
  console.error(`${ID}: hittar inte "${FRAN}"`);
  process.exit(1);
}
const fore = t.text.trim().split(/\s+/).length;
t.text = t.text.replace(FRAN, TILL);
const efter = t.text.trim().split(/\s+/).length;
t.meta = { ...(t.meta || {}), wordCount: efter };

console.log(`${ID}\n   "${FRAN}"\n → "${TILL}"`);
console.log(`   ${fore} → ${efter} ord`);
console.log(`   ${t.text}`);

if (fore !== efter) { console.error('ordantalet ändrades'); process.exit(1); }
if (!dry) fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
else console.log('\n(dry run – inget skrivet)');
