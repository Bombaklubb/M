import { useCallback, useEffect, useState } from 'react';
import type { Choice, Exercise, StudentProfile } from '@/types';
import { ProgressDots } from '@/components/ProgressDots';
import { ListenAgainBar } from '@/components/ListenAgainBar';
import {
  FeedbackOverlay,
  BEROM_MS,
  BLIXT_MS,
  type FeedbackState,
} from '@/components/FeedbackOverlay';
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
 *  - Rätt: grön blixt, stigande ton, +XP – och sedan VÄNTAR passet. Eleven
 *    trycker själv på den gröna pilen för att gå vidare.
 *  - Första missen: mjuk duns, valet bleknar, instruktionen spelas om
 *    långsammare. Rätt svar avslöjas INTE.
 *  - Andra missen: rätt alternativ pulserar och eleven lotsas dit. Det
 *    räknas sedan som rätt-med-hjälp, vilket ger 3 XP i stället för 5.
 *
 * Att passet inte byter uppgift av sig självt är avsiktligt. En elev som
 * behöver tio sekunder på sig att se att hon svarade rätt hann inte med när
 * skärmen bytte efter 900 ms – och hon kan inte läsa sig till vad som hände.
 * Nu står bilden kvar tills hon själv säger att hon är klar.
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
  /** Satt när uppgiften är klarad och eleven ska trycka sig vidare själv. */
  const [vantarPaNasta, setVantarPaNasta] = useState(false);

  const exercise = currentExercise(queue);
  useAutoSpeak(exercise?.prompt ?? null, profile.settings.autoSpeakPrompts);

  useEffect(() => {
    setWrongId(null);
    setGuideTo(null);
    setLocked(false);
    setVantarPaNasta(false);
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

      // Pilen tänds när blixten slocknat – den ska inte dröja bara för att
      // berömmet står kvar längre. Uppgiften byts ändå aldrig av sig själv.
      window.setTimeout(() => setVantarPaNasta(true), BLIXT_MS);

      // Berömmet lever vidare en stund till, ovanpå den tända pilen.
      // Överlägget är pointer-events-none, så eleven kan trycka vidare
      // under tiden – bilden hindrar ingen som redan är klar.
      window.setTimeout(() => setFeedback('none'), BEROM_MS);
      return;
    }

    // Fel svar.
    playMiss();
    setFeedback('miss');
    setWrongId(choice?.id ?? null);
    window.setTimeout(() => setFeedback('none'), BLIXT_MS);

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

  /** Eleven trycker sig vidare. Enda vägen till nästa uppgift. */
  const gaVidare = () => {
    if (!vantarPaNasta) return;
    setVantarPaNasta(false);
    const next = markCorrect(queue);
    setQueue(next);
    if (isDone(next)) finish(next, results);
  };

  if (!exercise) return null;

  return (
    /* Exakt en skärmhöjd, aldrig mer. Uppgiften ska ALDRIG hamna under
       skärmkanten: en elev som inte kan läsa vet inte att man kan scrolla,
       så en knapp hon inte ser är en knapp som inte finns. */
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <header className="flex shrink-0 items-center justify-between px-4 py-2
                         [@media(min-height:760px)]:py-3">
        <ProgressDots total={queue.total} cleared={queue.cleared} />
        <span className="text-lg font-bold text-brand-600 dark:text-brand-300" aria-hidden>
          ⭐ {queue.xpEarned}
        </span>
      </header>

      <main className="flex min-h-0 flex-1 items-center justify-center overflow-hidden px-3 py-2
                       [@media(min-height:760px)]:px-4 [@media(min-height:760px)]:py-5">
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
        onNext={vantarPaNasta ? gaVidare : undefined}
      />
      <FeedbackOverlay state={feedback} />
    </div>
  );
}
