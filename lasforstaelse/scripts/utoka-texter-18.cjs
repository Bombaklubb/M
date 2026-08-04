#!/usr/bin/env node
//
// Sats 18: de fyra kortaste texterna i åk 9–10, som låg 52–56 % under sina
// ordintervall. Här läggs stycken till; grundtexten är oförändrad.
//
// akgy-sol-003 justeras samtidigt: i sats 16 fick den två stycken om hur
// solsystemet bildades, vilket är precis vad akgy-sol-001 handlar om. De
// styckena byts mot innehåll som är eget för texten.

const fs = require('fs');
const path = require('path');

const TILLAGG = {

'akgy-sol-001': [
  { efter: 'Med tiden bildades planetesimaler, som sedan utvecklades till planeter.', text:
`Hur vet man att solsystemet är just 4,6 miljarder år gammalt? Svaret kommer inte från solen eller planeterna utan från meteoriter. I dem finns ämnen som sönderfaller radioaktivt i en känd takt, och genom att mäta förhållandet mellan ursprungsämne och sönderfallsprodukt går det att räkna ut hur länge sedan materialet stelnade. Flera oberoende metoder ger samma svar, vilket väger tyngre än en enda mätning hur noggrann den än är.` },
  { efter: 'vilket resulterade i gasjättar och isjättar som Jupiter, Saturnus, Uranus och Neptunus.', text:
`Gränsen mellan de två sorternas planeter har ett namn: snölinjen. Innanför den var strålningen från den unga solen så stark att vatten och andra flyktiga ämnen förblev gas och blåste bort. Utanför den kunde de frysa till is, och is fanns det gott om. Att de yttre planeterna kunde bli så stora beror alltså på att de hade tillgång till betydligt mer byggmaterial.

Bilden av en lugn och ordnad uppbyggnad har dock reviderats. Flera modeller antar i dag att de stora planeterna inte blev kvar där de bildades, utan vandrade inåt och utåt under systemets första hundratals miljoner år. Sådana förflyttningar kan förklara varför asteroidbältet är så glest och varför de yttre planeternas banor ser ut som de gör. Att en etablerad modell skrivs om när nya observationer kommer är inget tecken på svaghet utan på hur vetenskap arbetar.` },
  { efter: 'skapat material som senare bildade månen.', text:
`Teorin om månens bildning bygger på flera olika iakttagelser. Månen innehåller ovanligt lite järn i förhållande till jorden, vilket stämmer med att den skulle ha bildats av jordskorpans yttre lager snarare än av en hel planet. Sammansättningen av vissa ämnen är dessutom nästan identisk med jordens, något som är svårt att förklara om månen fångats in utifrån.

Allt material blev heller inte planeter. Asteroidbältet mellan Mars och Jupiter består av byggstenar som aldrig fick chansen att klumpa ihop sig, eftersom Jupiters gravitation störde dem. Spåren av den tidiga tiden syns fortfarande på månens yta, där kratrar efter kollisioner ligger kvar eftersom det saknas väder och vatten som kan sudda ut dem. På jorden har samma spår till största delen slipats bort.` },
  { efter: 'vilka som är unika.', text:
`Processen är inte heller avslutad. Solsystemet fortsätter att förändras, om än i en takt som gör att ett människoliv knappt räcker för att märka något alls.` },
],

'akgy-abba-001': [
  { efter: 'vilket gjorde dem kända långt utanför Sveriges gränser.', text:
`Vinsten 1974 var mindre självklar än den ser ut i efterhand. Sverige hade aldrig tidigare vunnit tävlingen, och gruppen hade året innan misslyckats med att ens bli uttagen. Att de vann med en låt som lät mer som rock än som traditionell schlager var en del av förklaringen till genomslaget: den fungerade på radio också utanför tävlingssammanhanget.` },
  { efter: 'vilket senare banade väg för andra framgångsrika artister.', text:
`Bakom framgången fanns också en person som sällan syns på bilderna. Stikkan Anderson var gruppens manager och skivbolagsdirektör, och det var han som såg till att rättigheterna stannade i Sverige i stället för att säljas vidare till ett utländskt bolag. Att intäkterna kom hem byggde upp ett kapital som senare kunde investeras i studior och i nya artister.

Musikexport handlar dessutom om mer än artister. En stor del av det Sverige tjänar på musik kommer från låtskrivare och producenter som arbetar åt utländska stjärnor, ofta utan att deras namn är kända för publiken. Den delen av branschen syns inte på några listor men är ekonomiskt betydande.` },
  { efter: 'Detta bidrog till att hålla gruppens musik levande och relevant.', text:
`Den tydligaste länken framåt går genom producenten Denniz Pop och studion Cheiron i Stockholm, där bland andra Max Martin började arbeta på 1990-talet. Därifrån kom hitlåtar åt en lång rad amerikanska artister, och arbetssättet med noggrant byggda refränger har beskrivits som ett arv från just ABBA. Att svenska namn står bakom en stor del av världens listettor är i dag så vanligt att det sällan ens kommenteras.

Varför det gick just i Sverige har diskuterats mycket. En förklaring som ofta nämns är den kommunala musikskolan, som gjorde att många barn kunde lära sig ett instrument billigt eller gratis. En annan är att engelska undervisades tidigt i skolan, vilket gjorde det naturligt att skriva på ett språk med en betydligt större marknad. Att förklaringarna är många gör dem samtidigt svåra att pröva: det som ser ut som en orsak i efterhand kan lika gärna vara en följd av att något redan lyckats.` },
],

'akgy-borg-003': [
  { efter: 'Detta illustrerar hur en individs bidrag kan få långvariga konsekvenser för ett helt fält.', text:
`Den tekniska förändringen är lättast att beskriva konkret. Borg slog bollen med kraftig överskruv, vilket får den att dyka ner i banan snabbare än en flat boll. Det gjorde att han kunde slå hårt och ändå hålla bollen innanför linjen, och att han kunde spela långa dueller utan att göra misstag. Dagens spelare gör i princip likadant, ofta ännu mer utpräglat, med racketar och strängar som förstärker effekten.

I Sverige fick framgången dessutom direkta följder. Antalet ungdomar som började spela tennis ökade kraftigt under hans år, och ur den generationen kom spelare som Mats Wilander och Stefan Edberg. Att ett land plötsligt producerar flera världsspelare beror sällan på slumpen utan på att många fler började öva samtidigt.` },
  { efter: 'Detta visar att idrottslig framgång inte nödvändigtvis garanterar framgång inom andra områden.', text:
`Hans tidiga slut fick också ett efterspel. År 1991 försökte Borg göra comeback, fortfarande med en träracket, i en sport som under åren däremellan hade gått över till grafit. Försöket blev inte framgångsrikt och beskrevs som en ovilja att acceptera att tiden gått. I efterhand har det också lästs som ett tecken på hur svårt det är att sluta med det som utgjort hela ens identitet.

Affärslivet gav en annan sorts lärdom. Bolag knutna till hans namn fick under 1990-talet allvarliga ekonomiska problem, och varumärket kom så småningom i andra ägares händer. Att namnet i dag lever vidare på kläder utan att han själv driver verksamheten är ett konkret exempel på hur en person och ett varumärke kan skiljas åt.` },
  { efter: 'Detta understryker vikten av mångfald i historiska och kulturella analyser.', text:
`Eftermälet skrivs dessutom om av varje ny skildring. Dokumentärer och spelfilmer har på senare år fokuserat på pressen, ångesten och den tidiga utmattningen snarare än på titlarna. Att en berättelse om disciplin blir en berättelse om vad disciplinen kostade säger något om vilka frågor som anses viktiga i dag.

Hur ett idrottsarv ska mätas är i sig en fråga. Titlar och rekord går att räkna, men inflytande gör det inte. Att Borg vann elva Grand Slam-titlar säger mindre om hans betydelse än att en spelstil han var med om att etablera i dag är den som nästan alla använder.` },
],

'akgy-demo-001': [
  { efter: 'lade denna modell grunden för senare diskussioner om folkstyre och politiskt deltagande.', text:
`Den atenska modellen skilde sig mer från vår än ordet demokrati antyder. Många ämbeten tillsattes genom lottning i stället för val, eftersom lottning ansågs mer jämlik: den gav ingen fördel åt den som var rik, vältalig eller redan känd. Folkförsamlingen kunde samla tusentals medborgare som röstade direkt om krig, skatter och lagar.

Begreppet i sig har dessutom bytt innebörd. Under antiken användes ordet ofta nedsättande, som en beteckning på pöbelvälde, och långt in på 1800-talet såg många tänkare demokrati som något farligt snarare än eftersträvansvärt. Att ordet i dag används positivt av nästan alla, även av regimer som inte är demokratiska, är i sig en förändring värd att lägga märke till.` },
  { efter: 'vilket innebar att lagar skulle spegla folkets gemensamma intresse.', text:
`Mellan antiken och upplysningen växte andra former fram. Magna Carta i England 1215 var inte ett demokratiskt dokument, men den slog fast att även en kung var bunden av regler. Tanken att makten har gränser är en av demokratins förutsättningar, och den kom långt före tanken att alla ska få vara med och bestämma.` },
  { efter: 'Samtidigt växte institutioner fram för att skydda minoriteters rättigheter och säkerställa rättsstatens principer.', text:
`Utvidgningen av rösträtten skedde sällan frivilligt. Den drevs fram av arbetarrörelser, av kvinnor som organiserade sig under decennier och av människor som riskerade fängelse för sitt engagemang. Att beskriva utvecklingen som att rättigheter gradvis gavs döljer att de i regel krävdes.

I Sverige beslutades allmän och lika rösträtt 1918 och tillämpades första gången i valet 1921. Även då kvarstod undantag: den som hade skulder till fattigvården eller försatts i konkurs kunde uteslutas, och de sista sådana begränsningarna försvann först på 1940-talet.` },
  { efter: 'den påverkas ständigt av sociala, ekonomiska och teknologiska förändringar.', text:
`Historien går heller inte bara åt ett håll. Flera länder som varit demokratiska har blivit odemokratiska igen, ibland genom statskupp men oftare genom att en vald regering steg för steg avvecklat kontrollen av sin egen makt. Mellankrigstidens Europa är det mest kända exemplet, men det finns nyare. Att en demokrati en gång funnits är alltså ingen garanti för att den finns kvar.` },
],
};

