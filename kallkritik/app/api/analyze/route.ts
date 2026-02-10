import { NextRequest, NextResponse } from "next/server";
import { Report } from "@/lib/types";

// --------- Enkla "rate limit" (minimalt, fungerar okej lokalt; i serverless kan det bli svagare) ----------
const rateMap = new Map<string, { count: number; ts: number }>();
function rateLimit(key: string, limit = 15, windowMs = 60_000) {
  const now = Date.now();
  const v = rateMap.get(key);
  if (!v || now - v.ts > windowMs) {
    rateMap.set(key, { count: 1, ts: now });
    return true;
  }
  if (v.count >= limit) return false;
  v.count += 1;
  rateMap.set(key, v);
  return true;
}

// ----------------- URL & SSRF-skydd -----------------
function normalizeUrl(input: string) {
  let u = input.trim();
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  const url = new URL(u);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Endast http/https tillåts.");
  return url;
}

function isPrivateIp(hostname: string) {
  const h = hostname.toLowerCase();
  if (h === "localhost" || h.endsWith(".local")) return true;
  const m = h.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (!m) return false;
  const a = Number(m[1]), b = Number(m[2]);
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 169 && b === 254) return true;
  return false;
}

// ----------------- Fetch med timeout + storleksgräns -----------------
async function fetchHtml(target: URL) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  const res = await fetch(target.toString(), {
    redirect: "follow",
    signal: controller.signal,
    headers: {
      "user-agent": "KallkritikSpecialisten/1.0 (+educational; safe-fetch)"
    }
  }).finally(() => clearTimeout(timeout));

  const finalUrl = res.url;
  const httpStatus = res.status;

  // max 1.2MB
  const reader = res.body?.getReader();
  if (!reader) return { html: "", finalUrl, httpStatus, headers: Object.fromEntries(res.headers.entries()) };

  let received = 0;
  const chunks: Uint8Array[] = [];
  const max = 1_200_000;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    received += value.length;
    if (received > max) break;
    chunks.push(value);
  }
  const html = new TextDecoder("utf-8").decode(Buffer.concat(chunks as unknown as Uint8Array[]));
  return { html, finalUrl, httpStatus, headers: Object.fromEntries(res.headers.entries()) };
}

// ----------------- Groq call -----------------
function buildPrompt(args: {
  url: string;
  finalUrl: string;
  httpStatus: number;
  headers: Record<string, string>;
  htmlSnippet: string;
}) {
  return `
Du är "Källkritik-Analytikern". Du får INTE hitta på fakta.
Svara alltid med:
(1) Giltig JSON (enbart JSON först, inga backticks)
(2) Sedan en kort sammanfattning för användaren (rubriker)

DATA:
- url: ${args.url}
- finalUrl: ${args.finalUrl}
- httpStatus: ${args.httpStatus}
- headers: ${JSON.stringify(args.headers).slice(0, 3500)}
- htmlSnippet (förkortad): ${args.htmlSnippet}

KRAV PÅ JSON:
{
  "score": 0-100,
  "trafficLight": "green"|"yellow"|"red",
  "riskLevel": "low"|"medium"|"high",
  "verdict": "1-2 meningar",
  "audienceSummary": { "simple": "...", "detailed": "..." },
  "checklist": [
    {
      "category": "Identitet & transparens",
      "checks": [
        { "name": "Kontaktuppgifter finns", "status": "ok|warn|risk|unknown", "evidence": ["..."], "tip": "..." }
      ]
    }
  ],
  "keyFindings": [
    { "signal": "...", "status": "good|mixed|bad|unknown", "evidence": ["..."], "whyItMatters": "..." }
  ],
  "redFlags": ["..."],
  "greenFlags": ["..."],
  "unknowns": ["..."],
  "recommendedChecks": [
    { "action": "...", "how": "...", "expectedOutcome": "..." }
  ],
  "privacySecurity": {
    "claims": ["..."],
    "trackingIndicators": ["..."],
    "permissionsConcerns": ["..."],
    "dataHandlingRisks": ["..."]
  },
  "scamHeuristics": {
    "patternsDetected": ["..."],
    "paymentRisk": "low|medium|high|unknown",
    "impersonationRisk": "low|medium|high|unknown"
  },
  "confidence": 0-1,
  "notes": "Begränsningar"
}

TRAFIKLJUS-LOGIK:
- Grön: tydlig avsändare + transparens + inga starka scam-signaler + teknik normal.
- Gul: blandade signaler eller många okända (saknar policy/avsändare, oklart).
- Röd: tydliga scam/phishing-mönster, suspekt betalning, omdirigeringar, ber om känsliga uppgifter utan skäl.

CHECKLISTA (minst dessa kategorier, fyll med status + evidens + tips):
A) Identitet & transparens
B) Innehåll & källor
C) Teknik & säkerhet
D) Integritet & datahantering
E) Affärsmodell & incitament
F) Bedrägeriheuristik

OBS: Om du saknar data för en punkt → status "unknown" och lägg i unknowns. Sänk confidence.
`.trim();
}

