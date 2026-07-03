import React, { useState } from 'react';
import { User, Chest, GamificationData } from '../types';
import {
  CHEST_META,
  ALL_GAMIFICATION_BADGES,
  getBadge,
  openChest,
  loadGamification,
  saveGamification,
} from '../lib/gamification';

// ─── Opend kista (för trofehyllan) ───────────────────────────────────────────
interface OpenedChestDisplayProps {
  chest: Chest;
}

function OpenedChestDisplay({ chest }: OpenedChestDisplayProps) {
  const meta = CHEST_META[chest.type];

  return (
    <div className="relative flex flex-col items-center group">
      <div
        className="relative"
        style={{
          filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
        }}
      >
        <img
          src={meta.openedImage}
          alt={`${meta.label} opened`}
          className="w-16 h-16 object-contain"
        />
      </div>

      {/* Etikett */}
      <span className="mt-3 text-xs font-bold text-amber-800 dark:text-amber-200 text-center">
        {meta.label}
      </span>
      <span className="text-[10px] text-amber-600 dark:text-amber-400">
        +{chest.openedReward?.match(/\+(\d+)/)?.[1] || '?'} points
      </span>
    </div>
  );
}

// ─── Trofehylla för öppnade kistor ─────────────────────────────────────────────
interface TrophyShelfProps {
  chests: Chest[];
}

function TrophyShelf({ chests }: TrophyShelfProps) {
  if (chests.length === 0) return null;

  // Gruppera kistor per rad (4 per rad)
  const rows: Chest[][] = [];
  for (let i = 0; i < chests.length; i += 4) {
    rows.push(chests.slice(i, i + 4));
  }

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-black text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <span>🏆</span>
        Trophy Shelf ({chests.length})
      </h2>

      <div
        className="relative rounded-3xl overflow-hidden p-6"
        style={{
          background: 'linear-gradient(180deg, #5D4037 0%, #4E342E 50%, #3E2723 100%)',
          boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.3), 0 4px 20px rgba(0,0,0,0.2)',
        }}
      >
        {/* Trästruktur-mönster */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 20px,
              rgba(0,0,0,0.1) 20px,
              rgba(0,0,0,0.1) 21px
            )`,
          }}
        />

        {/* Dekorativ kant högst upp */}
        <div
          className="absolute top-0 left-0 right-0 h-3"
          style={{
            background: 'linear-gradient(180deg, #8D6E63 0%, #6D4C41 100%)',
            borderBottom: '2px solid #5D4037',
          }}
        />

        <div className="relative space-y-8 pt-2">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="relative">
              {/* Hyllplan */}
              <div
                className="absolute -bottom-4 left-0 right-0 h-4"
                style={{
                  background: 'linear-gradient(180deg, #8D6E63 0%, #6D4C41 50%, #5D4037 100%)',
                  borderRadius: '0 0 4px 4px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                }}
              >
                {/* Kantdetalj */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 50%, transparent)',
                  }}
                />
              </div>

              {/* Kistor på hyllan */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 pb-2">
                {row.map((chest) => (
                  <OpenedChestDisplay key={chest.id} chest={chest} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Golvskugga */}
        <div
          className="absolute bottom-0 left-0 right-0 h-6"
          style={{
            background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.4))',
          }}
        />
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </section>
  );
}

interface ChestCardProps {
  chest: Chest;
  onOpen: (id: string) => void;
}

function ChestCard({ chest, onOpen }: ChestCardProps) {
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
      className={`relative flex flex-col items-center p-5 rounded-3xl transition-all ${
        !chest.opened
          ? `bg-gradient-to-br ${meta.color} hover:scale-105 active:scale-95 cursor-pointer`
          : 'bg-gray-100 dark:bg-gray-700 cursor-default opacity-60'
      }`}
      style={{
        border: '3px solid',
        borderColor: chest.opened ? '#cbd5e1' : 'rgba(255,255,255,0.3)',
        boxShadow: chest.opened
          ? 'none'
          : '0 6px 20px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)',
        transform: animating ? 'scale(1.08) rotate(-3deg)' : 'scale(1)',
        transition: 'transform 0.15s ease-out, box-shadow 0.15s',
      }}
    >
      {chest.opened ? (
        <span
          className="text-5xl mb-3 select-none"
          style={{ filter: 'grayscale(1)' }}
        >
          🔓
        </span>
      ) : (
        <img
          src={meta.image}
          alt={meta.label}
          className="w-16 h-16 mb-3 select-none object-contain"
          style={{
            animation: animating ? 'shake 0.4s ease-in-out' : 'none',
          }}
        />
      )}

      <span
        className={`text-sm font-bold mb-1 ${
          chest.opened ? 'text-gray-400 dark:text-gray-500' : 'text-white'
        }`}
      >
        {meta.label}
      </span>

      {chest.opened ? (
        <span className="text-xs text-gray-400 dark:text-gray-500">Opened</span>
      ) : (
        <span className="text-xs text-white/80 mt-1">Tap to open</span>
      )}

      {chest.opened && chest.openedReward && (
        <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400 leading-snug">
          {chest.openedReward}
        </p>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-8deg) scale(1.05); }
          40% { transform: rotate(8deg) scale(1.1); }
          60% { transform: rotate(-5deg) scale(1.05); }
          80% { transform: rotate(5deg); }
        }
      `}</style>
    </div>
  );
}

