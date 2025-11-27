export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  SHORT_ANSWER = 'short_answer',
  REASONING = 'reasoning'
}

export interface Question {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[]; // Only for MULTIPLE_CHOICE
  correctAnswer: string;
  explanation: string;
}

export interface ReadingExercise {
  level: number;
  title: string;
  content: string;
  questions: Question[];
}

export enum AppState {
  SETUP = 'setup',
  LOADING = 'loading',
  READING = 'reading',
  QUIZ = 'quiz',
  RESULT = 'result',
  ERROR = 'error'
}

export interface UserAnswers {
  [questionId: number]: string;
}

export const TOPICS = [
  "Djur & Natur",
  "Rymden",
  "Skolan",
  "Fotboll",
  "Spel & Gaming",
  "Vänskap",
  "Äventyr",
  "Deckargåtor",
  "Teknik"
];