import React from 'react';
import { ReadingExercise, UserAnswers, QuestionType, Badge } from '../types';
import { Button } from './Button';

interface ResultViewProps {
  data: ReadingExercise;
  answers: UserAnswers;
  onRestart: () => void;
  onRandomize?: () => void;
  pointsEarned?: number;
  newLevel?: number;
  oldLevel?: number;
  newBadges?: Badge[];
  timeSpentMinutes?: number;
}

export const ResultView: React.FC<ResultViewProps> = ({
  data,
  answers,
  onRestart,
  onRandomize,
  pointsEarned = 0,
  newLevel,
  oldLevel,
  newBadges = [],
  timeSpentMinutes = 0
}) => {
  // Simple scoring logic for MC and TF
  let correctCount = 0;
  const autoGradableCount = data.questions.filter(q =>
    q.type === QuestionType.MULTIPLE_CHOICE || q.type === QuestionType.TRUE_FALSE
  ).length;

  data.questions.forEach(q => {
    if (q.type === QuestionType.MULTIPLE_CHOICE || q.type === QuestionType.TRUE_FALSE) {
        // Simple string comparison, case insensitive just in case
        if (answers[q.id]?.toLowerCase() === q.correctAnswer.toLowerCase()) {
            correctCount++;
        }
    }
  });

  const getScoreMessage = () => {
    if (autoGradableCount === 0) return "Bra jobbat!";
    const percentage = correctCount / autoGradableCount;
    if (percentage === 1) return "🌟 Superbra! Alla rätt!";
    if (percentage >= 0.75) return "👏 Mycket bra jobbat!";
    if (percentage >= 0.5) return "👍 Bra kämpat!";
    return "💪 Bra övning! Fortsätt kämpa.";
  };

  const levelChanged = newLevel && oldLevel && newLevel !== oldLevel;
  const levelUp = levelChanged && newLevel > oldLevel;
  const levelDown = levelChanged && newLevel < oldLevel;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-indigo-900 mb-2">Resultat</h2>
        <p className="text-2xl font-bold text-teal-600">{getScoreMessage()}</p>
        {autoGradableCount > 0 && (
          <p className="text-slate-500 mt-2">
            Du fick {correctCount} av {autoGradableCount} rätt
          </p>
        )}

        {/* Points earned */}
        {pointsEarned > 0 && (
          <div className="mt-4 inline-block bg-yellow-50 px-6 py-3 rounded-full border-2 border-yellow-200">
            <span className="text-2xl mr-2">⭐</span>
            <span className="font-black text-yellow-600 text-xl">+{pointsEarned} poäng</span>
          </div>
        )}

        {/* Time spent */}
        {timeSpentMinutes > 0 && (
          <div className="mt-4 inline-block bg-blue-50 px-6 py-3 rounded-full border-2 border-blue-200">
            <span className="text-2xl mr-2">⏱️</span>
            <span className="font-black text-blue-600 text-xl">{timeSpentMinutes} minut{timeSpentMinutes !== 1 ? 'er' : ''}</span>
          </div>
        )}

        {/* Level change notifications */}
        {levelUp && (
          <div className="mt-4 bg-green-50 border-2 border-green-200 rounded-2xl p-6 inline-block">
            <div className="text-5xl mb-2">🎉</div>
            <div className="text-xl font-bold text-green-700">Grattis! Du gick upp till nivå {newLevel}!</div>
          </div>
        )}

        {/* New badges */}
        {newBadges.length > 0 && (
          <div className="mt-6 space-y-3">
            {newBadges.map((badge, index) => (
              <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-4 inline-block">
                <div className="text-4xl mb-1">{badge.icon}</div>
                <div className="font-bold text-purple-700">Nytt märke: {badge.name}!</div>
                <div className="text-sm text-purple-600">{badge.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        {data.questions.map((q, idx) => {
          const userAnswer = answers[q.id];
          const isAutoGraded = q.type === QuestionType.MULTIPLE_CHOICE || q.type === QuestionType.TRUE_FALSE;
          const isCorrect = isAutoGraded && userAnswer?.toLowerCase() === q.correctAnswer.toLowerCase();

          return (
            <div key={q.id} className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden ${
              isAutoGraded
                ? (isCorrect ? 'border-green-200' : 'border-red-200')
                : 'border-indigo-100'
            }`}>
              <div className="p-6">
                <div className="flex items-start gap-3 mb-4">
                    <span className="flex-shrink-0 bg-slate-100 text-slate-600 font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm">
                        {idx + 1}
                    </span>
                    <h3 className="font-bold text-lg text-slate-800 pt-0.5">{q.question}</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-50 p-4 rounded-xl">
                        <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Ditt svar</span>
                        <p className={`font-medium ${
                             isAutoGraded
                                ? (isCorrect ? 'text-green-700' : 'text-red-600')
                                : 'text-slate-700'
                        }`}>
                            {userAnswer || "(Inget svar)"}
                        </p>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-xl">
                        <span className="text-xs font-bold text-indigo-300 uppercase block mb-1">Facit</span>
                        <p className="font-medium text-indigo-900">{q.correctAnswer}</p>
                    </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                    <div className="flex items-start gap-2">
                        <span className="text-amber-500 text-xl">💡</span>
                        <div>
                            <span className="text-xs font-bold text-amber-600 uppercase block mb-1">Förklaring</span>
                            <p className="text-slate-700 text-sm leading-relaxed">{q.explanation}</p>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center pb-20 px-4">
        {onRandomize && (
          <Button onClick={onRandomize} className="py-4 px-6 text-lg shadow-xl bg-purple-600 hover:bg-purple-700">
            🎲 Slumpa fram ny text
          </Button>
        )}
        <Button onClick={onRestart} className="py-4 px-6 text-lg shadow-xl bg-indigo-600 hover:bg-indigo-700">
          🏠 Startsidan
        </Button>
      </div>
    </div>
  );
};
