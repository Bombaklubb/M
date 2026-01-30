// Groq-powered free AI for reading comprehension
import Groq from 'groq-sdk';
import { kv } from '@vercel/kv';

// Types
interface GenerateRequest {
  topic: string;
  level: number;
  textType: string;
}

interface CacheEntry {
  data: any;
  timestamp: number;
}

// In-memory cache with 24 hour TTL (perfect for classroom use)
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours - same text can be reused

// Queue management - increased for multiple students
let activeRequests = 0;
const MAX_CONCURRENT = 6; // Allow more concurrent requests for classroom use
const queue: Array<() => Promise<void>> = [];

// Groq client (free tier!)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

// System instruction (optimized for challenging levels)
const SYSTEM_INSTRUCTION = `Du är ett digitalt läsförståelseverktyg för svenska elever.
Skapa UTMANANDE texter och SVÅRA frågor som kräver eftertanke.

⚠️ KRITISKT VIKTIGT - STAVNING OCH GRAMMATIK:
- Du skriver på SVENSKA, inte engelska
- Dubbelkolla VARJE ord innan du svarar
- Vanliga fel att undvika:
  * "och" inte "ock"
  * "mycket" inte "myket"
  * "olika" inte "oliga"
  * "eftersom" inte "efterson"
  * "också" inte "ocksä"
  * Sammansatta ord: "fotbollsmatch" inte "fotboll match"
- Läs igenom HELA texten MINST två gånger innan du skickar den
- Om du är osäker på ett ord, använd ett enklare ord du är säker på

Nivåguide baserad på ÅRSKURS - HÅLL DIG TILL ORDANTALET:

NIVÅ 1-6 (Årskurs 1-3, 6-9 år):
- Nivå 1-2: 150-300 ord. Enkla ord som "hund", "katt", "skola", "mamma". Korta meningar (3-7 ord). Vardagliga situationer.
- Nivå 3-4: 300-500 ord. Lite svårare ord som "förklara", "tillsammans", "förstår". Varierande meningslängd. Konkreta händelser.
- Nivå 5-6: 500-700 ord. Börja introducera ämnesord som "fotosyntesen", "dinosaurie", "planeten". Några bisatser. Mer beskrivande språk.

NIVÅ 7-15 (Årskurs 4-6, 10-12 år):
- Nivå 7-9: 700-1000 ord. Facktermer som "ekosystem", "demokrati", "kultur". Komplexa meningar med bisatser. Kräver sammankoppling av information.
- Nivå 10-12: 1000-1400 ord. Abstrakta begrepp som "rättvisa", "perspektiv", "konsekvens". Argumenterande delar. Kräver tolkning.
- Nivå 13-15: 1400-1800 ord. Avancerade begrepp som "industrialisering", "metabolism", "klimatförändringar". Kräver analys och kritiskt tänkande.

NIVÅ 16-20 (Årskurs 7-9, 13-15 år):
- Nivå 16-17: 1800-2100 ord. Högstadienivå med vetenskapliga begrepp, källkritik, argumentationsanalys.
- Nivå 18-19: 2100-2400 ord. Komplexa resonemang, flera perspektiv, filosofiska frågeställningar.
- Nivå 20: 2400-2800 ord. Gymnasienivå med avancerad argumentation, vetenskaplig metod, samhällsanalys.

VIKTIGT om FRÅGOR - anpassa efter nivå:
Nivå 1-6: Korta, tydliga frågor med konkreta svar. Förklaringar på enkelt språk.
Nivå 7-15: Längre frågor som kräver eftertanke. Förklaringar som utvecklar förståelsen.
Nivå 16-20: Komplexa frågor med flera steg. Djupa förklaringar som analyserar resonemanget.

Alla nivåer ska ha:
- 2 faktafrågor (kräver noggrann läsning och hitta detaljer)
- 2 inferensfrågor (kräver slutsatser från flera delar av texten)
- 2 analysfrågor (kräver djupare förståelse, orsak-verkan, eller sammankoppling)
- Distraktorer (felaktiga svarsalternativ) som är trovärdiga och kräver eftertanke
- DETALJERADE förklaringar som hjälper eleven förstå VARFÖR svaret är rätt och vad de kan lära sig

KOM IHÅG: Perfekt svenska stavning är det VIKTIGASTE! Kvalitet före kvantitet.`;

// Helper: Get cache key
function getCacheKey(topic: string, level: number, textType: string): string {
  return `${topic}:${level}:${textType}`.toLowerCase();
}

