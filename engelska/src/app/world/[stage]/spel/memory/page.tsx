"use client";

import { useState, useEffect, useCallback, useRef, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/ui/Header";
import { loadStudent } from "@/lib/storage";
import { getStage } from "@/lib/stages";
import type { StudentData } from "@/lib/types";

// ── Word pairs per stage ──────────────────────────────────────────────────────

const WORD_PAIRS: Record<string, { sv: string; en: string }[]> = {
  lagstadiet: [
    { sv: "hund",       en: "dog" },
    { sv: "katt",       en: "cat" },
    { sv: "häst",       en: "horse" },
    { sv: "fågel",      en: "bird" },
    { sv: "fisk",       en: "fish" },
    { sv: "röd",        en: "red" },
    { sv: "blå",        en: "blue" },
    { sv: "grön",       en: "green" },
    { sv: "gul",        en: "yellow" },
    { sv: "stor",       en: "big" },
    { sv: "liten",      en: "small" },
    { sv: "äpple",      en: "apple" },
    { sv: "banan",      en: "banana" },
    { sv: "hus",        en: "house" },
    { sv: "bok",        en: "book" },
    { sv: "boll",       en: "ball" },
    { sv: "hand",       en: "hand" },
    { sv: "öga",        en: "eye" },
    { sv: "vatten",     en: "water" },
    { sv: "sol",        en: "sun" },
  ],
  mellanstadiet: [
    { sv: "springa",    en: "run" },
    { sv: "simma",      en: "swim" },
    { sv: "skriva",     en: "write" },
    { sv: "läsa",       en: "read" },
    { sv: "lyssna",     en: "listen" },
    { sv: "snabb",      en: "fast" },
    { sv: "långsam",    en: "slow" },
    { sv: "glad",       en: "happy" },
    { sv: "ledsen",     en: "sad" },
    { sv: "hungrig",    en: "hungry" },
    { sv: "trött",      en: "tired" },
    { sv: "vinter",     en: "winter" },
    { sv: "sommar",     en: "summer" },
    { sv: "vår",        en: "spring" },
    { sv: "höst",       en: "autumn" },
    { sv: "skola",      en: "school" },
    { sv: "lärare",     en: "teacher" },
    { sv: "kompis",     en: "friend" },
    { sv: "familj",     en: "family" },
    { sv: "fotboll",    en: "football" },
  ],
  hogstadiet: [
    { sv: "möjlighet",  en: "opportunity" },
    { sv: "ansvar",     en: "responsibility" },
    { sv: "kunskap",    en: "knowledge" },
    { sv: "förklara",   en: "explain" },
    { sv: "jämföra",    en: "compare" },
    { sv: "analysera",  en: "analyse" },
    { sv: "påverka",    en: "influence" },
    { sv: "miljö",      en: "environment" },
    { sv: "samhälle",   en: "society" },
    { sv: "rättighet",  en: "right" },
    { sv: "skyldighet", en: "obligation" },
    { sv: "forskning",  en: "research" },
    { sv: "teknik",     en: "technology" },
    { sv: "ekonomi",    en: "economy" },
    { sv: "historia",   en: "history" },
    { sv: "framtid",    en: "future" },
    { sv: "lösning",    en: "solution" },
    { sv: "problem",    en: "problem" },
    { sv: "frihet",     en: "freedom" },
    { sv: "rättvisa",   en: "justice" },
  ],
  gymnasiet: [
    { sv: "konsekvens",   en: "consequence" },
    { sv: "perspektiv",   en: "perspective" },
    { sv: "argument",     en: "argument" },
    { sv: "slutsats",     en: "conclusion" },
    { sv: "hypotes",      en: "hypothesis" },
    { sv: "fenomen",      en: "phenomenon" },
    { sv: "abstrakt",     en: "abstract" },
    { sv: "kritisk",      en: "critical" },
    { sv: "hållbar",      en: "sustainable" },
    { sv: "globalisering",en: "globalisation" },
    { sv: "demokrati",    en: "democracy" },
    { sv: "ideologi",     en: "ideology" },
    { sv: "etik",         en: "ethics" },
    { sv: "värdering",    en: "value" },
    { sv: "innovation",   en: "innovation" },
    { sv: "identitet",    en: "identity" },
    { sv: "kulturell",    en: "cultural" },
    { sv: "integration",  en: "integration" },
    { sv: "strategi",     en: "strategy" },
    { sv: "kommunikation",en: "communication" },
  ],
};

// ── Types ─────────────────────────────────────────────────────────────────────

type Difficulty = "easy" | "medium" | "hard";
type Phase = "select" | "playing" | "victory";

interface MemCard {
  uid: number;
  pairId: number;
  lang: "sv" | "en";
  word: string;
  flipped: boolean;
  matched: boolean;
}

const PAIR_COUNTS: Record<Difficulty, number> = { easy: 4, medium: 7, hard: 10 };
const DIFF_LABELS: Record<Difficulty, string> = { easy: "Lätt", medium: "Medel", hard: "Svår" };
const DIFF_EMOJIS: Record<Difficulty, string> = { easy: "🟢", medium: "🟡", hard: "🔴" };

// ── Helpers ───────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildCards(stageId: string, difficulty: Difficulty): MemCard[] {
  const count = PAIR_COUNTS[difficulty];
  const pairs = shuffle(WORD_PAIRS[stageId] ?? WORD_PAIRS.lagstadiet).slice(0, count);
  const cards: MemCard[] = [];
  pairs.forEach((pair, pairId) => {
    cards.push({ uid: pairId * 2,     pairId, lang: "sv", word: pair.sv, flipped: false, matched: false });
    cards.push({ uid: pairId * 2 + 1, pairId, lang: "en", word: pair.en, flipped: false, matched: false });
  });
  return shuffle(cards);
}

