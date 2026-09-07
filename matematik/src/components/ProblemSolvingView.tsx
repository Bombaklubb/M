import React, { useState } from 'react';
import AppHeader from './AppHeader';
import { useApp } from '../contexts/AppContext';
import { WORLDS, WorldId } from '../data/worlds';
import { addPoints } from '../utils/storage';
import { rollPointsBonus } from '../utils/pointsBonus';
import { Confetti } from './magicui/confetti';
import ProblemFigure from './ProblemFigure';
import {
  getProblemsForWorld, LEVEL_META, checkSubTaskAnswer, collectGoal, subTaskCount,
  type RichProblem, type ProblemLevel, type SubTask,
} from '../data/problemSolving';
import {
  loadProblemProgress, subKey, isSubDone, getFound, isHintUsed,
  markHintUsed, addFound, markSubDone, problemDoneCount, isLevelDone,
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
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, 'ok' | 'no' | null>>({});
  const [celebrate, setCelebrate] = useState(0);
  const [, force] = useState(0);

  if (!currentStudent) return null;
  const sid = currentStudent.id;

  const world = worldId ? WORLDS.find(w => w.id === worldId) ?? null : null;
  const backView = worldId ? (`world-${worldId}` as any) : 'dashboard';
  const problems = worldId ? getProblemsForWorld(worldId) : [];
  const progress = loadProblemProgress(sid);

  const active: RichProblem | null = activeId ? problems.find(p => p.id === activeId) ?? null : null;
  const refresh = () => force(v => v + 1);

  function openProblem(p: RichProblem) {
    setActiveId(p.id);
    const next = LEVELS.find(l => {
      const lt = p.levels.find(x => x.level === l);
      return lt && !isLevelDone(progress, p.id, l, lt.subTasks.map(s => s.id));
    }) ?? 'E';
    setLevel(next);
    setInputs({});
    setFeedback({});
  }

  /** Ger poäng när en deluppgift blir klar. */
  function awardPoints(key: string, lvl: ProblemLevel, subCount: number) {
    const base = Math.max(5, Math.round(LEVEL_META[lvl].points / subCount));
    const amount = isHintUsed(progress, key) ? Math.max(3, Math.round(base / 2)) : base;
    const bonus = rollPointsBonus();
    addPoints(sid, amount * bonus);
    setCelebrate(c => c + 1);
  }

  function submitOpen(st: SubTask, key: string, subCount: number) {
    const val = inputs[key] ?? '';
    if (!val.trim()) return;
    const ok = checkSubTaskAnswer(st, val);
    setFeedback(f => ({ ...f, [key]: ok ? 'ok' : 'no' }));
    if (ok && !isSubDone(progress, key)) {
      if (markSubDone(sid, key)) awardPoints(key, level, subCount);
      refresh();
    }
  }

  function submitCollect(st: SubTask, key: string, subCount: number) {
    const val = (inputs[key] ?? '').trim();
    if (!val) return;
    const already = getFound(progress, key);
    const ok = checkSubTaskAnswer(st, val);
    const isNew = ok && !already.some(a => a.toLowerCase() === val.toLowerCase());
    setFeedback(f => ({ ...f, [key]: ok ? 'ok' : 'no' }));
    if (isNew) {
      const after = addFound(sid, key, val);
      setInputs(i => ({ ...i, [key]: '' }));
      if (getFound(after, key).length >= collectGoal(st) && !isSubDone(after, key)) {
        if (markSubDone(sid, key)) awardPoints(key, level, subCount);
      }
    }
    refresh();
  }

  function submitReflect(key: string, subCount: number) {
    const val = (inputs[key] ?? '').trim();
    if (val.length < 15) {
      setFeedback(f => ({ ...f, [key]: 'no' }));
      return;
    }
    setFeedback(f => ({ ...f, [key]: 'ok' }));
    if (markSubDone(sid, key)) awardPoints(key, level, subCount);
    refresh();
  }

  // ══ PROBLEMVY ═══════════════════════════════════════════════════════════════
  if (active) {
    const lt = active.levels.find(l => l.level === level)!;
    const meta = LEVEL_META[level];
    const subCount = lt.subTasks.length;

    return (
      <div className="min-h-screen" style={BG}>
        <AppHeader />
        {celebrate > 0 && <Confetti key={celebrate} active duration={1800} />}

        <div className="pt-16 pb-5 px-4 text-white" style={{ background: 'linear-gradient(135deg,#4c1d95 0%,#6d28d9 55%,#8b5cf6 100%)' }}>
          <div className="max-w-2xl mx-auto">
            <button onClick={() => setActiveId(null)}
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

        <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
          {/* Problemsituationen – texten eleven läser först */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(139,92,246,0.30)' }}>
            <p className="text-[11px] font-black uppercase tracking-wide text-violet-500 mb-2">Problemet</p>
            <p className="text-gray-800 leading-relaxed whitespace-pre-line">{active.context}</p>
            {/* Nivåns egen figur går före problemets standardfigur. */}
            <ProblemFigure name={lt.figure ?? active.figure} />
          </div>

          {/* Nivåväljare */}
          <div>
            <p className="text-white/80 text-[11px] font-black uppercase tracking-wide mb-2">
              Samma problem – tre nivåer att utforska
            </p>
            <div className="grid grid-cols-3 gap-2">
              {LEVELS.map(l => {
                const m = LEVEL_META[l];
                const levelTask = active.levels.find(x => x.level === l);
                const done = levelTask ? isLevelDone(progress, active.id, l, levelTask.subTasks.map(s => s.id)) : false;
                const on = l === level;
                return (
                  <button key={l} onClick={() => { setLevel(l); setFeedback({}); }}
                    className="rounded-2xl py-2.5 px-2 transition-all cursor-pointer active:scale-95"
                    style={{
                      background: on ? m.color : 'rgba(255,255,255,0.92)',
                      border: `2px solid ${m.color}`,
                      color: on ? '#fff' : m.color,
                    }}>
                    <span className="block font-black text-lg leading-none">{m.label}{done ? ' ✓' : ''}</span>
                    <span className={`block text-[10px] font-bold ${on ? 'text-white/85' : 'text-gray-500'}`}>{m.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nivåns intro */}
          <div className="rounded-2xl px-4 py-3" style={{ background: `${meta.color}22`, border: `1px solid ${meta.color}66` }}>
            <p className="font-bold text-sm" style={{ color: meta.color }}>
              Nivå {meta.label} · {lt.intro}
            </p>
          </div>

          {/* Deluppgifterna */}
          {lt.subTasks.map((st, idx) => {
            const key = subKey(active.id, level, st.id);
            const done = isSubDone(progress, key);
            const hinted = isHintUsed(progress, key);
            const found = getFound(progress, key);
            const goal = collectGoal(st);
            const fb = feedback[key];

            return (
              <div key={st.id} className="rounded-3xl p-5"
                style={{
                  background: 'rgba(255,255,255,0.96)',
                  border: done ? '2px solid #10b981' : '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 4px 18px rgba(76,29,149,0.12)',
                }}>
                <div className="flex items-start gap-3 mb-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-black text-sm text-white"
                    style={{ background: done ? '#10b981' : meta.color }}>
                    {done ? '✓' : idx + 1}
                  </span>
                  <p className="font-bold text-gray-800 leading-snug flex-1">{st.prompt}</p>
                </div>

                {/* ── ÖPPEN FRÅGA ── */}
                {st.kind === 'open' && (
                  <div className="pl-10">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputs[key] ?? ''}
                        onChange={e => setInputs(i => ({ ...i, [key]: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && submitOpen(st, key, subCount)}
                        placeholder={st.placeholder ?? 'Ditt svar…'}
                        className="flex-1 border-2 border-gray-200 rounded-2xl px-4 py-2.5 font-bold focus:outline-none focus:border-violet-400"
                      />
                      <button onClick={() => submitOpen(st, key, subCount)}
                        className="px-4 rounded-2xl font-black text-white transition-all active:scale-95 cursor-pointer"
                        style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
                        Kolla
                      </button>
                    </div>
                    {fb === 'ok' && <p className="text-emerald-600 font-bold text-sm mt-2">✓ Ja, det fungerar!</p>}
                    {fb === 'no' && <p className="text-rose-600 font-bold text-sm mt-2">✗ Det stämmer inte – läs villkoren igen och prova en gång till.</p>}
                  </div>
                )}

                {/* ── HITTA ALLA ── */}
                {st.kind === 'collect' && (
                  <div className="pl-10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (found.length / goal) * 100)}%`, background: meta.color }} />
                      </div>
                      <span className="text-xs font-black" style={{ color: meta.color }}>
                        {found.length} / {goal}
                      </span>
                    </div>

                    {found.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {found.map(f => (
                          <span key={f} className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {f}
                          </span>
                        ))}
                      </div>
                    )}

                    {!done && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={inputs[key] ?? ''}
                          onChange={e => setInputs(i => ({ ...i, [key]: e.target.value }))}
                          onKeyDown={e => e.key === 'Enter' && submitCollect(st, key, subCount)}
                          placeholder={st.placeholder ?? 'Lägg till ett svar…'}
                          className="flex-1 border-2 border-gray-200 rounded-2xl px-4 py-2.5 font-bold focus:outline-none focus:border-violet-400"
                        />
                        <button onClick={() => submitCollect(st, key, subCount)}
                          className="px-4 rounded-2xl font-black text-white transition-all active:scale-95 cursor-pointer"
                          style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
                          Lägg till
                        </button>
                      </div>
                    )}
                    {fb === 'ok' && !done && <p className="text-emerald-600 font-bold text-sm mt-2">✓ Rätt! Leta vidare.</p>}
                    {fb === 'no' && <p className="text-rose-600 font-bold text-sm mt-2">✗ Det svaret passar inte (eller har du redan hittat det?).</p>}
                    {done && <p className="text-emerald-600 font-black text-sm mt-2">🎉 Du hittade alla!</p>}
                  </div>
                )}

                {/* ── RESONERA ── */}
                {st.kind === 'reflect' && (
                  <div className="pl-10">
                    <textarea
                      value={inputs[key] ?? ''}
                      onChange={e => setInputs(i => ({ ...i, [key]: e.target.value }))}
                      placeholder={st.placeholder ?? 'Skriv ditt resonemang…'}
                      rows={4}
                      className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-violet-400 resize-y"
                    />
                    {!done && (
                      <button onClick={() => submitReflect(key, subCount)}
                        className="mt-2 px-5 py-2.5 rounded-2xl font-black text-white transition-all active:scale-95 cursor-pointer"
                        style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
                        Klar – visa hur man kan tänka
                      </button>
                    )}
                    {fb === 'no' && !done && (
                      <p className="text-rose-600 font-bold text-sm mt-2">
                        Skriv lite mer utförligt – förklara HUR du tänker.
                      </p>
                    )}
                  </div>
                )}

                {/* Ledtråd */}
                {st.hint && !done && (
                  <div className="pl-10 mt-3">
                    {!hinted ? (
                      <button onClick={() => { markHintUsed(sid, key); refresh(); }}
                        className="text-sm font-bold text-violet-600 hover:text-violet-800 cursor-pointer">
                        💡 Visa ledtråd
                      </button>
                    ) : (
                      <div className="rounded-2xl p-3 bg-amber-50 border border-amber-200">
                        <p className="text-amber-800 text-sm"><b>💡 Ledtråd:</b> {st.hint}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Diskussion – visas när deluppgiften är klar */}
                {done && (
                  <div className="pl-10 mt-3">
                    <div className="rounded-2xl p-4 bg-violet-50 border border-violet-200">
                      <p className="text-[11px] font-black uppercase tracking-wide text-violet-500 mb-1">
                        {st.kind === 'reflect' ? 'Så här kan man tänka' : 'Lösning & resonemang'}
                      </p>
                      <p className="text-violet-900 text-sm leading-relaxed whitespace-pre-line">{st.discussion}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Nivå klar → nästa nivå */}
          {isLevelDone(progress, active.id, level, lt.subTasks.map(s => s.id)) && (
            <div className="rounded-2xl p-4 text-center" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.45)' }}>
              <p className="font-black text-emerald-300 mb-3">🎉 Nivå {meta.label} klar!</p>
              <div className="flex gap-2 justify-center">
                {level !== 'A' && (
                  <button onClick={() => { setLevel(level === 'E' ? 'C' : 'A'); setFeedback({}); }}
                    className="px-5 py-3 rounded-2xl font-black text-white transition-all active:scale-95 cursor-pointer"
                    style={{ background: `linear-gradient(135deg,${LEVEL_META[level === 'E' ? 'C' : 'A'].color},#6d28d9)` }}>
                    Fortsätt till nivå {level === 'E' ? 'C' : 'A'} →
                  </button>
                )}
                <button onClick={() => setActiveId(null)}
                  className="px-5 py-3 rounded-2xl font-bold text-white transition-all active:scale-95 cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.20)', border: '1px solid rgba(255,255,255,0.35)' }}>
                  Alla problem
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ══ LISTVY ══════════════════════════════════════════════════════════════════
  const totalSubs = problems.reduce((s, p) => s + subTaskCount(p), 0);
  const doneSubs = problems.reduce((s, p) => s + problemDoneCount(progress, p.id), 0);

  return (
    <div className="min-h-screen" style={BG}>
      <AppHeader />

      <div className="pt-16 pb-6 px-4 text-white" style={{ background: 'linear-gradient(135deg,#4c1d95 0%,#6d28d9 55%,#8b5cf6 100%)' }}>
        <div className="max-w-2xl mx-auto">
          <button onClick={() => setView(backView)}
            className="text-white/70 hover:text-white text-sm mb-3 block cursor-pointer">
            ← {world ? world.name : 'Tillbaka'}
          </button>
          <h1 className="text-2xl font-black">🧩 Problemlösning</h1>
          <p className="text-white/80 mt-1 text-sm">
            Rika problem att utforska. Läs, prova, hitta alla lösningar och förklara hur du tänker.
          </p>
          <div className="mt-3 rounded-2xl px-4 py-2 inline-block" style={{ background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.28)' }}>
            <span className="font-black">{doneSubs}</span>
            <span className="text-white/75 text-sm"> / {totalSubs} deluppgifter klara</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5">
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
              const total = subTaskCount(p);
              const done = problemDoneCount(progress, p.id);
              const allDone = done >= total;
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
                          const levelTask = p.levels.find(x => x.level === l);
                          const s = levelTask ? isLevelDone(progress, p.id, l, levelTask.subTasks.map(x => x.id)) : false;
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
                        <span className="text-[10px] text-gray-400 ml-1 truncate">
                          {done}/{total} · {p.tags.join(' · ')}
                        </span>
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
