#!/usr/bin/env node
//
// Fem åk 1-texter till med samma skada: en punkt har infogats rakt före ett
// namn, mitt inne i meningen.
//
//   "Hennes syskon. Amir bygger banor..."   ska vara   "Hennes syskon Amir bygger banor..."
//   "Roboten följer linjer som. Lina ritar" ska vara   "...linjer som Lina ritar"
//   "Då kommer. Nora fram."                 ska vara   "Då kommer Nora fram."
//
// Texterna är fyrtio ord långa, så tre sådana brott är nästan en tiondel av
// vad eleven läser – och de yngsta läsarna har minst möjlighet att läsa förbi.
//
// Kör med --dry för att se ändringarna utan att skriva.

const fs = require('fs');
const path = require('path');

const RATTELSER = [
  ['ak1-tema-005', 'Hennes syskon. Amir bygger banor',   'Hennes syskon Amir bygger banor'],
  ['ak1-tema-005', 'följer linjer som. Lina ritar',      'följer linjer som Lina ritar'],
  ['ak1-tema-005', 'Då flyttar. Amir hindret',           'Då flyttar Amir hindret'],
  ['ak1-tema-006', 'springer snabbt men. Leo tar',       'springer snabbt men Leo tar'],
  ['ak2-gpt-003',  'Då kommer. Nora fram.',              'Då kommer Nora fram.'],
  ['ak2-gpt-003',  'När klockan ringer säger. Ali:',     'När klockan ringer säger Ali:'],
  ['ak2-gpt-003',  'min rast rolig.".',             'min rast rolig."'],
  ['ak2-gpt-004',  'Några ord är svåra, men. Anna',      'Några ord är svåra, men Anna'],

  // Inte en felplacerad punkt, men "tillhör den den låter som" är svårläst.
  // Ett utsatt substantiv gör meningen tydlig utan att ändra innebörden.
  ['ak7-tema-039', 'tillhör den den låter som',          'tillhör den person den låter som'],
];

const BAND = { 1:[40,60], 2:[65,90], 3:[150,165], 4:[200,220], 5:[300,320],
               6:[400,415], 7:[500,530], 8:[530,570], 9:[570,590], 10:[590,625] };

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;
const rorda = new Set();

RATTELSER.forEach(([id, fran, till]) => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error(`Hittar inte ${id}`); ok = false; return; }
  if (!t.text.includes(fran)) {
    console.error(`${id}: hittar inte "${fran}"`); ok = false; return;
  }
  t.text = t.text.replace(fran, till);
  rorda.add(id);
  console.log(`${id.padEnd(15)} "${fran}" → "${till}"`);
});

console.log();
rorda.forEach(id => {
  const t = lib.find(x => x.id === id);
  const n = t.text.trim().split(/\s+/).length;
  const [min, max] = BAND[t.grade];
  const inom = n >= min && n <= max;
  if (!inom) ok = false;
  t.meta = { ...(t.meta || {}), wordCount: n };
  console.log(`${id.padEnd(15)} åk${String(t.grade).padStart(2)}  ${n} ord ${inom ? '✅' : `❌ krav ${min}–${max}`}`);
});

if (!dry) fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
else console.log('\n(dry run – inget skrivet)');
if (!ok) process.exit(1);
