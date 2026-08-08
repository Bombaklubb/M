#!/usr/bin/env node
//
// ak8-tema-002 "Historien om löften och gränser" flyttas från åk 4 till åk 8.
//
// Texten handlar om uppdelningen av det osmanska riket, fredsavtalen efter
// första världskriget och kurdernas ställning i fyra stater. Den låg på åk 4
// med 217 ord och LIX 47, mot årskursens median 39. Ämnet förutsätter den
// historiekunskap som byggs upp i högstadiet, och årskursen hade satts efter
// längden snarare än efter innehållet.
//
// Texten flyttas till åk 8 och skrivs ut till intervallet 530–570 ord. Det
// tillagda är det som gjorde händelseförloppet svårt att följa: Sykes–Picot,
// skillnaden mellan Sèvres 1920 och Lausanne 1923, flygförbudszonen 1991 och
// den irakiska författningen 2005. Framställningen hålls lika återhållsam som
// originalets och redovisar båda sidor i frågan om folkomröstningen 2017.
//
// Kör med --dry för att se ändringarna utan att skriva.

const fs = require('fs');
const path = require('path');

const ID = 'ak8-tema-002';
const MAL_ARSKURS = 8;
const MIN_ORD = 530;
const MAX_ORD = 570;
const FORVANTAD_ARSKURS = 4;
const BORJAR_MED = 'När första världskriget tog slut förändrades kartan i Mellanöstern.';

const NY = {
  title: 'Historien om löften och gränser',
  text: `När första världskriget tog slut ritades kartan över Mellanöstern om. Det osmanska riket, som i århundraden hade styrt stora områden, förlorade kriget och delades upp. För många kurder väcktes hoppet om ett eget område, eller åtminstone om större självbestämmande.

Redan under kriget hade Storbritannien och Frankrike i hemlighet kommit överens om hur regionen skulle fördelas mellan dem. Överenskommelsen, uppkallad efter förhandlarna Sykes och Picot, byggde på stormakternas egna intressen snarare än på var folkgrupper faktiskt bodde. I fredsavtalet i Sèvres 1920 nämndes ändå möjligheten till ett kurdiskt område. Det avtalet trädde aldrig i kraft. När förhandlingarna gjordes om i Lausanne 1923 fanns skrivningen inte kvar, och gränserna drogs utan att frågan avgjordes.

Resultatet blev att kurder kom att leva i flera olika länder. I Turkiet, Iran, Irak och Syrien utvecklades sedan olika förhållanden mellan staten och den kurdiska befolkningen. Under vissa perioder har språket varit förbjudet i skolan och i offentliga sammanhang, under andra har rättigheterna vidgats. Politiken har växlat med regeringar och med hur säkerhetsläget bedömts.

Språket är en av de frågor som återkommer. Kurdiska är inte en dialekt av turkiska, persiska eller arabiska, utan ett eget språk med flera varianter, och rätten att undervisa och sända radio på det har varit omstridd i alla fyra länderna. När ett språk saknar plats i skolan påverkas inte bara undervisningen, utan också vilka yrken som står öppna och vilka som kan följa med i det offentliga samtalet.

Ett exempel som ofta återkommer i beskrivningar av kurdernas nyare historia är gasattacken mot staden Halabja i norra Irak 1988, i slutskedet av kriget mellan Iran och Irak. Tusentals civila dog. Händelsen blev en symbol för hur civilbefolkningen kan drabbas när en konflikt trappas upp.

Efter Gulfkriget 1991 upprättades en flygförbudszon över norra Irak. Under skyddet av den växte ett självstyre fram, och 1992 hölls val till ett regionalt parlament. I den irakiska författningen från 2005 skrevs regionen in som en federal del av landet med egna myndigheter inom flera områden, bland annat skola, polis och sjukvård. Formellt tillhör området fortfarande Irak, vilket innebär att en rad beslut måste förhandlas med regeringen i Bagdad.

År 2017 hölls en folkomröstning i regionen, där en stor majoritet röstade för självständighet. Resultatet erkändes inte av Bagdad och möttes av motstånd från flera grannländer, som oroade sig för hur deras egna minoriteter skulle reagera. Kort därefter förlorade regionen kontrollen över flera omtvistade områden. Folkomröstningen används i dag som argument av båda sidor: som bevis på en folklig vilja, och som exempel på vad som kan hända när frågan drivs utan stöd utifrån.

Historien påverkar också hur man talar om framtiden. Vissa betonar rätten till ett eget land. Andra menar att starkare rättigheter och trygghet där man redan bor är viktigare, och pekar på att ett självstyre kräver fungerande institutioner och stabil ekonomi för att betyda något i vardagen. Regionen har naturresurser, och tvister om hur inkomsterna från olja ska fördelas har vid flera tillfällen påverkat löner och samhällsservice.

Många kurder lever dessutom utanför regionen. Sverige tog emot en stor grupp under 1980- och 1990-talen, och händelser i hemområdena följs noga av släktingar här.

Det som förenar många berättelser är erfarenheten av att ha funnits på kartan i människors minne, även när gränser flyttats utan att de själva fått vara med och bestämma.`,
  questions: [
    {
      type: 'literal',
      q: 'Vad byggde överenskommelsen mellan Sykes och Picot på?',
      options: [
        'På var de olika folkgrupperna i regionen faktiskt bodde vid den tiden',
        'På de gränser som redan hade dragits upp av det osmanska riket',
        'På stormakternas egna intressen snarare än på befolkningens hemvist',
        'På ett förslag som lagts fram av företrädare för befolkningen själv',
      ],
      correct: 2,
    },
    {
      type: 'literal',
      q: 'Vad skiljer fredsavtalet i Sèvres från förhandlingarna i Lausanne?',
      options: [
        'Sèvres nämnde ett kurdiskt område, men skrivningen fanns inte kvar i Lausanne',
        'Sèvres drog upp gränserna, medan Lausanne enbart handlade om handel',
        'Sèvres slöts av Storbritannien, medan Lausanne slöts av Frankrike ensamt',
        'Sèvres trädde i kraft direkt, medan Lausanne dröjde i flera årtionden',
      ],
      correct: 0,
    },
    {
      type: 'inferens',
      q: 'Varför beskriver texten politiken mot den kurdiska befolkningen som växlande?',
      options: [
        'Därför att befolkningen flyttat mellan länderna under olika perioder',
        'Därför att rättigheterna vidgats och inskränkts med regeringar och säkerhetsläge',
        'Därför att de fyra länderna kommit överens om att byta politik samtidigt',
        'Därför att språket ändrats så mycket att lagarna behövt skrivas om',
      ],
      correct: 1,
    },
    {
      type: 'literal',
      q: 'Vad gjorde det möjligt för ett självstyre att växa fram i norra Irak?',
      options: [
        'En överenskommelse som slöts direkt mellan regionen och grannländerna',
        'Ett beslut i det irakiska parlamentet omedelbart efter attacken mot Halabja',
        'En folkomröstning som hölls i regionen under året efter Gulfkriget',
        'En flygförbudszon som upprättades efter Gulfkriget 1991',
      ],
      correct: 3,
    },
    {
      type: 'inferens',
      q: 'Varför kan folkomröstningen 2017 användas som argument av båda sidor?',
      options: [
        'Därför att rösterna räknades två gånger och gav olika resultat',
        'Därför att både Bagdad och regionen hade uppmanat till deltagande',
        'Därför att den visar en folklig vilja men också vad som kan hända utan stöd utifrån',
        'Därför att valdeltagandet var för lågt för att resultatet skulle kunna tolkas',
      ],
      correct: 2,
    },
    {
      type: 'sammanfatta',
      q: 'Vilken skiljelinje i synen på framtiden beskriver texten?',
      options: [
        'Mellan dem som vill flytta gränserna och dem som vill avskaffa dem helt',
        'Mellan dem som betonar rätten till ett eget land och dem som sätter rättigheter först',
        'Mellan dem som vill förhandla med Bagdad och dem som vill vända sig till grannländerna',
        'Mellan dem som minns Halabja och dem som hellre talar om folkomröstningen',
      ],
      correct: 1,
    },
  ],
};

