import {
  CardGameTextType,
  CardGameLevel,
  CardType,
  GameCard,
  CardHand,
  Disposition,
  QuickCheck,
  Feedback,
  CheckStatus,
  CheckResult
} from '../types';

// ===========================================
// KORTLEKAR - Alla kort per texttyp
// ===========================================

// Berättande text - kortlek
const NARRATIVE_CARDS = {
  characters: [
    'en elev som är ny i klassen',
    'en modig hund',
    'en person som har en hemlighet',
    'ett barn som hittar något mystiskt',
    'en gammal kvinna med magiska krafter',
    'två bästa vänner som är olika',
    'en flicka som älskar äventyr',
    'en pojke som är rädd för mörker',
    'ett djur som kan prata',
    'en uppfinnare med galna idéer'
  ],
  places: [
    'skolgården',
    'en mörk skog',
    'ett museum',
    'en gammal vindsvåning',
    'en hemlig grotta',
    'en strand vid havet',
    'ett slott i fjärran',
    'ett torg i staden',
    'en övergiven byggnad',
    'en trädkoja'
  ],
  problems: [
    'något försvinner',
    'ett missförstånd',
    'tidsbrist',
    'en hemlighet avslöjas',
    'någon blir borttappad',
    'en ovän dyker upp',
    'ett svårt val måste göras',
    'en storm närmar sig',
    'en skatt måste hittas',
    'en vän behöver hjälp'
  ],
  turning_points: [
    'plötsligt händer något oväntat',
    'en ledtråd dyker upp',
    'en främling hjälper',
    'något magiskt sker',
    'ett minne kommer tillbaka',
    'en dörr öppnas',
    'ett brev anländer',
    'vädret förändras allt'
  ],
  solutions: [
    'en vän hjälper',
    'en smart idé',
    'mod krävs',
    'samarbete löser problemet',
    'ett gammalt råd kommer till nytta',
    'att säga sanningen hjälper',
    'att våga fråga om hjälp',
    'tålamod och uthållighet'
  ],
  time_words: [
    'först, sedan, till sist',
    'en dag, plötsligt, äntligen',
    'på morgonen, senare, på kvällen',
    'för länge sedan, nu, i framtiden'
  ],
  descriptive_words: [
    'stor, liten, snabb',
    'glad, ledsen, rädd',
    'vacker, mystisk, spännande',
    'tyst, högljudd, försiktig'
  ]
};

// Faktatext - kortlek
const FACTUAL_CARDS = {
  themes: [
    'vilda djur',
    'rymden och planeter',
    'den mänskliga kroppen',
    'vikingatiden',
    'sport och idrott',
    'hav och undervattensvärlden',
    'väder och klimat',
    'uppfinningar genom tiderna',
    'djur i Sverige',
    'fordon och transport'
  ],
  facts_appearance: [
    'utseende och storlek',
    'färg och form',
    'vikt och längd',
    'material och beståndsdelar'
  ],
  facts_environment: [
    'var det finns/lever',
    'klimat och miljö',
    'habitat och livsmiljö',
    'geografisk plats'
  ],
  facts_function: [
    'vad det används till',
    'hur det fungerar',
    'uppgift och syfte',
    'nytta för människan'
  ],
  facts_history: [
    'när det upptäcktes/uppfanns',
    'hur det utvecklats',
    'historisk bakgrund',
    'viktiga händelser'
  ],
  concepts: [
    'habitat, bytesdjur, rovdjur',
    'galax, planet, stjärna',
    'organ, cell, blodkärl',
    'runsten, vikingaskepp, trälar',
    'energi, kraft, hastighet',
    'korallrev, djuphav, plankton',
    'atmosfär, nederbörd, temperatur'
  ],
  connectives: [
    'dessutom',
    'till exempel',
    'därför',
    'eftersom',
    'det betyder att',
    'med andra ord',
    'faktiskt',
    'alltså'
  ]
};

// Instruktion - kortlek
const INSTRUCTION_CARDS = {
  tasks: [
    'en enkel lek utomhus',
    'ett pyssel med papper',
    'hur man borstar tänderna',
    'ett enkelt recept',
    'hur man planterar en frö',
    'hur man packar en väska',
    'ett kortspel',
    'hur man städar rummet',
    'ett enkelt experiment',
    'hur man ritar en figur'
  ],
  materials: [
    'papper, sax, lim',
    'pennor och färger',
    'en boll',
    'vatten och en mugg',
    'tyg och nål',
    'ingredienser från köket',
    'kartong och tejp',
    'naturmaterial'
  ],
  step_words: [
    'först',
    'sedan',
    'därefter',
    'till sist',
    'nästa steg',
    'när du är klar',
    'börja med',
    'fortsätt med'
  ],
  tips: [
    'ett tips för bättre resultat',
    'en varning att tänka på',
    'ett alternativ om något saknas',
    'hur man kan göra det roligare'
  ],
  checks: [
    'hur vet man att det blev rätt?',
    'vad ska resultatet se ut?',
    'hur kontrollerar man?',
    'tecken på att det lyckades'
  ]
};

