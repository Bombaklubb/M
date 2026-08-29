#!/usr/bin/env node
//
// Tio nya texter om kampsport, en per nivå.
//
// Ämnet saknades helt i biblioteket. Sport fanns, men bara i form av boll,
// löpning och skate. Kampsport ger något de andra sportexterna inte gör: den
// har en uttalad etik (bugningen, respekten för motståndaren) och en verklig
// målkonflikt (skadorna), vilket bär de resonerande frågorna i de högre
// nivåerna.
//
// Texterna går från konkret till abstrakt med nivån:
//   1–2  första gången på träningen, bältet
//   3–5  vad judo är, en förlorad match, en gradering som inte gick vägen
//   6–7  varför man bugar, vägen från stridskonst till olympisk gren
//   8–10 viktklasser, barn och slag mot huvudet, budo som handelsvara
//
// Bilderna är sökta hos Unsplash, nedladdade och granskade en och en innan de
// tilldelades. Unsplashs egna alt-texter stämde inte: bilden på två barn i
// karatedräkt beskrevs som "man in white button up shirt and green necktie".
// Adresserna är hämtade ur urls.raw, inte byggda av sökträffens id.
//
// Kör med --dry för att se vad som skulle läggas till utan att skriva.

const fs = require('fs');
const path = require('path');

const BILD = (slug) => `https://images.unsplash.com/${slug}?w=600&h=400&fit=crop`;

