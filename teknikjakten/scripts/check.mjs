/**
 * Innehållskontroll för Teknikjakten.
 *
 *   npm run check
 *
 * Fångar sådant som typkontrollen inte ser: dubbletter av id, kapitel-id som inte
 * stämmer med grade/areaId, kapitel utan innehåll, för få ord till ordsökningen
 * och tomma rutor i matrisen årskurs × område.
 *
 * Datafilerna är TypeScript, så de bundlas först med esbuild (följer med vite).
 */
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(import.meta.dirname, '..');

let esbuild;
try {
  esbuild = await import('esbuild');
} catch {
  console.error('Hittar inte esbuild. Kör "npm install" i teknikjakten/ först.');
  process.exit(1);
}

const outDir = await mkdtemp(path.join(tmpdir(), 'teknikjakten-check-'));
const outFile = path.join(outDir, 'areas.mjs');

try {
  await esbuild.build({
    entryPoints: [path.join(ROOT, 'src/data/areas.ts')],
    bundle: true,
    format: 'esm',
    platform: 'node',
    outfile: outFile,
    logLevel: 'silent',
  });

  const { ALL_CHAPTERS, AREAS } = await import(pathToFileURL(outFile).href);

  const errors = [];
  const warnings = [];
  const err = (m) => errors.push(m);
  const warn = (m) => warnings.push(m);

  // --- Dubbletter av kapitel-id ---
  const chapterIds = new Set();
  for (const c of ALL_CHAPTERS) {
    if (chapterIds.has(c.id)) err(`Dubblett av kapitel-id: ${c.id}`);
    chapterIds.add(c.id);
  }

  // --- Dubbletter av övnings-id ---
  const exerciseIds = new Map();
  for (const c of ALL_CHAPTERS) {
    for (const ex of c.exercises ?? []) {
      if (exerciseIds.has(ex.id)) {
        err(`Dubblett av övnings-id "${ex.id}" (${exerciseIds.get(ex.id)} och ${c.id})`);
      }
      exerciseIds.set(ex.id, c.id);
    }
  }

  // --- id, grade och areaId måste stämma överens ---
  const areaIds = new Set(AREAS.map(a => a.id));
  for (const c of ALL_CHAPTERS) {
    const m = /^ak(\d)-([a-z0-9]+)-(.+)$/.exec(c.id);
    if (!m) {
      err(`Kapitel-id följer inte mönstret ak<årskurs>-<område>-<kapitel>: ${c.id}`);
      continue;
    }
    const [, gradeInId, areaInId] = m;
    if (c.grade !== gradeInId) err(`${c.id}: grade är "${c.grade}" men id:t säger åk ${gradeInId}`);
    if (c.areaId !== areaInId) err(`${c.id}: areaId är "${c.areaId}" men id:t säger "${areaInId}"`);
    if (!areaIds.has(c.areaId)) err(`${c.id}: areaId "${c.areaId}" finns inte i AREAS (areaMeta.ts)`);
  }

  // --- Kapitel utan innehåll ---
  for (const c of ALL_CHAPTERS) {
    if (!c.summary) err(`${c.id}: saknar summary`);
    if (!c.exercises?.length) err(`${c.id}: saknar övningar`);
    else if (c.exercises.length !== 10) warn(`${c.id}: har ${c.exercises.length} övningar (riktmärket är 10)`);

    const s = c.summary;
    if (s) {
      if (!s.concepts?.length) err(`${c.id}: summary saknar concepts`);
      else if (s.concepts.length < 12) warn(`${c.id}: ${s.concepts.length} begrepp (riktmärket är 12–15)`);
      if (!s.keyPoints?.length) err(`${c.id}: summary saknar keyPoints`);
      else if (s.keyPoints.length < 6) warn(`${c.id}: ${s.keyPoints.length} keyPoints (riktmärket är 6–8)`);
      if (!s.causeEffect?.length) err(`${c.id}: summary saknar causeEffect`);
      if (!s.studentConnection) err(`${c.id}: summary saknar studentConnection`);
    }
  }

  // --- Ordsökningen behöver minst 8 användbara ord ---
  for (const c of ALL_CHAPTERS) {
    const usable = (c.summary?.concepts ?? [])
      .map(x => x.term.toUpperCase().replace(/[^A-ZÅÄÖ]/g, ''))
      .filter(w => w.length >= 3 && w.length <= 14);
    if (c.summary && usable.length < 8) {
      warn(`${c.id}: bara ${usable.length} ord passar i ordsökningen (behöver 8, 3–14 bokstäver)`);
    }
  }

  // --- "Nästa kapitel" får aldrig korsa en årskursgräns ---
  // ChapterResult hämtar nästa kapitel ur getChaptersForAreaAndGrade(area, grade),
  // så listan per område+årskurs måste vara homogen.
  const byAreaGrade = new Map();
  for (const c of ALL_CHAPTERS) {
    const key = `${c.areaId}|${c.grade}`;
    if (!byAreaGrade.has(key)) byAreaGrade.set(key, []);
    byAreaGrade.get(key).push(c);
  }
  for (const [key, list] of byAreaGrade) {
    const grades = new Set(list.map(c => c.grade));
    if (grades.size > 1) err(`Blandade årskurser i ${key}: ${[...grades].join(', ')}`);
  }

  // --- Matrisen årskurs × område ---
  const grades = [...new Set(ALL_CHAPTERS.map(c => c.grade).filter(Boolean))].sort();
  console.log('\nMatris årskurs × område (antal kapitel):');
  if (AREAS.length === 0) {
    console.log('  (inga områden definierade än – fyll i src/data/areaMeta.ts)');
  } else {
    const header = ['Område'.padEnd(28), ...grades.map(g => `åk${g}`.padStart(5))].join('');
    console.log('  ' + header);
    for (const a of AREAS) {
      const row = grades.map(g => String(byAreaGrade.get(`${a.id}|${g}`)?.length ?? 0).padStart(5));
      console.log('  ' + a.name.padEnd(28) + row.join(''));
      for (const g of grades) {
        if (!byAreaGrade.has(`${a.id}|${g}`)) {
          warn(`Tom kombination: ${a.name} i åk ${g} – området döljs i den årskursen`);
        }
      }
    }
  }

  console.log(`\nKapitel: ${ALL_CHAPTERS.length}  ·  Områden: ${AREAS.length}  ·  Övningar: ${exerciseIds.size}`);

  if (warnings.length) {
    console.log(`\n⚠️  ${warnings.length} varning(ar):`);
    warnings.forEach(w => console.log('   - ' + w));
  }
  if (errors.length) {
    console.log(`\n❌ ${errors.length} fel:`);
    errors.forEach(e => console.log('   - ' + e));
    process.exit(1);
  }
  console.log('\n✅ Inga fel.');
} finally {
  await rm(outDir, { recursive: true, force: true });
}
