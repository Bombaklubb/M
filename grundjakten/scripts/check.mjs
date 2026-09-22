/**
 * Kör innehållskontrollen för övningsbanken.
 *
 * Buntar src/dev/checkTasks.ts med esbuild (som redan finns via Vite) och kör
 * resultatet i node. Katalogen importerar ingenting som rör DOM, så den går
 * att köra utanför webbläsaren – vilket är hela poängen: att hitta trasiga
 * uppgifter i terminalen i stället för hos en elev.
 */
import * as esbuild from 'esbuild';
import path from 'node:path';

const rot = path.resolve(import.meta.dirname, '..');

const res = await esbuild.build({
  entryPoints: [path.join(rot, 'src/dev/checkTasks.ts')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
  alias: { '@': path.join(rot, 'src') },
  logLevel: 'error',
});

const kod = res.outputFiles[0].text;
const mod = await import(
  'data:text/javascript;base64,' + Buffer.from(kod).toString('base64')
);

const katalogfel = mod.kollaKatalog();
const bildordfel = mod.kollaBildord();
const upprepfel = mod.kollaUpprepningar();
const trafel = mod.kollaTrakistor();
const progfel = mod.kollaProgression();
const { antal, fel } = mod.kollaAllaTasks();
const pass = mod.kollaBokstavspass();
const alla = [...katalogfel, ...bildordfel, ...upprepfel, ...trafel, ...progfel, ...fel, ...pass.fel];

console.log(`Byggde ${antal} pass ur övningsbanken och ${pass.antal} pass ur Bokstavsresan.`);

if (alla.length === 0) {
  console.log('Inga fel.');
  process.exit(0);
}

console.log(`\n${alla.length} fel:\n`);
for (const f of alla.slice(0, 40)) {
  console.log(`  ${f.task}${f.seed ? ` (frö ${f.seed})` : ''}: ${f.meddelande}`);
}
if (alla.length > 40) console.log(`  ... och ${alla.length - 40} till`);
process.exit(1);
