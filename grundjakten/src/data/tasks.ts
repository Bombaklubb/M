import type { Exercise, GruppMeta, TaskDef } from '@/types';
import {
  ADJEKTIV, ADJEKTIVFORMER, ALFABETET, CK_LJUDET, DEN_ORD, DET_ORD, DJUR, DUBBELTECKNING,
  EGENNAMN, EN_FLERA,
  EN_ORD, ETT_ORD, FARGER, GATOR, HOR_INTE_IHOP, J_LJUDET_G, J_LJUDET_J,
  J_LJUDET_OVRIGA, KONSONANTER, KORTA_ORD, KORTA_VOKALER, LAGESORD, LANGA_VOKALER,
  LIKNELSER_DJUR, LJUDSTRIDIGA, MANADER, MOTSATSORD, M_LJUDET, NG_LJUDET_N,
  NG_LJUDET_NG, NG_MENINGAR, N_MENINGAR, RAKNEORD, RIM, RIMGRUPPER, SAMMANSATTA, SJ_LJUDET_OVRIGA,
  SJ_LJUDET_SJ, SJ_LJUDET_SK, SKILJETECKEN, SUBSTANTIV, SYNONYMER, TJ_LJUDET_K,
  TJ_LJUDET_TJ, VANLIGA_ORD, VECKODAGAR, VERB, VOKALER, VOKALPAR,
  type Ord, type Stavning,
} from './banks';
import { buildFromBank, buildPass, orderItems, quiz, typeWord, andraOrd } from '@/lib/generators/taskBuilders';
import { pick, pickN, shuffle } from '@/lib/rng';

/**
 * Övningsbanken.
 *
 * Till skillnad från passen i Bokstäver och Skriva är de här uppgifterna
 * NAMNGIVNA. Läraren kan säga "gör Alfabetet – Första bokstaven 2" och eleven
 * hittar exakt den. Innehållet varierar ändå mellan gångerna, eftersom varje
 * uppgift byggs om från sin ordbank vid start.
 *
 * Nivåerna 1–4 motsvarar Svenska 1–4 i listan, inte årskurser.
 */

export const GRUPPER: Record<string, GruppMeta> = {
  'Alfabetet': { icon: '🔤', tint: 'bg-brand-500 border-brand-700' },
  'Läsförståelse': { icon: '📖', tint: 'bg-aqua-500 border-aqua-700' },
  'Ljudenlig stavning': { icon: '✏️', tint: 'bg-lime-500 border-lime-700' },
  'Rimord': { icon: '🎵', tint: 'bg-amberx-500 border-amberx-700' },
  'Räkneord': { icon: '🔢', tint: 'bg-brand-500 border-brand-700' },
  'Grammatik': { icon: '🧩', tint: 'bg-aqua-500 border-aqua-700' },
  'Ordförståelse': { icon: '💡', tint: 'bg-lime-500 border-lime-700' },
  'Lägesord': { icon: '📍', tint: 'bg-amberx-500 border-amberx-700' },
  'Kort vokal': { icon: '🔡', tint: 'bg-brand-500 border-brand-700' },
  'Stavning': { icon: '🔡', tint: 'bg-brand-500 border-brand-700' },
  'Skriva blandat': { icon: '📝', tint: 'bg-aqua-500 border-aqua-700' },
  'Dag/Månad': { icon: '📅', tint: 'bg-lime-500 border-lime-700' },
  'J-ljudet': { icon: '🔊', tint: 'bg-amberx-500 border-amberx-700' },
  'M-ljudet': { icon: '🔊', tint: 'bg-amberx-500 border-amberx-700' },
  'SJ-ljudet': { icon: '🔊', tint: 'bg-amberx-500 border-amberx-700' },
  'TJ-ljudet': { icon: '🔊', tint: 'bg-amberx-500 border-amberx-700' },
  'NG-ljudet': { icon: '🔊', tint: 'bg-amberx-500 border-amberx-700' },
  'CK-ljudet': { icon: '🔊', tint: 'bg-amberx-500 border-amberx-700' },
  'Skiljetecken': { icon: '❓', tint: 'bg-aqua-500 border-aqua-700' },
};

// ── Återanvändbara uppgiftsmallar ───────────────────────────────────────────

/** Se bilden – vilken bokstav börjar ordet på? */
function forstaBokstaven(bank: Ord[], seed: number): Exercise[] {
  return buildFromBank(seed, bank.filter((o) => o.emoji), 8, (item, rng) => {
    const ratt = item.ord[0].toLowerCase();
    const fel = andraOrd(ALFABETET, [ratt], rng, 2);
    return quiz(
      {
        prompt: 'Vilken bokstav börjar ordet på?',
        replay: item.ord,
        shown: { emoji: item.emoji },
        ratt: { letter: ratt.toUpperCase(), say: ratt },
        fel: fel.map((b) => ({ letter: b.toUpperCase(), say: b })),
      },
      rng
    );
  });
}

/** Hör ordet – skriv det. */
function skrivOrdet(bank: Ord[], seed: number, prompt = 'Skriv ordet du hör.'): Exercise[] {
  return buildFromBank(seed, bank, 8, (item) =>
    typeWord({ prompt, answer: item.ord, emoji: item.emoji })
  );
}

/** Hör ordet – välj rätt av två stavningar som låter lika. */
function valjStavning(bank: Stavning[], seed: number): Exercise[] {
  return buildFromBank(seed, bank, 8, (item, rng) =>
    quiz(
      {
        prompt: 'Vilken stavning är rätt?',
        replay: item.ratt,
        shown: item.emoji ? { emoji: item.emoji } : undefined,
        ratt: { word: item.ratt },
        fel: [{ word: item.fel }],
        compact: true,
      },
      rng
    )
  );
}

