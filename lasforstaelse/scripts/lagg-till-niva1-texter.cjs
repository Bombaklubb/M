#!/usr/bin/env node
//
// Femton nya texter till nivå 1.
//
// Nivån är omgjord till ett verkligt första steg. De gamla nivå 1-texterna
// låg på 40–60 ord och ligger nu på nivå 2. Dessa är 20–35 ord, med fyra till
// sex meningar och högst åtta ord per mening.
//
// Vad som gör dem lättare, utöver längden:
//   - en sats per mening, inga bisatser
//   - vanliga ord som en sjuåring hör varje dag
//   - presens och konkreta händelser i rätt ordning
//   - en eller två personer, inga sidospår
//
// Ämnena är hämtade ur en sjuårings egen dag: bollen, katten, mössan, bakning,
// regn, nya skor, hunden, snögubben, äpplet, bussen, fågeln, cykeln,
// sandlådan, godnattsagan och badet.
//
// Frågorna är av tre slag. Läsa på raderna dominerar, eftersom det är det
// eleven tränar först. Varje text har också en ordfråga, som förklarar ett
// ord ur texten, och avslutas med en fråga om vad texten handlar om.
//
// Bilderna är sökta hos Unsplash, nedladdade och granskade en och en.
//
// Kör med --dry för att se vad som skulle läggas till utan att skriva.

const fs = require('fs');
const path = require('path');

const BILD = (slug) => `https://images.unsplash.com/${slug}?w=600&h=400&fit=crop`;

const N = (id, title, slug, text, questions) => ({
  id,
  grade: 1,
  genre: 'berättelse',
  theme: 'vardag',
  title,
  imageUrl: BILD(slug),
  text,
  questions,
});

