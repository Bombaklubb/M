import type { Temadag } from '../types'

const DAGAR = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag']

// Hjälpare: para ihop fem aktiviteter med veckans dagar.
function vecka(akt: [string, string][]): Temadag['dagar'] {
  return akt.map(([titel, beskrivning], i) => ({ dag: DAGAR[i], titel, beskrivning }))
}

// Modul 7 – Temadagar. Färdiga veckoupplägg för högtider och speciella dagar.
export const TEMADAGAR: Temadag[] = [
  {
    id: 'halloween',
    namn: 'Halloween',
    emoji: '🎃',
    beskrivning: 'En vecka med lagom läskigt höstmys, pyssel och bus.',
    laroplan: 'Lgr22 fritidshem: Skapande och estetiska uttrycksformer samt Lekar, fysiska aktiviteter och utevistelse. Svenska: berättande och dramatisering.',
    dagar: vecka([
      ['Pynta & pyssla', 'Gör spöken, spindlar och pumpor av återbruksmaterial och dekorera fritids.'],
      ['Spökhinderbana', 'Ta dig genom "spökskogen" – krypa, balansera och hoppa.'],
      ['Läskigt mellanmål', 'Klä ut mellanmålet: spindelmackor, monsterfrukt och trolldryck (saft).'],
      ['Spökberättelser', 'Hitta på och dramatisera en (lagom) läskig saga i grupp.'],
      ['Utklädningsfest', 'Kostymparad, dansstopp och läskiga lekar.'],
    ]),
  },
  {
    id: 'alla-hjartans-dag',
    namn: 'Alla hjärtans dag',
    emoji: '💗',
    beskrivning: 'En vänskapsvecka om att vara en bra kompis.',
    laroplan: 'Lgr22 fritidshem: normer och värden samt Skapande och estetiska uttrycksformer. Värdegrunden: empati, vänskap och allas lika värde.',
    dagar: vecka([
      ['Vänskapskort', 'Gör och ge ett kort med en ärlig komplimang till en kompis.'],
      ['Hemliga vänner', 'Dra en kompis att vara extra snäll mot under hela veckan.'],
      ['Hjärtpyssel', 'Skapa hjärtan av olika material och dekorera fritids tillsammans.'],
      ['Komplimangcirkel', 'Sitt i ring och samtala: vad gör en bra kompis?'],
      ['Vänskapsfest', 'Baka/fika ihop och lek lekar där alla får vara med.'],
    ]),
  },
  {
    id: 'vinterdag',
    namn: 'Vinter',
    emoji: '❄️',
    beskrivning: 'Vintermys ute och inne med snö, is och rörelse.',
    laroplan: 'Lgr22 fritidshem: Lekar, fysiska aktiviteter och utevistelse. NO: årstider samt vatten i fast form (is och snö).',
    dagar: vecka([
      ['Snöskulpturer', 'Bygg figurer av snö ute – eller klipp snöflingor inne om det saknas snö.'],
      ['Spårjakt i snön', 'Följ spår och gissa vem eller vilket djur som gått där.'],
      ['Is-experiment', 'Vad smälter snabbast? Frys figurer och undersök is och snö.'],
      ['Vinter-OS', 'Pulka, kälke och kast på tid – tävla i lag.'],
      ['Varm choklad & saga', 'Mysig avslutning med varm choklad och högläsning.'],
    ]),
  },
  {
    id: 'pask',
    namn: 'Påsk',
    emoji: '🐣',
    beskrivning: 'Påskpyssel, äggjakt och traditioner.',
    laroplan: 'Lgr22 fritidshem: Natur och samhälle samt Skapande och estetiska uttrycksformer. Religionskunskap: högtider och traditioner.',
    dagar: vecka([
      ['Påskpyssel', 'Gör höns, kycklingar och påskris.'],
      ['Äggjakt', 'Skattjakt med ledtrådar ute – hitta de gömda äggen.'],
      ['Måla ägg', 'Måla och dekorera ägg med egna mönster.'],
      ['Påskquiz', 'Varför firar vi påsk? Frågor om traditioner och vårtecken.'],
      ['Påsklekar & fika', 'Äggrullning, sked-stafett och gemensam påskbuffé.'],
    ]),
  },
  {
    id: 'sommaravslutning',
    namn: 'Sommaravslutning',
    emoji: '🌞',
    beskrivning: 'Avsluta läsåret med fest, minnen och gemenskap.',
    laroplan: 'Lgr22 fritidshem: Lekar, fysiska aktiviteter och utevistelse samt demokratiska arbetssätt. Värdegrunden: gemenskap och delaktighet.',
    dagar: vecka([
      ['Planera festen', 'Bestäm tillsammans – rösta om aktiviteter (demokrati i praktiken).'],
      ['Vattenlekar', 'Svalkande stafetter och vattenlekar ute.'],
      ['Skapa minnen', 'Gör en gemensam tavla eller bok med årets höjdpunkter.'],
      ['Stora samarbetsleken', 'Fånga flaggan eller skattjakt för hela gruppen.'],
      ['Picknick & disco', 'Fira med picknick, prisutdelning och dans.'],
    ]),
  },
  {
    id: 'olympiska-spel',
    namn: 'Olympiska spel',
    emoji: '🏅',
    beskrivning: 'Ett eget fritids-OS med invigning, grenar och final.',
    laroplan: 'Lgr22 fritidshem: Lekar, fysiska aktiviteter och utevistelse. Idrott och hälsa: regler och fair play. SO: länder och flaggor.',
    dagar: vecka([
      ['Invigning', 'Gör lagflaggor, tänd "elden" och gå ländermarsch.'],
      ['Friidrott', 'Löpning, längdhopp i sandlådan och kast – mät och heja.'],
      ['Lagsporter', 'Stafetter och bollekar i lag.'],
      ['Knepiga grenar', 'Balans, precision och kluringar – ett "huvud-OS".'],
      ['Final & ceremoni', 'Medaljer, fair play-diplom och avslutningshejarop.'],
    ]),
  },

  // ── Fler högtider och speciella dagar ────────────────────────────────────
  {
    id: 'lucia-jul',
    namn: 'Lucia & jul',
    emoji: '🕯️',
    beskrivning: 'Julpyssel, traditioner och mys inför lovet.',
    laroplan: 'Lgr22 fritidshem: Skapande och estetiska uttrycksformer. Religionskunskap: högtider, traditioner och berättelser.',
    dagar: vecka([
      ['Julpyssel', 'Gör julgranskulor, stjärnor och pappersbarn.'],
      ['Luciatåg', 'Öva sånger och gör enkla luciakronor och stjärngossestrutar.'],
      ['Pepparkaksbak', 'Baka och dekorera pepparkakor (mät och räkna).'],
      ['Julquiz & traditioner', 'Hur firas jul här och i andra länder?'],
      ['Julmys', 'Högläsning, julsaga och lugna lekar.'],
    ]),
  },
  {
    id: 'fn-dagen',
    namn: 'FN-dagen & barns rättigheter',
    emoji: '🌍',
    beskrivning: 'En vecka om barnkonventionen och allas lika värde.',
    laroplan: 'Lgr22 fritidshem: Natur och samhälle samt värdegrunden. SO: barns rättigheter, demokrati och mänskliga rättigheter.',
    dagar: vecka([
      ['Våra rättigheter', 'Rita och samtala om vad alla barn har rätt till.'],
      ['Världen ihop', 'Flaggor, hälsningar och lekar från olika länder.'],
      ['Allas lika värde', 'Värderingsövningar om likheter och olikheter.'],
      ['Demokrati', 'Håll ett fritidsråd – lägg förslag och rösta.'],
      ['Fredsbudskap', 'Gör en gemensam fredsduva eller affisch.'],
    ]),
  },
  {
    id: 'kompisdagen',
    namn: 'Kompisdagen',
    emoji: '🤝',
    beskrivning: 'En vecka mot utanförskap – för schysta kompisar.',
    laroplan: 'Lgr22 fritidshem: normer och värden, Språk och kommunikation. Värdegrunden: trygghet, vänskap och att motverka kränkningar.',
    dagar: vecka([
      ['Vad är en kompis?', 'Samtala och gör gemensamma kompisregler.'],
      ['Alla får vara med', 'Lekar utan att någon väljs bort.'],
      ['Schysst på nätet', 'Prata om hur man är en bra kompis även i spel och chatt.'],
      ['Säga ifrån', 'Rollspel: vad gör man när någon blir utanför?'],
      ['Kompisfest', 'Fira veckan med samarbetslekar och fika.'],
    ]),
  },
  {
    id: 'miljodagen',
    namn: 'Miljödagen',
    emoji: '🌱',
    beskrivning: 'En vecka om natur, återbruk och att vara rädd om jorden.',
    laroplan: 'Lgr22 fritidshem: Natur och samhälle. NO: människans påverkan på naturen, källsortering och hållbar utveckling.',
    dagar: vecka([
      ['Skräpplockning', 'Städa skolgården och sortera det ni hittar.'],
      ['Återbrukskonst', 'Skapa något nytt av gammalt material.'],
      ['Naturens dag', 'Naturbingo och upptäckter i närmiljön.'],
      ['Energidetektiver', 'Leta efter sätt att spara energi och vatten på fritids.'],
      ['Plantera & vårda', 'Så frön eller plantera – och lova att sköta om det.'],
    ]),
  },
  {
    id: 'bokens-dag',
    namn: 'Bokens dag',
    emoji: '📚',
    beskrivning: 'En vecka om läsning, berättelser och fantasi.',
    laroplan: 'Lgr22 fritidshem: Språk och kommunikation samt Skapande och estetiska uttrycksformer. Svenska: läsa, berätta och samtala om texter.',
    dagar: vecka([
      ['Läsmys', 'Bygg en läshörna och läs eller bläddra i favoritböcker.'],
      ['Högläsning', 'En vuxen eller äldre elev läser en spännande berättelse.'],
      ['Rita din saga', 'Skapa egna serier eller sagor i bild och text.'],
      ['Bokquiz', 'Gissa boken utifrån ledtrådar och figurer.'],
      ['Dramatisera', 'Spela upp en favoritberättelse.'],
    ]),
  },
  {
    id: 'rorelsedag',
    namn: 'Rörelsedag',
    emoji: '🤸',
    beskrivning: 'En aktiv vecka med pulshöjande lekar och utmaningar.',
    laroplan: 'Lgr22 fritidshem: Lekar, fysiska aktiviteter och utevistelse. Idrott och hälsa: motorik, samarbete och hälsa.',
    dagar: vecka([
      ['Hinderbana', 'Bygg och spring en bana med krypa, hoppa och balansera.'],
      ['Danslekar', 'Dansstopp, koreografi och rörelse till musik.'],
      ['Lagkamper', 'Stafetter och bollekar i lag.'],
      ['Rörelsebingo', 'Bingobricka med rörelseuppdrag att bocka av.'],
      ['Lugn avslutning', 'Yoga och stretch för att varva ner.'],
    ]),
  },
]