// Argumenterande text - kortlek
const ARGUMENTATIVE_CARDS = {
  theses: [
    'Mobiler ska/inte ska vara tillåtna på lektioner',
    'Vi borde ha mer rast',
    'Läxor ska minska/öka',
    'Skolmaten borde förbättras',
    'Alla barn borde ha rätt till idrott',
    'Vi behöver fler böcker i skolan',
    'Skoldagen borde börja senare',
    'Det borde finnas fler lekplatser',
    'Barns åsikter borde lyssnas på mer',
    'Skärmar tar för mycket tid'
  ],
  audiences: [
    'rektorn',
    'klassrådet',
    'kommunen',
    'alla elever',
    'föräldrarna',
    'lärarna',
    'politikerna',
    'alla vuxna'
  ],
  arguments: [
    'lärande och kunskap',
    'trygghet och säkerhet',
    'hälsa och välmående',
    'rättvisa och jämlikhet',
    'tid och effektivitet',
    'miljö och natur',
    'ekonomi och pengar',
    'glädje och trivsel'
  ],
  examples: [
    'ett exempel från skolan',
    'en jämförelse med annat',
    'många elever tycker att...',
    'i andra skolor har man...',
    'forskning visar att...',
    'jag har själv upplevt att...'
  ],
  counter_arguments: [
    'Vissa tycker att...',
    'Ett motargument är...',
    'Man kan invända att...',
    'Kritiker menar att...'
  ],
  rebuttals: [
    'Men det stämmer inte helt eftersom...',
    'Ändå är det bättre att...',
    'Det kan vara sant, men...',
    'Trots det tycker jag att...'
  ],
  calls_to_action: [
    'Därför vill jag att...',
    'Jag föreslår att...',
    'Snälla, ändra...',
    'Vi måste börja...',
    'Tänk om vi kunde...',
    'Låt oss...'
  ],
  connectives: [
    'eftersom',
    'därför',
    'dessutom',
    'å ena sidan... å andra sidan',
    'för det första... för det andra',
    'till skillnad från',
    'sammanfattningsvis',
    'med tanke på detta'
  ]
};

// Utmaningskort för alla texttyper
const CHALLENGE_CARDS = {
  narrative: [
    'Använd minst 3 beskrivande ord',
    'Lägg in en dialog (någon säger något)',
    'Beskriv en känsla',
    'Använd ett ovanligt ord',
    'Börja mitt i händelsen'
  ],
  factual: [
    'Förklara minst ett begrepp',
    'Jämför med något annat',
    'Använd minst 4 ämnesord',
    'Lägg in en intressant detalj',
    'Avsluta med en tankeställare'
  ],
  instruction: [
    'Lägg in en varning',
    'Ge ett alternativ om något saknas',
    'Förklara varför ett steg är viktigt',
    'Använd exakta mått',
    'Lägg in ett tips för bättre resultat'
  ],
  argumentative: [
    'Bemöt ett motargument',
    'Använd ett exempel från verkligheten',
    'Ställ en retorisk fråga',
    'Avsluta med en kraftfull uppmaning',
    'Använd minst 3 sambandsord'
  ]
};

// ===========================================
// HJÄLPFUNKTIONER
// ===========================================

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function pickRandomMultiple<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, array.length));
}

// ===========================================
// KORTGENERERING
// ===========================================

export function generateCardHand(
  textType: CardGameTextType,
  level: CardGameLevel
): CardHand {
  const cards: GameCard[] = [];

  // Bestäm antal kort och byten baserat på nivå
  let totalCards: number;
  let maxSwaps: number;

  switch (level) {
    case CardGameLevel.A:
      totalCards = 6;
      maxSwaps = 1;
      break;
    case CardGameLevel.B:
      totalCards = 9;
      maxSwaps = 2;
      break;
    case CardGameLevel.C:
      totalCards = 12;
      maxSwaps = 2;
      break;
  }

  // Generera kort baserat på texttyp
  switch (textType) {
    case CardGameTextType.NARRATIVE:
      cards.push(...generateNarrativeCards(level));
      break;
    case CardGameTextType.FACTUAL:
      cards.push(...generateFactualCards(level));
      break;
    case CardGameTextType.INSTRUCTION:
      cards.push(...generateInstructionCards(level));
      break;
    case CardGameTextType.ARGUMENTATIVE:
      cards.push(...generateArgumentativeCards(level));
      break;
  }

  // Lägg alltid till utmaningskort för nivå C
  if (level === CardGameLevel.C) {
    const challengeArray = getChallengeArray(textType);
    cards.push(createCard(CardType.CHALLENGE, 'Utmaning', pickRandom(challengeArray)));
  }

  return {
    cards: cards.slice(0, totalCards),
    swapsRemaining: maxSwaps,
    maxSwaps
  };
}

function getChallengeArray(textType: CardGameTextType): string[] {
  switch (textType) {
    case CardGameTextType.NARRATIVE:
      return CHALLENGE_CARDS.narrative;
    case CardGameTextType.FACTUAL:
      return CHALLENGE_CARDS.factual;
    case CardGameTextType.INSTRUCTION:
      return CHALLENGE_CARDS.instruction;
    case CardGameTextType.ARGUMENTATIVE:
      return CHALLENGE_CARDS.argumentative;
  }
}

function createCard(type: CardType, category: string, content: string, description?: string): GameCard {
  return {
    id: generateId(),
    type,
    category,
    content,
    description
  };
}

