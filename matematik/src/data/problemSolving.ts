import { WorldId } from './worlds';

// ─── Problemlösning & rika matematiska problem ──────────────────────────────────
// Ett "rikt problem" har låg tröskel och högt tak: SAMMA problemsituation kan
// lösas på flera nivåer. Varje problem har därför tre uppgifter som bygger på
// samma kontext – E (grund), C (fördjupning) och A (generalisering/resonemang).
// Uppgifterna är kopplade till ämnen som redan finns i appen via topicIds.

export type ProblemLevel = 'E' | 'C' | 'A';

export const LEVEL_META: Record<ProblemLevel, { label: string; desc: string; color: string; points: number }> = {
  E: { label: 'E', desc: 'Grundnivå',   color: '#10b981', points: 15 },
  C: { label: 'C', desc: 'Fördjupning', color: '#f59e0b', points: 25 },
  A: { label: 'A', desc: 'Utmaning',    color: '#ef4444', points: 40 },
};

export interface ProblemTask {
  level: ProblemLevel;
  question: string;
  answer: string;
  /** Extra godkända svarsvarianter (jämförs normaliserat: gemener, komma→punkt). */
  acceptableAnswers?: string[];
  /** Ledtråd som eleven kan välja att ta fram (halverar poängen). */
  hint: string;
  /** Fullständig lösning som visas efter svar. */
  solution: string;
}

export interface RichProblem {
  id: string;
  worldId: WorldId;
  title: string;
  emoji: string;
  /** Gemensam problemsituation för alla tre nivåerna. */
  context: string;
  /** Ämnen i appen som problemet tränar. */
  topicIds: string[];
  tags: string[];
  tasks: ProblemTask[];
}

