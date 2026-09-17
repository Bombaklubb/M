/**
 * Svenska ord → emoji.
 *
 * Används när läraren skriver in ett eget tema: hon skriver "räv" och appen
 * föreslår 🦊. Utan det hade hon fått leta i en emoji-väljare för varje ord,
 * och då hade egna teman inte blivit gjorda.
 *
 * Listan är medvetet konkreta substantiv – det är de som går att avbilda.
 * Hittas inget förslag är det inget fel: ordet fungerar ändå i de
 * övningstyper som inte behöver bild (se kindsForWord i themeExercises).
 */
export const EMOJI_INDEX: Record<string, string> = {
  // Djur
  hund: '🐕', katt: '🐈', häst: '🐎', ko: '🐄', gris: '🐷', får: '🐑',
  fågel: '🐦', fisk: '🐟', orm: '🐍', groda: '🐸', mus: '🐭', råtta: '🐀',
  räv: '🦊', varg: '🐺', björn: '🐻', älg: '🫎', hjort: '🦌', hare: '🐇',
  kanin: '🐇', ekorre: '🐿️', igelkott: '🦔', uggla: '🦉', örn: '🦅',
  lejon: '🦁', tiger: '🐅', elefant: '🐘', apa: '🐒', val: '🐋', haj: '🦈',
  krabba: '🦀', spindel: '🕷️', myra: '🐜', bi: '🐝', fjäril: '🦋', mask: '🐛',
  gädda: '🐟', säl: '🦭', delfin: '🐬', pingvin: '🐧', kyckling: '🐤',
  höna: '🐔', tupp: '🐓', anka: '🦆', svan: '🦢', zebra: '🦓', giraff: '🦒',

  // Natur och väder
  sol: '☀️', måne: '🌙', stjärna: '⭐', moln: '☁️', regn: '🌧️', snö: '❄️',
  is: '🧊', blixt: '⚡', åska: '⛈️', vind: '🌬️', dimma: '🌫️', regnbåge: '🌈',
  träd: '🌳', skog: '🌲', blomma: '🌸', gräs: '🌿', löv: '🍃', frö: '🌰',
  svamp: '🍄', kaktus: '🌵', berg: '⛰️', fjäll: '🏔️', vulkan: '🌋',
  hav: '🌊', sjö: '🏞️', vatten: '💧', eld: '🔥', sten: '🪨', sand: '🏖️',
  ö: '🏝️', öken: '🏜️', jord: '🌍', jorden: '🌍', rymden: '🌌', planet: '🪐',
  komet: '☄️', vår: '🌷', sommar: '🌻', höst: '🍂', vinter: '⛄',

  // Kropp
  hjärta: '🫀', hjärna: '🧠', öga: '👁️', öra: '👂', näsa: '👃', mun: '👄',
  tand: '🦷', tunga: '👅', hand: '✋', fot: '🦶', ben: '🦵', arm: '💪',
  finger: '👆', hår: '💇', skelett: '💀', blod: '🩸',

  // Mat
  äpple: '🍎', päron: '🍐', banan: '🍌', apelsin: '🍊', citron: '🍋',
  jordgubbe: '🍓', druva: '🍇', vattenmelon: '🍉', körsbär: '🍒', bär: '🫐',
  morot: '🥕', potatis: '🥔', tomat: '🍅', lök: '🧅', majs: '🌽', ärta: '🫛',
  bröd: '🍞', ost: '🧀', ägg: '🥚', mjölk: '🥛', kött: '🍖', korv: '🌭',
  soppa: '🍲', sallad: '🥗', ris: '🍚', pasta: '🍝', kaka: '🍰', glass: '🍦',
  godis: '🍬', choklad: '🍫', honung: '🍯', kaffe: '☕', te: '🍵', juice: '🧃',

  // Saker och hem
  hus: '🏠', hem: '🏠', dörr: '🚪', fönster: '🪟', säng: '🛏️', stol: '🪑',
  bord: '🪑', lampa: '💡', klocka: '🕐', nyckel: '🔑', bok: '📕', penna: '✏️',
  sax: '✂️', lim: '🧴', väska: '🎒', ryggsäck: '🎒', boll: '⚽', cykel: '🚲',
  bil: '🚗', buss: '🚌', tåg: '🚆', båt: '⛵', skepp: '⛵', flygplan: '✈️',
  raket: '🚀', telefon: '📱', dator: '💻', kamera: '📷', brev: '✉️',
  paket: '📦', låda: '📦', karta: '🗺️', flagga: '🏳️', pengar: '💰',
  present: '🎁', ballong: '🎈', leksak: '🧸', spegel: '🪞', kam: '🪮',
  tallrik: '🍽️', glas: '🥛', kniv: '🔪', gaffel: '🍴', sked: '🥄',
  hammare: '🔨', spik: '📌', yxa: '🪓', spjut: '🏹', svärd: '⚔️',
  sköld: '🛡️', hjälm: '⛑️', krona: '👑', ring: '💍', pärla: '🫧',

  // Kläder
  skjorta: '👕', tröja: '👕', byxa: '👖', kjol: '👗', klänning: '👗',
  jacka: '🧥', mössa: '🧢', hatt: '🎩', sko: '👟', strumpa: '🧦',
  vante: '🧤', halsduk: '🧣', skinn: '🦬',

  // Platser och samhälle
  skola: '🏫', skolan: '🏫', affär: '🏪', affären: '🏪', sjukhus: '🏥',
  kyrka: '⛪', slott: '🏰', bro: '🌉', väg: '🛣️', stad: '🏙️', by: '🏘️',
  gård: '🏡', park: '🌳', parken: '🌳', torg: '⛲', grotta: '🕳️',
  bibliotek: '📚', museum: '🏛️', bank: '🏦', post: '📮',

  // Människor
  mamma: '👩', pappa: '👨', mor: '👩', far: '👨', bror: '👦', syster: '👧',
  barn: '🧒', pojke: '👦', flicka: '👧', bebis: '👶', farmor: '👵',
  farfar: '👴', lärare: '🧑‍🏫', läkare: '🧑‍⚕️', polis: '👮', bonde: '🧑‍🌾',
  kung: '🤴', drottning: '👸', riddare: '🛡️', vikingar: '🛡️',
};

/**
 * Bästa emoji-gissning för ett ord.
 *
 * Provar exakt match först, sedan utan bestämd ändelse ("skolan" → "skola"),
 * eftersom läraren ofta skriver ordet i den form klassen använder.
 */
export function suggestEmoji(word: string): string | null {
  const w = word.trim().toLowerCase();
  if (!w) return null;
  if (EMOJI_INDEX[w]) return EMOJI_INDEX[w];

  for (const suffix of ['erna', 'arna', 'en', 'et', 'n', 'a']) {
    if (w.endsWith(suffix)) {
      const stem = w.slice(0, -suffix.length);
      if (stem.length >= 2 && EMOJI_INDEX[stem]) return EMOJI_INDEX[stem];
    }
  }
  return null;
}

/** Alla emoji i banken, för väljaren. Unika, i den ordning de står. */
export const EMOJI_PALETTE: string[] = [...new Set(Object.values(EMOJI_INDEX))];
