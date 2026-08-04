#!/usr/bin/env node
//
// De tre åk 7-texterna om solsystemet låg drygt 100 ord under intervallet
// 500–530. Tilläggen är valda så att de inte upprepar de tre åk 10-texterna
// om samma ämne: månarnas variation och avstånden i den första,
// månlandningarna och gravitationsslungan i den andra, kroppens reaktion på
// tyngdlöshet och rättsläget i den tredje.

const fs = require('fs');
const path = require('path');

const TILLAGG = {

'akgy-tema-010': [
  { fore: 'Utanför Neptunus ligger Kuiperbältet', text:
`Månarna är i sig en egen värld av variation. Jupiter har fyra stora månar som upptäcktes redan på 1600-talet, och en av dem, Io, är den vulkaniskt mest aktiva kroppen i hela solsystemet. Saturnus måne Titan har en tät atmosfär och sjöar av flytande metan, medan Enceladus sprutar ut vattenånga genom sprickor i sin isskorpa. Under isen tros det finnas ett hav.` },
  { fore: 'Solsystemet är inte statiskt.', text:
`Avstånden är svåra att föreställa sig. Ljuset från solen tar drygt åtta minuter att nå jorden, men över fyra timmar att nå Neptunus. En radiosignal till en sond vid solsystemets yttre kant kan därför ta ett halvt dygn fram och tillbaka, vilket gör att sonderna måste kunna fatta vissa beslut på egen hand.` },
],

'akgy-tema-011': [
  { fore: 'Rymdsonder har haft en särskilt viktig roll.', text:
`Den mest kända bemannade insatsen är månlandningarna. Mellan 1969 och 1972 landade tolv människor på månen inom Apolloprogrammet, och de förde med sig tillbaka nästan fyrahundra kilo sten och stoft. Proverna analyseras fortfarande, och en del av dem har medvetet lämnats orörda i väntan på bättre instrument än de som fanns när proverna hämtades.` },
  { fore: 'Mars har länge varit ett centralt mål', text:
`En teknik som gjort de långa uppdragen möjliga är gravitationsslungan. Genom att låta en sond passera nära en planet lånar den en liten del av planetens rörelseenergi och får en hastighetsökning som annars hade krävt mer bränsle än vad som får plats ombord. Voyagersonderna kunde nå de yttre planeterna just tack vare ett ovanligt planetläge som bara inträffar vart hundrasjuttionde år.` },
],

'akgy-tema-012': [
  { fore: 'Månen betraktas ofta som ett första steg', text:
`Kroppen far illa av att vistas länge i tyngdlöshet. Muskler och skelett bryts ned när de inte längre behöver bära någon vikt, och astronauter på rymdstationen tränar därför flera timmar om dagen för att bromsa förloppet. Vätskan i kroppen förskjuts uppåt, vilket påverkar synen hos många. Strålningen utanför jordens magnetfält är dessutom en risk som ännu inte är löst.` },
  { fore: 'Utvecklingen av rymdteknik sker genom samarbete', text:
`En annan svårighet är att få ett slutet kretslopp att fungera. På jorden återanvänds luft och vatten av naturen själv; i en bas måste allt byggas och skötas.` },
  { fore: 'Det finns också etiska frågor', text:
`Vem som äger vad är dessutom oklart. Ett internationellt avtal från 1967 slår fast att ingen stat får göra anspråk på månen eller någon annan himlakropp, men det säger mindre om företag och om utvinning av resurser.` },
],
};

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;
Object.entries(TILLAGG).forEach(([id, delar]) => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error('Hittar inte ' + id); ok = false; return; }
  const fore = t.text.trim().split(/\s+/).length;
  delar.forEach(d => {
    if (!t.text.includes(d.fore)) {
      console.error(`${id}: hittar inte ankaret "${d.fore.slice(0, 40)}…"`); ok = false; return;
    }
    t.text = t.text.replace(d.fore, d.text + '\n\n' + d.fore);
  });
  const n = t.text.trim().split(/\s+/).length;
  t.meta = { ...(t.meta || {}), wordCount: n };
  const inom = n >= 500 && n <= 530;
  if (!inom) ok = false;
  console.log(`${id.padEnd(16)} ${String(fore).padStart(4)} → ${String(n).padStart(4)} ord ${inom ? '✅' : '❌ krav 500–530'}  ${t.title}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
if (!ok) process.exit(1);
