// Bildkatalog för Läsjakten.
//
// Varje post beskriver vad bilden FAKTISKT föreställer. Beskrivningarna är
// gjorda genom att hämta ner och titta på varje bild, inte genom att lita på
// vad URL:en tidigare användes till. Flera bilder i biblioteket visade sig
// föreställa något helt annat än den text de satt på (en elefant på
// "Den hemliga hyllan på biblioteket", Lego-figurer på "Kaninen i snön"),
// och en av tio URL:er hade dessutom slutat fungera hos Unsplash.
//
// kw = nyckelord som matchas mot textens titel, tema, genre och brödtext.
// Poängsättningen sker i tilldela-bilder.cjs.

const BAS = 'https://images.unsplash.com/';
const SUFFIX = '?w=600&h=400&fit=crop';

const url = (id) => BAS + id + SUFFIX;

// ---------------------------------------------------------------------------
// Katalogen. Alla poster är kontrollerade mot Unsplash (HTTP 200) och
// motivbeskrivna efter visuell granskning.
// ---------------------------------------------------------------------------
const KATALOG = [
  // --- Djur ---------------------------------------------------------------
  { id: 'photo-1514888286974-6c03e2ca1dba', desc: 'svartvit katt mot grön vägg', kw: ['katt', 'kattunge', 'mjau'] },
  { id: 'photo-1574158622682-e40e69881006', desc: 'kattansikte mot blå bakgrund', kw: ['katt', 'kattunge'] },
  { id: 'photo-1495360010541-f48722b34f7d', desc: 'katt sitter på trappa', kw: ['katt', 'trappa'] },
  { id: 'photo-1518791841217-8f162f1e1131', desc: 'tabbykatt på soffa', kw: ['katt', 'hemma'] },
  { id: 'photo-1526336024174-e58f5cdd8e13', desc: 'katt med fjäril på nosen', kw: ['katt', 'fjäril'] },
  { id: 'photo-1541781774459-bb2af2f05b55', desc: 'katt sover under täcke', kw: ['sömn', 'sova', 'dröm', 'natt', 'trött', 'vila'] },
  { id: 'photo-1587300003388-59208cc962cb', desc: 'glad hund vid strand', kw: ['hund', 'valp', 'promenad'] },
  { id: 'photo-1444212477490-ca407925329e', desc: 'tre valpar på grusväg', kw: ['valp', 'hund'] },
  { id: 'photo-1560807707-8cc77767d783', desc: 'valp som tittar upp', kw: ['valp', 'hund'] },
  { id: 'photo-1548199973-03cce0bbc87b', desc: 'två hundar springer', kw: ['hund', 'springer', 'rastar'] },
  { id: 'photo-1450778869180-41d0601e046e', desc: 'katt och hund ligger tillsammans', kw: ['husdjur', 'hund', 'katt', 'vän'] },
  { id: 'photo-1425082661705-1834bfd09dca', desc: 'hamster', kw: ['hamster', 'gnagare', 'smådjur', 'mus'] },
  { id: 'photo-1441057206919-63d19fac2369', desc: 'två pingviner på klippa', kw: ['pingvin', 'antarktis', 'is'] },
  { id: 'photo-1547721064-da6cfb341d50', desc: 'giraff', kw: ['giraff', 'savann', 'afrika', 'zoo'] },
  { id: 'photo-1557050543-4d5f4e07ef46', desc: 'elefant på savann', kw: ['elefant', 'savann', 'afrika'] },
  { id: 'photo-1519003300449-424ad0405076', desc: 'koala i träd', kw: ['koala', 'australien'] },
  { id: 'photo-1516467508483-a7212febe31a', desc: 'griskulting i halm', kw: ['gris', 'bondgård', 'lantbruk'] },
  { id: 'photo-1454179083322-198bb4daae41', desc: 'kalvar i ladugård', kw: ['ko', 'kalv', 'bondgård', 'lantbruk', 'mjölk'] },
  { id: 'photo-1444464666168-49d633b86797', desc: 'kungsfiskare på gren', kw: ['fågel', 'fåglar', 'näbb', 'fjäder'] },
  { id: 'photo-1522926193341-e9ffd686c60f', desc: 'rödhake som sjunger på gren', kw: ['fågel', 'fåglar', 'flyttar', 'sjunger'] },
  { id: 'photo-1552728089-57bdde30beb3', desc: 'grön papegoja', kw: ['fågel', 'papegoja', 'tropisk'] },
  { id: 'photo-1450052590821-8bf91254a353', desc: 'brun häst på kulle', kw: ['häst', 'ponny'] },
  { id: 'photo-1534773728080-33d31da27ae5', desc: 'häst som betar', kw: ['häst', 'bete', 'hage'] },
  { id: 'photo-1553284965-83fd3e82fa5a', desc: 'vit häst i galopp', kw: ['häst', 'galopp', 'rida', 'ridning'] },
  { id: 'photo-1598974357801-cbca100e65d3', desc: 'hästhuvud i närbild', kw: ['häst', 'stall', 'man'] },

  // --- Natur, skog, väder -------------------------------------------------
  { id: 'photo-1448375240586-882707db888b', desc: 'dimmig grön granskog', kw: ['skog', 'träd', 'granar', 'stig'] },
  { id: 'photo-1476231682828-37e571bc172f', desc: 'skog uppifrån med slingrande väg', kw: ['skog', 'natur', 'träd'] },
  { id: 'photo-1523712999610-f77fbcfc3843', desc: 'höstskog med solstrålar', kw: ['höst', 'skog', 'löv', 'lövet'] },
  { id: 'photo-1500673922987-e212871fec22', desc: 'dimmig skogsväg med varmt ljus', kw: ['skog', 'stig', 'dimma', 'kväll'] },
  { id: 'photo-1518495973542-4542c06a5843', desc: 'sol genom stor trädkrona', kw: ['träd', 'krona', 'sommar', 'skugga'] },
  { id: 'photo-1502082553048-f009c37129b9', desc: 'stort ensamt lövträd på äng', kw: ['träd', 'äng', 'ek', 'äppelträd'] },
  { id: 'photo-1497436072909-60f360e1d4b1', desc: 'skog vid turkos sjö uppifrån', kw: ['sjö', 'skog', 'vatten', 'natur'] },
  { id: 'photo-1493246507139-91e8fad9978e', desc: 'bergssjö med speglande toppar', kw: ['sjö', 'berg', 'fjäll', 'spegling'] },
  { id: 'photo-1509023464722-18d996393ca8', desc: 'vulkankägla vid sjö i dis', kw: ['vulkan', 'berg', 'dimma', 'sjö'] },
  { id: 'photo-1508739773434-c26b3d09e071', desc: 'karg bergskedja i rött ljus', kw: ['berg', 'fjäll', 'klippa', 'vulkan', 'lava'] },
  { id: 'photo-1444927714506-8492d94b4e3d', desc: 'blå bergsryggar i dis', kw: ['dimma', 'berg', 'fjäll', 'horisont'] },
  { id: 'photo-1441716844725-09cedc13a4e7', desc: 'person vid spegelblank fjällsjö', kw: ['fjäll', 'sjö', 'vandring', 'natur'] },
  { id: 'photo-1470071459604-3b5ec3a7fe05', desc: 'grönt bergslandskap med moln och sol', kw: ['landskap', 'moln', 'natur', 'kretslopp'] },
  { id: 'photo-1418985991508-e47386d96a71', desc: 'snötäckt fjällandskap', kw: ['snö', 'vinter', 'fjäll', 'kyla'] },
  { id: 'photo-1491002052546-bf38f186af56', desc: 'snöig skog vid frusen sjö', kw: ['snö', 'vinter', 'is', 'frost', 'snögubbe'] },
  { id: 'photo-1516466723877-e4ec1d736c8a', desc: 'norrsken över snölandskap med hundspann', kw: ['norrsken', 'snö', 'spår', 'vinter'] },
  { id: 'photo-1517411032315-54ef2cb783bb', desc: 'norrsken över fjäll', kw: ['norrsken', 'stjärn', 'natthimmel', 'nord'] },
  { id: 'photo-1519681393784-d120267933ba', desc: 'stjärnhimmel och vintergatan över berg', kw: ['stjärn', 'natthimmel', 'universum', 'galax'] },
  { id: 'photo-1515694346937-94d85e41e6f0', desc: 'regndroppar på fönsterruta', kw: ['regn', 'fönster', 'droppar', 'väder'] },
  { id: 'photo-1428592953211-077101b2021b', desc: 'regn som faller på vattenyta', kw: ['regn', 'pöl', 'vatten', 'skyfall'] },
  { id: 'photo-1518173946687-a4c8892bbd9f', desc: 'gröna löv i regn', kw: ['regn', 'löv', 'sommarregn', 'blad'] },
  { id: 'photo-1548839140-29a749e1cf4d', desc: 'vatten som hälls i ett glas', kw: ['vatten', 'dricka', 'kran', 'glas'] },
  { id: 'photo-1471879832106-c7ab9e0cee23', desc: 'vattendroppe på grässtrå', kw: ['droppe', 'dagg', 'gräs', 'morgon'] },
  { id: 'photo-1490750967868-88aa4486c946', desc: 'gula vallmoblommor mot blå himmel', kw: ['blomma', 'blommor', 'vår', 'frö'] },
  { id: 'photo-1465146344425-f00d5f5c8f07', desc: 'vallmofält i sommarljus', kw: ['äng', 'blommor', 'sommar', 'fält'] },
  { id: 'photo-1416879595882-3373a0480b5b', desc: 'planteringsskopa med jord och frön', kw: ['frö', 'jord', 'plantera', 'odla', 'växt', 'fotosyntes'] },
  { id: 'photo-1592841200221-a6898f307baa', desc: 'tomater som mognar på planta', kw: ['tomat', 'odling', 'trädgård', 'skörd'] },
  { id: 'photo-1558642452-9d2a7deb7f62', desc: 'honung som hälls i en burk', kw: ['honung', 'bi', 'bin', 'pollinatör', 'pollinering', 'humla', 'biodling'] },
  { id: 'photo-1476611338391-6f395a0ebc7b', desc: 'silhuetter mot solnedgång bland träd', kw: ['solnedgång', 'utflykt', 'kväll', 'lek'] },
  { id: 'photo-1507525428034-b723cf961d3e', desc: 'strand med vågor i solnedgång', kw: ['strand', 'hav', 'bad', 'sommar', 'sand'] },
  { id: 'photo-1505142468610-359e7d316be0', desc: 'hav och vågor sett uppifrån', kw: ['hav', 'våg', 'kust', 'ocean'] },
  { id: 'photo-1547036967-23d11aacaee0', desc: 'klippkust med turkost vatten uppifrån', kw: ['kust', 'skärgård', 'ö', 'öar', 'klipp', 'hav'] },
  { id: 'photo-1544551763-46a013bb70d5', desc: 'dykare bland ett stim gula fiskar', kw: ['hav', 'fisk', 'dyk', 'korall', 'undervatten'] },
  { id: 'photo-1507003211169-0a1dd7228f2d', desc: 'porträtt av leende ung man', kw: ['porträtt', 'ansikte', 'leende'] },

  // --- Rymd och vetenskap -------------------------------------------------
  { id: 'photo-1462332420958-a05d1e002413', desc: 'färgstark nebulosa', kw: ['rymd', 'planet', 'solsystem', 'stjärna', 'universum', 'galax'] },
  { id: 'photo-1451187580459-43490279c0fa', desc: 'jorden från rymden med stadsljus', kw: ['jorden', 'rymd', 'global', 'internet', 'nätverk', 'värld'] },
  { id: 'photo-1532094349884-543bc11b234d', desc: 'laboratorieglas på bänk', kw: ['experiment', 'labb', 'kemi', 'prova', 'vetenskap'] },
  { id: 'photo-1518152006812-edab29b069ac', desc: 'rad av mikroskop i sal', kw: ['mikroskop', 'labb', 'forskning', 'cell'] },
  { id: 'photo-1584118624012-df056829fbd0', desc: 'modell av virus', kw: ['virus', 'bakterie', 'vaccin', 'smitta', 'immunförsvar', 'antibiotika'] },
  { id: 'photo-1559757175-5700dde675bc', desc: 'modell av hjärna och nervcell', kw: ['hjärna', 'nerv', 'minne', 'tanke', 'kropp'] },
  { id: 'photo-1507413245164-6160d8298b31', desc: 'plasmaklot med elektriska bågar', kw: ['energi', 'el', 'ström', 'magnet', 'fysik'] },
  { id: 'photo-1509228468518-180dd4864904', desc: 'handskrivna matematiska ekvationer', kw: ['matematik', 'räkna', 'formel', 'statistik', 'siffror'] },

  // --- Skola och läsning --------------------------------------------------
  { id: 'photo-1580582932707-520aed937b7b', desc: 'tomt klassrum med svarta tavlan', kw: ['klassrum', 'skola', 'lektion', 'tavlan'] },
  { id: 'photo-1509062522246-3755977927d7', desc: 'klassrum med elever och lärare', kw: ['klassrum', 'lärare', 'elever', 'lektion', 'skola', 'klassen'] },
  { id: 'photo-1503676260728-1c00da094a0b', desc: 'böcker med äpple och ABC-klossar', kw: ['läxa', 'skola', 'lära', 'bokstav', 'abc'] },
  { id: 'photo-1503676382389-4809596d5290', desc: 'elev med böcker och ryggsäck', kw: ['elev', 'ryggsäck', 'skolväg', 'skoldag'] },
  { id: 'photo-1546410531-bb4caa6b424d', desc: 'skylt formad som penna med texten Love to learn', kw: ['lära', 'kunskap', 'motivation', 'plugga'] },
  { id: 'photo-1513542789411-b6a5d4f31634', desc: 'färgpennor i rad', kw: ['penna', 'pennor', 'rita', 'sudd', 'låna'] },
  { id: 'photo-1503454537195-1dcabb73ffb9', desc: 'barn med målarfärg i ansiktet', kw: ['måla', 'färg', 'skapa', 'pyssel', 'show'] },
  { id: 'photo-1517842645767-c639042777db', desc: 'anteckningsbok med reservoarpenna och glasögon', kw: ['skriva', 'anteckn', 'brev', 'text', 'dagbok'] },
  { id: 'photo-1434030216411-0b793f4b4173', desc: 'hand som skriver i block vid kaffekopp', kw: ['skriva', 'planera', 'lista', 'anteckn'] },
  { id: 'photo-1456513080510-7bf3a84b82f8', desc: 'uppslagen bok framför bokhylla', kw: ['bok', 'läsa', 'saga', 'berättelse', 'kapitel'] },
  { id: 'photo-1497633762265-9d179a990aa6', desc: 'stapel färgglada böcker', kw: ['bok', 'böcker', 'läsa', 'bokhög'] },
  { id: 'photo-1516979187457-637abb4f9353', desc: 'stapel gamla slitna böcker', kw: ['bok', 'gammal', 'antik', 'klassiker'] },
  { id: 'photo-1481627834876-b7833e8f5570', desc: 'lång bokhylla med hängande lampor', kw: ['bibliotek', 'hylla', 'böcker', 'låna'] },
  { id: 'photo-1521587760476-6c12a4b040da', desc: 'bokhylla med inbundna böcker', kw: ['bibliotek', 'hylla', 'bokrygg'] },
  { id: 'photo-1427504494785-3a9ca7044f45', desc: 'person mellan bokhyllor i bibliotek', kw: ['bibliotek', 'leta', 'hylla', 'bokrygg'] },
  { id: 'photo-1524995997946-a1c2e315a42f', desc: 'böjd biblioteksgång med tusentals böcker', kw: ['bibliotek', 'arkiv', 'samling'] },
  { id: 'photo-1532012197267-da84d127e765', desc: 'antikvariat med uppslagen bok', kw: ['bok', 'antikvariat', 'magi', 'fantasi', 'saga'] },
  { id: 'photo-1476234251651-f353703a034d', desc: 'två barn läser en bok tillsammans', kw: ['syskon', 'läsa tillsammans', 'storasyster', 'lillebror', 'hjälpa'] },
  { id: 'photo-1544716278-ca5e3f4abd8c', desc: 'uppslagen bok med kaffe och glasögon', kw: ['läsa', 'lugn', 'fika', 'bok'] },
  { id: 'photo-1546074177-31bfa593f731', desc: 'scrabblebrickor som bildar ord', kw: ['ord', 'språk', 'stavning', 'bokstäver'] },

  // --- Vänskap, känslor, värdegrund ---------------------------------------
  { id: 'photo-1529156069898-49953e39b3ac', desc: 'gäng vänner med armarna om varandra', kw: ['vänskap', 'kompis', 'tillsammans', 'gemenskap', 'grupp'] },
  { id: 'photo-1497486751825-1233686d5d80', desc: 'glada barn står tillsammans', kw: ['barn', 'vänner', 'glädje', 'gemenskap', 'rättigheter'] },
  { id: 'photo-1464207687429-7505649dae38', desc: 'vänner sitter tillsammans i solnedgång', kw: ['vänner', 'samtal', 'kväll', 'gemenskap'] },
  { id: 'photo-1474418397713-7ede21d49118', desc: 'person sitter ensam med utsikt över berg', kw: ['ensam', 'stress', 'tankar', 'oro', 'känslor', 'psykisk'] },
  { id: 'photo-1519834785169-98be25ec3f84', desc: 'person som sträcker upp näven över molnhav', kw: ['mod', 'lyckas', 'drömmar', 'framgång', 'våga'] },
  { id: 'photo-1499244571948-7ccddb3583f1', desc: 'neonskylt med ordet Change', kw: ['förändring', 'förändras', 'framtid', 'ny'] },
  { id: 'photo-1530103862676-de8c9debad1d', desc: 'färgglada ballonger', kw: ['kalas', 'fest', 'födelsedag', 'ballong'] },

  // --- Samhälle, stad, transport ------------------------------------------
  { id: 'photo-1449824913935-59a10b8d2000', desc: 'gata mellan skyskrapor i storstad', kw: ['stad', 'gata', 'trafik', 'förtätning'] },
  { id: 'photo-1519501025264-65ba15a82390', desc: 'stadsgata i skymning med bilar', kw: ['stad', 'trafik', 'kväll', 'gata'] },
  { id: 'photo-1477959858617-67f85cf4f1df', desc: 'skyline vid vatten', kw: ['stad', 'hamn', 'skyline'] },
  { id: 'photo-1497034825429-c343d7c6a68f', desc: 'glasstrut hålls upp mot gul bakgrund', kw: ['glass', 'sommar', 'kiosk', 'godis'] },
  { id: 'photo-1501443762994-82bd5dace89a', desc: 'glassar med bär, flatlay', kw: ['glass', 'efterrätt', 'sommar'] },
  { id: 'photo-1570125909232-eb263c188f7e', desc: 'långfärdsbuss på väg', kw: ['buss', 'resa', 'hållplats', 'kollektivtrafik'] },
  { id: 'photo-1474487548417-781cb71495f3', desc: 'godståg på räls', kw: ['tåg', 'räls', 'station', 'resa'] },
  { id: 'photo-1485965120184-e220f721d03e', desc: 'racercykel mot mörk vägg', kw: ['cykel', 'cykla', 'ram', 'hjul'] },
  { id: 'photo-1507035895480-2b3156c31fc8', desc: 'cykel lutad mot vit tegelvägg', kw: ['cykel', 'cykla', 'parkerad'] },
  { id: 'photo-1471506480208-91b3a4cc78be', desc: 'cyklist på landsväg genom kullar', kw: ['cykel', 'cykla', 'väg', 'tur'] },
  { id: 'photo-1449965408869-eaa3f722e40d', desc: 'händer på ratt i bil i skymning', kw: ['bil', 'köra', 'trafik', 'väg'] },
  { id: 'photo-1520340356584-f9917d1eea6f', desc: 'bil i snörök', kw: ['bil', 'vinterväg', 'halka'] },
  { id: 'photo-1494526585095-c41746248156', desc: 'villa i skymning med tänt fönster', kw: ['hus', 'hem', 'bostad', 'granne'] },
  { id: 'photo-1568605114967-8130f3a36994', desc: 'upplyst trähus i skymning', kw: ['hus', 'hem', 'stuga', 'kväll'] },
  { id: 'photo-1560518883-ce09059eeffa', desc: 'modell av hus med nycklar', kw: ['bostad', 'flytta', 'hyra', 'nyckel'] },
  { id: 'photo-1593113598332-cd288d649433', desc: 'människor packar hjälpsändningar i lådor', kw: ['hjälpa', 'volontär', 'solidaritet', 'insamling'] },
  { id: 'photo-1559027615-cd4628902d4a', desc: 'funktionär i volontärtröja vid ett lopp', kw: ['volontär', 'evenemang', 'hjälpa till'] },
  { id: 'photo-1521737711867-e3b97375f902', desc: 'grupp som arbetar tillsammans vid datorer', kw: ['samarbete', 'möte', 'projekt', 'arbete'] },
  { id: 'photo-1524178232363-1fb2b075b655', desc: 'föreläsning i sal med publik', kw: ['föreläsning', 'debatt', 'presentation', 'demokrati'] },
  { id: 'photo-1590247813693-5541d1c609fd', desc: 'arkivhyllor fyllda med kartonger', kw: ['arkiv', 'källa', 'dokument', 'lagra'] },
  { id: 'photo-1580136579312-94651dfd596d', desc: 'historisk slagmålning med ryttare', kw: ['historia', 'medeltid', 'viking', 'krig', 'slag', 'forntid', 'riddare'] },
  { id: 'photo-1461360228754-6e81c478b882', desc: 'vinylskivor i skivbackar', kw: ['skiva', 'vinyl', 'musikaffär', 'samla'] },
  { id: 'photo-1554224155-6726b3ff858f', desc: 'blanketter och miniräknare', kw: ['pengar', 'budget', 'ekonomi', 'räkning', 'spara'] },
  { id: 'photo-1495020689067-958852a7765e', desc: 'person läser en tidning på bänk', kw: ['tidning', 'nyhet', 'läsa', 'journalist'] },
  { id: 'photo-1504711434969-e33886168f5c', desc: 'hopvikta dagstidningar', kw: ['tidning', 'nyhet', 'media', 'källkritik', 'rubrik'] },
  { id: 'photo-1502920917128-1aa500764cbd', desc: 'systemkamera på vit bakgrund', kw: ['kamera', 'foto', 'bild', 'fotografi'] },
  { id: 'photo-1471193945509-9ad0617afabf', desc: 'grönsaksstånd på marknad', kw: ['marknad', 'grönsak', 'handel', 'affär', 'torg'] },

  // --- Mat ----------------------------------------------------------------
  { id: 'photo-1606787366850-de6330128bfc', desc: 'stort matbord med frukt, bröd och ägg', kw: ['mat', 'frukost', 'lunch', 'måltid', 'näring'] },
  { id: 'photo-1591189863430-ab87e120f312', desc: 'råvaror och grönsaker på träbord', kw: ['råvara', 'grönsak', 'laga mat', 'kök'] },
  { id: 'photo-1544025162-d76694265947', desc: 'grillat kött med tomater på skärbräda', kw: ['middag', 'kött', 'grill', 'mat'] },
  { id: 'photo-1568571780765-9276ac8b75a2', desc: 'bit äppelpaj på tallrik', kw: ['paj', 'äpple', 'bak', 'efterrätt', 'café'] },
  { id: 'photo-1549007994-cb92caebd54b', desc: 'chokladpraliner i rader', kw: ['choklad', 'godis', 'praliner', 'marabou'] },
  { id: 'photo-1579584425555-c3ce17fd4351', desc: 'sushibitar på bräda', kw: ['sushi', 'japan', 'fisk', 'ris'] },
  { id: 'photo-1571771894821-ce9b6c11b08e', desc: 'bananklase mot gul bakgrund', kw: ['banan', 'frukt', 'mellanmål'] },

  // --- Idrott -------------------------------------------------------------
  { id: 'photo-1551958219-acbc608c6377', desc: 'fotbollar på grön plan', kw: ['fotboll', 'boll', 'plan', 'match'] },
  { id: 'photo-1560272564-c83b66b1ad12', desc: 'fotbollsspelare skjuter mot mål', kw: ['fotboll', 'mål', 'skott', 'match', 'idrott'] },
  { id: 'photo-1574629810360-7efbbe195018', desc: 'fotboll och spelarben på gräs', kw: ['fotboll', 'passning', 'träning'] },
  { id: 'photo-1522778119026-d647f0596c20', desc: 'fullsatt fotbollsstadion', kw: ['stadion', 'publik', 'arena', 'klubb', 'supporter'] },
  { id: 'photo-1551698618-1dfe5d97d256', desc: 'skidåkare i slalombacke', kw: ['skidor', 'slalom', 'vinteridrott', 'backe'] },
  { id: 'photo-1530549387789-4c1017266635', desc: 'simmare i bassäng', kw: ['sim', 'bassäng', 'badhus', 'simhall'] },
  { id: 'photo-1571019614242-c5c5dee9f50b', desc: 'styrketräning på gym', kw: ['träning', 'gym', 'kondition', 'uppvärmning', 'muskler'] },
  { id: 'photo-1596568359553-a56de6970068', desc: 'sneaker mot grön bakgrund', kw: ['sko', 'skor', 'sneaker', 'löpning'] },
  { id: 'photo-1544117519-31a4b719223d', desc: 'sportklocka', kw: ['klocka', 'tid', 'mäta', 'puls'] },

  // --- Musik och kultur ---------------------------------------------------
  { id: 'photo-1507838153414-b4b713384a76', desc: 'notblad', kw: ['noter', 'musik', 'melodi', 'sång', 'komponera'] },
  { id: 'photo-1511379938547-c1f69419868d', desc: 'musikrum med gitarrer och keyboard', kw: ['gitarr', 'instrument', 'band', 'musik', 'studio'] },
  { id: 'photo-1519892300165-cb5542fb47c7', desc: 'trumset med trumpinnar', kw: ['trumma', 'rytm', 'takt', 'slagverk'] },
  { id: 'photo-1470225620780-dba8ba36b745', desc: 'dj-mixer i lila ljus', kw: ['dj', 'musikproduktion', 'studio', 'mixa', 'låt'] },
  { id: 'photo-1470229722913-7c0e2dbbafd3', desc: 'konsertpublik mot scenljus', kw: ['konsert', 'scen', 'publik', 'festival', 'artist', 'melodifestival'] },
  { id: 'photo-1493225457124-a3eb161ffa5f', desc: 'artist på scen i färgad rök', kw: ['artist', 'uppträda', 'show', 'stjärna', 'rock'] },
  { id: 'photo-1489599849927-2ee91cede3ba', desc: 'tom biosalong med röda stolar', kw: ['film', 'bio', 'biograf', 'premiär'] },
  { id: 'photo-1518998053901-5348d3961a04', desc: 'ljust konstgalleri med tavlor', kw: ['konst', 'galleri', 'utställning', 'museum', 'tavla'] },
  { id: 'photo-1445205170230-053b83016050', desc: 'klädställ i butik', kw: ['kläder', 'mode', 'stil', 'plagg', 'garderob'] },
  { id: 'photo-1484981138541-3d074aa97716', desc: 'person håller kaffemugg med tryck', kw: ['varumärke', 'stil', 'identitet', 'lyx'] },
  { id: 'photo-1523906834658-6e24ef2386f9', desc: 'kanal och bro i Venedig', kw: ['italien', 'venedig', 'kanal', 'stad'] },
  { id: 'photo-1533105079780-92b9be482077', desc: 'vit-blå hus vid havet på Santorini', kw: ['grekland', 'ö', 'medelhav', 'tempel'] },
  { id: 'photo-1533050487297-09b450131914', desc: 'japansk gränd med lyktor', kw: ['japan', 'gränd', 'lykta', 'tokyo'] },
  { id: 'photo-1528181304800-259b08848526', desc: 'tempel med gyllene tak', kw: ['tempel', 'thailand', 'religion', 'asien'] },
  { id: 'photo-1499678329028-101435549a4e', desc: 'kuststad i solnedgång', kw: ['kuststad', 'medelhav', 'semester', 'resa'] },
  { id: 'photo-1611604548018-d56bbd85d681', desc: 'legofigurer av superhjältar', kw: ['lego', 'leksak', 'superhjälte', 'serie', 'figur'] },

  // --- Teknik och digitalt ------------------------------------------------
  { id: 'photo-1677442136019-21780ecad995', desc: 'ordet AI i blått mönster', kw: ['ai', 'artificiell', 'intelligens', 'algoritm', 'chatbot'] },
  { id: 'photo-1518770660439-4636190af475', desc: 'kretskort i närbild', kw: ['dator', 'elektronik', 'chip', 'teknik', 'kretskort'] },
  { id: 'photo-1504639725590-34d0984388bd', desc: 'programkod på skärm', kw: ['kod', 'programmera', 'algoritm', 'bugg', 'utveckla'] },
  { id: 'photo-1461749280684-dccba630e2f6', desc: 'färgad programkod på mörk skärm', kw: ['kod', 'programmera', 'skript'] },
  { id: 'photo-1538481199705-c710c4e965fc', desc: 'gamingtangentbord med färgat ljus', kw: ['spel', 'gaming', 'konsol', 'tangentbord', 'fortnite'] },
  { id: 'photo-1516192518150-0d8fee5425e3', desc: 'humanoid robot i profil', kw: ['robot', 'maskin', 'automat', 'framtid'] },
  { id: 'photo-1561557944-6e7860d1a7eb', desc: 'person i blå ljusinstallation', kw: ['digital', 'ljus', 'installation', 'virtuell'] },
  { id: 'photo-1499951360447-b19be8fe80f5', desc: 'skrivbord med dator och skärm', kw: ['dator', 'skärm', 'arbetsplats', 'kontor'] },
  { id: 'photo-1503945438517-f65904a52ce6', desc: 'person arbetar vid laptop', kw: ['arbete', 'jobb', 'laptop', 'skärmtid'] },
  { id: 'photo-1497032628192-86f99bcd76bc', desc: 'skrivbord med laptop och förstoringsglas', kw: ['arbete', 'undersöka', 'granska', 'yrke'] },
  { id: 'photo-1454165804606-c3d57bc86b40', desc: 'två personer arbetar vid varsin laptop', kw: ['samarbete', 'skolarbete', 'grupparbete'] },
  { id: 'photo-1558618666-fcd25c85cd64', desc: 'person arbetar med verktyg och lampa', kw: ['verktyg', 'uppfinning', 'bygga', 'reparera', 'hjul'] },
  { id: 'photo-1518131672697-613becd4fab5', desc: 'armbandsur på vit bakgrund', kw: ['klocka', 'tid', 'timme', 'väcka'] },
  { id: 'photo-1487958449943-2429e8be8625', desc: 'modern byggnad i glas och betong', kw: ['byggnad', 'arkitektur', 'modern', 'konstruktion'] },
  { id: 'photo-1532996122724-e3c354a0b15b', desc: 'fyra sopkärl i olika färger', kw: ['sopor', 'återvinning', 'sortera', 'avfall', 'miljö'] },
  { id: 'photo-1588776814546-1ffcf47267a5', desc: 'tandläkare som visar röntgenbild', kw: ['tand', 'tänder', 'tandläkare', 'röntgen'] },
  { id: 'photo-1541872703-74c5e44368f9', desc: 'Barack Obama i telefon i Vita huset', kw: ['obama', 'president', 'vita huset', 'usa', 'politiker'] },
  { id: 'photo-1558171813-4c088753af8f', desc: 'ljusblå skjorta på en stol', kw: ['skjorta', 'kläder', 'vardag'] },
  { id: 'photo-1476973422084-e0fa66ff9456', desc: 'karta med färgade knappnålar', kw: ['karta', 'kompass', 'nål', 'plats', 'geografi', 'navigera'] },
  { id: 'photo-1456324504439-367cee3b3c32', desc: 'anteckningsbok, kaffe och croissant', kw: ['fika', 'paus', 'reflektera', 'plan'] },
  { id: 'photo-1512820790803-83ca734da794', desc: 'stapel med fackböcker', kw: ['facklitteratur', 'studera', 'kurs', 'bokstapel'] },
  { id: 'photo-1472745942893-4b9f730c7668', desc: 'barn som paddlar på en sjö', kw: ['paddla', 'sjö', 'sommar', 'bad', 'kanot'] },
  { id: 'photo-1479936343636-73cdc5aae0c3', desc: 'leende person i motljus på gata', kw: ['glad', 'ute', 'stad', 'sol'] },
  { id: 'photo-1573455494060-c5595004fb6c', desc: 'smal gränd med skyltar och lyktor', kw: ['gränd', 'stadsdel', 'kvarter', 'natt'] },
  { id: 'photo-1590986957265-b7c9ebe5c5f0', desc: 'nattbild av stad', kw: ['natt', 'ljus', 'stad'] },

  // Bilder som redan fanns i biblioteket och fungerar, men vars motiv är så
  // pass smalt att de passar få texter. De ligger med för att tilldelningen
  // ska kunna jämföra dem rättvist med alternativen.
  { id: 'photo-1520038410233-7141be7e6f97', desc: 'tax som tittar upp ur en flyttkartong', kw: ['hund', 'kartong', 'låda'] },
  { id: 'photo-1533738363-b7f9aef128ce', desc: 'katt med runda solglasögon', kw: ['katt', 'cool', 'solglasögon'] },
  { id: 'photo-1516912481808-3406841bd33c', desc: 'åskväder med blixtar över fält', kw: ['åska', 'blixt', 'storm', 'oväder'] },
  { id: 'photo-1566438480900-0609be27a4be', desc: 'stadssiluett med motorväg i skymning', kw: ['stad', 'motorväg', 'siluett'] },

  // --- Tillägg för motiv som saknades helt ---------------------------------
  { id: 'photo-1547407139-3c921a66005c', desc: 'vit varghund i snölandskap', kw: ['varg', 'vildmark', 'rovdjur', 'flock'] },
  { id: 'photo-1568162603664-fcd658421851', desc: 'brunbjörn i närbild', kw: ['björn', 'rovdjur', 'vildmark'] },
  { id: 'photo-1517849845537-4d257902454a', desc: 'mops mot gul bakgrund', kw: ['hund', 'mops', 'husdjur'] },
  { id: 'photo-1519098901909-b1553a1190af', desc: 'glad corgi', kw: ['hund', 'corgi', 'glad'] },
  { id: 'photo-1441974231531-c6227db76b6e', desc: 'solbelyst stig genom hög skog', kw: ['stig', 'skog', 'vandra', 'stubbe', 'ekorre'] },
  { id: 'photo-1511497584788-876760111969', desc: 'granar framför fjälltopp', kw: ['gran', 'fjäll', 'barrskog', 'natur'] },
  { id: 'photo-1546587348-d12660c30c50', desc: 'spegelblank fjällsjö med granar', kw: ['sjö', 'fjäll', 'spegling', 'stillhet'] },
  { id: 'photo-1506905925346-21bda4d32df4', desc: 'bergstoppar över ett hav av moln', kw: ['moln', 'berg', 'höjd', 'dimma'] },
  { id: 'photo-1516117172878-fd2c41f4a759', desc: 'blånande bergsryggar i solnedgång', kw: ['utsikt', 'horisont', 'kväll', 'berg'] },
  { id: 'photo-1470252649378-9c29740c9fa8', desc: 'solnedgång över öppen äng', kw: ['solnedgång', 'äng', 'kväll', 'sommar'] },
  { id: 'photo-1517841905240-472988babdf9', desc: 'ung person i mössa och jeansjacka', kw: ['mössa', 'jacka', 'ungdom', 'vinterkläder', 'vante'] },
  { id: 'photo-1518621736915-f3b1c41bfd00', desc: 'ros på uppslagna boksidor', kw: ['dikt', 'poesi', 'roman', 'kärlek', 'litteratur'] },
  { id: 'photo-1523240795612-9a054b0db644', desc: 'grupp som arbetar tillsammans framför bokhyllor', kw: ['grupparbete', 'plugga', 'tillsammans', 'projekt'] },
  { id: 'photo-1541888946425-d81bb19240f5', desc: 'byggarbetare på stor byggarbetsplats', kw: ['fabrik', 'industri', 'arbetare', 'anläggning', 'byggarbetsplats', 'skorsten'] },
  { id: 'photo-1543946602-a0fce8117697', desc: 'lysande optiska fibrer', kw: ['fiber', 'internet', 'signal', 'uppkoppling', 'kabel'] },
  { id: 'photo-1573164713988-8665fc963095', desc: 'serverhall med tekniker', kw: ['server', 'data', 'datacenter', 'lagring', 'moln'] },
  { id: 'photo-1521791136064-7986c2920216', desc: 'handslag mellan två personer', kw: ['överenskommelse', 'avtal', 'kompromiss', 'förhandling', 'löfte'] },
  { id: 'photo-1552581234-26160f608093', desc: 'möte kring bord med post it-lappar', kw: ['möte', 'planera', 'organisation', 'beslut'] },
  { id: 'photo-1486406146926-c627a92ad1ab', desc: 'skyskrapor sedda underifrån', kw: ['skyskrapa', 'kontor', 'storstad', 'höghus'] },
  { id: 'photo-1493809842364-78817add7ffb', desc: 'ljust vardagsrum med soffa', kw: ['vardagsrum', 'hemma', 'soffa', 'lägenhet'] },
  { id: 'photo-1555854877-bab0e564b8d5', desc: 'våningssäng i enkelt rum', kw: ['säng', 'rum', 'sovrum', 'vandrarhem'] },
  { id: 'photo-1571902943202-507ec2618e8f', desc: 'gym med träningsmaskiner', kw: ['gym', 'träning', 'styrka', 'motion'] },
  { id: 'photo-1600880292203-757bb62b4baf', desc: 'två kollegor ger high five', kw: ['beröm', 'lyckas', 'samarbete', 'glädje'] },
  { id: 'photo-1502005229762-cf1b2da7c5d6', desc: 'ljus trappa i ett hem', kw: ['trappa', 'hus', 'inredning'] },
  { id: 'photo-1497215728101-856f4ea42174', desc: 'kontorsplats med utsikt över stad', kw: ['kontor', 'arbetsplats', 'jobb'] },
  { id: 'photo-1541844053589-346841d0b34c', desc: 'spelpjäser där en står utanför gruppen', kw: ['utanförskap', 'diskriminering', 'motstånd', 'civilkurage', 'orättvisa', 'utesluta'] },
  { id: 'photo-1544027993-37dbfe43562a', desc: 'två händer som sträcker sig mot varandra', kw: ['räcka', 'stötta', 'förlåt', 'försoning', 'närma'] },
  { id: 'photo-1517457373958-b7bdd4587205', desc: 'folksamling under ljusslingor', kw: ['folksamling', 'demonstration', 'samling', 'rörelse', 'protest'] },
  { id: 'photo-1594122230689-45899d9e6f69', desc: 'fullsatt föreläsningssal', kw: ['föreläsning', 'auditorium', 'åhörare', 'tal'] },
  { id: 'photo-1573152143286-0c422b4d2175', desc: 'många händer som håller mobiler', kw: ['mobil', 'skärm', 'sociala medier', 'flöde', 'telefon'] },
  { id: 'photo-1594708767771-a7502209ff51', desc: 'två barn leker utomhus', kw: ['barnarbete', 'lek', 'barndom', 'uppväxt'] },
  { id: 'photo-1518709594023-6eab9bab7b23', desc: 'zebror på savann', kw: ['zebra', 'savann', 'vilda djur', 'flock'] },
  { id: 'photo-1533228876829-65c94e7b5025', desc: 'person med utsträckta armar vid en sjö', kw: ['frihet', 'andas', 'lugn', 'utsikt'] },
  { id: 'photo-1580927752452-89d86da3fa0a', desc: 'laptop som lyser i mörkret', kw: ['nätet', 'uppkopplad', 'kväll', 'skärmtid'] },
];

