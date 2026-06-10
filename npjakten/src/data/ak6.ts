import type { ReadingTest, WritingTask } from "../types";

// ============================================================
// Delprov B1: läsa – berättande text
// Originaltext skriven för NP-jakten i samma stil och längd
// som de nationella provens berättande texter.
// ============================================================

export const lasaBerattande: ReadingTest = {
  id: "b1-bageriet",
  delprov: "Delprov B1: läsa – berättande text",
  textType: "berättande",
  title: "Nyckeln till bageriet",
  sections: [
    {
      paragraphs: [
        "Pappa visslar när vi svänger av från stora vägen. Han har visslat hela resan, samma glada melodi om och om igen, och jag slutade lyssna någonstans efter den andra bensinmacken. Vi har åkt i fyra timmar. Bakom oss, i släpet, skramlar allt vi äger.",
        "– Där! ropar pappa plötsligt och pekar. Ser du skylten?",
        "Jag ser den. STENVIKS BAGERI står det med flagnande guldbokstäver över ett smalt tvåvåningshus mitt i byn. Fönstren är förbommade med skivor och färgen släpper i stora sjok från väggarna. Det är det här pappa har drömt om. Det är för det här vi har lämnat stan, mina kompisar och vår lägenhet med utsikt över fotbollsplanen.",
        "– Visst är det fint? säger pappa.",
        "– Mmm, säger jag.",
        "Det är inte fint. Det är ett hus som har gett upp.",
        "Pappa har jobbat på ett stort industribageri i hela mitt liv. Varje kväll vid köksbordet har han pratat om samma sak: ett eget litet bageri, med en riktig stenugn, där bröden får ta den tid de behöver. När huset i Stenvik dök upp på nätet kostade det nästan ingenting. ”Ett sånt tillfälle kommer aldrig igen”, sa han, och två månader senare satt vi i bilen. Så fort går det när pappa väl har bestämt sig.",
      ],
    },
    {
      paragraphs: [
        "Vi bär in lådorna under kvällen. Jag får rummet på övervåningen, det med snett tak och fönster mot torget. Genom golvet känner jag en svag doft av något gammalt, mjöl kanske, eller sot. Pappa går runt där nere och klappar på den stora stenugnen som på en häst.",
        "– I morgon börjar vi skrubba, säger han. Och på lördag, Melker, då tänder vi ugnen.",
        "Han säger det som om han lovar mig något fint. Jag säger inget. Jag tänker på mitt gamla rum, där någon annan snart ska bo.",
      ],
    },
    {
      paragraphs: [
        "Nästa morgon väcker solen mig genom det gardinlösa fönstret. Där nere på torget ser jag en kiosk, en busshållplats och en hund som sover i skuggan. Byn ser ut att hålla andan. Ingen bil kör förbi, ingen människa syns. Hur ska man kunna bo på ett ställe där ingenting händer?",
        "Pappa är redan i full gång med hinkar och såpa, så jag går över torget för att köpa frukost. Kiosken är knappt större än vårt gamla badrum. Innanför disken sitter en gammal dam och stickar på något randigt.",
        "– Jaha, säger hon och tittar upp. Så du är bagarens pojke.",
        "Jag stannar mitt i steget. Vi kom i går kväll. Hur kan hon redan veta vem jag är?",
        "– Jag heter Margit, säger hon. Här vet vi sånt. Det är väl det enda vi har att göra, att hålla reda på varandra.",
        "Hon ler när hon säger det, men jag känner mig genomskinlig, som om hela byn redan har tittat färdigt på mig. Så är det inte i stan. Där kunde jag gå en hel dag utan att någon visste mitt namn.",
        "– Säg mig, fortsätter Margit, har er ugn tagit fart än?",
        "– Vi tänder den på lördag, svarar jag.",
        "– Jaså, minsann, säger hon långsamt. Ja, ja. Det har många försökt sedan Signes tid.",
        "Jag väntar på att hon ska förklara, men hon stickar bara vidare. Jag köper mjölk, en limpa och två äpplen, och när jag räknar upp pengarna på disken märker jag att hon iakttar mig över glasögonkanten, som om hon väger mig på en våg.",
      ],
    },
    {
      paragraphs: [
        "Utanför kiosken står en tjej och håller en sparkcykel i ena handen. Hon är ungefär lika gammal som jag, har hål i båda knäna på jeansen och tittar på mig utan att låtsas om något annat.",
        "– Hej, säger hon. Ni flyttade in i bageriet i går.",
        "– Det stämmer visst, säger jag. Det lät surare än jag hade tänkt mig.",
        "– Jag heter Tuva, säger hon utan att bry sig. Och du heter Melker. Margit berättade det för min mormor i morse.",
        "Jag måste skratta, fast jag egentligen inte vill. Tuva skrattar också, och det är som om något lossnar i bröstet på mig, en knut jag inte visste att jag hade.",
        "– Du vet väl om ugnen? säger hon sedan och sänker rösten.",
        "– Vadå vet?",
        "– Att den är ... egen. Signe, hon som hade bageriet förr, hon kunde få den att baka bröd som folk körde i timmar för att köpa. Men sen hon slutade har tre stycken försökt. Ingen av dem stannade ens ett år. De sa att ugnen inte ville.",
        "– Ugnar vill väl ingenting, säger jag.",
        "– Nej, säger Tuva och rycker på axlarna. Men det sägs att Signe gömde sin receptbok i huset innan hon flyttade. Den som hittar boken, den får ugnen att lyda. Hon hoppar upp på sparkcykeln. Du, vi ses! Jag måste hem med mjölken.",
        "Jag står kvar med min påse och tittar upp mot vårt smala hus. På lördag tänder vi ugnen. Och innan dess, tänker jag, ska jag ha letat igenom varenda golvbräda på övervåningen.",
      ],
    },
  ],
  byline: ["Text skriven för NP-jakten, 2026", "I samma stil som provens berättande texter."],
  questions: [
    {
      kind: "multiple-choice",
      id: 1,
      maxPoints: 1,
      prompt:
        "I början av texten tänker Melker att bageriet är ”ett hus som har gett upp”. Vad vill författaren gestalta med de orden?",
      options: [
        "Att huset snart ska rivas.",
        "Att huset är slitet och övergivet.",
        "Att huset är till salu.",
        "Att huset är byggt av sten.",
      ],
      correctIndex: 1,
    },
    {
      kind: "multiple-choice",
      id: 2,
      maxPoints: 1,
      prompt: "Vad är Melkers första intryck av flytten till Stenvik?",
      options: [
        "Han är lika glad som pappa över det nya livet.",
        "Han är mest nyfiken på den gamla stenugnen.",
        "Han saknar sitt gamla liv och tvivlar på det nya.",
        "Han är arg på pappa och vägrar hjälpa till.",
      ],
      correctIndex: 2,
    },
    {
      kind: "open",
      id: 3,
      maxPoints: 2,
      prompt:
        "Det fanns två anledningar till att pappa köpte just bageriet i Stenvik. Skriv de två anledningarna till att köpet blev av.",
      guidance:
        "Ge 1 poäng för varje korrekt anledning, max 2 poäng: 1) Pappa har länge drömt om ett eget litet bageri med en riktig stenugn. 2) Huset var mycket billigt (”kostade nästan ingenting”).",
      lines: 4,
    },
    {
      kind: "multiple-choice",
      id: 4,
      maxPoints: 1,
      prompt: "Författaren skriver att byn ”ser ut att hålla andan”. Vad gestaltar hon då?",
      options: [
        "Att luften i byn är dålig.",
        "Att byborna är rädda för något.",
        "Att det snart ska börja regna.",
        "Att byn är alldeles stilla och tyst.",
      ],
      correctIndex: 3,
    },
    {
      kind: "open",
      id: 5,
      maxPoints: 1,
      prompt:
        "I kiosken förstår Melker att livet i byn skiljer sig från livet i stan. Vad är det han upptäcker?",
      guidance:
        "Ge 1 poäng för svar som visar att alla i byn redan vet vem han är/att alla håller reda på varandra, till skillnad från i stan där han var anonym. Exempel på elevsvar: ”Margit vet redan vem han är fast de kom kvällen innan.”",
      lines: 3,
    },
    {
      kind: "multiple-choice",
      id: 6,
      maxPoints: 1,
      prompt:
        "När Melker svarar Tuva utanför kiosken finns meningen ”Det lät surare än jag hade tänkt mig.” I denna mening ...",
      options: [
        "... kommenterar Melker sitt eget sätt att svara.",
        "... beskriver Melker hur Tuva låter.",
        "... säger Melker rakt ut att han är arg.",
        "... funderar Melker på vad Margit ska tro.",
      ],
      correctIndex: 0,
    },
    {
      kind: "multiple-choice",
      id: 7,
      maxPoints: 1,
      prompt: "Vad är Margits inställning till att den nya familjen ska tända ugnen?",
      options: [
        "Hon är säker på att det kommer att gå bra för dem.",
        "Hon är tveksam, eftersom många har misslyckats sedan Signes tid.",
        "Hon blir arg, eftersom ugnen tillhör Signe.",
        "Hon är ointresserad och vill bara sälja sina varor.",
      ],
      correctIndex: 1,
    },
    {
      kind: "multiple-choice",
      id: 8,
      maxPoints: 1,
      prompt: "Hur kan Tuva veta vad Melker heter, trots att de aldrig har träffats?",
      options: [
        "Hon har läst om familjen i lokaltidningen.",
        "Hon såg flyttbilen och frågade pappa.",
        "Margit berättade det för hennes mormor.",
        "Det står på en skylt utanför bageriet.",
      ],
      correctIndex: 2,
    },
    {
      kind: "open",
      id: 9,
      maxPoints: 1,
      prompt:
        "När Melker och Tuva skrattar tillsammans händer något inom Melker. Beskriv med egna ord hur Melker förändras i det ögonblicket.",
      guidance:
        "Ge 1 poäng för svar som visar att Melker slappnar av/känner sig lättare/blir gladare – ”något lossnar i bröstet, en knut han inte visste att han hade”. Eleven ska beskriva förändringen med egna ord.",
      lines: 3,
    },
    {
      kind: "open",
      id: 10,
      maxPoints: 1,
      prompt:
        "I slutet av texten bestämmer sig Melker för att göra något innan lördagen. Vad ska han göra, och varför?",
      guidance:
        "Ge 1 poäng för svar som anger både vad och varför: Han ska leta igenom huset (varenda golvbräda) för att hitta Signes gömda receptbok, så att ugnen ska ”lyda” när de tänder den.",
      lines: 3,
    },
    {
      kind: "open",
      id: 11,
      maxPoints: 2,
      prompt:
        "Melker bryr sig om sin pappa, fast han själv är ledsen över flytten. Ge två exempel ur texten på något Melker gör eller låter bli att göra som visar att han tar hänsyn till pappa.",
      note: "Du måste skriva två exempel för att få full poäng på uppgiften.",
      guidance:
        "Ge 1 poäng per exempel, max 2 poäng. Möjliga exempel: Han säger ”Mmm” i stället för att säga vad han egentligen tycker om huset. / Han säger inget när pappa lovar att de ska tända ugnen, fast han tänker på sitt gamla rum. / Han hjälper till att bära in lådorna. / Han går och handlar frukost medan pappa städar.",
      lines: 5,
    },
  ],
};

