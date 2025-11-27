import { GoogleGenAI, Type } from "@google/genai";
import { ReadingExercise, QuestionType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Du är ett digitalt läsförståelseverktyg för svenska elever i årskurs 4–6 (mellanstadiet).
Din roll är att skapa engagerande texter och pedagogiska frågor.
Språket ska vara enkelt, tydligt och anpassat till barn 10–12 år.
Undvik våld, skräck och olämpligt innehåll.

Nivåguide:
- Nivå 1–2: 80–150 ord. Enkla meningar. Konkret innehåll.
- Nivå 3–4: 150–250 ord. Lite mer varierat språk.
- Nivå 5: 200–300 ord. Mer avancerad satsbyggnad och djupt innehåll.

Frågedistribution (totalt 6-8 frågor):
- 2–3 frågor: Hitta fakta direkt i texten.
- 2–3 frågor: Läsa mellan raderna (slutsatser).
- 1–2 frågor: Ordförståelse.
- 1 fråga: Resonera om budskap.
`;

export const generateExercise = async (topic: string, level: number): Promise<ReadingExercise> => {
  const modelId = "gemini-2.5-flash"; // Fast and capable model

  const prompt = `
    Skapa en läsförståelseövning på svenska.
    Ämne: ${topic}
    Nivå: ${level} (skala 1-5, där 1 är lättast och 5 svårast)
    
    Returnera svaret strikt som JSON enligt schemat nedan.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            level: { type: Type.NUMBER },
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.NUMBER },
                  type: { 
                    type: Type.STRING, 
                    enum: [
                      QuestionType.MULTIPLE_CHOICE, 
                      QuestionType.TRUE_FALSE, 
                      QuestionType.SHORT_ANSWER,
                      QuestionType.REASONING
                    ] 
                  },
                  question: { type: Type.STRING },
                  options: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "Endast för multiple_choice. Måste ha 3-4 alternativ." 
                  },
                  correctAnswer: { 
                    type: Type.STRING,
                    description: "Det rätta svaret. För multiple_choice ska det vara texten på alternativet, inte bokstaven."
                  },
                  explanation: { type: Type.STRING, description: "En pedagogisk förklaring varför svaret är rätt." }
                },
                required: ["id", "type", "question", "correctAnswer", "explanation"]
              }
            }
          },
          required: ["level", "title", "content", "questions"]
        }
      }
    });

    if (!response.text) {
      throw new Error("Ingen text genererades från AI.");
    }

    const data = JSON.parse(response.text) as ReadingExercise;
    return data;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};