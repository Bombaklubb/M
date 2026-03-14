import React, { useState, useEffect } from 'react';
import AppHeader from './AppHeader';
import { useApp } from '../contexts/AppContext';
import {
  loadGamification, saveGamification,
  CHEST_META, MATH_BADGES, BOSS_UNLOCK_THRESHOLD, getMathBadge,
  openWoodChest, openSilverChest, openGoldChest,
} from '../utils/chestStorage';
import { addPoints, getPoints, initPoints } from '../utils/storage';
import type { MattChest, MattGamificationData } from '../types';

// ─── Chest Card ───────────────────────────────────────────────────────────────

function ChestCard({
  chest,
  onOpen,
}: {
  chest: MattChest;
  onOpen: (id: string) => void;
}) {
  const meta = CHEST_META[chest.type];
  const [animating, setAnimating] = useState(false);

  function handleClick() {
    if (chest.opened || animating) return;
    setAnimating(true);
    setTimeout(() => {
      onOpen(chest.id);
      setAnimating(false);
    }, 500);
  }

  return (
    <div
      onClick={handleClick}
      className={`relative flex flex-col items-center p-5 rounded-3xl transition-all cursor-pointer select-none ${
        !chest.opened
          ? `bg-gradient-to-br ${meta.gradient} hover:scale-105 active:scale-95`
          : 'bg-white/5 border border-white/10 cursor-default opacity-50'
      }`}
      style={{
        border: chest.opened ? undefined : '2px solid rgba(255,255,255,0.2)',
        boxShadow: chest.opened
          ? 'none'
          : '0 6px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
        transform: animating ? 'scale(1.08) rotate(-3deg)' : undefined,
        transition: 'transform 0.15s ease-out, box-shadow 0.15s',
      }}
    >
      <span
        className="text-5xl mb-3"
        style={{
          filter: chest.opened ? 'grayscale(1)' : 'none',
          animation: animating ? 'chest-shake 0.4s ease-in-out' : 'none',
        }}
      >
        {chest.opened ? '🔓' : meta.emoji}
      </span>
      <span className={`text-sm font-bold mb-1 ${chest.opened ? 'text-white/30' : 'text-white'}`}>
        {meta.label}
      </span>
      {chest.opened ? (
        <span className="text-xs text-white/30">Öppnad</span>
      ) : (
        <span className="text-xs text-white/60 mt-1">Tryck för att öppna</span>
      )}
      {chest.opened && chest.openedReward && (
        <p className="mt-2 text-xs text-center text-white/40 leading-snug">
          {chest.openedReward}
        </p>
      )}
    </div>
  );
}

// ─── Reward Popup ─────────────────────────────────────────────────────────────

function RewardPopup({
  description,
  onClose,
}: {
  description: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="rounded-3xl p-8 max-w-sm w-full text-center"
        style={{
          background: 'linear-gradient(135deg, #1a0a2e, #0d0d2b)',
          border: '3px solid #f59e0b',
          boxShadow: '0 8px 40px rgba(245,158,11,0.4), 0 2px 8px rgba(0,0,0,0.5)',
        }}
      >
        <div
          className="text-6xl mb-4"
          style={{ animation: 'pop-in 0.4s cubic-bezier(0.36,0.07,0.19,0.97)' }}
        >
          🎉
        </div>
        <h2 className="text-2xl font-black text-amber-400 mb-3">Lådan är öppnad!</h2>
        <p className="text-base font-semibold text-white/90 mb-6 leading-relaxed">
          {description}
        </p>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl font-bold text-white text-base transition-all active:scale-95 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            border: '3px solid #d97706',
            boxShadow: '0 4px 12px rgba(217,119,6,0.4)',
          }}
        >
          Toppen! ✓
        </button>
      </div>
    </div>
  );
}

// ─── Mystery Box Popup ────────────────────────────────────────────────────────

function MysteryBoxPopup({
  description,
  onClose,
}: {
  description: string;
  onClose: () => void;
}) {
  const [opened, setOpened] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div
        className="rounded-3xl p-8 max-w-sm w-full text-center"
        style={{
          background: 'linear-gradient(135deg, #1a0a2e, #0d0d2b)',
          border: '3px solid #a855f7',
          boxShadow: '0 8px 40px rgba(168,85,247,0.35), 0 2px 8px rgba(0,0,0,0.5)',
        }}
      >
        {!opened ? (
          <>
            <div className="text-7xl mb-4 animate-bounce" style={{ animationDuration: '1s' }}>
              🎁
            </div>
            <h2 className="text-2xl font-black text-purple-400 mb-2">Mysterylåda!</h2>
            <p className="text-white/60 mb-6 text-sm">
              Du hittade en mysterylåda! Klicka för att öppna den.
            </p>
            <button
              onClick={() => setOpened(true)}
              className="w-full py-3 px-6 rounded-2xl font-bold text-white text-lg transition-all active:scale-95 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                border: '3px solid #7c3aed',
                boxShadow: '0 4px 12px rgba(124,58,237,0.4)',
              }}
            >
              Öppna lådan!
            </button>
          </>
        ) : (
          <>
            <div
              className="text-7xl mb-4"
              style={{ animation: 'pop-in 0.4s cubic-bezier(0.36,0.07,0.19,0.97)' }}
            >
              ⭐
            </div>
            <h2 className="text-2xl font-black text-purple-400 mb-2">Du vann!</h2>
            <p className="text-lg font-bold text-white/90 mb-6">{description}</p>
            <button
              onClick={onClose}
              className="w-full py-3 px-6 rounded-2xl font-bold text-white text-base transition-all active:scale-95 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                border: '3px solid #16a34a',
                boxShadow: '0 4px 12px rgba(34,197,94,0.4)',
              }}
            >
              Häftigt! Fortsätt →
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────

