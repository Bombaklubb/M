#!/usr/bin/env node
//
// De nitton åk 4-texter som låg 2–20 ord över intervallet 200–220.
// En mening eller bisats stryks i varje; ingenting skrivs om i sak.
//
// Här rättas också en trasig fråga i ak7-teknik-04: den frågade om en
// "jämförelse med en butik" som inte finns någonstans i texten.
//
// Kör med --dry för att bara se ordräkningen utan att skriva.

const fs = require('fs');
const path = require('path');

const BAND = { 1:[40,60], 2:[65,90], 3:[150,165], 4:[200,220], 5:[300,320],
               6:[400,415], 7:[500,530], 8:[530,570], 9:[570,590], 10:[590,625] };

const STRYK = {
  'ak9-gpt-003':      [' Det lät som en gåta man ska imponera med på en fest, inte som något som rör en vardag i en förortsskola.'],
  'ak8-tema-011':     [' Den finns i telefonens ansiktsigenkänning, i appar som föreslår musik och i verktyg som kan skriva text.',
                       ' Ju mer data det får, desto fler mönster kan det hitta.'],
  'ak5-tema-015':     [' Mikroplasten sprids med strömmar och finns nu i alla hav, även i Arktis.',
                       ' Forskare arbetar med metoder för att samla in plast ur havet, men det räcker inte.'],
  'ak7-teknik-04':    ['Varför gör man så? Det finns för mycket innehåll. Om du följde hundra konton skulle du inte hinna se allt. '],
  'ak8-tema-014':     [' Dessutom ger sociala medier möjlighet att hålla kontakt med människor som bor långt bort.',
                       ' Hjärnan behöver pauser för att bearbeta intryck och vila.'],
  'ak9-lotr-001':     [' I den andra delen fördjupas konflikten genom stora slag och inre prövningar. Den tredje delen knyter samman berättelsen genom avgörande strider och ringens slutliga öde.'],
  'ak9-gpt-001':      [' Jag hade lovat mig själv att inte bli en av dem. Ändå kände jag den reflexmässiga irritationen när täckningen dog.'],
  'ak7-vetenskap-06': ['Ordet experiment används ofta i vardagen. Men i naturvetenskap betyder experiment något mer specifikt. '],
  'ak5-tema-021':     [' Laget representerar England i internationella matcher och har spelat sedan slutet av 1800-talet.'],
  'ak8-tema-013':     [' Den syns överallt – i horisonten på en bilresa, utanför skolans fönster, i parker och naturreservat.'],
  'ak10-ai-005':      [' Osäkerheten är stor, men konsekvenserna av de val vi gör i dag kan bli avgörande.'],
  'ak2-etik-06':      [' Hon tänkte också att det hade känts konstigt att ta den hem.'],
  'ak9-lotr-002':     [' Uppdraget att bära ringen innebär inte bara fysiska faror utan också en psykisk kamp mot dess inflytande.'],
  'ak6-tema-009':     ['\n\nNästa gång du ser en stubbe i skogen, stanna och titta. Du kanske upptäcker mer liv än du trodde.'],
  'ak9-lotr-003':     [' Detta kan tolkas som en kommentar till hur makt kan korrumpera även den mest välmenande individ.'],
  'ak7-tema-004':     [' Det betyder dock inte att alla kontroverser är planerade.'],
  'ak9-gpt-002':      [' Orden var blanka, nästan obestridliga.'],
  'ak7-tema-005':     [' Det synsättet har gjort henne till en tydlig profil i vissa samhällsdebatter.'],
  'ak6-tema-010':     [' De flesta av oss reagerar snabbt på bilder, ofta snabbare än på text.'],
};

const ERSATT = {
  'ak9-gpt-002': [{ fran: 'i mjuka, nästan mekaniska bågar', till: 'i mjuka bågar' }],
};

