export interface Module8Question {
  id: string;
  platform: string;
  platformIcon: string;
  postContent: string;
  username: string;
  followers?: string;
  question: string;
  options: { id: string; text: string }[];
  correctId: string;
  explanation: string;
  tip: string;
  tag: 'dold-reklam' | 'clickbait' | 'social-proof' | 'falsk-recension' | 'native-ad' | 'manipulation';
}

export const TAG_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
  'dold-reklam':    { icon: '🏷️', label: 'Dold reklam',       color: 'bg-rose-100 border-rose-300 text-rose-700' },
  'clickbait':      { icon: '🎣', label: 'Clickbait',          color: 'bg-amber-100 border-amber-300 text-amber-700' },
  'social-proof':   { icon: '👥', label: 'Socialt bevis',      color: 'bg-violet-100 border-violet-300 text-violet-700' },
  'falsk-recension':{ icon: '⭐', label: 'Falsk recension',    color: 'bg-sky-100 border-sky-300 text-sky-700' },
  'native-ad':      { icon: '📰', label: 'Inbyggd annons',     color: 'bg-emerald-100 border-emerald-300 text-emerald-700' },
  'manipulation':   { icon: '🎭', label: 'Manipulation',       color: 'bg-indigo-100 border-indigo-300 text-indigo-700' },
};

