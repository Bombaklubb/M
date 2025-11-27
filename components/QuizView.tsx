import React, { useState } from 'react';
import { ReadingExercise, UserAnswers, QuestionType } from '../types';
import { Button } from './Button';

interface QuizViewProps {
  data: ReadingExercise;
  onComplete: (answers: UserAnswers) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ data, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [textInput, setTextInput] = useState('');

  const question = data.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === data.questions.length - 1;

  const handleAnswer = (answer: string) => {
    // Save current answer
    const newAnswers = { ...answers, [question.id]: answer };
    setAnswers(newAnswers);
    setTextInput(''); // Clear text input if any

    if (isLastQuestion) {
      onComplete(newAnswers);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      handleAnswer(textInput);
    }
  };

  const progress = ((currentQuestionIndex) / data.questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 min-h-screen flex flex-col">
      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-4 mb-8 overflow-hidden">
        <div 
          className="bg-teal-500 h-4 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-grow">
        <div className="bg-white rounded-3xl shadow-xl p-8 border-b-8 border-indigo-100 relative">
          <div className="absolute top-4 right-6 text-slate-300 font-black text-6xl opacity-20 select-none">
            {currentQuestionIndex + 1}
          </div>
          
          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold uppercase tracking-wider mb-4">
            {question.type === QuestionType.MULTIPLE_CHOICE && 'Flerval'}
            {question.type === QuestionType.TRUE_FALSE && 'Sant eller Falskt'}
            {(question.type === QuestionType.SHORT_ANSWER || question.type === QuestionType.REASONING) && 'Skriv själv'}
          </span>

          <h3 className="text-2xl font-bold text-slate-800 mb-8 pr-8">
            {question.question}
          </h3>

          <div className="space-y-4">
            {/* Multiple Choice Options */}
            {question.type === QuestionType.MULTIPLE_CHOICE && question.options && (
              <div className="grid gap-4">
                {question.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    className="w-full text-left p-4 rounded-xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all font-medium text-slate-700 group"
                  >
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 text-slate-600 font-bold mr-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            )}

            {/* True / False Options */}
            {question.type === QuestionType.TRUE_FALSE && (
              <div className="flex gap-4">
                <button
                  onClick={() => handleAnswer("Sant")}
                  className="flex-1 py-6 rounded-xl border-2 border-green-100 bg-green-50 text-green-700 font-bold hover:bg-green-100 hover:border-green-300 transition-all text-xl"
                >
                  ✅ Sant
                </button>
                <button
                  onClick={() => handleAnswer("Falskt")}
                  className="flex-1 py-6 rounded-xl border-2 border-red-100 bg-red-50 text-red-700 font-bold hover:bg-red-100 hover:border-red-300 transition-all text-xl"
                >
                  ❌ Falskt
                </button>
              </div>
            )}

            {/* Text Input Options */}
            {(question.type === QuestionType.SHORT_ANSWER || question.type === QuestionType.REASONING) && (
              <div className="space-y-4">
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Skriv ditt svar här..."
                  className="w-full h-40 p-4 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none resize-none font-medium text-lg"
                />
                <Button 
                  onClick={handleTextSubmit} 
                  fullWidth 
                  disabled={!textInput.trim()}
                >
                  Svara
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center text-slate-400 font-medium text-sm">
        Fråga {currentQuestionIndex + 1} av {data.questions.length}
      </div>
    </div>
  );
};