import { Area } from '../types';

/**
 * Områdenas namn och utseende – ren metadata utan kapitelinnehåll.
 * Ligger i en egen fil så att startsidan kan använda den utan att dra in
 * kapiteldatan i startpaketet (se areas.ts).
 *
 * Områdena följer bokens sju delar. Färgerna räknas fram ur accentHex i
 * utils/theme.ts, så ett område kräver ingen egen CSS.
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
    accentHex: '#ea580c',
    inkHex: '#431407',
    progressHex: '#ea580c',
    chapterCount: 4,
  },
  {
    id: 'bostad',
    name: 'Bostadens teknik',
    shortName: 'BT',
    emoji: '🏠',
    accentHex: '#0d9488',
    inkHex: '#042f2e',
    progressHex: '#0d9488',
    chapterCount: 0,
  },
  {
    id: 'vardag',
    name: 'Teknik i vardagen',
    shortName: 'TV',
    emoji: '💡',
    accentHex: '#dc2626',
    inkHex: '#450a0a',
    progressHex: '#dc2626',
    chapterCount: 0,
  },
  {
    id: 'utveckling',
    name: 'Teknikutveckling',
    shortName: 'TU',
    emoji: '✏️',
    accentHex: '#4f46e5',
    inkHex: '#1e1b4b',
    progressHex: '#4f46e5',
    chapterCount: 0,
  },
  {
    id: 'rorelse',
    name: 'Teknik i rörelse',
    shortName: 'TR',
    emoji: '⚙️',
    accentHex: '#db2777',
    inkHex: '#500724',
    progressHex: '#db2777',
    chapterCount: 0,
  },
  {
    id: 'system',
    name: 'Tekniska system',
    shortName: 'TS',
    emoji: '🏭',
    accentHex: '#0284c7',
    inkHex: '#082f49',
    progressHex: '#0284c7',
    chapterCount: 0,
  },
  {
    id: 'digital',
    name: 'Digital teknik',
    shortName: 'DT',
    emoji: '💻',
    accentHex: '#16a34a',
    inkHex: '#052e16',
    progressHex: '#16a34a',
    chapterCount: 0,
  },
];
