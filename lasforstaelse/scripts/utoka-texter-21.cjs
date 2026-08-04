#!/usr/bin/env node
//
// Sats 21: de tre Astrid Lindgren-texterna i åk 10, som låg 32–40 % under
// intervallet 590–625 ord. Tilläggen är fördelade så att texterna skiljer
// sig åt: biografin i den första, mottagandet av Pippi i den andra och det
// politiska genomslaget i den tredje.

const fs = require('fs');
const path = require('path');

const TILLAGG = {

'akgy-tema-007': [
  { fore: 'Berättelsen om Pippi Långstrump började som en saga', text:
`Vägen dit gick genom år som inte syns i böckerna. Som artonåring blev hon gravid i Vimmerby, vilket vid den tiden var en skandal i en liten ort. Hon flyttade till Stockholm, födde sin son i Köpenhamn och lämnade honom hos en fosterfamilj i Danmark under de första åren, eftersom hon varken hade pengar eller bostad. Att hon senare skrev så inkännande om barn som saknar sina föräldrar har av många kopplats till just den perioden.` },
  { fore: 'Astrid Lindgren skrev inte bara om äventyrliga barn.', text:
`Genombrottet kom via en tävling. Manuset till Pippi skickades först till ett förlag som tackade nej. Året därpå lämnade hon in det i en tävling utlyst av det nystartade förlaget Rabén & Sjögren, och vann. Att en av 1900-talets mest spridda barnböcker refuserades en gång brukar nämnas som en påminnelse om hur mycket som avgörs av vem som råkar läsa ett manus.` },
  { fore: 'Utöver sitt arbete som författare engagerade sig Astrid Lindgren', text:
`Hon blev dessutom kvar på förlaget. Under nästan tjugofem år arbetade Astrid Lindgren som redaktör på Rabén & Sjögren och läste, refuserade och utvecklade andra författares manus. Den delen av hennes gärning är mindre känd men betydande: en stor del av den svenska barnboksutgivningen under efterkrigstiden passerade hennes skrivbord. Flera av de författare som räknas till den svenska barnbokens guldålder debuterade under hennes redaktörskap.` },
],

'akgy-tema-008': [
  { fore: 'Litteraturforskare har ofta analyserat Pippi', text:
`Reaktionerna lät inte vänta på sig. Den kanske mest kända kom 1946 från professorn John Landquist, som i en tidningsartikel beskrev boken som onaturlig och menade att den kunde skada barns själsliv. Kritiken fick stor spridning och besvarades av andra röster. Att en barnbok kunde utlösa en offentlig strid mellan akademiker säger något om hur mycket som ansågs stå på spel i frågan om hur barn borde uppfostras. Landquist var en etablerad litteraturprofessor, vilket gav kritiken tyngd, och striden som följde brukar räknas som en av de mest omtalade i svensk barnbokshistoria.` },
  { fore: 'Böckerna kan också läsas som en hyllning till barns fantasi.', text:
`Tidpunkten är också värd att lägga märke till. Boken kom ut 1945, samma år som andra världskriget slutade, och skrevs under de år då stora delar av Europa styrdes av regimer som byggde på lydnad. Flera forskare har läst Pippi som ett svar på just det: en gestalt som vägrar underordna sig någon enbart för att den andra är större eller har en titel.` },
  { fore: 'Karaktärens långvariga popularitet visar', text:
`Böckerna har dessutom ändrats efter hand. I senare utgåvor har ord som beskrev Pippis far bytts ut, eftersom de ursprungliga uttrycken i dag uppfattas som rasistiska. Ändringarna har diskuterats: vissa menar att en text bör läsas som den skrevs, med sin tid synlig, medan andra menar att en bok som fortfarande läses av små barn inte kan innehålla ord som sårar. Frågan gäller långt fler böcker än just denna. Astrid Lindgren själv hann aldrig ta ställning till den ändringen, som gjordes långt efter hennes död.` },
],

'akgy-tema-009': [
  { fore: 'Forskare som studerar barnlitteratur framhåller', text:
`Ett av de tydligaste exemplen på hennes politiska genomslag kom 1976. I en satirisk saga i en kvällstidning skrev hon om Pomperipossa, som upptäcker att hennes skatt överstiger hennes inkomst. Texten byggde på hennes egen situation och blev ett av de mest omtalade debattinläggen under valåret. Att en barnboksförfattare kunde sätta en ekonomisk fråga på dagordningen sade något om vilken ställning hon hade. Samma år förlorade Socialdemokraterna regeringsmakten efter fyrtiofyra år, och även om orsakerna var många brukar skattedebatten nämnas bland dem.` },
  { fore: 'Även film, teater och turism har påverkats av hennes verk.', text:
`Ännu större följder fick ett tal två år senare. När hon tog emot ett tyskt fredspris 1978 höll hon talet Aldrig våld, där hon argumenterade mot aga och berättade om en mor som skickar sin son att själv hämta det ris han ska slås med. Året därpå blev Sverige första land i världen att förbjuda barnaga i lag, och talet brukar nämnas som en del av förklaringen.` },
  { fore: 'När man diskuterar Astrid Lindgrens arv', text:
`Efter hennes död har arvet också institutionaliserats. Sedan 2002 delas Litteraturpriset till Astrid Lindgrens minne ut varje år till en författare, illustratör eller läsfrämjare någonstans i världen, och det är ett av de största priserna inom barn- och ungdomslitteratur. Att ett land väljer att förvalta ett författarskap på det sättet är i sig ett uttryck för vilken plats hon fått i svensk självbild. Priset är avsiktligt öppet både för författare och för dem som arbetar med att få barn i olika delar av världen att läsa.` },
],
};

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;
Object.entries(TILLAGG).forEach(([id, delar]) => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error('Hittar inte ' + id); ok = false; return; }
  delar.forEach(d => {
    if (!t.text.includes(d.fore)) {
      console.error(`${id}: hittar inte ankaret "${d.fore.slice(0, 40)}…"`); ok = false; return;
    }
    t.text = t.text.replace(d.fore, d.text + '\n\n' + d.fore);
  });
  const n = t.text.trim().split(/\s+/).length;
  t.meta = { ...(t.meta || {}), wordCount: n };
  const inom = n >= 590 && n <= 625;
  if (!inom) ok = false;
  console.log(`${id.padEnd(16)} ${String(n).padStart(4)} ord ${inom ? '✅' : '❌ krav 590–625'}  ${t.title}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
if (!ok) process.exit(1);
