#!/usr/bin/env node
//
// Femton texter i åk 3 och åk 4 som låg 2–16 ord under sitt intervall.
// Kör med --dry för att bara se ordräkningen utan att skriva.

const fs = require('fs');
const path = require('path');

const BAND = { 1:[40,60], 2:[65,90], 3:[150,165], 4:[200,220], 5:[300,320],
               6:[400,415], 7:[500,530], 8:[530,570], 9:[570,590], 10:[590,625] };

const TILLAGG = {
  'ak3-tema-008': [{ text:
`Nova bläddrade lite i boken redan på vägen tillbaka till klassrummet. Hon bestämde sig för att skriva recensionen, även om hon inte visste hur man gör.` }],

  'ak3-tema-002': [{ text:
`På bussen hem pratade eleverna om hur många äpplen ett enda träd kan ge. Guiden hade sagt att ett stort träd kan ge flera hundra frukter.` }],

  'ak3-tema-007': [{ text:
`I boken hittade de en bild på sorkspår. De såg nästan likadana ut som spåren i snön, men Samir ville gå tillbaka nästa dag och titta igen.` }],

  'ak3-tema-009': [{ text:
`Jia skrev att sockret försvann fortare än saltet. Läraren sa att det var en bra iakttagelse, och att man kan testa det med varmare vatten.` }],

  'ak3-tema-014': [{ text:
`På vägen tillbaka fick Sana hålla i kartan. Hon vek ut den vid varje korsning, och till slut behövde hon inte fråga Jonas om vägen.` }],

  'ak3-tema-015': [{ text:
`Kim sa att alla har olika puls och att det inte är en tävling. Det viktiga är att märka förändringen.` }],

  'ak3-tema-017': [{ text:
`Efteråt satt Nora kvar i aulan. Hon tänkte att det roligaste inte var showen, utan alla veckor de övat.` }],

  'ak2-tema-005': [{ fore: 'De lade tillbaka burken', text:
`De la ner en teckning i burken. Sedan ritade de ett kryss där stenen låg.` }],

  'ak4-bamse-001': [{ text:
`På kvällen kom Vargen tillbaka till torget med en påse plommon. Han sa att de var till Bamse, men Bamse delade ut dem till barnen i stället.` }],

  'ak5-tema-009': [{ text:
`På utflyktsdagen regnade det lite, men ingen brydde sig. Liam hittade en gren som såg ut som ett svärd och glömde bort klätterparken helt.` }],

  'ak4-tema-001': [{ fore: 'Fortnite är gratis att ladda ner', text:
`Spelet ändras hela tiden. Nya säsonger byter kartan, lägger till föremål och tar bort andra. Det gör att även den som spelat länge måste lära om.` }],

  'ak5-tema-024': [{ fore: 'Poäng kan göras på flera sätt.', text:
`En match är åttio minuter lång och delas i två halvlekar. Domaren kan lägga till tid, och spelet fortsätter tills bollen är död.` }],

  'ak5-tema-023': [{ fore: 'Karriären i landslaget', text:
`Sedan 2010-talet har även damlandslaget fått mycket större uppmärksamhet. Fler matcher sänds på tv, och publiksiffrorna har ökat kraftigt.` }],

  'ak4-bamse-002': [{ text:
`Nästa vecka kom fler barn till den tysta timmen än förra gången. Skalman räknade dem i sin anteckningsbok.` }],

  'ak5-tema-011': [{ fore: 'Fågelflyttning visar hur djur anpassar sig', text:
`Flytten är farlig. Många fåglar dör av utmattning, dåligt väder eller brist på rastplatser längs vägen.` }],
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
  console.log(`${id.padEnd(16)} åk${String(t.grade).padStart(2)}  ${String(fore).padStart(3)} → ${String(n).padStart(3)} ord ${inom ? '✅' : `❌ krav ${min}–${max}`}`);
});

if (!dry) fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
else console.log('\n(dry run – inget skrivet)');
if (!ok) process.exit(1);
