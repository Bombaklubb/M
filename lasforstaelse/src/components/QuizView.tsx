import React, { useState } from 'react';
import { LibraryText, UserAnswers } from '../types';

interface QuizViewProps {
  text: LibraryText;
  onComplete: (answers: UserAnswers) => void;
  onShowText: () => void;
}

const QUESTION_TYPE_LABELS: Record<string, { label: string; emoji: string }> = {
  literal: { label: 'Hitta i texten', emoji: '🔍' },
  inferens: { label: 'Tänk efter', emoji: '🧠' },
  ord: { label: 'Ordförståelse', emoji: '📝' },
  sammanfatta: { label: 'Sammanfatta', emoji: '📋' },
};

export const QuizView: React.FC<QuizViewProps> = ({
  text,
  onComplete,
  onShowText,
}) => {
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const questions = text.questions;
  const totalQuestions = questions.length;
  const currentQ = questions[currentQuestion];
  const typeInfo = QUESTION_TYPE_LABELS[currentQ.type] || {
    label: 'Fråga',
    emoji: '❓',
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
  const hasCurrentAnswer = answers[currentQuestion]?.trim();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-600">
            Fråga {currentQuestion + 1} av {totalQuestions}
          </span>
          <button
            onClick={onShowText}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            📖 Visa texten igen
          </button>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3">
          <div
            className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestion + 1) / totalQuestions) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">{typeInfo.emoji}</span>
          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-medium">
            {typeInfo.label}
          </span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">
          {currentQ.q}
        </h2>

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
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-slate-200 text-slate-700 hover:bg-slate-300"
        >
          ← Föregående
        </button>

        {/* Question dots */}
        <div className="flex gap-2 flex-wrap justify-center">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-8 h-8 rounded-full font-bold text-sm transition-all ${
                index === currentQuestion
                  ? 'bg-indigo-600 text-white'
                  : answers[index]
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            className="px-6 py-3 rounded-xl font-bold transition-all bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl"
          >
            Rätta! ✓
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!hasCurrentAnswer}
            className="px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Nästa →
          </button>
        )}
      </div>
    </div>
  );
};
