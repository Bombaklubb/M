#!/usr/bin/env node
//
// Fyra åk 4-texter som låg 34–40 ord över intervallet 200–220.
// Här stryks hela stycken som ingen fråga vilar på, i stället för att
// texterna skrivs om.

const fs = require('fs');
const path = require('path');

const STRYK = {
  'ak4-teknik-04': [
    'En enkel bro kan vara en planka över ett litet dike. ',
    ' Då kan man bygga en balkbro. En balk är som en stark pinne av stål eller betong som bär upp bron.',
  ],
  'ak7-tema-002': [
    '\n\nFör unga tittare kan Melodifestivalen bli en första kontakt med hur tv-produktion fungerar. Programmet visar hur kultur, teknik och ekonomi hänger ihop. Samtidigt är det en tävling där känslor spelar stor roll. När resultatet presenteras kan glädje och besvikelse märkas tydligt.',
  ],
  'ak8-tema-002': [
    ' Men politik är sällan rak.',
    ' I vissa perioder har kurdiska uttryck och organisationer begränsats, i andra har det funnits försök till dialog eller reformer.',
    ' Under 1900-talet förekom också uppror och hårda motreaktioner, vilket bidrog till att misstro växte.',
  ],
  'ak2-teknik-03': [
    ' Sara ville att roboten skulle ha långa armar, så att den kunde nå en burk med blyertspennor.',
    '\n\nKenji och Sara tittade på varandra. "Nästa gång kan den ha hjul," sa Sara.\n\n"Eller en arm som kan peka," sa Kenji.\n\nDe skrev ner sina idéer.',
  ],
};

// Ett stycke ersätts i stället för att strykas, eftersom hela poängen behövs
// men kan sägas kortare.
const ERSATT = {
  'ak4-teknik-04': [{
    fran: 'I skolan kan du göra ett enkelt test: bygg en bro av papper eller sugrör och lägg mynt på den. Då ser du hur formen och stöden påverkar hur mycket bron klarar.',
    till: 'I skolan kan du testa själv: bygg en bro av papper och lägg mynt på den.',
  }],
};

const NYCKELORD = {
  'ak4-teknik-04': ['belastning', 'bågbro', 'kablar', 'vara lång', 'modeller', 'form, material och krafter'],
  'ak7-tema-002': ['fler städer', 'internationella jurys', 'Tre minuter på scen', 'balansen', 'flera gånger under press'],
  'ak8-tema-002': ['osmanska riket', 'egna intressen', 'Turkiet, Iran, Irak och Syrien', 'Halabja', 'Gulfkriget 1991', 'eget land'],
  'ak2-teknik-03': ['robot', 'sortera pennor', 'prototyp', 'Vi provar igen', 'förbättra', 'stolt'],
};

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;
Object.keys({ ...STRYK, ...ERSATT }).forEach(id => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error('Hittar inte ' + id); ok = false; return; }
  const fore = t.text.trim().split(/\s+/).length;

  (ERSATT[id] || []).forEach(e => {
    if (!t.text.includes(e.fran)) { console.error(`${id}: hittar inte texten som skulle ersättas`); ok = false; return; }
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
  const inom = n >= 200 && n <= 220;
  if (!inom) ok = false;
  console.log(`${id.padEnd(16)} ${String(fore).padStart(4)} → ${String(n).padStart(3)} ord ${inom ? '✅' : '❌ krav 200–220'}  ${t.title}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
if (!ok) process.exit(1);
