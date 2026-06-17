import type { Tema } from '../types'

// Modul 1 – Temabanken
// Varje tema samlar alla sina aktiviteter (passar förskoleklass upp till åk 6).
// Aktiviteterna är ordnade ungefär från enklare till mer avancerade.
// Skolans egna teman läggs till i appen och sparas i localStorage (se Temabanken.tsx).
export const TEMAN: Tema[] = [
  {
    id: 'hallbar-utveckling',
    namn: 'Hållbar utveckling',
    emoji: '♻️',
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
    aktiviteter: [
      { titel: 'Snöskulpturer', beskrivning: 'Bygg figurer och skulpturer av snö i lag.' },
      { titel: 'Spårjakt i snön', beskrivning: 'Följ spår i snön – vem eller vilket djur gick här?' },
      { titel: 'Pulkastafett', beskrivning: 'Dra och åk pulka i en stafett (där det är säkert).' },
      { titel: 'Pyssla pappersstjärnor', beskrivning: 'Vik och klipp snöflingor och stjärnor av papper.' },
      { titel: 'Vinterquiz', beskrivning: 'Frågor om snö, is, djur på vintern och högtider.' },
    ],
  },

  // ── Lgr22-förankrade ämnesteman (NO & SO) – aktiviteter från förskoleklass till åk 6 ──
  {
    id: 'no-biologi',
    namn: 'NO: Biologi',
    emoji: '🐛',
    aktiviteter: [
      { titel: 'Naturen och årstidernas växlingar', beskrivning: 'Följ samma träd eller plats över tid och dokumentera hur den förändras med årstiderna.' },
      { titel: 'Djur, växter och deras livsmiljöer', beskrivning: 'Gå på upptäcktsfärd och para ihop djur och växter med var de bor.' },
      { titel: 'Kropp och hälsa', beskrivning: 'Rörelselekar och samtal om vila, mat och känslor – vad kroppen behöver för att må bra.' },
      { titel: 'Människokroppen och hälsa', beskrivning: 'Stationer om puls, andning och vila – mät hur kroppen reagerar på rörelse.' },
      { titel: 'Ekosystem, näringskedjor och hållbar utveckling', beskrivning: 'Bygg en näringskedja som lek och samtala om hur allt hänger ihop.' },
      { titel: 'Djur, växter och deras anpassningar', beskrivning: 'Designa ett påhittat djur som är anpassat till en viss miljö och förklara varför.' },
      { titel: 'Fältstudie i naturen', beskrivning: 'Inventera en ruta i naturen – räkna och jämför vad som lever där.' },
    ],
  },
  {
    id: 'no-kemi',
    namn: 'NO: Kemi',
    emoji: '⚗️',
    aktiviteter: [
      { titel: 'Material och ämnen i vardagen', beskrivning: 'Sortera föremål efter material (trä, metall, plast, tyg) och prata om egenskaper.' },
      { titel: 'Fast, flytande och gas', beskrivning: 'Smält is och frys vatten – undersök hur ämnen ändrar form.' },
      { titel: 'Blanda och lösa', beskrivning: 'Testa vad som löser sig i vatten (socker, salt, sand) och samtala om resultatet.' },
      { titel: 'Materia och ämnens egenskaper', beskrivning: 'Undersök och klassificera ämnen efter egenskaper (löslighet, magnetism, densitet).' },
      { titel: 'Blandningar, lösningar och kemiska processer', beskrivning: 'Gör säkra köksexperiment och separera blandningar.' },
      { titel: 'Vattnets kretslopp', beskrivning: 'Bygg en modell av vattnets kretslopp och förklara avdunstning och nederbörd.' },
      { titel: 'Kemikalier i vardagen', beskrivning: 'Läs faropiktogram och samtala om hur man hanterar vardagskemikalier säkert.' },
    ],
  },
  {
    id: 'no-fysik',
    namn: 'NO: Fysik',
    emoji: '🧲',
    aktiviteter: [
      { titel: 'Kraft och rörelse', beskrivning: 'Bygg en kulbana eller testa hur saker rullar i backe – vad får dem att röra sig?' },
      { titel: 'Ljus och skugga', beskrivning: 'Gör skuggteater och undersök hur skuggor ändras med ljusets riktning.' },
      { titel: 'Ljud och vibrationer', beskrivning: 'Bygg egna instrument av burkar och gummiband och utforska höga och låga ljud.' },
      { titel: 'Energi och energikällor', beskrivning: 'Sortera energikällor i förnybart/icke förnybart och bygg en liten vind- eller vattenmodell.' },
      { titel: 'Ljud, ljus och elektricitet', beskrivning: 'Experimentera med ljud, skuggor och enkla strömkretsar.' },
      { titel: 'Astronomi och solsystemet', beskrivning: 'Bygg en skalmodell av solsystemet ute på skolgården.' },
    ],
  },
  {
    id: 'no-arbetssatt',
    namn: 'NO: Forska & undersök',
    emoji: '🔬',
    aktiviteter: [
      { titel: 'Undersöka, ställa frågor och samtala', beskrivning: 'Välj något att utforska, gissa tillsammans och prata om vad ni tror händer.' },
      { titel: 'Planera och genomföra undersökningar', beskrivning: 'Formulera en hypotes, planera ett test och genomför det steg för steg.' },
      { titel: 'Dokumentera och utvärdera resultat', beskrivning: 'För protokoll, gör en tabell eller diagram och dra slutsatser.' },
      { titel: 'Använda naturvetenskapliga begrepp', beskrivning: 'Förklara ett resultat för gruppen med rätt begrepp.' },
    ],
  },
  {
    id: 'so-geografi',
    namn: 'SO: Geografi',
    emoji: '🗺️',
    aktiviteter: [
      { titel: 'Närområdet och kartor', beskrivning: 'Rita en egen karta över skolgården och gör en skattjakt med kartan.' },
      { titel: 'Väder, årstider och naturmiljöer', beskrivning: 'För väderdagbok i en vecka och jämför olika dagar.' },
      { titel: 'Väderstreck', beskrivning: 'Lär er norr/söder/öster/väster genom en orienteringslek ute.' },
      { titel: 'Kartor och geografiska verktyg', beskrivning: 'Orientering med karta och kompass – lös ett uppdrag med väderstreck och skala.' },
      { titel: 'Sveriges, Europas och världens natur- och kulturlandskap', beskrivning: 'Geografiquiz med kartor – para ihop länder, flaggor och landskap.' },
      { titel: 'Klimat, miljö och hållbar utveckling', beskrivning: 'Kartlägg fritidshemmets miljöpåverkan och föreslå förbättringar.' },
    ],
  },
  {
    id: 'so-historia',
    namn: 'SO: Historia',
    emoji: '⏳',
    aktiviteter: [
      { titel: 'Tidsbegrepp: dåtid, nutid, framtid', beskrivning: 'Gör en tidslinje med bilder: förr, nu och hur ni tror det blir i framtiden.' },
      { titel: 'Familjens och platsens historia', beskrivning: 'Berätta om någon i familjen och ta reda på hur orten såg ut förr.' },
      { titel: 'Förr i tidens lekar', beskrivning: 'Prova lekar som barn lekte förr – jämför med dagens lekar.' },
      { titel: 'Nordens och Sveriges historia', beskrivning: 'Gör en tidslinje över viktiga händelser och placera in dem tillsammans.' },
      { titel: 'Vikingatiden, medeltiden och stormaktstiden', beskrivning: 'Rollspel eller marknad från en tidsepok – kläder, hantverk och lekar.' },
      { titel: 'Historiska källor och tidslinjer', beskrivning: 'Undersök gamla bilder eller föremål – vad kan de berätta, och vad saknas?' },
    ],
  },
  {
    id: 'so-religion',
    namn: 'SO: Religionskunskap',
    emoji: '🕊️',
    aktiviteter: [
      { titel: 'Högtider, traditioner och berättelser', beskrivning: 'Utforska olika högtider under året och skapa något som hör till en av dem.' },
      { titel: 'Livsfrågor om rätt och fel', beskrivning: 'Dilemmasamtal: vad är rätt och fel, och varför tycker vi olika?' },
      { titel: 'Kristendomens grunder', beskrivning: 'Utforska högtider, symboler och berättelser och jämför med egna traditioner.' },
      { titel: 'Judendom, islam, hinduism och buddhism', beskrivning: 'Stationer om världsreligionernas symboler, högtider och byggnader.' },
      { titel: 'Etiska frågor och livsfrågor', beskrivning: 'Samtala om kluriga frågor – hur vill vi vara mot varandra?' },
    ],
  },
  {
    id: 'so-samhalle',
    namn: 'SO: Samhällskunskap',
    emoji: '🏛️',
    aktiviteter: [
      { titel: 'Regler och demokrati i vardagen', beskrivning: 'Rösta fram en gemensam lek eller regel – alla röster räknas lika.' },
      { titel: 'Barns rättigheter', beskrivning: 'Samtala om barnkonventionen och rita vad alla barn har rätt till.' },
      { titel: 'Yrken och samhällsfunktioner', beskrivning: 'Lek olika yrken och prata om vilka som hjälper oss i samhället.' },
      { titel: 'Demokrati och politiska beslut', beskrivning: 'Håll ett eget fritidsråd – lägg förslag, debattera och rösta.' },
      { titel: 'Sveriges lagar och rättigheter', beskrivning: 'Samtala om regler och lagar – varför finns de och vem bestämmer?' },
      { titel: 'Medier och informationsspridning', beskrivning: 'Granska en nyhet eller reklam – vad är fakta, åsikt och påverkan?' },
      { titel: 'Pengar, ekonomi och konsumtion', beskrivning: 'Driv en låtsasaffär eller planera en budget – behov vs. vilja.' },
    ],
  },
  {
    id: 'so-arbetssatt',
    namn: 'SO: Granska & resonera',
    emoji: '🔎',
    aktiviteter: [
      { titel: 'Använda begrepp och enkla källor', beskrivning: 'Slå upp ett ord i en bok eller på en bild och förklara det med egna ord.' },
      { titel: 'Granska information och källor', beskrivning: 'Källkritik-lek: är källan trovärdig? Vem säger det och varför?' },
      { titel: 'Analysera samband mellan människa, samhälle och miljö', beskrivning: 'Rita en tankekarta över hur ett beslut påverkar flera saker.' },
      { titel: 'Resonera kring orsaker och konsekvenser', beskrivning: 'Diskutera "vad händer om...?" och följ kedjan av konsekvenser.' },
    ],
  },
]
