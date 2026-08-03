# Readhunt – specifikation för nya texter

Följ den här specen varje gång nya texter skapas till `public/data/library.json`.
Den bygger på användarens ursprungliga prompt, anpassad till appens faktiska schema.

## Alltid 5 texter per omgång

---

## 1. Schema (appens riktiga format)

Användarens ursprungliga prompt använde `category` och `word_count` på toppnivå.
**Appen använder inte det formatet.** Konvertera alltid till detta:

```json
{
  "id": "ak8-tema-006",
  "grade": 8,
  "genre": "fiction | non-fiction",
  "theme": "gaming",
  "title": "Textens titel",
  "text": "Själva texten...",
  "imageUrl": "https://images.unsplash.com/photo-...?w=800&q=80",
  "questions": [
    { "type": "literal | inference", "q": "Fråga?", "options": ["A","B","C","D"], "correct": 0 }
  ],
  "meta": { "wordCount": 548, "readingTime": 4 }
}
```

Fältmappning från den ursprungliga prompten:

| Ursprunglig prompt | Appens schema |
|---|---|
| `category` (svenska) | `theme` (engelsk slug, se tabell nedan) |
| `word_count` | `meta.wordCount` (+ `meta.readingTime`) |
| — | `genre` krävs: `fiction` / `non-fiction` |
| — | `type` krävs på **varje** fråga |
| — | `imageUrl` krävs (innehållsmatchad Unsplash-bild) |

`readingTime` = `max(1, round(wordCount / 150))`.

`meta.wordCount` **beräknas alltid från den faktiska texten** med skript — skriv aldrig
siffran för hand.

---

## 2. ID – KRITISK REGEL

Den ursprungliga prompten säger *"Börja alltid från 001"*. **Gör inte det.**
Det skriver över befintliga texter (har hänt: hela textset förlorades).

**Regel:** behåll formatet `ak[årskurs]-tema-[NNN]` men **fortsätt numreringen**
från det högsta befintliga numret för den årskursen. Återanvänd heller aldrig
ID:n från borttagna texter — elever som läst det gamla ID:t får då aldrig se den
nya texten (den filtreras som redan läst).

Kontrollera alltid mot befintliga ID:n innan något skrivs.

---

## 3. Textlängd per årskurs

| Åk | Ord | Åk | Ord |
|---|---|---|---|
| 1 | 20–40 | 6 | 400–415 |
| 2 | 40–50 | 7 | 500–530 |
| 3 | 60–80 | 8 | 530–570 |
| 4 | 150–220 | 9 | 570–590 |
| 5 | 300–320 | 10 (gymnasiet) | 590–625 |

Texterna är på **engelska** (Readhunt är en engelsk läsförståelseapp).

## 4. Språknivå

- **Åk 1–3:** korta meningar, enkla ord, konkreta ämnen
- **Åk 4–6:** längre texter, mer abstrakta begrepp, ämnesord förklaras
- **Åk 7–9:** komplexa texter, facktermer, kritiskt tänkande
- **Gymnasiet:** större utmaning

---

## 5. Frågor

- **Exakt 6 frågor** per text
- **Exakt 4 alternativ** per fråga
- Blanda `literal` (på raderna) och `inference` (mellan raderna) – ca 3+3
- Blanda frågetyper: faktafrågor (vad/när/var), förståelsefrågor (varför/hur),
  huvudbudskap (vad handlar texten främst om)
- Frågorna behöver **inte** ligga literal-först; UI:t visar bara antal per typ

### Svarsfördelning (kritiskt)

- `correct` är 0-indexerat: A=0, B=1, C=2, D=3
- Fördela jämnt: 1–2 frågor per position över de 6 frågorna
- Aldrig samma position mer än 2 gånger i rad
- Lägg **aldrig** alla rätta svar på samma index (har varit en bugg i 13 texter)

### Distraktorer (särskilt åk 7–gymnasiet)

- Alla fyra alternativ ska vara **rimliga och ligga nära varandra**
- Inga uppenbart absurda alternativ
- Eleven ska behöva läsa och förstå texten – inte kunna gissa på det som sticker ut
- Undvik "alla ovanstående" / "inget av ovanstående"
- Inga positionsreferenser ("både A och B") – alternativen blandas om

### Alternativens längd

- Rätt svar får **inte** systematiskt vara det längsta
- Variera: ibland kortast, ibland längst, ibland mittemellan
- Samma detaljnivå på alla fyra

---

## 6. Kategorier → `theme`

| Kategori (prompt) | `theme` |
|---|---|
| Sagor, Skönlitteratur, Litteratur | `literature` |
| Vetenskap | `science` |
| Kultur | `culture` |
| Geografi, Natur & Miljö | `nature` / `environment` |
| Teknik | `technology` |
| Hälsa | `health` |
| Sport | `sport` |
| Mat | `food` |
| Mänskliga rättigheter, Samhälle, Värdegrund | `society` |
| Tv-spel / dataspel | `gaming` |
| Djur | `animals` |
| Film | `art` |
| Musik | `music` |
| Historia | `history` |

Övriga giltiga teman: `community`, `dance`, `family`, `food-science`, `football`,
`friendship`, `horses`, `everyday life`, `psychology`, `sports`.

**Nytt tema måste läggas till i `src/lib/themes.ts`** (emoji + gradient), annars
visas en generisk banner.

---

## 7. Mångfald

I minst 1 av de 5 texterna:

- Blanda kön; undvik stereotyper
- Variera ålder: barn, ungdomar, vuxna, äldre
- Olika familjekonstellationer och livssituationer
- Personer med olika förmågor och funktionsvariationer
- Koppla inte yrken/intressen till specifika kön eller etniciteter

---

## 8. Kontrollera FÖRE skrivning till library.json

Kör alltid ett valideringsskript som verifierar:

- [ ] Inga ID-krockar med befintliga texter
- [ ] Exakt 6 frågor, exakt 4 alternativ per fråga
- [ ] `correct` 0–3 och pekar på ett giltigt alternativ
- [ ] Svarsfördelning jämn, aldrig alla på samma index
- [ ] Rätt svar inte alltid längst
- [ ] Inga dubblettalternativ inom en fråga
- [ ] Ordantal inom årskursens intervall
- [ ] `meta.wordCount` beräknat från faktisk text
- [ ] `theme` finns i `themes.ts`
- [ ] `genre` och `type` satta
- [ ] Textinnehållet inte dubblett av befintlig text (jämför brödtext)

Kör därefter `npx vite build` innan commit.

---

## 9. Ta aldrig bort texter

Befintliga texter tas **aldrig** bort utan att användaren uttryckligen ber om det.
Lägg bara till.
