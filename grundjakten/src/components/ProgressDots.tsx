import { cn } from '@/lib/utils';

/**
 * Framsteg som prickar, inte som siffror.
 *
 * Medvetet inget "3/8" och ingen procent: den här eleven ska se hur långt
 * det är kvar, inte hur mycket hon presterat.
 *
 * Prickarna är ORANGE, inte gröna. Grönt betyder "rätt" överallt annars i
 * appen – blixten, pilen, den bemästrade bokstaven – och prickarna säger
 * inte det. De säger *besvarad*, och en fråga eleven behövde hjälp med
 * räknas lika mycket som en hon tog direkt. Det följer husregeln: visa vad
 * hon klarat, aldrig hur många fel hon haft.
 *
 * De är också större än förut. En prick på 12 px syns inte på en Chromebook
 * på armlängds avstånd, och mätaren är det enda som säger hur långt kvar
 * det är.
 */
export function ProgressDots({ total, cleared }: { total: number; cleared: number }) {
  return (
    <div
      className="flex items-center gap-1.5 sm:gap-2"
      role="img"
      aria-label={`${cleared} av ${total} klara`}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            'h-4 w-4 rounded-full transition-colors sm:h-5 sm:w-5',
            i < cleared ? 'bg-amberx-500' : 'bg-ink-300 dark:bg-ink-700'
          )}
        />
      ))}
    </div>
  );
}
