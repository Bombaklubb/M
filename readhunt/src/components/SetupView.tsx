import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTextCountByGrade } from '../services/libraryService';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { BorderBeam } from './ui/border-beam';
import { cn } from '@/lib/utils';
import { CompletedText } from '../types';

interface SetupViewProps {
  onSelectGrade: (grade: number) => void;
  completedByGrade: Record<number, number>;
  lastCompletedText?: CompletedText | null;
}

const GRADE_LABELS = [
  { grade: 1, label: '1' },
  { grade: 2, label: '2' },
  { grade: 3, label: '3' },
  { grade: 4, label: '4' },
  { grade: 5, label: '5' },
  { grade: 6, label: '6' },
  { grade: 7, label: '7' },
  { grade: 8, label: '8' },
  { grade: 9, label: '9' },
  { grade: 10, label: '10' },
];

export const SetupView: React.FC<SetupViewProps> = ({
  onSelectGrade,
  completedByGrade: _completedByGrade,
  lastCompletedText,
}) => {
  const [textCounts, setTextCounts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState<number>(4);

  useEffect(() => {
    getTextCountByGrade().then((counts) => {
      setTextCounts(counts);
      setLoading(false);
    });
  }, []);

  const handleStart = () => {
    onSelectGrade(selectedGrade);
  };

  const getGradeLabel = (grade: number): string => {
    return `Level ${grade}`;
  };

  const getGradeColor = (grade: number): { bg: string; text: string; gradient: string } => {
    if (grade <= 3) return {
      bg: 'bg-emerald-500',
      text: 'text-emerald-600 dark:text-emerald-400',
      gradient: 'from-emerald-500 to-teal-500'
    };
    if (grade <= 6) return {
      bg: 'bg-blue-500',
      text: 'text-blue-600 dark:text-blue-400',
      gradient: 'from-blue-500 to-cyan-500'
    };
    if (grade <= 9) return {
      bg: 'bg-violet-500',
      text: 'text-violet-600 dark:text-violet-400',
      gradient: 'from-violet-500 to-purple-500'
    };
    return {
      bg: 'bg-amber-500',
      text: 'text-amber-600 dark:text-amber-400',
      gradient: 'from-amber-500 to-orange-500'
    };
  };

  const getGradeDisplayText = (grade: number): string => {
    return String(grade);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-xl text-slate-600 dark:text-slate-400">Loading texts...</p>
      </div>
    );
  }

  const colors = getGradeColor(selectedGrade);

  return (
    <div className="max-w-2xl mx-auto px-4 pt-10 pb-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="relative bg-white/92 dark:bg-slate-900/92 backdrop-blur-xl border-white/30 shadow-2xl overflow-hidden">
          <BorderBeam size={200} duration={12} colorFrom="#6366f1" colorTo="#22c55e" />

          <CardContent className="p-4 md:p-5">
            {/* Title */}
            <motion.h2
              className="text-lg md:text-xl font-bold text-slate-800 dark:text-white mb-3 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Start your reading adventure
            </motion.h2>

            {/* Continue where you left off */}
            {lastCompletedText && (
              <motion.div
                className="mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <button
                  onClick={() => onSelectGrade(lastCompletedText.grade)}
                  className="w-full p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border-2 border-emerald-200 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-base shadow-md">
                      ▶️
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        Continue where you left off
                      </div>
                      <div className="text-slate-700 dark:text-slate-200 font-semibold text-sm truncate">
                        Level {lastCompletedText.grade} • {lastCompletedText.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Last time: {lastCompletedText.score}/{lastCompletedText.totalQuestions} correct
                      </div>
                    </div>
                    <div className="text-emerald-500 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                      →
                    </div>
                  </div>
                </button>
              </motion.div>
            )}

            {/* Grade display */}
            <motion.div
              className="text-center mb-3"
              layout
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedGrade}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className={cn(
                    "inline-flex items-center justify-center w-14 h-14 rounded-2xl text-3xl font-bold text-white mb-1 shadow-lg",
                    `bg-gradient-to-br ${colors.gradient}`
                  )}
                >
                  {getGradeDisplayText(selectedGrade)}
                </motion.div>
              </AnimatePresence>
              <motion.div
                className={cn("text-sm font-semibold", colors.text)}
                key={`label-${selectedGrade}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {getGradeLabel(selectedGrade)}
              </motion.div>
            </motion.div>

            {/* Grade selector buttons */}
            <motion.div
              className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {GRADE_LABELS.map((item, index) => {
                const itemColors = getGradeColor(item.grade);
                return (
                  <motion.button
                    key={item.grade}
                    onClick={() => setSelectedGrade(item.grade)}
                    className={cn(
                      "relative py-2 md:py-3 rounded-xl font-bold text-sm transition-all duration-200",
                      item.grade === selectedGrade
                        ? `bg-gradient-to-br ${itemColors.gradient} text-white shadow-lg`
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    {item.label}
                    {item.grade === selectedGrade && (
                      <motion.div
                        className="absolute inset-0 rounded-xl ring-2 ring-white/50"
                        layoutId="selectedGrade"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>

            {/* No-texts fallback */}
            <AnimatePresence>
              {textCounts[selectedGrade] !== undefined && textCounts[selectedGrade] === 0 && (
                <motion.div
                  className="text-center mb-4 text-sm text-slate-500 dark:text-slate-400"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {selectedGrade === 10 ? 'Texts coming soon' : 'No texts yet - coming soon!'}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Start button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={handleStart}
                disabled={!textCounts[selectedGrade] || textCounts[selectedGrade] === 0}
                variant="success"
                size="lg"
                className="w-full text-lg"
              >
                Start reading!
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
