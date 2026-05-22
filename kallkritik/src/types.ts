export type View =
  | 'home'
  | 'module1'
  | 'module2'
  | 'module3'
  | 'module4'
  | 'module5'
  | 'module6'
  | 'stats';

export interface GameState {
  xp: number;
  level: number;
  completedModules: number[];
  badges: string[];
  streak: number;
  lastPlayedDate: string;
  moduleHighScores: Record<number, number>;
}

export interface ModuleMeta {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  gradient: string;
  xpReward: number;
  difficulty: 'Lätt' | 'Medel' | 'Svår';
  badge: string;
  badgeName: string;
}

// Module 1: AI eller människa?
export interface AiOrHumanItem {
  id: string;
  type: 'text' | 'headline' | 'comment' | 'email' | 'post';
  typeLabel: string;
  content: string;
  isAI: boolean;
  explanation: string;
  clues: string[];
}

// Module 2: Hitta felet
export interface ErrorSegment {
  text: string;
  isError: boolean;
  errorExplanation?: string;
}

export interface FindErrorText {
  id: string;
  title: string;
  segments: ErrorSegment[];
  topic: string;
}

// Module 3: Källkritik
export type TrustLevel = 'green' | 'yellow' | 'red';

export interface SourceItem {
  id: string;
  platform: string;
  platformIcon: string;
  title: string;
  author: string;
  date: string | null;
  hasContactInfo: boolean;
  hasSources: boolean;
  hasBias: boolean;
  biasDescription: string;
  purpose: string;
  correctTrust: TrustLevel;
  explanation: string;
  criteria: {
    label: string;
    met: boolean;
    description: string;
  }[];
}

// Module 4: Fakebilder
export interface FakeImageHotspot {
  id: number;
  label: string;
  description: string;
  isArtifact: boolean;
  x: number;
  y: number;
}

export interface FakeImageItem {
  id: string;
  title: string;
  description: string;
  context: string;
  imageUrl: string;
  hotspots: FakeImageHotspot[];
}

// Module 5: AI-hallucinationer
export interface HallucinationItem {
  id: string;
  question: string;
  aiAnswer: string;
  isHallucination: boolean;
  explanation: string;
  correctAnswer?: string;
}

// Module 6: Sant eller fake?
export type Verdict = 'sant' | 'fake' | 'osaker';

export interface SantEllerFakeItem {
  id: string;
  type: 'headline' | 'post' | 'statistic' | 'quote' | 'screenshot';
  typeLabel: string;
  content: string;
  source?: string;
  verdict: 'sant' | 'fake';
  explanation: string;
  discussionPrompt: string;
}
