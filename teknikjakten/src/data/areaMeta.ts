import { Area } from '../types';

/**
 * Områdenas namn och utseende – ren metadata utan kapitelinnehåll.
 * Ligger i en egen fil så att AppContext kan använda den utan att dra in
 * all kapiteldata i startpaketet (se areas.ts).
 *
 * TOM TILLS VIDARE: områdesindelningen bestäms när innehållsförteckningen
 * är klar. Lägg till ett område så här – ingen CSS behöver röras, färgerna
 * räknas fram ur accentHex i utils/theme.ts:
 *
 *   {
 *     id: 'material',
 *     name: 'Material och konstruktion',
 *     shortName: 'MK',
 *     emoji: '🧱',
 *     accentHex: '#c2410c',
 *     inkHex: '#431407',
 *     progressHex: '#c2410c',
 *   }
 *
 * Områdets id måste matcha områdesdelen i kapitlens id (`ak4-material-...`).
 */
export const AREAS: Area[] = [];
