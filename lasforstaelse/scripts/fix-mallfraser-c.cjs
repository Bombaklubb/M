#!/usr/bin/env node
//
// Omskrivning av distraktorer med påklistrade mallfraser, sats C av fyra.
// Se fix-mallfraser-a.cjs för bakgrunden.
//
// Kör med --dry för att se ändringarna utan att skriva.

const fs = require('fs');
const path = require('path');

const OMSKRIVNINGAR = [
  ['ak6-tema-007', 1, 2,
   'För att hjärnan stänger av smaklökarna av en slump',
   'För att hjärnan stänger av smaklökarna när man är sjuk'],

  ['ak6-vanskap-01', 4, 0,
   'För att han säger åt henne att sluta, för att slippa problem senare',
   'För att han säger åt henne att sluta försöka med det svåra'],

  ['ak6-vetenskap-04', 3, 1,
   'För att läraren vill ha fler läxor, för att det skulle gå snabbare',
   'För att läraren vill att alla i klassen ska få varsitt prov'],

  ['ak6-vetenskap-05', 4, 2,
   'För att Valentina målade fenorna röda, för att det hade fungerat förut',
   'För att Valentina målade fenorna röda och färgen gjorde dem tyngre'],

  ['ak6-vetenskap-11', 3, 3,
   'För att man alltid har mer vitaminer då, för att undvika missförstånd',
   'För att man alltid har mer vitaminer i kroppen andra gången'],

  ['ak7-teknik-02', 4, 1,
   'För att de bara fungerar på tisdagar, för att undvika missförstånd',
   'För att de bara fungerar när många använder appen samtidigt'],

  ['ak7-teknik-04', 3, 0,
   'För att de bara visas för vuxna utan att det fick några konsekvenser',
   'För att de bara visas för vuxna som redan följer många konton'],

  ['ak7-tema-012', 5, 0,
   'Att det finns bara en korrekt tolkning som alla måste följa redan innan något annat hände',
   'Att det bara finns en korrekt tolkning, och att de andra läsarna har missförstått texten'],

  ['ak7-tema-015', 0, 3,
   'Att det viktigaste med fandom är att vinna diskussioner om detaljer men bara under vissa förutsättningar',
   'Att det viktigaste med fandom är att vinna diskussioner om detaljer och veta mest av alla i gruppen'],

  ['ak7-tema-015', 4, 1,
   'Att fan-grupper alltid ersätter skolarbete med rollspel på lektionstid av en slump',
   'Att fan-grupper alltid ersätter skolarbetet med rollspel under lektionstid'],

  ['ak7-vetenskap-06', 2, 2,
   'För att göra experimentet roligare för säkerhets skull',
   'För att göra experimentet roligare för dem som deltar'],

  ['ak7-vetenskap-06', 3, 2,
   'För att läraren kräver det utan anledning för säkerhets skull',
   'För att läraren kräver att varje försök skrivs ner i häftet'],

  ['ak7-vetenskap-06', 5, 3,
   'För att kontrollgrupper är onödiga utan att det fick några konsekvenser',
   'För att kontrollgrupper är onödiga när man bara testar en sak'],

  ['ak8-tema-008', 3, 2,
   'Kläderna därifrån är av bäst kvalitet av en slump',
   'Kläderna därifrån är av allra bästa kvalitet'],

  ['ak8-tema-010', 0, 3,
   'Att resebolag ljuger om sina destinationer och ingenting annat',
   'Att resebolag ljuger om hur stränderna faktiskt ser ut'],

  ['ak8-tema-012', 1, 1,
   'Hon glömde vad hon skulle säga och ingenting annat',
   'Hon glömde vad hon skulle säga mitt i meningen'],

  ['ak8-tema-012', 3, 1,
   'Att hon borde skriva om texten på arabiska under hela den perioden',
   'Att hon borde skriva om hela texten på arabiska i stället'],

  ['ak8-tema-014', 5, 1,
   'Att man aldrig ska stänga av telefonen under hela den perioden',
   'Att man aldrig ska stänga av telefonen under skoldagen'],

  ['ak8-tema-015', 0, 2,
   'Finns det liv på andra planeter på exakt samma sätt som förut',
   'Finns det liv på andra planeter någonstans i universum'],

  ['ak8-tema-015', 4, 2,
   'Att Kasper inte verkar ha ett medvetande för säkerhets skull',
   'Att Kasper inte verkar ha ett medvetande att tala om'],

  ['ak8-tema-015', 5, 3,
   'Varför finns universum, för att det hade fungerat förut',
   'Varför finns universum, och vem kan svara på det'],

  ['ak9-gpt-002', 5, 2,
   'Att forskning bör stoppas helt, för att slippa problem senare',
   'Att forskning bör stoppas helt tills alla risker är kända'],

  ['ak9-gpt-004', 1, 3,
   'Gratis mobiltelefoner redan innan något annat hände',
   'Gratis mobiltelefoner till alla under arton år'],

  ['ak9-gpt-004', 4, 3,
   'Att politiker aldrig kompromissar utan någon som helst förändring',
   'Att politiker aldrig kompromissar när friheter står på spel'],

  ['ak9-gpt-005', 3, 2,
   'För att vädret alltid är samma utan att det fick några konsekvenser',
   'För att vädret alltid är sig likt oavsett vad forskarna säger'],
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
