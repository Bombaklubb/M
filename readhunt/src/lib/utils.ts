import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Publicerar ett elements höjd som CSS-variabel på <html>, så att andra
 * klistrade (sticky) element kan placera sig precis under det. Headern är
 * olika hög på mobil och dator, så en fast siffra hamnade fel.
 */
export function publishHeightAsCssVar(el: HTMLElement | null, name: string): () => void {
  if (!el || typeof ResizeObserver === 'undefined') return () => {};
  const root = document.documentElement;
  const update = () => root.style.setProperty(name, `${el.getBoundingClientRect().height}px`);
  update();
  const ro = new ResizeObserver(update);
  ro.observe(el);
  return () => {
    ro.disconnect();
    root.style.removeProperty(name);
  };
}
