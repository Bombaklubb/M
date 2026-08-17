import { useState, useEffect, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { Exercise } from '../types';
import AppHeader from './AppHeader';
import MultipleChoice from './exercises/MultipleChoice';
import TrueFalse from './exercises/TrueFalse';
import FillInBlank from './exercises/FillInBlank';
import MatchingPairs from './exercises/MatchingPairs';
import SpotTheError from './exercises/SpotTheError';
import TimelineOrder from './exercises/TimelineOrder';
import { CheckCircle, XCircle } from 'lucide-react';

type AnswerState = 'unanswered' | 'correct' | 'wrong';

export default function ChapterExercise() {
  const { selectedChapter, selectedSubject, setView, submitChapterResult } = useApp();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswerState[]>([]);
  const [, setCurrentAnswer] = useState<AnswerState>('unanswered');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const exercises = selectedChapter?.exercises ?? [];

  useEffect(() => {
    if (!selectedChapter || !selectedSubject) setView('subject-select');
    else if (exercises.length === 0) setView('chapter-map');
  }, [selectedChapter, selectedSubject, exercises.length, setView]);

  // Avbryt en pågående "gå vidare"-timer om eleven lämnar vyn, annars kan den
  // spara resultat och navigera efter att eleven redan tryckt tillbaka.
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  if (!selectedChapter || !selectedSubject || exercises.length === 0) return null;

  const chapter = selectedChapter;
  const exercise = exercises[currentIdx];
  const total = exercises.length;
  const correct = answers.filter(a => a === 'correct').length;
  const progressPct = Math.round((currentIdx / total) * 100);

  if (!exercise) return null;

  function handleAnswer(isCorrect: boolean) {
    if (timerRef.current) clearTimeout(timerRef.current);
    const state: AnswerState = isCorrect ? 'correct' : 'wrong';
    setCurrentAnswer(state);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      const newAnswers = [...answers, state];
      if (currentIdx + 1 >= total) {
        submitChapterResult(
          chapter.id,
          newAnswers.filter(a => a === 'correct').length,
          total,
        );
      } else {
        setAnswers(newAnswers);
        setCurrentIdx(currentIdx + 1);
        setCurrentAnswer('unanswered');
      }
    }, 1200);
  }

  function renderExercise(ex: Exercise) {
    switch (ex.type) {
      case 'multiple-choice': return <MultipleChoice exercise={ex} onAnswer={handleAnswer} />;
      case 'true-false':      return <TrueFalse exercise={ex} onAnswer={handleAnswer} />;
      case 'fill-in':         return <FillInBlank exercise={ex} onAnswer={handleAnswer} />;
      case 'matching':        return <MatchingPairs exercise={ex} onAnswer={handleAnswer} />;
      case 'spot-the-error':  return <SpotTheError exercise={ex} onAnswer={handleAnswer} />;
      case 'timeline':        return <TimelineOrder exercise={ex} onAnswer={handleAnswer} />;
    }
  }

  return (
    <div className={`min-h-screen flex flex-col ${selectedSubject.pageBgClass}`}>
      <AppHeader
        title={selectedChapter.title}
        subtitle={`${selectedSubject.emoji} ${selectedSubject.name}`}
        onBack={() => setView('chapter-map')}
        accentClass={selectedSubject.textClass}
        headerClass={selectedSubject.headerClass}
        headingFont={selectedSubject.headingFont}
        titleStyle={{ color: selectedSubject.inkHex }}
      />

      {/* Progress bar */}
      <div className="h-2 bg-gray-100">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${progressPct}%`, background: selectedSubject.accentHex }}
        />
      </div>

      {/* Counter */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/80 border-b border-gray-100">
        <span className="text-sm font-black text-gray-500">
          Fråga {currentIdx + 1} av {total}
        </span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-sm font-black text-green-600">
            <CheckCircle size={15} /> {correct}
          </span>
          <span className="flex items-center gap-1 text-sm font-black text-red-400">
            <XCircle size={15} /> {answers.filter(a => a === 'wrong').length}
          </span>
        </div>
      </div>

      {/* Exercise card */}
      <main className="flex-1 p-4 sm:p-6 max-w-2xl w-full mx-auto">
        <div className="clay-card p-5 sm:p-6 mt-2 animate-fade-in" key={exercise.id}>
          {renderExercise(exercise)}
        </div>
      </main>
    </div>
  );
}