interface RewardResult {
  description: string;
  points: number;
}

function RewardPopup({
  result,
  onClose,
}: {
  result: RewardResult;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full text-center"
        style={{
          border: '3px solid #f59e0b',
          boxShadow: '0 8px 32px rgba(245,158,11,0.35), 0 2px 8px rgba(0,0,0,0.2)',
        }}
      >
        <div className="text-6xl mb-4" style={{ animation: 'popIn 0.4s cubic-bezier(0.36,0.07,0.19,0.97)' }}>
          🎉
        </div>
        <h2 className="text-2xl font-black text-amber-700 dark:text-amber-300 mb-3">
          Chest Opened!
        </h2>
        <p className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-6 leading-relaxed">
          {result.description}
        </p>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl font-bold text-white text-base cursor-pointer transition-all active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            border: '3px solid #d97706',
            boxShadow: '0 4px 12px rgba(217,119,6,0.4)',
          }}
        >
          Awesome!
        </button>
        <style>{`
          @keyframes popIn {
            0% { transform: scale(0.3); opacity: 0; }
            60% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
}

interface KistorViewProps {
  user: User;
  onClose: () => void;
  onPointsUpdate: (points: number) => void;
}

export const KistorView: React.FC<KistorViewProps> = ({ user, onClose, onPointsUpdate }) => {
  const [gam, setGam] = useState<GamificationData>(() => loadGamification());
  const [rewardResult, setRewardResult] = useState<RewardResult | null>(null);

  const unopened = gam.chests.filter((c) => !c.opened);
  const opened = gam.chests.filter((c) => c.opened);

  function handleOpenChest(chestId: string) {
    const chest = gam.chests.find((c) => c.id === chestId);
    if (!chest || chest.opened) return;

    const result = openChest(chest.type, gam.gamificationBadges, gam.chests);

    const newChests = gam.chests.map((c) =>
      c.id === chestId ? { ...c, opened: true, openedReward: result.description } : c
    );
    const newBadges = result.badge && !gam.gamificationBadges.includes(result.badge)
      ? [...gam.gamificationBadges, result.badge]
      : gam.gamificationBadges;
    if (result.bonusChest) newChests.push(result.bonusChest);

    const newGam = { ...gam, chests: newChests, gamificationBadges: newBadges };
    saveGamification(newGam);
    setGam({ ...newGam });

    // Update user points
    onPointsUpdate(result.points);

    setRewardResult({ description: result.description, points: result.points });
  }

  return (
    <div className="min-h-screen bg-sky-50 dark:bg-slate-900">
      {/* Header banner */}
      <div
        className="text-white"
        style={{ background: 'linear-gradient(135deg, #92400e, #b45309, #d97706)' }}
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-3 transition-colors"
          >
            ← Back
          </button>
          <div className="flex items-center gap-3">
            <span className="text-4xl">🏆</span>
            <div>
              <h1 className="text-2xl font-black">Secret Chests</h1>
              <p className="text-white/70 text-sm">Open chests and win rewards!</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        {/* Unopened chests */}
        <section>
          <h2 className="text-lg font-black text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span>🎁</span>
            Unopened Chests
            {unopened.length > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-amber-500 text-white rounded-full">
                {unopened.length}
              </span>
            )}
          </h2>
          {unopened.length === 0 ? (
            <div className="rounded-3xl p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800">
              <p className="text-5xl mb-3">🏅</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                No chests right now. Read texts to earn chests!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {unopened.map((chest) => (
                <ChestCard key={chest.id} chest={chest} onOpen={handleOpenChest} />
              ))}
            </div>
          )}
        </section>

        {/* Badges */}
        {gam.gamificationBadges.length > 0 && (
          <section>
            <h2 className="text-lg font-black text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <span>🎖️</span>
              Your Badges ({gam.gamificationBadges.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {gam.gamificationBadges.map((badgeId) => {
                const badge = getBadge(badgeId);
                if (!badge) return null;
                return (
                  <div
                    key={badgeId}
                    className="flex flex-col items-center p-4 rounded-3xl"
                    style={{
                      background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                      border: '3px solid #0284c7',
                      boxShadow: '0 4px 16px rgba(14,165,233,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
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

        {/* Trofehylla med öppnade kistor */}
        <TrophyShelf chests={opened} />

        {/* How to earn chests */}
        <section className="rounded-3xl p-5 bg-sky-50 dark:bg-slate-800 border-2 border-sky-200 dark:border-slate-700">
          <h3 className="font-bold text-sky-900 dark:text-sky-100 mb-3 flex items-center gap-2">
            <span>💡</span> How do you earn chests?
          </h3>
          <p className="text-xs font-semibold text-sky-700 dark:text-sky-300 uppercase tracking-wide mb-2">Point Milestones</p>
          <ul className="space-y-1.5 text-sm text-sky-900 dark:text-sky-100 mb-4">
            <li className="flex items-center gap-2"><img src="/content/bronskista.png" alt="Bronze Chest" className="w-6 h-6 object-contain" /><span><strong>Bronze Chest:</strong> 10 – 200 points</span></li>
            <li className="flex items-center gap-2"><img src="/content/silverkista.png" alt="Silver Chest" className="w-6 h-6 object-contain" /><span><strong>Silver Chest:</strong> 300 – 4 000 points</span></li>
            <li className="flex items-center gap-2"><img src="/content/guldkista.png" alt="Gold Chest" className="w-6 h-6 object-contain" /><span><strong>Gold Chest:</strong> 1 000 – 7 000 points</span></li>
            <li className="flex items-center gap-2"><img src="/content/smaragdkista.png" alt="Emerald Chest" className="w-6 h-6 object-contain" /><span><strong>Emerald Chest:</strong> 8 000 – 12 000 points</span></li>
            <li className="flex items-center gap-2"><img src="/content/rubinkista.png" alt="Ruby Chest" className="w-6 h-6 object-contain" /><span><strong>Ruby Chest:</strong> 15 000 – 20 000 points</span></li>
            <li className="flex items-center gap-2"><img src="/content/diamantkista.png" alt="Diamond Chest" className="w-6 h-6 object-contain" /><span><strong>Diamond Chest:</strong> 25 000 – 40 000 points</span></li>
            <li className="flex items-center gap-2"><img src="/content/hemligakista-blurrad.png" alt="Secret Chest" className="w-6 h-6 object-contain" /><span><strong>Secret Chest:</strong> 60 000 – 100 000 points 🔒</span></li>
          </ul>
          <p className="text-xs font-semibold text-sky-700 dark:text-sky-300 uppercase tracking-wide mb-2">Reading Milestones</p>
          <ul className="space-y-1.5 text-sm text-sky-900 dark:text-sky-100 mb-4">
            <li className="flex items-center gap-2"><img src="/content/bronskista.png" alt="Bronze Chest" className="w-6 h-6 object-contain" /><span><strong>Bronze Chest:</strong> 1 – 55 texts</span></li>
            <li className="flex items-center gap-2"><img src="/content/silverkista.png" alt="Silver Chest" className="w-6 h-6 object-contain" /><span><strong>Silver Chest:</strong> 12 – 90 texts</span></li>
            <li className="flex items-center gap-2"><img src="/content/guldkista.png" alt="Gold Chest" className="w-6 h-6 object-contain" /><span><strong>Gold Chest:</strong> 30 – 125 texts</span></li>
            <li className="flex items-center gap-2"><img src="/content/smaragdkista.png" alt="Emerald Chest" className="w-6 h-6 object-contain" /><span><strong>Emerald Chest:</strong> 150 – 200 texts</span></li>
            <li className="flex items-center gap-2"><img src="/content/rubinkista.png" alt="Ruby Chest" className="w-6 h-6 object-contain" /><span><strong>Ruby Chest:</strong> 250 – 300 texts</span></li>
            <li className="flex items-center gap-2"><img src="/content/diamantkista.png" alt="Diamond Chest" className="w-6 h-6 object-contain" /><span><strong>Diamond Chest:</strong> 400 – 500 texts</span></li>
            <li className="flex items-center gap-2"><img src="/content/hemligakista-blurrad.png" alt="Secret Chest" className="w-6 h-6 object-contain" /><span><strong>Secret Chest:</strong> 750 – 1 000 texts 🔒</span></li>
          </ul>
          <div className="flex items-start gap-2 text-sm text-sky-900 dark:text-sky-100 pt-2 border-t border-sky-200 dark:border-slate-700">
            <span>🎁</span>
            <span><strong>Mystery Chest:</strong> Random chance after each text!</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-sky-900 dark:text-sky-100 pt-2">
            <span>🛒</span>
            <span><strong>Shop items:</strong> Silver chests and above can contain a free avatar or frame from the shop — the rarer the chest, the rarer the item!</span>
          </div>
        </section>
      </main>

      {rewardResult && (
        <RewardPopup
          result={rewardResult}
          onClose={() => setRewardResult(null)}
        />
      )}
    </div>
  );
};