function generateNarrativeCards(level: CardGameLevel): GameCard[] {
  const cards: GameCard[] = [];

  // Strukturkort
  cards.push(createCard(CardType.STRUCTURE, 'Rubrik', 'Hitta på en passande rubrik'));
  cards.push(createCard(CardType.STRUCTURE, 'Inledning', 'Börja med att presentera vem, var och när'));

  // Innehållskort
  cards.push(createCard(CardType.CONTENT, 'Karaktär', pickRandom(NARRATIVE_CARDS.characters)));
  cards.push(createCard(CardType.CONTENT, 'Plats', pickRandom(NARRATIVE_CARDS.places)));
  cards.push(createCard(CardType.CONTENT, 'Problem', pickRandom(NARRATIVE_CARDS.problems)));

  // Språkkort
  cards.push(createCard(CardType.LANGUAGE, 'Tidsord', pickRandom(NARRATIVE_CARDS.time_words)));

  if (level === CardGameLevel.B || level === CardGameLevel.C) {
    cards.push(createCard(CardType.CONTENT, 'Vändning', pickRandom(NARRATIVE_CARDS.turning_points)));
    cards.push(createCard(CardType.CONTENT, 'Lösning', pickRandom(NARRATIVE_CARDS.solutions)));
    cards.push(createCard(CardType.LANGUAGE, 'Beskrivande ord', pickRandom(NARRATIVE_CARDS.descriptive_words)));
  }

  if (level === CardGameLevel.C) {
    cards.push(createCard(CardType.STRUCTURE, 'Extra stycke', 'Lägg till en fördjupning eller bakgrund'));
    cards.push(createCard(CardType.LANGUAGE, 'Meningsstarter', 'Variera: Fråga, utrop, beskrivning'));
  }

  cards.push(createCard(CardType.STRUCTURE, 'Avslut', 'Avsluta berättelsen'));

  return cards;
}

function generateFactualCards(level: CardGameLevel): GameCard[] {
  const cards: GameCard[] = [];

  const theme = pickRandom(FACTUAL_CARDS.themes);

  // Strukturkort
  cards.push(createCard(CardType.STRUCTURE, 'Rubrik', 'Skriv en informativ rubrik'));
  cards.push(createCard(CardType.STRUCTURE, 'Inledning', 'Presentera ämnet kort'));

  // Innehållskort - tema
  cards.push(createCard(CardType.CONTENT, 'Tema', theme));

  // Faktakort
  cards.push(createCard(CardType.CONTENT, 'Fakta 1', pickRandom(FACTUAL_CARDS.facts_appearance)));

  if (level === CardGameLevel.B || level === CardGameLevel.C) {
    cards.push(createCard(CardType.CONTENT, 'Fakta 2', pickRandom(FACTUAL_CARDS.facts_environment)));
    cards.push(createCard(CardType.CONTENT, 'Fakta 3', pickRandom(FACTUAL_CARDS.facts_function)));

    // Begreppskort
    const concepts = pickRandom(FACTUAL_CARDS.concepts).split(', ');
    cards.push(createCard(CardType.CONTENT, 'Begrepp', concepts.join(', ')));
  }

  if (level === CardGameLevel.C) {
    cards.push(createCard(CardType.CONTENT, 'Fakta 4', pickRandom(FACTUAL_CARDS.facts_history)));
    cards.push(createCard(CardType.STRUCTURE, 'Fördjupning', 'Förklara ett begrepp mer utförligt'));
  }

  // Språkkort
  const connectives = pickRandomMultiple(FACTUAL_CARDS.connectives, level === CardGameLevel.A ? 2 : 3);
  cards.push(createCard(CardType.LANGUAGE, 'Sambandsord', connectives.join(', ')));

  cards.push(createCard(CardType.STRUCTURE, 'Avslut', 'Sammanfatta eller ge en avslutande tanke'));

  return cards;
}

function generateInstructionCards(level: CardGameLevel): GameCard[] {
  const cards: GameCard[] = [];

  // Strukturkort
  cards.push(createCard(CardType.STRUCTURE, 'Rubrik', 'Skriv en tydlig rubrik som berättar vad instruktionen handlar om'));
  cards.push(createCard(CardType.STRUCTURE, 'Inledning', 'Beskriv kort vad man ska göra och varför'));

  // Innehållskort
  cards.push(createCard(CardType.CONTENT, 'Uppgift', pickRandom(INSTRUCTION_CARDS.tasks)));
  cards.push(createCard(CardType.CONTENT, 'Material', pickRandom(INSTRUCTION_CARDS.materials)));

  // Stegkort
  const stepCount = level === CardGameLevel.A ? 3 : level === CardGameLevel.B ? 5 : 6;
  const stepWords = INSTRUCTION_CARDS.step_words.slice(0, stepCount);
  cards.push(createCard(CardType.LANGUAGE, 'Ordningsord', stepWords.join(', ')));

  if (level === CardGameLevel.B || level === CardGameLevel.C) {
    cards.push(createCard(CardType.CONTENT, 'Tips', pickRandom(INSTRUCTION_CARDS.tips)));
  }

  if (level === CardGameLevel.C) {
    cards.push(createCard(CardType.CONTENT, 'Kontroll', pickRandom(INSTRUCTION_CARDS.checks)));
    cards.push(createCard(CardType.STRUCTURE, 'Extra steg', 'Lägg till ett förklarande steg'));
  }

  cards.push(createCard(CardType.STRUCTURE, 'Avslut', 'Beskriv slutresultatet eller en uppmuntran'));

  return cards;
}

