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
  /**
   * Mindre rutor, för skärmar där något annat redan tar plats ovanför –
   * t.ex. minitexten, som måste stå kvar medan eleven svarar. Utan det
   * hamnar alternativen under skärmkanten på en 768px hög Chromebook, och
   * en elev som inte kan läsa förstår inte att hon ska scrolla.
   */
  compact?: boolean;
}

/**
 * Rutnätet med svarsalternativ.
 *
 * Varje alternativ har sin egen lilla högtalarprick: en elev som inte kan
 * läsa måste kunna höra vad varje val ÄR innan hon väljer, annars är det
 * gissning och inte inlärning.
 */
export function ChoiceGrid({ choices, onPick, disabled, guideTo, wrongId, compact }: Props) {
  const cols = choices.length <= 2 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    // Stora rutor med flit: på en 1366×768-Chromebook ska alternativen fylla
    // skärmen så att en elev med lässvårigheter ser dem på håll och träffar
    // dem på första försöket.
    <div className={cn('grid w-full gap-6', cols, compact ? 'max-w-3xl' : 'max-w-5xl')}>
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
                'tile-pop grid w-full place-items-center bg-white',
                compact ? 'min-h-[8rem] p-3' : 'min-h-[15rem] p-6',
                'dark:bg-ink-800 disabled:opacity-100',
                isGuided && 'ring-4 ring-lime-400 animate-guide-glow',
                isWrong && 'opacity-40 grayscale animate-nudge'
              )}
            >
              {choice.emoji && (
                <span className={cn('leading-none', compact ? 'text-6xl' : 'text-8xl')}>
                  {choice.emoji}
                </span>
              )}
              {choice.letter && (
                <span
                  className={cn(
                    'reading font-bold leading-none',
                    compact ? 'text-7xl' : 'text-9xl'
                  )}
                >
                  {choice.letter}
                </span>
              )}
              {choice.word && (
                <span
                  className={cn(
                    'reading font-medium leading-none',
                    compact ? 'text-4xl' : 'text-6xl'
                  )}
                >
                  {choice.word}
                </span>
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
