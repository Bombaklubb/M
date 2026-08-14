#!/usr/bin/env node
//
// Byter ut bilder som inte hör ihop med sin text.
//
// Bakgrund: samtliga 164 unika bilder i biblioteket hämtades ner och granskades
// mot de texter som använder dem. Ungefär en tredjedel var fel, och felen hade
// ett tydligt mönster – de kom från automatisk matchning på nyckelord utan att
// någon sett bilden. Tydligast: en brun björn illustrerade texterna om Björn
// Borg, och en trave böcker om entreprenörskap låg på tio Harry Potter-texter.
//
// Varje ersättare nedan är utvald genom att kandidaterna hämtats ner och
// granskats i kontaktkartor först. Ingen bild är tilldelad på nyckelord.
//
// Kör med --dry för att se ändringarna utan att skriva.

const fs = require('fs');
const path = require('path');

const B = (slug) => `https://images.unsplash.com/${slug}?w=600&h=400&fit=crop`;

// De nya motiven, med vad bilden faktiskt visar.
const MOTIV = {
  tennis:        { slug: 'photo-1779380642686-fb7252f4800a', visar: 'tennisspelare i slag på grusbana' },
  harrypotter:   { slug: 'photo-1728506972831-193841eb2961', visar: 'gammalt mörkt bibliotek i varmt ljus' },
  rugby:         { slug: 'photo-1480099225005-2513c8947aec', visar: 'rugbyklunga i match' },
  medborgarratt: { slug: 'photo-1597704097219-0f6a59def63d', visar: 'demonstration för medborgerliga rättigheter' },
  likavarde:     { slug: 'photo-1761111566863-708fd5436f17', visar: 'händer med olika hudton bildar ett hjärta' },
  bakning:       { slug: 'photo-1763440976454-c70c217792bb', visar: 'nybakat bröd' },
  bat:           { slug: 'photo-1587977706287-86d257db113f', visar: 'roddbåt på stilla vatten' },
  bro:           { slug: 'photo-1706631437824-e000e6879353', visar: 'bro över vatten' },
  snigel:        { slug: 'photo-1601641939378-8364e9f12b3c', visar: 'snigel på gröna blad' },
  myraEn:        { slug: 'photo-1562586299-9b3c4a30e99c', visar: 'en enskild myra på marken' },
  myrorManga:    { slug: 'photo-1647865940733-4d6ba75e862c', visar: 'myrstig med många myror' },
  skolgard:      { slug: 'photo-1781102626553-e747b63bbdf0', visar: 'barn i klätterställning på skolgård' },
  sprak:         { slug: 'photo-1586716938030-3ae3b95a606b', visar: 'svensk skärgård med röda stugor' },
  armani:        { slug: 'photo-1580684518721-3d7c2af77e5a', visar: 'mörk skräddarsydd kostym' },
  omrostning:    { slug: 'photo-1758270704417-26c1244cfaf3', visar: 'uppräckta händer i ett klassrum' },
  hjarta:        { slug: 'photo-1460672985063-6764ac8b9c74', visar: 'anatomisk hjärtmodell' },
  sarlakning:    { slug: 'photo-1609840534277-88833ef3ddeb', visar: 'plåster på ett finger' },
  labb:          { slug: 'photo-1614935151651-0bea6508db6b', visar: 'pipettering i laboratorium' },
  apple:         { slug: 'photo-1628486930972-c1db82d528da', visar: 'äpplen på en gren' },
  spanien:       { slug: 'photo-1635774080776-fa6ab59b8f9c', visar: 'vit by i Andalusien' },
  sjunga:        { slug: 'photo-1686724641874-155f7153af1c', visar: 'barnkör som sjunger' },
  yttrandefrihet:{ slug: 'photo-1505682614136-0a12f9f7beea', visar: 'person med megafon i demonstration' },
  esport:        { slug: 'photo-1558008258-7ff8888b42b0', visar: 'spelare vid skärmar i e-sportturnering' },
  bihotell:      { slug: 'photo-1571586967117-0d07344d0b4f', visar: 'insektshotell i trädgård' },
  kanin:         { slug: 'photo-1785460624200-6f3388ad238c', visar: 'hare i snö' },
  honung:        { slug: 'photo-1548365329-c628c7005461', visar: 'honungsburk med slev' },
  lopning:       { slug: 'photo-1461896836934-ffe607ba8211', visar: 'löpare i startblock på bana' },
  matkasse:      { slug: 'photo-1633862712714-95b52023514e', visar: 'person bär matkasse' },
  vante:         { slug: 'photo-1643971553147-a725fbb2cd23', visar: 'vantar i vinterlandskap' },
  gunga:         { slug: 'photo-1436915947297-3a94186c8133', visar: 'tomma gungor på lekplats' },
  cykelkorg:     { slug: 'photo-1690100384599-e1e37c40fe18', visar: 'cykel med blomsterkorg' },
  fans:          { slug: 'photo-1429962714451-bb934ecdc4ec', visar: 'publik som gör hjärtan med händerna' },
  studio50:      { slug: 'photo-1587582140428-38110de9f434', visar: 'rullbandspelare i studio' },
  ungdomsfotboll:{ slug: 'photo-1526232761682-d26e03ac148e', visar: 'tränare med unga fotbollsspelare' },
  fotbollBarn:   { slug: 'photo-1600077063877-22118d6290eb', visar: 'barn som spelar fotboll' },
  berg:          { slug: 'photo-1537963772601-39f5889ecd04', visar: 'bergsby i torrt landskap' },
  fabrik:        { slug: 'photo-1785439089025-0abc25bace85', visar: 'gammal tegelfabrik med skorsten' },
  sjukhusteknik: { slug: 'photo-1666214280577-5f90bc36be92', visar: 'läkare vid skärmar med undersökningsbilder' },
  rav:           { slug: 'photo-1666511583219-15a56cd14c4c', visar: 'rödräv' },
  dna:           { slug: 'photo-1637929476734-bd7f5f78e40a', visar: 'DNA-spiral' },
  batteri:       { slug: 'photo-1670322196746-e8c6ea72ab90', visar: 'många batterier' },
  hjul:          { slug: 'photo-1588192821314-9564419477c4', visar: 'gamla trähjul' },
  appelodling:   { slug: 'photo-1727120279660-5c28b8461609', visar: 'äppelodling i rader' },
  enhorning:     { slug: 'photo-1607335352976-16651583593b', visar: 'enhörning i siluett mot solnedgång' },
  is:            { slug: 'photo-1762245308725-5fd80c42b3e5', visar: 'is på marken' },
  forlat:        { slug: 'photo-1672920890888-ebbf9d70dbcc', visar: 'två barn som sitter tillsammans' },
  planbok:       { slug: 'photo-1681389793334-a5d101b3c9d3', visar: 'plånbok som ligger kvar på en bänk' },
};

