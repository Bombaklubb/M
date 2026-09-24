import { useCallback, useEffect, useState } from 'react';
import type { Exercise, Progress, StudentProfile } from '@/types';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoginView } from '@/views/LoginView';
import { HomeView, type Destination } from '@/views/HomeView';
import { LetterMapView } from '@/views/LetterMapView';
import { WriteHubView } from '@/views/WriteHubView';
import { SessionView, type SessionResult } from '@/views/SessionView';
import { RewardView } from '@/views/RewardView';
import { OvningsbankView } from '@/views/OvningsbankView';
import { FramstegView } from '@/views/FramstegView';
import { OmView } from '@/views/OmView';
import { KistorView } from '@/views/KistorView';
import { AffarView } from '@/views/AffarView';
import { generateLetterPass } from '@/lib/generators/letterExercises';
import { generateWritePass, type WriteMode } from '@/lib/generators/writingExercises';
import { getCurrentUser, getProfile, getProgress, saveProfile, saveProgress, setCurrentUser } from '@/lib/storage';
import { addXp, recordAnswer, shouldAdvanceLevel, shouldAdvanceStep, touchDailyStreak } from '@/lib/progress';
import { nyaKistor, oppnaKista, passKista, utvarderaUtmarkelser } from '@/lib/belohningar';
import { traKistaEfterPass } from '@/data/belohningar';
import { kop as kopVara, temaKlass, valj as valjVara, valjBort as valjBortVara } from '@/lib/affar';
import { varaById } from '@/data/affar';
import { setRateScale } from '@/lib/audio';
import { todayStamp } from '@/lib/utils';

