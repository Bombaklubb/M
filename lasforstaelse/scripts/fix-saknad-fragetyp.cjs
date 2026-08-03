#!/usr/bin/env node
//
// Sätter `type` på frågor som saknar den.
//
// Varför: frågor utan type lagras som questionType: undefined i elevens
// resultat, och ProfileView grupperade då statistiken under nyckeln
// "undefined". App.tsx har numera en fallback till 'literal' vid visning,
// men den verkliga typen saknas fortfarande i datan – vilket gör
// statistiken "per frågetyp" missvisande.
//
// Klassificeringen bygger på att frågorna följer tydliga språkliga mönster.
// Reglerna prövas i ordning: den mest specifika först.
//
// Kör med --dry för att bara se fördelningen utan att skriva.

const fs = require('fs');
const path = require('path');

const REGLER = [
  // Ordförståelse – frågar explicit efter en betydelse
  { typ: 'ord', namn: 'betyder ordet / menas med',
    test: s => /vad betyder (ordet|uttrycket|ordet)|vad menas med|vad syftar ordet|betyder (ordet|uttrycket)\b/.test(s) },

  // Huvudbudskap och textens syfte – måste prövas före inferens, eftersom
  // "varför är texten skriven" annars fångas av varför-regeln
  { typ: 'sammanfatta', namn: 'huvudbudskap / rubrik / textens syfte',
    test: s => /handlar texten|texten mest om|textens huvud|huvudbudskap|sammanfattar texten|passar bäst som rubrik|vilken rubrik|varför är texten skriven|vad vill texten|textens syfte/.test(s) },

  // Läsa mellan raderna – tolkning, slutsats, känsla, avsikt
  { typ: 'inferens', namn: 'varför / tror du / tolkning',
    test: s => /^varför|vad tror du|tror du att|vad kan man förstå|vad visar det|vad antyder|texten antyder|texten varnar|texten problematiserar|texten beskriver att|vilken slutsats|hur känner|hur kände|hur tolkar|hur resonerar|hur upplever|vad menar|vad innebär det/.test(s) },

  // På raderna – uppgift som står direkt i texten
  { typ: 'literal', namn: 'vad / vem / var / när / vilken',
    test: s => /^(vad|vem|vems|var|vart|när|vilken|vilket|vilka|hur många|hur mycket|hur lång|hur gammal|hur gamla|hur stor|hur ofta|hur tidigt|nämn|runt vad|inom vilka|i vilken)\b/.test(s) },

  // "Hur ..." med faktaverb hör också till raderna
  { typ: 'literal', namn: 'hur + faktaverb',
    test: s => /^hur (beskrivs|beskriver|fungerar|fungerade|transporteras|uppstår|används|är|har|ser|löser|löstes|valde|hjälpte|lät|rörde|reagerade|reagerar|deltar|studerar|orienterar|engagerar|måste|skilde|ändrade|fick|förändras|kopplas|kan)\b/.test(s) },
];

// Frågor som inte följer något mönster – lästa och bedömda var för sig.
const MANUELLA = {
  'ak2-tema-009|5': 'literal',      // "Hur var Noa mot naturen?" – står i texten
  'ak3-tema-022|5': 'literal',      // "Hur länge säljs vissa tillfälliga smaker?"
  'ak4-vatten-001|4': 'inferens',   // hypotetiskt resonemang om torrperiod
  'gy-uni-001|5': 'literal',        // vilken invändning som framhålls står i texten
  'gy-uni-002|6': 'inferens',       // "om man följer textens resonemang…"
  'gy-uni-004|6': 'inferens',       // "om man accepterar textens resonemang…"
  'uni-tema-001|5': 'inferens',     // "vilken tolkning stämmer bäst?"
  'uni-tema-003|5': 'ord',          // vad ordet "rytm" syftar på i sista stycket
};

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

const träffPerRegel = {};
const oklassificerade = [];
let totalt = 0;

const klassificera = fråga => {
  const s = (fråga || '').toLowerCase().trim();
  for (const regel of REGLER) {
    if (regel.test(s)) return regel;
  }
  return null;
};

lib.forEach(t => {
  (t.questions || []).forEach((q, i) => {
    if (q.type) return;
    totalt++;

    const manuell = MANUELLA[`${t.id}|${i + 1}`];
    if (manuell) {
      const nyckel = `${manuell} — manuellt bedömd`;
      (träffPerRegel[nyckel] = träffPerRegel[nyckel] || []).push(`${t.id} f${i + 1}: ${q.q}`);
      if (!process.argv.includes('--dry')) q.type = manuell;
      return;
    }

    const regel = klassificera(q.q);
    if (!regel) {
      oklassificerade.push(`${t.id} fråga ${i + 1}: ${q.q}`);
      return;
    }
    const nyckel = `${regel.typ} — ${regel.namn}`;
    (träffPerRegel[nyckel] = träffPerRegel[nyckel] || []).push(`${t.id} f${i + 1}: ${q.q}`);
    if (!process.argv.includes('--dry')) q.type = regel.typ;
  });
});

console.log(`Frågor utan type: ${totalt}\n`);
Object.entries(träffPerRegel)
  .sort((a, b) => b[1].length - a[1].length)
  .forEach(([nyckel, träffar]) => {
    console.log(`${String(träffar.length).padStart(4)}  ${nyckel}`);
    träffar.slice(0, 2).forEach(x => console.log(`        · ${x.slice(0, 90)}`));
  });

console.log(`\nOklassificerade: ${oklassificerade.length}`);
oklassificerade.forEach(x => console.log(`  · ${x.slice(0, 110)}`));

if (process.argv.includes('--dry')) {
  console.log('\n(--dry: inget skrevs)');
} else {
  fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
  const kvar = totalt - oklassificerade.length;
  console.log(`\nSatte type på ${kvar} frågor. ${oklassificerade.length} lämnades orörda för manuell granskning.`);
}
