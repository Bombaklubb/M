#!/usr/bin/env node
//
// Söker bildkandidater hos Unsplash och sparar dem för granskning.
//
// Skriptet tilldelar ingenting. Det enda det gör är att hämta förslag och
// lägga dem på disk, så att bilderna går att titta på innan de kopplas till
// en text. Just den ordningen är hela poängen: förra omgången tilldelades
// bilder på nyckelord utan att någon såg dem, och då hamnade en brun björn på
// texterna om Björn Borg och en trave böcker om entreprenörskap på tio
// Harry Potter-texter.
//
// Nyckeln läses från UNSPLASH_ACCESS_KEY. Demo-nivån tillåter 50 anrop i
// timmen, så skriptet stannar och rapporterar hur många som återstår i
// stället för att bränna kvoten i onödan.
//
//   node scripts/sok-bildkandidater.cjs <fil-med-sokord.json>
//
// Filen ska innehålla [{ nyckel, sokord }, ...].

const fs = require('fs');
const path = require('path');

const NYCKEL = process.env.UNSPLASH_ACCESS_KEY;
if (!NYCKEL) {
  console.error('UNSPLASH_ACCESS_KEY saknas.');
  process.exit(1);
}

const indataFil = process.argv[2];
if (!indataFil) {
  console.error('Ange en fil med sökord.');
  process.exit(1);
}

const UT = process.argv[3] || '/tmp/bildkandidater';
const PER_SOKNING = 6;

async function sok(sokord) {
  const url =
    'https://api.unsplash.com/search/photos?per_page=' +
    PER_SOKNING +
    '&orientation=landscape&content_filter=high&query=' +
    encodeURIComponent(sokord);
  const svar = await fetch(url, { headers: { Authorization: `Client-ID ${NYCKEL}` } });
  const kvar = svar.headers.get('x-ratelimit-remaining');
  if (!svar.ok) {
    throw new Error(`${svar.status} för "${sokord}" (kvar: ${kvar})`);
  }
  const data = await svar.json();
  return {
    kvar,
    traffar: (data.results || []).map((r) => ({
      id: r.id,
      // Samma format som biblioteket redan använder.
      url: `https://images.unsplash.com/photo-${r.id}?w=600&h=400&fit=crop`,
      raw: r.urls.raw,
      beskrivning: r.description || r.alt_description || '',
    })),
  };
}

(async () => {
  const poster = JSON.parse(fs.readFileSync(indataFil, 'utf8'));
  fs.mkdirSync(UT, { recursive: true });

  const resultat = [];
  let kvar = '?';
  for (const p of poster) {
    try {
      const r = await sok(p.sokord);
      kvar = r.kvar;
      resultat.push({ ...p, traffar: r.traffar });
      console.log(`${String(p.nyckel).padEnd(28)} ${r.traffar.length} träffar  (kvot kvar: ${kvar})`);
      if (Number(kvar) <= 2) {
        console.error('\nKvoten nästan slut – avbryter här. Kör igen om en timme.');
        break;
      }
    } catch (e) {
      console.error(`${p.nyckel}: ${e.message}`);
      break;
    }
  }

  fs.writeFileSync(path.join(UT, 'kandidater.json'), JSON.stringify(resultat, null, 1));
  console.log(`\n${resultat.length} sökningar sparade i ${UT}/kandidater.json`);
})();
