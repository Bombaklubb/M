/**
 * Elevens figurer.
 *
 * Listan ligger här och inte i inloggningsvyn därför att den används på tre
 * ställen: när eleven skapas, och i figurväljaren på startsidan och
 * framstegssidan. Två kopior skulle betyda att en elev kan välja en figur vid
 * inloggningen som väljaren inte känner igen.
 *
 * Medvetet djur med attityd, inga gulliga småbarnsfigurer. Tioåringen sitter
 * bredvid klasskamrater som ser hennes skärm.
 */
export const AVATARER = [
  '🦊', '🐻', '🦅', '🐺', '🦁', '🐯',
  '🦈', '🐲', '🦉', '🐙', '🦎', '🐆',
];

/** Figuren en ny elev får om inget annat väljs. */
export const STANDARD_AVATAR = AVATARER[0];
