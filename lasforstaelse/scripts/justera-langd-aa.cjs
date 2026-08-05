#!/usr/bin/env node
//
// De tolv sista åk 5-texterna, som låg 2–18 ord under intervallet 300–320.
// Kör med --dry för att bara se ordräkningen utan att skriva.

const fs = require('fs');
const path = require('path');

const BAND = { 1:[40,60], 2:[65,90], 3:[150,165], 4:[200,220], 5:[300,320],
               6:[400,415], 7:[500,530], 8:[530,570], 9:[570,590], 10:[590,625] };

const TILLAGG = {
  'ak7-tema-020': [{ fore: 'Det finns inget facit.', text:
`Ett tredje svar är att rättvisa handlar om själva processen. Om reglerna är kända i förväg, gäller alla lika och går att överklaga, kan även ett resultat man ogillar accepteras.` }],

  'ak9-tema-006': [{ fore: 'Slutligen lyfte läraren', text:
`En elev påpekade att förändringen inte bara är teknisk. När fler arbetar hemifrån eller på korta uppdrag påverkas också sådant som gemenskap på jobbet, fackligt medlemskap och möjligheten att lära sig av äldre kollegor.` }],

  'ak7-tema-016': [{ fore: 'Det är lätt att tro att man är ensam', text:
`Sömnen är ofta den första som påverkas. När man är stressad kan det ta längre tid att somna, och sömnbrist gör i sin tur att man tål stress sämre.` }],

  'ak9-tema-008': [{ fore: 'Texten handlar i grunden om', text:
`Avstånd spelar också in. Ett paket som körs till en adress på landsbygden kostar mer att leverera än ett i staden, och när frakten inte täcker kostnaden får orten sämre villkor.` }],

  'ak4-historia-04': [{ fore: 'Det är viktigt att komma ihåg att historien', text:
`Sjukdomar var också en större del av barndomen. Innan vacciner och antibiotika blev vanliga kunde en vanlig infektion bli allvarlig, och nästan varje familj hade förlorat ett barn eller ett syskon.` }],

  'ak7-tema-017': [{ fore: 'Det handlar inte om att misstro allt', text:
`Ett enkelt knep är att lägga märke till vad som saknas. En artikel om en konflikt nämner inte alltid vad den andra sidan säger.` }],

  'ak8-tema-005': [{ fore: 'Texten visar också att mänskliga rättigheter', text:
`Språket är svårast att hålla kvar. Zilan förstår kurdiska bra men svarar oftast på svenska, och märker att orden för känslor sitter olika djupt i de två språken.` }],

  'ak6-tema-025': [{ fore: 'Texten visar att tekniken bakom musiken', text:
`Den som lyssnar i dag kan höra skillnaden. Sun-inspelningarna låter smalare men närmare, medan de senare skivorna låter bredare och mer polerade.` }],

  'ak9-tema-007': [{ fore: 'Texten ger inga enkla svar', text:
`Ett mellansteg som prövas är att kräva att en människa fattar det slutliga beslutet. Kritiken är att människor tenderar att lita på förslaget ändå.` }],

  'ak6-tema-022': [{ fore: 'Texten visar att Elvis resa', text:
`Berömmelsen hade ett pris. Elvis kunde inte gå ut utan att bli igenkänd, och hans mamma Gladys oroade sig för vad det gjorde med honom.` }],

  'ak6-tema-023': [{ fore: 'Texten visar att Elvis inte bara var en sångare', text:
`Efter hans död 1977 fortsatte försäljningen. Elvis hem Graceland öppnades för besökare och blev en av USA:s mest besökta privatbostäder.` }],

  'ak6-miljo-02': [{ text:
`Det viktigaste är kanske att plast inte är dålig i sig. Problemet är hur vi använder den.` }],
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
    if (d.fore) {
      if (!t.text.includes(d.fore)) { console.error(`${id}: hittar inte ankaret "${d.fore.slice(0, 40)}…"`); ok = false; return; }
      t.text = t.text.replace(d.fore, d.text + '\n\n' + d.fore);
    } else {
      t.text = t.text.trimEnd() + '\n\n' + d.text;
    }
  });

  const [min, max] = BAND[t.grade];
  const n = t.text.trim().split(/\s+/).length;
  t.meta = { ...(t.meta || {}), wordCount: n };
  const inom = n >= min && n <= max;
  if (!inom) ok = false;
  console.log(`${id.padEnd(18)} åk${String(t.grade).padStart(2)}  ${String(fore).padStart(3)} → ${String(n).padStart(3)} ord ${inom ? '✅' : `❌ krav ${min}–${max}`}`);
});

if (!dry) fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
else console.log('\n(dry run – inget skrivet)');
if (!ok) process.exit(1);
