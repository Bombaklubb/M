import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'muted' | 'accent';
}

export function Badge({ className, variant = 'primary', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border-2',
        {
          'bg-indigo-100 text-indigo-700 border-indigo-300': variant === 'primary',
          'bg-emerald-100 text-emerald-700 border-emerald-300': variant === 'success',
          'bg-rose-100 text-rose-700 border-rose-300': variant === 'danger',
          'bg-amber-100 text-amber-700 border-amber-300': variant === 'warning',
          'bg-gray-100 text-gray-600 border-gray-200': variant === 'muted',
          'bg-cyan-100 text-cyan-700 border-cyan-300': variant === 'accent',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
