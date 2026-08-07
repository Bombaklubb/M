// Tilldelar bilder till texterna i biblioteket utifrån vad bilderna
// föreställer (se bildkatalog.cjs).
//
// Bakgrund: en kontroll av samtliga bild-URL:er visade två problem.
//   1. Nio av 116 URL:er svarade 404 hos Unsplash. 42 texter visade alltså
//      en trasig bild.
//   2. Många bilder hade aldrig något med sin text att göra. Bilderna hade
//      tilldelats utan att någon sett dem, så biblioteket innehöll en elefant
//      på "Den hemliga hyllan på biblioteket", legofigurer på "Kaninen i
//      snön" och en sportklocka på Englands rugbylandslag.
//
// Skriptet byter bild i två fall:
//   a) den nuvarande bilden är död – då måste den bytas, och
//   b) en katalogbild matchar textens titel direkt medan den nuvarande
//      bilden matchar klart sämre.
// Texter där nuvarande bild redan är rimlig lämnas orörda.
//
// Kör med --dry för att bara se vad som skulle ändras.

const fs = require('fs');
const path = require('path');
const { KATALOG, KATALOG_MAP, RESERV, url } = require('./bildkatalog.cjs');

const LIB = path.join(__dirname, '..', 'public', 'data', 'library.json');
const DODA = path.join(__dirname, 'doda-bilder.json');

const dry = process.argv.includes('--dry');

// URL:er som Unsplash inte längre levererar. Listan kommer från en HTTP-
// kontroll av samtliga unika bild-URL:er i biblioteket.
const doda = new Set(JSON.parse(fs.readFileSync(DODA, 'utf8')));

// Texter där nyckelorden leder fel och valet därför är gjort för hand.
// "Arsenal-anfall som byggs upp" är inte en byggarbetsplats, och en stad
// under stormaktstiden är inte en modern skyline.
const HANDPLOCKAT = {
  'ak6-tema-015': 'photo-1522778119026-d647f0596c20', // fotbollsstadion
  'ak6-tema-003': 'photo-1580136579312-94651dfd596d', // historisk målning
  'ak7-tema-008': 'photo-1580136579312-94651dfd596d', // Visby och medeltiden
  'ak9-tema-003': 'photo-1541888946425-d81bb19240f5', // fabriken i staden
  'ak7-tema-006': 'photo-1558642452-9d2a7deb7f62', // pollinatörer
  'ak2-tema-007': 'photo-1532012197267-da84d127e765', // enhörning, sagolikt
  'ak2-tema-008': 'photo-1532012197267-da84d127e765',
  'ak2-tema-009': 'photo-1500673922987-e212871fec22',
  'ak10-rosa-001': 'photo-1541844053589-346841d0b34c', // bussbojkotten
  'ak10-rosa-003': 'photo-1517457373958-b7bdd4587205', // civilkurage, folkrörelse
  'ak10-rosa-005': 'photo-1541844053589-346841d0b34c',
  'ak10-obama-002': 'photo-1541872703-74c5e44368f9', // Obama i Vita huset
  'ak10-obama-003': 'photo-1541872703-74c5e44368f9',
};

const POANG = { titel: 10, tema: 6, genre: 2, text: 2 };
const TEXT_TAK = 4; // brödtexten får som mest bidra så här mycket
const HUVUDMOTIV = 4; // extra vikt när titeln träffar bildens huvudmotiv

// Svenska böjningsändelser. Nyckelorden matchas mot hela ordformer och inte
// som delsträngar – annars fastnar "ko" i "skolgården" och "ö" i
// "övergångsstället", vilket gav kalvar på skolgården och en klippkust på
// ett övergångsställe.
const ANDELSER = [
  '', 'n', 't', 's', 'en', 'et', 'er', 'ar', 'or', 'ns', 'ts', 'ens', 'ets',
  'na', 'ne', 'arna', 'orna', 'erna', 'ernas', 'arnas', 'ornas', 'ens', 'an',
];

const formCache = new Map();
function former(ord) {
  let f = formCache.get(ord);
  if (!f) {
    f = new Set(ANDELSER.map((a) => ord + a));
    // Ord på -a tappar sin vokal i plural och bestämd form: karta -> kartor,
    // kartan, kartorna. Utan det här missar "Flickan som ritade kartor" sin
    // kartbild.
    if (ord.endsWith('a')) {
      const stam = ord.slice(0, -1);
      ['n', 'or', 'ors', 'orna', 'ornas', 'ns'].forEach((a) => f.add(stam + a));
    }
    formCache.set(ord, f);
  }
  return f;
}

const ordCache = new WeakMap();
function ordIn(str) {
  return (str || '')
    .toLowerCase()
    .split(/[^a-zà-öø-ÿ0-9]+/i)
    .filter(Boolean);
}

function traffar(ord, ordlista) {
  const f = former(ord);
  // Flerordsnyckelord ("vita huset") matchas som fras.
  if (ord.includes(' ')) return ordlista.join(' ').includes(ord);
  return ordlista.some((o) => f.has(o));
}

