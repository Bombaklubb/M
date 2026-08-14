#!/usr/bin/env node
//
// Sats 2 av textbevis-frågorna: tio texter i åk 2–4.
//
// Efter första satsen fanns elva textbevis-frågor av 2922, alltså 0,38 procent.
// På en given nivå hade två till fem procent av texterna en, så en elev fick
// läsa ett trettiotal texter innan hen mötte typen. Kategorin fanns men syntes
// inte. Den här satsen och de följande höjer andelen till ungefär en fråga per
// åttonde text.
//
// Alternativen är ordagranna meningar ur texten, valda i ungefär samma längd så
// att rätt svar inte går att peka ut på formatet. Se scripts/lib/skrivfragor.cjs
// för kontrollerna och scripts/lib/citatkandidater.cjs för urvalet.
//
// Kör med --dry för att se ändringarna utan att skriva.

const path = require('path');
const { bytUtFragor } = require('./lib/skrivfragor.cjs');

const POSTER = [
  ['ak1-vetenskap-09', 1, {
    type: 'textbevis',
    q: 'Vilken mening i texten visar när skuggan blir kort?',
    options: [
      'En skugga blir till när något stoppar ljuset.',
      'Du kan testa genom att gå ut och titta på din skugga.',
      'När solen står högt mitt på dagen blir skuggan kortare.',
      'När solen står lågt, på morgonen eller kvällen, blir skuggan lång.',
    ],
    correct: 2,
  }],

  ['ak2-tema-006', 2, {
    type: 'textbevis',
    q: 'Vilken mening i texten visar hur en enhörning ser ut?',
    options: [
      'Enhörningar är magiska djur som finns i sagor.',
      'De liknar hästar men har ett långt horn i pannan.',
      'Varje kväll tittade hon ut mot skogen och hoppades få se en.',
      'Alva log och visste att hon aldrig skulle glömma den stunden.',
    ],
    correct: 1,
  }],

  ['ak3-tema-021', 3, {
    type: 'textbevis',
    q: 'Vilken mening i texten visar var kakaon växer?',
    options: [
      'Kakaon växer i varma länder långt från Sverige.',
      'För att göra choklad behöver man kakao, socker och mjölk.',
      'I dag tänker många på fika och högtider när de ser märket.',
      'I fabriken ville de göra choklad som många skulle tycka om.',
    ],
    correct: 0,
  }],

  ['ak3-tema-022', 4, {
    type: 'textbevis',
    q: 'Vilken mening i texten visar var man kan läsa hur mycket chokladkakan väger?',
    options: [
      'Chokladen är uppdelad i rutor som är lätta att bryta loss.',
      'Ibland gör de tillfälliga smaker som bara säljs under en kort tid.',
      'På förpackningen står det vilken smak det är och hur mycket den väger.',
      'Många tycker om att dela en stor chokladkaka med familj eller vänner.',
    ],
    correct: 2,
  }],

  ['ak3-tema-023', 4, {
    type: 'textbevis',
    q: 'Vilken mening i texten visar hur bönorna transporteras till fabrikerna?',
    options: [
      'De växer på träd i varma länder nära ekvatorn.',
      'De skickas med båt till fabriker i andra länder.',
      'Till sist packas plattorna och skickas till affärer.',
      'För att göra Marabous choklad börjar allt med kakaobönor.',
    ],
    correct: 1,
  }],

  ['ak1-historia-07', 1, {
    type: 'textbevis',
    q: 'Vilken mening i texten visar att skrivtecken från förr fortfarande går att se?',
    options: [
      'Då kunde man använda samma tavla många gånger.',
      'Sådana tecken finns kvar på runstenar än i dag.',
      'För länge sedan kunde man skriva med bläck och fjäder.',
      'Sättet ändras, men behovet att skriva finns kvar.',
    ],
    correct: 1,
  }],

  ['ak2-historia-07', 1, {
    type: 'textbevis',
    q: 'Vilken mening i texten visar att alla barn förr inte gick i skolan varje dag?',
    options: [
      'Många barn hjälpte till hemma eller arbetade.',
      'När skolor fanns kunde klassrummen vara annorlunda.',
      'Det betyder att de inte behövde gå i skolan varje dag.',
      'Läraren kunde vara sträng och barnen hade andra regler.',
    ],
    correct: 2,
  }],

  ['ak2-miljo-04', 1, {
    type: 'textbevis',
    q: 'Vilken mening i texten visar vad som händer om soporna blandas?',
    options: [
      'Matrester kan göra papper blött och smutsigt.',
      'Då kan man återvinna, alltså göra nytt av gammalt.',
      'Därför är det bra att ha olika kärl hemma och i skolan.',
      'Om allt blandas i samma påse blir det svårare att återvinna.',
    ],
    correct: 3,
  }],

  ['ak2-natur-02', 1, {
    type: 'textbevis',
    q: 'Vilken mening i texten visar hur ekorren använder svansen när det är kallt?',
    // Rätt svar först. På plats D fick texten tre rätta svar i rad på samma
    // position, och då går frågorna att klara på mönster i stället för på text.
    options: [
      'Den kan också använda svansen som en filt när det är kallt.',
      'Ekorren har också bra hörsel och skarpa klor.',
      'Ekorren har en lång svans som ser ut som en buske.',
      'Den kan klättra rakt upp på en stam och hoppa långt.',
    ],
    correct: 0,
  }],

  ['ak2-tema-004', 2, {
    type: 'textbevis',
    q: 'Vilken mening i texten visar vad snö egentligen är?',
    options: [
      'Snö kan vara lös och fluffig eller tung och blöt.',
      'När det är tillräckligt kallt ute kan det börja snöa.',
      'Snö är egentligen vatten som har frusit till iskristaller uppe i molnen.',
      'När snöflingorna blir tillräckligt tunga faller de ner mot marken.',
    ],
    correct: 2,
  }],
];

bytUtFragor(path.join(__dirname, '../public/data/library.json'), POSTER, {
  dry: process.argv.includes('--dry'),
});
