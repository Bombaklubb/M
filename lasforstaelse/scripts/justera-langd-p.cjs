#!/usr/bin/env node
//
// Tre åk 8-texter som låg 74–78 ord under intervallet 530–570.

const fs = require('fs');
const path = require('path');

const TILLAGG = {
  'ak6-samhalle-01': [{ text:
`Efter två veckor kom uppföljningen. Pilarna hade fungerat bättre än någon trott: kön vid disken rörde sig jämnare och färre krockade i dörren. Matvärdarna hade det svårare. Två av dem hade hoppat av efter första veckan, eftersom de kände sig som poliser mot sina egna kompisar.

Hawa sa att det var värdefull information i sig. "Vi vet nu att det inte är en dålig idé, men att den kräver att man är fler och byter ofta."

Sanna antecknade. Hon hade väntat sig att ett test antingen skulle lyckas eller misslyckas, och blev förvånad över att det kunde göra båda.` }],

  'ak6-samhalle-06': [{ fore: 'Kommunen samarbetar ofta med andra aktörer.', text:
`Kommunerna skiljer sig kraftigt åt. Sverige har knappt trehundra kommuner, och den största har fler än en miljon invånare medan den minsta har färre än tvåtusen. En liten kommun har samma uppgifter som en stor: skola, äldreomsorg, vatten och räddningstjänst. Det är en av anledningarna till att små kommuner ofta samarbetar med grannkommuner.

För att skillnaderna inte ska bli för stora finns ett utjämningssystem. Kommuner med högre inkomster betalar in, och kommuner med lägre får del av pengarna. Tanken är att en elev ska kunna räkna med ungefär samma skola oavsett var i landet hen bor.` }],

  'ak6-historia-12': [{ fore: 'Men handel har inte alltid varit rättvis.', text:
`Handeln förde med sig mer än varor. Sjukdomar följde samma vägar som människor och last. Digerdöden på 1300-talet spreds längs handelsvägar och till hamnstäder, och nådde Europa med fartyg som annars fraktade spannmål och tyg. Att en sjukdom kunde följa handeln är en påminnelse om att kontakt mellan platser alltid har haft två sidor.

Handeln drev också fram uppfinningar som vi sällan tänker på som uppfinningar. Mynt, växelkurser, kvitton och avtal om att betala senare växte fram för att göra det möjligt att handla med någon man inte kände. Utan sådana idéer hade långväga handel varit nästan omöjlig.` }],
};

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;
Object.entries(TILLAGG).forEach(([id, delar]) => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error('Hittar inte ' + id); ok = false; return; }
  const fore = t.text.trim().split(/\s+/).length;

  delar.forEach(d => {
    if (d.fore) {
      if (!t.text.includes(d.fore)) {
        console.error(`${id}: hittar inte ankaret "${d.fore.slice(0, 40)}…"`); ok = false; return;
      }
      t.text = t.text.replace(d.fore, d.text + '\n\n' + d.fore);
    } else {
      t.text = t.text.trimEnd() + '\n\n' + d.text;
    }
  });

  const n = t.text.trim().split(/\s+/).length;
  t.meta = { ...(t.meta || {}), wordCount: n };
  const inom = n >= 530 && n <= 570;
  if (!inom) ok = false;
  console.log(`${id.padEnd(18)} ${String(fore).padStart(3)} → ${String(n).padStart(3)} ord ${inom ? '✅' : '❌ krav 530–570'}  ${t.title.slice(0, 38)}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
if (!ok) process.exit(1);
