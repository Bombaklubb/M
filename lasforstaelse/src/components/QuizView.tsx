import React, { useState } from 'react';
import { LibraryText, UserAnswers } from '../types';

interface QuizViewProps {
  text: LibraryText;
  onComplete: (answers: UserAnswers) => void;
  onShowText: () => void;
}

const QUESTION_TYPE_LABELS: Record<string, { label: string; emoji: string; category: string }> = {
  literal: { label: 'Hitta i texten', emoji: '🔍', category: 'På raderna' },
  inferens: { label: 'Tänk efter', emoji: '🧠', category: 'Mellan raderna' },
  ord: { label: 'Ordförståelse', emoji: '📝', category: 'Ordkunskap' },
  sammanfatta: { label: 'Sammanfatta', emoji: '📋', category: 'Sammanfattning' },
};

export const QuizView: React.FC<QuizViewProps> = ({
  text,
  onComplete,
}) => {
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showText, setShowText] = useState(true);

  const questions = text.questions;
  const totalQuestions = questions.length;
  const currentQ = questions[currentQuestion];
  const typeInfo = QUESTION_TYPE_LABELS[currentQ.type] || {
    label: 'Fråga',
    emoji: '❓',
    category: 'Fråga',
  };

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: answer }));
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
  const allAnswered = questions.every((_, i) => answers[i]?.trim());
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  // Split text into paragraphs
  const paragraphs = text.text.split('\n').filter((p) => p.trim().length > 0);

  return (
    <div className="min-h-screen bg-sky-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-slate-800">{text.title}</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-slate-500">Åk {text.grade}</span>
            <span className="text-slate-300">•</span>
            <span className="text-sm text-slate-500">
              {text.genre === 'berättelse' ? '📖 Berättelse' : '📰 Faktatext'}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-sm text-slate-500">{text.meta.wordCount} ord</span>
          </div>
        </div>
      </div>

      {/* Main Content - Side by Side Layout */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: Text Content */}
          <div className={`${showText ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 h-fit lg:sticky lg:top-4">
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h3 className="font-bold text-slate-700">Texten</h3>
                <button
                  onClick={() => setShowText(false)}
                  className="text-sm text-indigo-600 font-medium"
                >
                  Visa frågor →
                </button>
              </div>
              <div className="prose prose-lg max-w-none">
                <div className="space-y-4">
                  {paragraphs.map((para, idx) => (
                    <p key={idx} className="text-base leading-relaxed text-slate-700">
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
                className="w-full py-3 bg-indigo-100 text-indigo-700 rounded-xl font-medium"
              >
                ← Visa texten igen
              </button>
            </div>

            {/* Progress Bar */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-700">
                  Fråga {currentQuestion + 1} av {totalQuestions}
                </span>
                <span className="text-sm text-slate-500">
                  {Object.keys(answers).filter((k) => answers[Number(k)]?.trim()).length}/{totalQuestions} besvarade
                </span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-indigo-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Current Question */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="mb-4">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 bg-indigo-100 text-indigo-700 font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm">
                    {currentQuestion + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{typeInfo.emoji}</span>
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-medium">
                        {typeInfo.label}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">
                      {currentQ.q}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Answer Input */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Ditt svar:
                </label>
                <textarea
                  value={answers[currentQuestion] || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  placeholder="Skriv ditt svar här..."
                  className="w-full p-4 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                  rows={3}
                />
              </div>

              {/* Navigation Buttons */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="px-4 py-2 rounded-lg border-2 border-slate-300 text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                        : 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {allAnswered ? '✅ Rätta svaren!' : `Svara på alla (${Object.keys(answers).filter((k) => answers[Number(k)]?.trim()).length}/${totalQuestions})`}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Nästa fråga →
                  </button>
                )}
              </div>
            </div>

            {/* All Questions Overview */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h4 className="text-sm font-bold text-slate-700 mb-3">Översikt</h4>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestion(idx)}
                    className={`aspect-square rounded-lg font-bold text-sm transition-all ${
                      idx === currentQuestion
                        ? 'bg-indigo-600 text-white shadow-md'
                        : answers[idx]?.trim()
                        ? 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
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
