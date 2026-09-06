import { Fragment } from 'react';
import { colorOf, PERSON_COLOR } from './data';

const NAMES = Object.keys(PERSON_COLOR);
const NAME_RE = new RegExp(`\\b(${NAMES.join('|')})\\b`, 'g');

/**
 * Skriver ut en text där familjens namn får sin egen färg. Samma färgkod i
 * appen som på utskrifterna, så den som läser hittar sitt namn direkt — på
 * skärmen och på en meter från kylskåpsdörren.
 */
export function Named({ text }: { text: string }) {
  return (
    <>
      {text.split(NAME_RE).map((del, i) =>
        NAMES.includes(del)
          ? <span key={i} style={{ color: colorOf(del).fg, fontWeight: 800 }}>{del}</span>
          : <Fragment key={i}>{del}</Fragment>,
      )}
    </>
  );
}
