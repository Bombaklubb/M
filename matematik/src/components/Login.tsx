import React, { useState } from 'react';
import { findOrCreateStudent } from '../utils/storage';
import { useApp } from '../contexts/AppContext';
import AppHeader from './AppHeader';
import { BASE_AVATARS } from '../data/avatars';
import { Meteors } from './magicui/meteors';
import { BorderBeam } from './magicui/border-beam';
import { AnimatedGradientText } from './magicui/animated-gradient-text';
import { Input } from './ui/input';

const AVATARS = BASE_AVATARS;

// Star field component
function StarField() {
  const stars = Array.from({ length: 55 }, (_, i) => ({
    x: (i * 1.618 * 7.3) % 100,
    y: (i * 2.718 * 5.7) % 100,
    size: i % 7 === 0 ? 2.5 : i % 3 === 0 ? 1.5 : 1,
    duration: 2 + (i % 4) * 1.2,
    delay: (i * 0.37) % 4,
    opacity: 0.15 + (i % 5) * 0.12,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white twinkle-star"
          style={{
            width: s.size,
            height: s.size,
            top: `${s.y}%`,
            left: `${s.x}%`,
            opacity: s.opacity,
            '--duration': `${s.duration}s`,
            '--delay': `${s.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

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
      style={{ background: 'linear-gradient(160deg, #120318 0%, #1e0828 35%, #2d0d1e 65%, #160520 100%)' }}
    >
      <AppHeader />

      {/* Stars */}
      <StarField />

      {/* Magic UI – Meteors */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Meteors number={10} minDuration={6} maxDuration={14} />
      </div>

      {/* Floating math symbols */}
      {['➕','➖','✖️','➗','π','√','∑','∞'].map((s, i) => (
        <div
          key={i}
          className="absolute select-none pointer-events-none"
          style={{
            top: `${8 + (i * 12) % 80}%`,
            left: `${4 + (i * 13) % 88}%`,
            transform: `rotate(${i * 22}deg)`,
            color: 'rgba(200,140,50,0.06)',
            fontSize: '5rem',
            fontWeight: 900,
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
            style={{ filter: 'drop-shadow(0 0 30px rgba(245,158,11,0.35))' }}
          />
        </div>

        {/* Card */}
        <div
          className="relative rounded-3xl p-5 shadow-2xl"
          style={{
            background: 'rgba(40, 8, 32, 0.82)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(200, 140, 50, 0.35)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,220,100,0.10)',
          }}
        >
          <BorderBeam
            colorFrom="#f59e0b"
            colorTo="#9333ea"
            duration={5}
            size={120}
            borderWidth={1.5}
          />

          <h2 className="text-xl font-black text-white mb-3">
            <AnimatedGradientText colorFrom="#fbbf24" colorTo="#a78bfa" speed={0.8}>
              Skriv ditt namn
            </AnimatedGradientText>
            {' '}<span className="text-white">🏫</span>
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
                background: 'rgba(30, 8, 40, 0.80)',
                border: '1px solid rgba(200,140,50,0.35)',
                color: 'white',
              }}
            />
          </div>

          <h3 className="text-base font-black text-white mb-1">Välj din hjälte! ⚔️</h3>
          <p className="mb-3" style={{ color: 'rgba(255,255,255,0.40)', fontSize: '0.75rem' }}>
            Vem ska utforska matematikens världar?
          </p>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {AVATARS.map((a, i) => (
              <button
                key={i}
                onClick={() => setAvatar(i)}
                className={`text-3xl p-2 rounded-2xl transition-all cursor-pointer ${
                  avatar === i
                    ? 'scale-110 shadow-lg'
                    : 'hover:scale-105'
                }`}
                style={avatar === i ? {
                  background: 'rgba(245,158,11,0.18)',
                  border: '2px solid rgba(245,158,11,0.75)',
                  boxShadow: '0 0 16px rgba(245,158,11,0.35)',
                } : {
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.10)',
                }}
              >
                {a}
              </button>
            ))}
          </div>

          {error && (
            <p className="text-red-400 text-sm mb-3 animate-fade-in">{error}</p>
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