type View =
  | { name: 'login' }
  | { name: 'home' }
  | { name: 'letters' }
  | { name: 'write' }
  | { name: 'ovningar' }
  | { name: 'session'; exercises: Exercise[]; repeat: () => Exercise[]; taskId?: string }
  | { name: 'reward'; result: SessionResult; repeat: () => Exercise[]; taskId?: string }
  | { name: 'framsteg' }
  | { name: 'om' }
  | { name: 'kistor' }
  | { name: 'affar' };

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
   * Temat ur affären.
   *
   * Klassen sätts på <body>, som redan bär standardtoningen – ett tema
   * ersätter den i stället för att läggas ovanpå. Alla teman tas bort först,
   * annars blir två kvar om eleven byter.
   */
  useEffect(() => {
    const klass = progress ? temaKlass(progress) : '';
    const alla = ['tema-skog', 'tema-hav', 'tema-solnedgang', 'tema-rymden'];
    document.body.classList.remove(...alla);
    if (klass) document.body.classList.add(klass);
  }, [progress?.valdTema]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Varje ny skärm börjar överst.
   *
   * Utan det här ärver nästa vy föregående vys scrollposition: kommer eleven
   * från botten av en lång sida öppnas nästa halvvägs nedskrollad, med
   * rubriken ovanför kanten. En elev som inte kan läsa förstår inte att hon
   * ska dra uppåt.
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
        next = recordAnswer(next, 'words', exercise.wordId, firstTry);
      }
    }

    next = addXp(next, result.xpEarned);
    next = touchDailyStreak(next);

    const module = result.perItem[0]?.exercise.module ?? 'bokstaver';
    // Träkistan kommer INTE varje pass. Den gav förut en kista varje gång,
    // och då blev den en kvittens i stället för en belöning. Mellanrummen är
    // ojämna – 3, 6, 4, 7, 5 pass – så den ska kännas oväntad.
    const passNr = next.sessions.length + 1;
    next = {
      ...next,
      kistor: traKistaEfterPass(passNr) ? [...next.kistor, passKista()] : next.kistor,
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

    // Kistor och utmärkelser räknas EFTER att passet bokförts, eftersom båda
    // bygger på antal pass, XP och bemästrade bokstäver som just ändrats.
    next = belona(next);

    saveProgress(profile.name, next);
    setProgress(next);

    // Steg och nivåband höjs båda automatiskt. Tidigare satte läraren dem för
    // hand i lärarläget; med det borta är det här enda sättet en elev kan gå
    // vidare från igenkänningsövningar till ljudning och ordläsning.
    let uppdaterad = profile;
    if (shouldAdvanceStep(profile, next)) {
      uppdaterad = { ...uppdaterad, progressionStep: uppdaterad.progressionStep + 1 };
    }
    const nyttBand = shouldAdvanceLevel(profile, next);
    if (nyttBand) uppdaterad = { ...uppdaterad, level: nyttBand };

    if (uppdaterad !== profile) {
      saveProfile(uppdaterad);
      setProfile(uppdaterad);
    }

    setView({ name: 'reward', result, repeat, taskId });
  };

  /**
   * Delar ut milstolpekistor och utmärkelser eleven tjänat in.
   *
   * Körs både efter ett pass och efter en öppnad kista – öppningen ger XP som
   * i sin tur kan passera en milstolpe. Varje milstolpe är bokförd i
   * `utdelade` och kan bara betalas en gång, så kedjan kan inte löpa amok.
   */
  const belona = (p: Progress): Progress => {
    const { kistor, nycklar } = nyaKistor(p);
    const nyaMarken = utvarderaUtmarkelser(p);
    if (kistor.length === 0 && nyaMarken.length === 0) return p;
    return {
      ...p,
      kistor: [...p.kistor, ...kistor],
      utdelade: [...p.utdelade, ...nycklar],
      badges: [...p.badges, ...nyaMarken],
    };
  };

  /** Eleven öppnar en kista. Belöningen kan i sin tur ge en ny kista. */
  const oppna = (kistId: string) => {
    if (!profile || !progress) return;
    const next = belona(oppnaKista(progress, kistId));
    saveProgress(profile.name, next);
    setProgress(next);
  };

  /**
   * Köper en vara.
   *
   * Figurer bor på PROFILEN och inte i progress, så den sätts här. Resten
   * (ram, tema) sköter lib/affar.ts, som också bokför poängen.
   */
  const kop = (id: string) => {
    if (!profile || !progress) return;
    const next = kopVara(progress, id);
    if (next === progress) return;            // hade inte råd, eller redan köpt
    saveProgress(profile.name, next);
    setProgress(next);

    const vara = varaById(id);
    if (vara?.typ === 'figur') {
      const uppdaterad = { ...profile, avatar: vara.ikon };
      saveProfile(uppdaterad);
      setProfile(uppdaterad);
    }
  };

  /** Väljer något eleven redan äger. */
  const valjVaran = (id: string) => {
    if (!profile || !progress) return;
    const vara = varaById(id);
    if (vara?.typ === 'figur') {
      const uppdaterad = { ...profile, avatar: vara.ikon };
      saveProfile(uppdaterad);
      setProfile(uppdaterad);
      return;
    }
    const next = valjVara(progress, id);
    if (next === progress) return;
    saveProgress(profile.name, next);
    setProgress(next);
  };

  /**
   * Tillbaka till standardutseendet.
   *
   * Utan det här fastnar den som köpt ett tema i det för alltid – det gick
   * att välja ett annat, men aldrig att stänga av. Engelskajakten löser det
   * med ett gratis "Standard"-kort i varje flik, och samma kort finns nu i
   * affären här. Köpet ligger kvar; det är bara påslaget som stängs av.
   */
  const valjBortVaran = (typ: 'ram' | 'tema') => {
    if (!profile || !progress) return;
    const next = valjBortVara(progress, typ);
    if (next === progress) return;
    saveProgress(profile.name, next);
    setProgress(next);
  };

  const goHome = () => setView({ name: 'home' });

  /**
   * Byt figur.
   *
   * Sparas direkt. Profilen ägs här, så både startsidans och framstegssidans
   * väljare skickar hit – annars skulle de två kunna hamna i otakt.
   */
  const valjFigur = (avatar: string) => {
    if (!profile) return;
    const uppdaterad = { ...profile, avatar };
    saveProfile(uppdaterad);
    setProfile(uppdaterad);
  };

  /**
   * Logga ut.
   *
   * Appen återupptar annars alltid senast inloggad elev, och utan det här går
   * inloggningssidan inte att nå igen efter första gången – en Chromebook som
   * delas av två–tre elever kunde inte byta mellan dem. Framstegen ligger kvar
   * på namnet; det är bara den aktiva eleven som släpps.
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
    else setView({ name: 'ovningar' });
  };

  return (
    <ErrorBoundary>
      {view.name === 'home' && (
        <HomeView
          profile={profile}
          progress={progress}
          onGo={go}
          onHem={goHome}
          onProfile={() => setView({ name: 'framsteg' })}
          onOm={() => setView({ name: 'om' })}
          onKistor={() => setView({ name: 'kistor' })}
          onAffar={() => setView({ name: 'affar' })}
          onLogout={logout}
        />
      )}

      {view.name === 'om' && <OmView onBack={goHome} />}

      {view.name === 'affar' && (
        <AffarView
          profile={profile}
          progress={progress}
          onKop={kop}
          onValj={valjVaran}
          onValjBort={valjBortVaran}
          onBack={goHome}
        />
      )}

      {view.name === 'kistor' && (
        <KistorView
          profile={profile}
          progress={progress}
          onOppna={oppna}
          onBack={goHome}
        />
      )}

      {view.name === 'framsteg' && (
        <FramstegView
          profile={profile}
          progress={progress}
          onBack={goHome}
          onValjFigur={valjFigur}
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

      {view.name === 'ovningar' && (
        <OvningsbankView
          profile={profile}
          progress={progress}
          onBack={goHome}
          onStart={(task) => startSession(() => task.build(Date.now()), task.id)}
        />
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

    </ErrorBoundary>
  );
}