// akgy-sol-003: byt de två styckena om solsystemets bildning, som överlappar
// med akgy-sol-001, mot innehåll om systemets yttre gräns.
const ERSATT = {
  'akgy-sol-003': [{
    fran: `Vårt eget solsystem bildades för ungefär 4,6 miljarder år sedan ur ett moln av gas och stoft. Molnet drogs samman av sin egen tyngdkraft, började rotera och plattades ut till en skiva. I mitten blev trycket så högt att solen tändes, och av det som blev kvar i skivan klumpade planeterna ihop sig.

Att skivan roterade förklarar varför planeterna än i dag går åt samma håll och nästan i samma plan. En modell duger inte bara om den stämmer med det man ser, utan ska också kunna förklara varför saker ser ut som de gör.`,
    till: `Var solsystemet slutar är inte självklart. Utanför Neptunus ligger Kuiperbältet med tusentals iskroppar, och långt därutanför antas ett klot av kometkärnor omge systemet på ett avstånd tusentals gånger större än jordens avstånd till solen.

Det var upptäckten av flera Pluto-liknande kroppar där ute som ledde till att Pluto 2006 omdefinierades och inte längre räknas som planet. Beslutet handlade inte om att något förändrats i rymden, utan om att en kategori som fungerat bra så länge man kände till nio kroppar slutade fungera när det visade sig finnas många fler.`,
  }],
};

