import { useSpeech } from "../lib/useSpeech";

interface Props {
  chunks: string[];
}

// "Lyssna på texten" – motsvarar uppläsningsanpassningen på riktiga proven.
// Visas inte alls i webbläsare utan talsyntes.
export default function ReadAloudButton({ chunks }: Props) {
  const { supported, playing, toggle } = useSpeech(chunks);

  if (!supported) return null;

  return (
    <button
      onClick={toggle}
      title={playing ? "Stoppa uppläsningen" : "Få texten uppläst"}
      className="no-print text-sm font-medium text-stone-400 transition hover:text-np hover:underline"
    >
      {playing ? "⏹ Sluta lyssna" : "🔊 Lyssna på texten"}
    </button>
  );
}
