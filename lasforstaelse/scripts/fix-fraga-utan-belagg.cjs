#!/usr/bin/env node
//
// Fråga 5 i ak6-vetenskap-04 bygger på ett påstående som inte finns i texten.
//
// Frågan lyder "Varför säger Karin att de ska skriva vad data tyder på?", men
// Karin säger aldrig något sådant. Det enda hon säger om resultatet är att det
// kan vara metallpartiklar. Eleven kan alltså inte hitta stöd i texten, och
// den som läser noggrant blir mest förvirrad.
//
// Det rätta svaret – att undersökningen gäller deras egna prover och kan ha
// begränsningar – är däremot en rimlig slutsats av texten. Därför byts bara
// frågeformuleringen ut, medan alla fyra alternativ och rätt-index står kvar.
//
// Kör med --dry för att se ändringen utan att skriva.

const fs = require('fs');
const path = require('path');

const ID = 'ak6-vetenskap-04';
const INDEX = 4;
const GAMMAL = 'Varför säger Karin att de ska skriva vad data tyder på?';
const NY = 'Varför går det inte att säga säkert att all grå snö i staden innehåller metallpartiklar?';
const RATT = 'För att deras undersökning gäller deras prover och kan ha begränsningar';

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

const t = lib.find(x => x.id === ID);
if (!t) { console.error(`Hittar inte ${ID}`); process.exit(1); }

const q = (t.questions || [])[INDEX];
if (!q || q.q !== GAMMAL) {
  console.error(`${ID}: förväntade den gamla frågan på plats ${INDEX}, fann "${q && q.q}"`);
  process.exit(1);
}

// Spärr: den påhittade repliken får inte finnas i texten, och rätt svar måste
// ligga kvar på sin plats så att svarsfördelningen är oförändrad.
if (t.text.includes('tyder på')) {
  console.error(`${ID}: texten innehåller ändå "tyder på" – kontrollera manuellt`);
  process.exit(1);
}
if (q.options[q.correct] !== RATT) {
  console.error(`${ID}: rätt svar är inte det förväntade`);
  process.exit(1);
}
// Den nya frågan måste ha stöd i texten: tre prover, och metallpartiklar.
['tre prover', 'metallpartiklar'].forEach(belagg => {
  if (!t.text.includes(belagg)) { console.error(`${ID}: texten saknar "${belagg}"`); process.exit(1); }
});

const fore = q.q;
q.q = NY;
q.type = 'inferens';

console.log(`${ID} f${INDEX + 1}`);
console.log(`   gammal: ${fore}`);
console.log(`   ny:     ${q.q}`);
q.options.forEach((o, i) => console.log(`   ${i === q.correct ? '✓' : ' '} ${'ABCD'[i]}) ${o}`));

if (!dry) fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
else console.log('\n(dry run – inget skrivet)');
