import { useCallback, useEffect, useState } from 'react';
import type { Exercise, Progress, StudentProfile } from '@/types';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoginView } from '@/views/LoginView';
import { HomeView, type Destination } from '@/views/HomeView';
import { LetterMapView } from '@/views/LetterMapView';
import { WriteHubView } from '@/views/WriteHubView';
import { SessionView, type SessionResult } from '@/views/SessionView';
import { RewardView } from '@/views/RewardView';
import { TeacherView } from '@/views/TeacherView';
import { TeacherLoginView } from '@/views/TeacherLoginView';
import { ThemeHubView } from '@/views/ThemeHubView';
import { ThemeEditorView } from '@/views/ThemeEditorView';
import { OvningsbankView } from '@/views/OvningsbankView';
import { FramstegView } from '@/views/FramstegView';
import { generateLetterPass } from '@/lib/generators/letterExercises';
import { generateWritePass, type WriteMode } from '@/lib/generators/writingExercises';
import { generateThemePass, type ThemeMode } from '@/lib/generators/themeExercises';
import { activeTheme } from '@/data/themes';
import { getCurrentUser, getProfile, getProgress, saveProfile, saveProgress, setCurrentUser } from '@/lib/storage';
import { addXp, recordAnswer, shouldAdvanceStep, touchDailyStreak } from '@/lib/progress';
import { setRateScale } from '@/lib/audio';
import { todayStamp } from '@/lib/utils';

type View =
  | { name: 'login' }
  | { name: 'home' }
  | { name: 'letters' }
  | { name: 'write' }
  | { name: 'theme' }
  | { name: 'theme-editor' }
  | { name: 'ovningar' }
  | { name: 'framsteg' }
  | { name: 'session'; exercises: Exercise[]; repeat: () => Exercise[]; taskId?: string }
  | { name: 'reward'; result: SessionResult; repeat: () => Exercise[]; taskId?: string }
  | { name: 'teacher-pin' }
  | { name: 'teacher' };

/**
 * Ingen router med flit.
 *
 * Vyn ligger i state och "bakåt" är alltid en knapp på skärmen. Webbläsarens
 * bakåtpil är inte kopplad till någonting – en elev som inte kan läsa ska
 * inte kunna hamna halvvägs i en historik hon inte förstår.
 */
