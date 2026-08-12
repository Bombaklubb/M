import { useEffect, useState } from "react";

interface Props {
  presets: number[]; // valbara provtider i minuter
}

// Valfri tidtagning som efterliknar provets tidsbegränsning.
// Eleven väljer tid, klockan räknar ner och varnar de sista fem minuterna.
export default function ExamTimer({ presets }: Props) {
  // Räknar mot en fast sluttid i stället för att räkna ner sekund för sekund.
  // Webbläsare bromsar timers i bakgrundsflikar, vilket annars gör att
  // klockan tappar minuter när eleven byter flik.
  const [deadline, setDeadline] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    if (deadline === null) return;
    const tick = () =>
      setSecondsLeft(Math.max(0, Math.round((deadline - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  const start = (min: number) => {
    setDeadline(Date.now() + min * 60 * 1000);
    setSecondsLeft(min * 60);
  };

  if (secondsLeft === null) {
    return (
      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-2 text-sm">
        <span className="font-semibold text-stone-600">
          ⏱ Provläge – träna med tidsbegränsning:
        </span>
        {presets.map((min) => (
          <button
            key={min}
            type="button"
            onClick={() => start(min)}
            className="rounded border-2 border-np px-3 py-1 font-bold text-np transition hover:bg-np hover:text-white"
          >
            {min} min
          </button>
        ))}
        <span className="text-stone-500">(valfritt)</span>
      </div>
    );
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeIsUp = secondsLeft <= 0;
  const lastMinutes = secondsLeft <= 5 * 60;

  return (
    <div
      aria-live="polite"
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
        type="button"
        onClick={() => {
          setSecondsLeft(null);
          setDeadline(null);
        }}
        className="rounded border border-stone-300 px-3 py-1 text-sm font-semibold text-stone-600 hover:bg-stone-100"
      >
        Stäng av
      </button>
    </div>
  );
}
