const CORRECT_MESSAGES = [
  "Rätt! 🎉",
  "Suveränt! ⭐",
  "Perfekt! 🌟",
  "Fantastiskt! 🚀",
  "Jättebra! 🎊",
  "Du är grym! 💪",
  "Imponerande! 🔥",
  "Snyggt! 👏",
  "Toppen! 🏆",
  "Grymt bra! ✨",
  "Alldeles rätt! 🎯",
  "Strålande! ☀️",
  "Du kan det här! 💫",
  "Kanon! 🎸",
  "Mästerklass! 🥇",
  "Boom! 💥",
  "Smart tänkt! 🧠",
  "Fenomenal! 🌈",
  "Det sitter! 🎯",
  "Bravissimo! 🎭",
  "Nice! ✌️",
  "Precis rätt! ✅",
  "Lätt som en plätt! 🥞",
  "Överlägset! 🦁",
  "Du är en stjärna! ⭐",
  "Magiskt! 🪄",
  "Kanonbra! 🌠",
  "Spot on! 🔮",
  "Wow! 😍",
  "Helt rätt! 🙌",
  "Briljant! 💎",
  "Jackpot! 🎰",
  "Du är på rätt spår! 🚂",
  "Enastående! 🦅",
  "Genialt! 🧩",
];

const MODULE_COMPLETE_MESSAGES = [
  "Bra jobbat! 🏆",
  "Grym insats! 🚀",
  "Du klarade det! 🎉",
  "Fantastiskt jobbat! ⭐",
  "Imponerade! 💪",
  "Du är en mästare! 🥇",
  "Strålande prestation! 🌟",
  "Otroligt bra! 🔥",
];

let lastIndex = -1;

export function getPositiveFeedback(): string {
  let idx: number;
  do {
    idx = Math.floor(Math.random() * CORRECT_MESSAGES.length);
  } while (idx === lastIndex && CORRECT_MESSAGES.length > 1);
  lastIndex = idx;
  return CORRECT_MESSAGES[idx];
}

export function getModuleCompleteFeedback(): string {
  return MODULE_COMPLETE_MESSAGES[
    Math.floor(Math.random() * MODULE_COMPLETE_MESSAGES.length)
  ];
}