// ============================================================
// Delprov B2: läsa – sakprosatext
// Originalartikel skriven för NP-jakten i samma stil som
// provens sakprosatexter (ingress, mellanrubriker, fotnot).
// ============================================================

export const lasaSakprosa: ReadingTest = {
  id: "b2-glasogon",
  delprov: "Delprov B2: läsa – sakprosatext",
  textType: "sakprosa",
  title: "Glasögonen – uppfinningen som fick världen att se klart",
  ingress:
    "Glasögon känns i dag så självklara att vi knappt tänker på dem som en uppfinning. Men i hundratals år var de en lyxvara som bara de allra rikaste hade råd med. Och vem som egentligen uppfann dem är fortfarande en gåta.",
  sections: [
    {
      paragraphs: [
        "Långt innan de första glasögonen sattes på en näsa använde människor andra knep för att se bättre. Redan för tusen år sedan slipade hantverkare så kallade läsestenar: halvklot av bergkristall eller glas som lades direkt på boksidan. Stenen förstorade bokstäverna, ungefär som ett förstoringsglas. Läsestenar har hittats på flera platser i Europa, bland annat på Gotland, och de var särskilt vanliga i kloster där munkar satt böjda över handskrivna böcker dag efter dag.",
      ],
    },
    {
      heading: "En uppfinnare utan namn",
      paragraphs: [
        "De första riktiga glasögonen – två slipade linser* i en båge som kunde sättas framför ögonen – dök upp i norra Italien i slutet av 1200-talet. Men vem som tillverkade det allra första paret går inte att säga. Flera personer har genom historien pekats ut som glasögonens uppfinnare, men ingen av berättelserna har kunnat bevisas. Klart är dock att glasögonen spreds snabbt mellan de italienska städerna, och att staden Venedig, känd för sina skickliga glasblåsare, tidigt började tillverka linser av hög kvalitet.",
        "De tidiga glasögonen såg inte ut som dagens. De saknade skalmar och fick i stället klämmas fast över näsroten eller hållas i ett skaft framför ögonen. Bekvämt var det knappast – men för den som höll på att förlora synen var de värda nästan vad som helst.",
      ],
    },
    {
      heading: "Dyrare än en ko",
      paragraphs: [
        "Under flera hundra år förblev glasögon en vara för de få. Varje lins slipades för hand av en mästare, vilket tog lång tid och krävde stor skicklighet. Det berättas att ett par glasögon på 1400-talet kunde kosta lika mycket som en mjölkko – en förmögenhet för en vanlig familj, som var helt beroende av kon för att få mat på bordet.",
        "Det som till slut gjorde glasögonen vanliga var en annan berömd uppfinning: boktryckarkonsten. När böcker plötsligt kunde tryckas i stora upplagor ville fler människor lära sig läsa, och den som ville läsa behövde se. Efterfrågan på glasögon växte explosionsartat, verkstäderna blev fler och priserna sjönk. Glasögonen och boken hjälpte på så sätt varandra ut i världen.",
      ],
    },
    {
      heading: "Från hjälpmedel till mode",
      paragraphs: [
        "Skalmarna, som gör att glasögonen sitter fast bakom öronen, kom förvånansvärt sent – först på 1700-talet. Då hade glasögon redan hunnit bli något mer än ett hjälpmedel. I vissa länder bars de som ett tecken på klokhet och hög ställning, och det förekom till och med att personer med perfekt syn bar glasögon utan slipning, bara för att se lärda ut.",
        "I dag bär mer än hälften av alla vuxna i Sverige glasögon eller linser. Den lilla uppfinningen från 1200-talets Italien har blivit så vanlig att vi ser rakt igenom den – i dubbel bemärkelse.",
      ],
    },
  ],
  byline: ["Text skriven för NP-jakten, 2026", "I samma stil som provens sakprosatexter."],
  footnote:
    "* En lins är en genomskinlig, slipad skiva av glas eller plast som bryter ljuset så att det man tittar på ser större, mindre eller skarpare ut.",
  questions: [
    {
      kind: "multiple-choice",
      id: 1,
      maxPoints: 1,
      prompt:
        "I texten jämförs priset på ett par glasögon med priset på en mjölkko. Vad visar artikelförfattaren med hjälp av den jämförelsen?",
      options: [
        "Att bönder hade större behov av glasögon än andra.",
        "Att glasögon var så dyra att vanliga familjer inte hade råd med dem.",
        "Att kor var ovanligt billiga på 1400-talet.",
        "Att glasögonmästarna ofta fick betalt i djur.",
      ],
      correctIndex: 1,
    },
    {
      kind: "open",
      id: 2,
      maxPoints: 1,
      prompt:
        "Vad använde människor för att se bättre när de läste, innan glasögonen var uppfunna?",
      guidance:
        "Ge 1 poäng för svar som nämner läsestenar (halvklot av bergkristall eller glas som lades på boksidan och förstorade bokstäverna).",
      lines: 2,
    },
    {
      kind: "multiple-choice",
      id: 3,
      maxPoints: 1,
      prompt: "Vem uppfann glasögonen, enligt texten?",
      options: [
        "Det är inte känt vem det var.",
        "En munk på Gotland.",
        "En glasblåsare i Venedig.",
        "En italiensk mästare på 1400-talet.",
      ],
      correctIndex: 0,
    },
    {
      kind: "open",
      id: 4,
      maxPoints: 1,
      prompt: "Varför var glasögon så dyra under de första århundradena?",
      guidance:
        "Ge 1 poäng för svar som anger att varje lins slipades för hand av en mästare, vilket tog lång tid och krävde stor skicklighet.",
      lines: 3,
    },
    {
      kind: "open",
      id: 5,
      maxPoints: 1,
      prompt:
        "Vi tänker oss att två elever, Idris och Stella, har läst artikeln och samtalar om den. Idris säger: ”Det var boktryckarkonsten som gjorde glasögonen vanliga. Det låter konstigt – böcker och glasögon har ju inget med varandra att göra.” Stella svarar: ”Jo, det har de visst!” Vad kan Stella säga till Idris för att förklara sambandet mellan boktryckarkonsten och glasögonen?",
      guidance:
        "Ge 1 poäng för svar som förklarar sambandet: När böcker kunde tryckas i stora upplagor ville fler lära sig läsa, och den som ville läsa behövde se bra. Då ville fler ha glasögon, verkstäderna blev fler och priserna sjönk.",
      lines: 4,
    },
    {
      kind: "multiple-choice",
      id: 6,
      maxPoints: 1,
      prompt: "På vilket sätt skilde sig de tidiga glasögonen från dagens glasögon?",
      options: [
        "De hade bara en lins i stället för två.",
        "De var gjorda av bergkristall i stället för glas.",
        "De saknade skalmar och fick klämmas fast eller hållas i ett skaft.",
        "De kunde bara användas av munkar i kloster.",
      ],
      correctIndex: 2,
    },
    {
      kind: "open",
      id: 7,
      maxPoints: 1,
      prompt:
        "I texten står det att glasögon på 1700-talet ibland bars av personer som såg perfekt. Varför gjorde de det?",
      guidance:
        "Ge 1 poäng för svar som anger att glasögon hade blivit ett tecken på klokhet och hög ställning – man bar dem för att se lärd/klok ut.",
      lines: 2,
    },
    {
      kind: "multiple-choice",
      id: 8,
      maxPoints: 1,
      prompt:
        "Läs stycket som börjar med ”Långt innan de första glasögonen”. Det är artikelns första stycke efter ingressen. Vilket alternativ stämmer in på detta stycke?",
      options: [
        "Stycket sammanfattar hela textens innehåll.",
        "Stycket ger en bakgrund till textens innehåll.",
        "Stycket förklarar hur glasögon tillverkas i dag.",
        "Stycket beskriver glasögonens väg från Italien till Sverige.",
      ],
      correctIndex: 1,
    },
  ],
};