// Bilder som redan finns i biblioteket och passar bättre än den nuvarande.
const BEFINTLIG = {
  obama:    'photo-1580128660010-fd027e1e587a',
  sneakers: 'photo-1600185365483-26d7a4cc7519',
  // Skogsstig i motljus – blir ledig när enhörningstexterna flyttar, och
  // passar Midgård bättre än en trave böcker om entreprenörskap.
  midgard:  'photo-1500673922987-e212871fec22',
  // Uppslagna böcker, används redan av flera boktexter.
  bocker:   'photo-1456513080510-7bf3a84b82f8',
};

// Titel → nytt motiv. Titlarna är unika i biblioteket, vilket kontrolleras nedan.
const BYTEN = {
  // Björn Borg fick en björn. Nyckelordsmatchning på förnamnet.
  'Björn Borg och den moderna tennisens framväxt': 'tennis',
  'Björn Borg som kulturell ikon': 'tennis',

  // Fyra Harry Potter-texter illustrerade med böcker om entreprenörskap.
  'Makt, rädsla och vardaglig auktoritet i Harry Potter': 'harrypotter',
  'Etik i magi: när ett val påverkar någon annan': 'harrypotter',
  'Sorg, trauma och läkning i en magisk berättelse': 'harrypotter',
  'Varför Hogwarts känns verkligt': 'harrypotter',

  // Samma bild låg också på två texter ur Sagan om ringen, tre om Astrid
  // Lindgren och en om en upphittad plånbok. De får var sitt eget motiv.
  'Trilogins uppbyggnad och handling': 'midgard',
  'Teman och symbolik': 'midgard',
  'Astrid Lindgrens väg till författarskapet': 'bocker',
  'Pippi Långstrump och synen på barndomen': 'bocker',
  'Astrid Lindgrens arv och betydelse': 'bocker',
  'Hittad plånbok': 'planbok',

  // En Apple Watch på Englands rugbylandslag.
  'Englands rugbylandslag genom tiderna': 'rugby',
  'Kända spelare i Englands rugbylandslag': 'rugby',
  'Rugbyregler och taktik': 'rugby',
  'Vägen till landslaget': 'ungdomsfotboll',

  // En skjorta på strykbräda på medborgarrättsrörelsen.
  'Medborgarrättsrörelsen i USA': 'medborgarratt',
  'Segregationens konsekvenser': 'medborgarratt',

  // Grönsaker på ett bord illustrerade diskriminering.
  'Diskriminering och lika värde': 'likavarde',

  // Gymträning på bakning och pannkakor.
  'Bakning hemma': 'bakning',
  'Pannkaksfredag': 'bakning',
  'Mellanmål hemma': 'bakning',
  'En sen frukost': 'bakning',
  'Skorna som klämde': 'sneakers',

  // En skyline på båtar och broar.
  'Lådan som blev en båt': 'bat',
  'Båtens utveckling genom tiden': 'bat',
  'Så fungerar en bro': 'bro',

  // En tax i kartong på snigel och myra.
  'Snigeln': 'snigel',
  'Hur en myra hittar hem': 'myraEn',
  'Så hittar myror hem': 'myrorManga',

  // Paddleboard på tre skoltexter.
  'Så fungerar en rast': 'skolgard',
  'Den delade bänken': 'skolgard',
  'När någon inte svarar': 'skolgard',

  // "HAPPY NEW YEAR" i bokstavsbrickor på fem texter om språk och Åland.
  'Språk och kultur: att leva på svenska i Finland': 'sprak',
  'Språk, musik och en eld i mars': 'sprak',
  'Hur språk förändras': 'sprak',
  'Att bära två hem samtidigt': 'sprak',
  'Rösten som fick genomslag': 'sprak',

  // En mugg med "LIKE A BOSS" på texterna om tyst elegans.
  'Giorgio Armani och idén om tyst elegans': 'armani',
  'Lyx, hållbarhet och den dolda kedjan': 'armani',
  'När en modell blir en värld': 'armani',
  'Kostymen som språk: makt, kön och stil': 'armani',

  // Glass på omröstningar och klassmöten.
  'Omröstningen': 'omrostning',
  'Ett val i korridoren': 'omrostning',
  'Klassmötet': 'omrostning',
  'När unga får vara med och bestämma': 'omrostning',

  // En hjärnmodell på hjärtat och på sårläkning.
  'Varför hjärtat slår': 'hjarta',
  'Hur kroppen läker ett sår': 'sarlakning',

  // En honungsburk på en text om CRISPR i ett laboratorium.
  'Biologisk skuld': 'labb',
  'Saxen som kan ändra arvsmassan': 'dna',

  // Tomater på äppelträdet, mörk skog på äppelodlingen.
  'Äppelträdet i trädgården': 'apple',
  'Besök i äppelodlingen': 'appelodling',

  // En kustby i Italien på texten om Spanien.
  'Spanien – sol och traditioner': 'spanien',

  // Ett konstgalleri på sångstunden.
  'Sångstunden på fredag': 'sjunga',

  // Människor som packar lådor på yttrandefrihet.
  'Yttrandefrihet och dess gränser': 'yttrandefrihet',

  // En stadssiluett på en e-sporttext.
  'Sista rundan före uttagningen': 'esport',

  // Silhuetter i skog på bihotellet.
  'Ett bihotell på skolgården': 'bihotell',

  // Ett snöigt berg utan kanin.
  'Kaninen i snön': 'kanin',

  // Revbensspjäll på Bamses dunderhonung.
  'Dunderhonungens etikett': 'honung',
  'Dunderhonung och den försvunna cykelkorgen': 'cykelkorg',

  // Utförsåkning och fotboll på löpning.
  'Sista varvet': 'lopning',
  'Bollen på skolgården': 'fotbollBarn',

  // En loppvolontär på grannens matkasse.
  'Grannens tunga kasse': 'matkasse',

  // Legogubbar på vante och is.
  'Vanten som försvann': 'vante',
  'Isen på pölen': 'is',

  // Ett trumset på att säga förlåt.
  'Att säga förlåt': 'forlat',

  // Åskväder på gungan och på Bamses nya vän.
  'Bänken vid gungan': 'gunga',
  'Bamse och den nya vännen Kim': 'forlat',
  'En plats bredvid mig': 'forlat',

  // Barn i Sydasien på texter om fans och fandom.
  'Fans och gemenskap': 'fans',
  'När fandom blir en gemenskap': 'fans',

  // Ett kretskort på Elvis inspelningsstudio från 1950-talet.
  'Inspelningsstudion och tekniken bakom Elvis ljud': 'studio50',

  // En sovande katt på fotbollsakademin.
  'Akademin: när unga spelare drömmer stort': 'ungdomsfotboll',

  // Ett affärshandslag på Mellanösterns gränser.
  'Historien om löften och gränser': 'berg',
  'Självstyre och svåra kompromisser': 'berg',

  // En modern byggarbetsplats på 1800-talets fabriker.
  'När fabriken blev stadens hjärta': 'fabrik',

  // En konferenssal på AI som prioriterar patienter.
  'Maskinen som gör val': 'sjukhusteknik',

  // En boktrave på texten om rävar.
  'Boken om rävar': 'rav',

  // Ett plasmaklot på batterier, ett gravyrverktyg på hjulet.
  'Batterier – energi i fickformat': 'batteri',
  'Hjulet som rullade': 'hjul',

  // Ett bibliotek på enhörningarna.
  'Regnbågens enhörning': 'enhorning',
  'Enhörningen som hjälpte till': 'enhorning',

  // En häst på texten om Obamas tid efter presidentskapet.
  'Efter presidentskapet': 'obama',
};

