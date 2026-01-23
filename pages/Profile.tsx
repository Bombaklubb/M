import React from 'react';
import { User } from '../types';
import { BadgeDisplay } from '../components/BadgeDisplay';
import { LEVEL_DESCRIPTIONS } from '../utils/levelCalculator';

interface ProfileProps {
  user: User;
  onClose: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onClose }) => {
  return (
    <div className="min-h-screen bg-sky-50 p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-slate-800">Min profil</h1>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow font-medium"
          >
            Stäng
          </button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Level */}
          <div className="bg-white rounded-2xl p-6 text-center shadow-md border-b-4 border-indigo-200">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-3xl font-black text-indigo-600">{user.currentLevel}</div>
            <div className="text-sm font-bold text-slate-600">Nivå</div>
          </div>

          {/* Points */}
          <div className="bg-white rounded-2xl p-6 text-center shadow-md border-b-4 border-yellow-200">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-3xl font-black text-yellow-600">{user.totalPoints}</div>
            <div className="text-sm font-bold text-slate-600">Poäng</div>
          </div>

          {/* Texts */}
          <div className="bg-white rounded-2xl p-6 text-center shadow-md border-b-4 border-green-200">
            <div className="text-4xl mb-2">📚</div>
            <div className="text-3xl font-black text-green-600">{user.completedTexts}</div>
            <div className="text-sm font-bold text-slate-600">Texter</div>
          </div>

          {/* Streak */}
          <div className="bg-white rounded-2xl p-6 text-center shadow-md border-b-4 border-orange-200">
            <div className="text-4xl mb-2">🔥</div>
            <div className="text-3xl font-black text-orange-600">{user.streak}</div>
            <div className="text-sm font-bold text-slate-600">Dagar i rad</div>
          </div>
        </div>

        {/* Level info */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <h2 className="text-xl font-bold text-slate-800 mb-3">Din nivå</h2>
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-3xl font-black text-indigo-600">{user.currentLevel}</span>
            </div>
            <div>
              <div className="font-bold text-slate-700 mb-1">
                {LEVEL_DESCRIPTIONS[user.currentLevel]}
              </div>
              <div className="text-sm text-slate-500">
                Få 80% rätt för att gå upp en nivå, under 50% för att gå ner.
              </div>
            </div>
          </div>

          {/* Level progress bar */}
          <div className="mt-4">
            <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-teal-500 transition-all duration-500"
                style={{ width: `${(user.currentLevel / 20) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>Nivå 1 (Åk 1)</span>
              <span>Nivå 10 (Åk 4)</span>
              <span>Nivå 20 (Åk 9)</span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Mina märken ({user.badges.length})
          </h2>
          <BadgeDisplay badges={user.badges} />
        </div>
      </div>
    </div>
  );
};
