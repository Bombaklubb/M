import React from 'react';
import { useApp } from '../contexts/AppContext';
import { WORLDS, gradeToWorld, getAccessibleWorlds } from '../data/worlds';
import { gradeToNum } from '../data/topics';
import { getPoints, initPoints, getProgress } from '../utils/storage';
import { LEVEL_NAMES, LEVEL_THRESHOLDS } from '../types';

export default function WorldSelect() {
  const { currentStudent, setView, logout } = useApp();
  if (!currentStudent) return null;

  const points   = getPoints(currentStudent.id) ?? initPoints(currentStudent.id);
  const progress = getProgress(currentStudent.id);
  const gradeNum = gradeToNum(currentStudent.grade);
  const currentWorldId = gradeToWorld(currentStudent.grade);

  const level          = points.level;
  const levelName      = LEVEL_NAMES[level] ?? 'Nybörjare';
  const nextThreshold  = LEVEL_THRESHOLDS[level + 1] ?? LEVEL_THRESHOLDS[level] ?? points.total;
  const pointsToNext   = Math.max(0, nextThreshold - points.total);

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#080820 0%,#0f1035 45%,#141450 100%)' }}>

      {/* Stars */}
      {Array.from({ length: 60 }, (_, i) => (
        <div key={i} className="fixed rounded-full bg-white pointer-events-none"
          style={{
            width:  `${1 + (i * 3 % 2)}px`,
            height: `${1 + (i * 3 % 2)}px`,
            top:    `${(i * 41 + 7) % 100}%`,
            left:   `${(i * 67 + 13) % 100}%`,
            opacity: 0.2 + (i % 7) * 0.08,
          }} />
      ))}

      {/* ── Toppen ─────────────────────────────────────────────────── */}
      <div className="relative pt-12 pb-2 text-center">
        <h1 className="text-3xl font-black text-white tracking-tight">Mattejakten</h1>
        <p className="text-white/50 text-sm mt-0.5">Upptäck matematikens världar</p>
      </div>

      {/* ── Stats-rad ──────────────────────────────────────────────── */}
      <div className="mx-4 mt-4 mb-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm
        flex items-center justify-around py-3 px-2">
        <StatChip icon="🔥" top={`${points.streak}`} bottom="Dagars Streak" />
        <div className="w-px h-8 bg-white/10" />
        <StatChip icon="⭐" top={points.total.toLocaleString('sv-SE')} bottom="Poäng" />
        <div className="w-px h-8 bg-white/10" />
        <StatChip icon="📊" top={`Nivå ${level}`} bottom={levelName} />
        <div className="w-px h-8 bg-white/10" />
        <StatChip icon="🎯" top={`${pointsToNext}p`} bottom="Nästa Mål" />
      </div>

      {/* ── Välj din värld ─────────────────────────────────────────── */}
      <p className="text-center text-white/50 text-xs font-bold uppercase tracking-widest mb-4">
        ✦ Välj din värld
      </p>

      {/* ── Världskort 2×2 ─────────────────────────────────────────── */}
      <div className="mx-4 grid grid-cols-2 gap-4">
        {WORLDS.map(world => {
          const isCurrent      = world.id === currentWorldId;
          const worldProgress  = progress.filter(p => world.topicIds.includes(p.topicId));
          const completed      = worldProgress.filter(p => p.completed).length;
          const total          = world.topicIds.length;
          const pct            = total > 0 ? (completed / total) * 100 : 0;

          return (
            <button
              key={world.id}
              onClick={() => setView(`world-${world.id}` as any)}
              className={`text-left rounded-3xl overflow-hidden transition-all
                hover:scale-[1.03] active:scale-[0.97] shadow-xl
                ${isCurrent
                  ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-transparent'
                  : ''}`}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <div className="p-4 relative">
                {/* DIN VÄRLD-badge */}
                {isCurrent && (
                  <span className="absolute top-3 right-3 bg-amber-400 text-amber-900
                    text-[10px] font-black px-2 py-0.5 rounded-full leading-tight">
                    DIN VÄRLD ✦
                  </span>
                )}

                {/* Cirkulär världsikon */}
                <div className={`w-20 h-20 mx-auto mb-3 rounded-full
                  bg-gradient-to-br ${world.bg}
                  flex items-center justify-center text-5xl shadow-lg`}>
                  {world.emoji}
                </div>

                {/* Namn & grade */}
                <h3 className="text-white font-black text-base leading-snug text-center">
                  {world.name}
                </h3>
                <p className="text-white/55 text-xs text-center mb-3">{world.subtitle}</p>

                {/* Progress */}
                <div className="flex justify-between text-white/50 text-xs mb-1">
                  <span>{completed}/{total} klara</span>
                  <span>{Math.round(pct)}%</span>
                </div>
                <div className="h-1.5 bg-white/15 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${world.bg} transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Bottom navigation ──────────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 h-16
        bg-black/60 backdrop-blur-md border-t border-white/10
        flex items-center justify-around px-4 z-50">
        <NavBtn icon="🏠" label="Hem"      onClick={() => setView('dashboard')} active />
        <NavBtn icon="📊" label="Resultat" onClick={() => setView('my-results')} />
        <NavBtn icon="🏅" label="Samling"  onClick={() => setView('collection')} />
        <NavBtn icon="👤" label="Min sida" onClick={() => setView('my-page')} />
      </nav>
    </div>
  );
}

function StatChip({ icon, top, bottom }: { icon: string; top: string; bottom: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-1">
      <div className="flex items-center gap-1">
        <span className="text-base leading-none">{icon}</span>
        <span className="text-white font-black text-sm leading-none">{top}</span>
      </div>
      <span className="text-white/45 text-[10px] leading-none">{bottom}</span>
    </div>
  );
}

function NavBtn({ icon, label, onClick, active }: {
  icon: string; label: string; onClick: () => void; active?: boolean;
}) {
  return (
    <button onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors
        ${active ? 'text-white' : 'text-white/40 hover:text-white/70'}`}>
      <span className="text-xl leading-none">{icon}</span>
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );
}
