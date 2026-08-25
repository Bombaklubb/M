import React, { Suspense, lazy } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import AreaSelect from './components/AreaSelect';
import { SPACE } from './utils/theme';

// Alla vyer utom startsidan laddas först när de behövs. Startsidan klarar sig
// med områdesmetadatan, så kapiteldatan hamnar i de här paketen i stället för
// i startpaketet – den hämtas först när eleven valt ett område.
const ChapterMap      = lazy(() => import('./components/ChapterMap'));
const ChapterStudy    = lazy(() => import('./components/ChapterStudy'));
const ChapterExercise = lazy(() => import('./components/ChapterExercise'));
const ChapterResult   = lazy(() => import('./components/ChapterResult'));
const ExitTicket      = lazy(() => import('./components/ExitTicket'));
const Achievements    = lazy(() => import('./components/Achievements'));
const Projects        = lazy(() => import('./components/Projects'));

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center">
        <div>
          <div className="text-6xl mb-4">😵</div>
          <h1 className="text-2xl font-black mb-2 font-heading">Oj! Något gick fel</h1>
          {/* Felskärmen ligger mot rymden – grå text försvinner där. */}
          <p className="mb-6" style={{ color: SPACE.onDarkMuted }}>Tryck nedan för att rensa och ladda om.</p>
          <button
            className="btn-primary-clay px-8 py-3 text-lg"
            onClick={() => { localStorage.removeItem('tj_progress'); window.location.reload(); }}
          >Ladda om</button>
        </div>
      </div>
    );
    return this.props.children;
  }
}

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm font-black" style={{ color: SPACE.onDarkMuted }}>Laddar …</p>
    </div>
  );
}

function AppInner() {
  const { currentView } = useApp();
  switch (currentView) {
    case 'area-select':      return <AreaSelect />;
    case 'chapter-map':      return <ChapterMap />;
    case 'chapter-study':    return <ChapterStudy />;
    case 'chapter-exercise': return <ChapterExercise />;
    case 'chapter-result':   return <ChapterResult />;
    case 'exit-ticket':      return <ExitTicket />;
    case 'achievements':     return <Achievements />;
    case 'projects':         return <Projects />;
    default:                 return <AreaSelect />;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Suspense fallback={<Loading />}>
          <AppInner />
        </Suspense>
      </AppProvider>
    </ErrorBoundary>
  );
}