export default function App() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [view, setView] = useState<View>({ name: 'login' });

  // Återuppta senast inloggad elev.
  useEffect(() => {
    const name = getCurrentUser();
    if (!name) return;
    const p = getProfile(name);
    if (!p) return;
    setProfile(p);
    setProgress(getProgress(name));
    setView({ name: 'home' });
  }, []);

  // Elevens taluppspelningshastighet och typsnittsval slår igenom globalt.
  useEffect(() => {
    if (!profile) return;
    setRateScale(profile.settings.speechRate);
    document.documentElement.classList.toggle('font-dyslexic', profile.settings.dyslexicFont);
  }, [profile?.settings.speechRate, profile?.settings.dyslexicFont]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Varje ny skärm börjar överst.
   *
   * Utan det här ärver nästa vy föregående vys scrollposition: trycker eleven
   * "Byt elev" längst ned på framstegssidan öppnas inloggningen halvvägs
   * nedskrollad, med rubriken ovanför kanten. En elev som inte kan läsa
   * förstår inte att hon ska dra uppåt.
   */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view.name, profile === null]);

  const login = (p: StudentProfile) => {
    setCurrentUser(p.name);
    setProfile(p);
    setProgress(getProgress(p.name));
    setView({ name: 'home' });
  };

  const startSession = useCallback((make: () => Exercise[], taskId?: string) => {
    const exercises = make();
    if (exercises.length === 0) return;
    setView({ name: 'session', exercises, repeat: make, taskId });
  }, []);

  /**
   * Bokför ett avslutat pass.
   *
   * Bemästring räknas bara på uppgifter som klarades på FÖRSTA försöket –
   * annars skulle en elev som lotsats rätt två gånger räknas som att hon kan
   * bokstaven, och läraren skulle få fel bild.
   */
  const finishSession = (result: SessionResult, repeat: () => Exercise[], taskId?: string) => {
    if (!profile || !progress) return;

    let next = progress;
    for (const { exercise, firstTry } of result.perItem) {
      if ('letterId' in exercise) {
        next = recordAnswer(next, 'letters', exercise.letterId, firstTry);
      } else if ('wordId' in exercise) {
        // Temaord räknas för sig. Annars skulle "skepp" från Vikingatiden
        // blandas ihop med ljudenliga träningsord i lärarens överblick.
        const bucket = exercise.module === 'tema' ? 'themeWords' : 'words';
        next = recordAnswer(next, bucket, exercise.wordId, firstTry);
      }
    }

    next = addXp(next, result.xpEarned);
    next = touchDailyStreak(next);

    const module = result.perItem[0]?.exercise.module ?? 'bokstaver';
    next = {
      ...next,
      chests: next.chests + 1,
      sessions: [
        ...next.sessions,
        {
          date: todayStamp(),
          module,
          items: result.total,
          firstTryCorrect: result.firstTryCorrect,
          seconds: result.seconds,
        },
      ],
    };

    // Resultat per uppgift, så att eleven ser vad hon klarat och hur bra.
    if (taskId) {
      const fore = next.tasks[taskId];
      next = {
        ...next,
        tasks: {
          ...next.tasks,
          [taskId]: {
            gjord: (fore?.gjord ?? 0) + 1,
            basta: Math.max(fore?.basta ?? 0, result.firstTryCorrect),
            antal: result.total,
            senast: todayStamp(),
          },
        },
      };
    }

    saveProgress(profile.name, next);
    setProgress(next);

    if (shouldAdvanceStep(profile, next)) {
      const advanced = { ...profile, progressionStep: profile.progressionStep + 1 };
      saveProfile(advanced);
      setProfile(advanced);
    }

    setView({ name: 'reward', result, repeat, taskId });
  };

  const goHome = () => setView({ name: 'home' });

  /**
   * Byt elev.
   *
   * Appen återupptar annars alltid senast inloggad elev, och utan det här
   * gick inloggningssidan inte att nå igen efter första gången. Framstegen
   * ligger kvar på namnet – det är bara den aktiva eleven som släpps.
   */
  const logout = () => {
    setCurrentUser(null);
    setProfile(null);
    setProgress(null);
    setView({ name: 'login' });
  };

  if (!profile || !progress) {
    return (
      <ErrorBoundary>
        <LoginView onLogin={login} />
      </ErrorBoundary>
    );
  }

  const go = (dest: Destination) => {
    if (dest === 'bokstaver') setView({ name: 'letters' });
    else if (dest === 'skriva') setView({ name: 'write' });
    else if (dest === 'ovningar') setView({ name: 'ovningar' });
    else setView({ name: 'theme' });
  };

  return (
    <ErrorBoundary>
      {view.name === 'home' && (
        <HomeView
          profile={profile}
          progress={progress}
          onGo={go}
          onTeacher={() => setView({ name: 'teacher-pin' })}
          onProfile={() => setView({ name: 'framsteg' })}
        />
      )}

      {view.name === 'framsteg' && (
        <FramstegView
          profile={profile}
          progress={progress}
          onBack={goHome}
          onLogout={logout}
        />
      )}

      {view.name === 'letters' && (
        <LetterMapView
          profile={profile}
          progress={progress}
          onBack={goHome}
          onStart={(step) =>
            startSession(() => generateLetterPass(step, profile.level))
          }
        />
      )}

      {view.name === 'write' && (
        <WriteHubView
          onBack={goHome}
          onStart={(mode: WriteMode) =>
            startSession(() => generateWritePass(mode, profile.progressionStep, profile.level))
          }
        />
      )}

      {view.name === 'theme' && (
        <ThemeHubView
          theme={activeTheme()}
          profile={profile}
          onBack={goHome}
          onStart={(mode: ThemeMode) => {
            const theme = activeTheme();
            if (!theme) return;
            startSession(() =>
              generateThemePass(theme, mode, profile.progressionStep, profile.level)
            );
          }}
        />
      )}

      {view.name === 'ovningar' && (
        <OvningsbankView
          profile={profile}
          progress={progress}
          onBack={goHome}
          onStart={(task) => startSession(() => task.build(Date.now()), task.id)}
        />
      )}

      {view.name === 'theme-editor' && (
        <ThemeEditorView level={profile.level} onDone={() => setView({ name: 'teacher' })} />
      )}

      {view.name === 'session' && (
        <SessionView
          exercises={view.exercises}
          profile={profile}
          onHome={goHome}
          onFinish={(result) => finishSession(result, view.repeat, view.taskId)}
        />
      )}

      {view.name === 'reward' && (
        <RewardView
          result={view.result}
          onHome={goHome}
          onAgain={() => startSession(view.repeat, view.taskId)}
        />
      )}

      {view.name === 'teacher-pin' && (
        <TeacherLoginView onUnlock={() => setView({ name: 'teacher' })} onCancel={goHome} />
      )}

      {view.name === 'teacher' && (
        <TeacherView
          profile={profile}
          progress={progress}
          onProfileChange={setProfile}
          onProgressChange={setProgress}
          onEditThemes={() => setView({ name: 'theme-editor' })}
          onExit={goHome}
        />
      )}
    </ErrorBoundary>
  );
}
