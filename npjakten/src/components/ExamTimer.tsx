import { useEffect, useState } from "react";

interface Props {
  presets: number[]; // valbara provtider i minuter
}

// Valfri tidtagning som efterliknar provets tidsbegränsning.
// Eleven väljer tid, klockan räknar ner och varnar de sista fem minuterna.
export default function ExamTimer({ presets }: Props) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || secondsLeft === null) return;
    if (secondsLeft <= 0) {
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => (s === null ? null : s - 1)), 1000);
    return () => clearTimeout(t);
  }, [running, secondsLeft]);

  if (secondsLeft === null) {
    return (
      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-2 text-sm">
        <span className="font-semibold text-stone-600">
          ⏱ Provläge – träna med tidsbegränsning:
        </span>
        {presets.map((min) => (
          <button
            key={min}
            onClick={() => {
              setSecondsLeft(min * 60);
              setRunning(true);
            }}
            className="rounded border-2 border-np px-3 py-1 font-bold text-np transition hover:bg-np hover:text-white"
          >
            {min} min
          </button>
        ))}
        <span className="text-stone-400">(valfritt)</span>
      </div>
    );
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeIsUp = secondsLeft <= 0;
  const lastMinutes = secondsLeft <= 5 * 60;

  return (
    <div
      className={
        "sticky top-2 z-20 mb-4 flex items-center justify-between gap-3 rounded-md border-2 px-4 py-2 shadow-page " +
        (timeIsUp
          ? "border-red-600 bg-red-50"
          : lastMinutes
            ? "border-amber-500 bg-amber-50"
            : "border-np bg-white")
      }
    >
      {timeIsUp ? (
        <span className="font-bold text-red-700">
          ⏱ Tiden är ute! På riktiga provet lämnar du in nu – men du får skriva klart här.
        </span>
      ) : (
        <span
          className={
            "font-mono text-xl font-bold tabular-nums " +
            (lastMinutes ? "text-amber-700" : "text-np-dark")
          }
        >
          ⏱ {minutes}:{seconds.toString().padStart(2, "0")}
          {lastMinutes && (
            <span className="ml-2 align-middle text-sm font-semibold">
              – snart slut, läs igenom!
            </span>
          )}
        </span>
      )}
      <button
        onClick={() => {
          setSecondsLeft(null);
          setRunning(false);
        }}
        className="rounded border border-stone-300 px-3 py-1 text-sm font-semibold text-stone-600 hover:bg-stone-100"
      >
        Stäng av
      </button>
    </div>
  );
}
