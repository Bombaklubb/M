#!/usr/bin/env node
//
// Del D: åtta åk 2-texter till, 107–111 ord ned till intervallet 65–90.

const fs = require('fs');
const path = require('path');

const NYA = {

'ak1-musik-11': `På musiklektionen sa läraren: "Vi ska göra en rytm." Alla stod i en ring. Läraren klappade: klapp, klapp, stopp. Klassen härmade.

Yusuf klappade jättefort. "Jag hinner inte", viskade han.

Mei sa: "Vi kan räkna."

De räknade tillsammans: "Ett, två, stopp." Yusuf provade igen. Nu gick det bättre.

Sedan fick alla hitta på en egen rytm. Yusuf gjorde: klapp, stamp, klapp. När de spelade ihop blev det som en liten låt.

"Tack", sa Yusuf. "Jag trodde jag inte kunde."

Mei log. "Du behövde bara en takt."`,

'ak2-tema-010': `En kall vinterdag föll snön över fälten. I skogen bodde en ung enhörning som hette Frost. Hans päls var nästan lika vit som snön.

Barnen Amina och Leo byggde en snögubbe nära skogen. Plötsligt såg de något röra sig mellan träden. Det var Frost som försiktigt klev ut på fältet.

Amina och Leo stod helt stilla. De ville inte skrämma honom. Frost tittade på dem med stora ögon. Sedan vände han och sprang tillbaka in i skogen.

Barnen viskade till varandra att de just hade sett något magiskt.`,

'ak1-natur-09': `När det regnar faller vatten från molnen ner på marken. Om marken är hård eller redan blöt kan vattnet samlas i pölar, eftersom det inte kan sjunka ner lika lätt.

När solen kommer fram kan pölen bli mindre. Då avdunstar vattnet, vilket betyder att det blir till vattenånga och stiger upp i luften.

Regn är viktigt för växter. Blommor och träd behöver vatten för att växa.

Men vi ska akta oss vid hala stenar. Det är bäst att gå försiktigt när det är blött ute.`,

'ak2-tema-003': `Saga och hennes bror Ville satt på trappen hemma. De såg grannfrun Margit komma gående med två tunga kassar. Margit stannade och pustade.

"Ska vi hjälpa dig?" frågade Saga.

Margit log. "Det vore snällt."

Saga tog en kasse och Ville tog den andra. I kassen fanns mjölk, bröd, äpplen och en tidning.

"Tack, barn", sa Margit. "Vill ni ha var sin kaka?"

De fick en kanelbulle var.

"Det känns bra att hjälpa", sa Ville.

"Ja", sa Saga. "Och man får kanelbullar."`,

'ak3-tema-005': `På skolans höstfest ordnar lärarna en rolig tävling med äpplen. Eleverna delas in i små lag. Varje lag får en skål med vatten där flera äpplen flyter. Uppgiften är att få upp ett äpple utan att använda händerna. Barnen måste i stället ta äpplet med munnen.

Det blir mycket skratt när någon nästan lyckas men äpplet glider iväg igen.

Läraren Maria förklarar att äpplen flyter eftersom de innehåller mycket luft.

Vinnarlaget får en liten korg med extra frukt. Många elever säger att det var det roligaste på hela höstfesten.`,

'ak2-tema-001': `Varje morgon sitter en liten fågel på fönsterbrädan utanför Willmas rum. Den pickar på glaset och hoppar fram och tillbaka.

"Vad äter den?" frågar hon sin pappa.

"Fröer och insekter", svarar pappa. "Vi kan hänga ut en fågelmatare."

De gör en matare av en tom mjölkkartong. Willma klipper ett hål i sidan och fyller med solrosfrön. Pappa hjälper henne att hänga den i trädet.

Nästa dag kommer fågeln tillbaka och äter. Snart kommer fler. Willma räknar tre stycken. Hon ritar dem i sitt block och skriver vad de gör.`,

'ak4-001': `Emma och Leo gick djupt in i skogen. De hade hittat en gammal karta på vinden hemma hos mormor. Kartan visade ett stort träd med ett rött kryss på stammen.

Efter en timmes vandring såg de trädet. Vid rötterna hittade de en rostig låda. Inuti låg gamla guldmynt och ett brev från mormors morfar.

I brevet stod det att han hade gömt skatten för hundra år sedan. Han hoppades att någon i familjen skulle hitta den en dag.

Emma och Leo skyndade hem för att visa mormor.`,

'ak4-vetenskap-rymd-001': `Rymden är det stora området utanför jorden. Där finns planeter, stjärnor och galaxer. Jorden är en av åtta planeter som kretsar runt solen.

Solen är en stjärna som ger oss ljus och värme. Månen kretsar runt jorden och lyser på natten.

Astronauter är personer som reser ut i rymden med raketer. I rymden finns nästan ingen luft, därför måste astronauter ha speciella dräkter.

Forskare använder teleskop för att studera rymden. Genom att titta på stjärnorna kan de lära sig mer om universum.`,
};

const NYCKELORD = {
  'ak1-musik-11': ['klapp, klapp, stopp', 'Yusuf klappade jättefort', 'Vi kan räkna', 'hinner inte', 'Ett, två, stopp'],
  'ak2-tema-010': ['Frost', 'vinterdag', 'snögubbe', 'I skogen bodde', 'stod helt stilla', 'något magiskt'],
  'ak1-natur-09': ['vatten från molnen', 'pölen bli mindre', 'avdunstar', 'inte kan sjunka ner', 'behöver vatten för att växa', 'hala stenar'],
  'ak2-tema-003': ['två tunga kassar', 'mjölk, bröd, äpplen och en tidning', 'kanelbulle var', 'grannfrun Margit', 'pustade'],
  'ak3-tema-005': ['höstfest', 'skål med vatten', 'med munnen', 'mycket luft', 'korg med extra frukt', 'roligaste'],
  'ak2-tema-001': ['fönsterbrädan', 'tom mjölkkartong', 'solrosfrön', 'tre stycken', 'ritar dem i sitt block'],
  'ak4-001': ['vinden hemma hos mormor', 'en timmes vandring', 'mormors morfar', 'någon i familjen', 'visa mormor'],
  'ak4-vetenskap-rymd-001': ['åtta planeter', 'Solen är en stjärna', 'nästan ingen luft', 'teleskop', 'Månen kretsar runt jorden'],
};

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;
Object.entries(NYA).forEach(([id, text]) => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error('Hittar inte ' + id); ok = false; return; }

  const saknas = (NYCKELORD[id] || []).filter(o => !text.toLowerCase().includes(o.toLowerCase()));
  if (saknas.length) {
    console.error(`${id}: nyckelord borta ur texten – ${saknas.join(', ')}`);
    ok = false; return;
  }

  const fore = t.text.trim().split(/\s+/).length;
  t.text = text;
  const n = text.trim().split(/\s+/).length;
  t.meta = { ...(t.meta || {}), wordCount: n };
  const inom = n >= 65 && n <= 90;
  if (!inom) ok = false;
  console.log(`${id.padEnd(24)} ${String(fore).padStart(4)} → ${String(n).padStart(3)} ord ${inom ? '✅' : '❌ krav 65–90'}  ${t.title}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
if (!ok) process.exit(1);
