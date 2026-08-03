#!/usr/bin/env node
//
// Skriver om distraktorer i frågor där det rätta svaret går att peka ut på
// längden.
//
// Problemet: i 527 frågor är facit minst 1,6× längre (eller kortare) än
// närmaste distraktor. Typfallet är ett beskrivande rätt svar mot enstaviga
// distraktorer – "En hundvalp och hennes dag" mot "En resa", "En skola",
// "En storm". Eleven kan peka ut svaret utan att läsa texten.
//
// Fixen är att ge distraktorerna samma detaljnivå som facit, inte att korta
// ned facit: den preciseringen är ofta just det som gör svaret rätt.
//
// Facittexten anges aldrig här – skriptet behåller den ordagrant och byter
// bara ut de tre felaktiga alternativen. Positionen roteras så att facit inte
// hamnar på samma plats varje gång.

const fs = require('fs');
const path = require('path');

// nyckel: "textId|frågenummer" → tre nya, felaktiga svarsalternativ
const NYA_DISTRAKTORER = {
  'ak1-tema-002|4': ['Recept på olika efterrätter', 'Kartor över gamla städer', 'Spel med tärningar och brickor'],
  'ak4-musik-06|3': ['Att läsa högt inför hela klassen', 'Att rita av en tavla mycket noga', 'Att sova en stund efter maten'],
  'gy-samhalle-03|3': ['Reklam som är tydligt märkt som betald', 'Videor inspelade med enkel utrustning', 'Höjdpunkter från andras semestrar'],
  'ak8-tema-005-c|3': ['Hur skolor i olika länder styrs', 'Hur vädret skiftar mellan årstider', 'Hur familjer bor i olika städer'],
  'ak7-tema-047|4': ['Brist på mat under vintern', 'Turismens ökning i området', 'Vädrets växlingar mellan åren'],
  'ak6-tema-028|2': ['En plats där hästar tävlar', 'En sadel av ett särskilt slag', 'En färg som pälsen kan ha'],
  'ak3-vetenskap-019|3': ['Bara träbiten och inget mer', 'Gemen och myntet tillsammans', 'Gemen, som hoppade upp direkt'],
  'ak3-tema-001|3': ['Blå eller ljusblå', 'Lila och mörklila', 'Svarta eller gråa'],
  'ak6-tema-030|3': ['En tävling mellan ryttare', 'En lek för nybörjare', 'En resa till en hästgård'],
  'ak1-natur-hund-001|6': ['En resa till ett annat land', 'En skola för små barn', 'En storm som drog förbi'],
  'ak4-001|5': ['Rädda och oroliga', 'Arga och besvikna', 'Ledsna och trötta'],
  'gy-vetenskap-01|3': ['Hypotes som ännu inte prövats', 'Medelvärde av alla mätningar', 'Placeboeffekt utan verkan'],
  'ak7-tema-033|5': ['Skolor för stadens barn', 'Kyrkor byggda av sten', 'Marknader utanför muren'],
  'ak7-tema-043|4': ['Bilar med stora motorer', 'Böcker från gamla tider', 'Kameror uppsatta på marken'],
  'ak7-teknik-02|2': ['Hur lång du är och vad du väger enligt profilen', 'Vilken favoritfärg du angett i inställningarna', 'Hur snabbt du springer och hur ofta du tränar'],
  'ak5-samhalle-04|6': ['Att bara vuxna bryr sig om beslut och att unga inte kan påverka', 'Att regler aldrig behövs så länge människor är överens', 'Att beslut inte går att ändra när de en gång är fattade'],
  'ak7-tema-032|6': ['Vädrets växlingar', 'Energi i naturen', 'Djur som lever i vatten'],
  'ak6-tema-029|6': ['Mycket pengar', 'Tur och slump', 'Fullständig tystnad'],
  'ak10-obama-001|3': ['Journalist och redaktör', 'Läkare och forskare', 'Ingenjör och uppfinnare'],
  'akgy-mj-003|6': ['Hans privatliv och relationer', 'Hans barndom i Indiana', 'Hans ekonomi och affärer'],
  'akgy-mj-004|6': ['Hans familj och uppväxt', 'Hans ekonomi och avtal', 'Hans utbildning och tidiga skolgång'],
  'ak7-tema-016|3': ['Endast skolarbetet och proven i skolan', 'Bara sociala medier och mobilanvändning', 'Enbart föräldrarnas krav och förväntningar'],
  'ak8-tema-020|3': ['Studier och läxor', 'Träning och sport', 'Familj och släkt'],
  'ak1-etik-06|5': ['Sömnig och trött', 'Arg och irriterad', 'Rädd och orolig'],
  'ak1-skola-104|5': ['Snabbt och häftigt', 'Högt och bullrigt', 'Argt och hårt'],
  'ak3-djur-011|3': ['En polis i närheten', 'En lärare från skolan', 'En kompis till Ture'],

  // ── Sats 2 ──
  'ak6-historia-03|1': ['En dikt från samma tidsperiod', 'En nyhetsapp i en surfplatta', 'En film om stadens historia'],
  'ak6-tema-028|6': ['Pengar och lyx', 'Kläder och skor', 'Bilar och vagnar'],
  'ak3-vetenskap-019|4': ['Det är för lätt för att kunna röra sig alls', 'Det är gjort av papper och inte av metall', 'Det är för varmt för att magneten ska verka'],
  'ak6-tema-027|1': ['Simma långt', 'Flyga högt', 'Gräva djupt'],
  'ak10-obama-002|4': ['Han var den yngsta presidenten någonsin', 'Han var den rikaste av alla presidenter', 'Han var militär innan han blev vald'],
  'ak4-tema-003|2': ['En sorts fisk som ofta läggs på ris', 'En kryddig sås som serveras till', 'En sorts ris som kokas långsamt'],
  'ak8-tema-005-c|4': ['Sport och träning', 'Transport och resor', 'Mat och matlagning'],
  'ak7-tema-018|1': ['Vid bordet i matsalen', 'Längst bak i klassrummet', 'Hemma i köket före skolan'],
  'ak7-tema-044|1': ['Bara till utbildning i skolan', 'Endast till tävlingar och priser', 'Endast till arbete och yrken'],
  'ak6-historia-12|6': ['Köpa så mycket som möjligt medan priserna är låga', 'Bara köpa varor som tillverkats i ett enda land', 'Aldrig köpa frukt och grönt under vinterhalvåret'],
  'ak5-miljo-04|6': ['Att man lika gärna kan kasta all mat som blir över', 'Att naturen inte klarar av att återvinna något alls', 'Att maskar är farliga och bör hållas borta från jorden'],
  'ak4-vetenskap-03|4': ['För att en boll alltid hamnar snett när den släpps i vatten', 'För att vatten dras till aluminium men stöter bort andra metaller', 'För att skålens form är snyggare och därför flyter bättre'],
  'gym-ai-skola-002|4': ['Att verktygen kräver internetuppkoppling och slutar fungera vid avbrott', 'Att lärare tvingas lära sig nya lösenord och system varje termin', 'Att alla inlämnade texter blir betydligt längre än de var förut'],
  'ak3-skola-013|1': ['En utflykt med klassen', 'En läxa till nästa dag', 'En dag med prov'],
  'ak6-tema-028|4': ['Laga mat till stallet', 'Frakta varor mellan gårdar', 'Bygga hus av trä'],
  'ak5-natur-01|6': ['Att hela förändringen sker på bara någon sekund', 'Att det bara är träden som påverkas av våren', 'Att skogen ser likadan ut året runt utan förändring'],
  'ak7-tema-045|1': ['Tävling och vinst', 'Pengar och gåvor', 'Regler och straff'],
  'ak1-miljo-04|2': ['Äta glass efter maten', 'Rita en sol på papper', 'Hoppa högt på gården'],
  'ak7-tema-047|2': ['Endast ljud och tjut', 'Färger på pälsen', 'Ljus från ögonen'],
  'ak5-etik-05|6': ['Vem av alla i klassen är egentligen bäst på det här?', 'När är nästa lov och hur långt är det dit?', 'Varför finns skolan och vem bestämde det?'],
  'ak1-natur-02|4': ['För att kunna sjunga på natten', 'För att kunna flyga i vinden', 'För att kunna leka med djuren'],
  'ak7-tema-027|6': ['Historiens gång', 'Miljöns tillstånd', 'Matens ursprung'],
  'ak7-tema-033|2': ['Stora skogar', 'Öppna fält', 'Djupa vikar'],
  'ak6-tema-026|6': ['Pengar och lyx', 'Mat och dryck', 'Sömn och vila'],
  'ak10-tema-004-b|2': ['Öppen kritik som uttalas rakt ut', 'Synliga konflikter mellan grupper', 'Frivilliga val som var och en gör'],
  'akgy-tema-007|1': ['Göteborg på västkusten', 'Uppsala norr om Stockholm', 'Malmö längst i söder'],
  'ak7-tema-017|3': ['Ett filter som gör bilder suddiga', 'En typ av reklam som visas mellan inläggen', 'Ett sätt att rensa bort skräppost'],
  'ak7-tema-044|3': ['Endast hur det ser ut i nutiden', 'Bara landets ekonomi och handel', 'Endast teknik och instrument'],
  'ak7-tema-001|3': ['Att tävlingen är alldeles för kort för alla deltagare', 'Att den saknar publik i salongen numera', 'Att den bara sänds i radio och inte i tv'],
  'gy-etik-05|6': ['Att etik bara har betydelse i situationer när man är rädd', 'Att panik gör att allt plötsligt blir tillåtet', 'Att etik i grunden är samma sak som stress'],
  'akgy-tema-006|1': ['Astronomi och rymden', 'Jordbruk och skördar', 'Geologi och bergarter'],
  'gym-berattelse-val-004|5': ['Att eleven ska skriva så kort det bara går och utelämna detaljer', 'Att eleven ska undvika att ta ställning i frågan alls', 'Att eleven ska försöka gissa vad läraren själv tycker'],
  'ak10-ai-003|3': ['Bibliotekssystem för utlåning', 'Skolundervisning på distans', 'Väderrapporter i mobilen'],
  'ak6-tema-002|5': ['Hon målade om hela datasalen tillsammans med klassen', 'Hon gav alla elever nya surfplattor direkt', 'Hon tog bort allas spelappar från plattorna'],
  'ak1-miljo-04|3': ['En ballong att blåsa upp', 'En cykel att låna ut', 'En hund som skäller'],
  'ak2-gpt-002|2': ['Kall läsk', 'Kall saft', 'Varm mjölk'],
  'ak3-tema-022|1': ['Gräddglass', 'Läskedryck', 'Knäckebröd'],
  'ak3-tema-024|4': ['Bakar kakor i fabrikens kök', 'Kör buss mellan fabrikerna', 'Designar loggor och etiketter'],
  'ak6-tema-029|2': ['Med mat och godsaker', 'Med färger och tyger', 'Med lampor och ljud'],
  'ak7-tema-020|3': ['Om vädret på något sätt kan vara rättvist mot alla', 'Om maten i skolan ska vara gratis för alla elever', 'Om det ska vara sommarlov i juni eller i augusti'],

  // ── Sats 3 ──
  'ak8-tema-003-b|1': ['Enbart till arbete och möten', 'Bara till studier och läxor', 'Endast till spel och nöje'],
  'ak5-miljo-04|5': ['För att göra komposten mindre och lättare att sköta', 'För att kunna sluta odla grönsaker helt', 'För att kunna skylla ifrån sig på någon annan'],
  'ak4-geo-vulkan-001|2': ['Högt uppe i molnen', 'Långt ute i havet', 'Inuti stora träd'],
  'ak10-arsenal-005|5': ['Vädret på matchdagen', 'Tiden matchen spelas', 'Domarens beslut'],
  'gym-stress-studievanor-005|6': ['All stress är skadlig och bör undvikas helt oavsett situation och sammanhang i livet', 'Stress löses bäst genom att alltid plugga ensam utan avbrott från andra', 'Stress spelar ingen roll så länge man har bra anteckningar att läsa'],
  'ak1-vinter-102|5': ['Målar över den med färg', 'Kastar bort den i soporna', 'Bygger om den från början'],
  'ak1-samhalle-07|4': ['Han får en ny leksak av mamma', 'Det finns ingen väg i närheten', 'Det är natt och alla sover'],
  'ak7-tema-017|2': ['Regeringens regler för vad som får visas', 'Journalisters beslut om vad som är viktigt', 'Ett slumpmässigt urval bland alla inlägg'],
  'ak2-tema-005|5': ['De ville inte ha burken kvar hemma hos sig', 'De var rädda för att få skäll av sina föräldrar', 'Burken var alldeles för tung att bära hem'],
  'ak2-tema-008|3': ['I en bäck vid vägen', 'Uppe på ett lågt tak', 'Mitt ute på vägen'],
  'ak6-tema-030|6': ['Bilar och vagnar', 'Kläder och skor', 'Pengar och guld'],
  'akgy-mj-005|6': ['Hans barndom i Gary, Indiana', 'Hans ekonomi och kontrakt', 'Hans utbildning och skola'],
  'akgy-tema-012|4': ['Om solen över huvud taget bör utforskas', 'Om planeter borde byta namn med tiden', 'Om månen skulle kunna flyttas närmare'],
  'ak10-rosa-001|2': ['Lagar om utbildning för alla barn', 'Lagar om vad bussresor fick kosta', 'Lagar om vem som fick rösta i val'],
  'ak8-tema-015|4': ['Om djur kan tänka på samma sätt som vi', 'Om tidsresor bakåt i tiden är möjliga', 'Om en människa kan leva helt utan sömn'],
  'gym-berattelse-val-004|1': ['Hon vill inte skriva om det valda ämnet över huvud taget alls', 'Hon saknar helt material att arbeta vidare med i uppgiften', 'Hon har glömt datorn hemma och kan därför inte börja'],
  'ak7-tema-025|2': ['En enda person bestämmer', 'Ingen alls får rösta', 'Endast ledare bestämmer'],
  'akgy-sol-003|6': ['Solsystemet är helt isolerat från allt', 'Endast jorden är viktig att studera', 'Universum är enkelt att förstå'],
  'ak3-tema-005|5': ['En fotboll till klassen', 'En bok om idrott', 'En medalj i guld'],
  'ak7-tema-018|2': ['Han ringde till sin kompis Amir sent', 'Han skrev ner allt i en dagbok', 'Han tittade på film hela kvällen'],
  'akgy-tema-012|5': ['Den saknar helt skadlig strålning på ytan', 'Den ligger närmare jorden än vad månen gör', 'Den har ungefär samma syrehalt som jorden'],
  'gy-uni-004|6': ['Hur snabbt appen laddar på äldre telefoner med svag uppkoppling', 'Hur ofta plattformen byter grafisk design och färger', 'Hur många uppdrag som finns tillgängliga i appen per dag'],
  'ak3-samhalle-009|4': ['Att laga din cykel om den går sönder', 'Att måla om huset där du bor', 'Att träna din hund på helgen'],
  'ak4-historia-03|1': ['För att äta lunch tillsammans', 'För att ha idrottslektion där', 'För att spela spel med klassen'],
  'ak1-etik-10|3': ['En bil som kör på vägen', 'En snögubbe med hatt', 'En fisk i en liten sjö'],
  'akgy-tema-002|4': ['De är alldeles för tekniska', 'De kostar alldeles för lite', 'De saknar deltagare helt'],
  'ak3-vanskap-001|4': ['Rädd och osäker', 'Arg och besviken', 'Uttråkad och trött'],
  'ak4-miljo-04|2': ['Lergods', 'Ullgarn', 'Trävirke'],
  'ak5-natur-02|2': ['Koksalt', 'Syrgas', 'Kalksten'],
  'ak8-tema-018|3': ['Stark vind', 'Kraftig snö', 'Mycket regn'],
  'akgy-tema-011|2': ['Byggde de första raketerna', 'Upptäckte dvärgplaneten Pluto', 'Landade först på månen'],
  'gym-stad-transport-003|3': ['Att alla borde välja exakt samma väg för att spara både tid och energi', 'Att geografi i skolan borde handla enbart om trafik och vägar', 'Att resor främst handlar om att memorera kartor utantill'],
  'ak6-tema-023|6': ['Att Elvis bara var känd för sin frisyr och sina kläder och inte alls för musiken', 'Att filmindustrin aldrig tjänade några pengar alls på musiken', 'Att populärkulturen inte har förändrats något sedan 1950-talet'],
  'ak8-tema-002-b|5': ['Lägre löner för alla arbetare', 'Fler fabriker i varje stad', 'Mindre utbildning för barn'],
  'ak3-vanskap-016|3': ['Ett äpple och en banan', 'En varm stickad mössa', 'En bok från biblioteket'],
  'ak9-gpt-004|4': ['Hen får ont i händerna av att sitta vid datorn', 'Hen råkar radera hela videon utan att märka det', 'Hen tycker inte om hur den egna rösten låter'],
  'ak5-tema-017|3': ['En hemlig extra nivå som är svår att hitta', 'En ny sorts handkontroll till konsolen', 'En sorts musik som spelas i bakgrunden'],
  'ak7-musik-05|4': ['För att han har fått nya skor och nya kläder till lektionen', 'För att läraren står bredvid och tittar på', 'För att han vill imponera på Yara i klassen'],
  'akgy-borg-003|1': ['Hans familjeliv efter karriären', 'Hans tränare under uppväxten', 'Enbart hans vinster på banan'],
  'ak6-historia-03|4': ['För att ingen längre kan läsa gamla kartor', 'För att papperet har gulnat med åren', 'För att floden inte finns med på kartan'],
  'gy-historia-04|3': ['Biobiljetter och tider för föreställningar', 'Recept på soppa och andra maträtter', 'Resultat från lokala fotbollsmatcher'],
  'ak1-tema-018|6': ['Ganska liten', 'Alldeles rund', 'Väldigt snabb'],
};

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let n = 0;
const problem = [];

lib.forEach(t => (t.questions || []).forEach((q, i) => {
  const nya = NYA_DISTRAKTORER[`${t.id}|${i + 1}`];
  if (!nya) return;

  if (nya.length !== 3) {
    problem.push(`${t.id} f${i + 1}: ${nya.length} distraktorer (ska vara 3)`);
    return;
  }
  const facit = q.options[q.correct];
  if (!facit) {
    problem.push(`${t.id} f${i + 1}: hittar inget facit`);
    return;
  }

  // Rotera facitpositionen så att den inte alltid hamnar likadant
  const pos = n % 4;
  const options = [...nya];
  options.splice(pos, 0, facit);

  q.options = options;
  q.correct = pos;
  n++;
}));

if (problem.length) {
  problem.forEach(p => console.error('FEL: ' + p));
  process.exit(1);
}

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
console.log(`Skrev om distraktorerna i ${n} frågor.`);
