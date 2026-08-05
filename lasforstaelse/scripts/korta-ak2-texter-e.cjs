#!/usr/bin/env node
//
// Del E: de sex sista åk 2-texterna, 92–106 ord ned till intervallet 65–90.
// Därmed ligger samtliga texter i åk 2 inom sitt intervall.

const fs = require('fs');
const path = require('path');

const NYA = {

'ak2-tema-007': `I sagornas land finns en enhörning som heter Luma. Hon har vit päls och en man i alla regnbågens färger. Luma bor på en äng med mjukt gräs och färgglada blommor.

Varje morgon springer hon över ängen och lämnar glittrande spår bakom sig.

En dag kom barnet Sam till ängen med sin morfar. Sam kände sig ledsen och satte sig på en sten. Då dök Luma upp. Hon stod en stund bredvid Sam, och det kändes genast lite lättare i hjärtat. Sedan galopperade hon vidare mot skogen.`,

'ak2-tema-009': `Det sägs att enhörningar bara visar sig för den som är snäll. I en skog nära en sjö bodde en gammal enhörning med gyllene horn.

Barnet Noa brukade gå till sjön för att mata änderna. Noa var försiktig och skräpade aldrig ner.

En kväll när solen gick ner hördes ett mjukt ljud bakom buskarna. Den gamla enhörningen klev fram. Den böjde sitt huvud och lät hornet lysa svagt. Noa stod stilla och log.

Noa berättade inte för alla, utan sparade mötet som en hemlighet i sitt hjärta.`,

'ak1-tema-015': `Elias tappar sin mössa på väg till skolan. Vinden tar den och den fastnar i ett träd. Grenen är för hög. Elias sträcker sig men når inte.

Kompisen Mira kommer gående. "Vad hände?" frågar hon.

"Min mössa sitter fast", säger Elias.

Mira tittar upp. "Om du lyfter mig kan jag nå den."

Elias lyfter Mira försiktigt. Hon får tag i mössan.

"Tack!" säger Elias.

"Inget att tacka för", säger Mira. "Man hjälper varandra."

De går till skolan tillsammans. Elias håller hårt i mössan hela vägen.`,

'ak1-tema-013': `Det har regnat hela natten. När Ines kommer ut på morgonen finns det en stor vattenpöl på gården.

Ines har sina gula gummistövlar på sig. Hon hoppar rakt i pölen. Splash! Vattnet stänker högt.

Kompisen Omar kommer förbi. "Får jag hoppa också?" frågar han.

"Klart du får!" säger Ines.

De hoppar tills stövlarna är blöta på insidan. Sedan sitter de på trappen och häller ut vattnet.

"Titta", säger Omar. "Solen kommer fram." Pölen börjar bli mindre.

"Vi får hoppa snabbt imorgon", säger Ines. "Innan pölen försvinner."`,

'ak1-tema-012': `Malte är fem år. Hans storasyster Saga är sju. Idag ska de baka bullar med pappa.

Pappa tar fram mjöl, socker och smör. Saga får mäta mjölet. Malte vill också hjälpa till.

"Du kan röra i degen", säger pappa.

Malte rör så hårt att mjöl flyger upp i luften. Saga skrattar. "Sakta, sakta!" Hon lägger sin hand över Maltes och visar hur man rör försiktigt.

Tillsammans gör de runda bullar. Malte gör en extra stor. "Den är till dig, Saga", säger han.

Saga ler. "Tack, lillebror."`,

'ak1-natur-katt-001': `Max är en liten katt. Han bor i ett gult hus. På morgonen vaknar Max tidigt. Han sträcker på sig och jamar högt. Sedan går han till köket. Där står en skål med mat.

Efter frukosten vill Max leka. Han jagar en röd boll över golvet. Max springer efter. Ibland gömmer han sig bakom soffan. Då tror han att ingen ser honom.

När det blir kväll är Max trött. Han kryper upp i sin mjuka korg. Där somnar han.`,
};

const NYCKELORD = {
  'ak2-tema-007': ['Luma', 'på en äng', 'glittrande spår', 'Sam till ängen med sin morfar', 'ledsen', 'mot skogen'],
  'ak2-tema-009': ['skog nära en sjö', 'mata änderna', 'hornet lysa svagt', 'när solen gick ner', 'försiktig', 'hemlighet'],
  'ak1-tema-015': ['fastnar i ett träd', 'Grenen är för hög', 'lyfter Mira', 'Man hjälper varandra', 'håller hårt i mössan'],
  'ak1-tema-013': ['regnat hela natten', 'gula gummistövlar', 'Omar', 'häller ut vattnet', 'Solen kommer fram', 'Innan pölen försvinner'],
  'ak1-tema-012': ['baka bullar', 'Saga får mäta mjölet', 'mjöl flyger upp', 'till dig, Saga', 'hand över Maltes', 'rör försiktigt'],
  'ak1-natur-katt-001': ['en liten katt', 'gult hus', 'röd boll', 'bakom soffan', 'mjuka korg'],
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

const kvar = lib.filter(t => {
  if (t.grade !== 2) return false;
  const n = t.text.trim().split(/\s+/).length;
  return n < 65 || n > 90;
});
console.log(`\nÅk 2-texter utanför intervallet 65–90: ${kvar.length}`);
if (!ok) process.exit(1);
