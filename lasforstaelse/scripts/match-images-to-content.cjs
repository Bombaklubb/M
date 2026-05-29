// Matchar varje text i biblioteket med en bild som passar rubriken/innehållet.
// Vi återanvänder ENDAST foto-ID:n som redan finns i biblioteket (de fungerar
// och har redan valts ut), men dirigerar om dem till texter där de passar bäst.
//
// Strategi:
//   1. Bygg ämnespooler av foto-ID:n vars motiv vi är säkra på.
//   2. För varje text: matcha nyckelord i (titel + tema) mot reglerna nedan,
//      från mest specifik till mest generell.
//   3. Rotera inom poolen så att texter med samma ämne får olika bilder.

const fs = require('fs');
const path = require('path');

const U = (id) => `https://images.unsplash.com/photo-${id}?w=600&h=400&fit=crop`;

// --- Ämnespooler (foto-ID:n som redan finns i biblioteket) ---
const P = {
  cat: ['1514888286974-6c03e2ca1dba', '1574158622682-e40e69881006', '1533738363-b7f9aef128ce', '1495360010541-f48722b34f7d'],
  dog: ['1587300003388-59208cc962cb'],
  bird: ['1444464666168-49d633b86797', '1522926193341-e9ffd686c60f', '1474511320723-9a56873571b7'],
  horse: ['1553284965-83fd3e82fa5a', '1534773728080-33d31da27ae5', '1598974357801-cbca100e65d3'],
  insect: ['1520038410233-7141be7e6f97', '1518152006812-edab29b069ac', '1558642452-9d2a7deb7f62'],

  forest: ['1448375240586-882707db888b', '1476231682828-37e571bc172f', '1592841200221-a6898f307baa'],
  plant: ['1490750967868-88aa4486c946', '1416879595882-3373a0480b5b'],
  autumn: ['1507003211169-0a1dd7228f2d'],
  squirrel: ['1507666405895-422f800f6c59'],
  foglake: ['1544767247-d1f0a0cbf8a7'],

  rain: ['1515694346937-94d85e41e6f0', '1428592953211-077101b2021b'],
  snow: ['1491002052546-bf38f186af56', '1611604548018-d56bbd85d681', '1516466723877-e4ec1d736c8a'],
  water: ['1548839140-29a749e1cf4d', '1470071459604-3b5ec3a7fe05'],

  space: ['1462332420958-a05d1e002413', '1499678329028-101435549a4e', '1559599076-9c61d8e1b77c'],
  mars: ['1559027615-cd4628902d4a'],
  experiment: ['1532094349884-543bc11b234d'],
  body: ['1559757175-5700dde675bc', '1606787366850-de6330128bfc'],
  vaccine: ['1584118624012-df056829fbd0'],

  music: ['1511379938547-c1f69419868d', '1519892300165-cb5542fb47c7', '1507838153414-b4b713384a76'],
  rock: ['1493225457124-a3eb161ffa5f'],
  abba: ['1470225620780-dba8ba36b745'],

  ball: ['1574629810360-7efbbe195018', '1551958219-acbc608c6377', '1560272564-c83b66b1ad12', '1551698618-1dfe5d97d256'],
  arsenal: ['1522778119026-d647f0596c20'],
  rugby: ['1544117519-31a4b719223d'],
  tennis: ['1558171813-4c088753af8f'],

  classroom: ['1580582932707-520aed937b7b', '1503676260728-1c00da094a0b', '1434030216411-0b793f4b4173', '1518998053901-5348d3961a04'],
  classmates: ['1517048676732-d65bc937f952'],

  library: ['1481627834876-b7833e8f5570', '1521587760476-6c12a4b040da', '1557050543-4d5f4e07ef46'],
  book: ['1512820790803-83ca734da794', '1456513080510-7bf3a84b82f8'],

  friendship: ['1529156069898-49953e39b3ac', '1516912481808-3406841bd33c', '1472745942893-4b9f730c7668', '1566464882255-9085f248c7de'],
  ethics: ['1454165804606-c3d57bc86b40', '1513542789411-b6a5d4f31634'],

  democracy: ['1541872703-74c5e44368f9', '1497034825429-c343d7c6a68f', '1501443762994-82bd5dace89a'],
  rights: ['1591189863430-ab87e120f312', '1593113598332-cd288d649433', '1521737711867-e3b97375f902'],

  ai: ['1677442136019-21780ecad995', '1524178232363-1fb2b075b655'],
  robot: ['1561557944-6e7860d1a7eb'],
  internet: ['1451187580459-43490279c0fa', '1518770660439-4636190af475'],
  code: ['1504639725590-34d0984388bd'],
  games: ['1538481199705-c710c4e965fc', '1566438480900-0609be27a4be'],
  digital: ['1507473885765-e6ed057f782c', '1544620347-c4fd4a3d5957', '1563986768609-322da13575f3'],
  bridge: ['1477959858617-67f85cf4f1df'],

  recycle: ['1532996122724-e3c354a0b15b'],
  ocean: ['1544551763-46a013bb70d5'],

  maps: ['1476973422084-e0fa66ff9456', '1544716278-ca5e3f4abd8c'],
  city: ['1449824913935-59a10b8d2000'],
  train: ['1474487548417-781cb71495f3'],
  italy: ['1523906834658-6e24ef2386f9'],
  greece: ['1533105079780-92b9be482077'],
  sushi: ['1579584425555-c3ce17fd4351'],

  food: ['1544025162-d76694265947', '1571019614242-c5c5dee9f50b', '1606787366850-de6330128bfc'],
  chocolate: ['1549007994-cb92caebd54b'],
  apple: ['1568571780765-9276ac8b75a2'],
  bike: ['1505705694340-019e5d6e2eb2', '1479936343636-73cdc5aae0c3', '1571019614242-c5c5dee9f50b'],
  sleep: ['1541781774459-bb2af2f05b55'],
  mind: ['1474418397713-7ede21d49118'],

  film: ['1489599849927-2ee91cede3ba'],
  fashion: ['1445205170230-053b83016050', '1484981138541-3d074aa97716'],
  dance: ['1503454537195-1dcabb73ffb9'],
  melodifestival: ['1470229722913-7c0e2dbbafd3'],

  economy: ['1554224155-6726b3ff858f'],
  philosophy: ['1456324504439-367cee3b3c32'],

  letters: ['1461360228754-6e81c478b882'],
  history: ['1460661419201-fd4cecdf9a8b', '1581579438747-104c53d7c498', '1450052590821-8bf91254a353'],

  family: ['1476234251651-f353703a034d'],
  swimming: ['1530549387789-4c1017266635'],

  bus: ['1570125909232-eb263c188f7e'],
  crosswalk: ['1517732306149-e8f829eb588a'],
  wheel: ['1558618666-fcd25c85cd64'],
  tooth: ['1588776814546-1ffcf47267a5'],
  unicorn: ['1534447677941-ce074f5b6617'],
  news: ['1504711434969-e33886168f5c'],
  work: ['1497032628192-86f99bcd76bc'],
  sun: ['1499678329028-101435549a4e'],
};

