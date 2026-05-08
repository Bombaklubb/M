import { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import AppHeader from './AppHeader';
import WordSearch from './WordSearch';
import { BookOpen, Eye, EyeOff, ArrowRight, CheckCircle, XCircle, RotateCcw, ChevronDown, ChevronUp, Volume2, VolumeX } from 'lucide-react';

function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const cancelled = useRef(false);

  useEffect(() => {
    return () => { cancelled.current = true; window.speechSynthesis.cancel(); };
  }, []);

  function speakList(lines: string[]) {
    window.speechSynthesis.cancel();
    cancelled.current = false;
    setSpeaking(true);

    function speakOne(i: number) {
      if (cancelled.current || i >= lines.length) {
        setSpeaking(false);
        setActiveIdx(null);
        return;
      }
      setActiveIdx(i);
      const utt = new SpeechSynthesisUtterance(lines[i]);
      utt.lang = 'sv-SE';
      utt.rate = 0.92;
      utt.onend = () => speakOne(i + 1);
      utt.onerror = () => { setSpeaking(false); setActiveIdx(null); };
      window.speechSynthesis.speak(utt);
    }
    speakOne(0);
  }

  function stop() {
    cancelled.current = true;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setActiveIdx(null);
  }

  return { speaking, activeIdx, speakList, stop };
}

type StudyTab = 'concepts' | 'key-points' | 'cause-effect' | 'word-search' | 'test' | 'questions' | 'flashcards'; // mirrors AppContext StudyTab

function KeyPointsTab({ keyPoints, accentHex, progressHex, textClass }: {
  keyPoints: string[];
  accentHex: string;
  progressHex: string;
  textClass: string;
}) {
  const { speaking, activeIdx, speakList, stop } = useSpeech();

  function handleToggle() {
    if (speaking) { stop(); return; }
    speakList(keyPoints);
  }

  return (
    <div className="clay-card p-5 space-y-3">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className={textClass} />
          <h2 className="font-heading font-bold text-gray-800">Det viktigaste att veta</h2>
        </div>
        <button
          onClick={handleToggle}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 cursor-pointer"
          style={speaking
            ? { background: `${progressHex}20`, border: `2px solid ${progressHex}50`, color: progressHex }
            : { background: '#f3f4f6', border: '2px solid #e5e7eb', color: '#6b7280' }
          }
          aria-label={speaking ? 'Stoppa uppläsning' : 'Läs upp'}
        >
          {speaking
            ? <><VolumeX size={13} /> Stoppa</>
            : <><Volume2 size={13} /> Lyssna</>
          }
        </button>
      </div>
      {keyPoints.map((point, i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-xl px-2 py-1 transition-colors"
          style={activeIdx === i ? { background: `${progressHex}12` } : {}}
        >
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0 mt-0.5 transition-all"
            style={{ background: activeIdx === i ? progressHex : accentHex }}
          >
            {i + 1}
          </span>
          <p
            className="text-sm font-semibold leading-relaxed transition-colors"
            style={{ color: activeIdx === i ? '#111827' : '#374151' }}
          >
            {point}
          </p>
        </div>
      ))}
    </div>
  );
}

