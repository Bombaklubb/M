import React, { useState } from 'react';
import { LibraryText, UserAnswers } from '../types';

interface QuizViewProps {
  text: LibraryText;
  onComplete: (answers: UserAnswers) => void;
  onShowText: () => void;
}

const QUESTION_TYPE_LABELS: Record<string, { label: string; emoji: string; category: string }> = {
  literal: { label: 'På raderna', emoji: '🔍', category: 'På raderna' },
  inferens: { label: 'Mellan raderna', emoji: '🧠', category: 'Mellan raderna' },
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
    <div className="min-h-screen bg-sky-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{text.title}</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-slate-500 dark:text-slate-400">{text.grade === 10 ? 'Gymnasiet' : `Åk ${text.grade}`}</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {text.genre === 'berättelse' ? '📖 Berättelse' : '📰 Faktatext'}
            </span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">{wordCount} ord</span>
          </div>
        </div>
      </div>

      {/* Main Content - Side by Side Layout */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: Text Content */}
          <div className={`${showText ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 lg:p-8 h-fit lg:sticky lg:top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-700 dark:text-slate-200">{text.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">Storlek:</span>
                  <button
                    onClick={() => setTextSize('small')}
                    className={`w-6 h-6 rounded font-bold text-xs transition-all ${
                      textSize === 'small'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                    title="Liten text"
                  >
                    A
                  </button>
                  <button
                    onClick={() => setTextSize('medium')}
                    className={`w-6 h-6 rounded font-bold text-sm transition-all ${
                      textSize === 'medium'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                    title="Medium text"
                  >
                    A
                  </button>
                  <button
                    onClick={() => setTextSize('large')}
                    className={`w-6 h-6 rounded font-bold text-base transition-all ${
                      textSize === 'large'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                    title="Stor text"
                  >
                    A
                  </button>
                  <button
                    onClick={() => setShowText(false)}
                    className="text-sm text-indigo-600 dark:text-indigo-400 font-medium ml-2 lg:hidden"
                  >
                    Visa frågor →
                  </button>
                </div>
              </div>
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <div className="space-y-4">
                  {paragraphs.map((para, idx) => (
                    <p key={idx} className={`leading-relaxed text-slate-700 dark:text-slate-300 ${textSizeClasses[textSize]}`}>
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Questions */}
          <div className={`space-y-4 ${!showText ? 'block' : 'hidden lg:block'}`}>
            {/* Mobile: Show text button */}
            <div className="lg:hidden">
              <button
                onClick={() => setShowText(true)}
                className="w-full py-3 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-xl font-medium"
              >
                ← Visa texten igen
              </button>
            </div>

            {/* Progress Bar */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  Fråga {currentQuestion + 1} av {totalQuestions}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {Object.keys(answers).length}/{totalQuestions} besvarade
                </span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-indigo-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Current Question */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="mb-4">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm">
                    {currentQuestion + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{typeInfo.emoji}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        currentQ.type === 'literal'
                          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                          : 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                      }`}>
                        {typeInfo.label}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">
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
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-md'
                          : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                      }`}>
                        {optionLetter}
                      </span>
                      <span className={`text-base ${isSelected ? 'text-indigo-900 dark:text-indigo-200 font-medium' : 'text-slate-700 dark:text-slate-300'}`}>
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Buttons */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ← Föregående
                </button>
                {isLastQuestion ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!allAnswered}
                    className={`flex-1 px-8 py-3 rounded-xl text-lg font-extrabold transition-all border-2 ${
                      allAnswered
                        ? 'bg-green-600 hover:bg-green-700 text-white border-green-700 shadow-lg hover:shadow-xl hover:scale-105'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {allAnswered ? '✅ Rätta svaren!' : `Svara på alla (${Object.keys(answers).length}/${totalQuestions})`}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Nästa fråga →
                  </button>
                )}
              </div>
            </div>

            {/* All Questions Overview */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">Översikt</h4>
              <div className="grid grid-cols-6 gap-2">
                {questions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestion(idx)}
                    className={`aspect-square rounded-lg font-bold text-sm transition-all ${
                      idx === currentQuestion
                        ? 'bg-indigo-600 text-white shadow-md'
                        : answers[idx] !== undefined
                        ? 'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-900/70'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
