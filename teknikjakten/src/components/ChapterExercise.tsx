import { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { Exercise } from '../types';
import { pageStyle, headerStyle, SPACE, withAlpha } from '../utils/theme';
import AppHeader from './AppHeader';
import NextQuestionButton from './NextQuestionButton';
import MultipleChoice from './exercises/MultipleChoice';
import TrueFalse from './exercises/TrueFalse';
import FillInBlank from './exercises/FillInBlank';
import MatchingPairs from './exercises/MatchingPairs';
import SpotTheError from './exercises/SpotTheError';
import TimelineOrder from './exercises/TimelineOrder';
import { CheckCircle, XCircle } from 'lucide-react';

type AnswerState = 'unanswered' | 'correct' | 'wrong';

export default function ChapterExercise() {
  const { selectedChapter, selectedArea, setView, submitChapterResult } = useApp();

  const [currentIdx, setCurrentIdx] = useState(0);
  // Ett svar per besvarad fråga. Att listan är längre än currentIdx betyder att
  // den aktuella frågan redan är besvarad och att facit visas.
  const [answers, setAnswers] = useState<AnswerState[]>([]);

  const exercises = selectedChapter?.exercises ?? [];

  useEffect(() => {
    if (!selectedChapter || !selectedArea) setView('area-select');
    else if (exercises.length === 0) setView('chapter-map');
  }, [selectedChapter, selectedArea, exercises.length, setView]);

  if (!selectedChapter || !selectedArea || exercises.length === 0) return null;

  const chapter = selectedChapter;
  const a = selectedArea;
  const exercise = exercises[currentIdx];
  const total = exercises.length;
  const correct = answers.filter(x => x === 'correct').length;
  const answered = answers.length > currentIdx;
  const progressPct = Math.round((currentIdx / total) * 100);

  if (!exercise) return null;

  function handleAnswer(isCorrect: boolean) {
    if (answered) return;
    setAnswers(prev => [...prev, isCorrect ? 'correct' : 'wrong']);
  }

  /** Eleven trycker sig vidare först när hen har läst klart facit. */
  function goNext() {
    if (!answered) return;
    if (currentIdx + 1 >= total) {
      submitChapterResult(chapter.id, answers.filter(x => x === 'correct').length, total);
    } else {
      setCurrentIdx(currentIdx + 1);
    }
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
    <div className="min-h-screen flex flex-col" style={pageStyle(a)}>
      <AppHeader
        title={chapter.title}
        subtitle={`${a.emoji} ${a.name}`}
        onBack={() => setView('chapter-map')}
        inkHex={a.glowHex}
        barStyle={headerStyle(a)}
      />

      {/* Progressbar */}
      <div className="h-2" style={{ background: withAlpha(SPACE.deepest, 0.6) }}>
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${progressPct}%`, background: a.accentHex, boxShadow: `0 0 12px ${withAlpha(a.glowHex, 0.7)}` }}
        />
      </div>

      {/* Räknare */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{ background: withAlpha(SPACE.panel, 0.8), borderColor: withAlpha(a.accentHex, 0.25) }}
      >
        <span className="text-sm font-black" style={{ color: SPACE.onDarkMuted }}>
          Fråga {currentIdx + 1} av {total}
        </span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-sm font-black text-green-400" aria-label={`${correct} rätt`}>
            <CheckCircle size={15} aria-hidden="true" /> {correct}
          </span>
          <span className="flex items-center gap-1 text-sm font-black text-red-400" aria-label={`${answers.filter(x => x === 'wrong').length} fel`}>
            <XCircle size={15} aria-hidden="true" /> {answers.filter(x => x === 'wrong').length}
          </span>
        </div>
      </div>

      {/* Övningskort */}
      <main className="flex-1 p-4 sm:p-6 max-w-2xl w-full mx-auto">
        <div className="clay-card p-5 sm:p-6 mt-2 animate-fade-in" key={exercise.id}>
          {renderExercise(exercise)}
          {answered && (
            <NextQuestionButton onClick={goNext} isLast={currentIdx + 1 >= total} />
          )}
        </div>
      </main>
    </div>
  );
}
