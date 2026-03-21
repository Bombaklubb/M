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

  // Respect the topicIds order defined in worlds.ts (not TOPICS array order)
  const worldTopics = world.topicIds
    .map(id => TOPICS.find(t => t.id === id))
    .filter(Boolean) as typeof TOPICS;
  const allRelevant = showAll
    ? TOPICS.filter(t => !world.topicIds.includes(t.id) && worldTopics.length > 0)
    : [];

  const completed = worldTopics.filter(t => progress.some(p => p.topicId === t.id && p.completed)).length;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #07071a 0%, #0d0d2b 50%, #1a0a2e 100%)' }}>
      <AppHeader />
      {/* World header */}
      <div className={`bg-gradient-to-r ${world.bg} text-white pb-6 pt-16 px-4 relative overflow-hidden`}>
        <div className="absolute right-0 top-0 opacity-20 text-8xl pointer-events-none select-none p-4">
          {world.emoji}
        </div>
        <div className="max-w-lg mx-auto">
          <button onClick={()=>setView('dashboard')} className="text-white/70 hover:text-white text-sm mb-3 flex items-center gap-1">
            ← Välj värld
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className="text-5xl leading-none bg-white/25 rounded-2xl p-1.5 inline-flex items-center justify-center shadow-md flex-shrink-0">{world.emoji}</div>
            <div>
              <h1 className="text-2xl font-black">{world.name}</h1>
              <p className="text-white/80 text-sm">{world.subtitle}</p>
            </div>
          </div>
          {/* Progress */}
          <div className="bg-white/20 rounded-2xl p-3 mb-4">
            <div className="flex justify-between text-sm text-white/80 mb-1.5">
              <span>⭐ {points.total} poäng</span>
              <span>{completed}/{worldTopics.length} kapitel klara</span>
            </div>
            <div className="h-2.5 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{width:`${worldTopics.length ? (completed/worldTopics.length)*100 : 0}%`}}/>
            </div>
          </div>

          {/* World switcher */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {WORLDS.map(w => (
              <button key={w.id} onClick={() => setView(`world-${w.id}` as any)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold transition-all ${
                  w.id === worldId
                    ? 'bg-white text-gray-800 shadow-md'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}>
                <span>{w.emoji}</span>
                <span className="hidden sm:inline">{w.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Topics */}
      <div className="max-w-lg mx-auto px-4 py-5 space-y-3">
        {/* Quest + Spel shortcuts side by side */}
        <div className="grid grid-cols-2 gap-2">
          <button onClick={()=>startQuest(worldId)}
            className="bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl p-4 hover:bg-white/12 hover:scale-[1.02] transition-all text-left flex items-center gap-2">
            <span className="text-xl">⚔️</span>
            <div className="min-w-0">
              <p className="font-black text-white text-sm">Äventyr</p>
              <p className="text-white/50 text-xs truncate">Berättelseutmaning</p>
            </div>
          </button>
          <button onClick={()=>startGames(worldId)}
            className={`relative overflow-hidden bg-white/8 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:bg-white/12 hover:scale-[1.02] transition-all text-left flex items-center gap-2`}
            style={{ borderColor: `${world.accentHex}55` }}
          >
            <span className="text-xl">🎮</span>
            <div className="min-w-0">
              <p className="font-black text-white text-sm">Spel</p>
              <p className="text-white/50 text-xs truncate">Träna med spel!</p>
            </div>
          </button>
        </div>

        <h2 className="text-white/50 font-bold text-sm uppercase tracking-widest mt-1">Kapitel</h2>

        <div className="grid grid-cols-3 gap-2">
          {worldTopics.map((topic, idx) => {
            const tp = progress.find(p => p.topicId === topic.id);
            const stars = tp?.stars ?? 0;
            const isCompleted = tp?.completed ?? false;
            const hasStarted = !!tp;

            return (
              <button key={topic.id} onClick={()=>selectTopic(topic)}
                className="bg-white/8 backdrop-blur-md border border-white/15 rounded-xl p-2.5 hover:bg-white/15 hover:border-white/30 hover:scale-[1.03] active:scale-[0.98] transition-all text-left">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-xs mb-1.5 bg-gradient-to-br ${topic.color} shadow-md`}>
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <p className="font-black text-white text-xs leading-tight mb-1 line-clamp-2">{topic.title}</p>
                <div className="flex gap-0.5">
                  {[0,1,2].map(i=>(
                    <span key={i} className={`text-xs ${i<stars?'text-yellow-400':'text-white/20'}`}>★</span>
                  ))}
                </div>
                {!hasStarted && (
                  <span className="inline-block mt-1 bg-blue-500/30 text-blue-300 text-[10px] font-bold px-1 py-0.5 rounded-full leading-none">Ny</span>
                )}
              </button>
            );
          })}
        </div>

        {worldTopics.length === 0 && (
          <div className="text-center py-10 text-white/40">
            <p className="text-4xl mb-2">📚</p>
            <p>Inga kapitel hittades för denna värld</p>
          </div>
        )}

        {/* Sluttest button */}
        {worldTopics.length > 0 && (
          <div className="mt-2 mb-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 mb-3">
              <p className="text-white/40 text-xs text-center leading-relaxed">
                ✨ Klara med alla kapitel? Testa dina kunskaper med ett sluttest!
              </p>
            </div>
            <button
              onClick={() => startSluttest(worldId)}
              className={`w-full bg-gradient-to-r ${world.bg} text-white font-black text-lg py-4 px-6 rounded-2xl hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-3 relative overflow-hidden`}
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity rounded-2xl" />
              <span className="text-2xl">🏆</span>
              <span>Sluttest – Testa allt!</span>
              <span className="text-xl opacity-80">→</span>
            </button>
            <p className="text-center text-white/30 text-xs mt-2">
              Frågor från alla {worldTopics.length} kapitel
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
