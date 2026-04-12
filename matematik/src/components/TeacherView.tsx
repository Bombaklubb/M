import React, { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { getAllStudents, getPoints, getSessions } from '../utils/storage';
import { TOPICS } from '../data/topics';
import { GRADE_LABELS, Grade } from '../types';

export default function TeacherView() {
  const { setTeacher } = useApp();
  const allStudents = getAllStudents();
  const sessions = getSessions();

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];

    const activeToday = allStudents.filter(s => {
      const pts = getPoints(s.id);
      return pts?.lastActiveDate === today;
    }).length;

    const totalExercises = sessions.reduce((s, e) => s + e.totalAnswers, 0);
    const totalCorrect = sessions.reduce((s, e) => s + e.correctAnswers, 0);
    const avgAccuracy = totalExercises > 0 ? Math.round((totalCorrect / totalExercises) * 100) : 0;

    // Topic popularity
    const topicCount: Record<string, number> = {};
    for (const s of sessions) {
      topicCount[s.topicId] = (topicCount[s.topicId] ?? 0) + 1;
    }
    const topTopics = Object.entries(topicCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, count]) => ({
        id,
        title: TOPICS.find(t => t.id === id)?.title ?? id,
        icon: TOPICS.find(t => t.id === id)?.icon ?? '📚',
        count,
      }));

    // Grade distribution
    const gradeCount: Record<string, number> = {};
    for (const s of allStudents) {
      gradeCount[s.grade] = (gradeCount[s.grade] ?? 0) + 1;
    }

    // 7-day activity
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
    const sessionsLastWeek = sessions.filter(s => s.date >= sevenDaysAgo);
    const dailyActivity: Record<string, number> = {};
    for (const s of sessionsLastWeek) {
      dailyActivity[s.date] = (dailyActivity[s.date] ?? 0) + 1;
    }

    return { activeToday, totalExercises, avgAccuracy, topTopics, gradeCount, dailyActivity };
  }, [allStudents, sessions]);

  const maxDailyActivity = Math.max(...Object.values(stats.dailyActivity), 1);
  const maxTopicCount = Math.max(...stats.topTopics.map(t => t.count), 1);
  const maxGradeCount = Math.max(...Object.values(stats.gradeCount), 1);

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
            <p className="text-indigo-200 text-sm">Mattejakten · Aggregerad statistik</p>
          </div>
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

      <div className="max-w-3xl mx-auto px-5 py-7 space-y-6">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <KpiCard
            label="Elever totalt"
            value={String(allStudents.length)}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            }
            color="indigo"
          />
          <KpiCard
            label="Aktiva idag"
            value={String(stats.activeToday)}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            }
            color="emerald"
            highlight={stats.activeToday > 0}
          />
          <KpiCard
            label="Totala svar"
            value={String(stats.totalExercises)}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
            }
            color="violet"
          />
          <KpiCard
            label="Träffsäkerhet"
            value={`${stats.avgAccuracy}%`}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            }
            color="amber"
          />
        </div>

        {/* 7-day activity bar chart */}
        <Section title="Aktivitet – senaste 7 dagarna" icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
        }>
          {Object.keys(stats.dailyActivity).length === 0 ? (
            <EmptyState text="Ingen aktivitet de senaste 7 dagarna" />
          ) : (
            <div className="flex items-end gap-2 h-28 pt-2">
              {Array.from({ length: 7 }, (_, i) => {
                const d = new Date(Date.now() - (6 - i) * 86400000);
                const key = d.toISOString().split('T')[0];
                const val = stats.dailyActivity[key] ?? 0;
                const pct = (val / maxDailyActivity) * 100;
                const isToday = i === 6;
                return (
                  <div key={key} className="flex flex-col items-center flex-1 gap-1.5">
                    {val > 0 && <span className="text-[10px] font-bold text-slate-500">{val}</span>}
                    <div className="w-full flex items-end" style={{ height: '72px' }}>
                      <div
                        className={`w-full rounded-t-md transition-all duration-500 ${isToday ? 'bg-indigo-500' : 'bg-indigo-200'}`}
                        style={{ height: val > 0 ? `${Math.max(8, pct)}%` : '4px', opacity: val === 0 ? 0.3 : 1 }}
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

        {/* Top topics */}
        <Section title="Populäraste ämnen" icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
          </svg>
        }>
          {stats.topTopics.length === 0 ? (
            <EmptyState text="Ingen data ännu" />
          ) : (
            <div className="space-y-3">
              {stats.topTopics.map((t, i) => (
                <div key={t.id} className="flex items-center gap-3">
                  <span className="text-xs font-black text-slate-300 w-4 flex-shrink-0">#{i + 1}</span>
                  <span className="text-base flex-shrink-0">{t.icon}</span>
                  <span className="text-sm font-semibold text-slate-700 w-32 flex-shrink-0 truncate">{t.title}</span>
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full transition-all duration-700"
                      style={{ width: `${(t.count / maxTopicCount) * 100}%` }}
                    />
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
          {Object.keys(stats.gradeCount).length === 0 ? (
            <EmptyState text="Inga elever registrerade" />
          ) : (
            <div className="space-y-2.5">
              {Object.entries(stats.gradeCount)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([grade, count]) => (
                  <div key={grade} className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-600 w-16 flex-shrink-0">
                      {GRADE_LABELS[grade as Grade] ?? grade}
                    </span>
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-400 to-purple-500 rounded-full transition-all duration-700"
                        style={{ width: `${(count / maxGradeCount) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-400 w-6 text-right flex-shrink-0">{count}</span>
                  </div>
                ))}
            </div>
          )}
        </Section>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-400 pb-2">
          All statistik är aggregerad och innehåller inga personuppgifter
        </p>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function KpiCard({
  label, value, icon, color, highlight,
}: {
  label: string; value: string; icon: React.ReactNode; color: 'indigo' | 'emerald' | 'violet' | 'amber'; highlight?: boolean;
}) {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    violet: 'bg-violet-50 text-violet-600 border-violet-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  };
  const valueColors = {
    indigo: 'text-indigo-700',
    emerald: 'text-emerald-700',
    violet: 'text-violet-700',
    amber: 'text-amber-700',
  };
  return (
    <div className={`bg-white border rounded-2xl p-4 shadow-sm ${highlight ? 'border-emerald-300 shadow-emerald-50' : 'border-slate-100'}`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 border ${colors[color]}`}>
        {icon}
      </div>
      <p className={`text-2xl font-black tracking-tight ${valueColors[color]}`}>{value}</p>
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