// --- Regler: [matchningsfunktion, poolnamn] i prioritetsordning (specifik först) ---
const has = (s, ...words) => words.some((w) => s.includes(w));

const rules = [
  // Specifika personer/varumärken
  [(s) => has(s, 'abba'), 'abba'],
  [(s) => has(s, 'elvis'), 'rock'],
  [(s) => has(s, 'zara larsson', 'artist'), 'music'],
  [(s) => has(s, 'michael jackson', 'björn borg', 'borg'), s => has(s,'borg') ? 'tennis' : 'music'],
  [(s) => has(s, 'rosa parks', 'medborgarrätt', 'segregation', 'obama', 'presidentskap', 'president'), 'history'],
  [(s) => has(s, 'arsenal', 'emirates'), 'arsenal'],
  [(s) => has(s, 'rugby'), 'rugby'],
  [(s) => has(s, 'tennis'), 'tennis'],
  [(s) => has(s, 'fortnite', 'ps5', 'tv-spel', 'tv spel', 'spelet', 'spela tillsammans', 'spelkväll', 'ett spel till', 'gaming'), 'games'],
  [(s) => has(s, 'marabou', 'choklad'), 'chocolate'],
  [(s) => has(s, 'sushi'), 'sushi'],
  [(s) => has(s, 'pizza', 'italien'), 'italy'],
  [(s) => has(s, 'grekland'), 'greece'],
  [(s) => has(s, 'melodifestival', 'deltävling', 'final'), 'melodifestival'],
  [(s) => has(s, 'fans', 'gemenskap', 'supporter'), 'ball'],
  [(s) => has(s, 'armani', 'garderob', 'kostym', 'mode', 'smink', 'skönhet', 'tyst elegans', 'lyx'), 'fashion'],
  [(s) => has(s, 'enhörning'), 'unicorn'],
  [(s) => has(s, 'harry potter', 'hogwarts', 'fandom', 'besvärjelse', 'magi', 'trilogi', 'sagostund', 'saga', 'symbolik', 'världsbygge', 'karaktär'), 'book'],
  [(s) => has(s, 'tema'), 'book'],

  // Djur
  [(s) => has(s, 'häst', 'rida', 'stall'), 'horse'],
  [(s) => has(s, 'katt', 'maja', 'max'), 'cat'],
  [(s) => has(s, 'hund', 'valp', 'bella'), 'dog'],
  [(s) => has(s, 'fågel', 'fåglar', 'flyttar fåglarna'), 'bird'],
  [(s) => has(s, 'myra', 'myror', 'biet', 'bina', 'biodling', 'humla', 'pollin', 'snigel', 'masken', 'daggmask', 'insekt'), 'insect'],
  [(s) => has(s, 'varg', 'ekorre'), 'squirrel'],

  // Musik
  [(s) => has(s, 'musik', 'sång', 'sjung', 'låt', 'rytm', 'trumm', 'melodi', 'beat', 'sampling', 'remix', 'refräng', 'poptext', 'ljud blir', 'spellista', 'rock'), 'music'],
  [(s) => has(s, 'dans', 'show', 'scen'), 'dance'],

  // Sport
  [(s) => has(s, 'boll', 'fotboll', 'match', 'landslag', 'mål', 'passning', 'laget', 'lagets', 'idrott', 'sport', 'hopp', 'varv', 'uppvärmning', 'puls'), 'ball'],
  [(s) => has(s, 'simhall', 'simma', 'badhus'), 'swimming'],

  // Rymd/vetenskap
  [(s) => has(s, 'rymd', 'planet', 'mars', 'solsystem', 'stjärn', 'universum', 'galax'), s => has(s,'mars') ? 'mars' : 'space'],
  [(s) => has(s, 'vulkan', 'lava'), 'space'],
  [(s) => has(s, 'experiment', 'flyter', 'sjunker', 'magnet', 'raket'), 'experiment'],
  [(s) => has(s, 'vaccin', 'immunförsvar', 'antibiotika', 'bakterier', 'arvsmassa', 'genteknik', 'crispr'), 'vaccine'],
  [(s) => has(s, 'kropp', 'hjärta', 'hjärna', 'sår', 'energi', 'puls', 'lär sig'), 'body'],
  [(s) => has(s, 'fotosyntes', 'växt', 'frö', 'blomma'), 'plant'],

  // Natur & väder
  [(s) => has(s, 'skog', 'träd', 'löv', 'äppelträd', 'äppelodling', 'ekosystem', 'stubbe'), s => has(s,'löv') ? 'autumn' : 'forest'],
  [(s) => has(s, 'snö', 'snögubbe', 'vinter', 'pulka', 'kaninen i snön'), 'snow'],
  [(s) => has(s, 'regn', 'pöl', 'storm'), 'rain'],
  [(s) => has(s, 'dimma', 'sjö', 'myr', 'våtmark'), 'foglake'],
  [(s) => has(s, 'vatten', 'kretslopp', 'moln', 'hav'), s => has(s,'hav','skräp') ? 'ocean' : 'water'],
  [(s) => has(s, 'sol', 'skugga', 'väder'), 'sun'],

  // Miljö/klimat
  [(s) => has(s, 'återvinn', 'sorter', 'sopor', 'avfall', 'kompost', 'matsvinn'), 'recycle'],
  [(s) => has(s, 'plast', 'skräp', 'koldioxid', 'utsläpp', 'klimat', 'hållbar', 'miljö'), 'ocean'],

  // Teknik & digitalt
  [(s) => has(s, 'artificiell intelligens', 'ai ', 'ai:', 'ai-', 'ai i', 'maskin', 'algoritm'), s => has(s,'algoritm','kod') ? 'code' : 'ai'],
  [(s) => has(s, 'robot'), 'robot'],
  [(s) => has(s, 'internet', 'flöde', 'nätverk', 'online', 'digital', 'skärm', 'sociala medier', 'data', 'spår'), 'internet'],
  [(s) => has(s, 'kod', 'programmer'), 'code'],
  [(s) => has(s, 'bro', 'båt'), 'bridge'],
  [(s) => has(s, 'hjul', 'cykel'), s => has(s,'cykel') ? 'bike' : 'wheel'],
  [(s) => has(s, 'lampa', 'batteri', 'teknik', 'uppfinning'), 'wheel'],

  // Källkritik / nyheter / media
  [(s) => has(s, 'källkritik', 'nyhet', 'tidning', 'reklam', 'information', 'bild', 'klipp', 'fejk', 'bevis', 'statistik', 'korrelation', 'modell', 'videoklipp', 'ett klipp', 'klippet', 'kontrovers', 'offentlig', 'debatt', 'engagemang', 'samhällspåverkan', 'påstående', 'prövning', 'värdighet'), 'news'],

  // Samhälle / demokrati / rättigheter
  [(s) => has(s, 'mänskliga rättigheter', 'rättighet', 'yttrandefrihet', 'diskriminering', 'lika värde', 'barns rätt'), 'rights'],
  [(s) => has(s, 'demokrati', 'omröstning', 'röst', 'valet', 'val och', 'val ', 'väljare', 'kommun', 'lagar', 'politik', 'elevråd', 'beslut', 'samhälle', 'medborgare'), 'democracy'],
  [(s) => has(s, 'civilkurage', 'motstånd'), 'history'],

  // Historia
  [(s) => has(s, 'brev', 'skriva med', 'förr'), 'letters'],
  [(s) => has(s, 'historia', 'historisk', 'medeltid', 'viking', 'stormakt', 'industrialisering', 'fabrik', 'tryckpress', 'handel förr', 'barnarbete', 'gamla', 'arkiv', 'farmor', 'farfar'), 'history'],

  // Ekonomi & filosofi
  [(s) => has(s, 'pengar', 'ekonomi', 'budget', 'konsumtion', 'plattformsekonomi'), 'economy'],
  [(s) => has(s, 'arbete', 'jobb', 'plattform', 'organisation', 'förändringsarbete', 'lokala och det globala'), 'work'],
  [(s) => has(s, 'filosofi', 'rättvisa', 'tankeexperiment', 'existens', 'vad är mod', 'modig', 'tystnad'), 'philosophy'],

  // Geografi / karta / stad
  [(s) => has(s, 'karta', 'kompass'), 'maps'],
  [(s) => has(s, 'stad', 'transport', 'förtätning', 'kontor', 'arbetsmiljö'), 'city'],
  [(s) => has(s, 'tåg'), 'train'],
  [(s) => has(s, 'åland', 'öar', 'skärgård', 'klippor', 'geografi', 'finland', 'självstyre', 'kompromiss', 'två hem', 'löften och gränser', 'demilitariser'), 'foglake'],

  // Hälsa / mat / sömn / psykisk hälsa
  [(s) => has(s, 'sömn', 'dröm', 'mardröm', 'lucid'), 'sleep'],
  [(s) => has(s, 'stress', 'psykisk', 'tankar', 'identitet', 'spegel', 'tillit'), 'mind'],
  [(s) => has(s, 'mat', 'lunch', 'smak', 'pannkak', 'kalas', 'bakning', 'äppelpaj', 'café', 'glass', 'honung', 'sushi'), s => has(s,'glass') ? 'food' : (has(s,'äpple','paj','café','choklad') ? 'apple' : 'food')],
  [(s) => has(s, 'äpple'), 'apple'],
  [(s) => has(s, 'hälsa', 'må bra', 'tanden', 'tand ', 'mjölktand'), s => has(s, 'tanden', 'tand ', 'mjölktand') ? 'tooth' : 'food'],

  // Film/kultur
  [(s) => has(s, 'film', 'kändis', 'varumärke'), 'film'],
  [(s) => has(s, 'språk', 'översättning', 'kommunikation'), 'book'],

  // Skola / vänskap / etik / böcker
  [(s) => has(s, 'bibliotek', 'hylla'), 'library'],
  [(s) => has(s, 'bok', 'böck', 'läs', 'högläsning', 'affisch', 'rita'), s => has(s,'rita') ? 'classroom' : 'book'],
  [(s) => has(s, 'vänskap', 'kompis', 'vän', 'vante', 'mössa', 'bänk', 'gunga', 'rast', 'plats', 'kö', 'inklud'), 'friendship'],
  [(s) => has(s, 'etik', 'förlåt', 'rättvist', 'ärlig', 'plånbok', 'hittad', 'lånad', 'penna', 'sudd', 'säga ifrån', 'ansvar', 'värdegrund', 'mobb', 'chatt', 'skärmdump'), 'ethics'],
  [(s) => has(s, 'familj', 'syster', 'storasyster'), 'family'],
  [(s) => has(s, 'buss'), 'bus'],
  [(s) => has(s, 'övergångsställe', 'trafik'), 'crosswalk'],
  [(s) => has(s, 'skola', 'klass', 'läxa', 'fritids', 'temadag'), 'classroom'],

  // Sena fallbacks för breda teman
  [(s) => has(s, 'natur'), 'forest'],
  [(s) => has(s, 'film', 'mening'), 'film'],
];

