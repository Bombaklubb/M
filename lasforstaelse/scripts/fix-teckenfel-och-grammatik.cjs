#!/usr/bin/env node
//
// Trasiga tecken och grammatikfel som hittats vid genomläsning av åk 5.
//
// Två strängar innehåller ersättningstecknet U+FFFD, alltså tecken som gått
// förlorade i något tidigare steg. De renderas som svarta romber i appen mitt
// i ett ord: "för m<?><?>nga" och "j<?><?>mfört".
//
// Tre formuleringar är ogrammatiska, varav två är det rätta svaret på sin
// fråga. Ett rätt svar som inte går att läsa flytande är sämre än ett som gör
// det, särskilt när eleven ska jämföra fyra alternativ mot varandra.
//
// Kör med --dry för att se ändringarna utan att skriva.

const fs = require('fs');
const path = require('path');

// [id, fält, från, till]  – fält är 'text' eller [frågeindex, alternativindex]
const TEXTRATTELSER = [
  ['ak8-tema-003', 'text', 'för m��nga betyder', 'för många betyder'],
  ['ak7-tema-019', 'text', 'har människor bytit varor', 'har människor bytt varor'],
];

const ALTERNATIV = [
  ['gym-berattelse-val-004', 3, 1,
   'Den visar att fakta är oviktiga j��mfört med känslor',
   'Den visar att fakta är oviktiga jämfört med känslor'],
  ['ak7-tema-016', 1, 2,
   'Akut stress är kortvarig medan långvarig stress ger kroppen ingen återhämtning',
   'Akut stress är kortvarig medan långvarig stress inte ger någon återhämtning'],
  ['ak8-tema-006', 3, 1,
   'Att en regel om att aldrig filma utan lov',
   'Att införa en regel om att aldrig filma utan lov'],
];

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;

TEXTRATTELSER.forEach(([id, falt, fran, till]) => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error(`Hittar inte ${id}`); ok = false; return; }
  if (!t[falt].includes(fran)) { console.error(`${id}: hittar inte "${fran}"`); ok = false; return; }
  const foreOrd = t[falt].trim().split(/\s+/).length;
  t[falt] = t[falt].replace(fran, till);
  const efterOrd = t[falt].trim().split(/\s+/).length;
  if (foreOrd !== efterOrd) { console.error(`${id}: ordantalet ändrades ${foreOrd} → ${efterOrd}`); ok = false; return; }
  console.log(`${id.padEnd(24)} ${falt}: "${fran}" → "${till}"`);
});

ALTERNATIV.forEach(([id, qi, oi, fran, till]) => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error(`Hittar inte ${id}`); ok = false; return; }
  const q = (t.questions || [])[qi];
  if (!q) { console.error(`${id}: ingen fråga på plats ${qi}`); ok = false; return; }
  if (q.options[oi] !== fran) {
    console.error(`${id} f${qi + 1} ${'ABCD'[oi]}: förväntade\n   "${fran}"\n   men fann\n   "${q.options[oi]}"`);
    ok = false; return;
  }
  q.options[oi] = till;
  const l = q.options.map(o => o.length);
  const ratt = l[q.correct];
  const ovriga = l.filter((_, i) => i !== q.correct);
  const motLangsta = ratt / Math.max(...ovriga);
  const motKortaste = Math.min(...ovriga) / ratt;
  const flagga = (motLangsta >= 1.6 || motKortaste >= 1.6) ? '  ⚠ längdkvot' : '';
  if (flagga) ok = false;
  console.log(`${id.padEnd(24)} f${qi + 1} ${'ABCD'[oi]}: "${fran}"\n${' '.repeat(31)}→ "${till}"  (kvot ${motLangsta.toFixed(2)}× / ${motKortaste.toFixed(2)}×)${flagga}`);
});

// Slutkontroll: inga ersättningstecken får finnas kvar någonstans.
const kvar = JSON.stringify(lib).match(/�/g);
if (kvar) { console.error(`\n${kvar.length} ersättningstecken kvar i biblioteket`); ok = false; }
else console.log('\nInga ersättningstecken kvar i biblioteket');

if (!dry) fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
else console.log('(dry run – inget skrivet)');
if (!ok) process.exit(1);
