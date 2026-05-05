import { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { Exercise, MultipleChoiceExercise, TrueFalseExercise, FillInExercise } from '../types';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

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
  const { exitTicketChapter, setView, selectedSubject } = useApp();
  const exercises = useMemo(() => exitTicketChapter ? pickThree(exitTicketChapter.exercises) : [], [exitTicketChapter]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswerState[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<AnswerState>('unanswered');
  const [inputValue, setInputValue] = useState('');
  const [done, setDone] = useState(false);

  if (!exitTicketChapter || !selectedSubject) { setView('subject-select'); return null; }

  const ex = exercises[currentIdx];
  const correct = answers.filter(a => a === 'correct').length;

  function handleAnswer(isCorrect: boolean) {
    if (currentAnswer !== 'unanswered') return;
    const state: AnswerState = isCorrect ? 'correct' : 'wrong';
    setCurrentAnswer(state);
    setTimeout(() => {
      const newAnswers = [...answers, state];
      if (currentIdx + 1 >= exercises.length) {
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
            const isSelected = currentAnswer !== 'unanswered' && i === e.correctIndex;
            let cls = 'w-full text-left p-3 rounded-xl border-2 text-sm font-semibold transition-all';
            if (currentAnswer === 'unanswered') cls += ' border-gray-200 bg-white hover:bg-indigo-50 cursor-pointer';
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
            let cls = 'flex-1 py-4 rounded-xl border-2 font-heading font-bold text-base transition-all';
            if (currentAnswer === 'unanswered') cls += ' border-gray-200 bg-white hover:bg-indigo-50 cursor-pointer';
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
            className="w-full px-4 py-3 rounded-xl border-2 border-indigo-200 focus:border-indigo-400 focus:outline-none text-base font-semibold"
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
            <p className="text-sm font-semibold italic">{e.wrongStatement}</p>
          </div>
          <div className="space-y-2">
            {e.options.map((opt, i) => {
              const isCorrect = i === e.correctIndex;
              let cls = 'w-full text-left p-3 rounded-xl border-2 text-sm font-semibold transition-all';
              if (currentAnswer === 'unanswered') cls += ' border-gray-200 bg-white hover:bg-indigo-50 cursor-pointer';
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
        <div className="max-w-sm w-full text-center">
          <div className="text-6xl mb-4">{correct === 3 ? '🎉' : correct >= 2 ? '👍' : '💪'}</div>
          <h1 className="text-2xl font-heading font-bold text-gray-800 mb-2">Snabbkoll klar!</h1>
          <p className="text-gray-500 font-semibold mb-6">{correct}/3 rätt</p>
          <div className="flex justify-center gap-3 mb-8">
            {answers.map((a, i) => (
              a === 'correct'
                ? <CheckCircle key={i} size={32} className="text-green-500" />
                : <XCircle key={i} size={32} className="text-red-400" />
            ))}
          </div>
          <button
            onClick={() => setView('chapter-study')}
            className="btn-primary-clay w-full py-4 flex items-center justify-center gap-2 font-heading text-base"
          >
            Tillbaka till sammanfattning <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  if (!ex) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="header-bar px-4 py-3 flex items-center gap-3">
        <button onClick={() => setView('chapter-study')} className="w-10 h-10 rounded-xl bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center hover:bg-indigo-100 active:scale-95 transition-all cursor-pointer">
          ✕
        </button>
        <div className="flex-1">
          <p className="font-heading font-bold text-amber-600 text-base">⚡ Snabbkoll</p>
          <p className="text-xs text-gray-400 font-semibold">{exitTicketChapter.title}</p>
        </div>
        <span className="text-sm font-black text-gray-400">{currentIdx + 1}/3</span>
      </header>

      {/* Progress */}
      <div className="h-2 bg-gray-100">
        <div className="h-full bg-amber-400 transition-all duration-500" style={{ width: `${((currentIdx) / 3) * 100}%` }} />
      </div>

      <main className="flex-1 p-4 sm:p-6 max-w-2xl w-full mx-auto">
        <div className="clay-card p-5 sm:p-6 mt-2">
          <p className="text-xs font-black text-amber-600 uppercase tracking-wide mb-3">{LABELS[currentIdx]}</p>
          <p className="font-heading font-bold text-gray-800 text-lg mb-5">{ex.question}</p>
          {renderExercise(ex)}
          {currentAnswer !== 'unanswered' && ex.explanation && (
            <div className="mt-4 p-3 rounded-2xl bg-indigo-50 border-2 border-indigo-200">
              <p className="text-sm font-semibold text-indigo-800">{ex.explanation}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
