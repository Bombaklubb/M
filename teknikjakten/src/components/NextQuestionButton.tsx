import { ArrowRight } from 'lucide-react';

/**
 * Knappen som tar eleven vidare efter ett svar.
 *
 * Alla frågelägen i appen väntade tidigare en dryg sekund och hoppade sedan
 * vidare av sig själv. Den som läste förklaringen hann inte klart, och den som
 * svarade snabbt fick vänta i onödan. Nu bestämmer eleven själv när nästa fråga
 * kommer, och samma knapp används överallt så att flödet känns likadant.
 */
export default function NextQuestionButton({ onClick, isLast, lastLabel = 'Se resultat' }: {
  onClick: () => void;
  /** Sant på sista frågan – då avslutar knappen i stället för att gå vidare. */
  isLast: boolean;
  lastLabel?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="btn-primary-clay w-full mt-4 py-4 flex items-center justify-center gap-2 text-base font-heading"
    >
      {isLast ? lastLabel : 'Nästa fråga'}
      <ArrowRight size={18} aria-hidden="true" />
    </button>
  );
}
