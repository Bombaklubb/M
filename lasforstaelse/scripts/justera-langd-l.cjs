#!/usr/bin/env node
//
// Sex åk 5-texter som låg drygt trettio ord över intervallet 300–320.
// Ett stycke stryks i varje; ingenting skrivs om.

const fs = require('fs');
const path = require('path');

const STRYK = {
  'ak5-samhalle-04': [
    ' Det betyder inte att kommunen bestämmer allt i klassrummet, men den har ansvar för att skolan fungerar.',
    '\n\nKommunen ansvarar också för äldreomsorg. Det handlar om hjälp till äldre personer som behöver stöd hemma eller bor på ett äldreboende. Där jobbar personal som hjälper till med mat, mediciner och trygghet.',
  ],

  'ak9-tema-016': [
    ' Den praktiska erfarenheten gjorde att han tidigt såg hur kläder faktiskt används: hur man rör sig, sitter, reser och möter människor.',
    ' En viktig affärsidé i lyxvärlden är att varumärket måste kännas konsekvent: samma ton i reklam, butiksdesign och kundupplevelse.',
  ],

  'ak7-tema-009': [
    'En dag får klassen i uppgift att granska påståendet: "Algoritmer är neutrala." Malte vill först hålla med. En algoritm är ju bara matematik. Men läraren',
    ' Om den tränas på innehåll som mest kommer från vissa grupper kan andra bli sämre representerade.',
  ],

  'ak7-tema-007': [
    ' Leo fyllde i att ungdomar redan är bra på att organisera sig: de planerar lag, spelkvällar, föreningar och skolprojekt. Skillnaden är att kommunen har en annan sorts makt, och då blir det svårare att förstå hur man gör sin röst hörd och vart man ska vända sig.',
  ],

  'ak7-tema-010': [
    ' Jamal påpekar också att stress inte alltid syns. Någon kan skämta mycket och ändå känna press. En annan kan vara tyst och ändå må bra, och man kan inte alltid gissa.',
    ' Mira hade inte tänkt på att trötthet kan påverka kroppen så olika.',
  ],

  'ak7-tema-014': [
    ' Om du förtrollar ett föremål kan det påverka andra saker runt omkring. Om du försöker ändra något som är komplext kan resultatet bli ofullständigt. Därför lägger skolan så mycket tid på teori och övning. Det räcker inte att "vilja väl".',
  ],
};

// Ett par strykningar kapar en mening mitt i och behöver en ny inledning.
const ERSATT = {
  'ak7-tema-009': [{ fran: ' påminner dem om att människor bestämmer målet', till: 'Läraren påminner om att människor bestämmer målet' }],
};

const NYCKELORD = {
  'ak5-samhalle-04': ['bor, arbetar och går i skolan', 'skolan', 'naturen inte blir förstörd', 'vardagsmotor', 'medborgarförslag', 'beslut kan ändras'],
  'ak9-tema-016': ['skyltning och försäljning', 'inte högljudd', 'axlarna mjukare', 'pressen att passa in', 'pris, kvalitet, målgrupp', 'design, status och ansvar'],
  'ak7-tema-009': ['gissar', 'pausar, spolar tillbaka', 'bubbla', 'bestämmer målet', 'två nya konton', 'förstå mekanismerna'],
  'ak7-tema-007': ['ungdomsråd', 'träffa tjänstepersoner och politiker', 'klagomål ofta betyder', 'rådgivande', 'tydligt svar', 'hur beslut växer fram'],
  'ak7-tema-010': ['extra tidigt', 'koncentrera sig', 'Inre stress', 'volymen skruvas upp', 'mobilen utanför sängen', 'steg för steg'],
  'ak7-tema-014': ['koncentration, kunskap, risk eller ansvar', 'stressad, arg', 'räckvidd, begränsningar', 'vad gjorde det med den som blev utsatt', 'skyddsbesvärjelse', 'stanna upp och välja'],
};

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;
Object.keys(STRYK).forEach(id => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error('Hittar inte ' + id); ok = false; return; }
  const fore = t.text.trim().split(/\s+/).length;

  STRYK[id].forEach(s => {
    if (!t.text.includes(s)) { console.error(`${id}: hittar inte "${s.trim().slice(0, 45)}…"`); ok = false; return; }
    t.text = t.text.replace(s, '');
  });
  (ERSATT[id] || []).forEach(e => {
    if (!t.text.includes(e.fran)) { console.error(`${id}: hittar inte "${e.fran.slice(0, 45)}…"`); ok = false; return; }
    t.text = t.text.replace(e.fran, e.till);
  });

  const saknas = (NYCKELORD[id] || []).filter(o => !t.text.toLowerCase().includes(o.toLowerCase()));
  if (saknas.length) { console.error(`${id}: nyckelord borta – ${saknas.join(', ')}`); ok = false; return; }

  const n = t.text.trim().split(/\s+/).length;
  t.meta = { ...(t.meta || {}), wordCount: n };
  const inom = n >= 300 && n <= 320;
  if (!inom) ok = false;
  console.log(`${id.padEnd(18)} ${String(fore).padStart(3)} → ${String(n).padStart(3)} ord ${inom ? '✅' : '❌ krav 300–320'}  ${t.title}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
if (!ok) process.exit(1);
