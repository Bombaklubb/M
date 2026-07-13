/** Liten segerfanfar via WebAudio – ingen ljudfil behövs. Tystnar snällt om ljud är blockerat. */
export function playFanfare(): void {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    // C5 – E5 – G5 – C6, glad dur-arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.13;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.4);
    });
    // Stäng kontexten när sista tonen klingat ut
    setTimeout(() => { ctx.close().catch(() => {}); }, 1200);
  } catch { /* ljud är trevligt men aldrig kritiskt */ }
}
