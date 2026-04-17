import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LibraryText, UserAnswers, Badge } from '../types';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { BorderBeam } from './ui/border-beam';
import { Sparkles } from './ui/sparkles';
import { cn } from '@/lib/utils';

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
  sammanfatta: { label: 'Sammanfatta', emoji: '📝' },
  ord: { label: 'Ord & begrepp', emoji: '📖' },
};

// Varierade positiva kommentarer för korrekta svar
const CORRECT_FEEDBACK = [
  { text: 'Rätt!', emoji: '✅' },
  { text: 'Helt rätt!', emoji: '🎯' },
  { text: 'Snyggt!', emoji: '🌟' },
  { text: 'Toppen!', emoji: '🔥' },
  { text: 'Bra jobbat!', emoji: '👏' },
  { text: 'Perfekt!', emoji: '💯' },
  { text: 'Fantastiskt!', emoji: '✨' },
  { text: 'Utmärkt!', emoji: '🏆' },
  { text: 'Grattis!', emoji: '🎉' },
  { text: 'Yes!', emoji: '💪' },
  { text: 'Korrekt!', emoji: '👍' },
  { text: 'Spot on!', emoji: '🎯' },
  { text: 'Lysande!', emoji: '⭐' },
  { text: 'Imponerande!', emoji: '🤩' },
  { text: 'Bravo!', emoji: '👑' },
];

// Generera ett konsistent slumpmässigt index baserat på frågeindex
const getCorrectFeedback = (questionIndex: number) => {
  const index = (questionIndex * 7 + 3) % CORRECT_FEEDBACK.length;
  return CORRECT_FEEDBACK[index];
};

