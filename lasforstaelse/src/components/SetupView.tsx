import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTextCountByGrade } from '../services/libraryService';
import { BookLogo } from './BookLogo';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { BorderBeam } from './ui/border-beam';
import { cn } from '@/lib/utils';

interface SetupViewProps {
  onSelectGrade: (grade: number) => void;
  completedByGrade: Record<number, number>;
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
  { grade: 10, label: 'GY' },
];

export const SetupView: React.FC<SetupViewProps> = ({
  onSelectGrade,
  completedByGrade: _completedByGrade,
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
    if (grade <= 3) return 'Lagstadiet (ak 1-3)';
    if (grade <= 6) return 'Mellanstadiet (ak 4-6)';
    if (grade <= 9) return 'Hogstadiet (ak 7-9)';
    return 'Gymnasiet';
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
    if (grade === 10) return 'GY';
    return String(grade);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="flex justify-center mb-4"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <BookLogo size={120} />
          </motion.div>
          <p className="text-xl text-slate-600 dark:text-slate-400">Laddar texter...</p>
        </motion.div>
      </div>
    );
  }

  const colors = getGradeColor(selectedGrade);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center">
          <BookLogo size={220} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-white/20 shadow-2xl overflow-hidden">
          <BorderBeam size={250} duration={12} colorFrom="#6366f1" colorTo="#22c55e" />

          <CardContent className="p-6 md:p-8">
            {/* Title */}
            <motion.h2
              className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Borja ditt lasaventyr
            </motion.h2>

            {/* Grade display */}
            <motion.div
              className="text-center mb-8"
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
                    "inline-flex items-center justify-center w-28 h-28 rounded-3xl text-5xl font-bold text-white mb-3 shadow-xl",
                    `bg-gradient-to-br ${colors.gradient}`
                  )}
                >
                  {getGradeDisplayText(selectedGrade)}
                </motion.div>
              </AnimatePresence>
              <motion.div
                className={cn("text-lg font-semibold", colors.text)}
                key={`label-${selectedGrade}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {getGradeLabel(selectedGrade)}
              </motion.div>
            </motion.div>

            {/* Grade selector buttons */}
            <motion.div
              className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-8"
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
                      "relative py-3 md:py-4 rounded-xl font-bold text-sm md:text-base transition-all duration-200",
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
                  Inga texter annu - kommer snart!
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
                size="xl"
                className="w-full text-xl"
              >
                Borja lasa!
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
