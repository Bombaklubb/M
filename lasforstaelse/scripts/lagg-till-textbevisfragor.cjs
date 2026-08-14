#!/usr/bin/env node
//
// Ger frågetypen textbevis riktiga frågor.
//
// Typen fanns i koden med etikett och emoji, men användes av noll frågor. De
// tjugofyra som en gång var märkta textbevis hade fått typen efter position –
// fråga 6 blev alltid textbevis oavsett innehåll – och när de omtypades efter
// vad de faktiskt frågade om blev kategorin tom.
//
// En textbevis-fråga skiljer sig från de andra genom att svarsalternativen är
// ordagranna meningar ur texten. Eleven ska inte minnas vad som stod, utan gå
// tillbaka och peka ut vilken mening som bär belägget. Det är den färdighet som
// skiljer att återge en text från att kunna styrka en tolkning av den.
//
// Varje text har exakt sex frågor och validatorn kräver det, så en fråga byts
// ut i stället för att läggas till. Den utbytta är alltid av typen literal, som
// är kraftigt överrepresenterad: 1532 av 2922 frågor.
//
// Skriptet kontrollerar att varje alternativ verkligen står ordagrant i texten.
// Utan den spärren vore det lätt att skriva en snarlik mening ur minnet, och då
// vore frågan obesvarbar just för den elev som gör som uppgiften säger.
//
// Kör med --dry för att se ändringarna utan att skriva.

const fs = require('fs');
const path = require('path');

// [textens id, frågans index (0-baserat), ny fråga]
const NYA = [
  ['ak3-tema-001', 2, {
    type: 'textbevis',
    q: 'Vilken mening i texten visar att äpplen kan se olika ut?',
    options: [
      'Familjen använder äpplena till många saker.',
      'Mormor berättar att olika sorter smakar olika.',
      'Vissa äpplen är röda, andra gröna eller gula.',
      'De delar ibland frukten med grannar som bor nära.',
    ],
    correct: 2,
  }],

  ['ak8-tema-013', 0, {
    type: 'textbevis',
    q: 'Vilken mening i texten är belägg för att skogen bromsar klimatförändringarna?',
    options: [
      'Sådan skog kallas naturskog och har inte avverkats.',
      'En kolsänka är en plats som lagrar kol och bromsar klimatförändringarna.',
      'Skogsindustrin sysselsätter tiotusentals människor.',
      'Då planterar man nya träd och avverkar med hänsyn.',
    ],
    correct: 1,
  }],

  ['ak6-tema-008', 1, {
    type: 'textbevis',
    q: 'Vilken mening i texten är belägg för att barnarbete fortfarande är utbrett i världen?',
    options: [
      'Senare skärptes reglerna för barnarbete ytterligare.',
      'Många av dem arbetar under farliga förhållanden.',
      'Enligt FN arbetar fortfarande ungefär 160 miljoner barn globalt.',
      'Organisationer arbetar för att minska barnarbete.',
    ],
    correct: 2,
  }],

  ['ak9-tema-010', 2, {
    type: 'textbevis',
    q: 'Vilken mening i texten är belägg för att pseudovetenskap avvisar invändningar i stället för att pröva dem?',
    options: [
      'Den kan använda vetenskapliga termer utan att faktiskt följa vetenskaplig metod.',
      'Påståenden presenteras som bevisade trots att de inte har testats.',
      'Kritik avfärdas som konspiration, och undantag förklaras med påhittade omständigheter.',
      'Ett pseudovetenskapligt påstående saknar ofta ett sådant svar.',
    ],
    correct: 2,
  }],

  ['ak6-tema-024', 2, {
    type: 'textbevis',
    q: 'Vilken mening i texten är belägg för att svarta artister inte fick samma erkännande som Elvis?',
    // Rätt svar ligger sist. Med det på plats B fick texten sina rätta svar på
    // bara två positioner, och tre i rad på samma – då går frågorna att klara
    // på mönster i stället för på innehåll.
    options: [
      'Elvis själv uttryckte respekt för de svarta musiker som inspirerat honom.',
      'Fler människor började lyssna på rhythm and blues och upptäckte svarta artister.',
      'Musiken blev en av de första kulturella krafterna som började sudda ut rasliga gränser i USA.',
      'En vit sångare fick mycket uppmärksamhet för musik som de själva hade utvecklat under lång tid.',
    ],
    correct: 3,
  }],

  ['ak7-miljo-01', 1, {
    type: 'textbevis',
    q: 'Vilken mening i texten är belägg för att havet blir surare av koldioxid?',
    options: [
      'Haven tar upp en stor del av den extra koldioxiden.',
      'Om plankton påverkas kan det i sin tur påverka hela näringskedjor.',
      'När koldioxid löses i vatten bildas kolsyra och havet blir surare.',
      'Ökat upptag kan handla om att skydda skogar och våtmarker.',
    ],
    correct: 2,
  }],

  ['ak6-miljo-09', 2, {
    type: 'textbevis',
    q: 'Vilken mening i texten är belägg för att mikroplast kan komma från tvätt av kläder?',
    options: [
      'När bildäck slits bildas små partiklar som kan hamna i dagvatten.',
      'Vissa kläder av syntetmaterial kan släppa ifrån sig mikrofibrer vid tvätt.',
      'Dessa små delar kan gå igenom reningsverk och hamna i sjöar och hav.',
      'Dels kan djur fastna i större plastbitar eller missta plast för mat.',
    ],
    correct: 1,
  }],

  ['ak8-tema-002', 3, {
    type: 'textbevis',
    q: 'Vilken mening i texten är belägg för att självstyret i norra Irak växte fram under yttre skydd?',
    options: [
      'Efter Gulfkriget 1991 upprättades en flygförbudszon över norra Irak.',
      'Under skyddet av den växte ett självstyre fram, och 1992 hölls val till ett regionalt parlament.',
      'Kort därefter förlorade regionen kontrollen över flera omtvistade områden.',
      'Politiken har växlat med regeringar och med hur säkerhetsläget bedömts.',
    ],
    correct: 1,
  }],

  ['ak9-lotr-005', 1, {
    type: 'textbevis',
    q: 'Vilken mening i texten är belägg för att Frodo inte klarar sitt uppdrag?',
    options: [
      'Samtidigt visar berättelsen att godhet inte skyddar mot frestelse.',
      'Vid Domedagsberget klarar Frodo inte av att kasta ringen i elden, utan tar den för egen räkning.',
      'Utgången knyts därmed till de tidigare besluten att skona honom.',
      'Det som räddar Midgård är inte viljestyrka, utan följderna av tidigare nåd.',
    ],
    correct: 1,
  }],

  ['ak10-ai-003', 3, {
    type: 'textbevis',
    q: 'Vilken mening i texten är belägg för att kravet på mänsklig kontroll kan bli en formalitet?',
    options: [
      'Systemet är inte fördomsfullt i någon mänsklig mening.',
      'När ett system oftast har rätt tenderar människor att sluta granska det.',
      'Risken är ett ansvarsvakuum där var och en pekar på nästa led.',
      'En fjärde fråga gäller varifrån träningsdata kommer.',
    ],
    correct: 1,
  }],

  ['ak10-ai-004', 2, {
    type: 'textbevis',
    q: 'Vilken mening i texten är belägg för att övervakning kan påverka rättigheter som formellt är oförändrade?',
    options: [
      'Effekten kallas nedkylning och drabbar rättigheter som formellt är helt intakta.',
      'Att lägga gränsdragningen hos privata företag utan insyn är i sig ett demokratiskt problem.',
      'Flera länder har därför infört krav på öppna register över politisk annonsering.',
      'Reglering ställer krav på insyn, märkning av syntetiskt innehåll och tillsyn.',
    ],
    correct: 0,
  }],
];

