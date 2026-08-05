#!/usr/bin/env node
//
// Omskrivning av distraktorer med påklistrade mallfraser, sats D av fyra –
// de sista tjugofem. Se fix-mallfraser-a.cjs för bakgrunden.
//
// Kör med --dry för att se ändringarna utan att skriva.

const fs = require('fs');
const path = require('path');

const OMSKRIVNINGAR = [
  ['ak9-tema-009', 2, 0,
   'Att priset på telefoner sjunker av en slump',
   'Att priset på telefoner sjunker snabbt'],

  ['ak9-tema-009', 3, 2,
   'Att internet bör förbjudas, för att det hade fungerat förut',
   'Att internet bör förbjudas för alla under arton år'],

  ['ak9-tema-014', 5, 2,
   'Att drömmar blir svagare ju mer man läser historia för säkerhets skull',
   'Att drömmar blir svagare ju mer man läser om historia'],

  ['gy-samhalle-03', 3, 1,
   'För att alla plattformar är statliga, för att slippa problem senare',
   'För att alla plattformar ägs och styrs av staten i dag'],

  ['gy-uni-001', 0, 2,
   'Att den beskriver verkligheten i alla detaljer oavsett vad andra tyckte',
   'Att den beskriver verkligheten i alla sina detaljer utan förenkling'],

  ['gy-uni-001', 1, 3,
   'Att osäkerhet kan elimineras genom standardvärden på exakt samma sätt som förut',
   'Att osäkerhet kan elimineras helt genom att välja bra standardvärden'],

  ['gy-uni-002', 4, 2,
   'Att parker bara behövs i ytterområden, för att slippa problem senare',
   'Att parker bara behövs i ytterområden, eftersom marken där ändå är billig'],

  ['gy-uni-002', 5, 3,
   'Enbart invånarnas preferenser före byggstart utan någon som helst förändring',
   'Enbart invånarnas preferenser insamlade före byggstart genom en enkätundersökning'],

  ['gy-uni-004', 2, 0,
   'Att människor inte kan kombinera flera jobb på exakt samma sätt som förut',
   'Att människor inte längre kan kombinera flera olika jobb'],

  ['gy-uni-004', 4, 3,
   'För att plattformsarbete är identiskt med traditionellt arbete men bara under vissa förutsättningar',
   'För att plattformsarbete i praktiken är identiskt med traditionell anställning i alla avseenden'],

  ['gy-uni-005', 2, 1,
   'Att kontroll alltid ligger hos den drabbade personen redan innan något annat hände',
   'Att kontroll alltid ligger hos den person som till sist drabbas av beslutet'],

  ['gy-vetenskap-01', 3, 1,
   'För att signifikans betyder att effekten är stor, för att undvika missförstånd',
   'För att signifikans alltid betyder att effekten också är stor'],

  ['gym-ai-skola-002', 1, 1,
   'Genom att lärare slipper undervisa om skrivande i onödan men bara om det behövdes',
   'Genom att lärare slipper undervisa om skrivande och kan lägga tiden på annat'],

  ['gym-ai-skola-002', 2, 2,
   'Att verktyget kan visa elevens känslor kring uppgiften utan att det fick några konsekvenser',
   'Att verktyget kan avläsa elevens känslor kring uppgiften och anpassa svaren efter dem'],

  ['gym-ai-skola-002', 4, 0,
   'Fri användning utan regler, eftersom ansvar alltid ligger på individen redan innan något annat hände',
   'Fri användning utan regler, eftersom ansvaret för lärandet alltid ligger hos den enskilda eleven'],

  ['gym-berattelse-val-004', 1, 1,
   'Att staden är farlig för fotgängare men bara under vissa förutsättningar',
   'Att staden är farlig för fotgängare vid stora korsningar'],

  ['gym-berattelse-val-004', 2, 3,
   'Hon slutar använda källor och skriver bara från minnet, för att undvika missförstånd',
   'Hon slutar använda källor helt och skriver uppsatsen bara utifrån sitt eget minne'],

  ['gym-kallkritik-001', 1, 2,
   'För att primärkällor aldrig går att lita på, för att undvika missförstånd',
   'För att primärkällor aldrig går att lita på när de har några år på nacken'],

  ['gym-kallkritik-001', 3, 1,
   'Spridning säger inget alls om kvaliteten och kan ignoreras, för att slippa problem senare',
   'Spridning säger inget alls om kvaliteten och kan därför ignoreras helt'],

  ['gym-stad-transport-003', 0, 2,
   'Att bevisa att ett transportsätt alltid är bäst, för att undvika missförstånd',
   'Att bevisa att ett visst transportsätt alltid är bäst i staden'],

  ['gym-stad-transport-003', 4, 1,
   'Att alla platser blir lika nära om man vill redan innan något annat hände',
   'Att alla platser blir lika nära om man bara vill tillräckligt mycket'],

  ['gym-stress-studievanor-005', 0, 1,
   'För att motivation är medfödd och oföränderlig och ingenting annat',
   'För att motivation är medfödd och därför inte går att påverka alls'],

  ['gym-stress-studievanor-005', 1, 0,
   'För att ord aldrig kan läras in genom läsning men bara under vissa förutsättningar',
   'För att ord aldrig kan läras in enbart genom att läsa dem tyst'],

  ['gym-stress-studievanor-005', 4, 2,
   'Hjälpsam planering fungerar bara för extroverta, medan fällan drabbar introverta under hela den perioden',
   'Hjälpsam planering fungerar bara för vissa personligheter, medan fällan drabbar alla de andra'],

  ['ak8-tema-019', 5, 0,
   'Att allt kulturutbyte bör undvikas för säkerhets skull',
   'Att allt kulturutbyte mellan grupper bör undvikas'],
];

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;
const berorda = [];

