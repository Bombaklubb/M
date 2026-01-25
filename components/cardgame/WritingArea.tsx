import React, { useState, useRef, useEffect } from 'react';

interface WritingAreaProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  minHeight?: number;
  disabled?: boolean;
}

export const WritingArea: React.FC<WritingAreaProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Skriv din text här...',
  minHeight = 300,
  disabled = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Word count (approximate)
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  // Sentence count (approximate)
  const sentenceCount = value.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(minHeight, textareaRef.current.scrollHeight)}px`;
    }
  }, [value, minHeight]);

  return (
    <div className={`
      bg-white rounded-2xl shadow-md transition-all duration-300
      ${isFocused ? 'ring-2 ring-indigo-400 shadow-lg' : ''}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span>✏️</span>
          Skriv din text
        </h3>
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <span>{wordCount} ord</span>
          <span>{sentenceCount} meningar</span>
        </div>
      </div>

      {/* Textarea */}
      <div className="p-4">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full resize-none outline-none
            text-lg leading-relaxed text-slate-700
            placeholder:text-slate-400
            disabled:bg-slate-50 disabled:text-slate-400
          `}
          style={{ minHeight: `${minHeight}px` }}
        />
      </div>

      {/* Footer with submit button */}
      <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          Tips: Tryck Enter för ny rad/nytt stycke
        </p>
        <button
          onClick={onSubmit}
          disabled={disabled || value.trim().length < 10}
          className={`
            px-6 py-3 rounded-xl font-bold text-white
            transition-all duration-200
            ${disabled || value.trim().length < 10
              ? 'bg-slate-300 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 hover:shadow-lg hover:scale-105'
            }
          `}
        >
          Lämna in texten
        </button>
      </div>
    </div>
  );
};
