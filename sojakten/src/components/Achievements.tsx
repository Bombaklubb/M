import { useApp } from '../contexts/AppContext';
import AppHeader from './AppHeader';
import { ACHIEVEMENTS } from '../data/achievements';
import { buildAchievementStats } from '../utils/storage';

const RARITY_LABEL: Record<string, string> = {
  common: 'Vanlig',
  rare: 'Ovanlig',
  epic: 'Episk',
  legendary: 'Legendar',
};

const RARITY_BADGE: Record<string, string> = {
  common: 'bg-gray-100 text-gray-600',
  rare: 'bg-blue-100 text-blue-700',
  epic: 'bg-purple-100 text-purple-700',
  legendary: 'bg-amber-100 text-amber-700',
};

export default function Achievements() {
  const { setView } = useApp();
  const stats = buildAchievementStats();
  const earned = ACHIEVEMENTS.filter(a => a.condition(stats));
  const locked = ACHIEVEMENTS.filter(a => !a.condition(stats));

  return (
    <div className="min-h-screen">
      <AppHeader
        title="Mina prestationer"
        subtitle={`${earned.length} av ${ACHIEVEMENTS.length} upplåsta`}
        onBack={() => setView('subject-select')}
      />

      <main className="max-w-2xl mx-auto p-4 sm:p-6 pb-16 space-y-6 mt-2">

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="clay-card-sm p-3 text-center">
            <p className="text-2xl font-heading font-bold text-indigo-700">{stats.completedChapters}</p>
            <p className="text-xs font-black text-gray-500 mt-0.5">KAPITEL KLARA</p>
          </div>
          <div className="clay-card-sm p-3 text-center">
            <p className="text-2xl font-heading font-bold text-green-600">{stats.totalCorrect}</p>
            <p className="text-xs font-black text-gray-500 mt-0.5">RÄTT SVAR</p>
          </div>
          <div className="clay-card-sm p-3 text-center">
            <p className="text-2xl font-heading font-bold text-amber-600">
              {stats.totalAnswered > 0 ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100) : 0}%
            </p>
            <p className="text-xs font-black text-gray-500 mt-0.5">TRÄFFSÄKERHET</p>
          </div>
        </div>

        {/* Earned */}
        {earned.length > 0 && (
          <section>
            <h2 className="font-heading font-bold text-gray-700 mb-3 text-base">Upplåsta 🏆</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {earned.map(a => (
                <div key={a.id} className="clay-card p-4 flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 bg-gradient-to-br ${a.color}`}>
                    {a.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="font-heading font-bold text-gray-800 text-sm">{a.title}</span>
                      <span className={`text-xs font-black px-1.5 py-0.5 rounded-full ${RARITY_BADGE[a.rarity]}`}>
                        {RARITY_LABEL[a.rarity]}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{a.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Locked */}
        {locked.length > 0 && (
          <section>
            <h2 className="font-heading font-bold text-gray-400 mb-3 text-base">Låsta 🔒</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {locked.map(a => (
                <div key={a.id} className="clay-card p-4 flex items-center gap-4 opacity-50">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 bg-gray-100">
                    {a.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="font-heading font-bold text-gray-600 text-sm">{a.title}</span>
                      <span className={`text-xs font-black px-1.5 py-0.5 rounded-full ${RARITY_BADGE[a.rarity]}`}>
                        {RARITY_LABEL[a.rarity]}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{a.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