const counters = {};
function pick(pool) {
  const arr = P[pool];
  const i = (counters[pool] || 0) % arr.length;
  counters[pool] = (counters[pool] || 0) + 1;
  return U(arr[i]);
}

function imageFor(text) {
  const s = `${text.title} ${text.theme || ''}`.toLowerCase();
  for (const [match, poolOrFn] of rules) {
    if (match(s)) {
      const pool = typeof poolOrFn === 'function' ? poolOrFn(s) : poolOrFn;
      if (P[pool]) return pick(pool);
    }
  }
  return null; // ingen säker matchning – behåll befintlig bild
}

function main() {
  const libraryPath = path.join(__dirname, '../public/data/library.json');
  const library = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

  let changed = 0;
  let unmatched = 0;
  const unmatchedList = [];

  library.forEach((text) => {
    const url = imageFor(text);
    if (!url) {
      unmatched++;
      unmatchedList.push(`${text.grade} [${text.theme || '-'}] ${text.title}`);
      return;
    }
    if (text.imageUrl !== url) changed++;
    text.imageUrl = url;
  });

  fs.writeFileSync(libraryPath, JSON.stringify(library, null, 2), 'utf8');
  console.log(`Uppdaterade bilder: ${changed} ändrade, ${unmatched} utan säker matchning (behöll befintlig).`);
  if (unmatchedList.length) {
    console.log('\nUtan säker matchning:');
    unmatchedList.forEach((t) => console.log('  ' + t));
  }
}

main();
