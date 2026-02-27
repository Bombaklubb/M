import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { WORLDS, WorldId } from '../data/worlds';
import { TOPICS } from '../data/topics';
import { getProgress, getPoints, initPoints } from '../utils/storage';
import { getDifficultyLevel, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '../utils/adaptive';
import { GRADE_LABELS } from '../types';
import AppHeader from './AppHeader';

export default function WorldMap({ worldId }: { worldId: WorldId }) {
  const { currentStudent, selectTopic, setView } = useApp();
  const [showAll, setShowAll] = useState(false);
  if (!currentStudent) return null;

  const world = WORLDS.find(w => w.id === worldId)!;
  const points = getPoints(currentStudent.id) ?? initPoints(currentStudent.id);
  const progress = getProgress(currentStudent.id);

  const worldTopics = TOPICS.filter(t => world.topicIds.includes(t.id));
  const allRelevant = showAll
    ? TOPICS.filter(t => !world.topicIds.includes(t.id) && worldTopics.length > 0)
    : [];

  const completed = worldTopics.filter(t => progress.some(p => p.topicId === t.id && p.completed)).length;

  return (
    <div className="min-h-screen bg-gray-50">
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
          <p className="text-white/70 text-sm italic mb-4">"{world.storyIntro}"</p>

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
        {/* Quick drill shortcut */}
        <button onClick={()=>setView('quick-drill')}
          className={`w-full bg-gradient-to-r ${world.bg} text-white rounded-2xl p-4 flex items-center gap-3 shadow-md hover:scale-[1.02] transition-all`}>
          <span className="text-3xl">⚡</span>
          <div className="text-left">
            <p className="font-black text-lg">Snabbträning!</p>
            <p className="text-white/80 text-sm">60 sek – träna allt på {world.name}</p>
          </div>
          <span className="ml-auto text-white/60 text-2xl">→</span>
        </button>

        {/* Quest & Collection shortcuts */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={()=>setView('quest')}
            className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all text-left">
            <span className="text-2xl">⚔️</span>
            <p className="font-black text-gray-800 text-sm mt-1">Äventyr</p>
            <p className="text-gray-500 text-xs">Berättelseproblem</p>
          </button>
          <button onClick={()=>setView('collection')}
            className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all text-left">
            <span className="text-2xl">🏅</span>
            <p className="font-black text-gray-800 text-sm mt-1">Samling</p>
            <p className="text-gray-500 text-xs">Dina föremål</p>
          </button>
        </div>

        <h2 className="text-gray-700 font-bold text-sm uppercase tracking-widest mt-1">Kapitel</h2>

        {worldTopics.map((topic, idx) => {
          const tp = progress.find(p => p.topicId === topic.id);
          const diff = getDifficultyLevel(currentStudent.id, topic.id);
          const diffLabel = DIFFICULTY_LABELS[diff];
          const diffColor = DIFFICULTY_COLORS[diff];
          const stars = tp?.stars ?? 0;
          const isCompleted = tp?.completed ?? false;
          const hasStarted = !!tp;

          return (
            <button key={topic.id} onClick={()=>selectTopic(topic)}
              className="w-full bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-gray-300 hover:scale-[1.01] active:scale-[0.99] transition-all text-left">
              <div className="flex items-center gap-4">
                {/* Chapter number */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white flex-shrink-0 bg-gradient-to-br ${topic.color} shadow-md`}>
                  {idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="font-black text-gray-800">{topic.title}</span>
                    {isCompleted && <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">✓ Klar</span>}
                    {!hasStarted && <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">Ny</span>}
                  </div>
                  <p className="text-gray-500 text-xs truncate">{topic.description}</p>

                  <div className="flex items-center gap-3 mt-1.5">
                    {/* Stars */}
                    <div className="flex gap-0.5">
                      {[0,1,2].map(i=>(
                        <span key={i} className={`text-sm ${i<stars?'text-yellow-400':'text-gray-200'}`}>★</span>
                      ))}
                    </div>
                    {/* Adaptive difficulty badge */}
                    {hasStarted && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${diffColor}`}>
                        {diffLabel}
                      </span>
                    )}
                    {tp && <span className="text-xs text-gray-400">Bäst: {tp.bestScore}%</span>}
                  </div>
                </div>

                <span className="text-gray-300 text-xl flex-shrink-0">→</span>
              </div>
            </button>
          );
        })}

        {worldTopics.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <p className="text-4xl mb-2">📚</p>
            <p>Inga kapitel hittades för denna värld</p>
          </div>
        )}
      </div>
    </div>
  );
}
