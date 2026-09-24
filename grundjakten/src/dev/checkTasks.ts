import type { Exercise } from '@/types';
import { TASKS } from '@/data/tasks';
import { traKistaEfterPass } from '@/data/belohningar';
import { MAX_STEP, PROGRESSION_STEPS } from '@/data/progression';
import { LETTERS } from '@/data/letters';
import { WORDS, newWordsAtStep } from '@/data/words';
import { SIGHT_WORDS } from '@/data/sightWords';
import { AVATARER } from '@/data/avatars';
import { FIGURGRUPPER, KATEGORIER, VAROR } from '@/data/affar';
import {
  ADJEKTIV, DJUR, FARGER, GATOR, KORTA_ORD, KORTA_VOKALER,
  LANGA_VOKALER, LIKNELSER_DJUR, LJUDSTRIDIGA, SAMMANSATTA, SUBSTANTIV, VERB,
} from '@/data/banks';
import { generateLetterPass } from '@/lib/generators/letterExercises';
import { generateWritePass } from '@/lib/generators/writingExercises';
import { fraganI } from '@/lib/generators/taskBuilders';
import type { LevelBand } from '@/types';

/**
 * Innehållskontroll för övningsbanken.
 *
 * Med över hundra uppgifter går det inte att klicka igenom dem för hand. Den
 * här kontrollen bygger varje uppgift med flera frön och letar efter de fel
 * som faktiskt drabbar en elev: ett tomt pass, en fråga utan rätt svar, två
 * likadana alternativ, ett svar som inte går att skriva.
 *
 * Körs med `npm run check`.
 */

export interface Fel {
  task: string;
  seed: number;
  meddelande: string;
}

function kollaOvning(ex: Exercise, task: string, seed: number, fel: Fel[]): void {
  const var_ = (m: string) => fel.push({ task, seed, meddelande: m });

  if (!ex.prompt?.text?.trim()) var_(`${ex.kind}: tom instruktion`);
  if (!ex.replay?.text?.trim()) var_(`${ex.kind}: tomt uppspelningsljud`);

  if ('choices' in ex && Array.isArray(ex.choices)) {
    const ratta = ex.choices.filter((c) => c.correct);
    if (ratta.length !== 1) var_(`${ex.kind}: ${ratta.length} rätta svar, ska vara 1`);
    if (ex.choices.length < 2) var_(`${ex.kind}: bara ${ex.choices.length} alternativ`);

    // Två alternativ som ser likadana ut gör uppgiften omöjlig att svara rätt på.
    const etiketter = ex.choices.map((c) => `${c.word ?? ''}|${c.letter ?? ''}|${c.emoji ?? ''}`);
    if (new Set(etiketter).size !== etiketter.length) {
      var_(`${ex.kind}: två alternativ ser likadana ut (${etiketter.join(' , ')})`);
    }
    // Samma id på två alternativ gör att React återanvänder fel nod.
    const ids = ex.choices.map((c) => c.id);
    if (new Set(ids).size !== ids.length) var_(`${ex.kind}: dubbla alternativ-id`);

    for (const c of ex.choices) {
      if (!c.say?.text?.trim()) var_(`${ex.kind}: alternativ utan talat namn`);
      if (!c.word && !c.letter && !c.emoji) var_(`${ex.kind}: alternativ utan innehåll`);
    }
  }

  if (ex.kind === 'type-the-word') {
    if (!ex.answer.trim()) var_('type-the-word: tomt svar');
    if (!ex.accept.includes(ex.answer.toLowerCase())) {
      var_(`type-the-word: "${ex.answer}" finns inte bland godtagna svar`);
    }
    if (ex.sentence && !ex.sentence.includes('___')) {
      var_(`type-the-word: meningen saknar lucka (${ex.sentence})`);
    }
  }

  if (ex.kind === 'order-items') {
    if (ex.target.length < 2) var_('order-items: färre än två objekt');
    const a = [...ex.target].sort().join('|');
    const b = [...ex.items].sort().join('|');
    if (a !== b) var_(`order-items: items är inte samma mängd som target`);
    if (new Set(ex.target).size !== ex.target.length) var_('order-items: dubbletter i target');
  }

  if (ex.kind === 'build-sentence-cards' || ex.kind === 'build-word-tiles') {
    for (const del of ex.target) {
      const iKort = (ex.kind === 'build-sentence-cards' ? ex.cards : ex.tiles).filter((k) => k === del).length;
      const iTarget = ex.target.filter((t) => t === del).length;
      if (iKort < iTarget) var_(`${ex.kind}: "${del}" saknas bland brickorna`);
    }
  }

  if (ex.kind === 'word-picture-pair') {
    if (ex.pairs.length < 2) var_('word-picture-pair: färre än två par');
    const ord = ex.pairs.map((p) => p.word);
    if (new Set(ord).size !== ord.length) var_('word-picture-pair: samma ord två gånger');
  }
}

