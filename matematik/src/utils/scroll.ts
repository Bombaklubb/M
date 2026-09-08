import { useEffect } from 'react';

/** Scrollar sidan högst upp. */
export function scrollToTop(): void {
  if (typeof window === 'undefined') return;
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
}

/**
 * Scrollar högst upp varje gång innehållet byts.
 *
 * Appen är en single page-app, så webbläsaren behåller scrollpositionen när en
 * ny vy eller en ny uppgift visas. Utan detta hamnar eleven mitt i sidan i
 * stället för vid rubriken och instruktionen.
 */
export function useScrollTop(deps: unknown[]): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { scrollToTop(); }, deps);
}
