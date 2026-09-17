export type Lang = 'sv-SE' | 'en-GB';

/**
 * En sak som kan sägas.
 *
 * `id` är samtidigt uppslagsnyckeln för inspelat ljud: finns id:t i
 * AUDIO_MANIFEST spelas /audio/<id>.mp3 i stället för att TTS används.
 * Ingenting i appen talar en rå sträng – allt går via en SpeechToken, och
 * det är precis det som gör att inspelningar kan läggas till senare utan
 * att en enda komponent skrivs om.
 */
export interface SpeechToken {
  id: string;
  /** Det TTS säger när inspelning saknas. */
  text: string;
  lang: Lang;
  /** Standard 0.9. Utsträckta fonem använder 0.55. */
  rate?: number;
  pitch?: number;
}