const TEXTER = [
  N('ak1-lattlast-01', 'Bollen på gatan', 'photo-1628312816680-98e1bf8dfeac',
    'Max har en röd boll.\n\nBollen rullar ut på gatan.\n\nMax blir rädd.\n\n' +
    'Mamma springer och hämtar bollen.\n\nNu ler Max igen.',
    [
      { type: 'literal', q: 'Vilken färg har bollen?', options: ['Den är röd', 'Den är blå', 'Den är grön', 'Den är gul'], correct: 0 },
      { type: 'literal', q: 'Vart rullar bollen?', options: ['In i huset', 'Ut på gatan', 'Ner i sjön', 'Upp i trädet'], correct: 1 },
      { type: 'inferens', q: 'Varför blir Max rädd?', options: ['För att bollen är röd', 'För att mamma är arg', 'För att bollen är blöt', 'För att gatan är farlig'], correct: 3 },
      { type: 'literal', q: 'Vem hämtar bollen?', options: ['Max gör det', 'Pappa gör det', 'Mamma gör det', 'En hund gör det'], correct: 2 },
      { type: 'ord', q: 'Vad betyder hämtar?', options: ['Kastar bort', 'Går och tar', 'Gömmer undan', 'Sparkar iväg'], correct: 1 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['En hund i en park', 'En bil på en väg', 'En kaka på ett bord', 'En boll som rullar bort'], correct: 3 },
    ]),

  N('ak1-lattlast-02', 'Tuss sover', 'photo-1786283531774-f92962b16562',
    'Katten heter Tuss.\n\nTuss ligger i solen.\n\nHon sover hela dagen.\n\n' +
    'På kvällen vaknar hon.\n\nDå vill Tuss ha mat.',
    [
      { type: 'literal', q: 'Vad heter katten?', options: ['Tuss', 'Bux', 'Pelle', 'Mira'], correct: 0 },
      { type: 'literal', q: 'Var ligger Tuss?', options: ['I sängen', 'I solen', 'I gräset', 'I korgen'], correct: 1 },
      { type: 'literal', q: 'När vaknar Tuss?', options: ['På morgonen', 'Mitt i natten', 'På kvällen', 'Vid lunch'], correct: 2 },
      { type: 'ord', q: 'Vad betyder vaknar?', options: ['Somnar om', 'Springer ut', 'Blir hungrig', 'Slutar sova'], correct: 3 },
      { type: 'inferens', q: 'Varför ligger Tuss i solen?', options: ['För att det är varmt där', 'För att hon letar mat', 'För att hon är rädd', 'För att hon leker'], correct: 0 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['En hund som skäller', 'En katt som sover', 'En fågel som sjunger', 'En pojke som äter'], correct: 1 },
    ]),

  N('ak1-lattlast-03', 'Mössan som flög', 'photo-1606927609126-0aa3c31dcb65',
    'Ida har en rosa mössa.\n\nDet blåser ute.\n\nMössan flyger av.\n\n' +
    'Ida springer efter den.\n\nHon får tag i mössan.',
    [
      { type: 'literal', q: 'Vilken färg har mössan?', options: ['Vit', 'Svart', 'Rosa', 'Brun'], correct: 2 },
      { type: 'literal', q: 'Hur är vädret ute?', options: ['Det blåser', 'Det snöar', 'Det regnar', 'Det är varmt'], correct: 0 },
      { type: 'inferens', q: 'Varför flyger mössan av?', options: ['Ida kastar den', 'Vinden tar den', 'En fågel tar den', 'Den är för blöt'], correct: 1 },
      { type: 'ord', q: 'Vad betyder får tag i?', options: ['Tappar bort', 'Ger bort', 'Lyckas ta', 'Går förbi'], correct: 2 },
      { type: 'literal', q: 'Vad gör Ida när mössan flyger?', options: ['Hon gråter högt', 'Hon ropar på hjälp', 'Hon står stilla', 'Hon springer efter'], correct: 3 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['En mössa som blåser bort', 'En flicka som fryser', 'En fågel i ett träd', 'En jacka som blir blöt'], correct: 0 },
    ]),

  N('ak1-lattlast-04', 'Vi bakar bullar', 'photo-1654791226981-7b87a218d530',
    'Idag bakar vi bullar.\n\nPappa knådar degen.\n\nJag rullar bullarna.\n\n' +
    'De får jäsa en stund.\n\nSedan doftar hela huset gott.',
    [
      { type: 'literal', q: 'Vad bakar de?', options: ['Bröd', 'Bullar', 'Kakor', 'Tårta'], correct: 1 },
      { type: 'literal', q: 'Vem knådar degen?', options: ['Mamma gör det', 'Pappa gör det', 'Farmor gör det', 'Jag gör det'], correct: 1 },
      { type: 'ord', q: 'Vad betyder jäsa?', options: ['Bli kall', 'Bli hård', 'Växa sig större', 'Falla ihop'], correct: 2 },
      { type: 'literal', q: 'Vad gör jag med bullarna?', options: ['Rullar dem', 'Äter dem', 'Delar dem', 'Gömmer dem'], correct: 0 },
      { type: 'inferens', q: 'Varför doftar huset gott till slut?', options: ['För att fönstret är öppet', 'För att degen är kall', 'För att pappa lagar mat', 'För att bullarna är färdiga'], correct: 3 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['En dag i skolan', 'En bakdag hemma', 'En resa till affären', 'En fest i parken'], correct: 1 },
    ]),

  N('ak1-lattlast-05', 'Pölen på gården', 'photo-1477511350923-3986459bdee1',
    'Det regnar hela morgonen.\n\nNoel tar på sig stövlar.\n\nHan hoppar i en pöl.\n\n' +
    'Vattnet stänker högt.\n\nByxorna blir blöta.',
    [
      { type: 'literal', q: 'Hur är vädret?', options: ['Det snöar', 'Det blåser', 'Det regnar', 'Det är sol'], correct: 2 },
      { type: 'literal', q: 'Vad tar Noel på sig?', options: ['Stövlar', 'Vantar', 'En mössa', 'En jacka'], correct: 0 },
      { type: 'ord', q: 'Vad är en pöl?', options: ['En hög med snö', 'Ett hål i marken', 'En hink med sand', 'Lite vatten på marken'], correct: 3 },
      { type: 'literal', q: 'Vad händer med byxorna?', options: ['De går sönder', 'De blir blöta', 'De blir borta', 'De blir torra'], correct: 1 },
      { type: 'inferens', q: 'Varför blir byxorna blöta?', options: ['För att det snöar ute', 'För att Noel simmar', 'För att vattnet stänker', 'För att stövlarna läcker'], correct: 2 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['En pojke som hoppar i vatten', 'En pojke som tvättar kläder', 'En flicka som går vilse', 'En hund som blir blöt'], correct: 0 },
    ]),

  N('ak1-lattlast-06', 'Nya skor', 'photo-1700673698394-270378d1a70d',
    'Sara har nya skor.\n\nDe är vita och mjuka.\n\nHon vill visa dem i skolan.\n\n' +
    'Alla tittar när hon kommer.\n\nSara blir glad.',
    [
      { type: 'literal', q: 'Vad har Sara fått?', options: ['En ny väska', 'Nya skor', 'En ny mössa', 'En ny cykel'], correct: 1 },
      { type: 'literal', q: 'Hur är skorna?', options: ['Vita och mjuka', 'Svarta och hårda', 'Röda och blanka', 'Bruna och stora'], correct: 0 },
      { type: 'literal', q: 'Var vill Sara visa skorna?', options: ['Hemma hos mormor', 'På fotbollsplanen', 'I skolan', 'I affären'], correct: 2 },
      { type: 'ord', q: 'Vad betyder visa?', options: ['Gömma undan', 'Ge bort', 'Sätta på', 'Låta andra se'], correct: 3 },
      { type: 'inferens', q: 'Varför blir Sara glad?', options: ['För att andra ser skorna', 'För att skorna är billiga', 'För att skolan är slut', 'För att hon springer fort'], correct: 0 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['En flicka som tappar en sko', 'En flicka som är stolt', 'En pojke som är ledsen', 'En lärare som är arg'], correct: 1 },
    ]),

  N('ak1-lattlast-07', 'Hunden Bux', 'photo-1543466835-00a7907e9de1',
    'Vi har en hund.\n\nHan heter Bux.\n\nBux gömmer min strumpa.\n\n' +
    'Jag letar länge.\n\nStrumpan ligger under sängen.\n\nBux viftar på svansen.',
    [
      { type: 'literal', q: 'Vad heter hunden?', options: ['Tuss', 'Bux', 'Sigge', 'Mira'], correct: 1 },
      { type: 'literal', q: 'Vad gömmer Bux?', options: ['En strumpa', 'En boll', 'En sko', 'En vante'], correct: 0 },
      { type: 'literal', q: 'Var ligger strumpan?', options: ['Bakom dörren', 'I hallen', 'Under sängen', 'I korgen'], correct: 2 },
      { type: 'ord', q: 'Vad betyder gömmer?', options: ['Tvättar rent', 'River sönder', 'Lämnar kvar', 'Lägger undan'], correct: 3 },
      { type: 'inferens', q: 'Vad visar Bux när han viftar på svansen?', options: ['Att han är glad', 'Att han är trött', 'Att han är arg', 'Att han är rädd'], correct: 0 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['En katt som springer bort', 'En hund som gömmer saker', 'En pojke som städar rummet', 'En säng som går sönder'], correct: 1 },
    ]),

  N('ak1-lattlast-08', 'Snögubben', 'photo-1612504156915-d231324c3f22',
    'Det har snöat i natt.\n\nVi bygger en snögubbe.\n\nHan får en morot som näsa.\n\n' +
    'Två stenar blir ögon.\n\nSnögubben ler mot oss.',
    [
      { type: 'literal', q: 'Vad har hänt i natt?', options: ['Det har regnat', 'Det har blåst', 'Det har snöat', 'Det har frusit'], correct: 2 },
      { type: 'literal', q: 'Vad blir snögubbens näsa?', options: ['En morot', 'En sten', 'En pinne', 'En knapp'], correct: 0 },
      { type: 'literal', q: 'Vad blir ögonen?', options: ['Två knappar', 'Två stenar', 'Två pinnar', 'Två löv'], correct: 1 },
      { type: 'ord', q: 'Vad betyder ler?', options: ['Gråter mycket', 'Ropar högt', 'Ser glad ut', 'Sover gott'], correct: 2 },
      { type: 'inferens', q: 'Varför går det att bygga en snögubbe?', options: ['För att solen skiner', 'För att det är kväll', 'För att marken är torr', 'För att det finns snö ute'], correct: 3 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['En dag med snö och lek', 'En resa till fjällen', 'En morot i en trädgård', 'En sten på en väg'], correct: 0 },
    ]),

  N('ak1-lattlast-09', 'Äpplet', 'photo-1567974772901-1365e616baa9',
    'I trädgården står ett äppelträd.\n\nÄpplena är röda och mogna.\n\nFarfar lyfter upp mig.\n\n' +
    'Jag plockar ett äpple.\n\nDet smakar sött.',
    [
      { type: 'literal', q: 'Vad står i trädgården?', options: ['Ett äppelträd', 'En stor buske', 'En liten bänk', 'En gammal stege'], correct: 0 },
      { type: 'literal', q: 'Vilken färg har äpplena?', options: ['De är gula', 'De är röda', 'De är gröna', 'De är bruna'], correct: 1 },
      { type: 'literal', q: 'Vem lyfter upp mig?', options: ['Mamma gör det', 'Pappa gör det', 'Farfar gör det', 'Mormor gör det'], correct: 2 },
      { type: 'ord', q: 'Vad betyder mogna?', options: ['Nyss planterade', 'Alldeles för små', 'Fulla med maskar', 'Färdiga att äta'], correct: 3 },
      { type: 'inferens', q: 'Varför måste jag lyftas upp?', options: ['För att äpplena hänger högt', 'För att marken är blöt', 'För att jag är trött', 'För att trädet lutar'], correct: 0 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['En pojke som klättrar i ett träd', 'Ett äpple som plockas i trädgården', 'En farfar som planterar ett träd', 'En trädgård som växer igen'], correct: 1 },
    ]),

  N('ak1-lattlast-10', 'Bussen till mormor', 'photo-1779743541643-c90c5b595010',
    'Vi ska åka buss till mormor.\n\nBussen är gul.\n\nJag sitter vid fönstret.\n\n' +
    'Husen far förbi.\n\nSnart är vi framme.',
    [
      { type: 'literal', q: 'Vem ska de åka till?', options: ['Till farfar', 'Till en kompis', 'Till mormor', 'Till skolan'], correct: 2 },
      { type: 'literal', q: 'Vilken färg har bussen?', options: ['Den är gul', 'Den är blå', 'Den är röd', 'Den är vit'], correct: 0 },
      { type: 'literal', q: 'Var sitter jag?', options: ['Längst bak', 'Vid fönstret', 'Bredvid föraren', 'I mitten'], correct: 1 },
      { type: 'ord', q: 'Vad betyder framme?', options: ['Nästan hemma', 'På fel ställe', 'Vid rätt plats', 'Långt bort än'], correct: 2 },
      { type: 'inferens', q: 'Varför far husen förbi?', options: ['För att husen är små', 'För att jag springer', 'För att det blåser hårt', 'För att bussen kör fort'], correct: 3 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['En bussresa till mormor', 'En promenad i en stad', 'En dag hemma hos farfar', 'En bil som går sönder'], correct: 0 },
    ]),

  N('ak1-lattlast-11', 'Fågeln vid fönstret', 'photo-1721059166719-8b233059b2da',
    'En liten fågel sitter på grenen.\n\nDen tittar in genom fönstret.\n\nJag lägger ut frön.\n\n' +
    'Fågeln flyger ner och äter.\n\nSedan flyger den bort.',
    [
      { type: 'literal', q: 'Var sitter fågeln först?', options: ['På taket', 'På grenen', 'På marken', 'På staketet'], correct: 1 },
      { type: 'literal', q: 'Vad lägger jag ut?', options: ['Frön', 'Bröd', 'Vatten', 'Bär'], correct: 0 },
      { type: 'ord', q: 'Vad är frön?', options: ['Små stenar', 'Torra löv', 'Små korn att äta', 'Bitar av bröd'], correct: 2 },
      { type: 'literal', q: 'Vad gör fågeln sist?', options: ['Den sjunger', 'Den sover', 'Den dricker', 'Den flyger bort'], correct: 3 },
      { type: 'inferens', q: 'Varför flyger fågeln ner?', options: ['För att den vill äta', 'För att den är trött', 'För att det regnar', 'För att grenen knäcks'], correct: 0 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['Ett träd som blommar', 'En fågel som får mat', 'Ett fönster som går sönder', 'En katt som jagar'], correct: 1 },
    ]),

  N('ak1-lattlast-12', 'Elias cyklar', 'photo-1595663823619-c46779b2d840',
    'Elias lär sig cykla.\n\nPappa håller i sadeln.\n\nSedan släpper han taget.\n\n' +
    'Elias trampar helt själv.\n\nHan ropar: "Jag kan!"',
    [
      { type: 'literal', q: 'Vad lär sig Elias?', options: ['Att simma', 'Att åka skridskor', 'Att cykla', 'Att springa fort'], correct: 2 },
      { type: 'literal', q: 'Vad håller pappa i?', options: ['Sadeln', 'Styret', 'Hjulet', 'Jackan'], correct: 0 },
      { type: 'ord', q: 'Vad betyder släpper taget?', options: ['Håller hårdare', 'Slutar hålla i', 'Ropar till', 'Springer bort'], correct: 1 },
      { type: 'literal', q: 'Vad ropar Elias?', options: ['Kom hit!', 'Vänta lite!', 'Jag kan!', 'Det gick fel!'], correct: 2 },
      { type: 'inferens', q: 'Hur känner sig Elias på slutet?', options: ['Han är rädd', 'Han är ledsen', 'Han är arg', 'Han är stolt'], correct: 3 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['En pojke som lär sig cykla', 'En pappa som köper en cykel', 'En cykel som går sönder', 'En pojke som ramlar av'], correct: 0 },
    ]),

  N('ak1-lattlast-13', 'I sandlådan', 'photo-1700514854744-e43853301dd9',
    'Vi leker i sandlådan.\n\nAlva gräver ett djupt hål.\n\nJag bygger ett torn.\n\n' +
    'En lastbil kör sand.\n\nSedan rasar tornet.',
    [
      { type: 'literal', q: 'Var leker de?', options: ['I skogen', 'I sandlådan', 'I vattnet', 'I skolan'], correct: 1 },
      { type: 'literal', q: 'Vad gör Alva?', options: ['Gräver ett hål', 'Bygger ett torn', 'Kör en lastbil', 'Sitter och tittar'], correct: 0 },
      { type: 'ord', q: 'Vad betyder djupt?', options: ['Går långt ner', 'Går långt bort', 'Är mycket smalt', 'Är alldeles nytt'], correct: 0 },
      { type: 'literal', q: 'Vad händer med tornet?', options: ['Det blir högre', 'Det blir blött', 'Det rasar', 'Det försvinner'], correct: 2 },
      { type: 'ord', q: 'Vad betyder rasar?', options: ['Byggs upp', 'Blir hårt', 'Står kvar', 'Faller ihop'], correct: 3 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['En lastbil på en gata', 'Två barn som leker i sand', 'Ett hål i en skog', 'Ett torn av klossar'], correct: 1 },
    ]),

  N('ak1-lattlast-14', 'Godnattsagan', 'photo-1577835724923-f591f5f98c89',
    'Det är dags att sova.\n\nMamma läser en saga.\n\nSagan handlar om en drake.\n\n' +
    'Draken är snäll.\n\nJag somnar innan slutet.',
    [
      { type: 'literal', q: 'Vem läser sagan?', options: ['Mamma', 'Pappa', 'Farmor', 'Läraren'], correct: 0 },
      { type: 'literal', q: 'Vad handlar sagan om?', options: ['En häst', 'En drake', 'En båt', 'En prins'], correct: 1 },
      { type: 'literal', q: 'Hur är draken?', options: ['Han är arg', 'Han är stor', 'Han är snäll', 'Han är rädd'], correct: 2 },
      { type: 'ord', q: 'Vad betyder somnar?', options: ['Vaknar upp', 'Reser sig', 'Ropar högt', 'Börjar sova'], correct: 3 },
      { type: 'inferens', q: 'Varför hör jag inte slutet?', options: ['För att jag har somnat', 'För att mamma slutar läsa', 'För att boken tar slut', 'För att lampan släcks'], correct: 0 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['En drake som flyger', 'En kväll med en saga', 'En mamma som sjunger', 'En bok som tappas bort'], correct: 1 },
    ]),

  N('ak1-lattlast-15', 'I simhallen', 'photo-1497638538792-bc3c26959486',
    'Vi badar i simhallen.\n\nVattnet är varmt.\n\nLiam vågar inte doppa huvudet.\n\n' +
    'Läraren håller hans hand.\n\nTill slut vågar Liam också.',
    [
      { type: 'literal', q: 'Var badar de?', options: ['I en sjö', 'I havet', 'I simhallen', 'I en bäck'], correct: 2 },
      { type: 'literal', q: 'Hur är vattnet?', options: ['Det är varmt', 'Det är kallt', 'Det är grumligt', 'Det är djupt'], correct: 0 },
      { type: 'literal', q: 'Vad vågar Liam inte göra?', options: ['Gå ner i vattnet', 'Doppa huvudet', 'Simma en längd', 'Hoppa från kanten'], correct: 1 },
      { type: 'ord', q: 'Vad betyder vågar?', options: ['Blir väldigt rädd', 'Går sin egen väg', 'Törs göra något', 'Vill helst vänta'], correct: 2 },
      { type: 'inferens', q: 'Varför vågar Liam till slut?', options: ['För att vattnet är grunt', 'För att alla andra tittar', 'För att badet snart stänger', 'För att läraren håller handen'], correct: 3 },
      { type: 'sammanfatta', q: 'Vad handlar texten om?', options: ['En pojke som vågar till slut', 'En lärare som simmar snabbt', 'En simhall som stängs', 'En flicka som lär sig dyka'], correct: 0 },
    ]),
];

