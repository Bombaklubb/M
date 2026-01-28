# Deployment Instructions för Läs och lär

## Översikt

Appen använder nu **Google Gemini AI** med en robust server-side lösning via Vercel Serverless Functions för att hantera många samtidiga användare (25-30 elever).

### Vad som är implementerat:

✅ **Google Gemini 2.5 Flash** - Gratis upp till 250 requests/dag
✅ **Server-side kö** - Max 3 samtidiga AI-anrop
✅ **Automatisk retry** - Exponentiell backoff med jitter (max 4 försök)
✅ **Caching** - 10 minuters cache för samma ämne/nivå/texttyp
✅ **Token-optimering** - Effektiv användning av AI-resurser
✅ **Bättre felmeddelanden** - Tydliga kö- och retry-meddelanden
✅ **Logging** - Status, köläge, cache hits/misses

## Deployment till Vercel

### 1. Skaffa Google API-nyckel (GRATIS)

1. Gå till: https://aistudio.google.com/app/apikey
2. Logga in med ditt Google-konto
3. Klicka på **"Create API Key"**
4. Kopiera nyckeln (börjar med `AIza...`)

### 2. Sätt miljövariabler i Vercel

Gå till Vercel Dashboard → Settings → Environment Variables och lägg till:

```
GOOGLE_API_KEY=AIza...
```

**VIKTIGT:**
- Ta bort `ANTHROPIC_API_KEY` från miljövariablerna om den finns
- API-nyckeln ska endast finnas på servern

### 3. Deploy till Vercel

```bash
# Commit och pusha ändringar
git add .
git commit -m "feat: Byt till Google Gemini för gratis AI-generering"
git push -u origin claude/build-feature-Rdg4Z

# Vercel deployer automatiskt när du pushar
```

### 4. Verifiera deployment

Efter deployment, testa appen med flera användare samtidigt:
- Öppna appen i flera flikar
- Starta övningar samtidigt
- Kontrollera att kö-systemet fungerar (meddelanden som "står i kö")
- Kontrollera att retry fungerar vid rate limits

**Gratis tier begränsningar (Gemini 2.5 Flash):**
- 250 requests per dag (gratis)
- 10 requests per minut
- 250,000 tokens per minut
- Detta räcker för en klass med cache (ca 8-10 texter per elev)

## Lokal utveckling

För att köra lokalt med nya API-funktionen:

```bash
# 1. Installera Vercel CLI (om du inte har det)
npm i -g vercel

# 2. Länka projektet
vercel link

# 3. Hämta environment variables
vercel env pull .env.local

# 4. Starta dev-servern
vercel dev
```

**OBS:** Använd `vercel dev` istället för `npm run dev` för att köra API-routes lokalt.

## Tekniska detaljer

### Cache
- In-memory cache med 10 minuters TTL
- Cache-nyckel: `${topic}:${level}:${textType}`
- Automatisk rensning av gamla entries

### Kö-system
- Max 3 samtidiga AI-anrop
- Övriga requests står i kö
- FIFO (First In, First Out)

### Retry-logik
- Max 4 försök
- Exponentiell backoff: 2^attempt * 1000ms + jitter
- Respekterar `retry-after` header från API
- Endast retryable errors (429, 5xx)

### Token-optimering
- Reducerat från 4000 till 600 max tokens
- Kortare system instruction
- Fokuserad prompt

## Felsökning

### Problem: "Method not allowed"
- Kontrollera att API-routes finns i `/api/`-mappen
- Verifiera att `vercel.json` är korrekt konfigurerad

### Problem: "Missing API key"
- Kontrollera att `GOOGLE_API_KEY` finns i Vercel Environment Variables
- Verifiera att du använder rätt environment (Production/Preview/Development)
- Nyckeln ska börja med `AIza...`

### Problem: Fortfarande rate limit errors
- Kontrollera att du använder den nya API-endpointen (inte direkta Gemini-anrop)
- Verifiera att caching fungerar (se Vercel Function Logs)
- Gemini free tier: 10 req/min - kö-systemet hjälper dig hantera detta

## Monitoring

Övervaka API-anrop i Vercel Dashboard:
- Functions → generate-exercise → View Logs
- Leta efter:
  - `[QUEUE]` - Kö-status
  - `[CACHE HIT/MISS]` - Cache-träffar
  - `[ATTEMPT X/4]` - Retry-försök
  - `[RETRY]` - Backoff-tider

## Kostnader och begränsningar

**Google Gemini 2.5 Flash Free Tier (2026):**
- 250 requests/dag - GRATIS
- 10 requests/minut - GRATIS
- 250,000 tokens/minut - GRATIS
- För en klass: Räcker för ca 8-10 texter per elev med cache
- Kommersiell användning tillåten

**Om du behöver mer:**
- Gemini 2.5 Flash Lite: 20 requests/dag (gratis, inte tillräckligt)
- Gemini 2.5 Pro: 100 requests/dag (gratis, lägre hastighet)
- Aktivera betalning för obegränsad användning: https://aistudio.google.com/

## Nästa steg (valfritt)

Om du behöver ännu bättre prestanda:
1. Öka cache TTL till 30 minuter
2. Implementera persistent cache (Redis/Upstash)
3. Uppgradera till Gemini Pro för högre rate limits
4. Lägga till pre-genererade övningar som fallback
