"use client";

import { useEffect, useState } from "react";
import { loadStudent } from "@/lib/storage";
import { getEquippedTheme, getEquippedEffect } from "@/lib/shopStorage";
import { THEME_MAP } from "@/lib/shop";
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

  const theme = themeId ? THEME_MAP[themeId] : null;
  if (!theme && !effectId) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      {theme && (
        <div
          className={`absolute inset-0 ${theme.animated ? "shop-theme-animated" : ""}`}
          style={{ background: theme.css }}
        />
      )}
      {/* Mörk scrim så vit text alltid syns ovanpå mönstret */}
      {theme && <div className="absolute inset-0 bg-black/40" />}
      <EffectOverlay effectId={effectId} />
    </div>
  );
}
