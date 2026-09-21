/**
 * Ordbanker för övningsbanken.
 *
 * Nästan alla uppgifter i listan är samma handfull mekaniker med olika ord.
 * Därför ligger orden här, skilt från uppgifterna – att lägga till
 * "Skriv ordet – Frukter" blir då en rad i katalogen och en lista här, inte
 * en ny övningstyp.
 */

export interface Ord {
  ord: string;
  emoji?: string;
}

// ── Grundläggande ordgrupper ────────────────────────────────────────────────

export const FARGER: Ord[] = [
  { ord: 'röd', emoji: '🟥' }, { ord: 'blå', emoji: '🟦' }, { ord: 'gul', emoji: '🟨' },
  { ord: 'grön', emoji: '🟩' }, { ord: 'svart', emoji: '⬛' }, { ord: 'vit', emoji: '⬜' },
  { ord: 'brun', emoji: '🟫' }, { ord: 'rosa', emoji: '🌸' }, { ord: 'lila', emoji: '🟪' },
  { ord: 'orange', emoji: '🟧' },
];

export const DJUR: Ord[] = [
  { ord: 'hund', emoji: '🐕' }, { ord: 'katt', emoji: '🐈' }, { ord: 'häst', emoji: '🐎' },
  { ord: 'ko', emoji: '🐄' }, { ord: 'gris', emoji: '🐷' }, { ord: 'får', emoji: '🐑' },
  { ord: 'räv', emoji: '🦊' }, { ord: 'björn', emoji: '🐻' }, { ord: 'älg', emoji: '🫎' },
  { ord: 'mus', emoji: '🐭' }, { ord: 'orm', emoji: '🐍' }, { ord: 'fisk', emoji: '🐟' },
  { ord: 'fågel', emoji: '🐦' }, { ord: 'uggla', emoji: '🦉' }, { ord: 'lejon', emoji: '🦁' },
  { ord: 'apa', emoji: '🐒' }, { ord: 'zebra', emoji: '🦓' }, { ord: 'val', emoji: '🐋' },
  { ord: 'hare', emoji: '🐇' }, { ord: 'igelkott', emoji: '🦔' },
];

export const VERB: Ord[] = [
  { ord: 'springa', emoji: '🏃' }, { ord: 'hoppa', emoji: '🦘' }, { ord: 'läsa', emoji: '📖' },
  { ord: 'skriva', emoji: '✍️' }, { ord: 'sova', emoji: '😴' }, { ord: 'äta', emoji: '🍽️' },
  { ord: 'dricka', emoji: '🥤' }, { ord: 'sjunga', emoji: '🎤' }, { ord: 'simma', emoji: '🏊' },
  { ord: 'rita', emoji: '🎨' }, { ord: 'cykla', emoji: '🚴' }, { ord: 'gråta', emoji: '😢' },
];

export const SUBSTANTIV: Ord[] = [
  { ord: 'nyckel', emoji: '🔑' }, { ord: 'stol', emoji: '🪑' }, { ord: 'hus', emoji: '🏠' },
  { ord: 'bil', emoji: '🚗' }, { ord: 'bok', emoji: '📕' }, { ord: 'boll', emoji: '⚽' },
  { ord: 'lampa', emoji: '💡' }, { ord: 'dörr', emoji: '🚪' }, { ord: 'sked', emoji: '🥄' },
  { ord: 'skog', emoji: '🌲' },
];

export const ADJEKTIV: Ord[] = [
  { ord: 'stor' }, { ord: 'liten' }, { ord: 'glad' }, { ord: 'ledsen' },
  { ord: 'snabb' }, { ord: 'trött' }, { ord: 'varm' }, { ord: 'kall' },
  { ord: 'gul' }, { ord: 'tung' },
];

