import React, { useState } from 'react';
import { TOPICS } from '../types';
import { Button } from './Button';
import { LEVEL_DESCRIPTIONS } from '../utils/levelCalculator';

interface SetupViewProps {
  onStart: (topic: string, level: number) => void;
}

export const SetupView: React.FC<SetupViewProps> = ({ onStart }) => {
  const [topic, setTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [level, setLevel] = useState(10);

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
          📚 LäsHjälpen
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
            2. Välj svårighetsgrad (nivå 1-20)
          </label>

          {/* Level Display */}
          <div className="bg-gradient-to-br from-teal-500 to-indigo-600 rounded-2xl p-6 mb-4 text-center">
            <div className="text-5xl font-black text-white mb-2">{level}</div>
            <div className="text-white font-bold text-lg">{LEVEL_DESCRIPTIONS[level]}</div>
          </div>

          {/* Slider */}
          <div className="relative">
            <input
              type="range"
              min="1"
              max="20"
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${((level - 1) / 19) * 100}%, #e2e8f0 ${((level - 1) / 19) * 100}%, #e2e8f0 100%)`
              }}
            />
            <div className="flex justify-between mt-2 text-xs text-slate-500 font-medium">
              <span>Nivå 1<br/>(Åk 1)</span>
              <span>Nivå 10<br/>(Åk 4)</span>
              <span>Nivå 20<br/>(Åk 9)</span>
            </div>
          </div>

          {/* Quick Select Buttons */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <button onClick={() => setLevel(2)} className="px-3 py-1 text-xs bg-slate-100 hover:bg-indigo-100 rounded-full font-medium transition">Åk 1</button>
            <button onClick={() => setLevel(4)} className="px-3 py-1 text-xs bg-slate-100 hover:bg-indigo-100 rounded-full font-medium transition">Åk 2</button>
            <button onClick={() => setLevel(6)} className="px-3 py-1 text-xs bg-slate-100 hover:bg-indigo-100 rounded-full font-medium transition">Åk 3</button>
            <button onClick={() => setLevel(9)} className="px-3 py-1 text-xs bg-slate-100 hover:bg-indigo-100 rounded-full font-medium transition">Åk 4</button>
            <button onClick={() => setLevel(12)} className="px-3 py-1 text-xs bg-slate-100 hover:bg-indigo-100 rounded-full font-medium transition">Åk 5</button>
            <button onClick={() => setLevel(15)} className="px-3 py-1 text-xs bg-slate-100 hover:bg-indigo-100 rounded-full font-medium transition">Åk 6</button>
            <button onClick={() => setLevel(17)} className="px-3 py-1 text-xs bg-slate-100 hover:bg-indigo-100 rounded-full font-medium transition">Åk 7</button>
            <button onClick={() => setLevel(19)} className="px-3 py-1 text-xs bg-slate-100 hover:bg-indigo-100 rounded-full font-medium transition">Åk 8</button>
            <button onClick={() => setLevel(20)} className="px-3 py-1 text-xs bg-slate-100 hover:bg-indigo-100 rounded-full font-medium transition">Åk 9</button>
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