// Helper: Check cache
function getFromCache(key: string): any | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    console.log(`[CACHE HIT] Key: ${key}`);
    return entry.data;
  }
  if (entry) {
    cache.delete(key);
  }
  console.log(`[CACHE MISS] Key: ${key}`);
  return null;
}

// Helper: Save to cache
function saveToCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// Helper: Run with concurrency limit
async function runWithConcurrencyLimit<T>(fn: () => Promise<T>): Promise<T> {
  if (activeRequests >= MAX_CONCURRENT) {
    console.log(`[QUEUE] Waiting... (active: ${activeRequests}, queue: ${queue.length})`);
    await new Promise<void>((resolve) => {
      queue.push(async () => resolve());
    });
  }

  activeRequests++;
  console.log(`[QUEUE] Started request (active: ${activeRequests}, queue: ${queue.length})`);

  try {
    return await fn();
  } finally {
    activeRequests--;
    const next = queue.shift();
    if (next) {
      next();
    }
    console.log(`[QUEUE] Finished request (active: ${activeRequests}, queue: ${queue.length})`);
  }
}

// Helper: Retry with exponential backoff + jitter
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 4
): Promise<T> {
  let lastError: any;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`[ATTEMPT ${attempt}/${maxAttempts}]`);
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Check if it's a retryable error (429 or 5xx)
      const isRetryable =
        error?.status === 429 ||
        error?.status === 529 ||
        (error?.status >= 500 && error?.status < 600) ||
        error?.message?.includes('quota') ||
        error?.message?.includes('rate');

      if (!isRetryable || attempt === maxAttempts) {
        throw error;
      }

      // Exponential backoff with jitter: 2^attempt * 1000 + random(0-1000)
      const baseWait = Math.pow(2, attempt) * 1000;
      const jitter = Math.random() * 1000;
      const waitTime = baseWait + jitter;
      console.log(`[RETRY] Exponential backoff: ${waitTime.toFixed(0)}ms`);

      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  throw lastError;
}

// Helper: Get text type label
function getTextTypeLabel(textType: string): string {
  switch (textType.toUpperCase()) {
    case 'NARRATIVE':
      return 'BERÄTTANDE';
    case 'DESCRIPTIVE':
      return 'BESKRIVANDE';
    case 'ARGUMENTATIVE':
      return 'ARGUMENTERANDE';
    default:
      return 'BERÄTTANDE';
  }
}

