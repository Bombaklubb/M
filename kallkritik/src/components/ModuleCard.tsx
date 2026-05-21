import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Lock, Zap } from 'lucide-react';
import { ModuleMeta } from '@/types';
import { Badge } from './ui/Badge';

interface ModuleCardProps {
  module: ModuleMeta;
  isCompleted: boolean;
  highScore?: number;
  isLocked?: boolean;
  onClick: () => void;
  index: number;
}

const difficultyColor: Record<string, 'success' | 'warning' | 'danger'> = {
  'Lätt': 'success',
  'Medel': 'warning',
  'Svår': 'danger',
};

export function ModuleCard({ module, isCompleted, highScore, isLocked = false, onClick, index }: ModuleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <button
        onClick={isLocked ? undefined : onClick}
        disabled={isLocked}
        className={`w-full text-left rounded-2xl border transition-all duration-200 group ${
          isLocked
            ? 'border-border bg-card opacity-50 cursor-not-allowed'
            : `border-border bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 active:scale-[0.98] cursor-pointer module-card-hover`
        }`}
      >
        <div className="p-5">
          {/* Top row */}
          <div className="flex items-start justify-between mb-3">
            <div className={`text-4xl w-14 h-14 rounded-2xl bg-gradient-to-br ${module.gradient} flex items-center justify-center shadow-lg`}>
              {module.icon}
            </div>
            <div className="flex flex-col items-end gap-1.5">
              {isCompleted && (
                <div className="flex items-center gap-1 text-success">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs font-semibold">Klar</span>
                </div>
              )}
              {isLocked && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  <span className="text-xs">Låst</span>
                </div>
              )}
              <Badge variant={difficultyColor[module.difficulty]}>{module.difficulty}</Badge>
            </div>
          </div>

          {/* Module number */}
          <div className="text-xs font-semibold text-muted-foreground mb-1">MODUL {module.id}</div>

          {/* Title */}
          <h3 className="font-bold text-base text-foreground mb-0.5 group-hover:text-primary transition-colors">
            {module.title}
          </h3>
          <div className="text-xs text-muted-foreground mb-2">{module.subtitle}</div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            {module.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-1 text-xp">
              <Zap className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">+{module.xpReward} XP/svar</span>
            </div>
            {highScore !== undefined && highScore > 0 && (
              <div className="text-xs text-muted-foreground">
                Bäst: <span className="text-foreground font-semibold">{highScore}%</span>
              </div>
            )}
            {!isLocked && !isCompleted && (
              <span className="text-xs font-semibold text-primary group-hover:underline">
                Starta →
              </span>
            )}
            {isCompleted && (
              <span className="text-xs font-semibold text-success">
                Spela igen →
              </span>
            )}
          </div>
        </div>
      </button>
    </motion.div>
  );
}
