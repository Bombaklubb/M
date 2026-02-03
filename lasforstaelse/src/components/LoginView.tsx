import React, { useState } from 'react';

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
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-8xl mb-4">📚</div>
          <h1 className="text-4xl font-extrabold text-indigo-900 mb-2">
            Läsförståelse
          </h1>
          <p className="text-slate-600 text-lg">
            Träna din läsning med roliga texter!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-lg font-bold text-slate-700 mb-2"
            >
              Vad heter du?
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Skriv ditt namn..."
              className="w-full p-4 text-xl rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 focus:outline-none transition-colors"
              autoFocus
              maxLength={30}
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-4 px-6 rounded-xl bg-indigo-600 text-white font-bold text-xl shadow-lg hover:bg-indigo-700 hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
          >
            Börja läsa!
          </button>
        </form>

        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>Ingen inloggning krävs - skriv bara ditt namn!</p>
        </div>
      </div>
    </div>
  );
};
