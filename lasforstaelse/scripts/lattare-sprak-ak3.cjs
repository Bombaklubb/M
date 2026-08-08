#!/usr/bin/env node
//
// Sats 2 av språkomskrivningarna: fem faktatexter i åk 3.
//
// Samma princip som sats 1. Ämne, årskurs, ordantal och frågor lämnas orörda –
// bara meningsbyggnaden ändras. Måttet som styr är medellängden per mening,
// eftersom LIX hålls uppe av sammansättningar som hör till ämnet (järnoxid,
// kolhydrater, funktionsvariationer) och inte går att byta bort.
//
// Varje omskrivning kontrolleras mot frågorna: alla ord som en fråga eller dess
// facit hänger på måste finnas kvar. Se scripts/lib/fragestod.cjs.
//
// Kör med --dry för att se ändringarna utan att skriva.

const fs = require('fs');
const path = require('path');
const { saknade, lix, raknaOrd } = require('./lib/fragestod.cjs');

const BAND = { 3: [150, 165] };
const MAX_MENINGSLANGD = { 3: 12 };

const raknaMeningar = (s) => s.split(/[.!?]+/).filter((m) => m.trim().length > 0).length || 1;
const meningslangd = (s) => raknaOrd(s) / raknaMeningar(s);

const NYA = {
  'ak5-tema-008': `Mars kallas ibland den röda planeten. Ytan är täckt av järnoxid. Det är ett ämne som ger en roströd färg. Mars är den fjärde planeten från solen. Den är också en av jordens närmaste grannar i rymden.

Planeten är ungefär hälften så stor som jorden. Dess atmosfär är mycket tunn. Den består mest av koldioxid. Därför finns det inte tillräckligt med luft för människor att andas. På vintern kan temperaturen sjunka till minus hundratrettio grader.

Ändå har Mars likheter med jorden. Där finns årstider, istäcken vid polerna och vulkaner.

Forskare har skickat flera robotfordon till Mars. De kallas rovers och undersöker ytan. De har hittat spår som tyder på att det en gång kan ha funnits flytande vatten där. Det har gjort att många undrar om det funnits enkla livsformer på planeten.

I framtiden planerar rymdorganisationer att skicka människor till Mars. Det skulle bli den längsta rymdresan som människor gjort. Resan dit tar ungefär sju månader.`,

  'ak5-tema-010': `Maten vi äter ger kroppen energi och byggstenar. Kroppen behöver många olika ämnen för att fungera bra. Inget enskilt livsmedel innehåller allt.

Kolhydrater finns i bröd, pasta, ris och potatis. De ger snabb energi. De är särskilt viktiga för hjärnan. Protein finns i kött, fisk, bönor och ägg. Kroppen använder protein för att bygga och reparera muskler och andra vävnader.

Fett behövs också, även om det ibland har dåligt rykte. Fett hjälper kroppen att ta upp vissa vitaminer. Det skyddar också inre organ. Fett finns i nötter, olivolja och fisk.

Vitaminer och mineraler behövs i mindre mängder. Ändå är de nödvändiga. Järn hjälper blodet att transportera syre. C-vitamin stärker immunförsvaret. Frukt och grönsaker innehåller många av dessa ämnen.

Vatten är också avgörande. Kroppen består till stor del av vatten. Det behövs för nästan alla funktioner.

Att äta varierat är nyckeln. Genom att blanda olika sorters mat får kroppen det den behöver för att växa, tänka och röra sig.`,

  'ak5-tema-025': `Englands rugbylandslag har supportrar i alla åldrar. På matchdagar fylls gatorna runt arenan. Många bär vita tröjor med den röda rosen.

Bland fansen finns personer med olika bakgrund. Där finns också fans med funktionsvariationer. De kan delta tack vare tillgängliga platser på arenan.

Många beskriver matcherna som mer än bara sport. Det är en social händelse. Man träffar andra och delar glädje och besvikelse. När laget vinner firar supportrarna tillsammans. När laget förlorar stöttar de varandra.

Barn som Amir, Ella och Noa kan drömma om att själva spela i landslaget. De ser spelare med olika kroppstyper och erfarenheter. Det visar att det finns flera sätt att bidra till ett lag.

Rugbyns traditioner är viktiga för fansen. De sjunger sånger före matchen. De applåderar även motståndarna. Respekt är en central del av kulturen.

Genom åren har landslaget blivit en symbol för gemenskap. Var man än bor i landet kan man känna samhörighet när England spelar.`,

  'ak5-tema-006': `Ditt hjärta slår ungefär hundratusen gånger varje dag. Du behöver inte tänka på det. Hjärtat är en muskel som aldrig vilar. Dess uppgift är att pumpa blod genom hela kroppen.

Blodet transporterar syre från lungorna till alla kroppens celler. Cellerna behöver syre för att kunna arbeta, ungefär som en motor behöver bränsle. När cellerna har använt syret skickas blodet tillbaka till hjärtat. Sedan går det vidare till lungorna för att hämta nytt syre.

Hjärtat har fyra rum: två förmak och två kammare. Höger sida tar emot blod som behöver nytt syre och skickar det till lungorna. Vänster sida tar emot syrerikt blod och pumpar ut det i kroppen. Klaffar mellan rummen ser till att blodet bara flödar åt rätt håll.

När du springer eller blir rädd slår hjärtat snabbare. Kroppen behöver då mer syre. När du vilar lugnar det ner sig.

Hjärtat börjar slå redan innan vi föds. Det fortsätter hela livet. Därför är det en av kroppens mest uthålliga muskler.`,

  'ak4-tema-002': `Många barn och vuxna tycker om att spela Fortnite tillsammans. I spelet kan man bilda lag med två, tre eller fyra spelare. När man spelar i lag är samarbete viktigt. Spelarna kan prata med varandra genom headset. Då kan de planera hur de ska röra sig på kartan.

Om en spelare blir träffad kan lagkamrater hjälpa till att rädda personen. Därför behöver man tänka på varandra och inte bara på sig själv. Vissa lag delar upp roller. En samlar material medan en annan letar efter bra utrustning.

Samtidigt är det viktigt att följa regler och visa respekt. På nätet möter man människor man inte känner. Därför ska man inte dela personlig information. Det är också viktigt att ta pauser och inte spela för länge.

Fortnite kan vara roligt och socialt, men det kräver ansvar. Genom att samarbeta, vara schysst och tänka på säkerheten blir spelandet en positiv upplevelse för många.`,
};

