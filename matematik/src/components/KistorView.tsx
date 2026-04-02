import React, { useState, useEffect } from 'react';
import AppHeader from './AppHeader';
import { useApp } from '../contexts/AppContext';
import {
  loadGamification, saveGamification,
  CHEST_META, MATH_BADGES, BOSS_UNLOCK_THRESHOLD, getMathBadge,
  openWoodChest, openSilverChest, openGoldChest,
  openRubinChest, openSmaragdChest, openDiamantChest,
} from '../utils/chestStorage';
import { addPoints, getPoints, initPoints } from '../utils/storage';
import type { MattChest, MattGamificationData, ChestType } from '../types';

// ─── Trophy Shelf ─────────────────────────────────────────────────────────────

const SHELF_ROWS: { type: ChestType; label: string; gradient: string; glow: string; shelfBg: string }[] = [
  {
    type: 'diamant',
    label: 'Diamantkistor',
    gradient: 'from-cyan-300 via-blue-400 to-violet-500',
    glow: 'rgba(99,202,247,0.65)',
    shelfBg: 'linear-gradient(135deg, #0c1445 0%, #1e3a8a 40%, #312e81 100%)',
  },
  {
    type: 'smaragd',
    label: 'Smaragdkistor',
    gradient: 'from-emerald-300 via-green-400 to-teal-500',
    glow: 'rgba(52,211,153,0.55)',
    shelfBg: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 100%)',
  },
  {
    type: 'rubin',
    label: 'Rubinkistor',
    gradient: 'from-red-400 via-rose-400 to-pink-500',
    glow: 'rgba(239,68,68,0.5)',
    shelfBg: 'linear-gradient(135deg, #4c0519 0%, #881337 40%, #9f1239 100%)',
  },
  {
    type: 'gold',
    label: 'Guldkistor',
    gradient: 'from-yellow-300 via-amber-400 to-yellow-500',
    glow: 'rgba(251,191,36,0.55)',
    shelfBg: 'linear-gradient(135deg, #78350f 0%, #92400e 40%, #b45309 100%)',
  },
  {
    type: 'silver',
    label: 'Silverkistor',
    gradient: 'from-slate-300 via-slate-200 to-slate-400',
    glow: 'rgba(203,213,225,0.5)',
    shelfBg: 'linear-gradient(135deg, #1e293b 0%, #334155 40%, #475569 100%)',
  },
  {
    type: 'wood',
    label: 'Bronskistor',
    gradient: 'from-amber-700 via-amber-600 to-amber-800',
    glow: 'rgba(180,83,9,0.4)',
    shelfBg: 'linear-gradient(135deg, #431407 0%, #7c2d12 40%, #92400e 100%)',
  },
];

