import React, { useState } from 'react';
import { TOPICS, TEXT_TYPES, TextType } from '../types';
import { LEVEL_DESCRIPTIONS } from '../utils/levelCalculator';

interface SetupViewProps {
  onStart: (topic: string, level: number, textType: TextType) => void;
  userLevel?: number;
}

export const SetupView: React.FC<SetupViewProps> = ({ onStart, userLevel }) => {
  const [topic, setTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [level, setLevel] = useState(userLevel || 4);
  const [textType, setTextType] = useState<TextType>(TextType.NARRATIVE);

  const handleStart = () => {
    const selectedTopic = customTopic.trim() || topic;
    if (selectedTopic) {
      onStart(selectedTopic, level, textType);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-extrabold text-indigo-900 mb-4">
          📚 Läs och lär
        </h1>
        <p className="text-xl text-slate-600">
          Din smarta läskompis. Vad vill du läsa om idag?
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-indigo-100 space-y-8">
        {/* Topic Selection */}
        <div>
          <label className="block text-lg font-bold text-slate-700 mb-3">
            1. Välj ett ämne
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {TOPICS.map((t) => (
              <button
                key={t}
                onClick={() => { setTopic(t); setCustomTopic(''); }}
                className={`p-3 rounded-xl text-sm font-bold transition-colors ${
                  topic === t && !customTopic 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-slate-100 text-slate-600 hover:bg-indigo-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Eller skriv eget ämne..."
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              className="w-full p-4 pl-12 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 focus:outline-none transition-colors font-medium text-slate-700"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">✨</span>
          </div>
        </div>

        {/* Text Type Selection */}
        <div>
          <label className="block text-lg font-bold text-slate-700 mb-3">
            2. Välj texttyp
          </label>
          <div className="grid grid-cols-3 gap-3">
            {TEXT_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setTextType(type.value)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  textType === type.value
                    ? 'bg-purple-600 text-white border-purple-600 shadow-lg'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-purple-300'
                }`}
              >
                <div className="text-3xl mb-2">{type.icon}</div>
                <div className="font-bold text-sm">{type.label}</div>
                <div className="text-xs mt-1 opacity-80">{type.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Level Selection */}
        <div>
          <label className="block text-lg font-bold text-slate-700 mb-3">
            3. Välj svårighetsgrad (nivå 1-20)
          </label>

          {/* Level Display */}
          <div className="bg-gradient-to-br from-teal-500 to-indigo-600 rounded-2xl p-8 mb-6 text-center shadow-lg">
            <div className="text-7xl font-black text-white mb-3">{level}</div>
            <div className="text-white font-bold text-xl">{LEVEL_DESCRIPTIONS[level]}</div>
          </div>

          {/* Slider */}
          <div className="relative mb-4">
            <input
              type="range"
              min="1"
              max="20"
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="w-full h-4 bg-slate-200 rounded-full appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${((level - 1) / 19) * 100}%, #e2e8f0 ${((level - 1) / 19) * 100}%, #e2e8f0 100%)`
              }}
            />
            <div className="flex justify-between mt-3 text-sm text-slate-600 font-bold">
              <span>Nivå 1</span>
              <span>Nivå 5</span>
              <span>Nivå 10</span>
              <span>Nivå 15</span>
              <span>Nivå 20</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={!topic && !customTopic}
          className="w-full py-5 px-6 rounded-xl bg-green-600 text-white font-extrabold text-2xl shadow-lg hover:bg-green-700 hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:bg-gray-300"
        >
          Starta läsningen
        </button>
      </div>
    </div>
  );
};