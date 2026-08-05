#!/usr/bin/env node
//
// Tre texter saknade imageUrl och visades därför utan bild i biblioteket.
// Alla tre handlar om solsystemet, så de får samma bilder som de tre
// akgy-sol-texterna redan använder. URL:erna är återanvända med flit:
// Unsplash är blockerat från utvecklingsmiljön, så en ny URL går inte att
// kontrollera, medan dessa bevisligen levererar i biblioteket i dag.

const fs = require('fs');
const path = require('path');

const BILDER = {
  // Samma som akgy-sol-001 (Solsystemets bildning)
  'akgy-tema-010': 'https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=600&h=400&fit=crop',
  // Samma som ak5-tema-008 (Planeten Mars) – texten handlar om utforskning
  'akgy-tema-011': 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop',
  // Samma som akgy-sol-003 (Solsystemet i ett större perspektiv)
  'akgy-tema-012': 'https://images.unsplash.com/photo-1559599076-9c61d8e1b77c?w=600&h=400&fit=crop',
};

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

// Kontrollera att varje URL redan används av minst en annan text.
const anvanda = new Set(lib.map(t => t.imageUrl).filter(Boolean));

let ok = true;
Object.entries(BILDER).forEach(([id, url]) => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error('Hittar inte ' + id); ok = false; return; }
  if (!anvanda.has(url)) {
    console.error(`${id}: URL:en används inte av någon annan text – går inte att verifiera`);
    ok = false; return;
  }
  t.imageUrl = url;
  console.log(`${id.padEnd(16)} ✅  ${t.title}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');

const utan = lib.filter(t => !t.imageUrl);
console.log(`\nTexter utan bild kvar: ${utan.length}`);
if (!ok) process.exit(1);
