// Datamodell för delproven

export interface MultipleChoiceQuestion {
  kind: "multiple-choice";
  id: number;
  maxPoints: 1;
  prompt: string;
  options: string[]; // alltid fyra alternativ A–D
  correctIndex: number;
}

export interface OpenQuestion {
  kind: "open";
  id: number;
  maxPoints: 1 | 2;
  prompt: string;
  note?: string; // t.ex. "Du måste skriva två exempel för att få poäng."
  guidance: string; // bedömningsanvisning som visas vid självrättning
  lines: number;
}

export type Question = MultipleChoiceQuestion | OpenQuestion;

export interface TextSection {
  heading?: string; // mellanrubrik i sakprosatexter
  paragraphs: string[];
}

export interface ReadingTest {
  id: string;
  delprov: string; // t.ex. "Delprov B1: läsa – berättande text"
  textType: "berättande" | "sakprosa";
  title: string;
  ingress?: string; // sakprosatexter inleds med en ingress
  sections: TextSection[];
  byline: string[];
  footnote?: string;
  questions: Question[];
}

export interface WritingTask {
  id: string;
  delprov: string; // t.ex. "Delprov C1: skriva – berättande text"
  textType: "berättelse" | "argumenterande";
  title: string;
  intro: string[]; // inledande stycken som sätter scenen
  doThis: string[]; // "Gör det här!"
  topicExamples?: string[]; // exempelämnen (argumenterande)
  fixedHeading?: string; // given rubrik (berättelse)
  remember: string[]; // "Kom ihåg!"
  checklist: string[]; // självskattning efter skrivandet
}

export interface Grade {
  id: "ak3" | "ak6" | "ak9";
  label: string;
  available: boolean;
  reading: ReadingTest[];
  writing: WritingTask[];
}
