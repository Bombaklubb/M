#!/usr/bin/env node
//
// Sats 3 av språkomskrivningarna: elva faktatexter i åk 4.
//
// Samma princip som satserna före. Ämne, årskurs, ordantal och frågor lämnas
// orörda – bara meningsbyggnaden ändras. Måttet som styr är medellängden per
// mening. LIX redovisas men får bara inte stiga, eftersom ämnesord som
// samhällsengagemang, världsmästerskapet och klimatförändringarna håller uppe
// det oavsett hur korta meningarna blir.
//
// Varje omskrivning kontrolleras mot frågorna. Se scripts/lib/fragestod.cjs.
//
// Kör med --dry för att se ändringarna utan att skriva.

const fs = require('fs');
const path = require('path');
const { saknade, lix, raknaOrd } = require('./lib/fragestod.cjs');

const BAND = { 4: [200, 220] };
const MAX_MENINGSLANGD = { 4: 14 };

const raknaMeningar = (s) => s.split(/[.!?]+/).filter((m) => m.trim().length > 0).length || 1;
const meningslangd = (s) => raknaOrd(s) / raknaMeningar(s);

const NYA = {
  'ak7-tema-005': `Förutom sin musik är Miley Cyrus känd för sitt samhällsengagemang. Hon har arbetat för att uppmärksamma hemlöshet bland unga. Hon har också arbetat för att stärka rättigheter för hbtq-personer. Genom intervjuer och sociala medier har hon försökt använda sin plattform för att sprida kunskap.

Hon har startat en stiftelse som samarbetar med olika organisationer. Målet är att ge stöd till unga människor som lever i utsatthet. Genom kampanjer och insamlingar har stiftelsen samlat in pengar. Pengarna går till projekt som erbjuder boende och rådgivning.

Att en känd artist engagerar sig i samhällsfrågor kan ha stor betydelse. Fans som ser upp till en idol kan inspireras att själva engagera sig. Samtidigt finns det de som menar att kändisar bör hålla sig till underhållning. Diskussionen handlar om vilken roll offentliga personer bör ha i politiska och sociala frågor.

Miley har argumenterat för att tystnad också är ett ställningstagande. Hon menar att den som har möjlighet att påverka bör använda sin röst.

Engagemanget har inte alltid varit okontroversiellt. Men det har bidragit till att bredda bilden av henne som artist. Hon framstår inte enbart som popstjärna utan också som aktiv medborgare.

Sammanfattningsvis visar Miley Cyrus hur kultur och samhälle kan samspela. En artist kan både underhålla och delta i viktiga diskussioner. Det gäller inte minst frågor om rättvisa och mänskliga rättigheter.`,

  'ak8-tema-001': `Michael Jackson föddes 1958 i Gary, Indiana, i USA. Redan som barn blev han känd genom gruppen The Jackson 5. Där sjöng han tillsammans med sina bröder. Gruppen fick flera stora hits under slutet av 1960-talet och början av 1970-talet.

Under 1980-talet inledde han en framgångsrik solokarriär. Albumet "Thriller" från 1982 blev det mest sålda albumet i världen. Musikvideorna till låtar som "Billie Jean" och "Beat It" visades flitigt på tv-kanalen MTV. De förändrade hur musik presenterades. Jackson kombinerade sång, dans och avancerad koreografi. Sättet påverkade många senare artister.

Hans dansstil, särskilt steget "moonwalk", blev världsberömd. Han var också känd för sina spektakulära konserter med stora scenshower. Samtidigt väckte hans privatliv stor uppmärksamhet i medierna. Rykten, rättsprocesser och hans förändrade utseende gjorde att han ofta var i centrum för debatt.

Michael Jackson engagerade sig även i välgörenhet. Han deltog i projekt som samlade in pengar till människor i nöd. Trots framgångarna mötte han kritik och kontroverser. Vissa anklagelser mot honom ledde till rättegångar, där han i ett fall frikändes.

När han dog 2009 skapade det stor sorg bland fans världen över. Hans musik fortsätter att spelas och diskuteras. I dag ses han som en av pophistoriens mest inflytelserika artister. Han ses också som en person vars liv präglades av motsättningar.`,

  'ak5-tema-021': `Englands rugbylandslag är ett av de mest kända lagen i världen inom rugby union. Rugby är en fysisk sport med två lag. Lagen försöker bära eller sparka en oval boll över motståndarnas mållinje för att göra poäng.

England spelar sina hemmamatcher på arenan Twickenham i London. Arenan rymmer över 80 000 åskådare. Den kallas ibland för "rugbyns hem". Där samlas fans från hela landet för att heja fram sitt lag.

En av Englands största framgångar kom år 2003. Då vann laget världsmästerskapet. Finalen spelades mot Australien och avgjordes i förlängning. Poängen kom genom en så kallad "drop goal". Segern gjorde spelarna till hjältar och ökade intresset för rugby i hela landet.

England deltar varje år i turneringen Six Nations tillsammans med fem andra länder. De är Frankrike, Irland, Italien, Skottland och Wales. Matcher mellan England och de andra brittiska lagen är ofta extra känsloladdade. Det finns nämligen en lång historia av rivalitet.

Laget består av spelare från olika klubbar runt om i England. Förbundskaptenen ansvarar för att ta ut truppen och planera taktiken. Spelarna tränar hårt för att orka hela matchen, som är 80 minuter lång.

Rugby är inte lika stort som fotboll i England. Ändå har landslaget en stark plats i landets idrottskultur. Många barn drömmer om att en dag bära den vita tröjan med den röda rosen.`,

  'ak6-tema-008': `I Sverige för drygt hundra år sedan var det vanligt att barn arbetade. Redan vid sju eller åtta års ålder kunde barn jobba i fabriker, på bondgårdar eller i gruvor. Dagarna var långa och arbetet tungt. Många barn fick aldrig gå i skolan.

I slutet av 1800-talet började folk reagera. Lärare, läkare och politiker argumenterade för att barn behövde utbildning och skydd. Steg för steg kom nya lagar. År 1882 blev det skolplikt i Sverige. Det innebar att alla barn hade rätt och skyldighet att gå i skolan. Senare skärptes reglerna för barnarbete ytterligare.

Idag är barnarbete förbjudet i Sverige. Barn får arbeta i begränsad utsträckning, till exempel med lättare sommarjobb efter att de fyllt tretton. Men arbetet får inte påverka deras hälsa eller skolgång.

I andra delar av världen ser verkligheten annorlunda ut. Enligt FN arbetar fortfarande ungefär 160 miljoner barn globalt. Många av dem arbetar under farliga förhållanden. Orsakerna är ofta fattigdom, brist på skolor och konflikter.

Organisationer arbetar för att minska barnarbete. De stödjer familjer ekonomiskt och bygger skolor. FN:s barnkonvention slår fast att alla barn har rätt till utbildning, lek och skydd mot utnyttjande.

Frågan om barnarbete handlar i grunden om vilka rättigheter barn ska ha. Den handlar också om vem som ansvarar för att rättigheterna uppfylls.`,

  'ak7-tema-003': `Miley Cyrus musikaliska karriär kännetecknas av tydliga stilförändringar. I början var hennes musik starkt kopplad till tv-serien Hannah Montana. Den riktade sig främst till en ung publik. Låtarna hade enkla budskap om vänskap och drömmar.

Efter att serien avslutats började hon experimentera mer. Albumet Bangerz innehöll influenser från hiphop och elektronisk pop. Texterna blev mer personliga. De handlade om relationer, självständighet och att bryta normer. För många fans blev det en överraskning.

Senare återvände hon delvis till sina rötter. Hon spelade in musik med tydligare inslag av rock och country. Variationen visar att hon inte vill låsa sig vid en enda genre. I intervjuer har hon sagt att musik ska spegla den person man är just då i livet.

Musikkritiker har haft delade åsikter om hennes förändringar. Vissa menar att hon är modig och kreativ. Andra tycker att stilbytena kan uppfattas som strategiska sätt att skapa uppmärksamhet. Det väcker en fråga. Hur mycket av en artists utveckling är konstnärlig, och hur mycket påverkas av marknaden?

Många framhåller att hennes sångteknik har utvecklats och blivit mer kraftfull med åren.

Miley Cyrus karriär illustrerar hur en artist kan förändras över tid utan att helt förlora sin publik. Genom att våga testa nya uttryck har hon fortsatt vara relevant i en bransch som ständigt förändras.`,

  'ak8-tema-013': `Skog täcker ungefär sjuttio procent av Sveriges yta. Men skogens betydelse går långt bortom det vi ser.

Träd binder koldioxid. Genom fotosyntesen tar de upp koldioxid från luften. De omvandlar den till syre och organiskt material. En vuxen gran kan binda hundratals kilo koldioxid under sin livstid. Det gör skogen till en av våra viktigaste kolsänkor. En kolsänka är en plats som lagrar kol och bromsar klimatförändringarna.

Skogen är också hem åt tusentals arter. I en svensk granskog lever hackspettar, ekorrar, svampar, lavar och insekter. Många av dessa arter är beroende av gammal skog med döda träd. Sådan skog kallas naturskog och har inte avverkats.

Men skogen används också som resurs. Sverige är ett av världens största exportländer av papper och trävaror. Skogsindustrin sysselsätter tiotusentals människor. Konflikten mellan att bruka och bevara skogen är en av vår tids stora frågor.

En del forskare menar att vi behöver mer skyddad skog. Bara så klarar vi klimatmålen och bevarar biologisk mångfald. Andra hävdar att hållbart skogsbruk kan kombinera produktion med naturvård. Då planterar man nya träd och avverkar med hänsyn.

Det som är tydligt är att skogen spelar en avgörande roll. Den renar luften vi andas, lagrar vatten, minskar erosion och erbjuder platser för rekreation. Att förstå skogen är att förstå sambanden mellan människa och natur.`,

  'ak7-tema-002': `Melodifestivalen består av flera deltävlingar innan finalen avgörs. Upplägget gör att både artister och publik får följa en längre process. Varje deltävling innehåller ett antal bidrag som framförs live inför publik. Efter varje program går några bidrag direkt till final. Andra får en ny chans genom ett uppsamlingsprogram.

Systemet med deltävlingar infördes för att skapa större spänning. Det ger också fler städer möjlighet att vara värdar. Det innebär att produktionen turnerar runt i landet. För artisterna kan det vara både en möjlighet och en utmaning. De måste prestera flera gånger under press. De måste också hantera både positiva och negativa reaktioner.

Röstningen sker genom publikröster och internationella jurys i finalen. Syftet är att hitta ett bidrag som fungerar både i Sverige och internationellt. Det kan dock uppstå diskussioner om balansen mellan folklig smak och expertbedömning.

Under repetitionerna arbetar tekniker, dansare, producenter och stylister intensivt. En artist som deltar är sällan ensam, utan omges av ett helt team. Tre minuter på scen kräver veckor av planering. Ljussättning, kameravinklar och koreografi måste samspela för att skapa en helhet.

Att ta sig till final är därför både en musikalisk och strategisk prestation. Det handlar inte bara om att ha en bra låt. Det handlar också om att nå fram till publiken och skapa ett minnesvärt framträdande.`,

  'ak7-tema-004': `Miley Cyrus karriär har inte bara handlat om musik. Den har också handlat om uppmärksammade kontroverser. När hon förändrade sin stil i början av 2010-talet diskuterades hennes scenframträdanden flitigt i medier världen över. Vissa ansåg att hon bröt mot förväntningarna på hur en tidigare barnstjärna borde uppträda.

Debatten handlade ofta om gränsen mellan konstnärlig frihet och ansvar. Kritiker menade att hennes framträdanden kunde påverka unga fans negativt. Andra försvarade henne. De betonade att hon som vuxen artist hade rätt att uttrycka sig fritt.

Kontroverserna visar hur starka normer som finns kring kön och kändisskap. Flera kommentatorer har påpekat att kvinnliga artister ofta granskas hårdare än manliga kollegor när de förändrar sin image. Därför blev diskussionen om Miley också en del av en större samhällsdebatt.

Samtidigt kan uppmärksamhet bidra till ökad synlighet, även när den är negativ. I en konkurrensutsatt musikbransch kan debatt göra att fler lyssnar av nyfikenhet.

Miley har själv sagt att hon ibland känt sig missförstådd. Hon har förklarat att hennes mål varit att visa olika sidor av sig själv. Målet var inte att provocera för sakens skull. Med tiden har delar av kritiken tonats ner, och fokus har återgått till hennes musik.

Fallet Miley Cyrus visar hur populärkultur och samhällsnormer hänger samman. En artists val kan bli startpunkten för bredare diskussioner om frihet, ansvar och identitet.`,

  'ak5-tema-022': `Att bli uttagen till Englands rugbylandslag är en dröm för många unga spelare. Resan börjar ofta i en lokal klubb. Där lär sig barn grunderna i spelet. De tränar passningar, tacklingar och hur man samarbetar som ett lag.

När spelarna blir äldre kan de få chansen att spela i större klubbar. I England finns en professionell liga där de bästa spelarna möts varje vecka. Förbundskaptenen följer matcherna noggrant. Målet är att hitta talanger som kan passa in i landslaget.

Det räcker inte att bara vara stark eller snabb. En landslagsspelare måste också förstå taktik och kunna fatta snabba beslut under press. Rugby är en kontaktsport, och därför krävs mod och disciplin. Spelarna måste följa reglerna noggrant för att undvika skador och straff.

Träningen inför internationella matcher är intensiv. Spelarna samlas under korta perioder och tränar flera gånger om dagen. De analyserar tidigare matcher. De diskuterar också hur motståndarna brukar spela.

Konkurrensen om platserna är hård, eftersom matchtruppen bara rymmer ett begränsat antal spelare. Det betyder att även duktiga spelare ibland måste vänta på sin chans.

Trots pressen beskriver många spelare känslan av att sjunga nationalsången inför en fullsatt arena. De kallar den något av det största i deras liv. Att representera sitt land innebär både ansvar och stolthet.`,

  'ak5-tema-023': `Genom åren har många skickliga spelare representerat Englands rugbylandslag. Vissa har blivit kända långt utanför rugbyns värld. En av de mest uppmärksammade spelarna var Jonny Wilkinson. Han sparkade den avgörande poängen i VM-finalen 2003.

Viktiga har också lagkaptenerna varit, som lett laget både på och utanför planen. En kapten ansvarar för att motivera sina lagkamrater. Kaptenen talar också med domaren under matchen. Det kräver både ledarskap och lugn.

I modern tid har laget haft spelare med olika bakgrunder och spelstilar. Vissa är starka forwards som arbetar hårt i närkamperna. Andra är snabba backar som gör försök genom att springa förbi motståndarna.

Många spelare engagerar sig också i samhället. De besöker skolor, deltar i välgörenhet och inspirerar unga att börja spela rugby. Flera berättar att de själva började spela tack vare en förebild de såg på tv.

Sedan 2010-talet har även damlandslaget fått mycket större uppmärksamhet. Fler matcher sänds på tv, och publiksiffrorna har ökat kraftigt.

Karriären i landslaget kan vara både kort och lång. Skador, form och konkurrens påverkar hur länge en spelare får vara kvar. Därför försöker många ta vara på varje chans de får att spela.

Trots att rugby är en tuff sport betonar många spelare vikten av respekt. De tackar alltid motståndarna efter matchen och följer sportens traditioner.`,

  'ak7-vetenskap-06': `Ett experiment är ett planerat test. Man ändrar en sak i taget och observerar vad som händer. Så tar man reda på hur något fungerar.

För att ett experiment ska ge ett meningsfullt svar behöver man tänka på variabler. En variabel är något som kan förändras. Den oberoende variabeln är det du ändrar medvetet, till exempel mängden ljus en växt får. Den beroende variabeln är det du mäter, till exempel hur mycket växten växer.

För att resultatet ska bli rättvist behöver man kontrollera andra variabler. Tänk dig att du jämför två växter. Du ger den ena mer ljus, men vattnar samtidigt den andra mer. Då kan du inte veta vad som påverkade resultatet. Därför gör man ofta en kontrollgrupp.

Ett annat viktigt begrepp är upprepning. Om du gör ett test en gång kan resultatet bero på slump. Om du upprepar experimentet flera gånger och får liknande resultat blir slutsatsen starkare.

Felkällor är saker som kan påverka resultatet utan att du tänkt på det. Att prata om felkällor är inte samma sak som att misslyckas. Tvärtom visar det att du förstår att verkligheten är komplicerad.

När du förstår vad ett experiment är kan du också bli bättre på att tolka påståenden i vardagen. Om någon säger att en produkt bevisat fungerar kan du fråga: Hur testades det? Fanns en kontrollgrupp?`,
};

