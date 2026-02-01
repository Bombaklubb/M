import React, { useState } from 'react';
import { ReadingExercise, UserAnswers, TEXT_TYPES } from '../types';
import { Button } from './Button';
import { getBandForLevel } from '../utils/levelBands';

interface ReadingViewProps {
  data: ReadingExercise;
  onComplete: (answers: UserAnswers) => void;
}

export const ReadingView: React.FC<ReadingViewProps> = ({ data, onComplete }) => {
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Split content into paragraphs for better readability
  const paragraphs = data.content.split('\n').filter(p => p.trim().length > 0);

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < data.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    onComplete(answers);
  };

  const allQuestionsAnswered = data.questions.every(q => answers[q.id]);
  const currentQuestion = data.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / data.questions.length) * 100;

  // Find text type label and icon
  const textTypeInfo = TEXT_TYPES.find(t => t.value === data.textType);
  const bandInfo = getBandForLevel(data.level);

  return (
    <div className="min-h-screen bg-sky-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-slate-800">{data.title}</h2>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm text-slate-500">
              Nivå {data.level} ({bandInfo.schoolStage}{bandInfo.gradeRange ? ' ' + bandInfo.gradeRange : ''})
            </p>
            {textTypeInfo && (
              <>
                <span className="text-slate-300">•</span>
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  <span>{textTypeInfo.icon}</span>
                  <span>{textTypeInfo.label}</span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - Side by Side Layout */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: Text Content */}
          <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 h-fit lg:sticky lg:top-4">
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

          {/* Right: Questions */}
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-700">
                  Fråga {currentQuestionIndex + 1} av {data.questions.length}
                </span>
                <span className="text-sm text-slate-500">
                  {Object.keys(answers).length}/{data.questions.length} besvarade
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
                    {currentQuestionIndex + 1}
                  </span>
                  <h3 className="text-lg font-bold text-slate-800 flex-1 pt-1">
                    {currentQuestion.question}
                  </h3>
                </div>
              </div>

              {/* Answer Options */}
              <div className="space-y-3">
                {currentQuestion.options?.map((option, idx) => {
                  const isSelected = answers[currentQuestion.id] === option;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-600 shadow-md'
                          : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-600'
                            : 'border-slate-300'
                        }`}>
                          {isSelected && (
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className={`flex-1 font-medium ${
                          isSelected ? 'text-indigo-900' : 'text-slate-700'
                        }`}>
                          {option}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Buttons */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 rounded-lg border-2 border-slate-300 text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ← Föregående
                </button>
                {currentQuestionIndex < data.questions.length - 1 ? (
                  <button
                    onClick={handleNextQuestion}
                    className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Nästa fråga →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!allQuestionsAnswered}
                    className={`flex-1 px-8 py-5 rounded-xl text-xl font-extrabold transition-all border-2 ${
                      allQuestionsAnswered
                        ? 'bg-green-600 hover:bg-green-700 text-white border-green-700 shadow-lg hover:shadow-xl hover:scale-105'
                        : 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {allQuestionsAnswered ? '✅ Skicka in ditt svar' : `Svara på alla frågor först (${Object.keys(answers).length}/${data.questions.length})`}
                  </button>
                )}
              </div>
            </div>

            {/* All Questions Overview */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h4 className="text-sm font-bold text-slate-700 mb-3">Översikt</h4>
              <div className="space-y-3">
                {/* På raderna - Fråga 1-3 */}
                <div>
                  <p className="text-xs text-slate-500 mb-1">På raderna (fakta)</p>
                  <div className="grid grid-cols-3 gap-2">
                    {data.questions.slice(0, 3).map((q, idx) => (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`aspect-square rounded-lg font-bold text-sm transition-all ${
                          idx === currentQuestionIndex
                            ? 'bg-indigo-600 text-white shadow-md'
                            : answers[q.id]
                            ? 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Mellan raderna - Fråga 4-6 */}
                <div>
                  <p className="text-xs text-slate-500 mb-1">Mellan raderna (förståelse)</p>
                  <div className="grid grid-cols-3 gap-2">
                    {data.questions.slice(3, 6).map((q, idx) => (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestionIndex(idx + 3)}
                        className={`aspect-square rounded-lg font-bold text-sm transition-all ${
                          idx + 3 === currentQuestionIndex
                            ? 'bg-indigo-600 text-white shadow-md'
                            : answers[q.id]
                            ? 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {idx + 4}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
