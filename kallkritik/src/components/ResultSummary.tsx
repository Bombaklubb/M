import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Trophy, RotateCcw, Home, Star } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface ResultSummaryProps {
  moduleName: string;
  score: number;
  totalQuestions: number;
  xpEarned: number;
  newBadge?: { name: string; icon: string } | null;
  onReplay: () => void;
  onHome: () => void;
}

export function ResultSummary({
  moduleName,
  score,
  totalQuestions,
  xpEarned,
  newBadge,
  onReplay,
  onHome,
}: ResultSummaryProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const isGreat = percentage >= 80;
  const isGood = percentage >= 50;

  const getMessage = () => {
    if (percentage === 100) return { text: 'Perfekt! Otroligt bra!', emoji: '🎉' };
    if (percentage >= 80) return { text: 'Imponerande! Riktigt bra jobbat!', emoji: '🌟' };
    if (percentage >= 60) return { text: 'Bra jobbat! Du lär dig snabbt!', emoji: '💪' };
    if (percentage >= 40) return { text: 'Inte illa! Fortsätt öva!', emoji: '📚' };
    return { text: 'Kämpa på! Varje försök gör dig bättre!', emoji: '🔥' };
  };

  const { text, emoji } = getMessage();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-3xl p-8 text-center">
          {/* Emoji */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
            className="text-6xl mb-4"
          >
            {emoji}
          </motion.div>

          <h2 className="text-2xl font-bold text-foreground mb-1">{text}</h2>
          <p className="text-muted-foreground mb-6 text-sm">{moduleName} avklarad</p>

          {/* Score circle */}
          <div className="relative w-28 h-28 mx-auto mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
              <motion.circle
                cx="50" cy="50" r="42" fill="none"
                stroke={isGreat ? 'hsl(var(--success))' : isGood ? 'hsl(var(--xp))' : 'hsl(var(--primary))'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="263.9"
                initial={{ strokeDashoffset: 263.9 }}
                animate={{ strokeDashoffset: 263.9 * (1 - percentage / 100) }}
                transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-foreground">{percentage}%</span>
              <span className="text-xs text-muted-foreground">{score}/{totalQuestions}</span>
            </div>
          </div>

          {/* XP */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 bg-xp/10 rounded-xl px-4 py-2.5 mb-4"
          >
            <Zap className="w-5 h-5 text-xp" />
            <span className="font-bold text-xp text-lg">+{xpEarned} XP intjänat!</span>
          </motion.div>

          {/* Badge */}
          {newBadge && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center justify-center gap-2 bg-primary/10 border border-primary/30 rounded-xl px-4 py-3 mb-4"
            >
              <Trophy className="w-5 h-5 text-primary" />
              <div className="text-left">
                <div className="text-xs text-muted-foreground">Nytt märke upplåst!</div>
                <div className="font-bold text-primary text-sm">{newBadge.icon} {newBadge.name}</div>
              </div>
            </motion.div>
          )}

          {/* Stars */}
          <div className="flex justify-center gap-1 mb-6">
            {[1, 2, 3].map(star => (
              <motion.div
                key={star}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: star <= Math.ceil(percentage / 34) ? 1 : 0.5, rotate: 0 }}
                transition={{ delay: 0.6 + star * 0.1, type: 'spring' }}
              >
                <Star
                  className={`w-7 h-7 ${star <= Math.ceil(percentage / 34) ? 'text-xp fill-xp' : 'text-muted'}`}
                />
              </motion.div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onHome} className="flex-1 gap-2">
              <Home className="w-4 h-4" />
              Hem
            </Button>
            <Button variant="primary" onClick={onReplay} className="flex-1 gap-2">
              <RotateCcw className="w-4 h-4" />
              Spela igen
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
