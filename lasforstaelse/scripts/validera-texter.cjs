#!/usr/bin/env node
//
// Validerar textbiblioteket mot appens faktiska schema.
//
// Bakgrund: texter har tidigare klistrats in i ett format som inte helt matchar
// det appen läser. Det gav dubblerade ID (som permanent låste texter för eleven),
// frågor utan `type` (som visades som "undefined" i profilstatistiken) och
// faktatexter som märktes som berättelser. Skriptet fångar sådant innan det
// hamnar i produktion.
//
// Körs:  node scripts/validera-texter.cjs
// Avslutar med kod 1 om något FEL hittas (varningar påverkar inte koden).

const fs = require('fs');
const path = require('path');

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

// Samtliga renderas i QuizView, ResultView och ProfileView.
const GILTIGA_TYPER = [
  'literal', 'inferens', 'ord', 'sammanfatta', 'forfattarens-syfte', 'textbevis',
];
const GILTIGA_GENRER = ['berättelse', 'faktatext'];

// Målintervall för antal ord per årskurs (åk 10 = gymnasiet).
const ORDINTERVALL = {
  1: [40, 60], 2: [65, 90], 3: [150, 165], 4: [200, 220], 5: [300, 320],
  6: [400, 415], 7: [500, 530], 8: [530, 570], 9: [570, 590], 10: [590, 625],
};

const fel = [];
const varningar = [];

// ── Kontroller över hela biblioteket ────────────────────────────────────────
const ids = lib.map(t => t.id);
[...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))].forEach(id =>
  fel.push(`Dubblerat ID: ${id} (låser texter permanent för eleven)`)
);

const titelNycklar = {};
lib.forEach(t => {
  const nyckel = `${(t.title || '').trim().toLowerCase()}|${t.grade}`;
  (titelNycklar[nyckel] = titelNycklar[nyckel] || []).push(t.id);
});
Object.entries(titelNycklar)
  .filter(([, v]) => v.length > 1)
  .forEach(([nyckel, v]) =>
    varningar.push(`Samma titel på samma årskurs: "${nyckel.split('|')[0]}" (${v.join(', ')})`)
  );

// Nära dubbletter: två texter i samma årskurs som delar merparten av sina ord
// är i praktiken samma text för eleven, även om titlarna skiljer sig. Sådana
// texter tar upp en plats i biblioteket utan att ge något nytt att läsa.
const ordmangd = s =>
  new Set(s.toLowerCase().replace(/[^a-zåäöé0-9 ]/g, '').replace(/\s+/g, ' ').trim().split(' '));
const overlapp = (a, b) => {
  const gemensamma = [...a].filter(x => b.has(x)).length;
  return gemensamma / (a.size + b.size - gemensamma);
};
const medOrd = lib.map(t => ({ id: t.id, grade: t.grade, ord: ordmangd(t.text || '') }));
for (let i = 0; i < medOrd.length; i++) {
  for (let j = i + 1; j < medOrd.length; j++) {
    if (medOrd[i].grade !== medOrd[j].grade) continue;
    const andel = overlapp(medOrd[i].ord, medOrd[j].ord);
    if (andel >= 0.6) {
      fel.push(
        `Nära dubblett i åk ${medOrd[i].grade}: ${medOrd[i].id} och ${medOrd[j].id} ` +
        `delar ${Math.round(andel * 100)} % av orden`
      );
    }
  }
}

