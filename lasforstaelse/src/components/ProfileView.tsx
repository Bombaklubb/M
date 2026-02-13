import React, { useState } from 'react';
import { User, BADGE_DEFINITIONS, BadgeType } from '../types';
import { AvatarPicker } from './AvatarPicker';

interface ProfileViewProps {
  user: User;
  onClose: () => void;
  onAvatarChange?: (avatar: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onClose, onAvatarChange }) => {
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const allBadgeTypes = Object.values(BadgeType);
  const earnedBadgeTypes = user.badges.map((b) => b.type);

  const handleAvatarSelect = (avatar: string) => {
    if (onAvatarChange) {
      onAvatarChange(avatar);
    }
    setShowAvatarPicker(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border-b-8 border-indigo-100 dark:border-indigo-900 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-indigo-900 dark:text-indigo-300">Min profil</h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-slate-500 dark:text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* User info */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowAvatarPicker(true)}
            className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-4 hover:ring-4 hover:ring-purple-300 dark:hover:ring-purple-600 transition-all group relative"
            title="Klicka för att byta avatar"
          >
            <span className="text-5xl">{user.avatar || '👤'}</span>
            <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm font-medium">Byt</span>
            </div>
          </button>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{user.name}</h2>
          <p className="text-slate-500 dark:text-slate-400">Medlem sedan {new Date(user.createdAt).toLocaleDateString('sv-SE')}</p>
        </div>

        {/* Avatar Picker Modal */}
        {showAvatarPicker && (
          <AvatarPicker
            selectedAvatar={user.avatar || '🦊'}
            onSelect={handleAvatarSelect}
            onClose={() => setShowAvatarPicker(false)}
            isModal={true}
          />
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border-2 border-yellow-200 dark:border-yellow-700 rounded-xl p-4 text-center">
            <span className="text-3xl">⭐</span>
            <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{user.totalPoints}</div>
            <div className="text-sm text-yellow-600 dark:text-yellow-400">Poäng</div>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-200 dark:border-indigo-700 rounded-xl p-4 text-center">
            <span className="text-3xl">📖</span>
            <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{user.completedTexts.length}</div>
            <div className="text-sm text-indigo-600 dark:text-indigo-400">Texter</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/30 border-2 border-purple-200 dark:border-purple-700 rounded-xl p-4 text-center">
            <span className="text-3xl">🏅</span>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{user.badges.length}</div>
            <div className="text-sm text-purple-600 dark:text-purple-400">Utmärkelser</div>
          </div>
        </div>

        {/* Grades completed */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-3">Årskurser</h3>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((grade) => {
              const completed = user.gradesCompleted.includes(grade);
              return (
                <div
                  key={grade}
                  className={`px-4 py-2 rounded-full font-bold ${
                    completed
                      ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-2 border-green-300 dark:border-green-700'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 border-2 border-slate-200 dark:border-slate-600'
                  }`}
                >
                  {grade === 10 ? 'Gymnasiet' : `Åk ${grade}`} {completed && '✓'}
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges */}
        <div>
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-3">Utmärkelser</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {allBadgeTypes.map((badgeType) => {
              const badgeDef = BADGE_DEFINITIONS[badgeType];
              const earned = earnedBadgeTypes.includes(badgeType);
              const earnedBadge = user.badges.find((b) => b.type === badgeType);

              return (
                <div
                  key={badgeType}
                  className={`p-3 rounded-xl border-2 text-center ${
                    earned
                      ? 'bg-white dark:bg-slate-700 border-purple-300 dark:border-purple-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 opacity-50'
                  }`}
                >
                  <div className={`text-3xl mb-1 ${!earned && 'grayscale'}`}>
                    {badgeDef.icon}
                  </div>
                  <div className="font-bold text-sm text-slate-800 dark:text-slate-200">{badgeDef.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{badgeDef.description}</div>
                  {earnedBadge && (
                    <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                      {new Date(earnedBadge.earnedAt).toLocaleDateString('sv-SE')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full mt-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition"
        >
          Stäng
        </button>
      </div>
    </div>
  );
};
