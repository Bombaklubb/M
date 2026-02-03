import React, { useState, useEffect } from 'react';
import { getTextCountByGrade } from '../services/libraryService';

interface SetupViewProps {
  onSelectGrade: (grade: number) => void;
  completedByGrade: Record<number, number>;
}

const GRADE_INFO: Record<number, { emoji: string; color: string }> = {
  1: { emoji: '🌱', color: 'from-green-400 to-green-500' },
  2: { emoji: '🌿', color: 'from-green-500 to-teal-500' },
  3: { emoji: '🌳', color: 'from-teal-400 to-cyan-500' },
  4: { emoji: '🎯', color: 'from-cyan-400 to-blue-500' },
  5: { emoji: '🚀', color: 'from-blue-400 to-indigo-500' },
  6: { emoji: '⭐', color: 'from-indigo-400 to-purple-500' },
  7: { emoji: '🔥', color: 'from-purple-400 to-pink-500' },
  8: { emoji: '💎', color: 'from-pink-400 to-rose-500' },
  9: { emoji: '👑', color: 'from-rose-400 to-red-500' },
};

export const SetupView: React.FC<SetupViewProps> = ({
  onSelectGrade,
  completedByGrade,
}) => {
  const [textCounts, setTextCounts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTextCountByGrade().then((counts) => {
      setTextCounts(counts);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📚</div>
          <p className="text-xl text-slate-600">Laddar texter...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-900 mb-4">
          Välj årskurs
        </h1>
        <p className="text-xl text-slate-600">
          Vilken nivå vill du träna på idag?
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((grade) => {
          const info = GRADE_INFO[grade];
          const available = textCounts[grade] || 0;
          const completed = completedByGrade[grade] || 0;
          const hasTexts = available > 0;

          return (
            <button
              key={grade}
              onClick={() => hasTexts && onSelectGrade(grade)}
              disabled={!hasTexts}
              className={`relative p-6 rounded-2xl transition-all transform ${
                hasTexts
                  ? `bg-gradient-to-br ${info.color} text-white shadow-lg hover:shadow-xl hover:scale-105`
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <div className="text-4xl mb-2">{info.emoji}</div>
              <div className="text-2xl font-bold">Åk {grade}</div>
              <div className="text-sm opacity-90 mt-1">
                {hasTexts ? `${available} texter` : 'Inga texter'}
              </div>
              {completed > 0 && (
                <div className="absolute top-2 right-2 bg-white/30 rounded-full px-2 py-0.5 text-xs font-bold">
                  {completed} lästa
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
        <h3 className="font-bold text-blue-900 mb-2">💡 Tips för läsning</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>👀 Läs texten noggrant innan du svarar</li>
          <li>🔍 Leta efter ledtrådar i texten</li>
          <li>🧠 Tänk efter vad texten verkligen säger</li>
          <li>✨ Du kan alltid läsa texten igen!</li>
        </ul>
      </div>
    </div>
  );
};
