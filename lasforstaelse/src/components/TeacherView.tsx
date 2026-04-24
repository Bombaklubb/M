import React, { useState, useEffect } from 'react';
import { fetchTeacherStats, type TeacherStats } from '../services/analyticsService';
import { RefreshCw, LogOut, Monitor, Calendar } from 'lucide-react';

interface TeacherViewProps {
  onClose: () => void;
}

type Tab = 'stats' | 'library';

export const TeacherView: React.FC<TeacherViewProps> = ({ onClose }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [statsError, setStatsError] = useState('');

  // Library stats (befintlig funktionalitet)
  const [gradeCounts, setGradeCounts] = useState<{ grade: number; count: number }[]>([]);

  // Dagens datum
  const todayDate = new Date().toLocaleDateString('sv-SE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      // Försök hämta statistik med lösenordet
      const teacherStats = await fetchTeacherStats(password);
      setStats(teacherStats);
      setAuthenticated(true);
      loadLibraryStats();
    } catch (err) {
      // Om det misslyckas, försök med lokalt lösenord (fallback)
      if (password === 'Korsängen') {
        setAuthenticated(true);
        loadLibraryStats();
        setStatsError('Kunde inte ansluta till statistikserver - visar lokal data');
      } else {
        setError('Fel lösenord');
      }
    }

    setLoading(false);
  };

  const refreshStats = async () => {
    setLoading(true);
    try {
      const teacherStats = await fetchTeacherStats(password);
      setStats(teacherStats);
      setStatsError('');
    } catch {
      setStatsError('Kunde inte hämta statistik');
    }
    setLoading(false);
  };

  const loadLibraryStats = async () => {
    try {
      const response = await fetch('/data/library.json');
      const texts = await response.json();

      const counts: Record<number, number> = {};
      texts.forEach((text: { grade: number }) => {
        counts[text.grade] = (counts[text.grade] || 0) + 1;
      });

      const gradeArray = Object.entries(counts)
        .map(([grade, count]) => ({ grade: parseInt(grade), count }))
        .sort((a, b) => a.grade - b.grade);

      setGradeCounts(gradeArray);
    } catch (err) {
      console.error('Kunde inte ladda biblioteket:', err);
    }
  };

  const formatDateShort = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' });
  };

  useEffect(() => {
    if (authenticated && gradeCounts.length === 0) {
      loadLibraryStats();
    }
  }, [authenticated]);

  // Login-skärm
  if (!authenticated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🔒</span>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Lärarvy</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Ange lösenord för att se statistik
          </p>

          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Lösenord"
            className="w-full p-4 border-2 border-slate-200 dark:border-slate-600 rounded-xl mb-4 focus:border-emerald-500 focus:outline-none bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
            autoFocus
          />

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {loading ? 'Laddar...' : 'Logga in'}
            </button>
            <button
              onClick={onClose}
              className="px-6 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-white py-3 rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-500 transition"
            >
              Avbryt
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Huvudvy
  return (
    <div className="fixed inset-0 bg-slate-50 dark:bg-slate-900 z-50 overflow-auto">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">📚</span>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                Lärarvy – Läsjakten
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {todayDate}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refreshStats}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Uppdatera
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Logga ut
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Flikar */}
        <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-700 pb-2">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'stats'
                ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Statistik
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'library'
                ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Bibliotek
          </button>
        </div>

        {/* Statistik-flik */}
        {activeTab === 'stats' && (
          <>
            {statsError && (
              <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-200 px-4 py-3 rounded-xl mb-6">
                {statsError}
              </div>
            )}

            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4">
              ÖVERSIKT
            </h2>

            {/* Statistik-kort */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {/* Inloggade nu */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 text-center">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse" />
                </div>
                <div className="text-3xl font-bold text-slate-800 dark:text-white">
                  {stats?.activeNow ?? '-'}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Inloggade nu
                </div>
              </div>

              {/* Inloggade idag */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 text-center">
                <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Monitor className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                </div>
                <div className="text-3xl font-bold text-slate-800 dark:text-white">
                  {stats?.visitorsToday ?? '-'}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Inloggade idag
                </div>
              </div>

              {/* Unika enheter totalt */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 text-center">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Monitor className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-slate-800 dark:text-white">
                  {stats?.totalVisitors ?? '-'}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Unika enheter
                </div>
              </div>

            </div>

            {/* Statistik per årskurs/stadie */}
            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4">
              ANTAL LÄSTA TEXTER
            </h2>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-8">
              {stats?.gradeStats && stats.gradeStats.length > 0 ? (
                <div className="space-y-3">
                  {stats.gradeStats.map((item) => {
                    const maxCount = Math.max(...stats.gradeStats.map((g) => g.count), 1);
                    const percentage = (item.count / maxCount) * 100;
                    const gradeLabel = item.grade === 10 ? 'Gymnasium' : `Årskurs ${item.grade}`;

                    return (
                      <div key={item.grade} className="flex items-center gap-4">
                        <div className="w-28 text-sm text-slate-500 dark:text-slate-400 text-right">
                          {gradeLabel}
                        </div>
                        <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-6 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(percentage, 2)}%` }}
                          />
                        </div>
                        <div className="w-16 text-sm text-slate-600 dark:text-slate-300 text-right font-medium">
                          {item.count} st
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                  Ingen stadiestatistik tillgänglig ännu
                </p>
              )}

              {/* GDPR-info box */}
              <div className="mt-6 bg-slate-800 dark:bg-slate-900 rounded-xl p-5 border border-emerald-700/50">
                <div className="flex items-start gap-3">
                  <span className="text-emerald-400 text-xl">🔒</span>
                  <div>
                    <h3 className="text-emerald-400 font-bold mb-2">GDPR-säkrad statistik</h3>
                    <p className="text-slate-300 text-sm mb-3">
                      Inga personuppgifter samlas in. Varje enhet identifieras av ett slumpmässigt anonymt ID som inte kan kopplas till en person. All statistik är aggregerad och visas aldrig på individnivå.
                    </p>
                    <ul className="text-emerald-400 text-sm space-y-1 mb-4">
                      <li>✓ Inga namn, IP-adresser eller inloggningsuppgifter lagras</li>
                      <li>✓ Anonymt enhets-ID (UUID) – kan inte kopplas till en elev</li>
                      <li>✓ Endast summerad data visas (antal, tid, uppgifter)</li>
                    </ul>
                    <div className="flex items-center gap-2 text-slate-400 text-sm border-t border-slate-700 pt-3">
                      <Calendar className="w-4 h-4" />
                      <span>Läsjakten började samla in anonym statistik <strong className="text-white">15 april 2026</strong>. Data äldre än 14 dagar visas inte i grafen.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </>
        )}


        {/* Bibliotek-flik */}
        {activeTab === 'library' && (
          <>
            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4">
              ANTAL TEXTER PER ÅRSKURS
            </h2>

            <div className="flex flex-wrap gap-3 justify-center">
              {gradeCounts.map((item) => (
                <div
                  key={item.grade}
                  className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center min-w-[90px] border border-slate-200 dark:border-slate-700"
                >
                  <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">
                    {item.grade === 10 ? 'Gym' : `Åk ${item.grade}`}
                  </div>
                  <div className="text-2xl font-black text-slate-800 dark:text-white">
                    {item.count}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-center text-slate-500 dark:text-slate-400">
              Totalt: {gradeCounts.reduce((sum, g) => sum + g.count, 0)} texter
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-slate-400 dark:text-slate-600 py-6">
        <a
          href="mailto:martin.akdogan@enkoping.se"
          className="hover:text-emerald-500 dark:hover:text-emerald-400 transition"
        >
          martin.akdogan@enkoping.se
        </a>
        <span className="mx-3">·</span>
        Läsjakten av Martin Akdogan
      </footer>
    </div>
  );
};
