const CORRECT_MESSAGES = [
  'Rätt! 🌟',
  'Snyggt! ✨',
  'Perfekt! 🎯',
  'Strålande! ⚡',
  'Toppen! 🏆',
  'Kanonbra! 🔥',
  'Du är grym! 💎',
  'Wow! 💥',
  'Mästerligt! 👑',
  'Jättebra! 🎊',
  'Helt rätt! 🌈',
  'Suveränt! 🚀',
  'Precis rätt! ✅',
  'Ja! Det stämmer! 🎉',
  'Exakt! 🔑',
  'Imponerande! 💪',
  'Bravissimo! 🌠',
  'Spot on! ⭐',
  'Knäckis! 🧠',
  'Häftigt! 🦁',
];

export function getCorrectFeedback(): string {
  return CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)];
}
