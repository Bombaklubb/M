import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { getErrorBank, clearError, ErrorEntry } from '../utils/errorBank';
import { TOPICS } from '../data/topics';
import { WORLDS, WorldId } from '../data/worlds';
import { addPoints } from '../utils/storage';
import { updateAdaptive } from '../utils/adaptive';
import { recordError } from '../utils/errorBank';
import { MultipleChoiceExercise, TrueFalseExercise } from '../types';

const BG: React.CSSProperties = {
  backgroundImage: "url('/Matematisk bakgrund med glödande symboler.png')",
  backgroundSize: 'cover', backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed',
};

export default function ErrorBankView({ worldId }: { worldId?: WorldId }) {
  const { currentStudent, setView } = useApp();
  const [activeEntry, setActiveEntry] = useState<ErrorEntry | null>(null);
  const [input, setInput] = useState('');
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  // Use a counter to force re-read of localStorage after changes
  const [version, setVersion] = useState(0);

  if (!currentStudent) return null;

  const world = worldId ? WORLDS.find(w => w.id === worldId) : null;
  const worldTopicIds = world ? world.topicIds : null;
  const backView = worldId ? (`world-${worldId}` as any) : 'dashboard';

  const allErrors = getErrorBank(currentStudent.id);
  const errors = worldTopicIds
    ? allErrors.filter(e => worldTopicIds.includes(e.topicId))
    : allErrors;

  // ── EXERCISE VIEW ──────────────────────────────────────────────────────────
  if (activeEntry) {
    const topic = TOPICS.find(t => t.id === activeEntry.topicId);
    const ex = topic?.exercises.find(e => e.id === activeEntry.exerciseId);

    function checkAnswer(ans: string) {
      if (!ex || answered) return;
      let isCorrect = false;
      if (ex.type === 'fill-in') {
        const correctStr = String((ex as any).answer).replace(',', '.');
        const acceptable = ((ex as any).acceptableAnswers ?? []).map((a: any) =>
          String(a).replace(',', '.').toLowerCase()
        );
        isCorrect =
          ans.trim().replace(',', '.').toLowerCase() === correctStr.toLowerCase() ||
          acceptable.includes(ans.trim().replace(',', '.').toLowerCase());
      } else if (ex.type === 'multiple-choice') {
        isCorrect = ans === String((ex as any).correctIndex);
      } else if (ex.type === 'true-false') {
        isCorrect = ans === String((ex as any).isTrue);
      }

      updateAdaptive(currentStudent.id, activeEntry.topicId, isCorrect, 8000);
      if (isCorrect) {
        clearError(currentStudent.id, activeEntry.id);
        addPoints(currentStudent.id, 15);
      } else {
        recordError(
          currentStudent.id, activeEntry.topicId, activeEntry.topicTitle,
          activeEntry.exerciseId, activeEntry.question,
          activeEntry.correctAnswer, ans
        );
      }
      setCorrect(isCorrect);
      setAnswered(true);
    }

    function goBack() {
      setActiveEntry(null);
      setAnswered(false);
      setCorrect(false);
      setInput('');
      setVersion(v => v + 1);
    }

    return (
      <div className="min-h-screen" style={BG}>
        <div className="bg-gradient-to-r from-red-600/90 to-rose-700/90 text-white py-4 px-4 pt-16">
          <div className="max-w-lg mx-auto">
            <button onClick={goBack} className="text-white/70 hover:text-white text-sm">
              ← Tillbaka till listan
            </button>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 py-6">
          {/* Context */}
          <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 mb-4">
            <p className="text-amber-800 text-sm font-bold">
              💡 Du svarade fel på detta {activeEntry.count} gång{activeEntry.count > 1 ? 'er' : ''}.
            </p>
            <p className="text-amber-600 text-xs mt-0.5">
              Ditt senaste felaktiga svar: <b>{activeEntry.wrongAnswers.slice(-1)[0]}</b>
            </p>
          </div>

          <div className="bg-white/95 rounded-3xl shadow-md p-6 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm bg-gradient-to-br ${topic?.color ?? 'from-gray-300 to-gray-400'}`}>
                {topic?.icon ?? '📚'}
              </div>
              <span className="text-sm font-bold text-gray-500">{topic?.title}</span>
            </div>
            <h2 className="text-xl font-black text-gray-800 mb-5">{ex?.question ?? activeEntry.question}</h2>

            {ex?.type === 'fill-in' && !answered && (
              <div className="flex gap-3">
                <input
                  type="text" inputMode="decimal" value={input} autoFocus
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && input.trim() && checkAnswer(input.trim())}
                  placeholder="Skriv ditt svar..."
                  className="flex-1 border-2 border-gray-200 rounded-2xl px-4 py-3 text-lg font-bold focus:outline-none focus:border-red-400"
                />
                <button onClick={() => input.trim() && checkAnswer(input.trim())}
                  className="bg-red-500 text-white font-bold px-5 rounded-2xl hover:bg-red-400">✓</button>
              </div>
            )}

            {ex?.type === 'multiple-choice' && !answered && (
              <div className="grid gap-3">
                {(ex as MultipleChoiceExercise).options.map((opt, i) => (
                  <button key={i} onClick={() => checkAnswer(String(i))}
                    className="text-left px-5 py-3 rounded-2xl font-semibold border-2 border-gray-200 hover:border-red-400 hover:bg-red-50 transition-all">
                    <span className="text-gray-400 font-bold mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
                  </button>
                ))}
              </div>
            )}

            {ex?.type === 'true-false' && !answered && (
              <div className="grid grid-cols-2 gap-4">
                {[true, false].map(val => (
                  <button key={String(val)} onClick={() => checkAnswer(String(val))}
                    className="py-5 rounded-2xl font-black text-xl border-2 border-gray-200 hover:border-red-400 hover:bg-red-50 transition-all">
                    {val ? '👍 Sant' : '👎 Falskt'}
                  </button>
                ))}
              </div>
            )}

            {answered && (
              <div className={`rounded-2xl p-4 mt-3 ${correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <p className={`font-black text-lg mb-1 ${correct ? 'text-green-700' : 'text-red-700'}`}>
                  {correct ? '🎉 Rätt! Uppgiften är borta!' : '❌ Inte riktigt — uppgiften finns kvar.'}
                </p>
                {ex && (ex as any).explanation && (
                  <p className={`text-sm ${correct ? 'text-green-600' : 'text-red-600'}`}>{(ex as any).explanation}</p>
                )}
                {!correct && (
                  <p className="text-red-600 text-sm mt-1">
                    Rätt svar: <b>{activeEntry.correctAnswer}</b>
                  </p>
                )}
              </div>
            )}
          </div>

          {answered && (
            <button onClick={goBack}
              className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white font-black py-4 rounded-2xl text-lg hover:scale-[1.02] transition-all">
              ← Tillbaka till listan
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── LIST VIEW ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={BG}>
      <div className="bg-gradient-to-r from-red-600/90 to-rose-700/90 text-white py-6 px-4 pt-16">
        <div className="max-w-lg mx-auto">
          <button onClick={() => setView(backView)} className="text-white/70 hover:text-white text-sm mb-3 block">
            ← {world ? world.name : 'Tillbaka'}
          </button>
          <h1 className="text-2xl font-black">🔁 Försök igen</h1>
          <p className="text-white/80 mt-1 text-sm">
            {errors.length === 0
              ? 'Inga felsvar registrerade ännu!'
              : `${errors.length} uppgifter att öva på${world ? ` i ${world.name}` : ''}`}
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5">
        {errors.length === 0 ? (
          <div className="bg-white/90 rounded-2xl p-8 text-center shadow-sm">
            <div className="text-5xl mb-3">🎉</div>
            <p className="font-bold text-gray-700 text-lg">Inga felsvar här!</p>
            <p className="text-gray-400 text-sm mt-1">Svara fel på uppgifter i kapitlena — de hamnar här.</p>
            <button onClick={() => setView(backView)}
              className="mt-4 bg-rose-500 text-white font-bold py-2 px-6 rounded-xl hover:bg-rose-400 transition-colors">
              ← Tillbaka
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-white font-bold text-sm uppercase tracking-widest mb-3">
              Klicka på en uppgift för att öva
            </h2>
            <div className="space-y-3">
              {errors.map(entry => {
                const topic = TOPICS.find(t => t.id === entry.topicId);
                const hasExercise = !!topic?.exercises.find(e => e.id === entry.exerciseId);
                return (
                  <button
                    key={entry.id}
                    disabled={!hasExercise}
                    onClick={() => { setActiveEntry(entry); setAnswered(false); setCorrect(false); setInput(''); }}
                    className="w-full bg-white/90 rounded-2xl p-4 shadow-sm text-left hover:scale-[1.02] hover:bg-white active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 bg-gradient-to-br ${topic?.color ?? 'from-gray-300 to-gray-400'} shadow-sm`}>
                        {topic?.icon ?? '📚'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-gray-800 text-sm">{topic?.title ?? entry.topicTitle}</p>
                          <span className="bg-red-100 text-red-600 text-xs font-black px-2 py-0.5 rounded-full ml-2 flex-shrink-0">
                            ×{entry.count}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mt-0.5 line-clamp-1">{entry.question}</p>
                        <div className="flex gap-2 mt-1 text-xs">
                          <span className="text-red-500">Ditt svar: <b>{entry.wrongAnswers.slice(-1)[0]}</b></span>
                          <span className="text-green-600">Rätt: <b>{entry.correctAnswer}</b></span>
                        </div>
                      </div>
                      <span className="text-gray-300 text-lg self-center ml-1">›</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
