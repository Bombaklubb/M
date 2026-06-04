import { useState, useEffect, useRef, useCallback } from 'react';

export const speechSupported =
  typeof window !== 'undefined' && 'speechSynthesis' in window;

export type SpeechRate = 0.75 | 0.95 | 1.1;

export interface UseSpeech {
  speaking: boolean;
  paused: boolean;
  rate: SpeechRate;
  rateLabel: 'Slow' | 'Normal' | 'Fast';
  toggle: () => void;
  stop: () => void;
  cycleRate: () => void;
}

function pickVoice(lang: string): SpeechSynthesisVoice | null {
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

export function useSpeech(text: string, lang = 'en-GB'): UseSpeech {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [rate, setRate] = useState<SpeechRate>(0.95);
  const [voicesReady, setVoicesReady] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!speechSupported) return;
    const update = () => setVoicesReady(true);
    window.speechSynthesis.addEventListener('voiceschanged', update);
    if (window.speechSynthesis.getVoices().length > 0) setVoicesReady(true);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', update);
  }, []);

  const reset = useCallback(() => {
    setSpeaking(false);
    setPaused(false);
  }, []);

  useEffect(() => {
    if (speechSupported) window.speechSynthesis.cancel();
    reset();
    return () => {
      if (speechSupported) window.speechSynthesis.cancel();
    };
  }, [text, reset]);

  const start = useCallback(
    (useRate: SpeechRate) => {
      if (!speechSupported) return;
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = useRate;
      const voice = pickVoice(lang);
      if (voice) utterance.voice = voice;

      utterance.onend = reset;
      utterance.onerror = (e) => {
        if (e.error !== 'interrupted') reset();
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setSpeaking(true);
      setPaused(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [text, lang, reset, voicesReady]
  );

  const toggle = useCallback(() => {
    if (!speechSupported) return;
    if (!speaking) {
      start(rate);
    } else if (paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    } else {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  }, [speaking, paused, rate, start]);

  const stop = useCallback(() => {
    if (!speechSupported) return;
    window.speechSynthesis.cancel();
    reset();
  }, [reset]);

  const cycleRate = useCallback(() => {
    const next: SpeechRate = rate >= 1.1 ? 0.75 : rate >= 0.95 ? 1.1 : 0.95;
    setRate(next);
    if (speaking) start(next);
  }, [rate, speaking, start]);

  const rateLabel = rate >= 1.1 ? 'Fast' : rate >= 0.95 ? 'Normal' : 'Slow';

  return { speaking, paused, rate, rateLabel, toggle, stop, cycleRate };
}