// ── Kontroller per text ─────────────────────────────────────────────────────
lib.forEach(t => {
  const id = t.id || '(saknar id)';

  if (!t.id) fel.push('Text utan id');
  if (!t.title || !t.title.trim()) fel.push(`${id}: saknar titel`);
  if (!t.text || !t.text.trim()) fel.push(`${id}: saknar text`);
  if (typeof t.grade !== 'number' || t.grade < 1 || t.grade > 10) {
    fel.push(`${id}: ogiltig grade (${t.grade})`);
  }

  // genre måste vara satt explicit – saknas den tvingar libraryService.ts
  // texten till 'berättelse', vilket felmärker faktatexter.
  if (!t.genre) {
    fel.push(`${id}: saknar genre${t.category ? ` (har category "${t.category}" → tvingas till berättelse)` : ''}`);
  } else if (!GILTIGA_GENRER.includes(t.genre)) {
    fel.push(`${id}: ogiltig genre "${t.genre}"`);
  }

  if (!t.theme) varningar.push(`${id}: saknar theme`);
  if (!t.imageUrl) varningar.push(`${id}: saknar imageUrl`);

  // Ordantal
  if (t.text) {
    const faktiskt = t.text.trim().split(/\s+/).length;
    if (t.meta && typeof t.meta.wordCount === 'number' && t.meta.wordCount !== faktiskt) {
      fel.push(`${id}: meta.wordCount ${t.meta.wordCount} ≠ faktiskt ${faktiskt}`);
    }
    if (!t.meta || typeof t.meta.wordCount !== 'number') {
      varningar.push(`${id}: saknar meta.wordCount`);
    }
    const intervall = ORDINTERVALL[t.grade];
    if (intervall && (faktiskt < intervall[0] || faktiskt > intervall[1])) {
      varningar.push(`${id}: ${faktiskt} ord, utanför åk ${t.grade}-intervallet ${intervall[0]}–${intervall[1]}`);
    }
  }

  // word_count på toppnivå läses aldrig av appen
  if (t.word_count !== undefined) {
    varningar.push(`${id}: har word_count på toppnivå – appen läser meta.wordCount`);
  }

  // Punkter insprängda mitt i en mening lämnar efter sig meningar som består
  // av ett enda ord. Två åk 1-texter var skadade så: "Katten. Maja bor hos.
  // Leo." Utropstecken och frågetecken undantas, eftersom "Plask!" och "Hur?"
  // är avsiktliga.
  const meningar = (t.text || '').split(/(?<=[.!?])\s+/).map(m => m.trim());
  const enOrdsMeningar = meningar.filter((m, i) => {
    if (!/^[A-ZÅÄÖ][a-zåäöé]+\.$/.test(m)) return false;
    // "J.R.R. Tolkien." delas av meningsdelaren i två bitar. Är föregående
    // mening slut på en ensam versal med punkt är brytningen ett artefakt.
    const innan = meningar[i - 1] || '';
    return !/\b[A-ZÅÄÖ]\.$/.test(innan);
  });
  if (enOrdsMeningar.length) {
    varningar.push(`${id}: mening med bara ett ord – ${enOrdsMeningar.join(' ')} (kan vara en felplacerad punkt)`);
  }

  // En mening kan inte sluta på ett bindeord. Sex texter var skadade så att en
  // punkt hamnat rakt före ett namn: "Ella springer snabbt men. Leo tar längre
  // steg." Uteslutningstecken undantas, eftersom "Men..." i dialog är avsiktligt.
  // "som" är medvetet utelämnat: det kan avsluta en korrekt mening när det
  // står sist i en relativsats – "tillhör den person den låter som".
  const bindeord = new Set(['och', 'att', 'men', 'eller', 'samt']);
  meningar.forEach(m => {
    if (/[!?]$/.test(m) || /\.\.\.["”]?\.?$/.test(m)) return;
    const ord = m.replace(/[."”]+$/, '').trim().split(/\s+/);
    const sist = (ord[ord.length - 1] || '').toLowerCase().replace(/[^a-zåäöé]/g, '');
    if (bindeord.has(sist)) {
      varningar.push(`${id}: mening slutar på bindeordet "${sist}" – ...${m.slice(-40)}`);
    }
  });

  // ── Frågor ────────────────────────────────────────────────────────────────
  const fragor = t.questions || [];
  if (fragor.length !== 6) fel.push(`${id}: ${fragor.length} frågor (ska vara 6)`);

  fragor.forEach((q, i) => {
    const plats = `${id} fråga ${i + 1}`;

    if (!q.type) fel.push(`${plats}: saknar type (visas som "undefined" i statistiken)`);
    else if (!GILTIGA_TYPER.includes(q.type)) fel.push(`${plats}: ogiltig type "${q.type}"`);

    if (!q.q || !q.q.trim()) fel.push(`${plats}: tom frågetext`);

    // Frågetypen styr vad profilen visar eleven om sina lässtrategier, så en
    // felklassad fråga ger fel vägledning. Två mönster är entydiga nog att
    // kontrollera automatiskt; övriga gränsfall bedöms för hand.
    const fragetext = (q.q || '').toLowerCase();
    // "Vad betyder <ett enda ord>?" – ett ord, inte ett påstående.
    if (/^vad betyder ["'“]?[a-zåäöé-]+["'”]?( enligt texten| i texten)?\?$/.test(fragetext)
        && q.type && q.type !== 'ord') {
      varningar.push(`${plats}: frågar efter ett ords betydelse men har type "${q.type}" i stället för "ord"`);
    }
    // Frågor om textens huvudbudskap som helhet.
    if (/(textens |^)(huvudbudskap|huvudidé|huvudsakliga budskap)/.test(fragetext)
        && q.type && q.type !== 'sammanfatta') {
      varningar.push(`${plats}: frågar efter textens huvudbudskap men har type "${q.type}" i stället för "sammanfatta"`);
    }

    const alt = q.options || [];
    if (alt.length !== 4) fel.push(`${plats}: ${alt.length} svarsalternativ (ska vara 4)`);
    if (alt.some(o => !o || !o.trim())) fel.push(`${plats}: tomt svarsalternativ`);
    if (new Set(alt.map(o => (o || '').trim().toLowerCase())).size !== alt.length) {
      fel.push(`${plats}: dubblerade svarsalternativ`);
    }
    if (typeof q.correct !== 'number' || q.correct < 0 || q.correct >= alt.length) {
      fel.push(`${plats}: ogiltigt correct-index (${q.correct})`);
    }

    // Femton mallfraser satt tidigare på 102 distraktorer i alla årskurser,
    // aldrig på ett rätt svar. Frasen blev därmed ett facit i sig: eleven
    // kunde välja bort alternativet utan att läsa texten. De är omskrivna,
    // och listan ligger kvar som spärr mot att de kommer tillbaka.
    const MALLFRASER = [
      'för att undvika missförstånd', 'för säkerhets skull',
      'för att det hade fungerat förut', 'redan innan något annat hände',
      'oavsett vad andra tyckte', 'och ingenting annat',
      'under hela den perioden', 'men bara under vissa förutsättningar',
      'av en slump', 'utan att det fick några konsekvenser',
      'för att slippa problem senare', 'utan någon som helst förändring',
      'men bara om det behövdes', 'på exakt samma sätt som förut',
      'för att det skulle gå snabbare',
    ];
    alt.forEach((o, oi) => {
      const fras = MALLFRASER.find(f => (o || '').endsWith(f));
      if (fras) {
        fel.push(`${plats} alternativ ${'ABCD'[oi]}: slutar på mallfrasen "${fras}"`);
      }
    });

    // Rätt svar ska inte gå att peka ut på längden. Måttet är KVOT mot närmaste
    // distraktor, inte absolut teckenskillnad: "En hundvalp och hennes dag" (26)
    // mot "En resa" (7) är trivialt gissningsbar trots bara 18 teckens skillnad,
    // medan 53 mot 37 tecken knappt avslöjar något.
    if (alt.length === 4 && typeof q.correct === 'number' && alt[q.correct]) {
      const längder = alt.map(o => (o || '').length);
      const rätt = längder[q.correct];
      const övriga = längder.filter((_, i) => i !== q.correct);
      const längsta = Math.max(...övriga);
      const kortaste = Math.min(...övriga);

      if (rätt / längsta >= 1.6) {
        varningar.push(`${plats}: rätt svar ${rätt} tecken mot längsta distraktor ${längsta} (${(rätt / längsta).toFixed(1)}×) – går att gissa`);
      }
      // Ett påfallande kort rätt svar sticker ut lika mycket som ett långt
      if (kortaste / rätt >= 1.6) {
        varningar.push(`${plats}: rätt svar ${rätt} tecken mot kortaste distraktor ${kortaste} (${(kortaste / rätt).toFixed(1)}× kortare) – går att gissa`);
      }
    }
  });

  // Svarsfördelning: minst 3 olika positioner, aldrig 3 i rad på samma
  const korrekta = fragor.map(q => q.correct).filter(c => typeof c === 'number');
  if (korrekta.length === 6) {
    if (new Set(korrekta).size < 3) {
      varningar.push(`${id}: rätt svar bara på ${new Set(korrekta).size} olika positioner (${korrekta.join(',')})`);
    }
    for (let i = 0; i <= korrekta.length - 3; i++) {
      if (korrekta[i] === korrekta[i + 1] && korrekta[i] === korrekta[i + 2]) {
        varningar.push(`${id}: samma svarsposition 3 gånger i rad (${korrekta.join(',')})`);
        break;
      }
    }
  }
});

// ── Rapport ─────────────────────────────────────────────────────────────────
// Biblioteket bär på mycket äldre skuld, så en rå lista blir oläsbar.
// Gruppera per feltyp och visa exempel – det gör rapporten åtgärdbar.
const gruppera = lista => {
  const grupper = {};
  lista.forEach(rad => {
    const nyckel = rad
      .replace(/^[^:]+: /, '')       // ta bort id-prefix
      .replace(/"[^"]*"/g, '"…"')    // normalisera citerade värden
      .replace(/\d+/g, 'N');         // normalisera siffror
    (grupper[nyckel] = grupper[nyckel] || []).push(rad);
  });
  return Object.entries(grupper).sort((a, b) => b[1].length - a[1].length);
};

const visa = (rubrik, lista) => {
  console.log(`\n${rubrik} (${lista.length} st)`);
  gruppera(lista).forEach(([typ, rader]) => {
    console.log(`\n  ${rader.length}×  ${typ}`);
    rader.slice(0, 3).forEach(r => console.log(`        ${r}`));
    if (rader.length > 3) console.log(`        … och ${rader.length - 3} till`);
  });
};

console.log(`Validerar ${lib.length} texter (${new Set(ids).size} unika ID)`);

if (fel.length) visa('❌ FEL – måste rättas', fel);
else console.log('\n✅ Inga fel');

if (varningar.length) visa('⚠️  Varningar', varningar);
else console.log('✅ Inga varningar');

console.log();
process.exit(fel.length ? 1 : 0);
