import React, { useState } from 'react';
import AppHeader from './AppHeader';
import Achievements from './Achievements';
import StudentResults from './StudentResults';
import AvatarPicker from './AvatarPicker';
import CollectionView from './CollectionView';
import { useApp } from '../contexts/AppContext';
import { ALL_AVATARS } from '../data/avatars';
import { GRADE_LABELS } from '../types';
import { getPoints, initPoints } from '../utils/storage';

type Tab = 'achievements' | 'results' | 'collection';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'achievements', label: 'Utmärkelser', icon: '🏆' },
  { id: 'results',      label: 'Resultat',    icon: '📊' },
  { id: 'collection',   label: 'Samling',     icon: '🏅' },
];

export default function MinSidaView() {
  const { currentStudent } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('achievements');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  if (!currentStudent) return null;

  const avatarEmoji = ALL_AVATARS[currentStudent.avatar] ?? ALL_AVATARS[0];
  const points = getPoints(currentStudent.id) ?? initPoints(currentStudent.id);
  const aktivSedan = currentStudent.createdAt?.split('T')[0] ?? '';
  const senastAktiv = points.lastActiveDate || new Date().toISOString().split('T')[0];

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

      {/* Content below fixed AppHeader */}
      <div className="relative pt-14 max-w-lg mx-auto px-4">

        {/* Profile card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-5 mt-4 mb-4 flex items-center gap-4">
          <button
            onClick={() => setShowAvatarPicker(true)}
            className="relative group flex-shrink-0"
            title="Byt avatar"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-4xl
              group-hover:bg-white/20 group-hover:scale-105 transition-all ring-2 ring-white/20 group-hover:ring-amber-400">
              {avatarEmoji}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center
              text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
              ✏️
            </div>
          </button>

          <div className="min-w-0">
            <p className="text-white font-black text-xl leading-tight truncate">{currentStudent.name}</p>
            <p className="text-white/60 text-sm">{GRADE_LABELS[currentStudent.grade]}</p>
            {aktivSedan && <p className="text-white/50 text-xs mt-0.5">Aktiv sedan {aktivSedan}</p>}
            <p className="text-white/50 text-xs">Senast aktiv: {senastAktiv}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/10 rounded-2xl overflow-hidden mb-4">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-colors
                ${activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'text-white/50 hover:text-white/80'
                }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="pb-12">
          {activeTab === 'achievements' && <Achievements hideHeader />}
          {activeTab === 'results'      && <StudentResults hideHeader />}
          {activeTab === 'collection'   && <CollectionView hideHeader />}
        </div>
      </div>

      {showAvatarPicker && (
        <AvatarPicker onClose={() => setShowAvatarPicker(false)} />
      )}
    </div>
  );
}
