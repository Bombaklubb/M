import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { isAppUnlocked, unlockApp } from "../lib/access";

// Släpper bara in den som skrivit rätt lösenord. Appen renderas inte alls
// förrän dess, så inga övningar laddas i förväg.
export default function LoginGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(isAppUnlocked);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  if (unlocked) return <>{children}</>;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (unlockApp(input)) {
      setUnlocked(true);
    } else {
      setError(true);
      setInput("");
    }
  };

  return (
    <div className="min-h-screen">
      <header className="np-pattern text-white">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <span className="font-serif text-2xl font-bold tracking-tight">NP-jakten</span>
        </div>
      </header>

      <main className="px-3 py-8 sm:px-6">
        <div className="paper mx-auto max-w-md">
          <p className="text-sm font-semibold uppercase tracking-widest text-np">
            Ämnesprov · Grundskolan
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold leading-tight">
            Välkommen till NP-jakten
          </h1>
          <p className="mt-3 text-stone-600">
            Skriv lösenordet för att komma in. Kontakta din lärare eller{" "}
            <a
              href="mailto:martin.akdogan@enkoping.se"
              className="font-semibold text-np hover:underline"
            >
              Martin
            </a>{" "}
            för att få lösenordet.
          </p>

          <form onSubmit={submit} className="mt-6">
            <label htmlFor="npjakten-losenord" className="text-sm font-semibold">
              Lösenord
            </label>
            <input
              id="npjakten-losenord"
              type="password"
              autoFocus
              autoComplete="current-password"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(false);
              }}
              aria-invalid={error}
              aria-describedby={error ? "npjakten-losenord-fel" : undefined}
              className="mt-1 block w-full rounded border-2 border-stone-300 px-3 py-2 focus:border-np focus:outline-none"
            />
            {error && (
              <p id="npjakten-losenord-fel" role="alert" className="mt-2 text-sm font-semibold text-np-red">
                Fel lösenord. Försök igen.
              </p>
            )}
            <button
              type="submit"
              className="mt-4 w-full rounded border-2 border-np bg-np px-6 py-3 font-semibold text-white transition hover:bg-np-dark"
            >
              Logga in
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
