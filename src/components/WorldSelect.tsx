import React from 'react';
import { useApp } from '../contexts/AppContext';
import { WORLDS, gradeToWorld, getAccessibleWorlds } from '../data/worlds';
import { gradeToNum } from '../data/topics';
import { getPoints, initPoints, getProgress } from '../utils/storage';
import AppHeader from './AppHeader';

export default function WorldSelect() {
  const { currentStudent, setView } = useApp();
  if (!currentStudent) return null;

  const points = getPoints(currentStudent.id) ?? initPoints(currentStudent.id);
  const progress = getProgress(currentStudent.id);
  const gradeNum = gradeToNum(currentStudent.grade);
  const currentWorldId = gradeToWorld(currentStudent.grade);
  const accessibleWorlds = getAccessibleWorlds(gradeNum);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg,#0f2027,#203a43,#2c5364)' }}>
      <AppHeader />

      {/* Stars */}
      {Array.from({ length: 24 }, (_, i) => (
        <div key={i} className="fixed rounded-full bg-white pointer-events-none"
          style={{
            width: `${1 + Math.random() * 2}px`, height: `${1 + Math.random() * 2}px`,
            top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
            opacity: 0.3 + Math.random() * 0.4,
          }} />
      ))}

      {/* Main content */}
      <div className="relative pt-14">
        <div className="max-w-4xl mx-auto px-6 pb-12">

          {/* Logo + titel */}
          <div className="flex flex-col items-center pt-6 pb-5">
            <img
              src="/mattejakten.png"
              alt="Mattejakten"
              className="h-44 w-auto"
              style={{ clipPath: 'inset(5% round 20px)', filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.5))' }}
            />
            <h2 className="text-white/70 text-xs font-bold uppercase tracking-widest mt-3">
              ✨ Välj din värld
            </h2>
          </div>

          {/* Worlds grid */}
          <div className="grid grid-cols-2 gap-4">
            {WORLDS.map(world => {
              const isCurrent = world.id === currentWorldId;
              const worldProgress = progress.filter(p => world.topicIds.includes(p.topicId));
              const completed = worldProgress.filter(p => p.completed).length;
              const pct = world.topicIds.length > 0 ? (completed / world.topicIds.length) * 100 : 0;

              return (
                <button key={world.id}
                  onClick={() => setView(`world-${world.id}` as any)}
                  className={`text-left rounded-3xl overflow-hidden transition-all shadow-xl hover:scale-[1.03] active:scale-[0.97] cursor-pointer ${
                    isCurrent ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-transparent' : ''
                  }`}
                >
                  <div className={`bg-gradient-to-br ${world.bg} p-5 relative overflow-hidden h-full`}>
                    <div className="absolute right-2 bottom-2 opacity-20 text-4xl leading-none">
                      {world.islandEmojis[0]}
                    </div>

                    <div className="flex items-start justify-between mb-3">
                      <div className="text-5xl leading-none bg-white/20 rounded-2xl p-1.5 inline-flex items-center justify-center shadow-lg">
                        {world.emoji}
                      </div>
                      {isCurrent && (
                        <span className="bg-amber-400 text-amber-900 text-xs font-black px-2 py-0.5 rounded-full">
                          DIN VÄRLD
                        </span>
                      )}
                    </div>

                    <h3 className="text-white font-black text-lg leading-tight mb-0.5">
                      {world.name}
                    </h3>
                    <p className="text-white/70 text-xs font-semibold mb-3">{world.subtitle}</p>

                    <div>
                      <div className="flex justify-between text-white/70 text-xs mb-1">
                        <span>{completed}/{world.topicIds.length} klara</span>
                        <span>{Math.round(pct)}%</span>
                      </div>
                      <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full transition-all"
                          style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
