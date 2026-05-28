import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TextToSpeechProps {
  text: string;
  /** BCP-47 language tag, e.g. 'en-GB'. Defaults to English. */
  lang?: string;
}

const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

/**
 * Read-aloud (talsyntes) control using the browser's built-in Web Speech API.
 * No external service or API key required.
 */
export const TextToSpeech: React.FC<TextToSpeechProps> = ({ text, lang = 'en-GB' }) => {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [rate, setRate] = useState(0.95);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Pick the best available English voice once voices are loaded.
  const pickVoice = useCallback((): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;
    return (
      voices.find((v) => v.lang === lang) ||
      voices.find((v) => v.lang.startsWith('en-GB')) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      null
    );
  }, [lang]);

  // Stop speech if the text changes or the component unmounts.
  useEffect(() => {
    return () => {
      if (isSupported) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (isSupported) window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  }, [text]);

  const speak = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    const voice = pickVoice();
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      setSpeaking(false);
      setPaused(false);
    };
    utterance.onerror = () => {
      setSpeaking(false);
      setPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
    setPaused(false);
  }, [text, lang, rate, pickVoice]);

  const togglePlay = () => {
    if (!isSupported) return;
    if (!speaking) {
      speak();
    } else if (paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    } else {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  };

  const stop = () => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  };

  // Re-start with new speed if speed changes while playing.
  const changeRate = () => {
    const next = rate >= 1.1 ? 0.75 : rate >= 0.95 ? 1.1 : 0.95;
    setRate(next);
    if (speaking) {
      // restart from beginning at new rate
      window.speechSynthesis.cancel();
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = next;
        const voice = pickVoice();
        if (voice) utterance.voice = voice;
        utterance.onend = () => { setSpeaking(false); setPaused(false); };
        utterance.onerror = () => { setSpeaking(false); setPaused(false); };
        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setSpeaking(true);
        setPaused(false);
      }, 60);
    }
  };

  if (!isSupported) return null;

  const rateLabel = rate >= 1.1 ? 'Fast' : rate >= 0.95 ? 'Normal' : 'Slow';

  return (
    <div className="flex items-center gap-1.5">
      <motion.button
        onClick={togglePlay}
        className={cn(
          'px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5',
          speaking && !paused
            ? 'bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-md'
            : 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-md'
        )}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        title={speaking ? (paused ? 'Resume reading' : 'Pause reading') : 'Listen to the text'}
        aria-label={speaking ? (paused ? 'Resume reading' : 'Pause reading') : 'Listen to the text'}
      >
        <span className="text-sm leading-none">
          {speaking ? (paused ? '▶️' : '⏸️') : '🔊'}
        </span>
        <span className="hidden sm:inline">
          {speaking ? (paused ? 'Resume' : 'Pause') : 'Listen'}
        </span>
      </motion.button>

      {speaking && (
        <motion.button
          onClick={stop}
          className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          title="Stop reading"
          aria-label="Stop reading"
        >
          ⏹️
        </motion.button>
      )}

      <button
        onClick={changeRate}
        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
        title="Change reading speed"
        aria-label={`Reading speed: ${rateLabel}. Click to change.`}
      >
        {rateLabel}
      </button>
    </div>
  );
};