/** Korta ljudenliga ord med bild – för "Skriv ordet (korta ord)". */
export const KORTA_ORD: Ord[] = [
  { ord: 'sol', emoji: '☀️' }, { ord: 'bil', emoji: '🚗' }, { ord: 'bok', emoji: '📕' },
  { ord: 'mus', emoji: '🐭' }, { ord: 'ros', emoji: '🌹' }, { ord: 'hus', emoji: '🏠' },
  { ord: 'sko', emoji: '👟' }, { ord: 'fot', emoji: '🦶' }, { ord: 'hand', emoji: '✋' },
  { ord: 'ko', emoji: '🐄' }, { ord: 'ris', emoji: '🍚' }, { ord: 'nos', emoji: '👃' },
  { ord: 'ben', emoji: '🦵' }, { ord: 'sax', emoji: '✂️' }, { ord: 'gul', emoji: '💛' },
  { ord: 'is', emoji: '🧊' }, { ord: 'ost', emoji: '🧀' }, { ord: 'apa', emoji: '🐒' },
];

export const RAKNEORD: { ord: string; siffra: string; emoji: string }[] = [
  { ord: 'ett', siffra: '1', emoji: '1️⃣' }, { ord: 'två', siffra: '2', emoji: '2️⃣' },
  { ord: 'tre', siffra: '3', emoji: '3️⃣' }, { ord: 'fyra', siffra: '4', emoji: '4️⃣' },
  { ord: 'fem', siffra: '5', emoji: '5️⃣' }, { ord: 'sex', siffra: '6', emoji: '6️⃣' },
  { ord: 'sju', siffra: '7', emoji: '7️⃣' }, { ord: 'åtta', siffra: '8', emoji: '8️⃣' },
  { ord: 'nio', siffra: '9', emoji: '9️⃣' }, { ord: 'tio', siffra: '10', emoji: '🔟' },
];

// ── Ordförståelse ───────────────────────────────────────────────────────────

export const MOTSATSORD: [string, string][] = [
  ['stor', 'liten'], ['varm', 'kall'], ['glad', 'ledsen'], ['ljus', 'mörk'],
  ['snabb', 'långsam'], ['lång', 'kort'], ['tung', 'lätt'], ['ny', 'gammal'],
  ['hård', 'mjuk'], ['våt', 'torr'], ['full', 'tom'], ['öppen', 'stängd'],
  ['ren', 'smutsig'], ['hel', 'trasig'], ['först', 'sist'], ['dag', 'natt'],
  ['upp', 'ner'], ['in', 'ut'], ['fram', 'bak'], ['över', 'under'],
];

export const SYNONYMER: [string, string][] = [
  ['glad', 'nöjd'], ['snabb', 'kvick'], ['rädd', 'skraj'], ['ledsen', 'olycklig'],
  ['snäll', 'vänlig'], ['trött', 'sömnig'], ['arg', 'ilsken'], ['stor', 'väldig'],
  ['kall', 'frusen'], ['pengar', 'slantar'], ['prata', 'tala'], ['springa', 'rusa'],
];

/** [kategori, ord i kategorin, ordet som inte hör ihop] */
export const HOR_INTE_IHOP: { kategori: string; hor: string[]; avvikare: string }[] = [
  { kategori: 'djur', hor: ['hund', 'katt', 'häst'], avvikare: 'bord' },
  { kategori: 'frukt', hor: ['äpple', 'päron', 'banan'], avvikare: 'sko' },
  { kategori: 'färger', hor: ['röd', 'blå', 'gul'], avvikare: 'stol' },
  { kategori: 'kläder', hor: ['byxa', 'tröja', 'mössa'], avvikare: 'moln' },
  { kategori: 'mat', hor: ['bröd', 'ost', 'mjölk'], avvikare: 'cykel' },
  { kategori: 'fordon', hor: ['bil', 'buss', 'tåg'], avvikare: 'äpple' },
  { kategori: 'kroppen', hor: ['hand', 'fot', 'öra'], avvikare: 'lampa' },
  { kategori: 'väder', hor: ['regn', 'snö', 'sol'], avvikare: 'penna' },
];