function generateArgumentativeCards(level: CardGameLevel): GameCard[] {
  const cards: GameCard[] = [];

  // Strukturkort
  cards.push(createCard(CardType.STRUCTURE, 'Rubrik', 'Skriv en rubrik som fångar läsarens uppmärksamhet'));
  cards.push(createCard(CardType.STRUCTURE, 'Inledning', 'Presentera ämnet och din åsikt'));

  // Innehållskort
  cards.push(createCard(CardType.CONTENT, 'Tes', pickRandom(ARGUMENTATIVE_CARDS.theses)));
  cards.push(createCard(CardType.CONTENT, 'Mottagare', pickRandom(ARGUMENTATIVE_CARDS.audiences)));

  // Argumentkort
  const argCount = level === CardGameLevel.A ? 1 : level === CardGameLevel.B ? 2 : 3;
  const args = pickRandomMultiple(ARGUMENTATIVE_CARDS.arguments, argCount);
  args.forEach((arg, i) => {
    cards.push(createCard(CardType.CONTENT, `Argument ${i + 1}`, arg));
  });

  // Exempelkort
  cards.push(createCard(CardType.CONTENT, 'Exempel', pickRandom(ARGUMENTATIVE_CARDS.examples)));

  // Språkkort
  const connectives = pickRandomMultiple(ARGUMENTATIVE_CARDS.connectives, level === CardGameLevel.A ? 2 : 3);
  cards.push(createCard(CardType.LANGUAGE, 'Sambandsord', connectives.join(', ')));

  if (level === CardGameLevel.C) {
    // Motargument och bemötande för nivå C
    cards.push(createCard(CardType.CONTENT, 'Motargument', pickRandom(ARGUMENTATIVE_CARDS.counter_arguments)));
    cards.push(createCard(CardType.CONTENT, 'Bemötande', pickRandom(ARGUMENTATIVE_CARDS.rebuttals)));
  }

  // Uppmaningskort
  cards.push(createCard(CardType.CONTENT, 'Uppmaning', pickRandom(ARGUMENTATIVE_CARDS.calls_to_action)));

  cards.push(createCard(CardType.STRUCTURE, 'Avslut', 'Avsluta med en stark sammanfattning'));

  return cards;
}

// ===========================================
// BYTE AV KORT
// ===========================================

export function swapCard(
  cardHand: CardHand,
  cardId: string,
  textType: CardGameTextType
): CardHand {
  if (cardHand.swapsRemaining <= 0) {
    return cardHand;
  }

  const cardIndex = cardHand.cards.findIndex(c => c.id === cardId);
  if (cardIndex === -1) {
    return cardHand;
  }

  const oldCard = cardHand.cards[cardIndex];
  const newCard = generateReplacementCard(oldCard, textType);

  const newCards = [...cardHand.cards];
  newCards[cardIndex] = newCard;

  return {
    ...cardHand,
    cards: newCards,
    swapsRemaining: cardHand.swapsRemaining - 1
  };
}

function generateReplacementCard(oldCard: GameCard, textType: CardGameTextType): GameCard {
  // Generera nytt kort av samma kategori
  const category = oldCard.category;

  switch (textType) {
    case CardGameTextType.NARRATIVE:
      return generateNarrativeReplacementCard(category, oldCard);
    case CardGameTextType.FACTUAL:
      return generateFactualReplacementCard(category, oldCard);
    case CardGameTextType.INSTRUCTION:
      return generateInstructionReplacementCard(category, oldCard);
    case CardGameTextType.ARGUMENTATIVE:
      return generateArgumentativeReplacementCard(category, oldCard);
  }
}

function generateNarrativeReplacementCard(category: string, oldCard: GameCard): GameCard {
  let newContent = oldCard.content;
  let attempts = 0;

  while (newContent === oldCard.content && attempts < 10) {
    switch (category) {
      case 'Karaktär':
        newContent = pickRandom(NARRATIVE_CARDS.characters);
        break;
      case 'Plats':
        newContent = pickRandom(NARRATIVE_CARDS.places);
        break;
      case 'Problem':
        newContent = pickRandom(NARRATIVE_CARDS.problems);
        break;
      case 'Vändning':
        newContent = pickRandom(NARRATIVE_CARDS.turning_points);
        break;
      case 'Lösning':
        newContent = pickRandom(NARRATIVE_CARDS.solutions);
        break;
      case 'Tidsord':
        newContent = pickRandom(NARRATIVE_CARDS.time_words);
        break;
      case 'Beskrivande ord':
        newContent = pickRandom(NARRATIVE_CARDS.descriptive_words);
        break;
      default:
        break;
    }
    attempts++;
  }

  return createCard(oldCard.type, category, newContent);
}

function generateFactualReplacementCard(category: string, oldCard: GameCard): GameCard {
  let newContent = oldCard.content;
  let attempts = 0;

  while (newContent === oldCard.content && attempts < 10) {
    switch (category) {
      case 'Tema':
        newContent = pickRandom(FACTUAL_CARDS.themes);
        break;
      case 'Fakta 1':
        newContent = pickRandom(FACTUAL_CARDS.facts_appearance);
        break;
      case 'Fakta 2':
        newContent = pickRandom(FACTUAL_CARDS.facts_environment);
        break;
      case 'Fakta 3':
        newContent = pickRandom(FACTUAL_CARDS.facts_function);
        break;
      case 'Fakta 4':
        newContent = pickRandom(FACTUAL_CARDS.facts_history);
        break;
      case 'Begrepp':
        newContent = pickRandom(FACTUAL_CARDS.concepts);
        break;
      case 'Sambandsord':
        newContent = pickRandomMultiple(FACTUAL_CARDS.connectives, 3).join(', ');
        break;
      default:
        break;
    }
    attempts++;
  }

  return createCard(oldCard.type, category, newContent);
}

