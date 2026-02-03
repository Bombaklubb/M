import React, { useState } from 'react';
import { LibraryText, UserAnswers, Badge } from '../types';

interface ResultViewProps {
  text: LibraryText;
  answers: UserAnswers;
  pointsEarned: number;
  newBadges: Badge[];
  onRestart: () => void;
  onNextText: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  text,
  answers,
  pointsEarned,
  newBadges,
  onRestart,
  onNextText,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // Beräkna resultat
  const results = text.questions.map((q, index) => {
    const userAnswer = (answers[index] || '').trim().toLowerCase();
    const correctAnswer = q.a.trim().toLowerCase();

    // Enkel jämförelse - räkna som rätt om svaret innehåller nyckelord
    const isCorrect =
      userAnswer === correctAnswer ||
      correctAnswer.split(' ').some((word) => userAnswer.includes(word) && word.length > 3);

    return {
      question: q,
      userAnswer: answers[index] || '',
      isCorrect,
    };
  });

  const correctCount = results.filter((r) => r.isCorrect).length;
  const totalQuestions = text.questions.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  const getEmoji = () => {
    if (percentage === 100) return '🏆';
    if (percentage >= 80) return '🌟';
    if (percentage >= 60) return '👍';
    if (percentage >= 40) return '💪';
    return '📚';
  };

  const getMessage = () => {
    if (percentage === 100) return 'Perfekt! Alla rätt!';
    if (percentage >= 80) return 'Jättebra jobbat!';
    if (percentage >= 60) return 'Bra jobbat!';
    if (percentage >= 40) return 'Bra försök!';
    return 'Fortsätt träna!';
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Result card */}
      <div className="bg-white rounded-3xl shadow-xl p-8 text-center mb-6">
        <div className="text-8xl mb-4">{getEmoji()}</div>
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2">
          {getMessage()}
        </h1>
        <p className="text-slate-600 mb-6">
          Du fick {correctCount} av {totalQuestions} rätt
        </p>

        {/* Score circle */}
        <div className="relative w-40 h-40 mx-auto mb-6">
          <svg className="w-40 h-40 transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#e2e8f0"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke={percentage >= 60 ? '#22c55e' : '#f59e0b'}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${(percentage / 100) * 440} 440`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-slate-800">
              {percentage}%
            </span>
          </div>
        </div>

        {/* Points earned */}
        <div className="bg-yellow-100 rounded-xl p-4 mb-6 inline-block">
          <div className="flex items-center gap-2 justify-center">
            <span className="text-3xl">⭐</span>
            <span className="text-2xl font-bold text-yellow-700">
              +{pointsEarned} poäng
            </span>
          </div>
        </div>

        {/* New badges */}
        {newBadges.length > 0 && (
          <div className="bg-purple-100 rounded-xl p-4 mb-6">
            <h3 className="font-bold text-purple-900 mb-3">
              🎉 Nya utmärkelser!
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {newBadges.map((badge) => (
                <div
                  key={badge.type}
                  className="bg-white rounded-lg px-4 py-2 shadow-sm"
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <div className="text-sm font-bold text-purple-800">
                    {badge.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onNextText}
            className="px-8 py-4 bg-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all"
          >
            Ny text →
          </button>
          <button
            onClick={onRestart}
            className="px-8 py-4 bg-slate-200 text-slate-700 font-bold text-lg rounded-xl hover:bg-slate-300 transition-all"
          >
            Välj årskurs
          </button>
        </div>
      </div>

      {/* Show/hide details */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full text-center text-indigo-600 font-medium py-2 hover:underline"
      >
        {showDetails ? '▲ Dölj svar' : '▼ Visa rätta svar'}
      </button>

      {/* Detailed results */}
      {showDetails && (
        <div className="mt-4 space-y-4">
          {results.map((result, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-4 shadow-md border-l-4 ${
                result.isCorrect ? 'border-green-500' : 'border-red-400'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">
                  {result.isCorrect ? '✅' : '❌'}
                </span>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 mb-2">
                    {index + 1}. {result.question.q}
                  </p>
                  <div className="text-sm space-y-1">
                    <p className="text-slate-600">
                      <span className="font-medium">Ditt svar:</span>{' '}
                      {result.userAnswer || '(inget svar)'}
                    </p>
                    <p className="text-green-700">
                      <span className="font-medium">Rätt svar:</span>{' '}
                      {result.question.a}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