/** Hör ordet – skriv det. Samma bank som välj-rätt-stavning, men utan stöd. */
function skrivStavning(bank: Stavning[], seed: number): Exercise[] {
  return buildFromBank(seed, bank, 8, (item) =>
    typeWord({ prompt: 'Skriv ordet du hör.', answer: item.ratt, emoji: item.emoji })
  );
}

/** Ordpar åt båda håll: motsatsord och synonymer. */
function ordparQuiz(par: [string, string][], seed: number, fraga: (ord: string) => string): Exercise[] {
  return buildFromBank(seed, par, 8, (item, rng, bank) => {
    const vand = rng() < 0.5;
    const [fraga1, svar] = vand ? [item[1], item[0]] : item;
    const alla = bank.flat();
    const fel = andraOrd(alla, [fraga1, svar], rng, 2);
    return quiz(
      {
        prompt: fraga(fraga1),
        replay: fraga(fraga1),
        shown: { word: fraga1 },
        ratt: { word: svar },
        fel: fel.map((o) => ({ word: o })),
      },
      rng
    );
  });
}

// ── Svenska 1 ───────────────────────────────────────────────────────────────

const SVENSKA_1: TaskDef[] = [
  {
    id: 'alf-stor-liten', grupp: 'Alfabetet', namn: 'Alfabetet stor/liten bokstav', niva: 1,
    build: (seed) =>
      buildFromBank(seed, ALFABETET, 8, (bokstav, rng) => {
        const fel = andraOrd(ALFABETET, [bokstav], rng, 2);
        return quiz(
          {
            prompt: 'Vilken liten bokstav hör ihop med den stora?',
            replay: bokstav,
            shown: { letter: bokstav.toUpperCase() },
            ratt: { letter: bokstav, say: bokstav },
            fel: fel.map((b) => ({ letter: b, say: b })),
          },
          rng
        );
      }),
  },
  { id: 'alf-forsta-1', grupp: 'Alfabetet', namn: 'Första bokstaven 1', niva: 1,
    build: (seed) => forstaBokstaven(KORTA_ORD, seed) },
  { id: 'alf-forsta-2', grupp: 'Alfabetet', namn: 'Första bokstaven 2', niva: 1,
    build: (seed) => forstaBokstaven(SUBSTANTIV, seed) },
  { id: 'alf-forsta-3', grupp: 'Alfabetet', namn: 'Första bokstaven 3', niva: 1,
    build: (seed) => forstaBokstaven(FARGER, seed) },
  { id: 'alf-forsta-4', grupp: 'Alfabetet', namn: 'Första bokstaven 4', niva: 1,
    build: (seed) => forstaBokstaven(VERB, seed) },
  { id: 'alf-forsta-djur', grupp: 'Alfabetet', namn: 'Första bokstaven (djur)', niva: 1,
    build: (seed) => forstaBokstaven(DJUR, seed) },

  ...([1, 2, 3] as const).map((n) => ({
    id: `las-ord-bild-${n}`, grupp: 'Läsförståelse', namn: `Sätt ihop ord bild ${n}`, niva: 1 as const,
    build: (seed: number) => {
      const bank = [KORTA_ORD, DJUR, SUBSTANTIV][n - 1].filter((o) => o.emoji);
      return buildPass(seed, 4, (rng) => {
        const tre = pickN(bank, 3, rng);
        if (tre.length < 3) return null;
        return {
          id: `pair-${n}-${Math.floor(rng() * 1e6)}`,
          kind: 'word-picture-pair' as const,
          module: 'ovningsbank' as const,
          pairs: tre.map((o) => ({
            id: `p-${o.ord}`, word: o.ord, emoji: o.emoji!,
            say: { id: `say-${o.ord}`, text: o.ord, lang: 'sv-SE' as const },
          })),
          prompt: { id: 'p-pair', text: 'Para ihop ordet med bilden.', lang: 'sv-SE' as const },
          replay: { id: 'p-pair', text: 'Para ihop ordet med bilden.', lang: 'sv-SE' as const },
          xp: 5,
        };
      });
    },
  })),

  { id: 'ljud-korta-1', grupp: 'Ljudenlig stavning', namn: 'Skriv ordet (korta ord) 1', niva: 1,
    build: (seed) => skrivOrdet(KORTA_ORD, seed) },
  { id: 'ljud-korta-2', grupp: 'Ljudenlig stavning', namn: 'Skriv ordet (korta ord) 2', niva: 1,
    build: (seed) => skrivOrdet(KORTA_ORD, seed + 7) },
  { id: 'ljud-korta-3', grupp: 'Ljudenlig stavning', namn: 'Skriv ordet (korta ord) 3', niva: 1,
    build: (seed) => skrivOrdet(KORTA_ORD, seed + 13) },
  { id: 'ljud-korta-4', grupp: 'Ljudenlig stavning', namn: 'Skriv ordet (korta ord) 4', niva: 1,
    build: (seed) => skrivOrdet(KORTA_ORD, seed + 23) },
  { id: 'ljud-farger-1', grupp: 'Ljudenlig stavning', namn: 'Skriv ordet – Färger 1', niva: 1,
    build: (seed) => skrivOrdet(FARGER, seed) },
  { id: 'ljud-farger-2', grupp: 'Ljudenlig stavning', namn: 'Skriv ordet – Färger 2', niva: 1,
    build: (seed) => skrivOrdet(FARGER, seed + 11) },
  { id: 'ljud-skriv-ordet', grupp: 'Ljudenlig stavning', namn: 'Skriv ordet', niva: 1,
    build: (seed) => skrivOrdet([...KORTA_ORD, ...DJUR], seed) },
  { id: 'ljud-langa-vokaler', grupp: 'Ljudenlig stavning', namn: 'Skriv ordet – Långa vokaler', niva: 1,
    build: (seed) => skrivOrdet(LANGA_VOKALER, seed) },

  { id: 'rim-bilder-1', grupp: 'Rimord', namn: 'Rim med bilder 1', niva: 1,
    build: (seed) => rimMedBilder(seed) },
  { id: 'rim-bilder-2', grupp: 'Rimord', namn: 'Rim med bilder 2', niva: 1,
    build: (seed) => rimMedBilder(seed + 17) },

  { id: 'rak-skriv-siffran-1', grupp: 'Räkneord', namn: 'Skriv siffran 1', niva: 1,
    build: (seed) =>
      buildFromBank(seed, RAKNEORD, 8, (item) =>
        typeWord({
          prompt: 'Skriv siffran du hör.', answer: item.siffra, ocksa: [item.ord],
          replay: item.ord, digits: true,
        })
      ) },
  { id: 'rak-skriv-siffran-2', grupp: 'Räkneord', namn: 'Skriv siffran 2', niva: 1,
    build: (seed) =>
      buildFromBank(seed + 9, RAKNEORD, 8, (item) =>
        typeWord({
          prompt: 'Skriv siffran du hör.', answer: item.siffra, ocksa: [item.ord],
          replay: item.ord, digits: true,
        })
      ) },
  { id: 'rak-satt-ihop', grupp: 'Räkneord', namn: 'Sätt ihop siffror', niva: 1,
    build: (seed) =>
      buildFromBank(seed, RAKNEORD, 8, (item, rng, bank) => {
        const fel = pickN(bank.filter((r) => r.siffra !== item.siffra), 2, rng);
        return quiz(
          {
            prompt: `Vilken siffra betyder ${item.ord}?`,
            replay: item.ord,
            ratt: { word: item.siffra, say: item.ord },
            fel: fel.map((f) => ({ word: f.siffra, say: f.ord })),
          },
          rng
        );
      }) },

  { id: 'gram-den-det', grupp: 'Grammatik', namn: 'Den eller det', niva: 1,
    build: (seed) =>
      buildPass(seed, 8, (rng) => {
        // Bestämd form: "det huset", inte "det hus".
        const denOrd = rng() < 0.5;
        const ord = pick(denOrd ? DEN_ORD : DET_ORD, rng);
        return quiz(
          {
            prompt: `Säger man den eller det ${ord}?`,
            replay: ord,
            shown: { word: ord },
            ratt: { word: denOrd ? 'den' : 'det' },
            fel: [{ word: denOrd ? 'det' : 'den' }],
            compact: true,
          },
          rng
        );
      }) },

  { id: 'skriv-bygg-meningen', grupp: 'Skriva blandat', namn: 'Bygg meningen', niva: 1,
    build: (seed) => byggMeningen(seed) },

  ...([1, 2, 3] as const).map((n) => ({
    id: `ord-motsats-${n}`, grupp: 'Ordförståelse', namn: `Motsatsord ${n}`, niva: 1 as const,
    build: (seed: number) =>
      ordparQuiz(MOTSATSORD, seed + n * 5, (o) => `Vad är motsatsen till ${o}?`),
  })),

  { id: 'lagesord', grupp: 'Lägesord', namn: 'Välj rätt lägesord', niva: 1,
    build: (seed) =>
      buildFromBank(seed, LAGESORD, 8, (item, rng) =>
        quiz(
          {
            prompt: 'Vilket ord passar i meningen?',
            replay: item.mening.replace('___', item.svar),
            shown: { sentence: item.mening },
            ratt: { word: item.svar },
            fel: item.fel.map((f) => ({ word: f })),
          },
          rng
        )
      ) },

  { id: 'kort-vokal-1', grupp: 'Kort vokal', namn: 'Skriv ordet – Korta vokaler', niva: 1,
    build: (seed) => skrivOrdet(KORTA_VOKALER, seed) },
];

