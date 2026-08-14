#!/usr/bin/env node
//
// Delar in åtta texter i stycken.
//
// Nittio texter i biblioteket saknar styckebrytning helt. Åttiotvå av dem är
// åk 1–2 på 40–89 ord, alltså fyra till sju rader på skärmen. Att bryta upp
// "Maja är en katt. Hon är svart och vit." i stycken skulle inte hjälpa någon;
// texten är redan kort nog att överblicka. De lämnas som de är.
//
// De åtta som åtgärdas här är på 155–218 ord och renderas som en enda vägg av
// text. Där finns det verkliga innehållsbyten att markera, och en läsare som
// tappar raden har ingenting att hitta tillbaka till.
//
// Brytpunkterna är satta där texten faktiskt byter ämne, inte på jämna
// avstånd. Skriptet flyttar inte ett enda ord – det lägger bara in en tom rad
// före den mening som inleder ett nytt stycke, och kontrollerar att texten är
// identisk när radbrytningarna räknats bort.
//
// Kör med --dry för att se ändringarna utan att skriva.

const fs = require('fs');
const path = require('path');

// id → meningar som ska inleda ett nytt stycke, ordagrant ur texten.
const BRYT = {
  'ak3-tema-001': [
    'Familjen använder äpplena till många saker.',
    'Mormor säger att äpplen är nyttiga',
  ],
  // Bandet presenteras → de tittar på video → de gör armband.
  'ak3-tema-016': [
    'De tittar på en musikvideo på surfplattan.',
    'Efter mellis gör barnen egna',
  ],
  // Fatima gör spellistan → morfar förklarar refrängen → nästa dag med Viggo.
  'ak3-tema-018': [
    'När morfar kommer på besök får han lyssna.',
    'Nästa dag berättar hon för sin kompis Viggo i skolan.',
  ],
  // Workshopen och deltagarna → de tränar → avslutningen med färgband.
  'ak3-tema-019': [
    'Först tränar de en enkel serie',
    'Tuvas mamma filmar en kort stund',
  ],
  // Linus skriver → familjen hjälper till → låten blir klar.
  'ak3-tema-020': [
    'Lillasyster Maja hjälper till',
    'Till slut har de en låt om',
  ],
  // Tunnelbanan stannar → replikskiftet i vagnen → berättarens slutsats.
  'ak9-gpt-001': [
    'När ljuset fladdrade till hördes ett kort skratt längst bak.',
    'Jag såg hur flera lade undan sina telefoner',
  ],
  // Laboratoriet och begreppet → seminariet och etiken → vägen hem.
  'ak9-gpt-002': [
    'På seminariet den eftermiddagen kom etiken in som en kall luftström.',
    'När jag gick hem passerade jag en reklamaffisch',
  ],
  // Lektionen och biblioteket → mannen utanför butiken → slutsatsen om frihet.
  'ak9-gpt-003': [
    'På vägen hem såg vi en man stå utanför matbutiken',
    'Kanske är det just så: vi är fria i våra handlingar',
  ],
};

// ─── Körning ────────────────────────────────────────────────────────────────

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

const utanBrytning = (s) => s.replace(/\s+/g, ' ').trim();

let fel = 0;
const rader = [];

for (const [id, brytpunkter] of Object.entries(BRYT)) {
  const t = lib.find((x) => x.id === id);
  if (!t) {
    console.error(`${id}: finns inte`);
    fel++;
    continue;
  }
  if (t.text.includes('\n')) {
    console.error(`${id}: har redan styckebrytning – kanske redan körd?`);
    fel++;
    continue;
  }
  if (!brytpunkter) {
    console.error(`${id}: saknar brytpunkter i skriptet`);
    fel++;
    continue;
  }

  let ny = t.text;
  for (const b of brytpunkter) {
    if (!ny.includes(b)) {
      console.error(`${id}: hittar inte brytpunkten "${b}"`);
      fel++;
      continue;
    }
    ny = ny.replace(b, '\n\n' + b);
  }

  // Ingen bokstav får ha ändrats – bara radbrytningar tillkommit.
  if (utanBrytning(ny) !== utanBrytning(t.text)) {
    console.error(`${id}: texten ändrades, inte bara radbrytningarna`);
    fel++;
    continue;
  }

  rader.push({ t, ny, antal: brytpunkter.length + 1 });
}

if (fel) {
  console.error(`\n${fel} problem – inget skrivet.`);
  process.exit(1);
}

for (const r of rader) {
  r.t.text = r.ny;
  console.log(`${r.t.id.padEnd(16)} åk${String(r.t.grade).padStart(2)}  1 → ${r.antal} stycken   ${r.t.title}`);
}

const kvar = lib.filter((t) => !t.text.includes('\n')).length;
console.log(`\n${rader.length} texter indelade. Texter helt utan styckebrytning kvar: ${kvar}`);

if (!dry) {
  fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
  console.log('Skrivet.');
} else {
  console.log('(dry run – inget skrivet)');
}
