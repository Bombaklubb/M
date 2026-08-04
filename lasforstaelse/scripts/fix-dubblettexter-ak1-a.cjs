#!/usr/bin/env node
//
// 27 av 66 texter i åk 1 var nära dubbletter av varandra: tio grupper där
// två eller tre texter hade samma titel och i praktiken samma innehåll.
// En elev kunde alltså få samma text serverad tre gånger.
//
// Del A: fjorton av dem skrivs om till genuint olika texter, alla inom
// åk 1:s ordintervall 40–60 ord och med sex nya frågor vardera.

const fs = require('fs');
const path = require('path');

const NYA = {

'ak1-tema-022': {
  title: 'Katten på trappan',
  text: `Maja öppnar dörren på morgonen. På trappan sitter en grå katt. Katten tittar lugnt på Maja. Den ser hungrig ut. Maja hämtar en skål med vatten. Katten dricker länge. Sedan reser den sig och går mot häcken. Maja vinkar. Nästa morgon sitter katten där igen.`,
  questions: [
    { type: 'literal', q: 'När öppnar Maja dörren?', options: ['På morgonen', 'På natten', 'På kvällen', 'På rasten'], correct: 0 },
    { type: 'literal', q: 'Var sitter katten?', options: ['På taket', 'På trappan', 'Under bordet', 'I bilen'], correct: 1 },
    { type: 'literal', q: 'Vad hämtar Maja?', options: ['Mat', 'Mjölk', 'Vatten', 'Bröd'], correct: 2 },
    { type: 'inferens', q: 'Varför hämtar Maja något åt katten?', options: ['Hon ska vattna blommorna', 'Hon är själv törstig', 'Hon ska tvätta trappan', 'Katten ser hungrig ut'], correct: 3 },
    { type: 'literal', q: 'Vart går katten sedan?', options: ['Mot häcken', 'In i huset', 'Upp i ett träd', 'Ner i källaren'], correct: 0 },
    { type: 'inferens', q: 'Vad förstår vi i slutet?', options: ['Att katten var sjuk', 'Att katten kommer tillbaka', 'Att Maja fick en egen katt', 'Att katten var rädd för Maja'], correct: 1 },
  ],
},

'ak1-tema-042': {
  title: 'Hunden som väntar',
  text: `Varje dag står en hund utanför affären. Den har ett rött koppel. Hunden tittar mot dörren hela tiden. Leo undrar varför den inte leker. Sedan kommer en man ut med en kasse. Hunden reser sig och viftar på svansen. De går hem tillsammans. Nu vet Leo varför hunden väntade.`,
  questions: [
    { type: 'literal', q: 'Var står hunden?', options: ['Utanför affären', 'Inne i parken', 'Vid skolan', 'På gården'], correct: 0 },
    { type: 'literal', q: 'Vilken färg har kopplet?', options: ['Blått', 'Rött', 'Grönt', 'Svart'], correct: 1 },
    { type: 'inferens', q: 'Varför tittar hunden mot dörren?', options: ['Den är rädd för dörren', 'Den vill in i värmen', 'Den väntar på någon', 'Den ser sin spegelbild'], correct: 2 },
    { type: 'literal', q: 'Vad har mannen med sig?', options: ['En hundleksak', 'Ett paraply', 'En hatt', 'En kasse'], correct: 3 },
    { type: 'inferens', q: 'Vad visar att hunden blir glad?', options: ['Den viftar på svansen', 'Den skäller högt', 'Den lägger sig ner', 'Den springer i väg'], correct: 0 },
    { type: 'inferens', q: 'Vad förstår Leo till slut?', options: ['Att hunden var vilse', 'Att hunden väntade på sin husse', 'Att hunden inte kan leka', 'Att hunden bor i affären'], correct: 1 },
  ],
},

'ak1-tema-024': {
  title: 'Glass i solen',
  text: `Det är varmt i parken. Alma köper en glass med jordgubbssmak. Solen skiner starkt. Glassen börjar smälta direkt. En droppe faller på hennes sko. Alma skrattar och äter fortare. Sedan sätter hon sig i skuggan under ett träd. Där håller glassen längre.`,
  questions: [
    { type: 'literal', q: 'Var är Alma?', options: ['I parken', 'I skolan', 'Hemma i köket', 'Vid havet'], correct: 0 },
    { type: 'literal', q: 'Vilken smak har glassen?', options: ['Choklad', 'Jordgubb', 'Vanilj', 'Citron'], correct: 1 },
    { type: 'inferens', q: 'Varför smälter glassen?', options: ['Den är gammal', 'Alma håller den hårt', 'Solen skiner starkt', 'Den var för billig'], correct: 2 },
    { type: 'literal', q: 'Vart faller droppen?', options: ['På hennes hand', 'I gräset', 'På bänken', 'På hennes sko'], correct: 3 },
    { type: 'inferens', q: 'Varför äter Alma fortare?', options: ['Glassen håller på att smälta', 'Hon är mycket hungrig', 'Hon ska hem snart', 'Hon fryser om händerna'], correct: 0 },
    { type: 'inferens', q: 'Varför sätter hon sig i skuggan?', options: ['Det är för högljutt i solen', 'Glassen håller längre där', 'Bänkarna i solen är upptagna', 'Hon vill läsa en bok'], correct: 1 },
  ],
},

'ak1-tema-034': {
  title: 'Vid badplatsen',
  text: `Nils och pappa går till badplatsen. Vattnet är kallt först. Nils står still på bryggan och tvekar. Pappa räknar till tre. Sedan hoppar de i samtidigt. Efter en stund känns vattnet skönt. Nils simmar till bojen och tillbaka. På stranden ligger en varm handduk och väntar.`,
  questions: [
    { type: 'literal', q: 'Vem går Nils med?', options: ['Med pappa', 'Med mamma', 'Med sin syster', 'Med en kompis'], correct: 0 },
    { type: 'inferens', q: 'Varför står Nils still på bryggan?', options: ['Han har glömt något hemma', 'Vattnet är kallt', 'Han kan inte simma alls', 'Han letar efter pappa'], correct: 1 },
    { type: 'literal', q: 'Vad gör pappa?', options: ['Han simmar först', 'Han ropar på Nils', 'Han räknar till tre', 'Han vinkar från stranden'], correct: 2 },
    { type: 'literal', q: 'Vart simmar Nils?', options: ['Till stranden', 'Runt hela bryggan', 'Ut till en båt', 'Till bojen'], correct: 3 },
    { type: 'inferens', q: 'Hur känns vattnet efter en stund?', options: ['Skönt', 'Ännu kallare', 'Grumligt', 'Alldeles för djupt'], correct: 0 },
    { type: 'inferens', q: 'Vad ska Nils göra efter badet?', options: ['Hoppa i en gång till', 'Torka sig med handduken', 'Gå ut på bryggan igen', 'Simma till bojen'], correct: 1 },
  ],
},

'ak1-tema-044': {
  title: 'Kalas i trädgården',
  text: `Idag fyller Vera sju år. Kalaset är i trädgården. Det hänger ballonger i äppelträdet. Alla sjunger när tårtan kommer ut. Vera blåser ut ljusen i ett enda andetag. Sedan leker de kull i gräset. En ballong lossnar och flyger upp mot himlen. Alla tittar efter den tills den försvinner.`,
  questions: [
    { type: 'literal', q: 'Hur gammal fyller Vera?', options: ['Sju år', 'Sex år', 'Åtta år', 'Fem år'], correct: 0 },
    { type: 'literal', q: 'Var är kalaset?', options: ['I skolan', 'I trädgården', 'På ett kafé', 'Hemma i köket'], correct: 1 },
    { type: 'literal', q: 'Var hänger ballongerna?', options: ['På staketet', 'På ytterdörren', 'I äppelträdet', 'Vid bordet'], correct: 2 },
    { type: 'inferens', q: 'Varför sjunger alla?', options: ['De leker en sånglek', 'De ska snart gå hem', 'Vera har bett dem om det', 'Tårtan kommer ut'], correct: 3 },
    { type: 'literal', q: 'Vad leker de sedan?', options: ['Kull', 'Kurragömma', 'Fotboll', 'Hoppa hage'], correct: 0 },
    { type: 'inferens', q: 'Varför tittar alla upp mot himlen?', options: ['Det börjar regna', 'En ballong flyger i väg', 'Ett flygplan passerar', 'Solen håller på att gå ner'], correct: 1 },
  ],
},

'ak1-tema-025': {
  title: 'Cykeln',
  text: `Sam har fått en ny cykel. Den är blå och har en ringklocka. Först är det svårt att hålla balansen. Pappa håller i sadeln och springer bredvid. Sedan släpper han taget. Sam cyklar ensam hela vägen till grinden. Han ringer i klockan tre gånger av glädje.`,
  questions: [
    { type: 'literal', q: 'Vilken färg har cykeln?', options: ['Blå', 'Röd', 'Grön', 'Vit'], correct: 0 },
    { type: 'literal', q: 'Vad sitter på cykeln?', options: ['En korg', 'En ringklocka', 'En lampa', 'En liten flagga'], correct: 1 },
    { type: 'inferens', q: 'Varför håller pappa i sadeln?', options: ['Cykeln är trasig', 'Han vill prova själv', 'Sam håller inte balansen', 'Vägen är väldigt brant'], correct: 2 },
    { type: 'literal', q: 'Hur långt cyklar Sam ensam?', options: ['Runt hela huset', 'Ända till skolan', 'Fram till affären', 'Hela vägen till grinden'], correct: 3 },
    { type: 'inferens', q: 'Varför ringer Sam i klockan?', options: ['Han är glad', 'Någon står i vägen', 'Han vill hem', 'Klockan sitter löst'], correct: 0 },
    { type: 'inferens', q: 'Vad har Sam lärt sig?', options: ['Att laga en cykel', 'Att cykla själv', 'Att springa fort', 'Att öppna grinden'], correct: 1 },
  ],
},

'ak1-tema-035': {
  title: 'Skorna som klämde',
  text: `Livs nya skor är fina men för små. På rasten börjar tårna göra ont. Hon säger inget först. Efter en stund haltar hon lite. En kompis frågar vad som hänt. Liv berättar. De går till skolsköterskan, som lånar ut ett par gympaskor. Resten av dagen känns mycket bättre.`,
  questions: [
    { type: 'literal', q: 'Vad är fel med skorna?', options: ['De är för små', 'De är för stora', 'De är trasiga', 'De är smutsiga'], correct: 0 },
    { type: 'literal', q: 'När börjar tårna göra ont?', options: ['På lektionen', 'På rasten', 'På morgonen', 'På vägen hem'], correct: 1 },
    { type: 'inferens', q: 'Varför säger Liv inget först?', options: ['Hon hör inte frågan', 'Hon glömmer bort det', 'Hon vill inte klaga', 'Hon har ont i halsen'], correct: 2 },
    { type: 'inferens', q: 'Hur märker kompisen att något är fel?', options: ['Liv börjar gråta', 'Liv sätter sig ner', 'Liv tar av sig skorna', 'Liv haltar'], correct: 3 },
    { type: 'literal', q: 'Vem hjälper Liv?', options: ['Skolsköterskan', 'Läraren', 'Vaktmästaren', 'Hennes pappa'], correct: 0 },
    { type: 'inferens', q: 'Varför känns dagen bättre sedan?', options: ['Rasten är slut', 'Hon har lånat andra skor', 'Hon får gå hem tidigt', 'Hon har fått ett plåster'], correct: 1 },
  ],
},

'ak1-tema-045': {
  title: 'Regn på vägen hem',
  text: `På vägen hem börjar det regna. Omar har ingen jacka med sig. Han springer in under ett stort tak vid busshållplatsen. Där står redan en gammal man med paraply. Mannen håller upp paraplyet över dem båda. De går tillsammans till Omars port. Omar säger tack. Regnet slutar precis då.`,
  questions: [
    { type: 'literal', q: 'Vad börjar hända på vägen hem?', options: ['Det börjar regna', 'Det börjar snöa', 'Det blir alldeles mörkt', 'Det börjar blåsa hårt'], correct: 0 },
    { type: 'inferens', q: 'Varför springer Omar?', options: ['Han är sen till middagen', 'Han vill inte bli blöt', 'Han ser en kompis långt bort', 'Bussen håller på att gå'], correct: 1 },
    { type: 'literal', q: 'Var ställer sig Omar?', options: ['Under ett stort träd', 'I en port', 'Under ett tak', 'Inne i en affär'], correct: 2 },
    { type: 'literal', q: 'Vad har mannen med sig?', options: ['En hund i koppel', 'En tung kasse', 'En stor hatt', 'Ett paraply'], correct: 3 },
    { type: 'inferens', q: 'Varför håller mannen paraplyet över dem båda?', options: ['Han vill hjälpa Omar', 'Paraplyet är för tungt', 'Han ska ge bort det', 'Han ser inte var han går'], correct: 0 },
    { type: 'inferens', q: 'Vad händer när de kommer fram?', options: ['Mannen följer med in', 'Regnet slutar', 'Bussen kommer äntligen', 'Omar tappar sina nycklar'], correct: 1 },
  ],
},

'ak1-tema-026': {
  title: 'Fågeln i trädet',
  text: `Milo går i skogen med sin mormor. De hör en fågel sjunga högt. Fågeln sitter längst upp i ett grönt träd. Den är liten och brun. Milo står alldeles stilla för att inte skrämma den. Mormor viskar att fågeln heter bofink. Sedan flyger den vidare till nästa träd.`,
  questions: [
    { type: 'literal', q: 'Vem går Milo med?', options: ['Sin mormor', 'Sin pappa', 'Sin storebror', 'Sin lärare'], correct: 0 },
    { type: 'literal', q: 'Var sitter fågeln?', options: ['På marken', 'Längst upp i ett träd', 'På en stor sten', 'På en gren nära marken'], correct: 1 },
    { type: 'literal', q: 'Hur ser fågeln ut?', options: ['Stor och svart', 'Vit med långa ben', 'Liten och brun', 'Grön med röd näbb'], correct: 2 },
    { type: 'inferens', q: 'Varför står Milo alldeles stilla?', options: ['Han är trött efter promenaden', 'Han lyssnar på mormor', 'Han har ont i foten', 'Han vill inte skrämma fågeln'], correct: 3 },
    { type: 'literal', q: 'Vad heter fågeln?', options: ['Bofink', 'Kråka', 'Talgoxe', 'Duva'], correct: 0 },
    { type: 'inferens', q: 'Varför viskar mormor?', options: ['Hon är hes i halsen', 'Fågeln ska inte flyga i väg', 'Milo hör dåligt', 'Det är förbjudet att prata'], correct: 1 },
  ],
},

'ak1-tema-036': {
  title: 'Ekorren vid stubben',
  text: `Vid en gammal stubb sitter en ekorre. Den håller en nöt mellan tassarna. Ekorren gräver ett litet hål i mossan. Där lägger den nöten och täcker över. Sedan springer den upp i en tall. Hanna undrar om ekorren kommer ihåg var nöten ligger. Mormor säger att den ofta glömmer.`,
  questions: [
    { type: 'literal', q: 'Var sitter ekorren?', options: ['Vid en gammal stubb', 'Inne i en buske', 'På en stor sten', 'Under en bänk'], correct: 0 },
    { type: 'literal', q: 'Vad håller ekorren i?', options: ['En pinne', 'En nöt', 'Ett löv', 'En kotte'], correct: 1 },
    { type: 'inferens', q: 'Varför gräver ekorren ett hål?', options: ['Den letar efter mat', 'Den ska sova där i natt', 'Den ska gömma nöten', 'Den letar efter vatten'], correct: 2 },
    { type: 'literal', q: 'Vart springer ekorren sedan?', options: ['Ner i hålet', 'Bakom stubben', 'Fram till Hanna', 'Upp i en tall'], correct: 3 },
    { type: 'inferens', q: 'Vad undrar Hanna?', options: ['Om ekorren minns var nöten är', 'Om ekorren är hungrig', 'Om ekorren är rädd för dem', 'Om ekorren har ungar'], correct: 0 },
    { type: 'inferens', q: 'Vad svarar mormor?', options: ['Att ekorren alltid minns', 'Att ekorren ofta glömmer', 'Att nöten är för hård', 'Att ekorren kommer tillbaka'], correct: 1 },
  ],
},

'ak1-tema-046': {
  title: 'Myrorna på stigen',
  text: `På stigen går en lång rad myror. De bär små bitar av löv. Raden ser ut som en tunn linje. Ida sätter sig ner och tittar länge. En myra tappar sin bit. En annan myra hjälper till att bära den. Ida flyttar sin fot så att ingen myra blir trampad på.`,
  questions: [
    { type: 'literal', q: 'Vad går på stigen?', options: ['En lång rad myror', 'En ekorre', 'En liten fågel', 'En katt'], correct: 0 },
    { type: 'literal', q: 'Vad bär myrorna?', options: ['Små stenar', 'Små bitar av löv', 'Nötter', 'Torra pinnar'], correct: 1 },
    { type: 'inferens', q: 'Varför sätter sig Ida ner?', options: ['Hon är trött', 'Hon har tappat något', 'Hon vill titta närmare', 'Hon har ont i benet'], correct: 2 },
    { type: 'literal', q: 'Vad händer med en av myrorna?', options: ['Den springer bort', 'Den klättrar upp på Ida', 'Den kryper under ett löv', 'Den tappar sin bit'], correct: 3 },
    { type: 'inferens', q: 'Vad visar den andra myran?', options: ['Att myror hjälps åt', 'Att myran är starkast', 'Att myror bråkar med varandra', 'Att myran har gått vilse'], correct: 0 },
    { type: 'inferens', q: 'Varför flyttar Ida på foten?', options: ['Hon ska gå vidare', 'Hon vill inte trampa på myrorna', 'Foten har somnat', 'Det är blött på stigen'], correct: 1 },
  ],
},

'ak1-tema-027': {
  title: 'Bussen',
  text: `Bussen kommer klockan åtta. Elin står vid skylten med sin ryggsäck. Dörrarna öppnas och hon går in. Hon hittar en plats vid fönstret. Utanför drar husen förbi. Vid tredje hållplatsen stiger hennes kompis på. De sitter bredvid varandra hela vägen. Sedan går de av vid skolan tillsammans.`,
  questions: [
    { type: 'literal', q: 'När kommer bussen?', options: ['Klockan åtta', 'Klockan nio', 'Klockan sju', 'Klockan tio'], correct: 0 },
    { type: 'literal', q: 'Var sätter sig Elin?', options: ['Längst bak', 'Vid fönstret', 'Bredvid föraren', 'Mitt i bussen'], correct: 1 },
    { type: 'inferens', q: 'Vad ser Elin utanför?', options: ['En annan buss köra om', 'Skolan komma närmare', 'Husen dra förbi', 'Regnet på rutan'], correct: 2 },
    { type: 'literal', q: 'Vid vilken hållplats stiger kompisen på?', options: ['Vid den första', 'Vid den sista', 'Vid den andra', 'Vid den tredje'], correct: 3 },
    { type: 'inferens', q: 'Varför står Elin vid skylten?', options: ['Där stannar bussen', 'Hon väntar på sin kompis', 'Det regnar mindre där', 'Hon läser vad som står'], correct: 0 },
    { type: 'inferens', q: 'Vart är de på väg?', options: ['Hem', 'Till skolan', 'Till affären', 'Till parken'], correct: 1 },
  ],
},

'ak1-tema-037': {
  title: 'Tåget utanför fönstret',
  text: `Från köksfönstret ser Noa tågen passera. Han räknar vagnarna varje gång. Godstågen är längst. Ett av dem hade trettio vagnar. Persontågen går fortare och är svårare att räkna. På kvällen lyser fönstren i tågen som små gula prickar. Noa vinkar ibland. En gång vinkade någon tillbaka.`,
  questions: [
    { type: 'literal', q: 'Var står Noa när han tittar?', options: ['Vid köksfönstret', 'På perrongen', 'Ute i trädgården', 'Vid grinden'], correct: 0 },
    { type: 'literal', q: 'Vilka tåg är längst?', options: ['Persontågen', 'Godstågen', 'Nattågen', 'Snabbtågen'], correct: 1 },
    { type: 'inferens', q: 'Varför är persontågen svårare att räkna?', options: ['De har många fler vagnar', 'De kommer betydligt oftare', 'De går fortare', 'De är mörka utanpå'], correct: 2 },
    { type: 'literal', q: 'Hur många vagnar hade ett av godstågen?', options: ['Tio', 'Tjugo', 'Femton', 'Trettio'], correct: 3 },
    { type: 'inferens', q: 'Vad ser Noa på kvällen?', options: ['Fönstren lysa som gula prickar', 'Tågen stanna vid huset', 'Loken byta spår', 'Snön falla på rälsen'], correct: 0 },
    { type: 'inferens', q: 'Vad gjorde en av gångerna särskild?', options: ['Tåget stannade helt', 'Någon vinkade tillbaka', 'Han räknade fel', 'Tåget tutade högt'], correct: 1 },
  ],
},

'ak1-tema-047': {
  title: 'Första gången i simhallen',
  text: `Idag ska klassen till simhallen. Sara har aldrig badat inomhus förut. Ljudet studsar mot väggarna och allt ekar. Vattnet luktar konstigt. Först vågar hon bara sitta på kanten. Läraren räcker fram en flytkudde. Sara går ner i den grunda delen. Efter en stund plaskar hon lika mycket som alla andra.`,
  questions: [
    { type: 'literal', q: 'Vart ska klassen?', options: ['Till simhallen', 'Ut i skogen', 'Till en sjö', 'Till idrottshallen'], correct: 0 },
    { type: 'literal', q: 'Vad är nytt för Sara?', options: ['Att bada över huvud taget', 'Att bada inomhus', 'Att åka buss med klassen', 'Att ha badkläder på sig'], correct: 1 },
    { type: 'inferens', q: 'Varför ekar allt?', options: ['Det är väldigt många barn', 'Vattnet skvalpar mot kanten', 'Ljudet studsar mot väggarna', 'Läraren ropar högt'], correct: 2 },
    { type: 'inferens', q: 'Varför sitter Sara först på kanten?', options: ['Hon fryser om fötterna', 'Hon väntar på en kompis', 'Hon har glömt sin handduk', 'Hon är osäker'], correct: 3 },
    { type: 'literal', q: 'Vad ger läraren henne?', options: ['En flytkudde', 'Ett par simglasögon', 'En stor handduk', 'En badring'], correct: 0 },
    { type: 'inferens', q: 'Hur går det till slut?', options: ['Hon går upp ur vattnet igen', 'Hon plaskar som alla andra', 'Hon simmar en hel bana', 'Hon blir sittande på kanten'], correct: 1 },
  ],
},
};

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;
Object.entries(NYA).forEach(([id, data]) => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error('Hittar inte ' + id); ok = false; return; }
  t.text = data.text;
  t.questions = data.questions;
  t.title = data.title;
  const n = data.text.trim().split(/\s+/).length;
  t.meta = { ...(t.meta || {}), wordCount: n };
  const inom = n >= 40 && n <= 60;
  if (!inom) ok = false;
  console.log(`${id.padEnd(14)} ${String(n).padStart(3)} ord ${inom ? '✅' : '❌ krav 40–60'}  facit:${data.questions.map(q => q.correct).join('')}  ${data.title}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
if (!ok) process.exit(1);