// ── Page ──────────────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ stage: string }>;
}

export default function MemoryGamePage({ params }: Props) {
  const { stage: stageId } = use(params);
  const stage = getStage(stageId);
  const [student, setStudent] = useState<StudentData | null>(null);

  useEffect(() => { setStudent(loadStudent()); }, []);

  if (!stage) return notFound();

  return <MemoryGame stageId={stageId} stage={stage} student={student} />;
}

// ── Game component ────────────────────────────────────────────────────────────

function MemoryGame({ stageId, stage, student }: {
  stageId: string;
  stage: ReturnType<typeof getStage> & object;
  student: StudentData | null;
}) {
  const [phase, setPhase]           = useState<Phase>("select");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [cards, setCards]           = useState<MemCard[]>([]);
  const [flippedUids, setFlippedUids] = useState<number[]>([]);
  const [moves, setMoves]           = useState(0);
  const [matches, setMatches]       = useState(0);
  const [seconds, setSeconds]       = useState(0);
  const [locked, setLocked]         = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(0);

  const totalPairs = PAIR_COUNTS[difficulty];

  useEffect(() => {
    if (phase === "playing") {
      startRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setSeconds(Math.floor((Date.now() - startRef.current) / 1000));
      }, 500);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const startGame = useCallback((diff: Difficulty) => {
    setDifficulty(diff);
    setCards(buildCards(stageId, diff));
    setFlippedUids([]);
    setMoves(0);
    setMatches(0);
    setSeconds(0);
    setLocked(false);
    setPhase("playing");
  }, [stageId]);

  const handleCardClick = useCallback((uid: number) => {
    if (locked) return;
    const card = cards.find(c => c.uid === uid);
    if (!card || card.flipped || card.matched) return;
    if (flippedUids.includes(uid)) return;

    const newFlipped = [...flippedUids, uid];
    setCards(prev => prev.map(c => c.uid === uid ? { ...c, flipped: true } : c));
    setFlippedUids(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setLocked(true);
      const [uid1, uid2] = newFlipped;
      const c1 = cards.find(c => c.uid === uid1)!;
      const c2 = card;

      setTimeout(() => {
        const isMatch = c1.pairId === c2.pairId && c1.lang !== c2.lang;
        if (isMatch) {
          setCards(prev => prev.map(c =>
            c.uid === uid1 || c.uid === uid2 ? { ...c, matched: true, flipped: true } : c
          ));
          const newMatches = matches + 1;
          setMatches(newMatches);
          if (newMatches >= totalPairs) {
            if (timerRef.current) clearInterval(timerRef.current);
            setTimeout(() => setPhase("victory"), 600);
          }
        } else {
          setCards(prev => prev.map(c =>
            c.uid === uid1 || c.uid === uid2 ? { ...c, flipped: false } : c
          ));
        }
        setFlippedUids([]);
        setLocked(false);
      }, 900);
    }
  }, [locked, cards, flippedUids, matches, totalPairs]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timeStr = mins > 0 ? `${mins}:${secs.toString().padStart(2, "0")}` : `${secs}s`;
  const score = Math.max(10, 200 - moves * 3 - Math.floor(seconds / 5));

  const gridCols = difficulty === "hard" ? "grid-cols-5" : "grid-cols-4";

  // ── Select screen ──────────────────────────────────────────────────────────
  if (phase === "select") {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
        <Header student={student} />
        <div className="flex-1 max-w-md mx-auto w-full px-4 py-8 pt-24">
          <Link
            href={`/world/${stageId}`}
            className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm mb-6"
          >
            ← Tillbaka till Spel
          </Link>

          <div className="text-center mb-8">
            <div className="text-6xl mb-3">🃏</div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-1">Memory</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Para ihop svenska ord med engelska översättningar!</p>
          </div>

          <div className="space-y-3">
            {(["easy", "medium", "hard"] as Difficulty[]).map((diff) => (
              <button
                key={diff}
                onClick={() => startGame(diff)}
                className={`w-full border-3 rounded-2xl p-4 text-left transition-all hover:-translate-y-0.5 cursor-pointer bg-white dark:bg-gray-800 ${stage!.borderClass}`}
                style={{ boxShadow: "0 4px 0 0 rgba(0,0,0,0.08)" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{DIFF_EMOJIS[diff]}</span>
                    <div>
                      <p className="font-black text-gray-900 dark:text-gray-100 text-base">{DIFF_LABELS[diff]}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">{PAIR_COUNTS[diff] * 2} kort – {PAIR_COUNTS[diff]} par att hitta</p>
                    </div>
                  </div>
                  <span className="text-gray-300 dark:text-gray-600 text-xl">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Victory screen ─────────────────────────────────────────────────────────
  if (phase === "victory") {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
        <Header student={student} />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-sm w-full text-center">
            <div className="text-7xl mb-4 animate-bounce">🎉</div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-1">Grattis!</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Du hittade alla {totalPairs} par!</p>

            <div className={`border-3 ${stage!.borderClass} rounded-2xl p-5 mb-6 grid grid-cols-3 gap-3 text-center`}
              style={{ boxShadow: "0 4px 0 0 rgba(0,0,0,0.08)" }}>
              <div>
                <p className={`text-2xl font-black ${stage!.textClass}`}>{score}</p>
                <p className="text-gray-400 dark:text-gray-500 text-xs">Poäng</p>
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900 dark:text-gray-100">{moves}</p>
                <p className="text-gray-400 dark:text-gray-500 text-xs">Försök</p>
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900 dark:text-gray-100">{timeStr}</p>
                <p className="text-gray-400 dark:text-gray-500 text-xs">Tid</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => startGame(difficulty)}
                className={`w-full py-3 rounded-2xl font-black text-white text-lg ${stage!.colorClass} cursor-pointer`}
                style={{ boxShadow: "0 4px 0 0 rgba(0,0,0,0.2)" }}
              >
                Spela igen – {DIFF_LABELS[difficulty]}
              </button>
              <button
                onClick={() => setPhase("select")}
                className="w-full py-3 rounded-2xl font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
              >
                Välj svårighetsgrad
              </button>
              <Link
                href={`/world/${stageId}`}
                className={`${stage!.textClass} text-sm font-semibold hover:opacity-70 transition`}
              >
                ← Tillbaka till Spel
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Playing screen ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header student={student} />
      <div className="flex-1 max-w-lg mx-auto w-full px-3 py-4 pt-20">
        {/* HUD */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setPhase("select")}
            className={`${stage!.textClass} text-sm font-semibold hover:opacity-70 transition cursor-pointer`}
          >
            ← Avsluta
          </button>
          <div className="flex items-center gap-3 text-sm font-bold text-gray-600 dark:text-gray-300">
            <span>⏱ {timeStr}</span>
            <span>🔄 {moves}</span>
            <span className={stage!.textClass}>✓ {matches}/{totalPairs}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mb-4 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${stage!.colorClass}`}
            style={{ width: `${(matches / totalPairs) * 100}%` }}
          />
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-3 justify-center text-xs text-gray-400 dark:text-gray-500 font-semibold">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-blue-200 dark:bg-blue-800 inline-block" />🇸🇪 Svenska
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-rose-200 dark:bg-rose-800 inline-block" />🇬🇧 Engelska
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-800 inline-block" />✓ Match!
          </span>
        </div>

        {/* Card grid */}
        <div className={`grid ${gridCols} gap-2`}>
          {cards.map(card => (
            <CardTile
              key={card.uid}
              card={card}
              stageEmoji={stage!.emoji}
              onClick={handleCardClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Card tile ─────────────────────────────────────────────────────────────────

function CardTile({ card, stageEmoji, onClick }: {
  card: MemCard;
  stageEmoji: string;
  onClick: (uid: number) => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const bgClass = card.matched
    ? "bg-green-100 dark:bg-green-900/40 border-green-300 dark:border-green-600"
    : card.flipped
      ? card.lang === "sv"
        ? "bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-600"
        : "bg-rose-100 dark:bg-rose-900/40 border-rose-300 dark:border-rose-600"
      : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-750";

  const textClass = card.matched
    ? "text-green-800 dark:text-green-200"
    : card.flipped
      ? card.lang === "sv" ? "text-blue-800 dark:text-blue-200" : "text-rose-800 dark:text-rose-200"
      : "text-gray-300 dark:text-gray-600";

  return (
    <button
      onClick={() => onClick(card.uid)}
      disabled={card.flipped || card.matched}
      className={`relative min-h-[72px] rounded-xl border-2 flex flex-col items-center justify-center p-2 font-bold transition-all duration-200 select-none cursor-pointer ${bgClass}
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
        ${!card.flipped && !card.matched ? "active:scale-95" : ""}
      `}
      style={{ transition: "opacity 0.25s, transform 0.25s" }}
    >
      {card.matched ? (
        <>
          <span className="text-xs mb-0.5">{card.lang === "sv" ? "🇸🇪" : "🇬🇧"}</span>
          <span className="text-center leading-tight text-[11px] text-green-700 dark:text-green-300 font-bold">{card.word}</span>
          <span className="absolute top-0.5 right-1 text-green-500 text-xs font-black">✓</span>
        </>
      ) : card.flipped ? (
        <>
          <span className="text-xs mb-0.5">{card.lang === "sv" ? "🇸🇪" : "🇬🇧"}</span>
          <span className={`text-center leading-tight text-[11px] font-black ${textClass}`}>{card.word}</span>
        </>
      ) : (
        <>
          <span className="text-xl opacity-30">{stageEmoji}</span>
          <span className="text-gray-300 dark:text-gray-600 text-xs font-black">?</span>
        </>
      )}
    </button>
  );
}
