#!/usr/bin/env node
//
// Tio texter med prefixet gy-uni- eller uni- låg på åk 6–7 trots att de är
// skrivna på universitetsnivå: publikationsbias, ansvarsdiffusion,
// scenario-osäkerhet. Biblioteket placerar redan gy-texter på åk 9, så
// gy-uni och uni hör ett steg över, på åk 10.
//
// Flytten innebär också att de måste nå åk 10:s intervall 590–625 ord.
//
// Del A: de fyra som redan låg på åk 7.

const fs = require('fs');
const path = require('path');

const FLYTT = {

'gy-uni-001': { grade: 10, tillagg: [
  { fore: 'Osäkerhet är inte bara brist på kunskap', text:
`Modeller får dessutom sitt eget liv när de sprids. En modell som byggts för ett avgränsat syfte kan senare användas för något helt annat, ofta av personer som inte känner till dess antaganden.` },
  { fore: 'När modeller används i policy', text:
`Det finns därför skäl att skilja mellan att en modell är fel och att den används fel. En termometer som visar rätt temperatur säger ingenting om huruvida det är lämpligt att gå ut, och en modell som räknar rätt kan ändå besvara en annan fråga än den som ställdes.` },
]},

'gy-uni-005': { grade: 10, tillagg: [
  { fore: 'Ett annat förslag är att lägga ansvar', text:
`Rättsligt har frågan börjat få svar. EU:s AI-förordning delar in system efter risk och ställer krav på dokumentation, mänsklig tillsyn och möjlighet att ifrågasätta beslut i de fall som klassas som högrisk, dit rekrytering och kreditbedömning hör. Dataskyddsförordningen ger dessutom en rätt att inte bli föremål för beslut som enbart bygger på automatisk behandling när beslutet får rättsliga följder.` },
  { fore: 'Samtidigt finns en avvägning mellan insyn', text:
`Ett återkommande problem är att den mänskliga tillsynen kan bli formell snarare än reell. Forskning om automationsbias visar att människor tenderar att lita på ett systems förslag även när de har underlag för att ifrågasätta det, och att benägenheten ökar när tempot är högt och ansvaret upplevs som delat. En kryssruta där en handläggare godkänner ett förslag skapar alltså inte i sig någon kontroll.

Detta gör att utformningen av arbetet spelar lika stor roll som utformningen av tekniken. Om en handläggare har tre minuter per ärende och femtio ärenden om dagen blir granskningen en formalitet oavsett vad regelverket kräver.` },
]},

'uni-tema-001': { grade: 10, tillagg: [
  { fore: 'Källkritik i akademiska sammanhang', text:
`Ett besläktat fenomen är illusionen av sanning. Upprepning i sig gör ett påstående mer trovärdigt, oavsett om det är sant, eftersom det som känns bekant också känns rimligt. Effekten uppträder även hos personer som vet bättre, vilket gör den svår att skydda sig mot enbart med kunskap.` },
  { fore: 'Slutligen spelar transparens och osäkerhet', text:
`Rättelser fungerar dessutom sämre än man kan tro. En korrigering når sällan lika många som det ursprungliga påståendet, och den kan i vissa fall göra att man minns påståendet bättre än rättelsen. Det som visat sig fungera bäst är att ersätta den felaktiga uppgiften med en fullständig alternativ förklaring, inte bara att konstatera att den var fel.

En praktisk metod som utvecklats av faktagranskare är lateral läsning: i stället för att stanna kvar på sidan och bedöma den utifrån hur den ser ut öppnar man nya flikar och tar reda på vem avsändaren är. Studier tyder på att metoden ger bättre bedömningar än den traditionella genomgången av en enskild sidas innehåll och utseende.` },
]},

'uni-tema-005': { grade: 10, tillagg: [
  { fore: 'Dessutom påverkar val av modell och variabler', text:
`Ett näraliggande problem är hur resultat väljs ut för publicering. Studier som visar tydliga samband publiceras oftare än de som inte gör det, vilket gör att den samlade litteraturen kan ge en skevare bild än de enskilda studierna. Fenomenet kallas publikationsbias och är en av anledningarna till att forskare i dag ofta registrerar sina hypoteser innan de samlar in data, så att en utebliven effekt också blir dokumenterad.` },
  { fore: 'Slutligen är generaliserbarhet', text:
`Även hur analysen görs kan påverka utfallet. Samma dataset kan analyseras på många rimliga sätt, och när flera forskargrupper fått samma data och samma fråga har de ibland kommit fram till olika svar utan att någon av dem gjort något uppenbart fel.

Visualiseringen är inte heller neutral. En axel som inte börjar på noll kan få en liten skillnad att se dramatisk ut, och valet av tidsintervall kan förvandla en tillfällig svacka till en trend. Att läsa ett diagram kritiskt innebär därför att först titta på axlarna och sedan på kurvan.` },
]},
};

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;
Object.entries(FLYTT).forEach(([id, d]) => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error('Hittar inte ' + id); ok = false; return; }
  const foreG = t.grade;
  const foreN = t.text.trim().split(/\s+/).length;

  d.tillagg.forEach(a => {
    if (!t.text.includes(a.fore)) {
      console.error(`${id}: hittar inte ankaret "${a.fore.slice(0, 40)}…"`); ok = false; return;
    }
    t.text = t.text.replace(a.fore, a.text + '\n\n' + a.fore);
  });

  t.grade = d.grade;
  const n = t.text.trim().split(/\s+/).length;
  t.meta = { ...(t.meta || {}), wordCount: n };
  const inom = n >= 590 && n <= 625;
  if (!inom) ok = false;
  console.log(`${id.padEnd(14)} åk${foreG} → åk${d.grade}   ${String(foreN).padStart(4)} → ${String(n).padStart(4)} ord ${inom ? '✅' : '❌ krav 590–625'}  ${t.title.slice(0, 42)}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
if (!ok) process.exit(1);
