# Deployment Instructions för Läs och lär

## Översikt

Appen använder nu en robust server-side lösning med Vercel Serverless Functions för att hantera många samtidiga användare (25-30 elever).

### Vad som är implementerat:

✅ **Server-side kö** - Max 3 samtidiga AI-anrop
✅ **Automatisk retry** - Exponentiell backoff med jitter (max 4 försök)
✅ **Caching** - 10 minuters cache för samma ämne/nivå/texttyp
✅ **Token-optimering** - Max 600 tokens istället för 4000
✅ **Bättre felmeddelanden** - Tydliga kö- och retry-meddelanden
✅ **Logging** - Status, köläge, cache hits/misses

## Deployment till Vercel

### 1. Sätt miljövariabler i Vercel

Gå till Vercel Dashboard → Settings → Environment Variables och lägg till:

```
ANTHROPIC_API_KEY=sk-ant-api03-...
```

**VIKTIGT:** Ta bort `VITE_ANTHROPIC_API_KEY` från miljövariablerna - den används inte längre! API-nyckeln ska endast finnas på servern.

### 2. Deploy till Vercel

```bash
# Commit och pusha ändringar
git add .
git commit -m "feat: Lägg till server-side queue och caching för rate limit-hantering"
git push -u origin claude/build-feature-Rdg4Z

# Vercel deployer automatiskt när du pushar
```

### 3. Verifiera deployment

Efter deployment, testa appen med flera användare samtidigt:
- Öppna appen i flera flikar
- Starta övningar samtidigt
- Kontrollera att kö-systemet fungerar (meddelanden som "står i kö")
- Kontrollera att retry fungerar vid rate limits

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
- Kontrollera att `ANTHROPIC_API_KEY` finns i Vercel Environment Variables
- Verifiera att du använder rätt environment (Production/Preview/Development)

### Problem: Fortfarande rate limit errors
- Kontrollera att du använder den nya API-endpointen (inte direkta Anthropic-anrop)
- Verifiera att caching fungerar (se Vercel Function Logs)
- Överväg att öka `MAX_CONCURRENT` om du har högre rate limits

## Monitoring

Övervaka API-anrop i Vercel Dashboard:
- Functions → generate-exercise → View Logs
- Leta efter:
  - `[QUEUE]` - Kö-status
  - `[CACHE HIT/MISS]` - Cache-träffar
  - `[ATTEMPT X/4]` - Retry-försök
  - `[RETRY]` - Backoff-tider

## Nästa steg (valfritt)

Om du fortfarande upplever problem kan du:
1. Öka cache TTL till 30 minuter
2. Implementera persistent cache (Redis/Upstash)
3. Uppgradera till högre Anthropic tier för fler requests/minut
4. Lägga till pre-genererade övningar som fallback
