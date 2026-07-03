// Module 10 – Sök i sidled (lateral läsning)

export interface LateralStep {
  key: string;
  icon: string;
  title: string;
  question: string;
  desc: string;
  checks: string[];
}

export interface Module10Question {
  id: string;
  imageEmoji: string;
  imageBg: string;
  scenario: string;
  question: string;
  options: { id: string; text: string }[];
  correctId: string;
  explanation: string;
  tip: string;
  discussionPrompt: string;
}

export const LATERAL_STEPS: LateralStep[] = [
  {
    key: 'stanna',
    icon: '🛑',
    title: 'Stanna upp',
    question: 'Väcker det starka känslor?',
    desc: 'Innehåll som gör dig arg, rädd eller överraskad är ofta designat för att delas snabbt – inte för att vara sant. Starka känslor är ett varningstecken, inte ett bevis.',
    checks: [
      'Blir du arg, rädd eller chockad? Det är ofta meningen',
      'Vill någon att du ska dela vidare snabbt?',
      'Vänta med att gilla och dela tills du har kollat',
    ],
  },
  {
    key: 'flik',
    icon: '🗂️',
    title: 'Öppna en ny flik',
    question: 'Lämna sidan!',
    desc: 'Professionella faktagranskare läser inte mer PÅ sidan för att bedöma den – de lämnar den. En oseriös sajt berättar aldrig själv att den är oseriös. Svaret finns hos andra.',
    checks: [
      'Läs inte bara "Om oss"-sidan – den skriver källan själv',
      'Öppna en ny flik bredvid den du granskar',
      'Sök efter information OM källan, inte FRÅN källan',
    ],
  },
  {
    key: 'sok',
    icon: '🔎',
    title: 'Sök på avsändaren',
    question: 'Vad säger andra?',
    desc: 'Sök på källans namn tillsammans med ord som "kritik" eller "granskning". Kolla vad oberoende sajter, uppslagsverk och nyhetsmedier säger om avsändaren.',
    checks: [
      'Sök: källans namn + "kritik" eller "granskning"',
      'Finns källan beskriven på Wikipedia eller i nyhetsmedier?',
      'Hittar du ingenting alls om källan? Var extra försiktig',
    ],
  },
];

