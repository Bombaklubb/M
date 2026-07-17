import { Topic } from '../types';

// ============================================================
// EXTENDED GYMNASIUM TOPICS – Nivå 10 (Matematik 1–2)
// Bygger ut Rymd Akademin med fler kapitel och övningar.
// Innehåller även exempel på övningstyperna "order" och "match".
// ============================================================

export const GYM_EXTENDED_TOPICS: Topic[] = [

  // ─── 1. LOGARITMER ────────────────────────────────────────
  {
    id: 'logaritmer',
    title: 'Logaritmer',
    icon: '🔟',
    description: 'Tiologaritmer, naturliga logaritmer och logaritmlagar',
    grades: ['gym1', 'gym2', 'gym3'],
    minGrade: 10,
    color: 'from-indigo-500 to-violet-700',
    instruction: {
      title: 'Logaritmer – motsatsen till potenser',
      text: 'En logaritm svarar på frågan "vilken exponent behövs?". lg(1000) = 3 eftersom 10³ = 1000. Tiologaritmen lg har basen 10, naturliga logaritmen ln har basen e ≈ 2,718. Logaritmlagar: lg(a·b) = lg a + lg b, lg(aⁿ) = n·lg a, och 10^(lg x) = x.',
      illustration: 'functions',
      examples: [
        'lg(10) = 1, lg(100) = 2, lg(1000) = 3',
        'lg(1) = 0 (eftersom 10⁰ = 1)',
        'ln(e) = 1',
        'lg(2) + lg(5) = lg(10) = 1',
      ],
    },
    exercises: [
      { id: 'log-1', type: 'fill-in', question: 'lg(100) = ?', answer: '2', points: 15, explanation: '10² = 100, alltså lg(100) = 2.' },
      { id: 'log-2', type: 'fill-in', question: 'lg(1000) = ?', answer: '3', points: 15, explanation: '10³ = 1000, alltså lg(1000) = 3.' },
      { id: 'log-3', type: 'multiple-choice', question: 'lg(1) = ?', options: ['0', '1', '10', 'odefinierat'], correctIndex: 0, points: 15, explanation: '10⁰ = 1, alltså lg(1) = 0.' },
      { id: 'log-4', type: 'fill-in', question: 'ln(e) = ?', answer: '1', points: 15, explanation: 'ln har basen e, och ln(e) = 1 per definition.' },
      { id: 'log-5', type: 'true-false', question: 'lg(10) = 1', isTrue: true, points: 10, explanation: 'Rätt! 10¹ = 10, alltså lg(10) = 1.' },
      { id: 'log-6', type: 'multiple-choice', question: 'lg(10000) = ?', options: ['3', '4', '5', '100'], correctIndex: 1, points: 15, explanation: '10⁴ = 10000, alltså lg(10000) = 4.' },
      { id: 'log-7', type: 'fill-in', question: 'Lös 10^x = 1000, vad är x?', answer: '3', points: 20, explanation: '10³ = 1000, alltså x = 3 (= lg(1000)).' },
      { id: 'log-8', type: 'true-false', question: 'lg(a·b) = lg(a) + lg(b)', isTrue: true, points: 15, explanation: 'Rätt! Det är produktlagen för logaritmer.' },
      { id: 'log-9', type: 'multiple-choice', question: 'lg(2) + lg(5) = ?', options: ['lg(7)', '1', '10', '7'], correctIndex: 1, points: 20, explanation: 'lg(2) + lg(5) = lg(2·5) = lg(10) = 1.' },
      { id: 'log-10', type: 'match', question: 'Para ihop varje logaritm med sitt värde.', pairs: [
        { left: 'lg(1)', right: '0' },
        { left: 'lg(10)', right: '1' },
        { left: 'lg(100)', right: '2' },
        { left: 'lg(1000)', right: '3' },
      ], points: 20, explanation: 'lg(10ⁿ) = n: lg(1)=0, lg(10)=1, lg(100)=2, lg(1000)=3.' },
      { id: 'log-11', type: 'order', question: 'Ordna logaritmerna från minst till störst.', items: ['lg(1)', 'lg(10)', 'lg(100)', 'lg(1000)'], orderHint: 'från minst till störst', points: 20, explanation: 'Värdena är 0, 1, 2 och 3.' },
      { id: 'log-12', type: 'fill-in', question: 'Lös 2·10^x = 200, vad är x?', answer: '2', points: 20, explanation: '10^x = 100, alltså x = 2.' },
    ],
  },

  // ─── 2. POTENSER & POTENSLAGAR ────────────────────────────
  {
    id: 'potenslagar-gym',
    title: 'Potenser & potenslagar',
    icon: '⚡',
    description: 'Räkna säkert med potenser, negativa exponenter och rötter',
    grades: ['gym1', 'gym2', 'gym3'],
    minGrade: 10,
    color: 'from-amber-500 to-yellow-700',
    instruction: {
      title: 'Potenslagar – snabbare räkning',
      text: 'Potenslagarna gör stora uträkningar enkla: aᵐ · aⁿ = aᵐ⁺ⁿ, aᵐ / aⁿ = aᵐ⁻ⁿ, (aᵐ)ⁿ = aᵐ·ⁿ. Speciella fall: a⁰ = 1, a⁻ⁿ = 1/aⁿ och a^(1/2) = √a.',
      illustration: 'algebra',
      examples: [
        '2³ · 2² = 2⁵ = 32',
        '(3²)³ = 3⁶',
        '2⁻³ = 1/2³ = 1/8',
        '9^(1/2) = √9 = 3',
      ],
    },
    exercises: [
      { id: 'potg-1', type: 'fill-in', question: '2³ · 2² = ?', answer: '32', points: 15, explanation: '2³·2² = 2⁵ = 32.' },
      { id: 'potg-2', type: 'multiple-choice', question: '(3²)³ = 3^? Vilken exponent?', options: ['5', '6', '8', '9'], correctIndex: 1, points: 15, explanation: '(aᵐ)ⁿ = aᵐ·ⁿ, så 2·3 = 6.' },
      { id: 'potg-3', type: 'fill-in', question: '5⁰ = ?', answer: '1', points: 10, explanation: 'Allt (utom 0) upphöjt till 0 är 1.' },
      { id: 'potg-4', type: 'fill-in', question: '2⁻³ = ? (skriv som bråk)', answer: '1/8', acceptableAnswers: ['1/8', '0.125', '0,125'], points: 20, explanation: 'a⁻ⁿ = 1/aⁿ, så 2⁻³ = 1/8.' },
      { id: 'potg-5', type: 'true-false', question: 'aᵐ · aⁿ = aᵐ⁺ⁿ', isTrue: true, points: 10, explanation: 'Rätt! Vid multiplikation av potenser med samma bas adderas exponenterna.' },
      { id: 'potg-6', type: 'multiple-choice', question: 'x⁵ / x² = ?', options: ['x³', 'x⁷', 'x²·⁵', 'x'], correctIndex: 0, points: 15, explanation: 'aᵐ/aⁿ = aᵐ⁻ⁿ, så x⁵⁻² = x³.' },
      { id: 'potg-7', type: 'fill-in', question: '9^(1/2) = ?', answer: '3', points: 15, explanation: 'a^(1/2) = √a, så 9^(1/2) = √9 = 3.' },
      { id: 'potg-8', type: 'multiple-choice', question: '(2x²)³ = ?', options: ['2x⁶', '8x⁶', '8x⁵', '6x⁶'], correctIndex: 1, points: 20, explanation: '(2x²)³ = 2³·x²·³ = 8x⁶.' },
      { id: 'potg-9', type: 'true-false', question: 'a⁻ⁿ = 1/aⁿ', isTrue: true, points: 10, explanation: 'Rätt! En negativ exponent ger inversen.' },
      { id: 'potg-10', type: 'order', question: 'Ordna potenserna från minst till störst.', items: ['2⁻¹', '2⁰', '2²', '2³'], orderHint: 'från minst till störst', points: 20, explanation: 'Värdena är 0,5, 1, 4 och 8.' },
      { id: 'potg-11', type: 'match', question: 'Para ihop varje potens med sitt värde.', pairs: [
        { left: '2³', right: '8' },
        { left: '3²', right: '9' },
        { left: '4⁰', right: '1' },
        { left: '5²', right: '25' },
      ], points: 20, explanation: '2³=8, 3²=9, 4⁰=1, 5²=25.' },
      { id: 'potg-12', type: 'fill-in', question: '10⁴ = ?', answer: '10000', points: 15, explanation: '10⁴ = 10·10·10·10 = 10000.' },
    ],
  },

  // ─── 3. TALFÖLJDER & SUMMOR ───────────────────────────────
  {
    id: 'talfoljder',
    title: 'Talföljder & summor',
    icon: '🔢',
    description: 'Aritmetiska och geometriska talföljder',
    grades: ['gym1', 'gym2', 'gym3'],
    minGrade: 10,
    color: 'from-emerald-500 to-teal-700',
    instruction: {
      title: 'Talföljder – mönster i tal',
      text: 'En aritmetisk talföljd ökar med samma tal (differens d) varje gång: 2, 5, 8, 11... En geometrisk talföljd multipliceras med samma tal (kvot k): 3, 6, 12, 24... Formel: aritmetisk aₙ = a₁ + (n−1)·d, geometrisk aₙ = a₁·k^(n−1).',
      illustration: 'functions',
      examples: [
        'Aritmetisk: 2, 5, 8, 11 (d = 3)',
        'Geometrisk: 3, 6, 12, 24 (k = 2)',
        'aₙ = a₁ + (n−1)·d',
        '1 + 2 + 3 + ... + 10 = 55',
      ],
    },
    exercises: [
      { id: 'tf-1', type: 'fill-in', question: 'Aritmetisk följd: 2, 5, 8, 11, ... Vilket är nästa tal?', answer: '14', points: 15, explanation: 'Differensen är 3, så 11 + 3 = 14.' },
      { id: 'tf-2', type: 'multiple-choice', question: 'Vad är differensen i 3, 7, 11, 15?', options: ['3', '4', '5', '7'], correctIndex: 1, points: 15, explanation: '7 − 3 = 4. Differensen d = 4.' },
      { id: 'tf-3', type: 'fill-in', question: 'Geometrisk följd: 3, 6, 12, 24, ... Vilket är nästa tal?', answer: '48', points: 15, explanation: 'Kvoten är 2, så 24 · 2 = 48.' },
      { id: 'tf-4', type: 'multiple-choice', question: 'Vad är kvoten i 2, 6, 18, 54?', options: ['2', '3', '4', '6'], correctIndex: 1, points: 15, explanation: '6 / 2 = 3. Kvoten k = 3.' },
      { id: 'tf-5', type: 'true-false', question: 'I en aritmetisk talföljd är skillnaden mellan termerna konstant.', isTrue: true, points: 10, explanation: 'Rätt! Det är just det som kännetecknar en aritmetisk följd.' },
      { id: 'tf-6', type: 'fill-in', question: 'aₙ = a₁ + (n−1)·d, med a₁ = 4 och d = 3. Vad är a₅?', answer: '16', points: 20, explanation: 'a₅ = 4 + (5−1)·3 = 4 + 12 = 16.' },
      { id: 'tf-7', type: 'multiple-choice', question: 'Vad är summan 1 + 2 + 3 + ... + 10?', options: ['45', '50', '55', '100'], correctIndex: 2, points: 20, explanation: 'Summan = 10·11/2 = 55.' },
      { id: 'tf-8', type: 'order', question: 'Ordna talen i en aritmetisk följd som börjar på 0 med d = 5.', items: ['0', '5', '10', '15', '20'], orderHint: 'i rätt ordning', points: 20, explanation: 'Lägg till 5 varje gång: 0, 5, 10, 15, 20.' },
      { id: 'tf-9', type: 'fill-in', question: 'Geometrisk följd med a₁ = 2 och k = 3. Vad är a₄?', answer: '54', points: 20, explanation: 'a₄ = 2·3^(4−1) = 2·27 = 54.' },
      { id: 'tf-10', type: 'true-false', question: '2, 4, 8, 16 är en geometrisk talföljd.', isTrue: true, points: 10, explanation: 'Rätt! Varje tal är det förra gånger 2 (kvot k = 2).' },
      { id: 'tf-11', type: 'match', question: 'Para ihop talföljden med nästa term.', pairs: [
        { left: '2, 4, 6, ...', right: '8' },
        { left: '1, 3, 9, ...', right: '27' },
        { left: '5, 10, 15, ...', right: '20' },
        { left: '10, 20, 30, ...', right: '40' },
      ], points: 20, explanation: 'Identifiera mönstret (+2, ×3, +5, +10) och fortsätt.' },
      { id: 'tf-12', type: 'fill-in', question: 'Vad är summan 5 + 10 + 15 + 20 + 25?', answer: '75', points: 15, explanation: '5+10+15+20+25 = 75.' },
    ],
  },

  // ─── 4. RÄTA LINJENS EKVATION ─────────────────────────────
  {
    id: 'rata-linjen-gym',
    title: 'Räta linjens ekvation',
    icon: '📈',
    description: 'y = kx + m – lutning, skärningspunkt och linjära samband',
    grades: ['gym1', 'gym2', 'gym3'],
    minGrade: 10,
    color: 'from-sky-500 to-blue-700',
    instruction: {
      title: 'Räta linjen: y = kx + m',
      text: 'En rät linje beskrivs av y = kx + m. Här är k lutningen (hur brant linjen är) och m är y-skärningspunkten (där linjen korsar y-axeln). Lutningen k = (y₂ − y₁)/(x₂ − x₁). Parallella linjer har samma k.',
      illustration: 'functions',
      examples: [
        'y = 2x + 1: k = 2, m = 1',
        'k = (5 − 1)/(2 − 0) = 2',
        'y = 4: vågrät linje (k = 0)',
        'Parallella linjer → samma lutning',
      ],
    },
    exercises: [
      { id: 'rlg-1', type: 'multiple-choice', question: 'Vad är lutningen i y = 3x + 2?', options: ['2', '3', '5', 'x'], correctIndex: 1, points: 15, explanation: 'I y = kx + m är k lutningen, här k = 3.' },
      { id: 'rlg-2', type: 'fill-in', question: 'y = 2x + 1. Vad är y när x = 3?', answer: '7', points: 15, explanation: 'y = 2·3 + 1 = 7.' },
      { id: 'rlg-3', type: 'fill-in', question: 'Vad är m-värdet (y-skärningen) i y = −4x + 5?', answer: '5', points: 15, explanation: 'm = 5 är konstanten – där linjen skär y-axeln.' },
      { id: 'rlg-4', type: 'true-false', question: 'Linjen y = 2x + 3 går genom punkten (0, 3).', isTrue: true, points: 10, explanation: 'Rätt! När x = 0 är y = 3, alltså punkten (0, 3).' },
      { id: 'rlg-5', type: 'multiple-choice', question: 'Lutningen för en linje genom (0, 1) och (2, 5)?', options: ['1', '2', '3', '4'], correctIndex: 1, points: 20, explanation: 'k = (5 − 1)/(2 − 0) = 4/2 = 2.' },
      { id: 'rlg-6', type: 'fill-in', question: 'Linjen y = kx går genom (2, 10). Vad är k?', answer: '5', points: 20, explanation: '10 = k·2, alltså k = 5.' },
      { id: 'rlg-7', type: 'true-false', question: 'Två parallella linjer har samma lutning.', isTrue: true, points: 10, explanation: 'Rätt! Parallella linjer har alltid samma k-värde.' },
      { id: 'rlg-8', type: 'multiple-choice', question: 'Var skär y = 2x − 6 x-axeln?', options: ['x = 3', 'x = −6', 'x = 6', 'x = 0'], correctIndex: 0, points: 20, explanation: 'Sätt y = 0: 0 = 2x − 6 → x = 3.' },
      { id: 'rlg-9', type: 'order', question: 'Ordna y-värdena för y = 2x + 1 vid x = 0, 1, 2, 3.', items: ['1', '3', '5', '7'], orderHint: 'från minst till störst', points: 20, explanation: 'y = 1, 3, 5, 7 för x = 0, 1, 2, 3.' },
      { id: 'rlg-10', type: 'match', question: 'Para ihop linjen med dess lutning.', pairs: [
        { left: 'y = 2x', right: 'k = 2' },
        { left: 'y = −x + 1', right: 'k = −1' },
        { left: 'y = 5x − 3', right: 'k = 5' },
        { left: 'y = 3', right: 'k = 0' },
      ], points: 20, explanation: 'k är talet framför x. En vågrät linje (y = 3) har k = 0.' },
      { id: 'rlg-11', type: 'fill-in', question: 'Linjen y = −2x + 8. Vad är y när x = 4?', answer: '0', points: 15, explanation: 'y = −2·4 + 8 = −8 + 8 = 0.' },
      { id: 'rlg-12', type: 'true-false', question: 'y = 4 är en vågrät (horisontell) linje.', isTrue: true, points: 10, explanation: 'Rätt! y är alltid 4 oavsett x, vilket ger en vågrät linje.' },
    ],
  },

  // ─── 5. STATISTIK & SPRIDNING ─────────────────────────────
  {
    id: 'statistik-gym',
    title: 'Statistik & spridning',
    icon: '📊',
    description: 'Medelvärde, median, typvärde och standardavvikelse',
    grades: ['gym1', 'gym2', 'gym3'],
    minGrade: 10,
    color: 'from-rose-500 to-pink-700',
    instruction: {
      title: 'Statistik – lägesmått och spridning',
      text: 'Lägesmått beskriver "mitten": medelvärde (summan/antalet), median (mittersta värdet i en sorterad lista) och typvärde (det vanligaste). Spridningsmått beskriver hur utspridda värdena är: variationsbredd (största − minsta) och standardavvikelse (spridning kring medelvärdet).',
      illustration: 'statistics',
      examples: [
        'Medelvärde av 4, 6, 8 = 6',
        'Median av 3, 5, 9 = 5',
        'Typvärde i 2, 3, 3, 5 = 3',
        'Variationsbredd 4...20 = 16',
      ],
    },
    exercises: [
      { id: 'stg-1', type: 'fill-in', question: 'Vad är medelvärdet av 4, 6, 8?', answer: '6', points: 15, explanation: '(4 + 6 + 8)/3 = 18/3 = 6.' },
      { id: 'stg-2', type: 'multiple-choice', question: 'Vad är medianen av 3, 5, 9, 11, 15?', options: ['5', '9', '11', '8'], correctIndex: 1, points: 15, explanation: 'Mittersta värdet i den sorterade listan är 9.' },
      { id: 'stg-3', type: 'fill-in', question: 'Vad är typvärdet i 2, 3, 3, 5, 7?', answer: '3', points: 15, explanation: '3 förekommer flest gånger (två gånger).' },
      { id: 'stg-4', type: 'multiple-choice', question: 'Vad är variationsbredden i 4, 9, 15, 20?', options: ['11', '16', '20', '9'], correctIndex: 1, points: 15, explanation: 'Variationsbredd = största − minsta = 20 − 4 = 16.' },
      { id: 'stg-5', type: 'true-false', question: 'Standardavvikelsen mäter spridningen kring medelvärdet.', isTrue: true, points: 10, explanation: 'Rätt! Stor standardavvikelse = stor spridning.' },
      { id: 'stg-6', type: 'fill-in', question: 'Vad är medelvärdet av 10, 20, 30, 40?', answer: '25', points: 15, explanation: '(10+20+30+40)/4 = 100/4 = 25.' },
      { id: 'stg-7', type: 'order', question: 'Ordna talen för att kunna hitta medianen.', items: ['2', '5', '7', '9', '12'], orderHint: 'från minst till störst', points: 20, explanation: 'Sorterat: 2, 5, 7, 9, 12. Medianen är mittersta = 7.' },
      { id: 'stg-8', type: 'multiple-choice', question: 'Vad är medianen av 2, 4, 6, 8?', options: ['4', '5', '6', '3'], correctIndex: 1, points: 20, explanation: 'Jämnt antal → medel av de två mittersta: (4 + 6)/2 = 5.' },
      { id: 'stg-9', type: 'true-false', question: 'Medelvärdet påverkas mer av extremvärden än medianen.', isTrue: true, points: 15, explanation: 'Rätt! Ett enda mycket stort värde drar upp medelvärdet, men inte medianen.' },
      { id: 'stg-10', type: 'match', question: 'Para ihop varje statistiskt mått med sin definition.', pairs: [
        { left: 'Medelvärde', right: 'summan delat med antalet' },
        { left: 'Median', right: 'mittersta värdet' },
        { left: 'Typvärde', right: 'det vanligaste värdet' },
        { left: 'Variationsbredd', right: 'största − minsta' },
      ], points: 20, explanation: 'Lägesmått: medel, median, typvärde. Spridningsmått: variationsbredd.' },
      { id: 'stg-11', type: 'fill-in', question: 'Vad är medianen av 1, 2, 3, 4, 5, 6, 7?', answer: '4', points: 15, explanation: 'Mittersta värdet (det fjärde) är 4.' },
      { id: 'stg-12', type: 'multiple-choice', question: 'Om alla värden är exakt lika, vad är standardavvikelsen?', options: ['0', '1', 'medelvärdet', 'oändlig'], correctIndex: 0, points: 20, explanation: 'Ingen spridning alls → standardavvikelsen är 0.' },
    ],
  },

  // ─── 6. KOMBINATORIK ──────────────────────────────────────
  {
    id: 'kombinatorik',
    title: 'Kombinatorik',
    icon: '🎯',
    description: 'Multiplikationsprincipen, fakultet och antal kombinationer',
    grades: ['gym1', 'gym2', 'gym3'],
    minGrade: 10,
    color: 'from-fuchsia-500 to-purple-700',
    instruction: {
      title: 'Kombinatorik – konsten att räkna möjligheter',
      text: 'Med multiplikationsprincipen multiplicerar du antalet val i varje steg: 2 tröjor och 3 byxor ger 2·3 = 6 outfits. Fakultet n! = n·(n−1)·...·1 räknar hur många sätt n saker kan ordnas. Specialfall: 0! = 1.',
      illustration: 'probability',
      examples: [
        '3! = 3·2·1 = 6',
        '0! = 1',
        '2 tröjor · 3 byxor = 6 outfits',
        '3 personer i kö → 3! = 6 sätt',
      ],
    },
    exercises: [
      { id: 'komb-1', type: 'fill-in', question: '3! = ?', answer: '6', points: 15, explanation: '3! = 3·2·1 = 6.' },
      { id: 'komb-2', type: 'fill-in', question: '4! = ?', answer: '24', points: 15, explanation: '4! = 4·3·2·1 = 24.' },
      { id: 'komb-3', type: 'multiple-choice', question: 'På hur många sätt kan 3 personer ställa sig i kö?', options: ['3', '6', '9', '27'], correctIndex: 1, points: 15, explanation: '3! = 6 olika ordningar.' },
      { id: 'komb-4', type: 'true-false', question: '0! = 1', isTrue: true, points: 10, explanation: 'Rätt! Per definition är 0! = 1.' },
      { id: 'komb-5', type: 'multiple-choice', question: 'Hur många tvåbokstavskoder kan bildas av A, B, C utan upprepning (ordning spelar roll)?', options: ['3', '6', '9', '2'], correctIndex: 1, points: 20, explanation: '3 val för första, 2 för andra: 3·2 = 6.' },
      { id: 'komb-6', type: 'fill-in', question: '5! = ?', answer: '120', points: 20, explanation: '5! = 5·4·3·2·1 = 120.' },
      { id: 'komb-7', type: 'multiple-choice', question: 'Du har 2 tröjor och 3 byxor. Hur många outfits?', options: ['5', '6', '8', '9'], correctIndex: 1, points: 15, explanation: 'Multiplikationsprincipen: 2·3 = 6.' },
      { id: 'komb-8', type: 'order', question: 'Ordna fakulteterna från minst till störst.', items: ['1!', '2!', '3!', '4!'], orderHint: 'från minst till störst', points: 20, explanation: 'Värdena är 1, 2, 6 och 24.' },
      { id: 'komb-9', type: 'match', question: 'Para ihop varje fakultet med sitt värde.', pairs: [
        { left: '2!', right: '2' },
        { left: '3!', right: '6' },
        { left: '4!', right: '24' },
        { left: '5!', right: '120' },
      ], points: 20, explanation: '2!=2, 3!=6, 4!=24, 5!=120.' },
      { id: 'komb-10', type: 'true-false', question: 'Vid permutationer spelar ordningen roll.', isTrue: true, points: 10, explanation: 'Rätt! En permutation är ett arrangemang där ordningen är viktig.' },
      { id: 'komb-11', type: 'fill-in', question: 'På hur många sätt kan ordförande och sekreterare väljas bland 4 personer?', answer: '12', points: 20, explanation: '4 val för ordförande, 3 kvar för sekreterare: 4·3 = 12.' },
      { id: 'komb-12', type: 'multiple-choice', question: 'Hur många tresiffriga koder finns (siffror 0–9, upprepning tillåten)?', options: ['30', '100', '300', '1000'], correctIndex: 3, points: 20, explanation: '10·10·10 = 1000 möjliga koder.' },
    ],
  },

  // ─── 7. EXPONENTIALFUNKTIONER ─────────────────────────────
  {
    id: 'exponentialfunktioner',
    title: 'Exponentialfunktioner',
    icon: '📈',
    description: 'Tillväxt, avtagande och förändringsfaktor',
    grades: ['gym1', 'gym2', 'gym3'],
    minGrade: 10,
    color: 'from-lime-500 to-green-700',
    instruction: {
      title: 'Exponentialfunktioner – y = C·aˣ',
      text: 'En exponentialfunktion skrivs y = C·aˣ, där a är förändringsfaktorn. Om a > 1 växer funktionen (tillväxt), om 0 < a < 1 avtar den. Förändringsfaktorn vid +p% är (1 + p/100), vid −p% är (1 − p/100). Den naturliga basen är e ≈ 2,718.',
      illustration: 'functions',
      examples: [
        'y = 2ˣ: y = 8 när x = 3',
        '+20% → förändringsfaktor 1,20',
        '−10% → förändringsfaktor 0,90',
        'a > 1 växer, 0 < a < 1 avtar',
      ],
    },
    exercises: [
      { id: 'exp-1', type: 'multiple-choice', question: 'y = 2ˣ. Vad är y när x = 3?', options: ['6', '8', '9', '16'], correctIndex: 1, points: 15, explanation: '2³ = 8.' },
      { id: 'exp-2', type: 'fill-in', question: 'y = 100·1,05ˣ beskriver en tillväxt med hur många procent?', answer: '5', points: 15, explanation: 'Förändringsfaktorn 1,05 = +5%.' },
      { id: 'exp-3', type: 'true-false', question: 'Om basen a > 1 växer exponentialfunktionen.', isTrue: true, points: 10, explanation: 'Rätt! a > 1 ger tillväxt.' },
      { id: 'exp-4', type: 'multiple-choice', question: 'y = 3ˣ. Vad är y när x = 0?', options: ['0', '1', '3', '9'], correctIndex: 1, points: 15, explanation: 'a⁰ = 1, så y = 1.' },
      { id: 'exp-5', type: 'fill-in', question: 'Vilken förändringsfaktor svarar mot 20% ökning?', answer: '1.2', acceptableAnswers: ['1.2', '1,2', '1.20', '1,20'], points: 15, explanation: '1 + 20/100 = 1,2.' },
      { id: 'exp-6', type: 'true-false', question: 'y = 0,5ˣ är en avtagande funktion.', isTrue: true, points: 10, explanation: 'Rätt! Basen 0,5 < 1 ger avtagande.' },
      { id: 'exp-7', type: 'multiple-choice', question: '50000·0,90ˣ minskar med hur många procent per steg?', options: ['9', '10', '50', '90'], correctIndex: 1, points: 20, explanation: 'Förändringsfaktorn 0,90 = −10%.' },
      { id: 'exp-8', type: 'fill-in', question: 'y = 2ˣ. Vad är y när x = 5?', answer: '32', points: 15, explanation: '2⁵ = 32.' },
      { id: 'exp-9', type: 'order', question: 'Ordna y-värdena för y = 2ˣ vid x = 0, 1, 2, 3.', items: ['1', '2', '4', '8'], orderHint: 'från minst till störst', points: 20, explanation: 'y = 1, 2, 4, 8 för x = 0, 1, 2, 3.' },
      { id: 'exp-10', type: 'match', question: 'Para ihop förändringsfaktorn med dess innebörd.', pairs: [
        { left: '1,10', right: '+10%' },
        { left: '0,90', right: '−10%' },
        { left: '1,50', right: '+50%' },
        { left: '0,50', right: '−50%' },
      ], points: 20, explanation: 'Faktor > 1 = ökning, faktor < 1 = minskning.' },
      { id: 'exp-11', type: 'fill-in', question: 'Vilken förändringsfaktor svarar mot 25% minskning?', answer: '0.75', acceptableAnswers: ['0.75', '0,75'], points: 20, explanation: '1 − 25/100 = 0,75.' },
      { id: 'exp-12', type: 'true-false', question: 'e ≈ 2,718 är basen i den naturliga exponentialfunktionen.', isTrue: true, points: 10, explanation: 'Rätt! eˣ är den naturliga exponentialfunktionen.' },
    ],
  },

];