function generateInstructionReplacementCard(category: string, oldCard: GameCard): GameCard {
  let newContent = oldCard.content;
  let attempts = 0;

  while (newContent === oldCard.content && attempts < 10) {
    switch (category) {
      case 'Uppgift':
        newContent = pickRandom(INSTRUCTION_CARDS.tasks);
        break;
      case 'Material':
        newContent = pickRandom(INSTRUCTION_CARDS.materials);
        break;
      case 'Tips':
        newContent = pickRandom(INSTRUCTION_CARDS.tips);
        break;
      case 'Kontroll':
        newContent = pickRandom(INSTRUCTION_CARDS.checks);
        break;
      default:
        break;
    }
    attempts++;
  }

  return createCard(oldCard.type, category, newContent);
}

function generateArgumentativeReplacementCard(category: string, oldCard: GameCard): GameCard {
  let newContent = oldCard.content;
  let attempts = 0;

  while (newContent === oldCard.content && attempts < 10) {
    switch (category) {
      case 'Tes':
        newContent = pickRandom(ARGUMENTATIVE_CARDS.theses);
        break;
      case 'Mottagare':
        newContent = pickRandom(ARGUMENTATIVE_CARDS.audiences);
        break;
      case 'Argument 1':
      case 'Argument 2':
      case 'Argument 3':
        newContent = pickRandom(ARGUMENTATIVE_CARDS.arguments);
        break;
      case 'Exempel':
        newContent = pickRandom(ARGUMENTATIVE_CARDS.examples);
        break;
      case 'Motargument':
        newContent = pickRandom(ARGUMENTATIVE_CARDS.counter_arguments);
        break;
      case 'Bemötande':
        newContent = pickRandom(ARGUMENTATIVE_CARDS.rebuttals);
        break;
      case 'Uppmaning':
        newContent = pickRandom(ARGUMENTATIVE_CARDS.calls_to_action);
        break;
      case 'Sambandsord':
        newContent = pickRandomMultiple(ARGUMENTATIVE_CARDS.connectives, 3).join(', ');
        break;
      default:
        break;
    }
    attempts++;
  }

  return createCard(oldCard.type, category, newContent);
}

// ===========================================
// DISPOSITION GENERERING
// ===========================================

export function generateDisposition(
  cards: GameCard[],
  textType: CardGameTextType,
  level: CardGameLevel
): Disposition {
  const disposition: Disposition = {
    rubrik: '',
    inledning: '',
    stycken: [],
    avslut: ''
  };

  // Hitta relevanta kort
  const rubrikCard = cards.find(c => c.category === 'Rubrik');
  const inledningCard = cards.find(c => c.category === 'Inledning');
  const avslutCard = cards.find(c => c.category === 'Avslut');

  disposition.rubrik = rubrikCard?.content || 'Hitta på en passande rubrik';
  disposition.inledning = inledningCard?.content || 'Skriv en inledning';
  disposition.avslut = avslutCard?.content || 'Skriv ett avslut';

  // Generera stycken baserat på texttyp
  switch (textType) {
    case CardGameTextType.NARRATIVE:
      disposition.stycken = generateNarrativeStycken(cards, level);
      break;
    case CardGameTextType.FACTUAL:
      disposition.stycken = generateFactualStycken(cards, level);
      break;
    case CardGameTextType.INSTRUCTION:
      disposition.stycken = generateInstructionStycken(cards, level);
      break;
    case CardGameTextType.ARGUMENTATIVE:
      disposition.stycken = generateArgumentativeStycken(cards, level);
      break;
  }

  return disposition;
}

function generateNarrativeStycken(cards: GameCard[], level: CardGameLevel): string[] {
  const stycken: string[] = [];

  const karaktar = cards.find(c => c.category === 'Karaktär')?.content || 'en karaktär';
  const plats = cards.find(c => c.category === 'Plats')?.content || 'en plats';
  const problem = cards.find(c => c.category === 'Problem')?.content || 'ett problem';
  const vandning = cards.find(c => c.category === 'Vändning')?.content;
  const losning = cards.find(c => c.category === 'Lösning')?.content;

  stycken.push(`Stycke 1: Beskriv ${karaktar} på ${plats}`);
  stycken.push(`Stycke 2: Berätta om problemet - ${problem}`);

  if (level === CardGameLevel.B || level === CardGameLevel.C) {
    if (vandning) stycken.push(`Stycke 3: Vändningen - ${vandning}`);
    if (losning) stycken.push(`Stycke 4: Lösningen - ${losning}`);
  }

  return stycken;
}

function generateFactualStycken(cards: GameCard[], level: CardGameLevel): string[] {
  const stycken: string[] = [];

  const tema = cards.find(c => c.category === 'Tema')?.content || 'ämnet';
  const fakta1 = cards.find(c => c.category === 'Fakta 1')?.content;
  const fakta2 = cards.find(c => c.category === 'Fakta 2')?.content;
  const fakta3 = cards.find(c => c.category === 'Fakta 3')?.content;
  const fakta4 = cards.find(c => c.category === 'Fakta 4')?.content;

  stycken.push(`Stycke 1: Fakta om ${tema} - ${fakta1 || 'beskriv utseende'}`);

  if (level === CardGameLevel.B || level === CardGameLevel.C) {
    if (fakta2) stycken.push(`Stycke 2: ${fakta2}`);
    if (fakta3) stycken.push(`Stycke 3: ${fakta3}`);
  }

  if (level === CardGameLevel.C && fakta4) {
    stycken.push(`Stycke 4: ${fakta4}`);
  }

  return stycken;
}

