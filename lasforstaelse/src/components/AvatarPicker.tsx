import React from 'react';
import { AVATAR_OPTIONS } from '../types';

interface AvatarPickerProps {
  selectedAvatar: string;
  onSelect: (avatar: string) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({
  selectedAvatar,
  onSelect,
  onClose,
  isModal = false,
}) => {
  const content = (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-5 md:p-7 shadow-[0_8px_30px_rgba(79,70,229,0.12)] border-2 border-indigo-100 dark:border-slate-700">
      {isModal && (
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-indigo-900 dark:text-white">
            Välj din avatar
          </h3>
          <button
            onClick={onClose}
            className="p-2.5 bg-white dark:bg-slate-700 hover:bg-indigo-100 dark:hover:bg-slate-600 rounded-xl shadow-md border-2 border-indigo-100 dark:border-slate-600 transition-all duration-200 hover:scale-105 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-indigo-500 dark:text-slate-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-2.5 md:gap-3 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent">
        {AVATAR_OPTIONS.map((avatar) => (
          <button
            key={avatar}
            onClick={() => onSelect(avatar)}
            className={`
              w-12 h-12 md:w-14 md:h-14 text-2xl md:text-3xl rounded-2xl flex items-center justify-center
              transition-all duration-200 cursor-pointer
              ${
                selectedAvatar === avatar
                  ? 'bg-gradient-to-br from-purple-400 to-indigo-500 shadow-[0_6px_20px_rgba(139,92,246,0.4),inset_0_-2px_4px_rgba(0,0,0,0.1)] scale-110 border-3 border-white dark:border-slate-600 ring-2 ring-purple-300'
                  : 'bg-white dark:bg-slate-700 shadow-[0_4px_12px_rgba(0,0,0,0.08),inset_0_-2px_4px_rgba(0,0,0,0.04)] border-2 border-indigo-100 dark:border-slate-600 hover:shadow-[0_6px_16px_rgba(79,70,229,0.2)] hover:scale-105 hover:border-indigo-300 dark:hover:border-indigo-500'
              }
            `}
          >
            <span className={selectedAvatar === avatar ? 'drop-shadow-md' : ''}>
              {avatar}
            </span>
          </button>
        ))}
      </div>

      {isModal && (
        <button
          onClick={onClose}
          className="w-full mt-5 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-2xl shadow-[0_4px_14px_rgba(249,115,22,0.4),inset_0_-2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border-2 border-orange-400 cursor-pointer"
        >
          Klar
        </button>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="max-w-sm w-full animate-in fade-in zoom-in duration-200">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
