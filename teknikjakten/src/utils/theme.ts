import type { Area } from '../types';

/**
 * Områdenas färger räknas fram ur accentHex i stället för att skrivas som egna
 * CSS-klasser per område. Ett nytt område kräver därför bara en post i
 * data/areaMeta.ts – ingen ny CSS.
 */

/** '#1d4dd6' + 0.12 -> 'rgba(29,77,214,0.12)'. Tål både #abc och #aabbcc. */
export function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  if ([r, g, b].some(Number.isNaN)) return hex;
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Bakgrund för hela områdessidan. */
export function pageStyle(area: Area): React.CSSProperties {
  return {
    background: `linear-gradient(160deg, ${withAlpha(area.accentHex, 0.06)} 0%, ${withAlpha(area.accentHex, 0.13)} 45%, ${withAlpha(area.accentHex, 0.2)} 100%)`,
    backgroundAttachment: 'fixed',
  };
}

/** Rubrikfältet högst upp på områdets sidor. */
export function headerStyle(area: Area): React.CSSProperties {
  return {
    background: withAlpha(area.accentHex, 0.14),
    backdropFilter: 'blur(20px)',
    borderBottom: `2px solid ${withAlpha(area.accentHex, 0.35)}`,
    boxShadow: `0 2px 20px ${withAlpha(area.inkHex, 0.12)}`,
  };
}

/** Områdeskortet på områdesväljaren. */
export function cardStyle(area: Area): React.CSSProperties {
  return {
    background: `linear-gradient(145deg, ${withAlpha(area.accentHex, 0.1)} 0%, ${withAlpha(area.accentHex, 0.18)} 60%, ${withAlpha(area.accentHex, 0.26)} 100%)`,
    borderColor: withAlpha(area.accentHex, 0.45),
    boxShadow: `0 6px 0 ${withAlpha(area.inkHex, 0.55)}, 0 10px 30px ${withAlpha(area.accentHex, 0.28)}, inset 0 1px 0 rgba(255,255,255,0.8)`,
  };
}
