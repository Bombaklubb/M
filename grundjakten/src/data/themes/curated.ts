import { defineTheme } from './defineTheme';

/**
 * Färdiga teman som täcker vanligt innehåll i åk 4.
 *
 * Orden är valda för att vara KONKRETA, eftersom bildlagret är emoji.
 * "Avdunstning" och "demokrati" har ingen bild och hör därför inte hemma
 * här – de får tas muntligt av läraren. Det är den medvetna kompromissen:
 * eleven arbetar med klassens tema, men med temats gripbara ord.
 *
 * Minitexterna är korta med flit. De läses upp, eleven behöver aldrig läsa
 * dem själv, och frågorna besvaras med bilder.
 */

export const CURATED_THEMES = [
  // ── NO ──
  defineTheme({
    id: 'vattnet',
    title: 'Vattnets kretslopp',
    subject: 'NO',
    icon: '💧',
    words: [
      ['vatten', '💧'], ['moln', '☁️'], ['regn', '🌧️'], ['sjö', '🏞️'],
      ['hav', '🌊'], ['is', '🧊'], ['snö', '❄️'], ['sol', '☀️'],
    ],
    microTexts: [
      {
        sentences: [
          'Solen värmer havet.',
          'Vattnet stiger upp och blir moln.',
          'Ur molnen faller regn.',
          'Regnet rinner tillbaka till havet.',
        ],
        questions: [
          ['Vad faller ur molnen?', 'regn'],
          ['Vad värmer havet?', 'sol'],
        ],
      },
    ],
  }),

  defineTheme({
    id: 'kroppen',
    title: 'Kroppen',
    subject: 'NO',
    icon: '🫀',
    words: [
      ['hjärta', '🫀'], ['hjärna', '🧠'], ['hand', '✋'], ['fot', '🦶'],
      ['öga', '👁️'], ['öra', '👂'], ['tand', '🦷'], ['ben', '🦵'],
    ],
    microTexts: [
      {
        sentences: [
          'Hjärtat pumpar blod.',
          'Det slår hela dagen och hela natten.',
          'Med öronen hör du ljud.',
          'Med ögonen ser du.',
        ],
        questions: [
          ['Vad pumpar blod?', 'hjärta'],
          ['Vad hör du med?', 'öra'],
        ],
      },
    ],
  }),

  defineTheme({
    id: 'djur',
    title: 'Djur i Sverige',
    subject: 'NO',
    icon: '🦌',
    words: [
      ['älg', '🫎'], ['räv', '🦊'], ['hare', '🐇'], ['uggla', '🦉'],
      ['gädda', '🐟'], ['orm', '🐍'], ['björn', '🐻'], ['ekorre', '🐿️'],
    ],
    microTexts: [
      {
        sentences: [
          'Älgen är Sveriges största djur.',
          'Den äter löv och kvistar.',
          'Björnen sover hela vintern.',
          'Räven letar mat på natten.',
        ],
        questions: [
          ['Vilket djur är störst?', 'älg'],
          ['Vem sover hela vintern?', 'björn'],
        ],
      },
    ],
  }),

  defineTheme({
    id: 'vaxter',
    title: 'Växter',
    subject: 'NO',
    icon: '🌱',
    words: [
      ['blomma', '🌸'], ['träd', '🌳'], ['löv', '🍃'], ['rot', '🥕'],
      ['frö', '🌰'], ['gräs', '🌿'], ['svamp', '🍄'], ['kotte', '🌲'],
    ],
    microTexts: [
      {
        sentences: [
          'Ett frö läggs i jorden.',
          'Roten växer nedåt.',
          'Stjälken växer uppåt mot solen.',
          'Sedan kommer en blomma.',
        ],
        questions: [
          ['Vad växer nedåt?', 'rot'],
          ['Vad kommer till sist?', 'blomma'],
        ],
      },
    ],
  }),

  defineTheme({
    id: 'rymden',
    title: 'Rymden',
    subject: 'NO',
    icon: '🚀',
    words: [
      ['sol', '☀️'], ['måne', '🌙'], ['jorden', '🌍'], ['stjärna', '⭐'],
      ['raket', '🚀'], ['planet', '🪐'], ['komet', '☄️'], ['rymden', '🌌'],
    ],
    microTexts: [
      {
        sentences: [
          'Jorden snurrar runt solen.',
          'Månen snurrar runt jorden.',
          'På natten ser vi stjärnor.',
          'En raket kan flyga ut i rymden.',
        ],
        questions: [
          ['Vad snurrar runt jorden?', 'måne'],
          ['Vad ser vi på natten?', 'stjärna'],
        ],
      },
    ],
  }),

  defineTheme({
    id: 'vader',
    title: 'Väder och årstider',
    subject: 'NO',
    icon: '🌦️',
    words: [
      ['sommar', '🌻'], ['vinter', '⛄'], ['höst', '🍂'], ['vår', '🌷'],
      ['regn', '🌧️'], ['snö', '❄️'], ['vind', '🌬️'], ['åska', '⛈️'],
    ],
    microTexts: [
      {
        sentences: [
          'På vintern är det kallt.',
          'Då kan det falla snö.',
          'På sommaren är det varmt.',
          'Löven faller på hösten.',
        ],
        questions: [
          ['När faller löven?', 'höst'],
          ['Vad faller på vintern?', 'snö'],
        ],
      },
    ],
  }),

  // ── SO ──
  defineTheme({
    id: 'vikingatiden',
    title: 'Vikingatiden',
    subject: 'SO',
    icon: '🛡️',
    words: [
      ['skepp', '⛵'], ['sköld', '🛡️'], ['yxa', '🪓'], ['hjälm', '⛑️'],
      ['gård', '🏡'], ['runa', '🪨'], ['hav', '🌊'], ['svärd', '⚔️'],
    ],
    microTexts: [
      {
        sentences: [
          'Vikingarna bodde i Norden.',
          'De seglade långt över havet.',
          'Skeppen var långa och smala.',
          'De skrev med runor på sten.',
        ],
        questions: [
          ['Vad seglade vikingarna med?', 'skepp'],
          ['Vad skrev de med?', 'runa'],
        ],
      },
    ],
  }),

  defineTheme({
    id: 'stenaldern',
    title: 'Stenåldern',
    subject: 'SO',
    icon: '🔥',
    words: [
      ['eld', '🔥'], ['sten', '🪨'], ['spjut', '🏹'], ['grotta', '🕳️'],
      ['skinn', '🦬'], ['fisk', '🐟'], ['bär', '🫐'], ['ben', '🦴'],
    ],
    microTexts: [
      {
        sentences: [
          'På stenåldern fanns inga hus.',
          'Människorna bodde i grottor.',
          'De jagade djur med spjut.',
          'Elden gav värme och ljus.',
        ],
        questions: [
          ['Var bodde människorna?', 'grotta'],
          ['Vad jagade de med?', 'spjut'],
        ],
      },
    ],
  }),

  defineTheme({
    id: 'sverige',
    title: 'Sverige',
    subject: 'SO',
    icon: '🇸🇪',
    words: [
      ['karta', '🗺️'], ['skog', '🌲'], ['fjäll', '🏔️'], ['sjö', '🏞️'],
      ['stad', '🏙️'], ['flagga', '🇸🇪'], ['kust', '🏖️'], ['ö', '🏝️'],
    ],
    microTexts: [
      {
        sentences: [
          'Sverige är ett långt land.',
          'I norr finns höga fjäll.',
          'Det finns mycket skog.',
          'Runt landet finns hav och kust.',
        ],
        questions: [
          ['Vad finns i norr?', 'fjäll'],
          ['Vad finns det mycket av?', 'skog'],
        ],
      },
    ],
  }),

  // ── Engelska ──
  defineTheme({
    id: 'en-animals',
    title: 'Animals',
    subject: 'engelska',
    icon: '🐘',
    lang: 'en-GB',
    words: [
      ['dog', '🐕'], ['cat', '🐈'], ['horse', '🐎'], ['bird', '🐦'],
      ['fish', '🐟'], ['bear', '🐻'], ['elephant', '🐘'], ['sheep', '🐑'],
    ],
    microTexts: [
      {
        sentences: [
          'The dog runs fast.',
          'The cat sleeps all day.',
          'The bird can fly.',
          'The fish lives in water.',
        ],
        questions: [
          ['Which animal can fly?', 'bird'],
          ['Which animal sleeps all day?', 'cat'],
        ],
      },
    ],
  }),

  defineTheme({
    id: 'en-food',
    title: 'Food and drink',
    subject: 'engelska',
    icon: '🍎',
    lang: 'en-GB',
    words: [
      ['apple', '🍎'], ['bread', '🍞'], ['milk', '🥛'], ['cheese', '🧀'],
      ['egg', '🥚'], ['water', '💧'], ['banana', '🍌'], ['cake', '🍰'],
    ],
    microTexts: [
      {
        sentences: [
          'I eat an apple.',
          'I drink milk.',
          'The bread is fresh.',
          'The cake is sweet.',
        ],
        questions: [
          ['What do I drink?', 'milk'],
          ['What is sweet?', 'cake'],
        ],
      },
    ],
  }),

  defineTheme({
    id: 'en-family',
    title: 'My family and home',
    subject: 'engelska',
    icon: '🏠',
    lang: 'en-GB',
    words: [
      ['house', '🏠'], ['mother', '👩'], ['father', '👨'], ['sister', '👧'],
      ['brother', '👦'], ['door', '🚪'], ['bed', '🛏️'], ['garden', '🌷'],
    ],
    microTexts: [
      {
        sentences: [
          'This is my house.',
          'My mother is in the garden.',
          'My brother sleeps in his bed.',
          'The door is open.',
        ],
        questions: [
          ['Who is in the garden?', 'mother'],
          ['What is open?', 'door'],
        ],
      },
    ],
  }),
];
