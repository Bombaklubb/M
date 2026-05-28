import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { UseSpeech } from '@/hooks/useSpeech';
import { speechSupported } from '@/hooks/useSpeech';

interface TextToSpeechProps {
  speech: UseSpeech;
}

/**
 * Read-aloud (talsyntes) controls. Presentational only — driven by the
 * shared useSpeech hook so the reading view can also highlight spoken words.
 */
export const TextToSpeech: React.FC<TextToSpeechProps> = ({ speech }) => {
  if (!speechSupported) return null;

  const { speaking, paused, toggle, stop, cycleRate, rateLabel } = speech;

  return (
    <div className="flex items-center gap-1.5">
      <motion.button
        onClick={toggle}
        className={cn(
          'px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5',
          speaking && !paused
            ? 'bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-md'
            : 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-md'
        )}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        title={speaking ? (paused ? 'Resume reading' : 'Pause reading') : 'Listen to the text'}
        aria-label={speaking ? (paused ? 'Resume reading' : 'Pause reading') : 'Listen to the text'}
      >
        <span className="text-sm leading-none">
          {speaking ? (paused ? '▶️' : '⏸️') : '🔊'}
        </span>
        <span className="hidden sm:inline">
          {speaking ? (paused ? 'Resume' : 'Pause') : 'Listen'}
        </span>
      </motion.button>

      {speaking && (
        <motion.button
          onClick={stop}
          className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          title="Stop reading"
          aria-label="Stop reading"
        >
          ⏹️
        </motion.button>
      )}

      <button
        onClick={cycleRate}
        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
        title="Change reading speed"
        aria-label={`Reading speed: ${rateLabel}. Click to change.`}
      >
        {rateLabel}
      </button>
    </div>
  );
};
