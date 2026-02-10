"use client";

import { useState } from "react";

export function Tabs({
  tabs
}: {
  tabs: { id: string; label: string; content: React.ReactNode }[];
}) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");
  return (
    <div className="stack">
      <div className="row">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            style={{
              background: active === t.id ? "rgba(231,238,252,0.22)" : "rgba(231,238,252,0.14)"
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div>{tabs.find(t => t.id === active)?.content}</div>
    </div>
  );
}
