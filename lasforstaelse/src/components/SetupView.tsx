import React, { useState, useEffect } from 'react';
import { getTextCountByGrade } from '../services/libraryService';
import { BookLogo } from './BookLogo';

interface SetupViewProps {
  onSelectGrade: (grade: number) => void;
  completedByGrade: Record<number, number>;
}

const THEMES = [
  { id: 'djur', label: 'Djur & Natur', emoji: '🦊' },
  { id: 'äventyr', label: 'Äventyr', emoji: '🗺️' },
  { id: 'sport', label: 'Sport & Fritid', emoji: '⚽' },
  { id: 'historia', label: 'Historia', emoji: '🏰' },
  { id: 'vetenskap', label: 'Vetenskap', emoji: '🔬' },
  { id: 'fantasy', label: 'Fantasy', emoji: '🧙' },
  { id: 'rymden', label: 'Rymden', emoji: '🚀' },
  { id: 'random', label: 'Slumpa fram en text', emoji: '🎲', special: true },
];

const TEXT_TYPES = [
  { id: 'berättande', label: 'Berättande', description: 'Berättelser och händelser', icon: '📖', color: 'bg-purple-600' },
  { id: 'beskrivande', label: 'Beskrivande', description: 'Beskrivningar och fakta', icon: '🎨', color: 'bg-white' },
  { id: 'argumenterande', label: 'Argumenterande', description: 'Åsikter och argument', icon: '💬', color: 'bg-white' },
];

export const SetupView: React.FC<SetupViewProps> = ({
  onSelectGrade,
  completedByGrade,
}) => {
  const [textCounts, setTextCounts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedTextType, setSelectedTextType] = useState<string>('berättande');
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
    return 'Högstadiet (åk 7-9)';
  };

  const getGradeLabelColor = (grade: number): string => {
    if (grade <= 3) return 'text-green-600';
    if (grade <= 6) return 'text-blue-600';
    return 'text-purple-600';
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
        {/* 1. Välj ett ämne */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">1. Välj ett ämne</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id === selectedTheme ? null : theme.id)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  theme.special
                    ? selectedTheme === theme.id
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-orange-300 hover:border-orange-400 text-orange-600'
                    : selectedTheme === theme.id
                    ? 'border-slate-800 bg-slate-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="text-2xl">{theme.emoji}</span>
                <div className={`text-sm font-medium mt-1 ${theme.special ? '' : 'text-slate-700'}`}>
                  {theme.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Välj texttyp */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">2. Välj texttyp</h2>
          <div className="grid grid-cols-3 gap-3">
            {TEXT_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedTextType(type.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedTextType === type.id
                    ? type.color === 'bg-purple-600'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'border-slate-800 bg-slate-50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="text-3xl mb-2">{type.icon}</div>
                <div className={`font-bold ${selectedTextType === type.id && type.color === 'bg-purple-600' ? 'text-white' : 'text-slate-800'}`}>
                  {type.label}
                </div>
                <div className={`text-xs mt-1 ${selectedTextType === type.id && type.color === 'bg-purple-600' ? 'text-purple-200' : 'text-slate-500'}`}>
                  {type.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Välj svårighetsgrad */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">3. Välj svårighetsgrad (årskurs 1-9)</h2>

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
            <div className="text-6xl font-bold text-indigo-900">{selectedGrade}</div>
            <div className={`text-lg font-semibold ${getGradeLabelColor(selectedGrade)}`}>
              {getGradeLabel(selectedGrade)}
            </div>
          </div>

          {/* Slider */}
          <div className="px-2">
            <input
              type="range"
              min="1"
              max="9"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-sm text-slate-500 mt-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <span
                  key={num}
                  className={`${num === selectedGrade ? 'text-indigo-900 font-bold' : ''}`}
                >
                  {num}
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
