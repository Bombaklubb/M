import { useCallback, useRef } from 'react';

/**
 * Långtryck – ingången till lärarläget.
 *
 * Två sekunder är valt med flit: en elev som råkar vila fingret på loggan
 * kommer inte in, men en lärare som vet om det behöver inte leta efter en
 * knapp som hade behövt synas på skärmen.
 */
export function useLongPress(onLongPress: () => void, ms = 2000) {
  const timer = useRef<number | null>(null);

  const clear = useCallback(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clear();
    timer.current = window.setTimeout(() => {
      timer.current = null;
      onLongPress();
    }, ms);
  }, [clear, ms, onLongPress]);

  return {
    onPointerDown: start,
    onPointerUp: clear,
    onPointerLeave: clear,
    onPointerCancel: clear,
  };
}