function generateInstructionStycken(cards: GameCard[], level: CardGameLevel): string[] {
  const stycken: string[] = [];

  const uppgift = cards.find(c => c.category === 'Uppgift')?.content || 'uppgiften';
  const material = cards.find(c => c.category === 'Material')?.content || 'material';

  stycken.push(`Material: Det här behöver du - ${material}`);

  const stepCount = level === CardGameLevel.A ? 3 : level === CardGameLevel.B ? 5 : 6;
  for (let i = 1; i <= stepCount; i++) {
    stycken.push(`Steg ${i}: Beskriv vad man gör`);
  }

  const tips = cards.find(c => c.category === 'Tips')?.content;
  if (tips && (level === CardGameLevel.B || level === CardGameLevel.C)) {
    stycken.push(`Tips: ${tips}`);
  }

  return stycken;
}

function generateArgumentativeStycken(cards: GameCard[], level: CardGameLevel): string[] {
  const stycken: string[] = [];

  const tes = cards.find(c => c.category === 'Tes')?.content || 'din åsikt';
  const mottagare = cards.find(c => c.category === 'Mottagare')?.content || 'läsaren';
  const args = cards.filter(c => c.category.startsWith('Argument'));
  const exempel = cards.find(c => c.category === 'Exempel')?.content;
  const motargument = cards.find(c => c.category === 'Motargument')?.content;
  const bemotande = cards.find(c => c.category === 'Bemötande')?.content;
  const uppmaning = cards.find(c => c.category === 'Uppmaning')?.content;

  stycken.push(`Stycke 1: Presentera din tes - ${tes}`);

  args.forEach((arg, i) => {
    stycken.push(`Stycke ${i + 2}: Argument - ${arg.content}${exempel && i === 0 ? ` (använd ${exempel})` : ''}`);
  });

  if (level === CardGameLevel.C && motargument && bemotande) {
    stycken.push(`Stycke: Motargument och bemötande - ${motargument} ${bemotande}`);
  }

  if (uppmaning) {
    stycken.push(`Avslut med uppmaning: ${uppmaning}`);
  }

  return stycken;
}

// ===========================================
// TEXTANALYS OCH SNABBCHECK
// ===========================================

const SAMBANDSORD = [
  'dessutom', 'eftersom', 'därför', 'därför att', 'till exempel',
  'men', 'dock', 'samtidigt', 'ändå', 'trots', 'fast',
  'alltså', 'således', 'följaktligen',
  'för det första', 'för det andra', 'för det tredje',
  'å ena sidan', 'å andra sidan',
  'sammanfattningsvis', 'slutligen', 'med andra ord',
  'det betyder att', 'faktiskt', 'nämligen'
];

const ORDNINGSORD = [
  'först', 'sedan', 'därefter', 'till sist', 'slutligen',
  'nästa steg', 'efter det', 'till slut', 'äntligen',
  'börja med', 'fortsätt med', 'avsluta med',
  'en dag', 'plötsligt', 'på morgonen', 'på kvällen', 'senare'
];

