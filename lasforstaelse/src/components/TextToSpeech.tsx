import React, { useState, useEffect, useRef, useCallback } from 'react';

interface TextToSpeechProps {
  text: string;
  /** Kompakt variant används i quizvyn där utrymmet är mindre */
  compact?: boolean;
  className?: string;
}

/**
 * Talsyntes som läser upp texten med webbläsarens inbyggda röster (Web Speech API).
 * Väljer automatiskt en svensk röst om en sådan finns. Inga externa beroenden.
 */
export const TextToSpeech: React.FC<TextToSpeechProps> = ({ text, compact = false, className }) => {
  const [supported, setSupported] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const swedishVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // Kontrollera stöd och hämta svensk röst
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSupported(false);
      return;
    }

    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      // Föredra svensk röst (sv-SE), annars vilken sv som helst
      const sv =
        voices.find((v) => v.lang === 'sv-SE') ||
        voices.find((v) => v.lang.toLowerCase().startsWith('sv'));
      swedishVoiceRef.current = sv || null;
    };

    pickVoice();
    // Rösterna laddas ofta asynkront
    window.speechSynthesis.onvoiceschanged = pickVoice;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, []);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  }, [supported]);

  // Stoppa uppläsning om texten byts (ny text laddas)
  useEffect(() => {
    stop();
  }, [text, stop]);

  const speak = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'sv-SE';
    utterance.rate = rate;
    if (swedishVoiceRef.current) {
      utterance.voice = swedishVoiceRef.current;
    }
    utterance.onend = () => {
      setSpeaking(false);
      setPaused(false);
    };
    utterance.onerror = () => {
      setSpeaking(false);
      setPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
    setPaused(false);
  }, [supported, text, rate]);

  const togglePause = useCallback(() => {
    if (!supported) return;
    if (paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    } else {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  }, [supported, paused]);

  // Ändra hastighet under pågående uppläsning -> starta om med nya hastigheten
  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    if (speaking) {
      // Starta om uppläsningen med ny hastighet
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'sv-SE';
      utterance.rate = newRate;
      if (swedishVoiceRef.current) {
        utterance.voice = swedishVoiceRef.current;
      }
      utterance.onend = () => {
        setSpeaking(false);
        setPaused(false);
      };
      utterance.onerror = () => {
        setSpeaking(false);
        setPaused(false);
      };
      window.speechSynthesis.speak(utterance);
      setSpeaking(true);
      setPaused(false);
    }
  };

  if (!supported) {
    return null;
  }

  const baseBtn =
    'flex items-center gap-1.5 rounded-lg font-bold transition-all whileHover focus:outline-none';

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className || ''}`}>
      {!speaking ? (
        <button
          onClick={speak}
          className={`${baseBtn} ${
            compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
          } bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md hover:shadow-lg hover:scale-105`}
          title="Lyssna på texten"
          aria-label="Lyssna på texten"
        >
          <span>🔊</span>
          <span>Lyssna</span>
        </button>
      ) : (
        <>
          <button
            onClick={togglePause}
            className={`${baseBtn} ${
              compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
            } bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md hover:scale-105`}
            title={paused ? 'Fortsätt' : 'Pausa'}
            aria-label={paused ? 'Fortsätt uppläsning' : 'Pausa uppläsning'}
          >
            <span>{paused ? '▶️' : '⏸️'}</span>
            <span>{paused ? 'Fortsätt' : 'Pausa'}</span>
          </button>
          <button
            onClick={stop}
            className={`${baseBtn} ${
              compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
            } bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600`}
            title="Stoppa"
            aria-label="Stoppa uppläsning"
          >
            <span>⏹️</span>
            {!compact && <span>Stoppa</span>}
          </button>
        </>
      )}

      {/* Hastighetskontroll */}
      <div className="flex items-center gap-1">
        {([
          { label: '🐢', value: 0.7, title: 'Långsam' },
          { label: '1x', value: 1, title: 'Normal' },
          { label: '🐇', value: 1.3, title: 'Snabb' },
        ] as const).map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleRateChange(opt.value)}
            className={`rounded-md font-bold transition-all ${
              compact ? 'w-7 h-7 text-xs' : 'w-8 h-8 text-sm'
            } ${
              rate === opt.value
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
            }`}
            title={`Uppläsningshastighet: ${opt.title}`}
            aria-label={`Uppläsningshastighet ${opt.title}`}
            aria-pressed={rate === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};
