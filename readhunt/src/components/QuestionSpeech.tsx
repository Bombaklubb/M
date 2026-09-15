import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { pickVoice, speechSupported } from '@/lib/speech';

/**
 * Two buttons that read out the question and the answer options.
 *
 * The text itself has had read-aloud for a long time, but the question and the
 * options had to be decoded by the student. For anyone who struggles with
 * decoding, the help ran out exactly where the task began: you have heard the
 * text but get stuck on what is being asked.
 *
 * Question and answers are deliberately separate. A student who understood the
 * question but needs to hear the options again should not have to sit through
 * the question once more, and the other way round. It is also fewer words to
 * hold in your head per press.
 *
 * Pressing a button that is already reading stops it.
 */

interface QuestionSpeechProps {
  question: string;
  options: string[];
  /** Changes when the student moves on, so the reading falls silent. */
  questionKey: number;
  /**
   * Called before speaking. The page shares one speech engine, so the caller
   * uses this to stop the text read-aloud and keep its own button in step.
   */
  onBeforeSpeak?: () => void;
}

const LETTERS = ['A', 'B', 'C', 'D'];

type What = 'question' | 'answers';

export const QuestionSpeech: React.FC<QuestionSpeechProps> = ({
  question,
  options,
  questionKey,
  onBeforeSpeak,
}) => {
  const [speaking, setSpeaking] = useState<What | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (!speechSupported) return;
    const choose = () => { voiceRef.current = pickVoice('en-GB'); };
    choose();
    window.speechSynthesis.addEventListener('voiceschanged', choose);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', choose);
  }, []);

  const stop = useCallback(() => {
    if (!speechSupported) return;
    window.speechSynthesis.cancel();
    setSpeaking(null);
  }, []);

  const speak = useCallback(
    (what: What) => {
      if (!speechSupported) return;

      // Pressing the button that is already reading turns it off.
      if (speaking === what) {
        stop();
        return;
      }

      // Silence anything already playing, including the read-aloud of the text
      // itself. Two voices at once help nobody.
      onBeforeSpeak?.();
      window.speechSynthesis.cancel();

      // The full stop after the letter gives the synth a pause. Without it the
      // options run together into one sentence and the student cannot match
      // what they hear to the right button on screen.
      const text =
        what === 'question'
          ? question
          : options.map((o, i) => `${LETTERS[i]}. ${o}.`).join(' ');

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-GB';
      utterance.rate = 0.95;
      if (voiceRef.current) utterance.voice = voiceRef.current;

      const done = () => setSpeaking(null);
      utterance.onend = done;
      utterance.onerror = done;

      setSpeaking(what);
      window.speechSynthesis.speak(utterance);
    },
    [speaking, stop, question, options, onBeforeSpeak]
  );

  // Fall silent when the student moves on, and when the view goes away.
  useEffect(() => stop, [questionKey, stop]);

  if (!speechSupported) return null;

  const button = (what: What, label: string) => {
    const active = speaking === what;
    return (
      <button
        type="button"
        onClick={() => speak(what)}
        aria-label={active ? 'Stop reading' : `Listen to the ${label.toLowerCase()}`}
        title={active ? 'Stop reading' : `Listen to the ${label.toLowerCase()}`}
        className={cn(
          'px-3 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap',
          active
            ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-md'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
        )}
      >
        {active ? '⏹' : '🔊'}{' '}
        {/* The full label does not fit on a phone, where the noun is enough. */}
        <span className="hidden sm:inline">
          {active ? 'Stop' : `Listen to the ${label.toLowerCase()}`}
        </span>
        <span className="sm:hidden">{active ? 'Stop' : label}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {button('question', 'Question')}
      {button('answers', 'Answers')}
    </div>
  );
};

export default QuestionSpeech;
