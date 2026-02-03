import React from 'react';
import { LibraryText } from '../types';

interface ReadingViewProps {
  text: LibraryText;
  onStartQuiz: () => void;
}

export const ReadingView: React.FC<ReadingViewProps> = ({ text, onStartQuiz }) => {
  const genreEmoji = text.genre === 'berättelse' ? '📖' : '📰';
  const genreLabel = text.genre === 'berättelse' ? 'Berättelse' : 'Faktatext';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
            Åk {text.grade}
          </span>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold">
            {genreEmoji} {genreLabel}
          </span>
          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm">
            {text.meta.wordCount} ord
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">
          {text.title}
        </h1>
      </div>

      {/* Text content */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
        <div className="prose prose-lg max-w-none">
          {text.text.split('\n').map((paragraph, index) => (
            <p key={index} className="text-slate-700 leading-relaxed mb-4 last:mb-0">
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
