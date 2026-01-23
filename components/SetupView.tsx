import React, { useState } from 'react';
import { TOPICS } from '../types';
import { Button } from './Button';

interface SetupViewProps {
  onStart: (topic: string, level: number) => void;
}

export const SetupView: React.FC<SetupViewProps> = ({ onStart }) => {
  const [topic, setTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [level, setLevel] = useState(3);

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
            2. Välj svårighetsgrad
          </label>
          <div className="flex justify-between items-center bg-slate-100 p-2 rounded-2xl">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`w-12 h-12 md:w-16 md:h-16 rounded-xl flex flex-col items-center justify-center transition-all ${
                  level === lvl 
                    ? 'bg-teal-500 text-white shadow-lg scale-110' 
                    : 'text-slate-400 hover:text-teal-600'
                }`}
              >
                <span className="text-xl md:text-2xl font-black">{lvl}</span>
                <span className="text-[10px] md:text-xs font-bold uppercase">
                  {lvl === 1 ? 'Lätt' : lvl === 5 ? 'Svår' : ''}
                </span>
              </button>
            ))}
          </div>
          <p className="text-center text-slate-500 text-sm mt-3 font-medium">
            {level === 1 && "Korta texter, enkla ord. Perfekt för nybörjare!"}
            {level === 2 && "Lite längre meningar, men fortfarande enkelt."}
            {level === 3 && "Lagom svårt. En blandning av korta och långa meningar."}
            {level === 4 && "Mer text och några kluriga ord."}
            {level === 5 && "Lång text med svårare ord och djupare mening."}
          </p>
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