import { useState, useEffect, useRef, useCallback } from 'react';

export const speechSupported =
  typeof window !== 'undefined' && 'speechSynthesis' in window;

export type SpeechRate = 0.75 | 0.95 | 1.1;

export interface UseSpeech {
  speaking: boolean;
  paused: boolean;
  /** Character index in the source text of the word currently being spoken, or -1. */
  charIndex: number;
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
    voices.find((v) => v.lang === lang) ||
    voices.find((v) => v.lang.startsWith('en-GB')) ||
    voices.find((v) => v.lang.startsWith('en')) ||
    null
  );
}

/**
 * Wraps the browser Web Speech API and reports the character index of the
 * word currently being spoken so the UI can highlight it (karaoke style).
 */
export function useSpeech(text: string, lang = 'en-GB'): UseSpeech {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [charIndex, setCharIndex] = useState(-1);
  const [rate, setRate] = useState<SpeechRate>(0.95);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const reset = useCallback(() => {
    setSpeaking(false);
    setPaused(false);
    setCharIndex(-1);
  }, []);

  // Cancel speech when the text changes or on unmount.
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

      utterance.onboundary = (e: SpeechSynthesisEvent) => {
        if (e.name === 'word' || e.charIndex !== undefined) {
          setCharIndex(e.charIndex);
        }
      };
      utterance.onend = reset;
      utterance.onerror = reset;

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setSpeaking(true);
      setPaused(false);
      setCharIndex(0);
    },
    [text, lang, reset]
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
    if (speaking) start(next); // restart at new speed
  }, [rate, speaking, start]);

  const rateLabel = rate >= 1.1 ? 'Fast' : rate >= 0.95 ? 'Normal' : 'Slow';

  return { speaking, paused, charIndex, rate, rateLabel, toggle, stop, cycleRate };
}
