import React, { useState, useEffect } from 'react';
import { getTeacherStats } from '../services/userService';
import { BookLogo } from './BookLogo';

interface TeacherViewProps {
  onClose: () => void;
}

interface Stats {
  todayTexts: number;
  totalTexts: number;
  topGenres: Array<{ name: string; count: number }>;
  topThemes: Array<{ name: string; count: number }>;
  topGrades: Array<{ grade: number; count: number }>;
  leaderboard: Array<{ name: string; points: number; textsRead: number }>;
  last7Days: Array<{ date: string; count: number }>;
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
    setStats(data);
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
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <BookLogo size={40} />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Lärarvy</h1>
                <p className="text-slate-500">Statistik för denna enhet</p>
              </div>
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
          <div className="space-y-6">
            {/* Sammanfattning */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="text-blue-100 mb-2">Texter lästa idag</div>
                <div className="text-5xl font-black">{stats.todayTexts}</div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="text-purple-100 mb-2">Texter totalt</div>
                <div className="text-5xl font-black">{stats.totalTexts}</div>
              </div>
            </div>

            {/* Senaste 7 dagarna */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Senaste 7 dagarna</h3>
              <div className="flex items-end gap-2 h-40">
                {stats.last7Days.map((day) => {
                  const maxCount = Math.max(...stats.last7Days.map(d => d.count), 1);
                  const height = (day.count / maxCount) * 100;
                  const dayName = new Date(day.date).toLocaleDateString('sv-SE', { weekday: 'short' });
                  return (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                      <div className="text-xs text-slate-600 font-bold">{day.count}</div>
                      <div
                        className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t transition-all"
                        style={{ height: `${Math.max(height, 4)}%` }}
                      />
                      <div className="text-xs text-slate-500 capitalize">{dayName}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Topplista */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Topplista - mest poäng</h3>
              {stats.leaderboard.length > 0 ? (
                <div className="space-y-3">
                  {stats.leaderboard.map((student, idx) => (
                    <div
                      key={student.name}
                      className={`flex items-center gap-4 p-4 rounded-xl ${
                        idx === 0
                          ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300'
                          : idx === 1
                          ? 'bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-300'
                          : idx === 2
                          ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-300'
                          : 'bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                          idx === 0
                            ? 'bg-yellow-400 text-yellow-900'
                            : idx === 1
                            ? 'bg-slate-400 text-white'
                            : idx === 2
                            ? 'bg-orange-400 text-orange-900'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800">{student.name}</div>
                        <div className="text-sm text-slate-500">{student.textsRead} texter lästa</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-purple-600">{student.points}</div>
                        <div className="text-xs text-slate-500">poäng</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">Inga elever har läst ännu</p>
              )}
            </div>

            {/* Populäraste årskurser */}
            {stats.topGrades.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Populäraste årskurser</h3>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {stats.topGrades.map((item, idx) => (
                    <div
                      key={item.grade}
                      className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 text-center"
                    >
                      <div className="text-2xl font-black text-teal-700">{item.grade === 10 ? 'Gymnasiet' : `Åk ${item.grade}`}</div>
                      <div className="text-sm text-teal-600">{item.count} texter</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Populäraste teman */}
            {stats.topThemes.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Populäraste ämnen</h3>
                <div className="space-y-3">
                  {stats.topThemes.map((item, idx) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600">
                        {idx + 1}
                      </div>
                      <div className="flex-1 bg-slate-50 rounded-lg p-3">
                        <div className="font-bold text-slate-800 capitalize">{item.name}</div>
                        <div className="text-sm text-slate-500">{item.count} texter</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Populäraste texttyper */}
            {stats.topGenres.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Populäraste texttyper</h3>
                <div className="space-y-3">
                  {stats.topGenres.map((item, idx) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-600">
                        {idx + 1}
                      </div>
                      <div className="flex-1 bg-slate-50 rounded-lg p-3">
                        <div className="font-bold text-slate-800 capitalize">{item.name}</div>
                        <div className="text-sm text-slate-500">{item.count} texter</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Uppdatera-knapp */}
            <div className="text-center pb-6">
              <button
                onClick={loadStats}
                className="px-8 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition"
              >
                Uppdatera statistik
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
