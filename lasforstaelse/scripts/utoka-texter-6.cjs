#!/usr/bin/env node
//
// Sats 6: fem texter i intervallet 154–158 ord, med omskrivna frågor.

const fs = require('fs');
const path = require('path');

const NYA = {

// ── åk 7, 154 → ~515 ord ────────────────────────────────────────────────
'ak7-tema-030': {
  text: `Hälsa handlar inte bara om kroppen utan också om hur vi mår mentalt. För att må bra i vardagen är det viktigt att hitta balans mellan skola, vila och fritid. Många ungdomar upplever stress från skola, sociala medier och krav från omgivningen.

Stress i sig är inte farligt. Kroppen reagerar på en utmaning genom att göra sig redo: pulsen ökar, uppmärksamheten skärps och energin riktas mot det som ska klaras av. Det är en användbar reaktion inför ett prov eller en match. Problemet uppstår när stressen aldrig släpper och det inte finns någon återhämtning mellan topparna. Då börjar samma reaktion som var hjälpsam att slita på kroppen i stället.

Fysisk aktivitet är en viktig del av hälsa. Att röra på sig regelbundet kan förbättra både kropp och sinne. Det behöver inte vara avancerad träning, utan kan vara promenader, cykling eller att spela sport. Forskningen är tydlig med att effekten på humöret kommer snabbt, ofta redan samma dag, medan effekterna på konditionen tar veckor. Den som rör sig för att må bättre behöver alltså inte vänta länge på ett resultat.

Sömn är också avgörande. Utan tillräcklig sömn blir det svårare att koncentrera sig och hantera känslor. Under sömnen bearbetas dessutom det man lärt sig under dagen, vilket gör att en natts sömn ibland är mer värd än en timmes extra plugg. Ungdomar behöver mer sömn än vuxna, samtidigt som kroppens dygnsrytm skjuts framåt i tonåren så att det blir svårare att somna tidigt. Det är en av anledningarna till att morgnarna upplevs som tyngre just under de åren.

Maten spelar roll, men på ett mindre dramatiskt sätt än många budskap på nätet påstår. Regelbundna måltider håller blodsockret jämnare, och den som hoppar över frukost märker det ofta på koncentrationen framåt förmiddagen. Enskilda livsmedel avgör sällan hur någon mår. Det är helheten över tid som betyder något.

Sociala relationer spelar en stor roll för hur vi mår. Att ha någon att prata med och känna stöd från vänner eller familj är viktigt. Samtidigt behöver man ibland tid för sig själv. Ensamhet och att vara ensam är inte samma sak: den som trivs med egen tid mår inte sämre för det, medan den som saknar någon att vända sig till gör det.

Det man ser i sitt flöde påverkar också bilden av hur andra har det. Ett flöde visar sällan tråkiga eftermiddagar eller dåliga dagar, och den som jämför sin egen vardag med andras höjdpunkter kommer alltid att förlora jämförelsen.

Det är också värt att skilja på underhållning och återhämtning. Att skrolla en timme kan kännas som vila utan att kroppen faktiskt varvar ner. Riktig återhämtning är ofta tråkigare: en promenad, en stund utan skärm, en natts ordentlig sömn.

Ibland räcker inte egna rutiner. Om nedstämdhet eller oro håller i sig i veckor och påverkar både skolan och kompisarna är det ett skäl att prata med en vuxen, skolsköterskan eller elevhälsan. Att söka hjälp är inte ett tecken på svaghet utan på att man tar sig själv på allvar.

Genom att ta hand om både kropp och sinne kan man skapa en hållbar livsstil som främjar välmående.`,
  questions: [
    { type: 'inferens', q: 'Varför beskriver texten stress som ofarlig i sig?',
      options: ['För att kroppens reaktion hjälper en att klara en utmaning', 'För att stress bara drabbar den som redan mår dåligt', 'För att reaktionen alltid försvinner av sig själv efter en stund', 'För att ungdomar påverkas mindre av stress än vuxna gör'], correct: 0 },
    { type: 'literal', q: 'Vad säger texten om hur snabbt träning påverkar humöret?',
      options: ['Effekten kommer först efter några veckors träning', 'Effekten märks ofta redan samma dag som man rör sig', 'Effekten uppstår bara vid hård och avancerad träning', 'Effekten beror helt på hur mycket man har sovit'], correct: 1 },
    { type: 'inferens', q: 'Varför blir morgnarna tyngre under tonåren?',
      options: ['För att skoldagarna blir längre ju äldre man blir', 'För att träning på kvällarna stör den djupa sömnen', 'För att dygnsrytmen skjuts framåt medan sömnbehovet är stort', 'För att sömnbehovet minskar snabbare än vanorna hinner ändras'], correct: 2 },
    { type: 'ord', q: 'Vad menas med att "helheten över tid" är det som betyder något?',
      options: ['Att man bör äta ungefär samma sak varje dag', 'Att kosttillskott kan ersätta vanliga måltider', 'Att maten spelar mindre roll än vad sömnen gör', 'Att vanorna sammantaget väger tyngre än enstaka val'], correct: 3 },
    { type: 'literal', q: 'Vilken skillnad gör texten mellan ensamhet och att vara ensam?',
      options: ['Att ensamhet framför allt drabbar de yngsta eleverna', 'Att den som trivs med egen tid inte mår sämre av den', 'Att den som är ensam alltid blir nedstämd till slut', 'Att skillnaden handlar om hur många vänner man har'], correct: 1 },
    { type: 'sammanfatta', q: 'Vilken hållning har texten till hälsoråd?',
      options: ['Att råden är verkningslösa om man inte följer dem alla', 'Att kosten är den enskilt viktigaste faktorn för måendet', 'Att flera vanor samverkar och att hjälp finns när de inte räcker', 'Att unga sällan behöver fundera över sin egen hälsa'], correct: 2 },
  ],
},

// ── åk 9, 155 → ~580 ord ────────────────────────────────────────────────
'ak10-obama-004': {
  text: `Barack Obama är känd för sin förmåga att tala inför publik. Hans tal har ofta beskrivits som inspirerande och välformulerade. Retorik, alltså konsten att övertyga genom tal, var en viktig del av hans ledarskap.

Genombrottet kom 2004, flera år innan han var presidentkandidat. I ett tal på Demokraternas partikonvent beskrev han sin egen bakgrund som son till en far från Kenya och en mor från Kansas, och band ihop den med bilden av ett land som inte borde delas upp i röda och blå delstater. Talet var kort, men det gjorde honom på en enda kväll till ett namn långt utanför Illinois.

Han använde ofta berättelser och personliga exempel för att nå fram till människor. Genom att knyta an till gemensamma värderingar kunde han skapa engagemang. Retorikläran brukar tala om tre sätt att övertyga: genom talarens trovärdighet, genom känslor och genom sakskäl. Obama arbetade sällan med bara det ena. Ett resonemang om sjukvårdsreformen kunde börja i en enskild familjs räkningar och därifrån röra sig ut mot siffror och principer.

Ett annat grepp var upprepningen. Genom att inleda flera meningar med samma ord byggde han en rytm som gjorde budskapet lätt att minnas och att stämma in i. Frasen "Yes we can" fungerade just så: den var kort nog att ropas av en publik och öppen nog att rymma många olika förhoppningar.

Också framförandet hörde till hantverket. Han talade långsammare än de flesta politiker och lät pauserna stå kvar, vilket gav publiken tid att uppfatta varje mening och gjorde att applåderna hann komma. Talen skrevs dessutom av ett team, ofta med Jon Favreau som huvudförfattare, vilket är vanligt men sällan syns för lyssnaren.

Ett återkommande drag var att han placerade en enskild händelse i ett längre historiskt sammanhang. I talet vid minnesmarschen i Selma 2015 knöt han demonstranternas väg över bron till en berättelse om ett land som gradvis tvingats vidga sitt löfte om frihet.

Obamas tal innehöll också tydliga budskap om hopp, förändring och ansvar. Han betonade vikten av att människor tillsammans kan påverka samhället. I tal om rasfrågor valde han ofta att beskriva olika gruppers erfarenheter som begripliga var för sig, i stället för att peka ut en part som skyldig. Kritiker på båda sidor tyckte att det var undvikande, medan andra menade att det var det enda sättet att bli lyssnad på av fler än de redan övertygade.

Samtidigt har hans retorik kritiserats av vissa som menar att ord inte alltid följdes av handling. Han lovade att stänga fånglägret i Guantánamo, vilket aldrig genomfördes. Under hans tid utvidgades användningen av drönare, och antalet utvisningar var högt. Avståndet mellan talens tonläge och besluten i vardagen blev för många det som satte sig kvar.

Detta visar att ledarskap inte bara handlar om att tala, utan också om att genomföra beslut. En president är dessutom bunden av en kongress som kan säga nej, vilket gör att ett brutet löfte inte alltid är detsamma som en ovilja att hålla det.

Retorik spelar en viktig roll i politik eftersom den påverkar hur människor uppfattar budskap. En stark talare kan mobilisera stöd och skapa förtroende. Samma verktyg fungerar dock oavsett vad de används till: en välbyggd mening övertygar lika effektivt när innehållet är falskt. Att kunna se hur ett tal är konstruerat är därför inte bara en fråga om att beundra hantverket, utan ett sätt att kunna värdera det som faktiskt sägs.

Obamas sätt att kommunicera har studerats av både forskare och politiker, och hans tal används ofta som exempel på effektiv retorik.`,
  questions: [
    { type: 'literal', q: 'Vad gjorde talet 2004 betydelsefullt?',
      options: ['Det ledde direkt till att han valdes till president', 'Det gjorde honom känd långt utanför delstaten Illinois', 'Det var första gången han talade om sjukvårdsreformen', 'Det hölls kort efter att han vunnit sitt första val'], correct: 1 },
    { type: 'inferens', q: 'Varför kunde ett resonemang om sjukvården börja i en enskild familj?',
      options: ['För att undvika siffror som publiken inte skulle förstå', 'För att sjukvårdsfrågan saknade principiella sidor', 'För att förena känslor och sakskäl i samma argument', 'För att korta ned talen inför de direktsända sändningarna'], correct: 2 },
    { type: 'ord', q: 'Vad menas med att "upprepningen" var ett grepp i hans tal?',
      options: ['Att samma tal hölls om och om igen på flera orter', 'Att publiken fick öva in vissa fraser i förväg', 'Att budskapet förenklades till en enda kort mening', 'Att flera meningar inleds med samma ord och bygger en rytm'], correct: 3 },
    { type: 'literal', q: 'Vilket löfte nämns som aldrig genomfördes?',
      options: ['Att stänga fånglägret i Guantánamo', 'Att helt avveckla användningen av drönare', 'Att kraftigt minska antalet utvisningar', 'Att införa en helt statligt driven sjukvård'], correct: 0 },
    { type: 'inferens', q: 'Varför nämner texten att en president är bunden av kongressen?',
      options: ['För att förklara varför tal blivit viktigare än beslut', 'För att visa att ett brutet löfte inte alltid beror på ovilja', 'För att peka ut kongressen som ansvarig för all kritik', 'För att jämföra amerikansk politik med den svenska'], correct: 1 },
    { type: 'forfattarens-syfte', q: 'Varför påpekar texten att retoriska verktyg fungerar oavsett innehåll?',
      options: ['För att avråda läsaren från att studera retorik', 'För att visa att Obamas tal var mindre unika än de framstår', 'För att motivera varför man bör granska hur ett tal är byggt', 'För att förklara varför politiker sällan blir trodda i dag'], correct: 2 },
  ],
},

// ── åk 10, 156 → ~605 ord ───────────────────────────────────────────────
'akgy-mj-005': {
  text: `Michael Jacksons påverkan på musik och kultur är fortfarande tydlig långt efter hans död 2009. Många moderna artister hänvisar till honom som en viktig inspirationskälla, både musikaliskt och visuellt. Hans sätt att kombinera olika konstformer har blivit en modell för hur artister kan uttrycka sig.

Påverkan syns tydligast i formen. Att en popartist förväntas leverera koreografi, musikvideor med regi och en scenshow som hänger ihop är inte någon självklarhet historiskt, utan något som etablerades under 1980-talet med Jackson som det tydligaste exemplet. Artister som Beyoncé, Usher och Justin Timberlake har alla arbetat inom den mallen, och flera av dem har uttryckligen berättat att de studerat hans framträdanden bild för bild.

Hans musik fortsätter att spelas globalt och når nya generationer av lyssnare. Genom digitala plattformar har hans verk fått nytt liv och blivit tillgängliga för en bredare publik. Detta visar hur teknologiska förändringar kan bidra till att bevara kulturellt arv. Samtidigt förändrar strömningstjänsterna vad ett arv egentligen är: det som ligger kvar i spellistor fortsätter att generera intäkter, medan det som aldrig lagts upp i praktiken försvinner. Ett dödsbo som förvaltar rättigheterna har därmed betydande makt över hur en artist minns.

Musikaliskt är arvet svårare att peka ut än det visuella, men det finns. Kombinationen av funkbaserad bas, taktfasta trummor och melodier byggda för att kunna sjungas med återfinns hos en lång rad senare producenter. Även sättet att lägga sång i flera lager, där artisten stämmer med sig själv, hämtade många från hans skivor.

Skalan är också en del av förklaringen. Thriller sålde i ett antal exemplar som ingen skiva sedan dess kommit i närheten av, i en tid då nästan alla köpte samma format. En sådan gemensam publik finns knappast längre, eftersom lyssnandet i dag är uppdelat i tusentals flöden.

Jacksons arbete har också påverkat frågor om representation och identitet inom populärkulturen. Hans framgång bidrog till att öppna dörrar för artister från olika bakgrunder. Ett konkret exempel är musikkanalen MTV, som under sina första år sällan spelade svarta artister. Att "Billie Jean" kom in i kanalens rotation 1983 brukar beskrivas som en vändpunkt, även om det är omtvistat exakt hur avgörande just den enskilda händelsen var.

Samtidigt diskuteras hans arv ofta i relation till de kontroverser som omgav honom. Anklagelser om övergrepp mot barn har prövats i domstol, avvisats i ett fall och lyfts på nytt i dokumentärer långt efter hans död. När filmen Leaving Neverland visades 2019 valde flera radiostationer att sluta spela hans musik, medan andra lyssnare i stället strömmade den mer än tidigare. Reaktionerna gick alltså åt två håll samtidigt.

Detta gör att hans eftermäle är komplext och föremål för olika tolkningar. Frågan om man kan skilja verket från upphovspersonen har inget svar som alla accepterar. Den som menar att musiken kan stå för sig själv pekar på att den skapades av många människor och att den tillhör dem som lyssnar. Den som menar motsatsen invänder att lyssnandet ger intäkter och uppmärksamhet, och att ingen av delarna är neutral.

Han bidrog också till att göra insamlingar till stora medieevenemang. Låten We Are the World, som han skrev tillsammans med Lionel Richie 1985, samlade in stora summor och blev en förlaga för hur artister sedan dess engagerat sig i katastrofer. Kritiken mot den formen, att den kan handla mer om avsändaren än om mottagaren, kom också att följa med.

Ett arv är därför inte något färdigt som lämnas efter sig, utan något som varje generation bestämmer på nytt. Vad som spelas, vad som lärs ut i skolan och vad som utelämnas avgörs av dem som lever nu, inte av den som en gång skapade verken.

Texten visar att Michael Jacksons betydelse inte bara ligger i hans musik utan också i hans långsiktiga påverkan på kultur och samhälle.`,
  questions: [
    { type: 'literal', q: 'Vad etablerades under 1980-talet med Jackson som tydligaste exempel?',
      options: ['Att popmusik alltid framförs med ett liveband på scen', 'Att artister förväntas skriva allt sitt material själva', 'Att en popartist levererar koreografi, video och scenshow', 'Att musik säljs främst genom singlar i stället för album'], correct: 2 },
    { type: 'inferens', q: 'Varför har ett dödsbo betydande makt över hur en artist minns?',
      options: ['För att det avgör vad som finns tillgängligt på plattformarna', 'För att det kan neka andra artister att hämta inspiration', 'För att det bestämmer vilka musikpriser som delas ut', 'För att det kontrollerar vad forskare tillåts skriva'], correct: 0 },
    { type: 'literal', q: 'Vad beskrivs som en vändpunkt år 1983?',
      options: ['Att Jackson för första gången turnerade utanför USA', 'Att "Billie Jean" kom in i MTV:s rotation', 'Att musikvideon uppfanns som eget format', 'Att skivbolagen började kontraktera betydligt yngre artister'], correct: 1 },
    { type: 'inferens', q: 'Vad menas med att reaktionerna gick åt två håll samtidigt?',
      options: ['Att kritiken kom både från publiken och från recensenter', 'Att domstolar i olika länder kom till olika slutsatser', 'Att dokumentären både hyllades och kritiserades för sitt hantverk', 'Att musiken både plockades bort och strömmades mer än förut'], correct: 3 },
    { type: 'forfattarens-syfte', q: 'Varför redovisar texten båda sidorna i frågan om verk och upphovsperson?',
      options: ['För att visa att frågan saknar ett svar som alla accepterar', 'För att övertyga läsaren om att musiken bör väljas bort', 'För att slå fast att konsten alltid står fri från konstnären', 'För att slippa ta ställning i en fråga som väcker starka känslor'], correct: 0 },
    { type: 'sammanfatta', q: 'Vilken slutsats drar texten om vad ett arv är?',
      options: ['Att ett arv fastställs av forskare först långt i efterhand', 'Att ett arv bevaras bäst om det inte ifrågasätts alls', 'Att ett arv avgörs på nytt av varje ny generation', 'Att ett arv i praktiken bestäms av strömningstjänsterna'], correct: 2 },
  ],
},

// ── åk 8, 157 → ~550 ord ────────────────────────────────────────────────
'ak8-tema-004-c': {
  text: `Katter är ett av de vanligaste husdjuren i världen. De har levt tillsammans med människor i tusentals år, men till skillnad från hundar har de behållit mycket av sitt självständiga beteende. Katter jagar ofta ensamma och kan klara sig själva under kortare perioder.

Historien bakom det förklarar en del. Tamkatten härstammar från den afrikanska vildkatten, och de första kontakterna med människor uppstod troligen kring de tidiga jordbrukarnas sädesförråd. Där fanns möss, och därmed fanns det mat. Katten sökte alltså upp människan av eget intresse, snarare än att fångas in och avlas fram för en bestämd uppgift på det sätt som hunden i hög grad gjorde. Skillnaden märks fortfarande i hur de två djuren förhåller sig till oss.

Kattens sinnen förklarar mycket av beteendet. Ögonen är byggda för skymning och klarar sig med betydligt mindre ljus än våra behöver, medan morrhåren känner av luftrörelser och hjälper katten att bedöma om den får plats i en öppning. Hörseln når högre toner än både vår och hundens, vilket är användbart när bytet är en mus.

Trots detta kan katter skapa starka band till sina ägare. De kommunicerar genom kroppsspråk, ljud och beteenden som att spinna eller stryka sig mot människor. Forskning visar att katter kan känna igen sina ägares röster och reagera på dem.

Ett märkligt förhållande gäller jamandet. Vuxna katter jamar sällan till varandra, utan ljudet används i första hand mot människor. Katten har alltså utvecklat ett sätt att tala som riktar sig mot en helt annan art. Spinnandet är svårare att tolka. Det förknippas med välbehag, men katter spinner även när de är rädda eller har ont, vilket gör att ljudet inte ensamt säger hur djuret mår.

Katter är också kända för sin nyfikenhet. De utforskar gärna nya miljöer och kan tillbringa lång tid med att observera sin omgivning. Samtidigt behöver de trygghet och rutiner för att må bra. Leken hänger nära ihop med jaktbeteendet: en katt som jagar en leksaksmus följer samma mönster som vid riktig jakt, och en katt som aldrig får utlopp för det blir lätt rastlös.

Att katter sover mycket är ingen lättja. En jägare som lägger stor kraft på korta utfall behöver vila däremellan, och en katt kan sova uppemot sexton timmar per dygn. Aktiviteten är dessutom störst i gryning och skymning.

Bilden av katten som osocial stämmer inte heller helt. Där det finns gott om mat, till exempel kring en gård, bildar katter kolonier där honor kan hjälpa varandra med ungarna. Självständigheten handlar alltså mer om att katten klarar sig ensam än om att den föredrar det.

Det finns olika uppfattningar om hur katter ska hållas. Vissa menar att de bör få gå fritt utomhus, medan andra förespråkar innekatter för att skydda både djuret och naturen. Argumenten är konkreta på båda sidor. Utekatter dödar fåglar och smådjur i mängder som studier beskriver som betydande, särskilt i områden där arterna redan är hotade. Samtidigt löper en utekatt risk att bli påkörd eller skadad, medan en innekatt behöver mer stimulans för att inte tråkas ut.

I Sverige omfattas katter av djurskyddslagen på samma sätt som andra sällskapsdjur, och sedan 2023 måste de vara märkta och registrerade. Bakgrunden är att övergivna katter länge varit ett problem: ett djur utan känd ägare kan inte återlämnas, och antalet hemlösa katter har uppskattats till tiotusentals.

Kattens roll som husdjur fortsätter att utvecklas i takt med att människors livsstil förändras.`,
  questions: [
    { type: 'inferens', q: 'Varför beskrivs katten som ett djur som sökte upp människan?',
      options: ['För att den avlades fram för att vakta sädesförråden', 'För att den följde med människor under långa vandringar', 'För att sädesförråden lockade möss och därmed byten', 'För att den behövde skydd mot betydligt större rovdjur'], correct: 2 },
    { type: 'literal', q: 'Vad är särskilt med kattens jamande?',
      options: ['Det används i första hand mot människor', 'Det förekommer enbart hos alldeles unga katter', 'Det ersätter kroppsspråket helt och hållet', 'Det låter tydligt olika beroende på kattens ras'], correct: 0 },
    { type: 'inferens', q: 'Varför säger spinnandet inte ensamt hur katten mår?',
      options: ['För att alla katter inte har förmågan att spinna', 'För att katter spinner även när de är rädda eller har ont', 'För att ljudet är för svagt för att kunna uppfattas', 'För att spinnandet nästan alltid sker under sömnen'], correct: 1 },
    { type: 'literal', q: 'Vilken risk med utekatter tar texten upp för naturen?',
      options: ['Att de sprider smittsamma sjukdomar till vilda djur', 'Att de tränger undan rävar och grävlingar från reviren', 'Att de trampar ner växtlighet i känsliga naturområden', 'Att de dödar fåglar och smådjur i betydande mängder'], correct: 3 },
    { type: 'literal', q: 'Varför infördes kravet på märkning och registrering?',
      options: ['För att katter utan känd ägare inte kan återlämnas', 'För att underlätta försäljningen av kattungar', 'För att begränsa hur många katter ett hushåll får ha', 'För att kunna ta ut en årlig avgift av kattägare'], correct: 0 },
    { type: 'sammanfatta', q: 'Vilken bild av katten ger texten som helhet?',
      options: ['Att katten passar allt sämre som husdjur i dagens samhälle', 'Att katten borde hållas inomhus helt utan undantag', 'Att katten är självständig men ändå formad av livet med människor', 'Att kattens beteende i stort sett är outforskat än så länge'], correct: 2 },
  ],
},

// ── åk 8, 158 → ~550 ord ────────────────────────────────────────────────
'ak8-tema-024': {
  text: `När tryckpressen utvecklades på 1400-talet förändrades samhället i grunden. Innan dess skrevs böcker för hand, vilket gjorde dem dyra och ovanliga. Med tryckpressen kunde texter produceras snabbare och i betydligt större mängder.

Det avgörande var inte pressen i sig utan de lösa typerna. Johannes Gutenberg göt enskilda bokstäver i metall som kunde sättas ihop till en sida, tryckas i många exemplar och sedan plockas isär och användas på nytt. Själva pressen lånade han från vinframställningen. Tekniken med rörliga typer fanns redan i Kina och Korea, men det latinska alfabetets få tecken gjorde metoden särskilt användbar i Europa.

Arbetet i ett tryckeri var ett hantverk. En sättare plockade bokstav för bokstav ur ett fack och byggde upp sidan spegelvänt, rad för rad. En van sättare kunde hantera omkring tusen tecken i timmen, vilket var långsamt jämfört med i dag men oerhört snabbt jämfört med att skriva av en hel bok för hand.

Detta ledde till att fler människor fick tillgång till kunskap. Böcker blev billigare och kunde spridas över större områden. Utbildning blev mer tillgänglig, och fler lärde sig läsa. Förändringen gick fort: under de första femtio åren efter Gutenbergs verkstad trycktes miljontals böcker i Europa, fler än vad avskrivarna hunnit framställa under flera århundraden.

Tryckpressen spelade också en viktig roll i spridningen av idéer. Under reformationen användes den för att sprida religiösa texter och kritik mot kyrkan. Martin Luthers teser översattes, trycktes och såldes i hela Tyskland inom några veckor, långt snabbare än kyrkan hann formulera ett svar. Att Bibeln kunde tryckas på folkspråk innebar dessutom att människor kunde läsa den utan en präst som mellanhand. Detta bidrog till stora förändringar i Europa.

Samtidigt fanns det motstånd. Vissa makthavare försökte kontrollera vad som fick tryckas, eftersom de var rädda för att förlora inflytande. Kyrkan upprättade listor över förbjudna böcker, och i många länder krävdes tillstånd för att över huvud taget driva ett tryckeri. Censuren var alltså inte ett undantag utan under lång tid själva regeln.

Tryckningen påverkade också språken. När böcker skulle säljas i ett helt land behövde stavningen bli enhetlig, och de former som råkade användas av de största tryckerierna blev normen. Många av de stavningsregler vi i dag uppfattar som självklara går tillbaka på praktiska beslut i tryckerier för flera hundra år sedan.

I Sverige kom den första tryckta boken ut 1483, och länge var det kyrkan och kungamakten som bestämde vad som fick tryckas. Först 1766 fick landet en tryckfrihetsförordning, som var bland de första i världen. Den innebar att myndigheternas handlingar blev offentliga och att det gick att kritisera makten i tryck utan att först be om lov.

Det är också värt att komma ihåg att pressen spred allt slags innehåll. Samma teknik som gjorde vetenskapliga arbeten tillgängliga tryckte handböcker för häxprocesser, rykten och propaganda. Att information sprids snabbare säger ingenting om hur sann den är.

På lång sikt bidrog tryckpressen ändå till utvecklingen av vetenskap, demokrati och yttrandefrihet. Den gjorde det möjligt för människor att dela tankar och diskutera idéer på ett helt nytt sätt. Forskare kunde bygga vidare på varandras resultat eftersom de kunde vara säkra på att läsa exakt samma text, något som handskrifter med sina avskrivningsfel aldrig kunnat garantera.

Idag kan vi se likheter med internet, som också sprider information snabbt. Precis som då finns både möjligheter och utmaningar, och precis som då tog det tid innan samhället hittade sätt att hantera dem.`,
  questions: [
    { type: 'literal', q: 'Vad var det avgörande med Gutenbergs uppfinning?',
      options: ['Att pressen kunde drivas med hjälp av vattenkraft', 'Att papperet blev betydligt billigare att tillverka', 'Att lösa typer kunde sättas ihop och sedan återanvändas', 'Att bläcket torkade mycket snabbare än tidigare'], correct: 2 },
    { type: 'inferens', q: 'Varför blev metoden särskilt användbar just i Europa?',
      options: ['För att det latinska alfabetet har förhållandevis få tecken', 'För att europeiska språk skrivs från vänster till höger', 'För att Kina saknade tillgång till papper vid samma tid', 'För att de europeiska städerna låg tätare intill varandra'], correct: 0 },
    { type: 'literal', q: 'Vad hände med Luthers teser?',
      options: ['De förbjöds innan de hann tryckas i någon upplaga', 'De spreds i hela Tyskland inom loppet av några veckor', 'De skrevs av för hand i klostren under flera år', 'De översattes till tyska först ett sekel senare'], correct: 1 },
    { type: 'inferens', q: 'Varför skriver texten att censuren var regeln snarare än undantaget?',
      options: ['För att böcker sällan lästes utanför de större städerna', 'För att tryckerierna själva valde bort känsligt innehåll', 'För att läskunnigheten var för låg för att oroa makten', 'För att förbudslistor och tillstånd var vanliga i många länder'], correct: 3 },
    { type: 'inferens', q: 'Varför nämns handböcker för häxprocesser?',
      options: ['För att förklara varför censuren infördes så tidigt', 'För att jämföra kyrkans makt med statens vid samma tid', 'För att peka ut vilken sorts böcker som trycktes mest', 'För att visa att tekniken spred allt slags innehåll'], correct: 3 },
    { type: 'sammanfatta', q: 'Vilken jämförelse med internet gör texten?',
      options: ['Att internet spridit mer felaktig information än pressen gjorde', 'Att båda spred information snabbt innan samhället hann anpassa sig', 'Att internet gjort tryckta böcker i stort sett överflödiga', 'Att båda framför allt kom att gynna dem som redan hade makt'], correct: 1 },
  ],
},
};

const BAND = { 7: [500, 530], 8: [530, 570], 9: [570, 590], 10: [590, 625] };
const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let ok = true;
Object.entries(NYA).forEach(([id, data]) => {
  const t = lib.find(x => x.id === id);
  if (!t) { console.error('Hittar inte ' + id); ok = false; return; }
  t.text = data.text;
  t.questions = data.questions;
  const n = data.text.trim().split(/\s+/).length;
  t.meta = { ...(t.meta || {}), wordCount: n };
  const b = BAND[t.grade];
  const inom = n >= b[0] && n <= b[1];
  if (!inom) ok = false;
  data.questions.forEach((q, i) => {
    const m = q.q.match(/"([^"]+)"/);
    if (q.type === 'ord' && m && !data.text.toLowerCase().includes(m[1].toLowerCase())) {
      console.error(`  VARNING: ${id} f${i + 1} – "${m[1]}" saknas i texten`); ok = false;
    }
  });
  console.log(`${id.padEnd(16)} åk${String(t.grade).padEnd(3)} ${String(n).padStart(4)} ord ${inom ? '✅' : '❌ krav ' + b[0] + '–' + b[1]}  facit:${data.questions.map(q => q.correct).join('')}`);
});

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
if (!ok) process.exit(1);
