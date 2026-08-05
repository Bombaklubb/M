#!/usr/bin/env node
//
// Del C: åtta åk 2-texter till, 112–119 ord ned till intervallet 65–90.

const fs = require('fs');
const path = require('path');

const NYA = {

'ak3-tema-023': `För att göra Marabous choklad börjar allt med kakaobönor. De växer på träd i varma länder nära ekvatorn. Bönder plockar bönorna och låter dem torka i solen. Sedan skickas de med båt till fabriker i andra länder.

När bönorna kommer fram rostas de så att smaken blir starkare. Efter rostningen mals de till en massa. I massan blandas socker och ibland mjölkpulver.

Därefter hälls chokladen i formar. Formarna kyls så att chokladen stelnar. Till sist packas plattorna och skickas till affärer.`,

'ak4-halsa-cykel-001': `Att cykla är roligt och bra motion. Många barn cyklar till skolan eller till sina vänner. För att cykla säkert är det viktigt att använda hjälm. Hjälmen skyddar huvudet om man ramlar.

Om det är mörkt ute ska cykeln ha lampor och reflexer så att andra ser dig.

I trafiken måste man följa regler. Man ska stanna vid rött ljus och visa med handen om man ska svänga. Det är bra att hålla uppsikt och inte använda mobilen när man cyklar.`,

'ak4-geo-vulkan-001': `En vulkan är ett berg som kan få utbrott. Djupt nere i jorden finns het magma. När trycket blir för stort pressas magman upp genom vulkanen. När den kommer upp på marken kallas den lava.

Ett vulkanutbrott kan vara farligt. Lava är mycket varm och kan förstöra hus och vägar. Det kan också komma aska som sprids i luften.

När lavan svalnar blir den hård sten.

Forskare studerar vulkaner för att förstå när de kan få utbrott. På så sätt kan man varna människor i tid.`,

'ak4-tema-007': `Spanien ligger i sydvästra Europa. Landet har kust mot både Medelhavet och Atlanten. Huvudstaden heter Madrid.

Många turister besöker Spanien för det varma klimatet. På sommaren är det ofta soligt och varmt. Det finns långa stränder där människor badar.

Spanien är också känt för sina traditioner. En känd dans heter flamenco. Den dansas med starka känslor och snabb musik.

Maten är varierad. En känd rätt är paella som lagas med ris. Många äter också tapas, som är små rätter man delar.`,

'ak1-tema-014': `I garaget hittar Theo en stor pappkartong. "Den här kan bli vad som helst!" säger han. Han drar ut den på gräset.

Först blir den en båt. Theo kliver i och låtsas ro med en pinne.

Kompisen Li kommer springande. "Jag seglar till en ö", säger Theo. Li kliver också i. De låtsas att gräset är hav och att maskrosorna är fiskar.

Sedan vänder de på lådan och den blir ett hus. De sitter under den och äter äpple.

"Det här är det bästa huset", säger Li.`,

'ak2-tema-006': `Enhörningar är magiska djur som finns i sagor. De liknar hästar men har ett långt horn i pannan.

I en liten by bodde barnet Alva som älskade sagor om enhörningar. Varje kväll tittade hon ut mot skogen och hoppades få se en.

En morgon såg Alva något vitt mellan träden. Det rörde sig tyst och försiktigt. Hon vågade gå närmare och såg en enhörning med silverglänsande man. Den drack vatten ur bäcken.

Sedan sprang den in bland träden igen. Alva log och visste att hon aldrig skulle glömma den stunden.`,

'ak2-tema-008': `En liten enhörning bodde nära en by där många barn lekte. Den hette Orion och var nyfiken på människorna.

En dag tappade barnet Leila sin röda boll i en buske med taggar. Hon vågade inte ta tillbaka den. Orion såg vad som hände. Med sitt horn lyfte han försiktigt bort grenarna så att bollen blev fri. Leila blev förvånad men också glad.

Orion sprang snabbt tillbaka mot ängen. Leila berättade för sina vänner om den snälla enhörningen, och många började hålla utkik efter glittrande spår på marken.`,

'ak3-tema-006': `En måndag efter skolan stannade Amina vid cykelstället för att hämta sin cykel. Men platsen var tom.

Amina kände hur magen knöt sig. Hon tittade runt och såg ett trasigt lås på marken.

Vaktmästaren Rune sa att flera cyklar hade försvunnit. Han skrev ner färg och märke på cykeln och ringde Aminas mamma. Amina fick låna skolans reservcykel för att ta sig hem.

På kvällen gjorde Amina och hennes mamma en polisanmälan. Dagen efter satt en lapp på skolans dörr: "Kom ihåg att låsa cykeln med två lås."`,
};

const NYCKELORD = {
  'ak3-tema-023': ['varma länder nära ekvatorn', 'torka i solen', 'smaken blir starkare', 'stelnar', 'med båt', 'socker och ibland mjölkpulver'],
  'ak4-halsa-cykel-001': ['skyddar huvudet', 'lampor och reflexer', 'stanna vid rött ljus', 'mobilen', 'roligt och bra motion'],
  'ak4-geo-vulkan-001': ['kallas den lava', 'Djupt nere i jorden', 'aska', 'varna människor i tid', 'hård sten'],
  'ak4-tema-007': ['Madrid', 'varma klimatet', 'flamenco', 'paella', 'Medelhavet och Atlanten'],
  'ak1-tema-014': ['I garaget', 'blir den en båt', 'maskrosorna är fiskar', 'äter äpple', 'vad som helst', 'bästa huset'],
  'ak2-tema-006': ['långt horn i pannan', 'liten by', 'mellan träden', 'drack vatten', 'tyst och försiktigt', 'Alva log'],
  'ak2-tema-008': ['Orion', 'röda boll', 'buske med taggar', 'lyfte han försiktigt bort grenarna', 'mot ängen', 'glittrande spår'],
  'ak3-tema-006': ['platsen var tom', 'trasigt lås på marken', 'färg och märke', 'reservcykel', 'två lås', 'polisanmälan'],
};

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;
Object.entries(NYA).forEach(([id, text]) => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error('Hittar inte ' + id); ok = false; return; }

  const saknas = (NYCKELORD[id] || []).filter(o => !text.toLowerCase().includes(o.toLowerCase()));
  if (saknas.length) {
    console.error(`${id}: nyckelord borta ur texten – ${saknas.join(', ')}`);
    ok = false; return;
  }

  const fore = t.text.trim().split(/\s+/).length;
  t.text = text;
  const n = text.trim().split(/\s+/).length;
  t.meta = { ...(t.meta || {}), wordCount: n };
  const inom = n >= 65 && n <= 90;
  if (!inom) ok = false;
  console.log(`${id.padEnd(22)} ${String(fore).padStart(4)} → ${String(n).padStart(3)} ord ${inom ? '✅' : '❌ krav 65–90'}  ${t.title}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
if (!ok) process.exit(1);
