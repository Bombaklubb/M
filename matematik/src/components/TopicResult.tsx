import AppHeader from './AppHeader';
import React, { useEffect, useState } from 'react';
import { Topic } from '../types';
import { useApp } from '../contexts/AppContext';
import { getProgress, getPoints, initPoints } from '../utils/storage';
import { ACHIEVEMENTS } from '../data/achievements';
import { calcStars } from '../utils/storage';

export default function TopicResult({ topic }: { topic: Topic }) {
  const { currentStudent, setView, getStudentStats } = useApp();
  const [visible, setVisible] = useState(false);

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

  const scoreColor = score >= 80 ? 'text-green-600' : score >= 50 ? 'text-amber-600' : 'text-red-500';
  const grade = score >= 90 ? 'Utmärkt! 🌟' : score >= 70 ? 'Bra jobbat! 👍' : score >= 50 ? 'Godkänt! ✅' : 'Försök igen! 💪';

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col items-center justify-start pt-24 pb-10 px-4">
      <AppHeader />
      <div className={`w-full max-w-md transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Result card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-5">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">{topic.icon}</div>
            <h1 className="text-2xl font-black text-gray-800">{topic.title}</h1>
            <p className="text-gray-500">Avklarad!</p>
          </div>

          {/* Score circle */}
          <div className="flex flex-col items-center mb-6">
            <div className={`text-7xl font-black ${scoreColor} mb-1`}>{score}%</div>
            <p className="text-xl font-bold text-gray-700">{grade}</p>
            <p className="text-gray-500 text-sm mt-1">{correct} av {total} rätt</p>
          </div>

          {/* Stars */}
          <div className="flex justify-center gap-3 mb-6">
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className={`text-5xl transition-all duration-300 ${
                  i < stars ? 'animate-star-pop' : 'opacity-20'
                }`}
                style={{ animationDelay: `${i * 200}ms` }}
              >
                ⭐
              </span>
            ))}
          </div>

          {/* Points earned */}
          <div className="bg-amber-50 rounded-2xl p-4 text-center mb-4">
            <p className="text-amber-700 font-bold text-lg">🏆 Poäng totalt: {points.total}</p>
            <p className="text-amber-600 text-sm">Nivå {points.level} – {points.streak} dagars streak 🔥</p>
          </div>

          {/* New achievements */}
          {newAchievements.length > 0 && (
            <div className="bg-purple-50 rounded-2xl p-4 mb-4 animate-bounce-in">
              <p className="font-bold text-purple-800 mb-2">🎖️ Nytt märke!</p>
              {newAchievements.map((ach, i) => ach && (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-2xl">{ach.icon}</span>
                  <div>
                    <p className="font-bold text-purple-700">{ach.title}</p>
                    <p className="text-purple-600 text-xs">{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setView('topic-instruction')}
            className="bg-white border-2 border-gray-200 text-gray-700 font-bold py-4 rounded-2xl hover:bg-gray-50 transition-colors"
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
          className="w-full mt-3 bg-gray-100 text-gray-600 font-bold py-3 rounded-2xl hover:bg-gray-200 transition-colors"
        >
          📊 Se mina resultat
        </button>
      </div>
    </div>
  );
}
