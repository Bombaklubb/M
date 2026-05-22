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
        'clay-btn inline-flex items-center justify-center font-extrabold rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer',
        {
          'bg-indigo-600 text-white border-indigo-700 shadow-[0_5px_0_0_rgba(67,56,202,0.8)] hover:shadow-[0_7px_0_0_rgba(67,56,202,0.8)] active:shadow-[0_2px_0_0_rgba(67,56,202,0.8)]': variant === 'primary',
          'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-[0_5px_0_0_rgba(199,210,254,1)] hover:shadow-[0_7px_0_0_rgba(199,210,254,1)] active:shadow-[0_2px_0_0_rgba(199,210,254,1)]': variant === 'secondary',
          'bg-transparent text-gray-600 border-gray-200 shadow-[0_5px_0_0_rgba(229,231,235,1)] hover:shadow-[0_7px_0_0_rgba(229,231,235,1)] active:shadow-[0_2px_0_0_rgba(229,231,235,1)]': variant === 'ghost',
          'bg-emerald-500 text-white border-emerald-600 shadow-[0_5px_0_0_rgba(21,128,61,0.7)] hover:shadow-[0_7px_0_0_rgba(21,128,61,0.7)] active:shadow-[0_2px_0_0_rgba(21,128,61,0.7)]': variant === 'success',
          'bg-rose-500 text-white border-rose-600 shadow-[0_5px_0_0_rgba(190,18,60,0.7)] hover:shadow-[0_7px_0_0_rgba(190,18,60,0.7)] active:shadow-[0_2px_0_0_rgba(190,18,60,0.7)]': variant === 'danger',
          'bg-white text-indigo-700 border-indigo-300 shadow-[0_5px_0_0_rgba(165,180,252,0.8)] hover:shadow-[0_7px_0_0_rgba(165,180,252,0.8)] active:shadow-[0_2px_0_0_rgba(165,180,252,0.8)]': variant === 'outline',
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
      style={{ fontFamily: "'Baloo 2', sans-serif" }}
      {...props}
    >
      {children}
    </button>
  );
}
