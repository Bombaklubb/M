#!/usr/bin/env node
//
// Två åk 9-berättelser låg 99 och 138 ord över intervallet 570–590.
// Här stryks stycken som ingen fråga vilar på, och några meningar kortas.
// Berättelsernas vändpunkter och repliker är orörda.

const fs = require('fs');
const path = require('path');

const ERSATT = {
  'ak8-etik-05': [
    { fran: `Hana tappade nästan mobilen. Hon kände hur ansiktet blev varmt, som om någon hade dragit en strålkastare mot henne.`,
      till: `Hana kände hur ansiktet blev varmt.` },
    { fran: `Mei kom springande med sin ryggsäck studsande mot ryggen.`,
      till: `Mei kom springande.` },
  ],
  'gy-etik-05': [
    { fran: ` Det var inte längre "gör en affisch", utan "visa hur du tänker".`, till: `` },
  ],
};

const STRYK = {
  'ak8-etik-05': [
    ` I bakgrunden såg man en suddig bild av människor som gick förbi. Kameran vände sig mot en grupp elever och någon i videon vinkade.`,
    ` Men samtidigt kom en annan rädsla: att det skulle bli ett stort drama, att fler skulle titta, att hennes namn skulle fastna ännu hårdare.`,
    ` Det lät som något som hör hemma i nyheter och filmer, inte i hennes mobil.`,
    `\n\nPå eftermiddagen satt Hana hemma och scrollade, fast hon visste att hon borde sluta. Några hade tagit bort sina kommentarer. Någon hade skrivit: "Okej, det var fejk." Men videon fanns fortfarande kvar på några ställen.`,
    `\n\nHana blev tyst en stund. "Tänk om det händer igen?"\n\n"Då vet vi mer nu," sa Mei. "Och då är vi fler som säger ifrån."`,
  ],
  'gy-etik-05': [
    ` Zahid blev irriterad och skrev passivt aggressiva meddelanden om ansvar.`,
    ` Hon tänkte på allt de läst om källor och etik. Hon tänkte också på Elias, som ofta såg trött ut på morgnarna och som ibland skämtade för att dölja något.`,
    ` Det blev en lång kväll. Elias skrev först klumpigt, sedan bättre. Zahid la in siffror och diagram. Nora höll ihop texten.`,
    `\n\nEfteråt satt de kvar i klassrummet när läraren kom fram. Nora var beredd på en utskällning, men läraren sa: "Jag ser att ni har jobbat hårt. Bra att ni kopplar resultat till källor."`,
  ],
};

const NYCKELORD = {
  'ak8-etik-05': ['en röst som lät som hennes', 'källkritik och manipulation', 'några sekunder av din röst',
    'det känns fel', 'bara delar vidare', 'Ta bort det. Och sluta'],
  'gy-etik-05': ['sociala medier påverkar ungas stress', 'ordagrant', 'ändra lite så märks det inte',
    'förräderi', 'egna ord', 'panik'],
};

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;
Object.keys(STRYK).forEach(id => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error('Hittar inte ' + id); ok = false; return; }
  const fore = t.text.trim().split(/\s+/).length;

  (ERSATT[id] || []).forEach(e => {
    if (!t.text.includes(e.fran)) { console.error(`${id}: hittar inte "${e.fran.trim().slice(0, 45)}…"`); ok = false; return; }
    t.text = t.text.replace(e.fran, e.till);
  });
  (STRYK[id] || []).forEach(s => {
    if (!t.text.includes(s)) { console.error(`${id}: hittar inte "${s.trim().slice(0, 45)}…"`); ok = false; return; }
    t.text = t.text.replace(s, '');
  });

  const saknas = (NYCKELORD[id] || []).filter(o => !t.text.toLowerCase().includes(o.toLowerCase()));
  if (saknas.length) { console.error(`${id}: nyckelord borta – ${saknas.join(', ')}`); ok = false; return; }

  const n = t.text.trim().split(/\s+/).length;
  t.meta = { ...(t.meta || {}), wordCount: n };
  const inom = n >= 570 && n <= 590;
  if (!inom) ok = false;
  console.log(`${id.padEnd(14)} ${String(fore).padStart(4)} → ${String(n).padStart(3)} ord ${inom ? '✅' : '❌ krav 570–590'}  ${t.title}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
if (!ok) process.exit(1);
