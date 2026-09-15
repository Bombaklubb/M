/**
 * Gemensam grund för uppläsning.
 *
 * Röstvalet låg tidigare bara i TextWithSpeech. När frågorna också skulle
 * kunna läsas upp hade logiken annars funnits i två kopior, och en elev hade
 * riskerat att få en bra röst på texten och en sämre på frågan.
 */

/**
 * Rangordnar de svenska rösterna webbläsaren erbjuder.
 *
 * Ordningen i getVoices() bestäms av operativsystemet och har inget med
 * kvalitet att göra, så den första i listan är ofta den gamla robotrösten
 * trots att en betydligt bättre finns installerad på samma dator.
 *
 * Två saker skiljer rösterna åt i praktiken:
 *
 *  - Nätverksröster (localService === false) körs hos leverantören och låter
 *    nästan alltid mjukare än de som ligger lokalt i systemet.
 *  - Namnet avslöjar ofta motorn. Natural, Neural, Wavenet och Enhanced
 *    bygger på nyare syntes, medan eSpeak och "compact" är de hackiga.
 *
 * Poängen är medvetet grov. Vilka röster som finns skiljer sig mellan
 * Chromebooks och går inte att förutse, så vi rankar det som faktiskt går att
 * läsa av i stället för att hårdkoda ett röstnamn.
 */
export function rostPoang(rost: SpeechSynthesisVoice): number {
  const namn = rost.name.toLowerCase();
  let poang = 0;

  if (rost.lang.toLowerCase() === 'sv-se') poang += 4;
  if (!rost.localService) poang += 6;
  if (/natural|neural|wavenet|enhanced|premium|studio/.test(namn)) poang += 5;
  if (namn.includes('google')) poang += 3;
  if (/espeak|compact|eloquence/.test(namn)) poang -= 8;

  return poang;
}

/** Bästa tillgängliga svenska röst, eller null om ingen finns. */
export function valjSvenskRost(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const svenska = window.speechSynthesis
    .getVoices()
    .filter((v) => v.lang.toLowerCase().startsWith('sv'));
  if (svenska.length === 0) return null;
  return [...svenska].sort((a, b) => rostPoang(b) - rostPoang(a))[0];
}

/** Finns talsyntes över huvud taget i den här webbläsaren? */
export function talstodFinns(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}
