/**
 * Berättelsen om Leo och den försvunna nyckeln.
 *
 * Ett avsnitt per dag. Avsnitten är medvetet tunna – de är ett SKAL runt
 * uppdrag som genereras ur elevens egen bokstavs- och orddata, inte
 * handskrivet innehåll. Det betyder att berättelsen kostar nästan ingenting
 * att underhålla, men ändå ger eleven en anledning att komma tillbaka i morgon.
 *
 * Tonen är äventyr, inte saga: ingen "lilla vän", inga gulliga djur som
 * pratar. Eleverna är tio år.
 */
export interface StoryBeat {
  id: string;
  emoji: string;
  /** Läses upp på uppdragsskärmen. Eleven behöver aldrig läsa den själv. */
  text: string;
}

export const STORY_BEATS: StoryBeat[] = [
  { id: 'b1', emoji: '🔑', text: 'Leos nyckel är borta. Utan den kommer han inte in. Hjälp honom leta!' },
  { id: 'b2', emoji: '🎒', text: 'Leo letar i väskan. Där finns bara en bok och en halv smörgås.' },
  { id: 'b3', emoji: '🏫', text: 'Kanske glömde han nyckeln i skolan. Leo går tillbaka.' },
  { id: 'b4', emoji: '🪟', text: 'Vaktmästaren har låst. Men ett fönster står på glänt.' },
  { id: 'b5', emoji: '🐕', text: 'En hund springer förbi. Något glimmar i munnen på den.' },
  { id: 'b6', emoji: '🌲', text: 'Hunden försvinner in i skogen. Leo följer efter.' },
  { id: 'b7', emoji: '🍂', text: 'Spåren slutar vid en hög med löv. Leo börjar gräva.' },
  { id: 'b8', emoji: '📦', text: 'Under löven ligger en låda. Den är stängd med ett snöre.' },
  { id: 'b9', emoji: '🪢', text: 'Snöret sitter hårt. Leo får kämpa en lång stund.' },
  { id: 'b10', emoji: '🗺️', text: 'I lådan ligger ingen nyckel. Det ligger en karta.' },
  { id: 'b11', emoji: '🏖️', text: 'Kartan pekar mot stranden. Leo springer dit.' },
  { id: 'b12', emoji: '🌊', text: 'Vid vattnet står en gammal båt. Något ligger i botten.' },
  { id: 'b13', emoji: '🐚', text: 'Det är bara snäckor. Men under dem hittar Leo något hårt.' },
  { id: 'b14', emoji: '✨', text: 'Det glimmar till i sanden. Leo sträcker ut handen.' },
  { id: 'b15', emoji: '🔑', text: 'Nyckeln! Leo hittade den. Och du hjälpte honom hela vägen.' },
];

export const STORY_LENGTH = STORY_BEATS.length;

/**
 * Vilket avsnitt eleven är på.
 *
 * När berättelsen är slut börjar den om från början i stället för att ta
 * slut – uppdragen ska aldrig sina, och en elev som orkat femton dagar ska
 * inte mötas av en låst skärm.
 */
export function beatFor(index: number): StoryBeat {
  return STORY_BEATS[index % STORY_LENGTH];
}

/** True sista dagen i bågen – då visas nyckeln som hittad. */
export function isFinale(index: number): boolean {
  return index % STORY_LENGTH === STORY_LENGTH - 1;
}
