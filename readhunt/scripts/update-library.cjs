const fs = require('fs');
const path = require('path');

const libraryPath = path.join(__dirname, '../public/data/library.json');
const library = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

// Funktion för att skapa bildURL baserat på titel
function getImageUrl(title) {
  const titleLower = title.toLowerCase();

  // Mappning av nyckelord till Unsplash-söktermer
  const mappings = [
    { keywords: ['katt', 'katten'], search: 'cat', id: '1514888286974-6c03e2ca1dba' },
    { keywords: ['hund', 'hunden', 'hundvalp', 'valp'], search: 'dog', id: '1587300003388-59208cc962cb' },
    { keywords: ['fågel', 'fågeln'], search: 'bird', id: '1444464666168-49d633b86797' },
    { keywords: ['regn', 'pöl', 'pölar'], search: 'rain', id: '1428592953211-077101b2021b' },
    { keywords: ['snö', 'snögubbe', 'vinter'], search: 'snow', id: '1491002052546-bf38f186af56' },
    { keywords: ['skog', 'skogen', 'träd'], search: 'forest', id: '1448375240586-882707db888b' },
    { keywords: ['blomma', 'frö', 'fröet'], search: 'flower', id: '1490750967868-88aa4486c946' },
    { keywords: ['skola', 'skolan', 'klass'], search: 'school', id: '1580582932707-520aed937b7b' },
    { keywords: ['bok', 'boken', 'böcker', 'läs'], search: 'book', id: '1544716278-ca5e3f4abd8c' },
    { keywords: ['bus', 'buss'], search: 'bus', id: '1570125909232-eb263c188f7e' },
    { keywords: ['lampa', 'lampan', 'ljus'], search: 'lamp', id: '1507473885765-e6ed057f782c' },
    { keywords: ['musik', 'trumma', 'sång'], search: 'music', id: '1511379938547-c1f69419868d' },
    { keywords: ['regnbåge'], search: 'rainbow', id: '1507400492013-162706c8c05e' },
    { keywords: ['pannkak'], search: 'pancakes', id: '1567620905732-2d1ec7ab7445' },
    { keywords: ['vant', 'mössa'], search: 'mittens', id: '1516912481808-3406841bd33c' },
    { keywords: ['tand'], search: 'smile', id: '1489278353717-f64c6ee8a4d2' },
    { keywords: ['konst', 'rita', 'mål'], search: 'painting', id: '1460661419201-fd4cecdf9a8b' },
    { keywords: ['pulka', 'backe'], search: 'sledding', id: '1610208282647-1d0ab7e7f0fd' },
    { keywords: ['sortera', 'sopor', 'miljö', 'återvinn'], search: 'recycling', id: '1532996122724-e3c354a0b15b' },
    { keywords: ['kompis', 'vän'], search: 'friends', id: '1529156069898-49953e39b3ac' },
    { keywords: ['promenad', 'gå', 'stig'], search: 'walking', id: '1476611338391-6f395a0ebc7b' },
    { keywords: ['farmor', 'mormor', 'gammal'], search: 'grandmother', id: '1581579438747-104c53d7c498' },
    { keywords: ['skugga', 'sol'], search: 'shadow', id: '1499678329028-101435549a4e' },
    { keywords: ['hjul'], search: 'wheel', id: '1558618666-fcd25c85cd64' },
    { keywords: ['sudd', 'penna'], search: 'pencil', id: '1513542789411-b6a5d4f31634' },
    { keywords: ['låda', 'båt'], search: 'cardboard-boat', id: '1566438480900-0609be27a4be' },
    { keywords: ['mask', 'jord'], search: 'soil', id: '1416879595882-3373a0480b5b' },
    { keywords: ['myra', 'myror'], search: 'ant', id: '1558642452-9d2a7deb7f62' },
    { keywords: ['bibliotek'], search: 'library', id: '1481627834876-b7833e8f5570' },
    { keywords: ['magnet'], search: 'magnet', id: '1559599076-9c61d8e1b77c' },
    { keywords: ['övergångsställ'], search: 'crosswalk', id: '1517732306149-e8f829eb588a' },
    { keywords: ['plånbok', 'hittad'], search: 'wallet', id: '1556742049-0cfed4f6a45d' },
    { keywords: ['enhörning'], search: 'unicorn', id: '1534447677941-ce074f5b6617' },
    { keywords: ['karta'], search: 'map', id: '1476973422084-e0fa66ff9456' },
    { keywords: ['grann', 'kasse'], search: 'helping', id: '1559027615-cd4628902d4a' },
    { keywords: ['sim', 'bad'], search: 'swimming', id: '1519315901367-f34ff9154487' },
    { keywords: ['rast'], search: 'playground', id: '1566464882255-9085f248c7de' },
    { keywords: ['storasyster', 'hjälp'], search: 'helping-sister', id: '1476234251651-f353703a034d' },
    { keywords: ['vatten'], search: 'water', id: '1548839140-29a749e1cf4d' },
    { keywords: ['visning'], search: 'presentation', id: '1524178232363-1fb2b075b655' },
    { keywords: ['kö', 'plats'], search: 'queue', id: '1517048676732-d65bc937f952' },
    { keywords: ['hopp', 'sport'], search: 'jumping', id: '1461896836934- voices' },
  ];

  for (const mapping of mappings) {
    for (const keyword of mapping.keywords) {
      if (titleLower.includes(keyword)) {
        return `https://images.unsplash.com/photo-${mapping.id}?w=600&h=400&fit=crop`;
      }
    }
  }

  // Default bild om inget matchar
  return `https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop`;
}

