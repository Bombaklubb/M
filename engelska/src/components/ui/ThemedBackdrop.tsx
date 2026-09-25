"use client";

import { useEffect, useState } from "react";
import { loadStudent } from "@/lib/storage";
import { getEquippedTheme, getEquippedEffect } from "@/lib/shopStorage";
import { useThemeArt } from "@/lib/useThemeArt";
import EffectOverlay from "@/components/ui/EffectOverlay";

/**
 * Global bakgrund som visar elevens valda tema + effekt bakom hela appen.
 * Ligger längst bak (-z-10) så sidor med egen ogenomskinlig bakgrund (t.ex.
 * övningssidor) täcker den, medan startsidan visar temat tydligt.
 *
 * Uppdateras direkt när man köper/aktiverar något via "engelskajakten:cosmetics"
 * (skickas från shopStorage), samt vid fönsterfokus och localStorage-ändringar.
 */
export default function ThemedBackdrop() {
  const [themeId, setThemeId] = useState<string | null>(null);
  const [effectId, setEffectId] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      const s = loadStudent();
      if (!s) { setThemeId(null); setEffectId(null); return; }
      setThemeId(getEquippedTheme(s.name));
      setEffectId(getEquippedEffect(s.name));
    };
    sync();
    window.addEventListener("engelskajakten:cosmetics", sync);
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("engelskajakten:cosmetics", sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  const art = useThemeArt(themeId);
  if (!art && !effectId) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      {art && (
        <>
          {/* Fast lager bakom sidan, så en ritad scen står hel på skärmen hur
              lång sidan än är, i stället för att sträckas med innehållet. */}
          <div className="absolute inset-0" style={{ background: art.bg }} />
          {/* En lätt slöja räcker: texten som ligger direkt på temat har egen
              skugga (.on-theme). Förut låg 40 % svart över allt, så varje tema
              såg grumligt ut jämfört med provbiten i affären. */}
          <div className="absolute inset-0 bg-black/10 dark:bg-gray-950/45" />
        </>
      )}
      <EffectOverlay effectId={effectId} />
    </div>
  );
}
