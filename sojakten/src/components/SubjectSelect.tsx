import { useApp } from '../contexts/AppContext';
import { SUBJECTS, getChaptersForSubject } from '../data/subjects';
import { getProgress } from '../utils/storage';
import { Trophy } from 'lucide-react';

export default function SubjectSelect() {
  const { selectSubject, setView } = useApp();

  function getSubjectStats(subjectId: typeof SUBJECTS[number]['id']) {
    const chapters = getChaptersForSubject(subjectId);
    const progress = getProgress();
    const done = chapters.filter(c => progress.some(p => p.chapterId === c.id && p.completed)).length;
    return { done, total: chapters.length };
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="header-bar px-4 py-4 flex items-center justify-between">
        <div className="w-10" />
        <div className="text-center">
          <h1 className="font-heading font-bold text-2xl text-indigo-700">🗺️ SO-jakten</h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">Puls SO · Åk 5</p>
        </div>
        <button
          onClick={() => setView('achievements')}
          className="w-10 h-10 rounded-xl bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center hover:bg-indigo-100 active:scale-95 transition-all cursor-pointer"
          aria-label="Prestationer"
        >
          <Trophy size={18} className="text-indigo-600" />
        </button>
      </header>

      <main className="max-w-2xl mx-auto p-4 sm:p-6 pb-16">
        <p className="text-center text-gray-600 font-semibold my-5">Välj ett ämne att öva på</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SUBJECTS.map(subject => {
            const { done, total } = getSubjectStats(subject.id);
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;

            return (
              <button
                key={subject.id}
                onClick={() => selectSubject(subject)}
                className={`${subject.cardClass} p-5 text-left transition-all hover:scale-[1.02] active:scale-[0.98] active:translate-y-1 cursor-pointer`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">{subject.emoji}</span>
                  <div>
                    <p className="font-heading font-bold text-lg text-gray-800">{subject.name}</p>
                    <p className="text-xs font-semibold text-gray-500">{total} kapitel</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-gray-600">{done}/{total} klara</span>
                    {done === total && total > 0 && <span className="text-xs font-black text-green-700">✓ Klar!</span>}
                  </div>
                  <div className="h-2.5 rounded-full bg-black/10 overflow-hidden">
                    <div className="h-full rounded-full bg-white/70 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
