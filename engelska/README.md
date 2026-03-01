# Engelskajakten

Gratis engelskträningsapp för åk 1–gymnasiet. Byggd med Next.js, fullt statisk export.

## Kom igång

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # Statisk export till /out
```

## Driftsättning (Vercel)

1. Pusha till GitHub
2. Anslut repo till Vercel (Free tier)
3. Build command: `npm run build`
4. Output directory: `out`

## Lägga till innehåll

Redigera JSON-filerna i `public/content/<stadiet>/content.json`.

### Grammatikmodul (exempel)
```json
{
  "id": "unikt-id",
  "title": "Titel",
  "description": "Beskrivning",
  "icon": "📝",
  "pointsRequired": 0,
  "bonusPoints": 20,
  "exercises": [ ... ]
}
```

### Övningstyper
- `"type": "multiple-choice"` – flerval
- `"type": "fill-in-blank"` – fyll i luckan (använd `___` i meningen)
- `"type": "build-sentence"` – bygg meningen

### Läsmodul
```json
{
  "id": "unikt-id",
  "title": "Titel",
  "text": "Texten...\n\nMed stycken separerade av tomrader.",
  "questions": [ ... ]
}
```

### Frågetyper (läsförståelse)
- `"type": "on-the-line"` – svaret finns direkt i texten
- `"type": "between-the-lines"` – kräver slutledning
- `"type": "beyond-the-lines"` – kräver analys/tolkning

## Poängsystem
- 10 poäng per rätt svar
- Bonuspoäng om ≥60% rätt vid avslutad modul
- Moduler kan låsas med `pointsRequired` (elevens totala poäng)
