// Ordförklaringar för svåra ord i texter
// Nyckel = ord (lowercase), värde = förklaring

export const WORD_DICTIONARY: Record<string, string> = {
  // Allmänna svåra ord
  'kontext': 'Sammanhanget eller omständigheterna runt något',
  'perspektiv': 'Synvinkel eller sätt att se på något',
  'relevant': 'Viktigt och passande för ämnet',
  'analysera': 'Undersöka noggrant för att förstå',
  'fenomen': 'Något som händer eller finns, ofta ovanligt',
  'komplex': 'Komplicerad, med många delar',
  'abstrakt': 'Svårt att förstå, inte konkret',
  'konkret': 'Verkligt och tydligt, inte abstrakt',
  'hypotes': 'En gissning som man testar',
  'teori': 'En förklaring som stöds av fakta',
  'innovation': 'Något nytt och förbättrat',
  'strategi': 'En plan för att nå ett mål',
  'integration': 'Att sätta samman olika delar till en helhet',
  'dynamisk': 'Föränderlig och aktiv',
  'statisk': 'Stillastående, utan förändring',

  // Vetenskap
  'nebulosa': 'Ett stort moln av gas och stoft i rymden',
  'gravitation': 'Kraften som drar föremål mot varandra',
  'ackretion': 'När material samlas och växer till större kroppar',
  'planetesimaler': 'Små byggstenar som bildade planeter',
  'kondensera': 'Att gå från gas till fast form eller vätska',
  'exoplanet': 'En planet som kretsar runt en annan stjärna än solen',
  'resonans': 'När två saker påverkar varandra regelbundet',
  'rumtid': 'En kombination av rum och tid enligt Einsteins teori',

  // Demokrati & samhälle
  'demokrati': 'Folkstyrelse där medborgarna bestämmer',
  'suveränitet': 'Självständighet och högsta makt',
  'samhällskontrakt': 'En överenskommelse mellan folk och stat',
  'representation': 'Att företräda någon annan',
  'legitimitet': 'Att vara rättmätigt accepterad',
  'institution': 'En organisation med viktiga uppgifter i samhället',
  'rättsstat': 'Ett samhälle där lagar gäller för alla',
  'marginaliserad': 'Utestängd från samhällets centrum',
  'desinformation': 'Falsk information som sprids medvetet',
  'globalisering': 'Att världens länder blir mer sammankopplade',

  // Kultur & musik
  'kommersialisering': 'Att något blir mer inriktat på att tjäna pengar',
  'ikonisk': 'Så känd att det blivit en symbol',
  'revolutionera': 'Förändra helt och hållet',
  'arv': 'Det som lämnas efter till kommande generationer',
  'eftermäle': 'Hur man minns någon efter deras tid',
  'koreografi': 'Planerade danssteg och rörelser',
  'influens': 'Påverkan från någon eller något',

  // Sport
  'disciplin': 'Självkontroll och ordning',
  'mental': 'Som har med tankar och sinne att göra',
  'rivalitet': 'Tävling mellan motståndare',
  'pensionering': 'Att sluta arbeta eller tävla',
  'mytisk': 'Legendarisk, nästan som i en saga',

  // Litteratur
  'protagonist': 'Huvudpersonen i en berättelse',
  'antagonist': 'Motståndaren i en berättelse',
  'narrativ': 'Berättelse eller berättande',
  'metafor': 'Ett bildligt uttryck som jämför två saker',
  'symbol': 'Något som representerar något annat',
  'tema': 'Huvudämnet eller budskapet i en text',

  // Historia
  'epok': 'En tidsperiod med speciella kännetecken',
  'revolution': 'En snabb och stor förändring',
  'koloni': 'Ett område som styrs av ett annat land',
  'imperium': 'Ett stort rike med många områden',
  'civilisation': 'Ett utvecklat samhälle med kultur och teknik',

  // Natur & miljö
  'ekosystem': 'Alla levande varelser och deras miljö tillsammans',
  'habitat': 'Livsmiljön där en art lever',
  'biodiversitet': 'Mångfald av olika arter',
  'hållbar': 'Som kan fortsätta utan att ta slut',
  'klimat': 'Vädret i ett område över lång tid',
};

// Hitta svåra ord i en text
export function findDifficultWords(text: string): string[] {
  const words = text.toLowerCase().match(/[a-zåäö]+/gi) || [];
  const uniqueWords = [...new Set(words)];
  return uniqueWords.filter(word => WORD_DICTIONARY[word.toLowerCase()]);
}

// Kolla om ett ord har en förklaring
export function hasExplanation(word: string): boolean {
  return !!WORD_DICTIONARY[word.toLowerCase()];
}

// Hämta förklaring för ett ord
export function getExplanation(word: string): string | null {
  return WORD_DICTIONARY[word.toLowerCase()] || null;
}
