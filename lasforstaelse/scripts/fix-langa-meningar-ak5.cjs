#!/usr/bin/env node
//
// Fem åk 5-texter med exakt tio meningar på exakt trettio ord vardera.
//
// Genomsnittlig meningslängd i åk 5 är fjorton ord, i gymnasietexterna sexton.
// De här texterna hade alltså nästan dubbelt så långa meningar som gymnasiet,
// riktade till elever i elvaårsåldern. Mönstret – 300 ord delat på tio
// meningar – visar att texten skrivits för att fylla ett ordantal snarare än
// för att läsas.
//
// Följden blev att satser pressats ihop utan skiljetecken:
//
//   "vilket kallas transpiration tillsammans gör de luften fuktigare"
//   "betyder flackt det hjälper när du väljer väg och orkar"
//   "på kartan sedan går du sträckan och kollar om stämmer"
//   "kan den nya plasten bli spröd därför märks förpackningar"
//   "när veckor blir månader pengarna får ligga kvar länge"
//
// Texterna har fått sin interpunktion omskriven och de trasiga
// formuleringarna rättade. Sakinnehållet är oförändrat, och alla uppgifter
// som frågorna bygger på finns kvar.

const fs = require('fs');
const path = require('path');

const NYA_TEXTER = {
'ak5-tema-001': `Fotosyntes är en process där gröna växter använder solljus för att göra socker. Samtidigt frigörs syre som många djur och människor behöver för att kunna andas.

I bladen finns små delar som kallas kloroplaster. De är fyllda med klorofyll som fångar ljuset, och därför är bladen oftast gröna. Kemin startar när solen lyser och temperaturen är lagom.

Växten tar in koldioxid genom små öppningar som kallas klyvöppningar. Den suger också upp vatten med rötterna. Vattnet leds sedan upp i tunna rör i stammen till bladens celler, där allt blandas samman.

Med hjälp av ljusenergin byggs koldioxid och vatten om till druvsocker. Överskottet kan sparas som stärkelse i frön, rötter eller frukter, så att växten klarar natten och vintern bättre.

Syret som bildas släpps ut i luften. Men en del används också av växten själv när den andas, särskilt i mörker när fotosyntesen pausas och den får energi från socker.

Om det blir torrt stänger klyvöppningarna för att spara vatten. Då kommer mindre koldioxid in, och produktionen av socker går långsammare även om solen fortfarande skiner starkt.

Därför mår en krukväxt på fönsterbrädan bättre om den får jämn vattning. Den bör inte heller stå för nära ett varmt element som torkar ut jorden och luften runt bladen.

Fotosyntesen är viktig för hela jordens liv. Den lagrar solens energi i växternas mat, och den håller nivån av koldioxid lägre än den annars skulle vara i atmosfären.

När människor bränner kol, olja eller gas släpps koldioxid ut snabbare än växterna hinner ta upp den. Det påverkar klimatet på lång sikt, men skogar och odlingar kan hjälpa en del.

Genom att förstå fotosyntesen kan du se kopplingen mellan ett träd i parken, luften du andas och maten på tallriken. Du ser också hur allt hänger ihop i vardagen och naturen. Det är en av naturens viktigaste processer.`,

'ak5-tema-002': `Vattenkretsloppet beskriver hur samma vatten rör sig mellan hav, sjöar, mark och luft. Det är därför jorden får regn och floder kan fyllas på om och om igen under året.

När solen värmer vattenytor avdunstar vatten och blir osynlig vattenånga. Även växter släpper ut fukt genom sina blad, vilket kallas transpiration. Tillsammans gör de luften fuktigare över landet.

Högre upp, där luften är kallare, kyls ångan ner och bildar små droppar som samlas till moln. Ibland blir dropparna till iskristaller, när temperaturen sjunker under noll grader.

När molnen blir tunga faller nederbörd som regn, snö eller hagel. En del hamnar direkt i havet, medan annat landar på marken där det rinner vidare, sugs upp eller fryser.

Vatten som tränger ner i jorden blir grundvatten. Det kan samlas i lager mellan berg och sand, och många brunnar använder det som dricksvattenkälla under torra perioder när sjöarna sjunker.

Det vatten som rinner ovanpå marken bildar bäckar och älvar. På vägen kan det ta med sig jordpartiklar och näring till sjöar, vilket påverkar djur, växter och vattenkvalitet där.

I städer kan asfalt och tak göra att mer regn rinner snabbt till brunnarna. Därför bygger man ibland dammar eller gröna ytor som tar upp vatten och släpper det långsamt.

Människor påverkar kretsloppet genom att använda vatten, rena avloppsvatten och ibland leda om floder. Men själva rörelsen drivs av sol och gravitation, så vattnet söker sig alltid mot havet igen.

Om du ser dimma över en sjö på morgonen är det också vattenånga som kylts ner nära marken. Det är ett litet moln som visar att luften kan bära mycket fukt.

Genom att lära dig om vattenkretsloppet kan du förstå varför vi ibland sparar på vatten. Du förstår också varför regn kan saknas i vissa områden trots att samma planet har hav. Regnet som faller i dag kan ha varit havsvatten förut.`,

'ak5-tema-003': `Återvinning betyder att material som papper, glas, metall och plast samlas in och används igen. Alternativet är att de slängs och blir avfall, eller bränns utan att några resurser sparas.

När du sorterar hemma hamnar olika saker i olika kärl. På en återvinningsstation pressas och packas materialet, så att det kan transporteras effektivt till fabriker som gör nya produkter.

Glas är extra bra att återvinna, eftersom det kan smältas om många gånger utan att kvaliteten försämras. Men färgerna måste ofta hållas isär, så att grönt, brunt och ofärgat glas blir rätt.

Metallburkar och aluminium kan sparas på samma sätt. Det kräver mycket mindre energi att smälta om metall än att ta ny malm ur gruvan, och det sparar både energi och natur.

Papper görs av träfiber. Varje gång det återvinns blir fibrerna lite kortare, så till slut måste nytt papper blandas in för styrkans skull. Ändå kan en tidning få flera liv.

Plast är mer komplicerat, eftersom det finns många sorter med olika egenskaper. Om fel plast blandas kan den nya plasten bli spröd. Därför märks förpackningar med symboler och nummer.

Ibland bränns plast för att ge fjärrvärme. Då blir det energi, men också koldioxid. Återvinning eller minskad användning kan vara bättre, beroende på transport och vad plasten ersätter.

Elektronik, batterier och lampor ska lämnas separat. De kan innehålla metaller som är värdefulla, men också ämnen som måste hanteras säkert på anläggningar där personalen har rätt utrustning.

Om vi återvinner mer kan vi minska behovet av nya råvaror. Men det kräver att alla följer reglerna, och att produkterna designas smart så att de går att sortera lätt.

Nästa gång du står vid sorteringen kan du tänka på att varje rätt burk eller flaska är som en liten genväg. Materialet kommer tillbaka som en ny sak. Många små val blir tillsammans en stor skillnad.`,

'ak5-tema-004': `En budget är en plan för pengar. Den visar hur mycket du tror att du får in, och hur mycket du kan använda till olika saker under en månad.

Inkomster kan vara lön, studiebidrag eller presentpengar. Utgifter kan vara mat, hyra, busskort och fritidsaktiviteter. Det gäller att se helheten innan man bestämmer vad som finns kvar.

Om du skriver upp allt i en lista kan du upptäcka små kostnader som annars glöms bort, som en glass här eller ett mobilspel där. Då blir det lättare att välja.

En budget handlar inte om att aldrig köpa något roligt. Den handlar om att bestämma i förväg, så att pengarna räcker när något viktigt dyker upp, som en skolresa eller en trasig cykel.

I en enkel budget kan man dela upp utgifterna i behov och önskningar. Behov är sådant man måste ha, som mat och kläder. Önskningar kan ofta vänta.

När man sparar lägger man undan en liten summa regelbundet. Även om det känns långsamt i början blir summan större när veckorna blir månader och pengarna får ligga kvar.

Ibland kan man jämföra priser, låna saker eller dela med andra. På så sätt minskar utgifterna utan att livet blir sämre, men det kräver planering och att man tänker efter.

Om en familj får mindre pengar en period kan budgeten hjälpa dem att prioritera. Och om man får mer kan man bestämma vad som ska sparas och vad som används.

Ett vanligt misstag är att glömma oregelbundna utgifter, som födelsedagar eller nya skor. Därför skriver många upp dem som en egen post, för då blir man mindre överraskad.

När du tränar på budget i liten skala lär du dig ett sätt att fatta beslut. Det kan vara nyttigt senare, när du hanterar större summor på egen hand. Då vet du vart pengarna tar vägen varje månad.`,

'ak5-tema-005': `En karta är en ritad bild av ett område sett uppifrån. Där visas saker som vägar, hus och sjöar i mindre storlek med symboler, så att du hittar vägen och kan planera.

För att förstå avstånd använder kartan en skala, till exempel att en centimeter betyder en kilometer. Då kan du räkna ut hur långt det är mellan platser du vill besöka.

Kartans teckenförklaring berättar vad symbolerna står för, som en blå linje för en bäck eller en prickad linje för en stig. När du läser den slipper du gissa.

En kompass visar riktningar med hjälp av en magnetisk nål som pekar mot norr. Med den kan du vrida kartan så att norr stämmer mot verkligheten när du står ute.

När kartan är rättvänd kan du följa en linje från din plats till målet. Sedan jämför du med vad du ser, som en kulle eller en bro, så att du går rätt.

På många kartor finns höjdkurvor, tunna bruna linjer som visar hur marken lutar. Täta linjer betyder brant och glesa betyder flackt. Det hjälper när du väljer väg.

Om du bara har mobilkarta kan batteriet ta slut. Därför är det bra att kunna grunderna på papper, särskilt på längre utflykter där täckning kan saknas och vädret ändras snabbt.

När du övar kan du börja i ett känt område, som skolans kvarter. Markera start, mål och viktiga punkter på kartan. Sedan går du sträckan och kollar om det stämmer.

Det finns två norr: geografiskt norr mot jordaxeln, och magnetiskt norr som kompassen följer. Ibland skiljer de sig lite beroende på plats. Därför har vissa kartor en liten korrigering tryckt.

Att kunna läsa karta och använda kompass gör att du kan ta ansvar för din orientering, samarbeta i grupp och känna dig tryggare ute. Det gäller särskilt när stigar försvinner och skyltar saknas. Då hittar du ändå tillbaka.`,
};

