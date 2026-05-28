import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Lock, Zap } from 'lucide-react';
import { ModuleMeta } from '@/types';

interface ModuleCardProps {
  module: ModuleMeta;
  isCompleted: boolean;
  highScore?: number;
  isLocked?: boolean;
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
  1: 'module-card-violet',
  2: 'module-card-cyan',
  3: 'module-card-emerald',
  4: 'module-card-rose',
  5: 'module-card-amber',
  6: 'module-card-indigo',
};

const iconBgClass: Record<number, string> = {
  7: 'bg-sky-100 border-sky-200',
  1: 'bg-violet-100 border-violet-200',
  2: 'bg-cyan-100 border-cyan-200',
  3: 'bg-emerald-100 border-emerald-200',
  4: 'bg-rose-100 border-rose-200',
  5: 'bg-amber-100 border-amber-200',
  6: 'bg-indigo-100 border-indigo-200',
};

const accentTextClass: Record<number, string> = {
  7: 'text-sky-600',
  1: 'text-violet-600',
  2: 'text-cyan-600',
  3: 'text-emerald-600',
  4: 'text-rose-600',
  5: 'text-amber-600',
  6: 'text-indigo-600',
};

export function ModuleCard({ module, isCompleted, highScore, isLocked = false, onClick, index }: ModuleCardProps) {
  const diff = difficultyConfig[module.difficulty] ?? difficultyConfig['Medel'];
  const colorClass = cardColorClass[module.id] ?? 'module-card-indigo';
  const iconBg = iconBgClass[module.id] ?? 'bg-indigo-100 border-indigo-200';
  const accentText = accentTextClass[module.id] ?? 'text-indigo-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: 'easeOut' }}
    >
      <button
        onClick={isLocked ? undefined : onClick}
        disabled={isLocked}
        className={`w-full text-left rounded-[20px] border-[3px] bg-white transition-all duration-200 group cursor-pointer ${
          isLocked
            ? 'opacity-50 cursor-not-allowed border-gray-200 shadow-none'
            : `${colorClass} clay-card`
        }`}
        style={{ fontFamily: 'inherit' }}
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

          {/* Module number */}
          <div className={`text-xs font-extrabold ${accentText} mb-0.5 tracking-wide`} style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            MODUL {module.id}
          </div>

          {/* Title */}
          <h3 className="font-extrabold text-base text-gray-800 mb-0.5 leading-tight" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            {module.title}
          </h3>
          <div className="text-xs font-semibold text-gray-400 mb-2">{module.subtitle}</div>

          {/* Description */}
          <p className="text-sm text-gray-500 leading-relaxed mb-4 font-medium">
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
      </button>
    </motion.div>
  );
}
