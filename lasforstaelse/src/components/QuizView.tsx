// Lasjakten - Quiz komponent
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LibraryText, UserAnswers } from '../types';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { cn } from '@/lib/utils';

interface QuizViewProps {
  text: LibraryText;
  onComplete: (answers: UserAnswers) => void;
  onShowText: () => void;
}

// Bionic reading: gör första delen av varje ord fetstilt för lättare läsning
const applyBionicReading = (text: string): React.ReactNode[] => {
  return text.split(' ').map((word, index) => {
    if (word.length === 0) return null;

    // Ta bort punktuation för att beräkna fetstil-längd
    const cleanWord = word.replace(/[.,!?;:'"()-]/g, '');
    const boldLength = Math.ceil(cleanWord.length * 0.4); // 40% av ordet fetstilt

    // Hitta var den faktiska texten börjar (skippa inledande punktuation)
    let startIdx = 0;
    while (startIdx < word.length && /[.,!?;:'"()-]/.test(word[startIdx])) {
      startIdx++;
    }

    // Beräkna slutpositionen för fetstilt text
    let boldEndIdx = startIdx + boldLength;

    // Se till att vi inte överskrider ordets längd
    if (boldEndIdx > word.length) boldEndIdx = word.length;

    const before = word.slice(0, startIdx);
    const boldPart = word.slice(startIdx, boldEndIdx);
    const normalPart = word.slice(boldEndIdx);

    return (
      <span key={index}>
        {before}
        <strong className="font-bold">{boldPart}</strong>
        {normalPart}
        {' '}
      </span>
    );
  });
};

const QUESTION_TYPE_LABELS: Record<string, { label: string; emoji: string; category: string }> = {
  literal: { label: 'På raderna', emoji: '🔍', category: 'På raderna' },
  inferens: { label: 'Mellan raderna', emoji: '🧠', category: 'Mellan raderna' },
  sammanfatta: { label: 'Sammanfatta', emoji: '📝', category: 'Sammanfatta' },
  ord: { label: 'Ord & begrepp', emoji: '📖', category: 'Ord & begrepp' },
};

type TextSize = 'small' | 'medium' | 'large';

const textSizeClasses: Record<TextSize, string> = {
  small: 'text-sm',
  medium: 'text-base',
  large: 'text-lg'
};

export const QuizView: React.FC<QuizViewProps> = ({
  text,
  onComplete,
}) => {
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showText, setShowText] = useState(true);
  const [textSize, setTextSize] = useState<TextSize>('medium');
  const [bionicReading, setBionicReading] = useState(false);

  const questions = text.questions;
  const totalQuestions = questions.length;
  const currentQ = questions[currentQuestion];
  const typeInfo = QUESTION_TYPE_LABELS[currentQ.type] || {
    label: 'Fråga',
    emoji: '❓',
    category: 'Fråga',
  };

  const handleAnswer = (optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: String(optionIndex) }));
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    onComplete(answers);
  };

  const isLastQuestion = currentQuestion === totalQuestions - 1;
  const allAnswered = questions.every((_, i) => answers[i] !== undefined);
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const selectedAnswer = answers[currentQuestion];

  // Split text into paragraphs
  const paragraphs = text.text.split('\n').filter((p) => p.trim().length > 0);

  // Get word count from meta or calculate it
  const wordCount = text.meta?.wordCount || text.text.split(/\s+/).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50 px-4 py-4 sticky top-0 z-20"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{text.title}</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300">
              {text.grade === 10 ? 'Gymnasiet' : `Åk ${text.grade}`}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
              {text.genre === 'berättelse' ? '📖 Berättelse' : '📰 Faktatext'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{wordCount} ord</span>
          </div>
        </div>
      </motion.div>

      {/* Main Content - Side by Side Layout */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Text Content */}
          <motion.div
            className={cn(showText ? 'block' : 'hidden lg:block')}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border-white/20 shadow-xl h-fit lg:sticky lg:top-24 overflow-hidden">
              <CardContent className="p-6 lg:p-8">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100 dark:border-slate-700">
                  <h3 className="font-bold text-slate-700 dark:text-slate-200">{text.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">Storlek:</span>
                    {(['small', 'medium', 'large'] as const).map((size, idx) => (
                      <motion.button
                        key={size}
                        onClick={() => setTextSize(size)}
                        className={cn(
                          "w-7 h-7 rounded-lg font-bold transition-all",
                          size === 'small' ? 'text-xs' : size === 'medium' ? 'text-sm' : 'text-base',
                          textSize === size
                            ? 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title={['Liten text', 'Medium text', 'Stor text'][idx]}
                        aria-label={['Liten textstorlek', 'Medium textstorlek', 'Stor textstorlek'][idx]}
                        aria-pressed={textSize === size}
                      >
                        A
                      </motion.button>
                    ))}
                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-600 mx-1 hidden sm:block" />
                    <motion.button
                      onClick={() => setBionicReading(!bionicReading)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                        bionicReading
                          ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      title="Bionic Reading - fetstil på ordets början för lättare läsning"
                      aria-label="Bionic Reading"
                      aria-pressed={bionicReading}
                    >
                      <span className="font-black">Bio</span>nic
                    </motion.button>
                    <button
                      onClick={() => setShowText(false)}
                      className="text-sm text-indigo-600 dark:text-indigo-400 font-medium ml-2 lg:hidden"
                    >
                      Visa frågor →
                    </button>
                  </div>
                </div>
              {/* Bildstöd för åk 1-2 */}
              {text.imageUrl && text.grade <= 2 && (
                <div className="mb-4">
                  <img
                    src={text.imageUrl}
                    alt={`Bild till ${text.title}`}
                    className="w-full max-h-64 object-contain rounded-lg bg-slate-100 dark:bg-slate-700"
                  />
                </div>
              )}
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <div className="space-y-4">
                    {paragraphs.map((para, idx) => (
                      <motion.p
                        key={idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className={cn(
                          "leading-relaxed text-slate-700 dark:text-slate-300",
                          textSizeClasses[textSize]
                        )}
                      >
                        {bionicReading ? applyBionicReading(para) : para}
                      </motion.p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right: Questions */}
          <motion.div
            className={cn("space-y-4", !showText ? 'block' : 'hidden lg:block')}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Mobile: Show text button */}
            <div className="lg:hidden">
              <Button
                onClick={() => setShowText(true)}
                variant="outline"
                className="w-full"
              >
                ← Visa texten igen
              </Button>
            </div>

            {/* Progress Bar */}
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border-white/20 shadow-xl overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    Fråga {currentQuestion + 1} av {totalQuestions}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                    {Object.keys(answers).length}/{totalQuestions} besvarade
                  </span>
                </div>
                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden" role="progressbar" aria-valuenow={currentQuestion + 1} aria-valuemin={1} aria-valuemax={totalQuestions} aria-label={`Fråga ${currentQuestion + 1} av ${totalQuestions}`}>
                  <motion.div
                    className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Current Question */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border-white/20 shadow-xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="mb-5">
                      <div className="flex items-start gap-3">
                        <motion.span
                          className="flex-shrink-0 bg-gradient-to-br from-violet-500 to-indigo-600 text-white font-bold w-10 h-10 rounded-xl flex items-center justify-center text-sm shadow-lg"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {currentQuestion + 1}
                        </motion.span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{typeInfo.emoji}</span>
                            <span className={cn(
                              "px-2.5 py-1 rounded-lg text-xs font-semibold",
                              currentQ.type === 'literal'
                                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                                : currentQ.type === 'sammanfatta'
                                ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                                : currentQ.type === 'ord'
                                ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
                                : 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                            )}>
                              {typeInfo.label}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-relaxed">
                            {currentQ.q}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Multiple Choice Options */}
                    <div className="space-y-3">
                      {currentQ.options.map((option, idx) => {
                        const isSelected = selectedAnswer === String(idx);
                        const optionLetter = ['A', 'B', 'C', 'D'][idx];

                        return (
                          <motion.button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            className={cn(
                              "w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4",
                              isSelected
                                ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/30 shadow-lg'
                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                            )}
                            whileHover={{ scale: 1.01, x: 4 }}
                            whileTap={{ scale: 0.99 }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <span className={cn(
                              "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all",
                              isSelected
                                ? 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                            )}>
                              {optionLetter}
                            </span>
                            <span className={cn(
                              "text-base flex-1",
                              isSelected ? 'text-violet-900 dark:text-violet-200 font-medium' : 'text-slate-700 dark:text-slate-300'
                            )}>
                              {option}
                            </span>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center"
                              >
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </motion.div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="mt-6 flex gap-3">
                      <Button
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                        variant="outline"
                        className="px-4"
                      >
                        ← Föregående
                      </Button>
                      {isLastQuestion ? (
                        <Button
                          onClick={handleSubmit}
                          disabled={!allAnswered}
                          variant={allAnswered ? "success" : "secondary"}
                          size="lg"
                          className="flex-1 text-lg font-bold"
                        >
                          {allAnswered ? 'Rätta svaren!' : `Svara på alla (${Object.keys(answers).length}/${totalQuestions})`}
                        </Button>
                      ) : (
                        <Button
                          onClick={handleNext}
                          disabled={selectedAnswer === undefined}
                          variant={selectedAnswer !== undefined ? "gradient" : "secondary"}
                          className="flex-1"
                        >
                          {selectedAnswer !== undefined ? 'Nästa fråga →' : 'Välj ett svar först'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* All Questions Overview */}
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border-white/20 shadow-xl overflow-hidden">
              <CardContent className="p-4">
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">Översikt</h4>
                <div className="grid grid-cols-6 gap-2">
                  {questions.map((_q, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => setCurrentQuestion(idx)}
                      className={cn(
                        "aspect-square rounded-xl font-bold text-sm transition-all",
                        idx === currentQuestion
                          ? 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg'
                          : answers[idx] !== undefined
                          ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/70'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600'
                      )}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {idx + 1}
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
