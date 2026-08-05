#!/usr/bin/env node
//
// Omskrivning av distraktorer med påklistrade mallfraser, sats B av fyra.
// Se fix-mallfraser-a.cjs för bakgrunden.
//
// Kör med --dry för att se ändringarna utan att skriva.

const fs = require('fs');
const path = require('path');

// [textId, frågeindex, alternativindex, nuvarande text, ny text]
const OMSKRIVNINGAR = [
  ['ak4-tema-010', 2, 2,
   'Alla röstade för Olivers förslag oavsett vad andra tyckte',
   'Alla röstade för Olivers förslag om att alltid börja om'],

  ['ak4-vetenskap-03', 5, 3,
   'För att flytvästar ska se coola ut utan att det fick några konsekvenser',
   'För att flytvästar ska se coola ut och gå att välja i olika färger'],

  ['ak5-etik-05', 4, 3,
   'För att prov inte spelar någon roll, för att det hade fungerat förut',
   'För att prov inte spelar någon roll för hur mycket man lär sig'],

  ['ak5-samhalle-04', 0, 2,
   'En webbplats för spel, för att det hade fungerat förut',
   'En webbplats där man kan spela och chatta med andra'],

  ['ak5-samhalle-04', 3, 1,
   'För att kommunen bygger motorcyklar, för att det hade fungerat förut',
   'För att kommunen bygger motorcyklar och andra fordon till alla'],

  ['ak5-tema-001', 4, 0,
   'Fotosyntes påverkas inte av människors utsläpp alls, för att undvika missförstånd',
   'Fotosyntes påverkas inte alls av utsläpp, eftersom växter tar upp all koldioxid'],

  ['ak5-tema-003', 3, 0,
   'Den blir automatiskt återvunnen hemma själv men bara under vissa förutsättningar',
   'Den blir automatiskt återvunnen om man bara lämnar den i den vanliga soppåsen'],

  ['ak6-etik-04', 3, 2,
   'För att frågor gör att allt blir ett skämt, för att det skulle gå snabbare',
   'För att frågor gör att allt blir ett skämt och stämningen blir lättare'],

  ['ak6-historia-03', 5, 3,
   'Att gamla saker alltid är oviktiga, för att det hade fungerat förut',
   'Att gamla saker alltid är oviktiga så snart något nyare har byggts'],

  ['ak6-historia-12', 1, 3,
   'En enda rak väg genom Europa men bara om det behövdes',
   'En enda rak handelsväg som gick tvärs genom hela Europa'],

  ['ak6-miljo-02', 3, 0,
   'För att den blir osynlig men borta redan innan något annat hände',
   'För att den blir osynlig och därmed helt ofarlig för djuren'],

  ['ak6-miljo-02', 4, 3,
   'För att den flyger snabbare men bara om det behövdes',
   'För att den flyger snabbare när den har ätit plastbitar'],

  ['ak6-miljo-09', 1, 3,
   'Havsströmmar som skapar plast, för att slippa problem senare',
   'Havsströmmar som skapar ny plast långt ute till havs'],

  ['ak6-miljo-09', 3, 1,
   'För att plasten försvinner för snabbt, för att undvika missförstånd',
   'För att plasten försvinner för snabbt för att hinna samlas in'],

  ['ak6-musik-15', 0, 2,
   'Ljus som studsar för säkerhets skull',
   'Ljus som studsar mellan föremål'],

  ['ak6-musik-15', 3, 2,
   'För att högtalare skickar elektricitet in i kroppen, för att det hade fungerat förut',
   'För att högtalare skickar svag elektricitet genom golvet och in i kroppen'],

  ['ak6-musik-15', 4, 2,
   'För att örat slutar fungera på vintern utan någon som helst förändring',
   'För att örat slutar fungera helt när det utsätts för kyla'],

  ['ak6-natur-02', 5, 0,
   'För att hon också kan springa snabbare än andra under hela den perioden',
   'För att hon också kan springa fort när hon blir rädd i skogen'],

  ['ak6-samhalle-01', 1, 2,
   'Idrott, musik och bild och ingenting annat',
   'Idrott, musik och bild på schemat'],

  ['ak6-sport-13', 3, 3,
   'För att Jonas sa att man måste gå först oavsett vad andra tyckte',
   'För att Jonas sa att man måste ligga först hela loppet'],

  ['ak6-teknik-02', 4, 2,
   'För att laddare slutar fungera annars, för att det hade fungerat förut',
   'För att laddare slutar fungera om batteriet slängs fel'],

  ['ak6-teknik-04', 5, 0,
   'För att sensorn då slutar fungera, för att det hade fungerat förut',
   'För att sensorn då slutar fungera när fönstret är stängt'],

  ['ak6-tema-001', 4, 3,
   'Att vattnet är fruset och hårt under hela den perioden',
   'Att vattnet är fruset och hårt på ytan'],

  ['ak6-tema-001', 5, 1,
   'Att naturen alltid klarar sig bäst utan människor av en slump',
   'Att naturen alltid klarar sig bäst helt utan människor'],

  ['ak6-tema-003', 3, 1,
   'För att det regnade för lite under våren oavsett vad andra tyckte',
   'För att det regnade för lite under våren och somrarna'],

  ['ak6-tema-005', 2, 1,
   'Att man pumpar upp vatten från berg, för att undvika missförstånd',
   'Att man pumpar upp vatten ur berggrunden till kranarna'],
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
