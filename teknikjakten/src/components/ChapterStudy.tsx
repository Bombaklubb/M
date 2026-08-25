import { useState, useEffect, useMemo, useRef } from 'react';
import { useApp, type StudyTab } from '../contexts/AppContext';
import { shuffle } from '../utils/shuffle';
import { fetchConceptImage } from '../utils/imageCache';
import { pageStyle, headerStyle, SPACE, withAlpha } from '../utils/theme';
import AppHeader from './AppHeader';
import Celebration from './Celebration';
import WordSearch from './WordSearch';
import { Eye, EyeOff, ArrowRight, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import SantFalsktTab from './tabs/SantFalsktTab';
import MatchaTab from './tabs/MatchaTab';
import TimelineTab from './tabs/TimelineTab';
import KeyPointsTab from './tabs/KeyPointsTab';
import FlashcardsTab from './tabs/FlashcardsTab';

const TAB_LABELS: Record<StudyTab, string> = {
  'flashcards':  '🃏 Flashcards',
  'concepts':    '📘 Begrepp',
  'key-points':  '📋 Sammanfattning',
  'cause-effect':'⚡ Orsak & konsekvens',
  'sant-falskt': '✅ Sant eller falskt',
  'matcha':      '🔗 Matcha begrepp',
  'word-search': '🔍 Ordsökning',
  'test':        '✏️ Test',
  'tidslinje':   '📅 Tidslinje',
};

export default function ChapterStudy() {
  const { selectedChapter, selectedArea, setView, studyInitialTab } = useApp();

  // Alla hooks ligger överst, före varje villkorlig return – annars kraschar vyn
  // så fort ett kapitel saknar sammanfattning.
  const [revealedConcepts, setRevealedConcepts] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<StudyTab>(studyInitialTab);
  const [conceptImages, setConceptImages] = useState<Record<string, string | null>>({});

  // --- TEST-state ---
  const [testIdx, setTestIdx] = useState(0);
  const [testAnswered, setTestAnswered] = useState<number | null>(null);
  const [testScore, setTestScore] = useState(0);
  const [testDone, setTestDone] = useState(false);
  const testTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (testTimer.current) clearTimeout(testTimer.current); }, []);

  const chapterId = selectedChapter?.id ?? '';
  // Memoiseras så att effekter och useMemo nedan får en stabil referens.
  const concepts = useMemo(
    () => selectedChapter?.summary?.concepts ?? [],
    [selectedChapter],
  );

  const testQuestions = useMemo(() => {
    if (concepts.length < 2) return [];
    return concepts.map((c, i) => {
      const showDef = i % 2 === 0;
      const correct = showDef ? c.term : c.definition;
      const pool = concepts.filter((_, j) => j !== i).map(x => showDef ? x.term : x.definition);
      const distractors = shuffle(pool).slice(0, 3);
      const options = shuffle([...distractors, correct]);
      return {
        prompt: showDef ? c.definition : c.term,
        label: showDef ? 'Vad heter begreppet?' : 'Vad betyder ordet?',
        correct,
        options,
      };
    });
  }, [concepts]);

  // Wikipedia-miniatyrer för alla begrepp (cachas i sessionStorage och
  // respekterar wikiTitle-fältet per begrepp).
  useEffect(() => {
    if (!chapterId) return;
    setConceptImages({});
    let cancelled = false;
    async function fetchImages() {
      const results: Record<string, string | null> = {};
      await Promise.all(concepts.map(async concept => {
        results[concept.term] = await fetchConceptImage(concept);
      }));
      if (!cancelled) setConceptImages(results);
    }
    fetchImages();
    return () => { cancelled = true; };
  }, [chapterId, concepts]);

  useEffect(() => {
    if (!selectedChapter || !selectedArea) setView('area-select');
    else if (!selectedChapter.summary) setView('chapter-map');
  }, [selectedChapter, selectedArea, setView]);

  if (!selectedChapter || !selectedArea) return null;

  const summary = selectedChapter.summary;
  if (!summary) return null;

  const chapter = selectedChapter;
  const a = selectedArea;

  function answerTest(option: string) {
    if (testAnswered !== null) return;
    const idx = testQuestions[testIdx]?.options.indexOf(option) ?? -1;
    setTestAnswered(idx);
    if (option === testQuestions[testIdx]?.correct) setTestScore(n => n + 1);
    if (testTimer.current) clearTimeout(testTimer.current);
    testTimer.current = setTimeout(() => {
      testTimer.current = null;
      if (testIdx + 1 >= testQuestions.length) setTestDone(true);
      else { setTestIdx(i => i + 1); setTestAnswered(null); }
    }, 900);
  }

  function resetTest() {
    if (testTimer.current) { clearTimeout(testTimer.current); testTimer.current = null; }
    setTestIdx(0); setTestAnswered(null); setTestScore(0); setTestDone(false);
  }

  function toggleConcept(i: number) {
    setRevealedConcepts(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  }

  const allRevealed = revealedConcepts.size === summary.concepts.length;

  // Bara de flikar som faktiskt har innehåll i det här kapitlet.
  const availableTabs = (Object.keys(TAB_LABELS) as StudyTab[]).filter(tab => {
    if (tab === 'tidslinje') return !!summary.timeline?.length;
    if (tab === 'sant-falskt') return !!summary.trueFalse?.length;
    return true;
  });

  /** Byter flik och nollställer testet så att poängen inte följer med mellan lägen. */
  function switchTab(tab: StudyTab) {
    setActiveTab(tab);
    resetTest();
  }

  return (
    <div className="min-h-screen flex flex-col" style={pageStyle(a)}>
      <AppHeader
        title={chapter.title}
        subtitle={TAB_LABELS[activeTab]}
        onBack={() => setView('chapter-map')}
        inkHex={a.glowHex}
        barStyle={headerStyle(a)}
      />

      {/* Flikväxlare – eleven kan byta övningsläge utan att gå tillbaka till kartan */}
      <nav
        className="sticky top-0 z-30 overflow-x-auto border-b"
        style={{ background: withAlpha(SPACE.panel, 0.92), borderColor: withAlpha(a.accentHex, 0.35) }}
        aria-label="Övningslägen"
      >
        <div className="flex gap-1.5 px-3 py-2 w-max">
          {availableTabs.map(tab => {
            const active = tab === activeTab;
            return (
              <button
                key={tab}
                onClick={() => switchTab(tab)}
                aria-current={active ? 'page' : undefined}
                className="whitespace-nowrap min-h-[44px] px-3 rounded-xl text-xs font-black transition-all active:scale-95 cursor-pointer"
                style={active
                  ? { background: a.accentHex, color: SPACE.deepest, border: `2px solid ${a.accentHex}`, boxShadow: `0 0 16px ${withAlpha(a.glowHex, 0.55)}` }
                  : { background: withAlpha(SPACE.navy, 0.55), color: a.glowHex, border: `2px solid ${withAlpha(a.accentHex, 0.35)}` }}
              >
                {TAB_LABELS[tab]}
              </button>
            );
          })}
        </div>
      </nav>

      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 pb-10">

        {/* Koppling till elevens vardag – bara på innehållsflikarna */}
        {(activeTab === 'concepts' || activeTab === 'key-points' || activeTab === 'cause-effect') && (
          <div
            className="clay-card-sm p-4 mb-5 flex gap-3 items-start"
            style={{ borderColor: withAlpha(a.accentHex, 0.5) }}
          >
            <span className="text-2xl flex-shrink-0" aria-hidden="true">💡</span>
            <p className="text-sm font-semibold" style={{ color: a.inkHex }}>{summary.studentConnection}</p>
          </div>
        )}

        {/* --- BEGREPP --- */}
        {activeTab === 'concepts' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-black uppercase tracking-wide" style={{ color: SPACE.onDarkMuted }}>
                Tryck på kortet för att se förklaringen
              </p>
              <button
                onClick={allRevealed ? () => setRevealedConcepts(new Set()) : () => setRevealedConcepts(new Set(summary.concepts.map((_, i) => i)))}
                className="flex items-center gap-1 text-xs font-black cursor-pointer"
                style={{ color: a.glowHex }}
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
                    style={revealed ? { borderColor: a.progressHex } : {}}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-heading font-bold text-gray-800 text-base break-words">{concept.term}</p>
                        {revealed && (
                          <>
                            {img && (
                              <img
                                src={img}
                                alt={concept.term}
                                loading="lazy" width={640} height={140}
                                className="mt-2 mb-2 rounded-xl object-cover w-full"
                                style={{ height: '140px', objectPosition: 'center' }}
                              />
                            )}
                            <p className="text-sm text-gray-600 mt-1 leading-relaxed">{concept.definition}</p>
                          </>
                        )}
                      </div>
                      <span
                        className={`flex-shrink-0 mt-0.5 transition-transform ${revealed ? 'rotate-180' : ''}`}
                        // Ikonen ligger på ett ljust kort – områdets mörka variant.
                        style={{ color: a.inkHex }}
                      >
                        {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
                      </span>
                    </div>
                    {!revealed && (
                      <p className="text-xs text-gray-500 mt-1 font-semibold">Tryck för att se förklaring</p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* --- SAMMANFATTNING --- */}
        {activeTab === 'key-points' && (
          <KeyPointsTab
            keyPoints={summary.keyPoints}
            accentHex={a.accentHex}
            progressHex={a.progressHex}
            inkHex={a.inkHex}
            textClass=""
          />
        )}

        {/* --- ORSAK & KONSEKVENS --- */}
        {activeTab === 'cause-effect' && (
          <div className="space-y-4">
            <p className="text-xs font-black uppercase tracking-wide mb-3" style={{ color: SPACE.onDarkMuted }}>
              Förstå sambanden – varför blev det så?
            </p>
            {summary.causeEffect.map((item, i) => (
              <div key={i} className="clay-card overflow-hidden">
                <div className="bg-red-50 px-4 py-3">
                  <p className="text-xs font-black text-red-700 uppercase tracking-wide mb-1">ORSAK</p>
                  <p className="text-sm font-semibold text-gray-800">{item.cause}</p>
                </div>
                <div className="flex items-center justify-center py-1.5 bg-gray-50">
                  <ArrowRight size={16} className="text-gray-400" aria-hidden="true" />
                </div>
                <div className="bg-green-50 px-4 py-3">
                  <p className="text-xs font-black text-green-700 uppercase tracking-wide mb-1">KONSEKVENS</p>
                  <p className="text-sm font-semibold text-gray-800">{item.effect}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- FLASHCARDS --- */}
        {activeTab === 'flashcards' && (
          <FlashcardsTab concepts={summary.concepts} inkHex={a.inkHex} progressHex={a.progressHex} accentHex={a.accentHex} glowHex={a.glowHex} />
        )}

        {/* --- SANT ELLER FALSKT --- */}
        {activeTab === 'sant-falskt' && (
          <SantFalsktTab items={summary.trueFalse ?? []} progressHex={a.progressHex} glowHex={a.glowHex} />
        )}

        {/* --- MATCHA BEGREPP --- */}
        {activeTab === 'matcha' && (
          <MatchaTab concepts={summary.concepts} progressHex={a.progressHex} accentHex={a.accentHex} glowHex={a.glowHex} />
        )}

        {/* --- TIDSLINJE --- */}
        {activeTab === 'tidslinje' && (
          <TimelineTab events={summary.timeline ?? []} progressHex={a.progressHex} />
        )}

        {/* --- ORDSÖKNING --- */}
        {activeTab === 'word-search' && (
          <WordSearch
            words={summary.concepts.map(c => c.term)}
            accentColor={a.progressHex}
            inkColor={a.inkHex}
          />
        )}

        {/* --- TEST --- */}
        {activeTab === 'test' && (
          <div>
            {testDone ? (
              <div className="clay-card p-6 text-center">
                {testScore === testQuestions.length && <Celebration />}
                <p className="text-5xl mb-3" aria-hidden="true">{testScore === testQuestions.length ? '🏆' : testScore >= testQuestions.length / 2 ? '👍' : '💪'}</p>
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
                  <RotateCcw size={15} aria-hidden="true" />
                  Testa igen
                </button>
              </div>
            ) : testQuestions.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black" style={{ color: SPACE.onDarkMuted }}>Fråga {testIdx + 1} av {testQuestions.length}</span>
                  <span className="text-xs font-black" style={{ color: a.glowHex }}>{testScore} rätt</span>
                </div>
                <div className="h-1.5 rounded-full mb-5 overflow-hidden" style={{ background: withAlpha(SPACE.deepest, 0.6) }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${(testIdx / testQuestions.length) * 100}%`, background: a.accentHex }} />
                </div>

                <div className="clay-card p-5 mb-4">
                  <p className="text-xs font-black uppercase tracking-wide mb-2" style={{ color: a.inkHex, opacity: 0.85 }}>
                    {testQuestions[testIdx].label}
                  </p>
                  <p className="text-base font-semibold text-gray-800 leading-relaxed">
                    {testQuestions[testIdx].prompt}
                  </p>
                </div>

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
                        className="w-full text-left p-3 min-h-[44px] rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer disabled:cursor-default flex items-center justify-between gap-3 break-words"
                        style={style}
                      >
                        <span>{opt}</span>
                        {testAnswered !== null && isCorrect && <CheckCircle size={16} className="flex-shrink-0 text-green-600" aria-hidden="true" />}
                        {testAnswered !== null && isChosen && !isCorrect && <XCircle size={16} className="flex-shrink-0 text-red-500" aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-sm text-center py-8" style={{ color: SPACE.onDarkMuted }}>Inte tillräckligt med begrepp för ett test.</p>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
