import AppHeader from './AppHeader';
import React from 'react';
import { useApp } from '../contexts/AppContext';
import { ACHIEVEMENTS, RARITY_LABELS, RARITY_COLORS } from '../data/achievements';
import { COLLECTION_ITEMS, RARITY_COLORS as COL_COLORS, RARITY_LABELS as COL_LABELS } from '../data/collection';
import { getAchievements } from '../utils/storage';
import { getCollection } from '../utils/questStorage';
import { WORLDS } from '../data/worlds';

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

  const byRarity = ['legendary', 'epic', 'rare', 'common'] as const;

  return (
    <div className={`min-h-screen ${hideHeader ? 'bg-transparent' : 'bg-gray-50'}`}>
      {!hideHeader && <AppHeader />}

      {/* Header */}
      <div className={`bg-gradient-to-r from-purple-600 to-indigo-700 text-white ${hideHeader ? 'pt-4' : 'pt-16'} pb-8 px-4`}>
        <div className="max-w-lg mx-auto">
          {!hideHeader && (
            <button onClick={() => setView('my-results')} className="text-white/80 hover:text-white text-sm mb-4 block">
              ← Mina resultat
            </button>
          )}
          <h1 className="text-2xl font-black">🏆 Utmärkelser & Samling</h1>
          <p className="text-white/80 mt-1">{totalUnlocked} av {totalPossible} upplåsta</p>
          <div className="h-3 bg-white/30 rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${(totalUnlocked / totalPossible) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-8">

        {/* ── MÄRKEN / ACHIEVEMENTS ──────────────────────────────────────── */}
        <section>
          <h2 className="text-base font-black text-gray-700 mb-4 flex items-center gap-2">
            🎖️ Märken
            <span className="text-sm font-normal text-gray-400">({earned.length}/{ACHIEVEMENTS.length})</span>
          </h2>

          <div className="space-y-6">
            {byRarity.map(rarity => {
              const group = ACHIEVEMENTS.filter(a => a.rarity === rarity);
              return (
                <div key={rarity}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${RARITY_COLORS[rarity]}`}>
                      {RARITY_LABELS[rarity]}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {group.filter(a => earnedIds.has(a.id)).length}/{group.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {group.map(ach => {
                      const isEarned = earnedIds.has(ach.id);
                      const earnedEntry = earned.find(e => e.achievementId === ach.id);
                      return (
                        <div
                          key={ach.id}
                          className={`rounded-2xl p-4 transition-all ${
                            isEarned
                              ? 'bg-white border border-gray-200 shadow-md'
                              : 'bg-gray-100 border border-gray-200 opacity-60'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`text-3xl ${isEarned ? '' : 'grayscale'}`}>
                              {isEarned ? ach.icon : '🔒'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`font-bold text-sm ${isEarned ? 'text-gray-800' : 'text-gray-500'}`}>
                                {ach.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5 leading-tight">
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
          <h2 className="text-base font-black text-gray-700 mb-4 flex items-center gap-2">
            🏅 Samlarobjekt
            <span className="text-sm font-normal text-gray-400">({unlockedItems}/{COLLECTION_ITEMS.length})</span>
          </h2>

          <div className="space-y-6">
            {byRarity.map(rarity => {
              const group = COLLECTION_ITEMS.filter(i => i.rarity === rarity);
              if (group.length === 0) return null;
              const unlockedInGroup = group.filter(isItemUnlocked).length;
              return (
                <div key={rarity}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${RARITY_COLORS[rarity]}`}>
                      {COL_LABELS[rarity]}
                    </span>
                    <span className="text-gray-400 text-sm">{unlockedInGroup}/{group.length}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {group.map(item => {
                      const unlocked = isItemUnlocked(item);
                      const world = WORLDS.find(w => w.id === item.worldId);
                      return (
                        <div
                          key={item.id}
                          className={`rounded-2xl p-4 transition-all ${
                            unlocked
                              ? 'bg-white border border-gray-200 shadow-md'
                              : 'bg-gray-100 border border-gray-200 opacity-60'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center text-2xl ${
                              unlocked
                                ? `bg-gradient-to-br ${COL_COLORS[item.rarity]} shadow`
                                : 'bg-gray-200'
                            }`}>
                              {unlocked ? item.emoji : '🔒'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`font-bold text-sm ${unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                                {unlocked ? item.name : '???'}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5 leading-tight">
                                {unlocked ? item.description : item.unlockCondition}
                              </p>
                              {unlocked && (
                                <p className="text-xs text-green-600 mt-1 font-medium flex items-center gap-1">
                                  ✓ Upplåst · {world?.emoji} {world?.name.split(' ')[0]}
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
  const hints: Record<string, string> = {
    'first-exercise': `${stats.totalAnswered}/1 svar`,
    'ten-correct':    `${stats.totalCorrect}/10 rätt`,
    'hundred-correct': `${stats.totalCorrect}/100 rätt`,
    'thousand-correct': `${stats.totalCorrect}/1000 rätt`,
    'first-topic':    `${stats.completedTopics}/1 ämne`,
    'three-topics':   `${stats.completedTopics}/3 ämnen`,
    'five-topics':    `${stats.completedTopics}/5 ämnen`,
    'ten-topics':     `${stats.completedTopics}/10 ämnen`,
    'all-topics':     `${stats.completedTopics}/${stats.totalTopics} ämnen`,
    'streak-3':       `${stats.points.streak}/3 dagar`,
    'streak-7':       `${stats.points.streak}/7 dagar`,
    'streak-30':      `${stats.points.streak}/30 dagar`,
    'level-5':        `Nivå ${stats.points.level}/5`,
    'level-8':        `Nivå ${stats.points.level}/8`,
    'level-max':      `Nivå ${stats.points.level}/10`,
  };
  const hint = hints[ach.id];
  if (!hint) return null;
  return <p className="text-xs text-gray-400 mt-1">{hint}</p>;
}
