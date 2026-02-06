import React, { useState, useEffect } from 'react';
import { getTextCountByGrade } from '../services/libraryService';
import { BookLogo } from './BookLogo';

interface SetupViewProps {
  onSelectGrade: (grade: number) => void;
  completedByGrade: Record<number, number>;
}

const GRADE_LABELS = [
  { grade: 1, label: '1' },
  { grade: 2, label: '2' },
  { grade: 3, label: '3' },
  { grade: 4, label: '4' },
  { grade: 5, label: '5' },
  { grade: 6, label: '6' },
  { grade: 7, label: '7' },
  { grade: 8, label: '8' },
  { grade: 9, label: '9' },
  { grade: 10, label: 'GY' },
];

export const SetupView: React.FC<SetupViewProps> = ({
  onSelectGrade,
  completedByGrade,
}) => {
  const [textCounts, setTextCounts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState<number>(4);

  useEffect(() => {
    getTextCountByGrade().then((counts) => {
      setTextCounts(counts);
      setLoading(false);
    });
  }, []);

  const handleStart = () => {
    onSelectGrade(selectedGrade);
  };

  const getGradeLabel = (grade: number): string => {
    if (grade <= 3) return 'Lågstadiet (åk 1-3)';
    if (grade <= 6) return 'Mellanstadiet (åk 4-6)';
    if (grade <= 9) return 'Högstadiet (åk 7-9)';
    return 'Gymnasiet';
  };

  const getGradeLabelColor = (grade: number): string => {
    if (grade <= 3) return 'text-green-600';
    if (grade <= 6) return 'text-blue-600';
    if (grade <= 9) return 'text-purple-600';
    return 'text-orange-600';
  };

  const getGradeDisplayText = (grade: number): string => {
    if (grade === 10) return 'GY';
    return String(grade);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="animate-bounce">
              <BookLogo size={64} />
            </div>
          </div>
          <p className="text-xl text-slate-600">Laddar texter...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-4 mb-4">
          <BookLogo size={56} />
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800">
            Läs och lär
          </h1>
        </div>
        <p className="text-xl text-slate-500">
          Din smarta läskompis. Vad vill du läsa om idag?
        </p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg">
        {/* Välj svårighetsgrad */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Välj svårighetsgrad</h2>

          {/* Tips box */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-xl">👀</span>
                <span className="text-slate-700">Läs noga</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🛑</span>
                <span className="text-slate-700">Stanna när du inte förstår</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🧠</span>
                <span className="text-slate-700">Försök förstå även det som inte står rakt ut</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🔍</span>
                <span className="text-slate-700">Ta reda på ord du inte förstår</span>
              </div>
            </div>
          </div>

          {/* Grade display */}
          <div className="text-center mb-4">
            <div className="text-6xl font-bold text-indigo-900">{getGradeDisplayText(selectedGrade)}</div>
            <div className={`text-lg font-semibold ${getGradeLabelColor(selectedGrade)}`}>
              {getGradeLabel(selectedGrade)}
            </div>
          </div>

          {/* Slider */}
          <div className="px-2">
            <input
              type="range"
              min="1"
              max="10"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-sm text-slate-500 mt-2">
              {GRADE_LABELS.map((item) => (
                <span
                  key={item.grade}
                  className={`${item.grade === selectedGrade ? 'text-indigo-900 font-bold' : ''}`}
                >
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          {/* Text count indicator */}
          {textCounts[selectedGrade] !== undefined && (
            <div className="text-center mt-4 text-sm text-slate-500">
              {textCounts[selectedGrade] > 0
                ? `${textCounts[selectedGrade]} texter tillgängliga`
                : 'Inga texter ännu - kommer snart!'}
            </div>
          )}
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          disabled={!textCounts[selectedGrade] || textCounts[selectedGrade] === 0}
          className={`w-full py-4 px-6 rounded-xl text-white font-bold text-xl shadow-lg transition-all ${
            textCounts[selectedGrade] && textCounts[selectedGrade] > 0
              ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-xl transform hover:scale-[1.02]'
              : 'bg-slate-300 cursor-not-allowed'
          }`}
        >
          Börja läsa!
        </button>
      </div>
    </div>
  );
};
