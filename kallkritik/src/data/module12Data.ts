// Module 12 – Nätfiske & bluffar

export interface ScamStep {
  key: string;
  icon: string;
  title: string;
  question: string;
  desc: string;
  checks: string[];
}

export interface Module12Question {
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

export const SCAM_STEPS: ScamStep[] = [
  {
    key: 'lockbete',
    icon: '🎁',
    title: 'Lockbetet',
    question: 'För bra för att vara sant?',
    desc: 'Bluffar börjar nästan alltid med något du VILL ha: gratis Robux, skins, en vinst, en kändis som "valt just dig". Om erbjudandet är för bra för att vara sant – då är det nästan alltid det.',
    checks: [
      'Gratis spelvaluta, skins eller prylar? Klassiskt lockbete',
      '"Du har vunnit!" – fast du inte deltagit i någon tävling?',
      'Ju bättre erbjudandet låter, desto mer misstänksam ska du vara',
    ],
  },
  {
    key: 'bradska',
    icon: '⏰',
    title: 'Brådskan',
    question: 'Måste du agera NU?',
    desc: 'Bedragare vill inte att du ska hinna tänka. Därför skapar de stress: "Endast 10 minuter kvar!", "Ditt konto stängs i dag!", "Svara direkt annars förlorar du allt!". Stress är bluffens viktigaste verktyg.',
    checks: [
      'Nedräkningar och "sista chansen" är varningstecken',
      'Hot om att kontot "stängs" om du inte agerar direkt',
      'Seriösa företag ger dig alltid tid att tänka',
    ],
  },
  {
    key: 'avsandare',
    icon: '🔍',
    title: 'Avsändaren & länken',
    question: 'Kolla adressen!',
    desc: 'Innan du klickar eller skriver in något: granska VEM som skickat och VART länken går. Bluffsidor härmar riktiga sidor men adressen avslöjar dem – "rob1ox-gratis.com" är inte "roblox.com".',
    checks: [
      'Läs webbadressen noga – bokstav för bokstav',
      'Skriv aldrig in lösenord via en länk någon skickat',
      'Osäker? Gå till sajten själv genom att skriva adressen',
    ],
  },
];

export const MODULE12_QUESTIONS: Module12Question[] = [
  {
    id: 'm12-1',
    imageEmoji: '🎮',
    imageBg: 'from-orange-100 to-amber-100',
    scenario: 'En sajt lovar "1000 GRATIS Robux – klicka här och logga in med ditt konto så skickas de direkt!"',
    question: 'Vad är det rätta att göra?',
    options: [
      { id: 'a', text: 'Logga in snabbt innan erbjudandet tar slut' },
      { id: 'b', text: 'Inte logga in – sajten vill stjäla ditt lösenord. Gratis spelvaluta utanför den officiella appen är i princip alltid en bluff' },
      { id: 'c', text: 'Logga in men med ett kort lösenord' },
      { id: 'd', text: 'Testa med en kompis konto först' },
    ],
    correctId: 'b',
    explanation: 'Det här är klassiskt nätfiske (phishing): lockbetet är gratis Robux, men målet är ditt lösenord. Loggar du in på den falska sidan har bedragaren ditt konto på sekunder. Riktiga företag delar aldrig ut valuta via externa sajter som kräver inloggning. Och att "testa med en kompis konto" utsätter bara kompisen för samma stöld.',
    tip: 'Skriv ALDRIG in ditt lösenord på en sida du kommit till via en länk eller annons. Gå alltid till den riktiga appen/sajten själv.',
    discussionPrompt: 'Varför är just spel-valuta ett så vanligt lockbete mot unga? Vad gör det med ens omdöme när man verkligen vill ha något?',
  },
  {
    id: 'm12-2',
    imageEmoji: '💬',
    imageBg: 'from-sky-100 to-blue-100',
    scenario: 'Din kompis skickar plötsligt ett DM: "OMG kolla den här videon på dig!! 😱 [länk]". Meddelandet låter inte riktigt som hen brukar skriva.',
    question: 'Vad gör du?',
    options: [
      { id: 'a', text: 'Klickar direkt – det är ju min kompis' },
      { id: 'b', text: 'Klickar men bara snabbt' },
      { id: 'c', text: 'Klickar INTE – kompisens konto kan vara kapat. Fråga kompisen via en annan kanal (IRL, samtal, annan app) om hen verkligen skickat det' },
      { id: 'd', text: 'Skickar länken vidare till andra och frågar vad de tycker' },
    ],
    correctId: 'c',
    explanation: '"Kolla den här videon på dig!" är ett av de vanligaste kapade-konto-meddelandena. Länken leder till en falsk inloggningssida – och när du loggar in kapas DITT konto, som sedan skickar samma meddelande till dina vänner. Att meddelandet inte "låter som" kompisen är en stark varningssignal. Verifiera alltid via en annan kanal.',
    tip: 'Konstigt meddelande från en kompis? Fråga hen öga mot öga eller i en annan app innan du klickar.',
    discussionPrompt: 'Varför fungerar bluffar bättre när de ser ut att komma från någon vi litar på?',
  },
  {
    id: 'm12-3',
    imageEmoji: '📱',
    imageBg: 'from-emerald-100 to-teal-100',
    scenario: 'Ett SMS: "GRATTIS! Du har vunnit en iPhone 16! Betala bara frakten (29 kr) med ditt kort inom 15 minuter: [länk]"',
    question: 'Vilka varningstecken finns – och vad är bedragaren egentligen ute efter?',
    options: [
      { id: 'a', text: 'Inga varningstecken – 29 kr är billigt för en iPhone' },
      { id: 'b', text: 'Vinst utan tävling + tidspress + kortuppgifter för "frakt" – bedragaren vill åt ditt kort, inte skicka någon telefon' },
      { id: 'c', text: 'Enda problemet är att frakten borde vara gratis' },
      { id: 'd', text: 'Det är säkert om man betalar med förälderns kort' },
    ],
    correctId: 'b',
    explanation: 'Tre klassiska tecken i ett: (1) du har "vunnit" något du aldrig tävlat om, (2) tidspress på 15 minuter så du inte hinner tänka, (3) kortuppgifter krävs för en struntsumma. De 29 kronorna är inte poängen – när bedragaren har dina kortuppgifter kan de dra mycket mer, ofta som dolda "prenumerationer".',
    tip: 'Man kan inte vinna en tävling man aldrig deltagit i. Och riktiga vinster kräver aldrig dina kortuppgifter.',
    discussionPrompt: 'Varför begär bluffar ofta en LITEN summa först? Vad händer sedan?',
  },
  {
    id: 'm12-4',
    imageEmoji: '🔗',
    imageBg: 'from-violet-100 to-purple-100',
    scenario: 'Du ska logga in på ditt spelkonto via en länk och ser adressen: "www.rob1ox-secure-login.com". Den riktiga sajten heter roblox.com.',
    question: 'Hur avslöjar du att sidan är falsk?',
    options: [
      { id: 'a', text: 'Det går inte att se på adressen – man måste logga in för att veta' },
      { id: 'b', text: 'Granska adressen: "rob1ox" har en etta i stället för L, och den riktiga domänen är roblox.com – inte en lång adress med extra ord' },
      { id: 'c', text: 'Falska sidor ser alltid fula och slarviga ut' },
      { id: 'd', text: 'Om sidan har rätt logga är den äkta' },
    ],
    correctId: 'b',
    explanation: 'Bluffsidor kopierar utseende och logotyp perfekt – design bevisar ingenting. Det som INTE går att fejka är den riktiga domänen. Läs adressen bokstav för bokstav: utbytta tecken (1 i stället för l, 0 i stället för o) och extra ord ("-secure-login") är klassiska knep. Det viktiga är vad som står precis före .com.',
    tip: 'Lita på adressraden, inte på designen. Skriv hellre in den riktiga adressen själv än att klicka på länkar.',
    discussionPrompt: 'Träna tillsammans: hitta på tre falska adresser som härmar kända sajter. Vad gör dem svåra att avslöja?',
  },
  {
    id: 'm12-5',
    imageEmoji: '⭐',
    imageBg: 'from-pink-100 to-rose-100',
    scenario: 'Ett konto som ser ut som en känd influencer skriver: "Jag ger bort 5000 kr till 10 följare! Följ, dela och skicka ditt telefonnummer och din adress i DM! 💸"',
    question: 'Vad bör du misstänka?',
    options: [
      { id: 'a', text: 'Ingenting – influencers ger ofta bort pengar' },
      { id: 'b', text: 'Att det är ett falskt konto som samlar in personuppgifter – riktiga giveaways ber aldrig om telefonnummer och adress i DM' },
      { id: 'c', text: 'Att beloppet borde varit högre' },
      { id: 'd', text: 'Att man bara ska skicka telefonnumret, inte adressen' },
    ],
    correctId: 'b',
    explanation: 'Falska kändiskonton (ofta med nästan identiskt användarnamn) är en vanlig bluff. Målet är dina personuppgifter – de kan användas för bedrägerier, säljas vidare eller användas för att lura dig senare. Kolla: är kontot verifierat? Hur gammalt är det? Stämmer användarnamnet EXAKT? Och skicka aldrig personuppgifter i DM.',
    tip: 'Dela aldrig telefonnummer, adress eller personnummer i DM – oavsett vem som frågar.',
    discussionPrompt: 'Vad kan någon göra med ditt telefonnummer och din adress? Varför är personuppgifter värdefulla för bedragare?',
  },
  {
    id: 'm12-6',
    imageEmoji: '🚨',
    imageBg: 'from-rose-100 to-red-100',
    scenario: 'Oj. Du klickade på en bluff-länk och skrev in ditt lösenord innan du fattade vad det var.',
    question: 'Vad gör du NU?',
    options: [
      { id: 'a', text: 'Inget – skadan är redan skedd' },
      { id: 'b', text: 'Håller det hemligt så ingen får veta' },
      { id: 'c', text: 'Byter lösenordet DIREKT (och överallt där samma lösenord används), slår på tvåstegsverifiering och berättar för en vuxen' },
      { id: 'd', text: 'Raderar appen från telefonen' },
    ],
    correctId: 'c',
    explanation: 'Snabbhet räddar kontot: byt lösenord direkt – bedragaren kanske inte hunnit använda det än. Byt även på andra ställen där du använt samma lösenord (därför ska man aldrig återanvända lösenord). Tvåstegsverifiering gör det stulna lösenordet nästan värdelöst. Och att berätta för en vuxen är styrka, inte pinsamt – alla kan bli lurade.',
    tip: 'Att bli lurad är inget att skämmas för – det händer även vuxna experter. Det viktiga är att agera snabbt och berätta.',
    discussionPrompt: 'Varför skäms många över att ha blivit lurade? Vad kan hända om man INTE berättar för någon?',
  },
];
