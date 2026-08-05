#!/usr/bin/env node
//
// De tjugotvå åk 5-texter som låg 4–25 ord över intervallet 300–320.
// En mening eller ett stycke stryks i varje; ingenting skrivs om i sak.
//
// Här rättas också ett skrivfel i ak8-tema-007, där samma slangord stod
// två gånger i samma uppräkning ("gansen" eller "gansen").
//
// Kör med --dry för att bara se ordräkningen utan att skriva.

const fs = require('fs');
const path = require('path');

const BAND = { 1:[40,60], 2:[65,90], 3:[150,165], 4:[200,220], 5:[300,320],
               6:[400,415], 7:[500,530], 8:[530,570], 9:[570,590], 10:[590,625] };

const STRYK = {
  'ak7-tema-006':    [' Vildbin är ofta extra viktiga eftersom flera arter kan flyga i kyligare väder än honungsbin.',
                      ' Det kan handla om att låta en del av gräset växa längre så att blommor hinner slå ut och frön utvecklas.'],
  'ak8-tema-006':    ['Mötet hölls i ett klassrum efter skolan. I början satt grupperna på var sin sida av rummet. ',
                      ' Det innehöll en gemensam överenskommelse som var tydlig men inte så sträng att den kändes som ett straff.'],
  'ak4-teknik-05':   ['\n\nInternet kan gå via kablar under marken, genom fiber, eller via trådlösa signaler som wifi. Även om wifi känns "luftigt" är det ofta kablar som gör den längsta resan, till exempel kablar som går under havet mellan länder.'],
  'ak9-tema-018':    [' I vissa fall sker arbetet i välkontrollerade fabriker, i andra fall genom underleverantörer där insynen är sämre.',
                      ' Dessutom säljs lyxprodukter ofta globalt, vilket innebär transporter och butiksmiljöer som kräver energi.'],
  'ak9-tema-020':    [' Han sa att vissa köper fejk för att de gillar stilen men inte priset.',
                      ' Leo tyckte att det kan göra att företaget satsar ännu mer på tydliga butiker och certifierade återförsäljare.'],
  'ak6-tema-014':    [' En annan gång hjälpte de en familj som hade förlorat mycket i en brand. Ingen i gruppen tjänade pengar på det.'],
  'ak6-historia-03': ['Kartan var gulnad i kanterna och hade ett handskrivet utseende. ',
                      ' De fick en modern karta också och skulle jämföra.',
                      'De följde spåret en bit. '],
  'ak7-tema-015':    [' Det kan också bli konflikter när någon kopplar serien till sin identitet och tar kritik personligt.',
                      ' En bok kan betyda mycket och samtidigt gå att prata om på ett nyanserat sätt.'],
  'ak5-miljo-04':    ['De gjorde en affisch med rubriken "Kompostens hemliga liv". De ritade maskar, skrev regler och förklarade att komposten hjälper odlingslådorna. '],
  'ak7-tema-008':    [' Men guiden betonade också att Visby inte bara var en "hanse-stad". Gotländska bönder och hantverkare spelade stor roll, och ibland uppstod konflikter om vem som skulle bestämma över tullar och regler.'],
  'ak6-tema-003':    [' Hon kan läsa lite, vilket inte alla kan, och faster säger att det är en fördel när man ska hålla koll på beställningar.'],
  'ak5-teknik-03':   [' Om en sida inte laddar kan du testa att byta nät, starta om routern eller vänta och prova igen.'],
  'ak6-tema-019':    [' På sommaren finns konserter, marknader och evenemang som lockar både lokalbor och turister.'],
  'ak6-tema-005':    ['När de går förbi hamnen ser Leo båtar som fyller sina tankar. '],
  'ak6-musik-05':    ['Det är också vanligt att öronmaskar försvinner av sig själva. '],
  'ak6-tema-012':    [' Samira tittar ner på planen igen och försöker följa spelarnas rörelser.'],
  'ak6-tema-013':    [' Många går vidare till andra lag eller väljer något helt annat.'],
  'ak6-tema-018':    [' Andra jobbar med hantverk, som att bygga båtar eller göra saker av trä och ull.'],
  'ak6-tema-002':    [' När allt var klart fick eleverna prata om vad de hade lärt sig.'],
  'ak6-tema-004':    [' För vissa känns det ovant i början, men många märker att de somnar snabbare efter några dagar.'],
  'ak8-tema-007':    [' Slang sprids ofta snabbt genom sociala medier, men kan också försvinna lika fort.'],
  'ak9-tema-019':    [' En elev sa att Armani känns vuxet och därför säkert.'],
};

const ERSATT = {
  'ak8-tema-007': [{ fran: 'Ord som "gansen" eller "gansen" kan betyda', till: 'Ord som "gansen" kan betyda' }],
  'ak9-tema-019': [{ fran: 'En annan tyckte att det är smart', till: 'En elev tyckte att det är smart' }],
};

