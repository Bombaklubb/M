#!/usr/bin/env node
//
// Fjorton frågor om författarens syfte.
//
// Typen fanns med etikett och emoji men hade bara fjorton frågor i hela
// biblioteket, alltså en halv procent. Precis som textbevis var den i praktiken
// osynlig för eleven och saknades i profilstatistiken.
//
// En fråga om författarens syfte skiljer sig från de andra genom att den inte
// gäller vad som står i texten, utan varför texten är skriven: vad avsändaren
// vill att läsaren ska förstå, känna eller göra. Alternativen är därför
// omskrivningar och inte citat – till skillnad från textbevis, där de måste
// vara ordagranna.
//
// Underlaget är i regel textens avslutning, som nästan alltid formulerar
// syftet. En fråga som går att svara på utan att ha läst slutet vore ingen
// syftesfråga.
//
// Kör med --dry för att se ändringarna utan att skriva.

const path = require('path');
const { bytUtFragor } = require('./lib/skrivfragor.cjs');

const POSTER = [
  ['ak2-etik-06', 1, {
    type: 'forfattarens-syfte',
    q: 'Vad vill berättelsen framför allt få läsaren att tänka på?',
    options: [
      'Att man alltid ska lämna hittegods till en vuxen',
      'Att en liten god handling kan få andra att göra likadant',
      'Att det är viktigt att ha varma kläder på vintern',
      'Att man inte ska lämna sina saker på marken',
    ],
    correct: 1,
  }],

  ['ak2-musik-05', 1, {
    type: 'forfattarens-syfte',
    q: 'Vad vill berättelsen framför allt visa läsaren?',
    options: [
      'Att trummor är svårare att spela än xylofon',
      'Att man behöver öva länge innan man kan spela',
      'Att en låt blir bra när man lyssnar på varandra',
      'Att musiklektionen är veckans roligaste lektion',
    ],
    correct: 2,
  }],

  ['ak4-historia-03', 1, {
    type: 'forfattarens-syfte',
    q: 'Varför avslutar berättelsen med vad Maja förstod?',
    options: [
      'För att visa att gamla brev är svåra att läsa',
      'För att visa att människor förr kände som vi gör',
      'För att visa att biblioteket har en utställning',
      'För att visa att klassen tyckte om att skriva brev',
    ],
    correct: 1,
  }],

  ['ak4-historia-04', 1, {
    type: 'forfattarens-syfte',
    q: 'Varför är texten skriven, enligt dess avslutning?',
    options: [
      'För att visa att skolan förr var bättre än i dag',
      'För att beskriva vilka leksaker barn hade förr',
      'För att förklara varför skola och barns rättigheter är viktiga',
      'För att berätta hur många barn som bodde på landsbygden',
    ],
    correct: 2,
  }],

  ['ak5-vanskap-01', 1, {
    type: 'forfattarens-syfte',
    q: 'Vad vill berättelsen framför allt säga om vänskap?',
    options: [
      'Att vänskap handlar om att alltid hålla med varandra',
      'Att grupparbeten fungerar bäst när läraren delar in',
      'Att vänskap också är att hjälpa andra att komma till tals',
      'Att den som är tyst helst vill arbeta för sig själv',
    ],
    correct: 2,
  }],

  ['ak5-vanskap-02', 1, {
    type: 'forfattarens-syfte',
    q: 'Vad vill berättelsen framför allt visa?',
    options: [
      'Att fotboll passar bättre för vissa än för andra',
      'Att vänskap ibland kräver att man säger ifrån',
      'Att raster borde vara längre än de är i dag',
      'Att den som är snabbast oftast får bestämma',
    ],
    correct: 1,
  }],

  ['ak6-miljo-09', 1, {
    type: 'forfattarens-syfte',
    q: 'Varför avslutar texten med att många små handlingar spelar roll?',
    options: [
      'För att visa att problemet är omöjligt att lösa',
      'För att förklara hur mikroplast bildas av bildäck',
      'För att beskriva hur mycket plast som finns i haven',
      'För att läsaren ska förstå att det egna valet betyder något',
    ],
    correct: 3,
  }],

  ['ak6-natur-02', 1, {
    type: 'forfattarens-syfte',
    q: 'Varför dröjer berättelsen så länge vid dimman och tystnaden?',
    options: [
      'För att förklara hur dimma bildas över en myr',
      'För att visa att bärplockning kräver mycket tålamod',
      'För att skapa den stillhet som slutet handlar om',
      'För att varna för att gå vilse i ett okänt landskap',
    ],
    correct: 2,
  }],

  ['ak6-samhalle-01', 1, {
    type: 'forfattarens-syfte',
    q: 'Vad vill berättelsen framför allt få läsaren att förstå?',
    options: [
      'Att elevråd sällan får igenom sina förslag',
      'Att ett försök kan lyckas och misslyckas samtidigt',
      'Att möten går fortare om färre personer talar',
      'Att den som antecknar minns mötet bäst efteråt',
    ],
    correct: 1,
  }],

  ['ak6-samhalle-06', 0, {
    type: 'forfattarens-syfte',
    q: 'Varför är texten skriven, enligt dess avslutning?',
    options: [
      'För att läsaren ska kunna följa nyheter och göra sin röst hörd',
      'För att förklara varför skolmaten ofta blir kritiserad',
      'För att beskriva hur många nämnder en kommun har',
      'För att visa att kommunfullmäktige väljs vart fjärde år',
    ],
    correct: 0,
  }],

  ['ak10-ai-001', 3, {
    type: 'forfattarens-syfte',
    q: 'Vad vill texten framför allt att läsaren ska ta med sig?',
    options: [
      'Att kunna följa hur beräkningarna i modellens lager går till',
      'Att kunna bedöma vad ett system kan svara på och vem som ansvarar',
      'Att kunna avgöra när generell AI blir tekniskt möjlig',
      'Att kunna skilja de största modellernas företag från varandra',
    ],
    correct: 1,
  }],

  ['ak10-ai-003', 0, {
    type: 'forfattarens-syfte',
    q: 'Varför avslutar texten med viljan att avstå från en tillämpning?',
    options: [
      'För att visa att teknisk utveckling bör stoppas helt',
      'För att visa att lagstiftning alltid hinner före tekniken',
      'För att visa att etiken måste finnas i arbetet självt',
      'För att visa att företagen sällan bryr sig om följderna',
    ],
    correct: 2,
  }],

  ['ak10-tema-001', 3, {
    type: 'forfattarens-syfte',
    q: 'Varför läser texten Harry Potter med fokus på makt?',
    // Rätt svar sist. Texten har också en textbevis-fråga med rätt svar på
    // plats B, och tillsammans hamnade svaren på bara två positioner.
    options: [
      'För att visa att magin är seriens viktigaste inslag',
      'För att förklara hur besvärjelser fungerar i böckerna',
      'För att jämföra Hogwarts med en vanlig svensk skola',
      'För att göra berättelsen mindre sagolik och mer politisk',
    ],
    correct: 3,
  }],

  ['ak10-tema-002', 0, {
    type: 'forfattarens-syfte',
    q: 'Vad vill texten framför allt att läsaren ska bli bättre på?',
    options: [
      'Att översätta böcker från engelska till svenska',
      'Att välja vilken översättning som är den enda rätta',
      'Att lägga märke till hur ordval styr en text',
      'Att läsa böcker på originalspråket i stället',
    ],
    correct: 2,
  }],
];

bytUtFragor(path.join(__dirname, '../public/data/library.json'), POSTER, {
  dry: process.argv.includes('--dry'),
});
