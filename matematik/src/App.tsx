import React, { useEffect } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';

import Login from './components/Login';
import WorldSelect from './components/WorldSelect';
import WorldMap from './components/WorldMap';
import TopicInstruction from './components/TopicInstruction';
import TopicExercise from './components/TopicExercise';
import TopicResult from './components/TopicResult';
import StudentResults from './components/StudentResults';
import Achievements from './components/Achievements';
import TeacherLogin from './components/TeacherLogin';
import TeacherView from './components/TeacherView';
import ErrorBankView from './components/ErrorBankView';
import QuestView from './components/QuestView';
import CollectionView from './components/CollectionView';
import MinSidaView from './components/MinSidaView';
import SluttestView from './components/SluttestView';
import KistorView from './components/KistorView';
import GamesHub from './components/games/GamesHub';
import TimeAttackGame from './components/games/TimeAttackGame';
import CollectCoinsGame from './components/games/CollectCoinsGame';
import MemoryGame from './components/games/MemoryGame';
import HangmanGame from './components/games/HangmanGame';

// ─── Error Boundary ─────────────────────────────────────────────────────────
// Catches any uncaught error in the React tree and shows a recovery screen
// instead of a blank white page.

interface EBState { hasError: boolean; error?: Error }

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, EBState> {
  state: EBState = { hasError: false };

  static getDerivedStateFromError(error: Error): EBState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Mattejakten kraschade:', error, info.componentStack);
  }

  handleRetry = () => this.setState({ hasError: false, error: undefined });

  handleReset = () => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('math_') || key?.startsWith('drill_pb_') || key === 'theme-size') {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-6">
        <div className="max-w-sm w-full bg-white rounded-3xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">😵</div>
          <h1 className="text-2xl font-black text-gray-800 mb-2">Oj! Något gick fel</h1>
          <p className="text-gray-500 mb-6 text-sm leading-relaxed">
            Appen kraschade. Prova att ladda om först.
            Om det inte hjälper kan du rensa sparad data — du behöver logga in igen.
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={this.handleRetry}
              className="w-full py-3 bg-blue-500 text-white font-bold rounded-2xl hover:bg-blue-600 transition-colors">
              Försök igen
            </button>
            <button onClick={this.handleReset}
              className="w-full py-3 bg-red-100 text-red-700 font-bold rounded-2xl hover:bg-red-200 transition-colors">
              Rensa data och börja om
            </button>
          </div>
          {this.state.error && (
            <p className="text-xs text-gray-400 mt-5 break-all">
              {this.state.error.message}
            </p>
          )}
        </div>
      </div>
    );
  }
}

// ─── App Inner ───────────────────────────────────────────────────────────────

function AppInner() {
  const { currentView, selectedTopic, setView } = useApp();

  // Ctrl+Shift+P öppnar lärarvy
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setView('teacher-login');
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setView]);

  return (
    <>
      {(() => {
        switch (currentView) {
          case 'login':             return <Login />;
          case 'dashboard':         return <WorldSelect />;
          case 'world-dino':        return <WorldMap worldId="dino" />;
          case 'world-fantasy':     return <WorldMap worldId="fantasy" />;
          case 'world-scifi':       return <WorldMap worldId="scifi" />;
          case 'world-gym':         return <WorldMap worldId="gym" />;
          case 'topic-instruction': return selectedTopic ? <TopicInstruction topic={selectedTopic} /> : <WorldSelect />;
          case 'topic-exercise':    return selectedTopic ? <TopicExercise topic={selectedTopic} /> : <WorldSelect />;
          case 'topic-result':      return selectedTopic ? <TopicResult topic={selectedTopic} /> : <WorldSelect />;
          case 'error-bank':        return <ErrorBankView />;
          case 'quest':             return <QuestView />;
          case 'collection':        return <CollectionView />;
          case 'my-page':          return <MinSidaView />;
          case 'my-results':        return <StudentResults />;
          case 'achievements':      return <Achievements />;
          case 'teacher-login':     return <TeacherLogin />;
          case 'teacher':           return <TeacherView />;
          case 'sluttest':          return <SluttestView />;
          case 'kistor':            return <KistorView />;
          case 'games':             return <GamesHub />;
          case 'game-time-attack':  return <TimeAttackGame />;
          case 'game-collect-coins': return <CollectCoinsGame />;
          case 'game-memory':       return <MemoryGame />;
          case 'game-hangman':      return <HangmanGame />;
          default:                  return <Login />;
        }
      })()}

      {/* Footer – alltid synlig */}
      <div className="fixed bottom-2 right-3 z-40 pointer-events-none select-none">
        <span className="text-white/50 text-xs font-semibold"
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
          Mattejakten av Martin Akdogan
        </span>
      </div>
      <div className="fixed bottom-2 left-3 z-40 pointer-events-none select-none">
        <span className="text-white/50 text-xs font-semibold"
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
          Kontakt – martin.akdogan@enkoping.se
        </span>
      </div>
    </>
  );
}

// ─── Root ────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppInner />
      </AppProvider>
    </ErrorBoundary>
  );
}
 
