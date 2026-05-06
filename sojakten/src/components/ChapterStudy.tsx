import { useState, useEffect, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import AppHeader from './AppHeader';
import WordSearch from './WordSearch';
import { BookOpen, Eye, EyeOff, ArrowRight, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

type StudyTab = 'concepts' | 'key-points' | 'cause-effect' | 'word-search' | 'test'; // mirrors AppContext StudyTab

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

  // --- TEST state ---
  const [testIdx, setTestIdx] = useState(0);
  const [testAnswered, setTestAnswered] = useState<number | null>(null);
  const [testScore, setTestScore] = useState(0);
  const [testDone, setTestDone] = useState(false);

  const testQuestions = useMemo(() => {
    const concepts = summary?.concepts ?? [];
    if (concepts.length < 2) return [];
    return concepts.map((c, i) => {
      const showDef = i % 2 === 0;
      const correct = showDef ? c.term : c.definition;
      const pool = concepts.filter((_, j) => j !== i).map(x => showDef ? x.term : x.definition);
      const distractors = [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [...distractors, correct].sort(() => Math.random() - 0.5);
      return {
        prompt: showDef ? c.definition : c.term,
        label: showDef ? 'Vad heter begreppet?' : 'Vad betyder ordet?',
        correct,
        options,
      };
    });
  }, [chapter.id]);

  function answerTest(option: string) {
    if (testAnswered !== null) return;
    const idx = testQuestions[testIdx]?.options.indexOf(option) ?? -1;
    setTestAnswered(idx);
    if (option === testQuestions[testIdx]?.correct) setTestScore(s => s + 1);
    setTimeout(() => {
      if (testIdx + 1 >= testQuestions.length) setTestDone(true);
      else { setTestIdx(i => i + 1); setTestAnswered(null); }
    }, 900);
  }

  function resetTest() {
    setTestIdx(0); setTestAnswered(null); setTestScore(0); setTestDone(false);
  }

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
  const TAB_LABELS: Record<StudyTab, string> = {
    'concepts':    '📘 Begrepp',
    'key-points':  '📋 Sammanfattning',
    'cause-effect':'⚡ Orsak & konsekvens',
    'word-search': '🔍 Ordsökning',
    'test':        '✏️ Test',
  };

  return (
    <div className={`min-h-screen flex flex-col ${s.pageBgClass}`}>
      <AppHeader
        title={chapter.title}
        subtitle={TAB_LABELS[activeTab]}
        onBack={() => setView('chapter-map')}
        accentClass={s.textClass}
        headerClass={s.headerClass}
        headingFont={s.headingFont}
        titleStyle={{ color: s.inkHex }}
      />

      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 pb-10">

        {/* Student connection — only on content tabs */}
        {(activeTab === 'concepts' || activeTab === 'key-points' || activeTab === 'cause-effect') && (
          <div
            className="clay-card-sm p-4 mb-5 flex gap-3 items-start"
            style={{ background: `${s.progressHex}12`, borderColor: `${s.progressHex}40` }}
          >
            <span className="text-2xl flex-shrink-0">💡</span>
            <p className="text-sm font-semibold" style={{ color: s.inkHex }}>{summary.studentConnection}</p>
          </div>
        )}

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

        {/* --- TEST --- */}
        {activeTab === 'test' && (
          <div>
            {testDone ? (
              <div className="clay-card p-6 text-center">
                <p className="text-5xl mb-3">{testScore === testQuestions.length ? '🏆' : testScore >= testQuestions.length / 2 ? '👍' : '💪'}</p>
                <p className="font-heading font-bold text-xl text-gray-800 mb-1">
                  {testScore} / {testQuestions.length} rätt
                </p>
                <p className="text-sm text-gray-500 mb-5">
                  {testScore === testQuestions.length ? 'Perfekt! Du kan allt!' : testScore >= testQuestions.length / 2 ? 'Bra jobbat!' : 'Öva lite till så sitter det!'}
                </p>
                <button
                  onClick={resetTest}
                  className="btn-clay flex items-center gap-2 mx-auto px-5 py-3 text-sm font-heading bg-white border-gray-200 text-gray-700"
                >
                  <RotateCcw size={15} />
                  Testa igen
                </button>
              </div>
            ) : testQuestions.length > 0 ? (
              <div>
                {/* Progress */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-gray-400">Fråga {testIdx + 1} av {testQuestions.length}</span>
                  <span className="text-xs font-black" style={{ color: s.progressHex }}>{testScore} rätt</span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 mb-5 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${((testIdx) / testQuestions.length) * 100}%`, background: s.progressHex }} />
                </div>

                {/* Question */}
                <div className="clay-card p-5 mb-4">
                  <p className="text-xs font-black uppercase tracking-wide mb-2 opacity-60" style={{ color: s.inkHex }}>
                    {testQuestions[testIdx].label}
                  </p>
                  <p className="text-base font-semibold text-gray-800 leading-relaxed">
                    {testQuestions[testIdx].prompt}
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-2">
                  {testQuestions[testIdx].options.map((opt, i) => {
                    const isCorrect = opt === testQuestions[testIdx].correct;
                    const isChosen = testAnswered === i;
                    let style: React.CSSProperties = { background: 'white', borderColor: '#e5e7eb', color: '#374151' };
                    if (testAnswered !== null) {
                      if (isCorrect) style = { background: '#dcfce7', borderColor: '#86efac', color: '#15803d' };
                      else if (isChosen) style = { background: '#fee2e2', borderColor: '#fca5a5', color: '#dc2626' };
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => answerTest(opt)}
                        disabled={testAnswered !== null}
                        className="w-full text-left p-3 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer disabled:cursor-default flex items-center justify-between gap-3"
                        style={style}
                      >
                        <span>{opt}</span>
                        {testAnswered !== null && isCorrect && <CheckCircle size={16} className="flex-shrink-0 text-green-600" />}
                        {testAnswered !== null && isChosen && !isCorrect && <XCircle size={16} className="flex-shrink-0 text-red-500" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">Inte tillräckligt med begrepp för ett test.</p>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