export function analyzeText(
  text: string,
  textType: CardGameTextType,
  level: CardGameLevel,
  cards: GameCard[]
): QuickCheck {
  const lines = text.split('\n').filter(l => l.trim());
  const lowerText = text.toLowerCase();

  // Räkna meningar (ungefärligt)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length;

  // Kontrollera rubrik (första raden utan punkt)
  const hasTitle = lines.length > 0 && !lines[0].trim().endsWith('.');
  const rubrikCheck = createCheckResult(
    'Rubrik',
    hasTitle ? CheckStatus.FULFILLED : CheckStatus.MISSING,
    hasTitle ? 'Bra! Du har en rubrik.' : 'Lägg till en rubrik överst.'
  );

  // Kontrollera stycken (radbrytningar)
  const paragraphCount = lines.length;
  let styckenCheck: CheckResult;

  if (level === CardGameLevel.A) {
    styckenCheck = createCheckResult(
      'Stycken',
      paragraphCount >= 2 ? CheckStatus.FULFILLED : CheckStatus.ALMOST,
      paragraphCount >= 2 ? 'Bra struktur!' : 'Försök dela upp texten lite.'
    );
  } else {
    const requiredParagraphs = level === CardGameLevel.B ? 3 : 4;
    styckenCheck = createCheckResult(
      'Stycken',
      paragraphCount >= requiredParagraphs ? CheckStatus.FULFILLED :
        paragraphCount >= requiredParagraphs - 1 ? CheckStatus.ALMOST : CheckStatus.MISSING,
      paragraphCount >= requiredParagraphs ?
        'Bra! Du har flera stycken.' :
        `Du behöver fler stycken (minst ${requiredParagraphs}).`
    );
  }

  // Kontrollera antal meningar
  let minSentences: number;
  let maxSentences: number;

  switch (level) {
    case CardGameLevel.A:
      minSentences = textType === CardGameTextType.INSTRUCTION ? 3 : 4;
      maxSentences = textType === CardGameTextType.INSTRUCTION ? 6 : 8;
      break;
    case CardGameLevel.B:
      minSentences = 8;
      maxSentences = 15;
      break;
    case CardGameLevel.C:
      minSentences = 12;
      maxSentences = 25;
      break;
  }

  const meningarCheck = createCheckResult(
    'Meningar',
    sentenceCount >= minSentences ? CheckStatus.FULFILLED :
      sentenceCount >= minSentences - 2 ? CheckStatus.ALMOST : CheckStatus.MISSING,
    sentenceCount >= minSentences ?
      `Bra! Du har ${sentenceCount} meningar.` :
      `Du har ${sentenceCount} meningar. Sikta på minst ${minSentences}.`
  );

  // Kontrollera sambandsord/ordningsord
  const foundConnectives = [...SAMBANDSORD, ...ORDNINGSORD].filter(word =>
    lowerText.includes(word.toLowerCase())
  );
  const requiredConnectives = level === CardGameLevel.A ? 1 : level === CardGameLevel.B ? 2 : 3;

  const sambandsordCheck = createCheckResult(
    'Sambandsord/Ordningsord',
    foundConnectives.length >= requiredConnectives ? CheckStatus.FULFILLED :
      foundConnectives.length >= 1 ? CheckStatus.ALMOST : CheckStatus.MISSING,
    foundConnectives.length >= requiredConnectives ?
      `Bra! Du använder: ${foundConnectives.slice(0, 3).join(', ')}` :
      `Använd fler ord som: först, sedan, dessutom, därför. (Hittade: ${foundConnectives.length})`
  );

  const quickCheck: QuickCheck = {
    rubrik: rubrikCheck,
    stycken: styckenCheck,
    meningar: meningarCheck,
    sambandsord: sambandsordCheck
  };

  // Texttyp-specifika kontroller
  if (textType === CardGameTextType.FACTUAL) {
    const conceptCard = cards.find(c => c.category === 'Begrepp');
    const themeCard = cards.find(c => c.category === 'Tema');

    const ämnesord: string[] = [];
    if (conceptCard) {
      ämnesord.push(...conceptCard.content.split(', ').map(w => w.trim().toLowerCase()));
    }
    if (themeCard) {
      ämnesord.push(themeCard.content.toLowerCase());
    }

    const foundTerms = ämnesord.filter(word => lowerText.includes(word));
    const requiredTerms = level === CardGameLevel.A ? 1 : level === CardGameLevel.B ? 2 : 4;

    quickCheck.amnesord = createCheckResult(
      'Ämnesord',
      foundTerms.length >= requiredTerms ? CheckStatus.FULFILLED :
        foundTerms.length >= 1 ? CheckStatus.ALMOST : CheckStatus.MISSING,
      foundTerms.length >= requiredTerms ?
        `Bra! Du använder ämnesord från korten.` :
        `Använd fler ämnesord från dina kort. (Hittade: ${foundTerms.length})`
    );
  }

  if (textType === CardGameTextType.ARGUMENTATIVE) {
    // Enkel kontroll av argumenterande drag
    const hasTes = lowerText.includes('tycker') || lowerText.includes('anser') ||
      lowerText.includes('menar') || lowerText.includes('borde') ||
      lowerText.includes('ska') || lowerText.includes('måste');

    const hasArgument = lowerText.includes('eftersom') || lowerText.includes('därför') ||
      lowerText.includes('för att') || lowerText.includes('anledning');

    const hasMotargument = lowerText.includes('vissa tycker') || lowerText.includes('motargument') ||
      lowerText.includes('å andra sidan') || lowerText.includes('kritiker');

    const hasUppmaning = lowerText.includes('därför vill jag') || lowerText.includes('jag föreslår') ||
      lowerText.includes('snälla') || lowerText.includes('låt oss') ||
      lowerText.includes('vi måste') || lowerText.includes('tänk om');

    quickCheck.argumentDrag = {
      tes: createCheckResult(
        'Tes',
        hasTes ? CheckStatus.FULFILLED : CheckStatus.MISSING,
        hasTes ? 'Bra! Du har en tydlig åsikt.' : 'Uttryck tydligare vad du tycker.'
      ),
      argument: createCheckResult(
        'Argument',
        hasArgument ? CheckStatus.FULFILLED : CheckStatus.ALMOST,
        hasArgument ? 'Bra! Du har argument.' : 'Förklara varför du tycker så.'
      ),
      uppmaning: createCheckResult(
        'Uppmaning',
        hasUppmaning ? CheckStatus.FULFILLED : CheckStatus.ALMOST,
        hasUppmaning ? 'Bra avslutning!' : 'Avsluta med att säga vad du vill ska hända.'
      )
    };

    if (level === CardGameLevel.C) {
      quickCheck.argumentDrag.motargument = createCheckResult(
        'Motargument',
        hasMotargument ? CheckStatus.FULFILLED : CheckStatus.MISSING,
        hasMotargument ? 'Bra! Du bemöter motargument.' : 'Nämn och bemöt vad andra kan tycka.'
      );
    }
  }

  return quickCheck;
}

function createCheckResult(label: string, status: CheckStatus, comment: string): CheckResult {
  return { label, status, comment };
}

// ===========================================
// FEEDBACK GENERERING
// ===========================================

export function generateFeedback(
  quickCheck: QuickCheck,
  textType: CardGameTextType,
  level: CardGameLevel
): Feedback {
  const styrkor: string[] = [];
  const nastaSteg: string[] = [];

  // Analysera snabbchecken för att hitta styrkor och förbättringsområden
  const checks = [
    quickCheck.rubrik,
    quickCheck.stycken,
    quickCheck.meningar,
    quickCheck.sambandsord
  ];

  if (quickCheck.amnesord) {
    checks.push(quickCheck.amnesord);
  }

  if (quickCheck.argumentDrag) {
    checks.push(
      quickCheck.argumentDrag.tes,
      quickCheck.argumentDrag.argument,
      quickCheck.argumentDrag.uppmaning
    );
    if (quickCheck.argumentDrag.motargument) {
      checks.push(quickCheck.argumentDrag.motargument);
    }
  }

  // Hitta styrkor (fulfilled)
  checks.forEach(check => {
    if (check.status === CheckStatus.FULFILLED) {
      styrkor.push(check.comment);
    }
  });

  // Hitta förbättringsområden (almost eller missing)
  checks.forEach(check => {
    if (check.status === CheckStatus.ALMOST || check.status === CheckStatus.MISSING) {
      nastaSteg.push(check.comment);
    }
  });

  // Se till att vi har minst 2 av varje
  while (styrkor.length < 2) {
    styrkor.push('Du har skrivit en text - bra jobbat!');
  }
  while (nastaSteg.length < 2) {
    nastaSteg.push('Fortsätt öva på att skriva längre texter.');
  }

  // Generera mikro-övning baserat på det viktigaste förbättringsområdet
  const mikroOvning = generateMicroExercise(quickCheck, textType, level);

  return {
    styrka1: styrkor[0],
    styrka2: styrkor[1],
    nastaSteg1: nastaSteg[0],
    nastaSteg2: nastaSteg[1],
    mikroOvning
  };
}

