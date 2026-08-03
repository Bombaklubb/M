#!/usr/bin/env node
//
// Utökar de 20 texter som bara har fyra frågor till sex.
//
// Alla 20 har exakt samma uppsättning: literal, inferens, literal, inferens.
// Det som saknas är därmed `ord` och `sammanfatta`, så varje text får en av
// varje. Det täpper till formatkravet och lyfter samtidigt `ord`, som var
// kraftigt underrepresenterad i hela biblioteket.
//
// Orden som frågas efter är valda ur respektive text, och svarsalternativen
// hålls i jämnbred längd så att facit inte går att peka ut på längden.
// Rätt svar läggs på varierande position.

const fs = require('fs');
const path = require('path');

const NYA_FRAGOR = {
  'ak3-djur-006': [
    { type: 'ord', q: 'Vad betyder ordet "stack" i texten?',
      options: ['Ett litet berg', 'Myrornas bo', 'En sorts mat', 'En smal stig'], correct: 1 },
    { type: 'sammanfatta', q: 'Vad handlar texten mest om?',
      options: ['Vad myror äter', 'Hur myror bygger bon', 'Hur myror hittar vägen hem', 'Varför myror är små'], correct: 2 },
  ],
  'ak3-djur-011': [
    { type: 'ord', q: 'Vad betyder ordet "darrar" i texten?',
      options: ['Skakar lite', 'Sover djupt', 'Springer fort', 'Äter snabbt'], correct: 0 },
    { type: 'sammanfatta', q: 'Vad handlar texten mest om?',
      options: ['Att Ture åker buss hem', 'Att Ture får en egen kanin', 'Att Ture bygger en snögubbe', 'Att Ture hjälper en kanin'], correct: 3 },
  ],
  'ak3-etik-007': [
    { type: 'ord', q: 'Vad betyder ordet "stressad" i texten?',
      options: ['Glad och pigg', 'Jäktad och orolig', 'Trött och sömnig', 'Arg och sur'], correct: 1 },
    { type: 'sammanfatta', q: 'Varför är texten skriven, tror du?',
      options: ['För att lära ut hur busskort fungerar', 'För att beskriva olika sorters hundar', 'För att visa hur man gör rätt mot andra', 'För att berätta om en butik i staden'], correct: 2 },
  ],
  'ak3-etik-018': [
    { type: 'ord', q: 'Vad betyder ordet "ångrar" i texten?',
      options: ['Skyndar sig mycket', 'Glömmer bort helt', 'Blir väldigt glad', 'Tycker att det blev fel'], correct: 3 },
    { type: 'sammanfatta', q: 'Vad handlar texten mest om?',
      options: ['Vad det innebär att säga förlåt', 'Hur man blir bäst i klassen', 'Varför man ska städa hemma', 'Hur man hittar nya vänner'], correct: 0 },
  ],
  'ak3-existens-010': [
    { type: 'ord', q: 'Vad betyder ordet "nyfiken" i texten?',
      options: ['Är rädd för mörker', 'Vill veta mer', 'Blir lätt trött', 'Tycker om att sova'], correct: 1 },
    { type: 'sammanfatta', q: 'Vad handlar texten mest om?',
      options: ['Att Meja köper ett teleskop', 'Att Meja lär sig alla planeter', 'Att Meja funderar på rymden', 'Att Meja är rädd för mörkret'], correct: 2 },
  ],
  'ak3-existens-020': [
    { type: 'ord', q: 'Vad betyder ordet "pirrigt" i texten?',
      options: ['Nervöst i kroppen', 'Väldigt kallt ute', 'Riktigt roligt', 'Ganska tyst'], correct: 0 },
    { type: 'sammanfatta', q: 'Vad handlar texten mest om?',
      options: ['Hur man springer fort', 'Varför man ska sova länge', 'Hur man lagar mat', 'Vad mod kan vara'], correct: 3 },
  ],
  'ak3-familj-005': [
    { type: 'ord', q: 'Vad betyder ordet "vispar" i texten?',
      options: ['Häller upp', 'Rör om snabbt', 'Smakar på', 'Ställer fram'], correct: 1 },
    { type: 'sammanfatta', q: 'Vad handlar texten mest om?',
      options: ['Ett recept på hemgjord sylt', 'En tävling i matlagning', 'En familj som lagar mat ihop', 'En vanlig dag i skolan'], correct: 2 },
  ],
  'ak3-familj-015': [
    { type: 'ord', q: 'Vad betyder ordet "nervös" i texten?',
      options: ['Lite orolig', 'Väldigt hungrig', 'Riktigt arg', 'Ganska trött'], correct: 0 },
    { type: 'sammanfatta', q: 'Vad handlar texten mest om?',
      options: ['Hur man bakar chokladtårta', 'Varför ballonger smäller', 'Vad man leker på rasten', 'Hur Aya förbereder sitt kalas'], correct: 3 },
  ],
  'ak3-natur-002': [
    { type: 'ord', q: 'Vad betyder ordet "energi" i texten?',
      options: ['Ett slags färg', 'Kraft som trädet behöver', 'En sorts blad', 'Vatten i marken'], correct: 1 },
    { type: 'sammanfatta', q: 'Vad handlar texten mest om?',
      options: ['Hur man planterar ett träd', 'Vilka djur som bor i träd', 'Varför löv byter färg', 'Hur man räknar löv'], correct: 2 },
  ],
  'ak3-natur-012': [
    { type: 'ord', q: 'Vad betyder ordet "glittrar" i texten?',
      options: ['Blänker i ljuset', 'Blir alldeles grått', 'Låter väldigt högt', 'Fryser snabbt till is'], correct: 0 },
    { type: 'sammanfatta', q: 'Vad handlar texten mest om?',
      options: ['Hur man fiskar i en sjö', 'Varför fåglar flyttar', 'Hur man bygger en brygga', 'En morgon när dimman lättar'], correct: 3 },
  ],
  'ak3-samhalle-009': [
    { type: 'ord', q: 'Vad betyder ordet "information" i texten?',
      options: ['Sagor och sånger', 'Fakta och upplysningar', 'Bilder och filmer', 'Möbler och hyllor'], correct: 1 },
    { type: 'sammanfatta', q: 'Vad handlar texten mest om?',
      options: ['Hur man skriver en bok', 'Varför filmer kostar pengar', 'Vad man kan göra på ett bibliotek', 'Hur man bygger ett hus'], correct: 2 },
  ],
  'ak3-samhalle-017': [
    { type: 'ord', q: 'Vad betyder ordet "korsa" i texten?',
      options: ['Gå över', 'Springa längs', 'Stanna vid', 'Vända om'], correct: 0 },
    { type: 'sammanfatta', q: 'Vad handlar texten mest om?',
      options: ['Hur man lär sig cykla', 'Varför bilar kör fort', 'Hur man hittar till skolan', 'Att se sig för i trafiken'], correct: 3 },
  ],
  'ak3-skola-003': [
    { type: 'ord', q: 'Vad betyder ordet "lättad" i texten?',
      options: ['Väldigt hungrig', 'Lugn efter oro', 'Riktigt arg', 'Ganska sömnig'], correct: 1 },
    { type: 'sammanfatta', q: 'Vad handlar texten mest om?',
      options: ['Hur man räknar matte', 'Varför ryggsäckar är tunga', 'Att berätta när något gått fel', 'Hur man skriver fint'], correct: 2 },
  ],
  'ak3-skola-013': [
    { type: 'ord', q: 'Vad betyder ordet "paus" i texten?',
      options: ['En kort vila', 'Ett långt prov', 'En sorts lek', 'Ett stort rum'], correct: 0 },
    { type: 'sammanfatta', q: 'Vad handlar texten mest om?',
      options: ['Hur man leker kurragömma', 'Varför skolan börjar tidigt', 'Vad man äter till lunch', 'Vad en rast är och varför'], correct: 3 },
  ],
  'ak3-sport-004': [
    { type: 'ord', q: 'Vad betyder ordet "varv" i texten?',
      options: ['Ett par skor', 'En runda i banan', 'En sorts boll', 'Ett långt rep'], correct: 1 },
    { type: 'sammanfatta', q: 'Vad handlar texten mest om?',
      options: ['Hur man lagar mat efter träning', 'Varför salar är stora', 'Att orka fortsätta trots trötthet', 'Hur man räknar poäng'], correct: 2 },
  ],
  'ak3-sport-014': [
    { type: 'ord', q: 'Vad betyder ordet "risken" i texten?',
      options: ['Chansen att något går fel', 'En sorts träning', 'Ett mått på tid', 'En del av kroppen'], correct: 0 },
    { type: 'sammanfatta', q: 'Vad handlar texten mest om?',
      options: ['Hur man simmar snabbt', 'Vilka skor som är bäst', 'Hur länge man ska sova', 'Varför man värmer upp'], correct: 3 },
  ],
  'ak3-vanskap-001': [
    { type: 'ord', q: 'Vad betyder ordet "försiktigt" i texten?',
      options: ['Snabbt och högljutt', 'Lugnt och lite osäkert', 'Argt och bestämt', 'Glatt och skrattande'], correct: 1 },
    { type: 'sammanfatta', q: 'Vad handlar texten mest om?',
      options: ['Hur man tränar fotboll', 'Varför staket byggs', 'Att bjuda in någon som är ny', 'Hur man byter klass'], correct: 2 },
  ],
  'ak3-vanskap-016': [
    { type: 'ord', q: 'Vad betyder ordet "låna" i texten?',
      options: ['Få använda och lämna tillbaka', 'Få behålla för alltid', 'Köpa för egna pengar', 'Byta bort mot något annat'], correct: 0 },
    { type: 'sammanfatta', q: 'Vad handlar texten mest om?',
      options: ['Hur man stickar vantar', 'Varför vintern är kall', 'Hur man packar ryggsäck', 'Att hjälpa någon som fryser'], correct: 3 },
  ],
  'ak3-vetenskap-008': [
    { type: 'ord', q: 'Vad betyder ordet "ånga" i texten?',
      options: ['Is som smälter', 'Vatten som blivit gas', 'Snö som faller', 'Sand som blåser'], correct: 1 },
    { type: 'sammanfatta', q: 'Vad handlar texten mest om?',
      options: ['Hur man mäter vatten', 'Varför moln är vita', 'Hur regn bildas', 'Hur vinden blåser'], correct: 2 },
  ],
  'ak3-vetenskap-019': [
    { type: 'ord', q: 'Vad betyder ordet "experiment" i texten?',
      options: ['Ett försök där man testar', 'En sorts läxa', 'Ett långt prov', 'En bok om djur'], correct: 0 },
    { type: 'sammanfatta', q: 'Vad handlar texten mest om?',
      options: ['Hur man skriver i en bok', 'Varför skedar är av plast', 'Hur mynt tillverkas', 'Vad magneter drar till sig'], correct: 3 },
  ],
};

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

const behöver = lib.filter(t => (t.questions || []).length !== 6).map(t => t.id);
const saknas = behöver.filter(id => !NYA_FRAGOR[id]);
const överflödiga = Object.keys(NYA_FRAGOR).filter(id => !behöver.includes(id));
if (saknas.length || överflödiga.length) {
  if (saknas.length) console.error('Saknar frågor för:', saknas.join(', '));
  if (överflödiga.length) console.error('Onödiga poster:', överflödiga.join(', '));
  process.exit(1);
}

let n = 0;
lib.forEach(t => {
  const nya = NYA_FRAGOR[t.id];
  if (!nya) return;
  // Kontrollera att ordet som efterfrågas faktiskt finns i texten
  nya.forEach(q => {
    const m = q.q.match(/"([^"]+)"/);
    if (m && !t.text.toLowerCase().includes(m[1].toLowerCase())) {
      console.error(`VARNING: ordet "${m[1]}" finns inte i ${t.id}`);
    }
  });
  t.questions.push(...nya);
  n += nya.length;
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
console.log(`Lade till ${n} frågor i ${Object.keys(NYA_FRAGOR).length} texter.`);
