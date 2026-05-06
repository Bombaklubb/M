import { useApp } from '../contexts/AppContext';
import { getChaptersForSubject } from '../data/subjects';
import { Lock, Star, BookOpen, Zap, ArrowLeft } from 'lucide-react';

export default function ChapterMap() {
  const { selectedSubject, setView, selectChapter, openChapterStudy, startExitTicket, isChapterUnlocked, getChapterProgressFor } = useApp();

  if (!selectedSubject) { setView('subject-select'); return null; }

  const chapters = getChaptersForSubject(selectedSubject.id);
  const s = selectedSubject;

  return (
    <div className={`min-h-screen ${s.pageBgClass}`}>
      {/* Themed header */}
      <header className={`${s.headerClass} px-4 py-4 flex items-center gap-3`}>
        <button
          onClick={() => setView('subject-select')}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 cursor-pointer"
          style={{ background: `${s.inkHex}10`, border: `2px solid ${s.inkHex}20` }}
          aria-label="Tillbaka"
        >
          <ArrowLeft size={18} style={{ color: s.inkHex }} />
        </button>

        <div className="flex-1 flex items-center gap-2.5">
          <span className="text-2xl">{s.emoji}</span>
          <div>
            <h1
              className={`font-bold text-xl leading-tight ${s.headingFont}`}
              style={{ color: s.inkHex }}
            >
              {s.name}
            </h1>
            <p className="text-xs font-semibold opacity-60" style={{ color: s.inkHex }}>
              Välj ett kapitel
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 sm:p-6 pb-16">
        <div className="grid grid-cols-1 gap-3 mt-4">
          {chapters.map((chapter, idx) => {
            const unlocked = isChapterUnlocked(chapter.id);
            const progress = getChapterProgressFor(chapter.id);
            const stars = progress?.stars ?? 0;
            const score = progress?.bestScore ?? null;

            return (
              <div
                key={chapter.id}
                className={`clay-card p-4 transition-all ${!unlocked ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={unlocked ? {
                      background: `${s.progressHex}18`,
                      border: `2px solid ${s.progressHex}40`,
                    } : { background: '#f3f4f6' }}
                  >
                    {unlocked ? chapter.emoji : <Lock size={20} className="text-gray-400" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-gray-400">Kapitel {idx + 1}</span>
                      {progress?.completed && (
                        <span className="text-xs font-black text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Klar</span>
                      )}
                      {chapter.summary && unlocked && (
                        <span
                          className="text-xs font-black px-2 py-0.5 rounded-full"
                          style={{ background: `${s.progressHex}15`, color: s.progressHex }}
                        >
                          Sammanfattning
                        </span>
                      )}
                    </div>
                    <p className={`font-bold text-gray-800 text-base leading-tight ${s.headingFont}`}>
                      {chapter.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{chapter.description}</p>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    {!unlocked ? (
                      <span className="text-xs text-gray-400 font-semibold">Låst</span>
                    ) : (
                      <>
                        <div className="flex gap-0.5 justify-end">
                          {[1, 2, 3].map(st => (
                            <Star
                              key={st}
                              size={16}
                              className={stars >= st ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}
                            />
                          ))}
                        </div>
                        {score !== null && (
                          <p className="text-xs text-gray-400 mt-1 font-semibold">{score}%</p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {progress && (
                  <div className="mt-3 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${progress.bestScore}%`,
                        background: progress.bestScore >= 90
                          ? '#16a34a'
                          : progress.bestScore >= 70
                            ? s.progressHex
                            : '#94a3b8',
                      }}
                    />
                  </div>
                )}

                {unlocked && (
                  <div className="flex gap-2 mt-3">
                    {chapter.summary && (
                      <button
                        onClick={() => openChapterStudy(chapter)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all active:scale-95 cursor-pointer"
                        style={{
                          background: `${s.progressHex}12`,
                          border: `2px solid ${s.progressHex}35`,
                          color: s.progressHex,
                        }}
                      >
                        <BookOpen size={13} />
                        Plugga
                      </button>
                    )}
                    <button
                      onClick={() => startExitTicket(chapter)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-amber-200 bg-amber-50 text-amber-700 text-xs font-black hover:bg-amber-100 active:scale-95 transition-all cursor-pointer"
                    >
                      <Zap size={13} />
                      Snabbkoll
                    </button>
                    <button
                      onClick={() => selectChapter(chapter)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer active:scale-95 text-white"
                      style={{
                        background: s.progressHex,
                        boxShadow: `0 3px 0 ${s.inkHex}60`,
                      }}
                    >
                      Öva →
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