// ============================================================
// Delprov C1: skriva – berättande text
// ============================================================

export const skrivaBerattelse: WritingTask = {
  id: "c1-dorren",
  delprov: "Delprov C1: skriva – berättande text",
  textType: "berättelse",
  title: "Dörren som ingen öppnat",
  intro: [
    "I många hus finns det dörrar som ingen öppnar. Det kan vara en dörr till en vind, en källare eller ett rum som alltid är låst. Att stå framför en sådan dörr kan kännas både spännande och lite kusligt – tänk om det finns något där bakom som ingen vet om?",
    "Du ska skriva en berättelse om någon som öppnar en dörr som ingen öppnat på mycket länge. Berättelsen kan handla om något en påhittad person upplevt eller något du själv upplevt.",
    "Din berättelse tänker du skicka till en ungdomstidning som vill fylla ett helt nummer med spännande berättelser skrivna av unga.",
  ],
  doThis: [
    "Skriv en berättelse om någon som öppnar en dörr som ingen öppnat på länge. Var finns dörren och varför har ingen öppnat den? Vad får huvudpersonen att öppna den just nu? Vad händer när dörren öppnas? Hur slutar det?",
  ],
  fixedHeading: "Dörren som ingen öppnat",
  remember: [
    "Du ska skriva en berättelse.",
    "Du ska följa instruktionerna under ”Gör det här!”",
    "Tänk på att din berättelse ska ha en genomtänkt inledning, handling och avslutning.",
    "Tänk på att planera din berättelse innan du börjar skriva. Läs igenom berättelsen innan du lämnar in den.",
  ],
  checklist: [
    "Min berättelse har den givna rubriken.",
    "Min berättelse har en inledning som väcker intresse.",
    "Det händer något i berättelsen – huvudpersonen stöter på ett problem eller en överraskning.",
    "Jag beskriver hur huvudpersonen känner och upplever det som händer.",
    "Min berättelse har en genomtänkt avslutning.",
    "Jag har delat in texten i stycken.",
    "Jag har läst igenom texten och rättat stavning och skiljetecken.",
  ],
};

