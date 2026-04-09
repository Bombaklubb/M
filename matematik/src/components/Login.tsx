import React, { useState } from 'react';
import { findOrCreateStudent } from '../utils/storage';
import { useApp } from '../contexts/AppContext';
import AppHeader from './AppHeader';
import { BASE_AVATARS } from '../data/avatars';
import { BorderBeam } from './magicui/border-beam';
import { Input } from './ui/input';

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
    <div
      className="min-h-screen flex items-center justify-center p-4 pt-14 relative overflow-hidden"
      style={{
        backgroundImage: "url('/Solig glänta i den förtrollade skogen.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <AppHeader />

      {/* Floating math symbols */}
      {['+', '−', '×', '÷', 'π', '√', '∑', '∞'].map((s, i) => (
        <div
          key={i}
          className="absolute select-none pointer-events-none font-black"
          style={{
            top: `${8 + (i * 12) % 80}%`,
            left: `${4 + (i * 13) % 88}%`,
            transform: `rotate(${i * 22}deg)`,
            color: 'rgba(120,80,10,0.08)',
            fontSize: '5rem',
          }}
        >
          {s}
        </div>
      ))}

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-4 animate-float">
          <img
            src="/mattejakten.png"
            alt="Mattejakten"
            className="h-40 w-auto mx-auto mb-1 drop-shadow-2xl"
            style={{ filter: 'drop-shadow(0 4px 20px rgba(120,80,10,0.30))' }}
          />
        </div>

        {/* Card */}
        <div
          className="relative rounded-3xl p-5 shadow-2xl"
          style={{
            background: 'rgba(255, 248, 220, 0.90)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(180, 130, 40, 0.45)',
            boxShadow: '0 8px 40px rgba(120,80,10,0.25), inset 0 1px 0 rgba(255,255,255,0.9)',
          }}
        >
          <BorderBeam
            colorFrom="#f59e0b"
            colorTo="#9333ea"
            duration={5}
            size={120}
            borderWidth={1.5}
          />

          <h2 className="text-xl font-black mb-3" style={{ color: '#5c3a00' }}>
            Skriv ditt namn 🏫
          </h2>

          <div className="mb-4">
            <Input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doLogin()}
              placeholder="Ditt namn..."
              autoFocus
              className="text-base font-bold"
              style={{
                background: 'rgba(255, 255, 255, 0.80)',
                border: '1px solid rgba(180,130,40,0.40)',
                color: '#1f2937',
              }}
            />
          </div>

          <h3 className="text-base font-black mb-1" style={{ color: '#5c3a00' }}>Välj din hjälte! ⚔️</h3>
          <p className="mb-3 text-xs" style={{ color: 'rgba(92,58,0,0.60)' }}>
            Vem ska utforska matematikens världar?
          </p>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {AVATARS.map((a, i) => (
              <button
                key={i}
                onClick={() => setAvatar(i)}
                className={`text-3xl p-2 rounded-2xl transition-all cursor-pointer ${
                  avatar === i ? 'scale-110 shadow-lg' : 'hover:scale-105'
                }`}
                style={avatar === i ? {
                  background: 'rgba(245,158,11,0.20)',
                  border: '2px solid rgba(180,130,40,0.75)',
                  boxShadow: '0 0 16px rgba(245,158,11,0.35)',
                } : {
                  background: 'rgba(255,255,255,0.50)',
                  border: '1px solid rgba(180,130,40,0.25)',
                }}
              >
                {a}
              </button>
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-3 animate-fade-in">{error}</p>
          )}

          <button
            onClick={doLogin}
            className="w-full py-3 text-lg font-black rounded-2xl text-white transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(180deg, #f97316 0%, #c2560a 100%)',
              boxShadow: '0 4px 20px rgba(249,115,22,0.5), 0 2px 0 rgba(0,0,0,0.3)',
            }}
          >
            {AVATARS[avatar]} Starta äventyret! →
          </button>
        </div>
      </div>
    </div>
  );
}
