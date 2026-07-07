import React from 'react';
import { LearnQuizModule } from '@/components/LearnQuizModule';
import { SCAM_STEPS, MODULE12_QUESTIONS } from '@/data/module12Data';

interface ModuleViewProps {
  onComplete: (score: number, xpEarned: number, badgeName?: string) => void;
  onExit: () => void;
}

const STEP_COLORS: Record<string, { bg: string; text: string }> = {
  lockbete:  { bg: 'bg-amber-100 border-amber-300', text: 'text-amber-700' },
  bradska:   { bg: 'bg-rose-100 border-rose-300', text: 'text-rose-700' },
  avsandare: { bg: 'bg-sky-100 border-sky-300', text: 'text-sky-700' },
};

export function Module12View({ onComplete, onExit }: ModuleViewProps) {
  return (
    <LearnQuizModule
      moduleId={12}
      moduleName="Nätfiske & bluffar"
      icon="🎣"
      introText={
        <>
          Gratis Robux? En vinst du aldrig tävlat om? Bedragare fiskar efter dina{' '}
          <span className="text-orange-600 font-bold">lösenord och uppgifter</span> varje dag.
          Lär dig känna igen kroken innan du nappar!
        </>
      }
      learnCta="Lär dig tecknen"
      steps={SCAM_STEPS}
      stepColors={STEP_COLORS}
      questions={MODULE12_QUESTIONS}
      badgeName="Bluffdetektiven"
      badgeIcon="🎣"
      badgeThreshold={5}
      xpPerCorrect={15}
      introAnimation="rotate"
      theme={{
        barBg: 'bg-orange-50',
        barBorder: 'border-orange-100',
        barGradient: 'linear-gradient(90deg, #f97316, #f59e0b)',
        hoverClasses: 'hover:border-orange-300 hover:shadow-[0_8px_0_0_rgba(249,115,22,0.3)]',
        dotActive: 'bg-orange-500',
        dotDone: 'bg-orange-300',
        skipText: 'text-orange-600 hover:text-orange-700',
        scenarioBorder: 'border-orange-400',
        eyeColor: 'text-orange-500',
      }}
      onComplete={onComplete}
      onExit={onExit}
    />
  );
}
