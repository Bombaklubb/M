import { LibraryText } from '../types';

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
    libraryCache = Array.isArray(data) ? data : [];
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
 */
export async function getRandomText(
  grade: number,
  completedIds: string[] = []
): Promise<LibraryText | null> {
  const texts = await getTextsByGrade(grade);

  // Filtrera bort redan lästa texter
  const unreadTexts = texts.filter(t => !completedIds.includes(t.id));

  // Om alla texter är lästa, tillåt omläsning
  const availableTexts = unreadTexts.length > 0 ? unreadTexts : texts;

  if (availableTexts.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * availableTexts.length);
  return availableTexts[randomIndex];
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