let movedToGrade2 = [];
let movedToGrade1 = [];
let updatedImages = [];

library.forEach(item => {
  const wordCount = item.meta?.wordCount || item.text.split(/\s+/).length;
  const originalGrade = item.grade;

  // Flytta åk1-texter med mer än 60 ord till åk2
  if (item.grade === 1 && wordCount > 60) {
    item.grade = 2;
    movedToGrade2.push({ id: item.id, title: item.title, wordCount });
  }

  // Flytta åk2-texter med mindre än 60 ord till åk1
  if (originalGrade === 2 && wordCount < 60) {
    item.grade = 1;
    movedToGrade1.push({ id: item.id, title: item.title, wordCount });
  }

  // Uppdatera bild baserat på titel
  const newImageUrl = getImageUrl(item.title);
  if (item.imageUrl !== newImageUrl) {
    const oldImage = item.imageUrl;
    item.imageUrl = newImageUrl;
    updatedImages.push({ id: item.id, title: item.title, oldImage: oldImage?.substring(0, 50), newImage: newImageUrl.substring(0, 50) });
  }
});

// Spara uppdaterad fil
fs.writeFileSync(libraryPath, JSON.stringify(library, null, 2));

console.log('\n=== Flyttade till årskurs 2 (hade >60 ord i åk1) ===');
movedToGrade2.forEach(item => {
  console.log(`  ${item.title} (${item.wordCount} ord)`);
});
console.log(`Totalt: ${movedToGrade2.length} texter\n`);

console.log('=== Flyttade till årskurs 1 (hade <60 ord i åk2) ===');
movedToGrade1.forEach(item => {
  console.log(`  ${item.title} (${item.wordCount} ord)`);
});
console.log(`Totalt: ${movedToGrade1.length} texter\n`);

console.log('=== Uppdaterade bilder ===');
console.log(`Totalt: ${updatedImages.length} bilder uppdaterade\n`);

// Verifiera resultat
const newLibrary = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));
const newAk1 = newLibrary.filter(t => t.grade === 1);
const newAk2 = newLibrary.filter(t => t.grade === 2);

console.log('=== Resultat ===');
console.log(`Årskurs 1: ${newAk1.length} texter`);
console.log(`Årskurs 2: ${newAk2.length} texter`);

// Visa nya åk1 texter
console.log('\n=== Nya årskurs 1 texter ===');
newAk1.forEach(t => {
  const wc = t.meta?.wordCount || t.text.split(/\s+/).length;
  console.log(`  ${t.title}: ${wc} ord`);
});

console.log('\n=== Nya årskurs 2 texter ===');
newAk2.forEach(t => {
  const wc = t.meta?.wordCount || t.text.split(/\s+/).length;
  console.log(`  ${t.title}: ${wc} ord`);
});
