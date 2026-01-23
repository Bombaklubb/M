import React from 'react';
import { Badge } from '../types';

interface BadgeDisplayProps {
  badges: Badge[];
  compact?: boolean;
}

export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ badges, compact = false }) => {
  if (badges.length === 0) {
    return (
      <div className="text-center py-6 text-slate-400">
        <div className="text-4xl mb-2">🏅</div>
        <p className="text-sm">Inga badges än. Fortsätt läsa för att tjäna dina första!</p>
      </div>
    );
  }

  return (
    <div className={`grid ${compact ? 'grid-cols-4 gap-2' : 'grid-cols-3 md:grid-cols-5 gap-4'}`}>
      {badges.map((badge, index) => (
        <div
          key={index}
          className={`${
            compact ? 'p-2' : 'p-4'
          } bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 text-center hover:scale-105 transition-transform`}
          title={badge.description}
        >
          <div className={`${compact ? 'text-2xl' : 'text-4xl'} mb-1`}>{badge.icon}</div>
          {!compact && (
            <>
              <div className="text-xs font-bold text-slate-700">{badge.name}</div>
              <div className="text-[10px] text-slate-500 mt-1">{badge.description}</div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

interface BadgeNotificationProps {
  badge: Badge;
  onClose: () => void;
}

export const BadgeNotification: React.FC<BadgeNotificationProps> = ({ badge, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-8 max-w-sm text-center shadow-2xl animate-bounceIn">
        <div className="text-7xl mb-4 animate-bounce">{badge.icon}</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Nytt märke!</h2>
        <h3 className="text-xl font-bold text-indigo-600 mb-2">{badge.name}</h3>
        <p className="text-slate-600 mb-6">{badge.description}</p>
        <button
          onClick={onClose}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-bold hover:shadow-lg transition-shadow"
        >
          Fortsätt!
        </button>
      </div>
    </div>
  );
};
