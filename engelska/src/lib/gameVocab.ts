// Shared vocabulary data for Engelskajakten games

export interface WordPair { sv: string; en: string }

export const WORD_PAIRS: Record<string, WordPair[]> = {
  lagstadiet: [
    { sv: "hund",    en: "dog" },    { sv: "katt",   en: "cat" },
    { sv: "häst",    en: "horse" },  { sv: "fågel",  en: "bird" },
    { sv: "fisk",    en: "fish" },   { sv: "röd",    en: "red" },
    { sv: "blå",     en: "blue" },   { sv: "grön",   en: "green" },
    { sv: "gul",     en: "yellow" }, { sv: "stor",   en: "big" },
    { sv: "liten",   en: "small" },  { sv: "äpple",  en: "apple" },
    { sv: "banan",   en: "banana" }, { sv: "hus",    en: "house" },
    { sv: "bok",     en: "book" },   { sv: "boll",   en: "ball" },
    { sv: "hand",    en: "hand" },   { sv: "öga",    en: "eye" },
    { sv: "vatten",  en: "water" },  { sv: "sol",    en: "sun" },
  ],
  mellanstadiet: [
    { sv: "springa",  en: "run" },     { sv: "simma",   en: "swim" },
    { sv: "skriva",   en: "write" },   { sv: "läsa",    en: "read" },
    { sv: "lyssna",   en: "listen" },  { sv: "snabb",   en: "fast" },
    { sv: "långsam",  en: "slow" },    { sv: "glad",    en: "happy" },
    { sv: "ledsen",   en: "sad" },     { sv: "hungrig", en: "hungry" },
    { sv: "trött",    en: "tired" },   { sv: "vinter",  en: "winter" },
    { sv: "sommar",   en: "summer" },  { sv: "vår",     en: "spring" },
    { sv: "höst",     en: "autumn" },  { sv: "skola",   en: "school" },
    { sv: "lärare",   en: "teacher" }, { sv: "kompis",  en: "friend" },
    { sv: "familj",   en: "family" },  { sv: "fotboll", en: "football" },
  ],
  hogstadiet: [
    { sv: "möjlighet",  en: "opportunity" }, { sv: "ansvar",   en: "responsibility" },
    { sv: "kunskap",    en: "knowledge" },    { sv: "förklara", en: "explain" },
    { sv: "jämföra",    en: "compare" },      { sv: "analysera",en: "analyse" },
    { sv: "påverka",    en: "influence" },    { sv: "miljö",    en: "environment" },
    { sv: "samhälle",   en: "society" },      { sv: "rättighet",en: "right" },
    { sv: "skyldighet", en: "obligation" },   { sv: "forskning",en: "research" },
    { sv: "teknik",     en: "technology" },   { sv: "ekonomi",  en: "economy" },
    { sv: "historia",   en: "history" },      { sv: "framtid",  en: "future" },
    { sv: "lösning",    en: "solution" },     { sv: "problem",  en: "problem" },
    { sv: "frihet",     en: "freedom" },      { sv: "rättvisa", en: "justice" },
  ],
  gymnasiet: [
    { sv: "konsekvens",    en: "consequence" },  { sv: "perspektiv",  en: "perspective" },
    { sv: "argument",      en: "argument" },      { sv: "slutsats",    en: "conclusion" },
    { sv: "hypotes",       en: "hypothesis" },    { sv: "fenomen",     en: "phenomenon" },
    { sv: "abstrakt",      en: "abstract" },      { sv: "kritisk",     en: "critical" },
    { sv: "hållbar",       en: "sustainable" },   { sv: "globalisering",en: "globalisation" },
    { sv: "demokrati",     en: "democracy" },     { sv: "ideologi",    en: "ideology" },
    { sv: "etik",          en: "ethics" },        { sv: "värdering",   en: "value" },
    { sv: "innovation",    en: "innovation" },    { sv: "identitet",   en: "identity" },
    { sv: "kulturell",     en: "cultural" },      { sv: "integration", en: "integration" },
    { sv: "strategi",      en: "strategy" },      { sv: "kommunikation",en: "communication" },
  ],
};

// English words for Hangman (uppercase)
export const HANGMAN_WORDS: Record<string, string[]> = {
  lagstadiet: ["DOG","CAT","HORSE","BIRD","FISH","RED","BLUE","GREEN","YELLOW","BIG",
                "SMALL","APPLE","BANANA","HOUSE","BOOK","BALL","HAND","EYE","WATER","SUN"],
  mellanstadiet: ["RUN","SWIM","WRITE","READ","LISTEN","FAST","SLOW","HAPPY","SAD","HUNGRY",
                  "TIRED","WINTER","SUMMER","SPRING","AUTUMN","SCHOOL","TEACHER","FRIEND","FAMILY","FOOTBALL"],
  hogstadiet: ["KNOWLEDGE","RESEARCH","FREEDOM","JUSTICE","SOCIETY","FUTURE","SOLUTION",
               "HISTORY","ECONOMY","INFLUENCE","TECHNOLOGY","ENVIRONMENT","OBLIGATION","COMPARE","EXPLAIN"],
  gymnasiet: ["DEMOCRACY","IDEOLOGY","ETHICS","STRATEGY","IDENTITY","HYPOTHESIS","PERSPECTIVE",
              "CONSEQUENCE","GLOBALISATION","INNOVATION","SUSTAINABLE","CONCLUSION","PHENOMENON","ABSTRACT","CRITICAL"],
};

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
