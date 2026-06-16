import type { RorelseKategori } from '../types'

// Modul 6 – Rörelsebanken. Lekar grupperade efter situation/årstid.
export const RORELSEBANKEN: RorelseKategori[] = [
  {
    namn: 'Regniga dagar',
    emoji: '🌧️',
    lekar: [
      { namn: 'Ståupp-stafett', beskrivning: 'Lagen reser sig och sätter sig i tur och ordning – snabbast vinner.' },
      { namn: 'Dansstopp', beskrivning: 'Dansa till musiken, frys när den stannar.' },
      { namn: 'Rörelsememory', beskrivning: 'Matchande kort visar en rörelse alla gör tillsammans.' },
      { namn: 'Charader', beskrivning: 'Visa ett ord eller djur med kroppen – de andra gissar.' },
      { namn: 'Följa John', beskrivning: 'Alla härmar ledarens rörelser i en lång rad.' },
    ],
  },
  {
    namn: 'Små ytor',
    emoji: '📦',
    lekar: [
      { namn: 'Spegeln', beskrivning: 'Två och två – en gör rörelser, den andra härmar.' },
      { namn: 'Hela havet stormar', beskrivning: 'En stol färre varje runda – den utan stol vilar.' },
      { namn: 'Tysta leken', beskrivning: 'Skicka en rörelse runt ringen utan att prata.' },
      { namn: 'Stol-yoga', beskrivning: 'Lugna stretchövningar som går att göra vid sin plats.' },
      { namn: 'Kungen befaller', beskrivning: 'Gör bara rörelsen om ledaren säger "kungen befaller".' },
    ],
  },
  {
    namn: 'Stora ytor',
    emoji: '🏟️',
    lekar: [
      { namn: 'Capture the Flag', beskrivning: 'Två lag försöker ta varandras flagga utan att bli kullade.' },
      { namn: 'Kullvarianter', beskrivning: 'Vanlig kull, kedjekull, krokodilkull eller fryskull.' },
      { namn: 'Stafetter', beskrivning: 'Spring, hoppa eller åla i lag mot mållinjen.' },
      { namn: 'Under hökens vingar', beskrivning: 'Höken fångar duvorna när de springer över planen.' },
      { namn: 'Brännboll', beskrivning: 'Klassisk lagsport med slag och löpning mellan baser.' },
    ],
  },
  {
    namn: 'Vinter',
    emoji: '❄️',
    lekar: [
      { namn: 'Snöskulpturer', beskrivning: 'Bygg figurer av snö i lag.' },
      { namn: 'Spårjakt', beskrivning: 'Följ spår i snön och lista ut vem som gått där.' },
      { namn: 'Pulkarejs', beskrivning: 'Åk pulka på säkra backar – gärna som stafett.' },
      { namn: 'Snöbollskorg', beskrivning: 'Kasta snöbollar i en hink eller på ett mål.' },
      { namn: 'Ängel i snön', beskrivning: 'Gör snöänglar och andra avtryck i snön.' },
    ],
  },
  {
    namn: 'Lugna stunder',
    emoji: '😌',
    lekar: [
      { namn: 'Massageramsor', beskrivning: 'Rita ramsan på kompisens rygg.' },
      { namn: 'Yoga-saga', beskrivning: 'Lugna rörelser till en berättelse.' },
      { namn: 'Andningsövning', beskrivning: 'Andas lugnt tillsammans och varva ner.' },
      { namn: 'Lyssna på naturen', beskrivning: 'Sitt still och räkna ljuden ni hör.' },
    ],
  },
  {
    namn: 'Bollekar',
    emoji: '⚽',
    lekar: [
      { namn: 'Killerball', beskrivning: 'Träffa varandra med en mjuk boll – sist kvar vinner.' },
      { namn: 'Stå-still-bollen', beskrivning: 'Kasta upp bollen och ropa ett namn; alla springer tills den fångas.' },
      { namn: 'Bollstafett', beskrivning: 'Skicka bollen över och under i ledet.' },
      { namn: 'Måltävling', beskrivning: 'Skjut eller kasta bollen på mål för poäng.' },
    ],
  },
]
