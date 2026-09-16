#!/usr/bin/env node
//
// Tio texter till på nivå 1, samma steg som sats b.
//
// Nivån har nu 35 texter på 14–22 ord. De här ligger på 18–22 med meningar på
// högst fem ord, alltså i linje med de tio föregående. En sjuåring som läser
// ett par texter om dagen ska inte vara igenom nivån på en vecka.
//
// Ämnena är valda för att inte upprepa de 25 som redan finns: vanten, nyckel-
// pigan, pannkakorna, gungan, igelkotten, paraplyet, ryggsäcken, blåbären,
// maskrosen och brevet.
//
// Bilderna är sökta hos Unsplash, nedladdade och granskade en och en.
//
// Kör med --dry för att se vad som skulle läggas till utan att skriva.

const fs = require('fs');
const path = require('path');

const BILD = (slug) => `https://images.unsplash.com/${slug}?w=600&h=400&fit=crop`;

const N = (id, title, slug, text, questions) => ({
  id,
  grade: 1,
  genre: 'berättelse',
  theme: 'vardag',
  title,
  imageUrl: BILD(slug),
  text,
  questions,
});

const TEXTER = [
  N('ak1-lattlast-26', 'Vanten på grenen', 'photo-1730098016553-2844f370607d',
    'Jag tappar min vante.\n\nVi letar länge.\n\nDen hänger på en gren.\n\nMamma hittar den.\n\nNu är handen varm.',
    [
      { type: 'literal', q: 'Vad tappar jag?', options: ['Min vante', 'Min mössa', 'Min sko', 'Min bok'], correct: 0 },
      { type: 'literal', q: 'Var hänger vanten?', options: ['På en krok', 'På en gren', 'På en bänk', 'På en gren i häcken'], correct: 1 },
      { type: 'literal', q: 'Vem hittar vanten?', options: ['Jag själv', 'Pappa', 'Mamma', 'En granne'], correct: 2 },
      { type: 'ord', q: 'Vad betyder letar?', options: ['Kastar bort', 'Springer hem', 'Ropar högt', 'Söker efter'], correct: 3 },
      { type: 'inferens', q: 'Varför blir handen varm?', options: ['För att vanten är på igen', 'För att solen skiner', 'För att jag springer fort', 'För att vi går inomhus'], correct: 0 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['En kall vinterdag', 'En vante som hittas', 'En gren som knäcks', 'En mamma som fryser'], correct: 1 },
    ]),

  N('ak1-lattlast-27', 'Nyckelpigan', 'photo-1508232926939-f05374492c7b',
    'En nyckelpiga sitter på bladet.\n\nDen är röd med prickar.\n\nJag räknar prickarna.\n\nDet är sju.\n\nSedan flyger den bort.',
    [
      { type: 'literal', q: 'Var sitter nyckelpigan?', options: ['På en sten', 'På min hand', 'På bladet', 'På en pinne'], correct: 2 },
      { type: 'literal', q: 'Vilken färg är nyckelpigan?', options: ['Röd', 'Gul', 'Grön', 'Brun'], correct: 0 },
      { type: 'literal', q: 'Hur många prickar är det?', options: ['Tre', 'Fem', 'Nio', 'Sju'], correct: 3 },
      { type: 'ord', q: 'Vad betyder räknar?', options: ['Målar dem', 'Tar reda på antalet', 'Tvättar bort dem', 'Ritar av dem'], correct: 1 },
      { type: 'literal', q: 'Vad gör nyckelpigan sist?', options: ['Den flyger bort', 'Den somnar', 'Den äter ett blad', 'Den kryper ner'], correct: 0 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['Ett blad som faller', 'En pojke som räknar', 'En liten nyckelpiga', 'En trädgård på våren'], correct: 2 },
    ]),

  N('ak1-lattlast-28', 'Pannkakor', 'photo-1541288097308-7b8e3f58c4c6',
    'Vi äter pannkakor idag.\n\nMamma vänder dem i pannan.\n\nJag tar sylt.\n\nLillebror tar socker.\n\nTallriken blir tom fort.',
    [
      { type: 'literal', q: 'Vad äter de?', options: ['Bullar', 'Pannkakor', 'Soppa', 'Gröt'], correct: 1 },
      { type: 'literal', q: 'Vem vänder pannkakorna?', options: ['Mamma', 'Pappa', 'Lillebror', 'Jag'], correct: 0 },
      { type: 'literal', q: 'Vad tar lillebror?', options: ['Sylt', 'Smör', 'Socker', 'Mjölk'], correct: 2 },
      { type: 'ord', q: 'Vad betyder vänder?', options: ['Skär i små bitar', 'Rör om i pannan', 'Tar bort från plattan', 'Vänder upp och ner'], correct: 3 },
      { type: 'inferens', q: 'Varför blir tallriken tom fort?', options: ['För att de smakar gott', 'För att de är för små', 'För att hunden äter upp', 'För att de blir kalla'], correct: 0 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['En dag i skolan', 'En måltid hemma', 'En panna som går sönder', 'En resa till affären'], correct: 1 },
    ]),

  N('ak1-lattlast-29', 'Gungan', 'photo-1460788150444-d9dc07fa9dba',
    'Jag sitter i gungan.\n\nPappa knuffar på.\n\nJag flyger högt upp.\n\nMagen kittlar.\n\nJag vill gunga mer.',
    [
      { type: 'literal', q: 'Var sitter jag?', options: ['I sandlådan', 'På en bänk', 'I gungan', 'I en bil'], correct: 2 },
      { type: 'literal', q: 'Vem knuffar på?', options: ['Pappa', 'Mamma', 'En kompis', 'Fröken'], correct: 0 },
      { type: 'ord', q: 'Vad betyder kittlar?', options: ['Gör riktigt ont', 'Pirrar lite', 'Blir alldeles kallt', 'Känns tungt'], correct: 1 },
      { type: 'literal', q: 'Vad vill jag på slutet?', options: ['Gå hem', 'Äta lunch', 'Sova en stund', 'Gunga mer'], correct: 3 },
      { type: 'inferens', q: 'Hur känns det att gunga?', options: ['Det är roligt', 'Det är läskigt', 'Det är tråkigt', 'Det gör ont'], correct: 0 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['En pappa som jobbar', 'En rast i skolan', 'En stund i gungan', 'En lek i sanden'], correct: 2 },
    ]),

  N('ak1-lattlast-30', 'Igelkotten i häcken', 'photo-1748590601542-2ed4702e6c90',
    'En igelkott bor i häcken.\n\nDen kommer fram på kvällen.\n\nVi ställer ut vatten.\n\nIgelkotten dricker.\n\nSedan går den hem.',
    [
      { type: 'literal', q: 'Var bor igelkotten?', options: ['Under trappan', 'I häcken', 'I ett träd', 'I gräset'], correct: 1 },
      { type: 'literal', q: 'När kommer den fram?', options: ['På morgonen', 'Mitt på dagen', 'På kvällen', 'Vid lunch'], correct: 2 },
      { type: 'literal', q: 'Vad ställer vi ut?', options: ['Mat', 'Mjölk', 'En skål bär', 'Vatten'], correct: 3 },
      { type: 'ord', q: 'Vad är en häck?', options: ['Rad med buskar', 'Hög med löv', 'Litet hus', 'Djup grop'], correct: 0 },
      { type: 'inferens', q: 'Varför dricker igelkotten?', options: ['För att den är rädd', 'För att den är törstig', 'För att vattnet är kallt', 'För att vi ropar'], correct: 1 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['En häck som klipps', 'En kväll i skogen', 'En igelkott i trädgården', 'En skål som går sönder'], correct: 2 },
    ]),

  N('ak1-lattlast-31', 'Paraplyet', 'photo-1580051235428-f88ae8a2d53b',
    'Det regnar på vägen hem.\n\nMitt paraply har många färger.\n\nJag håller det högt.\n\nRegnet trummar ovanpå.\n\nJag blir inte blöt.',
    [
      { type: 'literal', q: 'Hur är vädret?', options: ['Det snöar', 'Det blåser', 'Det är sol', 'Det regnar'], correct: 3 },
      { type: 'literal', q: 'Hur är paraplyet?', options: ['Det har många färger', 'Det är alldeles svart', 'Det är litet och grått', 'Det är trasigt'], correct: 0 },
      { type: 'ord', q: 'Vad betyder trummar?', options: ['Lyser starkt', 'Låter som slag', 'Luktar gott', 'Känns varmt'], correct: 1 },
      { type: 'literal', q: 'Hur håller jag paraplyet?', options: ['Lågt ner', 'Under armen', 'Högt upp', 'Bakom ryggen'], correct: 2 },
      { type: 'inferens', q: 'Varför blir jag inte blöt?', options: ['För att regnet slutar', 'För att jag springer', 'För att jag har stövlar', 'För att paraplyet skyddar'], correct: 3 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['En väg hem i regn', 'En pöl på gården', 'Ett paraply som går sönder', 'En dag med sol'], correct: 0 },
    ]),

  N('ak1-lattlast-32', 'Min ryggsäck', 'photo-1504424715129-fa3bcb0b8903',
    'Min ryggsäck är grön.\n\nI den finns matlådan.\n\nDär finns också en bok.\n\nDen känns tung.\n\nMen jag bär den själv.',
    [
      { type: 'literal', q: 'Vilken färg är ryggsäcken?', options: ['Blå', 'Grön', 'Röd', 'Gul'], correct: 1 },
      { type: 'literal', q: 'Vad finns i ryggsäcken?', options: ['En boll och en vante', 'En matlåda och en bok', 'En jacka och en mössa', 'En penna och ett sudd'], correct: 1 },
      { type: 'literal', q: 'Hur känns ryggsäcken?', options: ['Lätt', 'Blöt', 'Tung', 'Kall'], correct: 2 },
      { type: 'ord', q: 'Vad betyder bär?', options: ['Tappar ner', 'Öppnar upp', 'Ger bort', 'Håller med sig'], correct: 3 },
      { type: 'inferens', q: 'Vad visar att jag är stolt?', options: ['Att jag bär den själv', 'Att den är grön', 'Att boken är tjock', 'Att matlådan är full'], correct: 0 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['En bok som tappas bort', 'En ryggsäck till skolan', 'En matlåda med mat', 'En dag på rasten'], correct: 1 },
    ]),

  N('ak1-lattlast-33', 'Blåbär i skogen', 'photo-1601721360034-a775cf0b7c63',
    'Vi plockar blåbär i skogen.\n\nHänderna blir blå.\n\nMunnen blir också blå.\n\nHinken blir full.\n\nHemma bakar vi paj.',
    [
      { type: 'literal', q: 'Vad plockar vi?', options: ['Svamp', 'Blåbär', 'Löv', 'Kottar'], correct: 1 },
      { type: 'literal', q: 'Var plockar vi?', options: ['I skogen', 'I parken', 'I trädgården', 'Vid sjön'], correct: 0 },
      { type: 'literal', q: 'Vad blir blått?', options: ['Skorna', 'Jackan', 'Händerna', 'Hinken'], correct: 2 },
      { type: 'ord', q: 'Vad betyder full?', options: ['Alldeles tom', 'Ganska liten', 'Mycket tung', 'Så mycket det ryms'], correct: 3 },
      { type: 'inferens', q: 'Varför blir munnen blå?', options: ['För att jag äter bär', 'För att det är kallt', 'För att jag sjunger', 'För att hinken läcker'], correct: 0 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['En hink som går sönder', 'En dag med bärplockning', 'En paj som bränns', 'En promenad i regn'], correct: 1 },
    ]),

  N('ak1-lattlast-34', 'Maskrosen', 'photo-1544954412-78da2cfa1a0c',
    'Jag hittar en maskros.\n\nDen är vit och lurvig.\n\nJag blåser på den.\n\nFröna flyger iväg.\n\nDe ser ut som snö.',
    [
      { type: 'literal', q: 'Vad hittar jag?', options: ['En sten', 'En fjäder', 'En maskros', 'En pinne'], correct: 2 },
      { type: 'literal', q: 'Hur är maskrosen?', options: ['Vit och lurvig', 'Gul och platt', 'Grön och våt', 'Brun och torr'], correct: 0 },
      { type: 'literal', q: 'Vad gör jag med den?', options: ['Plockar bort den', 'Blåser på den', 'Gräver ner den', 'Vattnar den'], correct: 1 },
      { type: 'ord', q: 'Vad är frön?', options: ['Små droppar vatten', 'Bitar av jord', 'Små korn som växer', 'Delar av en sten'], correct: 2 },
      { type: 'inferens', q: 'Varför liknar fröna snö?', options: ['För att de är kalla', 'För att de smälter', 'För att marken är vit', 'För att de är vita och lätta'], correct: 3 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['En blomma som blåses på', 'En vinterdag med snö', 'En pojke som fryser', 'En äng full med gräs'], correct: 0 },
    ]),

  N('ak1-lattlast-35', 'Brevet i lådan', 'photo-1577567751159-fdaaba7b2032',
    'Ett brev ligger i lådan.\n\nDet är till mig.\n\nFarmor har skrivit.\n\nHon ritar en sol.\n\nJag sätter brevet på väggen.',
    [
      { type: 'literal', q: 'Vad ligger i lådan?', options: ['En tidning', 'Ett brev', 'Ett paket', 'En bok'], correct: 1 },
      { type: 'literal', q: 'Vem har skrivit?', options: ['Farmor', 'Mamma', 'En kompis', 'Fröken'], correct: 0 },
      { type: 'literal', q: 'Vad ritar hon?', options: ['Ett hus', 'En katt', 'En sol', 'En båt'], correct: 2 },
      { type: 'literal', q: 'Var sätter jag brevet?', options: ['I lådan', 'Under sängen', 'I väskan', 'På väggen'], correct: 3 },
      { type: 'inferens', q: 'Varför sätter jag upp brevet?', options: ['För att jag blir glad av det', 'För att väggen är tom', 'För att lådan är full', 'För att farmor sagt det'], correct: 0 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['En låda som töms', 'Ett brev från farmor', 'En sol som lyser', 'En vägg som målas'], correct: 1 },
    ]),
];

