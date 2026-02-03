/**
 * generate_library.mjs  (ONE-FILE generator for Groq -> JSON library)
 *
 * ✅ What it does
 * - Generates Swedish reading-comprehension texts + questions for grades 1–9
 * - Uses your GROQ_API_KEY (stored as env var)
 * - Saves everything into ONE JSON file: data/library.json
 * - Deduplicates, validates, retries if JSON breaks
 *
 * ✅ How to use (works in Claude Code too)
 * 1) Create a file: scripts/generate_library.mjs  (paste this whole file)
 * 2) Set env var GROQ_API_KEY
 * 3) Run:
 *    node scripts/generate_library.mjs --grades 1-9 --count 20
 *
 * Examples:
 * - 20 texts per grade (1..9): node scripts/generate_library.mjs --grades 1-9 --count 20
 * - Only grade 4 and 5, 50 each: node scripts/generate_library.mjs --grades 4,5 --count 50
 * - Grade 7 only, 200: node scripts/generate_library.mjs --grades 7 --count 200
 *
 * Notes:
 * - "Gratis i användning" = Your website serves the pre-generated JSON. No API calls for users.
 * - You pay Groq usage only when you run this generator.
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
  console.error("❌ Missing GROQ_API_KEY environment variable.");
  process.exit(1);
}

// ---- CLI args ----
const argv = process.argv.slice(2);
function getArg(name, fallback = null) {
  const idx = argv.indexOf(name);
  if (idx === -1) return fallback;
  return argv[idx + 1] ?? fallback;
}
const gradesArg = getArg("--grades", "1-9");      // "1-9" or "4,5" etc
const countPerGrade = Number(getArg("--count", "20"));
const outFile = getArg("--out", "data/library.json");
const model = getArg("--model", "llama-3.3-70b-versatile");
const temperature = Number(getArg("--temp", "0.8"));
const maxRetries = Number(getArg("--retries", "3"));
const sleepMs = Number(getArg("--sleep", "250")); // small throttle

if (!Number.isFinite(countPerGrade) || countPerGrade <= 0) {
  console.error("❌ --count must be a positive number.");
  process.exit(1);
}

// Parse grades like "1-9" or "4,5,7"
function parseGrades(s) {
  s = String(s).trim();
  if (s.includes("-")) {
    const [a, b] = s.split("-").map(x => Number(x.trim()));
    const start = Math.min(a, b), end = Math.max(a, b);
    const arr = [];
    for (let g = start; g <= end; g++) arr.push(g);
    return arr.filter(g => g >= 1 && g <= 9);
  }
  return s.split(",").map(x => Number(x.trim())).filter(g => g >= 1 && g <= 9);
}
const grades = parseGrades(gradesArg);
if (!grades.length) {
  console.error("❌ No valid grades. Use --grades 1-9 or --grades 4,5 etc.");
  process.exit(1);
}

// ---- Output schema (single record) ----
// {
//   id, grade, genre, theme, title, text, questions:[{type,q,a}], meta:{wordCount, approxLevel}
// }

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function loadLibrary(filePath) {
  if (!fs.existsSync(filePath)) return [];
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function sha1(s) {
  return crypto.createHash("sha1").update(String(s)).digest("hex");
}

function wordCount(s) {
  const m = String(s).trim().match(/\S+/g);
  return m ? m.length : 0;
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// Quick "soft rules" per grade for length + question count.
// (Not perfect readability scoring—just guardrails.)
function gradeRules(grade) {
  if (grade <= 1) return { len: [40, 80], q: 5, sentenceHint: "Mycket korta meningar." };
  if (grade === 2) return { len: [70, 120], q: 6, sentenceHint: "Korta meningar, enkel struktur." };
  if (grade === 3) return { len: [90, 160], q: 6, sentenceHint: "Korta meningar, få svåra ord." };
  if (grade <= 6) return { len: [180, 320], q: 8, sentenceHint: "Varierade meningar, tydlig struktur." };
  return { len: [300, 500], q: 10, sentenceHint: "Mer avancerat språk, inferenser och budskap." };
}

// Prompt that strongly forces JSON-only output.
function buildPrompt(grade) {
  const r = gradeRules(grade);

  const themes = grade <= 3
    ? "vardag, djur, vänskap, skola, natur"
    : grade <= 6
      ? "äventyr, mysterium, fakta, historia light, sport"
      : "samhälle, vetenskap, etik, media, historia, framtid";

  const genre = grade <= 3 ? "berättelse" : "berättelse eller faktatext";

  return `
Skapa 1 läsförståelseuppgift på svenska för ÅK ${grade}.

KRAV (viktigt):
- Längd på texten: ${r.len[0]}–${r.len[1]} ord.
- Genre: ${genre}.
- Tema välj från: ${themes}.
- Stil: ${r.sentenceHint}
- Innehåll måste vara skolpassande.
- Inga verkliga personuppgifter eller identifierbara personer.
- Svara ENDAST med giltig JSON (inga backticks, ingen förklaring, ingen extra text).

FORMAT (JSON schema):
{
  "id": "valfri-sträng",
  "grade": ${grade},
  "genre": "berättelse|faktatext",
  "theme": "kort temaord",
  "title": "kort titel",
  "text": "själva texten",
  "questions": [
    {"type":"literal|inferens|ord|sammanfatta", "q":"fråga", "a":"facit-svar"}
  ]
}

FRÅGOR:
- Antal frågor: ${r.q}
- Fördelning (ungefär):
  - literal: 2–3
  - inferens: 1–3 (för åk 1–2 max 1 inferens)
  - ord: 1–2
  - sammanfatta: 1 (för åk 1 kan vara "Vad handlar texten om?")

KVALITET:
- Frågorna ska kunna besvaras utifrån texten.
- Facit ska vara kort och tydligt.
`.trim();
}

async function callGroqJSON(prompt) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      temperature,
      messages: [
        { role: "system", content: "You MUST return ONLY a valid JSON object. No extra text." },
        { role: "user", content: prompt }
      ],
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Groq API error ${res.status}: ${txt}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("No content in Groq response.");

  // Try strict parse first.
  try {
    return JSON.parse(content);
  } catch {
    // If the model wraps JSON with stray text, attempt to extract first {...}.
    const firstBrace = content.indexOf("{");
    const lastBrace = content.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const sliced = content.slice(firstBrace, lastBrace + 1);
      return JSON.parse(sliced);
    }
    throw new Error("Failed to parse JSON from model output.");
  }
}

function validateItem(item) {
  if (!item || typeof item !== "object") return "Item is not an object";
  const required = ["grade", "genre", "theme", "title", "text", "questions"];
  for (const k of required) if (!(k in item)) return `Missing key: ${k}`;

  if (![1,2,3,4,5,6,7,8,9].includes(Number(item.grade))) return "Invalid grade";
  if (!["berättelse", "faktatext"].includes(String(item.genre))) return "Invalid genre";
  if (typeof item.text !== "string" || item.text.trim().length < 20) return "Text too short or missing";
  if (!Array.isArray(item.questions) || item.questions.length < 4) return "Questions missing/too few";

  for (const q of item.questions) {
    if (!q || typeof q !== "object") return "Question is not an object";
    if (!["literal","inferens","ord","sammanfatta"].includes(String(q.type))) return "Invalid question type";
    if (typeof q.q !== "string" || !q.q.trim()) return "Question text missing";
    if (typeof q.a !== "string" || !q.a.trim()) return "Answer missing";
  }
  return null;
}

function normalizeItem(item, grade) {
  const id = item.id && String(item.id).trim() ? String(item.id).trim() : `ak${grade}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const text = String(item.text).trim();
  const wc = wordCount(text);
  return {
    id,
    grade: Number(grade),
    genre: String(item.genre).trim(),
    theme: String(item.theme ?? "").trim() || "blandat",
    title: String(item.title ?? "").trim() || "Läsförståelse",
    text,
    questions: item.questions.map(q => ({
      type: String(q.type).trim(),
      q: String(q.q).trim(),
      a: String(q.a).trim(),
    })),
    meta: {
      wordCount: wc,
      fingerprint: sha1(text.toLowerCase().replace(/\s+/g, " ").trim()),
      generatedAt: new Date().toISOString(),
      model,
    }
  };
}

function isDuplicate(library, normalized) {
  const fp = normalized?.meta?.fingerprint;
  if (!fp) return false;
  return library.some(x => x?.meta?.fingerprint === fp);
}

async function generateOne(grade) {
  const prompt = buildPrompt(grade);
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const raw = await callGroqJSON(prompt);
      raw.grade = Number(grade);

      const err = validateItem(raw);
      if (err) throw new Error(`Validation failed: ${err}`);

      const norm = normalizeItem(raw, grade);

      // Soft length guardrail
      const r = gradeRules(grade);
      if (norm.meta.wordCount < r.len[0] || norm.meta.wordCount > r.len[1] + 30) {
        throw new Error(`Length out of range (got ${norm.meta.wordCount} words, expected ~${r.len[0]}–${r.len[1]}).`);
      }

      // Soft question count guardrail
      if (norm.questions.length !== r.q) {
        // Not fatal, but try to keep consistent
        // We'll accept if it's close (±1), otherwise retry.
        if (Math.abs(norm.questions.length - r.q) > 1) {
          throw new Error(`Question count off (got ${norm.questions.length}, expected ${r.q}).`);
        }
      }

      return norm;
    } catch (e) {
      const msg = String(e?.message ?? e);
      console.log(`⚠️ Grade ${grade} attempt ${attempt}/${maxRetries} failed: ${msg}`);
      if (attempt === maxRetries) throw e;
      await sleep(300 + attempt * 300);
    }
  }
  throw new Error("Unreachable");
}

async function main() {
  ensureDir(outFile);
  const library = loadLibrary(outFile);

  // Quick index by grade (for nicer progress logs)
  const existingByGrade = new Map();
  for (const g of grades) {
    existingByGrade.set(g, library.filter(x => Number(x.grade) === g).length);
  }

  console.log(`✅ Loaded library: ${library.length} items`);
  for (const g of grades) {
    console.log(`   - Existing grade ${g}: ${existingByGrade.get(g) ?? 0}`);
  }
  console.log(`➡️ Will generate ${countPerGrade} per grade for: ${grades.join(", ")}`);
  console.log(`➡️ Output: ${outFile}`);
  console.log("");

  for (const g of grades) {
    let made = 0;
    while (made < countPerGrade) {
      const item = await generateOne(g);

      if (isDuplicate(library, item)) {
        console.log(`↩️ Duplicate detected (grade ${g}) – retrying...`);
        continue;
      }

      library.push(item);
      made++;

      console.log(`✅ Grade ${g}: ${made}/${countPerGrade} (total library: ${library.length})`);
      await sleep(sleepMs);
    }
    console.log("");
  }

  fs.writeFileSync(outFile, JSON.stringify(library, null, 2), "utf8");
  console.log(`🎉 Done! Saved ${library.length} items to ${outFile}`);
}

main().catch(err => {
  console.error("❌ Generator failed:", err?.message ?? err);
  process.exit(1);
});

/*
-------------------------------------------
OPTIONAL (still "online"): GitHub Action
Copy this into: .github/workflows/generate.yml
and store GROQ_API_KEY in GitHub Secrets.

name: Generate library (Groq)

on:
  workflow_dispatch:
    inputs:
      grades:
        description: "Grades, e.g. 1-9 or 4,5"
        required: true
        default: "1-9"
      count:
        description: "Count per grade"
        required: true
        default: "20"

jobs:
  gen:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - name: Generate
        env:
          GROQ_API_KEY: ${{ secrets.GROQ_API_KEY }}
        run: node scripts/generate_library.mjs --grades "${{ inputs.grades }}" --count "${{ inputs.count }}"
      - name: Commit
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add data/library.json
          git commit -m "Update library (grades ${{ inputs.grades }})" || echo "No changes"
          git push
-------------------------------------------
*/