OMSKRIVNINGAR.forEach(([id, qi, oi, fran, till]) => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error(`Hittar inte ${id}`); ok = false; return; }
  const q = (t.questions || [])[qi];
  if (!q) { console.error(`${id}: ingen fråga på plats ${qi}`); ok = false; return; }
  if (q.options[oi] !== fran) {
    console.error(`${id} f${qi + 1} ${'ABCD'[oi]}: förväntade\n   "${fran}"\n   men fann\n   "${q.options[oi]}"`);
    ok = false; return;
  }
  if (oi === q.correct) { console.error(`${id} f${qi + 1}: ${'ABCD'[oi]} är rätt svar, rörs inte`); ok = false; return; }
  q.options[oi] = till;
  berorda.push({ id, qi });
  console.log(`${id} f${qi + 1} ${'ABCD'[oi]}  (${fran.length} → ${till.length} tecken)`);
});

console.log();
const sedda = new Set();
berorda.forEach(({ id, qi }) => {
  const nyckel = `${id}:${qi}`;
  if (sedda.has(nyckel)) return;
  sedda.add(nyckel);
  const q = lib.find(x => x.id === id).questions[qi];
  const l = q.options.map(o => o.length);
  const ratt = l[q.correct];
  const ovriga = l.filter((_, i) => i !== q.correct);
  const motLangsta = ratt / Math.max(...ovriga);
  const motKortaste = Math.min(...ovriga) / ratt;
  if (motLangsta >= 1.6) { console.error(`${id} f${qi + 1}: rätt svar ${motLangsta.toFixed(2)}× längsta distraktorn`); ok = false; }
  if (motKortaste >= 1.6) { console.error(`${id} f${qi + 1}: rätt svar ${motKortaste.toFixed(2)}× kortare än kortaste`); ok = false; }
});
if (ok) console.log(`${sedda.size} frågor kontrollerade – inget rätt svar går att peka ut på längden`);

if (!dry) fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
else console.log('\n(dry run – inget skrivet)');
if (!ok) process.exit(1);
