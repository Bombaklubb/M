import React, { useState } from 'react';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (username: string, role: UserRole) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim(), role);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="text-4xl font-extrabold text-slate-800 mb-2">
            Läs och lär
          </h1>
          <p className="text-slate-600 text-lg">
            Din smarta läskompis
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username input */}
          <div>
            <label htmlFor="username" className="block text-sm font-bold text-slate-700 mb-2">
              Vad heter du?
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Skriv ditt namn..."
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none transition-colors text-lg"
              autoFocus
              required
            />
          </div>

          {/* Role selection */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">
              Jag är en...
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole(UserRole.STUDENT)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  role === UserRole.STUDENT
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="text-3xl mb-1">🎓</div>
                <div className="font-bold">Elev</div>
              </button>
              <button
                type="button"
                onClick={() => setRole(UserRole.TEACHER)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  role === UserRole.TEACHER
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="text-3xl mb-1">👨‍🏫</div>
                <div className="font-bold">Lärare</div>
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!username.trim()}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {role === UserRole.STUDENT ? '🚀 Börja läsa!' : '📊 Till lärarvy'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            Läs och lär hjälper dig att träna läsförståelse på din nivå
          </p>
        </div>
      </div>
    </div>
  );
};