// ============================================================
// Delprov C2: skriva – argumenterande text
// ============================================================

export const skrivaArgumenterande: WritingTask = {
  id: "c2-lyssna",
  delprov: "Delprov C2: skriva – argumenterande text",
  textType: "argumenterande",
  title: "Lyssna på oss unga!",
  intro: [
    "Vuxna bestämmer det mesta – i skolan, hemma och i samhället. Men unga har också åsikter om hur saker borde vara. Ett sätt att göra sin röst hörd är att skriva en argumenterande text.",
    "Du ska skriva en argumenterande text om något du tycker borde bli bättre för barn och unga, och motivera varför du tycker det. Din text kan handla om något du har egen erfarenhet av eller om något du lärt dig från till exempel skolan, böcker, tv eller internet.",
    "Din argumenterande text tänker du skicka till webbplatsen Din röst. De söker just nu efter texter där unga skriver om sådant de vill ska bli bättre. Texterna kommer att publiceras på webbplatsen.",
  ],
  doThis: [
    "Skriv en argumenterande text om något du tycker borde bli bättre för barn och unga. Bestäm ett ämne för din text. Beskriv vad du tycker borde bli bättre. Motivera varför det är viktigt. Vad kommer att bli bättre om din idé genomförs? Ge gärna exempel från sådant du upplevt eller hört talas om.",
    "Rubrik: Skriv en rubrik som passar till innehållet i din text.",
  ],
  topicExamples: [
    "Längre raster i skolan",
    "Bättre och godare skolmat",
    "En fritidsgård på din ort",
    "Säkrare cykelvägar till skolan",
    "Billigare busskort för unga",
    "Mer tid för idrott och rörelse",
  ],
  remember: [
    "Du ska skriva en argumenterande text.",
    "Du ska följa instruktionerna under ”Gör det här!”",
    "Tänk på att din åsikt ska vara tydlig och att du ska motivera din åsikt. Tänk också på att inleda och avsluta din text på ett genomtänkt sätt.",
    "Tänk på att planera din text innan du börjar skriva. Läs igenom texten innan du lämnar in den.",
  ],
  checklist: [
    "Min text har en rubrik som passar innehållet.",
    "Min åsikt är tydlig redan i början av texten.",
    "Jag motiverar min åsikt med minst två argument.",
    "Jag ger exempel som stärker mina argument.",
    "Jag beskriver vad som blir bättre om min idé genomförs.",
    "Min text har en genomtänkt inledning och avslutning.",
    "Jag har delat in texten i stycken.",
    "Jag har läst igenom texten och rättat stavning och skiljetecken.",
  ],
};
