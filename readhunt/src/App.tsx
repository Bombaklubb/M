import { useState, useEffect, useRef } from 'react';
import { AppState, User, LibraryText, UserAnswers, Badge, QuestionResult, Chest } from './types';
import { LoginView } from './components/LoginView';
import { Header } from './components/Header';
import { SetupView } from './components/SetupView';
import { QuizView } from './components/QuizView';
import { ResultView } from './components/ResultView';
import { ProfileView } from './components/ProfileView';
import { TeacherView } from './components/TeacherView';
import { KistorView } from './components/KistorView';
import { BookLogo } from './components/BookLogo';
import { JaktLinks } from './components/JaktLinks';
import {
  loginUser,
  loadUser,
  logoutUser,
  recordResult,
  getCompletedTextIds,
  getRecentCompletedTexts,
  getLastCompletedText,
  updateAvatar,
  saveUser,
} from './services/userService';
import {
  trackPageView,
  startSession,
  trackTaskComplete,
} from './services/analyticsService';
import { getRandomText } from './services/libraryService';
import {
  loadGamification,
  saveGamification,
  chestsEarnedFromPoints,
  chestsEarnedFromTexts,
  rollMysteryBox,
} from './lib/gamification';

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
  const [showKistor, setShowKistor] = useState(false);
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

  // Starta anonym analytics (GDPR-säkrad)
  useEffect(() => {
    trackPageView();
    startSession();
  }, []);

  // Keyboard shortcut för lärarvy (F8 eller Ctrl+Shift+P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F8 or Ctrl+Shift+P opens the teacher view
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
    setShowKistor(false);
    setAppState(AppState.LOGIN);
  };

  // Handle points update from chests
  const handleChestPointsUpdate = (points: number) => {
    if (!user) return;
    const updatedUser = { ...user, totalPoints: user.totalPoints + points };
    saveUser(updatedUser);
    setUser(updatedUser);
  };

  // Get number of unopened chests
  const getUnopenedChestsCount = (): number => {
    const gam = loadGamification();
    return gam.chests.filter((c) => !c.opened).length;
  };

  // Välj årskurs och hämta en text - gå direkt till quiz (side-by-side)
  const handleSelectGrade = async (grade: number) => {
    if (!user) return;

    setCurrentGrade(grade);
    setLoading(true);

    const completedIds = getCompletedTextIds(user);
    const recentTexts = getRecentCompletedTexts(user, 10);
    const text = await getRandomText(grade, completedIds, recentTexts);

    if (text) {
      setCurrentText(text);
      quizStartTime.current = Date.now();
      setAppState(AppState.QUIZ); // Gå direkt till quiz med side-by-side layout
    } else {
      alert('No texts available for this level.');
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
      // Spåra anonym statistik (GDPR-säkrad) - skicka grade för att spåra stadiestatistik
      trackTaskComplete(isCorrect, q.type, currentText.grade);
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

    // Check for chest milestones
    const gam = loadGamification();
    const prevPoints = user.totalPoints;
    const newPoints = updatedUser.totalPoints;
    const prevTexts = user.completedTexts.length;
    const newTexts = updatedUser.completedTexts.length;

    const pointChests = chestsEarnedFromPoints(prevPoints, newPoints, gam.pointsMilestonesRewarded, gam.chests);
    const textChests = chestsEarnedFromTexts(prevTexts, newTexts, gam.textMilestonesRewarded, gam.chests);
    const mysteryReward = rollMysteryBox(gam.gamificationBadges, gam.chests);

    const newChests: Chest[] = [
      ...pointChests.map(c => c.chest),
      ...textChests.map(c => c.chest),
    ];

    // Add mystery box chest if applicable
    if (mysteryReward && mysteryReward.type === 'chest' && mysteryReward.chestType) {
      newChests.push({
        id: `mystery_${Date.now()}`,
        type: mysteryReward.chestType,
        earnedAt: new Date().toISOString(),
        opened: false,
      });
    }

    // Update gamification data
    const updatedGam = {
      ...gam,
      chests: [...gam.chests, ...newChests],
      textsCompleted: newTexts,
      pointsMilestonesRewarded: [
        ...gam.pointsMilestonesRewarded,
        ...pointChests.map(c => c.milestone),
      ],
      textMilestonesRewarded: [
        ...gam.textMilestonesRewarded,
        ...textChests.map(c => c.milestone),
      ],
    };
    saveGamification(updatedGam);

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
    setShowKistor(false);
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
    const recentTexts = getRecentCompletedTexts(user, 10);
    const text = await getRandomText(currentGrade, completedIds, recentTexts);

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
    const recentTexts = getRecentCompletedTexts(user, 10);
    const text = await getRandomText(newGrade, completedIds, recentTexts);

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
    const recentTexts = getRecentCompletedTexts(user, 10);
    const text = await getRandomText(newGrade, completedIds, recentTexts);

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
            <BookLogo size={120} />
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-300">Loading...</p>
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
          onKistorClick={() => { setShowProfile(false); setShowKistor(true); }}
          unopenedChests={getUnopenedChestsCount()}
        />
        <ProfileView
          user={user}
          onClose={() => setShowProfile(false)}
          onAvatarChange={handleAvatarChange}
        />
      </div>
    );
  }

  // Kistor view
  if (showKistor) {
    return (
      <KistorView
        user={user}
        onClose={() => setShowKistor(false)}
        onPointsUpdate={handleChestPointsUpdate}
      />
    );
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={appState === AppState.SETUP ? {
        backgroundImage: 'url(/ny%20readhunt.png)',
        backgroundSize: '110% auto',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#0f172a',
      } : undefined}
    >
      {/* Light overlay on setup page */}
      {appState === AppState.SETUP && (
        <div className="absolute inset-0 bg-black/20 -z-10" />
      )}
      {/* Fallback bg for other states */}
      {appState !== AppState.SETUP && (
        <div className="absolute inset-0 bg-sky-50 dark:bg-slate-900 -z-10" />
      )}

      <Header
        user={user}
        onLogout={handleLogout}
        onHomeClick={handleRestart}
        onProfileClick={() => setShowProfile(true)}
        onKistorClick={() => setShowKistor(true)}
        unopenedChests={getUnopenedChestsCount()}
      />

      <main className="relative z-10">
        {appState === AppState.SETUP && (
          <SetupView
            onSelectGrade={handleSelectGrade}
            completedByGrade={getCompletedByGrade()}
            lastCompletedText={user ? getLastCompletedText(user) : null}
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

      {/* Kontaktinfo - visas endast på Setup-sidan */}
      {appState === AppState.SETUP && (
        <div className="fixed bottom-4 left-4 text-sm text-slate-600 dark:text-slate-400 z-40">
          Contact: <a href="mailto:martin.akdogan@enkoping.se" className="font-semibold hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">martin.akdogan@enkoping.se</a>
        </div>
      )}

      {/* Lärarvy (öppnas med Ctrl+Shift+L) */}
      {showTeacher && (
        <TeacherView onClose={() => setShowTeacher(false)} />
      )}

      {/* Jaktlänkar */}
      <footer className="fixed bottom-4 right-4 text-sm z-50">
        <JaktLinks />
      </footer>
    </div>
  );
}

export default App;
