import { useSpeech } from "../lib/useSpeech";

interface Props {
  chunks: string[];
  // compact = liten ikonknapp, används vid enskilda uppgifter
  compact?: boolean;
  label?: string;
}

// "Lyssna" – motsvarar uppläsningsanpassningen på de riktiga proven, där
// framför allt frågor och instruktioner läses upp för den som behöver det.
// Visas inte alls i webbläsare utan talsyntes.
export default function ReadAloudButton({ chunks, compact, label }: Props) {
  const { supported, playing, toggle } = useSpeech(chunks);

  if (!supported) return null;

  const title = playing ? "Stoppa uppläsningen" : "Lyssna på uppläsning";

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggle}
        title={title}
        aria-label={playing ? "Sluta lyssna" : "Lyssna på uppgiften"}
        className="no-print rounded px-1 text-base leading-none text-stone-500 transition hover:text-np"
      >
        {playing ? "⏹" : "🔊"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      title={title}
      className="no-print text-sm font-medium text-stone-500 transition hover:text-np hover:underline"
    >
      {playing ? "⏹ Sluta lyssna" : `🔊 ${label ?? "Lyssna på texten"}`}
    </button>
  );
}
