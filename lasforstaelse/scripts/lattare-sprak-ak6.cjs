#!/usr/bin/env node
//
// Sats 5, den sista: sex faktatexter i åk 6.
//
// Samma princip som satserna före. Ämne, årskurs, ordantal och frågor lämnas
// orörda – bara meningsbyggnaden ändras. Måttet som styr är medellängden per
// mening; LIX redovisas men får bara inte stiga.
//
// Varje omskrivning kontrolleras mot frågorna. Se scripts/lib/fragestod.cjs.
//
// Kör med --dry för att se ändringarna utan att skriva.

const fs = require('fs');
const path = require('path');
const { saknade, lix, raknaOrd } = require('./lib/fragestod.cjs');

const BAND = { 6: [400, 415] };
const MAX_MENINGSLANGD = { 6: 17 };

const raknaMeningar = (s) => s.split(/[.!?]+/).filter((m) => m.trim().length > 0).length || 1;
const meningslangd = (s) => raknaOrd(s) / raknaMeningar(s);

const NYA = {
  'ak9-tema-003': `I slutet av 1800-talet förändrades många svenska samhällen snabbt. Där det tidigare funnits små jordbruk och hantverk växte industrier fram: sågverk, textilfabriker och verkstäder. Ångmaskiner och senare elektricitet gjorde att arbetet kunde organiseras på nya sätt. Produktionen ökade och varor blev billigare. Fler människor flyttade till städerna för att få lön i stället för att leva på sin egen mark.

Men industrialiseringen hade en baksida. Arbetstiden kunde vara tolv timmar om dagen, sex dagar i veckan. Säkerheten var ofta låg. Obevakade remmar och maskiner kunde slita med sig kläder och hår. Barn arbetade eftersom familjens ekonomi krävde det. Kvinnor hade ofta lägre lön trots liknande arbetsuppgifter. Trångboddheten i städerna ökade när inflyttningen gick fortare än byggandet. I vissa kvarter delade flera familjer ett rum, och sjukdomar spreds lätt när rent vatten och avlopp saknades.

Samtidigt uppstod nya möjligheter till organisering. När många arbetade på samma plats blev det lättare att prata om gemensamma problem. Fackföreningar bildades för att förhandla om löner och arbetsvillkor. Strejker användes som ett sätt att sätta press på arbetsgivare. Men strejker kunde också mötas av polis, eller av att arbetsgivaren tog in strejkbrytare. Konflikter blev därför både ekonomiska och politiska.

En viktig förändring var att arbetarrörelsen började driva krav på reformer genom riksdagen och kommunerna. Krav på kortare arbetsdag, folkskola, bättre bostäder och allmän rösträtt växte fram. Vissa reformer kom stegvis: arbetarskyddslagar, regler kring barnarbete och senare socialförsäkringar. Men det var inte en rak väg framåt. Arbetsgivare kunde varna för att fabriker skulle flytta om kostnaderna ökade, och en del politiker såg facklig kamp som ett hot mot ordningen.

När man i dag pratar om industrialiseringen som en modernisering är det därför viktigt att se flera perspektiv. För en fabriksägare kunde det handla om investeringar, marknader och teknik. För en arbetare kunde samma period betyda slit och osäkerhet, men samtidigt en chans att påverka sin situation genom kollektiv handling. Historiker använder ofta källor som fabriksprotokoll, tidningsartiklar, brev och statistik för att förstå hur människor faktiskt levde.

Ett konkret spår finns kvar i landskapet. Många orter har fortfarande gatunamn efter bruket, arbetarbostäder i långa rader och en skorsten som står kvar sedan fabriken lades ner.

Texten visar att industrialiseringen inte bara var en teknisk förändring. Den var en samhällsomvandling där frågor om makt, rättigheter och livsvillkor blev centrala. Det är också en påminnelse om något annat. När ekonomin förändras snabbt behöver samhället ibland nya regler för att skydda dem som annars får bära en stor del av kostnaden.`,

  'ak10-tema-001': `I Harry Potter-böckerna är det lätt att fastna för dueller, magiska föremål och stora avslöjanden. Men en stor del av seriens spänning kommer från något mer igenkännligt: hur makt fungerar i vardagen. Hogwarts är inte bara en äventyrsplats. Det är också en institution med regler, rangordning och informella normer. Därför blir skolan en bra miljö för att undersöka hur människor anpassar sig när auktoritet känns både nödvändig och hotfull.

Ett tydligt exempel är hur "säkerhet" används som argument. När hotet från Voldemort växer blir det lättare att acceptera inskränkningar: fler kontroller, hårdare straff och misstänksamhet mot avvikare. Det är inte unikt för trollkarlsvärlden. I många samhällen legitimeras nya regler genom att de presenteras som skydd mot en yttre fiende. Problemet är att rädslan ofta sprider sig inåt. Plötsligt börjar människor leta efter skyldiga bland sina egna, och gränsen mellan försvar och förtryck suddas ut.

Dolores Umbridge fungerar som en symbol för den här typen av makt. Hon behöver inte kasta stora förbannelser för att förändra skolan. I stället styr hon genom formulär, dekret och straff som paketeras som "ordning". Hennes makt är byråkratisk. Den låter korrekt på papper, men blir brutal i praktiken. Hon får också människor att själva övervaka varandra. När elever rapporterar, viskar och gissar vem som är illojal skapas ett klimat där många lydigt följer regler de egentligen ogillar.

Samtidigt visar serien att motstånd inte alltid är dramatiskt. Det kan handla om att vägra spela med i ryktesspridning, att dela information ansvarsfullt, eller att organisera sig utan att förlora sin etik. Dumbledores armé blir intressant just för att gruppen tränar försvar. Men den tränar också ett slags civilkurage: att agera tillsammans när institutionen sviker.

Serien är dock inte en enkel lärobok om "onda" och "goda" makthavare. Många karaktärer samarbetar med fel personer av rädsla, bekvämlighet eller lojalitet. Andra tar risker men gör misstag. Det skapar en mer realistisk bild. I en pressad situation är det inte bara mod som avgör, utan även vilka informationskällor man litar på, vilka man vill skydda och vilka konsekvenser man är beredd att ta.

Också språket bär på makt. Ministeriets skrivelser låter sakliga och opersonliga, medan motståndet talar om enskilda människor. Skillnaden gör tydligt vem som räknar i antal och vem som räknar i namn.

Att läsa Harry Potter med fokus på makt gör därför berättelsen mindre sagolik och mer politiskt relevant. Magin blir inte huvudpoängen, utan ett verktyg som förstärker sådant som redan finns i mänskliga relationer: rädsla, kontroll, grupptillhörighet och möjligheten att säga nej.`,

  'ak7-miljo-01': `Många hör ordet “koldioxid” i nyheter, på sociala medier och i skolan. Men vad betyder det egentligen att koldioxid påverkar klimatet? För att förstå det kan du tänka på koldioxid som en del av ett stort kretslopp. Där flyttar naturen och människan hela tiden kol mellan luft, mark och hav.

Koldioxid (CO₂) finns naturligt i atmosfären. Växter tar upp koldioxid när de fotosyntetiserar och bygger upp sin kropp av kol. Koldioxid släpps ut igen när växter och djur andas, när organiskt material bryts ner och när det brinner. Under lång tid har naturens upptag och utsläpp varit ungefär i balans.

Problemet uppstår när människor snabbt tillför extra koldioxid. När vi bränner fossila bränslen som kol, olja och naturgas frigörs kol som varit lagrat i marken i miljontals år. Det är som att öppna ett gammalt bankkonto och plötsligt hälla ut allt innehåll i atmosfären. Även avskogning påverkar. Träd slutar då ta upp koldioxid, och ibland bränns eller ruttnar de dessutom, vilket släpper ut mer.

När halten växthusgaser ökar blir “växthuseffekten” starkare. Växthusgaser fungerar som ett slags filter. De släpper in solens energi men fångar upp en del av värmestrålningen som annars skulle lämna jorden. Det innebär inte att koldioxid är “giftig” i små mängder, utan att den förändrar energibalansen i klimatsystemet.

Haven tar upp en stor del av den extra koldioxiden. Det kan låta positivt, men det har en baksida. När koldioxid löses i vatten bildas kolsyra och havet blir surare. Det kallas havsförsurning och kan påverka organismer som bygger skal av kalk, till exempel vissa plankton och musslor. Om plankton påverkas kan det i sin tur påverka hela näringskedjor.

Klimatförändringar handlar inte bara om “varmare väder”. Ett varmare klimat kan också ge mer intensiva regn, längre perioder av torka, förändrade ekosystem och påverkan på jordbruk. Effekterna blir olika i olika delar av världen. Det gör frågan både naturvetenskaplig och samhällelig.

Vad kan man göra? Lösningar brukar delas in i att minska utsläpp och att öka upptag. Minskade utsläpp kan handla om energieffektivisering, förnybar energi, bättre kollektivtrafik och smartare konsumtion. Ökat upptag kan handla om att skydda skogar och våtmarker. Ingen enskild åtgärd räcker, men många åtgärder tillsammans kan göra stor skillnad.

När du lär dig om koldioxidens resa får du ett verktyg för att förstå debatter och nyheter. Det blir lättare att skilja på förenklade påståenden och mer genomtänkta förklaringar. Du ser också hur val i vardagen hänger ihop med något så stort som planetens klimat.`,

  'ak9-tema-004': `När forskaren Linh höll en föreläsning på gymnasiedagen började hon med en liknelse. Tänk att DNA är en lång text. Förr kunde vi mest läsa den. Nu kan vi ibland redigera. Hon syftade på CRISPR, en metod som gör det möjligt att klippa i arvsmassan på en bestämd plats. I naturen är CRISPR en del av bakteriers försvar mot virus. Forskare har anpassat systemet för att kunna styra klippet med en guide-sekvens.

I föreläsningen beskrev Linh två olika användningar. Den ena gäller somatisk genterapi, alltså ändringar i kroppsceller hos en person som redan lever. Målet kan vara att behandla en sjukdom, till exempel genom att reparera en mutation i blodceller. Om behandlingen fungerar påverkar den bara patienten, inte framtida barn. Den andra användningen gäller könsceller eller embryon, så kallad groddlinje-redigering. Då skulle förändringen kunna ärvas av kommande generationer.

Tekniskt sett är metoden inte magisk. Ett klipp kan följas av att cellen lagar DNA:t på olika sätt. Ibland blir resultatet exakt, ibland uppstår oönskade förändringar. Forskare pratar om off-target-effekter, alltså att CRISPR råkar klippa på liknande ställen i genomet. Det är en anledning till att säkerhet och noggranna tester är centrala innan metoden används brett.

De etiska frågorna är minst lika stora som de tekniska. Linh bad publiken tänka på skillnaden mellan att behandla en svår sjukdom och att förbättra egenskaper som längd eller intelligens. Vem skulle få tillgång till tekniken om den är dyr? Skulle det skapa ett samhälle där vissa kan köpa genetiska fördelar? Samtidigt finns argumentet att det kan vara oetiskt att inte använda en metod som kan minska lidande, om den blir tillräckligt säker.

Hon tog också upp hur beslut fattas. Forskning styrs av lagar, etikprövning och internationella rekommendationer. Men gränserna skiljer sig mellan länder. Det gör att det ibland uppstår etik-shopping, där aktörer söker sig till platser med svagare regler. Därför diskuterar många forskare behovet av gemensamma ramar och öppenhet.

Linh nämnde också att CRISPR redan används utanför sjukvården. I växtförädling kan metoden ge sorter som tål torka bättre. I laboratorier används den dagligen för att undersöka vad enskilda gener gör.

När frågestunden kom räckte en elev upp handen och frågade: Om vi kan redigera, vem bestämmer vad som räknas som normalt? Linh svarade att det är en demokratisk och filosofisk fråga, inte bara en medicinsk. Tekniken kan ge verktyg, men samhället måste avgöra hur de ska användas. CRISPR visar alltså både människans uppfinningsrikedom och hur viktigt det är att koppla vetenskap till ansvar.`,

  'ak10-tema-002': `Att översätta Harry Potter är mer än att byta ut ord från ett språk till ett annat. Översättning är alltid en form av tolkning. Översättaren måste välja vad som ska prioriteras: rytm, humor, tydlighet, kulturella associationer eller trohet mot originalets form. I en serie som bygger mycket av sin charm på ordlekar, namn och stilskillnader mellan olika miljöer blir dessa val extra synliga.

Namn är ett typiskt exempel. I originalet kan ett namn bära information om personens roll eller karaktär, ibland som en liten ledtråd. Om namnet låter "talande" på engelska men inte på svenska kan effekten försvinna. Då kan översättaren behålla originalet och låta läsaren missa nyansen. Alternativet är att skapa ett svenskt namn som ger en liknande signal. Båda alternativen har kostnader. Att behålla kan kännas främmande, och att anpassa kan kännas som att man förändrar författarens intention.

Humor och ton är ett annat område där översättningar kan bli olika. Ett skämt kan bygga på ljudlikhet eller dubbeltydighet. Om den språkliga mekanismen inte finns i målspråket måste man skapa en ny konstruktion som fyller samma funktion: att vara rolig, passa karaktären och inte bryta berättelsens stämning. Det betyder att en skicklig översättning ibland behöver vara kreativ och "otrogen" på ytan för att bli trogen på djupet.

Kulturella referenser påverkar också hur vi tolkar en scen. Skolsystem, högtider, matvanor och sociala koder kan kännas självklara för en brittisk läsare. För en svensk kan de kräva små förtydliganden. Om texten förklarar för mycket kan den tappa tempo. Om den förklarar för lite kan den bli otydlig. Översättaren måste därför bedöma vad läsaren sannolikt redan förstår.

När läsare jämför översättningar uppstår ofta debatter om vad som är "rätt". Men frågan är egentligen: rätt för vilket mål? För en läsare som vill studera originalets stil kan en mer ordagrann version vara bäst. För en läsare som vill få samma känsla som originalpubliken fick kan en mer anpassad version fungera bättre. Det är därför två bra översättningar kan se olika ut.

Tidspress påverkar också resultatet. När en bok ges ut i många länder får översättaren ibland bara några veckor på sig. Ändringar i senare delar kan då avslöja att ett tidigt namnval blev olyckligt.

Att analysera översättning kan göra dig mer medveten om språk i stort. Du ser hur ordval styr sympati, hur humor byggs upp och hur subtila signaler skapar förväntningar. På så sätt blir översättningen inte en "kopia", utan en ny version av texten som bär samma berättelse genom ett annat språks möjligheter och begränsningar.`,

  'ak9-tema-014': `I många kulturer har drömmar setts som mer än privata nattbilder. De har tolkats som varningar, råd eller budskap från gudar och förfäder. Det är lätt att avfärda detta som "gammalt tänk". Men drömmars betydelse handlade också om makt och samhällsordning. Vem fick tolka drömmen, och vilka beslut byggde man på den tolkningen?

I antikens Grekland fanns drömtempel där människor sov för att få en dröm som kunde tolkas som läkande eller vägledande. Drömmen blev en del av en ritual, och tolkningen gjordes ofta av personer med särskild status. I andra sammanhang kunde en härskares dröm användas som argument för krig eller för att stärka en ny lag. Om drömmen passade berättelsen blev den ett bevis. Om den inte passade kunde den tystas ner.

Även i nordisk folktro finns berättelser om drömmar som förutsäger olycka eller avslöjar hemligheter. Men det är intressant att drömmar i sagor ofta är tvetydiga. De säger sällan exakt vad som ska ske. I stället ger de symboler: en brinnande gård, en trasig ring, en båt utan åror. Symbolerna kräver tolkning, och tolkningen påverkas av det man redan tror.

På 1800- och 1900-talet förändras synen i takt med att psykologi och naturvetenskap växer. Drömmar börjar förklaras som uttryck för minnen, önskningar och konflikter. Samtidigt lever äldre tolkningar kvar i populärkultur. Många horoskop och drömlexikon ger fasta betydelser: "tänder betyder oro" eller "vatten betyder känslor". Sådana listor kan kännas trygga. Men de kan också förenkla något som egentligen är personligt och varierar mellan individer.

Klassens historielärare, Anders, låter eleverna göra en övning. De får läsa två olika texter om samma dröm. Den ena är en religiös tolkning där drömmen ses som en kallelse. Den andra är en psykologisk där drömmen ses som stressbearbetning. Sedan får de diskutera vad som händer med samhället om en tolkning får monopol. Vems röst hörs, och vem tystnar?

En elev frågade vem som bestämmer vilken tolkning som räknas i dag. Anders svarade att frågan aldrig försvinner, den byter bara adress. Förr låg tolkningsrätten hos präster och siare. I dag ligger den hos forskare, terapeuter och appar som lovar att analysera din sömn.

Övningen får flera att inse att drömmar kan fungera som spegel för sin tid. När människor saknar kontroll kan drömmar bli ett språk för oro. När någon vill styra andra kan drömmar bli ett verktyg för att skapa lydnad. Drömmar är alltså inte bara en privat nattfilm. De kan också vara en del av berättelser som formar beslut, identiteter och makt.`,
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
