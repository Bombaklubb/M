import { useState } from 'react';
import { getTeacherPin } from '@/lib/storage';

/**
 * PIN-grinden till lärarläget.
 *
 * Knappsats i stället för textfält: ett textfält skulle dra upp Chromebookens
 * skärmtangentbord och se ut som något eleven ska fylla i. Efter tre fel blir
 * det tio sekunders paus – utan felmeddelande, bara en skakning.
 */
export function TeacherLoginView({
  onUnlock,
  onCancel,
}: {
  onUnlock: () => void;
  onCancel: () => void;
}) {
  const [entry, setEntry] = useState('');
  const [wrong, setWrong] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);

  const locked = Date.now() < lockedUntil;

  const pressDigit = (d: string) => {
    if (locked) return;
    const next = (entry + d).slice(0, 4);
    setEntry(next);
    if (next.length === 4) {
      if (next === getTeacherPin()) {
        onUnlock();
      } else {
        setWrong(true);
        window.setTimeout(() => setWrong(false), 400);
        const n = attempts + 1;
        setAttempts(n);
        if (n >= 3) {
          setLockedUntil(Date.now() + 10_000);
          setAttempts(0);
        }
        window.setTimeout(() => setEntry(''), 400);
      }
    }
  };

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-xs flex-col items-center justify-center gap-8 px-4">
      <div className={`flex gap-3 ${wrong ? 'animate-nudge' : ''}`}>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-5 w-5 rounded-full border-2 ${
              entry.length > i ? 'border-brand-600 bg-brand-500' : 'border-ink-300'
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <button
            key={d}
            type="button"
            disabled={locked}
            onClick={() => pressDigit(d)}
            className="btn-pop h-16 w-16 rounded-tile border-ink-300 bg-white text-2xl font-bold
                       disabled:opacity-40 dark:bg-ink-800"
          >
            {d}
          </button>
        ))}
        <button
          type="button"
          onClick={onCancel}
          aria-label="Avbryt"
          className="btn-pop h-16 w-16 rounded-tile border-ink-300 bg-ink-100 text-xl dark:bg-ink-800"
        >
          ✕
        </button>
        <button
          type="button"
          disabled={locked}
          onClick={() => pressDigit('0')}
          className="btn-pop h-16 w-16 rounded-tile border-ink-300 bg-white text-2xl font-bold
                     disabled:opacity-40 dark:bg-ink-800"
        >
          0
        </button>
        <button
          type="button"
          onClick={() => setEntry(entry.slice(0, -1))}
          aria-label="Radera"
          className="btn-pop h-16 w-16 rounded-tile border-ink-300 bg-ink-100 text-xl dark:bg-ink-800"
        >
          ⌫
        </button>
      </div>
    </div>
  );
}