export const ResultView: React.FC<ResultViewProps> = ({
  text,
  answers,
  pointsEarned,
  newBadges,
  onRestart: _onRestart,
  onNextText,
  onNextTextLower,
  onNextTextHigher,
  currentGrade,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

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

  // Animate the percentage
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 300);
    return () => clearTimeout(timer);
  }, [percentage]);

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

  const getGradientColor = () => {
    if (percentage >= 80) return 'from-emerald-500 to-teal-500';
    if (percentage >= 60) return 'from-blue-500 to-indigo-500';
    if (percentage >= 40) return 'from-amber-500 to-orange-500';
    return 'from-rose-500 to-pink-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Result card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Card className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-white/20 shadow-2xl overflow-hidden mb-6">
            <BorderBeam size={300} duration={10} colorFrom={percentage >= 60 ? "#22c55e" : "#f59e0b"} colorTo={percentage >= 60 ? "#14b8a6" : "#ef4444"} />

            <CardContent className="p-8 text-center">
              <motion.div
                className="text-8xl mb-4"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <Sparkles sparklesCount={percentage >= 80 ? 12 : 6} colors={{ first: "#fbbf24", second: "#f59e0b" }}>
                  {getEmoji()}
                </Sparkles>
              </motion.div>

              <motion.h1
                className="text-3xl font-extrabold text-slate-800 dark:text-white mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {getMessage()}
              </motion.h1>

              <motion.p
                className="text-xl text-slate-600 dark:text-slate-300 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Du fick <span className="font-bold text-indigo-600 dark:text-indigo-400">{correctCount}</span> av{' '}
                <span className="font-bold dark:text-white">{totalQuestions}</span> rätt
              </motion.p>

              {/* Score circle with gradient */}
              <motion.div
                className="relative w-44 h-44 mx-auto mb-8"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
              >
                <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 176 176">
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={percentage >= 60 ? "#22c55e" : "#f59e0b"} />
                      <stop offset="100%" stopColor={percentage >= 60 ? "#14b8a6" : "#ef4444"} />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="88"
                    cy="88"
                    r="76"
                    className="stroke-slate-100 dark:stroke-slate-700"
                    strokeWidth="14"
                    fill="none"
                  />
                  <motion.circle
                    cx="88"
                    cy="88"
                    r="76"
                    stroke="url(#scoreGradient)"
                    strokeWidth="14"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 478" }}
                    animate={{ strokeDasharray: `${(animatedPercentage / 100) * 478} 478` }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span
                    className={cn("text-5xl font-bold bg-gradient-to-br bg-clip-text text-transparent", getGradientColor())}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    {percentage}%
                  </motion.span>
                </div>
              </motion.div>

              {/* Points earned */}
              <motion.div
                className="relative bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 border-2 border-amber-200 dark:border-amber-700 rounded-2xl p-5 mb-6 inline-block overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <div className="flex items-center gap-3 justify-center relative z-10">
                  <motion.span
                    className="text-4xl"
                    animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                  >
                    ⭐
                  </motion.span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-400 dark:to-yellow-400 bg-clip-text text-transparent">
                    +{pointsEarned} poäng
                  </span>
                </div>
              </motion.div>

              {/* New badges */}
              <AnimatePresence>
                {newBadges.length > 0 && (
                  <motion.div
                    className="bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 border-2 border-violet-200 dark:border-violet-700 rounded-2xl p-5 mb-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1 }}
                  >
                    <h3 className="font-bold text-violet-900 dark:text-violet-200 mb-4 text-lg">
                      🎉 Nya utmärkelser!
                    </h3>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {newBadges.map((badge, idx) => (
                        <motion.div
                          key={badge.type}
                          className="bg-white dark:bg-slate-700 rounded-xl px-5 py-3 shadow-lg border border-violet-200 dark:border-violet-600"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.2 + idx * 0.1 }}
                        >
                          <span className="text-3xl block mb-1">{badge.icon}</span>
                          <div className="text-sm font-bold text-violet-800 dark:text-violet-200">
                            {badge.name}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Show/hide details */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-indigo-600 dark:text-indigo-400 font-medium py-2 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center gap-2 mx-auto"
                >
                  <motion.span
                    animate={{ rotate: showDetails ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    ▼
                  </motion.span>
                  {showDetails ? 'Dölj svaren' : 'Visa svaren'}
                </button>
              </motion.div>

              {/* Actions - three level options */}
              <motion.div
                className="flex flex-col gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
              >
                <Button
                  onClick={onNextTextLower}
                  disabled={currentGrade <= 1}
                  variant="outline"
                  size="lg"
                  className="w-full justify-center"
                >
                  ↓ Ny text, lägre nivå
                </Button>
                <Button
                  onClick={onNextText}
                  variant="success"
                  size="xl"
                  className="w-full text-lg font-bold"
                >
                  Ny text, samma nivå →
                </Button>
                <Button
                  onClick={onNextTextHigher}
                  disabled={currentGrade >= 10}
                  variant="outline"
                  size="lg"
                  className="w-full justify-center"
                >
                  ↑ Ny text, högre nivå
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed results */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {results.map((result, index) => {
                const typeInfo = QUESTION_TYPE_LABELS[result.question.type] || {
                  label: 'Fråga',
                  emoji: '❓',
                };

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={cn(
                      "bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border-l-4 shadow-lg overflow-hidden",
                      result.isCorrect ? 'border-l-emerald-500' : 'border-l-rose-400'
                    )}>
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3">
                          <motion.div
                            className="flex flex-col items-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: index * 0.1 + 0.2 }}
                          >
                            <span className="text-2xl">
                              {result.isCorrect ? getCorrectFeedback(index).emoji : '❌'}
                            </span>
                            {result.isCorrect && (
                              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                                {getCorrectFeedback(index).text}
                              </span>
                            )}
                          </motion.div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={cn(
                                "px-2.5 py-1 rounded-lg text-xs font-semibold",
                                result.question.type === 'literal'
                                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                                  : result.question.type === 'sammanfatta'
                                  ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                                  : result.question.type === 'ord'
                                  ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
                                  : 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                              )}>
                                {typeInfo.emoji} {typeInfo.label}
                              </span>
                            </div>
                            <p className="font-bold text-slate-800 dark:text-white mb-4">
                              {index + 1}. {result.question.q}
                            </p>

                            {/* All options with highlighting */}
                            <div className="space-y-2">
                              {result.question.options.map((option, optIdx) => {
                                const isUserAnswer = optIdx === result.userAnswerIndex;
                                const isCorrectAnswer = optIdx === result.question.correct;
                                const optionLetter = ['A', 'B', 'C', 'D'][optIdx];

                                return (
                                  <div
                                    key={optIdx}
                                    className={cn(
                                      "flex items-center gap-3 p-3 rounded-xl border-2 transition-all",
                                      isCorrectAnswer
                                        ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-400 dark:border-emerald-600'
                                        : isUserAnswer && !result.isCorrect
                                        ? 'bg-rose-50 dark:bg-rose-900/30 border-rose-400 dark:border-rose-600'
                                        : 'bg-slate-50 dark:bg-slate-700/50 border-transparent'
                                    )}
                                  >
                                    <span className={cn(
                                      "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
                                      isCorrectAnswer
                                        ? 'bg-emerald-500 text-white'
                                        : isUserAnswer && !result.isCorrect
                                        ? 'bg-rose-400 text-white'
                                        : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                                    )}>
                                      {optionLetter}
                                    </span>
                                    <span className={cn(
                                      "text-sm flex-1",
                                      isCorrectAnswer
                                        ? 'text-emerald-800 dark:text-emerald-200 font-medium'
                                        : isUserAnswer && !result.isCorrect
                                        ? 'text-rose-800 dark:text-rose-200'
                                        : 'text-slate-600 dark:text-slate-300'
                                    )}>
                                      {option}
                                    </span>
                                    {isCorrectAnswer && (
                                      <span className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold px-2 py-1 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                                        Rätt svar
                                      </span>
                                    )}
                                    {isUserAnswer && !result.isCorrect && (
                                      <span className="text-rose-600 dark:text-rose-400 text-xs font-semibold px-2 py-1 bg-rose-100 dark:bg-rose-900/50 rounded-lg">
                                        Ditt svar
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
