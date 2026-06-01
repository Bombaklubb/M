export interface Module9Question {
  id: string;
  situation: string;
  studentAction: string;
  question: string;
  options: { id: string; text: string }[];
  correctId: string;
  explanation: string;
  tip: string;
  category: 'faktagranskning' | 'plagiat' | 'citat' | 'källkritik' | 'etik' | 'smart-anvandning';
}

export const CATEGORY_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
  'faktagranskning': { icon: '🔍', label: 'Faktagranskning', color: 'bg-amber-100 border-amber-300 text-amber-700' },
  'plagiat':         { icon: '📋', label: 'Plagiat',         color: 'bg-rose-100 border-rose-300 text-rose-700' },
  'citat':           { icon: '💬', label: 'Källhänvisning',  color: 'bg-sky-100 border-sky-300 text-sky-700' },
  'källkritik':      { icon: '⚖️', label: 'Källkritik',     color: 'bg-violet-100 border-violet-300 text-violet-700' },
  'etik':            { icon: '🤝', label: 'Etik',            color: 'bg-emerald-100 border-emerald-300 text-emerald-700' },
  'smart-anvandning':{ icon: '💡', label: 'Smart användning', color: 'bg-indigo-100 border-indigo-300 text-indigo-700' },
};

export const AI_FACTS = [
  { icon: '🧠', text: 'AI "hittar på" med självförtroende – det kallas hallucination.' },
  { icon: '📅', text: 'AI:s kunskaper är begränsade till ett visst datum. Händelser efter det vet AI inte om.' },
  { icon: '🌍', text: 'AI kan ha inbyggd snedvridning beroende på vilken data den tränats på.' },
  { icon: '📚', text: 'AI kan inte söka på internet i realtid (om det inte är inbyggt). Fakta kan vara föråldrade.' },
  { icon: '✍️', text: 'Att låta AI skriva din uppgift utan att berätta det är fusk – även om det inte kopieras från en person.' },
];

