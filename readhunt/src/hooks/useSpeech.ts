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
 * Strategy:
 *  1. onboundary (perfectly synced) — used when the voice supports it.
 *     The first boundary event disables the fallback timer immediately.
 *  2. Char-position timer fallback — accumulates *actual speaking time*
 *     (frozen during pause) and estimates which word is spoken from
 *     characters-per-second. Word length is respected naturally.
 */
export function useSpeech(text: string, lang = 'en-GB'): UseSpeech {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [charIndex, setCharIndex] = useState(-1);
  const [rate, setRate] = useState<SpeechRate>(0.95);
  const [voicesReady, setVoicesReady] = useState(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const usingTimerRef = useRef(true);
  const pausedRef = useRef(false);

  // Accumulated *speaking* time, excluding pauses
  const elapsedRef = useRef(0);
  const lastTickRef = useRef(0);
  const charsPerSecRef = useRef(13);

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
    usingTimerRef.current = true;
    pausedRef.current = false;
    elapsedRef.current = 0;
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

      usingTimerRef.current = true;
      pausedRef.current = false;
      elapsedRef.current = 0;
      lastTickRef.current = performance.now();
      // English TTS ~13 chars/sec at rate 1.0; scales with the rate.
      charsPerSecRef.current = useRate * 13;

      utterance.onboundary = (e: SpeechSynthesisEvent) => {
        if (e.name !== 'word') return;
        // onboundary works — switch off the timer estimator for perfect sync
        if (usingTimerRef.current) {
          usingTimerRef.current = false;
          clearTimer();
        }
        setCharIndex(e.charIndex);
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

      timerRef.current = setInterval(() => {
        if (!usingTimerRef.current) return; // onboundary took over
        const now = performance.now();
        // Only accumulate time while actually speaking (frozen during pause)
        if (!pausedRef.current) {
          elapsedRef.current += now - lastTickRef.current;
        }
        lastTickRef.current = now;
        if (pausedRef.current) return;

        const estimatedCharPos = (elapsedRef.current / 1000) * charsPerSecRef.current;
        let idx = 0;
        for (let i = 0; i < wordPositions.length; i++) {
          if (wordPositions[i] <= estimatedCharPos) idx = i;
          else break;
        }
        setCharIndex(wordPositions[idx]);
        if (idx >= wordPositions.length - 1) clearTimer();
      }, 50);
    },
    // voicesReady ensures re-memoize once voice list is populated
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [text, lang, reset, clearTimer, wordPositions, voicesReady]
  );

  const toggle = useCallback(() => {
    if (!speechSupported) return;
    if (!speaking) {
      start(rate);
    } else if (paused) {
      // Resume
      pausedRef.current = false;
      lastTickRef.current = performance.now();
      window.speechSynthesis.resume();
      setPaused(false);
    } else {
      // Pause — freeze the karaoke timer too
      pausedRef.current = true;
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
