import { Subject } from '../types';

/**
 * Ämnenas utseende och namn – ren metadata utan kapitelinnehåll.
 * Ligger i en egen fil så att AppContext kan använda den utan att dra in
 * alla kapiteldata i startpaketet (se subjects.ts).
 */
export const SUBJECTS: Subject[] = [
  {
    id: 'historia',
    name: 'Historia',
    shortName: 'HI',
    emoji: '⚔️',
    cardClass: 'clay-historia',
    accentHex: '#c08a2c',
    textClass: 'text-amber-900',
    headingFont: 'font-historia',
    pageBgClass: 'page-bg-historia',
    headerClass: 'header-historia',
    inkHex: '#2d1d0c',
    progressHex: '#c08a2c',
  },
  {
    id: 'geografi',
    name: 'Geografi',
    shortName: 'GE',
    emoji: '🌍',
    cardClass: 'clay-geografi',
    accentHex: '#1f7a4d',
    textClass: 'text-emerald-900',
    headingFont: 'font-geografi',
    pageBgClass: 'page-bg-geografi',
    headerClass: 'header-geografi',
    inkHex: '#0a3525',
    progressHex: '#1f7a4d',
  },
  {
    id: 'religion',
    name: 'Religionskunskap',
    shortName: 'RE',
    emoji: '🕊️',
    cardClass: 'clay-religion',
    accentHex: '#5b2a86',
    textClass: 'text-violet-900',
    headingFont: 'font-religion',
    pageBgClass: 'page-bg-religion',
    headerClass: 'header-religion',
    inkHex: '#1c0e2e',
    progressHex: '#5b2a86',
  },
  {
    id: 'samhalle',
    name: 'Samhällskunskap',
    shortName: 'SH',
    emoji: '🏛️',
    cardClass: 'clay-samhalle',
    accentHex: '#1d4dd6',
    textClass: 'text-blue-900',
    headingFont: 'font-samhalle',
    pageBgClass: 'page-bg-samhalle',
    headerClass: 'header-samhalle',
    inkHex: '#0a0a14',
    progressHex: '#1d4dd6',
  },
];
