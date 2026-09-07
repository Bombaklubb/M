import React, { useState } from 'react';
import AppHeader from './AppHeader';
import { useApp } from '../contexts/AppContext';
import { WORLDS, WorldId } from '../data/worlds';
import { getCorrectFeedback } from '../utils/feedback';
import { addPoints } from '../utils/storage';
import { rollPointsBonus } from '../utils/pointsBonus';
import { Confetti } from './magicui/confetti';
import {
  getProblemsForWorld, LEVEL_META, isAnswerCorrect,
  type RichProblem, type ProblemLevel,
} from '../data/problemSolving';
import {
  loadProblemProgress, isSolved, isHintUsed, markHintUsed, markSolved, solvedCount,
} from '../utils/problemStorage';

const BG: React.CSSProperties = {
  backgroundImage: "url('/Matematisk bakgrund med glödande symboler.png')",
  backgroundSize: 'cover', backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed',
};

const LEVELS: ProblemLevel[] = ['E', 'C', 'A'];

export default function ProblemSolvingView({ worldId }: { worldId?: WorldId }) {
  const { currentStudent, setView } = useApp();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [level, setLevel] = useState<ProblemLevel>('E');
  const [input, setInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<null | { correct: boolean; points: number; bonus: number }>(null);
  const [celebrate, setCelebrate] = useState(0);
  const [version, setVersion] = useState(0);

  if (!currentStudent) return null;
  const sid = currentStudent.id;

  const world = worldId ? WORLDS.find(w => w.id === worldId) ?? null : null;
  const backView = worldId ? (`world-${worldId}` as any) : 'dashboard';
  const problems = worldId ? getProblemsForWorld(worldId) : [];
  const progress = loadProblemProgress(sid);
  void version; // tvingar omläsning efter sparade svar

  const active: RichProblem | null = activeId ? problems.find(p => p.id === activeId) ?? null : null;

  function openProblem(p: RichProblem) {
    setActiveId(p.id);
    // Börja på den lägsta nivån som inte är klarad.
    const next = LEVELS.find(l => !isSolved(progress, p.id, l)) ?? 'E';
    setLevel(next);
    resetTask();
  }

  function resetTask() {
    setInput('');
    setShowHint(false);
    setResult(null);
  }

  function switchLevel(l: ProblemLevel) {
    setLevel(l);
    resetTask();
  }

  function submit() {
    if (!active || result) return;
    const task = active.tasks.find(t => t.level === level);
    if (!task || !input.trim()) return;

    const correct = isAnswerCorrect(task, input);
    if (correct) {
      const alreadySolved = isSolved(progress, active.id, level);
      const isNew = markSolved(sid, active.id, level);
      let earned = 0;
      let bonus = 1;
      if (isNew && !alreadySolved) {
        // Ledtråd halverar poängen. Slumpbonusen (x2/x3) kan slå till.
        const base = isHintUsed(progress, active.id, level)
          ? Math.round(LEVEL_META[level].points / 2)
          : LEVEL_META[level].points;
        bonus = rollPointsBonus();
        earned = base * bonus;
        addPoints(sid, earned);
      }
      setResult({ correct: true, points: earned, bonus });
      setCelebrate(c => c + 1);
    } else {
      setResult({ correct: false, points: 0, bonus: 1 });
    }
    setVersion(v => v + 1);
  }

  function useHint() {
    if (!active) return;
    markHintUsed(sid, active.id, level);
    setShowHint(true);
    setVersion(v => v + 1);
  }

  // ══ PROBLEMVY ═══════════════════════════════════════════════════════════════
  if (active) {
    const task = active.tasks.find(t => t.level === level)!;
    const meta = LEVEL_META[level];
    const solvedNow = isSolved(progress, active.id, level);
    const hintUsed = isHintUsed(progress, active.id, level);

    return (
      <div className="min-h-screen" style={BG}>
        <AppHeader />
        {celebrate > 0 && result?.correct && <Confetti key={celebrate} active duration={2200} />}

        <div className="pt-16 pb-5 px-4 text-white" style={{ background: 'linear-gradient(135deg,#4c1d95 0%,#6d28d9 55%,#8b5cf6 100%)' }}>
          <div className="max-w-lg mx-auto">
            <button onClick={() => { setActiveId(null); resetTask(); }}
              className="text-white/70 hover:text-white text-sm mb-3 cursor-pointer">
              ← Alla problem
            </button>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{active.emoji}</span>
              <div className="min-w-0">
                <h1 className="text-xl font-black leading-tight">{active.title}</h1>
                <p className="text-white/70 text-xs">{active.tags.join(' · ')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 py-5 space-y-4">
          {/* Gemensam problemsituation */}
          <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(139,92,246,0.30)' }}>
            <p className="text-[11px] font-black uppercase tracking-wide text-violet-500 mb-1">Situationen</p>
            <p className="text-gray-700 text-sm leading-relaxed">{active.context}</p>
          </div>

          {/* Nivåväljare */}
          <div>
            <p className="text-white/80 text-[11px] font-black uppercase tracking-wide mb-2">
              Välj svårighetsnivå – samma problem, olika djup
            </p>
            <div className="grid grid-cols-3 gap-2">
              {LEVELS.map(l => {
                const m = LEVEL_META[l];
                const done = isSolved(progress, active.id, l);
                const on = l === level;
                return (
                  <button key={l} onClick={() => switchLevel(l)}
                    className="rounded-2xl py-2.5 px-2 transition-all cursor-pointer active:scale-95"
                    style={{
                      background: on ? m.color : 'rgba(255,255,255,0.90)',
                      border: `2px solid ${m.color}`,
                      color: on ? '#fff' : m.color,
                    }}>
                    <span className="block font-black text-lg leading-none">
                      {m.label}{done ? ' ✓' : ''}
                    </span>
                    <span className={`block text-[10px] font-bold ${on ? 'text-white/85' : 'text-gray-500'}`}>
                      {m.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Uppgiften */}
          <div className="rounded-3xl p-5" style={{ background: 'rgba(255,255,255,0.96)', boxShadow: '0 6px 24px rgba(76,29,149,0.18)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-black uppercase tracking-wide px-2.5 py-1 rounded-full text-white" style={{ background: meta.color }}>
                Nivå {meta.label} · {meta.desc}
              </span>
              <span className="text-xs font-bold text-gray-400">
                {hintUsed ? `⭐ ${Math.round(meta.points / 2)} p` : `⭐ ${meta.points} p`}
              </span>
            </div>

            <p className="text-lg font-black text-gray-800 leading-snug mb-4">{task.question}</p>

            {solvedNow && !result && (
              <div className="rounded-2xl p-3 mb-3 bg-emerald-50 border border-emerald-200">
                <p className="text-emerald-700 font-bold text-sm">✓ Du har redan klarat den här nivån</p>
                <p className="text-emerald-600 text-xs mt-0.5">Du kan öva igen, men poängen ges bara första gången.</p>
              </div>
            )}

            {!result && (
              <>
                <div className="flex gap-2">
                  <input
                    type="text" value={input} autoFocus
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && input.trim() && submit()}
                    placeholder="Skriv ditt svar…"
                    className="flex-1 border-2 border-gray-200 rounded-2xl px-4 py-3 text-lg font-bold focus:outline-none focus:border-violet-400"
                  />
                  <button onClick={submit} disabled={!input.trim()}
                    className="px-5 rounded-2xl font-black text-white transition-all active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
                    Svara
                  </button>
                </div>

                {!showHint && !hintUsed ? (
                  <button onClick={useHint}
                    className="mt-3 text-sm font-bold text-violet-600 hover:text-violet-800 cursor-pointer">
                    💡 Visa ledtråd (halverar poängen)
                  </button>
                ) : (
                  <div className="mt-3 rounded-2xl p-3 bg-amber-50 border border-amber-200">
                    <p className="text-amber-800 text-sm"><b>💡 Ledtråd:</b> {task.hint}</p>
                  </div>
                )}
              </>
            )}

            {/* Facit + lösning */}
            {result && (
              <div className="space-y-3">
                <div className={`rounded-2xl p-4 ${result.correct ? 'bg-emerald-50 border border-emerald-200' : 'bg-rose-50 border border-rose-200'}`}>
                  <p className={`font-black text-lg ${result.correct ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {result.correct
                      ? `${getCorrectFeedback()}${result.points > 0 ? ` +${result.points} poäng!` : ''}`
                      : '❌ Inte riktigt'}
                  </p>
                  {!result.correct && (
                    <p className="text-rose-600 text-sm mt-1">Rätt svar: <b>{task.answer}</b></p>
                  )}
                  {result.correct && result.bonus > 1 && (
                    <p className="mt-2 inline-block text-white font-black text-sm rounded-full px-3 py-1"
                      style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}>
                      🎲 TUR! ×{result.bonus} poäng!
                    </p>
                  )}
                </div>

                <div className="rounded-2xl p-4 bg-violet-50 border border-violet-200">
                  <p className="text-[11px] font-black uppercase tracking-wide text-violet-500 mb-1">Lösning</p>
                  <p className="text-violet-900 text-sm leading-relaxed whitespace-pre-line">{task.solution}</p>
                </div>

                <div className="flex gap-2">
                  {!result.correct && (
                    <button onClick={resetTask}
                      className="flex-1 py-3 rounded-2xl font-black text-white transition-all active:scale-95 cursor-pointer"
                      style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
                      Försök igen
                    </button>
                  )}
                  {result.correct && level !== 'A' && (
                    <button onClick={() => switchLevel(level === 'E' ? 'C' : 'A')}
                      className="flex-1 py-3 rounded-2xl font-black text-white transition-all active:scale-95 cursor-pointer"
                      style={{ background: `linear-gradient(135deg,${LEVEL_META[level === 'E' ? 'C' : 'A'].color},#6d28d9)` }}>
                      Nästa nivå: {level === 'E' ? 'C' : 'A'} →
                    </button>
                  )}
                  <button onClick={() => { setActiveId(null); resetTask(); }}
                    className="flex-1 py-3 rounded-2xl font-bold text-violet-700 bg-violet-100 border border-violet-200 transition-all active:scale-95 cursor-pointer">
                    Alla problem
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Kopplade ämnen */}
          <p className="text-white/60 text-xs text-center">
            Tränar: {active.topicIds.length} ämne{active.topicIds.length > 1 ? 'n' : ''} i {world?.name ?? 'appen'}
          </p>
        </div>
      </div>
    );
  }

  // ══ LISTVY ══════════════════════════════════════════════════════════════════
  const totalTasks = problems.length * 3;
  const doneTasks = problems.reduce((s, p) => s + solvedCount(progress, p.id), 0);

  return (
    <div className="min-h-screen" style={BG}>
      <AppHeader />

      <div className="pt-16 pb-6 px-4 text-white" style={{ background: 'linear-gradient(135deg,#4c1d95 0%,#6d28d9 55%,#8b5cf6 100%)' }}>
        <div className="max-w-lg mx-auto">
          <button onClick={() => setView(backView)}
            className="text-white/70 hover:text-white text-sm mb-3 block cursor-pointer">
            ← {world ? world.name : 'Tillbaka'}
          </button>
          <h1 className="text-2xl font-black">🧩 Problemlösning</h1>
          <p className="text-white/80 mt-1 text-sm">
            Rika matematiska problem – varje problem går att lösa på nivå E, C och A.
          </p>
          <div className="mt-3 rounded-2xl px-4 py-2 inline-block" style={{ background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.28)' }}>
            <span className="font-black">{doneTasks}</span>
            <span className="text-white/75 text-sm"> / {totalTasks} uppgifter klara</span>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5">
        {problems.length === 0 ? (
          <div className="bg-white/90 rounded-2xl p-8 text-center shadow-sm">
            <div className="text-5xl mb-3">🧩</div>
            <p className="font-bold text-gray-700 text-lg">Inga problem här ännu</p>
            <button onClick={() => setView(backView)}
              className="mt-4 bg-violet-600 text-white font-bold py-2 px-6 rounded-xl hover:bg-violet-500 transition-colors cursor-pointer">
              ← Tillbaka
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {problems.map(p => {
              const done = solvedCount(progress, p.id);
              const allDone = done === 3;
              return (
                <button key={p.id} onClick={() => openProblem(p)}
                  className="w-full text-left rounded-2xl p-4 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  style={{
                    background: 'rgba(255,255,255,0.94)',
                    border: allDone ? '2px solid #10b981' : '1px solid rgba(139,92,246,0.30)',
                    boxShadow: '0 4px 16px rgba(76,29,149,0.12)',
                  }}>
                  <div className="flex items-start gap-3">
                    <span className="text-3xl flex-shrink-0">{p.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-gray-800 truncate">{p.title}</h3>
                        {allDone && <span className="text-emerald-600 font-black text-sm">✓</span>}
                      </div>
                      <p className="text-gray-500 text-xs line-clamp-2 mt-0.5">{p.context}</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        {LEVELS.map(l => {
                          const m = LEVEL_META[l];
                          const s = isSolved(progress, p.id, l);
                          return (
                            <span key={l}
                              className="text-[11px] font-black rounded-full w-6 h-6 flex items-center justify-center"
                              style={{
                                background: s ? m.color : 'rgba(0,0,0,0.06)',
                                color: s ? '#fff' : 'rgba(0,0,0,0.35)',
                                border: `1.5px solid ${s ? m.color : 'rgba(0,0,0,0.12)'}`,
                              }}
                              title={`Nivå ${m.label} – ${m.desc}${s ? ' (klar)' : ''}`}>
                              {m.label}
                            </span>
                          );
                        })}
                        <span className="text-[10px] text-gray-400 ml-1 truncate">{p.tags.join(' · ')}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