const TEXTER = [
  // ─────────────────────────────────────────────────────────────── nivå 1 ──
  {
    id: 'ak1-kampsport-01',
    grade: 1,
    genre: 'berättelse',
    theme: 'kampsport',
    title: 'Första gången på karate',
    imageUrl: BILD('photo-1583668023935-b79e1c1af0a2'), // två barn i karatedräkt, grönt och blått bälte
    text:
      'Nora bugar i dörren. Sedan går hon in i salen.\n\n' +
      'Golvet är mjukt. Alla barn står på en rad.\n\n' +
      'Tränaren visar hur man ska stå. Fötterna isär och händerna upp.\n\n' +
      'Nora gör likadant. Hon vinglar till.\n\n' +
      'En pojke bredvid henne ler.\n\n' +
      '"Så gjorde jag också första gången", viskar han.\n\n' +
      'Nora ler tillbaka. Hon vill komma igen nästa vecka.',
    questions: [
      {
        type: 'literal',
        q: 'Vad gör Nora i dörren?',
        options: ['Hon bugar', 'Hon ropar', 'Hon springer', 'Hon vinkar'],
        correct: 0,
      },
      {
        type: 'literal',
        q: 'Hur känns golvet i salen?',
        options: ['Det är hårt', 'Det är blött', 'Det är mjukt', 'Det är kallt'],
        correct: 2,
      },
      {
        type: 'ord',
        q: 'Vad betyder ordet vinglar?',
        options: ['Står ostadigt', 'Sjunger högt', 'Sover gott', 'Springer fort'],
        correct: 0,
      },
      {
        type: 'inferens',
        q: 'Varför viskar pojken att han också vinglade?',
        options: [
          'För att han vill vinna över henne',
          'För att han tycker att hon är dålig',
          'För att tränaren har sagt åt honom',
          'För att Nora inte ska känna sig ensam',
        ],
        correct: 3,
      },
      {
        type: 'literal',
        q: 'När vill Nora komma tillbaka?',
        options: ['I morgon bitti', 'Nästa vecka', 'Om ett helt år', 'Efter maten'],
        correct: 1,
      },
      {
        type: 'sammanfatta',
        q: 'Vad handlar texten mest om?',
        options: [
          'En pojke som lär sig att buga',
          'En sal där golvet är mjukt',
          'En flicka som provar karate',
          'En tränare som visar en spark',
        ],
        correct: 2,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────── nivå 2 ──
  {
    id: 'ak2-kampsport-01',
    grade: 2,
    genre: 'berättelse',
    theme: 'kampsport',
    title: 'Det gula bältet',
    imageUrl: BILD('photo-1637552324091-39b10b698497'), // händer som knyter ett gult bälte
    text:
      'Elias hade tränat judo i ett år. Hans bälte var vitt.\n\n' +
      'På torsdagen skulle han visa vad han kunde. Han kastade sin kompis försiktigt. ' +
      'Sedan föll han själv och rullade runt.\n\n' +
      'Efter kastet satte han sig på knä och väntade.\n\n' +
      'Tränaren gick längs raden. Hon räckte fram ett gult bälte.\n\n' +
      '"Du har övat varje vecka", sa hon. "Det syns."\n\n' +
      'Elias knöt bältet hårt om magen. Det kändes tyngre än det såg ut.\n\n' +
      'Hemma la han bältet på skrivbordet. Han ville se det direkt när han vaknade.',
    questions: [
      {
        type: 'literal',
        q: 'Hur länge hade Elias tränat judo?',
        options: ['I en vecka', 'I ett år', 'I tre dagar', 'I nio år'],
        correct: 1,
      },
      {
        type: 'literal',
        q: 'Vilken färg hade Elias bälte från början?',
        options: ['Det var gult', 'Det var svart', 'Det var vitt', 'Det var blått'],
        correct: 2,
      },
      {
        type: 'inferens',
        q: 'Varför säger tränaren att det syns att Elias har övat?',
        options: [
          'För att han har ett nytt bälte på sig',
          'För att han kastar och faller säkert',
          'För att han kommer först till salen',
          'För att han står längst fram i raden',
        ],
        correct: 1,
      },
      {
        type: 'ord',
        q: 'Vad menas med att bältet kändes tyngre än det såg ut?',
        options: [
          'Att bältet var gjort av järn',
          'Att bältet var blött av regn',
          'Att bältet satt alldeles för hårt',
          'Att bältet betydde mycket för honom',
        ],
        correct: 3,
      },
      {
        type: 'inferens',
        q: 'Varför lägger Elias bältet på skrivbordet?',
        options: [
          'För att han är stolt över det',
          'För att han har tappat bort lådan',
          'För att det inte får plats i väskan',
          'För att tränaren har sagt att han ska',
        ],
        correct: 0,
      },
      {
        type: 'sammanfatta',
        q: 'Vilken rubrik passar bäst till texten?',
        options: [
          'En torsdag i simhallen',
          'Kompisen som inte kom',
          'Ett år av träning lönar sig',
          'Tränaren som glömde bort raden',
        ],
        correct: 2,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────── nivå 3 ──
  {
    id: 'ak3-kampsport-01',
    grade: 3,
    genre: 'faktatext',
    theme: 'kampsport',
    title: 'Vad är judo?',
    imageUrl: BILD('photo-1515025617920-e1e674b5033c'), // judokast på blå och röd matta
    text:
      'Judo är en kampsport som kommer från Japan. Namnet betyder ungefär "den mjuka vägen". ' +
      'Den som tränar judo lär sig att kasta, att hålla fast och att falla utan att slå sig.\n\n' +
      'I judo slår och sparkar man inte. I stället använder man motståndarens egen rörelse. ' +
      'Om någon trycker framåt kan man dra i samma riktning i stället för att stå emot. ' +
      'Då tappar motståndaren balansen, och kastet blir lättare.\n\n' +
      'Träningen sker på en matta som kallas tatami. Det första man övar är att falla. ' +
      'Ett bra fall skyddar huvudet och sprider kraften över hela kroppen.\n\n' +
      'Den som tränar judo bär en dräkt av tjockt tyg. Runt midjan sitter ett bälte. ' +
      'Färgen visar hur långt utövaren har kommit. Nybörjaren har vitt bälte, och efter ' +
      'många år av träning kan man få svart.\n\n' +
      'Judo blev olympisk sport år 1964. I dag tränar miljoner människor judo, i alla åldrar. ' +
      'Många börjar för att det ser spännande ut. De flesta stannar kvar för att de trivs i gruppen.',
    questions: [
      {
        type: 'literal',
        q: 'Vilket land kommer judo från?',
        options: ['Judo kommer från Kina', 'Judo kommer från Japan', 'Judo kommer från Korea', 'Judo kommer från Brasilien'],
        correct: 1,
      },
      {
        type: 'ord',
        q: 'Vad betyder ordet judo ungefär?',
        options: ['Den snabba foten', 'Den starka handen', 'Den mjuka vägen', 'Den långa resan'],
        correct: 2,
      },
      {
        type: 'literal',
        q: 'Vad är det första man övar i judo?',
        options: ['Att falla på rätt sätt', 'Att sparka mot huvudet', 'Att springa runt mattan', 'Att knyta bältet rätt'],
        correct: 0,
      },
      {
        type: 'inferens',
        q: 'Varför drar man i samma riktning som motståndaren trycker?',
        options: [
          'För att det ser snyggare ut för publiken',
          'För att domaren kräver att man gör så',
          'För att man ska hinna vila lite mellan kasten',
          'För att motståndarens egen kraft ska göra jobbet',
        ],
        correct: 3,
      },
      {
        type: 'literal',
        q: 'Vad visar färgen på bältet?',
        options: [
          'Vilken klubb utövaren tränar i',
          'Hur långt utövaren har kommit',
          'Hur gammal utövaren är',
          'Vilken vikt utövaren har',
        ],
        correct: 1,
      },
      {
        type: 'sammanfatta',
        q: 'Vad handlar texten mest om?',
        options: [
          'Ett OS-år som förändrade Japan',
          'En matta som kallas för tatami',
          'Vad judo är och hur det går till',
          'Hur man knyter ett svart bälte',
        ],
        correct: 2,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────── nivå 4 ──
  {
    id: 'ak4-kampsport-01',
    grade: 4,
    genre: 'berättelse',
    theme: 'kampsport',
    title: 'Poängen som försvann',
    imageUrl: BILD('photo-1601878458462-487dd38a06f1'), // grupp i karatedräkt tränar spark utomhus
    text:
      'Sara hade sett fram emot tävlingen i flera veckor. Hon hade tränat samma kombination ' +
      'om och om igen: en snabb spark, sedan ett steg bakåt.\n\n' +
      'I första matchen fungerade allt. Hon ledde med tre poäng när domaren stoppade matchen ' +
      'för att rätta till hennes skydd.\n\n' +
      'I andra matchen mötte hon en tjej från en klubb i grannstaden. Sara sparkade tidigt ' +
      'och träffade. Hon väntade på att domaren skulle höja handen, men handen kom aldrig upp.\n\n' +
      '"Utanför mattan", sa domaren.\n\n' +
      'Sara tittade ner. Hennes bakre fot hade glidit över den röda linjen. Poängen räknades inte.\n\n' +
      'Efter det blev hon arg på sig själv. Hon sparkade hårdare, men hon glömde steget bakåt. ' +
      'Motståndaren kom innanför och tog två poäng. Matchen tog slut och Sara förlorade.\n\n' +
      'I omklädningsrummet satt hon länge med skorna i knät. Hennes tränare satte sig bredvid.\n\n' +
      '"Vad tänker du på?" frågade han.\n\n' +
      '"Att jag borde ha vunnit."\n\n' +
      '"Kanske det. Men vet du vad du gjorde bra?"\n\n' +
      'Sara ryckte på axlarna.\n\n' +
      '"Du sparkade rätt. Det var fötterna som stod fel. Det är lättare att laga än en dålig spark."\n\n' +
      'Sara sa ingenting, men på vägen hem tänkte hon på linjen. Nästa träning ställde hon sig ' +
      'vid kanten av mattan och övade steget bakåt, om och om igen, tills hon kunde känna var ' +
      'linjen gick utan att titta.',
    questions: [
      {
        type: 'literal',
        q: 'Varför räknades inte Saras poäng i andra matchen?',
        options: [
          'Hon sparkade alldeles för hårt',
          'Hennes fot var utanför linjen',
          'Hon hade fel skydd på sig',
          'Hon träffade inte motståndaren',
        ],
        correct: 1,
      },
      {
        type: 'inferens',
        q: 'Varför tar motståndaren två poäng senare i matchen?',
        options: [
          'För att Sara slutade med steget bakåt',
          'För att domaren dömde helt fel igen',
          'För att Sara var tröttare än vanligt',
          'För att mattan var hal på ett ställe',
        ],
        correct: 0,
      },
      {
        type: 'ord',
        q: 'Vad menas med en kombination i texten?',
        options: [
          'En kod som låser upp ett skåp',
          'En grupp som tränar tillsammans',
          'En regel som domaren måste följa',
          'Flera rörelser som hänger ihop',
        ],
        correct: 3,
      },
      {
        type: 'inferens',
        q: 'Vad menar tränaren när han säger att fötterna är lättare att laga?',
        options: [
          'Att skorna hennes går att byta ut',
          'Att felet går att öva bort ganska snabbt',
          'Att hon borde ha tränat mycket mer förut',
          'Att domaren nog kommer att ändra sig sen',
        ],
        correct: 1,
      },
      {
        type: 'literal',
        q: 'Vad gör Sara på nästa träning?',
        options: [
          'Hon byter till en annan klubb',
          'Hon tränar sparken ännu hårdare',
          'Hon övar steget vid mattans kant',
          'Hon pratar med domaren om matchen',
        ],
        correct: 2,
      },
      {
        type: 'forfattarens-syfte',
        q: 'Varför slutar berättelsen med att Sara övar vid kanten?',
        options: [
          'För att visa att domare ofta gör fel',
          'För att visa att tävlingar sällan är rättvisa',
          'För att visa att hon gjorde något av besvikelsen',
          'För att visa att hon inte ville träna spark mer',
        ],
        correct: 2,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────── nivå 5 ──
  {
    id: 'ak5-kampsport-01',
    grade: 5,
    genre: 'berättelse',
    theme: 'kampsport',
    title: 'Graderingen',
    imageUrl: BILD('photo-1616447285364-f1461103ee36'), // barn i kampsportsdräkt i träningssal
    text:
      'Hela hösten hade Milo räknat dagar till graderingen. Ett blått bälte, hade han tänkt. ' +
      'Sedan skulle han vara en av de äldre i gruppen.\n\n' +
      'Salen var full den kvällen. Föräldrar satt längs väggen med jackorna i knät. ' +
      'Milo stod på rad med sex andra och kände hur hjärtat slog ända upp i halsen.\n\n' +
      'De första momenten gick bra. Han visste var händerna skulle vara och han hörde sin egen ' +
      'röst när han räknade på japanska. Men vid tredje formen hände något. Han började på fel fot.\n\n' +
      'Han märkte det direkt. Resten av raden vände åt ett håll och han åt ett annat. ' +
      'Han försökte hitta tillbaka, men rörelserna kom i fel ordning, och ju mer han skyndade ' +
      'sig desto längre bort hamnade han.\n\n' +
      'När det var över gick tränaren längs raden och delade ut bälten. Milo fick behålla sitt gula.\n\n' +
      '"Du får göra om formen i vår", sa hon.\n\n' +
      'Han nickade utan att titta upp. Hemma la han träningsväskan i hallen och gick förbi den ' +
      'i flera dagar utan att öppna den. Mamma frågade en kväll vad som hade hänt. Han svarade ' +
      'att det inte var något särskilt.\n\n' +
      'På torsdagen frågade pappa om han skulle till träningen.\n\n' +
      '"Jag vet inte", sa Milo.\n\n' +
      '"Vad är det värsta som kan hända om du går dit?"\n\n' +
      'Milo tänkte efter. Det värsta var egentligen inte att göra fel. Det värsta var att alla ' +
      'andra hade sett honom göra det.\n\n' +
      'Han gick ändå. I dörren mötte han Alva, som hade fått blått bälte samma kväll.\n\n' +
      '"Skönt att du kom", sa hon. "Jag missade nästan hela formen i våras. Ingen kommer ihåg det."\n\n' +
      'Milo insåg att han inte hade tänkt på Alvas gradering en enda gång. Han hade bara tänkt ' +
      'på sin egen.\n\n' +
      'I vår gjorde han om formen. Den gången började han på rätt fot, och han visste redan ' +
      'innan tränaren sa något att det hade gått bra.',
    questions: [
      {
        type: 'literal',
        q: 'Vilket bälte fick Milo behålla efter graderingen?',
        options: ['Det blå bältet', 'Det gula bältet', 'Det vita bältet', 'Det gröna bältet'],
        correct: 1,
      },
      {
        type: 'literal',
        q: 'Vad gick fel för Milo under graderingen?',
        options: [
          'Han började den tredje formen på fel fot',
          'Han kom för sent till salen den kvällen',
          'Han glömde bältet hemma i träningsväskan',
          'Han räknade på svenska i stället för japanska',
        ],
        correct: 0,
      },
      {
        type: 'inferens',
        q: 'Varför går Milo förbi träningsväskan i flera dagar?',
        options: [
          'För att väskan står i vägen i hallen',
          'För att han har tappat bort nyckeln till salen',
          'För att han inte vill bli påmind om kvällen',
          'För att pappa har sagt åt honom att vänta',
        ],
        correct: 2,
      },
      {
        type: 'inferens',
        q: 'Vad förstår Milo när Alva berättar om sin egen gradering?',
        options: [
          'Att Alva är bättre på formerna än han',
          'Att tränaren brukar vara orättvis mot äldre',
          'Att han borde ha bytt till en annan grupp',
          'Att andra inte minns hans misstag som han själv',
        ],
        correct: 3,
      },
      {
        type: 'ord',
        q: 'Vad menas med en gradering i texten?',
        options: [
          'En tävling mellan olika klubbar',
          'En prövning för att få ett nytt bälte',
          'En lista över alla i träningsgruppen',
          'En form som utövarna gör tillsammans',
        ],
        correct: 1,
      },
      {
        type: 'forfattarens-syfte',
        q: 'Varför berättar texten att Milo aldrig tänkt på Alvas gradering?',
        options: [
          'För att visa att Milo inte bryr sig om andra',
          'För att visa att Alva var nervös hon också',
          'För att visa hur mycket större skammen känns inifrån',
          'För att visa att tränaren graderade dem samma kväll',
        ],
        correct: 2,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────── nivå 6 ──
  {
    id: 'ak6-kampsport-01',
    grade: 6,
    genre: 'faktatext',
    theme: 'kampsport',
    title: 'Varför bugar man i kampsport?',
    imageUrl: BILD('photo-1771909720903-c4567a890a6f'), // tom träningshall med blå och röd matta
    text:
      'Den som kliver in i en kampsportssal möter nästan alltid samma sak: någon stannar i dörren ' +
      'och bugar mot det tomma rummet. Sedan bugar utövarna mot tränaren, och till sist mot varandra ' +
      'innan de börjar träna. För den som är ny kan det verka som en gammal vana utan mening. ' +
      'Men bugningen fyller flera uppgifter, och de flesta av dem är praktiska.\n\n' +
      'Den första handlar om säkerhet. I kampsport tränar man rörelser som är gjorda för att skada. ' +
      'Ett kast fungerar bara om det river undan balansen, och ett slag är farligt just för att det ' +
      'är hårt. Därför måste det finnas en tydlig gräns mellan träning och allvar. Bugningen är den ' +
      'gränsen. Innan den har man två personer i ett rum, efter den har man två utövare som har ' +
      'kommit överens om regler.\n\n' +
      'Den andra uppgiften handlar om uppmärksamhet. Att buga tar ungefär två sekunder, och under ' +
      'de sekunderna gör man ingenting annat. Många tränare menar att det är själva poängen. ' +
      'Den som fortfarande tänker på skolan eller på mobilen i fickan är inte redo att ta emot ' +
      'ett kast. Bugningen blir en signal till kroppen om att något annat börjar nu.\n\n' +
      'Den tredje uppgiften handlar om motståndaren. I de flesta kampsporter bugar man mot den ' +
      'man ska möta, både före och efter. Tanken är att den andra personen inte är en fiende utan ' +
      'en förutsättning. Utan någon som gör motstånd går det inte att bli bättre. Efteråt bugar ' +
      'man igen, oavsett vem som vann, och just den bugningen är ofta den svåraste.\n\n' +
      'Bugningen har sitt ursprung i Japan, där hälsningen används långt utanför kampsporten. ' +
      'När judo och karate spreds över världen följde den med. I dag bugar man i klubbar i länder ' +
      'som saknar all annan koppling till japansk kultur, och innebörden har delvis förändrats: ' +
      'för många handlar det mindre om Japan och mer om vad man lovar varandra på mattan.\n\n' +
      'Det finns också en enklare förklaring, som tränare sällan säger högt. En sal med tjugo barn ' +
      'och hårt golv kräver ordning. Bugningen ger en tydlig punkt där alla samtidigt slutar prata ' +
      'och vänder sig åt samma håll. Den som har försökt samla en grupp sjuåringar utan en sådan ' +
      'signal förstår varför den har överlevt i hundra år.\n\n' +
      'Det finns kampsporter som hälsar på andra sätt. Brottare tar i hand, boxare stöter ihop ' +
      'handskarna. Formen skiljer sig, men funktionen är densamma. Innan två personer börjar ' +
      'göra saker som gör ont behöver de säga till varandra att det är just träning.',
    questions: [
      {
        type: 'literal',
        q: 'Vilka tre saker bugar utövarna mot enligt texten?',
        options: [
          'Salen, tränaren och varandra',
          'Publiken, domaren och tränaren',
          'Mattan, bältet och motståndaren',
          'Dörren, klubben och föräldrarna',
        ],
        correct: 0,
      },
      {
        type: 'inferens',
        q: 'Varför behövs en tydlig gräns mellan träning och allvar?',
        options: [
          'För att tränaren annars inte hinner räkna poäng',
          'För att rörelserna är gjorda för att kunna skada',
          'För att klubben annars kan bli av med sin lokal',
          'För att publiken annars inte förstår vad som händer',
        ],
        correct: 1,
      },
      {
        type: 'inferens',
        q: 'Varför menar tränare att de två sekunderna spelar roll?',
        options: [
          'För att domaren hinner kontrollera skydden då',
          'För att kroppen behöver vila mellan momenten',
          'För att utövaren ska hinna byta plats på mattan',
          'För att tankarna ska lämna allt utanför salen',
        ],
        correct: 3,
      },
      {
        type: 'ord',
        q: 'Vad menas med att motståndaren är en förutsättning?',
        options: [
          'Att motståndaren bestämmer reglerna',
          'Att motståndaren behövs för att man ska utvecklas',
          'Att motståndaren alltid kommer från samma klubb',
          'Att motståndaren måste ha samma bälte som en själv',
        ],
        correct: 1,
      },
      {
        type: 'textbevis',
        q: 'Vilken mening i texten visar att hälsningen ser olika ut i olika kampsporter?',
        options: [
          'Den tredje uppgiften handlar om motståndaren.',
          'Utan någon som gör motstånd går det inte att bli bättre.',
          'Brottare tar i hand, boxare stöter ihop handskarna.',
          'Den andra uppgiften handlar om uppmärksamhet.',
        ],
        correct: 2,
      },
      {
        type: 'forfattarens-syfte',
        q: 'Varför är texten skriven, enligt dess avslutning?',
        options: [
          'För att visa att japanska seder sprids över världen',
          'För att förklara varför brottare hälsar med handen',
          'För att beskriva hur en kampsportssal brukar se ut',
          'För att förklara vad hälsningen faktiskt fyller för funktion',
        ],
        correct: 3,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────── nivå 7 ──
  {
    id: 'ak7-kampsport-01',
    grade: 7,
    genre: 'faktatext',
    theme: 'kampsport',
    title: 'Från stridskonst till olympisk gren',
    imageUrl: BILD('photo-1764908912175-79561e144f19'), // brottare får armen lyft av domaren efter match
    text:
      'De flesta kampsporter började som något annat än sport. De var metoder för att försvara sig, ' +
      'utvecklade i tider då det kunde behövas på riktigt. Vägen därifrån till en olympisk arena ' +
      'med domare, poängtavla och tidtagning har krävt att sporterna gjort om sig själva, och den ' +
      'omgörningen har inte varit oomstridd.\n\n' +
      'Judo är det tydligaste exemplet. Jigoro Kano, som formade judon på 1880-talet, tog bort de ' +
      'farligaste teknikerna ur de äldre systemen. Kvar blev kast och grepp som gick att öva i full ' +
      'fart utan att någon skadades. Just den förändringen gjorde judon möjlig att tävla i, och 1964 ' +
      'stod den på OS-programmet i Tokyo. Taekwondo kom med år 2000, karate år 2021.\n\n' +
      'För att något ska fungera som tävlingsgren krävs mer än att det är spännande att titta på. ' +
      'Det måste gå att avgöra vem som vann. Där uppstår det första problemet. En teknik som skulle ' +
      'vara avgörande i en verklig situation är ofta omöjlig att använda i en match, eftersom den ' +
      'skadar motståndaren. Sporten måste alltså mäta något annat än det den ursprungligen handlade om.\n\n' +
      'Lösningen har blivit poängsystem. I karate ger en kontrollerad träff poäng, men bara om den ' +
      'stoppas innan den gör skada. I judo belönas ett kast där motståndaren landar på rygg med kraft ' +
      'och kontroll. Systemen försöker peka på det som skulle ha fungerat, utan att låta det hända.\n\n' +
      'Kritiker menar att detta förändrar sporten inifrån. När poängen styr börjar utövarna träna ' +
      'för poängen. I karate har det lett till en stil där tävlande söker snabba, lätta träffar och ' +
      'undviker närkamp, eftersom närkampen inte ger något. Vissa tränare hävdar att den moderna ' +
      'tävlingskarate därför liknar fäktning mer än den karate som fanns för hundra år sedan.\n\n' +
      'Judon ger ett konkret exempel på hur snabbt en regel kan ändra en sport. År 2010 förbjöds ' +
      'grepp under midjan i tävlingsjudo, alltså tekniker där man tar tag i motståndarens ben. ' +
      'Skälet var dels att skilja judon tydligare från brottning, dels att greppen ansågs göra ' +
      'matcherna passiva. Effekten blev omedelbar. En hel familj av tekniker som utövare hade ' +
      'tränat i årtionden försvann ur tävlingssalarna på en enda säsong. I klubbarna lever de ' +
      'kvar, men de tränas mindre, eftersom det inte längre finns någon anledning att bli bra ' +
      'på dem.\n\n' +
      'Försvararna svarar att alla sporter har formats av sina regler, och att det inte är något fel ' +
      'i sig. Fotbollen ser också annorlunda ut än den gjorde på 1800-talet. Reglerna har dessutom ' +
      'gett något som de gamla systemen saknade. Utan dem går det inte att öva i full fart mot ' +
      'någon som verkligen gör motstånd. Utan sådan träning blir ingen riktigt skicklig.\n\n' +
      'Det är också värt att lägga märke till vem som skriver reglerna. De beslutas av internationella ' +
      'förbund som samtidigt förhandlar med den olympiska kommittén om att få stanna kvar på ' +
      'programmet. En sport som anses svårbegriplig för tv-publiken riskerar sin plats. Flera ' +
      'kampsporter har därför förenklat sina poängsystem för att bli lättare att följa för någon ' +
      'som inte tränar dem själv.\n\n' +
      'Diskussionen handlar därför inte om huruvida kampsport ska ha regler, utan om vad reglerna ' +
      'ska belöna. Varje ändring i poängsystemet är samtidigt ett beslut om vilken sorts utövare ' +
      'sporten kommer att fostra.',
    questions: [
      {
        type: 'literal',
        q: 'Vilket år blev judo olympisk sport?',
        options: ['År 1880', 'År 1964', 'År 2000', 'År 2021'],
        correct: 1,
      },
      {
        type: 'literal',
        q: 'Vad gjorde Jigoro Kano med de äldre systemen?',
        options: [
          'Han lade till fler farliga tekniker',
          'Han tog bort de farligaste teknikerna',
          'Han förbjöd all träning i full fart',
          'Han ersatte alla kast med slag',
        ],
        correct: 1,
      },
      {
        type: 'inferens',
        q: 'Varför måste en tävlingsgren mäta något annat än det den handlade om?',
        options: [
          'För att publiken hellre vill se poäng än teknik',
          'För att domarna inte hinner följa snabba rörelser',
          'För att de avgörande teknikerna skulle skada motståndaren',
          'För att de gamla systemen saknade skriftliga regler',
        ],
        correct: 2,
      },
      {
        type: 'ord',
        q: 'Vad menas med att kritikerna säger att sporten förändras inifrån?',
        options: [
          'Att klubbarna byggs om på insidan',
          'Att träningen sker inomhus numera',
          'Att utövarna tränar efter det poängen belönar',
          'Att reglerna skrivs av utövarna själva',
        ],
        correct: 2,
      },
      {
        type: 'textbevis',
        q: 'Vilken mening i texten visar vad reglerna har gett som de gamla systemen saknade?',
        options: [
          'Fotbollen ser också annorlunda ut än den gjorde på 1800-talet.',
          'Utan dem går det inte att öva i full fart mot någon som verkligen gör motstånd.',
          'Sporten måste alltså mäta något annat än det den ursprungligen handlade om.',
          'I judo belönas ett kast där motståndaren landar på rygg med kraft och kontroll.',
        ],
        correct: 1,
      },
      {
        type: 'sammanfatta',
        q: 'Vad är textens huvudbudskap?',
        options: [
          'Att kampsporternas regler avgör vad utövarna blir bra på',
          'Att judon är den enda kampsport som passar i ett OS',
          'Att tävlingskarate har blivit alldeles för likt fäktning',
          'Att kampsporter borde återgå till sina gamla former',
        ],
        correct: 0,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────── nivå 8 ──
  {
    id: 'ak8-kampsport-01',
    grade: 8,
    genre: 'faktatext',
    theme: 'kampsport',
    title: 'Vägningen före matchen',
    imageUrl: BILD('photo-1495555687398-3f50d6e79e1e'), // amatörboxare med huvudskydd i match
    text:
      'Nästan alla kampsporter delar in de tävlande i viktklasser. Tanken är enkel och svår att ' +
      'ifrågasätta: den som väger tjugo kilo mer har en fördel som inte har med skicklighet att göra. ' +
      'Viktklasserna finns alltså för att matcherna ska avgöras av teknik. Ändå har just den regeln ' +
      'gett upphov till ett av sportens allvarligaste hälsoproblem.\n\n' +
      'Problemet heter viktnedgång, och det fungerar så här. En utövare som normalt väger sjuttiofem ' +
      'kilo anmäler sig i klassen under sjuttio. Veckan före tävlingen dras vätska och mat ner kraftigt. ' +
      'De sista dygnen svettas resten ut i bastu eller i tjocka kläder. På vägningen står utövaren ' +
      'uttorkad på vågen, klarar gränsen, och börjar sedan omedelbart äta och dricka igen. När matchen ' +
      'går av stapeln nästa dag väger hen kanske sjuttiofyra kilo och möter någon som gjort samma sak.\n\n' +
      'Logiken bakom är att alla andra också gör det. Den som inte tar ner vikten möter i praktiken ' +
      'större motståndare i sin egen klass. Systemet driver alltså fram exakt det beteende det var ' +
      'tänkt att förhindra.\n\n' +
      'Hur vanligt fenomenet är framgår av enkäter bland tävlande. I flera undersökningar bland ' +
      'brottare och judoutövare uppger en klar majoritet att de gått ner i vikt inför tävling. ' +
      'En betydande andel svarar att de gjort det med metoder som forskarna klassar som riskabla: ' +
      'bastu, uttorkning och långa perioder utan mat. Bland dem som tävlar på högre nivå är ' +
      'andelen större.\n\n' +
      'Riskerna är väl dokumenterade. Uttorkning försämrar reaktionsförmågan och koncentrationen, ' +
      'alltså precis det som behövs för att skydda sig i en match. Den minskar också vätskan runt ' +
      'hjärnan, vilket enligt flera studier gör hjärnskakningar allvarligare vid samma träff. ' +
      'Ur den synvinkeln är viktnedgången inte bara ett problem för den som gör den, utan för ' +
      'säkerheten i hela matchen.\n\n' +
      'Att det inte bara handlar om obehag har flera dödsfall visat. Under hösten 1997 dog tre ' +
      'amerikanska collegebrottare inom loppet av några veckor, samtliga under hård viktnedgång ' +
      'med kraftig uttorkning. Fallen ledde till att det amerikanska universitetsförbundet införde ' +
      'regler om lägsta tillåtna kroppsfett och om hur snabbt vikt får tas ner under en säsong.\n\n' +
      'Åtgärderna har varit av två slag. Vissa förbund har flyttat vägningen närmare matchen, ibland ' +
      'till samma dag, så att tiden att återhämta vikten försvinner. Andra har infört flera vägningar, ' +
      'eller kontroller av hur uttorkad kroppen är. Båda vägarna har visat effekt, men ingen har löst ' +
      'problemet helt.\n\n' +
      'Bland unga utövare är frågan känsligare än bland vuxna. Kroppen växer fortfarande, och ' +
      'återkommande perioder av svält och uttorkning kan påverka både tillväxt och förhållandet ' +
      'till mat långt efter att karriären är slut. Flera förbund förbjuder därför viktnedgång i ' +
      'ungdomsklasser, och en del har gått längre och låter ungdomar tävla i den vikt de faktiskt har.\n\n' +
      'Det finns också en enklare åtgärd som fått mindre uppmärksamhet: att låta utövaren tävla i ' +
      'den klass där hen faktiskt tränar. Många tränare beskriver att den som slipper vikttappet ' +
      'kommer starkare till matchen, eftersom veckorna före tävlingen kan användas till träning ' +
      'i stället för svält.\n\n' +
      'Det som gör frågan svår är att ingen enskild aktör kan lösa den ensam. En tränare som säger ' +
      'nej till viktnedgång skickar sina utövare mot tyngre motståndare. En utövare som avstår ' +
      'förlorar. Först när regeln ändras för alla samtidigt försvinner skälet att göra det.',
    questions: [
      {
        type: 'literal',
        q: 'Varför finns viktklasser enligt texten?',
        options: [
          'För att matcherna ska avgöras av teknik',
          'För att fler ska kunna delta i en tävling',
          'För att vägningen ska gå snabbare att göra',
          'För att domarna ska slippa räkna poäng',
        ],
        correct: 0,
      },
      {
        type: 'literal',
        q: 'Vad gör utövaren de sista dygnen före vägningen?',
        options: [
          'Äter extra mycket för att orka',
          'Tränar hårdare än under hela året',
          'Svettas ut vätska i bastu eller kläder',
          'Vilar helt och rör sig så lite som möjligt',
        ],
        correct: 2,
      },
      {
        type: 'inferens',
        q: 'Varför fortsätter utövare med viktnedgång trots riskerna?',
        options: [
          'För att förbunden belönar den som väger minst',
          'För att den som avstår möter större motståndare',
          'För att tränarna sällan känner till forskningen',
          'För att vägningen annars måste göras om nästa dag',
        ],
        correct: 1,
      },
      {
        type: 'textbevis',
        q: 'Vilken mening i texten är belägg för att uttorkning påverkar skaderisken?',
        options: [
          'En utövare som normalt väger sjuttiofem kilo anmäler sig i klassen under sjuttio.',
          'Den minskar också vätskan runt hjärnan, vilket enligt flera studier gör hjärnskakningar allvarligare vid samma träff.',
          'Uttorkning försämrar reaktionsförmågan och koncentrationen, alltså precis det som behövs för att skydda sig i en match.',
          'Vissa förbund har flyttat vägningen närmare matchen, ibland till samma dag, så att tiden att återhämta vikten försvinner.',
        ],
        correct: 1,
      },
      {
        type: 'ord',
        q: 'Vad menas med att systemet driver fram beteendet det skulle förhindra?',
        options: [
          'Att reglerna är skrivna på ett otydligt sätt',
          'Att förbunden ändrar reglerna alldeles för ofta',
          'Att vägningen sker för sent för att hinna kontrolleras',
          'Att regeln ger utövarna skäl att göra just det den motverkar',
        ],
        correct: 3,
      },
      {
        type: 'sammanfatta',
        q: 'Vad handlar texten framför allt om?',
        options: [
          'Hur en boxningsmatch går till från början till slut',
          'Varför unga inte längre får tävla i kampsport',
          'Hur en rimlig regel gett upphov till ett hälsoproblem',
          'Varför bastu är vanligt i idrotter med viktklasser',
        ],
        correct: 2,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────── nivå 9 ──
  {
    id: 'ak9-kampsport-01',
    grade: 9,
    genre: 'faktatext',
    theme: 'kampsport',
    title: 'Ska barn få tävla med slag mot huvudet?',
    imageUrl: BILD('photo-1514050566906-8d077bae7046'), // utövare i luften med hög spark
    text:
      'Frågan återkommer med jämna mellanrum i svensk idrottsdebatt, och den ställs sällan på ett ' +
      'sätt som gör den lätt att svara på. Ska barn tillåtas tävla i kampsporter där slag och sparkar ' +
      'mot huvudet ger poäng? Läkarförbund i flera länder har svarat nej. Idrottsrörelsen har oftast ' +
      'svarat att frågan är mer komplicerad än så.\n\n' +
      'Frågan har en särskild historia i Sverige. Proffsboxning var förbjuden här mellan 1970 och ' +
      '2007, och förbudet motiverades just med risken för bestående hjärnskador. När det upphävdes ' +
      'skedde det med villkor: läkarundersökningar, begränsad matchlängd och krav på uppföljning. ' +
      'Den svenska erfarenheten visar att alternativen sällan är förbud eller fri verksamhet, utan ' +
      'olika grader av reglering.\n\n' +
      'Argumentet mot bygger på hjärnan. Ett barns hjärna är inte färdigutvecklad, och nackmusklerna ' +
      'är svagare i förhållande till huvudets vikt än hos en vuxen. Samma träff ger därför en kraftigare ' +
      'rotation. Det som oroar läkarna är inte i första hand den enskilda hjärnskakningen, utan de ' +
      'upprepade lättare stötarna, de som aldrig leder till att någon blir avstängd eller ens undersökt. ' +
      'Forskning på vuxna idrottare har kopplat sådana upprepade stötar till problem med minne och ' +
      'humör senare i livet. Hur starkt sambandet är för barn vet ingen säkert, och det är i sig en ' +
      'del av argumentet: den som inte vet bör vara försiktig.\n\n' +
      'Argumentet för ser annorlunda ut. Kampsport ger många barn något som annan idrott inte lyckats ' +
      'med. Klubbarna finns ofta i områden där föreningslivet i övrigt är svagt, avgifterna är låga ' +
      'och kraven på förkunskaper obefintliga. För barn som inte trivs i lagidrott är kampsporten ' +
      'ibland den enda dörren in. Ett förbud mot tävling skulle enligt det argumentet inte ta bort ' +
      'riskerna, utan flytta ungdomarna till gym och sammanhang utan tränare, regler och försäkring.\n\n' +
      'Mellan dessa två ståndpunkter finns en tredje väg som fått fäste i flera förbund: att behålla ' +
      'tävlingen men ändra vad som ger poäng. Många ungdomsklasser tillåter i dag kontakt mot kroppen ' +
      'men inte mot huvudet, eller kräver att träffar mot huvudet är markerade i stället för fulla. ' +
      'I judo och brottning finns problemet knappt alls, eftersom poängen sitter i kast och grepp. ' +
      'Det talar för att det inte är kampsporten i sig som är frågan, utan just vilka träffar som belönas.\n\n' +
      'Invändningen mot mellanvägen är att den är svår att kontrollera. En markerad träff blir lätt ' +
      'en riktig träff när två fjortonåringar är trötta och det står om en medalj. Domare hinner inte ' +
      'alltid bedöma kraften, och tränare som vill vinna hittar gränsen. Regler på papper är inte ' +
      'samma sak som regler i en match.\n\n' +
      'Vad forskningen om barn faktiskt säger är mindre entydigt än båda sidor brukar hävda. ' +
      'Studierna är få, grupperna små och uppföljningstiderna korta, av det enkla skälet att det ' +
      'tar decennier innan effekterna hinner visa sig. Samma underlag kan därför användas av båda ' +
      'lägren. Den ena sidan pekar på att inget säkert samband har påvisats, den andra på att ' +
      'frånvaro av bevis inte är bevis på frånvaro.\n\n' +
      'Till detta kommer en fråga om vem som bestämmer. Ett barn på tio år kan knappast överblicka ' +
      'en risk som visar sig först om trettio år, och samtycket lämnas därför av föräldrarna.\n\n' +
      'Kvar står en avvägning som inte har något tekniskt svar. Å ena sidan en risk som är svår att ' +
      'mäta men allvarlig om den är verklig. Å andra sidan en verksamhet som bevisligen fångar upp ' +
      'barn som annars hade stått utanför. Vilken av dem som väger tyngst är till slut ett politiskt ' +
      'val, inte ett medicinskt.',
    questions: [
      {
        type: 'literal',
        q: 'Varför ger samma träff kraftigare rotation hos ett barn?',
        options: [
          'För att barn oftare tränar utan huvudskydd',
          'För att barn har fler matcher under en säsong',
          'För att nackmusklerna är svagare i förhållande till huvudet',
          'För att barn reagerar långsammare på inkommande slag',
        ],
        correct: 2,
      },
      {
        type: 'inferens',
        q: 'Varför oroar de lättare stötarna läkarna mest?',
        options: [
          'För att de gör mest ont just när de träffar',
          'För att de sällan upptäcks eller undersöks',
          'För att de bara förekommer i ungdomsklasser',
          'För att de alltid leder till en avstängning',
        ],
        correct: 1,
      },
      {
        type: 'inferens',
        q: 'Vad talar judo och brottning för i sammanhanget?',
        options: [
          'Att kast är farligare än slag mot huvudet',
          'Att det är poängsystemet och inte kampsporten som avgör',
          'Att yngre utövare borde börja med grepp först',
          'Att domare behövs mindre i sporter utan slag',
        ],
        correct: 1,
      },
      {
        type: 'ord',
        q: 'Vad menas med att träffar ska vara markerade?',
        options: [
          'Att de ska antydas utan full kraft',
          'Att de ska räknas av två olika domare',
          'Att de ska skrivas upp på en poängtavla',
          'Att de ska riktas mot ett bestämt område',
        ],
        correct: 0,
      },
      {
        type: 'textbevis',
        q: 'Vilken mening i texten är belägg för att regler kan fungera sämre i praktiken?',
        options: [
          'Domare hinner inte alltid bedöma kraften, och tränare som vill vinna hittar gränsen.',
          'I judo och brottning finns problemet knappt alls, eftersom poängen sitter i kast och grepp.',
          'Ett barns hjärna är inte färdigutvecklad, och nackmusklerna är svagare i förhållande till huvudets vikt än hos en vuxen.',
          'Läkarförbund i flera länder har svarat nej.',
        ],
        correct: 0,
      },
      {
        type: 'forfattarens-syfte',
        q: 'Varför avslutar texten med att valet är politiskt och inte medicinskt?',
        options: [
          'För att visa att läkarna har haft fel hela tiden',
          'För att visa att forskningen snart kommer ge ett svar',
          'För att visa att avvägningen kräver ett ställningstagande',
          'För att visa att idrottsrörelsen bör bestämma på egen hand',
        ],
        correct: 2,
      },
    ],
  },

  // ────────────────────────────────────────────────────────────── nivå 10 ──
  {
    id: 'ak10-kampsport-01',
    grade: 10,
    genre: 'faktatext',
    theme: 'kampsport',
    title: 'Respekten som säljs',
    imageUrl: BILD('photo-1633378453111-55462debb3f4'), // siluett av hög spark mot solnedgång
    text:
      'Ordet budo brukar översättas med "krigarens väg", men den vanligare tolkningen inom japansk ' +
      'kampsporttradition är en annan: en väg där tekniken är medlet och personens utveckling är målet. ' +
      'I den traditionen är det inte en självmotsägelse att träna våldsamma rörelser för att bli ' +
      'lugnare. Poängen är att den som verkligen behärskar något inte behöver använda det.\n\n' +
      'Den föreställningen lever kvar i språket kring modern kampsport, men den möter i dag ett ' +
      'sammanhang den inte var byggd för. Mixed martial arts är en global underhållningsindustri där ' +
      'de största galorna säljs som pay per view och där en utövares inkomst i hög grad bestäms av ' +
      'hur många som vill se just den matchen. Det skapar ett incitament som budotraditionen aldrig ' +
      'behövde hantera: det lönar sig att vara omtalad.\n\n' +
      'Följden syns i pressträffarna. Förolämpningar, hot och iscensatta bråk har blivit ett eget ' +
      'moment före matcherna, och de utövare som behärskar det tjänar väsentligt mer än de som bara ' +
      'vinner. Samtidigt fortsätter samma sport att odla sin ritual: handskarna som stöts ihop före ' +
      'första ronden, omfamningen efteråt, tacktalet till motståndaren. Bägge sakerna är på riktigt, ' +
      'och de sitter i samma sport.\n\n' +
      'En vanlig läsning är att kommersen har korrumperat en ursprungligen ädel praktik. Den läsningen ' +
      'har dock ett problem: den ädla praktiken är delvis en efterkonstruktion. Historiker har visat ' +
      'att flera japanska kampsportsskolor formulerade sin filosofi först under 1900-talet. ' +
      'Skolorna behövde då motivera sin existens i en modern stat som inte längre hade bruk för ' +
      'krigare. Också då fanns alltså ett marknadsvärde i berättelsen om andlig utveckling.\n\n' +
      'Ett annat exempel är brasiliansk jiujitsu. Familjen Gracie byggde sportens rykte genom att ' +
      'utmana utövare av andra stilar och sprida filmerna på matcherna, en marknadsföringsmetod ' +
      'långt före internet. Att sporten samtidigt bär ett starkt ideal om ödmjukhet och tålamod ' +
      'upplevs inte som en motsägelse av dem som tränar den. Idealet och marknadsföringen växte ' +
      'fram sida vid sida.\n\n' +
      'Det betyder inte att traditionen är falsk, men det flyttar frågan. I stället för att fråga om ' +
      'kampsporten har tappat sin själ kan man fråga vad ritualerna faktiskt gör, oberoende av vad ' +
      'de påstås göra. Där finns något att säga. Att tvingas ta motståndaren i hand efter en förlust ' +
      'är en övning som inte blir mindre verklig av att den filmas. Ritualen fungerar även när ' +
      'motiven bakom den är blandade.\n\n' +
      'Frågan har också en konkret ekonomisk sida. Utövarna i de största organisationerna är i regel ' +
      'inte anställda utan uppdragstagare, vilket innebär att de själva bär kostnaden för träning, ' +
      'skador och den tid som går åt mellan matcherna. Den andel av intäkterna som når dem är ' +
      'väsentligt lägre än i lagsporter med kollektiva avtal. Talet om respekt låter annorlunda ' +
      'när det kommer från den part som skriver kontrakten.\n\n' +
      'Det finns dessutom en empirisk sida av frågan som sällan får plats i diskussionen. ' +
      'Utvärderingar av klubbar som arbetar med unga i utsatta områden pekar oftast åt samma håll. ' +
      'Deltagarna beskriver ökad självkontroll och färre konflikter utanför träningen. Effekten ' +
      'tycks dock hänga på tränaren snarare än på grenen. En klubb där ledaren konsekvent stoppar ' +
      'övertramp ger andra resultat än en klubb där hårdhet belönas, även om båda tränar samma ' +
      'tekniker.\n\n' +
      'Kanske ligger den intressanta iakttagelsen just där. En kampsportsklubb i en svensk förort ' +
      'och en gala i Las Vegas delar samma gester men fyller dem med olika innehåll. I klubben är ' +
      'bugningen ett löfte mellan två personer som ska mötas igen på tisdag. På galan är den delvis ' +
      'en bild som säljs till en publik. Att gesterna ser likadana ut betyder inte att de betyder ' +
      'samma sak, och den som vill förstå sporten behöver kunna hålla båda tolkningarna i huvudet ' +
      'samtidigt utan att välja den bekvämaste.',
    questions: [
      {
        type: 'ord',
        q: 'Vad menas med budo enligt textens vanligare tolkning?',
        options: [
          'En väg där tekniken tjänar personens utveckling',
          'En krigskonst där segern är det enda som räknas',
          'En japansk sport som blivit olympisk gren',
          'En metod att försvara sig utan några vapen',
        ],
        correct: 0,
      },
      {
        type: 'literal',
        q: 'Vad avgör i hög grad en MMA-utövares inkomst?',
        options: [
          'Hur många matcher som utövaren har vunnit',
          'Hur många som vill se just den matchen',
          'Hur länge utövaren har tränat i sin klubb',
          'Hur ofta utövaren syns i sportens regelverk',
        ],
        correct: 1,
      },
      {
        type: 'inferens',
        q: 'Varför är läsningen att kommersen korrumperat sporten problematisk?',
        options: [
          'För att galorna sällan visar några ritualer alls',
          'För att utövarna själva aldrig håller med om den',
          'För att filosofin delvis skrevs fram i efterhand',
          'För att pengar spelade roll redan i det gamla Japan',
        ],
        correct: 2,
      },
      {
        type: 'textbevis',
        q: 'Vilken mening i texten är belägg för att ritualen fungerar oavsett motiven bakom?',
        options: [
          'Poängen är att den som verkligen behärskar något inte behöver använda det.',
          'Att tvingas ta motståndaren i hand efter en förlust är en övning som inte blir mindre verklig av att den filmas.',
          'Historiker har visat att flera japanska kampsportsskolor formulerade sin filosofi först under 1900-talet.',
          'I klubben är bugningen ett löfte mellan två personer som ska mötas igen på tisdag.',
        ],
        correct: 1,
      },
      {
        type: 'inferens',
        q: 'Vad menar texten med att gesterna kan se likadana ut utan att betyda samma sak?',
        options: [
          'Att sammanhanget avgör vad en handling innebär',
          'Att galorna kopierar klubbarnas sätt att hälsa',
          'Att bugningen har förlorat sin ursprungliga form',
          'Att publiken sällan förstår vad ritualen betyder',
        ],
        correct: 0,
      },
      {
        type: 'forfattarens-syfte',
        q: 'Vad vill texten framför allt att läsaren ska klara av?',
        options: [
          'Att avgöra vilken av kampsporterna som är mest äkta',
          'Att välja mellan traditionens och marknadens förklaring',
          'Att hålla två tolkningar samtidigt utan att förenkla',
          'Att skilja japansk kampsport från amerikansk underhållning',
        ],
        correct: 2,
      },
    ],
  },
];

// ── Skrivning ───────────────────────────────────────────────────────────────
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));
const dry = process.argv.includes('--dry');

const befintliga = new Set(lib.map((t) => t.id));
let avbryt = false;

const ORDINTERVALL = {
  1: [40, 60], 2: [65, 90], 3: [150, 165], 4: [200, 220], 5: [300, 320],
  6: [400, 415], 7: [500, 530], 8: [530, 570], 9: [570, 590], 10: [590, 625],
};

TEXTER.forEach((t) => {
  if (befintliga.has(t.id)) {
    console.error(`ID finns redan: ${t.id}`);
    avbryt = true;
  }

  // Ett textbevis är bara ett textbevis om alternativen står ordagrant i
  // texten. Står de inte där kan eleven inte gå tillbaka och kontrollera, och
  // frågan blir en vanlig inferensfråga med citattecken runt.
  t.questions
    .filter((q) => q.type === 'textbevis')
    .forEach((q) =>
      q.options.forEach((o, oi) => {
        if (!t.text.includes(o)) {
          console.error(`${t.id} textbevis alternativ ${'ABCD'[oi]} står inte ordagrant i texten:\n    ${o}`);
          avbryt = true;
        }
      })
    );

  const ord = t.text.trim().split(/\s+/).length;
  const band = ORDINTERVALL[t.grade];
  if (ord < band[0] || ord > band[1]) {
    console.error(`${t.id}: ${ord} ord, utanför nivå ${t.grade}-intervallet ${band[0]}–${band[1]}`);
    avbryt = true;
  }
  const meningar = t.text.split(/(?<=[.!?]["”]?)\s+/).filter(Boolean).length;
  console.log(
    `nivå ${String(t.grade).padStart(2)}  ${t.id.padEnd(20)} ${String(ord).padStart(3)} ord  ` +
      `${(ord / meningar).toFixed(1)} ord/mening  ${t.questions.length} frågor  ` +
      `svar ${t.questions.map((q) => q.correct).join('')}`
  );
});

if (avbryt) process.exit(1);

if (dry) {
  console.log('\n--dry: inget skrivet.');
  process.exit(0);
}

TEXTER.forEach((t) => {
  lib.push({ ...t, meta: { wordCount: t.text.trim().split(/\s+/).length } });
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n');
console.log(`\n${TEXTER.length} texter tillagda. Biblioteket har nu ${lib.length} texter.`);
