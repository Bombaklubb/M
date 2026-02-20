import React, { useState } from 'react';
import { Grade, GRADE_LABELS } from '../types';
import { findOrCreateStudent } from '../utils/storage';
import { useApp } from '../contexts/AppContext';
import AppHeader from './AppHeader';

const AVATARS = ['🦁', '🐼', '🦊', '🐸', '🦋', '🐢', '🦄', '🐉', '🧙', '🦸', '🧝', '🐺', '🦅', '🐯', '🧜', '🦖'];

const GRADE_GROUPS = [
  { label: 'Lågstadiet', emoji: '🦕', grades: ['1','2','3'] as Grade[], world: 'Dinosaurie Världen', color: 'from-emerald-400 to-green-500' },
  { label: 'Mellanstadiet', emoji: '🏰', grades: ['4','5','6'] as Grade[], world: 'Fantasy Världen', color: 'from-purple-400 to-violet-500' },
  { label: 'Högstadiet', emoji: '🚀', grades: ['7','8','9'] as Grade[], world: 'Sci-Fi Världen', color: 'from-blue-500 to-indigo-600' },
  { label: 'Gymnasiet', emoji: '🌌', grades: ['gym1','gym2','gym3'] as Grade[], world: 'Rymd Akademin', color: 'from-slate-600 to-indigo-800' },
];

export default function Login() {
  const { login, setView } = useApp();
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<Grade | ''>('');
  const [avatar, setAvatar] = useState(0);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'name'|'grade'|'avatar'>('name');

  const selectedGroup = GRADE_GROUPS.find(g => g.grades.includes(grade as Grade));

  function next1() {
    if (name.trim().length < 2) { setError('Skriv ditt skolanvändarnamn (minst 2 tecken)'); return; }
    setError(''); setStep('grade');
  }
  function next2() {
    if (!grade) { setError('Välj din klass'); return; }
    setError(''); setStep('avatar');
  }
  function doLogin() {
    if (!grade) return;
    login(findOrCreateStudent(name.trim(), grade, avatar));
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-20 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' }}>
      <AppHeader />

      {/* Stars */}
      {Array.from({length:25},(_,i)=>(
        <div key={i} className="absolute rounded-full bg-white animate-pulse-slow"
          style={{ width:`${1+Math.random()*2}px`, height:`${1+Math.random()*2}px`,
            top:`${Math.random()*100}%`, left:`${Math.random()*100}%`, opacity:0.4+Math.random()*0.5,
            animationDelay:`${Math.random()*3}s` }}/>
      ))}
      {['➕','➖','✖️','➗','π','√','∑','∞'].map((s,i)=>(
        <div key={i} className="absolute text-white/8 text-6xl font-black select-none pointer-events-none"
          style={{ top:`${8+(i*12)%80}%`, left:`${4+(i*13)%88}%`, transform:`rotate(${i*22}deg)` }}>{s}</div>
      ))}

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl shadow-2xl mb-3"
            style={{background:'linear-gradient(135deg,#f59e0b,#ef4444)'}}>
            <span className="text-4xl">🧮</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight drop-shadow-lg">Mattejakten</h1>
          <p className="text-blue-200 mt-1">Utforska matematikens världar!</p>
          <div className="flex justify-center gap-2 mt-3 flex-wrap">
            {['🦕 Dino','🏰 Fantasy','🚀 Sci-Fi','🌌 Rymd'].map((w,i)=>(
              <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/70 font-semibold">{w}</span>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-7">
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-6">
            {(['name','grade','avatar'] as const).map((s,i)=>(
              <div key={s} className={`h-2 rounded-full transition-all duration-300 ${
                step===s ? 'w-10 bg-amber-500' :
                (['name','grade','avatar'].indexOf(step)>i) ? 'w-5 bg-amber-300' : 'w-5 bg-gray-200'
              }`}/>
            ))}
          </div>

          {step==='name' && (
            <div className="animate-slide-up">
              <h2 className="text-2xl font-black text-gray-800 mb-1">Ditt användarnamn i skolan 🏫</h2>
              <p className="text-gray-400 text-sm mb-5">Ange ditt skolanvändarnamn för att logga in</p>
              <input type="text" value={name} onChange={e=>setName(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&next1()} placeholder="Ditt skolanvändarnamn..."
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 text-lg font-bold focus:outline-none focus:border-amber-400 transition-colors"
                autoFocus/>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <button onClick={next1} className="w-full mt-4 text-white font-black py-4 rounded-2xl text-lg shadow-lg hover:scale-105 active:scale-95 transition-all"
                style={{background:'linear-gradient(135deg,#f59e0b,#ef4444)'}}>Nästa →</button>
            </div>
          )}

          {step==='grade' && (
            <div className="animate-slide-up">
              <h2 className="text-2xl font-black text-gray-800 mb-1">Vilken klass, {name}? 📚</h2>
              <p className="text-gray-400 text-sm mb-4">Välj din klass för att låsa upp rätt värld</p>
              <div className="space-y-3">
                {GRADE_GROUPS.map(group=>(
                  <div key={group.label}>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                      {group.emoji} {group.label}
                    </p>
                    <div className="flex gap-2">
                      {group.grades.map(g=>(
                        <button key={g} onClick={()=>setGrade(g)}
                          className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
                            grade===g ? `bg-gradient-to-r ${group.color} text-white shadow-md scale-105`
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}>{GRADE_LABELS[g]}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {selectedGroup && (
                <div className={`mt-4 p-3 rounded-2xl bg-gradient-to-r ${selectedGroup.color} text-white text-sm text-center font-bold animate-fade-in`}>
                  ✨ Du låser upp: {selectedGroup.world}!
                </div>
              )}
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <div className="flex gap-3 mt-4">
                <button onClick={()=>setStep('name')} className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-2xl hover:bg-gray-200 transition-colors">← Tillbaka</button>
                <button onClick={next2} className="flex-2 text-white font-black py-3 px-8 rounded-2xl shadow-md hover:scale-105 transition-all"
                  style={{background:'linear-gradient(135deg,#f59e0b,#ef4444)'}}>Nästa →</button>
              </div>
            </div>
          )}

          {step==='avatar' && (
            <div className="animate-slide-up">
              <h2 className="text-2xl font-black text-gray-800 mb-1">Välj din hjälte! ⚔️</h2>
              <p className="text-gray-400 text-sm mb-5">Vem ska utforska matematikens världar?</p>
              <div className="grid grid-cols-4 gap-3 mb-5">
                {AVATARS.map((a,i)=>(
                  <button key={i} onClick={()=>setAvatar(i)}
                    className={`text-4xl p-3 rounded-2xl transition-all ${
                      avatar===i ? 'bg-amber-100 ring-2 ring-amber-400 scale-110 shadow-lg' : 'bg-gray-50 hover:bg-amber-50 hover:scale-105'
                    }`}>{a}</button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={()=>setStep('grade')} className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-2xl hover:bg-gray-200">← Tillbaka</button>
                <button onClick={doLogin} className="flex-2 text-white font-black py-3 px-5 rounded-2xl text-lg shadow-lg hover:scale-105 active:scale-95 transition-all"
                  style={{background:'linear-gradient(135deg,#10b981,#3b82f6)'}}>
                  {AVATARS[avatar]} Starta Äventyret!
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