/** Sammansatta ord: [förled, efterled, hela ordet, emoji] */
export const SAMMANSATTA: [string, string, string, string][] = [
  ['fot', 'boll', 'fotboll', '⚽'],
  ['brand', 'bil', 'brandbil', '🚒'],
  ['hand', 'duk', 'handduk', '🧻'],
  ['sol', 'ros', 'solros', '🌻'],
  ['jord', 'gubbe', 'jordgubbe', '🍓'],
  ['snö', 'boll', 'snöboll', '❄️'],
  ['barn', 'vagn', 'barnvagn', '🍼'],
  ['is', 'björn', 'isbjörn', '🐻‍❄️'],
  ['sjö', 'häst', 'sjöhäst', '🐴'],
  ['tand', 'borste', 'tandborste', '🪥'],
  ['regn', 'båge', 'regnbåge', '🌈'],
  ['fågel', 'bo', 'fågelbo', '🪺'],
];

export const LIKNELSER_DJUR: { text: string; svar: string; emoji: string }[] = [
  { text: 'Listig som en …', svar: 'räv', emoji: '🦊' },
  { text: 'Stark som en …', svar: 'björn', emoji: '🐻' },
  { text: 'Snabb som en …', svar: 'hare', emoji: '🐇' },
  { text: 'Tyst som en …', svar: 'mus', emoji: '🐭' },
  { text: 'Envis som en …', svar: 'åsna', emoji: '🫏' },
  { text: 'Fri som en …', svar: 'fågel', emoji: '🐦' },
  { text: 'Hungrig som en …', svar: 'varg', emoji: '🐺' },
  // "Glad som en lärka" är ett bättre uttryck, men lärkan har ingen egen
  // emoji och skulle behöva dela 🐦 med fågeln ovan. Två svarsbilder som ser
  // likadana ut gör uppgiften omöjlig att svara rätt på.
  { text: 'Klok som en …', svar: 'uggla', emoji: '🦉' },
  { text: 'Långsam som en …', svar: 'snigel', emoji: '🐌' },
];

export const GATOR: { fraga: string; svar: string; emoji: string; fel: [string, string][] }[] = [
  { fraga: 'Jag lyser på dagen och är varm. Vad är jag?', svar: 'sol', emoji: '☀️',
    fel: [['måne', '🌙'], ['moln', '☁️']] },
  // Bilden är en stol, och gåtan stämmer lika bra på en stol. Svaret var
  // "bord" – en elev som inte kan läsa såg alltså rätt bild till fel ord.
  { fraga: 'Jag har fyra ben men kan inte gå. Vad är jag?', svar: 'stol', emoji: '🪑',
    fel: [['häst', '🐎'], ['hund', '🐕']] },
  { fraga: 'Jag är vit och kall och faller på vintern. Vad är jag?', svar: 'snö', emoji: '❄️',
    fel: [['regn', '🌧️'], ['sand', '🏖️']] },
  { fraga: 'Jag har blad men är inget träd. Man läser mig. Vad är jag?', svar: 'bok', emoji: '📕',
    fel: [['blomma', '🌸'], ['skog', '🌲']] },
  { fraga: 'Jag bor i vatten och har fenor. Vad är jag?', svar: 'fisk', emoji: '🐟',
    fel: [['fågel', '🐦'], ['katt', '🐈']] },
  { fraga: 'Jag har nyckel men ingen dörr. Man spelar på mig. Vad är jag?', svar: 'piano', emoji: '🎹',
    fel: [['dörr', '🚪'], ['bil', '🚗']] },
];

// ── Lägesord ────────────────────────────────────────────────────────────────

export const LAGESORD: { mening: string; svar: string; fel: [string, string] }[] = [
  { mening: 'Boken ligger ___ bordet.', svar: 'på', fel: ['under', 'bakom'] },
  { mening: 'Katten sover ___ sängen.', svar: 'under', fel: ['på', 'framför'] },
  { mening: 'Hunden står ___ dörren.', svar: 'framför', fel: ['i', 'mellan'] },
  { mening: 'Bollen är ___ lådan.', svar: 'i', fel: ['på', 'bredvid'] },
  { mening: 'Lampan hänger ___ bordet.', svar: 'över', fel: ['under', 'i'] },
  { mening: 'Stolen står ___ bordet och väggen.', svar: 'mellan', fel: ['på', 'under'] },
  { mening: 'Väskan står ___ stolen.', svar: 'bredvid', fel: ['i', 'över'] },
  { mening: 'Barnet gömmer sig ___ trädet.', svar: 'bakom', fel: ['på', 'mellan'] },
];

