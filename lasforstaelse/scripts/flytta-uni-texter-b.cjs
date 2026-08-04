#!/usr/bin/env node
//
// Del B: tre av de sex texter som låg på åk 6 flyttas till åk 10 och byggs
// ut till intervallet 590–625 ord.

const fs = require('fs');
const path = require('path');

const FLYTT = {

'gy-uni-002': { grade: 10, tillagg: [
  { fore: 'Motargumentet är att förtätning inte automatiskt', text:
`Sverige har prövat båda riktningarna. Miljonprogrammet under 1960- och 1970-talen byggde snabbt och glest, ofta i stadens utkant, medan planeringen sedan 1990-talet i hög grad handlat om att fylla i mellanrum i redan byggda områden. Skiftet var delvis ekonomiskt: att bygga där gator, ledningar och kollektivtrafik redan finns är billigare för en kommun än att dra ny infrastruktur till ett fält.` },
  { fore: 'En rimlig ståndpunkt är därför', text:
`En invändning som ofta kommer sent i processen gäller ljus och skugga. Ett hus som skuggar en innergård tar bort en resurs som inte syns i någon statistik men som märks varje dag för dem som bor där. Kommuner gör i dag solstudier, men de bedöms sällan mot lika tydliga krav som buller eller tillgänglighet, vilket gör att skuggan lätt blir det som får ge vika.

Det finns också en fråga om vem som hörs. Den som redan bor i ett område kan yttra sig i planprocessen, medan de som skulle kunna flytta dit inte finns någonstans att fråga. Systemet ger därför starkare röst åt bevarande än åt tillkommande bostäder, oavsett vad som vore bäst på sikt. Att beskriva det som en konflikt mellan generationer är en förenkling, men det finns ett mönster i vilka intressen som faktiskt får plats vid bordet och vilka som saknar en självklar företrädare.` },
]},

'gy-uni-003': { grade: 10, tillagg: [
  { fore: 'Funktionell mångfald handlar om skillnader', text:
`Ett konkret exempel är hur skogens tillstånd bedöms. Andelen skogsmark i Sverige har inte minskat, men sammansättningen har förändrats: äldre skog med död ved och flera trädslag har ersatts av yngre, jämnåriga bestånd. Räknar man hektar ser läget stabilt ut; räknar man livsmiljöer gör det inte det. Två sanna påståenden kan därmed peka åt motsatt håll.` },
  { fore: 'Att tala om biologisk mångfald utan att specificera', text:
`Ny teknik har ändrat vad som går att mäta. Genom att analysera dna-spår i vatten eller jord kan arter som aldrig observerats direkt påvisas, och automatiska ljudinspelningar kan följa fåglar och fladdermöss dygnet runt. Metoderna hittar mer än äldre inventeringar gjorde, vilket är en vinst men samtidigt ett problem: en uppgång i statistiken kan bero på bättre ögon snarare än på fler arter.

Slutligen finns en fråga om vad som ska bevaras och varför. Ett argument utgår från nytta: pollinering, rent vatten, virke. Ett annat utgår från att arter har ett värde oavsett om de är användbara för människan. De två utgångspunkterna leder oftast åt samma håll men inte alltid, och skillnaden märks tydligast när en art varken är vacker, nyttig eller nära utrotning, utan bara ovanlig.` },
]},

'gy-uni-004': { grade: 10, tillagg: [
  { fore: 'Förespråkare menar att plattformar sänker trösklar', text:
`Rättsläget har prövats i domstol på flera håll. Frågan har genomgående gällt om den som utför arbetet ska betraktas som uppdragstagare eller anställd, och domstolar har i flera länder kommit fram till att den faktiska styrningen väger tyngre än vad avtalet kallar relationen. Om plattformen bestämmer pris, fördelar uppdrag och kan stänga av någon som tackar nej för ofta liknar förhållandet en anställning, oavsett formulering.` },
  { fore: 'Reglering diskuteras ofta som antingen ett hot', text:
`Styrningen sker dessutom sällan genom order. Den sker genom vad som mäts och belönas: acceptansgrad, svarstid, betyg från kunder. En arbetsledare som säger till någon att skynda sig kan ifrågasättas, medan ett gränssnitt som visar en sjunkande siffra åstadkommer samma sak utan att någon uttalat kräver något. Att styrning flyttat från instruktioner till mätetal gör den svårare att både beskriva och överklaga.

En ofta förbisedd del gäller vad som händer vid ett fel. Blir man avstängd av ett automatiskt system finns sällan någon att ringa, och beslutet kan sakna motivering. För den som har uppdragen som huvudsaklig inkomst är en avstängning i praktiken en uppsägning, men utan de förfaranden som skulle gälla på en arbetsplats. EU har därför infört regler som kräver mänsklig prövning av sådana beslut, men hur de tillämpas i praktiken är ännu inte prövat i någon större omfattning, och det dröjer innan praxis finns.` },
]},
};

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;
Object.entries(FLYTT).forEach(([id, d]) => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error('Hittar inte ' + id); ok = false; return; }
  const foreG = t.grade;
  const foreN = t.text.trim().split(/\s+/).length;

  d.tillagg.forEach(a => {
    if (!t.text.includes(a.fore)) {
      console.error(`${id}: hittar inte ankaret "${a.fore.slice(0, 40)}…"`); ok = false; return;
    }
    t.text = t.text.replace(a.fore, a.text + '\n\n' + a.fore);
  });

  t.grade = d.grade;
  const n = t.text.trim().split(/\s+/).length;
  t.meta = { ...(t.meta || {}), wordCount: n };
  const inom = n >= 590 && n <= 625;
  if (!inom) ok = false;
  console.log(`${id.padEnd(14)} åk${foreG} → åk${d.grade}   ${String(foreN).padStart(4)} → ${String(n).padStart(4)} ord ${inom ? '✅' : '❌ krav 590–625'}  ${t.title.slice(0, 42)}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
if (!ok) process.exit(1);