export default function KistorView() {
  const { currentStudent, setView } = useApp();
  const [gam, setGam] = useState<MattGamificationData | null>(null);
  const [rewardDescription, setRewardDescription] = useState<string | null>(null);
  const [mysteryDescription, setMysteryDescription] = useState<string | null>(null);

  useEffect(() => {
    if (currentStudent) {
      setGam(loadGamification(currentStudent.id));
    }
  }, [currentStudent]);

  if (!currentStudent || !gam) return null;

  const unopened = gam.chests.filter(c => !c.opened);
  const opened = gam.chests.filter(c => c.opened);
  const exercisesLeft = Math.max(0, BOSS_UNLOCK_THRESHOLD - gam.exercisesCompleted);

  function handleOpenChest(chestId: string) {
    if (!gam || !currentStudent) return;
    const chest = gam.chests.find(c => c.id === chestId);
    if (!chest || chest.opened) return;

    let result: { points: number; badge?: string; bonusChest?: import('../types').MattChest; description: string };

    if (chest.type === 'wood') {
      result = { ...openWoodChest() };
    } else if (chest.type === 'silver') {
      result = openSilverChest(gam.badges);
    } else {
      result = openGoldChest(gam.badges);
    }

    const newChests = gam.chests.map(c =>
      c.id === chestId ? { ...c, opened: true, openedReward: result.description } : c
    );
    if (result.bonusChest) newChests.push(result.bonusChest);

    const newBadges = result.badge && !gam.badges.includes(result.badge)
      ? [...gam.badges, result.badge]
      : gam.badges;

    const newGam = { ...gam, chests: newChests, badges: newBadges };
    saveGamification(currentStudent.id, newGam);
    setGam({ ...newGam });

    // Award points from opening chest
    addPoints(currentStudent.id, result.points);

    setRewardDescription(result.description);
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #07071a 0%, #0d0d2b 50%, #1a0a2e 100%)' }}
    >
      <AppHeader />

      {/* Hero banner */}
      <div
        className="pt-14 text-white"
        style={{ background: 'linear-gradient(135deg, #92400e 0%, #b45309 50%, #d97706 100%)' }}
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => setView('dashboard')}
            className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-3 transition-colors cursor-pointer"
          >
            ← Tillbaka
          </button>
          <div className="flex items-center gap-3">
            <span className="text-4xl">🏆</span>
            <div>
              <h1 className="text-2xl font-black">Hemliga Kistor</h1>
              <p className="text-white/70 text-sm">Öppna kistor och vinn belöningar!</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-8">

        {/* Boss challenge card */}
        <div
          className="rounded-3xl p-5"
          style={{
            background: gam.bossUnlocked
              ? 'linear-gradient(135deg, #7f1d1d, #991b1b, #dc2626)'
              : 'linear-gradient(135deg, #1f2937, #374151)',
            border: `2px solid ${gam.bossUnlocked ? '#ef4444' : '#6b7280'}`,
            boxShadow: gam.bossUnlocked
              ? '0 6px 24px rgba(239,68,68,0.25), inset 0 1px 0 rgba(255,255,255,0.1)'
              : 'none',
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{gam.bossUnlocked ? '⚔️' : '🔒'}</span>
              <div>
                <h2 className="text-lg font-black text-white">Boss Challenge</h2>
                <p className="text-white/60 text-sm">
                  {gam.bossUnlocked
                    ? `Utmana bossen! Du har vunnit ${gam.bossWins} gång${gam.bossWins !== 1 ? 'er' : ''}.`
                    : `Slutför ${exercisesLeft} övning${exercisesLeft !== 1 ? 'ar' : ''} till för att låsa upp.`}
                </p>
              </div>
            </div>
            {!gam.bossUnlocked && (
              <div className="text-white/40 text-sm font-medium">
                {gam.exercisesCompleted}/{BOSS_UNLOCK_THRESHOLD} övningar
              </div>
            )}
          </div>

          {/* Progress bar */}
          {!gam.bossUnlocked && (
            <div className="mt-4">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white/40 rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (gam.exercisesCompleted / BOSS_UNLOCK_THRESHOLD) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Unopened chests */}
        <section>
          <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2">
            <span>🎁</span>
            Oöppnade kistor
            {unopened.length > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-amber-500 text-white rounded-full">
                {unopened.length}
              </span>
            )}
          </h2>
          {unopened.length === 0 ? (
            <div
              className="rounded-3xl p-8 text-center"
              style={{
                border: '2px dashed rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.03)',
              }}
            >
              <p className="text-5xl mb-3">🏅</p>
              <p className="text-white/50 text-sm">
                Inga kistor just nu. Slutför övningar för att tjäna kistor!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {unopened.map(chest => (
                <ChestCard key={chest.id} chest={chest} onOpen={handleOpenChest} />
              ))}
            </div>
          )}
        </section>

        {/* Badges */}
        {gam.badges.length > 0 && (
          <section>
            <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2">
              <span>🎖️</span>
              Dina märken ({gam.badges.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {gam.badges.map(badgeId => {
                const badge = getMathBadge(badgeId);
                if (!badge) return null;
                return (
                  <div
                    key={badgeId}
                    className="flex flex-col items-center p-4 rounded-3xl"
                    style={{
                      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                      border: '2px solid #7c3aed',
                      boxShadow: '0 4px 16px rgba(124,58,237,0.25), inset 0 1px 0 rgba(255,255,255,0.15)',
                    }}
                  >
                    <span className="text-3xl mb-2">{badge.emoji}</span>
                    <span className="text-xs font-bold text-white text-center leading-snug">
                      {badge.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* All badges (locked) */}
        {gam.badges.length < MATH_BADGES.length && (
          <section>
            <h2 className="text-lg font-black text-white/60 mb-4 flex items-center gap-2">
              <span>🔒</span>
              Låsta märken ({MATH_BADGES.length - gam.badges.length} kvar)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {MATH_BADGES.filter(b => !gam.badges.includes(b.id)).map(badge => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center p-4 rounded-3xl opacity-40"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '2px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <span className="text-3xl mb-2" style={{ filter: 'grayscale(1)' }}>
                    {badge.emoji}
                  </span>
                  <span className="text-xs font-bold text-white/50 text-center leading-snug">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Opened chests history */}
        {opened.length > 0 && (
          <section>
            <h2 className="text-lg font-black text-white/60 mb-4 flex items-center gap-2">
              <span>🔓</span>
              Öppnade kistor ({opened.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {opened.map(chest => (
                <ChestCard key={chest.id} chest={chest} onOpen={() => {}} />
              ))}
            </div>
          </section>
        )}

        {/* How to earn chests */}
        <section
          className="rounded-3xl p-5"
          style={{
            background: 'rgba(59,130,246,0.08)',
            border: '2px solid rgba(59,130,246,0.2)',
          }}
        >
          <h3 className="font-bold text-blue-300 mb-3 flex items-center gap-2">
            <span>💡</span> Hur tjänar man kistor?
          </h3>
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-2">
            Poängmilstolpar
          </p>
          <ul className="space-y-1.5 text-sm text-blue-100/80 mb-4">
            <li className="flex items-start gap-2">
              <span>📦</span>
              <span><strong>Trälåda:</strong> 100, 200, 600 poäng</span>
            </li>
            <li className="flex items-start gap-2">
              <span>🪙</span>
              <span><strong>Silverlåda:</strong> 300, 500, 750, 1 500, 2 000 poäng</span>
            </li>
            <li className="flex items-start gap-2">
              <span>🏆</span>
              <span><strong>Guldlåda:</strong> 1 000, 2 500, 3 500, 5 000 poäng</span>
            </li>
          </ul>
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-2">
            Övningsmilstolpar
          </p>
          <ul className="space-y-1.5 text-sm text-blue-100/80 mb-4">
            <li className="flex items-start gap-2">
              <span>📦</span>
              <span><strong>Trälåda:</strong> 5, 10 övningar</span>
            </li>
            <li className="flex items-start gap-2">
              <span>🪙</span>
              <span><strong>Silverlåda:</strong> 15, 20, 40 övningar</span>
            </li>
            <li className="flex items-start gap-2">
              <span>🏆</span>
              <span><strong>Guldlåda:</strong> 30, 60, 75, 100 övningar</span>
            </li>
          </ul>
          <div className="flex items-start gap-2 text-sm text-blue-100/80 pt-2 border-t border-blue-400/20">
            <span>🎁</span>
            <span><strong>Mysterylåda:</strong> Slumpmässig chans efter varje övning!</span>
          </div>
        </section>
      </main>

      {/* Animations */}
      <style>{`
        @keyframes chest-shake {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-8deg) scale(1.05); }
          40% { transform: rotate(8deg) scale(1.1); }
          60% { transform: rotate(-5deg) scale(1.05); }
          80% { transform: rotate(5deg); }
        }
        @keyframes pop-in {
          0% { transform: scale(0.3); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); }
        }
      `}</style>

      {/* Reward popup */}
      {rewardDescription && (
        <RewardPopup
          description={rewardDescription}
          onClose={() => setRewardDescription(null)}
        />
      )}

      {/* Mystery box popup */}
      {mysteryDescription && (
        <MysteryBoxPopup
          description={mysteryDescription}
          onClose={() => setMysteryDescription(null)}
        />
      )}
    </div>
  );
}
