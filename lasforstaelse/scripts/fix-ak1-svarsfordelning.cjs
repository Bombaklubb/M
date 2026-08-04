#!/usr/bin/env node
//
// De 27 omskrivna åk 1-texterna fick alla samma facitmönster (0,1,2,3,0,1),
// vilket är ett mönster en elev kan lära sig i stället för att läsa.
// Här roteras svarsalternativen per fråga så att varje text får ett eget
// mönster. Rotationen flyttar hela alternativlistan, så rätt svar följer med
// och innehållet är oförändrat.
//
// Rotationen per fråga hämtas ur en deterministisk generator, inte ur en
// aritmetisk följd. En aritmetisk rotation ger bara fyra möjliga utfall när
// utgångsmönstret är detsamma i alla texter, vilket lämnar kvar ett mönster.

const fs = require('fs');
const path = require('path');

const IDS = [
  'ak1-tema-022', 'ak1-tema-042', 'ak1-tema-024', 'ak1-tema-034', 'ak1-tema-044',
  'ak1-tema-025', 'ak1-tema-035', 'ak1-tema-045', 'ak1-tema-026', 'ak1-tema-036',
  'ak1-tema-046', 'ak1-tema-027', 'ak1-tema-037', 'ak1-tema-047', 'ak1-tema-028',
  'ak1-tema-038', 'ak1-tema-048', 'ak1-tema-029', 'ak1-tema-039', 'ak1-tema-049',
  'ak1-tema-030', 'ak1-tema-040', 'ak1-tema-050', 'ak1-tema-031', 'ak1-tema-041',
  'ak1-tema-033', 'ak1-tema-043',
];

// Deterministisk generator, så att skriptet ger samma resultat varje körning.
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// Godtagbar facit: inget alternativ rätt fler än två gånger av sex, och minst
// tre av de fyra positionerna används.
function godtagbar(f) {
  const c = [0, 0, 0, 0];
  f.forEach(x => c[x]++);
  return Math.max(...c) <= 2 && c.filter(x => x > 0).length >= 3;
}

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

const anvanda = new Set();
let ok = true;

IDS.forEach((id, i) => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error('Hittar inte ' + id); ok = false; return; }
  const base = t.questions.map(q => q.correct);

  let vald = null;
  for (let forsok = 0; forsok < 500 && !vald; forsok++) {
    const slump = rng(i * 7919 + forsok * 104729 + 12345);
    const rot = base.map(() => Math.floor(slump() * 4));
    const f = base.map((b, j) => (b + rot[j]) % 4);
    const nyckel = f.join('');
    if (godtagbar(f) && !anvanda.has(nyckel)) vald = { rot, f, nyckel };
  }
  if (!vald) { console.error('Ingen godtagbar rotation för ' + id); ok = false; return; }
  anvanda.add(vald.nyckel);

  t.questions.forEach((q, j) => {
    const r = vald.rot[j];
    if (r === 0) return;
    const nya = new Array(4);
    q.options.forEach((opt, idx) => { nya[(idx + r) % 4] = opt; });
    q.options = nya;
    q.correct = (q.correct + r) % 4;
  });

  console.log(`${id.padEnd(14)} ${base.join('')} → ${t.questions.map(q => q.correct).join('')}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');

// Kontroll: hur ofta hamnar rätt svar på respektive position totalt?
const tot = [0, 0, 0, 0];
IDS.forEach(id => lib.find(x => x.id === id).questions.forEach(q => tot[q.correct]++));
console.log('\nUnika facitmönster: ' + anvanda.size + ' av ' + IDS.length);
console.log('Rätt svar per position (A/B/C/D): ' + tot.join(' / ') + '  av ' + tot.reduce((a, b) => a + b, 0));
if (!ok) process.exit(1);
