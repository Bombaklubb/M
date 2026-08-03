#!/usr/bin/env node
//
// Jämnar ut vilken position det rätta svaret hamnar på.
//
// Specen kräver att rätta svar fördelas jämnt över A–D och att samma position
// inte används mer än två gånger i rad. 70 texter hade facit på bara en eller
// två positioner, och 57 hade samma position tre gånger i rad — båda gör att
// en elev kan gissa sig till mönstret i stället för att läsa.
//
// Ändringen är rent mekanisk: alternativen roteras så att facit hamnar på
// måltpositionen. Rotation behåller både innehållet och alternativens
// inbördes ordning, så ingen text skrivs om.

const fs = require('fs');
const path = require('path');

// Balanserade mönster: varje täcker alla fyra positioner och har aldrig
// samma position tre gånger i rad. Flera varianter så att inte alla texter
// får ett och samma facitmönster.
const MÖNSTER = [
  [0, 1, 2, 3, 1, 0],
  [2, 0, 3, 1, 0, 2],
  [1, 3, 0, 2, 3, 1],
  [3, 2, 1, 0, 2, 3],
  [0, 2, 1, 3, 2, 0],
  [1, 0, 3, 2, 0, 1],
];

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

function behöverFix(frågor) {
  const pos = frågor.map(q => q.correct);
  if (pos.some(p => typeof p !== 'number')) return false;
  if (new Set(pos).size < 3) return true;
  for (let i = 0; i <= pos.length - 3; i++) {
    if (pos[i] === pos[i + 1] && pos[i] === pos[i + 2]) return true;
  }
  return false;
}

let ändradeTexter = 0;
let ändradeFrågor = 0;

lib.forEach((t, idx) => {
  const frågor = t.questions || [];
  if (frågor.length !== 6) return;
  if (!behöverFix(frågor)) return;

  const mål = MÖNSTER[idx % MÖNSTER.length];

  frågor.forEach((q, i) => {
    const alt = q.options || [];
    if (alt.length !== 4 || typeof q.correct !== 'number') return;
    const steg = (mål[i] - q.correct + 4) % 4;
    if (steg === 0) return;
    // Rotera höger `steg` steg: alternativens ordning bevaras cirkulärt
    q.options = alt.slice(4 - steg).concat(alt.slice(0, 4 - steg));
    q.correct = mål[i];
    ändradeFrågor++;
  });
  ändradeTexter++;
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
console.log(`Justerade ${ändradeFrågor} frågor i ${ändradeTexter} texter.`);
