import { useCallback, useEffect, useRef, useState } from 'react';
import type { SpeechToken } from '@/types';
import { play, playSequence, stop } from '@/lib/audio';

/**
 * Talar ett token och håller reda på om något låter just nu.
 *
 * Allt tal stoppas när komponenten avmonteras – annars fortsätter Chrome
 * prata om eleven hinner byta skärm, vilket är förvirrande när man inte kan
 * läsa vad som står på den nya.
 */
export function useSpeak() {
  const [speaking, setSpeaking] = useState(false);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      stop();
    };
  }, []);

  const speak = useCallback(async (token: SpeechToken) => {
    setSpeaking(true);
    await play(token);
    if (alive.current) setSpeaking(false);
  }, []);

  const speakAll = useCallback(async (tokens: SpeechToken[], gapMs?: number) => {
    setSpeaking(true);
    await playSequence(tokens, gapMs);
    if (alive.current) setSpeaking(false);
  }, []);

  const silence = useCallback(() => {
    stop();
    setSpeaking(false);
  }, []);

  return { speaking, speak, speakAll, silence };
}
