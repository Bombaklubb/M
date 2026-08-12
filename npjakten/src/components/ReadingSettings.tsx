import { useEffect, useState } from "react";
import { safeGet, safeSet } from "../lib/storage";

// Läsinställningar för elever som behöver större text, mer luft eller ett
// typsnitt utan seriffer. Valen sparas och gäller i hela appen.
const OPTIONS = [
  { key: "text-lg-mode", storage: "npjakten-storre-text", label: "Större text" },
  { key: "spacing-mode", storage: "npjakten-mer-luft", label: "Mer luft" },
  { key: "sans-mode", storage: "npjakten-sans", label: "Lättläst typsnitt" },
] as const;

export default function ReadingSettings() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Record<string, boolean>>(() => {
    const start: Record<string, boolean> = {};
    for (const o of OPTIONS) start[o.key] = safeGet(o.storage) === "1";
    return start;
  });

  // Klasserna sitter på <html> så att de når allt innehåll
  useEffect(() => {
    for (const o of OPTIONS) {
      document.documentElement.classList.toggle(o.key, active[o.key]);
    }
  }, [active]);

  const toggle = (key: string, storage: string) => {
    setActive((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      safeSet(storage, next[key] ? "1" : "0");
      return next;
    });
  };

  return (
    <div className="no-print relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        title="Anpassa text och läsbarhet"
        className="rounded border border-white/40 px-3 py-1 text-sm font-semibold text-white transition hover:bg-white/15"
      >
        Aa Läsinställningar
      </button>
      {open && (
        <div className="absolute right-0 z-40 mt-2 w-56 rounded-md border border-stone-300 bg-white p-3 text-left shadow-page">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-np">
            Anpassa läsningen
          </p>
          <ul className="space-y-2">
            {OPTIONS.map((o) => (
              <li key={o.key}>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-700">
                  <input
                    type="checkbox"
                    checked={active[o.key]}
                    onChange={() => toggle(o.key, o.storage)}
                    className="h-4 w-4 accent-np"
                  />
                  {o.label}
                </label>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-stone-500">
            Dina val sparas på den här enheten.
          </p>
        </div>
      )}
    </div>
  );
}