const NYCKELORD = {
  'ak7-tema-006':    ['många sorters växter på liten yta', 'pollen flyttas', 'packas hårt', 'täta kronblad', 'boplatser, mat, vatten', 'staden som ett ekosystem'],
  'ak8-tema-006':    ['lämnas in vid skoldagens början', 'straffa alla för att några', 'lista konkreta problem', 'aldrig filma utan lov', 'försök under våren', 'pratade förbi varandra'],
  'ak4-teknik-05':   ['En server är en kraftig dator', 'små paket', 'protokoll', 'väg med för mycket trafik', 'IP-adresser är svåra att komma ihåg', 'video kan behöva pausa'],
  'ak9-tema-018':    ['hela livscykler', 'spårbarhet', 'kavaj i ull', 'nya kollektioner och trender', 'låga löner och otrygga kontrakt', 'välja second hand'],
  'ak9-tema-020':    ['material, arbete, varumärke eller allt samtidigt', 'varumärkesvärde', 'dåliga arbetsvillkor', 'inget enskilt tecken räcker alltid', 'förlora kontroll över sitt rykte', 'etik, konsumtion och identitet'],
  'ak6-tema-014':    ['inte håna spelare som person', 'nya målburar', 'flera vägar mot samma mål', 'tolka den olika', 'syndabock', 'gemenskap, respekt'],
  'ak6-historia-03': ['karta från slutet av 1800-talet', 'Lindgården', 'Parisa', 'Det är bara annorlunda', 'många fötter hade gått samma väg', 'läsa deras spår'],
  'ak7-tema-015':    ['mindre ensam med sina intressen', 'lyssnar på ljudbok', 'blir diskussioner till tävlingar', 'stängda dörrar', 'välgörenhet', 'källkritik'],
  'ak5-miljo-04':    ['bygga en liten kompost', 'torra löv i botten', 'plastbit', 'Då kommer luft in', 'berätta för klassen varför det är viktigt', 'verkar litet och lite äckligt'],
  'ak7-tema-008':    ['pälsar, vax, fisk, tyg och salt', 'Hansan', 'utan att fraktas långt in i landet', 'skriven långt senare', 'närhet inte alltid betyder sanning', 'spår och tolkning'],
  'ak6-tema-003':    ['1600-talet', 'tyg och tråd', 'indelt soldat', 'Trähusen kan börja brinna', 'skatter och soldater', 'vanlig dag med arbete'],
  'ak5-teknik-03':   ['En server är en kraftfull dator', 'telefonbok', 'Fiberkablar', 'små paket av data', 'paket kan ta olika vägar', 'många smarta steg som samarbetar'],
  'ak6-tema-019':    ['svenska det språk som används i skolan', 'Dialekter kan skilja sig', 'tv, spel och sociala medier', 'projekt om identitet', 'känna sig hemma', 'rättighet och en levande del'],
  'ak6-tema-005':    ['cisterner', 'fler turister', 'tar bort saltet ur havsvatten', 'solpaneler', 'salta restvattnet', 'inte finns en perfekt lösning'],
  'ak6-musik-05':    ['öronmask', 'tydligt mönster som är lätt att minnas', 'lyssna klart på hela låten', 'bara en kort bit', 'hjärnan börja vandra', 'letar mönster'],
  'ak6-tema-012':    ['slippa stress', 'häfte med fakta', 'press', 'dela en upplevelse med andra', 'utan att göra någon stor grej av det', 'lära sig mer om taktik'],
  'ak6-tema-013':    ['lång utbildning för unga spelare', 'spelförståelse', 'vila, mat och skola', 'hur mycket de pratade om beslut', 'hantera nervositet', 'steg för steg'],
  'ak6-tema-018':    ['sjöfart, turism och småföretag', 'navigerar, sköter maskiner', 'äppelmust', 'Transporter kan bli dyrare', 'hörselhjälpmedel', 'nät av trådar'],
  'ak6-tema-002':    ['bokstäverna var lite felstavade', 'måste klicka snabbt', 'håller fingret på länken', 'prova det överallt', 'stängde av en inställning', 'stolt över att klassen hade stoppat det'],
  'ak6-tema-004':    ['melatonin', 'kroppen tror att det fortfarande är dag', 'lägga mobilen utanför sängen', 'borsta tänderna och läsa några sidor', 'glömmer vad läraren nyss sa', 'ge hjärnan en chans'],
  'ak8-tema-007':    ['anpassas efter hur människor lever', 'Mejl, surfa, blogg och podcast', 'podd', 'tillhörighet eller markera identitet', 'telefonkatalog', 'utan att värdera dem'],
  'ak9-tema-019':    ['ser de kläderna i filmer', 'hamnar i skandal', 'igenkännligt utan att skrika', 'sällan fabriker, transporter', 'kopplad till kontroll', 'väljer budskapet själva'],
};

const dry = process.argv.includes('--dry');
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;
Object.keys(STRYK).forEach(id => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error('Hittar inte ' + id); ok = false; return; }
  const fore = t.text.trim().split(/\s+/).length;

  STRYK[id].forEach(s => {
    if (!t.text.includes(s)) { console.error(`${id}: hittar inte "${s.trim().slice(0, 45)}…"`); ok = false; return; }
    t.text = t.text.replace(s, '');
  });
  (ERSATT[id] || []).forEach(e => {
    if (!t.text.includes(e.fran)) { console.error(`${id}: hittar inte "${e.fran.slice(0, 45)}…"`); ok = false; return; }
    t.text = t.text.replace(e.fran, e.till);
  });

  const saknas = (NYCKELORD[id] || []).filter(o => !t.text.toLowerCase().includes(o.toLowerCase()));
  if (saknas.length) { console.error(`${id}: nyckelord borta – ${saknas.join(', ')}`); ok = false; return; }

  const [min, max] = BAND[t.grade];
  const n = t.text.trim().split(/\s+/).length;
  t.meta = { ...(t.meta || {}), wordCount: n };
  const inom = n >= min && n <= max;
  if (!inom) ok = false;
  console.log(`${id.padEnd(18)} åk${String(t.grade).padStart(2)}  ${String(fore).padStart(3)} → ${String(n).padStart(3)} ord ${inom ? '✅' : `❌ krav ${min}–${max}`}`);
});

if (!dry) fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
else console.log('\n(dry run – inget skrivet)');
if (!ok) process.exit(1);
