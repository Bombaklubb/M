import { useState } from 'react';
import type { LevelBand, Progress, StudentProfile } from '@/types';
import { LEVEL_BANDS } from '@/types';
import { PROGRESSION_STEPS, MAX_STEP } from '@/data/progression';
import { LETTER_BY_ID, LETTERS } from '@/data/letters';
import {
  exportAllData, getUsers, importAllData, removeUser,
  saveProfile, saveProgress, setTeacherPin,
} from '@/lib/storage';
import { emptyProgress } from '@/types';
import { hasSwedishVoice } from '@/lib/speech';
import { play } from '@/lib/audio';

/**
 * Lärarläget.
 *
 * Det här är enda stället i appen där läsning förväntas – det är vuxen-UI,
 * med vanlig text och vanliga kontroller.
 */
export function TeacherView({
  profile,
  progress,
  onProfileChange,
  onProgressChange,
  onExit,
}: {
  profile: StudentProfile;
  progress: Progress;
  onProfileChange: (p: StudentProfile) => void;
  onProgressChange: (p: Progress) => void;
  onExit: () => void;
}) {
  const [pin, setPin] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  const update = (patch: Partial<StudentProfile>) => {
    const next = { ...profile, ...patch };
    saveProfile(next);
    onProfileChange(next);
  };

  const resetStudent = () => {
    if (!confirm(`Nollställ all data för ${profile.name}?`)) return;
    const fresh = emptyProgress();
    saveProgress(profile.name, fresh);
    onProgressChange(fresh);
    setMsg('Elevens data är nollställd.');
  };

  const doExport = () => {
    const blob = new Blob([exportAllData()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grundjakten-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const doImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importAllData(String(reader.result));
      setMsg(ok ? 'Backup inläst. Ladda om sidan.' : 'Kunde inte läsa filen.');
    };
    reader.readAsText(file);
  };

  const sessions = [...progress.sessions].slice(-10).reverse();

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">Lärarläge</h1>
        <button
          type="button"
          onClick={onExit}
          className="btn-pop rounded-tile border-ink-300 bg-ink-100 px-5 py-2 font-bold
                     dark:border-ink-600 dark:bg-ink-800"
        >
          Stäng
        </button>
      </header>

      {msg && <p className="rounded-tile bg-lime-100 px-4 py-3 font-semibold text-lime-800">{msg}</p>}

      {!hasSwedishVoice() && (
        <p className="rounded-tile bg-amberx-100 px-4 py-3 font-semibold text-amberx-800">
          Ingen svensk röst hittades på den här datorn. Appen fungerar, men uttalet blir fel.
          På en Chromebook brukar sv-SE finnas – testa i Chrome i stället.
        </p>
      )}

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Elev: {profile.name}</h2>
        <p className="text-ink-500">
          {getUsers().length} elev(er) på den här enheten.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Nivå</h2>
        <p className="text-ink-500">Styr vilka övningstyper eleven möter.</p>
        <div className="grid gap-3">
          {LEVEL_BANDS.map((b) => (
            <button
              key={b.band}
              type="button"
              onClick={() => update({ level: b.band as LevelBand })}
              className={`rounded-tile border-2 px-5 py-4 text-left ${
                profile.level === b.band
                  ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/40'
                  : 'border-ink-200 dark:border-ink-700'
              }`}
            >
              <span className="block font-bold">{b.band}. {b.title}</span>
              <span className="block text-sm text-ink-500">{b.desc}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Bokstavssteg</h2>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={1}
            max={MAX_STEP}
            value={profile.progressionStep}
            onChange={(e) => update({ progressionStep: Number(e.target.value) })}
            className="flex-1"
            aria-label="Bokstavssteg"
          />
          <span className="w-10 text-center text-xl font-bold">{profile.progressionStep}</span>
        </div>
        <p className="text-sm text-ink-500">
          Steg {profile.progressionStep}:{' '}
          {PROGRESSION_STEPS.find((s) => s.step === profile.progressionStep)
            ?.letters.map((id) => LETTER_BY_ID[id]?.upper).join(' ')}
        </p>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={profile.stepLockedByTeacher}
            onChange={(e) => update({ stepLockedByTeacher: e.target.checked })}
          />
          <span>Lås steget (appen höjer det inte automatiskt)</span>
        </label>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Bokstäver som sitter</h2>
        <div className="flex flex-wrap gap-2">
          {LETTERS.map((l) => {
            const m = progress.letters[l.id];
            const tone = m?.mastered
              ? 'bg-lime-400 text-ink-900'
              : m?.seen
                ? 'bg-amberx-300 text-ink-900'
                : 'bg-ink-200 text-ink-500 dark:bg-ink-700';
            return (
              <span
                key={l.id}
                title={`${l.upper}: ${m?.correct ?? 0} rätt av ${m?.seen ?? 0}`}
                className={`reading grid h-11 w-9 place-items-center rounded-tile text-lg font-bold ${tone}`}
              >
                {l.upper}
              </span>
            );
          })}
        </div>
        <p className="text-sm text-ink-500">
          Grå = inte mött än · Gul = övar · Grön = sitter
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Så går det</h2>
        {sessions.length === 0 && <p className="text-ink-500">Inga pass ännu.</p>}
        <ul className="space-y-1">
          {sessions.map((s, i) => (
            <li key={i} className="text-ink-600 dark:text-ink-300">
              {s.date} · {s.module} · {s.firstTryCorrect} av {s.items} rätt på första försöket
              {' '}({Math.round(s.seconds / 60)} min)
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Ljud</h2>
        <button
          type="button"
          onClick={() => void play({ id: 'test', text: 'Det här är den svenska rösten.', lang: 'sv-SE' })}
          className="btn-pop rounded-tile border-aqua-700 bg-aqua-500 px-5 py-3 font-bold text-white"
        >
          Testa rösten
        </button>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Data</h2>
        <p className="text-sm text-ink-500">
          All data ligger bara i den här webbläsaren. Byter eleven Chromebook, eller rensar
          skolan webbläsardata, försvinner framstegen. Spara en backup då och då.
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={doExport}
            className="btn-pop rounded-tile border-ink-300 bg-ink-100 px-5 py-3 font-bold dark:bg-ink-800">
            Spara backup
          </button>
          <label className="btn-pop cursor-pointer rounded-tile border-ink-300 bg-ink-100 px-5 py-3
                            font-bold leading-[2rem] dark:bg-ink-800">
            Läs in backup
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && doImport(e.target.files[0])}
            />
          </label>
          <button type="button" onClick={resetStudent}
            className="btn-pop rounded-tile border-amberx-700 bg-amberx-500 px-5 py-3 font-bold text-white">
            Nollställ elevens data
          </button>
          <button
            type="button"
            onClick={() => {
              if (!confirm(`Ta bort ${profile.name} helt?`)) return;
              removeUser(profile.name);
              onExit();
            }}
            className="btn-pop rounded-tile border-ink-400 bg-white px-5 py-3 font-bold dark:bg-ink-800">
            Ta bort eleven
          </button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Byt PIN</h2>
        <div className="flex gap-3">
          <input
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            inputMode="numeric"
            placeholder="Ny 4-siffrig PIN"
            className="rounded-tile border-2 border-ink-300 px-4 py-3 dark:bg-ink-800"
          />
          <button
            type="button"
            disabled={pin.length !== 4}
            onClick={() => { setTeacherPin(pin); setPin(''); setMsg('PIN ändrad.'); }}
            className="btn-pop rounded-tile border-brand-700 bg-brand-500 px-5 py-3 font-bold
                       text-white disabled:opacity-40"
          >
            Spara
          </button>
        </div>
      </section>
    </div>
  );
}
