import React, { useState, useEffect } from 'react';
import { fetchTeacherStats, type TeacherStats } from '../services/analyticsService';
import { RefreshCw, LogOut, Monitor, Calendar, BookOpen, ChevronDown, ChevronRight } from 'lucide-react';
import { JaktLinks } from './JaktLinks';

interface TeacherViewProps {
  onClose: () => void;
}

type Tab = 'stats' | 'library';

interface LibraryText {
  id: string;
  grade: number;
  title: string;
  genre?: string;
  theme?: string;
  meta?: { wordCount?: number; readingTime?: number };
  questions?: unknown[];
}

export const TeacherView: React.FC<TeacherViewProps> = ({ onClose }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [statsError, setStatsError] = useState('');
  const [gradeCounts, setGradeCounts] = useState<{ grade: number; count: number }[]>([]);
  const [allTexts, setAllTexts] = useState<LibraryText[]>([]);
  const [expandedGrades, setExpandedGrades] = useState<Set<number>>(new Set());

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
      const teacherStats = await fetchTeacherStats(password);
      setStats(teacherStats);
      setAuthenticated(true);
      loadLibraryStats();
    } catch {
      if (password === 'Korsängen') {
        setAuthenticated(true);
        loadLibraryStats();
        setStatsError('No analytics server connected — showing library data only.');
      } else {
        setError('Wrong password');
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
      setStatsError('Could not fetch statistics');
    }
    setLoading(false);
  };

  const loadLibraryStats = async () => {
    try {
      const response = await fetch('/data/library.json');
      const texts: LibraryText[] = await response.json();

      const counts: Record<number, number> = {};
      texts.forEach((t) => {
        counts[t.grade] = (counts[t.grade] || 0) + 1;
      });

      setGradeCounts(
        Object.entries(counts)
          .map(([g, c]) => ({ grade: parseInt(g), count: c }))
          .sort((a, b) => a.grade - b.grade)
      );
      setAllTexts(texts.sort((a, b) => a.grade - b.grade || a.title.localeCompare(b.title)));
    } catch (err) {
      console.error('Could not load library:', err);
    }
  };

  useEffect(() => {
    if (authenticated && gradeCounts.length === 0) {
      loadLibraryStats();
    }
  }, [authenticated]);

  const toggleGrade = (grade: number) => {
    setExpandedGrades((prev) => {
      const next = new Set(prev);
      if (next.has(grade)) next.delete(grade);
      else next.add(grade);
      return next;
    });
  };

  // Login screen
  if (!authenticated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🔒</span>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Teacher View</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Enter password to access teacher statistics
          </p>

          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Password"
            className="w-full p-4 border-2 border-slate-200 dark:border-slate-600 rounded-xl mb-4 focus:border-indigo-500 focus:outline-none bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
            autoFocus
          />

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Log in'}
            </button>
            <button
              onClick={onClose}
              className="px-6 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-white py-3 rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-500 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-50 dark:bg-slate-900 z-50 overflow-auto">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">📚</span>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                Teacher View – Readhunt
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {todayDate}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refreshStats}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-700 pb-2">
          {(['stats', 'library'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === tab
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab === 'stats' ? 'Statistics' : 'Library'}
            </button>
          ))}
        </div>

        {/* Statistics tab */}
        {activeTab === 'stats' && (
          <>
            {statsError && (
              <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-200 px-4 py-3 rounded-xl mb-6">
                {statsError}
              </div>
            )}

            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4">OVERVIEW</h2>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 text-center">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="w-4 h-4 bg-indigo-500 rounded-full animate-pulse" />
                </div>
                <div className="text-3xl font-bold text-slate-800 dark:text-white">{stats?.activeNow ?? '-'}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">Active now</div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 text-center">
                <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Monitor className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                </div>
                <div className="text-3xl font-bold text-slate-800 dark:text-white">{stats?.visitorsToday ?? '-'}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">Logged in today</div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 text-center">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Monitor className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-slate-800 dark:text-white">{stats?.totalVisitors ?? '-'}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">Unique devices</div>
              </div>
            </div>

            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4">TEXTS READ PER LEVEL</h2>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-8">
              {stats?.gradeStats && stats.gradeStats.length > 0 ? (
                <div className="space-y-3">
                  {stats.gradeStats.map((item) => {
                    const maxCount = Math.max(...stats.gradeStats.map((g) => g.count), 1);
                    const pct = (item.count / maxCount) * 100;
                    return (
                      <div key={item.grade} className="flex items-center gap-4">
                        <div className="w-20 text-sm text-slate-500 dark:text-slate-400 text-right">
                          Level {item.grade}
                        </div>
                        <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-6 overflow-hidden">
                          <div
                            className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(pct, 2)}%` }}
                          />
                        </div>
                        <div className="w-16 text-sm text-slate-600 dark:text-slate-300 text-right font-medium">
                          {item.count}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                  No statistics available yet
                </p>
              )}

              {/* GDPR info */}
              <div className="mt-6 bg-slate-800 dark:bg-slate-900 rounded-xl p-5 border border-indigo-700/50">
                <div className="flex items-start gap-3">
                  <span className="text-indigo-400 text-xl">🔒</span>
                  <div>
                    <h3 className="text-indigo-400 font-bold mb-2">GDPR-secured statistics</h3>
                    <p className="text-slate-300 text-sm mb-3">
                      No personal data is collected. Each device is identified by a randomly generated anonymous ID that cannot be linked to any individual. All statistics are aggregated and never shown at an individual level.
                    </p>
                    <ul className="text-indigo-400 text-sm space-y-1 mb-4">
                      <li>✓ No names, IP addresses or login credentials stored</li>
                      <li>✓ Anonymous device ID (UUID) — cannot be linked to a student</li>
                      <li>✓ Only aggregated data shown (counts, time, tasks)</li>
                    </ul>
                    <div className="flex items-center gap-2 text-slate-400 text-sm border-t border-slate-700 pt-3">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Readhunt began collecting anonymous statistics{' '}
                        <strong className="text-white">May 2026</strong>.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Library tab */}
        {activeTab === 'library' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">TEXTS PER LEVEL</h2>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Total: {allTexts.length} texts
              </span>
            </div>

            <div className="space-y-3">
              {gradeCounts.map(({ grade, count }) => {
                const textsForGrade = allTexts.filter((t) => t.grade === grade);
                const isExpanded = expandedGrades.has(grade);
                return (
                  <div
                    key={grade}
                    className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleGrade(grade)}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                    >
                      <div className="flex items-center gap-3">
                        {isExpanded
                          ? <ChevronDown className="w-4 h-4 text-slate-400" />
                          : <ChevronRight className="w-4 h-4 text-slate-400" />
                        }
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          Level {grade}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
                        {count} {count === 1 ? 'text' : 'texts'}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-slate-100 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700">
                        {textsForGrade.map((t) => (
                          <div key={t.id} className="flex items-center gap-3 px-5 py-3">
                            <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-slate-700 dark:text-slate-200 truncate">
                                {t.title}
                              </div>
                              {t.theme && (
                                <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                  {t.theme}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-3 shrink-0 text-xs text-slate-400">
                              {t.meta?.wordCount && <span>{t.meta.wordCount} words</span>}
                              {t.questions && <span>{(t.questions as unknown[]).length} questions</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-center gap-3 text-sm text-slate-400 dark:text-slate-600 py-6">
        <a
          href="mailto:martin.akdogan@enkoping.se"
          className="hover:text-indigo-500 dark:hover:text-indigo-400 transition"
        >
          martin.akdogan@enkoping.se
        </a>
        <span>·</span>
        <JaktLinks />
      </footer>
    </div>
  );
};
