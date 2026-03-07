import React from 'react';
import { useApp } from '../contexts/AppContext';
import { WORLDS } from '../data/worlds';
import { TOPICS } from '../data/topics';
import { getProgress } from '../utils/storage';

export default function WorldSelect() {
  const { currentStudent, setView } = useApp();

  const progress = currentStudent ? getProgress(currentStudent.id) : [];

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{ background: 'linear-gradient(135deg, #07071a 0%, #0d0d2b 50%, #1a0a2e 100%)' }}
    >
      {/* Decorative stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: i % 7 === 0 ? 3 : i % 3 === 0 ? 2 : 1,
              height: i % 7 === 0 ? 3 : i % 3 === 0 ? 2 : 1,
              top: `${(i * 1.618 * 7.3) % 100}%`,
              left: `${(i * 2.718 * 5.7) % 100}%`,
              opacity: 0.15 + (i % 5) * 0.1,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 pt-10 pb-4 text-center px-4">
        <img
          src="/mattejakten.png"
          alt="Mattejakten"
          className="h-20 w-auto mx-auto mb-3 drop-shadow-lg"
        />
        <h1 className="text-3xl font-black text-white tracking-wide drop-shadow-md">
          Mattejakten
        </h1>
        <p className="text-white/50 text-sm mt-1">Upptäck matematikens världar</p>
      </div>

      {/* Divider */}
      <div className="relative z-10 flex items-center justify-center gap-3 mt-2 mb-5 px-8">
        <div className="h-px bg-white/15 flex-1" />
        <span className="text-white/35 text-[11px] font-bold tracking-widest uppercase">Välj din värld</span>
        <div className="h-px bg-white/15 flex-1" />
      </div>

      {/* World cards 2×2 */}
      <div className="relative z-10 grid grid-cols-2 gap-3 px-4 max-w-lg mx-auto pb-8">
        {WORLDS.map(world => {
          const worldTopics = TOPICS.filter(t => world.topicIds.includes(t.id));
          const completed = worldTopics.filter(t =>
            progress.some(p => p.topicId === t.id && p.completed)
          ).length;
          const pct = worldTopics.length ? Math.round((completed / worldTopics.length) * 100) : 0;

          return (
            <button
              key={world.id}
              onClick={() => setView(`world-${world.id}` as any)}
              className="text-left rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
              style={{
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
              aria-label={world.name}
            >
              {/* World icon */}
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${world.bg} flex items-center justify-center text-3xl mb-3 shadow-lg`}
              >
                {world.emoji}
              </div>

              {/* Name & subtitle */}
              <h3 className="text-white font-black text-sm leading-tight">{world.name}</h3>
              <p className="text-white/45 text-xs mt-0.5 mb-3">{world.subtitle}</p>

              {/* Progress */}
              <div className="text-white/35 text-[11px] mb-1.5">
                {completed}/{worldTopics.length} klara
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div
                  className={`h-full bg-gradient-to-r ${world.bg} rounded-full transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              {pct > 0 && (
                <div className="text-right text-white/30 text-[10px] mt-0.5">{pct}%</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
