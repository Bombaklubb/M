#!/usr/bin/env node
//
// De sex sista texterna i åk 1 och åk 9: fem utökas, en kortas.
// Kör med --dry för att bara se ordräkningen utan att skriva.

const fs = require('fs');
const path = require('path');

const BAND = { 1:[40,60], 2:[65,90], 3:[150,165], 4:[200,220], 5:[300,320],
               6:[400,415], 7:[500,530], 8:[530,570], 9:[570,590], 10:[590,625] };

const TILLAGG = {
  'ak1-tema-016': [{ text:
`Ella tittar efter den en stund. Sedan går hon in och äter frukost.` }],

  'gy-teknik-02': [{ fore: 'Att förstå AI handlar alltså inte bara om teknik', text:
`Det finns också en miljöfråga. Att träna en stor modell kräver mycket el, och varje fråga du ställer kostar energi i ett datacenter någonstans. Mängden är liten per fråga men stor i summa, och kylningen kräver dessutom vatten.` }],

  'gym-berattelse-val-004': [{ fore: 'På rasten gick Lea ut i korridoren', text:
`Hon skrev ner invändningen på en post-it och satte den på skärmkanten. Det kändes barnsligt, men den satt kvar hela dagen och gjorde varje mening lite långsammare att skriva.` }],

  'ak7-vanskap-01': [{ fore: 'När de gick hem senare', text:
`Amina tänkte att hon nog hade gjort samma sak själv någon gång: sett en fråga glida förbi och tänkt att någon annan skulle svara. Det var en obehaglig tanke.` }],

  'ak6-teknik-04': [{ fore: 'På vägen ut sa Noor', text:
`Frida bad dem också skriva ner vad som hade gått fel. När listan var klar såg Mateo att nästan alla fel hade varit hans egna antaganden, inte hårdvaran.` }],
};

const STRYK = {
  'ak6-sport-13': [
    ' Hon mindes fortfarande hur några i klassen hade skrattat och sagt att hon "alltid överdriver".',
    ' Zahra ville säga något uppmuntrande men vågade inte mitt i andningen.',
  ],
};

const NYCKELORD = {
  'ak6-sport-13': ['springa fyra varv', 'bra på bollspel', 'Kortare steg kan hjälpa', 'hitta ett tempo som går att hålla', 'axlar hade börjat åka upp mot öronen', 'vågade prova en ny strategi'],
};

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

const rapportera = (id, t, fore) => {
  const [min, max] = BAND[t.grade];
  const n = t.text.trim().split(/\s+/).length;
  t.meta = { ...(t.meta || {}), wordCount: n };
  const inom = n >= min && n <= max;
  console.log(`${id.padEnd(24)} åk${String(t.grade).padStart(2)}  ${String(fore).padStart(3)} → ${String(n).padStart(3)} ord ${inom ? '✅' : `❌ krav ${min}–${max}`}`);
  return inom;
};

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
  if (!rapportera(id, t, fore)) ok = false;
});

Object.keys(STRYK).forEach(id => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error('Hittar inte ' + id); ok = false; return; }
  const fore = t.text.trim().split(/\s+/).length;
  STRYK[id].forEach(s => {
    if (!t.text.includes(s)) { console.error(`${id}: hittar inte "${s.trim().slice(0, 45)}…"`); ok = false; return; }
    t.text = t.text.replace(s, '');
  });
  const saknas = (NYCKELORD[id] || []).filter(o => !t.text.toLowerCase().includes(o.toLowerCase()));
  if (saknas.length) { console.error(`${id}: nyckelord borta – ${saknas.join(', ')}`); ok = false; return; }
  if (!rapportera(id, t, fore)) ok = false;
});

if (!dry) fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
else console.log('\n(dry run – inget skrivet)');
if (!ok) process.exit(1);