const BAND = { 7: [500, 530], 8: [530, 570], 9: [570, 590], 10: [590, 625] };
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;

Object.entries(ERSATT).forEach(([id, byten]) => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error('Hittar inte ' + id); ok = false; return; }
  byten.forEach(b => {
    if (!t.text.includes(b.fran)) { console.error(`${id}: hittar inte texten som skulle bytas`); ok = false; return; }
    t.text = t.text.replace(b.fran, b.till);
  });
});

Object.entries(TILLAGG).forEach(([id, delar]) => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error('Hittar inte ' + id); ok = false; return; }
  delar.forEach(d => {
    if (!t.text.includes(d.efter)) { console.error(`${id}: hittar inte ankaret "${d.efter.slice(0, 40)}…"`); ok = false; return; }
    t.text = t.text.replace(d.efter, d.efter + '\n\n' + d.text);
  });
});

[...Object.keys(TILLAGG), ...Object.keys(ERSATT)].forEach(id => {
  const t = lib.find(x => x.id === id);
  if (!t) return;
  const n = t.text.trim().split(/\s+/).length;
  t.meta = { ...(t.meta || {}), wordCount: n };
  const b = BAND[t.grade];
  const inom = n >= b[0] && n <= b[1];
  if (!inom) ok = false;
  console.log(`${id.padEnd(16)} åk${String(t.grade).padEnd(3)} ${String(n).padStart(4)} ord ${inom ? '✅' : '❌ krav ' + b[0] + '–' + b[1]}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
if (!ok) process.exit(1);
