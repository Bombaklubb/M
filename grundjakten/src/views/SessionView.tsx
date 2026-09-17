import { useCallback, useEffect, useState } from 'react';
import type { Choice, Exercise, StudentProfile } from '@/types';
import { ProgressDots } from '@/components/ProgressDots';
import { ListenAgainBar } from '@/components/ListenAgainBar';
import { FeedbackOverlay, type FeedbackState } from '@/components/FeedbackOverlay';
import { ExerciseRenderer } from '@/exercises/ExerciseRenderer';
import { useAutoSpeak } from '@/hooks/useAutoSpeak';
import {
  createQueue, currentExercise, isDone, markCorrect, markMissed,
  elapsedSeconds, type QueueState,
} from '@/lib/queue';
import { playCorrect, playFanfare, playMiss } from '@/lib/sfx';
import { play } from '@/lib/audio';

export interface SessionResult {
  xpEarned: number;
  total: number;
  firstTryCorrect: number;
  seconds: number;
  /** Uppgifts-id som klarades på första försöket, för bemästringsräkning. */
  perItem: { exercise: Exercise; firstTry: boolean }[];
}

/**
 * Kör ett pass.
 *
 * Feedbackreglerna, som är hela poängen med appen:
 *  - Rätt: grön blixt, stigande ton, +XP, vidare efter 900 ms.
 *  - Första missen: mjuk duns, valet bleknar, instruktionen spelas om
 *    långsammare. Rätt svar avslöjas INTE.
 *  - Andra missen: rätt alternativ pulserar och eleven lotsas dit. Det
 *    räknas sedan som rätt-med-hjälp, vilket ger 3 XP i stället för 5.
 */
export function SessionView({
  exercises,
  profile,
  onFinish,
  onHome,
}: {
  exercises: Exercise[];
  profile: StudentProfile;
  onFinish: (result: SessionResult) => void;
  onHome: () => void;
}) {
  const [queue, setQueue] = useState<QueueState>(() => createQueue(exercises));
  const [feedback, setFeedback] = useState<FeedbackState>('none');
  const [locked, setLocked] = useState(false);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [guideTo, setGuideTo] = useState<string | null>(null);
  const [results, setResults] = useState<SessionResult['perItem']>([]);

  const exercise = currentExercise(queue);
  useAutoSpeak(exercise?.prompt ?? null, profile.settings.autoSpeakPrompts);

  useEffect(() => {
    setWrongId(null);
    setGuideTo(null);
    setLocked(false);
  }, [exercise?.id]);

  const finish = useCallback(
    (q: QueueState, perItem: SessionResult['perItem']) => {
      playFanfare();
      onFinish({
        xpEarned: q.xpEarned,
        total: q.total,
        firstTryCorrect: q.firstTryCorrect,
        seconds: elapsedSeconds(q),
        perItem,
      });
    },
    [onFinish]
  );

  const handleAnswer = (correct: boolean, choice?: Choice) => {
    if (locked || !exercise) return;

    if (correct) {
      setLocked(true);
      setFeedback('correct');
      playCorrect();
      const firstTry = !queue.missed.has(exercise.id);
      const perItem = [...results, { exercise, firstTry }];
      setResults(perItem);

      window.setTimeout(() => {
        setFeedback('none');
        const next = markCorrect(queue);
        setQueue(next);
        if (isDone(next)) finish(next, perItem);
      }, 900);
      return;
    }

    // Fel svar.
    playMiss();
    setFeedback('miss');
    setWrongId(choice?.id ?? null);
    window.setTimeout(() => setFeedback('none'), 700);

    const alreadyMissed = queue.missed.has(exercise.id);
    if (alreadyMissed) {
      // Andra missen: lotsa eleven till rätt svar i stället för att låta
      // henne fastna. Ett pass ska aldrig gå att köra fast i.
      const right = 'choices' in exercise ? exercise.choices.find((c) => c.correct) : null;
      setGuideTo(right?.id ?? null);
    } else {
      setQueue(markMissed(queue));
      window.setTimeout(() => void play(exercise.prompt), 800);
    }
  };

  if (!exercise) return null;

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="flex items-center justify-between px-4 py-3">
        <ProgressDots total={queue.total} cleared={queue.cleared} />
        {/* Uppdragssteget, t.ex. "Läs ordet". Bara i Dagens uppdrag. */}
        {exercise.label && (
          <span className="text-lg font-bold text-ink-500 dark:text-ink-400">{exercise.label}</span>
        )}
        <span className="text-lg font-bold text-brand-600 dark:text-brand-300" aria-hidden>
          ⭐ {queue.xpEarned}
        </span>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-6">
        <ExerciseRenderer
          exercise={exercise}
          onAnswer={handleAnswer}
          locked={locked}
          guideTo={guideTo}
          wrongId={wrongId}
        />
      </main>

      <ListenAgainBar
        replay={exercise.replay}
        onHome={onHome}
        baseRate={profile.settings.speechRate}
      />
      <FeedbackOverlay state={feedback} />
    </div>
  );
}
