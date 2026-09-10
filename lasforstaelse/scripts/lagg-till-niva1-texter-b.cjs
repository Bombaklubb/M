#!/usr/bin/env node
//
// Tio texter till på nivå 1, ett steg enklare än de femton första.
//
// De första nivå 1-texterna ligger på 20–24 ord med meningar på fyra till sex
// ord. Dessa ligger på 14–19 ord med meningar på tre till fyra. Det är den
// nivån där en elev fortfarande ljudar sig igenom varje ord: hela meningen
// måste rymmas i huvudet medan den läses.
//
// Vad som är nedskruvat jämfört med de förra:
//   - subjekt och predikat och inget mer i de flesta meningar
//   - inga sammansatta ord längre än två stavelser i onödan
//   - en enda person eller sak per text
//   - inget som hänvisar bakåt i texten mer än ett steg
//
// Frågorna är samma tre slag som förut, men de flesta går att svara på med ett
// enda ord ur texten. Ordfrågan förklarar ett ord som eleven just har läst,
// inte ett nytt.
//
// Bilderna är sökta hos Unsplash, nedladdade och granskade en och en. Två
// texter är skrivna om efter granskningen så att de stämmer med bilden: bilen
// är röd och ballongen blå, eftersom det är vad fotona faktiskt visar.
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
  N('ak1-lattlast-16', 'Nallen Lo', 'photo-1562040506-a9b32cb51b94',
    'Elsa har en nalle.\n\nNallen heter Lo.\n\nLo är gul.\n\nElsa sover med Lo.',
    [
      { type: 'literal', q: 'Vad har Elsa?', options: ['En nalle', 'En docka', 'En boll', 'En bok'], correct: 0 },
      { type: 'literal', q: 'Vad heter nallen?', options: ['Bo', 'Lo', 'Max', 'Tuss'], correct: 1 },
      { type: 'literal', q: 'Vilken färg är Lo?', options: ['Blå', 'Röd', 'Gul', 'Grön'], correct: 2 },
      { type: 'literal', q: 'När är Elsa med Lo?', options: ['När hon äter', 'När hon badar', 'När hon läser', 'När hon sover'], correct: 3 },
      { type: 'ord', q: 'Vad är en nalle?', options: ['En liten bil', 'En mjuk leksak', 'En varm tröja', 'En stor bok'], correct: 1 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['En hund i en park', 'En flickas nalle', 'En bil på en väg', 'En kaka på ett fat'], correct: 1 },
    ]),

  N('ak1-lattlast-17', 'Glassen smälter', 'photo-1705103654884-cbd03d95761a',
    'Vi köper glass.\n\nMin glass är rosa.\n\nSolen är varm.\n\nGlassen smälter.\n\nJag äter fort.',
    [
      { type: 'literal', q: 'Vilken färg är glassen?', options: ['Vit', 'Brun', 'Rosa', 'Gul'], correct: 2 },
      { type: 'literal', q: 'Hur är solen?', options: ['Varm', 'Kall', 'Borta', 'Svag'], correct: 0 },
      { type: 'ord', q: 'Vad betyder smälter?', options: ['Blir hårt', 'Blir flytande', 'Blir kallt', 'Blir borta'], correct: 1 },
      { type: 'literal', q: 'Hur äter jag glassen?', options: ['Sakta', 'Tyst', 'Fort', 'Lugnt'], correct: 2 },
      { type: 'inferens', q: 'Varför äter jag fort?', options: ['För att jag är hungrig', 'För att glassen är liten', 'För att jag ska hem', 'För att glassen smälter'], correct: 3 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['En glass en varm dag', 'En kaka i en affär', 'En sol bakom moln', 'En pojke som fryser'], correct: 0 },
    ]),

  N('ak1-lattlast-18', 'Fröet i jorden', 'photo-1557234195-bd9f290f0e4d',
    'Jag sår ett frö.\n\nFröet ligger i jord.\n\nJag vattnar varje dag.\n\nNu växer en blomma.',
    [
      { type: 'literal', q: 'Vad sår jag?', options: ['Ett löv', 'Ett frö', 'En sten', 'En pinne'], correct: 1 },
      { type: 'literal', q: 'Var ligger fröet?', options: ['I jord', 'I vatten', 'I sand', 'I snö'], correct: 0 },
      { type: 'literal', q: 'Hur ofta vattnar jag?', options: ['En gång i veckan', 'Aldrig alls', 'Varje dag', 'Bara på våren'], correct: 2 },
      { type: 'ord', q: 'Vad betyder sår?', options: ['Gräver upp', 'Plockar bort', 'Klipper av', 'Lägger ner ett frö'], correct: 3 },
      { type: 'literal', q: 'Vad växer till slut?', options: ['En blomma', 'Ett träd', 'Ett gräs', 'En buske'], correct: 0 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['En regnig dag ute', 'Ett frö som blir en blomma', 'En trädgård i en park', 'En hink full med jord'], correct: 1 },
    ]),

  N('ak1-lattlast-19', 'Tanden lossnar', 'photo-1531763655487-430202fce550',
    'Min tand vickar.\n\nJag äter ett äpple.\n\nDå lossnar tanden.\n\nJag ler stort.\n\nNu finns ett hål.',
    [
      { type: 'literal', q: 'Vad gör tanden först?', options: ['Den vickar', 'Den värker', 'Den växer', 'Den blir vit'], correct: 0 },
      { type: 'literal', q: 'Vad äter jag?', options: ['En kaka', 'Ett äpple', 'En bulle', 'En morot'], correct: 1 },
      { type: 'ord', q: 'Vad betyder lossnar?', options: ['Sitter hårt', 'Blir större', 'Släpper taget', 'Gör mycket ont'], correct: 2 },
      { type: 'literal', q: 'Vad gör jag när tanden lossnar?', options: ['Jag gråter', 'Jag ropar', 'Jag springer', 'Jag ler'], correct: 3 },
      { type: 'inferens', q: 'Varför finns det ett hål?', options: ['För att tanden är borta', 'För att äpplet var hårt', 'För att jag borstar fel', 'För att munnen är liten'], correct: 0 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['Ett äpple i en skål', 'En tand som ramlar ut', 'En tandborste i ett glas', 'En flicka som har ont'], correct: 1 },
    ]),

  N('ak1-lattlast-20', 'Kaninen Pluff', 'photo-1617398881039-4c977f633b0e',
    'Vi har en kanin.\n\nKaninen är vit.\n\nHan äter morötter.\n\nHan hoppar högt.\n\nVi kallar honom Pluff.',
    [
      { type: 'literal', q: 'Vilket djur har vi?', options: ['En katt', 'En hund', 'En kanin', 'En fågel'], correct: 2 },
      { type: 'literal', q: 'Vilken färg är kaninen?', options: ['Vit', 'Grå', 'Brun', 'Svart'], correct: 0 },
      { type: 'literal', q: 'Vad äter kaninen?', options: ['Blommor', 'Morötter', 'Frukter', 'Gurkor'], correct: 1 },
      { type: 'literal', q: 'Vad heter kaninen?', options: ['Bo', 'Lo', 'Pluff', 'Tuss'], correct: 2 },
      { type: 'ord', q: 'Vad betyder kallar honom?', options: ['Ropar på honom', 'Bär på honom', 'Ger honom ett namn', 'Leker med honom'], correct: 2 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['En morot i en trädgård', 'En hund som hoppar', 'En kanin som vi har', 'En katt som sover'], correct: 2 },
    ]),

  N('ak1-lattlast-21', 'Var är bilen?', 'photo-1696824711591-018c23ff9248',
    'Jag letar min bil.\n\nBilen är röd.\n\nDen är inte i lådan.\n\nDen ligger under soffan.',
    [
      { type: 'literal', q: 'Vad letar jag efter?', options: ['Min bok', 'Min bil', 'Min boll', 'Min mössa'], correct: 1 },
      { type: 'literal', q: 'Vilken färg är bilen?', options: ['Blå', 'Gul', 'Grön', 'Röd'], correct: 3 },
      { type: 'ord', q: 'Vad betyder letar?', options: ['Söker efter', 'Kastar bort', 'Bygger ihop', 'Målar om'], correct: 0 },
      { type: 'literal', q: 'Var ligger bilen?', options: ['I lådan', 'Under soffan', 'På bordet', 'I hallen'], correct: 1 },
      { type: 'inferens', q: 'Varför hittar jag inte bilen först?', options: ['För att den är liten', 'För att lampan är släckt', 'För att den ligger dolt', 'För att någon tog den'], correct: 2 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['En soffa som flyttas', 'En låda full med saker', 'En bil som körs fort', 'En bil som är borta'], correct: 3 },
    ]),

  N('ak1-lattlast-22', 'Ballongen flyger', 'photo-1645095542177-125b3e224eef',
    'Nils får en ballong.\n\nBallongen är blå.\n\nSnöret glider ur handen.\n\nBallongen flyger upp.\n\nNils blir ledsen.',
    [
      { type: 'literal', q: 'Vad får Nils?', options: ['En ballong', 'En glass', 'En boll', 'En leksak'], correct: 0 },
      { type: 'literal', q: 'Vilken färg är ballongen?', options: ['Röd', 'Blå', 'Gul', 'Vit'], correct: 1 },
      { type: 'ord', q: 'Vad är ett snöre?', options: ['En smal tråd', 'En liten pinne', 'En tunn påse', 'En låg gren'], correct: 0 },
      { type: 'literal', q: 'Vart flyger ballongen?', options: ['Ner i vattnet', 'In i huset', 'Upp i luften', 'Bort på gatan'], correct: 2 },
      { type: 'inferens', q: 'Varför blir Nils ledsen?', options: ['För att snöret är kort', 'För att det blåser hårt', 'För att ballongen är blå', 'För att ballongen är borta'], correct: 3 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['En pojke som tappar en ballong', 'En pojke som får en present', 'En flicka som blåser upp en ballong', 'En fågel som flyger högt'], correct: 0 },
    ]),

  N('ak1-lattlast-23', 'Fiskarna i skålen', 'photo-1765546939532-aa59165da7dd',
    'Vi har fiskar hemma.\n\nDe simmar i en skål.\n\nFiskarna är orange.\n\nJag ger dem mat.\n\nDe äter snabbt.',
    [
      { type: 'literal', q: 'Var simmar fiskarna?', options: ['I en sjö', 'I en skål', 'I en å', 'I ett hav'], correct: 1 },
      { type: 'literal', q: 'Vilken färg är fiskarna?', options: ['Gula', 'Vita', 'Orange', 'Svarta'], correct: 2 },
      { type: 'literal', q: 'Vad ger jag fiskarna?', options: ['Vatten', 'Sand', 'Bröd', 'Mat'], correct: 3 },
      { type: 'ord', q: 'Vad betyder snabbt?', options: ['Fort', 'Sakta', 'Tyst', 'Sent'], correct: 0 },
      { type: 'inferens', q: 'Varför äter fiskarna snabbt?', options: ['För att maten är hård', 'För att skålen är liten', 'För att de är hungriga', 'För att vattnet är kallt'], correct: 2 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['En sjö full med fiskar', 'En skål som går sönder', 'En pojke som fiskar', 'Fiskar som får mat'], correct: 3 },
    ]),

  N('ak1-lattlast-24', 'Bilden till mormor', 'photo-1544773088-d142e38f5793',
    'Jag ritar en bild.\n\nBilden visar ett hus.\n\nSolen är gul.\n\nJag ger bilden till mormor.\n\nMormor blir glad.',
    [
      { type: 'literal', q: 'Vad gör jag först?', options: ['Ritar en bild', 'Läser en bok', 'Bygger ett hus', 'Målar en vägg'], correct: 0 },
      { type: 'literal', q: 'Vad visar bilden?', options: ['En båt', 'Ett hus', 'En bil', 'Ett träd'], correct: 1 },
      { type: 'literal', q: 'Vem får bilden?', options: ['Min lärare', 'Min kompis', 'Mormor', 'Pappa'], correct: 2 },
      { type: 'ord', q: 'Vad betyder visar?', options: ['Gömmer bort', 'Ger tillbaka', 'Låter någon se', 'Tar helt bort'], correct: 2 },
      { type: 'inferens', q: 'Varför blir mormor glad?', options: ['För att solen skiner ute', 'För att huset är stort', 'För att hon får en present', 'För att jag kommer hem'], correct: 2 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['Ett hus som byggs', 'En bild som ges bort', 'En mormor som ritar', 'En sol som går ner'], correct: 1 },
    ]),

  N('ak1-lattlast-25', 'Ankorna vid sjön', 'photo-1601338724126-56e36f72c54b',
    'Vi går till sjön.\n\nDär simmar ankor.\n\nJag kastar bröd.\n\nAnkorna kommer fram.\n\nDe äter allt.',
    [
      { type: 'literal', q: 'Vart går vi?', options: ['Till skogen', 'Till skolan', 'Till sjön', 'Till parken'], correct: 2 },
      { type: 'literal', q: 'Vilka simmar där?', options: ['Fiskar', 'Ankor', 'Svanar', 'Måsar'], correct: 1 },
      { type: 'literal', q: 'Vad kastar jag?', options: ['Bröd', 'Stenar', 'Pinnar', 'Frön'], correct: 0 },
      { type: 'ord', q: 'Vad betyder kommer fram?', options: ['Går sin väg', 'Simmar närmare', 'Dyker under', 'Flyger bort'], correct: 1 },
      { type: 'inferens', q: 'Varför kommer ankorna fram?', options: ['För att de vill ha bröd', 'För att de är rädda', 'För att sjön är kall', 'För att vi ropar högt'], correct: 0 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['En sjö som fryser', 'En båt på vattnet', 'Ankor som får bröd', 'En pojke som simmar'], correct: 2 },
    ]),
];