// ── Svenska 2 ───────────────────────────────────────────────────────────────

const SVENSKA_2: TaskDef[] = [
  { id: 'rim-text-1', grupp: 'Rimord', namn: 'Rim med text 1', niva: 2,
    build: (seed) => rimMedText(seed) },
  { id: 'rim-text-2', grupp: 'Rimord', namn: 'Rim med text 2', niva: 2,
    build: (seed) => rimMedText(seed + 19) },
  { id: 'rim-rimmar-inte', grupp: 'Rimord', namn: 'Vilket ord rimmar inte', niva: 2,
    build: (seed) =>
      buildFromBank(seed, RIMGRUPPER, 6, (item, rng) =>
        quiz(
          {
            prompt: 'Vilket ord rimmar inte?',
            replay: [...item.rimmar, item.avvikare].join(', '),
            ratt: { word: item.avvikare },
            fel: item.rimmar.map((o) => ({ word: o })),
          },
          rng
        )
      ) },

  { id: 'alf-ordning-korta', grupp: 'Alfabetet', namn: 'Alfabetisk ordning (korta ord)', niva: 2,
    build: (seed) => alfabetiskOrdning(seed, KORTA_ORD.map((o) => o.ord), 3) },
  { id: 'alf-ordning', grupp: 'Alfabetet', namn: 'Alfabetisk ordning', niva: 2,
    build: (seed) => alfabetiskOrdning(seed, [...DJUR, ...SUBSTANTIV].map((o) => o.ord), 4) },
  { id: 'alf-vokal', grupp: 'Alfabetet', namn: 'Välj vokalen', niva: 2,
    build: (seed) =>
      buildPass(seed, 8, (rng) => {
        const ratt = pick(VOKALER, rng);
        const fel = pickN(KONSONANTER, 2, rng);
        return quiz(
          {
            prompt: 'Vilken av bokstäverna är en vokal?',
            ratt: { letter: ratt.toUpperCase(), say: ratt },
            fel: fel.map((b) => ({ letter: b.toUpperCase(), say: b })),
          },
          rng
        );
      }) },
  { id: 'alf-konsonant', grupp: 'Alfabetet', namn: 'Välj konsonanten', niva: 2,
    build: (seed) =>
      buildPass(seed, 8, (rng) => {
        const ratt = pick(KONSONANTER, rng);
        const fel = pickN(VOKALER, 2, rng);
        return quiz(
          {
            prompt: 'Vilken av bokstäverna är en konsonant?',
            ratt: { letter: ratt.toUpperCase(), say: ratt },
            fel: fel.map((b) => ({ letter: b.toUpperCase(), say: b })),
          },
          rng
        );
      }) },
  { id: 'alf-nasta-1', grupp: 'Alfabetet', namn: 'Nästa bokstav 1', niva: 2,
    build: (seed) => nastaBokstav(seed, true) },
  { id: 'alf-nasta-2', grupp: 'Alfabetet', namn: 'Nästa bokstav 2', niva: 2,
    build: (seed) => nastaBokstav(seed + 31, true) },
  { id: 'alf-nasta-gem-1', grupp: 'Alfabetet', namn: 'Nästa bokstav (gemener) 1', niva: 2,
    build: (seed) => nastaBokstav(seed, false) },
  { id: 'alf-nasta-gem-2', grupp: 'Alfabetet', namn: 'Nästa bokstav (gemener) 2', niva: 2,
    build: (seed) => nastaBokstav(seed + 41, false) },

  { id: 'skriv-djuret-2', grupp: 'Skriva blandat', namn: 'Skriv djuret', niva: 2,
    build: (seed) => skrivOrdet(DJUR, seed) },
  { id: 'skriv-verb', grupp: 'Skriva blandat', namn: 'Skriv ordet – Verb', niva: 2,
    build: (seed) => skrivOrdet(VERB, seed) },
  { id: 'skriv-farger-2', grupp: 'Skriva blandat', namn: 'Skriv ordet – Färger', niva: 2,
    build: (seed) => skrivOrdet(FARGER, seed + 3) },

  { id: 'gram-en-ett-1', grupp: 'Grammatik', namn: 'En eller ett (1)', niva: 2,
    build: (seed) => enEllerEtt(seed) },
  { id: 'gram-en-ett-2', grupp: 'Grammatik', namn: 'En eller ett (2)', niva: 2,
    build: (seed) => enEllerEtt(seed + 29) },
  { id: 'gram-stor-liten', grupp: 'Grammatik', namn: 'Stor/liten bokstav', niva: 2,
    build: (seed) =>
      buildPass(seed, 8, (rng) => {
        const egen = rng() < 0.5;
        const ord = pick(egen ? EGENNAMN : VANLIGA_ORD, rng);
        const gemen = ord.toLowerCase();
        const versal = ord.charAt(0).toUpperCase() + ord.slice(1).toLowerCase();
        return quiz(
          {
            prompt: 'Hur ska ordet skrivas?',
            replay: ord,
            ratt: { word: egen ? versal : gemen, say: ord },
            fel: [{ word: egen ? gemen : versal, say: ord }],
            compact: true,
          },
          rng
        );
      }) },
  { id: 'gram-adjektiv-form', grupp: 'Grammatik', namn: 'Adjektiv välj rätt form', niva: 2,
    build: (seed) =>
      buildFromBank(seed, ADJEKTIVFORMER, 8, (item, rng) => {
        const variant = pick(['en', 'ett', 'flera'] as const, rng);
        const substantiv =
          variant === 'en' ? pick(EN_ORD, rng) : variant === 'ett' ? pick(ETT_ORD, rng) : 'bilar';
        const mening =
          variant === 'en' ? `en ___ ${substantiv}`
            : variant === 'ett' ? `ett ___ ${substantiv}`
              : `flera ___ ${substantiv}`;
        const ratt =
          variant === 'en' ? item.enForm : variant === 'ett' ? item.ettForm : item.pluralForm;
        const fel = [item.enForm, item.ettForm, item.pluralForm].filter((f) => f !== ratt);
        return quiz(
          {
            prompt: 'Vilken form av ordet passar?',
            replay: mening.replace('___', ratt),
            shown: { sentence: mening },
            ratt: { word: ratt },
            fel: fel.map((f) => ({ word: f })),
          },
          rng
        );
      }) },
  { id: 'gram-en-flera', grupp: 'Grammatik', namn: 'En / flera 2', niva: 2,
    build: (seed) =>
      buildFromBank(seed, EN_FLERA, 8, (item, rng, bank) => {
        const [ental, flertal] = item;
        const fel = pickN(bank.filter((p) => p[1] !== flertal).map((p) => p[1]), 2, rng);
        return quiz(
          {
            // Ordet visas i stället för att stoppas in i frågan: "flera bok"
            // är inte svenska, och att böja rätt i frågan vore att ge svaret.
            prompt: 'Vad heter det när det är flera?',
            replay: `en ${ental}, flera ${flertal}`,
            shown: { word: ental },
            ratt: { word: flertal },
            fel: fel.map((f) => ({ word: f })),
          },
          rng
        );
      }) },

  { id: 'ord-hor-inte-ihop', grupp: 'Ordförståelse', namn: 'Vilket ord hör inte ihop', niva: 2,
    build: (seed) =>
      buildFromBank(seed, HOR_INTE_IHOP, 8, (item, rng) =>
        quiz(
          {
            prompt: 'Vilket ord hör inte ihop med de andra?',
            replay: [...item.hor, item.avvikare].join(', '),
            ratt: { word: item.avvikare },
            fel: item.hor.map((o) => ({ word: o })),
          },
          rng
        )
      ) },
  { id: 'ord-gator', grupp: 'Ordförståelse', namn: 'Gåtor', niva: 2,
    build: (seed) =>
      buildFromBank(seed, GATOR, 6, (item, rng) =>
        quiz(
          {
            prompt: item.fraga,
            replay: item.fraga,
            ratt: { emoji: item.emoji, say: item.svar },
            fel: item.fel.map(([o, e]) => ({ emoji: e, say: o })),
          },
          rng
        )
      ) },

  { id: 'kortvokal-dubbel-valj', grupp: 'Kort vokal', namn: 'Välj rätt stavning – Dubbelteckning', niva: 2,
    build: (seed) => valjStavning(DUBBELTECKNING, seed) },
  { id: 'kortvokal-skriv', grupp: 'Kort vokal', namn: 'Skriv ordet – Korta vokaler', niva: 2,
    build: (seed) => skrivOrdet(KORTA_VOKALER, seed + 5) },
  { id: 'kortvokal-dubbel-skriv', grupp: 'Kort vokal', namn: 'Skriv ordet – Dubbelteckning', niva: 2,
    build: (seed) => skrivStavning(DUBBELTECKNING, seed) },

  { id: 'ck-skriv', grupp: 'CK-ljudet', namn: 'Skriv ordet (CK)', niva: 2,
    build: (seed) => skrivStavning(CK_LJUDET, seed) },

  { id: 'dag-veckodagar-ordning', grupp: 'Dag/Månad', namn: 'Veckodagar ordning', niva: 2,
    build: (seed) =>
      buildPass(seed, 4, (rng) => {
        const start = Math.floor(rng() * 4);
        return orderItems('Lägg veckodagarna i rätt ordning.', VECKODAGAR.slice(start, start + 4), rng);
      }) },
  { id: 'dag-veckodagar-fore-efter', grupp: 'Dag/Månad', namn: 'Veckodagar före/efter', niva: 2,
    build: (seed) =>
      buildPass(seed, 8, (rng) => {
        const i = Math.floor(rng() * VECKODAGAR.length);
        const efter = rng() < 0.5;
        const svarIndex = efter ? (i + 1) % 7 : (i + 6) % 7;
        const fel = pickN(VECKODAGAR.filter((_, k) => k !== svarIndex && k !== i), 2, rng);
        return quiz(
          {
            prompt: `Vilken dag kommer ${efter ? 'efter' : 'före'} ${VECKODAGAR[i]}?`,
            replay: VECKODAGAR[svarIndex],
            shown: { word: VECKODAGAR[i] },
            ratt: { word: VECKODAGAR[svarIndex] },
            fel: fel.map((d) => ({ word: d })),
          },
          rng
        );
      }) },
  { id: 'dag-manader', grupp: 'Dag/Månad', namn: 'Månader', niva: 2,
    build: (seed) =>
      buildPass(seed, 4, (rng) => {
        const start = Math.floor(rng() * 9);
        return orderItems('Lägg månaderna i rätt ordning.', MANADER.slice(start, start + 4), rng);
      }) },

  { id: 'rak-skriv-siffran-niva2', grupp: 'Räkneord', namn: 'Skriv siffran', niva: 2,
    build: (seed) =>
      buildFromBank(seed + 3, RAKNEORD, 8, (item) =>
        typeWord({
          prompt: 'Skriv talet med bokstäver.', answer: item.ord, replay: item.ord,
          emoji: item.emoji,
        })
      ) },
];

