export interface Avatar {
  id: string;
  emoji: string;
  name: string;
  image?: string;
}

export const AVATARS: Avatar[] = [
  { id: "ninja",       emoji: "🥷",  name: "Ninjan",            image: "/avatars/ninja.svg" },
  { id: "wizard",      emoji: "🧙",  name: "Trollkarlen",        image: "/avatars/wizard.svg" },
  { id: "fox",         emoji: "🦊",  name: "Räven",              image: "/avatars/fox.svg" },
  { id: "lion",        emoji: "🦁",  name: "Lejonet",            image: "/avatars/lion.svg" },
  { id: "dragon",      emoji: "🐲",  name: "Draken",             image: "/avatars/dragon.svg" },
  { id: "unicorn",     emoji: "🦄",  name: "Enhörningen",        image: "/avatars/unicorn.svg" },
  { id: "robot",       emoji: "🤖",  name: "Roboten",            image: "/avatars/robot.svg" },
  { id: "astronaut",   emoji: "🧑",  name: "Astronauten",        image: "/avatars/astronaut.svg" },
  { id: "owl",         emoji: "🦉",  name: "Ugglan",             image: "/avatars/owl.svg" },
  { id: "pirate",      emoji: "🏴",  name: "Piraten",            image: "/avatars/pirate.svg" },
  { id: "princess",    emoji: "👸",  name: "Prinsessan",         image: "/avatars/princess.svg" },
  { id: "prince",      emoji: "🤴",  name: "Prinsen",            image: "/avatars/prince.svg" },
  { id: "elf",         emoji: "🧝",  name: "Alven",              image: "/avatars/elf.svg" },
  { id: "mermaid",     emoji: "🧜",  name: "Sjöjungfrun",        image: "/avatars/mermaid.svg" },
  { id: "superhero",   emoji: "🦸",  name: "Superhjälten",       image: "/avatars/superhero.svg" },
  { id: "villain",     emoji: "🦹",  name: "Skurken",            image: "/avatars/villain.svg" },
  { id: "vampire",     emoji: "🧛",  name: "Vampyren",           image: "/avatars/vampire.svg" },
  { id: "ghost",       emoji: "👻",  name: "Spöket",             image: "/avatars/ghost.svg" },
  { id: "fairy",       emoji: "🧚",  name: "Fen",                image: "/avatars/fairy.svg" },
  { id: "genie",       emoji: "🧞",  name: "Anden",              image: "/avatars/genie.svg" },
  { id: "cowboy",      emoji: "🤠",  name: "Cowboyen",           image: "/avatars/cowboy.svg" },
  { id: "rockstar",    emoji: "🎤",  name: "Rockstjärnan",       image: "/avatars/rockstar.svg" },
  { id: "detective",   emoji: "🕵",  name: "Detektiven",         image: "/avatars/detective.svg" },
  { id: "frog",        emoji: "🐸",  name: "Grodan",             image: "/avatars/frog.svg" },
  { id: "footballer",  emoji: "⚽",  name: "Fotbollsspelaren",   image: "/avatars/footballer.svg" },
];

export function getAvatar(id: string): Avatar {
  return AVATARS.find((a) => a.id === id) ?? AVATARS[0];
}