// Rätt svars plats per text. Utan styrning hamnar flera texter på samma trappa,
// och ett barn som läser tio korta texter i rad hinner se ett sådant mönster.
// Rotationen flyttar bara platserna, inte formuleringarna.
const PLATSER = {
  'ak1-lattlast-26': [0, 2, 1, 3, 0, 2],
  'ak1-lattlast-27': [2, 0, 3, 1, 0, 3],
  'ak1-lattlast-28': [1, 3, 2, 0, 1, 3],
  'ak1-lattlast-29': [3, 1, 0, 2, 3, 1],
  'ak1-lattlast-30': [0, 1, 3, 2, 0, 1],
  'ak1-lattlast-31': [2, 3, 1, 0, 2, 3],
  'ak1-lattlast-32': [1, 0, 2, 3, 1, 0],
  'ak1-lattlast-33': [3, 2, 0, 1, 3, 2],
  'ak1-lattlast-34': [0, 3, 2, 1, 0, 3],
  'ak1-lattlast-35': [2, 1, 3, 0, 2, 1],
};

TEXTER.forEach((t) => {
  const mal = PLATSER[t.id];
  t.questions.forEach((q, i) => {
    const steg = (mal[i] - q.correct + 4) % 4;
    if (steg === 0) return;
    q.options = q.options.slice(4 - steg).concat(q.options.slice(0, 4 - steg));
    q.correct = mal[i];
  });
});

