export type TrafficLight = "green" | "yellow" | "red";
export type RiskLevel = "low" | "medium" | "high";
export type CheckStatus = "ok" | "warn" | "risk" | "unknown";

export type ChecklistCategory = {
  category: string;
  checks: {
    name: string;
    status: CheckStatus;
    evidence: string[];
    tip: string;
  }[];
};

export type Report = {
  score: number;
  trafficLight: TrafficLight;
  riskLevel: RiskLevel;
  verdict: string;
  audienceSummary: { simple: string; detailed: string };
  checklist: ChecklistCategory[];
  keyFindings: { signal: string; status: "good" | "mixed" | "bad" | "unknown"; evidence: string[]; whyItMatters: string }[];
  redFlags: string[];
  greenFlags: string[];
  unknowns: string[];
  recommendedChecks: { action: string; how: string; expectedOutcome: string }[];
  privacySecurity: {
    claims: string[];
    trackingIndicators: string[];
    permissionsConcerns: string[];
    dataHandlingRisks: string[];
  };
  scamHeuristics: {
    patternsDetected: string[];
    paymentRisk: "low" | "medium" | "high" | "unknown";
    impersonationRisk: "low" | "medium" | "high" | "unknown";
  };
  confidence: number;
  notes: string;
};

export type AnalyzeResponse = {
  ok: boolean;
  error?: string;
  url?: string;
  finalUrl?: string;
  httpStatus?: number;
  report?: Report;
  checkedWhat?: string[];
};
