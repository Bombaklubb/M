export interface Avatar {
  id: string;
  emoji: string;
  name: string;
  image?: string; // optional path to a custom image in /public
}

export const AVATARS: Avatar[] = [
  { id: "ninja",      emoji: "🥷",   name: "Ninjan",           image: "/images/avatars/ninja.svg" },
  { id: "wizard",     emoji: "🧙",   name: "Trollkarlen",      image: "/images/avatars/wizard.svg" },
  { id: "fox",        emoji: "🦊",   name: "Räven",            image: "/images/avatars/fox.svg" },
  { id: "lion",       emoji: "🦁",   name: "Lejonet",          image: "/images/avatars/lion.svg" },
  { id: "dragon",     emoji: "🐲",   name: "Draken",           image: "/images/avatars/dragon.svg" },
  { id: "unicorn",    emoji: "🦄",   name: "Enhörningen",      image: "/images/avatars/unicorn.svg" },
  { id: "robot",      emoji: "🤖",   name: "Roboten",          image: "/images/avatars/robot.svg" },
  { id: "astronaut",  emoji: "🧑",   name: "Astronauten",      image: "/images/avatars/astronaut.svg" },
  { id: "owl",        emoji: "🦉",   name: "Ugglan",           image: "/images/avatars/owl.svg" },
  { id: "pirate",     emoji: "🏴",   name: "Piraten",          image: "/images/avatars/pirate.svg" },
  { id: "princess",   emoji: "👸",   name: "Prinsessan" },
  { id: "prince",     emoji: "🤴",   name: "Prinsen" },
  { id: "elf",        emoji: "🧝",   name: "Alven" },
  { id: "mermaid",    emoji: "🧜",   name: "Sjöjungfrun" },
  { id: "superhero",  emoji: "🦸",   name: "Superhjälten" },
  { id: "villain",    emoji: "🦹",   name: "Skurken" },
  { id: "vampire",    emoji: "🧛",   name: "Vampyren" },
  { id: "ghost",      emoji: "👻",   name: "Spöket" },
  { id: "fairy",      emoji: "🧚",   name: "Fen" },
  { id: "genie",      emoji: "🧞",   name: "Anden" },
  { id: "cowboy",     emoji: "🤠",   name: "Cowboyen" },
  { id: "rockstar",   emoji: "🎤",   name: "Rockstjärnan" },
  { id: "detective",  emoji: "🕵",   name: "Detektiven" },
  { id: "frog",       emoji: "🐸",   name: "Grodan" },
  { id: "footballer", emoji: "⚽",   name: "Fotbollsspelaren", image: "/avatars/footballer.svg" },
];

export function getAvatar(id: string): Avatar {
  return AVATARS.find((a) => a.id === id) ?? AVATARS[0];
}
