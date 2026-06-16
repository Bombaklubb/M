import type { Tema } from '../types'

// Modul 1 – Temabanken
// Färdiga teman med aktivitetsförslag. Skolans egna teman läggs till i appen
// och sparas i localStorage (se Temabanken.tsx).
export const TEMAN: Tema[] = [
  {
    id: 'hallbar-utveckling',
    namn: 'Hållbar utveckling',
    emoji: '♻️',
    aldersgrupper: ['F-1', '2-3', '4-6'],
    aktiviteter: [
      { titel: 'Bygg återvinningsmaskiner', beskrivning: 'Bygg en låtsasmaskin av kartong och förpackningar som sorterar skräp.' },
      { titel: 'Sorteringsstafett', beskrivning: 'Lagen springer och sorterar (rena, torra) sopor i rätt återvinningstunna på tid.' },
      { titel: 'Miljöquiz', beskrivning: 'Femton frågor om återvinning, energi och natur. Svara med tummen upp/ner.' },
      { titel: 'Skapa konst av skräp', beskrivning: 'Gör en gemensam tavla eller skulptur av rent återvinningsmaterial.' },
      { titel: 'Naturbingo', beskrivning: 'Hitta saker i naturen utan att plocka – kryssa av på bingobrickan.' },
    ],
  },
  {
    id: 'rymden',
    namn: 'Rymden',
    emoji: '🚀',
    aldersgrupper: ['F-1', '2-3', '4-6'],
    aktiviteter: [
      { titel: 'Bygg en raket', beskrivning: 'Konstruera en raket av rör, papper och tejp – vems flyger längst?' },
      { titel: 'Planetstafett', beskrivning: 'Spring mellan planeterna i rätt ordning från solen och ut.' },
      { titel: 'Rymdquiz', beskrivning: 'Frågor om planeter, stjärnor och astronauter.' },
      { titel: 'Måndans', beskrivning: 'Rör er i slow motion som om ni svävar i tyngdlöshet.' },
      { titel: 'Stjärnbilder', beskrivning: 'Måla egna stjärnbilder med vita prickar på svart papper.' },
    ],
  },
  {
    id: 'havet',
    namn: 'Havet',
    emoji: '🌊',
    aldersgrupper: ['F-1', '2-3', '4-6'],
    aktiviteter: [
      { titel: 'Hela havet stormar', beskrivning: 'Klassikern med stolar – en stol färre varje runda.' },
      { titel: 'Fiska skräp', beskrivning: 'Fiska upp "plast" (papperslappar) ur havet med metspö av pinne och snöre.' },
      { titel: 'Havsdjursquiz', beskrivning: 'Gissa havsdjuret utifrån ledtrådar.' },
      { titel: 'Bygg ett akvarium', beskrivning: 'Skapa ett papperakvarium med egna fiskar och växter.' },
      { titel: 'Vågrörelse', beskrivning: 'Stå i ring och skicka en "våg" runt med armarna.' },
    ],
  },
  {
    id: 'riddartiden',
    namn: 'Riddartiden',
    emoji: '🏰',
    aldersgrupper: ['F-1', '2-3', '4-6'],
    aktiviteter: [
      { titel: 'Bygg en borg', beskrivning: 'Bygg en borg av kuddar, kartong eller klossar.' },
      { titel: 'Riddarbana', beskrivning: 'Hinderbana där man tränar till riddare/väpnare.' },
      { titel: 'Drakjakt', beskrivning: 'Variant av kull där den som kullas blir drake.' },
      { titel: 'Gör en sköld', beskrivning: 'Designa och måla ett eget vapensköldmärke.' },
      { titel: 'Riddarquiz', beskrivning: 'Frågor om slott, riddare och medeltiden.' },
    ],
  },
  {
    id: 'kanslor-vanskap',
    namn: 'Känslor & vänskap',
    emoji: '💛',
    aldersgrupper: ['F-1', '2-3', '4-6'],
    aktiviteter: [
      { titel: 'Känslocharader', beskrivning: 'Visa en känsla med kroppen – de andra gissar.' },
      { titel: 'Komplimangcirkel', beskrivning: 'Sitt i ring och ge personen bredvid en ärlig komplimang.' },
      { titel: 'Vänskapsträd', beskrivning: 'Rita ett träd där varje löv är något som gör en bra kompis.' },
      { titel: 'Samarbetsknut', beskrivning: 'Håll varandra i händerna i en knut och lös upp den tillsammans.' },
      { titel: 'Lugn andning', beskrivning: 'Andas lugnt tillsammans och landa i kroppen efter en lek.' },
    ],
  },
  {
    id: 'varen',
    namn: 'Våren',
    emoji: '🌱',
    aldersgrupper: ['F-1', '2-3', '4-6'],
    aktiviteter: [
      { titel: 'Plantera frön', beskrivning: 'Så frön i krukor och följ hur de växer veckorna framåt.' },
      { titel: 'Vårtecken-jakt', beskrivning: 'Leta vårtecken ute: knoppar, fåglar, insekter.' },
      { titel: 'Blomsterkrans', beskrivning: 'Gör kransar och kreationer av maskrosor och löv.' },
      { titel: 'Hoppa hage', beskrivning: 'Rita hagar med krita och hoppa tillsammans.' },
      { titel: 'Fågelquiz', beskrivning: 'Känn igen vanliga vårfåglar på bild och läte.' },
    ],
  },
  {
    id: 'vintern',
    namn: 'Vintern',
    emoji: '❄️',
    aldersgrupper: ['F-1', '2-3', '4-6'],
    aktiviteter: [
      { titel: 'Snöskulpturer', beskrivning: 'Bygg figurer och skulpturer av snö i lag.' },
      { titel: 'Spårjakt i snön', beskrivning: 'Följ spår i snön – vem eller vilket djur gick här?' },
      { titel: 'Pulkastafett', beskrivning: 'Dra och åk pulka i en stafett (där det är säkert).' },
      { titel: 'Pyssla pappersstjärnor', beskrivning: 'Vik och klipp snöflingor och stjärnor av papper.' },
      { titel: 'Vinterquiz', beskrivning: 'Frågor om snö, is, djur på vintern och högtider.' },
    ],
  },
]
