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
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 md:p-6 shadow-xl">
      {isModal && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            Välj din avatar
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="grid grid-cols-6 gap-2 md:gap-3">
        {AVATAR_OPTIONS.map((avatar) => (
          <button
            key={avatar}
            onClick={() => onSelect(avatar)}
            className={`w-12 h-12 md:w-14 md:h-14 text-2xl md:text-3xl rounded-xl flex items-center justify-center transition-all ${
              selectedAvatar === avatar
                ? 'bg-purple-100 dark:bg-purple-900 ring-3 ring-purple-500 scale-110'
                : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 hover:scale-105'
            }`}
          >
            {avatar}
          </button>
        ))}
      </div>

      {isModal && (
        <button
          onClick={onClose}
          className="w-full mt-4 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition"
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
