import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface TextWithSpeechProps {
  text: string;
  textSizeClass?: string;
  className?: string;
}

export const TextWithSpeech: React.FC<TextWithSpeechProps> = ({
  text,
  textSizeClass = 'text-base',
  className,
}) => {
  const [supported, setSupported] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const swedishVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const wordsRef = useRef<{ word: string; start: number; end: number }[]>([]);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);
  const boundaryWorkedRef = useRef(false);
  // Refs som speglar speaking/paused – läses av tick() så den alltid ser aktuellt state
  // istället för ett inaktuellt värde fångat i en gammal closure.
  const speakingRef = useRef(false);
  const pausedRef = useRef(false);
  // Sätts av utterance.onstart. Används bara för att kunna visa ett besked när
  // uppläsningen aldrig kommer igång – aldrig för att avbryta den.
  const startedRef = useRef(false);
  const [ingenUppläsning, setIngenUppläsning] = useState(false);

  useEffect(() => { speakingRef.current = speaking; }, [speaking]);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  const paragraphs = text.split('\n').filter((p) => p.trim().length > 0);

  useEffect(() => {
    const words: { word: string; start: number; end: number }[] = [];
    let pos = 0;

    for (const paragraph of text.split('\n')) {
      const matches = paragraph.matchAll(/\S+/g);
      for (const match of matches) {
        const wordStart = pos + (match.index || 0);
        words.push({
          word: match[0],
          start: wordStart,
          end: wordStart + match[0].length,
        });
      }
      pos += paragraph.length + 1;
    }
    wordsRef.current = words;
  }, [text]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSupported(false);
      return;
    }

    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const sv =
        voices.find((v) => v.lang === 'sv-SE') ||
        voices.find((v) => v.lang.toLowerCase().startsWith('sv'));
      swedishVoiceRef.current = sv || null;
    };

    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, []);

  const getWordTimings = useCallback((speechRate: number) => {
    const words = wordsRef.current;
    const totalChars = words.reduce((sum, w) => sum + w.word.length, 0);
    const charsPerSecond = 12 * speechRate;
    const totalDuration = (totalChars / charsPerSecond) * 1000;

    let cumulative = 0;
    return words.map((w) => {
      const start = cumulative;
      const duration = (w.word.length / totalChars) * totalDuration;
      cumulative += duration;
      return { start, end: cumulative };
    });
  }, []);

  // startFromElapsed = hur långt in i uppläsningen vi redan är, i millisekunder.
  // Vid återupptagning efter paus måste tidslinjen fortsätta där den pausades.
  // Tidigare nollställdes starttiden här, vilket skrev över den justering som
  // togglePause precis hade gjort – markeringen hoppade då tillbaka till första
  // ordet medan ljudet fortsatte mitt inne i texten.
  const startFallbackTimer = useCallback((speechRate: number, startFromElapsed = 0) => {
    const timings = getWordTimings(speechRate);
    startTimeRef.current = performance.now() - startFromElapsed;

    const tick = () => {
      if (!speakingRef.current || pausedRef.current) return;

      const elapsed = performance.now() - startTimeRef.current;
      const wordIdx = timings.findIndex((t) => elapsed >= t.start && elapsed < t.end);

      if (wordIdx !== -1 && !boundaryWorkedRef.current) {
        setCurrentWordIndex(wordIdx);
      }

      if (elapsed < timings[timings.length - 1]?.end) {
        timerRef.current = requestAnimationFrame(tick);
      }
    };

    timerRef.current = requestAnimationFrame(tick);
  }, [getWordTimings]);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    if (timerRef.current) cancelAnimationFrame(timerRef.current);
    speakingRef.current = false;
    pausedRef.current = false;
    setSpeaking(false);
    setPaused(false);
    setCurrentWordIndex(-1);
    setIngenUppläsning(false);
    utteranceRef.current = null;
    boundaryWorkedRef.current = false;
  }, [supported]);

  useEffect(() => {
    stop();
  }, [text, stop]);

  // Bygger en utterance med all händelsehantering samlad på ett ställe.
  // Start och hastighetsbyte byggde tidigare varsin kopia, som hann glida isär.
  const buildUtterance = useCallback((speechRate: number) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'sv-SE';
    utterance.rate = speechRate;
    if (swedishVoiceRef.current) {
      utterance.voice = swedishVoiceRef.current;
    }

    utterance.onstart = () => {
      startedRef.current = true;
      setIngenUppläsning(false);
    };

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        boundaryWorkedRef.current = true;
        const charIndex = event.charIndex;
        const wordIdx = wordsRef.current.findIndex(
          (w) => charIndex >= w.start && charIndex < w.end
        );
        if (wordIdx !== -1) {
          setCurrentWordIndex(wordIdx);
        }
      }
    };

    const avsluta = () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
      speakingRef.current = false;
      pausedRef.current = false;
      setSpeaking(false);
      setPaused(false);
      setCurrentWordIndex(-1);
      utteranceRef.current = null;
    };
    utterance.onend = avsluta;
    utterance.onerror = avsluta;

    return utterance;
  }, [text]);

  const startSpeaking = useCallback((speechRate: number) => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    if (timerRef.current) cancelAnimationFrame(timerRef.current);
    boundaryWorkedRef.current = false;
    startedRef.current = false;

    const utterance = buildUtterance(speechRate);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    speakingRef.current = true;
    pausedRef.current = false;
    setSpeaking(true);
    setPaused(false);
    setCurrentWordIndex(0);
    setIngenUppläsning(false);

    window.setTimeout(() => {
      if (!boundaryWorkedRef.current) {
        startFallbackTimer(speechRate);
      }
    }, 200);

    // Saknar enheten installerade röster rapporterar webbläsaren ändå att
    // talsyntes finns, och uppläsningen startar aldrig. Utan det här beskedet
    // ser eleven bara knappen växla till Pausa/Stoppa utan att höra något.
    // Uppläsningen avbryts inte – en långsam röstmotor får komma igång sent.
    // Kontrollen mot speakingRef behövs för den som trycker Lyssna och sedan
    // Stoppa inom tre sekunder: utan den dök beskedet upp efteråt, mitt i en
    // tyst app som ingen längre försökte lyssna på.
    window.setTimeout(() => {
      if (speakingRef.current && !startedRef.current && !boundaryWorkedRef.current) {
        setIngenUppläsning(true);
      }
    }, 3000);
  }, [supported, buildUtterance, startFallbackTimer]);

  const speak = useCallback(() => startSpeaking(rate), [startSpeaking, rate]);

  const togglePause = useCallback(() => {
    if (!supported) return;
    if (paused) {
      window.speechSynthesis.resume();
      // pausedRef sätts här och inte bara via effekten som speglar state.
      // startFallbackTimer schemalägger en animationsruta direkt, och den
      // rutan kan hinna före effekten. Låg då pausedRef kvar på true avbröt
      // tick() sig själv på första varvet och ordmarkeringen kom aldrig
      // igång igen efter en paus.
      pausedRef.current = false;
      if (!boundaryWorkedRef.current) {
        startFallbackTimer(rate, pausedAtRef.current);
      }
      setPaused(false);
    } else {
      window.speechSynthesis.pause();
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
      pausedAtRef.current = performance.now() - startTimeRef.current;
      pausedRef.current = true;
      setPaused(true);
    }
  }, [supported, paused, rate, startFallbackTimer]);

  // Byte av hastighet startar om uppläsningen med den nya farten. Sker det
  // under en paus måste pausläget släppas, annars visar knappen "Fortsätt"
  // medan ljudet spelar och ordmarkeringen står stilla.
  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    if (speaking) {
      pausedAtRef.current = 0;
      startSpeaking(newRate);
    }
  };

  // Render text with word highlighting
  const renderParagraph = (paragraph: string, paragraphIndex: number) => {
    // Calculate word offset for this paragraph
    let offset = 0;
    for (let i = 0; i < paragraphIndex; i++) {
      const p = paragraphs[i];
      offset += (p.match(/\S+/g) || []).length;
    }

    const words = paragraph.split(/(\s+)/);
    let wordCount = 0;

    return (
      <p
        key={paragraphIndex}
        className={cn(
          'leading-relaxed mb-4 last:mb-0 text-slate-700 dark:text-slate-300',
          textSizeClass
        )}
      >
        {words.map((segment, idx) => {
          if (/^\s+$/.test(segment)) {
            return <span key={idx}>{segment}</span>;
          }
          const globalWordIndex = offset + wordCount;
          wordCount++;
          const isHighlighted = speaking && globalWordIndex === currentWordIndex;

          return (
            <span
              key={idx}
              className={cn(
                'transition-all duration-75 rounded',
                isHighlighted && 'bg-gradient-to-r from-yellow-300 to-amber-300 dark:from-yellow-400 dark:to-amber-400 text-slate-900 font-semibold px-1 py-0.5 -mx-0.5 shadow-sm ring-2 ring-yellow-400/50 dark:ring-yellow-500/50'
              )}
            >
              {segment}
            </span>
          );
        })}
      </p>
    );
  };

  const baseBtn =
    'flex items-center gap-1.5 rounded-lg font-bold transition-all focus:outline-none';

  return (
    <div className={className}>
      {/* Controls */}
      {supported && (
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {!speaking ? (
            <button
              onClick={speak}
              className={`${baseBtn} px-4 py-2 text-sm bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md hover:shadow-lg hover:scale-105`}
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
                className={`${baseBtn} px-4 py-2 text-sm bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md hover:scale-105`}
                title={paused ? 'Fortsätt' : 'Pausa'}
                aria-label={paused ? 'Fortsätt uppläsning' : 'Pausa uppläsning'}
              >
                <span>{paused ? '▶️' : '⏸️'}</span>
                <span>{paused ? 'Fortsätt' : 'Pausa'}</span>
              </button>
              <button
                onClick={stop}
                className={`${baseBtn} px-4 py-2 text-sm bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600`}
                title="Stoppa"
                aria-label="Stoppa uppläsning"
              >
                <span>⏹️</span>
                <span>Stoppa</span>
              </button>
            </>
          )}

          {/* Speed control */}
          <div className="flex items-center gap-1">
            {([
              { label: '🐢', value: 0.7, title: 'Långsam' },
              { label: '1x', value: 1, title: 'Normal' },
              { label: '🐇', value: 1.3, title: 'Snabb' },
            ] as const).map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleRateChange(opt.value)}
                className={cn(
                  'w-8 h-8 rounded-md font-bold text-sm transition-all',
                  rate === opt.value
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                )}
                title={`Uppläsningshastighet: ${opt.title}`}
                aria-label={`Uppläsningshastighet ${opt.title}`}
                aria-pressed={rate === opt.value}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {ingenUppläsning && (
            <p
              role="status"
              className="w-full text-xs text-amber-700 dark:text-amber-300"
            >
              Uppläsningen kom inte igång. Enheten verkar sakna en installerad
              röst – texten går fortfarande att läsa som vanligt.
            </p>
          )}
        </div>
      )}

      {/* Text with highlighting */}
      <div className="prose prose-lg max-w-none dark:prose-invert">
        {paragraphs.map((paragraph, idx) => renderParagraph(paragraph, idx))}
      </div>
    </div>
  );
};
