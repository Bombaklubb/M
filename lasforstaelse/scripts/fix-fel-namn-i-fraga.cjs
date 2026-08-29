#!/usr/bin/env node
//
// Fel namn i en fråga.
//
// I ak4-historia-03 heter personerna Aria och Viktor, men fråga 2 frågade
// efter "vad Maja förstod". Maja förekommer inte någonstans i texten. En elev
// som läser frågan noga letar då efter en person som inte finns, och den enda
// vägen till rätt svar går via att strunta i namnet – alltså precis tvärtemot
// vad en läsförståelsefråga ska belöna.
//
// Namnet kommer sannolikt från en tidigare version av texten. Hela
// biblioteket är genomsökt efter samma fel: personnamn i en frågetext som
// inte förekommer i texten. Det här var den enda träffen.
//
// Kör med --dry för att se ändringen utan att skriva.

const fs = require('fs');
const path = require('path');

const ID = 'ak4-historia-03';
const FRAGA = 1; // nollindexerad
const FRAN = 'Maja';
const TILL = 'Aria';

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

const text = lib.find((t) => t.id === ID);
if (!text) {
  console.error(`Hittar inte ${ID}.`);
  process.exit(1);
}

const fraga = text.questions[FRAGA];
if (!fraga || !fraga.q.includes(FRAN)) {
  console.error(`Fråga ${FRAGA + 1} i ${ID} innehåller inte "${FRAN}" – redan rättad?`);
  process.exit(1);
}

// Kontrollera att det nya namnet faktiskt står i texten, och att det gamla
// inte gör det. Utan den kontrollen kan skriptet byta ut ett korrekt namn.
if (!text.text.includes(TILL)) {
  console.error(`"${TILL}" finns inte i texten till ${ID}.`);
  process.exit(1);
}
if (text.text.includes(FRAN)) {
  console.error(`"${FRAN}" finns i texten till ${ID} – då är frågan inte fel.`);
  process.exit(1);
}

const nyFraga = fraga.q.split(FRAN).join(TILL);
console.log(`${ID} fråga ${FRAGA + 1}`);
console.log(`  före:  ${fraga.q}`);
console.log(`  efter: ${nyFraga}`);

if (process.argv.includes('--dry')) {
  console.log('\n--dry: inget skrivet.');
  process.exit(0);
}

fraga.q = nyFraga;
fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n');
console.log('\nSkrivet.');