function TrophyShelf({ chests }: { chests: MattChest[] }) {
  const opened = chests.filter(c => c.opened);
  if (opened.length === 0) return null;

  return (
    <div className="space-y-3">
      {SHELF_ROWS.map(row => {
        const rowChests = opened.filter(c => c.type === row.type);
        if (rowChests.length === 0) return null;
        return (
          <div key={row.type} className="relative">
            {/* Shelf panel */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: row.shelfBg,
                boxShadow: `0 8px 32px ${row.glow}, inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -2px 0 rgba(0,0,0,0.3)`,
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              {/* Shelf label */}
              <div className="px-4 pt-3 pb-1 flex items-center justify-between">
                <span className={`text-xs font-black uppercase tracking-widest bg-gradient-to-r ${row.gradient} bg-clip-text text-transparent`}>
                  {row.label}
                </span>
                <span
                  className="text-xs font-black px-2 py-0.5 rounded-full"
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  ×{rowChests.length}
                </span>
              </div>

              {/* Trophies */}
              <div className="flex flex-wrap gap-2 px-4 pb-3 pt-1">
                {rowChests.map((chest, i) => (
                  <div
                    key={chest.id}
                    className="flex flex-col items-center gap-0.5"
                    title={chest.openedReward ?? CHEST_META[chest.type].label}
                    style={{
                      animation: `trophy-appear 0.4s ease-out ${i * 40}ms both`,
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden"
                      style={{
                        background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.25), transparent 60%)`,
                        boxShadow: `0 4px 12px ${row.glow}, inset 0 1px 0 rgba(255,255,255,0.3)`,
                        border: '1px solid rgba(255,255,255,0.2)',
                      }}
                    >
                      <img src={CHEST_META[chest.type].openImage} alt={CHEST_META[chest.type].label} className="w-10 h-10 object-contain" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Shelf edge */}
              <div
                className="h-2 w-full"
                style={{
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(0,0,0,0.3))',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Stat Badge ───────────────────────────────────────────────────────────────

function StatBadge({ emoji, count, label, gradient }: { emoji: string; count: number; label: string; gradient: string }) {
  const isImg = emoji.startsWith('/');
  return (
    <div
      className="flex flex-col items-center gap-1 rounded-2xl px-4 py-3 flex-1 min-w-0"
      style={{
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
      }}
    >
      {isImg
        ? <img src={emoji} alt={label} className="w-8 h-8 object-contain" />
        : <span className="text-2xl">{emoji}</span>
      }
      <span className={`text-xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent tabular-nums`}>
        {count}
      </span>
      <span className="text-white/40 text-[10px] font-bold uppercase tracking-wide text-center leading-tight">{label}</span>
    </div>
  );
}

// ─── Chest Card ───────────────────────────────────────────────────────────────

function ChestCard({ chest, onOpen }: { chest: MattChest; onOpen: (id: string) => void }) {
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

  if (chest.opened) return null; // opened chests go to the trophy shelf

  return (
    <div
      onClick={handleClick}
      className={`relative flex flex-col items-center p-5 rounded-3xl transition-all cursor-pointer select-none bg-gradient-to-br ${meta.gradient} hover:scale-105 active:scale-95`}
      style={{
        border: '2px solid rgba(255,255,255,0.22)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.25)',
        transform: animating ? 'scale(1.08) rotate(-3deg)' : undefined,
        transition: 'transform 0.15s ease-out, box-shadow 0.15s',
      }}
    >
      {/* Shine glare */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.2), transparent 55%)' }}
      />
      <img
        src={meta.image}
        alt={meta.label}
        className="w-20 h-20 object-contain mb-3"
        style={{ animation: animating ? 'chest-shake 0.4s ease-in-out' : 'none' }}
      />
      <span className="text-sm font-bold text-white mb-1">{meta.label}</span>
      <span className="text-xs text-white/70 mt-1">Tryck för att öppna</span>
    </div>
  );
}

// ─── Reward Popup ─────────────────────────────────────────────────────────────

function RewardPopup({ description, chestType, onClose }: { description: string; chestType: ChestType; onClose: () => void }) {
  const meta = CHEST_META[chestType];
  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #120318 0%, #1e0828 35%, #2d0d1e 65%, #160520 100%)',
          border: '3px solid #f59e0b',
          boxShadow: '0 8px 48px rgba(245,158,11,0.45), 0 2px 8px rgba(0,0,0,0.5)',
        }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(245,158,11,0.12), transparent 60%)' }} />
        <div className="flex justify-center mb-1" style={{ animation: 'pop-in 0.4s cubic-bezier(0.36,0.07,0.19,0.97)' }}>
          <img src={meta.image} alt={meta.label} className="w-24 h-24 object-contain" />
        </div>
        <h2 className="text-2xl font-black text-amber-400 mb-1">Kistan är öppnad!</h2>
        <p className="text-white/50 text-xs mb-4">{meta.label}</p>
        <div
          className="rounded-2xl px-4 py-3 mb-6"
          style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)' }}
        >
          <p className="text-base font-bold text-white/90 leading-relaxed">{description}</p>
        </div>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl font-bold text-white text-base transition-all active:scale-95 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            border: '2px solid #d97706',
            boxShadow: '0 4px 16px rgba(217,119,6,0.45)',
          }}
        >
          Toppen! ✓
        </button>
      </div>
    </div>
  );
}

// ─── Mystery Box Popup ────────────────────────────────────────────────────────

function MysteryBoxPopup({ description, onClose }: { description: string; onClose: () => void }) {
  const [opened, setOpened] = useState(false);
  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div
        className="rounded-3xl p-8 max-w-sm w-full text-center"
        style={{
          background: 'linear-gradient(160deg, #120318 0%, #1e0828 35%, #2d0d1e 65%, #160520 100%)',
          border: '3px solid #a855f7',
          boxShadow: '0 8px 40px rgba(168,85,247,0.35)',
        }}
      >
        {!opened ? (
          <>
            <div className="text-7xl mb-4 animate-bounce" style={{ animationDuration: '1s' }}>🎁</div>
            <h2 className="text-2xl font-black text-purple-400 mb-2">Mysterylåda!</h2>
            <p className="text-white/60 mb-6 text-sm">Du hittade en mysterylåda! Klicka för att öppna den.</p>
            <button
              onClick={() => setOpened(true)}
              className="w-full py-3 px-6 rounded-2xl font-bold text-white text-lg transition-all active:scale-95 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)', border: '3px solid #7c3aed' }}
            >
              Öppna lådan!
            </button>
          </>
        ) : (
          <>
            <div className="text-7xl mb-4" style={{ animation: 'pop-in 0.4s cubic-bezier(0.36,0.07,0.19,0.97)' }}>⭐</div>
            <h2 className="text-2xl font-black text-purple-400 mb-2">Du vann!</h2>
            <p className="text-lg font-bold text-white/90 mb-6">{description}</p>
            <button
              onClick={onClose}
              className="w-full py-3 px-6 rounded-2xl font-bold text-white text-base transition-all active:scale-95 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', border: '3px solid #16a34a' }}
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
  const [rewardState, setRewardState] = useState<{ description: string; chestType: ChestType } | null>(null);
  const [mysteryDescription, setMysteryDescription] = useState<string | null>(null);

  useEffect(() => {
    if (currentStudent) setGam(loadGamification(currentStudent.id));
  }, [currentStudent]);

  if (!currentStudent || !gam) return null;

  const unopened = gam.chests.filter(c => !c.opened);
  const opened = gam.chests.filter(c => c.opened);
  const diamantCount = opened.filter(c => c.type === 'diamant').length;
  const smaragdCount = opened.filter(c => c.type === 'smaragd').length;
  const rubinCount   = opened.filter(c => c.type === 'rubin').length;
  const goldCount    = opened.filter(c => c.type === 'gold').length;
  const silverCount  = opened.filter(c => c.type === 'silver').length;
  const woodCount    = opened.filter(c => c.type === 'wood').length;
  const exercisesLeft = Math.max(0, BOSS_UNLOCK_THRESHOLD - gam.exercisesCompleted);

  function handleOpenChest(chestId: string) {
    if (!gam || !currentStudent) return;
    const chest = gam.chests.find(c => c.id === chestId);
    if (!chest || chest.opened) return;

    let result: { points: number; badge?: string; bonusChest?: MattChest; description: string };
    if (chest.type === 'wood') {
      result = { ...openWoodChest() };
    } else if (chest.type === 'silver') {
      result = openSilverChest(gam.badges);
    } else if (chest.type === 'gold') {
      result = openGoldChest(gam.badges);
    } else if (chest.type === 'rubin') {
      result = openRubinChest(gam.badges);
    } else if (chest.type === 'smaragd') {
      result = openSmaragdChest(gam.badges);
    } else {
      result = openDiamantChest(gam.badges);
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
    addPoints(currentStudent.id, result.points);
    setRewardState({ description: result.description, chestType: chest.type });
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(160deg, #120318 0%, #1e0828 35%, #2d0d1e 65%, #160520 100%)' }}
    >
      <AppHeader />

      {/* Hero banner */}
      <div
        className="pt-14 text-white"
        style={{ background: 'linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)' }}
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => setView('dashboard')}
            className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-3 transition-colors cursor-pointer"
          >
            ← Tillbaka
          </button>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-4xl">🏆</span>
            <div>
              <h1 className="text-2xl font-black">Hemliga Kistor</h1>
              <p className="text-white/70 text-sm">Öppna kistor och bygg din troféhylla!</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-1.5 flex-wrap">
            {diamantCount > 0 && <StatBadge emoji="/diamantkista.png" count={diamantCount} label="Diamant" gradient="from-cyan-300 to-violet-500" />}
            {smaragdCount > 0 && <StatBadge emoji="/smaragdkista.png" count={smaragdCount} label="Smaragd" gradient="from-emerald-300 to-teal-500" />}
            {rubinCount   > 0 && <StatBadge emoji="/rubinkista.png"   count={rubinCount}   label="Rubin"   gradient="from-red-400 to-rose-600" />}
            <StatBadge emoji="/guldkista.png"   count={goldCount}        label="Guld"    gradient="from-yellow-300 to-amber-500" />
            <StatBadge emoji="/silverkista.png" count={silverCount}      label="Silver"  gradient="from-slate-200 to-slate-400" />
            <StatBadge emoji="/bronskista.png"  count={woodCount}        label="Brons"   gradient="from-amber-600 to-amber-800" />
            <StatBadge emoji="📬"               count={unopened.length}  label="Väntar"  gradient="from-purple-400 to-violet-500" />
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-8">

        {/* ── Trophy Shelf ─────────────────────────────────── */}
        {opened.length > 0 && (
          <section>
            <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2">
              <span>🏛️</span>
              Troféhylla
              <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-white/15 text-white/70 rounded-full">
                {opened.length} avklarade
              </span>
            </h2>
            <TrophyShelf chests={gam.chests} />
          </section>
        )}

        {/* ── Unopened chests ──────────────────────────────── */}
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
              style={{ border: '2px dashed rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.03)' }}
            >
              <p className="text-5xl mb-3">🏅</p>
              <p className="text-white/50 text-sm">Inga kistor att öppna just nu.</p>
              <p className="text-white/35 text-xs mt-1">Slutför övningar och kapitel för att tjäna fler!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {unopened.map(chest => (
                <ChestCard key={chest.id} chest={chest} onOpen={handleOpenChest} />
              ))}
            </div>
          )}
        </section>

        {/* ── Boss challenge ────────────────────────────────── */}
        <div
          className="rounded-3xl p-5"
          style={{
            background: gam.bossUnlocked
              ? 'linear-gradient(135deg, #7f1d1d, #991b1b, #dc2626)'
              : 'linear-gradient(135deg, #1f2937, #374151)',
            border: `2px solid ${gam.bossUnlocked ? '#ef4444' : '#6b7280'}`,
            boxShadow: gam.bossUnlocked ? '0 6px 24px rgba(239,68,68,0.25)' : 'none',
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
                    : `${exercisesLeft} övning${exercisesLeft !== 1 ? 'ar' : ''} kvar för att låsa upp.`}
                </p>
              </div>
            </div>
            {!gam.bossUnlocked && (
              <div className="text-white/40 text-sm font-medium">
                {gam.exercisesCompleted}/{BOSS_UNLOCK_THRESHOLD}
              </div>
            )}
          </div>
          {!gam.bossUnlocked && (
            <div className="mt-4">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white/40 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (gam.exercisesCompleted / BOSS_UNLOCK_THRESHOLD) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Badges ───────────────────────────────────────── */}
        {gam.badges.length > 0 && (
          <section>
            <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2">
              <span>🎖️</span> Dina märken ({gam.badges.length})
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
                      boxShadow: '0 4px 16px rgba(124,58,237,0.25)',
                    }}
                  >
                    <span className="text-3xl mb-2">{badge.emoji}</span>
                    <span className="text-xs font-bold text-white text-center leading-snug">{badge.label}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Locked badges ────────────────────────────────── */}
        {gam.badges.length < MATH_BADGES.length && (
          <section>
            <h2 className="text-lg font-black text-white/50 mb-4 flex items-center gap-2">
              <span>🔒</span> Låsta märken ({MATH_BADGES.length - gam.badges.length} kvar)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {MATH_BADGES.filter(b => !gam.badges.includes(b.id)).map(badge => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center p-4 rounded-3xl opacity-35"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.1)' }}
                >
                  <span className="text-3xl mb-2" style={{ filter: 'grayscale(1)' }}>{badge.emoji}</span>
                  <span className="text-xs font-bold text-white/50 text-center leading-snug">{badge.label}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── How to earn chests ───────────────────────────── */}
        <section
          className="rounded-3xl p-5"
          style={{ background: 'rgba(59,130,246,0.08)', border: '2px solid rgba(59,130,246,0.2)' }}
        >
          <h3 className="font-bold text-blue-300 mb-4 flex items-center gap-2">
            <span>💡</span> Hur tjänar man kistor?
          </h3>
          <div className="space-y-4">
            {/* helper: radera inline för att hålla lättläst */}
            {(() => {
              const imgStyle: React.CSSProperties = {
                width: '26px', height: '26px',
                objectFit: 'contain', objectPosition: 'center', display: 'block',
              };
              const cellStyle: React.CSSProperties = {
                width: '30px', minWidth: '30px',
              };
              const row = (src: string, alt: string, text: React.ReactNode) => (
                <tr key={src + alt + String(text)} style={{ verticalAlign: 'middle' }}>
                  <td style={cellStyle}><img src={src} alt={alt} style={imgStyle} /></td>
                  <td className="text-sm text-blue-100/80" style={{ paddingBottom: '6px' }}>{text}</td>
                </tr>
              );
              return (
                <>
                  <div>
                    <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2">Avklara kapitel</p>
                    <table style={{ borderCollapse: 'separate', borderSpacing: '0' }}>
                      <tbody>
                        {row('/silverkista.png', 'Silver', <><strong>Silverkista:</strong> Klara ditt allra första kapitel!</>)}
                        {row('/bronskista.png',  'Brons',  <><strong>Bronskista:</strong> Klara ett nytt kapitel för första gången (≥50%)</>)}
                        {row('/silverkista.png', 'Silver', <><strong>Silverkista:</strong> Få 3 stjärnor på ett kapitel för första gången</>)}
                        {row('/silverkista.png', 'Silver', <><strong>Silverkista:</strong> Perfekt poäng (100%) på ett kapitel</>)}
                        {row('/rubinkista.png',  'Rubin',  <><strong>Rubinkista:</strong> Klara alla kapitel i en hel värld!</>)}
                      </tbody>
                    </table>
                  </div>
                  <div className="border-t border-blue-400/20 pt-3">
                    <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2">Poäng-milstolpar</p>
                    <table style={{ borderCollapse: 'separate', borderSpacing: '0' }}>
                      <tbody>
                        {row('/bronskista.png',   'Brons',   <><strong>Bronskista:</strong> 50 – 600 p</>)}
                        {row('/silverkista.png',  'Silver',  <><strong>Silverkista:</strong> 300 – 2 000 p</>)}
                        {row('/guldkista.png',    'Guld',    <><strong>Guldkista:</strong> 1 000 – 2 500 p</>)}
                        {row('/rubinkista.png',   'Rubin',   <><strong>Rubinkista:</strong> 3 500 – 5 000 p</>)}
                        {row('/smaragdkista.png', 'Smaragd', <><strong>Smaragdkista:</strong> 7 000 – 10 000 p</>)}
                        {row('/diamantkista.png', 'Diamant', <><strong>Diamantkista:</strong> 15 000 – 20 000 p</>)}
                      </tbody>
                    </table>
                  </div>
                  <div className="border-t border-blue-400/20 pt-3">
                    <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2">Klarade kapitel (antal)</p>
                    <table style={{ borderCollapse: 'separate', borderSpacing: '0' }}>
                      <tbody>
                        {row('/bronskista.png',   'Brons',   <><strong>Bronskista:</strong> 1 – 10 kapitel</>)}
                        {row('/silverkista.png',  'Silver',  <><strong>Silverkista:</strong> 15 – 40 kapitel</>)}
                        {row('/guldkista.png',    'Guld',    <><strong>Guldkista:</strong> 30 – 60 kapitel</>)}
                        {row('/rubinkista.png',   'Rubin',   <><strong>Rubinkista:</strong> 75 kapitel</>)}
                        {row('/smaragdkista.png', 'Smaragd', <><strong>Smaragdkista:</strong> 100 kapitel</>)}
                        {row('/diamantkista.png', 'Diamant', <><strong>Diamantkista:</strong> 150 kapitel</>)}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-100/80 border-t border-blue-400/20 pt-3">
                    <span className="text-xl flex-shrink-0">🎁</span>
                    <span><strong>Mysterykista:</strong> 25% chans de 5 första kapitlen, 15% därefter!</span>
                  </div>
                </>
              );
            })()}
          </div>
        </section>
      </main>

      {/* Animations */}
      <style>{`
        @keyframes chest-shake {
          0%, 100% { transform: rotate(0deg); }
          20%  { transform: rotate(-8deg) scale(1.05); }
          40%  { transform: rotate(8deg)  scale(1.1);  }
          60%  { transform: rotate(-5deg) scale(1.05); }
          80%  { transform: rotate(5deg); }
        }
        @keyframes pop-in {
          0%   { transform: scale(0.3); opacity: 0; }
          60%  { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); }
        }
        @keyframes trophy-appear {
          0%   { transform: scale(0.5) translateY(6px); opacity: 0; }
          70%  { transform: scale(1.08) translateY(-2px); opacity: 1; }
          100% { transform: scale(1)   translateY(0);    opacity: 1; }
        }
      `}</style>

      {rewardState && (
        <RewardPopup
          description={rewardState.description}
          chestType={rewardState.chestType}
          onClose={() => setRewardState(null)}
        />
      )}

      {mysteryDescription && (
        <MysteryBoxPopup
          description={mysteryDescription}
          onClose={() => setMysteryDescription(null)}
        />
      )}
    </div>
  );
}
