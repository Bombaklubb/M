import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LibraryText, UserAnswers } from '../types';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { cn } from '@/lib/utils';
import { TextWithGlossary } from './TextWithGlossary';
import { TextToSpeech } from './TextToSpeech';
import { useSpeech } from '@/hooks/useSpeech';
import { getThemeVisual } from '@/lib/themes';

interface QuizViewProps {
  text: LibraryText;
  onComplete: (answers: UserAnswers) => void;
  onShowText: () => void;
}

// Bionic reading: bold the first portion of a single word for easier reading
const bionicWord = (word: string): React.ReactNode => {
  const cleanWord = word.replace(/[.,!?;:'"()-]/g, '');
  const boldLength = Math.ceil(cleanWord.length * 0.4);

  let startIdx = 0;
  while (startIdx < word.length && /[.,!?;:'"()-]/.test(word[startIdx])) startIdx++;

  let boldEndIdx = startIdx + boldLength;
  if (boldEndIdx > word.length) boldEndIdx = word.length;

  return (
    <>
      {word.slice(0, startIdx)}
      <strong className="font-bold">{word.slice(startIdx, boldEndIdx)}</strong>
      {word.slice(boldEndIdx)}
    </>
  );
};

const QUESTION_TYPE_LABELS: Record<string, { label: string; emoji: string; category: string }> = {
  literal: { label: 'On the Lines', emoji: '🔍', category: 'On the Lines' },
  inference: { label: 'Between the Lines', emoji: '🧠', category: 'Between the Lines' },
};

type TextSize = 'small' | 'medium' | 'large';

const textSizeClasses: Record<TextSize, string> = {
  small: 'text-sm',
  medium: 'text-base',
  large: 'text-lg'
};

// Textstorleken sparas så den följer med mellan texter och sessioner
const READING_PREFS_KEY = 'readhunt_reading_prefs';

function loadSavedTextSize(): TextSize {
  try {
    const raw = localStorage.getItem(READING_PREFS_KEY);
    if (raw) {
      const size = (JSON.parse(raw) as { textSize?: TextSize }).textSize;
      if (size === 'small' || size === 'medium' || size === 'large') return size;
    }
  } catch { /* ignore */ }
  return 'medium';
}

export const QuizView: React.FC<QuizViewProps> = ({ text, onComplete }) => {
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showText, setShowText] = useState(true);
  const [textSize, setTextSize] = useState<TextSize>(loadSavedTextSize);
  const [bionicReading, setBionicReading] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  // Spara textstorleken
  useEffect(() => {
    try {
      localStorage.setItem(READING_PREFS_KEY, JSON.stringify({ textSize }));
    } catch { /* ignore */ }
  }, [textSize]);

  // Reset image fallback when switching to a new text
  useEffect(() => {
    setImageFailed(false);
  }, [text.id]);

  const themeVisual = getThemeVisual(text.theme, text.genre);
  const speech = useSpeech(text.text);

  const questions = text.questions;
  const totalQuestions = questions.length;
  const currentQ = questions[currentQuestion];
  const typeInfo = QUESTION_TYPE_LABELS[currentQ.type] || {
    label: 'Question',
    emoji: '❓',
    category: 'Question',
  };

  const handleAnswer = (optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: String(optionIndex) }));
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) setCurrentQuestion((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion((prev) => prev - 1);
  };

  const handleSubmit = () => onComplete(answers);

  const isLastQuestion = currentQuestion === totalQuestions - 1;
  const allAnswered = questions.every((_, i) => answers[i] !== undefined);
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const selectedAnswer = answers[currentQuestion];

  const wordCount = text.meta?.wordCount || text.text.split(/\s+/).length;
  const readingTime = text.meta?.readingTime || Math.max(1, Math.round(wordCount / 150));

  // Group questions by type for the overview
  const literalQuestions = questions.filter(q => q.type === 'literal');
  const inferenceQuestions = questions.filter(q => q.type === 'inference');

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-700/60 shadow-sm px-4 py-3 sticky top-16 z-20"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{text.title}</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300">
              {`Level ${text.grade}`}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
              {text.genre === 'fiction' ? '📖 Fiction' : '📰 Non-fiction'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{wordCount} words</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">⏱️ ~{readingTime} min read</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              🔍 {literalQuestions.length} on lines · 🧠 {inferenceQuestions.length} between lines
            </span>
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
                <div className="flex flex-wrap items-center justify-between gap-y-3 mb-4 pb-4 border-b border-slate-100 dark:border-slate-700">
                  <h3 className="font-bold text-slate-700 dark:text-slate-200">{text.title}</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">Size:</span>
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
                        title={['Small text', 'Medium text', 'Large text'][idx]}
                        aria-label={['Small text size', 'Medium text size', 'Large text size'][idx]}
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
                      title="Bionic Reading - bold the beginning of each word for easier reading"
                      aria-label="Bionic Reading"
                      aria-pressed={bionicReading}
                    >
                      <span className="font-black">Bio</span>nic
                    </motion.button>
                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-600 mx-1 hidden sm:block" />
                    <TextToSpeech speech={speech} />
                    <button
                      onClick={() => setShowText(false)}
                      className="text-sm text-indigo-600 dark:text-indigo-400 font-medium ml-2 lg:hidden"
                    >
                      Questions →
                    </button>
                  </div>
                </div>

                {/* Header image (all levels) with graceful themed fallback */}
                <div className="mb-5 -mx-6 lg:-mx-8 rounded-xl overflow-hidden">
                  {text.imageUrl && !imageFailed ? (
                    <div className="relative">
                      <img
                        src={text.imageUrl}
                        alt={text.title}
                        className="w-full h-44 md:h-52 object-cover"
                        loading="lazy"
                        onError={() => setImageFailed(true)}
                      />
                      {/* subtle theme chip on the image */}
                      <span className="absolute bottom-2 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold text-white bg-black/40 backdrop-blur-sm">
                        <span>{themeVisual.emoji}</span>
                        <span>{themeVisual.label}</span>
                      </span>
                    </div>
                  ) : (
                    <div
                      className={cn(
                        'w-full h-44 md:h-52 flex flex-col items-center justify-center text-white bg-gradient-to-br relative overflow-hidden',
                        themeVisual.gradient
                      )}
                    >
                      {/* decorative soft circles */}
                      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/15" />
                      <div className="absolute -bottom-10 -left-6 w-40 h-40 rounded-full bg-white/10" />
                      <span className="text-6xl drop-shadow-md mb-1">{themeVisual.emoji}</span>
                      <span className="text-sm font-semibold uppercase tracking-wide opacity-90">
                        {themeVisual.label}
                      </span>
                    </div>
                  )}
                </div>

                <div className="prose prose-lg max-w-none dark:prose-invert">
                  {!bionicReading ? (
                    <TextWithGlossary
                      text={text.text}
                      grade={text.grade}
                      className={cn(
                        "leading-relaxed text-slate-700 dark:text-slate-300",
                        textSizeClasses[textSize]
                      )}
                    />
                  ) : (
                    <div className="space-y-4">
                      {(() => {
                        let paragraphStart = 0;
                        return text.text.split('\n\n').map((para, idx) => {
                          let offset = paragraphStart;
                          paragraphStart += para.length + 2;
                          return (
                            <p
                              key={idx}
                              className={cn(
                                "leading-relaxed text-slate-700 dark:text-slate-300 mb-4 last:mb-0",
                                textSizeClasses[textSize]
                              )}
                            >
                              {para.split(/(\s+)/).map((part, i) => {
                                offset += part.length;
                                if (/^\s+$/.test(part)) return <span key={i}>{part}</span>;
                                return (
                                  <span key={i}>
                                    {bionicReading ? bionicWord(part) : part}
                                  </span>
                                );
                              })}
                            </p>
                          );
                        });
                      })()}
                    </div>
                  )}
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
              <Button onClick={() => setShowText(true)} variant="outline" className="w-full">
                ← Show text again
              </Button>
            </div>

            {/* Progress Bar */}
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border-white/20 shadow-xl overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    Question {currentQuestion + 1} of {totalQuestions}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                    {Object.keys(answers).length}/{totalQuestions} answered
                  </span>
                </div>
                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={currentQuestion + 1}
                  aria-valuemin={1}
                  aria-valuemax={totalQuestions}
                  aria-label={`Question ${currentQuestion + 1} of ${totalQuestions}`}
                >
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
                        ← Previous
                      </Button>
                      {isLastQuestion ? (
                        <Button
                          onClick={handleSubmit}
                          disabled={!allAnswered}
                          variant={allAnswered ? "success" : "secondary"}
                          size="lg"
                          className="flex-1 text-lg font-bold"
                        >
                          {allAnswered ? 'Submit answers!' : `Answer all (${Object.keys(answers).length}/${totalQuestions})`}
                        </Button>
                      ) : (
                        <Button
                          onClick={handleNext}
                          disabled={selectedAnswer === undefined}
                          variant={selectedAnswer !== undefined ? "gradient" : "secondary"}
                          className="flex-1"
                        >
                          {selectedAnswer !== undefined ? 'Next question →' : 'Choose an answer first'}
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
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">Overview</h4>
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
                {/* Type legend – counts only; question order can mix the two types */}
                <div className="flex gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
                  <span>🔍 {literalQuestions.length} On the Lines</span>
                  <span>🧠 {inferenceQuestions.length} Between the Lines</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
