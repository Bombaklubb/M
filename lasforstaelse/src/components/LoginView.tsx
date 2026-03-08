import React, { useState } from 'react';
import { BookLogo } from './BookLogo';
import { AvatarPicker } from './AvatarPicker';
import { AVATAR_OPTIONS } from '../types';

interface LoginViewProps {
  onLogin: (name: string, avatar: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim(), selectedAvatar);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-[0_12px_40px_rgba(79,70,229,0.15)] p-8 md:p-12 max-w-md w-full border-2 border-indigo-100">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <BookLogo size={180} />
          </div>
          <p className="text-indigo-400 text-lg font-medium">
            Din smarta läskompis
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-base font-bold text-indigo-900 mb-2"
            >
              Vad heter du?
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=""
              className="w-full p-4 text-lg rounded-2xl bg-white border-2 border-indigo-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none transition-all duration-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)]"
              autoFocus
              maxLength={30}
            />
          </div>

          <div>
            <label className="block text-base font-bold text-indigo-900 mb-3">
              Välj din avatar
            </label>
            <AvatarPicker
              selectedAvatar={selectedAvatar}
              onSelect={setSelectedAvatar}
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className={`w-full py-4 px-6 rounded-2xl text-white font-bold text-xl transition-all duration-200 cursor-pointer ${
              name.trim()
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-[0_6px_20px_rgba(249,115,22,0.35),inset_0_-2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_25px_rgba(249,115,22,0.45)] hover:scale-[1.02] active:scale-[0.98] border-2 border-orange-400'
                : 'bg-slate-200 border-2 border-slate-300 cursor-not-allowed shadow-none'
            }`}
          >
            Börja din läsning
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-indigo-100 text-center text-indigo-300 text-sm">
          <p>Läsjakten hjälper dig att träna läsförståelse på din nivå</p>
        </div>
      </div>

      {/* Signatur */}
      <div className="fixed bottom-2 right-3 text-xs text-indigo-300 opacity-60 hover:opacity-100 transition-opacity">
        Läsjakten av Martin Akdogan
      </div>
    </div>
  );
};
