import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Compass } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { View } from '@/types';

interface KallkollenViewProps {
  onNavigate: (view: View) => void;
}

type Answer = 'ja' | 'nej' | 'osaker';

interface CheckQuestion {
  id: string;
  criterion: string;
  criterionIcon: string;
  text: string;
}

const QUESTIONS: CheckQuestion[] = [
  { id: 'q1', criterion: 'Äkthet', criterionIcon: '🪪', text: 'Framgår det tydligt vem som står bakom källan (namn, organisation)?' },
  { id: 'q2', criterion: 'Äkthet', criterionIcon: '🪪', text: 'Finns kontaktuppgifter eller en "Om oss"-sida med riktiga uppgifter?' },
  { id: 'q3', criterion: 'Aktualitet', criterionIcon: '🗓️', text: 'Finns det ett datum för när informationen publicerades?' },
  { id: 'q4', criterion: 'Aktualitet', criterionIcon: '🗓️', text: 'Är informationen tillräckligt aktuell för ditt ämne?' },
  { id: 'q5', criterion: 'Oberoende', criterionIcon: '🔗', text: 'Anger källan varifrån uppgifterna kommer (källhänvisningar)?' },
  { id: 'q6', criterion: 'Oberoende', criterionIcon: '🔗', text: 'Säger andra oberoende källor samma sak? (Sök i sidled!)' },
  { id: 'q7', criterion: 'Tendens', criterionIcon: '🎯', text: 'Är syftet att informera – inte att sälja något eller övertyga dig?' },
  { id: 'q8', criterion: 'Tendens', criterionIcon: '🎯', text: 'Är tonen saklig – utan starka känsloord, superlativ och utropstecken?' },
];

const CRITERIA = ['Äkthet', 'Aktualitet', 'Oberoende', 'Tendens'];

function scoreOf(a: Answer | undefined): number {
  if (a === 'ja') return 1;
  if (a === 'osaker') return 0.5;
  return 0;
}

function lightFor(ratio: number): { emoji: string; label: string; color: string; border: string } {
  if (ratio >= 0.75) return { emoji: '🟢', label: 'Trovärdig', color: 'text-emerald-700 bg-emerald-50', border: 'border-emerald-300' };
  if (ratio >= 0.45) return { emoji: '🟡', label: 'Osäker – kolla mer', color: 'text-amber-700 bg-amber-50', border: 'border-amber-300' };
  return { emoji: '🔴', label: 'Opålitlig – var försiktig', color: 'text-rose-700 bg-rose-50', border: 'border-rose-300' };
}

