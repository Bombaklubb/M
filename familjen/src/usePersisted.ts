import { useEffect, useState } from 'react';

const PREFIX = 'familjetavlan.v1.';

export function usePersisted<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      // Privat surfläge eller full lagring – appen fungerar ändå, utan att spara.
    }
  }, [key, value]);

  return [value, setValue] as const;
}

export type Flags = Record<string, boolean>;

export function toggle(flags: Flags, key: string): Flags {
  return { ...flags, [key]: !flags[key] };
}
