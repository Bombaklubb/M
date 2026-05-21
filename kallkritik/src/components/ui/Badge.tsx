import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'muted' | 'accent';
}

export function Badge({ className, variant = 'primary', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold',
        {
          'bg-primary/20 text-primary': variant === 'primary',
          'bg-success/20 text-success': variant === 'success',
          'bg-danger/20 text-danger': variant === 'danger',
          'bg-xp/20 text-xp': variant === 'warning',
          'bg-muted text-muted-foreground': variant === 'muted',
          'bg-accent/20 text-accent': variant === 'accent',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
