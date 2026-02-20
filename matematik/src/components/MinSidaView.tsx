import React, { useState } from 'react';
import AppHeader from './AppHeader';
import QuestView from './QuestView';
import CollectionView from './CollectionView';
import Achievements from './Achievements';
import StudentResults from './StudentResults';

type Tab = 'quest' | 'collection' | 'achievements' | 'results';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'quest',        label: 'Äventyr',      icon: '⚔️' },
  { id: 'collection',   label: 'Samling',       icon: '🏅' },
  { id: 'achievements', label: 'Utmärkelser',   icon: '🏆' },
  { id: 'results',      label: 'Resultat',      icon: '📊' },
];

export default function MinSidaView() {
  const [activeTab, setActiveTab] = useState<Tab>('quest');

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />

      {/* Tab bar – fixed below the header */}
      <div className="fixed top-12 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto flex">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-bold transition-colors
                ${activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <span className="text-lg leading-none">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content – padded to clear header (48px) + tab bar (~52px) */}
      <div className="pt-[104px]">
        {activeTab === 'quest'        && <QuestView       hideHeader />}
        {activeTab === 'collection'   && <CollectionView  hideHeader />}
        {activeTab === 'achievements' && <Achievements     hideHeader />}
        {activeTab === 'results'      && <StudentResults   hideHeader />}
      </div>
    </div>
  );
}
