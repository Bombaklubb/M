#!/usr/bin/env node
//
// Frågetyperna forfattarens-syfte och textbevis är satta efter position,
// inte efter vad frågan prövar.
//
// Av bibliotekets 57 frågor med de två typerna ligger 27 på plats 5 och 30 på
// plats 6. Tjugofyra texter har exakt mönstret f5 = forfattarens-syfte,
// f6 = textbevis, oavsett vad de två frågorna handlar om. Ingen av de
// tjugofyra textbevis-frågorna ber eleven peka ut ett belägg i texten, vilket
// är vad typen betyder.
//
// Det spelar roll för eleven: profilen visar träffsäkerhet per lässtrategi, så
// att man vet vad som behöver övas. "Varför blir stämningen bättre när Siri
// föreslår sin nya regel?" är en inferensfråga, och när den räknas som
// författarens syfte får eleven fel bild av sin egen läsning.
//
// Gränsdragning som använts:
//   forfattarens-syfte  frågan gäller textens egna val eller avsikt
//                       ("Varför avslutar texten med ...?", "Vad vill texten
//                       att läsaren ska göra?")
//   sammanfatta         frågan gäller berättelsens budskap som helhet
//   inferens            frågan gäller innebörden i en händelse eller ett
//                       påstående i texten
//
// Nio frågor behåller forfattarens-syfte eftersom de faktiskt gäller textens
// val. Textbevis blir tomt efter den här omtypningen och fylls i ett separat
// steg med frågor som verkligen ber om belägg.
//
// Kör med --dry för att se ändringarna utan att skriva.

const fs = require('fs');
const path = require('path');

// [textId, frågeindex, nuvarande typ, ny typ, kontrollsträng ur frågan]
const ANDRINGAR = [
  // ── Gäller innebörden i en händelse eller ett påstående -> inferens ──
  ['ak5-vanskap-01',  4, 'forfattarens-syfte', 'inferens',   'kortas ner enligt Leila'],
  ['ak5-vanskap-02',  4, 'forfattarens-syfte', 'inferens',   'stämningen bättre när Siri'],
  ['ak6-miljo-09',    4, 'forfattarens-syfte', 'inferens',   'flergångsprodukter'],
  ['ak6-natur-02',    4, 'forfattarens-syfte', 'inferens',   'morfars råd'],
  ['ak6-samhalle-01', 4, 'forfattarens-syfte', 'inferens',   'Hawa upp frågan om rättvisa'],
  ['ak6-samhalle-06', 4, 'forfattarens-syfte', 'inferens',   'få invånare engagerar sig'],
  ['ak6-samhalle-14', 4, 'forfattarens-syfte', 'inferens',   'rektorn att eleverna måste hjälpa till'],
  ['ak6-sport-13',    4, 'forfattarens-syfte', 'inferens',   'Emilias axlar'],
  ['ak6-teknik-04',   4, 'forfattarens-syfte', 'inferens',   'lär sig Mateo'],
  ['ak6-vanskap-01',  4, 'forfattarens-syfte', 'inferens',   'Amirs sätt att förklara'],
  ['ak6-vetenskap-11',4, 'forfattarens-syfte', 'inferens',   'flockimmunitet'],
  ['ak7-musik-05',    4, 'forfattarens-syfte', 'inferens',   'regn som slutar'],
  ['ak7-tema-048',    4, 'forfattarens-syfte', 'inferens',   'tolkning ändå inte kan bli hur som helst'],
  ['ak7-vanskap-01',  4, 'forfattarens-syfte', 'inferens',   'Elias när han säger'],
  ['ak8-etik-05',     4, 'forfattarens-syfte', 'inferens',   'fel att dela vidare'],
  ['ak8-historia-03', 4, 'forfattarens-syfte', 'inferens',   'arbetaren är'],
  ['ak8-musik-04',    4, 'forfattarens-syfte', 'inferens',   'rättighetsfrågor'],
  ['ak8-samhalle-02', 4, 'forfattarens-syfte', 'inferens',   'kompromisser'],
  ['ak8-vetenskap-01',4, 'forfattarens-syfte', 'inferens',   'antibiotikaresistens'],
  ['gy-etik-05',      4, 'forfattarens-syfte', 'inferens',   'skriva om diskussionen'],
  ['gy-historia-04',  4, 'forfattarens-syfte', 'inferens',   'Parisa när hon säger'],
  ['gy-samhalle-03',  4, 'forfattarens-syfte', 'inferens',   'jämförelse i flöden'],
  ['gy-teknik-02',    4, 'forfattarens-syfte', 'inferens',   'snyggt svar'],
  ['gy-vetenskap-01', 4, 'forfattarens-syfte', 'inferens',   'ovanlig skala'],
  ['akgy-mj-002',     5, 'forfattarens-syfte', 'inferens',   'publik har svårt med'],

  ['ak5-vanskap-01',  5, 'textbevis', 'inferens', 'Emil till slut berättar'],
  ['ak6-miljo-09',    5, 'textbevis', 'inferens', 'städinsatser'],
  ['ak6-natur-02',    5, 'textbevis', 'inferens', 'Leila sina känslor'],
  ['ak6-samhalle-06', 5, 'textbevis', 'inferens', 'kommunstyrelsen'],
  ['ak6-samhalle-14', 5, 'textbevis', 'inferens', 'möte i matsalen'],
  ['ak6-sport-13',    5, 'textbevis', 'inferens', 'Zahra stolt'],
  ['ak6-teknik-04',   5, 'textbevis', 'inferens', 'timer på två minuter'],
  ['ak6-vetenskap-11',5, 'textbevis', 'inferens', 'tränar det'],
  ['ak7-musik-05',    5, 'textbevis', 'inferens', 'vara med på scen'],
  ['ak8-etik-05',     5, 'textbevis', 'inferens', 'anonyma kontot'],
  ['ak8-historia-03', 5, 'textbevis', 'inferens', 'Nadirs syn på historia'],
  ['ak8-musik-04',    5, 'textbevis', 'inferens', 'tillstånd för att sampla'],
  ['ak8-samhalle-02', 5, 'textbevis', 'inferens', 'personangrepp'],
  ['ak8-vetenskap-01',5, 'textbevis', 'inferens', 'enbart individers val'],
  ['gy-etik-05',      5, 'textbevis', 'inferens', 'etik är vad man gör'],
  ['gy-historia-04',  5, 'textbevis', 'inferens', 'Elins nya syn'],
  ['gy-teknik-02',    5, 'textbevis', 'inferens', 'beroende av färdiga svar'],
  ['gy-vetenskap-01', 5, 'textbevis', 'inferens', 'korrelation från kausalitet'],

  // ── Gäller berättelsens budskap som helhet -> sammanfatta ──
  ['ak5-vanskap-02',  5, 'textbevis', 'sammanfatta', 'berättelsen om vänskap'],
  ['ak6-samhalle-01', 5, 'textbevis', 'sammanfatta', 'påverka i samhället'],
  ['ak6-vanskap-01',  5, 'textbevis', 'sammanfatta', 'budskap om vänskap'],
  ['ak7-vanskap-01',  5, 'textbevis', 'sammanfatta', 'lär sig Amina'],
  ['ak8-tema-019',    5, 'forfattarens-syfte', 'sammanfatta', 'kärnan i diskussionen'],

  // ── Gäller textens avsikt med läsaren -> forfattarens-syfte ──
  ['ak6-historia-12', 5, 'textbevis', 'forfattarens-syfte', 'vill att du ska göra som konsument'],
  ['gy-samhalle-03',  5, 'textbevis', 'forfattarens-syfte', 'vill texten att läsaren ska göra'],
];

