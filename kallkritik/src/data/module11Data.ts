// Module 11 – Algoritmer & filterbubblor

export interface BubbleStep {
  key: string;
  icon: string;
  title: string;
  question: string;
  desc: string;
  checks: string[];
}

export interface Module11Question {
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

export const BUBBLE_STEPS: BubbleStep[] = [
  {
    key: 'algoritm',
    icon: '⚙️',
    title: 'Vad är en algoritm?',
    question: 'Den visar det du stannar vid',
    desc: 'Algoritmen är ett datorprogram som väljer vad du ska se i ditt flöde. Den lär sig av allt du gör: vad du tittar klart på, gillar, kommenterar – till och med hur länge du stannar på ett inlägg. Målet är inte att informera dig, utan att hålla dig kvar i appen.',
    checks: [
      'Allt du gillar, delar och tittar klart på blir en signal',
      'Även att STANNA vid ett inlägg räknas – utan att du gillar det',
      'Algoritmens mål är din tid, inte din kunskap',
    ],
  },
  {
    key: 'bubbla',
    icon: '🫧',
    title: 'Filterbubblan',
    question: 'Alla ser olika flöden',
    desc: 'Eftersom algoritmen visar mer av det du redan gillar, hamnar du så småningom i en bubbla där nästan allt bekräftar det du redan tycker och intresserar dig för. Din kompis flöde kan se helt annorlunda ut – fast ni använder samma app.',
    checks: [
      'Ditt flöde är byggt för DIG – ingen annan ser samma sak',
      'Åsikter du inte håller med om sorteras sakta bort',
      'Det känns som att "alla" tycker som du – men det är bubblan som talar',
    ],
  },
  {
    key: 'bryt',
    icon: '🧭',
    title: 'Bryt bubblan',
    question: 'Sök andra perspektiv',
    desc: 'Du kan inte stänga av algoritmen – men du kan lura den och vidga ditt flöde. Sök aktivt på ämnen du inte brukar följa, läs nyheter från olika källor och var medveten om att ditt flöde bara visar en liten del av verkligheten.',
    checks: [
      'Följ källor med olika perspektiv – inte bara de du håller med',
      'Sök aktivt i stället för att bara skrolla flödet',
      'Fråga dig: Vad visas INTE i mitt flöde?',
    ],
  },
];

export const MODULE11_QUESTIONS: Module11Question[] = [
  {
    id: 'm11-1',
    imageEmoji: '🔁',
    imageBg: 'from-fuchsia-100 to-purple-100',
    scenario: 'Du tittade på tre videor om en fotbollsspelare i går. Idag är halva ditt flöde fullt av videor om samma spelare.',
    question: 'Varför händer det här?',
    options: [
      { id: 'a', text: 'Slumpen – flödet är alltid blandat' },
      { id: 'b', text: 'Algoritmen märkte att du tittade klart på videorna och visar mer av samma sak för att hålla dig kvar' },
      { id: 'c', text: 'Spelaren har betalat för att synas i just ditt flöde' },
      { id: 'd', text: 'Appen visar samma innehåll för alla användare' },
    ],
    correctId: 'b',
    explanation: 'Algoritmen registrerade att du tittade klart – en av de starkaste signalerna. Den drar slutsatsen "mer av det här = mer tid i appen" och fyller ditt flöde. Det är inte slump och inte samma för alla: flödet formas av exakt det DU gör.',
    tip: 'Ditt flöde är en spegel av ditt beteende – inte en bild av vad som är viktigt eller sant.',
    discussionPrompt: 'Testa: jämför era flöden två och två. Hur olika är de? Vad säger det om vad ni gjort i appen?',
  },
  {
    id: 'm11-2',
    imageEmoji: '🔥',
    imageBg: 'from-orange-100 to-rose-100',
    scenario: 'Två inlägg publiceras samtidigt: ett lugnt och korrekt inlägg från en forskare, och ett argt, överdrivet inlägg med felaktig fakta. Det arga inlägget får 100 gånger fler visningar.',
    question: 'Varför sprider algoritmen det arga inlägget mer?',
    options: [
      { id: 'a', text: 'Algoritmen vet inte vad som är sant – den mäter engagemang, och ilska får fler att kommentera, dela och reagera' },
      { id: 'b', text: 'Algoritmen tycker att det arga inlägget är viktigare' },
      { id: 'c', text: 'Forskare får aldrig spridning i sociala medier' },
      { id: 'd', text: 'Felaktig fakta prioriteras medvetet av apparna' },
    ],
    correctId: 'a',
    explanation: 'Algoritmer mäter reaktioner – inte sanning. Innehåll som väcker starka känslor (särskilt ilska) får mer engagemang och sprids därför mer. Det betyder att felaktig men upprörande information ofta når fler än korrekt men lugn information. Det är inte en bugg – det är så systemet är byggt.',
    tip: 'När något sprids snabbt, fråga: sprids det för att det är sant – eller för att det gör folk arga?',
    discussionPrompt: 'Vad skulle hända om algoritmerna i stället prioriterade det som är sant? Varför gör de inte det?',
  },
  {
    id: 'm11-3',
    imageEmoji: '👯',
    imageBg: 'from-sky-100 to-cyan-100',
    scenario: 'Du och din kompis söker på exakt samma ord i samma app. Ni får helt olika resultat och rekommendationer.',
    question: 'Vad beror skillnaden på?',
    options: [
      { id: 'a', text: 'Ett tekniskt fel i appen' },
      { id: 'b', text: 'Din kompis har en nyare telefon' },
      { id: 'c', text: 'Algoritmen anpassar resultaten efter allt den vet om er: tidigare sökningar, visningar, plats och intressen' },
      { id: 'd', text: 'Sökresultat är alltid samma – kompisen måste ha stavat fel' },
    ],
    correctId: 'c',
    explanation: 'Sökresultat och rekommendationer är personliga. Algoritmen väger in din historik, dina intressen, din plats och mycket mer. Det betyder att två personer aldrig ser riktigt samma internet – och att "jag såg det överallt" bara betyder "överallt i MIN bubbla".',
    tip: 'Kom ihåg: det du ser är utvalt åt dig. Andra ser något annat – och tror lika mycket på sin bild.',
    discussionPrompt: 'Om alla ser olika "sanningar" i sina flöden – hur ska man då kunna diskutera med varandra? Vad behövs?',
  },
  {
    id: 'm11-4',
    imageEmoji: '🗣️',
    imageBg: 'from-emerald-100 to-teal-100',
    scenario: 'I ditt flöde verkar ALLA tycka likadant i en fråga. Du blir förvånad när du hör att många i klassen tycker helt tvärtom.',
    question: 'Vad har troligen hänt?',
    options: [
      { id: 'a', text: 'Klasskompisarna ljuger om vad de tycker' },
      { id: 'b', text: 'Din filterbubbla har visat dig en sida av frågan så länge att det KÄNTS som att alla håller med – fast verkligheten är mer delad' },
      { id: 'c', text: 'Flödet visar alltid vad majoriteten tycker' },
      { id: 'd', text: 'Det är omöjligt – flöden påverkar inte vad man tror att andra tycker' },
    ],
    correctId: 'b',
    explanation: 'Det här är filterbubblans farligaste effekt: den förvränger din bild av vad "alla" tycker. När algoritmen bara visar åsikter som liknar dina egna börjar du tro att de är de enda som finns. Det gör det svårare att förstå och prata med människor som tänker annorlunda.',
    tip: '"Alla i mitt flöde" är inte "alla". Ditt flöde är en liten, vinklad bit av världen.',
    discussionPrompt: 'Har ni själva blivit förvånade över att någon tyckte annorlunda än "alla" i ert flöde? Hur kändes det?',
  },
  {
    id: 'm11-5',
    imageEmoji: '🌍',
    imageBg: 'from-lime-100 to-green-100',
    scenario: 'Du märker att ditt flöde blivit ensidigt och vill få en bredare bild av världen.',
    question: 'Vilket är det mest effektiva sättet?',
    options: [
      { id: 'a', text: 'Skrolla mer – förr eller senare kommer annat innehåll' },
      { id: 'b', text: 'Radera appen för alltid' },
      { id: 'c', text: 'Aktivt söka upp ämnen och källor du inte brukar följa, följa konton med olika perspektiv och läsa nyheter från flera håll' },
      { id: 'd', text: 'Byta till en annan app – där finns ingen algoritm' },
    ],
    correctId: 'c',
    explanation: 'Mer skrollande förstärker bara bubblan – algoritmen visar mer av samma. Nästan alla stora appar har algoritmer, så att byta app hjälper inte i sig. Det som fungerar är aktiva val: sök själv, följ olika perspektiv och hämta nyheter från flera oberoende källor.',
    tip: 'Var en aktiv användare, inte en passiv skrollare. Du styr algoritmen mer än du tror – med det du klickar på.',
    discussionPrompt: 'Kom på tre konkreta saker ni kan göra redan i dag för att bredda era flöden.',
  },
  {
    id: 'm11-6',
    imageEmoji: '⏳',
    imageBg: 'from-violet-100 to-indigo-100',
    scenario: 'En app-tillverkare säger: "Vår algoritm visar bara det du är intresserad av – det är ju bra för dig!"',
    question: 'Vad är det viktigaste motargumentet?',
    options: [
      { id: 'a', text: 'Det finns inget motargument – personligt innehåll är alltid bra' },
      { id: 'b', text: 'Algoritmen är byggd för appens vinst (din tid och uppmärksamhet) – inte för din kunskap, och den kan gömma viktig information du behöver men inte "gillar"' },
      { id: 'c', text: 'Algoritmer borde förbjudas helt' },
      { id: 'd', text: 'Intressen är privata och ska inte användas alls' },
    ],
    correctId: 'b',
    explanation: 'Personalisering kan vara bekvämt, men algoritmens verkliga uppdrag är att maximera din skärmtid – det är så appen tjänar pengar. Viktiga men "tråkiga" saker (nyheter, motargument, sådant du behöver veta) sorteras bort om de inte håller dig kvar. Att förstå VEM algoritmen egentligen jobbar för är kärnan i källkritik på sociala medier.',
    tip: 'Fråga alltid: vem tjänar på att jag ser just det här? Svaret är ofta appen – inte du.',
    discussionPrompt: 'Är det okej att appar är byggda för att ta så mycket av vår tid som möjligt? Var går gränsen?',
  },
];
