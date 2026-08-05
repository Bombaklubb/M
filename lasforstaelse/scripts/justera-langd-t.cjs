#!/usr/bin/env node
//
// Tretton texter i åk 1, 3 och 6 som låg 1–16 ord över sitt intervall.
// Här stryks eller kortas befintlig text; ingenting skrivs om i sak.
// NYCKELORD kontrollerar att formuleringar som frågorna bygger på finns kvar.
// Kör med --dry för att bara se ordräkningen utan att skriva.

const fs = require('fs');
const path = require('path');

const BAND = { 1:[40,60], 2:[65,90], 3:[150,165], 4:[200,220], 5:[300,320],
               6:[400,415], 7:[500,530], 8:[530,570], 9:[570,590], 10:[590,625] };

// Hela strängen tas bort ur texten.
const STRYK = {
  'ak5-tema-025': [
    ' Familjer, vänner och skolklasser samlas för att uppleva stämningen tillsammans.',
    ' Vissa har följt laget i flera decennier, medan andra är nya supportrar.',
  ],
  'ak5-tema-006': [
    ' Läkare kan lyssna på hjärtljuden med ett stetoskop för att kontrollera att allt fungerar som det ska.',
  ],
  'ak5-tema-008': [
    ' Olympus Mons på Mars är det högsta berget i hela solsystemet, nästan tre gånger så högt som Mount Everest.',
  ],
  'ak2-miljo-04': [
    ' Metall kan bli nya burkar eller delar till cyklar och bussar.',
    ' eller påsar',
  ],
  'ak4-vanskap-01': [
    ', långsamt, som när man öppnar en svår påse utan att riva sönder den',
  ],
  'ak5-tema-010': [
    ', som förbrukar mycket bränsle',
    ', från att reglera temperaturen till att transportera näringsämnen',
  ],
  'ak2-historia-07': [
    ' Vad är samma? Vad är olika?',
  ],
};

// Kortare omskrivningar där en hel mening inte kan strykas.
const ERSATT = {
  'ak3-djur-006': [{ fran: 'De märker var solen står på himlen och kan hålla rätt riktning.',
                     till: 'De märker var solen står och kan hålla rätt riktning.' }],
  'ak3-sport-014': [{ fran: 'blodet rör sig snabbare i kroppen', till: 'blodet rör sig snabbare' }],
  'ak1-natur-regn-001': [{ fran: 'Hon hoppar i en stor pöl.', till: 'Hon hoppar i en pöl.' }],
  'ak3-skola-013': [{ fran: 'När det ringer in igen samlas', till: 'När det ringer in samlas' }],
  'ak9-tema-015': [{ fran: 'Metoden känns barnslig först, men när hon testar märker hon att hjärnan kan lära sig nya spår.',
                     till: 'Metoden känns barnslig först, men hon märker att hjärnan kan lära sig nya spår.' }],
  'ak5-etik-05': [{ fran: 'Det kan kännas enkelt och tydligt.', till: 'Det kan kännas enkelt.' }],
  'ak2-historia-07': [{ fran: 'kan du jämföra:', till: 'kan du jämföra.' }],
};

// Formuleringar som frågorna bygger på och som måste finnas kvar.
const NYCKELORD = {
  'ak5-tema-025': ['vita tröjor med den röda rosen', 'funktionsvariationer', 'social händelse', 'stöttar de varandra', 'Respekt', 'Amir, Ella och Noa'],
  'ak5-tema-006': ['hundratusen gånger', 'syre från lungorna', 'fyra rum', 'springer', 'uthålliga', 'som en motor behöver bränsle'],
  'ak5-tema-008': ['järnoxid', 'flytande vatten', 'sju månader', 'inte finns tillräckligt med luft', 'atmosfär'],
  'ak2-miljo-04': ['lägga samma slags material tillsammans', 'Glas kan smältas och bli nya flaskor', 'Matrester kan göra papper blött', 'mindre energi', 'stor skillnad'],
  'ak4-vanskap-01': ['bänken vid klätterställningen', 'hopprep', 'log Hugo stort', 'varm i bröstet', 'Det går aldrig'],
  'ak5-tema-010': ['snabb energi', 'bygga och reparera muskler', 'dåligt rykte', 'Järn hjälper blodet', 'äta varierat'],
  'ak2-historia-07': ['skolplikt', 'hjälpte till hemma eller arbetade', 'böcker, datorer', 'öva och lära sig nya saker', 'människors liv'],
  'ak3-djur-006': ['doftspår', 'solen', 'samarbetar', 'stack'],
  'ak3-sport-014': ['gör kroppen redo', 'minska risken', 'blodet rör sig snabbare', 'några minuter innan'],
  'ak1-natur-regn-001': ['mörka moln', 'stövlar och regnjacka', 'pöl', 'regnbåge', 'genom fönstret'],
  'ak3-skola-013': ['paus mellan lektionerna', 'rastvakter', 'leker på skolgården', 'vila hjärnan'],
  'ak9-tema-015': ['prov hon inte hunnit plugga till', 'undvika att lägga sig', 'koffein, skärm, träning', 'alternativ fortsättning', 'gemensam middag', 'alarm'],
  'ak5-etik-05': ['alla får samma sak', 'nå upp till en hylla', 'extra tid på ett prov', 'olika behov', 'inte fusk', 'Menar jag att det inte är lika'],
};

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

const ids = [...new Set([...Object.keys(STRYK), ...Object.keys(ERSATT)])];
let ok = true;
ids.forEach(id => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error('Hittar inte ' + id); ok = false; return; }
  const fore = t.text.trim().split(/\s+/).length;

  (STRYK[id] || []).forEach(s => {
    if (!t.text.includes(s)) { console.error(`${id}: hittar inte "${s.trim().slice(0, 45)}…"`); ok = false; return; }
    t.text = t.text.replace(s, '');
  });
  (ERSATT[id] || []).forEach(e => {
    if (!t.text.includes(e.fran)) { console.error(`${id}: hittar inte "${e.fran.slice(0, 45)}…"`); ok = false; return; }
    t.text = t.text.replace(e.fran, e.till);
  });

  const saknas = (NYCKELORD[id] || []).filter(o => !t.text.toLowerCase().includes(o.toLowerCase()));
  if (saknas.length) { console.error(`${id}: nyckelord borta – ${saknas.join(', ')}`); ok = false; return; }

  const [min, max] = BAND[t.grade];
  const n = t.text.trim().split(/\s+/).length;
  t.meta = { ...(t.meta || {}), wordCount: n };
  const inom = n >= min && n <= max;
  if (!inom) ok = false;
  console.log(`${id.padEnd(20)} åk${String(t.grade).padStart(2)}  ${String(fore).padStart(3)} → ${String(n).padStart(3)} ord ${inom ? '✅' : `❌ krav ${min}–${max}`}`);
});

if (!dry) fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
else console.log('\n(dry run – inget skrivet)');
if (!ok) process.exit(1);
