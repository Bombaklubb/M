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
          50:  '#e8f6fe',
          100: '#c9ecfd',
          200: '#93d9fb',
          300: '#5fc6f9',
          400: '#38bdf8',
          500: '#1b80c2',
          600: '#166aa2',
          700: '#0e375d',
          800: '#02162f',
          900: '#00040e',
        },
        // Rymdpaletten, hämtad ur startsidans bakgrundsbild
        space: {
          950: '#00040e',
          900: '#030c1c',
          800: '#02162f',
          700: '#0e375d',
          600: '#2b4662',
          500: '#487094',
          300: '#90b2cc',
        },
        beam: {
          DEFAULT: '#1b80c2',
          bright: '#38bdf8',
        },
        gold: {
          DEFAULT: '#f5b642',
          dark: '#7c4a03',
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
        'bounce-in':  'bounceIn 0.5s ease-out',
        'fade-in':    'fadeIn 0.3s ease-in',
        'slide-up':   'slideUp 0.4s ease-out',
        'star-pop':   'starPop 0.6s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'clay-press': 'clayPress 200ms ease-out',
      },
      keyframes: {
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
        clayPress: {
          '0%':   { transform: 'scale(1) translateY(0)' },
          '50%':  { transform: 'scale(0.97) translateY(2px)' },
          '100%': { transform: 'scale(1) translateY(0)' },
        },
      },
      boxShadow: {
        'clay':       '0 4px 0 rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.1)',
        'clay-lg':    '0 6px 0 rgba(0,0,0,0.12), 0 12px 32px rgba(0,0,0,0.12)',
        'clay-press': '0 2px 0 rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
