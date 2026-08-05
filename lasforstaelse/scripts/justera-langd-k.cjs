#!/usr/bin/env node
//
// Åtta texter som låg 10–15 % över sina intervall. Hela meningar och stycken
// stryks; ingenting skrivs om. Nyckelordskontrollen ser till att inget som
// en fråga vilar på försvinner.

const fs = require('fs');
const path = require('path');

const ERSATT = {
  'ak3-etik-018': [{
    fran: 'Ibland behöver den som blivit ledsen också tid. Då kan man fråga:',
    till: 'Man kan också fråga:',
  }],
  'ak3-natur-002': [{
    fran: 'Det beror på att träden får mindre ljus när dagarna blir kortare.',
    till: 'Det beror på att dagarna blir kortare.',
  }, {
    fran: 'Till slut släpper trädet löven så att det kan vila under vintern och spara energi.',
    till: 'Till slut släpper trädet löven för att vila och spara energi.',
  }],
};

const STRYK = {
  'ak3-sport-004': [' Hon tar ett djupt andetag och springer snabbare.'],

  'ak8-tema-001': [
    ' Michaels starka röst och scennärvaro gjorde att han snabbt stack ut.',
    '\n\nSammanfattningsvis är Michael Jackson en komplex figur i musikhistorien. Hans konstnärliga betydelse är svår att förneka, samtidigt som hans liv utanför scenen fortfarande väcker frågor och diskussioner.',
  ],

  'ak8-tema-012': [
    '\n\nPå rasten sa kompisen Ella: "Jag tyckte det lät fint. Hur stavas det?" Amina visade, och Ella provade att säga ordet. Det lät fel men känslan var rätt.',
  ],

  'ak7-miljo-02': [
    ' Matsvinn händer hemma, i butiker och i skolor.',
    ' Mat börjar inte i affären.',
    ' Traktorer använder bränsle, växthus kan kräva uppvärmning, och transporter kräver lastbilar, båtar eller flyg.',
  ],

  'ak7-tema-003': [
    'Trots kritiken har flera av hennes låtar nått höga placeringar på topplistor världen över. Hon har också uppträtt på stora galor och prisats för sin röst. ',
  ],

  'ak5-tema-007': [
    ' Bokstäverna på framsidan var skrivna med svarta bläckpennan i en slingrande stil som var svår att läsa.',
    ' genom skogen',
  ],
};

const NYCKELORD = {
  'ak3-etik-018': ['ångrar', 'taskigt', 'Hur kan jag hjälpa', 'starkare'],
  'ak3-natur-002': ['hösten', 'klorofyll', 'spara energi', 'gula, orange eller röda'],
  'ak3-sport-004': ['gymnastiksalen', 'konerna', 'Du klarar det', 'tänker på målet', 'varv'],
  'ak8-tema-001': ['The Jackson 5', 'mest sålda albumet', 'hur musik presenterades', 'scenshower', 'välgörenhet', 'inflytelserika artister'],
  'ak8-tema-012': ['kaak-kakorna', 'fnissade', 'lagom', 'ett sätt att tänka', 'två hela världar', 'modet att använda dem'],
  'ak7-miljo-02': ['mat som kunde ha ätits slängs', 'metan', 'Sista förbrukningsdag', 'resurser', 'portioner', 'förstå systemet'],
  'ak7-tema-003': ['Hannah Montana', 'Bangerz', 'delade åsikter', 'mer kraftfull', 'rock och country', 'relevant'],
  'ak5-tema-007': ['på vinden', '1923', 'järnvägen', 'på sekunder', 'varsamt', 'del av vår historia'],
};

const BAND = { 1: [40, 60], 2: [65, 90], 3: [150, 165], 4: [200, 220], 5: [300, 320], 6: [400, 415] };

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;
Object.keys({ ...STRYK, ...ERSATT }).forEach(id => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error('Hittar inte ' + id); ok = false; return; }
  const fore = t.text.trim().split(/\s+/).length;

  (ERSATT[id] || []).forEach(e => {
    if (!t.text.includes(e.fran)) { console.error(`${id}: hittar inte "${e.fran.slice(0, 45)}…"`); ok = false; return; }
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
  const b = BAND[t.grade];
  const inom = n >= b[0] && n <= b[1];
  if (!inom) ok = false;
  console.log(`${id.padEnd(16)} åk${t.grade}  ${String(fore).padStart(3)} → ${String(n).padStart(3)} ord ${inom ? '✅' : '❌ krav ' + b[0] + '–' + b[1]}  ${t.title}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
if (!ok) process.exit(1);
