import { TrafficLight } from "@/lib/types";

export function TrafficLightBadge({ traffic, score }: { traffic: TrafficLight; score: number }) {
  const label = traffic === "green" ? "Grön" : traffic === "yellow" ? "Gul" : "Röd";
  const emoji = traffic === "green" ? "🟢" : traffic === "yellow" ? "🟡" : "🔴";
  const dotClass = traffic === "green" ? "green" : traffic === "yellow" ? "yellow" : "red";

  return (
    <div className="card">
      <div className="row">
        <span className={`lightDot ${dotClass}`} />
        <h2 style={{ margin: 0 }}>{emoji} {label} signal</h2>
        <span className="tag">Score: {score}/100</span>
      </div>
      <p className="small" style={{ marginTop: 8 }}>
        Grön = mest tryggt, Gul = osäkert/blandat, Röd = hög risk. Läs alltid checklistan.
      </p>
    </div>
  );
}