// Reservbilder per tema. Används bara när en text har en trasig bild och
// ingen katalogbild matchar innehållet – hellre en neutral bild ur rätt
// ämnesområde än ett motiv som råkar dela ett ord med titeln.
const RESERV = {
  historia: 'photo-1580136579312-94651dfd596d',
  samhälle: 'photo-1449824913935-59a10b8d2000',
  kultur: 'photo-1518998053901-5348d3961a04',
  natur: 'photo-1441974231531-c6227db76b6e',
  'natur & miljö': 'photo-1441974231531-c6227db76b6e',
  miljö: 'photo-1532996122724-e3c354a0b15b',
  djur: 'photo-1444464666168-49d633b86797',
  vetenskap: 'photo-1532094349884-543bc11b234d',
  teknik: 'photo-1518770660439-4636190af475',
  sport: 'photo-1551958219-acbc608c6377',
  musik: 'photo-1507838153414-b4b713384a76',
  hälsa: 'photo-1559757175-5700dde675bc',
  etik: 'photo-1529156069898-49953e39b3ac',
  värdegrund: 'photo-1529156069898-49953e39b3ac',
  vänskap: 'photo-1529156069898-49953e39b3ac',
  'mänskliga rättigheter': 'photo-1497486751825-1233686d5d80',
  geografi: 'photo-1476973422084-e0fa66ff9456',
  skola: 'photo-1509062522246-3755977927d7',
  familj: 'photo-1476234251651-f353703a034d',
  fantasi: 'photo-1532012197267-da84d127e765',
  väder: 'photo-1515694346937-94d85e41e6f0',
  kroppen: 'photo-1559757175-5700dde675bc',
  standard: 'photo-1456513080510-7bf3a84b82f8',
};

