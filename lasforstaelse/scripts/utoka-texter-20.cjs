#!/usr/bin/env node
//
// Sats 20: de tre hiphoptexterna i åk 10, som låg 33–44 % under intervallet
// 590–625 ord. Stycken läggs till; grundtexten och frågorna är oförändrade.

const fs = require('fs');
const path = require('path');

const TILLAGG = {

'akgy-tema-004': [
  { fore: 'Hiphop omfattar traditionellt fyra huvudelement:', text:
`Tekniken bakom var enkel men avgörande. Genom att ha två exemplar av samma skiva kunde en DJ växla mellan skivspelarna och spela om samma korta trumparti om och om igen, utan avbrott. Ett parti som varade tio sekunder på skivan kunde på så sätt förlängas i minuter. Skivspelaren blev därmed ett instrument i sig, och en teknik som utvecklades för att hålla dansgolvet i rörelse blev grunden för en hel musikform.

Varför just Bronx är ingen slump. Under 1950- och 1960-talen drogs en motorväg rakt genom stadsdelen, vilket rev tusentals bostäder och delade området i två. Under 1970-talet följde en våg av bränder i hyreshus, i flera fall anlagda av fastighetsägare som tjänade mer på försäkringen än på hyrorna. Hela kvarter stod tomma. Det var i den miljön kulturen växte fram.` },
  { fore: 'Under 1980-talet började hiphop spridas till andra delar av USA.', text:
`En del av rörelsen handlade också om att ersätta något. I området fanns sedan tidigare gäng och våld mellan kvarter, och flera av de organisationer som växte fram kring musiken arbetade medvetet för att kanalisera samma rivalitet till dans, musik och konst i stället. Till de fyra elementen brukar därför ett femte läggas: kunskap, i betydelsen medvetenhet om den egna historien och situationen.

Genombrottet utanför stadsdelen kom 1979 med Rapper's Delight, den första rapsingel som blev en kommersiell succé. Låten spelades in av en grupp som inte hörde till Bronxscenen, vilket väckte irritation hos dem som byggt upp kulturen. Att den som först tjänar pengar på en rörelse sällan är den som skapade den är ett mönster som återkommer i musikhistorien.` },
],

'akgy-tema-005': [
  { fore: 'Många forskare framhåller att musik kan fungera som en arena', text:
`Genombrottet brukar tidsättas till 1994, när gruppen The Latin Kings gav ut sin första skiva och rappade på svenska med tydlig förortsprägel. Några år senare fick artister som Petter stora framgångar, och därmed var det etablerat att svenska fungerade i genren. Innan dess hade engelska varit närmast självklar, delvis för att svenskan ansågs låta fel i rytmen.

Språket har sedan dess rört sig i båda riktningarna. Ord som hämtats från arabiska, turkiska, spanska och andra språk har via musiken spridits till ungdomsspråk i hela landet, och en del av dem finns i dag i ordböcker. Att ett uttryck som började i ett bostadsområde används av gymnasieelever i en annan del av Sverige är ett konkret exempel på hur kultur sprider sig underifrån.` },
  { fore: 'Digitaliseringen har också förändrat villkoren', text:
`Debatten har på senare år kretsat kring kopplingen till kriminalitet. Flera artister har dödats eller dömts för brott, och texter har använts som argument i den offentliga diskussionen om gängvåld. Forskare som studerat frågan brukar påpeka att orsakssambandet är svårt att fastställa: musiken skildrar en verklighet som fanns före musiken, och de områden där genren är starkast är också de där utsattheten är störst. Att musik skulle skapa våldet är därför en betydligt större slutsats än vad underlaget bär.

Samtidigt finns invändningen att skildring och förhärligande inte är samma sak, och att gränsen mellan dem kan vara svår att dra i en enskild text. Diskussionen liknar den som förts om film, dataspel och rockmusik under tidigare årtionden, vilket är värt att hålla i minnet när argumenten låter nya.` },
],

'akgy-tema-006': [
  { fore: 'Ett centralt kännetecken för hiphop är användningen av språk.', text:
`Några låtar brukar återkomma som exempel. The Message från 1982 beskrev livet i ett fattigt bostadsområde i en ton som var långt från festmusiken som dominerat genren dittills, och den brukar räknas som den låt som visade att rap kunde bära allvarliga ämnen. Under det sena 1980-talet drev grupper som Public Enemy frågan vidare med texter om rasism, polisvåld och medias bild av svarta amerikaner.

Samtidigt vore det missvisande att beskriva hela genren som protestmusik. En lika gammal tradition är skrytet, där artisten hävdar sin egen överlägsenhet i så påhittiga formuleringar som möjligt, och den så kallade battlen, där två rappare tävlar i att formulera sig bättre än motståndaren. Den traditionen handlar inte om samhället alls utan om språklig skicklighet i sig.` },
  { fore: 'I dagens medielandskap når hiphoppubliken', text:
`Att texter tolkas som utsagor om verkligheten har också fått rättsliga följder. I USA har raptexter använts som bevisning i brottmål, där åklagare läst upp rader som beskrivningar av vad den åtalade faktiskt gjort. Kritiker menar att ingen skulle föreslå detsamma om en deckarförfattare, och att metoden i praktiken drabbar en genre hårdare än andra. Flera delstater har efter debatten infört regler som begränsar användningen.

Hiphop har dessutom fått en plats i skolan och forskningen. Texter används för att undervisa om metaforer, rytm och argumentation, och i vissa länder har hela ämnesplaner byggts kring genren. Också detta har mött invändningar. En vanlig sådan är att en kultur som uppstod utanför institutionerna förlorar något när den flyttar in i dem, och att analysen riskerar att ta över från lyssnandet.` },
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
