#!/usr/bin/env node
//
// Omskrivning av distraktorer med påklistrade mallfraser, sats A av fyra.
//
// Femton fraser återkommer ordagrant på 102 svarsalternativ i alla årskurser –
// "för att undvika missförstånd", "oavsett vad andra tyckte", "av en slump"
// och så vidare. Inte ett enda av de 102 är ett rätt svar. Frasen är alltså en
// helt pålitlig ledtråd: eleven kan välja bort alternativet utan att läsa
// texten.
//
// De sitter där för att fylla ut längden. Utfyllnaden är gjord så att fel- och
// rättsvar får nästan exakt samma teckenantal, och stryks den rakt av blir det
// rätta svaret påfallande längst – lika gissningsbart, fast tvärtom.
//
// Varje distraktor får därför i stället en fortsättning som hör till frågan,
// är rimlig men fel, och håller ungefär samma längd.
//
// Kör med --dry för att se ändringarna utan att skriva.

const fs = require('fs');
const path = require('path');

// [textId, frågeindex, alternativindex, nuvarande text, ny text]
const OMSKRIVNINGAR = [
  ['ak1-etik-12', 5, 2,
   'Att suddgummin är hemliga utan någon som helst förändring',
   'Att man får behålla saker man lånat om man glömmer bort det'],

  ['ak1-historia-07', 0, 3,
   'Bara på väggar, för att det skulle gå snabbare',
   'Bara på griffeltavlor som man suddar med en trasa'],

  ['ak1-historia-07', 4, 0,
   'För att de var mjuka utan någon som helst förändring',
   'För att de var mjuka och gick att vika ihop i fickan'],

  ['ak1-miljo-04', 5, 3,
   'Att små lampor lyser starkast för säkerhets skull',
   'Att små lampor lyser starkare än de stora gör'],

  ['ak1-musik-11', 5, 1,
   'Att man alltid ska ge upp för säkerhets skull',
   'Att man ska ge upp om det inte går på en gång'],

  ['ak10-tema-002', 1, 0,
   'Att namn bör bytas till svenska namn oavsett, annars går handlingen inte att följa oavsett vad andra tyckte',
   'Att namn alltid bör bytas till svenska, eftersom en läsare annars inte kan följa handlingen alls'],

  ['ak10-tema-002', 2, 0,
   'Man kan ofta ersätta ett skämt ord för ord och få exakt samma effekt för säkerhets skull',
   'Man kan ofta ersätta ett skämt ord för ord, eftersom humor fungerar likadant i alla språk'],

  ['ak10-tema-003', 2, 3,
   'Att effektiva handlingar alltid är rättfärdiga om de minskar konflikter och ingenting annat',
   'Att effektiva handlingar alltid är rättfärdiga, eftersom resultatet är det som räknas'],

  ['ak10-tema-003', 4, 2,
   'Att etik alltid blir enklare när fler personer är inblandade i ett beslut men bara om det behövdes',
   'Att etik alltid blir enklare när fler är inblandade, eftersom ansvaret då delas mellan alla'],

  ['ak10-tema-004', 4, 2,
   'Att man bara godkänner medlemmar som kan citera hela boken utantill, för att undvika missförstånd',
   'Att man bara godkänner medlemmar som kan citera hela boken, så att nivån hålls hög i gruppen'],

  ['ak10-tema-005', 1, 1,
   'Som en humoristisk detalj som mest ska göra skolmiljön mer spännande under hela den perioden',
   'Som en humoristisk detalj vars enda syfte är att göra skolmiljön lite mer spännande'],

  ['ak2-miljo-04', 3, 3,
   'För att det blir fler sopor, för att det skulle gå snabbare',
   'För att det då blir fler sopor än vad bilarna kan hämta'],

  ['ak2-miljo-04', 4, 2,
   'För att glas inte väger något men bara under vissa förutsättningar',
   'För att glas inte väger något och därför är gratis att frakta'],

  ['ak2-musik-05', 3, 0,
   'För att trummor försvinner redan innan något annat hände',
   'För att trummorna låter tystare när man spelar sakta'],

  ['ak2-tema-003', 5, 2,
   'Hon tyckte inte det var roligt att hjälpa av en slump',
   'Hon tyckte inte att det var roligt att hjälpa till'],

  ['ak2-tema-005', 5, 1,
   'Meja behövde öva sig på att rita för säkerhets skull',
   'Meja behövde öva sig på att rita raka streck'],

  ['ak3-skola-013', 1, 3,
   'För att de delar ut godis varje dag, för att undvika missförstånd',
   'För att de delar ut godis till alla elever varje rast'],

  ['ak3-tema-012', 5, 1,
   'Att de borde ha skällt på någon på exakt samma sätt som förut',
   'Att de borde ha skällt på den som lämnade grinden öppen'],

  ['ak3-tema-015', 5, 0,
   'Vilken mat de åt till lunch på exakt samma sätt som förut',
   'Vilken mat de åt till lunch och hur den smakade'],

  ['ak4-bamse-001', 5, 2,
   'Skalman gömmer korgen för säkerhets skull',
   'Skalman gömmer korgen i sin egen ryggsäck'],

  ['ak4-historia-04', 4, 2,
   'Att det inte fanns några material alls men bara om det behövdes',
   'Att det inte fanns några material alls att tillverka av'],

  ['ak4-historia-04', 5, 1,
   'För att skolor inte får prata om krig, för att undvika missförstånd',
   'För att skolor inte får prata om krig med yngre elever'],

  ['ak4-miljo-05', 0, 1,
   'Ett äpple oavsett vad andra tyckte',
   'Ett äpple och en handfull gula löv'],

  ['ak4-miljo-05', 3, 2,
   'För att vatten alltid blir farligt och ingenting annat',
   'För att vatten alltid blir farligt för små djur'],

  ['ak4-teknik-04', 5, 2,
   'Att broar inte behöver testas utan att det fick några konsekvenser',
   'Att broar inte behöver testas om de ser stabila ut'],

  ['ak4-teknik-05', 3, 1,
   'För att internet använder bilar, för att det hade fungerat förut',
   'För att internet skickas längs samma vägar som bilar kör på'],
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
  console.log(`   − ${fran}`);
  console.log(`   + ${till}`);
});

// Kontroll: rätt svar får varken bli längst eller kortast på ett avslöjande sätt
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
  if (motKortaste >= 1.6) { console.error(`${id} f${qi + 1}: rätt svar ${motKortaste.toFixed(2)}× kortare än kortaste distraktorn`); ok = false; }
});
if (ok) console.log(`${sedda.size} frågor kontrollerade – inget rätt svar går att peka ut på längden`);

if (!dry) fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
else console.log('\n(dry run – inget skrivet)');
if (!ok) process.exit(1);
