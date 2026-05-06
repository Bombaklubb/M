import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import AppHeader from './AppHeader';
import { BookOpen, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function ChapterStudy() {
  const { selectedChapter, selectedSubject, setView, studyInitialTab } = useApp();
  const [revealedConcepts, setRevealedConcepts] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<'concepts' | 'key-points' | 'cause-effect'>(studyInitialTab);

  if (!selectedChapter || !selectedSubject) { setView('subject-select'); return null; }

  const summary = selectedChapter.summary;
  if (!summary) {
    setView('chapter-exercise');
    return null;
  }

  const chapter = selectedChapter;

  function toggleConcept(i: number) {
    setRevealedConcepts(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  function revealAll() {
    setRevealedConcepts(new Set(summary!.concepts.map((_, i) => i)));
  }

  function hideAll() {
    setRevealedConcepts(new Set());
  }

  const allRevealed = revealedConcepts.size === summary.concepts.length;

  return (
    <div className={`min-h-screen flex flex-col ${selectedSubject.pageBgClass}`}>
      <AppHeader
        title={chapter.title}
        subtitle={`${selectedSubject.emoji} Sammanfattning`}
        onBack={() => setView('chapter-map')}
        accentClass={selectedSubject.textClass}
        headerClass={selectedSubject.headerClass}
        headingFont={selectedSubject.headingFont}
        titleStyle={{ color: selectedSubject.inkHex }}
      />

      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 pb-10">

        {/* Student connection */}
        <div
          className="clay-card-sm p-4 mb-5 flex gap-3 items-start"
          style={{ background: `${selectedSubject.progressHex}12`, borderColor: `${selectedSubject.progressHex}40` }}
        >
          <span className="text-2xl flex-shrink-0">💡</span>
          <p className="text-sm font-semibold" style={{ color: selectedSubject.inkHex }}>{summary.studentConnection}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {(['concepts', 'key-points', 'cause-effect'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 px-1 rounded-xl text-xs font-black border-2 transition-all cursor-pointer"
              style={activeTab === tab ? {
                background: `${selectedSubject.progressHex}18`,
                borderColor: selectedSubject.progressHex,
                color: selectedSubject.progressHex,
              } : {
                background: 'white',
                borderColor: '#e5e7eb',
                color: '#6b7280',
              }}
            >
              {tab === 'concepts' ? '📘 Begrepp' : tab === 'key-points' ? '📋 Sammanfattning' : '⚡ Orsak & konsekvens'}
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
                onClick={allRevealed ? hideAll : revealAll}
                className="flex items-center gap-1 text-xs font-black cursor-pointer"
                style={{ color: selectedSubject.progressHex }}
              >
                {allRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                {allRevealed ? 'Dölj alla' : 'Visa alla'}
              </button>
            </div>
            <div className="space-y-3">
              {summary.concepts.map((concept, i) => {
                const revealed = revealedConcepts.has(i);
                return (
                  <button
                    key={i}
                    onClick={() => toggleConcept(i)}
                    className="w-full text-left clay-card p-4 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                    style={revealed ? { borderColor: selectedSubject.progressHex } : {}}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-heading font-bold text-gray-800 text-base">{concept.term}</p>
                        {revealed && (
                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{concept.definition}</p>
                        )}
                      </div>
                      <span className={`flex-shrink-0 transition-transform ${revealed ? 'rotate-180' : ''}`} style={{ color: selectedSubject.progressHex }}>
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
              <BookOpen size={18} className={selectedSubject.textClass} />
              <h2 className="font-heading font-bold text-gray-800">Det viktigaste att veta</h2>
            </div>
            {summary.keyPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0 mt-0.5`}
                  style={{ background: selectedSubject.accentHex }}>
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
      </main>

    </div>
  );
}
