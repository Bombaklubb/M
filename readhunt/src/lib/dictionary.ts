// English word definitions for difficult vocabulary in texts
// Key = word (lowercase), value = { def: definition, ex?: example sentence }

export interface WordDefinition {
  def: string;
  ex?: string;
}

export const WORD_DICTIONARY: Record<string, WordDefinition> = {
  'context': { def: 'The circumstances or background surrounding something', ex: 'You need to know the context to understand the quote.' },
  'perspective': { def: 'A point of view or way of looking at something', ex: "From the students' perspective, the test was difficult." },
  'relevant': { def: 'Closely connected or appropriate to what is being discussed', ex: 'The information was relevant to the task.' },
  'analyze': { def: 'To examine something carefully in order to understand it', ex: 'We will analyze the text to find the main idea.' },
  'phenomenon': { def: 'Something that happens or exists, especially something unusual', ex: 'The Northern Lights are a natural phenomenon.' },
  'complex': { def: 'Complicated; consisting of many different parts', ex: 'The problem was more complex than we thought.' },
  'abstract': { def: 'Relating to ideas rather than concrete things', ex: 'Love is an abstract concept.' },
  'hypothesis': { def: 'A suggested explanation that can be tested', ex: "The scientist's hypothesis turned out to be correct." },
  'theory': { def: 'An explanation supported by evidence', ex: "Darwin's theory of evolution." },
  'innovation': { def: 'A new idea, product, or method', ex: 'Smartphones were a major innovation.' },
  'strategy': { def: 'A plan designed to achieve a goal', ex: 'The team had a good strategy for the match.' },
  'dynamic': { def: 'Constantly changing and active', ex: 'The city has a dynamic atmosphere.' },
  'structure': { def: 'The way something is built or organized', ex: 'The text had a clear structure.' },
  'consequence': { def: 'A result or effect of an action', ex: 'The consequence of the decision was significant.' },
  'conclusion': { def: 'A decision or opinion reached by reasoning', ex: 'My conclusion is that we need more time.' },
  'argument': { def: 'A reason given to support or oppose a viewpoint', ex: 'She had strong arguments for her opinion.' },
  'evidence': { def: 'Information that shows whether something is true or false', ex: 'The detective found evidence at the scene.' },
  'significant': { def: 'Important or large enough to be noticed', ex: 'There was a significant improvement in her grades.' },
  'influence': { def: 'The power to have an effect on people or things', ex: 'Music can have a great influence on our mood.' },
  'impact': { def: 'A strong effect or impression', ex: 'The speech had a big impact on the audience.' },
  'contribute': { def: 'To give or add something to help achieve a result', ex: 'Everyone can contribute to a better environment.' },
  'tradition': { def: 'A custom or belief passed down through generations', ex: 'Celebrating Thanksgiving is an American tradition.' },
  'culture': { def: 'The customs, arts, and values of a society', ex: 'Every country has its own unique culture.' },
  'society': { def: 'People living together with shared rules and customs', ex: 'School is an important part of society.' },
  'individual': { def: 'A single person, as distinct from a group', ex: 'Every individual is unique.' },
  'environment': { def: 'The natural world around us; surroundings', ex: 'We must protect the environment.' },
  'resource': { def: 'A supply that can be used', ex: 'Water is an important natural resource.' },
  'method': { def: 'A way of doing something', ex: 'The teacher used a new method.' },
  'result': { def: 'The outcome of something', ex: 'The result of the experiment surprised everyone.' },
  'effect': { def: 'A change produced by a cause', ex: 'The medicine had a good effect.' },
  'cause': { def: 'The reason why something happens', ex: 'The cause of the fire was unknown.' },
  'process': { def: 'A series of actions that leads to a result', ex: 'Learning is a long process.' },
  'factor': { def: 'Something that influences a result', ex: 'Sleep is an important factor for health.' },
  'narrator': { def: 'The person telling the story', ex: 'The narrator described the setting in detail.' },
  'protagonist': { def: 'The main character in a story', ex: 'The protagonist faced many challenges.' },
  'antagonist': { def: 'A character who opposes the main character', ex: 'The antagonist tried to stop the hero.' },
  'plot': { def: 'The sequence of events in a story', ex: 'The plot of the book was very exciting.' },
  'setting': { def: 'The time and place in which a story occurs', ex: 'The setting was a small village in the 1800s.' },
  'theme': { def: 'The central idea or message of a text', ex: 'The theme of the story was friendship.' },
  'conflict': { def: 'A serious disagreement or struggle', ex: 'The conflict between the characters drove the story.' },
  'resolution': { def: 'The way a conflict is solved in a story', ex: 'The resolution brought peace to the village.' },
  'dialogue': { def: 'Words spoken between characters', ex: 'The dialogue between the two friends felt very real.' },
  'inference': { def: 'A conclusion reached from evidence and reasoning', ex: "We can make an inference about the character's feelings." },
  'literal': { def: 'Exactly as stated; not figurative', ex: 'Take the instructions literally.' },
  'metaphor': { def: 'A comparison that says one thing IS another', ex: '"The world is a stage" is a metaphor.' },
  'simile': { def: 'A comparison using "like" or "as"', ex: '"Fast as lightning" is a simile.' },
  'foreshadowing': { def: 'Hints about what will happen later in the story', ex: 'The dark clouds were foreshadowing trouble ahead.' },
  'ecosystem': { def: 'All living things and their environment in an area', ex: 'The rainforest is a rich ecosystem.' },
  'habitat': { def: 'The natural home of an animal or plant', ex: "The polar bear's habitat is the Arctic." },
  'predator': { def: 'An animal that hunts other animals for food', ex: 'The lion is a predator on the savanna.' },
  'prey': { def: 'An animal that is hunted by a predator', ex: 'Rabbits are prey for foxes.' },
  'migrate': { def: 'To move from one place to another seasonally', ex: 'Many birds migrate south in winter.' },
  'extinct': { def: 'No longer existing', ex: 'Dinosaurs became extinct millions of years ago.' },
  'endangered': { def: 'At risk of becoming extinct', ex: 'The giant panda is an endangered species.' },
  'atmosphere': { def: 'The layer of gases surrounding the Earth; or the mood of a place', ex: 'The atmosphere protects us from the sun.' },
  'gravity': { def: 'The force that pulls objects toward each other', ex: 'Gravity keeps us on the ground.' },
  'organism': { def: 'A living thing', ex: 'Bacteria are tiny organisms.' },
  'photosynthesis': { def: 'The process by which plants make food from sunlight', ex: 'Plants use photosynthesis to produce energy.' },
  'civilization': { def: 'An advanced human society with culture and laws', ex: 'Ancient Egypt was a great civilization.' },
  'democracy': { def: 'A system of government where people vote for their leaders', ex: 'In a democracy, citizens can vote.' },
  'empire': { def: 'A large group of countries ruled by one ruler', ex: 'The Roman Empire was very powerful.' },
  'revolution': { def: 'A major change, often involving the overthrow of a government', ex: 'The French Revolution changed Europe.' },
  'colony': { def: 'A country or area controlled by another country', ex: 'America was once a British colony.' },
  'reluctant': { def: 'Unwilling to do something', ex: 'She was reluctant to speak in front of the class.' },
  'determined': { def: 'Having a firm decision to do something', ex: 'He was determined to finish the race.' },
  'curious': { def: 'Eager to know or learn about something', ex: 'The curious child asked many questions.' },
  'exhausted': { def: 'Very tired, with no energy left', ex: 'After the long hike, she was exhausted.' },
  'tremendous': { def: 'Very great in amount, size, or intensity', ex: 'She made a tremendous effort to succeed.' },
  'peculiar': { def: 'Strange or unusual', ex: 'There was a peculiar smell in the old house.' },
  'ancient': { def: 'Belonging to the very distant past', ex: 'The museum displayed ancient pottery.' },
  'enormous': { def: 'Very large in size or amount', ex: 'The elephant was enormous.' },
  'mysterious': { def: 'Difficult to understand or explain', ex: 'The mysterious stranger never told his name.' },
  'courageous': { def: 'Very brave; not afraid of danger', ex: 'The courageous firefighter saved the child.' },
  'investigate': { def: 'To carefully examine or research something', ex: 'The scientist decided to investigate the mystery.' },
  'observe': { def: 'To watch carefully; to notice', ex: 'We observed the birds through binoculars.' },
  'predict': { def: 'To say what you think will happen in the future', ex: 'Can you predict what happens next in the story?' },
  'summarize': { def: 'To give a short description of the main points', ex: 'Please summarize what happened in the chapter.' },
  'compare': { def: 'To look at how things are similar or different', ex: "Compare the two characters' personalities." },
  'contrast': { def: 'To show how things are different from each other', ex: 'Contrast the two settings in the story.' },
};

// Get all words in a text that have definitions
export function getDefinedWords(text: string): string[] {
  const words = text.toLowerCase().match(/[a-z]+/gi) || [];
  const uniqueWords = [...new Set(words)];
  return uniqueWords.filter(word => WORD_DICTIONARY[word.toLowerCase()]);
}

// Check if a word has a definition
export function hasExplanation(word: string): boolean {
  return !!WORD_DICTIONARY[word.toLowerCase()];
}

// Get the definition for a word
export function getWordDefinition(word: string): WordDefinition | null {
  return WORD_DICTIONARY[word.toLowerCase()] || null;
}
