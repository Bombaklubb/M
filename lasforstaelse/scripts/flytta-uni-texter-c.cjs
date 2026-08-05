#!/usr/bin/env node
//
// Del C: de tre sista texterna flyttas från åk 6 till åk 10 och byggs ut.
//
// uni-tema-003 hade dessutom ett dubblerat ord i sista meningen:
// "utan att göra våld på vare sig sig själv eller andra". Rättat.

const fs = require('fs');
const path = require('path');

const ERSATT = {
  'uni-tema-003': [{ fran: 'vare sig sig själv', till: 'vare sig sig själva' }],
};

const FLYTT = {

'uni-tema-002': { grade: 10, tillagg: [
  { fore: 'Ett möjligt svar är att kräva anonymisering.', text:
`Ett välkänt exempel på hur svårt återidentifiering är att skydda sig mot kommer från en filmtjänst som 2006 släppte ett anonymiserat dataset med betyg från nästan en halv miljon användare. Forskare kunde koppla en del av dem till namngivna personer genom att jämföra betygen med offentliga recensioner på en annan webbplats. Datasetet innehöll inga namn, men mönstret av vad någon sett och hur de betygsatt det var i praktiken ett fingeravtryck.` },
  { fore: 'En rimlig position är att kombinera öppenhet', text:
`Sedan dess har metoder utvecklats för att lägga till brus på ett kontrollerat sätt, så att statistiska mönster bevaras medan enskilda individer skyddas. Den amerikanska folkräkningen använde en sådan metod 2020, vilket ledde till kritik från forskare som menade att bruset gjorde vissa små orters siffror oanvändbara. Avvägningen mellan skydd och användbarhet försvinner alltså inte med bättre teknik, den flyttar bara.

Det finns också en fråga om vem som faktiskt får nytta av öppen data. Att publicera ett stort dataset gör det tillgängligt i formell mening, men att använda det kräver kompetens, lagring och beräkningskraft. I praktiken hamnar därför en del av vinsten hos aktörer som redan har resurser, medan de som datan handlar om sällan har möjlighet att göra något med den. Öppenhet är inte automatiskt detsamma som utjämning, och kan i vissa fall förstärka det motsatta.` },
]},

'uni-tema-003': { grade: 10, tillagg: [
  { fore: 'Vid fönstren, i en smalare korridor', text:
`Materialen bär en del av arbetet. Golvet växlar från hårt till mjukt där tempot ska sjunka, och akustikplattor sitter tätare över de ytor där samtal förväntas. Ingenting av det annonseras med skyltar. Rummet instruerar genom underlag, ljus och avstånd, vilket gör att de flesta anpassar sig utan att kunna säga varför.` },
  { fore: 'Det som binder ihop rummet', text:
`Sådana miljöer bygger på ett antagande som inte alltid håller: att människor väljer plats efter uppgift. I praktiken väljer många efter vana, efter var kollegorna sitter eller efter var det finns en ledig stol klockan nio. En kontorstyp som förutsätter rörelse kan därför sluta fungera som ett vanligt landskap, med skillnaden att ingen längre har en egen plats.

Det som saknas i beskrivningen är också värt att lägga märke till. Var förvarar den som har ryggont sin egen stol? Var sitter den som behöver ta ett samtal om något privat? En yta formad efter arbetsuppgifter är inte automatiskt formad efter kroppar och liv, och de behoven brukar visa sig först när rummet tagits i bruk, långt efter att ritningarna godkänts och möblerna redan står på plats.` },
]},

'uni-tema-004': { grade: 10, tillagg: [
  { fore: 'Under diskussionen om piloten tog Jonas ordet.', text:
`Hon hade sett samma bild förut, i en annan organisation och med andra pilar. Det som återkom var inte innehållet utan formen: en presentation som beskriver en förändring utifrån, som om den skedde på en karta och inte i människors veckor. Ingenstans i bilden fanns raden där någon ska hinna lära sig något nytt samtidigt som det gamla ska fortsätta fungera.` },
  { fore: 'Efteråt stannade Sara kvar', text:
`En kollega som suttit tyst hela mötet frågade till slut vad som händer med dem som inte hinner med. Chefen svarade att ingen skulle lämnas efter. Svaret var vänligt och sa ingenting, och Sara märkte att hon skrev ner det ordagrant, som om hon ville kunna citera det senare, ifall det behövdes.

På väg mot dörren tänkte hon på ordet pilot. Det lät som ett försök, något man kunde avbryta. Men i hennes erfarenhet blev piloter sällan avbrutna. De blev utvärderade av samma personer som beslutat om dem, och sedan infördes de. Att kalla något ett försök kunde vara ett sätt att sänka motståndet mot ett beslut som redan var fattat någon annanstans, av någon som inte satt i rummet.` },
]},
};

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;
Object.entries(FLYTT).forEach(([id, d]) => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error('Hittar inte ' + id); ok = false; return; }
  const foreG = t.grade;
  const foreN = t.text.trim().split(/\s+/).length;

  (ERSATT[id] || []).forEach(e => {
    if (!t.text.includes(e.fran)) { console.error(`${id}: hittar inte "${e.fran}"`); ok = false; return; }
    t.text = t.text.replace(e.fran, e.till);
  });
  d.tillagg.forEach(a => {
    if (!t.text.includes(a.fore)) {
      console.error(`${id}: hittar inte ankaret "${a.fore.slice(0, 40)}…"`); ok = false; return;
    }
    t.text = t.text.replace(a.fore, a.text + '\n\n' + a.fore);
  });

  t.grade = d.grade;
  const n = t.text.trim().split(/\s+/).length;
  t.meta = { ...(t.meta || {}), wordCount: n };
  const inom = n >= 590 && n <= 625;
  if (!inom) ok = false;
  console.log(`${id.padEnd(14)} åk${foreG} → åk${d.grade}   ${String(foreN).padStart(4)} → ${String(n).padStart(4)} ord ${inom ? '✅' : '❌ krav 590–625'}  ${t.title.slice(0, 42)}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');

const kvar = lib.filter(t => /^(gy-uni|uni)-/.test(t.id) && t.grade !== 10);
console.log(`\nuni-texter kvar på fel årskurs: ${kvar.length}`);
if (!ok) process.exit(1);
