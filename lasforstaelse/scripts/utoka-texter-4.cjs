#!/usr/bin/env node
//
// Sats 4: de fem sista texterna under 150 ord, med omskrivna frågor.
//
// ak7-tema-032 låg nära ak8-tema-027 (båda "Vattnets kretslopp"). Åk 7-versionen
// har därför fått en konkretare vinkel – vattnet i den egna kranen – medan
// åk 8-versionen behåller sitt fokus på processerna och klimatet.

const fs = require('fs');
const path = require('path');

const NYA = {

// ── åk 7, 139 → ~515 ord ────────────────────────────────────────────────
'ak7-tema-032': {
  text: `Vattnets kretslopp är en naturlig process som ständigt pågår på jorden. Solens energi gör att vatten i hav, sjöar och floder avdunstar och stiger upp i atmosfären som vattenånga. När vattenångan kyls ner bildas moln.

Så småningom faller vattnet tillbaka till jorden som nederbörd, till exempel regn eller snö. En del av vattnet rinner ner i marken och blir grundvatten, medan annat rinner tillbaka till sjöar och hav.

En sak som gör kretsloppet speciellt är att det inte tillförs något nytt. Vattnet på jorden är i stort sett detsamma som funnits här i miljarder år. Det innebär att vattnet i ett glas har varit hav, moln, grundvatten och kanske en del av en växt otaliga gånger tidigare.

Vattnets kretslopp är viktigt för livet på jorden. Det förser växter, djur och människor med färskt vatten. Utan detta kretslopp skulle många ekosystem inte fungera.

Trots att jorden ser blå ut från rymden är det mesta av vattnet salt. Bara någon enstaka procent är sötvatten, och större delen av det är fruset i glaciärer eller ligger djupt nere i marken. Den del vi enkelt kan använda är alltså liten.

För de flesta i Sverige börjar vattnet i kranen i en sjö eller i marken. Det renas i ett vattenverk, pumpas ut i ledningar och används sedan till dryck, mat, tvätt och toalett. En person använder ungefär hundrafyrtio liter per dygn, och bara en liten del av det dricks. Efter användningen går vattnet till ett reningsverk innan det släpps tillbaka till naturen.

Människans aktiviteter kan påverka kretsloppet. Föroreningar kan spridas med vatten och påverka både miljö och hälsa. Därför är det viktigt att skydda våra vattenresurser.

Föroreningarna kommer från fler håll än man kanske tror. Utsläpp från fabriker är den tydligaste källan, men mycket kommer också från jordbruk, trafik och enskilda hushåll. Läkemedelsrester som passerar genom kroppen är ett exempel som reningsverken har svårt att fånga upp.

Eftersom vattnet rör sig stannar problemen sällan där de uppstår. Ett utsläpp i ett vattendrag kan påverka en sjö längre ner, och det som hamnar i marken kan nå grundvattnet flera år senare. Det är en av anledningarna till att vattenfrågor ofta måste lösas mellan kommuner och länder, inte bara på den plats där problemet börjar.

Tillgången ser mycket olika ut i världen. I Sverige är sötvatten något de flesta tar för givet, medan omkring två miljarder människor saknar säkert dricksvatten. På vissa håll delar flera länder på samma flod, och när ett land uppströms bygger en damm påverkas alla nedströms. Sådana situationer har lett till både långvariga konflikter och till avtal som reglerar hur vattnet ska fördelas.

Också i Sverige märks förändringar. Somrar med lite nederbörd har på senare år gett låga grundvattennivåer i delar av landet, och kommuner har infört bevattningsförbud. Det som länge sågs som en självklar resurs har därmed börjat behandlas som något som kan ta slut även här.

Genom att förstå vattnets kretslopp kan vi bättre ta hand om naturen och se till att också framtida generationer har tillgång till rent och säkert vatten.`,
  questions: [
    { type: 'inferens', q: 'Vad menar texten med att inget nytt vatten tillförs?',
      options: ['Att nederbörden minskar för varje år som går', 'Att samma vatten cirkulerat på jorden i miljarder år', 'Att haven inte längre bidrar till avdunstningen', 'Att vattenverken återanvänder allt vatten flera gånger'], correct: 1 },
    { type: 'literal', q: 'Hur stor del av jordens vatten är sötvatten enligt texten?',
      options: ['Ungefär hälften av allt vatten på jorden', 'Runt en fjärdedel, mest i sjöar och floder', 'Bara någon enstaka procent, mest fruset eller djupt', 'Omkring en tiondel som ligger i glaciärerna'], correct: 2 },
    { type: 'literal', q: 'Vad händer med vattnet efter att det använts i ett hushåll?',
      options: ['Det leds till ett reningsverk innan det släpps tillbaka', 'Det pumpas direkt tillbaka till vattenverket igen', 'Det avdunstar från ledningarna innan det når naturen', 'Det samlas i tankar tills det kan användas på nytt'], correct: 0 },
    { type: 'inferens', q: 'Varför måste vattenfrågor ofta lösas mellan kommuner och länder?',
      options: ['För att reningsverken är gemensamt ägda av flera stater', 'För att lagarna om vatten skiljer sig kraftigt åt', 'För att vattenverken behöver samma sorts teknik överallt', 'För att vattnet rör sig och tar problemen med sig vidare'], correct: 3 },
    { type: 'ord', q: 'Vad är grundvatten enligt texten?',
      options: ['Vatten som ligger kvar på markytan efter regn', 'Vatten som runnit ner i marken', 'Vatten som redan renats i ett vattenverk', 'Vatten som avdunstat och bildat moln'], correct: 1 },
    { type: 'sammanfatta', q: 'Vad vill texten framför allt få läsaren att förstå?',
      options: ['Att vattenbrist snart kommer att drabba hela Sverige', 'Att kretsloppet fungerar bäst utan mänsklig inblandning', 'Att det tillgängliga vattnet är begränsat och behöver skyddas', 'Att reningsverken klarar av alla föroreningar som uppstår'], correct: 2 },
  ],
},

// ── åk 9, 140 → ~580 ord ────────────────────────────────────────────────
'ak10-rosa-002': {
  text: `Under mitten av 1900-talet växte medborgarrättsrörelsen fram i USA som en reaktion på rasdiskriminering och segregation. Rosa Parks blev en symbol för denna kamp, men hon var långt ifrån ensam.

Rörelsen bestod av aktivister, organisationer och vanliga människor som kämpade för lika rättigheter. Målet var att avskaffa diskriminerande lagar och skapa ett mer rättvist samhälle. Flera organisationer arbetade parallellt och med olika metoder. Vissa drev rättsprocesser i domstol, andra organiserade lokala aktioner, och en del bestod nästan uteslutande av studenter.

Protester tog många former, inklusive demonstrationer, bojkotter och rättsprocesser. En viktig strategi var icke-våld, vilket innebar att man protesterade fredligt. Detta bidrog till att skapa sympati och uppmärksamhet både nationellt och internationellt.

Icke-våldet var inte bara en moralisk hållning utan också en genomtänkt taktik. Deltagarna tränades i förväg på att sitta kvar, hålla blicken sänkt och inte svara när de blev provocerade. Tanken var att kontrasten mellan lugna demonstranter och våldsamma motreaktioner skulle bli omöjlig att bortförklara för den som såg den.

Bland de mest kända aktionerna finns sittstrejkerna vid lunchdiskar där svarta inte fick serveras, bussresorna genom sydstaterna för att pröva om reglerna följdes, och marschen mot Washington 1963 där Martin Luther King höll sitt mest citerade tal. Två år senare uppmärksammades marschen i Selma, där polisens ingripande mot fredliga demonstranter sändes i tv och väckte stark reaktion.

Media spelade en avgörande roll genom att visa bilder av orättvisor. Detta gjorde att fler människor blev medvetna om situationen. Televisionen hade just fått stor spridning, och för första gången kunde människor i norra USA se i sina vardagsrum vad som pågick i söder. Att bilderna nådde utlandet spelade också roll, eftersom USA under kalla kriget ville framstå som frihetens försvarare.

Arbetet gav resultat i lagstiftningen. Medborgarrättslagen 1964 förbjöd diskriminering på arbetsplatser och offentliga platser, och rösträttslagen året därpå tog bort de hinder som i praktiken stängt ute svarta väljare i sydstaterna.

Inom rörelsen fanns samtidigt oenighet. Alla ansåg inte att icke-våld var rätt väg, och röster som Malcolm X menade att människor hade rätt att försvara sig. Andra tyckte att lagändringar inte räckte så länge fattigdomen bestod. Bilden av en enad rörelse med en enda ledare är därför en förenkling som uppstått i efterhand.

Framgångarna hade sina gränser. Lagarna tog bort den formella diskrimineringen, men de förändrade inte i sig var människor bodde, vilka skolor de gick i eller hur förmögenheter var fördelade. Under sina sista år riktade King därför alltmer uppmärksamhet mot fattigdom och ekonomiska villkor, frågor som visade sig vara svårare att samla brett stöd kring än rätten att sitta var man ville på en buss.

Rörelsens metoder spred sig ändå vidare. Sittstrejker, bojkotter och tanken på att medvetet bryta mot en orättvis lag för att pröva den i domstol har sedan dess använts av rörelser för kvinnors rättigheter, för personer med funktionsnedsättning och i klimatfrågan. Det som utvecklades i sydstaterna på 1950- och 60-talen har därmed blivit en del av en gemensam verktygslåda långt utanför USA.

Rosa Parks handling blev en katalysator för större förändringar. Hennes protest inspirerade andra att engagera sig och stärkte rörelsen.

Texten visar att förändring ofta kräver både individuella handlingar och kollektivt arbete över tid. Den enskilda handlingen får sin kraft först när det finns en organisation som kan fånga upp den, och organisationen behöver i sin tur konkreta händelser att samlas kring. Utan Parks hade bojkotten saknat sin utlösande gnista, men utan de år av organisering som föregick den hade hennes vägran troligen förblivit en notis i en lokaltidning.`,
  questions: [
    { type: 'inferens', q: 'Varför tränades deltagarna i att inte svara på provokationer?',
      options: ['För att undvika att bli gripna av polisen', 'För att kontrasten mot motreaktionerna skulle bli tydlig', 'För att organisationerna krävde tystnad under aktionerna', 'För att metoden var enklare att lära ut än andra'], correct: 1 },
    { type: 'literal', q: 'Vad innebar rösträttslagen som kom 1965?',
      options: ['Att alla delstater fick införa egna vallagar', 'Att rösträttsåldern sänktes i hela landet', 'Att hinder som stängt ute svarta väljare togs bort', 'Att val skulle hållas oftare i sydstaterna'], correct: 2 },
    { type: 'inferens', q: 'Varför spelade det roll att bilderna nådde utlandet?',
      options: ['För att utländska organisationer skickade pengar till rörelsen', 'För att andra länder hotade med handelssanktioner', 'För att fler journalister då kunde resa till sydstaterna', 'För att USA under kalla kriget ville framstå som frihetens försvarare'], correct: 3 },
    { type: 'literal', q: 'Vilken oenighet fanns inom rörelsen?',
      options: ['Om icke-våld var rätt väg och om lagändringar räckte', 'Om marschen mot Washington borde genomföras alls', 'Om kvinnor skulle få delta i aktionerna', 'Om media borde bjudas in till demonstrationerna'], correct: 0 },
    { type: 'ord', q: 'Vad betyder det att Rosa Parks handling blev en "katalysator"?',
      options: ['Att den avslutade en lång period av protester', 'Att den utlöste och påskyndade en större förändring', 'Att den upprepades av många andra på samma sätt', 'Att den blev symbol utan att få praktisk effekt'], correct: 1 },
    { type: 'sammanfatta', q: 'Vilken slutsats om förändring driver texten?',
      options: ['Att enskilda personer sällan spelar någon större roll', 'Att lagändringar är den enda vägen till rättvisa', 'Att enskilda handlingar och organisationer behöver varandra', 'Att medias uppmärksamhet avgör allt i en proteströrelse'], correct: 2 },
  ],
},

// ── åk 7, 143 → ~515 ord ────────────────────────────────────────────────
'ak7-tema-048': {
  text: `När Sara såg filmen första gången tänkte hon mest på handlingen. Det var en spännande berättelse om en ung person som försökte hitta sin plats i världen. Men när hon såg filmen igen upptäckte hon något mer.

Filmen använde symboler och bilder för att visa känslor och teman. Till exempel återkom en spegel flera gånger. Den verkade representera hur huvudpersonen såg på sig själv. Ju mer filmen gick framåt, desto mer förändrades spegelns betydelse.

I början av filmen var spegeln hel och huvudpersonen tittade sällan i den. Mot mitten dök den upp sprucken efter ett bråk, och i slutscenen stod den kvar men lagad, med en synlig skarv. Sara märkte att hon reagerade på skarven utan att kunna säga varför.

Läraren i skolan förklarade att filmer ofta har flera lager. Det som syns på ytan är bara en del av berättelsen. Under finns budskap om identitet, val och konsekvenser.

Hon berättade också att filmskapare har fler verktyg än vad som sägs i repliker. Kameran kan placeras lågt så att en person verkar större och mäktigare, eller högt så att någon ser liten ut. Färger kan bli kallare när stämningen blir det. Musik kan förbereda tittaren på något innan det händer, och tystnad kan göra en scen mer obehaglig än något ljud.

Klippningen spelar också roll. Snabba klipp skapar stress, medan långa tagningar där kameran dröjer kvar tvingar tittaren att stanna upp. Sara tänkte tillbaka på slutscenen och insåg att den varit ovanligt lång, och att det förmodligen var meningen.

Sara började tänka på hur hon själv tolkar filmer. Hon insåg att olika personer kan förstå samma film på olika sätt. Det gjorde att hon började uppskatta filmer mer, eftersom de kunde betyda olika saker beroende på vem som tittar.

När klassen diskuterade filmen blev det tydligt. En klasskamrat tyckte att slutet var hoppfullt, medan en annan tyckte att det var sorgligt. Båda pekade på samma scen. Skillnaden låg inte i vad de sett, utan i vad de tagit med sig in i biosalongen.

Läraren sa att en tolkning ändå inte kan bli hur som helst. Den behöver ha stöd i något man faktiskt kan peka på i filmen: en bild, en replik, ett klipp. Att tycka är fritt, men att förklara varför man tycker något kräver att man går tillbaka till filmen.

Hon märkte också att det är skillnad på att tycka om en film och att förstå den. En film kan vara skickligt gjord utan att man gillar den, och en film man älskar kan vara ganska enkel i sitt hantverk. Att kunna hålla isär de två sakerna gjorde det lättare att prata om filmer med människor som tyckte något helt annat.

Läraren avslutade med att säga att det gäller mer än film. Reklam, musikvideor och inlägg i sociala medier är också gjorda av någon, med val bakom sig om vad som ska synas och vad som ska utelämnas. Den som vant sig vid att läsa en film brukar börja se sådana val även utanför biosalongen.

Sara bestämde sig för att se om filmen en tredje gång, den här gången med anteckningsblock.`,
  questions: [
    { type: 'literal', q: 'Hur förändras spegeln genom filmen?',
      options: ['Den är hel, blir sprucken och står till slut lagad', 'Den byts ut mot en ny i varje ny scen', 'Den försvinner helt efter bråket i mitten', 'Den flyttas mellan olika rum under handlingen'], correct: 0 },
    { type: 'literal', q: 'Vad händer enligt läraren när kameran placeras lågt?',
      options: ['Bilden blir mörkare och svårare att uppfatta', 'Personen verkar större och mäktigare', 'Tittaren får svårt att följa handlingen', 'Scenen upplevs som längre än den är'], correct: 1 },
    { type: 'inferens', q: 'Varför var slutscenen ovanligt lång, enligt Saras slutsats?',
      options: ['För att skådespelarna behövde tid att lära sig replikerna', 'För att filmen annars hade blivit för kort', 'För att tittaren skulle tvingas stanna upp', 'För att musiken behövde hinna spelas färdigt'], correct: 2 },
    { type: 'inferens', q: 'Vad visar det att två klasskamrater tolkade slutet olika?',
      options: ['Att den ena av dem missat viktiga delar av filmen', 'Att filmen var otydligt gjord från början', 'Att slutet var avsiktligt oavslutat av regissören', 'Att tittarens egna erfarenheter påverkar tolkningen'], correct: 3 },
    { type: 'forfattarens-syfte', q: 'Varför säger läraren att en tolkning ändå inte kan bli hur som helst?',
      options: ['För att läraren själv bestämmer vad som är rätt svar', 'För att en tolkning behöver stöd i något som finns i filmen', 'För att regissörens avsikt alltid går att ta reda på', 'För att filmer är gjorda med bara en möjlig innebörd'], correct: 1 },
    { type: 'sammanfatta', q: 'Vad handlar texten främst om?',
      options: ['Att lära sig se det som ligger under en films yta', 'Att filmer bör ses flera gånger för att vara värda pengarna', 'Att skolan borde använda film oftare i undervisningen', 'Att symboler är det viktigaste verktyget en regissör har'], correct: 0 },
  ],
},

// ── åk 9, 144 → ~580 ord ────────────────────────────────────────────────
'ak10-obama-005': {
  text: `Efter att Barack Obama avslutade sin tid som president 2017 fortsatte han att vara aktiv i samhällsfrågor. Tillsammans med sin fru Michelle Obama startade han initiativ och organisationer som arbetar med utbildning, ledarskap och demokrati.

Det finns en lång tradition av att amerikanska presidenter fortsätter arbeta efter sin tid i ämbetet. Flera av dem har ägnat sig åt välgörenhet, medling i konflikter eller frågor de inte hann driva medan de satt vid makten. Eftersom en president bara får sitta två perioder är många fortfarande relativt unga när de lämnar, och kan ha decennier framför sig.

De har också engagerat sig i att stödja unga människor och uppmuntra dem att delta i samhällsutvecklingen. Genom olika projekt vill de stärka framtida ledare. Stiftelsen de driver arbetar bland annat med utbildningsprogram där unga från olika länder får träffas och utveckla egna samhällsprojekt.

Obama har även skrivit böcker där han reflekterar över sitt liv och sin tid som president. Dessa böcker har nått en stor publik och bidragit till diskussioner om politik och ledarskap. Memoarer skrivna av tidigare presidenter är en genre i sig, och de läses ofta lika mycket som historiska källor som för deras litterära värde. Samtidigt är de skrivna av den som var med, vilket gör att de behöver läsas kritiskt: den som berättar om sina egna beslut har sällan ett neutralt förhållande till dem.

Han deltar ibland i offentliga samtal och föreläsningar där han diskuterar aktuella frågor som demokrati, klimat och globalt samarbete. Att tidigare presidenter tar betalt för sådana framträdanden har diskuterats. Kritiker menar att det riskerar att skapa beroenden till dem som betalar, medan andra menar att det är en rimlig inkomst för någon som lämnat ett offentligt uppdrag.

En annan tradition är att avgångna presidenter avhåller sig från att öppet kritisera sin efterträdare. Tanken bakom är att bara en person i taget ska tala för landet. Den regeln har blivit svårare att upprätthålla under senare år, och Obama har vid flera tillfällen brutit mot den när han ansett att grundläggande demokratiska principer stått på spel.

Trots att han inte längre är president har han fortsatt inflytande. Många människor lyssnar fortfarande på hans åsikter och perspektiv. Inflytandet ser dock annorlunda ut än tidigare. Det bygger inte på formella befogenheter utan på uppmärksamhet, och det är därför helt beroende av att människor fortsätter att vilja lyssna. En president kan fatta beslut som gäller oavsett vad andra tycker; en tidigare president kan bara övertyga.

Till traditionerna hör också presidentbiblioteken. Varje avgången president bygger upp ett arkiv och museum där handlingar från ämbetstiden samlas och görs tillgängliga för forskare. Institutionerna finansieras till stor del privat, vilket har gett upphov till diskussion om hur självständig en sådan skildring av det egna presidentskapet egentligen kan bli.

Michelle Obamas roll har samtidigt vuxit till något eget. Hennes memoarer blev en av de mest sålda böckerna under sitt utgivningsår, och hon har drivit egna frågor om hälsa, utbildning och valdeltagande. Att en tidigare presidenthustru bygger en självständig offentlig roll är förhållandevis nytt, och det har förändrat förväntningarna på vad rollen kan innebära efter tiden i Vita huset.

Hans arbete efter presidentskapet visar att politiskt engagemang kan fortsätta även utanför formella maktpositioner. Samtidigt väcker det frågan vad ett sådant inflytande egentligen vilar på, och vem som kan utkräva ansvar av någon som påverkar utan att vara vald. En folkvald kan röstas bort vid nästa val, medan den som verkar genom stiftelser, böcker och offentliga samtal bara kan mötas med argument eller med tystnad från publiken.`,
  questions: [
    { type: 'inferens', q: 'Varför har många avgångna presidenter decennier kvar att verka?',
      options: ['För att ämbetet numera tillsätts vid högre ålder', 'För att de sällan tar på sig nya uppdrag efteråt', 'För att de bara får sitta två perioder och därför lämnar tidigt', 'För att de har rätt till livslång tjänstledighet'], correct: 2 },
    { type: 'inferens', q: 'Varför menar texten att presidenters memoarer bör läsas kritiskt?',
      options: ['För att de ofta skrivs långt efter händelserna ägde rum', 'För att den som skildrar sina egna beslut inte är neutral', 'För att förlagen kräver att texten ska sälja bra', 'För att de sällan innehåller några konkreta uppgifter'], correct: 1 },
    { type: 'literal', q: 'Vilken invändning finns mot att ta betalt för föreläsningar?',
      options: ['Att det riskerar att skapa beroenden till dem som betalar', 'Att publiken då blir mindre och mer ensidig', 'Att innehållet måste godkännas av arrangören i förväg', 'Att det tar tid från arbetet i den egna stiftelsen'], correct: 0 },
    { type: 'literal', q: 'Vad är tanken bakom att avgångna presidenter inte kritiserar sin efterträdare?',
      options: ['Att kritik skulle skada deras egna framtida uppdrag', 'Att efterträdaren annars kan blockera deras stiftelser', 'Att tidigare presidenter saknar aktuell information', 'Att bara en person i taget ska tala för landet'], correct: 3 },
    { type: 'inferens', q: 'Hur skiljer sig hans inflytande i dag från det han hade som president?',
      options: ['Det är större eftersom han når fler människor globalt', 'Det bygger på uppmärksamhet i stället för på befogenheter', 'Det utövas enbart genom de böcker han skriver', 'Det är begränsat till frågor om utbildning och ledarskap'], correct: 1 },
    { type: 'forfattarens-syfte', q: 'Vilken fråga lämnar texten öppen i slutet?',
      options: ['Om Obama kommer att återvända till politiken', 'Om stiftelser är en effektiv form för samhällsarbete', 'Vem som kan utkräva ansvar av någon som påverkar utan att vara vald', 'Om memoarer bör räknas som tillförlitliga historiska källor'], correct: 2 },
  ],
},

// ── åk 9, 147 → ~580 ord ────────────────────────────────────────────────
'ak10-rosa-005': {
  text: `Rosa Parks handling har fått långvariga konsekvenser och hennes arv lever vidare än idag. Hon ses som en symbol för kamp mot orättvisa och inspirerar människor världen över.

Efter händelsen i Montgomery fortsatte Parks att arbeta för medborgarrättigheter. Hon deltog i olika organisationer och föreläste om vikten av jämlikhet. Åren närmast efter bojkotten var samtidigt svåra. Hon och hennes man förlorade sina arbeten och utsattes för hot, och familjen flyttade så småningom till Detroit. Där arbetade hon under lång tid på en kongressledamots kontor, till stor del utan den uppmärksamhet hennes namn väckte senare.

I dagens samhälle används hennes historia ofta som ett exempel på hur individer kan påverka större system. Hennes liv visar att förändring inte sker över en natt, utan kräver uthållighet.

Samtidigt diskuteras hur historien om Rosa Parks ibland förenklas. Vissa menar att fokus ofta ligger på en enskild handling, medan det kollektiva arbetet bakom förändringen glöms bort.

Den vanligaste förenklingen är bilden av en trött kvinna som spontant vägrade resa sig. Parks själv tillbakavisade den beskrivningen och sade att hon inte var tröttare än vanligt, utan trött på att ge efter. Hon hade dessutom gått utbildning i icke-våldsmetoder och varit sekreterare i en lokal medborgarrättsorganisation i flera år. Handlingen var alltså inte oplanerad på det sätt som berättelsen ofta antyder.

Varför historien ändå berättas så har diskuterats. En förklaring är att en enskild människas modiga stund är lättare att minnas och återberätta än ett långsamt organisationsarbete. En annan är att en spontan handling framstår som mindre hotfull än en planerad kampanj, och därför lättare kunde tas upp i skolböcker även av dem som inte ville lyfta fram rörelsens strategi.

Hennes arv handlar därför både om individens betydelse och vikten av gemensam kamp. Detta gör hennes historia relevant även i dagens diskussioner om rättvisa.

När hon dog 2005 fick hon ligga på lit de parade i Kapitolium i Washington, som första kvinna någonsin. Statyer och museer bär hennes namn, och dagen för hennes gripande uppmärksammas årligen. Sådana hedersbetygelser säger något om vem samhället väljer att minnas och vilka värden det vill knyta an till. Samtidigt kan de göra en person till en symbol som blir svår att se bakom, så att den levande människan med tvivel och motgångar försvinner in i statyn.

Hur perioden lärs ut har också förändrats. Äldre läroböcker koncentrerade sig ofta på ett fåtal namngivna ledare och på lagändringarna, medan senare framställningar i högre grad lyfter fram lokala organisatörer, kvinnor och ungdomar som bar mycket av det praktiska arbetet. Namn som Ella Baker, som byggde upp organisationsstrukturer utan att söka strålkastarljus, har därmed fått större plats än tidigare.

Förenklingen är inte unik för Parks. Historieskrivning tenderar att söka enskilda personer att fästa berättelsen vid, eftersom det gör den lättare att minnas. Priset är att de många som gjorde arbetet möjligt hamnar i skuggan, och att förändring framstår som något som utförs av hjältar snarare än av organiserade människor över lång tid.

Texten betonar att historiska händelser kan tolkas på olika sätt och att deras betydelse förändras över tid. Det som en generation lyfter fram kan en senare ifrågasätta, inte för att fakta ändrats utan för att frågorna man ställer till det förflutna gör det. Att jämföra hur samma händelse beskrivits i olika årtionden säger därför ofta lika mycket om den tid som berättar som om den tid som berättas om. Det är en av anledningarna till att historia sällan är färdigskriven, och till att äldre läroböcker kan vara intressanta källor i sig, oavsett hur väl de stämmer med dagens kunskap.`,
  questions: [
    { type: 'literal', q: 'Vad hände med Parks och hennes man åren efter bojkotten?',
      options: ['De erbjöds ledande poster i flera organisationer', 'De förlorade sina arbeten och utsattes för hot', 'De lämnade helt sitt politiska engagemang', 'De flyttade tillbaka till Montgomery efter en tid'], correct: 1 },
    { type: 'inferens', q: 'Varför tillbakavisade Parks bilden av sig själv som trött?',
      options: ['För att hon ville tona ned sin egen roll i händelsen', 'För att hon inte mindes situationen tydligt efteråt', 'För att hon var trött på att ge efter, inte fysiskt trött', 'För att beskrivningen kom från hennes motståndare'], correct: 2 },
    { type: 'inferens', q: 'Varför kunde en spontan handling lättare tas upp i skolböcker?',
      options: ['För att den var enklare att förklara för yngre elever', 'För att den kunde beskrivas utan att nämna platsen', 'För att den inte krävde några källhänvisningar', 'För att den framstod som mindre hotfull än en planerad kampanj'], correct: 3 },
    { type: 'literal', q: 'Vad var Parks roll i medborgarrättsrörelsen före gripandet?',
      options: ['Hon var sekreterare i en lokal organisation', 'Hon arbetade som advokat åt rörelsen', 'Hon höll föreläsningar runt om i sydstaterna', 'Hon var ordförande för en nationell förening'], correct: 0 },
    { type: 'inferens', q: 'Vilken risk med hedersbetygelser pekar texten på?',
      options: ['Att de kostar mer än de organisationer de hedrar', 'Att de gör personen till en symbol som är svår att se bakom', 'Att de bara uppmärksammas av dem som redan är insatta', 'Att de leder till att fakta om händelsen glöms bort helt'], correct: 1 },
    { type: 'sammanfatta', q: 'Vilken poäng om historieskrivning gör texten i slutet?',
      options: ['Att fakta om det förflutna ändras när ny forskning görs', 'Att berättelser om historien bör hållas så enkla som möjligt', 'Att hur en händelse beskrivs säger mycket om den berättande tiden', 'Att samtiden sällan förstår vilka händelser som blir viktiga'], correct: 2 },
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
