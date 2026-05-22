import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered';
}

export function Card({ className, variant = 'default', children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[20px] p-5 bg-white border-[3px] border-indigo-100',
        {
          'shadow-[0_6px_0_0_rgba(99,102,241,0.2)]': variant === 'default',
          'shadow-[0_8px_0_0_rgba(99,102,241,0.25)]': variant === 'elevated',
          'shadow-[0_4px_0_0_rgba(99,102,241,0.15)]': variant === 'bordered',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
