import { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { getChaptersForArea } from '../data/areas';
import { pageStyle } from '../utils/theme';
import { Star, RotateCcw, ArrowRight, Home, BookOpen, Zap } from 'lucide-react';
import Celebration from './Celebration';

export default function ChapterResult() {
  const { lastResult, selectedChapter, selectedArea, setView, selectChapter, openChapterStudy, startExitTicket } = useApp();

  useEffect(() => {
    if (!lastResult || !selectedChapter || !selectedArea) setView('area-select');
  }, [lastResult, selectedChapter, selectedArea, setView]);

  if (!lastResult || !selectedChapter || !selectedArea) return null;

  const { correctAnswers, totalQuestions, score, stars, isNewBest } = lastResult;
  const wrong = totalQuestions - correctAnswers;

  // Nästa kapitel hämtas inom samma område, i bokens ordning.
  const chapters = getChaptersForArea(selectedArea.id);
  const currentIdx = chapters.findIndex(c => c.id === selectedChapter.id);
  const nextChapter = currentIdx >= 0 ? chapters[currentIdx + 1] : undefined;

  const feedback =
    stars === 3 ? 'Fantastiskt! Tre stjärnor! 🎉' :
    stars === 2 ? 'Bra jobbat! Två stjärnor! 👏' :
    stars === 1 ? 'Godkänt! En stjärna! 💪' :
    'Försök igen – du klarar det! 🌟';

  return (
    <div className="min-h-screen flex flex-col" style={pageStyle(selectedArea)}>
      {stars === 3 && <Celebration />}
      <div className="max-w-lg mx-auto w-full p-4 sm:p-6 flex flex-col items-center pt-12 sm:pt-16 pb-16">

        {/* Stjärnor */}
        <div className="flex gap-3 mb-6" aria-label={`${stars} av 3 stjärnor`}>
          {[1, 2, 3].map((s, i) => (
            <Star
              key={s}
              size={48}
              className={`transition-all ${stars >= s ? 'text-amber-400 fill-amber-400 animate-star-pop' : 'text-gray-200 fill-gray-200'}`}
              style={{ animationDelay: `${i * 0.15}s` }}
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Poängcirkel */}
        <div className="clay-card w-32 h-32 rounded-full flex flex-col items-center justify-center mb-4">
          <span className="text-4xl font-heading font-bold text-gray-800">{score}%</span>
          <span className="text-xs font-black text-gray-400 mt-0.5">POÄNG</span>
        </div>

        <p className="text-xl font-heading font-bold text-gray-700 text-center mb-1">{feedback}</p>
        {isNewBest && <p className="text-sm font-black text-blue-600 mb-4">✨ Nytt rekord!</p>}

        {/* Statistik */}
        <div className="clay-card w-full p-4 mb-6 grid grid-cols-3 gap-4 text-center mt-4">
          <div>
            <p className="text-2xl font-heading font-bold text-green-600">{correctAnswers}</p>
            <p className="text-xs font-black text-gray-500 mt-0.5">RÄTT</p>
          </div>
          <div>
            <p className="text-2xl font-heading font-bold text-red-400">{wrong}</p>
            <p className="text-xs font-black text-gray-500 mt-0.5">FEL</p>
          </div>
          <div>
            <p className="text-2xl font-heading font-bold text-gray-700">{totalQuestions}</p>
            <p className="text-xs font-black text-gray-500 mt-0.5">TOTALT</p>
          </div>
        </div>

        {/* Knappar */}
        <div className="w-full space-y-3">
          {nextChapter && (
            <button
              onClick={() => selectChapter(nextChapter)}
              className="btn-primary-clay w-full py-4 flex items-center justify-center gap-2 text-base font-heading break-words"
            >
              Nästa kapitel: {nextChapter.title}
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          )}

          <div className="flex gap-3">
            {selectedChapter.summary && (
              <button
                onClick={() => openChapterStudy(selectedChapter)}
                className="btn-clay flex-1 py-3 flex items-center justify-center gap-2 text-sm font-heading bg-blue-50 border-blue-200 text-blue-700"
              >
                <BookOpen size={16} aria-hidden="true" />
                Plugga
              </button>
            )}
            {selectedChapter.exercises.length > 0 && (
              <button
                onClick={() => startExitTicket(selectedChapter)}
                className="btn-clay flex-1 py-3 flex items-center justify-center gap-2 text-sm font-heading bg-amber-50 border-amber-200 text-amber-700"
              >
                <Zap size={16} aria-hidden="true" />
                Snabbkoll
              </button>
            )}
          </div>

          <button
            onClick={() => selectChapter(selectedChapter)}
            className="btn-clay w-full py-4 flex items-center justify-center gap-2 text-base font-heading bg-white border-gray-200 text-gray-700"
          >
            <RotateCcw size={18} aria-hidden="true" />
            Gör om kapitlet
          </button>

          <button
            onClick={() => setView('chapter-map')}
            className="btn-clay w-full py-4 flex items-center justify-center gap-2 text-base font-heading bg-white border-gray-200 text-gray-600 break-words"
          >
            <Home size={18} aria-hidden="true" />
            Tillbaka till {selectedArea.name}
          </button>
        </div>
      </div>
    </div>
  );
}
