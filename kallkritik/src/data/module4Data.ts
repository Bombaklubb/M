// Module 4 – Fakebilder & Deepfakes (lär dig + quiz)

export interface AiSign {
  key: string;
  icon: string;
  title: string;
  question: string;
  desc: string;
  checks: string[];
}

export interface Module4Question {
  id: string;
  imageEmoji: string;
  imageBg: string;
  scenario: string;
  question: string;
  options: { id: string; text: string }[];
  correctId: string;
  explanation: string;
  tip: string;
  sign: string;
  discussionPrompt?: string;
}

// De 4 tecknen på AI-genererade bilder.
// OBS: tekniken förbättras snabbt – tecknen bekräftar AI när de syns,
// men frånvaro av tecken bevisar INTE att en bild är äkta.
export const AI_SIGNS: AiSign[] = [
  {
    key: 'text',
    icon: '🔤',
    title: 'Text & bokstäver',
    question: 'Går texten att läsa?',
    desc: 'AI har haft svårt med text i bilder: skyltar och logotyper blir ofta påhittade bokstäver som ser ut som text men inte betyder något. Nyare AI klarar text allt bättre – hittar du rappakalja är det ett starkt tecken på AI, men läsbar text bevisar inte att bilden är äkta.',
    checks: [
      'Zooma in på skyltar, böcker och logotyper',
      'Är bokstäverna riktiga ord eller bara klotter?',
      'Specialtecken som å, ä, ö blir ofta fel',
      'Men obs: att texten går att läsa bevisar ingenting',
    ],
  },
  {
    key: 'ansikten',
    icon: '👁️',
    title: 'Ögon, hud & ansikten',
    question: 'Ser ansiktet äkta ut?',
    desc: 'I deepfakes och AI-porträtt kan huden bli onaturligt slät (som plast), ögonen peka åt olika håll, och öron, tänder eller glasögon få konstiga former. Dagens AI gör dock allt mer verklighetstrogna ansikten – ett felfritt ansikte betyder inte att bilden är äkta.',
    checks: [
      'Är huden onaturligt slät – inga porer eller ojämnheter?',
      'Pekar båda ögonen åt samma håll? Matchar reflexerna?',
      'Ser öron, tänder och glasögon naturliga ut?',
      'Ser allt normalt ut? Då vet du fortfarande inte – kolla källan',
    ],
  },
  {
    key: 'ljus',
    icon: '☀️',
    title: 'Ljus & skuggor',
    question: 'Stämmer skuggorna?',
    desc: 'I verkligheten kommer ljus från en riktning och alla skuggor pekar åt samma håll. AI gör ofta misstag här – skuggor saknas, pekar fel håll, eller speglingar visar fel saker.',
    checks: [
      'Pekar alla skuggor åt samma håll?',
      'Finns det skuggor där det borde finnas?',
      'Visar speglingar (i glas, vatten, ögon) rätt sak?',
    ],
  },
  {
    key: 'bakgrund',
    icon: '🔍',
    title: 'Bakgrund & detaljer',
    question: 'Vad händer i bakgrunden?',
    desc: 'AI fokuserar på huvudmotivet och slarvar med bakgrunden. Där kan du hitta hopsmälta föremål, upprepade mönster, böjda raka linjer eller saker som inte hänger ihop.',
    checks: [
      'Smälter föremål i bakgrunden ihop med varandra?',
      'Upprepas samma mönster onaturligt ofta?',
      'Är raka linjer (väggar, fönster) konstigt böjda?',
    ],
  },
];