// ─── Körning ────────────────────────────────────────────────────────────────

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let fel = 0;
const rader = [];

for (const [id, nyText] of Object.entries(NYA)) {
  const t = lib.find((x) => x.id === id);
  if (!t) {
    console.error(`${id}: finns inte i biblioteket`);
    fel++;
    continue;
  }
  const band = BAND[t.grade];
  if (!band) {
    console.error(`${id}: åk ${t.grade} saknar ordintervall i skriptet`);
    fel++;
    continue;
  }

  const ord = raknaOrd(nyText);
  if (ord < band[0] || ord > band[1]) {
    console.error(`${id}: ${ord} ord, utanför ${band[0]}–${band[1]}`);
    fel++;
  }

  const foreLangd = meningslangd(t.text);
  const efterLangd = meningslangd(nyText);
  if (efterLangd > MAX_MENINGSLANGD[t.grade]) {
    console.error(
      `${id}: ${efterLangd.toFixed(1)} ord/mening, taket för åk ${t.grade} är ${MAX_MENINGSLANGD[t.grade]}`
    );
    fel++;
  }
  if (efterLangd >= foreLangd) {
    console.error(`${id}: meningarna blev inte kortare (${foreLangd.toFixed(1)} → ${efterLangd.toFixed(1)})`);
    fel++;
  }

  const foreLix = lix(t.text);
  const efterLix = lix(nyText);
  if (efterLix > foreLix) {
    console.error(`${id}: LIX steg ${foreLix} → ${efterLix}`);
    fel++;
  }

  const tappade = saknade(t.text, nyText, t.questions);
  if (tappade.length) {
    console.error(`${id}: frågorna tappar underlag – saknade ord: ${tappade.join(', ')}`);
    fel++;
  }

  rader.push({ t, nyText, ord, foreLangd, efterLangd, foreLix, efterLix });
}

if (fel) {
  console.error(`\n${fel} problem – inget skrivet.`);
  process.exit(1);
}

console.log('id                 åk   ord   ord/mening      LIX');
for (const r of rader) {
  r.t.text = r.nyText;
  r.t.meta = { ...(r.t.meta || {}), wordCount: r.ord };
  console.log(
    `${r.t.id.padEnd(18)} ${String(r.t.grade).padStart(2)} ${String(r.ord).padStart(5)}   ` +
      `${r.foreLangd.toFixed(1).padStart(4)} → ${r.efterLangd.toFixed(1).padStart(4)}   ` +
      `${String(r.foreLix).padStart(3)} → ${String(r.efterLix).padStart(3)}`
  );
}

if (!dry) {
  fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
  console.log('\nSkrivet.');
} else {
  console.log('\n(dry run – inget skrivet)');
}