function FlashcardsTab({ concepts, inkHex, progressHex, accentHex }: {
  concepts: { term: string; definition: string }[];
  inkHex: string;
  progressHex: string;
  accentHex: string;
}) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shuffled, setShuffled] = useState(concepts);

  if (concepts.length === 0) {
    return <p className="text-sm text-gray-500 text-center py-8">Inga begrepp finns för det här kapitlet.</p>;
  }

  const card = shuffled[idx];
  const total = shuffled.length;

  function go(dir: 1 | -1) {
    setFlipped(false);
    setTimeout(() => setIdx(i => (i + dir + total) % total), 150);
  }

  function handleShuffle() {
    const copy = [...shuffled].sort(() => Math.random() - 0.5);
    setShuffled(copy);
    setIdx(0);
    setFlipped(false);
  }

  return (
    <div className="flex flex-col items-center">
      {/* Progress */}
      <div className="flex items-center justify-between w-full mb-3">
        <span className="text-xs font-black text-gray-400">
          Kort {idx + 1} av {total}
        </span>
        <button
          onClick={handleShuffle}
          className="text-xs font-black flex items-center gap-1 cursor-pointer"
          style={{ color: progressHex }}
        >
          🔀 Blanda
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-gray-100 mb-6 overflow-hidden w-full">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${((idx + 1) / total) * 100}%`, background: progressHex }}
        />
      </div>

      {/* Flip card */}
      <div
        className="flashcard-scene w-full cursor-pointer"
        style={{ maxWidth: '420px' }}
        onClick={() => setFlipped(f => !f)}
      >
        <div className={`flashcard-inner w-full${flipped ? ' is-flipped' : ''}`} style={{ height: '220px' }}>
          {/* Front — term */}
          <div
            className="flashcard-face absolute inset-0 rounded-3xl flex flex-col items-center justify-center p-6 text-center"
            style={{
              background: `linear-gradient(145deg, white, ${accentHex}10)`,
              border: `2.5px solid ${accentHex}40`,
              boxShadow: `0 6px 24px ${accentHex}22`,
            }}
          >
            <p className="text-xs font-black uppercase tracking-widest mb-3 opacity-50" style={{ color: inkHex }}>
              Begrepp
            </p>
            <p className="font-heading font-bold text-2xl leading-snug" style={{ color: inkHex }}>
              {card.term}
            </p>
            <p className="text-xs text-gray-400 font-semibold mt-4">Tryck för att se förklaring</p>
          </div>

          {/* Back — definition */}
          <div
            className="flashcard-face flashcard-face-back absolute inset-0 rounded-3xl flex flex-col items-center justify-center p-6 text-center"
            style={{
              background: `linear-gradient(145deg, ${accentHex}18, ${accentHex}08)`,
              border: `2.5px solid ${accentHex}60`,
              boxShadow: `0 6px 24px ${accentHex}30`,
            }}
          >
            <p className="text-xs font-black uppercase tracking-widest mb-3 opacity-50" style={{ color: inkHex }}>
              Förklaring
            </p>
            <p className="text-sm font-semibold leading-relaxed text-gray-700">
              {card.definition}
            </p>
          </div>
        </div>
      </div>

      {/* Nav buttons */}
      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={() => go(-1)}
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold transition-all active:scale-95 cursor-pointer"
          style={{ background: `${progressHex}15`, border: `2px solid ${progressHex}30`, color: progressHex }}
        >
          ←
        </button>
        <button
          onClick={() => setFlipped(f => !f)}
          className="px-6 h-12 rounded-2xl flex items-center justify-center text-sm font-black transition-all active:scale-95 cursor-pointer"
          style={{ background: progressHex, color: 'white' }}
        >
          {flipped ? 'Dölj svar' : 'Visa svar'}
        </button>
        <button
          onClick={() => go(1)}
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold transition-all active:scale-95 cursor-pointer"
          style={{ background: `${progressHex}15`, border: `2px solid ${progressHex}30`, color: progressHex }}
        >
          →
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex gap-1.5 mt-4 flex-wrap justify-center" style={{ maxWidth: '280px' }}>
        {shuffled.map((_, i) => (
          <button
            key={i}
            onClick={() => { setIdx(i); setFlipped(false); }}
            className="w-2 h-2 rounded-full transition-all cursor-pointer"
            style={{ background: i === idx ? progressHex : `${progressHex}30` }}
          />
        ))}
      </div>
    </div>
  );
}

function QuestionsTab({ questions, inkHex, progressHex, accentHex }: {
  questions: { q: string; a: string }[];
  inkHex: string;
  progressHex: string;
  accentHex: string;
}) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const allRevealed = revealed.size === questions.length && questions.length > 0;

  function toggle(i: number) {
    setRevealed(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  if (questions.length === 0) {
    return <p className="text-sm text-gray-500 text-center py-8">Inga frågor finns för det här kapitlet.</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-black text-gray-500 uppercase tracking-wide">
          Tryck på frågan för att visa svaret
        </p>
        <button
          onClick={allRevealed ? () => setRevealed(new Set()) : () => setRevealed(new Set(questions.map((_, i) => i)))}
          className="flex items-center gap-1 text-xs font-black cursor-pointer"
          style={{ color: progressHex }}
        >
          {allRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
          {allRevealed ? 'Dölj alla' : 'Visa alla'}
        </button>
      </div>
      <div className="space-y-2">
        {questions.map((item, i) => {
          const open = revealed.has(i);
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              className="w-full text-left clay-card p-4 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              style={open ? { borderColor: progressHex } : {}}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                      style={{ background: accentHex }}
                    >
                      {i + 1}
                    </span>
                    <p className="font-semibold text-gray-800 text-sm leading-snug">{item.q}</p>
                  </div>
                  {open && (
                    <p className="text-sm text-gray-600 mt-2 ml-7 leading-relaxed border-l-2 pl-3" style={{ borderColor: progressHex }}>
                      {item.a}
                    </p>
                  )}
                </div>
                <span className="flex-shrink-0 mt-0.5" style={{ color: progressHex }}>
                  {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

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
    'flashcards':  '🃏 Flashcards',
    'concepts':    '📘 Begrepp',
    'key-points':  '📋 Sammanfattning',
    'cause-effect':'⚡ Orsak & konsekvens',
    'word-search': '🔍 Ordsökning',
    'test':        '✏️ Test',
    'questions':   '❓ Frågor',
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
          <KeyPointsTab
            keyPoints={summary.keyPoints}
            accentHex={s.accentHex}
            progressHex={s.progressHex}
            textClass={s.textClass}
          />
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

        {/* --- FLASHCARDS --- */}
        {activeTab === 'flashcards' && (
          <FlashcardsTab
            concepts={summary.concepts}
            inkHex={s.inkHex}
            progressHex={s.progressHex}
            accentHex={s.accentHex}
          />
        )}

        {/* --- QUESTIONS --- */}
        {activeTab === 'questions' && (
          <QuestionsTab questions={summary.questions ?? []} inkHex={s.inkHex} progressHex={s.progressHex} accentHex={s.accentHex} />
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
