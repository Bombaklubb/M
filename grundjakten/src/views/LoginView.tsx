import { useState } from 'react';
import type { StudentProfile } from '@/types';
import { createProfile, getProfile, getUsers } from '@/lib/storage';
import { unlock } from '@/lib/audio';
import { play } from '@/lib/audio';

const AVATARS = ['🦊', '🐻', '🦅', '🐺', '🦁', '🐯', '🦈', '🐲', '🦉', '🐙', '🦎', '🐆'];

/**
 * Inloggning: tryck på ditt ansikte.
 *
 * Återvändande elever behöver inte skriva någonting – de trycker på sin
 * avatar. Namnfältet syns bara när en ny elev läggs till, och då är det
 * oftast läraren som skriver.
 *
 * Första tryckningen här låser också upp ljudet (Chrome kräver en
 * användargest innan tal får spelas).
 */
export function LoginView({ onLogin }: { onLogin: (profile: StudentProfile) => void }) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const users = getUsers();

  const enter = (profile: StudentProfile) => {
    unlock();
    void play({ id: 'greet', text: `Hej ${profile.name}!`, lang: 'sv-SE' });
    onLogin(profile);
  };

  const pickExisting = (userName: string) => {
    const profile = getProfile(userName);
    if (profile) enter(profile);
  };

  const create = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    enter(createProfile(trimmed, avatar));
  };

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-3xl flex-col justify-center gap-10 px-4 py-10">
      <h1 className="text-center text-5xl font-extrabold tracking-tight text-brand-700 dark:text-brand-300">
        Grundjakten
      </h1>

      {!creating && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {users.map((u) => {
              const profile = getProfile(u);
              return (
                <button
                  key={u}
                  type="button"
                  onClick={() => pickExisting(u)}
                  aria-label={`Logga in som ${u}`}
                  className="tile-pop flex flex-col items-center gap-2 bg-white p-6 dark:bg-ink-800"
                >
                  <span className="text-6xl" aria-hidden>{profile?.avatar ?? '🙂'}</span>
                  <span className="text-xl font-bold">{u}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            aria-label="Ny elev"
            onClick={() => { unlock(); setCreating(true); }}
            className="btn-pop mx-auto rounded-tile border-brand-700 bg-brand-500 px-8 py-4
                       text-2xl font-bold text-white"
          >
            <span aria-hidden>➕</span> Ny
          </button>
        </>
      )}

      {creating && (
        <div className="flex flex-col items-center gap-6">
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
            {AVATARS.map((a) => (
              <button
                key={a}
                type="button"
                aria-label={`Välj figur ${a}`}
                onClick={() => setAvatar(a)}
                className={`tile-pop grid h-20 w-20 place-items-center bg-white text-4xl dark:bg-ink-800 ${
                  avatar === a ? 'ring-4 ring-lime-400' : ''
                }`}
              >
                <span aria-hidden>{a}</span>
              </button>
            ))}
          </div>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Namn"
            aria-label="Elevens namn"
            className="reading w-full max-w-sm rounded-tile border-2 border-ink-300 px-5 py-4
                       text-2xl dark:bg-ink-800"
          />

          <div className="flex gap-4">
            <button
              type="button"
              aria-label="Tillbaka"
              onClick={() => setCreating(false)}
              className="btn-pop rounded-tile border-ink-300 bg-ink-100 px-6 py-3 text-xl font-bold
                         dark:border-ink-600 dark:bg-ink-800"
            >
              <span aria-hidden>↩︎</span>
            </button>
            <button
              type="button"
              aria-label="Klar"
              onClick={create}
              disabled={!name.trim()}
              className="btn-pop rounded-tile border-lime-700 bg-lime-500 px-10 py-3 text-2xl
                         font-bold text-white disabled:opacity-40"
            >
              <span aria-hidden>✓</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
