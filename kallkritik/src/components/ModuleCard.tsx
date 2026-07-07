import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Lock, Zap, GraduationCap } from 'lucide-react';
import { ModuleMeta } from '@/types';
import { LessonGuideModal } from './LessonGuideModal';

interface ModuleCardProps {
  module: ModuleMeta;
  isCompleted: boolean;
  highScore?: number;
  isLocked?: boolean;
  isStartHere?: boolean;
  onClick: () => void;
  index: number;
}

const difficultyConfig: Record<string, { label: string; className: string }> = {
  'Lätt':  { label: 'Lätt',  className: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  'Medel': { label: 'Medel', className: 'bg-amber-100 text-amber-700 border-amber-300' },
  'Svår':  { label: 'Svår',  className: 'bg-rose-100 text-rose-700 border-rose-300' },
};

const cardColorClass: Record<number, string> = {
  7: 'module-card-sky',
  10: 'module-card-lime',
  8: 'module-card-pink',
  9: 'module-card-teal',
  11: 'module-card-fuchsia',
  12: 'module-card-orange',
  13: 'module-card-slate',
  1: 'module-card-violet',
  2: 'module-card-cyan',
  3: 'module-card-emerald',
  4: 'module-card-rose',
  5: 'module-card-amber',
  6: 'module-card-indigo',
};

const iconBgClass: Record<number, string> = {
  7: 'bg-sky-100 border-sky-200',
  10: 'bg-lime-100 border-lime-200',
  8: 'bg-pink-100 border-pink-200',
  9: 'bg-teal-100 border-teal-200',
  11: 'bg-fuchsia-100 border-fuchsia-200',
  12: 'bg-orange-100 border-orange-200',
  13: 'bg-slate-100 border-slate-200',
  1: 'bg-violet-100 border-violet-200',
  2: 'bg-cyan-100 border-cyan-200',
  3: 'bg-emerald-100 border-emerald-200',
  4: 'bg-rose-100 border-rose-200',
  5: 'bg-amber-100 border-amber-200',
  6: 'bg-indigo-100 border-indigo-200',
};

const accentTextClass: Record<number, string> = {
  7: 'text-sky-600',
  10: 'text-lime-600',
  8: 'text-pink-600',
  9: 'text-teal-600',
  11: 'text-fuchsia-600',
  12: 'text-orange-600',
  13: 'text-slate-600',
  1: 'text-violet-600',
  2: 'text-cyan-600',
  3: 'text-emerald-600',
  4: 'text-rose-600',
  5: 'text-amber-600',
  6: 'text-indigo-600',
};

export function ModuleCard({ module, isCompleted, highScore, isLocked = false, isStartHere = false, onClick, index }: ModuleCardProps) {
  const [guideOpen, setGuideOpen] = useState(false);
  const diff = difficultyConfig[module.difficulty] ?? difficultyConfig['Medel'];
  const colorClass = cardColorClass[module.id] ?? 'module-card-indigo';
  const iconBg = iconBgClass[module.id] ?? 'bg-indigo-100 border-indigo-200';
  const accentText = accentTextClass[module.id] ?? 'text-indigo-600';

  function handleActivate() {
    if (!isLocked) onClick();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: 'easeOut' }}
    >
      <div
        role="button"
        tabIndex={isLocked ? -1 : 0}
        onClick={handleActivate}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleActivate();
          }
        }}
        aria-disabled={isLocked}
        className={`w-full text-left rounded-[20px] border-[3px] bg-white transition-all duration-200 group ${
          isLocked
            ? 'opacity-50 cursor-not-allowed border-gray-200 shadow-none'
            : `${colorClass} clay-card cursor-pointer`
        }`}
      >
        <div className="p-5">
          {/* Top row */}
          <div className="flex items-start justify-between mb-4">
            <div className={`w-14 h-14 rounded-2xl ${iconBg} border-2 flex items-center justify-center text-3xl shadow-sm`}>
              {module.icon}
            </div>
            <div className="flex flex-col items-end gap-2">
              {isCompleted && (
                <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">Klar!</span>
                </div>
              )}
              {isStartHere && !isCompleted && !isLocked && (
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex items-center gap-1 text-white bg-emerald-500 border-2 border-emerald-600 rounded-full px-2.5 py-0.5 shadow-sm"
                >
                  <span className="text-xs font-extrabold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Börja här!</span>
                </motion.div>
              )}
              {isLocked && (
                <div className="flex items-center gap-1 text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
              )}
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border-2 ${diff.className}`}>
                {diff.label}
              </span>
            </div>
          </div>

          {/* Module number + grade range + lesson guide */}
          <div className="flex items-center gap-2 mb-0.5">
            <div className={`text-xs font-extrabold ${accentText} tracking-wide`} style={{ fontFamily: "'Baloo 2', sans-serif" }}>
              MODUL {module.displayNumber}
            </div>
            {module.gradeRange && (
              <span className="text-[10px] font-bold text-gray-400 bg-gray-100 border border-gray-200 rounded-full px-2 py-0.5">
                {module.gradeRange}
              </span>
            )}
            <button
              onClick={e => {
                e.stopPropagation();
                setGuideOpen(true);
              }}
              title="Lektionsguide för lärare"
              aria-label="Öppna lektionsguide"
              className="ml-auto w-7 h-7 rounded-xl bg-cyan-50 border-2 border-cyan-200 hover:bg-cyan-100 flex items-center justify-center transition-colors cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5 text-cyan-600" />
            </button>
          </div>

          {/* Title */}
          <h3 className="font-extrabold text-base text-gray-800 mb-0.5 leading-tight" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            {module.title}
          </h3>
          <div className="text-xs font-semibold text-gray-500 mb-2">{module.subtitle}</div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed mb-4 font-medium">
            {module.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t-2 border-dashed border-gray-100">
            <div className="flex items-center gap-1 text-amber-600 bg-amber-50 rounded-full px-2.5 py-1 border border-amber-200">
              <Zap className="w-3 h-3" />
              <span className="text-xs font-bold">+{module.xpReward} XP</span>
            </div>
            {highScore !== undefined && highScore > 0 && (
              <div className="text-xs text-gray-400 font-semibold">
                Bäst: <span className="text-gray-700 font-bold">{highScore}%</span>
              </div>
            )}
            {!isLocked && !isCompleted && (
              <span className={`text-xs font-extrabold ${accentText} group-hover:underline`} style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                Starta →
              </span>
            )}
            {isCompleted && (
              <span className="text-xs font-extrabold text-emerald-600" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                Igen →
              </span>
            )}
          </div>
        </div>
      </div>

      <LessonGuideModal
        moduleId={module.id}
        moduleTitle={module.title}
        open={guideOpen}
        onClose={() => setGuideOpen(false)}
      />
    </motion.div>
  );
}
