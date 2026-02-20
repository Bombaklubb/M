import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { verifyTeacherPin } from '../utils/storage';

export default function TeacherLogin() {
  const { setTeacher, setView } = useApp();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (verifyTeacherPin(password)) {
      setTeacher(true);
    } else {
      setError('Fel lösenord. Försök igen.');
      setPassword('');
      setTimeout(() => setError(''), 2000);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">👩‍🏫</div>
          <h1 className="text-2xl font-black text-gray-800">Lärarvy</h1>
          <p className="text-gray-500 mt-1 text-sm">Ange lösenord för att logga in</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Lösenord..."
              autoFocus
              className={`w-full border-2 rounded-2xl px-4 py-3.5 text-lg font-bold focus:outline-none transition-colors pr-12 ${
                error ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
              }`}
            />
            <button type="button" onClick={() => setShowPw(v => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">
              {showPw ? '🙈' : '👁️'}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-center text-sm animate-bounce">{error}</p>
          )}

          <button type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black py-4 rounded-2xl text-lg shadow-lg hover:scale-105 active:scale-95 transition-all">
            Logga in →
          </button>
        </form>

        <button
          onClick={() => setView('login')}
          className="w-full mt-4 text-gray-400 hover:text-gray-600 text-sm transition-colors text-center block"
        >
          ← Tillbaka till elevlogin
        </button>
      </div>
    </div>
  );
}
