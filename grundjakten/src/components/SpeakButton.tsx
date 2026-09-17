import { Volume2 } from 'lucide-react';
import type { SpeechToken } from '@/types';
import { cn } from '@/lib/utils';
import { useSpeak } from '@/hooks/useSpeak';

interface Props {
  token: SpeechToken;
  size?: 'sm' | 'lg' | 'xl';
  label: string;
  className?: string;
}

/**
 * Öronknappen. Finns på varje skärm i appen.
 *
 * `label` är aria-label – den enda texten på knappen är ikonen, eftersom
 * målgruppen inte kan läsa. Skärmläsare och lärare får texten ändå.
 */
export function SpeakButton({ token, size = 'lg', label, className }: Props) {
  const { speaking, speak } = useSpeak();

  const sizes = {
    sm: 'w-14 h-14 text-xl',
    lg: 'w-20 h-20 text-3xl',
    xl: 'w-28 h-28 text-5xl',
  };

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => void speak(token)}
      className={cn(
        'btn-pop grid place-items-center rounded-full bg-aqua-500 text-white',
        'border-aqua-700 hover:bg-aqua-400',
        sizes[size],
        speaking && 'animate-ear-pulse',
        className
      )}
    >
      <Volume2 className="w-1/2 h-1/2" strokeWidth={2.5} aria-hidden />
    </button>
  );
}