// ── Svenska 3 ───────────────────────────────────────────────────────────────

const SVENSKA_3: TaskDef[] = [
  { id: 'skriv-djuret-3', grupp: 'Skriva blandat', namn: 'Skriv djuret', niva: 3,
    build: (seed) => skrivOrdet(DJUR, seed + 47) },
  { id: 'skriv-ljudstridiga', grupp: 'Skriva blandat', namn: 'Ljudstridiga låneord', niva: 3,
    build: (seed) => skrivOrdet(LJUDSTRIDIGA, seed) },

  { id: 'j-valj-1', grupp: 'J-ljudet', namn: 'Välj rätt stavning 1', niva: 3,
    build: (seed) => valjStavning(J_LJUDET_J, seed) },
  { id: 'j-valj-2', grupp: 'J-ljudet', namn: 'Välj rätt stavning 2', niva: 3,
    build: (seed) => valjStavning(J_LJUDET_G, seed) },
  { id: 'j-skriv-j', grupp: 'J-ljudet', namn: 'Skriv ordet (J)', niva: 3,
    build: (seed) => skrivStavning(J_LJUDET_J, seed) },
  { id: 'j-skriv-g', grupp: 'J-ljudet', namn: 'Skriv ordet (G)', niva: 3,
    build: (seed) => skrivStavning(J_LJUDET_G, seed) },
  { id: 'j-skriv-ovriga', grupp: 'J-ljudet', namn: 'Skriv ordet (HJ, LJ, DJ)', niva: 3,
    build: (seed) => skrivStavning(J_LJUDET_OVRIGA, seed) },
  { id: 'j-skriv-blandat', grupp: 'J-ljudet', namn: 'Skriv ordet (J blandat)', niva: 3,
    build: (seed) => skrivStavning([...J_LJUDET_J, ...J_LJUDET_G, ...J_LJUDET_OVRIGA], seed) },

  { id: 'm-valj', grupp: 'M-ljudet', namn: 'Välj rätt stavning', niva: 3,
    build: (seed) => valjStavning(M_LJUDET, seed) },
  { id: 'm-skriv', grupp: 'M-ljudet', namn: 'Skriv ordet', niva: 3,
    build: (seed) => skrivStavning(M_LJUDET, seed) },

  { id: 'sj-valj', grupp: 'SJ-ljudet', namn: 'Välj rätt stavning', niva: 3,
    build: (seed) => valjStavning([...SJ_LJUDET_SJ, ...SJ_LJUDET_SK], seed) },
  { id: 'sj-skriv-sj', grupp: 'SJ-ljudet', namn: 'Skriv ordet (SJ)', niva: 3,
    build: (seed) => skrivStavning(SJ_LJUDET_SJ, seed) },
  { id: 'sj-skriv-sk', grupp: 'SJ-ljudet', namn: 'Skriv ordet (SK)', niva: 3,
    build: (seed) => skrivStavning(SJ_LJUDET_SK, seed) },
  { id: 'sj-skriv-ovriga', grupp: 'SJ-ljudet', namn: 'Skriv ordet (SCH, STJ, SKJ)', niva: 3,
    build: (seed) => skrivStavning(SJ_LJUDET_OVRIGA, seed) },
  { id: 'sj-skriv-blandat', grupp: 'SJ-ljudet', namn: 'Skriv ordet (SJ blandat)', niva: 3,
    build: (seed) => skrivStavning([...SJ_LJUDET_SJ, ...SJ_LJUDET_SK, ...SJ_LJUDET_OVRIGA], seed) },

  { id: 'tj-valj', grupp: 'TJ-ljudet', namn: 'Välj rätt stavning', niva: 3,
    build: (seed) => valjStavning([...TJ_LJUDET_TJ, ...TJ_LJUDET_K], seed) },
  { id: 'tj-skriv-tj', grupp: 'TJ-ljudet', namn: 'Skriv ordet (TJ)', niva: 3,
    build: (seed) => skrivStavning(TJ_LJUDET_TJ, seed) },
  { id: 'tj-skriv-k', grupp: 'TJ-ljudet', namn: 'Skriv ordet (K)', niva: 3,
    build: (seed) => skrivStavning(TJ_LJUDET_K, seed) },
  { id: 'tj-skriv-blandat', grupp: 'TJ-ljudet', namn: 'Skriv ordet (TJ blandat)', niva: 3,
    build: (seed) => skrivStavning([...TJ_LJUDET_TJ, ...TJ_LJUDET_K], seed) },

  { id: 'ng-skriv-ng', grupp: 'NG-ljudet', namn: 'Skriv ordet (NG)', niva: 3,
    build: (seed) => skrivStavning(NG_LJUDET_NG, seed) },
  { id: 'ng-skriv-n', grupp: 'NG-ljudet', namn: 'Skriv ordet (N)', niva: 3,
    build: (seed) => skrivStavning(NG_LJUDET_N, seed) },
  { id: 'ng-skriv-blandat', grupp: 'NG-ljudet', namn: 'Skriv ordet (NG blandat)', niva: 3,
    build: (seed) => skrivStavning([...NG_LJUDET_NG, ...NG_LJUDET_N], seed) },

  { id: 'gram-valj-substantiv', grupp: 'Grammatik', namn: 'Välj substantivet', niva: 3,
    build: (seed) => valjOrdklass(seed, 'substantiv') },
  { id: 'gram-valj-verb', grupp: 'Grammatik', namn: 'Välj verbet', niva: 3,
    build: (seed) => valjOrdklass(seed, 'verb') },
  { id: 'gram-valj-adjektiv', grupp: 'Grammatik', namn: 'Välj adjektivet', niva: 3,
    build: (seed) => valjOrdklass(seed, 'adjektiv') },

  { id: 'ord-sammansatta-1', grupp: 'Ordförståelse', namn: 'Sammansatta ord 1', niva: 3,
    build: (seed) => sammansattaQuiz(seed) },
  { id: 'ord-sammansatta-2', grupp: 'Ordförståelse', namn: 'Sammansatta ord 2', niva: 3,
    build: (seed) => sammansattaQuiz(seed + 37) },
  { id: 'ord-sammansatta-skriv', grupp: 'Ordförståelse', namn: 'Skriv sammansatta ord', niva: 3,
    build: (seed) =>
      buildFromBank(seed, SAMMANSATTA, 8, ([forled, efterled, helt, emoji]) =>
        typeWord({
          prompt: `Vad blir ${forled} och ${efterled} tillsammans?`,
          answer: helt, emoji, replay: helt,
        })
      ) },
  { id: 'ord-synonymer-1', grupp: 'Ordförståelse', namn: 'Synonymer 1', niva: 3,
    build: (seed) => ordparQuiz(SYNONYMER, seed, (o) => `Vilket ord betyder ungefär samma som ${o}?`) },
  { id: 'ord-synonymer-2', grupp: 'Ordförståelse', namn: 'Synonymer 2', niva: 3,
    build: (seed) => ordparQuiz(SYNONYMER, seed + 43, (o) => `Vilket ord betyder ungefär samma som ${o}?`) },
  { id: 'ord-liknelser', grupp: 'Ordförståelse', namn: 'Liknelser djur', niva: 3,
    build: (seed) =>
      buildFromBank(seed, LIKNELSER_DJUR, 8, (item, rng, bank) => {
        const fel = pickN(bank.filter((l) => l.svar !== item.svar), 2, rng);
        return quiz(
          {
            prompt: 'Vilket djur passar i uttrycket?',
            replay: `${item.text} ${item.svar}`,
            shown: { sentence: item.text },
            ratt: { emoji: item.emoji, say: item.svar },
            fel: fel.map((f) => ({ emoji: f.emoji, say: f.svar })),
          },
          rng
        );
      }) },
];

