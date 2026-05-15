import { useState, useEffect, useRef } from 'react';
import { BookOpen, Volume2, VolumeX } from 'lucide-react';

function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const cancelled = useRef(false);

  useEffect(() => {
    return () => { cancelled.current = true; window.speechSynthesis.cancel(); };
  }, []);

  function speakList(lines: string[]) {
    window.speechSynthesis.cancel();
    cancelled.current = false;
    setSpeaking(true);

    function speakOne(i: number) {
      if (cancelled.current || i >= lines.length) {
        setSpeaking(false);
        setActiveIdx(null);
        return;
      }
      setActiveIdx(i);
      const utt = new SpeechSynthesisUtterance(lines[i]);
      utt.lang = 'sv-SE';
      utt.rate = 0.92;
      utt.onend = () => speakOne(i + 1);
      utt.onerror = () => { setSpeaking(false); setActiveIdx(null); };
      window.speechSynthesis.speak(utt);
    }
    speakOne(0);
  }

  function stop() {
    cancelled.current = true;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setActiveIdx(null);
  }

  return { speaking, activeIdx, speakList, stop };
}

export default function KeyPointsTab({ keyPoints, accentHex, progressHex, textClass }: {
  keyPoints: string[];
  accentHex: string;
  progressHex: string;
  textClass: string;
}) {
  const { speaking, activeIdx, speakList, stop } = useSpeech();

  function handleToggle() {
    if (speaking) { stop(); return; }
    speakList(keyPoints);
  }

  return (
    <div className="clay-card p-5 space-y-3">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className={textClass} />
          <h2 className="font-heading font-bold text-gray-800">Det viktigaste att veta</h2>
        </div>
        <button
          onClick={handleToggle}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 cursor-pointer"
          style={speaking
            ? { background: `${progressHex}20`, border: `2px solid ${progressHex}50`, color: progressHex }
            : { background: '#f3f4f6', border: '2px solid #e5e7eb', color: '#6b7280' }
          }
          aria-label={speaking ? 'Stoppa uppläsning' : 'Läs upp'}
        >
          {speaking
            ? <><VolumeX size={13} /> Stoppa</>
            : <><Volume2 size={13} /> Lyssna</>
          }
        </button>
      </div>
      {keyPoints.map((point, i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-xl px-2 py-1 transition-colors"
          style={activeIdx === i ? { background: `${progressHex}12` } : {}}
        >
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0 mt-0.5 transition-all"
            style={{ background: activeIdx === i ? progressHex : accentHex }}
          >
            {i + 1}
          </span>
          <p
            className="text-sm font-semibold leading-relaxed transition-colors"
            style={{ color: activeIdx === i ? '#111827' : '#374151' }}
          >
            {point}
          </p>
        </div>
      ))}
    </div>
  );
}
