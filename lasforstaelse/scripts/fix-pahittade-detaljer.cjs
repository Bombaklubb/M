#!/usr/bin/env node
//
// Två frågor som bygger på detaljer som inte finns i texten.
//
// ak7-etik-07 fråga 5 lyder "Vad menar Arvin när han säger att folk delar för
// att det är spännande, som att titta på en brand?". Arvin säger aldrig något
// om en brand, och liknelsen finns inte någonstans i texten. Två av
// distraktorerna handlar dessutom om eld och ljus och blir obegripliga utan
// den påhittade liknelsen. Frågan skrivs om till en tolkningsfråga som texten
// faktiskt bär, och de två eldalternativen ersätts. Rätt svar och dess plats
// står kvar.
//
// ak7-sport-05 fråga 3 lyder "Vad ropar Samir vid staketet?". Något staket
// finns inte i texten – Samir ropar när Zahra kommer in på sista varvet.
// Eleven som letar efter staketet hittar inget, så platsangivelsen byts mot
// den som texten ger.
//
// Kör med --dry för att se ändringarna utan att skriva.

const fs = require('fs');
const path = require('path');

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;

function hamta(id, index, gammalFraga) {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error(`Hittar inte ${id}`); ok = false; return null; }
  const q = (t.questions || [])[index];
  if (!q || q.q !== gammalFraga) {
    console.error(`${id}: förväntade "${gammalFraga}" på plats ${index}, fann "${q && q.q}"`);
    ok = false; return null;
  }
  return { t, q };
}

function visa(id, index, q, fore) {
  console.log(`\n${id} f${index + 1}`);
  console.log(`   gammal: ${fore}`);
  console.log(`   ny:     ${q.q}`);
  q.options.forEach((o, i) => console.log(`   ${i === q.correct ? '✓' : ' '} ${'ABCD'[i]}) ${o}`));
}

function langdkoll(id, index, q) {
  const l = q.options.map(o => o.length);
  const ratt = l[q.correct];
  const ovriga = l.filter((_, i) => i !== q.correct);
  const motLangsta = ratt / Math.max(...ovriga);
  const motKortaste = Math.min(...ovriga) / ratt;
  if (motLangsta >= 1.6 || motKortaste >= 1.6) {
    console.error(`${id} f${index + 1}: längdkvot ${motLangsta.toFixed(2)}× / ${motKortaste.toFixed(2)}×`);
    ok = false;
  }
}

// ── ak7-etik-07 fråga 5 ──────────────────────────────────────────────────────
{
  const ID = 'ak7-etik-07', INDEX = 4;
  const funnet = hamta(ID, INDEX,
    'Vad menar Arvin när han säger att folk delar för att det är spännande, som att titta på en brand?');
  if (funnet) {
    const { t, q } = funnet;
    // Spärr: liknelsen ska verkligen saknas i texten.
    if (/brand|eld/i.test(t.text)) {
      console.error(`${ID}: texten nämner ändå eld eller brand – kontrollera manuellt`);
      ok = false;
    } else if (q.options[q.correct] !== 'Att människor dras till drama även om det skadar någon') {
      console.error(`${ID}: rätt svar är inte det förväntade`); ok = false;
    } else {
      const fore = q.q;
      q.q = 'Vad kan man förstå om varför skärmdumpen sprids så snabbt i chatten?';
      q.type = 'inferens';
      const ERSATT = [
        ['Att Noor tycker om att tända ljus', 'Att alla i klassen redan kände Noor mycket väl'],
        ['Att eld är intressant att läsa om i NO', 'Att skärmdumpar alltid raderas efter en kort stund'],
      ];
      ERSATT.forEach(([fran, till]) => {
        const i = q.options.indexOf(fran);
        if (i === -1) { console.error(`${ID}: hittar inte "${fran}"`); ok = false; return; }
        if (i === q.correct) { console.error(`${ID}: "${fran}" är rätt svar`); ok = false; return; }
        q.options[i] = till;
      });
      visa(ID, INDEX, q, fore);
      langdkoll(ID, INDEX, q);
    }
  }
}

// ── ak7-sport-05 fråga 3 ─────────────────────────────────────────────────────
{
  const ID = 'ak7-sport-05', INDEX = 2;
  const funnet = hamta(ID, INDEX, 'Vad ropar Samir vid staketet?');
  if (funnet) {
    const { t, q } = funnet;
    if (/staket/i.test(t.text)) {
      console.error(`${ID}: texten nämner ändå ett staket – kontrollera manuellt`);
      ok = false;
    } else if (!t.text.includes('sista varvet')) {
      console.error(`${ID}: texten saknar belägget "sista varvet"`); ok = false;
    } else {
      const fore = q.q;
      q.q = 'Vad ropar Samir när Zahra kommer in på sista varvet?';
      visa(ID, INDEX, q, fore);
    }
  }
}

if (!dry) fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
else console.log('\n(dry run – inget skrivet)');
if (!ok) process.exit(1);
