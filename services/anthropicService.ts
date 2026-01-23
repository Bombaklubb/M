import Anthropic from '@anthropic-ai/sdk';
import { ReadingExercise, QuestionType } from '../types';

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true, // För development - i produktion bör detta gå via backend
});

const SYSTEM_INSTRUCTION = `
Du är ett digitalt läsförståelseverktyg för svenska elever i årskurs 4–6 (mellanstadiet).
Din roll är att skapa engagerande texter och pedagogiska frågor.
Språket ska vara enkelt, tydligt och anpassat till barn 10–12 år.
Undvik våld, skräck och olämpligt innehåll.

Nivåguide:
- Nivå 1: 100-150 ord. Enkla meningar. Konkret innehåll. Vardagliga ord.
- Nivå 2: 150-200 ord. Lite mer komplexa meningar. Blandat ordförråd.
- Nivå 3: 200-250 ord. Varierat språk. Några nya ord förklaras i sammanhanget.
- Nivå 4: 250-300 ord. Mer avancerad satsbyggnad. Rikare språk.
- Nivå 5: 300-400 ord. Utmanande texter. Djupare innehåll och nyanser.

Frågedistribution (totalt 5 frågor):
- 2 frågor: Hitta fakta direkt i texten (enkla faktafrågor)
- 2 frågor: Läsa mellan raderna (inferensfrågor - slutsatser)
- 1 fråga: Ordförståelse ELLER huvudbudskap

Alla frågor ska vara flervalsfrågor med exakt 4 alternativ.
Ett alternativ är rätt, de andra tre ska vara trovärdiga men felaktiga.
`;

export const generateExercise = async (topic: string, level: number): Promise<ReadingExercise> => {
  const prompt = `
Skapa en läsförståelseövning på svenska.
Ämne: ${topic}
Nivå: ${level} (skala 1-5, där 1 är lättast och 5 svårast)

Returnera svaret som ett JSON-objekt med följande struktur:
{
  "level": ${level},
  "title": "En kort, engagerande titel",
  "content": "Själva texten som eleven ska läsa",
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
- Texten ska vara intressant och engagerande för 10-12-åringar
- Använd konkreta exempel och vardagsnära situationer
- Exakt 5 frågor med 4 alternativ vardera
- correctAnswer måste matcha exakt ett av alternativen i options-arrayen
- Förklaringen ska vara uppmuntrande och lärorik
`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
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