// ── Rim ─────────────────────────────────────────────────────────────────────

export const RIM: { ord: string; rim: string; emoji: string; rimEmoji: string; fel: [string, string][] }[] = [
  { ord: 'sol', rim: 'stol', emoji: '☀️', rimEmoji: '🪑', fel: [['bil', '🚗'], ['hus', '🏠']] },
  { ord: 'katt', rim: 'hatt', emoji: '🐈', rimEmoji: '🎩', fel: [['bok', '📕'], ['sko', '👟']] },
  { ord: 'mus', rim: 'hus', emoji: '🐭', rimEmoji: '🏠', fel: [['bil', '🚗'], ['boll', '⚽']] },
  { ord: 'bil', rim: 'pil', emoji: '🚗', rimEmoji: '➡️', fel: [['ko', '🐄'], ['tak', '🏠']] },
  { ord: 'ko', rim: 'sko', emoji: '🐄', rimEmoji: '👟', fel: [['ros', '🌹'], ['sol', '☀️']] },
  { ord: 'boll', rim: 'troll', emoji: '⚽', rimEmoji: '🧌', fel: [['fisk', '🐟'], ['bok', '📕']] },
  { ord: 'hand', rim: 'sand', emoji: '✋', rimEmoji: '🏖️', fel: [['fot', '🦶'], ['öra', '👂']] },
  { ord: 'ris', rim: 'is', emoji: '🍚', rimEmoji: '🧊', fel: [['ost', '🧀'], ['sax', '✂️']] },
];

/** Rimgrupper för "vilket ord rimmar inte". */
export const RIMGRUPPER: { rimmar: [string, string, string]; avvikare: string }[] = [
  { rimmar: ['sol', 'stol', 'kol'], avvikare: 'bil' },
  { rimmar: ['katt', 'hatt', 'natt'], avvikare: 'bok' },
  { rimmar: ['mus', 'hus', 'ljus'], avvikare: 'sked' },
  { rimmar: ['bil', 'pil', 'sil'], avvikare: 'sol' },
  { rimmar: ['ko', 'sko', 'tro'], avvikare: 'katt' },
  { rimmar: ['hand', 'sand', 'band'], avvikare: 'mus' },
];

// ── Dagar och månader ───────────────────────────────────────────────────────

export const VECKODAGAR = [
  'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag', 'söndag',
];

export const MANADER = [
  'januari', 'februari', 'mars', 'april', 'maj', 'juni',
  'juli', 'augusti', 'september', 'oktober', 'november', 'december',
];

// ── Grammatik ───────────────────────────────────────────────────────────────

/** en-ord och ett-ord, för "En eller ett". */
export const EN_ORD = ['bok', 'bil', 'stol', 'katt', 'hund', 'boll', 'penna', 'lampa', 'blomma', 'sked'];
export const ETT_ORD = ['hus', 'bord', 'äpple', 'tåg', 'öga', 'brev', 'glas', 'träd', 'barn', 'ljus'];

/**
 * Bestämd form, för "Den eller det".
 *
 * Den och det står framför ett BESTÄMT substantiv: "den boken", "det huset".
 * Med obestämd form blir frågan fel svenska – "säger man den eller det hus"
 * är inte något man säger. Därför en egen lista i stället för att återanvända
 * en-orden och ett-orden.
 */
export const DEN_ORD = [
  'boken', 'bilen', 'stolen', 'katten', 'hunden',
  'bollen', 'pennan', 'lampan', 'blomman', 'skeden',
];
export const DET_ORD = [
  'huset', 'bordet', 'äpplet', 'tåget', 'ögat',
  'brevet', 'glaset', 'trädet', 'barnet', 'ljuset',
];

