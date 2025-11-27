import React from 'react';
import { ReadingExercise } from '../types';
import { Button } from './Button';

interface ReadingViewProps {
  data: ReadingExercise;
  onFinishedReading: () => void;
}

export const ReadingView: React.FC<ReadingViewProps> = ({ data, onFinishedReading }) => {
  // Split content into paragraphs for better readability
  const paragraphs = data.content.split('\n').filter(p => p.trim().length > 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-20">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-b-8 border-indigo-100">
        <div className="bg-indigo-600 px-8 py-6">
          <div className="flex justify-between items-center text-indigo-100 mb-2 text-sm font-bold uppercase tracking-wider">
             <span>Nivå {data.level}</span>
             <span>Läsning</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            {data.title}
          </h2>
        </div>
        
        <div className="p-8 md:p-12 space-y-6">
          {paragraphs.map((para, idx) => (
            <p key={idx} className="text-lg md:text-xl leading-relaxed text-slate-700">
              {para}
            </p>
          ))}
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-center sticky bottom-0 z-10">
          <Button onClick={onFinishedReading} className="shadow-xl">
            Jag har läst klart! Gå till frågorna 👉
          </Button>
        </div>
      </div>
    </div>
  );
};