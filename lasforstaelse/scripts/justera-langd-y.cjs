#!/usr/bin/env node
//
// De femton åk 6-texter som låg 1–27 ord under intervallet 400–415.
// Kör med --dry för att bara se ordräkningen utan att skriva.

const fs = require('fs');
const path = require('path');

const BAND = { 1:[40,60], 2:[65,90], 3:[150,165], 4:[200,220], 5:[300,320],
               6:[400,415], 7:[500,530], 8:[530,570], 9:[570,590], 10:[590,625] };

const TILLAGG = {
  'ak9-tema-011': [{ fore: 'När nedräkningen i simhallen', text:
`Samira jämför med sin kusin, som knappt minns några drömmar. Läraren säger att det är normalt: nästan alla drömmer varje natt, men hur mycket man minns skiljer sig mellan personer. Att inte minnas är inte samma sak som att inte drömma.` }],

  'ak9-tema-013': [{ fore: 'Efter några veckor kommer mardrömmen tillbaka', text:
`Forskning på klardrömmar är ung, eftersom en upplevelse som bara den sovande har tillgång till är svår att mäta. I vissa försök har deltagare kommit överens om bestämda ögonrörelser i förväg, som de sedan gör i drömmen.` }],

  'ak9-tema-004': [{ fore: 'När frågestunden kom', text:
`Linh nämnde också att CRISPR redan används utanför sjukvården. I växtförädling kan metoden ge sorter som tål torka bättre, och i laboratorier används den dagligen för att undersöka vad enskilda gener gör.` }],

  'ak9-tema-017': [{ fore: 'I dag ifrågasätts kostymens roll', text:
`Samtidigt är kostymen inte bara ett västerländskt plagg. Den spreds med handel och kolonialism, och i många länder bärs den i dag sida vid sida med plagg som har helt andra rötter.` }],

  'ak9-tema-002': [{ fore: 'Amina och Elliot skrev ett kort inlägg', text:
`Elliot påpekade en sak till: ingen i chatten hade frågat vem som tjänade på att ryktet spreds. Det var kanske den svåraste frågan, eftersom svaret inte alltid går att hitta.` }],

  'ak10-tema-004': [{ fore: 'Nyckeln är samtalskultur.', text:
`Plattformen spelar också roll. En tråd med teckenbegränsning gynnar korta, skarpa formuleringar, medan ett forum ger mer plats åt resonemang. Samma person kan låta mer tvärsäker på ett ställe än på ett annat.` }],

  'ak9-tema-003': [{ fore: 'Texten visar att industrialiseringen', text:
`Ett konkret spår finns kvar i landskapet. Många orter har fortfarande gatunamn efter bruket, arbetarbostäder i långa rader och en skorsten som står kvar sedan fabriken lades ner.` }],

  'ak10-tema-002': [{ fore: 'Att analysera översättning i Harry Potter', text:
`Tidspress påverkar också resultatet. När en bok ges ut i många länder får översättaren ibland bara några veckor på sig, och ändringar i senare delar kan avslöja att ett tidigt namnval blev olyckligt.` }],

  'ak10-tema-001': [{ fore: 'Att läsa Harry Potter med fokus på makt', text:
`Också språket bär på makt. Ministeriets skrivelser låter sakliga och opersonliga, medan motståndet talar om enskilda människor. Skillnaden gör tydligt vem som räknar i antal och vem som räknar i namn.` }],

  'ak9-tema-001': [{ fore: 'Efter lektionen gick Samir och Inga', text:
`Läraren nämnde också att en del kostnader inte syns förrän efteråt. Försäkringsbolag har börjat höja premier i områden som översvämmas ofta.` }],

  'ak10-tema-003': [{ fore: 'I gymnasiet kan man läsa dessa frågor', text:
`En tredje princip är att den som har mest makt bär störst ansvar, eftersom den har flest sätt att lösa en situation utan tvång.` }],

  'ak6-vetenskap-05': [{ fore: 'När de skrev sin rapport', text:
`Helena lät dem också mäta hur högt raketen flög genom att räkna sekunder till nedslaget. Det blev ungefär tolv meter.` }],

  'ak9-tema-012': [{ fore: 'När gymnasievalet närmar sig', text:
`På vägen hem från mötet räknar Linus hur många bänkar det finns mellan skolan och hemmet. Det blir tre.` }],

  'ak9-tema-005': [{ fore: 'Texten visar att språk är ett verktyg', text:
`Hon tänkte också på sin farmor, som byter dialekt så fort hon ringer hem till Norrland.` }],

  'ak7-teknik-02': [{ fore: 'Algoritmer kan vara smarta verktyg', text:
`I EU finns numera regler som kräver att stora plattformar förklarar hur deras rekommendationer fungerar.` }],
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
    if (!t.text.includes(d.fore)) { console.error(`${id}: hittar inte ankaret "${d.fore.slice(0, 40)}…"`); ok = false; return; }
    t.text = t.text.replace(d.fore, d.text + '\n\n' + d.fore);
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
