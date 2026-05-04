/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        // Subject themes
        historia: {
          light: '#fef3c7',
          DEFAULT: '#f59e0b',
          dark: '#92400e',
          bg: '#fffbeb',
        },
        geografi: {
          light: '#d1fae5',
          DEFAULT: '#10b981',
          dark: '#064e3b',
          bg: '#ecfdf5',
        },
        religion: {
          light: '#ede9fe',
          DEFAULT: '#8b5cf6',
          dark: '#4c1d95',
          bg: '#f5f3ff',
        },
        samhalle: {
          light: '#dbeafe',
          DEFAULT: '#3b82f6',
          dark: '#1e3a8a',
          bg: '#eff6ff',
        },
        gold: {
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
      },
      fontFamily: {
        heading: ['Fredoka', 'Nunito', 'system-ui', 'sans-serif'],
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'bounce-in':       'bounceIn 0.5s ease-out',
        'fade-in':         'fadeIn 0.3s ease-in',
        'slide-up':        'slideUp 0.4s ease-out',
        'star-pop':        'starPop 0.6s ease-out',
        'pulse-slow':      'pulse 3s infinite',
        'legendaryPulse':  'legendaryPulse 3s ease-in-out infinite',
        'shimmer':         'shimmer 2s linear infinite',
        'twinkle':         'twinkle 3s ease-in-out infinite',
        'float':           'float 6s ease-in-out infinite',
        'clay-press':      'clayPress 200ms ease-out',
        // Magic UI
        'meteor':          'meteor 5s linear infinite',
        'shimmer-slide':   'shimmer-slide 3s linear infinite',
        'gradient-shift':  'gradient-shift 3s linear infinite',
        'border-beam':     'border-beam calc(var(--duration)*1s) infinite linear',
      },
      keyframes: {
        legendaryPulse: {
          '0%, 100%': { boxShadow: '0 4px 28px rgba(251,191,36,0.25)', borderColor: 'rgba(251,191,36,0.5)' },
          '50%':       { boxShadow: '0 4px 36px rgba(251,191,36,0.55)', borderColor: 'rgba(251,191,36,0.9)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceIn: {
          '0%':   { transform: 'scale(0.3)', opacity: '0' },
          '50%':  { transform: 'scale(1.05)' },
          '70%':  { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        starPop: {
          '0%':   { transform: 'scale(0) rotate(-30deg)', opacity: '0' },
          '60%':  { transform: 'scale(1.3) rotate(10deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.15', transform: 'scale(1)' },
          '50%':      { opacity: '0.9', transform: 'scale(1.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        clayPress: {
          '0%':   { transform: 'scale(1) translateY(0)' },
          '50%':  { transform: 'scale(0.97) translateY(2px)' },
          '100%': { transform: 'scale(1) translateY(0)' },
        },
        meteor: {
          '0%':   { transform: 'rotate(var(--angle, 215deg)) translateX(0)', opacity: '1' },
          '70%':  { opacity: '1' },
          '100%': { transform: 'rotate(var(--angle, 215deg)) translateX(-500px)', opacity: '0' },
        },
        'shimmer-slide': {
          '0%':   { transform: 'translateX(-100%) rotate(0deg)' },
          '100%': { transform: 'translateX(100%) rotate(0deg)' },
        },
        'gradient-shift': {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'border-beam': {
          '100%': { offsetDistance: '100%' },
        },
      },
      boxShadow: {
        'clay':   '0 4px 0 rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.1)',
        'clay-lg': '0 6px 0 rgba(0,0,0,0.12), 0 12px 32px rgba(0,0,0,0.12)',
        'clay-press': '0 2px 0 rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1)',
        'subject-historia': '0 6px 0 #b45309, 0 8px 24px rgba(245,158,11,0.3)',
        'subject-geografi':  '0 6px 0 #065f46, 0 8px 24px rgba(16,185,129,0.3)',
        'subject-religion':  '0 6px 0 #5b21b6, 0 8px 24px rgba(139,92,246,0.3)',
        'subject-samhalle':  '0 6px 0 #1e40af, 0 8px 24px rgba(59,130,246,0.3)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