// ---------------------------------------------------------------------------
// Tillägg: avlastning av de mest återanvända motiven.
//
// Efter förra omgången hade ingen text en trasig eller uppenbart felaktig bild,
// men 437 texter delade fortfarande motiv med varandra: tretton texter satt på
// samma bild av sopsortering, tolv på samma kommunbild och elva på samma
// AI-bild. Bilderna nedan har samma nyckelord som de överbelastade, och
// eftersom bastaBild() vid lika poäng väljer det motiv som använts minst
// fördelar tilldelningen ut texterna av sig själv.
//
// Var och en är nedladdad och granskad. Av de fyra första sopsorteringsbilder
// som söktes fram var bara en användbar: de andra visade en skräpig gata med en
// utslängd kontorsstol, en stenvägg där kärlen var en bisak, och en villagata
// där de knappt syntes. Alt-texten sa "trash bins" om alla fyra.
// ---------------------------------------------------------------------------
const KATALOG_TILLAGG = [
  // Miljö och sortering
  { id: 'photo-1611284446314-60a58ac0deb9', desc: 'tre sopkärl märkta kompost, avfall och återvinning', kw: ['sortera', 'sopor', 'återvinning', 'avfall', 'skräp'] },

  // Rymd
  { id: 'photo-1701014159143-09482059f571', desc: 'tre planeter mot stjärnhimmel', kw: ['planet', 'rymd', 'solsystem', 'universum'] },
  { id: 'photo-1696384036025-c7d7b7f6584d', desc: 'röd planet med måne mot stjärnhimmel', kw: ['mars', 'planet', 'rymd'] },
  { id: 'photo-1700159915592-004562ddcf6f', desc: 'planet i blått ljus över stjärnfält', kw: ['planet', 'rymd', 'universum', 'galax'] },

  // Musik
  { id: 'photo-1512733596533-7b00ccf8ebaf', desc: 'pianotangenter i närbild', kw: ['piano', 'musik', 'instrument', 'ton'] },
  { id: 'photo-1556379118-7034d926d258', desc: 'stränginstrument och trummor upphängda på vägg', kw: ['instrument', 'musik', 'gitarr', 'trumma'] },

  // Sång och rytm
  { id: 'photo-1774266854775-4831c6c516b3', desc: 'barn i skolkläder som klappar takten', kw: ['klappa', 'rytm', 'sång', 'kör', 'takt', 'samling'] },

  // Nyheter och media
  { id: 'photo-1573812195421-50a396d17893', desc: 'staplade dagstidningar sedda från kanten', kw: ['tidning', 'nyhet', 'media', 'rubrik'] },
  { id: 'photo-1495020689067-958852a7765e', desc: 'person läser tidning på en bänk', kw: ['tidning', 'läsa', 'nyhet', 'media', 'press'] },

  // Teknik och AI
  { id: 'photo-1562408590-e32931084e23', desc: 'kretskort med komponenter i blått ljus', kw: ['ai', 'artificiell', 'intelligens', 'algoritm', 'dator', 'chip'] },

  // Samhälle
  { id: 'photo-1780396269429-e20eaa1a1cd2', desc: 'fullmäktigesal med bänkar i halvcirkel', kw: ['kommun', 'fullmäktige', 'demokrati', 'beslut', 'politik', 'råd'] },
];

// Tillägget läggs sist, så att befintliga tilldelningar med samma poäng ligger
// kvar och bara överflödet flyttas till de nya motiven.
KATALOG.push(...KATALOG_TILLAGG.filter((b) => !KATALOG.some((k) => k.id === b.id)));

const KATALOG_MAP = new Map(KATALOG.map((b) => [b.id, b]));

module.exports = { KATALOG, KATALOG_MAP, RESERV, url, BAS, SUFFIX };
