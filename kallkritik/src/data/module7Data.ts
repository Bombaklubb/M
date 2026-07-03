export interface Module7Question {
  id: string;
  scenario: string;
  source: string;
  sourceType: string;
  sourceIcon: string;
  question: string;
  options: { id: string; text: string }[];
  correctId: string;
  explanation: string;
  tip: string;
  criterion: 'äkthet' | 'aktualitet' | 'oberoende' | 'tendens';
  discussionPrompt?: string;
}

export const FOUR_QUESTIONS = [
  {
    key: 'äkthet',
    icon: '🪪',
    title: 'Äkthet',
    question: 'Vem står bakom?',
    desc: 'Är avsändaren verklig och tydlig? Finns namn, kontakt och organisation?',
    color: 'bg-violet-100 border-violet-300 text-violet-700',
  },
  {
    key: 'aktualitet',
    icon: '🗓️',
    title: 'Aktualitet',
    question: 'När publicerades det?',
    desc: 'Är informationen aktuell? Gammal info kan vara inaktuell eller ändrad.',
    color: 'bg-sky-100 border-sky-300 text-sky-700',
  },
  {
    key: 'oberoende',
    icon: '🔗',
    title: 'Oberoende',
    question: 'Är källan oberoende?',
    desc: 'Baseras informationen på andra källor? Bekräftar flera oberoende källor samma sak?',
    color: 'bg-emerald-100 border-emerald-300 text-emerald-700',
  },
  {
    key: 'tendens',
    icon: '🎯',
    title: 'Tendens',
    question: 'Vilket syfte har källan?',
    desc: 'Vill källan sälja, övertyga eller informera? Vinklas informationen på något sätt?',
    color: 'bg-amber-100 border-amber-300 text-amber-700',
  },
];

