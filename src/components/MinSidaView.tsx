import React, { useState } from 'react';
import AppHeader from './AppHeader';
import CollectionView from './CollectionView';
import Achievements from './Achievements';
import StudentResults from './StudentResults';

type Tab = 'collection' | 'achievements' | 'results';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'collection',   label: 'Samling',       icon: '🏅' },
  { id: 'achievements', label: 'Utmärkelser',   icon: '🏆' },
  { id: 'results',      label: 'Resultat',      icon: '📊' },
];

export default function MinSidaView() {
  const [activeTab, setActiveTab] = useState<Tab>('collection');

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg,#0f2027,#203a43,#2c5364)' }}>
      <AppHeader />

      {/* Stars */}
      {Array.from({ length: 24 }, (_, i) => (
        <div key={i} className="fixed rounded-full bg-white pointer-events-none"
          style={{
            width: `${1 + (i * 7 % 2)}px`, height: `${1 + (i * 7 % 2)}px`,
            top: `${(i * 37 + 5) % 100}%`, left: `${(i * 53 + 11) % 100}%`,
            opacity: 0.3 + (i % 5) * 0.07,
          }} />
      ))}

      {/* Tab bar – fixed below the header */}
      <div className="fixed top-12 left-0 right-0 z-40 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto flex">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-bold transition-colors
                ${activeTab === tab.id
                  ? 'text-amber-400 border-b-2 border-amber-400'
                  : 'text-white/50 hover:text-white/80'
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
        {activeTab === 'collection'   && <CollectionView  hideHeader />}
        {activeTab === 'achievements' && <Achievements     hideHeader />}
        {activeTab === 'results'      && <StudentResults   hideHeader />}
      </div>
    </div>
  );
}
