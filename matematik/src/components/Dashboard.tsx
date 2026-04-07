import React, { useMemo, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import {
  LEVEL_NAMES, LEVEL_THRESHOLDS, LEVEL_COLORS, Grade, GRADE_LABELS,
} from '../types';
import { getProgress, getPoints, initPoints } from '../utils/storage';
import { TOPICS, getTopicsForGrade, gradeToNum } from '../data/topics';
import { Topic } from '../types';
import { ALL_AVATARS } from '../data/avatars';

export default function Dashboard() {
  const { currentStudent, selectTopic, setView, logout } = useApp();
  const [filterGrade, setFilterGrade] = useState<Grade | 'all'>('all');

  if (!currentStudent) return null;

  const points = getPoints(currentStudent.id) ?? initPoints(currentStudent.id);
  const progress = getProgress(currentStudent.id);
  const level = points.level;
  const levelName = LEVEL_NAMES[level];
  const currentLevelMin = LEVEL_THRESHOLDS[level] ?? 0;
  const nextLevelMin = LEVEL_THRESHOLDS[level + 1] ?? currentLevelMin;
  const levelProgress = nextLevelMin > currentLevelMin
    ? ((points.total - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100
    : 100;

  const availableTopics = useMemo(() => {
    const gradeNum = gradeToNum(currentStudent.grade);
    return TOPICS.filter(t => t.minGrade <= gradeNum + 2); // show slightly ahead too
  }, [currentStudent.grade]);

  const filteredTopics = filterGrade === 'all'
    ? availableTopics
    : availableTopics.filter(t => t.grades.includes(filterGrade));

  const completedCount = progress.filter(p => p.completed).length;
  const totalStars = progress.reduce((s, p) => s + p.stars, 0);
  const gradeNum = gradeToNum(currentStudent.grade);

  function getTopicProgress(topicId: string) {
    return progress.find(p => p.topicId === topicId);
  }

  const streakIcon = points.streak >= 7 ? '🔥🔥' : points.streak >= 3 ? '🔥' : '⚡';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${LEVEL_COLORS[level]} text-white shadow-lg`}>
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{ALL_AVATARS[currentStudent.avatar] ?? ALL_AVATARS[0]}</div>
              <div>
                <p className="font-bold text-lg">{currentStudent.name}</p>
                <p className="text-white/80 text-sm">{GRADE_LABELS[currentStudent.grade]}</p>
                {currentStudent.createdAt && <p className="text-white/60 text-xs mt-0.5">Aktiv sedan {currentStudent.createdAt.split('T')[0]}</p>}
                <p className="text-white/60 text-xs">Senast aktiv: {points.lastActiveDate || new Date().toISOString().split('T')[0]}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setView('achievements')}
                className="bg-white/20 hover:bg-white/30 rounded-xl px-3 py-1.5 text-sm font-bold transition-colors"
              >
                🏆 Märken
              </button>
              <button
                onClick={() => setView('my-results')}
                className="bg-white/20 hover:bg-white/30 rounded-xl px-3 py-1.5 text-sm font-bold transition-colors"
              >
                📊 Mina resultat
              </button>
            </div>
          </div>

          {/* Level bar */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-sm">⭐ Nivå {level}: {levelName}</span>
              <span className="text-sm text-white/80">{points.total} poäng</span>
            </div>
            <div className="h-3 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, levelProgress)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/70 mt-1">
              <span>{currentLevelMin}</span>
              <span>Nästa nivå: {nextLevelMin}</span>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-4 mt-4">
            <StatChip icon="✅" label={`${completedCount} klara`} />
            <StatChip icon="⭐" label={`${totalStars} stjärnor`} />
            <StatChip icon={streakIcon} label={`${points.streak} dagar streak`} />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Välj ett ämnesområde</h2>
          <button
            onClick={logout}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            Logga ut
          </button>
        </div>

        {/* Grade filter */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          <FilterBtn label="Alla" active={filterGrade === 'all'} onClick={() => setFilterGrade('all')} />
          {(['1','2','3','4','5','6','7','8','9','gym1','gym2','gym3'] as Grade[])
            .filter(g => gradeToNum(g) <= gradeNum + 2)
            .map(g => (
              <FilterBtn
                key={g}
                label={GRADE_LABELS[g]}
                active={filterGrade === g}
                onClick={() => setFilterGrade(g)}
              />
            ))}
        </div>

        {/* Topic grid */}
        <div className="grid gap-4">
          {filteredTopics.map(topic => {
            const tp = getTopicProgress(topic.id);
            const isNew = !tp;
            const isCompleted = tp?.completed;
            const stars = tp?.stars ?? 0;
            const isLocked = gradeToNum(topic.grades[0]) > gradeNum + 3;

            return (
              <TopicCard
                key={topic.id}
                topic={topic}
                stars={stars}
                isNew={isNew}
                isCompleted={!!isCompleted}
                isLocked={isLocked}
                bestScore={tp?.bestScore ?? 0}
                onClick={() => !isLocked && selectTopic(topic)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatChip({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="bg-white/20 rounded-xl px-3 py-1.5 text-sm font-semibold flex items-center gap-1.5">
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function FilterBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
        active
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200'
      }`}
    >
      {label}
    </button>
  );
}

function TopicCard({
  topic,
  stars,
  isNew,
  isCompleted,
  isLocked,
  bestScore,
  onClick,
}: {
  topic: Topic;
  stars: number;
  isNew: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  bestScore: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={`w-full text-left rounded-2xl p-4 transition-all ${
        isLocked
          ? 'bg-gray-100 border border-gray-200 opacity-60 cursor-not-allowed'
          : 'bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 hover:scale-[1.02] cursor-pointer active:scale-[0.98]'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-md`}>
          {isLocked ? '🔒' : topic.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-bold text-gray-800 text-lg">{topic.title}</h3>
            {isNew && !isLocked && (
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">NY</span>
            )}
            {isCompleted && (
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">✓ KLAR</span>
            )}
          </div>
          <p className="text-gray-500 text-sm mb-2">{topic.description}</p>

          {/* Grade tags */}
          <div className="flex gap-1 mb-2 flex-wrap">
            {topic.grades.map(g => (
              <span key={g} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">
                {GRADE_LABELS[g]}
              </span>
            ))}
          </div>

          {/* Stars & score */}
          {!isNew && !isLocked && (
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[0, 1, 2].map(i => (
                  <span key={i} className={`text-lg ${i < stars ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                ))}
              </div>
              <span className="text-sm text-gray-500">Bäst: {bestScore}%</span>
            </div>
          )}
          {isLocked && (
            <p className="text-gray-400 text-xs">Lås upp när du kommit längre</p>
          )}
        </div>
      </div>
    </button>
  );
}
