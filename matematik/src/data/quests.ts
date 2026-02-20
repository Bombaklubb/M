import { WorldId } from './worlds';

export interface QuestStep {
  id: string;
  narrative: string;       // story text shown before the question
  question: string;
  type: 'fill-in' | 'multiple-choice' | 'true-false';
  answer?: string | number;
  acceptableAnswers?: string[];
  options?: string[];
  correctIndex?: number;
  isTrue?: boolean;
  explanation: string;
  rewardEmoji: string;     // emoji shown on correct
}

export interface Quest {
  id: string;
  worldId: WorldId;
  title: string;
  emoji: string;
  description: string;
  storyColor: string;      // tailwind gradient
  steps: QuestStep[];
  rewardItem: string;      // collection item unlocked
  rewardEmoji: string;
}

export const QUESTS: Quest[] = [
  // ======================== DINO WORLD ========================
  {
    id: 'dino-eggs',
    worldId: 'dino',
    title: 'Rädda Dinosaurieäggen!',
    emoji: '🥚',
    description: 'Vulkanen vaknar – hjälp Dino samla alla 10 ägg innan lavan rinner!',
    storyColor: 'from-green-500 to-emerald-700',
    rewardItem: 'dino-baby',
    rewardEmoji: '🦕',
    steps: [
      {
        id: 'de-1',
        narrative: '🌋 Vulkanen mullrar! Dino hittar 3 ägg i busken och 4 ägg vid dammen.',
        question: 'Hur många ägg hittade Dino totalt?',
        type: 'fill-in',
        answer: '7',
        explanation: '3 + 4 = 7 ägg.',
        rewardEmoji: '🥚',
      },
      {
        id: 'de-2',
        narrative: '🦖 En stor T-Rex springer förbi och slår ner 2 ägg! Oj!',
        question: 'Dino hade 7 ägg. T-Rex förstörde 2. Hur många finns kvar?',
        type: 'fill-in',
        answer: '5',
        explanation: '7 - 2 = 5 ägg kvar.',
        rewardEmoji: '🛡️',
      },
      {
        id: 'de-3',
        narrative: '🌿 Dinos vän Tricera hjälper till och hittar dubbelt så många ägg som Dino.',
        question: 'Dino har 5 ägg. Tricera har dubbelt så många. Hur många har Tricera?',
        type: 'multiple-choice',
        options: ['8', '10', '12', '15'],
        correctIndex: 1,
        explanation: 'Dubbelt av 5 = 5 × 2 = 10 ägg.',
        rewardEmoji: '🤝',
      },
      {
        id: 'de-4',
        narrative: '🏃 De springer mot berget! Det är 8 steg kvar men Dino kan hoppa 2 steg åt gången.',
        question: 'Om Dino hoppar 2 steg i taget, hur många hopp tar det att nå berget (8 steg)?',
        type: 'fill-in',
        answer: '4',
        explanation: '8 ÷ 2 = 4 hopp.',
        rewardEmoji: '⛰️',
      },
      {
        id: 'de-5',
        narrative: '🎉 De når berget i tid! Totalt räddade de 5 + 10 = 15 ägg. Är de fler än 14?',
        question: '15 > 14?',
        type: 'true-false',
        isTrue: true,
        explanation: 'Ja! 15 är större än 14. Alla ägg är räddade!',
        rewardEmoji: '🏆',
      },
    ],
  },
  {
    id: 'dino-count',
    worldId: 'dino',
    title: 'Dinosauriernas Talräkning',
    emoji: '🔢',
    description: 'Hjälp stordino räkna sina vänner och förstå ordning!',
    storyColor: 'from-teal-500 to-green-600',
    rewardItem: 'dino-crown',
    rewardEmoji: '👑',
    steps: [
      {
        id: 'dc-1',
        narrative: '🦕 Stordino vill ha en fest! Fem vänner ska komma. Räkna dem!',
        question: 'Vilket tal är fem?',
        type: 'multiple-choice',
        options: ['4', '5', '6', '7'],
        correctIndex: 1,
        explanation: 'Fem är siffran 5!',
        rewardEmoji: '🎉',
      },
      {
        id: 'dc-2',
        narrative: '🎈 Det finns 10 ballonger och 5 dinosaurier. Varje dino ska ha lika många ballonger.',
        question: 'Hur många ballonger får varje dino?',
        type: 'fill-in',
        answer: '2',
        explanation: '10 ÷ 5 = 2 ballonger var.',
        rewardEmoji: '🎈',
      },
      {
        id: 'dc-3',
        narrative: '🕐 Festen börjar klockan 3. Det är nu klockan 1. Hur lång tid är det kvar?',
        question: 'Hur många timmar till festen?',
        type: 'fill-in',
        answer: '2',
        explanation: 'Från klockan 1 till klockan 3 = 2 timmar.',
        rewardEmoji: '⏰',
      },
      {
        id: 'dc-4',
        narrative: '🍰 Det finns 8 kakor och dinosaurierna äter 3. Hur många är kvar?',
        question: '8 - 3 = ?',
        type: 'fill-in',
        answer: '5',
        explanation: '8 - 3 = 5 kakor kvar.',
        rewardEmoji: '🍰',
      },
      {
        id: 'dc-5',
        narrative: '🌟 Festen är en succé! Var det fler eller färre än 10 gäster (det kom 5 dinos)?',
        question: 'Kom det fler än 10 gäster?',
        type: 'true-false',
        isTrue: false,
        explanation: 'Nej, det kom 5 dinosaurier – det är färre än 10.',
        rewardEmoji: '🌟',
      },
    ],
  },

  // ====================== FANTASY WORLD ======================
  {
    id: 'dragon-treasure',
    worldId: 'fantasy',
    title: 'Drakens Skatt',
    emoji: '🐉',
    description: 'Draken vaktar skatten! Lös hans gåtor för att vinna guldet.',
    storyColor: 'from-purple-600 to-fuchsia-700',
    rewardItem: 'dragon-gem',
    rewardEmoji: '💎',
    steps: [
      {
        id: 'dt-1',
        narrative: '🏰 Du möter draken vid porten. Han håller 3/4 av skatten. Riddaren har 1/4.',
        question: 'Hur mycket av skatten har draken och riddaren tillsammans?',
        type: 'multiple-choice',
        options: ['1/2', '3/4', '4/4 (hela!)', '2/4'],
        correctIndex: 2,
        explanation: '3/4 + 1/4 = 4/4 = 1 hel skatt!',
        rewardEmoji: '🔑',
      },
      {
        id: 'dt-2',
        narrative: '💎 Skatten innehåller 60 guldmynt. Draken ger dig 25% av dem.',
        question: '25% av 60 guldmynt = ?',
        type: 'fill-in',
        answer: '15',
        explanation: '25% = 1/4. 60 ÷ 4 = 15 guldmynt.',
        rewardEmoji: '💰',
      },
      {
        id: 'dt-3',
        narrative: '⚔️ En trollkarl erbjuder sig att fördubbla dina mynt mot 5 i avgift.',
        question: 'Du har 15 mynt. 15 × 2 - 5 = ?',
        type: 'fill-in',
        answer: '25',
        explanation: '15 × 2 = 30, 30 - 5 = 25 mynt.',
        rewardEmoji: '🪄',
      },
      {
        id: 'dt-4',
        narrative: '📦 Du hittar en kista som är 4 dm lång, 3 dm bred och 2 dm hög.',
        question: 'Vad är kistans omkrets på locket (4 × 3-sidan)?',
        type: 'fill-in',
        answer: '14',
        explanation: 'Omkrets = 2 × (4+3) = 14 dm.',
        rewardEmoji: '📦',
      },
      {
        id: 'dt-5',
        narrative: '🎉 Du vinner! Draken beundrar din kunskap. Hade du mer än 20 mynt till slut?',
        question: 'Du har 25 mynt. Är det mer än 20?',
        type: 'true-false',
        isTrue: true,
        explanation: 'Ja! 25 > 20. Du är rik!',
        rewardEmoji: '👑',
      },
    ],
  },
  {
    id: 'wizard-school',
    worldId: 'fantasy',
    title: 'Trollkarlsskolan',
    emoji: '🧙',
    description: 'Lär dig trolla med bråk och decimaler för att ta examen!',
    storyColor: 'from-violet-600 to-purple-800',
    rewardItem: 'magic-wand',
    rewardEmoji: '🪄',
    steps: [
      {
        id: 'ws-1',
        narrative: '📚 Trollkarlarnas skola! Läraren ger dig ett bråktest.',
        question: 'Vilket bråk är större – 2/3 eller 3/4?',
        type: 'multiple-choice',
        options: ['2/3', '3/4', 'Lika stora', 'Går ej jämföra'],
        correctIndex: 1,
        explanation: '3/4 = 0,75 och 2/3 ≈ 0,67. Alltså 3/4 > 2/3.',
        rewardEmoji: '📖',
      },
      {
        id: 'ws-2',
        narrative: '🔮 Du brygger ett trolldryck: 0,5 liter av en ingrediens och 1,5 liter av en annan.',
        question: '0,5 + 1,5 = ?',
        type: 'fill-in',
        answer: '2',
        explanation: '0,5 + 1,5 = 2,0 = 2 liter totalt.',
        rewardEmoji: '🧪',
      },
      {
        id: 'ws-3',
        narrative: '💫 Du måste dela 3/4 liter trolldryck med 3 elever lika.',
        question: 'Hur mycket dryck får varje elev? (3/4 ÷ 3 = ?/4)',
        type: 'fill-in',
        answer: '1/4',
        acceptableAnswers: ['1/4', '0.25', '0,25', '0.25 liter'],
        explanation: '3/4 ÷ 3 = 1/4 liter var.',
        rewardEmoji: '🫗',
      },
      {
        id: 'ws-4',
        narrative: '📏 Du ritar en trollcirkel med 8 dm diameter. En drakskala kostar 2,50 kr.',
        question: 'Omkretsen av trollcirkeln (ungefär): 3 × 8 = ?',
        type: 'fill-in',
        answer: '24',
        explanation: 'C ≈ 3 × diameter = 3 × 8 = 24 dm.',
        rewardEmoji: '⭕',
      },
      {
        id: 'ws-5',
        narrative: '🎓 Examen! Läraren säger: "Om 50% av klassen godkänns och klassen har 20 elever..."',
        question: 'Hur många elever godkänns?',
        type: 'fill-in',
        answer: '10',
        explanation: '50% av 20 = 10 elever.',
        rewardEmoji: '🎓',
      },
    ],
  },

  // ======================== SCI-FI WORLD ========================
  {
    id: 'space-oxygen',
    worldId: 'scifi',
    title: 'Rädda Syret i Rymden!',
    emoji: '🚀',
    description: 'Rymdstationens syresystem går sönder. Lös algebraekvationerna för att reparera det!',
    storyColor: 'from-blue-700 to-indigo-800',
    rewardItem: 'space-helmet',
    rewardEmoji: '👨‍🚀',
    steps: [
      {
        id: 'so-1',
        narrative: '🚨 LARM! Syrenivån sjunker. Datorn säger: "x + 150 = 400 liter syrekvar".',
        question: 'Lös: x + 150 = 400. Vad är x?',
        type: 'fill-in',
        answer: '250',
        explanation: 'x = 400 - 150 = 250 liter syre förbrukat.',
        rewardEmoji: '💨',
      },
      {
        id: 'so-2',
        narrative: '🔧 Du hittar rören. Varje rör levererar 3x liter syre per minut.',
        question: 'Om syret måste nå 90 liter/min och 3x = 90, vad är x?',
        type: 'fill-in',
        answer: '30',
        explanation: 'x = 90 ÷ 3 = 30.',
        rewardEmoji: '🛠️',
      },
      {
        id: 'so-3',
        narrative: '📊 Sensorn visar data: [45, 50, 50, 55, 60]. Vad är medelvärdet?',
        question: 'Medelvärde av 45, 50, 50, 55, 60 = ?',
        type: 'fill-in',
        answer: '52',
        explanation: '(45+50+50+55+60) ÷ 5 = 260 ÷ 5 = 52.',
        rewardEmoji: '📈',
      },
      {
        id: 'so-4',
        narrative: '⚗️ Reaktorn behöver en speciell formel: f(t) = 2t + 10 liter per timme.',
        question: 'Hur mycket syre produceras efter 5 timmar? f(5) = ?',
        type: 'fill-in',
        answer: '20',
        explanation: 'f(5) = 2 × 5 + 10 = 10 + 10 = 20 liter/timme.',
        rewardEmoji: '⚡',
      },
      {
        id: 'so-5',
        narrative: '🎯 Sannolikheten att systemet håller utan reparation är 0,2. Du reparerar det. Nu är sannolikheten 0,95.',
        question: 'Ökade sannolikheten? (0,95 > 0,2?)',
        type: 'true-false',
        isTrue: true,
        explanation: 'Ja! 0,95 > 0,2. Din reparation funkade!',
        rewardEmoji: '✅',
      },
    ],
  },
  {
    id: 'robot-factory',
    worldId: 'scifi',
    title: 'Robotfabriken',
    emoji: '🤖',
    description: 'Programmera robotarna med statistik och ekvationer!',
    storyColor: 'from-cyan-600 to-blue-800',
    rewardItem: 'robot-buddy',
    rewardEmoji: '🤖',
    steps: [
      {
        id: 'rf-1',
        narrative: '🏭 Fabriken producerar robotar. Modell A tar 2x+6 timmar. Modell B tar 3x-3 timmar.',
        question: 'När tar de lika lång tid? Lös 2x+6 = 3x-3. x = ?',
        type: 'fill-in',
        answer: '9',
        explanation: '6+3 = 3x-2x → x = 9.',
        rewardEmoji: '⚙️',
      },
      {
        id: 'rf-2',
        narrative: '📊 Kvalitetskontroll! Testresultat: 78, 85, 85, 90, 92. Vad är typvärdet?',
        question: 'Typvärde (det vanligaste talet)?',
        type: 'fill-in',
        answer: '85',
        explanation: '85 förekommer två gånger – det är typvärdet.',
        rewardEmoji: '🔍',
      },
      {
        id: 'rf-3',
        narrative: '🎲 En robot väljer slumpmässigt en av 6 uppgifter. Vad är sannolikheten att den väljer uppgift 3?',
        question: 'P(uppgift 3) = ? (skriv som bråk)',
        type: 'multiple-choice',
        options: ['1/3', '1/6', '1/4', '1/2'],
        correctIndex: 1,
        explanation: '1 av 6 möjliga = 1/6.',
        rewardEmoji: '🎰',
      },
      {
        id: 'rf-4',
        narrative: '📐 Robotens arbetsyta är ett rektangulärt rum 8 × 5 meter.',
        question: 'Vad är rummets area?',
        type: 'fill-in',
        answer: '40',
        explanation: 'A = 8 × 5 = 40 m².',
        rewardEmoji: '📐',
      },
      {
        id: 'rf-5',
        narrative: '🏆 Fabriken är klar! Median av produktion: [12, 14, 15, 18, 20].',
        question: 'Vad är medianen?',
        type: 'fill-in',
        answer: '15',
        explanation: 'Medianvärdet i mitten av: 12, 14, [15], 18, 20 = 15.',
        rewardEmoji: '🏅',
      },
    ],
  },

  // ======================== GYM WORLD ========================
  {
    id: 'universe-mystery',
    worldId: 'gym',
    title: 'Universums Mysterium',
    emoji: '🌌',
    description: 'Lös avancerade problem för att kartlägga universum!',
    storyColor: 'from-indigo-800 to-purple-900',
    rewardItem: 'universe-map',
    rewardEmoji: '🗺️',
    steps: [
      {
        id: 'um-1',
        narrative: '🌠 Du studerar en stjärnbana. Rörelsen följer f(t) = t² - 4t + 4.',
        question: 'Vad är f(2)?',
        type: 'fill-in',
        answer: '0',
        explanation: 'f(2) = 4 - 8 + 4 = 0.',
        rewardEmoji: '⭐',
      },
      {
        id: 'um-2',
        narrative: '🔭 En asteroid är på väg! Vinkeln in mot planeten är 60°. sin(60°) = ?',
        question: 'sin(60°) = √3/2. Avrundad till 2 decimaler ≈ ?',
        type: 'multiple-choice',
        options: ['0,75', '0,87', '0,50', '1,00'],
        correctIndex: 1,
        explanation: 'sin(60°) = √3/2 ≈ 0,866 ≈ 0,87.',
        rewardEmoji: '☄️',
      },
      {
        id: 'um-3',
        narrative: '📡 Teleskopet rör sig enligt f(x) = 3x² + 2. Derivatan visar hastigheten.',
        question: 'f\'(x) av 3x² + 2 = ?',
        type: 'fill-in',
        answer: '6x',
        explanation: 'f\'(x) = 6x (derivata av 3x² = 6x, konstanten 2 försvinner).',
        rewardEmoji: '📡',
      },
      {
        id: 'um-4',
        narrative: '🎯 Du siktar på planeten. Träffchansen utan kalibrering är 0,4.',
        question: 'P(missar) = 1 - 0,4 = ?',
        type: 'fill-in',
        answer: '0.6',
        acceptableAnswers: ['0.6', '0,6', '60%', '3/5'],
        explanation: 'Komplementhändelse: P(miss) = 1 - 0,4 = 0,6.',
        rewardEmoji: '🎯',
      },
      {
        id: 'um-5',
        narrative: '🌌 Universum kartlagt! En triangulär sektor har sidor 5, 12, 13 (rätvinklig).',
        question: 'sin(v) = motstående/hypotenusa = 5/13. Är vinkeln v ungefär 22,6°?',
        type: 'true-false',
        isTrue: true,
        explanation: 'arcsin(5/13) ≈ 22,6°. Rätt!',
        rewardEmoji: '🏆',
      },
    ],
  },
];

export const getQuestsForWorld = (worldId: WorldId): Quest[] =>
  QUESTS.filter(q => q.worldId === worldId);
