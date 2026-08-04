#!/usr/bin/env node
//
// Ett facitmönster som återkommer i många texter går att lära sig i stället
// för att läsa. I biblioteket delade 44 texter mönstret 0-1-2-3-0-1: sex
// frågor där rätt svar ligger på A, B, C, D, A, B i tur och ordning.
//
// Skriptet roterar svarsalternativen per fråga i de texter vars mönster är
// överrepresenterat, tills inget mönster används av fler än TAK texter.
// Rotationen flyttar hela alternativlistan och rätt svar följer med, så
// innehållet är oförändrat.

const fs = require('fs');
const path = require('path');

const TAK = 3;

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// Godtagbar facit: inget alternativ rätt fler än två gånger av sex, minst tre
// av de fyra positionerna används, och aldrig samma position tre gånger i rad.
function godtagbar(f) {
  const c = [0, 0, 0, 0];
  f.forEach(x => c[x]++);
  if (Math.max(...c) > 2) return false;
  if (c.filter(x => x > 0).length < 3) return false;
  for (let i = 2; i < f.length; i++) if (f[i] === f[i - 1] && f[i] === f[i - 2]) return false;
  return true;
}

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

const monster = t => t.questions.map(q => q.correct).join('');

const antal = {};
lib.forEach(t => { const k = monster(t); antal[k] = (antal[k] || 0) + 1; });

const fore = Object.entries(antal).filter(([, v]) => v > TAK).sort((a, b) => b[1] - a[1]);
console.log(`Mönster som används av fler än ${TAK} texter: ${fore.length}`);
fore.slice(0, 10).forEach(([k, v]) => console.log(`  ${k}  ×${v}`));

let andrade = 0;
lib.forEach((t, i) => {
  if (t.questions.length !== 6) return;
  const nuvarande = monster(t);
  if (antal[nuvarande] <= TAK) return;

  const base = t.questions.map(q => q.correct);
  let vald = null;
  for (let forsok = 0; forsok < 800 && !vald; forsok++) {
    const slump = rng(i * 6151 + forsok * 92821 + 7);
    const rot = base.map(() => Math.floor(slump() * 4));
    const f = base.map((b, j) => (b + rot[j]) % 4);
    const nyckel = f.join('');
    if (godtagbar(f) && (antal[nyckel] || 0) < TAK) vald = { rot, nyckel };
  }
  if (!vald) return;

  t.questions.forEach((q, j) => {
    const r = vald.rot[j];
    if (r === 0) return;
    const nya = new Array(4);
    q.options.forEach((opt, idx) => { nya[(idx + r) % 4] = opt; });
    q.options = nya;
    q.correct = (q.correct + r) % 4;
  });

  antal[nuvarande]--;
  antal[vald.nyckel] = (antal[vald.nyckel] || 0) + 1;
  andrade++;
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');

const efter = {};
lib.forEach(t => { const k = monster(t); efter[k] = (efter[k] || 0) + 1; });
const kvar = Object.entries(efter).filter(([, v]) => v > TAK).sort((a, b) => b[1] - a[1]);
const pos = [0, 0, 0, 0];
lib.forEach(t => t.questions.forEach(q => pos[q.correct]++));

console.log(`\nOmroterade texter: ${andrade}`);
console.log(`Unika mönster: ${Object.keys(efter).length} av ${lib.length} texter`);
console.log(`Mönster kvar över taket: ${kvar.length}${kvar.length ? ' (' + kvar.map(([k, v]) => k + ' ×' + v).join(', ') + ')' : ''}`);
console.log(`Rätt svar per position (A/B/C/D): ${pos.join(' / ')}`);
