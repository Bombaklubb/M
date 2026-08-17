/** Liten segerfanfar via WebAudio – ingen ljudfil behövs. Tystnar snällt om ljud är blockerat. */

type Ctor = typeof AudioContext;

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  try {
    const Ctx: Ctor | undefined =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: Ctor }).webkitAudioContext;
    if (!Ctx) return null;
    // Återanvänd samma kontext – webbläsare tillåter bara ett fåtal per sida.
    if (!ctx || ctx.state === 'closed') ctx = new Ctx();
    return ctx;
  } catch { return null; }
}

export function playFanfare(): void {
  const audio = getContext();
  if (!audio) return;

  // iOS/Safari startar kontexten i "suspended" tills den återupptas efter en
  // användarhandling. Utan detta blir fanfaren helt tyst på iPhone och iPad.
  const start = () => {
    try {
      // C5 – E5 – G5 – C6, glad dur-arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const osc = audio.createOscillator();
        const gain = audio.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const t = audio.currentTime + i * 0.13;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
        osc.connect(gain).connect(audio.destination);
        osc.start(t);
        osc.stop(t + 0.4);
      });
    } catch { /* ljud är trevligt men aldrig kritiskt */ }
  };

  if (audio.state === 'suspended') audio.resume().then(start).catch(() => {});
  else start();
}
