import { GoogleGenerativeAI } from '@google/generative-ai';

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

// In-memory cache with 10 min TTL
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// Queue management
let activeRequests = 0;
const MAX_CONCURRENT = 3;
const queue: Array<() => Promise<void>> = [];

// Google Gemini client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// System instruction (optimized for paid tier)
const SYSTEM_INSTRUCTION = `Du är ett digitalt läsförståelseverktyg för svenska elever.
Skapa engagerande texter och pedagogiska frågor.

Nivåguide (1-20):
- Nivå 1-2: 50-150 ord. Enkla meningar. Vardagliga ord.
- Nivå 3-4: 150-350 ord. Varierat ordförråd.
- Nivå 5-6: 350-650 ord. Mer avancerat språk.
- Nivå 7-9: 650-1000 ord. Högstadietexter.
- Nivå 10-20: 1000-1500 ord. Utmaningsnivåer.

6 frågor: 3 fakta (direkt i texten) + 3 inferens (slutsatser).
Alla frågor har 4 alternativ där ett är rätt.`;

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

Returnera endast giltigt JSON:
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
    }
  ]
}

VIKTIGT:
- Texten ska vara intressant och engagerande
- Exakt 6 frågor med 4 alternativ vardera (3 "på raderna" + 3 "mellan raderna")
- correctAnswer måste matcha exakt ett alternativ i options`;

        const model = genAI.getGenerativeModel({
          model: 'gemini-2.5-flash',
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 2048,
            responseMimeType: "application/json",
          },
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();

        // With responseMimeType: "application/json", response should be clean JSON
        // But keep fallback extraction just in case
        let jsonText = responseText.trim();

        // Try to parse directly first (should work with JSON mode)
        let data;
        try {
          data = JSON.parse(jsonText);
        } catch (parseError) {
          // Fallback: Try extracting from markdown code blocks
          console.log('[JSON MODE FAILED] Attempting extraction from markdown...');

          const patterns = [
            /```json\s*([\s\S]*?)\s*```/,
            /```\s*([\s\S]*?)\s*```/,
            /\{[\s\S]*\}/
          ];

          for (const pattern of patterns) {
            const match = responseText.match(pattern);
            if (match) {
              jsonText = match[1] || match[0];
              jsonText = jsonText.replace(/^```json?\s*/, '').replace(/\s*```$/, '').trim();
              break;
            }
          }

          // Try parsing again after extraction
          try {
            data = JSON.parse(jsonText);
          } catch (secondError) {
            console.error('[JSON PARSE ERROR] Failed to parse:', jsonText.substring(0, 500));
            console.error('[RAW RESPONSE]:', responseText.substring(0, 1000));
            throw new Error('AI returned invalid JSON format');
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

    // Save to cache
    saveToCache(cacheKey, result);

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('[ERROR]', error);

    if (error?.status === 429 || error?.message?.includes('quota') || error?.message?.includes('rate')) {
      return res.status(429).json({
        error: 'RATE_LIMIT',
        message: 'För många förfrågningar. Vänta en stund.',
      });
    }

    return res.status(500).json({
      error: 'GENERATION_ERROR',
      message: 'Kunde inte generera övning. Försök igen.',
    });
  }
}
