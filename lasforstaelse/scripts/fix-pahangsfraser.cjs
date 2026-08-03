#!/usr/bin/env node
//
// Tar bort påhängsfraser ur svarsalternativ.
//
// Varför: 735 alternativ i 236 texter slutar med fraser som "på nytt",
// "av misstag" eller "utan förvarning". Endast 2 av de 735 sitter i ett rätt
// svar. Fraserna fungerar därför som en nästan perfekt markör för fel svar –
// en elev som ser mönstret kan sålla bort distraktorer utan att läsa texten.
//
// Fraserna är påhängda i slutet och går att ta bort utan att meningen bryts;
// "Till simhallen på nytt" blir "Till simhallen".
//
// Kör med --dry för att se ändringarna utan att skriva.

const fs = require('fs');
const path = require('path');

const FRASER = [
  'på nytt', 'av misstag', 'utan förvarning', 'innan det var för sent',
  'utan undantag', 'varje gång tillfälle gavs', 'ända sedan starten',
  'så fort det blev möjligt', 'direkt när situationen uppstod',
  'på eget initiativ', 'i hemlighet', 'eftersom ingen hade en bättre idé',
  'för att alla skulle förstå', 'eftersom det verkade mest rimligt',
  'eftersom det var det enda alternativet', 'fast på ett annorlunda sätt',
];

// Fraser som bara är påhäng när de avslutar alternativet. Mitt i en mening kan
// de vara meningsbärande, så de tas bort enbart i slutposition.
const SLUTFRASER = ['helt enkelt', 'vid varje tillfälle'];

// Medvetet INTE med: "för att undvika missförstånd" förekommer visserligen
// bara i felaktiga alternativ, men är där ett rimligt skäl i påståendet
// ("Humor bör tas bort för att undvika missförstånd") – inte en påhängd svans.

const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function städa(text) {
  let s = text;
  for (const fras of FRASER) {
    // Fraserna sitter i slutet, ibland efter komma. Ta med eventuellt
    // föregående kommatecken så att inte "…trasigt," blir kvar.
    //
    // Avsluta INTE med \b: i JavaScript bygger \b på [A-Za-z0-9_], så "å"
    // och "é" räknas som icke-bokstäver. Med \b matchade därför varken
    // "…skulle förstå" eller "…en bättre idé".
    s = s.replace(new RegExp(`[,;]?\\s*${escapeRe(fras)}(?=[\\s.,!?]|$)`, 'gi'), '');
  }
  for (const fras of SLUTFRASER) {
    s = s.replace(new RegExp(`[,;]?\\s*${escapeRe(fras)}\\s*[.!?]?\\s*$`, 'i'), '');
  }
  return s.replace(/\s+/g, ' ').replace(/\s+([.,!?])/g, '$1').trim();
}

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));
const dry = process.argv.includes('--dry');

let ändrade = 0;
const texter = new Set();
const iRättSvar = [];
const misstänkta = [];

lib.forEach(t => {
  (t.questions || []).forEach((q, qi) => {
    (q.options || []).forEach((o, oi) => {
      if (!o) return;

      // Rör inte rätt svar. Där kan frasen vara betydelsebärande – i
      // ak7-tema-013 ställs "bara ange" mot "bara hjälpa i hemlighet", och
      // utan "i hemlighet" faller kontrasten. Det gäller bara 2 av 704
      // alternativ, så mönstret bland distraktorerna städas ändå bort.
      if (oi === q.correct) {
        if (FRASER.some(f => o.toLowerCase().includes(f))) {
          iRättSvar.push(`${t.id} f${qi + 1}: "${o.slice(0, 70)}…"`);
        }
        return;
      }

      const ny = städa(o);
      if (ny === o) return;

      // Larma om städningen lämnar något orimligt kort eller tomt
      if (ny.length < 2) misstänkta.push(`${t.id} f${qi + 1} alt ${oi}: "${o}" → "${ny}"`);

      q.options[oi] = dry ? o : ny;
      ändrade++;
      texter.add(t.id);
    });
  });
});

console.log(`Städade ${ändrade} svarsalternativ i ${texter.size} texter.`);

if (iRättSvar.length) {
  console.log(`\nVarav i RÄTT svar (${iRättSvar.length}) – kontrollera att svaret fortfarande stämmer:`);
  iRättSvar.forEach(x => console.log(`  · ${x}`));
}
if (misstänkta.length) {
  console.log(`\n⚠️  Misstänkt korta resultat (${misstänkta.length}):`);
  misstänkta.forEach(x => console.log(`  · ${x}`));
}

if (dry) {
  console.log('\n(--dry: inget skrevs)');
} else {
  fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
}
