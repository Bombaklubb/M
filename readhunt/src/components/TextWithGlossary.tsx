import React, { useState, useRef, useEffect } from 'react';
import { hasExplanation, getWordDefinition } from '../lib/dictionary';

interface TextWithGlossaryProps {
  text: string;
  className?: string;
}

export const TextWithGlossary: React.FC<TextWithGlossaryProps> = ({ text, className = '' }) => {
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Stäng tooltip vid klick utanför
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveWord(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleWordClick = (word: string, event: React.MouseEvent) => {
    if (!hasExplanation(word)) return;

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();

    if (containerRect) {
      setTooltipPosition({
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top,
      });
    }

    setActiveWord(activeWord === word ? null : word);
  };

  // Dela upp text i stycken och ord
  const renderText = () => {
    const paragraphs = text.split('\n\n');

    return paragraphs.map((paragraph, pIndex) => (
      <p key={pIndex} className="mb-4 last:mb-0">
        {paragraph.split(/(\s+)/).map((part, index) => {
          // Hantera whitespace
          if (/^\s+$/.test(part)) {
            return <span key={index}>{part}</span>;
          }

          // Extrahera ord utan skiljetecken
          const match = part.match(/^([^a-zåäöA-ZÅÄÖ]*)?([a-zåäöA-ZÅÄÖ]+)?([^a-zåäöA-ZÅÄÖ]*)?$/);
          if (!match) return <span key={index}>{part}</span>;

          const [, before = '', word = '', after = ''] = match;

          if (!word) return <span key={index}>{part}</span>;

          const hasDef = hasExplanation(word);
          const isActive = activeWord?.toLowerCase() === word.toLowerCase();

          return (
            <span key={index}>
              {before}
              {hasDef ? (
                <span
                  onClick={(e) => handleWordClick(word, e)}
                  className={`cursor-help border-b-2 border-dotted transition-colors ${
                    isActive
                      ? 'border-indigo-500 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                      : 'border-emerald-500 dark:border-slate-300 hover:border-indigo-500 hover:bg-emerald-50 dark:hover:bg-indigo-900/30'
                  }`}
                >
                  {word}
                </span>
              ) : (
                word
              )}
              {after}
            </span>
          );
        })}
      </p>
    ));
  };

  const wordDef = activeWord ? getWordDefinition(activeWord) : null;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {renderText()}

      {/* Tooltip */}
      {activeWord && wordDef && tooltipPosition && (
        <div
          className="absolute z-50 max-w-sm p-4 bg-slate-800 dark:bg-slate-700 text-white text-sm rounded-xl shadow-xl transform -translate-x-1/2 -translate-y-full -mt-2 animate-in fade-in zoom-in-95 duration-200"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
          }}
        >
          <div className="font-bold text-indigo-300 mb-1 capitalize text-base">{activeWord}</div>
          <div className="text-slate-200 mb-2">{wordDef.def}</div>
          {wordDef.ex && (
            <div className="text-slate-400 text-xs italic border-t border-slate-600 pt-2 mt-2">
              "{wordDef.ex}"
            </div>
          )}
          <div className="absolute left-1/2 -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-slate-800 dark:border-t-slate-700 transform -translate-x-1/2" />
        </div>
      )}

      {/* Info om klickbara ord */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
        <span className="inline-block w-6 border-b-2 border-dotted border-emerald-500 dark:border-slate-300"></span>
        <span>Click underlined words for a definition</span>
      </div>
    </div>
  );
};