// Rätt svars plats i varje text.
//
// Utan styrning hamnade flera texter på samma mönster – 0,1,2,3,0,1 återkom i
// tre av dem. En elev som läser femton korta texter i rad hinner lägga märke
// till en sådan trappa och kan då gissa sig fram utan att läsa. Alternativen
// roteras därför till lägena nedan. Rotation flyttar bara platserna och rör
// varken formuleringar eller vilket alternativ som är rätt.
const PLATSER = {
  'ak1-lattlast-01': [0, 1, 3, 2, 1, 3],
  'ak1-lattlast-02': [0, 3, 1, 2, 0, 2],
  'ak1-lattlast-03': [2, 0, 1, 3, 2, 0],
  'ak1-lattlast-04': [1, 1, 2, 0, 3, 1],
  'ak1-lattlast-05': [2, 0, 3, 1, 2, 0],
  'ak1-lattlast-06': [1, 3, 2, 0, 1, 3],
  'ak1-lattlast-07': [1, 0, 2, 3, 0, 1],
  'ak1-lattlast-08': [2, 3, 1, 0, 3, 1],
  'ak1-lattlast-09': [0, 1, 2, 3, 2, 0],
  'ak1-lattlast-10': [3, 0, 2, 1, 3, 0],
  'ak1-lattlast-11': [1, 0, 2, 3, 3, 2],
  'ak1-lattlast-12': [2, 1, 0, 2, 3, 0],
  'ak1-lattlast-13': [1, 0, 0, 2, 3, 1],
  'ak1-lattlast-14': [3, 0, 2, 3, 0, 1],
  'ak1-lattlast-15': [0, 2, 1, 0, 3, 3],
};

