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

// Endast dessa fyra typer renderas korrekt i QuizView, ResultView OCH ProfileView.
// 'forfattarens-syfte' och 'textbevis' visas som anonymt "❓ Fråga" i quizvyn.
const GILTIGA_TYPER = ['literal', 'inferens', 'ord', 'sammanfatta'];
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

  // ── Frågor ────────────────────────────────────────────────────────────────
  const fragor = t.questions || [];
  if (fragor.length !== 6) fel.push(`${id}: ${fragor.length} frågor (ska vara 6)`);

  fragor.forEach((q, i) => {
    const plats = `${id} fråga ${i + 1}`;

    if (!q.type) fel.push(`${plats}: saknar type (visas som "undefined" i statistiken)`);
    else if (!GILTIGA_TYPER.includes(q.type)) fel.push(`${plats}: ogiltig type "${q.type}"`);

    if (!q.q || !q.q.trim()) fel.push(`${plats}: tom frågetext`);

    const alt = q.options || [];
    if (alt.length !== 4) fel.push(`${plats}: ${alt.length} svarsalternativ (ska vara 4)`);
    if (alt.some(o => !o || !o.trim())) fel.push(`${plats}: tomt svarsalternativ`);
    if (new Set(alt.map(o => (o || '').trim().toLowerCase())).size !== alt.length) {
      fel.push(`${plats}: dubblerade svarsalternativ`);
    }
    if (typeof q.correct !== 'number' || q.correct < 0 || q.correct >= alt.length) {
      fel.push(`${plats}: ogiltigt correct-index (${q.correct})`);
    }

    // Rätt svar bör inte gå att peka ut på längden. Kräver att det är STRIKT
    // längst – delad längd med ett annat alternativ avslöjar ingenting.
    if (alt.length === 4 && typeof q.correct === 'number' && alt[q.correct]) {
      const längder = alt.map(o => (o || '').length);
      const rätt = längder[q.correct];
      const övriga = längder.filter((_, i) => i !== q.correct);
      const nästLängsta = Math.max(...övriga);
      if (rätt > nästLängsta * 1.4 && rätt - nästLängsta >= 12) {
        varningar.push(`${plats}: rätt svar ${rätt} tecken mot näst längsta ${nästLängsta} – går att gissa`);
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
