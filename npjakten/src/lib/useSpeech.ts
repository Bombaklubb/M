import { useEffect, useRef, useState } from "react";

// Uppläsning med webbläsarens talsyntes. En utterance per stycke och köade
// anrop – Chrome klipper annars av långa utterances efter ca 15 sekunder.

const MAX_CHUNK = 250;

function splitLong(chunk: string): string[] {
  if (chunk.length <= MAX_CHUNK) return [chunk];
  const parts: string[] = [];
  for (const sentence of chunk.split(/(?<=[.!?…])\s+/)) {
    if (sentence.length <= MAX_CHUNK) {
      parts.push(sentence);
      continue;
    }
    // Mening utan skiljetecken kan fortfarande vara för lång – dela på ord
    let buf = "";
    for (const word of sentence.split(/\s+/)) {
      if ((buf + " " + word).trim().length > MAX_CHUNK) {
        parts.push(buf.trim());
        buf = word;
      } else {
        buf = (buf + " " + word).trim();
      }
    }
    if (buf) parts.push(buf);
  }
  return parts.filter((s) => s.trim().length > 0);
}

export function useSpeech(chunks: string[]) {
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  const [playing, setPlaying] = useState(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // Röster laddas asynkront – plocka en svensk röst när listan är klar
  useEffect(() => {
    if (!supported) return;
    const pickVoice = () => {
      voiceRef.current =
        window.speechSynthesis
          .getVoices()
          .find((v) => v.lang.toLowerCase().startsWith("sv")) ?? null;
    };
    pickVoice();
    window.speechSynthesis.addEventListener("voiceschanged", pickVoice);
    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", pickVoice);
  }, [supported]);

  // Stoppa uppläsningen när eleven navigerar bort
  useEffect(() => {
    if (!supported) return;
    return () => window.speechSynthesis.cancel();
  }, [supported]);

  // Chrome kan tysta kön utan att vare sig onend eller onerror hörs av.
  // Stäm av mot webbläsarens eget tillstånd så att knappen inte fastnar.
  useEffect(() => {
    if (!supported || !playing) return;
    const id = setInterval(() => {
      const s = window.speechSynthesis;
      if (!s.speaking && !s.pending) setPlaying(false);
    }, 1000);
    return () => clearInterval(id);
  }, [supported, playing]);

  const stop = () => {
    if (supported) window.speechSynthesis.cancel();
    setPlaying(false);
  };

  const start = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const parts = chunks
      .flatMap(splitLong)
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length === 0) return;

    parts.forEach((part, i) => {
      const u = new SpeechSynthesisUtterance(part);
      u.lang = "sv-SE";
      if (voiceRef.current) u.voice = voiceRef.current;
      u.rate = 0.95;
      if (i === parts.length - 1) u.onend = () => setPlaying(false);
      // cancel() ger ofarliga "interrupted"-fel – nollställ bara knappen
      u.onerror = () => setPlaying(false);
      window.speechSynthesis.speak(u);
    });
    setPlaying(true);
  };

  const toggle = () => (playing ? stop() : start());

  return { supported, playing, toggle };
}
