"use client";

import { useMemo, useState } from "react";
import { quizBank, QuizLevel, QuizQuestion } from "@/lib/quizBank";

function dot(t: "green" | "yellow" | "red") {
  const cls = t === "green" ? "green" : t === "yellow" ? "yellow" : "red";
  const label = t === "green" ? "Grön" : t === "yellow" ? "Gul" : "Röd";
  return <span className="pill"><span className={`lightDot ${cls}`} /> <strong>{label}</strong></span>;
}

export default function LearnPage() {
  const [level, setLevel] = useState<QuizLevel>("easy");
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);

  const questions = useMemo(() => quizBank.filter(q => q.level === level), [level]);
  const q: QuizQuestion | undefined = questions[index];

  function reset(newLevel?: QuizLevel) {
    if (newLevel) setLevel(newLevel);
    setIndex(0);
    setScore(0);
    setAnswered(null);
  }

  function answer(i: number) {
    if (answered !== null) return;
    setAnswered(i);
    if (q && i === q.correctIndex) setScore(s => s + 1);
  }

  function next() {
    setAnswered(null);
    setIndex(i => Math.min(i + 1, questions.length));
  }

  const done = index >= questions.length;

  return (
    <div className="grid two">
      <div className="card">
        <h1>Övningar & Quiz</h1>
        <p>
          Träna källkritik med Trafikljusmetoden. Efter varje svar får du en förklaring.
        </p>

        <div className="row" style={{ marginTop: 10 }}>
          <span className="tag">Nivå:</span>
          <button onClick={() => reset("easy")} style={{ opacity: level === "easy" ? 1 : 0.75 }}>Lätt</button>
          <button onClick={() => reset("medium")} style={{ opacity: level === "medium" ? 1 : 0.75 }}>Medel</button>
          <button onClick={() => reset("hard")} style={{ opacity: level === "hard" ? 1 : 0.75 }}>Svår</button>
        </div>

        <div className="hr" />

        <h2>Mini-övning: 3 snabba frågor du alltid kan ställa</h2>
        <ul className="list">
          <li><strong>Vem</strong> står bakom? (avsändare, kontaktuppgifter)</li>
          <li><strong>Varför</strong> finns innehållet? (incitament, reklam, påverkan)</li>
          <li><strong>Hur</strong> kan jag kontrollera? (källor, datum, flera oberoende källor)</li>
        </ul>
      </div>

      <div className="card">
        {!q && !done ? (
          <div>
            <h2>Inga frågor på den nivån</h2>
            <p>Lägg till fler frågor i <span className="mono">lib/quizBank.ts</span>.</p>
          </div>
        ) : done ? (
          <div className="stack">
            <h2>Klart!</h2>
            <p>Poäng: <strong>{score}</strong> av <strong>{questions.length}</strong></p>
            <button onClick={() => reset(level)}>Kör igen</button>
            <a className="badge" href="/">Granska en URL</a>
          </div>
        ) : (
          <div className="stack">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <span className="badge">Fråga {index + 1}/{questions.length}</span>
              {dot(q!.trafficLightHint)}
            </div>

            <h2 style={{ marginTop: 0 }}>{q!.question}</h2>

            <div className="stack">
              {q!.options.map((opt, i) => {
                const isCorrect = i === q!.correctIndex;
                const isPicked = answered === i;
                const bg =
                  answered === null ? "rgba(231,238,252,0.06)" :
                  isCorrect ? "rgba(46,229,157,0.18)" :
                  isPicked ? "rgba(255,90,95,0.18)" : "rgba(231,238,252,0.06)";

                return (
                  <button
                    key={i}
                    onClick={() => answer(i)}
                    style={{ textAlign: "left", background: bg }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {answered !== null ? (
              <div className="card" style={{ boxShadow: "none" }}>
                <p className="small">
                  {answered === q!.correctIndex ? "Rätt!" : "Inte riktigt."}
                </p>
                <p className="small">{q!.explanation}</p>
                <button onClick={next}>Nästa</button>
              </div>
            ) : null}

            <p className="small">
              Tips: Koppla alltid tillbaka till trafikljuset: <strong>Grön</strong> (transparens), <strong>Gul</strong> (okända saker), <strong>Röd</strong> (scam/phishing-mönster).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
