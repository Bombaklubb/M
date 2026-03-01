export interface Avatar {
  id: string;
  emoji: string;
  name: string;
}

export const AVATARS: Avatar[] = [
  { id: "ninja",      emoji: "🥷",   name: "Ninjan" },
  { id: "wizard",     emoji: "🧙‍♂️",  name: "Trollkarlen" },
  { id: "princess",   emoji: "👸",   name: "Prinsessan" },
  { id: "prince",     emoji: "🤴",   name: "Prinsen" },
  { id: "elf",        emoji: "🧝‍♀️",  name: "Alven" },
  { id: "mermaid",    emoji: "🧜‍♀️",  name: "Sjöjungfrun" },
  { id: "superhero",  emoji: "🦸‍♂️",  name: "Superhjälten" },
  { id: "villain",    emoji: "🦹‍♀️",  name: "Skurken" },
  { id: "vampire",    emoji: "🧛",   name: "Vampyren" },
  { id: "robot",      emoji: "🤖",   name: "Roboten" },
  { id: "ghost",      emoji: "👻",   name: "Spöket" },
  { id: "fairy",      emoji: "🧚‍♀️",  name: "Fen" },
  { id: "genie",      emoji: "🧞‍♂️",  name: "Anden" },
  { id: "cowboy",     emoji: "🤠",   name: "Cowboyen" },
  { id: "astronaut",  emoji: "🧑‍🚀",  name: "Astronauten" },
  { id: "rockstar",   emoji: "🧑‍🎤",  name: "Rockstjärnan" },
  { id: "dragon",     emoji: "🐲",   name: "Draken" },
  { id: "fox",        emoji: "🦊",   name: "Räven" },
  { id: "lion",       emoji: "🦁",   name: "Lejonet" },
  { id: "owl",        emoji: "🦉",   name: "Ugglan" },
  { id: "unicorn",    emoji: "🦄",   name: "Enhörningen" },
  { id: "pirate",     emoji: "🏴‍☠️",  name: "Piraten" },
  { id: "detective",  emoji: "🕵️",   name: "Detektiven" },
  { id: "frog",       emoji: "🐸",   name: "Grodan" },
];

export function getAvatar(id: string): Avatar {
  return AVATARS.find((a) => a.id === id) ?? AVATARS[0];
}
