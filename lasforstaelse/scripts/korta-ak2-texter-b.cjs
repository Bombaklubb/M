#!/usr/bin/env node
//
// Del B: åtta åk 2-texter till, 120–124 ord ned till intervallet 65–90.
// Samma regel som i del A: allt som en fråga vilar på står kvar, och
// skriptet avbryter om ett nyckelord försvunnit ur texten.

const fs = require('fs');
const path = require('path');

const NYA = {

'ak3-tema-021': `Marabou är ett känt chokladmärke i Sverige. Företaget startade år 1916 i staden Sundbyberg. Namnet kommer från en fågel som heter maraboustork.

När fabriken började göra choklad ville de skapa något som många skulle tycka om. De gjorde mjölkchoklad som var söt och mjuk. Snart blev den populär i hela landet, och många familjer köpte den till helgen.

För att göra choklad behöver man kakao, socker och mjölk. Kakaon växer i varma länder långt från Sverige. I dag förknippar många märket med fika och högtider.`,

'ak1-miljo-04': `El är något vi använder varje dag. Lampor lyser med el. Ibland kommer el från vind, vatten eller sol.

Därför är det bra att spara el. När vi sparar el hjälper vi miljön.

Du kan spara el på enkla sätt. Du kan släcka lampan när du går ut ur ett rum. Du kan stänga av tv:n när ingen tittar. Du kan ta ut laddaren när den inte används.

I skolan kan klassen ha en "släckare" som påminner alla. Många små saker kan bli en stor hjälp.`,

'ak3-tema-012': `Milo skulle åka buss till simhallen med sin morfar. De stod vid hållplatsen tio minuter tidigt. Men när bussen skulle komma blev det stilla på vägen. En lastbil hade fått motorstopp längre fram.

Milo kände hur magen knöt sig. Tänk om de missade simlektionen! Morfar tog fram sin mobil och ringde trafikbolaget. En annan buss skulle snart köra en omväg och hämta dem.

När ersättningsbussen kom vinkade chauffören och fällde ut rampen. De kom fram lite sent, men simläraren sa att de gjorde rätt som väntade lugnt och följde informationen.`,

'ak4-tema-005': `Italien är ett land i södra Europa. Landet ser ut som en stövel på kartan. Huvudstaden heter Rom. Där finns många gamla byggnader från antiken, till exempel Colosseum.

Italien är känt för sin mat. Många tänker på pizza och pasta. Glassen gelato är också populär.

I norr ligger Alperna, där man kan åka skidor. I söder är klimatet varmare och många turister badar i havet.

Fotboll är en populär sport i Italien. Landet har också en lång historia med konst och musik.`,

'ak1-vanskap-08': `På morgonen satt Inez vid sitt bord. Då kom Hassan in i klassrummet. Han såg sig omkring och höll hårt i sin ryggsäck.

Inez såg att han tvekade. Hon flyttade sin stol lite och pekade på platsen bredvid.

"Du kan sitta här", sa Inez.

Hassan satte sig. "Tack", sa han.

Senare viskade Hassan: "Jag hittar inte mitt sudd." Inez gav honom ett extra. Hassan log.

På rasten byggde de en bana till en liten bil tillsammans. Vänskap kan börja med en plats och ett sudd.`,

'ak3-tema-025': `Många förknippar Marabou med olika högtider. Till jul kan choklad vara en del av julgodiset. Under påsken gömmer vuxna ibland chokladägg som barnen får leta efter. På födelsedagar kan en chokladkaka vara en enkel present.

En del tar med choklad när de ska hälsa på någon. Det kan vara ett sätt att visa uppskattning.

Samtidigt är det bra att inte äta för mycket sötsaker. Kroppen mår bäst av varierad mat och rörelse.

Reklam för choklad syns på tv och i affärer, särskilt före stora helger.`,

'ak2-tema-002': `Mitt under lunchen kände Amir att något var konstigt. Hans framtand gungade mer än vanligt. Han vågade inte bita i smörgåsen.

"Min tand gungar jättemycket", sa han till sin kompis Ella.

"Vicka på den!" sa Ella. "Min föll ut i ett äpple förra veckan."

Amir vickade försiktigt med tungan. Plötsligt lossnade tanden.

"Lägg den under kudden ikväll", sa Ella. "Då kanske tandfen kommer."

På kvällen lade Amir tanden under kudden. Nästa morgon låg där en blank femkrona.`,

'ak3-tema-004': `I en liten stad finns ett café som är känt för sin äppelpaj. Caféet drivs av Alex och deras pappa. Varje morgon skär de färska äpplen i tunna skivor. Sedan blandar de äpplena med lite socker och kanel. Doften sprider sig snabbt i köket.

Många gäster kommer just för att smaka pajen.

Ibland hjälper Alex kompis Kim till efter skolan. Kim serverar pajen med lite vaniljsås.

Alex tycker att äpplen är speciella eftersom de kan göra människor både mätta och glada.`,
};

const NYCKELORD = {
  'ak3-tema-021': ['1916', 'Sundbyberg', 'fågel', 'varma länder', 'mjölkchoklad', 'till helgen'],
  'ak1-miljo-04': ['Lampor lyser med el', 'släcka lampan', 'släckare', 'hjälper vi miljön', 'laddaren', 'små saker'],
  'ak3-tema-012': ['morfar', 'tio minuter tidigt', 'motorstopp', 'ringde trafikbolaget', 'fällde ut rampen', 'väntade lugnt'],
  'ak4-tema-005': ['Rom', 'pizza och pasta', 'I norr ligger Alperna', 'åka skidor', 'Fotboll', 'konst och musik'],
  'ak1-vanskap-08': ['Hassan', 'ett extra', 'en bana till en liten bil', 'flyttade sin stol', 'Hassan log', 'Vänskap kan börja'],
  'ak3-tema-025': ['påsken', 'chokladägg', 'på tv och i affärer', 'varierad mat', 'enkel present', 'uppskattning', 'före stora helger'],
  'ak2-tema-002': ['framtand', 'i ett äpple', 'under kudden', 'blank femkrona', 'vågade inte bita'],
  'ak3-tema-004': ['äppelpaj', 'socker och kanel', 'Kim', 'vaniljsås', 'Doften', 'mätta och glada'],
};

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;
Object.entries(NYA).forEach(([id, text]) => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error('Hittar inte ' + id); ok = false; return; }

  const saknas = (NYCKELORD[id] || []).filter(o => !text.toLowerCase().includes(o.toLowerCase()));
  if (saknas.length) {
    console.error(`${id}: nyckelord borta ur texten – ${saknas.join(', ')}`);
    ok = false; return;
  }

  const fore = t.text.trim().split(/\s+/).length;
  t.text = text;
  const n = text.trim().split(/\s+/).length;
  t.meta = { ...(t.meta || {}), wordCount: n };
  const inom = n >= 65 && n <= 90;
  if (!inom) ok = false;
  console.log(`${id.padEnd(18)} ${String(fore).padStart(4)} → ${String(n).padStart(3)} ord ${inom ? '✅' : '❌ krav 65–90'}  ${t.title}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
if (!ok) process.exit(1);
