import React, { useMemo, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { getAllStudents, getProgress, getPoints, getAchievements, getSessions, setTeacherPin, getTeacherPin } from '../utils/storage';
import { TOPICS } from '../data/topics';
import { LEVEL_NAMES, GRADE_LABELS, Grade } from '../types';

export default function TeacherView() {
  const { setTeacher } = useApp();
  const [tab, setTab] = useState<'overview' | 'students' | 'topics' | 'settings'>('overview');
  const [newPin, setNewPin] = useState('');
  const [pinMsg, setPinMsg] = useState('');

  const allStudents = getAllStudents();
  const sessions = getSessions();

  // --- Stats computation ---
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

    // Weekly sessions
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
    const sessionsLastWeek = sessions.filter(s => s.date >= sevenDaysAgo);
    const dailyActivity: Record<string, number> = {};
    for (const s of sessionsLastWeek) {
      dailyActivity[s.date] = (dailyActivity[s.date] ?? 0) + 1;
    }

    return { activeToday, totalExercises, avgAccuracy, topTopics, gradeCount, dailyActivity };
  }, [allStudents, sessions]);

  // Per student
  const studentData = useMemo(() => allStudents.map(s => {
    const pts = getPoints(s.id);
    const prog = getProgress(s.id);
    const achs = getAchievements(s.id);
    const completed = prog.filter(p => p.completed).length;
    const totalCorrect = prog.reduce((a, p) => a + p.correctAnswers, 0);
    const totalAnswered = prog.reduce((a, p) => a + p.totalQuestions, 0);
    const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    return { student: s, pts, completed, accuracy, achievements: achs.length };
  }).sort((a, b) => (b.pts?.total ?? 0) - (a.pts?.total ?? 0)), [allStudents]);

  function handlePinChange() {
    if (!/^\d{4}$/.test(newPin)) {
      setPinMsg('PIN måste vara exakt 4 siffror');
      return;
    }
    setTeacherPin(newPin);
    setPinMsg('PIN-koden har ändrats! ✅');
    setNewPin('');
  }

  const tabs: { id: typeof tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Översikt', icon: '📊' },
    { id: 'students', label: 'Elever', icon: '👥' },
    { id: 'topics', label: 'Ämnen', icon: '📚' },
    { id: 'settings', label: 'Inställningar', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-6 px-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black">👩‍🏫 Lärarvy</h1>
            <p className="text-white/80 text-sm">{allStudents.length} elever registrerade</p>
          </div>
          <button
            onClick={() => setTeacher(false)}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl font-bold text-sm transition-colors"
          >
            ← Avsluta
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-3 text-sm font-bold transition-colors border-b-2 ${
                tab === t.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-2 gap-3">
              <StatCard icon="👤" label="Totalt elever" value={String(allStudents.length)} color="bg-blue-50 text-blue-700" />
              <StatCard icon="🟢" label="Aktiva idag" value={String(stats.activeToday)} color="bg-green-50 text-green-700" />
              <StatCard icon="✏️" label="Totala svar" value={String(stats.totalExercises)} color="bg-purple-50 text-purple-700" />
              <StatCard icon="🎯" label="Snitt träffsäkerhet" value={`${stats.avgAccuracy}%`} color="bg-amber-50 text-amber-700" />
            </div>

            {/* Top topics */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h2 className="font-bold text-gray-800 mb-4">🔥 Populäraste ämnen</h2>
              {stats.topTopics.length === 0 ? (
                <p className="text-gray-400 text-sm">Ingen data ännu</p>
              ) : (
                <div className="space-y-3">
                  {stats.topTopics.map((t, i) => (
                    <div key={t.id} className="flex items-center gap-3">
                      <span className="text-lg font-black text-gray-400 w-5">#{i+1}</span>
                      <span className="text-xl">{t.icon}</span>
                      <span className="flex-1 font-semibold text-gray-700">{t.title}</span>
                      <span className="text-sm text-indigo-600 font-bold">{t.count} gånger</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Grade distribution */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h2 className="font-bold text-gray-800 mb-4">🏫 Klassfördelning</h2>
              {Object.keys(stats.gradeCount).length === 0 ? (
                <p className="text-gray-400 text-sm">Inga elever ännu</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(stats.gradeCount)
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([grade, count]) => (
                      <div key={grade} className="flex items-center gap-3">
                        <span className="w-16 text-sm font-bold text-gray-600">
                          {GRADE_LABELS[grade as Grade] ?? grade}
                        </span>
                        <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-400 rounded-full"
                            style={{ width: `${(count / allStudents.length) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500 w-6">{count}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Weekly activity */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h2 className="font-bold text-gray-800 mb-4">📅 Aktivitet senaste 7 dagarna</h2>
              {Object.keys(stats.dailyActivity).length === 0 ? (
                <p className="text-gray-400 text-sm">Ingen aktivitet ännu</p>
              ) : (
                <div className="flex items-end gap-2 h-24">
                  {Array.from({ length: 7 }, (_, i) => {
                    const d = new Date(Date.now() - (6 - i) * 86400000);
                    const key = d.toISOString().split('T')[0];
                    const val = stats.dailyActivity[key] ?? 0;
                    const max = Math.max(...Object.values(stats.dailyActivity), 1);
                    const pct = (val / max) * 100;
                    return (
                      <div key={key} className="flex flex-col items-center flex-1 gap-1">
                        <span className="text-xs text-gray-500">{val || ''}</span>
                        <div
                          className="w-full bg-indigo-400 rounded-t-lg transition-all"
                          style={{ height: `${Math.max(4, pct)}%` }}
                        />
                        <span className="text-xs text-gray-400">
                          {d.toLocaleDateString('sv-SE', { weekday: 'narrow' })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STUDENTS TAB */}
        {tab === 'students' && (
          <div className="space-y-3 animate-fade-in">
            {studentData.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                <div className="text-4xl mb-2">👥</div>
                <p className="text-gray-500">Inga elever registrerade ännu</p>
              </div>
            ) : studentData.map(({ student, pts, completed, accuracy, achievements }) => (
              <div key={student.id} className="bg-white rounded-2xl shadow-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{['🦁','🐼','🦊','🐸','🦋','🐢','🦄','🐉'][student.avatar]}</div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-bold text-gray-800">{student.name}</p>
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                        {GRADE_LABELS[student.grade]}
                      </span>
                    </div>
                    <div className="flex gap-3 mt-1 text-xs text-gray-500">
                      <span>⭐ Nivå {pts?.level ?? 0} · {pts?.total ?? 0}p</span>
                      <span>✅ {completed} ämnen</span>
                      <span>🎯 {accuracy}%</span>
                      <span>🏆 {achievements} märken</span>
                    </div>
                    {/* Level bar */}
                    <div className="mt-1.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-400 rounded-full"
                        style={{ width: `${Math.min(100, ((pts?.total ?? 0) / 500) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TOPICS TAB */}
        {tab === 'topics' && (
          <div className="space-y-3 animate-fade-in">
            <p className="text-sm text-gray-500 mb-2">Hur ofta varje ämne har tränats av alla elever</p>
            {TOPICS.map(topic => {
              const topicSessions = sessions.filter(s => s.topicId === topic.id);
              const attempts = topicSessions.length;
              const correct = topicSessions.reduce((s, e) => s + e.correctAnswers, 0);
              const total = topicSessions.reduce((s, e) => s + e.totalAnswers, 0);
              const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
              const studentsWhoTried = new Set(topicSessions.map(s => s.studentId)).size;
              const maxAttempts = Math.max(...TOPICS.map(t =>
                sessions.filter(s => s.topicId === t.id).length
              ), 1);

              return (
                <div key={topic.id} className="bg-white rounded-2xl shadow-sm p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-lg flex-shrink-0`}>
                      {topic.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 truncate">{topic.title}</p>
                      <div className="flex gap-3 text-xs text-gray-500">
                        <span>👥 {studentsWhoTried} elever</span>
                        <span>🔄 {attempts} gånger</span>
                        {attempts > 0 && <span>🎯 {accuracy}%</span>}
                      </div>
                    </div>
                  </div>
                  {/* Bar */}
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${topic.color}`}
                      style={{ width: `${(attempts / maxAttempts) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SETTINGS TAB */}
        {tab === 'settings' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h2 className="font-bold text-gray-800 mb-4">🔐 Ändra lärar-PIN</h2>
              <p className="text-sm text-gray-500 mb-3">Nuvarande PIN: {getTeacherPin()}</p>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={4}
                value={newPin}
                onChange={e => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="Ny 4-siffrig PIN"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg font-bold text-center tracking-widest focus:outline-none focus:border-indigo-500 mb-3"
              />
              <button
                onClick={handlePinChange}
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Spara ny PIN
              </button>
              {pinMsg && <p className="text-center text-sm mt-2 font-semibold text-green-600">{pinMsg}</p>}
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h2 className="font-bold text-gray-800 mb-3">📱 Om appen</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <p>🧮 <strong>MatematikAppen</strong> – Lär dig matte på ett roligt sätt</p>
                <p>📚 {TOPICS.length} ämnesområden täckande åk 1 – gymnasium</p>
                <p>💾 All data sparas lokalt i webbläsaren (inga kostnader)</p>
                <p>🏆 {18} utmärkelser att låsa upp</p>
                <p>✏️ Ingen AI-anrop – fungerar offline!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <div className={`${color} rounded-2xl p-4`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-black">{value}</div>
      <div className="text-xs font-semibold opacity-80">{label}</div>
    </div>
  );
}