// ── Svenska 4 ───────────────────────────────────────────────────────────────

const SVENSKA_4: TaskDef[] = [
  { id: 'alf-ordning-lika-1', grupp: 'Alfabetet', namn: 'Alfabetisk ordning – lika första bokstav', niva: 4,
    build: (seed) => alfabetiskOrdning(seed, ['bok', 'boll', 'bord', 'bil', 'björn', 'brev'], 3) },
  { id: 'alf-ordning-lika-2', grupp: 'Alfabetet', namn: 'Alfabetisk ordning – lika första bokstäver', niva: 4,
    build: (seed) => alfabetiskOrdning(seed, ['stol', 'sten', 'stad', 'stig', 'stor', 'strand'], 4) },

  { id: 'stav-lang-kort-1', grupp: 'Stavning', namn: 'Lång eller kort vokal', niva: 4,
    build: (seed) =>
      buildFromBank(seed, VOKALPAR, 8, (item, rng) => {
        const langVokal = rng() < 0.5;
        const svar = langVokal ? item.lang : item.kort;
        return quiz(
          {
            prompt: `Hur stavas ordet ${svar}?`,
            replay: svar,
            ratt: { word: svar },
            fel: [{ word: langVokal ? item.kort : item.lang }],
            compact: true,
          },
          rng
        );
      }) },
  { id: 'stav-lang-kort-2', grupp: 'Stavning', namn: 'Lång eller kort vokal 2', niva: 4,
    build: (seed) =>
      buildFromBank(seed, VOKALPAR, 8, (item, rng) => {
        const langVokal = rng() < 0.5;
        const ord = langVokal ? item.lang : item.kort;
        return quiz(
          {
            prompt: 'Har ordet lång eller kort vokal?',
            replay: ord,
            shown: { word: ord },
            ratt: { word: langVokal ? 'lång' : 'kort' },
            fel: [{ word: langVokal ? 'kort' : 'lång' }],
            compact: true,
          },
          rng
        );
      }) },

  { id: 'ng-saknade-1', grupp: 'NG-ljudet', namn: 'Skriv det saknade ordet', niva: 4,
    build: (seed) => saknadeOrdet(seed, NG_MENINGAR) },
  { id: 'ng-saknade-2', grupp: 'NG-ljudet', namn: 'Skriv det saknade ordet 2', niva: 4,
    build: (seed) => saknadeOrdet(seed, N_MENINGAR) },

  { id: 'skilje-1', grupp: 'Skiljetecken', namn: 'Välj rätt skiljetecken', niva: 4,
    build: (seed) => skiljeteckenQuiz(seed) },
  { id: 'skilje-2', grupp: 'Skiljetecken', namn: 'Välj rätt skiljetecken 2', niva: 4,
    build: (seed) => skiljeteckenQuiz(seed + 53) },
];

