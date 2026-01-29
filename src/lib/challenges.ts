// Utmaningar - svårare problem för de som vill ha extra utmaning

export interface Challenge {
  id: string
  type: 'logik' | 'talmonster' | 'algebra' | 'geometri'
  typeTitle: string
  title: string
  difficulty: 'lagre' | 'mellan' | 'hogre'
  problemText: string
  hint?: string
  correctAnswer: string
  explanation?: string
  minGrade: number
  maxGrade: number
}

export const challenges: Challenge[] = [
  // ============ LOGISKA PROBLEM ============
  // Lägre (åk 1-3)
  {
    id: 'logik_1',
    type: 'logik',
    typeTitle: 'Logiska problem',
    title: 'Vem är äldst?',
    difficulty: 'lagre',
    problemText: `Anna är äldre än Bella.
Bella är äldre än Clara.

Vem är yngst?`,
    correctAnswer: 'clara',
    explanation: 'Clara är yngst eftersom både Anna och Bella är äldre än Clara.',
    minGrade: 1,
    maxGrade: 3,
  },
  {
    id: 'logik_2',
    type: 'logik',
    typeTitle: 'Logiska problem',
    title: 'Färgpusslet',
    difficulty: 'lagre',
    problemText: `Tre bollar är röd, blå och grön.
Den röda bollen är inte störst.
Den blåa bollen är minst.

Vilken färg har den största bollen?`,
    correctAnswer: 'grön',
    hint: 'Uteslut de som inte kan vara störst',
    minGrade: 2,
    maxGrade: 4,
  },

  // Mellan (åk 4-6)
  {
    id: 'logik_3',
    type: 'logik',
    typeTitle: 'Logiska problem',
    title: 'Sandhetstester',
    difficulty: 'mellan',
    problemText: `En person säger alltid sanningen, en ljuger alltid.

Person A säger: "Vi är båda lögnare."

Vem ljuger?`,
    correctAnswer: 'a',
    explanation: 'Om A talar sanning, säger A "vi är båda lögnare" men då skulle A ljuga. Motsägelse! Alltså ljuger A.',
    minGrade: 4,
    maxGrade: 6,
  },
  {
    id: 'logik_4',
    type: 'logik',
    typeTitle: 'Logiska problem',
    title: 'Kön till kiosken',
    difficulty: 'mellan',
    problemText: `Fem personer står i kö: Adam, Bella, Carl, Diana, Erik.

• Bella står framför Diana
• Carl står bakom Adam
• Erik står först i kön
• Adam står direkt framför Bella

I vilken ordning står de?
(Svara med första bokstaven i varje namn, t.ex. EABCD)`,
    correctAnswer: 'eabdc',
    minGrade: 4,
    maxGrade: 7,
  },

  // Högre (åk 7-9)
  {
    id: 'logik_5',
    type: 'logik',
    typeTitle: 'Logiska problem',
    title: 'Ljuset i rummen',
    difficulty: 'hogre',
    problemText: `Du står utanför ett rum med 3 ljusströmbrytare. Innanför finns 3 lampor.
Du får bara gå in i rummet EN gång.

Hur kan du avgöra vilken strömbrytare som hör till vilken lampa?`,
    correctAnswer: 'värme',
    explanation: `1. Sätt på strömbrytare 1 och vänta 5 minuter
2. Stäng av strömbrytare 1 och sätt på strömbrytare 2
3. Gå in: Den tända lampan = strömbrytare 2. Den släckta och varma = strömbrytare 1. Den släckta och kalla = strömbrytare 3.`,
    hint: 'Glödlampor blir varma när de är på',
    minGrade: 7,
    maxGrade: 9,
  },

  // ============ TALMÖNSTER ============
  // Lägre
  {
    id: 'tal_1',
    type: 'talmonster',
    typeTitle: 'Talmönster',
    title: 'Mystiska talföljden',
    difficulty: 'lagre',
    problemText: `Hitta nästa tal:
1, 4, 7, 10, ?`,
    correctAnswer: '13',
    explanation: 'Mönstret är +3 för varje steg',
    minGrade: 2,
    maxGrade: 4,
  },
  {
    id: 'tal_2',
    type: 'talmonster',
    typeTitle: 'Talmönster',
    title: 'Dubblande följden',
    difficulty: 'lagre',
    problemText: `Hitta nästa tal:
2, 4, 8, 16, ?`,
    correctAnswer: '32',
    minGrade: 2,
    maxGrade: 5,
  },

  // Mellan
  {
    id: 'tal_3',
    type: 'talmonster',
    typeTitle: 'Talmönster',
    title: 'Fibonacci-liknande',
    difficulty: 'mellan',
    problemText: `Hitta nästa tal:
1, 1, 2, 3, 5, 8, ?`,
    correctAnswer: '13',
    explanation: 'Varje tal är summan av de två föregående: 5 + 8 = 13',
    hint: 'Addera de två senaste talen',
    minGrade: 4,
    maxGrade: 7,
  },
  {
    id: 'tal_4',
    type: 'talmonster',
    typeTitle: 'Talmönster',
    title: 'Kvadrattal',
    difficulty: 'mellan',
    problemText: `Hitta nästa tal:
1, 4, 9, 16, 25, ?`,
    correctAnswer: '36',
    explanation: 'Talen är 1², 2², 3², 4², 5², 6² = 36',
    minGrade: 4,
    maxGrade: 7,
  },

  // Högre
  {
    id: 'tal_5',
    type: 'talmonster',
    typeTitle: 'Talmönster',
    title: 'Triangeltal',
    difficulty: 'hogre',
    problemText: `Triangeltal: 1, 3, 6, 10, 15, 21, ...

a) Vad är det 10:e triangeltalet?
b) Finns talet 100 i följden? Motivera!`,
    correctAnswer: '55',
    explanation: 'Det n:te triangeltalet = n(n+1)/2. För n=10: 10×11/2 = 55. 100 finns inte (9×10/2=45, 10×11/2=55, 13×14/2=91, 14×15/2=105)',
    minGrade: 6,
    maxGrade: 9,
  },

  // ============ ALGEBRA-PUSSEL ============
  // Lägre
  {
    id: 'alg_1',
    type: 'algebra',
    typeTitle: 'Algebra-pussel',
    title: 'Äpplen och päron',
    difficulty: 'lagre',
    problemText: `🍎 + 🍎 = 10
🍎 + 🍐 = 8

Vad är 🍐?`,
    correctAnswer: '3',
    explanation: '🍎 = 5 (eftersom 5+5=10), och 5 + 🍐 = 8, så 🍐 = 3',
    minGrade: 2,
    maxGrade: 4,
  },
  {
    id: 'alg_2',
    type: 'algebra',
    typeTitle: 'Algebra-pussel',
    title: 'Trekanter och cirklar',
    difficulty: 'lagre',
    problemText: `△ + △ + △ = 12
△ + ○ = 8

Vad är ○ + ○?`,
    correctAnswer: '8',
    explanation: '△ = 4, så ○ = 8 - 4 = 4, och ○ + ○ = 8',
    minGrade: 3,
    maxGrade: 5,
  },

  // Mellan
  {
    id: 'alg_3',
    type: 'algebra',
    typeTitle: 'Algebra-pussel',
    title: 'Viktsproblemet',
    difficulty: 'mellan',
    problemText: `3 äpplen väger lika mycket som 2 bananer.
1 banan väger 150 g.

Hur mycket väger ett äpple?`,
    correctAnswer: '100',
    explanation: '2 bananer = 300 g. 3 äpplen = 300 g. 1 äpple = 100 g.',
    minGrade: 4,
    maxGrade: 6,
  },
  {
    id: 'alg_4',
    type: 'algebra',
    typeTitle: 'Algebra-pussel',
    title: 'Åldrar',
    difficulty: 'mellan',
    problemText: `Sara är 3 år äldre än sin bror Tom.
Tillsammans är de 17 år gamla.

Hur gammal är Sara?`,
    correctAnswer: '10',
    explanation: 'Om Tom är x år, är Sara x+3. x + (x+3) = 17. 2x = 14, x = 7. Sara är 10 år.',
    minGrade: 5,
    maxGrade: 7,
  },

  // Högre
  {
    id: 'alg_5',
    type: 'algebra',
    typeTitle: 'Algebra-pussel',
    title: 'Hundar och katter',
    difficulty: 'hogre',
    problemText: `På ett djurhem finns hundar och katter.
Totalt finns 20 djur och 56 ben.

Hur många hundar finns det?
(Hundar och katter har 4 ben var)`,
    correctAnswer: 'omöjligt',
    explanation: 'Om alla djur har 4 ben borde det finnas 80 ben, inte 56. Problemet går inte att lösa - det är en fälla!',
    hint: 'Tänk på hur många ben djuren har totalt om alla har 4 ben',
    minGrade: 6,
    maxGrade: 9,
  },
  {
    id: 'alg_6',
    type: 'algebra',
    typeTitle: 'Algebra-pussel',
    title: 'Siffersumma',
    difficulty: 'hogre',
    problemText: `Hitta ett tvåsiffrigt tal där:
- Siffersumman är 11
- Om man byter plats på siffrorna blir talet 27 större

Vilket är talet?`,
    correctAnswer: '47',
    explanation: 'Låt talet vara 10a + b. a + b = 11. 10b + a = 10a + b + 27 → 9b - 9a = 27 → b - a = 3. Med a + b = 11 och b - a = 3: b = 7, a = 4. Talet är 47.',
    minGrade: 7,
    maxGrade: 9,
  },

  // ============ GEOMETRI ============
  // Lägre
  {
    id: 'geo_1',
    type: 'geometri',
    typeTitle: 'Geometri-utmaningar',
    title: 'Räkna rutor',
    difficulty: 'lagre',
    problemText: `I ett 2×2 rutnät, hur många kvadrater finns totalt?
(Räkna alla storlekar!)`,
    correctAnswer: '5',
    explanation: '4 små (1×1) + 1 stor (2×2) = 5 kvadrater',
    hint: 'Glöm inte den stora kvadraten som täcker hela rutnätet',
    minGrade: 2,
    maxGrade: 4,
  },
  {
    id: 'geo_2',
    type: 'geometri',
    typeTitle: 'Geometri-utmaningar',
    title: 'Dela rektangeln',
    difficulty: 'lagre',
    problemText: `En rektangel är 6 cm lång och 4 cm bred.
Om du delar den i två lika stora trianglar, vad är arean av en triangel?`,
    correctAnswer: '12',
    explanation: 'Rektangelns area = 6 × 4 = 24 cm². Halva = 12 cm².',
    minGrade: 3,
    maxGrade: 5,
  },

  // Mellan
  {
    id: 'geo_3',
    type: 'geometri',
    typeTitle: 'Geometri-utmaningar',
    title: 'Staket runt gräsmattan',
    difficulty: 'mellan',
    problemText: `En kvadratisk gräsmatta har arean 64 m².

Hur många meter staket behövs för att inhägna den?`,
    correctAnswer: '32',
    explanation: 'Sidan = √64 = 8 m. Omkrets = 4 × 8 = 32 m.',
    minGrade: 4,
    maxGrade: 7,
  },
  {
    id: 'geo_4',
    type: 'geometri',
    typeTitle: 'Geometri-utmaningar',
    title: 'Vikta pappret',
    difficulty: 'mellan',
    problemText: `Ett A4-papper är ungefär 21 cm × 30 cm.
Om du viker det på mitten (längs med den långa sidan) 3 gånger,
vad blir den nya arean ungefär?`,
    correctAnswer: '79',
    explanation: 'Original: 21 × 30 = 630 cm². Efter 3 vikningar: 630 / 2³ = 630 / 8 ≈ 79 cm².',
    hint: 'Varje vikning halverar arean',
    minGrade: 4,
    maxGrade: 7,
  },

  // Högre
  {
    id: 'geo_5',
    type: 'geometri',
    typeTitle: 'Geometri-utmaningar',
    title: 'Cirkel i kvadrat',
    difficulty: 'hogre',
    problemText: `En cirkel är inskriven i en kvadrat med sidan 10 cm.
(Cirkeln rör alla fyra sidor av kvadraten)

Hur stor del av kvadratens area täcks av cirkeln?
Svara i procent (avrunda till heltal).`,
    correctAnswer: '79',
    explanation: 'Cirkelns radie = 5 cm. Area cirkel = π × 5² ≈ 78,5 cm². Area kvadrat = 100 cm². 78,5/100 = 78,5% ≈ 79%',
    minGrade: 7,
    maxGrade: 9,
  },
]

export function getChallengesForGrade(grade: number): Challenge[] {
  // Bestäm stadium baserat på årskurs
  let difficulty: 'lagre' | 'mellan' | 'hogre'
  if (grade <= 3) {
    difficulty = 'lagre'
  } else if (grade <= 6) {
    difficulty = 'mellan'
  } else {
    difficulty = 'hogre'
  }

  return challenges.filter(
    (c) =>
      c.difficulty === difficulty &&
      grade >= c.minGrade &&
      grade <= c.maxGrade
  )
}

export function getChallengeById(id: string): Challenge | undefined {
  return challenges.find((c) => c.id === id)
}

export function getChallengesByType(type: string, grade: number): Challenge[] {
  let difficulty: 'lagre' | 'mellan' | 'hogre'
  if (grade <= 3) {
    difficulty = 'lagre'
  } else if (grade <= 6) {
    difficulty = 'mellan'
  } else {
    difficulty = 'hogre'
  }

  return challenges.filter(
    (c) =>
      c.type === type &&
      c.difficulty === difficulty &&
      grade >= c.minGrade &&
      grade <= c.maxGrade
  )
}
