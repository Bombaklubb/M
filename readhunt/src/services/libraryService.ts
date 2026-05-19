import { LibraryText, CompletedText } from '../types';

let libraryCache: LibraryText[] | null = null;

/**
 * Ladda biblioteket från JSON-filen
 */
export async function loadLibrary(): Promise<LibraryText[]> {
  if (libraryCache) {
    return libraryCache;
  }

  try {
    const response = await fetch('/data/library.json');
    if (!response.ok) {
      throw new Error('Kunde inte ladda biblioteket');
    }
    const data = await response.json();
    const texts = Array.isArray(data) ? data : [];

    // Normalisera texter: lägg till genre för texter som har category men saknar genre
    // Texter med category-fält är berättelser (narrativ struktur med karaktärer)
    libraryCache = texts.map((text: LibraryText & { category?: string }) => {
      if (!text.genre && text.category) {
        return {
          ...text,
          genre: 'berättelse' as const,
          theme: text.category, // Använd category som theme
        };
      }
      return text;
    });

    return libraryCache;
  } catch (error) {
    console.error('Fel vid laddning av bibliotek:', error);
    return [];
  }
}

/**
 * Hämta alla texter för en specifik årskurs
 */
export async function getTextsByGrade(grade: number): Promise<LibraryText[]> {
  const library = await loadLibrary();
  return library.filter(text => text.grade === grade);
}

/**
 * Hämta en slumpmässig text för en årskurs
 * Undviker texter som användaren redan läst (om completedIds anges)
 * Undviker texter med samma tema som de senaste lästa texterna för variation
 */
export async function getRandomText(
  grade: number,
  completedIds: string[] = [],
  recentTexts: CompletedText[] = []
): Promise<LibraryText | null> {
  const texts = await getTextsByGrade(grade);

  // Filtrera bort redan lästa texter
  const unreadTexts = texts.filter(t => !completedIds.includes(t.id));

  // Om alla texter är lästa, tillåt omläsning men undvik fortfarande nyligen lästa
  let availableTexts = unreadTexts.length > 0 ? unreadTexts : texts;

  if (availableTexts.length === 0) {
    return null;
  }

  // Hämta teman och titlar från de senaste 5 lästa texterna för variation
  const recentThemes = new Set(
    recentTexts.slice(-5).map(t => t.theme?.toLowerCase()).filter(Boolean)
  );
  const recentTitles = new Set(
    recentTexts.slice(-10).map(t => t.title.toLowerCase())
  );

  // Prioritera texter med andra teman än de senaste lästa
  if (recentThemes.size > 0) {
    const differentThemeTexts = availableTexts.filter(
      t => !t.theme || !recentThemes.has(t.theme.toLowerCase())
    );
    // Använd texter med annat tema om det finns några
    if (differentThemeTexts.length > 0) {
      availableTexts = differentThemeTexts;
    }
  }

  // Undvik texter med liknande titlar (för att undvika "del 1, del 2" etc)
  if (recentTitles.size > 0) {
    const differentTitleTexts = availableTexts.filter(t => {
      const titleLower = t.title.toLowerCase();
      // Kolla om titeln är väldigt lik någon av de senaste
      return !Array.from(recentTitles).some(recentTitle =>
        titleLower.includes(recentTitle) ||
        recentTitle.includes(titleLower) ||
        calculateTitleSimilarity(titleLower, recentTitle) > 0.7
      );
    });
    if (differentTitleTexts.length > 0) {
      availableTexts = differentTitleTexts;
    }
  }

  const randomIndex = Math.floor(Math.random() * availableTexts.length);
  return availableTexts[randomIndex];
}

/**
 * Beräkna likhet mellan två titlar (enkel implementation)
 * Returnerar ett värde mellan 0 och 1
 */
function calculateTitleSimilarity(title1: string, title2: string): number {
  const words1 = title1.split(/\s+/);
  const words2 = title2.split(/\s+/);

  // Räkna gemensamma ord
  const commonWords = words1.filter(w => words2.includes(w) && w.length > 2).length;
  const maxWords = Math.max(words1.length, words2.length);

  return maxWords > 0 ? commonWords / maxWords : 0;
}

/**
 * Hämta en specifik text via ID
 */
export async function getTextById(id: string): Promise<LibraryText | null> {
  const library = await loadLibrary();
  return library.find(text => text.id === id) || null;
}

/**
 * Räkna antal texter per årskurs
 */
export async function getTextCountByGrade(): Promise<Record<number, number>> {
  const library = await loadLibrary();
  const counts: Record<number, number> = {};

  for (let grade = 1; grade <= 10; grade++) {
    counts[grade] = library.filter(t => t.grade === grade).length;
  }

  return counts;
}

/**
 * Hämta tillgängliga årskurser (som har minst en text)
 */
export async function getAvailableGrades(): Promise<number[]> {
  const counts = await getTextCountByGrade();
  return Object.entries(counts)
    .filter(([_, count]) => count > 0)
    .map(([grade]) => Number(grade))
    .sort((a, b) => a - b);
}
