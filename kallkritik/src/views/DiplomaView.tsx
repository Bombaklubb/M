import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Printer, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GameState, View } from '@/types';
import { MODULES } from '@/data/modules';
import { getLevelTitle } from '@/lib/utils';

interface DiplomaViewProps {
  gameState: GameState;
  onNavigate: (view: View) => void;
}

export function DiplomaView({ gameState, onNavigate }: DiplomaViewProps) {
  const [name, setName] = useState('');
  const dateStr = new Date().toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-14">
      <div className="print:hidden">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1.5 text-sm font-bold text-indigo-500 hover:text-indigo-700 transition-colors cursor-pointer mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Tillbaka
        </button>

        <div className="clay-card p-4 mb-5">
          <label htmlFor="diploma-name" className="block text-xs font-extrabold text-gray-400 uppercase tracking-wide mb-2">
            Skriv ditt namn på diplomet
          </label>
          <input
            id="diploma-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ditt namn"
            className="w-full rounded-xl border-2 border-indigo-100 bg-indigo-50/50 px-3 py-2.5 text-sm font-semibold text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-indigo-300"
          />
        </div>
      </div>

      {/* Diploma */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="diploma-print bg-white border-[6px] border-double border-indigo-300 rounded-[24px] p-8 text-center shadow-[0_8px_0_0_rgba(99,102,241,0.25)]"
      >
        <div className="text-5xl mb-3">🔎</div>
        <div className="text-xs font-extrabold text-indigo-400 uppercase tracking-[0.25em] mb-1">Källkritikjakten</div>
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-5" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
          DIPLOM
        </h1>

        <p className="text-sm text-gray-500 font-semibold mb-2">tilldelas</p>
        <div className="text-2xl font-extrabold text-gray-800 border-b-2 border-dashed border-indigo-200 inline-block px-8 pb-1 mb-5 min-w-[220px]" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
          {name || ' '}
        </div>

        <p className="text-sm text-gray-600 font-semibold leading-relaxed mb-5 max-w-sm mx-auto">
          som har genomfört alla {MODULES.length} moduler i Källkritikjakten och visat
          färdigheter i källkritik, AI-granskning och sidledes läsning.
        </p>

        <div className="flex items-center justify-center gap-6 mb-5">
          <div className="text-center">
            <div className="text-xl font-extrabold text-amber-600" style={{ fontFamily: "'Baloo 2', sans-serif" }}>{gameState.xp}</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">XP</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-extrabold text-indigo-600" style={{ fontFamily: "'Baloo 2', sans-serif" }}>{gameState.badges.length}</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Märken</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-extrabold text-emerald-600" style={{ fontFamily: "'Baloo 2', sans-serif" }}>{getLevelTitle(gameState.level)}</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Nivå {gameState.level}</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-indigo-400 mb-2">
          <Trophy className="w-4 h-4" />
          <span className="text-xs font-extrabold uppercase tracking-wide">Certifierad källkritiker</span>
          <Trophy className="w-4 h-4" />
        </div>
        <p className="text-xs text-gray-400 font-semibold">{dateStr}</p>
      </motion.div>

      <div className="print:hidden mt-5">
        <Button variant="primary" size="lg" fullWidth onClick={() => window.print()} className="gap-2">
          <Printer className="w-5 h-5" /> Skriv ut diplomet
        </Button>
      </div>
    </div>
  );
}