// ── Uppgiftsspecifika byggare ───────────────────────────────────────────────

function rimMedBilder(seed: number): Exercise[] {
  return buildFromBank(seed, RIM, 8, (item, rng) =>
    quiz(
      {
        prompt: `Vilken bild rimmar på ${item.ord}?`,
        replay: item.ord,
        shown: { emoji: item.emoji, word: item.ord },
        ratt: { emoji: item.rimEmoji, say: item.rim },
        fel: item.fel.map(([o, e]) => ({ emoji: e, say: o })),
      },
      rng
    )
  );
}

function rimMedText(seed: number): Exercise[] {
  return buildFromBank(seed, RIM, 8, (item, rng) =>
    quiz(
      {
        prompt: `Vilket ord rimmar på ${item.ord}?`,
        replay: item.ord,
        shown: { word: item.ord },
        ratt: { word: item.rim },
        fel: item.fel.map(([o]) => ({ word: o })),
      },
      rng
    )
  );
}

function alfabetiskOrdning(seed: number, bank: string[], antal: number): Exercise[] {
  return buildPass(seed, 5, (rng) => {
    const urval = pickN(bank, antal, rng);
    if (urval.length < antal) return null;
    // localeCompare med svensk locale – annars hamnar å, ä och ö fel.
    const ordning = [...urval].sort((a, b) => a.localeCompare(b, 'sv'));
    return orderItems('Lägg orden i alfabetisk ordning.', ordning, rng);
  });
}

