import React from 'react';
import { useApp } from '../contexts/AppContext';
import { WORLDS, gradeToWorld, getAccessibleWorlds } from '../data/worlds';
import { gradeToNum } from '../data/topics';
import { getPoints, initPoints, getProgress } from '../utils/storage';
import { LEVEL_NAMES, LEVEL_THRESHOLDS } from '../types';

const AVATARS = ['🦁','🐼','🦊','🐸','🦋','🐢','🦄','🐉'];

export default function WorldSelect() {
  const { currentStudent, setView, selectTopic, logout } = useApp();
  if (!currentStudent) return null;

  const points = getPoints(currentStudent.id) ?? initPoints(currentStudent.id);
  const progress = getProgress(currentStudent.id);
  const gradeNum = gradeToNum(currentStudent.grade);
  const currentWorldId = gradeToWorld(currentStudent.grade);
  const accessibleWorlds = getAccessibleWorlds(gradeNum);

  const levelName = LEVEL_NAMES[points.level];
  const nextLevelPts = LEVEL_THRESHOLDS[points.level+1] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length-1];
  const curLevelPts = LEVEL_THRESHOLDS[points.level] ?? 0;
  const levelPct = nextLevelPts > curLevelPts ? ((points.total - curLevelPts)/(nextLevelPts - curLevelPts))*100 : 100;

  return (
    <div className="min-h-screen" style={{background:'linear-gradient(160deg,#0f2027,#203a43,#2c5364)'}}>
      {/* Stars */}
      {Array.from({length:20},(_,i)=>(
        <div key={i} className="fixed rounded-full bg-white pointer-events-none"
          style={{width:`${1+Math.random()*2}px`,height:`${1+Math.random()*2}px`,
            top:`${Math.random()*100}%`,left:`${Math.random()*100}%`,opacity:0.3+Math.random()*0.4}}/>
      ))}

      {/* Header */}
      <div className="relative px-4 pt-5 pb-3">
        <div className="max-w-lg mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{AVATARS[currentStudent.avatar]}</div>
              <div>
                <p className="font-black text-white text-lg leading-tight">{currentStudent.name}</p>
                <p className="text-blue-200 text-sm">Nivå {points.level}: {levelName}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>setView('quick-drill')}
                className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-3 py-2 rounded-xl text-xs transition-colors">
                ⚡ Snabbträning
              </button>
              <button onClick={()=>setView('error-bank')}
                className="bg-red-500/80 hover:bg-red-500 text-white font-bold px-3 py-2 rounded-xl text-xs transition-colors">
                💡 Träna misstag
              </button>
            </div>
          </div>

          {/* Level bar */}
          <div className="bg-white/10 rounded-2xl p-3 mb-4">
            <div className="flex justify-between text-xs text-white/70 mb-1.5">
              <span>⭐ {points.total} poäng</span>
              <span>🔥 {points.streak} dagars streak</span>
              <span>Nästa nivå: {nextLevelPts}p</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full transition-all"
                style={{width:`${Math.min(100,levelPct)}%`}}/>
            </div>
          </div>

          {/* Nav pills */}
          <div className="flex gap-2 justify-center flex-wrap">
            <button onClick={()=>setView('my-results')}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
              📊 Mina resultat
            </button>
            <button onClick={()=>setView('achievements')}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
              🏆 Utmärkelser
            </button>
            <button onClick={logout}
              className="bg-white/10 hover:bg-white/20 text-white/60 text-xs font-bold px-4 py-2 rounded-xl transition-colors">
              Byt elev
            </button>
          </div>
        </div>
      </div>

      {/* Worlds */}
      <div className="max-w-lg mx-auto px-4 pb-10 mt-4 space-y-4">
        <h2 className="text-white/80 text-sm font-bold uppercase tracking-widest text-center mb-5">
          ✨ Välj din värld
        </h2>

        {WORLDS.map(world => {
          const isAccessible = accessibleWorlds.includes(world.id);
          const isCurrent = world.id === currentWorldId;
          const worldProgress = progress.filter(p => world.topicIds.includes(p.topicId));
          const completed = worldProgress.filter(p => p.completed).length;
          const pct = world.topicIds.length > 0 ? (completed / world.topicIds.length) * 100 : 0;

          return (
            <button key={world.id}
              onClick={()=> isAccessible && setView(`world-${world.id}` as any)}
              disabled={!isAccessible}
              className={`w-full text-left rounded-3xl overflow-hidden transition-all shadow-xl ${
                isAccessible ? 'hover:scale-[1.02] active:scale-[0.98] cursor-pointer' : 'opacity-50 cursor-not-allowed'
              } ${isCurrent ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-transparent' : ''}`}>

              {/* World card */}
              <div className={`bg-gradient-to-r ${world.bg} p-5 relative overflow-hidden`}>
                {/* Decorative emojis */}
                <div className="absolute right-4 top-2 flex gap-2 opacity-30 text-2xl">
                  {world.islandEmojis.slice(0,3).map((e,i)=><span key={i}>{e}</span>)}
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-5xl flex-shrink-0">{world.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-white font-black text-xl leading-tight">{world.name}</h3>
                      {isCurrent && <span className="bg-amber-400 text-amber-900 text-xs font-black px-2 py-0.5 rounded-full">DIN VÄRLD</span>}
                      {!isAccessible && <span className="text-white/60 text-sm">🔒</span>}
                    </div>
                    <p className="text-white/80 text-sm font-semibold">{world.subtitle}</p>
                    <p className="text-white/60 text-xs mt-1 line-clamp-1">{world.storyIntro}</p>

                    {isAccessible && (
                      <div className="mt-3">
                        <div className="flex justify-between text-white/70 text-xs mb-1">
                          <span>{completed} / {world.topicIds.length} kapitel klara</span>
                          <span>{Math.round(pct)}%</span>
                        </div>
                        <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                          <div className="h-full bg-white rounded-full transition-all"
                            style={{width:`${pct}%`}}/>
                        </div>
                      </div>
                    )}
                    {!isAccessible && (
                      <p className="text-white/50 text-xs mt-2">Lås upp när du kommit längre</p>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