export function kollaAllaTasks(seeds = [1, 12345, 987654]): { antal: number; fel: Fel[] } {
  const fel: Fel[] = [];
  let antal = 0;

  for (const task of TASKS) {
    const namn = `${task.grupp} – ${task.namn}`;
    for (const seed of seeds) {
      let pass: Exercise[];
      try {
        pass = task.build(seed);
      } catch (e) {
        fel.push({ task: namn, seed, meddelande: `kastade fel: ${(e as Error).message}` });
        continue;
      }

      antal += 1;
      if (pass.length < 4) {
        fel.push({ task: namn, seed, meddelande: `bara ${pass.length} uppgifter i passet` });
      }

      const ids = pass.map((e) => e.id);
      if (new Set(ids).size !== ids.length) {
        fel.push({ task: namn, seed, meddelande: 'två uppgifter i passet delar id' });
      }

      for (const ex of pass) kollaOvning(ex, namn, seed, fel);
    }
  }

  return { antal, fel };
}

/** Dubbletter i katalogen: samma id två gånger bryter uppslagningen. */
export function kollaKatalog(): Fel[] {
  const fel: Fel[] = [];
  const ids = TASKS.map((t) => t.id);
  const sedda = new Set<string>();
  for (const id of ids) {
    if (sedda.has(id)) fel.push({ task: id, seed: 0, meddelande: 'dubblerat uppgifts-id' });
    sedda.add(id);
  }
  for (const t of TASKS) {
    if (!t.namn.trim()) fel.push({ task: t.id, seed: 0, meddelande: 'uppgift utan namn' });
    if (![1, 2, 3, 4].includes(t.niva)) {
      fel.push({ task: t.id, seed: 0, meddelande: `ogiltig nivå ${t.niva}` });
    }
  }
  return fel;
}

/**
 * Varje bild får betyda EXAKT ett ord.
 *
 * Det här fanns på riktigt: 👖 användes både för `ficka` och för `jeans`, och
 * 🪑 både för `bord` och för `stol`. En elev som inte kan läsa har bara
 * bilden att gå på – två ord bakom samma bild är en fråga utan svar, och
 * läraren hittade det först när en elev satt fast på byxorna.
 *
 * Kontrollen tittar på alla bildord-listor samtidigt, för felet uppstår
 * mellan listorna lika ofta som inom en.
 */
const BILDORDSLISTOR = {
  FARGER, DJUR, VERB, SUBSTANTIV, ADJEKTIV, KORTA_ORD,
  LANGA_VOKALER, KORTA_VOKALER, LJUDSTRIDIGA,
};

