#!/usr/bin/env node
//
// Tio nya texter om ABBA, en per nivå.
//
// Biblioteket hade redan fem ABBA-texter, men samtliga låg på nivå 9
// (akgy-abba-001 till -005) och täckte musikexporten, relationerna,
// produktionstekniken, populärkulturen och identiteten i låttexterna.
// Nivå 1–8 och 10 saknade ämnet helt.
//
// Vinklarna nedan är därför valda för att inte upprepa de befintliga:
//   1–2  låten på kalaset, klassen som ska uppträda
//   3–5  vilka ABBA var, skivan i garderoben, kvällen i Brighton
//   6–8  att skriva på ett främmande språk, glädje och sorg i samma låt,
//        hur en inspelning gick till innan datorerna
//   9    konserten utan band – de digitala avatarerna i London
//  10    kritikernas omvärdering och vad den säger om smak
//
// Nivå 9 ligger närmast de befintliga texterna och har därför kontrollerats
// särskilt mot validatorns dubblettregel.
//
// Bilderna är sökta hos Unsplash, nedladdade och granskade en och en. Det
// finns inga fria bilder på gruppen, så motiven är sådant texterna faktiskt
// handlar om: skivor, studio, scen och piano.
//
// Kör med --dry för att se vad som skulle läggas till utan att skriva.

const fs = require('fs');
const path = require('path');

const BILD = (slug) => `https://images.unsplash.com/${slug}?w=600&h=400&fit=crop`;

