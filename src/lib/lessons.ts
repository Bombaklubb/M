// Lektioner för Repetition-sektionen

export interface LessonStep {
  type: 'text' | 'example' | 'exercise'
  content: string
  correctAnswer?: string
  hint?: string
}

export interface Lesson {
  id: string
  title: string
  description: string
  category: string
  minGrade: number
  maxGrade: number
  icon: string
  steps: LessonStep[]
}

export const lessons: Lesson[] = [
  // ============ ADDITION MED UPPSTÄLLNING ============
  {
    id: 'addition-uppstallning-lagre',
    title: 'Addition med uppställning',
    description: 'Lär dig lägga ihop tal med uppställning',
    category: 'uppstallning',
    minGrade: 2,
    maxGrade: 4,
    icon: '➕',
    steps: [
      {
        type: 'text',
        content: `När du adderar större tal är det lättare att använda uppställning.

Skriv talen under varandra så att siffrorna står i rätt kolumn:
- Ental under ental
- Tiotal under tiotal
- Hundratal under hundratal`,
      },
      {
        type: 'example',
        content: `Exempel: 47 + 35

    47
  + 35
  ----
    82

1. Börja med entalen: 7 + 5 = 12
   Skriv 2, minns 1 tiotal (växling)
2. Tiotal: 4 + 3 + 1 = 8`,
      },
      {
        type: 'exercise',
        content: '23 + 45 = ?',
        correctAnswer: '68',
        hint: 'Börja med entalen: 3 + 5',
      },
      {
        type: 'exercise',
        content: '56 + 38 = ?',
        correctAnswer: '94',
        hint: 'Entalen blir mer än 10, så du behöver växla',
      },
      {
        type: 'exercise',
        content: '147 + 286 = ?',
        correctAnswer: '433',
        hint: 'Börja från höger: ental, sedan tiotal, sedan hundratal',
      },
    ],
  },

  // ============ SUBTRAKTION MED UPPSTÄLLNING ============
  {
    id: 'subtraktion-uppstallning-lagre',
    title: 'Subtraktion med uppställning',
    description: 'Lär dig subtrahera med lån/växling',
    category: 'uppstallning',
    minGrade: 2,
    maxGrade: 4,
    icon: '➖',
    steps: [
      {
        type: 'text',
        content: `Vid subtraktion med uppställning skriver du det större talet överst.

Om siffran ovanför är mindre än den under, behöver du låna (växla) från nästa kolumn.`,
      },
      {
        type: 'example',
        content: `Exempel: 52 - 27

    52
  - 27
  ----
    25

1. Ental: 2 - 7 går inte! Låna ett tiotal.
   12 - 7 = 5
2. Tiotal: 4 - 2 = 2 (vi lånade ett, så 5-1=4)`,
      },
      {
        type: 'exercise',
        content: '45 - 23 = ?',
        correctAnswer: '22',
      },
      {
        type: 'exercise',
        content: '63 - 28 = ?',
        correctAnswer: '35',
        hint: 'Du behöver låna för att räkna 3 - 8',
      },
      {
        type: 'exercise',
        content: '234 - 157 = ?',
        correctAnswer: '77',
      },
    ],
  },

  // ============ MULTIPLIKATION MED UPPSTÄLLNING ============
  {
    id: 'multiplikation-uppstallning',
    title: 'Multiplikation med uppställning',
    description: 'Multiplicera större tal steg för steg',
    category: 'uppstallning',
    minGrade: 4,
    maxGrade: 6,
    icon: '✖️',
    steps: [
      {
        type: 'text',
        content: `Vid multiplikation med uppställning multiplicerar du varje siffra för sig.

Börja med entalet i det undre talet och arbeta dig åt vänster.`,
      },
      {
        type: 'example',
        content: `Exempel: 34 × 5

    34
  ×  5
  ----
   170

1. 5 × 4 = 20 (skriv 0, minns 2)
2. 5 × 3 = 15, plus 2 = 17`,
      },
      {
        type: 'exercise',
        content: '23 × 4 = ?',
        correctAnswer: '92',
      },
      {
        type: 'exercise',
        content: '45 × 6 = ?',
        correctAnswer: '270',
      },
      {
        type: 'exercise',
        content: '123 × 7 = ?',
        correctAnswer: '861',
      },
    ],
  },

  // ============ DIVISION ============
  {
    id: 'division-metod',
    title: 'Division',
    description: 'Förstå division och hur du räknar',
    category: 'uppstallning',
    minGrade: 3,
    maxGrade: 5,
    icon: '➗',
    steps: [
      {
        type: 'text',
        content: `Division handlar om att dela upp lika.

48 ÷ 6 betyder: "Hur många gånger får 6 plats i 48?"

Tänk: "Vilket tal gånger 6 blir 48?"
Svar: 8, eftersom 6 × 8 = 48`,
      },
      {
        type: 'example',
        content: `Exempel: 72 ÷ 8

Tänk: 8 × ? = 72
8 × 9 = 72
Alltså: 72 ÷ 8 = 9`,
      },
      {
        type: 'exercise',
        content: '36 ÷ 6 = ?',
        correctAnswer: '6',
        hint: 'Vilket tal gånger 6 blir 36?',
      },
      {
        type: 'exercise',
        content: '56 ÷ 7 = ?',
        correctAnswer: '8',
      },
      {
        type: 'exercise',
        content: '81 ÷ 9 = ?',
        correctAnswer: '9',
      },
    ],
  },

  // ============ LÄNGDENHETER ============
  {
    id: 'langd-enheter',
    title: 'Längdenheter',
    description: 'mm, cm, dm, m, km',
    category: 'enheter',
    minGrade: 2,
    maxGrade: 6,
    icon: '📏',
    steps: [
      {
        type: 'text',
        content: `Längdenheter och hur de hänger ihop:

1 km = 1000 m
1 m = 10 dm
1 dm = 10 cm
1 cm = 10 mm

Tumregel: Varje steg till mindre enhet = × 10
Varje steg till större enhet = ÷ 10`,
      },
      {
        type: 'example',
        content: `Exempel: Omvandla 3,5 m till cm

3,5 m → dm → cm
3,5 × 10 = 35 dm
35 × 10 = 350 cm

Svar: 3,5 m = 350 cm`,
      },
      {
        type: 'exercise',
        content: 'Hur många cm är 2 m?',
        correctAnswer: '200',
        hint: '1 m = 100 cm',
      },
      {
        type: 'exercise',
        content: 'Hur många mm är 5 cm?',
        correctAnswer: '50',
      },
      {
        type: 'exercise',
        content: 'Hur många m är 3 km?',
        correctAnswer: '3000',
      },
    ],
  },

  // ============ MASSENHETER ============
  {
    id: 'massa-enheter',
    title: 'Massenheter',
    description: 'g, hg, kg',
    category: 'enheter',
    minGrade: 2,
    maxGrade: 6,
    icon: '⚖️',
    steps: [
      {
        type: 'text',
        content: `Massenheter (vikt):

1 kg = 10 hg
1 hg = 100 g
1 kg = 1000 g

Exempel på vad som väger ungefär:
- 1 g ≈ ett gem
- 1 hg ≈ en apelsin
- 1 kg ≈ ett mjölkpaket`,
      },
      {
        type: 'example',
        content: `Exempel: Omvandla 2,5 kg till gram

2,5 kg × 1000 = 2500 g

Svar: 2,5 kg = 2500 g`,
      },
      {
        type: 'exercise',
        content: 'Hur många gram är 3 hg?',
        correctAnswer: '300',
      },
      {
        type: 'exercise',
        content: 'Hur många hg är 2 kg?',
        correctAnswer: '20',
      },
      {
        type: 'exercise',
        content: 'Hur många gram är 1,5 kg?',
        correctAnswer: '1500',
      },
    ],
  },

  // ============ VOLYMENHETER ============
  {
    id: 'volym-enheter',
    title: 'Volymenheter',
    description: 'ml, cl, dl, l',
    category: 'enheter',
    minGrade: 2,
    maxGrade: 6,
    icon: '🥛',
    steps: [
      {
        type: 'text',
        content: `Volymenheter:

1 l = 10 dl
1 dl = 10 cl
1 cl = 10 ml
1 l = 1000 ml

Tänk: "Hur stor är en literflaska saft?"`,
      },
      {
        type: 'example',
        content: `Exempel: Omvandla 0,5 l till ml

0,5 l = 0,5 × 1000 ml = 500 ml

Svar: En halvliters flaska innehåller 500 ml`,
      },
      {
        type: 'exercise',
        content: 'Hur många dl är 2 liter?',
        correctAnswer: '20',
      },
      {
        type: 'exercise',
        content: 'Hur många ml är 3 dl?',
        correctAnswer: '300',
      },
      {
        type: 'exercise',
        content: 'Hur många cl är 1 liter?',
        correctAnswer: '100',
      },
    ],
  },

  // ============ ALGEBRA: LIKHETSTECKNET ============
  {
    id: 'algebra-likhet',
    title: 'Likhetstecknets betydelse',
    description: 'Förstå vad = betyder',
    category: 'algebra',
    minGrade: 1,
    maxGrade: 4,
    icon: '⚖️',
    steps: [
      {
        type: 'text',
        content: `Likhetstecknet (=) betyder "lika med" eller "samma som".

Det som står på vänster sida är lika mycket som det på höger sida.

Tänk dig en balansvåg:
Om båda sidorna är lika tunga, är vågen i balans!`,
      },
      {
        type: 'example',
        content: `Exempel: 5 + 3 = 8

Vänster sida: 5 + 3 = 8
Höger sida: 8

Båda sidor är lika med 8 ✓`,
      },
      {
        type: 'exercise',
        content: 'Vad ska stå i rutan? 7 = 4 + □',
        correctAnswer: '3',
        hint: 'Vad plus 4 blir 7?',
      },
      {
        type: 'exercise',
        content: 'Är detta sant? 6 + 2 = 4 + 4 (svara ja eller nej)',
        correctAnswer: 'ja',
        hint: 'Räkna ut båda sidor',
      },
    ],
  },

  // ============ ALGEBRA: SAKNAT TAL ============
  {
    id: 'algebra-saknat-tal',
    title: 'Hitta det saknade talet',
    description: 'Lös enkla ekvationer',
    category: 'algebra',
    minGrade: 2,
    maxGrade: 5,
    icon: '❓',
    steps: [
      {
        type: 'text',
        content: `Ibland saknas ett tal i ett uttryck:

□ + 5 = 12

Vi söker talet som gör att uttrycket stämmer.
Tänk: "Vad plus 5 blir 12?"
Svar: 7, eftersom 7 + 5 = 12`,
      },
      {
        type: 'example',
        content: `Exempel: □ × 4 = 20

Tänk: "Vad gånger 4 blir 20?"
Eller räkna baklänges: 20 ÷ 4 = 5

Svar: □ = 5`,
      },
      {
        type: 'exercise',
        content: '□ + 8 = 15\nVad är □?',
        correctAnswer: '7',
      },
      {
        type: 'exercise',
        content: '24 - □ = 16\nVad är □?',
        correctAnswer: '8',
      },
      {
        type: 'exercise',
        content: '□ × 6 = 42\nVad är □?',
        correctAnswer: '7',
      },
    ],
  },

  // ============ ALGEBRA: EKVATIONER (HÖGRE) ============
  {
    id: 'algebra-ekvationer',
    title: 'Lösa ekvationer',
    description: 'Med x som okänt tal',
    category: 'algebra',
    minGrade: 6,
    maxGrade: 9,
    icon: '🔢',
    steps: [
      {
        type: 'text',
        content: `En ekvation är en likhet med en okänd, ofta kallad x.

För att lösa ekvationen vill vi få x ensamt på ena sidan.

Viktigt: Gör samma sak på båda sidor!`,
      },
      {
        type: 'example',
        content: `Exempel: 3x + 5 = 20

Steg 1: Ta bort +5 (subtrahera 5 på båda sidor)
3x + 5 - 5 = 20 - 5
3x = 15

Steg 2: Dela med 3 på båda sidor
3x ÷ 3 = 15 ÷ 3
x = 5`,
      },
      {
        type: 'exercise',
        content: 'Lös: 2x = 14',
        correctAnswer: '7',
        hint: 'Dela båda sidor med 2',
      },
      {
        type: 'exercise',
        content: 'Lös: x + 9 = 17',
        correctAnswer: '8',
      },
      {
        type: 'exercise',
        content: 'Lös: 4x - 3 = 21',
        correctAnswer: '6',
        hint: 'Addera först 3 på båda sidor, sedan dela med 4',
      },
    ],
  },
]

export function getLessonsForGrade(grade: number): Lesson[] {
  return lessons.filter(
    (lesson) => grade >= lesson.minGrade && grade <= lesson.maxGrade
  )
}

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id)
}

export function getLessonsByCategory(category: string, grade: number): Lesson[] {
  return lessons.filter(
    (lesson) =>
      lesson.category === category &&
      grade >= lesson.minGrade &&
      grade <= lesson.maxGrade
  )
}
