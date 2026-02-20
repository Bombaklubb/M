import React from 'react';
import { useApp } from '../contexts/AppContext';
import { LEVEL_NAMES, LEVEL_COLORS, LEVEL_THRESHOLDS } from '../types';
import { getProgress, getPoints, initPoints } from '../utils/storage';
import { TOPICS } from '../data/topics';

const AVATARS = ['🦁', '🐼', '🦊', '🐸', '🦋', '🐢', '🦄', '🐉'];

export default function StudentResults() {
  const { currentStudent, setView, getStudentStats } = useApp();
  if (!currentStudent) return null;

  const stats = getStudentStats(currentStudent);
  const { points, progress } = stats;
  const level = points.level;
  const currentLevelMin = LEVEL_THRESHOLDS[level] ?? 0;
  const nextLevelMin = LEVEL_THRESHOLDS[level + 1] ?? currentLevelMin;
  const levelPct = nextLevelMin > currentLevelMin
    ? ((points.total - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100
    : 100;

  const accuracy = stats.totalAnswered > 0
    ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
    : 0;

  const completedTopics = TOPICS.filter(t =>
    progress.some(p => p.topicId === t.id && p.completed)
  );

  const allTopicProgress = TOPICS.map(t => ({
    topic: t,
    prog: progress.find(p => p.topicId === t.id),
  })).filter(tp => tp.prog);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${LEVEL_COLORS[level]} text-white py-8 px-4`}>
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => setView('dashboard')}
            className="text-white/80 hover:text-white text-sm mb-4 block"
          >
            ← Tillbaka
          </button>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">{AVATARS[currentStudent.avatar]}</div>
            <div>
              <h1 className="text-2xl font-black">{currentStudent.name}</h1>
              <p className="text-white/80">Nivå {level}: {LEVEL_NAMES[level]}</p>
            </div>
          </div>
          {/* Level bar */}
          <div className="h-3 bg-white/30 rounded-full overflow-hidden mb-1">
            <div className="h-full bg-white rounded-full" style={{ width: `${Math.min(100, levelPct)}%` }}/>
          </div>
          <p className="text-xs text-white/70">{points.total} / {nextLevelMin} poäng till nästa nivå</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {/* Stats overview */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon="✅" value={String(stats.completedTopics)} label="Klara ämnen" color="bg-green-50 text-green-700" />
          <StatCard icon="🎯" value={`${accuracy}%`} label="Träffsäkerhet" color="bg-blue-50 text-blue-700" />
          <StatCard icon="🔢" value={String(stats.totalCorrect)} label="Rätta svar" color="bg-purple-50 text-purple-700" />
          <StatCard icon="🔥" value={String(points.streak)} label="Dagars streak" color="bg-orange-50 text-orange-700" />
          <StatCard icon="⭐" value={String(progress.reduce((s, p) => s + p.stars, 0))} label="Stjärnor totalt" color="bg-yellow-50 text-yellow-700" />
          <StatCard icon="🏆" value={String(points.total)} label="Poäng totalt" color="bg-amber-50 text-amber-700" />
        </div>

        {/* Buttons */}
        <button
          onClick={() => setView('achievements')}
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:shadow-lg transition-all"
        >
          🏅 Mina märken och utmärkelser ({stats.achievements.length})
        </button>

        {/* Topic progress */}
        {allTopicProgress.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-3">📚 Mina ämnen</h2>
            <div className="space-y-3">
              {allTopicProgress.map(({ topic, prog }) => prog && (
                <div key={topic.id} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-xl flex-shrink-0`}>
                      {topic.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-gray-800 truncate">{topic.title}</p>
                        <div className="flex gap-0.5 ml-2 flex-shrink-0">
                          {[0,1,2].map(i => (
                            <span key={i} className={`text-sm ${i < prog.stars ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${topic.color}`}
                            style={{ width: `${prog.bestScore}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 flex-shrink-0">{prog.bestScore}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {allTopicProgress.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="text-5xl mb-3">🚀</div>
            <p className="font-bold text-gray-700">Inga resultat ännu</p>
            <p className="text-gray-500 text-sm mt-1">Börja träna för att se dina resultat här!</p>
            <button
              onClick={() => setView('dashboard')}
              className="mt-4 bg-blue-500 text-white font-bold py-2 px-6 rounded-xl hover:bg-blue-600 transition-colors"
            >
              Börja träna!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, color }: { icon: string; value: string; label: string; color: string }) {
  return (
    <div className={`${color} rounded-2xl p-4`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-black">{value}</div>
      <div className="text-xs font-semibold opacity-80">{label}</div>
    </div>
  );
}
