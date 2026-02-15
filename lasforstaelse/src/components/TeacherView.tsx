import React, { useState, useEffect } from 'react';
import { getTeacherStats } from '../services/userService';

interface TeacherViewProps {
  onClose: () => void;
}

interface Stats {
  topGrades: Array<{ grade: number; count: number }>;
}

export const TeacherView: React.FC<TeacherViewProps> = ({ onClose }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Enkelt lösenord - kan ändras
    if (password === 'Korsängen') {
      setAuthenticated(true);
      loadStats();
    } else {
      setError('Fel lösenord');
    }
  };

  const loadStats = () => {
    const data = getTeacherStats();
    setStats({ topGrades: data.topGrades });
  };

  useEffect(() => {
    // Uppdatera varje minut om autentiserad
    if (authenticated) {
      const interval = setInterval(loadStats, 60000);
      return () => clearInterval(interval);
    }
  }, [authenticated]);

  // Inloggningsvy
  if (!authenticated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🔒</span>
            <h2 className="text-2xl font-bold text-slate-800">Lärarvy</h2>
          </div>
          <p className="text-slate-600 mb-6">Ange lösenord för att se statistik</p>

          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Lösenord"
            className="w-full p-4 border-2 border-slate-200 rounded-xl mb-4 focus:border-purple-500 focus:outline-none"
            autoFocus
          />

          {error && (
            <p className="text-red-600 text-sm mb-4">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleLogin}
              className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition"
            >
              Logga in
            </button>
            <button
              onClick={onClose}
              className="px-6 bg-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-300 transition"
            >
              Avbryt
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Statistikvy
  return (
    <div className="fixed inset-0 bg-sky-50 overflow-y-auto z-50">
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Lärarvy</h1>
              <p className="text-slate-500">Antal texter per årskurs</p>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition"
            >
              Stäng
            </button>
          </div>
        </div>

        {stats && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {stats.topGrades.length > 0 ? (
              <div className="space-y-3">
                {stats.topGrades
                  .sort((a, b) => a.grade - b.grade)
                  .map((item) => (
                    <div
                      key={item.grade}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                    >
                      <div className="text-lg font-bold text-slate-800">
                        {item.grade === 10 ? 'Gymnasiet' : `Årskurs ${item.grade}`}
                      </div>
                      <div className="text-2xl font-black text-purple-600">
                        {item.count} <span className="text-sm font-normal text-slate-500">texter</span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">Inga texter har lästs ännu</p>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={loadStats}
                className="px-6 py-2 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition"
              >
                Uppdatera
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
