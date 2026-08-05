#!/usr/bin/env node
//
// Elva åk 5-texter som låg 18–26 ord under intervallet 300–320.
// Kör med --dry för att bara se ordräkningen utan att skriva.

const fs = require('fs');
const path = require('path');

const BAND = { 1:[40,60], 2:[65,90], 3:[150,165], 4:[200,220], 5:[300,320],
               6:[400,415], 7:[500,530], 8:[530,570], 9:[570,590], 10:[590,625] };

const TILLAGG = {
  'ak6-teknik-02': [{ text:
`Ett vanligt råd är att inte låta batteriet bli helt tomt varje gång. Litiumjonbatterier mår bäst av att ligga någonstans mitt emellan, och de flesta telefoner har i dag inställningar som bromsar laddningen vid åttio procent om man laddar över natten.` }],

  'ak6-tema-001': [{ fore: 'På vägen hem pratar Noor och morfar', text:
`Noor frågar hur lång tid en återställd våtmark behöver innan den fungerar. Morfar säger att växterna kommer tillbaka ganska snabbt, ofta inom några år, men att fåglar och insekter kan dröja längre. Vissa arter behöver en annan våtmark i närheten att flytta från.` }],

  'ak6-tema-011': [{ fore: 'Det viktigaste är ändå att Arsenal', text:
`Arsenal har också ett damlag med en lång historia. Det startade 1987 och har vunnit den engelska ligan fler gånger än något annat lag. Sedan matcherna började spelas på större arenor har publiksiffrorna vuxit kraftigt.` }],

  'ak6-tema-021': [{ fore: 'Texten visar att Elvis Presleys musik', text:
`Framgången hade också en baksida som ofta diskuteras i dag. Elvis tolkade musik som utvecklats av svarta artister, och i ett USA med segregation fick han utrymme i radio och tv som de sällan fick.` }],

  'ak7-tema-019': [{ fore: 'Att förstå ekonomi handlar inte bara om', text:
`Motsatsen till inflation finns också. När priserna sjunker under en längre tid kallas det deflation, och det låter först bra. Problemet är att människor då väntar med att köpa saker, eftersom de blir billigare imorgon.` }],

  'ak4-miljo-05': [{ fore: 'På vägen tillbaka sa Bilal', text:
`Läraren berättade att en plastpåse kan ligga kvar i naturen i flera hundra år. Den försvinner inte, den går bara sönder i allt mindre bitar. Sofia tänkte på hur många klasser som skulle gå förbi samma bäck under den tiden.` }],

  'ak7-etik-07': [{ fore: 'Nästa dag kom Noor fram', text:
`På kvällen låg Arvin vaken och undrade om han hade gjort rätt. Han hade inte sagt något till den som blivit omtalad. Kanske var det fegt att bara be alla sluta sprida. Kanske var det det enda han kunde göra.` }],

  'ak7-tema-018': [{ fore: 'Nästa dag i skolan såg Leo på Amir', text:
`En rad fastnade: att hjärnan byggs om under tonåren, och att det är därför saker som förut kändes självklara plötsligt kan kännas osäkra. Det hjälpte att veta att någon annan hade skrivit ner det.` }],

  'ak9-tema-010': [{ fore: 'Källkritiskt tänkande handlar också om', text:
`En tumregel är att fråga vad som skulle behöva vara sant för att påståendet ska falla. En vetenskaplig hypotes går att formulera så: om experimentet ger ett annat resultat är hypotesen fel. Ett pseudovetenskapligt påstående saknar ofta ett sådant svar.` }],

  'ak4-historia-03': [{ fore: 'När Aria läste upp sitt brev', text:
`Viktor skrev om en hund han inte hade men önskade sig. Bibliotekarien sa att det var precis så brev fungerar: man skriver lika mycket om det man saknar som om det man har.` }],

  'ak7-tema-001': [{ fore: 'Sammanfattningsvis är Melodifestivalen', text:
`Tävlingen har också blivit en exportvara. Formatet med deltävlingar och andra chansen har kopierats av flera länder, och svenska låtskrivare anlitas i dag av artister i hela Europa.` }],
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
