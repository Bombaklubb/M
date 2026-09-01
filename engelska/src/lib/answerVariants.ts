// ─── Godtagbara svarsvarianter ────────────────────────────────────────────────
// Elever ska inte få fel för att de valt en annan korrekt engelsk form än den
// som råkar stå i facit. Tabellen är tvåvägs: står "colour" i facit godkänns
// "color", och tvärtom.
//
// Läggs varianter till här gäller de i ALLA lucktextövningar direkt – ingen
// behöver redigera enskilda uppgifter.

const GROUPS: string[][] = [
  // ── Brittisk ↔ amerikansk stavning ─────────────────────────────────────────
  ["analysed", "analyzed"],
  ["criticised", "criticized"],
  ["organised", "organized"],
  ["realised", "realized"],
  ["recognised", "recognized"],
  ["apologised", "apologized"],
  ["colour", "color"],
  ["favourite", "favorite"],
  ["neighbour", "neighbor"],
  ["behaviour", "behavior"],
  ["travelled", "traveled"],
  ["cancelled", "canceled"],
  ["centre", "center"],
  ["theatre", "theater"],
  ["grey", "gray"],
  ["learnt", "learned"],
  ["spelt", "spelled"],
  ["dreamt", "dreamed"],
  ["burnt", "burned"],

  // ── Sammandragning ↔ utskriven form ────────────────────────────────────────
  ["aren't", "are not"],
  ["isn't", "is not"],
  ["wasn't", "was not"],
  ["weren't", "were not"],
  ["can't", "cannot", "can not"],
  ["couldn't", "could not"],
  ["didn't", "did not"],
  ["doesn't", "does not"],
  ["don't", "do not"],
  ["hasn't", "has not"],
  ["haven't", "have not"],
  ["hadn't", "had not"],
  ["needn't", "need not"],
  ["shouldn't", "should not"],
  ["wouldn't", "would not"],
  ["won't", "will not"],
  ["mustn't", "must not"],
  ["it's", "it is"],
  ["that's", "that is"],
  ["they're", "they are"],
  ["we're", "we are"],
  ["you're", "you are"],
  ["i'm", "i am"],
  ["he's", "he is"],
  ["she's", "she is"],

  // ── Synonymer som båda är korrekta översättningar ──────────────────────────
  ["rabbit", "bunny"],
  ["grandmother", "grandma", "granny", "nan"],
  ["grandfather", "grandpa", "granddad", "grandad"],
  ["mum", "mom", "mummy", "mommy"],
  ["dad", "daddy", "father"],
  ["film", "movie"],
  ["autumn", "fall"],
  ["sweets", "candy"],
  ["trousers", "pants"],
  ["football", "soccer"],
  ["rubber", "eraser"],
  ["holiday", "vacation"],
  ["jumper", "sweater"],
  ["biscuit", "cookie"],
  ["torch", "flashlight"],
  ["lift", "elevator"],
  ["bin", "trash can", "rubbish bin"],
  ["sofa", "couch"],
  ["stomach", "belly", "tummy"],
  ["photo", "picture", "photograph"],
];

/** Uppslagstabell: varje form pekar på hela sin grupp. */
const MAP: Record<string, string[]> = {};
for (const group of GROUPS) {
  for (const form of group) MAP[form] = group;
}

/**
 * Alla former som ska godkännas för ett givet facit (inklusive facit självt).
 * Indata förutsätts redan normaliserad (gemener, trimmad).
 */
export function answerVariants(answer: string): string[] {
  return MAP[answer] ?? [answer];
}