TEXTER.forEach((t) => {
  const mal = PLATSER[t.id];
  t.questions.forEach((q, i) => {
    const steg = (mal[i] - q.correct + 4) % 4;
    if (steg === 0) return;
    q.options = q.options.slice(4 - steg).concat(q.options.slice(0, 4 - steg));
    q.correct = mal[i];
  });
});

// ── Kontroll och skrivning ──────────────────────────────────────────────────
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));
const dry = process.argv.includes('--dry');

const BAND = [20, 35];
const MENINGSTAK = 8;

const befintliga = new Set(lib.map((t) => t.id));
const titlar = new Set(lib.map((t) => `${(t.title || '').trim().toLowerCase()}|${t.grade}`));
let avbryt = false;

TEXTER.forEach((t) => {
  if (befintliga.has(t.id)) {
    console.error(`ID finns redan: ${t.id}`);
    avbryt = true;
  }
  if (titlar.has(`${t.title.trim().toLowerCase()}|1`)) {
    console.error(`${t.id}: titeln finns redan på nivå 1`);
    avbryt = true;
  }
  if (t.questions.length !== 6) {
    console.error(`${t.id}: ${t.questions.length} frågor`);
    avbryt = true;
  }

  const ord = t.text.trim().split(/\s+/).length;
  if (ord < BAND[0] || ord > BAND[1]) {
    console.error(`${t.id}: ${ord} ord, utanför nivå 1-intervallet ${BAND[0]}–${BAND[1]}`);
    avbryt = true;
  }

  const meningar = t.text.split(/(?<=[.!?]["”]?)\s+/).filter(Boolean).length;
  const snitt = ord / meningar;
  if (snitt > MENINGSTAK) {
    console.error(`${t.id}: ${snitt.toFixed(1)} ord per mening, taket är ${MENINGSTAK}`);
    avbryt = true;
  }

  // Längsta enskilda mening. Snittet kan hålla sig under taket samtidigt som
  // en enda mening är dubbelt så lång, och det är just den meningen som
  // stoppar en nybörjarläsare.
  const langsta = Math.max(
    ...t.text.split(/(?<=[.!?]["”]?)\s+/).filter(Boolean).map((m) => m.trim().split(/\s+/).length)
  );
  if (langsta > 8) {
    console.error(`${t.id}: längsta meningen är ${langsta} ord`);
    avbryt = true;
  }

  console.log(
    `${t.id.padEnd(18)} ${String(ord).padStart(2)} ord  ${snitt.toFixed(1)} ord/mening  ` +
      `längsta ${langsta}  svar ${t.questions.map((q) => q.correct).join('')}`
  );
});

if (avbryt) process.exit(1);

if (dry) {
  console.log('\n--dry: inget skrivet.');
  process.exit(0);
}

TEXTER.forEach((t) => {
  lib.push({ ...t, meta: { wordCount: t.text.trim().split(/\s+/).length } });
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n');
console.log(`\n${TEXTER.length} texter tillagda. Biblioteket har nu ${lib.length} texter.`);