const NYCKELORD = {
  'ak9-gpt-003':      ['Vi är fria, men ändå bundna', 'valfrihet', 'en macka', 'gick förbi snabbt', 'känns som att välja också', 'väljer man ändå tystnaden'],
  'ak8-tema-011':     ['mönsterigenkänning', 'maskininlärning', 'bias', 'transparens', 'låneansökningar, sjukdomsdiagnoser eller brottsmisstankar', 'ersätter inte mänskligt omdöme'],
  'ak5-tema-015':     ['Det mesta är plast', 'mikroplast', 'förväxla plastpåsar med maneter', 'flera gånger större än Sverige', 'minska mängden plast', 'mat, syre'],
  'ak7-teknik-04':    ['uppsättning steg, som ett recept', 'vad du stannar vid', 'bubbla', 'belönar starka reaktioner', 'inte en neutral lista'],
  'ak8-tema-014':     ['snabbt nå familj och vänner', 'öka stress', 'fear of missing out', 'Paradoxalt', 'rastlösa i början', 'hitta en balans'],
  'ak9-lotr-001':     ['praktiska och ekonomiska skäl', 'korrumperar', 'Domedagsberget', 'parallella handlingar', 'ansvar, vänskap och uppoffring'],
  'ak9-gpt-001':      ['tekniskt fel', 'ansiktsigenkänning', 'inte har något att dölja', 'nyfikenhet', 'undantag tenderar att bli rutin', 'skärmarna slocknar'],
  'ak7-vetenskap-06': ['planerat test', 'oberoende variabeln', 'kontrollgrupp', 'upprepar experimentet', 'felkällor'],
  'ak5-tema-021':     ['Twickenham', '2003', '80 minuter', 'drop goal', 'Six Nations', 'röda rosen'],
  'ak8-tema-013':     ['sjuttio procent', 'kolsänkor', 'naturskog', 'bruka och bevara', 'hållbart skogsbruk', 'renar luften'],
  'ak10-ai-005':      ['artificiell generell intelligens', 'medicin, klimatforskning', 'hastighet framför säkerhet', 'målstyrning', 'inte förutbestämd', 'alla medborgare'],
  'ak2-etik-06':      ['mössa', 'Bilal', 'Arvin', 'Sanna sprang ikapp', 'Min mormor stickade den', 'snällhet kan smitta'],
  'ak9-lotr-002':     ['förändras gradvis under ringens tyngd', 'trofasthet och vardagligt hjältemod', 'acceptera sitt ansvar', 'Boromirs fall', 'tragisk gestalt', 'psykologiskt djup'],
  'ak6-tema-009':     ['Svampar och bakterier', 'leta efter insekterna', 'binder fukt', 'inte är ett slut utan en övergång', 'näringskedja'],
  'ak9-lotr-003':     ['symbol för absolut makt', 'inre frestelsen', 'minsta person kan påverka', 'Isengård', 'öppen för tolkning'],
  'ak7-tema-004':     ['förändrade sin stil', 'konstnärlig frihet och ansvar', 'granskas hårdare än manliga', 'ökad synlighet', 'missförstådd', 'populärkultur och samhällsnormer'],
  'ak9-gpt-002':      ['zebrafiskar', 'ärftlig hjärtsjukdom', 'optimerad hälsa', 'grammatikkontroll', 'kall luftström'],
  'ak7-tema-005':     ['hemlöshet bland unga', 'stiftelse', 'inspireras att själva engagera sig', 'hålla sig till underhållning', 'tystnad också är ett ställningstagande'],
  'ak6-tema-010':     ['alltid ett urval', 'retuscherade', 'bästa ögonblick', 'bildkritisk', 'känns direkta och sanna'],
};

// Frågan hänvisade till en butiksjämförelse som inte finns i texten.
// Ersätts av en fråga med samma rätt-index, så svarsfördelningen är oförändrad.
const NY_FRAGA = {
  id: 'ak7-teknik-04',
  index: 5,
  fraga: {
    type: 'inferens',
    q: 'Vad menar texten med att flödet "inte är en neutral lista"?',
    options: [
      'Att någon har valt ut vad du får se',
      'Att listan är sorterad i bokstavsordning',
      'Att alla användare ser exakt samma sak',
      'Att appen visar allt du missat',
    ],
    correct: 0,
  },
};

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;
Object.keys(STRYK).forEach(id => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error('Hittar inte ' + id); ok = false; return; }
  const fore = t.text.trim().split(/\s+/).length;

  STRYK[id].forEach(s => {
    if (!t.text.includes(s)) { console.error(`${id}: hittar inte "${s.trim().slice(0, 45)}…"`); ok = false; return; }
    t.text = t.text.replace(s, '');
  });
  (ERSATT[id] || []).forEach(e => {
    if (!t.text.includes(e.fran)) { console.error(`${id}: hittar inte "${e.fran.slice(0, 45)}…"`); ok = false; return; }
    t.text = t.text.replace(e.fran, e.till);
  });

  const saknas = (NYCKELORD[id] || []).filter(o => !t.text.toLowerCase().includes(o.toLowerCase()));
  if (saknas.length) { console.error(`${id}: nyckelord borta – ${saknas.join(', ')}`); ok = false; return; }

  const [min, max] = BAND[t.grade];
  const n = t.text.trim().split(/\s+/).length;
  t.meta = { ...(t.meta || {}), wordCount: n };
  const inom = n >= min && n <= max;
  if (!inom) ok = false;
  console.log(`${id.padEnd(18)} åk${String(t.grade).padStart(2)}  ${String(fore).padStart(3)} → ${String(n).padStart(3)} ord ${inom ? '✅' : `❌ krav ${min}–${max}`}`);
});

const mal = lib.find(x => x.id === NY_FRAGA.id);
const gammal = mal && mal.questions[NY_FRAGA.index];
if (!gammal || !gammal.q.includes('butik')) {
  console.error('ak7-teknik-04: förväntade butiksfrågan på plats ' + NY_FRAGA.index); ok = false;
} else if (gammal.correct !== NY_FRAGA.fraga.correct) {
  console.error('ak7-teknik-04: rätt-index skiljer sig, svarsfördelningen skulle ändras'); ok = false;
} else {
  mal.questions[NY_FRAGA.index] = NY_FRAGA.fraga;
  console.log('\nak7-teknik-04: fråga 6 bytt – hänvisade till en butiksjämförelse som saknas i texten');
}

if (!dry) fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
else console.log('(dry run – inget skrivet)');
if (!ok) process.exit(1);
