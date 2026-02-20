import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { WORLDS, WorldId } from '../data/worlds';
import { QUESTS, Quest, getQuestsForWorld } from '../data/quests';
import { getQuestProgress, saveQuestProgress, unlockCollectible } from '../utils/questStorage';
import { addPoints } from '../utils/storage';
import { COLLECTION_ITEMS } from '../data/collection';
import { gradeToWorld } from '../data/worlds';
import { gradeToNum } from '../data/topics';

type Phase = 'list' | 'intro' | 'step' | 'result';

export default function QuestView({ hideHeader }: { hideHeader?: boolean }) {
  const { currentStudent, setView } = useApp();
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [phase, setPhase] = useState<Phase>('list');
  const [stepIdx, setStepIdx] = useState(0);
  const [input, setInput] = useState('');
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [newItem, setNewItem] = useState<string | null>(null);

  if (!currentStudent) return null;

  const gradeNum = gradeToNum(currentStudent.grade);
  const worldId = gradeToWorld(currentStudent.grade);
  const world = WORLDS.find(w => w.id === worldId)!;
  const quests = getQuestsForWorld(worldId);
  const questProgress = getQuestProgress(currentStudent.id);

  function startQuest(quest: Quest) {
    setSelectedQuest(quest);
    setPhase('intro');
    setStepIdx(0);
    setCorrectCount(0);
    setInput('');
    setAnswered(false);
    setNewItem(null);
  }

  function beginSteps() {
    setPhase('step');
    setAnswered(false);
    setInput('');
  }

  function checkAnswer(ans: string) {
    if (!selectedQuest) return;
    const step = selectedQuest.steps[stepIdx];
    let isCorrect = false;
    if (step.type === 'fill-in') {
      const correct_str = String(step.answer ?? '').replace(',', '.');
      const acceptable = (step.acceptableAnswers ?? []).map(a => String(a).replace(',', '.').toLowerCase());
      isCorrect = ans.trim().replace(',', '.').toLowerCase() === correct_str.toLowerCase()
        || acceptable.includes(ans.trim().replace(',', '.').toLowerCase());
    } else if (step.type === 'multiple-choice') {
      isCorrect = ans === String(step.correctIndex);
    } else if (step.type === 'true-false') {
      isCorrect = ans === String(step.isTrue);
    }
    setAnswered(true);
    setCorrect(isCorrect);
    if (isCorrect) setCorrectCount(c => c + 1);
  }

  function nextStep() {
    if (!selectedQuest) return;
    if (stepIdx < selectedQuest.steps.length - 1) {
      setStepIdx(i => i + 1);
      setAnswered(false);
      setInput('');
    } else {
      // Quest complete – belöning KRÄVER alla rätt
      const allCorrect = correctCount === selectedQuest.steps.length;
      const pts = correctCount * 20 + (allCorrect ? 100 : 0);
      addPoints(currentStudent.id, pts);
      saveQuestProgress(currentStudent.id, selectedQuest.id, selectedQuest.steps.length, true, correctCount);
      if (allCorrect) {
        const item = COLLECTION_ITEMS.find(c => c.id === selectedQuest.rewardItem);
        if (item) {
          unlockCollectible(currentStudent.id, item.id);
          setNewItem(item.id);
        }
      }
      setPhase('result');
    }
  }

  // ---- LIST ----
  if (phase === 'list') return (
    <div className="min-h-screen bg-gray-50">
      <div className={`bg-gradient-to-r ${world.bg} text-white py-6 px-4`}>
        <div className="max-w-lg mx-auto">
          {!hideHeader && <button onClick={() => setView('dashboard')} className="text-white/70 hover:text-white text-sm mb-3 block">← Tillbaka</button>}
          <h1 className="text-2xl font-black">⚔️ Äventyr</h1>
          <p className="text-white/80 text-sm mt-1">Lös berättelseproblem och vinn belöningar!</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">
        {quests.map(quest => {
          const progress = questProgress.find(p => p.questId === quest.id);
          const done = progress?.completed;
          return (
            <button key={quest.id} onClick={() => startQuest(quest)}
              className="w-full bg-white rounded-2xl p-5 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all text-left">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${quest.storyColor} flex items-center justify-center text-3xl flex-shrink-0 shadow-md`}>
                  {quest.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-black text-gray-800">{quest.title}</h2>
                    {done && <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0">✓ Klar</span>}
                  </div>
                  <p className="text-gray-500 text-sm">{quest.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-400">{quest.steps.length} steg</span>
                    <span className="text-xs font-bold text-amber-600">🏆 Belöning: {quest.rewardEmoji}</span>
                    {progress && !done && (
                      <span className="text-xs text-blue-500">{progress.stepsCompleted}/{quest.steps.length} klar</span>
                    )}
                  </div>
                </div>
                <span className="text-gray-300 text-xl flex-shrink-0 mt-1">→</span>
              </div>
            </button>
          );
        })}

        {quests.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <p className="text-4xl mb-2">🔒</p>
            <p>Inga äventyr tillgängliga för din nivå ännu.</p>
          </div>
        )}
      </div>
    </div>
  );

  if (!selectedQuest) return null;
  const currentStep = selectedQuest.steps[stepIdx];

  // ---- INTRO ----
  if (phase === 'intro') return (
    <div className="min-h-screen flex flex-col" style={{ background: `linear-gradient(135deg, #0f2027, #1a1a2e)` }}>
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-8xl mb-5 animate-bounce">{selectedQuest.emoji}</div>
        <h1 className="text-3xl font-black text-white mb-3">{selectedQuest.title}</h1>
        <p className="text-gray-300 text-lg max-w-sm mb-8 leading-relaxed">{selectedQuest.description}</p>

        <div className="bg-white/10 rounded-2xl p-5 mb-8 max-w-sm w-full">
          <p className="text-white/70 text-sm font-bold mb-2 uppercase tracking-wide">🎁 Din belöning</p>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{selectedQuest.rewardEmoji}</span>
            <div className="text-left">
              <p className="text-white font-bold">{COLLECTION_ITEMS.find(i => i.id === selectedQuest.rewardItem)?.name ?? 'Samlarobjekt'}</p>
              <p className="text-white/60 text-xs">Alla {selectedQuest.steps.length} svar måste vara rätt!</p>
            </div>
          </div>
        </div>

        <button onClick={beginSteps}
          className={`w-full max-w-sm bg-gradient-to-r ${selectedQuest.storyColor} text-white font-black py-5 rounded-2xl text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all`}>
          🚀 Starta äventyret!
        </button>
        <button onClick={() => setPhase('list')} className="text-gray-400 text-sm mt-4 hover:text-gray-200">← Tillbaka</button>
      </div>
    </div>
  );

  // ---- STEP ----
  if (phase === 'step') return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${selectedQuest.storyColor} text-white py-4 px-4`}>
        <div className="max-w-lg mx-auto">
          <div className="flex justify-between items-center">
            <button onClick={() => setPhase('list')} className="text-white/70 hover:text-white text-sm">✕</button>
            <span className="font-bold">{selectedQuest.title}</span>
            <span className="font-bold text-sm">{stepIdx + 1}/{selectedQuest.steps.length}</span>
          </div>
          <div className="h-2 bg-white/30 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all"
              style={{ width: `${(stepIdx / selectedQuest.steps.length) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Narrative */}
        <div className={`bg-gradient-to-r ${selectedQuest.storyColor} rounded-2xl p-5 mb-5 text-white`}>
          <p className="text-sm font-bold opacity-80 mb-1">📖 Berättelsen</p>
          <p className="font-semibold leading-relaxed">{currentStep.narrative}</p>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-3xl shadow-md p-6 mb-4">
          <h2 className="text-xl font-black text-gray-800 mb-5">{currentStep.question}</h2>

          {currentStep.type === 'fill-in' && !answered && (
            <div className="flex gap-3">
              <input type="text" inputMode="decimal" value={input} autoFocus
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && input.trim() && checkAnswer(input.trim())}
                placeholder="Ditt svar..."
                className="flex-1 border-2 border-gray-200 rounded-2xl px-4 py-3 text-lg font-bold focus:outline-none focus:border-purple-400" />
              <button onClick={() => input.trim() && checkAnswer(input.trim())}
                className="bg-purple-500 text-white font-bold px-5 rounded-2xl hover:bg-purple-400">✓</button>
            </div>
          )}

          {currentStep.type === 'multiple-choice' && !answered && (
            <div className="grid gap-3">
              {(currentStep.options ?? []).map((opt, i) => (
                <button key={i} onClick={() => checkAnswer(String(i))}
                  className="text-left px-5 py-3 rounded-2xl font-semibold border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all">
                  <span className="text-gray-400 font-bold mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
                </button>
              ))}
            </div>
          )}

          {currentStep.type === 'true-false' && !answered && (
            <div className="grid grid-cols-2 gap-4">
              {[true, false].map(val => (
                <button key={String(val)} onClick={() => checkAnswer(String(val))}
                  className="py-5 rounded-2xl font-black text-xl border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all">
                  {val ? '👍 Sant' : '👎 Falskt'}
                </button>
              ))}
            </div>
          )}

          {answered && (
            <div className={`rounded-2xl p-4 mt-3 ${correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={`font-black text-lg mb-1 ${correct ? 'text-green-700' : 'text-red-700'}`}>
                {correct ? `${currentStep.rewardEmoji} Rätt!` : '❌ Inte riktigt...'}
              </p>
              <p className={`text-sm ${correct ? 'text-green-600' : 'text-red-600'}`}>{currentStep.explanation}</p>
            </div>
          )}
        </div>

        {answered && (
          <button onClick={nextStep}
            className={`w-full bg-gradient-to-r ${selectedQuest.storyColor} text-white font-black py-4 rounded-2xl text-lg hover:scale-[1.02] transition-all`}>
            {stepIdx < selectedQuest.steps.length - 1 ? 'Nästa del av äventyret →' : '🏆 Avsluta äventyret!'}
          </button>
        )}
      </div>
    </div>
  );

  // ---- RESULT ----
  const item = COLLECTION_ITEMS.find(i => i.id === selectedQuest.rewardItem);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: 'linear-gradient(135deg, #0f2027, #1a1a2e)' }}>
      <div className="w-full max-w-sm text-center">
        <div className="text-8xl mb-4 animate-bounce">{selectedQuest.emoji}</div>
        <h1 className="text-4xl font-black text-white mb-2">Äventyret klart!</h1>
        <p className="text-gray-300 mb-6">{correctCount}/{selectedQuest.steps.length} rätt svar</p>

        {/* Score */}
        <div className="bg-white/10 rounded-2xl p-5 mb-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-500/20 rounded-xl p-3">
              <p className="text-2xl font-black text-green-400">{correctCount}</p>
              <p className="text-green-300 text-xs">Rätt svar</p>
            </div>
            <div className="bg-amber-500/20 rounded-xl p-3">
              <p className="text-2xl font-black text-amber-400">+{correctCount * 20 + 50}</p>
              <p className="text-amber-300 text-xs">Poäng</p>
            </div>
          </div>
        </div>

        {/* Reward */}
        {newItem && item ? (
          <div className="bg-white/10 border-2 border-amber-400/40 rounded-2xl p-5 mb-6">
            <p className="text-amber-300 text-xs font-bold uppercase tracking-widest mb-3">🎁 Belöning upplåst!</p>
            <div className="text-6xl mb-2">{item.emoji}</div>
            <p className="text-white font-black text-xl">{item.name}</p>
            <p className="text-white/60 text-sm mt-1">{item.description}</p>
          </div>
        ) : !newItem && item ? (
          <div className="bg-red-900/30 border-2 border-red-400/40 rounded-2xl p-5 mb-6">
            <p className="text-red-300 text-xs font-bold uppercase tracking-widest mb-2">❌ Belöningen missades</p>
            <div className="text-4xl mb-2 opacity-40">{item.emoji}</div>
            <p className="text-white/60 text-sm">Du behöver alla rätt för att låsa upp <strong>{item.name}</strong>. Försök igen!</p>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => startQuest(selectedQuest)}
            className={`bg-gradient-to-r ${selectedQuest.storyColor} text-white font-black py-3 rounded-2xl`}>
            🔄 Igen
          </button>
          <button onClick={() => { setPhase('list'); setSelectedQuest(null); }}
            className="bg-white/10 text-white font-bold py-3 rounded-2xl hover:bg-white/20 transition-colors">
            📜 Äventyr
          </button>
        </div>
        <button onClick={() => setView('collection')}
          className="w-full mt-3 text-amber-400 text-sm font-bold hover:text-amber-300">
          🏅 Se min samling →
        </button>
      </div>
    </div>
  );
}