// Poängsätter hur väl en katalogbild passar en text. Bildens första nyckelord
// är dess huvudmotiv och väger tyngre – det är skillnaden mellan att en text
// om en fågel i ett träd får fågelbilden i stället för skogsbilden.
function poang(bild, text) {
  let cache = ordCache.get(text);
  if (!cache) {
    cache = {
      titel: ordIn(text.title),
      tema: ordIn(text.theme),
      genre: ordIn(text.genre),
      brod: ordIn((text.text || '').slice(0, 800)),
    };
    ordCache.set(text, cache);
  }

  let p = 0;
  let franText = 0;
  bild.kw.forEach((ord, i) => {
    if (traffar(ord, cache.titel)) p += POANG.titel + (i === 0 ? HUVUDMOTIV : 0);
    if (traffar(ord, cache.tema)) p += POANG.tema;
    if (traffar(ord, cache.genre)) p += POANG.genre;
    if (traffar(ord, cache.brod)) franText += POANG.text;
  });
  return p + Math.min(franText, TEXT_TAK);
}

// Bästa katalogbild för en text. Vid lika poäng vinner den bild som hittills
// använts minst, så att biblioteket inte samlar alla texter på en handfull
// motiv.
function bastaBild(text, anvandning) {
  let basta = null;
  let bastPoang = 0;
  for (const bild of KATALOG) {
    const p = poang(bild, text);
    if (p === 0) continue;
    if (
      p > bastPoang ||
      (p === bastPoang && basta && (anvandning.get(bild.id) || 0) < (anvandning.get(basta.id) || 0))
    ) {
      basta = bild;
      bastPoang = p;
    }
  }
  return { bild: basta, poang: bastPoang };
}

function main() {
  const lib = JSON.parse(fs.readFileSync(LIB, 'utf8'));

  const anvandning = new Map();
  for (const t of lib) {
    const id = (t.imageUrl || '').match(/photo-[^?]+/)?.[0];
    if (id) anvandning.set(id, (anvandning.get(id) || 0) + 1);
  }

  const andrade = [];
  let dodaFixade = 0;

  for (const text of lib) {
    const nuId = (text.imageUrl || '').match(/photo-[^?]+/)?.[0];
    const arDod = !nuId || doda.has(nuId);
    const nuvarande = nuId ? KATALOG_MAP.get(nuId) : null;
    const nuPoang = arDod || !nuvarande ? 0 : poang(nuvarande, text);

    let { bild, poang: nyPoang } = bastaBild(text, anvandning);

    const handplockad = HANDPLOCKAT[text.id] && KATALOG_MAP.get(HANDPLOCKAT[text.id]);
    if (handplockad) {
      bild = handplockad;
      nyPoang = Math.max(poang(handplockad, text), POANG.titel + HUVUDMOTIV);
    }

    // En trasig bild måste bytas även när ingen katalogbild passar innehållet.
    // Då väljs temats reservbild i stället för ett motiv som råkar dela ett
    // enstaka ord med texten.
    const SVAG = POANG.tema;
    let arReserv = false;
    if (arDod && (!bild || nyPoang < SVAG)) {
      const reservId = RESERV[(text.theme || '').toLowerCase()] || RESERV.standard;
      const reserv = KATALOG_MAP.get(reservId);
      if (reserv) {
        bild = reserv;
        nyPoang = poang(reserv, text);
        arReserv = true;
      }
    }

    if (!bild || bild.id === nuId) continue;

    // Byt om bilden är trasig, eller om den nya bilden träffar titelns
    // huvudmotiv och är klart bättre än den som sitter där nu. Marginalen
    // gör att en text vars bild redan fungerar lämnas i fred.
    const byt = arDod
      ? arReserv || nyPoang > 0
      : nyPoang >= POANG.titel + HUVUDMOTIV && nyPoang - nuPoang >= 8;
    if (!byt) continue;

    anvandning.set(nuId, Math.max(0, (anvandning.get(nuId) || 1) - 1));
    anvandning.set(bild.id, (anvandning.get(bild.id) || 0) + 1);

    andrade.push({
      id: text.id,
      titel: text.title,
      dod: arDod,
      fran: nuvarande ? nuvarande.desc : nuId,
      till: bild.desc,
      poang: `${nuPoang} -> ${nyPoang}`,
    });
    if (arDod) dodaFixade++;

    text.imageUrl = url(bild.id);
  }

  // Texter som fortfarande sitter på en död bild måste fångas upp – hellre en
  // bild med svag koppling än en bild som inte laddar alls.
  const kvarDoda = lib.filter((t) => doda.has((t.imageUrl || '').match(/photo-[^?]+/)?.[0]));

  console.log(`Texter totalt:        ${lib.length}`);
  console.log(`Bilder som byts:      ${andrade.length}`);
  console.log(`  varav döda bilder:  ${dodaFixade}`);
  console.log(`Kvar med död bild:    ${kvarDoda.length}`);
  if (kvarDoda.length) {
    kvarDoda.forEach((t) => console.log(`  ! ${t.id} ${t.title}`));
  }

  const unika = new Set(lib.map((t) => t.imageUrl)).size;
  console.log(`Unika bilder efter:   ${unika}`);

  if (process.argv.includes('--lista')) {
    andrade.forEach((a) =>
      console.log(`${a.dod ? '[död] ' : '      '}${a.id} ${a.titel}\n        ${a.fran}\n     -> ${a.till}  (${a.poang})`)
    );
  }

  if (dry) {
    console.log('\n--dry: inget skrevs till library.json');
    return;
  }

  if (kvarDoda.length) {
    throw new Error('Avbryter: texter kvar med död bild-URL.');
  }

  fs.writeFileSync(LIB, JSON.stringify(lib, null, 2) + '\n');
  console.log('\nlibrary.json uppdaterad.');
}

main();
