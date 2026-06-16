import type { Tema } from '../types'

// Modul 1 – Temabanken
// Färdiga teman med aktivitetsförslag. Skolans egna teman läggs till i appen
// och sparas i localStorage (se Temabanken.tsx).
export const TEMAN: Tema[] = [
  {
    id: 'hallbar-utveckling',
    namn: 'Hållbar utveckling',
    emoji: '♻️',
    aldersgrupper: ['F', '1-3', '4-6'],
    aktiviteter: [
      { titel: 'Bygg återvinningsmaskiner', beskrivning: 'Bygg en låtsasmaskin av kartong och förpackningar som sorterar skräp.' },
      { titel: 'Sorteringsstafett', beskrivning: 'Lagen springer och sorterar (rena, torra) sopor i rätt återvinningstunna på tid.' },
      { titel: 'Miljöquiz', beskrivning: 'Femton frågor om återvinning, energi och natur. Svara med tummen upp/ner.' },
      { titel: 'Skapa konst av skräp', beskrivning: 'Gör en gemensam tavla eller skulptur av rent återvinningsmaterial.' },
      { titel: 'Naturbingo', beskrivning: 'Hitta saker i naturen utan att plocka – kryssa av på bingobrickan.' },
    ],
  },
  {
    id: 'rymden',
    namn: 'Rymden',
    emoji: '🚀',
    aldersgrupper: ['F', '1-3', '4-6'],
    aktiviteter: [
      { titel: 'Bygg en raket', beskrivning: 'Konstruera en raket av rör, papper och tejp – vems flyger längst?' },
      { titel: 'Planetstafett', beskrivning: 'Spring mellan planeterna i rätt ordning från solen och ut.' },
      { titel: 'Rymdquiz', beskrivning: 'Frågor om planeter, stjärnor och astronauter.' },
      { titel: 'Måndans', beskrivning: 'Rör er i slow motion som om ni svävar i tyngdlöshet.' },
      { titel: 'Stjärnbilder', beskrivning: 'Måla egna stjärnbilder med vita prickar på svart papper.' },
    ],
  },
  {
    id: 'havet',
    namn: 'Havet',
    emoji: '🌊',
    aldersgrupper: ['F', '1-3', '4-6'],
    aktiviteter: [
      { titel: 'Hela havet stormar', beskrivning: 'Klassikern med stolar – en stol färre varje runda.' },
      { titel: 'Fiska skräp', beskrivning: 'Fiska upp "plast" (papperslappar) ur havet med metspö av pinne och snöre.' },
      { titel: 'Havsdjursquiz', beskrivning: 'Gissa havsdjuret utifrån ledtrådar.' },
      { titel: 'Bygg ett akvarium', beskrivning: 'Skapa ett papperakvarium med egna fiskar och växter.' },
      { titel: 'Vågrörelse', beskrivning: 'Stå i ring och skicka en "våg" runt med armarna.' },
    ],
  },
  {
    id: 'riddartiden',
    namn: 'Riddartiden',
    emoji: '🏰',
    aldersgrupper: ['F', '1-3', '4-6'],
    aktiviteter: [
      { titel: 'Bygg en borg', beskrivning: 'Bygg en borg av kuddar, kartong eller klossar.' },
      { titel: 'Riddarbana', beskrivning: 'Hinderbana där man tränar till riddare/väpnare.' },
      { titel: 'Drakjakt', beskrivning: 'Variant av kull där den som kullas blir drake.' },
      { titel: 'Gör en sköld', beskrivning: 'Designa och måla ett eget vapensköldmärke.' },
      { titel: 'Riddarquiz', beskrivning: 'Frågor om slott, riddare och medeltiden.' },
    ],
  },
  {
    id: 'kanslor-vanskap',
    namn: 'Känslor & vänskap',
    emoji: '💛',
    aldersgrupper: ['F', '1-3', '4-6'],
    aktiviteter: [
      { titel: 'Känslocharader', beskrivning: 'Visa en känsla med kroppen – de andra gissar.' },
      { titel: 'Komplimangcirkel', beskrivning: 'Sitt i ring och ge personen bredvid en ärlig komplimang.' },
      { titel: 'Vänskapsträd', beskrivning: 'Rita ett träd där varje löv är något som gör en bra kompis.' },
      { titel: 'Samarbetsknut', beskrivning: 'Håll varandra i händerna i en knut och lös upp den tillsammans.' },
      { titel: 'Lugn andning', beskrivning: 'Andas lugnt tillsammans och landa i kroppen efter en lek.' },
    ],
  },
  {
    id: 'varen',
    namn: 'Våren',
    emoji: '🌱',
    aldersgrupper: ['F', '1-3', '4-6'],
    aktiviteter: [
      { titel: 'Plantera frön', beskrivning: 'Så frön i krukor och följ hur de växer veckorna framåt.' },
      { titel: 'Vårtecken-jakt', beskrivning: 'Leta vårtecken ute: knoppar, fåglar, insekter.' },
      { titel: 'Blomsterkrans', beskrivning: 'Gör kransar och kreationer av maskrosor och löv.' },
      { titel: 'Hoppa hage', beskrivning: 'Rita hagar med krita och hoppa tillsammans.' },
      { titel: 'Fågelquiz', beskrivning: 'Känn igen vanliga vårfåglar på bild och läte.' },
    ],
  },
  {
    id: 'sommaren',
    namn: 'Sommar',
    emoji: '☀️',
    aldersgrupper: ['F', '1-3', '4-6'],
    aktiviteter: [
      { titel: 'Vattenstafett', beskrivning: 'Bär vatten i svamp eller mugg till lagets hink – minst spill vinner.' },
      { titel: 'Insektssafari', beskrivning: 'Leta småkryp med lupp och bestäm vad ni hittar tillsammans.' },
      { titel: 'Kritkonst på asfalt', beskrivning: 'Måla stora gemensamma konstverk med gatukrita.' },
      { titel: 'Picknick-lek', beskrivning: 'Planera och duka en låtsaspicknick – samarbeta om vad som behövs.' },
      { titel: 'Sommarquiz', beskrivning: 'Frågor om sol, bad, sommardjur och midsommar.' },
    ],
  },
  {
    id: 'hosten',
    namn: 'Höst',
    emoji: '🍂',
    aldersgrupper: ['F', '1-3', '4-6'],
    aktiviteter: [
      { titel: 'Lövjakt & lövkonst', beskrivning: 'Samla löv i olika färger och gör tavlor eller kransar.' },
      { titel: 'Svamp- och bärquiz', beskrivning: 'Lär er vilka svampar och bär man får plocka – och vilka man inte ska röra.' },
      { titel: 'Kastanjebana', beskrivning: 'Bygg en bana där kastanjer eller kottar ska rulla i mål.' },
      { titel: 'Vindlekar', beskrivning: 'Gör drakar eller vimplar och se hur de rör sig i höstvinden.' },
      { titel: 'Mysig lässtund', beskrivning: 'Varva ner med högläsning och en lugn höststund inomhus.' },
    ],
  },
  {
    id: 'vintern',
    namn: 'Vintern',
    emoji: '❄️',
    aldersgrupper: ['F', '1-3', '4-6'],
    aktiviteter: [
      { titel: 'Snöskulpturer', beskrivning: 'Bygg figurer och skulpturer av snö i lag.' },
      { titel: 'Spårjakt i snön', beskrivning: 'Följ spår i snön – vem eller vilket djur gick här?' },
      { titel: 'Pulkastafett', beskrivning: 'Dra och åk pulka i en stafett (där det är säkert).' },
      { titel: 'Pyssla pappersstjärnor', beskrivning: 'Vik och klipp snöflingor och stjärnor av papper.' },
      { titel: 'Vinterquiz', beskrivning: 'Frågor om snö, is, djur på vintern och högtider.' },
    ],
  },

  // ── Lgr22-förankrade teman för åk 1–3 (NO & SO) ──────────────────────────
  // Aktiviteterna är fritidsanpassade ingångar till det centrala innehållet.
  {
    id: 'no-biologi',
    namn: 'NO: Biologi – natur & liv',
    emoji: '🐛',
    aldersgrupper: ['1-3'],
    aktiviteter: [
      { titel: 'Naturen och årstidernas växlingar', beskrivning: 'Följ samma träd eller plats över tid och dokumentera hur den förändras med årstiderna.' },
      { titel: 'Djur, växter och deras livsmiljöer', beskrivning: 'Gå på upptäcktsfärd och para ihop djur och växter med var de bor.' },
      { titel: 'Kropp och hälsa', beskrivning: 'Rörelselekar och samtal om vila, mat och känslor – vad kroppen behöver för att må bra.' },
      { titel: 'Enkla undersökningar', beskrivning: 'Plantera frön i olika förhållanden (ljus/mörker, vatten/torrt) och se vad som händer.' },
    ],
  },
  {
    id: 'no-kemi',
    namn: 'NO: Kemi – material & ämnen',
    emoji: '⚗️',
    aldersgrupper: ['1-3'],
    aktiviteter: [
      { titel: 'Material och ämnen i vardagen', beskrivning: 'Sortera föremål efter material (trä, metall, plast, tyg) och prata om egenskaper.' },
      { titel: 'Fast, flytande och gas', beskrivning: 'Smält is och frys vatten – undersök hur ämnen ändrar form.' },
      { titel: 'Blanda och lösa', beskrivning: 'Testa vad som löser sig i vatten (socker, salt, sand) och samtala om resultatet.' },
      { titel: 'Ren eller smutsig?', beskrivning: 'Enkla experiment om vatten och rening – varför vi sorterar och återvinner.' },
    ],
  },
  {
    id: 'no-fysik',
    namn: 'NO: Fysik – kraft, ljus & ljud',
    emoji: '🧲',
    aldersgrupper: ['1-3'],
    aktiviteter: [
      { titel: 'Kraft och rörelse', beskrivning: 'Bygg en kulbana eller testa hur saker rullar i backe – vad får dem att röra sig?' },
      { titel: 'Ljus och skugga', beskrivning: 'Gör skuggteater och undersök hur skuggor ändras med ljusets riktning.' },
      { titel: 'Ljud och vibrationer', beskrivning: 'Bygg egna instrument av burkar och gummiband och utforska höga och låga ljud.' },
      { titel: 'Energi i vardagen', beskrivning: 'Prata om var energi kommer ifrån och lek lekar som visar fart och stopp.' },
    ],
  },
  {
    id: 'no-so-arbetssatt',
    namn: 'Forska & dokumentera',
    emoji: '🔬',
    aldersgrupper: ['1-3'],
    aktiviteter: [
      { titel: 'Undersöka, ställa frågor och samtala', beskrivning: 'Välj något att utforska, gissa tillsammans och prata om vad ni tror händer.' },
      { titel: 'Enkla undersökningar och experiment', beskrivning: 'Gör ett experiment steg för steg – jämför vad ni trodde med vad som hände.' },
      { titel: 'Använda begrepp och enkla källor', beskrivning: 'Slå upp ett ord i en bok eller på en bild och förklara det med egna ord.' },
      { titel: 'Dokumentera observationer och resultat', beskrivning: 'Rita, fota eller skriv ner vad ni märkte – gör en gemensam forskartavla.' },
    ],
  },
  {
    id: 'so-geografi',
    namn: 'SO: Geografi – närområde & väder',
    emoji: '🗺️',
    aldersgrupper: ['1-3'],
    aktiviteter: [
      { titel: 'Närområdet och kartor', beskrivning: 'Rita en egen karta över skolgården och gör en skattjakt med kartan.' },
      { titel: 'Väder, årstider och naturmiljöer', beskrivning: 'För väderdagbok i en vecka och jämför olika dagar.' },
      { titel: 'Väderstreck', beskrivning: 'Lär er norr/söder/öster/väster genom en orienteringslek ute.' },
      { titel: 'Vår plats', beskrivning: 'Bygg en modell av närområdet med klossar eller naturmaterial.' },
    ],
  },
  {
    id: 'so-historia',
    namn: 'SO: Historia – då, nu & sedan',
    emoji: '⏳',
    aldersgrupper: ['1-3'],
    aktiviteter: [
      { titel: 'Tidsbegrepp: dåtid, nutid, framtid', beskrivning: 'Gör en tidslinje med bilder: förr, nu och hur ni tror det blir i framtiden.' },
      { titel: 'Familjens historia', beskrivning: 'Berätta om någon i familjen och något de gjorde när de var barn.' },
      { titel: 'Platsens historia', beskrivning: 'Ta reda på hur skolan eller orten såg ut förr och jämför med idag.' },
      { titel: 'Förr i tidens lekar', beskrivning: 'Prova lekar som barn lekte förr – jämför med dagens lekar.' },
    ],
  },
  {
    id: 'so-religion',
    namn: 'SO: Religion – högtider & livsfrågor',
    emoji: '🕊️',
    aldersgrupper: ['1-3'],
    aktiviteter: [
      { titel: 'Högtider och traditioner', beskrivning: 'Utforska olika högtider under året och skapa något som hör till en av dem.' },
      { titel: 'Berättelser', beskrivning: 'Lyssna på en berättelse och samtala om vad den vill säga.' },
      { titel: 'Livsfrågor om rätt och fel', beskrivning: 'Diskutera kluriga vardagssituationer – vad är schyst att göra?' },
      { titel: 'Vad är viktigt för oss?', beskrivning: 'Prata om vad som gör en bra kompis och vad som känns rättvist.' },
    ],
  },
  {
    id: 'so-samhalle',
    namn: 'SO: Samhälle – regler & rättigheter',
    emoji: '🏛️',
    aldersgrupper: ['1-3'],
    aktiviteter: [
      { titel: 'Regler och demokrati i vardagen', beskrivning: 'Rösta fram en gemensam lek eller regel – alla röster räknas lika.' },
      { titel: 'Barns rättigheter', beskrivning: 'Samtala om barnkonventionen och rita vad alla barn har rätt till.' },
      { titel: 'Yrken och samhällsfunktioner', beskrivning: 'Lek olika yrken och prata om vilka som hjälper oss i samhället.' },
      { titel: 'Pengar och konsumtion', beskrivning: 'Driv en låtsasaffär – öva på att handla, betala och tänka behov vs. vilja.' },
    ],
  },
]