export const MODULE8_QUESTIONS: Module8Question[] = [
  {
    id: 'm8-1',
    platform: 'Instagram',
    platformIcon: '📸',
    postContent: '✨ Äntligen hittat något som faktiskt funkar för min hud!! Den här kremen från @GlowSkin_SE har förändrat allt. Huden känns mjuk, jämn och strålande – efter bara två veckor! Länk i bio 🔗 #glowup #hudvård #naturligt',
    username: '@lisas_livsstil',
    followers: '124 000 följare',
    question: 'Vad är det största problemet med det här inlägget?',
    options: [
      { id: 'a', text: 'Inlägget har för många hashtags' },
      { id: 'b', text: 'Det är troligen betalt samarbete men märks inte med #reklam eller #samarbete' },
      { id: 'c', text: 'Hudvård fungerar aldrig på bara två veckor' },
      { id: 'd', text: 'Influencers får aldrig rekommendera produkter' },
    ],
    correctId: 'b',
    explanation: 'Enligt svensk lag (marknadsföringslagen) MÅSTE betalda samarbeten märkas tydligt med #reklam eller "i samarbete med" direkt synligt – inte bara i länken. Hashtags som #naturligt och personliga omdömen utan märkning är ett klassiskt mönster för dold reklam.',
    tip: 'Leta alltid efter #reklam, #samarbete eller "Betalt partnerskap" i inlägg från influencers. Om det saknas kan det vara olaglig marknadsföring.',
    tag: 'dold-reklam',
  },
  {
    id: 'm8-2',
    platform: 'YouTube',
    platformIcon: '▶️',
    postContent: 'THUMBNAIL: [Dramatisk bild av ung tjej med chockad min, röd text: "JAG TESTADE DIETEN SOM ÄNDRADE ALLT – LÄKARNA HATAR DETTA!!"] \n\nRubrik: Jag åt bara ett livsmedel i 30 dagar – se resultatet! (CHOCK)',
    username: '@HealthHacksSweden',
    followers: '890 000 prenumeranter',
    question: 'Vad signalerar den här rubriken och thumbnailbilden?',
    options: [
      { id: 'a', text: 'Att videon handlar om ett seriöst hälsoprojekt' },
      { id: 'b', text: 'Att det är en välresearchad medicinsk studie' },
      { id: 'c', text: 'Clickbait – överdrivna påståenden och chocktaktik för att få klick, inte nödvändigtvis sanningsenlig information' },
      { id: 'd', text: 'Att videon är förbjuden av läkare' },
    ],
    correctId: 'c',
    explanation: '"Läkarna hatar detta" och "CHOCK" är klassiska clickbait-fraser. Thumbnailens chockade ansiktsuttryck och dramatisk text är designade för att trigga nyfikenhet och rädsla – inte informera. Seriösa hälsovideos har sällan sådana rubriker.',
    tip: 'Fråga dig: Är rubriken till för att informera eller för att du ska klicka? Ord som "CHOCK", "AVSLÖJAT" och "läkarna hatar" är ofta clickbait.',
    tag: 'clickbait',
  },
  {
    id: 'm8-3',
    platform: 'TikTok',
    platformIcon: '🎵',
    postContent: 'POV: Du provade kosttillskottet som 3 MILJONER personer redan tar varje dag 💪\n\n"Jag sov bättre, tränade hårdare och kände mig piggare på EN vecka" – det säger alla som testat!\n\n[I samarbete med VitalBoost – länk i bio]',
    username: '@maxfitness_se',
    followers: '430 000 följare',
    question: 'Förutom att det är ett märkt samarbete – vad mer bör du vara kritisk mot?',
    options: [
      { id: 'a', text: 'Att 3 miljoner personer tar det – det bevisar att det fungerar' },
      { id: 'b', text: 'Påståendet "alla som testat" och siffran 3 miljoner är omöjliga att verifiera och bevisar inget om produktens effekt' },
      { id: 'c', text: 'Att inlägget är på TikTok, som alltid sprider falsk information' },
      { id: 'd', text: 'Att influencern tränar – det gör hen mer trovärdig' },
    ],
    correctId: 'b',
    explanation: '"Alla som testat säger..." och stora siffror som "3 miljoner" används för att skapa socialt bevis – känslan av att du missar något alla andra har. Det bevisar ingenting om effekten. Att många köper en produkt bevisar att den marknadsförs bra, inte att den fungerar.',
    tip: 'Stora siffror och "alla gör det" är säljargument, inte bevis. Fråga: Finns det vetenskapliga studier som stöder påståendet?',
    tag: 'social-proof',
  },
  {
    id: 'm8-4',
    platform: 'Google Reviews',
    platformIcon: '⭐',
    postContent: '⭐⭐⭐⭐⭐ "Absolut bästa produkten jag köpt!! Leveransen gick supersnabbt och kvaliteten är fantastisk. Kan varmt rekommendera till alla! Ni är bäst!!"\n– Användare "nöjdkund2024" | Skrivet: Idag',
    username: 'NätetButik AB',
    followers: undefined,
    question: 'Vad bör du notera med den här recensionen?',
    options: [
      { id: 'a', text: 'Fem stjärnor är ett pålitligt betyg' },
      { id: 'b', text: 'Recensionen är anonym, vag, extremt positiv och skriven idag – typiska tecken på en falsk recension' },
      { id: 'c', text: 'Snabb leverans är alltid ett tecken på ett seriöst företag' },
      { id: 'd', text: 'Nöjda kunder skriver alltid sådana recensioner' },
    ],
    correctId: 'b',
    explanation: 'Falska recensioner har ofta: anonymt användarnamn, inga specifika detaljer om produkten, extremt positiv ton utan kritik, och skrivs i kluster (kolla om många 5-stjärniga recensioner dök upp samma dag). "Bästa produkten jag köpt!!" utan att nämna vad produkten faktiskt gör är ett varningstecken.',
    tip: 'Pålitliga recensioner nämner specifika fördelar OCH nackdelar. Titta alltid på 3-stjärniga recensioner – de brukar vara mest ärliga.',
    tag: 'falsk-recension',
  },
  {
    id: 'm8-5',
    platform: 'Nyhetssajt',
    platformIcon: '📰',
    postContent: 'ARTIKEL: "5 livsmedel som botar stress – experter avslöjar"\n\nArtikeln skrivs som vanlig journalistik med citat från "experter" och råd. Längst ner, i liten text: "Annons | Innehållet är skapat i samarbete med SupplementCo"',
    username: 'HealthDaily.se',
    followers: undefined,
    question: 'Vad kallas det här fenomenet och varför är det problematiskt?',
    options: [
      { id: 'a', text: 'Det är normal journalistik – alla artiklar har sponsorer' },
      { id: 'b', text: 'Det kallas native advertising eller inbyggd annons – reklam formaterad som journalistik för att se trovärdig ut' },
      { id: 'c', text: 'Det är olagligt och webbsidan borde stängas' },
      { id: 'd', text: 'Det spelar ingen roll om det är reklam om råden är bra' },
    ],
    correctId: 'b',
    explanation: 'Native advertising är reklam som ser ut som redaktionellt innehåll. Det är problematiskt eftersom läsaren inte märker att det är reklam förrän (om ens) de läser den lilla texten längst ner. Seriösa medier märker tydligt vad som är reklam.',
    tip: 'Leta alltid efter "Annons", "Sponsrat innehåll" eller "I samarbete med" – och notera om det är tydligt eller gömt.',
    tag: 'native-ad',
  },
  {
    id: 'm8-6',
    platform: 'Instagram',
    platformIcon: '📸',
    postContent: '🔥 BEFORE/AFTER 🔥\n\n[Vänster bild: dålig belysning, inzoomad, ingen makeup, ledsen blick]\n[Höger bild: professionell belysning, full makeup, bredvinkel, strålande leende]\n\n"PÅ BARA 4 VECKOR med FitPlan-appen! Jag kan inte tro förändringen 😱 #reklam #FitPlan"',
    username: '@wellness_with_emma',
    followers: '67 000 följare',
    question: 'Märket #reklam finns med. Vad bör du ändå vara kritisk mot?',
    options: [
      { id: 'a', text: 'Ingenting – #reklam gör det till ärlig marknadsföring' },
      { id: 'b', text: 'Before/after-bilder är manipulerade med belysning, vinkel och makeup – de jämför inte samma förhållanden' },
      { id: 'c', text: 'Man kan aldrig förändra sin kropp på 4 veckor' },
      { id: 'd', text: 'Appar kan aldrig hjälpa med träning' },
    ],
    correctId: 'b',
    explanation: 'Även märkt reklam kan vara vilseledande. Before/after-bilder manipuleras systematiskt: sämre belysning, dålig hållning och ledsen min "before" – optimal belysning, makeup och ett leende "after". Det är inte förändringen av kroppen som syns, det är förändringen av fotokontext.',
    tip: 'Märkt reklam kan fortfarande vara manipulativ. Tänk kritiskt på vad bilden FAKTISKT visar – inte vad den påstår visa.',
    tag: 'manipulation',
  },
  {
    id: 'm8-7',
    platform: 'YouTube',
    platformIcon: '▶️',
    postContent: 'VIDEO: "Jag testade 5 gaming-headsets under 500 kr – ÄRLIG recension!"\n\nI videobeskrivningen (expanderas manuellt): "Alla produkter i det här videon är köpta med egna pengar och representerar mina egna åsikter. *Vissa länkar är affiliatelänkar – jag får en liten provision om du köper via dem, utan extra kostnad för dig."',
    username: '@TechGuide_Sverige',
    followers: '210 000 prenumeranter',
    question: 'Vad skiljer den här videon från dold reklam?',
    options: [
      { id: 'a', text: 'Ingenting – alla YouTube-videor är reklam' },
      { id: 'b', text: 'Producenten är transparent om affiliate-länkar och egna inköp, vilket är en ärlig redovisning av eventuella ekonomiska intressen' },
      { id: 'c', text: 'Affiliate-länkar gör att videon är opålitlig' },
      { id: 'd', text: 'Produkterna är köpta med egna pengar, så recensionen är 100% objektiv' },
    ],
    correctId: 'b',
    explanation: 'Det här är ett exempel på BÄTTRE transparens. Skaparen berättar att: 1) produkterna är egna inköp (inget sponsrat), 2) det finns affiliate-länkar (liten provision), och 3) åsikterna är egna. Det gör det möjligt för dig att bedöma trovärdigheten. Affiliatelänkar påverkar inte nödvändigtvis ärligheten, men det är bra att veta.',
    tip: 'Transparens om ekonomiska intressen är ett gott tecken. Det behöver inte göra en recension opålitlig – men det är viktig info för din bedömning.',
    tag: 'dold-reklam',
  },
];
