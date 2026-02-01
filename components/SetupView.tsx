import React, { useState } from 'react';
import { TOPICS, TEXT_TYPES, TextType } from '../types';
import { LEVEL_DESCRIPTIONS } from '../utils/levelCalculator';

interface SetupViewProps {
  onStart: (topic: string, level: number, textType: TextType) => void;
  userLevel?: number;
}

export const SetupView: React.FC<SetupViewProps> = ({ onStart, userLevel }) => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState(userLevel || 4);
  const [textType, setTextType] = useState<TextType>(TextType.NARRATIVE);

  const handleStart = () => {
    let selectedTopic = topic;

    // If "Slumpa fram en text" is selected, pick a random topic
    if (selectedTopic === "🎲 Slumpa fram en text") {
      const otherTopics = TOPICS.filter(t => t !== "🎲 Slumpa fram en text");
      selectedTopic = otherTopics[Math.floor(Math.random() * otherTopics.length)];
    }

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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {TOPICS.map((t) => {
              const isRandomOption = t === "🎲 Slumpa fram en text";
              const isSelected = topic === t;

              return (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  className={`p-3 rounded-xl text-sm font-bold transition-all ${
                    isSelected
                      ? isRandomOption
                        ? 'bg-gradient-to-br from-orange-400 to-pink-400 text-gray-900 shadow-md border-4 border-orange-500'
                        : 'bg-indigo-600 text-white shadow-md'
                      : isRandomOption
                        ? 'bg-gradient-to-br from-orange-100 to-pink-100 text-orange-700 hover:from-orange-200 hover:to-pink-200 border-4 border-orange-300 shadow-lg'
                        : 'bg-slate-100 text-slate-600 hover:bg-indigo-50'
                  }`}
                >
                  {t}
                </button>
              );
            })}
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

          {/* Reading Tips */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👀</span>
                <span className="text-slate-700 font-medium">Läs noga</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🛑</span>
                <span className="text-slate-700 font-medium">Stanna när du inte förstår</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🧠</span>
                <span className="text-slate-700 font-medium">Försök förstå även det som inte står rakt ut</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔍</span>
                <span className="text-slate-700 font-medium">Ta reda på ord du inte förstår</span>
              </div>
            </div>
          </div>

          {/* Selected Level Display */}
          <div className="text-center mb-4">
            <div className="text-6xl font-black text-indigo-900">{level}</div>
          </div>

          {/* Slider */}
          <div className="relative mb-4 px-2">
            <input
              type="range"
              min="1"
              max="20"
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="w-full h-5 bg-slate-200 rounded-full appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${((level - 1) / 19) * 100}%, #e2e8f0 ${((level - 1) / 19) * 100}%, #e2e8f0 100%)`
              }}
            />
            <div className="flex justify-between mt-3 px-0.5 text-xs text-slate-700 font-extrabold">
              <span className="w-3 text-center">1</span>
              <span className="w-3 text-center">2</span>
              <span className="w-3 text-center">3</span>
              <span className="w-3 text-center">4</span>
              <span className="w-3 text-center">5</span>
              <span className="w-3 text-center">6</span>
              <span className="w-3 text-center">7</span>
              <span className="w-3 text-center">8</span>
              <span className="w-3 text-center">9</span>
              <span className="w-3 text-center">10</span>
              <span className="w-3 text-center">11</span>
              <span className="w-3 text-center">12</span>
              <span className="w-3 text-center">13</span>
              <span className="w-3 text-center">14</span>
              <span className="w-3 text-center">15</span>
              <span className="w-3 text-center">16</span>
              <span className="w-3 text-center">17</span>
              <span className="w-3 text-center">18</span>
              <span className="w-3 text-center">19</span>
              <span className="w-3 text-center">20</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={!topic}
          className="w-full py-5 px-6 rounded-xl bg-green-600 text-white font-extrabold text-2xl shadow-lg hover:bg-green-700 hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:bg-gray-300"
        >
          Starta läsningen
        </button>
      </div>
    </div>
  );
};