// Rätt svars plats per text. Utan styrning hamnade flera på samma trappa, och
// tio korta texter i rad räcker för att ett barn ska se ett sådant mönster.
// Rotationen flyttar bara platserna – formuleringarna och vilket alternativ
// som är rätt rörs inte.
const PLATSER = {
  'ak1-lattlast-16': [0, 1, 2, 3, 1, 1],
  'ak1-lattlast-17': [2, 0, 1, 2, 3, 0],
  'ak1-lattlast-18': [3, 1, 2, 0, 1, 3],
  'ak1-lattlast-19': [0, 1, 2, 3, 0, 1],
  'ak1-lattlast-20': [2, 0, 1, 2, 3, 1],
  'ak1-lattlast-21': [1, 3, 0, 1, 2, 3],
  'ak1-lattlast-22': [0, 1, 0, 2, 3, 0],
  'ak1-lattlast-23': [1, 2, 3, 0, 2, 3],
  'ak1-lattlast-24': [0, 1, 2, 3, 1, 2],
  'ak1-lattlast-25': [2, 1, 0, 1, 0, 2],
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

const BAND = [12, 20];
const MENINGSTAK = 5;

const befintliga = new Set(lib.map((t) => t.id));
const titlar = new Set(lib.filter((t) => t.grade === 1).map((t) => t.title.trim().toLowerCase()));
let avbryt = false;

TEXTER.forEach((t) => {
  if (befintliga.has(t.id)) {
    console.error(`ID finns redan: ${t.id}`);
    avbryt = true;
  }
  if (titlar.has(t.title.trim().toLowerCase())) {
    console.error(`${t.id}: titeln finns redan på nivå 1`);
    avbryt = true;
  }
  if (t.questions.length !== 6) {
    console.error(`${t.id}: ${t.questions.length} frågor`);
    avbryt = true;
  }

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

  // Rätt svar får inte gå att peka ut på längden. Samma kvotregel som
  // validatorn använder, men kontrollerad innan något skrivs.
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
  });

  // Svarsfördelning, samma regel som validatorn använder.
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
    `${t.id.padEnd(18)} ${String(ord).padStart(2)} ord  ` +
      `${(ord / meningar.length).toFixed(1)} ord/mening  längsta ${langsta}  svar ${korr.join('')}`
  );
});

if (avbryt) process.exit(1);

if (dry) {
  console.log('\n--dry: inget skrivet.');
  process.exit(0);
}

TEXTER.forEach((t) => {
  lib.push({ ...t, meta: { wordCount: t.text.trim().split(/\s+/).length } });
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n');
console.log(`\n${TEXTER.length} texter tillagda. Nivå 1 har nu ${lib.filter((t) => t.grade === 1).length} texter.`);
