import { Area } from '../types';

/**
 * Områdenas namn och utseende – ren metadata utan kapitelinnehåll.
 * Ligger i en egen fil så att startsidan kan använda den utan att dra in
 * kapiteldatan i startpaketet (se areas.ts).
 *
 * Områdena följer bokens sju delar. Färgerna är valda ur startsidans
 * bakgrundsbild: stationens cyan lampor, jordens atmosfärsljus, stadsljusens
 * guld, nebulosans violetta toner och skrovets stålblå.
 *
 * Varje område har tre färger eftersom appen har både mörka och ljusa ytor:
 *   glowHex     ljus  – text och ikoner mot rymdbakgrunden
 *   accentHex   mellan – panelkanter, glöd, fyllnader
 *   inkHex      mörk  – text inuti de ljusa korten
 *
 * `chapterCount` måste stämma med antalet kapitel i areas.ts – kör
 * `npm run check` efter varje ändring. Ett område med 0 kapitel döljs för
 * eleven i stället för att visas som en tom återvändsgränd.
 */
export const AREAS: Area[] = [
  {
    id: 'grunder',
    name: 'Vad är teknik?',
    shortName: 'VT',
    emoji: '🔧',
    accentHex: '#f5b642',
    glowHex: '#fbd07a',
    inkHex: '#5b3602',
    progressHex: '#f5b642',
    chapterCount: 4,
  },
  {
    id: 'bostad',
    name: 'Bostadens teknik',
    shortName: 'BT',
    emoji: '🏠',
    accentHex: '#2dd4bf',
    glowHex: '#7ff0e2',
    inkHex: '#0a4a44',
    progressHex: '#14b8a6',
    chapterCount: 5,
  },
  {
    id: 'vardag',
    name: 'Teknik i vardagen',
    shortName: 'TV',
    emoji: '💡',
    accentHex: '#38bdf8',
    glowHex: '#8ad8fc',
    inkHex: '#0b4a6e',
    progressHex: '#0ea5e9',
    chapterCount: 9,
  },
  {
    id: 'utveckling',
    name: 'Teknikutveckling',
    shortName: 'TU',
    emoji: '✏️',
    accentHex: '#a78bfa',
    glowHex: '#c9b6ff',
    inkHex: '#3b1d80',
    progressHex: '#8b5cf6',
    chapterCount: 7,
  },
  {
    id: 'rorelse',
    name: 'Teknik i rörelse',
    shortName: 'TR',
    emoji: '⚙️',
    accentHex: '#f472b6',
    glowHex: '#fbb0d4',
    inkHex: '#6b1440',
    progressHex: '#ec4899',
    chapterCount: 7,
  },
  {
    id: 'system',
    name: 'Tekniska system',
    shortName: 'TS',
    emoji: '🏭',
    accentHex: '#7dabd6',
    glowHex: '#b3d3ee',
    inkHex: '#123a63',
    progressHex: '#3b82f6',
    chapterCount: 9,
  },
  {
    id: 'digital',
    name: 'Digital teknik',
    shortName: 'DT',
    emoji: '💻',
    accentHex: '#4ade80',
    glowHex: '#9bf0b8',
    inkHex: '#0a5132',
    progressHex: '#22c55e',
    chapterCount: 0,
  },
];