// Frågor som behåller forfattarens-syfte – de gäller faktiskt textens val.
const BEHALLS = [
  ['ak6-historia-12', 4], ['ak10-obama-003', 5], ['ak10-obama-004', 5],
  ['ak10-obama-005', 5], ['akgy-mj-003', 4], ['akgy-mj-004', 5], ['akgy-mj-005', 4],
];

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;
const rakning = {};

ANDRINGAR.forEach(([id, index, fran, till, kontroll]) => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error(`Hittar inte ${id}`); ok = false; return; }
  const q = (t.questions || [])[index];
  if (!q) { console.error(`${id}: ingen fråga på plats ${index}`); ok = false; return; }

  // Två spärrar så att fel fråga aldrig kan träffas.
  if (q.type !== fran) {
    console.error(`${id} f${index + 1}: typen är "${q.type}", förväntade "${fran}"`); ok = false; return;
  }
  if (!q.q.toLowerCase().includes(kontroll.toLowerCase())) {
    console.error(`${id} f${index + 1}: frågan innehåller inte "${kontroll}"`); ok = false; return;
  }

  q.type = till;
  rakning[`${fran} → ${till}`] = (rakning[`${fran} → ${till}`] || 0) + 1;
});

// Kontrollera att de som ska behållas är orörda.
BEHALLS.forEach(([id, index]) => {
  const q = (lib.find(x => x.id === id) || { questions: [] }).questions[index];
  if (!q || q.type !== 'forfattarens-syfte') {
    console.error(`${id} f${index + 1}: skulle behålla forfattarens-syfte men har "${q && q.type}"`);
    ok = false;
  }
});

Object.entries(rakning).sort().forEach(([k, v]) => console.log(`${String(v).padStart(3)}  ${k}`));

const kvar = {};
lib.forEach(t => (t.questions || []).forEach(q => { kvar[q.type] = (kvar[q.type] || 0) + 1; }));
console.log('\nTyper i biblioteket efter ändringen:');
Object.entries(kvar).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${k.padEnd(20)}${v}`));

// Kontroll: de två typerna får inte längre hänga ihop med en viss plats.
const platser = {};
lib.forEach(t => (t.questions || []).forEach((q, i) => {
  if (q.type === 'forfattarens-syfte') platser[i + 1] = (platser[i + 1] || 0) + 1;
}));
console.log('\nforfattarens-syfte per frågeplats:', JSON.stringify(platser));

if (!dry) fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
else console.log('\n(dry run – inget skrivet)');
if (!ok) process.exit(1);
