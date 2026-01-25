import React, { useState } from 'react';
import {
  CardGameTextType,
  CardGameLevel,
  CARD_GAME_TEXT_TYPES,
  CARD_GAME_LEVELS
} from '../../types';

interface CardGameSetupViewProps {
  onStart: (textType: CardGameTextType, level: CardGameLevel) => void;
  onBack: () => void;
}

export const CardGameSetupView: React.FC<CardGameSetupViewProps> = ({
  onStart,
  onBack
}) => {
  const [textType, setTextType] = useState<CardGameTextType>(CardGameTextType.NARRATIVE);
  const [level, setLevel] = useState<CardGameLevel>(CardGameLevel.B);

  const handleStart = () => {
    onStart(textType, level);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-900 mb-4">
          🃏 Textkortlek
        </h1>
        <p className="text-xl text-slate-600">
          Dra kort och bygg din egen text!
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-indigo-100 space-y-8">
        {/* Text Type Selection */}
        <div>
          <label className="block text-lg font-bold text-slate-700 mb-3">
            1. Välj texttyp
          </label>
          <div className="grid grid-cols-2 gap-3">
            {CARD_GAME_TEXT_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setTextType(type.value)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  textType === type.value
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="text-2xl mb-1">{type.icon}</div>
                <div className="font-bold text-sm">{type.label}</div>
                <div className={`text-xs mt-1 ${
                  textType === type.value ? 'text-indigo-200' : 'text-slate-400'
                }`}>
                  {type.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Level Selection */}
        <div>
          <label className="block text-lg font-bold text-slate-700 mb-3">
            2. Välj nivå
          </label>
          <div className="grid grid-cols-3 gap-3">
            {CARD_GAME_LEVELS.map((lvl) => (
              <button
                key={lvl.value}
                onClick={() => setLevel(lvl.value)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  level === lvl.value
                    ? 'bg-teal-600 text-white border-teal-600 shadow-lg'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300'
                }`}
              >
                <div className="text-2xl font-black mb-1">{lvl.value}</div>
                <div className="font-bold text-sm">{lvl.grades}</div>
                <div className={`text-xs mt-1 ${
                  level === lvl.value ? 'text-teal-200' : 'text-slate-400'
                }`}>
                  {lvl.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-slate-50 rounded-xl p-4">
          <h3 className="font-bold text-slate-700 mb-2">Ditt val:</h3>
          <p className="text-slate-600">
            <strong>{CARD_GAME_TEXT_TYPES.find(t => t.value === textType)?.label}</strong>
            {' '} på {' '}
            <strong>nivå {level}</strong>
            {' '}({CARD_GAME_LEVELS.find(l => l.value === level)?.grades})
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Du får {level === CardGameLevel.A ? '6' : level === CardGameLevel.B ? '9' : '12'} kort
            och {level === CardGameLevel.A ? '1' : '2'} byten.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-4 px-6 rounded-xl bg-slate-200 text-slate-700 font-bold text-lg hover:bg-slate-300 transition-colors"
          >
            Tillbaka
          </button>
          <button
            onClick={handleStart}
            className="flex-2 py-4 px-6 rounded-xl bg-green-600 text-white font-extrabold text-lg shadow-lg hover:bg-green-700 hover:shadow-xl transform hover:scale-105 transition-all"
          >
            Dra kort!
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-white/80 rounded-2xl p-6 text-sm text-slate-600">
        <h3 className="font-bold text-slate-800 mb-3">Så här fungerar det:</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>Du får kort med olika typer av instruktioner och idéer</li>
          <li>Använd korten för att bygga upp din text</li>
          <li>Du kan byta ut kort du inte gillar (max {level === CardGameLevel.A ? '1' : '2'} gånger)</li>
          <li>Skriv din text och lämna in för feedback</li>
          <li>Du får tips på vad som är bra och vad du kan förbättra</li>
        </ol>
      </div>
    </div>
  );
};
