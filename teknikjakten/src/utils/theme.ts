import type { Area } from '../types';

/**
 * Områdenas färger räknas fram ur areaMeta.ts i stället för att skrivas som
 * egna CSS-klasser per område. Ett nytt område kräver därför bara en post där –
 * ingen ny CSS.
 *
 * Appen har två sorters ytor, och det styr vilken av områdets färger som gäller:
 *   mörk rymdyta  -> glowHex för text, accentHex för kanter och glöd
 *   ljust kort    -> inkHex för text, progressHex för fyllnader
 */

/** Rymdpaletten, samma värden som i index.css. */
export const SPACE = {
  deepest: '#00040e',
  deep: '#030c1c',
  panel: '#02162f',
  navy: '#0e375d',
  steel: '#2b4662',
  haze: '#487094',
  atmosphere: '#90b2cc',
  beam: '#1b80c2',
  beamBright: '#38bdf8',
  gold: '#f5b642',
  /** Ljus text mot mörk bakgrund. */
  onDark: '#e6f0fb',
  /** Dämpad ljus text mot mörk bakgrund. */
  onDarkMuted: '#a9c2dc',
} as const;

/** '#1b80c2' + 0.12 -> 'rgba(27,128,194,0.12)'. Tål både #abc och #aabbcc. */
export function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  if ([r, g, b].some(Number.isNaN)) return hex;
  return `rgba(${r},${g},${b},${alpha})`;
}

/**
 * Bakgrund för hela områdessidan: rymden, tonad mot områdets färg så att varje
 * område känns igen utan att texten tappar kontrast.
 */
export function pageStyle(area: Area): React.CSSProperties {
  return {
    background: `linear-gradient(170deg, ${SPACE.deepest} 0%, ${SPACE.deep} 40%, ${withAlpha(area.accentHex, 0.1)} 78%, ${withAlpha(area.accentHex, 0.18)} 100%), ${SPACE.deep}`,
    backgroundAttachment: 'fixed',
  };
}

/** Rubrikfältet högst upp på områdets sidor. */
export function headerStyle(area: Area): React.CSSProperties {
  return {
    background: `linear-gradient(180deg, ${withAlpha(SPACE.panel, 0.95)} 0%, ${withAlpha(SPACE.panel, 0.82)} 100%)`,
    backdropFilter: 'blur(20px)',
    borderBottom: `2px solid ${withAlpha(area.accentHex, 0.45)}`,
    boxShadow: `0 2px 24px ${withAlpha(SPACE.deepest, 0.7)}`,
  };
}

/**
 * Områdeskortet på startsidan – en upplyst panel mot rymden, i stil med
 * stationens moduler.
 */
export function cardStyle(area: Area): React.CSSProperties {
  return {
    background: `linear-gradient(150deg, ${withAlpha(SPACE.panel, 0.92)} 0%, ${withAlpha(SPACE.navy, 0.85)} 55%, ${withAlpha(area.accentHex, 0.22)} 100%)`,
    borderColor: withAlpha(area.accentHex, 0.55),
    boxShadow: `0 6px 0 ${withAlpha(SPACE.deepest, 0.65)}, 0 12px 34px ${withAlpha(SPACE.deepest, 0.6)}, inset 0 1px 0 ${withAlpha(area.glowHex, 0.35)}, 0 0 26px ${withAlpha(area.accentHex, 0.22)}`,
  };
}