async function callGroq(prompt: string) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY saknas (lägg i .env.local eller Vercel env).");

  const baseUrl = process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1";
  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  const r = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        { role: "system", content: "Du är en strikt källkritik-granskare. Du hittar inte på fakta. Följ JSON-schemat." },
        { role: "user", content: prompt }
      ]
    })
  });

  if (!r.ok) {
    const t = await r.text().catch(() => "");
    throw new Error(`Groq-fel: ${r.status} ${t.slice(0, 200)}`);
  }
  const json = await r.json();
  const text: string = json.choices?.[0]?.message?.content ?? "";
  return text;
}

// ----------------- JSON parse: "JSON först, sen text" -----------------
function extractJsonFirst(text: string) {
  const start = text.indexOf("{");
  if (start < 0) throw new Error("Inget JSON-objekt hittades.");
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (ch === "{") depth++;
    if (ch === "}") depth--;
    if (depth === 0) {
      const jsonStr = text.slice(start, i + 1);
      return { jsonStr };
    }
  }
  throw new Error("Kunde inte avsluta JSON-objektet.");
}

function safeTextSlice(html: string, max = 18000) {
  const noScript = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ");
  const compact = noScript.replace(/\s+/g, " ").trim();
  return compact.slice(0, max);
}

// ----------------- API handler -----------------
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json({ ok: false, error: "För många försök. Vänta en minut och testa igen." }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const inputUrl = String(body.url || "").trim();

  if (!inputUrl) return NextResponse.json({ ok: false, error: "URL saknas." }, { status: 400 });

  let url: URL;
  try {
    url = normalizeUrl(inputUrl);
    if (isPrivateIp(url.hostname)) throw new Error("Den här adressen är blockerad (SSRF-skydd).");
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Ogiltig URL.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }

  const checkedWhat = [
    "Validerade URL + blockerade lokala/private hosts (SSRF-skydd)",
    "Hämtade HTML och följde omdirigeringar (timeout & maxstorlek)",
    "Läste HTTP-headers och statuskod",
    "Skapade en kort textsnutt för källkritisk analys",
    "Anropade LLM (Groq) för struktur: trafikljus + checklista + råd"
  ];

  try {
    const fetched = await fetchHtml(url);
    const htmlSnippet = safeTextSlice(fetched.html);

    const prompt = buildPrompt({
      url: url.toString(),
      finalUrl: fetched.finalUrl,
      httpStatus: fetched.httpStatus,
      headers: fetched.headers,
      htmlSnippet
    });

    const llmText = await callGroq(prompt);
    const { jsonStr } = extractJsonFirst(llmText);

    const report = JSON.parse(jsonStr) as Report;

    return NextResponse.json({
      ok: true,
      url: url.toString(),
      finalUrl: fetched.finalUrl,
      httpStatus: fetched.httpStatus,
      checkedWhat,
      report
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Okänt fel vid analys.";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