export function kollaBildord(): Fel[] {
  const fel: Fel[] = [];
  const perEmoji = new Map<string, Set<string>>();

  const lagg = (emoji: string | null, ord: string, varifran: string) => {
    if (!emoji) return;
    if (!perEmoji.has(emoji)) perEmoji.set(emoji, new Set());
    perEmoji.get(emoji)!.add(`${ord} (${varifran})`);
  };

  for (const [listnamn, lista] of Object.entries(BILDORDSLISTOR)) {
    for (const o of lista) lagg(o.emoji ?? null, o.ord, listnamn);
  }

  // Bokstavsresans egen ordbank. Den glömdes först, och just där satt fyra av
  // dubbletterna: ☀️ för både sol och dag, 👩 för både mor och dam, 👨 för
  // både far och man, 🏠 för både hus och tak.
  for (const w of WORDS) lagg(w.emoji, w.text, 'WORDS');

  // Gåtorna. Bilden ÄR svaret där, så den räknas som ett bildord: gåtan om
  // fyra ben som inte kan gå visade en stol men hade svaret "bord".
  for (const g of GATOR) lagg(g.emoji, g.svar, 'GATOR');

  // Sammansatta ord och liknelser visar också en bild till ett svar.
  for (const [, , helt, emoji] of SAMMANSATTA) lagg(emoji, helt, 'SAMMANSATTA');
  for (const l of LIKNELSER_DJUR) lagg(l.emoji, l.svar, 'LIKNELSER');

  for (const [emoji, ord] of perEmoji) {
    // Samma ORD i flera listor är i sin ordning – hus finns både bland korta
    // ord och bland långa vokaler. Det är olika ord som är felet.
    const unika = new Set([...ord].map((o) => o.split(' (')[0]));
    if (unika.size > 1) {
      fel.push({
        task: 'bildord',
        seed: 0,
        meddelande: `bilden ${emoji} betyder flera ord: ${[...unika].join(', ')}`,
      });
    }
  }
  return fel;
}

/**
 * Samma fråga får inte ställas två gånger i samma pass.
 *
 * Läraren såg "fotboll" komma upp igen efter att eleven svarat rätt. En elev
 * som redan klarat ett ord och får det igen tror att hon svarade fel, och
 * passets prickar stämmer inte med vad hon minns.
 *
 * Felet satt i byggarna, inte i kön: `buildPass` anropade sin fabrik om och
 * om igen utan minne, och både den och `buildFromBank` sållade bara på
 * uppgiftens id – som sätts av en räknare och alltid är unikt. Mätningen gav
 * 46 upprepningar fördelade på elva uppgifter. Den här kontrollen finns för
 * att de inte ska kunna komma tillbaka.
 */
export function kollaUpprepningar(seeds = [1, 7, 42, 12345, 987654]): Fel[] {
  const fel: Fel[] = [];

  const rakna = (pass: Exercise[], namn: string, seed: number) => {
    const sedda = new Map<string, number>();
    for (const ex of pass) {
      const k = fraganI(ex);
      if (!k) continue;
      sedda.set(k, (sedda.get(k) ?? 0) + 1);
    }
    for (const [k, n] of sedda) {
      if (n > 1) fel.push({ task: namn, seed, meddelande: `${k} förekommer ${n} gånger i samma pass` });
    }
  };

  for (const t of TASKS) {
    for (const seed of seeds) {
      try {
        rakna(t.build(seed), `${t.grupp} – ${t.namn}`, seed);
      } catch {
        /* kollaAllaTasks rapporterar redan kastade fel */
      }
    }
  }

  // Bokstavsresan har en egen generator och samma sorts fel fanns där.
  for (let steg = 1; steg <= MAX_STEP; steg++) {
    for (const band of [1, 2, 3] as LevelBand[]) {
      for (const seed of seeds) {
        rakna(generateLetterPass(steg, band, seed), `Bokstavsresan steg ${steg} band ${band}`, seed);
      }
    }
  }

  // Skriva har en TREDJE generator. Den saknades i kontrollen, och det var
  // just där läraren fick "mor" två gånger – felet gick därför oupptäckt
  // genom två omgångar av den här kontrollen.
  for (const mode of ['type', 'build', 'form'] as const) {
    for (let steg = 1; steg <= MAX_STEP; steg++) {
      for (const band of [1, 2, 3] as LevelBand[]) {
        for (const seed of seeds) {
          rakna(generateWritePass(mode, steg, band, seed),
                `Skriva ${mode} steg ${steg} band ${band}`, seed);
        }
      }
    }
  }
  return fel;
}

/**
 * Träkistan ska komma oregelbundet, men inom rimliga gränser.
 *
 * Varje pass gav förut en kista och det blev en kvittens i stället för en
 * belöning. Den här kontrollen håller intervallet på plats: aldrig tätare än
 * vart tredje pass, aldrig glesare än vart sjunde, och mellanrummen får inte
 * vara lika stora – då går de att räkna ut och överraskningen är borta.
 */
