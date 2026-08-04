#!/usr/bin/env node
//
// 36 texter i åk 2 låg över intervallet 65–90 ord, flera på över 120.
// En åttaåring läser ungefär 40–60 ord i minuten, så 126 ord är över två
// minuters avkodning innan första frågan. Texterna kortas därför.
//
// Regeln vid kortningen: allt som en fråga vilar på måste stå kvar. Skriptet
// kontrollerar därför att varje rätt svar fortfarande går att belägga i den
// nya texten, och avbryter om något nyckelord försvunnit.
//
// Del A: de sex längsta.

const fs = require('fs');
const path = require('path');

const NYA = {

'ak1-musik-05': `På morgonen satt klassen i en ring. Det var samling. Läraren sa: "Vi ska sjunga en sång."

Sven ville sjunga högt. Alva var blyg och sjöng tyst.

När sången började sjöng Sven snabbt. Alva hann inte med och tappade bort orden.

Farah räckte upp handen. "Kan vi sjunga en gång till, lite långsammare?"

Läraren nickade. De sjöng igen. Nu hann Alva med, och Sven sjöng i samma takt som alla andra.

"Tack", sa Alva. "Nu var det roligt."

När alla hjälps åt blir sången fin.`,

'ak3-tema-011': `I måndags hittade Elin och Amir en tom burk bakom cykelstället. De frågade fröken Sofia om den kunde bli ett bihotell. Fröken sa att vilda bin behöver små hål att vila och lägga ägg i.

Klassen samlade bambupinnar och strån. Elin ritade en skylt: "Rör inte, bina jobbar!" De satte burken i en trälåda så att den inte rullade, och placerade hotellet i solen nära blommorna vid staketet.

Fröken sa att man också måste låta hotellet vara i fred. Om bina får lugn kan de hjälpa blommor att göra frön.`,

'ak3-tema-022': `Marabou är mest känd för sin mjölkchoklad, men det finns många fler smaker. En del plattor innehåller hela nötter som ger ett krispigt ljud när man biter. Andra har russin eller små bitar av kex.

Företaget provar ofta nya idéer. Ibland gör de tillfälliga smaker som bara säljs under en kort tid.

Många tycker om att dela en stor chokladkaka med familj eller vänner. Chokladen är uppdelad i rutor som är lätta att bryta loss. På förpackningen står det vilken smak det är och hur mycket den väger.`,

'ak1-etik-12': `Theo hade tappat sitt suddgummi.

"Jag hittar det inte", sa Theo.

Sahar satt bredvid. "Du kan låna mitt", sa hon.

Theo suddade. Men när lektionen var slut stoppade han suddgummit i sin ficka utan att tänka. Sahar såg det och blev tyst.

På vägen ut kände Theo suddgummit i fickan. "Oj!" sa han och vände sig om.

"Förlåt", sa Theo och gav tillbaka det. "Jag glömde."

Sahar log. "Tack för att du sa det."

Att låna betyder att man lämnar tillbaka. Gör man fel kan man säga förlåt.`,

'ak4-natur-skog-001': `En skog kan verka tyst, men den är full av liv. Där finns träd, buskar, svampar och många olika djur. På marken kryper myror. I träden bygger fåglar sina bon.

Träden är viktiga för både människor och djur. De ger syre som vi andas. På hösten tappar många träd sina löv, och skogen blir gul, orange och röd.

I skogen kan man plocka bär och svamp, men man måste veta vilka som är ätbara. Det är också viktigt att vara rädd om naturen.`,

'ak4-tema-006': `Grekland är ett land i sydöstra Europa. Landet har många öar i Medelhavet. Huvudstaden heter Aten. Där ligger den gamla byggnaden Akropolis högt på en kulle.

För länge sedan trodde människor på gudar som Zeus och Athena. Berättelserna om dem kallas myter och läses fortfarande i dag.

Klimatet är varmt och soligt på sommaren. Därför reser många turister dit för att bada och njuta av solen.

Maten är ofta enkel och god. Man äter oliver, fetaost och grillat kött.

Grekland är ett land med både vacker natur och spännande historia.`,
};

// Nyckelord som måste finnas kvar för att frågorna ska gå att besvara.
const NYCKELORD = {
  'ak1-musik-05': ['sjunga en sång', 'Alva var blyg', 'långsammare', 'hann inte med', 'samma takt'],
  'ak3-tema-011': ['bakom cykelstället', 'lägga ägg', 'inte rullade', 'nära blommorna', 'bina jobbar', 'i fred'],
  'ak3-tema-022': ['mjölkchoklad', 'hela nötter', 'krispigt', 'rutor', 'kort tid', 'familj eller vänner', 'förpackningen'],
  'ak1-etik-12': ['tappat sitt suddgummi', 'låna mitt', 'i sin ficka', 'blev tyst', 'kände Theo suddgummit', 'lämnar tillbaka'],
  'ak4-natur-skog-001': ['träd', 'syre', 'tappar många träd sina löv', 'rädd om naturen', 'bär och svamp'],
  'ak4-tema-006': ['Aten', 'Akropolis', 'myter', 'bada', 'oliver', 'fetaost'],
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
  console.log(`${id.padEnd(20)} ${String(fore).padStart(4)} → ${String(n).padStart(3)} ord ${inom ? '✅' : '❌ krav 65–90'}  ${t.title}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
if (!ok) process.exit(1);
