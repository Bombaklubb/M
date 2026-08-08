#!/usr/bin/env node
//
// Sats 1 av språkomskrivningarna: sju faktatexter i åk 1–2.
//
// Texterna hör hemma i sin årskurs till ämne och längd, men meningarna är för
// långa för läsaren. "Så fungerar en rast" vänder sig till sjuåringar och har
// meningar på upp till femton ord. Ämne, årskurs, ordantal och frågor lämnas
// orörda – bara meningsbyggnaden ändras.
//
// Måttet som styr är medellängden per mening, inte LIX. Svenska faktatexter om
// rymden eller choklad bär oundvikligen långa sammansättningar: astronauter,
// teleskop, kakaobönor, mjölkpulver. De går inte att byta bort utan att ämnet
// försvinner, och de håller uppe LIX hur korta meningarna än blir. Det som
// faktiskt hjälper en nybörjarläsare är kortare meningar, och det är vad som
// mäts här. LIX redovisas ändå, och får inte stiga.
//
// Varje omskrivning kontrolleras dessutom mot frågorna: alla ord som en fråga
// eller dess facit hänger på måste finnas kvar i texten. Se scripts/lib/fragestod.cjs.
//
// Kör med --dry för att se ändringarna utan att skriva.

const fs = require('fs');
const path = require('path');
const { saknade, lix, raknaOrd } = require('./lib/fragestod.cjs');

// Ordintervall per årskurs, samma som validatorn använder.
const BAND = { 1: [40, 60], 2: [65, 90] };
// Högsta godtagbara medellängd per mening.
const MAX_MENINGSLANGD = { 1: 8, 2: 10 };

const raknaMeningar = (s) => s.split(/[.!?]+/).filter((m) => m.trim().length > 0).length || 1;
const meningslangd = (s) => raknaOrd(s) / raknaMeningar(s);

const NYA = {
  'ak3-skola-013': `En rast är en paus mellan lektionerna. Då får du vila hjärnan. Du får också röra på kroppen. På rasten leker många på skolgården. Andra pratar med en kompis. Några äter lite mat. Ibland finns rastvakter ute. De hjälper om någon blir ledsen eller om det blir bråk. Sedan ringer det in. Då går alla in igen.`,

  'ak3-sport-014': `Uppvärmning är när man gör kroppen redo för att träna. Man kan jogga eller hoppa. Man kan röra armar och ben. När man värmer upp blir musklerna varmare. Blodet rör sig snabbare. Då är det lättare att röra sig. Man kan också minska risken att göra sig illa. Värm alltid upp innan den riktiga träningen börjar.`,

  'ak3-samhalle-009': `Ett bibliotek är en plats där man kan låna böcker. Där kan man läsa i lugn och ro. Det finns också tidningar, filmer och ibland spel. Biblioteket är öppet för alla. Det kostar oftast ingenting. Där får man hjälp att hitta en bok eller söka information. Många bibliotek har sagostunder och aktiviteter för barn.`,

  'ak4-vetenskap-rymd-001': `Rymden är det stora området utanför jorden. Där finns planeter, stjärnor och galaxer. Jorden är en av åtta planeter. Alla kretsar runt solen.

Solen är en stjärna. Den ger oss ljus och värme. Månen kretsar runt jorden. På natten lyser den.

Astronauter reser ut i rymden med raketer. I rymden finns nästan ingen luft. Därför måste astronauter ha speciella dräkter.

Forskare använder teleskop för att studera rymden. När de tittar på stjärnorna lär de sig mer om universum.`,

  'ak3-tema-023': `För att göra Marabous choklad börjar allt med kakaobönor. De växer på träd i varma länder nära ekvatorn. Bönder plockar bönorna. Sedan får bönorna torka i solen. De skickas med båt till fabriker i andra länder.

Först rostas bönorna. Då blir smaken starkare. Efter det mals de till en massa. I massan blandas socker. Ibland blandas också mjölkpulver i.

Sedan hälls chokladen i formar. Formarna kyls så att chokladen stelnar. Till sist packas plattorna och skickas till affärer.`,

  'ak3-tema-025': `Många tänker på Marabou när det är högtider. Till jul kan choklad vara en del av julgodiset. Under påsken gömmer vuxna ibland chokladägg. Barnen får leta efter dem. På en födelsedag kan en chokladkaka vara en enkel present.

En del tar med choklad när de hälsar på någon. Det kan visa uppskattning.

Men det är bra att inte äta för mycket sötsaker. Kroppen mår bäst av varierad mat och rörelse.

Reklam för choklad syns på tv och i affärer. Den syns extra ofta före stora helger.`,

  'ak3-tema-021': `Marabou är ett känt chokladmärke i Sverige. Företaget startade år 1916. Fabriken låg i staden Sundbyberg. Namnet kommer från en fågel. Fågeln heter maraboustork.

I fabriken ville de göra choklad som många skulle tycka om. De gjorde mjölkchoklad. Den var söt och mjuk. Snart blev den populär i hela landet. Många familjer köpte den till helgen.

För att göra choklad behöver man kakao, socker och mjölk. Kakaon växer i varma länder långt från Sverige. I dag tänker många på fika och högtider när de ser märket.`,
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
  const tak = MAX_MENINGSLANGD[t.grade];
  if (efterLangd > tak) {
    console.error(`${id}: ${efterLangd.toFixed(1)} ord/mening, taket för åk ${t.grade} är ${tak}`);
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

console.log('id                       åk   ord   ord/mening      LIX');
for (const r of rader) {
  r.t.text = r.nyText;
  r.t.meta = { ...(r.t.meta || {}), wordCount: r.ord };
  console.log(
    `${r.t.id.padEnd(24)} ${String(r.t.grade).padStart(2)} ${String(r.ord).padStart(5)}   ` +
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
