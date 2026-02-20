import React from 'react';
import { Topic } from '../types';
import { useApp } from '../contexts/AppContext';

// Inline SVG illustrations for each topic type
function Illustration({ name }: { name: string }) {
  const illustrations: Record<string, React.ReactNode> = {
    'count-to-10': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#f0fdf4" rx="12"/>
        {[0,1,2,3,4].map(i => (
          <g key={i} transform={`translate(${20 + i*36}, 30)`}>
            <circle cx="12" cy="12" r="12" fill="#4ade80"/>
            <text x="12" y="17" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">{i+1}</text>
          </g>
        ))}
        {[0,1,2,3,4].map(i => (
          <g key={i+5} transform={`translate(${20 + i*36}, 75)`}>
            <circle cx="12" cy="12" r="12" fill="#86efac"/>
            <text x="12" y="17" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">{i+6}</text>
          </g>
        ))}
        <text x="100" y="115" textAnchor="middle" fontSize="10" fill="#16a34a">Räkna 1 till 10!</text>
      </svg>
    ),
    'addition-basic': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#eff6ff" rx="12"/>
        <text x="20" y="65" fontSize="36">🍎🍎</text>
        <text x="90" y="68" fontSize="30" fontWeight="bold" fill="#2563eb">+</text>
        <text x="115" y="65" fontSize="36">🍎🍎🍎</text>
        <text x="100" y="100" textAnchor="middle" fontSize="12" fill="#1d4ed8" fontWeight="bold">2 + 3 = 5</text>
      </svg>
    ),
    'subtraction-basic': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#fef2f2" rx="12"/>
        <text x="15" y="60" fontSize="28">🍎🍎🍎🍎🍎</text>
        <text x="55" y="95" fontSize="16" fill="#dc2626" fontWeight="bold">5 - 2 = 3 🍎</text>
        <line x1="15" y1="45" x2="75" y2="75" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"/>
        <line x1="40" y1="45" x2="100" y2="75" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
    'shapes-basic': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#faf5ff" rx="12"/>
        <circle cx="30" cy="60" r="22" fill="#a78bfa" opacity="0.8"/>
        <text x="30" y="95" textAnchor="middle" fontSize="9" fill="#7c3aed">Cirkel</text>
        <rect x="60" y="38" width="44" height="44" fill="#818cf8" rx="4" opacity="0.8"/>
        <text x="82" y="95" textAnchor="middle" fontSize="9" fill="#4338ca">Kvadrat</text>
        <polygon points="127,38 105,82 149,82" fill="#6ee7b7" opacity="0.8"/>
        <text x="127" y="95" textAnchor="middle" fontSize="9" fill="#059669">Triangel</text>
        <rect x="155" y="46" width="38" height="28" fill="#fbbf24" rx="4" opacity="0.8"/>
        <text x="174" y="95" textAnchor="middle" fontSize="9" fill="#d97706">Rektangel</text>
      </svg>
    ),
    'multiplication': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#fffbeb" rx="12"/>
        {[0,1,2].map(row => [0,1,2,3].map(col => (
          <circle key={`${row}-${col}`} cx={25 + col*30} cy={25 + row*30} r="10" fill="#f59e0b" opacity="0.8"/>
        )))}
        <text x="150" y="55" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#d97706">3×4</text>
        <text x="150" y="80" textAnchor="middle" fontSize="28" fontWeight="black" fill="#92400e">= 12</text>
      </svg>
    ),
    'division': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#f0fdfa" rx="12"/>
        <text x="10" y="45" fontSize="28">🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕</text>
        <text x="100" y="75" textAnchor="middle" fontSize="14" fill="#0f766e">12 pizzor ÷ 4 kompisar</text>
        <text x="100" y="100" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#0d9488">= 3 vardera 🍕🍕🍕</text>
      </svg>
    ),
    'fractions': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#fff7ed" rx="12"/>
        <circle cx="40" cy="60" r="30" fill="none" stroke="#f97316" strokeWidth="3"/>
        <path d="M40,30 A30,30 0 0,1 70,60 L40,60 Z" fill="#fb923c" opacity="0.8"/>
        <text x="40" y="100" textAnchor="middle" fontSize="12" fill="#ea580c" fontWeight="bold">¼</text>
        <circle cx="110" cy="60" r="30" fill="none" stroke="#f97316" strokeWidth="3"/>
        <path d="M110,30 A30,30 0 0,1 140,60 L110,60 Z" fill="#fb923c" opacity="0.8"/>
        <path d="M110,60 L140,60 A30,30 0 0,1 110,90 Z" fill="#fb923c" opacity="0.8"/>
        <text x="110" y="100" textAnchor="middle" fontSize="12" fill="#ea580c" fontWeight="bold">½</text>
        <circle cx="170" cy="60" r="22" fill="#fb923c" opacity="0.8"/>
        <text x="170" y="100" textAnchor="middle" fontSize="12" fill="#ea580c" fontWeight="bold">Hel!</text>
      </svg>
    ),
    'decimals': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#fdf4ff" rx="12"/>
        <rect x="10" y="25" width="80" height="60" fill="#e879f9" rx="6" opacity="0.3"/>
        <rect x="10" y="25" width="40" height="60" fill="#e879f9" rx="6" opacity="0.6"/>
        <text x="50" y="58" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#a21caf">0,5</text>
        <text x="50" y="100" textAnchor="middle" fontSize="11" fill="#7e22ce">Hälften</text>
        <rect x="110" y="25" width="80" height="60" fill="#818cf8" rx="6" opacity="0.3"/>
        <rect x="110" y="25" width="20" height="60" fill="#818cf8" rx="6" opacity="0.6"/>
        <text x="150" y="58" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#3730a3">0,25</text>
        <text x="150" y="100" textAnchor="middle" fontSize="11" fill="#4338ca">En fjärdedel</text>
      </svg>
    ),
    'percent': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#f0f9ff" rx="12"/>
        <rect x="10" y="20" width="180" height="20" fill="#e0f2fe" rx="4"/>
        <rect x="10" y="20" width="90" height="20" fill="#0ea5e9" rx="4"/>
        <text x="100" y="57" textAnchor="middle" fontSize="13" fill="#0369a1">50% = hälften</text>
        <rect x="10" y="65" width="180" height="20" fill="#e0f2fe" rx="4"/>
        <rect x="10" y="65" width="18" height="20" fill="#0ea5e9" rx="4"/>
        <text x="100" y="100" textAnchor="middle" fontSize="13" fill="#0369a1">10% = en tiondel</text>
      </svg>
    ),
    'algebra': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#f5f3ff" rx="12"/>
        <rect x="10" y="35" width="80" height="50" fill="#ddd6fe" rx="8"/>
        <text x="50" y="55" textAnchor="middle" fontSize="14" fill="#7c3aed">x + 5</text>
        <text x="50" y="75" textAnchor="middle" fontSize="11" fill="#6d28d9">= 8</text>
        <text x="100" y="65" textAnchor="middle" fontSize="20" fill="#7c3aed">→</text>
        <rect x="110" y="35" width="80" height="50" fill="#c4b5fd" rx="8"/>
        <text x="150" y="55" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#4c1d95">x = 3</text>
        <text x="150" y="75" textAnchor="middle" fontSize="11" fill="#5b21b6">Löst!</text>
      </svg>
    ),
    'equations': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#eff6ff" rx="12"/>
        <text x="100" y="35" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1e40af">⚖️ Ekvation</text>
        <line x1="10" y1="65" x2="190" y2="65" stroke="#3b82f6" strokeWidth="3"/>
        <text x="50" y="55" textAnchor="middle" fontSize="14" fill="#1d4ed8">2x + 4</text>
        <text x="150" y="55" textAnchor="middle" fontSize="14" fill="#1d4ed8">= 12</text>
        <text x="50" y="90" textAnchor="middle" fontSize="13" fill="#1e40af">2x = 8</text>
        <text x="150" y="90" textAnchor="middle" fontSize="13" fill="#1e40af">x = 4 ✓</text>
      </svg>
    ),
    'statistics': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#f0fdf4" rx="12"/>
        {[40,65,50,80,55].map((h, i) => (
          <rect key={i} x={15 + i*36} y={100-h} width="26" height={h} fill="#22c55e" rx="4" opacity="0.8"/>
        ))}
        <line x1="10" y1="100" x2="190" y2="100" stroke="#15803d" strokeWidth="2"/>
        <text x="100" y="115" textAnchor="middle" fontSize="10" fill="#15803d">Stapeldiagram</text>
      </svg>
    ),
    'geometry-area': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#f7fee7" rx="12"/>
        <rect x="10" y="20" width="80" height="60" fill="#84cc16" opacity="0.5" rx="4"/>
        <text x="50" y="47" textAnchor="middle" fontSize="11" fill="#365314">längd = 8</text>
        <text x="50" y="62" textAnchor="middle" fontSize="11" fill="#365314">bredd = 6</text>
        <text x="50" y="92" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#3f6212">A=48 m²</text>
        <polygon points="120,20 160,80 180,80" fill="#4ade80" opacity="0.7"/>
        <text x="155" y="97" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#166534">Triangel</text>
      </svg>
    ),
    'functions': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#fff1f2" rx="12"/>
        <line x1="10" y1="100" x2="190" y2="100" stroke="#9f1239" strokeWidth="1.5"/>
        <line x1="20" y1="10" x2="20" y2="110" stroke="#9f1239" strokeWidth="1.5"/>
        <polyline points="20,100 60,80 100,60 140,40 180,20" fill="none" stroke="#e11d48" strokeWidth="2.5"/>
        <text x="155" y="35" fontSize="11" fill="#be123c" fontWeight="bold">f(x)=2x+1</text>
        <text x="100" y="115" textAnchor="middle" fontSize="9" fill="#9f1239">Linjär funktion (rät linje)</text>
      </svg>
    ),
    'trigonometry': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#fffbeb" rx="12"/>
        <polygon points="20,100 160,100 20,20" fill="none" stroke="#d97706" strokeWidth="2.5"/>
        <text x="90" y="115" textAnchor="middle" fontSize="10" fill="#92400e">Hypotenusa</text>
        <text x="7" y="62" fontSize="9" fill="#92400e">Motstående</text>
        <path d="M20,100 A20,20 0 0,1 36,86" fill="none" stroke="#f59e0b" strokeWidth="2"/>
        <text x="42" y="95" fontSize="10" fill="#d97706" fontWeight="bold">v</text>
        <text x="120" y="55" fontSize="11" fill="#b45309">sin(v)=m/h</text>
        <text x="120" y="72" fontSize="11" fill="#b45309">cos(v)=l/h</text>
        <text x="120" y="89" fontSize="11" fill="#b45309">tan(v)=m/l</text>
      </svg>
    ),
    'derivatives': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#ecfeff" rx="12"/>
        <line x1="10" y1="100" x2="190" y2="100" stroke="#0e7490" strokeWidth="1.5"/>
        <line x1="20" y1="10" x2="20" y2="110" stroke="#0e7490" strokeWidth="1.5"/>
        <path d="M25,95 Q60,90 100,60 Q140,30 175,15" fill="none" stroke="#0891b2" strokeWidth="2.5"/>
        <line x1="60" y1="95" x2="140" y2="35" stroke="#ef4444" strokeWidth="2" strokeDasharray="4"/>
        <text x="145" y="30" fontSize="10" fill="#dc2626" fontWeight="bold">f'(x)=lutning</text>
        <text x="100" y="115" textAnchor="middle" fontSize="9" fill="#0e7490">f(x)=x² → f'(x)=2x</text>
      </svg>
    ),
    'probability': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#fdf4ff" rx="12"/>
        <rect x="10" y="25" width="40" height="40" rx="8" fill="#a855f7" opacity="0.8"/>
        <circle cx="30" cy="45" r="5" fill="white"/>
        <text x="30" y="78" textAnchor="middle" fontSize="10" fill="#7e22ce">P(⚄)=1/6</text>
        <circle cx="100" cy="55" r="28" fill="#c084fc" opacity="0.4"/>
        <text x="100" y="50" textAnchor="middle" fontSize="18">🎰</text>
        <text x="100" y="78" textAnchor="middle" fontSize="10" fill="#7e22ce">P(krona)=½</text>
        <text x="160" y="45" textAnchor="middle" fontSize="30">🪙</text>
        <text x="160" y="78" textAnchor="middle" fontSize="10" fill="#7e22ce">50%</text>
      </svg>
    ),
  };
  return (
    <div className="w-full aspect-[5/3] max-h-48">
      {illustrations[name] ?? (
        <svg viewBox="0 0 200 120" className="w-full h-full">
          <rect width="200" height="120" fill="#f3f4f6" rx="12"/>
          <text x="100" y="65" textAnchor="middle" fontSize="40">🧮</text>
        </svg>
      )}
    </div>
  );
}