export const RICH_PROBLEMS: RichProblem[] = [
  // ══════════════════════════════════════════════════════════════════════════
  // DINOSAURIE VÄRLDEN (Nivå 1–3)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'rp-dino-agg',
    worldId: 'dino',
    title: 'Ägg i boet',
    emoji: '🥚',
    context: 'Dino samlar ägg och lägger dem i sitt bo. Ibland hittar Dino flera ägg samma dag.',
    topicIds: ['addition-bas', 'tio-kamraterna', 'subtraktion-bas'],
    tags: ['Addition', 'Tiokamrater'],
    tasks: [
      {
        level: 'E',
        question: 'Dino hittar 3 ägg på morgonen och 4 ägg på kvällen. Hur många ägg har Dino hittat totalt?',
        answer: '7',
        hint: 'Lägg ihop de två talen: 3 + 4.',
        solution: '3 + 4 = 7 ägg.',
      },
      {
        level: 'C',
        question: 'Dino har 6 ägg i boet. Hur många ägg till behöver Dino för att få 10 ägg?',
        answer: '4',
        hint: 'Tänk på tiokamraterna: vilket tal plus 6 blir 10?',
        solution: '6 + 4 = 10, alltså behövs 4 ägg till. (10 − 6 = 4)',
      },
      {
        level: 'A',
        question: 'Dino delar 10 ägg mellan ett stort bo och ett litet bo. Båda bona måste få minst 1 ägg. På hur många olika sätt kan Dino dela äggen?',
        answer: '9',
        hint: 'Testa systematiskt: 1 i stora boet, 2 i stora boet, 3 … Hur långt kan du gå?',
        solution: 'Stora boet kan få 1, 2, 3, 4, 5, 6, 7, 8 eller 9 ägg (resten hamnar i lilla boet). Det blir 9 olika sätt. Får stora boet 10 ägg blir lilla boet tomt, vilket inte är tillåtet.',
      },
    ],
  },
  {
    id: 'rp-dino-monster',
    worldId: 'dino',
    title: 'Spår i sanden',
    emoji: '🐾',
    context: 'Dino följer ett spår av fotavtryck. Antalet avtryck bildar ett mönster: 2, 4, 6, 8, …',
    topicIds: ['likheter-monster', 'rakna-till-100', 'halften-dubbelt'],
    tags: ['Mönster', 'Multiplikation'],
    tasks: [
      {
        level: 'E',
        question: 'Mönstret är 2, 4, 6, 8, … Vilket tal kommer sedan?',
        answer: '10',
        hint: 'Hur mycket ökar talen varje gång?',
        solution: 'Talen ökar med 2 varje gång. 8 + 2 = 10.',
      },
      {
        level: 'C',
        question: 'I mönstret 2, 4, 6, 8, … — vilket tal står på plats 10?',
        answer: '20',
        hint: 'Plats 1 är 2, plats 2 är 4, plats 3 är 6 … Ser du sambandet med 2:ans tabell?',
        solution: 'Talet på plats n är 2 × n. På plats 10: 2 × 10 = 20.',
      },
      {
        level: 'A',
        question: 'I mönstret 2, 4, 6, 8, … — på vilken plats står talet 36?',
        answer: '18',
        hint: 'Du vet att talet på plats n är 2 × n. Vilket tal gånger 2 blir 36?',
        solution: 'Eftersom talet på plats n är 2 × n gäller 2 × n = 36, alltså n = 36 ÷ 2 = 18. Talet 36 står på plats 18.',
      },
    ],
  },
  {
    id: 'rp-dino-dela',
    worldId: 'dino',
    title: 'Dela lika',
    emoji: '🍪',
    context: 'Dino bakar kakor och vill dela dem rättvist mellan sina kompisar.',
    topicIds: ['halften-dubbelt', 'rakna-till-100', 'problemlosning-lag'],
    tags: ['Division', 'Delbarhet'],
    tasks: [
      {
        level: 'E',
        question: 'Dino har 8 kakor och äter upp hälften. Hur många kakor är kvar?',
        answer: '4',
        hint: 'Hälften betyder att du delar i två lika stora delar.',
        solution: 'Hälften av 8 är 4. Alltså är 4 kakor kvar.',
      },
      {
        level: 'C',
        question: '12 kakor delas lika mellan 3 dinosaurier. Hur många kakor får varje dinosaurie?',
        answer: '4',
        hint: 'Dela upp 12 i tre lika stora högar.',
        solution: '12 ÷ 3 = 4 kakor var.',
      },
      {
        level: 'A',
        question: 'Dino har färre än 20 kakor. Kakorna går att dela lika mellan 2 kompisar OCH lika mellan 3 kompisar. Vilket är det största antal kakor Dino kan ha?',
        answer: '18',
        hint: 'Vilka tal går att dela både på 2 och på 3? Skriv upp dem i ordning.',
        solution: 'Tal som går att dela både på 2 och 3 är 6, 12, 18, 24 … (6:ans tabell). Det största som är mindre än 20 är 18.',
      },
    ],
  },
  {
    id: 'rp-dino-former',
    worldId: 'dino',
    title: 'Bygg med former',
    emoji: '🔺',
    context: 'Dino bygger figurer av trianglar, kvadrater och rektanglar.',
    topicIds: ['former-och-figurer', 'symmetri-lag', 'vinklar-lag'],
    tags: ['Geometri', 'Symmetri'],
    tasks: [
      {
        level: 'E',
        question: 'Hur många hörn har en triangel?',
        answer: '3',
        hint: 'Hörnen är punkterna där sidorna möts.',
        solution: 'En triangel har 3 hörn (och 3 sidor).',
      },
      {
        level: 'C',
        question: 'Dino bygger en figur av 2 kvadrater och 1 triangel. Hur många sidor har formerna tillsammans?',
        answer: '11',
        hint: 'En kvadrat har 4 sidor. Hur många sidor har två kvadrater? Lägg sedan till triangelns sidor.',
        solution: '2 kvadrater har 4 + 4 = 8 sidor. Triangeln har 3 sidor. Totalt 8 + 3 = 11 sidor.',
      },
      {
        level: 'A',
        question: 'Dino ritar en rektangel som INTE är en kvadrat. Hur många symmetrilinjer har den?',
        answer: '2',
        hint: 'Prova att vika rektangeln på mitten — åt vilka håll passar halvorna exakt?',
        solution: 'En rektangel som inte är en kvadrat har 2 symmetrilinjer: en vågrät och en lodrät genom mitten. Diagonalerna är INTE symmetrilinjer (det är de bara i en kvadrat, som har 4).',
      },
    ],
  },
  {
    id: 'rp-dino-klockan',
    worldId: 'dino',
    title: 'Utflykten',
    emoji: '🕐',
    context: 'Dino gör en utflykt till berget och håller koll på klockan.',
    topicIds: ['klockan', 'problemlosning-lag'],
    tags: ['Tid', 'Klockan'],
    tasks: [
      {
        level: 'E',
        question: 'Dino går hemifrån klockan 9. Vad är klockan 2 timmar senare? (svara med siffra, t.ex. 11)',
        answer: '11',
        hint: 'Räkna framåt från 9: 10, 11 …',
        solution: '9 + 2 = 11. Klockan är 11.',
      },
      {
        level: 'C',
        question: 'Dino går hemifrån klockan 9 och kommer hem klockan 14. Hur många timmar var Dino borta?',
        answer: '5',
        hint: 'Räkna framåt från 9 tills du kommer till 14.',
        solution: '14 − 9 = 5. Dino var borta i 5 timmar.',
      },
      {
        level: 'A',
        question: 'Dino var ute i 4 timmar och kom hem klockan 15. Vilken tid gick Dino hemifrån? (svara med siffra)',
        answer: '11',
        hint: 'Här måste du räkna BAKÅT från sluttiden.',
        solution: 'Räkna bakåt: 15 − 4 = 11. Dino gick hemifrån klockan 11.',
      },
    ],
  },
  {
    id: 'rp-dino-hemligt',
    worldId: 'dino',
    title: 'Det hemliga talet',
    emoji: '🔍',
    context: 'Dino har gömt ett hemligt tal och ger ledtrådar om var på tallinjen det finns.',
    topicIds: ['tallinjen-lag', 'fore-och-efter', 'storleksordna-tal', 'position-lag'],
    tags: ['Tallinjen', 'Logik'],
    tasks: [
      {
        level: 'E',
        question: 'Vilket tal kommer direkt efter 29?',
        answer: '30',
        hint: 'Tänk på talraden: 27, 28, 29, …',
        solution: 'Efter 29 kommer 30.',
      },
      {
        level: 'C',
        question: 'Vilket tal ligger mitt emellan 20 och 30 på tallinjen?',
        answer: '25',
        hint: 'Hur långt är det från 20 till 30? Ta hälften av det.',
        solution: 'Från 20 till 30 är det 10 steg. Hälften är 5, så mitten är 20 + 5 = 25.',
      },
      {
        level: 'A',
        question: 'Det hemliga talet är större än 20 och mindre än 30. Talet är jämnt och siffersumman är 8. Vilket är talet?',
        answer: '26',
        hint: 'Skriv upp alla jämna tal mellan 20 och 30 och räkna ut varje siffersumma.',
        solution: 'Jämna tal mellan 20 och 30: 22 (2+2=4), 24 (2+4=6), 26 (2+6=8) ✓, 28 (2+8=10). Bara 26 har siffersumman 8.',
      },
    ],
  },
  {
    id: 'rp-dino-vikt',
    worldId: 'dino',
    title: 'Väg stenarna',
    emoji: '⚖️',
    context: 'Dino väger stenar med en balansvåg och har vikter på 1 kg, 2 kg och 5 kg.',
    topicIds: ['omv-vikt-lag', 'enheter', 'omv-mat-lag'],
    tags: ['Vikt', 'Kombinationer'],
    tasks: [
      {
        level: 'E',
        question: 'Hur många gram är 1 kg?',
        answer: '1000',
        acceptableAnswers: ['1 000'],
        hint: 'Kilo betyder tusen.',
        solution: '1 kg = 1000 g.',
      },
      {
        level: 'C',
        question: 'En sten väger 2 kg. Hur många gram är det?',
        answer: '2000',
        acceptableAnswers: ['2 000'],
        hint: '1 kg är 1000 g. Hur mycket blir då 2 kg?',
        solution: '2 kg = 2 × 1000 g = 2000 g.',
      },
      {
        level: 'A',
        question: 'Dino har vikterna 1 kg, 2 kg och 5 kg och får använda varje vikt högst en gång. Vilken är den minsta vikt över 6 kg som Dino kan väga upp? (svara i kg)',
        answer: '7',
        hint: 'Skriv upp alla summor du kan bilda av vikterna och leta efter dem som är över 6.',
        solution: 'Möjliga summor: 1, 2, 5, 1+2=3, 1+5=6, 2+5=7, 1+2+5=8. De som är över 6 kg är 7 och 8. Den minsta är 7 kg (2 kg + 5 kg).',
      },
    ],
  },
  {
    id: 'rp-dino-bygg-tal',
    worldId: 'dino',
    title: 'Bygg tal med siffror',
    emoji: '🔢',
    context: 'Dino har sifferbrickor och bygger olika tal av dem.',
    topicIds: ['position-lag', 'storleksordna-tal', 'rakna-till-100'],
    tags: ['Positionssystem', 'Taluppfattning'],
    tasks: [
      {
        level: 'E',
        question: 'Vilken siffra står på tiotalsplatsen i talet 47?',
        answer: '4',
        hint: 'I talet 47 är 7 entalet. Vilken siffra är kvar?',
        solution: 'I talet 47 står 4 på tiotalsplatsen (4 tiotal = 40) och 7 på entalsplatsen.',
      },
      {
        level: 'C',
        question: 'Bygg det STÖRSTA tresiffriga talet med brickorna 3, 7 och 5. Vilket tal blir det?',
        answer: '753',
        hint: 'Den största siffran ska stå där den är värd mest — på hundratalsplatsen.',
        solution: 'Sätt största siffran först: 7, sedan 5, sist 3 → 753.',
      },
      {
        level: 'A',
        question: 'Bygg det MINSTA tresiffriga talet med brickorna 0, 4 och 6. Talet får inte börja med 0. Vilket tal blir det?',
        answer: '406',
        hint: 'Minsta siffran ska stå först — men 0 får inte börja talet. Vilken siffra måste då stå först?',
        solution: 'Talet kan inte börja med 0, så minsta möjliga första siffra är 4. Sedan kommer minsta kvarvarande siffra: 0, och sist 6 → 406.',
      },
    ],
  },
  {
    id: 'rp-dino-kulor',
    worldId: 'dino',
    title: 'Kulor i påsen',
    emoji: '🔴',
    context: 'Dino har en påse med röda och blå kulor och drar en kula utan att titta.',
    topicIds: ['sannolikhet-lag', 'halften-dubbelt', 'problemlosning-lag'],
    tags: ['Sannolikhet', 'Resonemang'],
    tasks: [
      {
        level: 'E',
        question: 'I påsen finns 3 röda och 1 blå kula. Vilken färg är det störst chans att dra? (svara: röd eller blå)',
        answer: 'röd',
        acceptableAnswers: ['röd', 'rod', 'röda'],
        hint: 'Vilken färg finns det flest av?',
        solution: 'Det finns 3 röda men bara 1 blå, så det är störst chans att dra en röd kula.',
      },
      {
        level: 'C',
        question: 'I påsen finns 3 röda och 1 blå kula. Hur många blå kulor måste Dino lägga i för att det ska bli lika många röda som blå?',
        answer: '2',
        hint: 'Hur många blå behövs totalt för att det ska bli 3 stycken?',
        solution: 'Det behövs 3 blå kulor totalt för att matcha de 3 röda. Det finns redan 1 blå, så 3 − 1 = 2 blå kulor måste läggas i.',
      },
      {
        level: 'A',
        question: 'I en påse finns 6 kulor, några röda och några blå. Det är dubbelt så många röda som blå. Hur många röda kulor finns det?',
        answer: '4',
        hint: 'Prova dig fram: om det finns 1 blå, hur många röda blir det då? Blir det 6 totalt?',
        solution: 'Prova: 1 blå → 2 röda = 3 kulor (för få). 2 blå → 4 röda = 6 kulor ✓. Det finns alltså 4 röda och 2 blå kulor.',
      },
    ],
  },
  {
    id: 'rp-dino-handla',
    worldId: 'dino',
    title: 'Handla i boden',
    emoji: '🪙',
    context: 'Dino handlar i boden och behöver räkna ut vad allt kostar och vad som blir kvar.',
    topicIds: ['addition-strategier', 'overgang-ental-tiotal', 'subtraktion-strategier', 'rimlighetsoevningar-lag'],
    tags: ['Addition', 'Pengar'],
    tasks: [
      {
        level: 'E',
        question: 'Vad är 8 + 5?',
        answer: '13',
        hint: 'Fyll först upp till 10: 8 + 2 = 10. Hur mycket finns kvar att lägga till?',
        solution: '8 + 5 = 8 + 2 + 3 = 10 + 3 = 13.',
      },
      {
        level: 'C',
        question: 'Dino köper tre saker som kostar 8 kr, 7 kr och 6 kr. Hur mycket kostar allt tillsammans?',
        answer: '21',
        hint: 'Lägg ihop två tal i taget: börja med 8 + 7.',
        solution: '8 + 7 = 15, och 15 + 6 = 21 kr.',
      },
      {
        level: 'A',
        question: 'Dino köper saker för 8 kr, 7 kr och 6 kr och betalar med 25 kr. Hur mycket får Dino tillbaka?',
        answer: '4',
        hint: 'Räkna först ut vad allt kostar tillsammans. Dra sedan bort det från 25.',
        solution: 'Varorna kostar 8 + 7 + 6 = 21 kr. Dino får tillbaka 25 − 21 = 4 kr.',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // FANTASY VÄRLDEN (Nivå 4–6)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'rp-fantasy-tradgard',
    worldId: 'fantasy',
    title: 'Trollkarlens trädgård',
    emoji: '🏰',
    context: 'Trollkarlen ska sätta upp ett staket runt en rektangulär trädgård och vill veta hur stor den blir.',
    topicIds: ['geometri-omfang', 'geometri-mel', 'multiplikation-steg-2'],
    tags: ['Omkrets', 'Area', 'Optimering'],
    tasks: [
      {
        level: 'E',
        question: 'Trädgården är 6 m lång och 4 m bred. Hur lång är omkretsen? (svara i meter)',
        answer: '20',
        hint: 'Omkretsen är alla fyra sidorna tillsammans.',
        solution: 'Omkrets = 6 + 4 + 6 + 4 = 20 m. (Eller 2 × (6 + 4) = 20 m.)',
      },
      {
        level: 'C',
        question: 'Trädgården är 6 m lång och 4 m bred. Hur stor är arean? (svara i kvadratmeter)',
        answer: '24',
        hint: 'Area för en rektangel = längd × bredd.',
        solution: 'Area = 6 × 4 = 24 m².',
      },
      {
        level: 'A',
        question: 'Trollkarlen har 20 m staket. Rektangelns sidor ska vara hela meter. Vilken är den STÖRSTA area trädgården kan få? (svara i kvadratmeter)',
        answer: '25',
        hint: 'Om omkretsen är 20 m är längd + bredd = 10 m. Testa olika par: 1+9, 2+8, 3+7 … och räkna arean för varje.',
        solution: 'Omkrets 20 m ⇒ längd + bredd = 10. Testa: 1×9=9, 2×8=16, 3×7=21, 4×6=24, 5×5=25. Störst area får man när sidorna är lika långa: 5 × 5 = 25 m². (En kvadrat ger alltid störst area vid given omkrets.)',
      },
    ],
  },
  {
    id: 'rp-fantasy-skatt',
    worldId: 'fantasy',
    title: 'Drakens skatt',
    emoji: '🐉',
    context: 'Draken vaktar en hög med guldmynt och delar ibland ut delar av skatten.',
    topicIds: ['brak-steg-1', 'brak-steg-2', 'brak-steg-3', 'rationella-brak-mel'],
    tags: ['Bråk', 'Del av antal'],
    tasks: [
      {
        level: 'E',
        question: 'Draken har 20 guldmynt och ger bort 1/4 av dem. Hur många mynt ger draken bort?',
        answer: '5',
        hint: '1/4 betyder att du delar högen i 4 lika delar och tar en del.',
        solution: '20 ÷ 4 = 5 mynt.',
      },
      {
        level: 'C',
        question: 'Draken har 40 guldmynt och ger bort 3/8 av dem. Hur många mynt ger draken bort?',
        answer: '15',
        hint: 'Räkna först ut vad 1/8 av 40 är. Ta sedan 3 sådana delar.',
        solution: '1/8 av 40 är 40 ÷ 8 = 5. Då är 3/8 lika med 3 × 5 = 15 mynt.',
      },
      {
        level: 'A',
        question: 'Draken har 60 mynt. Först ger draken bort 1/3 av mynten. Sedan ger draken bort 1/4 av de mynt som är KVAR. Hur många mynt har draken kvar till slut?',
        answer: '30',
        hint: 'Räkna i två steg. Hur många mynt finns kvar efter första utdelningen? Det är den nya helheten.',
        solution: 'Steg 1: 1/3 av 60 = 20 mynt bort. Kvar: 60 − 20 = 40 mynt. Steg 2: 1/4 av 40 = 10 mynt bort. Kvar: 40 − 10 = 30 mynt. (Obs! Andra gången räknas 1/4 på 40, inte på 60.)',
      },
    ],
  },
  {
    id: 'rp-fantasy-rea',
    worldId: 'fantasy',
    title: 'Rea i byn',
    emoji: '🛡️',
    context: 'Byns smed ändrar priserna på sina varor med olika procentsatser.',
    topicIds: ['procent-steg-1', 'procent-steg-2', 'procent-steg-3'],
    tags: ['Procent', 'Rabatt'],
    tasks: [
      {
        level: 'E',
        question: 'Vad är 10 % av 200 kr?',
        answer: '20',
        hint: '10 % är samma sak som en tiondel.',
        solution: '10 % av 200 = 200 ÷ 10 = 20 kr.',
      },
      {
        level: 'C',
        question: 'En sköld kostar 400 kr. Priset sänks med 25 %. Vad kostar skölden efter sänkningen?',
        answer: '300',
        hint: 'Räkna först ut hur många kronor rabatten är. Dra sedan bort den från priset.',
        solution: '25 % av 400 = 100 kr i rabatt. Nytt pris: 400 − 100 = 300 kr. (Eller direkt: 0,75 × 400 = 300 kr.)',
      },
      {
        level: 'A',
        question: 'Ett svärd kostar 500 kr. Först HÖJS priset med 20 %. Sedan SÄNKS det nya priset med 20 %. Vad kostar svärdet till slut?',
        answer: '480',
        hint: 'Sänkningen räknas på det HÖJDA priset, inte på det ursprungliga. Räkna steg för steg.',
        solution: 'Höjning: 500 × 1,20 = 600 kr. Sänkning: 20 % av 600 = 120 kr, alltså 600 − 120 = 480 kr. Svaret blir INTE 500 kr, eftersom 20 % räknas på olika stora belopp: höjningen på 500 men sänkningen på 600.',
      },
    ],
  },
  {
    id: 'rp-fantasy-tabeller',
    worldId: 'fantasy',
    title: 'Smart multiplikation',
    emoji: '✖️',
    context: 'Trollkarlens lärling räknar stora multiplikationer i huvudet med smarta knep.',
    topicIds: ['multiplikation-steg-1', 'multiplikation-steg-2', 'multiplikation-steg-3', 'huvudrakning'],
    tags: ['Multiplikation', 'Strategier'],
    tasks: [
      {
        level: 'E',
        question: 'Vad är 6 × 7?',
        answer: '42',
        hint: 'Tänk på 7:ans tabell.',
        solution: '6 × 7 = 42.',
      },
      {
        level: 'C',
        question: 'Vad är 6 × 70?',
        answer: '420',
        hint: 'Du vet att 6 × 7 = 42. Vad händer om den ena faktorn blir 10 gånger större?',
        solution: '6 × 70 = 6 × 7 × 10 = 42 × 10 = 420.',
      },
      {
        level: 'A',
        question: 'Räkna ut 24 × 25 med ett smart knep.',
        answer: '600',
        hint: 'Fyra 25:or blir 100. Hur många gånger går 4 i 24?',
        solution: 'Ett knep: 25 = 100 ÷ 4, så 24 × 25 = 24 × 100 ÷ 4 = 2400 ÷ 4 = 600. (Eller: 24 × 25 = 6 × 4 × 25 = 6 × 100 = 600.)',
      },
    ],
  },
  {
    id: 'rp-fantasy-vagnar',
    worldId: 'fantasy',
    title: 'Riddarnas vagnar',
    emoji: '🐴',
    context: 'Riddarna ska transporteras till tornerspelen i hästvagnar.',
    topicIds: ['division-steg-1', 'division-steg-2', 'division-steg-3', 'rimlighetsoevningar-mel'],
    tags: ['Division', 'Rest'],
    tasks: [
      {
        level: 'E',
        question: '24 riddare delas i 6 lika stora grupper. Hur många riddare blir det i varje grupp?',
        answer: '4',
        hint: 'Dela 24 i 6 lika delar.',
        solution: '24 ÷ 6 = 4 riddare i varje grupp.',
      },
      {
        level: 'C',
        question: '26 riddare delas i grupper med 6 i varje. Hur många riddare blir över?',
        answer: '2',
        hint: 'Hur många hela grupper med 6 får du ut av 26? Vad finns kvar sedan?',
        solution: '26 ÷ 6 = 4 hela grupper (4 × 6 = 24) och 26 − 24 = 2 riddare blir över.',
      },
      {
        level: 'A',
        question: 'Det finns 50 riddare och varje vagn rymmer 8 riddare. Hur många vagnar behövs för att ALLA ska få plats?',
        answer: '7',
        hint: 'Räkna först ut hur många hela vagnar som fylls. Vad händer med riddarna som blir över?',
        solution: '50 ÷ 8 = 6 hela vagnar (6 × 8 = 48) och 2 riddare blir över. De 2 behöver också en vagn, så det krävs 6 + 1 = 7 vagnar. Här måste man avrunda UPPÅT, trots att 50 ÷ 8 = 6,25.',
      },
    ],
  },
  {
    id: 'rp-fantasy-vagen',
    worldId: 'fantasy',
    title: 'Den magiska vågen',
    emoji: '⚖️',
    context: 'En magisk våg är i balans. Det som väger lika mycket på båda sidor kan tas bort.',
    topicIds: ['ekvationer-mel-steg-1', 'ekvationer-mel-steg-2', 'ekvationer-mel-steg-3'],
    tags: ['Ekvationer', 'Balans'],
    tasks: [
      {
        level: 'E',
        question: 'Lös ekvationen: x + 5 = 12. Vad är x?',
        answer: '7',
        hint: 'Ta bort 5 från båda sidor av vågen.',
        solution: 'x + 5 = 12 → x = 12 − 5 = 7.',
      },
      {
        level: 'C',
        question: 'Lös ekvationen: 3x = 21. Vad är x?',
        answer: '7',
        hint: 'Tre lika stora paket väger 21 tillsammans. Hur mycket väger ett paket?',
        solution: '3x = 21 → x = 21 ÷ 3 = 7.',
      },
      {
        level: 'A',
        question: 'Lös ekvationen: 2x + 4 = 16. Vad är x?',
        answer: '6',
        hint: 'Ta först bort 4 från båda sidor. Vad står kvar då?',
        solution: '2x + 4 = 16 → 2x = 16 − 4 = 12 → x = 12 ÷ 2 = 6. Kontroll: 2 × 6 + 4 = 16 ✓',
      },
    ],
  },
  {
    id: 'rp-fantasy-loppet',
    worldId: 'fantasy',
    title: 'Kapploppet',
    emoji: '🏃',
    context: 'Tre löpare tävlar och tiderna mäts med decimaler i sekunder.',
    topicIds: ['decimaler', 'taluppfattning-1', 'taluppfattning-2', 'tallinjen-mel'],
    tags: ['Decimaltal', 'Jämföra'],
    tasks: [
      {
        level: 'E',
        question: 'Vilket tal är störst: 0,7 eller 0,65? (skriv talet)',
        answer: '0,7',
        acceptableAnswers: ['0.7', '0,70', '0.70'],
        hint: 'Jämför tiondelarna först: 7 tiondelar mot 6 tiondelar.',
        solution: '0,7 = 0,70 som har 70 hundradelar, medan 0,65 har 65 hundradelar. Alltså är 0,7 störst.',
      },
      {
        level: 'C',
        question: 'Räkna ut 0,7 + 0,25.',
        answer: '0,95',
        acceptableAnswers: ['0.95'],
        hint: 'Skriv 0,7 som 0,70 så att båda talen har lika många decimaler.',
        solution: '0,70 + 0,25 = 0,95.',
      },
      {
        level: 'A',
        question: 'Tre löpare får tiderna 12,4 s, 12,04 s och 12,40 s. Vad är skillnaden mellan den snabbaste och den långsammaste tiden? (svara i sekunder)',
        answer: '0,36',
        acceptableAnswers: ['0.36'],
        hint: 'Se upp! Två av tiderna är faktiskt lika stora. Skriv alla med lika många decimaler.',
        solution: 'Skriv om: 12,40 s, 12,04 s och 12,40 s. Snabbast (minst) är 12,04 s och långsammast är 12,40 s. Skillnaden: 12,40 − 12,04 = 0,36 s. Obs att 12,4 och 12,40 är exakt samma tid.',
      },
    ],
  },
  {
    id: 'rp-fantasy-poang',
    worldId: 'fantasy',
    title: 'Klassens poäng',
    emoji: '📊',
    context: 'Fyra elever tävlar i en trollkarlstävling och deras poäng sammanställs.',
    topicIds: ['statistik-mel', 'huvudrakning', 'ekvationer-mel-steg-2'],
    tags: ['Statistik', 'Medelvärde'],
    tasks: [
      {
        level: 'E',
        question: 'Tre elever har 4, 6 och 8 poäng. Vad är medelvärdet?',
        answer: '6',
        hint: 'Lägg ihop alla poäng och dela med antalet elever.',
        solution: '(4 + 6 + 8) ÷ 3 = 18 ÷ 3 = 6 poäng.',
      },
      {
        level: 'C',
        question: 'Fyra elever har poängen 3, 5, 7 och 9. Vad är medianen?',
        answer: '6',
        hint: 'Medianen är mittvärdet. Med fyra tal finns två tal i mitten — ta medelvärdet av dem.',
        solution: 'Talen i ordning: 3, 5, 7, 9. De två mittersta är 5 och 7. Medianen är (5 + 7) ÷ 2 = 6.',
      },
      {
        level: 'A',
        question: 'Fyra elever har medelvärdet 7 poäng. Tre av dem har 5, 6 och 9 poäng. Hur många poäng har den fjärde eleven?',
        answer: '8',
        hint: 'Om medelvärdet är 7 för fyra elever — hur många poäng har de tillsammans?',
        solution: 'Totalpoängen är 4 × 7 = 28. De tre kända har 5 + 6 + 9 = 20 poäng. Den fjärde har 28 − 20 = 8 poäng.',
      },
    ],
  },
  {
    id: 'rp-fantasy-primtal',
    worldId: 'fantasy',
    title: 'Trollformlernas tal',
    emoji: '🔮',
    context: 'Vissa tal är magiska: de går bara att dela med 1 och sig själva. Andra går att bygga av mindre tal.',
    topicIds: ['primtal-faktorer', 'division-steg-2', 'multiplikation-steg-2'],
    tags: ['Primtal', 'Delare'],
    tasks: [
      {
        level: 'E',
        question: 'Är 7 ett primtal? (svara ja eller nej)',
        answer: 'ja',
        hint: 'Går 7 att dela jämnt med något annat tal än 1 och 7?',
        solution: 'Ja. 7 går bara att dela jämnt med 1 och 7, alltså är det ett primtal.',
      },
      {
        level: 'C',
        question: 'Hur många delare har talet 12? (räkna med både 1 och 12)',
        answer: '6',
        hint: 'Skriv upp alla tal som 12 går att dela jämnt med: 1, 2, 3 …',
        solution: 'Delarna till 12 är 1, 2, 3, 4, 6 och 12. Det är 6 stycken.',
      },
      {
        level: 'A',
        question: 'Vilket är det MINSTA talet som är delbart med både 4 och 6?',
        answer: '12',
        hint: 'Skriv upp 4:ans tabell och 6:ans tabell. Vilket är det första talet som finns i båda?',
        solution: '4:ans tabell: 4, 8, 12, 16 … 6:ans tabell: 6, 12, 18 … Det minsta talet som finns i båda är 12. (Obs: 24 är också delbart med båda, men 12 är minst.)',
      },
    ],
  },
  {
    id: 'rp-fantasy-tidtabell',
    worldId: 'fantasy',
    title: 'Draktaxins tidtabell',
    emoji: '🕰️',
    context: 'Draktaxin avgår med jämna mellanrum och resenärerna måste planera sin tid.',
    topicIds: ['klockan-mel', 'omv-mat-mel', 'huvudrakning'],
    tags: ['Tid', 'Planering'],
    tasks: [
      {
        level: 'E',
        question: 'En resa börjar 14:00 och slutar 15:30. Hur många minuter tar resan?',
        answer: '90',
        hint: 'En timme är 60 minuter. Hur mycket är det utöver hela timmen?',
        solution: 'Från 14:00 till 15:00 är 60 minuter, plus 30 minuter till = 90 minuter.',
      },
      {
        level: 'C',
        question: 'En resa tar 2 timmar och 45 minuter och startar 09:20. Vilken tid är man framme? (svara t.ex. 12:05)',
        answer: '12:05',
        acceptableAnswers: ['12.05', '1205'],
        hint: 'Lägg först till hela timmar, sedan minuterna. Vad händer när minuterna passerar 60?',
        solution: '09:20 + 2 timmar = 11:20. 11:20 + 45 min = 11:65, vilket är 12:05 (eftersom 65 min = 1 timme och 5 min).',
      },
      {
        level: 'A',
        question: 'Draktaxin avgår var 25:e minut med start klockan 08:00. Vilken är den första avgången EFTER klockan 09:00? (svara t.ex. 09:15)',
        answer: '09:15',
        acceptableAnswers: ['9:15', '09.15', '9.15', '0915'],
        hint: 'Skriv upp avgångstiderna i tur och ordning: 08:00, 08:25, …',
        solution: 'Avgångarna är 08:00, 08:25, 08:50, 09:15, 09:40 … Den första efter 09:00 är 09:15.',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SCI-FI VÄRLDEN (Nivå 7–9)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'rp-scifi-modul',
    worldId: 'scifi',
    title: 'Rymdstationens moduler',
    emoji: '🛰️',
    context: 'Rymdstationen byggs av moduler i form av rätblock, kuber och cylindrar.',
    topicIds: ['geometri-volym', 'geometri-area', 'enhetsomvandlingar-hog'],
    tags: ['Volym', 'Area', 'Geometri'],
    tasks: [
      {
        level: 'E',
        question: 'En modul är ett rätblock med måtten 4 m × 3 m × 2 m. Vad är volymen? (svara i m³)',
        answer: '24',
        hint: 'Volymen för ett rätblock är längd × bredd × höjd.',
        solution: 'V = 4 × 3 × 2 = 24 m³.',
      },
      {
        level: 'C',
        question: 'En cylinderformad tank har radien 3 m och höjden 5 m. Vad är volymen? (använd π ≈ 3,14 och svara avrundat till heltal m³)',
        answer: '141',
        hint: 'Volymen för en cylinder är basytan × höjden, alltså π × r² × h.',
        solution: 'V = π · r² · h ≈ 3,14 × 3² × 5 = 3,14 × 9 × 5 = 141,3 ≈ 141 m³.',
      },
      {
        level: 'A',
        question: 'En kubformad modul har volymen 27 m³. Hur stor är kubens totala begränsningsarea? (svara i m²)',
        answer: '54',
        hint: 'Vilken kantlängd ger volymen 27? En kub har 6 lika stora sidor.',
        solution: 'Kubens sida: s³ = 27 ⇒ s = 3 m. Varje sida har arean 3 × 3 = 9 m² och kuben har 6 sidor: 6 × 9 = 54 m².',
      },
    ],
  },
  {
    id: 'rp-scifi-bransle',
    worldId: 'scifi',
    title: 'Bränslecellerna',
    emoji: '⛽',
    context: 'Rymdskeppet behöver bränsleceller och de säljs i olika paket och antal.',
    topicIds: ['proportioner', 'procent-steg-2', 'rimlighetsoevningar-hog'],
    tags: ['Proportionalitet', 'Jämförpris'],
    tasks: [
      {
        level: 'E',
        question: '3 bränsleceller kostar 45 kr. Vad kostar 1 bränslecell?',
        answer: '15',
        hint: 'Dela totalpriset med antalet celler.',
        solution: '45 ÷ 3 = 15 kr per cell.',
      },
      {
        level: 'C',
        question: 'Om 3 bränsleceller kostar 45 kr, vad kostar då 7 bränsleceller?',
        answer: '105',
        hint: 'Räkna först ut priset för en cell, multiplicera sedan.',
        solution: 'En cell kostar 45 ÷ 3 = 15 kr. Sju celler kostar 7 × 15 = 105 kr.',
      },
      {
        level: 'A',
        question: 'Paket A: 5 celler för 70 kr. Paket B: 8 celler för 112 kr. Vilket paket är billigast per cell? (svara A, B eller lika)',
        answer: 'lika',
        acceptableAnswers: ['lika', 'lika dyra', 'samma'],
        hint: 'Räkna ut jämförpriset (kr per cell) för båda paketen och jämför.',
        solution: 'Paket A: 70 ÷ 5 = 14 kr/cell. Paket B: 112 ÷ 8 = 14 kr/cell. Paketen är exakt lika billiga per cell — priset är proportionellt mot antalet.',
      },
    ],
  },
  {
    id: 'rp-scifi-pythagoras',
    worldId: 'scifi',
    title: 'Avstånd i rymden',
    emoji: '📐',
    context: 'Navigationsdatorn räknar ut avstånd med hjälp av rätvinkliga trianglar.',
    topicIds: ['pythagoras', 'geometri-volym', 'potenser-steg-1'],
    tags: ['Pythagoras', 'Geometri'],
    tasks: [
      {
        level: 'E',
        question: 'En rätvinklig triangel har kateterna 3 och 4. Hur lång är hypotenusan?',
        answer: '5',
        hint: 'Pythagoras sats: a² + b² = c².',
        solution: 'c² = 3² + 4² = 9 + 16 = 25 ⇒ c = 5.',
      },
      {
        level: 'C',
        question: 'I en rätvinklig triangel är hypotenusan 13 och en katet 5. Hur lång är den andra kateten?',
        answer: '12',
        hint: 'Nu söker du en katet, så du behöver subtrahera: b² = c² − a².',
        solution: 'b² = 13² − 5² = 169 − 25 = 144 ⇒ b = 12.',
      },
      {
        level: 'A',
        question: 'En lastmodul är ett rätblock med måtten 3 m × 4 m × 12 m. Hur lång är rymddiagonalen (från ett hörn till motsatt hörn)?',
        answer: '13',
        hint: 'Använd Pythagoras två gånger: först diagonalen i bottenytan, sedan tillsammans med höjden.',
        solution: 'Bottendiagonalen: d² = 3² + 4² = 25 ⇒ d = 5 m. Rymddiagonalen: D² = d² + 12² = 25 + 144 = 169 ⇒ D = 13 m. (Genvägen: D = √(3² + 4² + 12²) = √169 = 13.)',
      },
    ],
  },
  {
    id: 'rp-scifi-procent',
    worldId: 'scifi',
    title: 'Priset på reservdelar',
    emoji: '💸',
    context: 'Priserna på reservdelar ändras när efterfrågan i galaxen går upp och ner.',
    topicIds: ['procent-forandring', 'procentenheter', 'procent-steg-3'],
    tags: ['Procent', 'Förändringsfaktor'],
    tasks: [
      {
        level: 'E',
        question: 'Öka 200 kr med 20 %. Vad blir det nya priset?',
        answer: '240',
        hint: '20 % av 200 är ökningen. Lägg till den.',
        solution: '20 % av 200 = 40 kr. Nytt pris: 200 + 40 = 240 kr. (Eller 1,20 × 200 = 240 kr.)',
      },
      {
        level: 'C',
        question: 'Ett pris minskar från 250 kr till 200 kr. Hur många procent är minskningen?',
        answer: '20',
        hint: 'Räkna först minskningen i kronor. Dela den sedan med det URSPRUNGLIGA priset.',
        solution: 'Minskningen är 250 − 200 = 50 kr. Andel: 50 / 250 = 0,2 = 20 %.',
      },
      {
        level: 'A',
        question: 'Efter en prishöjning på 25 % kostar en modul 500 kr. Vad kostade modulen INNAN höjningen?',
        answer: '400',
        hint: 'Det gamla priset multiplicerat med förändringsfaktorn 1,25 gav 500 kr. Vad måste du göra för att komma tillbaka?',
        solution: 'Gammalt pris × 1,25 = 500 ⇒ gammalt pris = 500 / 1,25 = 400 kr. Kontroll: 400 + 25 % av 400 = 400 + 100 = 500 ✓ (Ett vanligt fel är att dra bort 25 % av 500, vilket felaktigt ger 375 kr.)',
      },
    ],
  },
  {
    id: 'rp-scifi-linje',
    worldId: 'scifi',
    title: 'Rymdskeppets bana',
    emoji: '📈',
    context: 'Rymdskeppets bana beskrivs med räta linjer i ett koordinatsystem.',
    topicIds: ['rata-linjen', 'koordinatsystem', 'funktioner', 'ekvationer-steg-2'],
    tags: ['Räta linjen', 'Koordinatsystem'],
    tasks: [
      {
        level: 'E',
        question: 'Linjen har ekvationen y = 2x + 3. Vad är y när x = 4?',
        answer: '11',
        hint: 'Sätt in 4 på x:s plats och räkna ut.',
        solution: 'y = 2 × 4 + 3 = 8 + 3 = 11.',
      },
      {
        level: 'C',
        question: 'En linje går genom punkterna (0, 1) och (2, 7). Vad är linjens k-värde (lutning)?',
        answer: '3',
        hint: 'k är förändringen i y delat med förändringen i x.',
        solution: 'k = (7 − 1) / (2 − 0) = 6 / 2 = 3.',
      },
      {
        level: 'A',
        question: 'Var skär linjerna y = 2x + 1 och y = −x + 7 varandra? Ange x-värdet.',
        answer: '2',
        hint: 'I skärningspunkten är y lika stort för båda linjerna. Sätt uttrycken lika med varandra.',
        solution: '2x + 1 = −x + 7 ⇒ 3x = 6 ⇒ x = 2. (y blir då 2 × 2 + 1 = 5, så skärningspunkten är (2, 5).)',
      },
    ],
  },
  {
    id: 'rp-scifi-standardform',
    worldId: 'scifi',
    title: 'Ljusets hastighet',
    emoji: '💫',
    context: 'I rymden används mycket stora tal, som skrivs i standardform (grundpotensform).',
    topicIds: ['standardform', 'potenser-steg-2', 'prioritering'],
    tags: ['Standardform', 'Tiopotenser'],
    tasks: [
      {
        level: 'E',
        question: 'Skriv 3 × 10⁴ som ett vanligt tal.',
        answer: '30000',
        acceptableAnswers: ['30 000'],
        hint: '10⁴ betyder 10 000.',
        solution: '3 × 10⁴ = 3 × 10 000 = 30 000.',
      },
      {
        level: 'C',
        question: 'Räkna ut (2 × 10³) × (4 × 10²) och svara som ett vanligt tal.',
        answer: '800000',
        acceptableAnswers: ['800 000'],
        hint: 'Multiplicera talen för sig och tiopotenserna för sig. 10³ × 10² = 10⁵.',
        solution: '2 × 4 = 8 och 10³ × 10² = 10⁵. Alltså 8 × 10⁵ = 800 000.',
      },
      {
        level: 'A',
        question: 'Ljuset färdas 3 × 10⁸ meter per sekund. Hur många sekunder tar det för ljuset att färdas 9 × 10⁸ meter?',
        answer: '3',
        hint: 'Tid = sträcka delat med hastighet. Dela talen för sig och tiopotenserna för sig.',
        solution: 't = (9 × 10⁸) / (3 × 10⁸) = (9/3) × (10⁸/10⁸) = 3 × 1 = 3 sekunder.',
      },
    ],
  },
  {
    id: 'rp-scifi-skala',
    worldId: 'scifi',
    title: 'Stjärnkartan',
    emoji: '🗺️',
    context: 'Rymdbasen ritas i skala på en karta och byggs som modell.',
    topicIds: ['skala', 'proportioner', 'enhetsomvandlingar-hog', 'geometri-area'],
    tags: ['Skala', 'Area'],
    tasks: [
      {
        level: 'E',
        question: 'På en ritning i skala 1:100 är en vägg 5 cm lång. Hur lång är väggen i verkligheten? (svara i cm)',
        answer: '500',
        hint: 'Skala 1:100 betyder att verkligheten är 100 gånger större än ritningen.',
        solution: '5 cm × 100 = 500 cm (alltså 5 m).',
      },
      {
        level: 'C',
        question: 'På en ritning i skala 1:100 ska en vägg som är 8 m i verkligheten ritas. Hur lång blir väggen på ritningen? (svara i cm)',
        answer: '8',
        hint: 'Gör om 8 m till cm först, och dela sedan med 100.',
        solution: '8 m = 800 cm. På ritningen: 800 ÷ 100 = 8 cm.',
      },
      {
        level: 'A',
        question: 'En modell av rymdbasen är byggd i skala 1:10. Modellens golvyta är 2 m². Hur stor är den verkliga golvytan? (svara i m²)',
        answer: '200',
        hint: 'Både längden och bredden blir 10 gånger större. Vad händer då med arean?',
        solution: 'Längdskalan är 10, men arean växer med skalan i kvadrat: 10² = 100. Verklig area = 2 × 100 = 200 m². (Ett vanligt fel är att svara 20 m².)',
      },
    ],
  },
  {
    id: 'rp-scifi-figurer',
    worldId: 'scifi',
    title: 'Byggnadsställningen',
    emoji: '🧩',
    context: 'Robotarna bygger torn av stavar. Figur 1 har 4 stavar, figur 2 har 7 stavar och figur 3 har 10 stavar.',
    topicIds: ['algebra-steg-1', 'algebra-steg-2', 'forenkla-uttryck', 'ekvationer-steg-2'],
    tags: ['Mönster', 'Algebra', 'Generalisering'],
    tasks: [
      {
        level: 'E',
        question: 'Figur 1 har 4 stavar, figur 2 har 7 och figur 3 har 10. Hur många stavar har figur 4?',
        answer: '13',
        hint: 'Hur många stavar tillkommer mellan varje figur?',
        solution: 'Varje ny figur kräver 3 stavar till: 4, 7, 10, 13. Figur 4 har 13 stavar.',
      },
      {
        level: 'C',
        question: 'Med samma mönster (4, 7, 10, …) — hur många stavar har figur 10?',
        answer: '31',
        hint: 'Figur 1 har 4 stavar. Hur många steg om 3 stavar tar du för att komma till figur 10?',
        solution: 'Från figur 1 till figur 10 är det 9 steg om 3 stavar: 4 + 9 × 3 = 4 + 27 = 31 stavar. (Formeln är 3n + 1.)',
      },
      {
        level: 'A',
        question: 'Med samma mönster (4, 7, 10, …) — vilken figur består av 61 stavar?',
        answer: '20',
        hint: 'Ställ upp en ekvation med formeln 3n + 1 = 61.',
        solution: 'Antalet stavar i figur n är 3n + 1. Lös 3n + 1 = 61 ⇒ 3n = 60 ⇒ n = 20. Figur 20 har 61 stavar.',
      },
    ],
  },
  {
    id: 'rp-scifi-sannolikhet',
    worldId: 'scifi',
    title: 'Rymdlotteriet',
    emoji: '🎲',
    context: 'Besättningen lottar uppdrag med tärningar och kulor i en påse.',
    topicIds: ['sannolikhet', 'brak-steg-2', 'statistik'],
    tags: ['Sannolikhet', 'Kombinatorik'],
    tasks: [
      {
        level: 'E',
        question: 'Vad är sannolikheten att slå en sexa med en vanlig tärning? Svara som ett bråk (t.ex. 1/6).',
        answer: '1/6',
        hint: 'Hur många utfall är gynnsamma och hur många är möjliga?',
        solution: 'Det finns 1 gynnsamt utfall (sexan) av 6 möjliga: sannolikheten är 1/6.',
      },
      {
        level: 'C',
        question: 'Två tärningar kastas. Hur många olika utfall finns det totalt?',
        answer: '36',
        hint: 'Varje tärning har 6 möjligheter. Kombinera dem.',
        solution: 'Första tärningen har 6 utfall och andra har 6 utfall: 6 × 6 = 36 möjliga utfall.',
      },
      {
        level: 'A',
        question: 'I en påse finns 3 röda och 5 blå kulor. Du drar 2 kulor utan att lägga tillbaka. Vad är sannolikheten att BÅDA är röda? Svara som ett bråk i enklaste form.',
        answer: '3/28',
        hint: 'Efter första dragningen finns det en kula mindre i påsen — och en röd mindre.',
        solution: 'P(första röd) = 3/8. Nu finns 2 röda kvar av 7 kulor: P(andra röd) = 2/7. Tillsammans: 3/8 × 2/7 = 6/56 = 3/28.',
      },
    ],
  },
  {
    id: 'rp-scifi-matdata',
    worldId: 'scifi',
    title: 'Sensordata',
    emoji: '📉',
    context: 'Sensorerna loggar mätvärden. Ibland blir ett värde extremt högt på grund av en störning.',
    topicIds: ['statistik-spridning', 'statistik', 'avrundning'],
    tags: ['Statistik', 'Extremvärden'],
    tasks: [
      {
        level: 'E',
        question: 'Sensorn mäter värdena 2, 4, 6, 8 och 10. Vad är medelvärdet?',
        answer: '6',
        hint: 'Summera alla värden och dela med antalet värden.',
        solution: '(2 + 4 + 6 + 8 + 10) ÷ 5 = 30 ÷ 5 = 6.',
      },
      {
        level: 'C',
        question: 'Sensorn mäter värdena 2, 4, 6, 8 och 10. Vad är medianen?',
        answer: '6',
        hint: 'Sortera värdena och hitta det mittersta.',
        solution: 'Värdena i ordning: 2, 4, 6, 8, 10. Det mittersta (tredje) värdet är 6. Här är medelvärde och median lika.',
      },
      {
        level: 'A',
        question: 'I datamängden 2, 4, 6, 8, 10 ersätts värdet 10 med 100 på grund av en störning. Hur mycket ÖKAR medelvärdet?',
        answer: '18',
        hint: 'Räkna ut det nya medelvärdet och jämför med det gamla (som var 6).',
        solution: 'Nytt medelvärde: (2 + 4 + 6 + 8 + 100) ÷ 5 = 120 ÷ 5 = 24. Ökningen är 24 − 6 = 18. Medianen hade däremot varit oförändrad (6) — medianen är okänslig för extremvärden.',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // RYMD AKADEMIN (Nivå 10)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'rp-gym-tillvaxt',
    worldId: 'gym',
    title: 'Bakteriekulturen',
    emoji: '🦠',
    context: 'I laboratoriet växer en bakteriekultur exponentiellt och forskarna följer utvecklingen.',
    topicIds: ['exponentialfunktioner', 'logaritmer', 'potenslagar-gym'],
    tags: ['Exponentialfunktioner', 'Logaritmer'],
    tasks: [
      {
        level: 'E',
        question: 'En bakteriekultur fördubblas varje timme. Från 100 bakterier — hur många finns efter 3 timmar?',
        answer: '800',
        hint: 'Fördubbla en gång per timme: 100 → 200 → …',
        solution: '100 → 200 → 400 → 800. Efter 3 timmar finns 800 bakterier. (100 · 2³ = 800.)',
      },
      {
        level: 'C',
        question: 'Antalet bakterier ges av y = 100 · 2^t, där t är antal timmar. Efter hur många timmar är y = 1600?',
        answer: '4',
        hint: 'Dela båda leden med 100 först. Vilken exponent ger 16?',
        solution: '100 · 2^t = 1600 ⇒ 2^t = 16 ⇒ t = 4 (eftersom 2⁴ = 16).',
      },
      {
        level: 'A',
        question: 'En kultur växer enligt y = 500 · 1,2^t. Efter hur många HELA timmar överstiger antalet 1000 för första gången?',
        answer: '4',
        hint: 'Lös 1,2^t = 2 med logaritmer och avrunda sedan uppåt till närmaste hela timme.',
        solution: '500 · 1,2^t > 1000 ⇒ 1,2^t > 2 ⇒ t > lg 2 / lg 1,2 ≈ 0,3010 / 0,0792 ≈ 3,80. Första hela timmen där olikheten gäller är t = 4. Kontroll: 500 · 1,2³ ≈ 864 (< 1000) och 500 · 1,2⁴ ≈ 1037 (> 1000) ✓',
      },
    ],
  },
  {
    id: 'rp-gym-optimering',
    worldId: 'gym',
    title: 'Största arean',
    emoji: '📏',
    context: 'Ingenjörerna vill utnyttja ett begränsat material så effektivt som möjligt.',
    topicIds: ['derivata', 'funktioner', 'ekvationer-gym'],
    tags: ['Derivata', 'Optimering'],
    tasks: [
      {
        level: 'E',
        question: 'f(x) = x². Vad är f′(3)?',
        answer: '6',
        hint: 'Derivatan av x² är 2x.',
        solution: 'f′(x) = 2x, alltså f′(3) = 2 × 3 = 6.',
      },
      {
        level: 'C',
        question: 'f(x) = x² − 6x + 5. För vilket x har funktionen sitt minimum?',
        answer: '3',
        hint: 'I en extrempunkt är derivatan noll. Derivera och lös f′(x) = 0.',
        solution: 'f′(x) = 2x − 6. Sätt 2x − 6 = 0 ⇒ x = 3. Eftersom x²-termen är positiv är detta ett minimum.',
      },
      {
        level: 'A',
        question: 'En rektangel har omkretsen 40 m. Vilken är den största möjliga arean? (svara i m²)',
        answer: '100',
        hint: 'Kalla ena sidan x. Uttryck den andra sidan och arean med hjälp av x, och derivera sedan.',
        solution: 'Omkrets 40 ⇒ x + y = 20 ⇒ y = 20 − x. Area: A(x) = x(20 − x) = 20x − x². A′(x) = 20 − 2x = 0 ⇒ x = 10, alltså y = 10. Största arean: 10 × 10 = 100 m² (en kvadrat).',
      },
    ],
  },
  {
    id: 'rp-gym-trigonometri',
    worldId: 'gym',
    title: 'Höjdmätning',
    emoji: '📡',
    context: 'Med hjälp av vinklar och trigonometri mäts höjder och lutningar utan att man klättrar.',
    topicIds: ['trigonometri', 'funktioner'],
    tags: ['Trigonometri', 'Rätvinklig triangel'],
    tasks: [
      {
        level: 'E',
        question: 'Vad är sin(30°)? Svara som decimaltal.',
        answer: '0,5',
        acceptableAnswers: ['0.5', '1/2', '0,50', '0.50'],
        hint: 'Detta är ett av standardvärdena som är bra att kunna utantill.',
        solution: 'sin(30°) = 0,5 (exakt 1/2).',
      },
      {
        level: 'C',
        question: 'I en rätvinklig triangel är hypotenusan 10 och en vinkel 30°. Hur lång är kateten som är motstående till 30°-vinkeln?',
        answer: '5',
        hint: 'Använd sin v = motstående katet / hypotenusan.',
        solution: 'sin(30°) = motstående / 10 ⇒ motstående = 10 × sin(30°) = 10 × 0,5 = 5.',
      },
      {
        level: 'A',
        question: 'En 5 m lång stege lutar mot en vägg och når 4 m upp på väggen. Vilken vinkel bildar stegen med marken? (svara i hela grader)',
        answer: '53',
        hint: 'Väggen (4 m) är motstående katet och stegen (5 m) är hypotenusan. Använd arcsin.',
        solution: 'sin v = 4/5 = 0,8 ⇒ v = arcsin(0,8) ≈ 53,13° ≈ 53°.',
      },
    ],
  },
  {
    id: 'rp-gym-talfoljd',
    worldId: 'gym',
    title: 'Talföljden i signalen',
    emoji: '🔢',
    context: 'En signal från rymden består av tal i en aritmetisk talföljd: 3, 7, 11, 15, …',
    topicIds: ['talfoljder', 'funktioner', 'rata-linjen-gym'],
    tags: ['Talföljder', 'Summor'],
    tasks: [
      {
        level: 'E',
        question: 'Talföljden är 3, 7, 11, 15, … Vilket är nästa tal?',
        answer: '19',
        hint: 'Hur mycket ökar talen varje steg?',
        solution: 'Differensen är 4, så nästa tal är 15 + 4 = 19.',
      },
      {
        level: 'C',
        question: 'I talföljden 3, 7, 11, 15, … — vilken är den 20:e termen?',
        answer: '79',
        hint: 'Använd formeln aₙ = a₁ + (n − 1) · d med a₁ = 3 och d = 4.',
        solution: 'a₂₀ = 3 + (20 − 1) × 4 = 3 + 76 = 79.',
      },
      {
        level: 'A',
        question: 'Vad är summan av de 20 första termerna i talföljden 3, 7, 11, 15, …?',
        answer: '820',
        hint: 'Summan av en aritmetisk talföljd är antalet termer gånger medelvärdet av första och sista termen.',
        solution: 'Sₙ = n/2 · (a₁ + aₙ) = 20/2 × (3 + 79) = 10 × 82 = 820.',
      },
    ],
  },
  {
    id: 'rp-gym-kombinatorik',
    worldId: 'gym',
    title: 'Uppdragsgruppen',
    emoji: '👥',
    context: 'Ur besättningen ska grupper sättas samman för olika uppdrag.',
    topicIds: ['kombinatorik', 'sannolikhet'],
    tags: ['Kombinatorik', 'Urval'],
    tasks: [
      {
        level: 'E',
        question: 'På hur många olika sätt kan 3 personer ställa sig i en kö?',
        answer: '6',
        hint: 'Första platsen kan fyllas på 3 sätt, andra på 2 sätt …',
        solution: '3! = 3 × 2 × 1 = 6 sätt.',
      },
      {
        level: 'C',
        question: 'Ur 5 personer ska 2 väljas till ett uppdrag. Ordningen spelar ingen roll. På hur många sätt kan det göras?',
        answer: '10',
        hint: 'Använd binomialkoefficienten C(5,2) = 5!/(2!·3!).',
        solution: 'C(5,2) = (5 × 4)/(2 × 1) = 20/2 = 10 sätt.',
      },
      {
        level: 'A',
        question: 'Ur 8 personer ska en kommitté på 3 väljas. Två av personerna vägrar dock sitta i kommittén tillsammans. Hur många möjliga kommittéer finns det?',
        answer: '50',
        hint: 'Räkna först alla möjliga kommittéer. Dra sedan bort de kommittéer där båda de osams personerna ingår.',
        solution: 'Totalt: C(8,3) = 56 kommittéer. De där båda ingår: de två är redan valda, så den tredje väljs bland resterande 6 → C(6,1) = 6. Antal godkända: 56 − 6 = 50.',
      },
    ],
  },
  {
    id: 'rp-gym-logaritmer',
    worldId: 'gym',
    title: 'Signalstyrkan',
    emoji: '🔊',
    context: 'Signalstyrka mäts logaritmiskt, eftersom värdena spänner över många storleksordningar.',
    topicIds: ['logaritmer', 'potenslagar-gym', 'exponentialfunktioner'],
    tags: ['Logaritmer', 'Logaritmlagar'],
    tasks: [
      {
        level: 'E',
        question: 'Vad är lg(1000)?',
        answer: '3',
        hint: 'Frågan är: 10 upphöjt till vad blir 1000?',
        solution: 'lg(1000) = 3 eftersom 10³ = 1000.',
      },
      {
        level: 'C',
        question: 'Räkna ut lg(2) + lg(50).',
        answer: '2',
        hint: 'Logaritmlagen lg a + lg b = lg(a · b).',
        solution: 'lg(2) + lg(50) = lg(2 × 50) = lg(100) = 2.',
      },
      {
        level: 'A',
        question: 'Lös ekvationen 2^x = 50. Svara avrundat till 2 decimaler.',
        answer: '5,64',
        acceptableAnswers: ['5.64'],
        hint: 'Logaritmera båda leden och använd lagen lg(a^x) = x · lg a.',
        solution: 'lg(2^x) = lg 50 ⇒ x · lg 2 = lg 50 ⇒ x = lg 50 / lg 2 ≈ 1,6990 / 0,3010 ≈ 5,64.',
      },
    ],
  },
  {
    id: 'rp-gym-kastbana',
    worldId: 'gym',
    title: 'Sondens kastbana',
    emoji: '🚀',
    context: 'En sond skjuts upp och dess höjd över marken ges av h(t) = −5t² + 20t, där t är tiden i sekunder.',
    topicIds: ['ekvationer-gym', 'funktioner', 'derivata'],
    tags: ['Andragradsfunktion', 'Modellering'],
    tasks: [
      {
        level: 'E',
        question: 'h(t) = −5t² + 20t. Vilken höjd har sonden när t = 1? (svara i meter)',
        answer: '15',
        hint: 'Sätt in t = 1 i uttrycket.',
        solution: 'h(1) = −5 × 1² + 20 × 1 = −5 + 20 = 15 m.',
      },
      {
        level: 'C',
        question: 'h(t) = −5t² + 20t. Vid vilken tid landar sonden igen, alltså när h(t) = 0 (bortsett från t = 0)? (svara i sekunder)',
        answer: '4',
        hint: 'Bryt ut t ur uttrycket och använd nollproduktmetoden.',
        solution: '−5t² + 20t = 0 ⇒ t(−5t + 20) = 0 ⇒ t = 0 eller −5t + 20 = 0 ⇒ t = 4. Sonden landar efter 4 sekunder.',
      },
      {
        level: 'A',
        question: 'h(t) = −5t² + 20t. Vilken är sondens maximala höjd? (svara i meter)',
        answer: '20',
        hint: 'Maxpunkten ligger mitt emellan nollställena — eller lös h′(t) = 0.',
        solution: 'h′(t) = −10t + 20 = 0 ⇒ t = 2. Höjden då: h(2) = −5 × 4 + 20 × 2 = −20 + 40 = 20 m. (Symmetri: maxpunkten ligger mitt emellan nollställena t = 0 och t = 4, alltså vid t = 2.)',
      },
    ],
  },
  {
    id: 'rp-gym-spridning',
    worldId: 'gym',
    title: 'Mätseriernas spridning',
    emoji: '📊',
    context: 'Två mätserier kan ha samma medelvärde men vara olika utspridda.',
    topicIds: ['statistik-gym', 'rimlighetsoevningar-gym'],
    tags: ['Statistik', 'Spridning'],
    tasks: [
      {
        level: 'E',
        question: 'Datamängden är 2, 4, 6 och 8. Vad är medelvärdet?',
        answer: '5',
        hint: 'Summera och dela med antalet värden.',
        solution: '(2 + 4 + 6 + 8) ÷ 4 = 20 ÷ 4 = 5.',
      },
      {
        level: 'C',
        question: 'Vad är variationsbredden för datamängden 3, 7, 12 och 5?',
        answer: '9',
        hint: 'Variationsbredden är skillnaden mellan största och minsta värdet.',
        solution: 'Största värdet är 12 och minsta är 3: 12 − 3 = 9.',
      },
      {
        level: 'A',
        question: 'Två datamängder har samma medelvärde 10. A: 9, 10, 11. B: 5, 10, 15. Vilken har störst standardavvikelse? (svara A eller B)',
        answer: 'B',
        acceptableAnswers: ['b'],
        hint: 'Standardavvikelsen mäter hur långt värdena i genomsnitt ligger från medelvärdet.',
        solution: 'I A avviker värdena 1, 0 och 1 från medelvärdet. I B avviker de 5, 0 och 5. Eftersom värdena i B ligger mycket längre från medelvärdet har B störst standardavvikelse. (σ_A ≈ 0,82 och σ_B ≈ 4,08.)',
      },
    ],
  },
];

// ─── Hjälpfunktioner ────────────────────────────────────────────────────────────

export function getProblemsForWorld(worldId: WorldId): RichProblem[] {
  return RICH_PROBLEMS.filter(p => p.worldId === worldId);
}

export const PROBLEM_MAP: Record<string, RichProblem> = Object.fromEntries(
  RICH_PROBLEMS.map(p => [p.id, p])
);

/** Normaliserar ett svar för jämförelse: gemener, komma → punkt, mellanslag bort. */
export function normalizeAnswer(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, '').replace(',', '.');
}

export function isAnswerCorrect(task: ProblemTask, given: string): boolean {
  const g = normalizeAnswer(given);
  if (!g) return false;
  if (g === normalizeAnswer(task.answer)) return true;
  return (task.acceptableAnswers ?? []).some(a => normalizeAnswer(a) === g);
}