// ── Kontroll och skrivning ──────────────────────────────────────────────────
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));
const dry = process.argv.includes('--dry');

const BAND = [12, 25];
const MENINGSTAK = 5;

const befintliga = new Set(lib.map((t) => t.id));
const titlar = new Set(lib.filter((t) => t.grade === 1).map((t) => t.title.trim().toLowerCase()));
let avbryt = false;

TEXTER.forEach((t) => {
  if (befintliga.has(t.id)) { console.error(`ID finns redan: ${t.id}`); avbryt = true; }
  if (titlar.has(t.title.trim().toLowerCase())) { console.error(`${t.id}: titeln finns redan på nivå 1`); avbryt = true; }
  if (t.questions.length !== 6) { console.error(`${t.id}: ${t.questions.length} frågor`); avbryt = true; }

  const ord = t.text.trim().split(/\s+/).length;
  if (ord < BAND[0] || ord > BAND[1]) {
    console.error(`${t.id}: ${ord} ord, utanför ${BAND[0]}–${BAND[1]}`);
    avbryt = true;
  }

  const meningar = t.text.split(/(?<=[.!?]["”]?)\s+/).filter(Boolean);
  const langsta = Math.max(...meningar.map((m) => m.trim().split(/\s+/).length));
  if (langsta > MENINGSTAK) {
    console.error(`${t.id}: längsta meningen är ${langsta} ord, taket är ${MENINGSTAK}`);
    avbryt = true;
  }

  // Rätt svar får inte gå att peka ut på längden.
  t.questions.forEach((q, qi) => {
    const l = q.options.map((o) => o.length);
    const ratt = l[q.correct];
    const ovriga = l.filter((_, i) => i !== q.correct);
    const langst = Math.max(...ovriga);
    const kortast = Math.min(...ovriga);
    if (ratt / langst >= 1.6 || kortast / ratt >= 1.6) {
      console.error(`${t.id} fråga ${qi + 1}: rätt svar ${ratt} tecken mot ${langst}/${kortast} – går att gissa`);
      avbryt = true;
    }
    if (new Set(q.options.map((o) => o.trim().toLowerCase())).size !== 4) {
      console.error(`${t.id} fråga ${qi + 1}: dubblerade svarsalternativ`);
      avbryt = true;
    }
  });

  const korr = t.questions.map((q) => q.correct);
  if (new Set(korr).size < 3) {
    console.error(`${t.id}: rätt svar på bara ${new Set(korr).size} platser (${korr.join(',')})`);
    avbryt = true;
  }
  for (let i = 0; i <= korr.length - 3; i++) {
    if (korr[i] === korr[i + 1] && korr[i] === korr[i + 2]) {
      console.error(`${t.id}: samma plats tre gånger i rad (${korr.join(',')})`);
      avbryt = true;
      break;
    }
  }

  console.log(
    `${t.id.padEnd(18)} ${String(ord).padStart(2)} ord  längsta ${langsta}  svar ${korr.join('')}`
  );
});

if (avbryt) process.exit(1);
if (dry) { console.log('\n--dry: inget skrivet.'); process.exit(0); }

TEXTER.forEach((t) => {
  lib.push({ ...t, meta: { wordCount: t.text.trim().split(/\s+/).length } });
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n');
console.log(`\n${TEXTER.length} texter tillagda. Nivå 1 har nu ${lib.filter((t) => t.grade === 1).length} texter.`);
