import React, { useMemo, useState } from 'react';
import AppHeader from './AppHeader';
import { useApp } from '../contexts/AppContext';
import { Confetti } from './magicui/confetti';
import {
  getDailyExercises, getDailyChallengeRecord, completeDailyChallenge,
  DAILY_POINTS_PER_CORRECT, DAILY_PERFECT_BONUS, DAILY_CHALLENGE_SIZE,
  type DailyChallengeRecord,
} from '../utils/dailyChallenge';

type Phase = 'intro' | 'play' | 'result';

const MAX_POINTS = DAILY_CHALLENGE_SIZE * DAILY_POINTS_PER_CORRECT + DAILY_PERFECT_BONUS;

export default function DailyChallengeView() {
  const { currentStudent, setView } = useApp();
  const [phase, setPhase] = useState<Phase>('intro');
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answered, setAnswered] = useState<null | { pickedIndex: number; correct: boolean }>(null);
  const [result, setResult] = useState<DailyChallengeRecord | null>(null);

  const exercises = useMemo(
    () => (currentStudent ? getDailyExercises(currentStudent.grade) : []),
    [currentStudent]
  );

  if (!currentStudent) return null;

  const doneToday = getDailyChallengeRecord(currentStudent.id);
  const ex = exercises[index];

  // Svarsalternativ: multiple-choice har egna, sant/falskt får två.
  const options = ex
    ? ex.type === 'multiple-choice' ? ex.options : ['Sant', 'Falskt']
    : [];
  const correctIndex = ex
    ? ex.type === 'multiple-choice' ? ex.correctIndex : (ex.isTrue ? 0 : 1)
    : 0;

  function pickAnswer(i: number) {
    if (answered) return;
    const correct = i === correctIndex;
    if (correct) setCorrectCount(c => c + 1);
    setAnswered({ pickedIndex: i, correct });
  }

  function next() {
    if (index + 1 >= exercises.length) {
      const finalCorrect = correctCount; // correctCount är redan uppdaterad vid svar
      const rec = completeDailyChallenge(currentStudent!.id, finalCorrect, exercises.length);
      setResult(rec);
      setPhase('result');
    } else {
      setIndex(i => i + 1);
      setAnswered(null);
    }
  }

  const heroCard = (children: React.ReactNode) => (
    <div className="min-h-screen" style={{
      backgroundImage: "url('/Matematisk bakgrund med glödande symboler.png')",
      backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
    }}>
      <AppHeader />
      <div className="pt-14 text-white" style={{ background: 'linear-gradient(135deg,#78350f 0%,#b45309 50%,#d97706 100%)' }}>
        <div className="max-w-2xl mx-auto px-4 py-6">
          <button
            onClick={() => setView('dashboard')}
            className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-3 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40 rounded"
          >
            ← Tillbaka
          </button>
          <div className="flex items-center gap-3">
            <span className="text-4xl">🗓️</span>
            <div>
              <h1 className="text-2xl font-black">Dagens utmaning</h1>
              <p className="text-white/70 text-sm">{DAILY_CHALLENGE_SIZE} blandade frågor – en gång per dag!</p>
            </div>
          </div>
        </div>
      </div>
      <main className="max-w-2xl mx-auto px-4 py-6 pb-16">{children}</main>
    </div>
  );

  // ── Redan gjord idag ────────────────────────────────────────────────────────
  if (doneToday && phase !== 'result') {
    return heroCard(
      <div className="rounded-3xl p-8 text-center text-white" style={{ background: 'rgba(40,8,32,0.82)', backdropFilter: 'blur(20px)', border: '1px solid rgba(200,140,50,0.28)' }}>
        <div className="text-5xl mb-3">✅</div>
        <h2 className="text-xl font-black mb-2">Klar för idag!</h2>
        <p className="text-white/70 mb-1">
          Du fick <strong className="text-amber-300">{doneToday.correct}/{doneToday.total}</strong> rätt
          och tjänade <strong className="text-amber-300">⭐ {doneToday.pointsEarned}</strong>.
        </p>
        {doneToday.perfectChest && <p className="text-emerald-300 text-sm font-bold">+ en bronskista! 🎁</p>}
        <p className="text-white/50 text-sm mt-4">Kom tillbaka imorgon för en ny utmaning!</p>
        <button onClick={() => setView('dashboard')}
          className="mt-6 px-6 py-3 rounded-2xl font-bold text-white transition-all active:scale-95 cursor-pointer"
          style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: '2px solid #d97706' }}>
          Till startsidan
        </button>
      </div>
    );
  }

  // ── Intro ───────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return heroCard(
      <div className="rounded-3xl p-8 text-center text-white" style={{ background: 'rgba(40,8,32,0.82)', backdropFilter: 'blur(20px)', border: '1px solid rgba(200,140,50,0.28)' }}>
        <div className="text-5xl mb-3">🗓️</div>
        <h2 className="text-xl font-black mb-3">Redo för dagens utmaning?</h2>
        <ul className="text-white/75 text-sm space-y-1.5 mb-6">
          <li>🧮 {DAILY_CHALLENGE_SIZE} blandade frågor för din nivå</li>
          <li>⭐ {DAILY_POINTS_PER_CORRECT} poäng per rätt svar</li>
          <li>🏆 +{DAILY_PERFECT_BONUS} bonuspoäng och en bronskista vid alla rätt</li>
          <li>☝️ Kan bara göras en gång per dag</li>
        </ul>
        <p className="text-amber-300 font-bold text-sm mb-6">Upp till ⭐ {MAX_POINTS} idag!</p>
        <button onClick={() => setPhase('play')}
          className="px-8 py-3.5 rounded-2xl font-black text-white text-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
          style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: '2px solid #d97706', boxShadow: '0 4px 16px rgba(217,119,6,0.4)' }}>
          Starta! 🚀
        </button>
      </div>
    );
  }

  // ── Resultat ────────────────────────────────────────────────────────────────
  if (phase === 'result' && result) {
    const perfect = result.correct === result.total;
    return heroCard(
      <>
        <Confetti active duration={perfect ? 4000 : 2500} />
        <div className="rounded-3xl p-8 text-center text-white" style={{ background: 'rgba(40,8,32,0.82)', backdropFilter: 'blur(20px)', border: '1px solid rgba(200,140,50,0.28)' }}>
          <div className="text-6xl mb-3">{perfect ? '🏆' : result.correct >= 3 ? '🌟' : '💪'}</div>
          <h2 className="text-2xl font-black mb-2">
            {perfect ? 'ALLA RÄTT!' : result.correct >= 3 ? 'Bra jobbat!' : 'Bra kämpat!'}
          </h2>
          <p className="text-white/75 mb-4">
            Du fick <strong className="text-amber-300">{result.correct}/{result.total}</strong> rätt
          </p>
          <div className="rounded-2xl px-4 py-3 mb-2 inline-block" style={{ background: 'rgba(255,255,255,0.10)' }}>
            <p className="text-3xl font-black text-amber-300">+{result.pointsEarned} ⭐</p>
          </div>
          {result.perfectChest && (
            <p className="text-emerald-300 font-bold mt-2">🎁 Du fick en bronskista – öppna den under Mina kistor!</p>
          )}
          <div className="flex gap-3 justify-center mt-6">
            {result.perfectChest && (
              <button onClick={() => setView('kistor')}
                className="px-5 py-3 rounded-2xl font-bold text-white transition-all active:scale-95 cursor-pointer"
                style={{ background: 'linear-gradient(135deg,#10b981,#047857)', border: '2px solid #047857' }}>
                Öppna kistan 🎁
              </button>
            )}
            <button onClick={() => setView('dashboard')}
              className="px-5 py-3 rounded-2xl font-bold text-white transition-all active:scale-95 cursor-pointer"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: '2px solid #d97706' }}>
              Till startsidan
            </button>
          </div>
        </div>
      </>
    );
  }

  // ── Spelläge ────────────────────────────────────────────────────────────────
  if (!ex) {
    // Inga frågor hittades (bör inte hända) – skicka tillbaka.
    return heroCard(
      <div className="text-center text-white/80 py-10">
        <p>Inga frågor hittades för din nivå idag.</p>
      </div>
    );
  }

  return heroCard(
    <div className="rounded-3xl p-6 text-white" style={{ background: 'rgba(40,8,32,0.82)', backdropFilter: 'blur(20px)', border: '1px solid rgba(200,140,50,0.28)' }}>
      {/* Progress */}
      <div className="flex items-center justify-between mb-2 text-sm">
        <span className="font-bold text-white/70">Fråga {index + 1} av {exercises.length}</span>
        <span className="font-bold text-amber-300">✓ {correctCount} rätt</span>
      </div>
      <div className="h-2 bg-white/15 rounded-full overflow-hidden mb-5">
        <div className="h-full rounded-full transition-all duration-300"
          style={{ width: `${((index + (answered ? 1 : 0)) / exercises.length) * 100}%`, background: 'linear-gradient(90deg,#f59e0b,#d97706)' }} />
      </div>

      {/* Fråga */}
      <h2 className="text-lg font-black mb-5">{ex.question}</h2>

      {/* Alternativ */}
      <div className="grid gap-2.5">
        {options.map((opt, i) => {
          const picked = answered?.pickedIndex === i;
          const isCorrect = i === correctIndex;
          let style: React.CSSProperties = { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)' };
          if (answered) {
            if (isCorrect) style = { background: 'rgba(16,185,129,0.25)', border: '2px solid #10b981' };
            else if (picked) style = { background: 'rgba(239,68,68,0.25)', border: '2px solid #ef4444' };
            else style = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', opacity: 0.6 };
          }
          return (
            <button key={i} onClick={() => pickAnswer(i)} disabled={!!answered}
              className="w-full text-left px-4 py-3 rounded-2xl font-bold transition-all active:scale-[0.99] cursor-pointer disabled:cursor-default"
              style={style}>
              {opt}
              {answered && isCorrect && <span className="float-right">✓</span>}
              {answered && picked && !isCorrect && <span className="float-right">✗</span>}
            </button>
          );
        })}
      </div>

      {/* Feedback + nästa */}
      {answered && (
        <div className="mt-5">
          <p className={`font-black mb-1 ${answered.correct ? 'text-emerald-300' : 'text-rose-300'}`}>
            {answered.correct ? 'Rätt! 🎉' : 'Fel svar'}
          </p>
          {ex.explanation && <p className="text-white/70 text-sm mb-3">{ex.explanation}</p>}
          <button onClick={next}
            className="w-full py-3.5 rounded-2xl font-black text-white transition-all active:scale-95 cursor-pointer"
            style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: '2px solid #d97706' }}>
            {index + 1 >= exercises.length ? 'Se resultat →' : 'Nästa fråga →'}
          </button>
        </div>
      )}
    </div>
  );
}
