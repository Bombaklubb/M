import { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { getChaptersForArea } from '../data/areas';
import { pageStyle, headerStyle } from '../utils/theme';
import { Star, ArrowLeft } from 'lucide-react';

export default function ChapterMap() {
  const { selectedArea, setView, openChapterStudy, selectChapter, startExitTicket, getChapterProgressFor } = useApp();

  // Navigering hör hemma i en effekt – att anropa setView under render uppdaterar
  // AppProvider mitt i barnets rendering och kan ge en renderloop.
  useEffect(() => {
    if (!selectedArea) setView('area-select');
  }, [selectedArea, setView]);

  if (!selectedArea) return null;

  const chapters = getChaptersForArea(selectedArea.id);
  const a = selectedArea;

  return (
    <div className="min-h-screen" style={pageStyle(a)}>
      <header className="px-4 py-4 flex items-center gap-3" style={headerStyle(a)}>
        <button
          onClick={() => setView('area-select')}
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-all active:scale-95 cursor-pointer flex-shrink-0"
          style={{ background: `${a.inkHex}10`, border: `2px solid ${a.inkHex}20` }}
          aria-label="Tillbaka till startsidan"
        >
          <ArrowLeft size={18} style={{ color: a.inkHex }} />
        </button>

        <div className="flex-1 flex items-center gap-2.5 min-w-0">
          <span className="text-2xl" aria-hidden="true">{a.emoji}</span>
          <div className="min-w-0">
            <h1 className="font-bold text-xl leading-tight font-heading truncate" style={{ color: a.inkHex }}>
              {a.name}
            </h1>
            <p className="text-xs font-semibold opacity-60" style={{ color: a.inkHex }}>
              Välj ett kapitel
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 sm:p-6 pb-16">
        {chapters.length === 0 && (
          <div className="mt-8 text-center py-12 clay-card">
            <p className="text-4xl mb-3" aria-hidden="true">🚧</p>
            <p className="font-bold text-gray-700 text-lg">{a.name}</p>
            <p className="text-gray-500 text-sm mt-1">är under uppbyggnad. Kom tillbaka snart!</p>
          </div>
        )}
        <div className="grid grid-cols-1 gap-3 mt-4">
          {chapters.map(chapter => {
            const progress = getChapterProgressFor(chapter.id);
            const stars = progress?.stars ?? 0;
            const score = progress?.bestScore ?? null;

            return (
              <div key={chapter.id} className="clay-card p-4 transition-all">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{
                      background: `${a.progressHex}18`,
                      border: `2px solid ${a.progressHex}40`,
                    }}
                    aria-hidden="true"
                  >
                    {chapter.emoji}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-gray-400">Kapitel</span>
                      {progress?.completed && (
                        <span className="text-xs font-black text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Klar</span>
                      )}
                      {chapter.summary && (
                        <span
                          className="text-xs font-black px-2 py-0.5 rounded-full"
                          style={{ background: `${a.progressHex}15`, color: a.progressHex }}
                        >
                          Sammanfattning
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-gray-800 text-base leading-tight font-heading">
                      {chapter.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{chapter.description}</p>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <div className="flex gap-0.5 justify-end" aria-label={`${stars} av 3 stjärnor`}>
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
                            ? a.progressHex
                            : '#94a3b8',
                      }}
                    />
                  </div>
                )}

                {(chapter.summary || chapter.exercises.length > 0) && (
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {chapter.summary && ([
                      { tab: 'flashcards',  label: '🃏 Flashcards',          show: true },
                      { tab: 'concepts',    label: '📘 Begrepp',             show: true },
                      { tab: 'key-points',  label: '📋 Sammanfattning',      show: true },
                      { tab: 'cause-effect',label: '⚡ Orsak & konsekvens',  show: true },
                      { tab: 'sant-falskt', label: '✅ Sant eller falskt',   show: !!chapter.summary.trueFalse?.length },
                      { tab: 'matcha',      label: '🔗 Matcha begrepp',      show: true },
                      { tab: 'word-search', label: '🔍 Ordsökning',          show: true },
                      { tab: 'test',        label: '✏️ Test',                show: true },
                      { tab: 'tidslinje',   label: '📅 Tidslinje',           show: !!chapter.summary.timeline?.length },
                    ] as const).filter(b => b.show).map(({ tab, label }) => (
                      <button
                        key={tab}
                        onClick={() => openChapterStudy(chapter, tab)}
                        className="min-h-[44px] py-2 px-1.5 rounded-xl text-xs font-black transition-all active:scale-95 cursor-pointer text-center leading-tight break-words hyphens-auto"
                        style={{ background: `${a.progressHex}12`, border: `2px solid ${a.progressHex}35`, color: a.progressHex }}
                      >
                        {label}
                      </button>
                    ))}
                    {chapter.exercises.length > 0 && (
                      <>
                        <button
                          onClick={() => selectChapter(chapter)}
                          className="min-h-[44px] py-2 px-1.5 rounded-xl text-xs font-black transition-all active:scale-95 cursor-pointer text-center text-white leading-tight break-words"
                          style={{ background: a.progressHex, border: `2px solid ${a.progressHex}` }}
                        >
                          🎯 Öva-läge
                        </button>
                        <button
                          onClick={() => startExitTicket(chapter)}
                          className="min-h-[44px] py-2 px-1.5 rounded-xl text-xs font-black transition-all active:scale-95 cursor-pointer text-center leading-tight break-words"
                          style={{ background: '#fef3c7', border: '2px solid #fcd34d', color: '#b45309' }}
                        >
                          ⚡ Snabbkoll
                        </button>
                      </>
                    )}
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
