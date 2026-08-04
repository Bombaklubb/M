#!/usr/bin/env node
//
// Sats 19: de fem hästtexterna i åk 6, som låg 40–53 % under intervallet
// 400–415 ord. Här läggs stycken till; grundtexten är oförändrad, och
// därför behåller texterna sina frågor.

const fs = require('fs');
const path = require('path');

const TILLAGG = {

'ak6-tema-026': [
  { fore: 'Hästar behöver också motion.', text:
`Hästens mage förklarar mycket av rutinerna. En häst är byggd för att äta små mängder nästan hela tiden, som den skulle ha gjort ute på en betesmark. Magsäcken är liten i förhållande till kroppen och klarar inte stora måltider. Därför fördelas fodret på flera tillfällen per dag, och en häst som står länge utan mat riskerar att få ont i magen.` },
  { fore: 'I stallet finns också regler för säkerhet.', text:
`Till de dagliga sysslorna hör också att mocka boxen, alltså att ta bort spillning och blöt strö. Det är tungt arbete som görs varje dag, året om. Många stall drivs som föreningar där medlemmarna turas om, och den som vill rida får ofta räkna med att arbeta i stallet också.` },
  { fore: 'Att ta hand om en häst kräver ansvar och kunskap.', text:
`Alla hästar står inte i box. I lösdrift går hästarna ute större delen av dygnet med tillgång till ett skydd, vilket ligger närmare deras naturliga liv. Boxar ger å andra sidan bättre möjlighet att hålla koll på varje enskild häst. Vilken lösning som är bäst diskuteras, och svaret beror ofta på den enskilda hästen och på stallets förutsättningar.` },
],

'ak6-tema-027': [
  { fore: 'Hästens rygg är också viktig,', text:
`En häst kan inte kräkas. Matsmältningen går bara åt ett håll, vilket gör att den inte kan göra sig av med något olämpligt den råkat äta. Det är en av anledningarna till att foder hanteras så noggrant i stall, och till att kolik, alltså ont i magen, är en av de vanligaste allvarliga åkommorna hos hästar.` },
  { fore: 'Hästar kommunicerar med kroppsspråk.', text:
`Hästar sover dessutom på ett ovanligt sätt. De kan låsa lederna i benen och sova stående, vilket gör att de snabbt kan fly om något händer. Djup sömn kräver däremot att de lägger sig ner, och det gör de bara korta stunder och helst när någon annan häst står vakt.` },
  { fore: 'Alla dessa egenskaper gör hästen', text:
`Trots den breda synen finns det två punkter där hästen inte ser något alls: rakt framför nosen och rakt bakom sig. Det förklarar varför man inte ska närma sig en häst bakifrån utan att först säga till, och varför en häst kan reagera starkt på något den plötsligt får syn på alldeles intill.

Vissa raser har fler gångarter än de tre vanliga. Islandshästen kan till exempel tölta, en jämn gångart där hästen alltid har minst en fot i marken, vilket gör ritten ovanligt mjuk.` },
],

'ak6-tema-028': [
  { fore: 'Färgen på hästar varierar också.', text:
`Raserna har uppstått genom avel, alltså genom att människor valt vilka hästar som ska få föl. Under lång tid avlades hästar för arbete: att dra plog, bära ryttare i strid eller transportera varor. När maskinerna tog över de uppgifterna började man i stället avla för sport och fritid, och det syns tydligt i dagens raser.

En vanlig indelning är kallblod och varmblod. Kallblodshästar är tyngre och lugnare och användes traditionellt till skogs- och jordbruksarbete. Varmblodshästar är lättare och snabbare och används mest inom ridsport. Indelningen har inget med kroppstemperatur att göra, utan är ett gammalt uttryck för temperament.` },
  { fore: 'I vissa delar av världen används hästar fortfarande i arbete,', text:
`I Sverige finns flera egna raser. Nordsvensk brukshäst och ardenner är kallblod som fortfarande används i skogen, och gotlandsrusset är en liten, härdig ponny som funnits på Gotland i århundraden. Att bevara sådana raser handlar delvis om kulturhistoria och delvis om att behålla genetisk variation.` },
  { fore: 'Oavsett typ eller ras behöver alla hästar', text:
`Avel väcker också kritik. När en viss kroppsform blir populär i tävlingssammanhang avlas den fram allt mer utpräglat, och hos vissa raser har det lett till problem med leder, andning eller fruktsamhet. Att välja efter utseende snarare än efter hälsa är ett problem som hästen delar med många andra husdjur.` },
],

'ak6-tema-029': [
  { fore: 'Det finns olika typer av ridning.', text:
`Hur en häst lär sig är värt att förstå. Den lär sig framför allt av att något obehagligt upphör: när ryttaren tar i tygeln och släpper efter i samma stund som hästen svarar rätt, förstår hästen vad som efterfrågades. Timing är därför viktigare än styrka. En signal som ges för sent säger ingenting, hur tydlig den än är.

Straff fungerar dåligt av samma skäl. En häst kopplar sällan ihop en tillsägelse med något som hände en stund tidigare, och en rädd häst lär sig långsammare än en lugn. Modern hästträning bygger därför mer på att belöna rätt svar än på att rätta fel.` },
  { fore: 'En tränare kan hjälpa till', text:
`Ryttarens vikt spelar också roll. En allmän tumregel är att ryttare och utrustning tillsammans inte bör väga mer än omkring en femtedel av hästens vikt, även om gränsen diskuteras och beror på hästens byggnad och kondition.` },
  { fore: 'Ridning kan vara både roligt och utmanande.', text:
`Tävling finns på alla nivåer. Lokala klubbtävlingar arrangeras för nybörjare med låga hinder och korta program, medan de högsta nivåerna kräver år av träning. Att det finns en väg uppåt i små steg är en av anledningarna till att många fortsätter länge.

Ridning är dessutom en av få sporter där kvinnor och män tävlar mot varandra på samma villkor, ända upp till olympisk nivå. I Sverige är samtidigt en stor majoritet av dem som rider flickor och kvinnor.` },
],

'ak6-tema-030': [
  { fore: 'Många människor känner en stark vänskap', text:
`Domesticeringen skedde för ungefär femtusen år sedan på stäpperna i nuvarande Ukraina och Kazakstan. Först användes hästar troligen för kött och mjölk, och först senare för att rida och dra. Att människor kunde förflytta sig snabbare än till fots förändrade nästan allt: handel, krigföring och hur långt idéer och sjukdomar kunde spridas.

Under årtusenden var hästen den snabbaste transport som fanns. Post, arméer och nyheter rörde sig i hästens tempo, och avstånd mättes i dagsritter. Först på 1800-talet, med järnvägen, och sedan med bilen förlorade hästen den rollen. Antalet hästar i Sverige minskade kraftigt under 1900-talets mitt.` },
  { fore: 'I dagens samhälle är djurens välfärd viktig.', text:
`Sedan dess har antalet stigit igen, men av helt andra skäl. I dag finns omkring trehundratusen hästar i Sverige, nästan uteslutande för sport och fritid. Hästnäringen sysselsätter många människor och är särskilt betydelsefull på landsbygden.` },
  { fore: 'Genom historien har hästar haft stor betydelse', text:
`Att hästar lever i flock i naturen får också konsekvenser för hur de mår i fångenskap. En häst som står ensam utan att se eller höra andra hästar blir stressad, och många beteenden som beskrivs som olydnad har sin grund i just det.

Att relationen är gammal betyder inte att den alltid varit god. Hästar har genom historien använts hårt i krig och arbete, ofta tills de inte orkade mer. Att djurens välfärd i dag betraktas som självklar är en ganska ny sak.` },
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
  const inom = n >= 400 && n <= 415;
  if (!inom) ok = false;
  console.log(`${id.padEnd(14)} ${String(n).padStart(4)} ord ${inom ? '✅' : '❌ krav 400–415'}  ${t.title}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
if (!ok) process.exit(1);
