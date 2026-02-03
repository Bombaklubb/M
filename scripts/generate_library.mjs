/**
 * generate_library.mjs  (ONE-FILE generator for Groq -> JSON library)
 *
 * ✅ What it does
 * - Generates Swedish reading-comprehension texts + questions for grades 1–9
 * - Uses your GROQ_API_KEY (stored as env var)
 * - Saves everything into ONE JSON file
 * - Deduplicates, validates, retries if JSON breaks
 *
 * ✅ How to use
 * 1) Set env var GROQ_API_KEY
 * 2) Run:
 *    node scripts/generate_library.mjs --grades 1-9 --count 50 --out lasforstaelse/public/data/library.json
 *
 * Examples:
 * - 50 texts per grade (1..9): node scripts/generate_library.mjs --grades 1-9 --count 50
 * - Only grade 4 and 5: node scripts/generate_library.mjs --grades 4,5 --count 50
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
const gradesArg = getArg("--grades", "1-9");
const countPerGrade = Number(getArg("--count", "50"));
const outFile = getArg("--out", "lasforstaelse/public/data/library.json");
const model = getArg("--model", "llama-3.3-70b-versatile");
const temperature = Number(getArg("--temp", "0.85"));
const maxRetries = Number(getArg("--retries", "4"));
const sleepMs = Number(getArg("--sleep", "300"));

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

// Rules per grade for text length and style
function gradeRules(grade) {
  if (grade === 1) return {
    len: [50, 90],
    style: "Mycket korta och enkla meningar. Vardagliga ord. Inga svåra ord.",
    themes: "djur, familj, vänner, leksaker, mat, skola"
  };
  if (grade === 2) return {
    len: [80, 130],
    style: "Korta meningar. Enkla ord. Tydlig handling.",
    themes: "djur, natur, vänskap, skola, sport, helger"
  };
  if (grade === 3) return {
    len: [120, 180],
    style: "Korta till medellånga meningar. Tydlig struktur. Få svåra ord.",
    themes: "djur, natur, vänskap, äventyr, sport, hobbyer"
  };
  if (grade === 4) return {
    len: [180, 280],
    style: "Varierade meningar. Mer beskrivande språk. Tydlig struktur.",
    themes: "äventyr, mysterium, natur, historia, sport, teknik"
  };
  if (grade === 5) return {
    len: [220, 350],
    style: "Varierade meningar. Beskrivande och förklarande språk.",
    themes: "äventyr, mysterium, vetenskap, historia, samhälle, miljö"
  };
  if (grade === 6) return {
    len: [280, 420],
    style: "Mer komplexa meningar. Rikare ordförråd. Tydliga stycken.",
    themes: "äventyr, mysterium, vetenskap, historia, samhälle, etik, miljö"
  };
  if (grade === 7) return {
    len: [350, 500],
    style: "Komplexa meningar. Avancerat ordförråd. Tematisk djup.",
    themes: "samhälle, vetenskap, etik, historia, framtid, relationer, media"
  };
  if (grade === 8) return {
    len: [400, 550],
    style: "Varierad meningsbyggnad. Akademiskt språk. Abstrakta begrepp.",
    themes: "samhälle, vetenskap, etik, filosofi, historia, framtid, globala frågor"
  };
  return { // grade 9
    len: [450, 600],
    style: "Sofistikerad meningsbyggnad. Avancerat språk. Komplexa idéer.",
    themes: "samhälle, vetenskap, etik, filosofi, politik, globala utmaningar, existentiella frågor"
  };
}

// Build prompt for text generation
function buildPrompt(grade) {
  const r = gradeRules(grade);
  const genre = grade <= 4 ? "berättelse" : "berättelse eller faktatext";

  return `
Skapa 1 läsförståelseuppgift på svenska för ÅRSKURS ${grade}.

TEXTKRAV:
- Längd: ${r.len[0]}–${r.len[1]} ord
- Genre: ${genre}
- Välj tema från: ${r.themes}
- Språkstil: ${r.style}
- Innehållet måste vara skolpassande och intressant för elever i åk ${grade}
- Inga verkliga personer eller känsliga ämnen

FRÅGEKRAV (exakt 6 frågor):
- 3 frågor av typ "literal" (På raderna - svaret finns direkt i texten)
- 3 frågor av typ "inferens" (Mellan raderna - kräver slutledning/tolkning)

För åk ${grade}:
${grade <= 3 ? '- Literal-frågor: "Vad heter...?", "Vad gör...?", "Var är...?"' : ''}
${grade <= 3 ? '- Inferens-frågor: "Varför tror du...?", "Hur känner sig...?", "Vad betyder det att...?"' : ''}
${grade >= 4 && grade <= 6 ? '- Literal-frågor: fakta och detaljer från texten' : ''}
${grade >= 4 && grade <= 6 ? '- Inferens-frågor: orsak/verkan, känslor, budskap' : ''}
${grade >= 7 ? '- Literal-frågor: specifika fakta, citat, händelser' : ''}
${grade >= 7 ? '- Inferens-frågor: tolkning, analys, slutsatser, författarens syfte' : ''}

VIKTIGT:
- Svara ENDAST med giltig JSON (inga backticks, ingen förklaring)
- Frågorna ska kunna besvaras utifrån texten
- Facit ska vara kort och tydligt (max 1-2 meningar)

JSON FORMAT:
{
  "grade": ${grade},
  "genre": "berättelse" eller "faktatext",
  "theme": "kort temaord",
  "title": "kort titel",
  "text": "texten här",
  "questions": [
    {"type": "literal", "q": "fråga 1", "a": "svar"},
    {"type": "literal", "q": "fråga 2", "a": "svar"},
    {"type": "literal", "q": "fråga 3", "a": "svar"},
    {"type": "inferens", "q": "fråga 4", "a": "svar"},
    {"type": "inferens", "q": "fråga 5", "a": "svar"},
    {"type": "inferens", "q": "fråga 6", "a": "svar"}
  ]
}
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
        { role: "system", content: "Du är en expert på att skapa läsförståelseövningar för svenska elever. Svara ENDAST med giltig JSON." },
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

  try {
    return JSON.parse(content);
  } catch {
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
  if (typeof item.text !== "string" || item.text.trim().length < 30) return "Text too short";
  if (!Array.isArray(item.questions) || item.questions.length !== 6) return "Must have exactly 6 questions";

  let literalCount = 0;
  let inferensCount = 0;

  for (const q of item.questions) {
    if (!q || typeof q !== "object") return "Question is not an object";
    if (!["literal", "inferens"].includes(String(q.type))) return "Invalid question type (must be literal or inferens)";
    if (typeof q.q !== "string" || !q.q.trim()) return "Question text missing";
    if (typeof q.a !== "string" || !q.a.trim()) return "Answer missing";

    if (q.type === "literal") literalCount++;
    if (q.type === "inferens") inferensCount++;
  }

  if (literalCount !== 3) return `Must have exactly 3 literal questions (got ${literalCount})`;
  if (inferensCount !== 3) return `Must have exactly 3 inferens questions (got ${inferensCount})`;

  return null;
}

function normalizeItem(item, grade) {
  const id = `ak${grade}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
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

      // Check length
      const r = gradeRules(grade);
      if (norm.meta.wordCount < r.len[0] - 20 || norm.meta.wordCount > r.len[1] + 50) {
        throw new Error(`Length out of range (got ${norm.meta.wordCount} words, expected ${r.len[0]}–${r.len[1]}).`);
      }

      return norm;
    } catch (e) {
      const msg = String(e?.message ?? e);
      console.log(`⚠️ Åk ${grade} försök ${attempt}/${maxRetries} misslyckades: ${msg}`);
      if (attempt === maxRetries) throw e;
      await sleep(500 + attempt * 500);
    }
  }
  throw new Error("Unreachable");
}

async function main() {
  ensureDir(outFile);
  const library = loadLibrary(outFile);

  const existingByGrade = new Map();
  for (const g of grades) {
    existingByGrade.set(g, library.filter(x => Number(x.grade) === g).length);
  }

  console.log(`\n📚 Läsförståelse-generator`);
  console.log(`${"=".repeat(50)}`);
  console.log(`✅ Laddat bibliotek: ${library.length} texter`);
  for (const g of grades) {
    console.log(`   Åk ${g}: ${existingByGrade.get(g) ?? 0} texter`);
  }
  console.log(`\n➡️ Kommer generera ${countPerGrade} texter per årskurs`);
  console.log(`➡️ Årskurser: ${grades.join(", ")}`);
  console.log(`➡️ Utfil: ${outFile}`);
  console.log(`${"=".repeat(50)}\n`);

  let totalGenerated = 0;

  for (const g of grades) {
    console.log(`\n📖 Årskurs ${g}`);
    console.log(`${"-".repeat(30)}`);

    let made = 0;
    let duplicates = 0;

    while (made < countPerGrade) {
      try {
        const item = await generateOne(g);

        if (isDuplicate(library, item)) {
          duplicates++;
          console.log(`   ↩️ Dublett ${duplicates} - försöker igen...`);
          if (duplicates > 10) {
            console.log(`   ⚠️ Många dubletter - fortsätter till nästa årskurs`);
            break;
          }
          continue;
        }

        library.push(item);
        made++;
        totalGenerated++;

        const progress = Math.round((made / countPerGrade) * 100);
        console.log(`   ✅ ${made}/${countPerGrade} (${progress}%) - "${item.title}" (${item.meta.wordCount} ord)`);

        // Save periodically
        if (made % 10 === 0) {
          fs.writeFileSync(outFile, JSON.stringify(library, null, 2), "utf8");
          console.log(`   💾 Sparade ${library.length} texter`);
        }

        await sleep(sleepMs);
      } catch (e) {
        console.log(`   ❌ Fel: ${e.message}`);
        await sleep(1000);
      }
    }

    // Save after each grade
    fs.writeFileSync(outFile, JSON.stringify(library, null, 2), "utf8");
    console.log(`   📊 Klart! Åk ${g}: ${made} nya texter`);
  }

  fs.writeFileSync(outFile, JSON.stringify(library, null, 2), "utf8");
  console.log(`\n${"=".repeat(50)}`);
  console.log(`🎉 Klart! Genererade ${totalGenerated} nya texter`);
  console.log(`📚 Totalt i biblioteket: ${library.length} texter`);
  console.log(`💾 Sparat till: ${outFile}`);
}

main().catch(err => {
  console.error("❌ Generator failed:", err?.message ?? err);
  process.exit(1);
});
