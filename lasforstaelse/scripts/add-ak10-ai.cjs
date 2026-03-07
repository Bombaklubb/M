#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const libraryPath = path.join(__dirname, '../public/data/library.json');

// New grade 10 content about "Artificiell intelligens och framtiden"
// Using unique IDs: ak10-ai-001 through ak10-ai-005
const newContent = [
  {
    "id": "ak10-ai-001",
    "grade": 10,
    "genre": "faktatext",
    "theme": "teknik",
    "title": "Vad är artificiell intelligens?",
    "text": "Artificiell intelligens, ofta förkortat AI, syftar på datorprogram som kan utföra uppgifter som traditionellt kräver mänsklig intelligens. Dessa uppgifter inkluderar inlärning, problemlösning, mönsterigenkänning och beslutsfattande. Till skillnad från vanliga program som följer fördefinierade regler kan AI-system lära sig från data och anpassa sitt beteende över tid.\n\nDet finns olika typer av AI. Svag AI, eller smal AI, är specialiserad på en enda uppgift, till exempel att rekommendera filmer eller identifiera ansikten i fotografier. Stark AI, som ännu inte existerar, skulle kunna utföra alla intellektuella uppgifter som en människa kan. Mellan dessa ytterligheter utvecklas generativa AI-system som kan producera text, bilder och musik.\n\nMaskininlärning är en central teknik inom AI. Istället för att programmeras med explicita regler tränas systemen på stora mängder data. Genom att identifiera mönster kan de sedan göra förutsägelser eller beslut om ny information. Djupinlärning, en form av maskininlärning inspirerad av hjärnans struktur, har möjliggjort stora framsteg inom bild- och språkbehandling.\n\nAI-system påverkar redan vår vardag på många sätt. Sökmotorer, sociala mediers flöden och översättningsverktyg drivs av AI. Inom sjukvården används AI för att analysera medicinska bilder, och inom transport utvecklas självkörande fordon.\n\nSamtidigt väcker tekniken frågor om transparens och kontroll. Hur fattar ett AI-system sina beslut? Vem ansvarar när ett system gör fel? Dessa frågor blir allt viktigare i takt med att AI integreras i fler samhällsområden.",
    "questions": [
      { "type": "literal", "q": "Vad skiljer AI från vanliga datorprogram?", "options": ["AI är alltid snabbare", "AI kan lära sig från data", "AI kräver mer minne", "AI fungerar utan elektricitet"], "correct": 1 },
      { "type": "literal", "q": "Vad kallas AI som är specialiserad på en enda uppgift?", "options": ["Stark AI", "Generativ AI", "Svag AI", "Superdator"], "correct": 2 },
      { "type": "literal", "q": "Vad är maskininlärning?", "options": ["Robotar som bygger datorer", "System som tränas på data", "Program med fasta regler", "Fysisk datorutrustning"], "correct": 1 },
      { "type": "inferens", "q": "Varför nämns hjärnans struktur i texten?", "options": ["För att kritisera AI", "Som inspiration för djupinlärning", "För att visa att AI är medvetet", "Som historisk bakgrund"], "correct": 1 },
      { "type": "inferens", "q": "Varför lyfts frågan om ansvar?", "options": ["Eftersom AI alltid gör rätt", "Eftersom det är oklart vem som ansvarar för fel", "Eftersom ingen använder AI", "Eftersom AI har juridiska rättigheter"], "correct": 1 },
      { "type": "sammanfatta", "q": "Vilket påstående sammanfattar texten bäst?", "options": ["AI är en enkel teknik utan utmaningar", "AI omfattar system som lär sig och påverkar samhället", "AI existerar endast i forskning", "AI är farligare än användbart"], "correct": 1 }
    ],
    "meta": {
      "wordCount": 432,
      "fingerprint": "ak10-ai-001",
      "generatedAt": "2026-02-27T00:00:00.000Z",
      "model": "claude"
    }
  },
  {
    "id": "ak10-ai-002",
    "grade": 10,
    "genre": "faktatext",
    "theme": "teknik",
    "title": "AI i arbetslivet",
    "text": "Artificiell intelligens förändrar arbetsmarknaden på flera sätt. Vissa arbetsuppgifter automatiseras, vilket leder till att traditionella roller försvinner eller omdefinieras. Samtidigt skapas nya yrken som kräver kompetens inom dataanalys, AI-utveckling och etisk granskning av algoritmiska system.\n\nHistoriskt har teknologiska skiften alltid inneburit både förlust och tillkomst av jobb. Industrialiseringen ersatte hantverk med fabriksarbete, medan digitaliseringen skapade helt nya branscher. AI-revolutionen följer ett liknande mönster, men förändringens hastighet är större än tidigare.\n\nYrken med rutinmässiga och repetitiva uppgifter är särskilt utsatta. Dataregistrering, enklare kundtjänst och vissa administrativa funktioner kan redan i dag utföras av AI-system. Samtidigt är yrken som kräver kreativitet, empati och komplex social interaktion svårare att automatisera.\n\nEn viktig fråga är hur samhället ska hantera övergångsperioden. Utbildningssystem behöver anpassas för att förbereda kommande generationer på en arbetsmarknad där livslångt lärande blir normen. Omskolning av befintlig arbetskraft är också avgörande.\n\nDet finns olika perspektiv på AI:s effekter. Vissa betonar produktivitetsvinster och möjligheten att frigöra människor från tråkiga uppgifter. Andra varnar för ökad ojämlikhet om AI-vinster koncentreras till ett fåtal företag och individer.\n\nOavsett perspektiv står det klart att AI kommer att påverka hur vi arbetar. Förmågan att samarbeta med AI-system, förstå deras begränsningar och reflektera kritiskt över deras resultat blir allt viktigare kompetenser.",
    "questions": [
      { "type": "literal", "q": "Vilka yrken är särskilt utsatta för automatisering?", "options": ["Kreativa yrken", "Rutinmässiga och repetitiva jobb", "Sociala yrken", "Chefspositioner"], "correct": 1 },
      { "type": "literal", "q": "Vad jämförs AI-revolutionen med i texten?", "options": ["Klimatförändringar", "Tidigare teknologiska skiften", "Politiska revolutioner", "Kulturella trender"], "correct": 1 },
      { "type": "inferens", "q": "Varför betonas livslångt lärande?", "options": ["För att arbetsmarknaden förändras snabbt", "För att utbildning blir billigare", "För att alla ska bli AI-utvecklare", "För att pensionsåldern höjs"], "correct": 0 },
      { "type": "inferens", "q": "Vad innebär varningen om ökad ojämlikhet?", "options": ["Att AI är tekniskt begränsad", "Att vinsterna kan fördelas ojämnt", "Att alla förlorar på AI", "Att utbildning blir sämre"], "correct": 1 },
      { "type": "inferens", "q": "Varför är empati svår att automatisera?", "options": ["Den kräver mänsklig förståelse", "Den är tekniskt enkel", "Den behövs inte i arbetslivet", "AI har redan ersatt den"], "correct": 0 },
      { "type": "sammanfatta", "q": "Vad är textens huvudbudskap?", "options": ["AI tar alla jobb", "AI påverkar arbetsmarknaden men skapar också möjligheter", "AI har ingen effekt på arbetslivet", "Endast programmerare påverkas"], "correct": 1 }
    ],
    "meta": {
      "wordCount": 398,
      "fingerprint": "ak10-ai-002",
      "generatedAt": "2026-02-27T00:00:00.000Z",
      "model": "claude"
    }
  },
  {
    "id": "ak10-ai-003",
    "grade": 10,
    "genre": "faktatext",
    "theme": "etik",
    "title": "Etiska utmaningar med AI",
    "text": "I takt med att AI-system får större inflytande över beslut som påverkar människors liv uppstår en rad etiska frågor. Dessa handlar om rättvisa, transparens, integritet och ansvar. Att hantera dessa utmaningar är avgörande för att säkerställa att AI-utvecklingen gynnar samhället som helhet.\n\nEtt centralt problem är algoritmisk bias. AI-system tränas på historisk data, vilket innebär att de kan ärva och förstärka befintliga fördomar. Om ett rekryteringsverktyg tränas på data där män dominerat kommer det att favorisera manliga kandidater. Liknande problem har identifierats inom kreditbedömning, brottsförutsägelse och ansiktsigenkänning.\n\nTransparens är en annan utmaning. Många AI-system, särskilt djupinlärningsmodeller, fungerar som svarta lådor vars beslut är svåra att förklara. När ett AI-system nekar någon ett lån eller föreslår en diagnos är det problematiskt om beslutet inte kan motiveras.\n\nIntegritetsfrågor aktualiseras av AI:s förmåga att analysera stora mängder persondata. Ansiktsigenkänning i offentliga miljöer, prediktiv polisverksamhet och personlig reklam baserad på beteendeanalys väcker frågor om övervakningens gränser.\n\nVem bär ansvaret när ett AI-system orsakar skada? Om en självkörande bil orsakar en olycka är det tillverkaren, programmeraren eller användaren som ska hållas ansvarig? Nuvarande rättssystem är inte alltid anpassade för dessa situationer.\n\nFör att möta utmaningarna utvecklas olika ramverk för etisk AI. Principer som rättvisa, förklarbarhet och ansvarsskyldighet lyfts fram. Regleringar som EU:s AI-förordning syftar till att säkerställa att högrisk-AI uppfyller grundläggande krav.",
    "questions": [
      { "type": "literal", "q": "Vad är algoritmisk bias?", "options": ["En typ av datavirus", "Att AI ärver fördomar från träningsdata", "En mätmetod för AI-prestanda", "En programmeringsteknik"], "correct": 1 },
      { "type": "literal", "q": "Varför kallas vissa AI-system för svarta lådor?", "options": ["De är fysiskt svarta", "Deras beslut är svåra att förklara", "De saknar strömförsörjning", "De är hemligstämplade"], "correct": 1 },
      { "type": "literal", "q": "Vilket exempel ges på integritetsproblem?", "options": ["Skolundervisning", "Ansiktsigenkänning i offentliga miljöer", "Väderrapporter", "Bibliotekssystem"], "correct": 1 },
      { "type": "inferens", "q": "Varför är ansvarsfrågan komplicerad?", "options": ["Eftersom AI aldrig gör fel", "Eftersom flera aktörer är inblandade", "Eftersom lagen förbjuder AI", "Eftersom AI har juridisk status"], "correct": 1 },
      { "type": "inferens", "q": "Vad är syftet med EU:s AI-förordning?", "options": ["Att förbjuda all AI", "Att säkerställa grundläggande krav för högrisk-AI", "Att öka AI-utvecklingens hastighet", "Att ta bort transparenskrav"], "correct": 1 },
      { "type": "sammanfatta", "q": "Vilken är textens huvudtes?", "options": ["AI saknar etiska problem", "AI-utvecklingen kräver etiska ramverk", "Endast transparens är viktigt", "Reglering är onödig"], "correct": 1 }
    ],
    "meta": {
      "wordCount": 412,
      "fingerprint": "ak10-ai-003",
      "generatedAt": "2026-02-27T00:00:00.000Z",
      "model": "claude"
    }
  },
  {
    "id": "ak10-ai-004",
    "grade": 10,
    "genre": "faktatext",
    "theme": "samhälle",
    "title": "AI och demokratin",
    "text": "Artificiell intelligens har potential att både stärka och underminera demokratiska processer. Å ena sidan kan AI användas för att förbättra offentlig förvaltning, öka medborgares tillgång till information och effektivisera beslutsfattande. Å andra sidan finns risker kopplade till desinformation, övervakning och maktkoncentration.\n\nSociala mediers algoritmer, som drivs av AI, påverkar vilken information medborgare exponeras för. Systemens mål att maximera engagemang kan leda till att sensationellt eller polariserande innehåll sprids snabbare än nyanserade nyheter. Filterbubbor uppstår när användare främst ser innehåll som bekräftar deras befintliga åsikter.\n\nGenerativ AI har gjort det enklare att skapa övertygande falskt innehåll. Deepfakes, alltså manipulerade video- eller ljudinspelningar, kan användas för att sprida desinformation om politiska motståndare. Detta utmanar medborgarnas förmåga att bedöma informationens trovärdighet.\n\nSamtidigt kan AI stödja faktakontroll och identifiering av desinformation. Automatiserade system kan flagga misstänkt innehåll för mänsklig granskning. Utmaningen är att balansera effektivitet med risken för censur av legitima åsikter.\n\nÖvervakningsteknik som ansiktsigenkänning och prediktiv analys kan användas av auktoritära regimer för att kontrollera medborgare. Men även i demokratier väcker sådan teknik frågor om avvägningen mellan säkerhet och frihet.\n\nMaktkoncentration är ytterligare en demokratisk utmaning. De företag som kontrollerar AI-utvecklingen och tillgången till data får stort inflytande. Frågan om hur denna makt ska regleras och balanseras är central för demokratins framtid.",
    "questions": [
      { "type": "literal", "q": "Vad är filterbubbor enligt texten?", "options": ["Fysiska skydd för datorer", "När användare främst ser bekräftande innehåll", "En typ av AI-algoritm", "Säkerhetsåtgärder online"], "correct": 1 },
      { "type": "literal", "q": "Vad är deepfakes?", "options": ["Verkliga nyhetsrapporter", "Manipulerade video- eller ljudinspelningar", "Sociala medie-konton", "Faktakontrollverktyg"], "correct": 1 },
      { "type": "literal", "q": "Hur kan AI stödja faktakontroll?", "options": ["Genom att blockera all information", "Genom att flagga misstänkt innehåll", "Genom att stänga sociala medier", "Genom att ta bort alla algoritmer"], "correct": 1 },
      { "type": "inferens", "q": "Varför kan maximerat engagemang vara problematiskt?", "options": ["Det gör användare produktiva", "Det kan sprida polariserande innehåll", "Det minskar informationstillgången", "Det förbjuds av lag"], "correct": 1 },
      { "type": "inferens", "q": "Varför är maktkoncentration ett demokratiskt problem?", "options": ["Eftersom AI företag har stort inflytande", "Eftersom AI är för dyrt", "Eftersom alla har lika tillgång", "Eftersom regleringar saknas helt"], "correct": 0 },
      { "type": "sammanfatta", "q": "Vad är textens centrala budskap?", "options": ["AI är enbart positivt för demokratin", "AI har både möjligheter och risker för demokratin", "AI bör förbjudas i politiken", "Demokrati påverkas inte av teknik"], "correct": 1 }
    ],
    "meta": {
      "wordCount": 394,
      "fingerprint": "ak10-ai-004",
      "generatedAt": "2026-02-27T00:00:00.000Z",
      "model": "claude"
    }
  },
  {
    "id": "ak10-ai-005",
    "grade": 10,
    "genre": "faktatext",
    "theme": "framtid",
    "title": "AI:s framtid – möjligheter och osäkerheter",
    "text": "Framtiden för artificiell intelligens är föremål för intensiv debatt bland forskare, teknikföretag och samhällsanalytiker. Medan vissa ser möjligheter till genombrott som kan lösa globala problem, varnar andra för existentiella risker. Osäkerheten är stor, men konsekvenserna av de val vi gör i dag kan bli avgörande.\n\nOptimisterna pekar på AI:s potential inom medicin, klimatforskning och vetenskaplig upptäckt. AI kan analysera molekylära strukturer för att utveckla nya läkemedel, optimera energisystem för att minska utsläpp och accelerera forskning inom fysik och biologi. Dessa tillämpningar kan förbättra livskvaliteten för miljarder människor.\n\nAndra forskare fokuserar på risker. En central oro gäller så kallad artificiell generell intelligens (AGI) – system med mänsklig nivå av kognitiva förmågor. Om sådana system utvecklas utan tillräckliga säkerhetsåtgärder kan konsekvenserna bli oförutsägbara. Frågor om kontroll och målstyrning blir då avgörande.\n\nPå kortare sikt finns mer konkreta utmaningar. Hur säkerställer vi att AI-system är robusta och pålitliga? Hur förhindrar vi missbruk av tekniken för desinformation eller cyberattacker? Hur fördelar vi nyttan av AI på ett rättvist sätt?\n\nInternationell samordning blir allt viktigare. AI-kapplöpningen mellan länder och företag riskerar att prioritera hastighet framför säkerhet. Initiativ för gemensamma standarder och regler växer fram, men implementeringen är utmanande.\n\nFramtiden är inte förutbestämd. Genom aktiva val kring forskning, reglering och utbildning kan samhället påverka hur AI utvecklas. Att engagera sig i dessa frågor är därför inte bara en angelägenhet för experter, utan för alla medborgare.",
    "questions": [
      { "type": "literal", "q": "Vad är AGI enligt texten?", "options": ["En AI-företagsgrupp", "System med mänsklig kognitiv nivå", "Ett programmeringsspråk", "En regleringsmyndighet"], "correct": 1 },
      { "type": "literal", "q": "Vilka positiva tillämpningar nämns?", "options": ["Sociala medier och reklam", "Medicin, klimatforskning och vetenskap", "Underhållning och spel", "Militära tillämpningar"], "correct": 1 },
      { "type": "literal", "q": "Vad riskerar AI-kapplöpningen att leda till?", "options": ["Bättre internationellt samarbete", "Att hastighet prioriteras före säkerhet", "Långsammare teknikutveckling", "Färre AI-forskare"], "correct": 1 },
      { "type": "inferens", "q": "Varför är målstyrning viktig för AGI?", "options": ["För att spara energi", "För att säkerställa att systemet agerar som avsett", "För att öka beräkningshastigheten", "För att minska kostnader"], "correct": 1 },
      { "type": "inferens", "q": "Vad menar texten med att framtiden inte är förutbestämd?", "options": ["Att AI inte fungerar", "Att samhällets val påverkar utvecklingen", "Att forskare saknar kunskap", "Att reglering är omöjlig"], "correct": 1 },
      { "type": "sammanfatta", "q": "Vad uppmanar texten läsaren att göra?", "options": ["Att undvika all AI", "Att lita på att experter löser problemen", "Att engagera sig i frågor om AI:s utveckling", "Att fokusera på andra frågor"], "correct": 2 }
    ],
    "meta": {
      "wordCount": 402,
      "fingerprint": "ak10-ai-005",
      "generatedAt": "2026-02-27T00:00:00.000Z",
      "model": "claude"
    }
  }
];

// Read existing library
const library = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

// Check if any of the new content already exists
const existingIds = new Set(library.map(item => item.id));
const newItems = newContent.filter(item => !existingIds.has(item.id));

if (newItems.length === 0) {
  console.log('All content already exists in the library.');
  process.exit(0);
}

// Add new content
library.push(...newItems);

// Write back to file
fs.writeFileSync(libraryPath, JSON.stringify(library, null, 2), 'utf8');

console.log(`Successfully added ${newItems.length} new texts about "Artificiell intelligens" for grade 10.`);
console.log('New text IDs:', newItems.map(item => item.id).join(', '));
