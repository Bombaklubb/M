import { useApp } from '../contexts/AppContext';
import { WORLDS } from '../data/worlds';
import { TOPICS } from '../data/topics';
import { getProgress, getPoints, initPoints } from '../utils/storage';
import { loadGamification } from '../utils/chestStorage';
import { getEquippedFrame, getWalletBalance, getEquippedBackground } from '../utils/shopStorage';
import { getDailyChallengeRecord } from '../utils/dailyChallenge';
import { BACKGROUND_MAP } from '../data/shop';
import { ALL_AVATARS } from '../data/avatars';
import { BorderBeam } from './magicui/border-beam';
import FramedAvatar from './FramedAvatar';

export default function WorldSelect() {
  const { currentStudent, logout, setView, dailyBonus, clearDailyBonus } = useApp();

  const progress = currentStudent ? getProgress(currentStudent.id) : [];
  // Plånbokssaldo (livstidspoäng − spenderat i butiken) – det eleven faktiskt kan spendera.
  const walletBalance = currentStudent ? getWalletBalance(currentStudent.id) : 0;
  const pointsRecord = currentStudent
    ? (getPoints(currentStudent.id) ?? initPoints(currentStudent.id))
    : null;
  const lifetimePoints = pointsRecord?.total ?? 0;
  const streak = pointsRecord?.streak ?? 0;
  const dailyDone = currentStudent ? getDailyChallengeRecord(currentStudent.id) !== null : false;
  const avatarEmoji = ALL_AVATARS[currentStudent?.avatar ?? 0] ?? '🦁';
  const equippedFrame = currentStudent ? getEquippedFrame(currentStudent.id) : null;
  const unopenedChests = currentStudent
    ? loadGamification(currentStudent.id).chests.filter(c => !c.opened).length
    : 0;

  // Valt tema (bakgrund) – annars startsidans standardbild.
  const equippedBgId = currentStudent ? getEquippedBackground(currentStudent.id) : null;
  const equippedBg = equippedBgId ? BACKGROUND_MAP[equippedBgId] : null;
  const bgStyle = equippedBg
    ? { background: equippedBg.css }
    : {
        backgroundImage: "url('/Drömmig lärandemiljö med kontorstillbehör.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
      };

  return (
    <div
      className={`min-h-screen relative overflow-x-hidden${equippedBg?.animated ? ' shop-theme-animated' : ''}`}
      style={bgStyle}
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

        {/* Butik – plånbokssaldo */}
        <button
          onClick={() => setView('shop')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer"
          style={{
            background: 'rgba(255, 248, 220, 0.82)',
            border: '1px solid rgba(180, 130, 40, 0.50)',
            boxShadow: '0 2px 10px rgba(120,80,10,0.20)',
          }}
          title="Affären"
          aria-label="Öppna butiken"
        >
          <span className="text-xl leading-none">🛒</span>
          <span className="font-bold text-sm" style={{ color: '#92400e' }}>{walletBalance}</span>
        </button>

        {/* Livstidspoäng */}
        <div
          className="flex items-center gap-1 px-3 py-1.5 rounded-full"
          style={{
            background: 'rgba(255, 248, 220, 0.82)',
            border: '1px solid rgba(180, 130, 40, 0.50)',
            boxShadow: '0 2px 10px rgba(120,80,10,0.20)',
          }}
          title="Livstidspoäng"
        >
          <span className="text-amber-500 text-sm">⭐</span>
          <span className="font-bold text-sm" style={{ color: '#92400e' }}>{lifetimePoints}</span>
        </div>

        {/* Streak – dagar i rad */}
        {streak > 0 && (
          <div
            className="flex items-center gap-1 px-3 py-1.5 rounded-full"
            style={{
              background: 'rgba(255, 248, 220, 0.82)',
              border: '1px solid rgba(180, 130, 40, 0.50)',
              boxShadow: '0 2px 10px rgba(120,80,10,0.20)',
            }}
            title={`${streak} dagar i rad – fortsätt imorgon för att behålla din streak!`}
          >
            <span className="text-sm">🔥</span>
            <span className="font-bold text-sm" style={{ color: '#92400e' }}>{streak}</span>
          </div>
        )}

        {/* Avatar + namn */}
        <button
          onClick={() => setView('my-page')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer"
          style={{
            background: 'rgba(255, 248, 220, 0.82)',
            border: '1px solid rgba(180, 130, 40, 0.50)',
            boxShadow: '0 2px 10px rgba(120,80,10,0.20)',
          }}
        >
          <FramedAvatar emoji={avatarEmoji} frameId={equippedFrame} size={equippedFrame ? 28 : 22} />
          <span className="font-bold text-sm" style={{ color: '#5c3a00' }}>{currentStudent?.name ?? ''}</span>
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

      {/* Daglig bonus-notis */}
      {dailyBonus != null && (
        <div className="relative z-10 px-4 flex justify-center">
          <button
            onClick={clearDailyBonus}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-white font-bold text-sm shadow-lg transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: '1px solid #b45309' }}
            title="Stäng"
          >
            <span className="text-base">🎁</span>
            <span>Daglig bonus: +{dailyBonus} ⭐!</span>
            <span className="opacity-70 text-xs">✕</span>
          </button>
        </div>
      )}

      {/* Logo – svävande */}
      <div className="relative z-10 pt-2 pb-1 text-center px-4 animate-float">
        <img
          src="/mattejakten.png"
          alt="Mattejakten"
          className="h-48 w-auto mx-auto drop-shadow-lg"
          style={{ filter: 'drop-shadow(0 4px 16px rgba(120,80,10,0.30))' }}
        />
      </div>

      {/* Dagens utmaning */}
      <div className="relative z-10 px-4 max-w-lg mx-auto mt-1">
        <button
          onClick={() => setView('daily-challenge')}
          className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          style={{
            background: dailyDone
              ? 'rgba(255, 248, 220, 0.82)'
              : 'linear-gradient(135deg,#f59e0b,#d97706)',
            border: dailyDone ? '1px solid rgba(180,130,40,0.50)' : '2px solid #b45309',
            boxShadow: dailyDone ? '0 2px 10px rgba(120,80,10,0.20)' : '0 4px 18px rgba(217,119,6,0.45)',
          }}
        >
          <span className="text-2xl">{dailyDone ? '✅' : '🗓️'}</span>
          <span className="flex-1 min-w-0">
            <span className={`block font-black text-sm ${dailyDone ? '' : 'text-white'}`} style={dailyDone ? { color: '#78350f' } : undefined}>
              Dagens utmaning
            </span>
            <span className={`block text-xs ${dailyDone ? '' : 'text-white/85'}`} style={dailyDone ? { color: 'rgba(120,60,10,0.75)' } : undefined}>
              {dailyDone ? 'Klar för idag – kom tillbaka imorgon!' : '5 frågor · upp till 200 ⭐ + kista!'}
            </span>
          </span>
          {!dailyDone && <span className="text-white font-black text-lg">→</span>}
        </button>
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


    </div>
  );
}
