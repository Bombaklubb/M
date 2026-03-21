import React from 'react';
import { useApp } from '../contexts/AppContext';
import { WORLDS } from '../data/worlds';
import { TOPICS } from '../data/topics';
import { getProgress, getPoints } from '../utils/storage';
import { loadGamification } from '../utils/chestStorage';
import { ALL_AVATARS } from '../data/avatars';
import { Meteors } from './magicui/meteors';
import { AnimatedGradientText } from './magicui/animated-gradient-text';
import { BorderBeam } from './magicui/border-beam';
import { Badge } from './ui/badge';

export default function WorldSelect() {
  const { currentStudent, logout, setView } = useApp();

  const progress = currentStudent ? getProgress(currentStudent.id) : [];
  const pointsRecord = currentStudent ? getPoints(currentStudent.id) : null;
  const totalPoints = pointsRecord?.totalPoints ?? 0;
  const avatarEmoji = ALL_AVATARS[currentStudent?.avatar ?? 0] ?? '🦁';
  const unopenedChests = currentStudent
    ? loadGamification(currentStudent.id).chests.filter(c => !c.opened).length
    : 0;

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{ background: 'linear-gradient(135deg, #07071a 0%, #0d0d2b 50%, #1a0a2e 100%)' }}
    >
      {/* Magic UI – Meteors */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Meteors number={14} minDuration={5} maxDuration={14} />
      </div>

      {/* Static star dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: i % 7 === 0 ? 3 : i % 3 === 0 ? 2 : 1,
              height: i % 7 === 0 ? 3 : i % 3 === 0 ? 2 : 1,
              top: `${(i * 1.618 * 7.3) % 100}%`,
              left: `${(i * 2.718 * 5.7) % 100}%`,
              opacity: 0.1 + (i % 5) * 0.07,
            }}
          />
        ))}
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-end gap-2 px-4 pt-4 pb-2">
        {/* Kistor */}
        <button
          onClick={() => setView('kistor')}
          className="relative flex items-center gap-1 px-3 py-1.5 rounded-full transition-all hover:bg-white/20 active:scale-95 cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
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
          className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all hover:bg-white/20 active:scale-95 cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          <span className="text-xl leading-none">{avatarEmoji}</span>
          <span className="text-white font-bold text-sm">{currentStudent?.name ?? ''}</span>
          <span className="text-white/30 text-sm">·</span>
          <span className="text-yellow-400 text-sm">⭐</span>
          <span className="text-white font-bold text-sm">{totalPoints}</span>
        </button>

        {/* Logga ut */}
        <button
          onClick={logout}
          className="text-white/60 text-sm px-3 py-1.5 rounded-full transition-all hover:bg-white/10 active:scale-95 cursor-pointer"
          style={{ border: '1px solid rgba(255,255,255,0.15)' }}
        >
          Logga ut
        </button>
      </div>

      {/* Logo */}
      <div className="relative z-10 pt-2 pb-4 text-center px-4">
        <img
          src="/mattejakten.png"
          alt="Mattejakten"
          className="h-56 w-auto mx-auto drop-shadow-lg"
        />
      </div>

      {/* Divider */}
      <div className="relative z-10 flex items-center justify-center gap-3 mt-2 mb-5 px-8">
        <div className="h-px bg-white/15 flex-1" />
        <span className="text-white/35 text-[11px] font-bold tracking-widest uppercase">
          Välj din värld
        </span>
        <div className="h-px bg-white/15 flex-1" />
      </div>

      {/* World cards 2×2 with BorderBeam on hover */}
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
              className="group relative text-left rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
              aria-label={world.name}
            >
              {/* BorderBeam on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <BorderBeam
                  colorFrom="#f59e0b"
                  colorTo="#8b5cf6"
                  duration={4}
                  size={80}
                  borderWidth={1.5}
                />
              </div>

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
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-white/35 text-[11px]">{completed}/{worldTopics.length} klara</span>
                {pct === 100 && (
                  <Badge variant="default" className="text-[9px] px-1.5 py-0">Klar!</Badge>
                )}
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div
                  className={`h-full bg-gradient-to-r ${world.bg} rounded-full transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              {pct > 0 && pct < 100 && (
                <div className="text-right text-white/30 text-[10px] mt-0.5">{pct}%</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
