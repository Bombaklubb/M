"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnalyzeResponse } from "@/lib/types";
import { TrafficLightBadge } from "@/components/TrafficLightBadge";
import { ChecklistView } from "@/components/ChecklistView";
import { Tabs } from "@/components/Tabs";

function ResultContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url") || "";
  const mode = (searchParams.get("mode") === "detailed" ? "detailed" : "simple") as "simple" | "detailed";
  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true);
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url, mode, reuse: true })
      });
      const json = await res.json();
      if (alive) {
        setData(json);
        setLoading(false);
      }
    }
    if (url) load();
    return () => { alive = false; };
  }, [url, mode]);

  if (!url) return <div className="card"><h1>Ingen URL</h1><p>Gå tillbaka och klistra in en webbadress.</p></div>;
  if (loading) return <div className="card"><h1>Granskar…</h1><p>Hämtar sida och analyserar.</p></div>;
  if (!data?.ok) return <div className="card"><h1>Kunde inte granska</h1><p>{data?.error || "Okänt fel."}</p></div>;

  const r = data.report!;
  const summary = mode === "simple" ? r.audienceSummary.simple : r.audienceSummary.detailed;

  return (
    <div className="stack">
      <div className="row">
        <a className="badge" href="/">← Ny granskning</a>
        <span className="badge">Vy: {mode === "simple" ? "Elevläge" : "Vuxenläge"}</span>
        <span className="badge mono">{data.finalUrl || url}</span>
      </div>

      <TrafficLightBadge traffic={r.trafficLight} score={r.score} />

      <div className="card">
        <h2>Bedömning</h2>
        <p><strong>{r.verdict}</strong></p>
        <p>{summary}</p>
        <div className="hr" />
        <div className="kv"><span>Risknivå</span><strong>{r.riskLevel.toUpperCase()}</strong></div>
        <div className="kv"><span>Säkerhet i slutsats (confidence)</span><strong>{Math.round(r.confidence * 100)}%</strong></div>
        <div className="kv"><span>HTTP-status</span><strong>{data.httpStatus ?? "Okänt"}</strong></div>
      </div>

      <Tabs
        tabs={[
          {
            id: "checklist",
            label: "Checklista",
            content: (
              <div className="stack">
                <div className="card">
                  <h2>Vad appen gjorde</h2>
                  <ul className="list">
                    {(data.checkedWhat || []).map((x, i) => <li key={i}>{x}</li>)}
                  </ul>
                </div>
                <ChecklistView checklist={r.checklist} />
              </div>
            )
          },
          {
            id: "actions",
            label: "Vad du kan göra nu",
            content: (
              <div className="stack">
                <div className="card">
                  <h2>Rekommenderade kontroller</h2>
                  <div className="stack">
                    {r.recommendedChecks.map((c, i) => (
                      <div key={i} className="card" style={{ boxShadow: "none" }}>
                        <strong>{i + 1}. {c.action}</strong>
                        <p className="small"><strong>Hur:</strong> {c.how}</p>
                        <p className="small"><strong>Du vill se:</strong> {c.expectedOutcome}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <h2>Vad som är osäkert</h2>
                  <ul className="list">
                    {r.unknowns.map((x, i) => <li key={i}>{x}</li>)}
                  </ul>
                  <p className="small"><strong>Notering:</strong> {r.notes}</p>
                </div>
              </div>
            )
          },
          {
            id: "details",
            label: "Detaljer",
            content: (
              <div className="stack">
                <div className="card">
                  <h2>Gröna signaler</h2>
                  <ul className="list">
                    {r.greenFlags.map((x, i) => <li key={i}>{x}</li>)}
                  </ul>
                </div>
                <div className="card">
                  <h2>Röda signaler</h2>
                  <ul className="list">
                    {r.redFlags.map((x, i) => <li key={i}>{x}</li>)}
                  </ul>
                </div>
                <div className="card">
                  <h2>Integritet & säkerhet</h2>
                  <p className="small"><strong>Påståenden:</strong></p>
                  <ul className="list">{r.privacySecurity.claims.map((x, i) => <li key={i}>{x}</li>)}</ul>
                  <p className="small"><strong>Spårning (indikationer):</strong></p>
                  <ul className="list">{r.privacySecurity.trackingIndicators.map((x, i) => <li key={i}>{x}</li>)}</ul>
                </div>
              </div>
            )
          }
        ]}
      />
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="card"><h1>Laddar…</h1></div>}>
      <ResultContent />
    </Suspense>
  );
}
