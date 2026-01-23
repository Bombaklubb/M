# 📚 Läs och lär

En webbaserad läsförståelseapp för mellanstadieelever (årskurs 4-6) i Sverige, liknande ReadTheory.org och Frippo.se.

## ✨ Funktioner

### Kärnfunktioner
- **Enkel inloggning** - Inget lösenord krävs, bara användarnamn
- **Adaptivt nivåsystem** - 5 svårighetsnivåer som anpassas efter elevens resultat
- **AI-genererade texter** - Unika texter varje gång via Anthropic API
- **Läsförståelsefrågor** - 5 frågor per text med direkt feedback
- **Text-to-speech** - Möjlighet att lyssna på texterna

### Spelifiering
- **Poängsystem** - Tjäna poäng baserat på nivå och antal rätt svar
- **Streaks** - Belöning för daglig övning
- **Badges** - Märken för milstolpar (10 texter, 5 dagar i rad, 100% resultat, etc.)
- **Progressbar** - Visuell representation av framsteg

### Nivåsystem
- **Nivå 1**: Korta texter (100-150 ord), enkelt språk
- **Nivå 2**: 150-200 ord, lite mer komplexa meningar
- **Nivå 3**: 200-250 ord, varierat ordförråd
- **Nivå 4**: 250-300 ord, mer avancerade teman
- **Nivå 5**: 300-400 ord, utmanande texter

Systemet justerar automatiskt:
- 80%+ rätt → nivå upp
- Under 50% → nivå ner

### Teman
- Djur & Natur
- Rymden
- Sport & Fritid
- Historia & Forntiden
- Vetenskap
- Äventyr & Spänning
- Vardagsliv & Vänskap
- Sverige & Världen
- Teknik & Uppfinningar

## 🚀 Kom igång

### Förutsättningar
- Node.js (version 14 eller senare)
- En Anthropic API-nyckel

### Installation

1. Klona projektet:
```bash
git clone <repository-url>
cd M
```

2. Installera dependencies:
```bash
npm install
```

3. Skapa en `.env.local` fil och lägg till din Anthropic API-nyckel:
```
VITE_ANTHROPIC_API_KEY=your-api-key-here
```

4. Starta utvecklingsservern:
```bash
npm run dev
```

5. Öppna din webbläsare och gå till `http://localhost:5173`

## 📖 Användning

### För elever
1. Logga in med ditt namn och välj "Elev"
2. Välj ett tema du vill läsa om
3. Läs texten i din egen takt (använd text-to-speech om du vill)
4. Svara på 5 frågor om texten
5. Se ditt resultat och eventuella nya badges
6. Fortsätt läsa för att öka din nivå!

### För lärare
1. Logga in med ditt namn och välj "Lärare"
2. Se klassens resultat och framsteg (kommer snart)

## 🏗️ Teknisk stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **AI**: Anthropic Claude API
- **State Management**: React Hooks
- **Data Storage**: localStorage
- **Build Tool**: Vite

## 📁 Projektstruktur

```
/src
├── components/        # React-komponenter
│   ├── Header.tsx
│   ├── BadgeDisplay.tsx
│   ├── Button.tsx
│   ├── QuestionCard.tsx
│   ├── QuizView.tsx
│   ├── ReadingView.tsx
│   ├── ResultView.tsx
│   └── SetupView.tsx
├── pages/            # Sidkomponenter
│   ├── Login.tsx
│   └── Profile.tsx
├── hooks/            # Custom React hooks
│   ├── useAuth.ts
│   └── useProgress.ts
├── services/         # API-tjänster
│   └── anthropicService.ts
├── utils/            # Hjälpfunktioner
│   ├── storage.ts
│   ├── levelCalculator.ts
│   └── badgeSystem.ts
├── types.ts          # TypeScript-typer
├── App.tsx           # Huvudkomponent
└── index.tsx         # Entry point
```

## 🎮 Spelmekanik

### Poäng
- 10 poäng per rätt svar × nivå
- Exempel: 4 rätt på nivå 3 = 120 poäng

### Badges
- 🌟 **Första steget** - Läste din första text
- 📚 **Bokmal** - Läste 10 texter
- 🦸 **Läshjälte** - Läste 50 texter
- 👑 **Läsmästare** - Läste 100 texter
- 🔥 **Femma** - Läste 5 dagar i rad
- 💪 **Tiotal** - Läste 10 dagar i rad
- 🏆 **Månadsmästare** - Läste 30 dagar i rad
- 💯 **Perfekt** - Fick 100% på en text
- ⭐ **Stjärnelev** - Fick 100% fem gånger
- 📈 **Nivå upp** - Gick upp en nivå
- 🎯 **Toppnivå** - Nådde nivå 5

## 🔒 Data och integritet

All data lagras lokalt i webbläsarens localStorage. Ingen data skickas till externa servrar förutom API-anrop till Anthropic för att generera texter.

## 🛠️ Utveckling

### Bygga för produktion
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## 📝 Licens

Detta projekt är skapat för utbildningsändamål.

## 🙏 Tack till

- Anthropic för Claude API
- Tailwind CSS-teamet
- React-teamet
