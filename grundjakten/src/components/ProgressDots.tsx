import { cn } from '@/lib/utils';

/**
 * Framsteg som prickar, inte som siffror.
 *
 * Medvetet inget "3/8" och ingen procent: den här eleven ska se hur långt
 * det är kvar, inte hur mycket hon presterat.
 */
export function ProgressDots({ total, cleared }: { total: number; cleared: number }) {
  return (
    <div className="flex items-center gap-1.5" role="img" aria-label={`${cleared} av ${total} klara`}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            'h-3 w-3 rounded-full transition-colors',
            i < cleared ? 'bg-lime-500' : 'bg-ink-300 dark:bg-ink-700'
          )}
        />
      ))}
    </div>
  );
}
