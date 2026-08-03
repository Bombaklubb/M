#!/usr/bin/env node
//
// Skriver om distraktorer i frågor där det rätta svaret går att peka ut på
// längden.
//
// Problemet: i 527 frågor är facit minst 1,6× längre (eller kortare) än
// närmaste distraktor. Typfallet är ett beskrivande rätt svar mot enstaviga
// distraktorer – "En hundvalp och hennes dag" mot "En resa", "En skola",
// "En storm". Eleven kan peka ut svaret utan att läsa texten.
//
// Fixen är att ge distraktorerna samma detaljnivå som facit, inte att korta
// ned facit: den preciseringen är ofta just det som gör svaret rätt.
//
// Facittexten anges aldrig här – skriptet behåller den ordagrant och byter
// bara ut de tre felaktiga alternativen. Positionen roteras så att facit inte
// hamnar på samma plats varje gång.

const fs = require('fs');
const path = require('path');

// nyckel: "textId|frågenummer" → tre nya, felaktiga svarsalternativ
const NYA_DISTRAKTORER = {
  'ak1-tema-002|4': ['Recept på olika efterrätter', 'Kartor över gamla städer', 'Spel med tärningar och brickor'],
  'ak4-musik-06|3': ['Att läsa högt inför hela klassen', 'Att rita av en tavla mycket noga', 'Att sova en stund efter maten'],
  'gy-samhalle-03|3': ['Reklam som är tydligt märkt som betald', 'Videor inspelade med enkel utrustning', 'Höjdpunkter från andras semestrar'],
  'ak8-tema-005-c|3': ['Hur skolor i olika länder styrs', 'Hur vädret skiftar mellan årstider', 'Hur familjer bor i olika städer'],
  'ak7-tema-047|4': ['Brist på mat under vintern', 'Turismens ökning i området', 'Vädrets växlingar mellan åren'],
  'ak6-tema-028|2': ['En plats där hästar tävlar', 'En sadel av ett särskilt slag', 'En färg som pälsen kan ha'],
  'ak3-vetenskap-019|3': ['Bara träbiten och inget mer', 'Gemen och myntet tillsammans', 'Gemen, som hoppade upp direkt'],
  'ak3-tema-001|3': ['Blå eller ljusblå', 'Lila och mörklila', 'Svarta eller gråa'],
  'ak6-tema-030|3': ['En tävling mellan ryttare', 'En lek för nybörjare', 'En resa till en hästgård'],
  'ak1-natur-hund-001|6': ['En resa till ett annat land', 'En skola för små barn', 'En storm som drog förbi'],
  'ak4-001|5': ['Rädda och oroliga', 'Arga och besvikna', 'Ledsna och trötta'],
  'gy-vetenskap-01|3': ['Hypotes som ännu inte prövats', 'Medelvärde av alla mätningar', 'Placeboeffekt utan verkan'],
  'ak7-tema-033|5': ['Skolor för stadens barn', 'Kyrkor byggda av sten', 'Marknader utanför muren'],
  'ak7-tema-043|4': ['Bilar med stora motorer', 'Böcker från gamla tider', 'Kameror uppsatta på marken'],
  'ak7-teknik-02|2': ['Hur lång du är och vad du väger enligt profilen', 'Vilken favoritfärg du angett i inställningarna', 'Hur snabbt du springer och hur ofta du tränar'],
  'ak5-samhalle-04|6': ['Att bara vuxna bryr sig om beslut och att unga inte kan påverka', 'Att regler aldrig behövs så länge människor är överens', 'Att beslut inte går att ändra när de en gång är fattade'],
  'ak7-tema-032|6': ['Vädrets växlingar', 'Energi i naturen', 'Djur som lever i vatten'],
  'ak6-tema-029|6': ['Mycket pengar', 'Tur och slump', 'Fullständig tystnad'],
  'ak10-obama-001|3': ['Journalist och redaktör', 'Läkare och forskare', 'Ingenjör och uppfinnare'],
  'akgy-mj-003|6': ['Hans privatliv och relationer', 'Hans barndom i Indiana', 'Hans ekonomi och affärer'],
  'akgy-mj-004|6': ['Hans familj och uppväxt', 'Hans ekonomi och avtal', 'Hans utbildning och tidiga skolgång'],
  'ak7-tema-016|3': ['Endast skolarbetet och proven i skolan', 'Bara sociala medier och mobilanvändning', 'Enbart föräldrarnas krav och förväntningar'],
  'ak8-tema-020|3': ['Studier och läxor', 'Träning och sport', 'Familj och släkt'],
  'ak1-etik-06|5': ['Sömnig och trött', 'Arg och irriterad', 'Rädd och orolig'],
  'ak1-skola-104|5': ['Snabbt och häftigt', 'Högt och bullrigt', 'Argt och hårt'],
  'ak3-djur-011|3': ['En polis i närheten', 'En lärare från skolan', 'En kompis till Ture'],

  // ── Sats 2 ──
  'ak6-historia-03|1': ['En dikt från samma tidsperiod', 'En nyhetsapp i en surfplatta', 'En film om stadens historia'],
  'ak6-tema-028|6': ['Pengar och lyx', 'Kläder och skor', 'Bilar och vagnar'],
  'ak3-vetenskap-019|4': ['Det är för lätt för att kunna röra sig alls', 'Det är gjort av papper och inte av metall', 'Det är för varmt för att magneten ska verka'],
  'ak6-tema-027|1': ['Simma långt', 'Flyga högt', 'Gräva djupt'],
  'ak10-obama-002|4': ['Han var den yngsta presidenten någonsin', 'Han var den rikaste av alla presidenter', 'Han var militär innan han blev vald'],
  'ak4-tema-003|2': ['En sorts fisk som ofta läggs på ris', 'En kryddig sås som serveras till', 'En sorts ris som kokas långsamt'],
  'ak8-tema-005-c|4': ['Sport och träning', 'Transport och resor', 'Mat och matlagning'],
  'ak7-tema-018|1': ['Vid bordet i matsalen', 'Längst bak i klassrummet', 'Hemma i köket före skolan'],
  'ak7-tema-044|1': ['Bara till utbildning i skolan', 'Endast till tävlingar och priser', 'Endast till arbete och yrken'],
  'ak6-historia-12|6': ['Köpa så mycket som möjligt medan priserna är låga', 'Bara köpa varor som tillverkats i ett enda land', 'Aldrig köpa frukt och grönt under vinterhalvåret'],
  'ak5-miljo-04|6': ['Att man lika gärna kan kasta all mat som blir över', 'Att naturen inte klarar av att återvinna något alls', 'Att maskar är farliga och bör hållas borta från jorden'],
  'ak4-vetenskap-03|4': ['För att en boll alltid hamnar snett när den släpps i vatten', 'För att vatten dras till aluminium men stöter bort andra metaller', 'För att skålens form är snyggare och därför flyter bättre'],
  'gym-ai-skola-002|4': ['Att verktygen kräver internetuppkoppling och slutar fungera vid avbrott', 'Att lärare tvingas lära sig nya lösenord och system varje termin', 'Att alla inlämnade texter blir betydligt längre än de var förut'],
  'ak3-skola-013|1': ['En utflykt med klassen', 'En läxa till nästa dag', 'En dag med prov'],
  'ak6-tema-028|4': ['Laga mat till stallet', 'Frakta varor mellan gårdar', 'Bygga hus av trä'],
  'ak5-natur-01|6': ['Att hela förändringen sker på bara någon sekund', 'Att det bara är träden som påverkas av våren', 'Att skogen ser likadan ut året runt utan förändring'],
  'ak7-tema-045|1': ['Tävling och vinst', 'Pengar och gåvor', 'Regler och straff'],
  'ak1-miljo-04|2': ['Äta glass efter maten', 'Rita en sol på papper', 'Hoppa högt på gården'],
  'ak7-tema-047|2': ['Endast ljud och tjut', 'Färger på pälsen', 'Ljus från ögonen'],
  'ak5-etik-05|6': ['Vem av alla i klassen är egentligen bäst på det här?', 'När är nästa lov och hur långt är det dit?', 'Varför finns skolan och vem bestämde det?'],
  'ak1-natur-02|4': ['För att kunna sjunga på natten', 'För att kunna flyga i vinden', 'För att kunna leka med djuren'],
  'ak7-tema-027|6': ['Historiens gång', 'Miljöns tillstånd', 'Matens ursprung'],
  'ak7-tema-033|2': ['Stora skogar', 'Öppna fält', 'Djupa vikar'],
  'ak6-tema-026|6': ['Pengar och lyx', 'Mat och dryck', 'Sömn och vila'],
  'ak10-tema-004-b|2': ['Öppen kritik som uttalas rakt ut', 'Synliga konflikter mellan grupper', 'Frivilliga val som var och en gör'],
  'akgy-tema-007|1': ['Göteborg på västkusten', 'Uppsala norr om Stockholm', 'Malmö längst i söder'],
  'ak7-tema-017|3': ['Ett filter som gör bilder suddiga', 'En typ av reklam som visas mellan inläggen', 'Ett sätt att rensa bort skräppost'],
  'ak7-tema-044|3': ['Endast hur det ser ut i nutiden', 'Bara landets ekonomi och handel', 'Endast teknik och instrument'],
  'ak7-tema-001|3': ['Att tävlingen är alldeles för kort för alla deltagare', 'Att den saknar publik i salongen numera', 'Att den bara sänds i radio och inte i tv'],
  'gy-etik-05|6': ['Att etik bara har betydelse i situationer när man är rädd', 'Att panik gör att allt plötsligt blir tillåtet', 'Att etik i grunden är samma sak som stress'],
  'akgy-tema-006|1': ['Astronomi och rymden', 'Jordbruk och skördar', 'Geologi och bergarter'],
  'gym-berattelse-val-004|5': ['Att eleven ska skriva så kort det bara går och utelämna detaljer', 'Att eleven ska undvika att ta ställning i frågan alls', 'Att eleven ska försöka gissa vad läraren själv tycker'],
  'ak10-ai-003|3': ['Bibliotekssystem för utlåning', 'Skolundervisning på distans', 'Väderrapporter i mobilen'],
  'ak6-tema-002|5': ['Hon målade om hela datasalen tillsammans med klassen', 'Hon gav alla elever nya surfplattor direkt', 'Hon tog bort allas spelappar från plattorna'],
  'ak1-miljo-04|3': ['En ballong att blåsa upp', 'En cykel att låna ut', 'En hund som skäller'],
  'ak2-gpt-002|2': ['Kall läsk', 'Kall saft', 'Varm mjölk'],
  'ak3-tema-022|1': ['Gräddglass', 'Läskedryck', 'Knäckebröd'],
  'ak3-tema-024|4': ['Bakar kakor i fabrikens kök', 'Kör buss mellan fabrikerna', 'Designar loggor och etiketter'],
  'ak6-tema-029|2': ['Med mat och godsaker', 'Med färger och tyger', 'Med lampor och ljud'],
  'ak7-tema-020|3': ['Om vädret på något sätt kan vara rättvist mot alla', 'Om maten i skolan ska vara gratis för alla elever', 'Om det ska vara sommarlov i juni eller i augusti'],

  // ── Sats 3 ──
  'ak8-tema-003-b|1': ['Enbart till arbete och möten', 'Bara till studier och läxor', 'Endast till spel och nöje'],
  'ak5-miljo-04|5': ['För att göra komposten mindre och lättare att sköta', 'För att kunna sluta odla grönsaker helt', 'För att kunna skylla ifrån sig på någon annan'],
  'ak4-geo-vulkan-001|2': ['Högt uppe i molnen', 'Långt ute i havet', 'Inuti stora träd'],
  'ak10-arsenal-005|5': ['Vädret på matchdagen', 'Tiden matchen spelas', 'Domarens beslut'],
  'gym-stress-studievanor-005|6': ['All stress är skadlig och bör undvikas helt oavsett situation och sammanhang i livet', 'Stress löses bäst genom att alltid plugga ensam utan avbrott från andra', 'Stress spelar ingen roll så länge man har bra anteckningar att läsa'],
  'ak1-vinter-102|5': ['Målar över den med färg', 'Kastar bort den i soporna', 'Bygger om den från början'],
  'ak1-samhalle-07|4': ['Han får en ny leksak av mamma', 'Det finns ingen väg i närheten', 'Det är natt och alla sover'],
  'ak7-tema-017|2': ['Regeringens regler för vad som får visas', 'Journalisters beslut om vad som är viktigt', 'Ett slumpmässigt urval bland alla inlägg'],
  'ak2-tema-005|5': ['De ville inte ha burken kvar hemma hos sig', 'De var rädda för att få skäll av sina föräldrar', 'Burken var alldeles för tung att bära hem'],
  'ak2-tema-008|3': ['I en bäck vid vägen', 'Uppe på ett lågt tak', 'Mitt ute på vägen'],
  'ak6-tema-030|6': ['Bilar och vagnar', 'Kläder och skor', 'Pengar och guld'],
  'akgy-mj-005|6': ['Hans barndom i Gary, Indiana', 'Hans ekonomi och kontrakt', 'Hans utbildning och skola'],
  'akgy-tema-012|4': ['Om solen över huvud taget bör utforskas', 'Om planeter borde byta namn med tiden', 'Om månen skulle kunna flyttas närmare'],
  'ak10-rosa-001|2': ['Lagar om utbildning för alla barn', 'Lagar om vad bussresor fick kosta', 'Lagar om vem som fick rösta i val'],
  'ak8-tema-015|4': ['Om djur kan tänka på samma sätt som vi', 'Om tidsresor bakåt i tiden är möjliga', 'Om en människa kan leva helt utan sömn'],
  'gym-berattelse-val-004|1': ['Hon vill inte skriva om det valda ämnet över huvud taget alls', 'Hon saknar helt material att arbeta vidare med i uppgiften', 'Hon har glömt datorn hemma och kan därför inte börja'],
  'ak7-tema-025|2': ['En enda person bestämmer', 'Ingen alls får rösta', 'Endast ledare bestämmer'],
  'akgy-sol-003|6': ['Solsystemet är helt isolerat från allt', 'Endast jorden är viktig att studera', 'Universum är enkelt att förstå'],
  'ak3-tema-005|5': ['En fotboll till klassen', 'En bok om idrott', 'En medalj i guld'],
  'ak7-tema-018|2': ['Han ringde till sin kompis Amir sent', 'Han skrev ner allt i en dagbok', 'Han tittade på film hela kvällen'],
  'akgy-tema-012|5': ['Den saknar helt skadlig strålning på ytan', 'Den ligger närmare jorden än vad månen gör', 'Den har ungefär samma syrehalt som jorden'],
  'gy-uni-004|6': ['Hur snabbt appen laddar på äldre telefoner med svag uppkoppling', 'Hur ofta plattformen byter grafisk design och färger', 'Hur många uppdrag som finns tillgängliga i appen per dag'],
  'ak3-samhalle-009|4': ['Att laga din cykel om den går sönder', 'Att måla om huset där du bor', 'Att träna din hund på helgen'],
  'ak4-historia-03|1': ['För att äta lunch tillsammans', 'För att ha idrottslektion där', 'För att spela spel med klassen'],
  'ak1-etik-10|3': ['En bil som kör på vägen', 'En snögubbe med hatt', 'En fisk i en liten sjö'],
  'akgy-tema-002|4': ['De är alldeles för tekniska', 'De kostar alldeles för lite', 'De saknar deltagare helt'],
  'ak3-vanskap-001|4': ['Rädd och osäker', 'Arg och besviken', 'Uttråkad och trött'],
  'ak4-miljo-04|2': ['Lergods', 'Ullgarn', 'Trävirke'],
  'ak5-natur-02|2': ['Koksalt', 'Syrgas', 'Kalksten'],
  'ak8-tema-018|3': ['Stark vind', 'Kraftig snö', 'Mycket regn'],
  'akgy-tema-011|2': ['Byggde de första raketerna', 'Upptäckte dvärgplaneten Pluto', 'Landade först på månen'],
  'gym-stad-transport-003|3': ['Att alla borde välja exakt samma väg för att spara både tid och energi', 'Att geografi i skolan borde handla enbart om trafik och vägar', 'Att resor främst handlar om att memorera kartor utantill'],
  'ak6-tema-023|6': ['Att Elvis bara var känd för sin frisyr och sina kläder och inte alls för musiken', 'Att filmindustrin aldrig tjänade några pengar alls på musiken', 'Att populärkulturen inte har förändrats något sedan 1950-talet'],
  'ak8-tema-002-b|5': ['Lägre löner för alla arbetare', 'Fler fabriker i varje stad', 'Mindre utbildning för barn'],
  'ak3-vanskap-016|3': ['Ett äpple och en banan', 'En varm stickad mössa', 'En bok från biblioteket'],
  'ak9-gpt-004|4': ['Hen får ont i händerna av att sitta vid datorn', 'Hen råkar radera hela videon utan att märka det', 'Hen tycker inte om hur den egna rösten låter'],
  'ak5-tema-017|3': ['En hemlig extra nivå som är svår att hitta', 'En ny sorts handkontroll till konsolen', 'En sorts musik som spelas i bakgrunden'],
  'ak7-musik-05|4': ['För att han har fått nya skor och nya kläder till lektionen', 'För att läraren står bredvid och tittar på', 'För att han vill imponera på Yara i klassen'],
  'akgy-borg-003|1': ['Hans familjeliv efter karriären', 'Hans tränare under uppväxten', 'Enbart hans vinster på banan'],
  'ak6-historia-03|4': ['För att ingen längre kan läsa gamla kartor', 'För att papperet har gulnat med åren', 'För att floden inte finns med på kartan'],
  'gy-historia-04|3': ['Biobiljetter och tider för föreställningar', 'Recept på soppa och andra maträtter', 'Resultat från lokala fotbollsmatcher'],
  'ak1-tema-018|6': ['Ganska liten', 'Alldeles rund', 'Väldigt snabb'],

  // ── Sats 4 ──
  'akgy-abba-004|1': ['En konsertturné genom Europa', 'Ett album med nya låtar', 'En dokumentär om gruppen'],
  'akgy-mj-002|2': ['En musikstudio i Kalifornien', 'En konsertturné i Amerika', 'Ett skivbolag han startade'],
  'akgy-sol-001|5': ['Solvinden', 'Solljuset', 'Lufttryck'],
  'gy-uni-003|4': ['För att laboratorieanalys är alldeles för dyr att genomföra', 'För att genetisk drift ökar antalet arter i området', 'För att artbestämning i grunden är godtycklig'],
  'ak4-vetenskap-03|3': ['För att vattnet stöter bort metall av sig självt', 'För att metall alltid flyter oavsett form', 'För att båtar är målade med flytande färg'],
  'akgy-abba-002|6': ['Musik handlar bara om teknik och inspelning', 'ABBA var oorganiserade i sitt arbete', 'Relationer är oviktiga för musiken'],
  'ak5-vanskap-01|5': ['För att texten innehåller flera rena sakfel om ämnet', 'För att Samira inte får skriva något alls', 'För att bilder alltid är viktigare än text'],
  'ak7-tema-047|6': ['Vargar är farliga för människor', 'Vargar hålls ofta som husdjur', 'Fjällen är kalla på vintern'],
  'gy-historia-04|6': ['Att historia alltid är enkel och tydlig att förstå och tolka', 'Att historia bara är fakta utan människor bakom', 'Att framtiden inte kan förstå hur nutiden såg ut'],
  'ak4-natur-skog-001|5': ['Bilar och cyklar', 'Glass och godis', 'Stolar och bord'],
  'ak6-vetenskap-04|6': ['Hon tycker att snö alltid är smutsig och inte går att undersöka', 'Hon vill aldrig testa något nytt i NO igen', 'Hon tycker att NO blivit tråkigare än förut'],
  'ak6-teknik-02|6': ['Att alla batterier fungerar precis likadant oavsett vilken sort det är', 'Att man aldrig ska använda en laddare till batterier', 'Att batterier är oviktiga eftersom de är så små'],
  'ak5-samhalle-04|5': ['För att det hålls ett prov om kommunen nästan varje vecka', 'För att kommunen bestämmer allt du gör i din vardag', 'För att kommunen alltid har rätt i sina beslut'],
  'ak6-samhalle-01|5': ['För att hon vill bestämma allting själv i hela gruppen', 'För att hon tycker att pilarna på tavlan är fula', 'För att hon inte vill att någon alls ska få lunch'],
  'ak7-etik-07|3': ['Att Noor borde byta till en annan skola', 'Att läraren måste läsa igenom allting', 'Att alla ska fortsätta dela som förut'],
  'gy-vetenskap-01|2': ['Att alla experiment i grunden är oetiska att genomföra', 'Att vetenskapliga studier alltid är dyra', 'Att rökning och stress hänger ihop med varandra'],
  'akgy-tema-012|6': ['Rymdresor är i praktiken omöjliga att genomföra för människor', 'Mars kommer snart att vara fullt befolkad av människor', 'Månen är viktigare att utforska än jorden själv'],
  'ak6-etik-04|2': ['Ingen bryr sig om vad du säger', 'Jag hatar dig och din åsikt', 'Du är dum som tycker så'],
  'akgy-demo-001|2': ['Kungens absoluta och odelade makt', 'Religiös styrning av samhället', 'Den allmänna viljans företräde'],
  'ak10-ai-002|1': ['Kreativa yrken inom konst', 'Sociala yrken inom vården', 'Chefspositioner i företag'],
  'ak5-vanskap-01|4': ['För att Theo ska få bestämma allting själv', 'För att göra arbetet svårare för alla', 'För att slippa presentera inför klassen'],
  'akgy-sol-001|2': ['När planeter exploderar och faller sönder', 'När ljus reflekteras mot en yta', 'När gas försvinner ut i rymden'],
  'ak8-tema-015|2': ['Att bara utbildade forskare kan svara på frågan', 'Att ljudvågor egentligen inte finns alls', 'Att träd aldrig faller omkull i en skog'],
  'akgy-tema-005|2': ['Som ett sportevenemang med publik', 'Som en reform av hela skolsystemet', 'Som en teknisk innovation inom ljud'],
  'ak4-tema-009|1': ['Bomull och andra lätta gaser', 'Damm och sand från marken', 'Rök från fabriker och bilar'],
  'ak7-tema-001|4': ['Att intresset för tävlingen minskat för varje år', 'Att det numera bara är unga som tittar', 'Att juryn numera bestämmer allting själv'],
  'ak7-tema-020|5': ['Att alla människor borde tjäna exakt lika mycket', 'Att Aristoteles hade fel om alltihop', 'Att människor inte borde få arbeta alls'],
  'ak3-etik-007|3': ['En karta över stan', 'Ett äpple i en påse', 'En liten leksaksbil'],
  'ak7-sport-05|3': ['Du kommer för sent!', 'Gå hem nu direkt!', 'Stanna där du är!'],
  'ak4-tema-004|3': ['Rymden och främmande planeter', 'Matlagning och gamla recept', 'Gamla sagor från förr'],
  'ak5-vanskap-02|6': ['Att vänskap bara handlar om att ha roligt tillsammans', 'Att man helst ska spela ensam för att slippa bråk', 'Att man alltid måste vinna för att bli respekterad'],
  'ak5-teknik-03|6': ['Att servern i själva verket finns inuti din egen telefon', 'Att man aldrig kan lösa problem med internet själv', 'Att internet i grunden fungerar som ren magi'],
  'ak1-musik-05|6': ['Att orden inte behövs när man sjunger', 'Att det gäller att sjunga allra högst', 'Att det är bäst att aldrig sjunga alls'],
  'ak6-vetenskap-05|4': ['För att raketen ska se snyggare ut när den flyger', 'För att hon gärna vill ha ännu fler läxor', 'För att hon inte tycker om att jobba med Abbas'],
  'ak1-vetenskap-09|6': ['Äta godis ute i solen', 'Sova länge på dagen', 'Gömma solen bakom moln'],
  'ak7-tema-041|5': ['För att kunna bygga fler hus vid vatten', 'För att dela teknik mellan företag', 'För att kunna minska mängden regn'],
  'ak8-tema-024|1': ['Hur varor transporterades', 'Hur klimatet förändrades', 'Hur jordbruket sköttes'],
  'ak6-sport-13|6': ['För att hon aldrig blev svettig en enda gång under passet', 'För att Diego gav henne ett pris efteråt', 'För att Jonas avbröt hela passet tidigt'],
  'gy-etik-05|5': ['Att de framför allt vill få texten att bli längre', 'Att de vill imponera med svåra facktermer', 'Att de vill slippa använda källor helt och hållet'],
  'ak1-historia-07|6': ['Att ingen egentligen behöver kunna skriva', 'Att det bara är vuxna som skriver', 'Att pennor är en helt ny uppfinning'],
  'ak7-tema-025|5': ['Bara några få deltar', 'Ingen alls deltar', 'Endast vissa får delta'],
  'ak7-tema-034|3': ['Mer energi i kroppen', 'Bättre minne över tid', 'Djupare sömn på natten'],
  'ak3-skola-013|4': ['Man behöver då aldrig vila under dagen', 'Man lär sig allting mycket snabbare', 'Man blir alltid starkare av det'],
  'gy-etik-05|4': ['För att hon inte vill bli klar med uppgiften i tid', 'För att hon inte bryr sig om vilket betyg hon får', 'För att hon själv tycker att plagiat är helt okej'],
  'ak7-historia-03|3': ['Te med citron och honung', 'Kall mjölk i ett glas', 'Varm choklad med grädde'],

  // ── Sats 5 ──
  'ak10-rosa-002|5': ['Endast valda politiker', 'Endast unga studenter', 'Endast domare i rätten'],
  'ak9-gpt-005|5': ['Att man framför allt ska räkna på pengarna', 'Att man ska sluta prata om jobb helt och hållet', 'Att man ska straffa alla lika hårt oavsett skäl'],
  'ak8-tema-025|1': ['Hjärnan krymper med tiden', 'Blodflödet till hjärnan minskar', 'Gamla minnen försvinner helt'],
  'ak3-existens-010|3': ['En lampa i ett hus långt bort', 'En flygplats utanför staden', 'En billykta på en väg'],
  'gy-historia-04|1': ['På vinden i skolans gamla byggnad', 'I ett köpcentrum mitt i staden', 'I caféet inne på biblioteket'],
  'ak7-historia-03|5': ['Att äga fler saker än de flesta andra', 'Att vara berömd i hela staden', 'Att vara bäst i allting man gör'],
  'gy-teknik-02|6': ['Att AI gör det helt omöjligt att skriva någonting själv', 'Att alla prov automatiskt blir lättare med AI', 'Att lärare slutar undervisa när AI införs'],
  'ak10-arsenal-004|3': ['Färre lag spelar i den högsta ligan', 'Reglerna har ändrats flera gånger', 'Matcherna är kortare än förut'],
  'gy-uni-005|5': ['Att manipulation omöjliggörs helt så snart koden är offentlig', 'Att insyn alltid gör modeller mer rättvisa i praktiken', 'Att integritet bara är relevant i mycket små system'],
  'ak6-teknik-04|3': ['En grön lampa skulle lysa med ett fast sken', 'En text skulle skrivas ut på skärmen', 'Datorn skulle stängas av helt direkt'],
  'ak6-musik-05|5': ['För att man nästan alltid sjunger tyst för sig själv', 'För att hjärnan aldrig tänker under promenader', 'För att benens rörelser skapar musik'],
  'ak6-tema-024|3': ['Elvis egen musiklärare under skoltiden i Memphis', 'En radiovärd som bara spelade countrymusik', 'Elvis mormor som sjöng i kyrkans kör'],
  'ak5-teknik-03|4': ['För att wifi-signalen inte ska bli för varm', 'För att det ska bli svårare för andra att förstå', 'För att servern ska hinna vila mellan gångerna'],
  'akgy-tema-010|6': ['Solen är den enda himlakropp som har betydelse', 'Alla planeter är uppbyggda på precis samma sätt', 'Rymdsonder har helt ersatt astronomin som vetenskap'],
  'ak6-tema-025|6': ['Att Elvis aldrig spelade in någon av sina låtar i en studio', 'Att modern inspelningsteknik gör all musik sämre än förr', 'Att Sun Records var den överlägset största studion i hela världen'],
  'ak1-etik-10|4': ['Hon vill snabbt hem till mamma', 'Hon blir arg på sin kompis', 'Hon tappar boken i golvet'],
  'ak1-etik-10|6': ['Att gömma pennor i väskan', 'Att det är fel att rita', 'Att aldrig fråga om lov'],
  'ak1-musik-04|6': ['Ledsen och alldeles ensam', 'Arg och väldigt trött', 'Rädd och genomfrusen'],
  'ak1-teknik-03|3': ['Ritar med färgkritor', 'Skriver ett prov', 'Sover en liten stund'],
  'ak1-tema-010|3': ['Leonard', 'Miriam', 'Kimberly'],
  'ak1-tema-027|4': ['Fiskar i sjön', 'Bilar på vägen', 'Berg i fjärran'],
  'ak2-historia-07|2': ['Skriva långa texter på dator', 'Åka tunnelbana till stan', 'Spela tv-spel på kvällen'],
  'ak2-tema-003|2': ['Godis, glass och en läsk', 'Kläder, skor och strumpor', 'Böcker, pennor och sudd'],
  'ak3-tema-014|6': ['Att alla sjöar alltid är stora och djupa', 'Att man alltid ska undvika att gå över broar', 'Att kartor inte behövs när man är i en stad'],
  'ak5-vanskap-01|3': ['Microsoft Word', 'Microsoft Teams', 'Paint 3D'],
  'ak6-etik-04|5': ['För att vuxna alltid vill höra precis allting', 'För att man då slipper ta eget ansvar', 'För att det inte finns några regler alls'],
  'ak6-tema-011|3': ['För att domaren måste springa betydligt mer', 'För att bollen måste vara helt ny', 'För att man bara får passa bakåt'],
  'ak6-tema-021|6': ['Att gospel och blues försvann helt så snart rock och roll slog igenom', 'Att Elvis själv uppfann all den musik som finns i dag', 'Att rock och roll bara var populärt i en enda amerikansk stad'],
  'ak9-tema-020|3': ['För att kopior nästan alltid är tillverkade av guld', 'För att äkta varor aldrig säljs på nätet', 'För att kopior inte påverkar någon alls'],
  'ak7-tema-029|6': ['Att historien är helt oviktig att läsa', 'Att all teknik i grunden är farlig', 'Att allting blir bättre med tiden'],
  'ak8-tema-004-b|1': ['Regler som gäller för skolor', 'Lagar som styr företag', 'Regler för att få resa'],
  'ak8-tema-004-b|4': ['Reser runt i världen', 'Bygger hus åt behövande', 'Skapar spel till barn'],
  'ak8-tema-022|1': ['Naturliga skiften i årstiderna', 'Mängden regn och snö per år', 'Solens rörelse över himlen'],
  'ak8-tema-028|6': ['Orolig och rädd', 'Arg och besviken', 'Trött och less'],
  'ak8-tema-029|5': ['Yrkesskolor', 'Storföretag', 'Sparbanker'],
  'ak8-tema-030|5': ['Endast kroppsvikten', 'Hårets växtkraft', 'Synen på avstånd'],
  'ak8-tema-004-c|5': ['Endast mycket mat', 'Stora och tomma hus', 'Höga ljud omkring sig'],
  'ak6-tema-030|1': ['Endast till lek', 'Matlagning i hemmet', 'Musik och underhållning'],
  'ak10-tema-003-b|1': ['En lokal lag som gäller i vissa länder', 'En plan för hur skolor ska arbeta', 'En ekonomisk strategi för familjer'],
  'akgy-mj-002|1': ['Hans musikstil och röst', 'Hans många turnéer', 'Hans samarbeten med andra'],
  'akgy-tema-002|3': ['Lägre energiförbrukning i alla hus', 'Fler höghus i stadens centrum', 'Fler privata vägar för bilar'],
  'ak6-etik-04|6': ['Att ingen längre vågar prata alls i gruppen', 'Att man alltid måste hålla ett tal inför alla', 'Att elaka kommentarer blir ännu vanligare'],
  'ak9-tema-020|1': ['Om Armani bara tillverkar sportkläder numera', 'Om alla kopior är helt lagliga i Sverige', 'Om reklam alltid säger hela sanningen'],
  'gy-samhalle-03|1': ['Att uppmärksamhet mäts i betyg och antal poäng', 'Att alla inlägg visas i strikt tidsordning', 'Att pengar inte längre behövs på plattformar'],
  'ak7-tema-002|1': ['För att kunna minska antalet bidrag i finalen', 'För att helt undvika publikröstning', 'För att göra hela tävlingen kortare'],
  'ak1-etik-12|4': ['För att lektionen är väldigt rolig just då', 'För att suddgummit redan är trasigt', 'För att hon plötsligt blir hungrig'],
  'ak5-miljo-04|4': ['För att all plast ska försvinna av sig själv', 'För att det ska bli mer mat i komposten', 'För att komposten ska få en blå färg'],
  'ak9-tema-008|4': ['Att helt förbjuda handel på nätet', 'Att flytta alla invånare till städer', 'Att stänga alla butiker på landet'],
  'akgy-tema-010|1': ['Att stjärnor förlorar massa med tiden', 'Att planeter byter bana runt solen', 'Att gas omvandlas till synligt ljus'],
  'ak1-natur-09|4': ['För att solen lyser alldeles för starkt', 'För att allt gräs har försvunnit', 'För att pölarna är målade på marken'],
  'gy-etik-05|3': ['Att byta ämne helt och börja om', 'Att radera hela arbetet och sluta', 'Att lämna in uppgiften för sent'],
  'ak6-vanskap-01|6': ['Att man aldrig borde byta till en annan skola', 'Att vänskap alltid börjar med att ge en present', 'Att man måste vara bäst i allting för att få några vänner'],

  // ── Sats 6 ──
  'ak1-teknik-03|5': ['Hon kastar bort alltsammans', 'Hon gömmer undan batteriet', 'Hon ropar högt på hjälp'],
  'ak7-tema-044|6': ['Musik är svårt att lära sig', 'Musik är oviktig för de flesta', 'Musik är bara en hobby'],
  'ak8-tema-014|5': ['Alla tyckte att det var en riktigt bra idé direkt', 'Ingen märkte någon skillnad alls under dagen', 'Alla elever lämnade skolan i protest mot det'],
  'gy-teknik-02|5': ['För att alla källor på nätet i grunden är likadana', 'För att språk i sig alltid ljuger om fakta', 'För att hallucineringar sällan upptäcks alls'],
  'ak5-natur-02|5': ['För att karotenoiderna försvinner helt på hösten', 'För att trädet byter art från år till år', 'För att löven alltid målas om av naturen'],
  'ak6-historia-03|5': ['Att marken alltid är mjuk just på det stället', 'Att det nyligen har varit en jordbävning där', 'Att någon har grävt en pool på platsen'],
  'ak4-001|6': ['De var trötta efter dagen', 'Det började regna kraftigt', 'De var hungriga och sugna'],
  'ak10-tema-005-b|2': ['Att bestämma allting själva', 'Att slippa alla regler', 'Att välja sina egna betyg'],
  'ak6-tema-017|4': ['Genom att Åland återigen blev en del av det ryska riket', 'Genom att Sverige tog över öarna helt utan några villkor alls', 'Genom att Åland flyttades längre bort ut i Östersjön'],
  'ak10-rosa-005|5': ['Endast den enskilda individen', 'Endast lagar och regler', 'Endast historisk forskning'],
  'ak6-teknik-04|5': ['Att man helst ska gömma sina misstag', 'Att Noor nästan alltid har fel', 'Att man aldrig borde programmera'],
  'gym-berattelse-val-004|6': ['Att Lea helst vill hoppa över hela resten av terminen och börja om från början', 'Att Lea tror att dagen faktiskt går att spola tillbaka igen', 'Att Lea planerar att skriva två uppsatser och lämna in båda två'],
  'gy-historia-04|4': ['För att hon verkligen tycker om lukten av gammalt papper', 'För att hon hittar en hemlig kod i pärmen', 'För att arkivarien berättar en spökhistoria'],
  'ak9-tema-007|5': ['Att systemen förvaras i hemliga lokaler långt under jord', 'Att användare inte får öppna sina egna datorer', 'Att AI-system alltid är svarta till färgen'],
  'ak6-tema-005|4': ['För att göra vattnet ännu saltare än det redan är', 'För att locka fler turister till ön om somrarna', 'För att membranen ska hålla längre i kyla'],
  'ak6-samhalle-01|6': ['Att det bara är vuxna som kan ändra på saker i skolan', 'Att elevrådet alltid bestämmer allting direkt', 'Att problem aldrig går att lösa i en skola'],
  'ak1-sport-06|2': ['Att gå hem och vila', 'Att sitta ner en stund', 'Att ropa högt på slutet'],
  'ak5-natur-01|1': ['Mindre sol på dagarna', 'Mer snö under vintern', 'Kortare dagar på hösten'],
  'ak8-tema-020|1': ['Bara studier i skolan', 'Endast sport och träning', 'Endast arbete och möten'],
  'ak7-tema-035|2': ['Endast god bollteknik', 'Tur och slump i matchen', 'Endast fysisk styrka'],
  'ak4-vanskap-01|3': ['Gömmer repet i väskan', 'Börjar rita på asfalten', 'Går hem tidigare än vanligt'],
  'ak9-tema-019|4': ['Att människor kan känna verklig inspiration', 'Att personalen bemöter olika kunder olika', 'Att en kampanj bygger upp en dröm hos köparen'],
  'ak4-001|4': ['Han hade glömt bort var han lagt den', 'Han var rädd för att tjuvar skulle ta den', 'Han ville stjäla den från någon annan'],
  'ak10-rosa-002|6': ['Det räcker med en enda modig person', 'Medier spelar ingen roll alls', 'Protester fungerar aldrig i praktiken'],
  'ak5-teknik-03|3': ['I stora ballonger', 'I papper och brev', 'I träpinnar i marken'],
  'ak6-miljo-02|2': ['Utbrott från vulkaner', 'Löv som faller från träd', 'Berg som vittrar sönder'],
  'ak7-tema-003|2': ['Enbart countrylåtar från södern', 'En tyst och akustisk stil rakt igenom', 'Barnvisor och enkla melodier'],
  'akgy-abba-002|1': ['Agnetha och Benny samt Björn och Anni-Frid', 'Björn och Anni-Frid samt Benny och Agnetha', 'Alla fyra var gifta med varandra'],
  'gy-uni-003|5': ['Att skalan helt saknar betydelse när ekologiska data analyseras', 'Att arterna medvetet flyttar på sig för att undvika att bli inventerade', 'Att alla mätningar i naturen alltid är felaktiga på något sätt'],
  'ak2-tema-005|3': ['Sand och små snäckor från havsstranden', 'Pengar och godis i ett litet paket', 'En nyckel och en ring av silver'],
  'ak7-etik-07|1': ['En läxa som ska lämnas in nästa vecka', 'Ett schema för hela veckan', 'En bild på någons hund'],
  'gy-etik-05|1': ['Fotosyntesens kemi hos gröna växter', 'Sveriges historia under medeltiden', 'Hur man bygger en hållbar bro'],
  'gy-uni-005|2': ['Att ansvaret tvärtom blir mycket tydligare när fler aktörer deltar', 'Att ansvar bara gäller inom den offentliga sektorn', 'Att ansvaret till slut koncentreras till en enda person'],
  'ak1-tema-016|4': ['Uppe på husets tak', 'Precis vid dörren', 'Inne i en buske'],
  'ak2-natur-02|4': ['För att den inte gillar nötter alls', 'För att den vill lura barnen i parken', 'För att den vill hålla skogen städad'],
  'ak4-teknik-04|5': ['För att kablarna ska kunna bli kortare', 'För att broar alltid måste vara små', 'För att slippa rita hela ritningen'],
  'ak6-vanskap-01|4': ['För att hon tycker mycket om att simma', 'För att hallen är kall på morgnarna', 'För att golvet är blött och halt'],
  'ak7-tema-013|3': ['För att bevisa för alla andra att hen kan bryta mot regler bäst av alla', 'För att hitta en genväg till matsalen utan att komma för sent', 'För att gömma ett föremål innan en lärare hinner upptäcka det'],
  'ak2-tema-003|3': ['Pengar till glass', 'En leksak var', 'Äpplen i en påse'],
  'ak4-historia-03|3': ['Ett matteprov om gamla tal', 'En affisch om vilda djur', 'En låt om skolans historia'],
  'ak9-lotr-002|6': ['Ringens tekniska egenskaper och kraft', 'De stora slagen och striderna', 'Midgårds geografi och kartor'],
  'gy-teknik-02|4': ['För att internetuppkopplingen nästan alltid är för långsam', 'För att den alltid prioriterar korta svar först', 'För att den väljer att ogilla vissa människor'],
  'ak7-tema-042|5': ['För mycket kunskap hos alla', 'För många val varje år', 'Att alldeles alla röstar'],
  'ak8-tema-025|3': ['Musklerna i kroppen', 'Synen och hörseln', 'Hjärtats rytm'],
  'ak8-tema-017|3': ['Skapar konflikter mellan folk', 'Bygger hus och vägar', 'Bestämmer landets lagar'],
  'ak1-musik-05|1': ['Sover en stund', 'Badar i bassäng', 'Springer ute'],
  'ak1-samhalle-buss-001|5': ['Inne i skogen', 'Inuti en bil', 'Uppe på taket'],
  'ak1-tema-027|1': ['Inne i skolan', 'Inne i skogen', 'Inne i huset'],
  'ak1-tema-037|1': ['Inne i skogen', 'Inne i huset', 'Inne i skolan'],
  'ak4-sport-05|6': ['Att mod är att skrika allra högst av alla', 'Att mod är att låta bli att spela alls', 'Att mod bara är att skjuta själv på mål'],
  'ak1-tema-047|1': ['Inne i skogen', 'Inne i huset', 'Inne i skolan'],
  'ak6-tema-030|2': ['Stor snabbhet', 'Mycket pengar', 'Fysisk styrka'],
};

const libraryPath = path.join(__dirname, '../public/data/library.json');
const lib = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));

let n = 0;
const problem = [];

lib.forEach(t => (t.questions || []).forEach((q, i) => {
  const nya = NYA_DISTRAKTORER[`${t.id}|${i + 1}`];
  if (!nya) return;

  if (nya.length !== 3) {
    problem.push(`${t.id} f${i + 1}: ${nya.length} distraktorer (ska vara 3)`);
    return;
  }
  const facit = q.options[q.correct];
  if (!facit) {
    problem.push(`${t.id} f${i + 1}: hittar inget facit`);
    return;
  }

  // Rotera facitpositionen så att den inte alltid hamnar likadant
  const pos = n % 4;
  const options = [...nya];
  options.splice(pos, 0, facit);

  q.options = options;
  q.correct = pos;
  n++;
}));

if (problem.length) {
  problem.forEach(p => console.error('FEL: ' + p));
  process.exit(1);
}

fs.writeFileSync(libraryPath, JSON.stringify(lib, null, 2) + '\n', 'utf8');
console.log(`Skrev om distraktorerna i ${n} frågor.`);
