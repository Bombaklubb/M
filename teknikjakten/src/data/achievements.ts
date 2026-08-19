import { Achievement } from '../types';

/**
 * Prestationerna är medvetet oberoende av hur många kapitel och områden appen
 * har, så att de fortsätter fungera när innehållet växer. När områdena är
 * bestämda kan områdesspecifika märken läggas till med
 * `s.areaCounts['material'] >= n`.
 */
export const ACHIEVEMENTS: Achievement[] = [
  // Vanliga
  {
    id: 'first_chapter',
    title: 'Första kapitlet!',
    description: 'Klara ditt första kapitel.',
    icon: '🌟',
    color: 'from-yellow-400 to-amber-500',
    rarity: 'common',
    condition: (s) => s.completedChapters >= 1,
  },
  {
    id: 'ten_correct',
    title: 'Tio rätt',
    description: 'Svara rätt på 10 frågor totalt.',
    icon: '✅',
    color: 'from-green-400 to-emerald-500',
    rarity: 'common',
    condition: (s) => s.totalCorrect >= 10,
  },
  {
    id: 'three_chapters',
    title: 'Ivrig elev',
    description: 'Klara 3 kapitel.',
    icon: '📖',
    color: 'from-blue-400 to-indigo-500',
    rarity: 'common',
    condition: (s) => s.completedChapters >= 3,
  },
  {
    id: 'fifty_correct',
    title: 'Kunskapsbank',
    description: 'Svara rätt på 50 frågor.',
    icon: '🧠',
    color: 'from-purple-400 to-violet-500',
    rarity: 'common',
    condition: (s) => s.totalCorrect >= 50,
  },
  // Ovanliga
  {
    id: 'perfect_score',
    title: 'Prickskytt',
    description: 'Få 100 % på ett kapitel.',
    icon: '🎯',
    color: 'from-red-400 to-pink-500',
    rarity: 'rare',
    condition: (s) => s.progress.some(p => p.bestScore === 100),
  },
  {
    id: 'two_areas',
    title: 'Bredd',
    description: 'Klara minst ett kapitel i 2 olika områden.',
    icon: '🧭',
    color: 'from-teal-400 to-cyan-500',
    rarity: 'rare',
    condition: (s) => Object.keys(s.areaCounts).length >= 2,
  },
  {
    id: 'three_areas',
    title: 'Allkonstnär',
    description: 'Klara minst ett kapitel i 3 olika områden.',
    icon: '🎨',
    color: 'from-pink-400 to-rose-500',
    rarity: 'rare',
    condition: (s) => Object.keys(s.areaCounts).length >= 3,
  },
  {
    id: 'area_master',
    title: 'Områdesmästare',
    description: 'Klara 5 kapitel inom samma område.',
    icon: '⚙️',
    color: 'from-amber-500 to-orange-600',
    rarity: 'rare',
    condition: (s) => Object.values(s.areaCounts).some(n => n >= 5),
  },
  // Episka
  {
    id: 'ten_chapters',
    title: 'Teknikutforskaren',
    description: 'Klara 10 kapitel.',
    icon: '🗺️',
    color: 'from-indigo-500 to-purple-600',
    rarity: 'epic',
    condition: (s) => s.completedChapters >= 10,
  },
  {
    id: 'fact_nerd',
    title: 'Faktanörd',
    description: 'Svara rätt på 100 frågor totalt.',
    icon: '🔬',
    color: 'from-cyan-500 to-blue-600',
    rarity: 'epic',
    condition: (s) => s.totalCorrect >= 100,
  },
  {
    id: 'accurate',
    title: 'Pricksäker',
    description: 'Ha minst 80 % rätt totalt (efter 30+ svar).',
    icon: '🏹',
    color: 'from-green-500 to-teal-600',
    rarity: 'epic',
    condition: (s) => s.totalAnswered >= 30 && s.totalCorrect / s.totalAnswered >= 0.8,
  },
  // Legendariska
  {
    id: 'ten_three_stars',
    title: 'Stjärnsamlare',
    description: 'Få 3 stjärnor på 10 kapitel.',
    icon: '🌠',
    color: 'from-purple-500 via-pink-500 to-red-500',
    rarity: 'legendary',
    condition: (s) => s.progress.filter(p => p.stars === 3).length >= 10,
  },
];