// Main handler
export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { topic, level, textType } = req.body as GenerateRequest;

    // Validation
    if (!topic || !level || !textType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check cache
    const cacheKey = getCacheKey(topic, level, textType);
    const cached = getFromCache(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    // Generate with queue and retry
    const result = await runWithConcurrencyLimit(async () => {
      return await retryWithBackoff(async () => {
        const textTypeLabel = getTextTypeLabel(textType);

        const prompt = `${SYSTEM_INSTRUCTION}

Skapa en läsförståelseövning:
Ämne: ${topic}
Nivå: ${level} (skala 1-20)
Texttyp: ${textTypeLabel}

KRITISKT - Returnera ENDAST ren JSON, inget annat:
{
  "level": ${level},
  "title": "En kort, engagerande titel",
  "content": "Själva texten som eleven ska läsa",
  "textType": "${textType}",
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice",
      "question": "Frågan?",
      "options": ["Alt A", "Alt B", "Alt C", "Alt D"],
      "correctAnswer": "Det exakta svaret från options",
      "explanation": "Pedagogisk förklaring"
    },
    {
      "id": 2,
      "type": "multiple_choice",
      "question": "Frågan?",
      "options": ["Alt A", "Alt B", "Alt C", "Alt D"],
      "correctAnswer": "Det exakta svaret från options",
      "explanation": "Pedagogisk förklaring"
    },
    {
      "id": 3,
      "type": "multiple_choice",
      "question": "Frågan?",
      "options": ["Alt A", "Alt B", "Alt C", "Alt D"],
      "correctAnswer": "Det exakta svaret från options",
      "explanation": "Pedagogisk förklaring"
    },
    {
      "id": 4,
      "type": "multiple_choice",
      "question": "Frågan?",
      "options": ["Alt A", "Alt B", "Alt C", "Alt D"],
      "correctAnswer": "Det exakta svaret från options",
      "explanation": "Pedagogisk förklaring"
    },
    {
      "id": 5,
      "type": "multiple_choice",
      "question": "Frågan?",
      "options": ["Alt A", "Alt B", "Alt C", "Alt D"],
      "correctAnswer": "Det exakta svaret från options",
      "explanation": "Pedagogisk förklaring"
    },
    {
      "id": 6,
      "type": "multiple_choice",
      "question": "Frågan?",
      "options": ["Alt A", "Alt B", "Alt C", "Alt D"],
      "correctAnswer": "Det exakta svaret från options",
      "explanation": "Pedagogisk förklaring"
    }
  ]
}

REGLER:
- Svara ENDAST med JSON-objektet ovan
- INGEN markdown kod-block (inget \`\`\`json)
- INGEN förklarande text
- Exakt 6 frågor
- correctAnswer måste matcha exakt ett alternativ i options

⚠️ VIKTIGAST AV ALLT - STAVNING:
- Läs igenom texten MINST TVÅ GÅNGER innan du skickar
- Kontrollera att VARJE ord är korrekt stavat på SVENSKA
- Dubbelkolla sammansatta ord (t.ex. "fotbollsmatch" inte "fotboll match")
- Dubbelkolla vanliga ord som "och", "mycket", "olika", "eftersom", "också"
- PERFEKT stavning är viktigare än långa texter`;

        const completion = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile', // Higher quality Swedish, better spelling
          messages: [
            {
              role: 'system',
              content: SYSTEM_INSTRUCTION,
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.8,
          max_tokens: 8192,
          response_format: { type: 'json_object' }, // Force JSON output
        });

        const responseText = completion.choices[0]?.message?.content || '';

        console.error('[DEBUG] GROQ RESPONSE LENGTH:', responseText.length);
        console.error('[DEBUG] GROQ RESPONSE FIRST 500:', responseText.substring(0, 500));

        // Extract JSON from response
        let jsonText = responseText.trim();
        let data;

        // Try parsing directly first
        try {
          data = JSON.parse(jsonText);
          console.error('[DEBUG] SUCCESS - Direct JSON parse worked');
        } catch (directParseError) {
          console.error('[DEBUG] Direct parse failed, attempting extraction...');

          // Remove any markdown code blocks
          jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');

          // Find JSON object
          const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            jsonText = jsonMatch[0];
            console.error('[DEBUG] EXTRACTED JSON length:', jsonText.length);
            console.error('[DEBUG] EXTRACTED JSON first 500:', jsonText.substring(0, 500));

            try {
              data = JSON.parse(jsonText);
              console.error('[DEBUG] SUCCESS - Extracted JSON parse worked');
            } catch (extractError) {
              console.error('[PARSE ERROR] After extraction:', extractError);
              console.error('[JSON TEXT]:', jsonText.substring(0, 500));
              console.error('[RAW RESPONSE]:', responseText.substring(0, 1000));
              throw new Error(`JSON Parse Error: ${responseText.substring(0, 300)}`);
            }
          } else {
            console.error('[NO JSON FOUND] Could not find JSON object in response');
            console.error('[RAW RESPONSE]:', responseText.substring(0, 1000));
            throw new Error(`No JSON found. Response: ${responseText.substring(0, 300)}`);
          }
        }

        // Force the selected level
        data.level = level;

        // Validate
        if (!data.questions || data.questions.length !== 6) {
          console.error('[VALIDATION ERROR] Invalid data structure:', data);
          throw new Error('Invalid question count');
        }

        return data;
      });
    });

    // Log usage to KV for teacher stats
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const usageEntry = {
        timestamp: Date.now(),
        topic,
        level,
        textType,
      };

      // Append to today's usage
      const todayKey = `usage:${today}`;
      const todayEntries: any[] = (await kv.get(todayKey)) || [];
      await kv.set(todayKey, [...todayEntries, usageEntry], { ex: 86400 * 7 }); // 7 day expiry

      // Increment total counter
      await kv.incr('usage:total');

      console.log(`[USAGE LOGGED] Topic: ${topic}, Level: ${level}, Type: ${textType}`);
    } catch (kvError) {
      // Don't fail the request if KV logging fails
      console.error('[KV LOGGING ERROR]', kvError);
    }

    // Save to cache
    saveToCache(cacheKey, result);

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('[ERROR]', error);

    if (error?.status === 429 || error?.message?.includes('quota') || error?.message?.includes('rate')) {
      return res.status(429).json({
        error: 'RATE_LIMIT',
        message: 'Många elever använder appen samtidigt. Appen försöker automatiskt igen - vänta 10-30 sekunder.',
      });
    }

    return res.status(500).json({
      error: 'GENERATION_ERROR',
      message: error?.message || 'Kunde inte generera övning. Försök igen om några sekunder.',
      debug: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
    });
  }
}
