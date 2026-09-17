import { LETTER_BY_ID } from '@/data/letters';
import { play } from '@/lib/audio';

/**
 * Skärmtangentbord som stöd vid "tryck bokstaven".
 *
 * Det är inte bara en touch-fallback: en svensk Chromebook kan vara inställd
 * på amerikansk layout, och då finns inte å, ä och ö på tangenterna alls.
 * Här finns de alltid.
 *
 * Bara upplåsta bokstäver visas, så valmängden hålls liten och eleven lyckas.
 */
export function OnScreenKeyboard({
  letters,
  onPress,
  disabled,
}: {
  letters: string[];
  onPress: (letter: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex max-w-2xl flex-wrap justify-center gap-2">
      {letters.map((id) => {
        const letter = LETTER_BY_ID[id];
        if (!letter) return null;
        return (
          <button
            key={id}
            type="button"
            disabled={disabled}
            aria-label={`Bokstaven ${letter.upper}`}
            onPointerDown={() => void play(letter.name)}
            onClick={() => onPress(letter.lower)}
            className="tile-pop reading h-16 w-14 bg-white text-3xl font-bold
                       text-ink-800 dark:bg-ink-800 dark:text-ink-100"
          >
            {letter.upper}
          </button>
        );
      })}
    </div>
  );
}
