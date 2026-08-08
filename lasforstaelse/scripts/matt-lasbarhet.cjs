#!/usr/bin/env node
//
// Mäter läsbarhet per text och jämför med den årskurs texten är märkt med.
//
// Bakgrund: ordantalet per årskurs är redan kontrollerat, men ordantal säger
// ingenting om hur svår texten är att förstå. En text på 210 ord kan lika
// gärna handla om en katt som om maktkoncentration i demokratiska processer.
// Flera texter verkar ha fått sin årskurs efter längden och inte efter
// innehållet, och då hamnar gymnasietexter hos tioåringar.
//
// Måttet är LIX (läsbarhetsindex), som är standard för svenska:
//
//     LIX = ord/mening + (ord längre än 6 tecken) * 100 / ord
//
// Tolkning enligt vedertagen skala:
//     < 25  mycket lätt (barnböcker)
//    25–30  lätt
//    30–40  medel (skönlitteratur, dagstidning)
//    40–50  svår (facktext, myndighetstext)
//    50–60  mycket svår
//     > 60  extremt svår
//
// Skriptet skriver bara ut. Det ändrar ingenting.
//
//   node scripts/matt-lasbarhet.cjs            – översikt per årskurs
//   node scripts/matt-lasbarhet.cjs --avvikare – lista texter som sticker ut

const fs = require('fs');
const path = require('path');

const lib = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../public/data/library.json'), 'utf8')
);

function lix(text) {
  const meningar = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length || 1;
  const ord = text.trim().split(/\s+/).filter(Boolean);
  if (ord.length === 0) return 0;
  // Långa ord räknas på bokstäverna, så att citattecken och punkt inte
  // råkar putta ett sexbokstavsord över gränsen.
  const langa = ord.filter(
    (o) => o.replace(/[^a-zA-ZåäöÅÄÖéÉ]/g, '').length > 6
  ).length;
  return Math.round(ord.length / meningar + (langa * 100) / ord.length);
}

function median(v) {
  const s = [...v].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

lib.forEach((t) => {
  t._lix = lix(t.text);
});

// Genre måste hållas isär. En berättelse har korta meningar och repliker och
// får därför lågt LIX oavsett årskurs – en åk 9-berättelse ligger på samma
// nivå som en åk 3-faktatext utan att för den skull vara för lätt. Bara
// faktatexterna går att jämföra med varandra över årskurserna.
const perAk = {};
lib.forEach((t) => {
  ((perAk[t.genre] = perAk[t.genre] || {})[t.grade] =
    perAk[t.genre][t.grade] || []).push(t);
});
const genrer = Object.keys(perAk).sort();
const arskurser = [...new Set(lib.map((t) => t.grade))].sort((a, b) => a - b);

const medianPerAk = {};
genrer.forEach((g) => {
  medianPerAk[g] = {};
  arskurser.forEach((ak) => {
    const v = (perAk[g][ak] || []).map((t) => t._lix);
    if (v.length) medianPerAk[g][ak] = median(v);
  });
});

genrer.forEach((g) => {
  console.log(`\n--- ${g} ---`);
  console.log('åk   texter   median-LIX   lägsta   högsta');
  arskurser.forEach((ak) => {
    const v = (perAk[g][ak] || []).map((t) => t._lix).sort((a, b) => a - b);
    if (!v.length) return;
    console.log(
      String(ak).padStart(2),
      String(v.length).padStart(7),
      String(medianPerAk[g][ak]).padStart(11),
      String(v[0]).padStart(8),
      String(v[v.length - 1]).padStart(8)
    );
  });
});

if (!process.argv.includes('--avvikare')) {
  console.log('\nKör med --avvikare för att lista enskilda texter.');
  process.exit(0);
}

// En text räknas som för svår när den ligger på mediannivån för tre
// årskurser högre inom samma genre. Tre steg är valt för att rymma naturlig
// variation – texter ska få vara olika svåra inom samma årskurs.
const STEG = 3;
const troskel = (genre, ak) => {
  const m = medianPerAk[genre] || {};
  for (let g = ak; g <= arskurser[arskurser.length - 1]; g++) {
    if (m[g] !== undefined && g >= ak) return m[g];
  }
  return undefined;
};

// Två villkor måste hållas samtidigt. Bara "över medianen tre steg upp"
// räcker inte: berättelsernas LIX planar ut i de högre årskurserna, så en
// helt normal åk 1-berättelse kan råka ligga över åk 4-medianen. Kravet på
// minst MARGINAL poäng över den egna årskursens median rensar bort det.
const MARGINAL = 5;
const forSvara = lib
  .filter((t) => {
    const gr = troskel(t.genre, t.grade + STEG);
    const egen = (medianPerAk[t.genre] || {})[t.grade];
    return gr !== undefined && t._lix >= gr && egen !== undefined && t._lix >= egen + MARGINAL;
  })
  .sort((a, b) => a.grade - b.grade || b._lix - a._lix);

console.log(`\nFÖR SVÅRA FÖR SIN ÅRSKURS (${forSvara.length} st)`);
forSvara.forEach((t) =>
  console.log(
    `  åk${String(t.grade).padStart(2)}  ${t.genre.padEnd(11)} LIX ${String(t._lix).padStart(3)}  ${t.id.padEnd(22)} ${t.title}`
  )
);
