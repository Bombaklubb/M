export interface Avatar {
  id: string;
  emoji: string;
  name: string;
  image?: string;
}

export const AVATARS: Avatar[] = [
  { id: "ninja",      emoji: "🥷",  name: "Ninjan",           image: "/images/avatars/ninja.svg" },
  { id: "wizard",     emoji: "🧙",  name: "Trollkarlen",      image: "/images/avatars/wizard.svg" },
  { id: "fox",        emoji: "🦊",  name: "Räven",            image: "/images/avatars/fox.svg" },
  { id: "lion",       emoji: "🦁",  name: "Lejonet",          image: "/images/avatars/lion.svg" },
  { id: "dragon",     emoji: "🐲",  name: "Draken",           image: "/images/avatars/dragon.svg" },
  { id: "unicorn",    emoji: "🦄",  name: "Enhörningen",      image: "/images/avatars/unicorn.svg" },
  { id: "robot",      emoji: "🤖",  name: "Roboten",          image: "/images/avatars/robot.svg" },
  { id: "astronaut",  emoji: "🧑",  name: "Astronauten",      image: "/images/avatars/astronaut.svg" },
  { id: "owl",        emoji: "🦉",  name: "Ugglan",           image: "/images/avatars/owl.svg" },
  { id: "pirate",     emoji: "🏴",  name: "Piraten",          image: "/images/avatars/pirate.svg" },
  { id: "princess",   emoji: "👸",  name: "Prinsessan",       image: "/images/avatars/princess.svg" },
  { id: "prince",     emoji: "🤴",  name: "Prinsen",          image: "/images/avatars/prince.svg" },
  { id: "elf",        emoji: "🧝",  name: "Alven",            image: "/images/avatars/elf.svg" },
  { id: "mermaid",    emoji: "🧜",  name: "Sjöjungfrun",      image: "/images/avatars/mermaid.svg" },
  { id: "superhero",  emoji: "🦸",  name: "Superhjälten",     image: "/images/avatars/superhero.svg" },
  { id: "villain",    emoji: "🦹",  name: "Skurken",          image: "/images/avatars/villain.svg" },
  { id: "vampire",    emoji: "🧛",  name: "Vampyren",         image: "/images/avatars/vampire.svg" },
  { id: "ghost",      emoji: "👻",  name: "Spöket",           image: "/images/avatars/ghost.svg" },
  { id: "fairy",      emoji: "🧚",  name: "Fen",              image: "/images/avatars/fairy.svg" },
  { id: "genie",      emoji: "🧞",  name: "Anden",            image: "/images/avatars/genie.svg" },
  { id: "cowboy",     emoji: "🤠",  name: "Cowboyen",         image: "/images/avatars/cowboy.svg" },
  { id: "rockstar",   emoji: "🎤",  name: "Rockstjärnan",     image: "/images/avatars/rockstar.svg" },
  { id: "detective",  emoji: "🕵",  name: "Detektiven",       image: "/images/avatars/detective.svg" },
  { id: "frog",       emoji: "🐸",  name: "Grodan",           image: "/images/avatars/frog.svg" },
  { id: "footballer", emoji: "⚽",  name: "Fotbollsspelaren", image: "/images/avatars/footballer.svg" },
];

export function getAvatar(id: string): Avatar {
  return AVATARS.find((a) => a.id === id) ?? AVATARS[0];
}