export default function TopicInstruction({ topic }: { topic: Topic }) {
  const { setView } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className={`bg-gradient-to-r ${topic.color} text-white py-8 px-4`}>
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => setView('dashboard')}
            className="mb-4 flex items-center gap-1 text-white/80 hover:text-white transition-colors text-sm"
          >
            ← Tillbaka till menyn
          </button>
          <div className="flex items-center gap-4">
            <div className="text-5xl">{topic.icon}</div>
            <div>
              <h1 className="text-2xl font-black">{topic.title}</h1>
              <p className="text-white/80">{topic.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Instruction content */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📖 {topic.instruction.title}
          </h2>

          {/* Illustration */}
          <div className="rounded-2xl overflow-hidden mb-5 bg-gray-50">
            <Illustration name={topic.instruction.illustration} />
          </div>

          {/* Text */}
          <p className="text-gray-700 leading-relaxed text-base mb-5">
            {topic.instruction.text}
          </p>

          {/* Examples */}
          {topic.instruction.examples && (
            <div className="bg-blue-50 rounded-2xl p-4">
              <p className="font-bold text-blue-800 mb-2">💡 Exempel:</p>
              <ul className="space-y-1">
                {topic.instruction.examples.map((ex, i) => (
                  <li key={i} className="text-blue-700 font-mono text-sm">
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Exercise count info */}
        <div className="bg-purple-50 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <span className="text-3xl">🎯</span>
          <div>
            <p className="font-bold text-purple-800">{topic.exercises.length} uppgifter väntar!</p>
            <p className="text-purple-600 text-sm">Svara rätt för att tjäna poäng och stjärnor</p>
          </div>
        </div>

        <button
          onClick={() => setView('topic-exercise')}
          className={`w-full bg-gradient-to-r ${topic.color} text-white font-black text-xl py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all`}
        >
          Starta uppgifterna! 🚀
        </button>
      </div>
    </div>
  );
}