// ─── Körning ────────────────────────────────────────────────────────────────

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

const url = (nyckel) =>
  MOTIV[nyckel] ? B(MOTIV[nyckel].slug) : BEFINTLIG[nyckel] ? B(BEFINTLIG[nyckel]) : null;

let fel = 0;
const rader = [];

for (const [titel, nyckel] of Object.entries(BYTEN)) {
  const traffar = lib.filter((t) => t.title === titel);
  if (traffar.length === 0) {
    console.error(`Hittar ingen text med titeln "${titel}"`);
    fel++;
    continue;
  }
  const ny = url(nyckel);
  if (!ny) {
    console.error(`"${titel}": okänt motiv "${nyckel}"`);
    fel++;
    continue;
  }
  for (const t of traffar) {
    rader.push({ t, titel, nyckel, gammal: t.imageUrl, ny });
  }
}

if (fel) {
  console.error(`\n${fel} problem – inget skrivet.`);
  process.exit(1);
}

const oforandrade = rader.filter((r) => r.gammal === r.ny);
if (oforandrade.length === rader.length) {
  console.error('Alla bilder är redan satta – skriptet verkar redan ha körts.');
  process.exit(1);
}

console.log('titel                                              motiv → ny bild visar');
for (const r of rader) {
  r.t.imageUrl = r.ny;
  const visar = MOTIV[r.nyckel] ? MOTIV[r.nyckel].visar : 'befintlig bild i biblioteket';
  console.log(`${r.titel.slice(0, 48).padEnd(50)} ${r.nyckel.padEnd(15)} ${visar}`);
}

const unikaEfter = new Set(lib.map((t) => t.imageUrl)).size;
console.log(`\n${rader.length} texter bytte bild. Unika bilder i biblioteket: ${unikaEfter}`);

if (!dry) {
  fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
  console.log('Skrivet.');
} else {
  console.log('(dry run – inget skrivet)');
}
