import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

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

/** Prefer local/system voices — cloud voices (Chrome) skip onboundary entirely. */
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

/**
 * Wraps the browser Web Speech API and reports the character index of the
 * word currently being spoken so the UI can highlight it (karaoke style).
 *
 * Uses onboundary when available; falls back to a timer-based estimator
 * when the voice (e.g. Google cloud TTS) does not fire onboundary events.
 */
export function useSpeech(text: string, lang = 'en-GB'): UseSpeech {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [charIndex, setCharIndex] = useState(-1);
  const [rate, setRate] = useState<SpeechRate>(0.95);
  const [voicesReady, setVoicesReady] = useState(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerWordIdxRef = useRef(0);
  const boundaryFiredRef = useRef(false);

  // Wait for voices to load (Chrome loads them asynchronously)
  useEffect(() => {
    if (!speechSupported) return;
    const update = () => setVoicesReady(true);
    window.speechSynthesis.addEventListener('voiceschanged', update);
    if (window.speechSynthesis.getVoices().length > 0) setVoicesReady(true);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', update);
  }, []);

  // Pre-compute word char positions once per text
  const wordPositions = useMemo(() => {
    const positions: number[] = [];
    for (const match of text.matchAll(/\S+/g)) {
      positions.push(match.index!);
    }
    return positions;
  }, [text]);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setSpeaking(false);
    setPaused(false);
    setCharIndex(-1);
    timerWordIdxRef.current = 0;
    boundaryFiredRef.current = false;
  }, [clearTimer]);

  // Cancel speech when text changes or on unmount
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
      clearTimer();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = useRate;
      const voice = pickVoice(lang);
      if (voice) utterance.voice = voice;

      boundaryFiredRef.current = false;
      timerWordIdxRef.current = 0;

      utterance.onboundary = (e: SpeechSynthesisEvent) => {
        if (e.name !== 'word') return;
        boundaryFiredRef.current = true;
        setCharIndex(e.charIndex);
        // Sync the fallback timer index so it continues from the right word
        const idx = wordPositions.findIndex((p) => p >= e.charIndex);
        if (idx >= 0) timerWordIdxRef.current = idx + 1;
      };

      utterance.onend = reset;
      utterance.onerror = (e) => {
        if (e.error !== 'interrupted') reset();
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setSpeaking(true);
      setPaused(false);
      setCharIndex(wordPositions[0] ?? 0);
      timerWordIdxRef.current = 1;

      // Timer-based fallback: fires every ~interval ms and advances to the
      // next word. If onboundary fires, it takes over and keeps the timer in sync.
      // ~140 WPM base rate for English TTS.
      const msPerWord = Math.round(60000 / (useRate * 140));
      timerRef.current = setInterval(() => {
        const idx = timerWordIdxRef.current;
        if (idx < wordPositions.length) {
          // Only update via timer if onboundary hasn't fired recently,
          // or always advance as a safety net so karaoke never gets stuck.
          setCharIndex(wordPositions[idx]);
          timerWordIdxRef.current = idx + 1;
        } else {
          clearTimer();
        }
      }, msPerWord);
    },
    // voicesReady ensures we re-memoize once the voice list is populated
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [text, lang, reset, clearTimer, wordPositions, voicesReady]
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

  return { speaking, paused, charIndex, rate, rateLabel, toggle, stop, cycleRate };
}