/** [singular, plural] */
export const EN_FLERA: [string, string][] = [
  ['bok', 'böcker'], ['bil', 'bilar'], ['hus', 'hus'], ['katt', 'katter'],
  ['barn', 'barn'], ['öga', 'ögon'], ['hand', 'händer'], ['fot', 'fötter'],
  ['blomma', 'blommor'], ['äpple', 'äpplen'], ['stol', 'stolar'], ['träd', 'träd'],
];

/** Adjektivformer: [grundform, ett-form, plural] */
export const ADJEKTIVFORMER: { adj: string; enForm: string; ettForm: string; pluralForm: string }[] = [
  { adj: 'stor', enForm: 'stor', ettForm: 'stort', pluralForm: 'stora' },
  { adj: 'grön', enForm: 'grön', ettForm: 'grönt', pluralForm: 'gröna' },
  { adj: 'kall', enForm: 'kall', ettForm: 'kallt', pluralForm: 'kalla' },
  { adj: 'ny', enForm: 'ny', ettForm: 'nytt', pluralForm: 'nya' },
  { adj: 'glad', enForm: 'glad', ettForm: 'glatt', pluralForm: 'glada' },
  { adj: 'tung', enForm: 'tung', ettForm: 'tungt', pluralForm: 'tunga' },
];

/** Namn och vanliga ord, för "Stor eller liten bokstav". */
export const EGENNAMN = ['Anna', 'Erik', 'Sverige', 'Stockholm', 'Lisa', 'Norge', 'Oskar', 'Malmö'];
export const VANLIGA_ORD = ['hund', 'skola', 'bil', 'sommar', 'bok', 'stad', 'katt', 'vinter'];

// ── Skiljetecken ────────────────────────────────────────────────────────────

export const SKILJETECKEN: { mening: string; svar: '.' | '?' | '!' }[] = [
  { mening: 'Vad heter du', svar: '?' },
  { mening: 'Jag heter Leo', svar: '.' },
  { mening: 'Akta dig', svar: '!' },
  { mening: 'Var bor du', svar: '?' },
  { mening: 'Katten sover på soffan', svar: '.' },
  { mening: 'Vilken fin dag', svar: '!' },
  { mening: 'Hur gammal är du', svar: '?' },
  { mening: 'Vi går till skolan', svar: '.' },
  { mening: 'Spring', svar: '!' },
  { mening: 'När börjar filmen', svar: '?' },
];

// ── Stavningsregler ─────────────────────────────────────────────────────────

/**
 * Ljudregler. `ratt` är rätt stavning, `fel` är den stavning som låter lika.
 * Det är hela poängen med "välj rätt stavning": alternativen ska låta
 * identiska, annars är det ingen stavningsövning.
 */
export interface Stavning {
  ratt: string;
  fel: string;
  emoji?: string;
}

export const J_LJUDET_J: Stavning[] = [
  { ratt: 'jul', fel: 'gul' }, { ratt: 'jobba', fel: 'gobba' },
  { ratt: 'jätte', fel: 'gätte' }, { ratt: 'jord', fel: 'gjord' },
  { ratt: 'jacka', fel: 'gacka' }, { ratt: 'ja', fel: 'ga' },
];

export const J_LJUDET_G: Stavning[] = [
  { ratt: 'gäst', fel: 'jäst' }, { ratt: 'gilla', fel: 'jilla' },
  { ratt: 'göra', fel: 'jöra' }, { ratt: 'gympa', fel: 'jympa' },
  { ratt: 'ge', fel: 'je' }, { ratt: 'gäspa', fel: 'jäspa' },
];

export const J_LJUDET_OVRIGA: Stavning[] = [
  { ratt: 'hjul', fel: 'jul' }, { ratt: 'hjärta', fel: 'järta' },
  { ratt: 'ljus', fel: 'jus' }, { ratt: 'ljud', fel: 'jud' },
  { ratt: 'djur', fel: 'jur' }, { ratt: 'djup', fel: 'jup' },
];

