/**
 * Rättning av fritextsvar – gemensam för alla vyer.
 *
 * Tidigare jämfördes svaret tecken för tecken med facit, så en elev som skrev
 * "20kr" eller "20 kr" fick fel på en fråga med facit "20". Nu tolkas svaret
 * som en människa skulle göra:
 *
 *   – mellanslag, versaler och decimalkomma spelar ingen roll ("2,5" = "2.5")
 *   – tusental får skrivas med mellanslag ("1 000" = "1000")
 *   – "x = 4", "= 4" och "svar: 4" räknas som 4
 *   – klockslag får skrivas med punkt ("05.00" = "05:00" = "5:00")
 *   – i uttryck spelar gångertecknet och ordningen i en summa ingen roll
 *     ("2*3*3" = "2×3×3", "x^2" = "x²", "6 + 2x" = "2x + 6")
 *   – "en" eller "ett" före ett ord får vara med ("en triangel")
 *   – bråk jämförs som text, inte som tal: på "Skriv 0,75 som bråk" ska
 *     svaret vara ett bråk, så "0,75" får inte godkännas som "3/4"
 *   – en enhet eller ett ord efter talet godtas ("20 kr", "5 äpplen", "25 %"),
 *     men bara om enheten passar frågan. Vid omvandlingsfrågor som "Hur många
 *     cm är 2 m?" måste enheten vara den som facit använder, så "200 m" blir fel.
 */

// Enheter som betyder samma sak. Första ordet i varje grupp är "huvudnamnet".
const UNIT_GROUPS: string[][] = [
  ['kr', 'kronor', 'krona', ':-'],
  ['öre'],
  ['mm', 'millimeter'],
  ['cm', 'centimeter'],
  ['dm', 'decimeter'],
  ['m', 'meter'],
  ['km', 'kilometer'],
  ['mil'],
  ['mg', 'milligram'],
  ['g', 'gram'],
  ['hg', 'hekto', 'hektogram'],
  ['kg', 'kilo', 'kilogram'],
  ['ton'],
  ['ml', 'milliliter'],
  ['cl', 'centiliter'],
  ['dl', 'deciliter'],
  ['l', 'liter'],
  ['s', 'sek', 'sekund', 'sekunder'],
  ['min', 'minut', 'minuter'],
  ['h', 'tim', 'timme', 'timmar'],
  ['dygn'],
  ['dag', 'dagar'],
  ['vecka', 'veckor'],
  ['månad', 'månader'],
  ['år'],
  ['%', 'procent'],
  ['°', 'grader', 'grad'],
  ['mm²', 'mm2', 'kvadratmillimeter'],
  ['cm²', 'cm2', 'kvadratcentimeter'],
  ['dm²', 'dm2', 'kvadratdecimeter'],
  ['m²', 'm2', 'kvm', 'kvadratmeter'],
  ['km²', 'km2', 'kvadratkilometer'],
  ['cm³', 'cm3', 'kubikcentimeter'],
  ['dm³', 'dm3', 'kubikdecimeter'],
  ['m³', 'm3', 'kubikmeter'],
];

// "st" passar alltid: "5 st" är ett naturligt sätt att svara på "hur många".
const ALWAYS_OK = new Set(['st', 'st.', 'stycken', 'styck']);

const GROUP_OF = new Map<string, number>();
UNIT_GROUPS.forEach((g, i) => g.forEach(u => GROUP_OF.set(u, i)));

/** Gemener, vanligt minustecken, ett mellanslag i taget och inga skiljetecken sist. */
function tidy(s: string): string {
  return s
    .toLowerCase()
    .replace(/[−–]/g, '-')   // − och – som minus
    .replace(/ /g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.!]+$/, '')
    .trim();
}

/** Jämförelseform för textsvar: inga mellanslag, decimalpunkt, ett gångertecken. */
function squash(s: string): string {
  return tidy(s)
    .replace(/^(en|ett) (?=[a-zåäö])/, '')
    .replace(/\s+/g, '')
    .replace(/,/g, '.')
    .replace(/[×·∙⋅]/g, '*')
    .replace(/\^2/g, '²')
    .replace(/\^3/g, '³')
    .replace(/pi/g, 'π')
    .replace(/′/g, "'");
}

