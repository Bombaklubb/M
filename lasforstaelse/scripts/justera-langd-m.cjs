#!/usr/bin/env node
//
// Nio åk 3-texter som låg 15–22 ord under intervallet 150–165.
// Ett par meningar läggs till i varje; grundtexten är orörd och frågorna
// gäller därför fortfarande.

const fs = require('fs');
const path = require('path');

// fore = stycket läggs in före denna sträng. Saknas fore läggs det sist.
const TILLAGG = {
  'ak3-tema-003': [{ fore: 'Samir tycker att det låter spännande', text:
`Maja berättar också att en engelsk vetenskapsman ska ha tänkt på samma sak när ett äpple föll i hans trädgård för länge sedan. Samir skrattar och säger att han kanske inte är först ändå.` }],

  'ak3-tema-024': [{ fore: 'Utan alla dessa personer', text:
`Under ett arbetspass kan fabriken göra tusentals kakor. Ändå kontrolleras varje låda innan den lastas, eftersom ett fel som slinker igenom kan hamna i en affär långt bort.` }],

  'ak3-tema-013': [{ fore: 'Nova valde en bok om rymden', text:
`Farah visade också var böckerna med stor stil stod. Den som tycker att bokstäverna är svåra att se kan låna samma berättelse i en annan utgåva.` }],

  'ak4-tema-003': [{ text:
`Sushi började som ett sätt att spara fisk. Man lade fisken i ris som jäste, så att den höll längre. Först långt senare blev riset något man också åt.` }],

  'ak1-historia-07': [{ fore: 'Det fanns också små griffeltavlor', text:
`Ännu längre tillbaka ristade människor tecken i sten och trä. Sådana tecken finns kvar på runstenar än i dag.` }],

  'ak3-tema-010': [{ text:
`Efteråt sprang Alex och Kim tillsammans in till omklädningsrummet. Alex verkade inte längre lika nervös som i början av träningen.` }],

  'ak4-tema-004': [{ fore: 'Hon uppträder på stora scener', text:
`Hon har också berättat att det inte alltid var lätt att växa upp med många som tittade på. Att bli känd tidigt betyder att man gör sina misstag inför andra.` }],

  'ak1-teknik-10': [{ fore: 'Teknik kan vara att bygga', text:
`Nästa dag kom en kompis och ville prova. Noura visade rampen och förklarade varför den behövdes.` }],

  'ak2-tema-004': [{ text:
`Snön gör också nytta. Ett tjockt lager snö håller värmen kvar i marken, så att växter och smådjur klarar kylan bättre.` }],
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
  const inom = n >= 150 && n <= 165;
  if (!inom) ok = false;
  console.log(`${id.padEnd(18)} ${String(fore).padStart(3)} → ${String(n).padStart(3)} ord ${inom ? '✅' : '❌ krav 150–165'}  ${t.title}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
if (!ok) process.exit(1);