// ─── Körning ────────────────────────────────────────────────────────────────

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let fel = 0;
const rader = [];

for (const [id, nyText] of Object.entries(NYA)) {
  const t = lib.find((x) => x.id === id);
  if (!t) {
    console.error(`${id}: finns inte i biblioteket`);
    fel++;
    continue;
  }
  const band = BAND[t.grade];
  if (!band) {
    console.error(`${id}: åk ${t.grade} saknar ordintervall i skriptet`);
    fel++;
    continue;
  }

  const ord = raknaOrd(nyText);
  if (ord < band[0] || ord > band[1]) {
    console.error(`${id}: ${ord} ord, utanför ${band[0]}–${band[1]}`);
    fel++;
  }

  const foreLangd = meningslangd(t.text);
  const efterLangd = meningslangd(nyText);
  if (efterLangd > MAX_MENINGSLANGD[t.grade]) {
    console.error(
      `${id}: ${efterLangd.toFixed(1)} ord/mening, taket för åk ${t.grade} är ${MAX_MENINGSLANGD[t.grade]}`
    );
    fel++;
  }
  if (efterLangd >= foreLangd) {
    console.error(`${id}: meningarna blev inte kortare (${foreLangd.toFixed(1)} → ${efterLangd.toFixed(1)})`);
    fel++;
  }

  const foreLix = lix(t.text);
  const efterLix = lix(nyText);
  if (efterLix > foreLix) {
    console.error(`${id}: LIX steg ${foreLix} → ${efterLix}`);
    fel++;
  }

  const tappade = saknade(t.text, nyText, t.questions);
  if (tappade.length) {
    console.error(`${id}: frågorna tappar underlag – saknade ord: ${tappade.join(', ')}`);
    fel++;
  }

  rader.push({ t, nyText, ord, foreLangd, efterLangd, foreLix, efterLix });
}

if (fel) {
  console.error(`\n${fel} problem – inget skrivet.`);
  process.exit(1);
}

console.log('id                 åk   ord   ord/mening      LIX');
for (const r of rader) {
  r.t.text = r.nyText;
  r.t.meta = { ...(r.t.meta || {}), wordCount: r.ord };
  console.log(
    `${r.t.id.padEnd(18)} ${String(r.t.grade).padStart(2)} ${String(r.ord).padStart(5)}   ` +
      `${r.foreLangd.toFixed(1).padStart(4)} → ${r.efterLangd.toFixed(1).padStart(4)}   ` +
      `${String(r.foreLix).padStart(3)} → ${String(r.efterLix).padStart(3)}`
  );
}

if (!dry) {
  fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
  console.log('\nSkrivet.');
} else {
  console.log('\n(dry run – inget skrivet)');
}
