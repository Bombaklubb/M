import React, { useState } from 'react';
import { Topic } from '../types';
import { useApp } from '../contexts/AppContext';
import AppHeader from './AppHeader';
import InteractiveClock from './InteractiveClock';

// Inline SVG illustrations for each topic type
function Illustration({ name }: { name: string }) {
  const illustrations: Record<string, React.ReactNode> = {
    'count-to-10': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#0f0e2e" rx="12"/>
        <circle cx="100" cy="60" r="52" fill="#1e1b4b" opacity="0.5"/>
        {[0,1,2,3,4,5,6,7,8,9].map(i => {
          const row = Math.floor(i / 5);
          const col = i % 5;
          const colors = ['#f43f5e','#f59e0b','#22c55e','#3b82f6','#a855f7','#06b6d4','#ec4899','#84cc16','#f97316','#818cf8'];
          return (
            <g key={i} transform={`translate(${25 + col * 34}, ${22 + row * 46})`}>
              <circle cx="12" cy="12" r="14" fill={colors[i]} opacity="0.9"/>
              <circle cx="12" cy="12" r="14" fill="url(#shine)" opacity="0.3"/>
              <text x="12" y="17" textAnchor="middle" fontSize="14" fontWeight="900" fill="white">{i+1}</text>
            </g>
          );
        })}
        <text x="100" y="113" textAnchor="middle" fontSize="8" fontWeight="700" fill="#a5b4fc">Räkna 1 till 10!</text>
        <circle cx="8" cy="8" r="2" fill="#fbbf24" opacity="0.7"/>
        <circle cx="192" cy="10" r="1.5" fill="#60a5fa" opacity="0.6"/>
      </svg>
    ),
    'addition-basic': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#0f0e2e" rx="12"/>
        <rect x="8" y="25" width="70" height="70" rx="12" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5"/>
        <text x="20" y="62" fontSize="22">🍎</text>
        <text x="46" y="62" fontSize="22">🍎</text>
        <text x="31" y="84" textAnchor="middle" fontSize="9" fontWeight="700" fill="#93c5fd">2 äpplen</text>
        <rect x="8" y="72" width="70" height="0" rx="0" fill="none"/>
        <text x="86" y="65" textAnchor="middle" fontSize="28" fontWeight="900" fill="#f59e0b">+</text>
        <rect x="101" y="25" width="91" height="70" rx="12" fill="#1e3a1e" stroke="#22c55e" strokeWidth="1.5"/>
        <text x="110" y="62" fontSize="22">🍎</text>
        <text x="136" y="62" fontSize="22">🍎</text>
        <text x="162" y="62" fontSize="22">🍎</text>
        <text x="146" y="84" textAnchor="middle" fontSize="9" fontWeight="700" fill="#86efac">3 äpplen</text>
        <rect x="60" y="103" width="80" height="14" rx="7" fill="#1e3a5f"/>
        <text x="100" y="113" textAnchor="middle" fontSize="10" fontWeight="900" fill="#fbbf24">2 + 3 = 5 ✓</text>
        <circle cx="8" cy="8" r="2" fill="#fbbf24" opacity="0.7"/>
        <circle cx="192" cy="8" r="1.5" fill="#60a5fa" opacity="0.6"/>
      </svg>
    ),
    'subtraction-basic': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#0f0e2e" rx="12"/>
        <rect x="8" y="20" width="184" height="60" rx="12" fill="#2d1a1a" stroke="#f43f5e" strokeWidth="1.5"/>
        {[0,1,2,3,4].map(i => (
          <text key={i} x={20 + i*36} y="60" fontSize="24"
            opacity={i < 2 ? 0.3 : 0.95}>🍎</text>
        ))}
        {[0,1].map(i => (
          <g key={i}>
            <line x1={16 + i*36} y1="32" x2={44 + i*36} y2="68" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round"/>
            <line x1={44 + i*36} y1="32" x2={16 + i*36} y2="68" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round"/>
          </g>
        ))}
        <text x="164" y="55" textAnchor="middle" fontSize="24" fontWeight="900" fill="#f43f5e">− 2</text>
        <rect x="55" y="90" width="90" height="22" rx="11" fill="#3d1515" stroke="#f43f5e" strokeWidth="1"/>
        <text x="100" y="104" textAnchor="middle" fontSize="11" fontWeight="900" fill="#fca5a5">5 − 2 = 3 ✓</text>
        <circle cx="8" cy="8" r="2" fill="#fbbf24" opacity="0.7"/>
        <circle cx="192" cy="8" r="1.5" fill="#f43f5e" opacity="0.6"/>
      </svg>
    ),
    'shapes-basic': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <defs>
          <radialGradient id="gCircle" cx="40%" cy="35%"><stop offset="0%" stopColor="#c4b5fd"/><stop offset="100%" stopColor="#7c3aed"/></radialGradient>
          <radialGradient id="gSquare" cx="40%" cy="35%"><stop offset="0%" stopColor="#93c5fd"/><stop offset="100%" stopColor="#1d4ed8"/></radialGradient>
          <radialGradient id="gTri" cx="50%" cy="30%"><stop offset="0%" stopColor="#6ee7b7"/><stop offset="100%" stopColor="#047857"/></radialGradient>
          <radialGradient id="gRect" cx="40%" cy="35%"><stop offset="0%" stopColor="#fde68a"/><stop offset="100%" stopColor="#d97706"/></radialGradient>
        </defs>
        <rect width="200" height="120" fill="#0f0e2e" rx="12"/>
        <circle cx="25" cy="54" r="52" fill="#1e1b4b" opacity="0.3"/>
        <circle cx="30" cy="52" r="22" fill="url(#gCircle)" stroke="#a78bfa" strokeWidth="1.5"/>
        <text x="30" y="84" textAnchor="middle" fontSize="8" fontWeight="700" fill="#c4b5fd">Cirkel</text>
        <rect x="60" y="30" width="40" height="40" rx="4" fill="url(#gSquare)" stroke="#60a5fa" strokeWidth="1.5"/>
        <text x="80" y="84" textAnchor="middle" fontSize="8" fontWeight="700" fill="#93c5fd">Kvadrat</text>
        <polygon points="123,30 103,78 143,78" fill="url(#gTri)" stroke="#34d399" strokeWidth="1.5"/>
        <text x="123" y="92" textAnchor="middle" fontSize="8" fontWeight="700" fill="#6ee7b7">Triangel</text>
        <rect x="152" y="40" width="40" height="28" rx="4" fill="url(#gRect)" stroke="#fbbf24" strokeWidth="1.5"/>
        <text x="172" y="84" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fde68a">Rektangel</text>
        <text x="100" y="112" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#818cf8">Former och figurer</text>
        <circle cx="8" cy="8" r="2" fill="#fbbf24" opacity="0.7"/>
        <circle cx="192" cy="10" r="1.5" fill="#a78bfa" opacity="0.6"/>
      </svg>
    ),
    'multiplication': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <defs>
          <radialGradient id="gDot" cx="35%" cy="30%"><stop offset="0%" stopColor="#fde68a"/><stop offset="100%" stopColor="#d97706"/></radialGradient>
        </defs>
        <rect width="200" height="120" fill="#0f0e2e" rx="12"/>
        <rect x="8" y="10" width="110" height="100" rx="12" fill="#1c1a0e" stroke="#f59e0b" strokeWidth="1.5" opacity="0.9"/>
        {[0,1,2].map(row => [0,1,2,3].map(col => (
          <g key={`${row}-${col}`} transform={`translate(${20 + col*26}, ${22 + row*26})`}>
            <circle cx="8" cy="8" r="9" fill="url(#gDot)" stroke="#fbbf24" strokeWidth="0.8"/>
          </g>
        )))}
        <text x="59" y="105" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fcd34d">3 rader × 4 kolumner</text>
        <rect x="126" y="25" width="66" height="70" rx="12" fill="#2d1f00" stroke="#f59e0b" strokeWidth="1.5"/>
        <text x="159" y="58" textAnchor="middle" fontSize="20" fontWeight="900" fill="#fbbf24">3 × 4</text>
        <text x="159" y="82" textAnchor="middle" fontSize="22" fontWeight="900" fill="#f59e0b">= 12</text>
        <circle cx="8" cy="8" r="2" fill="#fbbf24" opacity="0.7"/>
        <circle cx="192" cy="8" r="1.5" fill="#f59e0b" opacity="0.6"/>
      </svg>
    ),
    'division': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#0f0e2e" rx="12"/>
        <rect x="8" y="8" width="184" height="58" rx="12" fill="#0d2626" stroke="#22c55e" strokeWidth="1.5"/>
        {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => (
          <text key={i} x={14 + (i%6)*30} y={i < 6 ? 34 : 56} fontSize="19">🍕</text>
        ))}
        <line x1="10" y1="75" x2="190" y2="75" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="5 3"/>
        {[0,1,2,3].map(i => (
          <g key={i}>
            <circle cx={22 + i*48} cy="97" r="12" fill="#134e4a" stroke="#34d399" strokeWidth="1.5"/>
            <text x={22 + i*48} y="101" textAnchor="middle" fontSize="10" fontWeight="900" fill="#6ee7b7">×3</text>
          </g>
        ))}
        <text x="100" y="116" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#34d399">12 ÷ 4 = 3 vardera</text>
        <circle cx="8" cy="8" r="2" fill="#fbbf24" opacity="0.7"/>
        <circle cx="192" cy="10" r="1.5" fill="#34d399" opacity="0.6"/>
      </svg>
    ),
    'fractions': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <defs>
          <radialGradient id="gPie" cx="40%" cy="35%"><stop offset="0%" stopColor="#fdba74"/><stop offset="100%" stopColor="#c2410c"/></radialGradient>
          <radialGradient id="gPieFull" cx="40%" cy="35%"><stop offset="0%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#d97706"/></radialGradient>
        </defs>
        <rect width="200" height="120" fill="#0f0e2e" rx="12"/>
        <circle cx="100" cy="60" r="55" fill="#1c1206" opacity="0.4"/>
        {/* 1/4 pie */}
        <circle cx="35" cy="57" r="28" fill="#2d1a08" stroke="#f97316" strokeWidth="2"/>
        <path d="M35,29 A28,28 0 0,1 63,57 L35,57 Z" fill="url(#gPie)"/>
        <text x="35" y="95" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fb923c">¼</text>
        {/* 1/2 pie */}
        <circle cx="105" cy="57" r="28" fill="#2d1a08" stroke="#f97316" strokeWidth="2"/>
        <path d="M105,29 A28,28 0 0,1 133,57 A28,28 0 0,1 105,85 Z" fill="url(#gPie)"/>
        <text x="105" y="95" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fb923c">½</text>
        {/* Full */}
        <circle cx="170" cy="57" r="24" fill="url(#gPieFull)" stroke="#fbbf24" strokeWidth="2"/>
        <text x="170" y="52" textAnchor="middle" fontSize="8" fontWeight="700" fill="#1c1206">HEL</text>
        <text x="170" y="63" textAnchor="middle" fontSize="12" fontWeight="900" fill="#1c1206">1</text>
        <text x="170" y="95" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fbbf24">Hel!</text>
        <text x="100" y="112" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#a5b4fc">Delar av en helhet</text>
        <circle cx="8" cy="8" r="2" fill="#fbbf24" opacity="0.7"/>
        <circle cx="192" cy="8" r="1.5" fill="#f97316" opacity="0.6"/>
      </svg>
    ),
    'decimals': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#0f0e2e" rx="12"/>
        {/* Bar 0.5 */}
        <rect x="10" y="22" width="82" height="52" rx="10" fill="#2d1a40" stroke="#a855f7" strokeWidth="1.5"/>
        <rect x="13" y="25" width="76" height="46" rx="8" fill="#1a0a2e" opacity="0.8"/>
        <rect x="13" y="25" width="38" height="46" rx="8" fill="#a855f7" opacity="0.85"/>
        <text x="51" y="52" textAnchor="middle" fontSize="17" fontWeight="900" fill="white">0,5</text>
        <text x="51" y="87" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#c084fc">Hälften (½)</text>
        {/* Bar 0.25 */}
        <rect x="108" y="22" width="82" height="52" rx="10" fill="#1a2040" stroke="#60a5fa" strokeWidth="1.5"/>
        <rect x="111" y="25" width="76" height="46" rx="8" fill="#0a1020" opacity="0.8"/>
        <rect x="111" y="25" width="19" height="46" rx="8" fill="#3b82f6" opacity="0.9"/>
        <text x="149" y="52" textAnchor="middle" fontSize="17" fontWeight="900" fill="white">0,25</text>
        <text x="149" y="87" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#93c5fd">En fjärdedel (¼)</text>
        <text x="100" y="110" textAnchor="middle" fontSize="8" fontWeight="700" fill="#a5b4fc">Decimaler – delar av ett heltal</text>
        <circle cx="8" cy="8" r="2" fill="#a855f7" opacity="0.7"/>
        <circle cx="192" cy="8" r="1.5" fill="#60a5fa" opacity="0.6"/>
      </svg>
    ),
    'percent': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#0f0e2e" rx="12"/>
        <circle cx="100" cy="60" r="55" fill="#0c1a2e" opacity="0.5"/>
        {/* 50% bar */}
        <text x="12" y="32" fontSize="8.5" fontWeight="700" fill="#60a5fa">50%</text>
        <rect x="36" y="20" width="156" height="18" rx="9" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1"/>
        <rect x="36" y="20" width="78" height="18" rx="9" fill="#3b82f6"/>
        <text x="75" y="32" textAnchor="middle" fontSize="8" fontWeight="900" fill="white">hälften</text>
        {/* 25% bar */}
        <text x="12" y="56" fontSize="8.5" fontWeight="700" fill="#34d399">25%</text>
        <rect x="36" y="44" width="156" height="18" rx="9" fill="#0d2e1e" stroke="#22c55e" strokeWidth="1"/>
        <rect x="36" y="44" width="39" height="18" rx="9" fill="#22c55e"/>
        <text x="55" y="56" textAnchor="middle" fontSize="8" fontWeight="900" fill="white">¼</text>
        {/* 10% bar */}
        <text x="12" y="80" fontSize="8.5" fontWeight="700" fill="#fbbf24">10%</text>
        <rect x="36" y="68" width="156" height="18" rx="9" fill="#2d2006" stroke="#f59e0b" strokeWidth="1"/>
        <rect x="36" y="68" width="15.6" height="18" rx="9" fill="#f59e0b"/>
        <text x="12" y="104" fontSize="7.5" fontWeight="700" fill="#f59e0b">100%</text>
        <rect x="36" y="92" width="156" height="18" rx="9" fill="#f59e0b"/>
        <text x="114" y="104" textAnchor="middle" fontSize="8" fontWeight="900" fill="#1c1206">= allt (1 hel)</text>
        <circle cx="8" cy="8" r="2" fill="#fbbf24" opacity="0.7"/>
        <circle cx="192" cy="8" r="1.5" fill="#60a5fa" opacity="0.6"/>
      </svg>
    ),
    'algebra': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <defs>
          <linearGradient id="gAlgL" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#312e81"/><stop offset="100%" stopColor="#1e1b4b"/></linearGradient>
          <linearGradient id="gAlgR" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#4c1d95"/><stop offset="100%" stopColor="#5b21b6"/></linearGradient>
        </defs>
        <rect width="200" height="120" fill="#0f0e2e" rx="12"/>
        <rect x="8" y="28" width="80" height="64" rx="12" fill="url(#gAlgL)" stroke="#818cf8" strokeWidth="1.5"/>
        <text x="48" y="55" textAnchor="middle" fontSize="18" fontWeight="900" fill="#c4b5fd">x + 5</text>
        <line x1="18" y1="65" x2="78" y2="65" stroke="#818cf8" strokeWidth="1" strokeDasharray="3 2"/>
        <text x="48" y="80" textAnchor="middle" fontSize="14" fontWeight="700" fill="#818cf8">= 8</text>
        <text x="100" y="64" textAnchor="middle" fontSize="26" fontWeight="900" fill="#a855f7">→</text>
        <rect x="112" y="28" width="80" height="64" rx="12" fill="url(#gAlgR)" stroke="#a78bfa" strokeWidth="1.5"/>
        <text x="152" y="55" textAnchor="middle" fontSize="22" fontWeight="900" fill="#e9d5ff">x = 3</text>
        <rect x="126" y="68" width="52" height="16" rx="8" fill="#7c3aed" opacity="0.8"/>
        <text x="152" y="79" textAnchor="middle" fontSize="9" fontWeight="900" fill="white">Löst! ✓</text>
        <text x="100" y="110" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#a5b4fc">Algebra – hitta det okända</text>
        <circle cx="8" cy="8" r="2" fill="#a855f7" opacity="0.7"/>
        <circle cx="192" cy="8" r="1.5" fill="#818cf8" opacity="0.6"/>
      </svg>
    ),
    'equations': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#0f0e2e" rx="12"/>
        {/* Balance beam visual */}
        <rect x="92" y="72" width="16" height="30" rx="4" fill="#3b82f6"/>
        <circle cx="100" cy="104" r="8" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="1.5"/>
        <rect x="18" y="66" width="164" height="8" rx="4" fill="#1d4ed8"/>
        {/* Left pan */}
        <rect x="12" y="40" width="68" height="28" rx="8" fill="#1e3a5f" stroke="#60a5fa" strokeWidth="1.5"/>
        <text x="46" y="52" textAnchor="middle" fontSize="13" fontWeight="900" fill="#93c5fd">2x + 4</text>
        <text x="46" y="62" textAnchor="middle" fontSize="8" fill="#60a5fa">Vänster sida</text>
        {/* Right pan */}
        <rect x="120" y="40" width="68" height="28" rx="8" fill="#1e3a5f" stroke="#fbbf24" strokeWidth="1.5"/>
        <text x="154" y="52" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fde68a">= 12</text>
        <text x="154" y="62" textAnchor="middle" fontSize="8" fill="#fbbf24">Höger sida</text>
        {/* Steps */}
        <text x="32" y="22" textAnchor="middle" fontSize="9" fontWeight="700" fill="#818cf8">2x=8</text>
        <text x="100" y="22" textAnchor="middle" fontSize="11" fontWeight="900" fill="#a855f7">→</text>
        <rect x="126" y="12" width="60" height="18" rx="9" fill="#4c1d95"/>
        <text x="156" y="23" textAnchor="middle" fontSize="10" fontWeight="900" fill="#e9d5ff">x = 4 ✓</text>
        <circle cx="8" cy="8" r="2" fill="#fbbf24" opacity="0.7"/>
        <circle cx="192" cy="8" r="1.5" fill="#60a5fa" opacity="0.6"/>
      </svg>
    ),
    'statistics': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <defs>
          <linearGradient id="gBar1" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#4ade80"/><stop offset="100%" stopColor="#15803d"/></linearGradient>
          <linearGradient id="gBar2" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#34d399"/><stop offset="100%" stopColor="#047857"/></linearGradient>
          <linearGradient id="gBar3" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#6ee7b7"/><stop offset="100%" stopColor="#065f46"/></linearGradient>
        </defs>
        <rect width="200" height="120" fill="#0f0e2e" rx="12"/>
        <rect x="10" y="8" width="180" height="100" rx="10" fill="#071a12" opacity="0.8"/>
        {/* Grid lines */}
        {[20,40,60,80].map(y => (
          <line key={y} x1="28" y1={108-y} x2="188" y2={108-y} stroke="#1a3a2a" strokeWidth="1"/>
        ))}
        {/* Bars with gradient-like colors */}
        {[40,65,50,80,55].map((h, i) => {
          const fills = ['url(#gBar1)','url(#gBar2)','url(#gBar1)','url(#gBar3)','url(#gBar2)'];
          return (
            <g key={i}>
              <rect x={30 + i*32} y={108-h} width="22" height={h} fill={fills[i]} rx="4 4 0 0"/>
              <rect x={30 + i*32} y={108-h} width="22" height="4" rx="4 4 0 0" fill="white" opacity="0.25"/>
            </g>
          );
        })}
        <line x1="28" y1="108" x2="188" y2="108" stroke="#22c55e" strokeWidth="2"/>
        <line x1="28" y1="8" x2="28" y2="108" stroke="#22c55e" strokeWidth="2"/>
        <text x="100" y="118" textAnchor="middle" fontSize="8" fontWeight="700" fill="#4ade80">Stapeldiagram</text>
        <circle cx="8" cy="8" r="2" fill="#fbbf24" opacity="0.7"/>
        <circle cx="192" cy="8" r="1.5" fill="#22c55e" opacity="0.6"/>
      </svg>
    ),
    'geometry-area': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <defs>
          <linearGradient id="gRect2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#84cc16" stopOpacity="0.7"/><stop offset="100%" stopColor="#365314" stopOpacity="0.9"/></linearGradient>
          <linearGradient id="gTri2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#34d399" stopOpacity="0.7"/><stop offset="100%" stopColor="#064e3b" stopOpacity="0.9"/></linearGradient>
        </defs>
        <rect width="200" height="120" fill="#0f0e2e" rx="12"/>
        {/* Rectangle area */}
        <rect x="8" y="18" width="88" height="64" rx="8" fill="url(#gRect2)" stroke="#84cc16" strokeWidth="1.5"/>
        {/* dimension arrows */}
        <line x1="8" y1="12" x2="96" y2="12" stroke="#a3e635" strokeWidth="1.5"/>
        <polygon points="6,12 12,9 12,15" fill="#a3e635"/>
        <polygon points="98,12 92,9 92,15" fill="#a3e635"/>
        <text x="52" y="10" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#a3e635">8 m</text>
        <text x="100" y="38" fontSize="7.5" fontWeight="700" fill="#a3e635">6 m</text>
        <rect x="30" y="48" width="46" height="20" rx="6" fill="#052e16" opacity="0.8"/>
        <text x="53" y="61" textAnchor="middle" fontSize="10" fontWeight="900" fill="#4ade80">A = 48 m²</text>
        <text x="52" y="95" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#86efac">Rektangel: l × b</text>
        {/* Triangle */}
        <polygon points="122,18 150,82 186,82" fill="url(#gTri2)" stroke="#34d399" strokeWidth="1.5"/>
        <rect x="130" y="46" width="46" height="18" rx="6" fill="#052e16" opacity="0.8"/>
        <text x="153" y="57" textAnchor="middle" fontSize="9" fontWeight="900" fill="#34d399">A = ½bh</text>
        <text x="154" y="95" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#6ee7b7">Triangel: ½×b×h</text>
        <circle cx="8" cy="8" r="2" fill="#fbbf24" opacity="0.7"/>
        <circle cx="192" cy="10" r="1.5" fill="#4ade80" opacity="0.6"/>
      </svg>
    ),
    'functions': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#0f0e2e" rx="12"/>
        {/* Grid */}
        {[20,40,60,80].map(y => <line key={y} x1="22" y1={y} x2="190" y2={y} stroke="#1e2a4a" strokeWidth="1"/>)}
        {[50,80,110,140,170].map(x => <line key={x} x1={x} y1="10" x2={x} y2="105" stroke="#1e2a4a" strokeWidth="1"/>)}
        {/* Axes */}
        <line x1="22" y1="10" x2="22" y2="108" stroke="#3b82f6" strokeWidth="2"/>
        <line x1="18" y1="105" x2="192" y2="105" stroke="#3b82f6" strokeWidth="2"/>
        <polygon points="22,8 18,16 26,16" fill="#3b82f6"/>
        <polygon points="194,105 186,101 186,109" fill="#3b82f6"/>
        {/* Line f(x)=2x+1 */}
        <polyline points="22,103 62,83 102,63 142,43 182,23" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Glow on line */}
        <polyline points="22,103 62,83 102,63 142,43 182,23" fill="none" stroke="#f43f5e" strokeWidth="5" strokeLinecap="round" opacity="0.2"/>
        {/* Dots on line */}
        {[[22,103],[62,83],[102,63],[142,43]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r="4" fill="#f43f5e" stroke="#0f0e2e" strokeWidth="1.5"/>
        ))}
        {/* Label */}
        <rect x="108" y="10" width="76" height="18" rx="9" fill="#3d0818"/>
        <text x="146" y="22" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#f87171">f(x) = 2x + 1</text>
        <text x="100" y="117" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#818cf8">Linjär funktion (rät linje)</text>
        <circle cx="8" cy="8" r="2" fill="#fbbf24" opacity="0.7"/>
        <circle cx="192" cy="8" r="1.5" fill="#f43f5e" opacity="0.6"/>
      </svg>
    ),
    'trigonometry': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#0f0e2e" rx="12"/>
        <polygon points="18,105 155,105 18,20" fill="#1c1206" stroke="#f59e0b" strokeWidth="2.5"/>
        {/* Hypotenuse glow */}
        <line x1="18" y1="20" x2="155" y2="105" stroke="#f59e0b" strokeWidth="1" opacity="0.3"/>
        {/* Side labels */}
        <text x="82" y="117" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#fcd34d">Liggande (l)</text>
        <text x="6" y="65" fontSize="7.5" fontWeight="700" fill="#fcd34d" transform="rotate(-90,8,65)">Stående (m)</text>
        <text x="82" y="55" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fbbf24" transform="rotate(-35,82,55)">Hypotenusa (h)</text>
        {/* Angle arc */}
        <path d="M18,105 A22,22 0 0,1 36,88" fill="none" stroke="#22c55e" strokeWidth="2"/>
        <text x="44" y="100" fontSize="11" fontWeight="900" fill="#34d399">v</text>
        {/* Formulas box */}
        <rect x="118" y="14" width="76" height="60" rx="10" fill="#0d2206" stroke="#22c55e" strokeWidth="1.2"/>
        <text x="156" y="28" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#86efac">Trigonometri</text>
        <text x="156" y="42" textAnchor="middle" fontSize="9" fontWeight="900" fill="#fbbf24">sin(v)=m/h</text>
        <text x="156" y="55" textAnchor="middle" fontSize="9" fontWeight="900" fill="#60a5fa">cos(v)=l/h</text>
        <text x="156" y="68" textAnchor="middle" fontSize="9" fontWeight="900" fill="#f43f5e">tan(v)=m/l</text>
        <circle cx="8" cy="8" r="2" fill="#fbbf24" opacity="0.7"/>
        <circle cx="192" cy="8" r="1.5" fill="#f59e0b" opacity="0.6"/>
      </svg>
    ),
    'derivatives': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#0f0e2e" rx="12"/>
        {/* Grid */}
        {[20,40,60,80].map(y => <line key={y} x1="22" y1={y} x2="190" y2={y} stroke="#0e2a3a" strokeWidth="1"/>)}
        {/* Axes */}
        <line x1="22" y1="10" x2="22" y2="108" stroke="#0891b2" strokeWidth="2"/>
        <line x1="18" y1="105" x2="192" y2="105" stroke="#0891b2" strokeWidth="2"/>
        <polygon points="22,8 18,16 26,16" fill="#0891b2"/>
        <polygon points="194,105 186,101 186,109" fill="#0891b2"/>
        {/* f(x)=x² curve */}
        <path d="M22,105 Q60,104 80,85 Q110,55 140,30 Q165,12 188,8" fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M22,105 Q60,104 80,85 Q110,55 140,30 Q165,12 188,8" fill="none" stroke="#06b6d4" strokeWidth="6" strokeLinecap="round" opacity="0.15"/>
        {/* Tangent line */}
        <line x1="50" y1="98" x2="160" y2="30" stroke="#ef4444" strokeWidth="2" strokeDasharray="5 3"/>
        {/* Touch point */}
        <circle cx="100" cy="65" r="5" fill="#f43f5e" stroke="#0f0e2e" strokeWidth="1.5"/>
        {/* Labels */}
        <rect x="115" y="8" width="72" height="16" rx="8" fill="#0e2a3a"/>
        <text x="151" y="19" textAnchor="middle" fontSize="8.5" fontWeight="900" fill="#f87171">f'(x) = lutning</text>
        <text x="100" y="117" textAnchor="middle" fontSize="8" fontWeight="700" fill="#22d3ee">f(x)=x² → f'(x)=2x</text>
        <circle cx="8" cy="8" r="2" fill="#fbbf24" opacity="0.7"/>
        <circle cx="192" cy="112" r="1.5" fill="#06b6d4" opacity="0.6"/>
      </svg>
    ),
    'clock': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        {/* Background */}
        <rect width="200" height="120" fill="#0f0e2e" rx="12"/>
        {/* Glow behind clock */}
        <circle cx="62" cy="60" r="54" fill="#312e81" opacity="0.4"/>
        {/* Clock face – warm cream, high contrast */}
        <circle cx="62" cy="60" r="49" fill="#fffbf0" stroke="#fde68a" strokeWidth="3"/>
        {/* Tick marks: 12 major */}
        {Array.from({length: 12}, (_, i) => {
          const a = (i / 12) * 2 * Math.PI;
          const isMajor = i % 3 === 0;
          const r1 = isMajor ? 40 : 44;
          return (
            <line key={i}
              x1={62 + r1 * Math.sin(a)} y1={60 - r1 * Math.cos(a)}
              x2={62 + 48 * Math.sin(a)} y2={60 - 48 * Math.cos(a)}
              stroke={isMajor ? "#374151" : "#9ca3af"}
              strokeWidth={isMajor ? 2.5 : 1.2}
              strokeLinecap="round"/>
          );
        })}
        {/* Hour numbers: 12, 3, 6, 9 */}
        <text x="62" y="21" textAnchor="middle" fontSize="9" fontWeight="900" fill="#111827">12</text>
        <text x="105" y="64" textAnchor="middle" fontSize="9" fontWeight="900" fill="#111827">3</text>
        <text x="62" y="106" textAnchor="middle" fontSize="9" fontWeight="900" fill="#111827">6</text>
        <text x="19" y="64" textAnchor="middle" fontSize="9" fontWeight="900" fill="#111827">9</text>
        {/* Hour hand → 3:00 (pointing right) */}
        <line x1="62" y1="60" x2="89" y2="60" stroke="#1e293b" strokeWidth="6" strokeLinecap="round"/>
        {/* Minute hand ↑ 12:00 (pointing up) */}
        <line x1="62" y1="60" x2="62" y2="20" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round"/>
        {/* Center dot */}
        <circle cx="62" cy="60" r="5" fill="#1e293b"/>
        <circle cx="62" cy="60" r="2.2" fill="#60a5fa"/>
        {/* TIMMAR badge (amber) with arrow to hour hand */}
        <rect x="103" y="52" width="56" height="18" rx="9" fill="#f59e0b"/>
        <text x="131" y="62" textAnchor="middle" fontSize="8.5" fontWeight="900" fill="#1e293b">TIMMAR</text>
        <polygon points="102,61 108,56 108,66" fill="#f59e0b"/>
        <text x="112" y="79" fontSize="6.5" fontWeight="700" fill="#fcd34d">kort mörk visare</text>
        {/* MINUTER badge (blue) with dashed line to minute hand tip */}
        <rect x="98" y="13" width="60" height="18" rx="9" fill="#3b82f6"/>
        <text x="128" y="23" textAnchor="middle" fontSize="8.5" fontWeight="900" fill="white">MINUTER</text>
        <line x1="62" y1="20" x2="97" y2="21" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="3 2" strokeLinecap="round"/>
        <circle cx="62" cy="20" r="3" fill="#60a5fa"/>
        <text x="100" y="39" fontSize="6.5" fontWeight="700" fill="#93c5fd">lång blå visare</text>
        {/* Digital display */}
        <rect x="116" y="84" width="74" height="28" rx="10" fill="#0f2744" stroke="#3b82f6" strokeWidth="1.2"/>
        <text x="153" y="96" textAnchor="middle" fontSize="7" fontWeight="700" fill="#60a5fa">Digitalt:</text>
        <text x="153" y="108" textAnchor="middle" fontSize="12" fontWeight="900" fill="#fbbf24">03:00</text>
        {/* Decorative stars */}
        <circle cx="8" cy="8" r="2" fill="#fbbf24" opacity="0.8"/>
        <circle cx="14" cy="16" r="1.3" fill="#fbbf24" opacity="0.5"/>
        <circle cx="4" cy="19" r="1.5" fill="#818cf8" opacity="0.6"/>
        <circle cx="193" cy="7" r="1.8" fill="#60a5fa" opacity="0.7"/>
        <circle cx="198" cy="15" r="1.2" fill="#fbbf24" opacity="0.4"/>
        <circle cx="7" cy="108" r="1.5" fill="#34d399" opacity="0.6"/>
      </svg>
    ),
    'probability': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#0f0e2e" rx="12"/>
        <circle cx="100" cy="60" r="55" fill="#1a0a2e" opacity="0.4"/>
        {/* Die */}
        <rect x="10" y="22" width="50" height="50" rx="10" fill="#312e81" stroke="#818cf8" strokeWidth="2"/>
        {[[18,30],[18,47],[35,47],[52,30],[52,47],[35,30]].map(([cx,cy],i) => (
          i < 5 ? <circle key={i} cx={cx} cy={cy} r="4" fill="white" opacity="0.9"/> : null
        ))}
        <text x="35" y="85" textAnchor="middle" fontSize="9" fontWeight="700" fill="#a5b4fc">P(⚄) = 1/6</text>
        {/* Coin */}
        <circle cx="100" cy="48" r="26" fill="#d97706" stroke="#fbbf24" strokeWidth="2"/>
        <circle cx="100" cy="48" r="20" fill="#b45309" stroke="#fcd34d" strokeWidth="1"/>
        <text x="100" y="44" textAnchor="middle" fontSize="10" fontWeight="900" fill="#fde68a">KR</text>
        <text x="100" y="56" textAnchor="middle" fontSize="8" fill="#fde68a">KRONA</text>
        <text x="100" y="86" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fcd34d">P(krona) = ½</text>
        {/* Bar chart for probability */}
        <rect x="148" y="22" width="44" height="70" rx="8" fill="#0d1a3a" stroke="#3b82f6" strokeWidth="1.5"/>
        <rect x="153" y="52" width="14" height="36" rx="3" fill="#60a5fa"/>
        <rect x="173" y="35" width="14" height="53" rx="3" fill="#3b82f6"/>
        <text x="160" y="98" textAnchor="middle" fontSize="7" fill="#93c5fd">50% 100%</text>
        <text x="100" y="110" textAnchor="middle" fontSize="8" fontWeight="700" fill="#a5b4fc">Sannolikhet – chansen att något händer</text>
        <circle cx="8" cy="8" r="2" fill="#fbbf24" opacity="0.7"/>
        <circle cx="192" cy="8" r="1.5" fill="#a855f7" opacity="0.6"/>
      </svg>
    ),

    'number-line': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#0f0e2e" rx="12"/>
        {/* Glow */}
        <rect x="15" y="50" width="170" height="22" rx="11" fill="#312e81" opacity="0.5"/>
        {/* Main number line */}
        <line x1="18" y1="61" x2="182" y2="61" stroke="#818cf8" strokeWidth="2.5"/>
        {/* Left arrow */}
        <polygon points="14,61 22,57 22,65" fill="#818cf8"/>
        {/* Right arrow */}
        <polygon points="186,61 178,57 178,65" fill="#818cf8"/>
        {/* Tick marks and numbers 0–10 */}
        {[0,1,2,3,4,5,6,7,8,9,10].map(n => {
          const x = 22 + n * 16;
          return (
            <g key={n}>
              <line x1={x} y1="55" x2={x} y2="67" stroke={n === 0 ? "#fbbf24" : n === 10 ? "#34d399" : "#a5b4fc"} strokeWidth={n === 0 || n === 10 ? 2.5 : 1.5}/>
              <text x={x} y="78" textAnchor="middle" fontSize="8.5" fontWeight="900"
                fill={n === 0 ? "#fbbf24" : n === 10 ? "#34d399" : "#c7d2fe"}>{n}</text>
            </g>
          );
        })}
        {/* Jump arc example: 3→6 */}
        <path d="M 70 58 Q 87 30 102 58" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round"/>
        <polygon points="102,58 97,50 106,51" fill="#f43f5e"/>
        <text x="86" y="28" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#f43f5e">+3</text>
        {/* Label */}
        <text x="100" y="100" textAnchor="middle" fontSize="8" fontWeight="700" fill="#818cf8">Tallinjen</text>
        {/* Stars */}
        <circle cx="8" cy="8" r="2" fill="#fbbf24" opacity="0.7"/>
        <circle cx="192" cy="10" r="1.5" fill="#60a5fa" opacity="0.6"/>
      </svg>
    ),

    'count-to-100': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#0f0e2e" rx="12"/>
        {/* 10 rows of 10 blocks */}
        {Array.from({length: 5}, (_, row) =>
          Array.from({length: 10}, (_, col) => {
            const n = row * 10 + col + 1;
            const colors = ['#f43f5e','#f59e0b','#22c55e','#3b82f6','#a855f7'];
            return (
              <rect key={n} x={15 + col * 17} y={12 + row * 18} width="15" height="15" rx="3"
                fill={colors[row]} opacity="0.85"/>
            );
          })
        )}
        {/* Labels */}
        <text x="100" y="107" textAnchor="middle" fontSize="8" fontWeight="700" fill="#a5b4fc">10 × 10 = 100</text>
        <text x="5" y="20" fontSize="7" fill="#f43f5e" fontWeight="700">10</text>
        <text x="5" y="38" fontSize="7" fill="#f59e0b" fontWeight="700">20</text>
        <text x="5" y="56" fontSize="7" fill="#22c55e" fontWeight="700">30</text>
        <text x="5" y="74" fontSize="7" fill="#3b82f6" fontWeight="700">40</text>
        <text x="5" y="92" fontSize="7" fill="#a855f7" fontWeight="700">50</text>
        <circle cx="185" cy="10" r="2" fill="#fbbf24" opacity="0.7"/>
        <circle cx="192" cy="18" r="1.5" fill="#60a5fa" opacity="0.5"/>
      </svg>
    ),

    'units': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#0f0e2e" rx="12"/>
        {/* Ruler */}
        <rect x="10" y="20" width="130" height="22" rx="4" fill="#fbbf24" opacity="0.9"/>
        {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
          <g key={i}>
            <line x1={10 + i * 10} y1="20" x2={10 + i * 10} y2={i % 5 === 0 ? 30 : 27} stroke="#1e293b" strokeWidth={i % 5 === 0 ? 2 : 1}/>
            {i % 5 === 0 && <text key={`t${i}`} x={10 + i * 10} y="38" textAnchor="middle" fontSize="7" fontWeight="700" fill="#fbbf24">{i} cm</text>}
          </g>
        ))}
        <text x="80" y="14" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#fcd34d">Linjal / cm</text>
        {/* Weight scale icon */}
        <circle cx="158" cy="38" r="18" fill="#312e81" stroke="#818cf8" strokeWidth="1.5"/>
        <text x="158" y="34" textAnchor="middle" fontSize="8" fontWeight="700" fill="#a5b4fc">500 g</text>
        <text x="158" y="44" textAnchor="middle" fontSize="6.5" fill="#c7d2fe">= 0,5 kg</text>
        <text x="158" y="65" textAnchor="middle" fontSize="7" fill="#818cf8">Vikt</text>
        {/* Liter bottle shape */}
        <rect x="15" y="65" width="22" height="40" rx="5" fill="#0891b2" opacity="0.8"/>
        <rect x="22" y="60" width="8" height="8" rx="2" fill="#0891b2"/>
        <text x="26" y="90" textAnchor="middle" fontSize="7" fontWeight="900" fill="white">1 L</text>
        <text x="26" y="112" textAnchor="middle" fontSize="7" fill="#60a5fa">Volym</text>
        {/* Thermometer */}
        <rect x="55" y="62" width="10" height="38" rx="5" fill="#1e293b" stroke="#f43f5e" strokeWidth="1.5"/>
        <rect x="57" y="75" width="6" height="25" rx="3" fill="#f43f5e" opacity="0.9"/>
        <circle cx="60" cy="100" r="6" fill="#f43f5e"/>
        <text x="60" y="112" textAnchor="middle" fontSize="7" fill="#fca5a5">°C</text>
        <text x="75" y="85" fontSize="6.5" fill="#f87171">Temp.</text>
        {/* Stars */}
        <circle cx="190" cy="8" r="2" fill="#fbbf24" opacity="0.7"/>
        <circle cx="8" cy="112" r="1.5" fill="#34d399" opacity="0.6"/>
      </svg>
    ),

    'perimeter': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#0f0e2e" rx="12"/>
        {/* Rectangle shape */}
        <rect x="30" y="20" width="80" height="55" rx="4" fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray="5 3"/>
        <rect x="30" y="20" width="80" height="55" rx="4" fill="#052e16" opacity="0.5"/>
        {/* Side labels */}
        <text x="70" y="15" textAnchor="middle" fontSize="9" fontWeight="900" fill="#fbbf24">8 m</text>
        <text x="70" y="85" textAnchor="middle" fontSize="9" fontWeight="900" fill="#fbbf24">8 m</text>
        <text x="22" y="50" textAnchor="middle" fontSize="9" fontWeight="900" fill="#fbbf24">5 m</text>
        <text x="118" y="50" textAnchor="middle" fontSize="9" fontWeight="900" fill="#fbbf24">5 m</text>
        {/* Arrows along sides */}
        <line x1="30" y1="14" x2="110" y2="14" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="none"/>
        <polygon points="28,14 34,11 34,17" fill="#22c55e"/>
        <polygon points="112,14 106,11 106,17" fill="#22c55e"/>
        {/* Formula */}
        <rect x="130" y="25" width="62" height="52" rx="10" fill="#1e3a1e" stroke="#22c55e" strokeWidth="1.2"/>
        <text x="161" y="42" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#86efac">Omkrets =</text>
        <text x="161" y="56" textAnchor="middle" fontSize="8" fontWeight="900" fill="#fbbf24">2×(l+b)</text>
        <text x="161" y="70" textAnchor="middle" fontSize="7.5" fill="#86efac">= 2×(8+5)</text>
        <text x="161" y="82" textAnchor="middle" fontSize="9" fontWeight="900" fill="#34d399">= 26 m</text>
        {/* Stars */}
        <circle cx="8" cy="8" r="2" fill="#fbbf24" opacity="0.7"/>
        <circle cx="192" cy="112" r="1.5" fill="#34d399" opacity="0.6"/>
        <text x="100" y="110" textAnchor="middle" fontSize="8" fontWeight="700" fill="#4ade80">Omkrets</text>
      </svg>
    ),

    'fraction': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <defs>
          <radialGradient id="gFrac" cx="40%" cy="35%"><stop offset="0%" stopColor="#fdba74"/><stop offset="100%" stopColor="#c2410c"/></radialGradient>
        </defs>
        <rect width="200" height="120" fill="#0f0e2e" rx="12"/>
        {/* 1/4 */}
        <circle cx="35" cy="55" r="26" fill="#2d1a08" stroke="#f97316" strokeWidth="2"/>
        <path d="M35,29 A26,26 0 0,1 61,55 L35,55 Z" fill="url(#gFrac)"/>
        <line x1="35" y1="29" x2="35" y2="55" stroke="#f97316" strokeWidth="1.5" opacity="0.6"/>
        <text x="35" y="91" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fb923c">¼</text>
        {/* 1/2 + 1/4 */}
        <circle cx="105" cy="55" r="26" fill="#2d1a08" stroke="#f97316" strokeWidth="2"/>
        <path d="M105,29 A26,26 0 0,1 131,55 A26,26 0 0,1 105,81 Z" fill="url(#gFrac)"/>
        <path d="M105,29 A26,26 0 0,0 79,55 L105,55 Z" fill="#f97316" opacity="0.3"/>
        <line x1="105" y1="29" x2="105" y2="81" stroke="#f97316" strokeWidth="1.5" opacity="0.6"/>
        <line x1="79" y1="55" x2="131" y2="55" stroke="#f97316" strokeWidth="1.5" opacity="0.6"/>
        <text x="105" y="91" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fb923c">½+¼</text>
        {/* 3/4 */}
        <circle cx="170" cy="55" r="26" fill="#2d1a08" stroke="#fbbf24" strokeWidth="2"/>
        <path d="M170,29 A26,26 0 0,1 196,55 A26,26 0 0,1 170,81 A26,26 0 0,1 144,55 Z" fill="url(#gFrac)" opacity="0.9"/>
        <line x1="170" y1="29" x2="170" y2="55" stroke="#fbbf24" strokeWidth="1.5" opacity="0.6"/>
        <line x1="144" y1="55" x2="196" y2="55" stroke="#fbbf24" strokeWidth="1.5" opacity="0.6"/>
        <text x="170" y="91" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fbbf24">¾</text>
        <text x="100" y="110" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#a5b4fc">Addition av bråk</text>
        <circle cx="8" cy="8" r="2" fill="#fbbf24" opacity="0.7"/>
        <circle cx="192" cy="8" r="1.5" fill="#f97316" opacity="0.6"/>
      </svg>
    ),

    'matematik-begrepp': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#0f0e2e" rx="12"/>
        {/* Colorful math symbol badges */}
        <rect x="8" y="12" width="32" height="32" rx="10" fill="#f43f5e" opacity="0.9"/>
        <text x="24" y="32" textAnchor="middle" fontSize="20" fontWeight="900" fill="white">+</text>
        <rect x="48" y="12" width="32" height="32" rx="10" fill="#f59e0b" opacity="0.9"/>
        <text x="64" y="32" textAnchor="middle" fontSize="20" fontWeight="900" fill="white">−</text>
        <rect x="88" y="12" width="32" height="32" rx="10" fill="#22c55e" opacity="0.9"/>
        <text x="104" y="32" textAnchor="middle" fontSize="18" fontWeight="900" fill="white">×</text>
        <rect x="128" y="12" width="32" height="32" rx="10" fill="#3b82f6" opacity="0.9"/>
        <text x="144" y="32" textAnchor="middle" fontSize="18" fontWeight="900" fill="white">÷</text>
        <rect x="168" y="12" width="24" height="32" rx="10" fill="#a855f7" opacity="0.9"/>
        <text x="180" y="32" textAnchor="middle" fontSize="18" fontWeight="900" fill="white">=</text>
        {/* Second row */}
        <rect x="8" y="54" width="32" height="32" rx="10" fill="#06b6d4" opacity="0.9"/>
        <text x="24" y="74" textAnchor="middle" fontSize="18" fontWeight="900" fill="white">&lt;</text>
        <rect x="48" y="54" width="32" height="32" rx="10" fill="#ec4899" opacity="0.9"/>
        <text x="64" y="74" textAnchor="middle" fontSize="18" fontWeight="900" fill="white">&gt;</text>
        <rect x="88" y="54" width="32" height="32" rx="10" fill="#f97316" opacity="0.9"/>
        <text x="104" y="74" textAnchor="middle" fontSize="18" fontWeight="900" fill="white">?</text>
        <rect x="128" y="54" width="32" height="32" rx="10" fill="#84cc16" opacity="0.9"/>
        <text x="144" y="74" textAnchor="middle" fontSize="16" fontWeight="900" fill="white">%</text>
        <rect x="168" y="54" width="24" height="32" rx="10" fill="#f43f5e" opacity="0.9"/>
        <text x="180" y="74" textAnchor="middle" fontSize="18" fontWeight="900" fill="white">π</text>
        {/* Label */}
        <text x="100" y="105" textAnchor="middle" fontSize="9" fontWeight="700" fill="#a5b4fc">Matematiska begrepp</text>
        {/* Stars */}
        <circle cx="6" cy="108" r="2" fill="#fbbf24" opacity="0.7"/>
        <circle cx="194" cy="108" r="2" fill="#60a5fa" opacity="0.7"/>
      </svg>
    ),

    'rimlighetsoevning': (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <rect width="200" height="120" fill="#0f0e2e" rx="12"/>
        {/* Balance beam */}
        <rect x="95" y="55" width="10" height="40" rx="3" fill="#818cf8"/>
        <circle cx="100" cy="98" r="10" fill="#4338ca" stroke="#6366f1" strokeWidth="1.5"/>
        {/* Beam */}
        <rect x="20" y="52" width="160" height="6" rx="3" fill="#6366f1"/>
        {/* Left pan */}
        <line x1="35" y1="58" x2="35" y2="72" stroke="#60a5fa" strokeWidth="2"/>
        <line x1="25" y1="58" x2="45" y2="58" stroke="#60a5fa" strokeWidth="1.5"/>
        <rect x="18" y="72" width="34" height="22" rx="6" fill="#22c55e" opacity="0.8"/>
        <text x="35" y="86" textAnchor="middle" fontSize="8" fontWeight="900" fill="white">Rimligt?</text>
        {/* Right pan */}
        <line x1="165" y1="58" x2="165" y2="72" stroke="#60a5fa" strokeWidth="2"/>
        <line x1="155" y1="58" x2="175" y2="58" stroke="#60a5fa" strokeWidth="1.5"/>
        <rect x="148" y="72" width="34" height="22" rx="6" fill="#f43f5e" opacity="0.8"/>
        <text x="165" y="86" textAnchor="middle" fontSize="8" fontWeight="900" fill="white">Orimligt?</text>
        {/* Question marks */}
        <text x="35" y="48" textAnchor="middle" fontSize="18" fontWeight="900" fill="#fbbf24">?</text>
        <text x="165" y="48" textAnchor="middle" fontSize="18" fontWeight="900" fill="#f87171">!</text>
        {/* Label */}
        <text x="100" y="112" textAnchor="middle" fontSize="8" fontWeight="700" fill="#a5b4fc">Är det rimligt?</text>
        {/* Stars */}
        <circle cx="8" cy="8" r="2" fill="#fbbf24" opacity="0.7"/>
        <circle cx="192" cy="8" r="1.5" fill="#60a5fa" opacity="0.6"/>
        <circle cx="8" cy="18" r="1.2" fill="#818cf8" opacity="0.5"/>
      </svg>
    ),
  };
  return (
    <div className="w-full aspect-[5/3] max-h-48">
      {illustrations[name] ?? (
        <svg viewBox="0 0 200 120" className="w-full h-full">
          <rect width="200" height="120" fill="#f3f4f6" rx="12"/>
          <text x="100" y="65" textAnchor="middle" fontSize="40">🎯</text>
        </svg>
      )}
    </div>
  );
}

