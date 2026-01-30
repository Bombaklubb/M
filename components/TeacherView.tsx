import React, { useState, useEffect } from 'react';

interface TeacherViewProps {
  onClose: () => void;
}

interface Stats {
  today: number;
  total: number;
  topTopics: Array<{ topic: string; count: number }>;
  topLevels: Array<{ level: number; count: number }>;
  hourlyUsage: Array<{ hour: number; count: number }>;
}

export const TeacherView: React.FC<TeacherViewProps> = ({ onClose }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Simple password check - you can change this!
    if (password === 'Korsängen') {
      setAuthenticated(true);
      fetchStats();
    } else {
      setError('Fel lösenord');
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/teacher-stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError('Kunde inte hämta statistik');
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🔒 Lärarvy</h2>
          <p className="text-gray-600 mb-6">Ange lösenord för att se statistik</p>

          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Lösenord"
            className="w-full p-3 border-2 border-gray-300 rounded-lg mb-4 focus:border-indigo-500 focus:outline-none"
          />

          {error && (
            <p className="text-red-600 text-sm mb-4">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleLogin}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition"
            >
              Logga in
            </button>
            <button
              onClick={onClose}
              className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
            >
              Avbryt
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-50 overflow-y-auto z-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📊 Lärarvy</h1>
              <p className="text-gray-600 mt-1">Statistik över app-användning</p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition"
            >
              Stäng
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="text-gray-600">Laddar statistik...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {stats && (
          <div className="space-y-6">
            {/* Summary Cards - Förbättrad synlighet */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-2xl p-8 text-white border-4 border-blue-400">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-5xl">📝</span>
                  <div className="text-xl font-bold text-white">Texter idag</div>
                </div>
                <div className="text-7xl font-black text-white drop-shadow-lg">{stats.today}</div>
                <div className="text-blue-50 mt-4 text-base font-semibold">
                  {((stats.today / 400) * 100).toFixed(1)}% av daglig kapacitet (~400 texter)
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-2xl p-8 text-white border-4 border-purple-400">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-5xl">📊</span>
                  <div className="text-xl font-bold text-white">Texter totalt</div>
                </div>
                <div className="text-7xl font-black text-white drop-shadow-lg">{stats.total}</div>
                <div className="text-purple-50 mt-4 text-base font-semibold">
                  Sedan appen startade
                </div>
              </div>
            </div>

            {/* Top Topics */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📚 Populäraste ämnen</h3>
              <div className="space-y-3">
                {stats.topTopics.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600">
                      {idx + 1}
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-3">
                      <div className="font-bold text-gray-900">{item.topic}</div>
                      <div className="text-sm text-gray-600">{item.count} texter</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Levels */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📈 Populäraste nivåer</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {stats.topLevels.map((item, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-4 text-center">
                    <div className="text-3xl font-black text-teal-700">Nivå {item.level}</div>
                    <div className="text-sm text-teal-600 mt-1">{item.count} texter</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hourly Usage */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">⏰ Användning per timme (idag)</h3>
              <div className="flex items-end gap-2 h-48">
                {stats.hourlyUsage.map((item) => {
                  const maxCount = Math.max(...stats.hourlyUsage.map(h => h.count), 1);
                  const height = (item.count / maxCount) * 100;
                  return (
                    <div key={item.hour} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t transition-all hover:from-indigo-600 hover:to-indigo-500"
                        style={{ height: `${height}%` }}
                        title={`${item.hour}:00 - ${item.count} texter`}
                      />
                      <div className="text-xs text-gray-500">{item.hour}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Refresh Button */}
            <div className="text-center">
              <button
                onClick={fetchStats}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition"
              >
                🔄 Uppdatera statistik
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
