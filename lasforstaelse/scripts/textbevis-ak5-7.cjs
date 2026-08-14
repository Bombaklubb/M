#!/usr/bin/env node
//
// Sats 3 av textbevis-frågorna: tio texter i åk 5–7.
//
// Samma princip som sats 2. Alternativen är ordagranna meningar ur texten,
// valda i ungefär samma längd. Frågorna är formulerade så att bara en av de
// fyra meningarna faktiskt bär belägget – flera av texterna innehåller nära
// nog samma påstående på två ställen, och då måste frågan peka ut vilket av
// dem som avses. Se kommentarerna i de fall där det krävde en omformulering.
//
// Kör med --dry för att se ändringarna utan att skriva.

const path = require('path');
const { bytUtFragor } = require('./lib/skrivfragor.cjs');

const POSTER = [
  // Plats 2 upptas av en fråga om författarens syfte, så textbeviset ligger
  // på plats 3. Båda satserna siktade först på samma fråga.
  ['ak4-historia-04', 2, {
    type: 'textbevis',
    q: 'Vilken mening i texten visar att det fanns ont om skolmaterial?',
    options: [
      'Läroböcker var få, så barn kunde behöva dela.',
      'Sjukdomar var också en större del av barndomen.',
      'När barn väl gick i skolan var reglerna ofta strängare.',
      'Men leksaker var ofta enklare och gjorda av det som fanns.',
    ],
    correct: 0,
  }],

  ['ak5-natur-01', 1, {
    type: 'textbevis',
    // "Vad gör grodorna?" hade passat på två av meningarna, eftersom grodrom
    // nämns strax efter. Frågan pekar därför ut vandringen.
    q: 'Vilken mening i texten visar vart grodorna vandrar på våren?',
    options: [
      'Många insekter vaknar när temperaturen stiger.',
      'Vissa fåglar, som flyttat söderut, kommer tillbaka.',
      'Grodor och paddor vandrar till dammar för att lägga ägg.',
      'I vattnet kan man ibland se grodrom som små geléklumpar.',
    ],
    correct: 2,
  }],

  ['ak4-teknik-05', 1, {
    type: 'textbevis',
    // "Vad gör en server?" stämde också på meningen om att servern svarar.
    // Frågan gäller därför definitionen.
    q: 'Vilken mening i texten förklarar vad en server är?',
    options: [
      'För att paketen ska hitta rätt används adresser.',
      'Servern svarar genom att skicka informationen tillbaka.',
      'En server är en kraftig dator som lagrar webbsidor, bilder och filmer.',
      'På internet finns IP-adresser, som fungerar lite som husnummer.',
    ],
    correct: 2,
  }],

  ['ak4-vetenskap-03', 0, {
    type: 'textbevis',
    // Texten förklarar flytande både med densitet och med lyftkraft. Frågan
    // gäller lyftkraften, annars hade tre av alternativen kunnat försvaras.
    q: 'Vilken mening i texten förklarar flytande med hjälp av lyftkraften?',
    options: [
      'Om lyftkraften är större än föremålets tyngd, flyter det.',
      'Om ett föremål har lägre densitet än vatten brukar det flyta.',
      'Om föremålet har högre densitet än vatten brukar det sjunka.',
      'Trä har ofta lägre densitet än vatten, därför flyter många träbitar.',
    ],
    correct: 0,
  }],

  ['ak5-etik-05', 1, {
    type: 'textbevis',
    q: 'Vilken mening i texten förklarar vad det betyder att något är lika?',
    options: [
      'Ett sätt att tänka är att fråga: Vad är målet?',
      'Att något är lika betyder att alla får samma sak.',
      'Ibland är det mest rättvist att behandla alla lika.',
      'Då kan skillnaden mellan rättvist och lika bli viktig.',
    ],
    correct: 1,
  }],

  ['ak10-tema-001', 2, {
    type: 'textbevis',
    q: 'Vilken mening i texten visar hur Umbridge får människor att kontrollera varandra?',
    options: [
      'Problemet är att rädslan ofta sprider sig inåt.',
      'Hon får också människor att själva övervaka varandra.',
      'Den låter korrekt på papper, men blir brutal i praktiken.',
      'Hon behöver inte kasta stora förbannelser för att förändra skolan.',
    ],
    correct: 1,
  }],

  ['ak10-tema-002', 1, {
    type: 'textbevis',
    q: 'Vilken mening i texten visar risken med att förklara för mycket i en översättning?',
    options: [
      'För en svensk kan de kräva små förtydliganden.',
      'Om texten förklarar för mycket kan den tappa tempo.',
      'Om den förklarar för lite kan den bli otydlig.',
      'Det är därför två bra översättningar kan se olika ut.',
    ],
    correct: 1,
  }],

  ['ak10-tema-003', 0, {
    type: 'textbevis',
    q: 'Vilken mening i texten visar varför ett minne är mer än bara information?',
    options: [
      'Samma sak gäller besvärjelser som styr beteende.',
      'Böckerna antyder olika svar beroende på sammanhang.',
      'Men effektivitet är inte samma sak som rättfärdighet.',
      'Ett minne är inte bara information, utan en del av identiteten.',
    ],
    correct: 3,
  }],

  ['ak10-tema-004', 2, {
    type: 'textbevis',
    q: 'Vilken mening i texten visar varför en fandom kan kännas trygg?',
    options: [
      'Men just därför kan gemenskapen också bli sårbar.',
      'Samtidigt kan fandom vara kreativ och socialt viktig.',
      'En fandom kan kännas trygg eftersom den erbjuder tillhörighet.',
      'Samma person kan låta mer tvärsäker på ett ställe än på ett annat.',
    ],
    correct: 2,
  }],

  ['ak10-tema-005', 2, {
    type: 'textbevis',
    q: 'Vilken mening i texten visar att rädsla kan påverka vilka beslut en person tar?',
    options: [
      'Serien visar också hur trauma kan påverka moral.',
      'Samtidigt visar serien att läkning sällan är linjär.',
      'En person som är rädd kan börja rättfärdiga hårda beslut.',
      'Det gör att karaktärernas val ibland blir svåra att bedöma.',
    ],
    correct: 2,
  }],
];

bytUtFragor(path.join(__dirname, '../public/data/library.json'), POSTER, {
  dry: process.argv.includes('--dry'),
});
