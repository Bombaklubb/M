#!/usr/bin/env node
//
// Fel facit i ak6-tema-002, fråga 2.
//
// Frågan är "Varför säger Jonas att nätfiske ofta använder stress?" och rätt
// svar pekade på "För att spara batteri på enheten". Texten säger tvärtom:
//   "De använder ofta stress," sa Jonas. "Som att du måste klicka snabbt för
//   att inte förlora priset."
// Alla elever som läser texten och svarar rätt får alltså fel.
//
// Rättningen byter plats på alternativ A och D i stället för att flytta
// correct-index. Då hamnar rätt svar fortfarande på plats D, och
// svarsfördelningen i biblioteket är oförändrad.
//
// Kör med --dry för att se ändringen utan att skriva.

const fs = require('fs');
const path = require('path');

const ID = 'ak6-tema-002';
const INDEX = 1;
const KONTROLL = 'nätfiske ofta använder stress';
const RATT_SVAR = 'För att få dig att klicka snabbt utan att tänka efter';
const FEL_SVAR = 'För att spara batteri på enheten';

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

const t = lib.find(x => x.id === ID);
if (!t) { console.error(`Hittar inte ${ID}`); process.exit(1); }

const q = (t.questions || [])[INDEX];
if (!q || !q.q.includes(KONTROLL)) {
  console.error(`${ID}: förväntade frågan om stress på plats ${INDEX}`);
  process.exit(1);
}

const iRatt = q.options.indexOf(RATT_SVAR);
const iFel = q.options.indexOf(FEL_SVAR);
if (iRatt === -1 || iFel === -1) {
  console.error(`${ID}: hittar inte båda alternativen som ska byta plats`);
  process.exit(1);
}
if (q.correct !== iFel) {
  console.error(`${ID}: rätt-index är ${q.correct}, förväntade ${iFel} – redan rättad?`);
  process.exit(1);
}

// Rätt svar måste finnas belagt i texten.
if (!t.text.includes('klicka snabbt')) {
  console.error(`${ID}: texten saknar belägget "klicka snabbt"`);
  process.exit(1);
}

const fordelningFore = t.questions.map(x => x.correct).join(',');
[q.options[iRatt], q.options[iFel]] = [q.options[iFel], q.options[iRatt]];
const fordelningEfter = t.questions.map(x => x.correct).join(',');

// Det rätta svaret är längre än de tre distraktorerna var, så det gick att
// peka ut på längden. Distraktorerna skrivs ut till samma längdklass.
const LANGRE = [
  ['För att spara batteri på enheten', 'För att spara batteri när många enheter är igång'],
  ['För att internet ska bli snabbare', 'För att internet ska gå snabbare i skolans nätverk'],
  ['För att göra sidan mer färgglad', 'För att sidan ska se mer färgglad och inbjudande ut'],
];
LANGRE.forEach(([fran, till]) => {
  const i = q.options.indexOf(fran);
  if (i === -1) { console.error(`hittar inte "${fran}"`); process.exit(1); }
  if (i === q.correct) { console.error(`"${fran}" är rätt svar, rörs inte`); process.exit(1); }
  q.options[i] = till;
});

const langder = q.options.map(o => o.length);
const ratt = langder[q.correct];
const ovriga = langder.filter((_, i) => i !== q.correct);
const motLangsta = ratt / Math.max(...ovriga);
const motKortaste = Math.min(...ovriga) / ratt;
if (motLangsta >= 1.6 || motKortaste >= 1.6) {
  console.error(`längdkvot kvar: ${motLangsta.toFixed(2)}× / ${motKortaste.toFixed(2)}×`);
  process.exit(1);
}

console.log(`${ID} f${INDEX + 1}: ${q.q}`);
q.options.forEach((o, i) => console.log(`   ${i === q.correct ? '✓' : ' '} ${'ABCD'[i]}) ${o}`));
console.log(`\nsvarsfördelning ${fordelningFore} → ${fordelningEfter}`);
if (fordelningFore !== fordelningEfter) { console.error('fördelningen ändrades'); process.exit(1); }

if (!dry) fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
else console.log('\n(dry run – inget skrivet)');