export const MODULE10_QUESTIONS: Module10Question[] = [
  {
    id: 'm10-1',
    imageEmoji: '🌐',
    imageBg: 'from-lime-100 to-green-100',
    scenario: 'En kompis skickar en länk till sajten "FriskaLiv.nu" med en sensationell hälsonyhet. Du har aldrig hört talas om sajten.',
    question: 'Vad gör du FÖRST för att bedöma om sajten går att lita på?',
    options: [
      { id: 'a', text: 'Läser fler artiklar på sajten för att få en känsla för den' },
      { id: 'b', text: 'Läser sajtens "Om oss"-sida noggrant' },
      { id: 'c', text: 'Öppnar en ny flik och söker på vad ANDRA säger om FriskaLiv.nu' },
      { id: 'd', text: 'Kollar om sajten har snygg och professionell design' },
    ],
    correctId: 'c',
    explanation: 'Att läsa mer på själva sajten kallas vertikal läsning – och det är så de flesta blir lurade. Professionella faktagranskare gör tvärtom: de lämnar sidan direkt och söker i sidled efter vad oberoende källor säger om avsändaren. Design och "Om oss"-texter kan vem som helst fejka.',
    tip: 'Sanningen om en källa finns nästan aldrig PÅ källan – den finns hos andra. Sök i sidled!',
    discussionPrompt: 'Hur gör ni idag när ni hamnar på en okänd sajt? Vad kommer ni att göra annorlunda?',
  },
  {
    id: 'm10-2',
    imageEmoji: '😡',
    imageBg: 'from-rose-100 to-orange-100',
    scenario: 'Ett inlägg i ditt flöde gör dig riktigt arg. Det påstår något upprörande om en grupp människor och har delats tusentals gånger.',
    question: 'Vad är det smartaste första steget?',
    options: [
      { id: 'a', text: 'Dela vidare så fler får veta' },
      { id: 'b', text: 'Skriva en arg kommentar direkt' },
      { id: 'c', text: 'Stanna upp – stark ilska är ett varningstecken. Kolla påståendet i en ny flik innan du gör något' },
      { id: 'd', text: 'Blockera den som lagt upp inlägget' },
    ],
    correctId: 'c',
    explanation: 'Desinformation är ofta designad för att väcka ilska – arga människor delar snabbare och tänker långsammare. Att du blir upprörd är exakt vad avsändaren vill. Stanna upp, andas, och faktakolla i en ny flik innan du reagerar.',
    tip: 'Ju starkare känsla ett inlägg väcker, desto viktigare att stanna upp innan du delar.',
    discussionPrompt: 'Varför sprids upprörande innehåll snabbare än lugnt innehåll? Vem tjänar på det?',
  },
  {
    id: 'm10-3',
    imageEmoji: '📋',
    imageBg: 'from-sky-100 to-cyan-100',
    scenario: 'På sajten du granskar står det på "Om oss"-sidan: "Vi är en oberoende och faktagranskad nyhetskälla med fokus på sanningen."',
    question: 'Räcker det för att lita på sajten?',
    options: [
      { id: 'a', text: 'Ja – de skriver ju själva att de är faktagranskade' },
      { id: 'b', text: 'Nej – det är källans egen beskrivning av sig själv. Du måste kolla vad OBEROENDE källor säger' },
      { id: 'c', text: 'Ja, om sidan dessutom har många läsare' },
      { id: 'd', text: 'Nej – "Om oss"-sidor är alltid lögn' },
    ],
    correctId: 'b',
    explanation: 'Vem som helst kan skriva "oberoende och faktagranskad" på sin egen sida – det kostar ingenting. Ord som "sanningen" i självbeskrivningen är snarare ett varningstecken. Men "Om oss"-sidor är inte alltid lögn – de ska bara aldrig vara ditt enda underlag. Bekräfta med oberoende källor.',
    tip: 'Källans egen beskrivning av sig själv är ett påstående, inte ett bevis. Kolla i sidled.',
    discussionPrompt: 'Hur skulle NI skriva en "Om oss"-sida för att verka trovärdiga? Vad säger det om hur lätt det är att fejka?',
  },
  {
    id: 'm10-4',
    imageEmoji: '📰',
    imageBg: 'from-violet-100 to-purple-100',
    scenario: 'Du söker i sidled på sajten och hittar en artikel från en känd dagstidning som granskat sajten – och kommit fram till att den sprider falsk hälsoinformation.',
    question: 'Hur bör du väga den informationen?',
    options: [
      { id: 'a', text: 'Tidningen är nog bara avundsjuk på sajten' },
      { id: 'b', text: 'En oberoende granskning från en redaktionell källa väger tungt – sajten är troligen opålitlig' },
      { id: 'c', text: 'Det står 50/50 – en säger si, en säger så' },
      { id: 'd', text: 'Granskningar spelar ingen roll, alla får tycka vad de vill' },
    ],
    correctId: 'b',
    explanation: 'Alla källor är inte lika mycket värda. En redaktionell granskning – där journalister kollat fakta och en ansvarig utgivare kan ställas till svars – väger mycket tyngre än sajtens egna påståenden. Det är inte "50/50" bara för att två källor säger olika saker.',
    tip: 'Väg källorna, räkna dem inte. En oberoende granskning slår tio egna påståenden.',
    discussionPrompt: 'Varför är det inte "50/50" när två källor säger emot varandra? Hur avgör man vilken som väger tyngst?',
  },
  {
    id: 'm10-5',
    imageEmoji: '📷',
    imageBg: 'from-amber-100 to-yellow-100',
    scenario: 'En dramatisk bild delas med texten "JUST NU: detta händer i din stad!". Något känns fel – men det är en bild, inte en text.',
    question: 'Hur söker man i sidled på en BILD?',
    options: [
      { id: 'a', text: 'Det går inte – bilder kan inte kollas' },
      { id: 'b', text: 'Använd omvänd bildsökning (t.ex. Google Bilder eller Google Lens) för att se var bilden dykt upp tidigare' },
      { id: 'c', text: 'Fråga i kommentarsfältet om bilden är äkta' },
      { id: 'd', text: 'Zooma in och leta pixlar' },
    ],
    correctId: 'b',
    explanation: 'Ett av de vanligaste tricken är att återanvända GAMLA bilder i nya sammanhang – en bild från en annan händelse, ett annat land eller ett annat år. Omvänd bildsökning visar var och när bilden funnits på nätet tidigare, och avslöjar tricket på sekunder.',
    tip: 'Högerklicka på bilden och välj "Sök med Google Lens" – eller ladda upp den på images.google.com.',
    discussionPrompt: 'Varför är en äkta bild i fel sammanhang nästan mer lömsk än en AI-fejkad bild?',
  },
  {
    id: 'm10-6',
    imageEmoji: '🕳️',
    imageBg: 'from-zinc-100 to-slate-100',
    scenario: 'Du söker i sidled på en sajt som sprider uppseendeväckande nyheter – men hittar ingen information alls om vem som står bakom. Ingen Wikipedia-sida, inga artiklar, ingenting.',
    question: 'Vad betyder tystnaden?',
    options: [
      { id: 'a', text: 'Sajten är trovärdig – ingen har ju klagat på den' },
      { id: 'b', text: 'Var extra försiktig – en seriös avsändare brukar gå att hitta information om. Okänd avsändare + sensationella nyheter är en tydlig varningsflagg' },
      { id: 'c', text: 'Sajten är ny och därför extra pålitlig' },
      { id: 'd', text: 'Det spelar ingen roll vem som står bakom en sajt' },
    ],
    correctId: 'b',
    explanation: 'Att ingen skrivit något om källan är också ett svar. Etablerade medier, myndigheter och organisationer går alltid att hitta information om. En sajt som sprider stora nyheter men som ingen känner till är en klassisk varningsflagg – seriösa avsändare gömmer sig inte.',
    tip: 'Hittar du ingenting om avsändaren? Behandla innehållet som obekräftat tills en känd källa säger samma sak.',
    discussionPrompt: 'Om en nyhet vore sann och viktig – var skulle den mer synas? Vad betyder det när den bara finns på ETT ställe?',
  },
];
