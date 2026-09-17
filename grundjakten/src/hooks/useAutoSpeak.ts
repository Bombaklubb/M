import { useEffect } from 'react';
import type { SpeechToken } from '@/types';
import { play, stop } from '@/lib/audio';

/**
 * Säger ett token en gång när uppgiften visas.
 *
 * Eleven kan inte läsa instruktionen, så den måste komma av sig själv – att
 * kräva ett tryck på öronknappen först skulle betyda att en elev som inte
 * förstår ikonen fastnar direkt.
 */
export function useAutoSpeak(token: SpeechToken | null, enabled = true): void {
  useEffect(() => {
    if (!token || !enabled) return;
    const timer = window.setTimeout(() => {
      void play(token);
    }, 250);
    return () => {
      window.clearTimeout(timer);
      stop();
    };
  }, [token?.id, token?.text, enabled]); // eslint-disable-line react-hooks/exhaustive-deps
}
