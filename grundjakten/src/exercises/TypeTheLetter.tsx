import { useEffect, useState } from 'react';
import type { TypeTheLetterEx } from '@/types';
import { LETTER_BY_ID } from '@/data/letters';
import { OnScreenKeyboard } from '@/components/OnScreenKeyboard';

/**
 * Hör bokstaven, tryck den.
 *
 * Både fysiskt tangentbord och skärmtangentbord fungerar. Tangentkoden läses
 * från `event.key` och inte från `keyCode`, just för att å/ä/ö ska komma
 * igenom korrekt oavsett layout.
 */
export function TypeTheLetter({
  exercise,
  onAnswer,
  locked,
}: {
  exercise: TypeTheLetterEx;
  onAnswer: (correct: boolean) => void;
  locked: boolean;
}) {
  const letter = LETTER_BY_ID[exercise.letterId];
  const [typed, setTyped] = useState<string | null>(null);

  useEffect(() => {
    setTyped(null);
  }, [exercise.id]);

  useEffect(() => {
    if (locked) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key.length !== 1) return;
      const key = e.key.toLowerCase();
      // Bara bokstäver – siffror och specialtecken ska inte räknas som ett svar.
      if (!/\p{L}/u.test(key)) return;
      setTyped(key);
      onAnswer(exercise.accepts.map((a) => a.toLowerCase()).includes(key));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [exercise.id, exercise.accepts, locked, onAnswer]);

  const press = (key: string) => {
    if (locked) return;
    setTyped(key);
    onAnswer(exercise.accepts.map((a) => a.toLowerCase()).includes(key));
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="grid h-40 w-40 place-items-center rounded-card border-4 border-dashed
                      border-brand-300 bg-white dark:bg-ink-800">
        <span className="reading text-8xl font-bold text-brand-600 dark:text-brand-300">
          {typed ? typed.toUpperCase() : ''}
        </span>
      </div>

      <p className="text-center text-2xl font-semibold text-ink-500 dark:text-ink-400">
        {letter.keyword.emoji} <span className="sr-only">{letter.keyword.phrase.text}</span>
      </p>

      <OnScreenKeyboard letters={exercise.keyboardLetters} onPress={press} disabled={locked} />
    </div>
  );
}
