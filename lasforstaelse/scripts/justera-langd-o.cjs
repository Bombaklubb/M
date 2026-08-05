#!/usr/bin/env node
//
// Tre åk 7-texter som låg 57–60 ord under intervallet 500–530.

const fs = require('fs');
const path = require('path');

const TILLAGG = {
  'ak7-musik-05': [{ fore: 'Kenji log. Beatet i korridoren', text:
`De bokade musiksalen på torsdagar. Första övningen gick sönder efter tre takter, för Yara kom in för tidigt och Kenji stannade programmet varje gång något lät fel.

"Vi kan inte stanna varje gång", sa Yara till slut. "Då hör vi aldrig hur den låter hel."

Kenji tvekade, men lät den rulla. Låten var full av misstag. Den var också, för första gången, en låt.` }],

  'ak6-miljo-09': [{ fore: 'Vad kan vi göra?', text:
`Hur länge plasten finns kvar beror på sorten. En plastflaska kan ligga i naturen i hundratals år, medan tunna påsar bryts sönder snabbare men just därför blir till mikroplast fortare. Att något försvinner ur synfältet betyder alltså inte att det är borta.

Ett mönster som ofta nämns är att en stor del av plasten i havet kommer från ett fåtal stora floder. Det gör problemet mer möjligt att angripa än det först verkar: bättre avfallshantering i några områden kan ge stor effekt.` }],

  'ak5-vanskap-02': [{ fore: 'Siri kände att vänskap ibland handlar', text:
`Regeln höll inte hela terminen. Ibland slank en suck ur någon, och då tittade Ali på Siri utan att säga något. Det räckte oftast.

Efter jullovet stod en ny elev vid staketet och tittade på spelet. Det var Ali som gick fram och frågade. Siri såg det på håll och kände något varmt i bröstet, av ett slag hon inte hade väntat sig: att det hon gjort en gång hade fortsatt utan henne.` }],
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
  const inom = n >= 500 && n <= 530;
  if (!inom) ok = false;
  console.log(`${id.padEnd(16)} ${String(fore).padStart(3)} → ${String(n).padStart(3)} ord ${inom ? '✅' : '❌ krav 500–530'}  ${t.title.slice(0, 40)}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
if (!ok) process.exit(1);
