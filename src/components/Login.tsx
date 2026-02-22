import React, { useState } from 'react';
import { findOrCreateStudent } from '../utils/storage';
import { useApp } from '../contexts/AppContext';
import AppHeader from './AppHeader';
import { BASE_AVATARS } from '../data/avatars';

const AVATARS = BASE_AVATARS;

export default function Login() {
  const { login } = useApp();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(0);
  const [error, setError] = useState('');

  function doLogin() {
    if (name.trim().length < 2) { setError('Skriv ditt användarnamn (minst 2 tecken)'); return; }
    login(findOrCreateStudent(name.trim(), '5', avatar));
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-20 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' }}>
      <AppHeader />

      {/* Stars */}
      {Array.from({length:25},(_,i)=>(
        <div key={i} className="absolute rounded-full bg-white animate-pulse-slow"
          style={{ width:`${1+(i*7%2)+1}px`, height:`${1+(i*7%2)+1}px`,
            top:`${(i*37+5)%100}%`, left:`${(i*53+11)%100}%`, opacity:0.4+((i*13)%5)*0.1,
            animationDelay:`${(i*7)%30/10}s` }}/>
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
          <h2 className="text-2xl font-black text-gray-800 mb-1">Ditt användarnamn i skolan 🏫</h2>
          <p className="text-gray-400 text-sm mb-4">Ange ditt skolanvändarnamn för att logga in</p>
          <input type="text" value={name} onChange={e=>setName(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&doLogin()}
            className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 text-lg font-bold focus:outline-none focus:border-amber-400 transition-colors mb-5"
            autoFocus/>

          <h3 className="text-lg font-black text-gray-800 mb-1">Välj din hjälte! ⚔️</h3>
          <p className="text-gray-400 text-sm mb-4">Vem ska utforska matematikens världar?</p>
          <div className="grid grid-cols-4 gap-3 mb-5">
            {AVATARS.map((a,i)=>(
              <button key={i} onClick={()=>setAvatar(i)}
                className={`text-4xl p-3 rounded-2xl transition-all ${
                  avatar===i ? 'bg-amber-100 ring-2 ring-amber-400 scale-110 shadow-lg' : 'bg-gray-50 hover:bg-amber-50 hover:scale-105'
                }`}>{a}</button>
            ))}
          </div>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <button onClick={doLogin}
            className="w-full text-white font-black py-4 rounded-2xl text-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
            style={{background:'linear-gradient(135deg,#f59e0b,#ef4444)'}}>
            {AVATARS[avatar]} Starta äventyret!
          </button>
        </div>
      </div>
    </div>
  );
}
