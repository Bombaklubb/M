import React, { useState } from 'react';
import { SetupView } from './components/SetupView';
import { ReadingView } from './components/ReadingView';
import { QuizView } from './components/QuizView';
import { ResultView } from './components/ResultView';
import { generateExercise } from './services/geminiService';
import { ReadingExercise, AppState, UserAnswers } from './types';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.SETUP);
  const [exerciseData, setExerciseData] = useState<ReadingExercise | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [errorMsg, setErrorMsg] = useState('');

  const handleStart = async (topic: string, level: number) => {
    setAppState(AppState.LOADING);
    setErrorMsg('');
    try {
      const data = await generateExercise(topic, level);
      setExerciseData(data);
      setAppState(AppState.READING);
    } catch (error) {
      console.error(error);
      setErrorMsg("Hoppsan! Något gick fel när vi skulle skapa texten. Försök igen!");
      setAppState(AppState.ERROR);
    }
  };

  const handleFinishedReading = () => {
    setAppState(AppState.QUIZ);
    // Scroll to top
    window.scrollTo(0, 0);
  };

  const handleQuizComplete = (answers: UserAnswers) => {
    setUserAnswers(answers);
    setAppState(AppState.RESULT);
    window.scrollTo(0, 0);
  };

  const handleRestart = () => {
    setExerciseData(null);
    setUserAnswers({});
    setAppState(AppState.SETUP);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-sky-50 font-sans selection:bg-indigo-200">
      
      {/* Loading State */}
      {appState === AppState.LOADING && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-xl font-bold text-indigo-900 animate-pulse">Författaren skriver...</p>
          <p className="text-sm text-indigo-400 mt-2">Det kan ta några sekunder</p>
        </div>
      )}

      {/* Error State */}
      {appState === AppState.ERROR && (
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md text-center">
            <div className="text-6xl mb-4">🤕</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Oj då!</h2>
            <p className="text-slate-600 mb-6">{errorMsg}</p>
            <button 
              onClick={() => setAppState(AppState.SETUP)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition"
            >
              Försök igen
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main>
        {appState === AppState.SETUP && <SetupView onStart={handleStart} />}
        
        {appState === AppState.READING && exerciseData && (
          <ReadingView 
            data={exerciseData} 
            onFinishedReading={handleFinishedReading} 
          />
        )}
        
        {appState === AppState.QUIZ && exerciseData && (
          <QuizView 
            data={exerciseData} 
            onComplete={handleQuizComplete} 
          />
        )}
        
        {appState === AppState.RESULT && exerciseData && (
          <ResultView 
            data={exerciseData} 
            answers={userAnswers} 
            onRestart={handleRestart} 
          />
        )}
      </main>
    </div>
  );
}

export default App;