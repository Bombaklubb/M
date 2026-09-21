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
  elapsedSeconds, MISSAR_TILL_FACIT, type QueueState,
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
 *    långsammare. Rätt svar avslöjas INTE – eleven får försöka själv igen.
 *  - Andra missen: rätt alternativ pulserar och eleven lotsas dit. Det
 *    räknas sedan som rätt-med-hjälp, vilket ger 3 XP i stället för 5.
 *  - TREDJE missen: rätt svar visas och sägs, och pilen tänds. Utan den
 *    utgången satt eleven fast i de övningar som saknar alternativ att
 *    peka på – i "Skriv ordet" kunde hon skriva fel hur många gånger som
 *    helst utan att något hände. Att fastna är misslyckandet, inte facit.
 *
 * Att passet inte byter uppgift av sig självt är avsiktligt. En elev som
 * behöver tio sekunder på sig att se att hon svarade rätt hann inte med när
 * skärmen bytte efter 900 ms – och hon kan inte läsa sig till vad som hände.
 * Nu står bilden kvar tills hon själv säger att hon är klar.
 */
/**
 * Rätt svar som text, att visa efter tredje missen.
 *
 * `null` för de övningar där svaret redan står på skärmen eller inte går att
 * sammanfatta i en rad – para ihop, forma bokstäver. Där löser eleven i
 * stället uppgiften med de utpekade valen.
 */
function svaretPa(ex: Exercise): string | null {
  switch (ex.kind) {
    case 'type-the-word':
      return ex.answer;
    case 'build-word-tiles':
      return ex.target.join('');
    case 'build-sentence-cards':
      return ex.target.join(' ');
    case 'order-items':
      return ex.target.join(' ');
    default: {
      if ('choices' in ex && Array.isArray(ex.choices)) {
        const ratt = ex.choices.find((c) => c.correct);
        return ratt?.word ?? ratt?.letter ?? null;
      }
      return null;
    }
  }
}

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
  /** Rätt svar, visat efter tredje missen. */
  const [facit, setFacit] = useState<string | null>(null);
  const [results, setResults] = useState<SessionResult['perItem']>([]);
  /** Satt när uppgiften är klarad och eleven ska trycka sig vidare själv. */
  const [vantarPaNasta, setVantarPaNasta] = useState(false);

  const exercise = currentExercise(queue);
  useAutoSpeak(exercise?.prompt ?? null, profile.settings.autoSpeakPrompts);

  useEffect(() => {
    setWrongId(null);
    setGuideTo(null);
    setFacit(null);
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

    // Uppgiften står KVAR på skärmen och läggs inte tillbaka i kön. Det är
    // det som gör att riktningen alltid är framåt: eleven blir klar med den
    // här frågan nu, i stället för att få den igen längre fram medan mätaren
    // står still.
    const nasteQ = markMissed(queue);
    setQueue(nasteQ);
    const missar = nasteQ.missed.get(exercise.id) ?? 1;

    if (missar >= MISSAR_TILL_FACIT) {
      // Tredje missen: visa rätt svar och öppna vägen vidare.
      //
      // Utan den här utgången satt eleven fast. Lotsningen pekar ut ett
      // alternativ, men i "Skriv ordet" finns inga alternativ att peka på –
      // där kunde hon skriva fel hur många gånger som helst utan att något
      // hände. Facit är inte ett misslyckande; att fastna är det.
      setLocked(true);
      setFacit(svaretPa(exercise));
      const ratt = 'choices' in exercise ? exercise.choices.find((c) => c.correct) : null;
      setGuideTo(ratt?.id ?? null);
      const perItem = [...results, { exercise, firstTry: false }];
      setResults(perItem);
      // Säg svaret. Eleven kan inte läsa det som står på skärmen.
      window.setTimeout(() => void play(exercise.replay), 700);
      window.setTimeout(() => setVantarPaNasta(true), BLIXT_MS);
      return;
    }

    if (missar >= 2) {
      // Andra missen: peka ut rätt svar för den som har alternativ att välja
      // mellan. Eleven trycker själv – hon ska göra det sista steget.
      const ratt = 'choices' in exercise ? exercise.choices.find((c) => c.correct) : null;
      setGuideTo(ratt?.id ?? null);
      return;
    }

    // Första missen: eleven får försöka själv en gång till. Att lotsa redan
    // här tar ifrån henne chansen att komma på det, och ett svar hon hittat
    // själv är värt mer än ett hon blivit ledd till.
    window.setTimeout(() => void play(exercise.prompt), 800);
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
          facit={facit}
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