function generateMicroExercise(
  quickCheck: QuickCheck,
  textType: CardGameTextType,
  level: CardGameLevel
): string {
  // Prioritera baserat på vad som saknas
  if (quickCheck.rubrik.status !== CheckStatus.FULFILLED) {
    return 'Skriv en rubrik på max 5 ord som lockar läsaren.';
  }

  if (quickCheck.stycken.status === CheckStatus.MISSING) {
    return 'Dela din text i minst 2 stycken genom att trycka Enter mellan dem.';
  }

  if (quickCheck.sambandsord.status === CheckStatus.MISSING) {
    const words = textType === CardGameTextType.INSTRUCTION ?
      'först, sedan, därefter, till sist' :
      'dessutom, eftersom, därför, till exempel';
    return `Lägg till 2 av dessa ord i din text: ${words}`;
  }

  if (quickCheck.meningar.status !== CheckStatus.FULFILLED) {
    return 'Lägg till 2 meningar till i din text. Beskriv något mer!';
  }

  if (quickCheck.amnesord && quickCheck.amnesord.status !== CheckStatus.FULFILLED) {
    return 'Använd 2 ämnesord från dina kort i texten.';
  }

  if (quickCheck.argumentDrag) {
    if (quickCheck.argumentDrag.tes.status !== CheckStatus.FULFILLED) {
      return 'Börja en mening med "Jag tycker att..." eller "Jag anser att..."';
    }
    if (quickCheck.argumentDrag.argument.status !== CheckStatus.FULFILLED) {
      return 'Lägg till "...eftersom..." efter din åsikt för att förklara varför.';
    }
    if (quickCheck.argumentDrag.motargument &&
      quickCheck.argumentDrag.motargument.status !== CheckStatus.FULFILLED) {
      return 'Lägg till: "Vissa tycker att... men jag menar att..."';
    }
  }

  // Fallback baserat på texttyp
  switch (textType) {
    case CardGameTextType.NARRATIVE:
      return 'Byt ut 2 vanliga ord mot mer beskrivande ord (t.ex. "gick" → "smög").';
    case CardGameTextType.FACTUAL:
      return 'Förklara ett begrepp med egna ord: "Det betyder att..."';
    case CardGameTextType.INSTRUCTION:
      return 'Lägg till ett tips i slutet: "Ett tips är att..."';
    case CardGameTextType.ARGUMENTATIVE:
      return 'Avsluta med en tydlig uppmaning: "Därför vill jag att..."';
  }
}

// ===========================================
// CHECKLISTA GENERERING
// ===========================================

export function generateChecklist(
  textType: CardGameTextType,
  level: CardGameLevel
): string[] {
  const checklist: string[] = [];

  // Grundläggande krav för alla
  checklist.push('Skriv en rubrik överst');

  switch (level) {
    case CardGameLevel.A:
      checklist.push('Skriv minst 4 meningar');
      checklist.push('Använd minst 1 ordningsord (först/sedan/till sist)');
      break;
    case CardGameLevel.B:
      checklist.push('Dela texten i minst 2 stycken');
      checklist.push('Skriv 8-15 meningar');
      checklist.push('Använd minst 2 sambandsord');
      break;
    case CardGameLevel.C:
      checklist.push('Dela texten i minst 3 stycken');
      checklist.push('Skriv 12-25 meningar');
      checklist.push('Använd minst 3 sambandsord');
      checklist.push('Variera meningsstarter (börja inte alla lika)');
      break;
  }

  // Texttyp-specifika krav
  switch (textType) {
    case CardGameTextType.NARRATIVE:
      if (level === CardGameLevel.A) {
        checklist.push('Beskriv vem, var och vad som händer');
      } else {
        checklist.push('Beskriv karaktär, plats, problem och lösning');
      }
      break;
    case CardGameTextType.FACTUAL:
      if (level === CardGameLevel.B) {
        checklist.push('Använd minst 2 ämnesord från korten');
      } else if (level === CardGameLevel.C) {
        checklist.push('Använd minst 4 ämnesord och förklara 1 begrepp');
      }
      break;
    case CardGameTextType.INSTRUCTION:
      if (level === CardGameLevel.A) {
        checklist.push('Skriv 3-4 tydliga steg');
      } else {
        checklist.push('Skriv 4-6 tydliga steg med ordningsord');
      }
      break;
    case CardGameTextType.ARGUMENTATIVE:
      if (level === CardGameLevel.A) {
        checklist.push('Skriv din åsikt + 1 anledning + 1 önskan');
      } else if (level === CardGameLevel.B) {
        checklist.push('Skriv en tydlig tes + minst 2 argument + uppmaning');
      } else {
        checklist.push('Skriv tes + 3 argument + bemöt 1 motargument + uppmaning');
      }
      break;
  }

  return checklist;
}
