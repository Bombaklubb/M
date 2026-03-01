// Web Audio API sound effects — no external resources needed

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return ctx;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  gainValue = 0.3
): void {
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ac.currentTime);
    gain.gain.setValueAtTime(gainValue, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + duration);
  } catch {
    // Audio not supported — fail silently
  }
}

export function playCorrect(): void {
  playTone(523, 0.1);  // C5
  setTimeout(() => playTone(659, 0.1), 100); // E5
  setTimeout(() => playTone(784, 0.2), 200); // G5
}

export function playWrong(): void {
  playTone(300, 0.15, "sawtooth", 0.2);
  setTimeout(() => playTone(250, 0.2, "sawtooth", 0.15), 150);
}

export function playComplete(): void {
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2), i * 120);
  });
}

export function playClick(): void {
  playTone(800, 0.05, "square", 0.1);
}
