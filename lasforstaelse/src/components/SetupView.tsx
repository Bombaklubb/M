import React, { useState, useEffect } from 'react';
import { getTextCountByGrade } from '../services/libraryService';

interface SetupViewProps {
  onSelectGrade: (grade: number) => void;
  completedByGrade: Record<number, number>;
}

const GRADE_INFO: Record<number, { emoji: string; color: string; hoverColor: string }> = {
  1: { emoji: '🌱', color: 'bg-green-500', hoverColor: 'hover:bg-green-600' },
  2: { emoji: '🌿', color: 'bg-teal-500', hoverColor: 'hover:bg-teal-600' },
  3: { emoji: '🌳', color: 'bg-cyan-500', hoverColor: 'hover:bg-cyan-600' },
  4: { emoji: '🎯', color: 'bg-blue-500', hoverColor: 'hover:bg-blue-600' },
  5: { emoji: '🚀', color: 'bg-indigo-500', hoverColor: 'hover:bg-indigo-600' },
  6: { emoji: '⭐', color: 'bg-purple-500', hoverColor: 'hover:bg-purple-600' },
  7: { emoji: '🔥', color: 'bg-pink-500', hoverColor: 'hover:bg-pink-600' },
  8: { emoji: '💎', color: 'bg-rose-500', hoverColor: 'hover:bg-rose-600' },
  9: { emoji: '👑', color: 'bg-red-500', hoverColor: 'hover:bg-red-600' },
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
        <h1 className="text-4xl md:text-6xl font-extrabold text-indigo-900 mb-4">
          📚 Läsförståelse
        </h1>
        <p className="text-xl text-slate-600">
          Träna din läsning! Välj en årskurs nedan.
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-indigo-100">
        {/* Grade Selection */}
        <div className="mb-8">
          <label className="block text-lg font-bold text-slate-700 mb-4">
            1. Välj årskurs
          </label>
          <div className="grid grid-cols-3 gap-3">
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
                  className={`relative p-4 rounded-xl transition-all transform ${
                    hasTexts
                      ? `${info.color} ${info.hoverColor} text-white shadow-lg hover:shadow-xl hover:scale-105`
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <div className="text-3xl mb-1">{info.emoji}</div>
                  <div className="text-xl font-bold">Åk {grade}</div>
                  <div className="text-xs opacity-90 mt-1">
                    {hasTexts ? `${available} texter` : 'Kommer snart'}
                  </div>
                  {completed > 0 && (
                    <div className="absolute top-1 right-1 bg-white/30 rounded-full px-2 py-0.5 text-xs font-bold">
                      {completed} ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reading Tips */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
          <h3 className="font-bold text-blue-900 mb-3">Lästips</h3>
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
              <span className="text-slate-700 font-medium">Tänk på vad texten säger</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔍</span>
              <span className="text-slate-700 font-medium">Sök ledtrådar i texten</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
