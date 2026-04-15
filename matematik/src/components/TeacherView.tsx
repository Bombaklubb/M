import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../contexts/AppContext';

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

export default function TeacherView() {
  const { setTeacher } = useApp();

  // ── Redis live stats ──────────────────────────────────────────────────────
  const [liveStats, setLiveStats] = useState<LiveStats | null>(null);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);

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

  // ── Derived from Redis ────────────────────────────────────────────────────
  const maxExercises14 = liveStats ? Math.max(...liveStats.daily14.map(d => d.exercises), 1) : 1;
  const maxErrorCount = liveStats ? (liveStats.topErrors[0]?.count ?? 1) : 1;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white">
        <div className="max-w-3xl mx-auto px-5 py-7 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-0.5">
              <svg className="w-6 h-6 text-indigo-200" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
              <h1 className="text-xl font-black tracking-tight">Lärarvy</h1>
            </div>
            <p className="text-indigo-200 text-sm">Mattejakten · Aggregerad statistik · GDPR-säkrad</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchLiveStats}
              disabled={liveLoading}
              className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/20 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              <svg className={`w-4 h-4 ${liveLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Uppdatera
            </button>
            <button
              onClick={() => setTeacher(false)}
              className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/20 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
              Avsluta
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-7 space-y-6">

        {/* ── REDIS: Live anonymous stats ───────────────────────────────────── */}
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Realtidsstatistik – alla enheter</p>

        {liveLoading && (
          <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center shadow-sm">
            <div className="flex justify-center mb-3">
              <svg className="w-8 h-8 text-indigo-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
            <p className="text-sm text-slate-400">Hämtar statistik…</p>
          </div>
        )}

        {!liveLoading && liveError && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              <div>
                {liveError === '401' ? (
                  <>
                    <p className="font-bold text-amber-800 text-sm mb-1">Saknar miljövariabel: TEACHER_PASSWORD</p>
                    <p className="text-amber-700 text-xs leading-relaxed">
                      Gå till <strong>Vercel → mattejakten → Settings → Environment Variables</strong> och lägg till:
                      <br /><code className="bg-amber-100 px-1 rounded">TEACHER_PASSWORD=Korsängen</code>
                      <br />Kör sedan en ny deployment.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-amber-800 text-sm mb-1">Redis-anslutning saknas (fel {liveError})</p>
                    <p className="text-amber-700 text-xs leading-relaxed">
                      Gå till <strong>Vercel → mattejakten → Storage</strong> och koppla databasen "svenskajakten" till projektet.
                      Kör sedan en ny deployment.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {!liveLoading && liveStats && (
          <>
            {/* Live KPI row */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {/* Inloggade nu – highlighted */}
              <div className="bg-white border-2 border-emerald-400 rounded-2xl p-4 text-center shadow-sm col-span-1">
                <div className="flex justify-center mb-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-2xl font-black text-emerald-600">{liveStats.activeNow}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">Inloggade nu</p>
              </div>
              <LiveKpi value={String(liveStats.visitorsToday)} label="Enheter idag" />
              <LiveKpi value={String(liveStats.visitorsMonth)} label="Enheter 30 dagar" />
              <LiveKpi value={String(liveStats.totalExercises)} label="Uppgifter gjorda" />
              <LiveKpi
                value={liveStats.totalTimeMinutes >= 60
                  ? `${Math.floor(liveStats.totalTimeMinutes / 60)}t ${liveStats.totalTimeMinutes % 60}m`
                  : `${liveStats.totalTimeMinutes}m`}
                label="Total tid"
              />
              <LiveKpi value={String(liveStats.totalErrors)} label="Felaktiga svar" />
            </div>

            {/* 14-day chart */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
              <SectionHeader icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
              } title="Dagliga uppgifter – senaste 14 dagarna" />
              <div className="space-y-2 mt-3">
                {liveStats.daily14.map(({ date, exercises }) => {
                  const pct = exercises > 0 ? Math.max(2, (exercises / maxExercises14) * 100) : 0;
                  const label = new Date(date + 'T12:00:00').toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' });
                  return (
                    <div key={date} className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 w-14 text-right flex-shrink-0">{label}</span>
                      <div className="flex-1 h-3.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-500 w-5 text-right flex-shrink-0">{exercises || ''}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top errors */}
            {liveStats.topErrors.length > 0 && (
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
                <SectionHeader icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                  </svg>
                } title="Vanligaste felsvar per ämne" />
                <div className="space-y-2 mt-3">
                  {liveStats.topErrors.map((e, i) => (
                    <div key={e.topic} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-300 w-4 flex-shrink-0">#{i + 1}</span>
                      <span className="text-xs text-slate-600 w-36 flex-shrink-0 truncate">{e.topic}</span>
                      <div className="flex-1 h-3.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-400 rounded-full" style={{ width: `${(e.count / maxErrorCount) * 100}%` }} />
                      </div>
                      <span className="text-xs font-bold text-red-500 w-6 text-right flex-shrink-0">{e.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <p className="text-center text-xs text-slate-400 pb-2">
          Realtidsstatistik är anonymiserad och innehåller inga personuppgifter
        </p>
      </div>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-slate-400">{icon}</span>
      <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">{title}</h2>
    </div>
  );
}

function LiveKpi({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 text-center shadow-sm">
      <p className="text-2xl font-black text-slate-800">{value}</p>
      <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{label}</p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="text-sm text-slate-400 py-2">{text}</p>;
}
