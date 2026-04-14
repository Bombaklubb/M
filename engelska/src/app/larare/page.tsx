"use client";

import { useState, useEffect } from "react";
import { fetchTeacherStats, type TeacherStats } from "@/services/analyticsService";
import { RefreshCw, LogOut, Monitor, FileText, Clock, XCircle } from "lucide-react";

const questionTypeLabels: Record<string, string> = {
  grammar: "Grammatik",
  reading: "Läsning",
  spelling: "Stavning",
  wordsearch: "Ordsökning",
  spel: "Spel",
};

function StatCard({
  icon,
  value,
  label,
  accent,
}: {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
  accent: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 text-center flex flex-col items-center gap-3">
      <div className={`w-12 h-12 ${accent} rounded-full flex items-center justify-center`}>
        {icon}
      </div>
      <div className="text-3xl font-black text-slate-800 dark:text-white">{value}</div>
      <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  );
}

function formatDateShort(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "short",
  });
}

export default function LararePage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [statsError, setStatsError] = useState("");

  const todayDate = new Date().toLocaleDateString("sv-SE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await fetchTeacherStats(password);
      setStats(data);
      setAuthenticated(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Fel lösenord");
    }
    setLoading(false);
  }

  async function refreshStats() {
    setLoading(true);
    try {
      const data = await fetchTeacherStats(password);
      setStats(data);
      setStatsError("");
    } catch {
      setStatsError("Kunde inte hämta statistik");
    }
    setLoading(false);
  }

  // Auto-refresh var 30:e sekund
  useEffect(() => {
    if (!authenticated) return;
    const interval = setInterval(refreshStats, 30_000);
    return () => clearInterval(interval);
  }, [authenticated, password]);

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-sm w-full shadow-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <img src="/union-jack.svg" alt="" className="w-10 h-10 rounded-xl" />
            <div>
              <h1 className="text-xl font-black text-slate-800 dark:text-white">Lärarvy</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Engelskajakten</p>
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 mt-4">
            Ange lösenord för att se anonym statistik.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="Lösenord"
              className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 focus:outline-none bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
              autoFocus
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white py-3 rounded-xl font-bold transition"
            >
              {loading ? "Loggar in..." : "Logga in"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/union-jack.svg" alt="" className="w-9 h-9 rounded-lg" />
            <div>
              <h1 className="text-lg font-black text-slate-800 dark:text-white">
                Lärarvy – Engelskajakten
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Anonymiserad aggregerad statistik · GDPR-säkrad
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="hidden md:block text-sm text-slate-400 dark:text-slate-500 mr-2">
              {todayDate}
            </p>
            <button
              onClick={refreshStats}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition text-sm font-medium"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Uppdatera
            </button>
            <button
              onClick={() => setAuthenticated(false)}
              className="flex items-center gap-1.5 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logga ut
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {statsError && (
          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-200 px-4 py-3 rounded-xl">
            {statsError}
          </div>
        )}

        {/* Översikt */}
        <section>
          <h2 className="text-xs font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-4">
            Översikt
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {/* Inloggade nu */}
            <StatCard
              accent="bg-emerald-100 dark:bg-emerald-900/40"
              icon={
                <div className="w-5 h-5 bg-emerald-500 rounded-full animate-pulse" />
              }
              value={stats?.activeNow ?? "–"}
              label="Inloggade nu"
            />
            {/* Unika enheter */}
            <StatCard
              accent="bg-sky-100 dark:bg-sky-900/40"
              icon={<Monitor className="w-5 h-5 text-sky-600 dark:text-sky-400" />}
              value={stats?.totalVisitors ?? "–"}
              label="Unika enheter"
            />
            {/* Uppgifter gjorda */}
            <StatCard
              accent="bg-amber-100 dark:bg-amber-900/40"
              icon={<FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
              value={stats?.totalTasks ?? "–"}
              label="Uppgifter gjorda"
            />
            {/* Total tid */}
            <StatCard
              accent="bg-purple-100 dark:bg-purple-900/40"
              icon={<Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
              value={stats?.totalTime ?? "–"}
              label="Total tid"
            />
            {/* Felaktiga svar */}
            <StatCard
              accent="bg-red-100 dark:bg-red-900/40"
              icon={<XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />}
              value={stats?.totalErrors ?? "–"}
              label="Felaktiga svar"
            />
          </div>
        </section>

        {/* Daglig graf */}
        <section>
          <h2 className="text-xs font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-4">
            Dagliga uppgifter – senaste 14 dagarna
          </h2>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            {stats?.dailyStats && stats.dailyStats.length > 0 ? (
              <div className="space-y-3">
                {stats.dailyStats.map((day) => {
                  const maxTasks = Math.max(...stats.dailyStats.map((d) => d.tasks), 1);
                  const pct = (day.tasks / maxTasks) * 100;
                  return (
                    <div key={day.date} className="flex items-center gap-4">
                      <div className="w-16 text-xs text-slate-400 dark:text-slate-500 text-right shrink-0">
                        {formatDateShort(day.date)}
                      </div>
                      <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-5 overflow-hidden">
                        <div
                          className="bg-blue-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(pct, day.tasks > 0 ? 2 : 0)}%` }}
                        />
                      </div>
                      <div className="w-8 text-xs text-slate-600 dark:text-slate-300 text-right font-semibold shrink-0">
                        {day.tasks}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-slate-400 dark:text-slate-500 py-8">
                Ingen statistik tillgänglig ännu
              </p>
            )}
          </div>
        </section>

        {/* Vanligaste fel */}
        {stats?.topErrors && stats.topErrors.length > 0 && (
          <section>
            <h2 className="text-xs font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-4">
              Vanligaste feltyper (14 dagar)
            </h2>
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700 overflow-hidden">
              {stats.topErrors.map((err, i) => (
                <div key={err.type} className="flex items-center px-6 py-4 gap-4">
                  <span className="text-base font-black text-slate-300 dark:text-slate-600 w-5 text-center">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-slate-700 dark:text-slate-200 font-medium">
                    {questionTypeLabels[err.type] ?? err.type}
                  </span>
                  <span className="font-black text-red-600 dark:text-red-400">
                    {err.count} fel
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* GDPR-note */}
        <p className="text-xs text-center text-slate-400 dark:text-slate-600 pb-4">
          {stats?.gdprNote}
        </p>
      </main>
    </div>
  );
}