export function KallkollenView({ onNavigate }: KallkollenViewProps) {
  const [sourceName, setSourceName] = useState('');
  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  const allAnswered = QUESTIONS.every(q => answers[q.id]);
  const totalScore = QUESTIONS.reduce((sum, q) => sum + scoreOf(answers[q.id]), 0);
  const totalRatio = totalScore / QUESTIONS.length;
  const verdict = lightFor(totalRatio);
  const unsureCount = Object.values(answers).filter(a => a === 'osaker').length;

  function setAnswer(id: string, a: Answer) {
    setAnswers(prev => ({ ...prev, [id]: a }));
  }

  function reset() {
    setAnswers({});
    setSourceName('');
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-14">
      {/* Header */}
      <button
        onClick={() => onNavigate('home')}
        className="flex items-center gap-1.5 text-sm font-bold text-indigo-500 hover:text-indigo-700 transition-colors cursor-pointer mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Tillbaka
      </button>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="clay-card p-6 mb-5 text-center">
        <div className="text-5xl mb-2">🚦</div>
        <h1 className="text-2xl font-extrabold text-gray-800 mb-1" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
          Källkollen
        </h1>
        <p className="text-sm text-gray-500 font-semibold leading-relaxed">
          Granska en <span className="text-indigo-600 font-bold">riktig källa</span> du har framför dig –
          en sajt, ett konto eller en artikel. Svara på frågorna så får du en trafikljus-bedömning.
        </p>
      </motion.div>

      {/* Source name */}
      <div className="clay-card p-4 mb-5">
        <label htmlFor="source-name" className="block text-xs font-extrabold text-gray-400 uppercase tracking-wide mb-2">
          Vilken källa granskar du?
        </label>
        <input
          id="source-name"
          type="text"
          value={sourceName}
          onChange={e => setSourceName(e.target.value)}
          placeholder="t.ex. naturfakta.se eller @hälsokontot"
          className="w-full rounded-xl border-2 border-indigo-100 bg-indigo-50/50 px-3 py-2.5 text-sm font-semibold text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-indigo-300"
        />
      </div>

      {/* Questions grouped by criterion */}
      {CRITERIA.map(criterion => (
        <div key={criterion} className="mb-5">
          <h2 className="text-sm font-extrabold text-gray-700 mb-2 flex items-center gap-1.5" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            <span>{QUESTIONS.find(q => q.criterion === criterion)?.criterionIcon}</span> {criterion}
          </h2>
          <div className="space-y-2">
            {QUESTIONS.filter(q => q.criterion === criterion).map(q => (
              <div key={q.id} className="clay-card p-3.5">
                <p className="text-sm font-semibold text-gray-700 leading-snug mb-2.5">{q.text}</p>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { value: 'ja' as Answer, label: 'Ja', on: 'bg-emerald-500 border-emerald-600 text-white', off: 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' },
                    { value: 'osaker' as Answer, label: 'Vet inte', on: 'bg-amber-500 border-amber-600 text-white', off: 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100' },
                    { value: 'nej' as Answer, label: 'Nej', on: 'bg-rose-500 border-rose-600 text-white', off: 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100' },
                  ]).map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setAnswer(q.id, opt.value)}
                      className={`rounded-xl border-2 py-1.5 text-xs font-extrabold transition-colors cursor-pointer ${
                        answers[q.id] === opt.value ? opt.on : opt.off
                      }`}
                      style={{ fontFamily: "'Baloo 2', sans-serif" }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Verdict */}
      <AnimatePresence>
        {allAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`clay-card p-6 mb-4 ${verdict.border}`}
          >
            <div className="text-center mb-4">
              <div className="text-5xl mb-2">{verdict.emoji}</div>
              <div className={`inline-block rounded-full border-2 px-4 py-1.5 text-sm font-extrabold ${verdict.color} ${verdict.border}`} style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                {sourceName ? `${sourceName}: ` : ''}{verdict.label}
              </div>
            </div>

            {/* Per criterion */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {CRITERIA.map(criterion => {
                const qs = QUESTIONS.filter(q => q.criterion === criterion);
                const ratio = qs.reduce((s, q) => s + scoreOf(answers[q.id]), 0) / qs.length;
                const l = lightFor(ratio);
                return (
                  <div key={criterion} className={`rounded-2xl border-2 p-2.5 text-center ${l.color} ${l.border}`}>
                    <div className="text-lg">{l.emoji}</div>
                    <div className="text-xs font-extrabold" style={{ fontFamily: "'Baloo 2', sans-serif" }}>{criterion}</div>
                  </div>
                );
              })}
            </div>

            {unsureCount > 0 && (
              <div className="flex items-start gap-2 bg-sky-50 border-2 border-sky-200 rounded-2xl p-3 mb-4">
                <Compass className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <p className="text-xs text-sky-700 font-semibold leading-relaxed">
                  Du svarade "vet inte" på {unsureCount} {unsureCount === 1 ? 'fråga' : 'frågor'}.
                  Sök i sidled för att ta reda på mer – modulen <button onClick={() => onNavigate('module10')} className="underline font-extrabold cursor-pointer">Sök i sidled</button> visar hur!
                </p>
              </div>
            )}

            <p className="text-xs text-gray-400 font-semibold text-center mb-4 leading-relaxed">
              Trafikljuset är en hjälp på vägen – inte ett facit. Diskutera gärna bedömningen med en kompis eller lärare.
            </p>

            <Button variant="secondary" size="md" fullWidth onClick={reset} className="gap-2">
              <RotateCcw className="w-4 h-4" /> Granska en ny källa
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {!allAnswered && (
        <p className="text-center text-xs font-bold text-gray-400">
          {Object.keys(answers).length} av {QUESTIONS.length} frågor besvarade
        </p>
      )}
    </div>
  );
}
