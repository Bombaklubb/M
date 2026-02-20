import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { verifyTeacherPin } from '../utils/storage';

export default function TeacherLogin() {
  const { setTeacher, setView } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [digits, setDigits] = useState(['', '', '', '']);

  function handleDigit(i: number, val: string) {
    if (!/^\d*$/.test(val)) return;
    const next = [...digits];
    next[i] = val.slice(-1);
    setDigits(next);
    const joined = next.join('');
    if (joined.length === 4) {
      if (verifyTeacherPin(joined)) {
        setTeacher(true);
      } else {
        setError('Fel PIN-kod. Försök igen.');
        setTimeout(() => {
          setDigits(['', '', '', '']);
          setError('');
        }, 1200);
      }
    }
    // Auto-focus next
    if (val && i < 3) {
      const el = document.getElementById(`pin-${i + 1}`);
      el?.focus();
    }
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      const el = document.getElementById(`pin-${i - 1}`);
      el?.focus();
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">👩‍🏫</div>
          <h1 className="text-2xl font-black text-gray-800">Lärarvy</h1>
          <p className="text-gray-500 mt-1">Ange PIN-kod för att logga in</p>
          <p className="text-xs text-gray-400 mt-1">(Standard PIN: 1234)</p>
        </div>

        <div className="flex justify-center gap-3 mb-6">
          {digits.map((d, i) => (
            <input
              key={i}
              id={`pin-${i}`}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => handleDigit(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className={`w-14 h-14 text-center text-2xl font-black border-2 rounded-2xl focus:outline-none transition-colors ${
                error ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-center text-sm mb-4 animate-bounce">{error}</p>
        )}

        <button
          onClick={() => setView('login')}
          className="w-full text-gray-400 hover:text-gray-600 text-sm transition-colors"
        >
          ← Tillbaka till elevlogin
        </button>
      </div>
    </div>
  );
}
