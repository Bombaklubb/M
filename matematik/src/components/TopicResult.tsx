import AppHeader from './AppHeader';
import React, { useEffect, useState } from 'react';
import { Topic } from '../types';
import { useApp } from '../contexts/AppContext';
import { getProgress, getPoints, initPoints } from '../utils/storage';
import { ACHIEVEMENTS } from '../data/achievements';
import { calcStars } from '../utils/storage';
import { CHEST_META } from '../utils/chestStorage';
import { NumberTicker } from './magicui/number-ticker';
import { Confetti } from './magicui/confetti';
import { SparklesText } from './magicui/sparkles-text';

// ─── Mystery Box Popup (inline) ───────────────────────────────────────────────
function MysteryPopup({ description, onClose }: { description: string; onClose: () => void }) {
  const [opened, setOpened] = useState(false);
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div
        className="rounded-3xl p-8 max-w-sm w-full text-center"
        style={{
          background: 'linear-gradient(135deg, #1a0a2e, #0d0d2b)',
          border: '3px solid #a855f7',
          boxShadow: '0 8px 40px rgba(168,85,247,0.35)',
        }}
      >
        {!opened ? (
          <>
            <div className="text-7xl mb-4 animate-bounce" style={{ animationDuration: '1s' }}>🎁</div>
            <h2 className="text-2xl font-black text-purple-400 mb-2">Mysterylåda!</h2>
            <p className="text-white/60 mb-6 text-sm">Du hittade en mysterylåda! Klicka för att öppna.</p>
            <button
              onClick={() => setOpened(true)}
              className="w-full py-3 rounded-2xl font-bold text-white text-lg cursor-pointer active:scale-95 transition-all"
              style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)', border: '3px solid #7c3aed' }}
            >
              Öppna lådan!
            </button>
          </>
        ) : (
          <>
            <div className="text-7xl mb-4">⭐</div>
            <h2 className="text-2xl font-black text-purple-400 mb-2">Du vann!</h2>
            <p className="text-lg font-bold text-white/90 mb-6">{description}</p>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl font-bold text-white cursor-pointer active:scale-95 transition-all"
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', border: '3px solid #16a34a' }}
            >
              Häftigt! Fortsätt →
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function TopicResult({ topic }: { topic: Topic }) {
  const { currentStudent, setView, getStudentStats, pendingChestResult, clearPendingChestResult } = useApp();
  const [visible, setVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMystery, setShowMystery] = useState(
    !!pendingChestResult?.mysteryReward
  );

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  if (!currentStudent) return null;

  const progress = getProgress(currentStudent.id);
  const tp = progress.find(p => p.topicId === topic.id);
  const points = getPoints(currentStudent.id) ?? initPoints(currentStudent.id);
  const stats = getStudentStats(currentStudent);

  const correct = tp?.correctAnswers ?? 0;
  const total = tp?.totalQuestions ?? topic.exercises.length;
  const score = total > 0 ? Math.round((correct / total) * 100) : 0;
  const stars = calcStars(score);

  const newAchievements = stats.achievements
    .slice(-3)
    .map(ea => ACHIEVEMENTS.find(a => a.id === ea.achievementId))
    .filter(Boolean);

  const scoreColor = score >= 80 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-rose-400';
  const grade = score >= 90 ? 'Utmärkt!' : score >= 70 ? 'Bra jobbat!' : score >= 50 ? 'Godkänt!' : 'Försök igen!';
  const gradeEmoji = score >= 90 ? '🌟' : score >= 70 ? '👍' : score >= 50 ? '✅' : '💪';

  // Starta confetti när visible=true och score är bra
  useEffect(() => {
    if (visible && score >= 70) {
      setTimeout(() => setShowConfetti(true), 300);
    }
  }, [visible, score]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-24 pb-10 px-4" style={{ background: 'linear-gradient(135deg, #07071a 0%, #0d0d2b 50%, #1a0a2e 100%)' }}>
      <Confetti active={showConfetti} duration={3000} />
      <AppHeader />
      <div className={`w-full max-w-md transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Result card */}
        <div className="bg-white/8 backdrop-blur-md border border-white/15 rounded-3xl p-8 mb-5">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-3 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">{topic.icon}</div>
            <h1 className="text-2xl font-black text-white">{topic.title}</h1>
            <p className="text-white/50">Avklarad!</p>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center mb-6">
            <div className={`text-7xl font-black ${scoreColor} mb-1 tabular-nums`}>
              <NumberTicker value={score} delay={0.3} className={scoreColor} />%
            </div>
            <SparklesText
              className="text-xl font-bold text-white/80"
              sparkleCount={score >= 70 ? 6 : 0}
            >
              {grade} {gradeEmoji}
            </SparklesText>
            <p className="text-white/50 text-sm mt-1">{correct} av {total} rätt</p>
          </div>

          {/* Stars */}
          <div className="flex justify-center gap-4 mb-6">
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className={`text-5xl transition-all duration-500 ${
                  i < stars
                    ? 'animate-star-pop drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]'
                    : 'opacity-15 grayscale'
                }`}
                style={{ animationDelay: `${i * 250 + 500}ms` }}
              >
                ⭐
              </span>
            ))}
          </div>

          {/* Points earned */}
          <div className="bg-amber-500/20 border border-amber-400/40 rounded-2xl p-4 text-center mb-4">
            <p className="text-amber-300 font-bold text-lg">
              🏆 Poäng totalt: <NumberTicker value={points.total} delay={0.8} className="text-amber-300 font-bold" />
            </p>
            <p className="text-amber-400 text-sm">Nivå {points.level} – {points.streak} dagars streak 🔥</p>
          </div>

          {/* New achievements */}
          {newAchievements.length > 0 && (
            <div className="bg-purple-500/20 border border-purple-400/40 rounded-2xl p-4 mb-4 animate-bounce-in">
              <p className="font-bold text-purple-300 mb-2">🎖️ Nytt märke!</p>
              {newAchievements.map((ach, i) => ach && (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-2xl">{ach.icon}</span>
                  <div>
                    <p className="font-bold text-purple-300">{ach.title}</p>
                    <p className="text-purple-400 text-xs">{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* New chests earned */}
          {pendingChestResult && pendingChestResult.newChests.length > 0 && (
            <div
              className="rounded-2xl p-4 mb-4"
              style={{
                background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.1))',
                border: '2px solid rgba(245,158,11,0.4)',
              }}
            >
              <p className="font-bold text-amber-300 mb-2">
                🎁 {pendingChestResult.newChests.length === 1 ? 'Ny kista intjänad!' : `${pendingChestResult.newChests.length} nya kistor intjänade!`}
              </p>
              <div className="flex flex-wrap gap-2">
                {pendingChestResult.newChests.map((chest, i) => (
                  <span key={i} className="text-2xl">{CHEST_META[chest.type].emoji}</span>
                ))}
              </div>
              <button
                onClick={() => setView('kistor')}
                className="mt-2 text-xs text-amber-400 underline cursor-pointer hover:text-amber-300 transition-colors"
              >
                Öppna mina kistor →
              </button>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setView('topic-instruction')}
            className="bg-white/8 backdrop-blur-md border border-white/15 text-white font-bold py-4 rounded-2xl hover:bg-white/15 transition-colors"
          >
            🔄 Försök igen
          </button>
          <button
            onClick={() => setView('dashboard')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 rounded-2xl hover:shadow-lg hover:scale-105 transition-all"
          >
            📚 Fler ämnen
          </button>
        </div>
        <button
          onClick={() => setView('my-results')}
          className="w-full mt-3 bg-white/8 border border-white/15 text-white/70 font-bold py-3 rounded-2xl hover:bg-white/15 transition-colors"
        >
          📊 Se mina resultat
        </button>
      </div>

      {/* Mystery box popup */}
      {showMystery && pendingChestResult?.mysteryReward && (
        <MysteryPopup
          description={pendingChestResult.mysteryReward.description}
          onClose={() => {
            setShowMystery(false);
            clearPendingChestResult();
          }}
        />
      )}
    </div>
  );
}
