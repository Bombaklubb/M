"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<"simple" | "detailed">("simple");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onAnalyze() {
    setErr(null);
    const u = url.trim();
    if (!u) return setErr("Klistra in en webbadress (URL).");
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: u, mode })
      });
      const json = await res.json();
      if (!json.ok) {
        setErr(json.error || "Något gick fel.");
        setLoading(false);
        return;
      }
      // skicka vidare i query (enkelt) — i production kan du cachea med id
      const q = new URLSearchParams();
      q.set("url", json.url);
      q.set("mode", mode);
      router.push(`/result?${q.toString()}`);
    } catch {
      setErr("Kunde inte analysera just nu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid two">
      <div className="card">
        <h1>Granska en webbadress</h1>
        <p>
          Klistra in en URL. Appen granskar och ger feedback med <strong>Trafikljusmetoden</strong> + en tydlig checklista.
        </p>

        <div className="inputRow" style={{ marginTop: 10 }}>
          <input
            type="text"
            placeholder="https://exempel.se/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button onClick={onAnalyze} disabled={loading}>
            {loading ? "Granskar…" : "Granska"}
          </button>
        </div>

        <div className="row" style={{ marginTop: 10 }}>
          <span className="tag">Målgrupp:</span>
          <button onClick={() => setMode("simple")} style={{ opacity: mode === "simple" ? 1 : 0.75 }}>
            Elevläge (enkel)
          </button>
          <button onClick={() => setMode("detailed")} style={{ opacity: mode === "detailed" ? 1 : 0.75 }}>
            Vuxenläge (fördjupning)
          </button>
        </div>

        {err ? <p style={{ color: "#ffb4b4" }}>{err}</p> : null}

        <div className="hr" />

        <h2>Så funkar Trafikljusmetoden</h2>
        <div className="stack">
          <div className="pill"><span className="lightDot green" /> <strong>Grön:</strong> Ser mest seriöst ut</div>
          <div className="pill"><span className="lightDot yellow" /> <strong>Gul:</strong> Osäkert eller blandade signaler</div>
          <div className="pill"><span className="lightDot red" /> <strong>Röd:</strong> Hög risk (scam/phishing/otydlig avsändare)</div>
        </div>
      </div>

      <div className="card">
        <h2>Vad appen kontrollerar</h2>
        <p className="small">Det här visas också i resultatet som en checklista.</p>
        <ul className="list">
          <li>Omdirigeringar och grundläggande tekniska signaler (https/headers)</li>
          <li>Avsändare: Om-sida, kontaktuppgifter, villkor, policy (om det finns)</li>
          <li>Innehåll: källor, datum, verifierbarhet</li>
          <li>Integritet: cookies/trackers-indikationer, datalöften</li>
          <li>Scam-mönster: brådska/hot, "för bra för att vara sant", konstiga betalningar</li>
          <li>Osäkerheter: vad vi inte kunde bekräfta</li>
        </ul>

        <div className="hr" />

        <h2>Vill du träna?</h2>
        <p>Gå till <a className="badge" href="/learn">Övningar & Quiz</a> för att lära dig källkritik steg för steg.</p>
      </div>
    </div>
  );
}
