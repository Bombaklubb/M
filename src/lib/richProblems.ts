// Rika problem för E/C/A nivåer

export interface RichProblem {
  id: string
  theme: string
  themeTitle: string
  level: 'E' | 'C' | 'A'
  title: string
  problemText: string
  minGrade: number
  maxGrade: number
  tips?: string
}

export interface RichProblemTheme {
  id: string
  title: string
  description: string
  icon: string
  minGrade: number
  maxGrade: number
}

export const themes: RichProblemTheme[] = [
  {
    id: 'pengar_och_handel',
    title: 'Pengar och handel',
    description: 'Problem om köp, försäljning och växel',
    icon: '💰',
    minGrade: 1,
    maxGrade: 6,
  },
  {
    id: 'tid_och_hastighet',
    title: 'Tid och hastighet',
    description: 'Resor, tidtabeller och hastighet',
    icon: '⏱️',
    minGrade: 3,
    maxGrade: 9,
  },
  {
    id: 'geometri_och_area',
    title: 'Geometri och area',
    description: 'Former, area och omkrets',
    icon: '📐',
    minGrade: 3,
    maxGrade: 9,
  },
  {
    id: 'procent',
    title: 'Procent',
    description: 'Rabatter, ränta och förändringar',
    icon: '%',
    minGrade: 5,
    maxGrade: 9,
  },
  {
    id: 'linjara_samband',
    title: 'Linjära samband',
    description: 'Formler, grafer och proportionalitet',
    icon: '📈',
    minGrade: 6,
    maxGrade: 9,
  },
  {
    id: 'sannolikhet',
    title: 'Sannolikhet',
    description: 'Chans och statistik',
    icon: '🎲',
    minGrade: 4,
    maxGrade: 9,
  },
  {
    id: 'monster_och_talföljder',
    title: 'Mönster och talföljder',
    description: 'Hitta mönster och regler',
    icon: '🔢',
    minGrade: 1,
    maxGrade: 9,
  },
  {
    id: 'kombinatorik',
    title: 'Kombinatorik',
    description: 'Räkna antal möjligheter',
    icon: '🧮',
    minGrade: 3,
    maxGrade: 9,
  },
]