// Uppgifter som frågorna bygger på och som måste finnas kvar i texten.
const NYCKELORD = {
  'ak5-tema-001': ['solljus', 'klyvöppningar', 'stärkelse i frön', 'mindre koldioxid in', 'Överskottet'],
  'ak5-tema-002': ['avdunstar', 'solen värmer', 'asfalt och tak', 'grundvatten', 'dimma', 'nederbörd'],
  'ak5-tema-003': ['används igen', 'färgerna måste ofta hållas isär', 'många sorter', 'lämnas separat', 'råvaror', 'mindre energi att smälta om metall'],
  'ak5-tema-004': ['plan för pengar', 'födelsedagar', 'små kostnader', 'liten summa regelbundet', 'Behov är sådant man måste ha', 'prioritera'],
  'ak5-tema-005': ['bild av ett område sett uppifrån', 'skala', 'batteriet ta slut', 'höjdkurvor', 'två norr', 'teckenförklaring'],
};

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;
Object.entries(NYA_TEXTER).forEach(([id, nyText]) => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error('Hittar inte ' + id); ok = false; return; }

  const foreOrd = t.text.trim().split(/\s+/).length;
  const foreMeningar = t.text.split(/(?<=[.!?])\s+/).filter(Boolean);

  const saknas = NYCKELORD[id].filter(o => !nyText.toLowerCase().includes(o.toLowerCase()));
  if (saknas.length) { console.error(`${id}: nyckelord borta – ${saknas.join(', ')}`); ok = false; return; }

  t.text = nyText;
  const efterOrd = nyText.trim().split(/\s+/).length;
  const efterMeningar = nyText.split(/(?<=[.!?])\s+/).filter(Boolean);
  t.meta = { ...(t.meta || {}), wordCount: efterOrd };

  const snittFore = (foreOrd / foreMeningar.length).toFixed(1);
  const snittEfter = (efterOrd / efterMeningar.length).toFixed(1);
  const inom = efterOrd >= 300 && efterOrd <= 320;
  if (!inom) ok = false;

  console.log(`${id}  ${foreOrd} → ${efterOrd} ord ${inom ? '✅' : '❌ krav 300–320'}`);
  console.log(`   meningar ${foreMeningar.length} → ${efterMeningar.length}, snittlängd ${snittFore} → ${snittEfter} ord`);
  console.log(`   längsta mening ${Math.max(...efterMeningar.map(m => m.split(/\s+/).length))} ord`);
});

if (!dry) fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
else console.log('\n(dry run – inget skrivet)');
if (!ok) process.exit(1);