// ─── Körning ────────────────────────────────────────────────────────────────

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));
const raknaOrd = (s) => s.trim().split(/\s+/).filter(Boolean).length;

const t = lib.find((x) => x.id === ID);
if (!t) {
  console.error(`${ID}: finns inte i biblioteket`);
  process.exit(1);
}
if (t.grade !== FORVANTAD_ARSKURS) {
  console.error(`${ID}: förväntade åk ${FORVANTAD_ARSKURS}, fann åk ${t.grade} – kanske redan körd?`);
  process.exit(1);
}
if (!t.text.startsWith(BORJAR_MED)) {
  console.error(`${ID}: texten börjar inte som väntat – avbryter`);
  process.exit(1);
}

const ord = raknaOrd(NY.text);
if (ord < MIN_ORD || ord > MAX_ORD) {
  console.error(`${ID}: nya texten är ${ord} ord, utanför ${MIN_ORD}–${MAX_ORD}`);
  process.exit(1);
}
if (NY.questions.length !== 6 || NY.questions.some((q) => q.options.length !== 4)) {
  console.error(`${ID}: frågorna har fel form`);
  process.exit(1);
}

const foreOrd = raknaOrd(t.text);
const foreAk = t.grade;

t.grade = MAL_ARSKURS;
t.title = NY.title;
t.text = NY.text;
t.questions = NY.questions;
t.meta = { ...(t.meta || {}), wordCount: ord };

console.log(
  `${ID}  åk${foreAk} → åk${MAL_ARSKURS}   ${foreOrd} → ${ord} ord   facit ${NY.questions
    .map((q) => 'ABCD'[q.correct])
    .join('')}   ${NY.title}`
);

if (!dry) {
  fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
  console.log('Skrivet.');
} else {
  console.log('(dry run – inget skrivet)');
}
