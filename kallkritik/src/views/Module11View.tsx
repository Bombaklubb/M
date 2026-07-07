import React from 'react';
import { LearnQuizModule } from '@/components/LearnQuizModule';
import { BUBBLE_STEPS, MODULE11_QUESTIONS } from '@/data/module11Data';

interface ModuleViewProps {
  onComplete: (score: number, xpEarned: number, badgeName?: string) => void;
  onExit: () => void;
}

const STEP_COLORS: Record<string, { bg: string; text: string }> = {
  algoritm: { bg: 'bg-indigo-100 border-indigo-300', text: 'text-indigo-700' },
  bubbla:   { bg: 'bg-fuchsia-100 border-fuchsia-300', text: 'text-fuchsia-700' },
  bryt:     { bg: 'bg-emerald-100 border-emerald-300', text: 'text-emerald-700' },
};

export function Module11View({ onComplete, onExit }: ModuleViewProps) {
  return (
    <LearnQuizModule
      moduleId={11}
      moduleName="Algoritmer & filterbubblor"
      icon="🫧"
      introText={
        <>
          Varför ser ditt flöde ut som det gör? Det bestäms av en{' '}
          <span className="text-fuchsia-600 font-bold">algoritm</span> – och den jobbar inte för dig.
          Lär dig hur den fungerar och hur du bryter dig ur bubblan!
        </>
      }
      learnCta="Lär dig hur det funkar"
      steps={BUBBLE_STEPS}
      stepColors={STEP_COLORS}
      questions={MODULE11_QUESTIONS}
      badgeName="Bubbelbrytaren"
      badgeIcon="🫧"
      badgeThreshold={5}
      xpPerCorrect={15}
      introAnimation="pulse"
      theme={{
        barBg: 'bg-fuchsia-50',
        barBorder: 'border-fuchsia-100',
        barGradient: 'linear-gradient(90deg, #d946ef, #a855f7)',
        hoverClasses: 'hover:border-fuchsia-300 hover:shadow-[0_8px_0_0_rgba(217,70,239,0.3)]',
        dotActive: 'bg-fuchsia-500',
        dotDone: 'bg-fuchsia-300',
        skipText: 'text-fuchsia-600 hover:text-fuchsia-700',
        scenarioBorder: 'border-fuchsia-400',
        eyeColor: 'text-fuchsia-500',
      }}
      onComplete={onComplete}
      onExit={onExit}
    />
  );
}
