import React, { useState } from 'react';
import { LibraryText, UserAnswers, Badge } from '../types';

interface ResultViewProps {
  text: LibraryText;
  answers: UserAnswers;
  pointsEarned: number;
  newBadges: Badge[];
  onRestart: () => void;
  onNextText: () => void;
  onNextTextLower: () => void;
  onNextTextHigher: () => void;
  currentGrade: number;
}

const QUESTION_TYPE_LABELS: Record<string, { label: string; emoji: string }> = {
  literal: { label: 'På raderna', emoji: '🔍' },
  inferens: { label: 'Mellan raderna', emoji: '🧠' },
};

export const ResultView: React.FC<ResultViewProps> = ({
  text,
  answers,
  pointsEarned,
  newBadges,
  onRestart,
  onNextText,
  onNextTextLower,
  onNextTextHigher,
  currentGrade,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // Beräkna resultat för flervalsfrågor
  const results = text.questions.map((q, index) => {
    const userAnswerIndex = answers[index] !== undefined ? Number(answers[index]) : -1;
    const isCorrect = userAnswerIndex === q.correct;

    return {
      question: q,
      userAnswerIndex,
      userAnswerText: userAnswerIndex >= 0 ? q.options[userAnswerIndex] : null,
      correctAnswerText: q.options[q.correct],
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
    <div className="min-h-screen bg-sky-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Result card */}
        <div className="bg-white rounded-3xl shadow-xl border-b-8 border-indigo-100 p-8 text-center mb-6">
          <div className="text-8xl mb-4">{getEmoji()}</div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2">
            {getMessage()}
          </h1>
          <p className="text-xl text-slate-600 mb-6">
            Du fick <span className="font-bold text-indigo-600">{correctCount}</span> av{' '}
            <span className="font-bold">{totalQuestions}</span> rätt
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
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-4 inline-block">
            <div className="flex items-center gap-2 justify-center">
              <span className="text-3xl">⭐</span>
              <span className="text-2xl font-bold text-yellow-700">
                +{pointsEarned} poäng
              </span>
            </div>
          </div>

          {/* Show/hide details */}
          <div className="mb-6">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-indigo-600 font-medium py-2 hover:underline"
            >
              {showDetails ? '▲ Dölj svaren' : '▼ Visa svaren'}
            </button>
          </div>

          {/* New badges */}
          {newBadges.length > 0 && (
            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-6">
              <h3 className="font-bold text-purple-900 mb-3">
                🎉 Nya utmärkelser!
              </h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {newBadges.map((badge) => (
                  <div
                    key={badge.type}
                    className="bg-white rounded-lg px-4 py-2 shadow-sm border border-purple-200"
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

          {/* Actions - three level options */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onNextTextLower}
              disabled={currentGrade <= 1}
              className={`px-6 py-4 font-bold text-lg rounded-xl transition-all ${
                currentGrade <= 1
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              Ny text, lägre nivå
            </button>
            <button
              onClick={onNextText}
              className="px-6 py-4 bg-green-600 text-white font-extrabold text-lg rounded-xl shadow-lg hover:bg-green-700 hover:shadow-xl hover:scale-105 transition-all"
            >
              Ny text, samma nivå
            </button>
            <button
              onClick={onNextTextHigher}
              disabled={currentGrade >= 10}
              className={`px-6 py-4 font-bold text-lg rounded-xl transition-all ${
                currentGrade >= 10
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
            >
              Ny text, högre nivå
            </button>
          </div>
        </div>

        {/* Detailed results */}
        {showDetails && (
          <div className="mt-4 space-y-4">
            {results.map((result, index) => {
              const typeInfo = QUESTION_TYPE_LABELS[result.question.type] || {
                label: 'Fråga',
                emoji: '❓',
              };

              return (
                <div
                  key={index}
                  className={`bg-white rounded-xl p-5 shadow-md border-l-4 ${
                    result.isCorrect ? 'border-green-500' : 'border-red-400'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">
                      {result.isCorrect ? '✅' : '❌'}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          result.question.type === 'literal'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {typeInfo.emoji} {typeInfo.label}
                        </span>
                      </div>
                      <p className="font-bold text-slate-800 mb-3">
                        {index + 1}. {result.question.q}
                      </p>

                      {/* All options with highlighting */}
                      <div className="space-y-2">
                        {result.question.options.map((option, optIdx) => {
                          const isUserAnswer = optIdx === result.userAnswerIndex;
                          const isCorrectAnswer = optIdx === result.question.correct;
                          const optionLetter = ['A', 'B', 'C', 'D'][optIdx];

                          let bgColor = 'bg-slate-50';
                          let textColor = 'text-slate-600';
                          let borderColor = 'border-transparent';

                          if (isCorrectAnswer) {
                            bgColor = 'bg-green-50';
                            textColor = 'text-green-800';
                            borderColor = 'border-green-400';
                          } else if (isUserAnswer && !result.isCorrect) {
                            bgColor = 'bg-red-50';
                            textColor = 'text-red-800';
                            borderColor = 'border-red-400';
                          }

                          return (
                            <div
                              key={optIdx}
                              className={`flex items-center gap-2 p-2 rounded-lg border-2 ${bgColor} ${borderColor}`}
                            >
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                isCorrectAnswer
                                  ? 'bg-green-500 text-white'
                                  : isUserAnswer && !result.isCorrect
                                  ? 'bg-red-400 text-white'
                                  : 'bg-slate-300 text-slate-600'
                              }`}>
                                {optionLetter}
                              </span>
                              <span className={`text-sm ${textColor}`}>
                                {option}
                              </span>
                              {isCorrectAnswer && (
                                <span className="ml-auto text-green-600 text-sm font-medium">
                                  Rätt svar
                                </span>
                              )}
                              {isUserAnswer && !result.isCorrect && (
                                <span className="ml-auto text-red-600 text-sm font-medium">
                                  Ditt svar
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
