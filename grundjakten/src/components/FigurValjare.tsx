import { AVATARER } from '@/data/avatars';
import { cn } from '@/lib/utils';

/**
 * Byt figur.
 *
 * Samma rutnät och samma markering som inloggningens väljare, så att eleven
 * känner igen det – hon valde sin figur på precis den här skärmen en gång.
 *
 * Inget "spara". Valet slår igenom direkt och syns omedelbart som ett nytt
 * ansikte uppe i hörnet. En elev som inte kan läsa ska inte behöva bekräfta
 * ett val vars resultat hon redan ser.
 */
export function FigurValjare({
  vald,
  onValj,
}: {
  vald: string;
  onValj: (avatar: string) => void;
}) {
  return (
    <div
      className="grid grid-cols-6 gap-2 rounded-card bg-white/90 p-3 dark:bg-ink-800/90"
      role="group"
      aria-label="Välj din figur"
    >
      {AVATARER.map((a) => (
        <button
          key={a}
          type="button"
          aria-label={`Välj figur ${a}`}
          aria-pressed={vald === a}
          onClick={() => onValj(a)}
          className={cn(
            'tile-pop grid h-14 place-items-center bg-white text-3xl dark:bg-ink-900',
            vald === a && 'ring-4 ring-lime-400'
          )}
        >
          <span aria-hidden>{a}</span>
        </button>
      ))}
    </div>
  );
}
