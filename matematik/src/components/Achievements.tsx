import AppHeader from './AppHeader';
import React from 'react';
import { useApp } from '../contexts/AppContext';
import { ACHIEVEMENTS, RARITY_LABELS, RARITY_COLORS } from '../data/achievements';
import { COLLECTION_ITEMS, RARITY_COLORS as COL_COLORS, RARITY_LABELS as COL_LABELS } from '../data/collection';
import { getAchievements, getAppMinutes } from '../utils/storage';
import { getCollection } from '../utils/questStorage';
import { WORLDS } from '../data/worlds';

// Rarity visual config – used for both section headers and cards
const RARITY_STYLE = {
  common: {
    header: 'bg-gray-100 border border-gray-300 text-gray-600',
    divider: 'bg-gradient-to-r from-gray-300/60 to-transparent',
    card: 'bg-white border border-gray-200 shadow-md',
    glow: '',
    iconBg: 'bg-gradient-to-br from-gray-300 to-slate-400',
    dot: 'bg-gray-400',
    label: 'text-gray-500',
  },
  rare: {
    header: 'bg-blue-50 border border-blue-300 text-blue-700 shadow-[0_0_12px_rgba(59,130,246,0.25)]',
    divider: 'bg-gradient-to-r from-blue-400/60 to-transparent',
    card: 'bg-white border border-blue-200 shadow-[0_4px_20px_rgba(59,130,246,0.18)]',
    glow: 'ring-1 ring-blue-300/60',
    iconBg: 'bg-gradient-to-br from-blue-400 to-cyan-500',
    dot: 'bg-blue-400',
    label: 'text-blue-600',
  },
  epic: {
    header: 'bg-purple-50 border border-purple-300 text-purple-700 shadow-[0_0_16px_rgba(147,51,234,0.3)]',
    divider: 'bg-gradient-to-r from-purple-500/60 to-transparent',
    card: 'bg-white border border-purple-200 shadow-[0_4px_24px_rgba(147,51,234,0.2)]',
    glow: 'ring-1 ring-purple-300/60',
    iconBg: 'bg-gradient-to-br from-purple-500 to-violet-600',
    dot: 'bg-purple-500',
    label: 'text-purple-600',
  },
  legendary: {
    header: 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-400 text-amber-700 shadow-[0_0_20px_rgba(251,191,36,0.4)]',
    divider: 'bg-gradient-to-r from-amber-400/70 to-transparent',
    card: 'bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-300 shadow-[0_4px_28px_rgba(251,191,36,0.3)]',
    glow: 'ring-1 ring-amber-300/70',
    iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
    dot: 'bg-amber-400',
    label: 'text-amber-600',
  },
} as const;

