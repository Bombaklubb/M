import { useEffect, useState } from 'react';
import type { Choice, MicroTextEx } from '@/types';
import { ChoiceGrid } from '@/components/ChoiceGrid';
import { play, stop } from '@/lib/audio';
import { EarButton } from '@/components/EarButton';
import { cn } from '@/lib/utils';

/**
 * Uppläst minitext med bildfrågor.
 *
 * Meningarna läses en i taget med den aktuella markerad, så eleven kan följa
 * med i texten även utan att kunna avkoda den. Sedan kommer frågorna – och
 * texten står kvar under dem, eftersom det här ska mäta förståelse och inte
 * minne.
 *
 * Eleven kan när som helst trycka på en enskild mening för att höra den igen.
 */
export function MicroTextExercise({
  exercise,
  onAnswer,
  locked,
  guideTo,
  wrongId,
}: {
  exercise: MicroTextEx;
  onAnswer: (correct: boolean, choice?: Choice) => void;
  locked: boolean;
  guideTo: string | null;
  wrongId: string | null;
}) {
  const { sentences, questions } = exercise.text;
  const lang = exercise.replay.lang;

  const [phase, setPhase] = useState<'reading' | 'asking'>('reading');
  const [active, setActive] = useState(-1);
  const [qIndex, setQIndex] = useState(0);
  /**
   * Missar på den AKTUELLA frågan.
   *
   * Minitexten lotsar själv, till skillnad från övriga övningar. SessionView
   * kan inte göra det här: frågorna ligger inuti texten och vilken som är
   * aktiv är komponentens egen state. Utan det här skulle löftet om att ett
   * pass aldrig går att köra fast i inte hålla just på minitexterna.
   */
  const [misses, setMisses] = useState(0);

  useEffect(() => {
    setPhase('reading');
    setActive(-1);
    setQIndex(0);
    setMisses(0);
  }, [exercise.id]);

  // Läs meningarna i följd med markering. Avbryts om eleven lämnar skärmen.
  useEffect(() => {
    if (phase !== 'reading') return;
    let cancelled = false;

    (async () => {
      await new Promise((r) => window.setTimeout(r, 700));
      for (let i = 0; i < sentences.length; i++) {
        if (cancelled) return;
        setActive(i);
        await play({ id: `${exercise.id}-s${i}`, text: sentences[i], lang });
        if (cancelled) return;
        await new Promise((r) => window.setTimeout(r, 200));
      }
      if (!cancelled) setActive(-1);
    })();

    return () => {
      cancelled = true;
      stop();
    };
  }, [exercise.id, phase, sentences, lang]);

  const question = questions[qIndex];

  const handlePick = (choice: Choice) => {
    if (!choice.correct) {
      setMisses((m) => m + 1);
      onAnswer(false, choice);
      return;
    }
    setMisses(0);
    // Flera frågor per text: bara den sista räknas som att uppgiften är klar,
    // annars skulle kön hoppa vidare mitt i texten.
    if (qIndex < questions.length - 1) {
      setQIndex(qIndex + 1);
      return;
    }
    onAnswer(true, choice);
  };

  const localGuide =
    misses >= 2 ? (question?.choices.find((c) => c.correct)?.id ?? null) : null;

  return (
    <div className="flex w-full max-w-4xl flex-col items-center gap-8">
      <div className="flex flex-col gap-2 rounded-card border-2 border-brand-200 bg-white
                      px-6 py-5 dark:border-ink-700 dark:bg-ink-800">
        {sentences.map((sentence, i) => (
          <div key={i} className="flex items-center gap-2">
            <EarButton
              size="sm"
              token={{ id: `${exercise.id}-s${i}`, text: sentence, lang }}
              label={sentence}
              className="shrink-0"
            />
          <button
            type="button"
            aria-label={`Lyssna på meningen: ${sentence}`}
            onClick={() => {
              setActive(i);
              void play({ id: `${exercise.id}-s${i}`, text: sentence, lang });
            }}
            className={cn(
              'reading rounded-tile px-3 text-left font-medium leading-snug transition-colors',
              // Under frågan krymper texten så att bildsvaren får plats på
              // skärmen. Den ska stå kvar, men inte ta hela höjden.
              phase === 'asking' ? 'py-1 text-xl' : 'py-2 text-3xl',
              active === i
                ? 'bg-amberx-100 text-ink-900'
                : 'text-ink-800 hover:bg-ink-100 dark:text-ink-100 dark:hover:bg-ink-700'
            )}
          >
            {sentence}
          </button>
          </div>
        ))}
      </div>

      {phase === 'reading' && (
        <button
          type="button"
          aria-label="Klar, visa frågan"
          onClick={() => {
            stop();
            setActive(-1);
            setPhase('asking');
          }}
          className="btn-pop grid h-20 w-40 place-items-center rounded-tile border-lime-700
                     bg-lime-500 text-4xl text-white"
        >
          <span aria-hidden>✓</span>
        </button>
      )}

      {phase === 'asking' && question && (
        <>
          <button
            type="button"
            aria-label={`Lyssna på frågan: ${question.ask.text}`}
            onClick={() => void play(question.ask)}
            className="reading rounded-card border-4 border-aqua-300 bg-aqua-50 px-8 py-4
                       text-3xl font-bold text-ink-900 dark:bg-ink-800 dark:text-ink-50"
          >
            {question.ask.text}
          </button>

          <ChoiceGrid
            compact
            choices={question.choices}
            disabled={locked}
            guideTo={localGuide ?? guideTo}
            wrongId={wrongId}
            onPick={handlePick}
          />
        </>
      )}
    </div>
  );
}
