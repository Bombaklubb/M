#!/usr/bin/env node
//
// Del B: de återstående tretton nära dubbletterna i åk 1 skrivs om till
// genuint olika texter, alla inom ordintervallet 40–60 ord.

const fs = require('fs');
const path = require('path');

const NYA = {

'ak1-tema-028': {
  title: 'Rita i klassrummet',
  text: `Klassen ritar efter lunchen. Ali ritar ett hus med rött tak. Han glömmer att rita en dörr. Läraren pekar och ler. Ali ritar en dörr och två fönster också. Bilden sätts upp på väggen. Nästa dag hänger tjugo hus bredvid varandra där.`,
  questions: [
    { type: 'literal', q: 'När ritar klassen?', options: ['Efter lunchen', 'På morgonen', 'Precis före rasten', 'Sista timmen på dagen'], correct: 0 },
    { type: 'literal', q: 'Vilken färg har taket?', options: ['Blått', 'Rött', 'Grönt', 'Svart'], correct: 1 },
    { type: 'literal', q: 'Vad glömmer Ali först?', options: ['Fönstren', 'Skorstenen', 'Dörren', 'Trappan'], correct: 2 },
    { type: 'inferens', q: 'Varför pekar läraren på bilden?', options: ['Bilden är helt klar', 'Ali ska sluta rita nu', 'Ali har ritat fel färg', 'Något saknas på huset'], correct: 3 },
    { type: 'literal', q: 'Vad ritar Ali sedan?', options: ['En dörr och två fönster', 'Ett stort träd', 'En bil på gatan', 'En sol på himlen'], correct: 0 },
    { type: 'inferens', q: 'Vad har hänt nästa dag?', options: ['Bilderna är borttagna', 'Hela klassens hus hänger uppe', 'Ali har ritat en ny bild', 'Läraren har ritat ett eget hus'], correct: 1 },
  ],
},

'ak1-tema-038': {
  title: 'Sagan som fröken läste',
  text: `Efter rasten läser fröken en saga. Alla sitter på mattan. Sagan handlar om en björn som tappat bort sin mössa. Björnen letar överallt. Till slut sitter mössan på hans eget huvud. Alla i klassen skrattar. Nour säger att hon gjort likadant med sina glasögon.`,
  questions: [
    { type: 'literal', q: 'När läser fröken sagan?', options: ['Efter rasten', 'Före lunchen', 'På morgonen', 'Sist på dagen'], correct: 0 },
    { type: 'literal', q: 'Var sitter alla?', options: ['Vid sina bänkar', 'På mattan', 'I en ring på golvet', 'Ute på gården'], correct: 1 },
    { type: 'literal', q: 'Vad har björnen tappat bort?', options: ['Sin väska', 'Sin ena sko', 'Sin mössa', 'Sin nyckel'], correct: 2 },
    { type: 'inferens', q: 'Varför skrattar klassen?', options: ['Björnen ramlar omkull', 'Fröken läser fel ord', 'Sagan är plötsligt slut', 'Mössan satt på björnens huvud'], correct: 3 },
    { type: 'inferens', q: 'Vad menar Nour?', options: ['Att hon också letat efter något hon hade på sig', 'Att hon vill läsa sagan själv', 'Att björnen borde köpa en ny mössa', 'Att hon har tappat sina glasögon nu'], correct: 0 },
    { type: 'inferens', q: 'Hur känns stunden i klassrummet?', options: ['Spänd och tyst', 'Rolig och trevlig', 'Ledsam och tung', 'Stressig och rörig'], correct: 1 },
  ],
},

'ak1-tema-048': {
  title: 'Sångstunden på fredag',
  text: `Varje fredag sjunger klassen tillsammans. Läraren spelar gitarr. Vissa sjunger högt och andra viskar. Elias vågar inte sjunga alls i början. Han bara rör på läpparna. Efter några veckor sjunger han med på refrängen. Ingen märker när han börjar. Det gör det lättare.`,
  questions: [
    { type: 'literal', q: 'När sjunger klassen?', options: ['Varje fredag', 'Varje måndag', 'Varje morgon', 'Varje onsdag'], correct: 0 },
    { type: 'literal', q: 'Vad spelar läraren?', options: ['Piano', 'Gitarr', 'Trummor', 'Flöjt'], correct: 1 },
    { type: 'inferens', q: 'Vad gör Elias i början?', options: ['Sjunger mycket tyst', 'Går ut ur rummet', 'Rör bara på läpparna', 'Sjunger högre än alla andra'], correct: 2 },
    { type: 'inferens', q: 'Varför sjunger Elias inte alls först?', options: ['Han kan inte texten', 'Han tycker inte om musik', 'Han är förkyld i halsen', 'Han vågar inte'], correct: 3 },
    { type: 'literal', q: 'Vad sjunger Elias med på efter några veckor?', options: ['Refrängen', 'Hela sången', 'Första versen', 'Bara sista raden'], correct: 0 },
    { type: 'inferens', q: 'Varför blir det lättare för Elias?', options: ['Läraren hjälper honom särskilt', 'Ingen märker när han börjar', 'Klassen sjunger tystare nu', 'Sången har blivit kortare'], correct: 1 },
  ],
},

'ak1-tema-029': {
  title: 'Snögubben',
  text: `Det har snöat hela natten. Elsa och Hugo rullar tre stora bollar. Den största blir underst. Snögubben får stenar till ögon och en morot till näsa. En gammal halsduk hamnar runt halsen. På kvällen börjar det regna. Nästa morgon står bara moroten kvar i snön.`,
  questions: [
    { type: 'literal', q: 'Hur många bollar rullar de?', options: ['Tre', 'Två', 'Fyra', 'Fem'], correct: 0 },
    { type: 'literal', q: 'Vad får snögubben till ögon?', options: ['Kolbitar', 'Stenar', 'Knappar', 'Två lock'], correct: 1 },
    { type: 'literal', q: 'Vad får snögubben till näsa?', options: ['En pinne', 'En liten sten', 'En morot', 'En kotte'], correct: 2 },
    { type: 'inferens', q: 'Varför blir den största bollen underst?', options: ['Den är rundast av dem', 'Den blev först klar', 'Den är lättast att rulla', 'Den måste bära de andra'], correct: 3 },
    { type: 'literal', q: 'Vad händer på kvällen?', options: ['Det börjar regna', 'Det snöar ännu mer', 'Det blir mycket kallare', 'Det blåser upp till storm'], correct: 0 },
    { type: 'inferens', q: 'Varför står bara moroten kvar?', options: ['Någon har tagit snögubben', 'Snön har smält', 'Hugo har rivit snögubben', 'Halsduken blåste bort med den'], correct: 1 },
  ],
},

'ak1-tema-039': {
  title: 'Isen på pölen',
  text: `På gården finns en stor pöl. På natten har den frusit. Isen är tunn och vit i kanterna. Vilma trampar försiktigt på den. Det knakar. Hon backar direkt. Vaktmästaren kommer och strör sand runt pölen. Nu kan alla gå förbi utan att halka.`,
  questions: [
    { type: 'literal', q: 'Vad finns på gården?', options: ['En stor pöl', 'En sandlåda', 'En gunga', 'En stor sten'], correct: 0 },
    { type: 'literal', q: 'När frös pölen?', options: ['På morgonen', 'På natten', 'Under lunchen', 'På eftermiddagen'], correct: 1 },
    { type: 'literal', q: 'Hur ser isen ut i kanterna?', options: ['Tjock och blå', 'Grå och blöt', 'Tunn och vit', 'Full av sprickor'], correct: 2 },
    { type: 'inferens', q: 'Varför backar Vilma direkt?', options: ['Hon blir kall om fötterna', 'Hon hör vaktmästaren ropa', 'Hon ser något nere i isen', 'Isen knakar under henne'], correct: 3 },
    { type: 'literal', q: 'Vad gör vaktmästaren?', options: ['Strör sand runt pölen', 'Hugger sönder isen', 'Sätter upp ett staket', 'Öser bort allt vatten'], correct: 0 },
    { type: 'inferens', q: 'Varför strör han sand?', options: ['Isen ska smälta fortare', 'Ingen ska halka', 'Pölen ska försvinna helt', 'Barnen ska få leka där'], correct: 1 },
  ],
},

'ak1-tema-049': {
  title: 'Vanten som försvann',
  text: `Efter rasten saknar Ines en vante. Hon letar i fickorna och i hallen. Vanten är blå med vita prickar. Läraren frågar klassen. Ingen har sett den. Dagen efter hänger vanten på ett staket ute på gården. Någon har satt den där så att den syns.`,
  questions: [
    { type: 'literal', q: 'Vad saknar Ines?', options: ['En vante', 'Sin mössa', 'Sin ena sko', 'Sin ryggsäck'], correct: 0 },
    { type: 'literal', q: 'Hur ser vanten ut?', options: ['Röd med ränder', 'Blå med vita prickar', 'Alldeles svart', 'Grön med stjärnor'], correct: 1 },
    { type: 'inferens', q: 'Var letar Ines?', options: ['Bara i klassrummet', 'Ute på hela gården', 'I fickorna och i hallen', 'Hemma hos en kompis'], correct: 2 },
    { type: 'literal', q: 'Vad svarar klassen?', options: ['Att vanten låg på bänken', 'Att någon säkert tagit den', 'Att den ligger kvar i hallen', 'Att ingen har sett den'], correct: 3 },
    { type: 'literal', q: 'Var hittas vanten?', options: ['På ett staket', 'Under en bänk', 'Nere i sandlådan', 'Uppe i ett träd'], correct: 0 },
    { type: 'inferens', q: 'Varför hänger vanten på staketet?', options: ['Den har blåst dit', 'Någon ville att den skulle synas', 'Ines glömde den där', 'Vaktmästaren har tvättat den'], correct: 1 },
  ],
},

'ak1-tema-030': {
  title: 'Lunch i skolan',
  text: `I matsalen är det soppa idag. Amir tar två skivor bröd. Han sätter sig bredvid sin vän Maja. Soppan är varm och han blåser på skeden. Maja berättar om helgen. De hinner prata länge. Sedan ställer de tallrikarna på vagnen och går ut.`,
  questions: [
    { type: 'literal', q: 'Vad är det för mat?', options: ['Soppa', 'Pasta', 'Fisk', 'Pannkakor'], correct: 0 },
    { type: 'literal', q: 'Hur många skivor bröd tar Amir?', options: ['En', 'Två', 'Tre', 'Fyra'], correct: 1 },
    { type: 'literal', q: 'Vem sitter Amir bredvid?', options: ['Sin lillebror', 'Sin lärare', 'Maja', 'Ingen alls'], correct: 2 },
    { type: 'inferens', q: 'Varför blåser Amir på skeden?', options: ['Han är väldigt hungrig', 'Han sitter och leker', 'Soppan smakar konstigt', 'Soppan är varm'], correct: 3 },
    { type: 'literal', q: 'Vad berättar Maja om?', options: ['Helgen', 'En bok hon läst', 'En film hon sett', 'Sin katt'], correct: 0 },
    { type: 'inferens', q: 'Vad gör de innan de går ut?', options: ['Hämtar mer mat', 'Ställer tallrikarna på vagnen', 'Torkar av hela bordet', 'Hämtar sina jackor'], correct: 1 },
  ],
},

'ak1-tema-040': {
  title: 'Mellanmål hemma',
  text: `När Tuva kommer hem är hon hungrig. På bordet står en skål med äpplen. Hon skär ett äpple i fyra bitar. Sedan breder hon en smörgås. Katten hoppar upp och luktar på osten. Tuva flyttar tallriken. Hon äter vid fönstret och tittar ut på gården.`,
  questions: [
    { type: 'literal', q: 'Hur känner sig Tuva när hon kommer hem?', options: ['Hungrig', 'Trött', 'Glad', 'Ledsen'], correct: 0 },
    { type: 'literal', q: 'Vad står på bordet?', options: ['En kanna saft', 'En skål med äpplen', 'En tallrik bullar', 'En korg med bröd'], correct: 1 },
    { type: 'literal', q: 'I hur många bitar skär hon äpplet?', options: ['Två', 'Tre', 'Fyra', 'Sex'], correct: 2 },
    { type: 'inferens', q: 'Varför flyttar Tuva tallriken?', options: ['Den står i vägen på bordet', 'Hon ska diska den direkt', 'Bordet är blött under den', 'Katten luktar på osten'], correct: 3 },
    { type: 'literal', q: 'Var äter Tuva?', options: ['Vid fönstret', 'Vid köksbordet', 'I soffan', 'På golvet'], correct: 0 },
    { type: 'inferens', q: 'Vad gör hon medan hon äter?', options: ['Läser en bok', 'Tittar ut på gården', 'Pratar i telefon', 'Klappar katten'], correct: 1 },
  ],
},

'ak1-tema-050': {
  title: 'En sen frukost',
  text: `Väckarklockan ringde aldrig. Idris vaknar när solen redan är hög. Han har tio minuter på sig. Han häller upp fil och tappar hälften på bordet. Mamma torkar upp utan att säga något. Idris hinner precis med bussen. I ryggsäcken ligger en banan han får äta senare.`,
  questions: [
    { type: 'literal', q: 'Varför vaknar Idris sent?', options: ['Väckarklockan ringde aldrig', 'Han somnade om en gång', 'Klockan i köket gick fel', 'Han var sjuk under natten'], correct: 0 },
    { type: 'literal', q: 'Hur lång tid har han på sig?', options: ['Fem minuter', 'Tio minuter', 'En kvart', 'En halvtimme'], correct: 1 },
    { type: 'literal', q: 'Vad tappar han på bordet?', options: ['Mjölk', 'Saft', 'Fil', 'Kakao'], correct: 2 },
    { type: 'inferens', q: 'Varför säger mamma inget?', options: ['Hon har inte sett det', 'Hon är arg på honom', 'Hon pratar i telefon', 'Hon vet att Idris har bråttom'], correct: 3 },
    { type: 'inferens', q: 'Hur går det med bussen?', options: ['Han hinner precis med', 'Han missar den helt', 'Bussen är försenad', 'Han får skjuts i stället'], correct: 0 },
    { type: 'inferens', q: 'Varför ligger en banan i ryggsäcken?', options: ['Den har glömts kvar där', 'Han ska äta den senare', 'Den är till en kompis', 'Den ska ges till läraren'], correct: 1 },
  ],
},

'ak1-tema-031': {
  title: 'Bollen på gården',
  text: `På gården spelar barnen fotboll. Bollen är gul och sliten. Ett skott går för högt och bollen hamnar på taket. Alla blir tysta. Sedan kommer vaktmästaren med en lång stege. Han hämtar ner bollen. Spelet börjar om direkt. Den här gången skjuter alla lägre.`,
  questions: [
    { type: 'literal', q: 'Vilken färg har bollen?', options: ['Gul', 'Röd', 'Vit', 'Blå'], correct: 0 },
    { type: 'literal', q: 'Var hamnar bollen?', options: ['I en buske', 'På taket', 'Uppe i ett träd', 'Utanför staketet'], correct: 1 },
    { type: 'inferens', q: 'Varför blir alla tysta?', options: ['Någon har skadat sig', 'Läraren kommer ut', 'Bollen är utom räckhåll', 'Det ringer in till lektion'], correct: 2 },
    { type: 'literal', q: 'Vad har vaktmästaren med sig?', options: ['En ny boll', 'En kratta', 'Ett långt rep', 'En lång stege'], correct: 3 },
    { type: 'inferens', q: 'Varför skjuter alla lägre efteråt?', options: ['De vill inte tappa bollen igen', 'De har blivit trötta', 'Bollen är tyngre nu', 'Vaktmästaren har sagt till dem'], correct: 0 },
    { type: 'inferens', q: 'Hur slutar det?', options: ['Barnen går in i skolan', 'Spelet börjar om', 'Bollen går sönder', 'De byter till en annan lek'], correct: 1 },
  ],
},

'ak1-tema-041': {
  title: 'Hopprepet på rasten',
  text: `Två flickor svänger ett långt hopprep. En i taget springer in och hoppar. Först vågar Melvin inte. Han står bredvid och räknar takten tyst för sig själv. Sedan springer han in. Repet slår i marken bakom honom och han hoppar rätt. De andra räknar högt: ett, två, tre.`,
  questions: [
    { type: 'literal', q: 'Vad svänger flickorna?', options: ['Ett långt hopprep', 'En stor boll', 'En tunn lina', 'En trädgårdsslang'], correct: 0 },
    { type: 'literal', q: 'Hur många springer in åt gången?', options: ['Två', 'En', 'Tre', 'Alla samtidigt'], correct: 1 },
    { type: 'inferens', q: 'Vad gör Melvin först?', options: ['Springer in direkt', 'Går därifrån', 'Står bredvid och räknar tyst', 'Ber att få svänga repet'], correct: 2 },
    { type: 'inferens', q: 'Varför räknar Melvin takten?', options: ['Han övar på matte', 'Han vill lära de andra', 'Han har tråkigt', 'Han vill hitta rätt ögonblick'], correct: 3 },
    { type: 'inferens', q: 'Hur går det när han springer in?', options: ['Han hoppar rätt', 'Han snubblar och faller', 'Repet fastnar i foten', 'Han springer rakt igenom'], correct: 0 },
    { type: 'inferens', q: 'Varför räknar de andra högt?', options: ['För att Melvin ska sluta', 'För att heja på honom', 'För att börja om från början', 'För att byta hoppare'], correct: 1 },
  ],
},

'ak1-tema-033': {
  title: 'Boken i klassrummet',
  text: `I hyllan står en bok som alla vill låna. Omslaget är blått med en drake på. Bara en kan läsa den i taget. Läraren gör en lista. Sara står först. Hon läser klart på tre dagar. Sedan lämnar hon boken vidare till nästa på listan.`,
  questions: [
    { type: 'literal', q: 'Var står boken?', options: ['I hyllan', 'På bänken', 'I en väska', 'På lärarens bord'], correct: 0 },
    { type: 'literal', q: 'Hur ser omslaget ut?', options: ['Rött med en häst', 'Blått med en drake', 'Grönt med ett skepp', 'Svart med en stjärna'], correct: 1 },
    { type: 'inferens', q: 'Varför gör läraren en lista?', options: ['Boken ska lämnas tillbaka', 'Alla ska skriva sitt namn', 'Bara en kan läsa i taget', 'Boken är väldigt dyr'], correct: 2 },
    { type: 'literal', q: 'Vem står först på listan?', options: ['Läraren själv', 'Omar', 'En ny elev', 'Sara'], correct: 3 },
    { type: 'literal', q: 'Hur lång tid tar det för Sara att läsa ut boken?', options: ['Tre dagar', 'En vecka', 'Två dagar', 'En hel månad'], correct: 0 },
    { type: 'inferens', q: 'Vad händer med boken sedan?', options: ['Den ställs tillbaka i hyllan', 'Nästa på listan får den', 'Sara får behålla den', 'Läraren tar hem den'], correct: 1 },
  ],
},

'ak1-tema-043': {
  title: 'Torsdag på biblioteket',
  text: `Varje torsdag går klassen till biblioteket. Där är det tyst och luktar papper. Bibliotekarien visar var djurböckerna står. Noel letar länge och hittar en bok om valar. Han får låna den i tre veckor. På vägen tillbaka bär han boken med båda händerna.`,
  questions: [
    { type: 'literal', q: 'När går klassen till biblioteket?', options: ['Varje torsdag', 'Varje måndag', 'Varannan vecka', 'En gång i månaden'], correct: 0 },
    { type: 'literal', q: 'Hur är det på biblioteket?', options: ['Högljutt och fullt med folk', 'Tyst och luktar papper', 'Mörkt och ganska kallt', 'Varmt och väldigt trångt'], correct: 1 },
    { type: 'literal', q: 'Vad visar bibliotekarien?', options: ['Var man lämnar tillbaka böcker', 'Hur man söker i datorn', 'Var djurböckerna står', 'Vilka böcker som är nya'], correct: 2 },
    { type: 'literal', q: 'Vad handlar Noels bok om?', options: ['Fåglar', 'Hästar', 'Insekter', 'Valar'], correct: 3 },
    { type: 'literal', q: 'Hur länge får han låna boken?', options: ['Tre veckor', 'En vecka', 'Två veckor', 'En hel månad'], correct: 0 },
    { type: 'inferens', q: 'Varför bär Noel boken med båda händerna?', options: ['Boken är blöt om kanterna', 'Den är viktig för honom', 'Han har ont i ena handen', 'Ryggsäcken är redan full'], correct: 1 },
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