export const MODULE4_QUESTIONS: Module4Question[] = [
  {
    id: 'm4-2',
    discussionPrompt: 'Varför är text i bilder så svårt för AI? Har ni sett exempel på konstig text i en AI-bild?',
    imageEmoji: '🏪',
    imageBg: 'from-amber-100 to-orange-100',
    scenario: 'En bild visar en mysig affärsgata med många skyltar och butiksnamn i fönstren.',
    question: 'Du misstänker att bilden är AI-genererad. Vad avslöjar det troligen?',
    options: [
      { id: 'a', text: 'Att gatan ser för fin ut' },
      { id: 'b', text: 'Att det är för många människor på gatan' },
      { id: 'c', text: 'Skyltarna innehåller påhittade bokstäver och ord som inte betyder något' },
      { id: 'd', text: 'Att himlen är blå' },
    ],
    correctId: 'c',
    explanation: 'AI kan oftast inte skriva riktig text. På skyltar, butiksnamn och affischer blir det ofta bokstäver som ser nästan rätt ut men bildar rappakalja. Zooma in på all text i bilden!',
    tip: 'Zooma in på text i bilder – rappakalja avslöjar AI. Men nyare AI skriver allt bättre text, så läsbar text bevisar inte att bilden är äkta.',
    sign: 'text',
  },
  {
    id: 'm4-3',
    discussionPrompt: 'Varför skapar någon en deepfake av en känd person? Vilka kan drabbas värst av deepfakes?',
    imageEmoji: '🤳',
    imageBg: 'from-rose-100 to-pink-100',
    scenario: 'Ett porträtt av en "kändis" sprids med ett kontroversiellt påstående. Huden är helt jämn och perfekt, utan en enda por eller ojämnhet.',
    question: 'Varför är den perfekt släta huden ett varningstecken?',
    options: [
      { id: 'a', text: 'Kändisar har alltid perfekt hud' },
      { id: 'b', text: 'Riktig hud har alltid porer, ojämnheter och struktur – plastliknande slät hud är typiskt för AI och deepfakes' },
      { id: 'c', text: 'Det betyder bara att personen använt smink' },
      { id: 'd', text: 'Slät hud betyder att bilden är gammal' },
    ],
    correctId: 'b',
    explanation: 'Deepfakes och AI-porträtt gör ofta huden onaturligt slät, nästan som plast eller vax. Riktig mänsklig hud har alltid porer, små hår, ojämnheter och struktur. Titta också på öron och ögon. Men tänk på att tekniken förbättras snabbt – de här tecknen fångar allt färre bilder.',
    tip: 'Onaturligt slät, plastig hud är ett klassiskt tecken på deepfake. Men ansikten blir hela tiden mer verklighetstrogna – ser huden äkta ut måste du ändå kolla varifrån bilden kommer.',
    sign: 'ansikten',
  },
  {
    id: 'm4-4',
    discussionPrompt: 'Kan man alltid se på skuggorna? Vad gör ni när tecknen inte räcker för att avgöra?',
    imageEmoji: '🌅',
    imageBg: 'from-sky-100 to-blue-100',
    scenario: 'En bild visar en person som står utomhus i starkt solljus. Solen syns tydligt till höger i bilden.',
    question: 'Hur kan skuggorna hjälpa dig avgöra om bilden är äkta?',
    options: [
      { id: 'a', text: 'Skuggorna spelar ingen roll' },
      { id: 'b', text: 'Om solen är till höger ska alla skuggor peka åt vänster – pekar de åt olika håll är bilden troligen AI' },
      { id: 'c', text: 'Skuggor finns aldrig i AI-bilder' },
      { id: 'd', text: 'Ju fler skuggor desto äktare bild' },
    ],
    correctId: 'b',
    explanation: 'I verkligheten kommer ljuset från en riktning, så ALLA skuggor pekar åt samma håll. AI gör ofta misstag här: skuggor pekar åt olika håll, saknas helt, eller hamnar på fel ställe. Kolla även speglingar i fönster och ögon.',
    tip: 'Följ ljuset! Om solen är på ena sidan ska alla skuggor peka åt motsatt håll. Olika skuggriktningar = varningstecken.',
    sign: 'ljus',
  },
  {
    id: 'm4-5',
    discussionPrompt: 'Varför slarvar AI i bakgrunden? Vad säger det om hur AI-bilder skapas?',
    imageEmoji: '👥',
    imageBg: 'from-emerald-100 to-teal-100',
    scenario: 'En bild visar en stor folksamling på ett torg. Huvudpersonen i mitten ser skarp och tydlig ut.',
    question: 'Var letar du smartast efter tecken på AI?',
    options: [
      { id: 'a', text: 'Bara på huvudpersonen i mitten' },
      { id: 'b', text: 'I bakgrunden bland folkmassan – där smälter ansikten och kroppar ofta ihop på konstiga sätt' },
      { id: 'c', text: 'På himlen ovanför torget' },
      { id: 'd', text: 'Det går inte att avgöra alls' },
    ],
    correctId: 'b',
    explanation: 'AI lägger mest kraft på huvudmotivet och slarvar med bakgrunden. I en folkmassa blir det ofta tydligt: ansikten smälter ihop, personer saknar kroppsdelar, eller samma ansikte upprepas. Granska alltid bakgrunden noga!',
    tip: 'Bakgrunden avslöjar ofta AI-bilder. Titta efter hopsmälta personer, upprepade mönster och föremål som inte hänger ihop.',
    sign: 'bakgrund',
  },
  {
    id: 'm4-6',
    discussionPrompt: 'Vad är säkrast: att granska skärmdumpen eller att gå till källans riktiga sida? Varför?',
    imageEmoji: '📰',
    imageBg: 'from-zinc-100 to-stone-100',
    scenario: 'En "skärmdump" av en nyhetsartikel sprids. Den ser ut som en riktig tidning, men något känns fel med rubriken och datumet.',
    question: 'Vilka detaljer bör du dubbelkolla?',
    options: [
      { id: 'a', text: 'Bara om bilden är färgglad' },
      { id: 'b', text: 'Logotypens utseende, om texten är läsbar och vettig, och om datumet stämmer – AI och fejk-skärmdumpar gör ofta fel här' },
      { id: 'c', text: 'Hur många som delat artikeln' },
      { id: 'd', text: 'Om tidningen har en hemsida' },
    ],
    correctId: 'b',
    explanation: 'Fejkade skärmdumpar och AI-bilder av tidningar avslöjar sig ofta genom: logotyper som är nästan men inte helt rätt, text som ser konstig ut vid inzoomning, och felaktiga datum eller stavfel. Bäst av allt: gå till tidningens RIKTIGA hemsida och sök efter artikeln.',
    tip: 'Litar du inte på en "skärmdump"? Gå till källans riktiga hemsida och sök efter artikeln själv. Finns den inte där är den troligen fejk.',
    sign: 'text',
  },
];
