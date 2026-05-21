import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { View } from '@/types';
import { useGameStore } from '@/lib/gameStore';
import { Header } from '@/components/Header';
import { HomeView } from '@/views/HomeView';
import Module1View from '@/views/Module1View';
import Module2View from '@/views/Module2View';
import Module3View from '@/views/Module3View';
import { Module4View } from '@/views/Module4View';
import { Module5View } from '@/views/Module5View';
import { Module6View } from '@/views/Module6View';
import { StatsView } from '@/views/StatsView';

const pageVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const pageTransition = {
  duration: 0.25,
  ease: 'easeInOut',
};

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const { state, addXP, completeModule, resetProgress } = useGameStore();

  function handleNavigate(view: View) {
    setCurrentView(view);
  }

  function handleModuleComplete(moduleId: number) {
    return (score: number, xpEarned: number, badgeName?: string) => {
      addXP(xpEarned);
      completeModule(moduleId, score, badgeName);
      setCurrentView('home');
    };
  }

  function handleExit() {
    setCurrentView('home');
  }

  function renderView() {
    switch (currentView) {
      case 'home':
        return (
          <motion.div key="home" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
            <HomeView gameState={state} onNavigate={handleNavigate} />
          </motion.div>
        );

      case 'module1':
        return (
          <motion.div key="module1" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
            <Module1View onComplete={handleModuleComplete(1)} onExit={handleExit} />
          </motion.div>
        );

      case 'module2':
        return (
          <motion.div key="module2" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
            <Module2View onComplete={handleModuleComplete(2)} onExit={handleExit} />
          </motion.div>
        );

      case 'module3':
        return (
          <motion.div key="module3" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
            <Module3View onComplete={handleModuleComplete(3)} onExit={handleExit} />
          </motion.div>
        );

      case 'module4':
        return (
          <motion.div key="module4" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
            <Module4View onComplete={handleModuleComplete(4)} onExit={handleExit} />
          </motion.div>
        );

      case 'module5':
        return (
          <motion.div key="module5" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
            <Module5View onComplete={handleModuleComplete(5)} onExit={handleExit} />
          </motion.div>
        );

      case 'module6':
        return (
          <motion.div key="module6" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
            <Module6View onComplete={handleModuleComplete(6)} onExit={handleExit} />
          </motion.div>
        );

      case 'stats':
        return (
          <motion.div key="stats" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
            <StatsView gameState={state} onNavigate={handleNavigate} onReset={resetProgress} />
          </motion.div>
        );

      default:
        return null;
    }
  }

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <motion.div
          className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-3xl"
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0],
            scale: [1, 1.05, 0.97, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[10%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-accent/5 blur-3xl"
          animate={{
            x: [0, -25, 15, 0],
            y: [0, 20, -15, 0],
            scale: [1, 0.97, 1.04, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        />
        <motion.div
          className="absolute top-[40%] left-[40%] w-[25vw] h-[25vw] rounded-full bg-xp/3 blur-3xl"
          animate={{
            x: [0, 15, -10, 0],
            y: [0, -30, 20, 0],
          }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
        />
      </div>

      {/* Header */}
      <Header gameState={state} currentView={currentView} onNavigate={handleNavigate} />

      {/* Main content */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {renderView()}
        </AnimatePresence>
      </main>
    </div>
  );
}
