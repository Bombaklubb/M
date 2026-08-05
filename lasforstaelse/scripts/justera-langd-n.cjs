#!/usr/bin/env node
//
// Fem åk 5-texter som låg 33–38 ord under intervallet 300–320.

const fs = require('fs');
const path = require('path');

const TILLAGG = {
  'ak7-sport-05': [{ text:
`Efteråt satte hon sig i gräset och fick låna Majas vattenflaska. De pratade om tempot, om hur olika det kändes på första och sista varvet. Zahra insåg att hon aldrig hade pratat med Maja om något annat än skolarbete förut.` }],

  'ak9-gpt-004': [{ text:
`Nästa dag läste vi att den som sprider en falsk bild sällan behöver övertyga någon på riktigt. Det räcker att så tvivel, för då blir även äkta bilder ifrågasatta. En journalist kallade det för lögnarens fördel: när allt kan vara påhittat kan den som blir avslöjad påstå att beviset är förfalskat.` }],

  'ak9-gpt-005': [{ fore: 'Det slog mig att globala utmaningar', text:
`Jag tänkte på att grannen och jag ville samma sak: att veta hur nästa år ser ut. Skillnaden var vilken sorts osäkerhet vi bar på. Min handlade om hur världen ska se ut när jag är vuxen, hans om vilken månad beskedet kommer.` }],

  'ak8-tema-004': [{ fore: 'En del politiska rörelser har drivit frågan', text:
`Ett återkommande exempel är folkomröstningen 2017, där en stor majoritet i regionen röstade för självständighet. Resultatet erkändes inte av Bagdad och möttes av motstånd från flera grannländer, och området förlorade kort därefter kontrollen över omtvistade områden. Händelsen används i dag som argument av båda sidor.` }],

  'ak8-tema-015': [{ text:
`Han visste inte om frågan var djup eller bara krånglig. Kanske var det skillnaden mellan filosofi och ordlekar: en fråga som ändrar hur man ser på något, i stället för en som bara låter svår. Han lät sidan ligga uppslagen och släckte lampan.` }],
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
  const inom = n >= 300 && n <= 320;
  if (!inom) ok = false;
  console.log(`${id.padEnd(16)} ${String(fore).padStart(3)} → ${String(n).padStart(3)} ord ${inom ? '✅' : '❌ krav 300–320'}  ${t.title}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
if (!ok) process.exit(1);