// ─── Körning ────────────────────────────────────────────────────────────────

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let fel = 0;
const rader = [];

for (const [id, index, ny] of NYA) {
  const t = lib.find((x) => x.id === id);
  if (!t) {
    console.error(`${id}: finns inte`);
    fel++;
    continue;
  }
  const gammal = (t.questions || [])[index];
  if (!gammal) {
    console.error(`${id}: ingen fråga på plats ${index + 1}`);
    fel++;
    continue;
  }
  if (gammal.type === 'textbevis') {
    console.error(`${id} f${index + 1}: är redan textbevis – kanske redan körd?`);
    fel++;
    continue;
  }
  if (gammal.type !== 'literal') {
    console.error(`${id} f${index + 1}: är av typen ${gammal.type}, förväntade literal`);
    fel++;
    continue;
  }

  // Hela poängen med en textbevis-fråga: alternativen måste stå ordagrant i
  // texten. Skriver man en snarlik mening ur minnet blir frågan obesvarbar för
  // den elev som faktiskt letar i texten.
  ny.options.forEach((o, i) => {
    if (!t.text.includes(o)) {
      console.error(`${id} f${index + 1} alternativ ${'ABCD'[i]}: står inte ordagrant i texten\n    "${o}"`);
      fel++;
    }
  });

  if (ny.options.length !== 4) {
    console.error(`${id}: ${ny.options.length} alternativ, ska vara 4`);
    fel++;
  }

  rader.push({ t, index, gammal, ny });
}

if (fel) {
  console.error(`\n${fel} problem – inget skrivet.`);
  process.exit(1);
}

console.log('id                åk  ersätter                                        facit');
for (const r of rader) {
  r.t.questions[r.index] = r.ny;
  console.log(
    `${r.t.id.padEnd(16)} ${String(r.t.grade).padStart(2)}  ${r.gammal.q.slice(0, 46).padEnd(48)} ${'ABCD'[r.ny.correct]}`
  );
}

const antal = lib.reduce(
  (n, t) => n + t.questions.filter((q) => q.type === 'textbevis').length,
  0
);
console.log(`\n${rader.length} frågor omgjorda. Frågor av typen textbevis i biblioteket: ${antal}`);

if (!dry) {
  fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
  console.log('Skrivet.');
} else {
  console.log('(dry run – inget skrivet)');
}
