// Datamodell för delproven

export interface MultipleChoiceQuestion {
  kind: "multiple-choice";
  id: number;
  maxPoints: 1 | 2; // åk 9: kryssfrågor ger 0 eller 2 poäng
  prompt: string;
  options: string[]; // alltid fyra alternativ A–D
  correctIndex: number;
  // Åk 3: L = lokalisering av information, TI = tolkning och integrering
  category?: "L" | "TI";
}

// Åk 3, delprov B: sista uppgiften – numrera meningarna i rätt ordning
export interface OrderingQuestion {
  kind: "ordering";
  id: number;
  maxPoints: 1;
  prompt: string;
  items: string[]; // meningarna i den ordning de visas (A–D)
  correctOrder: number[]; // rätt nummer (1–4) för varje mening i items
}

export interface OpenQuestion {
  kind: "open";
  id: number;
  maxPoints: 1 | 2 | 4;
  prompt: string;
  note?: string; // t.ex. "Du måste skriva två exempel för att få poäng."
  guidance: string; // bedömningsanvisning som visas vid självrättning
  lines: number;
  // Vilka poäng som kan sättas vid självrättning, t.ex. [0, 2, 4].
  // Utelämnas den gäller alla heltal 0..maxPoints.
  pointSteps?: number[];
}

export type Question = MultipleChoiceQuestion | OpenQuestion | OrderingQuestion;

// Illustration som visas i texthäftet/uppgiftshäftet
export interface Illustration {
  src: string; // foto-URL (Unsplash/Wikimedia) eller lokal sökväg
  alt: string;
  fallback?: string; // lokal reservbild som visas om src inte laddar
}

export interface TextSection {
  heading?: string; // mellanrubrik i sakprosatexter
  paragraphs: string[];
}

export interface ReadingTest {
  id: string;
  delprov: string; // t.ex. "Delprov B1: läsa – berättande text"
  textType:
    | "berättande"
    | "sakprosa"
    | "förklarande"
    | "argumenterande"
    | "instruerande"
    | "beskrivande"
    | "utredande"
    | "resonerande";
  title: string;
  image?: Illustration;
  ingress?: string; // sakprosatexter inleds med en ingress
  sections: TextSection[];
  byline: string[];
  footnote?: string;
  questions: Question[];
}

// Bedömt elevexempel som visas efter att eleven skrivit klart
export interface ExampleResponse {
  level: string; // t.ex. "Godtagbar nivå" eller "Högre nivå"
  heading: string; // exempeltextens rubrik
  paragraphs: string[];
  comments: string[]; // kommentarer om varför texten bedöms så
}

export interface WritingTask {
  id: string;
  delprov: string; // t.ex. "Delprov C1: skriva – berättande text"
  textType:
    | "berättelse"
    | "argumenterande"
    | "krönika"
    | "förklarande"
    | "instruerande"
    | "beskrivande"
    | "utredande"
    | "resonerande";
  title: string;
  image?: Illustration;
  intro: string[]; // inledande stycken som sätter scenen
  doThis: string[]; // "Gör det här!"
  topicExamples?: string[]; // exempelämnen (argumenterande)
  supportWords?: string[]; // stödord som ska användas (åk 3, delprov H)
  fixedHeading?: string; // given rubrik (berättelse)
  remember: string[]; // "Kom ihåg!"
  checklist: string[]; // självskattning efter skrivandet
  examples?: ExampleResponse[]; // bedömda exempelsvar
}

export interface Grade {
  id: "ak3" | "ak6" | "ak9";
  label: string;
  available: boolean;
  reading: ReadingTest[];
  writing: WritingTask[];
}
