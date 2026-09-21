import { useSyncExternalStore } from 'react';
import { ljudSnapshot, prenumereraLjud, vaxlaLjud } from '@/lib/ljud';

/** Ljudläget som React-tillstånd. Alla knappar visar samma sanning. */
export function useLjud(): { av: boolean; vaxla: () => void } {
  const av = useSyncExternalStore(prenumereraLjud, ljudSnapshot, () => false);
  return { av, vaxla: vaxlaLjud };
}
