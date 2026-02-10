export type QuizLevel = "easy" | "medium" | "hard";

export type QuizQuestion = {
  id: string;
  level: QuizLevel;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  trafficLightHint: "green" | "yellow" | "red";
};

export const quizBank: QuizQuestion[] = [
  {
    id: "q1",
    level: "easy",
    question: "Du hittar en sida som lovar 'Gratis iPhone – bara idag!'. Vad är bästa första reaktionen?",
    options: [
      "Klicka snabbt innan erbjudandet försvinner",
      "Backa och kontrollera avsändare, domän och om sidan verkar seriös",
      "Skriv in bankkort direkt för att säkra erbjudandet"
    ],
    correctIndex: 1,
    explanation:
      "Brådska och 'för bra för att vara sant' är vanliga varningssignaler. Kontrollera avsändare, kontaktinfo och källor först.",
    trafficLightHint: "red"
  },
  {
    id: "q2",
    level: "easy",
    question: "Vilken sak är mest 'grön signal' på en informationssida?",
    options: [
      "Tydlig avsändare + kontaktuppgifter + policy/villkor",
      "Många popups som ber dig tillåta notiser",
      "Ingen information om vem som står bakom"
    ],
    correctIndex: 0,
    explanation:
      "Transparens är starkt: vem står bakom, hur når du dem och vilka regler gäller.",
    trafficLightHint: "green"
  },
  {
    id: "q3",
    level: "medium",
    question: "En artikel saknar datum och källor men delas mycket i sociala medier. Vad är rimlig bedömning?",
    options: [
      "Den är sann eftersom många delar den",
      "Det är en gul signal – du behöver kontrollera källor och datum",
      "Det är alltid röd signal och måste vara falskt"
    ],
    correctIndex: 1,
    explanation:
      "Spridning är inte bevis. Utan källor/datum blir det osäkert (gul). Leta efter originalkälla och uppdatering.",
    trafficLightHint: "yellow"
  },
  {
    id: "q4",
    level: "hard",
    question: "Vilket är ett tecken på möjlig phishing (nätfiske)?",
    options: [
      "Domänen är exakt som den officiella och du kom dit via bokmärke",
      "Sidan ber om inloggning via länk i ett sms och domänen är nästan lik (bokstavsbyte)",
      "Sidan har tydlig policy och kontaktuppgifter"
    ],
    correctIndex: 1,
    explanation:
      "Phishing använder ofta sms/mejl-länkar och domäner som liknar originalet (typo-squatting). Gå via officiell adress själv.",
    trafficLightHint: "red"
  }
];
