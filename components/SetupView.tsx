import React, { useState } from 'react';
import { TOPICS } from '../types';
import { Button } from './Button';

interface SetupViewProps {
  onStart: (topic: string, level: number) => void;
}

export const SetupView: React.FC<SetupViewProps> = ({ onStart }) => {
  const [topic, setTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [level, setLevel] = useState(7);

  const handleStart = () => {
    const selectedTopic = customTopic.trim() || topic;
    if (selectedTopic) {
      onStart(selectedTopic, level);
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

        {/* Level Selection */}
        <div>
          <label className="block text-lg font-bold text-slate-700 mb-3">
            2. Välj svårighetsgrad (Årskurs 1-9)
          </label>

          {/* Level slider */}
          <div className="bg-slate-100 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="text-center">
                <div className="text-4xl font-black text-teal-600">{level}</div>
                <div className="text-xs font-bold text-slate-600 mt-1">
                  Årskurs {Math.ceil(level <= 2 ? 1 : level <= 4 ? 2 : level <= 6 ? 3 : level <= 8 ? 4 : level <= 11 ? 5 : level <= 13 ? 6 : level <= 16 ? 7 : level <= 18 ? 8 : 9)}
                </div>
              </div>
              <div className="flex-1 mx-6">
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={level}
                  onChange={(e) => setLevel(Number(e.target.value))}
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  style={{
                    background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${((level - 1) / 19) * 100}%, #e2e8f0 ${((level - 1) / 19) * 100}%, #e2e8f0 100%)`
                  }}
                />
              </div>
            </div>

            {/* Quick select buttons */}
            <div className="flex justify-between gap-2 mt-4">
              <button
                onClick={() => setLevel(1)}
                className="flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-white hover:bg-teal-50 transition-colors"
              >
                Åk 1
              </button>
              <button
                onClick={() => setLevel(3)}
                className="flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-white hover:bg-teal-50 transition-colors"
              >
                Åk 2
              </button>
              <button
                onClick={() => setLevel(5)}
                className="flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-white hover:bg-teal-50 transition-colors"
              >
                Åk 3
              </button>
              <button
                onClick={() => setLevel(7)}
                className="flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-white hover:bg-teal-50 transition-colors"
              >
                Åk 4
              </button>
              <button
                onClick={() => setLevel(9)}
                className="flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-white hover:bg-teal-50 transition-colors"
              >
                Åk 5
              </button>
              <button
                onClick={() => setLevel(12)}
                className="flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-white hover:bg-teal-50 transition-colors"
              >
                Åk 6
              </button>
              <button
                onClick={() => setLevel(14)}
                className="flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-white hover:bg-teal-50 transition-colors"
              >
                Åk 7
              </button>
              <button
                onClick={() => setLevel(17)}
                className="flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-white hover:bg-teal-50 transition-colors"
              >
                Åk 8
              </button>
              <button
                onClick={() => setLevel(19)}
                className="flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-white hover:bg-teal-50 transition-colors"
              >
                Åk 9
              </button>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleStart} 
          fullWidth 
          disabled={!topic && !customTopic}
          className="text-xl py-4"
        >
          🚀 Starta äventyret!
        </Button>
      </div>
    </div>
  );
};