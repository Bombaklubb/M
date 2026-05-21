import { HallucinationItem } from '@/types';

export const MODULE5_ITEMS: HallucinationItem[] = [
  {
    id: 'm5-1',
    question: 'Vad är huvudstaden i Australien?',
    aiAnswer: 'Huvudstaden i Australien är Sydney, som är landets folkrikaste och mest kända stad. Sydney är känt för sin ikoniska operahus och Harbour Bridge.',
    isHallucination: true,
    explanation: 'AI hallucination! Australiens huvudstad är Canberra – inte Sydney. Sydney är visserligen Australiens folkrikaste stad, men det är ett vanligt misstag att förväxla dem. AI "vet" att Sydney är känt men drar fel slutsats om vad som är huvudstad.',
    correctAnswer: 'Canberra är Australiens huvudstad sedan 1927. Sydney är den största staden men har aldrig varit huvudstad.',
  },
  {
    id: 'm5-2',
    question: 'Vem skrev Harry Potter-böckerna?',
    aiAnswer: 'Harry Potter-böckerna skrevs av den brittiska författaren J.K. Rowling. Den första boken, "Harry Potter och de vises sten", publicerades ursprungligen på engelska 1997 och på svenska 1999.',
    isHallucination: false,
    explanation: 'Det stämmer! J.K. Rowling skrev alla sju Harry Potter-böckerna. Den första boken publicerades 1997 i Storbritannien. Det här är ett faktum AI brukar ha rätt om.',
  },
  {
    id: 'm5-3',
    question: 'Vilken är världens snabbaste bil?',
    aiAnswer: 'Världens snabbaste bil är Bugatti Chiron Super Sport 300+, som år 2019 satte världsrekordet på 304 mph. Bilen drivs av en 8-liters W16-motor med 1577 hästkrafter.',
    isHallucination: true,
    explanation: 'Delvis hallucination! Bugatti Chiron satte ett imponerande rekord 2019 (490 km/h), men sedan dess har andra bilar, som Koenigsegg Jesko Absolut och SSC Tuatara, gjort anspråk på rekordet. AI blandar också ihop mph och km/h. Dessutom ändras rekord – AI kan ha inaktuell information.',
    correctAnswer: 'Snabbaste produktionsbilsrekordet är omtvistat och ändras kontinuerligt. AI har korrekt information om Bugattis rekord, men har inaktuell data om vem som har rekordet idag.',
  },
  {
    id: 'm5-4',
    question: 'När inträffade terrorattackerna mot World Trade Center?',
    aiAnswer: 'Terrorattackerna mot World Trade Center inträffade den 12 september 2001. Fyra flygplan kapades av terrorister tillhörande al-Qaida. Totalt omkom nästan 3 000 personer.',
    isHallucination: true,
    explanation: 'AI hallucination! Attackerna inträffade den 11 september 2001 – inte den 12:e. Datumet "9/11" är ett av de mest kända datumen i modern historia. Att AI ger fel datum för en så välkänd händelse är ett klassiskt exempel på hallucination.',
    correctAnswer: 'Attackerna mot World Trade Center inträffade den 11 september 2001 (9/11). Nästan 3 000 personer dog.',
  },
  {
    id: 'm5-5',
    question: 'Hur länge lever en genomsnittlig husmanet (jordmask)?',
    aiAnswer: 'En husmanet lever vanligtvis 4–8 år under optimala förhållanden, men i fångenskap kan de leva upp till 10 år. De föredrar fuktig jord och spelar en viktig roll för jordens ekosystem.',
    isHallucination: true,
    explanation: 'Hallucination! En vanlig daggmask lever normalt 1–5 år, inte 4–8 år. Men det är svårt att veta exakt – och AI låter väldigt säker på en siffra den troligen gissade. Det är ett tecken på hallucination: AI ger specifika siffror med onödig säkerhet.',
    correctAnswer: 'Daggmaskar lever normalt 1–5 år. Exakta data varierar beroende på art och miljö. Notera hur säkert AI svarade på en fråga med osäkert svar!',
  },
  {
    id: 'm5-6',
    question: 'Vilken är jordens näst största kontinent?',
    aiAnswer: 'Jordens näst största kontinent är Afrika. Afrika har en yta på ungefär 30 miljoner kvadratkilometer och är hem för 54 erkända länder och över 1,4 miljarder människor.',
    isHallucination: false,
    explanation: 'Det stämmer! Afrika är jordens näst största kontinent efter Asien. Ytan och befolkningssiffrorna är korrekta. Det här är ett exempel på faktabaserad AI-info som faktiskt stämmer.',
  },
];
