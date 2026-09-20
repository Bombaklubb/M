import { useState } from 'react';
import type { StudentProfile } from '@/types';
import { findOrCreateProfile, getProfile, getUsers } from '@/lib/storage';
import { play, unlock } from '@/lib/audio';
import { EarButton } from '@/components/EarButton';
import { AVATARER, STANDARD_AVATAR } from '@/data/avatars';
import { cn } from '@/lib/utils';

/**
 * Inloggning.
 *
 * Samma modell som Svenskajakten: eleven skriver sitt namn för att börja
 * ELLER fortsätta. Samma namn ger samma profil, med nivå och framsteg kvar –
 * det är därför findOrCreateProfile finns.
 *
 * Skillnaden mot Svenskajakten är den som målgruppen kräver: en elev som inte
 * kan läsa kan inte heller skriva sitt namn på egen hand. Därför ligger de
 * elever som redan finns på enheten överst som stora ansikten – ett tryck och
 * hon är inne. Namnfältet under är för första gången, och oftast är det
 * läraren som fyller i det.
 *
 * Första tryckningen här låser också upp ljudet; Chrome kräver en
 * användargest innan tal får spelas.
 */
export function LoginView({ onLogin }: { onLogin: (profile: StudentProfile) => void }) {
  const [namn, setNamn] = useState('');
  const [avatar, setAvatar] = useState(STANDARD_AVATAR);
  const users = getUsers();

  const gaIn = (profile: StudentProfile) => {
    unlock();
    void play({ id: 'greet', text: `Hej ${profile.name}!`, lang: 'sv-SE' });
    onLogin(profile);
  };

  const valjBefintlig = (userName: string) => {
    const profile = getProfile(userName);
    if (profile) gaIn(profile);
  };

  const borja = (e?: React.FormEvent) => {
    e?.preventDefault();
    const rensat = namn.trim();
    if (!rensat) return;
    gaIn(findOrCreateProfile(rensat, avatar));
  };

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col justify-center gap-6 px-4 py-6">
      <header className="flex flex-col items-center gap-2">
        <span
          className="grid h-20 w-20 place-items-center rounded-card bg-brand-700 text-4xl
                     font-extrabold text-lime-300"
          aria-hidden
        >
          G
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-brand-700 dark:text-brand-300">
          Grundjakten
        </h1>
      </header>

      {/* Redan upplagda elever – ett tryck på ansiktet räcker. */}
      {users.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-lg font-bold text-ink-500">Tryck på ditt ansikte</h2>
            <EarButton
              size="sm"
              token={{ id: 'lg-1', text: 'Tryck på ditt ansikte.', lang: 'sv-SE' }}
              label="Tryck på ditt ansikte"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {users.map((u) => {
              const profile = getProfile(u);
              return (
                <button
                  key={u}
                  type="button"
                  onClick={() => valjBefintlig(u)}
                  aria-label={`Logga in som ${u}`}
                  className="tile-pop flex flex-col items-center gap-1 bg-white p-4 dark:bg-ink-800"
                >
                  <span className="text-5xl leading-none" aria-hidden>{profile?.avatar ?? '🙂'}</span>
                  <span className="reading text-lg font-bold">{u}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Nytt namn – skriv för att börja eller fortsätta. */}
      <form
        onSubmit={borja}
        className="flex flex-col gap-4 rounded-card border-2 border-brand-200 bg-white p-5
                   dark:border-ink-700 dark:bg-ink-800"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <h2 className="text-2xl font-extrabold">Välkommen!</h2>
            <p className="text-ink-500">Skriv ditt namn för att börja eller fortsätta.</p>
          </div>
          <EarButton
            token={{
              id: 'lg-2',
              text: 'Välkommen! Skriv ditt namn för att börja eller fortsätta.',
              lang: 'sv-SE',
            }}
            label="Välkommen, skriv ditt namn"
          />
        </div>

        <input
          value={namn}
          onChange={(e) => setNamn(e.target.value)}
          onFocus={unlock}
          placeholder="Ditt namn…"
          aria-label="Ditt namn"
          maxLength={30}
          autoComplete="off"
          className="reading w-full rounded-tile border-2 border-ink-300 px-5 py-4 text-2xl
                     dark:bg-ink-900"
        />

        <div className="flex flex-col gap-2">
          <span className="font-bold text-ink-500">Välj din figur</span>
          <div className="grid grid-cols-6 gap-2">
            {AVATARER.map((a) => (
              <button
                key={a}
                type="button"
                aria-label={`Välj figur ${a}`}
                aria-pressed={avatar === a}
                onClick={() => setAvatar(a)}
                className={cn(
                  'tile-pop grid h-14 place-items-center bg-white text-3xl dark:bg-ink-900',
                  avatar === a && 'ring-4 ring-lime-400'
                )}
              >
                <span aria-hidden>{a}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          aria-label="Börja"
          disabled={!namn.trim()}
          className="btn-pop flex items-center justify-center gap-3 rounded-tile border-lime-700
                     bg-lime-500 px-8 py-4 text-2xl font-extrabold text-white disabled:opacity-40"
        >
          <span aria-hidden>▶️</span> Börja
        </button>
      </form>
    </div>
  );
}
