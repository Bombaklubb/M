import React, { useState } from 'react';
import { LibraryText } from '../types';

interface ReadingViewProps {
  text: LibraryText;
  onStartQuiz: () => void;
}

type TextSize = 'small' | 'medium' | 'large';

const textSizeClasses: Record<TextSize, string> = {
  small: 'text-base',
  medium: 'text-lg',
  large: 'text-xl'
};

export const ReadingView: React.FC<ReadingViewProps> = ({ text, onStartQuiz }) => {
  const [textSize, setTextSize] = useState<TextSize>('medium');

  const genreEmoji = text.genre === 'berättelse' ? '📖' : '📰';
  const genreLabel = text.genre === 'berättelse' ? 'Berättelse' : 'Faktatext';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold dark:bg-indigo-900 dark:text-indigo-200">
            {text.grade === 10 ? 'Gymnasiet' : `Åk ${text.grade}`}
          </span>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold dark:bg-purple-900 dark:text-purple-200">
            {genreEmoji} {genreLabel}
          </span>
          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm dark:bg-slate-700 dark:text-slate-300">
            {text.meta.wordCount} ord
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100">
          {text.title}
        </h1>
      </div>

      {/* Text size selector */}
      <div className="flex items-center justify-end gap-2 mb-4">
        <span className="text-sm text-slate-500 dark:text-slate-400 mr-2">Textstorlek:</span>
        <button
          onClick={() => setTextSize('small')}
          className={`w-8 h-8 rounded-lg font-bold text-sm transition-all ${
            textSize === 'small'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
          }`}
          title="Liten text"
        >
          A
        </button>
        <button
          onClick={() => setTextSize('medium')}
          className={`w-8 h-8 rounded-lg font-bold text-base transition-all ${
            textSize === 'medium'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
          }`}
          title="Medium text"
        >
          A
        </button>
        <button
          onClick={() => setTextSize('large')}
          className={`w-8 h-8 rounded-lg font-bold text-lg transition-all ${
            textSize === 'large'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
          }`}
          title="Stor text"
        >
          A
        </button>
      </div>

      {/* Text content */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6 dark:bg-slate-800">
        <div className="prose prose-lg max-w-none">
          {text.text.split('\n').map((paragraph, index) => (
            <p key={index} className={`text-slate-700 dark:text-slate-200 leading-relaxed mb-4 last:mb-0 ${textSizeClasses[textSize]}`}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Action button */}
      <div className="text-center">
        <button
          onClick={onStartQuiz}
          className="px-8 py-4 bg-green-600 text-white text-xl font-bold rounded-xl shadow-lg hover:bg-green-700 hover:shadow-xl transform hover:scale-105 transition-all"
        >
          Jag har läst klart! →
        </button>
        <p className="text-slate-500 mt-3 text-sm">
          Du kan gå tillbaka och läsa texten igen under frågorna
        </p>
      </div>
    </div>
  );
};
