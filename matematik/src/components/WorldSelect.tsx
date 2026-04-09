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
    <div className="min-h-screen relative overflow-x-hidden">

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-end gap-2 px-4 pt-4 pb-2">
        {/* Kistor */}
        <button
          onClick={() => setView('kistor')}
          className="relative flex items-center gap-1 px-3 py-1.5 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer"
          style={{
            background: 'rgba(251, 146, 60, 0.12)',
            border: '1px solid rgba(251, 146, 60, 0.40)',
            boxShadow: '0 2px 10px rgba(251,146,60,0.15)',
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
            background: 'rgba(255, 255, 255, 0.85)',
            border: '1px solid rgba(251, 146, 60, 0.35)',
            boxShadow: '0 2px 10px rgba(251,146,60,0.15)',
          }}
        >
          <span className="text-xl leading-none">{avatarEmoji}</span>
          <span className="text-gray-800 font-bold text-sm">{currentStudent?.name ?? ''}</span>
          <span className="text-gray-300 text-sm">·</span>
          <span className="text-orange-500 text-sm">⭐</span>
          <span className="font-bold text-sm" style={{ color: '#ea580c' }}>{totalPoints}</span>
        </button>

        {/* Logga ut */}
        <button
          onClick={logout}
          className="text-gray-500 text-sm px-3 py-1.5 rounded-full transition-all hover:text-gray-700 active:scale-95 cursor-pointer"
          style={{ border: '1px solid rgba(251,146,60,0.25)' }}
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
        <div className="h-px flex-1" style={{ background: 'rgba(251,146,60,0.25)' }} />
        <span className="font-bold text-[11px] tracking-widest uppercase" style={{ color: 'rgba(234,88,12,0.65)' }}>
          ✦ Välj din värld ✦
        </span>
        <div className="h-px flex-1" style={{ background: 'rgba(251,146,60,0.25)' }} />
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
            .reduce((sum, p) => sum + (p.correctAnswers ?? 0) * 10, 0);

          return (
            <button
              key={world.id}
              onClick={() => setView(`world-${world.id}` as any)}
              className="group relative text-left rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:scale-[1.04] active:scale-[0.97] overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.88)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(251, 146, 60, 0.35)',
                boxShadow: '0 6px 28px rgba(251,146,60,0.14), inset 0 1px 0 rgba(255,255,255,0.9)',
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
              <h3 className="text-gray-800 font-black text-sm leading-tight">{world.name}</h3>
              <p className="text-xs mt-0.5 mb-3 text-gray-500">
                {world.subtitle}
              </p>

              {/* Points + progress count */}
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-xs font-black" style={{ color: '#ea580c' }}>⭐ {worldPoints}</span>
                <span className="text-xs text-gray-400">
                  · {completed}/{worldTopics.length} klara
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(251,146,60,0.15)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500 progress-gold"
                  style={{ width: `${pct}%` }}
                />
              </div>
              {pct > 0 && pct < 100 && (
                <div className="text-right text-[10px] mt-0.5" style={{ color: 'rgba(234,88,12,0.65)' }}>
                  {pct}%
                </div>
              )}
              {pct === 100 && (
                <div className="text-right text-[10px] mt-0.5 font-bold" style={{ color: '#ea580c' }}>
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
