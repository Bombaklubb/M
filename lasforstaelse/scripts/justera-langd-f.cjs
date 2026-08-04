#!/usr/bin/env node
//
// Tio texter som låg 15–25 % från sina intervall, med små ingrepp: mellan
// sex och tjugotre ord åt endera hållet.
//
// Två av dem hade dessutom samma interpunktionsfel som ak1-001 hade:
// ak1-tema-018 började "I klassrummet läser. Amir en bok." och ak1-tema-019
// saknade kommatecken i en uppräkning. Båda är rättade.

const fs = require('fs');
const path = require('path');

const NYA = {

// ── för korta ────────────────────────────────────────────────────────────
'ak1-tema-017': `Noah och Kim leker på skolgården. De sparkar en blå boll mellan sig. Bollen rullar plötsligt mot staketet. Kim springer snabbt och hämtar den. Sedan fortsätter de spela och skrattar högt. När det ringer in tar Noah bollen under armen och de går in tillsammans.`,

'ak1-tema-019': `Maja bakar bullar med sin pappa. De blandar mjöl, socker och smör. Degen blir mjuk i skålen. När bullarna är klara luktar köket gott. Maja lägger en bulle på en tallrik och smakar. Den är varm och alldeles nybakad. Hon tar en till.`,

'ak1-tema-018': `I klassrummet läser Amir en bok. Boken handlar om havet. Där finns bilder på fiskar och stora valar. Amir visar en bild för sin vän Sara. De tycker att valen ser mycket stor ut. Sara vill också låna boken när Amir är klar.`,

'ak1-tema-021': `Leo och Kim leker i parken efter skolan. De har en röd boll. Leo kastar bollen högt. Kim fångar den och skrattar. Sedan sparkar de bollen över gräset. Solen skiner och vinden är svag. De leker tills det börjar bli mörkt och går sedan hem.`,

'ak4-varde-vanskap-001': `I klass 4B går elever med olika intressen och bakgrunder. Amir gillar att rita serier, Maja spelar fotboll och Kim älskar att läsa böcker. I klassen finns också Noor som använder rullstol och är duktig på schack.

Ibland kan det bli missförstånd när man arbetar i grupp. Då är det viktigt att lyssna på varandra och försöka förstå. När eleverna planerade en klassfest hade alla olika idéer. Genom att samarbeta hittade de en lösning som alla var nöjda med.

Att arbeta i grupp med någon man inte känner så väl kan kännas ovant i början. Men ofta upptäcker man saker om varandra som man annars aldrig hade fått veta.

En bra vän stöttar andra och säger ifrån om någon blir retad. I klassen har de bestämt att alla ska få vara med på rasterna. Det gör att fler känner sig trygga.

Vänskap handlar inte om att vara lika. Det handlar om att visa respekt och hjälpa varandra.`,

// ── för långa ────────────────────────────────────────────────────────────
'ak1-miljo-05': `Efter pysslet skulle klassen städa. Det fanns tre lådor: papper, plast och rest. Mateo såg en kompis kasta papper i plastlådan. Mateo blev osäker. Skulle han säga något? Han gick fram och viskade: "Papper ska dit." Han pekade på papperslådan. Aisha sa: "Oj, jag glömde." Hon flyttade pappret rätt. Mateo kände sig modig. Små saker kan hålla klassrummet rent.`,

'ak1-musik-04': `På musiklektionen fick alla prova trummor. Farah höll trumpinnarna hårt och slog för fort. Det lät rörigt och hon blev varm i ansiktet. Läraren sa: "Känn pulsen." De klappade: ett, två, ett, två. Farah provade igen och slog långsammare. Nu lät det som en riktig rytm. Bredvid henne spelade Kenji samma puls. De log mot varandra. Hon ville spela mer.`,

'ak1-natur-02': `Inuti fröet finns en ny liten växt. När fröet får vatten vaknar det. Om fröet också får värme och ljus kan det börja växa. Först kommer en liten rot som söker sig ner i jorden. Efter ett tag får växten blad. Bladen hjälper växten att få energi från solen. Till slut kan växten få en blomma.`,

'ak3-existens-020': `Mod betyder inte att man aldrig är rädd. Mod kan vara att våga göra något även när det känns pirrigt. Det kan vara att räcka upp handen i klassen eller säga ifrån när någon blir retad. Ibland är mod att be om hjälp. När man tränar på mod blir det lättare nästa gång, eftersom man märker att man klarade det.`,

'ak3-samhalle-017': `När Amir går till skolan måste han korsa en väg. Vid övergångsstället finns en knapp som tänder ett gult ljus. Amir trycker och väntar. En bil saktar in och stannar, men en cyklist kommer snabbt bakom och bromsar sent. Amir tar ett steg tillbaka. Då säger en vuxen: "Bra att du väntade." När det blir stopp går Amir lugnt över.`,
};

const NYCKELORD = {
  'ak1-tema-017': ['skolgården', 'blå boll', 'mot staketet', 'Kim springer', 'skrattar'],
  'ak1-tema-019': ['bullar', 'sin pappa', 'mjöl, socker och smör', 'luktar köket gott', 'tallrik', 'smakar'],
  'ak1-tema-018': ['I klassrummet läser Amir', 'havet', 'fiskar', 'Sara', 'valen ser mycket stor ut'],
  'ak1-tema-021': ['i parken', 'röd boll', 'kastar bollen', 'fångar den', 'över gräset', 'vinden är svag'],
  'ak4-varde-vanskap-001': ['rita serier', 'rullstol', 'samarbeta', 'säger ifrån om någon blir retad', 'med på rasterna', 'respekt'],
  'ak1-miljo-05': ['tre lådor', 'papperslådan', 'Oj, jag glömde', 'Mateo blev osäker', 'viskade'],
  'ak1-musik-04': ['trummor', 'Känn pulsen', 'Kenji', 'varm i ansiktet', 'långsammare', 'ville spela mer'],
  'ak1-natur-02': ['får vatten vaknar', 'en liten rot', 'Bladen', 'ner i jorden', 'ljus', 'blomma'],
  'ak3-existens-020': ['aldrig är rädd', 'klarade det', 'räcka upp handen i klassen', 'be om hjälp', 'pirrigt'],
  'ak3-samhalle-017': ['en knapp', 'bromsar sent', 'stannar', 'väntade', 'korsa'],
};

const BAND = { 1: [40, 60], 2: [65, 90], 3: [150, 165], 4: [200, 220], 5: [300, 320], 6: [400, 415] };

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;
Object.entries(NYA).forEach(([id, text]) => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error('Hittar inte ' + id); ok = false; return; }

  const saknas = (NYCKELORD[id] || []).filter(o => !text.toLowerCase().includes(o.toLowerCase()));
  if (saknas.length) {
    console.error(`${id}: nyckelord borta ur texten – ${saknas.join(', ')}`);
    ok = false; return;
  }

  const fore = t.text.trim().split(/\s+/).length;
  t.text = text;
  const n = text.trim().split(/\s+/).length;
  t.meta = { ...(t.meta || {}), wordCount: n };
  const b = BAND[t.grade];
  const inom = n >= b[0] && n <= b[1];
  if (!inom) ok = false;
  console.log(`${id.padEnd(24)} åk${t.grade}  ${String(fore).padStart(3)} → ${String(n).padStart(3)} ord ${inom ? '✅' : '❌ krav ' + b[0] + '–' + b[1]}  ${t.title}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
if (!ok) process.exit(1);
