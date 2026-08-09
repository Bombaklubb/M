// Ordförklaringar för svåra ord i texter
// Nyckel = ord (lowercase), värde = { def: förklaring, ex: exempelmening }

export interface WordDefinition {
  def: string;
  ex?: string;
}

export const WORD_DICTIONARY: Record<string, WordDefinition> = {
  // Allmänna svåra ord
  'kontext': { def: 'Sammanhanget eller omständigheterna runt något', ex: 'För att förstå citatet måste man känna till kontexten.' },
  'perspektiv': { def: 'Synvinkel eller sätt att se på något', ex: 'Från elevernas perspektiv var provet svårt.' },
  'relevant': { def: 'Viktigt och passande för ämnet', ex: 'Informationen var relevant för uppgiften.' },
  'analysera': { def: 'Undersöka noggrant för att förstå', ex: 'Vi ska analysera texten och hitta huvudbudskapet.' },
  'fenomen': { def: 'Något som händer eller finns, ofta ovanligt', ex: 'Norrsken är ett vackert naturfenomen.' },
  'komplex': { def: 'Komplicerad, med många delar', ex: 'Problemet var mer komplext än vi trodde.' },
  'abstrakt': { def: 'Svårt att förstå, inte konkret', ex: 'Kärlek är ett abstrakt begrepp.' },
  'konkret': { def: 'Verkligt och tydligt, inte abstrakt', ex: 'Ge mig ett konkret exempel.' },
  'hypotes': { def: 'En gissning som man testar', ex: 'Forskarens hypotes visade sig stämma.' },
  'teori': { def: 'En förklaring som stöds av fakta', ex: 'Darwins teori om evolution.' },
  'innovation': { def: 'Något nytt och förbättrat', ex: 'Smartphones var en stor innovation.' },
  'strategi': { def: 'En plan för att nå ett mål', ex: 'Laget hade en bra strategi för matchen.' },
  'integration': { def: 'Att sätta samman olika delar till en helhet', ex: 'Integration av nya elever i klassen.' },
  'dynamisk': { def: 'Föränderlig och aktiv', ex: 'Staden har en dynamisk atmosfär.' },
  'statisk': { def: 'Stillastående, utan förändring', ex: 'Bilden var statisk, inget rörde sig.' },
  'process': { def: 'En serie händelser som leder till ett resultat', ex: 'Inlärning är en lång process.' },
  'struktur': { def: 'Hur något är uppbyggt', ex: 'Textens struktur var tydlig med inledning och avslutning.' },
  'faktor': { def: 'Något som påverkar ett resultat', ex: 'Sömn är en viktig faktor för hälsan.' },
  'aspekt': { def: 'En sida eller del av något', ex: 'Vi diskuterade olika aspekter av problemet.' },
  'betydelse': { def: 'Vad något betyder eller hur viktigt det är', ex: 'Händelsen hade stor betydelse för historien.' },
  'bidra': { def: 'Hjälpa till, vara en del av', ex: 'Alla kan bidra till en bättre miljö.' },
  'påverka': { def: 'Ha effekt på något', ex: 'Vädret påverkar vårt humör.' },
  'utveckla': { def: 'Förändra och förbättra över tid', ex: 'Hon utvecklade sina kunskaper i matte.' },
  'etablera': { def: 'Grunda eller starta något', ex: 'De etablerade ett nytt företag.' },
  'period': { def: 'En avgränsad tid', ex: 'Under denna period skedde många förändringar.' },
  'generation': { def: 'Människor födda ungefär samtidigt', ex: 'Varje generation har sin egen musik.' },
  'tradition': { def: 'Seder som går i arv', ex: 'Att fira midsommar är en svensk tradition.' },
  'kultur': { def: 'Seder, konst och värderingar i ett samhälle', ex: 'Varje land har sin unika kultur.' },
  'samhälle': { def: 'Människor som lever tillsammans med gemensamma regler', ex: 'Skolan är en del av samhället.' },
  'individ': { def: 'En enskild person', ex: 'Varje individ är unik.' },
  'miljö': { def: 'Omgivningen runt oss', ex: 'Vi måste skydda miljön.' },
  'resurs': { def: 'Tillgång som kan användas', ex: 'Vatten är en viktig naturresurs.' },
  'metod': { def: 'Ett sätt att göra något', ex: 'Läraren använde en ny metod.' },
  'resultat': { def: 'Det som blir efter en handling', ex: 'Resultatet av experimentet överraskade alla.' },
  'effekt': { def: 'Verkan eller följd', ex: 'Medicinen hade god effekt.' },
  'orsak': { def: 'Anledning till att något händer', ex: 'Orsaken till branden var okänd.' },
  'konsekvens': { def: 'Följd av något', ex: 'Konsekvensen av beslutet blev stor.' },
  'slutsats': { def: 'Det man kommer fram till', ex: 'Min slutsats är att vi behöver mer tid.' },
  'argument': { def: 'Skäl för eller emot något', ex: 'Hon hade starka argument för sin åsikt.' },
  'opinion': { def: 'Allmänhetens åsikt', ex: 'Opinionen var delad i frågan.' },

  // Vetenskap
  'nebulosa': { def: 'Ett stort moln av gas och stoft i rymden', ex: 'Stjärnor föds inuti nebulosor.' },
  'gravitation': { def: 'Kraften som drar föremål mot varandra', ex: 'Gravitationen håller oss på jorden.' },
  'ackretion': { def: 'När material samlas och växer till större kroppar', ex: 'Planeter bildas genom ackretion.' },
  'planetesimaler': { def: 'Små byggstenar som bildade planeter', ex: 'Planetesimaler kolliderade och blev till planeter.' },
  'kondensera': { def: 'Att gå från gas till fast form eller vätska', ex: 'Vattenånga kondenserar till droppar.' },
  'exoplanet': { def: 'En planet som kretsar runt en annan stjärna än solen', ex: 'Forskare har hittat tusentals exoplaneter.' },
  'resonans': { def: 'När två saker påverkar varandra regelbundet', ex: 'Planeternas banor är i resonans med varandra.' },
  'rumtid': { def: 'En kombination av rum och tid enligt Einsteins teori', ex: 'Gravitation kröker rumtiden.' },
  'atmosfär': { def: 'Luftlagret runt en planet – eller stämningen på en plats', ex: 'Jordens atmosfär skyddar oss från strålning. Arenan hade en speciell atmosfär.' },
  'organism': { def: 'Ett levande väsen', ex: 'Alla organismer behöver energi.' },
  'evolution': { def: 'Hur arter förändras över tid', ex: 'Evolution sker genom naturligt urval.' },
  'cell': { def: 'Minsta levande enhet', ex: 'Kroppen består av miljarder celler.' },
  'molekyl': { def: 'Minsta del av ett ämne', ex: 'Vatten består av vattenmolekyler.' },
  'energi': { def: 'Kraft att utföra arbete', ex: 'Solen ger oss energi.' },
  'materia': { def: 'Allt som tar plats och har massa', ex: 'Allt runt oss är materia.' },

  // Demokrati & samhälle
  'demokrati': { def: 'Folkstyrelse där medborgarna bestämmer', ex: 'I en demokrati har alla rätt att rösta.' },
  'suveränitet': { def: 'Självständighet och högsta makt', ex: 'Landet försvarade sin suveränitet.' },
  'samhällskontrakt': { def: 'En överenskommelse mellan folk och stat', ex: 'Samhällskontraktet innebär rättigheter och skyldigheter.' },
  'representation': { def: 'Att företräda någon annan', ex: 'Riksdagen är folkets representation.' },
  'legitimitet': { def: 'Att vara rättmätigt accepterad', ex: 'Regeringen behöver legitimitet från folket.' },
  'institution': { def: 'En organisation med viktiga uppgifter i samhället', ex: 'Skolan är en viktig institution.' },
  'rättsstat': { def: 'Ett samhälle där lagar gäller för alla', ex: 'I en rättsstat är alla lika inför lagen.' },
  'marginaliserad': { def: 'Utestängd från samhällets centrum', ex: 'Marginaliserade grupper behöver stöd.' },
  'desinformation': { def: 'Falsk information som sprids medvetet', ex: 'Desinformation kan påverka val.' },
  'globalisering': { def: 'Att världens länder blir mer sammankopplade', ex: 'Globaliseringen har ökat handeln mellan länder.' },
  'medborgare': { def: 'Person som tillhör ett land', ex: 'Som medborgare har man rösträtt.' },
  'rättighet': { def: 'Något man har rätt till', ex: 'Yttrandefrihet är en grundläggande rättighet.' },
  'skyldighet': { def: 'Något man måste göra', ex: 'Att betala skatt är en skyldighet.' },
  'lag': { def: 'En grupp som spelar eller arbetar tillsammans – eller en regel som alla måste följa', ex: 'Laget vann matchen. Lagen förbjuder stöld.' },
  'politik': { def: 'Hur samhället styrs', ex: 'Politik handlar om gemensamma beslut.' },
  'ekonomi': { def: 'Hur pengar och resurser fördelas', ex: 'Ekonomin påverkar allas vardag.' },
  'konflikt': { def: 'Oenighet eller bråk', ex: 'Konflikten löstes genom samtal.' },
  'kompromiss': { def: 'När båda sidor ger efter lite', ex: 'De nådde en kompromiss.' },
  'minoritet': { def: 'En mindre grupp', ex: 'Minoriteters rättigheter ska skyddas.' },
  'majoritet': { def: 'Den större gruppen, mer än hälften', ex: 'Majoriteten röstade ja.' },

  // Kultur & musik
  'kommersialisering': { def: 'Att något blir mer inriktat på att tjäna pengar', ex: 'Kommersialiseringen av sporten har ökat.' },
  'ikonisk': { def: 'Så känd att det blivit en symbol', ex: 'Eiffeltornet är ikoniskt.' },
  'revolutionera': { def: 'Förändra helt och hållet', ex: 'Internet revolutionerade kommunikationen.' },
  'arv': { def: 'Det som lämnas efter till kommande generationer, till exempel pengar, egendom eller idéer', ex: 'Vi måste värna om vårt kulturarv. Förmögenheten gick i arv.' },
  'eftermäle': { def: 'Hur man minns någon efter deras tid', ex: 'Konstnärens eftermäle lever kvar.' },
  'koreografi': { def: 'Planerade danssteg och rörelser', ex: 'Dansgruppens koreografi var imponerande.' },
  'influens': { def: 'Påverkan från någon eller något', ex: 'Artistens influens syns i modern musik.' },
  'genre': { def: 'Typ eller kategori av konst', ex: 'Deckare är en populär genre.' },
  'estetik': { def: 'Läran om skönhet', ex: 'Filmens estetik var unik.' },
  'symbol': { def: 'Något som representerar något annat', ex: 'Duvan är en symbol för fred.' },
  'uttryck': { def: 'Ett ord eller en fras – eller ett sätt att visa känslor och idéer', ex: 'Uttrycket "gå på tomgång" betyder att inte komma någonstans.' },

  // Sport
  'disciplin': { def: 'Självkontroll och ordning', ex: 'Träning kräver disciplin.' },
  'mental': { def: 'Som har med tankar och sinne att göra', ex: 'Mental styrka är viktigt i sport.' },
  'rivalitet': { def: 'Tävling mellan motståndare', ex: 'Rivaliteten mellan lagen var intensiv.' },
  'pensionering': { def: 'Att sluta arbeta eller tävla', ex: 'Efter pensioneringen reste hon mycket.' },
  'mytisk': { def: 'Legendarisk, nästan som i en saga', ex: 'Spelarens status blev mytisk.' },
  'prestation': { def: 'Det man åstadkommer', ex: 'Det var en fantastisk prestation.' },
  'talang': { def: 'Naturlig förmåga', ex: 'Hon har talang för musik.' },
  'teknik': { def: 'Maskiner och verktyg som människor byggt – eller ett sätt att utföra något', ex: 'Ny teknik förändrar samhället. Hans simteknik var perfekt.' },
  'tävling': { def: 'När man försöker vara bäst', ex: 'Tävlingen avgjordes på mållinjen.' },
  'träning': { def: 'Övning för att bli bättre', ex: 'Daglig träning ger resultat.' },

  // Litteratur
  'protagonist': { def: 'Huvudpersonen i en berättelse', ex: 'Protagonisten kämpar mot ondska.' },
  'antagonist': { def: 'Motståndaren i en berättelse', ex: 'Antagonisten vill stoppa hjälten.' },
  'narrativ': { def: 'Berättelse eller berättande', ex: 'Filmens narrativ var gripande.' },
  'metafor': { def: 'Ett bildligt uttryck som jämför två saker', ex: '"Livet är en resa" är en metafor.' },
  'tema': { def: 'Huvudämnet eller budskapet i en text', ex: 'Bokens tema är vänskap.' },
  'karaktär': { def: 'En person i en berättelse', ex: 'Huvudkaraktären var modig.' },
  'handling': { def: 'Något man gör – eller det som händer i en berättelse', ex: 'Att plocka skräp är en liten handling med stor effekt.' },
  'dialog': { def: 'Samtal mellan personer', ex: 'Dialogen i pjäsen var rolig.' },
  'budskap': { def: 'Det författaren vill säga', ex: 'Bokens budskap är tydligt.' },
  'tolka': { def: 'Förstå betydelsen av något', ex: 'Man kan tolka dikten på olika sätt.' },

  // Historia
  'epok': { def: 'En tidsperiod med speciella kännetecken', ex: 'Medeltiden var en lång epok.' },
  'revolution': { def: 'En snabb och stor förändring', ex: 'Franska revolutionen förändrade Europa.' },
  'koloni': { def: 'Ett område som styrs av ett annat land', ex: 'Indien var en brittisk koloni.' },
  'imperium': { def: 'Ett stort rike med många områden', ex: 'Romarriket var ett mäktigt imperium.' },
  'civilisation': { def: 'Ett utvecklat samhälle med kultur och teknik', ex: 'Egyptens civilisation var avancerad.' },
  'arkeologi': { def: 'Studiet av gamla föremål och platser', ex: 'Arkeologin avslöjar historien.' },
  'källa': { def: 'Varifrån en uppgift kommer, till exempel en bok, en webbsida eller en person', ex: 'Kolla alltid vilken källa påståendet bygger på.' },
  'monument': { def: 'Byggnad eller staty till minne', ex: 'Monumentet hedrar soldaterna.' },
  'erövra': { def: 'Ta kontroll över med våld', ex: 'Romarna erövrade stora områden.' },
  'fred': { def: 'Motsatsen till krig', ex: 'Efter kriget kom äntligen fred.' },

  // Natur & miljö
  'ekosystem': { def: 'Alla levande varelser och deras miljö tillsammans', ex: 'Regnskogen är ett rikt ekosystem.' },
  'habitat': { def: 'Livsmiljön där en art lever', ex: 'Isbjörnens habitat smälter.' },
  'biodiversitet': { def: 'Mångfald av olika arter', ex: 'Biodiversitet är viktigt för naturen.' },
  'hållbar': { def: 'Som kan fortsätta utan att ta slut', ex: 'Vi behöver hållbar utveckling.' },
  'klimat': { def: 'Vädret i ett område över lång tid', ex: 'Klimatet blir varmare.' },
  'föroreningar': { def: 'Skadliga ämnen i naturen', ex: 'Föroreningar skadar haven.' },
  'återvinning': { def: 'Att använda material igen', ex: 'Återvinning minskar sopor.' },
  'utrotning': { def: 'När en art försvinner helt', ex: 'Många arter hotas av utrotning.' },
  'bevarande': { def: 'Att skydda och ta hand om', ex: 'Bevarande av regnskog är viktigt.' },
  'fossila': { def: 'Från döda organismer för länge sedan', ex: 'Fossila bränslen skapar koldioxid.' },

  // Känslor & relationer
  'empati': { def: 'Att förstå andras känslor', ex: 'Empati hjälper oss att vara snälla.' },
  'sympati': { def: 'Att känna medkänsla med någon', ex: 'Hon visade sympati för hans situation.' },
  'identitet': { def: 'Vem man är', ex: 'Tonåren handlar om att hitta sin identitet.' },
  'självförtroende': { def: 'Tro på sig själv', ex: 'Självförtroende byggs upp över tid.' },
  'respekt': { def: 'Att visa hänsyn och uppskattning', ex: 'Respekt är grunden för vänskap.' },
  'tolerans': { def: 'Att acceptera olikheter', ex: 'Tolerans gör samhället bättre.' },
  'kommunikation': { def: 'Utbyte av information', ex: 'God kommunikation löser problem.' },
  'relation': { def: 'Förhållande mellan människor', ex: 'De hade en nära relation.' },

  // Ord för de lägre årskurserna. Ordlistan bestod tidigare nästan bara av
  // akademiska ord, som förekommer först i gymnasietexterna – 64 av 66 texter
  // i åk 1 hade inte ett enda klickbart ord.
  'puls': { def: 'Hur snabbt hjärtat slår. Du kan känna den på handleden', ex: 'Efter löpningen var pulsen hög.' },
  'refräng': { def: 'Den del av en låt som kommer tillbaka flera gånger', ex: 'Alla sjöng med i refrängen.' },
  'material': { def: 'Det som en sak är gjord av, till exempel trä, plast eller tyg', ex: 'Vilket material är stolen gjord av?' },
  'nervös': { def: 'Orolig och pirrig inför något som ska hända', ex: 'Han var nervös före redovisningen.' },
  'viska': { def: 'Prata så tyst att bara den närmaste hör', ex: 'Hon viskade svaret i mitt öra.' },
  'spår': { def: 'Märken efter någon som gått förbi, till exempel fotavtryck i snön', ex: 'Vi följde djurets spår.' },
  'skolplikt': { def: 'Regeln som säger att alla barn måste gå i skolan', ex: 'I Sverige har vi skolplikt.' },
  'runsten': { def: 'En sten med gamla tecken inhuggna, rest för länge sedan', ex: 'Runstenen står kvar vid vägen.' },
  'återvinna': { def: 'Göra nya saker av gammalt material i stället för att slänga', ex: 'Glas går att återvinna många gånger.' },
  'sortera': { def: 'Lägga saker som hör ihop i samma hög', ex: 'Vi sorterar papper för sig och plast för sig.' },
  'mellanmål': { def: 'Något litet man äter mellan de stora målen', ex: 'Hon tog en frukt som mellanmål.' },
  'rastvakt': { def: 'En vuxen som håller koll på skolgården under rasten', ex: 'Rastvakten hjälpte till när det blev bråk.' },
  'uppvärmning': { def: 'Lätt rörelse som gör kroppen redo för träning', ex: 'Uppvärmningen tog några minuter.' },
  'muskler': { def: 'Delarna i kroppen som drar ihop sig så att du kan röra dig', ex: 'Musklerna blir varma när man springer.' },
  'syre': { def: 'En gas i luften som kroppen behöver för att leva', ex: 'Blodet transporterar syre till kroppens celler.' },
  'stack': { def: 'Myrornas bo, ofta en hög av barr och pinnar', ex: 'Myrorna hittade tillbaka till stacken.' },
  'recension': { def: 'En text där någon berättar vad hen tyckte om en bok eller film', ex: 'Hon skrev en recension om boken.' },
  'bibliotekarie': { def: 'Person som arbetar på ett bibliotek och hjälper till att hitta böcker', ex: 'Bibliotekarien tipsade om en deckare.' },
  'utgåva': { def: 'En version av en bok, till exempel en med större bokstäver', ex: 'Det finns en utgåva med stor stil.' },
  'sork': { def: 'Ett litet gnagande djur som liknar en mus', ex: 'Spåren kom kanske från en sork.' },
  'fabrik': { def: 'Ett stort hus där maskiner tillverkar saker', ex: 'Kakorna bakas i en fabrik.' },
  'takt': { def: 'Musikens jämna puls, den man klappar med i', ex: 'De räknade takten: ett, två, tre, fyra.' },
  'balans': { def: 'Att kunna hålla sig upprätt utan att ramla', ex: 'Hon tränade balans på en linje.' },
  'experiment': { def: 'Ett test man gör för att ta reda på något', ex: 'Klassen gjorde ett experiment med vatten.' },
  'skörd': { def: 'När man tar in det som vuxit på åkern eller i odlingen', ex: 'Utan bin blir skörden mycket mindre.' },
  'pollen': { def: 'Det gula pulvret i blommor som behövs för att nya frön ska bildas', ex: 'Bin flyttar pollen mellan blommor.' },
  'knut': { def: 'Ett hårt fäste på ett rep eller snöre', ex: 'Han fick inte upp knuten på hopprepet.' },
  'tyngdkraft': { def: 'Kraften som drar allt mot marken', ex: 'Tyngdkraften får äpplet att falla.' },
  'smälta': { def: 'Bli flytande av värme, som is som blir vatten', ex: 'Snön smälte i solen.' },
  'undersöka': { def: 'Titta noga på något för att ta reda på hur det är', ex: 'De undersökte vad som hände i glaset.' },
};
// Kolla om ett ord har en förklaring
export function hasExplanation(word: string): boolean {
  return !!WORD_DICTIONARY[word.toLowerCase()];
}

// Hämta förklaring för ett ord
export function getWordDefinition(word: string): WordDefinition | null {
  return WORD_DICTIONARY[word.toLowerCase()] || null;
}