/** Klockslag som minuter efter midnatt ("7.45" → 465), annars null. */
function clockMinutes(s: string): number | null {
  const m = tidy(s).match(/^(\d{1,2})[:.](\d{2})$/);
  if (!m) return null;
  const h = Number(m[1]), min = Number(m[2]);
  return h <= 24 && min < 60 ? h * 60 + min : null;
}

/**
 * Termerna i en summa, sorterade, så att ordningen inte spelar roll:
 * "6+2x" och "2x+6" ger samma lista. Bara för uttryck utan parenteser.
 */
function sumTerms(squashed: string): string | null {
  if (/[()=]/.test(squashed)) return null;
  const terms = squashed.match(/[+-]?[^+-]+/g);
  if (!terms || terms.length < 2) return null;
  return terms.map(t => (t.startsWith('+') || t.startsWith('-') ? t : '+' + t)).sort().join('');
}

/** Talet i en sträng som bara består av ett tal, annars null. */
function parseNumber(s: string): number | null {
  const t = s.trim();
  return /^-?\d+(?:\.\d+)?$/.test(t) ? Number(t) : null;
}

/** Tar bort tusentalsmellanslag ("12 500" → "12500") och gör komma till punkt. */
function unspaceNumber(s: string): string {
  return s.replace(/(\d) (?=\d{3}\b)/g, '$1').replace(/(\d),(\d)/g, '$1.$2');
}

/** Delar upp ett svar i tal + eventuell enhet efter. */
function splitAnswer(raw: string): { value: number; unit: string } | null {
  let s = unspaceNumber(tidy(raw));
  // Inledningar som inte är en del av svaret
  s = s.replace(/^(svar(et)?( är)?\s*:?|det blir|det är|blir)\s*/, '');
  s = s.replace(/^[a-zåäö]?\s*=\s*/, '');
  // "20:-" betyder kronor
  s = s.replace(/\s*:-$/, ' kr');
  // Ett bråk ("3/4") är inget tal med enhet – det rättas som text
  if (/^-?\d+\s*\/\s*\d/.test(s)) return null;
  const m = s.match(/^(-?\d+(?:\.\d+)?)\s*(.*)$/);
  if (!m) return null;
  const value = parseNumber(m[1]);
  if (value === null) return null;
  return { value, unit: m[2].trim() };
}

/** Alla ord i frågetexten, för att se om en enhet eller ett ord passar frågan. */
function wordsIn(context: string): Set<string> {
  const out = new Set<string>();
  // "25%" och "65°" delas upp så att tecknet blir ett eget ord
  const t = tidy(context).replace(/(\d)\s*([%°])/g, '$1 $2 ');
  for (const w of t.split(/[^a-zåäöé%°²³0-9]+/)) if (w) out.add(w);
  // Upphöjda tecken skrivs ibland som siffra: "cm2"
  for (const w of Array.from(out)) out.add(w.replace('²', '2').replace('³', '3'));
  return out;
}

/** Vilka enhetsgrupper som nämns i texten. */
function groupsIn(words: Set<string>): Set<number> {
  const g = new Set<number>();
  for (const w of words) {
    const i = GROUP_OF.get(w);
    if (i !== undefined) g.add(i);
  }
  return g;
}

/**
 * Enheten som står direkt efter facit-talet, t.ex. "cm" i "2 m = 200 cm".
 * Används för att avgöra vilken enhet omvandlingsfrågor vill ha. Den sista
 * förekomsten vinner, eftersom förklaringen kommer efter frågan: i "Kartmått
 * 5 cm … verklig sträcka i km? … = 5 km" är det "5 km" som är svaret.
 */
function unitAfterValue(context: string, value: number): number | undefined {
  const t = unspaceNumber(tidy(context));
  const re = /(-?\d+(?:\.\d+)?)\s*([a-zåäö%°]+[²³23]?)/g;
  let found: number | undefined;
  let m: RegExpExecArray | null;
  while ((m = re.exec(t))) {
    if (Math.abs(Number(m[1]) - value) < 1e-9) {
      const g = GROUP_OF.get(m[2]);
      if (g !== undefined) found = g;
    }
  }
  return found;
}

