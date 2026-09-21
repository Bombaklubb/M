/**
 * Ljudeffekter genererade med WebAudio-oscillatorer.
 *
 * Inga ljudfiler: inget att ladda, inget som kan 404:a, inga licenser, och
 * framför allt fungerar de även när talsyntesen är upptagen – vilket den
 * ofta är precis när feedbacken ska spelas.
 */

import { ljudetArAv } from './ljud';

let ctx: AudioContext | null = null;

function context(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, startAt: number, duration: number, type: OscillatorType, gain: number): void {
  // Alla effekter går genom tone(), så den här raden tystar dem allihop.
  if (ljudetArAv()) return;
  const ac = context();
  if (!ac) return;
  const osc = ac.createOscillator();
  const vol = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  vol.gain.setValueAtTime(0, ac.currentTime + startAt);
  vol.gain.linearRampToValueAtTime(gain, ac.currentTime + startAt + 0.01);
  vol.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + startAt + duration);
  osc.connect(vol).connect(ac.destination);
  osc.start(ac.currentTime + startAt);
  osc.stop(ac.currentTime + startAt + duration + 0.02);
}

/** Rätt svar: stigande tvåklang. */
export function playCorrect(): void {
  tone(660, 0, 0.14, 'sine', 0.22);
  tone(990, 0.1, 0.22, 'sine', 0.2);
}

/**
 * Fel svar: en mjuk, låg duns – aldrig ett surrande "fel"-läte.
 * Det ska låta som att brickan studsade tillbaka, inte som ett underkännande.
 */
export function playMiss(): void {
  tone(200, 0, 0.16, 'triangle', 0.16);
}

/** Bricka som landar i rätt lucka. */
export function playPlace(): void {
  tone(520, 0, 0.07, 'sine', 0.14);
}

/** Passet klart. */
export function playFanfare(): void {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.3, 'sine', 0.18));
}

/** Kistan öppnas. */
export function playChest(): void {
  tone(392, 0, 0.12, 'sine', 0.16);
  tone(523, 0.1, 0.12, 'sine', 0.16);
  tone(784, 0.2, 0.4, 'sine', 0.2);
}
