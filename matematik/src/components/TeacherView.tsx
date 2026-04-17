import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../contexts/AppContext';
import { RefreshCw, LogOut, Monitor, FileText, Users } from 'lucide-react';

interface LiveStats {
  activeNow: number;
  visitorsToday: number;
  visitorsMonth: number;
  totalExercises: number;
  totalErrors: number;
  totalTimeMinutes: number;
  topErrors: { topic: string; count: number }[];
  daily14: { date: string; exercises: number; visitors: number }[];
}

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
    <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center flex flex-col items-center gap-3 shadow-sm">
      <div className={`w-12 h-12 ${accent} rounded-full flex items-center justify-center`}>
        {icon}
      </div>
      <div className="text-3xl font-black text-slate-800">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}

function formatDateShort(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'short',
  });
}

export default function TeacherView() {
  const { setTeacher } = useApp();

  const [liveStats, setLiveStats] = useState<LiveStats | null>(null);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);

  const todayDate = new Date().toLocaleDateString('sv-SE', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const fetchLiveStats = useCallback(async () => {
    setLiveLoading(true);
    setLiveError(null);
    try {
      const res = await fetch(`/api/teacher-stats?password=${encodeURIComponent('Korsängen')}`);
      if (res.status === 401) throw new Error('401');
      if (!res.ok) throw new Error(`${res.status}`);
      setLiveStats(await res.json());
    } catch (e: any) {
      setLiveError(e.message ?? 'error');
    } finally {
      setLiveLoading(false);
    }
  }, []);

  useEffect(() => { fetchLiveStats(); }, [fetchLiveStats]);

  const maxExercises14 = liveStats ? Math.max(...liveStats.daily14.map(d => d.exercises), 1) : 1;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/mattejakten.png" alt="Mattejakten" className="w-9 h-9 object-contain rounded-lg" />
            <div>
              <h1 className="text-lg font-black text-slate-800">Lärarvy – Mattejakten</h1>
              <p className="text-xs text-slate-500">Anonymiserad aggregerad statistik · GDPR-säkrad</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="hidden md:block text-sm text-slate-400 mr-2">{todayDate}</p>
            <button
              onClick={fetchLiveStats}
              disabled={liveLoading}
              className="flex items-center gap-1.5 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition text-sm font-medium cursor-pointer disabled:opacity-40"
            >
              <RefreshCw className={`w-4 h-4 ${liveLoading ? 'animate-spin' : ''}`} />
              Uppdatera
            </button>
            <button
              onClick={() => setTeacher(false)}
              className="flex items-center gap-1.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Logga ut
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">

        {/* Error banner */}
        {liveError && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm">
            {liveError === '401' ? (
              <>Saknar miljövariabel <strong>TEACHER_PASSWORD</strong>. Lägg till den i Vercel → mattejakten → Settings → Environment Variables.</>
            ) : (
              <>Redis-anslutning saknas (fel {liveError}). Koppla databasen i Vercel → mattejakten → Storage.</>
            )}
          </div>
        )}

        {/* Loading */}
        {liveLoading && !liveStats && (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
            <RefreshCw className="w-8 h-8 text-slate-300 animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-400">Hämtar statistik…</p>
          </div>
        )}

        {liveStats && (
          <>
            {/* Översikt */}
            <section>
              <h2 className="text-xs font-black tracking-widest text-slate-400 uppercase mb-4">Översikt</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Inloggade nu */}
                <div className="bg-white rounded-2xl p-6 border-2 border-emerald-300 text-center flex flex-col items-center gap-3 shadow-sm">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <div className="w-5 h-5 bg-emerald-500 rounded-full animate-pulse" />
                  </div>
                  <div className="text-3xl font-black text-slate-800">{liveStats.activeNow}</div>
                  <div className="text-sm text-slate-500">Inloggade nu</div>
                </div>
                <StatCard
                  accent="bg-sky-100"
                  icon={<Monitor className="w-5 h-5 text-sky-600" />}
                  value={liveStats.visitorsToday}
                  label="Enheter idag"
                />
                <StatCard
                  accent="bg-indigo-100"
                  icon={<Users className="w-5 h-5 text-indigo-600" />}
                  value={liveStats.visitorsMonth}
                  label="Enheter 30 dagar"
                />
                <StatCard
                  accent="bg-amber-100"
                  icon={<FileText className="w-5 h-5 text-amber-600" />}
                  value={liveStats.totalExercises}
                  label="Uppgifter gjorda"
                />
              </div>
            </section>

            {/* Daglig graf */}
            <section>
              <h2 className="text-xs font-black tracking-widest text-slate-400 uppercase mb-4">
                Dagliga uppgifter – senaste 14 dagarna
              </h2>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="space-y-3">
                  {liveStats.daily14.map(({ date, exercises }) => {
                    const pct = exercises > 0 ? Math.max(2, (exercises / maxExercises14) * 100) : 0;
                    return (
                      <div key={date} className="flex items-center gap-4">
                        <div className="w-16 text-xs text-slate-400 text-right shrink-0">
                          {formatDateShort(date)}
                        </div>
                        <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
                          <div
                            className="bg-blue-500 h-full rounded-full transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="w-8 text-xs text-slate-600 text-right font-semibold shrink-0">
                          {exercises || ''}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Vanligaste felsvar */}
            {liveStats.topErrors.length > 0 && (
              <section>
                <h2 className="text-xs font-black tracking-widest text-slate-400 uppercase mb-4">
                  Vanligaste felsvar per ämne
                </h2>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
                  {liveStats.topErrors.map((e, i) => (
                    <div key={e.topic} className="flex items-center px-6 py-4 gap-4">
                      <span className="text-base font-black text-slate-300 w-5 text-center">
                        {i + 1}
                      </span>
                      <span className="flex-1 text-slate-700 font-medium truncate">{e.topic}</span>
                      <span className="font-black text-red-500">{e.count} fel</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* GDPR-info */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-xl leading-none mt-0.5">🔒</span>
            <div>
              <p className="font-bold text-emerald-800 text-sm">GDPR-säkrad statistik</p>
              <p className="text-emerald-700 text-sm mt-1">
                Inga personuppgifter samlas in. Varje enhet identifieras av ett slumpmässigt anonymt ID
                som inte kan kopplas till en person. All statistik är aggregerad och visas
                aldrig på individnivå.
              </p>
              <ul className="mt-2 space-y-1 text-xs text-emerald-600">
                <li>✓ Inga namn, IP-adresser eller inloggningsuppgifter lagras</li>
                <li>✓ Anonymt enhets-ID (UUID) – kan inte kopplas till en elev</li>
                <li>✓ Endast summerad data visas (antal, tid, uppgifter)</li>
              </ul>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-emerald-200">
            <span className="text-base leading-none">📅</span>
            <p className="text-xs text-emerald-600">
              Mattejakten började samla in anonym statistik <strong>14 april 2026</strong>.
              Data äldre än 14 dagar visas inte i grafen.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
