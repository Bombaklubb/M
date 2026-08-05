#!/usr/bin/env node
//
// Fyra fel som hittades vid granskning av facit.
//
// Två åk 1-texter har punkter insprängda mitt i meningar, så att de börjar
// med obegripliga enordsmeningar. Det är de yngsta läsarna som drabbas, och
// texterna är bara fyrtio ord långa – felet utgör en tiondel av texten.
//
// En fråga pekar ut en person som inte finns i texten som rätt svar, vilket
// gör att alla elever får fel oavsett vad de svarar.
//
// En fråga har ett grammatikfel i det rätta svaret.
//
// Kör med --dry för att se ändringarna utan att skriva.

const fs = require('fs');
const path = require('path');

// Felplacerade punkter. Ordantalet påverkas inte, bara meningsindelningen.
const TEXTRATTELSER = [
  ['ak2-gpt-001', 'Katten. Maja bor hos. Leo.', 'Katten Maja bor hos Leo.'],
  ['ak2-gpt-005', 'Storasyster. Lina packar handdukar.', 'Storasyster Lina packar handdukar.'],
  ['ak2-gpt-005', 'Lillebror. Max tar sina armpuffar.', 'Lillebror Max tar sina armpuffar.'],
  ['ak2-gpt-005', 'I vattnet tränar. Lina ryggsim.', 'I vattnet tränar Lina ryggsim.'],
];

// Frågan frågade vem som följer med eleverna ut, och pekade ut "Said" som rätt
// svar. Ingen sådan person finns i texten, och ingen vuxen följer med – Rania
// och Mateo går själva. Frågan går alltså inte att svara rätt på. Den ersätts
// av en fråga som texten faktiskt besvarar, med samma rätt-index så att
// svarsfördelningen i biblioteket är oförändrad.
const NY_FRAGA = {
  id: 'ak6-historia-03',
  index: 2,
  kontroll: 'Vem följer med eleverna',
  fraga: {
    type: 'literal',
    q: 'Vem upptäcker det inhuggna märket på stenen?',
    options: ['Rania', 'Hugo', 'Mateo', 'Parisa'],
    correct: 0,
  },
};

// Grammatikfel i det rätta svaret.
const SVARSRATTELSER = [
  ['ak9-tema-007', 2, 'Det missgynnande kvinnliga sökande', 'Det missgynnade kvinnliga sökande'],
];

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;

TEXTRATTELSER.forEach(([id, fran, till]) => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error(`Hittar inte ${id}`); ok = false; return; }
  if (!t.text.includes(fran)) {
    console.error(`${id}: hittar inte "${fran}"`); ok = false; return;
  }
  const foreOrd = t.text.trim().split(/\s+/).length;
  t.text = t.text.replace(fran, till);
  const efterOrd = t.text.trim().split(/\s+/).length;
  if (foreOrd !== efterOrd) {
    console.error(`${id}: ordantalet ändrades ${foreOrd} → ${efterOrd}`); ok = false; return;
  }
  console.log(`${id.padEnd(14)} "${fran}" → "${till}"`);
});

const mal = lib.find(x => x.id === NY_FRAGA.id);
const gammal = mal && mal.questions[NY_FRAGA.index];
if (!gammal || !gammal.q.includes(NY_FRAGA.kontroll)) {
  console.error(`${NY_FRAGA.id}: förväntade frågan om vem som följer med på plats ${NY_FRAGA.index}`);
  ok = false;
} else if (gammal.correct !== NY_FRAGA.fraga.correct) {
  console.error(`${NY_FRAGA.id}: rätt-index skiljer sig, svarsfördelningen skulle ändras`);
  ok = false;
} else {
  // Alla fyra namn i den nya frågan måste finnas i texten.
  const saknas = NY_FRAGA.fraga.options.filter(o => !mal.text.includes(o));
  if (saknas.length) {
    console.error(`${NY_FRAGA.id}: namn saknas i texten – ${saknas.join(', ')}`); ok = false;
  } else {
    mal.questions[NY_FRAGA.index] = NY_FRAGA.fraga;
    console.log(`\n${NY_FRAGA.id} f${NY_FRAGA.index + 1} bytt`);
    console.log(`   gammal: ${gammal.q}  (rätt svar "Said" finns inte i texten)`);
    console.log(`   ny:     ${NY_FRAGA.fraga.q}`);
  }
}

SVARSRATTELSER.forEach(([id, index, fran, till]) => {
  const t = lib.find(x => x.id === id);
  const q = t && t.questions[index];
  if (!q) { console.error(`${id}: ingen fråga på plats ${index}`); ok = false; return; }
  const i = q.options.indexOf(fran);
  if (i === -1) { console.error(`${id} f${index + 1}: hittar inte "${fran}"`); ok = false; return; }
  q.options[i] = till;
  console.log(`\n${id} f${index + 1}: "${fran}" → "${till}"`);
});

if (!dry) fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
else console.log('\n(dry run – inget skrivet)');
if (!ok) process.exit(1);