export const SJ_LJUDET_SJ: Stavning[] = [
  { ratt: 'sju', fel: 'skju' }, { ratt: 'sjö', fel: 'skö' },
  { ratt: 'sjunga', fel: 'skjunga' }, { ratt: 'sjal', fel: 'skal' },
  { ratt: 'sjuk', fel: 'skjuk' }, { ratt: 'själv', fel: 'skälv' },
];

export const SJ_LJUDET_SK: Stavning[] = [
  { ratt: 'sked', fel: 'sjed' }, { ratt: 'skön', fel: 'sjön' },
  { ratt: 'skina', fel: 'sjina' }, { ratt: 'skära', fel: 'sjära' },
  { ratt: 'skynda', fel: 'sjynda' }, { ratt: 'skjuta', fel: 'sjuta' },
];

export const SJ_LJUDET_OVRIGA: Stavning[] = [
  { ratt: 'stjärna', fel: 'sjärna' }, { ratt: 'skjorta', fel: 'sjorta' },
  { ratt: 'schema', fel: 'sjema' }, { ratt: 'dusch', fel: 'dusj' },
  { ratt: 'stjäla', fel: 'själa' }, { ratt: 'marschera', fel: 'marsjera' },
];

export const TJ_LJUDET_TJ: Stavning[] = [
  { ratt: 'tjugo', fel: 'kjugo' }, { ratt: 'tjuv', fel: 'kjuv' },
  { ratt: 'tjock', fel: 'kjock' }, { ratt: 'tjäna', fel: 'kjäna' },
  { ratt: 'tjut', fel: 'kjut' }, { ratt: 'tjena', fel: 'kjena' },
];

export const TJ_LJUDET_K: Stavning[] = [
  { ratt: 'kika', fel: 'tjika' }, { ratt: 'kyss', fel: 'tjyss' },
  { ratt: 'köpa', fel: 'tjöpa' }, { ratt: 'kär', fel: 'tjär' },
  { ratt: 'kök', fel: 'tjök' }, { ratt: 'kind', fel: 'tjind' },
];

export const NG_LJUDET_NG: Stavning[] = [
  { ratt: 'ring', fel: 'rin' }, { ratt: 'sång', fel: 'sån' },
  { ratt: 'lång', fel: 'lån' }, { ratt: 'säng', fel: 'sän' },
  { ratt: 'kung', fel: 'kun' }, { ratt: 'ung', fel: 'un' },
];

export const NG_LJUDET_N: Stavning[] = [
  { ratt: 'bank', fel: 'bangk' }, { ratt: 'tänka', fel: 'tängka' },
  { ratt: 'punkt', fel: 'pungkt' }, { ratt: 'sjunka', fel: 'sjungka' },
  { ratt: 'tacka', fel: 'tangka' }, { ratt: 'länk', fel: 'längk' },
];

/**
 * Meningar med en lucka, för "Skriv det saknade ordet".
 *
 * Det som saknas är alltid ett ord med det ljud uppgiften tränar – annars
 * blir övningen en allmän lucktext i stället för en stavningsövning.
 */
export const NG_MENINGAR: { mening: string; svar: string }[] = [
  { mening: 'Kungen har en ___ på fingret.', svar: 'ring' },
  { mening: 'Vi sjöng en vacker ___.', svar: 'sång' },
  { mening: 'Giraffen har en ___ hals.', svar: 'lång' },
  { mening: 'Jag sover i min ___.', svar: 'säng' },
  { mening: 'Han bär en ___ ryggsäck.', svar: 'tung' },
  { mening: 'Hon är bara sju år och mycket ___.', svar: 'ung' },
];

export const N_MENINGAR: { mening: string; svar: string }[] = [
  { mening: 'Mamma hämtar pengar på ___.', svar: 'banken' },
  { mening: 'Jag måste ___ efter innan jag svarar.', svar: 'tänka' },
  { mening: 'Meningen slutar med en ___.', svar: 'punkt' },
  { mening: 'Stenen börjar ___ i vattnet.', svar: 'sjunka' },
  { mening: 'Jag vill ___ dig för hjälpen.', svar: 'tacka' },
  { mening: 'Klicka på den blå ___.', svar: 'länken' },
];

