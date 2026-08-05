#!/usr/bin/env node
//
// De tre sista åk 8-texterna som låg 62–69 ord under intervallet 530–570.

const fs = require('fs');
const path = require('path');

const TILLAGG = {
  'ak6-vetenskap-11': [{ fore: 'Vacciner kan ge biverkningar', text:
`Innan ett vaccin får användas testas det i flera steg. Först undersöks det i laboratorier, sedan på en liten grupp frivilliga och därefter på allt större grupper. I de största studierna kan tiotusentals personer delta, och hälften får ofta ett overksamt preparat utan att veta om det. På så sätt går det att se om skillnaderna mellan grupperna beror på vaccinet eller på slumpen.

Även efter godkännandet fortsätter uppföljningen, eftersom mycket sällsynta effekter bara syns när miljoner människor har vaccinerats.` }],

  'gym-stad-transport-003': [{ fore: 'När man ser staden så här', text:
`Helgen bryter mönstret. Då försvinner rusningstopparna och ersätts av en jämnare ström som börjar senare på dagen. Bussarna går glesare, vilket märks mest för dem som inte har något alternativ: den som har bil kan välja tid, medan den som väntar på en avgång får anpassa hela sitt ärende efter tidtabellen.

Så blir tidtabellen ett slags osynlig gräns. Den avgör vilka platser i staden som är verkligt tillgängliga för alla och vilka som i praktiken kräver att man äger ett fordon.` }],

  'gym-kallkritik-001': [{ fore: 'Ett praktiskt sätt att arbeta källkritiskt är att jämföra.', text:
`Bilder och ljud kräver numera samma vaksamhet som text. Ett fotografi kan vara äkta men taget vid ett helt annat tillfälle än rubriken påstår, och material som skapats av AI kan se övertygande ut vid en snabb blick.

Ett enkelt sätt att komma vidare är att söka på bilden i stället för på orden, för att se var den har publicerats tidigare. Ofta räcker det för att avgöra om en bild verkligen visar det som påstås.` }],
};

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;
Object.entries(TILLAGG).forEach(([id, delar]) => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error('Hittar inte ' + id); ok = false; return; }
  const fore = t.text.trim().split(/\s+/).length;

  delar.forEach(d => {
    if (!t.text.includes(d.fore)) {
      console.error(`${id}: hittar inte ankaret "${d.fore.slice(0, 40)}…"`); ok = false; return;
    }
    t.text = t.text.replace(d.fore, d.text + '\n\n' + d.fore);
  });

  const n = t.text.trim().split(/\s+/).length;
  t.meta = { ...(t.meta || {}), wordCount: n };
  const inom = n >= 530 && n <= 570;
  if (!inom) ok = false;
  console.log(`${id.padEnd(24)} ${String(fore).padStart(3)} → ${String(n).padStart(3)} ord ${inom ? '✅' : '❌ krav 530–570'}  ${t.title.slice(0, 34)}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
if (!ok) process.exit(1);
