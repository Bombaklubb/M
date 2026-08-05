#!/usr/bin/env node
//
// Två åk 1-texter till med punkt före namn, och något nytt: utfyllnadsord.
//
// Båda låg på exakt 40 ord, vilket är minimigränsen för åk 1. Sluten läser
// som om ord klistrats på för att nå gränsen:
//
//   "Den lyser lugnt över husen i natten stilla."
//   "...hinner före lektionen den första idag tillsammans."
//
// Sluten skrivs om till begriplig svenska. Ordantalet hålls kvar över
// minimigränsen genom att den sista meningen i ak1-tema-010 får ett innehåll
// som knyter an till att Oskar var orolig i början.
//
// Kör med --dry för att se ändringarna utan att skriva.

const fs = require('fs');
const path = require('path');

const RATTELSER = [
  // Punkt insprängd före ett namn
  ['ak1-tema-008', 'Hennes lillebror. Noor lyssnar', 'Hennes lillebror Noor lyssnar'],
  ['ak1-tema-010', 'hållplatsen där. Oskar väntar.', 'hållplatsen där Oskar väntar.'],

  // Utfyllnadsord i slutet
  ['ak1-tema-008',
   'Den lyser lugnt över husen i natten stilla.',
   'Den lyser lugnt över husen i den stilla natten.'],
  ['ak1-tema-010',
   'De cyklar lugnt till skolan och hinner före lektionen den första idag tillsammans.',
   'De cyklar lugnt till skolan och hinner fram före första lektionen. Oskar är inte orolig längre.'],
];

const BAND = { 1: [40, 60] };

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;
const rorda = new Set();

RATTELSER.forEach(([id, fran, till]) => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error(`Hittar inte ${id}`); ok = false; return; }
  if (!t.text.includes(fran)) { console.error(`${id}: hittar inte "${fran}"`); ok = false; return; }
  t.text = t.text.replace(fran, till);
  rorda.add(id);
  console.log(`${id}\n   "${fran}"\n → "${till}"\n`);
});

rorda.forEach(id => {
  const t = lib.find(x => x.id === id);
  const n = t.text.trim().split(/\s+/).length;
  const [min, max] = BAND[t.grade];
  const inom = n >= min && n <= max;
  if (!inom) ok = false;
  t.meta = { ...(t.meta || {}), wordCount: n };
  console.log(`${id.padEnd(15)} ${n} ord ${inom ? '✅' : `❌ krav ${min}–${max}`}`);
  console.log(`   ${t.text}`);
});

if (!dry) fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
else console.log('\n(dry run – inget skrivet)');
if (!ok) process.exit(1);
