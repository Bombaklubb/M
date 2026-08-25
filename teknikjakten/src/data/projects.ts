import { Project } from '../types';

/**
 * Bokens sju projektuppslag, ett i varje område utom "Vad är teknik?".
 *
 * De ligger här och inte bland kapitlen eftersom appen inte kan rätta ett
 * bygge. Se kommentaren vid Project i types.ts.
 */
export const PROJECTS: Project[] = [
  {
    id: 'projekt-tiny-house',
    title: 'Tiny House',
    emoji: '🏡',
    areaId: 'bostad',
    bookPages: '32–33',
    intro:
      'I dag vill många bo i ett litet hus – de är enkla att sköta, billiga att bo i och miljövänliga eftersom de förbrukar mindre energi och tar mindre mark. Ett Tiny House är ungefär 35 kvadratmeter, alltså till exempel 7 meter långt och 5 meter brett.',
    assignment:
      'Gör en enkel ritning av ett Tiny House och bygg sedan en modell i kartong. I huset ska ett par i 25-årsåldern bo. Båda är intresserade av matlagning och tycker om att bjuda hem kompisar på middag.',
    requirements: [
      'Ett kök där man kan laga mat, med kyl/frys, spis, ugn och diskmaskin. Det ska också finnas en mikrovågsugn och en diskho.',
      'Ett matbord för 6–8 personer. Det kan vara utfällbart.',
      'Ett badrum med toalett, dusch och handfat.',
      'En säng med plats för 2 personer.',
      'Någon ytterligare möbel, till exempel en soffa.',
    ],
    steps: [
      {
        heading: 'Gör en ritning',
        text: 'Börja med en planritning av huset på ett A4-papper. Huset ska vara ungefär 30 cm långt och 20 cm brett på papperet. En planritning visar hur huset ser ut uppifrån – man ska kunna se var kök, badrum, matsalsbord, säng och de andra möblerna ska finnas.',
      },
      {
        heading: 'Bygg en modell',
        text: 'När skissen är klar bygger du en modell av huset i kartong. En skokartong är ungefär 30 cm lång och 20 cm bred, alltså lika stor som din skiss. Alla möbler, vitvaror och all annan inredning ska vara lika stora i modellen som på skissen.',
      },
    ],
    materials: [
      {
        items: [
          'en skokartong eller en annan kartong i ungefär samma storlek',
          'små kartongbitar till väggar, möbler, vitvaror och annan inredning',
          'tyger och träbitar',
          'färgpennor eller målarfärg',
          'kniv, sax, lim och tejp',
        ],
      },
    ],
    tips: [
      'Förslag på mått: vitvarorna, diskhon och mikrovågsugnen 3 cm breda och 8 cm långa tillsammans.',
      'Matbord: 8 cm långt och 4 cm brett. Duschplats: 3 × 3 cm.',
      'Säng för 2 personer: 8 cm lång och 7 cm bred. Soffa: 7 cm lång och 4 cm bred.',
      'En säng blir alltså 8 cm lång och 7 cm bred i modellen, och höjden kan vara ungefär 4 cm.',
      'Vill du göra huset extra fint kan du tapetsera och färglägga väggar och möbler.',
    ],
  },

  {
    id: 'projekt-larmet',
    title: 'Larmet',
    emoji: '🚨',
    areaId: 'vardag',
    bookPages: '56–57',
    intro:
      'Elektriska larm finns på många ställen och kan varna för flera olika saker. Inbrottslarm larmar om någon bryter sig in i en byggnad, brandlarm varnar om det brinner och vattenlarm varnar om vatten har läckt ut.',
    assignment:
      'Bygg en konstruktion och koppla ett larm till den med hjälp av enkla elektriska komponenter. Larmet kan lysa, låta eller röra på sig när modellen öppnas, flyttas eller vidrörs.',
    requirements: [
      'Larmet ska lysa, låta eller röra sig när kretsen sluts.',
      'Larmet ska sitta fast på en konstruktion som du har skapat.',
      'Larmet ska ha en strömbrytare.',
    ],
    steps: [
      {
        heading: 'Gör en skiss',
        text: 'Börja med en enkel skiss av hur konstruktionen ska se ut. Skissen ska visa hur konstruktionen fungerar från olika håll. Använd linjal. Du behöver kanske rita flera skisser för att hitta en bra lösning. Gör även en skiss som visar hur du ska koppla in ditt larm.',
      },
      {
        heading: 'Bygg en modell',
        text: 'När skissen är klar bygger du en modell av konstruktionen och kopplar in larmet. Använd gärna återbrukat material eller det ni har i klassrummet.',
      },
    ],
    materials: [
      {
        heading: 'Till konstruktionen',
        items: [
          'kartong eller wellpapp',
          'plast',
          'glasspinnar',
          'påsnitar',
          'klädnypa',
          'färgpennor',
          'aluminiumfolie',
          'skumgummi',
          'kniv, sax, lim och tejp',
        ],
      },
      {
        heading: 'Till larmet',
        items: [
          'batteri',
          'batterihållare',
          'elsladdar',
          'klämmor',
          'summer',
          'lysdiod',
          'elmotor',
        ],
      },
    ],
    tips: [
      'Du kan använda olika strömbrytare och lampa för ljus, summer för ljud eller motor för rörelse.',
      'Fundera först på vilken typ av larm du behöver – ska det varna för inbrott, brand eller vatten?',
    ],
  },

  {
    id: 'projekt-sittmobel',
    title: 'Sittmöbel',
    emoji: '🪑',
    areaId: 'utveckling',
    bookPages: '76–77',
    intro:
      'Det finns många olika typer av sittmöbler, och det är behoven och önskemålen hos användarna som styr hur de designas. En sittmöbel för att spela datorspel ser inte likadan ut som en möbel att sitta och läsa böcker i.',
    assignment:
      'Gör en skiss av en sittmöbel och bygg sedan en modell av den. Sittmöbeln ska vara ungefär 10 centimeter bred, djup och hög på skissen, och modellen ska vara så lik en riktig sittmöbel som möjligt. Designa den till någon av personerna nedan.',
    requirements: [
      'En arkitekt som vill ha en skön sittmöbel med ett utfällbart fotstöd. Arkitekten vill kunna sitta i möbeln och tänka på nya idéer till hus. Den ska ha plats för pennor och ritblock.',
      'En frisör som vill ha en möbel att sitta på när hen klipper sina kunder. Möbeln ska kunna snurra och vara höj- och sänkbar. Den ska ha plats för kammar, saxar och en hårfön.',
      'En dykare som vill ha en möbel att sitta på när hen ska ta av sig sin dykarutrustning. Den ska vara stabil och tåla vatten.',
      'Ett 1-årigt barn som behöver en möbel att sitta i när hen äter. Möbeln måste vara stabil och säker för barnet.',
    ],
    steps: [
      {
        heading: 'Gör en skiss',
        text: 'Börja med en enkel skiss av hur möbeln ska se ut på ett A4-papper. Möbeln ska vara ungefär 10 cm hög, bred och djup på skissen. På skissen ska det synas hur stolens olika sidor ser ut. Använd linjal. Du behöver kanske rita flera skisser för att hitta en bra lösning.',
      },
      {
        heading: 'Bygg en modell',
        text: 'När skissen är klar bygger du en modell av sittmöbeln i kartong. Använd gärna andra material också, för att visa hur du tänker att möbeln ska se ut. Modellen ska ha ungefär samma mått som på skissen, alltså vara ungefär 10 cm bred, hög och djup.',
      },
    ],
    materials: [
      {
        items: [
          'kartong eller wellpapp',
          'tyger och plast',
          'blompinnar eller andra runda pinnar',
          'glasspinnar och träbitar',
          'flörtkulor eller träkulor till hjul',
          'färg',
          'kniv, sax, lim och tejp',
        ],
      },
    ],
    tips: [
      'Börja med att fundera på hur personen ska använda möbeln, alltså vilka funktioner den ska ha.',
      'Personer som har svårt att resa sig upp från en stol behöver kanske en hög stol – små barn kommer däremot inte upp på stolen om den är för hög.',
    ],
  },

  {
    id: 'projekt-mekaniska-ladan',
    title: 'Mekaniska lådan',
    emoji: '📦',
    areaId: 'rorelse',
    bookPages: '98–99',
    intro:
      'Människor har länge utnyttjat mekanismer för att skapa och överföra olika sorters rörelser, till exempel länkar. Länkar består ofta av stänger som överför en rörelse från ett ställe till ett annat. Vi hittar dem i paraplyer, symaskiner, cykelkedjor och vindrutetorkare på bilar.',
    assignment:
      'Skapa en låda som kan öppnas och stängas med hjälp av länkar. Lådan ska designas för att visa något som du gillar eller tycker är spännande. Hur ser en låda ut för någon som gillar hästar, datorspel eller spindlar? Lådan och länkarna ska byggas av återbrukat material, till exempel en mjölkkartong eller någon annan förpackning.',
    requirements: [
      'Lådan ska öppnas och stängas med hjälp av länkar och leder.',
      'Lådan ska designas så att den visar vad du gillar eller tycker är spännande.',
    ],
    steps: [
      {
        heading: 'Gör en skiss',
        text: 'Börja med en enkel skiss av hur lådan ska se ut. På skissen ska man kunna se lådans olika sidor. Skissa sedan hur dina länkar ska se ut och fungera. Kanske behöver du rita flera skisser för att hitta en bra lösning.',
      },
      {
        heading: 'Gör en modell',
        text: 'När du är färdig med skissen bygger du en modell av en mjölkförpackning eller någon annan liknande kartong. Använd återbrukat material och annat som ni har i klassrummet för att skapa både lådan och länkarna.',
      },
    ],
    materials: [
      {
        items: [
          'en mjölkförpackning eller liknande',
          'påsnitar eller gem',
          'plast till länkar, exempelvis ett plastlock till en glassburk',
          'eventuellt glasspinnar för att göra konstruktionen stabilare',
          'färgpennor och papper',
          'kniv, sax, limstift, limpistol, tejp och eventuellt en syl att göra hål med',
        ],
      },
    ],
    tips: [
      'Klipp upp kartongen längs tre av sidorna. Spara den fjärde sidan så kan den fungera som ett gångjärn.',
      'Om du hinner: skapa ett lås eller någon annan funktion med hjälp av mekanismer.',
    ],
  },

  {
    id: 'projekt-stationen',
    title: 'Stationen',
    emoji: '🚉',
    areaId: 'system',
    bookPages: '122–123',
    intro:
      'I en stad behövs en järnvägsstation med parkeringar och vägar. Människor använder stationen för att resa till och från staden. Vid stationen behöver det finnas en busshållplats, cykelparkeringar, taxiplatser och bilparkeringar. Inne i stationshuset ska det finnas plats för folk som väntar på tåg, men även möjligheter att äta på restaurang och köpa med sig mat och dryck.',
    assignment:
      'Gör en planritning över hur stationsområdet skulle kunna se ut. Skissen ska visa järnvägar till och från stationen, en busshållplats, parkeringar för bil och cykel samt taxiplatser. Man ska se stationshuset, järnvägen, vägar, parkeringar och allt annat uppifrån.',
    requirements: [
      'Tre spår som leder in till och ut från stationen.',
      'En busshållplats utanför stationen.',
      'Taxiplatser nära ingången.',
      'Cykelparkeringar utanför stationen.',
      'Bilparkeringar i närheten av stationen.',
    ],
    steps: [
      {
        heading: 'Gör en ritning',
        text: 'Fäst ihop två A3-papper och gör en stor ritning över hur hela området runt stationen ska se ut. Du kan själv bestämma var in- och utgångar ska vara på stationen.',
      },
    ],
    materials: [
      {
        items: [
          'två A3-papper',
          'pennor, sax, lim och linjal',
        ],
      },
    ],
    tips: [
      'För att vägarna och parkeringarna ska bli lagom stora kan du använda dessa mått:',
      'järnväg: 2 cm bred · bilväg: 4 cm bred · cykelväg: 2 cm bred',
      'bil: 2 cm lång, 1 cm bred · buss: 6 cm lång, 1 cm bred',
    ],
  },

  {
    id: 'projekt-rorelsesensor',
    title: 'Rörelsesensor',
    emoji: '📲',
    areaId: 'digital',
    bookPages: '152–153',
    intro:
      'Sensorer används överallt där digital teknik finns. Informationen från olika sensorer gör att en dator kan läsa av sin omgivning. Med hjälp av en rörelsesensor kan mobiltelefoner känna av hur bilden på skärmen ska visas, beroende på om telefonen är stående eller liggande. Stegräknare och airbags i bilar använder sensorer för att mäta hastighet och rörelser. En rörelsesensor kan också kallas accelerometer.',
    assignment:
      'Skapa ett program som aktiveras med hjälp av en rörelsesensor på en liten dator som kallas micro:bit. När du skakar din micro:bit ska programmet starta och visas på den lilla inbyggda skärmen.',
    requirements: [
      'Använd en lärplatta eller dator och bygg ett program.',
      'Låt programmet styra en micro:bit med hjälp av en rörelsesensor.',
    ],
    steps: [
      {
        heading: 'Skissa din programmering',
        text: 'Börja med att fundera över vad som ska hända i ditt program när rörelsesensorn aktiveras. Skriv ner vad som ska hända och i vilken ordning. Exempel: Jag vill att micro:biten skriver Hej! på skärmen när jag skakar den. Det kan se ut så här: När skaka micro:bit – visa "Hej!" på skärmen.',
      },
      {
        heading: 'Skapa ett program',
        text: 'Starta programverktyget Makecode på makecode.microbit.org och leta fram blocket "när skaka". Koda och testa tills du har byggt ett fungerande program.',
      },
      {
        heading: 'Aktivera en micro:bit',
        text: 'Följ instruktionerna i Makecode för att föra över programmet. Koppla samman micro:biten med din dator eller lärplatta. Till datorn är det vanligt att använda sladd och till lärplattan Bluetooth. När du har fört över programmet kan du testa det på din micro:bit.',
      },
      {
        heading: 'Dokumentera',
        text: 'Ta en skärmdump av ditt program och spara den. Beskriv steg för steg hur ditt program fungerar. Tänk på att skriva så tydligt som möjligt.',
      },
    ],
    materials: [
      {
        items: [
          'en micro:bit',
          'batterier och batterihållare',
          'en dator eller lärplatta',
        ],
      },
    ],
    tips: [
      'Du kan testa om ditt program fungerar direkt på skärmen, innan du för över det.',
      'Använd appen Micro:bit om du jobbar med lärplatta.',
    ],
  },

  {
    id: 'projekt-servoladan',
    title: 'Servolådan',
    emoji: '⚙️',
    areaId: 'digital',
    bookPages: '154–155',
    intro:
      'En servomotor är en typ av elektrisk motor som används för att styra och reglera rörelser väldigt exakt. För att få en robots armar eller gripklor att röra sig används ofta servomotorer. Radiostyrda fordon som bilar och drönare innehåller också servomotorer, och i 3D-skrivare används de för att skapa exakta utskrifter och mönster.',
    assignment:
      'Skapa en låda som kan öppnas och stängas med hjälp av en servomotor och en micro:bit. Det kan till exempel vara en låda för godis som ska öppnas när du trycker på knapp A på micro:biten och stängas när du trycker på knapp B. Hur lådan ska se ut bestämmer du själv. Återbruka gärna en mjölkkartong eller liknande för att bygga lådan.',
    requirements: [
      'Lådan ska kunna öppnas och stängas med hjälp av en servomotor.',
      'Du behöver programmera micro:biten så att servomotorn aktiveras när du trycker på en av knapparna.',
      'Servomotorn är en liten elmotor med en arm på som kan vridas fram och tillbaka väldigt exakt.',
    ],
    steps: [
      {
        heading: 'Gör en skiss av lådan',
        text: 'Börja med att göra en enkel skiss av hur lådan ska se ut. På skissen ska man kunna se vad som ska förvaras i den och hur din lösning för att öppna locket ska se ut. Du kanske behöver rita flera skisser för att hitta en bra lösning.',
      },
      {
        heading: 'Bygg din låda',
        text: 'Bygg lådan utifrån skissen. Fundera på var servomotorn behöver sitta för att locket ska öppnas och stängas. Använd ett gem för att skapa en förlängd arm på servomotorn så att locket kan öppnas lättare. Se till att servomotorn enkelt går att ta loss från din konstruktion så att fler kan använda samma motor.',
      },
      {
        heading: 'Skapa ett program',
        text: 'Starta Makecode på makecode.microbit.org och tryck på TILLÄGG i menyn. Välj servostyrning. Välj sedan vilken knapp som ska användas för att öppna locket och hur mycket locket ska öppnas. I exemplet vrider sig servomotorns arm 180° när knapp A trycks in, och tillbaka till 0° när knapp B trycks in.',
      },
      {
        heading: 'Aktivera en micro:bit',
        text: 'Använd sladdar för att koppla servomotorn till micro:biten. I exemplets program kopplas motorns röda sladd till 3v, den svarta till Gnd och den vita till 0. Följ sedan instruktionerna i Makecode för att föra över programmet.',
      },
    ],
    materials: [
      {
        heading: 'Till lådan',
        items: [
          'en förpackning eller kartong',
          'ett gem',
          'glasspinnar',
          'färgpennor',
          'kniv och sax',
          'lim, limpistol och tejp',
          'en tång',
          'en syl eller borr',
        ],
      },
      {
        heading: 'Till styrningen',
        items: [
          'en micro:bit',
          'ett batteri och en batterihållare',
          'en servomotor och sladdar',
          'en dator eller lärplatta',
        ],
      },
    ],
    tips: [
      'Om du jobbar på en lärplatta eller inte har en sladd från datorn till micro:biten behövs alltid ett batteri.',
      'Ibland behöver servomotorn ett batteri även om du använder en sladd. Du får testa dig fram.',
    ],
  },
];