function nastaBokstav(seed: number, versal: boolean): Exercise[] {
  return buildPass(seed, 8, (rng) => {
    const i = Math.floor(rng() * (ALFABETET.length - 1));
    const svar = ALFABETET[i + 1];
    const fel = andraOrd(ALFABETET, [ALFABETET[i], svar], rng, 2);
    const visa = (b: string) => (versal ? b.toUpperCase() : b);
    return quiz(
      {
        prompt: `Vilken bokstav kommer efter ${ALFABETET[i]}?`,
        replay: svar,
        shown: { letter: visa(ALFABETET[i]) },
        ratt: { letter: visa(svar), say: svar },
        fel: fel.map((b) => ({ letter: visa(b), say: b })),
      },
      rng
    );
  });
}

function enEllerEtt(seed: number): Exercise[] {
  return buildPass(seed, 8, (rng) => {
    const enOrd = rng() < 0.5;
    const ord = pick(enOrd ? EN_ORD : ETT_ORD, rng);
    return quiz(
      {
        prompt: `Säger man en eller ett ${ord}?`,
        replay: `${enOrd ? 'en' : 'ett'} ${ord}`,
        shown: { word: ord },
        ratt: { word: enOrd ? 'en' : 'ett' },
        fel: [{ word: enOrd ? 'ett' : 'en' }],
        compact: true,
      },
      rng
    );
  });
}

