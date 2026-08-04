#!/usr/bin/env node
//
// Nio frågor där rätt svar är minst 1,6 gånger kortare än den kortaste
// distraktorn. Ett påfallande kort rätt svar sticker ut lika mycket som ett
// påfallande långt, och går att peka ut utan att läsa texten.
//
// I samtliga fall är det korta svaret det riktiga svaret — det är
// distraktorerna som är utfyllda. Därför kortas distraktorerna i stället för
// att det rätta svaret skrivs längre. Rätt svar behåller sin position, så att
// facitmönstren inte rubbas.

const fs = require('fs');
const path = require('path');

const NYA = [
  { id: 'ak1-tema-029', fraga: 6, correct: 0,
    options: ['Snön har smält', 'Hugo rev den', 'Halsduken blåste bort', 'Någon tog den'] },

  { id: 'ak1-tema-030', fraga: 3, correct: 3,
    options: ['Sin bror', 'Läraren', 'Ingen', 'Maja'] },

  { id: 'ak1-tema-034', fraga: 5, correct: 3,
    options: ['Kallt', 'Grumligt', 'Djupt', 'Skönt'] },

  { id: 'ak1-tema-035', fraga: 4, correct: 3,
    options: ['Liv gråter', 'Liv sätter sig', 'Liv säger till', 'Liv haltar'] },

  { id: 'ak1-tema-044', fraga: 5, correct: 2,
    options: ['Fotboll', 'Hage', 'Kull', 'Dunken'] },

  { id: 'ak1-tema-047', fraga: 4, correct: 2,
    options: ['Hon väntar', 'Hon har glömt något', 'Hon är osäker', 'Hon fryser'] },

  { id: 'ak7-tema-026', fraga: 1, correct: 2,
    options: ['För att han inte hörde vad hon sa', 'För att hon sa det på skämt',
      'För att hon hade rätt', 'För att han redan bestämt sig'] },

  { id: 'ak7-tema-026', fraga: 4, correct: 1,
    options: ['En broschyr om parken', 'Varsin näve frön',
      'En påse godkänt bröd', 'En karta över parken'] },

  { id: 'ak7-tema-038', fraga: 2, correct: 1,
    options: ['De tar tid från undervisningen', 'De hjälper hela klassen',
      'De gör lektionerna svårare', 'De behövs bara ibland'] },
];

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;
NYA.forEach(n => {
  const t = lib.find(x => x.id === n.id);
  if (!t) { console.error('Hittar inte ' + n.id); ok = false; return; }
  const q = t.questions[n.fraga - 1];
  if (!q) { console.error(`${n.id}: ingen fråga ${n.fraga}`); ok = false; return; }

  if (q.correct !== n.correct) {
    console.error(`${n.id} f${n.fraga}: rätt svar låg på ${q.correct}, inte ${n.correct}`);
    ok = false; return;
  }
  if (q.options[q.correct] !== n.options[n.correct]) {
    console.error(`${n.id} f${n.fraga}: rätt svar ändrat, "${q.options[q.correct]}" → "${n.options[n.correct]}"`);
    ok = false; return;
  }

  q.options = n.options;

  const L = n.options.map(o => o.length);
  const ratt = L[n.correct];
  const ovriga = L.filter((_, i) => i !== n.correct);
  const kvotKort = Math.min(...ovriga) / ratt;
  const kvotLang = ratt / Math.max(...ovriga);
  const bra = kvotKort < 1.6 && kvotLang < 1.6;
  if (!bra) ok = false;
  console.log(`${n.id} f${n.fraga}  ${bra ? '✅' : '❌'}  längder ${L.join('/')}  rätt=${ratt}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
if (!ok) process.exit(1);
