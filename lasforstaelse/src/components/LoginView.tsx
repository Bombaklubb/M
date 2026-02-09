import React, { useState } from 'react';
import { BookLogo } from './BookLogo';

interface LoginViewProps {
  onLogin: (name: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <BookLogo size={80} />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-800 mb-2">
            Läsresan
          </h1>
          <p className="text-slate-500 text-lg">
            Din smarta läskompis
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-base font-bold text-slate-700 mb-2"
            >
              Vad heter du?
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Skriv ditt namn..."
              className="w-full p-4 text-lg rounded-xl bg-white border-2 border-slate-200 focus:border-purple-500 focus:outline-none transition-colors"
              autoFocus
              maxLength={30}
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className={`w-full py-4 px-6 rounded-xl text-white font-bold text-xl shadow-lg transition-all ${
              name.trim()
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 hover:shadow-xl transform hover:scale-[1.02]'
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            Börja din läsning
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200 text-center text-slate-400 text-sm">
          <p>Läsresan hjälper dig att träna läsförståelse på din nivå</p>
        </div>
      </div>
    </div>
  );
};
