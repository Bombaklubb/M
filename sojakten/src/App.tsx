import React from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import GradeSelect from './components/GradeSelect';
import GradeComingSoon from './components/GradeComingSoon';
import SubjectSelect from './components/SubjectSelect';
import ChapterMap from './components/ChapterMap';
import ChapterStudy from './components/ChapterStudy';
import ChapterExercise from './components/ChapterExercise';
import ChapterResult from './components/ChapterResult';
import ExitTicket from './components/ExitTicket';
import Achievements from './components/Achievements';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center">
        <div>
          <div className="text-6xl mb-4">😵</div>
          <h1 className="text-2xl font-black mb-2 font-heading">Oj! Något gick fel</h1>
          <p className="text-gray-500 mb-6">Tryck nedan för att rensa och ladda om.</p>
          <button
            className="btn-primary-clay px-8 py-3 text-lg"
            onClick={() => { localStorage.removeItem('so_progress'); window.location.reload(); }}
          >Ladda om</button>
        </div>
      </div>
    );
    return this.props.children;
  }
}

function AppInner() {
  const { currentView } = useApp();
  switch (currentView) {
    case 'grade-select':     return <GradeSelect />;
    case 'grade-coming-soon': return <GradeComingSoon />;
    case 'subject-select':   return <SubjectSelect />;
    case 'chapter-map':      return <ChapterMap />;
    case 'chapter-study':    return <ChapterStudy />;
    case 'chapter-exercise': return <ChapterExercise />;
    case 'chapter-result':   return <ChapterResult />;
    case 'exit-ticket':      return <ExitTicket />;
    case 'achievements':     return <Achievements />;
    default:                 return <GradeSelect />;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppInner />
      </AppProvider>
    </ErrorBoundary>
  );
}
