import { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import AppHeader from './AppHeader';
import WordSearch from './WordSearch';
import { BookOpen, Eye, EyeOff, ArrowRight } from 'lucide-react';

type StudyTab = 'concepts' | 'key-points' | 'cause-effect' | 'word-search';

export default function ChapterStudy() {
  const { selectedChapter, selectedSubject, setView, studyInitialTab } = useApp();
  const [revealedConcepts, setRevealedConcepts] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<StudyTab>(studyInitialTab);
  const [conceptImages, setConceptImages] = useState<Record<string, string | null>>({});

  if (!selectedChapter || !selectedSubject) { setView('subject-select'); return null; }

  const summary = selectedChapter.summary;
  if (!summary) { setView('chapter-exercise'); return null; }

  const chapter = selectedChapter;
  const s = selectedSubject;

  // Fetch Wikipedia thumbnails for all concepts on mount
  useEffect(() => {
    setConceptImages({});
    let cancelled = false;
    async function fetchImages() {
      const results: Record<string, string | null> = {};
      await Promise.all(
        summary!.concepts.map(async ({ term }) => {
          try {
            const res = await fetch(
              `https://sv.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`,
              { headers: { 'Accept': 'application/json' } }
            );
            if (!res.ok) { results[term] = null; return; }
            const data = await res.json();
            results[term] = data?.thumbnail?.source ?? null;
          } catch {
            results[term] = null;
          }
        })
      );
      if (!cancelled) setConceptImages(results);
    }
    fetchImages();
    return () => { cancelled = true; };
  }, [chapter.id]);

  function toggleConcept(i: number) {
    setRevealedConcepts(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  const allRevealed = revealedConcepts.size === summary.concepts.length;
  const TABS: { id: StudyTab; label: string }[] = [
    { id: 'concepts',    label: '📘 Begrepp' },
    { id: 'key-points',  label: '📋 Sammanfattning' },
    { id: 'cause-effect',label: '⚡ Orsak & konsekvens' },
    { id: 'word-search', label: '🔍 Ordsökning' },
  ];

  return (
    <div className={`min-h-screen flex flex-col ${s.pageBgClass}`}>
      <AppHeader
        title={chapter.title}
        subtitle={`${s.emoji} Sammanfattning`}
        onBack={() => setView('chapter-map')}
        accentClass={s.textClass}
        headerClass={s.headerClass}
        headingFont={s.headingFont}
        titleStyle={{ color: s.inkHex }}
      />

      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 pb-10">

        {/* Student connection */}
        <div
          className="clay-card-sm p-4 mb-5 flex gap-3 items-start"
          style={{ background: `${s.progressHex}12`, borderColor: `${s.progressHex}40` }}
        >
          <span className="text-2xl flex-shrink-0">💡</span>
          <p className="text-sm font-semibold" style={{ color: s.inkHex }}>{summary.studentConnection}</p>
        </div>

        {/* Tabs — two rows of 2 */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="py-2 px-1 rounded-xl text-xs font-black border-2 transition-all cursor-pointer"
              style={activeTab === tab.id ? {
                background: `${s.progressHex}18`,
                borderColor: s.progressHex,
                color: s.progressHex,
              } : {
                background: 'white',
                borderColor: '#e5e7eb',
                color: '#6b7280',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- CONCEPTS --- */}
        {activeTab === 'concepts' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-black text-gray-500 uppercase tracking-wide">
                Tryck på kortet för att se förklaringen
              </p>
              <button
                onClick={allRevealed ? () => setRevealedConcepts(new Set()) : () => setRevealedConcepts(new Set(summary.concepts.map((_, i) => i)))}
                className="flex items-center gap-1 text-xs font-black cursor-pointer"
                style={{ color: s.progressHex }}
              >
                {allRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                {allRevealed ? 'Dölj alla' : 'Visa alla'}
              </button>
            </div>
            <div className="space-y-3">
              {summary.concepts.map((concept, i) => {
                const revealed = revealedConcepts.has(i);
                const img = conceptImages[concept.term];
                return (
                  <button
                    key={i}
                    onClick={() => toggleConcept(i)}
                    className="w-full text-left clay-card p-4 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                    style={revealed ? { borderColor: s.progressHex } : {}}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-heading font-bold text-gray-800 text-base">{concept.term}</p>
                        {revealed && (
                          <>
                            {img && (
                              <img
                                src={img}
                                alt={concept.term}
                                className="mt-2 mb-2 rounded-xl object-cover w-full"
                                style={{ maxHeight: '140px', objectPosition: 'center' }}
                              />
                            )}
                            <p className="text-sm text-gray-600 mt-1 leading-relaxed">{concept.definition}</p>
                          </>
                        )}
                      </div>
                      <span
                        className={`flex-shrink-0 mt-0.5 transition-transform ${revealed ? 'rotate-180' : ''}`}
                        style={{ color: s.progressHex }}
                      >
                        {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
                      </span>
                    </div>
                    {!revealed && (
                      <p className="text-xs text-gray-400 mt-1 font-semibold">Tryck för att se förklaring</p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* --- KEY POINTS --- */}
        {activeTab === 'key-points' && (
          <div className="clay-card p-5 space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={18} className={s.textClass} />
              <h2 className="font-heading font-bold text-gray-800">Det viktigaste att veta</h2>
            </div>
            {summary.keyPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0 mt-0.5"
                  style={{ background: s.accentHex }}
                >
                  {i + 1}
                </span>
                <p className="text-sm font-semibold text-gray-700 leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        )}

        {/* --- CAUSE & EFFECT --- */}
        {activeTab === 'cause-effect' && (
          <div className="space-y-4">
            <p className="text-xs font-black text-gray-500 uppercase tracking-wide mb-3">
              Förstå sambanden – varför hände det?
            </p>
            {summary.causeEffect.map((item, i) => (
              <div key={i} className="clay-card overflow-hidden">
                <div className="bg-red-50 px-4 py-3">
                  <p className="text-xs font-black text-red-500 uppercase tracking-wide mb-1">ORSAK</p>
                  <p className="text-sm font-semibold text-gray-800">{item.cause}</p>
                </div>
                <div className="flex items-center justify-center py-1.5 bg-gray-50">
                  <ArrowRight size={16} className="text-gray-400" />
                </div>
                <div className="bg-green-50 px-4 py-3">
                  <p className="text-xs font-black text-green-600 uppercase tracking-wide mb-1">KONSEKVENS</p>
                  <p className="text-sm font-semibold text-gray-800">{item.effect}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- WORD SEARCH --- */}
        {activeTab === 'word-search' && (
          <WordSearch
            words={summary.concepts.map(c => c.term)}
            accentColor={s.progressHex}
          />
        )}

      </main>
    </div>
  );
}
