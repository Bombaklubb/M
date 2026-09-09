#!/usr/bin/env node
//
// Flyttar samtliga texter på nivå 1 till nivå 2.
//
// Nivå 1 var 40–60 ord med fullständiga satser. För en elev som just har
// knäckt läskoden är det inte första steget utan andra: femtio ord kräver att
// avkodningen redan går av sig själv. Nivån görs därför om till korta texter
// på 20–35 ord, och de gamla texterna flyttas upp ett steg.
//
// Nivå 2 rymmer efter flytten både dessa och de texter som redan låg där, och
// spänner därför över 40–90 ord. Det är ett bredare intervall än de övriga
// nivåerna, men skillnaden inom nivån är liten jämfört med steget upp till
// nivå 3 (150 ord).
//
// Texternas id ändras inte. Prefixet i biblioteket har aldrig följt nivån –
// ak5-tema-012 ligger på nivå 4 och ak1-sport-06 på nivå 2 – och att döpa om
// dem skulle bryta elevernas sparade listor över lästa texter.
//
// Kör med --dry för att se vad som skulle ändras utan att skriva.

const fs = require('fs');
const path = require('path');

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));
const dry = process.argv.includes('--dry');

const flyttas = lib.filter((t) => t.grade === 1);
const redanNiva2 = lib.filter((t) => t.grade === 2);

if (flyttas.length === 0) {
  console.error('Inga texter på nivå 1 – redan flyttade?');
  process.exit(1);
}

// Två texter med samma titel på samma nivå ser ut som en dubblett för eleven.
const titlarNiva2 = new Set(redanNiva2.map((t) => t.title.trim().toLowerCase()));
const krockar = flyttas.filter((t) => titlarNiva2.has(t.title.trim().toLowerCase()));
if (krockar.length) {
  console.error(`Titelkrock på nivå 2: ${krockar.map((t) => t.title).join(', ')}`);
  process.exit(1);
}

const ord = flyttas.map((t) => t.meta.wordCount);
console.log(
  `${flyttas.length} texter flyttas från nivå 1 till nivå 2 ` +
    `(${Math.min(...ord)}–${Math.max(...ord)} ord).`
);
console.log(`Nivå 2 hade ${redanNiva2.length} texter och får ${redanNiva2.length + flyttas.length}.`);

if (dry) {
  console.log('\n--dry: inget skrivet.');
  process.exit(0);
}

flyttas.forEach((t) => {
  t.grade = 2;
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n');
console.log('\nSkrivet. Nivå 1 är nu tom och fylls av lagg-till-niva1-texter.cjs.');
