import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useApp } from '../contexts/AppContext';
import { getAllStudents, getPoints, getSessions } from '../utils/storage';
import { TOPICS } from '../data/topics';
import { GRADE_LABELS, Grade } from '../types';

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
  const allStudents = getAllStudents();
  const sessions = getSessions();

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

  // ── Local stats (device-specific) ────────────────────────────────────────
  const local = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const activeToday = allStudents.filter(s => getPoints(s.id)?.lastActiveDate === today).length;
    const totalExercises = sessions.reduce((s, e) => s + e.totalAnswers, 0);
    const totalCorrect = sessions.reduce((s, e) => s + e.correctAnswers, 0);
    const avgAccuracy = totalExercises > 0 ? Math.round((totalCorrect / totalExercises) * 100) : 0;

    const topicCount: Record<string, number> = {};
    for (const s of sessions) topicCount[s.topicId] = (topicCount[s.topicId] ?? 0) + 1;
    const topTopics = Object.entries(topicCount)
      .sort((a, b) => b[1] - a[1]).slice(0, 5)
      .map(([id, count]) => ({
        id, count,
        title: TOPICS.find(t => t.id === id)?.title ?? id,
        icon: TOPICS.find(t => t.id === id)?.icon ?? '📚',
      }));

    const gradeCount: Record<string, number> = {};
    for (const s of allStudents) gradeCount[s.grade] = (gradeCount[s.grade] ?? 0) + 1;

    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
    const dailyActivity: Record<string, number> = {};
    for (const s of sessions.filter(s => s.date >= sevenDaysAgo))
      dailyActivity[s.date] = (dailyActivity[s.date] ?? 0) + 1;

    return { activeToday, totalExercises, avgAccuracy, topTopics, gradeCount, dailyActivity };
  }, [allStudents, sessions]);

  const maxDaily = Math.max(...Object.values(local.dailyActivity), 1);
  const maxTopic = Math.max(...local.topTopics.map(t => t.count), 1);
  const maxGrade = Math.max(...Object.values(local.gradeCount), 1);

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
        <SectionLabel text="Realtidsstatistik – alla enheter" />

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

        {/* ── LOCAL: device-specific ──────────────────────────────────────── */}
        <div className="flex items-center gap-2 pt-2">
          <SectionLabel text="Lokal statistik – denna enhet" />
          <span className="text-xs text-slate-400">(visar bara data från denna webbläsare)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <KpiCard label="Elever totalt" value={String(allStudents.length)} color="indigo" icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
          } />
          <KpiCard label="Aktiva idag" value={String(local.activeToday)} color="emerald" highlight={local.activeToday > 0} icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          } />
          <KpiCard label="Totala svar" value={String(local.totalExercises)} color="violet" icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          } />
          <KpiCard label="Träffsäkerhet" value={`${local.avgAccuracy}%`} color="amber" icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          } />
        </div>

        {/* 7-day local activity */}
        <Section title="Aktivitet senaste 7 dagarna" icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
        }>
          {Object.keys(local.dailyActivity).length === 0 ? (
            <EmptyState text="Ingen aktivitet på denna enhet de senaste 7 dagarna" />
          ) : (
            <div className="flex items-end gap-2 h-28 pt-2">
              {Array.from({ length: 7 }, (_, i) => {
                const d = new Date(Date.now() - (6 - i) * 86400000);
                const key = d.toISOString().split('T')[0];
                const val = local.dailyActivity[key] ?? 0;
                const isToday = i === 6;
                return (
                  <div key={key} className="flex flex-col items-center flex-1 gap-1.5">
                    {val > 0 && <span className="text-[10px] font-bold text-slate-500">{val}</span>}
                    <div className="w-full flex items-end" style={{ height: '72px' }}>
                      <div
                        className={`w-full rounded-t-md transition-all duration-500 ${isToday ? 'bg-indigo-500' : 'bg-indigo-200'}`}
                        style={{ height: val > 0 ? `${Math.max(8, (val / maxDaily) * 100)}%` : '4px', opacity: val === 0 ? 0.3 : 1 }}
                      />
                    </div>
                    <span className={`text-[10px] font-semibold ${isToday ? 'text-indigo-600' : 'text-slate-400'}`}>
                      {d.toLocaleDateString('sv-SE', { weekday: 'short' })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Section>

        {/* Top topics local */}
        <Section title="Populäraste ämnen" icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
          </svg>
        }>
          {local.topTopics.length === 0 ? (
            <EmptyState text="Ingen data på denna enhet ännu" />
          ) : (
            <div className="space-y-3">
              {local.topTopics.map((t, i) => (
                <div key={t.id} className="flex items-center gap-3">
                  <span className="text-xs font-black text-slate-300 w-4 flex-shrink-0">#{i + 1}</span>
                  <span className="text-base flex-shrink-0">{t.icon}</span>
                  <span className="text-sm font-semibold text-slate-700 w-32 flex-shrink-0 truncate">{t.title}</span>
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full transition-all duration-700"
                      style={{ width: `${(t.count / maxTopic) * 100}%` }} />
                  </div>
                  <span className="text-xs font-bold text-indigo-500 w-14 text-right flex-shrink-0">{t.count} gånger</span>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Grade distribution */}
        <Section title="Klassfördelning" icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
          </svg>
        }>
          {Object.keys(local.gradeCount).length === 0 ? (
            <EmptyState text="Inga elever registrerade på denna enhet" />
          ) : (
            <div className="space-y-2.5">
              {Object.entries(local.gradeCount).sort((a, b) => a[0].localeCompare(b[0])).map(([grade, count]) => (
                <div key={grade} className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-600 w-16 flex-shrink-0">
                    {GRADE_LABELS[grade as Grade] ?? grade}
                  </span>
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-400 to-purple-500 rounded-full transition-all duration-700"
                      style={{ width: `${(count / maxGrade) * 100}%` }} />
                  </div>
                  <span className="text-xs font-bold text-slate-400 w-6 text-right flex-shrink-0">{count}</span>
                </div>
              ))}
            </div>
          )}
        </Section>

        <p className="text-center text-xs text-slate-400 pb-2">
          Realtidsstatistik är anonymiserad och innehåller inga personuppgifter
        </p>
      </div>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ text }: { text: string }) {
  return <p className="text-xs font-black uppercase tracking-widest text-slate-400">{text}</p>;
}

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

function KpiCard({ label, value, icon, color, highlight }: {
  label: string; value: string; icon: React.ReactNode;
  color: 'indigo' | 'emerald' | 'violet' | 'amber'; highlight?: boolean;
}) {
  const iconCls = { indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100', emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100', violet: 'bg-violet-50 text-violet-600 border-violet-100', amber: 'bg-amber-50 text-amber-600 border-amber-100' };
  const valCls = { indigo: 'text-indigo-700', emerald: 'text-emerald-700', violet: 'text-violet-700', amber: 'text-amber-700' };
  return (
    <div className={`bg-white border rounded-2xl p-4 shadow-sm ${highlight ? 'border-emerald-300' : 'border-slate-100'}`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 border ${iconCls[color]}`}>{icon}</div>
      <p className={`text-2xl font-black tracking-tight ${valCls[color]}`}>{value}</p>
      <p className="text-xs font-medium text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-slate-400">{icon}</span>
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="text-sm text-slate-400 py-2">{text}</p>;
}
