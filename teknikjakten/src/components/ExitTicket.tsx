import { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { Exercise, MultipleChoiceExercise, FillInExercise } from '../types';
import { shuffleOptions } from '../utils/shuffle';
import { SPACE, withAlpha } from '../utils/theme';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import Celebration from './Celebration';

type AnswerState = 'unanswered' | 'correct' | 'wrong';

function pickThree(exercises: Exercise[]): Exercise[] {
  const fact = exercises.find(e => e.type === 'multiple-choice') as MultipleChoiceExercise | undefined;
  const concept = exercises.find(e => e.type === 'fill-in') as FillInExercise | undefined;
  const reasoning = exercises.find(e => e.type === 'spot-the-error' || e.type === 'true-false') as Exercise | undefined;
  const picks = [fact, concept, reasoning].filter(Boolean) as Exercise[];
  while (picks.length < 3) {
    const extra = exercises.find(e => !picks.includes(e));
    if (!extra) break;
    picks.push(extra);
  }
  return picks.slice(0, 3);
}

export default function ExitTicket() {
  const { exitTicketChapter, setView, selectedArea, exitTicketReturnView } = useApp();
  // Snabbkollen renderar alternativen med egen kod, så blandningen görs här –
  // annars skulle svaret gå att gissa ur ordningen i datan.
  const exercises = useMemo(() => {
    if (!exitTicketChapter) return [];
    return pickThree(exitTicketChapter.exercises).map(e => {
      if (e.type === 'multiple-choice' || e.type === 'spot-the-error') {
        const { options, correctIndex } = shuffleOptions(e.options, e.correctIndex);
        return { ...e, options, correctIndex };
      }
      return e;
    });
  }, [exitTicketChapter]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswerState[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<AnswerState>('unanswered');
  const [inputValue, setInputValue] = useState('');
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!exitTicketChapter || !selectedArea) setView('area-select');
  }, [exitTicketChapter, selectedArea, setView]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  if (!exitTicketChapter || !selectedArea) return null;

  const ex = exercises[currentIdx];
  const total = exercises.length;
  const correct = answers.filter(a => a === 'correct').length;
  // Snabbkoll startas bara för kapitel med övningar, men vyn ska ändå inte
  // krascha om urvalet mot förmodan blir tomt.
  if (total === 0) return null;

  /** Var eleven ska hamna när Snabbkollen stängs eller är klar. */
  function leave() {
    setView(exitTicketReturnView === 'exit-ticket' ? 'chapter-map' : exitTicketReturnView);
  }

  function handleAnswer(isCorrect: boolean) {
    if (currentAnswer !== 'unanswered') return;
    const state: AnswerState = isCorrect ? 'correct' : 'wrong';
    setCurrentAnswer(state);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      const newAnswers = [...answers, state];
      if (currentIdx + 1 >= total) {
        setAnswers(newAnswers);
        setDone(true);
      } else {
        setAnswers(newAnswers);
        setCurrentIdx(currentIdx + 1);
        setCurrentAnswer('unanswered');
        setInputValue('');
      }
    }, 1200);
  }

  function renderExercise(e: Exercise) {
    if (e.type === 'multiple-choice') {
      return (
        <div className="space-y-2">
          {e.options.map((opt, i) => {
            const isCorrect = i === e.correctIndex;
            let cls = 'w-full text-left p-3 min-h-[44px] rounded-xl border-2 text-sm font-semibold transition-all text-gray-800';
            if (currentAnswer === 'unanswered') cls += ' border-gray-200 bg-white hover:bg-sky-50 cursor-pointer';
            else if (isCorrect) cls += ' border-green-400 bg-green-50';
            else cls += ' border-gray-200 bg-white opacity-50';
            return (
              <button key={i} onClick={() => currentAnswer === 'unanswered' && handleAnswer(i === e.correctIndex)} className={cls}>
                {opt}
              </button>
            );
          })}
        </div>
      );
    }

    if (e.type === 'true-false') {
      return (
        <div className="flex gap-3">
          {(['Sant', 'Falskt'] as const).map(label => {
            const isCorrect = label === 'Sant' ? e.isTrue : !e.isTrue;
            let cls = 'flex-1 py-4 rounded-xl border-2 font-heading font-bold text-base transition-all text-gray-800';
            if (currentAnswer === 'unanswered') cls += ' border-gray-200 bg-white hover:bg-sky-50 cursor-pointer';
            else if (isCorrect) cls += ' border-green-400 bg-green-50 text-green-700';
            else cls += ' border-gray-200 opacity-50';
            return (
              <button key={label} onClick={() => currentAnswer === 'unanswered' && handleAnswer(isCorrect)} className={cls}>
                {label === 'Sant' ? '✓ Sant' : '✗ Falskt'}
              </button>
            );
          })}
        </div>
      );
    }

    if (e.type === 'fill-in') {
      const check = () => {
        const val = inputValue.trim().toLowerCase();
        const correct = [e.answer, ...(e.acceptableAnswers ?? [])].some(a => a.toLowerCase() === val);
        handleAnswer(correct);
      };
      return (
        <div>
          <input
            className="w-full px-4 py-3 rounded-xl border-2 border-sky-200 focus:border-sky-400 focus:outline-none text-base font-semibold text-gray-800"
            placeholder="Skriv ditt svar..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && currentAnswer === 'unanswered' && inputValue.trim() && check()}
            disabled={currentAnswer !== 'unanswered'}
            autoFocus
          />
          {currentAnswer === 'unanswered' && (
            <button onClick={check} disabled={!inputValue.trim()} className="mt-2 w-full btn-primary-clay py-3 font-heading cursor-pointer">
              Kontrollera
            </button>
          )}
          {currentAnswer !== 'unanswered' && (
            <p className={`mt-2 text-sm font-black ${currentAnswer === 'correct' ? 'text-green-600' : 'text-red-500'}`}>
              {currentAnswer === 'correct' ? '✓ Rätt!' : `✗ Rätt svar: ${e.answer}`}
            </p>
          )}
        </div>
      );
    }

    if (e.type === 'spot-the-error') {
      return (
        <div>
          <div className="rounded-xl border-2 border-red-300 bg-red-50 p-3 mb-3">
            <p className="text-xs font-black text-red-500 mb-1">🚨 FELAKTIGT</p>
            <p className="text-sm font-semibold italic text-gray-800">{e.wrongStatement}</p>
          </div>
          <div className="space-y-2">
            {e.options.map((opt, i) => {
              const isCorrect = i === e.correctIndex;
              let cls = 'w-full text-left p-3 min-h-[44px] rounded-xl border-2 text-sm font-semibold transition-all text-gray-800';
              if (currentAnswer === 'unanswered') cls += ' border-gray-200 bg-white hover:bg-sky-50 cursor-pointer';
              else if (isCorrect) cls += ' border-green-400 bg-green-50';
              else cls += ' border-gray-200 opacity-50';
              return <button key={i} onClick={() => currentAnswer === 'unanswered' && handleAnswer(isCorrect)} className={cls}>{opt}</button>;
            })}
          </div>
        </div>
      );
    }

    return null;
  }

  const LABELS = ['📊 Faktafråga', '📖 Begrepp', '🧠 Resonemang'];

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        {correct === total && <Celebration />}
        <div className="max-w-sm w-full text-center">
          <div className="text-6xl mb-4">{correct === total ? '🎉' : correct >= total / 2 ? '👍' : '💪'}</div>
          <h1 className="text-2xl font-heading font-bold mb-2" style={{ color: SPACE.onDark }}>Snabbkoll klar!</h1>
          <p className="font-semibold mb-6" style={{ color: SPACE.onDarkMuted }}>{correct}/{total} rätt</p>
          <div className="flex justify-center gap-3 mb-8">
            {answers.map((a, i) => (
              a === 'correct'
                ? <CheckCircle key={i} size={32} className="text-green-500" />
                : <XCircle key={i} size={32} className="text-red-400" />
            ))}
          </div>
          <button
            onClick={leave}
            className="btn-primary-clay w-full py-4 flex items-center justify-center gap-2 font-heading text-base"
          >
            Klar <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  if (!ex) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="header-bar px-4 py-3 flex items-center gap-3">
        <button
          onClick={leave}
          className="w-11 h-11 rounded-xl bg-white/10 border-2 border-white/25 flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all cursor-pointer text-white"
          aria-label="Avsluta snabbkoll"
        >
          ✕
        </button>
        <div className="flex-1">
          <p className="font-heading font-bold text-base" style={{ color: SPACE.gold }}>⚡ Snabbkoll</p>
          <p className="text-xs font-semibold" style={{ color: SPACE.onDarkMuted }}>{exitTicketChapter.title}</p>
        </div>
        <span className="text-sm font-black" style={{ color: SPACE.onDarkMuted }}>{currentIdx + 1}/{total}</span>
      </header>

      {/* Progress */}
      <div className="h-2" style={{ background: withAlpha(SPACE.deepest, 0.6) }}>
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${(currentIdx / total) * 100}%`, background: SPACE.gold, boxShadow: `0 0 12px ${withAlpha(SPACE.gold, 0.6)}` }}
        />
      </div>

      <main className="flex-1 p-4 sm:p-6 max-w-2xl w-full mx-auto">
        <div className="clay-card p-5 sm:p-6 mt-2">
          <p className="text-xs font-black text-amber-600 uppercase tracking-wide mb-3">{LABELS[currentIdx] ?? 'Fråga'}</p>
          <p className="font-heading font-bold text-gray-800 text-lg mb-5">{ex.question}</p>
          {renderExercise(ex)}
          {currentAnswer !== 'unanswered' && ex.explanation && (
            <div className="mt-4 p-3 rounded-2xl bg-sky-50 border-2 border-sky-200">
              <p className="text-sm font-semibold text-sky-900">{ex.explanation}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
