import { useApp } from '../contexts/AppContext';
import { WORLDS } from '../data/worlds';
import { TOPICS } from '../data/topics';
import { getProgress, getPoints } from '../utils/storage';
import { loadGamification } from '../utils/chestStorage';
import { ALL_AVATARS } from '../data/avatars';
import { BorderBeam } from './magicui/border-beam';

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
      style={{
        backgroundImage: "url('/Solig glänta i den förtrollade skogen.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Top bar – real clickable buttons */}
      <div className="relative z-10 flex items-center justify-end gap-2 px-4 pt-4 pb-2">

        {/* Kistor */}
        <button
          onClick={() => setView('kistor')}
          className="relative flex items-center gap-1 px-3 py-1.5 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer"
          style={{
            background: 'rgba(255, 248, 220, 0.82)',
            border: '1px solid rgba(180, 130, 40, 0.50)',
            boxShadow: '0 2px 10px rgba(120,80,10,0.20)',
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
            background: 'rgba(255, 248, 220, 0.82)',
            border: '1px solid rgba(180, 130, 40, 0.50)',
            boxShadow: '0 2px 10px rgba(120,80,10,0.20)',
          }}
        >
          <span className="text-xl leading-none">{avatarEmoji}</span>
          <span className="font-bold text-sm" style={{ color: '#5c3a00' }}>{currentStudent?.name ?? ''}</span>
          <span className="text-amber-600 text-sm">·</span>
          <span className="text-amber-500 text-sm">⭐</span>
          <span className="font-bold text-sm" style={{ color: '#92400e' }}>{totalPoints}</span>
        </button>

        {/* Logga ut */}
        <button
          onClick={logout}
          className="text-sm px-3 py-1.5 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer"
          style={{
            background: 'rgba(255, 248, 220, 0.70)',
            border: '1px solid rgba(180, 130, 40, 0.35)',
            color: '#78350f',
          }}
        >
          Logga ut
        </button>
      </div>

      {/* Logo – svävande */}
      <div className="relative z-10 pt-2 pb-1 text-center px-4 animate-float">
        <img
          src="/mattejakten.png"
          alt="Mattejakten"
          className="h-48 w-auto mx-auto drop-shadow-lg"
          style={{ filter: 'drop-shadow(0 4px 16px rgba(120,80,10,0.30))' }}
        />
      </div>

      {/* Välj din värld */}
      <div className="relative z-10 flex items-center justify-center gap-3 mt-3 mb-4 px-8">
        <div className="h-px flex-1" style={{ background: 'rgba(180,130,40,0.35)' }} />
        <span className="font-bold text-[11px] tracking-widest uppercase" style={{ color: 'rgba(120,60,10,0.80)' }}>
          ✦ Välj din värld ✦
        </span>
        <div className="h-px flex-1" style={{ background: 'rgba(180,130,40,0.35)' }} />
      </div>

      {/* World cards 2×2 */}
      <div className="relative z-10 grid grid-cols-2 gap-3 px-4 max-w-lg mx-auto pb-6">
        {WORLDS.map(world => {
          const worldTopics = TOPICS.filter(t => world.topicIds.includes(t.id));
          const completed = worldTopics.filter(t =>
            progress.some(p => p.topicId === t.id && p.completed)
          ).length;
          const pct = worldTopics.length ? Math.round((completed / worldTopics.length) * 100) : 0;
          const worldPoints = progress
            .filter(p => worldTopics.some(t => t.id === p.topicId))
            .reduce((sum, p) => sum + (p.correctAnswers ?? 0) * 10, 0);

          return (
            <button
              key={world.id}
              onClick={() => setView(`world-${world.id}` as any)}
              className="group relative text-left rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:scale-[1.04] active:scale-[0.97] overflow-hidden"
              style={{
                background: 'rgba(255, 248, 220, 0.88)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(180, 130, 40, 0.45)',
                boxShadow: '0 6px 28px rgba(120,80,20,0.20), inset 0 1px 0 rgba(255,255,255,0.9)',
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

              {/* Name & subtitle */}
              <h3 className="text-gray-800 font-black text-sm leading-tight">{world.name}</h3>
              <p className="text-xs mt-0.5 mb-3 text-gray-500">
                {world.subtitle}
              </p>

              {/* Points + progress count */}
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-xs font-black" style={{ color: '#b45309' }}>⭐ {worldPoints}</span>
                <span className="text-xs text-gray-400">
                  · {completed}/{worldTopics.length} klara
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(180,130,40,0.20)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500 progress-gold"
                  style={{ width: `${pct}%` }}
                />
              </div>
              {pct > 0 && pct < 100 && (
                <div className="text-right text-[10px] mt-0.5" style={{ color: 'rgba(180,90,10,0.75)' }}>
                  {pct}%
                </div>
              )}
              {pct === 100 && (
                <div className="text-right text-[10px] mt-0.5 font-bold" style={{ color: '#b45309' }}>
                  ✓ Klar!
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom tagline */}
      <p className="relative z-10 text-center pb-4 text-xs" style={{ color: 'rgba(120,60,10,0.50)' }}>
        Kontakt – martin.akdogan@enkoping.se
      </p>

    </div>
  );
}