export const MODULE9_QUESTIONS: Module9Question[] = [
  {
    id: 'm9-1',
    situation: 'Du har läxa att skriva om klimatförändringarnas orsaker.',
    studentAction: 'Du frågar ChatGPT: "Vad orsakar klimatförändringar?" och kopierar svaret rakt in i ditt dokument.',
    question: 'Vad är problemet med det här?',
    options: [
      { id: 'a', text: 'Det är helt okej – AI är som ett lexikon' },
      { id: 'b', text: 'Du lämnar in AI:s text som din egen – det är plagiat och fusk, oavsett om det är en människa eller AI som skrivit det' },
      { id: 'c', text: 'Problemet är att ChatGPT kanske inte kan svenska' },
      { id: 'd', text: 'Det är okej om du ändrar några ord' },
    ],
    correctId: 'b',
    explanation: 'Att klistra in AI-genererad text som din egna utan att berätta att det är AI-skrivet är fusk – precis som att kopiera från en annan elevs uppsats. Det spelar ingen roll att AI inte är en "person". Du luras att tyckas ha lärt dig och tänkt något du inte gjort.',
    tip: 'Om du använder AI i ett skolarbete: berätta alltid hur, citera det som en källa, och se till att du förstår och kan förklara allt du lämnar in.',
    category: 'plagiat',
  },
  {
    id: 'm9-2',
    situation: 'Du skriver en historia-uppgift om Vikingarna.',
    studentAction: 'Du frågar AI: "Vilka är tre kända vikingahövdingar?" AI svarar med tre namn – inklusive "Ragnar Sigurdsson" som du inte känner igen. Du lämnar in utan att kolla.',
    question: 'Vad borde du ha gjort?',
    options: [
      { id: 'a', text: 'Litat på AI – den kan mer historia än Wikipedia' },
      { id: 'b', text: 'Valt bort det okända namnet och bara skrivit om de andra' },
      { id: 'c', text: 'Kontrollerat alla tre namnen mot en pålitlig källa som en historiebok eller ämnesspecifik sajt' },
      { id: 'd', text: 'Frågat AI igen – ett andra svar är alltid mer pålitligt' },
    ],
    correctId: 'c',
    explanation: 'AI kan "hitta på" namn och fakta med stort självförtroende – det kallas hallucination. "Ragnar Sigurdsson" kan vara en AI-uppfunnen person. Att fråga AI igen ger inte mer tillförlitligt svar. Du måste alltid kontrollera viktiga fakta mot en oberoende källa.',
    tip: 'AI är bra för att få en översikt och idéer – men varje faktapåstående du lämnar in i ett skolarbete måste du ha verifierat från en annan källa.',
    category: 'faktagranskning',
  },
  {
    id: 'm9-3',
    situation: 'Du skriver en rapport om rymden.',
    studentAction: 'Du använder AI som ett bollplank för att förstå hur svarta hål fungerar. Du läser AI:s förklaring, förstår den, och skriver sedan om det med egna ord – och lägger till en länk till NASA:s hemsida som extra källa.',
    question: 'Är det här rätt sätt att använda AI?',
    options: [
      { id: 'a', text: 'Nej – AI ska aldrig användas i skolarbete' },
      { id: 'b', text: 'Nej – du måste berätta att du använde AI, annars är det fusk' },
      { id: 'c', text: 'Ja, om du faktiskt förstått innehållet och verifierat med en riktig källa – det är ett smart och ärligt användande' },
      { id: 'd', text: 'Ja, men du behöver inte skriva med egna ord om AI-förklaringen var bra' },
    ],
    correctId: 'c',
    explanation: 'Det här är ett exempel på smart AI-användning: du använde AI för att FÖRSTÅ, inte för att kopiera. Du verifierade informationen mot NASA (en trovärdig källa) och du skriver med egna ord – det visar att du faktiskt lärt dig. Det kallas att använda AI som ett "studieredskap".',
    tip: 'AI är ett utmärkt verktyg för att förklara svåra koncept. Men se till att du förstår vad du läser, verifierar fakta, och skriver med egna ord.',
    category: 'smart-anvandning',
  },
  {
    id: 'm9-4',
    situation: 'Ni diskuterar aktuella händelser på SO-lektionen.',
    studentAction: 'Du frågar ChatGPT om senaste nytt om ett pågående krig. AI berättar säkert om händelser med datum och fakta.',
    question: 'Varför är AI en dålig källa för aktuella nyheter?',
    options: [
      { id: 'a', text: 'AI ljuger alltid om krig och politik' },
      { id: 'b', text: 'AI:s kunskap har ett "cutoff-datum" – den vet inte om händelser efter det datumet. Information om pågående händelser kan vara månader eller år gammal' },
      { id: 'c', text: 'AI är bra för nyheter men bara om man frågar flera gånger' },
      { id: 'd', text: 'Det spelar ingen roll om det är lite gammalt, fakta är fakta' },
    ],
    correctId: 'b',
    explanation: 'Alla AI-modeller tränas på data fram till ett visst datum (cutoff). Händelser efter det datumet vet AI ingenting om – men den kan fortfarande svara med låtsad säkerhet och blanda ihop gammalt med nytt. För aktuella nyheter: använd alltid nyhetsmedier som SVT, DN eller BBC.',
    tip: 'Fråga alltid: "Kan AI veta det här?" Om det handlar om något som hänt de senaste månaderna – använd en nyhetssajt istället.',
    category: 'källkritik',
  },
  {
    id: 'm9-5',
    situation: 'Du ber AI sammanfatta ett perspektiv på en samhällsfråga.',
    studentAction: 'AI ger ett utförligt svar som verkar balanserat. Du märker att AI alltid ger argument "för" men sällan nämner argument "emot" – och svaret låter nästan som en reklam för en viss lösning.',
    question: 'Vad händer troligen här?',
    options: [
      { id: 'a', text: 'AI har alltid rätt i samhällsfrågor' },
      { id: 'b', text: 'AI kan ha en inbyggd snedvridning (bias) i sin träningsdata som gör att vissa perspektiv premieras. Du bör aktivt leta efter motargument' },
      { id: 'c', text: 'Det är alltid rätt att lita på AI om svaret verkar genomtänkt' },
      { id: 'd', text: 'Om AI verkar balanserat är det balanserat' },
    ],
    correctId: 'b',
    explanation: 'AI tränas på data från internet – och internet är inte neutral. AI kan ha snedvridningar (bias) som gör att den favoriserar vissa perspektiv, kulturer eller åsikter. I samhällsfrågor är det extra viktigt att söka motargument aktivt och läsa olika perspektiv från mänskliga skribenter med olika bakgrunder.',
    tip: 'Fråga aktivt: "Vilka argument finns MOT det du säger?" eller "Hur ser motståndarna på det här?" Det tvingar AI att redovisa fler perspektiv.',
    category: 'källkritik',
  },
  {
    id: 'm9-6',
    situation: 'Du skriver en kreativ berättelse i svenska.',
    studentAction: 'Du har ett utkast men är fast. Du ber AI: "Ge mig 5 idéer på hur berättelsen kan sluta" och väljer en av idéerna som startpunkt – sedan skriver du slutet själv.',
    question: 'Är det här att fuska?',
    options: [
      { id: 'a', text: 'Ja – alla AI-idéer är fusk' },
      { id: 'b', text: 'Det beror på – om läraren säger att AI-hjälp är okej, och du skrivit det faktiska slutet själv, är det rimligt. Men fråga alltid läraren' },
      { id: 'c', text: 'Nej – det är precis samma sak som att brainstorma med en kompis' },
      { id: 'd', text: 'Nej – det spelar aldrig någon roll hur man fick idéerna' },
    ],
    correctId: 'b',
    explanation: 'Det beror helt på lärarens instruktioner och uppgiftens syfte. Om uppgiften är att träna DIN kreativitet är det problematiskt att låta AI ge idéerna – även om du skrivit texten. Om AI-hjälp är tillåtet och du är transparent om det kan det vara okej. Nyckeln är: Fråga läraren INNAN, och var ärlig om hur du använt AI.',
    tip: 'Gyllene regel: Om du är osäker på om du får använda AI – fråga läraren INNAN du börjar. Det är alltid bättre att fråga i förväg än att riskera fusk i efterhand.',
    category: 'etik',
  },
  {
    id: 'm9-7',
    situation: 'Du skriver ett arbete om klimat och har använt AI för att förstå begrepp och få strukturhjälp.',
    studentAction: 'Du skriver i källförteckningen: "ChatGPT, 2025" utan mer info.',
    question: 'Vad saknas i din källhänvisning till AI?',
    options: [
      { id: 'a', text: 'Ingenting – "ChatGPT, 2025" räcker' },
      { id: 'b', text: 'AI ska aldrig citeras som källa överhuvudtaget' },
      { id: 'c', text: 'Du bör ange: vilken AI-modell (ex. ChatGPT-4o), datum för konversationen, och helst vad du frågade – plus notera att AI-svar inte är peer-reviewed' },
      { id: 'd', text: 'Datum räcker – modellen spelar ingen roll' },
    ],
    correctId: 'c',
    explanation: 'En AI-källhänvisning bör innehålla: AI-modellens namn och version (ChatGPT-4o, Gemini 1.5, etc.), datum för konversationen (AI:s svar ändras över tid), och gärna en sammanfattning av vad du frågade. Dessutom bör du notera att AI-genererat innehåll inte är granskad forskning – och att du bör ha verifierat fakta mot andra källor.',
    tip: 'Exempel: "OpenAI ChatGPT-4o, konsulterad 15 maj 2025. Svar verifierat mot [annan källa]." Var transparent om att du använt AI.',
    category: 'citat',
  },
];
