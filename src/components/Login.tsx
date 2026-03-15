import React, { useState } from 'react';
import { findOrCreateStudent } from '../utils/storage';
import { useApp } from '../contexts/AppContext';
import AppHeader from './AppHeader';
import { BASE_AVATARS } from '../data/avatars';
import { Meteors } from './magicui/meteors';
import { BorderBeam } from './magicui/border-beam';
import { AnimatedGradientText } from './magicui/animated-gradient-text';
import { ShimmerButton } from './magicui/shimmer-button';
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
      className="min-h-screen flex items-center justify-center p-4 pt-20 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #07071a 0%, #0d0d2b 50%, #1a0a2e 100%)' }}
    >
      <AppHeader />

      {/* Magic UI – Meteors background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Meteors number={18} minDuration={4} maxDuration={12} />
      </div>

      {/* Floating math symbols */}
      {['➕','➖','✖️','➗','π','√','∑','∞'].map((s, i) => (
        <div
          key={i}
          className="absolute text-white/5 text-6xl font-black select-none pointer-events-none"
          style={{ top: `${8 + (i * 12) % 80}%`, left: `${4 + (i * 13) % 88}%`, transform: `rotate(${i * 22}deg)` }}
        >
          {s}
        </div>
      ))}

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <img
            src="/mattejakten.png"
            alt="Mattejakten"
            className="h-72 w-auto mx-auto mb-1 drop-shadow-2xl"
          />
        </div>

        {/* Card with BorderBeam */}
        <div
          className="relative rounded-3xl p-7 shadow-2xl"
          style={{
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          <BorderBeam
            colorFrom="#f59e0b"
            colorTo="#8b5cf6"
            duration={5}
            size={120}
            borderWidth={1.5}
          />

          <h2 className="text-2xl font-black text-white mb-4">
            <AnimatedGradientText colorFrom="#fbbf24" colorTo="#a78bfa" speed={0.8}>
              Skriv ditt namn
            </AnimatedGradientText>
            {' '}<span className="text-white">🏫</span>
          </h2>

          <Input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && doLogin()}
            placeholder="Ditt namn..."
            autoFocus
            className="mb-5 text-lg font-bold"
          />

          <h3 className="text-lg font-black text-white mb-1">Välj din hjälte! ⚔️</h3>
          <p className="text-white/40 text-sm mb-4">Vem ska utforska matematikens världar?</p>

          <div className="grid grid-cols-4 gap-3 mb-5">
            {AVATARS.map((a, i) => (
              <button
                key={i}
                onClick={() => setAvatar(i)}
                className={`text-4xl p-3 rounded-2xl transition-all cursor-pointer ${
                  avatar === i
                    ? 'bg-amber-500/20 ring-2 ring-amber-400 scale-110 shadow-lg shadow-amber-400/20'
                    : 'bg-white/5 hover:bg-white/10 hover:scale-105'
                }`}
              >
                {a}
              </button>
            ))}
          </div>

          {error && (
            <p className="text-red-400 text-sm mb-3 animate-fade-in">{error}</p>
          )}

          <ShimmerButton
            className="w-full py-4 text-xl font-black rounded-2xl"
            background="linear-gradient(135deg, #f59e0b, #ef4444)"
            shimmerColor="rgba(255,255,255,0.6)"
            onClick={doLogin}
          >
            {AVATARS[avatar]} Starta äventyret!
          </ShimmerButton>
        </div>
      </div>
    </div>
  );
}
