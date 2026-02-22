import React from 'react';
import { useApp } from '../contexts/AppContext';
import { WORLDS, gradeToWorld, getAccessibleWorlds } from '../data/worlds';
import { gradeToNum } from '../data/topics';
import { getPoints, initPoints, getProgress } from '../utils/storage';
import { LEVEL_NAMES, LEVEL_THRESHOLDS } from '../types';
import AppHeader from './AppHeader';
import { ALL_AVATARS } from '../data/avatars';

export default function WorldSelect() {
  const { currentStudent, setView, logout } = useApp();
  if (!currentStudent) return null;

  const points = getPoints(currentStudent.id) ?? initPoints(currentStudent.id);
  const progress = getProgress(currentStudent.id);
  const gradeNum = gradeToNum(currentStudent.grade);
  const currentWorldId = gradeToWorld(currentStudent.grade);
  const accessibleWorlds = getAccessibleWorlds(gradeNum);

  const levelName = LEVEL_NAMES[points.level];
  const nextLevelPts = LEVEL_THRESHOLDS[points.level + 1] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const curLevelPts = LEVEL_THRESHOLDS[points.level] ?? 0;
  const levelPct = nextLevelPts > curLevelPts
    ? ((points.total - curLevelPts) / (nextLevelPts - curLevelPts)) * 100
    : 100;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg,#0f2027,#203a43,#2c5364)' }}>
      <AppHeader />

      {/* Stars */}
      {Array.from({ length: 24 }, (_, i) => (
        <div key={i} className="fixed rounded-full bg-white pointer-events-none"
          style={{
            width: `${1 + Math.random() * 2}px`, height: `${1 + Math.random() * 2}px`,
            top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
            opacity: 0.3 + Math.random() * 0.4,
          }} />
      ))}

      {/* Main content – push down past fixed header */}
      <div className="relative pt-14">
        {/* Player header */}
        <div className="max-w-4xl mx-auto px-6 pt-6 pb-4">

          {/* Avatar + info + quick stats */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="text-5xl">{ALL_AVATARS[currentStudent.avatar] ?? ALL_AVATARS[0]}</div>
              <div>
                <p className="font-black text-white text-xl leading-tight">{currentStudent.name}</p>
                <p className="text-blue-200 text-sm">Nivå {points.level}: {levelName}</p>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setView('quick-drill')}
                className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                ⚡ Snabbträning
              </button>
              <button onClick={() => setView('quest')}
                className="bg-purple-500 hover:bg-purple-400 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                ⚔️ Äventyr
              </button>
              <button onClick={() => setView('error-bank')}
                className="bg-red-500/80 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                💡 Försök igen
              </button>
            </div>
          </div>

          {/* Level bar */}
          <div className="bg-white/10 rounded-2xl px-5 py-3 mb-4">
            <div className="flex justify-between text-xs text-white/70 mb-2">
              <span>⭐ {points.total} poäng</span>
              <span>🔥 {points.streak} dagars streak</span>
              <span>Nästa nivå: {nextLevelPts}p</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full transition-all"
                style={{ width: `${Math.min(100, levelPct)}%` }} />
            </div>
          </div>

          {/* Nav pills */}
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setView('my-page')}
              className="bg-white/20 hover:bg-white/30 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
              👤 Min sida
            </button>
            <button onClick={logout}
              className="bg-white/10 hover:bg-white/20 text-white/60 text-sm font-bold px-4 py-2 rounded-xl transition-colors">
              Logga ut
            </button>
          </div>
        </div>

        {/* Worlds grid */}
        <div className="max-w-4xl mx-auto px-6 pb-12">
          <h2 className="text-white/80 text-sm font-bold uppercase tracking-widest text-center mb-5">
            ✨ Välj din värld
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {WORLDS.map(world => {
              const isCurrent = world.id === currentWorldId;
              const worldProgress = progress.filter(p => world.topicIds.includes(p.topicId));
              const completed = worldProgress.filter(p => p.completed).length;
              const pct = world.topicIds.length > 0 ? (completed / world.topicIds.length) * 100 : 0;

              return (
                <button key={world.id}
                  onClick={() => setView(`world-${world.id}` as any)}
                  className={`text-left rounded-3xl overflow-hidden transition-all shadow-xl hover:scale-[1.03] active:scale-[0.97] cursor-pointer ${
                    isCurrent ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-transparent' : ''
                  }`}
                >
                  <div className={`bg-gradient-to-br ${world.bg} p-5 relative overflow-hidden h-full`}>
                    {/* Decorative emojis background */}
                    <div className="absolute right-2 bottom-2 opacity-20 text-4xl leading-none">
                      {world.islandEmojis[0]}
                    </div>

                    {/* Top row: emoji + current badge */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-5xl leading-none">{world.emoji}</div>
                      {isCurrent && (
                        <span className="bg-amber-400 text-amber-900 text-xs font-black px-2 py-0.5 rounded-full">
                          DIN VÄRLD
                        </span>
                      )}
                    </div>

                    {/* Name & subtitle */}
                    <h3 className="text-white font-black text-lg leading-tight mb-0.5">
                      {world.name}
                    </h3>
                    <p className="text-white/70 text-xs font-semibold mb-3">{world.subtitle}</p>

                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-white/70 text-xs mb-1">
                        <span>{completed}/{world.topicIds.length} klara</span>
                        <span>{Math.round(pct)}%</span>
                      </div>
                      <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full transition-all"
                          style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