const TEXTER = [
  // ─────────────────────────────────────────────────────────────── nivå 1 ──
  {
    id: 'ak1-abba-01',
    grade: 1,
    genre: 'berättelse',
    theme: 'musik',
    title: 'Låten på kalaset',
    imageUrl: BILD('photo-1639425341863-0bcdc22da419'), // spegelboll som hänger utomhus
    text:
      'Det är kalas hos Ines. Alla sitter och äter tårta.\n\n' +
      'Sedan sätter mormor på en låt. Den är gammal.\n\n' +
      '"Den här är med ABBA", säger mormor.\n\n' +
      'Mormor börjar dansa. Hon sjunger med i refrängen.\n\n' +
      'Ines skrattar. Först vill hon inte dansa.\n\n' +
      'Men foten börjar stampa av sig själv.\n\n' +
      'Till slut dansar hela köket.',
    questions: [
      {
        type: 'literal',
        q: 'Var är kalaset?',
        options: ['Hos Ines', 'I skolan', 'På torget', 'I parken'],
        correct: 0,
      },
      {
        type: 'literal',
        q: 'Vem sätter på låten?',
        options: ['En granne', 'Mormor', 'En kompis', 'Pappa'],
        correct: 1,
      },
      {
        type: 'ord',
        q: 'Vad är en refräng?',
        options: [
          'En stor tårta med ljus',
          'En dans man gör i ring',
          'Den del som kommer igen',
          'En låt som ingen kan',
        ],
        correct: 2,
      },
      {
        type: 'inferens',
        q: 'Varför börjar Ines fot stampa?',
        options: [
          'Hon fryser om foten',
          'Hon vill gå hem nu',
          'Hon har ont i benet',
          'Hon tycker om låten',
        ],
        correct: 3,
      },
      {
        type: 'literal',
        q: 'Vad händer till slut?',
        options: ['Alla i köket dansar', 'Alla äter mer tårta', 'Alla går ut i snön', 'Alla sjunger en visa'],
        correct: 0,
      },
      {
        type: 'sammanfatta',
        q: 'Vad handlar texten mest om?',
        options: [
          'En mormor som bakar tårta',
          'En pojke som spelar piano',
          'En gammal låt som får alla att dansa',
          'En kompis som kommer för sent',
        ],
        correct: 2,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────── nivå 2 ──
  {
    id: 'ak2-abba-01',
    grade: 2,
    genre: 'berättelse',
    theme: 'musik',
    title: 'Vi ska sjunga på avslutningen',
    imageUrl: BILD('photo-1485579149621-3123dd979885'), // gammaldags mikrofon
    text:
      'Klassen ska sjunga en ABBA-låt på avslutningen. Fröken har skrivit texten på tavlan.\n\n' +
      'Alla sjunger högt. Alla utom Sam.\n\n' +
      'Sam kan låten. Han sjunger den hemma i duschen. Men här är det tjugo par öron.\n\n' +
      'På generalrepetitionen får Sam stå längst bak. Han viskar orden.\n\n' +
      'Då vänder sig Nadia om.\n\n' +
      '"Sjung med mig", säger hon. "Så hör ingen att det är du."\n\n' +
      'De sjunger tillsammans. Sams röst blir lite starkare.\n\n' +
      'På avslutningen sjunger han hela refrängen. Han hör sin egen röst i kören.',
    questions: [
      {
        type: 'literal',
        q: 'Vad ska klassen göra på avslutningen?',
        options: ['Spela teater', 'Sjunga en ABBA-låt', 'Läsa en dikt', 'Dansa en dans'],
        correct: 1,
      },
      {
        type: 'inferens',
        q: 'Varför sjunger Sam inte högt i början?',
        options: [
          'Han har glömt hela texten',
          'Han tycker inte om låten',
          'Han vågar inte höras av andra',
          'Han är hes efter en förkylning',
        ],
        correct: 2,
      },
      {
        type: 'literal',
        q: 'Vad säger Nadia till Sam?',
        options: [
          'Att han ska sjunga med henne',
          'Att han ska byta plats med henne',
          'Att han ska sjunga lite tystare',
          'Att han ska lyssna på de andra',
        ],
        correct: 0,
      },
      {
        type: 'ord',
        q: 'Vad är en generalrepetition?',
        options: [
          'En låt som alla kan utantill',
          'En övning strax före uppträdandet',
          'En plats längst bak i kören',
          'En lärare som leder en kör',
        ],
        correct: 1,
      },
      {
        type: 'inferens',
        q: 'Varför blir Sams röst starkare?',
        options: [
          'För att texten står kvar på tavlan',
          'För att han har druckit lite vatten',
          'För att fröken har sagt åt honom',
          'För att han inte längre står ensam',
        ],
        correct: 3,
      },
      {
        type: 'sammanfatta',
        q: 'Vilken rubrik passar bäst till texten?',
        options: [
          'Fröken som glömde tavlan',
          'Duschen där alla sjunger',
          'Hjälpen som gav Sam mod',
          'Kören som kom för sent',
        ],
        correct: 2,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────── nivå 3 ──
  {
    id: 'ak3-abba-01',
    grade: 3,
    genre: 'faktatext',
    theme: 'musik',
    title: 'Vilka var ABBA?',
    imageUrl: BILD('photo-1582730147924-d92f4da00252'), // färgglada vinylsinglar
    text:
      'ABBA var en svensk popgrupp. Den bestod av fyra personer: Agnetha, Björn, Benny och Frida. ' +
      'Namnet kommer från deras förnamn. Första bokstaven i varje namn bildar ordet ABBA.\n\n' +
      'Namnet var först ett problem. I Sverige fanns redan ett företag som hette Abba och sålde ' +
      'fisk på burk. Gruppen fick fråga om lov innan de kunde använda namnet.\n\n' +
      'Gruppen bildades i Stockholm i början av 1970-talet. Björn och Benny skrev musiken. ' +
      'Agnetha och Frida sjöng de flesta av rösterna.\n\n' +
      'Genombrottet kom år 1974. Då vann de Eurovision Song Contest med låten Waterloo. ' +
      'Tävlingen sändes i tv i många länder samtidigt. Efter den kvällen visste hela Europa vilka de var.\n\n' +
      'Sedan följde många kända låtar. Dancing Queen och Mamma Mia är två av dem. ' +
      'ABBA sålde skivor över hela världen, ända bort till Australien och Japan.\n\n' +
      'Gruppen slutade spela tillsammans i början av 1980-talet. Ändå spelas deras låtar än i dag. ' +
      'Många som lyssnar nu var inte ens födda när musiken skrevs.',
    questions: [
      {
        type: 'literal',
        q: 'Hur många personer var med i ABBA?',
        options: ['Tre personer', 'Fyra personer', 'Fem personer', 'Sex personer'],
        correct: 1,
      },
      {
        type: 'literal',
        q: 'Var kommer namnet ABBA ifrån?',
        options: [
          'Från en stad i Sverige',
          'Från en gammal folksaga',
          'Från deras fyra förnamn',
          'Från namnet på en skivbutik',
        ],
        correct: 2,
      },
      {
        type: 'literal',
        q: 'Vilket år vann gruppen Eurovision Song Contest?',
        options: ['År 1965', 'År 1970', 'År 1980', 'År 1974'],
        correct: 3,
      },
      {
        type: 'inferens',
        q: 'Varför blev gruppen känd i hela Europa på en kväll?',
        options: [
          'För att tävlingen sändes i tv i många länder',
          'För att de reste runt och spelade överallt',
          'För att skivan såldes i alla affärer den dagen',
          'För att tidningarna skrev om dem varje vecka',
        ],
        correct: 0,
      },
      {
        type: 'ord',
        q: 'Vad menas med ett genombrott?',
        options: [
          'Ett hål som går rakt igenom något',
          'När någon slutar att uppträda',
          'När någon blir känd på riktigt',
          'En låt som ingen har hört förut',
        ],
        correct: 2,
      },
      {
        type: 'sammanfatta',
        q: 'Vad handlar texten mest om?',
        options: [
          'Hur en tv-tävling går till',
          'Vilka ABBA var och hur de blev kända',
          'Vilka länder som säljer mest skivor',
          'Hur man skriver en poplåt',
        ],
        correct: 1,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────── nivå 4 ──
  {
    id: 'ak4-abba-01',
    grade: 4,
    genre: 'berättelse',
    theme: 'musik',
    title: 'Skivan i garderoben',
    imageUrl: BILD('photo-1603850121303-d4ade9e5ba65'), // skivspelare med vinylskiva
    text:
      'Det var städdag hos farmor. Leo skulle bära ner kartonger till containern, men i den ' +
      'understa lådan låg något platt och fyrkantigt.\n\n' +
      'Han drog upp det. En stor pappersficka med fyra personer på framsidan. De såg ut som ' +
      'om de kom från en annan tid.\n\n' +
      '"Den där", sa farmor från dörren. "Den köpte jag när jag var i din ålder."\n\n' +
      'Hon tog fram en gammal skivspelare från hyllan och kopplade in den. Leo tittade skeptiskt ' +
      'på nålen som farmor sänkte ner mot skivan.\n\n' +
      'Först hördes bara ett svagt fräsande. Sedan kom pianot.\n\n' +
      'Rösterna kom in efter några takter. De var många fler än fyra, tyckte Leo, men farmor ' +
      'sa att det bara var två kvinnor som sjöng allt.\n\n' +
      'Leo hade hört låten förut, i en reklamfilm, men aldrig hela. Han satte sig på golvet ' +
      'och lyssnade utan att säga något.\n\n' +
      '"Den låter inte gammal", sa han efter en stund.\n\n' +
      'Farmor log. "Nej. Det är det som är konstigt med bra låtar."\n\n' +
      'När sidan var slut reste sig Leo och vände på skivan själv. Han fick lägga ner nålen ' +
      'tre gånger innan den hamnade rätt.\n\n' +
      'Kartongen bar han aldrig ner. Skivan står nu hemma hos Leo, lutad mot väggen bredvid ' +
      'hans säng, fast han inte har någon skivspelare.',
    questions: [
      {
        type: 'literal',
        q: 'Vad hittar Leo i den understa lådan?',
        options: [
          'En gammal skivspelare',
          'En bunt med gamla foton',
          'En skiva med fyra personer på',
          'Ett brev från sin farmor',
        ],
        correct: 2,
      },
      {
        type: 'inferens',
        q: 'Varför tittar Leo skeptiskt på nålen?',
        options: [
          'Han har aldrig sett en skivspelare användas',
          'Han tycker att farmor gör alldeles fel',
          'Han är rädd att nålen ska sticka honom',
          'Han vill hellre lyssna i sin telefon',
        ],
        correct: 0,
      },
      {
        type: 'ord',
        q: 'Vad menas med att Leo satte sig och lyssnade utan att säga något?',
        options: [
          'Att han var trött efter städningen',
          'Att han inte förstod vad låten hette',
          'Att han var sur på sin farmor',
          'Att musiken fångade honom helt',
        ],
        correct: 3,
      },
      {
        type: 'literal',
        q: 'Vad gör Leo när skivsidan är slut?',
        options: [
          'Han bär ner kartongen till containern',
          'Han vänder på skivan alldeles själv',
          'Han ber farmor att spela låten igen',
          'Han letar efter fler skivor i lådan',
        ],
        correct: 1,
      },
      {
        type: 'inferens',
        q: 'Vad menar farmor med att det är det konstiga med bra låtar?',
        options: [
          'Att de brukar spelas i reklamfilmer',
          'Att de låter bäst på en gammal skiva',
          'Att de inte känns gamla trots åren',
          'Att de är svåra att sjunga med i',
        ],
        correct: 2,
      },
      {
        type: 'forfattarens-syfte',
        q: 'Varför slutar berättelsen med skivan bredvid Leos säng?',
        options: [
          'För att visa att han glömde bort städdagen',
          'För att visa att den betyder något för honom nu',
          'För att visa att han snart ska köpa en skivspelare',
          'För att visa att farmor gav bort hela sin samling',
        ],
        correct: 1,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────── nivå 5 ──
  {
    id: 'ak5-abba-01',
    grade: 5,
    genre: 'faktatext',
    theme: 'musik',
    title: 'Kvällen i Brighton',
    imageUrl: BILD('photo-1602369944529-c237ca143d09'), // scen med ljus och publik
    text:
      'Den sjätte april 1974 stod fyra svenskar på en scen i den engelska staden Brighton. ' +
      'De skulle framföra en låt som hette Waterloo i Eurovision Song Contest.\n\n' +
      'Sverige hade varit med i tävlingen förut utan att vinna. Den här gången var något annorlunda. ' +
      'De flesta bidrag var lugna ballader. ABBA:s låt lät i stället som något man kunde dansa till, ' +
      'och den var kort och snabb från första sekunden.\n\n' +
      'Bidraget hade en historia bakom sig. Året innan hade gruppen försökt ta sig till tävlingen ' +
      'med en annan låt och misslyckats redan i den svenska uttagningen. Den här gången skrev de ' +
      'något som var tänkt att fungera just i tv: en låt som tog tag direkt, utan lång inledning.\n\n' +
      'Gruppen hade också tänkt på hur de såg ut. Kläderna var glittriga och färgstarka, ' +
      'valda för att synas på tv. Många hem hade fortfarande svartvit tv, men i de länder som ' +
      'sände i färg gick bidraget inte att missa.\n\n' +
      'Titeln kom från gruppens manager Stig Anderson. Han letade medvetet efter ord som gick att ' +
      'förstå i många länder samtidigt, och namnet på ett slag från 1815 var känt i hela Europa. ' +
      'Låten behövde alltså inte översättas för att kännas igen.\n\n' +
      'De vann. Låten låg sedan högt på listorna i flera länder, och den blev etta i Storbritannien, ' +
      'som då var en av världens viktigaste musikmarknader.\n\n' +
      'Att vinna Eurovision var ändå ingen garanti. Många tidigare vinnare hade försvunnit efter ' +
      'ett år. Skillnaden var att ABBA fortsatte att skriva nya låtar som sålde. Waterloo öppnade ' +
      'dörren, men det var låtarna efteråt som gjorde att den stod kvar öppen.\n\n' +
      'I dag räknas den där kvällen som startpunkten för svensk musikexport. Efter ABBA kom fler ' +
      'svenska artister och låtskrivare ut i världen. Sverige hade dessutom något som inte alla ' +
      'länder hade: kommunala musikskolor där barn kunde lära sig spela billigt. Att ett litet ' +
      'land kunde lyckas var inte självklart förut.',
    questions: [
      {
        type: 'literal',
        q: 'I vilken stad framförde gruppen Waterloo?',
        options: ['I Stockholm', 'I London', 'I Brighton', 'I Dublin'],
        correct: 2,
      },
      {
        type: 'literal',
        q: 'Hur skilde sig ABBA:s bidrag från de flesta andra?',
        options: [
          'Det var en lugn ballad',
          'Det gick att dansa till',
          'Det sjöngs på svenska',
          'Det var mycket längre',
        ],
        correct: 1,
      },
      {
        type: 'inferens',
        q: 'Varför valde gruppen glittriga och färgstarka kläder?',
        options: [
          'För att kläderna var billiga att köpa',
          'För att alla andra hade samma sorts kläder',
          'För att det var kallt inne i lokalen',
          'För att de skulle synas tydligt i tv-rutan',
        ],
        correct: 3,
      },
      {
        type: 'ord',
        q: 'Vad menas med en musikmarknad?',
        options: [
          'Ett torg där man säljer instrument',
          'Ett ställe där artister träffas',
          'Ett land där musik köps och säljs',
          'En lista över veckans bästa låtar',
        ],
        correct: 2,
      },
      {
        type: 'inferens',
        q: 'Varför räckte det inte att vinna tävlingen?',
        options: [
          'Många tidigare vinnare glömdes bort efter ett år',
          'Priset i tävlingen var alldeles för litet',
          'Låten var för kort för att spelas på radio',
          'Publiken i Brighton var mycket kritisk',
        ],
        correct: 0,
      },
      {
        type: 'forfattarens-syfte',
        q: 'Varför avslutar texten med den svenska musikexporten?',
        options: [
          'För att visa att Sverige ofta vinner tävlingen',
          'För att visa att kvällen fick följder långt efteråt',
          'För att visa att svenska artister sjunger på engelska',
          'För att visa att tävlingen har ändrat sina regler',
        ],
        correct: 1,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────── nivå 6 ──
  {
    id: 'ak6-abba-01',
    grade: 6,
    genre: 'faktatext',
    theme: 'språk',
    title: 'Att skriva en låt på ett annat språk',
    imageUrl: BILD('photo-1571974599782-87624638275e'), // pianotangenter
    text:
      'ABBA:s medlemmar hade svenska som modersmål, men nästan alla deras låtar är skrivna på ' +
      'engelska. Skälet var enkelt: den engelskspråkiga marknaden var många gånger större än den ' +
      'svenska. Valet fick ändå följder som handlar mer om språk än om affärer.\n\n' +
      'Arbetsgången var i regel densamma. Benny och Björn skrev musiken först. Melodin fanns alltså ' +
      'innan det fanns några ord, och orden fick sedan anpassa sig efter den. Under arbetet sjöngs ' +
      'ofta påhittade stavelser som inte betydde någonting, bara för att höra hur melodin lät med ' +
      'en röst på. Först därefter skrevs den riktiga texten.\n\n' +
      'Det förklarar en sak som lyssnare ibland lägger märke till. Vissa rader låter mer som ' +
      'ljud än som meningar. Ord väljs för att de har rätt antal stavelser och rätt vokal på rätt ' +
      'ställe, inte bara för att de betyder rätt sak. En textrad kan alltså vara skriven för örat ' +
      'i första hand.\n\n' +
      'Att skriva på ett andraspråk gav både problem och möjligheter. Problemet var att uttryck ' +
      'som låter naturliga för en engelsktalande inte alltid kom av sig själva. Möjligheten var ' +
      'att texterna blev enkla och tydliga. En lyssnare i Japan eller Argentina, som inte heller ' +
      'hade engelska som modersmål, kunde följa med utan ordbok.\n\n' +
      'Enkelheten var alltså inte bara en brist. Den var en del av varför låtarna fungerade så ' +
      'långt bort från Sverige. Samtidigt märks det att texterna sällan leker med språket på det ' +
      'sätt som en del engelskspråkiga låtskrivare gör.\n\n' +
      'Uttalet var en annan sak att förhålla sig till. Att sjunga på ett andraspråk hörs oftast, ' +
      'även hos den som talar det bra. I gruppens fall blev det sällan ett hinder, bland annat ' +
      'för att melodierna gav orden gott om plats. En snabb och pratig sångstil hade avslöjat ' +
      'betydligt mer.\n\n' +
      'Arbetet kunde ta lång tid. En melodi kunde ligga i månader innan den fick sin text, och ' +
      'flera låtar bytte namn under vägen. Det som till slut blev en refräng hade ofta prövats ' +
      'i andra former först. De skrev också ett par låtar på svenska tidigt i karriären, men ' +
      'efter genombrottet blev engelskan regel.\n\n' +
      'Valet av språk var alltså inte bara praktiskt. Det påverkade hur låtarna lät, ända ner ' +
      'på stavelsenivå.\n\n' +
      'Det finns ett känt undantag från arbetsgången. Titeln Waterloo kom från gruppens manager ' +
      'Stig Anderson, som hade en förmåga att hitta ord som fastnade och som gick att förstå i ' +
      'många länder samtidigt. Ett namn på ett slag från 1815 fungerade lika bra i Tyskland som ' +
      'i Storbritannien.',
    questions: [
      {
        type: 'literal',
        q: 'Varför skrev gruppen på engelska?',
        options: [
          'För att den marknaden var mycket större',
          'För att de inte kunde skriva på svenska',
          'För att tävlingen krävde engelska texter',
          'För att melodierna kom från England',
        ],
        correct: 0,
      },
      {
        type: 'literal',
        q: 'Vad skrevs först i arbetsgången?',
        options: ['Titeln på låten', 'Musiken till låten', 'Texten till låten', 'Namnet på skivan'],
        correct: 1,
      },
      {
        type: 'inferens',
        q: 'Varför sjöng de påhittade stavelser under arbetet?',
        options: [
          'För att spara tid när texten redan var klar',
          'För att dölja melodin för andra i studion',
          'För att höra hur melodin lät med en röst',
          'För att träna på uttalet av engelska ord',
        ],
        correct: 2,
      },
      {
        type: 'ord',
        q: 'Vad menas med att en textrad är skriven för örat?',
        options: [
          'Att den ska läsas högt av en enda person',
          'Att den ska sjungas långsammare än de andra',
          'Att den handlar om att lyssna på musik',
          'Att ordens ljud betyder mer än deras innebörd',
        ],
        correct: 3,
      },
      {
        type: 'textbevis',
        q: 'Vilken mening i texten visar varför enkla texter fungerade långt från Sverige?',
        options: [
          'Melodin fanns alltså innan det fanns några ord, och orden fick sedan anpassa sig efter den.',
          'Skälet var enkelt: den engelskspråkiga marknaden var många gånger större än den svenska.',
          'En lyssnare i Japan eller Argentina, som inte heller hade engelska som modersmål, kunde följa med utan ordbok.',
          'Vissa rader låter mer som ljud än som meningar.',
        ],
        correct: 2,
      },
      {
        type: 'sammanfatta',
        q: 'Vad handlar texten framför allt om?',
        options: [
          'Hur ett språkval formade hur låtarna skrevs',
          'Hur en manager hittade titeln till Waterloo',
          'Hur svårt det är att lära sig engelska ord',
          'Hur en melodi byggs upp av olika stavelser',
        ],
        correct: 0,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────── nivå 7 ──
  {
    id: 'ak7-abba-01',
    grade: 7,
    genre: 'faktatext',
    theme: 'musik',
    title: 'Glädje och sorg i samma låt',
    imageUrl: BILD('photo-1476136236990-838240be4859'), // mikrofon i mörker
    text:
      'En vanlig iakttagelse om ABBA är att musiken låter glad medan texterna ofta inte är det. ' +
      'Låtar som spelas på fester handlar vid närmare läsning om svartsjuka, ensamhet och ' +
      'relationer som tagit slut. Att den kombinationen fungerar är ingen slump, och den går ' +
      'att beskriva ganska konkret.\n\n' +
      'En del av förklaringen ligger i melodierna. Flera av gruppens mest kända låtar rör sig ' +
      'mellan dur och moll på ett sätt som är vanligt i nordisk folkmusik. En refräng kan börja ' +
      'ljust och sedan glida ner i ett tonläge som känns tyngre, utan att tempot ändras. ' +
      'Lyssnaren hör alltså två saker samtidigt: kroppen vill fortsätta röra sig, men ' +
      'stämningen har blivit mörkare.\n\n' +
      'En annan del ligger i arrangemanget. Trummorna och basen håller ett stadigt dansunderlag ' +
      'genom hela låten, oavsett vad som sjungs ovanpå. Musiken drar alltså åt ett håll och orden ' +
      'åt ett annat. Det är en spänning som förstärker båda delarna. Samma text sjungen till ett ' +
      'långsamt piano hade låtit sorgsen på ett mycket mer förutsägbart sätt.\n\n' +
      'Ett tydligt exempel är The Winner Takes It All från 1980. Melodin är storslagen och ' +
      'refrängen ligger högt, men texten beskriver någon som förlorat allt i ett uppbrott och ' +
      'som talar till den som gick vidare. Låten skrevs under en period när två av gruppens ' +
      'medlemmar hade skilt sig från varandra, vilket lyssnare i alla år har läst in i texten. ' +
      'Björn Ulvaeus har själv sagt att den inte handlar om hans eget liv rakt av, men att ' +
      'känslan kom någonstans ifrån.\n\n' +
      'Ett par av de mest spelade låtarna står dessutom i moll rakt igenom. Gimme! Gimme! Gimme! ' +
      'handlar om ensamhet en fredagkväll, och tonarten döljer det inte. Ändå har den spelats på ' +
      'dansgolv i decennier, vilket säger något om att sorgsen musik och rörelse inte utesluter ' +
      'varandra.\n\n' +
      'Sångstilen bidrar också. Rösterna sjunger sällan med stora gester eller hörbar dramatik. ' +
      'De håller en rak, nästan behärskad ton även när texten beskriver ett sammanbrott. Den ' +
      'återhållsamheten gör ofta större intryck än om känslan hade markerats tydligt, eftersom ' +
      'lyssnaren själv får fylla i resten.\n\n' +
      'Greppet är inte unikt för en enda grupp. Mycket populärmusik bygger på samma spänning, och ' +
      'den finns långt tillbaka i visor och folkmusik. Det ovanliga är hur konsekvent det används, ' +
      'och att det sker i låtar som samtidigt är byggda för att sälja i miljonupplagor.\n\n' +
      'Det finns också en praktisk sida. En låt som bara är sorgsen spelas sällan på radio och ' +
      'aldrig på ett bröllop. En låt som låter glad kommer in överallt, och kan då bära med sig ' +
      'ett innehåll som är betydligt mörkare än förpackningen antyder. Musiken blir en sorts ' +
      'inträdesbiljett för texten.\n\n' +
      'Det gäller även de gladaste av låtarna, om man läser dem sittande i stället för dansande.\n\n' +
      'Kanske är det därför låtarna håller. En ren festlåt tröttnar man på när festen är slut. ' +
      'En låt som rymmer två känslor samtidigt kan man återvända till i olika åldrar och höra ' +
      'olika saker i den. Den som dansade till en av dem som fjortonåring kan lyssna igen ' +
      'tjugo år senare och för första gången höra vad orden faktiskt säger.',
    questions: [
      {
        type: 'literal',
        q: 'Vad håller trummorna och basen genom låtarna?',
        options: [
          'Ett stadigt dansunderlag',
          'En långsam och mjuk takt',
          'En melodi i moll hela tiden',
          'En paus i varje refräng',
        ],
        correct: 0,
      },
      {
        type: 'inferens',
        q: 'Varför förstärker musiken och orden varandra när de drar åt olika håll?',
        options: [
          'För att lyssnaren hör två känslor samtidigt',
          'För att texten då blir lättare att komma ihåg',
          'För att melodin annars skulle bli för enkel',
          'För att refrängen upprepas flera gånger',
        ],
        correct: 0,
      },
      {
        type: 'literal',
        q: 'Vilket år kom The Winner Takes It All?',
        options: ['År 1974', 'År 1976', 'År 1980', 'År 1982'],
        correct: 2,
      },
      {
        type: 'ord',
        q: 'Vad menas med att musiken blir en inträdesbiljett för texten?',
        options: [
          'Att man måste betala för att höra låten',
          'Att melodin gör att texten når fram överallt',
          'Att texten skrivs efter att musiken är klar',
          'Att låten bara spelas vid vissa tillfällen',
        ],
        correct: 1,
      },
      {
        type: 'textbevis',
        q: 'Vilken mening i texten är belägg för att en sorgsen låt får mindre spridning?',
        options: [
          'Musiken drar alltså åt ett håll och orden åt ett annat.',
          'En ren festlåt tröttnar man på när festen är slut.',
          'En låt som bara är sorgsen spelas sällan på radio och aldrig på ett bröllop.',
          'Rösterna sjunger sällan med stora gester eller hörbar dramatik.',
        ],
        correct: 2,
      },
      {
        type: 'forfattarens-syfte',
        q: 'Varför avslutar texten med lyssnaren som återvänder tjugo år senare?',
        options: [
          'För att visa att gamla låtar spelas mest på radio',
          'För att visa att texterna är svåra att förstå som ung',
          'För att visa att dubbelheten gör låtarna hållbara',
          'För att visa att musiksmaken ändras med åldern',
        ],
        correct: 2,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────── nivå 8 ──
  {
    id: 'ak8-abba-01',
    grade: 8,
    genre: 'faktatext',
    theme: 'teknik',
    title: 'Innan man kunde ångra sig',
    imageUrl: BILD('photo-1618609377864-68609b857e90'), // mixerbord i studio
    text:
      'När ABBA spelade in sina skivor på 1970-talet fanns inga datorer i studion. Ljudet ' +
      'lagrades på magnetband, och bandet hade ett bestämt antal spår. Den begränsningen ' +
      'styrde arbetet på ett sätt som är svårt att föreställa sig i dag, när en inspelning ' +
      'kan ha hur många spår som helst och varje misstag kan ångras med en tangenttryckning.\n\n' +
      'Ett spår är en plats för ett ljud. Med sexton spår kunde man alltså spela in sexton saker ' +
      'var för sig: trummor på några, bas på ett, piano på ett, sång på ett par. När spåren tog ' +
      'slut fick man slå ihop flera till ett enda, och därefter gick de inte att skilja åt igen. ' +
      'Var trumman för hög i förhållande till basen efter en sådan sammanslagning satt felet där ' +
      'för gott.\n\n' +
      'Det innebar att besluten måste fattas tidigt. I dag kan en producent skjuta upp nästan ' +
      'alla val till slutet. På band gick det inte. Man måste veta hur låten skulle låta färdig ' +
      'redan innan alla delar var inspelade.\n\n' +
      'Ljudteknikern Michael B. Tretow arbetade nära gruppen och blev känd för ett särskilt ' +
      'grepp. Han lät samma stämma spelas in två gånger och la de två inspelningarna ovanpå ' +
      'varandra. Eftersom ingen människa kan sjunga eller spela exakt likadant två gånger ' +
      'uppstod små skillnader i tid och tonhöjd. Örat uppfattar inte skillnaderna var för sig, ' +
      'utan hör i stället ett bredare och fylligare ljud. Ibland ändrades dessutom bandhastigheten ' +
      'något mellan tagningarna, vilket förstärkte effekten.\n\n' +
      'Metoden var inte ny. Den byggde på idéer från amerikanska producenter. De hade staplat ' +
      'många musiker på varandra för att fylla ut ljudbilden. Det nya var att en liten studio i ' +
      'Stockholm kunde åstadkomma något liknande med få musiker och ett tålmodigt bandspelararbete.\n\n' +
      'Klippning skedde med rakblad. Ville man ta bort ett par sekunder ur en låt letade teknikern ' +
      'upp stället på bandet, skar av det och tejpade ihop ändarna igen. Ett felskuret band gick ' +
      'inte att laga. Det förklarar varför man ofta valde att spela in en tagning till i stället ' +
      'för att klippa.\n\n' +
      'Studiotiden var dessutom dyr och betalades per timme. Därför repeterades mycket innan ' +
      'bandspelaren ens startades. Musikerna kom till inspelningen med sina delar färdiga, vilket ' +
      'är en annan skillnad mot i dag, då stora delar av arbetet kan göras medan inspelningen ' +
      'pågår.\n\n' +
      'Antalet spår växte snabbt under årtiondet. Från åtta gick man till sexton och sedan till ' +
      'tjugofyra, och varje steg gav mer utrymme att ändra sig i efterhand. Utvecklingen syns i ' +
      'skivorna: de senare inspelningarna är tätare och har fler lager än de tidiga.\n\n' +
      'Tekniken hörs tydligast i körerna. Två sångerskor kan låta som betydligt fler, och det ' +
      'är en stor del av varför refrängerna känns så stora. Det som låter som en kör är i själva ' +
      'verket samma två röster, inspelade om och om igen.\n\n' +
      'Frågan om vad tekniken gör med musiken är inte bara historisk. Samma diskussion förs i dag ' +
      'om verktyg som rättar tonhöjd automatiskt och om program som kan skapa hela ackompanjemang. ' +
      'Varje generation får hantera att gränsen mellan skicklighet och redskap flyttar sig.\n\n' +
      'Begränsningen formade alltså ljudet. Hade gruppen haft dagens verktyg är det inte säkert ' +
      'att skivorna hade låtit bättre. De hade förmodligen låtit annorlunda, eftersom en del av ' +
      'karaktären kom ur att man var tvungen att bestämma sig.',
    questions: [
      {
        type: 'literal',
        q: 'Vad lagrades ljudet på i studion under 1970-talet?',
        options: ['På hårddiskar', 'På magnetband', 'På vinylskivor', 'På minneskort'],
        correct: 1,
      },
      {
        type: 'inferens',
        q: 'Varför måste besluten fattas tidigt när man spelade in på band?',
        options: [
          'För att studion bara var bokad ett par timmar',
          'För att bandet slets ut om det spelades för ofta',
          'För att sammanslagna spår inte gick att skilja åt igen',
          'För att musikerna inte kunde spela låten flera gånger',
        ],
        correct: 2,
      },
      {
        type: 'literal',
        q: 'Vad gjorde Michael B. Tretow med stämmorna?',
        options: [
          'Han spelade in dem två gånger och la dem ovanpå varandra',
          'Han lät en större kör sjunga alla stämmor tillsammans',
          'Han spelade upp dem baklänges för att få ett nytt ljud',
          'Han tog bort de stämmor som lät minst i inspelningen',
        ],
        correct: 0,
      },
      {
        type: 'ord',
        q: 'Vad menas med ett spår i sammanhanget?',
        options: [
          'Ett märke som nålen lämnar i skivan',
          'En plats på bandet för ett enskilt ljud',
          'En låt på den färdiga skivan',
          'En rad i texten som sjungs av en person',
        ],
        correct: 1,
      },
      {
        type: 'textbevis',
        q: 'Vilken mening i texten förklarar varför dubbleringen ger ett fylligare ljud?',
        options: [
          'Ibland ändrades dessutom bandhastigheten något mellan tagningarna, vilket förstärkte effekten.',
          'Det som låter som en kör är i själva verket samma två röster, inspelade om och om igen.',
          'De hade staplat många musiker på varandra för att fylla ut ljudbilden.',
          'Eftersom ingen människa kan sjunga eller spela exakt likadant två gånger uppstod små skillnader i tid och tonhöjd.',
        ],
        correct: 3,
      },
      {
        type: 'sammanfatta',
        q: 'Vad är textens huvudbudskap?',
        options: [
          'Att dagens studioteknik är sämre än sjuttiotalets',
          'Att teknikens gränser var med och formade ljudet',
          'Att en kör alltid låter bättre än två sångerskor',
          'Att svenska studior var störst i världen på den tiden',
        ],
        correct: 1,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────── nivå 9 ──
  {
    id: 'ak9-abba-01',
    grade: 9,
    genre: 'faktatext',
    theme: 'Teknik',
    title: 'Konserten utan band',
    imageUrl: BILD('photo-1729553199933-c897fea4f41f'), // strålkastare över publik
    text:
      'I en specialbyggd arena i östra London går sedan 2022 en föreställning där publiken ser ' +
      'fyra artister röra sig på scenen, sjunga och tala mellan låtarna. Ingen av dem är där. ' +
      'Figurerna är digitala, byggda utifrån inspelningar av de verkliga personerna, och de ' +
      'kallas ibland för avatarer.\n\n' +
      'Underlaget skapades under några veckors arbete där medlemmarna bar dräkter täckta av ' +
      'sensorer. Rörelserna registrerades från flera håll samtidigt och överfördes till modeller ' +
      'som ser ut som de gjorde i slutet av 1970-talet. Rösterna är däremot nyinspelade och ' +
      'tillhör personerna som de låter i dag. Föreställningen blandar alltså ett utseende från ' +
      'en tid med en röst från en annan.\n\n' +
      'På scenen finns samtidigt ett riktigt band av musiker som spelar varje kväll. Det är ' +
      'ett medvetet val. Utan levande musiker hade det hela liknat en filmvisning, och just ' +
      'gränsen mellan inspelat och levande är vad publiken kommer för att uppleva.\n\n' +
      'Föreställningen hänger ihop med att gruppen 2021 gav ut ett album med nytt material, ' +
      'fyrtio år efter det förra. De två sakerna presenterades tillsammans, och det gjorde ' +
      'skillnad för hur projektet uppfattades. Det handlade alltså inte enbart om att återuppliva ' +
      'ett arkiv.\n\n' +
      'Arbetet bakom är omfattande. Ett stort antal personer arbetade i flera år med att bygga ' +
      'figurerna, och kostnaden uppges ha legat på över en miljard kronor. Det är i sig ett skäl ' +
      'till att formatet ännu är ovanligt: bara artister med mycket stor publik kan räkna hem en ' +
      'sådan investering.\n\n' +
      'Publikreaktionerna beskriver genomgående en effekt som förvånar många på plats. Efter en ' +
      'stund slutar man tänka på att figurerna inte är verkliga. Hjärnan tycks acceptera det som ' +
      'händer så länge ljus, ljud och rörelser hänger ihop.\n\n' +
      'Föreställningen väcker en fråga som sträcker sig långt utanför en enskild grupp: vad är ' +
      'det egentligen som gör en konsert till en konsert? Ett vanligt svar är närvaron. Publiken ' +
      'och artisten befinner sig på samma plats vid samma tillfälle, och något kan gå fel. Den ' +
      'osäkerheten är en del av upplevelsen. I London är den borta. Varje kväll är identisk.\n\n' +
      'Ett annat svar handlar om gemenskapen i salen. Den är fortfarande verklig. Människor står ' +
      'bredvid varandra, sjunger med och känner samma sak vid samma sekund. Ur den synvinkeln ' +
      'spelar det mindre roll om den som står på scenen är en projektion.\n\n' +
      'Tekniken reser också frågor som ännu inte har prövats fullt ut. Vem äger rätten till en ' +
      'digital kopia av en persons utseende och röst? Vad händer när artisten inte längre lever? ' +
      'Flera avlidna artister har redan framträtt som projektioner, och där har beslutet fattats ' +
      'av arvingar och bolag i stället för av personen själv. I det här fallet var medlemmarna ' +
      'med under hela arbetet, vilket gör det till ett ovanligt tydligt exempel på hur det kan ' +
      'gå till när alla inblandade lever och samtycker.\n\n' +
      'Juridiken hinner sällan i kapp tekniken. I flera länder saknas tydliga regler för hur en ' +
      'persons röst och utseende får återskapas digitalt, och de avtal som skrivs i dag prövas ' +
      'därför sällan i domstol.\n\n' +
      'En invändning är att en sådan upplevelse säljer en bild av personer som de såg ut för ' +
      'nästan femtio år sedan. Nostalgin är i så fall inte något publiken tar med sig själv, ' +
      'utan något som är noggrant konstruerat åt den.\n\n' +
      'Det troliga är att formatet sprider sig. En föreställning som inte kräver att någon reser ' +
      'kan gå varje kväll i åratal, och den åldras inte. Om publiken kommer att uppleva det som ' +
      'en fullvärdig konsert eller som något annat är fortfarande en öppen fråga.',
    questions: [
      {
        type: 'literal',
        q: 'Vad byggdes de digitala figurerna utifrån?',
        options: [
          'Gamla fotografier från 1970-talet',
          'Inspelningar av de verkliga personerna',
          'Ritningar som gjordes för hand',
          'Filmklipp från tidigare konserter',
        ],
        correct: 1,
      },
      {
        type: 'literal',
        q: 'Varför finns det riktiga musiker på scenen?',
        options: [
          'För att publiken annars inte hör musiken',
          'För att figurerna inte kan röra sig i takt',
          'För att det annars hade liknat en filmvisning',
          'För att arenan kräver det enligt reglerna',
        ],
        correct: 2,
      },
      {
        type: 'inferens',
        q: 'Varför nämner texten att varje kväll är identisk?',
        options: [
          'För att visa att osäkerheten i en konsert är borta',
          'För att visa att publiken tröttnar efter ett tag',
          'För att visa att musikerna spelar samma låtar',
          'För att visa att biljetterna kostar lika mycket',
        ],
        correct: 0,
      },
      {
        type: 'ord',
        q: 'Vad menas med en avatar i texten?',
        options: [
          'En inspelning av en tidigare konsert',
          'En dräkt täckt av små sensorer',
          'En musiker som ersätter en annan',
          'En digital figur som föreställer en person',
        ],
        correct: 3,
      },
      {
        type: 'textbevis',
        q: 'Vilken mening i texten är belägg för att beslutet ibland fattas av andra än artisten?',
        options: [
          'Rösterna är däremot nyinspelade och tillhör personerna som de låter i dag.',
          'Flera avlidna artister har redan framträtt som projektioner, och där har beslutet fattats av arvingar och bolag i stället för av personen själv.',
          'Vem äger rätten till en digital kopia av en persons utseende och röst?',
          'En föreställning som inte kräver att någon reser kan gå varje kväll i åratal, och den åldras inte.',
        ],
        correct: 1,
      },
      {
        type: 'forfattarens-syfte',
        q: 'Varför avslutar texten med en öppen fråga?',
        options: [
          'För att visa att tekniken snart kommer att förbjudas',
          'För att visa att publiken redan har bestämt sig',
          'För att visa att svaret inte går att ge ännu',
          'För att visa att konserter borde ha levande artister',
        ],
        correct: 2,
      },
    ],
  },

  // ────────────────────────────────────────────────────────────── nivå 10 ──
  {
    id: 'ak10-abba-01',
    grade: 10,
    genre: 'faktatext',
    theme: 'kultur',
    title: 'Smaken som ändrade sig',
    imageUrl: BILD('photo-1596633313465-1256feb1c6d9'), // hylla full av vinylskivor
    text:
      'Få grupper har flyttat sig lika långt i kritikernas ögon som ABBA. Under sina aktiva år ' +
      'behandlades de i svensk press ofta med ett tonfall som låg någonstans mellan överseende ' +
      'och förakt. I dag skrivs det avhandlingar om dem, de finns i Rock and Roll Hall of Fame ' +
      'och deras låtar analyseras med samma allvar som annan populärmusik. Frågan är vad som ' +
      'egentligen förändrades, för musiken är densamma.\n\n' +
      'Kritiken hade flera grunder, och alla handlade inte om ljudet. Sjuttiotalets svenska ' +
      'musikdebatt präglades av en rörelse som menade att musik borde ha ett politiskt innehåll ' +
      'och göras utanför de stora bolagen. Mot den bakgrunden framstod en grupp som sålde skivor ' +
      'över hela världen och sjöng om kärlek som en motsats till det man ville uppmuntra. ' +
      'Kommersiell framgång var inte ett neutralt faktum utan ett argument mot.\n\n' +
      'Motsättningen var inte bara teoretisk. Delar av rörelsen ordnade egna festivaler och ' +
      'startade egna skivbolag, och gruppen kom under en period att fungera som symbol för allt ' +
      'man ville bort ifrån. Att kritiken riktades mot vad musiken representerade snarare än mot ' +
      'hur den lät gjorde den svår att bemöta.\n\n' +
      'Till detta kom en äldre uppdelning som fanns långt innan sjuttiotalet. Musik som riktar ' +
      'sig till en bred publik, och särskilt musik som förknippas med unga kvinnor, har ' +
      'återkommande beskrivits som ytlig. Samma egenskap hos en manlig rockgrupp har oftare ' +
      'lästs som direkthet eller energi. Flera musikforskare har pekat på det mönstret, och det ' +
      'räcker att jämföra hur samtida recensioner beskrev olika publiker för att se det.\n\n' +
      'Omvärderingen kom stegvis. Samlingsskivan ABBA Gold nådde 1992 en generation som inte ' +
      'hade några ideologiska konflikter kring gruppen. Musikalen Mamma Mia! flyttade låtarna ' +
      'in i ett annat sammanhang, där de fungerade som byggstenar i en berättelse. Samtidigt ' +
      'började låtskrivare i andra genrer öppet hänvisa till gruppens arrangemang som något ' +
      'att lära av.\n\n' +
      'Här finns dock en risk att berätta historien för enkelt, som om okunniga kritiker till ' +
      'slut kom till insikt. En mer rimlig läsning är att kriterierna byttes ut. På sjuttiotalet ' +
      'bedömdes musik i hög grad efter avsikt och hållning. Senare har hantverket, melodin och ' +
      'produktionen fått väga tyngre. Med de senare måtten framstår gruppen som självklart ' +
      'skicklig. Med de förra gjorde den inte det. Ingen av bedömningarna är felaktig i sig; ' +
      'de mäter olika saker.\n\n' +
      'Omvärderingen har dessutom en ekonomisk sida som sällan nämns. Ett verk som blir betraktat ' +
      'som klassiskt säljer bättre, och rättighetshavare har intresse av att en sådan berättelse ' +
      'etableras. Det gör inte den nya bedömningen falsk, men den är inte heller enbart resultatet ' +
      'av att någon lyssnade en gång till.\n\n' +
      'Det betyder inte att alla omvärderingar är lika välgrundade. En del artister lyfts fram ' +
      'igen därför att deras musik faktiskt tål att höras på nytt, andra därför att en generation ' +
      'känner nostalgi. Att skilja de två fallen åt kräver just att man säger vilka mått man ' +
      'använder.\n\n' +
      'Det säger något om hur kulturella värderingar fungerar. En dom över ett verk är sällan ' +
      'bara en dom över verket. Den bär också med sig vad samtiden anser att konst är till för. ' +
      'När det svaret ändras kan ett verk som stått stilla plötsligt se annorlunda ut.\n\n' +
      'Ett liknande mönster går att följa i andra konstformer. Deckare, serier och film ' +
      'betraktades länge som ren förströelse innan de togs på allvar, och i varje fall handlade ' +
      'förskjutningen lika mycket om vem som bedömde som om vad som bedömdes.\n\n' +
      'Den insikten är användbar även utanför musiken. Den som i dag är säker på vad som är ' +
      'värdelöst gör klokt i att lägga märke till vilka mått hen använder, och att fråga sig ' +
      'om de är de enda tänkbara.',
    questions: [
      {
        type: 'literal',
        q: 'Vad menade den svenska musikrörelsen på 1970-talet att musik borde ha?',
        options: [
          'Ett politiskt innehåll',
          'En internationell publik',
          'En tydlig melodi',
          'Ett modernt ljud',
        ],
        correct: 0,
      },
      {
        type: 'inferens',
        q: 'Varför var kommersiell framgång ett argument mot gruppen?',
        options: [
          'För att skivorna kostade för mycket att köpa',
          'För att den stred mot det rörelsen ville uppmuntra',
          'För att bolagen vägrade ge ut annan musik',
          'För att publiken utomlands var svår att nå',
        ],
        correct: 1,
      },
      {
        type: 'inferens',
        q: 'Vad visar jämförelsen med manliga rockgrupper?',
        options: [
          'Att rockmusik ofta är mer politisk än pop',
          'Att recensenter sällan lyssnade på skivorna',
          'Att samma egenskap bedömdes olika hos olika artister',
          'Att unga kvinnor köpte fler skivor än andra',
        ],
        correct: 2,
      },
      {
        type: 'ord',
        q: 'Vad menas med att kriterierna byttes ut?',
        options: [
          'Att recensenterna ersattes av yngre skribenter',
          'Att tidningarna slutade skriva om musik',
          'Att gruppen ändrade sitt sätt att göra låtar',
          'Att man började mäta musik med andra mått',
        ],
        correct: 3,
      },
      {
        type: 'textbevis',
        q: 'Vilken mening i texten är belägg för att den enkla berättelsen om insikt inte håller?',
        options: [
          'Ingen av bedömningarna är felaktig i sig; de mäter olika saker.',
          'Samlingsskivan ABBA Gold nådde 1992 en generation som inte hade några ideologiska konflikter kring gruppen.',
          'Att kritiken riktades mot vad musiken representerade snarare än mot hur den lät gjorde den svår att bemöta.',
          'Kritiken hade flera grunder, och alla handlade inte om ljudet.',
        ],
        correct: 0,
      },
      {
        type: 'forfattarens-syfte',
        q: 'Vad vill texten framför allt att läsaren ska ta med sig?',
        options: [
          'Att kritiker från sjuttiotalet bedömde musiken helt fel',
          'Att en dom över ett verk också speglar samtidens mått',
          'Att populärmusik bör analyseras i skolan oftare',
          'Att musikaler kan förändra hur låtar uppfattas',
        ],
        correct: 1,
      },
    ],
  },
];

// ── Kontroll och skrivning ──────────────────────────────────────────────────
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));
const dry = process.argv.includes('--dry');

const ORDINTERVALL = {
  1: [40, 60], 2: [65, 90], 3: [150, 165], 4: [200, 220], 5: [300, 320],
  6: [400, 415], 7: [500, 530], 8: [530, 570], 9: [570, 590], 10: [590, 625],
};

const befintliga = new Set(lib.map((t) => t.id));
const titlar = new Set(lib.map((t) => `${(t.title || '').trim().toLowerCase()}|${t.grade}`));
let avbryt = false;

TEXTER.forEach((t) => {
  if (befintliga.has(t.id)) {
    console.error(`ID finns redan: ${t.id}`);
    avbryt = true;
  }
  if (titlar.has(`${t.title.trim().toLowerCase()}|${t.grade}`)) {
    console.error(`${t.id}: titeln finns redan på nivå ${t.grade}`);
    avbryt = true;
  }

  // Ett textbevis är bara ett textbevis om alternativen står ordagrant i texten.
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
    `nivå ${String(t.grade).padStart(2)}  ${t.id.padEnd(16)} ${String(ord).padStart(3)} ord  ` +
      `${(ord / meningar).toFixed(1)} ord/mening  svar ${t.questions.map((q) => q.correct).join('')}`
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
