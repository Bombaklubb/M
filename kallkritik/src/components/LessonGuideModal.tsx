import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap, Users, MessageCircle, Backpack, PlayCircle } from 'lucide-react';
import { LESSON_GUIDES } from '@/data/lessonGuides';

interface LessonGuideModalProps {
  moduleId: number;
  moduleTitle: string;
  open: boolean;
  onClose: () => void;
}

export function LessonGuideModal({ moduleId, moduleTitle, open, onClose }: LessonGuideModalProps) {
  const guide = LESSON_GUIDES[moduleId];
  if (!guide) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-indigo-950/40 backdrop-blur-sm p-0 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            onClick={e => e.stopPropagation()}
            className="w-full sm:max-w-lg max-h-[88vh] overflow-y-auto bg-white border-[3px] border-indigo-200 rounded-t-[24px] sm:rounded-[24px] shadow-[0_8px_0_0_rgba(99,102,241,0.25)]"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b-2 border-indigo-100 px-5 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-cyan-100 border-2 border-cyan-200 flex items-center justify-center shrink-0">
                <GraduationCap className="w-4 h-4 text-cyan-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-gray-800 text-sm leading-tight" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                  Lektionsguide
                </div>
                <div className="text-xs font-semibold text-gray-400 truncate">{moduleTitle}</div>
              </div>
              <button
                onClick={onClose}
                aria-label="Stäng"
                className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              {/* Före */}
              <section>
                <h3 className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-500 uppercase tracking-wide mb-2">
                  <MessageCircle className="w-3.5 h-3.5" /> Före – väck tankarna (5 min)
                </h3>
                <ul className="space-y-1.5">
                  {guide.before.map((q, i) => (
                    <li key={i} className="bg-indigo-50 border-2 border-indigo-100 rounded-xl px-3 py-2 text-xs font-semibold text-indigo-800 leading-relaxed">
                      {q}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Under */}
              <section>
                <h3 className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 uppercase tracking-wide mb-2">
                  <PlayCircle className="w-3.5 h-3.5" /> Under – spela (10–15 min)
                </h3>
                <p className="text-xs font-semibold text-gray-600 leading-relaxed mb-2">{guide.during}</p>
                <div className="bg-emerald-50 border-2 border-emerald-100 rounded-xl px-3 py-2">
                  <div className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wide mb-0.5 flex items-center gap-1">
                    <Users className="w-3 h-3" /> Parläge – en enhet, två elever
                  </div>
                  <p className="text-xs font-semibold text-emerald-800 leading-relaxed">{guide.pairMode}</p>
                </div>
              </section>

              {/* Efter */}
              <section>
                <h3 className="flex items-center gap-1.5 text-xs font-extrabold text-violet-600 uppercase tracking-wide mb-2">
                  <MessageCircle className="w-3.5 h-3.5" /> Efter – diskutera (10–15 min)
                </h3>
                <ul className="space-y-1.5 mb-2">
                  {guide.after.map((q, i) => (
                    <li key={i} className="bg-violet-50 border-2 border-violet-100 rounded-xl px-3 py-2 text-xs font-semibold text-violet-800 leading-relaxed">
                      {q}
                    </li>
                  ))}
                </ul>
                <div className="bg-gray-50 border-2 border-gray-100 rounded-xl px-3 py-2">
                  <div className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wide mb-0.5">Gemensam övning</div>
                  <p className="text-xs font-semibold text-gray-600 leading-relaxed">{guide.groupActivity}</p>
                </div>
              </section>

              {/* Uppdrag */}
              <section className="pb-2">
                <h3 className="flex items-center gap-1.5 text-xs font-extrabold text-amber-600 uppercase tracking-wide mb-2">
                  <Backpack className="w-3.5 h-3.5" /> Utanför appen – Veckans granskning
                </h3>
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl px-3 py-2.5">
                  <div className="text-xs font-extrabold text-amber-700 mb-1" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                    {guide.mission.title}
                  </div>
                  <p className="text-xs font-semibold text-amber-800 leading-relaxed mb-1.5">{guide.mission.task}</p>
                  <p className="text-[11px] font-semibold text-amber-600 leading-relaxed italic">{guide.mission.followUp}</p>
                </div>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
