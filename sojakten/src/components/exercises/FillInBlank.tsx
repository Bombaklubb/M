import { useState } from 'react';
import { FillInExercise } from '../../types';
import { CheckCircle, XCircle } from 'lucide-react';

interface Props {
  exercise: FillInExercise;
  onAnswer: (correct: boolean) => void;
}

export default function FillInBlank({ exercise, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');

  const useWordBank = !!(exercise.wordBank && exercise.wordBank.length > 0);
  const revealed = selected !== null;

  function normalize(s: string) {
    return s.toLowerCase().trim().replace(/[.,-]/g, '');
  }

  function isCorrectAnswer(val: string) {
    const answers = [exercise.answer, ...(exercise.acceptableAnswers ?? [])];
    return answers.some(a => normalize(a) === normalize(val));
  }

  function pickWord(word: string) {
    if (revealed) return;
    setSelected(word);
    setTimeout(() => onAnswer(isCorrectAnswer(word)), 1000);
  }

  function submitText(e: React.FormEvent) {
    e.preventDefault();
    if (revealed || !textInput.trim()) return;
    const val = textInput.trim();
    setSelected(val);
    setTimeout(() => onAnswer(isCorrectAnswer(val)), 800);
  }

  const correct = revealed && isCorrectAnswer(selected!);

  return (
    <div className="space-y-4">
      <p className="text-lg sm:text-xl font-black text-gray-800 leading-snug">{exercise.question}</p>

      {useWordBank ? (
        <div className="mt-4">
          <p className="text-xs font-black text-gray-500 mb-3 uppercase tracking-wide">Välj rätt svar:</p>
          <div className="flex flex-wrap gap-3">
            {exercise.wordBank!.map(word => {
              const isChosen = selected === word;
              const isCorrectWord = isCorrectAnswer(word);
              let cls = 'px-5 py-3 rounded-2xl font-bold text-base transition-all cursor-pointer border-2 ';
              if (!revealed) {
                cls += 'bg-white border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 active:scale-95';
              } else if (isCorrectWord) {
                cls += 'bg-green-50 border-green-400 text-green-800';
              } else if (isChosen && !isCorrectWord) {
                cls += 'bg-red-50 border-red-400 text-red-800';
              } else {
                cls += 'bg-gray-50 border-gray-200 text-gray-400 opacity-60';
              }
              return (
                <button key={word} onClick={() => pickWord(word)} disabled={revealed} className={cls}>
                  {revealed && isChosen && isCorrectWord && <CheckCircle size={16} className="inline mr-1 text-green-500" />}
                  {revealed && isChosen && !isCorrectWord && <XCircle size={16} className="inline mr-1 text-red-500" />}
                  {word}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <form onSubmit={submitText} className="mt-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              disabled={revealed}
              placeholder="Skriv ditt svar..."
              className={`
                flex-1 px-4 py-3 rounded-2xl border-2 font-semibold text-base focus:outline-none transition-colors
                ${revealed
                  ? correct
                    ? 'border-green-400 bg-green-50 text-green-800'
                    : 'border-red-400 bg-red-50 text-red-800'
                  : 'border-indigo-200 focus:border-indigo-400 bg-white'}
              `}
            />
            {!revealed && (
              <button type="submit" className="btn-primary-clay px-6 py-3 font-bold">
                OK
              </button>
            )}
          </div>
        </form>
      )}

      {revealed && (
        <div className={`p-4 rounded-2xl border-2 ${correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          {!correct && (
            <p className="text-sm font-black text-red-700 mb-1">
              Rätt svar: <span className="underline">{exercise.answer}</span>
            </p>
          )}
          {exercise.explanation && (
            <p className="text-sm font-semibold text-gray-700">💡 {exercise.explanation}</p>
          )}
        </div>
      )}
    </div>
  );
}
