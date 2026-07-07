// Module 13 – Botar & troll

export interface TrollStep {
  key: string;
  icon: string;
  title: string;
  question: string;
  desc: string;
  checks: string[];
}

export interface Module13Question {
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

export const TROLL_STEPS: TrollStep[] = [
  {
    key: 'bot',
    icon: '🤖',
    title: 'Vad är en bot?',
    question: 'Ett konto utan människa bakom',
    desc: 'En bot är ett automatiserat konto som styrs av ett program, inte en person. Botar kan skapas i tusental för att gilla, dela och kommentera – och få ett budskap att verka mycket mer populärt än det är.',
    checks: [
      'Nytt konto med få följare men enormt många inlägg?',
      'Postar dygnet runt, även mitt i natten?',
      'Generisk profilbild, konstigt användarnamn med siffror?',
    ],
  },
  {
    key: 'troll',
    icon: '🎭',
    title: 'Trollkonton',
    question: 'De vill provocera – inte diskutera',
    desc: 'Ett troll är en person (eller ett betalt konto) vars mål är att skapa bråk, ilska och splittring. Trollet bryr sig inte om att ha rätt – varje argt svar är en vinst, för det ger spridning och förgiftar samtalet.',
    checks: [
      'Extremt provocerande påståenden utan källor',
      'Svarar aldrig sakligt – byter ämne eller hånar i stället',
      'Målet är din ilska, inte en diskussion',
    ],
  },
  {
    key: 'folkstorm',
    icon: '📢',
    title: 'Falsk folkstorm',
    question: 'Många konton – samma budskap',
    desc: 'När hundratals konton plötsligt skriver nästan samma sak samtidigt kallas det astroturfing – en fejkad folkopinion. Det ska se ut som att "folket" tycker något, men bakom ligger en samordnad kampanj.',
    checks: [
      'Många nästan identiska kommentarer på kort tid?',
      'Nya konton som alla driver samma åsikt?',
      'Fråga: vem tjänar på att det HÄR ser populärt ut?',
    ],
  },
];

export const MODULE13_QUESTIONS: Module13Question[] = [
  {
    id: 'm13-1',
    imageEmoji: '🕵️',
    imageBg: 'from-slate-100 to-zinc-100',
    scenario: 'Ett konto kommenterar en nyhet. Du klickar på profilen: kontot skapades förra veckan, har 3 följare, ingen riktig profilbild, heter "user84729154" – och har redan postat 2 000 inlägg.',
    question: 'Vad talar siffrorna för?',
    options: [
      { id: 'a', text: 'En vanlig ny användare som är väldigt aktiv' },
      { id: 'b', text: 'Troligen en bot: 2000 inlägg på en vecka är nästan 300 om dagen – det klarar ingen människa, och de andra tecknen stämmer också' },
      { id: 'c', text: 'En kändis som vill vara anonym' },
      { id: 'd', text: 'Det går inte att gissa något av en profil' },
    ],
    correctId: 'b',
    explanation: 'Räkna själv: 2 000 inlägg på 7 dagar är cirka 285 per dag – mer än 10 i timmen, dygnet runt. Kombinerat med nytt konto, inga följare, generiskt namn och ingen riktig profilbild är det ett klassiskt bot-mönster. Ett enda tecken bevisar inget, men flera tillsammans är en stark signal.',
    tip: 'Klicka på profilen innan du tar en kommentar på allvar. Kontots historik avslöjar mer än kommentaren.',
    discussionPrompt: 'Varför skapar någon tusentals botkonton? Vad kostar det – och vad tjänar man?',
  },
  {
    id: 'm13-2',
    imageEmoji: '💬',
    imageBg: 'from-cyan-100 to-sky-100',
    scenario: 'Under en video om en samhällsfråga ser du 50 kommentarer som alla säger nästan exakt samma sak, med samma formuleringar – postade inom en timme.',
    question: 'Vad är den rimligaste förklaringen?',
    options: [
      { id: 'a', text: 'Att 50 personer råkade tänka exakt samma tanke samtidigt' },
      { id: 'b', text: 'En samordnad kampanj eller botnätverk som ska få åsikten att se ut som en folkstorm' },
      { id: 'c', text: 'Att kommentarerna är sanna eftersom de är många' },
      { id: 'd', text: 'Ett tekniskt fel som kopierat samma kommentar' },
    ],
    correctId: 'b',
    explanation: 'Riktiga människor formulerar sig olika – även när de tycker lika. Nästan identiska kommentarer inom kort tid är ett tydligt tecken på samordning: botar eller betalda konton som jobbar från samma manus. Målet är att skapa intrycket att "alla" tycker något. Antal är inte bevis: 50 fejkade röster är fortfarande noll riktiga.',
    tip: 'Läs kommentarer kritiskt: låter de som människor eller som kopior? Många röster är inte samma sak som många människor.',
    discussionPrompt: 'Hur påverkas du av att "alla i kommentarerna" verkar tycka en sak? Även om du vet att de kan vara fejkade?',
  },
  {
    id: 'm13-3',
    imageEmoji: '😤',
    imageBg: 'from-rose-100 to-orange-100',
    scenario: 'I en diskussion du deltar i dyker ett konto upp som skriver medvetet elaka och provocerande saker om ditt lag, din musik och till slut om dig. Du blir riktigt arg.',
    question: 'Vad är det smartaste sättet att hantera trollet?',
    options: [
      { id: 'a', text: 'Skriva ett riktigt vasst svar som sätter dit trollet' },
      { id: 'b', text: 'Samla kompisar och svara många tillsammans' },
      { id: 'c', text: 'Inte svara alls – rapportera och blockera. Trollets mål är din ilska; varje argt svar ger det mer spridning och energi' },
      { id: 'd', text: 'Byta åsikt så trollet blir nöjt' },
    ],
    correctId: 'c',
    explanation: '"Mata inte trollet" är regeln av en anledning: troll livnär sig på reaktioner. Ett briljant argt svar känns bra i stunden men ger trollet exakt vad det vill ha – uppmärksamhet, spridning (algoritmen älskar bråk!) och ett bevis på att provokationen fungerade. Rapportera, blockera, gå vidare. Det är inte feghet – det är att vinna.',
    tip: 'Fråga dig innan du svarar: vill den här personen diskutera – eller bara göra mig arg? Om det senare: svara inte.',
    discussionPrompt: 'Varför är det så svårt att INTE svara när någon provocerar? Vad händer i kroppen – och vad vinner man på att vänta?',
  },
  {
    id: 'm13-4',
    imageEmoji: '🧩',
    imageBg: 'from-violet-100 to-fuchsia-100',
    scenario: 'Du läser att organiserade "trollfabriker" – kontor där anställda sköter hundratals fejkkonton – finns på riktigt i flera länder.',
    question: 'Varför lägger någon pengar på trollfabriker?',
    options: [
      { id: 'a', text: 'För att det är ett roligt skämt' },
      { id: 'b', text: 'För att påverka åsikter, skapa splittring och misstro i andra länder, eller tjäna pengar – fejkade opinioner är ett maktverktyg' },
      { id: 'c', text: 'Trollfabriker är en myt som inte finns' },
      { id: 'd', text: 'För att hjälpa folk hitta nya vänner' },
    ],
    correctId: 'b',
    explanation: 'Trollfabriker är dokumenterade av journalister och forskare i flera länder. Syftet är strategiskt: påverka val och folkomröstningar, förstärka konflikter mellan grupper, sprida misstro mot medier och myndigheter – eller helt enkelt tjäna pengar på uppdragsgivare. Att åsikter kan massproduceras är ett av de starkaste skälen att tänka källkritiskt kring "vad folk tycker" på nätet.',
    tip: 'När en åsikt plötsligt "är överallt" – fundera på om den vuxit naturligt eller blivit planterad.',
    discussionPrompt: 'Vem tjänar på att människor i ett land bråkar mer med varandra? Ge exempel på splittring som någon kan vilja förstärka.',
  },
  {
    id: 'm13-5',
    imageEmoji: '📋',
    imageBg: 'from-emerald-100 to-lime-100',
    scenario: 'Du är osäker på om ett konto som sprider starka åsikter är äkta. Du bestämmer dig för att granska det.',
    question: 'Vad i kontots historik säger mest?',
    options: [
      { id: 'a', text: 'Hur snygg profilbilden är' },
      { id: 'b', text: 'Om kontot har många inlägg' },
      { id: 'c', text: 'Helheten över tid: När skapades kontot? Postar det som en människa (varierat, olika tider, egna ord) eller som en maskin (samma ämne, dygnet runt, kopierade fraser)?', },
      { id: 'd', text: 'Om användarnamnet låter svenskt' },
    ],
    correctId: 'c',
    explanation: 'Enskilda detaljer kan fejkas – en bot kan ha snygg profilbild och svenskt namn. Det som är svårt att fejka är ett mänskligt beteendemönster över tid: riktiga konton har historia, varierade intressen, egna formuleringar, pauser och vardagsinlägg. Botar och trollkonton är ofta monotona: ett ämne, ett syfte, konstant aktivitet.',
    tip: 'Skrolla bakåt i kontots historik. Människor har liv – botar har uppdrag.',
    discussionPrompt: 'Granska (på storskärm) ett konto tillsammans: vilka mänskliga spår hittar ni? Vad hade en bot inte kunnat fejka?',
  },
  {
    id: 'm13-6',
    imageEmoji: '🗳️',
    imageBg: 'from-amber-100 to-yellow-100',
    scenario: 'Veckan före en stor omröstning fylls sociala medier plötsligt av konton som alla driver samma åsikt och delar samma "avslöjanden" om ena sidan.',
    question: 'Hur bör du tänka kring det du ser?',
    options: [
      { id: 'a', text: 'Många inlägg betyder att åsikten är rätt – majoriteten har talat' },
      { id: 'b', text: 'Extra källkritiskt: tiden (precis före omröstningen), samordningen och de anonyma kontona tyder på en påverkanskampanj. Kolla "avslöjandena" mot oberoende källor innan du tror eller delar' },
      { id: 'c', text: 'Sluta helt bry sig om omröstningen' },
      { id: 'd', text: 'Dela vidare snabbt så alla hinner se före omröstningen' },
    ],
    correctId: 'b',
    explanation: 'Tidpunkten är nyckeln: påverkanskampanjer sätts ofta in precis före val och omröstningar, när det är för sent att hinna granska allt. Kombinationen plötslig våg + samordnat budskap + anonyma avsändare + sensationella "avslöjanden" är ett känt mönster. Rätt respons är inte att bli cynisk och strunta i allt – utan att sakta ner, faktakolla mot oberoende källor och inte bli en megafon åt kampanjen.',
    tip: 'Ju närmare ett viktigt beslut, desto mer desinformation – och desto viktigare att kolla innan du delar.',
    discussionPrompt: 'Varför är det extra allvarligt när fejkade konton försöker påverka val? Vad kan man göra som vanlig användare?',
  },
];
