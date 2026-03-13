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
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #07071a 0%, #0d0d2b 50%, #1a0a2e 100%)' }}>
      <AppHeader />
      <Header />
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="bg-white/8 backdrop-blur-md border border-white/15 rounded-3xl p-6 mb-6">
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
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #07071a 0%, #0d0d2b 50%, #1a0a2e 100%)' }}>
      <AppHeader />
      <Header />
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="bg-white/8 backdrop-blur-md border border-white/15 rounded-3xl p-6 mb-5">
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
