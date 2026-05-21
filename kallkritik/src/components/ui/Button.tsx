import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed select-none',
        {
          'bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20': variant === 'primary',
          'bg-secondary text-secondary-foreground hover:bg-muted': variant === 'secondary',
          'bg-transparent text-foreground hover:bg-muted': variant === 'ghost',
          'bg-success text-success-foreground hover:opacity-90 shadow-lg shadow-success/20': variant === 'success',
          'bg-danger text-danger-foreground hover:opacity-90 shadow-lg shadow-danger/20': variant === 'danger',
          'border border-border text-foreground hover:bg-muted': variant === 'outline',
        },
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2.5 text-sm': size === 'md',
          'px-6 py-3 text-base': size === 'lg',
          'px-8 py-4 text-lg': size === 'xl',
        },
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
