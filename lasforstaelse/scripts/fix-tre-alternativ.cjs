#!/usr/bin/env node
//
// Ger de frågor som bara har tre svarsalternativ ett fjärde.
//
// Specen kräver exakt fyra alternativ per fråga. 56 frågor i 10 texter hade
// tre, vilket både bryter mot formatet och ger eleven 33 % chans att gissa
// rätt i stället för 25 %.
//
// De nya alternativen är skrivna för att ligga nära de befintliga i längd och
// stil. I flera av texterna är det rätta svaret dessutom det klart längsta,
// så det nya alternativet är medvetet lagt i samma längdklass som facit för
// att inte förstärka den signalen.
//
// Alternativen infogas på varierande position – läggs de alltid sist hamnar
// varje nytt distraktoralternativ på plats D, vilket blir ett eget mönster.

const fs = require('fs');
const path = require('path');

// nyckel: "textId|frågenummer" → nytt svarsalternativ (alltid felaktigt)
const NYA = {
  // ── ak1-bocker-103 (åk 2, Boken om rävar) ──
  'ak1-bocker-103|1': 'Till parken',
  'ak1-bocker-103|2': 'Hästar',
  'ak1-bocker-103|3': 'En fågel som flög',
  'ak1-bocker-103|4': 'Hon ville byta bok',
  'ak1-bocker-103|5': 'Kort och alldeles rak',
  'ak1-bocker-103|6': 'För att förklara hur snö bildas',

  // ── ak1-vanskap-101 (åk 2, Den blå vanten) ──
  'ak1-vanskap-101|1': 'På skolgården',
  'ak1-vanskap-101|2': 'Gul',
  'ak1-vanskap-101|3': 'Sara',
  'ak1-vanskap-101|4': 'Han hade hittat en ny',
  'ak1-vanskap-101|5': 'Trött och sur',
  'ak1-vanskap-101|6': 'För att beskriva ett djur',

  // ── ak4-bin-003 (åk 4, Bin och blommor) ──
  'ak4-bin-003|1': 'Löv och barr',
  'ak4-bin-003|2': 'Blomman byter färg helt',
  'ak4-bin-003|3': 'För att de annars tappar alla sina blad',
  'ak4-bin-003|5': 'Ett näringsämne som sprids för att blommor ska växa snabbare',
  'ak4-bin-003|6': 'Att jämföra olika sorters honung med varandra',

  // ── ak4-kartor-005 (åk 4, Att läsa en karta) ──
  'ak4-kartor-005|1': 'Skiss',
  'ak4-kartor-005|2': 'Vem som ritade kartan',
  'ak4-kartor-005|3': 'För att den alltid är nyare än en digital karta',
  'ak4-kartor-005|4': 'Kartan är ritad i fel skala',
  'ak4-kartor-005|5': 'Rita av en byggnad noggrant',
  'ak4-kartor-005|6': 'Att jämföra kartor från olika länder',

  // ── ak4-vatten-001 (åk 4, Vattnets resa) ──
  'ak4-vatten-001|1': 'Det sjunker ner i marken',
  'ak4-vatten-001|2': 'Bara morgondagg',
  'ak4-vatten-001|3': 'För att regnet annars blir varmare',
  'ak4-vatten-001|4': 'Vattna gräsmattan oftare',
  'ak4-vatten-001|5': 'Fryser till iskristaller',
  'ak4-vatten-001|6': 'Att lista världens största hav',

  // ── uni-tema-001 (åk 7, Övertygande utan att vara sann) ──
  'uni-tema-001|1': 'Den sprids framför allt via plattformarnas algoritmer och kan därför lösas tekniskt.',
  'uni-tema-001|2': 'Den saknar betydelse så länge innehållet innehåller källhänvisningar.',
  'uni-tema-001|3': 'De bör bara användas när primärkällan är skriven på ett främmande språk.',
  'uni-tema-001|4': 'Att de kan publiceras i olika tidskrifter och därmed nå olika läsare.',
  'uni-tema-001|5': 'Tvärsäkerhet och försiktighet säger lika lite, eftersom tonen inte hör ihop med innehållet.',
  'uni-tema-001|6': 'Att i första hand jämföra hur många källor olika texter hänvisar till.',

  // ── uni-tema-002 (åk 6, Öppenhetens löfte) ──
  'uni-tema-002|1': 'Öppen data är främst en teknisk fråga och avgörs bäst av den som förvaltar systemen.',
  'uni-tema-002|2': 'Att data blir mer användbar ju fler myndigheter som publicerar samma uppgifter.',
  'uni-tema-002|3': 'Att anonymisering bara behövs när uppgifterna rör hälsa eller ekonomi.',
  'uni-tema-002|4': 'För att den flyttar ansvaret från myndigheten till den som ansöker om åtkomst.',
  'uni-tema-002|5': 'Att datamängderna uppdateras tillräckligt ofta för att förbli aktuella.',
  'uni-tema-002|6': 'Effektivitet väger tyngst, eftersom snabb tillgång ger störst samhällsnytta.',

  // ── uni-tema-003 (åk 6, Ett kontor byggt för rörelse) ──
  'uni-tema-003|1': 'Rummet är utformat för att rymma så många arbetsplatser som möjligt på liten yta.',
  'uni-tema-003|3': 'De är placerade för att styra var dagsljuset faller in i rummet.',
  'uni-tema-003|4': 'Det är en plats som fyller en dekorativ funktion snarare än en praktisk.',
  'uni-tema-003|5': 'En bestämd turordning för vem som får använda de tysta zonerna.',
  'uni-tema-003|6': 'Att produktivitet går att mäta genom hur mycket varje zon används.',

  // ── uni-tema-004 (åk 6, Mötet där allt lät enkelt) ──
  'uni-tema-004|1': 'En konflikt mellan olika avdelningar om vem som ska betala för införandet.',
  'uni-tema-004|3': 'Han har redan bestämt sig och väntar bara på att mötet ska ta slut.',
  'uni-tema-004|4': 'Det framstår som ett krav från ledningen som hon inte kunde säga nej till.',
  'uni-tema-004|5': 'Att deltagarna väntade på att någon med högre befattning skulle tala först.',
  'uni-tema-004|6': 'Att förändringar lyckas när de införs snabbt innan motståndet hinner växa.',

  // ── uni-tema-005 (åk 7, Samma resultat, olika saker) ──
  'uni-tema-005|2': 'För att relativ förändring bara får användas när urvalet är slumpmässigt.',
  'uni-tema-005|3': 'Att praktisk betydelse alltid följer av signifikans när studien är tillräckligt stor.',
  'uni-tema-005|4': 'Att fler kontrollvariabler alltid ger en mer rättvisande bild av sambandet.',
  'uni-tema-005|5': 'Generaliserbarhet ökar automatiskt med antalet deltagare i studien.',
  'uni-tema-005|6': 'För att markera att statistik bör läras ut på samma sätt som grammatik.',
};

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

// Kontrollera att listan täcker exakt de frågor som har tre alternativ
const behöver = [];
lib.forEach(t => (t.questions || []).forEach((q, i) => {
  if ((q.options || []).length === 3) behöver.push(`${t.id}|${i + 1}`);
}));
const saknas = behöver.filter(k => !NYA[k]);
const överflödiga = Object.keys(NYA).filter(k => !behöver.includes(k));
if (saknas.length || överflödiga.length) {
  if (saknas.length) console.error('Saknar nytt alternativ för:', saknas.join(', '));
  if (överflödiga.length) console.error('Onödiga poster:', överflödiga.join(', '));
  process.exit(1);
}

let n = 0;
lib.forEach(t => (t.questions || []).forEach((q, i) => {
  const nytt = NYA[`${t.id}|${i + 1}`];
  if (!nytt) return;

  // Rotera insättningspositionen så att nya alternativ inte alltid hamnar sist
  const pos = n % 4;
  q.options.splice(pos, 0, nytt);
  if (pos <= q.correct) q.correct += 1;
  n++;
}));

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
console.log(`Lade till ett fjärde svarsalternativ i ${n} frågor.`);
