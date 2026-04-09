import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { WORLDS, WorldId } from '../data/worlds';
import { TOPICS } from '../data/topics';
import { getProgress, getPoints, initPoints } from '../utils/storage';
import { getDifficultyLevel, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '../utils/adaptive';
import { GRADE_LABELS } from '../types';
import AppHeader from './AppHeader';

export default function WorldMap({ worldId }: { worldId: WorldId }) {
  const { currentStudent, selectTopic, setView, startSluttest, startQuest, startGames } = useApp();
  const [showAll, setShowAll] = useState(false);
  if (!currentStudent) return null;

  const world = WORLDS.find(w => w.id === worldId)!;
  const points = getPoints(currentStudent.id) ?? initPoints(currentStudent.id);
  const progress = getProgress(currentStudent.id);

  const worldTopics = world.topicIds
    .map(id => TOPICS.find(t => t.id === id))
    .filter(Boolean) as typeof TOPICS;
  const allRelevant = showAll
    ? TOPICS.filter(t => !world.topicIds.includes(t.id) && worldTopics.length > 0)
    : [];

  const completed = worldTopics.filter(t => progress.some(p => p.topicId === t.id && p.completed)).length;

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "url('/Drömmig lärandemiljö med kontorstillbehör.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <AppHeader />

      {/* World header */}
      <div className={`bg-gradient-to-r ${world.bg} pb-6 pt-16 px-4 relative overflow-hidden`}>
        <div className="absolute right-0 top-0 opacity-20 text-8xl pointer-events-none select-none p-4">
          {world.emoji}
        </div>
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => setView('dashboard')}
            className="text-sm mb-3 flex items-center gap-1 font-semibold"
            style={{ color: 'rgba(50,50,80,0.65)' }}
          >
            ← Välj värld
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="text-5xl leading-none bg-white/50 rounded-2xl p-1.5 inline-flex items-center justify-center shadow-md flex-shrink-0"
              style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
            >
              {world.emoji}
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-800">
                {world.name}
              </h1>
              <p className="text-gray-600 text-sm">{world.subtitle}</p>
            </div>
          </div>

          {/* Progress box */}
          <div
            className="rounded-2xl p-3 mb-4"
            style={{ background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(8px)' }}
          >
            <div className="flex justify-between text-sm text-gray-700 mb-1.5">
              <span className="font-bold">⭐ {points.total} poäng</span>
              <span>{completed}/{worldTopics.length} kapitel klara</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.10)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${worldTopics.length ? (completed / worldTopics.length) * 100 : 0}%`,
                  background: 'linear-gradient(90deg, #fbbf24, #f97316)',
                  boxShadow: '0 0 8px rgba(245,158,11,0.5)',
                }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-5 space-y-3">
        {/* Quest + Spel shortcuts */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => startQuest(worldId)}
            className="rounded-2xl p-4 hover:scale-[1.02] transition-all text-left flex items-center gap-2"
            style={{
              background: 'rgba(255, 255, 255, 0.88)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(251, 146, 60, 0.30)',
            }}
          >
            <span className="text-xl">⚔️</span>
            <div className="min-w-0">
              <p className="font-black text-gray-800 text-sm">Äventyr</p>
              <p className="text-xs truncate text-gray-500">Berättelseutmaning</p>
            </div>
          </button>
          <button
            onClick={() => startGames(worldId)}
            className="relative overflow-hidden rounded-2xl p-4 hover:scale-[1.02] transition-all text-left flex items-center gap-2"
            style={{
              background: 'rgba(255, 255, 255, 0.88)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${world.accentHex}66`,
            }}
          >
            <span className="text-xl">🎮</span>
            <div className="min-w-0">
              <p className="font-black text-gray-800 text-sm">Spel</p>
              <p className="text-xs truncate text-gray-500">Träna med spel!</p>
            </div>
          </button>
        </div>

        <h2 className="font-bold text-sm uppercase tracking-widest" style={{ color: 'rgba(234,88,12,0.65)' }}>
          ✦ Kapitel
        </h2>

        <div className="grid grid-cols-3 gap-2">
          {worldTopics.map((topic, idx) => {
            const tp = progress.find(p => p.topicId === topic.id);
            const stars = tp?.stars ?? 0;
            const isCompleted = tp?.completed ?? false;
            const hasStarted = !!tp;

            return (
              <button
                key={topic.id}
                onClick={() => selectTopic(topic)}
                className="rounded-xl p-2.5 hover:scale-[1.04] active:scale-[0.98] transition-all text-left"
                style={{
                  background: 'rgba(255, 255, 255, 0.88)',
                  backdropFilter: 'blur(12px)',
                  border: isCompleted
                    ? '1px solid rgba(249,115,22,0.50)'
                    : '1px solid rgba(251,146,60,0.25)',
                  boxShadow: isCompleted
                    ? '0 0 12px rgba(249,115,22,0.20)'
                    : '0 4px 12px rgba(251,146,60,0.10)',
                }}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-xs mb-1.5 bg-gradient-to-br ${topic.color} shadow-md`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <p className="font-black text-gray-800 text-xs leading-tight mb-1 line-clamp-2">{topic.title}</p>
                <div className="flex gap-0.5">
                  {[0, 1, 2].map(i => (
                    <span
                      key={i}
                      className="text-xs"
                      style={{ color: i < stars ? '#f97316' : 'rgba(0,0,0,0.15)' }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                {!hasStarted && (
                  <span
                    className="inline-block mt-1 text-[10px] font-bold px-1 py-0.5 rounded-full leading-none"
                    style={{
                      background: 'rgba(249,115,22,0.22)',
                      color: '#fb923c',
                      border: '1px solid rgba(249,115,22,0.35)',
                    }}
                  >
                    Ny
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {worldTopics.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <p className="text-4xl mb-2">📚</p>
            <p>Inga kapitel hittades för denna värld</p>
          </div>
        )}

        {/* Sluttest */}
        {worldTopics.length > 0 && (
          <div className="mt-2 mb-4">
            <div
              className="rounded-2xl p-3 mb-3"
              style={{
                background: 'rgba(255, 255, 255, 0.70)',
                border: '1px solid rgba(251,146,60,0.25)',
              }}
            >
              <p className="text-xs text-center leading-relaxed text-gray-500">
                ✨ Klara med alla kapitel? Testa dina kunskaper med ett sluttest!
              </p>
            </div>
            <button
              onClick={() => startSluttest(worldId)}
              className={`w-full bg-gradient-to-r ${world.bg} text-gray-800 font-black text-lg py-4 px-6 rounded-2xl hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-3 relative overflow-hidden`}
              style={{ boxShadow: '0 6px 24px rgba(0,0,0,0.15)', border: '1px solid rgba(0,0,0,0.10)' }}
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity rounded-2xl" />
              <span className="text-2xl">🏆</span>
              <span>Sluttest – Testa allt!</span>
              <span className="text-xl opacity-80">→</span>
            </button>
            <p className="text-center text-xs mt-2 text-gray-400">
              Frågor från alla {worldTopics.length} kapitel
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
