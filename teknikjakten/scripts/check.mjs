/**
 * Innehållskontroll för Teknikjakten.
 *
 *   npm run check
 *
 * Fångar sådant som typkontrollen inte ser: dubbletter av id, kapitel-id som inte
 * stämmer med areaId, kapitel utan innehåll, för få ord till ordsökningen och
 * chapterCount i areaMeta.ts som glidit isär från verkligheten.
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

  // --- id och areaId måste stämma överens ---
  const areaIds = new Set(AREAS.map(a => a.id));
  for (const c of ALL_CHAPTERS) {
    const m = /^([a-z0-9]+)-(.+)$/.exec(c.id);
    if (!m) {
      err(`Kapitel-id följer inte mönstret <område>-<kapitel>: ${c.id}`);
      continue;
    }
    const [, areaInId] = m;
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

  // --- chapterCount i areaMeta måste stämma med verkligheten ---
  // Startsidan visar "3/8 klara" utifrån den siffran utan att ladda kapitlen,
  // så glider den isär visar appen fel för eleven.
  const byArea = new Map();
  for (const c of ALL_CHAPTERS) {
    if (!byArea.has(c.areaId)) byArea.set(c.areaId, []);
    byArea.get(c.areaId).push(c);
  }

  console.log('\nOmråden:');
  if (AREAS.length === 0) {
    console.log('  (inga områden definierade än – fyll i src/data/areaMeta.ts)');
  } else {
    for (const a of AREAS) {
      const real = byArea.get(a.id)?.length ?? 0;
      const flagga = real === 0 ? '  – döljs (tomt)' : '';
      console.log(`  ${a.name.padEnd(24)} ${String(real).padStart(3)} kapitel${flagga}`);
      if (a.chapterCount !== real) {
        err(`${a.name}: chapterCount är ${a.chapterCount} men området har ${real} kapitel i areas.ts`);
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
