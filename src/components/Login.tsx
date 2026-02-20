import React, { useState } from 'react';
import { Grade, GRADE_LABELS } from '../types';
import { findOrCreateStudent } from '../utils/storage';
import { useApp } from '../contexts/AppContext';

const AVATARS = ['🦁', '🐼', '🦊', '🐸', '🦋', '🐢', '🦄', '🐉'];

const GRADES: Grade[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'gym1', 'gym2', 'gym3'];

const GRADE_GROUPS = [
  { label: 'Lågstadiet', grades: ['1', '2', '3'] as Grade[] },
  { label: 'Mellanstadiet', grades: ['4', '5', '6'] as Grade[] },
  { label: 'Högstadiet', grades: ['7', '8', '9'] as Grade[] },
  { label: 'Gymnasiet', grades: ['gym1', 'gym2', 'gym3'] as Grade[] },
];

export default function Login() {
  const { login, setView } = useApp();
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<Grade | ''>('');
  const [avatar, setAvatar] = useState(0);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'name' | 'grade' | 'avatar'>('name');

  function handleNameNext() {
    if (name.trim().length < 2) {
      setError('Skriv ditt namn (minst 2 bokstäver)');
      return;
    }
    setError('');
    setStep('grade');
  }

  function handleGradeNext() {
    if (!grade) {
      setError('Välj din klass');
      return;
    }
    setError('');
    setStep('avatar');
  }

  function handleLogin() {
    if (!grade) return;
    const student = findOrCreateStudent(name.trim(), grade, avatar);
    login(student);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['➕', '➖', '✖️', '➗', '=', 'π', '∑', '√'].map((s, i) => (
          <span
            key={i}
            className="absolute text-white/10 text-6xl font-bold select-none"
            style={{
              top: `${10 + (i * 12) % 80}%`,
              left: `${5 + (i * 13) % 90}%`,
              transform: `rotate(${i * 25}deg)`,
            }}
          >
            {s}
          </span>
        ))}
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🧮</div>
          <h1 className="text-4xl font-black text-white drop-shadow-lg">MatematikAppen</h1>
          <p className="text-blue-100 mt-2 text-lg">Lär dig matte på ett roligt sätt!</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Step indicator */}
          <div className="flex justify-center gap-2 mb-6">
            {['name', 'grade', 'avatar'].map((s, i) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  step === s ? 'w-8 bg-blue-500' :
                  (['name', 'grade', 'avatar'].indexOf(step) > i) ? 'w-4 bg-blue-300' :
                  'w-4 bg-gray-200'
                }`}
              />
            ))}
          </div>

          {step === 'name' && (
            <div className="animate-slide-up">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Hej! Vad heter du?</h2>
              <p className="text-gray-500 mb-4">Skriv ditt förnamn för att börja</p>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleNameNext()}
                placeholder="Ditt namn..."
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-lg font-semibold focus:outline-none focus:border-blue-500 transition-colors"
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <button
                onClick={handleNameNext}
                className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-2xl text-lg hover:shadow-lg hover:scale-105 transition-all"
              >
                Nästa →
              </button>
            </div>
          )}

          {step === 'grade' && (
            <div className="animate-slide-up">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Vilken klass går du i?</h2>
              <p className="text-gray-500 mb-4">Hej {name}! Välj din klass</p>
              <div className="space-y-3">
                {GRADE_GROUPS.map(group => (
                  <div key={group.label}>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                      {group.label}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {group.grades.map(g => (
                        <button
                          key={g}
                          onClick={() => setGrade(g)}
                          className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                            grade === g
                              ? 'bg-blue-500 text-white shadow-md scale-105'
                              : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                          }`}
                        >
                          {GRADE_LABELS[g]}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setStep('name')}
                  className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-2xl hover:bg-gray-200 transition-colors"
                >
                  ← Tillbaka
                </button>
                <button
                  onClick={handleGradeNext}
                  className="flex-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-2xl hover:shadow-lg hover:scale-105 transition-all"
                >
                  Nästa →
                </button>
              </div>
            </div>
          )}

          {step === 'avatar' && (
            <div className="animate-slide-up">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Välj din figur!</h2>
              <p className="text-gray-500 mb-4">Vem vill du vara?</p>
              <div className="grid grid-cols-4 gap-3">
                {AVATARS.map((a, i) => (
                  <button
                    key={i}
                    onClick={() => setAvatar(i)}
                    className={`text-4xl p-3 rounded-2xl transition-all ${
                      avatar === i
                        ? 'bg-blue-100 ring-2 ring-blue-500 scale-110'
                        : 'bg-gray-50 hover:bg-blue-50 hover:scale-105'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setStep('grade')}
                  className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-2xl hover:bg-gray-200 transition-colors"
                >
                  ← Tillbaka
                </button>
                <button
                  onClick={handleLogin}
                  className="flex-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-2xl text-lg hover:shadow-lg hover:scale-105 transition-all"
                >
                  {AVATARS[avatar]} Börja lär dig!
                </button>
              </div>
            </div>
          )}

          {/* Teacher link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setView('teacher-login')}
              className="text-gray-400 text-sm hover:text-gray-600 transition-colors"
            >
              Lärare? Klicka här
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
