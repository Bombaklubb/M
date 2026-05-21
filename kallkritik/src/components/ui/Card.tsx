import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered';
}

export function Card({ className, variant = 'default', children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl p-5',
        {
          'bg-card text-card-foreground': variant === 'default',
          'bg-card text-card-foreground shadow-xl': variant === 'elevated',
          'bg-card text-card-foreground border border-border': variant === 'bordered',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
