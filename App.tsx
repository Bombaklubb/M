import React, { useState } from 'react';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { SetupView } from './components/SetupView';
import { ReadingView } from './components/ReadingView';
import { ResultView } from './components/ResultView';
import { Header } from './components/Header';
import { generateExercise } from './services/anthropicService';
import { ReadingExercise, AppState, UserAnswers, UserRole, Badge, TextType, TOPICS, TEXT_TYPES } from './types';
import { useAuth } from './hooks/useAuth';
import { useProgress } from './hooks/useProgress';

function App() {
  const { user, isLoading, login, logout, updateUser, isAuthenticated } = useAuth();
  const { recordResult } = useProgress(user, updateUser);

  const [appState, setAppState] = useState<AppState>(AppState.SETUP);
  const [exerciseData, setExerciseData] = useState<ReadingExercise | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [errorMsg, setErrorMsg] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Result info for displaying
  const [resultInfo, setResultInfo] = useState<{
    pointsEarned: number;
    newLevel: number;
    oldLevel: number;
    newBadges: Badge[];
    timeSpentMinutes: number;
  } | null>(null);

  const handleStart = async (topic: string, level: number, textType: TextType, retryCount = 0) => {
    setAppState(AppState.LOADING);
    setErrorMsg('');
    try {
      // Use the selected level - user can choose any level they want
      const data = await generateExercise(topic, level, textType);
      setExerciseData(data);
      setStartTime(Date.now()); // Start timing when reading begins
      setAppState(AppState.READING);
    } catch (error: any) {
      console.error(error);

      // Hantera rate limit-fel
      if (error?.message === 'RATE_LIMIT' && retryCount < 2) {
        const waitTime = (retryCount + 1) * 5; // 5s, 10s
        setErrorMsg(`Systemet är upptaget. Du står i kö och försöker igen om ${waitTime} sekunder...`);
        setAppState(AppState.ERROR);

        // Vänta och försök igen
        setTimeout(() => {
          handleStart(topic, level, textType, retryCount + 1);
        }, waitTime * 1000);
      } else if (error?.message === 'RATE_LIMIT') {
        setErrorMsg("Systemet är mycket upptaget just nu. Vänta 30 sekunder och försök igen!");
        setAppState(AppState.ERROR);
      } else if (error?.message?.includes('Nätverksfel')) {
        setErrorMsg("Nätverksfel. Kontrollera din internetanslutning och försök igen.");
        setAppState(AppState.ERROR);
      } else {
        setErrorMsg("Hoppsan! Något gick fel när vi skulle skapa texten. Försök igen!");
        setAppState(AppState.ERROR);
      }
    }
  };

  const handleComplete = (answers: UserAnswers) => {
    setUserAnswers(answers);

    // Calculate time spent
    const timeSpentMs = startTime ? Date.now() - startTime : 0;
    const timeSpentMinutes = Math.max(1, Math.round(timeSpentMs / 60000)); // Minimum 1 minute

    // Calculate score
    if (exerciseData && user) {
      let correctCount = 0;
      exerciseData.questions.forEach(q => {
        if (answers[q.id]?.toLowerCase() === q.correctAnswer.toLowerCase()) {
          correctCount++;
        }
      });

      // Record result and get feedback
      const result = recordResult(
        exerciseData.title,
        exerciseData.level,
        'General', // You could pass the actual topic if you track it
        correctCount,
        exerciseData.questions.length
      );

      if (result) {
        setResultInfo({
          pointsEarned: result.pointsEarned,
          newLevel: result.newLevel,
          oldLevel: user.currentLevel,
          newBadges: result.newBadges,
          timeSpentMinutes: timeSpentMinutes,
        });
      }
    }

    setAppState(AppState.RESULT);
    window.scrollTo(0, 0);
  };

  const handleRestart = () => {
    setExerciseData(null);
    setUserAnswers({});
    setResultInfo(null);
    setStartTime(null);
    setAppState(AppState.SETUP);
    window.scrollTo(0, 0);
  };

  const handleRandomize = async () => {
    // Nollställ tidigare resultat
    setUserAnswers({});
    setResultInfo(null);
    setStartTime(null);

    // Slumpa fram ämne och texttyp
    const randomTopic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    const randomTextType = TEXT_TYPES[Math.floor(Math.random() * TEXT_TYPES.length)].value;

    // Beräkna om användaren fick alla rätt
    let correctCount = 0;
    if (exerciseData) {
      exerciseData.questions.forEach(q => {
        if (userAnswers[q.id]?.toLowerCase() === q.correctAnswer.toLowerCase()) {
          correctCount++;
        }
      });
    }

    const allCorrect = correctCount === exerciseData?.questions.length;
    const currentTextLevel = exerciseData?.level || user?.currentLevel || 4;

    // Om alla rätt → högre nivå, annars lägre nivå
    let randomLevel;
    if (allCorrect) {
      // Alla rätt → gå upp 1 nivå (max 20)
      randomLevel = Math.min(currentTextLevel + 1, 20);
    } else {
      // Inte alla rätt → gå ner 1 nivå (min 1)
      randomLevel = Math.max(currentTextLevel - 1, 1);
    }

    // Starta direkt med slumpmässiga val
    await handleStart(randomTopic, randomLevel, randomTextType);
  };

  const handleLogin = (username: string, role: UserRole) => {
    login(username, role);
  };

  const handleLogout = () => {
    logout();
    handleRestart();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-xl text-slate-600">Laddar...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show login
  if (!isAuthenticated || !user) {
    return <Login onLogin={handleLogin} />;
  }

  // Teacher view (simplified for now - just redirect to profile)
  if (user.role === UserRole.TEACHER) {
    return (
      <div className="min-h-screen bg-sky-50">
        <Header user={user} onLogout={handleLogout} onProfileClick={() => setShowProfile(!showProfile)} onLogoClick={handleRestart} />
        <div className="max-w-4xl mx-auto p-8 text-center">
          <div className="bg-white rounded-3xl p-12 shadow-xl">
            <div className="text-6xl mb-4">👨‍🏫</div>
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Lärarvy</h1>
            <p className="text-slate-600 mb-6">
              Lärarfunktioner är under utveckling! Du kan fortfarande använda appen som elev.
            </p>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition"
            >
              Logga ut
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Profile view
  if (showProfile) {
    return (
      <>
        <Header user={user} onLogout={handleLogout} onProfileClick={() => setShowProfile(false)} onLogoClick={handleRestart} />
        <Profile user={user} onClose={() => setShowProfile(false)} />
      </>
    );
  }

  // Main student view
  return (
    <div className="min-h-screen bg-sky-50 font-sans selection:bg-indigo-200">
      <Header user={user} onLogout={handleLogout} onProfileClick={() => setShowProfile(true)} onLogoClick={handleRestart} />

      {/* Loading State */}
      {appState === AppState.LOADING && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-xl font-bold text-indigo-900 animate-pulse">Författaren skriver...</p>
          <p className="text-sm text-indigo-400 mt-2">Det kan ta några sekunder. Om många använder appen står du i kö.</p>
        </div>
      )}

      {/* Error State */}
      {appState === AppState.ERROR && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
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
        {appState === AppState.SETUP && (
          <SetupView onStart={handleStart} userLevel={user?.currentLevel} />
        )}

        {appState === AppState.READING && exerciseData && (
          <ReadingView
            data={exerciseData}
            onComplete={handleComplete}
          />
        )}

        {appState === AppState.RESULT && exerciseData && (
          <ResultView
            data={exerciseData}
            answers={userAnswers}
            onRestart={handleRestart}
            onRandomize={handleRandomize}
            pointsEarned={resultInfo?.pointsEarned}
            newLevel={resultInfo?.newLevel}
            oldLevel={resultInfo?.oldLevel}
            newBadges={resultInfo?.newBadges}
            timeSpentMinutes={resultInfo?.timeSpentMinutes}
          />
        )}
      </main>
    </div>
  );
}

export default App;
