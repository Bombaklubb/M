#!/usr/bin/env node
//
// De två sista texterna i gruppen som låg 15–25 % från sitt intervall.

const fs = require('fs');
const path = require('path');

const TILLAGG = {

'ak8-vetenskap-01': [
  { fore: 'Varför ökar resistensen?', text:
`Resistens är inget nytt fenomen. Redan Alexander Fleming, som upptäckte penicillinet, varnade i sin nobelföreläsning 1945 för att bakterier skulle kunna vänja sig vid medlet om det användes slarvigt. Att varningen kom samtidigt med genombrottet säger något om hur väl förloppet var förstått redan från början.` },
  { fore: 'Vad kan man göra?', text:
`Utvecklingen av nya antibiotika har samtidigt gått långsamt. De flesta antibiotika vi använder i dag bygger på upptäckter från mitten av 1900-talet. En förklaring är ekonomisk: ett läkemedel som ska användas i korta kurer och helst så sällan som möjligt är mindre lönsamt än ett som tas varje dag i decennier. Därför diskuteras nya sätt att finansiera forskningen.` },
],

'gy-uni-001': [
  { fore: 'Ett vanligt missförstånd är att modeller', text:
`Ett konkret exempel är kartan. En karta i skala ett till ett vore lika svår att använda som verkligheten själv, och just därför är förenklingen inte en brist utan hela poängen. Frågan är alltid vad som fått vara kvar, vad som strukits och vem som bestämt det.` },
  { fore: 'Till sist finns en normativ dimension', text:
`Modeller kan dessutom påverka det de beskriver. Om en prognos om smittspridning får människor att ändra sitt beteende blir prognosen fel, just för att den fungerade. Sådan återkoppling finns sällan i naturvetenskapen men är vanlig så snart människor ingår i systemet.` },
],
};

const BAND = { 7: [500, 530], 9: [570, 590] };
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
  const b = BAND[t.grade];
  const inom = n >= b[0] && n <= b[1];
  if (!inom) ok = false;
  console.log(`${id.padEnd(18)} åk${t.grade}  ${String(fore).padStart(4)} → ${String(n).padStart(4)} ord ${inom ? '✅' : '❌ krav ' + b[0] + '–' + b[1]}  ${t.title}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
if (!ok) process.exit(1);
