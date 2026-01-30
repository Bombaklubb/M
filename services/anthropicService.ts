import { ReadingExercise, QuestionType, TextType } from '../types';

// Timeout helper for Chromebooks with slow school networks
const fetchWithTimeout = async (url: string, options: RequestInit, timeout = 90000): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

export const generateExercise = async (topic: string, level: number, textType: TextType): Promise<ReadingExercise> => {
  try {
    // Call the serverless API endpoint with 90s timeout for Chromebooks
    const response = await fetchWithTimeout('/api/generate-exercise', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic,
        level,
        textType,
      }),
    }, 90000);

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

    // Timeout errors (common on Chromebooks with slow networks)
    if (error?.name === 'AbortError') {
      throw new Error('Nätverket är långsamt. Försök igen om några sekunder.');
    }

    // Network errors
    if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
      throw new Error('Nätverksfel. Kontrollera din anslutning.');
    }

    throw new Error('Kunde inte generera övning. Försök igen.');
  }
};
