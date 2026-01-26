import { ReadingExercise, QuestionType, TextType } from '../types';

export const generateExercise = async (topic: string, level: number, textType: TextType): Promise<ReadingExercise> => {
  try {
    // Call the serverless API endpoint
    const response = await fetch('/api/generate-exercise', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic,
        level,
        textType,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Handle rate limit errors
      if (response.status === 429 || errorData.error === 'RATE_LIMIT') {
        throw new Error('RATE_LIMIT');
      }

      throw new Error(errorData.message || 'Kunde inte generera övning. Försök igen.');
    }

    const data = await response.json();
    return data as ReadingExercise;
  } catch (error: any) {
    console.error('API Error:', error);

    // Preserve rate limit errors
    if (error?.message === 'RATE_LIMIT') {
      throw error;
    }

    // Network errors
    if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
      throw new Error('Nätverksfel. Kontrollera din anslutning.');
    }

    throw new Error('Kunde inte generera övning. Försök igen.');
  }
};
