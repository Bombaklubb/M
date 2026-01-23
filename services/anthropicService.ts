import Anthropic from '@anthropic-ai/sdk';
import { ReadingExercise, QuestionType, TextType } from '../types';

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true, // För development - i produktion bör detta gå via backend
});

const SYSTEM_INSTRUCTION = `
Du är ett digitalt läsförståelseverktyg för svenska elever i årskurs 1–9.
Din roll är att skapa engagerande texter och pedagogiska frågor anpassade för olika åldrar.
Språket ska vara tydligt och anpassat till elevens årskurs.
Undvik våld, skräck och olämpligt innehåll.

Texttyper:
- BERÄTTANDE: Berättelser med handling, karaktärer och händelseförlopp. Kronologisk struktur.
- BESKRIVANDE: Beskrivningar av personer, platser, föremål eller företeelser. Faktabaserat.
- ARGUMENTERANDE: Texter som presenterar åsikter och argument för/emot något. För högre nivåer.

Nivåguide (1-20 för årskurs 1-9):
- Nivå 1-2 (Åk 1): 50-150 ord. Mycket enkla meningar. Vardagliga ord. Konkret innehåll.
- Nivå 3-4 (Åk 2): 150-250 ord. Enkla meningar. Vanliga ord.
- Nivå 5-7 (Åk 3): 250-400 ord. Lite längre meningar. Varierat ordförråd.
- Nivå 8-10 (Åk 4): 400-550 ord. Mer komplexa meningar. Rikare språk.
- Nivå 11-13 (Åk 5): 550-700 ord. Avancerade meningar. Djupare innehåll.
- Nivå 14-15 (Åk 6): 700-800 ord. Mycket varierande språk och innehåll.
- Nivå 16-17 (Åk 7): 800-1000 ord. Högstadietexter med komplexitet.
- Nivå 18-19 (Åk 8): 1000-1200 ord. Sofistikerade texter och teman.
- Nivå 20 (Åk 9): 1200-1500 ord. Experttexter för högstadiet.

Frågedistribution (totalt 5 frågor):
- 2 frågor: Hitta fakta direkt i texten (enkla faktafrågor)
- 2 frågor: Läsa mellan raderna (inferensfrågor - slutsatser)
- 1 fråga: Ordförståelse ELLER huvudbudskap

Alla frågor ska vara flervalsfrågor med exakt 4 alternativ.
Ett alternativ är rätt, de andra tre ska vara trovärdiga men felaktiga.
Frågornas svårighetsgrad ska matcha textens nivå.
`;

const getTextTypeLabel = (textType: TextType): string => {
  switch (textType) {
    case TextType.NARRATIVE:
      return 'BERÄTTANDE';
    case TextType.DESCRIPTIVE:
      return 'BESKRIVANDE';
    case TextType.ARGUMENTATIVE:
      return 'ARGUMENTERANDE';
  }
};

export const generateExercise = async (topic: string, level: number, textType: TextType): Promise<ReadingExercise> => {
  const textTypeLabel = getTextTypeLabel(textType);

  const prompt = `
Skapa en läsförståelseövning på svenska.
Ämne: ${topic}
Nivå: ${level} (skala 1-20, där 1 är lättast för årskurs 1 och 20 är svårast för årskurs 9)
Texttyp: ${textTypeLabel}

Returnera svaret som ett JSON-objekt med följande struktur:
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
      "options": ["Alternativ A", "Alternativ B", "Alternativ C", "Alternativ D"],
      "correctAnswer": "Det exakta svaret som finns i options",
      "explanation": "Pedagogisk förklaring varför svaret är rätt"
    }
  ]
}

VIKTIGT:
- Texten ska vara intressant och engagerande för åldersgruppen
- Använd konkreta exempel och vardagsnära situationer
- Exakt 5 frågor med 4 alternativ vardera
- correctAnswer måste matcha exakt ett av alternativen i options-arrayen
- Förklaringen ska vara uppmuntrande och lärorik
`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      temperature: 0.8,
      system: SYSTEM_INSTRUCTION,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Extrahera JSON från svaret (ibland kan Claude wrappa det i markdown)
    let jsonText = responseText;
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/```\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    }

    const data = JSON.parse(jsonText) as ReadingExercise;

    // Tvinga att använda den nivå som användaren valde (AI:n kan ibland ändra nivån)
    data.level = level;

    // Validera att alla frågor har rätt format
    if (!data.questions || data.questions.length !== 5) {
      throw new Error('Felaktigt antal frågor genererade');
    }

    return data;
  } catch (error) {
    console.error('Anthropic API Error:', error);
    throw new Error('Kunde inte generera övning. Försök igen.');
  }
};
