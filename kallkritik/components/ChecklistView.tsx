import { ChecklistCategory, CheckStatus } from "@/lib/types";

function icon(s: CheckStatus) {
  if (s === "ok") return "✅";
  if (s === "warn") return "⚠️";
  if (s === "risk") return "❌";
  return "❔";
}

export function ChecklistView({ checklist }: { checklist: ChecklistCategory[] }) {
  return (
    <div className="stack">
      {checklist.map((cat, idx) => (
        <details key={idx}>
          <summary>{cat.category}</summary>
          <div className="stack" style={{ marginTop: 10 }}>
            {cat.checks.map((c, j) => (
              <div key={j} className="card" style={{ boxShadow: "none" }}>
                <div className="row">
                  <strong>{icon(c.status)} {c.name}</strong>
                  <span className="tag">{c.status.toUpperCase()}</span>
                </div>
                {c.evidence?.length ? (
                  <ul className="list">
                    {c.evidence.slice(0, 3).map((e, k) => <li key={k}>{e}</li>)}
                  </ul>
                ) : null}
                <p className="small" style={{ marginTop: 8 }}>
                  <strong>Tips:</strong> {c.tip || "—"}
                </p>
              </div>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
