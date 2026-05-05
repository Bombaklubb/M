import { useState, useMemo } from 'react';
import { TimelineExercise } from '../../types';
import { CheckCircle, XCircle } from 'lucide-react';

interface Props {
  exercise: TimelineExercise;
  onAnswer: (isCorrect: boolean) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TimelineOrder({ exercise, onAnswer }: Props) {
  const shuffled = useMemo(() => shuffle(exercise.events), [exercise.id]);
  const [order, setOrder] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  function toggleEvent(id: string) {
    if (submitted) return;
    if (order.includes(id)) {
      setOrder(order.filter(x => x !== id));
    } else {
      setOrder([...order, id]);
    }
  }

  function submit() {
    if (order.length !== exercise.events.length) return;
    setSubmitted(true);
    const correct = order.every((id, i) => id === exercise.correctOrder[i]);
    onAnswer(correct);
  }

  function getEventState(id: string): 'correct' | 'wrong' | 'unset' {
    if (!submitted) return 'unset';
    const pos = order.indexOf(id);
    return order[pos] === exercise.correctOrder[pos] ? 'correct' : 'wrong';
  }

  return (
    <div>
      <p className="font-heading font-bold text-gray-800 text-lg mb-2">{exercise.question}</p>
      <p className="text-sm text-gray-500 font-semibold mb-5">
        Klicka händelserna i rätt tidsordning (äldst → nyast).
      </p>

      {/* Order slots */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {exercise.events.map((_, i) => {
          const id = order[i];
          const event = id ? exercise.events.find(e => e.id === id) : null;
          const state = id ? getEventState(id) : 'unset';
          return (
            <div
              key={i}
              className={`flex-1 min-w-[80px] h-10 rounded-xl border-2 flex items-center justify-center text-xs font-black transition-all
                ${event
                  ? state === 'correct' ? 'border-green-400 bg-green-50 text-green-700'
                    : state === 'wrong' ? 'border-red-400 bg-red-50 text-red-700'
                    : 'border-indigo-300 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 bg-gray-50 text-gray-300'}`}
            >
              {i + 1}
            </div>
          );
        })}
      </div>

      {/* Events */}
      <div className="space-y-2">
        {shuffled.map(ev => {
          const pos = order.indexOf(ev.id);
          const isSelected = pos !== -1;
          const state = isSelected ? getEventState(ev.id) : 'unset';

          let cls = 'clay-card-sm p-3 w-full text-left flex items-center gap-3 transition-all';
          if (!submitted) cls += ' cursor-pointer hover:scale-[1.01] active:scale-[0.99]';
          if (isSelected && !submitted) cls += ' border-indigo-300 bg-indigo-50';
          if (state === 'correct') cls += ' border-green-400 bg-green-50';
          if (state === 'wrong') cls += ' border-red-400 bg-red-50';

          return (
            <button key={ev.id} onClick={() => toggleEvent(ev.id)} disabled={submitted} className={cls}>
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black flex-shrink-0 ${
                isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {isSelected ? pos + 1 : '?'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">{ev.label}</p>
                {ev.hint && <p className="text-xs text-gray-400">{ev.hint}</p>}
              </div>
              {submitted && state === 'correct' && <CheckCircle size={16} className="text-green-500 flex-shrink-0" />}
              {submitted && state === 'wrong' && <XCircle size={16} className="text-red-500 flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {!submitted && (
        <button
          onClick={submit}
          disabled={order.length !== exercise.events.length}
          className={`mt-5 w-full py-3 rounded-2xl font-heading font-bold text-base transition-all
            ${order.length === exercise.events.length
              ? 'btn-primary-clay cursor-pointer'
              : 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed'}`}
        >
          Kontrollera ordning
        </button>
      )}

      {submitted && exercise.explanation && (
        <div className="mt-4 p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-200">
          <p className="text-sm font-semibold text-indigo-800">{exercise.explanation}</p>
        </div>
      )}
    </div>
  );
}
