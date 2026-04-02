import React from 'react';
import { useApp } from '../contexts/AppContext';
import { WORLDS } from '../data/worlds';
import { TOPICS } from '../data/topics';
import { getProgress, getPoints } from '../utils/storage';
import { loadGamification } from '../utils/chestStorage';
import { ALL_AVATARS } from '../data/avatars';
import { Meteors } from './magicui/meteors';
import { BorderBeam } from './magicui/border-beam';

// Twinkling star field
function StarField() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    x: (i * 1.618 * 7.3) % 100,
    y: (i * 2.718 * 5.7) % 100,
    size: i % 7 === 0 ? 3 : i % 3 === 0 ? 2 : 1,
    duration: 2 + (i % 5) * 1.1,
    delay: (i * 0.41) % 5,
    opacity: 0.12 + (i % 5) * 0.10,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white twinkle-star"
          style={{
            width: s.size,
            height: s.size,
            top: `${s.y}%`,
            left: `${s.x}%`,
            opacity: s.opacity,
            '--duration': `${s.duration}s`,
            '--delay': `${s.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export default function WorldSelect() {
  const { currentStudent, logout, setView } = useApp();

  const progress = currentStudent ? getProgress(currentStudent.id) : [];
  const pointsRecord = currentStudent ? getPoints(currentStudent.id) : null;
  const totalPoints = pointsRecord?.total ?? 0;
  const avatarEmoji = ALL_AVATARS[currentStudent?.avatar ?? 0] ?? '🦁';
  const unopenedChests = currentStudent
    ? loadGamification(currentStudent.id).chests.filter(c => !c.opened).length
    : 0;

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{ background: 'linear-gradient(160deg, #120318 0%, #1e0828 35%, #2d0d1e 65%, #160520 100%)' }}
    >
      {/* Stars */}
      <StarField />

      {/* Meteors */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Meteors number={10} minDuration={6} maxDuration={16} />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-end gap-2 px-4 pt-4 pb-2">
        {/* Kistor */}
        <button
          onClick={() => setView('kistor')}
          className="relative flex items-center gap-1 px-3 py-1.5 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer"
          style={{
            background: 'rgba(180, 83, 9, 0.22)',
            border: '1px solid rgba(200, 140, 50, 0.42)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
          }}
          title="Mina kistor"
        >
          <span className="text-xl leading-none">🏆</span>
          {unopenedChests > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-0.5">
              {unopenedChests}
            </span>
          )}
        </button>

        {/* Avatar + namn + poäng */}
        <button
          onClick={() => setView('my-page')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer"
          style={{
            background: 'rgba(40, 8, 32, 0.75)',
            border: '1px solid rgba(200, 140, 50, 0.30)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
          }}
        >
          <span className="text-xl leading-none">{avatarEmoji}</span>
          <span className="text-white font-bold text-sm">{currentStudent?.name ?? ''}</span>
          <span className="text-white/30 text-sm">·</span>
          <span className="text-yellow-400 text-sm">⭐</span>
          <span className="font-bold text-sm" style={{ color: '#fcd34d' }}>{totalPoints}</span>
        </button>

        {/* Logga ut */}
        <button
          onClick={logout}
          className="text-white/50 text-sm px-3 py-1.5 rounded-full transition-all hover:text-white/80 active:scale-95 cursor-pointer"
          style={{ border: '1px solid rgba(255,255,255,0.12)' }}
        >
          Logga ut
        </button>
      </div>

      {/* Logo */}
      <div className="relative z-10 pt-2 pb-4 text-center px-4 animate-float">
        <img
          src="/mattejakten.png"
          alt="Mattejakten"
          className="h-56 w-auto mx-auto drop-shadow-lg"
          style={{ filter: 'drop-shadow(0 0 40px rgba(245,158,11,0.30))' }}
        />
      </div>

      {/* Divider */}
      <div className="relative z-10 flex items-center justify-center gap-3 mt-2 mb-5 px-8">
        <div className="h-px flex-1" style={{ background: 'rgba(200,140,50,0.25)' }} />
        <span className="font-bold text-[11px] tracking-widest uppercase" style={{ color: 'rgba(200,160,80,0.6)' }}>
          ✦ Välj din värld ✦
        </span>
        <div className="h-px flex-1" style={{ background: 'rgba(200,140,50,0.25)' }} />
      </div>

      {/* World cards 2×2 */}
      <div className="relative z-10 grid grid-cols-2 gap-3 px-4 max-w-lg mx-auto pb-8">
        {WORLDS.map(world => {
          const worldTopics = TOPICS.filter(t => world.topicIds.includes(t.id));
          const completed = worldTopics.filter(t =>
            progress.some(p => p.topicId === t.id && p.completed)
          ).length;
          const pct = worldTopics.length ? Math.round((completed / worldTopics.length) * 100) : 0;
          const worldPoints = progress
            .filter(p => worldTopics.some(t => t.id === p.topicId))
            .reduce((sum, p) => sum + (p.points ?? 0), 0);

          return (
            <button
              key={world.id}
              onClick={() => setView(`world-${world.id}` as any)}
              className="group relative text-left rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:scale-[1.04] active:scale-[0.97] overflow-hidden"
              style={{
                background: 'rgba(40, 8, 32, 0.78)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(200, 140, 50, 0.28)',
                boxShadow: '0 6px 28px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,220,100,0.06)',
              }}
              aria-label={world.name}
            >
              {/* BorderBeam on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <BorderBeam
                  colorFrom="#f59e0b"
                  colorTo="#9333ea"
                  duration={4}
                  size={80}
                  borderWidth={1.5}
                />
              </div>

              {/* World icon */}
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${world.bg} flex items-center justify-center text-3xl mb-3 shadow-lg`}
                style={{ boxShadow: `0 4px 16px rgba(0,0,0,0.4)` }}
              >
                {world.emoji}
              </div>

              {/* Name & subtitle */}
              <h3 className="text-white font-black text-sm leading-tight">{world.name}</h3>
              <p className="text-xs mt-0.5 mb-3" style={{ color: 'rgba(255,255,255,0.42)' }}>
                {world.subtitle}
              </p>

              {/* Points + progress count */}
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-xs font-black" style={{ color: '#fcd34d' }}>⭐ {worldPoints}</span>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.30)' }}>
                  · {completed}/{worldTopics.length} klara
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500 progress-gold"
                  style={{ width: `${pct}%` }}
                />
              </div>
              {pct > 0 && pct < 100 && (
                <div className="text-right text-[10px] mt-0.5" style={{ color: 'rgba(200,160,80,0.5)' }}>
                  {pct}%
                </div>
              )}
              {pct === 100 && (
                <div className="text-right text-[10px] mt-0.5 font-bold" style={{ color: '#fcd34d' }}>
                  ✓ Klar!
                </div>
              )}
            </button>
          );
        })}
      </div>

    </div>
  );
}
