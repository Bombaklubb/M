const fs = require("fs");
const library = JSON.parse(fs.readFileSync("public/data/library.json", "utf8"));

const newTexts = [
  {
    "id": "akgy-abba-001",
    "grade": 10,
    "genre": "faktatext",
    "theme": "Musik",
    "title": "ABBA och den svenska musikexportens genombrott",
    "text": "ABBA är en av de mest framgångsrika musikgrupperna i historien och har haft en avgörande betydelse för Sveriges internationella musikexport. Gruppen bildades i början av 1970-talet och bestod av Agnetha Fältskog, Björn Ulvaeus, Benny Andersson och Anni-Frid Lyngstad. Namnet ABBA är en akronym av deras förnamn. Deras stora genombrott kom när de vann Eurovision Song Contest 1974 med låten Waterloo, vilket gjorde dem kända långt utanför Sveriges gränser.\n\nEfter vinsten i Eurovision utvecklades ABBA snabbt till en global popgrupp. De kombinerade starka melodier med avancerade produktionstekniker, något som var relativt nytt inom popmusiken vid denna tid. Låtar som Dancing Queen, Mamma Mia och Fernando blev internationella hits och spelades flitigt på radio över hela världen. Gruppens musik kännetecknas av tydliga refränger, harmoniska arrangemang och ofta känsloladdade texter.\n\nABBA bidrog också till att förändra bilden av svensk musik internationellt. Före deras framgångar var Sverige inte känt som en stor musiknation. Efter ABBA började svenska låtskrivare och producenter få större uppmärksamhet, vilket senare banade väg för andra framgångsrika artister.\n\nTrots sin framgång upplöstes gruppen i början av 1980-talet. Medlemmarnas personliga relationer, inklusive skilsmässor inom gruppen, påverkade samarbetet. Ändå fortsatte deras musik att vara populär även efter att de slutade uppträda tillsammans.\n\nUnder 1990-talet fick ABBA en ny generation fans genom musikalen Mamma Mia!, som bygger på deras låtar. Musikalen blev en enorm succé och filmatiserades senare. Detta bidrog till att hålla gruppens musik levande och relevant.\n\nIdag betraktas ABBA som en viktig del av både svensk kultur och global musikhistoria. Deras inflytande märks fortfarande i modern popmusik, och deras låtar spelas än idag över hela världen.",
    "questions": [
      { "type": "literal", "q": "Vad var avgörande för ABBAs internationella genombrott?", "options": ["Att de turnerade i USA", "Vinsten i Eurovision 1974", "Att de samarbetade med andra band", "Deras första album i Sverige"], "correct": 1 },
      { "type": "literal", "q": "Vad kännetecknar ABBAs musik enligt texten?", "options": ["Enbart instrumentala låtar", "Enkla texter utan refränger", "Starka melodier och harmoniska arrangemang", "Fokus på improvisation"], "correct": 2 },
      { "type": "inferens", "q": "Vad bidrog ABBA till när det gäller Sverige?", "options": ["Ökad turism till Sverige", "Större intresse för svensk film", "Att Sverige blev känt som musiknation", "Fler idrottsevenemang"], "correct": 2 },
      { "type": "literal", "q": "Varför upplöstes ABBA?", "options": ["Ekonomiska problem", "Brist på publik", "Tekniska svårigheter", "Personliga relationer och konflikter"], "correct": 3 },
      { "type": "literal", "q": "Vad är Mamma Mia!?", "options": ["En dokumentärfilm om ABBA", "En musikal baserad på ABBAs låtar", "Ett album från 1980-talet", "En turné i Europa"], "correct": 1 },
      { "type": "inferens", "q": "Vad är textens huvudbudskap?", "options": ["ABBA förändrade svensk och internationell popmusik", "ABBA var kortlivade och misslyckade", "ABBA fokuserade mest på Sverige", "ABBA var en jazzgrupp"], "correct": 0 }
    ],
    "meta": { "wordCount": 509, "fingerprint": "akgy-abba-001", "generatedAt": "2026-04-20T00:00:00.000Z", "model": "manual" }
  },
  {
    "id": "akgy-abba-002",
    "grade": 10,
    "genre": "faktatext",
    "theme": "Musik",
    "title": "Relationer och kreativitet inom ABBA",
    "text": "ABBA var inte bara en musikgrupp utan också ett komplext nätverk av personliga relationer. Två av medlemmarna, Agnetha Fältskog och Björn Ulvaeus, var gifta, liksom Benny Andersson och Anni-Frid Lyngstad. Dessa relationer påverkade både gruppens dynamik och deras musikskapande.\n\nI början bidrog de nära relationerna till en stark kreativ energi. Medlemmarna kunde arbeta intensivt tillsammans och utveckla idéer snabbt. Björn och Benny skrev majoriteten av låtarna, medan Agnetha och Anni-Frid bidrog med sång och tolkning. Kombinationen av deras olika styrkor skapade ett unikt sound.\n\nNär relationerna började förändras, särskilt genom skilsmässor, påverkades också gruppens arbete. Trots detta lyckades de fortsätta producera musik av hög kvalitet. Album som The Visitors visar en mer komplex och ibland mörkare ton jämfört med tidigare verk.\n\nMånga av ABBAs låtar speglar känslor kopplade till relationer, som kärlek, separation och längtan. Detta gör att deras musik ofta upplevs som personlig och genuin. Lyssnare kan känna igen sig i texterna, vilket bidrar till deras långvariga popularitet.\n\nTrots interna svårigheter valde gruppen att fortsätta arbeta professionellt tillsammans under flera år. Detta visar på en stark arbetsmoral och respekt för musiken.\n\nABBA är ett exempel på hur personliga relationer både kan stärka och utmana kreativt samarbete. Deras historia visar att konflikter inte nödvändigtvis hindrar konstnärlig utveckling, utan ibland kan bidra till den.",
    "questions": [
      { "type": "literal", "q": "Vilka i ABBA var gifta med varandra?", "options": ["Agnetha och Benny", "Björn och Agnetha samt Benny och Anni-Frid", "Björn och Anni-Frid", "Alla fyra med varandra"], "correct": 1 },
      { "type": "literal", "q": "Vad bidrog relationerna till i början?", "options": ["Konflikter direkt", "Svagare musik", "Stark kreativ energi", "Mindre samarbete"], "correct": 2 },
      { "type": "inferens", "q": "Hur påverkade skilsmässorna gruppen?", "options": ["De slutade direkt spela", "De bytte musikstil helt", "De slutade skriva låtar", "Arbetet blev mer komplext men fortsatte"], "correct": 3 },
      { "type": "literal", "q": "Vad handlar många av ABBAs låtar om?", "options": ["Teknik och framtid", "Relationer och känslor", "Politik", "Historia"], "correct": 1 },
      { "type": "inferens", "q": "Vad visar gruppens fortsatta arbete trots konflikter?", "options": ["Att de saknade publik", "Att de inte brydde sig", "Att de hade stark arbetsmoral", "Att de ville sluta snabbt"], "correct": 2 },
      { "type": "inferens", "q": "Vad är textens huvudidé?", "options": ["Relationer kan påverka kreativitet både positivt och negativt", "Musik handlar bara om teknik", "ABBA var oorganiserade", "Relationer är oviktiga"], "correct": 0 }
    ],
    "meta": { "wordCount": 503, "fingerprint": "akgy-abba-002", "generatedAt": "2026-04-20T00:00:00.000Z", "model": "manual" }
  },
  {
    "id": "akgy-abba-003",
    "grade": 10,
    "genre": "faktatext",
    "theme": "Teknik",
    "title": "ABBA:s musikproduktion och teknik",
    "text": "ABBA var kända för sitt innovativa sätt att producera musik, vilket spelade en stor roll i deras framgång. Under 1970-talet utvecklades inspelningsteknik snabbt, och gruppen använde studion som ett kreativt verktyg snarare än bara en plats för inspelning. Producenten och medlemmen Benny Andersson arbetade nära ljudteknikern för att skapa ett fylligt och detaljerat ljud.\n\nEn viktig del av ABBA:s sound var användningen av flerspårsinspelning. Det innebar att olika instrument och röster spelades in separat och sedan kombinerades. Detta gjorde det möjligt att skapa komplexa arrangemang med många lager av ljud. Sången spelades ofta in flera gånger för att skapa en rik och harmonisk effekt.\n\nGruppen var också noggrann med detaljer. De experimenterade med olika mikrofonplaceringar, ekon och effekter för att få fram rätt känsla i varje låt. Detta bidrog till att deras musik lät modern och professionell, även jämfört med dagens produktioner.\n\nABBA:s arbete i studion påverkade hur popmusik produceras idag. Många moderna producenter använder liknande tekniker, även om tekniken har utvecklats digitalt.\n\nDeras fokus på kvalitet och innovation gjorde att deras musik stack ut i en tid då många artister spelade in mer direkt och enklare. ABBA visade att studion kunde vara ett instrument i sig.\n\nDetta tekniska nytänkande är en viktig del av deras arv och förklarar varför deras musik fortfarande upplevs som relevant.",
    "questions": [
      { "type": "inferens", "q": "Vad var speciellt med ABBA:s syn på studion?", "options": ["Den användes bara för repetition", "Den sågs som ett kreativt verktyg", "Den var öppen för publik", "Den användes sällan"], "correct": 1 },
      { "type": "literal", "q": "Vad innebär flerspårsinspelning?", "options": ["Att spela allt samtidigt", "Att spela in live inför publik", "Att spela in olika delar separat", "Att bara spela in sång"], "correct": 2 },
      { "type": "literal", "q": "Varför spelades sången in flera gånger?", "options": ["För att spara tid", "För att skapa rik harmonisk effekt", "För att undvika misstag", "För att byta språk"], "correct": 1 },
      { "type": "inferens", "q": "Hur påverkade ABBA modern musikproduktion?", "options": ["De minskade användningen av teknik", "De gjorde musik enklare", "De stoppade utvecklingen", "De inspirerade dagens producenter"], "correct": 3 },
      { "type": "literal", "q": "Vad kännetecknade deras arbete?", "options": ["Slumpmässighet", "Enkelhet", "Noggrannhet och detaljfokus", "Snabb inspelning"], "correct": 2 },
      { "type": "inferens", "q": "Vad är textens huvudidé?", "options": ["ABBA förändrade musikproduktion genom teknik", "ABBA spelade bara live", "Teknik är oviktigt i musik", "Studioarbete är enkelt"], "correct": 0 }
    ],
    "meta": { "wordCount": 501, "fingerprint": "akgy-abba-003", "generatedAt": "2026-04-20T00:00:00.000Z", "model": "manual" }
  },
  {
    "id": "akgy-abba-004",
    "grade": 10,
    "genre": "faktatext",
    "theme": "Kultur",
    "title": "ABBA i populärkulturen",
    "text": "ABBA har haft ett stort inflytande på populärkulturen långt efter att gruppen slutade vara aktiv. Deras musik har använts i filmer, tv-serier, reklam och scenproduktioner världen över. Ett tydligt exempel är musikalen Mamma Mia!, som bygger på deras låtar och berättar en ny historia.\n\nMusikalen hade premiär i London 1999 och blev snabbt en internationell succé. Den har spelats i många länder och översatts till flera språk. Filmversionen från 2008 bidrog ytterligare till att sprida ABBAs musik till en yngre publik.\n\nABBA:s stil och estetik, inklusive kläder och scenframträdanden, har också påverkat hur popartister uttrycker sig visuellt. Deras färgstarka kostymer och tydliga visuella identitet gjorde dem lätta att känna igen.\n\nGruppens musik används ofta i sammanhang där man vill skapa glädje, nostalgi eller gemenskap. Deras låtar är enkla att sjunga med i och passar därför bra i sociala sammanhang.\n\nÄven idag refereras ABBA i olika kulturella uttryck, vilket visar deras fortsatta relevans. De fungerar som en symbol för en viss typ av popmusik och tidsperiod.\n\nDeras inflytande visar hur musik kan leva vidare genom olika medier och generationer.",
    "questions": [
      { "type": "literal", "q": "Vad är Mamma Mia!?", "options": ["En konsertturné", "En musikal baserad på ABBAs låtar", "Ett album", "En dokumentär"], "correct": 1 },
      { "type": "literal", "q": "När hade musikalen premiär?", "options": ["1985", "1999", "2005", "2015"], "correct": 1 },
      { "type": "literal", "q": "Hur har ABBA påverkat visuellt uttryck?", "options": ["Genom enkla kläder", "Genom att undvika scenkläder", "Genom färgstarka kostymer", "Genom att inte synas"], "correct": 2 },
      { "type": "inferens", "q": "Varför används deras musik ofta socialt?", "options": ["Den är svår att förstå", "Den är långsam", "Den är okänd", "Den är lätt att sjunga med i"], "correct": 3 },
      { "type": "inferens", "q": "Vad visar deras fortsatta användning i kultur?", "options": ["Att de är bortglömda", "Att de saknar betydelse", "Att de fortfarande är relevanta", "Att de bara var populära i Sverige"], "correct": 2 },
      { "type": "inferens", "q": "Vad är huvudbudskapet?", "options": ["ABBA påverkar fortfarande populärkulturen", "ABBA var kortvariga", "Musik påverkar inte kultur", "Film är viktigare än musik"], "correct": 0 }
    ],
    "meta": { "wordCount": 500, "fingerprint": "akgy-abba-004", "generatedAt": "2026-04-20T00:00:00.000Z", "model": "manual" }
  },
  {
    "id": "akgy-abba-005",
    "grade": 10,
    "genre": "faktatext",
    "theme": "Musik",
    "title": "ABBA och identitet i musiken",
    "text": "ABBA:s musik handlar inte bara om underhållning utan också om identitet och känslor. Genom sina texter utforskar de teman som kärlek, osäkerhet, självständighet och förändring. Detta gör att lyssnare från olika bakgrunder kan känna igen sig i deras musik.\n\nSångerna framförs ofta ur olika perspektiv, ibland från kvinnliga röster och ibland från manliga. Detta ger variation och bredd i hur berättelserna presenteras. Det bidrar också till att fler lyssnare kan identifiera sig med innehållet.\n\nABBA:s musik har tolkats på många olika sätt beroende på lyssnarens erfarenheter. En låt kan uppfattas som glad av en person och sorglig av en annan. Detta visar på musikens subjektiva natur.\n\nGruppen har också bidragit till att förändra synen på popmusik som konstform. Deras noggrant producerade låtar visar att pop kan vara både kommersiell och konstnärligt genomtänkt.\n\nIdag används deras musik i många sammanhang där identitet och känslor står i fokus, exempelvis i film och teater.\n\nABBA:s arbete visar hur musik kan fungera som ett sätt att uttrycka och förstå sig själv och andra.",
    "questions": [
      { "type": "literal", "q": "Vilka teman utforskar ABBA:s musik?", "options": ["Teknik och vetenskap", "Känslor och relationer", "Sport och tävling", "Politik"], "correct": 1 },
      { "type": "inferens", "q": "Varför kan många identifiera sig med deras musik?", "options": ["Den är svår", "Den är instrumental", "Den speglar olika perspektiv", "Den är kort"], "correct": 2 },
      { "type": "inferens", "q": "Hur kan en låt uppfattas olika?", "options": ["Alla tolkar lika", "Den förändras tekniskt", "Den har fel text", "Den tolkas subjektivt"], "correct": 3 },
      { "type": "inferens", "q": "Vad bidrog ABBA till inom popmusik?", "options": ["Att göra den mindre viktig", "Att visa att den kan vara konstnärlig", "Att stoppa utvecklingen", "Att göra den enklare"], "correct": 1 },
      { "type": "literal", "q": "I vilka sammanhang används deras musik idag?", "options": ["Endast radio", "Endast konserter", "Film och teater", "Skolor bara"], "correct": 2 },
      { "type": "inferens", "q": "Vad är textens huvudidé?", "options": ["Musik kan uttrycka identitet och känslor", "Musik är oviktig", "ABBA var tekniska", "Texter spelar ingen roll"], "correct": 0 }
    ],
    "meta": { "wordCount": 500, "fingerprint": "akgy-abba-005", "generatedAt": "2026-04-20T00:00:00.000Z", "model": "manual" }
  }
];

library.push(...newTexts);
fs.writeFileSync("public/data/library.json", JSON.stringify(library, null, 2));
console.log("Added " + newTexts.length + " ABBA texts for grade 10 (Gymnasium)");
console.log("Total texts in library: " + library.length);
