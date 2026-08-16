#!/usr/bin/env node
/**
 * Genererar en HTML-kontaktkarta över alla texters bilder i Readhunt.
 *
 * Bilderna kan inte granskas från byggmiljön (images.unsplash.com ligger inte i
 * nätverkets allowlist), men de laddas fint i en vanlig webbläsare. Kartan
 * öppnas lokalt så att en lärare kan skrolla igenom alla motiv på ett par
 * minuter, kryssa i de som visar fel sak och kopiera id-listan hit.
 *
 *   node readhunt/scripts/bildkontroll.cjs
 *   -> readhunt/scripts/bildkontroll.html
 */

const fs = require('fs');
const path = require('path');

const LIB = path.join(__dirname, '..', 'public', 'data', 'library.json');
const OUT = path.join(__dirname, 'bildkontroll.html');

const texts = JSON.parse(fs.readFileSync(LIB, 'utf8'));

// Räkna hur många texter som delar samma bild
const useCount = {};
for (const t of texts) {
  const base = (t.imageUrl || '').split('?')[0];
  useCount[base] = (useCount[base] || 0) + 1;
}

const rows = texts
  .slice()
  .sort((a, b) => a.grade - b.grade || a.id.localeCompare(b.id))
  .map((t) => ({
    id: t.id,
    grade: t.grade,
    theme: t.theme,
    genre: t.genre,
    title: t.title,
    url: t.imageUrl || '',
    shared: useCount[(t.imageUrl || '').split('?')[0]] || 1,
    snippet: t.text.replace(/\s+/g, ' ').slice(0, 150),
  }));