export const MODULE7_QUESTIONS: Module7Question[] = [
  {
    id: 'm7-1',
    discussionPrompt: 'Hur skulle en seriös sajt om klimat visa vem som står bakom? Ge exempel.',
    scenario: 'Du söker fakta om klimatförändringar och hittar en artikel utan angiven författare på en sida som heter "SannaFakta.se". Det finns ingen "Om oss"-sida och inga kontaktuppgifter.',
    source: 'SannaFakta.se',
    sourceType: 'Okänd webbsida',
    sourceIcon: '🌐',
    question: 'Vilket källkritiskt problem är störst här?',
    options: [
      { id: 'a', text: 'Artikeln kan vara för gammal' },
      { id: 'b', text: 'Det går inte att avgöra vem som skrivit eller ansvarar för innehållet' },
      { id: 'c', text: 'Ämnet klimat är för komplext för en webbsida' },
      { id: 'd', text: 'Webbsidan borde ha fler artiklar' },
    ],
    correctId: 'b',
    explanation: 'En källa utan tydlig avsändare är svår att granska. Du vet inte om skribenten har kunskap, intressen eller agenda. "SannaFakta" i namnet är inte ett bevis på trovärdighet — vem som helst kan namnge sin sida så.',
    tip: 'Fråga alltid: Vem tjänar på att jag tror på detta?',
    criterion: 'äkthet',
  },
  {
    id: 'm7-2',
    discussionPrompt: 'Hur gammal får information vara? Beror det på ämnet – jämför t.ex. historia med teknik.',
    scenario: 'En vän delar en länk om en ny "mirakelkur mot förkylning". Artikeln är skriven 2009 och hänvisar till en studie från 1998. Texten skriver att "forskning visar" utan att namnge studien.',
    source: 'HälsoTips24.com',
    sourceType: 'Hälsoblogg',
    sourceIcon: '💊',
    question: 'Vilka TWÅ problem finns med den här källan? (Välj det mest kompletta svaret)',
    options: [
      { id: 'a', text: 'Informationen är gammal och det saknas källhänvisning till den nämnda studien' },
      { id: 'b', text: 'Artikeln handlar om förkylning, inte en allvarlig sjukdom' },
      { id: 'c', text: 'Det är en hälsoblogg, alla hälsobloggar ljuger' },
      { id: 'd', text: 'Webbsidan heter HälsoTips24, inte något vetenskapligt' },
    ],
    correctId: 'a',
    explanation: 'Medicinsk forskning förändras snabbt — 15+ år gammal info kan vara motbevisad. Och "forskning visar" utan källa är meningslöst, det kan inte kontrolleras. En seriös källa anger alltid vilken forskning den refererar till.',
    tip: 'Ju viktigare påståendet är för din hälsa, desto viktigare att källorna är aktuella och kontrollerbara.',
    criterion: 'aktualitet',
  },
  {
    id: 'm7-3',
    discussionPrompt: 'Betyder ekonomiskt intresse att företaget ljuger? Hur bör man tänka i stället?',
    scenario: 'Du läser om ett kontrovers kring ett läkemedel. Tre nyhetsartiklar från SVT, The Guardian och NRK beskriver alla samma problem. En artikel från läkemedelsföretagets egna hemsida säger att läkemedlet är helt säkert.',
    source: 'LäkemedelsföretagetAB.se',
    sourceType: 'Företagets egna hemsida',
    sourceIcon: '🏢',
    question: 'Varför ska du vara extra kritisk mot företagets artikel?',
    options: [
      { id: 'a', text: 'Företag har alltid fel om sina egna produkter' },
      { id: 'b', text: 'Företaget har ett ekonomiskt intresse av att läkemedlet framstår som säkert — det är inte en oberoende källa' },
      { id: 'c', text: 'SVT har alltid rätt eftersom det är public service' },
      { id: 'd', text: 'Tre artiklar väger alltid tyngre än en' },
    ],
    correctId: 'b',
    explanation: 'En källa som tjänar pengar på ett påstående är inte oberoende. Det betyder inte att de ljuger, men du bör ställa dig extra kritisk. Tre oberoende källor (SVT, Guardian, NRK) som säger samma sak utan gemensamt intresse är ett starkare tecken på sanning.',
    tip: 'Fråga alltid: Har den som skrivit detta något att vinna på att du tror dem?',
    criterion: 'oberoende',
  },
  {
    id: 'm7-4',
    discussionPrompt: 'Kan man ljuga med sann statistik? Hur skyddar man sig mot halva sanningar?',
    scenario: 'En hemsida publicerar statistik om invandring. Siffrorna stämmer, men artikeln väljer bara ut de negativa statistikarna och nämner aldrig de positiva. Rubriken lyder: "Sanningen de inte vill att du ska veta."',
    source: 'SanningsBladet.se',
    sourceType: 'Opinionswebbplats',
    sourceIcon: '📢',
    question: 'Vad är problemet — trots att siffrorna är korrekta?',
    options: [
      { id: 'a', text: 'Statistik är alltid opålitlig' },
      { id: 'b', text: 'Rubriken är för lång' },
      { id: 'c', text: 'Sann statistik kan användas för att skapa en vinklad och missvisande bild om man bara väljer ut delar av fakta' },
      { id: 'd', text: 'Det är fel att skriva om invandring' },
    ],
    correctId: 'c',
    explanation: 'Selektiv fakta — att plocka ut sanna uppgifter som bara stöder en sida — är en av de vanligaste formerna av desinformation. Rubriken "sanningen de inte vill att du ska veta" är ett klassiskt tecken på att källan vill provocera och övertyga snarare än informera.',
    tip: 'Korrekt fakta kan ändå vara vilseledande om den är selektivt vald. Helhetsbild är lika viktig som enskilda fakta.',
    criterion: 'tendens',
  },
  {
    id: 'm7-5',
    discussionPrompt: 'Hur använder ni Wikipedia i skolan idag? Vad kommer ni göra annorlunda efter den här frågan?',
    scenario: 'Du hittar en Wikipedia-artikel om en historisk händelse. Den är välskriven, har 47 källhänvisningar och senast redigerades för 2 dagar sedan. Du ser att ämnet är "omtvistat" enligt en banner längst upp.',
    source: 'Wikipedia',
    sourceType: 'Fri encyklopedi',
    sourceIcon: '📖',
    question: 'Hur bör du använda den här källan?',
    options: [
      { id: 'a', text: 'Lita fullt ut — Wikipedia granskas alltid av experter' },
      { id: 'b', text: 'Ignorera den helt — Wikipedia kan aldrig användas' },
      { id: 'c', text: 'Använd den som startpunkt för att hitta de ursprungliga källhänvisningarna och kontrollera dem' },
      { id: 'd', text: 'Kopiera informationen direkt utan att tänka mer på det' },
    ],
    correctId: 'c',
    explanation: 'Wikipedia är ett utmärkt verktyg för att hitta ämnesöversikter och ledas vidare till primärkällor. Men vem som helst kan redigera det, och "omtvistat"-banners visar att innehållet diskuteras. Källhänvisningarna längst ner är ofta de verkligt värdefulla — de leder dig till originalforskarna.',
    tip: 'Wikipedia är en bra startpunkt, inte en slutpunkt. Följ alltid källhänvisningarna!',
    criterion: 'oberoende',
  },
  {
    id: 'm7-6',
    discussionPrompt: 'Varför stänger vissa annonsörer av kommentarsfältet? Vad vill de undvika?',
    scenario: 'En annons på Instagram påstår att en kändis rekommenderar ett kosttillskott och att "100% av användarna ser resultat på 2 veckor". Annonsen har ingen länk till studier och kommentarsfältet är avstängt.',
    source: 'Instagram-annons',
    sourceType: 'Betald reklam',
    sourceIcon: '📱',
    question: 'Vilka källkritiska röda flaggor syns här?',
    options: [
      { id: 'a', text: 'Bara att det är Instagram — sociala medier är alltid opålitliga' },
      { id: 'b', text: 'Omöjlig statistik (100%), okontrollerbar källa, betald reklam med dolt syfte och ingen möjlighet att ställa frågor' },
      { id: 'c', text: 'Kändisen kanske inte gillar produkten på riktigt' },
      { id: 'd', text: 'Produkten borde finnas på apotek för att vara trovärdig' },
    ],
    correctId: 'b',
    explanation: '"100% av användarna" är en statistisk omöjlighet och direkt manipulativt. Annonsen saknar källhänvisningar, har kommentarerna avstängda (ingen granskning möjlig) och är betald reklam — ett extremt partiskt syfte. Att en kändis rekommenderar något bevisar ingenting om produktens effekt.',
    tip: 'Fråga alltid: Betalas den här personen för att säga detta? Och: Kan jag kontrollera påståendet från en oberoende källa?',
    criterion: 'tendens',
  },
];