export default function TopicInstruction({ topic }: { topic: Topic }) {
  const { setView } = useApp();
  const [phase, setPhase] = useState<'learn' | 'mini' | 'done'>('learn');
  const [miniInput, setMiniInput] = useState('');
  const [miniAnswered, setMiniAnswered] = useState(false);
  const [miniCorrect, setMiniCorrect] = useState(false);

  // Pick a mini-challenge exercise – skip the first one so it's not the same as exercise 1
  const miniEx = topic.exercises.slice(1).find(
    e => e.type === 'fill-in' || e.type === 'multiple-choice' || e.type === 'true-false'
  );

  function checkMini(ans: string) {
    if (!miniEx) return;
    let ok = false;
    if (miniEx.type === 'fill-in') {
      const correct_str = String((miniEx as any).answer).replace(',', '.');
      const acceptable = ((miniEx as any).acceptableAnswers ?? []).map((a: any) => String(a).replace(',', '.').toLowerCase());
      ok = ans.trim().replace(',', '.').toLowerCase() === correct_str.toLowerCase()
        || acceptable.includes(ans.trim().replace(',', '.').toLowerCase());
    } else if (miniEx.type === 'multiple-choice') {
      ok = ans === String((miniEx as any).correctIndex);
    } else if (miniEx.type === 'true-false') {
      ok = ans === String((miniEx as any).isTrue);
    }
    setMiniCorrect(ok);
    setMiniAnswered(true);
  }

  const Header = () => (
    <div className={`bg-gradient-to-r ${topic.color} text-white pt-16 pb-6 px-4`}>
      <div className="max-w-lg mx-auto">
        <button onClick={() => setView('dashboard')}
          className="mb-3 flex items-center gap-1 text-white/80 hover:text-white transition-colors text-sm">
          ← Tillbaka till menyn
        </button>
        <div className="flex items-center gap-4">
          <div className="text-5xl">{topic.icon}</div>
          <div>
            <h1 className="text-2xl font-black">{topic.title}</h1>
            <p className="text-white/80 text-sm">{topic.description}</p>
          </div>
        </div>
        {/* Phase indicator */}
        <div className="flex gap-2 mt-4">
          {['learn', 'mini', 'done'].map((p, i) => (
            <div key={p} className={`flex-1 h-1.5 rounded-full transition-all ${
              phase === p ? 'bg-white' : i < ['learn','mini','done'].indexOf(phase) ? 'bg-white/60' : 'bg-white/25'
            }`}/>
          ))}
        </div>
      </div>
    </div>
  );

  // ---- LEARN PHASE ----
  if (phase === 'learn') return (
    <div className="min-h-screen" style={{ backgroundImage: "url('/Matematisk bakgrund med glödande symboler.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
      <AppHeader />
      <Header />
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="rounded-3xl p-6 mb-6" style={{ background: 'rgba(40,8,32,0.82)', backdropFilter: 'blur(20px)', border: '1px solid rgba(200,140,50,0.28)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-blue-500/30 text-blue-300 font-bold text-xs px-3 py-1 rounded-full">Steg 1 av 2 · Lär dig</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-4">📖 {topic.instruction.title}</h2>

          <div className="rounded-2xl overflow-hidden mb-5 bg-white/5 border border-white/10">
            <Illustration name={topic.instruction.illustration} />
          </div>

          <p className="text-white/80 leading-relaxed text-base mb-5">{topic.instruction.text}</p>

          {topic.instruction.examples && (
            <div className="bg-blue-500/20 border border-blue-400/30 rounded-2xl p-4">
              <p className="font-bold text-blue-300 mb-2">💡 Exempel:</p>
              <ul className="space-y-1">
                {topic.instruction.examples.map((ex, i) => (
                  <li key={i} className="text-blue-200 font-mono text-sm">{ex}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button onClick={() => setPhase(miniEx ? 'mini' : 'done')}
          className={`w-full bg-gradient-to-r ${topic.color} text-white font-black text-xl py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all`}>
          Nästa: Testa dig! →
        </button>
      </div>
    </div>
  );

  // ---- MINI CHALLENGE ----
  if (phase === 'mini' && miniEx) return (
    <div className="min-h-screen" style={{ backgroundImage: "url('/Matematisk bakgrund med glödande symboler.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
      <AppHeader />
      <Header />
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="rounded-3xl p-6 mb-5" style={{ background: 'rgba(40,8,32,0.82)', backdropFilter: 'blur(20px)', border: '1px solid rgba(200,140,50,0.28)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-purple-500/30 text-purple-300 font-bold text-xs px-3 py-1 rounded-full">Steg 2 av 2 · Testa dig!</span>
          </div>
          <p className="text-white/50 text-sm mb-3">Innan du börjar – svara på denna fråga:</p>

          {/* Clock image – shown when exercise has a clockDisplay */}
          {(miniEx as any).clockDisplay && (
            <div className="flex flex-col items-center mb-4">
              <p className="text-xs font-bold text-white/40 uppercase tracking-wide mb-2">🕐 Se klockan</p>
              <div className="bg-white/10 rounded-2xl border border-white/20 p-3 inline-block">
                <InteractiveClock
                  hour={(miniEx as any).clockDisplay.hour}
                  minute={(miniEx as any).clockDisplay.minute}
                  onChange={() => {}}
                  readOnly
                  size={160}
                />
              </div>
            </div>
          )}

          <h2 className="text-xl font-black text-white mb-5">{miniEx.question}</h2>

          {miniEx.type === 'fill-in' && !miniAnswered && (
            <div className="flex gap-3">
              <input type="text" inputMode="decimal" value={miniInput} autoFocus
                onChange={e => setMiniInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && miniInput.trim() && checkMini(miniInput.trim())}
                placeholder="Ditt svar..."
                className="flex-1 bg-white/10 border-2 border-white/20 text-white placeholder-white/30 rounded-2xl px-4 py-3 text-lg font-bold focus:outline-none focus:border-purple-400"/>
              <button onClick={() => miniInput.trim() && checkMini(miniInput.trim())}
                className="bg-purple-500 text-white font-bold px-5 rounded-2xl hover:bg-purple-400">✓</button>
            </div>
          )}

          {miniEx.type === 'multiple-choice' && !miniAnswered && (
            <div className="grid gap-3">
              {(miniEx as any).options.map((opt: string, i: number) => (
                <button key={i} onClick={() => checkMini(String(i))}
                  className="text-left px-5 py-3 rounded-2xl font-semibold border-2 border-white/15 bg-white/5 text-white hover:border-purple-400 hover:bg-purple-500/20 transition-all">
                  <span className="text-white/40 font-bold mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
                </button>
              ))}
            </div>
          )}

          {miniEx.type === 'true-false' && !miniAnswered && (
            <div className="grid grid-cols-2 gap-4">
              {[true, false].map(val => (
                <button key={String(val)} onClick={() => checkMini(String(val))}
                  className="py-5 rounded-2xl font-black text-xl border-2 border-white/15 bg-white/5 text-white hover:border-purple-400 hover:bg-purple-500/20 transition-all">
                  {val ? '👍 Sant' : '👎 Falskt'}
                </button>
              ))}
            </div>
          )}

          {miniAnswered && (
            <div className={`rounded-2xl p-4 mt-3 ${miniCorrect ? 'bg-emerald-500/20 border border-emerald-400/40' : 'bg-amber-500/20 border border-amber-400/40'}`}>
              <p className={`font-black text-lg mb-1 ${miniCorrect ? 'text-emerald-300' : 'text-amber-300'}`}>
                {miniCorrect ? '🎉 Precis rätt!' : '💪 Bra försök!'}
              </p>
              <p className={`text-sm ${miniCorrect ? 'text-emerald-400' : 'text-amber-400'}`}>{miniEx.explanation}</p>
            </div>
          )}
        </div>

        {miniAnswered && (
          <button onClick={() => setView('topic-exercise')}
            className={`w-full bg-gradient-to-r ${topic.color} text-white font-black text-xl py-4 rounded-2xl shadow-lg hover:scale-105 transition-all`}>
            {miniCorrect ? '🚀 Starta alla uppgifter!' : '🚀 Starta uppgifterna ändå!'}
          </button>
        )}
      </div>
    </div>
  );

  // Fallback: go straight to exercises
  setView('topic-exercise');
  return null;
}
