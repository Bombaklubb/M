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
import ShopView from './components/ShopView';
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
import { getRandomText, loadLibrary } from './services/libraryService';
import {
  getDailyText,
  getStreak,
  isDailyBonusClaimedToday,
  claimDailyBonus,
  DAILY_BONUS_POINTS,
} from './lib/daily';
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
  const [showShop, setShowShop] = useState(false);
  const [dailyText, setDailyText] = useState<LibraryText | null>(null);
  const quizStartTime = useRef<number | null>(null);

  // Dagens text (deterministisk per datum)
  useEffect(() => {
    loadLibrary().then((lib) => setDailyText(getDailyText(lib)));
  }, []);

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
    setShowShop(false);
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
    const result = recordResult(
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
    let { updatedUser, pointsEarned } = result;
    const { newBadges } = result;

    // Bonus för dagens text (kan bara hämtas en gång per dag)
    if (dailyText && currentText.id === dailyText.id && !isDailyBonusClaimedToday()) {
      claimDailyBonus();
      updatedUser = { ...updatedUser, totalPoints: updatedUser.totalPoints + DAILY_BONUS_POINTS };
      saveUser(updatedUser);
      pointsEarned += DAILY_BONUS_POINTS;
    }

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
    setShowShop(false);
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

  // Starta dagens text direkt
  const handleStartDailyText = () => {
    if (!dailyText) return;
    setCurrentGrade(dailyText.grade);
    setCurrentText(dailyText);
    setUserAnswers({});
    setLastResult(null);
    quizStartTime.current = Date.now();
    setAppState(AppState.QUIZ);
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
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
      <div className="min-h-screen" style={{ position: 'relative' }}>
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: 'url(/bakgrund-profil.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Header
          user={user}
          onLogout={handleLogout}
          onHomeClick={handleRestart}
          onProfileClick={() => setShowProfile(false)}
          onKistorClick={() => { setShowProfile(false); setShowKistor(true); }}
          onShopClick={() => { setShowProfile(false); setShowShop(true); }}
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

  // Shop view
  if (showShop) {
    return <ShopView onBack={() => setShowShop(false)} />;
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={appState === AppState.SETUP ? {
        backgroundImage: 'url(/senaste%20readhunt.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#0c1a2e',
      } : undefined}
    >
      {/* Light overlay on setup page */}
      {appState === AppState.SETUP && (
        <div className="absolute inset-0 bg-black/20 -z-10" />
      )}
      {/* Fallback bg for other states */}
      {appState !== AppState.SETUP && (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 -z-10" />
      )}

      <Header
        user={user}
        onLogout={handleLogout}
        onHomeClick={handleRestart}
        onProfileClick={() => setShowProfile(true)}
        onKistorClick={() => setShowKistor(true)}
        onShopClick={() => setShowShop(true)}
        unopenedChests={getUnopenedChestsCount()}
      />

      <main className="relative z-10">
        {appState === AppState.SETUP && (
          <SetupView
            onSelectGrade={handleSelectGrade}
            completedByGrade={getCompletedByGrade()}
            lastCompletedText={user ? getLastCompletedText(user) : null}
            dailyText={dailyText}
            dailyDone={isDailyBonusClaimedToday()}
            streak={user ? getStreak(user.completedTexts) : 0}
            onStartDaily={handleStartDailyText}
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
        <div className="fixed bottom-4 left-4 text-sm z-40 px-3 py-1.5 rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 font-medium">
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