export const richProblems: RichProblem[] = [
  // ============ PENGAR OCH HANDEL ============
  // Lägre årskurser (1-4)
  {
    id: 'pengar_e_1',
    theme: 'pengar_och_handel',
    themeTitle: 'Pengar och handel',
    level: 'E',
    title: 'Köpa glass',
    problemText: `Lisa har 30 kr. Hon köper en glass för 18 kr.

Hur mycket pengar har Lisa kvar?

Visa hur du tänker.`,
    minGrade: 1,
    maxGrade: 4,
  },
  {
    id: 'pengar_c_1',
    theme: 'pengar_och_handel',
    themeTitle: 'Pengar och handel',
    level: 'C',
    title: 'Godisaffären',
    problemText: `I godisaffären kostar:
- Klubba: 5 kr
- Chokladbit: 8 kr
- Lakritsstång: 4 kr

Emil har 25 kr och vill köpa minst tre saker.

Vilka olika kombinationer kan han köpa?
Hitta minst 3 olika sätt och visa att pengarna räcker.`,
    minGrade: 2,
    maxGrade: 4,
    tips: 'Börja med det billigaste alternativet',
  },
  {
    id: 'pengar_a_1',
    theme: 'pengar_och_handel',
    themeTitle: 'Pengar och handel',
    level: 'A',
    title: 'Fruktståndets matematik',
    problemText: `På fruktmarknaden kostar äpplen 4 kr/st och päron 6 kr/st.

Kalle köpte frukt för exakt 50 kr.

a) Hur många äpplen och päron kan han ha köpt?
   Hitta alla möjliga kombinationer.

b) Om han köpte fler äpplen än päron, vilken kombination valde han då?

Förklara hur du resonerar.`,
    minGrade: 3,
    maxGrade: 5,
  },

  // Högre årskurser (5-9)
  {
    id: 'pengar_e_2',
    theme: 'pengar_och_handel',
    themeTitle: 'Pengar och handel',
    level: 'E',
    title: 'Rabatt på tröja',
    problemText: `En tröja kostar 400 kr. Den säljs med 25% rabatt.

Vad kostar tröjan med rabatten?

Visa din uträkning.`,
    minGrade: 5,
    maxGrade: 9,
  },
  {
    id: 'pengar_c_2',
    theme: 'pengar_och_handel',
    themeTitle: 'Pengar och handel',
    level: 'C',
    title: 'Jämför rabatter',
    problemText: `Två affärer säljer samma dator som ursprungligen kostar 8000 kr:

Affär A: 30% rabatt
Affär B: Först 20% rabatt, sedan ytterligare 15% på det nya priset

Vilken affär har det lägsta priset?
Hur stor är skillnaden i kronor?`,
    minGrade: 6,
    maxGrade: 9,
  },
  {
    id: 'pengar_a_2',
    theme: 'pengar_och_handel',
    themeTitle: 'Pengar och handel',
    level: 'A',
    title: 'Sparande med ränta',
    problemText: `Maja sätter in 5000 kr på ett sparkonto med 3% årlig ränta.

a) Hur mycket har hon på kontot efter 1 år?
b) Hur mycket har hon efter 3 år om räntan läggs till kapitalet varje år (ränta-på-ränta)?
c) Skriv en formel för hur mycket hon har efter n år.

Visa dina beräkningar och resonemang.`,
    minGrade: 7,
    maxGrade: 9,
  },

  // ============ LINJÄRA SAMBAND ============
  {
    id: 'linjar_e_1',
    theme: 'linjara_samband',
    themeTitle: 'Linjära samband',
    level: 'E',
    title: 'Telefonabonnemang',
    problemText: `Ett telefonabonnemang kostar 99 kr i månaden plus 1 kr per minut samtal.

a) Vad blir kostnaden om man ringer 45 minuter en månad?
b) Vad blir kostnaden om man ringer 2 timmar?

Visa dina uträkningar.`,
    minGrade: 6,
    maxGrade: 9,
  },
  {
    id: 'linjar_c_1',
    theme: 'linjara_samband',
    themeTitle: 'Linjära samband',
    level: 'C',
    title: 'Jämför abonnemang',
    problemText: `Två telefonabonnemang:
- Abonnemang A: 149 kr/månad, 0,50 kr/minut
- Abonnemang B: 49 kr/månad, 2 kr/minut

a) Skriv en formel för månadskostnaden för varje abonnemang.
b) Vid hur många minuters samtal kostar de lika mycket?
c) Vilket abonnemang passar bäst för någon som ringer 1 timme per månad?`,
    minGrade: 7,
    maxGrade: 9,
    tips: 'Sätt formlerna lika med varandra för att hitta brytpunkten',
  },
  {
    id: 'linjar_a_1',
    theme: 'linjara_samband',
    themeTitle: 'Linjära samband',
    level: 'A',
    title: 'Taxiresan',
    problemText: `En taxiresa kostar enligt formeln: K = 45 + 12d
där K är kostnaden i kronor och d är distansen i kilometer.

a) Förklara vad 45 och 12 betyder i formeln.
b) Rita en graf som visar kostnaden för resor mellan 0-20 km.
c) Om taxin höjer startavgiften med 15 kr men sänker kilometerpriset till 10 kr,
   för vilka resor blir det billigare med det nya priset?

Motivera dina svar.`,
    minGrade: 7,
    maxGrade: 9,
  },

  // ============ GEOMETRI OCH AREA ============
  {
    id: 'geometri_e_1',
    theme: 'geometri_och_area',
    themeTitle: 'Geometri och area',
    level: 'E',
    title: 'Rektangelns area',
    problemText: `En rektangel har längden 8 cm och bredden 5 cm.

a) Beräkna rektangelns area.
b) Beräkna rektangelns omkrets.

Visa dina uträkningar.`,
    minGrade: 3,
    maxGrade: 6,
  },
  {
    id: 'geometri_c_1',
    theme: 'geometri_och_area',
    themeTitle: 'Geometri och area',
    level: 'C',
    title: 'Trädgårdsland',
    problemText: `Ett rektangulärt trädgårdsland har arean 48 m².

a) Hitta tre olika kombinationer av längd och bredd som ger denna area.
b) Vilken kombination ger den minsta omkretsen?
c) Om man vill sätta staket runt trädgårdslandet, vilken form är mest ekonomisk?`,
    minGrade: 4,
    maxGrade: 7,
  },
  {
    id: 'geometri_a_1',
    theme: 'geometri_och_area',
    themeTitle: 'Geometri och area',
    level: 'A',
    title: 'Sammansatt figur',
    problemText: `En figur består av en rektangel med en halvcirkel på ena kortsidan.
Rektangeln är 10 m lång och 6 m bred. Halvcirkeln har diametern 6 m.

a) Beräkna figurens totala area.
b) Beräkna figurens totala omkrets.
c) Om man ska måla figuren och 1 liter färg räcker till 5 m²,
   hur många liter färg behövs?

Använd π ≈ 3,14 och visa alla beräkningar.`,
    minGrade: 6,
    maxGrade: 9,
  },

  // ============ MÖNSTER OCH TALFÖLJDER ============
  {
    id: 'monster_e_1',
    theme: 'monster_och_talföljder',
    themeTitle: 'Mönster och talföljder',
    level: 'E',
    title: 'Fortsätt mönstret',
    problemText: `Titta på talföljden:
2, 5, 8, 11, 14, ...

a) Vad är nästa tal i följden?
b) Vad är det 10:e talet i följden?

Förklara hur du tänkte.`,
    minGrade: 2,
    maxGrade: 5,
  },
  {
    id: 'monster_c_1',
    theme: 'monster_och_talföljder',
    themeTitle: 'Mönster och talföljder',
    level: 'C',
    title: 'Bildmönster',
    problemText: `Figur 1: ●
Figur 2: ●●●
Figur 3: ●●●●●
Figur 4: ●●●●●●●

a) Hur många prickar har figur 5?
b) Hur många prickar har figur 10?
c) Beskriv regeln för hur många prickar figur n har.`,
    minGrade: 4,
    maxGrade: 7,
    tips: 'Titta på hur många prickar som läggs till för varje figur',
  },
  {
    id: 'monster_a_1',
    theme: 'monster_och_talföljder',
    themeTitle: 'Mönster och talföljder',
    level: 'A',
    title: 'Tändstickor',
    problemText: `Med tändstickor bygger man kvadrater i rad:

□ = 4 stickor
□□ = 7 stickor
□□□ = 10 stickor

a) Hur många stickor behövs för 10 kvadrater i rad?
b) Skriv en formel för antalet stickor för n kvadrater.
c) Kan man bygga exakt 100 stickor? Motivera ditt svar.
d) Hur många kvadrater kan man bygga med 301 stickor?`,
    minGrade: 6,
    maxGrade: 9,
  },

  // ============ TID OCH HASTIGHET ============
  {
    id: 'tid_e_1',
    theme: 'tid_och_hastighet',
    themeTitle: 'Tid och hastighet',
    level: 'E',
    title: 'Cykeltur',
    problemText: `Emma cyklar till skolan. Hon cyklar 15 km/h och det tar 20 minuter.

Hur långt är det till skolan?

Visa hur du tänker.`,
    minGrade: 5,
    maxGrade: 7,
    tips: '20 minuter = 1/3 timme',
  },
  {
    id: 'tid_c_1',
    theme: 'tid_och_hastighet',
    themeTitle: 'Tid och hastighet',
    level: 'C',
    title: 'Tågresan',
    problemText: `Ett tåg åker mellan två städer som ligger 180 km från varandra.

Tåget stannar på tre stationer emellan och står stilla 5 minuter på varje.
Tåget kör i 90 km/h mellan stationerna.

a) Hur lång tid tar hela resan?
b) Vad blir medelhastigheten för hela resan (inklusive stopp)?`,
    minGrade: 6,
    maxGrade: 9,
  },
  {
    id: 'tid_a_1',
    theme: 'tid_och_hastighet',
    themeTitle: 'Tid och hastighet',
    level: 'A',
    title: 'Möte på vägen',
    problemText: `Två bilar startar samtidigt mot varandra från två städer 240 km ifrån varandra.

Bil A kör 80 km/h och bil B kör 70 km/h.

a) Efter hur lång tid möts bilarna?
b) Hur långt från stad A möts de?
c) Om bil A startar 30 minuter före bil B, var möts de då?

Visa dina beräkningar och resonemang.`,
    minGrade: 7,
    maxGrade: 9,
  },

  // ============ SANNOLIKHET ============
  {
    id: 'sannol_e_1',
    theme: 'sannolikhet',
    themeTitle: 'Sannolikhet',
    level: 'E',
    title: 'Tärningskast',
    problemText: `Du kastar en vanlig tärning (1-6).

a) Vad är sannolikheten att få en 4:a?
b) Vad är sannolikheten att få ett jämnt tal?

Svara som bråktal.`,
    minGrade: 4,
    maxGrade: 7,
  },
  {
    id: 'sannol_c_1',
    theme: 'sannolikhet',
    themeTitle: 'Sannolikhet',
    level: 'C',
    title: 'Kortlek',
    problemText: `I en kortlek med 52 kort finns 4 färger med 13 kort i varje.

a) Vad är sannolikheten att dra ett hjärter?
b) Vad är sannolikheten att dra en kung?
c) Vad är sannolikheten att dra hjärter kung?

Skriv svaren som bråktal i enklaste form.`,
    minGrade: 5,
    maxGrade: 9,
  },
  {
    id: 'sannol_a_1',
    theme: 'sannolikhet',
    themeTitle: 'Sannolikhet',
    level: 'A',
    title: 'Kulor i påse',
    problemText: `I en påse ligger röda och blå kulor. Man drar två kulor utan att lägga tillbaka.

Sannolikheten att första kulan är röd är 3/5.
Sannolikheten att andra kulan är röd (om första var röd) är 1/2.

a) Hur många kulor av varje färg finns i påsen från början?
b) Vad är sannolikheten att båda kulorna är röda?
c) Vad är sannolikheten att kulorna har olika färg?

Visa dina beräkningar och resonemang.`,
    minGrade: 7,
    maxGrade: 9,
  },

  // ============ KOMBINATORIK ============
  {
    id: 'kombi_e_1',
    theme: 'kombinatorik',
    themeTitle: 'Kombinatorik',
    level: 'E',
    title: 'Glasskombinationer',
    problemText: `I glasskiosken finns 3 smaker: vanilj, choklad och jordgubb.

Du ska välja 2 kulor (kan vara samma smak).

Hur många olika kombinationer kan du göra? Lista alla.`,
    minGrade: 3,
    maxGrade: 6,
  },
  {
    id: 'kombi_c_1',
    theme: 'kombinatorik',
    themeTitle: 'Kombinatorik',
    level: 'C',
    title: 'Kläder',
    problemText: `Emma har 4 olika tröjor, 3 olika byxor och 2 olika skor.

a) Hur många olika outfits kan hon sätta ihop?
b) Om hon också har 2 jackor, hur många outfits blir det då (med jacka)?`,
    minGrade: 4,
    maxGrade: 7,
  },
  {
    id: 'kombi_a_1',
    theme: 'kombinatorik',
    themeTitle: 'Kombinatorik',
    level: 'A',
    title: 'Fotbollslag',
    problemText: `I en klass finns 12 elever. Till matchen ska 5 spelare väljas.

a) På hur många sätt kan man välja ut 5 spelare (ordningen spelar ingen roll)?
b) Om en av de 5 ska vara kapten, på hur många sätt kan laget sättas samman då?

Visa dina beräkningar.`,
    minGrade: 7,
    maxGrade: 9,
    tips: 'Använd formeln för kombinationer: n! / (k! × (n-k)!)',
  },

  // ============ PROCENT (fler problem) ============
  {
    id: 'procent_e_1',
    theme: 'procent',
    themeTitle: 'Procent',
    level: 'E',
    title: 'Rea på skor',
    problemText: `Ett par skor kostar 500 kr. De säljs nu med 20% rabatt.

Hur mycket kostar skorna nu?

Visa hur du räknar.`,
    minGrade: 5,
    maxGrade: 7,
  },
  {
    id: 'procent_c_1',
    theme: 'procent',
    themeTitle: 'Procent',
    level: 'C',
    title: 'Befolkningsökning',
    problemText: `En stad har 50 000 invånare. Befolkningen ökar med 3% per år.

a) Hur många invånare finns det efter 1 år?
b) Hur många finns det efter 2 år?
c) Hur lång tid tar det ungefär innan befolkningen fördubblas?`,
    minGrade: 6,
    maxGrade: 9,
  },
  {
    id: 'procent_a_1',
    theme: 'procent',
    themeTitle: 'Procent',
    level: 'A',
    title: 'Prishöjning och sänkning',
    problemText: `En vara höjs först med 25% och sänks sedan med 20%.

a) Om ursprungspriset var 400 kr, vad blir slutpriset?
b) Hur många procent har priset ändrats totalt?
c) Varför blir det inte samma som ursprungspriset trots att 25-20=5?

Förklara och visa beräkningar.`,
    minGrade: 7,
    maxGrade: 9,
  },

  // ============ TID OCH HASTIGHET (fler) ============
  {
    id: 'tid_e_2',
    theme: 'tid_och_hastighet',
    themeTitle: 'Tid och hastighet',
    level: 'E',
    title: 'Promenad',
    problemText: `Lisa går 5 km/h. Hon ska gå till affären som ligger 2 km bort.

Hur lång tid tar promenaden?

Visa hur du tänker.`,
    minGrade: 4,
    maxGrade: 6,
  },
  {
    id: 'tid_c_2',
    theme: 'tid_och_hastighet',
    themeTitle: 'Tid och hastighet',
    level: 'C',
    title: 'Snittfart',
    problemText: `Kalle cyklar till skolan på morgonen (uppför) med 12 km/h.
På hemvägen (nerför) cyklar han 18 km/h.
Sträckan är 6 km.

a) Hur lång tid tar det till skolan?
b) Hur lång tid tar det hem?
c) Vad är hans medelhastighet för hela resan (fram och tillbaka)?`,
    minGrade: 6,
    maxGrade: 9,
    tips: 'Medelhastighet = total sträcka / total tid',
  },

  // ============ GEOMETRI (fler) ============
  {
    id: 'geometri_e_2',
    theme: 'geometri_och_area',
    themeTitle: 'Geometri och area',
    level: 'E',
    title: 'Triangelns area',
    problemText: `En triangel har basen 10 cm och höjden 6 cm.

Beräkna triangelns area.

Visa din uträkning och skriv formeln du använder.`,
    minGrade: 4,
    maxGrade: 7,
  },
  {
    id: 'geometri_c_2',
    theme: 'geometri_och_area',
    themeTitle: 'Geometri och area',
    level: 'C',
    title: 'Måla vägg',
    problemText: `En vägg är 4 m bred och 2,5 m hög. På väggen finns ett fönster som är 1,2 m × 1 m.

a) Hur stor area ska målas?
b) 1 liter färg räcker till 8 m². Hur många liter behövs? Färg säljs i hela liter.`,
    minGrade: 5,
    maxGrade: 8,
  },

  // ============ MÖNSTER (fler) ============
  {
    id: 'monster_e_2',
    theme: 'monster_och_talföljder',
    themeTitle: 'Mönster och talföljder',
    level: 'E',
    title: 'Dubblering',
    problemText: `Titta på talföljden: 3, 6, 12, 24, ...

a) Vad är nästa tal?
b) Vad är regeln?
c) Vad är det 7:e talet?`,
    minGrade: 2,
    maxGrade: 5,
  },
  {
    id: 'monster_c_2',
    theme: 'monster_och_talföljder',
    themeTitle: 'Mönster och talföljder',
    level: 'C',
    title: 'Stolar och bord',
    problemText: `Runt ett fyrkantigt bord sitter 4 personer.
När man sätter ihop 2 bord i rad sitter 6 personer.
Med 3 bord sitter 8 personer.

a) Hur många sitter vid 5 bord i rad?
b) Skriv en formel för antal personer vid n bord.
c) Hur många bord behövs för 30 personer?`,
    minGrade: 5,
    maxGrade: 8,
  },
]

export function getThemesForGrade(grade: number): RichProblemTheme[] {
  return themes.filter(
    (theme) => grade >= theme.minGrade && grade <= theme.maxGrade
  )
}

export function getProblemsForThemeAndGrade(theme: string, grade: number): RichProblem[] {
  return richProblems.filter(
    (p) =>
      p.theme === theme &&
      grade >= p.minGrade &&
      grade <= p.maxGrade
  )
}

export function getProblemById(id: string): RichProblem | undefined {
  return richProblems.find((p) => p.id === id)
}

export function getRandomProblem(grade: number, level?: 'E' | 'C' | 'A'): RichProblem | undefined {
  let filtered = richProblems.filter(
    (p) => grade >= p.minGrade && grade <= p.maxGrade
  )
  if (level) {
    filtered = filtered.filter(p => p.level === level)
  }
  if (filtered.length === 0) return undefined
  return filtered[Math.floor(Math.random() * filtered.length)]
}
