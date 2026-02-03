import React, { useState, useEffect } from 'react';
import { AppState, User, LibraryText, UserAnswers, Badge } from './types';
import { LoginView } from './components/LoginView';
import { Header } from './components/Header';
import { SetupView } from './components/SetupView';
import { ReadingView } from './components/ReadingView';
import { QuizView } from './components/QuizView';
import { ResultView } from './components/ResultView';
import {
  createUser,
  loadUser,
  saveUser,
  logoutUser,
  recordResult,
  getCompletedTextIds,
} from './services/userService';
import { getRandomText } from './services/libraryService';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.LOGIN);
  const [currentText, setCurrentText] = useState<LibraryText | null>(null);
  const [currentGrade, setCurrentGrade] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [lastResult, setLastResult] = useState<{
    pointsEarned: number;
    newBadges: Badge[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Ladda användare vid start
  useEffect(() => {
    const savedUser = loadUser();
    if (savedUser) {
      setUser(savedUser);
      setAppState(AppState.SETUP);
    }
    setLoading(false);
  }, []);

  // Login
  const handleLogin = (name: string) => {
    const newUser = createUser(name);
    saveUser(newUser);
    setUser(newUser);
    setAppState(AppState.SETUP);
  };

  // Logout
  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setCurrentText(null);
    setCurrentGrade(null);
    setUserAnswers({});
    setLastResult(null);
    setAppState(AppState.LOGIN);
  };

  // Välj årskurs och hämta en text
  const handleSelectGrade = async (grade: number) => {
    if (!user) return;

    setCurrentGrade(grade);
    setLoading(true);

    const completedIds = getCompletedTextIds(user);
    const text = await getRandomText(grade, completedIds);

    if (text) {
      setCurrentText(text);
      setAppState(AppState.READING);
    } else {
      alert('Inga texter tillgängliga för denna årskurs.');
    }

    setLoading(false);
  };

  // Börja quiz efter läsning
  const handleStartQuiz = () => {
    setAppState(AppState.QUIZ);
  };

  // Visa texten igen från quiz
  const handleShowText = () => {
    setAppState(AppState.READING);
  };

  // Skicka in svar
  const handleComplete = (answers: UserAnswers) => {
    if (!user || !currentText) return;

    setUserAnswers(answers);

    // Beräkna rätt svar
    const correctCount = currentText.questions.reduce((count, q, index) => {
      const userAnswer = (answers[index] || '').trim().toLowerCase();
      const correctAnswer = q.a.trim().toLowerCase();
      const isCorrect =
        userAnswer === correctAnswer ||
        correctAnswer.split(' ').some((word) => userAnswer.includes(word) && word.length > 3);
      return count + (isCorrect ? 1 : 0);
    }, 0);

    // Registrera resultatet
    const { updatedUser, pointsEarned, newBadges } = recordResult(
      user,
      currentText.id,
      currentText.title,
      currentText.grade,
      correctCount,
      currentText.questions.length
    );

    setUser(updatedUser);
    setLastResult({ pointsEarned, newBadges });
    setAppState(AppState.RESULT);
  };

  // Tillbaka till årskursval
  const handleRestart = () => {
    setCurrentText(null);
    setCurrentGrade(null);
    setUserAnswers({});
    setLastResult(null);
    setAppState(AppState.SETUP);
  };

  // Nästa text i samma årskurs
  const handleNextText = async () => {
    if (!user || !currentGrade) {
      handleRestart();
      return;
    }

    setUserAnswers({});
    setLastResult(null);
    setLoading(true);

    const completedIds = getCompletedTextIds(user);
    const text = await getRandomText(currentGrade, completedIds);

    if (text) {
      setCurrentText(text);
      setAppState(AppState.READING);
    } else {
      handleRestart();
    }

    setLoading(false);
  };

  // Beräkna antal lästa texter per årskurs
  const getCompletedByGrade = (): Record<number, number> => {
    if (!user) return {};
    const counts: Record<number, number> = {};
    user.completedTexts.forEach((t) => {
      counts[t.grade] = (counts[t.grade] || 0) + 1;
    });
    return counts;
  };

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4 animate-bounce">📚</div>
          <p className="text-xl text-slate-600">Laddar...</p>
        </div>
      </div>
    );
  }

  // Login view
  if (appState === AppState.LOGIN || !user) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-indigo-50">
      <Header user={user} onLogout={handleLogout} onHomeClick={handleRestart} />

      <main>
        {appState === AppState.SETUP && (
          <SetupView
            onSelectGrade={handleSelectGrade}
            completedByGrade={getCompletedByGrade()}
          />
        )}

        {appState === AppState.READING && currentText && (
          <ReadingView text={currentText} onStartQuiz={handleStartQuiz} />
        )}

        {appState === AppState.QUIZ && currentText && (
          <QuizView
            text={currentText}
            onComplete={handleComplete}
            onShowText={handleShowText}
          />
        )}

        {appState === AppState.RESULT && currentText && lastResult && (
          <ResultView
            text={currentText}
            answers={userAnswers}
            pointsEarned={lastResult.pointsEarned}
            newBadges={lastResult.newBadges}
            onRestart={handleRestart}
            onNextText={handleNextText}
          />
        )}
      </main>
    </div>
  );
}

export default App;
