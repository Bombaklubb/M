// Lektionsguider per modul – arbetsgång enligt EPA-modellen (Enskilt → Par → Alla)
// Visas via 🎓-knappen på varje modulkort och i ResultSummary (uppdraget).

export interface LessonGuide {
  moduleId: number;
  before: string[];        // Startfrågor att ställa i klassen innan modulen
  during: string;          // Arbetssätt under spelandet
  pairMode: string;        // Så spelar man i par (turtagning, en enhet)
  after: string[];         // Samtalsfrågor för grupp/helklass efteråt
  groupActivity: string;   // Gemensam övning i klassrummet
  mission: {
    title: string;
    task: string;
    followUp: string;
  };
}

export const LESSON_GUIDES: Record<number, LessonGuide> = {
  7: {
    moduleId: 7,
    before: [
      'Vad betyder ordet "källa"? Ge exempel på källor ni använt idag.',
      'Hur vet man om något på nätet är sant? Hur gör ni själva?',
    ],
    during: 'Eleverna gör lär-delen och quizet enskilt. Samtalsfrågan efter varje svar diskuteras i par innan man går vidare.',
    pairMode: 'Två elever delar en enhet och turas om att svara varannan fråga. Den som inte svarar måste säga "håller med" eller "håller inte med" – och varför – innan svaret väljs.',
    after: [
      'Vilken av de fyra frågorna (äkthet, aktualitet, oberoende, tendens) är svårast att kolla? Varför?',
      'Ge exempel på en källa ni litar på – vilka av de fyra frågorna klarar den?',
    ],
    groupActivity: 'Skriv de fyra grundfrågorna på tavlan. Läraren visar en webbsida på storskärm och klassen bedömer den tillsammans, fråga för fråga.',
    mission: {
      title: 'Granska en egen källa',
      task: 'Välj en sajt eller ett konto du själv brukar använda. Ställ de fyra grundfrågorna (äkthet, aktualitet, oberoende, tendens) och skriv ner svaren.',
      followUp: 'Redovisa i par: Vilken fråga var svårast att besvara? Varför?',
    },
  },
  10: {
    moduleId: 10,
    before: [
      'Hur gör ni för att ta reda på om en sida går att lita på?',
      'Vad tror ni en professionell faktagranskare gör annorlunda än de flesta av oss?',
    ],
    during: 'Gör gärna lär-delen gemensamt på storskärm. Quizet görs sedan enskilt eller i par.',
    pairMode: 'Diskutera varje scenario i paret innan ni svarar. Kom överens – ni får bara ett svar.',
    after: [
      'Varför räcker det inte att läsa källans egen "Om oss"-sida?',
      'När kollade ni senast upp något i en ny flik? Vad hittade ni?',
    ],
    groupActivity: 'Läraren väljer en okänd webbplats. Halva klassen läser bara PÅ sidan, andra halvan söker i sidled i en ny flik. Efter 5 minuter: vilka vet mest om källans trovärdighet?',
    mission: {
      title: 'Sök i sidled på riktigt',
      task: 'Välj ett konto eller en sajt du följer. Sök i en ny flik på namnet + "kritik" eller "granskning". Vad säger andra om källan?',
      followUp: 'Berätta i grupp: Blev du förvånad över något du hittade?',
    },
  },
  11: {
    moduleId: 11,
    before: [
      'Varför tror ni att ni ser just det ni ser i era flöden?',
      'Ser alla i klassen samma sak när ni öppnar samma app? Varför/varför inte?',
    ],
    during: 'Gör gärna lär-delen gemensamt på storskärm. Quizet görs enskilt – samtalsfrågorna passar utmärkt i par.',
    pairMode: 'Jämför era flöden två och två innan ni börjar: öppna samma app och se hur olika det ser ut. Turas sedan om att svara varannan fråga.',
    after: [
      'Vad i era egna flöden känner ni igen från modulen?',
      'Är filterbubblor farliga – eller mest bekväma? När blir de ett problem?',
    ],
    groupActivity: 'Bubbeltestet: läraren väljer ett neutralt sökord. Alla söker samtidigt på samma ord i samma app och jämför resultaten. Diskutera skillnaderna – vad har algoritmen "lärt sig" om var och en?',
    mission: {
      title: 'Kartlägg din bubbla',
      task: 'Skriv ner de fem vanligaste typerna av innehåll i ditt flöde. Fundera: vad visas ALDRIG? Prova att aktivt söka på ett ämne du aldrig brukar titta på.',
      followUp: 'Berätta i grupp: Vad säger ditt flöde om dig? Ändrades flödet efter din nya sökning?',
    },
  },
  12: {
    moduleId: 12,
    before: [
      'Har du eller någon du känner fått ett misstänkt meddelande eller erbjudande? Vad hände?',
      'Varför tror ni att unga är en vanlig måltavla för bedragare?',
    ],
    during: 'Eleverna spelar enskilt eller i par. Betona att ingen ska skämmas – även vuxna experter blir lurade.',
    pairMode: 'Läs varje scenario högt tillsammans. Leta minst ett varningstecken var innan ni svarar.',
    after: [
      'Vilket av de tre tecknen (lockbetet, brådskan, avsändaren) tycker ni är lättast att missa?',
      'Vad skulle ni göra om en kompis blivit lurad? Hur hjälper man utan att skuldbelägga?',
    ],
    groupActivity: 'Bluffbygget: varje grupp designar en (påhittad!) bluff med alla tre knepen – lockbete, brådska och falsk avsändare. Grupperna presenterar och klassen pekar ut knepen. Att förstå hur bluffen byggs är bästa skyddet.',
    mission: {
      title: 'Veckans bluffspaning',
      task: 'Håll utkik efter en misstänkt annons, ett SMS eller DM under veckan (klicka INTE på länkar). Ta en skärmdump och notera vilka varningstecken du ser.',
      followUp: 'Visa i smågrupp: Vilka av de tre knepen använde bluffen? Hur nära var du att gå på den?',
    },
  },
  13: {
    moduleId: 13,
    before: [
      'Tror ni att alla konton ni möter på nätet är riktiga människor? Hur många är inte det, tror ni?',
      'Vad är ett "troll" på internet – och vad vill det?',
    ],
    during: 'Eleverna spelar enskilt. Modulen passar åk 7–9 och kan med fördel kopplas till SO-undervisning om demokrati och påverkan.',
    pairMode: 'Diskutera varje scenario innan ni svarar: vilka tecken ser ni? Kom överens om ett gemensamt svar.',
    after: [
      'Varför är "mata inte trollet" så svårt att följa i praktiken?',
      'Hur påverkas en demokrati om folk inte kan lita på att åsikter på nätet kommer från riktiga människor?',
    ],
    groupActivity: 'Kontogranskning på storskärm: läraren visar (avidentifierade) exempel på konton. Klassen bedömer tillsammans: människa, bot eller troll? Vilka tecken avgör?',
    mission: {
      title: 'Botjägaren',
      task: 'Nästa gång du ser en kommentar som känns konstig: klicka på profilen. Hur gammalt är kontot? Hur ofta postar det? Låter det som en människa? Skriv ner vad du hittar.',
      followUp: 'Redovisa i par: Hittade du något konto du misstänker inte är en människa? Vilka tecken såg du?',
    },
  },
  3: {
    moduleId: 3,
    before: [
      'Vem skulle ni lita mest på: en myndighet, en tidning eller en influencer? Varför?',
      'Vad är skillnaden mellan en "osäker" och en "opålitlig" källa?',
    ],
    during: 'Eleverna spelar enskilt. Samtalsfrågan efter varje källa diskuteras i par.',
    pairMode: 'Motivera ert trafikljusval högt för varandra INNAN ni trycker. Är ni oense – ta den försiktigare bedömningen.',
    after: [
      'Var ni oense om någon källa? Vilken och varför?',
      'Kan en trovärdig källa ha fel? Kan en opålitlig källa ha rätt? Ge exempel.',
    ],
    groupActivity: 'Trafikljus i klassrummet: läraren läser upp källor (från modulen eller egna) och eleverna visar grönt/gult/rött med handtecken. Några får motivera varje gång.',
    mission: {
      title: 'Trafikljusa ditt flöde',
      task: 'Välj tre konton eller sajter du följer. Ge varje ett trafikljus (grönt/gult/rött) med en kort motivering.',
      followUp: 'Jämför i par: Gav ni samma ljus till liknande källor?',
    },
  },
  8: {
    moduleId: 8,
    before: [
      'Följer ni någon influencer? Hur märker ni när de gör reklam?',
      'Varför tror ni att reklam måste märkas enligt lag?',
    ],
    during: 'Eleverna spelar enskilt eller i par. Uppmana dem att leta reklamtecken i varje inlägg innan de svarar.',
    pairMode: 'Turas om varannan fråga. Innan ni svarar: peka ut minst ett "reklamtecken" i inlägget tillsammans.',
    after: [
      'Är det fel av influencers att göra reklam – eller bara att dölja den?',
      'Har ni velat köpa något för att en influencer visat det? Hur tänker ni kring det nu?',
    ],
    groupActivity: 'Reklamspaning på storskärm: läraren visar riktiga (avidentifierade) inlägg och klassen röstar – reklam eller inte? Märkt eller dold?',
    mission: {
      title: 'Veckans reklamspaning',
      task: 'Hitta ett inlägg i ditt eget flöde som du misstänker är reklam. Är det märkt med #reklam eller "betalt samarbete"? Ta en skärmdump.',
      followUp: 'Visa i smågrupp: Hur avslöjade du reklamen? Var den lagligt märkt?',
    },
  },
  9: {
    moduleId: 9,
    before: [
      'Vad använder ni AI till idag – i skolan eller hemma?',
      'Var går gränsen mellan att få hjälp av AI och att fuska?',
    ],
    during: 'Eleverna spelar enskilt. Scenarierna passar utmärkt att pausa och diskutera: "Vad hade DU gjort?"',
    pairMode: 'Läs varje scenario högt tillsammans. Bestäm er var för sig först, visa sedan varandra – och diskutera om ni valde olika.',
    after: [
      'Vilket scenario var svårast att bedöma? Varför?',
      'Vilka AI-regler tycker ni att er klass borde ha? Kom överens om tre.',
    ],
    groupActivity: 'Skriv klassens AI-kontrakt: tre saker som är okej att göra med AI i skolarbete och tre som inte är det. Sätt upp i klassrummet.',
    mission: {
      title: 'Smart AI-användning',
      task: 'Använd AI för att FÖRSTÅ något du pluggar på – be den förklara ett begrepp. Kontrollera sedan förklaringen mot en annan källa (bok, NE, lärare).',
      followUp: 'Berätta: Stämde AI:ns förklaring? Vad lärde du dig av att dubbelkolla?',
    },
  },
  1: {
    moduleId: 1,
    before: [
      'Har ni någon gång misstänkt att en text var skriven av AI? Vad avslöjade den?',
      'Vad är AI bra på att skriva – och vad tror ni den är dålig på?',
    ],
    during: 'Eleverna spelar enskilt. Ledtrådarna efter varje svar är bra att stanna upp vid.',
    pairMode: 'Läs texten högt för varandra innan ni röstar. Lyssna: låter den som en människa?',
    after: [
      'Vilka ledtrådar var mest användbara för att avslöja AI?',
      'Spelar det någon roll om en text är AI-skriven om innehållet stämmer? När spelar det roll?',
    ],
    groupActivity: 'Lura klassen: varje par skriver två korta texter om samma ämne – en personlig och en "AI-aktig" (upprepningar, inga detaljer, perfekt men innehållslös). Klassen gissar vilken som är vilken.',
    mission: {
      title: 'AI-spanaren',
      task: 'Hitta en text i ditt flöde (kommentar, inlägg, recension) som du misstänker är AI-skriven. Skriv ner vilka ledtrådar du ser.',
      followUp: 'Motivera i par med ledtrådarna från modulen: repetitioner? Inga detaljer? För perfekt?',
    },
  },
  5: {
    moduleId: 5,
    before: [
      'Vad betyder det att en AI "hallucinerar"?',
      'Varför säger AI nästan aldrig "det vet jag inte"?',
    ],
    during: 'Eleverna spelar enskilt. Poängtera: AI:n LÅTER lika säker när den har fel som när den har rätt.',
    pairMode: 'Gissa svaret på frågan tillsammans INNAN ni läser AI:ns svar. Jämför sedan: hade ni eller AI:n rätt?',
    after: [
      'Vilket AI-svar lät mest övertygande fast det var fel?',
      'Vilka typer av frågor verkar AI oftare svara fel på? (Rekord? Datum? "Senaste"?)',
    ],
    groupActivity: 'Testa på riktigt: läraren ställer en fråga om er skola eller ort till en AI på storskärm. Klassen faktagranskar svaret tillsammans.',
    mission: {
      title: 'Hallucinationsjägaren',
      task: 'Ställ en fråga till en AI om något du kan mycket om (ditt lag, spel, husdjur, hobby). Läs svaret kritiskt – hittar du någon tveksam uppgift?',
      followUp: 'Berätta i grupp: Vad fick AI:n rätt och fel om DITT ämne?',
    },
  },
  2: {
    moduleId: 2,
    before: [
      'Kan något låta helt trovärdigt men ändå vara fel? Har ni exempel?',
      'Varför blandar AI ihop fakta, tror ni?',
    ],
    during: 'Eleverna spelar enskilt och använder ledtrådsknappen vid behov. Yngre elever kan spela i par direkt.',
    pairMode: 'Läs texten tillsammans, mening för mening. Diskutera varje markerat ord: "Låter det rimligt?" innan ni klickar.',
    after: [
      'Vilket fel var svårast att hitta? Varför?',
      'Hur skulle ni kolla en uppgift ni är osäkra på – konkret, steg för steg?',
    ],
    groupActivity: 'Klassens fellista: samla felen klassen hittat på tavlan. Sortera dem – vilka kunde man hitta med rimlighetstänk och vilka krävde att man slog upp?',
    mission: {
      title: 'Feljakten',
      task: 'Be en AI skriva en kort faktatext om er hemort eller skola. Granska texten: hitta minst ett fel ELLER bekräfta tre uppgifter mot en annan källa.',
      followUp: 'Visa i grupp: Vilka fel hittade ni? Var AI:n bättre eller sämre än ni trodde?',
    },
  },
  4: {
    moduleId: 4,
    before: [
      'Har ni sett en bild som visade sig vara AI-genererad? Hur avslöjades den?',
      'Varför kan fejkbilder vara farligare än fejktext?',
    ],
    during: 'Gör lär-delen (de 5 tecknen) noggrant – gärna på storskärm. Quizet görs sedan enskilt.',
    pairMode: 'Diskutera vid varje fråga: vilket av de 5 tecknen handlar det om? Kom överens innan ni svarar.',
    after: [
      'Vilket av de fem tecknen tror ni försvinner först när AI blir bättre?',
      'Vad gör man om man INTE kan avgöra om en bild är äkta?',
    ],
    groupActivity: 'Bildgranskning på storskärm: läraren visar en AI-bild och ett äkta foto. Klassen letar tecken tillsammans med checklistan från lär-delen.',
    mission: {
      title: 'Bilddetektiv hemma',
      task: 'Hitta en bild du misstänker är AI-genererad. Gå igenom de 5 tecknen: händer, text, ansikten, skuggor, bakgrund. Vilka ser du?',
      followUp: 'Visa bilden i smågrupp och låt de andra leta tecken innan du berättar vad du hittat.',
    },
  },
  6: {
    moduleId: 6,
    before: [
      'Vad delar folk vidare snabbast – tråkiga sanningar eller spännande lögner? Varför?',
    ],
    during: 'Modulen passar bäst i helklass: visa påståendet på storskärm, låt klassen rösta med handuppräckning INNAN svaret visas.',
    pairMode: 'Rösta samtidigt på tre – "sant" tumme upp, "fake" tumme ner. Oense? Diskutera 30 sekunder och rösta igen.',
    after: [
      'Vilket påstående lurade flest? Vad gjorde det trovärdigt?',
      'Hur känns det i kroppen när en rubrik är "för bra för att vara sann"?',
    ],
    groupActivity: 'Röstningsduell: dela klassen i två lag. Poäng per rätt svar – men laget måste motivera sitt svar för att få poängen.',
    mission: {
      title: 'Faktakollen',
      task: 'Hitta ett viralt påstående i ditt flöde och kolla det mot två oberoende källor. Sant eller fake?',
      followUp: 'Redovisa kort: Vilka källor använde du? Hur säker är du på svaret?',
    },
  },
};
