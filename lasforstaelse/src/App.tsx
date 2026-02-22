import { useState, useEffect, useRef } from 'react';
import { AppState, User, LibraryText, UserAnswers, Badge, QuestionResult } from './types';
import { LoginView } from './components/LoginView';
import { Header } from './components/Header';
import { SetupView } from './components/SetupView';
import { QuizView } from './components/QuizView';
import { ResultView } from './components/ResultView';
import { ProfileView } from './components/ProfileView';
import { TeacherView } from './components/TeacherView';
import { StudentMessageBox } from './components/StudentMessageBox';
import { BookLogo } from './components/BookLogo';
import {
  loginUser,
  loadUser,
  logoutUser,
  recordResult,
  getCompletedTextIds,
  updateAvatar,
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
  const [showProfile, setShowProfile] = useState(false);
  const [showTeacher, setShowTeacher] = useState(false);
  const [showMessageBox, setShowMessageBox] = useState(false);
  const quizStartTime = useRef<number | null>(null);

  // Ladda användare vid start
  useEffect(() => {
    const savedUser = loadUser();
    if (savedUser) {
      setUser(savedUser);
      setAppState(AppState.SETUP);
    }
    setLoading(false);
  }, []);

  // Keyboard shortcut för lärarvy (F8 eller Ctrl+Shift+P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F8 eller Ctrl+Shift+P öppnar lärarvyn
      if (e.key === 'F8' || (e.ctrlKey && e.shiftKey && (e.key === 'P' || e.key === 'p'))) {
        e.preventDefault();
        setShowTeacher(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Öppna lärarvy via URL parameter (?teacher=1)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('teacher') === '1') {
      setShowTeacher(true);
    }
  }, []);

  // Login
  const handleLogin = async (name: string, avatar: string) => {
    setLoading(true);
    try {
      const user = await loginUser(name, avatar);
      setUser(user);
      setAppState(AppState.SETUP);
    } catch (err) {
      console.error('Kunde inte logga in:', err);
    } finally {
      setLoading(false);
    }
  };

  // Byt avatar
  const handleAvatarChange = (avatar: string) => {
    if (user) {
      const updatedUser = updateAvatar(user, avatar);
      setUser(updatedUser);
    }
  };

  // Logout
  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setCurrentText(null);
    setCurrentGrade(null);
    setUserAnswers({});
    setLastResult(null);
    setShowProfile(false);
    setAppState(AppState.LOGIN);
  };

  // Välj årskurs och hämta en text - gå direkt till quiz (side-by-side)
  const handleSelectGrade = async (grade: number) => {
    if (!user) return;

    setCurrentGrade(grade);
    setLoading(true);

    const completedIds = getCompletedTextIds(user);
    const text = await getRandomText(grade, completedIds);

    if (text) {
      setCurrentText(text);
      quizStartTime.current = Date.now();
      setAppState(AppState.QUIZ); // Gå direkt till quiz med side-by-side layout
    } else {
      alert('Inga texter tillgängliga för denna årskurs.');
    }

    setLoading(false);
  };

  // Skicka in svar
  const handleComplete = (answers: UserAnswers) => {
    if (!user || !currentText) return;

    setUserAnswers(answers);

    // Beräkna rätt svar och bygg questionResults
    const questionResults: QuestionResult[] = [];
    const correctCount = currentText.questions.reduce((count, q, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer !== undefined && Number(userAnswer) === q.correct;
      questionResults.push({ questionType: q.type, correct: isCorrect });
      return count + (isCorrect ? 1 : 0);
    }, 0);

    // Beräkna lästid
    const readingTimeSeconds = quizStartTime.current
      ? Math.round((Date.now() - quizStartTime.current) / 1000)
      : undefined;

    // Registrera resultatet
    const { updatedUser, pointsEarned, newBadges } = recordResult(
      user,
      currentText.id,
      currentText.title,
      currentText.grade,
      correctCount,
      currentText.questions.length,
      currentText.genre,
      currentText.theme,
      questionResults,
      readingTimeSeconds
    );

    setUser(updatedUser);
    setLastResult({ pointsEarned, newBadges });
    setAppState(AppState.RESULT);
    window.scrollTo(0, 0);
  };

  // Tillbaka till årskursval
  const handleRestart = () => {
    setCurrentText(null);
    setCurrentGrade(null);
    setUserAnswers({});
    setLastResult(null);
    setShowProfile(false);
    setAppState(AppState.SETUP);
    window.scrollTo(0, 0);
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
      quizStartTime.current = Date.now();
      setAppState(AppState.QUIZ);
    } else {
      handleRestart();
    }

    setLoading(false);
    window.scrollTo(0, 0);
  };

  // Nästa text i lägre årskurs
  const handleNextTextLower = async () => {
    if (!user || !currentGrade || currentGrade <= 1) {
      handleRestart();
      return;
    }

    const newGrade = currentGrade - 1;
    setCurrentGrade(newGrade);
    setUserAnswers({});
    setLastResult(null);
    setLoading(true);

    const completedIds = getCompletedTextIds(user);
    const text = await getRandomText(newGrade, completedIds);

    if (text) {
      setCurrentText(text);
      quizStartTime.current = Date.now();
      setAppState(AppState.QUIZ);
    } else {
      handleRestart();
    }

    setLoading(false);
    window.scrollTo(0, 0);
  };

  // Nästa text i högre årskurs
  const handleNextTextHigher = async () => {
    if (!user || !currentGrade || currentGrade >= 10) {
      handleRestart();
      return;
    }

    const newGrade = currentGrade + 1;
    setCurrentGrade(newGrade);
    setUserAnswers({});
    setLastResult(null);
    setLoading(true);

    const completedIds = getCompletedTextIds(user);
    const text = await getRandomText(newGrade, completedIds);

    if (text) {
      setCurrentText(text);
      quizStartTime.current = Date.now();
      setAppState(AppState.QUIZ);
    } else {
      handleRestart();
    }

    setLoading(false);
    window.scrollTo(0, 0);
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
      <div className="min-h-screen bg-sky-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4 animate-bounce">
            <BookLogo size={80} />
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-300">Laddar...</p>
        </div>
      </div>
    );
  }

  // Login view
  if (appState === AppState.LOGIN || !user) {
    return <LoginView onLogin={handleLogin} />;
  }

  // Profile view
  if (showProfile) {
    return (
      <div className="min-h-screen bg-sky-50 dark:bg-slate-900">
        <Header
          user={user}
          onLogout={handleLogout}
          onHomeClick={handleRestart}
          onProfileClick={() => setShowProfile(false)}
        />
        <ProfileView
          user={user}
          onClose={() => setShowProfile(false)}
          onAvatarChange={handleAvatarChange}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50 dark:bg-slate-900">
      <Header
        user={user}
        onLogout={handleLogout}
        onHomeClick={handleRestart}
        onProfileClick={() => setShowProfile(true)}
      />

      <main>
        {appState === AppState.SETUP && (
          <SetupView
            onSelectGrade={handleSelectGrade}
            completedByGrade={getCompletedByGrade()}
          />
        )}

        {appState === AppState.QUIZ && currentText && (
          <QuizView
            text={currentText}
            onComplete={handleComplete}
            onShowText={() => {}} // Not used anymore with side-by-side layout
          />
        )}

        {appState === AppState.RESULT && currentText && lastResult && currentGrade && (
          <ResultView
            text={currentText}
            answers={userAnswers}
            pointsEarned={lastResult.pointsEarned}
            newBadges={lastResult.newBadges}
            onRestart={handleRestart}
            onNextText={handleNextText}
            onNextTextLower={handleNextTextLower}
            onNextTextHigher={handleNextTextHigher}
            currentGrade={currentGrade}
          />
        )}
      </main>

      {/* Meddelandeknapp */}
      <button
        onClick={() => setShowMessageBox(true)}
        className="fixed bottom-6 left-6 bg-purple-600 hover:bg-purple-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-40 group"
        title="Skicka meddelande"
        aria-label="Skicka meddelande"
      >
        <span className="text-2xl">💬</span>
      </button>

      {/* Meddelanderuta */}
      {showMessageBox && user && (
        <StudentMessageBox
          studentName={user.name}
          studentAvatar={user.avatar}
          onClose={() => setShowMessageBox(false)}
        />
      )}

      {/* Lärarvy (öppnas med Ctrl+Shift+L) */}
      {showTeacher && (
        <TeacherView onClose={() => setShowTeacher(false)} />
      )}

      {/* Signatur */}
      <footer className="fixed bottom-2 right-3 text-xs text-slate-400 dark:text-slate-600 opacity-60 hover:opacity-100 transition-opacity">
        Läsjakten av Martin Akdogan
      </footer>
    </div>
  );
}

export default App;
