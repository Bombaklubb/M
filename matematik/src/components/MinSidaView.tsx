import React, { useState } from 'react';
import AppHeader from './AppHeader';
import Achievements from './Achievements';
import StudentResults from './StudentResults';
import AvatarPicker from './AvatarPicker';
import { useApp } from '../contexts/AppContext';
import { ALL_AVATARS } from '../data/avatars';
import { GRADE_LABELS } from '../types';

type Tab = 'achievements' | 'results';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'achievements', label: 'Utmärkelser', icon: '🏆' },
  { id: 'results',      label: 'Resultat',    icon: '📊' },
];

export default function MinSidaView() {
  const { currentStudent } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('achievements');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const avatarEmoji = currentStudent
    ? (ALL_AVATARS[currentStudent.avatar] ?? ALL_AVATARS[0])
    : '🦁';

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

      {/* Profile header – sits directly below AppHeader (top-12) */}
      {currentStudent && (
        <div className="fixed top-12 left-0 right-0 z-40 bg-black/60 backdrop-blur-md border-b border-white/10">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
            {/* Clickable avatar */}
            <button
              onClick={() => setShowAvatarPicker(true)}
              className="relative group flex-shrink-0"
              title="Byt avatar"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-4xl
                group-hover:bg-white/20 group-hover:scale-105 transition-all ring-2 ring-white/20 group-hover:ring-amber-400">
                {avatarEmoji}
              </div>
              {/* Edit hint */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center shadow-md
                text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                ✏️
              </div>
            </button>

            {/* Info */}
            <div className="min-w-0">
              <p className="text-white font-black text-base leading-tight truncate">{currentStudent.name}</p>
              <p className="text-white/60 text-xs">{GRADE_LABELS[currentStudent.grade]}</p>
              <p className="text-amber-400 text-xs mt-0.5">Tryck på avataren för att byta</p>
            </div>
          </div>

          {/* Tab bar */}
          <div className="max-w-4xl mx-auto flex border-t border-white/10">
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
      )}

      {/* Content – padded to clear header (48px) + profile+tab bar (~116px) */}
      <div className="pt-[164px]">
        {activeTab === 'achievements' && <Achievements  hideHeader />}
        {activeTab === 'results'      && <StudentResults hideHeader />}
      </div>

      {/* Avatar picker modal */}
      {showAvatarPicker && (
        <AvatarPicker onClose={() => setShowAvatarPicker(false)} />
      )}
    </div>
  );
}
