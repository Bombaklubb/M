/**
 * Shared ground for speech synthesis.
 *
 * Voice selection used to live inside useSpeech. Now that the question and the
 * answer options can be read out as well, keeping it there would have meant two
 * copies of the same logic — and a student could end up with a good voice on
 * the text and a worse one on the question.
 */

export const speechSupported =
  typeof window !== 'undefined' && 'speechSynthesis' in window;

/**
 * Picks a voice for the given language.
 *
 * The order getVoices() returns is decided by the operating system and says
 * nothing about quality, so the first entry is often the old robotic voice even
 * when a far better one is installed. Local voices are preferred because they
 * start without a network round trip, and English is the fallback throughout
 * since every text in the app is in English.
 */
export function pickVoice(lang: string): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  return (
    voices.find((v) => v.localService && v.lang === lang) ||
    voices.find((v) => v.localService && v.lang.startsWith('en-GB')) ||
    voices.find((v) => v.localService && v.lang.startsWith('en')) ||
    voices.find((v) => v.lang === lang) ||
    voices.find((v) => v.lang.startsWith('en-GB')) ||
    voices.find((v) => v.lang.startsWith('en')) ||
    null
  );
}
