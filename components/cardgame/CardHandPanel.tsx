import React from 'react';
import { CardHand } from '../../types';
import { GameCard } from './GameCard';

interface CardHandPanelProps {
  cardHand: CardHand;
  onSwapCard: (cardId: string) => void;
  swappingCardId?: string;
}

export const CardHandPanel: React.FC<CardHandPanelProps> = ({
  cardHand,
  onSwapCard,
  swappingCardId
}) => {
  const canSwap = cardHand.swapsRemaining > 0;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span>🃏</span>
          Kort på handen
        </h2>
        <div className={`text-sm font-medium px-3 py-1 rounded-full ${
          canSwap ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
        }`}>
          {cardHand.swapsRemaining} byten kvar
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 -mr-2">
        {cardHand.cards.map((card) => (
          <GameCard
            key={card.id}
            card={card}
            onSwap={onSwapCard}
            canSwap={canSwap}
            isSwapping={swappingCardId === card.id}
          />
        ))}
      </div>

      {/* Swap info */}
      {canSwap && (
        <div className="mt-4 pt-3 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            Klicka på 🔄 för att byta ett kort
          </p>
        </div>
      )}
    </div>
  );
};