function valjOrdklass(seed: number, klass: 'substantiv' | 'verb' | 'adjektiv'): Exercise[] {
  const banker = {
    substantiv: SUBSTANTIV.map((o) => o.ord),
    verb: VERB.map((o) => o.ord),
    adjektiv: ADJEKTIV.map((o) => o.ord),
  };
  const ratt = banker[klass];
  const andra = (Object.keys(banker) as (keyof typeof banker)[])
    .filter((k) => k !== klass)
    .flatMap((k) => banker[k]);

  return buildPass(seed, 8, (rng) => {
    const svar = pick(ratt, rng);
    const fel = pickN(andra, 2, rng);
    return quiz(
      {
        prompt: `Vilket ord är ett ${klass}?`,
        replay: svar,
        ratt: { word: svar },
        fel: fel.map((o) => ({ word: o })),
      },
      rng
    );
  });
}

function sammansattaQuiz(seed: number): Exercise[] {
  return buildFromBank(seed, SAMMANSATTA, 8, ([forled, , helt, emoji], rng, bank) => {
    const fel = pickN(bank.filter((s) => s[2] !== helt).map((s) => s[2]), 2, rng);
    return quiz(
      {
        prompt: `Vilket ord börjar på ${forled}?`,
        replay: helt,
        shown: { emoji },
        ratt: { word: helt },
        fel: fel.map((o) => ({ word: o })),
      },
      rng
    );
  });
}

function saknadeOrdet(seed: number, bank: { mening: string; svar: string }[]): Exercise[] {
  return buildFromBank(seed, bank, 8, (item) =>
    typeWord({
      prompt: 'Skriv ordet som saknas i meningen.',
      answer: item.svar,
      sentence: item.mening,
      // Hela meningen läses upp med ordet i – då hör eleven det i sitt
      // sammanhang i stället för som ett löst ord.
      replay: item.mening.replace('___', item.svar),
    })
  );
}

function skiljeteckenQuiz(seed: number): Exercise[] {
  return buildFromBank(seed, SKILJETECKEN, 8, (item, rng) => {
    const alla: ('.' | '?' | '!')[] = ['.', '?', '!'];
    return quiz(
      {
        prompt: 'Vilket skiljetecken ska meningen sluta med?',
        replay: item.mening,
        shown: { sentence: `${item.mening} ___` },
        ratt: { word: item.svar, say: namnPaTecken(item.svar) },
        fel: alla.filter((t) => t !== item.svar).map((t) => ({ word: t, say: namnPaTecken(t) })),
      },
      rng
    );
  });
}

function namnPaTecken(t: '.' | '?' | '!'): string {
  return t === '.' ? 'punkt' : t === '?' ? 'frågetecken' : 'utropstecken';
}

function byggMeningen(seed: number): Exercise[] {
  const MENINGAR = [
    ['Leo', 'har', 'en', 'boll'],
    ['Katten', 'sover', 'på', 'stolen'],
    ['Jag', 'läser', 'en', 'bok'],
    ['Hunden', 'springer', 'i', 'skogen'],
    ['Vi', 'går', 'till', 'skolan'],
    ['Solen', 'skiner', 'idag'],
  ];
  return buildFromBank(seed, MENINGAR, 6, (ord, rng) => {
    const target = [...ord, '.'];
    const brus = andraOrd(['och', 'inte', 'stor', 'sedan', 'här'], ord, rng, 1);
    return {
      id: `bm-${Math.floor(rng() * 1e6)}`,
      kind: 'build-sentence-cards' as const,
      module: 'ovningsbank' as const,
      target,
      cards: shuffle([...target, ...brus], rng),
      emoji: null,
      prompt: { id: 'p-bm', text: 'Bygg meningen. Stor bokstav först och punkt sist.', lang: 'sv-SE' as const },
      replay: { id: `r-bm-${ord.join('-')}`, text: `${ord.join(' ')}.`, lang: 'sv-SE' as const },
      xp: 5,
    };
  });
}

// ── Katalogen ───────────────────────────────────────────────────────────────

export const TASKS: TaskDef[] = [...SVENSKA_1, ...SVENSKA_2, ...SVENSKA_3, ...SVENSKA_4];

export function tasksForNiva(niva: number): TaskDef[] {
  return TASKS.filter((t) => t.niva === niva);
}

export function taskById(id: string): TaskDef | null {
  return TASKS.find((t) => t.id === id) ?? null;
}

/** Uppgifterna på en nivå, grupperade i listans egna grupper. */
export function grupperadeTasks(niva: number): { grupp: string; meta: GruppMeta; tasks: TaskDef[] }[] {
  const grupper: string[] = [];
  for (const t of tasksForNiva(niva)) {
    if (!grupper.includes(t.grupp)) grupper.push(t.grupp);
  }
  return grupper.map((grupp) => ({
    grupp,
    meta: GRUPPER[grupp] ?? { icon: '📘', tint: 'bg-ink-500 border-ink-700' },
    tasks: tasksForNiva(niva).filter((t) => t.grupp === grupp),
  }));
}
