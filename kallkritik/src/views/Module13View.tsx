import React from 'react';
import { LearnQuizModule } from '@/components/LearnQuizModule';
import { TROLL_STEPS, MODULE13_QUESTIONS } from '@/data/module13Data';

interface ModuleViewProps {
  onComplete: (score: number, xpEarned: number, badgeName?: string) => void;
  onExit: () => void;
}

const STEP_COLORS: Record<string, { bg: string; text: string }> = {
  bot:       { bg: 'bg-sky-100 border-sky-300', text: 'text-sky-700' },
  troll:     { bg: 'bg-rose-100 border-rose-300', text: 'text-rose-700' },
  folkstorm: { bg: 'bg-amber-100 border-amber-300', text: 'text-amber-700' },
};

export function Module13View({ onComplete, onExit }: ModuleViewProps) {
  return (
    <LearnQuizModule
      moduleId={13}
      moduleName="Botar & troll"
      icon="👾"
      introText={
        <>
          Alla konton på nätet är inte människor. Bakom många döljer sig{' '}
          <span className="text-slate-600 font-bold">botar, troll och betalda kampanjer</span> som
          vill styra vad du tycker. Lär dig avslöja dem!
        </>
      }
      learnCta="Lär dig avslöja dem"
      steps={TROLL_STEPS}
      stepColors={STEP_COLORS}
      questions={MODULE13_QUESTIONS}
      badgeName="Trolljägaren"
      badgeIcon="👾"
      badgeThreshold={5}
      xpPerCorrect={15}
      introAnimation="bounce"
      theme={{
        barBg: 'bg-slate-100',
        barBorder: 'border-slate-200',
        barGradient: 'linear-gradient(90deg, #64748b, #475569)',
        hoverClasses: 'hover:border-slate-300 hover:shadow-[0_8px_0_0_rgba(100,116,139,0.3)]',
        dotActive: 'bg-slate-500',
        dotDone: 'bg-slate-300',
        skipText: 'text-slate-600 hover:text-slate-700',
        scenarioBorder: 'border-slate-400',
        eyeColor: 'text-slate-500',
      }}
      onComplete={onComplete}
      onExit={onExit}
    />
  );
}
