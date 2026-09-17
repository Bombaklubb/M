import type { Choice } from '@/types';
import { cn } from '@/lib/utils';
import { play } from '@/lib/audio';

interface Props {
  choices: Choice[];
  onPick: (choice: Choice) => void;
  disabled?: boolean;
  /** Sätts efter andra missen: rätt alternativ pulserar och eleven lotsas rätt. */
  guideTo?: string | null;
  /** Alternativet eleven just tryckte fel på. */
  wrongId?: string | null;
}

/**
 * Rutnätet med svarsalternativ.
 *
 * Varje alternativ har sin egen lilla högtalarprick: en elev som inte kan
 * läsa måste kunna höra vad varje val ÄR innan hon väljer, annars är det
 * gissning och inte inlärning.
 */
export function ChoiceGrid({ choices, onPick, disabled, guideTo, wrongId }: Props) {
  const cols = choices.length <= 2 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    // Stora rutor med flit: på en 1366×768-Chromebook ska alternativen fylla
    // skärmen så att en elev med lässvårigheter ser dem på håll och träffar
    // dem på första försöket.
    <div className={cn('grid w-full max-w-5xl gap-6', cols)}>
      {choices.map((choice) => {
        const isGuided = guideTo === choice.id;
        const isWrong = wrongId === choice.id;
        return (
          <div key={choice.id} className="relative">
            <button
              type="button"
              disabled={disabled}
              onClick={() => onPick(choice)}
              aria-label={choice.say.text}
              className={cn(
                'tile-pop grid min-h-[15rem] w-full place-items-center bg-white p-6',
                'dark:bg-ink-800 disabled:opacity-100',
                isGuided && 'ring-4 ring-lime-400 animate-guide-glow',
                isWrong && 'opacity-40 grayscale animate-nudge'
              )}
            >
              {choice.emoji && <span className="text-8xl leading-none">{choice.emoji}</span>}
              {choice.letter && (
                <span className="reading text-9xl font-bold leading-none">{choice.letter}</span>
              )}
              {choice.word && (
                <span className="reading text-6xl font-medium leading-none">{choice.word}</span>
              )}
            </button>

            <button
              type="button"
              aria-label={`Lyssna: ${choice.say.text}`}
              onClick={(e) => {
                e.stopPropagation();
                void play(choice.say);
              }}
              className="absolute -right-2 -top-2 grid h-14 w-14 min-h-0 place-items-center
                         rounded-full border-2 border-aqua-700 bg-aqua-500 text-white shadow-pop-sm"
            >
              <span aria-hidden className="text-lg">🔊</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
