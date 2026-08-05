#!/usr/bin/env node
//
// Fem åk 9-texter som låg 59–83 ord under intervallet 570–590.
// Kör med --dry för att bara se ordräkningen utan att skriva.

const fs = require('fs');
const path = require('path');

const TILLAGG = {
  'ak8-musik-04': [{ fore: 'Det finns olika sätt att arbeta lagligt', text:
`Rättspraxis har svängt över tid. Under 1990-talet drev flera rättighetsinnehavare processer mot producenter som samplat utan tillstånd, och domarna blev ofta hårda. Effekten blev att skivbolagen började kräva att varje klipp skulle klareras i förväg, även om det bara rörde sig om ett par sekunder. Vissa album från 1980-talet, byggda på hundratals korta samplingar, hade knappast kunnat ges ut några år senare.

Ett alternativ som växte fram är interpolation: i stället för att använda originalinspelningen spelar man in melodin på nytt med egna musiker. Kompositionen måste fortfarande klareras, men inte inspelningen.` }],

  'gym-ai-skola-002': [{ fore: 'Därför bör skolans hållning vara tydlig', text:
`En fråga som ofta glöms bort är vad verktygen gör med lärarens arbete. Samma teknik som eleverna använder kan hjälpa till att ta fram övningsuppgifter eller variera texter i svårighetsgrad. Men om lärare låter ett verktyg formulera omdömen riskerar bedömningen att bli lika opersonlig som den elevtext man vill undvika.

Det finns också en jämlikhetsfråga i tillgången. De mest kapabla verktygen kostar pengar, och elever med betalversioner får bättre stöd än de som använder gratisvarianter. Ett verktyg som infördes för att jämna ut skillnader kan alltså skapa nya.` }],

  'gy-samhalle-03': [{ fore: 'På samhällsnivå diskuteras reglering', text:
`Det finns också forskning som nyanserar bilden. Studier av ungas mående visar sällan ett enkelt samband mellan skärmtid och psykisk ohälsa. Vad man gör verkar spela större roll än hur länge: att aktivt skriva med vänner ser ut att fungera annorlunda än att passivt scrolla genom främlingars flöden. Den som redan mår dåligt söker sig dessutom oftare till skärmen, vilket gör det svårt att avgöra vad som är orsak och vad som är följd.` }],

  'ak8-samhalle-02': [{ fore: 'Demokrati är alltså både ett system och en färdighet.', text:
`Demokrati finns också i former som inte är statliga. Fackföreningar, idrottsföreningar och bostadsrättsföreningar håller årsmöten, väljer styrelser och röstar om förslag. Många möter dessa former långt före sitt första riksdagsval, och det är där man i praktiken lär sig hur en dagordning fungerar, vad en votering är och hur det känns att bli nedröstad.

Just den erfarenheten är svårare än den låter. Att acceptera ett beslut man ogillar, och ändå fortsätta delta, är kanske demokratins mest krävande vana.` }],

  'ak6-natur-02': [{ fore: '"Morfar," sa Leila, "varför gillar du myren', text:
`Morfar berättade om en myr utanför staden där han växte upp. Den hade varit torrare och ljusare, men tystnaden var densamma.

"Mormor tyckte aldrig om myrar," sa han. "Hon sa att man aldrig vet var marken slutar."

Leila log. Hon hade hört mormor säga sådant förr, alltid som om hon egentligen tyckte att det var lite roligt. Det var första gången på länge som morfar sagt något om mormor utan att bli tyst efteråt.` }],
};

const dry = process.argv.includes('--dry');
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
  const inom = n >= 570 && n <= 590;
  if (!inom) ok = false;
  console.log(`${id.padEnd(18)} ${String(fore).padStart(3)} → ${String(n).padStart(3)} ord ${inom ? '✅' : '❌ krav 570–590'}  ${t.title.slice(0, 34)}`);
});

if (!dry) fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
else console.log('\n(dry run – inget skrivet)');
if (!ok) process.exit(1);
