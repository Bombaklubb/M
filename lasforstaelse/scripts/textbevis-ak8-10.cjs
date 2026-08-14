#!/usr/bin/env node
//
// Sats 4 av textbevis-frågorna: nio texter i åk 8–10.
//
// Med den här satsen finns fyrtio textbevis-frågor, alltså ungefär en per
// tolfte text. Det räcker för att en elev ska möta typen med jämna mellanrum
// utan att den tar över.
//
// Kör med --dry för att se ändringarna utan att skriva.

const path = require('path');
const { bytUtFragor } = require('./lib/skrivfragor.cjs');

const POSTER = [
  ['ak6-historia-12', 1, {
    type: 'textbevis',
    q: 'Vilken mening i texten visar varför salt var så viktigt förr?',
    options: [
      'En känd del av handelshistorien är Sidenvägen.',
      'Sjukdomar följde samma vägar som människor och last.',
      'Salt behövdes för att konservera mat, särskilt innan kylskåp fanns.',
      'Förr i tiden var transporter långsamma och ofta farliga.',
    ],
    correct: 2,
  }],

  ['ak6-samhalle-06', 1, {
    type: 'textbevis',
    q: 'Vilken mening i texten visar vem som väljer kommunstyrelsen?',
    options: [
      'De som blir valda sitter i kommunfullmäktige.',
      'Kommunfullmäktige väljer i sin tur kommunstyrelsen.',
      'För att klara alla uppgifter finns också nämnder.',
      'Därefter kan en nämnd diskutera och föreslå ett beslut.',
    ],
    correct: 1,
  }],

  ['ak6-vetenskap-11', 1, {
    type: 'textbevis',
    q: 'Vilken mening i texten visar vad kroppen bildar efter en vaccination?',
    options: [
      'Vissa celler fungerar som väktare och larmar.',
      'Andra använder en ofarlig version som liknar smittan.',
      'Samtidigt startar en process där immunförsvaret skapar antikroppar.',
      'Vacciner kan ge biverkningar, som öm arm eller lätt feber.',
    ],
    correct: 2,
  }],

  ['ak8-musik-04', 1, {
    type: 'textbevis',
    q: 'Vilken mening i texten visar vad en sampling kan bestå av?',
    // Rätt svar på plats C. På plats B fick texten tre rätta svar i rad på
    // samma position, och då går frågorna att klara på mönster.
    options: [
      'Det finns olika sätt att arbeta lagligt och etiskt.',
      'Först behöver man förstå vad en sampling är rent praktiskt.',
      'Det kan vara en trumloop, en melodi eller ett kort vokal-ljud.',
      'Kompositionen måste fortfarande klareras, men inte inspelningen.',
    ],
    correct: 2,
  }],

  ['ak8-samhalle-02', 1, {
    type: 'textbevis',
    q: 'Vilken mening i texten visar vilken uppgift domstolarna har?',
    options: [
      'Demokrati är mer än att rösta vart fjärde år.',
      'Domstolar kan avgöra om något bryter mot lagen.',
      'Systemet är lagar, val, myndigheter och domstolar.',
      'Men rättigheter kommer ofta tillsammans med ansvar.',
    ],
    correct: 1,
  }],

  ['ak8-vetenskap-01', 1, {
    type: 'textbevis',
    // Texten nämner både att avbrott är ett problem och vad avbrottet leder
    // till. Frågan gäller följden, annars hade två alternativ kunnat försvaras.
    q: 'Vilken mening i texten visar följden av att avbryta en antibiotikakur för tidigt?',
    options: [
      'En viktig orsak är överanvändning och felanvändning.',
      'Ett annat problem är om man avbryter en kur för tidigt.',
      'Då ökar chansen att resistenta bakterier överlever och sprids.',
      'Utvecklingen av nya antibiotika har samtidigt gått långsamt.',
    ],
    correct: 2,
  }],

  ['ak10-ai-001', 1, {
    type: 'textbevis',
    q: 'Vilken mening i texten är belägg för att ingen AI i dag har mänsklig bredd?',
    options: [
      'Träningsdata är därför inte en neutral resurs.',
      'Det är brukligt att skilja mellan smal och generell AI.',
      'All AI som används i dag är smal, hur imponerande den än verkar.',
      'Under 1900-talets senare hälft dominerade en annan ansats.',
    ],
    correct: 2,
  }],

  ['ak10-ai-002', 0, {
    type: 'textbevis',
    q: 'Vilken mening i texten är belägg för att tidigare teknikskiften också skapade arbeten?',
    options: [
      'Den vanliga bilden är att hela yrken försvinner.',
      'Vävstolen ersatte handvävaren men skapade fabriken.',
      'Det som skiljer det pågående skiftet är hastigheten.',
      'Det är dessutom svårt att mäta effekten medan den pågår.',
    ],
    correct: 1,
  }],

  ['ak10-ai-005', 1, {
    type: 'textbevis',
    q: 'Vilken mening i texten är belägg för att jämförelsen med kärnvapenkontroll inte håller?',
    options: [
      'Osäkerheten i sig har blivit ett argument i debatten.',
      'En del av oenigheten handlar om hur förmåga ska mätas.',
      'Jämförelser görs ibland med kontrollen av kärnvapen, men liknelsen haltar.',
      'Det som förenar de flesta bedömare är att utvecklingen inte är förutbestämd.',
    ],
    correct: 2,
  }],
];

bytUtFragor(path.join(__dirname, '../public/data/library.json'), POSTER, {
  dry: process.argv.includes('--dry'),
});