export function kollaTrakistor(): Fel[] {
  const fel: Fel[] = [];
  const traffar: number[] = [];
  for (let n = 1; n <= 200; n++) if (traKistaEfterPass(n)) traffar.push(n);

  if (traffar.length === 0) {
    fel.push({ task: 'trakista', seed: 0, meddelande: 'ingen träkista delas ut alls' });
    return fel;
  }

  const gap: number[] = [];
  let forra = 0;
  for (const t of traffar) { gap.push(t - forra); forra = t; }

  const min = Math.min(...gap);
  const max = Math.max(...gap);
  if (min < 3) fel.push({ task: 'trakista', seed: 0, meddelande: `kommer så tätt som vart ${min}:e pass` });
  if (max > 7) fel.push({ task: 'trakista', seed: 0, meddelande: `kommer så sällan som vart ${max}:e pass` });
  if (new Set(gap).size < 2) {
    fel.push({ task: 'trakista', seed: 0, meddelande: 'jämna mellanrum – går att räkna ut' });
  }
  return fel;
}

/**
 * Ordbilderna: inga dubbletter, inga tomma poster.
 *
 * Banken växte från 30 till 100 ord i ett svep, och en handskriven lista av
 * den storleken får dubbletter om ingen tittar. Ett upprepat ord skulle
 * dessutom kunna hamna som både rätt svar och distraktor i samma fråga.
 */
export function kollaOrdbilder(): Fel[] {
  const fel: Fel[] = [];
  const sedda = new Set<string>();
  for (const w of SIGHT_WORDS) {
    const t = w.text.trim().toLowerCase();
    if (!t) fel.push({ task: 'ordbilder', seed: 0, meddelande: `${w.id} har tom text` });
    if (sedda.has(t)) fel.push({ task: 'ordbilder', seed: 0, meddelande: `"${t}" finns två gånger` });
    sedda.add(t);
    if (w.graphemes.join('') !== t) {
      fel.push({ task: 'ordbilder', seed: 0, meddelande: `"${t}": grafemen bildar "${w.graphemes.join('')}"` });
    }
    if (w.emoji) fel.push({ task: 'ordbilder', seed: 0, meddelande: `"${t}" har en bild; ordbilder ska sakna bild` });
  }
  // Tre alternativ per fråga kräver minst tre ord att välja mellan.
  if (SIGHT_WORDS.length < 3) {
    fel.push({ task: 'ordbilder', seed: 0, meddelande: 'för få ordbilder för att bygga en fråga' });
  }
  return fel;
}

/**
 * Affärens katalog.
 *
 * Tre fällor, alla tysta i gränssnittet:
 *
 *  - Ett id som finns två gånger. Köpen sparas på id, så eleven skulle betala
 *    för en vara och få en annan påslagen.
 *  - En figur med samma emoji som en annan figur eller som en av de tolv
 *    gratisfigurerna. Affären avgör vad som "används" genom att jämföra
 *    profile.avatar med varans emoji, så två varor med samma emoji skulle
 *    lysa gröna samtidigt – och en gratisfigur skulle få ett köpt kort att se
 *    valt ut utan att vara köpt.
 *  - En ram eller ett tema utan `stil`. Den går att köpa, och syns aldrig.
 */
