import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../contexts/AppContext';
import { TOPICS, gradeToNum } from '../data/topics';
import { FillInExercise, MultipleChoiceExercise, TrueFalseExercise } from '../types';
import { addPoints, recordTopicSession } from '../utils/storage';
import { updateAdaptive } from '../utils/adaptive';
import { recordError } from '../utils/errorBank';
import { gradeToWorld, WORLDS } from '../data/worlds';

const DURATIONS = [60, 120] as const;

export default function QuickDrill() {
  const { currentStudent, setView } = useApp();
  const [duration, setDuration] = useState<60|120>(60);
  const [phase, setPhase] = useState<'setup'|'drill'|'result'>('setup');
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentEx, setCurrentEx] = useState<any>(null);
  const [input, setInput] = useState('');
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [flash, setFlash] = useState<'correct'|'wrong'|null>(null);
  const [personalBest, setPersonalBest] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef(0);
  if (!currentStudent) return null;

  const gradeNum = gradeToNum(currentStudent.grade);
  const worldId = gradeToWorld(currentStudent.grade);
  const world = WORLDS.find(w => w.id === worldId)!;

  // Build exercise pool from student's accessible topics
  const pool = TOPICS
    .filter(t => t.minGrade <= gradeNum + 2)
    .flatMap(t => t.exercises.map(e => ({ ...e, topicId: t.id, topicTitle: t.title })));

  function pickRandom() {
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function startDrill() {
    setTimeLeft(duration);
    setCorrect(0);
    setTotal(0);
    setPhase('drill');
    setCurrentEx(pickRandom());
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setPhase('result');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function stopDrill() {
    clearInterval(timerRef.current!);
    setPhase('result');
  }

  function handleAnswer(answer: string) {
    if (!currentEx) return;
    const elapsed = Date.now() - startTimeRef.current;
    let isCorrect = false;

    if (currentEx.type === 'fill-in') {
      const ex = currentEx as FillInExercise & { topicId: string; topicTitle: string };
      const correct_ans = String(ex.answer).replace(',','.');
      const acceptable = (ex.acceptableAnswers ?? []).map((a: any) => String(a).replace(',','.').toLowerCase());
      isCorrect = answer.trim().replace(',','.').toLowerCase() === correct_ans.toLowerCase()
        || acceptable.includes(answer.trim().replace(',','.').toLowerCase());
    } else if (currentEx.type === 'multiple-choice') {
      isCorrect = answer === String((currentEx as MultipleChoiceExercise).correctIndex);
    } else if (currentEx.type === 'true-false') {
      isCorrect = answer === String((currentEx as TrueFalseExercise).isTrue);
    }

    // Update adaptive state
    updateAdaptive(currentStudent.id, currentEx.topicId, isCorrect, elapsed);

    // Record error if wrong
    if (!isCorrect) {
      recordError(currentStudent.id, currentEx.topicId, currentEx.topicTitle,
        currentEx.id, currentEx.question, String(currentEx.answer ?? currentEx.correctIndex), answer);
    }

    setFlash(isCorrect ? 'correct' : 'wrong');
    setTimeout(() => setFlash(null), 350);
    setCorrect(c => c + (isCorrect ? 1 : 0));
    setTotal(t => t + 1);
    setInput('');
    setCurrentEx(pickRandom());
    startTimeRef.current = Date.now();
    inputRef.current?.focus();
  }

  // Award points on finish
  useEffect(() => {
    if (phase === 'result' && total > 0) {
      addPoints(currentStudent.id, correct * 5);
      const pb = parseInt(localStorage.getItem(`drill_pb_${currentStudent.id}`) || '0');
      if (correct > pb) {
        localStorage.setItem(`drill_pb_${currentStudent.id}`, String(correct));
        setPersonalBest(correct);
      } else {
        setPersonalBest(pb);
      }
    }
  }, [phase]);

  useEffect(() => () => { clearInterval(timerRef.current!); }, []);

  const accuracy = total > 0 ? Math.round((correct/total)*100) : 0;
  const pct = timeLeft / duration;
  const timerColor = pct > 0.5 ? '#22c55e' : pct > 0.25 ? '#f59e0b' : '#ef4444';

  // ---- SETUP ----
  if (phase === 'setup') return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{background:`linear-gradient(135deg, ${world.accentHex}22, #0f2027)`}}>
      <button onClick={()=>setView('dashboard')} className="text-gray-400 hover:text-gray-200 text-sm mb-6 self-start ml-4">← Tillbaka</button>
      <div className="text-center mb-8">
        <div className="text-7xl mb-3">⚡</div>
        <h1 className="text-4xl font-black text-white">Snabbträning!</h1>
        <p className="text-gray-300 mt-2">Svara på så många uppgifter som möjligt</p>
        <p className="text-gray-400 text-sm mt-1">Mängdträning – öva på allt du lärt dig</p>
      </div>

      <div className="bg-white rounded-3xl p-7 w-full max-w-sm shadow-2xl">
        <h2 className="font-black text-gray-800 text-lg mb-4 text-center">Välj tid</h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {DURATIONS.map(d => (
            <button key={d} onClick={()=>setDuration(d)}
              className={`py-5 rounded-2xl font-black text-2xl transition-all ${
                duration===d ? 'bg-amber-500 text-white scale-105 shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-amber-100'
              }`}>
              {d}s
              <p className="text-xs font-bold mt-0.5 opacity-70">{d===60?'1 minut':'2 minuter'}</p>
            </button>
          ))}
        </div>
        <div className="bg-blue-50 rounded-2xl p-3 mb-5 text-sm text-blue-700">
          <p className="font-bold mb-1">🎯 Hur det funkar:</p>
          <p>• Svara snabbt och rätt = mer poäng</p>
          <p>• Appen anpassar svårighetsgraden</p>
          <p>• Fel sparas i din felbank</p>
        </div>
        <button onClick={startDrill}
          className="w-full text-white font-black py-4 rounded-2xl text-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
          style={{background:'linear-gradient(135deg,#f59e0b,#ef4444)'}}>
          ⚡ Starta!
        </button>
      </div>
    </div>
  );

  // ---- DRILL ----
  if (phase === 'drill' && currentEx) return (
    <div className={`min-h-screen flex flex-col transition-colors duration-150 ${
      flash==='correct' ? 'bg-green-50' : flash==='wrong' ? 'bg-red-50' : 'bg-gray-50'
    }`}>
      {/* Timer bar */}
      <div className="bg-white shadow-sm px-4 pt-3 pb-2">
        <div className="max-w-lg mx-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="font-black text-2xl" style={{color:timerColor}}>{timeLeft}s</span>
            <div className="flex gap-4 text-sm font-bold">
              <span className="text-green-600">✓ {correct}</span>
              <span className="text-gray-400">Total: {total}</span>
              {total > 0 && <span className="text-blue-600">{accuracy}%</span>}
            </div>
            <button onClick={stopDrill} className="text-gray-400 hover:text-gray-600 text-sm">Avsluta</button>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000"
              style={{width:`${pct*100}%`, background:timerColor}}/>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full px-4 py-6">
        <div className="bg-white rounded-3xl shadow-md p-6 mb-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
            {currentEx.type==='multiple-choice'?'🔘 Flerval':currentEx.type==='true-false'?'✅ Sant/Falskt':'✏️ Skriv svar'}
          </p>
          <h2 className="text-2xl font-black text-gray-800 leading-snug">{currentEx.question}</h2>
        </div>

        {currentEx.type==='fill-in' && (
          <div className="flex gap-3">
            <input ref={inputRef} type="text" inputMode="decimal" value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&input.trim()&&handleAnswer(input.trim())}
              placeholder="Ditt svar..." autoFocus
              className="flex-1 border-2 border-gray-200 rounded-2xl px-4 py-4 text-xl font-bold focus:outline-none focus:border-amber-400 transition-colors"/>
            <button onClick={()=>input.trim()&&handleAnswer(input.trim())}
              className="bg-amber-500 text-white font-black px-6 rounded-2xl text-xl hover:bg-amber-400 transition-colors">
              ✓
            </button>
          </div>
        )}

        {currentEx.type==='multiple-choice' && (
          <div className="grid gap-2">
            {(currentEx as MultipleChoiceExercise).options.map((opt: string, i: number) => (
              <button key={i} onClick={()=>handleAnswer(String(i))}
                className="w-full bg-white text-left px-5 py-3.5 rounded-2xl font-bold text-base border-2 border-gray-200 hover:border-amber-400 hover:bg-amber-50 transition-all active:scale-[0.98]">
                <span className="text-gray-400 font-bold mr-2">{String.fromCharCode(65+i)}.</span>{opt}
              </button>
            ))}
          </div>
        )}

        {currentEx.type==='true-false' && (
          <div className="grid grid-cols-2 gap-4">
            {[true,false].map(val=>(
              <button key={String(val)} onClick={()=>handleAnswer(String(val))}
                className="py-6 rounded-2xl font-black text-2xl bg-white border-2 border-gray-200 hover:border-amber-400 hover:bg-amber-50 transition-all active:scale-[0.98]">
                {val?'👍 Sant':'👎 Falskt'}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ---- RESULT ----
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-amber-50 to-white">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center mb-5">
          <div className="text-6xl mb-3">🏁</div>
          <h1 className="text-3xl font-black text-gray-800 mb-1">Klart!</h1>
          <p className="text-gray-500">{duration} sekunders snabbträning</p>

          <div className="grid grid-cols-2 gap-3 my-6">
            <div className="bg-green-50 rounded-2xl p-4">
              <p className="text-3xl font-black text-green-600">{correct}</p>
              <p className="text-sm text-green-700 font-bold">Rätt svar</p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-4">
              <p className="text-3xl font-black text-blue-600">{accuracy}%</p>
              <p className="text-sm text-blue-700 font-bold">Träffsäkerhet</p>
            </div>
            <div className="bg-purple-50 rounded-2xl p-4">
              <p className="text-3xl font-black text-purple-600">{total}</p>
              <p className="text-sm text-purple-700 font-bold">Totalt svarade</p>
            </div>
            <div className="bg-amber-50 rounded-2xl p-4">
              <p className="text-3xl font-black text-amber-600">+{correct*5}</p>
              <p className="text-sm text-amber-700 font-bold">Poäng intjänade</p>
            </div>
          </div>

          {correct >= personalBest && personalBest > 0 && (
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-2xl p-3 mb-4 font-bold animate-bounce-in">
              🏆 Nytt personbästa: {correct} rätt!
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button onClick={startDrill}
              className="bg-amber-500 text-white font-black py-3 rounded-2xl hover:bg-amber-400 transition-colors">
              🔄 Igen!
            </button>
            <button onClick={()=>setView('dashboard')}
              className="bg-gray-100 text-gray-700 font-bold py-3 rounded-2xl hover:bg-gray-200 transition-colors">
              📚 Tillbaka
            </button>
          </div>
          <button onClick={()=>setView('error-bank')}
            className="w-full mt-3 text-red-500 text-sm font-bold hover:text-red-700 transition-colors">
            💡 Försök igen →
          </button>
        </div>
      </div>
    </div>
  );
}