function unitFits(unit: string, value: number, context: string): boolean {
  if (!unit) return true;
  if (ALWAYS_OK.has(unit)) return true;
  const words = wordsIn(context);
  const group = GROUP_OF.get(unit) ?? GROUP_OF.get(unit.replace(/\.$/, ''));
  if (group === undefined) {
    // Ett vanligt ord ("äpplen", "elever"): godkänt om det finns i frågan.
    // Bara bokstäver – "13 14" får inte godkännas som "13" med ordet "14".
    if (!/^[a-zåäöé ]+$/.test(unit)) return false;
    return unit.split(' ').every(w => words.has(w));
  }
  const mentioned = groupsIn(words);
  // Omvandlingsfråga: flera enheter nämns – då måste det vara facits enhet
  if (mentioned.size > 1) {
    const wanted = unitAfterValue(context, value);
    if (wanted !== undefined) return wanted === group;
  }
  return mentioned.has(group);
}

/**
 * Sant om elevens svar stämmer med facit eller något av de godtagbara svaren.
 * `context` är frågan, förklaringen och ledtråden – den används för att avgöra
 * vilka enheter som passar.
 */
export function isAnswerCorrect(
  input: string,
  answer: string | number,
  acceptable: (string | number)[] = [],
  context = '',
): boolean {
  if (!input.trim()) return false;
  const candidates = [answer, ...acceptable].map(String);

  // 1. Samma text (utan hänsyn till mellanslag, versaler och decimalkomma)
  let typed = squash(input);
  if (candidates.some(c => squash(c) === typed)) return true;

  // "y = 2x + 4" när facit är "2x+4": ta bort vänsterledet om facit saknar det
  const lhs = typed.match(/^[a-z]('|′)?(\([a-z]\))?=(.+)$/);
  if (lhs && candidates.some(c => !squash(c).includes('='))) {
    typed = lhs[3];
    if (candidates.some(c => squash(c) === typed)) return true;
  }

  // Klockslag: "05.00", "5:00" och "05:00" är samma tid
  const clock = clockMinutes(input);
  if (clock !== null && candidates.some(c => /:/.test(c) && clockMinutes(c) === clock)) return true;

  // Uttryck med bokstäver: samma termer i en annan ordning
  const terms = sumTerms(typed);
  if (terms && candidates.some(c => /[a-zπ]/.test(squash(c)) && sumTerms(squash(c)) === terms)) return true;

  // 2. Samma tal, eventuellt med en enhet eller ett ord som passar frågan
  const user = splitAnswer(input);
  if (!user) return false;
  return candidates.some(c => {
    const facit = splitAnswer(c);
    if (!facit || Math.abs(facit.value - user.value) > 1e-9) return false;
    if (facit.unit) {
      // Det som står efter talet i facit är en del av svaret ("6x", "20π",
      // "3:30 em") – då räcker inte bara talet, och texten jämfördes redan ovan
      const a = GROUP_OF.get(facit.unit);
      if (a === undefined) return false;
      // Facit har en vanlig enhet ("30 kr"): talet ensamt eller samma sorts enhet
      return !user.unit || GROUP_OF.get(user.unit) === a;
    }
    if (!user.unit) return true;
    return unitFits(user.unit, user.value, context);
  });
}

/** Allt som en fritextuppgift behöver för att rättas. */
export interface FillInLike {
  answer?: string | number;
  acceptableAnswers?: (string | number)[];
  question?: string;
  explanation?: string;
  hint?: string;
  narrative?: string;
}

/** Rättar ett fritextsvar mot en uppgift (övning, sluttest, uppdrag, felbank …). */
export function checkFillIn(input: string, ex: FillInLike): boolean {
  const context = [ex.narrative, ex.question, ex.explanation, ex.hint].filter(Boolean).join(' ');
  return isAnswerCorrect(input, ex.answer ?? '', ex.acceptableAnswers ?? [], context);
}
