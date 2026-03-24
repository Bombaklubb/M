"use client";

import { useState, useCallback, use, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/ui/Header";
import { loadStudent } from "@/lib/storage";
import { getStage } from "@/lib/stages";
import type { StudentData } from "@/lib/types";
import { HANGMAN_WORDS, shuffle } from "@/lib/gameVocab";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ".split("");
const MAX_LIVES = 6;

interface Props { params: Promise<{ stage: string }> }

export default function HangmanPage({ params }: Props) {
  const { stage: stageId } = use(params);
  const stage = getStage(stageId);
  const [student, setStudent] = useState<StudentData | null>(null);
  useEffect(() => { setStudent(loadStudent()); }, []);
  if (!stage) return notFound();
  return <HangmanGame stageId={stageId} stageName={stage.name} stageEmoji={stage.emoji} student={student} />;
}

function pickWord(stageId: string) {
  const list = HANGMAN_WORDS[stageId] ?? HANGMAN_WORDS.lagstadiet;
  return list[Math.floor(Math.random() * list.length)];
}

function HangmanGame({ stageId, stageName, stageEmoji, student }: {
  stageId: string; stageName: string; stageEmoji: string; student: StudentData | null;
}) {
  const [word, setWord] = useState(() => pickWord(stageId));
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [wins, setWins] = useState(0);
  const [played, setPlayed] = useState(0);

  const wrongGuesses = [...guessed].filter(l => !word.includes(l));
  const livesLeft = MAX_LIVES - wrongGuesses.length;
  const isWon = word.split("").every(l => guessed.has(l));
  const isLost = livesLeft <= 0;
  const phase = isWon ? "won" : isLost ? "lost" : "playing";

  const MASCOTS = [stageEmoji+"😄", stageEmoji+"🙂", stageEmoji+"😐", stageEmoji+"😟", stageEmoji+"😰", stageEmoji+"😵"];
  const mascot = MASCOTS[Math.min(MAX_LIVES - livesLeft, MASCOTS.length - 1)];

  const handleGuess = useCallback((letter: string) => {
    if (guessed.has(letter) || phase !== "playing") return;
    const next = new Set(guessed);
    next.add(letter);
    setGuessed(next);
    const newWrong = [...next].filter(l => !word.includes(l));
    const newLives = MAX_LIVES - newWrong.length;
    const won = word.split("").every(l => next.has(l));
    const lost = newLives <= 0;
    if (won || lost) {
      setPlayed(p => p + 1);
      if (won) setWins(w => w + 1);
    }
  }, [guessed, word, phase]);

  const nextWord = useCallback(() => {
    setWord(pickWord(stageId));
    setGuessed(new Set());
  }, [stageId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0520] via-[#2d0a3d] to-[#1a0520]">
      <Header student={student} />
      <div className="max-w-lg mx-auto px-4 py-4 pt-20">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <Link href={`/world/${stageId}`} onClick={(e) => { const u = new URLSearchParams(); u.set("tab","spel"); }} className="text-pink-400 text-sm font-semibold hover:text-white transition">
            ← Spel
          </Link>
          <div className="text-center">
            <h1 className="text-lg font-black text-white">Hänga gubben</h1>
            <p className="text-white/40 text-xs">{stageName}</p>
          </div>
          <p className="text-white/60 text-xs font-bold text-right">Vunna: {wins}/{played}</p>
        </div>

        {/* Hearts + Mascot */}
        <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-4 py-3 mb-4">
          <div className="flex gap-1.5">
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <span key={i} className={`text-xl transition-all duration-300 ${i < livesLeft ? "scale-100" : "scale-75 opacity-40"}`}>
                {i < livesLeft ? "❤️" : "🖤"}
              </span>
            ))}
          </div>
          <span className="text-2xl">{mascot}</span>
        </div>

        {/* Word display */}
        <div className="bg-white/5 border border-white/10 rounded-2xl py-5 px-3 mb-4 text-center">
          <div className="flex gap-2 justify-center flex-wrap">
            {word.split("").map((letter, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className={`text-xl font-black min-w-[1.5rem] text-center transition-all duration-200 ${
                  guessed.has(letter) ? "text-white" : "text-transparent"
                }`}>
                  {guessed.has(letter) ? letter : "_"}
                </span>
                <div className="h-0.5 w-5 rounded-full bg-white/30 mt-0.5" />
              </div>
            ))}
          </div>
          <p className="text-white/30 text-xs mt-3">{word.length} bokstäver</p>
        </div>

        {/* Win / Lose */}
        {(phase === "won" || phase === "lost") && (
          <div className={`rounded-2xl p-4 mb-4 text-center border ${
            phase === "won" ? "bg-emerald-900/60 border-emerald-500/40" : "bg-red-900/60 border-red-500/40"
          }`}>
            <p className="text-3xl mb-1">{phase === "won" ? "🎉" : "😵"}</p>
            <p className="font-black text-white text-lg mb-1">
              {phase === "won" ? "Rätt! Snyggt jobbat!" : "Rätt svar var:"}
            </p>
            {phase === "lost" && <p className="text-2xl font-black text-red-300 mb-1">{word}</p>}
            <button
              onClick={nextWord}
              className={`mt-3 px-6 py-2 rounded-xl font-black text-white transition cursor-pointer ${
                phase === "won" ? "bg-emerald-600 hover:bg-emerald-500" : "bg-red-700 hover:bg-red-600"
              }`}
            >
              Nästa ord →
            </button>
          </div>
        )}

        {/* Wrong letters */}
        {wrongGuesses.length > 0 && phase === "playing" && (
          <div className="flex gap-1.5 flex-wrap mb-3">
            <span className="text-white/40 text-xs font-bold self-center">Fel:</span>
            {wrongGuesses.map(l => (
              <span key={l} className="text-red-400 text-sm font-black bg-red-900/30 border border-red-700/40 rounded-lg px-2 py-0.5">{l}</span>
            ))}
          </div>
        )}

        {/* Keyboard */}
        <div className="flex flex-wrap gap-1.5 justify-center">
          {ALPHABET.map(letter => {
            const isGuessed = guessed.has(letter);
            const isCorrect = isGuessed && word.includes(letter);
            const isWrong = isGuessed && !word.includes(letter);
            return (
              <button
                key={letter}
                onClick={() => handleGuess(letter)}
                disabled={isGuessed || phase !== "playing"}
                className={`w-9 h-9 rounded-xl font-black text-sm transition-all cursor-pointer ${
                  isCorrect ? "bg-emerald-700/70 text-emerald-200 border border-emerald-500/50 opacity-70 cursor-default"
                  : isWrong ? "bg-red-900/40 text-red-400/50 border border-red-700/30 opacity-50 cursor-default"
                  : phase !== "playing" ? "bg-white/5 text-white/20 border border-white/10 cursor-default"
                  : "bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/40"
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>

        <div className="text-center mt-6">
          <Link href={`/world/${stageId}`} className="text-pink-400 text-sm font-semibold hover:text-white transition">
            ← Tillbaka till Spel
          </Link>
        </div>
      </div>
    </div>
  );
}
