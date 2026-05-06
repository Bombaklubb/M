import { useApp } from '../contexts/AppContext';
import { getChaptersForSubject } from '../data/subjects';
import { Star, RotateCcw, ArrowRight, Home, BookOpen, Zap } from 'lucide-react';

export default function ChapterResult() {
  const { lastResult, selectedChapter, selectedSubject, setView, selectChapter, openChapterStudy, startExitTicket, isChapterUnlocked } = useApp();

  if (!lastResult || !selectedChapter || !selectedSubject) { setView('subject-select'); return null; }

  const { correctAnswers, totalQuestions, score, stars, isNewBest } = lastResult;
  const wrong = totalQuestions - correctAnswers;

  // Find next chapter
  const chapters = getChaptersForSubject(selectedSubject.id);
  const currentIdx = chapters.findIndex(c => c.id === selectedChapter.id);
  const nextChapter = chapters[currentIdx + 1];
  const nextUnlocked = nextChapter ? isChapterUnlocked(nextChapter.id) : false;

  const starColors = ['text-amber-400 fill-amber-400', 'text-amber-400 fill-amber-400', 'text-amber-400 fill-amber-400'];

  const feedback =
    stars === 3 ? 'Fantastiskt! Tre stjärnor! 🎉' :
    stars === 2 ? 'Bra jobbat! Två stjärnor! 👏' :
    stars === 1 ? 'Godkänt! En stjärna! 💪' :
    'Försök igen – du klarar det! 🌟';

  return (
    <div className={`min-h-screen flex flex-col ${selectedSubject.pageBgClass}`}>
      <div className="max-w-lg mx-auto w-full p-4 sm:p-6 flex flex-col items-center pt-12 sm:pt-16 pb-16">

        {/* Stars */}
        <div className="flex gap-3 mb-6">
          {[1, 2, 3].map((s, i) => (
            <Star
              key={s}
              size={48}
              className={`transition-all ${stars >= s ? starColors[i] + ' animate-star-pop' : 'text-gray-200 fill-gray-200'}`}
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>

        {/* Score circle */}
        <div className="clay-card w-32 h-32 rounded-full flex flex-col items-center justify-center mb-4">
          <span className="text-4xl font-heading font-bold text-gray-800">{score}%</span>
          <span className="text-xs font-black text-gray-400 mt-0.5">POÄNG</span>
        </div>

        {/* Feedback */}
        <p className="text-xl font-heading font-bold text-gray-700 text-center mb-1">{feedback}</p>
        {isNewBest && <p className="text-sm font-black text-indigo-600 mb-4">✨ Nytt rekord!</p>}

        {/* Stats */}
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

        {/* Actions */}
        <div className="w-full space-y-3">
          {/* Next chapter */}
          {nextChapter && nextUnlocked && (
            <button
              onClick={() => selectChapter(nextChapter)}
              className="btn-primary-clay w-full py-4 flex items-center justify-center gap-2 text-base font-heading"
            >
              Nästa kapitel: {nextChapter.title}
              <ArrowRight size={18} />
            </button>
          )}

          {/* Quick row: Study + Exit ticket */}
          <div className="flex gap-3">
            {selectedChapter.summary && (
              <button
                onClick={() => openChapterStudy(selectedChapter)}
                className="btn-clay flex-1 py-3 flex items-center justify-center gap-2 text-sm font-heading bg-indigo-50 border-indigo-200 text-indigo-700"
              >
                <BookOpen size={16} />
                Plugga
              </button>
            )}
            <button
              onClick={() => startExitTicket(selectedChapter)}
              className="btn-clay flex-1 py-3 flex items-center justify-center gap-2 text-sm font-heading bg-amber-50 border-amber-200 text-amber-700"
            >
              <Zap size={16} />
              Snabbkoll
            </button>
          </div>

          {/* Retry */}
          <button
            onClick={() => selectChapter(selectedChapter)}
            className="btn-clay w-full py-4 flex items-center justify-center gap-2 text-base font-heading bg-white border-gray-200 text-gray-700"
          >
            <RotateCcw size={18} />
            Gör om kapitlet
          </button>

          {/* Back to chapter map */}
          <button
            onClick={() => setView('chapter-map')}
            className="btn-clay w-full py-4 flex items-center justify-center gap-2 text-base font-heading bg-white border-gray-200 text-gray-600"
          >
            <Home size={18} />
            Tillbaka till {selectedSubject.name}
          </button>
        </div>
      </div>
    </div>
  );
}
