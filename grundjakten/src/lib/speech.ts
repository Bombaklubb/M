import type { Lang } from '@/types';

/**
 * Gemensam grund för talsyntes.
 *
 * Mönstret är hämtat från readhunt/src/lib/speech.ts: ordningen getVoices()
 * returnerar bestäms av operativsystemet och säger ingenting om kvalitet, så
 * den första posten är ofta den gamla robotrösten även när en bättre finns
 * installerad. Lokala röster föredras för att de startar utan nätanrop – på en
 * skol-Chromebook med trög uppkoppling är det skillnaden mellan direkt ljud
 * och en halv sekunds tystnad.
 */

export const speechSupported =
  typeof window !== 'undefined' && 'speechSynthesis' in window;

export function pickVoice(lang: Lang): SpeechSynthesisVoice | null {
  if (!speechSupported) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const prefix = lang.slice(0, 2);
  return (
    voices.find((v) => v.localService && v.lang === lang) ||
    voices.find((v) => v.localService && v.lang.replace('_', '-').startsWith(prefix)) ||
    voices.find((v) => v.lang === lang) ||
    voices.find((v) => v.lang.replace('_', '-').startsWith(prefix)) ||
    null
  );
}

/**
 * Finns det någon svensk röst alls på den här enheten?
 *
 * Skol-Chromebooks har sv-SE, men en lärare som förhandsgranskar på en
 * Linux-laptop kan sakna den helt. Lärarläget visar en varning när detta är
 * false – appen fungerar fortfarande, men med fel uttal.
 */
export function hasSwedishVoice(): boolean {
  if (!speechSupported) return false;
  return window.speechSynthesis
    .getVoices()
    .some((v) => v.lang.replace('_', '-').toLowerCase().startsWith('sv'));
}

/** Röstlistan fylls asynkront i Chrome. Anropas en gång vid uppstart. */
export function onVoicesReady(cb: () => void): () => void {
  if (!speechSupported) return () => {};
  if (window.speechSynthesis.getVoices().length > 0) cb();
  const handler = () => cb();
  window.speechSynthesis.addEventListener('voiceschanged', handler);
  return () => window.speechSynthesis.removeEventListener('voiceschanged', handler);
}
