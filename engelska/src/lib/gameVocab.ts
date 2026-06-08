// Shared vocabulary data for Engelskajakten games (Memory, Tidsattack, Samla mynt, Hangman)

export interface WordPair { sv: string; en: string }

export const WORD_PAIRS: Record<string, WordPair[]> = {
  lagstadiet: [
    { sv: "hund",    en: "dog" },     { sv: "katt",    en: "cat" },
    { sv: "häst",    en: "horse" },   { sv: "fågel",   en: "bird" },
    { sv: "fisk",    en: "fish" },    { sv: "röd",     en: "red" },
    { sv: "blå",     en: "blue" },    { sv: "grön",    en: "green" },
    { sv: "gul",     en: "yellow" },  { sv: "stor",    en: "big" },
    { sv: "liten",   en: "small" },   { sv: "äpple",   en: "apple" },
    { sv: "banan",   en: "banana" },  { sv: "hus",     en: "house" },
    { sv: "bok",     en: "book" },    { sv: "boll",    en: "ball" },
    { sv: "hand",    en: "hand" },    { sv: "öga",     en: "eye" },
    { sv: "vatten",  en: "water" },   { sv: "sol",     en: "sun" },
    { sv: "måne",    en: "moon" },    { sv: "ko",      en: "cow" },
    { sv: "gris",    en: "pig" },     { sv: "kanin",   en: "rabbit" },
    { sv: "mamma",   en: "mother" },  { sv: "pappa",   en: "father" },
    { sv: "syster",  en: "sister" },  { sv: "bror",    en: "brother" },
    { sv: "stol",    en: "chair" },   { sv: "bord",    en: "table" },
    { sv: "dörr",    en: "door" },    { sv: "fönster", en: "window" },
    { sv: "skola",   en: "school" },  { sv: "lärare",  en: "teacher" },
    { sv: "fot",     en: "foot" },    { sv: "huvud",   en: "head" },
    { sv: "näsa",    en: "nose" },    { sv: "mun",     en: "mouth" },
    { sv: "varm",    en: "warm" },    { sv: "kall",    en: "cold" },
  ],
  mellanstadiet: [
    { sv: "springa",  en: "run" },      { sv: "simma",    en: "swim" },
    { sv: "skriva",   en: "write" },    { sv: "läsa",     en: "read" },
    { sv: "lyssna",   en: "listen" },   { sv: "snabb",    en: "fast" },
    { sv: "långsam",  en: "slow" },     { sv: "glad",     en: "happy" },
    { sv: "ledsen",   en: "sad" },      { sv: "hungrig",  en: "hungry" },
    { sv: "trött",    en: "tired" },    { sv: "vinter",   en: "winter" },
    { sv: "sommar",   en: "summer" },   { sv: "vår",      en: "spring" },
    { sv: "höst",     en: "autumn" },   { sv: "skola",    en: "school" },
    { sv: "lärare",   en: "teacher" },  { sv: "kompis",   en: "friend" },
    { sv: "familj",   en: "family" },   { sv: "fotboll",  en: "football" },
    { sv: "köpa",     en: "buy" },      { sv: "sälja",    en: "sell" },
    { sv: "tänka",    en: "think" },    { sv: "förstå",   en: "understand" },
    { sv: "resa",     en: "travel" },   { sv: "stad",     en: "city" },
    { sv: "land",     en: "country" },  { sv: "väder",    en: "weather" },
    { sv: "regn",     en: "rain" },     { sv: "snö",      en: "snow" },
    { sv: "kläder",   en: "clothes" },  { sv: "pengar",   en: "money" },
    { sv: "viktig",   en: "important" },{ sv: "svår",     en: "difficult" },
    { sv: "lätt",     en: "easy" },     { sv: "stark",    en: "strong" },
    { sv: "svag",     en: "weak" },     { sv: "morbror",  en: "uncle" },
    { sv: "moster",   en: "aunt" },     { sv: "kusin",    en: "cousin" },
  ],
  hogstadiet: [
    { sv: "möjlighet",  en: "opportunity" }, { sv: "ansvar",     en: "responsibility" },
    { sv: "kunskap",    en: "knowledge" },   { sv: "förklara",   en: "explain" },
    { sv: "jämföra",    en: "compare" },     { sv: "analysera",  en: "analyse" },
    { sv: "påverka",    en: "influence" },   { sv: "miljö",      en: "environment" },
    { sv: "samhälle",   en: "society" },     { sv: "rättighet",  en: "right" },
    { sv: "skyldighet", en: "obligation" },  { sv: "forskning",  en: "research" },
    { sv: "teknik",     en: "technology" },  { sv: "ekonomi",    en: "economy" },
    { sv: "historia",   en: "history" },     { sv: "framtid",    en: "future" },
    { sv: "lösning",    en: "solution" },    { sv: "problem",    en: "problem" },
    { sv: "frihet",     en: "freedom" },     { sv: "rättvisa",   en: "justice" },
    { sv: "utveckling", en: "development" }, { sv: "erfarenhet", en: "experience" },
    { sv: "beslut",     en: "decision" },    { sv: "bevis",      en: "evidence" },
    { sv: "orsak",      en: "cause" },       { sv: "effekt",     en: "effect" },
    { sv: "öka",        en: "increase" },    { sv: "minska",     en: "decrease" },
    { sv: "uppmuntra",  en: "encourage" },   { sv: "undvika",    en: "avoid" },
    { sv: "föreslå",    en: "suggest" },     { sv: "beskriva",   en: "describe" },
    { sv: "behandla",   en: "treat" },       { sv: "skapa",      en: "create" },
    { sv: "förbättra",  en: "improve" },     { sv: "lyckas",     en: "succeed" },
    { sv: "misslyckas", en: "fail" },        { sv: "befolkning", en: "population" },
    { sv: "regering",   en: "government" },   { sv: "kultur",     en: "culture" },
  ],
  gymnasiet: [
    { sv: "konsekvens",    en: "consequence" },   { sv: "perspektiv",    en: "perspective" },
    { sv: "argument",      en: "argument" },       { sv: "slutsats",      en: "conclusion" },
    { sv: "hypotes",       en: "hypothesis" },     { sv: "fenomen",       en: "phenomenon" },
    { sv: "abstrakt",      en: "abstract" },       { sv: "kritisk",       en: "critical" },
    { sv: "hållbar",       en: "sustainable" },    { sv: "globalisering", en: "globalisation" },
    { sv: "demokrati",     en: "democracy" },      { sv: "ideologi",      en: "ideology" },
    { sv: "etik",          en: "ethics" },         { sv: "värdering",     en: "value" },
    { sv: "innovation",    en: "innovation" },     { sv: "identitet",     en: "identity" },
    { sv: "kulturell",     en: "cultural" },        { sv: "integration",   en: "integration" },
    { sv: "strategi",      en: "strategy" },        { sv: "kommunikation", en: "communication" },
    { sv: "fördom",        en: "prejudice" },       { sv: "övertygande",   en: "persuasive" },
    { sv: "tvetydig",      en: "ambiguous" },       { sv: "tydlig",        en: "explicit" },
    { sv: "underförstådd", en: "implicit" },        { sv: "trovärdig",     en: "credible" },
    { sv: "subjektiv",     en: "subjective" },       { sv: "objektiv",      en: "objective" },
    { sv: "samband",       en: "correlation" },      { sv: "antagande",     en: "assumption" },
    { sv: "motsägelse",    en: "contradiction" },    { sv: "rättfärdiga",   en: "justify" },
    { sv: "ifrågasätta",   en: "question" },         { sv: "framhäva",      en: "emphasise" },
    { sv: "omfattande",    en: "comprehensive" },    { sv: "väsentlig",     en: "essential" },
    { sv: "mångfald",      en: "diversity" },        { sv: "jämlikhet",     en: "equality" },
    { sv: "yttrandefrihet",en: "free speech" },      { sv: "myndighet",     en: "authority" },
  ],
};

// English words for Hangman — derived automatically from the single-word
// pairs above so the lists never drift apart. Uppercase, letters only.
export const HANGMAN_WORDS: Record<string, string[]> = Object.fromEntries(
  Object.entries(WORD_PAIRS).map(([stage, pairs]) => [
    stage,
    pairs
      .map((p) => p.en)
      .filter((w) => /^[a-zA-Z]+$/.test(w)) // skip multi-word entries like "free speech"
      .map((w) => w.toUpperCase()),
  ])
);

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Generate multiple-choice options (3 wrong + 1 correct)
export function makeOptions(correct: string, pool: string[]): string[] {
  const wrong = shuffle(pool.filter(w => w !== correct)).slice(0, 3);
  return shuffle([correct, ...wrong]);
}