export const M_LJUDET: Stavning[] = [
  { ratt: 'lamm', fel: 'lam' }, { ratt: 'damm', fel: 'dam' },
  { ratt: 'komma', fel: 'koma' }, { ratt: 'rum', fel: 'rumm' },
  { ratt: 'hem', fel: 'hemm' }, { ratt: 'simma', fel: 'sima' },
];

export const CK_LJUDET: Stavning[] = [
  { ratt: 'backe', fel: 'bakke' }, { ratt: 'socker', fel: 'sokker' },
  { ratt: 'mycket', fel: 'mykket' }, { ratt: 'tacka', fel: 'takka' },
  { ratt: 'flicka', fel: 'flikka' }, { ratt: 'väcka', fel: 'väkka' },
];

export const DUBBELTECKNING: Stavning[] = [
  { ratt: 'katt', fel: 'kat', emoji: '🐈' }, { ratt: 'hatt', fel: 'hat', emoji: '🎩' },
  { ratt: 'mamma', fel: 'mama', emoji: '👩' }, { ratt: 'pappa', fel: 'papa', emoji: '👨' },
  { ratt: 'glass', fel: 'glas', emoji: '🍦' }, { ratt: 'kall', fel: 'kal', emoji: '🥶' },
  { ratt: 'sommar', fel: 'somar', emoji: '🌻' }, { ratt: 'vinter', fel: 'vintter', emoji: '⛄' },
];

/** Minimala par: lång vokal mot kort vokal. Skillnaden är dubbelteckningen. */
export const VOKALPAR: { lang: string; kort: string; langEmoji?: string; kortEmoji?: string }[] = [
  { lang: 'mat', kort: 'matt', langEmoji: '🍽️' },
  { lang: 'vit', kort: 'vitt', langEmoji: '⬜' },
  { lang: 'hal', kort: 'hall' },
  { lang: 'tak', kort: 'tack', langEmoji: '🏠' },
  { lang: 'sil', kort: 'sill', kortEmoji: '🐟' },
  { lang: 'ful', kort: 'full' },
  { lang: 'rita', kort: 'ritta' },
  { lang: 'fin', kort: 'finn' },
];

export const LANGA_VOKALER: Ord[] = [
  { ord: 'fot', emoji: '🦶' }, { ord: 'sol', emoji: '☀️' }, { ord: 'bok', emoji: '📕' },
  { ord: 'ris', emoji: '🍚' }, { ord: 'sko', emoji: '👟' }, { ord: 'ben', emoji: '🦵' },
  { ord: 'hus', emoji: '🏠' }, { ord: 'nos', emoji: '👃' },
];

export const KORTA_VOKALER: Ord[] = [
  { ord: 'katt', emoji: '🐈' }, { ord: 'hatt', emoji: '🎩' }, { ord: 'boll', emoji: '⚽' },
  { ord: 'kopp', emoji: '☕' }, { ord: 'äpple', emoji: '🍎' }, { ord: 'kall', emoji: '🥶' },
  { ord: 'mygg', emoji: '🦟' }, { ord: 'klocka', emoji: '⏰' },
];

/** Låneord som inte går att ljuda sig till. */
export const LJUDSTRIDIGA: Ord[] = [
  { ord: 'jeans', emoji: '👖' }, { ord: 'juice', emoji: '🧃' }, { ord: 'dusch', emoji: '🚿' },
  { ord: 'paraply', emoji: '☂️' }, { ord: 'pizza', emoji: '🍕' }, { ord: 'choklad', emoji: '🍫' },
  { ord: 'schack', emoji: '♟️' }, { ord: 'gitarr', emoji: '🎸' },
];

// ── Alfabetet ───────────────────────────────────────────────────────────────

export const ALFABETET = 'abcdefghijklmnopqrstuvwxyzåäö'.split('');
export const VOKALER = ['a', 'e', 'i', 'o', 'u', 'y', 'å', 'ä', 'ö'];
export const KONSONANTER = ALFABETET.filter((b) => !VOKALER.includes(b));