export function kollaAffar(): Fel[] {
  const fel: Fel[] = [];
  const sagt = (meddelande: string) => fel.push({ task: 'affar', seed: 0, meddelande });

  const idn = new Set<string>();
  const emojis = new Map<string, string>();
  const gratis = new Set(AVATARER);

  for (const v of VAROR) {
    if (idn.has(v.id)) sagt(`id "${v.id}" finns två gånger`);
    idn.add(v.id);

    if (!v.namn.trim()) sagt(`${v.id} saknar namn`);
    if (v.pris <= 0) sagt(`${v.id} kostar ${v.pris}`);

    if (v.typ === 'figur') {
      if (!v.grupp) sagt(`${v.id} saknar grupp`);
      if (gratis.has(v.ikon)) sagt(`${v.id} (${v.ikon}) finns redan som gratisfigur`);
      const forra = emojis.get(v.ikon);
      if (forra) sagt(`${v.id} och ${forra} har samma figur ${v.ikon}`);
      emojis.set(v.ikon, v.id);
    } else if (!v.stil) {
      sagt(`${v.id} saknar stil och skulle inte synas`);
    }
  }

  // Varje flik måste ha något i sig, och figurgrupperna måste alla användas –
  // en tom rubrik är en rubrik eleven scrollar förbi utan att förstå varför.
  for (const k of KATEGORIER) {
    if (!VAROR.some((v) => v.typ === k.typ)) sagt(`fliken ${k.namn} är tom`);
  }
  for (const g of FIGURGRUPPER) {
    if (!VAROR.some((v) => v.typ === 'figur' && v.grupp === g)) sagt(`gruppen ${g} är tom`);
  }

  // Billigaste varan ska gå att nå på rimlig tid. Ett pass ger ungefär 30–40
  // poäng; är ingenting under ett par hundra är affären bara en skyltfönster.
  const billigast = Math.min(...VAROR.map((v) => v.pris));
  if (billigast > 100) sagt(`billigaste varan kostar ${billigast} – för långt till första köpet`);

  return fel;
}

/** Hur många bildord en station minst måste låsa upp för att bära ett pass. */
const MIN_BILDORD = 3;

/**
 * Kontrollerar Bokstavsresan.
 *
 * Det här fanns på riktigt: station 1 var S O L A och låste upp två ord, varav
 * ett med bild. Fyra bokstäver och nästan inget att göra med dem – och på
 * nivåband 3, som lutar på ordövningar, gick passet inte ens att fylla.
 * Felet syntes inte i någon kontroll, bara som en skärm som kändes tom.
 */
export function kollaProgression(): Fel[] {
  const fel: Fel[] = [];
  const kant = new Set(LETTERS.map((l) => l.id));
  const sedda = new Set<string>();

  for (const st of PROGRESSION_STEPS) {
    for (const id of st.letters) {
      if (!kant.has(id)) {
        fel.push({ task: `station ${st.step}`, seed: 0, meddelande: `okänd bokstav "${id}"` });
      }
      if (sedda.has(id)) {
        fel.push({ task: `station ${st.step}`, seed: 0, meddelande: `bokstaven "${id}" finns i två stationer` });
      }
      sedda.add(id);
    }

    const bildord = newWordsAtStep(st.step).filter((w) => w.emoji !== null);
    if (bildord.length < MIN_BILDORD) {
      fel.push({
        task: `station ${st.step}`,
        seed: 0,
        meddelande: `låser bara upp ${bildord.length} ord med bild (minst ${MIN_BILDORD} krävs för att bära ett pass)`,
      });
    }
  }

  for (const l of LETTERS) {
    if (!sedda.has(l.id)) {
      fel.push({ task: 'progression', seed: 0, meddelande: `bokstaven "${l.id}" saknar station` });
    }
  }

  // Ett ord vars grafem aldrig blir upplåsta är innehåll ingen elev kan nå.
  for (const w of WORDS) {
    if (w.step > MAX_STEP) {
      fel.push({ task: w.id, seed: 0, meddelande: `blir aldrig läsbar (härlett steg ${w.step} > ${MAX_STEP})` });
    }
  }

  return fel;
}

/**
 * Varje station ska gå att öva på, på varje nivåband.
 *
 * Generatorn skickar hellre ut ett kort pass än ett med tomma rutor, så ett
 * pass som inte blir fullt är tyst – eleven märker bara att övningen tog slut
 * direkt. Därför kontrolleras längden här.
 */
export function kollaBokstavspass(seeds = [1, 12345, 987654]): { antal: number; fel: Fel[] } {
  const fel: Fel[] = [];
  let antal = 0;
  const PASS = 8;

  for (const st of PROGRESSION_STEPS) {
    for (const band of [1, 2, 3] as LevelBand[]) {
      for (const seed of seeds) {
        const pass = generateLetterPass(st.step, band, seed);
        antal++;
        if (pass.length < PASS) {
          fel.push({
            task: `station ${st.step}, nivåband ${band}`,
            seed,
            meddelande: `passet blev ${pass.length} uppgifter i stället för ${PASS}`,
          });
        }
      }
    }
  }
  return { antal, fel };
}
