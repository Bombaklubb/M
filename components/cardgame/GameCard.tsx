import React from 'react';
import { GameCard as GameCardType, CardType } from '../../types';

interface GameCardProps {
  card: GameCardType;
  onSwap?: (cardId: string) => void;
  canSwap?: boolean;
  isSwapping?: boolean;
}

const CARD_TYPE_STYLES: Record<CardType, { border: string; bg: string; badge: string; badgeBg: string }> = {
  [CardType.STRUCTURE]: {
    border: 'border-l-blue-500',
    bg: 'bg-blue-50',
    badge: 'text-blue-700',
    badgeBg: 'bg-blue-100'
  },
  [CardType.LANGUAGE]: {
    border: 'border-l-purple-500',
    bg: 'bg-purple-50',
    badge: 'text-purple-700',
    badgeBg: 'bg-purple-100'
  },
  [CardType.CONTENT]: {
    border: 'border-l-green-500',
    bg: 'bg-green-50',
    badge: 'text-green-700',
    badgeBg: 'bg-green-100'
  },
  [CardType.CHALLENGE]: {
    border: 'border-l-orange-500',
    bg: 'bg-orange-50',
    badge: 'text-orange-700',
    badgeBg: 'bg-orange-100'
  }
};

const CARD_TYPE_LABELS: Record<CardType, string> = {
  [CardType.STRUCTURE]: 'Struktur',
  [CardType.LANGUAGE]: 'Språk',
  [CardType.CONTENT]: 'Innehåll',
  [CardType.CHALLENGE]: 'Utmaning'
};

export const GameCard: React.FC<GameCardProps> = ({
  card,
  onSwap,
  canSwap = false,
  isSwapping = false
}) => {
  const styles = CARD_TYPE_STYLES[card.type];

  return (
    <div
      className={`
        relative bg-white rounded-xl shadow-md border-l-4 ${styles.border}
        p-4 transition-all duration-200
        ${isSwapping ? 'animate-pulse opacity-50' : ''}
        ${canSwap && onSwap ? 'hover:shadow-lg hover:scale-[1.02]' : ''}
      `}
    >
      {/* Badge */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${styles.badge} ${styles.badgeBg}`}>
          {CARD_TYPE_LABELS[card.type]}
        </span>
        {canSwap && onSwap && (
          <button
            onClick={() => onSwap(card.id)}
            disabled={isSwapping}
            className="text-xs text-slate-400 hover:text-indigo-600 transition-colors p-1 rounded hover:bg-slate-100"
            title="Byt kort"
          >
            🔄
          </button>
        )}
      </div>

      {/* Category */}
      <div className="text-sm font-bold text-slate-700 mb-1">
        {card.category}
      </div>

      {/* Content */}
      <div className="text-sm text-slate-600">
        {card.content}
      </div>

      {/* Description (if exists) */}
      {card.description && (
        <div className="text-xs text-slate-400 mt-2 italic">
          {card.description}
        </div>
      )}
    </div>
  );
};
