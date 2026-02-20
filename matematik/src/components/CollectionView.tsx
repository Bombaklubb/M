import AppHeader from './AppHeader';
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { COLLECTION_ITEMS, RARITY_COLORS, RARITY_LABELS } from '../data/collection';
import { WORLDS } from '../data/worlds';
import { getCollection } from '../utils/questStorage';
import { gradeToNum } from '../data/topics';

export default function CollectionView({ hideHeader }: { hideHeader?: boolean }) {
  const { currentStudent, setView } = useApp();
  const [filter, setFilter] = useState<string>('all');

  if (!currentStudent) return null;

  const unlocked = getCollection(currentStudent.id);
  const worlds = WORLDS;
  const filters = ['all', ...worlds.map(w => w.id)];

  const filteredItems = filter === 'all'
    ? COLLECTION_ITEMS
    : COLLECTION_ITEMS.filter(i => i.worldId === filter);

  const unlockedCount = COLLECTION_ITEMS.filter(i => unlocked.includes(i.id)).length;
  const totalCount = COLLECTION_ITEMS.length;
  const pct = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideHeader && <AppHeader />}
      {/* Header */}
      <div className={`bg-gradient-to-r from-amber-500 to-orange-600 text-white ${hideHeader ? 'pt-4' : 'pt-16'} pb-6 px-4`}>
        <div className="max-w-lg mx-auto">
          {!hideHeader && <button onClick={() => setView('dashboard')} className="text-white/70 hover:text-white text-sm mb-3 block">← Tillbaka</button>}
          <h1 className="text-2xl font-black">🏅 Min Samling</h1>
          <p className="text-white/80 text-sm mt-1">{unlockedCount}/{totalCount} upplåsta ({pct}%)</p>

          {/* Progress bar */}
          <div className="mt-3 h-2.5 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className={`bg-white border-b border-gray-100 px-4 ${hideHeader ? '' : 'sticky top-0 z-10'}`}>
        <div className="max-w-lg mx-auto flex gap-2 overflow-x-auto py-3">
          {filters.map(f => {
            const world = worlds.find(w => w.id === f);
            return (
              <button key={f} onClick={() => setFilter(f)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                  filter === f ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {f === 'all' ? '🌍 Alla' : `${world?.emoji} ${world?.name.split(' ')[0]}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-lg mx-auto px-4 py-5">
        <div className="grid grid-cols-2 gap-4">
          {filteredItems.map(item => {
            const isUnlocked = unlocked.includes(item.id);
            const world = worlds.find(w => w.id === item.worldId);
            return (
              <div key={item.id}
                className={`rounded-2xl p-4 text-center transition-all ${
                  isUnlocked
                    ? 'bg-white shadow-md'
                    : 'bg-gray-100 opacity-60'
                }`}>
                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-4xl mb-3 ${
                  isUnlocked
                    ? `bg-gradient-to-br ${RARITY_COLORS[item.rarity]} shadow-lg`
                    : 'bg-gray-200'
                }`}>
                  {isUnlocked ? item.emoji : '🔒'}
                </div>

                <p className={`font-black text-sm ${isUnlocked ? 'text-gray-800' : 'text-gray-400'}`}>
                  {isUnlocked ? item.name : '???'}
                </p>

                <div className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r ${RARITY_COLORS[item.rarity]} text-white`}>
                  {RARITY_LABELS[item.rarity]}
                </div>

                {isUnlocked ? (
                  <p className="text-gray-500 text-xs mt-2 leading-tight">{item.description}</p>
                ) : (
                  <p className="text-gray-400 text-xs mt-2 leading-tight">{item.unlockCondition}</p>
                )}

                <div className="mt-2 flex items-center justify-center gap-1">
                  <span className="text-xs">{world?.emoji}</span>
                  <span className="text-xs text-gray-400">{world?.name.split(' ')[0]}</span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <p className="text-4xl mb-2">🏅</p>
            <p>Inga föremål för detta filter.</p>
          </div>
        )}

        {/* Tip */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
          <p className="text-amber-800 text-sm font-bold">💡 Hur låser du upp?</p>
          <p className="text-amber-600 text-xs mt-1">Slutför Äventyr för att vinna unika samlarobjekt!</p>
          <button onClick={() => setView('quest')}
            className="mt-3 bg-amber-500 text-white font-bold text-sm py-2 px-5 rounded-xl hover:bg-amber-400 transition-colors">
            ⚔️ Gå till Äventyr
          </button>
        </div>
      </div>
    </div>
  );
}
