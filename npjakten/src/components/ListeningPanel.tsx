import { useState } from "react";
import type { ListeningTest } from "../types";
import { useSpeech } from "../lib/useSpeech";
import IllustrationImg from "./IllustrationImg";

interface Props {
  test: ListeningTest;
}

// Hörförståelse: manuset läses upp av talsyntesen med engelsk röst.
// Manuset visas aldrig på skärmen – då vore det ett läsprov i stället.
export default function ListeningPanel({ test }: Props) {
  const [plays, setPlays] = useState(0);
  const { supported, playing, toggle } = useSpeech(
    test.script.map((line) => line.text),
    "en-GB"
  );

  const max = test.maxPlays ?? 2;

  const handleClick = () => {
    if (!playing) setPlays((p) => p + 1);
    toggle();
  };

  return (
    <>
      {test.image && (
        <IllustrationImg
          image={test.image}
          className="mt-5 aspect-video w-full rounded-md object-cover"
        />
      )}

      {test.intro && <p className="mt-4 leading-relaxed">{test.intro}</p>}

      <div className="no-print mt-5 rounded-md border-2 border-np bg-np-light p-5 text-center">
        {supported ? (
          <>
            <button
              type="button"
              onClick={handleClick}
              className="rounded-md bg-np px-8 py-3 text-lg font-bold text-white transition hover:bg-np-dark"
            >
              {playing ? "⏹ Stoppa" : plays === 0 ? "▶ Spela upp" : "▶ Spela upp igen"}
            </button>
            <p className="mt-3 text-sm text-stone-600">
              {plays === 0
                ? `På det riktiga provet får du höra texten ${max} gånger.`
                : `Du har lyssnat ${plays} ${plays === 1 ? "gång" : "gånger"} – på det riktiga provet hörs texten ${max} gånger.`}
            </p>
            <p className="mt-1 text-xs text-stone-500">
              Läs gärna frågorna först, och anteckna medan du lyssnar.
            </p>
          </>
        ) : (
          <p className="text-sm text-stone-600">
            Din webbläsare kan inte spela upp texten. Be din lärare läsa upp manuset
            i stället.
          </p>
        )}
      </div>

    </>
  );
}
