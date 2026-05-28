import { FindErrorText } from '@/types';

export const MODULE2_TEXTS: FindErrorText[] = [
  {
    id: 'm2-1',
    title: 'Sverige – fakta om landet',
    topic: 'Geografi',
    hint: 'Tänk på: Var på kartan ligger Sverige? Hur många bor i Sverige ungefär? Vad är landets huvudstad?',
    segments: [
      { text: 'Sverige är ett land i ', isError: false },
      { text: 'södra Europa', isError: true, errorExplanation: 'Sverige ligger i NORRA Europa, inte södra.' },
      { text: ' med en befolkning på ungefär ', isError: false },
      { text: '50 miljoner invånare', isError: true, errorExplanation: 'Sverige har ungefär 10 miljoner invånare, inte 50 miljoner.' },
      { text: '. Landet grundades officiellt år 1523 och den nuvarande kungen heter Carl XVI Gustaf. Huvudstaden är ', isError: false },
      { text: 'Göteborg', isError: true, errorExplanation: 'Stockholm är Sveriges huvudstad. Göteborg är landets näst folkrikaste stad.' },
      { text: ', som är landets folkrikaste stad.', isError: false },
    ],
  },
  {
    id: 'm2-2',
    title: 'Internets historia',
    topic: 'Teknik & historia',
    hint: 'Tänk på: Vem uppfann internet? Vem skapade World Wide Web? Hur många webbsidor finns det idag – miljoner eller tusentals?',
    segments: [
      { text: 'Internet uppfanns av ', isError: false },
      { text: 'Steve Jobs', isError: true, errorExplanation: 'Internet skapades inte av Steve Jobs. Det växte fram ur det militära nätverket ARPANET på 1960–70-talet, skapat av amerikanska forskare som Vint Cerf och Bob Kahn.' },
      { text: ' på 1960-talet som ett militärt nätverk. Det som idag kallas World Wide Web skapades av ', isError: false },
      { text: 'Elon Musk', isError: true, errorExplanation: 'World Wide Web uppfanns av den brittiske datavetaren Tim Berners-Lee år 1989 – inte av Elon Musk.' },
      { text: ' år 1989 för att göra det enklare att dela information. Idag finns det ungefär ', isError: false },
      { text: '50 000 webbsidor', isError: true, errorExplanation: 'Det finns över 1,9 miljarder registrerade webbplatser på internet, inte bara 50 000.' },
      { text: ' på nätet.', isError: false },
    ],
  },
  {
    id: 'm2-3',
    title: 'Albert Einstein – fysikens gigant',
    topic: 'Vetenskap & historia',
    hint: 'Tänk på: Uppfinns vetenskapliga teorier? Vad fick Einstein Nobelpriset för – var det relativitetsteorin? Var Einstein fysiker eller matematiker?',
    segments: [
      { text: 'Albert Einstein var en tysk-schweizisk fysiker som levde 1879–1955. Han är mest känd för att ha ', isError: false },
      { text: 'uppfunnit', isError: true, errorExplanation: 'Man "uppfinner" inte vetenskapliga teorier – Einstein "formulerade" eller "utvecklade" relativitetsteorin. Teorier är tankekonstruktioner, inte uppfinningar.' },
      { text: ' relativitetsteorin och för att ha tagit fram formeln E=mc². Einstein fick Nobelpriset i fysik år 1921 för ', isError: false },
      { text: 'sin forskning om gravitationen', isError: true, errorExplanation: 'Einstein fick Nobelpriset INTE för relativitetsteorin eller gravitationen, utan för sin förklaring av den fotoelektriska effekten.' },
      { text: '. Han avled i Princeton, USA och anses vara en av det ', isError: false },
      { text: '1900-talets störste matematiker', isError: true, errorExplanation: 'Einstein var framförallt fysiker, inte matematiker. Han kallas vanligtvis "1900-talets störste fysiker".' },
      { text: '.', isError: false },
    ],
  },
];
