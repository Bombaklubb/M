import { useState } from "react";
import type { ReactNode } from "react";
import { isFacitUnlocked, unlockFacit } from "../lib/facit";

interface Props {
  // Facit renderas först när det låsts upp och öppnats – innehållet finns
  // alltså inte i sidan medan eleven arbetar.
  children: () => ReactNode;
  label?: string;
  // Knapp som skriver ut facit, visas bredvid "Dölj facit"
  onPrint?: () => void;
  printLabel?: string;
  alwaysUnlocked?: boolean;
}

export default function FacitGate({
  children,
  label = "Facit",
  onPrint,
  printLabel = "🖨 Skriv ut facit",
  alwaysUnlocked = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(() => alwaysUnlocked || isFacitUnlocked());
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockFacit(password)) {
      setUnlocked(true);
      setError(false);
      setPassword("");
    } else {
      setError(true);
    }
  };

  if (!open) {
    return (
      <div className="no-print mt-8 text-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-md border-2 border-stone-300 px-6 py-2 text-sm font-bold text-stone-600 transition hover:border-np hover:text-np"
        >
          🔒 {label}
        </button>
        <p className="mt-2 text-xs text-stone-500">
          Facit är lösenordsskyddat och är tänkt för läraren.
        </p>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="no-print mx-auto mt-8 max-w-md rounded-md border-2 border-np bg-np-light p-5">
        <h2 className="font-serif text-lg font-bold">{label}</h2>
        <p className="mt-1 text-sm text-stone-600">
          Skriv lösenordet för att se facit.
        </p>
        <form onSubmit={submit} className="mt-3 flex flex-wrap gap-2">
          <label className="sr-only" htmlFor="facit-losenord">
            Lösenord
          </label>
          <input
            id="facit-losenord"
            type="password"
            autoFocus
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="Lösenord"
            className="flex-1 rounded border-2 border-stone-300 p-2 focus-visible:border-np focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-np"
          />
          <button
            type="submit"
            className="rounded-md bg-np px-5 py-2 font-bold text-white transition hover:bg-np-dark"
          >
            Visa facit
          </button>
        </form>
        {error && (
          <p role="alert" className="mt-2 text-sm font-semibold text-np-red">
            Fel lösenord. Försök igen.
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError(false);
            setPassword("");
          }}
          className="mt-3 text-xs font-semibold text-stone-500 hover:text-np hover:underline"
        >
          Avbryt
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="no-print flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md border-2 border-stone-300 px-5 py-2 text-sm font-bold text-stone-600 transition hover:border-np hover:text-np"
        >
          Dölj {label.toLowerCase()}
        </button>
        {onPrint && (
          <button
            type="button"
            onClick={onPrint}
            className="text-sm font-medium text-stone-500 transition hover:text-np hover:underline"
          >
            {printLabel}
          </button>
        )}
      </div>
      <div className="mt-4">{children()}</div>
    </div>
  );
}