type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export default function Achievements({ hideHeader }: { hideHeader?: boolean }) {
  const { currentStudent, setView, getStudentStats } = useApp();
  if (!currentStudent) return null;

  const earned = getAchievements(currentStudent.id);
  const earnedIds = new Set(earned.map(a => a.achievementId));
  const stats = getStudentStats(currentStudent);

  // Collection: unlocked via quests OR via stat conditions
  const questUnlocked = getCollection(currentStudent.id);
  const isItemUnlocked = (item: typeof COLLECTION_ITEMS[0]) =>
    questUnlocked.includes(item.id) || item.statUnlock(stats);

  const unlockedItems = COLLECTION_ITEMS.filter(isItemUnlocked).length;

  const totalUnlocked = earned.length + unlockedItems;
  const totalPossible = ACHIEVEMENTS.length + COLLECTION_ITEMS.length;
  const pct = (totalUnlocked / totalPossible) * 100;

  const storedMins = getAppMinutes(currentStudent.id);
  const sessionStart = sessionStorage.getItem('math_session_start');
  const sessionMins = sessionStart ? Math.floor((Date.now() - parseInt(sessionStart)) / 60000) : 0;
  const totalMins = storedMins + sessionMins;
  const timeLabel = totalMins >= 60
    ? `${Math.floor(totalMins / 60)} t ${totalMins % 60} min`
    : `${totalMins} min`;

  const byRarity = ['common', 'rare', 'epic', 'legendary'] as const;

  return (
    <div className={`min-h-screen ${hideHeader ? 'bg-transparent' : 'bg-gray-50'}`}>
      {!hideHeader && <AppHeader />}

      {/* Header */}
      {!hideHeader && (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white pt-16 pb-8 px-4">
          <div className="max-w-lg mx-auto">
            <button
              onClick={() => setView('my-results')}
              className="text-white/70 hover:text-white text-sm mb-4 block transition-colors cursor-pointer"
            >
              ← Mina resultat
            </button>
            <h1 className="text-2xl font-black tracking-tight">🏆 Utmärkelser & Samling</h1>
            <p className="text-white/75 mt-1 text-sm">{totalUnlocked} av {totalPossible} upplåsta</p>
            {/* Progress bar */}
            <div className="mt-3 h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background: 'linear-gradient(90deg, #a78bfa, #f9a8d4, #fbbf24)',
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-lg mx-auto px-4 py-6 space-y-10">

        {/* ── MÄRKEN / ACHIEVEMENTS ──────────────────────────────────────── */}
        <section>
          {/* Min tid i appen */}
          <div className="mb-4 rounded-2xl px-4 py-3 flex items-center gap-3"
            style={{
              background: 'rgba(255,237,213,0.80)',
              border: '1.5px solid rgba(251,146,60,0.50)',
              boxShadow: '0 2px 10px rgba(251,146,60,0.15)',
            }}>
            <span className="text-2xl">⏱</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#ea580c' }}>Min tid i appen</p>
              <p className="text-xl font-black" style={{ color: '#7c2d12' }}>{timeLabel}</p>
            </div>
          </div>

          <h2 className="text-base font-black text-gray-700 mb-5 flex items-center gap-2">
            🎖️ Märken
            <span className="text-sm font-normal text-gray-400">({earned.length}/{ACHIEVEMENTS.length})</span>
          </h2>

          <div className="space-y-7">
            {byRarity.map(rarity => {
              const style = RARITY_STYLE[rarity];
              const group = ACHIEVEMENTS.filter(a => a.rarity === rarity);
              const earnedCount = group.filter(a => earnedIds.has(a.id)).length;
              return (
                <div key={rarity}>
                  {/* Section header */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${style.header} ${rarity === 'legendary' ? 'animate-pulse' : ''}`}>
                      {RARITY_LABELS[rarity]}
                    </span>
                    <span className={`text-sm font-semibold ${style.label}`}>
                      {earnedCount}/{group.length}
                    </span>
                    <div className={`flex-1 h-px ${style.divider} rounded-full`} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {group.map(ach => {
                      const isEarned = earnedIds.has(ach.id);
                      const earnedEntry = earned.find(e => e.achievementId === ach.id);
                      return (
                        <div
                          key={ach.id}
                          className={`rounded-2xl p-4 transition-all duration-300 ${
                            isEarned
                              ? `${style.card} ${style.glow} ${rarity === 'legendary' ? 'animate-[legendaryPulse_3s_ease-in-out_infinite]' : ''}`
                              : 'bg-gray-100 border border-gray-200 opacity-50 grayscale'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Icon */}
                            <div className={`text-2xl flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                              isEarned
                                ? `bg-gradient-to-br ${ach.color} shadow-md`
                                : 'bg-gray-200'
                            }`}>
                              {isEarned ? ach.icon : '🔒'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`font-bold text-sm leading-tight ${isEarned ? 'text-gray-800' : 'text-gray-400'}`}>
                                {ach.title}
                              </p>
                              <p className={`text-xs mt-0.5 leading-tight ${isEarned ? 'text-gray-500' : 'text-gray-400'}`}>
                                {ach.description}
                              </p>
                              {isEarned && earnedEntry && (
                                <p className="text-xs text-green-600 mt-1 font-medium">
                                  ✓ {new Date(earnedEntry.earnedAt).toLocaleDateString('sv-SE')}
                                </p>
                              )}
                              {!isEarned && <AchievementHint ach={ach} stats={stats} />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── SAMLAROBJEKT / COLLECTION ─────────────────────────────────── */}
        <section>
          <h2 className="text-base font-black text-gray-700 mb-5 flex items-center gap-2">
            🏅 Samlarobjekt
            <span className="text-sm font-normal text-gray-400">({unlockedItems}/{COLLECTION_ITEMS.length})</span>
          </h2>

          <div className="space-y-7">
            {byRarity.map(rarity => {
              const style = RARITY_STYLE[rarity as Rarity];
              const group = COLLECTION_ITEMS.filter(i => i.rarity === rarity);
              if (group.length === 0) return null;
              const unlockedInGroup = group.filter(isItemUnlocked).length;
              return (
                <div key={rarity}>
                  {/* Section header */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${style.header} ${rarity === 'legendary' ? 'animate-pulse' : ''}`}>
                      {COL_LABELS[rarity]}
                    </span>
                    <span className={`text-sm font-semibold ${style.label}`}>
                      {unlockedInGroup}/{group.length}
                    </span>
                    <div className={`flex-1 h-px ${style.divider} rounded-full`} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {group.map(item => {
                      const unlocked = isItemUnlocked(item);
                      const world = WORLDS.find(w => w.id === item.worldId);
                      return (
                        <div
                          key={item.id}
                          className={`rounded-2xl p-4 transition-all duration-300 ${
                            unlocked
                              ? `${style.card} ${style.glow}`
                              : 'bg-gray-100 border border-gray-200 opacity-50 grayscale'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center text-xl shadow-md ${
                              unlocked
                                ? `bg-gradient-to-br ${COL_COLORS[item.rarity]}`
                                : 'bg-gray-200'
                            }`}>
                              {unlocked ? item.emoji : '🔒'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`font-bold text-sm leading-tight ${unlocked ? 'text-gray-800' : 'text-gray-400'}`}>
                                {unlocked ? item.name : '???'}
                              </p>
                              <p className={`text-xs mt-0.5 leading-tight ${unlocked ? 'text-gray-500' : 'text-gray-400'}`}>
                                {unlocked ? item.description : item.unlockCondition}
                              </p>
                              {unlocked && (
                                <p className="text-xs text-green-600 mt-1 font-medium flex items-center gap-1">
                                  ✓ {world?.emoji} {world?.name.split(' ')[0]}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}

function AchievementHint({ ach, stats }: {
  ach: typeof ACHIEVEMENTS[0];
  stats: ReturnType<ReturnType<typeof useApp>['getStudentStats']>
}) {
  const RIMLIGHET_IDS = ['rimlighetsoevningar-lag','rimlighetsoevningar-mel','rimlighetsoevningar-hog','rimlighetsoevningar-gym'];
  const rimlighetDone = RIMLIGHET_IDS.filter(id => stats.progress.some(p => p.topicId === id && p.completed)).length;
  const perfectCount = stats.progress.filter(p => p.bestScore === 100).length;

  const hints: Record<string, string> = {
    'first-exercise':       `${stats.totalAnswered}/1 svar`,
    'ten-correct':          `${stats.totalCorrect}/10 rätt`,
    'hundred-correct':      `${stats.totalCorrect}/100 rätt`,
    'thousand-correct':     `${stats.totalCorrect}/1000 rätt`,
    'first-topic':          `${stats.completedTopics}/1 ämne`,
    'three-topics':         `${stats.completedTopics}/3 ämnen`,
    'five-topics':          `${stats.completedTopics}/5 ämnen`,
    'ten-topics':           `${stats.completedTopics}/10 ämnen`,
    'all-topics':           `${stats.completedTopics}/${stats.totalTopics} ämnen`,
    'streak-3':             `${stats.points.streak}/3 dagar`,
    'streak-7':             `${stats.points.streak}/7 dagar`,
    'streak-30':            `${stats.points.streak}/30 dagar`,
    'level-5':              `Nivå ${stats.points.level}/5`,
    'level-8':              `Nivå ${stats.points.level}/8`,
    'level-max':            `Nivå ${stats.points.level}/10`,
    'rimlighetsprövaren':   `${rimlighetDone}/1 rimlighetsövning`,
    'veckostjärna':         `${stats.points.weeklyPoints}/100 veckopoäng`,
    'logikdetektiven':      `${rimlighetDone}/2 rimlighetsövningar`,
    'femdagarsmästaren':    `${stats.daysActive}/5 dagar`,
    'perfektion-trio':      `${perfectCount}/3 perfekta`,
    'veckolegenden':        `${stats.points.weeklyPoints}/300 veckopoäng`,
    'rimlighetsmästaren':   `${rimlighetDone}/3 rimlighetsövningar`,
    'tio-dagar':            `${stats.daysActive}/10 dagar`,
    'fullständig-rimlighet':`${rimlighetDone}/4 rimlighetsövningar`,
    'månadsaktiv':          `${stats.daysActive}/30 dagar`,
  };
  const hint = hints[ach.id];
  if (!hint) return null;
  return <p className="text-xs text-blue-400/80 mt-1 font-medium">{hint}</p>;
}