const html = `<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Readhunt – bildkontroll (${rows.length} texter)</title>
<style>
  :root { color-scheme: light dark; }
  body { font-family: system-ui, -apple-system, "Segoe UI", sans-serif; margin: 0;
         background: #f6f7fb; color: #1e293b; }
  header { position: sticky; top: 0; z-index: 10; background: #4338ca; color: #fff;
           padding: 14px 20px; box-shadow: 0 2px 12px rgba(0,0,0,.18); }
  h1 { margin: 0 0 6px; font-size: 18px; }
  .bar { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; font-size: 13px; }
  .bar select, .bar button { font: inherit; padding: 5px 10px; border-radius: 8px;
                             border: 1px solid rgba(255,255,255,.35); background: rgba(255,255,255,.15);
                             color: #fff; cursor: pointer; }
  .bar button { font-weight: 600; }
  .pill { background: rgba(255,255,255,.18); padding: 3px 9px; border-radius: 999px; }
  main { padding: 18px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 16px; }
  .card { background: #fff; border-radius: 12px; overflow: hidden; border: 2px solid transparent;
          box-shadow: 0 1px 4px rgba(0,0,0,.10); display: flex; flex-direction: column; }
  .card.flagged { border-color: #e11d48; box-shadow: 0 0 0 3px rgba(225,29,72,.18); }
  .imgwrap { position: relative; height: 150px; background: #e2e8f0; }
  .imgwrap img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .broken { position: absolute; inset: 0; display: none; align-items: center; justify-content: center;
            background: #fee2e2; color: #b91c1c; font-weight: 700; font-size: 13px; text-align: center; }
  .imgwrap.dead .broken { display: flex; }
  .imgwrap.dead img { display: none; }
  .meta { padding: 9px 11px; font-size: 12px; flex: 1; }
  .title { font-weight: 700; font-size: 13px; margin-bottom: 3px; line-height: 1.3; }
  .sub { color: #64748b; }
  .snippet { color: #94a3b8; font-size: 11px; margin-top: 5px; line-height: 1.35; }
  .badges { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 6px; }
  .badge { font-size: 10px; padding: 2px 6px; border-radius: 999px; background: #eef2ff; color: #4338ca; font-weight: 600; }
  .badge.dup { background: #fef3c7; color: #92400e; }
  label.check { display: flex; gap: 7px; align-items: center; padding: 8px 11px;
                border-top: 1px solid #f1f5f9; cursor: pointer; font-size: 12px; font-weight: 600; color: #e11d48; }
  #out { width: 100%; height: 110px; margin-top: 14px; font-family: ui-monospace, monospace;
         font-size: 12px; padding: 10px; border-radius: 10px; border: 1px solid #cbd5e1; }
  @media (prefers-color-scheme: dark) {
    body { background: #0f172a; color: #e2e8f0; }
    .card { background: #1e293b; }
    .imgwrap { background: #334155; }
    .sub { color: #94a3b8; } .snippet { color: #64748b; }
    .badge { background: #312e81; color: #c7d2fe; }
    #out { background: #1e293b; color: #e2e8f0; border-color: #475569; }
  }
</style>
</head>
<body>
<header>
  <h1>Readhunt – bildkontroll</h1>
  <div class="bar">
    <span class="pill">${rows.length} texter</span>
    <span class="pill" id="deadCount">Trasiga: räknar…</span>
    <span class="pill">Delade motiv: ${Object.values(useCount).filter((n) => n > 1).length}</span>
    <label>Nivå:
      <select id="gradeFilter">
        <option value="">alla</option>
        ${[...new Set(rows.map((r) => r.grade))].sort((a, b) => a - b).map((g) => `<option value="${g}">${g}</option>`).join('')}
      </select>
    </label>
    <button id="onlyDup">Visa bara delade motiv</button>
    <button id="onlyDead">Visa bara trasiga</button>
    <button id="showAll">Visa alla</button>
    <button id="copyBtn">Kopiera markerade id</button>
  </div>
</header>
<main>
  <p style="font-size:13px;color:#64748b;margin:0 0 14px">
    Kryssa i rutan under de bilder som visar <strong>fel motiv</strong>. Klicka sedan
    "Kopiera markerade id" och klistra in listan i chatten – då byter jag dem mot granskade bilder.
  </p>
  <div class="grid" id="grid"></div>
  <textarea id="out" readonly placeholder="Markerade id hamnar här…"></textarea>
</main>
<script>
const ROWS = ${JSON.stringify(rows)};
const grid = document.getElementById('grid');
let dead = 0;

for (const r of ROWS) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.grade = r.grade;
  card.dataset.shared = r.shared;
  card.innerHTML = \`
    <div class="imgwrap">
      <img loading="lazy" src="\${r.url}" alt="">
      <div class="broken">BILDEN LADDAR INTE</div>
    </div>
    <div class="meta">
      <div class="title">\${r.title}</div>
      <div class="sub">\${r.id} · nivå \${r.grade} · \${r.theme} · \${r.genre}</div>
      <div class="badges">\${r.shared > 1 ? '<span class="badge dup">delas av ' + r.shared + '</span>' : ''}</div>
      <div class="snippet">\${r.snippet}…</div>
    </div>
    <label class="check"><input type="checkbox" value="\${r.id}"> Fel motiv</label>\`;
  const img = card.querySelector('img');
  img.addEventListener('error', () => {
    card.querySelector('.imgwrap').classList.add('dead');
    card.dataset.dead = '1';
    dead++;
    document.getElementById('deadCount').textContent = 'Trasiga: ' + dead;
  });
  card.querySelector('input').addEventListener('change', (e) => {
    card.classList.toggle('flagged', e.target.checked);
    refresh();
  });
  grid.appendChild(card);
}
setTimeout(() => {
  const el = document.getElementById('deadCount');
  if (dead === 0) el.textContent = 'Trasiga: 0 ✓';
}, 4000);

function refresh() {
  const ids = [...document.querySelectorAll('input:checked')].map((i) => i.value);
  document.getElementById('out').value = ids.join('\\n');
}
document.getElementById('copyBtn').onclick = () => {
  const t = document.getElementById('out');
  t.select(); navigator.clipboard.writeText(t.value);
};
const cards = () => [...document.querySelectorAll('.card')];
document.getElementById('gradeFilter').onchange = (e) => {
  const g = e.target.value;
  cards().forEach((c) => c.style.display = (!g || c.dataset.grade === g) ? '' : 'none');
};
document.getElementById('onlyDup').onclick = () =>
  cards().forEach((c) => c.style.display = c.dataset.shared > 1 ? '' : 'none');
document.getElementById('onlyDead').onclick = () =>
  cards().forEach((c) => c.style.display = c.dataset.dead ? '' : 'none');
document.getElementById('showAll').onclick = () =>
  cards().forEach((c) => c.style.display = '');
</script>
</body>
</html>`;

fs.writeFileSync(OUT, html);
console.log('Skrev ' + OUT);
console.log(rows.length + ' texter, ' + new Set(rows.map((r) => r.url.split('?')[0])).size + ' unika bilder');
