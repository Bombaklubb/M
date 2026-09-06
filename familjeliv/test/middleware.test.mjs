/**
 * Tester för lösenordsskyddet i middleware.ts.
 *
 * Middleware körs på Vercels edge och går inte att provköra med `npm run dev`,
 * så den paketeras här med esbuild (samma sätt som Vercel gör) och anropas som
 * vanliga Request-objekt. `@vercel/edge` byts mot en stubbe som svarar 299, så
 * "släpptes igenom" går att skilja från "fick inloggningssidan".
 *
 *   node test/middleware.test.mjs
 */

import { build } from 'esbuild';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const dir = await mkdtemp(join(tmpdir(), 'familjeliv-mw-'));
await writeFile(join(dir, 'edge-stub.js'), "export function next() { return new Response('NEXT', { status: 299 }); }\n");

const paketera = async (fil, alias) => {
  const ut = join(dir, `${fil.replace(/\W/g, '_')}.mjs`);
  await build({ entryPoints: [fil], bundle: true, format: 'esm', platform: 'neutral', outfile: ut, alias });
  return import(pathToFileURL(ut).href);
};

const { default: mw } = await paketera('middleware.ts', { '@vercel/edge': join(dir, 'edge-stub.js') });
const { FAMILY_GRADIENT } = await paketera('src/data.ts');

let ok = 0;
let fel = 0;
const kolla = (namn, villkor, extra = '') => {
  if (villkor) { ok++; console.log('  ok  ', namn); }
  else { fel++; console.log('  FEL ', namn, extra); }
};

const post = (kropp) => new Request('https://familjeliv.vercel.app/login', {
  method: 'POST',
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams(kropp),
});

// Inloggningssidan målas med samma bakgrund som appens rubrik. Färgen står i
// klartext i middleware.ts — en import därifrån in i src/ fäller edge-funktionen.
const sida = await (await mw(new Request('https://familjeliv.vercel.app/'))).text();
kolla('inloggningssidan har samma bakgrund som appen', sida.includes(FAMILY_GRADIENT),
  'middleware.ts och FAMILY_GRADIENT har glidit isär');

// Utan kaka lämnar varken appen eller dess data servern.
let r = await mw(new Request('https://familjeliv.vercel.app/'));
kolla('/ utan kaka ger inloggningssidan', r.status === 401);
kolla('inloggningssidan avslöjar inte lösenordet', !sida.toLowerCase().includes('mkasb'));
kolla('inloggningssidan har ett formulär', sida.includes('action="/login"'));

r = await mw(new Request('https://familjeliv.vercel.app/assets/index-abc.js'));
kolla('appens JS är också skyddad', r.status === 401);

// Fel lösenord ger ingen kaka.
r = await mw(post({ password: 'fel' }));
kolla('fel lösenord nekas', r.status === 401 && !r.headers.get('set-cookie'));
kolla('fel lösenord visar felmeddelande', (await r.text()).includes('Fel lösenord'));

// Rätt lösenord ger en signerad kaka som inte innehåller lösenordet.
r = await mw(post({ password: 'mkasb' }));
const kaka = r.headers.get('set-cookie') ?? '';
kolla('rätt lösenord skickar vidare till appen', r.status === 303 && r.headers.get('location') === '/');
kolla('kakan är HttpOnly + Secure + SameSite', /HttpOnly/.test(kaka) && /Secure/.test(kaka) && /SameSite=Lax/.test(kaka));
kolla('kakan innehåller inte lösenordet', !kaka.toLowerCase().includes('mkasb'));

const token = kaka.split(';')[0];
r = await mw(new Request('https://familjeliv.vercel.app/', { headers: { cookie: token } }));
kolla('giltig kaka släpper igenom', r.status === 299);

r = await mw(new Request('https://familjeliv.vercel.app/', { headers: { cookie: 'familjen_auth=deadbeef' } }));
kolla('påhittad kaka nekas', r.status === 401);

r = await mw(post({ password: '  MKASB ' }));
kolla('lösenordet tål versaler och blanksteg', r.status === 303);

// Inloggningssidan visar avatarerna, så de måste vara öppna.
for (const p of ['/icon.svg', '/avatars/astrid.svg', '/manifest.webmanifest', '/favicon.ico']) {
  r = await mw(new Request('https://familjeliv.vercel.app' + p));
  kolla(`${p} är öppen`, r.status === 299);
}

// APP_PASSWORD i Vercel styr lösenordet och ersätter standardvärdet.
process.env.APP_PASSWORD = 'nyttlösen';
r = await mw(post({ password: 'mkasb' }));
kolla('standardlösenordet slutar gälla när APP_PASSWORD sätts', r.status === 401);
r = await mw(post({ password: 'nyttlösen' }));
kolla('APP_PASSWORD styr lösenordet', r.status === 303);
delete process.env.APP_PASSWORD;

console.log(`\n${ok} ok, ${fel} fel`);
process.exit(fel ? 1 : 0);
