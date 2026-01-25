import React, { useState, useEffect } from 'react';
import {
  CardGameTextType,
  CardGameLevel,
  CardHand,
  Disposition,
  QuickCheck,
  Feedback,
  CardGameState,
  CARD_GAME_TEXT_TYPES,
  CARD_GAME_LEVELS
} from '../../types';
import {
  generateCardHand,
  generateDisposition,
  generateChecklist,
  swapCard,
  analyzeText,
  generateFeedback
} from '../../services/cardGameService';
import { CardHandPanel } from './CardHandPanel';
import { DispositionPanel } from './DispositionPanel';
import { ChecklistPanel } from './ChecklistPanel';
import { WritingArea } from './WritingArea';
import { QuickCheckPanel } from './QuickCheckPanel';
import { FeedbackPanel } from './FeedbackPanel';

interface TextCardGameViewProps {
  textType: CardGameTextType;
  level: CardGameLevel;
  onBack: () => void;
  onNewGame: () => void;
}

export const TextCardGameView: React.FC<TextCardGameViewProps> = ({
  textType,
  level,
  onBack,
  onNewGame
}) => {
  const [gameState, setGameState] = useState<CardGameState>(CardGameState.CARDS_DRAWN);
  const [cardHand, setCardHand] = useState<CardHand | null>(null);
  const [disposition, setDisposition] = useState<Disposition | null>(null);
  const [checklist, setChecklist] = useState<string[]>([]);
  const [studentText, setStudentText] = useState('');
  const [quickCheck, setQuickCheck] = useState<QuickCheck | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [swappingCardId, setSwappingCardId] = useState<string | undefined>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mobileTab, setMobileTab] = useState<'cards' | 'write' | 'feedback'>('cards');

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, [textType, level]);

  const initializeGame = () => {
    const newCardHand = generateCardHand(textType, level);
    setCardHand(newCardHand);
    setDisposition(generateDisposition(newCardHand.cards, textType, level));
    setChecklist(generateChecklist(textType, level));
    setStudentText('');
    setQuickCheck(null);
    setFeedback(null);
    setGameState(CardGameState.CARDS_DRAWN);
    setMobileTab('cards');
  };

  const handleSwapCard = (cardId: string) => {
    if (!cardHand || cardHand.swapsRemaining <= 0) return;

    setSwappingCardId(cardId);

    // Simulate swap animation
    setTimeout(() => {
      const newCardHand = swapCard(cardHand, cardId, textType);
      setCardHand(newCardHand);
      setDisposition(generateDisposition(newCardHand.cards, textType, level));
      setSwappingCardId(undefined);
    }, 300);
  };

  const handleSubmitText = () => {
    if (!cardHand) return;

    setIsAnalyzing(true);
    setGameState(CardGameState.CHECKING);

    // Simulate analysis time
    setTimeout(() => {
      const check = analyzeText(studentText, textType, level, cardHand.cards);
      setQuickCheck(check);
      setFeedback(generateFeedback(check, textType, level));
      setIsAnalyzing(false);
      setGameState(CardGameState.FEEDBACK);
      setMobileTab('feedback');
    }, 800);
  };

  const handleRevise = () => {
    setGameState(CardGameState.WRITING);
    setQuickCheck(null);
    setFeedback(null);
    setMobileTab('write');
  };

  const getTextTypeLabel = () => {
    return CARD_GAME_TEXT_TYPES.find(t => t.value === textType)?.label || '';
  };

  const getLevelLabel = () => {
    const lvl = CARD_GAME_LEVELS.find(l => l.value === level);
    return lvl ? `${lvl.label} (${lvl.grades})` : '';
  };

  if (!cardHand || !disposition) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Blandar korten...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                ← Tillbaka
              </button>
              <div>
                <h1 className="text-lg font-bold text-slate-800">
                  🃏 {getTextTypeLabel()}
                </h1>
                <p className="text-sm text-slate-500">{getLevelLabel()}</p>
              </div>
            </div>
            <button
              onClick={onNewGame}
              className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium hover:bg-indigo-200 transition-colors"
            >
              Nytt spel
            </button>
          </div>
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="md:hidden sticky top-[60px] z-30 bg-white border-b border-slate-200">
        <div className="flex">
          <button
            onClick={() => setMobileTab('cards')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              mobileTab === 'cards'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-slate-500'
            }`}
          >
            🃏 Kort
          </button>
          <button
            onClick={() => setMobileTab('write')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              mobileTab === 'write'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-slate-500'
            }`}
          >
            ✏️ Skriv
          </button>
          <button
            onClick={() => setMobileTab('feedback')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              mobileTab === 'feedback'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-slate-500'
            }`}
          >
            💬 Feedback
          </button>
        </div>
      </div>

      {/* Main content - Desktop 3-column layout */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="hidden md:grid md:grid-cols-12 gap-6">
          {/* Left column - Cards */}
          <div className="col-span-3">
            <div className="sticky top-[80px] max-h-[calc(100vh-100px)] overflow-hidden">
              <CardHandPanel
                cardHand={cardHand}
                onSwapCard={handleSwapCard}
                swappingCardId={swappingCardId}
              />
            </div>
          </div>

          {/* Middle column - Writing area */}
          <div className="col-span-6">
            <DispositionPanel disposition={disposition} />
            <WritingArea
              value={studentText}
              onChange={setStudentText}
              onSubmit={handleSubmitText}
              disabled={isAnalyzing}
            />

            {/* Show feedback below writing area on desktop */}
            {gameState === CardGameState.FEEDBACK && quickCheck && feedback && (
              <div className="mt-6 space-y-6">
                <QuickCheckPanel quickCheck={quickCheck} isAnalyzing={isAnalyzing} />
                <FeedbackPanel feedback={feedback} />

                {/* Action buttons */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Vad vill du göra?</h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleRevise}
                      className="px-5 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                    >
                      ✏️ Revidera texten
                    </button>
                    <button
                      onClick={onNewGame}
                      className="px-5 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors"
                    >
                      🃏 Nytt spel
                    </button>
                  </div>
                  {cardHand.swapsRemaining > 0 && (
                    <p className="text-sm text-slate-500 mt-3">
                      Du har {cardHand.swapsRemaining} byte{cardHand.swapsRemaining !== 1 ? 'n' : ''} kvar om du vill byta kort.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right column - Checklist */}
          <div className="col-span-3">
            <div className="sticky top-[80px]">
              <ChecklistPanel checklist={checklist} />
            </div>
          </div>
        </div>

        {/* Mobile content */}
        <div className="md:hidden">
          {mobileTab === 'cards' && (
            <div className="pb-20">
              <CardHandPanel
                cardHand={cardHand}
                onSwapCard={handleSwapCard}
                swappingCardId={swappingCardId}
              />
            </div>
          )}

          {mobileTab === 'write' && (
            <div className="pb-20 space-y-4">
              <DispositionPanel disposition={disposition} />
              <ChecklistPanel checklist={checklist} />
              <WritingArea
                value={studentText}
                onChange={setStudentText}
                onSubmit={handleSubmitText}
                disabled={isAnalyzing}
                minHeight={200}
              />
            </div>
          )}

          {mobileTab === 'feedback' && (
            <div className="pb-20 space-y-4">
              {gameState === CardGameState.FEEDBACK && quickCheck && feedback ? (
                <>
                  <QuickCheckPanel quickCheck={quickCheck} isAnalyzing={isAnalyzing} />
                  <FeedbackPanel feedback={feedback} />

                  {/* Action buttons */}
                  <div className="bg-white rounded-2xl shadow-md p-5">
                    <h3 className="font-bold text-slate-800 mb-3">Vad vill du göra?</h3>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={handleRevise}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                      >
                        ✏️ Revidera texten
                      </button>
                      <button
                        onClick={onNewGame}
                        className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors"
                      >
                        🃏 Nytt spel
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-2xl shadow-md p-6 text-center">
                  <p className="text-slate-500">
                    Skriv och lämna in din text för att få feedback!
                  </p>
                  <button
                    onClick={() => setMobileTab('write')}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium"
                  >
                    Börja skriva
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile floating submit button */}
      <div className="md:hidden fixed bottom-4 left-4 right-4">
        {mobileTab === 'write' && gameState !== CardGameState.FEEDBACK && (
          <button
            onClick={handleSubmitText}
            disabled={isAnalyzing || studentText.trim().length < 10}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${
              isAnalyzing || studentText.trim().length < 10
                ? 'bg-slate-300'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isAnalyzing ? 'Analyserar...' : '✅ Lämna in texten'}
          </button>
        )}
      </div>
    </div>
  );
};
