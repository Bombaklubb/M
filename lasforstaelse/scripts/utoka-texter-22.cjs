#!/usr/bin/env node
//
// Sats 22: de fyra sista texterna i åk 10 som låg under intervallet
// 590–625 ord. Därmed finns inga texter kvar i biblioteket som är mer
// än 25 procent kortare än sitt intervall.

const fs = require('fs');
const path = require('path');

const TILLAGG = {

'akgy-borg-001': [
  { fore: 'Borgs spelstil kännetecknades av', text:
`Tidpunkten var avgörande. Fram till 1968 fick bara amatörer spela i de största turneringarna, medan de som tog betalt var utestängda. När den så kallade öppna eran inleddes samma år öppnades tävlingarna för alla, och prispengarna började stiga snabbt. Borg kom in i sporten just när det blivit möjligt att försörja sig på den, och han hörde till den första generationen för vilken tennis var ett yrke redan från början.

Materialet förändrades under samma år. Racketar av trä ersattes av ramar i metall och senare grafit, som var lättare, styvare och gjorde det möjligt att slå både hårdare och med mer skruv. Många menar att den förändringen påverkade hur tennis spelas mer än någon enskild spelare gjort. Att Borg behärskade ett spelsätt som den nya utrustningen förstärkte är en del av förklaringen till hans genomslag.` },
  { fore: 'Utöver sina idrottsliga prestationer spelade Borg en central roll', text:
`Spelarna organiserade sig också. Under 1970-talet bildades intresseorganisationer som förhandlade om prispengar, turneringsscheman och rättigheter, och 1973 bojkottade ett stort antal spelare Wimbledon i en konflikt om en kollegas avstängning. Att aktiva idrottare gemensamt kunde ställa krav på arrangörerna var nytt, och det förändrade maktförhållandena i sporten på ett sätt som består.

Enskilda matcher blev dessutom händelser i sig. Finalen i Wimbledon 1980 mot John McEnroe innehöll ett tiebreak i fjärde set som pågick i över tjugo minuter och som fortfarande brukar räknas till sportens mest omtalade. Att en tennismatch kunde samla miljontals tv-tittare i länder utan egen tennistradition var en förhållandevis ny företeelse.` },
  { fore: 'Trots sin framgång valde Borg att avsluta sin karriär', text:
`Sporten spred sig också geografiskt. Under 1970- och 1980-talen växte tennisen snabbt i länder som tidigare knappt haft några spelare på internationell nivå, och antalet banor och klubbar ökade kraftigt i Europa. Sverige är ett tydligt exempel, men inte det enda.` },
],

'akgy-tema-001': [
  { fore: 'En viktig fråga handlar dock inte enbart om vilka arbeten som försvinner', text:
`Bilden av vilka yrken som är utsatta har dessutom vänts upp och ned. Länge antogs att automatisering främst skulle drabba manuellt och lågbetalt arbete. Flera studier de senaste åren pekar i stället ut yrken som bygger på att läsa, skriva och sammanställa text: administration, juridik, journalistik och delar av utbildningsväsendet. Det som är svårast att automatisera visar sig ofta vara arbete med händerna i en oförutsägbar miljö.` },
  { fore: 'Samtidigt finns etiska aspekter.', text:
`Effekterna syns samtidigt långsammare i ekonomin än debatten antyder. Historiskt har det tagit årtionden innan en ny teknik gett tydliga utslag i produktivitetsstatistiken, eftersom arbetssätt, utbildning och organisation måste hinna förändras. Elektrifieringen av fabrikerna gav till exempel liten effekt förrän byggnaderna ritades om efter vad elmotorer faktiskt möjliggjorde.` },
  { fore: 'Trots osäkerheten kring framtiden finns en bred enighet', text:
`En annan fråga är vem som får del av vinsterna. Om produktiviteten stiger kan resultatet bli kortare arbetstid, högre löner eller större vinster till ägarna, och vilket det blir avgörs inte av tekniken utan av förhandlingar, skatter och lagstiftning. Att en teknik är effektiv säger alltså ingenting om vem som får nytta av den. Den fördelningen har sett mycket olika ut vid olika teknikskiften.` },
],

'akgy-tema-002': [
  { fore: 'Miljöperspektivet spelar en central roll.', text:
`Storleksordningen är värd att nämna. Sedan omkring 2007 bor mer än hälften av världens befolkning i städer, och andelen väntas fortsätta stiga. Nästan hela den framtida urbaniseringen sker i Asien och Afrika, ofta i städer som växer snabbare än myndigheterna hinner planera för. En stor del av tillväxten sker därför i områden som byggts utan tillstånd och som saknar vatten, avlopp och adresser.` },
  { fore: 'Ett exempel är arbetet med inkluderande stadsplanering.', text:
`Också i Sverige har planeringsbeslut långa efterverkningar. Miljonprogrammet på 1960- och 1970-talen byggde snabbt bort en akut bostadsbrist, men områdena placerades ofta i stadens utkant med svag koppling till centrum. De besluten präglar än i dag hur segregationen ser ut, vilket illustrerar att stadsplanering är politik med mycket lång verkningstid.

Ett återkommande mönster är gentrifiering. När ett område rustas upp stiger hyrorna, och de som bott där längst har till slut inte råd att bo kvar. Förbättringen är verklig men kommer någon annan till del. Att höja ett områdes standard utan att driva ut dess invånare är en av stadsplaneringens svåraste uppgifter.` },
  { fore: 'Framtidens stad kommer sannolikt att präglas', text:
`Klimatet ställer dessutom nya krav på hur städer byggs. Hårdgjorda ytor gör att regnvatten inte kan tränga ner, vilket ger översvämningar vid skyfall, och asfalt och betong håller kvar värme så att en stad kan vara flera grader varmare än omgivningen. Träd, öppna dagvattenlösningar och ljusa ytor har därför gått från att vara utsmyckning till att vara teknisk infrastruktur.` },
],

'akgy-tema-003': [
  { fore: 'Ett paradigmskifte innebär inte att all tidigare kunskap förkastas.', text:
`Begreppet paradigm kommer från vetenskapsteoretikern Thomas Kuhn, som 1962 gav ut en bok om vetenskapliga revolutioners struktur. Hans tes var att vetenskap inte utvecklas jämnt utan i språng, med långa perioder av rutinarbete avbrutna av omvälvningar. Boken blev inflytelserik långt utanför sitt eget område, och ord som paradigmskifte används i dag om nästan vad som helst.

Kuhn har också kritiserats. En vanlig invändning är att hans beskrivning kan läsas som att en teori bara är sann inom sitt paradigm, alltså att det inte skulle gå att avgöra vilken av två teorier som är bättre. Kuhn själv avvisade den tolkningen. Frågan om hur mycket vetenskaplig kunskap som är beroende av sitt sammanhang diskuteras fortfarande.` },
  { fore: 'Moderna forskningsområden illustrerar denna dynamik.', text:
`Ett tydligt exempel på ett långsamt genombrott är teorin om kontinentaldrift. När den lades fram i början av 1900-talet avvisades den av de flesta geologer, eftersom ingen kunde förklara vad som skulle få kontinenter att röra sig. Först på 1960-talet, när mätningar av havsbottnen visade hur ny havsbotten bildas, accepterades den. Att teorin var riktig hela tiden hjälpte den alltså inte förrän mekanismen hittats.` },
  { fore: 'Vetenskapliga revolutioner framstår ofta som avgörande vändpunkter', text:
`Granskningen har dessutom sina egna svagheter. Under 2010-talet visade det sig att en stor andel publicerade studier inom vissa fält inte gick att upprepa när andra forskare försökte. Problemet har lett till nya rutiner, som att forskare registrerar sina hypoteser innan experimentet görs. Att vetenskapen kan upptäcka och rätta sina egna brister är samtidigt en del av poängen med den.` },
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
