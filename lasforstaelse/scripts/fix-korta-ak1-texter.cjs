#!/usr/bin/env node
//
// Fyra texter i åk 1 låg på 26–30 ord mot intervallet 40–60. De byggs ut.
//
// ak1-001 hade dessutom punkt mitt i två meningar ("Maja bor hos. Lisa.") och
// ak1-tema-020 saknade kommatecken i en uppräkning. Båda är rättade, eftersom
// en text för nybörjarläsare inte kan ha meningar som bryts på fel ställe.

const fs = require('fs');
const path = require('path');

const NYA = {
  'ak1-tema-032': `Milo går ut från huset. På trappan sitter en liten katt. Katten är svart med vita tassar. Milo sätter sig lugnt bredvid. Katten tittar på honom och jamar mjukt. Sedan lägger den sig i solen på det översta trappsteget. Milo blir sittande tills mamma ropar.`,

  'ak1-tema-023': `Ali sitter i klassrummet och läser en bok. Boken handlar om rymden. Där finns bilder på planeter och stjärnor. Ali visar en stor planet för sin vän Sara. Sara frågar vad den heter. Ali bläddrar tillbaka och läser: Jupiter. De tittar länge på bilden.`,

  'ak1-001': `Maja är en katt. Hon är svart och vit. Maja bor hos Lisa. Varje dag leker de tillsammans. Maja gillar att jaga bollar över golvet. Lisa ger Maja mat på morgonen och på kvällen. Efter maten sover Maja i fönstret. Maja är glad.`,

  'ak1-tema-020': `Leo och hans mormor åker tåg till en annan stad. De sitter vid fönstret och ser träd, hus och sjöar. Tåget går snabbt. Leo räknar många röda hus på vägen. Mormor har med sig smörgåsar i en påse. När de kommer fram har Leo räknat till tjugotvå.`,
};

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;
Object.entries(NYA).forEach(([id, text]) => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error('Hittar inte ' + id); ok = false; return; }
  t.text = text;
  const n = text.trim().split(/\s+/).length;
  t.meta = { ...(t.meta || {}), wordCount: n };
  const inom = n >= 40 && n <= 60;
  if (!inom) ok = false;
  console.log(`${id.padEnd(14)} ${String(n).padStart(3)} ord ${inom ? '✅' : '❌ krav 40–60'}  ${t.title}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
if (!ok) process.exit(1);
